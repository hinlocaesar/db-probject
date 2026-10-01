import { defineConfig, devices } from '@playwright/test'

/**
 * The suite runs against the dev server rather than the built output, so
 * `npm run dev` is started automatically and no separate build step is
 * needed for the checks to pass.
 *
 * Set BASE_URL to point the same suite at a deployed preview.
 */
const PORT = Number(process.env.PORT ?? 5173)
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    // Animations are checked in screenshots, so keep them running there.
    // The reduced-motion test explicitly overrides this per-context.
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],

  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --port ${PORT} --strictPort`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
})