import { create } from 'zustand';
import { Chess, type Move, type Square } from 'chess.js';
import { selectTrashTalk, type EffectiveTone } from '../trashTalk/selector';
import { speak, cancelSpeech } from '../trashTalk/tts';
import { toDatasetPiece } from '../utils/pieces';
import { Engine, PRESETS, type Difficulty } from '../engine/engine';

export type UiMove = { from: Square; to: Square; san: string; piece: string; capture?: boolean; check?: boolean };

type StoreState = {
  chess: Chess;
  selected: Square | null;
  legalTargets: Square[];
  lastTaunt: string | null;
  tone: EffectiveTone;
  boardVersion: number;
  difficulty: Difficulty;
  engine: Engine;
  selectSquare: (sq: Square | null) => void;
  makeMove: (from: Square, to: Square) => void;
  setTone: (tone: EffectiveTone) => void;
  setDifficulty: (d: Difficulty) => void;
};

function getLegalTargets(chess: Chess, from: Square): Square[] {
  return chess.moves({ square: from, verbose: true }).map((m) => m.to as Square);
}

function moveToUi(move: Move): UiMove {
  return {
    from: move.from as Square,
    to: move.to as Square,
    san: move.san,
    piece: move.piece, // chess.js piece letter
    capture: !!move.captured,
    check: move.san.includes('+') || move.san.includes('#'),
  };
}

function maybeTaunt(move: UiMove, tone: EffectiveTone): string | null {
  const text = selectTrashTalk(toDatasetPiece(move.piece), tone, { capture: move.capture, check: move.check });
  if (text) speak(text);
  return text;
}

export const useGameStore = create<StoreState>((set, get) => ({
  chess: new Chess(),
  selected: null,
  legalTargets: [],
  lastTaunt: null,
  tone: ((): EffectiveTone => {
    const saved = localStorage.getItem('ttc_tone_v1');
    return (saved === 'pg13' || saved === 'spicy' || saved === 'off') ? (saved as EffectiveTone) : 'pg13';
  })(),
  boardVersion: 0,
  difficulty: ((): Difficulty => {
    const saved = localStorage.getItem('ttc_difficulty_v1');
    return (saved === 'Beginner' || saved === 'Casual' || saved === 'Challenging' || saved === 'Hard' || saved === 'Insane') ? (saved as Difficulty) : 'Casual';
  })(),
  engine: new Engine('Casual'),
  setTone: (tone) => {
    localStorage.setItem('ttc_tone_v1', tone);
    set({ tone });
  },
  setDifficulty: (d) => {
    localStorage.setItem('ttc_difficulty_v1', d);
    set({ difficulty: d, engine: new Engine(d) });
  },
  selectSquare: (sq) => {
    const { chess } = get();
    if (!sq) {
      set({ selected: null, legalTargets: [] });
      return;
    }
    const targets = getLegalTargets(chess, sq);
    set({ selected: sq, legalTargets: targets });
  },
  makeMove: async (from, to) => {
    const { chess, tone, engine } = get();

    const move = chess.move({ from, to, promotion: 'q' });
    if (!move) return;

    cancelSpeech(); // cancel if a previous line is mid-utterance
    const uiMove = moveToUi(move);

    const taunt = maybeTaunt(uiMove, tone);
    set({ selected: null, legalTargets: [], lastTaunt: taunt ?? null, boardVersion: Math.random() });

    // If game over, stop
    if (chess.isGameOver()) return;

    // Engine reply using worker
    const best = await engine.bestMove(chess.fen());
    const reply = chess.move({ from: best.from as Square, to: best.to as Square, promotion: 'q' });
    if (!reply) return;
    const uiReply = moveToUi(reply);
    const taunt2 = maybeTaunt(uiReply, tone);
    set({ lastTaunt: taunt2 ?? null, boardVersion: Math.random() });
  },
}));
