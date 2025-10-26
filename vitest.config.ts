import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [],
    // helpful in CI to avoid stuck workers
    testTimeout: 15000,
  },
})
