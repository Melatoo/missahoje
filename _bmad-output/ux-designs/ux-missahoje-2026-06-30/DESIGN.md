---
name: MissaHoje UX Design System
status: final
updated: 2026-06-30

colors:
  primary:
    DEFAULT: "#0f2c59" # Deep Marian Blue
    foreground: "#ffffff"
  secondary:
    DEFAULT: "#d4af37" # Vatican Gold
    foreground: "#1a252f"
  background: "#fcfaf8" # Off-white Parchment
  surface:
    DEFAULT: "#ffffff"
    muted: "#f3ece1"
  text:
    main: "#1a252f"
    muted: "#2c3e50"

typography:
  fonts:
    heading: "Cinzel, serif"
    serif: "Lora, serif"
    sans: "Inter, sans-serif"

rounded:
  default: "0.25rem" # More structured, classic geometry
  large: "0.5rem"
  sheet: "1.5rem" # Used only for the bottom sheet expansion
  
spacing:
  base: "0.25rem"
---

# Brand & Style

**Sacred Minimalist.** The aesthetic must evoke reverence and tradition without sacrificing modern utilitarian usability. It avoids the "bubbly, generic tech startup" look in favor of classic elegance. It feels like opening a modern, digital missal.

# Colors

- **Marian Blue (`#0f2c59`):** Used for primary actions, heavy emphasis, and highlighting the "Next Mass". Provides a strong, trustworthy, and solemn base.
- **Vatican Gold (`#d4af37`):** Used for accents, ornamental dividers, and subtle highlights.
- **Parchment Background (`#fcfaf8`):** An off-white background that removes the harshness of pure white, giving a subtle nod to physical paper/scriptures.

# Typography

- **Headings (`font-heading` - Cinzel):** Used strictly for major titles (Parish Names, Main section headers).
- **Secondary Headings/Dates (`font-serif` - Lora):** Used for days of the week, classical italicized subtext, and conveying elegance.
- **Data/UI text (`font-sans` - Inter):** Used for mass times, badges, buttons, and anything that requires instant, legible scanning while on the move.

# Elevation & Depth

- **Map Pins:** Slight shadow to lift them off the map.
- **Bottom Sheet/Cards:** A strong upward shadow `shadow-[0_-10px_20px_rgba(0,0,0,0.2)]` when expanded to separate the content layer from the map layer behind it.

# Shapes

- **Ornamental Dividers:** Instead of thick solid lines, use thin 1px lines with subtle diamond (rotated square) accents in the center (`♦`).
- **Corners:** Kept relatively sharp (small border radius) for internal elements (buttons, badges) to maintain a sober, adult look. The main bottom sheet retains a larger radius for the physical affordance of sliding up.

# Components (Base: Shadcn/UI)

- **Badges:** White background, light parchment border, uppercase tracking-wider text, accompanied by an emoji/icon.
- **Buttons:** Solid Marian Blue, sharp corners, bold sans-serif text.
- **Mass Time List:** A vertical list grouped by day. Past times are dimmed and struck through. The *Next* time is a solid blue block. Future times are standard text.

# Do's and Don'ts

- **DO** use the Gold accent sparingly to make it feel special.
- **DO** keep the UI strictly utilitarian. Let the typography do the heavy lifting for the "sacred" feel.
- **DON'T** use 5-star rating UI components. We do not judge or rank parishes.
- **DON'T** use generic tech illustrations or heavy drop shadows on text.
