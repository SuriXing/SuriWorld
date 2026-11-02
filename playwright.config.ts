import { defineConfig, devices } from '@playwright/test';

// 3D world e2e. Serves the production build via `vite preview`: the
// timing budgets in tests/3d-world.test.cjs ("page loads in reasonable
// time") were tuned for preview's cold-start behavior, so the suite must
// run against the built app, not the dev server.
export default defineConfig({
  testDir: './tests',
  // Only the Playwright spec runs here. tests/r41-doorway-screens.cjs and
  // tests/raycast-coverage.cjs are standalone node scripts that write
  // screenshot/raycast artifacts, not tests.
  testMatch: '**/*.test.cjs',
  // One worker: every test cold-starts WebGL, and headless shader
  // compilation is the dominant cost (see the 12s budget comment in the
  // spec). Parallel workers would multiply that for no real gain.
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      // channel 'chrome' drives the system Google Chrome instead of the
      // playwright-managed browser build — no download step, and the 3D
      // world's WebGL runs on the real GPU rather than software rendering.
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    // VITE_E2E_BRIDGES=1 makes the production build attach the window
    // test bridges (navigateToRoom / __worldStore) — real user builds
    // never set it, so the bridges stay out of shipped bundles.
    command: 'VITE_E2E_BRIDGES=1 npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
