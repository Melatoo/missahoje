"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '../store/useMapStore';

// Fix for default marker icon in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map events and sync with Zustand
function MapEventsHandler() {
  const setCenter = useMapStore((state) => state.setCenter);
  const setZoom = useMapStore((state) => state.setZoom);

  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const newCenter = map.getCenter();
      setCenter({ lat: newCenter.lat, lng: newCenter.lng });
      setZoom(map.getZoom());
    },
  });

  return null;
}

export default function MapClient() {
  const center = useMapStore((state) => state.center);
  const zoom = useMapStore((state) => state.zoom);
  const userLocation = useMapStore((state) => state.userLocation);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} />
      )}
      
      <MapEventsHandler />
    </MapContainer>
  );
}
