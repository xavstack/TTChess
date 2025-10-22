let lastSpokenAt = 0
const MIN_INTERVAL_MS = 1500 // debounce ≥1.5s

function synth(): SpeechSynthesis | undefined {
  return (globalThis as typeof globalThis & { speechSynthesis?: SpeechSynthesis })
    .speechSynthesis
}

// Voice preferences (persisted)
let preferredVoiceId: string | null = ((): string | null =>
  localStorage.getItem('ttc_voice_id_v1'))()
let preferredRate = Number(localStorage.getItem('ttc_voice_rate_v1') ?? '1.02') || 1.02
let preferredPitch = Number(localStorage.getItem('ttc_voice_pitch_v1') ?? '1.0') || 1.0

// Optional audio override (dev tool)
let preferredAudioUrl: string | null = localStorage.getItem('ttc_voice_audio_url_v1')

type QueueItem =
  | { kind: 'tts'; utter: SpeechSynthesisUtterance }
  | { kind: 'audio'; audio: HTMLAudioElement }

const queue: QueueItem[] = []
let isSpeaking = false

export function listVoices(): SpeechSynthesisVoice[] {
  return synth()?.getVoices() ?? []
}

function resolveVoice(): SpeechSynthesisVoice | null {
  const s = synth()
  if (!s) return null
  const voices = s.getVoices()
  if (!voices.length) return null
  if (preferredVoiceId) {
    const byId = voices.find(v => v.voiceURI === preferredVoiceId || v.name === preferredVoiceId)
    if (byId) return byId
  }
  return voices.find(v => v.lang?.toLowerCase().startsWith('en')) ?? voices[0] ?? null
}

export function setPreferredVoice(idOrName: string): void {
  preferredVoiceId = idOrName
  localStorage.setItem('ttc_voice_id_v1', idOrName)
  cancelSpeech()
}

export function setVoiceRatePitch(rate: number, pitch: number): void {
  preferredRate = Math.max(0.5, Math.min(rate, 2))
  preferredPitch = Math.max(0, Math.min(pitch, 2))
  localStorage.setItem('ttc_voice_rate_v1', String(preferredRate))
  localStorage.setItem('ttc_voice_pitch_v1', String(preferredPitch))
}

export function setPreferredAudioUrl(url: string | null): void {
  preferredAudioUrl = url
  if (url) localStorage.setItem('ttc_voice_audio_url_v1', url)
  else localStorage.removeItem('ttc_voice_audio_url_v1')
  cancelSpeech()
}

function playNext(): void {
  const s = synth()
  const next = queue.shift()
  if (!next) {
    isSpeaking = false
    return
  }
  isSpeaking = true
  if (next.kind === 'audio') {
    const a = next.audio
    a.onended = () => {
      isSpeaking = false
      lastSpokenAt = Date.now()
      playNext()
    }
    a.onerror = () => {
      isSpeaking = false
      playNext()
    }
    try {
      a.currentTime = 0
      a.play().catch(() => {
        isSpeaking = false
      })
    } catch {
      isSpeaking = false
    }
    return
  }
  if (!s) {
    isSpeaking = false
    queue.length = 0
    return
  }
  const u = next.utter
  u.onend = () => {
    isSpeaking = false
    lastSpokenAt = Date.now()
    playNext()
  }
  u.onerror = () => {
    isSpeaking = false
    playNext()
  }
  s.speak(u)
}

export function cancelSpeech(): void {
  const s = synth()
  // Stop audio items
  for (const item of queue) {
    if (item.kind === 'audio')
      try {
        item.audio.pause()
      } catch {}
  }
  queue.length = 0
  isSpeaking = false
  if (s && (s.speaking || s.pending)) s.cancel()
}

export function speak(text: string, opts: { interrupt?: boolean } = {}): void {
  const s = synth()
  const now = Date.now()
  const withinDebounce = now - lastSpokenAt < MIN_INTERVAL_MS

  if (opts.interrupt) {
    cancelSpeech()
  } else if (withinDebounce) {
    if (queue.length > 0) queue.pop()
  }

  if (preferredAudioUrl) {
    const audio = new Audio(preferredAudioUrl)
    queue.push({ kind: 'audio', audio })
  } else {
    if (!s) return
    const utter = new SpeechSynthesisUtterance(text)
    const v = resolveVoice()
    if (v) {
      utter.voice = v
      utter.lang = v.lang || utter.lang
    }
    utter.rate = preferredRate
    utter.pitch = preferredPitch
    queue.push({ kind: 'tts', utter })
  }

  if (!isSpeaking && (!s || (!s.speaking && !s.pending))) {
    playNext()
  }
}

// Ensure voice list populates in Chrome
;(function ensureVoicesReady() {
  const s = synth()
  if (!s) return
  if (!s.getVoices().length) {
    s.onvoiceschanged = () => {
      /* populated lazily */
    }
  }
})()
