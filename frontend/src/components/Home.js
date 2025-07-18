import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import '../styles/home.css';
import useBlockBackButton from '../hooks/useBlockBackButton';

const Home = () => {
  useBlockBackButton();
  const [stats, setStats] = useState({
    totalFosas: 0,
    progression: 0,
    couverture: 0,
    repartition: {
      HP: 0,
      CS: 0,
      PS: 0,
      DRS: 0,
      DAF: 0,
    },
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('fosas/');
      const total = res.data.length;

      // Compter par type
      const repartition = { HP: 0, CS: 0, PS: 0, DRS: 0, DAF: 0 };
      res.data.forEach(fosa => {
        if (fosa.type) repartition[fosa.type] += 1;
      });

      // Exemple statiques pour couverture/progression
      const couverture = Math.min(98, total / 20); // fictif
      const progression = total; // fictif

      setStats({
        totalFosas: total,
        progression,
        couverture,
        repartition,
      });
    } catch (err) {
      console.error("Erreur de chargement des stats:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get('history/');
      setHistory(res.data.slice(0, 5)); // Prendre les 5 dernières actions
    } catch (err) {
      console.error("Erreur de chargement de l'historique:", err);
    }
  };

  return (
    <div className="dashboard">
      <header className="top-bar">
        <div className="logo">FOSA<span>MAURITANIE</span></div>
        <nav className="main-nav">
          <Link to="/" className="active">Tableau de bord</Link>
          <Link to="/fosas">Liste des FOSA</Link>
          <Link to="/map">Carte interactive</Link>
          <Link to="/add-fosa">Ajouter FOSA</Link>
        </nav>
        <div className="user-actions">
          <button className="notification"><i className="far fa-bell"></i></button>
          <div className="user-profile">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Admin" />
            <span>Admin</span>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="welcome-section">
          <h1>Bienvenue sur le Système FOSA</h1>
          <div className="stats-overview">
            <div className="stat-card">
              <div className="icon-wrapper">
                <i className="fas fa-hospital"></i>
              </div>
              <div className="stat-info">
                <h3>Total FOSA</h3>
                <span className="value">{stats.totalFosas}</span>
                <span className="trend positive">+{stats.totalFosas}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-wrapper">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3>Progression</h3>
                <span className="value">{stats.progression}</span>
                <span className="trend">Total</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-wrapper">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="stat-info">
                <h3>Couverture</h3>
                <span className="value">{stats.couverture}%</span>
                <span className="trend positive">+{stats.couverture}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card activity-chart">
            <div className="card-header">
              <h2>Répartition des FOSA</h2>
              <div className="time-filter">
                <button className="active">2025</button>
              </div>
            </div>
            <div className="chart">
              <div className="bar" style={{ height: `${stats.repartition.HP}%` }}><span>Hôpitaux</span></div>
              <div className="bar active" style={{ height: `${stats.repartition.CS}%` }}><span>Centres Santé</span></div>
              <div className="bar" style={{ height: `${stats.repartition.PS}%` }}><span>Postes Santé</span></div>
              <div className="bar" style={{ height: `${stats.repartition.DRS}%` }}><span>DRS</span></div>
              <div className="bar" style={{ height: `${stats.repartition.DAF}%` }}><span>DAF</span></div>
            </div>
          </div>

          <div className="card upcoming-tasks">
            <div className="card-header">
              <h2>Dernières Actions</h2>
            </div>
            <ul className="task-list">
              {history.map(item => (
                <li
                  key={item.id}
                  className={`task-item priority-${item.action === 'UPDATE' ? 'medium' : 'high'}`}
                >
                  <div className="task-info">
                    <h3>{item.action} par {item.username || 'Système'}</h3>
                    <p>{item.fosa_nom_fr} ({item.fosa_nom_ar || '-'})</p>
                  </div>
                  <span className="due-time">{new Date(item.timestamp).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card team-activity">
            <div className="card-header">
              <h2>À propos de l'ANETAT</h2>
            </div>
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-detail">
                  L'ANETAT est l'Agence Nationale d'Études et de Suivi des Travaux d'Aménagement du Territoire.
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-detail">
                  <strong>Site officiel:</strong> 
                  <a href="https://site.apps.anetat.com/" target="_blank" rel="noopener noreferrer">
                    https://site.apps.anetat.com/
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Menu</h4>
            <ul>
              <li><Link to="/">Page d'Accueil</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/agency">L'Agence</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Suivez-nous sur</h4>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fas fa-envelope"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <div className="footer-logo">
              <h3>REPUBLIQUE ISLAMIQUE DE MAURITANIE</h3>
              <p>Nombre : Fraternité Justice</p>
            </div>
          </div>
          <div className="footer-section">
            <div className="footer-address">
              <h4>Nombre de la Transformation et Modernisation de l'Administration</h4>
              <address>
                AN-ETAT 425C+672, Av. Moktar Ould Daddah, Nouakchott
              </address>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Agence Numérique de l'état. Tous droits réservés 2025©</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
