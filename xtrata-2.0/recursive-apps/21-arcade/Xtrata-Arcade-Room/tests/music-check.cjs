// Per-game soundtrack check: starts each named cabinet from index.html, mashes
// that game's inputs for a few seconds and reports what the music engine did.
// Run: NODE_PATH=<dir with playwright> CHROME_PATH=... node tests/music-check.cjs xa_block_drop xa_pong_streak ...
//      (no ids = every cabinet)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SECS = Number(process.env.MUSIC_SECS || 6);

function server() {
  return new Promise((res) => {
    const s = http.createServer((req, rsp) => {
      const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      const type = f.endsWith('.html') ? 'text/html' : f.endsWith('.css') ? 'text/css' : 'text/javascript';
      rsp.writeHead(200, { 'Content-Type': type });
      rsp.end(fs.readFileSync(f));
    }).listen(0, () => res(s));
  });
}

(async () => {
  const srv = await server();
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  await ctx.route('https://api.mainnet.hiro.so/**', (r) => r.fulfill({ status: 503, body: 'offline in music check' }));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/503|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(base + '/index.html');
  await page.waitForSelector('.xa-cab', { timeout: 20000 });
  let ids = process.argv.slice(2);
  if (!ids.length) ids = await page.$$eval('[data-play]', (els) => els.map((e) => e.getAttribute('data-play')));
  await page.evaluate(() => {
    const m = window.XA.music;
    window.__mc = { notes: 0, stingers: 0, tempos: [], intens: [], tracks: [], scales: [], keys: 0, filters: 0 };
    const wrap = (name, fn) => { const o = m[name]; m[name] = function () { try { fn.apply(null, arguments); } catch (e) {} return o.apply(m, arguments); }; };
    wrap('note', () => window.__mc.notes++);
    wrap('stinger', () => window.__mc.stingers++);
    wrap('setTempo', (b) => window.__mc.tempos.push(Math.round(b)));
    wrap('setIntensity', (v) => window.__mc.intens.push(Math.round(v * 100) / 100));
    wrap('setTrack', (n, on) => window.__mc.tracks.push(n + ':' + on));
    wrap('setScale', (s) => window.__mc.scales.push(s));
    wrap('transpose', () => window.__mc.keys++);
    wrap('setKey', () => window.__mc.keys++);
    wrap('setFilter', () => window.__mc.filters++);
    window.__steps = 0;
    m.onStep(() => { window.__steps++; });
  });
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyZ', 'KeyX', 'KeyC', 'Digit1', 'Digit2', 'Digit3', 'Digit4'];
  let failed = 0;
  for (const id of ids) {
    errors.length = 0;
    await page.evaluate(() => { if (window.XARoom._session()) window.XARoom.back(); });
    await page.waitForTimeout(300);
    await page.evaluate(() => { const c = window.__mc; c.notes = 0; c.stingers = 0; c.tempos = []; c.intens = []; c.tracks = []; c.scales = []; c.keys = 0; c.filters = 0; });
    await page.evaluate((gid) => window.XARoom.start(gid), id);
    await page.waitForFunction(() => window.XARoom._session() && window.XARoom._session().state === 'play', null, { timeout: 8000 });
    // re-attach the step counter: the room clears listeners when a game starts
    await page.evaluate(() => { window.__steps = 0; window.XA.music.onStep(() => { window.__steps++; }); });
    await page.focus('.xa-stage');
    const box = await (await page.$('.xa-stage canvas')).boundingBox();
    const t0 = Date.now();
    let i = 0, sawPlaying = false, maxTempo = 0;
    while (Date.now() - t0 < SECS * 1000) {
      const k = keys[(i * 7 + (i >> 2)) % keys.length];
      if (i % 5 === 4) {
        await page.mouse.click(box.x + box.width * (0.2 + ((i * 37) % 60) / 100), box.y + box.height * (0.3 + ((i * 53) % 60) / 100));
      } else if (i % 3 === 0) {
        await page.keyboard.down(k); await page.waitForTimeout(120); await page.keyboard.up(k);
      } else await page.keyboard.press(k);
      await page.waitForTimeout(90);
      const st = await page.evaluate(() => ({ p: window.XA.music.isPlaying(), t: window.XA.music.tempo(), s: window.XARoom._session() && window.XARoom._session().state }));
      if (st.p) sawPlaying = true;
      if (st.t > maxTempo) maxTempo = st.t;
      if (st.s !== 'play' && st.s !== 'pause' && st.s !== 'countdown') break;
      i++;
    }
    const r = await page.evaluate(() => ({ steps: window.__steps, mc: window.__mc, state: window.XARoom._session() && window.XARoom._session().state, score: window.XARoom._session() && window.XARoom._session().score }));
    const ok = sawPlaying && r.steps > 8 && !errors.length;
    if (!ok) failed++;
    const uniq = (a) => Array.from(new Set(a)).slice(0, 8).join(' ');
    console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(18) + ' steps=' + r.steps + ' bpm<=' + Math.round(maxTempo) +
      ' notes=' + r.mc.notes + ' stingers=' + r.mc.stingers + ' tempo[' + uniq(r.mc.tempos) + '] int[' + uniq(r.mc.intens) + ']' +
      (r.mc.tracks.length ? ' tracks[' + uniq(r.mc.tracks) + ']' : '') + (r.mc.scales.length ? ' scale[' + uniq(r.mc.scales) + ']' : '') +
      (r.mc.keys ? ' keyChanges=' + r.mc.keys : '') + (r.mc.filters ? ' filters=' + r.mc.filters : '') +
      ' end=' + r.state + ' score=' + r.score + (errors.length ? '\n     errors: ' + errors.slice(0, 3).join(' | ') : ''));
    if (process.env.MUSIC_SHOTS) await page.screenshot({ path: path.join(process.env.MUSIC_SHOTS, id + '.png') });
  }
  await browser.close();
  srv.close();
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
