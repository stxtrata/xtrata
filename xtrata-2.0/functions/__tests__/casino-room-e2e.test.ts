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

// ------------------------------------------------------------------ talk (player list, public chat, private messages)

const seen = (c: { msgs: Msg[] }, test: (m: Msg) => boolean) => c.msgs.filter(test);
const someone = () => { const w = wallet(); return signIn(w); };

describe.skipIf(!BASE)('casino room talk end to end', () => {
  it('lists signed-in people, and tells the room when someone arrives or leaves', async () => {
    const alice = await someone(), bob = await someone();
    const watcher = await join();
    const a = await join({ cookie: alice.cookie });
    expect(a.room.players.map((p: Msg) => p.a)).toContain(alice.w.address);
    const arrived = a.waitFor((m) => m.t === 'join' && m.who.a === bob.w.address);
    const guestSaw = watcher.waitFor((m) => m.t === 'join' && m.who.a === bob.w.address);
    const b = await join({ cookie: bob.cookie });
    expect(b.room.players.map((p: Msg) => p.a)).toEqual(expect.arrayContaining([alice.w.address, bob.w.address]));
    expect((await arrived).who.n).toBe(`${bob.w.address.slice(0, 5)}…${bob.w.address.slice(-4)}`);
    await guestSaw;                                             // guests can see who is here, as the plan says

    const a2 = await join({ cookie: alice.cookie });            // a second tab of someone already here is not an arrival
    await a2.quiet(500);
    expect(seen(b, (m) => m.t === 'join' && m.who.a === alice.w.address && m.at !== undefined)).toEqual([]);
    expect(seen(b, (m) => m.t === 'join' && m.who.a === alice.w.address)).toHaveLength(0);

    a.ws.close();                                               // she still has a tab open, so she has not left
    await b.quiet(500);
    expect(seen(b, (m) => m.t === 'leave')).toEqual([]);
    const left = b.waitFor((m) => m.t === 'leave' && m.a === alice.w.address);
    a2.ws.close();
    await left;
    closeAll(watcher, b);
  }, 30_000);

  it('public chat reaches signed-in people only; guests can watch but not speak', async () => {
    const alice = await someone(), bob = await someone();
    const a = await join({ cookie: alice.cookie }), b = await join({ cookie: bob.cookie }), guest = await join();
    // both waiters are set up before sending: the room can deliver to the speaker before the listener, and a waiter only sees messages that arrive after it
    const heard = b.waitFor((m) => m.t === 'say');
    const echoed = a.waitFor((x) => x.t === 'say');             // the speaker's own screen shows it because the room sent it back
    a.send({ t: 'say', text: '  hello   room ' });
    const m = await heard;
    expect(m).toMatchObject({ from: { a: alice.w.address }, text: 'hello room' });
    await echoed;
    guest.send({ t: 'say', text: 'let me in' });
    expect((await guest.waitFor((x) => x.t === 'err')).code).toBe('sign-in-first');
    await guest.quiet(500);
    expect(seen(guest, (x) => x.t === 'say')).toEqual([]);
    closeAll(a, b, guest);
  }, 30_000);

  it('private messages reach every tab of the other person and every tab of the sender, and nobody else', async () => {
    const alice = await someone(), bob = await someone(), carol = await someone();
    const a1 = await join({ cookie: alice.cookie }), a2 = await join({ cookie: alice.cookie });
    const b = await join({ cookie: bob.cookie }), c = await join({ cookie: carol.cookie });
    const t1 = a1.waitFor((m) => m.t === 'dm'), t2 = a2.waitFor((m) => m.t === 'dm'), echo = b.waitFor((m) => m.t === 'dm');
    b.send({ t: 'dm', to: alice.w.address, text: 'psst' });
    for (const got of await Promise.all([t1, t2, echo])) {
      expect(got).toMatchObject({ from: { a: bob.w.address }, to: { a: alice.w.address }, text: 'psst' });
    }
    await c.quiet(500);
    expect(seen(c, (m) => m.t === 'dm')).toEqual([]);

    b.send({ t: 'dm', to: bob.w.address, text: 'me' });          // too soon after the last one, so the room says slow down first
    expect((await b.waitFor((m) => m.t === 'err')).code).toBe('slow-down');
    await b.quiet(2100);
    b.send({ t: 'dm', to: bob.w.address, text: 'me' });
    expect((await b.waitFor((m) => m.t === 'err' && m.code === 'not-you')).code).toBe('not-you');
    await b.quiet(2100);
    b.send({ t: 'dm', to: 'ST9NOBODY00000000000000000000000000000', text: 'hello?' });
    expect((await b.waitFor((m) => m.t === 'err' && m.code === 'not-here')).code).toBe('not-here');
    closeAll(a1, a2, b, c);
  }, 30_000);

  it('blocking hides both people from each other and nobody else, and the blocked person is not told', async () => {
    const alice = await someone(), bob = await someone(), carol = await someone();
    const a = await join({ cookie: alice.cookie });
    const b1 = await join({ cookie: bob.cookie }), b2 = await join({ cookie: bob.cookie }), c = await join({ cookie: carol.cookie });
    a.send({ t: 'blocks', list: [bob.w.address] });
    expect((await a.waitFor((m) => m.t === 'blocks')).list).toEqual([bob.w.address]);

    b1.send({ t: 'say', text: 'hi everyone' });
    await c.waitFor((m) => m.t === 'say');
    await a.quiet(600);
    expect(seen(a, (m) => m.t === 'say')).toEqual([]);           // Alice does not hear Bob

    a.send({ t: 'say', text: 'hello from alice' });
    await c.waitFor((m) => m.t === 'say' && m.from.a === alice.w.address);
    await b1.quiet(600);
    expect(seen(b1, (m) => m.t === 'say' && m.from.a === alice.w.address)).toEqual([]);   // and Bob does not hear Alice

    b2.send({ t: 'dm', to: alice.w.address, text: 'are you there' });
    await b2.waitFor((m) => m.t === 'dm');                       // Bob sees it as sent, with no error
    await a.quiet(600);
    expect(seen(a, (m) => m.t === 'dm')).toEqual([]);
    expect(seen(b2, (m) => m.t === 'err')).toEqual([]);

    await a.quiet(1500);
    a.send({ t: 'dm', to: bob.w.address, text: 'go away' });     // Alice is told she has him blocked
    expect((await a.waitFor((m) => m.t === 'err' && m.code === 'blocked')).code).toBe('blocked');

    a.send({ t: 'blocks', list: [] });                           // unblocking brings the conversation back
    await a.waitFor((m) => m.t === 'blocks' && m.list.length === 0);
    await b1.quiet(2100);
    b1.send({ t: 'say', text: 'we are friends again' });
    await a.waitFor((m) => m.t === 'say' && m.from.a === bob.w.address);
    closeAll(a, b1, b2, c);
  }, 30_000);

  it('refuses links and over-long messages without using up the speaker\'s chat allowance, and slows down fast talkers', async () => {
    const alice = await someone();
    const a = await join({ cookie: alice.cookie });
    a.send({ t: 'say', text: 'claim your prize at free-chips.xyz' });
    expect((await a.waitFor((m) => m.t === 'err')).code).toBe('no-links');
    a.send({ t: 'say', text: 'x'.repeat(281) });
    await a.waitFor((m) => m.t === 'err' && m.code === 'too-long');
    a.send({ t: 'say', text: '   ' });
    await a.waitFor((m) => m.t === 'err' && m.code === 'empty');
    a.send({ t: 'say', text: 'first' });
    await a.waitFor((m) => m.t === 'say' && m.text === 'first');    // the refused ones did not count against her
    a.send({ t: 'say', text: 'second' });
    expect((await a.waitFor((m) => m.t === 'err' && m.code === 'slow-down')).code).toBe('slow-down');
    closeAll(a);
  }, 30_000);

  it('keeps block lists, the player list and the chat allowance when the room hibernates', async () => {
    const alice = await someone(), bob = await someone();
    const a = await join({ cookie: alice.cookie }), b = await join({ cookie: bob.cookie });
    a.send({ t: 'blocks', list: [bob.w.address] });
    await a.waitFor((m) => m.t === 'blocks');
    b.send({ t: 'say', text: 'before the nap' });
    await b.waitFor((m) => m.t === 'say');
    b.send({ t: 'ping' });
    const before = await b.waitFor((m) => m.t === 'pong');

    await new Promise((r) => setTimeout(r, IDLE_MS));            // nobody says anything

    b.send({ t: 'say', text: 'right after' });                   // the 2-second chat gap is long over, so this is allowed
    await b.waitFor((m) => m.t === 'say' && m.text === 'right after');
    await a.quiet(600);
    expect(seen(a, (m) => m.t === 'say' && m.from.a === bob.w.address)).toEqual([]);   // Alice still has Bob blocked
    b.send({ t: 'hello' });
    const again = await b.waitFor((m) => m.t === 'room' && m !== b.room);
    expect(again.players.map((p: Msg) => p.a)).toEqual(expect.arrayContaining([alice.w.address, bob.w.address]));
    b.send({ t: 'ping' });
    const after = await b.waitFor((m) => m.t === 'pong' && m !== before);
    console.log(`[room-e2e] talk idle ${IDLE_MS} ms; instance start ${before.up} -> ${after.up} (${before.up === after.up ? 'did NOT hibernate' : 'hibernated and woke'})`);
    closeAll(a, b);
  }, 120_000);

  it('keeps a report, and refuses a report about yourself', async () => {
    const alice = await someone(), bob = await someone();
    const a = await join({ cookie: alice.cookie }), b = await join({ cookie: bob.cookie });
    a.send({ t: 'report', who: bob.w.address, why: 'scam', lines: ['send me chips at evil.com'] });
    expect((await a.waitFor((m) => m.t === 'reported')).who).toBe(bob.w.address);
    await a.quiet(2100);
    a.send({ t: 'report', who: alice.w.address, why: 'spam' });
    expect((await a.waitFor((m) => m.t === 'err' && m.code === 'not-you')).code).toBe('not-you');
    await b.quiet(300);
    expect(seen(b, (m) => m.t === 'reported' || m.t === 'err')).toEqual([]);   // the person reported is told nothing (the room is shared, so other tests' chat may pass by)
    closeAll(a, b);
  }, 30_000);
});
