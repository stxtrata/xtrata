// What an inscription may ask the viewer's wallet to pay.
//
// The runtime bridge used to drop the fee outright, which is safe and also
// means an inscription could not ask for a sane one. Wallets left to estimate
// have quoted half a STX for a call that settles for a hundredth of that, and a
// viewer who does not think to edit the figure pays it.
//
// Carrying it means accepting a number from arbitrary permanent code, and the
// fee is the one field in a contract call that moves money without appearing as
// a post condition. So the bound is the feature, not the plumbing.

import { describe, expect, it } from 'vitest';
import { MAX_RUNTIME_FEE_USTX, parseRuntimeFee } from '../runtime-fee';

describe('fees an inscription may ask for', () => {
  it('accepts an ordinary fee, however it is written', () => {
    expect(parseRuntimeFee(10_000)).toBe('10000');
    expect(parseRuntimeFee('10000')).toBe('10000');
    expect(parseRuntimeFee(10_000n)).toBe('10000');
    expect(parseRuntimeFee('  10000  ')).toBe('10000');
  });

  it('accepts the whole legitimate range, up to the cap', () => {
    expect(parseRuntimeFee(1)).toBe('1');
    expect(parseRuntimeFee(3_000)).toBe('3000');
    expect(parseRuntimeFee(Number(MAX_RUNTIME_FEE_USTX))).toBe('1000000');
  });

  it('is one STX, comfortably above what these calls actually cost', () => {
    // Contract calls on this chain have been settling between 0.003 and 0.01
    // STX. The cap is a hundred times the upper end of that.
    expect(MAX_RUNTIME_FEE_USTX).toBe(1_000_000n);
  });
});

describe('fees it may not', () => {
  // The reason the cap exists. A fee moves the viewer's money and never shows
  // up as a post condition, so an unbounded one drains a wallet through a
  // dialog that looks entirely ordinary.
  it('ignores anything above the cap', () => {
    expect(parseRuntimeFee(MAX_RUNTIME_FEE_USTX + 1n)).toBeUndefined();
    expect(parseRuntimeFee('999999999999')).toBeUndefined();
    expect(parseRuntimeFee(500_000_000)).toBeUndefined();
  });

  // Zero is valid only for a sponsored transaction, which this path does not
  // build, and a zero-fee transaction is never mined. It would look like a
  // signature that silently did nothing.
  it('ignores zero and negatives', () => {
    expect(parseRuntimeFee(0)).toBeUndefined();
    expect(parseRuntimeFee('0')).toBeUndefined();
    expect(parseRuntimeFee(-1)).toBeUndefined();
    expect(parseRuntimeFee(-1n)).toBeUndefined();
    expect(parseRuntimeFee('-5000')).toBeUndefined();
  });

  it('ignores anything that is not a whole number of microSTX', () => {
    for (const value of ['1.5', 1.5, '1e6', '0x2710', 'lots', '', '  ', NaN, Infinity]) {
      expect(parseRuntimeFee(value), String(value)).toBeUndefined();
    }
  });

  it('ignores shapes a payload should not contain at all', () => {
    for (const value of [null, undefined, {}, [], true, () => 10_000]) {
      expect(parseRuntimeFee(value)).toBeUndefined();
    }
  });
});

describe('what "ignored" means', () => {
  // Out of range returns undefined rather than throwing, so the call still
  // goes through and the wallet estimates, exactly as it did before this
  // existed. A hostile inscription must not be able to block a call by asking
  // for something absurd.
  it('never throws, whatever it is handed', () => {
    const nasty = [
      Symbol('fee'),
      { toString() { throw new Error('no'); } },
      new Proxy({}, { get() { throw new Error('no'); } })
    ];
    for (const value of nasty) {
      expect(() => parseRuntimeFee(value)).not.toThrow();
      expect(parseRuntimeFee(value)).toBeUndefined();
    }
  });
});
