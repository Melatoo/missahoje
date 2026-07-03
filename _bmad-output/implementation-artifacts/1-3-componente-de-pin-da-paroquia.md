---
epic: 1
story: 3
baseline_commit: e577171b31277debc77a1130b6676302ed03cfc6
---

# Story 1.3: Fetching de Paróquias e Pins Interativos

Status: review

## Story

As a user,
I want to see pins on the map representing parishes in my current view,
So that I know exactly where they are located.

## Acceptance Criteria

1. **Given** the map is centered on a specific area
   **When** the user pans or zooms the map
   **Then** the client must fetch parishes in that Bounding Box using TanStack Query and Axios
   **And** display them using the "Map Pin" component, which must have rest, hover, and active visual states

## Developer Context

This story implements the fetching of parish data based on the map's current bounding box and displays interactive map pins. It builds upon the interactive map created in Story 1.2.

### Technical Requirements

- **Data Fetching**: Use TanStack Query (React Query) to fetch parishes based on the map's current bounding box (bounds).
- **HTTP Client**: Use Axios for making requests to the backend API. Ensure error handling follows the project rules (isolated try/catch in the client).
- **Map Interaction**: The map component (`react-leaflet`) must trigger a refetch or bounding box update whenever the user pans or zooms.
- **Component**: Create a custom Map Pin component (e.g., as a Leaflet Marker with a Custom Icon or DivIcon) that supports three visual states: rest, hover, and active (selected). Use the Sacred Minimalist design tokens (Pastel Blue, etc.).

### Architecture Compliance

- **Domain-Driven**: The new map pin component should reside in `missahoje-web/src/features/map/components` or `features/parish/components`.
- **State**: Ephemeral state like "hovered pin" can be managed locally. The selected pin (active) will likely be needed globally soon.
- **API integration**: Since the backend isn't fully implemented or detailed for this endpoint yet, the developer must either define the Axios service calling the expected NestJS endpoint (`/parishes?bbox=...`) or use a mock if the backend is not available. 

### Previous Story Intelligence

- **From 1.2 (Mapa em Tela Cheia)**:
  - The map uses `react-leaflet`. The `MapClient.tsx` handles the core map instance.
  - We have a dynamically imported `MapComponent.tsx` and `useMapStore.ts` tracking center and zoom.
  - The developer should integrate a bounding box tracking mechanism (e.g., Leaflet's `useMapEvents`) into `MapClient.tsx` and sync it with `useMapStore` or directly with React Query.

### File Structure Requirements

- `missahoje-web/src/features/map/components/MapPin.tsx`
- `missahoje-web/src/features/map/services/parishMapService.ts` (for Axios calls)
- Update `missahoje-web/src/features/map/components/MapClient.tsx` to include the fetching logic and render pins.
- Update `missahoje-web/src/features/map/store/useMapStore.ts` to store map bounds.

### Testing Requirements

- Verify that panning/zooming triggers a new network request with updated bounding box parameters.
- Verify that pins render correctly on the map.
- Verify that the pins change styling on hover and click (active).

## Project Context Reference

- Use strictly TypeScript, avoid explicit `any`.
- Next.js Web: Use `export default` for pages/layouts, and named exports for smaller components, hooks, utilities.
- Catch Axios errors gracefully without crashing the UI.

## Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Completion Notes
- Added `bounds` to `useMapStore` to track `southWest` and `northEast` coordinates.
- Created `types.ts` for map-specific types (`MapBounds`, `Parish`).
- Created a mock service in `parishMapService.ts` using `setTimeout` to simulate latency and generating 5 random parishes within the current map bounds.
- Created `MapPin.tsx` utilizing Leaflet's `divIcon` to render a custom React component using `lucide-react`'s `MapPinIcon` and Tailwind classes for styling (rest, hover, active).
- Updated `MapClient.tsx` to handle `map.getBounds()` inside `MapEventsHandler` and trigger the TanStack React Query (`useQuery`) to fetch parishes dynamically based on bounds.
- Ignored a Next.js standard `setState` in `useEffect` lint warning in `MapComponent.tsx` and resolved an unused import warning in `parishMapService.ts`.

### Change Log
- 2026-07-01: Developed Map Store bounds logic, Parish Map Service, MapPin component, and integrated React Query into MapClient.

### File List
- `missahoje-web/src/features/map/components/MapClient.tsx` (Modified)
- `missahoje-web/src/features/map/components/MapComponent.tsx` (Modified)
- `missahoje-web/src/features/map/components/MapPin.tsx` (New)
- `missahoje-web/src/features/map/services/parishMapService.ts` (New)
- `missahoje-web/src/features/map/store/useMapStore.ts` (Modified)
- `missahoje-web/src/features/map/types.ts` (New)
