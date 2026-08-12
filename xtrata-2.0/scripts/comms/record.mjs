#!/usr/bin/env node
//
// Records what actually went out, and archives it.
//
//   node scripts/comms/record.mjs --date 2026-08-11 --ids 2026-08-11-ft-a,2026-08-11-sdk-a
//   node scripts/comms/record.mjs --paste          # reads the canary export from stdin
//   node scripts/comms/record.mjs --ids a --url a=https://x.com/XtrataLayers/status/123
//   node scripts/comms/record.mjs --thread ft-quiet-death   # a whole thread at once
//
// Three things happen, and all three matter:
//
//   1. comms/journal/index.jsonl   one line per post. The index every cooldown
//                                  and no-repeat check greps.
//   2. comms/archive/<date>.json   the full post: text, the image actually
//                                  used, the reply target, the facts it cited.
//                                  The index says a thing was said. The archive
//                                  says exactly what was said, which is what
//                                  you need when somebody quotes it back.
//   3. the queue is marked          so refresh.mjs drops it and the canary
//                                  shows it as posted on any machine, rather
//                                  than relying on a browser tick that dies
//                                  with the profile.
//
// Append only. Existing journal lines are never rewritten, because the value of
// the record is that it is what happened rather than what we would now prefer
// had happened.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const rel = (p) => fileURLToPath(new URL(p, root));

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const DATE = flag('date', new Date().toISOString().slice(0, 10));
const JOURNAL = rel('comms/journal/index.jsonl');
const POSTED_AT = new Date().toISOString();

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
};

const loadJournal = () => {
  if (!existsSync(JOURNAL)) return [];
  return readFileSync(JOURNAL, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
};

const firstLine = (text) => String(text).split('\n')[0].trim();

const main = async () => {
  const queuePath = rel(`comms/queue/${DATE}.json`);
  if (!existsSync(queuePath)) {
    console.error(`No queue at comms/queue/${DATE}.json`);
    process.exit(1);
  }
  const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
  const posts = queue.posts ?? [];
  const byId = Object.fromEntries(posts.map((p) => [p.id, p]));

  let ids = [];
  const chosenImages = {};

  if (args.includes('--paste')) {
    const parsed = JSON.parse(await readStdin());
    for (const entry of parsed.posted ?? []) {
      ids.push(entry.id);
      // The canary marks an image used when it is copied, and reports the list
      // here, so the archive records the pictures that actually went out rather
      // than the default candidate. Accepts the older single-image shape too.
      const images = entry.images ?? (entry.image ? [entry.image] : []);
      if (images.length) chosenImages[entry.id] = images;
    }
  } else if (flag('thread', null)) {
    const thread = flag('thread', null);
    ids = posts.filter((p) => p.thread === thread).map((p) => p.id);
    if (!ids.length) {
      console.error(`No posts in thread "${thread}" on ${DATE}.`);
      process.exit(1);
    }
    console.log(`thread "${thread}": ${ids.length} posts`);
  } else {
    ids = String(flag('ids', '')).split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (!ids.length) {
    console.error('Nothing to record.');
    console.error('Pass --ids a,b, or --thread <id>, or pipe the canary export with --paste.');
    process.exit(1);
  }

  const urls = {};
  args.forEach((arg, i) => {
    if (arg === '--url' && args[i + 1]) {
      const [id, ...rest] = args[i + 1].split('=');
      urls[id] = rest.join('=');
    }
  });

  const existing = new Set(loadJournal().map((e) => e.id));
  const lines = [];
  const archived = [];
  const skipped = [];

  for (const id of ids) {
    if (existing.has(id)) {
      skipped.push(`${id} (already in the journal)`);
      continue;
    }
    const post = byId[id];
    if (!post) {
      skipped.push(`${id} (not in the queue)`);
      continue;
    }
    if (post.verified === 'unverified') {
      skipped.push(`${id} (still marked unverified: ${post.verifyNote || 'no note'})`);
      continue;
    }

    // No pick recorded means no image was copied from the board, which most
    // likely means the post went out as text. That is recorded as empty rather
    // than being backfilled with the default candidate, because guessing here
    // puts a picture in the permanent record that may never have been posted.
    const imagesUsed = chosenImages[id] ?? [];

    lines.push(
      JSON.stringify({
        id: post.id,
        date: DATE,
        surface: post.surface ?? null,
        angle: post.angle ?? null,
        category: post.category ?? 'standalone',
        thread: post.thread ?? null,
        hook: firstLine(post.text),
        chars: [...post.text].length,
        signals: post.signals ?? [],
        url: urls[id] ?? null,
        metrics: null
      })
    );

    archived.push({
      ...post,
      postedAt: POSTED_AT,
      postedUrl: urls[id] ?? null,
      imagesUsed,
      // The full candidate list is not worth keeping once one was chosen, but
      // which options existed is occasionally the answer to "why did we use
      // that picture", so keep them by path alone.
      imageOptions: (post.images ?? []).map((i) => i.path)
    });

    post.posted = true;
    post.postedAt = POSTED_AT;
    post.postedUrl = urls[id] ?? null;
    post.imagesUsed = imagesUsed;
  }

  if (lines.length) {
    mkdirSync(dirname(JOURNAL), { recursive: true });
    appendFileSync(JOURNAL, `${lines.join('\n')}\n`);

    const archivePath = rel(`comms/archive/${DATE}.json`);
    mkdirSync(dirname(archivePath), { recursive: true });
    const archive = existsSync(archivePath)
      ? JSON.parse(readFileSync(archivePath, 'utf8'))
      : { date: DATE, posted: [] };
    const already = new Set(archive.posted.map((p) => p.id));
    archive.posted.push(...archived.filter((p) => !already.has(p.id)));
    writeFileSync(archivePath, `${JSON.stringify(archive, null, 2)}\n`);

    writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
  }

  console.log(`recorded ${lines.length} post(s)`);
  if (lines.length) {
    console.log(`  comms/journal/index.jsonl   (index)`);
    console.log(`  comms/archive/${DATE}.json  (full text and image used)`);
    console.log(`  comms/queue/${DATE}.json    (marked posted)`);
  }
  if (skipped.length) {
    console.log('\nskipped:');
    skipped.forEach((s) => console.log(`  ${s}`));
    console.log('\nAn unverified post that really did go out should have its claim');
    console.log('resolved in the queue file first, then be recorded.');
  }
  if (lines.length) console.log('\nrebuild the board: npm run comms:canary');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
