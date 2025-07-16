import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import API from '../services/api';
import '../styles/mapView.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFsbGVzdG9ybSIsImEiOiJjbWQ0cTZpZzkwMmpwMmpwOG4ybGs1bjg2In0.MVLOHr-K161s91ev2KkyIA';

const MapView = () => {
  const [fosas, setFosas] = useState([]);
  const [selectedType, setSelectedType] = useState('Tous');
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  // Debug: Affiche les FOSA chargées
  useEffect(() => {
    console.log('FOSA mises à jour:', fosas);
  }, [fosas]);

  useEffect(() => {
    const fetchFosas = async () => {
      try {
        const response = await API.get('fosas/');
        console.log('Réponse API:', response.data);
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
    };
  }, []);

  useEffect(() => {
    if (!map.current || !fosas.length) return;

    // Nettoyage des anciens marqueurs
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const filtered = fosas.filter(fosa => {
      const typeMatch = selectedType === 'Tous' || fosa.type === selectedType;
      const hasCoords = fosa.latitude != null && fosa.longitude != null;
      
      if (!hasCoords) {
        console.warn('FOSA sans coordonnées:', fosa.id, fosa.nom);
      }
      
      return typeMatch && hasCoords;
    });

    console.log('FOSA filtrées:', filtered);

    filtered.forEach(fosa => {
      try {
        const lngLat = [
          parseFloat(fosa.longitude),
          parseFloat(fosa.latitude)
        ];
        
        console.log('Ajout marqueur:', fosa.nom, 'à', lngLat);

        const marker = new mapboxgl.Marker({
          color: getMarkerColor(fosa.type)
        })
          .setLngLat(lngLat)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3>${fosa.nom_fr || fosa.nom}</h3>
            <p>Type: ${fosa.type}</p>
          `))
          .addTo(map.current);

        markers.current.push(marker);
      } catch (e) {
        console.error('Erreur création marqueur:', e);
      }
    });

  }, [fosas, selectedType]);

  const getMarkerColor = (type) => {
    const colors = {
      'Hôpital': '#ff0000',
      'Centre de Santé': '#00ff00',
      'Poste de Santé': '#ffa500',
      'Direction Régionale de Santé': '#800080'
    };
    return colors[type] || '#0000ff';
  };

  return (
    <div className="map-page">
      <div className="map-controls">
        <h1>Carte Interactive des FOSA</h1>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="Tous">Tous les types</option>
          <option value="Hôpital">Hôpital</option>
          <option value="Centre de Santé">Centre de Santé</option>
          <option value="Poste de Santé">Poste de Santé</option>
        </select>
      </div>
      <div 
        ref={mapContainer} 
        className="map-container" 
        style={{ height: '80vh', width: '100%' }} 
      />
    </div>
  );
};

export default MapView;