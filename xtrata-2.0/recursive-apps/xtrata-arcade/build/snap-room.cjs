#!/usr/bin/env node
/*
 * Xtrata Arcade: take a room's "entry still"
 *
 *   THREE_JS=/path/to/three.min.js(r128) CHROME_PATH=/path/to/chrome NODE_PATH=<dir with playwright> \
 *     node build/snap-room.cjs [page=casino-room.html] [out=casino-entry.jpg] [WxH=1920x824]
 *
 * Opens build/rooms/<page>?from=arcade exactly as the arcade's lobby door opens it, waits for the first walking frames, hides the on-screen
 * controls and saves a JPEG of the view the player starts with. The hall shows that picture in the open doorway (so the door seems to open
 * into the room) and again, full screen, while the live room finishes loading; see section "rooms" in the README.
 * The shot is wide (about 21:9) because the hall's camera is fixed in height (fov 68), not in width: any screen narrower than the shot just
 * sees the middle of it. Re-run whenever the room's entry view changes, then `node build/preview.mjs`.
 */
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const here = __dirname, roomsDir = path.join(here, 'rooms');
const page0 = process.argv[2] || 'casino-room.html', out = path.join(roomsDir, process.argv[3] || 'casino-entry.jpg');
const [W, H] = (process.argv[4] || '1920x824').split('x').map(Number);
const THREE = fs.readFileSync(process.env.THREE_JS, 'utf8');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.jpg': 'image/jpeg' };
(async () => {
  const srv = http.createServer((q, r) => {
    const f = path.join(roomsDir, path.basename(q.url.split('?')[0]) || page0);
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); } });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }), page = await ctx.newPage();
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort('failed'));
  await page.route(/cdnjs\.cloudflare\.com.*three/, (r) => r.fulfill({ contentType: 'application/javascript', body: THREE }));
  await page.goto('http://127.0.0.1:' + srv.address().port + '/' + page0 + '?from=arcade');
  await page.waitForFunction(() => window.__casino, null, { timeout: 60000 });
  await page.addStyleTag({ content: '#tools,#hint,#cross,#lockhint,#toast,#intro,.hud{display:none!important}' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: out, type: 'jpeg', quality: 78, timeout: 170000 });
  console.log('wrote', out, (fs.statSync(out).size / 1024).toFixed(0) + ' KB', W + 'x' + H);
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
