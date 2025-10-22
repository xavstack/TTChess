import { describe, it, expect, beforeEach, vi } from 'vitest'
import { selectTrashTalk } from './selector'

// Mock localStorage
const store: Record<string, string> = {}
const getItem = vi.fn((k: string) => store[k] ?? null)
const setItem = vi.fn((k: string, v: string) => {
  store[k] = v
})

// @ts-expect-error -- mock localStorage for tests
global.localStorage = { getItem, setItem }

describe('selectTrashTalk', () => {
  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k]
    getItem.mockClear()
    setItem.mockClear()
  })

  it('returns null when tone is off', () => {
    const line = selectTrashTalk('P', 'off')
    expect(line).toBeNull()
  })

  it('respects ring buffer to avoid repeats', () => {
    const a = selectTrashTalk('P', 'pg13')
    const b = selectTrashTalk('P', 'pg13')
    expect(a).not.toEqual(b)
  })
})
