import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEPOSIT, FakeChain, loadAgent, unloadAgent } from './support/fake-chain';

// The fee/broadcast path is where the "watched for ten minutes and nothing happened"
// run actually died. These drive the real send() against a node whose estimator and
// mempool we control.

let chain: FakeChain;
let agent: any;
// A funded deposit key. The address does not need to match DEPOSIT — send() reads the
// balance of whatever `from` it is given.
const KEY = '0'.repeat(63) + '1';

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
  // Fees are quoted in a loop with sleeps between; run timers eagerly so tests are fast.
  vi.spyOn(globalThis, 'setTimeout').mockImplementation(((f: any) => { f(); return 0 as any; }) as any);
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

describe('fee estimation', () => {
  it('broadcasts the quoted fee when it is affordable', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [3000n];
    const out = await agent.send(KEY, addr, 'begin-or-get', [], null, undefined, null);
    expect(out.txid).toBeTruthy();
    expect(chain.broadcasts).toEqual([3000n]);
  });

  it('after waiting, refuses rather than broadcasting a fee below every quote', async () => {
    const addr = DEPOSIT;
    // Headroom just above the reserves, so effCap is tiny and every quote "spikes".
    chain.balances.set(addr, 205_000n + 800n);
    chain.feeQuotes = [90_000n];
    chain.minAcceptedFee = 0n;   // the node would ACCEPT anything — the point is we don't send it
    await expect(
      agent.send(KEY, addr, 'begin-or-get', [], null, undefined, null)
    ).rejects.toThrow(/cannot afford the network fee/i);
    // The shipped "bounded fallback" broadcast min(2 × last good fee, effCap) here —
    // a fee already known to be below every quote — which is how a run ended in
    // "using bounded fallback fee 0" and then FeeTooLow.
    expect(chain.broadcasts).toEqual([]);
  });

  it('refuses when even the cheapest quote is beyond the wallet, instead of broadcasting', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 205_100n);   // ~100 µSTX of headroom
    chain.feeQuotes = [50_000n];
    await expect(
      agent.send(KEY, addr, 'begin-or-get', [], null, undefined, null)
    ).rejects.toThrow(/cannot afford the network fee/i);
    expect(chain.broadcasts).toEqual([]);   // nothing doomed was sent
  });
});

describe('broadcast rejections', () => {
  it('bumps the fee on FeeTooLow instead of waiting out the estimator cycle', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [1000n];
    chain.minAcceptedFee = 1500n;      // 1000 rejected, 2000 accepted
    const out = await agent.send(KEY, addr, 'begin-or-get', [], null, undefined, null);
    expect(out.txid).toBeTruthy();
    expect(chain.broadcasts).toEqual([1000n, 2000n]);   // rejected, then bumped
  });

  it('gives up cleanly when bumping cannot clear the minimum', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [1000n];
    chain.minAcceptedFee = 10_000_000n;    // unreachable
    await expect(
      agent.send(KEY, addr, 'begin-or-get', [], null, undefined, null)
    ).rejects.toThrow(/FeeTooLow/i);
    expect(chain.broadcasts.length).toBeLessThanOrEqual(4);   // bounded: 1 + 3 bumps
  });

  it('does not remember a REJECTED fee as the last good one', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [1000n];
    chain.minAcceptedFee = 1500n;
    await agent.send(KEY, addr, 'seal-inscription', [], null, undefined, null);
    // 1000 was rejected and 2000 accepted, so a later fallback must build on 2000.
    // Recording the fee before the broadcast let one rejected estimate poison every
    // later attempt for that function.
    chain.broadcasts = [];
    chain.feeQuotes = [1200n];
    chain.minAcceptedFee = 0n;
    await agent.send(KEY, addr, 'seal-inscription', [], null, undefined, null);
    expect(chain.broadcasts[0]).toBe(1200n);
  });
});

describe('confirmation', () => {
  it('fails fast on a dropped transaction rather than polling for sixteen minutes', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [3000n];
    const original = chain.handle.bind(chain);
    // Accept the broadcast, then report the tx as dropped.
    chain.handle = (url: string) => {
      const res = original(url);
      if (/\/extended\/v1\/tx\//.test(url)) {
        return new Response(JSON.stringify({ tx_status: 'dropped_replace_by_fee' }), {
          status: 200, headers: { 'content-type': 'application/json' }
        });
      }
      return res;
    };
    await expect(
      agent.send(KEY, addr, 'begin-or-get', [], null, undefined, null)
    ).rejects.toThrow(/dropped/i);
  });
});

describe('one transaction cannot eat the budget for the rest', () => {
  it('honours a caller-supplied fee ceiling below the global cap', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    // The estimator wants 1.5 STX — under MINT_CAP (2 STX), so the old code would
    // simply pay it. With ten batches left and a 6.4 STX budget, three of those
    // empty the wallet before anything is sealed.
    chain.feeQuotes = [1_500_000n];
    const ceiling = 400_000n;
    // Refuses rather than paying it. (Asserting "every broadcast <= ceiling" would
    // have passed vacuously on an empty list — the mistake this replaces.)
    await expect(
      agent.send(KEY, addr, 'add-chunk-batch', [], null, undefined, null, ceiling)
    ).rejects.toThrow(/cannot afford the network fee/i);
    expect(chain.broadcasts).toEqual([]);
  });

  it('still sends when the quote fits inside the ceiling', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [300_000n];
    const out = await agent.send(KEY, addr, 'add-chunk-batch', [], null, undefined, null, 400_000n);
    expect(out.txid).toBeTruthy();
    expect(chain.broadcasts).toEqual([300_000n]);
  });

  it('leaves the global cap in charge when no ceiling is given', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [1_500_000n];
    const out = await agent.send(KEY, addr, 'add-chunk-batch', [], null, undefined, null);
    expect(out.txid).toBeTruthy();
    expect(chain.broadcasts).toEqual([1_500_000n]);
  });
});

describe('which of the node\'s three estimates we take', () => {
  it('uses the LOW estimate, not the library default of middle', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [1000n];      // low; middle is 5x, high 30x
    chain.midMultiple = 5;
    const out = await agent.send(KEY, addr, 'seal-inscription', [], null, undefined, null);
    expect(out.txid).toBeTruthy();
    // Measured on mainnet: a 227-byte seal quotes low 227, middle 1191 uSTX. Paying
    // the middle is ~5x the network's own 1 uSTX/byte relay floor for no benefit.
    expect(chain.broadcasts).toEqual([1000n]);
  });

  it('is safe to start low because a rejection bumps', async () => {
    const addr = DEPOSIT;
    chain.balances.set(addr, 5_000_000n);
    chain.feeQuotes = [1000n];
    chain.minAcceptedFee = 1500n;   // the node wants more than the low estimate
    const out = await agent.send(KEY, addr, 'seal-inscription', [], null, undefined, null);
    expect(out.txid).toBeTruthy();
    expect(chain.broadcasts).toEqual([1000n, 2000n]);
  });
});
