# Testing Architecture: Trash-Talk Chess

## Overview

The project uses a multi-layered testing approach with automated unit tests and manual testing documented in structured test result files.

---

## Test Framework: Vitest

### Configuration
- **File**: `vitest.config.ts`
- **Environment**: Node.js
- **Test Runner**: Vitest v2.1.4
- **Package Scripts**:
  - `npm test` - Run tests once (CI mode)
  - `npm run test:ui` - Open Vitest UI for interactive testing

### Configuration Details
```typescript
{
  environment: 'node',
  setupFiles: []
}
```

**Notes**:
- Uses Node.js environment (not jsdom) for unit tests
- No setup files required currently
- Simple configuration suitable for pure logic tests

---

## Automated Test Suites

### 1. Trash Talk Selector Tests
- **File**: `src/trashTalk/selector.test.ts`
- **Tests**: 2
- **Status**: ✅ All passing
- **Coverage**:
  - Returns null when tone is "off"
  - Respects ring buffer to avoid repeats
- **Mocking**: localStorage mock for test isolation

### 2. TTS (Text-to-Speech) Tests
- **File**: `src/trashTalk/tts.test.ts`
- **Tests**: 3
- **Status**: ✅ All passing
- **Coverage**:
  - Speaks once when called
  - Debounces within 1.5s by cancelling previous
  - CancelSpeech cancels if speaking or pending
- **Mocking**: SpeechSynthesis API mock

### 3. Game Store Tests
- **File**: `src/store/gameStore.test.ts`
- **Tests**: 1
- **Status**: ✅ All passing
- **Coverage**:
  - Makes a legal move and updates boardVersion
- **Mocking**: localStorage mock

### Test Execution Results
```
✓ src/trashTalk/tts.test.ts (3 tests) 4ms
✓ src/trashTalk/selector.test.ts (2 tests) 5ms
✓ src/store/gameStore.test.ts (1 test) 160ms

Test Files  3 passed (3)
     Tests  6 passed (6)
```

**Total Coverage**: 6 automated tests, all passing

---

## Manual Testing Framework

### Test Plan Document
- **File**: `MANUAL_UI_TESTS_v0.2.md`
- **Purpose**: Comprehensive test cases for all UI features
- **Scope**: 89+ manual test cases across 11 categories

### Test Categories
1. Unified Dashboard System Tests (5 tests)
2. Player Nameplates Tests (6 tests)
3. Game Variants Tests (6 tests)
4. Difficulty & AI Tests (4 tests)
5. Move List & History Tests (6 tests)
6. Sidebar Collapse Tests (7 tests)
7. Gameplay Aids Tests (7 tests)
8. Clocks/Timers Tests (8 tests)
9. Themes & Styling Tests (10 tests)
10. Accessibility Tests (12 tests)
11. Error Handling Tests (8 tests)

### Manual Test Results Tracking
- **File**: `MANUAL_TEST_RESULTS_v0.2.md`
- **Purpose**: Formal tracking of manual test execution results
- **Format**: Status matrix across multiple versions/debug phases
- **Status Indicators**:
  - ✅ **Pass** - Feature works as expected
  - ❌ **Fail** - Feature broken or not working
  - ⚠️ **Partial** - Works but needs improvement
  - ➖ **Not Tested** - Not yet evaluated
  - 🔄 **Retest Required** - Needs re-evaluation after fixes

---

## Current Test Coverage

### Passing Tests (35+ from Manual Results)
✅ **Core Gameplay**:
- AI responds to moves
- Standard Chess variant works
- Chess960 variant works with random FEN
- Check highlight displays
- Checkmate detected
- Move list displays and updates
- Jump-to-move functionality works

✅ **UI/UX**:
- Left sidebar collapses to 40px
- Right sidebar collapses
- Sidebar toggle buttons visible
- Game end modal appears
- Clocks count down at 1s intervals
- Clock auto-flips after AI move
- Pause (P key) works
- Piece movement animated at 0.3s duration
- Best move arrows display
- Capture circles display
- Aids don't block piece clicks
- Avatar image displays (clease.png)
- All settings consolidated in left sidebar
- Hotkey `/` opens sidebar, `Esc` closes

### Partial Tests (5 from Manual Results)
⚠️ **Difficulty Scaling**: "Not completely convincing" - needs calibration
⚠️ **Piece Sets**: Using Unicode with per-set styling; PNG support exists but not implemented

### Not Tested Yet (49 tests remaining)
- Player nameplates above/below board (6 tests)
- Most game variant combinations (4 tests)
- Beginner/Insane difficulty playability (2 tests)
- AI thinking time scaling (1 test)
- PGN export/import (2 tests)
- Mobile layout (4 tests)
- Capture fade effect (1 test)
- Check pulse effect (1 test)
- Full accessibility suite (12 tests)
- Error handling scenarios (8 tests)
- Mobile responsive design (3 tests)
- Cross-browser compatibility (5 tests)

---

## Known Issues & Failing Tests

### Current Failures: NONE
**Status**: All 6 automated tests passing, 35+ manual tests passing

### Issues Needing Attention

1. **Difficulty Calibration** (Priority: Medium)
   - **Issue**: Difficulty levels "not completely convincing"
   - **Location**: `src/engine/types.ts` - PRESETS configuration
   - **Impact**: Affects user experience and game balance
   - **Action**: Calibrate skill/depth/movetime presets

2. **Piece Set Assets** (Priority: Low)
   - **Issue**: PNG assets not loading; using Unicode fallback
   - **Location**: `src/utils/pieceSets.ts`
   - **Impact**: Visual consistency but functional
   - **Action**: Implement PNG asset loading or document Unicode-only approach

3. **Incomplete Test Coverage** (Priority: Low)
   - **Issue**: ~45/89 manual tests executed (51% coverage)
   - **Gaps**: Mobile, accessibility, error handling, cross-browser
   - **Action**: Complete remaining test suite

---

## Testing Infrastructure

### Tools & Libraries
- **Vitest**: v2.1.4 - Unit testing framework
- **@testing-library/jest-dom**: v6.5.0 - DOM matchers
- **@testing-library/react**: v16.0.1 - React component testing
- **@testing-library/user-event**: v14.6.1 - User interaction simulation
- **jsdom**: v26.0.0 - DOM environment for tests (not currently used)

### Mock Strategy
- **localStorage**: Mocked in all test files using in-memory store
- **SpeechSynthesis API**: Mocked in TTS tests with control flags
- **Web Workers**: Not currently tested (async complexity)

### Continuous Integration
- **Script**: `npm test` (CI mode)
- **Expected**: All tests must pass before merge
- **Current**: ✅ 6/6 automated tests passing

---

## Test Quality Metrics

### Automated Tests
- **Total**: 6 tests across 3 files
- **Pass Rate**: 100% (6/6)
- **Execution Time**: ~825ms
- **Coverage**: Core business logic (selectors, TTS, store)

### Manual Tests
- **Total Tracked**: 45 tests across 12 categories
- **Pass Rate**: ~78% (35/45)
- **Partial**: ~11% (5/45)
- **Not Tested**: ~11% (5/45)

### Areas Lacking Coverage
- Component rendering tests (React components not tested)
- Integration tests (multi-component interactions)
- E2E tests (full user workflows)
- Accessibility automation (a11y testing)
- Performance tests (animation smoothness, load times)
- Cross-browser compatibility

---

## Recommendations

### Immediate Actions
1. ✅ Maintain current automated test suite (all passing)
2. ⚠️ Complete remaining manual test cases (~49 pending)
3. ⚠️ Address difficulty calibration issue

### Short-term Enhancements
1. Add React component tests for critical UI components
2. Implement integration tests for game flow
3. Add accessibility automated testing (axe-core, jest-axe)
4. Set up visual regression testing for UI components

### Long-term Goals
1. Achieve 80%+ automated test coverage
2. Implement E2E tests with Playwright or Cypress
3. Set up CI/CD pipeline with automated testing
4. Add performance benchmarking tests
5. Implement code coverage reporting

---

## Test Maintenance

### Adding New Tests
1. Create test file: `*.test.ts` or `*.spec.ts`
2. Follow existing patterns (mocking, structure)
3. Run `npm test` to verify
4. Update this document if adding new categories

### Updating Manual Tests
1. Edit `MANUAL_UI_TESTS_v0.2.md` for test cases
2. Update `MANUAL_TEST_RESULTS_v0.2.md` with results
3. Add new version columns as needed
4. Keep verbatim user feedback for context

### Test File Locations
```
trash-talk-chess/
├── src/
│   ├── trashTalk/
│   │   ├── selector.test.ts
│   │   └── tts.test.ts
│   ├── store/
│   │   └── gameStore.test.ts
│   └── [other components without tests yet]
├── MANUAL_UI_TESTS_v0.2.md
├── MANUAL_TEST_RESULTS_v0.2.md
└── TESTING_ARCHITECTURE.md (this file)
```

---

## Version History

- **v0.2.2**: All automated tests passing; 35+ manual tests passing
- **v0.2_debug_2**: Fixed critical AI bug; most features working
- **v0.2_debug_1**: Initial testing revealed multiple issues
- **v0.1**: Baseline tests established during v1 milestone

---

**Last Updated**: v0.2.2
**Next Review**: After addressing difficulty calibration and completing remaining manual tests
