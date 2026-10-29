/**
 * End-to-end check of the casino room against a RUNNING server (local `wrangler pages dev` with the room Worker, or a
 * deployed preview). Skipped unless ROOM_E2E_URL is set, so the normal test run never needs a server.
 *
 *   ROOM_E2E_URL=http://localhost:8788 npx vitest run functions/__tests__/casino-room-e2e.test.ts
 *
 * Uses throwaway keys, so it needs no wallet. It signs in people, opens real WebSockets and checks seats, takeover, forged
 * identities, the origin gate, rate limits, and that the room survives going idle (hibernation).
 * Set ROOM_E2E_IDLE_MS (default 20000) to change how long the idle check waits.
 */
import { describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  makeRandomPrivKey,
  privateKeyToString,
  signStructuredData,
  TransactionVersion
} from '@stacks/transactions';
import { roomProofData, type RoomChallenge } from '../lib/casino-room-proof';

const BASE = process.env.ROOM_E2E_URL || '';
const ORIGIN = BASE ? new URL(BASE).origin : '';
const WS_URL = BASE.replace(/^http/, 'ws') + '/casino/room/ws';
const IDLE_MS = Number(process.env.ROOM_E2E_IDLE_MS || 20000);

const wallet = () => {
  const raw = privateKeyToString(makeRandomPrivKey());
  const key = raw.length === 64 ? `${raw}01` : raw;
  return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Testnet) };
};
const sign = (challenge: RoomChallenge, key: string) =>
  signStructuredData({ ...roomProofData(challenge), privateKey: createStacksPrivateKey(key) }).data;

async function signIn(w = wallet()) {
  const c = await fetch(`${BASE}/casino/room/challenge?address=${w.address}`, { headers: { origin: ORIGIN } });
  expect(c.status).toBe(200);
  const { challenge } = (await c.json()) as { challenge: RoomChallenge };
  const body = JSON.stringify({ challenge, signature: sign(challenge, w.key) });
  const res = await fetch(`${BASE}/casino/room/session`, { method: 'POST', body, headers: { origin: ORIGIN } });
  const cookie = (res.headers.get('set-cookie') || '').split(';')[0];
  return { w, res, cookie, replay: () => fetch(`${BASE}/casino/room/session`, { method: 'POST', body, headers: { origin: ORIGIN } }) };
}

type Msg = Record<string, any>;
function open(headers: Record<string, string> = {}, origin = ORIGIN) {
  const msgs: Msg[] = [];
  const waiters: Array<{ test: (m: Msg) => boolean; resolve: (m: Msg) => void; reject: (e: Error) => void; timer: any }> = [];
  const ws = new WebSocket(WS_URL, { headers: { origin, ...headers } });
  const closed: { code?: number; reason?: string; rejected?: number } = {};
  ws.on('message', (data) => {
    const m = JSON.parse(String(data));
    msgs.push(m);
    for (const w of [...waiters]) if (w.test(m)) { clearTimeout(w.timer); waiters.splice(waiters.indexOf(w), 1); w.resolve(m); }
  });
  ws.on('close', (code, reason) => { closed.code = code; closed.reason = String(reason); });
  ws.on('unexpected-response', (_req, res) => { closed.rejected = res.statusCode; });
  const ready = new Promise<void>((resolve, reject) => { ws.on('open', () => resolve()); ws.on('error', reject); ws.on('unexpected-response', () => reject(new Error('rejected'))); });
  const waitFor = (test: (m: Msg) => boolean, ms = 8000) =>
    new Promise<Msg>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timed out waiting; saw ' + JSON.stringify(msgs.slice(-6)))), ms);
      waiters.push({ test, resolve, reject, timer });
    });
  const send = (m: unknown) => ws.send(JSON.stringify(m));
  const quiet = (ms = 400) => new Promise((r) => setTimeout(r, ms));
  return { ws, msgs, ready, waitFor, send, quiet, closed };
}
async function join(headers: Record<string, string> = {}) {
  const c = open(headers);
  const first = c.waitFor((m) => m.t === 'room');
  await c.ready;
  return { ...c, room: await first };
}
const closeAll = (...cs: Array<{ ws: WebSocket }>) => cs.forEach((c) => { try { c.ws.close(); } catch { /* closed */ } });

describe.skipIf(!BASE)('casino room end to end', () => {
  it('lets guests watch but not sit', async () => {
    const g = await join();
    expect(g.room.you.guest).toBe(true);
    expect(g.room.you.a).toBeNull();
    g.send({ t: 'sit', spot: 'bar.1' });
    expect((await g.waitFor((m) => m.t === 'err')).code).toBe('sign-in-first');
    closeAll(g);
  });

  it('signs in once, sits, and everyone watching sees it; seats are first come first served', async () => {
    const alice = await signIn(), bob = await signIn();
    expect(alice.res.status).toBe(200);
    expect(alice.cookie).toMatch(/^px_room=/);
    expect((await alice.replay()).status).toBe(409);      // a sign-in request works once

    const watcher = await join();
    const a = await join({ cookie: alice.cookie });
    const b = await join({ cookie: bob.cookie });
    expect(a.room.you).toMatchObject({ a: alice.w.address, guest: false });

    const seen = watcher.waitFor((m) => m.t === 'sat' && m.spot === 'bar.1');
    a.send({ t: 'sit', spot: 'bar.1' });
    expect((await seen).who.a).toBe(alice.w.address);

    b.send({ t: 'sit', spot: 'bar.1' });
    expect((await b.waitFor((m) => m.t === 'err')).code).toBe('taken');
    b.send({ t: 'sit', spot: 'bar.2' });
    await watcher.waitFor((m) => m.t === 'sat' && m.spot === 'bar.2');

    const late = await join();                              // someone arriving later is told who sits where
    expect(Object.keys(late.room.spots).sort()).toEqual(['bar.1', 'bar.2']);
    expect(late.room.joined).toBeGreaterThanOrEqual(2);

    const left = watcher.waitFor((m) => m.t === 'stood' && m.spot === 'bar.1');
    a.ws.close();
    await left;
    closeAll(watcher, b, late);
  });

  it('cannot be fooled by a forged identity header or a bad cookie', async () => {
    const fake = await join({ 'x-px-addr': 'ST1EVIL0000000000000000000000000000000000', 'x-px-k': 'e'.repeat(40) });
    expect(fake.room.you.guest).toBe(true);
    const badCookie = await join({ cookie: 'px_room=v1.AAAA.' + '0'.repeat(64) });
    expect(badCookie.room.you.guest).toBe(true);
    closeAll(fake, badCookie);
  });

  it('only accepts connections from its own site', async () => {
    const evil = open({}, 'https://evil.example');
    await expect(evil.ready).rejects.toBeTruthy();
    expect(evil.closed.rejected).toBe(403);
    const none = new WebSocket(WS_URL);   // no Origin header at all
    const code = await new Promise<number>((resolve) => { none.on('unexpected-response', (_r, res) => resolve(res.statusCode || 0)); none.on('open', () => resolve(101)); none.on('error', () => resolve(-1)); });
    expect(code).toBe(403);
  });

  it('one address, one seat: a second tab takes it over and a third connection closes the oldest', async () => {
    const alice = await signIn();
    const tab1 = await join({ cookie: alice.cookie });
    tab1.send({ t: 'sit', spot: 'holdem.1' });
    await tab1.waitFor((m) => m.t === 'sat');
    const tab2 = await join({ cookie: alice.cookie });
    const told = tab1.waitFor((m) => m.t === 'moved');
    tab2.send({ t: 'sit', spot: 'holdem.1' });
    expect((await told).spot).toBe('holdem.1');
    const observer = await join();
    expect(observer.room.spots['holdem.1']?.a).toBe(alice.w.address);

    const tab3 = await join({ cookie: alice.cookie });
    await tab3.quiet(1200);
    expect(tab1.closed.code).toBe(4001);                   // the oldest connection was replaced
    closeAll(tab2, tab3, observer);
  });

  it('slows down a connection that talks too much', async () => {
    const g = await join();
    for (let i = 0; i < 20; i += 1) g.send({ t: 'ping' });
    expect((await g.waitFor((m) => m.t === 'err' && m.code === 'slow-down')).code).toBe('slow-down');
    closeAll(g);
  });

  it('keeps everyone and every seat when the room goes idle and hibernates', async () => {
    const alice = await signIn();
    const a = await join({ cookie: alice.cookie });
    a.send({ t: 'sit', spot: 'liars.2' });
    await a.waitFor((m) => m.t === 'sat');
    const watcher = await join();
    await new Promise((r) => setTimeout(r, 300));
    watcher.send({ t: 'ping' });
    const before = await watcher.waitFor((m) => m.t === 'pong');

    await new Promise((r) => setTimeout(r, IDLE_MS));       // nobody says anything

    const pingAt = Date.now();
    watcher.send({ t: 'ping' });
    const after = await watcher.waitFor((m) => m.t === 'pong' && m !== before);
    watcher.send({ t: 'hello' });
    const again = await watcher.waitFor((m) => m.t === 'room' && m !== watcher.room);
    expect(again.spots['liars.2']?.a).toBe(alice.w.address);
    expect(again.joined).toBeGreaterThanOrEqual(1);
    // `up` is when the object's memory was created: a different value means it hibernated and woke, with the room intact.
    console.log(`[room-e2e] idle ${IDLE_MS} ms; instance start ${before.up} -> ${after.up} (${before.up === after.up ? 'did NOT hibernate' : 'hibernated and woke'}); first message after the idle came back ~${Date.now() - pingAt} ms later`);
    const stood = watcher.waitFor((m) => m.t === 'stood' && m.spot === 'liars.2');
    a.ws.close();                                           // and a woken room still frees seats
    await stood;
    closeAll(watcher);
  }, 120_000);
});
