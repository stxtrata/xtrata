#!/usr/bin/env node
// Seeded Monte Carlo check of the engine Robot Factory ships with. The engine is read out of this folder's own
// pack.json (so it tests exactly what would ship) and its SHA-256 is compared with the published Block Fortune v2 hash.
// Only local files are read; nothing in the casino is opened.
//   node tools/rtp-sim.cjs [spins=5000000] [seed=20261101]
const fs = require('fs'), path = require('path'), zlib = require('zlib'), crypto = require('crypto'), vm = require('vm');
const PACK = path.join(__dirname, '../pack.json'), ENGINE_SHA256 = '9970b67cf9d8b43c6ca75b9cb569e0a601fe450ba53faa0ecd075ce414c54092';
const game = zlib.gunzipSync(Buffer.from(JSON.parse(fs.readFileSync(PACK, 'utf8')).game, 'base64')).toString('utf8');
const s0 = game.indexOf('<script>/* Xtrata machines engine'), engine = game.slice(s0, game.indexOf('</script>', s0) + 9);
const r0 = game.indexOf('<script>/* Deep Strata rules'), rulesTxt = game.slice(r0, game.indexOf('</script>', r0) + 9);
const sha = crypto.createHash('sha256').update(engine).digest('hex');
console.log('engine sha256', sha, sha === ENGINE_SHA256 ? 'IDENTICAL to the Deep Strata engine' : 'MISMATCH');
if (sha !== ENGINE_SHA256) process.exit(1);
const ctx = { module: { exports: null }, crypto: globalThis.crypto }; vm.runInNewContext(engine.slice(8, -9), ctx); const RAWBF = ctx.module.exports;
const rctx = { module: { exports: null } }; vm.runInNewContext(rulesTxt.slice(8, -9), rctx); const RULES = rctx.module.exports;
const BF = RAWBF.create(RULES); console.log('rules sha256', crypto.createHash('sha256').update(rulesTxt).digest('hex'), JSON.stringify(RULES.cascade));
let x = BigInt(process.argv[3] || 20261101) & 0xffffffffffffffffn;
function next() { x = (x + 0x9e3779b97f4a7c15n) & 0xffffffffffffffffn; let z = x; z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & 0xffffffffffffffffn; z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & 0xffffffffffffffffn; return Number((z ^ (z >> 31n)) >> 11n) / 2 ** 53; }
const rng = n => Math.floor(next() * n), N = Number(process.argv[2] || 5e6), bet = 100;
const st = BF.fresh(); st.balance = 1e15; st.bet = bet; let paid = 0, free = 0, vault = 0, chain = 0, jack = 0;
while (paid < N) {
  const isFree = st.free > 0; if (!isFree) paid++;
  BF.start(st, rng); const r = BF.settle(st); if (r.jackpotWin) jack++; if (r.triggers.free && !isFree) free++;
  while (BF.feature(st)) { const f = BF.feature(st); if (f.type === 'vault') { if (!f.free) vault++; [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => next() - .5).slice(0, 3).forEach(i => BF.pick(st, i)); } else { if (!f.free) chain++; while (BF.respin(st)); } if (BF.collect(st).jackpotWin) jack++; }
  if (!st.free && st.freeActive) BF.endFree(st); st.history.length = 0;
}
console.log(JSON.stringify({ spins: N, rtp: (100 * st.paidOut / st.wagered).toFixed(2) + '%', freeEvery: +(N / free).toFixed(1), pickEvery: +(N / vault).toFixed(1), holdEvery: +(N / chain).toFixed(1), jackpots: jack }));
