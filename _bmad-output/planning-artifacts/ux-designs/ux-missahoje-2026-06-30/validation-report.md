# Validation Report — missahoje

- **DESIGN.md:** `DESIGN.md`
- **EXPERIENCE.md:** `EXPERIENCE.md`
- **Run at:** 2026-06-30T22:45:00Z

## Overall verdict
Adequate but thin. The visual tokens are well-defined and the focus on accessibility is strong. However, component naming is inconsistent between the two spines, and critical error/offline states for a location-based mobile app are missing. The accessibility rules are great but should explicitly mandate text labels for icons to fully support elderly users.

## Category verdicts
- Flow coverage — adequate
- Token completeness — strong
- Component coverage — thin
- State coverage — thin
- Visual reference coverage — adequate
- Bloat & overspecification — strong
- Inheritance discipline — thin
- Shape fit — strong

## Findings by severity

### High (1)
**[State coverage]** — Missing Error/Offline states (EXPERIENCE.md)
For a location-based app, handling offline or location-denied states is critical.
Fix: Add Error and Offline state patterns.

### Medium (3)
**[Component coverage]** — Inconsistent component names (Both files)
DESIGN.md uses "Card Próxima Missa" and "City Selector", while EXPERIENCE.md uses "Cards de Missa" and "Seletor de Localização".
Fix: Use identical names in both files.

**[Inheritance discipline]** — Inconsistent component names (Both files)
See Component coverage for naming inconsistencies.
Fix: Use identical names in both files.

**[Accessibility Reviewer]** — Iconography labels (EXPERIENCE.md)
While text scaling is mentioned, there is no specific guidance on iconography. Elderly users benefit from icons paired with text labels.
Fix: Specify that all interactive icons must have clear text labels.

### Low (1)
**[Flow coverage]** — Only happy path documented (EXPERIENCE.md)
Only the main "happy path" flow is detailed.
Fix: Add a flow for when the user denies location permission or there are no masses.

## Reviewer files
- `review-rubric.md`
- `review-accessibility.md`
