// What each move offered, and what it cost in waiting.
//
// THE RUNGS ARE GUESSES UNTIL THIS SAYS OTHERWISE. 400/1200/3000 and a
// twenty-second bump came from one afternoon's sample of the mempool; they are
// a starting position, not a finding. The only way to know whether the bottom
// rung actually gets mined - and how long it takes when it does - is to offer
// it a few hundred times and look.
//
// WHY A LOCAL FILE, when everything else here insists the chain is the record.
// Because the chain does not hold the half we need. A confirmed transaction
// carries `block_time` - when a miner took it - and no `receipt_time` at all:
// the moment it was OFFERED is not recorded anywhere on chain. Latency is the
// gap between the two, so one end of it has to be written down here.
//
// The other end still comes from the chain, and that is deliberate. This file
// records only what the chain cannot: the txid, the fee offered, the rung, and
// the local clock at broadcast. Whether it was mined, and when, is read back
// afterwards from the block. So a corrupted or deleted ledger loses timings and
// cannot invent an outcome.

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const FEE_LOG = join(HERE, '.fee-log.jsonl');

/**
 * One line per broadcast, appended.
 *
 * Append-only for the same reason the env file is: a read-modify-write can lose
 * what is already there, and this accumulates across every run. JSONL because
 * an interrupted write costs the last line rather than the file.
 *
 * Never throws. A tournament must not die because a log line could not be
 * written - the measurement is worth less than the run it is measuring.
 */
export function recordBroadcast({ txid, fee, rung, game, who, at = Date.now() }) {
  try {
    appendFileSync(
      FEE_LOG,
      JSON.stringify({
        txid: String(txid).replace(/^0x/, ''),
        fee: String(fee),
        rung,
        game: game ?? null,
        who: who ?? null,
        at
      }) + '\n',
      { mode: 0o600 }
    );
  } catch {
    // Deliberately silent. See above.
  }
}

/** Everything recorded so far, newest last. Bad lines are skipped, not fatal. */
export function readLedger(path = FEE_LOG) {
  if (!existsSync(path)) return [];
  const out = [];
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      // A half-written last line from an interrupted run.
    }
  }
  return out;
}

/**
 * What the ledger and the chain say together.
 *
 * `lookup` returns `{ status, blockTime }` for a txid and is injected, so the
 * arithmetic here is testable without a network.
 *
 * A REPLACED TRANSACTION IS NOT A FAILURE, and counting it as one would make
 * every ladder look terrible. When a rung is outbid by the rung above it the
 * node reports `dropped_replace_by_fee` - that is the ladder working, and the
 * move still landed under a different txid. So those are counted separately
 * rather than dropped or scored as losses.
 */
export async function summarise(entries, lookup) {
  const rows = [];
  for (const entry of entries) {
    const seen = await lookup(entry.txid);
    rows.push({ ...entry, ...seen });
  }

  const byFee = new Map();
  for (const row of rows) {
    const key = row.fee;
    if (!byFee.has(key)) {
      byFee.set(key, { fee: key, offered: 0, mined: 0, replaced: 0, other: 0, waits: [] });
    }
    const bucket = byFee.get(key);
    bucket.offered++;
    if (row.status === 'success') {
      bucket.mined++;
      if (row.blockTime && row.at) {
        // Seconds from offer to block. The local clock at one end and the
        // chain's at the other, which is why a wildly negative value is
        // dropped rather than trusted.
        const waited = Math.round((row.blockTime * 1000 - row.at) / 1000);
        if (waited >= 0 && waited < 3_600) bucket.waits.push(waited);
      }
    } else if (row.status === 'dropped_replace_by_fee') {
      bucket.replaced++;
    } else {
      bucket.other++;
    }
  }

  return [...byFee.values()]
    .map((b) => {
      const sorted = [...b.waits].sort((x, y) => x - y);
      const at = (p) => (sorted.length ? sorted[Math.floor(sorted.length * p)] : null);
      return {
        ...b,
        // Of the transactions that were NOT outbid by our own next rung, how
        // many did a miner take? That is the question a rung has to answer.
        landedPct: b.offered - b.replaced > 0
          ? Math.round((b.mined / (b.offered - b.replaced)) * 100)
          : null,
        medianWait: at(0.5),
        p90Wait: at(0.9)
      };
    })
    .sort((a, b) => Number(a.fee) - Number(b.fee));
}
