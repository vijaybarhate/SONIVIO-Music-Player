# Current State — SONIVIO Music Player

> Phase 1 artifact of the sharpen-the-axe workflow.
> Date: 2026-08-26 · Status: complete
> Method: full source inspection + live rendering (dev server :4599, headless Chrome,
> dark/light × desktop/mobile) with real YouTube data.

---

## 1. What exists today

A complete, working music player with 6 routes, persistent playback across Astro view
transitions, 4 Zustand stores, a serverless YouTube proxy, and a Vercel-inspired
"stark + cinematic" visual language that has already been through two polish passes
(liquid-glass + choreography, cinematic godly pass).

### Visual hierarchy (per page)

- **Home**: hero (mesh + grain + mask-reveal headline + self-drawing waveform) →
  featured glass banner → numbered section rails (01–05) → genre marquee → mood mixes.
  Strong editorial rhythm; numbered mono indices give it a "tracklist" feel.
- **Search**: eyebrow + display headline → centered search bar with autocomplete →
  genre browse grid (inactive) / results grid (active) with pill tabs.
- **Library**: eyebrow + headline → sliding pill tabs → favorites grid / playlist
  cards / virtualized history list.
- **Artist**: ink polarity-flipped banner (blurred art + mesh) → popular/latest rails.
- **PlaylistDetail**: back link → cover + metadata + Play/Shuffle → numbered track list.
- **About**: cinematic header band → feature cards → spec table → footer links.

### Interaction patterns

- Spring physics everywhere (framer-motion), layoutId sliding pills (tabs, sidebar,
  bottom nav), 3D tilt on vertical song cards, ink-wash hover sweep on mood/genre
  cards, artwork crossfade on track change, morphing play/pause icon with halo ring,
  scrub tooltip + glow thumb on seek, equalizer bars on active tracks, toast stack
  with undo, right-click context menus, keyboard shortcuts (space/N/P/M/F/L/?/arrows).

### Motion system

- CSS choreography classes with `--d` delay vars (riseIn, slideL/R, popIn, wipeRight,
  wipeDown, lineUp mask reveals, drawLine, wipeX, sheen) — all GPU-only
  (transform/opacity/filter), all killed under `prefers-reduced-motion`.
- Ambient: mesh drift (28s), grain overlay, breathe on expanded artwork, marquee (36s).
- Framer-motion for interactive springs + scroll reveals (`whileInView`, once).

### Responsive behavior

- Desktop: sidebar (240px) + 88px player bar + full controls.
- Mobile: bottom nav (h-14) + compact player (bottom-14) with like/play/next only;
  full controls in ExpandedPlayer. Rails scroll horizontally with snap + edge fades.
- Grids: 2→3→4→5 columns for cards; 2→3 for mood mixes; 1→2 for search results.

### Theming

- Light + dark via `.dark` class on `<html>`, token swap in `:root`/`.dark`, persisted
  in localStorage, respects `prefers-color-scheme` on first load, re-applied on
  `astro:after-swap`.

---

## 2. What already works well (keep)

1. **Coherent design language** — tokens, mono eyebrows, sentence-case headlines,
   stacked shadows, mesh gradient: one system, applied consistently.
2. **Cinematic hero** — mask-reveal headline + drifting mesh + grain is distinctive
   and not generic AI-slop.
3. **Signature waveform** — self-drawing SVG is a genuine brand moment (in dark mode).
4. **Player chrome** — glass bars, morphing play icon, halo ring, scrub tooltip,
   artwork crossfade: feels engineered, not templated.
5. **Persistent playback** — `transition:persist` islands keep audio alive across
   navigation; this is the product's core magic and must not break.
6. **Micro-interactions** — ink-wash hover on mood cards, layoutId pills, equalizer
   on active tracks: purposeful, restrained.
7. **Empty/loading/error states exist** for every data surface (skeletons, equalizer
   loader, inline retry, empty states with actions).
8. **Keyboard shortcuts** — space/N/P/M/F/L/?/arrows with input-guard.
9. **Reduced-motion support** — comprehensive kill-switch in CSS.
10. **Dark mode is the hero mode** — the app looks genuinely premium in dark.

---

## 3. What is weak / generic / broken

### Bugs (functional/visual)

| # | Issue | Severity | Location |
|---|---|---|---|
| B1 | **Waveform invisible in light mode** — strokes/fills are pure white; on light canvas it disappears entirely | High | `Waveform.tsx` |
| B2 | **Keyboard-help modal never renders** — `?` toggles `isKeyboardHelpOpen` but no component consumes it (dead feature) | Medium | `uiStore`, `useKeyboardShortcuts` |
| B3 | **No visible keyboard focus on seek/volume sliders** — `focus-visible:outline-none` on the range inputs | Medium | `ProgressBar.tsx`, `VolumeControl.tsx` |
| B4 | **Create-playlist modal is not a real dialog** — no focus trap, no `role="dialog"`/`aria-modal`, no Escape-to-close, backdrop click only | Medium | `Library.tsx` |
| B5 | **ContextMenu is mouse-only** — no keyboard navigation, no focus management | Low-Med | `ContextMenu.tsx` |
| B6 | **Dead dependencies** — axios, react-beautiful-dnd installed, unused | Low | `package.json` |
| B7 | **No skip link** for keyboard users | Low | `Layout.astro` |

### Design weaknesses

| # | Issue | Evidence |
|---|---|---|
| D1 | **Radius language is mixed** — pill CTAs + 4px modal buttons + 8px cards + 4px icon buttons coexist without a rule | Library modal, PlaylistDetail, SongCard, ContextMenu |
| D2 | **Type is very small** — titles at 12px, artists at 10px, eyebrows at 10–12px; dense but risks feeling cramped vs. Spotify-class competitors | SongCard, rails, queue |
| D3 | **3D tilt on every rail card** — at 140–180px width the tilt reads as gimmick; `will-change-transform` on all cards is a perf cost | `SongCard.tsx` |
| D4 | **Featured banner is the weakest hero element** — glass-panel + mesh + sheen + gradient text all at once = competing effects; the "Play Now" pill is generic | `Home.tsx` |
| D5 | **Empty states are plain** — icon-in-box + text; no personality, no illustration, no action hierarchy | `FeedbackStates.tsx` |
| D6 | **Artist page banner** — blurred thumbnail + mesh + gradient overlay is busy; subscriber count is the only stat | `Artist.tsx` |
| D7 | **Search autocomplete** — functional but visually plain (text rows only, no thumbnails) | `Search.tsx` |
| D8 | **Genre marquee** — big text band is nice, but it's the only "brand voice" moment between rails; mood cards and genre cards are near-identical patterns (dot + label + ink wash) | `Home.tsx`, `Search.tsx` |
| D9 | **Light mode is an afterthought** — mesh opacity tuned for dark, waveform broken, glass panels tuned for dark; light mode feels like a fallback | global.css |
| D10 | **No page-level storytelling** — Home is a feed of rails; there's no "why this product" moment, no stats, no personality section | Home |
| D11 | **About page is the most generic** — standard feature cards + table; doesn't match the cinematic quality of Home | `About.tsx` |
| D12 | **Toast position** — bottom-left overlaps mobile player area (bottom-28 vs player at bottom-14) | `Toasts.tsx` |

### Accessibility gaps

- Range inputs: no visible focus (B3).
- Modal: no dialog semantics/focus trap (B4).
- Context menu: mouse-only (B5).
- No skip link (B7).
- `img` alt="" everywhere (acceptable — adjacent text labels, but artist/playlist
  cards in Search do have alt).
- Marquee `aria-hidden` — good.
- Contrast: `text-mute` (#888/#666) on canvas at 10px is borderline; `text-mute/25`
  disabled states are very low contrast.

### Performance observations

- Google Fonts render-blocking `<link>` (no preload, no self-host).
- `blur(80px)` mesh + `backdrop-filter` glass on multiple fixed layers.
- `will-change-transform` on marquee + every tilt card.
- framer-motion `whileInView` wrapper per card in rails (hundreds of motion divs).
- No image `width/height` on most `<img>` (CLS risk on rails).
- No lazy-loading strategy beyond `loading="lazy"` on card thumbs.

---

## 4. Consistency audit

| Pattern | Where consistent | Where inconsistent |
|---|---|---|
| Buttons | Pill CTAs (Play Now, Create Playlist, Play, Shuffle) | Modal buttons 4px; icon buttons 4px; tab pills full |
| Cards | 8px radius + hairline + lvl3 shadow | Featured banner (glass, no radius rule); playlist cards 16/10 aspect vs song cards square |
| Headlines | display-* with negative tracking everywhere | Hero 64px vs page headers 32px vs section headers 20px — no clear page-header scale rule |
| Eyebrows | mono uppercase everywhere | Some `!text-canvas/60` overrides (Artist) |
| Hover | border-hairline-strong + shadow lift | Mood cards use ink-wash; song cards use tilt; genre cards use ink-wash — three different hover languages |
| Active states | layoutId pills (sidebar/tabs/bottomnav) | Queue rows use border+shadow; playlist rows use bg |

---

## 5. Verdict

The app is **already above average** — it has a real design language, real motion
choreography, and working product flows. It is NOT generic AI-slop. The highest-value
work is:

1. **Fix the light-mode breakage** (waveform, glass, mesh tuning) — this is the
   biggest credibility gap.
2. **Complete the missing interaction states** (keyboard help modal, dialog a11y,
   slider focus, context-menu keyboard support, skip link).
3. **Sharpen the distinctive identity** — the "tracklist/editorial" voice (numbered
   sections, mono indices, waveform) can be pushed further: page headers, empty
   states, artist page, About page all deserve the same voice.
4. **Reduce effect competition** on the featured banner and artist banner.
5. **Tighten the radius/type scale** into explicit rules.
6. **Remove dead dependencies.**

No architectural rewrite is needed. The design system, routing, state, and player
architecture are sound and should be preserved.