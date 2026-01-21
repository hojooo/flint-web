import { useState, useEffect, useCallback } from 'react';

interface User {
  userId: string;
  nickname: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const nickname = localStorage.getItem('nickname');

    if (accessToken && userId) {
      setUser({ userId, nickname: nickname || '' });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, userId: string, nickname?: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', userId);
    if (nickname) {
      localStorage.setItem('nickname', nickname);
    }
    setUser({ userId, nickname: nickname || '' });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    setUser(null);
  }, []);

  const isLoggedIn = !!user;

  return { user, isLoggedIn, isLoading, login, logout };
}
