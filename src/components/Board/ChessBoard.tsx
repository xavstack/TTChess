import React, { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { pieceToUnicode } from '../../utils/pieces';
import { motion, AnimatePresence } from 'framer-motion';

const files = ['a','b','c','d','e','f','g','h'] as const;
const ranks = ['8','7','6','5','4','3','2','1'] as const;

function squareName(fileIdx: number, rankIdx: number): `${typeof files[number]}${typeof ranks[number]}` {
  return `${files[fileIdx]}${ranks[rankIdx]}` as any;
}

function isDark(fileIdx: number, rankIdx: number): boolean {
  return (fileIdx + rankIdx) % 2 === 1;
}

export function ChessBoard(): JSX.Element {
  const { chess, selected, legalTargets, selectSquare, makeMove, boardVersion, flipped } = useGameStore();

  const board = useMemo(() => chess.board(), [chess, boardVersion]);

  return (
    <div className="w-full max-w-[min(90vw,650px)] aspect-square">
      <svg viewBox="0 0 8 8" className="w-full h-full">
        {Array.from({ length: 8 }).map((_, rankIdx) => (
          Array.from({ length: 8 }).map((_, fileIdx) => {
            const uiFileIdx = flipped ? 7 - fileIdx : fileIdx;
            const uiRankIdx = flipped ? 7 - rankIdx : rankIdx;
            const sq = squareName(uiFileIdx, uiRankIdx);
            const cell = board[uiRankIdx][uiFileIdx];
            const piece = cell ? pieceToUnicode((cell.color === 'w' ? cell.type.toUpperCase() : cell.type) as string) : '';
            const isSel = selected === sq;
            const isTarget = legalTargets.includes(sq as any);
            return (
              <g key={`${fileIdx}-${rankIdx}`} onClick={() => {
                if (selected) {
                  if (isTarget) {
                    makeMove(selected as any, sq as any);
                  } else if (selected === sq) {
                    selectSquare(null);
                  } else {
                    selectSquare(sq as any);
                  }
                } else {
                  selectSquare(sq as any);
                }
              }}>
                <rect x={fileIdx} y={rankIdx} width={1} height={1}
                  className={isSel ? 'fill-[#22d3ee]' : isDark(fileIdx, rankIdx) ? 'fill-[#769656]' : 'fill-[#eeeed2]'} />
                {isTarget && (
                  <circle cx={fileIdx + 0.5} cy={rankIdx + 0.5} r={0.12} className="fill-black/40" />
                )}
                <AnimatePresence>
                  {piece && (
                    <motion.text
                      key={`${sq}-${piece}`}
                      x={fileIdx + 0.5}
                      y={rankIdx + 0.68}
                      textAnchor="middle"
                      className="select-none"
                      fontSize={0.8}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {piece}
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            );
          })
        ))}
      </svg>
    </div>
  );
}

export default ChessBoard;
