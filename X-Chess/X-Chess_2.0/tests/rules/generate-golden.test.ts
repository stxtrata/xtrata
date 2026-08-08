// Regenerates the golden rules-v1 vectors. Runs only when asked:
//
//   GEN_GOLDEN=1 npx vitest run tests/rules/generate-golden.test.ts
//
// A vector, once published, is permanent. Regenerating is for ADDING one. If a
// regeneration changes an existing vector's bytes, that is a protocol break and
// the committed file is the one that is right.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'vitest';
import { canonicalRules, rulesHash } from '../../packages/protocol/canonical.js';
import { VECTORS } from './vectors.js';

const GEN = process.env.GEN_GOLDEN === '1';

describe('golden vector generation', () => {
  (GEN ? it : it.skip)('writes golden-rules-v1.json', () => {
    const out = VECTORS.map((vector) => ({
      name: vector.name,
      rules: vector.rules,
      canonical: canonicalRules(vector.rules),
      sha256: rulesHash(vector.rules)
    }));

    const path = fileURLToPath(new URL('./golden-rules-v1.json', import.meta.url));
    writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);
  });
});
