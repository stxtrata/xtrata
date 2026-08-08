import { defineConfig } from 'vitest/config';
import { getClarinetVitestsArgv, vitestSetupFilePath } from '@stacks/clarinet-sdk/vitest';

export default defineConfig({
  test: {
    environment: 'clarinet',
    pool: 'forks',
    isolate: false,
    maxWorkers: 1,
    include: ['tests/clarity/**/*.test.ts', 'tests/economics/**/*.test.ts', 'tests/sponsorship/**/*.test.ts'],
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: { ...getClarinetVitestsArgv() }
    },
    testTimeout: 300_000
  }
});
