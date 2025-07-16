import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/fosaList.css';

function FosaList() {
  const [fosas, setFosas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  return (
    <div className="fosa-list-container">
      <div className="list-header">
        <h1>Liste des FOSAs</h1>
        {message && <div className="message">{message}</div>}
        <div className="action-buttons">
          <div className="import-export">
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

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom (FR)</th>
              <th>Nom (AR)</th>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fosas.filter(fosa =>
              fosa.nom_fr.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(fosa => (
              editingId === fosa.id ? (
                <tr key={fosa.id} className="editing-row">
                  <td colSpan="15">
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nom FR</label>
                          <input name="nom_fr" value={editData.nom_fr} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Nom AR</label>
                          <input name="nom_ar" value={editData.nom_ar || ''} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <input name="type" value={editData.type} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Code</label>
                          <input name="code_etablissement" value={editData.code_etablissement} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Longitude</label>
                          <input name="longitude" value={editData.longitude} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Latitude</label>
                          <input name="latitude" value={editData.latitude} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Adresse</label>
                          <input name="adresse" value={editData.adresse} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Responsable</label>
                          <input name="responsable" value={editData.responsable || ''} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Commune</label>
                          <input name="commune" value={editData.commune || ''} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Moughataa</label>
                          <input name="moughataa" value={editData.moughataa} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Wilaya</label>
                          <input name="wilaya" value={editData.wilaya} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Département</label>
                          <input name="departement" value={editData.departement || ''} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Contact</label>
                          <input name="contact" value={editData.contact} onChange={handleEditChange} />
                        </div>
                      </div>
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
                  <td>{fosa.nom_fr}</td>
                  <td>{fosa.nom_ar}</td>
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
