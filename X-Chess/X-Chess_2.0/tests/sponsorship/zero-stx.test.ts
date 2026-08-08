// The zero-STX player.
//
// This is the scenario section 78 of the brief calls the final acceptance test,
// and it is the one that decides the launch sponsorship constants. Nothing here
// is guessed: the fee sweep at the bottom measures how far a sponsorship
// actually carries a player under a range of network fees, and the numbers it
// produces are what the contract's defaults are set to.
//
// simnet does not deduct a network fee for a contract call, so the fee is
// modelled explicitly: before each submission the player pays `fee` to the
// deployer, exactly as a miner would take it. A player who cannot afford that
// transfer is stranded, which is precisely the condition being measured.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ALICE,
  CONTRACT,
  Cl,
  DEPLOYER,
  ZERO,
  assertSolvent,
  openSponsored,
  readUint,
  sponsorPrice,
  sponsorship,
  stxBalance,
  submit
} from '../clarity/helpers.js';

beforeEach(() => {
  simnet.setEpoch('3.0');
});

/** Take the network fee from the player, the way a miner would. */
const MEASUREMENTS = fileURLToPath(new URL('../../ops/measurements/', import.meta.url));

function record(name: string, data: unknown): void {
  mkdirSync(MEASUREMENTS, { recursive: true });
  writeFileSync(`${MEASUREMENTS}${name}`, `${JSON.stringify(data, null, 2)}\n`);
}

function payNetworkFee(who: string, fee: bigint): boolean {
  if (stxBalance(who) < fee) return false;
  simnet.transferSTX(fee, DEPLOYER, who);
  return true;
}

interface Sweep {
  fee: bigint;
  submissions: number;
  stranded: boolean;
  finalBalance: bigint;
}

/**
 * How many submissions a freshly sponsored zero-STX player can make at a given
 * network fee before they run out of money.
 *
 * `target` is where we stop counting: reaching it means the sponsorship carried
 * the player through a whole game, which is the only thing that matters.
 */
function sweep(fee: bigint, target: number): Sweep {
  // Back to actually nothing before each measurement.
  //
  // simnet state carries across calls, so without this each fee would be
  // measured on a wallet still holding the previous run's change, and every
  // row after the first would flatter the result. The point of the sweep is
  // what one bootstrap buys, so one bootstrap is what it has to start with.
  const leftover = stxBalance(ZERO);
  if (leftover > 0n) simnet.transferSTX(leftover, DEPLOYER, ZERO);
  expect(stxBalance(ZERO)).toBe(0n);

  const game = openSponsored(ALICE, ZERO);
  let submissions = 0;
  let stranded = false;

  for (let i = 0; i < target; i++) {
    if (!payNetworkFee(ZERO, fee)) {
      stranded = true;
      break;
    }
    const receipt = submit(ZERO, game, 'e2e4');
    expect(Cl.prettyPrint(receipt.result)).toContain('(ok u');
    submissions++;
  }

  return { fee, submissions, stranded, finalBalance: stxBalance(ZERO) };
}

describe('a wallet holding exactly nothing', () => {
  it('really does hold exactly nothing', () => {
    // If this wallet were merely nearly empty the whole scenario would prove
    // something weaker and would pass for the wrong reason.
    expect(stxBalance(ZERO)).toBe(0n);
  });

  it('cannot do anything at all before it is sponsored', () => {
    // Not a limitation being worked around. This is the problem.
    const receipt = simnet.callPublicFn(
      CONTRACT,
      'open-game',
      [Cl.none(), Cl.bool(false)],
      ZERO
    );
    expect(Cl.prettyPrint(receipt.result)).toContain('err');
  });

  it('is funded by the creator\'s single transaction, with no server involved', () => {
    const price = sponsorPrice();
    const game = openSponsored(ALICE, ZERO);

    // The bootstrap arrived. Nothing signed this but Alice.
    expect(stxBalance(ZERO)).toBe(price.bootstrap);
    const row = sponsorship(game, ZERO)!;
    expect(row.reserved).toBe(price.liability);
    expect(row.rebatesLeft).toBeGreaterThan(0n);
    assertSolvent('after zero-wallet bootstrap');
  });

  it('can then play, and is topped up by the contract as it goes', () => {
    const game = openSponsored(ALICE, ZERO);
    const rebate = sponsorship(game, ZERO)!.rebate;
    const fee = 10000n;

    let played = 0;
    for (let i = 0; i < 40; i++) {
      if (!payNetworkFee(ZERO, fee)) break;
      expect(Cl.prettyPrint(submit(ZERO, game, 'e2e4').result)).toContain('(ok u');
      played++;
    }

    expect(played, 'a sponsored player should reach a full game length').toBeGreaterThanOrEqual(40);
    expect(rebate).toBeGreaterThan(0n);
    assertSolvent('after a full sponsored game');
  });

  it('is never stranded mid-game by the sponsorship running out', () => {
    // When the allowance ends the game does not. The player simply starts
    // paying their own gas, which they can do because they have been paid
    // rebates all game and the bootstrap is still theirs.
    const game = openSponsored(ALICE, ZERO);
    const count = Number(sponsorship(game, ZERO)!.rebatesLeft);
    const fee = 8000n;

    for (let i = 0; i < count; i++) {
      expect(payNetworkFee(ZERO, fee), `fee at submission ${i}`).toBe(true);
      submit(ZERO, game, 'e2e4');
    }
    expect(sponsorship(game, ZERO)!.rebatesLeft).toBe(0n);

    // One more, unsponsored, out of their own pocket.
    expect(payNetworkFee(ZERO, fee)).toBe(true);
    expect(Cl.prettyPrint(submit(ZERO, game, 'resgn').result)).toContain('(ok u');
    assertSolvent('after playing past exhaustion');
  });
});

describe('the fee sweep that fixes the launch constants', () => {
  // A full game for one player: roughly forty moves plus a settlement
  // submission. If a sponsorship cannot carry this, it cannot carry a game.
  const FULL_GAME = 41;

  // Spanning well past the design point on purpose. The rows above the rebate
  // are not failures, they are the documented behaviour under a fee spike, and
  // the UI quotes them.
  const FEES = [2000n, 4000n, 6000n, 8000n, 10000n, 12000n, 15000n, 20000n, 30000n];

  it('carries a player through a full game at every fee up to the design point', () => {
    const results: Sweep[] = [];
    for (const fee of FEES) {
      results.push(sweep(fee, FULL_GAME));
    }

    // Written to disk rather than logged. A number that decides a launch
    // constant should be an artefact somebody can read later, not a line that
    // scrolled past once.
    record('sponsorship-sweep.json', {
      note: 'How far one sponsorship carries a zero-STX player, by network fee.',
      fullGameSubmissions: FULL_GAME,
      bootstrap: String(readUint('get-bootstrap-amount')),
      rebate: String(readUint('get-rebate-amount')),
      rebateCount: String(readUint('get-rebate-count')),
      rows: results.map((r) => ({
        feeMicroStx: String(r.fee),
        feeStx: (Number(r.fee) / 1_000_000).toFixed(6),
        submissions: r.submissions,
        completedFullGame: !r.stranded,
        leftMicroStx: String(r.finalBalance)
      }))
    });

    // The design point. The rebate is set to the fee this is chosen against, so
    // at or below it a sponsored player is never out of pocket and the
    // sponsorship carries a whole game with the bootstrap untouched.
    const design = results.find((r) => r.fee === readUint('get-rebate-amount'));
    if (design) {
      expect(design.stranded, 'a player must not strand at the design fee').toBe(false);
      expect(design.submissions).toBe(FULL_GAME);
    }

    // Every fee at or below the design point must complete a game outright.
    for (const r of results.filter((x) => x.fee <= readUint('get-rebate-amount'))) {
      expect(r.stranded, `stranded at fee ${r.fee}, which is at or below the rebate`).toBe(false);
    }

    assertSolvent('after the sweep');
  });

  it('states plainly how far the bootstrap alone carries a player above the rebate', () => {
    // Above the rebate the player is out of pocket by the difference each time,
    // and the bootstrap is what absorbs it. This is the number that decides
    // whether a fee spike strands somebody, so it is measured rather than
    // reasoned about.
    const rebate = readUint('get-rebate-amount');
    const bootstrap = readUint('get-bootstrap-amount');

    // The reach is not bootstrap/shortfall. A player has to be holding a WHOLE
    // fee to attempt a submission at all, and only gets the rebate back
    // afterwards, so the last fee's worth is never spendable on a shortfall:
    //
    //     reach = floor((bootstrap - fee) / (fee - rebate)) + 1
    //
    // Asserted exactly rather than as a lower bound, because this formula is
    // what the launch constants are chosen with and an off-by-one in it would
    // quietly under-fund every sponsorship.
    const reaches: Record<string, string | number>[] = [];
    for (const fee of FEES.filter((f) => f > rebate)) {
      const shortfall = fee - rebate;
      const predicted = bootstrap >= fee ? (bootstrap - fee) / shortfall + 1n : 0n;
      const result = sweep(fee, FULL_GAME);
      const expected = predicted > BigInt(FULL_GAME) ? BigInt(FULL_GAME) : predicted;
      expect(
        BigInt(result.submissions),
        `at fee ${fee} the arithmetic predicts ${expected} submissions`
      ).toBe(expected);
      reaches.push({
        feeStx: (Number(fee) / 1_000_000).toFixed(6),
        shortfallMicroStx: String(shortfall),
        reaches: result.submissions,
        ofFullGame: FULL_GAME
      });
    }
    record('sponsorship-reach-above-rebate.json', {
      note: 'Submissions the bootstrap alone absorbs when the network fee exceeds the rebate.',
      bootstrap: String(bootstrap),
      rebate: String(rebate),
      formula: 'floor((bootstrap - fee) / (fee - rebate)) + 1',
      rows: reaches
    });
  });
});

describe('what the protocol cannot do, stated rather than hidden', () => {
  it('cannot bootstrap a player nobody has named', () => {
    // An open game cannot fund an unknown future player: that player would have
    // to send a transaction to say who they are, and has no STX to pay for it.
    // There is no serverless way around this, and pretending otherwise would be
    // worse than the limitation. See SPONSORSHIP-V1.md.
    const game = openSponsored(ALICE, ZERO);
    // Only the named beneficiary has a sponsorship. Nobody else can acquire one
    // by turning up.
    expect(sponsorship(game, ZERO)).not.toBeNull();
    expect(sponsorship(game, DEPLOYER)).toBeNull();
  });
});
