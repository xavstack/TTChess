# Trash-Talk Chess

A browser chess game with an attitude: clean 2D board, right-side avatar, and voice trash-talk after every move.

## Quickstart

### Prerequisites
- Node.js 18+ and npm
- All configuration files present (see CONTRIBUTING.md)

### Setup
```bash
npm install
npm run dev
```

**Important:** If the UI appears as unstyled HTML (plain text), the Tailwind CSS configuration is missing. See CONTRIBUTING.md for required configuration files.

## Features (v1)
- Human vs AI (Stockfish WASM worker)
- Legal moves, check/mate/stalemate, draw rules
- PGN export/import, undo (last pair), flip board
- Clocks
- Themes: light / dark / high-contrast
- Animations: move slide, capture fade, check pulse, mate confetti (toggle)
- PWA installable & offline
- Trash talk after each move using Web Speech API; tone Off / PG-13 / Spicy; no repeats within last 5; debounce 1.5s; cancel on next move

## Controls
- Click piece, then destination square
- Left panel: moves & options; Right: avatar + taunt bubble
- Mobile: avatar top, board center, controls bottom

## Tech Stack
React + Vite + TypeScript; Zustand; chess.js; Stockfish WASM (Web Worker); Tailwind; Framer Motion; Web Speech API; vite-plugin-pwa; ESLint/Prettier; Vitest + RTL.

## Development
- Lint: `npm run lint`
- Test: `npm run test`
- Type-check: `npm run typecheck`
- Format: `npm run format`

See `PLAN.md`, `TRACK.md`, `DECISIONS.md`, and `CONTRIBUTING.md` for more.
