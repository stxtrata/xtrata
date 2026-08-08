// Which contract a board talks to, and how firmly.
//
// A board built against a contract must talk to that contract and no other. The
// fallback chain exists for one narrow case: a board named a contract before it
// was deployed, and should open on the previous one rather than on an error
// page. Once the named contract exists, that same chain is a hazard — a single
// failed request would drop the board to an older version and show a different
// log under the same game number, with nothing on screen to say so.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CONTRACT_CANDIDATES,
  CONTRACT_NAME,
  CONTRACT_NAMES,
  CONTRACT_PREFERENCE,
  DEFAULT_CONTRACT,
  DEFAULT_DEPLOYER
} from '../src/protocol.js';

describe('the contract the board is built against', () => {
  it('is v3', () => {
    expect(CONTRACT_NAME).toBe(CONTRACT_NAMES.v3);
    expect(DEFAULT_CONTRACT).toBe(`${DEFAULT_DEPLOYER}.xtrata-chess-log-v3`);
  });

  it('lists every version, newest first', () => {
    expect(CONTRACT_PREFERENCE).toEqual([
      'xtrata-chess-log-v3',
      'xtrata-chess-log-v2',
      'xtrata-chess-log-v1'
    ]);
    expect(CONTRACT_CANDIDATES[0]).toBe(DEFAULT_CONTRACT);
    for (const candidate of CONTRACT_CANDIDATES) {
      expect(candidate.startsWith(`${DEFAULT_DEPLOYER}.`)).toBe(true);
    }
  });
});

describe('what gets inscribed', () => {
  // Reading the build script rather than trusting the intention: the config
  // block it writes is what an inscribed board runs on, permanently.
  const build = readFileSync(
    resolve(import.meta.dirname, '..', 'scripts', 'build.mjs'),
    'utf8'
  );

  it('pins the board to its contract instead of letting it search', () => {
    // Both places a board config is written: the thin board, and the
    // self-contained page built with --contract.
    const configs = build.match(/__XTRATA_CHESS_BOARD__ = \$\{JSON\.stringify\([^)]*\)/g) || [];
    expect(configs.length).toBeGreaterThan(0);
    for (const config of configs) {
      expect(config).toMatch(/exact: true|boardConfig/);
    }
    expect(build).toMatch(/exact: true/);
  });
});
