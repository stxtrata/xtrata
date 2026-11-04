#!/usr/bin/env node
// Exercises the LIVE path with a mocked mempool.space (the cloud sandbox cannot reach the real one): SNAPSHOT → LIVE,
// a new block raises the pulse and the tip, and two failed reads in a row turn the badge STALE. Needs Playwright.
//   node tools/live-mock-test.cjs http://localhost:8102/mempool-madness/index.html
const { chromium } = require('playwright');
(async () => {
  let tip = 975000, fail = false, hits = 0; const out = [];
  const check = (n, ok, d = '') => { out.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${n} ${d}`); };
  const b = await chromium.launch({ args: ['--disable-accelerated-2d-canvas'] }), ctx = await b.newContext(), p = await ctx.newPage();
  await ctx.route('https://mempool.space/api/**', r => {
    const u = new URL(r.request().url()).pathname.replace('/api', ''); hits++;
    if (fail) return r.fulfill({ status: 503, body: 'down' });
    const J = o => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(o) });
    if (u === '/v1/fees/recommended') return J({ fastestFee: 7, halfHourFee: 5, hourFee: 3, economyFee: 2, minimumFee: 1 });
    if (u === '/v1/fees/mempool-blocks') return J([{ nTx: 3500, blockVSize: 999000, totalFees: 9e6, medianFee: 4.2, feeRange: [1, 2, 4, 9, 40] }, { nTx: 2900, blockVSize: 998000, totalFees: 4e6, medianFee: 2.1, feeRange: [1, 1.5, 2, 3, 6] }]);
    if (u === '/mempool') return J({ count: 41000, vsize: 22e6, total_fee: 5e7, fee_histogram: [[12, 100000], [6, 900000], [3, 2e6], [1, 9e6]] });
    if (u === '/blocks/tip/height') return r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: String(tip) });
    if (u === '/mempool/recent') return J([{ txid: 'a'.repeat(63) + '1', fee: 1500, vsize: 141, value: 1e6 }, { txid: 'b'.repeat(63) + '2', fee: 800, vsize: 200, value: 5e5 }]);
    if (u === '/v1/blocks') return J(Array.from({ length: 15 }, (_, i) => ({ id: String(i).padStart(64, 'c'), height: tip - i, timestamp: 1793000000 - i * 600, tx_count: 3000 + i, extras: { medianFee: 3 + i * .1, pool: { name: 'MockPool' } } })));
    if (/^\/block\/.+\/txs/.test(u)) return J([]);
    if (/^\/tx\/.+\/status/.test(u)) return J({ confirmed: false });
    return r.fulfill({ status: 404, body: '{}' });
  });
  await p.goto(process.argv[2]); await p.waitForFunction(() => window.MMTest, null, { timeout: 180000 });
  const fr = p.frames().find(f => f !== p.mainFrame()), G = (fn, a) => fr.evaluate(fn, a), sleep = ms => new Promise(r => setTimeout(r, ms));
  await p.evaluate(() => { setInterval(() => { try { MMTest.frame.contentWindow.__pxPump(); } catch (e) {} }, 30); });
  for (let i = 0; i < 60 && (await G(() => window.MempoolMadness.data().source)) !== 'live'; i++) await sleep(500);
  let d = await G(() => window.MempoolMadness.data());
  check('the mocked read turns the badge LIVE', d.source === 'live' && d.fails === 0, `source ${d.source}`);
  check('live figures replace the snapshot (tip, fees, mempool)', d.tip.height === tip && d.fees.fastestFee === 7 && d.mempool.count === 41000, `tip ${d.tip.height} fastest ${d.fees.fastestFee} count ${d.mempool.count}`);
  check('real pending transactions come from /mempool/recent', d.pending >= 2, `pending ${d.pending}`);
  const pulse0 = d.pulse; tip++; await G(() => window.MempoolMadness.refresh()); d = await G(() => window.MempoolMadness.data());
  check('a new block raises the pulse and the tip', d.pulse === pulse0 + 1 && d.tip.height === tip, `pulse ${pulse0} → ${d.pulse}, tip ${d.tip.height}`);
  check('mechanics() carries the pulse for the topper', (await G(() => window.PX_CASINO_ENGINE.mechanics().pulse)) === d.pulse);
  await p.screenshot({ path: process.argv[3] || '/tmp/live-mock.png', timeout: 180000 }).catch(() => {});
  // A refresh already in flight (the page's own 30 s timer) makes refresh() return at once, so retry until each read really ran.
  const read = async want => { for (let k = 0; k < 20; k++) { await G(() => window.MempoolMadness.refresh()); const x = await G(() => window.MempoolMadness.data()); if (x.fails >= want) return x; await sleep(400); } return G(() => window.MempoolMadness.data()); };
  fail = true; d = await read(1); const one = d.source, f1 = d.fails;
  d = await read(2);
  check('one failed read keeps LIVE, two in a row turn it STALE (never the snapshot once live)', one === 'live' && f1 === 1 && d.source === 'stale', `${one} (fails ${f1}) → ${d.source} (fails ${d.fails})`);
  fail = false; await G(() => window.MempoolMadness.refresh()); d = await G(() => window.MempoolMadness.data()); check('the next good read recovers to LIVE', d.source === 'live');
  await b.close(); console.log(`${out.filter(Boolean).length}/${out.length} passed (${hits} mocked requests)`); process.exit(out.every(Boolean) ? 0 : 1);
})();
