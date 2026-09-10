// What became of a transaction.
//
// The board sent a move and never looked again. It said "Sent. It counts once
// it is in a block" and stopped there, so a transaction that failed simply
// VANISHED off the board a poll or two later, with no explanation and no
// mention that a fee had been paid. The player is left wondering whether they
// clicked the wrong thing.
//
// That is not a rare path. ADR-0008 records a submission that returned (ok u3)
// and was discarded by abort_by_post_condition, costing 0.1 STX - the contract
// did the work, the network threw the result away, and nothing said so.
//
// The gates page has been able to see this all along: canary.ts polls the
// transaction until it stops being pending and reports the chain's own word.
// This is that, moved somewhere the board can reach it, and taught to use the
// endpoint list rather than one hardcoded host.

import type { Endpoint } from './endpoint.js';

export interface TxOutcome {
  ok: boolean;
  /** The chain's own word: success, abort_by_post_condition, dropped_replace_by_fee... */
  status: string;
  txid: string;
  timedOut?: boolean;
}

export interface WatchOptions {
  /** How often to ask. Ten seconds: this shares an allowance with the wallet. */
  everyMs?: number;
  /** How long to care. Twenty minutes, after which nobody is still watching. */
  forMs?: number;
  /** Injected in tests, and by anything that wants to stop early. */
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  /** Asked before every poll. False pauses without giving up - see ADR-0011. */
  shouldAsk?: () => boolean;
}

/** True for a txid worth asking about at all. */
export function realTxid(txid: unknown): boolean {
  const text = String(txid ?? '').replace(/^0x/, '');
  // The runtime emulator answers with an all-zero id, and WriteResult.txid is
  // nullable by design. Reporting on either would be reporting on nothing.
  return /^[0-9a-fA-F]{64}$/.test(text) && !/^0+$/.test(text);
}

/**
 * Poll until the chain stops saying "pending".
 *
 * Never throws. A read that fails says nothing about the transaction, so it
 * waits and asks again - the endpoint being briefly unreachable is not an
 * answer, and treating it as one is the mistake this whole layer exists to
 * avoid.
 */
export async function watchTx(
  endpoint: Endpoint,
  txid: string,
  options: WatchOptions = {}
): Promise<TxOutcome> {
  const id = txid.startsWith('0x') ? txid : `0x${txid}`;
  const everyMs = options.everyMs ?? 10_000;
  const forMs = options.forMs ?? 20 * 60_000;
  const now = options.now ?? (() => Date.now());
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((done) => setTimeout(done, ms)));
  const deadline = now() + forMs;

  for (;;) {
    if (options.shouldAsk?.() !== false) {
      try {
        const response = await endpoint.request(`/extended/v1/tx/${id}`);
        if (response.ok) {
          const body = (await response.json()) as { tx_status?: string };
          const status = String(body.tx_status ?? '');
          // Keyed on tx_status alone. There is no post_condition_aborted field;
          // the abort arrives as a status like any other.
          if (status && status !== 'pending') {
            return { ok: status === 'success', status, txid: id };
          }
        }
      } catch {
        // Not an answer. Ask again.
      }
    }

    if (now() > deadline) return { ok: false, status: 'timeout', txid: id, timedOut: true };
    await sleep(everyMs);
  }
}

/**
 * What to tell the player, in the chain's own terms.
 *
 * Success is SILENT. A board that congratulated somebody on every move would be
 * noise, and the whole point of this is the moment something went wrong.
 */
export function describeOutcome(outcome: TxOutcome): string | null {
  if (outcome.ok) return null;
  if (outcome.timedOut) {
    return 'That move has not been in a block for twenty minutes. It may still land; ' +
      'the board will show it if it does.';
  }
  if (outcome.status === 'abort_by_post_condition') {
    return 'The contract accepted that move and the network then threw the result away, because ' +
      'a transfer it makes was not covered by the conditions the wallet was given. Nothing was ' +
      'recorded, and the network fee was spent. This is a fault in the board, not in anything ' +
      'you did.';
  }
  if (outcome.status === 'abort_by_response') {
    return 'The contract refused that move, so nothing was recorded. The network fee was spent.';
  }
  if (outcome.status.startsWith('dropped')) {
    return 'That move was dropped before it reached a block, usually because its fee was too low ' +
      'or it was replaced. Nothing was recorded and nothing was charged. Try again.';
  }
  return `That move ended as "${outcome.status}" and was not recorded.`;
}
