// Pull the real games off the CURRENT contract and freeze them as fixtures.
//
//   LIVE=1 npx vitest run tests/legacy/fetch-canary.test.ts
//
// The sibling of `fetch-live.test.ts`, which does the same for the three legacy
// contracts. That one existed and this one did not, which meant every offline
// test in the project was about games nobody had played: the contract the board
// is actually bound to held nine real games, eighty signed moves and five ranked
// results, and not one assertion anywhere touched them.
//
// That matters more here than it would in most applications. A finished game is
// not stored anywhere - it is RECOMPUTED by replaying the log, every time
// anybody opens it, forever. So a change to replay does not just affect new
// games, it reaches back and can change what an old one means. That has already
// happened once: see ADR-0007, where a real Scholar's Mate read 1-0 by checkmate
// under the protocol it was played under and 0-1 by resignation under the next
// one. Same bytes, opposite winner.
//
// Reads only. Nothing here signs anything or costs anything.

import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LiveChain } from '../../packages/chain/client.js';

const LIVE = process.env.LIVE === '1';
const FIXTURES = fileURLToPath(new URL('../../harness/fixtures/', import.meta.url));
const TARGET = `${FIXTURES}canary-mainnet.json`;
const MANIFEST = fileURLToPath(new URL('../../dist/manifest.json', import.meta.url));

/**
 * Which contract to read.
 *
 * Taken from the manifest the build wrote, not hard-coded here, so the fixture
 * cannot quietly end up describing a contract the board is not bound to. If
 * `dist/` has not been built, say so rather than guessing.
 */
function boundContract(): { address: string; name: string } {
  if (!existsSync(MANIFEST)) {
    throw new Error('dist/manifest.json is missing. Run `npm run build` first.');
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as { contract?: string };
  const [address, name] = String(manifest.contract ?? '').split('.');
  if (!address || !name) throw new Error(`the manifest names no contract: ${manifest.contract}`);
  return { address, name };
}

describe('the contract the board is bound to', () => {
  (LIVE ? it : it.skip)(
    'reads every game and freezes them',
    async () => {
      const { address, name } = boundContract();
      const chain = new LiveChain({ contractAddress: address, contractName: name });

      const count = await chain.getGameCount();
      expect(count, 'the contract reports no games at all').toBeGreaterThan(0);

      const games: unknown[] = [];
      for (let id = 1; id <= count; id++) {
        const game = await chain.getGame(id);
        if (!game) continue;
        const entries = await chain.getAllEntries(id);

        // A SHORT READ MUST NEVER BE FROZEN AS A COMPLETE GAME. The contract
        // says how many entries a game has; if the pages do not add up to that,
        // something was rate limited or dropped, and writing it down anyway
        // would turn a transport failure into a permanent wrong expectation.
        expect(
          entries.length,
          `game ${id} says it has ${game.nextSeq} entries and ${entries.length} were read`
        ).toBe(game.nextSeq);

        const hint = await chain.getResultHint(id);
        games.push({ game, entries, hint });
      }

      // The ranked index, in chain order, because elo-v1 depends on that order
      // and a set would lose it.
      const rankedCount = await chain.getRankedCount();
      const ranked: number[] = [];
      for (let index = 0; index < rankedCount; index++) {
        const game = await chain.getRankedGame(index);
        if (game !== null) ranked.push(game);
      }

      // Every sender came back through c32 from the chain's own bytes, so this
      // exercises the address encoding for real rather than against a fixture.
      for (const { entries } of games as { entries: { sender: string }[] }[]) {
        for (const entry of entries) expect(entry.sender).toMatch(/^S[PM][0-9A-HJKMNP-TV-Z]+$/);
      }

      // ADDITIVE ONLY. The log is append-only on chain, so a capture that has
      // FEWER games or a SHORTER game than the one already frozen is a bad read,
      // not new information - and overwriting on a bad read is how a real result
      // would quietly disappear from the expectations.
      if (existsSync(TARGET)) {
        const before = JSON.parse(readFileSync(TARGET, 'utf8')) as {
          count: number;
          games: { game: { id: number; nextSeq: number } }[];
        };
        expect(count, 'the contract now reports FEWER games than were frozen').toBeGreaterThanOrEqual(
          before.count
        );
        for (const old of before.games) {
          const now = (games as { game: { id: number; nextSeq: number } }[]).find(
            (g) => g.game.id === old.game.id
          );
          expect(now, `game ${old.game.id} was frozen before and is missing now`).toBeDefined();
          expect(
            now!.game.nextSeq,
            `game ${old.game.id} has SHRUNK, from ${old.game.nextSeq} to ${now!.game.nextSeq}`
          ).toBeGreaterThanOrEqual(old.game.nextSeq);
        }
      }

      mkdirSync(FIXTURES, { recursive: true });
      writeFileSync(
        TARGET,
        `${JSON.stringify(
          {
            note: 'Read from Stacks mainnet. These are real games played by real people.',
            contract: `${address}.${name}`,
            count,
            ranked,
            games
          },
          null,
          2
        )}\n`
      );
    },
    180_000
  );
});
