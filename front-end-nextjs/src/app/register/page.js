"use client"
import { useState } from 'react';
import Link from 'next/link';

const Register = () => {
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNomChange = (e) => {
    setNom(e.target.value);
    setErrorMessage('');
  };

  const handleMotDePasseChange = (e) => {
    setMotDePasse(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, motDePasse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 400 && errorData.message === 'Cet utilisateur existe déjà') {
          // User already exists
          setErrorMessage('Cet utilisateur existe déjà. Veuillez utiliser un nom d\'utilisateur différent.');
        } else {
          // Other registration error
          console.error('Registration failed:', errorData);
          setErrorMessage('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
        }
        
        return;
      }

      // Assuming your backend returns a success message
      // const responseData = await response.json();

      // Redirect or perform other actions upon successful registration
    } catch (error) {
      // Handle registration error
      console.error('Registration failed:', error);
      setErrorMessage('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
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
              id="nom"
              name="nom"
              placeholder="Nom d'utilisateur:"
              value={nom}
              onChange={handleNomChange}
            />
            <label htmlFor="nom"><span>Nom d'utilisateur:</span></label>
          </div>
          <div className='container-input'>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              placeholder='Mot de passe:'
              value={motDePasse}
              onChange={handleMotDePasseChange}
            />
            <label htmlFor="motDePasse"><span>Mot de passe:</span></label>
          </div>
          <button type="submit" className="btn">S'inscrire</button>
          {/* Add a Link to the Login page */}
          <p>Vous avez déjà un compte? <Link href="/">Se connecter</Link></p>
        </form>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default Register;
