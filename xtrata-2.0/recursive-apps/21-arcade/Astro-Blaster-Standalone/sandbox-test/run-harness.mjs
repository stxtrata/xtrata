#!/usr/bin/env node
/**
 * Astro Blaster v4 mobile sandbox harness runner.
 *
 * Verifies, in a real Chromium sandboxed srcdoc iframe (mirroring the Xtrata
 * viewer's sandbox="allow-scripts"), that:
 *  Scenario A (wallet-capable host):
 *   1. the v4 mobile parent boots and loads all five modules via mocked get-chunk
 *   2. the hello handshake grants a bridge token
 *   3. Connect drives the host bridge (stx_requestAccounts et al) and the
 *      badge reaches "connected" — with NO in-frame popups
 *   4. touch controls appear after launch, fit a phone viewport, and drive
 *      the existing keyboard game API
 *  Scenario B (host that ignores hello):
 *   5. the game still boots and stays playable
 *   6. Connect produces the open-runtime intent (claim-in-runtime path)
 *      instead of an alert or a hang
 *
 * Usage: node sandbox-test/run-harness.mjs   (from the Standalone folder)
 * Requires: npm i -D playwright  (or a global chromium via PLAYWRIGHT_BROWSERS_PATH)
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = normalize(join(fileURLToPath(new URL('.', import.meta.url)), '..'));
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.mjs': 'text/javascript'
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = normalize(join(ROOT, decodeURIComponent(url.pathname)));
    if (!path.startsWith(ROOT)) throw new Error('path escape');
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch (error) {
    res.writeHead(404);
    res.end('not found');
  }
});

const listen = () => new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));

const fail = (msg) => { console.error('FAIL: ' + msg); process.exitCode = 1; };
const pass = (msg) => console.log('PASS: ' + msg);

const port = await listen();
// CHROMIUM_PATH overrides for environments with a preinstalled browser
// (e.g. cloud sandboxes expose /opt/pw-browsers/chromium); by default
// Playwright uses its own downloaded Chromium (npx playwright install).
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);

async function runScenario({ grantBridge }) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://127.0.0.1:${port}/sandbox-test/host.html?grantBridge=${grantBridge ? 1 : 0}`);

  // Wait for the game frame to boot (modules injected, launcher exposed).
  const frame = await (async () => {
    for (let i = 0; i < 100; i += 1) {
      const f = page.frames().find((fr) => fr !== page.mainFrame());
      if (f) {
        const booted = await f.evaluate(() => !!window.ArcadeLauncher).catch(() => false);
        if (booted) return f;
      }
      await page.waitForTimeout(300);
    }
    return null;
  })();

  const results = () => page.evaluate(() => window.__HARNESS_RESULTS);

  if (!frame) {
    const r = await results();
    fail(`game did not boot in sandbox (grantBridge=${grantBridge}); chunks=${r.chunkRequests.length} errors=${JSON.stringify(r.errors)}`);
    await page.close();
    return;
  }
  pass(`parent booted + all modules injected in sandboxed srcdoc iframe (grantBridge=${grantBridge})`);

  let r = await results();
  if (!r.helloReceived) fail('hello broadcast never reached the host');
  else pass('hello broadcast reached host');

  if (grantBridge) {
    if (!r.helloAcked) fail('host did not ack hello');
    // Click Connect inside the sandboxed iframe.
    await frame.click('#wallet-connect-btn');
    // Wait for the bridge connect round-trip.
    await page.waitForFunction(
      () => (window.__HARNESS_RESULTS.bridgeRequests || []).some((q) =>
        ['stx_requestAccounts', 'requestAccounts', 'stx_connect', 'connect', 'wallet_connect'].includes(q.method)),
      null,
      { timeout: 20000 }
    ).catch(() => fail('no connect-method bridge request after clicking Connect'));

    const badge = await frame.textContent('#wallet-status-badge').catch(() => '');
    await page.waitForTimeout(1500);
    const badgeAfter = await frame.textContent('#wallet-status-badge').catch(() => '');
    r = await results();
    const connectSeen = r.bridgeRequests.some((q) => q.method.includes('connect') || q.method.includes('Accounts'));
    if (connectSeen) pass('Connect drove the host wallet bridge: ' + r.bridgeRequests.map((q) => q.method).join(', '));
    else fail('bridge saw no wallet methods; badge=' + badge);
    if (/Wallet:\s*S[PTMN]/.test(badgeAfter) || (/connected/i.test(badgeAfter) && !/not connected|checking/i.test(badgeAfter))) {
      pass('wallet badge reports connected: "' + badgeAfter.trim() + '"');
    } else {
      fail('badge after connect = "' + (badgeAfter || '').trim() + '"');
    }

    // End-to-end score submit through the bridge (submit-score contract call).
    const submitResult = await frame.evaluate(async () => {
      try {
        const r = await window.HighScores.submitOnChainScore({
          gameId: 'astro-blaster',
          mode: 0,
          score: 999999,
          playerName: 'HARNESS'
        });
        return { ok: true, r: JSON.stringify(r).slice(0, 200) };
      } catch (error) {
        return { ok: false, error: String(error && error.message ? error.message : error) };
      }
    });
    r = await results();
    const sawCall = r.bridgeRequests.some((q) => q.method === 'stx_callContract' || q.method === 'stx_callContractV2');
    if (sawCall && submitResult.ok) {
      pass('submit-score contract call rode the host bridge and returned a txId: ' + submitResult.r);
    } else {
      fail('submit-score did not complete via bridge: sawCall=' + sawCall + ' result=' + JSON.stringify(submitResult));
    }
  } else {
    // Host ignores hello: Connect should fall back to the claim-runtime path.
    await frame.click('#wallet-connect-btn');
    await page.waitForFunction(
      () => (window.__HARNESS_RESULTS.intents || []).some((i) => i.intent === 'open-runtime'),
      null,
      { timeout: 20000 }
    ).then(() => pass('open-runtime intent emitted when no wallet is reachable'))
      .catch(async () => {
        const rr = await results();
        fail('no open-runtime intent; intents=' + JSON.stringify(rr.intents));
      });
    const noticeText = await frame.evaluate(() => {
      const el = document.getElementById('arcade-notice-stack');
      return el ? el.textContent : '';
    });
    if (noticeText && noticeText.length > 10) pass('in-DOM notice shown (no alert): "' + noticeText.slice(0, 80) + '..."');
    else fail('no in-DOM notice found after failed connect');
  }

  // Launch Astro Blaster and exercise the parent-only touch adapter. The
  // Pause assertion proves a pointer tap reaches the live game input handler;
  // key event capture covers directional movement, fire, and EMP mappings.
  await frame.click('.game-start-btn');
  await frame.waitForSelector('#game-container canvas', { timeout: 20000 });
  await frame.waitForFunction(
    () => window.AstroBlasterMobileControls && window.AstroBlasterMobileControls.isVisible(),
    null,
    { timeout: 10000 }
  ).catch(() => fail('mobile controls did not appear after game launch'));

  const mobileLayout = await frame.evaluate(() => {
    const controls = document.getElementById('astro-mobile-controls');
    const canvas = document.querySelector('#game-container canvas');
    const controlRect = controls && controls.getBoundingClientRect();
    const canvasRect = canvas && canvas.getBoundingClientRect();
    window.__MOBILE_KEY_EVENTS = [];
    document.addEventListener('keydown', (event) => {
      window.__MOBILE_KEY_EVENTS.push({ type: 'down', key: event.key, code: event.code });
    });
    document.addEventListener('keyup', (event) => {
      window.__MOBILE_KEY_EVENTS.push({ type: 'up', key: event.key, code: event.code });
    });
    return {
      visible: Boolean(controls && !controls.hidden),
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      canvasAboveControls: Boolean(canvasRect && controlRect && canvasRect.bottom <= controlRect.top + 1),
      canvasWidth: canvasRect ? Math.round(canvasRect.width) : 0,
      canvasHeight: canvasRect ? Math.round(canvasRect.height) : 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });

  if (mobileLayout.visible && mobileLayout.noHorizontalOverflow && mobileLayout.canvasAboveControls) {
    pass(`touch deck + canvas fit phone viewport (${mobileLayout.canvasWidth}x${mobileLayout.canvasHeight} in ${mobileLayout.viewportWidth}x${mobileLayout.viewportHeight})`);
  } else {
    fail('mobile layout invalid: ' + JSON.stringify(mobileLayout));
  }

  const tap = async (selector, pointerId) => {
    await frame.dispatchEvent(selector, 'pointerdown', { pointerId, pointerType: 'touch', buttons: 1, isPrimary: true });
    await frame.dispatchEvent(selector, 'pointerup', { pointerId, pointerType: 'touch', buttons: 0, isPrimary: true });
  };

  const pausedBefore = await frame.evaluate(() => Game01.getTestHooks().getState().paused);
  await tap('[data-astro-key="p"]', 41);
  const pausedAfter = await frame.evaluate(() => Game01.getTestHooks().getState().paused);
  if (!pausedBefore && pausedAfter) pass('Pause touch button changed live game state');
  else fail(`Pause touch button did not change game state (${pausedBefore} -> ${pausedAfter})`);

  await tap('[data-astro-key="ArrowLeft"]', 42);
  await tap('[data-astro-key="Space"]', 43);
  await tap('[data-astro-key="x"]', 44);
  const mobileEvents = await frame.evaluate(() => window.__MOBILE_KEY_EVENTS || []);
  const sawPair = (key) => mobileEvents.some((event) => event.type === 'down' && event.key === key) &&
    mobileEvents.some((event) => event.type === 'up' && event.key === key);
  if (sawPair('ArrowLeft') && sawPair(' ') && sawPair('x')) {
    pass('Move, Fire, and EMP touch buttons emitted complete keyboard input pairs');
  } else {
    fail('missing touch key events: ' + JSON.stringify(mobileEvents));
  }

  // Restore the running state so teardown never leaves a held/paused input.
  await tap('[data-astro-key="p"]', 45);
  const mobileState = await frame.evaluate(() => window.AstroBlasterMobileControls.getState());
  if (mobileState.pressed.length === 0) pass('touch adapter releases all held inputs');
  else fail('touch adapter left held inputs: ' + JSON.stringify(mobileState));

  await page.close();
}

console.log('--- Scenario A: wallet-capable host (hello granted) ---');
await runScenario({ grantBridge: true });
console.log('--- Scenario B: host ignores hello (claim-runtime path) ---');
await runScenario({ grantBridge: false });

await browser.close();
server.close();
console.log(process.exitCode ? '\nHARNESS: FAILURES PRESENT' : '\nHARNESS: ALL CHECKS PASSED');
