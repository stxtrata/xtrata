import { describe, expect, it } from 'vitest';
import { fixture, sqliteAvailable, COLLECTION } from './storage/fixtures';
import { newWallet, signIn, withCreatorTables } from './creator-auth.test';
import { onRequest as collectionRoute } from '../../collections/[collectionId]';
import { onRequest as listRoute } from '../../collections';
import { onRequest as reserveRoute } from '../../collections/[collectionId]/reserve';
import { standardLaunchBlocker } from '../../collections/[collectionId]/publish';
import { computeInventoryDigest } from '../../../src/manage/lib/inventory-registration';

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);

async function setup() {
  const f = withCreatorTables(await fixture());
  const owner = newWallet(); const stranger = newWallet();
  f.env.ARTIST_ALLOWLIST = `${owner.address},${stranger.address}`;
  f.DB.sqlite.prepare('UPDATE collections SET artist_address=?, slug=? WHERE id=?').run(owner.address, 'coll-a', COLLECTION);
  return { f, owner, stranger, ownerCookie: await signIn(f.env, owner), strangerCookie: await signIn(f.env, stranger) };
}
const patch = (env: any, body: unknown, cookie?: string) => collectionRoute({ env, params: { collectionId: COLLECTION },
  request: new Request(`https://xtrata.xyz/collections/${COLLECTION}`, { method: 'PATCH',
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) }) } as any);

describe.skipIf(!sqliteAvailable)('collection write protection', () => {
  it('PATCH can never publish, and in enforce mode only the owner may edit', async () => {
    const { f, ownerCookie, strangerCookie } = await setup();
    expect((await patch(f.env, { state: 'published' }, ownerCookie)).status).toBe(400);
    f.env.CREATOR_AUTH_MODE = 'enforce';
    expect((await patch(f.env, { displayName: 'x' })).status).toBe(401);
    expect((await patch(f.env, { displayName: 'x' }, strangerCookie)).status).toBe(403);
    expect((await patch(f.env, { displayName: 'Mine' }, ownerCookie)).status).toBe(200);
  });

  it('creators cannot reset the one-time file extension counter', async () => {
    const { f, ownerCookie } = await setup();
    f.DB.sqlite.prepare('UPDATE collections SET metadata=? WHERE id=?').run(JSON.stringify({ assetRetention: { extensions: 1 } }), COLLECTION);
    await patch(f.env, { metadata: { assetRetention: { extensions: 0 }, note: 'x' } }, ownerCookie);
    const metadata = JSON.parse(f.DB.sqlite.prepare('SELECT metadata FROM collections WHERE id=?').get(COLLECTION).metadata);
    expect(metadata).toMatchObject({ assetRetention: { extensions: 1 }, note: 'x' });
  });

  it('enforce mode hides drafts from everyone but their creator', async () => {
    const { f, owner, ownerCookie, strangerCookie } = await setup();
    f.env.CREATOR_AUTH_MODE = 'enforce';
    const list = async (cookie?: string) => (await (await listRoute({ env: f.env,
      request: new Request('https://xtrata.xyz/collections', { headers: cookie ? { cookie } : {} }) } as any)).json()) as any[];
    expect((await list(ownerCookie)).map(c => c.id)).toContain(COLLECTION);
    expect((await list(strangerCookie)).map(c => c.id)).not.toContain(COLLECTION);
    expect((await list()).length).toBe(0);
    const get = await collectionRoute({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request(`https://xtrata.xyz/collections/${COLLECTION}`, { headers: { cookie: strangerCookie } }) } as any);
    expect(get.status).toBe(404);
    expect(owner.address).toBeTruthy();
  });

  it('a signed-in creator always creates drafts as themselves', async () => {
    const { f, owner, ownerCookie, stranger } = await setup();
    const response = await listRoute({ env: f.env, request: new Request('https://xtrata.xyz/collections', { method: 'POST',
      headers: { 'content-type': 'application/json', cookie: ownerCookie },
      body: JSON.stringify({ artistAddress: stranger.address, slug: 'new-draft', displayName: 'New' }) }) } as any);
    expect(response.status).toBe(201);
    expect(((await response.json()) as any).artist_address).toBe(owner.address);
  });

  it('reservations: cancel needs the reservation token or the collection owner', async () => {
    const { f, ownerCookie, strangerCookie } = await setup();
    f.env.CREATOR_AUTH_MODE = 'enforce';
    f.DB.sqlite.prepare("INSERT INTO assets (asset_id, collection_id, storage_key, expected_hash, total_bytes, total_chunks, mime_type, state) VALUES ('as1', ?, 'k1', ?, 1, 1, 'text/plain', 'draft')").run(COLLECTION, HASH_A);
    const call = (method: string, body?: unknown, cookie?: string) => reserveRoute({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request(`https://xtrata.xyz/collections/${COLLECTION}/reserve`, { method,
        headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined }) } as any);
    const created = await (await call('POST', { assetId: 'as1', buyerAddress: 'SP000', hashHex: HASH_A })).json() as any;
    expect(created.reservationToken).toMatch(/^[a-f0-9]{64}$/);
    expect(created.token_hash).toBeUndefined();
    expect((await call('PATCH', { reservationId: created.reservation_id, action: 'cancel' }, strangerCookie)).status).toBe(403);
    expect((await call('PATCH', { reservationId: created.reservation_id, action: 'cancel', reservationToken: created.reservationToken })).status).toBe(200);
    expect((await call('PATCH', { reservationId: created.reservation_id, action: 'release' }, ownerCookie)).status).toBe(200);
    expect((await call('GET', undefined, strangerCookie)).status).toBe(404);
  });
});

describe.skipIf(!sqliteAvailable)('server-side launch checks (v1.5+)', () => {
  const fetchSupply = (value: bigint | 'fail') => (async () => value === 'fail'
    ? new Response('busy', { status: 503 })
    : Response.json({ okay: true, result: `0x01${value.toString(16).padStart(32, '0')}` })) as unknown as typeof fetch;

  it('requires current registration and an on-chain max supply', async () => {
    const f = await fixture();
    const collection = { id: COLLECTION, contract_address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' };
    const metadata: Record<string, unknown> = { templateVersion: 'xtrata-collection-mint-v1.6', contractName: 'xtrata-collection-a' };
    for (const [id, hash] of [['a1', HASH_A], ['a2', HASH_B]])
      f.DB.sqlite.prepare("INSERT INTO assets (asset_id, collection_id, storage_key, expected_hash, total_bytes, total_chunks, mime_type, state) VALUES (?, ?, ?, ?, 1, 1, 'text/plain', 'draft')").run(id, COLLECTION, id, hash);
    expect(await standardLaunchBlocker(f.env, COLLECTION, collection, metadata, fetchSupply(10n))).toMatch(/Register every uploaded file/);
    metadata.inventoryRegistration = { version: 1, contractId: `${collection.contract_address}.xtrata-collection-a`, hashCount: 2,
      digest: await computeInventoryDigest([HASH_A, HASH_B]), verifiedAt: new Date().toISOString() };
    expect(await standardLaunchBlocker(f.env, COLLECTION, collection, metadata, fetchSupply(0n))).toMatch(/max supply/);
    expect(await standardLaunchBlocker(f.env, COLLECTION, collection, metadata, fetchSupply('fail'))).toMatch(/Could not read your contract/);
    expect(await standardLaunchBlocker(f.env, COLLECTION, collection, metadata, fetchSupply(2n))).toBeNull();
    expect(await standardLaunchBlocker(f.env, COLLECTION, collection, { templateVersion: 'xtrata-collection-mint-v1.4' })).toBeNull();
  });
});

describe.skipIf(!sqliteAvailable)('review fixes', () => {
  it('never deletes a collection that has a contract, even if the chain cannot be read', async () => {
    const { f, ownerCookie } = await setup();
    delete f.env.COLLECTION_STORAGE_V2; // reviewed storage disables deletes outright; test the legacy path
    f.DB.sqlite.prepare("UPDATE collections SET state='archived', contract_address='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' WHERE id=?").run(COLLECTION);
    const response = await collectionRoute({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request(`https://xtrata.xyz/collections/${COLLECTION}`, { method: 'DELETE', headers: { cookie: ownerCookie } }) } as any);
    expect(response.status).toBe(400);
    expect(((await response.json()) as any).error).toMatch(/deployed contract/);
  });

  it('says "could not check" (503) instead of hiding drafts when the session store fails', async () => {
    const { f, ownerCookie } = await setup();
    f.env.CREATOR_AUTH_MODE = 'enforce';
    f.DB.sqlite.exec('DROP TABLE creator_sessions');
    const get = await collectionRoute({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request(`https://xtrata.xyz/collections/${COLLECTION}`, { headers: { cookie: ownerCookie } }) } as any);
    expect(get.status).toBe(503);
    const list = await listRoute({ env: f.env, request: new Request('https://xtrata.xyz/collections', { headers: { cookie: ownerCookie } }) } as any);
    expect(list.status).toBe(503);
  });
});
