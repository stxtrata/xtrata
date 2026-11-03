// Browser check of the radio page (public/radio.html) itself, with a stand-in radio engine:
// layout at desktop and phone width, tuning strip, stations, likes filter / reorder / collapse.
// No audio, chain or wallet: the real engine (xtrata-radio.js) and pay-per-play are not loaded.
// Usage: node scripts/test-radio-page-browser.mjs [screenshot-dir]
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const shots = process.argv[2];
const pub = new URL('../public/', import.meta.url);
const SITE = 'https://radio.xtrata.test';
const WALLET_ADDR = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const types = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const tracks = Array.from({ length: 40 }, (_, i) => ({ id: 2900 + i * 3, title: ['Night Drive', 'SuperUser', 'Liquidez', 'Smalltalk', 'Entertainment'][i % 5] + ' ' + (i + 1), artist: ['Audionals', 'melophonic', '3ai3'][i % 3] }));
const cover = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#b0306a"/><circle cx="32" cy="32" r="18" fill="#ffb547"/></svg>').toString('base64');

// A short WAV whose loudness rises left to right, so the drawn waveform can be checked.
const wav = (() => {
  const rate = 8000, n = rate * 2, data = Buffer.alloc(44 + n * 2);
  data.write('RIFF', 0); data.writeUInt32LE(36 + n * 2, 4); data.write('WAVEfmt ', 8); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) data.writeInt16LE(Math.round(Math.sin(i / 3) * 30000 * (0.05 + 0.95 * i / n)), 44 + i * 2);
  return 'data:audio/wav;base64,' + data.toString('base64');
})();

// The stand-in engine: same API surface the page uses, recording calls.
const fakeEngine = ([tracks, cover, wav]) => {
  const calls = [];
  const likes = [5, 9, 14].map((i) => ({ tokenId: String(tracks[i].id), title: tracks[i].title, artist: tracks[i].artist }));
  let band = 'fm', on = true, listeners = [];
  const snap = () => ({
    on, playing: true, band, preset: 'all', likesStatus: 'ready', likes,
    nowPlaying: { tokenId: tracks[9].id, title: tracks[9].title, artist: tracks[9].artist, album: 'Night Shift', cover, href: '/inscription/' + tracks[9].id },
    relatives: [{ id: tracks[3].id, kind: 'audio', playable: true }, { id: 77, kind: 'other', playable: false }],
    heart: { liked: true, pending: false, locked: false }
  });
  window.__calls = calls;
  window.XtrataRadio = {
    subscribe: (cb) => { listeners.push(cb); cb(snap()); return () => {}; },
    isOn: () => on, switchOn: () => calls.push(['switchOn']), switchOff: () => calls.push(['switchOff']),
    playPause: () => calls.push(['playPause']), next: () => calls.push(['next']), prev: () => calls.push(['prev']),
    toggleLike: () => calls.push(['toggleLike']), unlike: (id) => calls.push(['unlike', id]),
    playToken: (id) => calls.push(['playToken', String(id)]),
    setBand: (b) => { band = b; calls.push(['setBand', b]); listeners.forEach((cb) => cb(snap())); },
    cyclePreset: () => calls.push(['cyclePreset']), refreshLikes: () => calls.push(['refreshLikes']),
    setLikedOrder: (ids) => { window.__order = ids; },
    spectrumSize: () => 128,
    getPosition: () => ({ current: window.__pos ?? 50, duration: 200 }),
    seek: (t) => { window.__pos = t; calls.push(['seek', Math.round(t)]); return true; },
    currentSource: () => wav,
    getSpectrum: (out) => { for (let i = 0; i < out.length; i++) out[i] = Math.max(0, 230 - i * 2); return true; }
  };
};

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const errors = [];
for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 860 }]) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(([key, addr]) => { localStorage.setItem(key, JSON.stringify({ isConnected: true, address: addr, network: 'mainnet' })); }, ['xtrata.v15.1.wallet.session', WALLET_ADDR]);
  await context.addInitScript(fakeEngine, [tracks, cover, wav]);
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.protocol === 'data:') return route.continue();
    if (url.origin !== SITE) return route.abort();
    if (url.pathname.startsWith('/xtrata-radio.js') || url.pathname === '/radio/wallet.js') return route.fulfill({ body: '', headers: { 'content-type': 'text/javascript' } });
    if (url.pathname === '/radio/listening-wallet/config') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ enabled: false }) });
    if (url.pathname === '/radio/song-stats') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ id: Number(url.searchParams.get('id')), likes: 12, plays: 34567 }) });
    if (url.pathname === '/radio/counts') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ tracks }) });
    try { const path = url.pathname.slice(1) || 'index.html'; return route.fulfill({ body: await readFile(new URL(path, pub)), headers: { 'content-type': type(path) } }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(SITE + '/radio.html');
  await page.locator('#ttl', { hasText: tracks[9].title }).waitFor();
  await page.locator('#tuner:not([hidden])').waitFor();
  await page.waitForTimeout(700); // glow, spectrum, needle settle

  // this song on-chain: likes and paid plays in the display
  await page.locator('#songCounts:not([hidden])').waitFor();
  assert.equal(await page.locator('#cLikes').textContent(), '♥ 12');
  assert.equal(await page.locator('#cPlays').textContent(), '▶ 34.6k');
  assert.equal(await page.locator('#cPlays').getAttribute('title'), '34,567 paid plays on-chain');
  // timeline: the song's waveform (louder to the right), played part lit, a tap jumps there
  await page.locator('#timeline:not([hidden])').waitFor();
  assert.equal(await page.locator('#tCur').innerText(), '0:50');
  assert.equal(await page.locator('#tDur').innerText(), '3:20');
  await page.waitForFunction(() => { const c = document.getElementById('wave'), x = c.getContext('2d'), h = c.height;
    const tall = (f) => { const w = 16, col = x.getImageData(Math.floor(c.width * f), 0, w, h).data; let top = 0; for (let px = 0; px < w; px++) { let n = 0; for (let y = 0; y < h; y++) if (col[(y * w + px) * 4 + 3]) n++; top = Math.max(top, n); } return top; };
    return tall(0.9) > tall(0.1) * 2; }); // decoded peaks drawn, not the plain bar
  const wbox = await page.locator('#tlWave').boundingBox();
  await page.mouse.click(wbox.x + wbox.width * 0.75, wbox.y + wbox.height / 2);
  assert.deepEqual(await page.evaluate(() => window.__calls.at(-1)), ['seek', 150]);
  await page.locator('#tlWave').focus();
  await page.keyboard.press('ArrowLeft');
  assert.deepEqual(await page.evaluate(() => window.__calls.at(-1)), ['seek', 145]);
  // pay-per-play not enabled here: neither look, no lamp, no nudges
  assert.equal(await page.evaluate(() => document.documentElement.dataset.ppp ?? ''), '');
  assert.equal(await page.locator('#onair').isVisible(), false);
  assert.equal(await page.locator('#pppNudge').isVisible(), false);
  // receiver: artwork glow picked from the cover; spectrum drawn from the analyser
  const glow = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--glow').trim());
  assert.notEqual(glow, '94,233,255', 'glow follows the artwork');
  const lit = await page.evaluate(() => { const c = document.getElementById('spectrum'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; });
  assert.ok(lit > 100, 'spectrum draws');
  // tuning strip: 40 ticks, needle on the playing song, liked songs marked, a tap tunes
  assert.equal(await page.locator('#ticks i').count(), 40);
  assert.equal(await page.locator('#ticks i.liked').count(), 3);
  assert.match(await page.locator('#tunerNow').innerText(), new RegExp(`#${tracks[9].id}`));
  const box = await page.locator('#ticks').boundingBox();
  await page.mouse.click(box.x + box.width * (20 / 39), box.y + 10);
  assert.deepEqual(await page.evaluate(() => window.__calls.at(-1)), ['playToken', String(tracks[20].id)]);
  // stations
  await page.locator('#bands button[data-b="liked"]').click();
  assert.equal(await page.locator('#bands button.on').getAttribute('data-b'), 'liked');
  // likes: count, filter, reorder (saved per wallet and handed to the engine), collapse remembered
  assert.equal(await page.locator('#likesCount').innerText(), '3');
  await page.locator('#likesFilter').fill('night drive');
  assert.equal(await page.locator('#likesList .lrow').count(), 1);
  assert.equal(await page.locator('#likesList .mv.up').isVisible(), false); // no reordering while filtered
  await page.locator('#likesFilter').fill('');
  const before = await page.locator('#likesList .lt').allInnerTexts();
  await page.locator('#likesList .lrow').nth(2).locator('.mv.up').click();
  const after = await page.locator('#likesList .lt').allInnerTexts();
  assert.deepEqual(after, [before[0], before[2], before[1]]);
  assert.deepEqual(await page.evaluate(() => window.__order), [tracks[5].id, tracks[14].id, tracks[9].id].map(String));
  assert.deepEqual(JSON.parse(await page.evaluate((k) => localStorage.getItem(k), 'xtrata.radio.likeorder.v1:' + WALLET_ADDR)), [tracks[5].id, tracks[14].id, tracks[9].id].map(String));
  await page.locator('#likesList .lrow.now').waitFor(); // the playing song is highlighted
  if (shots) await page.screenshot({ path: `${shots}/radio-page-${viewport.width}.png`, fullPage: true });
  await page.locator('#likesBox > summary').click();
  await page.waitForFunction(() => localStorage.getItem('xtrata.radio.likes.open') === '0');
  await page.reload();
  await page.locator('#ttl', { hasText: tracks[9].title }).waitFor();
  assert.equal(await page.locator('#likesBox').evaluate((d) => d.open), false);
  assert.deepEqual(await page.locator('#likesList .lt').allTextContents(), after); // order kept (list folded away)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `no horizontal scroll at ${viewport.width}px (${overflow})`);
  await context.close();
}
await browser.close();
assert.deepEqual(errors, []);
console.log('radio page check passed');
