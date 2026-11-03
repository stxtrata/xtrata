// Two browsers, one Salon game: runs the page's own HoldemModel, DiceModel and PvpCore (read from public/casino/index.html) and plays
// a heads-up Hold'em hand and a liar's dice game between a host and a guest over a relay (each message passes through JSON, as the
// room would pass it). Checks that both copies of the table agree at every block and that the pot is paid out once.
// Usage: node scripts/test-salon-relay.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../public/casino/index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const pick = (needle) => { const s = scripts.find((x) => x.includes(needle)); if (!s) throw new Error('script not found: ' + needle); return s; };
const timers = [];
const ctx = { console, structuredClone, crypto: globalThis.crypto, TextEncoder, Uint8Array, Math, Date, Promise, setTimeout: (f, ms) => { timers.push(f); return 0; }, setInterval: () => 0, clearInterval: () => {} };
ctx.globalThis = ctx; ctx.window = ctx;
vm.createContext(ctx);
for (const needle of ['root.DiceModel =', 'root.HoldemModel =', 'root.PvpCore =']) vm.runInContext(pick(needle), ctx);
const { PvpCore } = ctx;
assert.ok(PvpCore.makeRelayChain, 'relay chain exported');

const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8', B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
const flush = async () => { for (let i = 0; i < 5; i++) await new Promise((r) => setImmediate(r)); };

async function match(kind) {
  const toGuest = [], toHost = [];
  const hostChain = PvpCore.makeRelayChain({ host: true, me: A, other: B, send: (d) => toGuest.push(JSON.parse(JSON.stringify(d))) });
  const guestChain = PvpCore.makeRelayChain({ host: false, me: B, other: A, send: (d) => toHost.push(JSON.parse(JSON.stringify(d))) });
  const stake = kind === 'dice' ? 25 : 100;
  const mk = kind === 'dice' ? PvpCore.DiceSession : PvpCore.HoldemSession;
  const opts = (me, opp) => (kind === 'dice' ? { me, opp, oppName: 'X', stake } : { me, opp, oppName: 'X', buyin: stake });
  const host = mk(hostChain, opts(A, B)), guest = mk(guestChain, opts(B, A));
  const pump = async () => {
    while (toHost.length) hostChain.fromGuest(toHost.shift());
    hostChain.tick();
    await flush();
    while (toGuest.length) guestChain.fromHost(toGuest.shift());
    await flush();
    host.autopilot(); guest.autopilot();
    while (timers.length) timers.shift()();
    await flush();
  };
  const opened = kind === 'dice' ? host.open({ stake, turn: 60 }) : host.open({ bb: 2, bbs: 50, turn: 60 });
  await pump(); assert.ok(!(await opened).err, 'host opened the table');
  let steps = 0;
  while (steps++ < 200) {
    await pump();
    const hv = host.view(), gv = guest.view();
    assert.equal(JSON.stringify(hostChain.table.games.get(host.st.id), (k, v) => (v instanceof Uint8Array ? [...v] : v)),
      JSON.stringify(guestChain.table.games.get(guest.st.id), (k, v) => (v instanceof Uint8Array ? [...v] : v)), 'both tables agree');
    if (hv && hv.done && gv && gv.done) break;
    // whoever's turn it is plays something simple
    for (const [s, v] of [[host, hv], [guest, gv]]) {
      if (!v || !v.canAct) continue;
      if (kind === 'dice') { if (v.g.qty >= 3) s.challenge(); else { const nb = v.next[0]; s.bid(nb[0], nb[1]); } }
      else s.act(1, 0);
    }
  }
  const hv = host.view(), gv = guest.view();
  if (!(hv.done && gv.done)) console.log('stuck', JSON.stringify({ hs: hv && hv.state, gs: gv && gv.state, g: hostChain.table.games.get(host.st.id), hmy: hv && hv.myTurn, gmy: gv && gv.myTurn, hca: hv && hv.canAct, gca: gv && gv.canAct, hbusy: host.st.busy, gbusy: guest.st.busy, gwait: [...guestChain.waiting.keys()], hq: hostChain.queue.length, hready: hv && hv.ready, gready: gv && gv.ready, log: hostChain.table.log.slice(-6) }, (k, v) => (v instanceof Uint8Array ? 'u8' : v)).slice(0, 2500));
  assert.ok(hv.done && gv.done, kind + ': the game finished on both sides (' + steps + ' blocks)');
  const ph = host.collect(), pg = guest.collect();
  assert.equal(ph + pg, stake * 2 - (hostChain.table.bal.HOUSE || 0), kind + ': the pot is paid out once, minus the rake');
  assert.equal(hostChain.table.bal.HOUSE, guestChain.table.bal.HOUSE, kind + ': both sides agree on the rake');
  host.dispose(); guest.dispose();
  console.log(`ok ${kind}: ${steps} blocks, host got ${ph}, guest got ${pg}, rake ${hostChain.table.bal.HOUSE}`);
}

await match('dice');
await match('holdem');
// a guest cannot play as the host
{
  const toHost = [];
  const hostChain = PvpCore.makeRelayChain({ host: true, me: A, other: B, send: () => {} });
  hostChain.table = { act: () => { throw new Error('should not run'); } };
  hostChain.fromGuest({ id: 'x', m: 'act', args: [A, 1, 1, 0] });
  assert.equal(hostChain.queue.length, 0, 'a call made as the host by the guest is dropped');
  hostChain.fromGuest({ id: 'y', m: 'transfer', args: [B] });
  assert.equal(hostChain.queue.length, 0, 'an unknown method is dropped');
  console.log('ok relay refuses calls made as the other player');
}
process.exit(0);
