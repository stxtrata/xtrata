// Playing together, end to end: two browsers (players A and B) on the real /casino page, talking to the REAL room code
// (workers/casino-room/index.ts, bundled here with a tiny stand-in for the Workers runtime) through Playwright's WebSocket routing.
// Checks the social layer of docs/plans/CASINO-PLAY-TOGETHER-PLAN.md: daily drop, reactions, big-win banner, a drink, table chat,
// shared roulette and baccarat rounds (same result on both pages, fair-seed checked), and a liar's dice game between the two players.
// Phase 3 (docs/plans/CASINO-COME-BACK-PLAN.md): levels on name tags, a mission paid into the balance, the weekly board, friends and
// a player card, the balance following a player to a new device, a slot tournament from start to prize, the progressive jackpot,
// and a real machine spin reported to the room. The schedule is shortened (CASINO_SCHEDULE) so a tournament runs every two minutes.
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
// A tournament every 2.5 minutes (the first 110 s of each), and a 2-second happy hour that the other checks will not meet.
const room = new CasinoRoom(ctx, { CASINO_SCHEDULE: JSON.stringify({ period: 150000, tour: [0, 110000], hh: [120000, 2000] }), CASINO_JACKPOT_ODDS: '1000000000' });
const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8', B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';

const SITE = 'https://xtrata.test';
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.glb': 'model/gltf-binary' };
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
async function player(address, start = 1000000) {
  const context = await browser.newContext({ viewport: { width: 320, height: 240 } });
  await context.addInitScript((start) => {
    try { localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({ bank: start })); for (const id of ['blackjack', 'roulette', 'sicbo', 'baccarat', 'videopoker', 'pvpholdem', 'liars']) localStorage.setItem('parallax.rules.v1.' + id, 'true'); } catch (e) { }
  }, start);
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
    room.accept(fake, address, 'k' + address, true, { name: 'p' + address.slice(-6).toLowerCase() + '.btc', checked: true }).catch((e) => console.log('accept failed', e));
    ws.onMessage((m) => { room.webSocketMessage(fake, String(m)); });
    ws.onClose(() => { fake.open = false; room.webSocketClose(fake, 1000, 'bye'); });
  });
  await page.goto(SITE + '/casino/?passkey=0&regulars=0&lite=1', { waitUntil: 'domcontentloaded', timeout: 180000 });
  page.on('console', (m) => { if (process.env.DEBUG) console.log('[page]', m.type(), m.text().slice(0, 300)); });
  try { await page.waitForFunction(() => window.__casinoView?.table && window.__pxRoom?.state?.connected && window.__pxRoom.state.signed, null, { timeout: 180000 }); }
  catch (e) { console.log('not ready:', JSON.stringify(await page.evaluate(() => ({ view: !!window.__casinoView?.table, host: !!window.PXRoomHost, social: !!window.__pxSocial, roomjs: [...document.scripts].map((x) => x.src).filter((x) => /room/.test(x)), room: window.__pxRoom?.state || null }))), errors, warnings); throw e; }
  return { context, page, errors, warnings, address };
}
const T = (p, fn, arg) => p.page.evaluate(fn, arg);
const until = async (p, fn, arg, ms = 120000, what = 'condition') => {
  const t0 = Date.now();
  for (;;) {
    if (await T(p, fn, arg)) return;
    if (Date.now() - t0 > ms) {
      for (const q of [a, b]) if (q) console.log('diagnostics', q.address.slice(0, 5), JSON.stringify(await T(q, () => ({ shared: window.__pxShared && window.__pxShared(), view: window.__casinoView.table.view(), focus: window.__casinoView.table.id, sync: window.__pxSocial && window.__pxSocial.progress.sync, credited: window.__pxSocial && window.__pxSocial.progress.credited, bank: window.__casino.bank, roomAt: window.__pxSocial && window.__pxSocial.progress.roomAt }))), q.warnings.slice(-6));
      console.log('room peers', JSON.stringify(ctx.getWebSockets().map((w) => w.att && { a: w.att.a && w.att.a.slice(0, 5), spot: w.att.spot, rb: w.att.rb, wt: w.att.wt })), 'counters', JSON.stringify([...store.entries()].filter(([k]) => k.startsWith('c:'))), 'server now round', Math.floor(Date.now() / 32000), 'balances', JSON.stringify([...store.entries()].filter(([k]) => k.startsWith('b:'))));
      throw new Error('timed out waiting for ' + what);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
};
const bank = (p) => T(p, () => window.__casino.bank);
const send = (p, msg) => T(p, (m) => window.dispatchEvent(new CustomEvent('px-room-send', { detail: m })), msg);
// LAYR the room credited to a page (mission rewards, prizes): the other checks allow for it.
const cred = (p) => T(p, () => (window.__pxSocial && window.__pxSocial.progress.credited) || 0);

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
const a0 = await bank(a), c0 = await cred(a), beer = await T(a, () => window.__pxSocial.priceOf('beer'));
await send(a, { t: 'gift', to: B, d: 'beer' });
await until(a, (x) => window.__casino.bank === x[0] - x[1] + (window.__pxSocial.progress.credited - x[2]), [a0, beer, c0], 20000, 'A pays for the beer');
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
const before = await bank(a), rc0 = await cred(a);
const rdbg = (p) => T(p, () => window.__casino.stations[1].debug());
await T(a, () => { window.__casinoView.table.chip(100); return window.__casinoView.table.act('bet', { k: 'red' }); });
assert.deepEqual((await rdbg(a)).bets, { red: 100 }, 'A has 100 on red');
await until(b, (x) => window.__casino.stations[1].debug().sh.seen.includes(x), A, 60000, 'B sees A\'s bet');
await until(a, () => window.__casino.stations[1].debug().settled >= 1, null, 300000, 'A\'s bet is settled');
const na = (await rdbg(a)).last;
await until(b, (x) => window.__casino.stations[1].debug().last === x, na, 60000, 'B shows the same spin');
const nb = (await rdbg(b)).last;
assert.equal(na, nb, 'both pages show the same number');
const after = (await bank(a)) - ((await cred(a)) - rc0), red = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
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
const ba = await bank(a), bb = await bank(b), ca0 = await cred(a), cb0 = await cred(b);
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
const da = (await bank(a)) - ba - ((await cred(a)) - ca0), db = (await bank(b)) - bb - ((await cred(b)) - cb0);
assert.ok(da + db <= 0 && da + db >= -2, `stakes moved from one player to the other, less a small rake (${da} + ${db})`);
console.log(`ok liar's dice between the two players: A ${da}, B ${db}`);

}
// ---------------- phase 3: coming back ----------------
const P = (p) => T(p, () => { const x = window.__pxSocial.progress; return { me: x.me, tour: x.tour, credited: x.credited, friends: x.friends, card: x.card, board: x.board, night: x.night, jp: x.jp, hh: x.hh }; });
if (!ONLY || ONLY.split(',').includes('progress')) {
await leave(a); await leave(b);
await until(a, () => !!window.__pxSocial.progress.me, null, 30000, 'A has a profile');
const me0 = (await P(a)).me, m0 = me0.missions.list[0];
assert.ok(/^(hands|spins)-/.test(m0.id) && !m0.done, 'the first mission is a play mission: ' + m0.id);
const g0 = m0.id.slice(m0.id.indexOf('-') + 1), k0 = m0.id.startsWith('spins') ? 'spin' : 'hand';      // a floor machine's id may have hyphens of its own (who-is-satoshi)
const bank0 = await bank(a), credit0 = await cred(a);
for (let i = 0; i < m0.need; i++) await send(a, { t: 'log', k: k0, g: g0, bet: 10, won: 0 });
await until(a, () => window.__pxSocial.progress.me.missions.list[0].done, null, 30000, 'A completes a mission');
await until(a, (x) => window.__casino.bank === x[0] + (window.__pxSocial.progress.credited - x[1]) && window.__pxSocial.progress.credited - x[1] >= x[2], [bank0, credit0, m0.reward], 30000, 'the mission reward reaches A\'s balance');
await until(a, () => /Mission done/.test(document.getElementById('toast')?.textContent || ''), null, 20000, 'A is told about the mission');
console.log(`ok a daily mission (${m0.text}) paid +${m0.reward} LAYR into the balance`);
const lvA = (await P(a)).me.lv;
assert.ok(lvA >= 2, 'A has levelled up: ' + lvA);
await until(b, (x) => (window.__pxSocial.tags()[x] || {}).lv >= 2, A, 20000, 'B sees A\'s level on the name tag');
console.log(`ok levels: A is level ${lvA}, and B's page has it for A's name tag`);
await T(a, () => { document.getElementById('pxMeBtn').click(); [...document.querySelectorAll('#pxMe .tabs button')].find((x) => x.textContent === 'This week').click(); });
await until(a, (x) => { const b = window.__pxSocial.progress.board; return b && b.cur.play.some((e) => e.a === x) && b.cur.xp.some((e) => e.a === x); }, A, 20000, 'A is on this week\'s boards');
assert.ok(await T(a, () => /Most XP/.test(document.getElementById('pxMe').textContent)), 'the boards are shown');
console.log('ok the weekly boards');
await send(b, { t: 'friends', list: [A] });
await until(b, (x) => window.__pxSocial.progress.friends.includes(x), A, 20000, 'B has A as a friend');
await send(b, { t: 'card', a: A });
await until(b, (x) => { const c = window.__pxSocial.progress.card; return c && c.a === x && c.lv >= 2; }, A, 20000, 'B sees A\'s card');
assert.equal(store.get('f:k' + B)?.[0], A, 'the friend list is kept by the room');
console.log('ok friends and player cards');

// the balance follows A to a new device (a new browser with no chips): it shows A's balance, and its play counts for A
await new Promise((r) => setTimeout(r, 3000));          // let A's last change reach the room
const aBank = await bank(a), serverA = store.get('b:k' + A)?.v;
assert.equal(serverA, aBank, 'the room has A\'s balance');
// (A's first device closes first: three software-rendered pages do not fit this test machine. One LAYR of the new browser's own
// joins the account the first time it syncs.)
await a.context.close();
const c = await player(A, 1);
await until(c, (x) => window.__casino.bank === x + 1, aBank, 60000, 'the new device shows A\'s balance (and its own 1 LAYR)');
await T(c, () => window.__casino.setBank(window.__casino.bank - 1234));
await new Promise((r) => setTimeout(r, 4000));
assert.equal(store.get('b:k' + A)?.v, aBank + 1 - 1234, 'the new device\'s change reached the room');
a = c;                                                    // A plays on from the new device
await until(a, () => !!window.__pxSocial.progress.me, null, 30000, 'A\'s profile on the new device');
console.log(`ok the balance follows the player: ${aBank} on a new device (plus its own 1), and its change went back to the room`);

// the slot tournament: A joins, scores, wins the prize when it ends; B sees the standings and the result
await until(a, () => { const t = window.__pxSocial.progress.tour; return t && t.on && t.end - Date.now() > 75000; }, null, 200000, 'a tournament is running');
const tg = (await P(a)).tour.g, ct0 = await cred(a);
await send(a, { t: 'tjoin' });
await until(a, () => !!(window.__pxSocial.progress.tour || {}).mine, null, 20000, 'A has joined');
for (const won of [0, 50, 0, 120]) await send(a, { t: 'log', k: 'spin', g: tg, bet: 10, won });
await until(b, (x) => (window.__pxSocial.progress.tour.top || []).some((e) => e.a === x && e.sc === 17), A, 20000, 'B sees A on 17x');
assert.ok(await T(b, () => /tournament/.test(document.getElementById('pxEvents').textContent)), 'the tournament is on the strip');
await until(b, () => /tournament: 1\./.test(document.getElementById('pxWinBanner')?.textContent || ''), null, 120000, 'B sees the result');
await until(a, (x) => window.__pxSocial.progress.credited - x >= 50000, ct0, 30000, 'A is paid the first prize');
assert.ok(store.get('p:k' + A).bd.includes('champion'), 'A has the champion badge');
console.log(`ok a slot tournament on ${tg}: A 17x, first prize 50,000 LAYR`);

// the progressive jackpot: every spin wins it for a moment
const jp0 = (await P(a)).jp, cj0 = await cred(a);
room.env.CASINO_JACKPOT_ODDS = '1';
await send(a, { t: 'log', k: 'spin', g: 'nv', bet: 100, won: 0 });
await until(b, () => /PROGRESSIVE JACKPOT/.test(document.getElementById('pxWinBanner')?.textContent || ''), null, 20000, 'B sees the jackpot');
room.env.CASINO_JACKPOT_ODDS = '1000000000';
await until(a, (x) => window.__pxSocial.progress.credited - x >= 100000, cj0, 20000, 'A is paid the jackpot');
await until(b, () => window.__pxSocial.progress.jp === 100000, null, 20000, 'the jackpot starts again');
console.log(`ok the progressive jackpot: ${jp0} won, back to 100,000`);

// a real spin on a machine is reported (the settle hook), and counted for "Tonight"
const s0 = store.get('p:k' + A).st.s;
await T(a, () => window.__casino.openMachine(4));
await until(a, () => { const b = document.getElementById('pxMachineSpin'); return b && !b.disabled && b.textContent !== 'Reconnect' && !/Connecting/.test(document.getElementById('pxMachineStatus').textContent); }, null, 180000, 'the machine is ready');
await T(a, () => document.getElementById('pxMachineSpin').click());
await until(a, () => window.__pxSocial.progress.night.spins >= 1, null, 180000, 'the spin is counted');
await new Promise((r) => setTimeout(r, 2000));
assert.ok(store.get('p:k' + A).st.s > s0, 'the room counted the spin');
await T(a, () => window.__casino.closeMachine());
console.log('ok a real machine spin reached the room');
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
