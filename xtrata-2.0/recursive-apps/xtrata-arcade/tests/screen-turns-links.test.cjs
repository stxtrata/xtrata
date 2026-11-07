// The centre screen client: consecutive turns, future start dates, and the click-through link (src/parts/screen.js in a vm, no browser).
//   T1  turns: an item with turns 3 holds 3 consecutive slots; weights still interleave; slots are a pure function of the clock
//   T2  turns are bounded 1..5 and default to 1
//   T3  an item that has not started yet is not shown; it is shown once its start passes, and not after its end
//   L1  safeLink: https only, plain URL characters, bounded; anything else is dropped
//   L2  the host is painted as text on the panel and on a full-screen slot ("↗ host"); no link, nothing painted
//   L3  openLink opens only a safe https link, in a new tab with noopener; currentLink is empty with no link on screen
// Run: node tests/screen-turns-links.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let checks = 0;
const eq = (a, b, m) => { checks++; assert.deepStrictEqual(a, b, m); };
const ok = (c, m) => { checks++; assert.ok(c, m); };
process.on('exit', () => console.log('screen-turns-links.test.cjs: ' + checks + ' checks'));

function load() {
  const opened = [];
  const win = { console, Math, Date, JSON, Object, Array, Number, String, Uint8Array, Promise, setTimeout, clearTimeout, setInterval() { return 0; }, clearInterval() {}, localStorage: { getItem: () => null, setItem() {} } };
  win.window = win; win.globalThis = win; win.opened = opened;
  win.open = (...a) => { opened.push(a); return {}; };
  vm.createContext(win);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'screen.js'), 'utf8'), win, { filename: 'screen.js' });
  return win;
}
const item = (S, id, o = {}) => S.normalizeItem(id, Object.assign({ kind: 1, head: 'ITEM ' + id, body: 'body', weight: 1, turns: 1, status: 1, hidden: false, 'starts-at': 0, 'ends-at': 1000000 }, o));
const seq = (S, items, n) => { const out = []; for (let k = 0; k < n; k++) out.push(S.slotAt(items, k * 12, 12).item.id); return out; };

test('T1 turns: a 3-turn item holds 3 consecutive slots; weights still interleave', () => {
  const S = load().XAScreen;
  const items = [item(S, 1, { turns: 3 }), item(S, 2), item(S, 3)];
  eq(seq(S, items, 10), [1, 1, 1, 2, 3, 1, 1, 1, 2, 3], 'item 1 plays three in a row, then the others, then round again');
  // the same clock gives the same slot for everyone
  eq(S.slotAt(items, 24.5, 12).item.id, S.slotAt(items, 35.9, 12).item.id, 'one slot is one 12 s window');
  // weight 2 puts an item in the second layer as well: its turns repeat there too
  const w = [item(S, 1, { weight: 2, turns: 2 }), item(S, 2)];
  eq(seq(S, w, 8), [1, 1, 2, 1, 1, 1, 1, 2], 'layer 1: 1,1,2 then layer 2: 1,1 (turns kept in every layer)');
  // a lone item with turns just repeats
  eq(seq(S, [item(S, 7, { turns: 5 })], 6), [7, 7, 7, 7, 7, 7]);
});

test('T1 turns: with a full-screen slot every third slot, a long ad still fills consecutive slots of its own rotation', () => {
  const S = load().XAScreen;
  const pic = { 'image-id': 5, 'image-hash': new Uint8Array(32), 'image-size': 100 };
  const items = [item(S, 1, Object.assign({ kind: 2, turns: 2 }, pic)), item(S, 2), item(S, 3)];
  const slots = []; for (let k = 0; k < 9; k++) { const s = S.slotAt(items, k * 12, 12, 3); slots.push((s.full ? 'F' : 'P') + s.item.id); }
  // panel rotation: 1,1,2,3 ... ; full rotation: only item 1 has a picture
  eq(slots, ['P1', 'P1', 'F1', 'P2', 'P3', 'F1', 'P1', 'P1', 'F1']);
});

test('T2 turns are bounded 1..5 and default to 1', () => {
  const S = load().XAScreen;
  eq(item(S, 1, { turns: undefined }).turns, 1);
  eq(item(S, 1, { turns: 0 }).turns, 1);
  eq(item(S, 1, { turns: 9 }).turns, 5);
  eq(item(S, 1, { turns: 4 }).turns, 4);
});

test('T3 start dates: not shown before starts-at, shown from it, gone at ends-at', () => {
  const S = load().XAScreen;
  const it = item(S, 1, { 'starts-at': 500, 'ends-at': 700 });
  eq(S.activeItems([it], 499).length, 0);
  eq(S.activeItems([it], 500).length, 1);
  eq(S.activeItems([it], 699).length, 1);
  eq(S.activeItems([it], 700).length, 0);
});

test('L1 safeLink: https only, plain URL characters, at most 100', () => {
  const S = load().XAScreen;
  eq(S.safeLink('https://xtrata.xyz/arcade?x=1&y=2#top'), 'https://xtrata.xyz/arcade?x=1&y=2#top');
  eq(S.linkHost('https://Xtrata.xyz/arcade'), 'xtrata.xyz');
  eq(S.linkHost('https://user@evil.example/'), '', 'userinfo tricks are refused');
  for (const bad of ['', 'http://xtrata.xyz', 'javascript:alert(1)', 'data:text/html,x', 'https://', 'https:///x', 'xtrata.xyz', 'https://a b.c', 'https://a.c/"x', 'https://a.c/<x>', 'https://a.c/\\x', "https://a.c/'x", 'HTTPS://xtrata.xyz', 'https://' + 'a'.repeat(93), null, undefined, 5]) {
    eq(S.safeLink(bad), '', String(bad));
  }
  eq(S.safeLink('https://' + 'a'.repeat(92)).length, 100);
  eq(item(S, 1, { link: 'javascript:alert(1)' }).link, '', 'the item drops an unsafe link');
  eq(item(S, 1, { link: 'https://xtrata.xyz' }).link, 'https://xtrata.xyz');
  eq(item(S, 1, {}).link, '');
});

function recorder() {
  const texts = [];
  const x = new Proxy({}, { get(t, k) { if (k === 'fillText') return (s) => texts.push(String(s)); if (k === 'measureText') return (s) => ({ width: String(s).length * 8 }); if (k === 'texts') return texts; return () => {}; }, set() { return true; } });
  return x;
}
const paintAt = (S, items, t) => { const x = recorder(); S.paint(x, 1280, 720, { height: 100, day: 1, blocksPerDay: 144, live: true, items, scorers: [], champions: [], t }); return x.texts; };

test('L2 the host of a link is painted as text on the panel; with no link, nothing', () => {
  const S = load().XAScreen;
  const linked = item(S, 1, { link: 'https://xtrata.xyz/arcade' }), plain = item(S, 2);
  ok(paintAt(S, [linked], 0).includes('↗ xtrata.xyz'), 'panel shows the host');
  ok(!paintAt(S, [plain], 0).some((t) => t.indexOf('↗') >= 0), 'no link, no arrow');
  eq(S.current().id, 2, 'the item on screen is remembered by the last paint');
  eq(S.currentLink(), '', 'and it has no link');
  paintAt(S, [linked], 0);
  eq(S.currentLink(), 'https://xtrata.xyz/arcade');
});

test('L3 openLink: only a safe https link, new tab, noopener; nothing without a link', () => {
  const w = load(), S = w.XAScreen;
  eq(S.openLink(), false, 'nothing on screen yet');
  paintAt(S, [item(S, 2)], 0);
  eq(S.openLink(), false); eq(w.opened.length, 0, 'an item without a link opens nothing');
  paintAt(S, [item(S, 1, { link: 'https://xtrata.xyz/arcade' })], 0);
  eq(S.openLink(), true);
  eq(w.opened, [['https://xtrata.xyz/arcade', '_blank', 'noopener,noreferrer']]);
  // a tampered snapshot item (not made by normalizeItem) is re-checked
  S._t.state.current = { id: 9, link: 'javascript:alert(1)' };
  eq(S.openLink(), false); eq(w.opened.length, 1, 'unsafe link refused at open time');
});
