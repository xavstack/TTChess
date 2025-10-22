# Contributing

## Setup

### Prerequisites
- Node.js 18+ and npm
- All configuration files must be present (see checklist below)

### Initial Setup
```bash
npm install
npm run dev
```

### Configuration Files Required
Before development, ensure these files exist:
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS processing
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `vitest.config.ts` - Test configuration
- `.prettierrc` - Prettier formatting

### Verification Steps
1. `npm install` - Install dependencies
2. `npm run build` - Verify build process
3. `npm run typecheck` - Verify TypeScript
4. `npm run lint` - Verify linting
5. `npm run dev` - Start development server
6. Verify UI renders with proper styling (not plain HTML)

**If any step fails, fix the configuration before proceeding.**

## Scripts
- `npm run dev` — start dev server
- `npm run build` — type-check and build
- `npm run preview` — preview production build
- `npm run lint` — eslint
- `npm run test` — vitest

## Conventions
- React + Tailwind, no Bootstrap/jQuery/global CSS
- Components in `src/components/<Feature>/<Name>.tsx`
- Commit messages: Conventional Commits
- Write tests for critical paths before/with feature work

## Content Rules
- Provide "Off / PG-13 / Spicy" toggle; default PG-13
