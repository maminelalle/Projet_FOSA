import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import LanguageContext from '../context/LanguageContext';
import '../styles/fosaList.css';
import useBlockBackButton from '../hooks/useBlockBackButton';

function FosaList() {
  useBlockBackButton();
  const [fosas, setFosas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { lang } = useContext(LanguageContext);

  // Nouveaux états pour filtres
  const [filterType, setFilterType] = useState('Tous');
  const [filterCommune, setFilterCommune] = useState('Tous');
  const [filterMoughataa, setFilterMoughataa] = useState('Tous');
  const [filterWilaya, setFilterWilaya] = useState('Tous');
  const [filterDepartement, setFilterDepartement] = useState('Tous');

  useEffect(() => {
    loadFosas();
  }, []);

  const loadFosas = async () => {
    setLoading(true);
    try {
      const response = await API.get('fosas/');
      setFosas(response.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setMessage("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await API.get('fosas/export_data/', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fosas_export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage("Export réussi!");
    } catch (error) {
      console.error("Erreur d'export:", error);
      setMessage("Erreur lors de l'export");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setMessage("Seuls les fichiers Excel (.xlsx, .xls) sont acceptés");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await API.post('fosas/import_data/', formData);
      setMessage(`Import réussi: ${response.data.imported} nouveaux, ${response.data.updated} mis à jour`);
      loadFosas();
    } catch (error) {
      console.error("Erreur d'import:", error);
      setMessage(error.response?.data?.error || "Erreur lors de l'import");
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await API.delete(`fosas/${id}/`);
      setFosas(fosas.filter(f => f.id !== id));
      setMessage("FOSA supprimée avec succès !");
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  };

  const handleEdit = (fosa) => {
    setEditingId(fosa.id);
    setEditData({ ...fosa });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    try {
      await API.put(`fosas/${editingId}/`, editData);
      setMessage("FOSA mise à jour !");
      setEditingId(null);
      setEditData({});
      loadFosas();
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      setMessage("Erreur lors de la mise à jour");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const togglePublic = async (fosa) => {
    try {
      const updated = { ...fosa, is_public: !fosa.is_public };
      await API.put(`fosas/${fosa.id}/`, updated);
      setFosas(fosas.map(f => (f.id === fosa.id ? updated : f)));
    } catch (error) {
      console.error("Erreur toggle public:", error);
    }
  };

  // Fonction pour récupérer valeurs uniques pour les filtres
  const getUniqueValues = (key) => {
    const vals = fosas.map(f => f[key]).filter(v => v && v.trim() !== '');
    return ['Tous', ...Array.from(new Set(vals))];
  };

  // Filtrage combiné
  const filteredFosas = fosas.filter(fosa => {
    if (searchTerm && !fosa.nom_fr.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterType !== 'Tous' && fosa.type !== filterType) return false;
    if (filterCommune !== 'Tous' && fosa.commune !== filterCommune) return false;
    if (filterMoughataa !== 'Tous' && fosa.moughataa !== filterMoughataa) return false;
    if (filterWilaya !== 'Tous' && fosa.wilaya !== filterWilaya) return false;
    if (filterDepartement !== 'Tous' && fosa.departement !== filterDepartement) return false;
    return true;
  });

  return (
    <div className="fosa-list-container">
      <div className="list-header">
        <h1>Liste des FOSAs</h1>
        {message && <div className="message">{message}</div>}
        <div className="action-buttons">
          <div className="import-export">
             {/* Bouton Add Fosa */}
            <button 
              className="add-fosa-button" 
              onClick={() => window.open('http://127.0.0.1:8000/api/fosas/?format=api', '_blank')}
            >
              ➕ Ajouter FOSA
            </button>

            <input
              type="file"
              id="import-file"
              onChange={handleImport}
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => document.getElementById('import-file').click()}
              disabled={loading}
            >
              {loading ? 'Import en cours...' : '📋 Importer Excel'}
            </button>
            <button onClick={handleExport} disabled={loading}>
              {loading ? 'Export en cours...' : '📤 Exporter Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Rechercher nom FR..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="filter-select">
          {getUniqueValues('type').map(val => <option key={val} value={val}>{val}</option>)}
        </select>
        <select value={filterCommune} onChange={e => setFilterCommune(e.target.value)} className="filter-select">
          {getUniqueValues('commune').map(val => <option key={val} value={val}>{val}</option>)}
        </select>
        <select value={filterMoughataa} onChange={e => setFilterMoughataa(e.target.value)} className="filter-select">
          {getUniqueValues('moughataa').map(val => <option key={val} value={val}>{val}</option>)}
        </select>
        <select value={filterWilaya} onChange={e => setFilterWilaya(e.target.value)} className="filter-select">
          {getUniqueValues('wilaya').map(val => <option key={val} value={val}>{val}</option>)}
        </select>
        <select value={filterDepartement} onChange={e => setFilterDepartement(e.target.value)} className="filter-select">
          {getUniqueValues('departement').map(val => <option key={val} value={val}>{val}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom ({lang === 'fr' ? 'FR' : 'AR'})</th>
              <th>Type</th>
              <th>Code Etablissement</th>
              <th>Longitude</th>
              <th>Latitude</th>
              <th>Adresse</th>
              <th>Responsable</th>
              <th>Commune</th>
              <th>Moughataa</th>
              <th>Wilaya</th>
              <th>Département</th>
              <th>Contact</th>
              <th>Visibilité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFosas.map(fosa => (
              editingId === fosa.id ? (
                <tr key={fosa.id} className="editing-row">
                  <td colSpan="15">
                    <div className="edit-form">
                      <label>
                        Nom FR:
                        <input
                          type="text"
                          name="nom_fr"
                          value={editData.nom_fr || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Nom AR:
                        <input
                          type="text"
                          name="nom_ar"
                          value={editData.nom_ar || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Type:
                        <input
                          type="text"
                          name="type"
                          value={editData.type || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Code Etablissement:
                        <input
                          type="text"
                          name="code_etablissement"
                          value={editData.code_etablissement || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Longitude:
                        <input
                          type="text"
                          name="longitude"
                          value={editData.longitude || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Latitude:
                        <input
                          type="text"
                          name="latitude"
                          value={editData.latitude || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Adresse:
                        <input
                          type="text"
                          name="adresse"
                          value={editData.adresse || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Responsable:
                        <input
                          type="text"
                          name="responsable"
                          value={editData.responsable || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Commune:
                        <input
                          type="text"
                          name="commune"
                          value={editData.commune || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Moughataa:
                        <input
                          type="text"
                          name="moughataa"
                          value={editData.moughataa || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Wilaya:
                        <input
                          type="text"
                          name="wilaya"
                          value={editData.wilaya || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Département:
                        <input
                          type="text"
                          name="departement"
                          value={editData.departement || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Contact:
                        <input
                          type="text"
                          name="contact"
                          value={editData.contact || ''}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Visibilité:
                        <select
                          name="is_public"
                          value={editData.is_public ? 'public' : 'private'}
                          onChange={(e) =>
                            setEditData(prev => ({
                              ...prev,
                              is_public: e.target.value === 'public'
                            }))
                          }
                        >
                          <option value="public">Public</option>
                          <option value="private">Privé</option>
                        </select>
                      </label>

                      <div className="form-actions">
                        <button className="cancel-btn" onClick={handleCancelEdit}>Annuler</button>
                        <button className="save-btn" onClick={handleSaveEdit}>Enregistrer</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={fosa.id}>
                  <td>{fosa.id}</td>
                  <td>{lang === 'fr' ? fosa.nom_fr : fosa.nom_ar}</td>
                  <td>{fosa.type}</td>
                  <td>{fosa.code_etablissement}</td>
                  <td>{fosa.longitude}</td>
                  <td>{fosa.latitude}</td>
                  <td>{fosa.adresse}</td>
                  <td>{fosa.responsable}</td>
                  <td>{fosa.commune}</td>
                  <td>{fosa.moughataa}</td>
                  <td>{fosa.wilaya}</td>
                  <td>{fosa.departement}</td>
                  <td>{fosa.contact}</td>
                  <td>
                    <button className={fosa.is_public ? 'public-btn' : 'private-btn'}
                      onClick={() => togglePublic(fosa)}>
                      {fosa.is_public ? 'Public' : 'Privé'}
                    </button>
                  </td>

                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(fosa)}>Modifier</button>
                    <button className="delete-btn" onClick={() => handleDelete(fosa.id)}>Supprimer</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FosaList;
