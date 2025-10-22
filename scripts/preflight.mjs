#!/usr/bin/env node
/*
  Preflight checks before starting dev/build:
  - Node version is compatible (>=20.19 <21 || >=22.12 <23)
  - Required config files exist
  - Tailwind v4 bridge present (@tailwindcss/postcss)
  - Kill stray Vite dev servers on ports 5173–5176
*/

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

function fail(msg) {
  console.error(`\n[preflight] ERROR: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[preflight] ${msg}`);
}

// 1) Node version check
(() => {
  const v = process.versions.node; // e.g., 22.12.0
  const [maj, min] = v.split('.').map(Number);
  const compatible =
    (maj === 20 && min >= 19) ||
    (maj === 22 && min >= 12);
  if (!compatible) {
    fail(`Node ${v} is incompatible. Use Node >=20.19 or >=22.12.`);
  }
  ok(`Node ${v} compatible.`);
})();

// 2) Config files existence
(() => {
  const required = [
    'tailwind.config.js',
    'postcss.config.js',
    'vite.config.ts',
    'tsconfig.json',
    'eslint.config.js',
    'vitest.config.ts',
    '.prettierrc',
  ];
  const missing = required.filter((f) => !existsSync(resolve(projectRoot, f)));
  if (missing.length) {
    fail(`Missing configuration files: ${missing.join(', ')}`);
  }
  ok('All required configuration files present.');
})();

// 3) Tailwind v4 bridge presence
(() => {
  const pkgPath = resolve(projectRoot, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const hasBridge =
    (pkg.devDependencies && pkg.devDependencies['@tailwindcss/postcss']) ||
    (pkg.dependencies && pkg.dependencies['@tailwindcss/postcss']);
  if (!hasBridge) {
    fail('Missing @tailwindcss/postcss. Install with: npm i -D @tailwindcss/postcss');
  }
  ok('Tailwind PostCSS bridge present.');
})();

// 4) Kill stray vite processes on common dev ports
(() => {
  try {
    execSync('pkill -f vite', { stdio: 'ignore' });
  } catch {}
  try {
    execSync('lsof -ti:5173,5174,5175,5176 | xargs -I{} kill -9 {}', { stdio: 'ignore' });
  } catch {}
  ok('Ensured no stray dev servers on 5173–5176.');
})();

ok('Preflight complete.');

