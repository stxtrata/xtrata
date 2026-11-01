import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bufferCVFromString, createStacksPrivateKey, cvToHex, getAddressFromPrivateKey, makeRandomPrivKey, noneCV, privateKeyToString,
  responseOkCV, signStructuredData, someCV, TransactionVersion, tupleCV
} from '@stacks/transactions';
import { onRequest as challengeRoute } from '../casino/room/challenge';
import { onRequest as sessionRoute } from '../casino/room/session';
import { onRequest as bnsRoute } from '../casino/room/bns';
import { onRequest as wsRoute } from '../casino/room/ws';
import { roomProofData, signRoomSession, ROOM_COOKIE, type RoomChallenge } from '../lib/casino-room-proof';
import { clearBnsCache } from '../lib/casino-room-bns';

// The Salon's rule (docs/plans/CASINO-SALON-BNS-PLAN.md): the primary BNS name is read at sign-in, carried in the session,
// passed to the room, and can be checked again. The BNS API is stood in for by a fake fetch.
const SECRET = 'test-secret-test-secret-test-secret-0123456789';
const ORIGIN = 'https://xtrata.xyz';
const fakeRoom = () => {
  const used = new Set<string>();
  return {
    idFromName: (name: string) => ({ name }),
    get: () => ({
      async fetch(request: Request) {
        const url = new URL(request.url); const headers: Record<string, string> = {};
        request.headers.forEach((v, k) => { headers[k] = v; });
        if (url.pathname === '/nonce') { const { n } = (await request.json()) as { n: string }; if (used.has(n)) return Response.json({ ok: false }, { status: 409 }); used.add(n); return Response.json({ ok: true }); }
        return Response.json({ reached: true, headers });
      }
    })
  };
};
const env = () => ({ CASINO_ROOM: fakeRoom(), CASINO_ROOM_SECRET: SECRET });
const wallet = () => { const raw = privateKeyToString(makeRandomPrivKey()); const key = raw.length === 64 ? `${raw}01` : raw; return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Testnet) }; };
const call = (route: any, e: any, path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers); headers.set('origin', ORIGIN);
  return route({ env: e, request: new Request(`${ORIGIN}${path}`, { ...init, headers }) } as any) as Promise<Response>;
};
async function signIn(e: any, w = wallet()) {
  const { challenge } = await (await call(challengeRoute, e, `/casino/room/challenge?address=${w.address}`)).json() as { challenge: RoomChallenge };
  const signature = signStructuredData({ ...roomProofData(challenge), privateKey: createStacksPrivateKey(w.key) }).data;
  const res = await call(sessionRoute, e, '/casino/room/session', { method: 'POST', body: JSON.stringify({ challenge, signature }) });
  return { res, body: await res.clone().json() as any, cookie: (res.headers.get('set-cookie') || '').split(';')[0], w };
}
const wsHeaders = (cookie: string) => ({ cookie, upgrade: 'websocket', connection: 'Upgrade', 'sec-websocket-key': 'abc', 'sec-websocket-version': '13' });
const named = (name: string, ns: string) => cvToHex(responseOkCV(someCV(tupleCV({ name: bufferCVFromString(name), namespace: bufferCVFromString(ns) }))));
const NONE = cvToHex(responseOkCV(noneCV()));
let bnsAnswer: () => Response;
beforeEach(() => {
  clearBnsCache();
  vi.stubGlobal('fetch', async (url: string) => {
    if (String(url).includes('/BNS-V2/get-primary')) return bnsAnswer();
    throw new Error('unexpected fetch ' + url);
  });
});
afterEach(() => vi.unstubAllGlobals());

describe('sign-in reads the primary BNS name', () => {
  it('keeps a name in the session and passes it to the room', async () => {
    bnsAnswer = () => Response.json({ okay: true, result: named('jim', 'btc') });
    const e = env(); const { body, cookie } = await signIn(e);
    expect(body).toMatchObject({ bns: 'jim.btc', bnsChecked: true });
    const me = await (await call(sessionRoute, e, '/casino/room/session', { headers: { cookie } })).json() as any;
    expect(me).toMatchObject({ bns: 'jim.btc', bnsChecked: true });
    const { headers } = await (await call(wsRoute, e, '/casino/room/ws', { headers: wsHeaders(cookie) })).json() as any;
    expect(headers['x-px-bns']).toBe('jim.btc');
    expect(headers['x-px-bnsc']).toBe('1');
  });

  it('no name is a checked answer', async () => {
    bnsAnswer = () => Response.json({ okay: true, result: NONE });
    const e = env(); const { body, cookie } = await signIn(e);
    expect(body).toMatchObject({ bns: null, bnsChecked: true });
    const { headers } = await (await call(wsRoute, e, '/casino/room/ws', { headers: wsHeaders(cookie) })).json() as any;
    expect(headers['x-px-bns']).toBe('');
    expect(headers['x-px-bnsc']).toBe('1');
  });

  it('a failed lookup still signs the player in, marked "not checked"', async () => {
    bnsAnswer = () => new Response('', { status: 503 });
    const e = env(); const { res, body, cookie } = await signIn(e);
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ bns: null, bnsChecked: false });
    const { headers } = await (await call(wsRoute, e, '/casino/room/ws', { headers: wsHeaders(cookie) })).json() as any;
    expect(headers['x-px-bnsc']).toBe('0');
  });

  it('a session from before this change reads as "not checked"', async () => {
    const e = env(); const now = Date.now();
    const token = signRoomSession(SECRET, { a: wallet().address, k: 'k'.repeat(40), n: 'n'.repeat(64), iat: now, exp: now + 60_000 });
    const { headers } = await (await call(wsRoute, e, '/casino/room/ws', { headers: wsHeaders(`${ROOM_COOKIE}=${token}`) })).json() as any;
    expect(headers['x-px-bns']).toBe('');
    expect(headers['x-px-bnsc']).toBe('0');
  });

  it('a name the server could not have written is not passed on', async () => {
    const e = env(); const now = Date.now();
    const token = signRoomSession(SECRET, { a: wallet().address, k: 'k'.repeat(40), n: 'n'.repeat(64), iat: now, exp: now + 60_000, bn: 'evil\r\nx: 1', bc: true });
    const { headers } = await (await call(wsRoute, e, '/casino/room/ws', { headers: wsHeaders(`${ROOM_COOKIE}=${token}`) })).json() as any;
    expect(headers['x-px-bns']).toBe('');
  });
});

describe('check again', () => {
  it('needs a session, from our own site, by POST', async () => {
    const e = env();
    expect((await call(bnsRoute, e, '/casino/room/bns', { method: 'POST' })).status).toBe(401);
    expect((await call(bnsRoute, e, '/casino/room/bns')).status).toBe(405);
  });

  it('reads the name again and renews the session cookie with it, keeping the same expiry', async () => {
    bnsAnswer = () => Response.json({ okay: true, result: NONE });
    const e = env(); const { cookie, w } = await signIn(e);
    const before = await (await call(sessionRoute, e, '/casino/room/session', { headers: { cookie } })).json() as any;
    clearBnsCache();
    bnsAnswer = () => Response.json({ okay: true, result: named('newname', 'btc') });
    const res = await call(bnsRoute, e, '/casino/room/bns', { method: 'POST', headers: { cookie } });
    expect(res.status).toBe(200);
    expect(await res.clone().json()).toMatchObject({ address: w.address, bns: 'newname.btc', bnsChecked: true, expiresAt: before.expiresAt });
    const renewed = (res.headers.get('set-cookie') || '').split(';')[0];
    expect(renewed).toMatch(/^px_room=/);
    const { headers } = await (await call(wsRoute, e, '/casino/room/ws', { headers: wsHeaders(renewed) })).json() as any;
    expect(headers['x-px-bns']).toBe('newname.btc');
    expect(headers['x-px-addr']).toBe(w.address);
  });

  it('a failed re-check keeps the answer the player already had, and says the check failed', async () => {
    bnsAnswer = () => Response.json({ okay: true, result: named('jim', 'btc') });
    const e = env(); const { cookie } = await signIn(e);
    clearBnsCache();
    bnsAnswer = () => new Response('', { status: 500 });
    const out = await (await call(bnsRoute, e, '/casino/room/bns', { method: 'POST', headers: { cookie } })).json() as any;
    expect(out).toMatchObject({ bns: 'jim.btc', bnsChecked: true, failed: true });
  });

  it('a failed re-check with no earlier answer stays "not checked"', async () => {
    bnsAnswer = () => new Response('', { status: 500 });
    const e = env(); const { cookie } = await signIn(e);
    const out = await (await call(bnsRoute, e, '/casino/room/bns', { method: 'POST', headers: { cookie } })).json() as any;
    expect(out).toMatchObject({ bns: null, bnsChecked: false, failed: true });
  });
});
