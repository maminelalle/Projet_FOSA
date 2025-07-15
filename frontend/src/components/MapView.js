// src/components/MapView.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../services/api';
import '../styles/mapView.css';

// Correction des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const customIcon = (type) => {
  let color = 'blue';
  switch(type) {
    case 'Hôpital': color = 'red'; break;
    case 'Centre de Santé': color = 'green'; break;
    case 'Poste de Santé': color = 'orange'; break;
    case 'Clinique': color = 'purple'; break;
    case 'Pharmacie': color = 'blue'; break;
    default: color = 'gray';
  }
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapView = () => {
  const [fosas, setFosas] = useState([]);
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedRegion, setSelectedRegion] = useState('Tous');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFosas = async () => {
      try {
        const response = await API.get('fosas/');
        setFosas(response.data);
      } catch (err) {
        console.error("Erreur de chargement des FOSA:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFosas();
  }, []);

  const filteredFosas = fosas.filter(fosa => {
    const typeMatch = selectedType === 'Tous' || fosa.type === selectedType;
    const regionMatch = selectedRegion === 'Tous' || fosa.region === selectedRegion;
    const hasCoords = fosa.latitude && fosa.longitude;
    return typeMatch && regionMatch && hasCoords;
  });

  if (isLoading) {
    return <div className="map-page">Chargement des données...</div>;
  }

  return (
    <div className="map-page">
      <div className="map-controls">
        <h1>Carte Interactive des FOSA</h1>
        
        <div className="filters">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="Tous">Tous les types</option>
            <option value="Hôpital">Hôpital</option>
            <option value="Centre de Santé">Centre de Santé</option>
            <option value="Poste de Santé">Poste de Santé</option>
            <option value="Pharmacie">Pharmacie</option>
          </select>
          
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="filter-select"
          >
            <option value="Tous">Toutes les régions</option>
            <option value="Nouakchott">Nouakchott</option>
            <option value="Trarza">Trarza</option>
            <option value="Hodh El Gharbi">Hodh El Gharbi</option>
          </select>
        </div>
      </div>

      <div className="map-container">
        <MapContainer 
          center={[18.0735, -15.9582]} 
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredFosas.map(fosa => (
            <Marker
              key={fosa.id}
              position={[parseFloat(fosa.latitude), parseFloat(fosa.longitude)]}
              icon={customIcon(fosa.type)}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{fosa.nom}</h3>
                  <p><strong>Type:</strong> {fosa.type}</p>
                  <p><strong>Région:</strong> {fosa.region}</p>
                  <p><strong>Adresse:</strong> {fosa.adresse}</p>
                  <p><strong>Contact:</strong> {fosa.contact}</p>
                  <div className="popup-actions">
                    <a href={`/fosas/${fosa.id}`} className="popup-link">Détails</a>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${fosa.latitude},${fosa.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="popup-link"
                    >
                      Itinéraire
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;