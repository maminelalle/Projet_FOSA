import React from 'react';
import Dashboard from './Dashboard';
// import '../styles/layout.css';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Dashboard />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}