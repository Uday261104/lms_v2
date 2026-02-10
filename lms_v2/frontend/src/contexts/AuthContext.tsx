import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isCreator: boolean;
  userRole: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      const role = authService.getUserRole();
      setUserRole(role);
      setIsCreator(authService.isCreator());
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user_role', response.role);
    localStorage.setItem('user_email', response.email);
    localStorage.setItem('user_name', response.user_name);
    setIsAuthenticated(true);
    setUserRole(response.role);
    setIsCreator(response.role === 'CREATOR');
  };

  const register = async (data: RegisterData) => {
    await authService.register(data);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsCreator(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isCreator, userRole, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
