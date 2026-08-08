// Pull the real legacy games off mainnet and freeze them as fixtures.
//
//   LIVE=1 npx vitest run tests/legacy/fetch-live.test.ts
//
// Run deliberately, not on every suite. The offline tests then read the frozen
// bytes, so the ordinary run stays deterministic and needs no network - but what
// it is testing against is what is ACTUALLY on chain, not something invented to
// look like it.
//
// This doubles as the live-endpoint gate: it exercises the real chain layer,
// the real Clarity codec and the real address encoding against mainnet. Reads
// only. Nothing here signs anything or costs anything.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LEGACY_CONTRACTS, LegacyReader } from '../../packages/chain/legacy.js';

const LIVE = process.env.LIVE === '1';
const FIXTURES = fileURLToPath(new URL('../../harness/fixtures/', import.meta.url));

describe('the legacy contracts on mainnet', () => {
  (LIVE ? it : it.skip)(
    'reads every game from all three and freezes them',
    async () => {
      const captured: Record<string, unknown> = {};

      for (const contract of LEGACY_CONTRACTS) {
        const reader = new LegacyReader(contract.name);
        const count = await reader.getGameCount();
        const games: unknown[] = [];

        for (let id = 1; id <= count; id++) {
          const game = await reader.getGame(id);
          if (!game) continue;
          const entries = await reader.getAllEntries(id);
          games.push({ game, entries });
          // Every submission a real person actually made.
          expect(entries.length).toBe(game.nextSeq);
        }

        captured[contract.name] = { label: contract.label, count, games };
        // The address encoding is exercised for real here: every sender came
        // back through c32 from the chain's own bytes.
        for (const { entries } of games as { entries: { sender: string }[] }[]) {
          for (const entry of entries) expect(entry.sender).toMatch(/^S[PM][0-9A-HJKMNP-TV-Z]+$/);
        }
      }

      mkdirSync(FIXTURES, { recursive: true });
      writeFileSync(
        `${FIXTURES}legacy-mainnet.json`,
        `${JSON.stringify(
          {
            note: 'Read from Stacks mainnet. These are real games played by real people.',
            deployer: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
            contracts: captured
          },
          null,
          2
        )}\n`
      );
    },
    180_000
  );

  (LIVE ? it : it.skip)(
    'answers identically from every endpoint it knows',
    async () => {
      // Endpoint independence, against the real thing: no host defines truth,
      // so every one of them must produce the same verified state.
      const { PUBLIC_API } = await import('../../packages/chain/endpoint.js');
      const answers: string[] = [];

      for (const base of PUBLIC_API.mainnet) {
        try {
          const reader = new LegacyReader('xtrata-chess-log-v3', { override: base });
          const count = await reader.getGameCount();
          const entries = await reader.getAllEntries(1);
          answers.push(
            JSON.stringify({ count, entries: entries.map((e) => [e.seq, e.value, e.sender]) })
          );
        } catch (error) {
          // A host that is down is not a failure of the design; the design is
          // that another one answers. Recorded rather than silently skipped.
          console.warn(`${base} did not answer: ${String((error as Error).message)}`);
        }
      }

      expect(answers.length, 'no endpoint answered at all').toBeGreaterThan(0);
      for (const answer of answers) {
        expect(answer, 'two endpoints disagree about the same game').toBe(answers[0]);
      }
      if (answers.length === 1) {
        console.warn('only one endpoint answered, so independence was not actually exercised');
      }
    },
    180_000
  );
});
