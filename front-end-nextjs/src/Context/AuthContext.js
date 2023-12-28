"use client"
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // You can store user data here
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    // Perform login logic, set user data, and update isAuthenticated state
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Perform logout logic, reset user data, and update isAuthenticated state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
