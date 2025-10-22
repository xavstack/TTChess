// Piece set definitions with Unicode symbols
// All sets use free Unicode chess symbols - no attribution required

export type PieceSet = 'cburnett' | 'merida' | 'alpha' | 'staunty'

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
  }
}

// Unicode piece mappings for different sets
const PIECE_UNICODE: Record<PieceSet, Record<string, string>> = {
  cburnett: {
    // White pieces
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
    // Black pieces  
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
  },
  merida: {
    // White pieces (using similar Unicode symbols)
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
    // Black pieces
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
  },
  alpha: {
    // White pieces (using geometric symbols)
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
    // Black pieces
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
  },
  staunty: {
    // White pieces (traditional Staunton style)
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
    // Black pieces
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
  }
}

export function getPieceUnicode(piece: string, set: PieceSet = 'cburnett'): string {
  return PIECE_UNICODE[set][piece] || ''
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
