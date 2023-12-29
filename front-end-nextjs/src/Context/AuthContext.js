"use client"


import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const socket = useSocket()

  useEffect(() => {
    // Charge les données de session à partir du sessionStorage lors du montage du composant
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const storedIsAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (storedUser && storedIsAuthenticated) {
      setUser(storedUser);
      setIsAuthenticated(storedIsAuthenticated);
    }

    if (socket) {
      // Écoute l'événement 'newUser' pour mettre à jour la liste des utilisateurs connectés
      const handleNewUser = (data) => {
        setConnectedUsers(data);
      };

      const handleUserOut = (data) => {
        console.log(data);
        setConnectedUsers(data);
      };

      socket.on('userOut', handleUserOut);
      socket.on('newUser', handleNewUser);
      
      // Nettoie l'écouteur lorsque le composant est démonté
      return () => {
        socket.off('userOut', handleUserOut);
        socket.off('newUser', handleNewUser);
      };
    }
  }, [socket]);

  const login = (userData) => {
    setUser(userData.username);
    setIsAuthenticated(true);

    sessionStorage.setItem('user', JSON.stringify(userData.username));
    sessionStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {

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
