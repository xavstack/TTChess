let lastUtterance: SpeechSynthesisUtterance | null = null;
let lastSpokenAt = 0;
const MIN_INTERVAL_MS = 1500; // debounce ≥1.5s

export function cancelSpeech(): void {
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }
  lastUtterance = null;
}

export function speak(text: string): void {
  if (!('speechSynthesis' in window)) return;

  const now = Date.now();
  if (now - lastSpokenAt < MIN_INTERVAL_MS) {
    cancelSpeech();
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.02;
  utter.pitch = 1.0;
  utter.onend = () => {
    lastUtterance = null;
  };

  cancelSpeech(); // cancel any previous speech before speaking new
  window.speechSynthesis.speak(utter);
  lastUtterance = utter;
  lastSpokenAt = now;
}
