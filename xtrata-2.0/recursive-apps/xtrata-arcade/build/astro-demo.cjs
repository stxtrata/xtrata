// Makes public/arcade-world-preview/astro-demo.html: the preview hall with the Astro Blaster 3 machine added, to look at and play BEFORE the arcade launch.
// Nothing is on chain for it: the games contract does not exist on mainnet yet, so the page answers the hall's three reads of it (count, height, games) from a
// stand-in, and nothing else. Everything else is real and read-only: the cabinet picture (#3650) and the game (#3075) are fetched from xtrata.xyz and checked
// against the hashes the hall expects, the Top 10 comes from the mainnet scores contract, and posting a score opens the real submit page.
//   node build/astro-demo.cjs            (needs a built hall: node build/modular.mjs build && node build/preview.mjs)
const fs = require('fs');
const path = require('path');
const T = require('@stacks/transactions');
const MC = require('../tests/lib/mock-chain.cjs');

const PIC_ID = 3650, PIC_SIZE = 221288, PIC_HASH = '83bd9ce51dd2a7d7296a7917c4cbfc8c924222c1eb542fd95a3a2a839ae75706';
const GAMES = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-games-v1';
const chain = MC.createChain({ games: { height: 5000, items: [{ id: 'astro3', title: 'Astro Blaster 3', index: 21, kind: 3, engineMin: 1, codeId: PIC_ID, hash: Buffer.from(PIC_HASH, 'hex'), size: PIC_SIZE, liveAt: 100, hidden: false }] } });
const answers = {
  'get-count': chain.call(GAMES, 'get-count', []),
  'get-height': chain.call(GAMES, 'get-height', []),
  'get-games': chain.call(GAMES, 'get-games', [T.cvToHex(T.listCV([T.uintCV(0)]))])
};
for (const [k, v] of Object.entries(answers)) if (!v) throw new Error('no stand-in answer for ' + k);

const root = path.join(__dirname, '..', '..', '..');
const src = path.join(root, 'public', 'arcade-world-preview', 'index.html');
const out = path.join(root, 'public', 'arcade-world-preview', 'astro-demo.html');
const html = fs.readFileSync(src, 'utf8');
const inject = `<script>
/* ASTRO BLASTER 3 DEMO. Stand-in for the games contract only (it is not on mainnet yet); everything else is read-only and real. */
window.XA_GAMES_CONFIG = { contract: ${JSON.stringify(GAMES)} };
(function () {
  var ANSWERS = ${JSON.stringify(answers)}, real = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var m = /\\/v2\\/contracts\\/call-read\\/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X\\/xtrata-games-v1\\/([a-z-]+)/.exec(url);
      if (m && ANSWERS[m[1]]) return Promise.resolve(new Response(JSON.stringify({ okay: true, result: ANSWERS[m[1]] }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    } catch (e) {}
    return real(input, init);
  };
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('div');
    b.textContent = 'DEMO · Astro Blaster 3 is the last machine on the right, at the far end · games contract is a stand-in · nothing here is on chain';
    b.style.cssText = 'position:fixed;left:50%;bottom:6px;transform:translateX(-50%);z-index:99999;font:11px/1.3 monospace;color:#ffd36b;background:#000a;padding:4px 10px;border-radius:10px;pointer-events:none';
    document.body.appendChild(b);
  });
})();
<\/script>`;
if (!html.includes('<head>')) throw new Error('no <head> in the preview');
// The preview is one file, so its parts run in order with no gap. The real parent waits for the games check before it starts the engine;
// do the same here: everything after the games registry is held back and run once the check has finished.
const mark = html.indexOf('<script>/* games-registry.js */');
const regEnd = html.indexOf('</script>', mark) + '</script>'.length;
const bodyEnd = html.lastIndexOf('</body>');
if (mark < 0 || regEnd < mark || bodyEnd < regEnd) throw new Error('could not find the games registry script in the preview');
const tail = html.slice(regEnd, bodyEnd);
const parts = [];
const rest = tail.replace(/<script>([\s\S]*?)<\/script>/g, (m, code) => { parts.push(code); return ''; });
if (rest.replace(/<!--[\s\S]*?-->/g, '').trim()) throw new Error('unexpected markup between the preview scripts: ' + rest.trim().slice(0, 80));
if (parts.length < 8) throw new Error('expected the engine and hall scripts after the games registry, found ' + parts.length);
const runner = '<script>(async function () {\n  var PARTS = ' + JSON.stringify(parts).replace(/<\//g, '<\\/') + ';\n' +
  '  try { await Promise.race([Promise.resolve(window.XA_PREBOOT && window.XA_PREBOOT()), new Promise(function (r) { setTimeout(r, 30000); })]); } catch (e) { console.warn("games check failed", e); }\n' +
  '  PARTS.forEach(function (code) { var s = document.createElement("script"); s.text = code; document.body.appendChild(s); });\n})();<\/script>\n';
const held = html.slice(0, regEnd) + '\n' + runner + html.slice(bodyEnd);
fs.writeFileSync(out, held.replace('<head>', '<head>' + inject));
console.log('wrote ' + out + ' (' + Math.round(fs.statSync(out).size / 1024) + ' KB)');
