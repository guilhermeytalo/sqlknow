'use client';
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/user/me').then(res => setUser(res.data));
    }
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post('/auth/signin', { email, password });
    const { token } = res.data.response;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const userInfo = await api.get('/user/me');
    setUser(userInfo.data);
    router.push('/dictionary');
  };

  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);