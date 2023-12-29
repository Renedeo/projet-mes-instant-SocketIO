"use client"
// AuthContext.js

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const login = (userData) => {
    setUser(userData.username);
    setIsAuthenticated(true);

    // Ajoute l'utilisateur à la liste des utilisateurs connectés
    setConnectedUsers((prevUsers) => [...prevUsers, userData.username]);
  };

  const logout = () => {
    // Supprime l'utilisateur de la liste des utilisateurs connectés
    setConnectedUsers((prevUsers) =>
      prevUsers.filter((username) => username !== user)
    );

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, connectedUsers, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
