import { jsonResponse } from '../lib/utils';
import { readCreatorSession } from '../lib/creator-auth';
import { queryAll, type Env } from '../lib/db';
import { readRoyaltySnapshot, royaltyRows, normalizeTxId, paymentEditions, verifyRoyaltyPayment, type Snapshot, type PaymentRecord } from '../lib/audionaut-royalties';

const PRIVATE = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };
// Shared chain-only snapshot; never cache a viewer's session or ledger response.
let cached: { until: number; snapshot: Snapshot } | null = null;
async function snapshot(env: Env) {
  if (cached && Date.now() < cached.until) return cached.snapshot;
  const value = await readRoyaltySnapshot(env);
  cached = { until: Date.now() + 60_000, snapshot: value };
  return value;
}
export type RoyaltyDependencies = {
  session: typeof readCreatorSession;
  snapshot: (env: Env) => Promise<Snapshot>;
  rows: typeof royaltyRows;
  verify: typeof verifyRoyaltyPayment;
  transaction: (env: Env, txId: string) => Promise<any>;
};
import { fetchPaymentTransaction } from '../lib/audionaut-royalties';
const defaults: RoyaltyDependencies = { session: readCreatorSession, snapshot, rows: royaltyRows, verify: verifyRoyaltyPayment, transaction: fetchPaymentTransaction };

export async function handleRoyalties(request: Request, env: Env, deps: RoyaltyDependencies = defaults) {
  const reply = (body: unknown, status = 200) => jsonResponse(body, status, PRIVATE);
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'Method not allowed.' }, 405);
  if (request.method === 'POST' && request.headers.get('origin') !== new URL(request.url).origin)
    return reply({ error: 'Open the ledger on Xtrata to record a payment.' }, 403);
  try {
    // Deliberately strict even when collection-studio authorization is off/log.
    const auth = await deps.session(request, env);
    if (!auth.ok) return reply({ error: 'Sign-in is temporarily unavailable.' }, 503);
    if (!auth.session) return reply({ error: 'Sign in with an artist receiving wallet.' }, 401);
    if (request.method === 'POST' && !auth.session.admin) return reply({ error: 'Only an Xtrata admin can record a receipt.' }, 403);
    const live = await deps.snapshot(env);
    if (!auth.session.admin && !live.artists.some(a => a.address === auth.session!.address)) {
      if (live.artists.some(a => a.error)) return reply({ error: 'Could not verify all receiving addresses. Try again shortly.' }, 503);
      return reply({ error: 'This wallet does not hold an artist’s receiving song.' }, 403);
    }
    const records = await queryAll(env, 'SELECT tx_id, recipient, editions_json FROM audionaut_royalty_payments ORDER BY recorded_at DESC');
    if (request.method === 'GET') {
      return reply({ address: auth.session.address, admin: auth.session.admin, checkedAt: live.checkedAt,
        blockHeight: live.blockHeight, artists: live.artists, rows: await deps.rows(env, live, (records.results ?? []) as PaymentRecord[]) });
    }
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'JSON required.' }, 400);
    const text = await request.text();
    if (text.length > 4096) return reply({ error: 'Receipt request is too large.' }, 413);
    const body = JSON.parse(text);
    const txId = normalizeTxId(body.txId), editions = paymentEditions(body.editions);
    const selected = editions.map(e => live.minted.find(m => m.edition === e));
    if (selected.some(m => !m)) return reply({ error: 'Only minted editions can have a receipt.' }, 400);
    // Recipient is not trusted from the browser. Read it from the transfer; verify
    // against each artist's historical receiving-song owner inside verify().
    const tx = await deps.transaction(env, txId);
    const record = { tx_id: txId, recipient: String(tx?.token_transfer?.recipient_address ?? ''), editions_json: JSON.stringify(editions) };
    const proof = await deps.verify(env, record, live, undefined, async () => tx);
    const db = env.DB ?? env.D1 ?? env.db;
    if (!db) return reply({ error: 'Receipt storage is unavailable.' }, 503);
    try {
      // D1 batch is atomic. A transaction and an edition can each be allocated
      // only once, including concurrent requests or transfers covering a batch.
      await db.batch([
        db.prepare('INSERT INTO audionaut_royalty_payments(tx_id,recipient,editions_json,recorded_by,recorded_at) VALUES(?,?,?,?,?)')
          .bind(txId, proof.recipient, record.editions_json, auth.session.address, Date.now()),
        ...editions.map(edition => db.prepare('INSERT INTO audionaut_royalty_allocations(edition,tx_id) VALUES(?,?)').bind(edition, txId))
      ]);
    } catch (error) {
      if (/unique|constraint/i.test(String(error))) return reply({ error: 'This transaction or an edition already has a receipt. Nothing was changed.' }, 409);
      throw error;
    }
    return reply({ ok: true, txId, editions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load the royalty ledger.';
    if (/no such table|D1 binding/i.test(message)) return reply({ error: 'Royalty ledger storage is not installed yet. Apply the royalty migration.' }, 503);
    return reply({ error: message }, request.method === 'POST' ? 400 : 503);
  }
}
export const onRequest: PagesFunction = ({ request, env }) => handleRoyalties(request, env);
