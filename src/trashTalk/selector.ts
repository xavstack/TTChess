import { trashTalkLines, type Line, type Piece, type Tone } from './pieceMap'

export type EffectiveTone = Tone | 'off'

const RECENT_KEY = 'ttc_recent_lines_v1'
const RECENT_SIZE = 5

const bannedSubstrings = [
  // Keep snarky but avoid hate/identity attacks and slurs
  'cocksucker',
]

const safeSuffixes = {
  capture: ['Gotcha.', 'Off the board.', 'Another one bites the dust.'],
  check: ['Check.', 'Heads up.', 'Your king is in trouble.'],
}

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(recent: string[]): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(-RECENT_SIZE)))
  } catch {
    // ignore persistence errors
  }
}

function isAllowed(line: Line, tone: EffectiveTone): boolean {
  if (tone === 'off') return false
  if (line.tone !== tone) return false
  const lower = line.text.toLowerCase()
  return !bannedSubstrings.some(w => lower.includes(w))
}

function appendSuffix(base: string, opts?: { capture?: boolean; check?: boolean }): string {
  const parts: string[] = [base]
  if (opts?.capture) {
    const s = safeSuffixes.capture[Math.floor(Math.random() * safeSuffixes.capture.length)]
    parts.push(s)
  }
  if (opts?.check) {
    const s = safeSuffixes.check[Math.floor(Math.random() * safeSuffixes.check.length)]
    parts.push(s)
  }
  return parts.join(' ')
}

export function selectTrashTalk(
  piece: Piece,
  tone: EffectiveTone,
  opts?: { capture?: boolean; check?: boolean }
): string | null {
  if (tone === 'off') return null

  const recent = loadRecent()
  const candidates = trashTalkLines.filter(
    l => l.piece === piece && isAllowed(l, tone) && !recent.includes(l.text)
  )
  if (candidates.length === 0) {
    // fallback: ignore recent but keep tone and banned filter
    const fallback = trashTalkLines.filter(l => l.piece === piece && isAllowed(l, tone))
    if (fallback.length === 0) return null
    const pick = fallback[Math.floor(Math.random() * fallback.length)]
    const out = appendSuffix(pick.text, opts)
    recent.push(pick.text)
    saveRecent(recent)
    return out
  }
  const pick = candidates[Math.floor(Math.random() * candidates.length)]
  const out = appendSuffix(pick.text, opts)
  recent.push(pick.text)
  saveRecent(recent)
  return out
}
