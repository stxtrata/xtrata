import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createStacksPrivateKey, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, signMessageHashRsv, TransactionVersion } from '@stacks/transactions';
import { onRequest as config } from '../listening-wallet/config';
import { onRequest as link } from '../listening-wallet/link';
import { linkHash } from '../../../src/lib/listening-wallet/link';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
const key = () => privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const addr = (k: string) => getAddressFromPrivateKey(k, TransactionVersion.Mainnet);
const sign = (l: object, k: string) => signMessageHashRsv({ messageHash: linkHash(l as any), privateKey: createStacksPrivateKey(k) }).data;
const NOW = Date.parse('2026-10-12T12:00:00Z');
let db: any, env: any;
const mainKey = key(), listeningKey = key(), MAIN = addr(mainKey), LISTENING = addr(listeningKey);

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(NOW);
  db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../../migrations/026_radio_listening_wallets.sql', import.meta.url), 'utf8'));
  env = {
    RADIO_PPP_ENABLED: '1', RADIO_PPP_ALLOWLIST: MAIN, RADIO_LISTENING_WALLET_ORIGIN: 'https://wallet.xtrata.xyz',
    DB: { prepare(sql: string) { let binds: any[] = []; return { bind(...a: any[]) { binds = a; return this; }, async all() { return { results: db.prepare(sql).all(...binds) }; }, async run() { return db.prepare(sql).run(...binds); } }; } }
  };
});
afterEach(() => { db.close(); vi.restoreAllMocks(); });

const get = (path: string) => new Request('https://xtrata.test' + path);
const post = (body: unknown, headers: Record<string, string> = {}) => link({ env, request: new Request('https://xtrata.test/radio/listening-wallet/link', { method: 'POST', headers: { origin: 'https://xtrata.test', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) }) });
const submission = (issued = NOW, m = mainKey, l = listeningKey) => {
  const msg = { main: addr(m), listening: addr(l), issued };
  return { ...msg, mainSignature: sign(msg, m), listeningSignature: sign(msg, l) };
};

describe('pay-per-play canary gate', () => {
  it('is off unless the switch and wallet origin are both set', async () => {
    expect(await (await config({ env: {}, request: get('/x?main=' + MAIN) })).json()).toMatchObject({ enabled: false, allowed: false, walletOrigin: null });
    expect(await (await config({ env: { ...env, RADIO_LISTENING_WALLET_ORIGIN: 'http://bad' }, request: get('/x?main=' + MAIN) })).json()).toMatchObject({ enabled: false });
    expect(await (await config({ env: { ...env, RADIO_PPP_ENABLED: '0' }, request: get('/x?main=' + MAIN) })).json()).toMatchObject({ enabled: false, allowed: false });
  });
  it('admits only allowlisted wallets during the canary, everyone with "all"', async () => {
    expect(await (await config({ env, request: get('/x?main=' + MAIN) })).json()).toMatchObject({ enabled: true, allowed: true, canary: true, walletOrigin: 'https://wallet.xtrata.xyz', limits: { firstSessionPlays: 1, playFee: '300' } });
    expect(await (await config({ env, request: get('/x?main=' + LISTENING) })).json()).toMatchObject({ enabled: true, allowed: false });
    expect(await (await config({ env: { ...env, RADIO_PPP_ALLOWLIST: 'all' }, request: get('/x?main=' + LISTENING) })).json()).toMatchObject({ allowed: true, canary: false });
  });
});

describe('listening wallet links', () => {
  it('stores a dual-signed link and returns it publicly for other devices', async () => {
    const r = await post(submission());
    expect(r.status).toBe(200);
    const links = await (await link({ env, request: get('/radio/listening-wallet/link?main=' + MAIN) })).json();
    expect(links.links).toEqual([{ listening: LISTENING, issued: NOW, mainSignature: submission().mainSignature }]);
  });
  it('rejects a missing or wrong signature on either side', async () => {
    const s = submission();
    expect((await post({ ...s, mainSignature: s.listeningSignature })).status).toBe(400);
    expect((await post({ ...s, listeningSignature: s.mainSignature })).status).toBe(400);
    expect(db.prepare('SELECT COUNT(*) n FROM radio_listening_wallets').get().n).toBe(0);
  });
  it('rejects stale links, cross-site posts, wallets outside the canary and the kill switch', async () => {
    expect((await post(submission(NOW - 16 * 60_000))).status).toBe(400);
    expect((await post(submission(), { origin: 'https://evil.test' })).status).toBe(403);
    const outsider = key();
    expect((await post(submission(NOW, outsider))).status).toBe(403);
    env.RADIO_PPP_ENABLED = '0';
    expect((await post(submission())).status).toBe(503);
  });
  it('allows a newer re-link signed by both sides, refuses an older replay', async () => {
    expect((await post(submission(NOW - 60_000))).status).toBe(200);
    expect((await post(submission(NOW - 120_000))).status).toBe(409);
    expect((await post(submission(NOW))).status).toBe(200);
    expect(db.prepare('SELECT issued FROM radio_listening_wallets').get().issued).toBe(NOW);
  });
  it('keeps only the newest five listening wallets per main wallet', async () => {
    const keys = Array.from({ length: 6 }, key);
    for (let i = 0; i < 6; i++) expect((await post(submission(NOW - (6 - i) * 1000, mainKey, keys[i]))).status).toBe(200);
    const rows = db.prepare('SELECT listening FROM radio_listening_wallets WHERE main=? ORDER BY issued').all(MAIN).map((r: any) => r.listening);
    expect(rows).toEqual(keys.slice(1).map(addr));
  });
});
