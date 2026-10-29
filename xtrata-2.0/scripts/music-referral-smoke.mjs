/**
 * Music referral: whole flow in a real browser, against the REAL agent bundle in mock mode.
 *
 * No chain, no wallet, no network: `?mock=1` makes the bundle simulate funding and delivery.
 * The partner registry is served by this script, so the throwaway partner below is the only
 * one that exists. Needs `npm run build:agent-one` first (the bundle is gitignored).
 *
 *   node scripts/music-referral-smoke.mjs
 *
 * What it proves in Chromium (the unit tests prove the money maths):
 *  - ?ref= on the music page reaches the job; the page sends only a slug
 *  - the quote is identical with and without a referral
 *  - unknown / inactive slugs and a ref on the general wizard do nothing
 *  - self-referral is recognised; batch jobs work; reload and registry edits do not change a job
 *  - a registry outage creates no job
 * Not covered here (mock mode moves no money): a failing partner transfer and Economy
 * speed-ups. Those are covered by referral-payout.test.ts and music-fees.test.ts.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';

const root = new URL('../', import.meta.url);
const read = (p) => readFile(new URL(p, root));

// Throwaway valid mainnet-format addresses. They belong to nobody.
const PARTNER = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const PARTNER_B = 'SPH248H248H248H248H248H248H248H249PPB6QW';
const PAYER = 'SPSK6CSK6CSK6CSK6CSK6CSK6CSK6CSK6E8654Z3';

let registry = { status: 200, body: { version: 1, partners: [
  { slug: 'test-partner', name: 'Test Partner', payoutAddress: PARTNER, active: true, share: 0.5, selfReferral: true },
  { slug: 'retired', name: 'Retired', payoutAddress: PARTNER_B, active: false },
] } };

const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const send = (code, type, body) => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
  try {
    if (u.pathname === '/music-partners.json') return send(registry.status, 'application/json', JSON.stringify(registry.body));
    if (u.pathname === '/music/' || u.pathname === '/music/index.html') return send(200, 'text/html', await read('music/index.html'));
    if (u.pathname.startsWith('/wizard/')) {
      const ext = u.pathname.slice(u.pathname.lastIndexOf('.'));
      return send(200, types[ext] || 'application/octet-stream', await read('xtrata-agent-one' + u.pathname));
    }
    if (u.pathname.startsWith('/hiro/')) return send(404, 'application/json', '{}');
    return send(404, 'text/plain', 'not found');
  } catch { return send(404, 'text/plain', 'not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// CHROMIUM_PATH lets a machine whose Playwright browser build differs from the repo's pin use what it has.
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const errors = [];
let passed = 0;
const step = (name) => { passed += 1; console.log('ok  ' + name); };
console.log('server up', base);

/** A fresh browser profile (its own localStorage and sessionStorage). */
async function fresh() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());   // no CDN, no internet
  return { ctx, page };
}
async function openMusic(page, query = '?mock=1') {
  await page.goto(`${base}/music/${query}`);
  await page.waitForFunction(() => window.XtrataAgent && typeof window.api === 'function');
}
/** Create a job the way the music page does: through its own api() shim. */
const create = (page, o = {}) => page.evaluate(async ({ o, PAYER }) => {
  const f = (n, v, name) => new File([new Uint8Array(n).fill(v)], name, { type: 'audio/ogg' });
  const base = { fastTrack: true, origin: 'music', receipt: true, feeMode: 'standard', user: o.payer || PAYER };
  const body = o.batch
    ? { ...base, items: [{ file: f(900000, 1, 'a.ogg'), uri: 'xtrata:a', mime: 'audio/ogg' }, { file: f(700000, 2, 'b.ogg'), uri: 'xtrata:b', mime: 'audio/ogg' }] }
    : { ...base, file: f(600000, 3, 'song.ogg'), uri: 'xtrata:song', mime: 'audio/ogg' };
  if (o.origin) body.origin = o.origin;
  try {
    const job = (await window.api('/api/jobs', { method: 'POST', body })).job;
    // Mock mode funds every job "from SP_MOCK_SENDER". Record who the payer really is, as a live job
    // does after detecting the funder, before the watcher's next tick (it runs every 2 s).
    const key = Object.keys(localStorage).find((k) => k.includes(job.jobId));
    const j = JSON.parse(localStorage.getItem(key)); j.funder = o.payer || PAYER; j.expectedFunder = o.payer || PAYER;
    localStorage.setItem(key, JSON.stringify(j));
    return { job };
  } catch (e) { return { error: String(e.message || e) }; }
}, { o, PAYER });
const DONE = ['COMPLETE', 'COMPLETE_WITH_SKIPS', 'FAILED', 'CANCELLED', 'NEEDS_RECOVERY'];
async function finish(page, id) {
  for (let i = 0; i < 60; i += 1) {
    const status = await page.evaluate(async (id) => (await window.XtrataAgent.getJob(id)).job.status, id);
    if (DONE.includes(status)) return status;
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('job did not finish: ' + id);
}
const getJob = (page, id) => page.evaluate(async (id) => (await window.XtrataAgent.getJob(id)).job, id);
const jobKeys = (page) => page.evaluate(() => Object.keys(localStorage).filter((k) => k.includes('job-')));

try {
  // 1. referred single, via ?ref=
  {
    const { ctx, page } = await fresh();
    await openMusic(page, '?mock=1&ref=Test-Partner');
    const { job } = await create(page);
    assert.equal(job.referral.slug, 'test-partner');
    assert.equal(job.referral.address, PARTNER);
    assert.equal(job.referral.shareBps, 5000);
    assert.equal(await finish(page, job.jobId), 'COMPLETE');
    const done = await getJob(page, job.jobId);
    assert.equal(done.receipt.referral.kind, 'paid');
    assert(done.receipt.referralTx);
    assert.match(done.receiptHtml, /Referral · Test Partner/);
    assert.equal(BigInt(done.receipt.referral.amountUstx), BigInt(done.receipt.agentFee) / 2n);
    step('referred single completes and the receipt shows the share');
    await ctx.close();
  }

  // 2. price parity: same file, with and without ref, same quote and same wizard fee
  {
    const a = await fresh(); await openMusic(a.page, '?mock=1');
    const b = await fresh(); await openMusic(b.page, '?mock=1&ref=test-partner');
    const ja = (await create(a.page)).job; const jb = (await create(b.page)).job;
    for (const k of ['requiredUstx', 'protocolFee', 'minerReserve', 'agentFeeExpectedUstx', 'agentFeePct', 'agentFeeAddress']) assert.equal(jb[k], ja[k], k);
    assert.equal('referral' in ja, false);
    step('the quote and the wizard fee are identical with and without a referral');
    await a.ctx.close(); await b.ctx.close();
  }

  // 3. batch
  {
    const { ctx, page } = await fresh(); await openMusic(page, '?mock=1&ref=test-partner');
    const { job } = await create(page, { batch: true });
    assert.equal(job.referral.slug, 'test-partner');
    assert.equal(await finish(page, job.jobId), 'COMPLETE');
    const done = await getJob(page, job.jobId);
    assert.equal(done.receipt.referral.kind, 'paid');
    assert.match(done.receiptHtml, /Referral · Test Partner/);
    step('referred batch completes with one referral line');
    await ctx.close();
  }

  // 4. unknown, inactive, malformed, no ref: ordinary jobs, no error
  for (const q of ['?mock=1&ref=nobody', '?mock=1&ref=retired', '?mock=1&ref=%3Cscript%3E', '?mock=1&ref=' + 'x'.repeat(40), '?mock=1']) {
    const { ctx, page } = await fresh(); await openMusic(page, q);
    const { job, error } = await create(page);
    assert(!error, error); assert.equal('referral' in job, false, q);
    assert.equal(await finish(page, job.jobId), 'COMPLETE');
    assert.doesNotMatch((await getJob(page, job.jobId)).receiptHtml, /Referral/);
    await ctx.close();
  }
  step('unknown, inactive, malformed and missing refs give an ordinary job and receipt');

  // 5. the slug survives moving around the page in the same tab, but not a new tab
  {
    const { ctx, page } = await fresh();
    await openMusic(page, '?mock=1&ref=test-partner');
    await openMusic(page, '?mock=1');                       // same tab, ref no longer in the URL
    assert.equal((await create(page)).job.referral.slug, 'test-partner');
    const other = await ctx.newPage(); other.on('pageerror', (e) => errors.push(e.message));
    await openMusic(other, '?mock=1');                       // a new tab has its own session
    assert.equal('referral' in (await create(other)).job, false);
    step('the ref is remembered for the tab only');
    await ctx.close();
  }

  // 6. self-referral: the payer is the partner
  {
    const { ctx, page } = await fresh(); await openMusic(page, '?mock=1&ref=test-partner');
    const { job } = await create(page, { payer: PARTNER });
    assert.equal(await finish(page, job.jobId), 'COMPLETE');
    const done = await getJob(page, job.jobId);
    assert.equal(done.receipt.referral.kind, 'rebate');
    assert.equal(done.receipt.referralTx, null);
    assert.match(done.receiptHtml, /Referral rebate · Test Partner/);
    step('self-referral shows a rebate and sends nothing to the partner');
    await ctx.close();
  }

  // 7. a referral is ignored outside the music flow
  {
    const { ctx, page } = await fresh();
    await page.goto(`${base}/wizard/index.html?mock=1&ref=test-partner`);
    await page.waitForFunction(() => window.XtrataAgent);
    assert.equal(await page.evaluate(() => sessionStorage.getItem('xtrata-music-ref')), null);
    const j = await page.evaluate(async () => (await window.XtrataAgent.createJob({
      file: new File([new Uint8Array(3000)], 'x.bin'), uri: 'xtrata:x', mime: 'application/octet-stream', fastTrack: true, origin: 'wizard', user: 'SPSK6CSK6CSK6CSK6CSK6CSK6CSK6CSK6E8654Z3', referral: 'test-partner',
    })));
    assert.equal('referral' in j, false);
    step('the general wizard ignores a referral');
    await ctx.close();
  }

  // 8. registry outage: no job is created
  {
    const { ctx, page } = await fresh(); await openMusic(page, '?mock=1&ref=test-partner');
    const before = (await jobKeys(page)).length;
    registry = { ...registry, status: 503 };
    const r = await create(page);
    registry = { ...registry, status: 200 };
    assert.match(r.error || '', /No job was created/);
    assert.equal((await jobKeys(page)).length, before);
    step('a registry outage creates no job and says so');
    await ctx.close();
  }

  // 9. frozen: reload and a registry edit do not change a finished or running job
  {
    const { ctx, page } = await fresh(); await openMusic(page, '?mock=1&ref=test-partner');
    const { job } = await create(page);
    assert.equal(await finish(page, job.jobId), 'COMPLETE');
    const before = await getJob(page, job.jobId);
    registry = { status: 200, body: { version: 1, partners: [{ slug: 'test-partner', name: 'Changed', payoutAddress: PARTNER_B, active: true, share: 0.9 }] } };
    await page.reload(); await page.waitForFunction(() => window.XtrataAgent);
    const after = await getJob(page, job.jobId);
    assert.deepEqual(after.referral, before.referral);
    assert.equal(after.referral.address, PARTNER);
    assert.equal(after.receipt.referral.name, 'Test Partner');
    step('reload and a registry edit leave an existing job unchanged');
    await ctx.close();
  }

  assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
  console.log(`\n${passed} scenarios passed, no page errors.`);
} finally {
  await browser.close();
  server.close();
}
