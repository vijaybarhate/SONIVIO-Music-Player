# UI Resource Research — SONIVIO

> Phase 4/6 artifact of the sharpen-the-axe workflow.
> Date: 2026-08-26 · Research depth: canonical sources inspected for all selected
> candidates; registry + beyond-registry search performed.

---

## Task

Improve SONIVIO's UI substantially: fix light-mode breakage, complete interaction
states (dialog a11y, context-menu keyboard support, keyboard-help feature, search
autocomplete keyboard nav), sharpen the editorial identity, and reduce effect
competition — without breaking playback/persistence/routing and without dependency
sprawl.

## Research status

- Started: 2026-08-26
- Last updated: 2026-08-26
- Registry searched: shadcn/ui, Base UI, Magic UI, React Bits, Sonner, cmdk
- Beyond registry: Base UI (MUI), cmdk (dip), Radix UI, sonner (emilkowalski)

---

## Candidate 1 — Base UI (MUI)

- Name: Base UI
- URL: https://base-ui.com/
- Type: Headless component library (React)
- Relevant component/tool: `Dialog`, `Context Menu`, `Menu` primitives
- Canonical source: https://github.com/mui/base-ui (v1.7.0)
- Framework: React 17+ (ESM, Vite/Astro compatible)
- License: MIT
- Source available: yes (open source, MUI-maintained)
- Why it fits: Headless = takes SONIVIO's existing tokens/styling directly. Dialog
  provides focus trap, `aria-modal`, Escape-to-close, scroll lock, focus restore out
  of the box. Context Menu provides arrow-key navigation, focus management, submenus.
  One package covers both surfaces (plus future menus). It is the current default
  primitive layer of shadcn/ui, so ecosystem alignment is strong.
- Risks: Newer library (v1.x, 2025+) — API still evolving; smaller community than
  Radix today. Requires a small wrapper layer to match brand chrome.
- Score: 88/100
- Status: **SELECTED** (dialog + context menu)

## Candidate 2 — Radix UI primitives

- Name: Radix UI
- URL: https://www.radix-ui.com/primitives
- Type: Headless component library (React)
- Relevant component/tool: `@radix-ui/react-dialog`, `@radix-ui/react-context-menu`
- Canonical source: https://github.com/radix-ui/primitives
- Framework: React 16.8+ (ESM)
- License: MIT
- Source available: yes
- Why it fits: Battle-tested (shadcn's long-time default), identical a11y guarantees
  (focus trap, aria-modal, Escape, arrow-key menus). Same headless integration story
  as Base UI.
- Risks: Two separate packages for dialog + context menu; slightly heavier install;
  Radix is in maintenance mode while Base UI is the strategic direction.
- Score: 84/100
- Status: rejected (Base UI wins on single-package + active development)

## Candidate 3 — Custom dialog/context-menu with framer-motion

- Name: Hand-rolled (existing pattern)
- URL: n/a (project code)
- Type: Custom implementation
- Relevant component/tool: focus trap + arrow-key menu logic
- Why it fits: Zero new dependencies; full brand control.
- Risks: Focus traps, focus restoration, inert-background, and arrow-key menus are
  notoriously error-prone to hand-roll; the project already has one broken modal
  (no trap, no Escape). Repeating the pattern invites the same bugs.
- Score: 62/100
- Status: rejected (a11y correctness is the requirement; verified headless
  primitives are the reliable path)

## Candidate 4 — shadcn/ui Dialog + Context Menu (copy-paste)

- Name: shadcn/ui
- URL: https://ui.shadcn.com/docs/components/base/dialog
- Type: Copy-paste component collection (wraps Base UI / Radix / React Aria)
- Relevant component/tool: `Dialog`, `ContextMenu`
- Canonical source: https://github.com/shadcn-ui/ui (122k stars)
- License: MIT
- Source available: yes
- Why it fits: Battle-tested composition; includes styling.
- Risks: Ships shadcn's design-system CSS variables (`--background`, `--foreground`,
  etc.) which conflict with SONIVIO's token names; re-theming cost is higher than
  using the headless primitive directly. Adds copy-paste surface area to maintain.
- Score: 78/100
- Status: rejected (headless primitive + our tokens is cleaner than re-theming
  shadcn's styled components)

## Candidate 5 — cmdk (command menu)

- Name: cmdk
- URL: https://github.com/dip/cmdk
- Type: Unstyled command menu / accessible combobox (React)
- Relevant component/tool: `Command` — powers keyboard-help palette AND search
  autocomplete (combobox mode)
- Canonical source: https://github.com/dip/cmdk (12.9k stars, MIT, actively maintained)
- Framework: React (ESM)
- License: MIT
- Source available: yes
- Why it fits: Gives arrow-key navigation, type-ahead filtering, and list semantics
  for free. One dependency upgrades two surfaces: (1) the dead `?` keyboard-help
  state becomes a real command palette (shortcuts + quick actions), (2) the search
  autocomplete gains keyboard operability + thumbnails. It is the component behind
  shadcn's Command and Vercel-style palettes.
- Risks: Styling is fully custom (fine — we own the chrome); needs a dialog wrapper
  (Base UI Dialog, already selected) for the palette.
- Score: 90/100
- Status: **SELECTED** (command palette + search autocomplete)

## Candidate 6 — shadcn/ui Command (cmdk wrapper)

- Name: shadcn/ui Command
- URL: https://ui.shadcn.com/docs/components/base/command
- Type: Styled wrapper around cmdk
- Why it fits: Same engine as Candidate 5 with shadcn styling.
- Risks: Same re-theming cost as Candidate 4; adds nothing over raw cmdk for us.
- Score: 74/100
- Status: rejected (raw cmdk + our chrome is cleaner)

## Candidate 7 — shadcn/ui Empty (pattern reference)

- Name: shadcn/ui Empty
- URL: https://ui.shadcn.com/docs/components/base/empty
- Type: Composition pattern (EmptyMedia / EmptyTitle / EmptyDescription / EmptyContent)
- Why it fits: A clean, structured empty-state composition to adapt with SONIVIO's
  brand voice (waveform/equalizer motif, mono captions, action hierarchy).
- Risks: None as a pattern; we implement it with our own tokens (no dependency).
- Score: 80/100 (as reference)
- Status: **SELECTED as reference pattern** (custom implementation, no dep)

## Candidate 8 — Sonner (toasts)

- Name: Sonner
- URL: https://sonner.emilkowal.ski/
- Type: Toast library (React)
- Canonical source: https://github.com/emilkowalski/sonner (MIT)
- Why it fits: Polished, popular toast system.
- Risks: The project's custom toast already has undo actions + auto-dismiss progress
  line + brand chrome; Sonner would be a lateral move that loses features and adds a
  dependency. No measurable improvement.
- Score: 55/100
- Status: rejected (existing custom toast is already better for this product)

## Candidate 9 — Magic UI

- Name: Magic UI
- URL: https://magicui.design/
- Type: Animated component collection (React + Tailwind)
- Relevant component/tool: marquee, bento grid, text animations, glow effects
- Why it fits: Popular, MIT, source-available.
- Risks: Nearly all components are decorative effects (meteors, particles, glow,
  shine borders) — exactly the "effect competition" the diagnosis says to REDUCE.
  The project already has a richer, more restrained motion system. No surface here
  needs a Magic UI component.
- Score: 45/100
- Status: rejected (decorative; conflicts with the restraint requirement)

## Candidate 10 — React Bits / Kibo UI / Aceternity UI (registry sweep)

- Name: React Bits, Kibo UI, Aceternity UI
- URL: https://reactbits.dev/ · https://www.kibo-ui.com/ · https://ui.aceternity.com/
- Type: Animated component collections
- Why it fits: Registry candidates for animated surfaces.
- Risks: Same decorative-effect profile as Magic UI; no component that solves a
  diagnosed problem better than the selected set. React Bits page is JS-rendered
  (could not fully verify contents); Aceternity is heavily effect-oriented.
- Score: 40–50/100
- Status: rejected (no diagnosed surface needs them)

---

## Selected resources

### 1. Base UI — `@base-ui/react`
- URL: https://base-ui.com/ · https://github.com/mui/base-ui
- Exact components: `Dialog` (create-playlist modal, keyboard-help palette shell),
  `Context Menu` (SongCard right-click / more-button menu)
- Why selected: One MIT headless package gives bulletproof dialog + menu a11y
  (focus trap, aria-modal, Escape, arrow keys, focus restore) with zero styling
  conflict — it takes SONIVIO's tokens directly. It is shadcn/ui's current default
  primitive layer, so the ecosystem direction is aligned.
- Adaptations planned: Wrap in `src/components/ui/` with brand chrome (canvas
  surface, hairline borders, modal-shadow-lvl5, framer-motion entrances); keep
  existing ContextMenu API surface (isOpen/x/y/onClose/track) so SongCard callers
  don't change.

### 2. cmdk — `cmdk`
- URL: https://github.com/dip/cmdk
- Exact components: `Command` — (a) keyboard-help command palette opened by `?`,
  (b) search autocomplete combobox with thumbnails + keyboard nav
- Why selected: MIT, 12.9k stars, actively maintained, unstyled (takes our chrome),
  gives type-ahead filtering + arrow-key navigation + list semantics. One dependency
  upgrades two diagnosed surfaces and revives the dead `isKeyboardHelpOpen` feature.
- Adaptations planned: Custom item rendering (thumbnails, mono metadata, kbd hints);
  palette shell = Base UI Dialog; search dropdown keeps existing debounce/API flow.

### 3. shadcn/ui Empty — pattern only (no dependency)
- URL: https://ui.shadcn.com/docs/components/base/empty
- Exact component: Empty composition (media / title / description / content)
- Why selected: Clean structured pattern to adapt with brand voice — equalizer
  motif media, mono caption, action button. Implemented in `FeedbackStates.tsx`
  with existing tokens; no dependency added.

## Rejected resources

| Resource | Why rejected |
|---|---|
| Radix UI primitives | Two packages vs Base UI's one; maintenance-mode vs active development |
| Custom focus-trap/menu | Hand-rolled a11y is error-prone; project already has a broken modal |
| shadcn/ui Dialog/ContextMenu/Command | Re-theming shadcn's CSS-var system costs more than headless + our tokens |
| Sonner | Custom toast already has undo + progress line; lateral move |
| Magic UI / React Bits / Kibo UI / Aceternity | Decorative effects; conflicts with the restraint requirement |
| shadcn/ui Empty (as dependency) | Pattern is trivial; custom implementation with brand voice is better |

## Additional references (visual benchmarks, not dependencies)

- Spotify desktop app — density, rail rhythm, active-track treatment (reference only)
- Vercel marketing site — the project's existing design DNA (DESIGN.md)
- Linear — command palette + keyboard-first culture (reference for cmdk usage)
- shadcn/ui Empty docs — empty-state composition (reference)

## Notes

- No HUMAN_PREFERRED_RESOURCES.md exists — no human-supplied URLs to evaluate.
- All selected resources verified at canonical sources (GitHub repos + official docs).
- Total new dependencies: **2** (`@base-ui/react`, `cmdk`). Both MIT, headless,
  themeable, ESM-compatible with Astro/Vite/Cloudflare.