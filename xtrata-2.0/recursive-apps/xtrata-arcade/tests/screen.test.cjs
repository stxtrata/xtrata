// The hall's centre screen client (src/parts/screen.js) in a vm, with a fake node and a recording canvas. No browser, no network.
// The "node" answers xtrata-screen-v1 read-only calls (get-version, get-live, get-items, get-height) with real Clarity-serialized values,
// built with score-client.js's own encoders plus a few local ones for tuples / optionals / lists, and decoded by the file's own codec.
//   1  off by default, and idle when the chain is unreachable (no throw, idle panel, clock + "no scores" + default ticker)
//   2  live items come back in the contract's live order, chunked 10 at a time, capped at maxLive, missing rows skipped
//   3  what is shown: paid ad vs free message, kinds, ticker, rotation order and weights
//   4  review lane / hidden / ended / not-yet-started items are never shown; approval makes them appear; a paused contract is not special
//   5  latest scorers from a canned get-top10 response (through XAScores.getTop10), window, order, dedupe, limit
//   6  pictures: a mock inscription id goes through XAWorld.loadImageBytes once, drawn when decoded, never retried after a failure
//   7  a failed read keeps the last good snapshot; the cache restores it when the chain is down
//   8  polling: only the version is read until it changes; force; busy; timer interval
// Run: node tests/screen.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, '..', 'src', 'parts');
const ADDR = 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E';
const SCREEN = ADDR + '.xtrata-screen-v1';
const SCORES = ADDR + '.xtrata-arcade-scores-v2';

let checks = 0;
const eq = (a, b, m) => { checks++; assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), m); };
const ok = (c, m) => { checks++; assert.ok(c, m); };
process.on('exit', () => console.log('screen.test.cjs: ' + checks + ' checks'));

/* ------------------------------------------------------------ harness */
function load() {
  const timers = [];
  const win = { console: { log() {}, warn() {}, error: console.error }, Math, Date, JSON, Object, Array, Number, String, Uint8Array, BigInt, TextDecoder, TextEncoder, Promise,
    setTimeout, clearTimeout, addEventListener() {}, removeEventListener() {}, postMessage() {}, location: { search: '', protocol: 'about:', origin: 'null', hostname: '' }, navigator: {},
    setInterval(fn, ms) { const t = { fn, ms, cleared: false }; timers.push(t); return t; }, clearInterval(t) { if (t) t.cleared = true; } };
  win.window = win; win.globalThis = win; win.parent = win; win.timers = timers;
  const store = {};
  win.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
  win._store = store;
  vm.createContext(win);
  for (const f of ['score-client.js', 'world.js', 'screen.js']) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), win, { filename: f });
  return win;
}

// Clarity values, serialized (the decoder does not care about key order, the chain sorts them; we do too).
function encoders(C) {
  const u32 = (n) => n.toString(16).padStart(8, '0');
  const strip = (h) => h.replace(/^0x/, '');
  const E = {
    uint: (n) => C.cvUint(n),
    ascii: (s) => C.cvAscii(s),
    buff: (bytes) => C.cvBuff(bytes),
    bool: (b) => (b ? '0x03' : '0x04'),
    none: () => '0x09',
    some: (v) => '0x0a' + strip(v),
    list: (vs) => '0x0b' + u32(vs.length) + vs.map(strip).join(''),
    principal: (a) => C.cvPrincipal(a),
    tuple: (o) => {
      const keys = Object.keys(o).sort();
      return '0x0c' + u32(keys.length) + keys.map((k) => k.length.toString(16).padStart(2, '0') + Buffer.from(k).toString('hex') + strip(o[k])).join('');
    },
  };
  // one xtrata-screen-v1 Items row (all 19 fields, as the map defines them)
  E.item = (o = {}) => E.tuple({
    kind: E.uint(o.kind ?? 0), head: E.ascii(o.head ?? 'HELLO'), body: E.ascii(o.body ?? ''),
    'image-id': E.uint(o.imageId ?? 0), 'image-hash': E.buff(o.imageHash ?? new Uint8Array(0)), 'image-size': E.uint(o.imageSize ?? 0), layout: E.uint(o.layout ?? 0),
    weight: E.uint(o.weight ?? 1), publisher: E.principal(ADDR), paid: E.bool(!!o.paid),
    buyer: o.paid ? E.some(E.principal(ADDR)) : E.none(), days: E.uint(o.days ?? 0), price: E.uint(o.price ?? 0), escrow: E.uint(0),
    status: E.uint(o.status ?? 1), hidden: E.bool(!!o.hidden), 'starts-at': E.uint(o.startsAt ?? 0), 'ends-at': E.uint(o.endsAt ?? 1000000),
    'added-at': E.uint(0), 'closed-reason': E.uint(0),
  });
  return E;
}

// A fake node. `chain` is mutable between refreshes: { version, live:[ids], items:{id: itemOpts}, height, scores:{board:[entries]} }.
// `down` fails every request (503); `failFn` is a Set of function names that fail; `net` makes fetch itself reject.
function boot(chainInit) {
  const win = load(), C = win.XAScores._codec, E = encoders(C);
  win.timers.length = 0;                          // score-client's own boot timers are not ours
  win.XAScores.configure({ network: 'testnet', apiBases: ['http://node.test'], contractAddress: ADDR, contractName: 'xtrata-arcade-scores-v2', readSender: ADDR });
  const n = { chain: Object.assign({ version: 1, live: [], items: {}, height: 5000, scores: {} }, chainInit), down: false, net: false, failFn: new Set(), log: [] };
  win.fetch = async (url, init) => {
    const m = /\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
    const fn = m[3], body = JSON.parse(init.body), arg0 = (body.arguments || [])[0] || '';
    n.log.push({ contract: m[2], fn, arg0 });
    if (n.net) throw new Error('network down');
    if (n.down || n.failFn.has(fn)) return { ok: false, status: 503, json: async () => ({}) };
    const ch = n.chain; let hex;
    if (m[2] === 'xtrata-screen-v1') {
      if (fn === 'get-version') hex = E.uint(ch.version);
      else if (fn === 'get-live') hex = E.list(ch.live.map(E.uint));
      else if (fn === 'get-height') hex = E.uint(ch.height);
      else if (fn === 'get-items') {
        const raw = arg0.replace(/^0x0b/, ''), count = parseInt(raw.slice(0, 8), 16), ids = [];
        for (let i = 0; i < count; i++) ids.push(Number(BigInt('0x' + raw.slice(8 + i * 34 + 2, 8 + (i + 1) * 34))));
        n.lastItemsIds = ids;
        hex = E.list(ids.map((id) => (ch.items[id] ? E.some(E.item(ch.items[id])) : E.none())));
      }
    } else if (fn === 'get-top10') {
      const board = Buffer.from(arg0.replace(/^0x0d/, '').slice(8), 'hex').toString();
      hex = E.list((ch.scores[board] || []).map((s) => E.some(E.tuple({ name: E.ascii(s.name), player: E.principal(ADDR), score: E.uint(s.score), 'burn-height': E.uint(s.burn),
        'engine-id': E.uint(1), 'replay-hash': E.buff(new Uint8Array(32)) }))));
    }
    if (hex === undefined) return { ok: true, status: 200, json: async () => ({ okay: false, cause: 'no such read ' + fn }) };
    return { ok: true, status: 200, json: async () => ({ okay: true, result: hex }) };
  };
  n.win = win; n.S = win.XAScreen; n.E = E; n.C = C;
  n.calls = (name) => n.log.filter((l) => l.contract === 'xtrata-screen-v1' && (!name || l.fn === name)).length;
  n.reset = () => { n.log.length = 0; };
  return n;
}
const settle = async (n) => { for (let i = 0; i < 20; i++) { await new Promise((r) => setImmediate(r)); if (!n.S._t.state.busy) break; } await new Promise((r) => setImmediate(r)); };
const on = (n, patch) => { n.S.configure(Object.assign({ contract: SCREEN }, patch || {})); return n; };

// A recording 2D context: every fillText / drawImage is kept. measureText is 10 px per character.
function ctx() {
  const c = { texts: [], images: [], rects: 0, saves: 0, restores: 0 };
  for (const k of ['setTransform', 'beginPath', 'rect', 'clip', 'strokeRect']) c[k] = () => {};
  c.save = () => { c.saves++; }; c.restore = () => { c.restores++; };
  c.fillRect = () => { c.rects++; };
  c.fillText = (t, x, y) => { c.texts.push(String(t)); };
  c.measureText = (t) => ({ width: String(t).length * 10 });
  c.drawn = []; c.drawImage = (img, ...a) => { c.images.push(img); c.drawn.push(a); };
  return c;
}
const draw = (S, d) => { const x = ctx(); S.paint(x, 1280, 720, Object.assign({ height: 1000, day: 7, live: true, blocksPerDay: 144, scorers: [], items: [], t: 0 }, d)); return x; };
const has = (x, t) => x.texts.includes(t);
const IDLE = 'EVERY TOP SCORE LIVES ON BITCOIN';

/* ------------------------------------------------------------ 1  off / unreachable */
test('1a off by default: no contract, no reads, refresh says off, paint is the idle panel', async () => {
  const n = boot();
  eq(n.S.enabled(), false);
  eq(n.S.start(), false);
  eq(await n.S.refresh(true), { ok: false, changed: false, error: 'off' });
  eq(n.log.length, 0, 'no read was made');
  eq(n.S.snapshot(), null); eq(n.S.items(), []);
  eq(n.win.timers.length, 0, 'no poll timer');
  const x = draw(n.S, { items: n.S.activeItems(n.S.items(), 1000) });
  ok(has(x, 'BITCOIN DAY') && has(x, '7') && has(x, 'LATEST SCORERS'));
  ok(x.texts.filter((t) => t === IDLE).length >= 2, 'idle line in the panel and in the default ticker');
  ok(has(x, 'NO SCORES YET'));
  eq(x.saves, x.restores, 'paint balances save/restore');
});

test('1b chain unreachable (HTTP 503, or fetch rejecting): start does not throw, nothing cached, idle panel', async () => {
  for (const mode of ['down', 'net']) {
    const n = on(boot()); n[mode] = true;
    eq(n.S.start(), true, 'enabled and polling');
    await settle(n);
    eq(n.S.snapshot(), null, mode); eq(n.S.items(), []);
    const r = await n.S.refresh(true);
    eq(r.ok, false); eq(r.changed, false); ok(/HTTP 503|network down/.test(r.error), r.error);
    const x = draw(n.S, { items: n.S.activeItems(n.S.items(), 1000) });
    ok(x.texts.filter((t) => t === IDLE).length >= 2); ok(has(x, 'BITCOIN DAY'));
    eq(n.S._t.state.busy, false, 'busy flag released after a failure');
  }
});

test('1c a contract that answers an error (okay:false) is a failed read, not an empty screen', async () => {
  const n = on(boot()); n.failFn = new Set();
  n.win.fetch = async () => ({ ok: true, status: 200, json: async () => ({ okay: false, cause: 'runtime error' }) });
  const r = await n.S.refresh(true);
  eq(r, { ok: false, changed: false, error: 'runtime error' });
  eq(n.S.snapshot(), null);
});

/* ------------------------------------------------------------ 2  live items */
test('2a live items are read in the contract\'s live order, with every field mapped and clamped', async () => {
  const n = on(boot({ version: 4, live: [9, 3, 5], items: {
    9: { kind: 1, head: 'NEWS HEAD', body: 'news body', weight: 3, startsAt: 100, endsAt: 9000 },
    3: { kind: 0, head: 'hi', body: '', weight: 99 },
    5: { kind: 2, head: 'BUY', body: 'ad body', paid: true, weight: 0, days: 3, price: 10 } } }));
  n.S.start(); await settle(n);
  const snap = n.S.snapshot();
  eq(snap.items.map((i) => i.id), [9, 3, 5], 'live order kept');
  eq(snap.version, 4); eq(snap.height, 5000); ok(snap.at > 0);
  const [news, msg, ad] = snap.items;
  eq([news.kind, news.head, news.body, news.weight, news.startsAt, news.endsAt, news.status, news.hidden, news.paid], [1, 'NEWS HEAD', 'news body', 3, 100, 9000, 1, false, false]);
  eq(msg.weight, 10, 'weight clamps to 10'); eq(ad.weight, 1, 'weight 0 clamps up to 1');
  eq([ad.kind, ad.paid], [2, true]);
  eq(n.S.items().map((i) => i.id), [9, 3, 5], 'items() is the snapshot');
});

test('2b ids are fetched 10 at a time, capped at maxLive (32), and a missing row (none) is skipped without shifting the others', async () => {
  const live = [], items = {};
  for (let i = 1; i <= 40; i++) { live.push(i); items[i] = { head: 'M' + i }; }
  delete items[12];                                   // row 12 comes back as none
  const n = on(boot({ live, items }));
  eq(n.S.config().maxLive, 32);
  await n.S.refresh(true);
  eq(n.calls('get-items'), 4, '32 ids = chunks of 10,10,10,2');
  const ids = n.S.items().map((i) => i.id);
  eq(ids.length, 31); ok(!ids.includes(12) && !ids.includes(33) && ids[0] === 1 && ids[ids.length - 1] === 32);
  eq(n.S.items().find((i) => i.id === 13).head, 'M13', 'head matches its own id after the skipped row');
});

test('2c head and body are cut to the contract\'s 80 / 240, unknown kinds fall back to MESSAGE', () => {
  const S = boot().S;
  const it = S.normalizeItem(5, { kind: 7, head: 'h'.repeat(120), body: 'b'.repeat(400), status: 1 });
  eq([it.head.length, it.body.length, it.kind], [80, 240, 0]);
  eq(S.normalizeItem(2, null).head, '', 'null row is safe');
});

/* ------------------------------------------------------------ 3  what is shown */
test('3a a paid ad is labelled AD · PAID, a free ad AD, a paid message just MESSAGE; news is NEWS', async () => {
  const S = boot().S, mk = (kind, paid) => S.normalizeItem(1, { kind, head: 'H', body: 'B', status: 1, paid });
  eq(has(draw(S, { items: [mk(2, true)] }), 'AD · PAID'), true);
  eq(has(draw(S, { items: [mk(2, false)] }), 'AD'), true);
  eq(has(draw(S, { items: [mk(2, false)] }), 'AD · PAID'), false);
  const m = draw(S, { items: [mk(0, true)] });
  ok(has(m, 'MESSAGE') && !has(m, 'MESSAGE · PAID'), 'a paid message carries no PAID tag');
  ok(has(draw(S, { items: [mk(1, false)] }), 'NEWS'));
});

test('3b the feature panel shows the head upper-cased and the body wrapped; an empty list is the idle panel', () => {
  const S = boot().S;
  const x = draw(S, { items: [S.normalizeItem(1, { kind: 1, head: 'Big news', body: 'one two three', status: 1 })] });
  ok(has(x, 'BIG NEWS') && has(x, 'one two three'));
  eq(x.texts.filter((t) => t === IDLE).length, 0, 'no idle panel and no default ticker while a feature is up');
  ok(draw(S, { items: [] }).texts.filter((t) => t === IDLE).length >= 2);
  eq(draw(S, { items: [S.normalizeItem(1, { kind: 0, head: '', body: '', status: 1 })] }).texts.filter((t) => t === IDLE).length >= 2, true, 'an empty message is not featured');
});

test('3c ticker: messages and news only, by id, news by headline, upper-case; the default line when empty', () => {
  const S = boot().S, mk = (id, kind, head, body) => S.normalizeItem(id, { kind, head, body, status: 1 });
  eq(S.tickerText([mk(8, 0, 'last', ''), mk(2, 1, 'Headline', 'ignored body'), mk(5, 2, 'AD HEAD', 'x'), mk(3, 0, '', 'body only')]), 'HEADLINE   ◆   BODY ONLY   ◆   LAST');
  eq(S.tickerText([]), '');
  ok(has(draw(S, { items: [mk(1, 1, 'Scrolling', '')] }), 'SCROLLING'));
  ok(has(draw(S, { items: [] }), IDLE));
});

test('3d rotation: one item per rotateSecs, same for everyone at the same t, heavier items come round more often', () => {
  const S = boot().S, mk = (id, w) => S.normalizeItem(id, { kind: 1, head: 'H' + id, status: 1, weight: w });
  const items = [mk(3, 1), mk(1, 3), mk(2, 1)];
  const seq = [];
  for (let k = 0; k < 6; k++) seq.push(S.featureAt(items, k * 12, 12).id);
  eq(seq, [1, 2, 3, 1, 1, 1], 'layer 1 = all by id, layers 2-3 = the weight-3 item');
  eq(S.featureAt(items, 12 * 5, 12).id, 1, 'wraps round after 5 slots (3 + 1 + 1)');
  eq(S.featureAt(items, 5, 12).id, S.featureAt(items, 0, 12).id, 'stable inside a slot');
  eq(S.featureAt(items.slice().reverse(), 0, 12).id, 1, 'input order does not matter');
  eq(S.featureAt([], 0, 12), null);
  eq(S.featureAt(items, -50, 12).id, 1, 'negative time is clamped');
});

test('3e wrapText wraps at the width, stops at maxLines with an ellipsis, and ago() formats block ages', () => {
  const S = boot().S, m = (s) => s.length;
  eq(S.wrapText(m, 'aa bb cc dd', 5, 5), ['aa bb', 'cc dd']);
  eq(S.wrapText(m, 'aa bb cc dd ee', 5, 2), ['aa bb', 'cc…'], 'the ellipsis cuts at a word boundary');
  eq(S.wrapText(m, 'aa bb cccccccc dd', 5, 2), ['aa bb', 'cccc…'], 'a lone word too long for the line is cut by character');
  eq(S.wrapText(m, '', 5, 2), []);
  eq(S.wrapText(m, 'unbreakable', 3, 2), ['unbreakable'], 'a single long word is kept whole');
  eq([0, 1, 5, 6, 143, 144, 300].map(S.ago), ['1M', '10M', '50M', '1H', '24H', '1D', '2D']);
});

/* ------------------------------------------------------------ 4  review lane / expiry / paused */
test('4a review-lane (status 0), rejected/retired and hidden items are never active; approval makes one appear', async () => {
  const n = on(boot({ version: 1, live: [1, 2, 3, 4, 5], height: 5000, items: {
    1: { head: 'LIVE', status: 1 }, 2: { head: 'PENDING', status: 0, paid: true }, 3: { head: 'REJECTED', status: 2 },
    4: { head: 'HIDDEN', status: 1, hidden: true }, 5: { head: 'RETIRED', status: 3 } } }));
  await n.S.refresh(true);
  eq(n.S.items().length, 5, 'the snapshot is a faithful copy of what the contract lists');
  const active = () => n.S.activeItems(n.S.items(), 5000).map((i) => i.head);
  eq(active(), ['LIVE']);
  const x = draw(n.S, { items: n.S.activeItems(n.S.items(), 5000) });
  ok(!has(x, 'PENDING') && !has(x, 'HIDDEN') && !has(x, 'REJECTED'));
  // a pending item the contract does not list is not even read
  n.chain.items[7] = { head: 'NOT LISTED', status: 0 }; n.reset(); await n.S.refresh(true);
  ok(!n.S.items().some((i) => i.id === 7), 'ids come only from get-live');
  // approve 2 (status 1) and unhide 4: the version bumps, the screen follows
  n.chain.items[2].status = 1; n.chain.items[4].hidden = false; n.chain.version = 2;
  eq(await n.S.refresh(false), { ok: true, changed: true });
  eq(active(), ['LIVE', 'PENDING', 'HIDDEN']);
});

test('4b expiry is decided here from the chain height: start inclusive, end exclusive; unknown height trusts the list', async () => {
  const n = on(boot({ live: [1, 2, 3], height: 5000, items: {
    1: { head: 'ENDED', startsAt: 100, endsAt: 4999 }, 2: { head: 'EDGE', startsAt: 5000, endsAt: 5001 }, 3: { head: 'FUTURE', startsAt: 5001, endsAt: 6000 } } }));
  await n.S.refresh(true);
  const heads = (h) => n.S.activeItems(n.S.items(), h).map((i) => i.head);
  eq(heads(5000), ['EDGE']); eq(heads(4999), [], 'ends-at is exclusive'); eq(heads(5001), ['FUTURE']); eq(heads(4998), ['ENDED']);
  eq(heads(0), ['ENDED', 'EDGE', 'FUTURE'], 'height 0 (not live) trusts the contract list');
  eq(heads(null), ['ENDED', 'EDGE', 'FUTURE']);
  eq(n.S.isActive(null, 5), false);
});

test('4c get-height failing is not fatal: the snapshot still loads with height null', async () => {
  const n = on(boot({ live: [1], items: { 1: { head: 'X' } } })); n.failFn.add('get-height');
  eq(await n.S.refresh(true), { ok: true, changed: true });
  eq(n.S.snapshot().height, null); eq(n.S.items().length, 1);
});

test('4d a paused contract is not special to the client: it never reads is-paused and keeps showing what the contract lists', async () => {
  const n = on(boot({ live: [1], items: { 1: { head: 'STILL UP' } } }));
  await n.S.refresh(true);
  ok(!n.log.some((l) => l.fn === 'is-paused'), 'no pause read');
  eq(new Set(n.log.map((l) => l.fn)), new Set(['get-version', 'get-live', 'get-items', 'get-height']));
  ok(has(draw(n.S, { items: n.S.activeItems(n.S.items(), 5000) }), 'STILL UP'));
});

test('4e the pending-per-buyer cap is contract-only: the client has no cap on pending items, only the live-set bound (maxLive)', () => {
  const S = boot().S;
  eq(S.config().maxLive, 32, 'matches MAX-LIVE u32 in xtrata-screen-v1.clar');
  eq(typeof S.config().maxPending, 'undefined');
});

/* ------------------------------------------------------------ 5  latest scorers */
test('5 latest scorers from a canned get-top10 response: window, newest first, dedupe, limit, formatting, drawn rows', async () => {
  const n = on(boot({ scores: {
    A: [{ name: 'AAA', score: 500, burn: 4990 }, { name: 'OLD', score: 900, burn: 4000 }, { name: 'FUT', score: 1, burn: 5100 }],
    B: [{ name: 'BOB', score: 70, burn: 4995 }, { name: 'AAA', score: 500, burn: 4980 }, { name: 'ZED', score: 3, burn: 0 }] } }));
  const boards = [];
  for (const [b, game, colour] of [['A', 'Star Patrol', '#f00'], ['B', 'Block Breaker Deluxe', '#0f0']]) {
    const r = await n.win.XAScores.getTop10(b, 0, true);
    eq(r.ok, true); boards.push({ game, colour, mode: 'score', entries: r.entries });
  }
  eq(boards[0].entries.map((e) => e.name), ['AAA', 'OLD', 'FUT'], 'decoded by the score client');
  const fmt = (mode, s) => mode + ':' + s;
  const rows = n.S.latestScorers(boards, 5000, 288, fmt, 8);
  eq(rows.map((r) => r.name + '@' + r.age), ['BOB@5', 'AAA@10', 'AAA@20'], 'newest first; OLD (age 1000), FUT (negative) and burn 0 dropped');
  eq(rows[0], { game: 'Block Breaker Deluxe', colour: '#0f0', name: 'BOB', score: 'score:70', age: 5, burn: 4995 });
  // no window (0): the newest top scores whatever their age; an entry just ahead of our height counts as brand new
  for (const w of [0]) {
    const all = n.S.latestScorers(boards, 5000, w, fmt, 8);
    eq(all.map((r) => r.name + '@' + r.age), ['FUT@0', 'BOB@5', 'AAA@10', 'AAA@20', 'OLD@1000'], 'window ' + w + ': nothing is too old; burn 0 (unknown) still dropped');
  }
  eq(n.S.latestScorers(boards, 5000, 288, fmt, 8).length, 3, 'a window can still be asked for');
  // same game+name+score twice is one row; same name on another board is kept
  const dup = n.S.latestScorers([{ game: 'G', mode: 'm', entries: [{ name: 'X', score: 1, burn: 90 }, { name: 'X', score: 1, burn: 80 }, { name: 'X', score: 2, burn: 70 }] }], 100, 288, null, 8);
  eq(dup.map((r) => r.score), ['1', '2'], 'without fmt the score is a string');
  const many = [{ game: 'G', mode: 'm', entries: Array.from({ length: 12 }, (_, i) => ({ name: 'P' + i, score: i, burn: 100 + i })) }];
  eq(n.S.latestScorers(many, 200, 288, null, 8).length, 8, 'limit 8'); eq(n.S.latestScorers(many, 200, 288, null, 3).length, 3);
  eq(n.S.latestScorers(many, 0, 288, null, 8).length, 8, 'no height known: no window, age 0');
  eq(n.S.latestScorers(null, 5, 288), []);
  const x = draw(n.S, { scorers: rows });
  ok(has(x, 'BLOCK BREAKER') && has(x, 'STAR PATROL') && has(x, 'BOB') && has(x, 'score:70'), 'game cut to 13 chars upper-case');
  ok(has(x, '50M') && !has(x, 'NO SCORES YET'));
});

/* ------------------------------------------------------------ 5b  the left column: latest scorers and the number ones */
test('5b the left column rotates: latest 20 s, number ones newest first 40 s, latest 20 s, number ones A to Z 40 s; without number ones it stays on latest', () => {
  const S = boot().S;
  const at = (t, have) => S.leftPhase(t, have);
  eq(at(0, true), { kind: 'latest', order: '', local: 0 });
  eq(at(19.9, true).kind, 'latest');
  eq(at(20, true), { kind: 'champs', order: 'new', local: 0 });
  eq(at(59.9, true).order, 'new');
  eq(at(60, true), { kind: 'latest', order: '', local: 0 });
  eq(at(80, true), { kind: 'champs', order: 'abc', local: 0 });
  eq(at(119.9, true).order, 'abc');
  eq(at(120, true).kind, 'latest', 'and round again');
  eq(at(1e6 + 25, true).kind, ['latest', 'champs'][((1e6 + 25) % 120) < 20 ? 0 : ((1e6 + 25) % 120) < 60 ? 1 : ((1e6 + 25) % 120) < 80 ? 0 : 1]);
  for (const t of [0, 25, 70, 100]) eq(at(t, false).kind, 'latest', 'no number ones to show at t=' + t);
});

test('5c number ones: best score per board (highest, or lowest on a time board), earlier wins a tie, unread boards skipped, empty boards unclaimed; order newest first or A to Z', () => {
  const S = boot().S;
  const fmt = (m, v) => m + ':' + v;
  const rows = S.champions([
    { game: 'Zed Game', colour: '#f00', mode: 'score', entries: [{ name: 'LOW', score: 5, burn: 4000 }, { name: 'TOP', score: 90, burn: 4900 }, { name: 'TIE', score: 90, burn: 4500 }] },
    { game: 'Arrow Sprint', colour: '#0f0', mode: 'time', entries: [{ name: 'FAST', score: 96, burn: 4990 }, { name: 'SLOW', score: 1878, burn: 4100 }] },
    { game: 'Midgame', colour: '#00f', mode: 'score', entries: [{ name: 'OLD', score: 10, burn: 3000 }] },
    { game: 'Block Drop', variant: 'SPRINT TOP 10', colour: '#ff0', mode: 'time', entries: [] },
    { game: 'Not Read Yet', colour: '#fff', mode: 'score', entries: null },
    null
  ], 5000, fmt);
  eq(rows.map((r) => r.game), ['Zed Game', 'Arrow Sprint', 'Midgame', 'Block Dr SPRI'], 'the unread board and the null are skipped; a variant is cut to fit');
  eq(rows[0], { game: 'Zed Game', colour: '#f00', name: 'TIE', score: 'score:90', age: 500, burn: 4500, claimed: true }, 'highest wins; the earlier of two equal scores');
  eq(rows[1].name, 'FAST', 'on a time board the lowest wins'); eq(rows[1].score, 'time:96');
  eq(rows[3].claimed, false, 'a board that was read and is empty is unclaimed');
  eq(S.orderChampions(rows, 'new').map((r) => r.game), ['Arrow Sprint', 'Zed Game', 'Midgame', 'Block Dr SPRI'], 'newest crown first, unclaimed last');
  eq(S.orderChampions(rows, 'abc').map((r) => r.game), ['Arrow Sprint', 'Block Dr SPRI', 'Midgame', 'Zed Game'], 'A to Z, unclaimed in place');
  eq(rows.map((r) => r.game), ['Zed Game', 'Arrow Sprint', 'Midgame', 'Block Dr SPRI'], 'ordering does not change the list it is given');
  eq(S.champions(null, 5, fmt), []);
  eq(S.champions([{ game: 'G', mode: 'score', entries: [{ name: 'X', score: 3, burn: 0 }] }], 5000, null)[0], { game: 'G', colour: undefined, name: 'X', score: '3', age: null, burn: 0, claimed: true }, 'no burn height: age unknown, never a made-up number');
});

test('5d drawn: latest scorers at first, then the number ones (title, order, page), a NEW mark under a day, unclaimed rows, paging, and the old behaviour without number ones', () => {
  const S = boot().S;
  const mk = (i, burn) => ({ game: 'Game ' + String.fromCharCode(65 + i), colour: '#3be4ff', name: 'P' + i, score: String(i * 10), age: burn == null ? null : 5000 - burn, burn: burn || 0, claimed: burn != null });
  const champs = Array.from({ length: 20 }, (_, i) => mk(i, 4999 - i * 30));
  champs.push(mk(20, null), mk(21, null));   // two unclaimed
  const scorers = [{ game: 'Latest Game', colour: '#f0f', name: 'ZOE', score: '123', age: 3 }];
  const D = (t, c) => draw(S, { height: 5000, t, scorers, champions: c });
  let x = D(5, champs);
  ok(has(x, 'LATEST SCORERS') && has(x, 'ZOE') && !has(x, 'NUMBER ONES'), 't=5: latest scorers');
  x = D(21, champs);   // number ones, newest first: page 1 of 3 (22 rows, 8 a page)
  ok(has(x, 'NUMBER ONES') && has(x, 'NEWEST FIRST  1/3') && !has(x, 'LATEST SCORERS'), 't=21: number ones, newest first, page 1 of 3');
  ok(has(x, 'GAME A') && has(x, 'P0') && has(x, 'NEW'), 'the newest crown is first, inside a day, marked NEW');
  ok(!has(x, 'GAME I'), 'only eight rows on a page');
  x = D(20 + 12, champs);   // page 2 starts at local 11.7+ (pageSecs = 40/3 clamped to 10): local 12 is page 2
  ok(has(x, 'NEWEST FIRST  2/3') && has(x, 'GAME I'), 'it pages on');
  x = D(20 + 25, champs);
  ok(has(x, 'NEWEST FIRST  3/3') && has(x, 'NO #1 YET') && has(x, 'BE FIRST'), 'the unclaimed boards come last and say so');
  x = D(85, champs);
  ok(has(x, 'NUMBER ONES') && has(x, 'A TO Z  1/3'), 't=85: the second round is A to Z');
  x = D(65, champs);
  ok(has(x, 'LATEST SCORERS'), 't=65: latest scorers again');
  x = D(25, []);
  ok(has(x, 'LATEST SCORERS') && has(x, 'ZOE') && !has(x, 'NUMBER ONES'), 'no number ones known: always the latest scorers (the old behaviour)');
  x = D(25, undefined);
  ok(has(x, 'LATEST SCORERS'), 'champions not supplied at all: the old behaviour');
  eq(x.saves, x.restores, 'paint balances save/restore');
});

/* ------------------------------------------------------------ 6  pictures */
// the first bytes of each format we accept (the sniffer only needs the header)
const pad = (a) => { const u = new Uint8Array(32); u.set(a); return u; };
const MEDIA = {
  png: pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), jpeg: pad([0xff, 0xd8, 0xff, 0xe0]), gif: pad([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]),
  webp: pad([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]), mp4: pad([0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]), webm: pad([0x1a, 0x45, 0xdf, 0xa3]),
};
function pictureHarness(n, mode) {
  const win = n.win, st = { loads: [], imgs: [], blobs: 0 };
  win.Blob = class { constructor(p) { st.blobs++; this.p = p; } };
  win.URL = { createObjectURL: () => 'blob:mock' };
  win.Image = class { constructor() { this.naturalWidth = 200; this.naturalHeight = 100; st.imgs.push(this); } set src(v) { this._src = v; } };
  win.XAWorld.loadImageBytes = (e) => { st.loads.push(e); return mode === 'fail' ? Promise.reject(new Error('hash mismatch')) : Promise.resolve(mode === 'html' ? new TextEncoder().encode('<html><script>alert(1)</script></html>') : mode === 'svg' ? new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>') : MEDIA[mode === 'ok' || !mode ? 'png' : mode]); };
  return st;
}
test('6a a picture slot: the mock inscription id + hash go to loadImageBytes once; drawn only after it decodes; picture event fires', async () => {
  const hash = new Uint8Array(32).fill(7);
  const n = on(boot({ live: [1, 2], items: { 1: { kind: 2, head: 'PIC', body: 'b', imageId: 777, imageHash: hash, imageSize: 4096, paid: true }, 2: { kind: 1, head: 'PLAIN' } } }));
  const st = pictureHarness(n, 'ok'), events = [];
  await n.S.refresh(true);
  const [pic, plain] = n.S.items();
  eq([pic.imageId, pic.imageSize], [777, 4096]); eq(Array.from(pic.imageHash), Array.from(hash)); ok(n.S.hasPicture(pic)); ok(!n.S.hasPicture(plain));
  n.S.onChange((s, why) => events.push(why));
  let x = draw(n.S, { items: [pic] });
  eq(st.loads.length, 1); eq([st.loads[0].imageId, Array.from(st.loads[0].imageHash).length], [777, 32]);
  eq(x.images.length, 0, 'not drawn before it is decoded');
  await settle(n); st.imgs[0].onload();
  eq(events, ['picture'], 'listeners are told so the hall repaints');
  x = draw(n.S, { items: [pic] });
  eq(x.images.length, 1, 'drawn once decoded'); eq(st.loads.length, 1, 'loaded once only'); eq(st.blobs, 1);
  draw(n.S, { items: [plain] }); eq(st.loads.length, 1, 'a no-picture item loads nothing');
});

test('6b hasPicture needs a size, a hash and an id; a failed picture is never drawn and never retried', async () => {
  const S = boot().S, h = new Uint8Array(32);
  const base = { kind: 2, head: 'P', status: 1, 'image-id': 5, 'image-hash': h, 'image-size': 10 };
  ok(S.hasPicture(S.normalizeItem(1, base)));
  for (const bad of [{ 'image-id': 0 }, { 'image-size': 0 }, { 'image-hash': null }]) ok(!S.hasPicture(S.normalizeItem(1, Object.assign({}, base, bad))), JSON.stringify(Object.keys(bad)));
  ok(!S.hasPicture(null));
  const n = boot(); const st = pictureHarness(n, 'fail');
  const it = n.S.normalizeItem(9, base);
  for (let i = 0; i < 3; i++) { await settle(n); eq(draw(n.S, { items: [it] }).images.length, 0); }
  eq(st.loads.length, 1, 'one attempt only');
});

test('6c what a picture slot may hold: PNG, JPEG, GIF, WebP, MP4, WebM by their bytes; SVG, HTML and unknown bytes are refused and never drawn', async () => {
  const S = boot().S;
  for (const [k, kind, vid] of [['png', 'png', false], ['jpeg', 'jpeg', false], ['gif', 'gif', false], ['webp', 'webp', false], ['mp4', 'mp4', true], ['webm', 'webm', true]]) {
    const m = S.sniffMedia(MEDIA[k]); eq([m.kind, m.video], [kind, vid], k);
  }
  eq(S.sniffMedia(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), null);
  eq(S.sniffMedia(new TextEncoder().encode('<!doctype html><html></html>')), null);
  eq(S.sniffMedia(new Uint8Array(3)), null, 'too short'); eq(S.sniffMedia(null), null);
  eq(S.sniffMedia(pad([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45])), null, 'a RIFF WAV is not a WebP');
  for (const mode of ['html', 'svg']) {
    const hash = new Uint8Array(32).fill(7);
    const n = on(boot({ live: [1], items: { 1: { kind: 2, head: 'BAD', imageId: 5, imageHash: hash, imageSize: 4096, paid: true } } }));
    const st = pictureHarness(n, mode);
    await n.S.refresh(true);
    const it = n.S.items()[0];
    for (let i = 0; i < 3; i++) { await settle(n); eq(draw(n.S, { items: [it] }).images.length, 0, mode + ' is never drawn'); }
    eq(st.imgs.length, 0, mode + ' is never handed to an Image'); eq(st.loads.length, 1, 'one attempt only');
  }
});

test('6d an animated GIF asks for fast repaints only while it is the item on screen; a clip plays on screen and pauses off it', async () => {
  const hash = new Uint8Array(32).fill(3);
  const mk = (id, mode) => { const n = on(boot({ live: [id], items: { [id]: { kind: 2, head: 'ANIM', imageId: id, imageHash: hash, imageSize: 9999, paid: true } } })); return n; };
  // GIF
  const g = mk(1, 'gif'); const gs = pictureHarness(g, 'gif'); await g.S.refresh(true); const gi = g.S.items()[0];
  eq(g.S.animating(), false); draw(g.S, { items: [gi] }); await settle(g); gs.imgs[0].onload();
  draw(g.S, { items: [gi] }); eq(g.S.animating(), true, 'a GIF on screen wants about 25 fps');
  draw(g.S, { items: [] }); eq(g.S.animating(), false, 'nothing animated on screen: back to the slow repaint');
  // a still PNG never asks
  const p = mk(2, 'png'); const ps = pictureHarness(p, 'png'); await p.S.refresh(true); const pi = p.S.items()[0];
  draw(p.S, { items: [pi] }); await settle(p); ps.imgs[0].onload(); draw(p.S, { items: [pi] }); eq(p.S.animating(), false, 'a still picture does not');
  // MP4: a muted looping video element, never attached to the page
  const v = mk(3, 'mp4'); const vs = pictureHarness(v, 'mp4');
  const clips = [];
  v.win.document = { createElement: (t) => { const c = { t, paused: true, attrs: {}, playCalls: 0, pauseCalls: 0, videoWidth: 640, videoHeight: 360,
    setAttribute(k, val) { this.attrs[k] = val; }, play() { this.paused = false; this.playCalls++; return Promise.resolve(); }, pause() { this.paused = true; this.pauseCalls++; } }; clips.push(c); return c; } };
  await v.S.refresh(true); const vi = v.S.items()[0];
  draw(v.S, { items: [vi] }); await settle(v);
  eq(clips.length, 1); eq([clips[0].t, clips[0].muted, clips[0].loop, clips[0].playsInline], ['video', true, true, true], 'muted, looping, inline'); eq(vs.imgs.length, 0, 'no Image for a clip');
  clips[0].onloadeddata();
  let x = draw(v.S, { items: [vi] }); eq(x.images.length, 1, 'the clip is drawn once its first frame is ready'); eq(clips[0].playCalls, 1, 'it plays while on screen'); eq(v.S.animating(), true);
  draw(v.S, { items: [vi] }); eq(clips[0].playCalls, 1, 'not restarted every frame');
  draw(v.S, { items: [] }); eq(clips[0].pauseCalls, 1, 'paused as soon as it is not the item on show'); eq(v.S.animating(), false);
  draw(v.S, { items: [vi] }); eq(clips[0].playCalls, 2, 'and plays again when its turn comes round');
  v.S.idle(); eq(clips[0].paused, true, 'idle() (player far from the screen) pauses clips');
});

test('6e two rotations: standard items take the panel, every 3rd slot is full-screen for every item with a picture; premium (layout 1) is full-screen only and comes round twice as often', async () => {
  const S0 = boot().S, hash = new Uint8Array(32).fill(5);
  eq([S0.normalizeItem(1, {}).layout, S0.normalizeItem(1, { layout: 1 }).layout, S0.normalizeItem(1, { layout: 2 }).layout, S0.normalizeItem(1, { layout: -3 }).layout], [0, 1, 0, 0], 'only 1 means full-screen only; old items are standard');
  const mk = (id, extra) => S0.normalizeItem(id, Object.assign({ kind: 1, head: 'H' + id, status: 1, weight: 1 }, extra));
  const pic = { 'image-id': 50, 'image-size': 9999, 'image-hash': hash };
  const A = mk(1, {}), B = mk(2, Object.assign({ kind: 2 }, pic)), P = mk(3, Object.assign({ kind: 2, layout: 1, weight: 2 }, pic)), C = mk(4, {});
  const seq = (items, from, to) => { const o = []; for (let k = from; k < to; k++) { const r = S0.slotAt(items, k * 12, 12, 3); o.push((r.item ? r.item.id : 0) + (r.full ? 'F' : 'p')); } return o; };
  eq(seq([A, B, P, C], 0, 12), ['1p', '2p', '2F', '4p', '1p', '3F', '2p', '4p', '3F', '1p', '2p', '2F'], 'panel: 1,2,4 in turn; full-screen slot every 3rd: B, P, P, B, ... (premium weight 2)');
  const long = seq([A, B, P, C], 0, 297);   // 99 whole cycles
  ok(!long.includes('3p'), 'a full-screen-only item is never in the panel'); ok(long.filter((x) => x === '2F').length > 0, 'a standard item with a picture does get the whole screen');
  eq(long.filter((x) => x === '3F').length, 2 * long.filter((x) => x === '2F').length, 'premium gets twice the full-screen turns');
  ok(!long.includes('1F') && !long.includes('4F'), 'no picture, no full-screen turn');
  eq(seq([A, C], 0, 6), ['1p', '4p', '1p', '4p', '1p', '4p'], 'nothing has a picture: all panel');
  eq(seq([P], 0, 4), ['3F', '3F', '3F', '3F'], 'only full-screen items: every slot is full-screen');
  eq(seq([], 0, 2), ['0p', '0p']); eq(S0.slotAt([], 5).item, null);
  eq(S0.featureAt([A, B, P, C], 24, 12).id, 2, 'featureAt still answers "which item"');
  eq(S0.slotAt([A, P], 0, 12, 2).full, false, 'every=2: slot 0 panel'); eq(S0.slotAt([A, P], 12, 12, 2).full, true, 'every=2: slot 1 full-screen'); eq(S0.slotAt([A, P], 12, 12, 1).full, true, 'every is at least 2 (1 would leave no panel slot)');

  // drawing: a full-screen slot paints the picture over the whole screen above the ticker; a panel slot paints the thumbnail
  const n = on(boot({ live: [1], items: { 1: { kind: 2, head: 'BIG AD', body: 'body text', imageId: 50, imageHash: hash, imageSize: 9999, paid: true } } }));
  const st = pictureHarness(n, 'png');
  await n.S.refresh(true); const it = n.S.items()[0];
  let x = draw(n.S, { items: [it], t: 24 });   // single item with a picture: slot 2 is the full-screen slot
  eq(x.images.length, 0, 'nothing drawn before the picture is ready'); ok(has(x, 'BIG AD') && has(x, 'body text'), 'the item shows in the panel meanwhile');
  await settle(n); st.imgs[0].naturalWidth = 800; st.imgs[0].naturalHeight = 400; st.imgs[0].onload();
  x = draw(n.S, { items: [it], t: 24 });
  eq(x.images.length, 1, 'one picture per frame'); eq(x.drawn[0].map(Math.round), [20, 0, 1240, 620], 'an 800x400 picture fitted into 1280 x 620, above the 100 px ticker, centred');
  ok(has(x, 'BIG AD') && has(x, 'AD · PAID'), 'label and headline strip kept');
  x = draw(n.S, { items: [it], t: 0 });
  eq(x.images.length, 1); ok(x.drawn[0][2] < 400, 'a panel slot: the thumbnail beside the text'); ok(has(x, 'body text'));
  // a tall picture is pillar-boxed, never stretched
  const n2 = on(boot({ live: [1], items: { 1: { kind: 2, head: 'TALL', imageId: 51, imageHash: hash, imageSize: 9999, paid: true, layout: 1 } } }));
  const st2 = pictureHarness(n2, 'png'); await n2.S.refresh(true); const it2 = n2.S.items()[0]; eq(it2.layout, 1);
  draw(n2.S, { items: [it2] }); await settle(n2); st2.imgs[0].naturalWidth = 300; st2.imgs[0].naturalHeight = 600; st2.imgs[0].onload();
  x = draw(n2.S, { items: [it2] }); const [dx, dy, dw, dh] = x.drawn[0];
  eq([Math.round(dh), Math.round(dw)], [620, 310]); ok(Math.abs(dx - 485) < 0.01, 'centred');
  // a premium picture that fails (bad hash) leaves the rotation: nothing is ever shown for it in the panel
  const n3 = on(boot({ live: [1], items: { 1: { kind: 2, head: 'GONE', imageId: 52, imageHash: hash, imageSize: 9999, paid: true, layout: 1 } } }));
  pictureHarness(n3, 'fail'); await n3.S.refresh(true); const it3 = n3.S.items()[0];
  draw(n3.S, { items: [it3] }); await settle(n3);
  eq(n3.S.slotAt([it3], 0, 12).item, null, 'a full-screen-only item whose picture failed is dropped, not shown as text');
  // look-ahead: the picture for the next (full-screen) slot is requested one slot early
  const n4 = on(boot({ live: [1, 2], items: { 1: { kind: 1, head: 'TEXT', body: 'b' }, 2: { kind: 2, head: 'PREMIUM', imageId: 53, imageHash: hash, imageSize: 9999, paid: true, layout: 1, weight: 2 } } }));
  const st4 = pictureHarness(n4, 'png'); await n4.S.refresh(true); const [t1, p2] = n4.S.items();
  draw(n4.S, { items: [t1, p2], t: 0 }); eq(st4.loads.length, 0, 'slot 0 -> next is a panel slot: nothing fetched yet');
  draw(n4.S, { items: [t1, p2], t: 12 }); eq(st4.loads.map((l) => l.imageId), [53], 'slot 1 -> next is the full-screen slot: its picture is fetched now');
});

/* ------------------------------------------------------------ 7  failed read keeps last good state */
test('7a a failed read keeps the last good snapshot (and its version), at every step of the load', async () => {
  const n = on(boot({ version: 3, live: [1, 2], items: { 1: { head: 'ONE' }, 2: { head: 'TWO' } } }));
  eq(await n.S.refresh(true), { ok: true, changed: true });
  const good = JSON.stringify(n.S.snapshot());
  n.chain.version = 4; n.chain.items[2].head = 'TWO v4';
  for (const fn of ['get-version', 'get-live', 'get-items']) {
    n.failFn = new Set([fn]);
    const r = await n.S.refresh(false);
    eq([r.ok, r.changed], [false, false], fn);
    eq(JSON.stringify(n.S.snapshot()), good, fn + ' failure leaves the snapshot alone');
    eq(n.S.items().map((i) => i.head), ['ONE', 'TWO']);
    eq(n.S._t.state.version, 3, 'version not advanced by a failed load, so the next poll retries');
    ok(has(draw(n.S, { items: n.S.activeItems(n.S.items(), 5000) }), 'ONE'), 'still drawn from the old snapshot');
  }
  n.failFn = new Set(); n.down = true; ok(!(await n.S.refresh(true)).ok); eq(JSON.stringify(n.S.snapshot()), good, 'whole node down');
  n.down = false;
  eq(await n.S.refresh(false), { ok: true, changed: true }, 'recovery picks up the new version');
  eq(n.S.items().map((i) => i.head), ['ONE', 'TWO v4']);
});

test('7b an empty live list from a healthy node IS "no news" (and replaces the old snapshot); a failed read is not', async () => {
  const n = on(boot({ version: 1, live: [1], items: { 1: { head: 'ONE' } } }));
  await n.S.refresh(true); eq(n.S.items().length, 1);
  n.chain.live = []; n.chain.version = 2;
  eq(await n.S.refresh(false), { ok: true, changed: true }); eq(n.S.items(), []);
});

test('7c the last good snapshot is cached; a visitor whose node is down gets it back, hash bytes intact, via the cache event', async () => {
  const hash = new Uint8Array(32).fill(9);
  const a = on(boot({ version: 2, live: [1], items: { 1: { kind: 2, head: 'CACHED', imageId: 5, imageHash: hash, imageSize: 9 } } }));
  await a.S.refresh(true);
  const stored = a.win._store['xa-screen-snap-v1']; ok(stored && stored.includes('$hex'), 'Uint8Array stored as $hex');
  const b = on(boot()); b.down = true; b.win._store['xa-screen-snap-v1'] = stored;
  const why = []; b.S.onChange((s, w) => why.push(w));
  eq(b.S.start(), true); await settle(b);
  eq(why, ['cache'], 'cache announced, the failed refresh announces nothing');
  eq(b.S.items().map((i) => i.head), ['CACHED']);
  ok(b.S.items()[0].imageHash instanceof b.win.Uint8Array); eq(Array.from(b.S.items()[0].imageHash), Array.from(hash));
  const bad = on(boot()); bad.down = true; bad.win._store['xa-screen-snap-v1'] = '{not json';
  eq(bad.S.start(), true); await settle(bad); eq(bad.S.snapshot(), null, 'a corrupt cache is ignored');
});

/* ------------------------------------------------------------ 8  polling */
test('8a polling reads only get-version until it changes; force reloads; a version bump reloads everything', async () => {
  const n = on(boot({ version: 1, live: [1, 2], items: { 1: { head: 'A' }, 2: { head: 'B' } } }));
  eq(await n.S.refresh(false), { ok: true, changed: true }, 'first load (no version yet)');
  eq([n.calls('get-version'), n.calls('get-live'), n.calls('get-items'), n.calls('get-height')], [2, 1, 1, 1], 'one cheap check, then the load re-reads the version');
  let events = 0; n.S.onChange(() => events++);
  n.reset();
  for (let i = 0; i < 3; i++) eq(await n.S.refresh(false), { ok: true, changed: false });
  eq(n.calls(), 3); eq(n.calls('get-version'), 3, 'three polls = three version reads and nothing else'); eq(events, 0, 'no repaint trigger');
  n.reset(); eq(await n.S.refresh(true), { ok: true, changed: true }); ok(n.calls('get-items') === 1 && n.calls('get-live') === 1, 'force reloads at the same version');
  eq(events, 1);
  n.chain.version = 2; n.chain.live = [2]; n.reset();
  eq(await n.S.refresh(false), { ok: true, changed: true }); eq(n.S.items().map((i) => i.id), [2]); eq(events, 2);
  eq(n.S.snapshot().version, 2);
});

test('8b start(): one poll timer however often it is called, never faster than every 30 s', async () => {
  const n = on(boot({ version: 1, live: [1], items: { 1: { head: 'A' } } }), { pollMs: 1000 });
  eq(n.S.start(), true); eq(n.S.start(), true);
  await settle(n);
  eq(n.win.timers.length, 1, 'a second start() adds no second timer'); eq(n.win.timers[0].ms, 30000, 'pollMs is floored at 30 s');
  eq(n.calls('get-live'), 1, 'the second start() found the first still loading and skipped its forced refresh');
});

test('8c the poll timer only checks the version; stop() clears it; the default is 3 minutes; start reads XA_WORLD_CONFIG.screen', async () => {
  const n = boot({ version: 1, live: [1], items: { 1: { head: 'A' } } });
  n.win.XA_WORLD_CONFIG = { screen: SCREEN };
  eq(n.S.config().pollMs, 180000);
  eq(n.S.start(), true); await settle(n);
  eq(n.S.config().contract, SCREEN);
  eq(n.win.timers[0].ms, 180000);
  n.reset(); n.win.timers[0].fn(); await settle(n);
  eq(n.calls(), 1, 'a timer tick at an unchanged version is one read'); eq(n.calls('get-version'), 1);
  n.chain.version = 5; n.chain.items[1].head = 'B'; n.reset(); n.win.timers[0].fn(); await settle(n);
  eq(n.S.items()[0].head, 'B');
  n.S.stop(); eq(n.win.timers[0].cleared, true); eq(n.S._t.state.timer, null);
});

test('8d a refresh while one is in flight is refused (reported as error "busy", not "off")', async () => {
  const n = on(boot({ version: 1, live: [1], items: { 1: { head: 'A' } } }));
  const first = n.S.refresh(true), second = await n.S.refresh(true);
  eq(second, { ok: false, changed: false, error: 'busy' });
  eq(await first, { ok: true, changed: true });
});
