import React from 'react';
import { useGameStore } from '../../store/gameStore';

export function AppShell({ children }: { children: React.ReactNode }): JSX.Element {
  const { tone, setTone, lastTaunt } = useGameStore();
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr_minmax(260px,320px)] gap-4 p-4">
      <aside className="order-2 md:order-1 bg-white/60 dark:bg-black/40 rounded-md p-3 border">
        <div className="font-semibold mb-2">Settings</div>
        <label className="block text-sm mb-1">Trash Talk Tone</label>
        <select
          className="w-full rounded border bg-white dark:bg-black p-2"
          value={tone}
          onChange={(e) => setTone(e.target.value as any)}>
          <option value="off">Off</option>
          <option value="pg13">PG-13</option>
          <option value="spicy">Spicy</option>
        </select>
      </aside>

      <main className="order-1 md:order-2 flex items-center justify-center">
        {children}
      </main>

      <aside className="order-3 bg-white/60 dark:bg-black/40 rounded-md p-3 border flex flex-col">
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
