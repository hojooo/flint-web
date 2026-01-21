import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setError('인증 코드가 없습니다.');
      return;
    }

    const verifyCode = async () => {
      try {
        const response = await authApi.socialVerify({
          provider: 'KAKAO',
          code,
        });

        if (response.isRegistered && response.accessToken && response.refreshToken && response.userId) {
          login(response.accessToken, response.refreshToken, response.userId, response.nickname);
          navigate('/');
        } else if (response.tempToken) {
          localStorage.setItem('tempToken', response.tempToken);
          navigate('/signup');
        }
      } catch (err) {
        console.error('OAuth callback failed:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    };

    verifyCode();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
