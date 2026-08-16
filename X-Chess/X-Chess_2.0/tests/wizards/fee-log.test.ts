// Reading the ladder's own results back, so the rungs stop being a guess.
//
// The chain records when a move was MINED and never when it was OFFERED, so
// latency needs both halves: a local note of the broadcast, and the block from
// the chain. These tests are about the arithmetic that joins them — the lookup
// is injected, so none of this needs a network.

import { describe, expect, it } from 'vitest';
import { summarise } from '../../harness/wizards/fee-log.mjs';

const at = (s: number) => 1_700_000_000_000 + s * 1000;
const block = (s: number) => 1_700_000_000 + s;

describe('what a fee actually bought', () => {
  it('measures the wait from offer to block', async () => {
    const rows = await summarise(
      [{ txid: 'a', fee: '400', rung: 0, at: at(0) }],
      async () => ({ status: 'success', blockTime: block(30) })
    );
    expect(rows[0].medianWait, 'the wait is not the gap between offer and block').toBe(30);
  });

  it('does not score a replaced rung as a failure', async () => {
    // The ladder outbidding itself is the ladder WORKING. Counting
    // `dropped_replace_by_fee` as a loss would make every ladder look terrible
    // and argue for exactly the flat fee it replaced.
    const rows = await summarise(
      [
        { txid: 'a', fee: '400', rung: 0, at: at(0) },
        { txid: 'b', fee: '400', rung: 0, at: at(0) },
        { txid: 'c', fee: '400', rung: 0, at: at(0) }
      ],
      async (id: string) => ({
        status: id === 'c' ? 'success' : 'dropped_replace_by_fee',
        blockTime: id === 'c' ? block(20) : null
      })
    );
    expect(rows[0].replaced).toBe(2);
    // One of one that was not outbid. A rung is judged on the transactions it
    // was actually allowed to win.
    expect(rows[0].landedPct, 'a replaced rung was counted against itself').toBe(100);
  });

  it('separates the rungs, since that is the whole comparison', async () => {
    const rows = await summarise(
      [
        { txid: 'a', fee: '400', rung: 0, at: at(0) },
        { txid: 'b', fee: '1200', rung: 1, at: at(0) }
      ],
      async (id: string) => ({ status: 'success', blockTime: block(id === 'a' ? 60 : 12) })
    );
    expect(rows.map((r) => r.fee)).toEqual(['400', '1200']);
    expect(rows[0].medianWait).toBe(60);
    expect(rows[1].medianWait, 'the dearer rung was not measured separately').toBe(12);
  });

  it('throws away a wait that cannot be real', async () => {
    // One end is a local clock and the other is the chain's. A block time
    // before the broadcast means the clocks disagree, and a negative wait
    // averaged in would quietly flatter whichever rung suffered it.
    const rows = await summarise(
      [{ txid: 'a', fee: '400', rung: 0, at: at(100) }],
      async () => ({ status: 'success', blockTime: block(10) })
    );
    expect(rows[0].mined).toBe(1);
    expect(rows[0].medianWait, 'a negative wait was believed').toBeNull();
  });

  it('says nothing rather than guessing from no data', async () => {
    const rows = await summarise([], async () => ({ status: 'success', blockTime: block(1) }));
    expect(rows).toEqual([]);
  });
});
