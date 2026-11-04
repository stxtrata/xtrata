#!/usr/bin/env node
// Offline check of the Bonus Lab's scripted reel stops against the engine that ships (read from this folder's pack.json).
// Each stop set is dealt with the engine's own start(state, rng) using the same scripted generator the Lab uses, over many seeds,
// and the round must trigger exactly what the Lab item says it does. Nothing outside this folder is read.
//   node tools/check-lab-plans.cjs
const fs = require('fs'), path = require('path'), zlib = require('zlib'), vm = require('vm');
const game = zlib.gunzipSync(Buffer.from(JSON.parse(fs.readFileSync(path.join(__dirname, '../pack.json'), 'utf8')).game, 'base64')).toString('utf8');
const s0 = game.indexOf('<script>/* Block Fortune v2 engine.'), engine = game.slice(s0, game.indexOf('</script>', s0) + 9);
const ctx = { module: { exports: null }, crypto: globalThis.crypto }; vm.runInNewContext(engine.slice(8, -9), ctx); const BF = ctx.module.exports;
const S = JSON.parse(/const S = (\{[^}]*\});/.exec(game.replace(/(\w+):/g, '"$1":'))[1].replace(/"(\w+)":/g, '"$1":'));
let ok = true; const check = (n, c, d = '') => { console.log(c ? 'PASS' : 'FAIL', n, d); if (!c) ok = false; };
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rngFor = (plan, seed) => { const r = mulberry(seed); let k = 0; return n => { if (n === 32 && plan.stops && k < 5) return plan.stops[k++]; if (plan.lockAll && n === 25) return 0; return Math.floor(r() * n); }; };
const deal = (stops, seed, lockAll) => { const st = BF.fresh(); st.balance = 1e9; st.bet = 100; BF.start(st, rngFor({ stops, lockAll }, seed)); const r = BF.settle(st); return { st, r }; };
const seeds = Array.from({ length: 200 }, (_, i) => 1000 + i);
const all = (name, stops, pred, lockAll) => { const bad = seeds.filter(sd => { const { st, r } = deal(stops, sd, lockAll); return !pred(st, r); }); check(name, !bad.length, bad.length ? `${bad.length}/200 seeds fail (first ${bad[0]})` : '200 seeds'); };
all('3 PEPECASH (s3) starts free spins and pays 2x', S.s3, (st, r) => r.triggers.free && st.free > 0 && r.scatterPay === 200);
all('4 PEPECASH (s4) starts free spins and pays 5x', S.s4, (st, r) => r.triggers.free && r.scatterPay === 500);
all('5 PEPECASH (s5) starts free spins and pays 10x', S.s5, (st, r) => r.triggers.free && r.scatterPay === 1000);
all('Open a Pack stops open the pick', S.vault, (st) => BF.feature(st) && BF.feature(st).type === 'vault');
all('The Directory stops open hold and respin', S.chain, (st) => BF.feature(st) && BF.feature(st).type === 'chain');
all('Full binder (lockAll) wins the jackpot on collect', S.chain, (st) => { const f = BF.feature(st); if (!f || f.type !== 'chain') return false; while (BF.respin(st)); return BF.collect(st).jackpotWin > 0; }, true);
all('Centre-row jackpot stops win the jackpot', S.jackpot, (st, r) => r.jackpotWin > 0);
all('Plain win stops pay a line win and trigger nothing', S.win, (st, r) => r.total > 0 && !r.triggers.free && !BF.feature(st));
process.exit(ok ? 0 : 1);
