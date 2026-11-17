// Browser check of the radio page (public/radio.html) itself, with a stand-in radio engine:
// the classic receiver (?classic=1: tuning strip, stations, likes filter / reorder / collapse) at desktop and phone width,
// then the new look (Listen, Browse, Liked, You with tabs along the bottom).
// No audio, chain or wallet: the real engine (xtrata-radio.js) and pay-per-play are not loaded.
// Usage: node scripts/test-radio-page-browser.mjs [screenshot-dir]
import { chromium } from 'playwright';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const shots = process.argv[2];
const pub = new URL('../public/', import.meta.url);
const SITE = 'https://radio.xtrata.test';
const WALLET_ADDR = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const types = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', json: 'application/json' };
const type = (p) => types[p.split('.').pop()] || 'application/octet-stream';
const tracks = Array.from({ length: 40 }, (_, i) => ({ id: 2900 + i * 3, title: ['Night Drive', 'SuperUser', 'Liquidez', 'Smalltalk', 'Entertainment'][i % 5] + ' ' + (i + 1), artist: ['Audionals', 'melophonic', '3ai3'][i % 3] }));
// The real "Find music" code (src/radio-ppp/find.ts), bundled here and run inside the real page, because the stand-in setup below never loads the panel (ppp.js).
const findJs = (await build({ entryPoints: [new URL('../src/radio-ppp/find.ts', import.meta.url).pathname], bundle: true, format: 'iife', globalName: 'FindMod', write: false })).outputFiles[0].text;
const shelfJs = (await build({ entryPoints: [new URL('../src/radio-ppp/shelf.ts', import.meta.url).pathname], bundle: true, format: 'iife', globalName: 'ShelfMod', write: false })).outputFiles[0].text;
const albums = [['Proof of Sound', 'Ada', 7], ['Night Drive', 'Bo', 12], ['Zero Hour', 'Cy', 3], ['A much longer album name that has to wrap onto two lines', 'Dee', 20]]
  .map(([title, subtitle, n], i) => ({ slot: i + 1, address: 'SPALBUM' + (i + 1), state: 'arrived', amount: '100000', label: '', from: null, source: 'campaign', player: { id: String(i + 1).padStart(16, '0'), title, subtitle, cover: null, tracks: Array.from({ length: n }, (_, k) => ({ id: 500 + i * 30 + k, title: 'Song ' + k, artist: subtitle })) } }));
const artistSongs = ['melophonic', 'melophonic', 'melophonic', 'Audionals', '3ai3', 'Cicada', 'Xtrata Arcade', 'Hundred Little Reasons', 'Rex Speedway and The Denim Avengers']
  .map((artist, i) => ({ id: 100 + i, title: `Song ${i + 1}`, artist }));
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
  let band = 'fm', shuffle = false, on = true, listeners = [];
  const snap = () => ({
    on, playing: true, band, shuffle, preset: 'all', likesStatus: 'ready', likes,
    upNext: { tokenId: tracks[10].id, title: tracks[10].title, artist: tracks[10].artist, cover },
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
    setShuffle: (v) => { shuffle = !!v; calls.push(['setShuffle', shuffle]); listeners.forEach((cb) => cb(snap())); },
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
  await page.goto(SITE + '/radio.html?classic=1');
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
  // stations (the shuffled CHAIN button belongs to the new look only)
  assert.equal(await page.locator('#bands button:visible').count(), 3);
  assert.equal(await page.locator('#tabs').isVisible(), false);
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

// The new look: one screen at a time, tabs along the bottom, no tuning strip.
for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: shots ? 2 : 1 });
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
  const shot = async (name) => { if (shots) await page.screenshot({ path: `${shots}/radio-new-${name}-${viewport.width}.png` }); };
  const tab = () => page.evaluate(() => document.documentElement.dataset.tab);
  const calls = () => page.evaluate(() => window.__calls);
  const noSideScroll = async (where) => { const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); assert.ok(o <= 1, `no horizontal scroll on ${where} at ${viewport.width}px (${o})`); };
  await page.goto(SITE + '/radio.html');
  await page.locator('#ttl', { hasText: tracks[9].title }).waitFor();
  await page.locator('#timeline:not([hidden])').waitFor();
  await page.waitForTimeout(500);

  // Listen: artwork, the song, a like beside it, the bar, three controls, what is next. No strip, no power, no receiver.
  assert.equal(await tab(), 'listen');
  for (const id of ['tuner', 'power', 'presetBtn', 'spectrum', 'likesBox', 'findBox', 'howto', 'mini']) assert.equal(await page.locator('#' + id).isVisible(), false, id + ' is not on Listen');
  for (const id of ['art', 'ttl', 'artst', 'heart', 'prev', 'pp', 'next', 'tlWave', 'upNext', 'tabs']) assert.equal(await page.locator('#' + id).isVisible(), true, id + ' is on Listen');
  assert.equal(await page.locator('#stn').innerText(), 'ALL MUSIC');
  assert.match(await page.locator('#upNextT').innerText(), new RegExp(tracks[10].title));
  assert.equal(await page.locator('.logo-name').innerText(), 'Xtrata Music');
  const heartBox = await page.locator('#heart').boundingBox(), titleBox = await page.locator('#ttl').boundingBox();
  assert.ok(heartBox.x > titleBox.x && Math.abs(heartBox.y + heartBox.height / 2 - (titleBox.y + titleBox.height / 2)) < 40, 'the like sits beside the title');
  for (const id of ['heart', 'prev', 'pp', 'next']) { const b = await page.locator('#' + id).boundingBox(); assert.ok(b.width >= 44 && b.height >= 44, id + ' is big enough to tap'); }
  await page.locator('#heart').click();
  assert.deepEqual((await calls()).at(-1), ['toggleLike']);
  await page.locator('#pp').click();
  assert.deepEqual((await calls()).at(-1), ['playPause']);
  await page.locator('#upNext').click();
  assert.deepEqual((await calls()).at(-1), ['next']);
  const wbox = await page.locator('#tlWave').boundingBox();
  await page.mouse.click(wbox.x + wbox.width * 0.5, wbox.y + wbox.height / 2);
  assert.deepEqual((await calls()).at(-1), ['seek', 100]);
  if (viewport.width < 500) { const t = await page.locator('#tabs').boundingBox(), u = await page.locator('#upNext').boundingBox(); assert.ok(u.y + u.height <= t.y + 1, 'everything on Listen fits above the tabs on a phone'); }
  // The four stations sit under the player, in plain words, smaller than they were on Browse.
  assert.equal(await page.locator('#bands').isVisible(), true);
  assert.deepEqual(await page.locator('#bands button b').allInnerTexts(), ['All music', 'Your likes', 'Everything, in order', 'Everything, shuffled']);
  assert.equal(await page.locator('#bands button.on').count(), 1);
  { const u = await page.locator('#upNext').boundingBox(), b = await page.locator('#bands').boundingBox(); assert.ok(b.y >= u.y + u.height - 1, 'the stations come after the player'); }
  for (const b of await page.locator('#bands button').all()) { const r = await b.boundingBox(); assert.ok(r.height >= 44 && r.height <= 70, 'a station is small but easy to tap (' + r.height + 'px)'); }
  await noSideScroll('Listen');
  await shot('listen');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  { const t = await page.locator('#tabs').boundingBox(), b = await page.locator('#bands').boundingBox(); assert.ok(b.y + b.height <= t.y + 1, 'scrolled to the bottom, every station is clear of the tabs'); }
  await shot('listen-stations');
  await page.evaluate(() => window.scrollTo(0, 0));

  // Browse: search and artists only. The stations are not here. Artist names that fit a column sit three across.
  await page.locator('#tabs button[data-t="browse"]').click();
  assert.equal(await tab(), 'browse');
  assert.equal(await page.locator('#tabs button[aria-current="page"]').innerText(), 'Browse');
  assert.equal(await page.locator('#bands').isVisible(), false);
  assert.deepEqual(await page.locator('.sk-h:visible').allInnerTexts(), ['Browse']);
  assert.equal(await page.locator('#art').isVisible(), false);
  assert.equal(await page.locator('#findBox').evaluate((d) => d.open), true);
  assert.equal(await page.locator('#mini').isVisible(), true);
  assert.equal(await page.locator('#miniT').innerText(), tracks[9].title);
  await page.addScriptTag({ content: findJs });
  await page.evaluate((songs) => { window.FindMod.createFindBox(document.getElementById('findBody'), { load: async () => songs, play: (id) => window.__calls.push(['playToken', id]), current: () => null, locked: () => false, grid: document.documentElement.hasAttribute('data-skin') }).load(); }, artistSongs);
  await page.locator('.find-artists--grid .find-chip').first().waitFor();
  assert.equal(await page.locator('.find-artists').evaluate((n) => getComputedStyle(n).gridTemplateColumns.split(' ').length), 3);
  assert.deepEqual(await page.locator('.find-artists .find-chip').allInnerTexts(), ['melophonic', '3ai3', 'Audionals', 'Cicada', 'Xtrata Arcade', '2 more artists']);
  { const chips = await page.locator('.find-artists .find-chip:not(.find-more)').all(); const xs = [];
    for (const c of chips) { const r = await c.boundingBox(); xs.push(r); assert.ok(await c.evaluate((n) => n.scrollWidth <= n.clientWidth + 1), 'a short name is not cut off at ' + viewport.width + 'px'); }
    assert.ok(xs[0].y === xs[1].y && xs[1].y === xs[2].y && xs[3].y > xs[0].y && xs[3].x === xs[0].x, 'names sit three to a row'); }
  assert.equal(await page.locator('.find-chip--long').count(), 0);
  await noSideScroll('Browse');
  await shot('browse');
  await page.locator('.find-more').click();
  assert.deepEqual(await page.locator('.find-chip--long').allInnerTexts(), ['Hundred Little Reasons · 1', 'Rex Speedway and The Denim Avengers · 1']);
  { const m = await page.locator('.find-more').boundingBox(), l = await page.locator('.find-chip--long').first().boundingBox(); assert.ok(l.y > m.y, 'the longer names open underneath'); }
  await noSideScroll('Browse, all artists');
  await shot('browse-all');
  await page.locator('.find-chip--long').nth(1).click();
  assert.deepEqual(await page.locator('#findBody li .lt').allInnerTexts(), ['Song 9']);
  await page.locator('#findBody li .lt').click();
  assert.deepEqual((await calls()).at(-1), ['playToken', 108]);

  // Browse with albums: two tabs, covers in two columns, and a tap opens the album and goes to Listen.
  // (The real shelf code runs here; page.ts, which wires it to the player, is covered by page-browse-albums.test.ts.)
  assert.equal(await page.locator('#browseTabs').isVisible(), false, 'no tabs until there are albums');
  await page.addScriptTag({ content: shelfJs });
  await page.evaluate(([shelf]) => {
    const snap = { step: 'ready', root: 'SP3X2F7FQH7GQS0YRBWH0H5W6RM2PB1B0WPD1XA2V', slot: 0, walletCannotAlbums: false };
    window.__snap = snap;
    const box = window.ShelfMod.createShelf({
      json: async () => ({ total: shelf.length, next: null, shelf }),
      open: (slot) => { window.__calls.push(['openAlbum', slot]); window.__snap = { ...window.__snap, slot }; draw(); window.dispatchEvent(new CustomEvent('xtrata:radio-listen')); },
      store: { get: (k) => localStorage.getItem(k), set: (k, v) => (v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v)) },
      now: Date.now, changed: () => draw()
    });
    const draw = () => { const b = box.render(window.__snap); const m = document.getElementById('shelfBox'); if (b) { if (m.firstChild !== b) m.replaceChildren(b); } else m.replaceChildren(); window.dispatchEvent(new CustomEvent('xtrata:radio-albums', { detail: { has: !!b } })); };
    draw();
  }, [albums]);
  await page.locator('#shelfBox .ppp-shelf-list li').first().waitFor();
  assert.equal(await page.locator('#browseTabs').isVisible(), true);
  assert.deepEqual(await page.locator('#browseTabs button').allInnerTexts(), ['My albums', 'Search']);
  assert.equal(await page.locator('#browseTabs button[aria-selected="true"]').innerText(), 'My albums', 'albums first when there are some');
  assert.equal(await page.locator('#findBox').isVisible(), false);
  assert.equal(await page.locator('#shelfBox').isVisible(), true);
  assert.equal(await page.locator('.sk-h[data-for=browse]').innerText(), 'Browse');
  { const lis = page.locator('#shelfBox .ppp-shelf-list li'); assert.equal(await lis.count(), 4);
    const a = await lis.nth(0).boundingBox(), b = await lis.nth(1).boundingBox(), c = await lis.nth(2).boundingBox();
    assert.ok(a.y === b.y && c.y > a.y && c.x === a.x, 'albums sit two across');
    const art = await page.locator('#shelfBox .ppp-shelf-art').first().boundingBox(); assert.ok(Math.abs(art.width - art.height) < 2 && art.width >= 120, 'a cover is a big square (' + art.width + 'x' + art.height + ')');
    assert.ok(await page.locator('#shelfBox .ppp-shelf-list .t').last().evaluate((n) => n.scrollHeight <= 2.6 * parseFloat(getComputedStyle(n).lineHeight || '20') + 4), 'a long title stays within two lines'); }
  await noSideScroll('Browse, My albums');
  await shot('browse-albums');
  await page.locator('#browseTabs button[data-bt="search"]').click();
  assert.equal(await page.locator('#findBox').isVisible(), true);
  assert.equal(await page.locator('#shelfBox').isVisible(), false);
  await page.locator('#browseTabs button[data-bt="albums"]').click();
  await page.locator('#shelfBox .ppp-shelf-list li').nth(1).click();
  assert.deepEqual((await calls()).at(-1), ['openAlbum', await page.evaluate(() => window.__snap.slot)]);
  assert.equal(await tab(), 'listen', 'an album tapped on Browse opens on Listen');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('xtrata:radio-browse', { detail: { tab: 'albums' } })));
  assert.equal(await tab(), 'browse');
  assert.equal(await page.locator('#browseTabs button[aria-selected="true"]').innerText(), 'My albums');
  assert.equal(await page.locator('#shelfBox .ppp-shelf-list li.now').count(), 1, 'the open album is marked');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('xtrata:radio-albums', { detail: { has: false } })));
  assert.equal(await page.locator('#browseTabs').isVisible(), false, 'no albums: back to plain search');
  assert.equal(await page.locator('#findBox').isVisible(), true);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('xtrata:radio-albums', { detail: { has: true } })));

  // Stations: picked on Listen, and the listener stays on Listen. Each of the two "Everything" stations sets the order.
  await page.locator('#tabs button[data-t="listen"]').click();
  await page.locator('#bands button[data-b="chain"][data-sh="1"]').click();
  assert.deepEqual((await calls()).slice(-2), [['setShuffle', true], ['setBand', 'chain']]);
  assert.equal(await tab(), 'listen');
  assert.equal(await page.locator('#stn').innerText(), 'EVERYTHING, SHUFFLED');
  assert.equal(await page.locator('#bands button.on').getAttribute('data-sh'), '1');
  await page.locator('#bands button[data-b="chain"][data-sh="0"]').click();
  assert.deepEqual((await calls()).slice(-2), [['setShuffle', false], ['setBand', 'chain']]);
  assert.equal(await page.locator('#stn').innerText(), 'EVERYTHING, IN ORDER');
  await page.locator('#bands button[data-b="fm"]').click();
  assert.deepEqual((await calls()).slice(-2), [['setShuffle', false], ['setBand', 'fm']]);
  assert.equal(await tab(), 'listen');

  // Liked: the list, always open; the small bar opens the player and pauses.
  await page.locator('#tabs button[data-t="liked"]').click();
  assert.equal(await page.locator('#likesBox').evaluate((d) => d.open), true);
  assert.equal(await page.locator('#likesList .lrow').count(), 3);
  assert.equal(await page.locator('#bands').isVisible(), false);
  await page.locator('#miniPp').click();
  assert.deepEqual((await calls()).at(-1), ['playPause']);
  await noSideScroll('Liked');
  await shot('liked');
  await page.locator('#miniOpen').click();
  assert.equal(await tab(), 'listen');

  // You: the other-wallet controls moved here from the top bar; the panel asking to be seen opens this screen.
  await page.locator('#tabs button[data-t="you"]').click();
  assert.equal(await page.locator('#radio-wallet-connect').isVisible(), true);
  assert.equal(await page.locator('.topbar #radio-wallet-connect').count(), 0);
  assert.equal(await page.locator('#likesBox').isVisible(), false);
  await noSideScroll('You');
  // "Who you have paid": the markup page.ts draws (src/radio-ppp/__tests__/page-you-paid.test.ts checks the code), put into the real page.
  const paidRows = Array.from({ length: 7 }, (_, i) => `<li class="ppp-paid__row"><span class="ppp-paid__art"><img src="${cover}" alt=""></span><span class="ppp-paid__t"><b>${i === 2 ? 'A song with a really quite long title that cannot possibly fit on one line' : 'Song ' + i}</b><span>Ada · ${i + 1} min ago</span></span>${i === 3 ? '<span class="ppp-paid__r ppp-mute">Paying…</span>' : `<a class="ppp-paid__r" href="https://explorer.hiro.so/txid/0x${i}?chain=mainnet" target="_blank" rel="noopener" aria-label="Receipt for Song ${i}">Receipt</a>`}</li>`).join('');
  await page.evaluate((rows) => { const b = document.querySelector('#ppp .ppp-paid'); b.innerHTML = `<h4>Who you have paid</h4><ol>${rows}</ol><p class="ppp-paid__note">Every play pays the artist, and anyone can check it.</p>`; b.hidden = false; }, paidRows);
  assert.equal(await page.locator('.ppp-paid').isVisible(), true, 'the paid list shows on You');
  assert.equal(await page.locator('.ppp-paid__row').count(), 7);
  for (const r of await page.locator('a.ppp-paid__r').all()) { const b = await r.boundingBox(); assert.ok(b.height >= 44, 'a receipt link is easy to tap (' + b.height + 'px)'); }
  const rowBox = await page.locator('.ppp-paid__row').nth(2).boundingBox();
  assert.ok(rowBox.height <= 72, 'a long title stays on one line (' + rowBox.height + 'px)');
  const rrs = await page.locator('.ppp-paid__row').nth(2).locator('.ppp-paid__r').boundingBox();
  assert.ok(rrs.x + rrs.width <= viewport.width + 1, 'the receipt link stays on screen');
  await noSideScroll('You with the paid list');
  await shot('you-paid');
  await page.evaluate(() => { document.querySelector('#ppp .ppp-paid').hidden = true; });
  await shot('you');
  await page.locator('#tabs button[data-t="listen"]').click();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('xtrata:radio-panel')));
  assert.equal(await tab(), 'you');
  await context.close();
}
await browser.close();
assert.deepEqual(errors, []);
console.log('radio page check passed');
