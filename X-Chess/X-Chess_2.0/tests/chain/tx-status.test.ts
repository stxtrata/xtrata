// Following a move to its conclusion.
//
// The board sent a transaction and never looked again. Because settleIntent
// clears the ghost as soon as the value appears in the log OR THE MEMPOOL, and
// an aborted transaction reaches the mempool first, a failure showed up as the
// move quietly VANISHING off the board a poll or two later - with no
// explanation, and no mention that a network fee had been spent.
//
// ADR-0008 is that exact case on mainnet: (ok u3) discarded by
// abort_by_post_condition, 0.1 STX gone, nothing said.

import { describe, expect, it, vi } from 'vitest';
import { makeEndpoint } from '../../packages/chain/endpoint.js';
import { describeOutcome, realTxid, watchTx } from '../../packages/chain/tx-status.js';

const TXID = '0x' + 'ab'.repeat(32);
const nowhere = (): Promise<void> => Promise.resolve();

/** An endpoint that answers with a scripted sequence of statuses. */
function scripted(statuses: (string | 'boom')[]) {
  let at = 0;
  const asked: string[] = [];
  const fetchMock = vi.fn(async (url: string) => {
    asked.push(String(url));
    const next = statuses[Math.min(at++, statuses.length - 1)];
    if (next === 'boom') throw new Error('ECONNRESET');
    return new Response(JSON.stringify({ tx_status: next }), { status: 200 });
  });
  return { asked, endpoint: makeEndpoint({ fetch: fetchMock as unknown as typeof fetch }) };
}

describe('watching a transaction', () => {
  it('waits while it is pending and reports the chain\'s own word', async () => {
    const { asked, endpoint } = scripted(['pending', 'pending', 'success']);
    const outcome = await watchTx(endpoint, TXID, { sleep: nowhere });
    expect(outcome).toMatchObject({ ok: true, status: 'success' });
    expect(asked.length, 'it stopped asking too early').toBe(3);
  });

  it('reports an abort rather than treating it as still pending', async () => {
    const { endpoint } = scripted(['abort_by_post_condition']);
    const outcome = await watchTx(endpoint, TXID, { sleep: nowhere });
    expect(outcome.ok).toBe(false);
    expect(outcome.status).toBe('abort_by_post_condition');
  });

  it('keeps waiting when the READ fails, because that says nothing', async () => {
    // A host having a bad moment is not news about the transaction, and
    // treating it as an answer is the mistake this whole layer exists to avoid.
    const { endpoint } = scripted(['boom', 'boom', 'success']);
    const outcome = await watchTx(endpoint, TXID, { sleep: nowhere });
    expect(outcome).toMatchObject({ ok: true, status: 'success' });
  });

  it('gives up after its deadline rather than polling for ever', async () => {
    let clock = 0;
    const { asked, endpoint } = scripted(['pending']);
    const outcome = await watchTx(endpoint, TXID, {
      sleep: async () => {
        clock += 10_000;
      },
      now: () => clock,
      forMs: 60_000
    });
    expect(outcome).toMatchObject({ status: 'timeout', timedOut: true });
    expect(asked.length, 'it polled far past its deadline').toBeLessThan(12);
  });

  it('does not ask while a wallet dialog is open', async () => {
    // ADR-0011 decision 4. The wallet spends from the same per-IP allowance, so
    // reading underneath an open dialog can stop the broadcast it is waiting on.
    let clock = 0;
    let dialogOpen = true;
    const { asked, endpoint } = scripted(['success']);
    const outcome = await watchTx(endpoint, TXID, {
      sleep: async () => {
        clock += 10_000;
        if (clock >= 30_000) dialogOpen = false;
      },
      now: () => clock,
      shouldAsk: () => !dialogOpen
    });
    expect(outcome.ok).toBe(true);
    expect(asked.length, 'it read the chain while a wallet was open').toBe(1);
  });
});

describe('which ids are worth asking about', () => {
  it('accepts a real one', () => {
    expect(realTxid(TXID)).toBe(true);
    expect(realTxid('ab'.repeat(32))).toBe(true);
  });

  it('refuses the ones that mean "no transaction"', () => {
    // WriteResult.txid is nullable by design, and the runtime emulator answers
    // with an all-zero id. Reporting on either would be reporting on nothing.
    expect(realTxid(null)).toBe(false);
    expect(realTxid(undefined)).toBe(false);
    expect(realTxid('0x' + '0'.repeat(64))).toBe(false);
    expect(realTxid('0xnot-a-txid')).toBe(false);
  });
});

describe('what the player is told', () => {
  it('says nothing at all when the move landed', () => {
    // A board that congratulated somebody on every move would be noise.
    expect(describeOutcome({ ok: true, status: 'success', txid: TXID })).toBeNull();
  });

  it('explains an aborted post condition, and says the fee was spent', () => {
    const say = describeOutcome({ ok: false, status: 'abort_by_post_condition', txid: TXID })!;
    expect(say).toMatch(/network fee was spent/i);
    expect(say, 'it should not leave the player thinking they did it').toMatch(/not in anything you did/i);
  });

  it('says a dropped transaction cost nothing', () => {
    const say = describeOutcome({ ok: false, status: 'dropped_replace_by_fee', txid: TXID })!;
    expect(say).toMatch(/nothing was charged/i);
  });

  it('still says something useful for a status it has never seen', () => {
    const say = describeOutcome({ ok: false, status: 'something_new', txid: TXID })!;
    expect(say).toContain('something_new');
  });
});
