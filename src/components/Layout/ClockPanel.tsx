import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

interface ClockProps {
  timeMs: number
  isActive: boolean
  label: string
  onFlip?: () => void
}

function Clock({ timeMs, isActive, label, onFlip }: ClockProps): JSX.Element {
  const [isFlipping, setIsFlipping] = useState(false)
  
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleFlip = () => {
    if (onFlip) {
      setIsFlipping(true)
      setTimeout(() => {
        onFlip()
        setIsFlipping(false)
      }, 150)
    }
  }

  const isUrgent = timeMs < 10000 // Less than 10 seconds

  return (
    <motion.div
      className={`
        relative rounded-lg border-2 p-3 text-center cursor-pointer
        ${isActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
        }
        ${isUrgent ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        transition-all duration-200
      `}
      onClick={handleFlip}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Flip animation overlay */}
      {isFlipping && (
        <motion.div
          className="absolute inset-0 bg-blue-200 dark:bg-blue-800 rounded-lg"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          transition={{ duration: 0.15 }}
        />
      )}
      
      <div className="relative z-10">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </div>
        <div className={`
          text-lg font-mono font-bold
          ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
        `}>
          {formatTime(timeMs)}
        </div>
        {isActive && (
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Click to flip • Space
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function ClockPanel(): JSX.Element {
  const { timeWhiteMs, timeBlackMs, activeSide, setActiveSide } = useGameStore()

  // Space key handler for clock flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        if (activeSide) {
          setActiveSide(activeSide === 'w' ? 'b' : 'w')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeSide, setActiveSide])

  const handleWhiteFlip = () => {
    if (activeSide === 'w') {
      setActiveSide('b')
    }
  }

  const handleBlackFlip = () => {
    if (activeSide === 'b') {
      setActiveSide('w')
    }
  }

  // Auto-flip to white immediately after AI move completed
  // We detect this by ensuring that after a brief delay, if it's white's turn but activeSide is 'b', flip.
  useEffect(() => {
    const id = setInterval(() => {
      const { chess, activeSide } = useGameStore.getState()
      if (activeSide === 'b' && chess.turn() === 'w') {
        useGameStore.getState().setActiveSide('w')
      }
    }, 200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-2">
      <div className="font-semibold mb-2 text-sm md:text-base">Clocks</div>
      <div className="grid grid-cols-2 gap-2">
        <Clock
          timeMs={timeWhiteMs}
          isActive={activeSide === 'w'}
          label="White"
          onFlip={handleWhiteFlip}
        />
        <Clock
          timeMs={timeBlackMs}
          isActive={activeSide === 'b'}
          label="Black"
          onFlip={handleBlackFlip}
        />
      </div>
      
      {/* Clock presets */}
      <div className="mt-3 space-y-1">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Presets</div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => {
              useGameStore.setState({
                timeWhiteMs: 3 * 60 * 1000 + 2 * 1000,
                timeBlackMs: 3 * 60 * 1000 + 2 * 1000,
                activeSide: null
              })
            }}
            className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded"
          >
            3+2
          </button>
          <button
            onClick={() => {
              useGameStore.setState({
                timeWhiteMs: 5 * 60 * 1000,
                timeBlackMs: 5 * 60 * 1000,
                activeSide: null
              })
            }}
            className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded"
          >
            5+0
          </button>
          <button
            onClick={() => {
              useGameStore.setState({
                timeWhiteMs: 10 * 60 * 1000,
                timeBlackMs: 10 * 60 * 1000,
                activeSide: null
              })
            }}
            className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded"
          >
            10+0
          </button>
        </div>
      </div>
    </div>
  )
}
