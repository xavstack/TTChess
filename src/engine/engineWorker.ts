/// <reference lib="webworker" />
import { Chess } from 'chess.js';

type EngineRequest =
  | { type: 'init'; skill: number; depth: number; movetime: number }
  | { type: 'bestmove'; fen: string };

type EngineResponse =
  | { type: 'ready' }
  | { type: 'bestmove'; san: string; from: string; to: string };

const ctx: DedicatedWorkerGlobalScope = self as any;
let skill = 1;
let depth = 4;
let movetime = 200;

ctx.onmessage = (e: MessageEvent<EngineRequest>) => {
  const msg = e.data;
  if (msg.type === 'init') {
    skill = msg.skill;
    depth = msg.depth;
    movetime = msg.movetime;
    ctx.postMessage({ type: 'ready' } satisfies EngineResponse);
    return;
  }
  if (msg.type === 'bestmove') {
    // Fallback: random legal move (placeholder until Stockfish WASM is wired)
    const chess = new Chess(msg.fen);
    const moves = chess.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (!move) return;
    chess.move(move);
    ctx.postMessage({ type: 'bestmove', san: move.san, from: move.from, to: move.to } satisfies EngineResponse);
  }
};
