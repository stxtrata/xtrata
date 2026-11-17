import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { deserializeTransaction, makeUnsignedContractCall, PostConditionMode } from '@stacks/transactions';
import { costPerPlay, DEFAULT_PLAY_FEE, playsCovered, RESERVE } from '../policy';
import { copyAmountForPlays } from '../batches';
import {
  amountForPlaysAt, BATCH_MAX, feeFloor, holderShare, packSettlement, playsCoveredAt, RATE_MAX, RATE_MIN, SETTLE_CONTRACT, settleCallOptions,
  settlementCost, settlementMax, unpackSettlement, validateSettlement, type Settlement
} from '../settle';

const KEY = '03' + '11'.repeat(32), ME = 'SP3FZPXJQEWZB7YNFH472WJYXZ3F4Q4WSF5S5K0Q8';
const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v2-0'; // the name it would have; not deployed
const receipt = 'ab'.repeat(16);
const plays = (n: number) => Array.from({ length: n }, (_, i) => ({ core: 3, song: 4 + (i % 5) }));
const five: Settlement = { plays: plays(5), receipt, rate: 300n };
const hex = (b: Uint8Array) => Buffer.from(b).toString('hex');

describe('a settlement, packed', () => {
  it('is rate, receipt, then five bytes a play: exactly what the contract reads', () => {
    expect(hex(packSettlement(five))).toBe('012c' + receipt + '0300000004' + '0300000005' + '0300000006' + '0300000007' + '0300000008');
    expect(packSettlement({ plays: plays(1), receipt, rate: 50n })).toHaveLength(23);
    expect(packSettlement({ plays: plays(10), receipt, rate: 500n })).toHaveLength(68);
    expect(hex(packSettlement({ plays: [{ core: 1, song: 0xffffffff }], receipt, rate: 1000n }))).toBe('03e8' + receipt + '01ffffffff');
  });
  it('unpacks to what was packed, and refuses what the contract would call malformed', () => {
    for (const s of [five, { plays: plays(10), receipt, rate: 500n }, { plays: [{ core: 2, song: 0 }], receipt: '00'.repeat(16), rate: 50n }]) expect(unpackSettlement(packSettlement(s))).toEqual(s);
    const good = packSettlement(five);
    for (const bad of [good.subarray(0, 18), good.subarray(0, 27), new Uint8Array(0), new Uint8Array(18 + 5 * 11)]) expect(() => unpackSettlement(bad)).toThrow(/Malformed/);
    const core9 = Uint8Array.from(good); core9[18] = 9;
    expect(() => unpackSettlement(core9)).toThrow(/core/);
  });
  it('matches the contract source it is written for', () => {
    const src = readFileSync('contracts/drafts/xtrata-radio-plays-v2.0.clar', 'utf8');
    expect(src).toContain(`(define-constant RATE-MIN u${RATE_MIN})`);
    expect(src).toContain(`(define-constant RATE-MAX u${RATE_MAX})`);
    expect(src).toContain(`(define-constant BATCH-MAX u${BATCH_MAX})`);
    expect(src).toContain('(define-public (settle-packed (data (buff 68)))');
    expect(SETTLE_CONTRACT).toBeNull(); // nothing signs a settlement until a reviewed contract is deployed and named here
  });
  it('refuses anything outside the contract\'s limits, or not what the listener agreed to', () => {
    expect(() => validateSettlement({ ...five, plays: [] })).toThrow(/1 to 10 plays/);
    expect(() => validateSettlement({ ...five, plays: plays(11) })).toThrow(/1 to 10 plays/);
    expect(() => validateSettlement({ ...five, rate: 49n })).toThrow(/50 to 1000/);
    expect(() => validateSettlement({ ...five, rate: 1001n })).toThrow(/50 to 1000/);
    expect(() => validateSettlement({ ...five, receipt: 'AB'.repeat(16) })).toThrow(/receipt/);
    expect(() => validateSettlement({ ...five, plays: [{ core: 3, song: 2 ** 32 }] })).toThrow(/song/);
    expect(() => validateSettlement({ ...five, plays: [{ core: 4, song: 1 }] })).toThrow(/core/);
    expect(() => validateSettlement(five, { rate: 500n, batch: 5 })).toThrow(/rate has changed/);
    expect(() => validateSettlement(five, { rate: 300n, batch: 4 })).toThrow(/At most 4 plays/);
    expect(validateSettlement(five, { rate: 300n, batch: 5 })).toBe(five);
  });
});

describe('the one transaction a settlement may be', () => {
  const build = async (s: Settlement, fee = 300n) => makeUnsignedContractCall(settleCallOptions(CONTRACT, ME, KEY, { ...s, fee, nonce: 7n }) as any);
  it('calls settle-packed with a ceiling on what can leave: never more than every play paid', async () => {
    const tx = await build(five) as any;
    expect(tx.payload.functionName.content).toBe('settle-packed');
    expect(tx.payload.contractName.content).toBe('xtrata-radio-plays-v2-0');
    expect(tx.postConditionMode).toBe(PostConditionMode.Deny);
    expect(tx.postConditions.values).toHaveLength(1);
    expect(tx.postConditions.values[0].amount).toBe(1500n);
    expect(tx.auth.spendingCondition.fee).toBe(300n);
    expect(settlementMax(five)).toBe(1500n);
    expect(deserializeTransaction(tx.serialize()).txid()).toBe(tx.txid());
  });
  it('stays small enough for the 0.0003 STX fee, from one play to ten', async () => {
    const sizes: number[] = [];
    for (const n of [1, 5, 10]) sizes.push((await build({ plays: plays(n), receipt, rate: 500n })).serialize().length);
    expect(sizes[1] - sizes[0]).toBe(20);
    expect(sizes[2] - sizes[1]).toBe(25);
    expect(sizes[2]).toBeLessThanOrEqual(300);
    expect(feeFloor(sizes[2])).toBeLessThanOrEqual(DEFAULT_PLAY_FEE);
  });
  it('needs a contract, a real nonce and a fee', () => {
    expect(() => settleCallOptions('', ME, KEY, { ...five, fee: 300n, nonce: 0n })).toThrow(/No settlement contract/);
    expect(() => settleCallOptions(CONTRACT, ME, KEY, { ...five, fee: 300n, nonce: -1n })).toThrow(/nonce/);
    expect(() => settleCallOptions(CONTRACT, ME, KEY, { ...five, fee: -1n, nonce: 0n })).toThrow(/fee/);
  });
});

describe('what plays cost when they are settled together', () => {
  const V1 = { rate: 50n, batch: 1 };
  it('at the starting settings it is exactly version 1', () => {
    expect(settlementCost(1, V1)).toBe(costPerPlay(DEFAULT_PLAY_FEE));
    for (const b of [0n, RESERVE, 3_349n, 3_350n, 20_500n, 353_000n, 1_000_000n]) expect(playsCoveredAt(b, V1)).toBe(playsCovered(b));
    expect(amountForPlaysAt(50, V1)).toBe(copyAmountForPlays(50, false));
    expect(holderShare(V1)).toBeCloseTo(0.1428, 3);
  });
  it('five plays at 290 or ten at 320 cost a listener what a play costs now, and most of it reaches the artist', () => {
    for (const s of [{ rate: 290n, batch: 5 }, { rate: 320n, batch: 10 }]) {
      expect(settlementCost(s.batch, s)).toBe(BigInt(s.batch) * 350n);
      for (const p of [50, 100, 250, 500, 1000]) expect(playsCoveredAt(copyAmountForPlays(p, false), s)).toBe(p); // every funded player keeps its plays
    }
    expect(holderShare({ rate: 290n, batch: 5 })).toBeCloseTo(0.8286, 3);
    expect(holderShare({ rate: 320n, batch: 10 })).toBeCloseTo(0.9143, 3);
  });
  it('dearer settings shrink what a funded player holds, and the sums say by how much', () => {
    const classic = copyAmountForPlays(50, false);
    expect(playsCoveredAt(classic, { rate: 300n, batch: 5 })).toBe(48);
    expect(playsCoveredAt(classic, { rate: 500n, batch: 10 })).toBe(32);
    expect(playsCoveredAt(copyAmountForPlays(1000, false), { rate: 500n, batch: 10 })).toBe(660);
  });
  it('counts a last, smaller settlement with its own network fee, and never promises a play it cannot pay for', () => {
    const s = { rate: 300n, batch: 5 };
    expect(playsCoveredAt(RESERVE + 1800n, s)).toBe(5);
    expect(playsCoveredAt(RESERVE + 1800n + 300n, s)).toBe(5);         // a fee and nothing to pay a holder with
    expect(playsCoveredAt(RESERVE + 1800n + 599n, s)).toBe(5);
    expect(playsCoveredAt(RESERVE + 1800n + 600n, s)).toBe(6);
    expect(playsCoveredAt(RESERVE + 599n, s)).toBe(0);
    for (const p of [1, 4, 5, 6, 49, 50, 51]) {
      expect(playsCoveredAt(amountForPlaysAt(p, s), s)).toBe(p);
      expect(playsCoveredAt(amountForPlaysAt(p, s) - 1n, s)).toBe(p - 1);
    }
  });
});
