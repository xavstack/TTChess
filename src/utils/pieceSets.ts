// Piece set definitions with Unicode symbols
// All sets use free Unicode chess symbols - no attribution required

export type PieceSet = 'cburnett' | 'merida' | 'alpha' | 'staunty' | 'sketch'

export interface PieceSetInfo {
  name: string
  description: string
  attribution?: string
}

export const PIECE_SETS: Record<PieceSet, PieceSetInfo> = {
  cburnett: {
    name: 'Cburnett',
    description: 'Classic tournament style',
    attribution: 'Free Unicode symbols'
  },
  merida: {
    name: 'Merida',
    description: 'Modern rounded style',
    attribution: 'Free Unicode symbols'
  },
  alpha: {
    name: 'Alpha',
    description: 'Simple geometric style',
    attribution: 'Free Unicode symbols'
  },
  staunty: {
    name: 'Staunty',
    description: 'Traditional Staunton style',
    attribution: 'Free Unicode symbols'
  },
  sketch: {
    name: 'Sketch PNG',
    description: 'Hand-drawn PNG pieces',
    attribution: 'User-provided PNGs'
  }
}

// We use Unicode glyphs for all sets but style them differently via CSS classes
export function getPieceUnicode(piece: string): string {
  const map: Record<string, string> = {
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
  }
  return map[piece] || ''
}

export function getPieceCssClass(set: PieceSet): string {
  switch (set) {
    case 'cburnett':
      return 'fill-current'
    case 'merida':
      return 'fill-current drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]'
    case 'alpha':
      return 'fill-current tracking-wide'
    case 'staunty':
      return 'fill-current italic'
    case 'sketch':
      return 'fill-current'
  }
}

// Optional asset-based piece set support (PNG). Returns image URL when available.
export function getPieceAsset(set: PieceSet, piece: string): string | null {
  if (set !== 'sketch') return null
  const isWhite = piece === piece.toUpperCase()
  const prefix = isWhite ? 'white' : 'black'
  const typeMap: Record<string, string> = {
    'P': 'pawn', 'N': 'knight', 'B': 'bishop', 'R': 'castle', 'Q': 'queen', 'K': 'king',
    'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'castle', 'q': 'queen', 'k': 'king'
  }
  const type = typeMap[piece]
  if (!type) return null
  return `/chess_pieces_pngs/${prefix}_${type}.png`
}

export function getPieceSetInfo(set: PieceSet): PieceSetInfo {
  return PIECE_SETS[set]
}

export function getAllPieceSets(): Array<{ value: PieceSet; info: PieceSetInfo }> {
  return Object.entries(PIECE_SETS).map(([value, info]) => ({
    value: value as PieceSet,
    info
  }))
}
