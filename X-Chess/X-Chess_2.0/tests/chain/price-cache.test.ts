// The two prices are remembered, and a writer must not read the memory.
//
// This cost a live transaction its verification. The gates page sent a correct
// `set-sponsorship` (0x85cdc6dd, mainnet, 2026-08-17), the chain accepted it,
// and the step built to read the change back reported the price from BEFORE it
// and failed - because `LiveChain` caches both prices for the session under a
// comment saying they do not change mid-session.
//
// They do not change under a PLAYER, which is who the cache is for. They change
// under an owner, and the owner is exactly who runs the page that verifies
// them. So the cache stays, and anything that writes a price clears it.

import { describe, expect, it } from 'vitest';
import { LiveChain } from '../../packages/chain/client.js';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const NAME = 'xchess-core-v1-canary';

const uint = (value: bigint): string => `01${value.toString(16).padStart(32, '0')}`;

/** get-sponsor-price, as the node serialises it. */
const priceTuple = (bootstrap: bigint, liability: bigint, margin: bigint): string =>
  '0x0c00000004' +
  '09626f6f747374726170' + uint(bootstrap) +
  '096c696162696c697479' + uint(liability) +
  '066d617267696e' + uint(margin) +
  '05746f74616c' + uint(bootstrap + liability + margin);

/**
 * A chain whose answers can be changed underneath it, and which counts reads.
 *
 * `reads` is what proves the cache is still there. A fix that simply removed it
 * would pass every assertion about freshness and quietly triple the request
 * count of a board that polls.
 */
function harness(state: { fee: bigint; bootstrap: bigint; liability: bigint }) {
  const reads: string[] = [];
  const chain = new LiveChain({
    contractAddress: ADDRESS,
    contractName: NAME,
    override: 'https://node.test',
    fetch: (async (url: string) => {
      const fn = String(url).split('/').pop() ?? '';
      reads.push(fn);
      const hex =
        fn === 'get-open-fee' ? `0x${uint(state.fee)}` : priceTuple(state.bootstrap, state.liability, 50_000n);
      return { ok: true, status: 200, json: async () => ({ okay: true, result: hex }) };
    }) as unknown as typeof fetch,
    signer: async () => ({ ok: true as const, txid: '0x00' })
  });
  return { chain, reads };
}

describe('the remembered prices', () => {
  it('are read once for a reader that only ever reads', async () => {
    const state = { fee: 1_000_000n, bootstrap: 250_000n, liability: 90_000n };
    const { chain, reads } = harness(state);

    await chain.getOpenFee();
    await chain.getOpenFee();
    await chain.getSponsorPrice();
    await chain.getSponsorPrice();

    expect(reads.filter((r) => r === 'get-open-fee')).toHaveLength(1);
    expect(reads.filter((r) => r === 'get-sponsor-price')).toHaveLength(1);
  });

  it('go stale, which is the whole reason the rest of this file exists', async () => {
    const state = { fee: 1_000_000n, bootstrap: 250_000n, liability: 90_000n };
    const { chain } = harness(state);

    expect(await chain.getOpenFee()).toBe(1_000_000n);
    state.fee = 10_000n;
    expect(await chain.getOpenFee(), 'the cache is real').toBe(1_000_000n);
  });

  it('are forgotten on request', async () => {
    const state = { fee: 1_000_000n, bootstrap: 250_000n, liability: 90_000n };
    const { chain } = harness(state);

    await chain.getOpenFee();
    state.fee = 10_000n;
    chain.refreshPrices();
    expect(await chain.getOpenFee()).toBe(10_000n);
  });

  it('are forgotten by set-open-fee, so the page that changed it cannot misread it', async () => {
    const state = { fee: 1_000_000n, bootstrap: 250_000n, liability: 90_000n };
    const { chain } = harness(state);

    await chain.getOpenFee();
    await chain.setOpenFee(10_000n);
    state.fee = 10_000n;
    expect(await chain.getOpenFee()).toBe(10_000n);
  });

  it('are forgotten by set-sponsorship, which is the one that actually failed', async () => {
    // Exactly the sequence the gates page runs: read the price to decide
    // whether anything needs sending, send it, then read it back to verify.
    const state = { fee: 10_000n, bootstrap: 60_000n, liability: 20_000n };
    const { chain } = harness(state);

    const before = await chain.getSponsorPrice();
    expect(before.total).toBe(130_000n);

    await chain.setSponsorship(250_000n, 2_000n, 45n, 50_000n);
    state.bootstrap = 250_000n;
    state.liability = 90_000n;

    const after = await chain.getSponsorPrice();
    expect(after.bootstrap).toBe(250_000n);
    expect(after.liability).toBe(90_000n);
    expect(after.total, 'the differ would have reported 0.130 STX again').toBe(390_000n);
  });
});
