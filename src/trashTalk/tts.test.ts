import { describe, it, expect, beforeEach, vi } from 'vitest'
import { speak, cancelSpeech } from './tts'

const mockSynth = {
  speaking: false,
  pending: false,
  cancel: vi.fn(),
  speak: vi.fn(),
}

// @ts-expect-error -- mock SpeechSynthesis for tests
;(globalThis as typeof globalThis & { speechSynthesis: typeof mockSynth }).speechSynthesis =
  mockSynth
// @ts-expect-error -- mock SpeechSynthesisUtterance for tests
;(
  globalThis as typeof globalThis & {
    SpeechSynthesisUtterance: new (text: string) => { text: string }
  }
).SpeechSynthesisUtterance = function (this: { text: string }, text: string) {
  this.text = text
}

describe('tts', () => {
  beforeEach(() => {
    mockSynth.speaking = false
    mockSynth.pending = false
    mockSynth.cancel.mockClear()
    mockSynth.speak.mockClear()
  })

  it('speaks once', () => {
    speak('hello')
    expect(mockSynth.speak).toHaveBeenCalledTimes(1)
  })

  it('debounces within 1.5s by cancelling previous', () => {
    mockSynth.speaking = true
    speak('a')
    speak('b')
    expect(mockSynth.cancel).toHaveBeenCalled()
  })

  it('cancelSpeech cancels if speaking or pending', () => {
    mockSynth.speaking = true
    cancelSpeech()
    expect(mockSynth.cancel).toHaveBeenCalled()
  })
})
