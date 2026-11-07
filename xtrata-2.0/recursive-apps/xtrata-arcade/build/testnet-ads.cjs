// Makes public/arcade-world-preview/testnet-ads.html: a TESTNET page to rent a slot on the arcade screen (xtrata-screen-v1) with your own wallet.
// It reads the screen contract and the Xtrata core from the Hiro TESTNET API and sends only `buy-slot` (and, for the admin wallet, the admin calls) through
// the same wallet code the hall uses for scores (score-client.js, wallet playbook rules: deny-mode post-condition, bare hex, no `sender`).
//   node build/testnet-ads.cjs [--screen ST...xtrata-screen-v1] [--core ST...xtrata-v3-2-3] [--out FILE]
// Defaults are the v5 testnet root. Nothing on mainnet is touched; the page refuses a mainnet wallet.
const fs = require('fs');
const path = require('path');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const ROOT = 'STVAM4JVX5ES4MV18S00VCAQMPR8928FAHRNMAJ9';
const SCREEN = arg('screen', ROOT + '.xtrata-screen-v1'), CORE = arg('core', ROOT + '.xtrata-v3-2-3');
const out = arg('out', path.join(__dirname, '..', '..', '..', 'public', 'arcade-world-preview', 'testnet-ads.html'));
const scoreClient = fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'score-client.js'), 'utf8');
if (!/^ST[0-9A-Z]{25,41}\.[a-z][a-z0-9-]*$/.test(SCREEN) || !/^ST[0-9A-Z]{25,41}\.[a-z][a-z0-9-]*$/.test(CORE)) throw new Error('screen and core must be testnet contract ids');
const page = fs.readFileSync(path.join(__dirname, 'testnet-ads.page.html'), 'utf8')
  .replace('@@SCORE_CLIENT@@', () => scoreClient.replace(/<\/script/gi, '<\\/script'))
  .replace(/@@SCREEN@@/g, SCREEN).replace(/@@CORE@@/g, CORE).replace(/@@ROOT@@/g, SCREEN.split('.')[0]);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, page);
console.log('written', out, page.length, 'bytes');
