import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // These need the clarinet environment and run under vitest.clarinet.config.ts.
    // The two lists must not overlap: a clarinet test picked up here fails on a
    // missing `simnet` global, which looks like a broken test rather than a
    // misrouted one.
    exclude: [
      'tests/clarity/**',
      'tests/economics/**',
      'tests/sponsorship/**',
      'node_modules/**'
    ],
    testTimeout: 120_000
  }
});
