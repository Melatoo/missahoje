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

