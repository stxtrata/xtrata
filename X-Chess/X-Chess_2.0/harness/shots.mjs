#!/usr/bin/env node
/**
 * shots.mjs — screenshots of the real board, driven rather than posed.
 *
 *   node harness/shots.mjs              capture every shot
 *   node harness/shots.mjs --only hero  just one
 *
 * WHY A DRIVER AND NOT `--screenshot`. Chrome's one-shot screenshot mode
 * cannot click anything, and every interesting view of this board is behind a
 * tab and an id somebody typed. A posting board illustrated with the default
 * view would be illustrating the one screen that proves nothing.
 *
 * NO DEPENDENCIES. Node 22 ships a WebSocket, and Chrome speaks the DevTools
 * protocol over one, so the whole driver is a socket and a request counter.
 * Adding Playwright to take nine pictures would be a bigger commitment than
 * the pictures are worth.
 *
 * IT SHOOTS THE INSCRIPTION, not a local build, and that is the point. These
 * images go under posts claiming the board is on chain, so the thing
 * photographed has to be the thing on chain. `--local` exists for debugging a
 * shot before spending the network time, and says so in the filename.
 */

import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', '..', 'shots', 'three');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9223;

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const LOCAL = process.argv.includes('--local');
const BOARD = LOCAL ? 'http://localhost:8899/xchess.html' : 'https://xtrata.xyz/i/3014';
const ONLY = arg('only');

/** The tournament these shots are of. */
const TOURNAMENT = 3016;

/**
 * What to photograph, and what each one is for.
 *
 * `settle` is per shot rather than global because the views cost wildly
 * different amounts of network. A tab that renders from memory is ready in a
 * second; the tournament table replays ninety games out of the chain and is
 * not.
 */
const SHOTS = [
  {
    id: 'hero-standings',
    file: '01-standings.png',
    note: 'The table. Ten players, the ladder marked, verified marks per game.',
    width: 1280, height: 1200, settle: 12000,
    drive: `
      // WAIT FOR THE ELEMENT, do not sleep and hope. Every chip on this tab is
      // read from chain, so the list does not exist for the first fifteen
      // seconds or so. The first version clicked 1.5s after opening the tab,
      // found nothing, and produced a screenshot of the chooser rather than the
      // tournament. It failed silently, because a missing chip and an unclicked
      // one look identical in a PNG.
      const waitFor = async (find, ms = 300000) => {
        const until = Date.now() + ms;
        while (Date.now() < until) {
          const found = find();
          if (found) return found;
          await new Promise(r => setTimeout(r, 500));
        }
        return null;
      };
      const tab = await waitFor(() =>
        [...document.querySelectorAll('button,a')].find(el => /tournaments/i.test(el.textContent || '')), 15000);
      if (tab) tab.click();
      const chip = await waitFor(() =>
        [...document.querySelectorAll('button,a,[role=button]')]
          .find(el => (el.textContent || '').includes('${TOURNAMENT}')));
      if (chip) chip.click();
      // And wait for the table itself, so the settle time is a margin rather
      // than the whole plan.
      // FOUR MINUTES, because this is ninety games replayed out of the chain
      // one page at a time. The tab says so on screen while it works. A shot
      // taken before it finishes is a picture of the loading line, which is
      // honest and is not the picture anybody wants.
      await waitFor(() => [...document.querySelectorAll('table')]
        .find(el => /Pts/i.test(el.textContent || '')), 300000);
    `
  },
  {
    id: 'rounds',
    file: '02-rounds.png',
    note: 'Round one, five games, each marked verified. Scrolled to the round list.',
    width: 1280, height: 1500, settle: 12000,
    drive: `
      // WAIT FOR THE ELEMENT, do not sleep and hope. Every chip on this tab is
      // read from chain, so the list does not exist for the first fifteen
      // seconds or so. The first version clicked 1.5s after opening the tab,
      // found nothing, and produced a screenshot of the chooser rather than the
      // tournament. It failed silently, because a missing chip and an unclicked
      // one look identical in a PNG.
      const waitFor = async (find, ms = 300000) => {
        const until = Date.now() + ms;
        while (Date.now() < until) {
          const found = find();
          if (found) return found;
          await new Promise(r => setTimeout(r, 500));
        }
        return null;
      };
      const tab = await waitFor(() =>
        [...document.querySelectorAll('button,a')].find(el => /tournaments/i.test(el.textContent || '')), 15000);
      if (tab) tab.click();
      const chip = await waitFor(() =>
        [...document.querySelectorAll('button,a,[role=button]')]
          .find(el => (el.textContent || '').includes('${TOURNAMENT}')));
      if (chip) chip.click();
      // And wait for the table itself, so the settle time is a margin rather
      // than the whole plan.
      // FOUR MINUTES, because this is ninety games replayed out of the chain
      // one page at a time. The tab says so on screen while it works. A shot
      // taken before it finishes is a picture of the loading line, which is
      // honest and is not the picture anybody wants.
      await waitFor(() => [...document.querySelectorAll('table')]
        .find(el => /Pts/i.test(el.textContent || '')), 300000);
    
      await new Promise(r => setTimeout(r, 3000));
      const round = [...document.querySelectorAll('*')]
        .find(el => /^Round 1$/i.test((el.textContent || '').trim()));
      if (round) round.scrollIntoView({ block: 'start' });
    `
  },
  {
    id: 'game-48',
    file: '03-game48-plumb-oblique.png',
    note: 'Plumb at the bottom of the ladder beating Oblique at the top. The result worth citing.',
    width: 1280, height: 1000, settle: 20000,
    url: `${BOARD}?game=48`
  },
  {
    id: 'game-47',
    file: '04-game47-checkmate.png',
    note: 'A finished game, checkmate on the board, derived by replay rather than stored.',
    width: 1280, height: 1000, settle: 20000,
    url: `${BOARD}?game=47`
  },
  {
    id: 'sheet-fathom',
    file: '07-sheet-fathom.png',
    note: "Fathom's character sheet, read straight off chain. 698 of a 1200 character budget.",
    width: 1000, height: 620, settle: 6000,
    url: 'https://xtrata.xyz/i/3010'
  },
  {
    id: 'play',
    file: '05-play.png',
    note: 'The open board. For the "can I play" reply.',
    width: 1280, height: 900, settle: 8000
  },
  {
    id: 'mobile-standings',
    file: '06-mobile-standings.png',
    note: 'The table on a phone. Same board, no app.',
    width: 390, height: 1100, settle: 12000, mobile: true,
    drive: `
      // WAIT FOR THE ELEMENT, do not sleep and hope. Every chip on this tab is
      // read from chain, so the list does not exist for the first fifteen
      // seconds or so. The first version clicked 1.5s after opening the tab,
      // found nothing, and produced a screenshot of the chooser rather than the
      // tournament. It failed silently, because a missing chip and an unclicked
      // one look identical in a PNG.
      const waitFor = async (find, ms = 300000) => {
        const until = Date.now() + ms;
        while (Date.now() < until) {
          const found = find();
          if (found) return found;
          await new Promise(r => setTimeout(r, 500));
        }
        return null;
      };
      const tab = await waitFor(() =>
        [...document.querySelectorAll('button,a')].find(el => /tournaments/i.test(el.textContent || '')), 15000);
      if (tab) tab.click();
      const chip = await waitFor(() =>
        [...document.querySelectorAll('button,a,[role=button]')]
          .find(el => (el.textContent || '').includes('${TOURNAMENT}')));
      if (chip) chip.click();
      // And wait for the table itself, so the settle time is a margin rather
      // than the whole plan.
      // FOUR MINUTES, because this is ninety games replayed out of the chain
      // one page at a time. The tab says so on screen while it works. A shot
      // taken before it finishes is a picture of the loading line, which is
      // honest and is not the picture anybody wants.
      await waitFor(() => [...document.querySelectorAll('table')]
        .find(el => /Pts/i.test(el.textContent || '')), 300000);
    `
  }
];

/** One CDP connection, one counter, no library. */
async function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let next = 1;
  await new Promise((ok, fail) => {
    socket.addEventListener('open', ok, { once: true });
    socket.addEventListener('error', () => fail(new Error('could not open a debug socket')), { once: true });
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const waiting = pending.get(message.id);
    if (!waiting) return;
    pending.delete(message.id);
    message.error ? waiting.fail(new Error(message.error.message)) : waiting.ok(message.result);
  });
  const send = (method, params = {}) =>
    new Promise((ok, fail) => {
      const id = next++;
      pending.set(id, { ok, fail });
      socket.send(JSON.stringify({ id, method, params }));
    });
  return { send, close: () => socket.close() };
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function main() {
  mkdirSync(OUT, { recursive: true });
  const shots = ONLY ? SHOTS.filter((s) => s.id === ONLY) : SHOTS;
  if (!shots.length) {
    console.log(`\nNo shot called "${ONLY}". Try: ${SHOTS.map((s) => s.id).join(', ')}\n`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nshooting ${BOARD}`);
  console.log(`tournament ${TOURNAMENT}, ${shots.length} shot(s) into shots/three/\n`);

  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/xchess-shots-profile', 'about:blank'
  ], { stdio: 'ignore' });

  // The port is not open the instant the process is.
  let version = null;
  for (let tries = 0; tries < 40 && !version; tries++) {
    await sleep(250);
    try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { /* not yet */ }
  }
  if (!version) { chrome.kill(); throw new Error('Chrome never opened its debug port'); }

  const cdp = await connect(version.webSocketDebuggerUrl);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const call = async (method, params = {}) => {
    const socketMessage = { method, params, sessionId };
    return cdp.send(method, params).catch(() => null) ?? socketMessage;
  };

  // Flat sessions need the id on every message, which the tiny client above
  // does not thread through. Simpler to talk to the page target directly.
  cdp.close();
  const pageWs = `ws://127.0.0.1:${PORT}/devtools/page/${targetId}`;
  const page = await connect(pageWs);

  for (const shot of shots) {
    process.stdout.write(`  ${shot.file.padEnd(34)}`);
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: shot.width, height: shot.height, deviceScaleFactor: 2,
      mobile: Boolean(shot.mobile)
    });
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Page.navigate', { url: shot.url ?? BOARD });
    await sleep(4000);

    if (shot.drive) {
      await page.send('Runtime.evaluate', {
        expression: `(async () => { ${shot.drive} })()`,
        awaitPromise: true, returnByValue: true
      }).catch(() => null);
    }
    await sleep(shot.settle);

    const { data } = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const target = join(OUT, LOCAL ? shot.file.replace('.png', '-local.png') : shot.file);
    writeFileSync(target, Buffer.from(data, 'base64'));
    console.log(`${(Buffer.from(data, 'base64').length / 1024).toFixed(0).padStart(5)} KB`);
  }

  page.close();
  chrome.kill();
  console.log(`\nWritten to ${OUT}\n`);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exitCode = 1;
});
