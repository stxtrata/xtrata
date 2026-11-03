// The Strata Club tables beside the casino room (build/rooms/strata-*): the two rule models (the JS twins of the testnet contracts casino-liars-dice-v1
// and casino-holdem-v1), the table pages that use them, and the room's way into them.
//   A  sha256       the model's own sha256 equals Node's, on lengths either side of every block boundary
//   B  dice         a full game settles, chips are conserved, the rake is 2% rounded down
//   C  hold'em      the evaluator ranks known hands in order, and 200 random hands all settle with every chip accounted for
//   D  pages        each table page loads only files that exist beside it, and the preview copy is byte-identical to the source
//   E  the room     the casino room has the Strata Club button, the intro buttons, the overlay and the two frame targets
// Run: node tests/strata-club.test.cjs   (no browser, no network)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '..'), src = path.join(root, 'build', 'rooms'), pub = path.resolve(root, '..', '..', 'public', 'arcade-world-preview');
let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.log('  ✗ ' + m); } };

// load a UMD model without a package-type guess: run it with its own module object and a root to hang the global on
function load(file, root0) {
  const code = fs.readFileSync(path.join(src, file), 'utf8'), mod = { exports: {} }, g = Object.assign({}, root0);
  new Function('module', 'require', 'globalThis', code.replace(/\}\)\(typeof globalThis !== 'undefined' \? globalThis : this\);\s*$/, '})(globalThis);'))(mod, (f) => { throw new Error('unexpected require ' + f); }, g);
  return mod.exports;
}
const DM = load('strata-dice-model.js', {});
const H = load('strata-holdem-model.js', { DiceModel: DM });

// A
{
  let mism = 0;
  for (const len of [0, 1, 31, 32, 54, 55, 56, 57, 63, 64, 65, 119, 120, 128, 200]) {
    const b = crypto.randomBytes(len);
    if (Buffer.from(DM.sha256(b)).toString('hex') !== crypto.createHash('sha256').update(b).digest('hex')) mism++;
  }
  ok(mism === 0, 'A: sha256 differs from node on ' + mism + ' lengths');
}

// B
{
  const hs = {}, hash = (h) => hs[h] || (hs[h] = crypto.randomBytes(32));
  const t = DM.createTable({ rakeBps: 200, rakeTo: 'R', balances: { A: 1000, B: 1000 } });
  const sA = crypto.randomBytes(32), sB = crypto.randomBytes(32);
  let c = { time: 1000, height: 10, hashAt: (h) => (h <= 12 ? hash(h) : null) };
  const id = t.create(c, 'A', { stake: 100, turn: 60, open: 600, commit: DM.sha256(sA) }).ok;
  ok(t.join(c, 'B', id, DM.sha256(sA)).err === 208, 'B: a copied commitment must be refused');
  ok(!t.join(c, 'B', id, DM.sha256(sB)).err, 'B: join');
  c = { ...c, height: 12, time: 1010 };
  ok(t.bid(c, 'A', id, 3, 2).ok && t.challenge(c, 'B', id).ok, 'B: bid then challenge');
  ok(t.reveal(c, 'A', id, sB).err === 208, 'B: a wrong seed must be refused');
  ok(t.reveal(c, 'A', id, sA).ok && t.reveal(c, 'B', id, sB).ok, 'B: both reveal');
  const g = t.games.get(id), total = t.bal.A + t.bal.B + t.bal.R + t.bal.ESCROW;
  ok(g.state === DM.S.DONE && total === 2000 && t.bal.R === 4, 'B: settled, conserved, rake 4 (got ' + t.bal.R + ')');
}

// C
{
  const C = (r, s) => '23456789TJQKA'.indexOf(r) + 13 * 'cdhs'.indexOf(s), sc = (a) => H.score7(a.map((x) => C(x[0], x[1])));
  ok(sc(['As', 'Ks', 'Qs', 'Js', 'Ts', '2c', '3d']) > sc(['9s', 'Ks', 'Qs', 'Js', 'Ts', '2c', '3d']), 'C: royal beats king-high straight flush');
  ok(H.category(sc(['As', '2d', '3h', '4c', '5s', '9c', 'Kd'])) === 4, 'C: the wheel is a straight');
  ok(sc(['Ah', 'Ad', 'Ac', 'Kh', 'Kd', '2c', '3d']) > sc(['Ah', '9h', '7h', '5h', '3h', '2c', '3d']), 'C: full house beats flush');
  ok(sc(['As', 'Ad', 'Kc', 'Qh', 'Jd', '9c', '2d']) > sc(['Ks', 'Kd', 'Ac', 'Qh', 'Jd', '9c', '2d']), 'C: pair of aces beats pair of kings');
  let settled = 0, wrong = 0;
  for (let k = 0; k < 200; k++) {
    const hs = {}, hash = (h) => hs[h] || (hs[h] = crypto.randomBytes(32));
    let height = 100; const time = 5000, ctx = () => ({ time, height, hashAt: (h) => (h <= height ? hash(h) : null) });
    const T = H.createTable({ rakeBps: 200, rakeTo: 'R', balances: { A: 10000, B: 10000 } });
    const sA = crypto.randomBytes(32), sB = crypto.randomBytes(32);
    const id = T.create(ctx(), 'A', { buyin: 400, bb: 20, turn: 60, open: 600, commit: DM.sha256(sA) }).ok;
    T.join(ctx(), 'B', id, DM.sha256(sB)); height += 2;
    if (T.startHand(ctx(), id).err) { wrong++; continue; }
    for (let guard = 0; guard < 200; guard++) {
      const g = T.games.get(id);
      if (g.state === H.S.PLAYING) {
        height += 2; const who = g.aToAct ? 'A' : 'B', o = H.options(g, who), x = Math.random();
        const r = x < 0.1 ? T.act(ctx(), who, id, 0, 0) : x < 0.35 && o.canRaise ? T.act(ctx(), who, id, 2, o.minRaiseTo + Math.floor(Math.random() * (o.maxRaiseTo - o.minRaiseTo + 1))) : T.act(ctx(), who, id, 1, 0);
        if (r.err && r.err !== 204 && r.err !== 213) { wrong++; break; }
      } else if (g.state === H.S.RUNOUT) { height += 2; T.advance(ctx(), id); }
      else if (g.state === H.S.SHOWDOWN) { T.reveal(ctx(), 'A', id, sA); T.reveal(ctx(), 'B', id, sB); }
      else break;
    }
    if (T.games.get(id).state === H.S.DONE) { settled++; if (T.bal.A + T.bal.B + T.bal.R + T.bal.ESCROW !== 20000) wrong++; } else wrong++;
  }
  ok(settled === 200 && wrong === 0, "C: random hold'em hands: " + settled + ' settled, ' + wrong + ' wrong');
}

// D
{
  const files = ['strata-club.css', 'strata-dice-model.js', 'strata-holdem-model.js', 'strata-holdem.html', 'strata-liars-dice.html', 'casino-room.html'];
  for (const f of files) {
    ok(fs.existsSync(path.join(src, f)), 'D: missing source ' + f);
    let same = false; try { same = fs.readFileSync(path.join(src, f)).equals(fs.readFileSync(path.join(pub, f))); } catch (e) { }
    ok(same, 'D: ' + f + ' in public/arcade-world-preview is not the source (run node build/preview.mjs)');
  }
  for (const page of ['strata-holdem.html', 'strata-liars-dice.html']) {
    const html = fs.readFileSync(path.join(src, page), 'utf8');
    const refs = [...html.matchAll(/<(?:script|link)[^>]*(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    ok(refs.length > 0 && refs.every((r) => !/^(https?:)?\/\//.test(r) && fs.existsSync(path.join(src, r))), 'D: ' + page + ' must load only local files that exist: ' + refs.join(', '));
  }
}

// E
{
  const room = fs.readFileSync(path.join(src, 'casino-room.html'), 'utf8');
  ok(/id="scbtn"/.test(room) && /id="sc-h"/.test(room) && /id="sc-d"/.test(room) && /id="scov"/.test(room) && /id="scframe"/.test(room), 'E: room has the button, the intro buttons and the overlay');
  ok(/'sc-th': 'strata-holdem\.html'/.test(room) && /'sc-td': 'strata-liars-dice\.html'/.test(room), 'E: room frames the two table pages');
  ok(/\.btns button:not\(\[id\^="sc-"\]\)/.test(room), 'E: the five station buttons must not capture the Strata Club buttons');
}

console.log(bad ? 'strata-club: ' + bad + ' FAILED of ' + n : 'strata-club: ' + n + ' checks passed');
process.exit(bad ? 1 : 0);
