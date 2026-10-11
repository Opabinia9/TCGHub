import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      exclude: ['./tests'],
    },
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
  },
});
