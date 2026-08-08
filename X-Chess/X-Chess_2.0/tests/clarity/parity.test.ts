// The mock chain against the real contract.
//
// The application is built and tested against MockChain, so the mock is only a
// trustworthy surface while it agrees with the contract. This runs the same
// scenario against both and compares everything observable after every step.
//
// When they disagree, the CONTRACT is right and the mock is wrong. It is the
// thing that will be deployed and the thing nobody can edit afterwards.

import { beforeEach, describe, expect, it } from 'vitest';
import {
  ALICE,
  BOB,
  CAROL,
  CONTRACT,
  Cl,
  ZERO,
  contractBalance,
  pretty,
  readTuple,
  readUint,
  sponsorship as chainSponsorship,
  stxBalance
} from './helpers.js';
import { MockChain } from '../../packages/chain/mock.js';
import { ContractError } from '../../packages/chain/mock.js';

const RULES = 'ab'.repeat(32);

type Op =
  | { kind: 'open'; who: string; ranked: boolean }
  | { kind: 'sponsor'; who: string; opponent: string; ranked: boolean }
  | { kind: 'sponsor-both'; who: string; white: string; black: string; ranked: boolean }
  | { kind: 'submit'; who: string; game: number; value: string }
  | { kind: 'top-up'; who: string; game: number; target: string }
  | { kind: 'settle'; who: string; game: number; target: string }
  | { kind: 'claim'; who: string; game: number; result: string; seq: number }
  | { kind: 'mine'; blocks: number };

/** Everything about a party's state that both implementations can report. */
interface Observation {
  gameCount: number;
  totalReserved: string;
  solvent: boolean;
  games: string[];
  entries: string[];
  sponsorships: string[];
  /** Balances relative to where each account started, so the two can be compared. */
  deltas: string[];
}

const WATCHED = [ALICE, BOB, CAROL, ZERO];

function makeMock(): MockChain {
  const mock = new MockChain({
    contractId: `${simnet.deployer}.${CONTRACT}`,
    openFee: readUint('get-open-fee'),
    bootstrap: readUint('get-bootstrap-amount'),
    rebate: readUint('get-rebate-amount'),
    rebateCount: readUint('get-rebate-count'),
    margin: readUint('get-sponsor-margin'),
    expiryBlocks: Number(readUint('get-expiry-blocks')),
    height: simnet.blockHeight
  });
  for (const who of WATCHED) mock.fund$(who, 100_000_000_000_000n);
  return mock;
}

async function observeMock(mock: MockChain, games: number[], keys: [number, string][], start: Map<string, bigint>): Promise<Observation> {
  const gameRows: string[] = [];
  const entryRows: string[] = [];
  for (const id of games) {
    const row = await mock.getGame(id);
    gameRows.push(
      row ? `${row.id}:${row.openedBy}:${row.nextSeq}:${row.rulesHash}:${row.ranked}` : `${id}:none`
    );
    for (const entry of await mock.getAllEntries(id)) {
      entryRows.push(`${id}:${entry.seq}:${entry.value}:${entry.sender}`);
    }
  }
  const sponsorRows: string[] = [];
  for (const [game, who] of keys) {
    const row = await mock.getSponsorship(game, who);
    sponsorRows.push(
      row ? `${game}|${who}:${row.rebatesLeft}:${row.rebate}:${row.reserved}:${row.settled}` : `${game}|${who}:none`
    );
  }
  return {
    gameCount: await mock.getGameCount(),
    totalReserved: String(await mock.getTotalReserved()),
    solvent: await mock.isSolvent(),
    games: gameRows,
    entries: entryRows,
    sponsorships: sponsorRows,
    deltas: WATCHED.map((who) => `${who}:${mock.balanceOf(who) - (start.get(who) ?? 0n)}`)
  };
}

function observeChain(games: number[], keys: [number, string][], start: Map<string, bigint>): Observation {
  const gameRows: string[] = [];
  const entryRows: string[] = [];
  for (const id of games) {
    // Read through cvToJSON rather than by parsing the pretty-printed text.
    // The pretty printer is for humans and its shape is not a contract; a regex
    // over it reported every field as "?" and made the mock look wrong when it
    // was not.
    const row = readTuple('get-game', [Cl.uint(id)]);
    if (!row) {
      gameRows.push(`${id}:none`);
      continue;
    }
    const nextSeq = Number(row['next-seq']);
    const hash = row['rules-hash'];
    gameRows.push(
      `${id}:${row['opened-by']}:${nextSeq}:${normaliseHash(hash)}:${row.ranked === true}`
    );

    for (let seq = 0; seq < nextSeq; seq++) {
      const entry = readTuple('get-entry', [Cl.uint(id), Cl.uint(seq)]);
      if (entry) entryRows.push(`${id}:${seq}:${entry.value}:${entry.sender}`);
    }
  }

  const sponsorRows: string[] = [];
  for (const [game, who] of keys) {
    const row = chainSponsorship(game, who);
    sponsorRows.push(
      row ? `${game}|${who}:${row.rebatesLeft}:${row.rebate}:${row.reserved}:${row.settled}` : `${game}|${who}:none`
    );
  }

  const reserved = readUint('get-total-reserved');
  return {
    gameCount: Number(readUint('get-game-count')),
    totalReserved: String(reserved),
    solvent: contractBalance() >= reserved,
    games: gameRows,
    entries: entryRows,
    sponsorships: sponsorRows,
    deltas: WATCHED.map((who) => `${who}:${stxBalance(who) - (start.get(who) ?? 0n)}`)
  };
}

/**
 * The mock stores a rules hash as lower-case hex with no prefix. Match it.
 *
 * `cvToJSON` nests: an `(optional (buff 32))` arrives as an optional wrapping a
 * buff, each layer a `{type, value}`. Digging down to the leaf is what turns
 * that into a string instead of "[object Object]".
 */
function normaliseHash(value: unknown): string {
  let node = value;
  while (node && typeof node === 'object' && 'value' in (node as Record<string, unknown>)) {
    node = (node as Record<string, unknown>).value;
  }
  if (node === null || node === undefined || node === false) return 'null';
  return String(node).replace(/^0x/i, '').toLowerCase();
}

describe('the mock chain agrees with the contract', () => {
  beforeEach(() => {
    simnet.setEpoch('3.0');
  });

  it('produces identical observable state across a full scenario', async () => {
    const mock = makeMock();
    const chainStart = new Map(WATCHED.map((who) => [who, stxBalance(who)]));
    const mockStart = new Map(WATCHED.map((who) => [who, mock.balanceOf(who)]));

    const games: number[] = [];
    const keys: [number, string][] = [];

    // Chosen to touch every path that moves money or writes a row, in an order
    // where each one can affect the next.
    const script: Op[] = [
      { kind: 'open', who: ALICE, ranked: false },
      { kind: 'open', who: BOB, ranked: true },
      { kind: 'submit', who: ALICE, game: 1, value: 'e2e4' },
      { kind: 'submit', who: BOB, game: 1, value: 'e7e5' },
      { kind: 'submit', who: CAROL, game: 1, value: 'zzzz' },
      { kind: 'sponsor', who: ALICE, opponent: ZERO, ranked: true },
      { kind: 'submit', who: ZERO, game: 3, value: 'e2e4' },
      { kind: 'submit', who: ZERO, game: 3, value: 'resgn' },
      { kind: 'submit', who: ALICE, game: 3, value: 'draw?' },
      { kind: 'sponsor-both', who: BOB, white: ALICE, black: CAROL, ranked: false },
      { kind: 'submit', who: ALICE, game: 4, value: 'd2d4' },
      { kind: 'submit', who: CAROL, game: 4, value: 'd7d5' },
      { kind: 'top-up', who: BOB, game: 3, target: ZERO },
      { kind: 'submit', who: ZERO, game: 3, value: 'g1f3' },
      { kind: 'claim', who: CAROL, game: 1, result: '1-0', seq: 1 },
      { kind: 'mine', blocks: 5000 },
      { kind: 'settle', who: CAROL, game: 3, target: ZERO },
      { kind: 'submit', who: ZERO, game: 3, value: 'b1c3' },
      { kind: 'settle', who: ALICE, game: 4, target: ALICE }
    ];

    for (const [index, op] of script.entries()) {
      const where = `step ${index} (${op.kind})`;

      switch (op.kind) {
        case 'open': {
          mock.as(op.who);
          await mock.openGame(RULES, op.ranked);
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'open-game',
            [Cl.some(Cl.bufferFromHex(RULES)), Cl.bool(op.ranked)],
            op.who
          );
          expect(pretty(receipt.result), where).toContain('(ok u');
          games.push(await mock.getGameCount());
          break;
        }
        case 'sponsor': {
          mock.as(op.who);
          await mock.openSponsoredGame(RULES, op.ranked, op.opponent);
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'open-sponsored-game',
            [Cl.some(Cl.bufferFromHex(RULES)), Cl.bool(op.ranked), Cl.principal(op.opponent)],
            op.who
          );
          expect(pretty(receipt.result), where).toContain('(ok u');
          const id = await mock.getGameCount();
          games.push(id);
          keys.push([id, op.opponent]);
          break;
        }
        case 'sponsor-both': {
          mock.as(op.who);
          await mock.openSponsoredBoth(RULES, op.ranked, op.white, op.black);
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'open-sponsored-both',
            [
              Cl.some(Cl.bufferFromHex(RULES)),
              Cl.bool(op.ranked),
              Cl.principal(op.white),
              Cl.principal(op.black)
            ],
            op.who
          );
          expect(pretty(receipt.result), where).toContain('(ok u');
          const id = await mock.getGameCount();
          games.push(id);
          keys.push([id, op.white], [id, op.black]);
          break;
        }
        case 'submit': {
          mock.as(op.who);
          await mock.submit(op.game, op.value);
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'submit',
            [Cl.uint(op.game), Cl.stringAscii(op.value)],
            op.who
          );
          expect(pretty(receipt.result), where).toContain('(ok u');
          break;
        }
        case 'top-up': {
          mock.as(op.who);
          await mock.topUpSponsorship(op.game, op.target);
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'top-up-sponsorship',
            [Cl.uint(op.game), Cl.principal(op.target)],
            op.who
          );
          expect(pretty(receipt.result), where).toBe('(ok true)');
          break;
        }
        case 'settle': {
          mock.as(op.who);
          // Both are allowed to refuse, and must refuse for the same reason.
          let mockError: number | null = null;
          try {
            await mock.settleSponsorship(op.game, op.target);
          } catch (error) {
            mockError = (error as ContractError).code;
          }
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'settle-sponsorship',
            [Cl.uint(op.game), Cl.principal(op.target)],
            op.who
          );
          const text = pretty(receipt.result);
          const chainError = /\(err u(\d+)\)/.exec(text)?.[1];
          expect(
            mockError === null ? null : String(mockError),
            `${where}: mock said ${mockError}, chain said ${text}`
          ).toBe(chainError ?? null);
          break;
        }
        case 'claim': {
          mock.as(op.who);
          await mock.claimResult(op.game, op.result, op.seq);
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'claim-result',
            [Cl.uint(op.game), Cl.stringAscii(op.result), Cl.uint(op.seq)],
            op.who
          );
          expect(pretty(receipt.result), where).toBe('(ok true)');
          break;
        }
        case 'mine': {
          mock.mine(op.blocks);
          simnet.mineEmptyBlocks(op.blocks);
          break;
        }
      }

      const fromMock = await observeMock(mock, games, keys, mockStart);
      const fromChain = observeChain(games, keys, chainStart);
      expect(fromMock, `${where}: mock and chain disagree`).toEqual(fromChain);
    }
  });

  it('refuses the same things for the same reasons', async () => {
    const mock = makeMock();
    mock.as(ALICE);
    await mock.openGame(RULES, false);
    const game = await mock.getGameCount();
    simnet.callPublicFn(
      CONTRACT,
      'open-game',
      [Cl.some(Cl.bufferFromHex(RULES)), Cl.bool(false)],
      ALICE
    );
    const chainGame = Number(readUint('get-game-count'));

    const cases: [string, () => Promise<unknown>, () => string][] = [
      [
        'a submission that is too short',
        () => mock.submit(game, 'e2e'),
        () => pretty(simnet.callPublicFn(CONTRACT, 'submit', [Cl.uint(chainGame), Cl.stringAscii('e2e')], ALICE).result)
      ],
      [
        'a submission to a game that does not exist',
        () => mock.submit(99_999, 'e2e4'),
        () => pretty(simnet.callPublicFn(CONTRACT, 'submit', [Cl.uint(99_999), Cl.stringAscii('e2e4')], ALICE).result)
      ],
      [
        'a top-up with no sponsorship',
        () => mock.topUpSponsorship(game, BOB),
        () => pretty(simnet.callPublicFn(CONTRACT, 'top-up-sponsorship', [Cl.uint(chainGame), Cl.principal(BOB)], ALICE).result)
      ],
      [
        'a settlement with no sponsorship',
        () => mock.settleSponsorship(game, BOB),
        () => pretty(simnet.callPublicFn(CONTRACT, 'settle-sponsorship', [Cl.uint(chainGame), Cl.principal(BOB)], ALICE).result)
      ]
    ];

    for (const [name, runMock, runChain] of cases) {
      let code: number | null = null;
      try {
        await runMock();
      } catch (error) {
        code = (error as ContractError).code;
      }
      expect(code, `${name}: the mock accepted it`).not.toBeNull();
      expect(runChain(), name).toBe(`(err u${code})`);
    }
  });
});
