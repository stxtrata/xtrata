import { describe, expect, it } from 'vitest';
import { DROP_ELIGIBILITY, DROP_MODES } from '@xtrata/collections-client';
import {
  claimCostStatement,
  ELIGIBILITY_COPY,
  ELIGIBILITY_ORDER,
  eligibilityByCode,
  mayBeCalledFree,
  MODE_COPY,
  MODE_ORDER,
  modeByCode,
  WHO_PAYS_TABLE
} from './copy';

/**
 * The documented language rule (01-ARCHITECTURE §6, 05-SPONSORSHIP):
 *
 *   only mode-3 drops may be described as "free"; zero-price mint copy must
 *   state the claimer pays network fees.
 *
 * These are the tests that keep it true. If someone shortens the mode-2 copy
 * to "free to claim", this file fails before the sentence ships.
 */

const FREE_WORDS = /\bfree\b/i;

describe('the "free" rule', () => {
  it.each(['pre-inscribed', 'zero-price'] as const)(
    'mode %s never uses the word "free" in any claimer-facing string',
    (mode) => {
      const copy = MODE_COPY[mode];
      expect(copy.costClaim).not.toMatch(FREE_WORDS);
      expect(copy.summary).not.toMatch(FREE_WORDS);
      expect(copy.costInscription).not.toMatch(FREE_WORDS);
      expect(copy.costCreator).not.toMatch(FREE_WORDS);
      expect(copy.freeToClaim).toBe(false);
      expect(mayBeCalledFree(mode)).toBe(false);
    }
  );

  it('only the sponsored mode may be called free', () => {
    expect(MODE_COPY.sponsored.costClaim).toMatch(FREE_WORDS);
    expect(mayBeCalledFree('sponsored')).toBe(true);
    expect(MODE_ORDER.filter((mode) => mayBeCalledFree(mode))).toEqual(['sponsored']);
  });

  it('zero-price copy states, in words, that the claimer pays the network fee', () => {
    const statement = claimCostStatement('zero-price');
    expect(statement).toMatch(/network fee/i);
    expect(statement).toMatch(/claimer pays/i);
  });

  it('tells the creator, separately, not to advertise a zero-price drop as free', () => {
    // The only place the word may appear for mode 2 — and only to forbid it.
    expect(MODE_COPY['zero-price'].advertisingRule).toMatch(/not advertise this drop as free/i);
    expect(MODE_COPY['pre-inscribed'].advertisingRule).not.toBeNull();
    expect(MODE_COPY.sponsored.advertisingRule).toMatch(/only mode that may be described as free/i);
  });

  it('pre-inscribed copy also puts the network fee on the claimer', () => {
    expect(claimCostStatement('pre-inscribed')).toMatch(/claimer pays the network fee/i);
  });

  it('sponsored copy promises the claimer pays nothing at all', () => {
    expect(claimCostStatement('sponsored')).toMatch(/pay nothing/i);
    expect(claimCostStatement('sponsored')).toMatch(/not even the network fee/i);
  });
});

describe('mode metadata tracks the contract', () => {
  it('carries the contract mode uints', () => {
    expect(MODE_COPY['pre-inscribed'].code).toBe(1);
    expect(MODE_COPY['zero-price'].code).toBe(2);
    expect(MODE_COPY.sponsored.code).toBe(3);
    for (const mode of MODE_ORDER) expect(MODE_COPY[mode].code).toBe(DROP_MODES[mode]);
  });

  it('describes every mode the client knows about — no gaps', () => {
    expect([...MODE_ORDER].sort()).toEqual(Object.keys(DROP_MODES).sort());
  });

  it('round-trips codes back to modes', () => {
    expect(modeByCode(1)).toBe('pre-inscribed');
    expect(modeByCode(3)).toBe('sponsored');
    expect(modeByCode(9)).toBeNull();
  });

  it('flags exactly the modes that need a funded budget', () => {
    expect(MODE_ORDER.filter((mode) => MODE_COPY[mode].needsBudget)).toEqual(['sponsored']);
  });

  it('lists the escrow gate for every mode, because the contract requires it for every mode', () => {
    for (const mode of MODE_ORDER) {
      expect(MODE_COPY[mode].activationGates.some((gate) => /escrow/i.test(gate))).toBe(true);
    }
    expect(MODE_COPY.sponsored.activationGates.some((gate) => /budget/i.test(gate))).toBe(true);
  });
});

describe('the who-pays-what table', () => {
  it('has a column for every mode in every row', () => {
    for (const row of WHO_PAYS_TABLE) {
      expect(Object.keys(row.byMode).sort()).toEqual([...MODE_ORDER].sort());
    }
  });

  it('puts the claim fee on the claimer for modes 1 and 2 and on the budget for mode 3', () => {
    const row = WHO_PAYS_TABLE.find((entry) => /claim transaction network fee/i.test(entry.cost));
    expect(row?.byMode['pre-inscribed']).toBe('Claimer');
    expect(row?.byMode['zero-price']).toBe('Claimer');
    expect(row?.byMode.sponsored).toMatch(/sponsor budget/i);
  });

  it('charges no mint price in any drop mode', () => {
    const row = WHO_PAYS_TABLE.find((entry) => entry.cost === 'Mint price');
    expect(Object.values(row!.byMode)).toEqual(['None', 'None', 'None']);
  });
});

describe('eligibility copy', () => {
  it('covers every eligibility the client knows about', () => {
    expect([...ELIGIBILITY_ORDER].sort()).toEqual(Object.keys(DROP_ELIGIBILITY).sort());
    for (const value of ELIGIBILITY_ORDER) {
      expect(ELIGIBILITY_COPY[value].code).toBe(DROP_ELIGIBILITY[value]);
    }
    expect(eligibilityByCode(3)).toBe('signed');
    expect(eligibilityByCode(0)).toBeNull();
  });

  it('states the extra setup allowlist and signed drops need', () => {
    expect(ELIGIBILITY_COPY.public.requirement).toBeNull();
    expect(ELIGIBILITY_COPY.allowlist.requirement).toMatch(/set-allowlist-batch/);
    expect(ELIGIBILITY_COPY.signed.requirement).toMatch(/attestor/i);
  });
});
