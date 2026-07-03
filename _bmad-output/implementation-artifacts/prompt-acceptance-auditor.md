
You are an Acceptance Auditor. Review this diff against the spec and context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

## Spec

```markdown
---
epic: 1
story: 2
baseline_commit: 2237a0b9b8cbf2cad971a50e3e836048de457891
---

# Story 1.2: Mapa em Tela Cheia e Localização GPS

Status: done

## Story

As a user,
I want to see a full-screen interactive map that centers on my location,
So that I can easily find parishes near me.

## Acceptance Criteria

1. **Given** the user opens the application
   **When** the map interface loads
   **Then** it should display a full-screen interactive map
   **And** prompt the user for GPS permission
   **And** center the map on the user's coordinates if permission is granted

## Developer Context

This story focuses on the primary map interface and user geolocation. It builds upon the Layout Shell created in Story 1.1.

### Technical Requirements

- **Geolocation API**: Use the browser's native `navigator.geolocation.getCurrentPosition` to request GPS permission and fetch user coordinates.
- **Map Library**: Integrate a mapping library (e.g., `react-leaflet` with OpenStreetMap or `react-map-gl`). Since no specific library was enforced in the architecture spine for rendering the map, use a robust React-compatible map library.
- **State Management**: Store the user's geolocation and the map's current center/zoom in a Zustand store specifically for the map feature. Handle permission states (granted, denied, prompt) gracefully.

### Architecture Compliance

- **Domain-Driven**: All map-related code must reside in `missahoje-web/src/features/map`.
- **State**: Ephemeral map state (pan/zoom/center) must use Zustand to avoid excessive re-renders (AD-1).
- **Responsive Shell**: The map must be rendered within the `LayoutShell` (Desktop Sidebar vs Mobile) implemented in Story 1.1.

### Previous Story Intelligence

- **From 1.1 (Setup do Projeto e Arquitetura Base)**:
  - Project uses Next.js App Router, Tailwind CSS 4, Zustand, and TanStack React Query.
  - Core layouts and fonts (Cinzel, Lora, Inter) are already configured.
  - The map should be integrated into `missahoje-web/src/app/page.tsx` or similar entry point within `LayoutShell.tsx`.

### File Structure Requirements

- `missahoje-web/src/features/map/components/MapComponent.tsx` (or similar)
- `missahoje-web/src/features/map/store/useMapStore.ts` (Zustand store for map state)
- Update `missahoje-web/src/app/page.tsx` to render the map component.

### Testing Requirements

- The map component should render without crashing.
- Geolocation permission prompt should trigger on load or via a clear user action.
- Fallback coordinates should be used if GPS permission is denied.

## Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Suggested Review Order

**State & Geolocation Logic**

- Zustand store tracking map center, zoom, and handling native geolocation requests
  [useMapStore.ts:25](../../missahoje-web/src/features/map/store/useMapStore.ts#L25)

**Map Components**

- Dynamically imported wrapper that handles SSR limitations and loading state
  [MapComponent.tsx:18](../../missahoje-web/src/features/map/components/MapComponent.tsx#L18)

- Core react-leaflet map instance and viewport synchronization
  [MapClient.tsx:32](../../missahoje-web/src/features/map/components/MapClient.tsx#L32)

**UI Binding**

- Main page updated to render the map within the Layout Shell
  [page.tsx:5](../../missahoje-web/src/app/page.tsx#L5)

**Dependencies**

- Added Leaflet, React-Leaflet, and Lucide React packages
  [package.json:14](../../missahoje-web/package.json#L14)


```

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
