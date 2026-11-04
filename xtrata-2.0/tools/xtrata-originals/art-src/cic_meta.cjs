const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('http://127.0.0.1:8092/harness.html'); await p.waitForFunction(() => window.ready);
const r = await p.evaluate(() => { const out = []; for (let s = 1; s <= 3301; s++) { const m = C.getMetadataForSeed(s); out.push([s, m.rank, m.rarityTier, m.instructions.barkBackdrop, m.instructions.color, m.soundIdentity.family]); } return out; });
fs.writeFileSync('raw/cicada-all.json', JSON.stringify(r)); const t = {}; r.forEach(x => t[x[2]] = (t[x[2]] || 0) + 1); console.log(t); await b.close(); })();
