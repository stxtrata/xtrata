import { XTRATA_OWNER_ADDRESS } from './creator-auth';
import { normalizeTxId, ROYALTY_MICRO_STX, type RoyaltyRow, type Snapshot } from './audionaut-royalties';
import { queryAll, run, type Env } from './db';
import type { RoyaltyDependencies } from '../api/audionaut-royalties';

export type RoyaltyIntent = { id: string; edition: number; recipient: string; sender: string; tx_id: string | null;
  state: 'awaiting-wallet' | 'submitted' | 'confirmed' | 'cancelled' | 'failed'; note: string; created_at: number; updated_at: number };
export const royaltyMemo = (edition: number) => `audionaut:${edition}`;
const dbFor = (env: Env) => {
  const db = env.DB ?? env.D1 ?? env.db;
  if (!db) throw Error('Royalty storage is unavailable.');
  return db;
};
export async function royaltyIntents(env: Env) {
  return (await queryAll(env, 'SELECT * FROM audionaut_royalty_intents ORDER BY created_at DESC,id DESC')).results as RoyaltyIntent[];
}
export async function prepareRoyaltyPayment(env: Env, address: string, row: RoyaltyRow | undefined) {
  if (address !== XTRATA_OWNER_ADDRESS) throw Error('Only the Xtrata canary wallet can send royalties here.');
  if (!row || row.status !== 'unrecorded' || !row.receivingAddress || row.receivingAddress === XTRATA_OWNER_ADDRESS)
    throw Error('Only an unsettled minted edition with a verified external receiving wallet can be paid.');
  const id = crypto.randomUUID(), now = Date.now();
  try {
    const result = await run(env, `INSERT INTO audionaut_royalty_intents(id,edition,recipient,sender,state,created_at,updated_at)
      SELECT ?,?,?,?,'awaiting-wallet',?,? WHERE NOT EXISTS(SELECT 1 FROM audionaut_royalty_allocations WHERE edition=?)`,
      [id, row.edition, row.receivingAddress, address, now, now, row.edition]);
    if (Number(result.meta?.changes) !== 1) throw Error('This edition already has a receipt. Refresh the ledger.');
  } catch (error) {
    if (/unique|constraint/i.test(String(error))) throw Error('This edition already has a payment in progress. Refresh the ledger.');
    throw error;
  }
  return { id, edition: row.edition, recipient: row.receivingAddress, sender: address,
    amountMicroStx: ROYALTY_MICRO_STX, memo: royaltyMemo(row.edition), state: 'awaiting-wallet' };
}
export async function updateRoyaltyIntent(env: Env, address: string, body: any) {
  if (address !== XTRATA_OWNER_ADDRESS) throw Error('Only the Xtrata canary wallet can update payment attempts.');
  if (typeof body.intentId !== 'string' || body.intentId.length > 100) throw Error('Invalid payment attempt.');
  const intent = (await queryAll(env, 'SELECT * FROM audionaut_royalty_intents WHERE id=? AND sender=?', [body.intentId, address])).results?.[0] as RoyaltyIntent | undefined;
  if (!intent) throw Error('Payment attempt not found.');
  if (body.action === 'submitted') {
    const txId = normalizeTxId(body.txId);
    if (intent.tx_id === txId) return { ok: true, txId };
    if (intent.state !== 'awaiting-wallet' || intent.tx_id) throw Error('This payment attempt already has a wallet result.');
    const result = await run(env, `UPDATE audionaut_royalty_intents SET tx_id=?,state='submitted',note=?,updated_at=? WHERE id=? AND state='awaiting-wallet' AND tx_id IS NULL`,
      [txId, 'Submitted. Waiting for confirmed chain and receiving-holder verification.', Date.now(), intent.id]);
    if (Number(result.meta?.changes) !== 1) throw Error('Payment attempt changed. Refresh the ledger.');
    return { ok: true, txId };
  }
  // This action is used only for an explicit wallet cancellation. Ambiguous
  // errors leave the reservation intact and require the existing tx ID.
  if (body.action !== 'cancel' || intent.state !== 'awaiting-wallet' || intent.tx_id) throw Error('A submitted payment cannot be cancelled here.');
  const cancelled = await run(env, `UPDATE audionaut_royalty_intents SET state='cancelled',note=?,updated_at=? WHERE id=? AND state='awaiting-wallet' AND tx_id IS NULL`,
    ['Wallet approval was cancelled. No transaction ID was returned.', Date.now(), intent.id]);
  if (Number(cancelled.meta?.changes) !== 1) throw Error('Payment attempt changed. Refresh the ledger.');
  return { ok: true };
}

/** Read-only chain verification plus receipt bookkeeping; never signs or sends. */
export async function reconcileRoyaltyIntents(env: Env, live: Snapshot,
  deps: { transaction: RoyaltyDependencies['transaction']; verify: (...args: Parameters<RoyaltyDependencies['verify']>) => Promise<unknown> }) {
  const intents = (await royaltyIntents(env)).filter(intent => intent.state === 'submitted' && intent.tx_id).sort((a, b) => a.updated_at - b.updated_at).slice(0, 20);
  for (const intent of intents) {
    try {
      const existing = (await queryAll(env, 'SELECT tx_id FROM audionaut_royalty_allocations WHERE edition=?', [intent.edition])).results?.[0] as any;
      if (existing && existing.tx_id !== intent.tx_id) throw Error('This edition has another receipt. Review the transfer before doing anything else.');
      const tx = await deps.transaction(env, intent.tx_id!);
      const memo = tx.token_transfer?.memo;
      const memoText = typeof memo === 'string' && /^0x(?:[a-f0-9]{2}){0,34}$/i.test(memo)
        ? new TextDecoder().decode(Uint8Array.from(memo.slice(2).match(/../g) ?? [], byte => parseInt(byte, 16))).replace(/\0+$/, '') : '';
      if (tx.sender_address !== XTRATA_OWNER_ADDRESS || tx.tx_type !== 'token_transfer' || tx.token_transfer?.recipient_address !== intent.recipient ||
          String(tx.token_transfer?.amount) !== String(ROYALTY_MICRO_STX) || memoText !== royaltyMemo(intent.edition)) throw Error('The transfer does not match this reserved royalty.');
      if (/^abort_by_/.test(tx.tx_status ?? '') && tx.canonical === true && tx.is_unanchored !== true && Number.isSafeInteger(tx.block_height) && tx.block_height >= (live.minted.find(row => row.edition === intent.edition)?.mintedAt ?? Infinity) && tx.block_height <= live.blockHeight) {
        await run(env, `UPDATE audionaut_royalty_intents SET state='failed',note=?,updated_at=? WHERE id=?`, ['Transaction aborted on-chain; the royalty was not sent.', Date.now(), intent.id]);
        continue;
      }
      if (tx.sender_address !== XTRATA_OWNER_ADDRESS) throw Error('Payment sender is not the Xtrata canary wallet.');
      const record = { tx_id: intent.tx_id!, recipient: intent.recipient, editions_json: JSON.stringify([intent.edition]) };
      await deps.verify(env, record, live, undefined, async () => tx);
      if (!existing) {
        await dbFor(env).batch([
          dbFor(env).prepare('INSERT INTO audionaut_royalty_payments(tx_id,recipient,editions_json,recorded_by,recorded_at) VALUES(?,?,?,?,?)')
            .bind(intent.tx_id, intent.recipient, record.editions_json, XTRATA_OWNER_ADDRESS, Date.now()),
          dbFor(env).prepare('INSERT INTO audionaut_royalty_allocations(edition,tx_id) VALUES(?,?)').bind(intent.edition, intent.tx_id)
        ]);
      }
      await run(env, `UPDATE audionaut_royalty_intents SET state='confirmed',note=?,updated_at=? WHERE id=?`, ['Confirmed transfer and historical receiving holder verified.', Date.now(), intent.id]);
    } catch (error) {
      await run(env, 'UPDATE audionaut_royalty_intents SET note=?,updated_at=? WHERE id=?',
        [error instanceof Error ? error.message.slice(0, 500) : 'Could not verify payment yet.', Date.now(), intent.id]);
    }
  }
}
