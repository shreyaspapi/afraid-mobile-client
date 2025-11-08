/**
 * Authentication Provider
 * Manages authentication state and provides auth context
 */

import { authService } from '@/src/services/auth.service';
import { storageService } from '@/src/services/storage.service';
import type { UnraidCredentials } from '@/src/types/unraid.types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  credentials: UnraidCredentials | null;
  login: (credentials: UnraidCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<UnraidCredentials | null>(null);

  const checkAuth = async () => {
    try {
      // Check if we're in demo mode
      const isDemoMode = await storageService.isDemoMode();
      
      if (isDemoMode) {
        console.log('Auth: Demo mode detected');
        // Set global flag for demo mode
        global.__DEMO_MODE__ = true;
        setIsAuthenticated(true);
        setCredentials({ serverIP: 'demo', apiKey: 'demo' });
        setIsLoading(false);
        return;
      }

      // Ensure demo mode is disabled
      global.__DEMO_MODE__ = false;

      const isLoggedIn = await authService.isLoggedIn();
      const storedCredentials = await storageService.getCredentials();
      
      setIsAuthenticated(isLoggedIn);
      setCredentials(storedCredentials);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsAuthenticated(false);
      setCredentials(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (newCredentials: UnraidCredentials) => {
    await storageService.saveCredentials(newCredentials);
    setCredentials(newCredentials);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Starting logout...');
      
      // Clear demo mode if active
      await storageService.clearDemoMode();
      
      await authService.logout();
      console.log('AuthProvider: Credentials cleared');
      setCredentials(null);
      setIsAuthenticated(false);
      console.log('AuthProvider: State updated');
    } catch (error) {
      console.error('AuthProvider: Logout error:', error);
      // Even if there's an error, clear the state
      setCredentials(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        credentials,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

