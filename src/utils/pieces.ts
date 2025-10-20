import type { Piece as DatasetPiece } from '../trashTalk/pieceMap';

const unicodeByPiece: Record<string, string> = {
  // white
  P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔',
  // black
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
};

export function pieceToUnicode(p: string): string {
  return unicodeByPiece[p] ?? '';
}

export function toDatasetPiece(letter: string): DatasetPiece {
  const upper = letter.toUpperCase();
  if (upper === 'P' || upper === 'N' || upper === 'B' || upper === 'R' || upper === 'Q' || upper === 'K') {
    return upper as DatasetPiece;
  }
  return 'P';
}
