// The core contract, under Clarinet.
//
// The first thing this suite establishes is that `as-contract?` really moves
// STX at runtime and that its allowance really bounds the move. Everything
// about sponsorship rests on both, and neither is provable by reading the type
// checker's output.

import { beforeEach, describe, expect, it } from 'vitest';
import {
  ALICE,
  BOB,
  CAROL,
  CONTRACT,
  Cl,
  DEPLOYER,
  NO_RULES,
  PAUPER,
  assertSolvent,
  contractBalance,
  openGame,
  openSponsored,
  pretty,
  readUint,
  self,
  settle,
  sponsorPrice,
  sponsorship,
  stxBalance,
  submit,
  topUp,
  totalReserved,
  withdrawable
} from './helpers.js';
import type { ClarityValue } from '@stacks/transactions';

const ok = (receipt: { result: ClarityValue }): string => pretty(receipt.result);

beforeEach(() => {
  simnet.setEpoch('3.0');
});

describe('identity', () => {
  it('knows its own principal', () => {
    expect(self()).toBe(`${simnet.deployer}.${CONTRACT}`);
  });

  it('reports its protocol and format', () => {
    expect(ok(simnet.callReadOnlyFn(CONTRACT, 'get-protocol', [], DEPLOYER))).toBe('"xchess-core-v1"');
    expect(readUint('get-format-version')).toBe(1n);
    expect(readUint('get-max-seq')).toBe(65536n);
  });

  it('starts solvent and owing nothing', () => {
    expect(totalReserved()).toBe(0n);
    assertSolvent('genesis');
  });
});

describe('opening a game', () => {
  it('takes the open fee into the contract, not to a recipient', () => {
    const fee = readUint('get-open-fee');
    const before = contractBalance();
    const balanceBefore = stxBalance(ALICE);

    const game = openGame(ALICE);
    expect(game).toBe(1);

    // The fee is held by the contract. That is what lets solvency be stated
    // about a single balance.
    expect(contractBalance()).toBe(before + fee);
    expect(stxBalance(ALICE)).toBe(balanceBefore - fee);
    assertSolvent('after open');
  });

  it('numbers games from one, and never reuses an id', () => {
    expect(openGame(ALICE)).toBe(1);
    expect(openGame(BOB)).toBe(2);
    expect(openGame(ALICE)).toBe(3);
    expect(readUint('get-game-count')).toBe(3n);
  });

  it('stores the rules hash it was given, and nothing about chess', () => {
    openGame(ALICE);
    const game = simnet.callReadOnlyFn(CONTRACT, 'get-game', [Cl.uint(1)], DEPLOYER).result;
    const pretty = Cl.prettyPrint(game);
    expect(pretty).toContain('rules-hash');
    expect(pretty).toContain('opened-by');
    expect(pretty).toContain('next-seq');
    // If any of these ever appear, the contract has learned chess.
    for (const forbidden of ['turn', 'position', 'fen', 'winner', 'result:', 'check']) {
      expect(pretty.toLowerCase(), `game row leaks ${forbidden}`).not.toContain(forbidden);
    }
  });

  it('accepts a game with no rules commitment', () => {
    const receipt = simnet.callPublicFn(
      CONTRACT,
      'open-game',
      [NO_RULES, Cl.bool(false)],
      ALICE
    );
    expect(ok(receipt)).toBe('(ok u1)');
  });

  it('refuses to open when the sender cannot pay, leaving no trace', () => {
    // A sender who cannot pay must consume no game id.
    const gamesBefore = readUint('get-game-count');
    const broke = PAUPER;
    const balance = stxBalance(broke);
    simnet.transferSTX(balance - 1000n, DEPLOYER, broke);
    const receipt = simnet.callPublicFn(CONTRACT, 'open-game', [NO_RULES, Cl.bool(false)], broke);
    expect(ok(receipt)).toContain('err');
    expect(readUint('get-game-count')).toBe(gamesBefore);
  });

  it('indexes ranked games for discovery, and only ranked ones', () => {
    openGame(ALICE, false);
    openGame(ALICE, true);
    openGame(ALICE, false);
    openGame(ALICE, true);
    expect(readUint('get-ranked-count')).toBe(2n);
    expect(ok(simnet.callReadOnlyFn(CONTRACT, 'get-ranked-game', [Cl.uint(0)], DEPLOYER))).toBe('(some u2)');
    expect(ok(simnet.callReadOnlyFn(CONTRACT, 'get-ranked-game', [Cl.uint(1)], DEPLOYER))).toBe('(some u4)');
  });
});

describe('the only filter', () => {
  it('accepts four and five characters', () => {
    const game = openGame(ALICE);
    expect(ok(submit(ALICE, game, 'e2e4'))).toBe('(ok u0)');
    expect(ok(submit(ALICE, game, 'e7e8q'))).toBe('(ok u1)');
  });

  it('refuses anything shorter than four', () => {
    const game = openGame(ALICE);
    for (const short of ['e2e', 'ab', 'x', '']) {
      expect(ok(submit(ALICE, game, short)), JSON.stringify(short)).toBe('(err u101)');
    }
  });

  it('cannot be given anything longer than five at all', () => {
    // Stronger than the length check, and worth stating separately: the
    // parameter is `(string-ascii 5)`, so a six-character submission is not
    // rejected by the contract, it is unrepresentable. The explicit check
    // exists for the short end, which the type cannot express.
    const game = openGame(ALICE);
    expect(() => submit(ALICE, game, 'e2e4e5')).toThrow();
  });

  it('forms no opinion about what the characters mean', () => {
    // Line noise, a resignation and a legal move are all the same to it.
    const game = openGame(ALICE);
    for (const value of ['e2e4', 'resgn', 'draw?', 'draw!', '####', '!!!!!', 'zzzz']) {
      expect(ok(submit(ALICE, game, value)), value).toContain('(ok u');
    }
    expect(readUint('get-game-count')).toBe(1n);
  });

  it('lets anybody submit to anybody\'s game', () => {
    // Who may play is a question about the rules, which live in the board.
    const game = openGame(ALICE);
    expect(ok(submit(BOB, game, 'e2e4'))).toBe('(ok u0)');
    expect(ok(submit(CAROL, game, 'e7e5'))).toBe('(ok u1)');
  });

  it('refuses a submission to a game that does not exist', () => {
    expect(ok(submit(ALICE, 99, 'e2e4'))).toBe('(err u100)');
  });

  it('records the sender and height it actually saw', () => {
    const game = openGame(ALICE);
    submit(BOB, game, 'e2e4');
    const entry = Cl.prettyPrint(
      simnet.callReadOnlyFn(CONTRACT, 'get-entry', [Cl.uint(game), Cl.uint(0)], DEPLOYER).result
    );
    expect(entry).toContain(BOB);
    expect(entry).toContain('"e2e4"');
  });

  it('orders entries by seq, counting submissions and not moves', () => {
    const game = openGame(ALICE);
    for (const value of ['aaaa', 'bbbb', 'cccc']) submit(ALICE, game, value);
    const page = Cl.prettyPrint(
      simnet.callReadOnlyFn(CONTRACT, 'get-page', [Cl.uint(game), Cl.uint(0)], DEPLOYER).result
    );
    expect(page.indexOf('aaaa')).toBeLessThan(page.indexOf('bbbb'));
    expect(page.indexOf('bbbb')).toBeLessThan(page.indexOf('cccc'));
  });
});

describe('as-contract? at runtime', () => {
  it('actually moves STX out of the contract, bounded by its allowance', () => {
    // The whole sponsorship model rests on this. It is verified here rather
    // than assumed from the type checker, which only proves the shape compiles.
    const price = sponsorPrice();
    const before = stxBalance(BOB);

    openSponsored(ALICE, BOB);

    expect(stxBalance(BOB)).toBe(before + price.bootstrap);
    assertSolvent('after bootstrap');
  });

  it('leaves the reserve behind while the bootstrap goes out', () => {
    const price = sponsorPrice();
    const contractBefore = contractBalance();
    const fee = readUint('get-open-fee');

    openSponsored(ALICE, BOB);

    // In: the open fee and the whole sponsor price. Out: the bootstrap.
    expect(contractBalance()).toBe(contractBefore + fee + price.total - price.bootstrap);
    expect(totalReserved()).toBe(price.liability);
    assertSolvent('after sponsored open');
  });
});

describe('rebates', () => {
  it('pays the beneficiary a fixed amount per submission', () => {
    const price = sponsorPrice();
    const game = openSponsored(ALICE, BOB);
    const row = sponsorship(game, BOB)!;
    const rebate = row.rebate;

    const before = stxBalance(BOB);
    submit(BOB, game, 'e2e4');
    expect(stxBalance(BOB)).toBe(before + rebate);

    const after = sponsorship(game, BOB)!;
    expect(after.reserved).toBe(price.liability - rebate);
    expect(after.rebatesLeft).toBe((row.rebatesLeft) - 1n);
    assertSolvent('after rebate');
  });

  it('pays nobody but the named beneficiary', () => {
    const game = openSponsored(ALICE, BOB);
    const before = stxBalance(CAROL);
    submit(CAROL, game, 'e2e4');
    // Carol paid her own network fee (simnet does not model that) and got
    // nothing back, which is correct: she is not sponsored.
    expect(stxBalance(CAROL)).toBe(before);
    assertSolvent('after unsponsored submit');
  });

  it('stops paying when the count runs out, and the game carries on', () => {
    const game = openSponsored(ALICE, BOB);
    const row = sponsorship(game, BOB)!;
    const count = Number(row.rebatesLeft);
    const rebate = row.rebate;

    for (let i = 0; i < count; i++) {
      expect(ok(submit(BOB, game, 'e2e4')), `submission ${i}`).toContain('(ok u');
    }

    const exhausted = sponsorship(game, BOB)!;
    expect(exhausted.rebatesLeft).toBe(0n);
    expect(exhausted.reserved).toBe(0n);
    expect(totalReserved()).toBe(0n);

    // One more submission. The game does not end, the entry is stored, and the
    // player simply gets nothing back.
    const before = stxBalance(BOB);
    expect(ok(submit(BOB, game, 'e7e5'))).toBe(`(ok u${count})`);
    expect(stxBalance(BOB)).toBe(before);
    assertSolvent('after exhaustion');
    expect(rebate).toBeGreaterThan(0n);
  });

  it('keeps one game\'s reserve out of another game\'s reach', () => {
    const first = openSponsored(ALICE, BOB);
    const second = openSponsored(CAROL, BOB);
    const price = sponsorPrice();

    expect(totalReserved()).toBe(price.liability * 2n);

    // Drain the first game's allowance entirely.
    const count = Number(sponsorship(first, BOB)!.rebatesLeft);
    for (let i = 0; i < count; i++) submit(BOB, first, 'e2e4');

    expect(sponsorship(first, BOB)!.reserved).toBe(0n);
    // The second game is untouched.
    expect(sponsorship(second, BOB)!.reserved).toBe(price.liability);
    expect(totalReserved()).toBe(price.liability);
    assertSolvent('after draining one of two');
  });

  it('honours the rebate recorded at funding time, not the current setting', () => {
    const game = openSponsored(ALICE, BOB);
    const funded = sponsorship(game, BOB)!.rebate;

    // The owner halves the rebate for future sponsorships.
    simnet.callPublicFn(
      CONTRACT,
      'set-sponsorship',
      [Cl.uint(20000), Cl.uint(funded / 2n), Cl.uint(45), Cl.uint(50000)],
      DEPLOYER
    );

    const before = stxBalance(BOB);
    submit(BOB, game, 'e2e4');
    // A promise already paid for is not repriced.
    expect(stxBalance(BOB)).toBe(before + funded);
    assertSolvent('after reprice');
  });
});

describe('top-ups', () => {
  it('lets a third party add more, with no account and no billing', () => {
    const game = openSponsored(ALICE, BOB);
    const price = sponsorPrice();
    const before = sponsorship(game, BOB)!;

    // Carol, who is neither the creator nor a player, pays.
    const receipt = topUp(CAROL, game, BOB);
    expect(ok(receipt)).toBe('(ok true)');

    const after = sponsorship(game, BOB)!;
    expect(after.reserved).toBe(before.reserved + price.liability);
    expect(after.rebatesLeft).toBe(before.rebatesLeft + readUint('get-rebate-count'));
    assertSolvent('after top-up');
  });

  it('does not charge for a bootstrap the wallet already had', () => {
    const game = openSponsored(ALICE, BOB);
    const price = sponsorPrice();
    const before = stxBalance(CAROL);
    topUp(CAROL, game, BOB);
    expect(stxBalance(CAROL)).toBe(before - (price.liability + price.margin));
  });

  it('refuses a top-up for a sponsorship that does not exist', () => {
    const game = openGame(ALICE);
    const receipt = topUp(CAROL, game, BOB);
    expect(ok(receipt)).toBe('(err u106)');
  });
});

describe('settlement', () => {
  it('refuses to settle before expiry', () => {
    const game = openSponsored(ALICE, BOB);
    const receipt = settle(ALICE, game, BOB);
    expect(ok(receipt)).toBe('(err u108)');
  });

  it('lets anybody at all settle once expired, with no keeper and no cron', () => {
    const game = openSponsored(ALICE, BOB);
    const price = sponsorPrice();
    simnet.mineEmptyBlocks(Number(readUint('get-expiry-blocks')) + 1);

    // Carol has nothing to do with this game.
    const receipt = settle(CAROL, game, BOB);
    expect(ok(receipt)).toBe(`(ok u${price.liability})`);
    expect(totalReserved()).toBe(0n);
    assertSolvent('after settle');
  });

  it('turns the unused reserve into treasury without moving any money', () => {
    const game = openSponsored(ALICE, BOB);
    simnet.mineEmptyBlocks(Number(readUint('get-expiry-blocks')) + 1);
    const balanceBefore = contractBalance();
    const withdrawableBefore = withdrawable();
    const price = sponsorPrice();

    settle(CAROL, game, BOB);

    // The STX never left. Releasing the reservation is what turns a liability
    // into treasury.
    expect(contractBalance()).toBe(balanceBefore);
    expect(withdrawable()).toBe(withdrawableBefore + price.liability);
  });

  it('cannot be settled twice', () => {
    const game = openSponsored(ALICE, BOB);
    simnet.mineEmptyBlocks(Number(readUint('get-expiry-blocks')) + 1);
    settle(CAROL, game, BOB);
    const again = settle(CAROL, game, BOB);
    expect(ok(again)).toBe('(err u109)');
    assertSolvent('after double settle attempt');
  });

  it('pays no rebate after settlement', () => {
    const game = openSponsored(ALICE, BOB);
    simnet.mineEmptyBlocks(Number(readUint('get-expiry-blocks')) + 1);
    settle(CAROL, game, BOB);

    const before = stxBalance(BOB);
    expect(ok(submit(BOB, game, 'e2e4'))).toContain('(ok u');
    expect(stxBalance(BOB)).toBe(before);
    assertSolvent('after post-settlement submit');
  });
});

describe('the treasury', () => {
  it('never lets the owner withdraw below what is owed', () => {
    const game = openSponsored(ALICE, BOB);
    const free = withdrawable();
    const owed = totalReserved();
    expect(owed).toBeGreaterThan(0n);

    const overdraw = simnet.callPublicFn(
      CONTRACT,
      'withdraw',
      [Cl.uint(free + 1n), Cl.principal(DEPLOYER)],
      DEPLOYER
    );
    expect(ok(overdraw)).toBe('(err u110)');

    // And taking every free microSTX is allowed, leaving exactly the reserve.
    const exact = simnet.callPublicFn(
      CONTRACT,
      'withdraw',
      [Cl.uint(free), Cl.principal(DEPLOYER)],
      DEPLOYER
    );
    expect(ok(exact)).toBe(`(ok u${free})`);
    expect(contractBalance()).toBe(owed);
    assertSolvent('after withdrawing everything free');
    expect(game).toBeGreaterThan(0);
  });

  it('still pays the rebate after the treasury has been emptied', () => {
    // The point of the invariant: emptying the treasury must not strand a game.
    const game = openSponsored(ALICE, BOB);
    simnet.callPublicFn(
      CONTRACT,
      'withdraw',
      [Cl.uint(withdrawable()), Cl.principal(DEPLOYER)],
      DEPLOYER
    );

    const rebate = sponsorship(game, BOB)!.rebate;
    const before = stxBalance(BOB);
    expect(ok(submit(BOB, game, 'e2e4'))).toContain('(ok u');
    expect(stxBalance(BOB)).toBe(before + rebate);
    assertSolvent('after rebate from an emptied treasury');
  });

  it('refuses a withdrawal from anybody but the owner', () => {
    openGame(ALICE);
    const receipt = simnet.callPublicFn(
      CONTRACT,
      'withdraw',
      [Cl.uint(1), Cl.principal(ALICE)],
      ALICE
    );
    expect(ok(receipt)).toBe('(err u103)');
  });
});

describe('ownership', () => {
  it('refuses configuration from anybody but the owner', () => {
    for (const [fn, args] of [
      ['set-open-fee', [Cl.uint(0)]],
      ['set-expiry-blocks', [Cl.uint(1)]],
      ['set-sponsorship', [Cl.uint(1), Cl.uint(1), Cl.uint(1), Cl.uint(1)]],
      ['transfer-ownership', [Cl.some(Cl.principal(ALICE))]]
    ] as const) {
      const receipt = simnet.callPublicFn(CONTRACT, fn, [...args] as ClarityValue[], ALICE);
      expect(ok(receipt), fn).toBe('(err u103)');
    }
  });

  it('holds every fee below a ceiling no owner can reach', () => {
    const above = simnet.callPublicFn(
      CONTRACT,
      'set-open-fee',
      [Cl.uint(readUint('get-open-fee-ceiling') + 1n)],
      DEPLOYER
    );
    expect(ok(above)).toBe('(err u104)');

    const at = simnet.callPublicFn(
      CONTRACT,
      'set-open-fee',
      [Cl.uint(readUint('get-open-fee-ceiling'))],
      DEPLOYER
    );
    expect(ok(at)).toContain('(ok u');
  });

  it('allows a zero fee, which turns the charge off', () => {
    simnet.callPublicFn(CONTRACT, 'set-open-fee', [Cl.uint(0)], DEPLOYER);
    const before = stxBalance(ALICE);
    openGame(ALICE);
    expect(stxBalance(ALICE)).toBe(before);
  });

  it('renounces permanently, freezing everything', () => {
    simnet.callPublicFn(CONTRACT, 'transfer-ownership', [Cl.none()], DEPLOYER);
    expect(Cl.prettyPrint(simnet.callReadOnlyFn(CONTRACT, 'get-owner', [], DEPLOYER).result)).toBe('none');
    // Not even the former owner can take it back.
    const back = simnet.callPublicFn(
      CONTRACT,
      'transfer-ownership',
      [Cl.some(Cl.principal(DEPLOYER))],
      DEPLOYER
    );
    expect(ok(back)).toBe('(err u103)');
    expect(ok(simnet.callPublicFn(CONTRACT, 'set-open-fee', [Cl.uint(0)], DEPLOYER))).toBe('(err u103)');
  });

  it('keeps settlement working after ownership is renounced', () => {
    // Anyone may settle, so a renounced contract does not strand reserves.
    const game = openSponsored(ALICE, BOB);
    simnet.callPublicFn(CONTRACT, 'transfer-ownership', [Cl.none()], DEPLOYER);
    simnet.mineEmptyBlocks(Number(readUint('get-expiry-blocks')) + 1);
    const receipt = settle(CAROL, game, BOB);
    expect(ok(receipt)).toContain('(ok u');
  });
});

describe('result hints', () => {
  it('records a claim without validating it', () => {
    const game = openGame(ALICE);
    // Deliberately a lie. The contract has no way to know and must not try.
    const receipt = simnet.callPublicFn(
      CONTRACT,
      'claim-result',
      [Cl.uint(game), Cl.stringAscii('1-0'), Cl.uint(3)],
      CAROL
    );
    expect(ok(receipt)).toBe('(ok true)');
    expect(
      Cl.prettyPrint(
        simnet.callReadOnlyFn(CONTRACT, 'get-result-hint', [Cl.uint(game)], DEPLOYER).result
      )
    ).toContain('1-0');
  });

  it('cannot be overwritten, so a hint cannot be used to hide a game', () => {
    const game = openGame(ALICE);
    simnet.callPublicFn(
      CONTRACT,
      'claim-result',
      [Cl.uint(game), Cl.stringAscii('1-0'), Cl.uint(3)],
      CAROL
    );
    const second = simnet.callPublicFn(
      CONTRACT,
      'claim-result',
      [Cl.uint(game), Cl.stringAscii('0-1'), Cl.uint(9)],
      BOB
    );
    expect(ok(second)).toBe('(err u114)');
  });
});

describe('what is absent', () => {
  const source = simnet.getContractSource(CONTRACT) ?? '';

  it('has no way to delete or rewrite history', () => {
    // An owner who could rewrite the log would break every guarantee above it.
    expect(source).not.toContain('map-delete');
    // The Entries map is written in exactly one place.
    const writes = source.match(/\(map-set Entries/g) ?? [];
    expect(writes).toHaveLength(1);
  });

  it('has exactly the public functions it is supposed to have', () => {
    const declared = [...source.matchAll(/\(define-public \(([a-z0-9-]+)/g)].map((m) => m[1]).sort();
    expect(declared).toEqual(
      [
        'claim-result',
        'open-game',
        'open-sponsored-both',
        'open-sponsored-game',
        'set-expiry-blocks',
        'set-open-fee',
        'set-sponsorship',
        'settle-sponsorship',
        'submit',
        'top-up-sponsorship',
        'transfer-ownership',
        'withdraw'
      ].sort()
    );
  });

  it('moves STX out in exactly one place', () => {
    // The solvency invariant only has to be defended at one site because there
    // is only one site.
    const outflows = source.match(/as-contract\?\s*\(\(with-stx/g) ?? [];
    expect(outflows).toHaveLength(1);
  });

  it('knows nothing about chess', () => {
    const lower = source.toLowerCase();
    for (const word of ['checkmate', 'stalemate', 'castl', 'promot', 'legal', 'square', 'piece', 'elo']) {
      // Comments are allowed to mention chess; code is not. Strip the comments.
      const code = lower
        .split('\n')
        .map((line) => line.split(';;')[0])
        .join('\n');
      expect(code, `contract code mentions ${word}`).not.toContain(word);
    }
  });
});
