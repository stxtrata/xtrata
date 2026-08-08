// Which fee a call is guarded against.
//
// A post condition is a cap, and one written for the wrong call is not a
// smaller cap — it is a transaction that aborts. An aborted transaction still
// costs its sender the network fee, so getting this wrong means every attempt
// to open a game on v3 fails and charges for the privilege.
//
// v2 had one fee for both calls, so reading "the fee" was correct. v3 prices
// opening at a hundred times a move by default, which makes the same code a
// bug that only shows up against the newer contract.

import { describe, expect, it, vi } from 'vitest';
import { LiveChain } from '../src/live-chain.js';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

function chainWith(fees) {
  const chain = new LiveChain({
    contractAddress: DEPLOYER,
    contractName: 'xtrata-chess-log-v3',
    network: 'mainnet'
  });
  chain.senderAddress = DEPLOYER;
  chain.callReadOnly = vi.fn(async (fn) => {
    if (fn in fees) return fees[fn];
    const error = new Error(`no such function ${fn}`);
    throw error;
  });
  return chain;
}

describe('a contract that prices the two calls apart', () => {
  const fees = { 'get-move-fee': 1_000, 'get-open-fee': 1_000_000 };

  it('reads both', async () => {
    const chain = chainWith(fees);
    expect(await chain.getContractFee()).toBe(1_000);
    expect(await chain.getOpenFee()).toBe(1_000_000);
  });

  it('guards a move with the move fee', async () => {
    expect(await chainWith(fees).feeFor('submit-move')).toBe(1_000);
  });

  // The one that was wrong. Capping at the move fee would abort every open-game
  // on v3, for a thousandth of what the contract actually transfers.
  it('guards opening a game with the open fee', async () => {
    expect(await chainWith(fees).feeFor('open-game')).toBe(1_000_000);
  });

  it('caches each separately rather than reading before every call', async () => {
    const chain = chainWith(fees);
    await chain.feeFor('open-game');
    await chain.feeFor('open-game');
    await chain.feeFor('submit-move');
    await chain.feeFor('submit-move');

    const asked = chain.callReadOnly.mock.calls.map(([fn]) => fn);
    expect(asked).toEqual(['get-open-fee', 'get-move-fee']);
  });
});

describe('a contract with one fee for both', () => {
  // v2. There is no get-open-fee, and the move fee is the right answer for
  // both calls, so falling back to it is correct rather than merely safe.
  const fees = { 'get-move-fee': 10_000 };

  it('uses the move fee for opening too', async () => {
    const chain = chainWith(fees);
    expect(await chain.feeFor('open-game')).toBe(10_000);
    expect(await chain.feeFor('submit-move')).toBe(10_000);
  });
});

describe('a contract that charges nothing', () => {
  // v1 has neither function. A contract that cannot answer is one that does not
  // charge, and the cap has to be zero rather than absent.
  it('caps both calls at nothing', async () => {
    const chain = chainWith({});
    expect(await chain.feeFor('open-game')).toBe(0);
    expect(await chain.feeFor('submit-move')).toBe(0);
  });
});

describe('a fee that changes under us', () => {
  it('is picked up after a reset rather than cached forever', async () => {
    const chain = chainWith({ 'get-move-fee': 1_000, 'get-open-fee': 1_000_000 });
    expect(await chain.getOpenFee()).toBe(1_000_000);

    chain.openFee = undefined;
    chain.callReadOnly = vi.fn(async () => 2_000_000);
    expect(await chain.getOpenFee()).toBe(2_000_000);
  });
});
