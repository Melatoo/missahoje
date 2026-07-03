---
name: 'MissaHoje Frontend Architecture'
type: architecture-spine
purpose: build-substrate
altitude: project
paradigm: 'Feature-based (Vertical Slices)'
scope: 'Frontend web application (missahoje-web)'
status: final
created: '2026-06-30'
updated: '2026-06-30'
binds: []
sources: ['ux-missahoje-2026-06-30']
companions: []
---

# Architecture Spine — MissaHoje Frontend

## Design Paradigm

**Feature-based (Vertical Slices)**
The frontend UI and logic are grouped by domain features rather than purely by technical types (like `atoms`/`molecules`). Each feature (e.g., `map`, `parish`) encapsulates its own components, hooks, and specific state, exposing only what is necessary. Generic UI elements (buttons, inputs) live in a shared `ui` namespace.

## Invariants & Rules

### AD-1 — Hybrid State Management (Zustand + URL)

- **Binds:** All state shared across components (Map, Filters, Lists).
- **Prevents:** Sluggish map performance from React Context re-renders, and the inability to share specific map/filter views via links.
- **Rule:** High-frequency, ephemeral state (map viewport coordinates, hover states) MUST be managed by **Zustand**. Low-frequency, shareable state (active filters, selected parish ID) MUST be managed via **URL Search Params**.

### AD-2 — Client-Side Data Fetching for Interactive Map

- **Binds:** API requests driven by user interaction (especially map panning).
- **Prevents:** Overloading the server with heavy Server Actions for bounding box updates, and redundant network requests.
- **Rule:** Dynamic data fetching triggered by map movements MUST use **TanStack Query (React Query)** combined with Axios for client-side caching and debounced bounding-box queries.

### AD-3 — Feature-Driven Project Structure

- **Binds:** Directory structure inside the Next.js `src` or `app` folder.
- **Prevents:** Fragmented codebases where changing one feature requires modifying 5 different directories (Atomic Design sprawl).
- **Rule:** Domain-specific code MUST live inside `features/<domain_name>` (e.g., `features/map`, `features/parish`). Only truly generic components may live in `components/ui`.

## Consistency Conventions

| Concern | Convention |
| --- | --- |
| Component Styling | **Tailwind CSS 4** via utility classes. No inline styles. |
| API Communication | **Axios** instances with pre-configured interceptors, wrapped by React Query hooks in the client. |
| Responsiveness | Mobile-first approach (`Bottom Sheet` pattern on mobile, `Sidebar` pattern on md+ viewports). |

## Stack

| Name | Version |
| --- | --- |
| Next.js (App Router) | 16.x |
| React | 19.x |
| Tailwind CSS | 4.x |
| TypeScript | 5.x |
| Zustand | latest |
| TanStack Query | latest |
| Axios | 1.x |

## Structural Seed

```text
missahoje-web/
  src/
    app/               # Next.js App Router (Pages & Layouts)
    components/
      ui/              # Generic shared components (Button, Input, Pills)
      layouts/         # Layout shells (Sidebar, Topbar)
    features/
      map/             # Map interactions, Zustand slice, map hooks
      parish/          # Parish list, BottomSheet/Sidebar detail view, queries
      search/          # Floating search bar, filter logic
    lib/               # Axios setup, utilities, query client config
```

## Deferred

- **Authentication & Authorization:** Deferred until a user-profile or admin requirement is specified. Current scope is public search.
- **Map Provider:** The specific map SDK (Google Maps vs Mapbox vs Leaflet) is deferred to implementation, provided it supports bounding-box events and React integration.
