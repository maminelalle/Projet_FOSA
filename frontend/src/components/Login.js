// import React, { useState } from 'react';
// import axios from 'axios';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://127.0.0.1:8000/api/auth/token/', {
//         username,
//         password
//       });
//       localStorage.setItem('access_token', res.data.access);
//       localStorage.setItem('refresh_token', res.data.refresh);
//       alert('Connecté avec succès !');
//       window.location.href = '/fosas';
//     } catch (err) {
//       console.error(err);
//       alert('Identifiants invalides');
//     }
//   };

//   return (
//     <div className="login-form">
//       <h2>Connexion</h2>
//       <form onSubmit={handleLogin}>
//         <input type="text" placeholder="Nom d'utilisateur"
//                value={username} onChange={e => setUsername(e.target.value)} required />
//         <input type="password" placeholder="Mot de passe"
//                value={password} onChange={e => setPassword(e.target.value)} required />
//         <button type="submit">Se connecter</button>
//       </form>
//       <p>
//         ➕ <a href="http://127.0.0.1:8000/api/auth/register/" target="_blank" rel="noopener noreferrer">
//           Créer un compte
//         </a>
//       </p>
//     </div>
//   );
// }

// export default Login;





import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/token/', {
        username,
        password
      });
      localStorage.setItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNjI3NTA1LCJpYXQiOjE3NTI2MjcyMDUsImp0aSI6Ijc3ZjBiNjQwN2ZjMTQ0MTdiZjlhMDMxN2I3ZWU0NjFhIiwidXNlcl9pZCI6MX0.NC39tjlFR9ko2TistXi2fkmqy4Pyllc2xrMHB9q694Q', res.data.access);
      localStorage.setItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjcxMzYwNSwiaWF0IjoxNzUyNjI3MjA1LCJqdGkiOiI2YzQ2YWU4Mjk4OGE0ZTFjYTZhOTgzMjZlNzA4YWRjMCIsInVzZXJfaWQiOjF9.ruPPjNAYO4svzUsJFoDzsiUPhpjVk868COBHK6SL3cE', res.data.refresh);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Rapport</h1>
            <p>Système de gestion des FOSA</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Nom d'utilisateur"
                required 
              />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mot de passe"
                required 
              />
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Mot de passe oublié ?</a>
            </div>

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <p>Pas de compte? <a href="/register">Créer un compte</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;