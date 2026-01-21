import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';

// Kakao OAuth 설정 - 실제 값으로 교체 필요
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID || 'YOUR_KAKAO_CLIENT_ID';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/oauth/callback`;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'kakao' | 'dev'>('dev');

  // 개발용 로그인 - userId만 입력
  const [userId, setUserId] = useState('');

  // 이미 로그인되어 있으면 홈으로 이동
  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleDevLogin = async () => {
    if (!userId.trim()) {
      setError('User ID를 입력해주세요');
      return;
    }

    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      setError('User ID는 숫자여야 합니다');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.devLogin({ userId: userIdNum });
      login(response.accessToken, response.refreshToken, response.userId);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('로그인에 실패했습니다. User ID를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Flint</h1>
          <p className="text-gray-500 text-center mb-8">컬렉션을 만들고 공유하세요</p>

          {/* 로그인 모드 탭 */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginMode('dev')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                loginMode === 'dev'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              개발용 로그인
            </button>
            <button
              onClick={() => setLoginMode('kakao')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                loginMode === 'kakao'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              카카오 로그인
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loginMode === 'kakao' ? (
            <button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 2C5.029 2 1 5.129 1 9c0 2.394 1.525 4.493 3.868 5.751-.17.633-.617 2.292-.707 2.647-.11.433.16.428.336.311.138-.092 2.2-1.493 3.085-2.095.456.067.927.102 1.418.102 4.971 0 9-3.129 9-7s-4.029-7-9-7z"
                  fill="#000"
                />
              </svg>
              카카오로 로그인
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="DB에 저장된 사용자 ID (숫자)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDevLogin()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleDevLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
              <p className="text-xs text-gray-500 text-center">
                DB에 저장된 사용자의 ID를 입력하면 토큰이 발급됩니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
