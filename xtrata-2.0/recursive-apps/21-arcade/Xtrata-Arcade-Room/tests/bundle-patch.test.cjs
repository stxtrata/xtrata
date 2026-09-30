// Recursive patching of a single-file arcade inscription (e.g. #3078).
// A mocked chain holds a bundle built from the current modules, but with the
// pre-fix score client (0x-prefixed post-condition hex). The parent template
// with bundleId set must boot the whole arcade from that bundle, make Leather
// receive bare hex, and prefer any module that has its own inscription.
// Run: NODE_PATH=<playwright + @stacks/transactions> CHROME_PATH=... node tests/bundle-patch.test.cjs
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MOD = (f) => fs.readFileSync(path.join(ROOT, 'modules', f), 'utf8');
const CHUNK = 16384;
const BUNDLE_ID = 3078, SCORES_LEAF_ID = 4001;
const ADDRESS = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';

// The score client as it was before the bare-hex fix: it sends '0x00…'.
const oldScores = MOD('score-client.js').replace("return '00' + '02' +", "return '0x00' + '02' +");
assert(oldScores.includes("return '0x00' + '02' +"), 'could not reproduce the pre-fix score client');

// Same packing as parent/build-preview.mjs (what #3078 was built with).
const JS = ['arcade-kit.js', 'arcade-music.js', 'score-client.js', 'arcade-room.js', 'game-neon-snake.js', 'game-block-drop.js', 'game-cave-diver.js', 'game-orbit-merge.js', 'game-block-runner.js', 'game-brick-breaker.js', 'game-rock-drift.js', 'game-stack-tower.js', 'game-road-hopper.js', 'game-tile-tap.js', 'game-merge-2048.js', 'game-block-defence.js', 'game-maze-muncher.js', 'game-invader-wave.js', 'game-helix-drop.js', 'game-bubble-pop.js', 'game-swerve.js', 'game-lunar-lander.js', 'game-reflex-tap.js', 'game-mine-sprint.js', 'game-pong-streak.js'];
const esc = (t) => t.replace(/<\/script/gi, '<\\/script');
const bundle = `<title>Xtrata Arcade</title>\n<style>${MOD('arcade-room.css')}</style>\n<div id="xa-root"></div>\n` +
  JS.map((f) => `<script>/* ${f} */\n${esc(f === 'score-client.js' ? oldScores : MOD(f))}</script>`).join('\n') +
  `\n<script>\nXARoom.boot(document.getElementById('xa-root'));\n</script>\n`;
const CONTENT = { [BUNDLE_ID]: Buffer.from(bundle, 'utf8'), [SCORES_LEAF_ID]: Buffer.from(MOD('score-client.js'), 'utf8') };

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

function parentHtml(overrides) {
  let html = fs.readFileSync(path.join(ROOT, 'parent', 'xtrata-arcade-parent.template.html'), 'utf8');
  html = html.replace(/bundleId: \d+/, 'bundleId: ' + BUNDLE_ID);
  for (const [k, v] of Object.entries(overrides)) html = html.replace(new RegExp(`(\\n\\s+${k}: )\\d+`), `$1${v}`);
  return html;
}

(async () => {
  const pages = { '/patch-bundle-only.html': parentHtml({}), '/patch-with-scores.html': parentHtml({ scores: SCORES_LEAF_ID }) };
  const srv = http.createServer((req, res) => {
    const p = req.url.split('?')[0];
    if (pages[p]) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(pages[p]); }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const reads = {};
  async function page(file) {
    const ctx = await browser.newContext();
    await ctx.route('https://api.mainnet.hiro.so/**', async (route) => {
      const req = route.request();
      const url = req.url();
      const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const args = (JSON.parse(req.postData() || '{}').arguments) || [];
      const ok = (result) => route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ okay: true, result }) });
      if (url.endsWith('/get-chunk')) {
        const id = Number(T.cvToValue(T.hexToCV(args[0]))), idx = Number(T.cvToValue(T.hexToCV(args[1])));
        reads[id] = (reads[id] || 0) + 1;
        const data = CONTENT[id];
        const part = data ? data.subarray(idx * CHUNK, (idx + 1) * CHUNK) : Buffer.alloc(0);
        return ok(part.length ? T.cvToHex(T.someCV(T.bufferCV(part))) : T.cvToHex(T.noneCV()));
      }
      if (url.endsWith('/get-fee-unit')) return ok(T.cvToHex(T.responseOkCV(T.uintCV(30000))));
      if (url.endsWith('/get-top10')) return ok(T.cvToHex(T.responseOkCV(T.listCV(Array(10).fill(T.noneCV())))));
      return route.fulfill({ status: 404, headers: cors });
    });
    // A stand-in Leather that parses post-conditions exactly like Leather:
    // a strict hex decoder that rejects "0x", then the v7 wire parser.
    await ctx.addInitScript((address) => {
      window.__leatherCalls = [];
      window.LeatherProvider = {
        request: async (method, params) => {
          if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address }] } };
          if (method === 'stx_callContract') {
            window.__leatherCalls.push(params);
            for (const pc of params.postConditions || []) {
              if (typeof pc === 'string' && !/^([0-9a-fA-F]{2})+$/.test(pc)) throw new Error('Not a serialized post condition');
            }
            return { result: { txid: 'ab'.repeat(32) } };
          }
          throw new Error('unexpected ' + method);
        }
      };
    }, ADDRESS);
    const pg = await ctx.newPage();
    const errors = [];
    pg.on('pageerror', (e) => errors.push(e.message));
    await pg.goto(base + file);
    await pg.waitForSelector('.xa-cab', { timeout: 60000 });
    return { pg, ctx, errors };
  }

  // 1. Bundle only: every module comes out of #3078.
  let r = await page('/patch-bundle-only.html');
  check((await r.pg.$$('.xa-cab')).length === 21, 'bundle-only parent boots all 21 cabinets from #' + BUNDLE_ID + ' (' + reads[BUNDLE_ID] + ' chunk reads)');
  check((await r.pg.$$('[data-xa-module]')).length === 26, 'all 26 modules injected from the bundle');
  const sub = await r.pg.evaluate(() => window.XAScores.submit({ gameId: 'xa_cave_diver', score: 1234, name: 'JIM' }));
  const call = await r.pg.evaluate(() => window.__leatherCalls[0]);
  check(sub.ok && sub.route === 'direct:leather', 'score posts through Leather with the old score client (' + sub.route + ')');
  check(call.postConditions.length === 1 && /^[0-9a-f]+$/.test(call.postConditions[0]), 'Leather receives a bare-hex post-condition');
  const pc = (T.deserializePostConditionWire || T.deserializePostCondition)(new T.BytesReader(Buffer.from(call.postConditions[0], 'hex')));
  check(Number(pc.conditionCode) === 5 && String(pc.amount) === '30000', 'post-condition still caps the spend at the fee (<= 30000)');
  check(call.functionArgs.every((a) => /^[0-9a-f]+$/.test(a)) && call.functionArgs.map((a) => T.cvToString(T.deserializeCV(a))).join('|') === '"xa_cave_diver"|u0|u1234|"JIM"',
    'function arguments are unchanged apart from the prefix');
  check(call.postConditionMode === 'deny' && !('sender' in call), 'deny mode, no sender field');
  check(!r.errors.length, 'no page errors (bundle only)');
  await r.ctx.close();

  // 2. One module overridden by its own inscription.
  const before = reads[SCORES_LEAF_ID] || 0;
  r = await page('/patch-with-scores.html');
  check((reads[SCORES_LEAF_ID] || 0) > before, 'score client is read from its own inscription #' + SCORES_LEAF_ID);
  const src = await r.pg.evaluate(() => document.querySelector('[data-xa-module="scores"]').text);
  check(src.includes("return '00' + '02' +") && !src.includes("return '0x00'"), 'the overriding module replaces the bundle copy');
  check((await r.pg.$$('.xa-cab')).length === 21 && !r.errors.length, 'arcade still boots with the override, no page errors');
  await r.ctx.close();

  await browser.close();
  srv.close();
  console.log('\nbundle patch tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });
