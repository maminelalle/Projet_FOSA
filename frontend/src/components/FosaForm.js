import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import '../styles/fosaForm.css';

function FosaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    type: 'Hôpital',
    region: 'Nouakchott',
    contact: '',
    adresse: '',
    longitude: '',
    latitude: ''
  });

  useEffect(() => {
    if (id) {
      API.get(`fosas/${id}/`).then(res => setFormData(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`fosas/${id}/`, formData);
      } else {
        await API.post('fosas/', formData);
      }
      navigate('/fosas');
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Modifier' : 'Ajouter'} une FOSA</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de la FOSA</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option>Hôpital</option>
              <option>Centre de Santé</option>
              <option>Poste de Santé</option>
              <option>Pharmacie</option>
            </select>
          </div>

          <div className="form-group">
            <label>Région</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
            >
              <option>Nouakchott</option>
              <option>Trarza</option>
              <option>Hodh El Gharbi</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({...formData, longitude: e.target.value})}
              placeholder="Ex: -15.9783"
            />
          </div>

          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({...formData, latitude: e.target.value})}
              placeholder="Ex: 18.0858"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Adresse</label>
          <textarea
            value={formData.adresse}
            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/fosas')}
            className="cancel-btn"
          >
            Annuler
          </button>
          <button type="submit" className="submit-btn">
            {id ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FosaForm;