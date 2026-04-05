import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['frontend/assets/js/live-stats.js'],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/test-results-frontend.xml',
    },
  },
})
