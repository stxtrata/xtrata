#!/usr/bin/env node
/**
 * Put the 1,000 free players on the wall (xtrata.xyz/players), checking every step.
 *
 *   node scripts/load-players-wall.mjs                 check only: reads the links and the wall, changes nothing
 *   node scripts/load-players-wall.mjs --go            load them (the wall must be empty)
 *   node scripts/load-players-wall.mjs --go --archive-old   first close the drop that is on the wall now (the test players)
 *   node scripts/load-players-wall.mjs --go --continue      carry on after a run that stopped part-way (never archives)
 *
 * The links come from the clipboard ("Copy the 1,000 links" in the radio's admin panel), or from --file <path>.
 * The operator secret is read from ~/.xtrata-giveaway-secret (or --secret-file <path>). Neither is ever printed:
 * a problem is reported by position (1 = first link), as the server does.
 *
 * What it does with --go, stopping at the first thing that is not as expected:
 *   1. pause the wall, so nobody can pick from a half-loaded one
 *   2. (--archive-old only) close the old drop
 *   3. shuffle the links here with a secure random source, and add them in chunks; every chunk must be accepted whole
 *   4. read the wall back: 1,000 spots, all free, and the mix 5 / 10 / 20 / 100 / 865
 *   5. open the wall again
 * If it stops, the wall stays paused. Fix what it says and run again with --go --continue.
 *
 * Why the shuffle is done here: spot numbers follow the order links arrive in, and the server shuffles only within
 * one call. Shuffling everything first keeps the classes spread evenly however many calls it takes.
 */
import { execFileSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SITE = 'https://xtrata.xyz';
export const LIST = 'players';
/** The drop (src/lib/listening-wallet/tiers.ts SUGGESTED_DROP; a test keeps the two the same). */
export const MIX = [
  { name: 'Diamond', plays: 1000, count: 5 },
  { name: 'Gold', plays: 500, count: 10 },
  { name: 'Silver', plays: 250, count: 20 },
  { name: 'Bronze', plays: 100, count: 100 },
  { name: 'Classic', plays: 50, count: 865 }
];
export const TOTAL = MIX.reduce((a, t) => a + t.count, 0);

/** Every gift code in a blob of text: full links or bare 22-character codes (the same rule as the server's). */
export function codesIn(text) {
  const out = [], seen = new Set();
  for (const m of text.matchAll(/gift=([A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])|(?<![A-Za-z0-9_=-])([A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])/g)) {
    const code = m[1] ?? m[2];
    if (!seen.has(code)) { seen.add(code); out.push(code); }
  }
  return out;
}

export function shuffled(list, rand = randomInt) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const chunks = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));

/** What is wrong with the public wall, or null when it is exactly the drop. */
export function wallProblem(wall, { allowClaimed = false } = {}) {
  if (!wall || typeof wall.total !== 'number') return 'the wall could not be read';
  if (wall.total !== TOTAL) return `the wall has ${wall.total} spots, not ${TOTAL}`;
  const gone = wall.total - wall.free - wall.held - wall.claimed;
  if (gone) return `${gone} spots are no longer available`;
  if (!allowClaimed && (wall.claimed || wall.held)) return `${wall.claimed} already claimed and ${wall.held} being claimed`;
  if (!Array.isArray(wall.tiers)) return 'the wall does not say what the classes are';
  for (const t of MIX) {
    const got = wall.tiers.find((x) => x.plays === t.plays)?.total ?? 0;
    if (got !== t.count) return `${got} ${t.name} players on the wall, not ${t.count}`;
  }
  const other = wall.tiers.filter((x) => !MIX.some((t) => t.plays === x.plays));
  if (other.length) return `${other.reduce((a, x) => a + x.total, 0)} players of a size that is not in the drop`;
  return null;
}

class Stop extends Error {}

/**
 * The whole run. `io` is everything it touches: { admin(body) → json, wall() → json, say(line), wait(ms) }.
 * Returns true when the wall holds the drop and is open.
 */
export async function run({ codes, go = false, archiveOld = false, carryOn = false, chunk = 100, expect = TOTAL }, io) {
  const { say } = io;
  const step = (text) => say(`\n— ${text}`);
  try {
    step('The links');
    if (codes.length !== expect) throw new Stop(`Found ${codes.length} different links; the drop is ${expect}. Copy them again from the admin panel ("Copy the ${expect.toLocaleString('en-GB')} links").`);
    say(`ok    ${codes.length} different links`);

    step('The wall now');
    const before = await io.admin({ action: 'status', list: LIST });
    if (!before || before.wall !== true) throw new Stop('The server did not answer as the players wall. Is the secret right?');
    say(`ok    ${before.total} spots: ${before.free} free, ${before.held} being claimed, ${before.claimed} claimed, ${before.gone} gone${before.paused ? ' · paused' : ''}`);
    if (before.total > 0 && !archiveOld && !carryOn) {
      throw new Stop(`The wall already holds ${before.total} spots. To close that drop first, add --archive-old. To carry on a load that stopped part-way, add --continue.`);
    }
    if (archiveOld && carryOn) throw new Stop('Use --archive-old or --continue, not both.');
    if (!go) { say('\nCheck only: nothing was changed. Run again with --go to load.'); return false; }

    step('Pause the wall');
    const paused = await io.admin({ action: 'pause', list: LIST });
    if (!paused?.paused) throw new Stop('The wall did not pause.');
    say('ok    paused');

    if (archiveOld && before.total > 0) {
      step('Close the old drop');
      const a = await io.admin({ action: 'archive', list: LIST });
      if (a?.total !== 0) throw new Stop(`The old drop did not close: the wall still has ${a?.total} spots.`);
      say(`ok    ${a.archived} old spots archived (${a.withdrawn} withdrawn unclaimed; their money goes back when they run out)`);
    }

    step(`Add ${codes.length} links in a random order`);
    const order = shuffled(codes);
    let added = 0, already = 0, at = 0;
    for (const part of chunks(order, chunk)) {
      const r = await io.admin({ action: 'add', list: LIST, text: part.join('\n') });
      const bad = [...(r?.notFound ?? []), ...(r?.notLive ?? [])];
      if (!r || typeof r.added !== 'number') throw new Stop(`The server did not accept links ${at + 1}-${at + part.length}. The wall is still paused; run again with --go --continue.`);
      if (bad.length || r.added + r.duplicates !== part.length) {
        throw new Stop(`Links ${at + 1}-${at + part.length}: ${r.added} added, ${r.duplicates} already there, ${r.notFound?.length ?? 0} not known to the server, ${r.notLive?.length ?? 0} not live (not paid for yet, claimed or expired). Every batch must be live before loading. The wall is still paused.`);
      }
      if (!carryOn && r.duplicates) throw new Stop(`Links ${at + 1}-${at + part.length}: ${r.duplicates} were already on a wall. The wall is still paused.`);
      added += r.added; already += r.duplicates; at += part.length;
      say(`ok    ${at} of ${order.length}${r.duplicates ? ` (${r.duplicates} were already there)` : ''}`);
    }
    say(`ok    ${added} added${already ? `, ${already} already there` : ''}`);

    step('Read the wall back');
    await io.wait(4000); // the public answer is reused for three seconds
    const wall = await io.wall();
    const problem = wallProblem(wall, { allowClaimed: carryOn });
    if (problem) throw new Stop(`Not right yet: ${problem}. The wall is still paused.`);
    say(`ok    ${wall.total} spots, ${wall.free} free: ${MIX.map((t) => `${t.count} ${t.name}`).join(', ')}`);

    step('Open the wall');
    const open = await io.admin({ action: 'resume', list: LIST });
    if (open?.paused) throw new Stop('The wall did not open again.');
    say(`ok    open\n\nDone. ${SITE}/players shows the ${TOTAL.toLocaleString('en-GB')} players.`);
    return true;
  } catch (e) {
    if (!(e instanceof Stop)) throw e;
    say(`STOP  ${e.message}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name) => args.includes(name);
  const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  let secret;
  try { secret = readFileSync(value('--secret-file') ?? join(homedir(), '.xtrata-giveaway-secret'), 'utf8').trim(); }
  catch { console.error('Could not read the operator secret (~/.xtrata-giveaway-secret).'); process.exit(1); }
  if (secret.length < 24) { console.error('The operator secret looks wrong (too short).'); process.exit(1); }
  let text;
  try { text = value('--file') ? readFileSync(value('--file'), 'utf8') : execFileSync('pbpaste', { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }); }
  catch { console.error('Could not read the links (clipboard, or --file <path>).'); process.exit(1); }
  const io = {
    say: (line) => console.log(line),
    wait: (ms) => new Promise((r) => setTimeout(r, ms)),
    admin: async (body) => {
      const r = await fetch(`${SITE}/radio/giveaway/admin`, { method: 'POST', headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (r.status === 404) return null; // wrong secret looks like no such page
      return r.json().catch(() => null);
    },
    wall: async () => (await fetch(`${SITE}/radio/giveaway/${LIST}?t=${Date.now()}`)).json().catch(() => null)
  };
  const ok = await run({
    codes: codesIn(text), go: flag('--go'), archiveOld: flag('--archive-old'), carryOn: flag('--continue'),
    chunk: Number(value('--chunk') ?? 100), expect: Number(value('--expect') ?? TOTAL)
  }, io);
  process.exit(ok || !flag('--go') ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e) => { console.error('Stopped:', String(e?.message || e).slice(0, 200)); process.exit(1); });
