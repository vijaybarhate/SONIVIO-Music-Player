# Requirements — SONIVIO UI Transformation

> Phase 2 artifact of the sharpen-the-axe workflow.
> Date: 2026-08-26 · Status: complete
> Source: diagnosis in `CURRENT_STATE.md` (bugs B1–B7, design D1–D12, a11y gaps).

---

## 0. Objective

Elevate SONIVIO from "polished dark music player" to a **distinctive, premium,
editorial music product** — while fixing the light-mode breakage, completing missing
interaction states, and preserving every working flow (persistent playback, stores,
proxy, routing).

**Success criteria (overall)**
- Light mode is as intentional as dark mode (no invisible elements).
- Every interactive surface has visible focus, keyboard support, and dialog semantics.
- The product has a recognizable identity beyond "Vercel-inspired dark app" — the
  tracklist/editorial voice is explicit.
- No regression in playback, persistence, routing, or API behavior.
- `npm run build` + `astro check` pass; no new dependencies without justification.

---

## 1. Work units

### W1 — Fix light-mode breakage (foundation)
- **Objective**: Waveform, glass panels, mesh, and featured banner must read correctly
  on light canvas.
- **Acceptance**: Waveform visible in light mode (ink-tinted strokes); glass-panel
  frost reads on white; mesh opacity tuned per theme; no white-on-white anywhere.
- **Constraints**: Keep dark mode identical to today.
- **Validation**: Screenshots light × dark on Home hero + ExpandedPlayer.

### W2 — Complete interaction states (a11y + missing features)
- **Objective**: Keyboard-help modal (renders `isKeyboardHelpOpen`), dialog semantics
  + focus trap + Escape for create-playlist modal, visible focus on seek/volume
  sliders, keyboard navigation for ContextMenu, skip link in Layout.
- **Acceptance**: `?` opens a real modal listing shortcuts; modal traps focus and
  closes on Escape; sliders show a focus ring; context menu opens via keyboard and
  navigates with arrows; Tab from top reaches a visible "Skip to content" link.
- **Validation**: Keyboard-only walkthrough of each surface; axe-style manual checks.

### W3 — Sharpen the editorial identity (typography + page headers)
- **Objective**: Make the "tracklist" voice explicit: consistent page-header scale,
  numbered section indices everywhere, mono metadata, period-terminated headlines.
- **Acceptance**: All 6 pages share one header pattern (eyebrow → display headline →
  lead); section indices consistent; type scale rules documented in DESIGN.md.
- **Constraints**: Keep Geist/Geist Mono; no new fonts without research.

### W4 — Reduce effect competition (featured banner, artist banner)
- **Objective**: Featured banner and artist banner each get ONE dominant effect
  instead of mesh+glass+sheen+gradient stacked.
- **Acceptance**: Each banner has a clear focal point; no more than one atmospheric
  layer per banner.
- **Validation**: Visual inspection desktop/mobile.

### W5 — Distinctive empty states + loading states
- **Objective**: Empty states get the brand voice (waveform/equalizer motif, mono
  captions, action hierarchy); loading states consistent across pages.
- **Acceptance**: Empty states share a component with the editorial voice; loading
  uses the equalizer motif consistently.
- **Validation**: Trigger each empty state (favorites, playlists, history, search).

### W6 — Radius + type scale rules (consistency pass)
- **Objective**: One radius rule (cards 8px, controls 6px, pills for CTAs, 4px only
  for inline icon buttons) and one type rule (min 11px for metadata, 12px for titles).
- **Acceptance**: No mixed-radius clusters; no 9–10px text outside mono eyebrows.
- **Validation**: Grep audit + visual inspection.

### W7 — Artist page upgrade
- **Objective**: Banner with real hierarchy (avatar, name, stats as mono chips),
  cleaner overlay, consistent rails.
- **Acceptance**: Banner reads at a glance; stats formatted; no busy overlay stack.
- **Validation**: Render with real channel data.

### W8 — Search autocomplete polish
- **Objective**: Suggestions show thumbnails + type hints; recent searches get icons;
  keyboard navigation (arrows + enter) in the dropdown.
- **Acceptance**: Dropdown is keyboard-operable; rows show artwork.
- **Validation**: Keyboard + mouse walkthrough.

### W9 — Dead dependency cleanup
- **Objective**: Remove axios + react-beautiful-dnd (+ @types/react-beautiful-dnd).
- **Acceptance**: `npm run build` passes without them; no imports reference them.
- **Validation**: grep + build.

### W10 — About page voice pass
- **Objective**: Match Home's cinematic quality: numbered spec rows, mono table,
  waveform accent, no generic card grid.
- **Acceptance**: About shares the editorial header pattern; spec table uses mono
  voice; page feels like part of the same product.
- **Validation**: Visual inspection.

### W11 — Toast positioning + polish
- **Objective**: Toasts never overlap the mobile player; consistent entrance.
- **Acceptance**: On mobile, toasts sit above the player stack (bottom-14 + player
  height) or top-anchored; no overlap at 390×844.
- **Validation**: Trigger toasts on mobile viewport.

### W12 — Performance hygiene
- **Objective**: Remove `will-change` where unneeded, add width/height to rail images,
  keep new effects GPU-only.
- **Acceptance**: No new layout shift on rail load; no new heavy effects.
- **Validation**: Lighthouse-ish manual check (CLS, bundle size delta).

---

## 2. Explicit non-goals (do NOT do)

- No architecture rewrite (routing, stores, proxy, persistence stay).
- No new framework or router.
- No new font family without research approval.
- No removal of existing features (keyboard shortcuts, queue, playlists, themes).
- No decorative animation without a UX reason.
- No gradient/glass/glow additions beyond what exists — the system is already rich.

---

## 3. Dependencies between units

```
W1 (light-mode foundation) → everything visual (W3–W8, W10)
W2 (a11y) → independent, can land anytime
W9 (deps) → independent
W12 (perf) → after W3–W8 (touches same files)
W11 → independent
```

Implementation order (per protocol: foundations → layout → typography → components →
responsive → states → motion → polish):

1. W9 (cleanup, trivial)
2. W1 (light-mode foundation)
3. W3 (header/type scale) + W6 (radius rules) — design-system rules first
4. W4, W7, W8, W10 (page/component passes)
5. W5 (empty/loading states)
6. W2 (a11y + keyboard help modal)
7. W11 (toasts)
8. W12 (perf hygiene)

---

## 4. Validation plan

| Unit | Method |
|---|---|
| All | `npm run build`, `npx astro check` |
| W1 | Screenshots light/dark, Home + ExpandedPlayer |
| W2 | Keyboard-only walkthrough; Escape/focus-trap checks |
| W3–W8, W10 | Screenshots desktop/mobile × light/dark |
| W5 | Trigger all empty/loading states |
| W9 | grep axios/react-beautiful-dnd = 0 matches |
| W12 | Compare bundle size before/after; check CLS on rails |

---

## 5. Risks

- **View-transition regressions**: any change to Layout/persist islands can break
  audio continuity → test navigation with a playing track.
- **Light-mode tuning affects dark**: token changes must be scoped or mirrored.
- **Modal focus trap** can break existing flows if Escape conflicts with player
  shortcuts → keep player Escape behavior (close expanded player first).
- **Removing deps** may surface hidden imports → grep before removal.