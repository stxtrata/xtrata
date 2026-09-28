// End-to-end smoke test: parent loader (mocked get-chunk), room, all three games,
// game-over → submit through a mock host wallet bridge.
// Run: NODE_PATH=<dir with playwright + @stacks/transactions> node tests/smoke.test.cjs [outDir]
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT, { recursive: true });
const FILES = { 101: 'arcade-room.css', 102: 'arcade-kit.js', 103: 'score-client.js', 104: 'arcade-room.js',
  105: 'game-neon-snake.js', 106: 'game-block-drop.js', 107: 'game-cave-diver.js',
  108: 'game-orbit-merge.js', 109: 'game-block-runner.js', 110: 'game-brick-breaker.js',
  111: 'game-rock-drift.js', 112: 'game-stack-tower.js', 113: 'game-road-hopper.js',
  114: 'game-tile-tap.js', 115: 'game-merge-2048.js', 116: 'game-block-defence.js',
  117: 'game-maze-muncher.js', 118: 'game-invader-wave.js', 119: 'game-helix-drop.js',
  120: 'game-bubble-pop.js', 121: 'game-swerve.js', 122: 'game-lunar-lander.js',
  123: 'game-reflex-tap.js', 124: 'game-mine-sprint.js', 125: 'game-pong-streak.js', 126: 'arcade-music.js' };
const CHUNK = 16384;
const P1 = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', P2 = 'SP000000000000000000002Q6VF78';

function server() {
  return new Promise((res) => {
    const s = http.createServer((req, rsp) => {
      const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      let body = fs.readFileSync(f);
      if (f.endsWith('xtrata-arcade-parent.template.html')) {
        body = body.toString().replace(/moduleIds: \{[\s\S]*?\}/, 'moduleIds: { css: 101, kit: 102, music: 126, scores: 103, room: 104, snake: 105, blocks: 106, cave: 107, merge: 108, runner: 109, bricks: 110, drift: 111, stack: 112, hopper: 113, tiles: 114, merge2048: 115, defence: 116, muncher: 117, invaders: 118, helix: 119, bubbles: 120, swerve: 121, lander: 122, reflex: 123, mines: 124, pong: 125 }');
      }
      const type = f.endsWith('.html') ? 'text/html' : f.endsWith('.css') ? 'text/css' : 'text/javascript';
      rsp.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
      rsp.end(body);
    }).listen(0, () => res(s));
  });
}
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const entry = (name, player, score) => T.someCV(T.tupleCV({ name: T.stringAsciiCV(name), player: T.standardPrincipalCV(player), score: T.uintCV(score), 'updated-at': T.uintCV(170000) }));
function board(entries) {
  const l = entries.map((e) => entry(...e));
  while (l.length < 10) l.push(T.noneCV());
  return T.cvToHex(T.responseOkCV(T.listCV(l)));
}
const SNAKE_BOARD = board(Array.from({ length: 10 }, (_, i) => [['JIM', 'ZED', 'ACE', 'NEO', 'MAX', 'KAI', 'LEO', 'RAY', 'SKY', 'OZZ'][i], i % 2 ? P2 : P1, 1000 - i * 100]));
const EMPTY_BOARD = board([]);
const stats = { chunkReads: 0, boardReads: {}, feeReads: 0 };

async function mockApi(ctx) {
  await ctx.route('https://api.mainnet.hiro.so/**', async (route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const url = req.url();
    const args = (JSON.parse(req.postData() || '{}').arguments) || [];
    const ok = (result) => route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ okay: true, result }) });
    if (url.endsWith('/xtrata-v3-2-3/get-chunk')) {
      stats.chunkReads++;
      const id = Number(T.cvToValue(T.hexToCV(args[0]))), idx = Number(T.cvToValue(T.hexToCV(args[1])));
      const data = fs.readFileSync(path.join(ROOT, 'modules', FILES[id]));
      const part = data.subarray(idx * CHUNK, (idx + 1) * CHUNK);
      return ok(part.length ? T.cvToHex(T.someCV(T.bufferCV(part))) : T.cvToHex(T.noneCV()));
    }
    if (url.endsWith('/get-fee-unit')) { stats.feeReads++; return ok(T.cvToHex(T.responseOkCV(T.uintCV(30000)))); }
    if (url.endsWith('/get-top10')) {
      const gid = T.cvToValue(T.hexToCV(args[0]));
      stats.boardReads[gid] = (stats.boardReads[gid] || 0) + 1;
      if (gid === 'xa_cave_diver') return route.fulfill({ status: 503, headers: cors, body: 'down' });
      return ok(gid === 'xa_neon_snake' ? SNAKE_BOARD : EMPTY_BOARD);
    }
    return route.fulfill({ status: 404, headers: cors });
  });
}

(async () => {
  const srv = await server();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--autoplay-policy=no-user-gesture-required'] });
  const errors = [];
  let n = 0;
  const check = (c, m) => { assert.ok(c, m); n++; console.log('  ✓', m); };

  /* ---------- 1. Parent inside a sandboxed iframe of a mock host ---------- */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await mockApi(ctx);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('page: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/503|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.goto(base + '/tests/mock-host.html');
  const frame = page.frames().find((f) => f !== page.mainFrame());
  await frame.waitForSelector('.xa-cab', { timeout: 20000 });
  check((await frame.$$('.xa-cab')).length === 21, 'parent loaded 26 leaves from get-chunk and room shows 21 cabinets');
  check(stats.chunkReads >= 14, `modules read via get-chunk (${stats.chunkReads} calls)`);
  await frame.waitForFunction(() => document.querySelector('[data-game="xa_neon_snake"] .xa-top1').textContent !== '…');
  check((await frame.textContent('[data-game="xa_neon_snake"] .xa-top1')).includes('1,000 JIM'), 'snake cabinet shows chain #1 from get-top10');
  await frame.waitForFunction(() => document.querySelector('[data-game="xa_cave_diver"] .xa-top1').textContent !== '…');
  check((await frame.textContent('[data-game="xa_cave_diver"] .xa-top1')) === 'offline', 'failed board read shows offline, not empty');
  check((await frame.textContent('[data-game="xa_block_drop"] .xa-top1')) === 'be first', 'empty board shows be first');
  await frame.waitForFunction(() => window.XAScores.status().route === 'host');
  check(true, 'hello handshake granted host bridge');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, '01-room.png') });

  // scoreboard modal
  await frame.click('[data-game="xa_neon_snake"] .xa-cab-actions .xa-btn:not(.xa-btn-play)');
  await frame.waitForSelector('.xa-board li');
  check((await frame.$$('.xa-board li')).length === 10, 'scoreboard lists 10 entries');
  await page.screenshot({ path: path.join(OUT, '02-scores.png') });
  await frame.click('.xa-tab:nth-child(3)');
  await frame.waitForSelector('.xa-error');
  check(true, 'cave board error state distinct from empty');
  await frame.press('body', 'Escape');

  /* ---------- 2. Neon Snake: play, die, submit via generic contract call ---------- */
  await frame.click('[data-play="xa_neon_snake"]');
  await frame.evaluate(() => { window.__steps = 0; });
  await frame.waitForFunction(() => window.XARoom._session() && window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await frame.evaluate(() => { window.XA.music.onStep(() => { window.__steps++; }); });
  await page.waitForTimeout(700);
  const mus = await frame.evaluate(() => ({ playing: window.XA.music.isPlaying(), steps: window.__steps, tempo: window.XA.music.tempo() }));
  check(mus.playing && mus.steps >= 3 && mus.tempo > 90, 'music engine: snake soundtrack is scheduling (' + mus.steps + ' steps @ ' + Math.round(mus.tempo) + ' bpm)');
  check((await frame.evaluate(() => window.XA.music.degToMidi(7, 57, 'minor', 0))) === 69 && (await frame.evaluate(() => window.XA.music.degToMidi(-1, 57, 'minor', 0))) === 55, 'music engine: scale degrees map to the right notes');
  await frame.focus('.xa-stage');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, '03-snake.png') });
  await frame.evaluate(() => { window.XARoom._session().score = 5000; });
  // steer into the bottom wall
  await frame.waitForSelector('.xa-over', { timeout: 15000 });
  check(true, 'snake dies on wall and shows game over');
  await page.waitForTimeout(1600);
  check(!(await frame.evaluate(() => window.XA.music.isPlaying())), 'music engine: game over tape-stops the soundtrack');
  await frame.waitForSelector('.xa-name', { timeout: 5000 });
  const verdict = await frame.textContent('.xa-verdict');
  check(/#1/.test(verdict), 'score 5000 ranks #1: ' + verdict.trim());
  await frame.fill('.xa-name', 'tester!!');
  check((await frame.inputValue('.xa-name')) === 'TESTER', 'name is sanitised and uppercased');
  await page.screenshot({ path: path.join(OUT, '04-gameover.png') });
  await frame.click('.xa-btn-primary');
  try { await frame.waitForSelector('.xa-msg.is-ok', { timeout: 8000 }); }
  catch (e) { console.error('msg:', await frame.textContent('.xa-msg'), JSON.stringify(await page.evaluate(() => window.__calls))); throw e; }
  const calls = await page.evaluate(() => window.__calls);
  const methods = calls.map((c) => c.method);
  check(methods.join(',') === 'wallet_connect,xtrata_submitArcadeScore,stx_callContract', 'bridge order: connect → narrow → generic (' + methods.join(',') + ')');
  const narrowCall = calls[1].params;
  check(narrowCall.gameId === 'xa_neon_snake' && narrowCall.score === '5000' && narrowCall.name === 'TESTER' && narrowCall.contract.endsWith('xtrata-arcade-scores-v1-3'), 'narrow request carries only game/score/name/contract');
  const cc = calls[2].params;
  check(cc.functionName === 'submit-score' && cc.postConditionMode === 'deny', 'generic call targets submit-score in deny mode');
  const decoded = cc.functionArgs.map((h) => T.cvToValue(T.hexToCV(h)));
  check(JSON.stringify(decoded.map(String)) === JSON.stringify(['xa_neon_snake', '0', '5000', 'TESTER']), 'functionArgs decode to (game-id, mode, score, name)');
  check(cc.postConditions.length === 1 && cc.postConditions[0].amount === '30000' && cc.postConditions[0].conditionCode === 'lte' && cc.postConditions[0].principal === P2, 'single STX post-condition ≤ contract fee from connected wallet');
  check(!('sender' in cc), 'no sender field on stx_callContract');
  check((await frame.getAttribute('.xa-msg a', 'href')).includes('0xabc123'), 'explorer link uses returned txid');
  await page.screenshot({ path: path.join(OUT, '05-submitted.png') });

  /* ---------- 3. Block Drop: play with keys, hard-drop until top-out ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)'); // back to room
  await frame.click('[data-play="xa_block_drop"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press(i % 2 ? 'ArrowLeft' : 'ArrowRight');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Space');
    await page.waitForTimeout(80);
  }
  await page.screenshot({ path: path.join(OUT, '06-blockdrop.png') });
  const bdScore = await frame.evaluate(() => window.XARoom._session().score);
  check(bdScore > 0, 'block drop hard drops add score (' + bdScore + ')');
  for (let i = 0; i < 40; i++) { await page.keyboard.press('Space'); await page.waitForTimeout(40); }
  await frame.waitForSelector('.xa-over', { timeout: 15000 });
  check(true, 'block drop tops out into game over');
  await frame.waitForFunction(() => /top 10/.test(document.querySelector('.xa-verdict').textContent), null, { timeout: 5000 });
  check(true, 'empty board: any score makes the top 10');

  /* ---------- 4. Cave Diver: hold to swim, crash ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');
  await frame.click('[data-play="xa_cave_diver"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.keyboard.down('Space'); await page.waitForTimeout(250); await page.keyboard.up('Space');
  for (let i = 0; i < 8; i++) { await page.keyboard.down('Space'); await page.waitForTimeout(160); await page.keyboard.up('Space'); await page.waitForTimeout(170); }
  await page.screenshot({ path: path.join(OUT, '07-cave.png') });
  const caveScore = await frame.evaluate(() => window.XARoom._session().score);
  check(caveScore > 0, 'cave diver distance scores (' + caveScore + ')');
  await frame.waitForSelector('.xa-over', { timeout: 20000 });
  check(true, 'cave diver crashes into game over');
  await frame.waitForFunction(() => /Couldn/.test(document.querySelector('.xa-verdict').textContent), null, { timeout: 5000 });
  check(true, 'board offline → still offers to post, with honest message');
  await page.screenshot({ path: path.join(OUT, '08-cave-over.png') });

  /* ---------- 4b. Orbit Merge: aim with the mouse, click to drop ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');
  await frame.click('[data-play="xa_orbit_merge"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const box = await (await frame.$('.xa-stage canvas')).boundingBox();
  for (let i = 0; i < 14; i++) {
    const fx = box.x + box.width * (0.35 + (i % 3) * 0.15);
    await page.mouse.move(fx, box.y + box.height * 0.3);
    await page.mouse.down(); await page.mouse.up();
    await page.waitForTimeout(520);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, '12-orbit.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'orbit merge: dropped planets merge and score');
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Space');
  check((await frame.evaluate(() => window.XARoom._session().state)) === 'play', 'orbit merge: keyboard drop keeps running');

  /* ---------- 4c. Block Runner: jump a few times, then stop and crash ---------- */
  await frame.click('.xa-hud .xa-icon');
  await frame.click('[data-play="xa_block_runner"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.keyboard.press('Space');
  for (let i = 0; i < 6; i++) { await page.waitForTimeout(350); await page.keyboard.press('Space'); }
  await page.screenshot({ path: path.join(OUT, '13-runner.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'block runner: distance scores');
  await frame.waitForSelector('.xa-over', { timeout: 25000 });
  check(true, 'block runner: hitting an obstacle ends the run');

  /* ---------- 4d. Brick Breaker: launch and break bricks ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');
  await frame.click('[data-play="xa_brick_breaker"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const bb = await (await frame.$('.xa-stage canvas')).boundingBox();
  await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.9);
  await page.keyboard.press('Space');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, '14-bricks.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'brick breaker: ball breaks bricks');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4e. Rock Drift: turn, thrust, fire ---------- */
  await frame.click('[data-play="xa_rock_drift"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.keyboard.down('Space');
  for (let i = 0; i < 12; i++) { await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(160); await page.keyboard.up('ArrowLeft'); await page.waitForTimeout(160); }
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(300); await page.keyboard.up('ArrowUp');
  await page.keyboard.up('Space');
  await page.screenshot({ path: path.join(OUT, '15-drift.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'rock drift: shots split rocks and score');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4f. Stack Tower: drop slabs, then miss ---------- */
  await frame.click('[data-play="xa_stack_tower"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  for (let i = 0; i < 6; i++) { await page.waitForTimeout(700); await page.keyboard.press('Space'); }
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, '16-stack.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) >= 10, 'stack tower: dropped slabs score');
  for (let i = 0; i < 40 && !(await frame.$('.xa-over')); i++) { await page.keyboard.press('Space'); await page.waitForTimeout(90); }
  await frame.waitForSelector('.xa-over', { timeout: 8000 });
  check(true, 'stack tower: a clean miss ends the run');

  /* ---------- 4g. Road Hopper: hop forward ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');
  await frame.click('[data-play="xa_road_hopper"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(160); }
  check((await frame.evaluate(() => window.XARoom._session().score)) === 30, 'road hopper: three safe hops score 30');
  for (let i = 0; i < 10; i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200); }
  await page.screenshot({ path: path.join(OUT, '17-hopper.png') });
  await frame.waitForSelector('.xa-over', { timeout: 30000 });
  check(true, 'road hopper: run ends (hit, splash or caught by the screen)');
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');

  /* ---------- 4h. Tile Tap: hit the right lanes, then a wrong one ---------- */
  await frame.click('[data-play="xa_tile_tap"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const laneKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
  for (let i = 0; i < 12; i++) {
    const lane = await frame.evaluate(() => window.XARoom._session().instance.debug().nextLane);
    await page.keyboard.press(laneKeys[lane]);
    await page.waitForTimeout(220);
  }
  await page.screenshot({ path: path.join(OUT, '20-tiles.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) >= 120, 'tile tap: 12 correct lanes score');
  const wrong = await frame.evaluate(() => (window.XARoom._session().instance.debug().nextLane + 1) % 4);
  await page.keyboard.press(laneKeys[wrong]);
  await frame.waitForSelector('.xa-over', { timeout: 6000 });
  check(true, 'tile tap: wrong lane ends the song');

  /* ---------- 4i. Merge 2048: slide until stuck ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');
  await frame.click('[data-play="xa_merge_2048"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const seq = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowDown'];
  for (let i = 0; i < 40; i++) { await page.keyboard.press(seq[i % 4]); await page.waitForTimeout(140); }
  await page.screenshot({ path: path.join(OUT, '21-2048.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'merge 2048: slides merge tiles and score');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4j. Block Defence: click to fire interceptors ---------- */
  await frame.click('[data-play="xa_block_defence"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const db = await (await frame.$('.xa-stage canvas')).boundingBox();
  for (let i = 0; i < 16; i++) {
    const e = await frame.evaluate(() => window.XARoom._session().instance.debug().enemy);
    if (e) { await page.mouse.click(db.x + e.x / 480 * db.width, db.y + (e.y + 30) / 560 * db.height); }
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(OUT, '22-defence.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'block defence: interceptor blasts destroy warheads');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4k. Maze Muncher: eat pellets ---------- */
  await frame.click('[data-play="xa_maze_muncher"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(900);
  await page.keyboard.press('ArrowUp'); await page.waitForTimeout(600);
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, '23-muncher.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) >= 50, 'maze muncher: moving eats pellets');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4l. Invader Wave: fire into the formation ---------- */
  await frame.click('[data-play="xa_invader_wave"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.keyboard.down('Space');
  await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(700); await page.keyboard.up('ArrowLeft');
  await page.keyboard.down('ArrowRight'); await page.waitForTimeout(1400); await page.keyboard.up('ArrowRight');
  await page.keyboard.up('Space');
  await page.screenshot({ path: path.join(OUT, '24-invaders.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'invader wave: shots destroy invaders');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4m. Helix Drop: spin a gap under the ball ---------- */
  await frame.click('[data-play="xa_helix_drop"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  for (let i = 0; i < 60; i++) {
    const d = await frame.evaluate(() => window.XARoom._session().instance.debug());
    if (d.passed >= 3) break;
    if (d.kinds[d.seg] === 1) { await page.waitForTimeout(200); continue; }
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(40); await page.keyboard.up('ArrowRight');
  }
  await page.screenshot({ path: path.join(OUT, '25-helix.png') });
  check((await frame.evaluate(() => window.XARoom._session().instance.debug().passed)) >= 1, 'helix drop: ball falls through gaps');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4n. Bubble Pop: fire a volley ---------- */
  await frame.click('[data-play="xa_bubble_pop"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const before = await frame.evaluate(() => window.XARoom._session().instance.debug().bubbles);
  const bpb = await (await frame.$('.xa-stage canvas')).boundingBox();
  for (let i = 0; i < 8; i++) {
    await page.mouse.move(bpb.x + bpb.width * (0.2 + (i % 4) * 0.2), bpb.y + bpb.height * 0.4);
    await page.mouse.down(); await page.mouse.up();
    await page.waitForTimeout(450);
  }
  await page.screenshot({ path: path.join(OUT, '26-bubbles.png') });
  const after = await frame.evaluate(() => window.XARoom._session().instance.debug().bubbles);
  check(after !== before, 'bubble pop: shots land on the board (' + before + ' -> ' + after + ')');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4o. Swerve: run the corridor ---------- */
  await frame.click('[data-play="xa_swerve"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, '27-swerve.png') });
  check((await frame.evaluate(() => window.XARoom._session().score)) > 0, 'swerve: distance scores');
  await frame.waitForSelector('.xa-over', { timeout: 30000 });
  check(true, 'swerve: hitting a wall ends the run');

  /* ---------- 4p. Lunar Lander: burn fuel, then crash ---------- */
  await frame.click('.xa-over-actions .xa-btn:not(.xa-btn-play)');
  await frame.click('[data-play="xa_lunar_lander"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  await page.keyboard.down('Space'); await page.waitForTimeout(700); await page.keyboard.up('Space');
  await page.screenshot({ path: path.join(OUT, '28-lander.png') });
  check((await frame.evaluate(() => window.XARoom._session().instance.debug().fuel)) < 1000, 'lunar lander: thrust burns fuel');
  await page.keyboard.down('ArrowRight'); await page.waitForTimeout(500); await page.keyboard.up('ArrowRight');
  await frame.waitForFunction(() => window.XARoom._session().instance.debug().ships === 2, null, { timeout: 20000 });
  check(true, 'lunar lander: a tilted touchdown costs a module');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4q. Reflex Tap: hit the cyan blocks with number keys ---------- */
  await frame.click('[data-play="xa_reflex_tap"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  for (let i = 0; i < 40; i++) {
    const d = await frame.evaluate(() => window.XARoom._session().instance.debug());
    if (d.hits >= 5) break;
    if (d.good.length) await page.keyboard.press('Digit' + (d.good[0] + 1));
    await page.waitForTimeout(120);
  }
  await page.screenshot({ path: path.join(OUT, '29-reflex.png') });
  check((await frame.evaluate(() => window.XARoom._session().instance.debug().hits)) >= 3, 'reflex tap: hitting cyan blocks scores');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4r. Mine Sprint: first click is safe and opens cells ---------- */
  await frame.click('[data-play="xa_mine_sprint"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const mb = await (await frame.$('.xa-stage canvas')).boundingBox();
  await page.mouse.click(mb.x + mb.width * 0.5, mb.y + mb.height * (64 + 198) / 500);
  await page.waitForTimeout(300);
  const md = await frame.evaluate(() => window.XARoom._session().instance.debug());
  check(md.placed && md.opened >= 1 && (await frame.evaluate(() => window.XARoom._session().state)) === 'play', 'mine sprint: first click is safe (' + md.opened + ' cells opened)');
  await page.keyboard.press('KeyF');
  await page.screenshot({ path: path.join(OUT, '30-mines.png') });
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 4s. Pong Streak: track the ball ---------- */
  await frame.click('[data-play="xa_pong_streak"]');
  await frame.waitForFunction(() => window.XARoom._session().state === 'play', null, { timeout: 6000 });
  const pb = await (await frame.$('.xa-stage canvas')).boundingBox();
  for (let i = 0; i < 90; i++) {
    const d = await frame.evaluate(() => window.XARoom._session().instance.debug());
    if (d.rally >= 2) break;
    if (d.ball) await page.mouse.move(pb.x + d.ball.x / 420 * pb.width, pb.y + pb.height * 0.9);
    await page.waitForTimeout(40);
  }
  await page.screenshot({ path: path.join(OUT, '31-pong.png') });
  check((await frame.evaluate(() => window.XARoom._session().instance.debug().rally)) >= 1, 'pong streak: tracking the ball returns it');
  await frame.click('.xa-hud .xa-icon');

  /* ---------- 5. Narrow host method path ---------- */
  const page2 = await ctx.newPage();
  await page2.goto(base + '/tests/mock-host.html?narrow=1');
  const f2 = page2.frames().find((f) => f !== page2.mainFrame());
  await f2.waitForSelector('.xa-cab', { timeout: 20000 });
  await f2.waitForFunction(() => window.XAScores.status().route === 'host');
  const r = await f2.evaluate(() => window.XAScores.submit({ gameId: 'xa_block_drop', score: 777, name: 'NARROW' }));
  const calls2 = await page2.evaluate(() => window.__calls.map((c) => c.method));
  check(r.ok && r.route === 'host:arcade' && calls2.join(',') === 'wallet_connect,xtrata_submitArcadeScore', 'narrow host method used when supported');
  check(/^0x[0-9a-f]{64}$/.test(r.txid), 'narrow host txid passed through');
  // Same shape the xtrata.xyz host parser (src/lib/viewer/arcade-score.ts) accepts.
  const np = await page2.evaluate(() => window.__calls[1].params);
  check(np.contract === 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v1-3' &&
    np.network === 'mainnet' && np.gameId === 'xa_block_drop' && np.mode === 'score' &&
    np.score === '777' && np.name === 'NARROW' && /^S[PM]/.test(np.address) &&
    Object.keys(np).sort().join(',') === 'address,contract,gameId,mode,name,network,score',
    'narrow request carries only the seven fields the host validates');
  await page2.close();

  /* ---------- 6. Direct page, no wallet: view-only ---------- */
  const mobile = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await mockApi(mobile);
  const p3 = await mobile.newPage();
  p3.on('pageerror', (e) => errors.push('mobile: ' + e.message));
  await p3.goto(base + '/index.html');
  await p3.waitForSelector('.xa-cab');
  check((await p3.evaluate(() => window.XAScores.status().route)) === 'none', 'standalone page with no wallet is view-only');
  await p3.waitForTimeout(500);
  await p3.screenshot({ path: path.join(OUT, '09-mobile-room.png') });
  await p3.click('[data-play="xa_block_drop"]');
  await p3.waitForSelector('.xa-pad');
  check((await p3.$$('.xa-pad')).length === 7, 'block drop shows 7 touch pads on mobile');
  await p3.waitForTimeout(3300);
  await p3.screenshot({ path: path.join(OUT, '10-mobile-blocks.png') });
  const noScroll = await p3.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  check(noScroll, 'no horizontal scroll at 390px');
  await p3.click('.xa-hud .xa-icon');
  await p3.click('[data-play="xa_neon_snake"]');
  await p3.waitForTimeout(3300);
  await p3.screenshot({ path: path.join(OUT, '11-mobile-snake.png') });

  await browser.close();
  srv.close();
  if (errors.length) { console.error('Page errors:\n' + errors.join('\n')); process.exit(1); }
  console.log(`\nsmoke tests passed: ${n}`);
})().catch((e) => { console.error(e); process.exit(1); });
