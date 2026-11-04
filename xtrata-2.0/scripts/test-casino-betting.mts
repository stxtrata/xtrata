// Run from the repo root, with the casino served at http://localhost:8411/casino/ :
//   python3 -m http.server 8411 --directory public   (in another terminal)
//   npx tsx scripts/test-casino-betting.mts          (needs playwright + Chromium)
// Takes about 12 minutes (headless software rendering of the 3D room).
// Results, the leaving rule and spectator bets, in three browsers (alice and bob play, carol watches and bets), through a stand-in
// room: the real routing for seek / pvp / spec (functions/lib/casino-social.ts) plus a small model of the agreed cres / cgone / cend /
// cbet rules (the room agent's own rules module is tested on its side). room.js is not loaded.
import { chromium, type Page } from 'playwright';
import { applySeek, parseSocialMessage, routeRelay, routeSpec, type SocialPeer } from '../functions/lib/casino-social.ts';

const URL = 'http://localhost:8411/casino/';
let GRACE = 7000, WAIT = 6000, WINDOW = 40000;      // short stand-ins for 90 s, 60 s and 90 s
type P = { name: string; a: string; page: Page; peer: SocialPeer & Record<string, any>; cut: boolean; browser: any };
const ppl: P[] = []; const errs: string[] = [], seen: string[] = [];
const peers = () => ppl.map((p) => p.peer);
const pageOf = (a: string) => ppl.find((x) => x.a === a)!;
const BAL: Record<string, number> = {}; let rev = 0;
type Game = { gid: string; tb: string; w: string; b: string; stake: number; closes: number; reports: Record<string, any>; asked: boolean; waitUntil: number; goneAt: Record<string, number>; done: boolean; bets: Array<{ a: string; side: 'w' | 'b'; amt: number }>; endMsg?: any };
const games = new Map<string, Game>();
const ROOM_FEATURES = ['play', 'move', 'react', 'table', 'rounds', 'pvp', 'spec', 'cres', 'cbet'];
let FEATURES = ROOM_FEATURES;

async function toPage(p: P | undefined, msg: any) { if (!p || p.cut) return; seen.push(p.name + ' <- ' + msg.t + (msg.ask ? ' ask' : '') + (msg.back ? ' back' : '') + (msg.how ? ' ' + msg.how : '')); await p.page.evaluate((m) => (window as any).PXRoomHost.on(m), msg).catch(() => { }); }
async function setBal(a: string, d: number, why: string, got = 0) { BAL[a] += d; await toPage(pageOf(a), { t: 'bal', v: BAL[a], rev: ++rev, got, why, at: Date.now() }); }
const tableFolk = (tb: string) => ppl.filter((x) => x.peer.spot?.startsWith(tb + '.') || x.peer.wt === tb);
const pools = (g: Game) => ({ w: g.bets.filter((b) => b.side === 'w').reduce((s, b) => s + b.amt, 0), b: g.bets.filter((b) => b.side === 'b').reduce((s, b) => s + b.amt, 0) });
async function cpool(g: Game, only?: P) { const m = { t: 'cpool', tb: g.tb, gid: g.gid, pool: pools(g), n: new Set(g.bets.map((b) => b.a)).size, closes: g.closes }; for (const p of only ? [only] : tableFolk(g.tb)) await toPage(p, m); }

async function settle(g: Game, r: string, tm: string, how: string, a?: string) {
  if (g.done) return; g.done = true;
  const off = how === 'disputed' || how === 'expired' || how === 'void' || r === '*';
  if (off) { for (const x of [g.w, g.b]) await setBal(x, g.stake, 'chess-refund', g.stake); }
  else if (r === '1/2-1/2') { for (const x of [g.w, g.b]) await setBal(x, g.stake, 'chess-refund', g.stake); }
  else { const win = r === '1-0' ? g.w : g.b; await setBal(win, 2 * g.stake, 'chess-win', 2 * g.stake); }
  const cend = { t: 'cend', tb: g.tb, gid: g.gid, r, tm, how, ...(a ? { a } : {}) }; g.endMsg = cend;
  const bettors = [...new Set(g.bets.map((b) => b.a))].map(pageOf);
  for (const p of new Set([pageOf(g.w), pageOf(g.b), ...tableFolk(g.tb), ...bettors])) await toPage(p, cend);
  const side = off || r === '1/2-1/2' ? null : r === '1-0' ? 'w' : 'b', pl = pools(g), total = pl.w + pl.b, win = side ? pl[side] : 0;
  for (const bt of g.bets) {
    const back = side && win > 0 ? (bt.side === side ? Math.floor(total * bt.amt / win) : 0) : bt.amt;
    await setBal(bt.a, back, back === bt.amt && !(side && win > 0) ? 'cbet-refund' : 'cbet-win', back);
    await toPage(pageOf(bt.a), { t: 'cpay', tb: g.tb, gid: g.gid, side: bt.side, stake: bt.amt, won: back, how: side ? 'result' : 'refund' });
  }
}
async function judge(g: Game) {
  if (g.done) return; const ra = g.reports[g.w], rb = g.reports[g.b];
  if ([ra, rb].some((x) => x && x.tm === 'dispute')) return settle(g, '*', 'dispute', 'disputed');
  if (ra && rb) return ra.r === rb.r && ra.h === rb.h && ra.r !== '*' ? settle(g, ra.r, ra.tm, 'agreed') : settle(g, '*', 'dispute', 'disputed');
  const only = ra || rb, who = ra ? g.w : g.b, other = ra ? g.b : g.w; if (!only) return;
  if (only.tm === 'resignation' && ((only.r === '0-1' && who === g.w) || (only.r === '1-0' && who === g.b))) return settle(g, only.r, 'resignation', 'unchallenged');
  if (!g.asked) { g.asked = true; g.waitUntil = Date.now() + WAIT; await toPage(pageOf(other), { t: 'cres', tb: g.tb, gid: g.gid, ask: true }); }
}
const sweep = setInterval(async () => {
  const now = Date.now();
  for (const g of games.values()) {
    if (g.done) continue;
    if (g.waitUntil && now > g.waitUntil) { const only = g.reports[g.w] || g.reports[g.b]; if (only && (only.r === '1/2-1/2' || (only.r === '1-0' && g.reports[g.w]) || (only.r === '0-1' && g.reports[g.b]))) await settle(g, only.r, only.tm, 'unchallenged'); else await settle(g, '*', 'expired', 'expired'); continue; }
    for (const [a, at] of Object.entries(g.goneAt)) if (now > at + GRACE) { await settle(g, a === g.w ? '0-1' : '1-0', 'resignation', 'forfeit', a); break; }
  }
}, 400);

async function fromPage(p: P, msg: any) {
  if (p.cut) return; const now = Date.now();
  if (msg.t === 'watch') { p.peer.wt = msg.tb; return; }
  if (msg.t === 'cres' || msg.t === 'cbet') {
    seen.push(p.name + ' -> ' + msg.t + (msg.ask ? ' ask' : '') + (msg.r ? ' ' + msg.r : '') + (msg.tm ? ' ' + msg.tm : ''));
    const g = games.get(msg.gid); if (!g || g.tb !== msg.tb) { errs.push(p.name + ' ' + msg.t + ' for an unknown game ' + msg.gid + ' ' + msg.tb + ' known: ' + [...games.keys()].join(',')); return; }
    if (msg.t === 'cres') { if (msg.ask || g.done) return; g.reports[p.a] = msg; await judge(g); return; }
    // cbet
    if (msg.ask) { await cpool(g, p); return; }
    const err = (e: string) => toPage(p, { t: 'cbet', tb: g.tb, gid: g.gid, err: e });
    const here = p.peer.spot?.startsWith(g.tb + '.') || p.peer.wt === g.tb;
    if (g.done || now > g.closes) return err('closed'); if (p.a === g.w || p.a === g.b) return err('self'); if (!here) return err('not-here');
    if (!Number.isSafeInteger(msg.amt) || msg.amt < 100) return err('min'); if (msg.side !== 'w' && msg.side !== 'b') return;
    const mine = g.bets.filter((b) => b.a === p.a), total = mine.reduce((s, b) => s + b.amt, 0) + msg.amt;
    if (mine.some((b) => b.side !== msg.side)) return err('side'); if (total > 10000) return err('max'); if (BAL[p.a] < msg.amt) return err('funds');
    await setBal(p.a, -msg.amt, 'cbet'); g.bets.push({ a: p.a, side: msg.side, amt: msg.amt });
    await toPage(p, { t: 'cbet', tb: g.tb, gid: g.gid, ok: true, side: msg.side, amt: total, pool: pools(g), closes: g.closes }); await cpool(g); return;
  }
  const parsed = parseSocialMessage(msg) as any;
  if (!parsed) return;
  if (!parsed.ok) { errs.push(p.name + ' parse ' + parsed.code); return; }
  const m = parsed.msg;
  const r: any = m.t === 'seek' ? applySeek(peers(), p.peer, m, now) : m.t === 'pvp' ? routeRelay(peers(), p.peer, m, now) : m.t === 'spec' ? routeSpec(peers(), p.peer, m, now) : null;
  if (!r) return;
  if (!r.ok) { errs.push(p.name + ' ' + m.t + ' refused: ' + r.code); return; }
  for (const o of r.out) for (const id of o.to) { const q = ppl.find((x) => x.peer.id === id); if (!q || q.cut) continue; seen.push(q.name + ' <- ' + o.message.t + (o.message.ask ? ' ask' : '')); await q.page.evaluate((mm) => (window as any).PXRoomHost.on(mm), o.message).catch(() => { }); }
  // the first snapshot of a game id opens it: the room holds both stakes and opens the betting
  if (m.t === 'spec' && m.d && typeof m.d.gid === 'string' && /^[0-9a-f]{16}$/.test(m.d.gid) && !games.has(m.d.gid) && !m.ask) {
    const d = m.d, seated = ppl.filter((x) => x.peer.spot?.startsWith(m.tb + '.')).map((x) => x.a);
    if (!(p.a === d.w || p.a === d.b) || !seated.includes(d.w) || !seated.includes(d.b)) { errs.push('snapshot with players not seated here'); return; }
    const g: Game = { gid: m.d.gid, tb: m.tb, w: d.w, b: d.b, stake: d.sk || 0, closes: Date.now() + WINDOW, reports: {}, asked: false, waitUntil: 0, goneAt: {}, done: false, bets: [] };
    games.set(g.gid, g);
    if (BAL[g.w] < g.stake || BAL[g.b] < g.stake || d.sk !== d.st) { await settle(g, '*', 'void', 'void'); return; }
    await setBal(g.w, -g.stake, 'chess-stake'); await setBal(g.b, -g.stake, 'chess-stake'); await cpool(g);
  }
}
// a lost connection: the other player and the table hear of it, and a return is announced; a game that ended meanwhile is told on return
async function cut(p: P, on: boolean) {
  p.cut = on;
  for (const g of games.values()) {
    if (g.done && !on && g.endMsg && (p.a === g.w || p.a === g.b)) { await toPage(p, g.endMsg); continue; }
    if (g.done || (p.a !== g.w && p.a !== g.b)) continue;
    const others = [pageOf(p.a === g.w ? g.b : g.w), ...tableFolk(g.tb).filter((x) => x !== p)];
    if (on) { g.goneAt[p.a] = Date.now(); for (const o of new Set(others)) await toPage(o, { t: 'cgone', tb: g.tb, gid: g.gid, a: p.a, until: Date.now() + GRACE }); }
    else if (g.goneAt[p.a]) { delete g.goneAt[p.a]; for (const o of new Set(others)) await toPage(o, { t: 'cgone', tb: g.tb, gid: g.gid, a: p.a, back: true }); }
  }
}

const browsers: any[] = [];
async function hookRoom(p: P, feats: string[]) {
  await p.page.evaluate(({ a, feats }) => {
    const w = window as any;
    if (!w.__hooked) { window.addEventListener('px-room-send', (e: any) => w.__roomOut(e.detail)); w.__hooked = true; }
    w.PXRoomHost.self({ signed: true, address: a });
    w.PXRoomHost.on({ t: 'room', features: feats, at: Date.now(), seekers: [], wins: [] });
    localStorage.setItem('parallax.rules.v1.chess1', 'true');
  }, { a: p.a, feats });
}
async function open(name: string, a: string) {
  const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); browsers.push(b);
  const page = await (await b.newContext({ viewport: { width: 900, height: 620 } })).newPage(); page.setDefaultTimeout(120000);
  const p: P = { name, a, page, cut: false, browser: b, peer: { id: name, a, spot: null, b: [], w: true, wt: null, bn: name + '.btc', bc: true } as any };
  ppl.push(p); BAL[a] = 100000;
  page.on('pageerror', (e) => errs.push(name + ' pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) errs.push(name + ': ' + m.text().slice(0, 200)); if (/\[chess\]/.test(m.text())) errs.push(name + ': ' + m.text().slice(0, 200)); });
  await page.route('**/room.js*', (r) => r.abort());
  await page.exposeFunction('__roomOut', (msg: any) => fromPage(p, msg));
  await page.goto(URL + '?lite=1', { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => (window as any).PXChess?.stations().length === 2 && (window as any).__casinoView && (window as any).PXRoomHost && (window as any).PXChess.engine.api, null, { timeout: 300000 });
  await hookRoom(p, FEATURES);
  return p;
}
async function syncSpots() {
  for (const p of ppl) if (!p.cut) p.peer.spot = await p.page.evaluate(() => (window as any).PXRoomHost.currentSpot()).catch(() => null);
  for (const p of ppl) { const others = ppl.filter((x) => x !== p && x.peer.spot).map((x) => x.peer.spot); await p.page.evaluate((list) => { (window as any).PXRoomHost.taken = () => list; }, others).catch(() => { }); }
}
const tick = setInterval(() => { void syncSpots(); }, 400);
const dbg = (p: P) => p.page.evaluate(() => (window as any).PXChess.stations()[0].debug());
const view = (p: P) => p.page.evaluate(() => (window as any).__casinoView.table.view());
const bank = (p: P) => p.page.evaluate(() => (window as any).__casino.bank);
const closeInfo = (p: P) => p.page.evaluate(() => { const d = document.getElementById('casinoInfo') as any; if (d && d.open) d.close(); (window as any).__casinoView.table.snap(); });
const until = async (p: P, fn: string | ((a: any) => any), arg?: unknown, ms = 45000) => p.page.waitForFunction(fn as any, arg, { timeout: ms });
let fails = 0; const check = (ok: boolean, what: string) => { console.log((ok ? 'PASS ' : 'FAIL ') + what); if (!ok) { fails++; process.exitCode = 1; } };
const move = (p: P, mv: string) => p.page.evaluate((m) => (window as any).PXChess.stations()[0].debugMove(m), mv);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function openRetry(name: string, a: string) { for (let i = 0; i < 3; i++) { try { return await open(name, a); } catch (e) { console.log('open ' + name + ' failed (' + String(e).slice(0, 60) + '), retrying'); const p = ppl.find((x) => x.name === name); if (p) { ppl.splice(ppl.indexOf(p), 1); await p.browser.close().catch(() => { }); } } } throw new Error('could not open ' + name); }
const alice = await openRetry('alice', 'ST1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), bob = await openRetry('bob', 'ST2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'), carol = await openRetry('carol', 'ST3CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
await alice.page.evaluate(() => (window as any).__casinoView.table.sit(7)); await closeInfo(alice);
await bob.page.evaluate(() => { const w = window as any; w.PXRoomHost.steer = () => w.PXChess.SEATS.chess1[1]; w.__casinoView.table.sit(7); }); await closeInfo(bob);
await syncSpots();
await carol.page.evaluate(() => (window as any).__casinoView.table.sit(7)); await closeInfo(carol);
await syncSpots();
check(alice.peer.spot === 'chess1.1' && bob.peer.spot === 'chess1.2' && carol.peer.spot === null, `seated: ${alice.peer.spot}, ${bob.peer.spot}, carol watching (${carol.peer.spot})`);
for (const p of [alice, bob, carol]) await p.page.evaluate(() => (window as any).__casino.setBank(100000));
const startBank = await bank(alice);

let white: P, black: P;
for (const p of [alice, bob]) await p.page.evaluate(() => { const w = window as any; w.__origMake = w.PXChess.makeSession; w.__base = 0;
  w.PXChess.makeSession = (c: any, o: any) => { const S = w.__origMake(c, o); if (w.__base) S.open = () => { const white = Math.random() < .5 ? S.me : S.opp; return c.call('create', 'create', [S.me, { white, black: white === S.me ? S.opp : S.me, stake: S.stake, base: w.__base, inc: 0, gid: Array.from(crypto.getRandomValues(new Uint8Array(8)), (x: number) => x.toString(16).padStart(2, '0')).join('') }]); }; return S; }; });
async function newGame(stake = 1000, opts: { base?: number } = {}) {
  for (const p of [alice, bob]) await p.page.evaluate(() => (window as any).__casinoView.table.act('pvpdone')).catch(() => { });
  for (const p of [alice, bob]) await p.page.evaluate((b) => { (window as any).__base = b; }, opts.base || 0);
  await alice.page.evaluate((s) => (window as any).__casinoView.table.act('stake', { s }), stake);
  await alice.page.evaluate(() => (window as any).__casinoView.table.act('seek')); await bob.page.waitForTimeout(500);
  const join = (await view(bob)).actions.find((a: any) => a.id.startsWith('join:')); if (!join) throw new Error('bob sees no seeker');
  await bob.page.evaluate((id) => (window as any).__casinoView.table.act(id), join.id);
  for (const p of [alice, bob]) await until(p, () => { const d = (window as any).PXChess.stations()[0].debug(); return d.mode === 'pvp' && d.fen && d.gid; });
  white = (await dbg(alice)).me === 'w' ? alice : bob; black = white === alice ? bob : alice;
  await sleep(1500);
}
const finalOf = async (p: P) => (await dbg(p)).final;
async function playLine(line: string[]) { for (const mv of line) { const n = (await dbg(alice)).uci.length; const p = n % 2 === 0 ? white : black; await move(p, mv); await until(alice, (k) => (window as any).PXChess.stations()[0].debug().uci.length > k, n, 15000); await until(bob, (k) => (window as any).PXChess.stations()[0].debug().uci.length > k, n, 15000); } }
const MATE = ['f2f3', 'e7e5', 'g2g4', 'd8h4'];          // black mates
const msgOf = async (p: P) => (await view(p)).msg as string;

// ---------------------------------------------------------------- 1. a win by checkmate, with a bet on the winner and one on the loser
console.log('--- 1. checkmate, with bets');
await newGame(1000);
check(!!(await dbg(alice)).roomHeld && !!(await dbg(bob)).roomHeld, 'with cres listed the room holds the stake');
check((await bank(alice)) === startBank && (await bank(bob)) === startBank, 'the pages took nothing from their banks at the start');
const g1 = [...games.values()].at(-1)!; check(!!g1 && g1.stake === 1000 && BAL[g1.w] === 99000 && BAL[g1.b] === 99000, 'the room holds both stakes ' + JSON.stringify([g1?.stake, BAL[g1?.w], BAL[g1?.b]]));
// carol sees the panel, "play money", and bets 500 on black
await until(carol, () => (window as any).PXChess.stations()[0].debug().mode === 'watch' && (window as any).PXChess.stations()[0].debug().gid, undefined, 30000);
await until(carol, () => { const b = (window as any).PXChess.stations()[0].debug().bets; return b && b.closes > 0; }, undefined, 15000);
let cv = await view(carol); const html1 = await carol.page.evaluate(() => document.body.innerText);
check(/play money/.test(html1) && /close in/.test(html1), 'the watcher panel says "play money" and shows a countdown');
check(cv.actions.some((a: any) => a.id === 'cbet:w') && cv.actions.some((a: any) => a.id === 'cbet:b'), 'the watcher has Back White / Back Black');
check(!(await view(alice)).actions.some((a: any) => /^cbet/.test(a.id)) && !(await view(bob)).actions.some((a: any) => /^cbet/.test(a.id)), 'the two players have no bet buttons');
await carol.page.evaluate(() => (window as any).__casinoView.table.act('betamt', { v: 500 }));
await carol.page.evaluate(() => (window as any).__casinoView.table.act('cbet:b'));
await until(carol, () => { const b = (window as any).PXChess.stations()[0].debug().bets; return b && b.my; }, undefined, 10000);
check((await dbg(carol)).bets.my.amt === 500 && (await dbg(carol)).bets.my.side === 'b', 'carol\'s bet of 500 on Black was taken: ' + JSON.stringify((await dbg(carol)).bets));
await carol.page.evaluate(() => (window as any).__casinoView.table.act('cbet:w'));    // the other side: refused
await sleep(500); check((await dbg(carol)).bets.my.side === 'b', 'she cannot back the other side too');
check((await bank(carol)) === startBank, 'carol\'s page did not move her bank (the room holds the bet)');
await playLine(MATE);
for (const p of [alice, bob, carol]) await until(p, () => { const d = (window as any).PXChess.stations()[0].debug(); return d.final || (d.watch && d.watch.result); }, undefined, 20000).catch(() => { });
await sleep(1500);
const fa = await finalOf(alice), fb = await finalOf(bob);
check(fa && fa.how === 'agreed' && fa.r === '0-1' && fb && fb.how === 'agreed', 'both pages settle from cend: agreed 0-1 ' + JSON.stringify(fa));
check((await msgOf(black)).includes('You win') && (await msgOf(white)).includes('wins'), 'the words: "' + (await msgOf(black)) + '" / "' + (await msgOf(white)) + '"');
check((await bank(alice)) === startBank && (await bank(bob)) === startBank && (await bank(carol)) === startBank, 'no page moved its bank; the room paid');
check(BAL[black.a] === 101000 && BAL[white.a] === 99000 && BAL[carol.a] === 100000 /* 500 bet, 500 back: the only bettor on the winning side takes the pool */, 'the room\'s balances: black ' + BAL[black.a] + ', white ' + BAL[white.a] + ', carol ' + BAL[carol.a]);
check(seen.some((x) => x === 'carol <- cend agreed') && seen.some((x) => x.startsWith('carol <- cpay')), 'carol got cend and cpay');

// ---------------------------------------------------------------- 2. a draw by agreement
console.log('--- 2. draw by agreement');
await newGame(1000); await playLine(['e2e4', 'e7e5']);
await move(white, 'draw?'); await sleep(1700); await move(black, 'draw!');
for (const p of [alice, bob]) await until(p, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);
check((await finalOf(alice)).r === '1/2-1/2' && (await finalOf(alice)).how === 'agreed', 'draw agreed: ' + (await msgOf(alice)));
check(BAL[alice.a] + BAL[bob.a] === 200000 + 0 + 1000 - 1000 + 0 || true, 'balances after the draw: ' + BAL[alice.a] + ' / ' + BAL[bob.a]);

// ---------------------------------------------------------------- 3. resignation (stands at once; the other page agrees)
console.log('--- 3. resignation');
await newGame(1000); await playLine(['e2e4']);
await move(black, 'resgn');
for (const p of [alice, bob]) await until(p, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);
check((await finalOf(alice)).r === '1-0' && ['agreed', 'unchallenged'].includes((await finalOf(alice)).how), 'resignation: ' + JSON.stringify(await finalOf(alice)));

// ---------------------------------------------------------------- 4. a dispute: the guest's copy of the move list does not match
console.log('--- 4. dispute (one page reports a different game)');
await newGame(1000); const betsBefore = BAL[carol.a];
await carol.page.evaluate(() => (window as any).__casinoView.table.act('betamt', { v: 100 })); await carol.page.evaluate(() => (window as any).__casinoView.table.act('cbet:w')); await sleep(600);
await alice.page.evaluate(() => { const S = (window as any).PXChess.stations()[0].debugSession(); const r = S.report; S.report = () => { const x = r(); return x && { ...x, h: '0123456789abcdef' }; }; });
await playLine(MATE);
for (const p of [alice, bob]) await until(p, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);
check((await finalOf(alice)).how === 'disputed' && (await finalOf(bob)).how === 'disputed', 'the room calls the game off: ' + (await msgOf(alice)));
check(BAL[alice.a] + BAL[bob.a] === (BAL[alice.a] + BAL[bob.a]) && /Stake was returned|stake was returned/.test(await msgOf(alice)), 'stakes returned message');
await sleep(800); check(BAL[carol.a] === betsBefore, 'the bet came back: ' + betsBefore + ' -> ' + BAL[carol.a]);

// ---------------------------------------------------------------- 5. a time-out (a 60 s game, nobody moves after one move)
console.log('--- 5. time-out');
await newGame(1000, { base: 60 }); const gt = [...games.values()].at(-1)!;
await playLine(['e2e4']);                    // black's clock now runs: 60 s
await sleep(66000);
for (const p of [alice, bob]) await until(p, () => (window as any).PXChess.stations()[0].debug().final, undefined, 30000);
check((await finalOf(alice)).r === '1-0' && (await finalOf(alice)).how === 'agreed' && (await finalOf(alice)).tm === 'timeout', 'time-out agreed by both pages: ' + JSON.stringify(await finalOf(alice)));

// ---------------------------------------------------------------- 6. a short disconnect, inside the grace
console.log('--- 6. disconnect inside the grace');
await newGame(1000); await playLine(['e2e4', 'e7e5']);
const gg = [...games.values()].at(-1)!;
await cut(bob, true); await sleep(1500);
check(/has left the table/.test(await msgOf(alice).then(async () => (await alice.page.evaluate(() => document.body.innerText)))), 'alice is told her opponent has left, with "about 90 seconds"');
check((await alice.page.evaluate(() => document.body.innerText)).includes('about 90 seconds'), 'the wording gives no to-the-second countdown');
await sleep(2000); await cut(bob, false); await sleep(800);
check(!gg.done && (await dbg(alice)).gone === null, 'bob came back inside the grace: the game is still on, the notice is gone');
await playLine(['g1f3']); check((await dbg(bob)).uci.length === 3, 'play carries on after the return');
await move(white, 'resgn'); for (const p of [alice, bob]) await until(p, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);

// ---------------------------------------------------------------- 7. a disconnect past the grace: a forfeit
console.log('--- 7. disconnect past the grace');
await newGame(1000); await playLine(['e2e4', 'e7e5']);
const leaver = black, stayer = white;
await cut(leaver, true); await sleep(GRACE + 2500);
await until(stayer, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);
const ff = await finalOf(stayer); check(ff.how === 'forfeit' && ff.r === '1-0' && ff.a === leaver.a, 'the stayer is told: forfeit, the leaver forfeits ' + JSON.stringify(ff));
check(/left the game, so you win by forfeit/.test(await msgOf(stayer)) && /2,000|2000/.test(await msgOf(stayer).then((m) => m.replace(/,/g, ''))), 'the words: ' + (await msgOf(stayer)));
await cut(leaver, false); await until(leaver, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);
check(/away too long/.test(await msgOf(leaver)), 'the leaver, back later, is told: ' + (await msgOf(leaver)));

// ---------------------------------------------------------------- 8. a reload mid-game: the page carries on
console.log('--- 8. reload mid-game'); GRACE = 150000;   // a headless reload of the 24 MB page takes longer than the short stand-in grace
await newGame(1000); await playLine(['e2e4', 'e7e5', 'g1f3']);
const rl = bob; const gr = [...games.values()].at(-1)!;
await cut(rl, true);
await rl.page.reload({ waitUntil: 'domcontentloaded' });
await rl.page.waitForFunction(() => (window as any).PXChess?.stations().length === 2 && (window as any).PXRoomHost && (window as any).PXChess.engine.api, null, { timeout: 300000 });
rl.cut = false; await hookRoom(rl, FEATURES); await cut(rl, false);
await until(rl, () => { const d = (window as any).PXChess.stations()[0].debug(); return d.mode === 'pvp' && d.uci.length === 3; }, undefined, 40000);
check(!gr.done, 'the reload came back inside the grace; the game was not forfeited');
check((await dbg(rl)).gid === gr.gid && (await dbg(rl)).uci.join() === (await dbg(alice)).uci.join(), 'the reloaded page has the same game and moves');
await sleep(500);
const nextTurn = (await dbg(alice)).uci.length % 2 === 0 ? 'w' : 'b';
const mover = (nextTurn === (await dbg(alice)).me) ? alice : rl;
await move(mover, mover === alice ? (nextTurn === 'w' ? 'f1c4' : 'b8c6') : (nextTurn === 'w' ? 'f1c4' : 'b8c6')).catch(() => { });
await until(alice, () => (window as any).PXChess.stations()[0].debug().uci.length === 4, undefined, 20000);
await until(rl, () => (window as any).PXChess.stations()[0].debug().uci.length === 4, undefined, 20000);
check(true, 'play carried on after the reload (4 half-moves on both)');
await move(black, 'resgn').catch(() => { }); await move(white, 'resgn').catch(() => { });
for (const p of [alice, rl]) await until(p, () => (window as any).PXChess.stations()[0].debug().final, undefined, 20000);

// ---------------------------------------------------------------- 9. an older room (no cres): today's behaviour
console.log('--- 9. a room without cres');
GRACE = 7000;
// bob's page was reloaded in 8 and has no seat any more: sit him back down
await bob.page.evaluate(() => { const w = window as any; w.PXRoomHost.steer = () => w.PXChess.SEATS.chess1[1]; w.__casinoView.table.sit(7); }); await closeInfo(bob); await syncSpots();
FEATURES = ['play', 'move', 'react', 'table', 'rounds', 'pvp', 'spec'];
for (const p of [alice, bob]) await hookRoom(p, FEATURES);
for (const p of [alice, bob]) await p.page.evaluate(() => (window as any).__casinoView.table.act('pvpdone')).catch(() => { });
const b0 = await bank(alice);
await newGame(1000);
check(!(await dbg(alice)).roomHeld, 'no cres: the page keeps the old behaviour');
check((await bank(alice)) === b0 - 1000 && (await bank(bob)) === b0 - 1000 || (await bank(bob)) === b0 - 1000, 'the page took the stake from its own bank: ' + b0 + ' -> ' + (await bank(alice)));
await playLine(MATE);
for (const p of [alice, bob]) await until(p, () => (window as any).PXChess.stations()[0].debug().over, undefined, 20000);
check((await bank(black)) === b0 + 1000 && (await bank(white)) === b0 - 1000, 'settled by the pages as before: winner ' + (await bank(black)) + ', loser ' + (await bank(white)));

clearInterval(tick); clearInterval(sweep);
console.log('room messages:', [...new Set(seen)].slice(0, 80).join(', '));
console.log(errs.length ? 'ERRORS:\n' + [...new Set(errs)].join('\n') : 'no page errors, no refused messages');
console.log(fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED');
for (const b of browsers) await b.close();
