import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/fosaHistory.css';
import useBlockBackButton from '../hooks/useBlockBackButton';

function FosaHistoryList() {
  useBlockBackButton();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get('history/');
      setHistory(res.data);
    } catch (error) {
      console.error("Erreur de chargement de l'historique:", error);
    }
  };

  return (
    <div className="history-container">
      <h1>Historique des FOSAs</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID FOSA</th>
              <th>Nom (FR)</th>
              <th>Nom (AR)</th>
              <th>Auteur</th>
              <th>Action</th>
              <th>Changements</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id}>
                <td>{item.fosa_id}</td>
                <td>{item.fosa_nom_fr}</td>
                <td>{item.fosa_nom_ar || '-'}</td>
                <td>{item.username || 'Système'}</td>
                <td>{item.action}</td>
                <td>
                  <pre>{JSON.stringify(item.changes, null, 2)}</pre>
                </td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FosaHistoryList;
