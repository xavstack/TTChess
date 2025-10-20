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
    const chess = new Chess(msg.fen);
    const moves = chess.moves({ verbose: true });
    const bias = (skill + depth) % (moves.length || 1);
    const pick = moves[(Math.floor(Math.random() * moves.length) + bias) % moves.length];
    if (!pick) return;
    setTimeout(() => {
      chess.move(pick);
      ctx.postMessage({ type: 'bestmove', san: pick.san, from: pick.from, to: pick.to } satisfies EngineResponse);
    }, Math.max(50, movetime));
  }
};
