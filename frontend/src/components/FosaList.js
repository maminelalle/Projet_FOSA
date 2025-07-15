import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';
import '../styles/fosaList.css';

function FosaList() {
  const [fosas, setFosas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFosa, setEditingFosa] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'Hôpital',
    adresse: '',
    contact: '',
    latitude: '',
    longitude: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadFosas();
  }, []);

  const loadFosas = async () => {
    try {
      const response = await API.get('fosas/');
      setFosas(response.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette FOSA ?')) {
      try {
        await API.delete(`fosas/${id}/`);
        setFosas(fosas.filter(f => f.id !== id));
      } catch (error) {
        console.error("Erreur de suppression:", error);
      }
    }
  };

  const startEditing = (fosa) => {
    setEditingFosa(fosa.id);
    setFormData({
      nom: fosa.nom,
      type: fosa.type,
      adresse: fosa.adresse,
      contact: fosa.contact,
      latitude: fosa.latitude,
      longitude: fosa.longitude
    });
  };

  const cancelEditing = () => {
    setEditingFosa(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`fosas/${editingFosa}/`, formData);
      await loadFosas();
      setEditingFosa(null);
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
    }
  };

  return (
    <div className="fosa-list-container">
      <div className="list-header">
        <h1>Liste des Formations Sanitaires</h1>
<button 
  onClick={() => window.open('http://127.0.0.1:8000/api/fosas/', '_blank')}
  className="add-button"
>
  Ajouter une FOSA
</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom, type ou adresse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Adresse</th>
              <th>Contact</th>
              <th>Coordonnées</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fosas.filter(fosa => 
              fosa.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fosa.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fosa.adresse.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(fosa => (
              <React.Fragment key={fosa.id}>
                {editingFosa === fosa.id ? (
                  <tr className="editing-row">
                    <td colSpan="7">
                      <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Nom</label>
                            <input
                              type="text"
                              name="nom"
                              value={formData.nom}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Type</label>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleFormChange}
                            >
                              <option>Hôpital</option>
                              <option>Centre de Santé</option>
                              <option>Poste de Santé</option>
                              <option>Clinique</option>
                              <option>Pharmacie</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Adresse</label>
                            <input
                              type="text"
                              name="adresse"
                              value={formData.adresse}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Contact</label>
                            <input
                              type="text"
                              name="contact"
                              value={formData.contact}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Latitude</label>
                            <input
                              type="text"
                              name="latitude"
                              value={formData.latitude}
                              onChange={handleFormChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Longitude</label>
                            <input
                              type="text"
                              name="longitude"
                              value={formData.longitude}
                              onChange={handleFormChange}
                            />
                          </div>
                        </div>
                        <div className="form-actions">
                          <button 
                            type="button" 
                            onClick={cancelEditing}
                            className="cancel-btn"
                          >
                            Annuler
                          </button>
                          <button type="submit" className="save-btn">
                            Enregistrer
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>{fosa.id}</td>
                    <td>{fosa.nom}</td>
                    <td><span className={`type-badge ${fosa.type.toLowerCase().replace(' ', '-')}`}>{fosa.type}</span></td>
                    <td>{fosa.adresse}</td>
                    <td>{fosa.contact}</td>
                    <td>{fosa.latitude}, {fosa.longitude}</td>
                    <td className="actions">
                      <button 
                        onClick={() => startEditing(fosa)}
                        className="edit-btn"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(fosa.id)}
                        className="delete-btn"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FosaList;