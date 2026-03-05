"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  company_name: string;
  company_website: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin?: boolean;
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user && !!token;

  // Check if token is expired
  const isTokenExpired = (): boolean => {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return true;
    
    return new Date().getTime() > parseInt(expiration);
  };

  // Clear auth data
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token_expiration');
    
    // Clear credit-related data on logout
    localStorage.removeItem('cti_credits');
    localStorage.removeItem('cti_credits_history');
    localStorage.removeItem('cti_unlocked_features');
    localStorage.removeItem('cti_last_daily');
    localStorage.removeItem('cti_last_weekly');
  };

  // Fetch user profile with token
  const fetchUserProfile = async (authToken: string): Promise<User | null> => {
    try {
      console.log('🔍 Fetching user profile with token:', authToken.substring(0, 20) + '...');
      const userData = await authApi.getCurrentUser();
      console.log('✅ User profile received:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      return null;
    }
  };

  // Check authentication status on mount
  const checkAuth = async () => {
    setIsLoading(true);
    
    const storedToken = localStorage.getItem('access_token');
    
    if (!storedToken || isTokenExpired()) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    try {
      const userProfile = await fetchUserProfile(storedToken);
      if (userProfile) {
        setUser(userProfile);
        setToken(storedToken);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('🔐 Starting login for:', email);
    
    try {
      const data = await authApi.login(email, password);
      console.log('📡 Login response:', { data });

      // Store token
      setToken(data.access_token);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      
      // Store token expiration
      const expirationTime = new Date().getTime() + (data.expires_in * 1000);
      localStorage.setItem('token_expiration', expirationTime.toString());
      console.log('💾 Token stored, expires at:', new Date(expirationTime));

      // Fetch user profile
      const userProfile = await fetchUserProfile(data.access_token);
      if (userProfile) {
        setUser(userProfile);
        console.log('✅ Login successful, user set:', userProfile);
      } else {
        console.error('❌ Failed to fetch user profile after login');
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint (optional, for server-side cleanup)
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    if (!token) return;

    try {
      // This would be implemented if we had a refresh token endpoint
      // For now, we'll just check if the current token is still valid
      const userProfile = await fetchUserProfile(token);
      if (!userProfile) {
        clearAuth();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up token refresh check
  useEffect(() => {
    if (!token) return;

    const checkInterval = setInterval(() => {
      if (isTokenExpired()) {
        clearAuth();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [token]);

  // Route protection
  useEffect(() => {
    console.log('🛡️ Route protection check:', {
      isLoading,
      isAuthenticated,
      pathname,
      user: !!user,
      token: !!token
    });
    
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
        console.log('🔄 Redirecting to login - not authenticated');
        router.push('/login');
      } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        console.log('🏠 Redirecting to home - already authenticated');
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading state
  if (isLoading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
