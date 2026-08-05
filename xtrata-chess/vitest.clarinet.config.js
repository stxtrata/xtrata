import { defineConfig } from 'vitest/config';
import { getClarinetVitestsArgv, vitestSetupFilePath } from '@stacks/clarinet-sdk/vitest';

export default defineConfig({
  test: {
    environment: 'clarinet',
    pool: 'forks',
    isolate: false,
    maxWorkers: 1,
    include: ['tests/contract.test.js', 'tests/contract-v2.test.js'],
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: { ...getClarinetVitestsArgv() }
    },
    testTimeout: 60_000
  }
});
