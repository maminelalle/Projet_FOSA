import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import '../styles/fosaForm.css';

function FosaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom_fr: '',
    nom_ar: '',
    type: 'Hôpital',
    code_etablissement: '',
    longitude: '',
    latitude: '',
    adresse: '',
    responsable: '',
    commune: '',
    moughataa: 'Nouakchott',
    wilaya: 'Nouakchott',
    departement: 'Santé',
    contact: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const WILAYAS = ['Nouakchott', 'Trarza', 'Hodh El Gharbi', 'Dakhlet Nouadhibou', 'Gorgol'];
  const DEPARTEMENTS = ['Santé', 'Administration', 'Finance'];
  const TYPES = [
    'Hôpital', 
    'Centre de Santé', 
    'Poste de Santé', 
    'Direction Régionale de Santé', 
    'Direction Administrative et Financière'
  ];

  useEffect(() => {
    if (id) {
      const loadFosa = async () => {
        try {
          const response = await API.get(`fosas/${id}/`);
          setFormData(response.data);
        } catch (err) {
          setError("Erreur lors du chargement de la FOSA");
          console.error(err);
        }
      };
      loadFosa();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.nom_fr || !formData.code_etablissement) {
      setError('Nom (FR) et Code Établissement sont obligatoires');
      setIsLoading(false);
      return;
    }

    try {
      if (id) {
        await API.put(`fosas/${id}/`, formData);
      } else {
        await API.post('fosas/', formData);
      }
      navigate('/fosas', { state: { shouldRefresh: true } });
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'enregistrement");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Modifier' : 'Ajouter'} une FOSA</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nom Français *</label>
            <input
              type="text"
              name="nom_fr"
              value={formData.nom_fr}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom Arabe</label>
            <input
              type="text"
              name="nom_ar"
              value={formData.nom_ar}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Code Établissement *</label>
            <input
              type="text"
              name="code_etablissement"
              value={formData.code_etablissement}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Wilaya *</label>
            <select
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              required
            >
              {WILAYAS.map(wilaya => (
                <option key={wilaya} value={wilaya}>{wilaya}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Moughataa *</label>
            <input
              type="text"
              name="moughataa"
              value={formData.moughataa}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Longitude *</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Latitude *</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Adresse *</label>
          <textarea
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/fosas')}
            className="cancel-btn"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'En cours...' : (id ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FosaForm;