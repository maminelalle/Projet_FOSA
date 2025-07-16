import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LanguageContext from '../context/LanguageContext';
import '../styles/dashboard.css';

const Dashboard = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const username = localStorage.getItem('username') || 'Admin';
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang } = useContext(LanguageContext);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/home')) setActiveButton('home');
    else if (path.includes('/fosas')) setActiveButton('fosas');
    else if (path.includes('/map')) setActiveButton('map');
    else if (path.includes('/add-fosa')) setActiveButton('add-fosa');
    else if (path.includes('/fosaHistory')) setActiveButton('fosaHistory');
  }, [location]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const timer = setTimeout(() => {
        searchFosas();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Bloquer bouton "précédent" navigateur pour empêcher retour après logout
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const onPopState = () => {
      window.history.pushState(null, document.title, window.location.href);
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const searchFosas = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/fosas/?search=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erreur de recherche:", error);
    }
  };

  const handleLogout = () => {
    // Remplace ici les clés par celles que tu utilises dans localStorage pour stocker tes tokens
    localStorage.removeItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNjI3NTA1LCJpYXQiOjE3NTI2MjcyMDUsImp0aSI6Ijc3ZjBiNjQwN2ZjMTQ0MTdiZjlhMDMxN2I3ZWU0NjFhIiwidXNlcl9pZCI6MX0.NC39tjlFR9ko2TistXi2fkmqy4Pyllc2xrMHB9q694Q');
    localStorage.removeItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjcxMzYwNSwiaWF0IjoxNzUyNjI3MjA1LCJqdGkiOiI2YzQ2YWU4Mjk4OGE0ZTFjYTZhOTgzMjZlNzA4YWRjMCIsInVzZXJfaWQiOjF9.ruPPjNAYO4svzUsJFoDzsiUPhpjVk868COBHK6SL3cE');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const navButtons = [
    { id: 'home', path: '/home', icon: '📊', label: lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة' },
    { id: 'fosas', path: '/fosas', icon: '🏥', label: lang === 'fr' ? 'Liste des FOSA' : 'قائمة FOSA' },
    { id: 'map', path: '/map', icon: '🗺️', label: lang === 'fr' ? 'Carte interactive' : 'خريطة تفاعلية' },
    { id: 'add-fosa', path: '/add-fosa', icon: '➕', label: lang === 'fr' ? 'Ajouter FOSA' : 'إضافة FOSA' },
    { id: 'fosaHistory', path: '/fosaHistory', icon: '🔄', label: lang === 'fr' ? 'Historique des modifications' : 'سجل التعديلات' }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder={lang === 'fr' ? "Rechercher une FOSA..." : "ابحث عن FOSA..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="user-section">
          <button 
            onClick={toggleLang} 
            className="language-toggle"
          >
            {lang === 'fr' ? 'العربية' : 'Français'}
          </button>
          <span className="username">👤 {username}</span>
          <button onClick={handleLogout} className="logout-btn">
            {lang === 'fr' ? 'Déconnexion' : 'تسجيل خروج'}
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        <aside className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            {navButtons.map((button) => (
              <Link 
                to={button.path}
                key={button.id}
                className={`nav-item ${activeButton === button.id ? 'active' : ''}`}
                onClick={() => setActiveButton(button.id)}
              >
                <span className="nav-icon">{button.icon}</span>
                {button.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="dashboard-content">
          {searchResults.length > 0 ? (
            <div className="search-results">
              <h3>{lang === 'fr' ? 'Résultats de recherche' : 'نتائج البحث'} ({searchResults.length})</h3>
              <div className="results-grid">
                {searchResults.map(fosa => (
                  <div key={fosa.id} className="fosa-card">
                    <h4>{lang === 'fr' ? fosa.nom_fr : fosa.nom_ar}</h4>
                    <p>{lang === 'fr' ? 'Type:' : 'نوع:'} {fosa.type}</p>
                    <p>{lang === 'fr' ? 'Adresse:' : 'عنوان:'} {fosa.adresse}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
