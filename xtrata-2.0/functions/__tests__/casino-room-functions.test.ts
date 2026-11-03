import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  makeRandomPrivKey,
  privateKeyToString,
  signStructuredData,
  TransactionVersion
} from '@stacks/transactions';
import { onRequest as challengeRoute } from '../casino/room/challenge';
import { onRequest as sessionRoute } from '../casino/room/session';
import { onRequest as wsRoute } from '../casino/room/ws';
import { roomProofData, type RoomChallenge } from '../lib/casino-room-proof';

const SECRET = 'test-secret-test-secret-test-secret-0123456789';
const ORIGIN = 'https://xtrata.xyz';

/** A stand-in for the Durable Object namespace: remembers nonces, and answers /ws with the headers it was given. */
function fakeRoom() {
  const used = new Set<string>();
  const calls: Array<{ url: string; headers: Record<string, string> }> = [];
  const namespace = {
    idFromName: (name: string) => ({ name }),
    get: () => ({
      async fetch(request: Request) {
        const url = new URL(request.url);
        const headers: Record<string, string> = {};
        request.headers.forEach((v, k) => { headers[k] = v; });
        calls.push({ url: url.pathname, headers });
        if (url.pathname === '/nonce') {
          const { n } = (await request.json()) as { n: string };
          if (used.has(n)) return Response.json({ ok: false }, { status: 409 });
          used.add(n);
          return Response.json({ ok: true });
        }
        return Response.json({ reached: true, headers });   // a real object answers 101; this is enough to see what it got
      }
    })
  };
  return { namespace, calls, used };
}
const envWith = (room = fakeRoom(), extra: Record<string, unknown> = {}) =>
  ({ env: { CASINO_ROOM: room.namespace, CASINO_ROOM_SECRET: SECRET, ...extra }, room });

const wallet = () => {
  const raw = privateKeyToString(makeRandomPrivKey());
  const key = raw.length === 64 ? `${raw}01` : raw;
  return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Testnet) };
};
const sign = (challenge: RoomChallenge, key: string) =>
  signStructuredData({ ...roomProofData(challenge), privateKey: createStacksPrivateKey(key) }).data;

const call = (route: any, env: any, path: string, init: RequestInit & { origin?: string | null } = {}) => {
  const headers = new Headers(init.headers);
  if (init.origin !== null) headers.set('origin', init.origin ?? ORIGIN);
  return route({ env, request: new Request(`${ORIGIN}${path}`, { ...init, headers }) } as any) as Promise<Response>;
};

async function signIn(env: any, w = wallet()) {
  const { challenge } = await (await call(challengeRoute, env, `/casino/room/challenge?address=${w.address}`)).json() as any;
  const res = await call(sessionRoute, env, '/casino/room/session', {
    method: 'POST', body: JSON.stringify({ challenge, signature: sign(challenge, w.key) })
  });
  return { res, w, challenge, cookie: (res.headers.get('set-cookie') || '').split(';')[0] };
}

describe('casino room is quiet and closed when not configured', () => {
  it('answers 503 for all three routes with no binding, no secret, or the kill switch on', async () => {
    const cases: any[] = [
      {},
      { CASINO_ROOM: fakeRoom().namespace },
      { CASINO_ROOM: fakeRoom().namespace, CASINO_ROOM_SECRET: 'short' },
      { CASINO_ROOM: fakeRoom().namespace, CASINO_ROOM_SECRET: SECRET, CASINO_ROOM_DISABLED: '1' }
    ];
    for (const env of cases) {
      expect((await call(challengeRoute, env, '/casino/room/challenge?address=ST1X')).status).toBe(503);
      expect((await call(sessionRoute, env, '/casino/room/session')).status).toBe(503);
      expect((await call(wsRoute, env, '/casino/room/ws', { headers: { upgrade: 'websocket' } })).status).toBe(503);
    }
    expect((await (await call(wsRoute, {}, '/casino/room/ws')).json() as any).error).toMatch(/offline/);
  });
});

describe('casino room sign-in', () => {
  it('signs in once with a good signature, sets a scoped cookie, and shows who you are', async () => {
    const { env } = envWith();
    const { res, w, cookie } = await signIn(env);
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.address).toBe(w.address);
    expect(body.network).toBe('testnet');
    expect(body.hash160).toMatch(/^[a-f0-9]{40}$/);
    const setCookie = res.headers.get('set-cookie') || '';
    expect(setCookie).toMatch(/^px_room=/);
    expect(setCookie).toContain('Path=/casino/room');
    expect(setCookie).toContain('HttpOnly');
    expect(res.headers.get('cache-control')).toBe('no-store');
    const me = await (await call(sessionRoute, env, '/casino/room/session', { headers: { cookie } })).json() as any;
    expect(me.address).toBe(w.address);
    expect((await (await call(sessionRoute, env, '/casino/room/session')).json() as any).address).toBeNull();
  });

  it('refuses a wrong signature, a tampered challenge, a replay, junk and cross-site posts', async () => {
    const { env } = envWith();
    const a = wallet(), b = wallet();
    const { challenge } = await (await call(challengeRoute, env, `/casino/room/challenge?address=${a.address}`)).json() as any;
    const post = (body: unknown, origin?: string | null) => call(sessionRoute, env, '/casino/room/session', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), origin });

    const wrong = await post({ challenge, signature: sign(challenge, b.key) });
    expect(wrong.status).toBe(401);
    expect(wrong.headers.get('set-cookie')).toBeNull();
    expect((await post({ challenge: { ...challenge, expires: challenge.expires + 1 }, signature: sign(challenge, a.key) })).status).toBe(400);
    expect((await post('not json')).status).toBe(400);
    expect((await post({})).status).toBe(400);
    expect((await post({ challenge, signature: sign(challenge, a.key) }, 'https://evil.example')).status).toBe(403);
    expect((await post({ challenge, signature: sign(challenge, a.key) }, null)).status).toBe(403);

    const good = await post({ challenge, signature: sign(challenge, a.key) });
    expect(good.status).toBe(200);
    const replay = await post({ challenge, signature: sign(challenge, a.key) });
    expect(replay.status).toBe(409);
    expect(replay.headers.get('set-cookie')).toBeNull();
  });

  it('does not burn a sign-in request that failed verification', async () => {
    const { env, room } = envWith();
    const a = wallet(), b = wallet();
    const { challenge } = await (await call(challengeRoute, env, `/casino/room/challenge?address=${a.address}`)).json() as any;
    await call(sessionRoute, env, '/casino/room/session', { method: 'POST', body: JSON.stringify({ challenge, signature: sign(challenge, b.key) }) });
    expect(room.used.size).toBe(0);
  });

  it('accepts the sign-in challenge the way a real browser sends it (same-site GET: no Origin, Sec-Fetch-Site says same-origin)', async () => {
    const { env } = envWith();
    const path = '/casino/room/challenge?address=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const browserGet = (site?: string) => call(challengeRoute, env, path, { origin: null, headers: site ? { 'sec-fetch-site': site } : {} });
    expect((await browserGet('same-origin')).status).toBe(200);
    expect((await browserGet('cross-site')).status).toBe(403);
    expect((await browserGet('same-site')).status).toBe(403);
    expect((await browserGet()).status).toBe(403);        // no header at all: not a browser page, not allowed
  });

  it('rejects bad addresses and cross-site challenge requests; signing out clears the cookie', async () => {
    const { env } = envWith();
    expect((await call(challengeRoute, env, '/casino/room/challenge?address=nonsense')).status).toBe(400);
    expect((await call(challengeRoute, env, '/casino/room/challenge')).status).toBe(400);
    expect((await call(challengeRoute, env, '/casino/room/challenge?address=ST1X', { origin: 'https://evil.example' })).status).toBe(403);
    expect((await call(challengeRoute, env, '/casino/room/challenge?address=ST1X', { method: 'POST' })).status).toBe(405);
    const out = await call(sessionRoute, env, '/casino/room/session', { method: 'DELETE' });
    expect(out.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  it('reports an unreachable room instead of pretending sign-in worked', async () => {
    const room = fakeRoom();
    room.namespace.get = () => ({ fetch: async () => { throw new Error('down'); } });
    const { env } = envWith(room);
    const w = wallet();
    const { challenge } = await (await call(challengeRoute, env, `/casino/room/challenge?address=${w.address}`)).json() as any;
    const res = await call(sessionRoute, env, '/casino/room/session', { method: 'POST', body: JSON.stringify({ challenge, signature: sign(challenge, w.key) }) });
    expect(res.status).toBe(503);
    expect(res.headers.get('set-cookie')).toBeNull();
  });
});

describe('casino room websocket gate', () => {
  const wsHeaders = (extra: Record<string, string> = {}) => ({ upgrade: 'websocket', connection: 'Upgrade', 'sec-websocket-key': 'abc', 'sec-websocket-version': '13', ...extra });

  it('wants a WebSocket upgrade from our own origin', async () => {
    const { env } = envWith();
    expect((await call(wsRoute, env, '/casino/room/ws')).status).toBe(426);
    expect((await call(wsRoute, env, '/casino/room/ws', { headers: wsHeaders(), origin: 'https://evil.example' })).status).toBe(403);
    expect((await call(wsRoute, env, '/casino/room/ws', { headers: wsHeaders(), origin: null })).status).toBe(403);
    expect((await call(wsRoute, env, '/casino/room/ws', { method: 'POST', headers: wsHeaders() })).status).toBe(405);
  });

  it('lets a guest in with no identity headers', async () => {
    const { env, room } = envWith();
    const res = await call(wsRoute, env, '/casino/room/ws', { headers: wsHeaders() });
    const body = await res.json() as any;
    expect(body.reached).toBe(true);
    expect(body.headers['x-px-addr']).toBeUndefined();
    expect(room.calls.at(-1)?.url).toBe('/casino/room/ws');
  });

  it('passes the signed-in address, and drops any x-px-* header a browser tries to send', async () => {
    const { env } = envWith();
    const { cookie, w } = await signIn(env);
    const res = await call(wsRoute, env, '/casino/room/ws', { headers: wsHeaders({ cookie, 'x-px-addr': 'ST1EVIL', 'x-px-k': 'e'.repeat(40), 'x-px-other': '1' }) });
    const { headers } = await res.json() as any;
    expect(headers['x-px-addr']).toBe(w.address);
    expect(headers['x-px-k']).toMatch(/^[a-f0-9]{40}$/);
    expect(headers['x-px-other']).toBeUndefined();

    const forgedGuest = await call(wsRoute, env, '/casino/room/ws', { headers: wsHeaders({ 'x-px-addr': 'ST1EVIL' }) });
    expect(((await forgedGuest.json()) as any).headers['x-px-addr']).toBeUndefined();
    const badCookie = await call(wsRoute, env, '/casino/room/ws', { headers: wsHeaders({ cookie: 'px_room=v1.AAAA.' + '0'.repeat(64) }) });
    expect(((await badCookie.json()) as any).headers['x-px-addr']).toBeUndefined();
  });
});
