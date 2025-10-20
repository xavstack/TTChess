# Trash-Talk Chess — v1 Plan

## M0 — Scaffold & Guardrails
- [ ] Vite React+TS app
- [ ] Tailwind wired
- [ ] ESLint/Prettier configured
- [ ] Vitest + RTL setup
- [ ] PWA plugin baseline

## M1 — Vertical Slice
- [ ] Chessboard renders (SVG)
- [ ] User makes one legal move
- [ ] AI responds (temporary random move)
- [ ] Taunt TTS after each move (debounced, cancel on next)

Acceptance: Play one full move pair and hear a taunt.

## M2 — Trash Talk System
- [ ] Import `src/trashTalk/pieceMap.ts`
- [ ] Selector: filter by piece, tone; ring buffer (5); suffix on capture/check
- [ ] PG-13/Spicy/Off toggle persisted
- [ ] Tests for no-repeat, piece match, debounce

## M3 — Game Features
- [ ] Full legal move loop (check/mate/stalemate/draw)
- [ ] PGN import/export
- [ ] Undo last pair
- [ ] Flip board
- [ ] Clocks

## M4 — AI & PWA
- [ ] Stockfish WASM in Web Worker
- [ ] Difficulty presets (skill/depth/movetime)
- [ ] PWA manifest/icons; offline cache engine/assets
- [ ] Lighthouse installable passes

## M5 — Polish & Themes
- [ ] Themes (light/dark/high-contrast)
- [ ] Animations: move slide, capture fade, check pulse, mate confetti
- [ ] Accessibility pass; no console errors; smooth FPS

---

Acceptance Criteria: All v1 features implemented; tests pass; PWA installable; offline play works; README accurate.
