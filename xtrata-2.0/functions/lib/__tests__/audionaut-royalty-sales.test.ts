import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { uintCV, serializeCV } from '@stacks/transactions';
import { bytesToHex } from '@noble/hashes/utils';
import { readAudionautSale } from '../audionaut-royalty-sales';
import { CORE_ASSET_ID, COLLECTION_CONTRACT_ID } from '../../../src/audionaut/core';
import { XTRATA_OWNER_ADDRESS as admin } from '../creator-auth';
import { memoryDb, sqliteAvailable } from './storage/fixtures';
const txId = '0x' + 'a'.repeat(64), indexHash = '0x' + 'b'.repeat(64), physicalHash = '0x' + 'c'.repeat(64), buyer = 'BUYER';
const nft = (id: number, index: number) => ({ event_index: index, event_type: 'non_fungible_token_asset', asset: { asset_event_type: 'mint', asset_id: CORE_ASSET_ID, value: { hex: '0x' + bytesToHex(serializeCV(uintCV(id))) } } });
const transfer = (amount: string, index: number) => ({ event_index: index, event_type: 'stx_asset', asset: { asset_event_type: 'transfer', sender: buyer, recipient: admin, amount } });
function fixture() {
  const DB = memoryDb(); DB.sqlite.exec(readFileSync(new URL('../../migrations/025_audionaut_royalty_admin.sql', import.meta.url), 'utf8'));
  const tx = { tx_id: txId, tx_status: 'success', canonical: true, tx_type: 'contract_call', block_height: 100, block_hash: physicalHash,
    sender_address: buyer, contract_call: { contract_id: COLLECTION_CONTRACT_ID }, events: [transfer('10000000', 0), nft(3100,1), transfer('6000000',2)], event_count: 3 };
  const fetcher = vi.fn(async (input: any) => {
    const url = String(input);
    if (url.includes('/history')) return Response.json({ results: [{ sender: null, transaction: { tx_id: txId }, block: { height: 100, index_hash: indexHash, hash: physicalHash } }], cursor: { next: null } });
    if (url.includes('/block/by_height/')) return Response.json({ height: 100, canonical: true, index_block_hash: indexHash });
    return Response.json(tx);
  });
  return { env: { DB } as any, tx, fetcher, row: { tokenId: 3100, mintedAt: 100 } as any, live: { blockHeight: 120 } as any };
}
describe.skipIf(!sqliteAvailable)('Xtrata retained royalty sale proof', () => {
  it('uses collection-sale income, caches the receipt and rechecks its canonical block', async () => {
    const f = fixture(); expect(await readAudionautSale(f.env, f.row, f.live, f.fetcher)).toEqual({ txId, amountMicroStx: '6000000' });
    const before = f.fetcher.mock.calls.length;
    await readAudionautSale(f.env, f.row, f.live, f.fetcher);
    expect(f.fetcher.mock.calls.length).toBe(before + 1); expect(String(f.fetcher.mock.calls.at(-1)?.[0])).toContain('/block/by_height/100');
  });
  it.each(['protocol-only','wrong-token','wrong-contract','unconfirmed','reorg','partial-events','batch-underpayment'])('refuses %s as sale proof', async invalid => {
    const f = fixture();
    if (invalid === 'protocol-only') f.tx.events = [transfer('10000000',0),nft(3100,1)];
    if (invalid === 'wrong-token') f.tx.events[1] = nft(3101,1);
    if (invalid === 'wrong-contract') f.tx.contract_call.contract_id = 'another.contract';
    if (invalid === 'unconfirmed') f.tx.block_height = 125;
    if (invalid === 'reorg') f.tx.canonical = false;
    if (invalid === 'partial-events') f.tx.event_count = 1001;
    if (invalid === 'batch-underpayment') f.tx.events = [nft(3100,0),nft(3101,1),transfer('6000000',2)];
    if (invalid !== 'partial-events') f.tx.event_count = f.tx.events.length;
    await expect(readAudionautSale(f.env,f.row,f.live,f.fetcher)).rejects.toThrow();
    expect(f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_sales').get().n).toBe(0);
  });
});
