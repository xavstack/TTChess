# Manual UI Test List: Trash-Talk Chess v0.2_unverified

## Test Environment Setup
- **Browser**: Chrome/Firefox/Safari (latest versions)
- **Device**: Desktop (1920x1080) and Mobile (375x667)
- **Mode**: Development server (`npm run dev`)
- **Prerequisites**: Clear localStorage, fresh browser session

---

## 1. Unified Dashboard System Tests

### 1.1 Dashboard Access
- [ ] **Test 1.1.1**: Click settings gear icon (⚙️) in left sidebar opens dashboard
- [ ] **Test 1.1.2**: Press `/` key opens dashboard
- [ ] **Test 1.1.3**: Dashboard opens with focus on close button (✕)
- [ ] **Test 1.1.4**: Dashboard has proper ARIA labels and modal role

### 1.2 Dashboard Navigation
- [ ] **Test 1.2.1**: Tab key cycles through all focusable elements
- [ ] **Test 1.2.2**: Shift+Tab cycles backwards through elements
- [ ] **Test 1.2.3**: ESC key closes dashboard
- [ ] **Test 1.2.4**: Click outside dashboard closes it
- [ ] **Test 1.2.5**: Focus trap prevents tabbing outside modal

### 1.3 Dashboard Content
- [ ] **Test 1.3.1**: All 6 sections visible: Audio & Taunts, Engine Settings, Game Variants, Board Settings, Import/Export, About
- [ ] **Test 1.3.2**: Settings reflect current game state
- [ ] **Test 1.3.3**: Changes persist after closing/reopening dashboard
- [ ] **Test 1.3.4**: Mobile responsive layout works correctly

---

## 2. Player Nameplates Tests

### 2.1 Nameplate Display
- [ ] **Test 2.1.1**: Player names appear above and below board
- [ ] **Test 2.1.2**: Names show "You" (white) and "AI" (black) by default
- [ ] **Test 2.1.3**: Names swap positions when board is flipped
- [ ] **Test 2.1.4**: Text scales responsively with viewport size

### 2.2 Viewport Constraints
- [ ] **Test 2.2.1**: Board + names never exceed 98vh height
- [ ] **Test 2.2.2**: Layout uses at least 98% of viewport height
- [ ] **Test 2.2.3**: Mobile viewport (375px width) displays correctly
- [ ] **Test 2.2.4**: Desktop viewport (1920px width) displays correctly

---

## 3. Game Variants Tests

### 3.1 Variant Selection
- [ ] **Test 3.1.1**: Standard Chess variant selected by default
- [ ] **Test 3.1.2**: Chess960 variant can be selected
- [ ] **Test 3.1.3**: King of the Hill variant can be selected
- [ ] **Test 3.1.4**: Three Check variant can be selected
- [ ] **Test 3.1.5**: Horde variant can be selected

### 3.2 AI Availability
- [ ] **Test 3.2.1**: Standard Chess shows "AI opponent available"
- [ ] **Test 3.2.2**: Chess960 shows "AI opponent available"
- [ ] **Test 3.2.3**: King of the Hill shows "Human vs Human only"
- [ ] **Test 3.2.4**: Three Check shows "Human vs Human only"
- [ ] **Test 3.2.5**: Horde shows "Human vs Human only"

### 3.3 Variant Functionality
- [ ] **Test 3.3.1**: Standard Chess plays against AI correctly
- [ ] **Test 3.3.2**: Chess960 starts with random piece positions
- [ ] **Test 3.3.3**: Variant selection resets game state
- [ ] **Test 3.3.4**: Variant persists across page reload

---

## 4. Move List Tests

### 4.1 Move Display
- [ ] **Test 4.1.1**: Move list shows "No moves yet" initially
- [ ] **Test 4.1.2**: Moves appear in format "1. e4 e5" after playing
- [ ] **Test 4.1.3**: Move numbers increment correctly
- [ ] **Test 4.1.4**: Both white and black moves display

### 4.2 Move List Controls
- [ ] **Test 4.2.1**: "Collapse" button hides move list
- [ ] **Test 4.2.2**: "Expand" button shows move list
- [ ] **Test 4.2.3**: "Jump" button next to each move works
- [ ] **Test 4.2.4**: "Copy PGN" button copies game to clipboard

### 4.3 Jump-to-Move Functionality
- [ ] **Test 4.3.1**: Click "Jump" on move 1 resets to starting position
- [ ] **Test 4.3.2**: Click "Jump" on move 5 shows position after 5 moves
- [ ] **Test 4.3.3**: Jump-to-move clears selected square
- [ ] **Test 4.3.4**: Jump-to-move updates board display correctly

---

## 5. Board Coordinates Tests

### 5.1 Coordinate Display
- [ ] **Test 5.1.1**: Coordinates disabled by default
- [ ] **Test 5.1.2**: Enabling coordinates shows files (a-h) at bottom
- [ ] **Test 5.1.3**: Enabling coordinates shows ranks (1-8) at left
- [ ] **Test 5.1.4**: Coordinates appear outside board squares

### 5.2 Coordinate Behavior
- [ ] **Test 5.2.1**: Coordinates flip with board orientation
- [ ] **Test 5.2.2**: Coordinates scale with board size
- [ ] **Test 5.2.3**: Coordinate setting persists across page reload
- [ ] **Test 5.2.4**: Coordinates work with all board themes

---

## 6. Board Color Palettes Tests

### 6.1 Theme Selection
- [ ] **Test 6.1.1**: Classic Green theme selected by default
- [ ] **Test 6.1.2**: Blue Ice theme can be selected
- [ ] **Test 6.1.3**: Walnut theme can be selected
- [ ] **Test 6.1.4**: Slate theme can be selected
- [ ] **Test 6.1.5**: Night theme can be selected

### 6.2 Theme Application
- [ ] **Test 6.2.1**: Theme changes apply immediately to board
- [ ] **Test 6.2.2**: Theme persists across page reload
- [ ] **Test 6.2.3**: Theme works with coordinates enabled
- [ ] **Test 6.2.4**: Theme works with all piece sets

### 6.3 High Contrast Mode
- [ ] **Test 6.3.1**: High Contrast button in left sidebar works
- [ ] **Test 6.3.2**: High contrast overrides board theme
- [ ] **Test 6.3.3**: High contrast setting persists
- [ ] **Test 6.3.4**: High contrast improves accessibility

---

## 7. Gameplay Aids Tests

### 7.1 Aids Display
- [ ] **Test 7.1.1**: Aids disabled by default
- [ ] **Test 7.1.2**: Enabling aids shows best move arrow (cyan)
- [ ] **Test 7.1.3**: Enabling aids shows capture circles (red)
- [ ] **Test 7.1.4**: Aids update when selecting different squares

### 7.2 Aids Performance
- [ ] **Test 7.2.1**: Aids calculation doesn't block UI
- [ ] **Test 7.2.2**: Aids update with debounced timing
- [ ] **Test 7.2.3**: Aids work with all game variants
- [ ] **Test 7.2.4**: Aids setting persists across page reload

### 7.3 Aids Accuracy
- [ ] **Test 7.3.1**: Best move arrow points to valid move
- [ ] **Test 7.3.2**: Capture circles highlight squares with captures
- [ ] **Test 7.3.3**: Aids disappear when aids disabled
- [ ] **Test 7.3.4**: Aids work correctly with board flip

---

## 8. Clock Redesign Tests

### 8.1 Clock Display
- [ ] **Test 8.1.1**: Clocks show "You: 05:00" and "AI: 05:00" initially
- [ ] **Test 8.1.2**: Clock format displays as MM:SS
- [ ] **Test 8.1.3**: Clocks positioned in right sidebar
- [ ] **Test 8.1.4**: Clock labels are clear and readable

### 8.2 Clock Functionality
- [ ] **Test 8.2.1**: "Done (Space)" button appears when game active
- [ ] **Test 8.2.2**: Space key triggers turn completion
- [ ] **Test 8.2.3**: Clock counts down during active turn
- [ ] **Test 8.2.4**: Clock stops when turn completed

### 8.3 Clock Integration
- [ ] **Test 8.3.1**: Clock starts on first human move
- [ ] **Test 8.3.2**: Clock switches between players correctly
- [ ] **Test 8.3.3**: Clock stops when game ends
- [ ] **Test 8.3.4**: Clock works with all game variants

---

## 9. Piece Set Library Tests

### 9.1 Piece Set Selection
- [ ] **Test 9.1.1**: Cburnett piece set selected by default
- [ ] **Test 9.1.2**: Merida piece set can be selected
- [ ] **Test 9.1.3**: Alpha piece set can be selected
- [ ] **Test 9.1.4**: Staunty piece set can be selected

### 9.2 Piece Display
- [ ] **Test 9.2.1**: Pieces display as Unicode symbols
- [ ] **Test 9.2.2**: Piece set changes apply immediately
- [ ] **Test 9.2.3**: Piece set persists across page reload
- [ ] **Test 9.2.4**: Pieces work with all board themes

### 9.3 Piece Attribution
- [ ] **Test 9.3.1**: About section shows piece set attribution
- [ ] **Test 9.3.2**: Attribution mentions "Unicode Chess Symbols"
- [ ] **Test 9.3.3**: Attribution is visible and clear
- [ ] **Test 9.3.4**: Attribution updates with piece set selection

---

## 10. Integration Tests

### 10.1 Settings Persistence
- [ ] **Test 10.1.1**: All settings persist across page reload
- [ ] **Test 10.1.2**: Settings persist across browser restart
- [ ] **Test 10.1.3**: Settings don't interfere with each other
- [ ] **Test 10.1.4**: Default settings work correctly

### 10.2 Cross-Feature Compatibility
- [ ] **Test 10.2.1**: All themes work with all piece sets
- [ ] **Test 10.2.2**: Coordinates work with all themes
- [ ] **Test 10.2.3**: Aids work with all variants
- [ ] **Test 10.2.4**: Dashboard works with all settings

### 10.3 Performance Tests
- [ ] **Test 10.3.1**: Dashboard opens/closes smoothly
- [ ] **Test 10.3.2**: Theme changes are instant
- [ ] **Test 10.3.3**: Move list updates quickly
- [ ] **Test 10.3.4**: Aids calculation doesn't lag UI

---

## 11. Accessibility Tests

### 11.1 Keyboard Navigation
- [ ] **Test 11.1.1**: All interactive elements reachable via Tab
- [ ] **Test 11.1.2**: Focus indicators are visible
- [ ] **Test 11.1.3**: ESC key closes modals
- [ ] **Test 11.1.4**: Space key works for buttons

### 11.2 Screen Reader Support
- [ ] **Test 11.2.1**: Dashboard has proper ARIA labels
- [ ] **Test 11.2.2**: Form controls have labels
- [ ] **Test 11.2.3**: Modal has proper role and aria-modal
- [ ] **Test 11.2.4**: Focus trap works with screen readers

---

## 12. Mobile Responsiveness Tests

### 12.1 Mobile Layout
- [ ] **Test 12.1.1**: Dashboard works on mobile (375px width)
- [ ] **Test 12.1.2**: Move list collapses properly on mobile
- [ ] **Test 12.1.3**: Board scales correctly on mobile
- [ ] **Test 12.1.4**: Touch interactions work correctly

### 12.2 Mobile Performance
- [ ] **Test 12.2.1**: Dashboard opens quickly on mobile
- [ ] **Test 12.2.2**: Theme changes are smooth on mobile
- [ ] **Test 12.2.3**: Aids don't cause performance issues
- [ ] **Test 12.2.4**: Touch targets are appropriately sized

---

## 13. Error Handling Tests

### 13.1 Edge Cases
- [ ] **Test 13.1.1**: Dashboard handles rapid open/close
- [ ] **Test 13.1.2**: Move list handles empty game state
- [ ] **Test 13.1.3**: Aids handle invalid positions
- [ ] **Test 13.1.4**: Clock handles game end correctly

### 13.2 Data Persistence
- [ ] **Test 13.2.1**: Settings survive localStorage corruption
- [ ] **Test 13.2.2**: Game state survives page refresh
- [ ] **Test 13.2.3**: Invalid settings fall back to defaults
- [ ] **Test 13.2.4**: Missing localStorage doesn't crash app

---

## 14. End-to-End Gameplay Tests

### 14.1 Complete Game Flow
- [ ] **Test 14.1.1**: Start new game, play complete game with all features
- [ ] **Test 14.1.2**: Change settings mid-game, verify persistence
- [ ] **Test 14.1.3**: Use jump-to-move, continue playing
- [ ] **Test 14.1.4**: Export PGN, import PGN, verify accuracy

### 14.2 Feature Combination Tests
- [ ] **Test 14.2.1**: Play with aids enabled, coordinates on, custom theme
- [ ] **Test 14.2.2**: Play Chess960 variant with custom piece set
- [ ] **Test 14.2.3**: Use dashboard to change multiple settings during game
- [ ] **Test 14.2.4**: Test all variants with different settings combinations

---

## Test Completion Checklist

- [ ] **All 14 feature areas tested**
- [ ] **Desktop and mobile tested**
- [ ] **All major browsers tested**
- [ ] **Accessibility requirements verified**
- [ ] **Performance benchmarks met**
- [ ] **Error handling verified**
- [ ] **Data persistence confirmed**
- [ ] **Cross-feature compatibility verified**

## Test Results Summary
- **Total Tests**: 84 individual test cases
- **Test Categories**: 14 feature areas
- **Coverage**: All M6 features and integrations
- **Priority**: High (core functionality), Medium (UI/UX), Low (edge cases)
