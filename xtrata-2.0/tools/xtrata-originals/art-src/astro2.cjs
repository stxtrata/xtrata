const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const px = new URL(process.env.HTTPS_PROXY);
  const b = await chromium.launch({ proxy: { server: `${px.protocol}//${px.host}`, username: decodeURIComponent(px.username), password: decodeURIComponent(px.password) }, args: ['--mute-audio'] });
  const p = await b.newPage({ viewport: { width: 960, height: 720 }, ignoreHTTPSErrors: true });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`https://xtrata.xyz/i/3074?contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3&network=mainnet`, { timeout: 90000 });
  await p.waitForTimeout(6000);
  const info = await p.evaluate(() => { const cs = [...document.querySelectorAll('canvas')]; return { title: document.title, text: document.body.innerText.slice(0, 600), canvases: cs.map(c => [c.width, c.height, c.id, c.className, (c.getContext('2d') ? 'c2d' : 'gl')]) }; });
  console.log(JSON.stringify(info));
  const cdp = await p.context().newCDPSession(p); const r = await cdp.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync('raw/astro-cdp.png', Buffer.from(r.data, 'base64'));
  for (let k = 0; k < 8; k++) { await p.waitForTimeout(1700); const d = await p.evaluate(() => document.getElementById('cv').toDataURL('image/png')); fs.writeFileSync(`raw/astro-cv-${k}.png`, Buffer.from(d.split(',')[1], 'base64')); }
  await b.close();
})();
