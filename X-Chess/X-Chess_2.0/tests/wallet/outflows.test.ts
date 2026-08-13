// What each call tells the wallet the CONTRACT will pay out.
//
// This is the test that was missing, and its absence cost a real mainnet
// transaction. `tests/wallet/postconditions.test.ts` proved the ENCODING was
// right; nothing proved the AMOUNTS were.
//
// `open-sponsored-game` pays a bootstrap to the opponent. The call declared
// zero, so no condition covered it, and a deny-mode transaction aborted after
// the contract had already returned `(ok u3)`. The network fee was kept.
//
// The question every row below asks is not "does the sender get anything back"
// but "does the CONTRACT pay anyone at all".

import { describe, expect, it } from 'vitest';
import { REBATE_CEILING } from '../../packages/wallet/postconditions.js';
import { LiveChain } from '../../packages/chain/client.js';
import type { ContractCall } from '../../packages/chain/client.js';
import { guardFor, stxFromContract } from '../../packages/wallet/postconditions.js';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const NAME = 'xchess-core-v1-canary';
const CONTRACT_ID = `${ADDRESS}.${NAME}`;

const OPEN_FEE = 1_000_000n;
const BOOTSTRAP = 60_000n;
const LIABILITY = 450_000n;
const MARGIN = 50_000n;
const TOTAL = BOOTSTRAP + LIABILITY + MARGIN;

/** A chain whose reads are answered locally and whose writes are captured. */
function harness(): { chain: LiveChain; calls: ContractCall[] } {
  const calls: ContractCall[] = [];
  const chain = new LiveChain({
    contractAddress: ADDRESS,
    contractName: NAME,
    override: 'https://node.test',
    fetch: (async (url: string) => {
      const fn = String(url).split('/').pop();
      const hex =
        fn === 'get-open-fee'
          ? `0x01${OPEN_FEE.toString(16).padStart(32, '0')}`
          : // get-sponsor-price: a tuple of four uints
            '0x0c00000004' +
            '09626f6f747374726170' + `01${BOOTSTRAP.toString(16).padStart(32, '0')}` +
            '096c696162696c697479' + `01${LIABILITY.toString(16).padStart(32, '0')}` +
            '066d617267696e' + `01${MARGIN.toString(16).padStart(32, '0')}` +
            '05746f74616c' + `01${TOTAL.toString(16).padStart(32, '0')}`;
      return { ok: true, status: 200, json: async () => ({ okay: true, result: hex }) };
    }) as unknown as typeof fetch,
    signer: async (call) => {
      calls.push(call);
      return { ok: true, txid: '0x00' };
    }
  });
  return { chain, calls };
}

describe('what the contract pays out, per call', () => {
  it('pays nobody on a standard open', async () => {
    const { chain, calls } = harness();
    await chain.openGame(null, false);
    expect(calls[0].sends).toBe(OPEN_FEE);
    expect(calls[0].contractSends).toBe(0n);
  });

  it('PAYS THE BOOTSTRAP on a sponsored open', async () => {
    // The one that aborted on mainnet. The money goes to the OPPONENT, not to
    // the caller, which is why "what does the sender receive" was the wrong
    // question to have asked.
    const { chain, calls } = harness();
    await chain.openSponsoredGame(null, false, ADDRESS);
    expect(calls[0].sends).toBe(OPEN_FEE + TOTAL);
    expect(calls[0].contractSends, 'the bootstrap was left uncovered').toBe(BOOTSTRAP);
  });

  it('pays two bootstraps when both sides are sponsored', async () => {
    const { chain, calls } = harness();
    await chain.openSponsoredBoth(null, false, ADDRESS, ADDRESS);
    expect(calls[0].sends).toBe(OPEN_FEE + TOTAL * 2n);
    expect(calls[0].contractSends).toBe(BOOTSTRAP * 2n);
  });

  // INVERTED, deliberately. This used to assert that an unsponsored submit
  // declares 0n, which is exactly the assumption that made the bug: the board
  // cannot know which account the wallet will sign with, so a submit it believes
  // is unsponsored may be signed by somebody the contract will pay. The transfer
  // is then uncovered and the transaction is discarded after the contract has
  // already done the work - ADR-0008's shape, which cost 0.1 STX on mainnet.
  it('covers the protocol ceiling on EVERY submission, sponsored or not', async () => {
    const { chain, calls } = harness();
    await chain.submit(1, 'e2e4');
    await chain.submit(1, 'e2e4');
    for (const call of calls) {
      expect(
        call.contractSends,
        'a submission declared less than the contract can pay, so the signer decides whether it lands'
      ).toBe(REBATE_CEILING);
      expect(call.sends, 'a submission should never move money FROM the player').toBe(0n);
    }
  });

  it('cannot be satisfied by a guard built from zero', async () => {
    // The failure in miniature: a condition written for 0n does not cover a
    // real payout, and deny mode throws the whole transaction away.
    const guard = stxFromContract(CONTRACT_ID, 0n);
    const covering = stxFromContract(CONTRACT_ID, REBATE_CEILING);
    expect(guard).not.toBe(covering);
  });

  it('pays nothing on a top-up: the wallet already has its bootstrap', async () => {
    const { chain, calls } = harness();
    await chain.topUpSponsorship(1, ADDRESS);
    expect(calls[0].sends).toBe(LIABILITY + MARGIN);
    expect(calls[0].contractSends).toBe(0n);
  });

  it('moves no money at all on settlement', async () => {
    // Settling releases a reservation. Nothing leaves the contract.
    const { chain, calls } = harness();
    await chain.settleSponsorship(1, ADDRESS);
    expect(calls[0].sends).toBe(0n);
    expect(calls[0].contractSends).toBe(0n);
  });

  it('pays the withdrawal amount, which may go to somebody else entirely', async () => {
    const { chain, calls } = harness();
    await chain.withdraw(123_456n, ADDRESS);
    expect(calls[0].contractSends).toBe(123_456n);
  });

  it('pays nothing on the owner and hint calls', async () => {
    const { chain, calls } = harness();
    await chain.claimResult(1, '1-0', 3);
    await chain.setOpenFee(0n);
    await chain.setSponsorship(1n, 1n, 1n, 1n);
    for (const call of calls) expect(call.contractSends, call.functionName).toBe(0n);
  });
});

describe('the guard those numbers produce', () => {
  it('writes a contract condition whenever the contract pays anyone', async () => {
    const { chain, calls } = harness();
    await chain.openSponsoredGame(null, false, ADDRESS);

    const guard = guardFor({
      sender: ADDRESS,
      contractId: CONTRACT_ID,
      sends: calls[0].sends,
      contractSends: calls[0].contractSends
    });

    expect(guard.postConditionMode).toBe('deny');
    expect(guard.postConditions).toHaveLength(2);
    expect(guard.postConditions).toContain(stxFromContract(CONTRACT_ID, BOOTSTRAP));
  });

  it('would have produced only ONE condition under the old model, which is the bug', () => {
    // Kept as a statement of what went wrong. One condition, covering only the
    // sender, is exactly what the aborted transaction carried.
    const wrong = guardFor({
      sender: ADDRESS,
      contractId: CONTRACT_ID,
      sends: OPEN_FEE + TOTAL,
      contractSends: 0n
    });
    expect(wrong.postConditions).toHaveLength(1);

    const right = guardFor({
      sender: ADDRESS,
      contractId: CONTRACT_ID,
      sends: OPEN_FEE + TOTAL,
      contractSends: BOOTSTRAP
    });
    expect(right.postConditions).toHaveLength(2);
  });
});
