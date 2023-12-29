"use client"


import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    // Charge les données de session à partir du sessionStorage lors du montage du composant
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const storedIsAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (storedUser && storedIsAuthenticated) {
      setUser(storedUser);
      setIsAuthenticated(storedIsAuthenticated);
    }
  }, []);

  const login = (userData) => {
    setUser(userData.username);
    setIsAuthenticated(true);

    // Ajoute l'utilisateur à la liste des utilisateurs connectés
    setConnectedUsers((prevUsers) => [...prevUsers, userData.username]);

    // Sauvegarde les données de session dans le sessionStorage lors de la connexion
    sessionStorage.setItem('user', JSON.stringify(userData.username));
    sessionStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    // Supprime l'utilisateur de la liste des utilisateurs connectés
    setConnectedUsers((prevUsers) =>
      prevUsers.filter((username) => username !== user)
    );

    setUser(null);
    setIsAuthenticated(false);

    // Supprime les données de session du sessionStorage lors de la déconnexion
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
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
