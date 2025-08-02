/**
 * API Authentication Hook
 * Handles token management and authentication state
 */

import { useState, useEffect } from 'react';
import { apiClient, AuthAPI, UsersAPI, User } from '@/lib/api/services';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useApiAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          // Try to fetch user data
          const user = await UsersAPI.getCurrentUser();
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await AuthAPI.login({ email, password });
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        error: null
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const user = await AuthAPI.register(userData);
      
      // After registration, user still needs to login
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    logout,
    register,
    clearError
  };
};

export default useApiAuth;
