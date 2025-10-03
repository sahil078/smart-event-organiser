import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface User {
  id?: string;
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

const TOKEN_KEY = 'authToken';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (stored) {
          setToken(stored);
          api.defaults.headers.Authorization = `Bearer ${stored}`;
          await verifyToken(stored);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const verifyToken = async (tk: string) => {
    try {
      const res = await api.post('/auth/verify', {}, {
        headers: { Authorization: `Bearer ${tk}` }
      });
      setUser(res.data.user);
    } catch (err: any) {
      console.warn('[Auth] verify failed', err?.response?.status, err?.response?.data || err?.message);
      // Only wipe token if server says unauthorized
      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
        delete api.defaults.headers.Authorization;
      }
    }
  };

  const login = async (email: string) => {
    const res = await api.post('/auth/login', { email });
    const tk: string = res.data.token;
    await AsyncStorage.setItem(TOKEN_KEY, tk);
    api.defaults.headers.Authorization = `Bearer ${tk}`;
    setToken(tk);
    setUser(res.data.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};