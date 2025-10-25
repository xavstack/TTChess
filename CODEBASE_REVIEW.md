
# Codebase Review - Trash-Talk Chess v1

## Priority 1: Critical Issues (FIXED)

- ✅ **Layout overflow**: Board doesn't fit viewport on small screens; right column gets cut off - FIXED via container-relative sizing
- ✅ **Mobile blank screens**: iOS Safari shows nothing due to viewport height handling - FIXED via proper viewport units
- ✅ **Plaintext UI**: Settings panels render as unstyled text instead of proper UI - FIXED via Tailwind CSS configuration

## Priority 2: Engine & Performance

- **Engine**: Browser-compatible skill-based AI implemented in `src/engine/engineWorker.ts`; Stockfish WASM can be dropped into `public/stockfish.wasm(.js)` and wired by the worker when available.
- **Worker optimization**: Difficulty presets (skill/depth/movetime) in `src/engine/types.ts` and `src/engine/engine.ts`.
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

## Map — Where Things Live

- Engine façade: `src/engine/engine.ts`
- Engine worker (AI logic): `src/engine/engineWorker.ts`
- Engine types & presets: `src/engine/types.ts`
- Variants and FEN generation: `src/engine/rulesEngine.ts`
- Aids worker façade: `src/engine/aidsEngine.ts`
- Store (Zustand): `src/store/gameStore.ts`
- Board & overlays: `src/components/Board/ChessBoard.tsx`
- Layout shell (sidebars, clocks, avatar): `src/components/Layout/AppShell.tsx`
- Clocks: `src/components/Layout/ClockPanel.tsx`
- Move list: `src/components/Layout/MoveList.tsx`
- Trash talk data/logic: `src/trashTalk/pieceMap.ts`, `src/trashTalk/selector.ts`, `src/trashTalk/tts.ts`
- Piece sets (Unicode styles): `src/utils/pieceSets.ts`

## Notes

- All core features implemented and working
- Build succeeds; PWA configured
- Manual test list in `MANUAL_UI_TESTS_v0.2.md`
