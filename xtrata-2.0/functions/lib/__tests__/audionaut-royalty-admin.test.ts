import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { memoryDb, sqliteAvailable } from './storage/fixtures';
import { prepareRoyaltyPayment, updateRoyaltyIntent, reconcileRoyaltyIntents, royaltyIntents } from '../audionaut-royalty-admin';
import { XTRATA_OWNER_ADDRESS as admin } from '../creator-auth';
const receiver = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX', txId = '0x' + 'a'.repeat(64);
const row = { edition: 5, status: 'unrecorded', receivingAddress: receiver } as any;
const live = { blockHeight: 120, minted: [{ edition: 5, mintedAt: 100 }] } as any;
function fixture() {
  const DB = memoryDb();
  for (const name of ['023_audionaut_royalties.sql','025_audionaut_royalty_admin.sql']) DB.sqlite.exec(readFileSync(new URL('../../migrations/' + name, import.meta.url), 'utf8'));
  return { DB } as any;
}
const transaction = (patch = {}) => ({ tx_id: txId, sender_address: admin, tx_type: 'token_transfer', tx_status: 'success', canonical: true,
  block_height: 110, token_transfer: { recipient_address: receiver, amount: '5000000', memo: '0x' + Buffer.from('audionaut:5').toString('hex') }, ...patch });
const deps = (tx = transaction()) => ({ transaction: vi.fn(async () => tx), verify: vi.fn(async () => {
  if (tx.tx_status !== 'success' || !tx.canonical) throw Error('Not confirmed'); return {};
}) } as any);
describe.skipIf(!sqliteAvailable)('Xtrata admin royalty attempts', () => {
  it('atomically reserves one active attempt and rejects other wallets or settled rows', async () => {
    const env = fixture(); const results = await Promise.allSettled([prepareRoyaltyPayment(env, admin, row), prepareRoyaltyPayment(env, admin, row)]);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    await expect(prepareRoyaltyPayment(env, receiver, row)).rejects.toThrow('Only the Xtrata');
    await expect(prepareRoyaltyPayment(env, admin, { ...row, status: 'paid' })).rejects.toThrow('unsettled');
    await expect(prepareRoyaltyPayment(env, admin, { ...row, receivingAddress: admin })).rejects.toThrow('unsettled');
  });
  it('records a submitted ID idempotently and does not allow replacing or cancelling it', async () => {
    const env = fixture(), quote = await prepareRoyaltyPayment(env, admin, row);
    const body = { action: 'submitted', intentId: quote.id, txId };
    await updateRoyaltyIntent(env, admin, body); await updateRoyaltyIntent(env, admin, body);
    await expect(updateRoyaltyIntent(env, admin, { ...body, txId: 'b'.repeat(64) })).rejects.toThrow('already');
    await expect(updateRoyaltyIntent(env, admin, { action: 'cancel', intentId: quote.id })).rejects.toThrow('cannot');
    await expect(updateRoyaltyIntent(env, receiver, body)).rejects.toThrow('Only');
    expect((await royaltyIntents(env))[0].state).toBe('submitted');
  });
  it('releases a known cancellation and permits a new attempt', async () => {
    const env = fixture(), quote = await prepareRoyaltyPayment(env, admin, row);
    await updateRoyaltyIntent(env, admin, { action: 'cancel', intentId: quote.id });
    expect((await prepareRoyaltyPayment(env, admin, row)).id).not.toBe(quote.id);
  });
  it('waits for confirmation, records once, and reconciles an existing automatic receipt', async () => {
    const env = fixture(), quote = await prepareRoyaltyPayment(env, admin, row);
    await updateRoyaltyIntent(env, admin, { action: 'submitted', intentId: quote.id, txId });
    await reconcileRoyaltyIntents(env, live, deps(transaction({ tx_status: 'pending' })));
    expect(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_allocations').get().n).toBe(0);
    await reconcileRoyaltyIntents(env, live, deps()); await reconcileRoyaltyIntents(env, live, deps());
    expect((await royaltyIntents(env))[0].state).toBe('confirmed');
    expect(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_allocations').get().n).toBe(1);
    await expect(prepareRoyaltyPayment(env, admin, row)).rejects.toThrow('already has a receipt');
  });
  it.each(['sender','recipient','amount','memo','dropped','reorg'])('keeps %s attempts blocked without declaring them paid', async mismatch => {
    const env = fixture(), quote = await prepareRoyaltyPayment(env, admin, row);
    await updateRoyaltyIntent(env, admin, { action: 'submitted', intentId: quote.id, txId });
    const tx = transaction();
    if (mismatch === 'sender') tx.sender_address = receiver;
    if (mismatch === 'recipient') tx.token_transfer.recipient_address = admin;
    if (mismatch === 'amount') tx.token_transfer.amount = '6000000';
    if (mismatch === 'memo') tx.token_transfer.memo = '';
    if (mismatch === 'dropped') tx.tx_status = 'dropped_replace_by_fee';
    if (mismatch === 'reorg') tx.canonical = false;
    await reconcileRoyaltyIntents(env, live, deps(tx));
    expect((await royaltyIntents(env))[0].state).toBe('submitted');
    expect(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_allocations').get().n).toBe(0);
  });
  it('releases only a confirmed on-chain abort, after the confirmation window', async () => {
    const env = fixture(), quote = await prepareRoyaltyPayment(env, admin, row);
    await updateRoyaltyIntent(env, admin, { action: 'submitted', intentId: quote.id, txId });
    await reconcileRoyaltyIntents(env, live, deps(transaction({ tx_status: 'abort_by_post_condition', block_height: 125 })));
    expect((await royaltyIntents(env))[0].state).toBe('submitted');
    await reconcileRoyaltyIntents(env, live, deps(transaction({ tx_status: 'abort_by_post_condition' })));
    expect((await royaltyIntents(env))[0].state).toBe('failed');
    await prepareRoyaltyPayment(env, admin, row);
  });
});
