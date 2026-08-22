# SONIVIO Rewrite Plan v2 — "Godly pass"

Audit verdict (v1): two competing design systems, no brand voice, AI-slop tropes.
Steps 1–2 DONE (legacy purged, Geist tokens live).

New directive (user): elevate to Awwwards/godly tier — cinematic motion, 3D-feel
depth, scroll choreography, audio-reactive polish. References: cinematic AI/3D
website builds, award-site clones. Keep DESIGN.md token system as foundation;
add a cinematic layer ON TOP of it. No new heavy deps — framer-motion (installed)
+ GPU-only CSS. No WebGL (player app, not marketing site): depth comes from
perspective tilts, layered blur, grain, and motion.

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
