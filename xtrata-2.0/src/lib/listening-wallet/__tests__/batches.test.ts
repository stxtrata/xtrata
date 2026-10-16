import { describe, expect, it } from 'vitest';
import { createStacksPrivateKey, getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
import { signMessageHashRsv } from '@stacks/transactions';
import {
  BATCH_MAX_COPIES, BATCH_MEMO, BATCH_PURPOSE, batchBreakdown, batchData, batchDeposit, batchDepositMemo, batchRequestHash, copyAmountForPlays, isBatchId,
  maxCopyPlays, validateBatch, validBatchAmount, verifyBatchSignature, type BatchRequest
} from '../batches';
import { CAMPAIGN_PURPOSE, GIFT_FEE, GIFT_MAX, GIFT_MIN } from '../gifts';
import { costPerPlay, LIKES_FLOAT, RESERVE } from '../policy';

const KEY = '11'.repeat(32) + '01', OTHER = '22'.repeat(32) + '01';
const addr = (k: string) => getAddressFromPrivateKey(k, TransactionVersion.Mainnet);
const NOW = 1_800_000_000_000;
const request = (over: Partial<BatchRequest> = {}): BatchRequest => ({ creator: addr(KEY), count: 5, amount: '123000', label: 'Opera launch', issued: NOW, ...over });
const sign = (r: BatchRequest, k = KEY) => signMessageHashRsv({ messageHash: batchRequestHash(r), privateKey: createStacksPrivateKey(k) }).data;

describe('prefunded batch rules', () => {
  it('accepts a good request and refuses each bad part with a plain reason', () => {
    expect(validateBatch(request(), NOW)).toEqual(request());
    expect(() => validateBatch(request({ creator: 'nope' }), NOW)).toThrow(/Stacks address/);
    for (const count of [0, -1, 1.5, BATCH_MAX_COPIES + 1]) expect(() => validateBatch(request({ count }), NOW)).toThrow(/copies at a time/);
    for (const amount of ['99999', '1000001', '12.5', '', '-1', '1e5']) expect(() => validateBatch(request({ amount }), NOW)).toThrow(/0\.1 to 1 STX/);
    expect(() => validateBatch(request({ label: 'é' }), NOW)).toThrow(/Label/);
    expect(() => validateBatch(request({ label: 'x'.repeat(41) }), NOW)).toThrow(/Label/);
    expect(() => validateBatch(request({ player: 'xyz' }), NOW)).toThrow(/gift player/);
    expect(() => validateBatch(request({ issued: NOW - 16 * 60_000 }), NOW)).toThrow(/expired/);
    expect(() => validateBatch(request({ issued: NOW + 2 * 60_000 }), NOW)).toThrow(/expired/);
    expect(validateBatch(request({ player: 'a'.repeat(16), count: BATCH_MAX_COPIES }), NOW).count).toBe(100);
  });

  it('a signature works only for exactly what was signed, by exactly that wallet', () => {
    const r = request();
    const sig = sign(r);
    expect(verifyBatchSignature(r, sig, addr(KEY))).toBe(true);
    expect(verifyBatchSignature(r, '0x' + sig, addr(KEY))).toBe(true);
    expect(verifyBatchSignature(r, sig, addr(OTHER))).toBe(false);
    expect(verifyBatchSignature(r, sign(r, OTHER), addr(KEY))).toBe(false);
    for (const changed of [{ count: 6 }, { amount: '123001' }, { label: 'Other' }, { issued: NOW + 1 }, { player: 'a'.repeat(16) }, { creator: addr(OTHER) }] as Partial<BatchRequest>[])
      expect(verifyBatchSignature({ ...r, ...changed }, sig, addr(KEY))).toBe(false);
    for (const junk of [undefined, null, 5, '', 'zz', 'ab'.repeat(64)]) expect(verifyBatchSignature(r, junk, addr(KEY))).toBe(false);
  });

  it('is its own kind of request: a batch signature can never be replayed as another request, and each request has its own hash', () => {
    const a = batchRequestHash(request()), b = batchRequestHash(request({ label: 'Opera launch 2' }));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
    expect(batchRequestHash(request())).toBe(a);
    expect(BATCH_PURPOSE).not.toBe(CAMPAIGN_PURPOSE); // what the wallet shows and signs differs from a treasury-paid campaign
    expect(BATCH_PURPOSE).toMatch(/prefunded/);
    expect(batchData(request()).message.data.purpose.data).toBe(BATCH_PURPOSE);
    expect(batchRequestHash(request({ player: 'a'.repeat(16) }))).not.toBe(a);
  });

  it('batch ids and the deposit memo are short, exact and fit in a memo', () => {
    expect(isBatchId('0123456789abcdef')).toBe(true);
    for (const bad of ['0123456789ABCDEF', '0123456789abcde', '0123456789abcdef0', 5, null, undefined]) expect(isBatchId(bad)).toBe(false);
    const memo = batchDepositMemo('0123456789abcdef');
    expect(memo).toBe('batch 0123456789abcdef');
    expect(new TextEncoder().encode(memo).length).toBeLessThanOrEqual(34);
    expect(BATCH_MEMO.exec(memo)?.[1]).toBe('0123456789abcdef');
    expect(BATCH_MEMO.test('batch 0123456789abcdef ')).toBe(false);
    expect(BATCH_MEMO.test('gift 0123456789abcdef01234567')).toBe(false);
  });

  it('the money adds up: every copy, its sending fee, and nothing the treasury has to cover', () => {
    // 300 paid plays on an album: 300 x 350 + 3,000 reserve + 15,000 likes float = 123,000 lands in the new wallet
    expect(copyAmountForPlays(300, true)).toBe(123_000n);
    expect(copyAmountForPlays(300, false)).toBe(108_000n);
    expect(batchDeposit(100, 123_000n)).toBe(12_600_000n); // 12.6 STX for 100 copies
    expect(batchDeposit(1, 123_000n)).toBe(123_000n + GIFT_FEE);
    const bill = batchBreakdown(100, 123_000n, true);
    expect(bill).toMatchObject({ plays: 300, reserve: RESERVE, float: LIKES_FLOAT, sendFee: GIFT_FEE, perCopy: 126_000n, total: 12_600_000n });
    expect(bill.holders + bill.fees + bill.reserve + bill.float).toBe(123_000n); // the line items are the whole copy
    expect(bill.holders + bill.fees + bill.reserve + bill.float + bill.sendFee).toBe(bill.perCopy);
    expect(batchBreakdown(2, 108_000n, false)).toMatchObject({ plays: 300, float: 0n, total: 222_000n });
  });

  it('works out the most plays a copy can carry, and that figure fits inside the 1 STX limit', () => {
    for (const album of [true, false]) {
      const max = maxCopyPlays(album);
      expect(copyAmountForPlays(max, album)).toBeLessThanOrEqual(GIFT_MAX);
      expect(copyAmountForPlays(max + 1, album)).toBeGreaterThan(GIFT_MAX);
    }
    expect(maxCopyPlays(true)).toBe(Number((GIFT_MAX - RESERVE - LIKES_FLOAT) / costPerPlay(300n)));
    expect(validBatchAmount(GIFT_MIN)).toBe(true);
    expect(validBatchAmount(GIFT_MIN - 1n)).toBe(false);
    expect(validBatchAmount(GIFT_MAX)).toBe(true);
    expect(validBatchAmount(GIFT_MAX + 1n)).toBe(false);
  });
});
