import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { Parish } from '../types';
import { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { MapPin as MapPinIcon } from 'lucide-react';

interface MapPinProps {
  parish: Parish;
  isActive?: boolean;
  onClick?: (parish: Parish) => void;
}

export function MapPin({ parish, isActive = false, onClick }: MapPinProps) {
  // We use useMemo to avoid recreating the icon on every render unless isActive changes
  const icon = useMemo(() => {
    // Generate the HTML for the custom div icon
    // Using Pastel Blue (#a0c4ff or similar, here we use Tailwind classes like text-blue-400)
    // and interactive hover effects.
    const iconHtml = renderToString(
      <div
        className={`group relative flex items-center justify-center w-10 h-10 transition-transform duration-200 cursor-pointer ${
          isActive ? 'scale-125 z-50' : 'hover:scale-110'
        }`}
      >
        <div
          className={`absolute inset-0 rounded-full opacity-20 animate-pulse ${
            isActive ? 'bg-blue-500' : 'bg-blue-300 group-hover:bg-blue-400'
          }`}
        />
        <MapPinIcon 
          className={`${
            isActive ? 'text-blue-600 fill-blue-100' : 'text-blue-500 fill-white'
          } drop-shadow-md transition-colors`} 
          size={isActive ? 32 : 28} 
        />
      </div>
    );

    return L.divIcon({
      html: iconHtml,
      className: 'custom-map-pin', // removes default leaflet styles like background and border
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  }, [isActive]);

  return (
    <Marker
      position={[parish.location.lat, parish.location.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(parish),
      }}
    />
  );
}
