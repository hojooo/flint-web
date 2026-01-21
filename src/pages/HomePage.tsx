import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Flint</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              ID: {user?.userId}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {/* 컬렉션 생성 카드 */}
          <button
            onClick={() => navigate('/collections/create')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">새 컬렉션 만들기</h2>
                <p className="text-sm text-gray-500">좋아하는 작품들을 모아 컬렉션을 만들어보세요</p>
              </div>
            </div>
          </button>

          {/* 내 컬렉션 보기 카드 */}
          <button
            onClick={() => navigate('/collections')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">컬렉션 둘러보기</h2>
                <p className="text-sm text-gray-500">다른 사용자들의 컬렉션을 구경해보세요</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
