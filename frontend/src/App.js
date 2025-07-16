import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Login from './components/Login';     
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import FosaList from './components/FosaList';
import MapView from './components/MapView';
import FosaForm from './components/FosaForm';
import FosaHistoryList from './components/FosaHistoryList';

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ padding: '1rem' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard><Home /></Dashboard>} />
        <Route path="/fosas" element={<Dashboard><FosaList /></Dashboard>} />
        <Route path="/map" element={<Dashboard><MapView /></Dashboard>} />
        <Route path="/add-fosa" element={<Dashboard><FosaForm /></Dashboard>} />
        <Route path="/edit-fosa/:id" element={<Dashboard><FosaForm /></Dashboard>} />
        <Route path="/fosaHistory" element={<Dashboard><FosaHistoryList /></Dashboard>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;