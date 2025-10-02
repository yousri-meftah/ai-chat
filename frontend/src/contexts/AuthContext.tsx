import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@/api/schemas/auth'; 


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, preferred_lang: 'en' | 'ar') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      authApi.getProfile()
        .then((profile) => {
          const profileUser: User = {
            id: 'me',
            name: profile.user.name,
            email: profile.user.email,
            memberSince: profile.user.memberSince,
            aiSummary: profile.summary,
            stats: {
              totalChats: profile.stats.totalChats,
              messagesExchanged: profile.stats.totalMessages,
              favoriteModel: profile.stats.favoriteModel,
            },
          };
          setUser(profileUser);
          localStorage.setItem('user', JSON.stringify(profileUser));
        })
        .finally(() => setIsLoading(false));
      return;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const tokenRes = await authApi.login({ email, password });
    localStorage.setItem('authToken', tokenRes.access_token);

    try {
      const profile = await authApi.getProfile();
      const profileUser: User = {
        id: 'me',
        name: profile.user.name,
        email: profile.user.email,
        memberSince: profile.user.memberSince,
        aiSummary: profile.summary,
        stats: {
          totalChats: profile.stats.totalChats,
          messagesExchanged: profile.stats.totalMessages,
          favoriteModel: profile.stats.favoriteModel,
        },
      };
      setUser(profileUser);
      localStorage.setItem('user', JSON.stringify(profileUser));
    } catch {
      const minimalUser: User = {
        id: 'me',
        name: email.split('@')[0],
        email,
        memberSince: new Date().toISOString(),
      };
      setUser(minimalUser);
      localStorage.setItem('user', JSON.stringify(minimalUser));
    }
  };

  const signup = async (email: string, password: string, preferred_lang: 'en' | 'ar') => {
    const tokenRes = await authApi.signup({ email, password, preferred_lang });
    localStorage.setItem('authToken', tokenRes.access_token);
    try {
      const profile = await authApi.getProfile();
      const profileUser: User = {
        id: 'me',
        name: profile.user.name,
        email: profile.user.email,
        memberSince: profile.user.memberSince,
        aiSummary: profile.summary,
        stats: {
          totalChats: profile.stats.totalChats,
          messagesExchanged: profile.stats.totalMessages,
          favoriteModel: profile.stats.favoriteModel,
        },
      };
      setUser(profileUser);
      localStorage.setItem('user', JSON.stringify(profileUser));
    } catch {
      const minimalUser: User = {
        id: 'me',
        name: email.split('@')[0],
        email,
        memberSince: new Date().toISOString(),
      };
      setUser(minimalUser);
      localStorage.setItem('user', JSON.stringify(minimalUser));
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
