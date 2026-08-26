# UI Decisions — SONIVIO

> Phase 6 artifact of the sharpen-the-axe workflow.
> Date: 2026-08-26 · Status: awaiting human approval (Phase 7 gate)

---

## Product direction

SONIVIO is a **record player for the web** — a music streaming app with a
developer/editorial aesthetic. The product voice is "the tracklist": numbered
sections, mono metadata, a self-drawing waveform signature, and a cinematic
dark-first atmosphere. Target user: a music lover who appreciates craft and
keyboard-first tools.

## Visual direction — "The Tracklist" (editorial audio-console)

### Character
- Tone: late-night listening session — focused, warm, confident.
- Density: medium-high (music-app density, Spotify-class), never cramped.
- Professionalism: engineered, mono-labeled, period-terminated headlines.

### Typography
- Keep **Geist** (400/500/600) + **Geist Mono** (400/500) — no new fonts.
- Establish an explicit page-header scale: mono eyebrow (10–12px) → display
  headline (32–48px, negative tracking) → lead (16–18px body).
- Section headers: numbered mono index + display-sm headline (already the Home
  pattern — extend to ALL pages).
- Metadata floor: 11px minimum for metadata, 12px for titles (fixes the 9–10px
  outliers outside mono eyebrows).

### Color strategy
- Keep the ink/canvas/hairline token system + mesh gradient as the only decoration.
- **Link blue #0070f3 = the "playing" signal** — active track, active tab accents,
  equalizer. One semantic accent, used consistently.
- Light mode becomes a first-class citizen: mesh opacity, glass frost, and waveform
  all get light-mode variants (fixes B1/D9).

### Layout rhythm
- Keep the 4-step surface ladder + polarity-flipped ink bands.
- One atmospheric layer per banner (fixes D4/D6): featured banner keeps the mesh;
  artist banner keeps the blurred artwork; no mesh+glass+sheen stacking.
- Rails keep snap-scroll + edge fades; grids keep 2→3→4→5 column rhythm.

### Component language
- **Radius rules** (fixes D1): cards 8px · controls/inputs 6px · CTAs pill (full) ·
  inline icon buttons 4px. No mixed-radius clusters.
- Buttons: ink pill = primary; canvas pill with hairline = secondary; ghost icon
  buttons for tertiary.
- Cards: hairline + card-shadow-lvl3, hover → lvl4 + border-strong. One hover
  language (lift + border), not three (fixes D8).
- Empty states: equalizer/waveform motif + mono caption + action hierarchy
  (adapts shadcn Empty composition, brand voice).

### Iconography
- Keep lucide-react; consistent strokeWidth (1.8 idle / 2.2 active), consistent
  13–16px sizes in controls, 18–20px in nav.

### Imagery
- YouTube thumbnails remain the imagery; square crops in cards, blurred artwork as
  atmosphere in the expanded player and artist banner.

### Motion
- Keep the existing choreography system (a-* classes, --d delays, springs) — it is
  the brand.
- Reduce: 3D tilt only on large cards (or remove from rails — decision: keep tilt
  but only on hover, remove `will-change` from idle cards).
- New motion only where it serves function: dialog/palette entrances, command
  palette open/close, autocomplete dropdown.
- All new motion GPU-only + `prefers-reduced-motion` safe.

### Things to avoid (explicit)
- No new gradients, glass, glow, or grain beyond what exists.
- No decorative animation without a UX reason.
- No new fonts, no 3D scenes, no WebGL.
- No copied visual identity (Spotify/Apple Music are references, not templates).

---

## Component decisions

| Surface | Current | Selected resource | URL | Decision reason |
|---|---|---|---|---|
| Create-playlist modal | Custom div, no a11y | Base UI `Dialog` + brand chrome | https://base-ui.com/react/components/dialog | Focus trap, aria-modal, Escape, scroll lock, focus restore |
| Context menu (SongCard) | Custom, mouse-only | Base UI `Context Menu` + brand chrome | https://base-ui.com/react/components/context-menu | Arrow-key nav, focus management, submenu support |
| Keyboard help (`?` shortcut) | Dead state, nothing renders | cmdk `Command` in Base UI Dialog | https://github.com/dip/cmdk | Revives feature as a real command palette with shortcuts + quick actions |
| Search autocomplete | Custom, mouse-only | cmdk `Command` (combobox) | https://github.com/dip/cmdk | Arrow-key nav, type-ahead filtering, thumbnails |
| Empty states | Plain icon+text | shadcn Empty pattern (custom impl) | https://ui.shadcn.com/docs/components/base/empty | Structured composition + brand voice, no dep |
| Toasts | Custom (undo + progress) | Keep custom | — | Already superior to Sonner for this product |
| Seek/volume sliders | No visible focus | Custom CSS fix | — | Focus ring + aria-valuetext |
| Featured/artist banners | Effect stacking | Custom design pass | — | One atmospheric layer per banner |
| Light-mode waveform | White-on-white (broken) | Custom fix | — | Ink-tinted strokes in light mode |

## Human-approved decisions

None yet — awaiting Phase 7 gate. No `HUMAN_PREFERRED_RESOURCES.md` exists.

## Deliberately excluded patterns

- Glassmorphism beyond the existing glass-bar/glass-panel utilities.
- Gradient text beyond the existing hero accent line.
- Decorative particle/meteor/glow effects (Magic UI etc.).
- New font families.
- Sonner / any toast replacement.
- Command palette as a full app navigator (scope: shortcuts + quick actions only).

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| Base UI over Radix | Newer library (v1.x) vs Radix's longer track record; mitigated by MUI stewardship + shadcn default status |
| cmdk for autocomplete | Replaces the custom dropdown; must preserve debounce + API flow; cmdk filtering is client-side only (we keep server search) |
| 2 new dependencies | Justified: both headless, MIT, solve diagnosed a11y gaps; removes 2 dead deps (axios, react-beautiful-dnd) netting ~zero weight |
| Light-mode tuning | Risk of dark-mode regressions; mitigated by scoped overrides + screenshot QA both themes |

## Implementation order

Per protocol (foundations → layout → typography → components → responsive →
states → motion → polish):

1. **W9** — remove dead deps (axios, react-beautiful-dnd, @types/react-beautiful-dnd)
2. **W1** — light-mode foundation (waveform ink variant, glass/mesh light tuning)
3. **W3 + W6** — page-header scale + radius rules (global.css tokens + page headers)
4. **W2a** — Base UI Dialog for create-playlist modal (+ focus trap, Escape)
5. **W2b** — Base UI Context Menu for SongCard
6. **W2c** — cmdk command palette (`?`) + search autocomplete upgrade
7. **W4, W7, W10** — featured banner, artist banner, About page voice pass
8. **W5** — empty states (brand voice)
9. **W2d** — slider focus rings, skip link
10. **W11** — toast positioning
11. **W12** — perf hygiene (will-change, image dimensions)
12. Validation (build, astro check, screenshots light/dark × desktop/mobile,
    keyboard walkthrough) → QA_REPORT.md + OPEN_ITEMS.md

## Acceptance criteria (summary)

- `npm run build` + `npx astro check` pass.
- Light mode: waveform visible, no white-on-white, mesh/glass tuned.
- `?` opens a keyboard-operable command palette; Escape closes it.
- Create-playlist modal: focus trapped, aria-modal, Escape closes, focus restored.
- Context menu: arrow-key navigable, Escape closes.
- Search autocomplete: keyboard navigable, thumbnails shown.
- Sliders: visible focus ring.
- Empty states: brand voice.
- No regression in playback, persistence, routing, or API behavior.