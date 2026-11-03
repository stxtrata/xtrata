import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bufferCV, listCV } from '@stacks/transactions';
import { DEPOSIT, FakeChain, loadAgent, unloadAgent } from './support/fake-chain';

// Hiro's /v2/fees/transaction takes the whole transaction as hex in a JSON body and
// answers 413 FST_ERR_CTP_BODY_TOO_LARGE above 1 MiB. A full 32-chunk add-chunk-batch is
// ~524,661 bytes = ~1,049,322 hex chars, so Standard-mode jobs on big files died there
// (refund receipts #3605 / #3606). send() must not ask the node about a transaction that
// cannot fit, and must not fall through to a library estimate that makes the same call.

let chain: FakeChain;
let agent: any;
const KEY = '0'.repeat(63) + '1';
const chunks = (n: number) => [bufferCV(new Uint8Array(32)), listCV(Array.from({ length: n }, () => bufferCV(new Uint8Array(16384))))];

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
  vi.spyOn(globalThis, 'setTimeout').mockImplementation(((f: any) => { f(); return 0 as any; }) as any);
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

describe('fee estimate vs the 1 MiB request limit', () => {
  it('sends a full 32-chunk batch without any fee-estimate request, even if the endpoint returns 413', async () => {
    chain.balances.set(DEPOSIT, 5_000_000n);
    chain.fail('/v2/fees/transaction', 413, { statusCode: 413, code: 'FST_ERR_CTP_BODY_TOO_LARGE' });
    const out = await agent.send(KEY, DEPOSIT, 'add-chunk-batch', chunks(32), null, undefined, null);
    expect(out.txid).toBeTruthy();
    expect(chain.requests.some((u) => u.includes('/fees/transaction'))).toBe(false);
    // priced at the 1 uSTX/byte floor — the quote the node gives a full batch anyway
    expect(chain.broadcasts).toHaveLength(1);
    expect(chain.broadcasts[0]).toBeGreaterThan(524_000n);
    expect(chain.broadcasts[0]).toBeLessThan(530_000n);
  });

  it('still asks the node for small transactions', async () => {
    chain.balances.set(DEPOSIT, 5_000_000n);
    chain.feeQuotes = [3000n];
    await agent.send(KEY, DEPOSIT, 'begin-or-get', [], null, undefined, null);
    expect(chain.requests.some((u) => u.includes('/fees/transaction'))).toBe(true);
    expect(chain.broadcasts).toEqual([3000n]);
  });

  it('keeps the size threshold safely under the 1 MiB body limit (hex doubles the bytes)', () => {
    expect(agent.MAX_ESTIMATE_TX_BYTES * 2).toBeLessThan(1_048_576 - 1_000);
    expect(agent.MAX_ESTIMATE_TX_BYTES).toBeLessThan(524_661);
  });
});
