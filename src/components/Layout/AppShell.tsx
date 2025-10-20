import type { JSX } from 'react';
import { useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function AppShell({ children }: { children: React.ReactNode }): JSX.Element {
  const {
    tone, setTone, lastTaunt, difficulty, setDifficulty,
    timeWhiteMs, timeBlackMs, toggleFlip, exportPgn, importPgn,
  } = useGameStore();
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
              const pgn = exportPgn();
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
            importPgn(text);
          }} />
          <button className="w-full rounded border p-2 text-sm" onClick={() => fileRef.current?.click()}>
            Import PGN
          </button>
          <button className="w-full rounded border p-2 text-sm" onClick={() => useGameStore.getState().undoPair()}>
            Undo Pair
          </button>
          <button className="w-full rounded border p-2 text-sm" onClick={() => toggleFlip()}>
            Flip Board
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            className="rounded border p-2 text-sm"
            onClick={() => {
              document.documentElement.classList.toggle('dark');
            }}>
            Toggle Theme
          </button>
          <button
            className="rounded border p-2 text-sm"
            onClick={() => {
              document.documentElement.classList.toggle('high-contrast');
            }}>
            High Contrast
          </button>
        </div>
      </aside>

      <main className="order-1 md:order-2 flex items-center justify-center">
        {children}
      </main>

      <aside className="order-3 bg-white/60 dark:bg-black/40 rounded-md p-3 border flex flex-col">
        <div className="font-semibold mb-2">Clocks</div>
        <div className="grid grid-cols-2 gap-2 text-center text-sm mb-4">
          <div className="rounded border p-2">You: {formatMs(timeWhiteMs)}</div>
          <div className="rounded border p-2">AI: {formatMs(timeBlackMs)}</div>
        </div>
        <div className="font-semibold mb-2">Avatar</div>
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
