import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionApi, type ContentItem } from '../api/collection';
import { contentApi, type Content } from '../api/content';
import { useAuth } from '../hooks/useAuth';

export function CreateCollectionPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedContents, setSelectedContents] = useState<(Content & { reason: string; isSpoiler: boolean })[]>([]);

  // 검색 관련 state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const result = await contentApi.search(searchKeyword);
      setSearchResults(result.contents || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError('검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddContent = (content: Content) => {
    if (selectedContents.some(c => c.contentId === content.contentId)) {
      return;
    }
    if (selectedContents.length >= 10) {
      setError('컬렉션에는 최대 10개의 작품만 추가할 수 있습니다.');
      return;
    }
    setSelectedContents([...selectedContents, { ...content, reason: '', isSpoiler: false }]);
    setShowSearch(false);
    setSearchKeyword('');
    setSearchResults([]);
  };

  const handleRemoveContent = (contentId: string) => {
    setSelectedContents(selectedContents.filter(c => c.contentId !== contentId));
  };

  const handleUpdateReason = (contentId: string, reason: string) => {
    setSelectedContents(selectedContents.map(c =>
      c.contentId === contentId ? { ...c, reason } : c
    ));
  };

  const handleUpdateSpoiler = (contentId: string, isSpoiler: boolean) => {
    setSelectedContents(selectedContents.map(c =>
      c.contentId === contentId ? { ...c, isSpoiler } : c
    ));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('컬렉션 제목을 입력해주세요.');
      return;
    }
    if (selectedContents.length === 0) {
      setError('최소 1개 이상의 작품을 추가해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const contentList: ContentItem[] = selectedContents.map(c => ({
        contentId: c.contentId,
        isSpoiler: c.isSpoiler,
        reason: c.reason,
      }));

      await collectionApi.create({
        title,
        description,
        isPublic,
        contentList,
      });

      navigate('/');
    } catch (err) {
      console.error('Create collection failed:', err);
      setError('컬렉션 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">새 컬렉션</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '생성 중...' : '완료'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="컬렉션 제목 (최대 20자)"
              maxLength={20}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="컬렉션에 대한 설명 (최대 200자)"
              maxLength={200}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 공개 설정 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">공개 설정</span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 작품 목록 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                작품 목록 ({selectedContents.length}/10)
              </label>
              <button
                onClick={() => setShowSearch(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 작품 추가
              </button>
            </div>

            {selectedContents.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">추가된 작품이 없습니다</p>
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-blue-600 hover:underline"
                >
                  작품 검색하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedContents.map((content, index) => (
                  <div key={content.contentId} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-16 h-24 bg-gray-200 rounded overflow-hidden">
                        {content.imageUrl && (
                          <img
                            src={content.imageUrl}
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs text-gray-400 mr-2">#{index + 1}</span>
                            <h3 className="font-medium text-gray-800 inline">{content.title}</h3>
                            {content.year && (
                              <span className="text-sm text-gray-500 ml-2">({content.year})</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveContent(content.contentId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={content.reason}
                          onChange={(e) => handleUpdateReason(content.contentId, e.target.value)}
                          placeholder="추천 이유를 입력하세요"
                          className="mt-2 w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <label className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={content.isSpoiler}
                            onChange={(e) => handleUpdateSpoiler(content.contentId, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">스포일러 포함</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 검색 모달 */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">작품 검색</h2>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchResults([]);
                    setSearchKeyword('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="영화, 드라마, 애니메이션 검색"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSearching ? '...' : '검색'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {searchResults.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  검색어를 입력하고 검색 버튼을 눌러주세요
                </p>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((content) => {
                    const isSelected = selectedContents.some(c => c.contentId === content.contentId);
                    return (
                      <button
                        key={content.contentId}
                        onClick={() => !isSelected && handleAddContent(content)}
                        disabled={isSelected}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {content.imageUrl && (
                            <img
                              src={content.imageUrl}
                              alt={content.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{content.title}</h3>
                          {content.year && (
                            <p className="text-sm text-gray-500">{content.year}</p>
                          )}
                        </div>
                        {isSelected && (
                          <span className="text-xs text-gray-400">추가됨</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
