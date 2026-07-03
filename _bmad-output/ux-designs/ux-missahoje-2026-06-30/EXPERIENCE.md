---
name: MissaHoje UX Experience
status: final
updated: 2026-06-30
---

# Foundation

- **Platform:** Mobile-first web application (Next.js). Responsive design ensures the primary interaction paradigm adapts gracefully to Desktop (Map right, Sidebar left).
- **UI System:** Based on Shadcn/UI (Tailwind CSS). `DESIGN.md` contains the visual overrides (Sacred Minimalist).
- **Core Paradigm:** Utilitarian, Map-centric discovery. The app solves a specific problem (finding the nearest mass) quickly and without judgment.

# Information Architecture

1. **Discovery Map (Home Screen)**
   - Full-screen map view.
   - Floating search bar (Search by Parish name or location).
   - Horizontal scrollable quick filters ("Parking", "Accessible", "Nearest").
   - Interactive Map Pins.
2. **Parish Quick View (Bottom Sheet - Collapsed)**
   - Appears upon clicking a pin.
   - Shows Name, Distance, quick infrastructure badges.
   - Primary Call to Action: "Ver horários de missas".
3. **Parish Detail View (Bottom Sheet - Expanded)**
   - Takes over the screen.
   - Header image with back button.
   - Parish Name, Address/Distance.
   - Infrastructure Badges.
   - Mass Times grouped by Day (Today first).

# Voice and Tone

- **Tone:** Reverent, helpful, calm, objective.
- **Rules:** No gamification language ("Level up your faith!"). Keep microcopy purely functional and respectful.

# Component Patterns (Behavioral)

- **Map Pins:** Clicking a pin centers the map on it and raises the Quick View Bottom Sheet.
- **Badges:** Purely informational. They represent binary infrastructure states (Has Parking: Yes/No).
- **Bottom Sheet:** Must support gesture swiping on mobile (swipe up to expand, swipe down to collapse). On Desktop, this is a fixed sidebar that slides in from the left.

# State Patterns

- **Mass Time States:**
  - *Past:* Opacity 40%, line-through (Strikethrough). Represents finality without removing data.
  - *Next/Current:* Solid background (Marian Blue), white text, accompanied by a small "Próxima" or "Daqui a X min" tag. Draws immediate visual focus.
  - *Future:* Standard text styling.

# Interaction Primitives

- **Navigation:** The map never unloads. All parish interactions happen on Z-index layers above the map to maintain contextual grounding.
- **Filtering:** Instant visual updates. Toggling "Parking" immediately removes non-compliant pins from the map without page reloads.

# Accessibility Floor

- High contrast required between text and the parchment background.
- Minimum tap target size of 44x44px for map pins and quick filters.
- Screen readers must read the "Next" mass time first when navigating the schedule.

# Key Flows

## Flow 1: The Rushed Commuter (Finding immediate peace)
1. User opens the app. GPS locates them.
2. The map populates with nearby parishes (TotalPass style, strictly proximity).
3. User spots a pin 1.2km away and taps it.
4. Quick View Bottom Sheet rises. User sees the "Parking" badge and is relieved.
5. User taps "Ver horários de missas".
6. Sheet expands. "Hoje" is highlighted. The 18:30 mass is marked as "Próxima" (Daqui a 30 min).
7. User closes the phone and drives to the parish.
