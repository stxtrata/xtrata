// The radio's compact "dock" layout (?dock=1: the arcade's corner panel and pop-out window) is opt-in.
//   1. Without ?dock=1 nothing about the page changes: no data-dock flag, and the receiver/controls/tuning rules are the standard ones.
//   2. With ?dock=1, at panel sizes (440x600, 380x560, 340x520) there is no sideways scroll and the whole front panel (receiver, play/like/next
//      controls and the FM/LIKED/CHAIN stations) sits inside the window height, even with a very long title.
//   3. The dock bridge (hall <-> radio, ?dock=1 only): an Xtrata hall page pairs, hears what is playing and can send play/pause/next/previous; another
//      origin cannot; the standard radio sends nothing; inside the panel a heart tap or R/Esc is handed to the hall instead of acting.
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
  // 3. the bridge
  const HALL_STUB = `<!doctype html><title>hall stub</title><body><script>
    window.msgs=[]; addEventListener('message',function(e){window.msgs.push({origin:e.origin,data:e.data});
      if(e.data&&e.data.xtrataRadio===1&&e.data.type==='ready')e.source.postMessage({xtrataHall:1,type:'hello'},e.origin)});
    window.openRadio=function(q){window.pw=window.open('https://radio.xtrata.xyz/radio'+q,'rp','popup=yes,width=440,height=700');return window.pw};
    window.frameRadio=function(q){var f=document.createElement('iframe');f.id='rf';f.style.cssText='width:440px;height:560px;border:0';f.src='https://radio.xtrata.xyz/radio'+q;document.body.appendChild(f)};
  <\/script>`;
  async function bridgeCtx() {
    const ctx = await browser.newContext({ viewport: { width: 800, height: 700 } });
    await ctx.route(/^https?:\/\//, (r) => {
      const u = new URL(r.request().url());
      if (u.hostname === 'radio.xtrata.xyz') {
        let pth = u.pathname === '/radio' ? '/radio.html' : u.pathname; const f = path.join(root, pth);
        if (!f.startsWith(root) || !existsSync(f) || statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
        return r.fulfill({ status: 200, contentType: types[path.extname(f)] || 'application/octet-stream', body: readFileSync(f) });
      }
      if (u.hostname === 'xtrata.xyz' || u.hostname === 'evil.example') return r.fulfill({ status: 200, contentType: 'text/html', body: HALL_STUB });
      return r.abort('failed');
    });
    return ctx;
  }
  const msgsOf = (pg) => pg.evaluate(() => window.msgs.map((m) => m.origin + ' ' + (m.data && m.data.type)));
  const patch = (pg) => pg.evaluate(async () => { for (let i = 0; i < 100 && !window.XtrataRadio; i++) await new Promise((r) => setTimeout(r, 100));
    window.__calls = []; const a = window.XtrataRadio; for (const k of ['playPause', 'next', 'prev', 'toggleLike']) a[k] = () => window.__calls.push(k); return !!a; });
  for (const [origin, allowed] of [['https://xtrata.xyz', true], ['https://evil.example', false]]) {
    const ctx = await bridgeCtx(); const hall = await ctx.newPage(); await hall.goto(origin + '/');
    const [pop] = await Promise.all([ctx.waitForEvent('page'), hall.evaluate(() => { window.openRadio('?dock=1'); })]);
    await pop.waitForLoadState('domcontentloaded'); ok(await patch(pop), `${origin}: the pop-out radio page is up`);
    await hall.waitForTimeout(1800);
    const m = await msgsOf(hall);
    ok(m.includes('https://radio.xtrata.xyz ready'), `${origin}: the radio announces itself`);
    if (allowed) ok(m.includes('https://radio.xtrata.xyz state'), `${origin}: a paired hall is told what is playing`);
    else ok(!m.includes('https://radio.xtrata.xyz state'), `${origin}: another origin is told nothing`);
    for (const c of ['toggle', 'next', 'prev', 'like', 'power']) await hall.evaluate((cmd) => window.pw.postMessage({ xtrataHall: 1, type: 'cmd', cmd }, 'https://radio.xtrata.xyz'), c);
    await pop.waitForTimeout(800);
    const calls = await pop.evaluate(() => window.__calls || []);
    if (allowed) ok(['playPause', 'next', 'prev'].every((k) => calls.includes(k)) && !calls.includes('toggleLike'), `${origin}: play/pause, next and previous work; like is not a command (${calls.join(',')})`);
    else ok(calls.length === 0, `${origin}: no command is obeyed (${calls.join(',') || 'none'})`);
    await ctx.close();
  }
  { // the standard radio (no ?dock=1) sends nothing
    const ctx = await bridgeCtx(); const hall = await ctx.newPage(); await hall.goto('https://xtrata.xyz/');
    const [pop] = await Promise.all([ctx.waitForEvent('page'), hall.evaluate(() => { window.openRadio(''); })]);
    await pop.waitForLoadState('domcontentloaded'); await hall.waitForTimeout(2500);
    ok((await msgsOf(hall)).length === 0, 'the standard radio (no ?dock=1) sends the hall nothing');
    await ctx.close();
  }
  { // R typed in the pop-out asks the hall to take over again
    const ctx = await bridgeCtx(); const hall = await ctx.newPage(); await hall.goto('https://xtrata.xyz/');
    const [pop] = await Promise.all([ctx.waitForEvent('page'), hall.evaluate(() => { window.openRadio('?dock=1'); })]);
    await pop.waitForLoadState('domcontentloaded'); await patch(pop); await hall.waitForTimeout(1200);
    await pop.keyboard.press('KeyR'); await hall.waitForTimeout(400);
    ok((await hall.evaluate(() => window.msgs.filter((x) => x.data.type === 'hide-request').length)) === 1, 'pop-out: R asks the hall to take over again');
    await pop.keyboard.press('Escape'); await hall.waitForTimeout(300);
    ok((await hall.evaluate(() => window.msgs.filter((x) => x.data.type === 'hide-request').length)) === 1, 'pop-out: Esc does nothing special');
    await ctx.close();
  }
  { // inside the hall's panel: heart / wallet controls and R / Esc are handed to the hall
    const ctx = await bridgeCtx(); const hall = await ctx.newPage(); await hall.goto('https://xtrata.xyz/');
    await hall.evaluate(() => window.frameRadio('?dock=1')); let fr = null; for (let i = 0; i < 100 && !fr; i++) { fr = hall.frames().find((f) => /radio\.xtrata\.xyz/.test(f.url())); if (!fr) await hall.waitForTimeout(100); }
    await fr.waitForLoadState('domcontentloaded'); await patch(fr); await hall.waitForTimeout(1200);
    await fr.click('#heart', { force: true }); await hall.waitForTimeout(400);
    let m = await msgsOf(hall); const need = await hall.evaluate(() => window.msgs.filter((x) => x.data.type === 'need-wallet').length);
    ok(need === 1 && !(await fr.evaluate(() => window.__calls)).includes('toggleLike'), 'panel: a heart tap asks the hall for the pop-out and does not start a like here');
    await fr.click('#ppp-top', { force: true }).catch(() => {}); 
    await fr.click('#radio-wallet-connect', { force: true }); await hall.waitForTimeout(400);
    ok((await hall.evaluate(() => window.msgs.filter((x) => x.data.type === 'need-wallet').length)) >= 2, 'panel: the wallet connect button hands over too');
    await fr.evaluate(() => document.body.focus()); await hall.evaluate(() => document.getElementById('rf').focus());
    await fr.press('body', 'KeyR').catch(async () => { await hall.keyboard.press('KeyR'); }); await hall.waitForTimeout(300);
    const hides = await hall.evaluate(() => window.msgs.filter((x) => x.data.type === 'hide-request').length);
    ok(hides >= 1, 'panel: R typed inside the radio asks the hall to hide the panel');
    await ctx.close();
  }
  console.log('radio dock layout checks passed: ' + n);
} finally { await browser.close(); srv.close(); }
