
You are the Edge Case Hunter. Your task is to review the following diff and identify edge cases, boundary conditions, and unhandled states. You have read access to the project (you can use your tools to read files if needed, but the primary focus is the diff).

## Diff

```diff
diff --git a/missahoje-web/package-lock.json b/missahoje-web/package-lock.json
index d2fa5da..641689e 100644
--- a/missahoje-web/package-lock.json
+++ b/missahoje-web/package-lock.json
@@ -10,13 +10,17 @@
       "dependencies": {
         "@tanstack/react-query": "^5.101.2",
         "axios": "^1.16.1",
+        "leaflet": "^1.9.4",
+        "lucide-react": "^1.23.0",
         "next": "16.2.6",
         "react": "19.2.4",
         "react-dom": "19.2.4",
+        "react-leaflet": "^5.0.0",
         "zustand": "^5.0.14"
       },
       "devDependencies": {
         "@tailwindcss/postcss": "^4",
+        "@types/leaflet": "^1.9.21",
         "@types/node": "^20",
         "@types/react": "^19",
         "@types/react-dom": "^19",
@@ -1169,6 +1173,17 @@
         "node": ">=12.4.0"
       }
     },
+    "node_modules/@react-leaflet/core": {
+      "version": "3.0.0",
+      "resolved": "https://registry.npmjs.org/@react-leaflet/core/-/core-3.0.0.tgz",
+      "integrity": "sha512-3EWmekh4Nz+pGcr+xjf0KNyYfC3U2JjnkWsh0zcqaexYqmmB5ZhH37kz41JXGmKzpaMZCnPofBBm64i+YrEvGQ==",
+      "license": "Hippocratic-2.1",
+      "peerDependencies": {
+        "leaflet": "^1.9.0",
+        "react": "^19.0.0",
+        "react-dom": "^19.0.0"
+      }
+    },
     "node_modules/@rtsao/scc": {
       "version": "1.1.0",
       "resolved": "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz",
@@ -1481,6 +1496,13 @@
       "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
       "dev": true
     },
+    "node_modules/@types/geojson": {
+      "version": "7946.0.16",
+      "resolved": "https://registry.npmjs.org/@types/geojson/-/geojson-7946.0.16.tgz",
+      "integrity": "sha512-6C8nqWur3j98U6+lXDfTUWIfgvZU+EumvpHKcYjujKH7woYyLj2sUmff0tRhrqM7BohUw7Pz3ZB1jj2gW9Fvmg==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@types/json-schema": {
       "version": "7.0.15",
       "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
@@ -1493,6 +1515,16 @@
       "integrity": "sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==",
       "dev": true
     },
+    "node_modules/@types/leaflet": {
+      "version": "1.9.21",
+      "resolved": "https://registry.npmjs.org/@types/leaflet/-/leaflet-1.9.21.tgz",
+      "integrity": "sha512-TbAd9DaPGSnzp6QvtYngntMZgcRk+igFELwR2N99XZn7RXUdKgsXMR+28bUO0rPsWp8MIu/f47luLIQuSLYv/w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/geojson": "*"
+      }
+    },
     "node_modules/@types/node": {
       "version": "20.19.41",
       "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.41.tgz",
@@ -4390,6 +4422,12 @@
         "node": ">=0.10"
       }
     },
+    "node_modules/leaflet": {
+      "version": "1.9.4",
+      "resolved": "https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz",
+      "integrity": "sha512-nxS1ynzJOmOlHp+iL3FyWqK89GtNL8U8rvlMOsQdTTssxZwCXh8N2NB3GDQOL+YR3XnWyZAxwQixURb+FA74PA==",
+      "license": "BSD-2-Clause"
+    },
     "node_modules/levn": {
       "version": "0.4.1",
       "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
@@ -4694,6 +4732,15 @@
         "yallist": "^3.0.2"
       }
     },
+    "node_modules/lucide-react": {
+      "version": "1.23.0",
+      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-1.23.0.tgz",
+      "integrity": "sha512-38BpJcD0JhFosxHApP/BYsBetLpQFRoTRzEzstM/XCc3jsAG7wqaY1lgVwxiUe3xqYE+lNxo2PkCmYwXWrwwIw==",
+      "license": "ISC",
+      "peerDependencies": {
+        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
+      }
+    },
     "node_modules/magic-string": {
       "version": "0.30.21",
       "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
@@ -5273,6 +5320,20 @@
       "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
       "dev": true
     },
+    "node_modules/react-leaflet": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/react-leaflet/-/react-leaflet-5.0.0.tgz",
+      "integrity": "sha512-CWbTpr5vcHw5bt9i4zSlPEVQdTVcML390TjeDG0cK59z1ylexpqC6M1PJFjV8jD7CF+ACBFsLIDs6DRMoLEofw==",
+      "license": "Hippocratic-2.1",
+      "dependencies": {
+        "@react-leaflet/core": "^3.0.0"
+      },
+      "peerDependencies": {
+        "leaflet": "^1.9.0",
+        "react": "^19.0.0",
+        "react-dom": "^19.0.0"
+      }
+    },
     "node_modules/reflect.getprototypeof": {
       "version": "1.0.10",
       "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
diff --git a/missahoje-web/package.json b/missahoje-web/package.json
index 9d28b26..6f45f08 100644
--- a/missahoje-web/package.json
+++ b/missahoje-web/package.json
@@ -11,13 +11,17 @@
   "dependencies": {
     "@tanstack/react-query": "^5.101.2",
     "axios": "^1.16.1",
+    "leaflet": "^1.9.4",
+    "lucide-react": "^1.23.0",
     "next": "16.2.6",
     "react": "19.2.4",
     "react-dom": "19.2.4",
+    "react-leaflet": "^5.0.0",
     "zustand": "^5.0.14"
   },
   "devDependencies": {
     "@tailwindcss/postcss": "^4",
+    "@types/leaflet": "^1.9.21",
     "@types/node": "^20",
     "@types/react": "^19",
     "@types/react-dom": "^19",
diff --git a/missahoje-web/public/marker-icon-2x.png b/missahoje-web/public/marker-icon-2x.png
new file mode 100644
index 0000000..88f9e50
Binary files /dev/null and b/missahoje-web/public/marker-icon-2x.png differ
diff --git a/missahoje-web/public/marker-icon.png b/missahoje-web/public/marker-icon.png
new file mode 100644
index 0000000..950edf2
Binary files /dev/null and b/missahoje-web/public/marker-icon.png differ
diff --git a/missahoje-web/public/marker-shadow.png b/missahoje-web/public/marker-shadow.png
new file mode 100644
index 0000000..9fd2979
Binary files /dev/null and b/missahoje-web/public/marker-shadow.png differ
diff --git a/missahoje-web/src/app/page.tsx b/missahoje-web/src/app/page.tsx
index a1d43e6..562a58d 100644
--- a/missahoje-web/src/app/page.tsx
+++ b/missahoje-web/src/app/page.tsx
@@ -1,60 +1,12 @@
-import { getLocationCookie } from './actions';
-import { getMissas } from '../lib/api';
-import { CitySelector } from '../components/CitySelector';
-import { NextMassCard } from '../components/NextMassCard';
-import { MassSchedule } from '../components/MassSchedule';
-import { HorarioMissa } from '../types';
-
-export default async function Home() {
-  const { cidadeId, cidadeNome } = await getLocationCookie();
-  
-  // Fetch initial missas (Today)
-  const today = new Date().getDay();
-  let initialMissas: HorarioMissa[] = [];
-  
-  if (cidadeId) {
-    try {
-      const response = await getMissas(cidadeId, today);
-      initialMissas = response.items.sort((a, b) => a.horario.localeCompare(b.horario));
-    } catch (error) {
-      console.error('Failed to fetch initial missas:', error);
-    }
-  }
-
-  // Calculate Next Mass
-  const now = new Date();
-  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
-  const nextMass = initialMissas.find(m => m.horario > currentTimeStr);
+import { LayoutShell } from '../components/layouts/LayoutShell';
+import { MapComponent } from '../features/map/components/MapComponent';
 
+export default function Home() {
   return (
-    <div className="min-h-screen flex flex-col relative font-sans selection:bg-primary/30">
-      
-      <header className="w-full mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
-        <h1 className="font-serif text-5xl md:text-6xl text-white font-medium tracking-tight text-glow">
-          Missa Hoje
-        </h1>
-        <CitySelector currentCityId={cidadeId} currentCityName={cidadeNome} />
-      </header>
-
-      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 flex flex-col relative z-10">
-        {!cidadeId ? (
-          <div className="glass-panel rounded-[3rem] p-12 md:p-20 text-center mt-8 md:mt-16 flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto w-full">
-            <div className="text-8xl md:text-9xl mb-2 opacity-90 drop-shadow-2xl">­ƒòè´©Å</div>
-            <div>
-              <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white font-medium leading-tight text-glow">Onde voc├¬ est├í?</h2>
-              <p className="text-white/90 text-lg md:text-xl max-w-md mx-auto leading-relaxed text-glow">
-                Por favor, selecione sua cidade no bot├úo acima para descobrirmos os hor├írios e par├│quias mais pr├│ximas de voc├¬.
-              </p>
-            </div>
-          </div>
-        ) : (
-          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 w-full mt-6">
-            <NextMassCard nextMass={nextMass} />
-            <MassSchedule cidadeId={cidadeId} initialMissas={initialMissas} />
-          </div>
-        )}
-      </main>
-
-    </div>
+    <LayoutShell>
+      <div className="absolute inset-0 w-full h-full">
+        <MapComponent />
+      </div>
+    </LayoutShell>
   );
 }
diff --git a/missahoje-web/src/features/map/components/MapClient.tsx b/missahoje-web/src/features/map/components/MapClient.tsx
new file mode 100644
index 0000000..bccd499
--- /dev/null
+++ b/missahoje-web/src/features/map/components/MapClient.tsx
@@ -0,0 +1,63 @@
+"use client";
+
+import { useEffect } from 'react';
+import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
+import 'leaflet/dist/leaflet.css';
+import L from 'leaflet';
+import { useMapStore } from '../store/useMapStore';
+
+// Fix for default marker icon in Leaflet + Next.js
+const DefaultIcon = L.icon({
+  iconUrl: '/marker-icon.png',
+  iconRetinaUrl: '/marker-icon-2x.png',
+  shadowUrl: '/marker-shadow.png',
+  iconSize: [25, 41],
+  iconAnchor: [12, 41],
+  popupAnchor: [1, -34],
+  tooltipAnchor: [16, -28],
+  shadowSize: [41, 41]
+});
+L.Marker.prototype.options.icon = DefaultIcon;
+
+// Component to handle map events and sync with Zustand
+function MapEventsHandler() {
+  const setCenter = useMapStore((state) => state.setCenter);
+  const setZoom = useMapStore((state) => state.setZoom);
+
+  useMapEvents({
+    moveend: (e) => {
+      const map = e.target;
+      const newCenter = map.getCenter();
+      setCenter({ lat: newCenter.lat, lng: newCenter.lng });
+      setZoom(map.getZoom());
+    },
+  });
+
+  return null;
+}
+
+export default function MapClient() {
+  const center = useMapStore((state) => state.center);
+  const zoom = useMapStore((state) => state.zoom);
+  const userLocation = useMapStore((state) => state.userLocation);
+
+  return (
+    <MapContainer
+      center={[center.lat, center.lng]}
+      zoom={zoom}
+      className="w-full h-full z-0"
+      zoomControl={false}
+    >
+      <TileLayer
+        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
+        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
+      />
+      
+      {userLocation && (
+        <Marker position={[userLocation.lat, userLocation.lng]} />
+      )}
+      
+      <MapEventsHandler />
+    </MapContainer>
+  );
+}
diff --git a/missahoje-web/src/features/map/components/MapComponent.tsx b/missahoje-web/src/features/map/components/MapComponent.tsx
new file mode 100644
index 0000000..b43ea85
--- /dev/null
+++ b/missahoje-web/src/features/map/components/MapComponent.tsx
@@ -0,0 +1,41 @@
+"use client";
+
+import { useEffect, useState } from 'react';
+import dynamic from 'next/dynamic';
+import { useMapStore } from '../store/useMapStore';
+import { Loader2 } from 'lucide-react';
+
+const MapClient = dynamic(() => import('./MapClient'), {
+  ssr: false,
+  loading: () => (
+    <div className="flex items-center justify-center h-full w-full bg-parchment/80">
+      <Loader2 className="w-8 h-8 animate-spin text-primary" />
+    </div>
+  ),
+});
+
+export function MapComponent() {
+  const requestGeolocation = useMapStore((state) => state.requestGeolocation);
+  const permissionStatus = useMapStore((state) => state.permissionStatus);
+  const [mounted, setMounted] = useState(false);
+
+  useEffect(() => {
+    setMounted(true);
+    requestGeolocation();
+  }, [requestGeolocation]);
+
+  if (!mounted) return null;
+
+  return (
+    <div className="relative w-full h-full flex flex-col">
+      {permissionStatus === 'prompt' && (
+        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white shadow-md rounded-full px-4 py-2 text-sm flex items-center gap-2">
+          <Loader2 className="w-4 h-4 animate-spin text-primary" />
+          <span>Obtendo localiza├º├úo...</span>
+        </div>
+      )}
+      
+      <MapClient />
+    </div>
+  );
+}
diff --git a/missahoje-web/src/features/map/store/useMapStore.ts b/missahoje-web/src/features/map/store/useMapStore.ts
new file mode 100644
index 0000000..ee23281
--- /dev/null
+++ b/missahoje-web/src/features/map/store/useMapStore.ts
@@ -0,0 +1,70 @@
+import { create } from 'zustand';
+
+export type Coordinates = {
+  lat: number;
+  lng: number;
+};
+
+export type PermissionStatus = 'prompt' | 'granted' | 'denied';
+
+interface MapState {
+  center: Coordinates;
+  zoom: number;
+  userLocation: Coordinates | null;
+  permissionStatus: PermissionStatus;
+
+  // Actions
+  setCenter: (center: Coordinates) => void;
+  setZoom: (zoom: number) => void;
+  setUserLocation: (location: Coordinates) => void;
+  setPermissionStatus: (status: PermissionStatus) => void;
+  requestGeolocation: () => void;
+}
+
+// Default to a central location (e.g., center of Brazil) if no GPS
+const DEFAULT_CENTER: Coordinates = { lat: -14.235, lng: -51.9253 };
+const DEFAULT_ZOOM = 4;
+const DETAILED_ZOOM = 14;
+
+export const useMapStore = create<MapState>((set) => ({
+  center: DEFAULT_CENTER,
+  zoom: DEFAULT_ZOOM,
+  userLocation: null,
+  permissionStatus: 'prompt',
+
+  setCenter: (center) => set({ center }),
+  setZoom: (zoom) => set({ zoom }),
+  setUserLocation: (location) => set({ userLocation: location }),
+  setPermissionStatus: (status) => set({ permissionStatus: status }),
+
+  requestGeolocation: () => {
+    if (typeof window === 'undefined' || !navigator.geolocation) {
+      set({ permissionStatus: 'denied' });
+      return;
+    }
+
+    navigator.geolocation.getCurrentPosition(
+      (position) => {
+        const coords = {
+          lat: position.coords.latitude,
+          lng: position.coords.longitude,
+        };
+        set({
+          userLocation: coords,
+          center: coords,
+          zoom: DETAILED_ZOOM,
+          permissionStatus: 'granted',
+        });
+      },
+      (error) => {
+        console.error('Geolocation error:', error);
+        set({ permissionStatus: 'denied' });
+      },
+      {
+        enableHighAccuracy: true,
+        timeout: 5000,
+        maximumAge: 0,
+      }
+    );
+  },
+}));

```
