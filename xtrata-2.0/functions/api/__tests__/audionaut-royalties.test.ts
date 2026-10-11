import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { handleRoyalties, type RoyaltyDependencies } from '../audionaut-royalties';
import { catalogue, type Snapshot } from '../../lib/audionaut-royalties';
import { memoryDb, sqliteAvailable } from '../../lib/__tests__/storage/fixtures';
const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', TX = '0x' + 'a'.repeat(64);
const snapshot: Snapshot = { checkedAt: 1, blockHeight: 120,
  minted: [catalogue.editions[0], catalogue.editions[11]].map(e => ({ ...e, tokenId: e.edition + 3100, mintedAt: 100 })),
  artists: catalogue.artists.map(a => ({ ...a, address: ADDRESS, error: null })) };
function dependencies(session: any = { address: ADDRESS, admin: false }): RoyaltyDependencies {
  return { session: vi.fn(async () => ({ ok: true, session })), snapshot: vi.fn(async () => snapshot),
    rows: vi.fn(async () => []), verify: vi.fn(async () => ({ editions: [1], txId: TX, recipient: ADDRESS, blockHeight: 110, blockHash: '0x' + 'b'.repeat(64) })),
    transaction: vi.fn(async () => ({ token_transfer: { recipient_address: ADDRESS } })) };
}
const get = () => new Request('https://xtrata.xyz/api/audionaut-royalties');
const post = (editions = [1], txId = TX, origin = 'https://xtrata.xyz') => new Request(get().url, { method: 'POST',
  headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ txId, editions }) });
describe('private royalty access', () => {
  it.each(['off', 'log', 'enforce'])('denies signed-out viewers even with auth mode %s', async mode => {
    const deps = dependencies(null);
    const response = await handleRoyalties(get(), { CREATOR_AUTH_MODE: mode }, deps);
    expect(response.status).toBe(401); expect(deps.snapshot).not.toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });
  it('denies a nonreceiving wallet and refuses failures to check ownership', async () => {
    const deps = dependencies({ address: 'STRANGER', admin: false });
    expect((await handleRoyalties(get(), {}, deps)).status).toBe(403);
    deps.snapshot = async () => ({ ...snapshot, artists: snapshot.artists.map(a => ({ ...a, address: null, error: 'offline' })) });
    expect((await handleRoyalties(get(), {}, deps)).status).toBe(503);
  });
  it('denies receipt writes to recipients and cross-origin admin requests', async () => {
    expect((await handleRoyalties(post(), {}, dependencies())).status).toBe(403);
    expect((await handleRoyalties(post([1], TX, 'https://elsewhere.example'), {}, dependencies({ address: ADDRESS, admin: true }))).status).toBe(403);
  });
});
describe.skipIf(!sqliteAvailable)('durable receipt allocations', () => {
  function fixture() {
    const DB = memoryDb();
    DB.sqlite.exec(readFileSync(new URL('../../migrations/023_audionaut_royalties.sql', import.meta.url), 'utf8'));
    return { DB } as any;
  }
  it('lets a receiving holder view the complete ledger', async () => {
    const deps = dependencies(), response = await handleRoyalties(get(), fixture(), deps);
    expect(response.status).toBe(200); expect(deps.rows).toHaveBeenCalled();
    expect((await response.json()).artists).toHaveLength(10);
  });
  it('records once and refuses tx reuse, edition reuse and unminted claims atomically', async () => {
    const env = fixture(), deps = dependencies({ address: ADDRESS, admin: true });
    expect((await handleRoyalties(post(), env, deps)).status).toBe(200);
    expect((await handleRoyalties(post([12]), env, deps)).status).toBe(409);
    expect((await handleRoyalties(post([1], '0x' + 'c'.repeat(64)), env, deps)).status).toBe(409);
    expect((await handleRoyalties(post([99]), env, deps)).status).toBe(400);
    expect(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_payments').get().n).toBe(1);
    expect(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_allocations').get().n).toBe(1);
  });
  it('stores nothing after a verification failure', async () => {
    const env = fixture(), deps = dependencies({ address: ADDRESS, admin: true });
    deps.verify = async () => { throw Error('Wrong recipient'); };
    expect((await handleRoyalties(post(), env, deps)).status).toBe(400);
    expect(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_payments').get().n).toBe(0);
  });
});
