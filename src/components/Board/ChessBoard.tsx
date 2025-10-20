import React, { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { pieceToUnicode } from '../../utils/pieces';

const files = ['a','b','c','d','e','f','g','h'] as const;
const ranks = ['8','7','6','5','4','3','2','1'] as const;

function squareId(fileIdx: number, rankIdx: number): `${typeof files[number]}${typeof ranks[number]}` {
  return `${files[fileIdx]}${ranks[rankIdx]}` as any;
}

function isDark(fileIdx: number, rankIdx: number): boolean {
  return (fileIdx + rankIdx) % 2 === 1;
}

export function ChessBoard(): JSX.Element {
  const { chess, selected, legalTargets, selectSquare, makeMove, boardVersion } = useGameStore();

  const board = useMemo(() => chess.board(), [chess, boardVersion]);

  return (
    <div className="w-full max-w-[min(90vw,650px)] aspect-square">
      <svg viewBox="0 0 8 8" className="w-full h-full">
        {ranks.map((r, rankIdx) => (
          files.map((f, fileIdx) => {
            const sq = squareId(fileIdx, rankIdx);
            const cell = board[rankIdx][fileIdx];
            const piece = cell ? pieceToUnicode((cell.color === 'w' ? cell.type.toUpperCase() : cell.type) as string) : '';
            const isSel = selected === sq;
            const isTarget = legalTargets.includes(sq as any);
            return (
              <g key={sq} onClick={() => {
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
                  className={isSel ? 'fill-accent' : isDark(fileIdx, rankIdx) ? 'fill-boardDark' : 'fill-boardLight'} />
                {isTarget && (
                  <circle cx={fileIdx + 0.5} cy={rankIdx + 0.5} r={0.12} className="fill-black/40" />
                )}
                {piece && (
                  <text x={fileIdx + 0.5} y={rankIdx + 0.68} textAnchor="middle" className="select-none" fontSize={0.8}>
                    {piece}
                  </text>
                )}
              </g>
            );
          })
        ))}
      </svg>
    </div>
  );
}

export default ChessBoard;
