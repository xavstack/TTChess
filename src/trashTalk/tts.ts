let lastSpokenAt = 0;
const MIN_INTERVAL_MS = 1500; // debounce ≥1.5s

function synth() {
  return (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
}

export function cancelSpeech(): void {
  const s = synth();
  if (!s) return;
  if (s.speaking || s.pending) {
    s.cancel();
  }
}

export function speak(text: string): void {
  const s = synth();
  if (!s) return;

  const now = Date.now();
  if (now - lastSpokenAt < MIN_INTERVAL_MS) {
    cancelSpeech();
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.02;
  utter.pitch = 1.0;

  cancelSpeech(); // cancel any previous speech before speaking new
  s.speak(utter);
  lastSpokenAt = now;
}
