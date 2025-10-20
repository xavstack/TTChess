# Architectural Decisions (ADR)

## ADR-001: Tech Stack
- React + Vite + TypeScript for fast DX
- Tailwind for utility-first styling; no global CSS
- Zustand for simple global state
- chess.js for rules and PGN
- Stockfish WASM via Web Worker for engine
- Web Speech API for TTS (browser-only)
- vite-plugin-pwa for installability/offline

## ADR-002: UI Composition
- Components live in `src/components/<Feature>/<Name>.tsx`
- SVG board for crisp scaling; Framer Motion for micro-animations
- Radix primitives when accessible behavior needed

## ADR-003: Trash Talk System
- Dataset: `src/trashTalk/pieceMap.ts`
- Selector ensures piece match, tone filter, no-repeat (ring=5), capture/check suffix
- TTS via Web Speech API with debounce >=1.5s and cancel on next move
