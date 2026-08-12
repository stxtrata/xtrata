#!/usr/bin/env node
//
// Carries yesterday's unposted drafts into today, and re-checks them against
// this morning's signals.
//
//   npm run comms:refresh
//   npm run comms:refresh -- --date 2026-08-12 --from 2026-08-11
//
// Run this FIRST in the daily pass, after comms:signals and before drafting.
// It answers the question the drafting step should not have to ask: of
// everything already written, what is still true, what has gone stale, and what
// has already gone out.
//
// Three things happen to a carried draft:
//
//   posted     it is in journal/index.jsonl, so it is dropped from the live
//              queue. It lives in comms/archive/ now.
//   drifted    a number it cites has moved. It is carried but forced back to
//              unverified with a note naming the old and new values, so it
//              cannot be approved until somebody rewrites the line.
//   expired    it has been carried MAX_CARRY_DAYS without going out. Dropped,
//              and the drop is reported. A draft nobody has posted in a week is
//              not going to be posted.
//
// Nothing is ever silently deleted. Every drop is printed and belongs in the
// day's journal entry.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { checkFacts, describeDrift } from './lib/facts.mjs';

const root = new URL('../../', import.meta.url);
const rel = (p) => fileURLToPath(new URL(p, root));

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const DATE = flag('date', new Date().toISOString().slice(0, 10));
const DRY = args.includes('--dry');

// A draft that has survived a week of daily review is not waiting for its
// moment, it is being avoided. Say so and clear it out.
const MAX_CARRY_DAYS = 7;

const queueDir = rel('comms/queue');
mkdirSync(queueDir, { recursive: true });

const previousDate =
  flag('from', null) ??
  readdirSync(queueDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace('.json', ''))
    .filter((d) => d < DATE)
    .sort()
    .pop();

if (!previousDate) {
  console.log('No earlier queue to carry forward. Nothing to refresh.');
  process.exit(0);
}

const previous = JSON.parse(readFileSync(rel(`comms/queue/${previousDate}.json`), 'utf8'));

const signalsPath = rel(`comms/signals/${DATE}.json`);
if (!existsSync(signalsPath)) {
  console.error(`No signals for ${DATE}. Run npm run comms:signals first.`);
  console.error('Refreshing against stale signals would defeat the point.');
  process.exit(1);
}
const signals = JSON.parse(readFileSync(signalsPath, 'utf8'));

const journalPath = rel('comms/journal/index.jsonl');
const postedIds = new Set(
  existsSync(journalPath)
    ? readFileSync(journalPath, 'utf8')
        .split('\n')
        .filter((l) => l.trim())
        .map((l) => JSON.parse(l).id)
    : []
);

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

const carried = [];
const dropped = [];
const drifted = [];

for (const post of previous.posts ?? []) {
  if (postedIds.has(post.id) || post.posted) {
    dropped.push({ id: post.id, why: 'already posted, now in the archive' });
    continue;
  }

  const firstSeen = post.firstSeen ?? previousDate;
  const age = daysBetween(firstSeen, DATE);
  if (age > MAX_CARRY_DAYS) {
    dropped.push({ id: post.id, why: `carried ${age} days without going out` });
    continue;
  }

  const next = { ...post, firstSeen, carriedFrom: previousDate, carriedDays: age };

  // Images are dated. Yesterday's capture is yesterday's page, and a stat card
  // built from yesterday's numbers is exactly the thing this script exists to
  // catch. Clearing them makes comms:images redo the work against today.
  delete next.images;
  if (next.image?.startsWith('comms/assets/')) delete next.image;

  const drift = checkFacts(post, signals);
  if (drift.length) {
    next.verified = 'unverified';
    next.verifyNote = describeDrift(drift);
    drifted.push({ id: post.id, drift });
  }

  carried.push(next);
}

const targetPath = rel(`comms/queue/${DATE}.json`);
const existing = existsSync(targetPath)
  ? JSON.parse(readFileSync(targetPath, 'utf8'))
  : { date: DATE, generatedBy: `refreshed from ${previousDate}`, posts: [] };

const seen = new Set((existing.posts ?? []).map((p) => p.id));
existing.posts = [...(existing.posts ?? []), ...carried.filter((p) => !seen.has(p.id))];
existing.date = DATE;
existing.refreshedFrom = previousDate;

if (!DRY) writeFileSync(targetPath, `${JSON.stringify(existing, null, 2)}\n`);

console.log(`refresh ${previousDate} -> ${DATE}${DRY ? ' (dry run)' : ''}`);
console.log(`  carried ${carried.length}`);
console.log(`  dropped ${dropped.length}`);
dropped.forEach((d) => console.log(`    ${d.id}: ${d.why}`));

if (drifted.length) {
  console.log(`\n  ${drifted.length} draft(s) cite a number that moved:`);
  for (const d of drifted) {
    console.log(`    ${d.id}`);
    d.drift.forEach((f) =>
      console.log(
        f.kind === 'changed'
          ? `      ${f.path}: ${f.was} -> ${f.now}  (text says "${f.asWritten ?? f.was}")`
          : `      ${f.path}: could not read today, so unconfirmed rather than wrong`
      )
    );
  }
  console.log('\n  These are back to unverified and cannot be approved until rewritten.');
}

console.log(`\nnext: draft today's new posts, then npm run comms:images`);
