import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
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
                <h3>Nouvelles FOSA</h3>
                <span className="value">78%</span>
                <span className="trend positive">+14</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-wrapper">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3>Progression</h3>
                <span className="value">1896</span>
                <span className="trend">Total</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-wrapper">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="stat-info">
                <h3>Couverture</h3>
                <span className="value">98%</span>
                <span className="trend positive">+2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card activity-chart">
            <div className="card-header">
              <h2>Répartition des FOSA</h2>
              <div className="time-filter">
                <button className="active">2023</button>
                <button>2022</button>
                <button>2021</button>
              </div>
            </div>
            <div className="chart">
              <div className="bar" style={{ height: '35%' }}><span>Hôpitaux</span></div>
              <div className="bar active" style={{ height: '45%' }}><span>Centres Santé</span></div>
              <div className="bar" style={{ height: '15%' }}><span>Postes Santé</span></div>
              <div className="bar" style={{ height: '5%' }}><span>Pharmacies</span></div>
            </div>
          </div>

          <div className="card upcoming-tasks">
            <div className="card-header">
              <h2>Dernières Actions</h2>
              <button className="add-task"><i className="fas fa-plus"></i></button>
            </div>
            <ul className="task-list">
              <li className="task-item priority-high">
                <div className="task-info">
                  <h3>Mise à jour des données</h3>
                  <p>Actualisation des FOSA de Nouakchott</p>
                </div>
                <span className="due-time">Aujourd'hui</span>
              </li>
              <li className="task-item priority-medium">
                <div className="task-info">
                  <h3>Rapport trimestriel</h3>
                  <p>Préparation pour le ministère</p>
                </div>
                <span className="due-time">Demain</span>
              </li>
              <li className="task-item priority-low">
                <div className="task-info">
                  <h3>Maintenance serveur</h3>
                  <p>Mise à jour de sécurité</p>
                </div>
                <span className="due-time">15/12</span>
              </li>
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