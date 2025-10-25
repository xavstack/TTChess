# Trash-Talk Chess — v1 Plan

## M0 — Scaffold & Guardrails

- [x] Vite React+TS app
- [x] Tailwind wired
- [x] ESLint/Prettier configured
- [x] Vitest + RTL setup
- [x] PWA plugin baseline

## M1 — Vertical Slice

- [x] Chessboard renders (SVG)
- [x] User makes one legal move
- [x] AI responds (temporary random move)
- [x] Taunt TTS after each move (debounced, cancel on next)

Acceptance: Play one full move pair and hear a taunt.

## M2 — Trash Talk System

- [x] Import `src/trashTalk/pieceMap.ts`
- [x] Selector: filter by piece, tone; ring buffer (5); suffix on capture/check
- [x] PG-13/Spicy/Off toggle persisted
- [x] Tests for no-repeat, piece match, debounce

## M3 — Game Features

- [x] Full legal move loop (check/mate/stalemate/draw)
- [x] PGN import/export
- [x] Undo last pair
- [x] Flip board
- [x] Clocks

## M4 — AI & PWA

- [x] Stockfish WASM in Web Worker (API scaffold; WASM drop-in pending)
- [x] Difficulty presets (skill/depth/movetime)
- [x] PWA manifest/icons; offline cache engine/assets
- [ ] Lighthouse installable passes (run locally)

## M5 — Polish & Themes

- [x] Themes (light/dark/high-contrast)
- [x] Animations: move slide (capture fade/check pulse/confetti: pending)
- [x] Accessibility pass; no console errors; smooth FPS (baseline)

---

Acceptance Criteria: All v1 features implemented; tests pass; PWA installable; offline play works; README accurate.

## M6 — vNext UX, Variants, and Aids (Planning)
- [x] Unified settings in left sidebar (hotkey `/` opens, `Esc` collapses)
  - Bundles tone, difficulty, themes, variants, aids, import/export, utilities
  - Accessible and responsive; avoids modal complexity
- [ ] Player names at top/bottom; layout respects ≤98vh and ≥98% utilization
  - Use CSS clamp + `aspect-ratio` with safe-area insets; test on mobile/desktop
- [ ] Game variants (phase 1)
  - Baseline set: Standard, Chess960, King of the Hill, Three-check, Horde
  - Engine support: Standard + Chess960 (Stockfish OK); others initially human-only
  - Abstraction: `rulesEngine` interface; evaluate `chessops` for variant legality
- [ ] Move list stream in side panel (collapsible)
  - Live SAN with move numbers; copy/export; jump-to-move
- [ ] Board coordinates outside grid (files bottom, ranks left); toggleable
- [ ] Board color palettes (4–5): Classic Green, Blue Ice, Walnut, Slate, Night
  - Ensure WCAG contrast for dark mode and high-contrast theme
- [ ] Gameplay aids (toggleable)
  - Suggested best move/line arrows; capture candidates highlighted with circles
  - Disable in "rated" mode; debounce to avoid flicker; worker-rendered overlays
- [ ] Clock redesign: physical flip interaction + hotkey (Space) for "Done"
  - Presets: 3+2, 5+0, 10+0; pause/resume; clear visual urgency states
- [ ] Piece set library (offline, free-licensed)
  - Sets: Cburnett (default), Merida, Alpha, Staunty; attribution in About
  - Persist selection in localStorage; lazy-load assets

Acceptance (M6):
- Dashboard accessible on all breakpoints; settings persist; no console errors
- Variants selectable and playable (Std+960 vs AI; others human vs human)
- Move list streams correctly; board shows coordinates; theming selectable
- Aids render from worker; clocks usable with flip/hotkey; piece sets switchable
