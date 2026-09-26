import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  makeRandomPrivKey,
  privateKeyToString,
  signStructuredData,
  TransactionVersion
} from '@stacks/transactions';
import { fixture, sqliteAvailable } from './storage/fixtures';
import { creatorProofData, verifyCreatorProof, type CreatorChallenge } from '../creator-proof';
import { authorizeCreator, isCreatorAllowlisted, XTRATA_OWNER_ADDRESS } from '../creator-auth';
import { onRequest as sessionRoute } from '../../manage/session';

export const withCreatorTables = (f: any) => {
  f.DB.sqlite.exec(readFileSync(fileURLToPath(new URL('../../migrations/018_creator_sessions.sql', import.meta.url)), 'utf8'));
  return f;
};

export const newWallet = () => {
  const raw = privateKeyToString(makeRandomPrivKey());
  const key = raw.length === 64 ? `${raw}01` : raw; // compressed, as wallets use
  return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Mainnet) };
};
export const signChallenge = (challenge: CreatorChallenge, key: string) =>
  signStructuredData({ ...creatorProofData(challenge), privateKey: createStacksPrivateKey(key) }).data;

/** Full sign-in through the route; returns the session cookie. */
export async function signIn(env: any, wallet: { key: string; address: string }) {
  const call = (body: unknown) => sessionRoute({ env, request: new Request('https://xtrata.xyz/manage/session', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) } as any);
  const { challenge } = await (await call({ action: 'challenge', address: wallet.address })).json() as any;
  const response = await call({ action: 'verify', id: challenge.id, signature: signChallenge(challenge, wallet.key) });
  expect(response.status).toBe(200);
  return (response.headers.get('set-cookie') ?? '').split(';')[0];
}

afterEach(() => vi.unstubAllGlobals());

describe('creator proof', () => {
  it('accepts the signer and rejects any other wallet', () => {
    const a = newWallet(); const b = newWallet(); const now = Date.now();
    const challenge: CreatorChallenge = { id: 'a'.repeat(64), address: a.address, network: 'mainnet', nonce: 'b'.repeat(64), issued: now, expires: now + 300000 };
    expect(verifyCreatorProof(challenge, signChallenge(challenge, a.key))).toBe(true);
    expect(verifyCreatorProof(challenge, signChallenge(challenge, b.key))).toBe(false);
    expect(verifyCreatorProof(challenge, 'nope')).toBe(false);
  });
});

describe.skipIf(!sqliteAvailable)('creator sessions and authorization', () => {
  it('signs in once per challenge, reads the session, and signs out', async () => {
    const f = withCreatorTables(await fixture());
    const wallet = newWallet();
    f.env.ARTIST_ALLOWLIST = wallet.address;
    const cookie = await signIn(f.env, wallet);
    expect(cookie).toMatch(/^xtrata_creator=[a-f0-9]{64}$/);
    const me = await (await sessionRoute({ env: f.env, request: new Request('https://xtrata.xyz/manage/session', { headers: { cookie } }) } as any)).json() as any;
    expect(me).toMatchObject({ signedIn: true, address: wallet.address, admin: false, allowlisted: true });
    const out = await sessionRoute({ env: f.env, request: new Request('https://xtrata.xyz/manage/session', { method: 'DELETE', headers: { cookie } }) } as any);
    expect(out.headers.get('set-cookie')).toMatch(/Max-Age=0/);
    const after = await (await sessionRoute({ env: f.env, request: new Request('https://xtrata.xyz/manage/session', { headers: { cookie } }) } as any)).json() as any;
    expect(after.signedIn).toBe(false);
  });

  it('refuses a replayed or mismatched signature', async () => {
    const f = withCreatorTables(await fixture());
    const wallet = newWallet(); const other = newWallet();
    const call = (body: unknown) => sessionRoute({ env: f.env, request: new Request('https://xtrata.xyz/manage/session', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) } as any);
    const { challenge } = await (await call({ action: 'challenge', address: wallet.address })).json() as any;
    expect((await call({ action: 'verify', id: challenge.id, signature: signChallenge(challenge, other.key) })).status).toBe(400);
    expect((await call({ action: 'verify', id: challenge.id, signature: signChallenge(challenge, wallet.key) })).status).toBe(200);
    expect((await call({ action: 'verify', id: challenge.id, signature: signChallenge(challenge, wallet.key) })).status).toBe(400);
  });

  it('enforce mode: owner or admin may write, others are refused; log mode records but allows', async () => {
    const f = withCreatorTables(await fixture());
    const owner = newWallet(); const stranger = newWallet();
    f.env.ARTIST_ALLOWLIST = `${owner.address},${stranger.address}`;
    const ownerCookie = await signIn(f.env, owner);
    const strangerCookie = await signIn(f.env, stranger);
    const collection = { id: 'c1', artist_address: owner.address };
    const req = (cookie?: string) => new Request('https://xtrata.xyz/collections/c1', { headers: cookie ? { cookie } : {} });

    f.env.CREATOR_AUTH_MODE = 'enforce';
    expect((await authorizeCreator(req(ownerCookie), f.env, { action: 't', collection })).allowed).toBe(true);
    const refused = await authorizeCreator(req(strangerCookie), f.env, { action: 't', collection });
    expect(refused.allowed).toBe(false); expect(refused.response?.status).toBe(403);
    expect((await authorizeCreator(req(), f.env, { action: 't', collection })).response?.status).toBe(401);

    f.env.XTRATA_ADMIN_ADDRESSES = stranger.address;
    expect((await authorizeCreator(req(strangerCookie), f.env, { action: 't', collection })).admin).toBe(true);
    delete f.env.XTRATA_ADMIN_ADDRESSES;

    f.env.CREATOR_AUTH_MODE = 'log';
    const logged = await authorizeCreator(req(strangerCookie), f.env, { action: 'patch', collection });
    expect(logged.allowed).toBe(true);
    const audit = f.DB.sqlite.prepare('SELECT action, reason, mode FROM creator_auth_audit ORDER BY id DESC LIMIT 1').get();
    expect(audit).toMatchObject({ action: 'patch', mode: 'log' });
    expect(String(audit.reason)).toMatch(/^not-owner/);
  });

  it('admin defaults to the Xtrata owner address; the allowlist is checked server-side', async () => {
    const f = withCreatorTables(await fixture());
    expect((await isCreatorAllowlisted(f.env, XTRATA_OWNER_ADDRESS)).allowed).toBe(true);
    const wallet = newWallet();
    expect((await isCreatorAllowlisted(f.env, wallet.address)).allowed).toBe(false);
    f.env.ARTIST_ALLOWLIST = 'artist.btc';
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ data: { owner: wallet.address } })));
    expect(await isCreatorAllowlisted(f.env, wallet.address)).toEqual({ allowed: true, checked: true });
    vi.stubGlobal('fetch', vi.fn(async () => new Response('busy', { status: 503 })));
    f.env.ARTIST_ALLOWLIST = 'other.btc';
    expect(await isCreatorAllowlisted(f.env, newWallet().address)).toEqual({ allowed: false, checked: false });
  });
});
