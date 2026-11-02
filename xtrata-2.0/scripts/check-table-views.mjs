// Table view check: every table, every view, desktop and phone, with a hand dealt. Screenshots + where the controls panel sits.
// Usage: node scripts/check-table-views.mjs <out-dir> [discover]   (CHROME_PATH=<chrome> to pick the browser)
import { chromium } from 'playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const out = process.argv[2] || 'table-views';
const discover = process.argv[3] === 'discover';
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const pub = new URL('../public/', import.meta.url);
const SITE = 'https://xtrata.test';
const IDS = ['blackjack', 'roulette', 'sicbo', 'baccarat', 'videopoker', 'pvpholdem', 'liars'];   // Sic Bo took Hold'em's place (CASINO-MAIN-ROOM-PLAN)
const SIZES = (process.env.SIZES || 'desktop,phone').split(',');
const SIZE = { desktop: { viewport: { width: 1440, height: 900 } }, laptop: { viewport: { width: 1280, height: 720 } }, phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, tablet: { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, ipad: { viewport: { width: 1180, height: 820 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } };
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.glb': 'model/gltf-binary' };
await mkdir(out, { recursive: true });
const PLAN = {
  blackjack: [{ chip: 100 }, { id: 'deal', wait: 6000 }],
  roulette: [{ chip: 100 }, { id: 'bet', data: { k: 'red' }, force: true }, { id: 'spin', wait: 12000 }],
  sicbo: [{ id: 'spot', data: { s: 'big' } }, { chip: 100 }, { id: 'deal', wait: 8000 }],
  baccarat: [{ id: 'spot', data: { s: 'player' } }, { chip: 100 }, { id: 'deal', wait: 10000 }],
  videopoker: [{ id: 'deal', wait: 5000 }],
  pvpholdem: [{ id: 'buy100' }, { re: /deal|start|new|next/i, wait: 6000 }, { re: /^(check|call)$/i, wait: 5000 }],
  liars: [{ id: 'stake25' }, { re: /roll|start|deal|new/i, wait: 6000 }]
};
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const report = [];
for (const size of SIZES) {
  const context = await browser.newContext(SIZE[size]);
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== SITE) return route.abort();
    if (url.pathname.startsWith('/casino/room')) return route.fulfill({ status: 503, body: '{}' });
    if (url.pathname === '/casino-status.json') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"state":"open"}' });
    const path = url.pathname.endsWith('/') ? url.pathname.slice(1) + 'index.html' : url.pathname.slice(1);
    try { return route.fulfill({ status: 200, body: await readFile(new URL(path, pub)), headers: { 'content-type': types[(/\.[a-z]+$/.exec(path) || [''])[0]] || 'application/octet-stream' } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await context.addInitScript((ids) => {
    if (window.top !== window) return;
    try {
      if (!localStorage.getItem('xtrata.parallax.layr.account.v1')) localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({ bank: 1000000 }));
      for (const id of ids) localStorage.setItem('parallax.rules.v1.' + id, 'true');
      localStorage.setItem('xtrata.parallax.passkey', '0');
    } catch (e) { }
  }, IDS);
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const T = (fn, arg) => page.evaluate(fn, arg);
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    if (only && !only.includes(id)) continue;
    // a fresh page per table: a table mid-hand cannot be left, so the next one could not be sat at
    await page.goto(SITE + '/casino/', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => window.__casinoView?.table && window.XA_HOSTS?.ready, null, { timeout: 180000 });
    if (process.env.GL) console.log(size, 'gl', JSON.stringify(await T(() => window.__casinoView.table.gl)));
    // play at a tiny size: the software renderer draws about one frame a second at full size, and animations step per frame
    const full = SIZE[size].viewport;
    await page.setViewportSize({ width: 240, height: 160 });
    await T((i) => window.__casinoView.table.sit(i), i);
    await page.waitForTimeout(1500);
    if (discover) {
      const before = await T(() => window.__casinoView.table.view());
      console.log(size, id, 'BEFORE', JSON.stringify(before));
      continue;
    }
    // play: chips, then the table's own deal/spin/roll steps, a few times, to get cards (or dice, or a spin) on the felt
    for (const step of PLAN[id]) {
      const v = await T(() => window.__casinoView.table.view());
      if (!v) break;
      if (step.chip) { await T((c) => window.__casinoView.table.chip(c), step.chip); await page.waitForTimeout(800); continue; }
      const free = v.actions.filter((a) => !a.dis);
      // force: an action the table takes from its own board (roulette bets), not from the action buttons
      const hit = step.force ? { id: step.id } : free.find((a) => (step.re ? step.re.test(a.id) : a.id === step.id));
      if (!hit) { console.log('  no', step.id || String(step.re), 'in', free.map((a) => a.id).join(',')); continue; }
      await T(([a, d]) => window.__casinoView.table.act(a, d), [hit.id, step.data || hit.data]);
      await page.waitForTimeout(step.wait || 4000);
    }
    console.log(size, id, 'now', JSON.stringify((await T(() => window.__casinoView.table.view()))?.actions?.map((a) => a.id + (a.dis ? '-' : ''))));
    await page.setViewportSize(full); await page.waitForTimeout(1500);
    const views = id === 'videopoker' ? ['behind', 'first', 'screen'] : ['behind', 'first', 'seat', 'overhead'];
    for (const view of views) {
      await T((view) => {
        const cv = window.__casinoView;
        const want = view === 'behind' ? 'behind' : 'first';
        if ((view === 'behind' || view === 'first') && cv.mode !== want) cv.toggle();
        cv.table.setView(view === 'behind' || view === 'first' ? 'table' : view);
        cv.table.snap();
      }, view);
      await page.waitForTimeout(2500);
      await T(() => window.__casinoView.table.snap());
      await page.waitForTimeout(2500);
      const panel = await T(() => window.__casinoView.table.panel);
      const file = `${out}/${size}-${id}-${view}.png`;
      try { await page.screenshot({ path: file, timeout: 120000, animations: 'disabled' }); } catch (e) { console.log('  retry', file); await page.screenshot({ path: file, timeout: 300000, animations: 'disabled' }); }
      report.push({ size, id, view, panel });
      console.log('shot', file, JSON.stringify(panel));
    }
    await T(() => { const cv = window.__casinoView; if (cv.mode !== 'behind') cv.toggle(); });
  }
  if (errors.length) console.log('page errors', size, errors);
  await context.close();
}
await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
await browser.close();


