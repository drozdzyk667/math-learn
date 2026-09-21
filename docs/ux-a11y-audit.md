# UX / UI / Accessibility audit

Target: WCAG 2.2 AA where applicable to the current client-side MVP.

## Changes implemented

### Information architecture
- Practice now combines the current exercise with contextual theory.
- Each topic exposes a short explanation, key formula, learning tip, curiosity and common mistake next to the task.
- The full knowledge base remains available as a deeper reference rather than being a disconnected flow.

### Readability
- Increased navigation, lesson, status, icon and helper text sizes.
- Increased touch targets to at least 44px for primary interactive controls.
- Increased parameter labels and values in the function laboratory.
- Mathematical expressions use KaTeX instead of keyboard-style notation.

### Colour and feedback
- Hint action: filled yellow with dark text.
- Solution action: filled red with white text.
- Random variant action: filled purple with white text.
- Colour is never the only signal: every state also has text and/or an icon.
- Feedback messages use a live status region.

### Keyboard and focus
- Added a skip-to-content link.
- Added visible focus indicators.
- Active navigation exposes aria-current.
- Hint and solution toggles expose aria-expanded and aria-controls.
- Assessment zoom controls are keyboard accessible.

### Motion
- Added prefers-reduced-motion handling.

### High contrast
- Added forced-colors fallbacks for key controls and paper content.

### Function laboratory
- Desktop cards use explicit, identical block dimensions.
- Dynamic vertex/linear state occupies a fixed slot.
- SVG is block-level and constrained to a fixed panel.
- This prevents layout movement when a reaches 0.
- Graph SVG has title and description for assistive technology.

### Assessment sheets
- A4 aspect and dimensions retained.
- Default on-screen zoom increased.
- Added zoom-out / zoom-in controls from 80% to 150%.
- Sheets live in their own horizontally scrollable viewport.
- Mathematics on the white paper is forced to dark ink independently of app theme.
- Increased task, input, metadata and mathematical expression sizes.

## Verification

CI checks:
- ESLint
- TypeScript typecheck
- production Next.js build

## Follow-up audit recommended before production

The following should still be performed in a real browser before calling the product fully WCAG 2.2 AA conformant:
- axe / Lighthouse scan of every view in both themes;
- NVDA + Chrome or VoiceOver + Safari screen-reader pass;
- keyboard-only test of every flow;
- contrast measurement for every custom state;
- browser zoom test at 200% and text-only zoom;
- iOS Safari and Android Chrome touch-target / overflow check;
- assessment paper zoom behaviour in Firefox and Safari.
