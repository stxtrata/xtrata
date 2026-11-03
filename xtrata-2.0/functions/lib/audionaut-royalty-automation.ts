import { CORE, readRoyaltySnapshot, verifyRoyaltyPayment, royaltyRows, fetchPaymentTransaction, normalizeTxId, paymentEditions, ROYALTY_MICRO_STX, type Snapshot, type PaymentRecord } from './audionaut-royalties';
import { COLLECTION_CONTRACT_ID } from '../../src/audionaut/core';
import { makeChainReader } from './collection-storage/chain';
import { queryAll, run, type Env } from './db';
import { reconcileRoyaltyIntents } from './audionaut-royalty-admin';
import { networkForAddress } from './creator-proof';

// The first-party read proxy supplies the existing server-side Hiro keys. No
// wallet key or signing capability is required by this worker.
export const chainFetch: typeof fetch = (input, init) => {
  const url = String(input).replace(/^https:\/\/api(?:\.mainnet)?\.hiro\.so/, 'https://xtrata.xyz/hiro/mainnet');
  return fetch(url, init);
};
const readerFor = (env: Env) => makeChainReader(env, { core: CORE, helper: COLLECTION_CONTRACT_ID, network: 'mainnet' }, chainFetch);
export function payerAddresses(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 10 || value.some(a => typeof a !== 'string' || a.includes('.') || networkForAddress(a) !== 'mainnet'))
    throw Error('Enter up to ten valid Stacks mainnet paying wallet addresses.');
  return [...new Set((value as string[]).map(a => a.trim().toUpperCase()))];
}
export function decodeRoyaltyMemo(value: unknown): string {
  if (typeof value !== 'string' || !/^0x(?:[a-f0-9]{2}){0,34}$/i.test(value)) return '';
  const bytes = Uint8Array.from(value.slice(2).match(/../g) ?? [], x => parseInt(x, 16));
  return new TextDecoder().decode(bytes).replace(/\0+$/, '');
}
/** Explicit collection/edition tags avoid assigning an unrelated 5 STX receipt.
 * At most 34 UTF-8 bytes fit in a standard Stacks transfer memo. */
export function memoEditions(memo: string): number[] | null {
  if (!/^audionaut:\d{1,3}(?:,\d{1,3})*$/.test(memo)) return null;
  try { return paymentEditions(memo.slice(10).split(',').map(Number)); } catch { return null; }
}
export async function automationInfo(env: Env, admin: boolean) {
  const state = (await queryAll(env, 'SELECT payers_json,checked_at,block_height,summary_json,error FROM audionaut_royalty_automation WHERE id=1')).results?.[0] as any;
  const candidates = admin ? (await queryAll(env, `SELECT c.* FROM audionaut_royalty_candidates c
    WHERE NOT EXISTS(SELECT 1 FROM audionaut_royalty_payments p WHERE p.tx_id=c.tx_id)
    ORDER BY c.block_height DESC LIMIT 50`)).results ?? [] : undefined;
  return { checkedAt: state?.checked_at ?? null, blockHeight: state?.block_height ?? null,
    summary: state?.summary_json ? JSON.parse(state.summary_json) : null, error: state?.error ?? null,
    ...(admin ? { payers: state ? JSON.parse(state.payers_json) : [], candidates } : {}) };
}
export type AutomationDependencies = {
  snapshot: (env: Env) => Promise<Snapshot>;
  canonical: (env: Env, height: number, hash: string) => Promise<void>;
  block: (env: Env, height: number) => Promise<string>;
  page: (env: Env, address: string, height: number, offset: number) => Promise<{ results: any[]; total: number }>;
  verify: (env: Env, record: PaymentRecord, snapshot: Snapshot) => Promise<unknown>;
  rows: typeof royaltyRows;
};
async function chainJson(path: string) {
  const response = await chainFetch('https://api.mainnet.hiro.so' + path, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw Error(`Payment discovery unavailable (HTTP ${response.status}).`);
  return response.json();
}
const defaults: AutomationDependencies = {
  snapshot: env => readRoyaltySnapshot(env, readerFor(env)),
  canonical: (env, height, hash) => readerFor(env).canonical(height, hash),
  block: async (_env, height) => {
    const block = await chainJson(`/extended/v1/block/by_height/${height}`);
    if (block.canonical !== true || block.height !== height || !/^0x[a-f0-9]{64}$/i.test(block.index_block_hash)) throw Error('Canonical scan block unavailable.');
    return block.index_block_hash.toLowerCase();
  },
  page: async (_env, address, height, offset) => chainJson(`/extended/v1/address/${address}/transactions?until_block=${height}&limit=50&offset=${offset}`),
  verify: (env, record, live) => verifyRoyaltyPayment(env, record, live, readerFor(env), id => fetchPaymentTransaction(env, id, chainFetch)),
  rows: (env, live, records) => royaltyRows(env, live, records, record => defaults.verify(env, record, live))
};

/** Each address's backfill is pinned to a canonical block so new activity cannot
 * shift offsets. Bounded pages resume on later runs. A reorg restarts its scan. */
export async function runRoyaltyAutomation(env: Env, deps: AutomationDependencies = defaults, now = Date.now()) {
  const db = env.DB ?? env.D1 ?? env.db;
  if (!db) throw Error('Royalty storage unavailable.');
  const lock = await run(env, 'UPDATE audionaut_royalty_automation SET lease_until=? WHERE id=1 AND lease_until<?', [now + 15 * 60_000, now]);
  if (lock.meta?.changes !== 1) return { skipped: true };
  try {
    const live = await deps.snapshot(env);
    const earliest = Math.min(...live.minted.map(m => m.mintedAt));
    const state = (await queryAll(env, 'SELECT payers_json FROM audionaut_royalty_automation WHERE id=1')).results?.[0] as any;
    const records = (await queryAll(env, 'SELECT tx_id,recipient,editions_json FROM audionaut_royalty_payments')).results as PaymentRecord[];
    const former = (await queryAll(env, 'SELECT address FROM audionaut_royalty_scans')).results as { address: string }[];
    const payers = payerAddresses(JSON.parse(state.payers_json));
    const addresses = [...new Set([...payers, ...live.artists.map(a => a.address), ...records.map(r => r.recipient), ...former.map(s => s.address)].filter((a): a is string => Boolean(a)))];
    let pages = 0, imported = 0, incomplete = 0;
    const errors: string[] = live.artists.filter(a => a.error).map(a => `${a.artist}: ${a.error}`);
    if (live.minted.length) for (const address of addresses) {
      try {
        let scan = (await queryAll(env, 'SELECT * FROM audionaut_royalty_scans WHERE address=?', [address])).results?.[0] as any;
        if (scan) {
          try { await deps.canonical(env, scan.until_height, scan.until_hash); }
          catch { scan = null; } // Rewind all evidence on a changed canonical anchor.
        }
        if (!scan || (scan.complete && scan.until_height < live.blockHeight)) {
          scan = { until_height: live.blockHeight, until_hash: await deps.block(env, live.blockHeight),
            floor_height: scan ? Math.max(earliest, scan.until_height - 12) : earliest, scan_offset: 0, complete: 0 };
        }
        // Inspect the newest page while an older pinned backfill continues, so
        // recent labelled payments don't wait for a busy wallet's full history.
        const ranges = !scan.complete && scan.until_height < live.blockHeight
          ? [{ until_height: live.blockHeight, floor_height: Math.max(earliest, scan.until_height - 12), scan_offset: 0, complete: 0, head: true }, scan] : [scan];
        for (const range of ranges) for (let page = 0; page < (range.head ? 1 : 3) && !range.complete; page++) {
          const result = await deps.page(env, address, range.until_height, range.scan_offset); pages++;
          if (!Array.isArray(result.results) || !Number.isSafeInteger(result.total) || result.total < 0 || result.results.length > 50 || (!result.results.length && range.scan_offset < result.total)) throw Error('Incomplete payment history.');
          // The API contract orders newest first. Reject an invalid page rather
          // than advancing the durable cursor past unavailable evidence.
          let previous = Infinity;
          for (const tx of result.results) {
            if (!Number.isSafeInteger(tx.block_height) || tx.block_height > range.until_height || tx.block_height > previous) throw Error('Invalid payment history order.');
            previous = tx.block_height;
            if (tx.block_height < range.floor_height) { range.complete = 1; break; }
            const transfer = tx.token_transfer;
            if (tx.tx_type !== 'token_transfer' || tx.tx_status !== 'success' || tx.canonical !== true || tx.microblock_canonical === false || tx.is_unanchored === true ||
              !transfer || !/^\d+$/.test(String(transfer.amount)) || BigInt(transfer.amount) < BigInt(ROYALTY_MICRO_STX) || BigInt(transfer.amount) > 111n * BigInt(ROYALTY_MICRO_STX) || BigInt(transfer.amount) % BigInt(ROYALTY_MICRO_STX) !== 0n) continue;
            const recipient = transfer.recipient_address;
            if (typeof recipient !== 'string' || networkForAddress(recipient) !== 'mainnet' || recipient.includes('.') || typeof tx.sender_address !== 'string') continue;
            // Payer scans include outgoing transfers; receiver scans include
            // incoming transfers only. Unrelated outgoing activity is ignored.
            if (recipient !== address && tx.sender_address !== address) continue;
            const memo = decodeRoyaltyMemo(transfer.memo), editions = memoEditions(memo);
            const isPayer = payers.includes(tx.sender_address);
            if (!editions && !isPayer) continue;
            const txId = normalizeTxId(tx.tx_id);
            await run(env, `INSERT INTO audionaut_royalty_candidates(tx_id,recipient,sender,amount,memo,editions_json,block_height,note)
              VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(tx_id) DO NOTHING`,
              [txId, recipient, tx.sender_address, String(transfer.amount), memo, editions ? JSON.stringify(editions) : null, tx.block_height,
                editions ? 'Awaiting chain and historical holder verification.' : 'No edition memo. Assign the covered editions before counting this transfer.']);
          }
          range.scan_offset += result.results.length;
          if (range.scan_offset >= result.total) range.complete = 1;
        }
        await deps.canonical(env, scan.until_height, scan.until_hash);
        await run(env, `INSERT INTO audionaut_royalty_scans(address,until_height,until_hash,floor_height,scan_offset,complete) VALUES(?,?,?,?,?,?)
          ON CONFLICT(address) DO UPDATE SET until_height=excluded.until_height,until_hash=excluded.until_hash,floor_height=excluded.floor_height,scan_offset=excluded.scan_offset,complete=excluded.complete`,
          [address, scan.until_height, scan.until_hash, scan.floor_height, scan.scan_offset, scan.complete]);
        if (!scan.complete) incomplete++;
      } catch (error) { errors.push(`${address}: ${error instanceof Error ? error.message : 'Scan failed.'}`); }
    }
    // Retry the oldest-unchecked tagged candidates, including transient failures.
    const pending = (await queryAll(env, `SELECT c.* FROM audionaut_royalty_candidates c WHERE c.editions_json IS NOT NULL
      AND NOT EXISTS(SELECT 1 FROM audionaut_royalty_payments p WHERE p.tx_id=c.tx_id) ORDER BY checked_at,c.block_height,c.tx_id LIMIT 50`)).results as any[];
    for (const candidate of pending) {
      try {
        await deps.verify(env, candidate, live);
        const editions = paymentEditions(JSON.parse(candidate.editions_json));
        await db.batch([
          db.prepare('INSERT INTO audionaut_royalty_payments(tx_id,recipient,editions_json,recorded_by,recorded_at) VALUES(?,?,?,?,?)')
            .bind(candidate.tx_id, candidate.recipient, candidate.editions_json, 'automation:memo', now),
          ...editions.map(edition => db.prepare('INSERT INTO audionaut_royalty_allocations(edition,tx_id) VALUES(?,?)').bind(edition, candidate.tx_id))
        ]); imported++;
        await run(env, 'UPDATE audionaut_royalty_candidates SET note=?,checked_at=? WHERE tx_id=?', ['Automatically verified and recorded.', now, candidate.tx_id]);
      } catch (error) {
        await run(env, 'UPDATE audionaut_royalty_candidates SET note=?,checked_at=? WHERE tx_id=?',
          [/unique|constraint/i.test(String(error)) ? 'A covered edition already has a receipt; this transfer needs review.' : error instanceof Error ? error.message.slice(0, 500) : 'Could not verify transfer.', now, candidate.tx_id]);
      }
    }
    await reconcileRoyaltyIntents(env, live, { transaction: (env, id) => fetchPaymentTransaction(env, id, chainFetch), verify: (env, record, live) => deps.verify(env, record, live) });
    const all = (await queryAll(env, 'SELECT tx_id,recipient,editions_json FROM audionaut_royalty_payments')).results as PaymentRecord[];
    const rows = await deps.rows(env, live, all);
    const summary = { minted: rows.length, paid: rows.filter(r => r.status === 'paid' || r.status === 'retained').length, unverified: rows.filter(r => r.status === 'unverified').length,
      imported, pages, incomplete, monitoredAddresses: addresses.length };
    await run(env, 'UPDATE audionaut_royalty_automation SET lease_until=0,checked_at=?,block_height=?,summary_json=?,error=? WHERE id=1',
      [now, live.blockHeight, JSON.stringify(summary), errors.length ? errors.join(' ').slice(0, 2000) : null]);
    return { ...summary, errors };
  } catch (error) {
    await run(env, 'UPDATE audionaut_royalty_automation SET lease_until=0,error=? WHERE id=1', [error instanceof Error ? error.message.slice(0, 2000) : 'Background verification failed.']);
    throw error;
  }
}
