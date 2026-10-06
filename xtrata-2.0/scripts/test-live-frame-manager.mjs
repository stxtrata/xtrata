#!/usr/bin/env node
// Browser test for the grid's live HTML-frame manager (src/home/live-frame-manager.js):
// heavy tiles wait for a tap, one heavy tile at a time, the selected inscription gets
// priority, tiles start staggered, and the fullscreen viewer pauses the grid.
//
//   node scripts/test-live-frame-manager.mjs        (CHROME_PATH=... to pick a Chromium)
import { build } from 'esbuild';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const bundle = await build({
  entryPoints: [resolve(root, 'src/home/live-frame-manager.js')],
  bundle: true, format: 'iife', globalName: 'LFM', write: false, platform: 'browser'
});

let passed = 0;
const check = (cond, name) => { assert(cond, name); passed++; console.log('  ✓ ' + name); };

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.setContent(`<!doctype html><style>#g{display:grid;grid-template-columns:repeat(6,160px);gap:8px}.t{position:relative;width:160px;height:120px;background:#222}
.t iframe{width:100%;height:100%;border:0}.token-thumb-gate{position:absolute;inset:0}</style><div id="g"></div><iframe id="preview"></iframe>
<script>${bundle.outputFiles[0].text}</script>`);

await page.evaluate(() => {
  const light = (n) => `<p>tile ${n}</p>`;
  const heavy = (n) => `<p>heavy ${n}</p><script>var fn = 'get-chunk';</script>`;
  window.M = LFM.createLiveHtmlFrameManager({ injectHtml: (h) => h, maxLiveFrames: 12, mimeLabel: () => 'HTML' });
  window.tiles = {};
  window.add = (key, html) => {
    const el = document.createElement('div');
    el.className = 't'; el.dataset.key = key;
    document.getElementById('g').append(el);
    window.tiles[key] = el;
    window.M.register(el, { html, mimeType: 'text/html' }, { key });
  };
  window.state = () => Object.fromEntries(Object.entries(window.tiles).map(([k, el]) => {
    const f = el.querySelector('iframe'), p = el.querySelector('.token-thumb-gate');
    return [k, { live: !!f.srcdoc, poster: !p.hidden, hint: p.querySelector('.token-thumb-gate__hint').textContent }];
  }));
  window.startTimes = {};
  new MutationObserver((ms) => { for (const m of ms) if (m.attributeName === 'srcdoc' && m.target.srcdoc) {
    const k = m.target.closest('.t').dataset.key; window.startTimes[k] = performance.now(); } })
    .observe(document.getElementById('g'), { attributes: true, subtree: true, attributeFilter: ['srcdoc'] });
  for (let i = 0; i < 6; i++) window.add('L' + i, light(i));
  window.add('H1', heavy(1));
  window.add('H2', heavy(2));
});
const state = () => page.evaluate(() => window.state());

await page.waitForTimeout(2500);
let s = await state();
check(['L0', 'L1', 'L2', 'L3', 'L4', 'L5'].every((k) => s[k].live), 'light tiles on screen start by themselves');
check(!s.H1.live && !s.H2.live && /Tap to run/.test(s.H1.hint), 'heavy tiles wait on a poster (' + s.H1.hint + ')');
const times = await page.evaluate(() => Object.values(window.startTimes).sort((a, b) => a - b));
const gaps = times.slice(1).map((t, i) => t - times[i]);
check(gaps.every((g) => g >= 200), 'tiles start one at a time (gaps ' + gaps.map((g) => Math.round(g)).join(', ') + ' ms)');

await page.click('.t[data-key="H1"] .token-thumb-gate');
s = await state();
check(s.H1.live, 'a tap runs a heavy tile');
await page.click('.t[data-key="H2"] .token-thumb-gate');
s = await state();
check(s.H2.live && !s.H1.live, 'one heavy tile at a time: running the second stops the first');

// Select L0 with an HTML preview: its tile stops, the heavy tile yields, and new tiles wait for the preview.
await page.evaluate(() => { window.M.focusPreview('L0', document.getElementById('preview')); window.add('L6', '<p>late</p>'); });
await page.waitForTimeout(1500);
s = await state();
check(!s.L0.live && /Running in the preview/.test(s.L0.hint), 'the selected inscription\'s tile stops: it runs in the preview');
check(!s.H2.live, 'a running heavy tile yields to an HTML preview');
check(!s.L6.live, 'no new grid tile starts while the preview is loading');
check(s.L1.live && s.L5.live, 'tiles already running keep running');
await page.evaluate(() => { document.getElementById('preview').srcdoc = '<p>preview</p>'; });
await page.waitForTimeout(2500);
check(!(await state()).L6.live, 'still quiet for a few seconds after the preview has loaded');
await page.waitForTimeout(2500);
check((await state()).L6.live, 'then waiting tiles start');

// Fullscreen: everything behind it pauses, then comes back.
await page.evaluate(() => window.M.setSuspended(true));
s = await state();
check(Object.values(s).every((t) => !t.live), 'fullscreen open: every grid tile is paused');
await page.evaluate(() => window.M.setSuspended(false));
await page.waitForTimeout(6500);
s = await state();
check(['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].every((k) => s[k].live) && !s.L0.live && !s.H1.live, 'fullscreen closed: light tiles come back, the selected tile and heavy tiles stay off');

// Selecting something that is not HTML releases the old selection's tile at once.
await page.evaluate(() => window.M.focusPreview('image-token', null));
await page.waitForTimeout(800);
check((await state()).L0.live, 'selecting a non-HTML inscription lets the previous tile run again');

// Scrolled out of view: stopped; back in view: started again.
await page.evaluate(() => { document.getElementById('g').style.marginTop = '3000px'; });
await page.waitForTimeout(600);
check(Object.values(await state()).every((t) => !t.live), 'off-screen tiles stop');
await page.evaluate(() => { document.getElementById('g').style.marginTop = '0'; });
await page.waitForTimeout(2500);
check((await state()).L3.live, 'back on screen, they start again');

await browser.close();
console.log(`\nlive frame manager tests passed: ${passed}`);
