import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
it('retires v1.5 from the active canary without deleting its source', () => {
 const consoleSource=readFileSync('src/deploy-console.ts','utf8');
 expect(consoleSource).not.toContain('collection-v15-deployment');
 expect(consoleSource).toContain('collection-v16-deployment');
 expect(readFileSync('contracts/live/xtrata-collection-mint-v1.5.clar','utf8')).toContain('MAX-SMALL-MINT-CHUNKS u30');
});
