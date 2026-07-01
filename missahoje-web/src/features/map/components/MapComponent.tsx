"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMapStore } from '../store/useMapStore';
import { Loader2 } from 'lucide-react';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-parchment/80">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  ),
});

export function MapComponent() {
  const requestGeolocation = useMapStore((state) => state.requestGeolocation);
  const permissionStatus = useMapStore((state) => state.permissionStatus);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    requestGeolocation();
  }, [requestGeolocation]);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full flex flex-col">
      {permissionStatus === 'prompt' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white shadow-md rounded-full px-4 py-2 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Obtendo localização...</span>
        </div>
      )}
      
      <MapClient />
    </div>
  );
}
