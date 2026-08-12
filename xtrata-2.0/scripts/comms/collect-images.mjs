#!/usr/bin/env node
//
// Gives every queued post at least one image to choose from.
//
//   npm run comms:images
//   npm run comms:images -- --date 2026-08-11 --force
//
// Three sources, in descending order of how much they are worth:
//
//   curated  a real screenshot somebody framed on purpose, listed in the
//            registry. Always the best option when one exists.
//   capture  a fresh headless screenshot of the live surface, taken now, so it
//            shows what a reader would actually land on today.
//   card     a generated card carrying the post's own leading line. The
//            fallback that guarantees no post goes out bare.
//
// Writes into comms/assets/<date>/ and then rewrites the queue file so each
// post carries an `images` array. Existing files are reused unless --force,
// because re-shooting eight live pages on every run is slow and pointless.
//
// A capture that fails is recorded as a failure and the post keeps its other
// candidates. It never silently yields a post with no image.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { captureHtml, captureUrl, closeBrowser, TWEET_HEIGHT, TWEET_WIDTH } from './lib/render.mjs';
import { quoteCard, statCard } from './lib/cards.mjs';

const root = new URL('../../', import.meta.url);
const rel = (p) => fileURLToPath(new URL(p, root));

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const DATE = flag('date', new Date().toISOString().slice(0, 10));
const FORCE = args.includes('--force');
const NO_CAPTURE = args.includes('--no-capture');

const queuePath = rel(`comms/queue/${DATE}.json`);
if (!existsSync(queuePath)) {
  console.error(`No queue at comms/queue/${DATE}.json`);
  process.exit(1);
}

const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
const registry = JSON.parse(readFileSync(rel('comms/registry/surfaces.json'), 'utf8'));
const surfaceById = Object.fromEntries(registry.surfaces.map((s) => [s.id, s]));

const signalsPath = rel(`comms/signals/${DATE}.json`);
const signals = existsSync(signalsPath) ? JSON.parse(readFileSync(signalsPath, 'utf8')) : null;

const ASSET_DIR = `comms/assets/${DATE}`;
mkdirSync(rel(ASSET_DIR), { recursive: true });

const log = [];
const note = (line) => {
  log.push(line);
  console.log(line);
};

const sizeOf = (p) => (existsSync(rel(p)) ? statSync(rel(p)).size : 0);

// ------------------------------------------------------------------- captures

// One capture per surface, shared by every post on it. Shooting the same page
// once per post would multiply both the run time and the canary's weight for
// no gain, since the picture is identical.
const captureCache = new Map();

const captureSurface = async (surface) => {
  if (!surface?.capture?.url) return null;
  if (captureCache.has(surface.id)) return captureCache.get(surface.id);

  const outRel = `${ASSET_DIR}/capture-${surface.id}.jpg`;
  const out = rel(outRel);

  // --no-capture skips the network, not the result. Re-forcing card layout
  // should never quietly strip a capture that is already on disk.
  if (existsSync(out) && (!FORCE || NO_CAPTURE)) {
    const hit = {
      id: `capture-${surface.id}`,
      path: outRel,
      kind: 'capture',
      label: `${surface.capture.label ?? 'Live page'}, captured earlier today`,
      source: surface.capture.url
    };
    captureCache.set(surface.id, hit);
    return hit;
  }

  if (NO_CAPTURE) {
    captureCache.set(surface.id, null);
    return null;
  }

  const result = await captureUrl(surface.capture.url, out, {
    width: TWEET_WIDTH,
    height: TWEET_HEIGHT,
    // Screenshots go out at exactly the size X displays them. Retina doubles
    // the file for pixels the timeline throws away.
    scale: 1,
    // Generous, because the settle is now a timer rather than a network signal
    // and these pages reconstruct their content from the chain after load.
    waitMs: surface.capture.waitMs ?? 4000,
    waitUntil: surface.capture.waitUntil ?? 'domcontentloaded',
    actions: surface.capture.actions
  });

  if (!result.ok) {
    note(`  capture FAILED ${surface.id}: ${result.error}`);
    captureCache.set(surface.id, null);
    return null;
  }
  // A capture whose click steps silently failed is a picture of the wrong
  // screen, which is worse than a missing one because it looks fine.
  for (const warning of result.warnings ?? []) note(`  ${surface.id}: ${warning}`);

  const candidate = {
    id: `capture-${surface.id}`,
    path: outRel,
    kind: 'capture',
    label: `${surface.capture.label ?? 'Live page'}, captured ${DATE}`,
    source: surface.capture.url
  };
  captureCache.set(surface.id, candidate);
  note(`  captured ${surface.id} (${Math.round(result.bytes / 1024)} KB)`);
  return candidate;
};

// ---------------------------------------------------------------- stat cards

// Only surfaces with harvested numbers get one, and the numbers are read from
// the signals file rather than passed in, so a stat card cannot contain a
// figure that was never checked.
// Cached like captures. One card per surface, not one per post that mentions it.
const statCache = new Map();

const statCardFor = async (surfaceId) => {
  if (statCache.has(surfaceId)) return statCache.get(surfaceId);
  const result = await buildStatCard(surfaceId);
  statCache.set(surfaceId, result);
  return result;
};

const buildStatCard = async (surfaceId) => {
  const xchess = signals?.chain?.xchess;
  if (surfaceId !== 'x-chess' || !xchess?.ok) return null;

  const v = xchess.value;
  // "signed transactions" and not "moves". next-seq counts submissions, and
  // the app itself reports that some did not count as moves while still being
  // stored on chain and still costing their sender a fee. Every submission is
  // a transaction, so that phrasing is exactly true and happens to make the
  // better point anyway.
  const stats = [
    { value: String(v.gameCount ?? '?'), label: 'games opened' },
    ...(v.movesComplete ? [{ value: String(v.movesTotal), label: 'signed transactions' }] : []),
    { value: String(v.rankedCount ?? '?'), label: 'ranked' }
  ];

  const outRel = `${ASSET_DIR}/stat-x-chess.png`;
  if (existsSync(rel(outRel)) && !FORCE) {
    return {
      id: 'stat-x-chess',
      path: outRel,
      kind: 'card',
      label: 'Stat card from today signals',
      source: 'generated'
    };
  }

  const result = await captureHtml(
    statCard({
      title: 'X Chess, live on Bitcoin',
      stats,
      url: 'xtrata.xyz/i/2988',
      footnote: `read from the contract on ${DATE}`
    }),
    rel(outRel),
    { width: TWEET_WIDTH, height: TWEET_HEIGHT, scale: 2 }
  );

  if (!result.ok) {
    note(`  stat card FAILED x-chess: ${result.error}`);
    return null;
  }
  note(`  generated stat card x-chess (${Math.round(result.bytes / 1024)} KB)`);
  return {
    id: 'stat-x-chess',
    path: outRel,
    kind: 'card',
    label: 'Stat card from today signals',
    source: 'generated'
  };
};

// --------------------------------------------------------------- quote cards

const quoteCardFor = async (post, surface) => {
  const outRel = `${ASSET_DIR}/quote-${post.id}.png`;
  const candidate = {
    id: `quote-${post.id}`,
    path: outRel,
    kind: 'card',
    label: 'Generated card of the leading line',
    source: 'generated'
  };
  if (existsSync(rel(outRel)) && !FORCE) return candidate;

  const result = await captureHtml(
    quoteCard({
      text: post.text,
      surface: surface?.name ?? 'Xtrata',
      url: (surface?.url ?? 'https://xtrata.xyz').replace(/^https?:\/\//, '')
    }),
    rel(outRel),
    { width: TWEET_WIDTH, height: TWEET_HEIGHT, scale: 2 }
  );

  if (!result.ok) {
    note(`  quote card FAILED ${post.id}: ${result.error}`);
    return null;
  }
  return candidate;
};

// --------------------------------------------------------------------- main

const main = async () => {
  const posts = queue.posts ?? [];
  note(`collecting images for ${posts.length} posts on ${DATE}`);

  let withImages = 0;
  let bare = 0;

  for (const post of posts) {
    const surface = surfaceById[post.surface];
    const candidates = [];
    const seen = new Set();

    const add = (c) => {
      if (!c || seen.has(c.path)) return;
      // A curated path that does not exist is a registry bug, and silently
      // dropping it is how it stays a bug.
      if (c.kind === 'curated' && !existsSync(rel(c.path)) && !existsSync(rel(`../${c.path}`))) {
        note(`  missing curated asset for ${post.id}: ${c.path}`);
        return;
      }
      seen.add(c.path);
      candidates.push(c);
    };

    // 1. Whatever the draft already picked by hand wins the default slot.
    if (post.image) {
      add({
        id: 'chosen',
        path: post.image,
        kind: 'curated',
        label: 'Chosen in the draft',
        source: 'repo'
      });
    }

    // 2. Curated art, angle-specific first because it was chosen for this
    //    argument rather than for the product in general.
    const angle = surface?.angles?.find((a) => a.id === post.angle);
    for (const p of angle?.curated ?? []) {
      add({ id: `curated-${p}`, path: p, kind: 'curated', label: `Curated for ${post.angle}`, source: 'repo' });
    }
    for (const p of surface?.curated ?? []) {
      add({ id: `curated-${p}`, path: p, kind: 'curated', label: `Curated for ${surface.name}`, source: 'repo' });
    }

    // 3. What the page looks like right now.
    add(await captureSurface(surface));

    // 4. Numbers, where they exist and are complete.
    add(await statCardFor(post.surface));

    // 5. The guaranteed fallback. Replies are excluded on purpose: an image
    //    stapled to a reply in somebody else's thread reads as an ad.
    if (post.category !== 'reply') {
      add(await quoteCardFor(post, surface));
    }

    post.images = candidates;
    // Keep `image` as the default pick so anything reading the old field, and
    // anyone skimming the JSON, still sees one sensible choice.
    post.image = candidates[0]?.path ?? null;

    if (candidates.length) withImages += 1;
    else {
      bare += 1;
      note(`  no image options for ${post.id}`);
    }
  }

  writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
  await closeBrowser();

  const unique = new Set(posts.flatMap((p) => (p.images ?? []).map((i) => i.path)));
  const totalBytes = [...unique].reduce((sum, p) => sum + sizeOf(p), 0);

  console.log(`\n${withImages}/${posts.length} posts have image options.`);
  if (bare) console.log(`${bare} post(s) have none. Those are replies unless something failed.`);
  console.log(`${unique.size} distinct images, ${Math.round(totalBytes / 1024)} KB total.`);
  console.log(`\nqueue updated: comms/queue/${DATE}.json`);
  console.log('now run: npm run comms:canary');
};

main().catch(async (error) => {
  await closeBrowser();
  console.error(error);
  process.exit(1);
});
