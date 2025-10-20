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
