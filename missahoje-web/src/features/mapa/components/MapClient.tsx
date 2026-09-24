"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '../store/useMapStore';
import type { MappedComunidade } from '../types';
import { MapPin } from './MapPin';

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
  const setBounds = useMapStore((state) => state.setBounds);

  const map = useMapEvents({
    moveend: (e) => {
      const m = e.target;
      const newCenter = m.getCenter();
      const newBounds = m.getBounds();
      setCenter({ lat: newCenter.lat, lng: newCenter.lng });
      setZoom(m.getZoom());
      setBounds({
        southWest: { lat: newBounds.getSouthWest().lat, lng: newBounds.getSouthWest().lng },
        northEast: { lat: newBounds.getNorthEast().lat, lng: newBounds.getNorthEast().lng }
      });
    },
  });

  useEffect(() => {
    if (map) {
      const newBounds = map.getBounds();
      setBounds({
        southWest: { lat: newBounds.getSouthWest().lat, lng: newBounds.getSouthWest().lng },
        northEast: { lat: newBounds.getNorthEast().lat, lng: newBounds.getNorthEast().lng }
      });
    }
  }, [map, setBounds]);

  return null;
}

interface MapClientProps {
  pins?: MappedComunidade[];
}

export default function MapClient({ pins = [] }: MapClientProps) {
  const center = useMapStore((state) => state.center);
  const zoom = useMapStore((state) => state.zoom);
  const userLocation = useMapStore((state) => state.userLocation);

  const [activeComunidadeId, setActiveComunidadeId] = useState<string | null>(null);

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

      {pins.map((pin) => (
        <MapPin
          key={pin.comunidade.id}
          pin={pin}
          isActive={pin.comunidade.id === activeComunidadeId}
          onClick={(p) => setActiveComunidadeId(p.comunidade.id)}
        />
      ))}
      
      <MapEventsHandler />
    </MapContainer>
  );
}
