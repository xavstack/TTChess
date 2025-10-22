import type { JSX } from 'react'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { EffectiveTone } from '../../trashTalk/selector'
import type { Difficulty } from '../../engine/types'
import type { Variant } from '../../engine/rulesEngine'
import { getAllPieceSets } from '../../utils/pieceSets'
import type { PieceSet } from '../../utils/pieceSets'

interface DashboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function Dashboard({ isOpen, onClose }: DashboardProps): JSX.Element {
  const {
    tone,
    setTone,
    difficulty,
    setDifficulty,
    variant,
    setVariant,
    tauntEngineMoves,
    setTauntEngineMoves,
    exportPgn,
    importPgn,
    isEngineAvailable,
    showCoordinates,
    setShowCoordinates,
    boardTheme,
    setBoardTheme,
    showAids,
    setShowAids,
    pieceSet,
    setPieceSet,
  } = useGameStore()

  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  // Focus trap and ESC handling
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return

        const focusableElements = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    firstFocusableRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        importPgn(content)
        onClose()
      }
    }
    reader.readAsText(file)
  }

  const handleExport = () => {
    const pgn = exportPgn()
    const blob = new Blob([pgn], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'game.pgn'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-title"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 id="dashboard-title" className="text-xl font-semibold">
                  Game Settings
                </h2>
                <button
                  ref={firstFocusableRef}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  aria-label="Close settings"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Audio & Taunts */}
                <section>
                  <h3 className="text-lg font-medium mb-3">Audio & Taunts</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Trash Talk Tone</label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as EffectiveTone)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                      >
                        <option value="off">Off</option>
                        <option value="pg13">PG-13</option>
                        <option value="spicy">Spicy</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tauntEngineMoves}
                          onChange={(e) => setTauntEngineMoves(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Taunt on AI moves</span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Engine */}
                <section>
                  <h3 className="text-lg font-medium mb-3">Engine</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Casual">Casual</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Hard">Hard</option>
                      <option value="Insane">Insane</option>
                    </select>
                  </div>
                </section>

                {/* Variants */}
                <section>
                  <h3 className="text-lg font-medium mb-3">Game Variants</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Variant</label>
                    <select
                      value={variant}
                      onChange={(e) => setVariant(e.target.value as Variant)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                    >
                      <option value="standard">Standard Chess</option>
                      <option value="chess960">Chess960</option>
                      <option value="kingOfTheHill">King of the Hill</option>
                      <option value="threeCheck">Three Check</option>
                      <option value="horde">Horde</option>
                    </select>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {isEngineAvailable ? 'AI opponent available' : 'Human vs Human only'}
                    </p>
                  </div>
                </section>

                {/* Board Settings */}
                <section>
                  <h3 className="text-lg font-medium mb-3">Board Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showCoordinates}
                          onChange={(e) => setShowCoordinates(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show coordinates</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showAids}
                          onChange={(e) => setShowAids(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show gameplay aids</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Board Theme</label>
                      <select
                        value={boardTheme}
                        onChange={(e) => setBoardTheme(e.target.value)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                      >
                        <option value="classic-green">Classic Green</option>
                        <option value="blue-ice">Blue Ice</option>
                        <option value="walnut">Walnut</option>
                        <option value="slate">Slate</option>
                        <option value="night">Night</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Piece Set</label>
                      <select
                        value={pieceSet}
                        onChange={(e) => setPieceSet(e.target.value as PieceSet)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                      >
                        {getAllPieceSets().map(({ value, info }) => (
                          <option key={value} value={value}>
                            {info.name} - {info.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Import/Export */}
                <section>
                  <h3 className="text-lg font-medium mb-3">Import/Export</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleExport}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Export Game (PGN)
                    </button>
                    <div>
                      <input
                        type="file"
                        accept=".pgn,.txt"
                        onChange={handleFileImport}
                        className="hidden"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer block text-center"
                      >
                        Import Game (PGN)
                      </label>
                    </div>
                  </div>
                </section>

                {/* About */}
                <section>
                  <h3 className="text-lg font-medium mb-3">About</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Trash-Talk Chess v0.1</p>
                    <p>Built with React, TypeScript, and Chess.js</p>
                    <p>Piece sets: Free Unicode symbols</p>
                    <p>All piece sets use free Unicode chess symbols</p>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
