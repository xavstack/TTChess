# Progress Log

- M0: Project scaffolded with Vite React+TS; deps installed; Tailwind wired.
- M0: Rules/docs created (README, PLAN, TRACK, DECISIONS, CONTRIBUTING); Cursor rules hardened for YOLO.
- M1: Vertical slice complete — SVG board, user move, AI reply, taunt TTS (debounce/cancel); initial unit tests green.
- M2: Engine worker + difficulty presets wired into store/UI; current fallback move selection (random) until Stockfish WASM asset is packaged locally per constraints.
- M3: UI/UX — Framer Motion move animation; PGN import/export; undo pair; board flip; theme toggle; basic clocks (5+0) with ticking.
- M4: PWA manifest/icons added; runtime caching configured; production build successful.
- M5: High-contrast theme; tests expanded (TTS debounce/cancel; store sync); cleanup; no console errors.
- CRITICAL FIX: Added missing Tailwind CSS configuration files (tailwind.config.js, postcss.config.js) - UI was rendering as unstyled HTML due to missing PostCSS processing.
- GUARDRAILS: Enhanced .cursor/rules with comprehensive configuration guardrails and development setup checklist to prevent future omissions.
- DOCS: Updated CONTRIBUTING.md and README.md with clear setup requirements and troubleshooting guidance.
- CHECKLIST: Created DEV_SETUP_CHECKLIST.md with mandatory verification steps for all configuration files and build processes.
- DOCS CLEANUP: Consolidated redundant fix documentation (LAYOUT_FIX_ANALYSIS.md, LAYOUT_FIX_SUMMARY.md, TAILWIND_FIX_SUMMARY.md, FIX_STATUS.md) into this TRACK.md entry to reduce duplication and token waste.
- VOICE SYSTEM: Added Voice Lab dev tool for voice selection and custom audio URL overrides; refactored TTS with queued speech to prevent interruptions; added reversible gate to disable taunts on AI moves.
- PERFORMANCE: Fixed console "Violation setInterval" spam by throttling clock updates to whole-second boundaries while maintaining smooth display.
