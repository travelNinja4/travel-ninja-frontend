import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Two projects share this config:
// - unit: component tests (src/**/*.test.tsx) in jsdom. Run with `pnpm test`.
// - storybook: renders every story in headless Chromium. Run with `pnpm test:storybook`.
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['json', 'text', 'lcov', 'clover'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
    },
    projects: [
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.join(dirname, 'src'),
            // next/image needs the Next.js runtime; render a plain <img> instead
            'next/image': path.join(dirname, '__mocks__/next/image.tsx'),
          },
        },
        test: {
          name: 'unit',
          // Keep CSS module class names readable (e.g. "button") so snapshots stay stable
          css: {
            include: /\.module\.(css|scss|sass)$/,
            modules: { classNameStrategy: 'non-scoped' },
          },
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
          clearMocks: true,
          // Fixed values so snapshots don't depend on each developer's .env
          env: {
            NEXT_PUBLIC_CLOUDINARY_URL: 'https://res.cloudinary.com/dyci0wg0i/image/upload/',
            NEXT_PUBLIC_PLACEHOLDER_BG_URL: 'https://picsum.photos/1920/1080?random=1',
          },
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
