// Makes public/arcade-world-preview/testnet-ads.html: a TESTNET page to rent a slot on the arcade screen (xtrata-screen-v1) with your own wallet.
//   node build/testnet-ads.cjs [--screen ST...xtrata-screen-v1] [--core ST...xtrata-v3-2-3] [--out FILE]
// Defaults are the v8 testnet root. Nothing on mainnet is touched; the page refuses a mainnet wallet. (Shared code: build/ads-page.cjs)
const path = require('path');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const ROOT = 'STVAM4JVX5ES4MV18S00VCAQMPR8928FAHRNMAJ9';
require('./ads-page.cjs').build({ network: 'testnet', screen: arg('screen', ROOT + '.xtrata-screen-v1'), core: arg('core', ROOT + '.xtrata-v3-2-3'),
  out: arg('out', path.join(__dirname, '..', '..', '..', 'public', 'arcade-world-preview', 'testnet-ads.html')) });
