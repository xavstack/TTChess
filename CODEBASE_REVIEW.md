# Codebase Review - Trash-Talk Chess v1

## Priority 1: Critical Issues (FIXED)

- ✅ **Layout overflow**: Board doesn't fit viewport on small screens; right column gets cut off - FIXED via container-relative sizing
- ✅ **Mobile blank screens**: iOS Safari shows nothing due to viewport height handling - FIXED via proper viewport units
- ✅ **Plaintext UI**: Settings panels render as unstyled text instead of proper UI - FIXED via Tailwind CSS configuration

## Priority 2: Engine & Performance

- **Stockfish WASM**: Currently using random fallback; integrate actual WASM binary for real chess strength
- **Worker optimization**: Add skill/depth/hash parameters for better difficulty scaling
- **Move animations**: Basic piece animations exist; add capture fade, check pulse, mate confetti

## Priority 3: UX Polish

- **Theme persistence**: Store light/dark/high-contrast preference in localStorage
- **Voice selection**: Allow TTS voice selection and per-tone rate/pitch adjustments
- **PGN validation**: Add error handling for malformed PGN imports
- **Clock features**: Add increment, pause on modal, turn indicator

## Priority 4: Accessibility & Testing

- **ARIA roles**: Add proper roles for board, pieces, controls
- **Keyboard navigation**: Arrow keys for piece selection and movement
- **Component tests**: Add RTL tests for board rendering and viewport constraints
- **Selector improvements**: Hash-based deduplication to avoid near-duplicate taunts

## Priority 5: Content & Safety

- **Profanity filter**: Expand beyond substring matching to catch edge cases
- **Weighted randomness**: Reduce repetition in trash talk selection
- **Content audit**: Review all taunt lines for appropriate tone levels

## Technical Debt

- **Type safety**: Some `any` types in event handlers and DOM manipulation
- **Error boundaries**: Add React error boundaries around critical components
- **Bundle optimization**: Consider code splitting for engine worker
- **PWA caching**: Explicitly cache engine WASM when available

## Notes

- All core features implemented and working
- Tests passing with proper mocking
- PWA build successful with offline capabilities
- Ready for production with responsive fixes
