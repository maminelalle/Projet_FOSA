import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import API from '../services/api';
import '../styles/mapView.css';
import useBlockBackButton from '../hooks/useBlockBackButton';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFsbGVzdG9ybSIsImEiOiJjbWQ0cTZpZzkwMmpwMmpwOG4ybGs1bjg2In0.MVLOHr-K161s91ev2KkyIA';

const MapView = () => {
  useBlockBackButton();
  const [fosas, setFosas] = useState([]);
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCommune, setSelectedCommune] = useState('Tous');
  const [selectedMoughataa, setSelectedMoughataa] = useState('Tous');
  const [selectedWilaya, setSelectedWilaya] = useState('Tous');
  const [selectedDepartement, setSelectedDepartement] = useState('Tous');
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    const fetchFosas = async () => {
      try {
        const response = await API.get('fosas/');
        setFosas(response.data);
      } catch (err) {
        console.error("Erreur API:", err);
      }
    };
    fetchFosas();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-15.9582, 18.0735], // [lng, lat]
      zoom: 6
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
      markers.current.forEach(m => m.remove());
      markers.current = [];
    };
  }, []);

  // Fonction utilitaire pour obtenir valeurs uniques filtres
  const getUniqueValues = (key) => {
    const vals = fosas.map(f => f[key]).filter(v => v && v.trim() !== '');
    return ['Tous', ...Array.from(new Set(vals))];
  };

  useEffect(() => {
    if (!map.current || !fosas.length) return;

    // Nettoyer anciens markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const filtered = fosas.filter(fosa => {
      const matchType = selectedType === 'Tous' || fosa.type === selectedType;
      const matchCommune = selectedCommune === 'Tous' || fosa.commune === selectedCommune;
      const matchMoughataa = selectedMoughataa === 'Tous' || fosa.moughataa === selectedMoughataa;
      const matchWilaya = selectedWilaya === 'Tous' || fosa.wilaya === selectedWilaya;
      const matchDepartement = selectedDepartement === 'Tous' || fosa.departement === selectedDepartement;
      const hasCoords = fosa.latitude != null && fosa.longitude != null;
      return matchType && matchCommune && matchMoughataa && matchWilaya && matchDepartement && hasCoords;
    });

    filtered.forEach(fosa => {
      try {
        const lngLat = [
          parseFloat(fosa.longitude),
          parseFloat(fosa.latitude)
        ];

        const marker = new mapboxgl.Marker({
          color: getMarkerColor(fosa)
        })
          .setLngLat(lngLat)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popup-content">
              <h3>${fosa.nom_fr}</h3>
              <p><strong>Nom Arabe:</strong> ${fosa.nom_ar || ''}</p>
              <p><strong>Code:</strong> ${fosa.code_etablissement}</p>
              <p><strong>Adresse:</strong> ${fosa.adresse}</p>
              <p><strong>Responsable:</strong> ${fosa.responsable || 'N/A'}</p>
              <p><strong>Contact:</strong> ${fosa.contact || 'N/A'}</p>
              <p><strong>Wilaya:</strong> ${fosa.wilaya}</p>
              <p><strong>Moughataa:</strong> ${fosa.moughataa}</p>
            </div>
          `))
          .addTo(map.current);

        markers.current.push(marker);
      } catch (e) {
        console.error('Erreur création marqueur:', e);
      }
    });
  }, [fosas, selectedType, selectedCommune, selectedMoughataa, selectedWilaya, selectedDepartement]);

  const getMarkerColor = (fosa) => {
    if (!fosa.is_public) return '#ff0000';
    const colors = {
      'Hôpital': '#1e40af',
      'Centre de Santé': '#10b981',
      'Poste de Santé': '#f59e0b',
      'Direction Régionale de Santé': '#9333ea',
    };
    return colors[fosa.type] || '#0ea5e9';
  };

  return (
    <div className="map-page">
      <div className="map-controls">
        <h1>Carte Interactive des FOSA</h1>

        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="map-filter-select">
          {getUniqueValues('type').map(val => <option key={val} value={val}>{val}</option>)}
        </select>

        <select value={selectedCommune} onChange={e => setSelectedCommune(e.target.value)} className="map-filter-select">
          {getUniqueValues('commune').map(val => <option key={val} value={val}>{val}</option>)}
        </select>

        <select value={selectedMoughataa} onChange={e => setSelectedMoughataa(e.target.value)} className="map-filter-select">
          {getUniqueValues('moughataa').map(val => <option key={val} value={val}>{val}</option>)}
        </select>

        <select value={selectedWilaya} onChange={e => setSelectedWilaya(e.target.value)} className="map-filter-select">
          {getUniqueValues('wilaya').map(val => <option key={val} value={val}>{val}</option>)}
        </select>

        <select value={selectedDepartement} onChange={e => setSelectedDepartement(e.target.value)} className="map-filter-select">
          {getUniqueValues('departement').map(val => <option key={val} value={val}>{val}</option>)}
        </select>

      </div>

      <div ref={mapContainer} className="map-container" style={{ height: '80vh', width: '100%' }} />
    </div>
  );
};

export default MapView;
