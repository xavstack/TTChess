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

## ADR-004: Engine Worker Fallback

- Worker API stabilized; when Worker is unavailable (tests/node), engine falls back to random legal move locally to keep flows deterministic and tests green.

## ADR-005: PWA Caching Strategy

- generateSW with Workbox; runtime caching via Stale-While-Revalidate for app routes/assets; manifest links and icons provided.

## ADR-006: Unified Settings in Left Sidebar (Revised)

- Consolidate all settings into the collapsible left sidebar. `/` opens the sidebar; `Esc` collapses.
- Settings include Audio/Taunts, Engine, Variants, Board, Aids, Import/Export, Utilities.
- Rationale: reduces modal complexity, keeps controls one click away, simplifies accessibility.

## ADR-007: Layout and Viewport Constraints

- Board container uses `aspect-ratio: 1 / 1` and `height: clamp(60vh, 98vh, 98vh)` with safe-area padding.
- Player nameplates positioned above/below board; text scales with CSS clamp; never exceeds viewport.
- Rationale: predictable sizing across devices; avoid scroll-jank.

## ADR-008: Variants Strategy (Phase 1)

- Support Standard and Chess960 with engine play (Stockfish supports 960 castling rules via FEN).
- Provide King of the Hill, Three-check, Horde as human-vs-human only initially.
- Introduce `rulesEngine` interface to abstract move legality and result conditions; evaluate `chessops` before custom implementation.
- Rationale: incremental delivery without blocking on complex rule sets.

## ADR-009: Move List & Coordinates

- SAN move stream rendered in a collapsible panel; jump-to-move rewinds state using stored history.
- Board coordinates drawn outside squares to avoid occluding pieces; toggle in settings.

## ADR-010: Visual Themes and Piece Sets

- Ship 4–5 board palettes and 3–4 free-licensed piece sets (e.g., Cburnett, Merida, Staunty).
- Assets stored locally; attribution in About dialog; selection persisted.

## ADR-011: Gameplay Aids Rendering

- Suggested lines and capture candidates rendered as SVG overlays from a Web Worker message to avoid blocking.
- Debounce updates; disable in "rated" mode; hotkey to toggle.

## ADR-012: Clock Interaction

- Redesign clocks with a visible flip affordance; Space hotkey triggers turn handoff.
- Timers updated on animation frame throttled to whole seconds; clear urgency states under 10s.
