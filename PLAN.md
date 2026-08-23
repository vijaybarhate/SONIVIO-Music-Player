# SONIVIO Rewrite Plan v3 — "Liquid glass + choreography pass"

User verdict on v2: better but not award-level; feels like surface polish.
Benchmark: liquid-glass dashboard spec — frosted glass over atmosphere,
beat-timed entry choreography, mask-reveal headlines, self-drawing chart,
specular sheen. Port that language onto SONIVIO (music brand, not weather).

## Step A — Design-language layer (global.css)
- Easing tokens: --e-out (.16,1,.3,1) / --e-soft (.22,.61,.36,1) / --e-pen (.37,.01,.2,1).
- Liquid glass recipes: .glass-panel (translucent white gradient stack +
  backdrop blur/saturate + hairline light border), .glass-chip, dark-mode tuned.
- Specular sheen ::after (skewX -18°, translate sweep, runs once @2.55s).
- Choreography keyframes: riseIn / slideL / slideR / popIn / growY / lineUp /
  wipeDown / wipeRight / drawLine / wipeX + .a-* classes driven by --d delay var.
- prefers-reduced-motion kills everything.

## Step B — Signature moment: Waveform.tsx
SVG wave (viewBox 0 0 835 230, preserveAspectRatio none): 3 outline strokes
DRAW themselves (pathLength=1 + dashoffset, staggered widths/opacities),
then fill WIPES left→right (clipPath scaleX). Used in ExpandedPlayer
(replaces bar visualizer) + Home hero as brand strip.

## Step C — Choreographed entries (beat-matched)
- Sidebar: slideL; logo popIn; nav items riseIn staggered; active pip glow.
- Home hero: eyebrow riseIn → chip wipeRight → H1 lineUp mask reveal per line
  → blurb wipeDown; featured card = glass panel + sheen coda.
- Header tools popIn staggered. Player chrome keeps spring physics.

## Step D — Verify (astro check/build + screenshots) & commit


## Step 3 — Cinematic component pass (tokens only)
Global atmosphere (global.css):
- Animated mesh drift (slow keyframes on background-position/transform).
- Film-grain overlay utility (SVG turbulence data-URI, opacity ~0.04, pointer-events-none).
- Glass utilities (backdrop-blur + hairline + translucent canvas) for player chrome.
- Equalizer-bar keyframes (staggered scaleY, GPU-only) for active tracks.
- Marquee keyframes; reduced-motion media query kills all of it.

Components (rewrite on tokens, add motion):
- Sidebar: sliding active indicator (framer-motion layoutId), mono section labels,
  hairline dividers, theme toggle, library counts.
- BottomNav (mobile): glass bar, spring active states.
- SongCard: perspective tilt on hover, cover zoom, play button spring-in,
  animated equalizer when active, stacked-shadow lift.
- PlayerControls: play/pause morph icon, springy icon buttons with press scale.
- ProgressBar: buffered range, glowing thumb on drag, scrub preview time tooltip.
- VolumeControl: same treatment, vertical fill.
- BottomPlayer: glass chrome, artwork crossfade on track change, mini equalizer.
- ExpandedPlayer: full-screen takeover, blurred artwork backdrop, large art with
  slow rotate/breathe, pseudo-visualizer bars (playing-state driven), spring sheet.
- QueueDrawer: spring drawer, drag-to-reorder kept, row hover polish.
- Toasts / ContextMenu / FeedbackStates / LoadingSpinner: spring entrances,
  token chrome, focus-visible rings everywhere.

## Step 4 — Cinematic page pass (react-pages/*)
- Home: hero with drifting mesh + grain, staggered word-reveal headline,
  scroll-reveal sections (whileInView), genre marquee band, featured rail with
  snap scroll + edge fades.
- Search/Library/Artist/PlaylistDetail/About: consistent reveal rhythm,
  display-scale headers, polarity-flipped bands where hierarchy demands.
- Kill any remaining slop copy.

## Step 5 — Visual verification (Chrome DevTools MCP)
Dev server port 4599. Screenshots light+dark × desktop+mobile × pages.
web-design-guidelines review. Fix regressions.

## Step 6 — Commit & push
