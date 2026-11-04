const { chromium } = require('playwright'); const fs = require('fs');
const eds = JSON.parse(fs.readFileSync('raw/aud-editions.json')); const master = fs.readFileSync('raw/master-3060.js');
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
(async () => {
  const px = process.env.HTTPS_PROXY ? new URL(process.env.HTTPS_PROXY) : null;
  const browser = await chromium.launch({ proxy: px ? { server: `${px.protocol}//${px.host}`, username: decodeURIComponent(px.username), password: decodeURIComponent(px.password) } : undefined, args: ['--autoplay-policy=user-gesture-required', '--mute-audio', '--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 }, ignoreHTTPSErrors: true });
  fs.mkdirSync('raw/aud', { recursive: true });
  const reqs = new Set(), names = {};
  for (const e of eds) {
    if (only && !only.includes(e.edition)) continue;
    const p = await ctx.newPage(); p.on('pageerror', x => console.log('ERR', e.edition, x.message));
    p.on('request', r => reqs.add(r.url().split('?')[0]));
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Audionaut ${String(e.edition).padStart(3,'0')}</title><body style="background:#080d10;color:#e6eee9"><p id="boot">Loading</p><script defer src="/i/3060?contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3&amp;network=mainnet" data-edition="${e.edition}" data-seed="${e.seed}"></script></body></html>`;
    await p.route('https://xtrata.xyz/aud-test/*', r => r.fulfill({ contentType: 'text/html', body: html }));
    await p.route('https://xtrata.xyz/i/3060*', r => r.fulfill({ contentType: 'text/javascript', body: master }));
    await p.goto('https://xtrata.xyz/aud-test/' + e.edition);
    try { await p.waitForSelector('#art', { timeout: 20000 }); } catch (x) { console.log('no #art', e.edition); await p.screenshot({ path: `raw/aud/page-${e.edition}.png` }); await p.close(); continue; }
    await p.waitForTimeout(2500);
    const d = await p.evaluate(() => document.getElementById('art').toDataURL('image/png')); const txt = await p.evaluate(() => document.body.innerText); names[e.edition] = (txt.match(/AUDIONAUT \d+\s+([^\n]+)/) || [])[1] || null;
    fs.writeFileSync(`raw/aud/${String(e.edition).padStart(3, '0')}.png`, Buffer.from(d.split(',')[1], 'base64'));
    if (e.edition === 29) await p.screenshot({ path: 'raw/aud/page-029.png' });
    console.log('ok', e.edition); await p.close();
  }
  fs.writeFileSync('raw/aud-names.json', JSON.stringify(names, null, 1)); fs.writeFileSync('raw/aud-requests.txt', [...reqs].join('\n'));
  await browser.close();
})();
