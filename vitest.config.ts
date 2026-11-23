// https://vitest.dev/config/#configuring-vitest
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ... Specify options here.
    setupFiles: ['test/setup.ts'],
    environment: 'node',
  },
});
