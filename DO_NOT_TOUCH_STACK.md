# Stack Freeze Policy

We are stabilizing the project. During this phase:
- **Do NOT modify**: `package.json`, lockfiles, `vite.config.*`, `tsconfig.*`, `tailwind.config.js`, Node version, or PWA config.
- **Do NOT upgrade/downgrade** any dependency without explicit human approval.
- If a fix **requires** a version change, STOP and write:
  `HUMAN DECISION REQUIRED: <what to change and why>`.

Current toolchain (from lockfile at time of freeze):
- React 19.2.0 / ReactDOM 19.2.0
- Vite 7.1.x / `@vitejs/plugin-react` 5.x
- Vitest 2.1.x
- jsdom 26.1.x
- Tailwind 4.1.x
- Typescript 5.9.x

Engine note:
- The current engine worker is a **heuristic evaluator**, not Stockfish. All code must respect the engine contract in `docs/engine_contract.md`. If we later swap in Stockfish WASM/worker, the contract remains the same.
