# Deployment Instructions — Beta Build

## Server Deployment (cherrynoir.fr)

**Target URL**: https://cherrynoir.fr/sideprojects/Games/trash-talk-chess-beta/

### Build Configuration
- Base path configured in `vite.config.ts`: `/sideprojects/Games/trash-talk-chess-beta/`
- Production build location: `dist/` directory
- PWA enabled with offline caching

### Deployment Steps

1. **Build the production version**:
   ```bash
   cd trash-talk-chess
   npm run build
   ```

2. **Upload `dist/` contents to server**:
   - Upload all files from `trash-talk-chess/dist/` directory
   - Target server path: `/sideprojects/Games/trash-talk-chess-beta/`
   - Ensure directory structure is preserved

3. **Verify deployment**:
   - Visit: https://cherrynoir.fr/sideprojects/Games/trash-talk-chess-beta/
   - Check console for errors
   - Verify PWA installability
   - Test basic gameplay

### Files to Upload
```
dist/
├── assets/
│   ├── *.js (JavaScript bundles and workers)
│   └── *.css (Stylesheets)
├── icon-192.png
├── icon-512.png
├── index.html (entry point)
├── manifest.webmanifest (PWA manifest)
├── registerSW.js (Service worker registration)
├── sw.js (Service worker)
├── vite.svg
└── workbox-*.js (Workbox runtime)
```

### Server Requirements
- Static file hosting
- HTTPS enabled (required for PWA features)
- No special server-side processing needed
- Optional: gzip compression for assets

### Rebuild for Different Path
If deploying to a different path, update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your/custom/path/',
  // ... rest of config
})
```
Then rebuild: `npm run build`

### Rollback
To deploy to root domain instead:
1. Set `base: '/'` in `vite.config.ts`
2. Run `npm run build`
3. Upload to server root

### Testing Checklist
- [ ] App loads without console errors
- [ ] Assets load correctly (check Network tab)
- [ ] PWA manifest loads
- [ ] Service worker registers
- [ ] Game is playable
- [ ] Settings persist across reload
- [ ] TTS works (if browser supports)
- [ ] Mobile responsive layout works

### Known Limitations
- Browser TTS API required for trash-talk (not available in all browsers)
- Requires modern browser with ES6+ support
- Service worker requires HTTPS

