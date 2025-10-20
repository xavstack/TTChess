import React, { useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

export function AppShell({ children }: { children: React.ReactNode }): JSX.Element {
  const { tone, setTone, lastTaunt, difficulty, setDifficulty, chess } = useGameStore();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr_minmax(260px,320px)] gap-4 p-4">
      <aside className="order-2 md:order-1 bg-white/60 dark:bg-black/40 rounded-md p-3 border">
        <div className="font-semibold mb-2">Settings</div>
        <label className="block text-sm mb-1">Trash Talk Tone</label>
        <select
          className="w-full rounded border bg-white dark:bg-black p-2 mb-3"
          value={tone}
          onChange={(e) => setTone(e.target.value as any)}>
          <option value="off">Off</option>
          <option value="pg13">PG-13</option>
          <option value="spicy">Spicy</option>
        </select>

        <label className="block text-sm mb-1">AI Difficulty</label>
        <select
          className="w-full rounded border bg-white dark:bg-black p-2 mb-3"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}>
          <option>Beginner</option>
          <option>Casual</option>
          <option>Challenging</option>
          <option>Hard</option>
          <option>Insane</option>
        </select>

        <div className="mt-3 space-y-2">
          <button
            className="w-full rounded border p-2 text-sm"
            onClick={() => {
              const pgn = chess.pgn();
              const blob = new Blob([pgn], { type: 'text/plain' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'game.pgn';
              a.click();
            }}>
            Export PGN
          </button>
          <input ref={fileRef} type="file" accept=".pgn" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            chess.reset();
            chess.loadPgn(text);
          }} />
          <button className="w-full rounded border p-2 text-sm" onClick={() => fileRef.current?.click()}>
            Import PGN
          </button>
          <button className="w-full rounded border p-2 text-sm" onClick={() => {
            // Undo pair: undo two plies if possible
            chess.undo();
            chess.undo();
          }}>
            Undo Pair
          </button>
          <button className="w-full rounded border p-2 text-sm" onClick={() => {
            document.documentElement.classList.toggle('rotate-180');
          }}>
            Flip Board
          </button>
        </div>

        <button
          className="w-full rounded border p-2 text-sm mt-3"
          onClick={() => {
            document.documentElement.classList.toggle('dark');
          }}>
          Toggle Theme
        </button>
      </aside>

      <main className="order-1 md:order-2 flex items-center justify-center">
        {children}
      </main>

      <aside className="order-3 bg-white/60 dark:bg-black/40 rounded-md p-3 border flex flex-col">
        <div className="font-semibold mb-2">Avatar</div>
        <div className="text-sm opacity-70 mb-2">Clocks (placeholder)</div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs mb-4">
          <div className="rounded border p-2">You: 05:00</div>
          <div className="rounded border p-2">AI: 05:00</div>
        </div>
        <div className="mt-auto">
          <div className="text-sm opacity-70 mb-1">Trash Talk</div>
          <div className="rounded-md border p-3 min-h-[64px] bg-white dark:bg-black">
            {lastTaunt ?? '…'}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AppShell;
