import { defineConfig } from 'vitest/config';

// Plain Node tests: engine, replay, simulation. The contract suite runs under
// the Clarinet environment instead, via vitest.clarinet.config.js.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    exclude: ['tests/contract.test.js'],
    testTimeout: 120_000
  }
});
