# Project Recon — SONIVIO Music Player

> Phase 1 artifact of the sharpen-the-axe workflow.
> Date: 2026-08-26 · Status: complete

---

## 1. Product overview

**SONIVIO** is a premium, dark-first music streaming web app. It streams music via the
YouTube Data API v3 (through a serverless proxy), with a Vercel-inspired stark design
language. Target user: a music enthusiast / developer who wants a fast, cinematic,
Spotify-class player without an account.

Key product flows:

1. **Discover** — Home feed: time-aware greeting hero, featured mix, trending rails
   (India / Global), genre marquee, mood mixes, new releases, Indian charts.
2. **Search** — debounced search with live suggestions, recent-search history, genre
   browse chips, tabs for songs / artists / playlists.
3. **Play** — click any card → track plays via hidden YouTube iframe; persistent
   bottom player (desktop bar / mobile compact bar); expanded full-screen player with
   artwork, waveform, metadata, lyrics search, related tracks.
4. **Queue** — right drawer: reorder (up/down), remove, clear, play-from-queue.
5. **Library** — favorites grid, custom playlists (create/delete/rename via modal),
   virtualized listening history.
6. **Artist / Playlist detail** — banner hero, popular/latest rails, track list.
7. **About** — developer-facing system documentation page.

---

## 2. Framework & tooling

| Concern | Choice | Version | Notes |
|---|---|---|---|
| Meta-framework | Astro | 6.4.4 | SSR on Cloudflare (`output: 'server'`), static fallback for gh-pages |
| UI framework | React | 18.2 | Islands via `@astrojs/react`, `client:only="react"` + `transition:persist` |
| Styling | Tailwind CSS v4 | 4.3.0 | CSS-first config (`@theme` in `global.css`), `@tailwindcss/vite` plugin |
| State | Zustand | 5.0.13 | 4 stores: player, queue, library, ui; persist middleware → localStorage |
| Motion | framer-motion | 11.18.2 | Springs, layoutId pills, AnimatePresence |
| Icons | lucide-react | 0.344.0 | Stroke icons, 1.8–2.5 strokeWidth |
| Audio | react-youtube | 10.1.0 | Hidden iframe player (0×0) |
| Virtual list | @tanstack/react-virtual | 3.14.2 | Listening history |
| Utils | clsx + tailwind-merge | 2.x | `cn()` in `src/lib/utils.ts` |
| HTTP | native `fetch` | — | axios installed but **unused** |
| DnD | react-beautiful-dnd | 13.1.1 | installed but **unused** (queue uses up/down buttons) |
| Deploy | Cloudflare Pages / gh-pages | — | `wrangler.toml`, `DEPLOY_PLATFORM=gh-pages` switch |

Build scripts: `dev`, `build`, `preview`, `deploy` (gh-pages). No test suite, no lint
script, no typecheck script (uses `astro check` via `@astrojs/check`).

---

## 3. Routing

Astro file-based routing, all pages render a React island:

| Route | File | Island |
|---|---|---|
| `/` | `src/pages/index.astro` | `Home` |
| `/search` | `src/pages/search.astro` | `Search` |
| `/library` | `src/pages/library.astro` | `Library` |
| `/about` | `src/pages/about.astro` | `About` |
| `/artist/[channelId]` | `src/pages/artist/[channelId].astro` | `Artist` |
| `/playlist/[id]` | `src/pages/playlist/[id].astro` | `PlaylistDetail` |
| `/api/youtube` | `src/pages/api/youtube.ts` | serverless proxy (Cloudflare) |

Navigation uses Astro `<ClientRouter />` (View Transitions) with `transition:persist`
islands so audio keeps playing across page swaps. Dynamic routes use `getStaticPaths`
with a dummy param (client-side data fetch).

---

## 4. Layout architecture

`src/layouts/Layout.astro` — single app shell:

```
body (h-screen overflow-hidden)
├── HiddenYouTube (persist)      — 0×0 iframe player
├── Toasts (persist)             — bottom-left toast stack
├── Sidebar (persist, md+)       — 64px collapsed / 240px expanded
├── main (flex-1, overflow-y-auto, pb for player)
│   └── slot (p-4 md:p-8, max-w-7xl)
├── BottomNav (persist, mobile)  — fixed bottom, glass bar, h-14
└── BottomPlayer (persist)       — fixed bottom-14 (mobile) / bottom-0 (desktop)
    ├── QueueDrawer              — right slide-in drawer
    └── ExpandedPlayer           — full-screen takeover
```

---

## 5. Design system (from `DESIGN.md` + `global.css`)

### Tokens (CSS custom properties, light/dark swapped via `.dark`)

| Token | Light | Dark |
|---|---|---|
| `--canvas` | #ffffff | #0a0a0a |
| `--canvas-soft` | #fafafa | #121212 |
| `--canvas-soft-2` | #f5f5f5 | #1c1c1c |
| `--ink` | #171717 | #ededed |
| `--primary` | #171717 | #ededed |
| `--body` | #4d4d4d | #a0a0a0 |
| `--mute` | #888888 | #666666 |
| `--hairline` | #ebebeb | #222222 |
| `--hairline-strong` | #a1a1a1 | #3a3a3a |

Accents (fixed): link #0070f3, error #ee0000, warning #f5a623, violet #7928ca,
cyan #50e3c2, highlight-pink #ff0080, gradient pairs (develop/preview/ship).

### Typography

- **Geist** (400/500/600) via Google Fonts — display ceiling 600, aggressive negative
  tracking on display sizes (`-2.4px` @ 48px), sentence-case headlines, period-terminated.
- **Geist Mono** (400/500) — eyebrows, technical labels, timestamps, uppercase only here.
- Scale tokens: display-xl 48/48/-2.4, display-lg 32/40/-1.28, display-md 24/32/-0.96,
  display-sm 20/28/-0.6, body-lg 18/28, body-md 16/24, body-sm 14/20/-0.28, caption 12/16.

### Surfaces & elevation

- 4-step surface ladder: canvas (cards) → canvas-soft (page) → canvas-soft-2 (insets) →
  ink (polarity-flipped bands).
- Stacked shadows `card-shadow-lvl1..4` + `modal-shadow-lvl5` (inset hairline ring +
  multi-offset drops); dark mode uses light rings.
- Glass: `glass-bar` (blur 20px, saturate 1.4, 82% canvas) for persistent bars;
  `glass-panel` (liquid-glass gradient stack, blur 26px) for hero chips/featured card.

### Decorative system (the entire "cinematic" layer)

- `mesh-gradient-live` — 5 radial-gradient blobs, blur(80px), 28s drift animation.
- `grain-overlay` — SVG turbulence data-URI, opacity 0.032–0.05, mix-blend overlay.
- `Waveform` — self-drawing SVG (3 strokes, pen easing) + wipe-fill clip.
- `Equalizer` — CSS scaleY bars, staggered delays, `--eq-peak` var.
- Choreography classes: `a-riseIn / a-slideL / a-slideR / a-popIn / a-growY /
  a-wipeRight / a-wipeDown / .ln` mask-reveal lines, `draw-line`, `wipe-x`, `sheen`.
- Easing tokens: `--e-out (.16,1,.3,1)`, `--e-soft`, `--e-pen`.
- All motion killed under `prefers-reduced-motion`.

### Radius / shape

- Cards: rounded-lg (8px). Buttons: pills (rounded-full) for CTAs, rounded (4px) for
  modal buttons, rounded-sm (4px) for icon buttons. Mixed language (see diagnosis).

---

## 6. Components inventory

| Component | File | Notes |
|---|---|---|
| SongCard | `cards/SongCard.tsx` | vertical (3D tilt, play overlay, like) + horizontal variants |
| Sidebar | `layout/Sidebar.tsx` | brand, nav (layoutId pill), theme toggle, about link, playlist count |
| BottomNav | `layout/BottomNav.tsx` | mobile: 3 links + theme toggle, glass bar |
| BottomPlayer | `player/BottomPlayer.tsx` | mobile compact + desktop 88px bar, artwork crossfade |
| ExpandedPlayer | `player/ExpandedPlayer.tsx` | full-screen, blurred art backdrop, metadata, related |
| PlayerControls | `player/PlayerControls.tsx` | shuffle/prev/play/next/repeat, morphing play icon, halo ring |
| ProgressBar | `player/ProgressBar.tsx` | range overlay, scrub tooltip, gradient fill, glow thumb |
| VolumeControl | `player/VolumeControl.tsx` | range overlay, icon swap |
| QueueDrawer | `queue/QueueDrawer.tsx` | right drawer, reorder arrows, active equalizer |
| ContextMenu | `common/ContextMenu.tsx` | right-click / more-button menu, playlist submenu |
| Equalizer | `common/Equalizer.tsx` | CSS bars primitive |
| Waveform | `common/Waveform.tsx` | signature SVG (white-only — light-mode bug) |
| Toasts | `common/Toasts.tsx` | bottom-left, auto-dismiss progress line, undo |
| FeedbackStates | `common/FeedbackStates.tsx` | Loading/Empty/Error/Skeleton/InlineError |
| LoadingSpinner | `common/LoadingSpinner.tsx` | equalizer + eyebrow |
| HiddenYouTube | `player/HiddenYouTube.tsx` | iframe glue, interval progress, preload next thumb |

---

## 7. State management

- `playerStore` — currentTrack, isPlaying, volume/mute, progress/duration, shuffle,
  repeatMode; persisted (volume, repeat, shuffle, muted, currentTrack, position).
- `queueStore` — queue items, index, reorder/remove/clear/playNext.
- `libraryStore` — likedSongs, recentlyPlayed, playlists, searchHistory,
  listeningHistory, apiCache (30-min TTL); persisted.
- `uiStore` — toasts, queueOpen, keyboardHelpOpen (dead state — no UI renders it),
  expanded, theme.

---

## 8. API layer

- `services/youtube.ts` — typed wrappers with Zustand cache; `getRequest` branches:
  GitHub Pages → direct YouTube API with `VITE_YOUTUBE_API_KEY`; otherwise → `/api/youtube`
  proxy (Cloudflare worker, server-side key injection).
- `pages/api/youtube.ts` — serverless proxy using web `fetch`/`Headers` only (workerd-safe).
- `.env` contains `VITE_YOUTUBE_API_KEY` + research-account credentials (transient secrets —
  must never enter artifacts).

---

## 9. Assets

- `public/covers/1..7.jpg` + `public/songs/1..7.mp3` — local demo tracks (unused by UI?).
- `public/LOGO 1.png`, `public/maharaj.jpg`, `public/playing.gif` — legacy assets.
- `public/favicon.svg` — favicon.
- `public/screenshots/*` — README screenshots.
- No local font files — Geist/Geist Mono via Google Fonts (render-blocking link).

---

## 10. Accessibility baseline (observed)

- Good: aria-labels on icon buttons, `aria-current`, focus-visible rings on most
  buttons, `aria-hidden` on decorative layers, reduced-motion kill-switch, semantic
  headings, single `<main>` landmark.
- Gaps: range inputs (seek/volume) have `focus-visible:outline-none` (no visible
  focus); create-playlist modal has no focus trap / `aria-modal` / Escape; ContextMenu
  is mouse-only (no arrow-key nav); no skip link; waveform invisible in light mode.

---

## 11. Constraints & risks

- **Do not break**: Astro View Transitions + `transition:persist` islands (audio
  continuity), Zustand persistence keys, `/api/youtube` proxy contract, gh-pages
  `BASE_URL` handling, Cloudflare workerd compatibility (no Node-only APIs).
- **Performance**: framer-motion `whileInView` per card, blur(80px) mesh, `will-change`
  on many elements — keep new effects GPU-only and reduced-motion-safe.
- **Dependencies**: axios + react-beautiful-dnd are dead weight; no new deps without
  justification.
- **Fonts**: Google Fonts link is render-blocking; consider `display=swap` (already) +
  preload or self-hosting later.