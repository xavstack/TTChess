# Development Setup Checklist

This checklist ensures all configuration files and dependencies are properly set up before development begins.

## ✅ Configuration Files (REQUIRED)

### Core Configuration

- [ ] `tailwind.config.js` - Tailwind CSS configuration with correct content paths
- [ ] `postcss.config.js` - PostCSS processing with tailwindcss and autoprefixer plugins
- [ ] `vite.config.ts` - Vite build configuration with React plugin
- [ ] `tsconfig.json` - TypeScript configuration with React settings
- [ ] `eslint.config.js` - ESLint configuration with React rules
- [ ] `vitest.config.ts` - Test configuration with jsdom environment
- [ ] `.prettierrc` - Prettier formatting configuration

### Package Management

- [ ] `package.json` - Contains all required dependencies
- [ ] `package-lock.json` - Lock file present (generated after npm install)

## ✅ Dependencies Verification

### Installation

- [ ] `npm install` completes without errors
- [ ] All required dependencies listed in package.json are installed
- [ ] No missing peer dependencies warnings
- [ ] No security vulnerabilities (run `npm audit`)

### Required Dependencies

- [ ] React 19.1.1
- [ ] React DOM 19.1.1
- [ ] TailwindCSS 4.1.14
- [ ] PostCSS 8.5.6
- [ ] Autoprefixer 10.4.21
- [ ] Vite 7.1.7
- [ ] TypeScript 5.9.3
- [ ] ESLint 9.36.0
- [ ] Prettier 3.2.5
- [ ] Vitest 2.1.4

## ✅ Build Process Verification

### TypeScript

- [ ] `npm run typecheck` passes without errors
- [ ] All TypeScript files compile successfully

### Linting & Formatting

- [ ] `npm run lint` passes (or has only known acceptable warnings)
- [ ] `npm run format` completes successfully
- [ ] Code follows project formatting standards

### Build

- [ ] `npm run build` completes successfully
- [ ] Production build generates in `dist/` folder
- [ ] No build errors or warnings

## ✅ Development Server

### Server Startup

- [ ] `npm run dev` starts without errors
- [ ] Development server serves on http://localhost:5173 (or specified port)
- [ ] Hot module replacement (HMR) works
- [ ] No console errors in browser

### UI Rendering Verification

- [ ] Development server serves the application
- [ ] Tailwind CSS classes are applied (not plain HTML)
- [ ] Components render with intended styling
- [ ] Responsive layout works on desktop and mobile
- [ ] Dark/light theme toggle works
- [ ] Chess board displays correctly

## ✅ Test Suite Verification

### Unit Tests

- [ ] `npm run test` passes
- [ ] Component tests run successfully
- [ ] No failing tests
- [ ] Test coverage is adequate

### Integration Tests

- [ ] Game logic tests pass
- [ ] Store/state management tests pass
- [ ] Trash talk system tests pass

## ✅ PWA Features

### Manifest

- [ ] PWA manifest is valid
- [ ] Icons are present and correct sizes
- [ ] App can be installed on mobile/desktop

### Service Worker

- [ ] Service worker registers correctly
- [ ] Offline functionality works
- [ ] Caching strategy is implemented

## 🚨 Failure Handling

**If ANY item above fails:**

1. **STOP** all development work
2. **IDENTIFY** the root cause of the failure
3. **FIX** the configuration or dependency issue
4. **VERIFY** the fix by re-running the checklist
5. **ONLY THEN** proceed with development

## 📝 Common Issues & Solutions

### Tailwind CSS Not Working

- **Symptom:** UI appears as unstyled HTML
- **Solution:** Ensure `tailwind.config.js` and `postcss.config.js` exist
- **Verify:** Check that Tailwind classes are applied in browser dev tools

### Build Failures

- **Symptom:** `npm run build` fails
- **Solution:** Check TypeScript configuration and fix type errors
- **Verify:** Run `npm run typecheck` first

### Test Failures

- **Symptom:** `npm run test` fails
- **Solution:** Check test configuration and fix failing tests
- **Verify:** Ensure all dependencies are installed

### Development Server Issues

- **Symptom:** `npm run dev` fails or serves broken UI
- **Solution:** Check Vite configuration and restart server
- **Verify:** Clear browser cache and reload

## 📋 Quick Verification Commands

Run these commands to quickly verify setup:

```bash
# Install dependencies
npm install

# Check TypeScript
npm run typecheck

# Check linting
npm run lint

# Run tests
npm run test

# Build project
npm run build

# Start dev server
npm run dev
```

All commands should complete without errors for a properly configured project.

---

**Remember:** This checklist prevents wasted development time by ensuring all prerequisites are met before starting work.
