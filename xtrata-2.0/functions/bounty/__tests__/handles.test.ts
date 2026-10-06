// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import * as T from '@stacks/transactions';
import { handleBountyHandles } from '../handles';
import { bountyHandleData, normalizeHandle, verifyBountyHandle } from '../../lib/bounty-handle';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
const keyA = '1'.repeat(64) + '01', keyB = '2'.repeat(64) + '01';
const addrA = T.getAddressFromPrivateKey(keyA, T.TransactionVersion.Mainnet);
const addrB = T.getAddressFromPrivateKey(keyB, T.TransactionVersion.Mainnet);
const now = 1_790_000_000_000;

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('functions/migrations/020_bounty_handles.sql', 'utf8'));
  return {
    prepare(query: string) {
      let args: any[] = [];
      return {
        bind(...v: any[]) { args = v; return this; },
        async first() { return sql.prepare(query).get(...args) || null; },
        async run() { return sql.prepare(query).run(...args); },
        async all() { return { results: sql.prepare(query).all(...args) }; }
      };
    }
  };
}
const sign = (key: string, claim: any) =>
  T.signStructuredData({ ...bountyHandleData(claim), privateKey: T.createStacksPrivateKey(key) }).data;
const post = (env: any, body: any, time = now, origin = 'https://xtrata.xyz') =>
  handleBountyHandles(new Request('https://xtrata.xyz/bounty/handles', {
    method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body)
  }), env, time);
const link = (env: any, key: string, address: string, handle: string, issued = now, time = now) =>
  post(env, { campaign: 'zdao-1', address, handle, issued, signature: sign(key, { campaign: 'zdao-1', address, handle: normalizeHandle(handle), issued }) }, time);
const list = async (env: any) => (await (await handleBountyHandles(new Request('https://xtrata.xyz/bounty/handles?c=zdao-1'), env, now)).json()) as any;

describe('bounty handle proof', () => {
  it('normalises handles and links', () => {
    expect(normalizeHandle('jim')).toBe('@jim');
    expect(normalizeHandle(' @Jim_1 ')).toBe('@Jim_1');
    expect(normalizeHandle('https://x.com/XtrataLayers?s=20')).toBe('@XtrataLayers');
    expect(normalizeHandle('')).toBe('');
    expect(normalizeHandle('has space')).toBeNull();
    expect(normalizeHandle('waytoolonghandlename')).toBeNull();
    expect(normalizeHandle(42)).toBeNull();
  });
  it('verifies only the signing wallet and the exact handle', () => {
    const claim = { campaign: 'zdao-1', address: addrA, handle: '@jim', issued: now };
    const sig = sign(keyA, claim);
    expect(verifyBountyHandle(claim, sig)).toBe(true);
    expect(verifyBountyHandle({ ...claim, handle: '@other' }, sig)).toBe(false);
    expect(verifyBountyHandle({ ...claim, issued: now + 1 }, sig)).toBe(false);
    expect(verifyBountyHandle({ ...claim, campaign: 'zdao-2' }, sig)).toBe(false);
    expect(verifyBountyHandle({ ...claim, address: addrB }, sig)).toBe(false);
    expect(verifyBountyHandle(claim, 'nope')).toBe(false);
  });
});

describe('/bounty/handles', () => {
  it('stores a handle for the signing wallet and lists it', async () => {
    const env = { DB: database() };
    expect(await list(env)).toEqual({ available: true, handles: {} });
    const res = await link(env, keyA, addrA, 'jim');
    expect(res.status).toBe(200);
    expect((await list(env)).handles[addrA]).toEqual({ h: '@jim', t: now });
  });
  it('rejects a signature from another wallet, a changed handle and an expired signature', async () => {
    const env = { DB: database() };
    expect((await post(env, { campaign: 'zdao-1', address: addrA, handle: '@jim', issued: now, signature: sign(keyB, { campaign: 'zdao-1', address: addrA, handle: '@jim', issued: now }) })).status).toBe(403);
    expect((await post(env, { campaign: 'zdao-1', address: addrA, handle: '@evil', issued: now, signature: sign(keyA, { campaign: 'zdao-1', address: addrA, handle: '@jim', issued: now }) })).status).toBe(403);
    expect((await link(env, keyA, addrA, 'jim', now - 11 * 60_000)).status).toBe(400);
    expect((await list(env)).handles).toEqual({});
  });
  it('refuses a handle already linked to another wallet, case-insensitively', async () => {
    const env = { DB: database() };
    expect((await link(env, keyA, addrA, 'Jim')).status).toBe(200);
    const res = await link(env, keyB, addrB, '@jim');
    expect(res.status).toBe(409);
    expect(Object.keys((await list(env)).handles)).toEqual([addrA]);
  });
  it('lets a wallet change its handle, ignores older signatures, and removes on an empty handle', async () => {
    const env = { DB: database() };
    await link(env, keyA, addrA, 'one', now, now);
    await link(env, keyA, addrA, 'two', now + 1000, now + 1000);
    expect((await list(env)).handles[addrA].h).toBe('@two');
    await link(env, keyA, addrA, 'one', now, now + 2000); // replay of the older signature
    expect((await list(env)).handles[addrA].h).toBe('@two');
    expect((await link(env, keyA, addrA, '', now + 3000, now + 3000)).status).toBe(200);
    expect((await list(env)).handles).toEqual({});
  });
  it('rejects a wrong origin, bad address, unknown campaign and invalid handle', async () => {
    const env = { DB: database() };
    expect((await post(env, {}, now, 'https://evil.example')).status).toBe(403);
    expect((await post(env, { campaign: 'zdao-1', address: 'ST123', handle: '@a', issued: now, signature: '0x' })).status).toBe(400);
    expect((await post(env, { campaign: 'nope', address: addrA, handle: '@a', issued: now, signature: '0x' })).status).toBe(400);
    expect((await post(env, { campaign: 'zdao-1', address: addrA, handle: 'not valid!', issued: now, signature: '0x' })).status).toBe(400);
  });
  it('is quiet when handle storage is not set up', async () => {
    expect(await (await handleBountyHandles(new Request('https://xtrata.xyz/bounty/handles'), {}, now)).json()).toEqual({ available: false, handles: {} });
    const bare = { DB: { prepare: () => ({ bind() { return this; }, async all() { throw new Error('no such table: bounty_handles'); } }) } };
    expect((await (await handleBountyHandles(new Request('https://xtrata.xyz/bounty/handles'), bare, now)).json() as any).available).toBe(false);
  });
});
