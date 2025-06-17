'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api/api';

type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  organization?: string;
  position?: string;
};

// Define registration data type
type RegisterUserData = {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type: string;
  organization?: string;
  position?: string;
  phone_number?: string;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await authAPI.getUser();
          
          // Transform backend user data to our frontend format
          const userData = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            userType: response.data.user_type,
            organization: response.data.organization,
            position: response.data.position,
          };
          
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
    const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { access } = response.data;
      
      // Store token in localStorage for client-side access
      localStorage.setItem('token', access);
      
      // Set token in a cookie for server-side access
      // 7 days expiry in seconds
      document.cookie = `token=${access}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      
      setToken(access);
      
      // Fetch user data after successful login
      const userResponse = await authAPI.getUser();
      
      // Transform backend user data to our frontend format
      const userData = {
        id: userResponse.data.id,
        username: userResponse.data.username,
        email: userResponse.data.email,
        firstName: userResponse.data.first_name,
        lastName: userResponse.data.last_name,
        userType: userResponse.data.user_type,
        organization: userResponse.data.organization,
        position: userResponse.data.position,
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  const register = async (userData: RegisterUserData) => {
    try {
      console.log("AuthContext: Starting registration with data:", { ...userData, password: "***", password2: "***" });
      const response = await authAPI.register(userData);
      console.log("AuthContext: Registration API response:", response);
      
      // After registration, login automatically
      console.log("AuthContext: Auto-login after registration");
      await login(userData.email, userData.password);
      console.log("AuthContext: Auto-login successful");
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      console.error('AuthContext: Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  };
    const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Clear token cookie by setting expiry in the past
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    setToken(null);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
