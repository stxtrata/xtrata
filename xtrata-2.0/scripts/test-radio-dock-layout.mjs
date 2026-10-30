// The radio's compact "dock" layout (?dock=1: the arcade's corner panel and pop-out window) is opt-in.
//   1. Without ?dock=1 nothing about the page changes: no data-dock flag, and the receiver/controls/tuning rules are the standard ones.
//   2. With ?dock=1, at panel sizes (440x600, 380x560, 340x520) there is no sideways scroll and the whole front panel (receiver, play/like/next
//      controls and the FM/LIKED/CHAIN stations) sits inside the window height, even with a very long title.
// Serves public/ itself (no network). Run: node scripts/test-radio-dock-layout.mjs   (CHROME_PATH=<chromium> if Playwright's browser is not installed)
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(fileURLToPath(new URL('../', import.meta.url)), 'public');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const srv = http.createServer((q, r) => {
  let u = q.url.split('?')[0]; if (u === '/radio') u = '/radio.html';
  const f = path.join(root, u);
  if (!f.startsWith(root) || !existsSync(f) || statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(readFileSync(f));
});
await new Promise((r) => srv.listen(0, r));
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; console.log('  ok  ' + m); };
try {
  async function open(url, w, h) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort('failed'));
    const p = await ctx.newPage(); await p.goto(base + url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2000);
    await p.evaluate(() => { document.getElementById('ttl').textContent = 'A VERY LONG SONG TITLE THAT KEEPS GOING ON AND ON AND ON'; document.getElementById('artst').textContent = 'An Artist With A Long Name, And Another One'; });
    return { ctx, p };
  }
  const measure = (p) => p.evaluate(() => {
    const bottom = (id) => { const e = document.getElementById(id); if (!e) return 0; const r = e.getBoundingClientRect(); return e.hidden || !r.height ? 0 : r.bottom; };
    const cs = (id, prop) => getComputedStyle(document.getElementById(id))[prop];
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, dock: document.documentElement.getAttribute('data-dock'),
      front: Math.max(bottom('receiver'), bottom('pp'), bottom('heart'), bottom('presetBtn'), bottom('bands')), artW: document.getElementById('art').getBoundingClientRect().width, ppSize: cs('pp', 'width') };
  });
  // 1. standard page: untouched
  for (const url of ['/radio', '/radio?x=1', '/radio?dock=0']) {
    const { ctx, p } = await open(url, 440, 600); const m = await measure(p);
    ok(m.dock === null, `${url}: no dock flag`);
    ok(m.ppSize === '64px', `${url}: the play button keeps its standard mobile size (${m.ppSize})`);
    await ctx.close();
  }
  { const { ctx, p } = await open('/radio', 1100, 800); const m = await measure(p); ok(m.dock === null && m.ppSize === '72px', `desktop /radio: standard (play ${m.ppSize})`); await ctx.close(); }
  // 2. dock layout
  for (const [w, h] of [[440, 600], [380, 560], [340, 520]]) {
    const { ctx, p } = await open('/radio?dock=1', w, h); const m = await measure(p);
    ok(m.dock === '1', `${w}x${h}: dock flag set`);
    ok(m.sw <= m.cw, `${w}x${h}: no sideways scroll (${m.sw} <= ${m.cw})`);
    ok(m.front <= h, `${w}x${h}: receiver, controls and stations fit the window (bottom ${Math.round(m.front)} <= ${h})`);
    await ctx.close();
  }
  console.log('radio dock layout checks passed: ' + n);
} finally { await browser.close(); srv.close(); }
