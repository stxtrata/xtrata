import { describe, expect, it } from 'vitest';
import { memoryBucket, memoryDb, sqliteAvailable } from './storage/fixtures';
import { hashBytes } from '../collection-storage/common';
import {
  cancelReplacement,
  finishReplacement,
  getReplacementStatus,
  recordReplacementTx,
  ReplacementError,
  startReplacement,
  uploadReplacement,
  type ReplacementChain
} from '../collection-replacement';
import { onRequest } from '../../collections/[collectionId]/replacements';

const COLLECTION = '3c855746-4a78-4064-b4cf-e7487d671469';
const ARTIST = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const TOKEN_URI = 'data:text/plain,collection';
const encode = (text: string) => new TextEncoder().encode(text);
const edition = (n: number, extra = '') => encode(`<!doctype html><title>Audionaut ${String(n).padStart(3, '0')}</title>${extra}`);

/** In-memory stand-in for the helper + core reads (mainnet behaviour, no network). */
function fakeChain() {
  const state = {
    paused: true, finalized: false, fail: false,
    registered: new Map<string, string>(), minted: new Set<string>(), reserved: new Set<string>()
  };
  const guard = async <T>(value: T) => { if (state.fail) throw new Error('Hiro 429'); return value; };
  const chain: ReplacementChain = {
    paused: () => guard(state.paused),
    finalized: () => guard(state.finalized),
    registeredUri: (hash) => guard(state.registered.get(hash) ?? null),
    reserved: (hash) => guard(state.reserved.has(hash)),
    onCore: (hash) => guard(state.minted.has(hash))
  };
  return { state, chain };
}

async function setup(options: { storageV2?: boolean; state?: string } = {}) {
  const DB = memoryDb();
  const COLLECTION_ASSETS = memoryBucket();
  const env: any = { DB, COLLECTION_ASSETS, ...(options.storageV2 ? { COLLECTION_STORAGE_V2: '1' } : {}) };
  DB.sqlite.prepare('INSERT INTO collections (id, slug, artist_address, contract_address, metadata, state, created_at) VALUES (?,?,?,?,?,?,?)').run(
    COLLECTION, 'audionauts-1', ARTIST, ARTIST,
    JSON.stringify({ contractName: 'xtrata-collection-audionauts-1-3c855746', coreContractId: CORE, templateVersion: 'xtrata-collection-mint-v1.7',
      inventoryRegistration: { version: 1, contractId: 'x', hashCount: 111, digest: 'd', verifiedAt: '2026-09-27T00:00:00Z' }, description: 'kept' }),
    options.state ?? 'published', 1);
  const { state, chain } = fakeChain();
  const ids: Record<number, string> = {};
  for (let n = 1; n <= 111; n += 1) {
    const bytes = edition(n);
    const hash = hashBytes(bytes);
    const key = `${COLLECTION}/original-${n}`;
    await COLLECTION_ASSETS.put(key, bytes, { httpMetadata: { contentType: 'text/html' } });
    ids[n] = `asset-${n}`;
    DB.sqlite.prepare(`INSERT INTO assets (asset_id, collection_id, path, filename, mime_type, total_bytes, total_chunks, expected_hash, storage_key, state, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(ids[n], COLLECTION, `${n}.html`, `${n}.html`, 'text/html', bytes.length, 1, hash, key, 'draft', 1, 1);
    state.registered.set(hash, TOKEN_URI);
  }
  const asset = (n: number) => DB.sqlite.prepare('SELECT * FROM assets WHERE asset_id = ?').get(ids[n]) as any;
  const metadata = () => JSON.parse((DB.sqlite.prepare('SELECT metadata FROM collections WHERE id = ?').get(COLLECTION) as any).metadata);
  const activeCount = () => (DB.sqlite.prepare("SELECT COUNT(*) as n FROM assets WHERE collection_id = ? AND state NOT IN ('expired','sold-out')").get(COLLECTION) as any).n;
  return { env, DB, bucket: COLLECTION_ASSETS, state, chain, ids, asset, metadata, activeCount };
}

const revised = (n: number) => edition(n, '<script>/* credit: Χ₮¡₪¢₮ */</script>');
const expectError = async (promise: Promise<unknown>, status: number, text: RegExp) => {
  const error = await promise.then(() => null, (e) => e);
  expect(error).toBeInstanceOf(ReplacementError);
  expect(error.status).toBe(status);
  expect(error.message).toMatch(text);
};

describe.skipIf(!sqliteAvailable)('replacing unminted files in a published collection', () => {
  it.each([[false], [true]])('replaces 84 and 90 in place, guided by the chain (storage v2: %s)', async (storageV2) => {
    const t = await setup({ storageV2 });
    const before84 = t.asset(84);
    const env = t.env;
    const base = { env, collectionId: COLLECTION, chain: t.chain };
    let status = await startReplacement({ ...base, assetIds: [t.ids[90], t.ids[84]], actor: ARTIST });
    expect(status.plan?.step).toBe('upload');
    expect(status.record?.items.map((item) => item.original.tokenUri)).toEqual([TOKEN_URI, TOKEN_URI]);

    await uploadReplacement({ ...base, assetId: t.ids[84], bytes: revised(84), contentType: 'text/html' });
    status = await uploadReplacement({ ...base, assetId: t.ids[90], bytes: revised(90), contentType: 'text/html' });
    expect(status.plan?.step).toBe('register');
    const newHashes = status.plan!.toRegister;
    expect(newHashes.sort()).toEqual([hashBytes(revised(84)), hashBytes(revised(90))].sort());
    await expectError(finishReplacement(base), 409, /Register the new files/);

    // The artist approves set-registered-token-uri-batch; it confirms.
    await recordReplacementTx({ env, collectionId: COLLECTION, kind: 'register', txId: 'a'.repeat(64) });
    for (const hash of newHashes) t.state.registered.set(hash, TOKEN_URI);
    status = await getReplacementStatus(env, COLLECTION, t.chain);
    expect(status.plan?.step).toBe('clear');
    expect(status.plan?.toClear.sort()).toEqual([before84.expected_hash, t.asset(90).expected_hash].sort());
    await expectError(finishReplacement(base), 409, /Remove the old registrations/);

    // The artist approves clear-registered-token-uri for each old file.
    for (const hash of status.plan!.toClear) t.state.registered.delete(hash);
    expect((await getReplacementStatus(env, COLLECTION, t.chain)).plan?.step).toBe('finish');

    status = await finishReplacement(base);
    expect(status.record?.status).toBe('complete');
    const after84 = t.asset(84);
    expect(after84.asset_id).toBe(before84.asset_id);
    expect(after84.path).toBe('84.html');
    expect(after84.expected_hash).toBe(hashBytes(revised(84)));
    expect(after84.storage_key).not.toBe(before84.storage_key);
    expect(t.activeCount()).toBe(111);
    // The original bytes are untouched and recorded for recovery.
    expect(t.bucket.files.get(before84.storage_key)?.bytes).toEqual(edition(84));
    expect(t.bucket.files.has(after84.storage_key)).toBe(true);
    const metadata = t.metadata();
    expect(metadata.inventoryReplacementHistory.at(-1).items.find((item: any) => item.assetId === t.ids[84]).original.storageKey).toBe(before84.storage_key);
    expect(metadata.inventoryRegistration).toBeNull(); // must be checked again before minting reopens
    expect(metadata.description).toBe('kept');
    // Repeating finish (e.g. after a lost response) changes nothing.
    expect((await finishReplacement(base)).record?.status).toBe('complete');
    expect(t.asset(84).expected_hash).toBe(hashBytes(revised(84)));
  });

  it('refuses to start unless the collection is published, paused, not finalized and the files unminted and unreserved', async () => {
    const draft = await setup({ state: 'draft' });
    await expectError(startReplacement({ env: draft.env, collectionId: COLLECTION, chain: draft.chain, assetIds: [draft.ids[84]], actor: null }), 409, /not published/);

    const t = await setup();
    const start = () => startReplacement({ env: t.env, collectionId: COLLECTION, chain: t.chain, assetIds: [t.ids[84], t.ids[90]], actor: null });
    t.state.paused = false;
    await expectError(start(), 409, /Pause minting first/);
    t.state.paused = true;
    t.state.finalized = true;
    await expectError(start(), 409, /finalized/);
    t.state.finalized = false;
    t.state.minted.add(t.asset(84).expected_hash);
    await expectError(start(), 409, /84\.html has already been minted/);
    t.state.minted.clear();
    t.state.reserved.add(t.asset(90).expected_hash);
    await expectError(start(), 409, /90\.html is reserved/);
    t.state.reserved.clear();
    t.state.fail = true;
    await expectError(start(), 503, /Could not read the contract/);
    expect(t.metadata().inventoryReplacement).toBeUndefined(); // a failed read saves nothing
    t.state.fail = false;
    expect((await start()).plan?.step).toBe('upload');
    // Starting again resumes; a different selection is refused while one is open.
    expect((await start()).record?.items).toHaveLength(2);
    await expectError(startReplacement({ env: t.env, collectionId: COLLECTION, chain: t.chain, assetIds: [t.ids[1]], actor: null }), 409, /in progress/);
  });

  it('rejects replacement files that cannot work, and lets a retry upload the same file again', async () => {
    const t = await setup();
    const base = { env: t.env, collectionId: COLLECTION, chain: t.chain };
    await startReplacement({ ...base, assetIds: [t.ids[84], t.ids[90]], actor: null });
    const upload = (n: number, bytes: Uint8Array) => uploadReplacement({ ...base, assetId: t.ids[n], bytes, contentType: 'text/html' });
    await expectError(upload(84, edition(84)), 409, /identical to the current file/);
    await expectError(upload(84, edition(5)), 409, /identical to another file/);
    t.state.minted.add(hashBytes(revised(84)));
    await expectError(upload(84, revised(84)), 409, /already been inscribed/);
    t.state.minted.clear();
    await upload(84, revised(84));
    await upload(84, revised(84)); // retry after an interrupted response
    await expectError(upload(90, revised(84)), 409, /identical to another file/);
    // Once its new hash is registered on-chain, the upload can no longer be swapped for another.
    t.state.registered.set(hashBytes(revised(84)), TOKEN_URI);
    await expectError(upload(84, edition(84, 'other')), 409, /already registered/);
  });

  it('stops if minting reopens mid-replacement, and only cancels before the chain changed', async () => {
    const t = await setup();
    const base = { env: t.env, collectionId: COLLECTION, chain: t.chain };
    await startReplacement({ ...base, assetIds: [t.ids[84]], actor: null });
    await uploadReplacement({ ...base, assetId: t.ids[84], bytes: revised(84), contentType: 'text/html' });
    t.state.registered.set(hashBytes(revised(84)), TOKEN_URI);
    t.state.registered.delete(t.asset(84).expected_hash);
    t.state.paused = false;
    const status = await getReplacementStatus(t.env, COLLECTION, t.chain);
    expect(status.plan?.step).toBe('blocked');
    await expectError(finishReplacement(base), 409, /Pause the collection/);
    expect(t.asset(84).expected_hash).toBe(hashBytes(edition(84)));
    await expectError(cancelReplacement(base), 409, /can no longer be cancelled/);

    const fresh = await setup();
    const freshBase = { env: fresh.env, collectionId: COLLECTION, chain: fresh.chain };
    await startReplacement({ ...freshBase, assetIds: [fresh.ids[84]], actor: null });
    await uploadReplacement({ ...freshBase, assetId: fresh.ids[84], bytes: revised(84), contentType: 'text/html' });
    expect((await cancelReplacement(freshBase)).record?.status).toBe('cancelled');
    expect(fresh.asset(84).expected_hash).toBe(hashBytes(edition(84)));
  });

  it('completes on retry when the final save was interrupted after the files were swapped', async () => {
    const t = await setup();
    const base = { env: t.env, collectionId: COLLECTION, chain: t.chain };
    await startReplacement({ ...base, assetIds: [t.ids[84]], actor: null });
    await uploadReplacement({ ...base, assetId: t.ids[84], bytes: revised(84), contentType: 'text/html' });
    t.state.registered.set(hashBytes(revised(84)), TOKEN_URI);
    t.state.registered.delete(t.asset(84).expected_hash);
    const prepare = t.DB.prepare;
    let failNextMetadataWrite = true;
    t.DB.prepare = (sql: string) => {
      if (failNextMetadataWrite && /^UPDATE collections SET metadata/.test(sql)) { failNextMetadataWrite = false; throw new Error('D1 unavailable'); }
      return prepare(sql);
    };
    await expect(finishReplacement(base)).rejects.toThrow('D1 unavailable');
    expect(t.asset(84).expected_hash).toBe(hashBytes(revised(84))); // rows swapped, record still open
    expect((await finishReplacement(base)).record?.status).toBe('complete');
    expect(t.activeCount()).toBe(111);
  });

  it('serves the status route and refuses unknown actions', async () => {
    const t = await setup();
    const call = (init: RequestInit & { query?: string } = {}) => onRequest({
      request: new Request(`https://xtrata.xyz/collections/${COLLECTION}/replacements${init.query ?? ''}`, init),
      env: { ...t.env, CREATOR_AUTH_MODE: 'off', COLLECTION_CLEANUP_CORES: CORE }, params: { collectionId: COLLECTION }
    } as any);
    // The route reads the real chain; with no network here the read fails closed.
    const unknown = await call({ method: 'POST', body: JSON.stringify({ action: 'drain' }), headers: { 'Content-Type': 'application/json' } });
    expect(unknown.status).toBe(400);
    const missing = await call({ method: 'PUT', body: 'x' });
    expect(missing.status).toBe(400);
  });
});

describe.skipIf(!sqliteAvailable)('registration check after a replacement', () => {
  it('carries a current check over to the new files, so minting can reopen without a full re-check', async () => {
    const { computeInventoryDigest } = await import('../../../src/manage/lib/inventory-registration');
    const t = await setup();
    const helperId = `${ARTIST}.xtrata-collection-audionauts-1-3c855746`;
    const hashes = () => (t.DB.sqlite.prepare('SELECT expected_hash FROM assets WHERE collection_id = ?').all(COLLECTION) as any[]).map(r => r.expected_hash).sort();
    const metadata = t.metadata();
    metadata.inventoryRegistration = { version: 1, contractId: helperId, hashCount: 111, digest: await computeInventoryDigest(hashes()), verifiedAt: '2026-09-30T00:00:00Z' };
    t.DB.sqlite.prepare('UPDATE collections SET metadata = ? WHERE id = ?').run(JSON.stringify(metadata), COLLECTION);
    const base = { env: t.env, collectionId: COLLECTION, chain: t.chain };
    await startReplacement({ ...base, assetIds: [t.ids[84], t.ids[90]], actor: null });
    for (const n of [84, 90]) await uploadReplacement({ ...base, assetId: t.ids[n], bytes: revised(n), contentType: 'text/html' });
    for (const n of [84, 90]) { t.state.registered.set(hashBytes(revised(n)), TOKEN_URI); t.state.registered.delete(hashBytes(edition(n))); }
    const status = await finishReplacement(base);
    expect(status.registrationCarried).toBe(true);
    const record = t.metadata().inventoryRegistration;
    expect(record).toMatchObject({ contractId: helperId, hashCount: 111, digest: await computeInventoryDigest(hashes()) });
  });

  it('does not carry over a stale check (e.g. files changed since it ran)', async () => {
    const t = await setup(); // fixture record is for another digest
    const base = { env: t.env, collectionId: COLLECTION, chain: t.chain };
    await startReplacement({ ...base, assetIds: [t.ids[84]], actor: null });
    await uploadReplacement({ ...base, assetId: t.ids[84], bytes: revised(84), contentType: 'text/html' });
    t.state.registered.set(hashBytes(revised(84)), TOKEN_URI); t.state.registered.delete(hashBytes(edition(84)));
    expect((await finishReplacement(base)).registrationCarried).toBe(false);
    expect(t.metadata().inventoryRegistration).toBeNull();
  });
});

describe.skipIf(!sqliteAvailable)('previewing an uploaded replacement on the server', () => {
  it('serves the uploaded bytes sandboxed before anything goes on-chain; the live asset is unchanged', async () => {
    const { readReplacementPreview } = await import('../collection-replacement');
    const t = await setup();
    const base = { env: t.env, collectionId: COLLECTION, chain: t.chain };
    await startReplacement({ ...base, assetIds: [t.ids[84]], actor: null });
    await expectError(readReplacementPreview(t.env, COLLECTION, t.ids[84]), 404, /No uploaded replacement/);
    await uploadReplacement({ ...base, assetId: t.ids[84], bytes: revised(84), contentType: 'text/html' });
    const preview = await readReplacementPreview(t.env, COLLECTION, t.ids[84]);
    expect(new Uint8Array(await new Response(preview.body).arrayBuffer())).toEqual(revised(84));
    expect(preview.hash).toBe(hashBytes(revised(84)));
    expect(t.asset(84).expected_hash).toBe(hashBytes(edition(84)));

    const response = await onRequest({
      request: new Request(`https://xtrata.xyz/collections/${COLLECTION}/replacements?preview=${t.ids[84]}`),
      env: { ...t.env, CREATOR_AUTH_MODE: 'off' }, params: { collectionId: COLLECTION }
    } as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Security-Policy')).toBe('sandbox allow-scripts');
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(new TextDecoder().decode(await response.arrayBuffer())).toContain('Χ₮¡₪¢₮');
  });
});

describe('reading the chain for a replacement', () => {
  it('parses the helper and core reads, and treats a failed read as a failure', async () => {
    const { makeReplacementChain, resolveReplacementTarget } = await import('../collection-replacement');
    const { boolCV, noneCV, responseOkCV, serializeCV, someCV, standardPrincipalCV, stringAsciiCV, tupleCV, uintCV } = await import('@stacks/transactions');
    const { bytesToHex } = await import('@noble/hashes/utils');
    const hex = (cv: any) => '0x' + bytesToHex(serializeCV(cv));
    const HASH = 'ab'.repeat(32);
    const results: Record<string, any> = {
      'is-paused': responseOkCV(boolCV(true)),
      'get-finalized': responseOkCV(boolCV(false)),
      'get-registered-token-uri': someCV(tupleCV({ 'token-uri': stringAsciiCV(TOKEN_URI) })),
      'get-hash-reservation': someCV(standardPrincipalCV(ARTIST)),
      'get-id-by-hash': noneCV()
    };
    const urls: string[] = [];
    let fail = false;
    const fetcher = (async (url: string) => {
      urls.push(url);
      if (fail) return new Response('busy', { status: 429 });
      const fn = /\/call-read\/[^/]+\/[^/]+\/([^?]+)/.exec(url)![1];
      return Response.json({ okay: true, result: hex(results[fn]) });
    }) as unknown as typeof fetch;
    const collection = { contract_address: ARTIST, metadata: JSON.stringify({ contractName: 'xtrata-collection-audionauts-1-3c855746', coreContractId: CORE }) };
    const target = resolveReplacementTarget({}, collection);
    expect(target).toEqual({ helper: `${ARTIST}.xtrata-collection-audionauts-1-3c855746`, core: CORE, network: 'mainnet' });
    const chain = makeReplacementChain({}, target, fetcher);
    await expect(chain.paused()).resolves.toBe(true);
    await expect(chain.finalized()).resolves.toBe(false);
    await expect(chain.registeredUri(HASH)).resolves.toBe(TOKEN_URI);
    await expect(chain.reserved(HASH)).resolves.toBe(true);
    await expect(chain.onCore(HASH)).resolves.toBe(false);
    results['get-id-by-hash'] = someCV(uintCV(3070));
    await expect(chain.onCore(HASH)).resolves.toBe(true);
    expect(urls[0]).toContain(`/v2/contracts/call-read/${ARTIST}/xtrata-collection-audionauts-1-3c855746/is-paused?tip=latest`);
    fail = true;
    await expect(chain.paused()).rejects.toThrow();
    expect(() => resolveReplacementTarget({}, { ...collection, metadata: JSON.stringify({ contractName: 'x', coreContractId: 'SP000000000000000000002Q6VF78.fake-core' }) })).toThrow(/supported Xtrata core/);
  });
});
