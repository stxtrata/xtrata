import { describe, expect, it } from 'vitest';
import { fixture, sqliteAvailable, COLLECTION, NOW } from './storage/fixtures';
import { onRequest as assetsRoute } from '../../collections/[collectionId]/assets';
import {
  extendDraftAssets,
  isCollectionCommitted,
  retainCommittedAssets,
  summarizeDraftRetention,
  sweepExpiredDraftAssets,
  DRAFT_EXTENSION_MS
} from '../asset-retention';

const DAY = 86400000;
const seed = (f: any, rows: Array<{ id: string; state?: string; expires: number | null }>) => {
  for (const row of rows) {
    f.DB.sqlite.prepare(`INSERT INTO assets (asset_id, collection_id, storage_key, expected_hash, total_bytes, total_chunks, mime_type, state, expires_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, 1, 'image/jpeg', ?, ?, ?, ?)`)
      .run(row.id, COLLECTION, `${COLLECTION}/${row.id}`, 'a'.repeat(64), row.state ?? 'draft', row.expires, NOW - DAY, NOW - DAY);
  }
};
const states = (f: any) => Object.fromEntries(
  f.DB.sqlite.prepare('SELECT asset_id, state, expires_at FROM assets ORDER BY asset_id').all()
    .map((r: any) => [r.asset_id, `${r.state}:${r.expires_at === null ? 'keep' : r.expires_at}`]));

describe('isCollectionCommitted', () => {
  it('treats deployed or published collections as committed', () => {
    expect(isCollectionCommitted({ state: 'draft', contract_address: '' })).toBe(false);
    expect(isCollectionCommitted({ state: 'draft', contract_address: 'SP1.x' })).toBe(true);
    expect(isCollectionCommitted({ state: 'published', contract_address: null })).toBe(true);
    expect(isCollectionCommitted(null)).toBe(false);
  });
});

describe.skipIf(!sqliteAvailable)('asset retention', () => {
  it('never sweeps a committed collection, and sweeps an uncommitted draft', async () => {
    const f = await fixture();
    seed(f, [{ id: 'a', expires: NOW - 1 }]);
    expect(await sweepExpiredDraftAssets(f.env, COLLECTION, { state: 'published', contract_address: '' }, NOW)).toBe(false);
    expect(states(f).a).toBe(`draft:${NOW - 1}`);
    expect(await sweepExpiredDraftAssets(f.env, COLLECTION, { state: 'draft', contract_address: '' }, NOW)).toBe(true);
    expect(states(f).a).toBe(`expired:${NOW - 1}`);
  });

  it('keeps every in-inventory file of a committed collection until minted, but does not resurrect expired rows', async () => {
    const f = await fixture();
    seed(f, [{ id: 'live', expires: NOW + DAY }, { id: 'overdue', expires: NOW - DAY }, { id: 'gone', state: 'expired', expires: NOW - 2 * DAY }]);
    await retainCommittedAssets(f.env, COLLECTION, NOW);
    expect(states(f)).toEqual({ live: 'draft:keep', overdue: 'draft:keep', gone: `expired:${NOW - 2 * DAY}` });
  });

  it('the assets route no longer expires files of a hidden published collection (the Numbers 1–10 bug)', async () => {
    const f = await fixture();
    f.DB.sqlite.prepare("UPDATE collections SET state='published', contract_address='SP1.helper', metadata=? WHERE id=?")
      .run(JSON.stringify({ collectionPage: { showOnPublicPage: false } }), COLLECTION);
    seed(f, [{ id: 'a', expires: Date.now() - DAY }]);
    const response = await assetsRoute({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request('https://local/collections/a/assets') } as any);
    const assets = await response.json() as Array<{ state: string }>;
    expect(assets[0].state).toBe('draft');
  });

  it('extends only live draft files and reports the earliest expiry', async () => {
    const f = await fixture();
    seed(f, [{ id: 'soon', expires: NOW + 3600000 }, { id: 'later', expires: NOW + 2 * DAY }, { id: 'gone', state: 'expired', expires: NOW - DAY }]);
    const before = await summarizeDraftRetention(f.env, COLLECTION, { state: 'draft', contract_address: '', metadata: null }, NOW);
    expect(before).toMatchObject({ committed: false, earliestExpiry: NOW + 3600000, expiringWithin24h: 1, extensionsLeft: 1 });
    const until = await extendDraftAssets(f.env, COLLECTION, NOW);
    expect(until).toBe(NOW + DRAFT_EXTENSION_MS);
    expect(states(f)).toEqual({ soon: `draft:${until}`, later: `draft:${until}`, gone: `expired:${NOW - DAY}` });
    const used = await summarizeDraftRetention(f.env, COLLECTION, { state: 'draft', contract_address: '', metadata: { assetRetention: { extensions: 1 } } }, NOW);
    expect(used.extensionsLeft).toBe(0);
  });
});

describe.skipIf(!sqliteAvailable)('Keep my files route', () => {
  it('extends an undeployed draft once by 14 days, then refuses; refuses committed collections', async () => {
    const { onRequest: retention } = await import('../../collections/[collectionId]/retention');
    const f = await fixture();
    const now = Date.now();
    seed(f, [{ id: 'x', expires: now + DAY }]);
    const post = () => retention({ env: f.env, params: { collectionId: COLLECTION },
      request: new Request('https://xtrata.xyz/collections/a/retention', { method: 'POST' }) } as any);
    const first = await post();
    expect(first.status).toBe(200);
    const body = await first.json() as any;
    expect(body.extensionDays).toBe(14);
    expect(body.extensionsLeft).toBe(0);
    expect(Number(f.DB.sqlite.prepare("SELECT expires_at FROM assets WHERE asset_id='x'").get().expires_at)).toBeGreaterThan(now + 13 * DAY);
    expect((await post()).status).toBe(400);
    f.DB.sqlite.prepare("UPDATE collections SET contract_address='SP1.x', metadata='{}' WHERE id=?").run(COLLECTION);
    expect((await post()).status).toBe(400);
  });
});
