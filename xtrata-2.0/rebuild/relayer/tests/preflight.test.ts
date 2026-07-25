import { describe, expect, it } from 'vitest';
import { getAddressFromPrivateKey } from '@stacks/transactions';
import { preflight, readClaimFeeCap, readDropForAttestation, readDropForSettlement } from '../src/preflight.js';
import { COLLECTION_ID, FakeChain, claimerKey, makeDrop, testConfig } from './helpers.js';
import type { FakeDrop } from './helpers.js';
import type { PreflightInput } from '../src/preflight.js';

const cfg = testConfig();
const CLAIMER = getAddressFromPrivateKey(claimerKey(0), 'mainnet');

const chainWith = (drop: Partial<FakeDrop> = {}, dropId = '1'): FakeChain => {
  const chain = new FakeChain();
  chain.drops.set(dropId, makeDrop(drop));
  return chain;
};

const run = (chain: FakeChain, input: Partial<PreflightInput> = {}) =>
  preflight(chain, cfg, {
    dropId: 1n,
    claimer: CLAIMER,
    functionName: 'claim',
    quoteUstx: 30_000n,
    ...input
  });

describe('preflight: the chain is authoritative (threat 12)', () => {
  it('accepts an active sponsored drop inside its window with budget and supply', async () => {
    const chain = chainWith();
    const result = await run(chain);
    expect(result).toMatchObject({ ok: true, hasReservation: false });
    if (!result.ok) return;
    expect(result.budgetRemaining).toBe(10_000_000n);
    expect(result.claimFeeCap).toBe(2_000_000n);
  });

  it('rejects a drop that does not exist', async () => {
    const chain = new FakeChain();
    expect(await run(chain)).toMatchObject({ ok: false, code: 'DROP_NOT_FOUND' });
  });

  it('rejects a malformed drop tuple as not found', async () => {
    const chain = chainWith();
    const original = chain.callReadOnly.bind(chain);
    chain.callReadOnly = async (contractId, fn, argsHex) => {
      if (fn === 'get-drop') {
        const { Cl } = await import('@stacks/transactions');
        return Cl.some(Cl.tuple({ status: Cl.uint(1n) }));
      }
      return original(contractId, fn, argsHex);
    };
    expect(await run(chain)).toMatchObject({ ok: false, code: 'DROP_NOT_FOUND', detail: 'malformed drop tuple' });
  });

  it('rejects a drop that is not active', async () => {
    for (const status of [0n, 2n, 3n, 4n]) {
      expect(await run(chainWith({ status }))).toMatchObject({ ok: false, code: 'DROP_NOT_ACTIVE' });
    }
  });

  it('rejects a drop whose mode is not sponsored', async () => {
    for (const mode of [1n, 2n]) {
      expect(await run(chainWith({ mode }))).toMatchObject({ ok: false, code: 'DROP_NOT_SPONSORED' });
    }
  });

  it('rejects entrypoint/eligibility mismatches in both directions', async () => {
    // claim on a signed-eligibility drop
    expect(await run(chainWith({ eligibility: 3n }))).toMatchObject({
      ok: false,
      code: 'WRONG_ELIGIBILITY'
    });
    // claim-signed on a public drop
    expect(await run(chainWith({ eligibility: 1n }), { functionName: 'claim-signed' })).toMatchObject({
      ok: false,
      code: 'WRONG_ELIGIBILITY'
    });
    // claim-signed on a signed drop is fine
    expect(
      await run(chainWith({ eligibility: 3n }), { functionName: 'claim-signed' })
    ).toMatchObject({ ok: true });
  });

  it('rejects while the contract is paused', async () => {
    const chain = chainWith();
    chain.paused = true;
    expect(await run(chain)).toMatchObject({ ok: false, code: 'CONTRACT_PAUSED' });
  });

  it('rejects when the pause flag cannot be read (fail closed)', async () => {
    const chain = chainWith();
    const original = chain.callReadOnly.bind(chain);
    chain.callReadOnly = async (contractId, fn, argsHex) =>
      fn === 'is-paused' ? null : original(contractId, fn, argsHex);
    expect(await run(chain)).toMatchObject({ ok: false, code: 'CONTRACT_PAUSED' });
  });

  it('rejects before the window opens and after it closes', async () => {
    const beforeStart = chainWith({ startBlock: 900n });
    beforeStart.tip = 500n;
    expect(await run(beforeStart)).toMatchObject({ ok: false, code: 'WINDOW_CLOSED' });

    const afterEnd = chainWith({ startBlock: 100n, endBlock: 400n });
    afterEnd.tip = 500n;
    expect(await run(afterEnd)).toMatchObject({ ok: false, code: 'WINDOW_CLOSED' });

    // end-block 0 means open-ended
    const openEnded = chainWith({ startBlock: 100n, endBlock: 0n });
    openEnded.tip = 10_000n;
    expect(await run(openEnded)).toMatchObject({ ok: true });

    // boundaries are inclusive
    const atStart = chainWith({ startBlock: 500n, endBlock: 500n });
    atStart.tip = 500n;
    expect(await run(atStart)).toMatchObject({ ok: true });
  });

  it('rejects when budget-remaining is below the quote', async () => {
    const result = await run(chainWith({ budgetRemaining: 29_999n }));
    expect(result).toMatchObject({ ok: false, code: 'BUDGET_EXHAUSTED' });
    if (result.ok) return;
    expect(result.detail).toContain('29999');
    // exactly covering the quote is accepted
    expect(await run(chainWith({ budgetRemaining: 30_000n }))).toMatchObject({ ok: true });
  });

  it('rejects a wallet already at its per-wallet limit', async () => {
    const chain = chainWith({ perWalletLimit: 2n });
    chain.drops.get('1')!.walletClaims.set(CLAIMER, 2n);
    expect(await run(chain)).toMatchObject({ ok: false, code: 'WALLET_LIMIT' });
    chain.drops.get('1')!.walletClaims.set(CLAIMER, 1n);
    expect(await run(chain)).toMatchObject({ ok: true });
  });

  it('treats per-wallet-limit 0 as unlimited', async () => {
    const chain = chainWith({ perWalletLimit: 0n });
    chain.drops.get('1')!.walletClaims.set(CLAIMER, 99n);
    expect(await run(chain)).toMatchObject({ ok: true });
  });

  it('rejects when zero items remain', async () => {
    expect(await run(chainWith({ remaining: 0n }))).toMatchObject({ ok: false, code: 'SOLD_OUT' });
  });

  it('an outstanding reservation bypasses wallet-limit and supply checks', async () => {
    const chain = chainWith({ perWalletLimit: 1n, remaining: 0n });
    const drop = chain.drops.get('1')!;
    drop.walletClaims.set(CLAIMER, 5n);
    drop.reservations.add(CLAIMER);
    const result = await run(chain);
    expect(result).toMatchObject({ ok: true, hasReservation: true });
    // reserve-claim never consults the reservation map (it is creating one)
    expect(await run(chain, { functionName: 'reserve-claim' })).toMatchObject({
      ok: false,
      code: 'WALLET_LIMIT'
    });
  });

  it('falls back to the configured fee ceiling when the cap read fails', async () => {
    const chain = chainWith();
    const original = chain.callReadOnly.bind(chain);
    chain.callReadOnly = async (contractId, fn, argsHex) =>
      fn === 'get-claim-fee-cap' ? null : original(contractId, fn, argsHex);
    const result = await run(chain);
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.claimFeeCap).toBe(cfg.maxFeeUstx);
    expect(await readClaimFeeCap(chain, cfg)).toBe(cfg.maxFeeUstx);
  });
});

describe('preflight: drop readers used by settlement and attestation', () => {
  it('readDropForSettlement projects status/budget/fees/claims', async () => {
    const chain = chainWith({ budgetRemaining: 123n, feesSettled: 7n, claimedCount: 3n });
    expect(await readDropForSettlement(chain, cfg, 1n)).toEqual({
      status: 1n,
      budgetRemaining: 123n,
      feesSettled: 7n,
      claimedCount: 3n
    });
    expect(await readDropForSettlement(chain, cfg, 99n)).toBeNull();
  });

  it('readDropForAttestation projects status/eligibility/collection', async () => {
    const chain = chainWith({ eligibility: 3n });
    expect(await readDropForAttestation(chain, cfg, 1n)).toEqual({
      status: 1n,
      eligibility: 3n,
      collection: COLLECTION_ID
    });
    expect(await readDropForAttestation(chain, cfg, 99n)).toBeNull();
  });

  it('readClaimFeeCap reads the on-chain ceiling', async () => {
    const chain = chainWith();
    chain.claimFeeCap = 750_000n;
    expect(await readClaimFeeCap(chain, cfg)).toBe(750_000n);
  });
});
