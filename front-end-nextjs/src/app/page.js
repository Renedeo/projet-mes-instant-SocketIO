"use client"
// pages/Login.js

import { useState } from 'react';
import Link from 'next/link';
import { useSocket } from '@/Context/SocketContext';
import { useAuth } from '@/Context/AuthContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const socket = useSocket()
  const route = useRouter()
  const { login } = useAuth()

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoyez les données de connexion au backend (utilisez fetch, axios, etc.)
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom: username, motDePasse: password }),
      });

      const data = await response.json();

      // Gérez la réponse du backend ici
      if (response.ok) {
        console.log('Connexion réussie !');
        socket.emit('login', {"username" : username})
        socket.on('newUser',(data) => {
          login(data) 
        })
        
        route.push('/chat');
        // Rediriger ou effectuer d'autres actions après la connexion réussie
      } else {
        console.error('Échec de la connexion :', data.message);
        // Mettez à jour le message d'erreur pour l'afficher dans l'interface utilisateur
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
      // Mettez à jour le message d'erreur pour l'afficher dans l'interface utilisateur
      setErrorMessage('Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Connexion</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className='container-input'>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nom d'utilisateur:"
              value={username}
              onChange={handleUsernameChange}
            />
            <label htmlFor="username"><span>Nom d'utilisateur:</span></label>
          </div>
          <div className='container-input'>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Mot de passe:'
              value={password}
              onChange={handlePasswordChange}
            />
            <label htmlFor="password"><span>Mot de passe:</span></label>
          </div>
          <button type="submit" className="btn">Se connecter</button>
        {/* Add a Link to the Register page */}
        <p>Vous n'avez pas de compte? <Link href="/register">S'inscrire</Link></p>
        </form>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default Login;
