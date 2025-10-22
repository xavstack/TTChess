import type { JSX } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  listVoices,
  setPreferredVoice,
  setVoiceRatePitch,
  setPreferredAudioUrl,
  cancelSpeech,
  speak,
} from './tts'

type UiVoice = { name: string; uri: string; lang?: string }

function getInitialRate(): number {
  const v = Number(localStorage.getItem('ttc_voice_rate_v1') ?? '1.02')
  return Number.isFinite(v) && v > 0 ? v : 1.02
}

function getInitialPitch(): number {
  const v = Number(localStorage.getItem('ttc_voice_pitch_v1') ?? '1.0')
  return Number.isFinite(v) ? v : 1.0
}

function getInitialVoiceId(): string {
  return localStorage.getItem('ttc_voice_id_v1') ?? ''
}

function getInitialAudioUrl(): string {
  return localStorage.getItem('ttc_voice_audio_url_v1') ?? ''
}

export default function VoiceDevTool(): JSX.Element | null {
  const [open, setOpen] = useState<boolean>(false)
  const [voices, setVoices] = useState<UiVoice[]>([])
  const [voiceId, setVoiceId] = useState<string>(getInitialVoiceId())
  const [rate, setRate] = useState<number>(getInitialRate())
  const [pitch, setPitch] = useState<number>(getInitialPitch())
  const [audioUrl, setAudioUrl] = useState<string>(getInitialAudioUrl())

  const hasAudioUrl = useMemo(() => audioUrl.trim().length > 0, [audioUrl])

  useEffect(() => {
    function refresh() {
      const v = listVoices().map(vv => ({ name: vv.name, uri: vv.voiceURI, lang: vv.lang }))
      setVoices(v)
    }
    // Chrome populates voices async
    try {
      const s = (globalThis as typeof globalThis & { speechSynthesis?: SpeechSynthesis })
        .speechSynthesis
      if (s) s.onvoiceschanged = () => refresh()
    } catch {
      // speechSynthesis not available
    }
    refresh()
  }, [])

  if (!import.meta.env.DEV) return null // Only show in dev

  return (
    <div className="mt-4 border rounded-md p-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">Dev: Voice Lab</div>
        <button className="text-xs rounded border px-2 py-1" onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          <div>
            <label className="block text-xs mb-1">System Voice</label>
            <select
              className="w-full rounded border p-1.5 text-xs bg-white dark:bg-black"
              value={voiceId}
              onChange={e => {
                const v = e.target.value
                setVoiceId(v)
                setPreferredVoice(v)
              }}
            >
              <option value="">(auto)</option>
              {voices.map(v => (
                <option key={v.uri} value={v.uri}>
                  {v.name} {v.lang ? `(${v.lang})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1">Rate ({rate.toFixed(2)})</label>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Pitch ({pitch.toFixed(2)})</label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={pitch}
                onChange={e => setPitch(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">
              Override with Audio URL (for custom voices; MP3/WAV/OGG)
            </label>
            <input
              className="w-full rounded border p-1.5 text-xs bg-white dark:bg-black"
              placeholder="https://example.com/my-voice.mp3"
              value={audioUrl}
              onChange={e => setAudioUrl(e.target.value)}
            />
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                className="rounded border px-2 py-1 text-xs"
                onClick={() => {
                  setPreferredAudioUrl(audioUrl.trim() || null)
                }}
              >
                Use URL
              </button>
              <button
                className="rounded border px-2 py-1 text-xs"
                onClick={() => {
                  setPreferredAudioUrl(null)
                  setAudioUrl('')
                }}
              >
                Clear URL
              </button>
              <button
                className="rounded border px-2 py-1 text-xs"
                onClick={() => {
                  cancelSpeech()
                  speak('Test line for voice tuning', { interrupt: true })
                }}
              >
                Test
              </button>
            </div>
            {hasAudioUrl && (
              <div className="text-xs opacity-70 mt-1">Using audio override for all taunts.</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="rounded border px-2 py-1 text-xs"
              onClick={() => {
                setVoiceRatePitch(rate, pitch)
              }}
            >
              Save Rate/Pitch
            </button>
            <button
              className="rounded border px-2 py-1 text-xs"
              onClick={() => {
                setPreferredVoice('')
                setVoiceRatePitch(1.02, 1.0)
                setPreferredAudioUrl(null)
                setVoiceId('')
                setRate(1.02)
                setPitch(1.0)
                setAudioUrl('')
              }}
            >
              Reset Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
