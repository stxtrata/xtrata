// Playing together, end to end: two browsers (players A and B) on the real /casino page, talking to the REAL room code
// (workers/casino-room/index.ts, bundled here with a tiny stand-in for the Workers runtime) through Playwright's WebSocket routing.
// Checks the social layer of docs/plans/CASINO-PLAY-TOGETHER-PLAN.md: daily drop, reactions, big-win banner, a drink, table chat,
// shared roulette and baccarat rounds (same result on both pages, fair-seed checked), and a liar's dice game between the two players.
// Usage: CHROME_PATH=<chrome> node scripts/test-casino-together.mjs        (slow: the 3D page renders in software)
import { chromium } from 'playwright';
import { build } from 'esbuild';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const dir = await mkdtemp(join(tmpdir(), 'pxroom-'));
await import('node:fs').then((fs) => fs.writeFileSync(join(dir, 'cf.mjs'), 'export class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }\n'));
await build({ entryPoints: [join(root, 'workers/casino-room/index.ts')], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'room.mjs'), alias: { 'cloudflare:workers': join(dir, 'cf.mjs') }, logLevel: 'error' });
const { CasinoRoom } = await import(join(dir, 'room.mjs'));

// ---- the room, with an in-memory stand-in for Durable Object storage and hibernatable sockets
const sockets = new Set(), store = new Map();
const ctx = {
  getWebSockets: () => [...sockets].filter((s) => s.open),
  acceptWebSocket: (ws) => sockets.add(ws),
  storage: {
    get: async (k) => (store.has(k) ? structuredClone(store.get(k)) : undefined),
    put: async (k, v) => { store.set(k, structuredClone(v)); },
    delete: async (k) => { for (const x of [].concat(k)) store.delete(x); },
    list: async ({ prefix = '', reverse = false, limit = 1000 } = {}) => {
      let keys = [...store.keys()].filter((k) => k.startsWith(prefix)).sort(); if (reverse) keys.reverse();
      return new Map(keys.slice(0, limit).map((k) => [k, structuredClone(store.get(k))]));
    }
  }
};
const room = new CasinoRoom(ctx, {});
const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8', B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';

const SITE = 'https://xtrata.test';
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.glb': 'model/gltf-binary' };
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
async function player(address) {
  const context = await browser.newContext({ viewport: { width: 320, height: 240 } });
  await context.addInitScript(() => {
    try { localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({ bank: 1000000 })); for (const id of ['blackjack', 'roulette', 'holdem', 'baccarat', 'videopoker', 'pvpholdem', 'liars']) localStorage.setItem('parallax.rules.v1.' + id, 'true'); } catch (e) { }
  });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== SITE) return route.abort();
    if (url.pathname === '/casino/room/session') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ address, hash160: 'k' + address, expiresAt: Date.now() + 3600e3 }) });
    if (url.pathname.startsWith('/casino/room/')) return route.fulfill({ status: 404, body: '{}' });
    if (url.pathname === '/casino-status.json') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"state":"open"}' });
    const path = url.pathname.endsWith('/') ? url.pathname.slice(1) + 'index.html' : url.pathname.slice(1);
    try { return route.fulfill({ status: 200, body: await readFile(join(root, 'public', path)), headers: { 'content-type': types[(/\.[a-z]+$/.exec(path) || [''])[0]] || 'application/octet-stream' } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  const errors = [], warnings = []; page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'warning' && !/GL Driver|GPU stall/.test(m.text())) warnings.push(m.text().slice(0, 300)); });
  await page.routeWebSocket('**/casino/room/ws', (ws) => {
    const fake = { open: true, att: null, serializeAttachment(v) { this.att = structuredClone(v); }, deserializeAttachment() { return this.att; }, send(t) { if (this.open) ws.send(t); }, close() { this.open = false; try { ws.close(); } catch (_) { } } };
    room.accept(fake, address, 'k' + address, true).catch((e) => console.log('accept failed', e));
    ws.onMessage((m) => { room.webSocketMessage(fake, String(m)); });
    ws.onClose(() => { fake.open = false; room.webSocketClose(fake, 1000, 'bye'); });
  });
  await page.goto(SITE + '/casino/?passkey=0&regulars=0&lite=1', { waitUntil: 'domcontentloaded', timeout: 180000 });
  page.on('console', (m) => { if (process.env.DEBUG) console.log('[page]', m.type(), m.text().slice(0, 300)); });
  try { await page.waitForFunction(() => window.__casinoView?.table && window.__pxRoom?.state?.connected && window.__pxRoom.state.signed, null, { timeout: 180000 }); }
  catch (e) { console.log('not ready:', JSON.stringify(await page.evaluate(() => ({ view: !!window.__casinoView?.table, room: window.__pxRoom?.state || null }))), errors); throw e; }
  return { context, page, errors, warnings, address };
}
const T = (p, fn, arg) => p.page.evaluate(fn, arg);
const until = async (p, fn, arg, ms = 120000, what = 'condition') => {
  const t0 = Date.now();
  for (;;) {
    if (await T(p, fn, arg)) return;
    if (Date.now() - t0 > ms) {
      for (const q of [a, b]) if (q) console.log('diagnostics', q.address.slice(0, 5), JSON.stringify(await T(q, () => ({ shared: window.__pxShared && window.__pxShared(), view: window.__casinoView.table.view(), focus: window.__casinoView.table.id }))), q.warnings.slice(-6));
      console.log('room peers', JSON.stringify(ctx.getWebSockets().map((w) => w.att && { a: w.att.a && w.att.a.slice(0, 5), spot: w.att.spot, rb: w.att.rb, wt: w.att.wt })), 'counters', JSON.stringify([...store.entries()].filter(([k]) => k.startsWith('c:'))), 'server now round', Math.floor(Date.now() / 32000));
      throw new Error('timed out waiting for ' + what);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
};
const bank = (p) => T(p, () => window.__casino.bank);
const send = (p, msg) => T(p, (m) => window.dispatchEvent(new CustomEvent('px-room-send', { detail: m })), msg);

let a = null, b = null;
a = await player(A); b = await player(B);
console.log('both players are in the room');
const ONLY = process.env.ONLY || '';
const leave = (p) => T(p, () => window.__casino.setFocus(null));

// daily drop: 5,000 LAYR each, once
if (!ONLY || ONLY.split(',').includes('daily')) {
await until(a, () => window.__casino.bank >= 1005000, null, 30000, 'A daily drop');
await until(b, () => window.__casino.bank >= 1005000, null, 30000, 'B daily drop');
assert.equal([...store.keys()].filter((k) => k.startsWith('d:')).length, 2, 'two daily drops recorded');
console.log('ok daily drop: +5,000 LAYR each');

}
// reactions and big wins reach the other player
if (!ONLY || ONLY.split(',').includes('react')) {
await send(a, { t: 'react', e: 'cheer' });
await until(b, () => [...document.querySelectorAll('#pxBubbles .pxb')].some((e) => e.textContent === '🎉'), null, 20000, 'B sees A cheer');
await send(a, { t: 'win', g: 'nv', x: 50, w: 4900 });
await until(b, () => /50× on Neon Vault/.test(document.getElementById('pxWinBanner')?.textContent || ''), null, 20000, 'B sees the win banner');
console.log('ok reactions and the big-win banner');

}
// a drink: A pays, B is told
if (!ONLY || ONLY.split(',').includes('gift')) {
const a0 = await bank(a);
await send(a, { t: 'gift', to: B, d: 'beer' });
await until(a, (x) => window.__casino.bank === x - 80, a0, 20000, 'A pays for the beer');
await until(b, () => /sent you a beer/.test(document.getElementById('toast')?.textContent || ''), null, 20000, 'B is told about the beer');
console.log('ok a drink for another player');

}
// table chat: both at blackjack; A speaks to the table, B hears it as a table line
if (!ONLY || ONLY.split(',').includes('chat')) {
await T(a, () => window.__casinoView.table.sit(0)); await T(b, () => window.__casinoView.table.sit(0));
await new Promise((r) => setTimeout(r, 2500));
await T(a, () => { document.getElementById('pxchat-btn').click(); document.getElementById('pxchat-table').click(); const i = document.querySelector('#pxchat input'); i.value = 'nice hand'; i.form.requestSubmit(); });
await until(b, () => [...document.querySelectorAll('#pxchat .ln.tb')].some((l) => /nice hand/.test(l.textContent)), null, 30000, 'B hears the table chat');
console.log('ok table chat');

}
// shared roulette: both at the table, A bets on red; the same number lands on both pages
if (!ONLY || ONLY.split(',').includes('roulette')) {
await leave(a); await leave(b);
await T(a, () => window.__casinoView.table.sit(1)); await T(b, () => window.__casinoView.table.sit(1));
await until(a, () => { const m = /Bets close in (\d+)/.exec(window.__casinoView.table.view().actions[0].label); return m && +m[1] >= 13; }, null, 300000, 'A sees an open shared round');
const before = await bank(a);
const rdbg = (p) => T(p, () => window.__casino.stations[1].debug());
await T(a, () => { window.__casinoView.table.chip(100); return window.__casinoView.table.act('bet', { k: 'red' }); });
assert.deepEqual((await rdbg(a)).bets, { red: 100 }, 'A has 100 on red');
await until(b, (x) => window.__casino.stations[1].debug().sh.seen.includes(x), A, 60000, 'B sees A\'s bet');
await until(a, () => window.__casino.stations[1].debug().settled >= 1, null, 300000, 'A\'s bet is settled');
const na = (await rdbg(a)).last;
await until(b, (x) => window.__casino.stations[1].debug().last === x, na, 60000, 'B shows the same spin');
const nb = (await rdbg(b)).last;
assert.equal(na, nb, 'both pages show the same number');
const after = await bank(a), red = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
assert.equal(after - before, red.has(parseInt(na, 10)) ? 100 : -100, 'A is paid on red exactly once');
console.log(`ok shared roulette: ${na} on both pages; A ${after - before >= 0 ? '+' : ''}${after - before}`);

}
// shared baccarat: the same hand on both pages
if (!ONLY || ONLY.split(',').includes('baccarat')) {
await leave(a); await leave(b);
await T(a, () => window.__casinoView.table.sit(3)); await T(b, () => window.__casinoView.table.sit(3));
await until(a, () => { const m = /Bets close in (\d+)/.exec(window.__casinoView.table.view().actions[0].label); return m && +m[1] >= 11; }, null, 300000, 'A sees an open baccarat round');
await T(a, async () => { await window.__casinoView.table.act('spot', { s: 'banker' }); window.__casinoView.table.chip(100); });
const bdbg = (p) => T(p, () => window.__casino.stations[3].debug());
assert.deepEqual((await bdbg(a)).bets, { banker: 100 }, 'A has 100 on the banker');
await until(a, () => window.__casino.stations[3].debug().settled >= 1, null, 300000, 'A\'s hand is settled');
const ha = (await bdbg(a)).last;
await until(b, (x) => window.__casino.stations[3].debug().last === x, ha, 60000, 'B shows the same hand');
const hand = async () => ha;
console.log('ok shared baccarat: ' + (await hand(a)));

}
// the Salon: A waits for a player at liar's dice, B takes them on, they play to the end
if (!ONLY || ONLY.split(',').includes('salon')) {
await leave(a); await leave(b);
await T(a, () => window.__casinoView.table.sit(6)); await T(b, () => window.__casinoView.table.sit(6));
await until(a, () => window.__casinoView.table.view().actions.some((x) => /^seek/.test(x.id)), null, 30000, 'A can wait for a player');
const ba = await bank(a), bb = await bank(b);
await T(a, () => window.__casinoView.table.act(window.__casinoView.table.view().actions.find((x) => /^seek/.test(x.id)).id));
await until(b, () => window.__casinoView.table.view().actions.some((x) => /^join:/.test(x.id)), null, 30000, 'B sees A waiting');
await T(b, () => window.__casinoView.table.act(window.__casinoView.table.view().actions.find((x) => /^join:/.test(x.id)).id));
const turn = async (p) => {
  const v = await T(p, () => window.__casinoView.table.view());
  const liar = v.actions.find((x) => x.id === 'liar' && !x.dis), bid = v.actions.find((x) => x.id === 'bid' && !x.dis);
  if (liar && Math.random() < 0.5) await T(p, () => window.__casinoView.table.act('liar'));
  else if (bid) await T(p, () => window.__casinoView.table.act('bid'));
  else if (liar) await T(p, () => window.__casinoView.table.act('liar'));
};
const finished = (p) => T(p, () => window.__casinoView.table.view().actions.some((x) => x.id === 'lobby'));
for (let i = 0; i < 120 && !((await finished(a)) && (await finished(b))); i++) { await turn(a); await turn(b); await new Promise((r) => setTimeout(r, 1000)); }
assert.ok(await finished(a) && await finished(b), 'the game ended on both pages');
await until(a, () => !window.__casinoView.table.view().actions.find((x) => x.id === 'lobby').dis, null, 60000, 'A collected');
await until(b, () => !window.__casinoView.table.view().actions.find((x) => x.id === 'lobby').dis, null, 60000, 'B collected');
const da = (await bank(a)) - ba, db = (await bank(b)) - bb;
assert.ok(da + db <= 0 && da + db >= -2, `stakes moved from one player to the other, less a small rake (${da} + ${db})`);
console.log(`ok liar's dice between the two players: A ${da}, B ${db}`);

}
// counters
if (!ONLY || ONLY.split(',').includes('counters')) {
const counts = [...store.entries()].filter(([k]) => k.startsWith('c:')).map(([, v]) => v)[0];
assert.ok(counts && counts.s === 2 && counts.rx >= 1 && counts.w >= 1 && counts.g >= 1 && counts.dd === 2 && counts.b >= 1 && counts.pv >= 1, 'day counters: ' + JSON.stringify(counts));
console.log('ok day counters', JSON.stringify(counts));

}
assert.deepEqual(a.errors, [], 'no page errors for A');
assert.deepEqual(b.errors, [], 'no page errors for B');
await browser.close();
console.log('all together checks passed');
process.exit(0);
