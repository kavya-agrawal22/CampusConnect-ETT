import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserDto, JwtAuthResponse } from '@/types';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  role: "ADMIN" | "USER" | null;
  login: (response: JwtAuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser) as UserDto;
      setToken(savedToken);
      setUser(parsedUser);
      setIsAuthenticated(true);
      
      // Determine role
      if (parsedUser.roles.includes('ROLE_ADMIN')) {
        setRole('ADMIN');
      } else {
        setRole('USER');
      }
    }
  }, []);

  const login = (response: JwtAuthResponse) => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    
    // Determine role
    if (response.user.roles.includes('ROLE_ADMIN')) {
      setRole('ADMIN');
    } else {
      setRole('USER');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, role, login, logout }}>
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
