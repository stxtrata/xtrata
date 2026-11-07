// Makes public/arcade/advertise.html: the MAINNET page to rent a slot on the Xtrata Arcade screen with your own wallet (served at /arcade/advertise).
// Contract ids come from parent/ids.json (the launched world). The core is the live Xtrata core. Paid slots stay off until the admin switches them on,
// and the page reads that from the contract, so it switches on by itself.   node build/mainnet-ads.cjs [--out FILE]
const fs = require('fs');
const path = require('path');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'parent', 'ids.json'), 'utf8'));
require('./ads-page.cjs').build({ network: 'mainnet', screen: ids.world.screen, core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  out: arg('out', path.join(__dirname, '..', '..', '..', 'public', 'arcade', 'advertise.html')) });
