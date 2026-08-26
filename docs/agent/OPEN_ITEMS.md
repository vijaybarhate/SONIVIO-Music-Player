# Open Items — SONIVIO UI Transformation

> Phase 9 artifact of the sharpen-the-axe workflow.
> Date: 2026-08-26

---

## Blocking

None. Typecheck, build, and all live QA checks pass.

## Non-blocking

1. **Disabled-state contrast** — `text-mute/25` on disabled prev/next buttons and
   `disabled:opacity-50` on form buttons are low-contrast. Pre-existing; acceptable
   for disabled affordance, but could be raised to `text-mute/40` + `cursor-not-allowed`.
2. **Google Fonts render-blocking** — Geist/Geist Mono load via a blocking `<link>`.
   Pre-existing. Options: `font-display: swap` is already set; self-hosting the fonts
   (woff2 in `public/fonts/`) would remove the network dependency and CLS risk.
3. **`getStaticPaths` build warnings** — Astro warns that `getStaticPaths()` is
   ignored on `/artist/[channelId]` and `/playlist/[id]` (SSR mode). Pre-existing;
   harmless (pages are client-rendered), but could be silenced with `export const
   prerender = true` or removed.
4. **No automated test suite** — no unit/e2e tests exist. The a11y-critical
   surfaces (dialog, context menu, palette) would benefit from Playwright coverage.
5. **Bundle size not measured** — `@base-ui/react` + `cmdk` added; axios +
   react-beautiful-dnd removed. Net weight likely neutral-to-positive, but no
   before/after numbers were captured.
6. **3D tilt on rail cards** — kept per decision (hover-only, subtle 7°), but it
   remains the most "gimmicky" interaction; revisit if it feels noisy on small cards.
7. **`aria-modal` on Base UI popups** — added manually; Base UI may set it in a
   future version — keep the attribute in sync when upgrading.

## Future improvements

- **Command palette expansion** — currently shortcuts + quick actions. Could grow
  into a full app navigator (search tracks inline, jump to playlists) using the
  existing cmdk + API layer.
- **Lyrics sync** — README roadmap item; the ExpandedPlayer lyrics-search card is
  the natural integration point.
- **PWA/offline** — README roadmap item; service worker for cached streams.
- **Playlist rename** — Library supports create/delete but not rename (README
  claims rename; not implemented).
- **Self-hosted fonts** — see non-blocking #2.
- **Light-mode screenshots for README** — README only shows dark-mode screenshots.

## Human decisions needed

1. **Commit** — the implementation is complete and verified; the user has not yet
   requested a commit. Recommend committing as one cohesive change set (or split:
   deps → a11y → visual).
2. **Visual review** — screenshots should be eyeballed by the user (light/dark ×
   desktop/mobile) since automated checks can't judge aesthetics.
3. **README screenshot refresh** — if the user wants, update `public/screenshots/`
   to reflect the new light-mode + palette surfaces.