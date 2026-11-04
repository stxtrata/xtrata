// A second player at the table watches a game against a house player (chess.js c8). Run from the repo root with the casino served at
// http://localhost:8411/casino/ (python3 -m http.server 8411 --directory public) and: npx tsx scripts/test-casino-house-watch.mts
// Watching a chess game: two players and a guest watcher, in three browsers, through a stand-in room that runs the real routing
// (functions/lib/casino-social.ts: applySeek, routeRelay, routeSpec, parseSocialMessage). room.js (the transport) is not loaded.
import { chromium, type Page } from 'playwright';
import { applySeek, parseSocialMessage, routeRelay, routeSpec, type SocialPeer } from '../functions/lib/casino-social.ts';

const URL = 'http://localhost:8411/casino/';
type P = { name: string; a: string | null; bn: string | null; page: Page; peer: SocialPeer & Record<string, any> };
const ppl: P[] = [];
const errs: string[] = [], seen: string[] = [];
const peers = () => ppl.map((p) => p.peer);

async function deliver(outs: Array<{ to: string[]; message: unknown }>) {
  for (const o of outs) for (const id of o.to) {
    const p = ppl.find((x) => x.peer.id === id); if (!p) continue;
    seen.push(p.name + ' <- ' + (o.message as any).t + ((o.message as any).ask ? ' ask' : ''));
    await p.page.evaluate((m) => (window as any).PXRoomHost.on(m), o.message).catch(() => { });
  }
}
async function fromPage(p: P, msg: any) {
  const now = Date.now();
  if (msg.t === 'watch') { p.peer.wt = msg.tb; return; }
  const parsed = parseSocialMessage(msg) as any;
  if (!parsed) return;
  if (!parsed.ok) { errs.push(p.name + ' parse ' + parsed.code); return; }
  const m = parsed.msg;
  const r: any = m.t === 'seek' ? applySeek(peers(), p.peer, m, now) : m.t === 'pvp' ? routeRelay(peers(), p.peer, m, now) : m.t === 'spec' ? routeSpec(peers(), p.peer, m, now) : null;
  if (!r) return;
  if (!r.ok) { errs.push(p.name + ' ' + m.t + ' refused: ' + r.code); return; }
  await deliver(r.out);
}

const browsers: any[] = [];
async function open(name: string, a: string | null, bn: string | null) {
  const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); browsers.push(b);
  const page = await (await b.newContext({ viewport: name === 'carol' ? { width: 1100, height: 720 } : { width: 900, height: 620 } })).newPage();
  page.setDefaultTimeout(120000);
  const p: P = { name, a, bn, page, peer: { id: name, a, spot: null, b: [], w: true, wt: null, bn, bc: !!a } as any };
  ppl.push(p);
  page.on('pageerror', (e) => errs.push(name + ' pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) errs.push(name + ': ' + m.text().slice(0, 200)); if (/\[chess\]/.test(m.text())) errs.push(name + ': ' + m.text().slice(0, 200)); });
  await page.route('**/room.js*', (r) => r.abort());
  await page.exposeFunction('__roomOut', (msg: any) => fromPage(p, msg));
  await page.goto(URL + '?lite=1', { waitUntil: 'domcontentloaded', timeout: 300000 });
  await page.waitForFunction(() => (window as any).PXChess?.stations().length === 2 && (window as any).__casinoView && (window as any).PXRoomHost && (window as any).PXChess.engine.api, null, { timeout: 300000 });
  await page.evaluate(({ a }) => {
    const w = window as any;
    window.addEventListener('px-room-send', (e: any) => w.__roomOut(e.detail));
    w.PXRoomHost.self(a ? { signed: true, address: a } : { signed: false });
    w.PXRoomHost.on({ t: 'room', features: ['play', 'move', 'react', 'table', 'rounds', 'pvp', 'spec'], at: Date.now(), seekers: [], wins: [] });
    localStorage.setItem('parallax.rules.v1.chess1', 'true');
  }, { a });
  return p;
}
// what room.js would tell the room: where this page's person sits (the room keeps `spot`), and who else sits where (`taken`)
async function syncSpots() {
  for (const p of ppl) p.peer.spot = await p.page.evaluate(() => (window as any).PXRoomHost.currentSpot()).catch(() => null);
  for (const p of ppl) { const others = ppl.filter((x) => x !== p && x.peer.spot).map((x) => x.peer.spot); await p.page.evaluate((list) => { (window as any).PXRoomHost.taken = () => list; }, others).catch(() => { }); }
}
const tick = setInterval(() => { void syncSpots(); }, 400);
const dbg = (p: P) => p.page.evaluate(() => (window as any).PXChess.stations()[0].debug());
const view = (p: P) => p.page.evaluate(() => (window as any).__casinoView.table.view());
const closeInfo = (p: P) => p.page.evaluate(() => { const d = document.getElementById('casinoInfo') as any; if (d && d.open) d.close(); (window as any).__casinoView.table.snap(); });
async function clickSq(p: P, sq: string, lift = 0) {
  await p.page.evaluate(() => (window as any).__casinoView.table.snap());
  await p.page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const xy = await p.page.evaluate(([sq, lift]) => { const w = window as any; const v = w.PXChess.stations()[0].squareAt(sq); v.y += lift; v.project(w.__PARALLAX_QA__.camera); const r = w.__PARALLAX_QA__.renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }, [sq, lift]);
  if (lift > 0) for (const l of [lift, 0.045, 0.035, 0.055, 0.03, 0.065, 0.02]) {   // a part of the piece you can see (a taller piece in front can hide its bottom)
    const xy2 = await p.page.evaluate(([sq, lift]) => { const w = window as any; const v = w.PXChess.stations()[0].squareAt(sq); v.y += lift; v.project(w.__PARALLAX_QA__.camera); const r = w.__PARALLAX_QA__.renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }, [sq, l] as [string, number]);
    const res = await p.page.evaluate(([x, y]) => (window as any).PXChess.stations()[0].debugPick(x, y).res, xy2);
    if (res && res.sq === sq) { xy[0] = xy2[0]; xy[1] = xy2[1]; break; }
  }
  const hit = await p.page.evaluate(([x, y]) => (window as any).PXChess.stations()[0].squareFromPoint(x, y), xy);
  if (hit !== sq) console.log('MISS', p.name, 'aimed at', sq, 'would hit', hit, 'at', xy.map(Math.round).join(','));
  await p.page.mouse.click(xy[0], xy[1]); await p.page.waitForTimeout(150);
}
const until = async (p: P, fn: string, arg?: unknown, ms = 45000) => p.page.waitForFunction(fn, arg, { timeout: ms });
const check = (ok: boolean, what: string) => { console.log((ok ? 'PASS ' : 'FAIL ') + what); if (!ok) process.exitCode = 1; };


const alice = await open('alice', 'ST1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'alice.btc');
const carol = await open('carol', null, null);                                               // a guest, not signed in
await alice.page.evaluate(() => (window as any).__casinoView.table.sit(7)); await closeInfo(alice);
await syncSpots();
check(alice.peer.spot === 'chess1.1', 'alice sits on the sofa: ' + alice.peer.spot);
const acts = (await view(alice)).actions.map((a: any) => a.id + ':' + a.label).join(' | '); console.log('alice actions', acts);
await alice.page.evaluate(() => (window as any).__casinoView.table.act('play'));
await until(alice, () => (window as any).PXChess.stations()[0].debug().mode === 'house');
const da0 = await dbg(alice); console.log('alice plays', da0.me, 'against', JSON.stringify(da0.msg));
// carol walks up (she does not sit): she should see the game
await carol.page.evaluate(() => (window as any).__casino.enterWalk()); await carol.page.waitForTimeout(1500);
await carol.page.evaluate(() => (window as any).__casinoView.standAt(-6.2, 8.2)); await syncSpots();
await carol.page.waitForTimeout(2500);
await until(carol, () => (window as any).PXChess.stations()[0].debug().mode === 'watch', undefined, 20000).catch(() => { });
let dc = await dbg(carol), da = await dbg(alice);
check(dc.mode === 'watch' && !!dc.watch, 'carol is shown the bot game: mode ' + dc.mode);
check(!!(dc.watch && typeof dc.watch.house === 'string'), 'it is marked as a house game: ' + (dc.watch && dc.watch.house));
check(dc.watch && /house player/.test(dc.watch.wn + dc.watch.bn) && /alice\.btc/.test(dc.watch.wn + dc.watch.bn), 'both sides are named: ' + (dc.watch && dc.watch.wn) + ' vs ' + (dc.watch && dc.watch.bn));
check(dc.fen === da.fen, 'same position as alice\'s');
const vc = (await view(carol)) || { actions: [] }; console.log('carol view actions', vc.actions.map((a: any) => a.id).join(',') || '(none)');
check(!vc.actions.some((a: any) => String(a.id).startsWith('cbet')), 'no bet buttons on a bot game');
check(!seen.some((x) => x.includes('cbet')), 'no bet traffic');
// moves: alice plays; the bot answers; carol follows
async function aliceMove(mv: string) { const n0 = (await dbg(alice)).uci.length; await clickSq(alice, mv.slice(0, 2), 0.025); await clickSq(alice, mv.slice(2, 4)); await until(alice, (n) => (window as any).PXChess.stations()[0].debug().uci.length >= n + 2, n0, 60000); }
if ((await dbg(alice)).me === 'b') await until(alice, () => (window as any).PXChess.stations()[0].debug().uci.length >= 1, undefined, 60000);
const first = (await dbg(alice)).me === 'w' ? ['e2e4', 'g1f3'] : ['e7e5', 'g8f6'];
await aliceMove(first[0]);
await until(carol, (n) => (window as any).PXChess.stations()[0].debug().watch?.moves >= n, (await dbg(alice)).uci.length, 20000).catch(() => { });
dc = await dbg(carol); da = await dbg(alice);
check(dc.fen === da.fen && dc.watch.moves === da.uci.length, `carol follows the moves (${dc.watch.moves} vs ${da.uci.length})`);
await carol.page.screenshot({ path: 'shots/30-watch-bot.png', timeout: 120000 });
// resign: carol sees the result
await alice.page.evaluate(() => (window as any).__casinoView.table.act('resign')); await alice.page.waitForTimeout(500);
for (let i = 0; i < 3; i++) { const v = await view(alice); const c = v.actions.find((a: any) => /resign/i.test(a.id) || /sure|confirm/i.test(a.label)); if (!c) break; await alice.page.evaluate((id) => (window as any).__casinoView.table.act(id), c.id).catch(() => { }); await alice.page.waitForTimeout(300); }
await until(alice, () => !!(window as any).PXChess.stations()[0].debug().over, undefined, 20000).catch(() => { });
await until(carol, () => !!(window as any).PXChess.stations()[0].debug().watch?.result, undefined, 20000).catch(() => { });
dc = await dbg(carol); da = await dbg(alice);
check(!!(dc.watch && dc.watch.result) && dc.watch.result === (da.over && da.over.result), `carol sees the end: ${dc.watch && dc.watch.result} (${JSON.stringify(da.over)})`);
// carol sits in the free seat: she still sees the game
await carol.page.evaluate(() => (window as any).__casinoView.table.sit(7)); await closeInfo(carol); await syncSpots();
console.log('carol spot', carol.peer.spot);

clearInterval(tick);
console.log('room messages:', [...new Set(seen)].slice(0, 40).join(', '));
console.log(errs.length ? 'ERRORS:\n' + [...new Set(errs)].join('\n') : 'no page errors, no refused messages');
for (const b of browsers) await b.close();
