import type { JSX } from 'react'
import { useRef } from 'react'
import VoiceDevTool from '../../trashTalk/VoiceDevTool'
import { useGameStore } from '../../store/gameStore'

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export function AppShell({ children }: { children: React.ReactNode }): JSX.Element {
  const {
    tone,
    setTone,
    lastTaunt,
    difficulty,
    setDifficulty,
    timeWhiteMs,
    timeBlackMs,
    toggleFlip,
    exportPgn,
    importPgn,
  } = useGameStore()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-[minmax(260px,320px)_1fr_minmax(260px,320px)] md:grid-rows-[1fr] gap-2 md:gap-4 p-2 md:p-4 max-h-screen overflow-hidden">
      <aside className="order-1 md:order-1 bg-white/60 dark:bg-black/40 rounded-md p-3 border mb-2 md:mb-0 overflow-y-auto">
        <div className="font-semibold mb-2 text-sm md:text-base">Settings</div>
        <div className="space-y-2">
          <div>
            <label className="block text-xs md:text-sm mb-1">Trash Talk Tone</label>
            <select
              className="w-full rounded border bg-white dark:bg-black p-1.5 md:p-2 text-xs md:text-sm"
              value={tone}
              onChange={e => setTone(e.target.value as any)}
            >
              <option value="off">Off</option>
              <option value="pg13">PG-13</option>
              <option value="spicy">Spicy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm mb-1">AI Difficulty</label>
            <select
              className="w-full rounded border bg-white dark:bg-black p-1.5 md:p-2 text-xs md:text-sm"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as any)}
            >
              <option>Beginner</option>
              <option>Casual</option>
              <option>Challenging</option>
              <option>Hard</option>
              <option>Insane</option>
            </select>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <button
            className="w-full rounded border p-1.5 md:p-2 text-xs md:text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            onClick={() => {
              const pgn = exportPgn()
              const blob = new Blob([pgn], { type: 'text/plain' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = 'game.pgn'
              a.click()
            }}
          >
            Export PGN
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pgn"
            className="hidden"
            onChange={async e => {
              const file = e.target.files?.[0]
              if (!file) return
              const text = await file.text()
              importPgn(text)
            }}
          />
          <button
            className="w-full rounded border p-1.5 md:p-2 text-xs md:text-sm bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
            onClick={() => fileRef.current?.click()}
          >
            Import PGN
          </button>
          <button
            className="w-full rounded border p-1.5 md:p-2 text-xs md:text-sm bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
            onClick={() => useGameStore.getState().undoPair()}
          >
            Undo Pair
          </button>
          <button
            className="w-full rounded border p-1.5 md:p-2 text-xs md:text-sm bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40"
            onClick={() => toggleFlip()}
          >
            Flip Board
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-3">
          <button
            className="rounded border p-1.5 md:p-2 text-xs md:text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              const isDark = document.documentElement.classList.toggle('dark')
              localStorage.setItem('ttc_theme_v1', isDark ? 'dark' : 'light')
            }}
          >
            Toggle Theme
          </button>
          <button
            className="rounded border p-1.5 md:p-2 text-xs md:text-sm bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40"
            onClick={() => {
              const isHighContrast = document.documentElement.classList.toggle('high-contrast')
              localStorage.setItem('ttc_high_contrast_v1', isHighContrast ? 'true' : 'false')
            }}
          >
            High Contrast
          </button>
        </div>
      </aside>

      <main className="order-2 md:order-2 flex items-center justify-center flex-1 min-h-0 w-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-2">
          {children}
          <div className="hidden md:block absolute bottom-2 right-2 max-w-[360px]">
            <VoiceDevTool />
          </div>
        </div>
      </main>

      <aside className="order-3 bg-white/60 dark:bg-black/40 rounded-md p-3 border flex flex-col mt-2 md:mt-0 overflow-y-auto">
        <div className="font-semibold mb-2 text-sm md:text-base">Clocks</div>
        <div className="grid grid-cols-2 gap-1.5 md:gap-2 text-center text-xs md:text-sm mb-3 md:mb-4">
          <div className="rounded border p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/20">
            You: {formatMs(timeWhiteMs)}
          </div>
          <div className="rounded border p-1.5 md:p-2 bg-red-50 dark:bg-red-900/20">
            AI: {formatMs(timeBlackMs)}
          </div>
        </div>
        <div className="font-semibold mb-2 text-sm md:text-base">Avatar</div>
        <div className="mt-auto">
          <div className="text-xs md:text-sm opacity-70 mb-1">Trash Talk</div>
          <div className="rounded-md border p-2 md:p-3 min-h-[48px] md:min-h-[64px] bg-white dark:bg-black text-xs md:text-sm">
            {lastTaunt ?? '…'}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default AppShell
