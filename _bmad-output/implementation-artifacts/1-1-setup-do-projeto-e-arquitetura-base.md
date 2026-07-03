---
baseline_commit: 1d1883ca67715cafd6321be243e1ddb322684de4
---

# Story 1.1: Setup do Projeto e Arquitetura Base

Status: done

## Story

As a developer,
I want to set up the initial Next.js project with Tailwind CSS 4, Zustand, React Query, and Axios following the feature-based architecture spine,
so that the foundation is ready for all subsequent map and parish features.

## Acceptance Criteria

1. **Given** the developer initializes the project
   **When** they set up the framework
   **Then** the project must be a Next.js (App Router) application with Tailwind CSS 4 installed.

2. **Given** the project is initialized
   **When** the developer creates the folder structure
   **Then** the `src/features/map`, `src/features/parish`, `src/features/search`, `src/components/ui`, `src/components/layouts` and `src/lib` directories must be created.

3. **Given** the global state requirements
   **When** setting up state management
   **Then** Zustand and TanStack Query (React Query) must be installed and configured with a basic QueryClientProvider at the root.

4. **Given** the UX typography requirements
   **When** configuring fonts
   **Then** Cinzel (headings), Lora (serif), and Inter (sans) from Google Fonts must be properly loaded and configured in Tailwind.

5. **Given** the UX experience requirements
   **When** setting up the layout shell
   **Then** a basic responsive shell must be created supporting a Sidebar on desktop and a mobile layout.

## Tasks / Subtasks

- [x] Initialize Next.js App Router project
- [x] Install and configure Tailwind CSS 4
- [x] Create the Feature-based folder structure
- [x] Install Zustand and TanStack React Query
- [x] Setup `QueryClientProvider` and `Axios` in `src/lib`
- [x] Import and configure Google Fonts (Cinzel, Lora, Inter)
- [x] Set up the basic layout shell (Desktop Sidebar vs Mobile)

## Dev Notes

- **Architecture:** Feature-based (Vertical Slices). Avoid `atoms`/`molecules` atomic sprawl. Keep domain-specific code inside `features/<domain_name>`. [Source: `ARCHITECTURE-SPINE.md`]
- **State Management:** Ephemeral state uses Zustand, while shareable state uses URL Search Params (AD-1). [Source: `ARCHITECTURE-SPINE.md`]
- **Data Fetching:** Client-side via TanStack Query and Axios (AD-2). [Source: `ARCHITECTURE-SPINE.md`]
- **Styling:** Tailwind CSS 4 via utility classes. [Source: `ARCHITECTURE-SPINE.md`]
- **Typography:** Cinzel for major titles, Lora for secondary/dates, Inter for data/UI text. [Source: `DESIGN.md`]
- **Colors:** Primary (Marian Blue `#0f2c59`), Secondary (Vatican Gold `#d4af37`), Background (Parchment `#fcfaf8`). [Source: `DESIGN.md`]

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming):
  - `src/app/`
  - `src/components/ui/`
  - `src/components/layouts/`
  - `src/features/map/`
  - `src/features/parish/`
  - `src/features/search/`
  - `src/lib/`

### References

- Architecture Spine: `_bmad-output/architecture/architecture-missahoje-2026-06-30/ARCHITECTURE-SPINE.md`
- UX Design: `_bmad-output/ux-designs/ux-missahoje-2026-06-30/DESIGN.md`
- UX Experience: `_bmad-output/ux-designs/ux-missahoje-2026-06-30/EXPERIENCE.md`
- Epics: `_bmad-output/planning-artifacts/epics.md`

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Suggested Review Order

**Application Core & Layout**

- Configured global fonts and Query Client Provider
  [`layout.tsx:16`](../../missahoje-web/src/app/layout.tsx#L16)

- Created basic Layout Shell (Desktop Sidebar vs Mobile)
  [`LayoutShell.tsx:5`](../../missahoje-web/src/components/layouts/LayoutShell.tsx#L5)

**Styling & Configuration**

- Set up global font variables in Tailwind
  [`globals.css:13`](../../missahoje-web/src/app/globals.css#L13)

- Defined React Query Provider instance
  [`react-query.tsx:6`](../../missahoje-web/src/lib/react-query.tsx#L6)

### Review Findings
- [ ] [Review][Decision] Removed "Fim de Semana" tab — Was this intentional for mobile UX? Needs human input.
- [ ] [Review][Decision] Cookie expiration slashed from 1 year to 30 days — Needs human input to confirm UX degradation is acceptable.
- [ ] [Review][Decision] Color Palette Deviates — Uses HSL instead of hex codes from spec.
- [ ] [Review][Patch] Missing Assets (favicon.ico) [favicon.ico:1]
- [ ] [Review][Patch] Runtime Crash Risk in NextMassCard.tsx [src/components/NextMassCard.tsx:44]
- [ ] [Review][Patch] LayoutShell.tsx is created but never used [src/components/layouts/LayoutShell.tsx:1]
- [ ] [Review][Patch] Zustand installed but not configured [package.json:1]
- [ ] [Review][Patch] CSS box-shadow hack on body [src/app/globals.css:45]
- [ ] [Review][Patch] Missing Server Revalidation [src/app/actions.ts:1]
- [ ] [Review][Patch] Missing items array check [src/components/CitySelector.tsx:18]
- [ ] [Review][Patch] Empty dropdown without feedback [src/components/CitySelector.tsx:68]
- [ ] [Review][Patch] getMissas API call silent failure [src/components/MassSchedule.tsx:24]
- [ ] [Review][Patch] Crash calling slice on undefined time [src/components/MassSchedule.tsx:32]
- [ ] [Review][Patch] Data fetching uses native hooks instead of React Query [src/components/CitySelector.tsx:1]
- [ ] [Review][Patch] Components outside feature slices [src/components/CitySelector.tsx:1]
- [ ] [Review][Patch] Missing Axios Setup in lib [src/lib/axios.ts:1]
