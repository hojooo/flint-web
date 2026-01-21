import { apiClient } from './client';

export interface SocialVerifyRequest {
  provider: 'KAKAO';
  code?: string;
  accessToken?: string;
}

export interface AuthResponse {
  isRegistered: boolean;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  nickname?: string;
  tempToken?: string;
}

export interface SignupRequest {
  tempToken: string;
  nickname: string;
  favoriteContentIds: number[];
  subscribedOttIds: number[];
}

export interface DevLoginRequest {
  userId: number;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export const authApi = {
  socialVerify: async (data: SocialVerifyRequest) => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/social/verify', data);
    return response.data.data;
  },

  signup: async (data: SignupRequest) => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/signup', data);
    return response.data.data;
  },

  logout: async (refreshToken: string) => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  // 개발용 로그인 - userId만으로 토큰 발급
  devLogin: async (data: DevLoginRequest) => {
    const response = await apiClient.post<{ data: AuthTokenResponse }>('/auth/dev/login', data);
    return response.data.data;
  },
};
