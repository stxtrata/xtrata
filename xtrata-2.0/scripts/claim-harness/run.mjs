#!/usr/bin/env node
// Claim-flow harness: runs every scenario in a real browser (virtual passkey, mocked server and chain, nothing
// signed or broadcast), measures the friction, and compares it with the committed baseline.
//
//   node scripts/claim-harness/run.mjs                 run all scenarios, print the scoreboard, fail on regressions
//   node scripts/claim-harness/run.mjs first-claim     run the named scenarios only
//   node scripts/claim-harness/run.mjs --update-baseline   accept the numbers as the new baseline (only if nothing got worse)
//   node scripts/claim-harness/run.mjs --force-baseline    accept even when something got worse (say why in LOG.md)
//   node scripts/claim-harness/run.mjs --shots             keep a screenshot of where each run ended
//
// Needs: VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
// and a Chromium (set CHROME_PATH, or `npx playwright install chromium`).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startWorld, addAuthenticator, makeMock } from './lib/world.mjs';
import { person, walletFrame } from './lib/person.mjs';
import { measure, LOWER_IS_BETTER } from './lib/measure.mjs';
import { scenarios } from './scenarios/index.mjs';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const wanted = args.filter((a) => !a.startsWith('--'));
const dir = fileURLToPath(new URL('./', import.meta.url));
const baselinePath = dir + 'baseline.json';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = dir + 'results/' + stamp + '/';
await mkdir(outDir, { recursive: true });

async function runScenario(sc) {
  const events = []; const t0 = Date.now();
  const record = (e) => events.push({ t: Date.now() - t0, ...e });
  const mock = makeMock();
  const world = await startWorld({ device: sc.device, mock, record });
  const page = await world.context.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push(e.message));
  const auth = await addAuthenticator(world.context, page, record);
  if (sc.ui === 'albumpage') await world.context.addInitScript(() => { try { localStorage.setItem('xtrata.radio.albumpage', '1'); } catch { /* ignore */ } });
  const env = {
    world, page, auth, record, mock,
    mark: (label) => record({ kind: 'mark', label }),
    frame: () => walletFrame(page),
    /** Open a gift link and do the obvious thing until music can play. Returns whether it could. */
    async claim(link = world.link, hooks = {}) {
      // A new link is a new visit (tapped in a tweet or message), not a hash change inside the page that is open.
      if (page.url().startsWith('https://radio.')) await page.goto('about:blank');
      await page.goto(link);
      await page.waitForTimeout(1500);
      // Done means THIS gift was claimed and its album can be played, not that some earlier album still is.
      const before = mock.claims.length;
      const p = person({ page, context: world.context, auth, record, hooks, goal: () => mock.claims.length > before });
      const ok = await p.run();
      return ok;
    },
    /** The device refuses the next passkey sign-in once, exactly as the browser reports a cancelled or timed-out prompt. */
    async failNextPasskeyPrompt() {
      const f = await walletFrame(page);
      await f.evaluate(() => {
        const real = navigator.credentials.get.bind(navigator.credentials);
        navigator.credentials.get = async () => { navigator.credentials.get = real; throw new DOMException('The operation either timed out or was not allowed.', 'NotAllowedError'); };
      });
      record({ kind: 'mark', label: 'prompt-will-fail-once' });
    },
    /** What clearing site data, or arriving from a different browser on the same phone, does to the wallet box. */
    async clearWalletStorage() {
      const f = await walletFrame(page);
      await f?.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* ignore */ } });
      await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* ignore */ } });
      record({ kind: 'mark', label: 'site-data-cleared' });
    }
  };
  let error = null;
  try { await sc.run(env); } catch (e) { error = String(e?.message || e); }
  const last = [...events].reverse().find((e) => e.kind === 'playable' || e.kind === 'gave-up');
  // "Playable" must be true at the END of the scenario, for the last album claimed.
  const ok = last?.kind === 'playable';
  const result = measure(events, { playable: ok, claims: mock.claims.length });
  // Where the person ended up, in words: the first thing to read when a scenario does not do what it should.
  const endText = await page.evaluate(() => (document.querySelector('#ppp')?.innerText ?? '').replace(/\s*\n+\s*/g, ' | ').slice(0, 500)).catch(() => '');
  if (flag('--shots')) await page.screenshot({ path: outDir + sc.name + '.png' }).catch(() => {});
  await world.browser.close();
  return { name: sc.name, why: sc.why, ...result, error, endText, pageErrors: [...new Set(problems)].slice(0, 5), events };
}

// Scenarios are independent (own browser, own mock), so run a few at once.
const chosen = scenarios.filter((s) => !wanted.length || wanted.includes(s.name));
const run = new Array(chosen.length);
let next = 0;
const worker = async () => {
  while (next < chosen.length) {
    const i = next++;
    const r = await runScenario(chosen[i]);
    run[i] = r;
    console.log(`· ${r.name.padEnd(34)} ${r.playable ? 'playable    ' : 'NOT PLAYABLE'}  taps ${String(r.taps).padStart(2)}  prompts ${r.prompts}  passkeys ${r.passkeys}  jargon ${r.jargon}${r.passkeys > 1 ? '  ← DUPLICATE' : ''}${r.error ? '  ERROR ' + r.error : ''}`);
    if (flag('--diag')) console.log('    ended: ' + r.endText + (r.pageErrors.length ? '\n    page errors: ' + r.pageErrors.join(' ; ') : ''));
  }
};
await Promise.all(Array.from({ length: Math.min(Number(process.env.CLAIM_HARNESS_JOBS || 4), chosen.length) }, worker));
await writeFile(outDir + 'run.json', JSON.stringify(run, null, 2));

// ---- scoreboard against the baseline
let baseline = {};
try { baseline = JSON.parse(await readFile(baselinePath, 'utf8')).scenarios ?? {}; } catch { /* first run */ }
// The ratchet. Hard rules (fail the run): never more passkeys, never less playable, never a worse total score for a
// scenario. Everything else (taps, prompts, panels) is reported as a trade-off: fine when the score still fell, but
// say why in LOG.md.
const worse = [], tradeoffs = [], better = [], open = [];
const HARD = ['passkeys', 'score'];
for (const r of run) {
  const b = baseline[r.name];
  if (r.passkeys > 1) open.push(`${r.name}: ${r.passkeys} passkeys made for one person`);
  if (!r.playable) open.push(`${r.name}: never reached playable music`);
  if (!b) continue;
  for (const k of LOWER_IS_BETTER) {
    if (r[k] > b[k]) (HARD.includes(k) ? worse : tradeoffs).push(`${r.name}: ${k} ${b[k]} → ${r[k]}`);
    else if (r[k] < b[k]) better.push(`${r.name}: ${k} ${b[k]} → ${r[k]}`);
  }
  if (b.playable && !r.playable) worse.push(`${r.name}: no longer reaches playable music`);
}
console.log('\nOpen problems (what to fix next):');
console.log(open.length ? open.map((o) => '  ✗ ' + o).join('\n') : '  none');
if (better.length) console.log('\nBetter than baseline:\n' + better.map((o) => '  ↑ ' + o).join('\n'));
if (tradeoffs.length) console.log('\nTrade-offs (allowed while the score still fell; explain in LOG.md):\n' + tradeoffs.map((o) => '  ~ ' + o).join('\n'));
if (worse.length) console.log('\nWORSE than baseline (fails the run):\n' + worse.map((o) => '  ↓ ' + o).join('\n'));
console.log(`\nTotal friction score: ${run.reduce((n, r) => n + r.score, 0)}  (lower is better)   details: ${outDir}run.json`);

if (flag('--update-baseline') || flag('--force-baseline')) {
  if (worse.length && !flag('--force-baseline')) { console.log('\nBaseline NOT updated: something got worse. Fix it, or use --force-baseline and say why in LOG.md.'); process.exit(1); }
  const next = { ...baseline };
  for (const r of run) next[r.name] = Object.fromEntries(['taps', 'prompts', 'passkeys', 'panels', 'jargon', 'score', 'playable'].map((k) => [k, r[k]]));
  await writeFile(baselinePath, JSON.stringify({ updated: new Date().toISOString(), scenarios: next }, null, 2) + '\n');
  console.log('Baseline updated.');
} else if (worse.length) process.exit(1);
