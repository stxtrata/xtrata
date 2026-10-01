#!/usr/bin/env node
// Local render/play canary for the revised Audionauts editions (no wallet, no
// production writes). Serves the edition files and the inscriptions they load
// (#3060 engine, #3059 helmets, #2983 LIQUIDEZ, fetched once from xtrata.xyz
// into a temp cache) from localhost, then in headless Chromium checks, for the
// original and revised 084/090: identity (name, edition, seed, traits) is
// unchanged, the artwork renders, the featured secret song is LIQUIDEZ, the
// revised files credit Χ₮¡₪¢₮ beside it, and the song actually plays.
//   node canaries/audionauts-replacement/canary.mjs [originalsDir] [revisedDir]
// The Bitcoin-hosted original transmission (ordinals.com) is not fetched; the
// override does not touch that path.
import http from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync, createReadStream } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '../..');
const originals = resolve(process.argv[2] ?? join(root, '_claude_scratch/audionauts-v1-recursive'));
const revised = resolve(process.argv[3] ?? join(root, '_claude_scratch/audionauts-v1-recursive-revisions'));
const cache = process.env.CANARY_CACHE ?? join(tmpdir(), 'audionauts-canary-cache');
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CREDIT = 'Χ₮¡₪¢₮';
mkdirSync(cache, { recursive: true });
for (const id of ['3060', '3059', '2983']) {
  const file = join(cache, id);
  if (existsSync(file)) continue;
  const response = await fetch(`https://xtrata.xyz/i/${id}?contractId=${CORE}&network=mainnet`);
  if (!response.ok) throw new Error(`Could not fetch inscription #${id} (${response.status}).`);
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const inscription = /^\/i\/(\d+)$/.exec(url.pathname);
  let file = null;
  let type = 'text/html; charset=utf-8';
  if (inscription) {
    file = join(cache, inscription[1]);
    if (inscription[1] === '3060') type = 'text/javascript';
  } else if (url.pathname.startsWith('/original/')) file = join(originals, basename(url.pathname));
  else if (url.pathname.startsWith('/revised/')) file = join(revised, basename(url.pathname));
  if (!file || !existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': type });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--autoplay-policy=no-user-gesture-required']
});

async function inspect(kind, file) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/ordinals\.com/, (route) => route.abort());
  await page.goto(`http://localhost:${port}/${kind}/${file}`);
  await page.waitForSelector('#track-title', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(1500);
  const identity = await page.evaluate(() => ({
    title: document.title,
    details: document.getElementById('details')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    invalid: /Invalid Audionaut identity/.test(document.body.textContent ?? '')
  }));
  const art = await page.$eval('#art', (canvas) => {
    const c = canvas.getContext?.('2d');
    if (!c) return { painted: false };
    const { data } = c.getImageData(0, 0, canvas.width, canvas.height);
    let lit = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] + data[i + 1] + data[i + 2] > 60) lit += 1;
    return { painted: lit > 1000, size: [canvas.width, canvas.height] };
  }).catch(() => ({ painted: false }));
  await page.click('#secret-spot', { force: true });
  await page.waitForFunction(() => /^LIQUIDEZ/.test(document.getElementById('track-title')?.textContent ?? ''), null, { timeout: 60000 });
  const songTitle = await page.$eval('#track-title', (e) => e.textContent);
  // Playback: the engine's clock advances while the song plays.
  const clockAt = () => page.$eval('#clock', (e) => e.textContent ?? '');
  const firstClock = await clockAt();
  let playing = false;
  for (let i = 0; i < 20 && !playing; i += 1) {
    await page.waitForTimeout(500);
    const now = await clockAt();
    playing = now !== firstClock && !/^0:00 /.test(now);
  }
  if (!playing) {
    await page.$eval('#play', (button) => button.click()).catch(() => {});
    for (let i = 0; i < 20 && !playing; i += 1) {
      await page.waitForTimeout(500);
      playing = !/^0:00 /.test(await clockAt());
    }
  }
  const clock = await clockAt();
  await page.close();
  return { ...identity, art, songTitle, playing, clock, errors };
}

let failures = 0;
const check = (ok, label) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`); if (!ok) failures += 1; };
for (const file of ['084.html', '090.html']) {
  const before = await inspect('original', file);
  const after = await inspect('revised', file);
  console.log(`\n${file}: ${after.title} — song "${after.songTitle}", clock ${after.clock}`);
  check(!after.invalid && after.title === before.title, `${file} identity (name, edition, seed check) unchanged: ${after.title}`);
  check(after.details === before.details && after.details.includes('Seed'), `${file} traits and seed unchanged`);
  check(after.art.painted, `${file} artwork renders`);
  check(before.songTitle === 'LIQUIDEZ', `${file} original shows LIQUIDEZ with no credit`);
  check(after.songTitle === `LIQUIDEZ · ${CREDIT}`, `${file} revised credits ${CREDIT} beside LIQUIDEZ`);
  check(after.playing, `${file} LIQUIDEZ plays (${after.clock})`);
  check(after.errors.length === 0, `${file} no page errors${after.errors.length ? `: ${after.errors.join('; ')}` : ''}`);
}
await browser.close();
server.close();
console.log(failures === 0 ? '\nCanary passed.' : `\nCanary failed: ${failures} check(s).`);
process.exit(failures === 0 ? 0 : 1);
