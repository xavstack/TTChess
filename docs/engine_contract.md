# Engine Contract (UI/Store ↔ Engine Worker)

## Purpose
This contract defines the ONLY allowed protocol between the app and the engine worker. Any engine implementation (heuristic or Stockfish) must adhere to it.

## Lifecycle
1. Worker creation → it must emit a single `{ type: "ready" }` message when ready.
2. After `ready`, the app may send requests.

## Requests (main thread → worker)
- `{ type: "newgame" }`
  - Reset internal analysis state to the standard chess initial position.
- `{ type: "setoptions", skill?: number, depth?: number, movetime?: number }`
  - Update internal tuning; optional fields are partial.
- `{ type: "bestmove", fen: string }`
  - Compute the best move for the side to move in `fen`.
  - Must respond within `movetime` (soft deadline).

## Responses (worker → main thread)
- `{ type: "ready" }`
  - Emitted exactly once, after engine is able to accept commands.
- `{ type: "bestmove", from: Square, to: Square, san: string }`
  - The move must be legal for the given FEN.
- `{ type: "error", message: string, code?: string }`
  - For malformed requests or timeouts; the worker must never hang silently.

## Rules
- **Single source of truth** for turn/fen is the **store/UI**, not the engine.
- The engine **must not** mutate UI state directly; it only posts messages.
- If no legal move exists, respond with `{ type: "error", code: "NO_MOVE" }`.
- All messages are **JSON-serializable** and **typed** per `src/engine/types.ts`.
