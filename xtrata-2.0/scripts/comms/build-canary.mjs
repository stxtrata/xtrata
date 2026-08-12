#!/usr/bin/env node
//
// Renders a day's queue into the comms canary: the approval board for
// @XtrataLayers.
//
//   node scripts/comms/build-canary.mjs
//   node scripts/comms/build-canary.mjs --date 2026-08-11
//
// Reads comms/queue/YYYY-MM-DD.json, lints every post, and writes
// comms/canary/index.html. The page is self-contained and offline, in the
// same spirit as recursive-apps/22-wallet-canary.
//
// Modelled directly on the hand-written board at X-Chess/shots/tweets.html,
// which already proved the shape: grouped posts, live character counts, image
// paths, per-post editorial notes, and a posted tick. This adds surface
// grouping, draft variants, reply targets, and the lint verdict.
//
// Nothing on this page posts anything. It copies text to your clipboard and
// records what you ticked. Publishing stays a human action.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintPost, MAX_CHARS } from './lint-post.mjs';

const root = new URL('../../', import.meta.url);
const rel = (p) => fileURLToPath(new URL(p, root));

// Image paths in a queue are written relative to whichever repo root the asset
// naturally lives under. X-Chess/shots/* sits beside xtrata-2.0 rather than
// inside it, so both roots are searched.
const IMAGE_ROOTS = [rel('.'), rel('../')];

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Images are inlined as data URIs so the board is one self-contained file you
// can copy an image out of directly, with no server and no hunting through the
// filesystem for a path. Each distinct image is embedded once and referenced by
// key, because several posts legitimately share a screenshot.
const imageBank = new Map();
const missingImages = [];

const embedImage = (path) => {
  if (imageBank.has(path)) return imageBank.get(path);

  const found = IMAGE_ROOTS.map((base) => join(base, path)).find((p) => existsSync(p));
  if (!found) {
    missingImages.push(path);
    const entry = { ok: false, bytes: 0 };
    imageBank.set(path, entry);
    return entry;
  }

  const mime = MIME[extname(found).toLowerCase()];
  if (!mime) {
    missingImages.push(`${path} (unsupported type)`);
    const entry = { ok: false, bytes: 0 };
    imageBank.set(path, entry);
    return entry;
  }

  const bytes = statSync(found).size;
  const entry = {
    ok: true,
    bytes,
    mime,
    dataUri: `data:${mime};base64,${readFileSync(found).toString('base64')}`
  };
  imageBank.set(path, entry);
  return entry;
};

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const DATE = flag('date', new Date().toISOString().slice(0, 10));

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const CATEGORY_LABEL = {
  announce: 'Announcement',
  standalone: 'Standalone',
  thread: 'Thread',
  reply: 'Reply to someone else',
  quote: 'Quote post'
};

const queuePath = rel(`comms/queue/${DATE}.json`);
if (!existsSync(queuePath)) {
  console.error(`No queue at comms/queue/${DATE}.json`);
  console.error('Run the daily comms routine first, or pass --date for a day that exists.');
  process.exit(1);
}

const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
const registry = JSON.parse(readFileSync(rel('comms/registry/surfaces.json'), 'utf8'));
const surfaceById = Object.fromEntries(registry.surfaces.map((s) => [s.id, s]));

// Posted state comes from the journal, not from the browser. A localStorage
// tick dies with the profile and is invisible to every other machine, which
// made "have we posted this" a question the board could not actually answer.
const journalPath = rel('comms/journal/index.jsonl');
const journal = existsSync(journalPath)
  ? readFileSync(journalPath, 'utf8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l))
  : [];
const journalById = Object.fromEntries(journal.map((e) => [e.id, e]));

const allPosts = queue.posts ?? [];
const isPosted = (post) => Boolean(post.posted || journalById[post.id]);

// The live board is what still needs a decision. Everything already out moves
// to the archive at the bottom, present but out of the way.
const posts = allPosts.filter((p) => !isPosted(p));
const postedPosts = allPosts.filter(isPosted);

const threadPositionFor = (post) => {
  if (!post.thread) return 'single';
  const siblings = posts.filter((p) => p.thread === post.thread);
  if (siblings.length < 2) return 'single';
  const index = siblings.indexOf(post);
  if (index === 0) return 'first';
  if (index === siblings.length - 1) return 'last';
  return 'middle';
};

// Group: surface -> category -> thread (or loose posts)
const bySurface = new Map();
for (const post of posts) {
  const key = post.surface || 'general';
  if (!bySurface.has(key)) bySurface.set(key, []);
  bySurface.get(key).push(post);
}

let totalFailing = 0;
let totalUnverified = 0;

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const KIND_LABEL = { curated: 'curated', capture: 'captured live', card: 'generated' };

const renderImage = (candidate, postId = null) => {
  const path = candidate.path;
  const entry = embedImage(path);
  if (!entry.ok) {
    return `<div class="shot-missing">Image not found: <code>${esc(path)}</code>. Fix the path in the queue, or the post will go out without it.</div>`;
  }
  return `
    <figure class="shot" data-kind="${esc(candidate.kind ?? 'curated')}">
      <img data-img="${esc(path)}" alt="${esc(candidate.label ?? path)}">
      <figcaption>
        <span class="kind kind-${esc(candidate.kind ?? 'curated')}">${esc(KIND_LABEL[candidate.kind] ?? 'image')}</span>
        <button class="ghost" data-copy-image="${esc(path)}">Copy image</button>
        <a class="ghost" data-download="${esc(path)}" download="${esc(path.split('/').pop())}">Download</a>
        ${
          postId
            ? `<button class="ghost used-toggle" data-used-toggle="${esc(path)}" data-post="${esc(postId)}">not used</button>`
            : ''
        }
        <span class="dim">${kb(entry.bytes)}</span>
        <span class="shot-label">${esc(candidate.label ?? '')}</span>
      </figcaption>
    </figure>`;
};

// A post carries an array of options and the author picks one at posting time.
// The old single `image` string is still honoured so a hand-written queue that
// predates the image pipeline keeps working.
const renderImages = (post) => {
  const candidates = post.images?.length
    ? post.images
    : post.image
      ? [{ path: post.image, kind: 'curated', label: 'Chosen in the draft' }]
      : [];
  if (!candidates.length) return '';
  return `<div class="shots" data-count="${candidates.length}">
    ${candidates.map((c) => renderImage(c, post.id)).join('')}
  </div>`;
};

const renderPost = (post) => {
  const result = lintPost(post, { threadPosition: threadPositionFor(post) });
  if (!result.ok) totalFailing += 1;
  if (post.verified === 'unverified') totalUnverified += 1;

  const classes = ['post'];
  if (!result.ok) classes.push('is-failing');
  if (post.verified === 'unverified') classes.push('is-unverified');

  const target = post.target
    ? `<div class="target">
         <div class="target-label">Replying to ${esc(post.target.author || 'a post')}</div>
         ${post.target.excerpt ? `<blockquote>${esc(post.target.excerpt)}</blockquote>` : ''}
         ${post.target.url ? `<a href="${esc(post.target.url)}" target="_blank" rel="noopener">Open the post you are replying to</a>` : ''}
         ${post.target.why ? `<div class="target-why">Why this one: ${esc(post.target.why)}</div>` : ''}
       </div>`
    : '';

  const problems = [
    ...result.errors.map((e) => `<li class="err">${esc(e)}</li>`),
    ...result.warnings.map((w) => `<li class="warn">${esc(w)}</li>`)
  ].join('');

  return `
    <article class="${classes.join(' ')}" data-id="${esc(post.id)}" data-surface="${esc(post.surface || 'general')}" data-failing="${!result.ok}" data-image="${Boolean(post.images?.length || post.image)}">
      ${post.note ? `<div class="note">${esc(post.note)}</div>` : ''}
      ${target}
      <pre class="text">${esc(post.text)}</pre>
      ${renderImages(post)}
      <div class="meta">
        <span class="count ${result.chars > MAX_CHARS ? 'over' : ''}">${result.chars}/${MAX_CHARS}</span>
        ${post.angle ? `<span class="tag">${esc(post.angle)}</span>` : ''}
        <span class="tag">${esc(CATEGORY_LABEL[post.category] || post.category || 'post')}</span>
        ${post.verified === 'unverified' ? '<span class="tag bad">UNVERIFIED</span>' : '<span class="tag good">verified</span>'}
        ${(post.signals || []).length ? `<span class="tag dim">signals: ${esc((post.signals || []).join(', '))}</span>` : ''}
        ${post.carriedFrom ? `<span class="tag carried">carried from ${esc(post.carriedFrom)}, day ${esc(String(post.carriedDays ?? '?'))}</span>` : ''}
      </div>
      ${post.verifyNote ? `<div class="verify">Check first: ${esc(post.verifyNote)}</div>` : ''}
      ${problems ? `<ul class="problems">${problems}</ul>` : ''}
      <div class="actions">
        <button class="copy" data-copy-text>Copy</button>
        <label class="tick"><input type="checkbox" data-tick> posted</label>
      </div>
    </article>`;
};

const renderSurface = ([surfaceId, surfacePosts]) => {
  const surface = surfaceById[surfaceId];
  const threads = new Map();
  const loose = [];
  for (const post of surfacePosts) {
    if (post.thread) {
      if (!threads.has(post.thread)) threads.set(post.thread, []);
      threads.get(post.thread).push(post);
    } else {
      loose.push(post);
    }
  }

  const threadBlocks = [...threads.entries()]
    .map(([threadId, threadPosts]) => {
      const joined = threadPosts.map((p) => p.text).join('\n\n');
      return `
        <section class="thread">
          <header class="thread-head">
            <h3>${esc(threadPosts[0].threadTitle || threadId)}</h3>
            <button class="ghost" data-copy="${esc(joined)}">Copy whole thread</button>
          </header>
          ${threadPosts.map(renderPost).join('')}
        </section>`;
    })
    .join('');

  const verify = surface?.verifyBeforeUse?.length
    ? `<details class="verify-list">
         <summary>${surface.verifyBeforeUse.length} claims must be re-checked before use</summary>
         <ul>${surface.verifyBeforeUse.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
       </details>`
    : '';

  return `
    <section class="surface" data-surface="${esc(surfaceId)}">
      <header class="surface-head">
        <h2>${esc(surface?.name || surfaceId)}</h2>
        ${surface?.url ? `<a href="${esc(surface.url)}" target="_blank" rel="noopener">${esc(surface.url)}</a>` : ''}
        ${surface?.oneLiner ? `<p>${esc(surface.oneLiner)}</p>` : ''}
        ${verify}
      </header>
      ${loose.map(renderPost).join('')}
      ${threadBlocks}
    </section>`;
};

const body = [...bySurface.entries()].map(renderSurface).join('');

// The archive is deliberately plain: no copy buttons, no ticks, no images. It
// exists to answer "what have we already said" while you are deciding what to
// say next, and anything actionable in it would be a way to post twice.
const renderArchived = (post) => {
  const entry = journalById[post.id];
  const url = post.postedUrl ?? entry?.url ?? null;
  return `
    <article class="archived">
      <pre class="text">${esc(post.text)}</pre>
      <div class="meta">
        <span class="tag">${esc(post.surface ?? 'general')}</span>
        ${post.angle ? `<span class="tag">${esc(post.angle)}</span>` : ''}
        ${post.thread ? `<span class="tag">thread ${esc(post.thread)}</span>` : ''}
        ${
          post.imagesUsed?.length
            ? `<span class="tag dim">image: ${esc(post.imagesUsed.map((p) => String(p).split('/').pop()).join(', '))}</span>`
            : '<span class="tag dim">text only</span>'
        }
        ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">on X</a>` : '<span class="tag dim">no url recorded</span>'}
        <span class="dim">${esc(post.postedAt ? post.postedAt.slice(0, 16).replace('T', ' ') : entry?.date ?? '')}</span>
      </div>
    </article>`;
};

// The archive is read from comms/archive/, not from the current queue. Posted
// drafts stop being carried forward, so a queue-only archive would be empty
// every morning, which is precisely when knowing what went out yesterday
// matters most.
const ARCHIVE_DAYS = 14;
const archiveDir = rel('comms/archive');
const archiveCutoff = new Date(Date.parse(DATE) - ARCHIVE_DAYS * 86400000)
  .toISOString()
  .slice(0, 10);

const archivedPosts = (existsSync(archiveDir) ? readdirSync(archiveDir) : [])
  .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
  .filter((f) => f.replace('.json', '') >= archiveCutoff)
  .sort()
  .reverse()
  .flatMap((f) => {
    const day = JSON.parse(readFileSync(join(archiveDir, f), 'utf8'));
    return (day.posted ?? []).map((p) => ({ ...p, archiveDate: day.date ?? f.replace('.json', '') }));
  });

// Anything posted but not yet archived (recorded by hand, or mid-migration)
// still deserves to show, so merge the current queue's posted items in.
const archiveById = new Map(archivedPosts.map((p) => [p.id, p]));
for (const post of postedPosts) if (!archiveById.has(post.id)) archiveById.set(post.id, post);
const archiveList = [...archiveById.values()];

const archiveByDate = new Map();
for (const post of archiveList) {
  const day = post.archiveDate ?? post.postedAt?.slice(0, 10) ?? journalById[post.id]?.date ?? 'undated';
  if (!archiveByDate.has(day)) archiveByDate.set(day, []);
  archiveByDate.get(day).push(post);
}

const archiveBlock = archiveList.length
  ? `<details class="archive">
       <summary>Archive: ${archiveList.length} post(s) already out, last ${ARCHIVE_DAYS} days</summary>
       <p class="dim">Read from <code>comms/archive/</code> and the journal, so it survives a different browser and a different machine. No buttons here on purpose: everything actionable would be a way to post the same thing twice.</p>
       ${[...archiveByDate.entries()]
         .sort((a, b) => (a[0] < b[0] ? 1 : -1))
         .map(
           ([day, group]) =>
             `<h4 class="archive-day">${esc(day)} <span class="dim">${group.length} post(s)</span></h4>
              ${group.map(renderArchived).join('')}`
         )
         .join('')}
     </details>`
  : '';

const excluded = registry.surfaces.filter((s) => s.status === 'not-ready');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Xtrata comms canary ${esc(DATE)}</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #ffffff; --fg: #12131a; --dim: #61646f; --line: #e2e3ea;
    --card: #f7f8fb; --err: #b3261e; --warn: #8a6100; --good: #1f6f43;
    --accent: #2f5fd0;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0e0f13; --fg: #e9eaf0; --dim: #9498a6; --line: #262833;
      --card: #171923; --err: #ff8a80; --warn: #ffc46b; --good: #7ee2a8;
      --accent: #8fb0ff;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg);
    font: 15px/1.55 ui-sans-serif, -apple-system, "Segoe UI", system-ui, sans-serif; }
  header.top { position: sticky; top: 0; z-index: 5; background: var(--bg);
    border-bottom: 1px solid var(--line); padding: 14px 20px; }
  h1 { font-size: 17px; margin: 0 0 4px; }
  .summary { color: var(--dim); font-size: 13px; }
  .summary b { color: var(--fg); }
  .filters { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
  .filters button { font: inherit; font-size: 13px; padding: 4px 10px; cursor: pointer;
    border: 1px solid var(--line); background: var(--card); color: var(--fg); border-radius: 999px; }
  .filters button[aria-pressed="true"] { background: var(--accent); color: #fff; border-color: var(--accent); }
  main { max-width: 760px; margin: 0 auto; padding: 20px; }
  .banner { border: 1px solid var(--line); border-left: 3px solid var(--err);
    background: var(--card); padding: 12px 14px; border-radius: 6px; margin-bottom: 22px; font-size: 13px; }
  .banner h4 { margin: 0 0 6px; font-size: 13px; }
  .surface { margin-bottom: 40px; }
  .surface-head { border-bottom: 1px solid var(--line); padding-bottom: 10px; margin-bottom: 16px; }
  .surface-head h2 { font-size: 20px; margin: 0 0 2px; }
  .surface-head a { color: var(--accent); font-size: 13px; text-decoration: none; }
  .surface-head p { color: var(--dim); font-size: 14px; margin: 6px 0 0; }
  .verify-list { margin-top: 8px; font-size: 13px; color: var(--warn); }
  .verify-list ul { margin: 6px 0 0; padding-left: 18px; color: var(--dim); }
  .thread { border-left: 2px solid var(--line); padding-left: 14px; margin: 18px 0; }
  .thread-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .thread-head h3 { font-size: 14px; margin: 0; color: var(--dim); text-transform: uppercase;
    letter-spacing: .04em; }
  .post { border: 1px solid var(--line); background: var(--card); border-radius: 8px;
    padding: 14px; margin-bottom: 12px; }
  .post.is-failing { border-color: var(--err); }
  .post.is-unverified { border-left: 3px solid var(--warn); }
  .post.is-done { opacity: .45; }
  .note { font-size: 12px; color: var(--dim); font-style: italic; margin-bottom: 8px; }
  .text { font: inherit; white-space: pre-wrap; margin: 0 0 10px; }
  .shots { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px; margin-bottom: 10px; }
  .shots[data-count="1"] { grid-template-columns: 1fr; }
  @media (max-width: 560px) { .shots { grid-template-columns: 1fr; } }
  .kind { border-radius: 4px; padding: 1px 6px; font-size: 11px; text-transform: uppercase;
    letter-spacing: .04em; border: 1px solid var(--line); }
  .kind-curated { color: var(--good); }
  .kind-capture { color: var(--accent); }
  .kind-card { color: var(--warn); }
  .shot-label { flex-basis: 100%; color: var(--dim); font-size: 11px; }
  .used-toggle { opacity: .6; }
  .used-toggle.on { opacity: 1; color: var(--good); border-color: var(--good); font-weight: 600; }
  .shot.is-picked img { outline: 2px solid var(--good); outline-offset: 2px; }
  .archive { margin-top: 54px; border-top: 1px solid var(--line); padding-top: 18px; }
  .archive > summary { cursor: pointer; font-size: 15px; font-weight: 600; }
  .archive > p { font-size: 12px; margin: 8px 0 16px; }
  .archived { border-left: 2px solid var(--line); padding: 4px 0 4px 14px;
    margin: 16px 0; opacity: .72; }
  .archived .text { font-size: 14px; margin-bottom: 6px; }
  .archived a { color: var(--accent); font-size: 12px; }
  .archive-day { font-size: 13px; margin: 22px 0 4px; text-transform: uppercase;
    letter-spacing: .05em; color: var(--dim); }
  .shot { margin: 0 0 10px; }
  .shot img { display: block; width: 100%; height: auto; border-radius: 6px;
    border: 1px solid var(--line); background: var(--bg); cursor: zoom-in; }
  .shot img.zoomed { cursor: zoom-out; position: fixed; inset: 12px; z-index: 20;
    width: auto; height: auto; max-width: calc(100vw - 24px); max-height: calc(100vh - 24px);
    margin: auto; box-shadow: 0 8px 40px rgba(0,0,0,.6); }
  .shot figcaption { display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
    margin-top: 6px; font-size: 12px; color: var(--dim); }
  .shot figcaption code { font-size: 11px; }
  .shot figcaption .dim { color: var(--dim); }
  a.ghost { text-decoration: none; display: inline-block; }
  .shot-missing { font-size: 12px; color: var(--err); border: 1px solid var(--err);
    border-radius: 6px; padding: 8px 10px; margin-bottom: 10px; }
  .meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 12px; }
  .count { font-variant-numeric: tabular-nums; color: var(--dim); }
  .count.over { color: var(--err); font-weight: 700; }
  .tag { border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; color: var(--dim); }
  .tag.good { color: var(--good); } .tag.bad { color: var(--err); font-weight: 700; }
  .tag.carried { color: var(--warn); border-color: var(--warn); }
  .verify { margin-top: 8px; font-size: 12px; color: var(--warn); }
  .problems { margin: 10px 0 0; padding-left: 18px; font-size: 12px; }
  .problems .err { color: var(--err); } .problems .warn { color: var(--warn); }
  .actions { margin-top: 12px; display: flex; gap: 10px; align-items: center; }
  button.copy, button.ghost { font: inherit; font-size: 13px; padding: 4px 12px; cursor: pointer;
    border: 1px solid var(--line); background: transparent; color: var(--fg); border-radius: 6px; }
  button.copy { background: var(--accent); color: #fff; border-color: var(--accent); }
  .tick { font-size: 13px; color: var(--dim); display: flex; gap: 5px; align-items: center; cursor: pointer; }
  .target { border: 1px dashed var(--line); border-radius: 6px; padding: 10px; margin-bottom: 10px; font-size: 13px; }
  .target-label { color: var(--dim); font-size: 12px; margin-bottom: 4px; }
  .target blockquote { margin: 0 0 6px; padding-left: 10px; border-left: 2px solid var(--line); color: var(--dim); }
  .target a { color: var(--accent); font-size: 12px; }
  .target-why { color: var(--dim); font-size: 12px; margin-top: 4px; }
  footer { max-width: 760px; margin: 0 auto; padding: 0 20px 60px; }
  footer button { font: inherit; padding: 8px 16px; cursor: pointer; border-radius: 6px;
    border: 1px solid var(--line); background: var(--card); color: var(--fg); }
  #export { width: 100%; min-height: 120px; margin-top: 12px; font: 12px ui-monospace, monospace;
    background: var(--card); color: var(--fg); border: 1px solid var(--line); border-radius: 6px; padding: 10px; }
</style>
</head>
<body>
<header class="top">
  <h1>Xtrata comms canary <span class="summary">${esc(DATE)}</span></h1>
  <div class="summary">
    <b>${posts.length}</b> awaiting a decision across <b>${bySurface.size}</b> surfaces.
    <b class="${totalFailing ? 'bad' : ''}">${totalFailing}</b> failing lint.
    <b>${totalUnverified}</b> unverified.
    ${postedPosts.length ? `<b>${postedPosts.length}</b> archived.` : ''}
    Nothing here posts itself.
  </div>
  <div class="filters">
    <button data-filter="all" aria-pressed="true">All</button>
    <button data-filter="todo" aria-pressed="false">Not posted</button>
    <button data-filter="clean" aria-pressed="false">Passing lint</button>
    <button data-filter="image" aria-pressed="false">Has image</button>
    <button id="reset" aria-pressed="false">Reset ticks</button>
  </div>
</header>
<main>
  ${
    excluded.length
      ? `<div class="banner">
           <h4>Do not post about these</h4>
           ${excluded.map((s) => `<div><b>${esc(s.name)}</b>: ${esc(s.notes)}</div>`).join('')}
         </div>`
      : ''
  }
  ${body}
  ${archiveBlock}
</main>
<footer>
  <button id="copy-approved">Copy ticked posts as JSON</button>
  <p class="summary">Paste into <code>npm run comms:record</code> to append them to the journal.</p>
  <textarea id="export" readonly placeholder="Ticked posts appear here."></textarea>
</footer>
<script>
  var IMAGES = ${JSON.stringify(
    Object.fromEntries([...imageBank].filter(([, v]) => v.ok).map(([k, v]) => [k, v.dataUri]))
  )};

  // These deliberately carry no loading="lazy". The src is assigned here rather
  // than in the markup, and a lazily-loaded image whose src arrives after parse
  // does not reliably re-arm its intersection observer, so the pictures sit at
  // 2x2 forever. Lazy loading buys nothing for a data URI in any case, because
  // there is no network request to defer.
  document.querySelectorAll('img[data-img]').forEach(function (img) {
    var src = IMAGES[img.getAttribute('data-img')];
    if (src) img.src = src;
  });
  document.querySelectorAll('a[data-download]').forEach(function (a) {
    var src = IMAGES[a.getAttribute('data-download')];
    if (src) a.href = src;
  });

  // Some formats will not go on the clipboard as-is, so anything that is not
  // already a PNG is re-encoded through a canvas first.
  function toPng(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('encode failed')); }, 'image/png');
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  // Copying an image is taken as using it. That is what the action means in
  // practice: you copy it because you are about to paste it into the composer.
  // Marking happens only on a SUCCESSFUL copy, so a clipboard the browser
  // blocked never records an image that never reached the post. The badge is
  // the undo, for the times you copied one and then changed your mind.
  function copyImage(key, button) {
    var old = button.textContent;
    var post = button.closest('.post');
    button.textContent = 'Copying';
    fetch(IMAGES[key])
      .then(function (r) { return r.blob(); })
      .then(function (blob) { return blob.type === 'image/png' ? blob : toPng(blob); })
      .then(function (png) {
        return navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
      })
      .then(function () {
        button.textContent = 'Copied, marked used';
        if (post) markUsed(post.dataset.id, key, true);
      })
      .catch(function () { button.textContent = 'Blocked, use Download'; })
      .then(function () {
        setTimeout(function () { button.textContent = old; }, 1600);
      });
  }

  var KEY = 'xtrata.comms.canary.${DATE}';
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { state = {}; }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  if (!state.ticks) state = { ticks: state.ticks || {}, picks: state.picks || {} };

  // Picks are a list per post, not a single value. X takes up to four images,
  // and more importantly a wrong guess here silently mis-records what went out.
  function picksFor(id) { return state.picks[id] || (state.picks[id] = []); }

  function markUsed(postId, path, used) {
    var list = picksFor(postId);
    var at = list.indexOf(path);
    if (used && at === -1) list.push(path);
    if (!used && at !== -1) list.splice(at, 1);
    if (!list.length) delete state.picks[postId];
    save(); paint();
  }

  function paint() {
    document.querySelectorAll('.post').forEach(function (el) {
      el.classList.toggle('is-done', !!state.ticks[el.dataset.id]);
      var box = el.querySelector('[data-tick]');
      if (box) box.checked = !!state.ticks[el.dataset.id];
      var chosen = state.picks[el.dataset.id] || [];
      el.querySelectorAll('.shot').forEach(function (fig) {
        var toggle = fig.querySelector('[data-used-toggle]');
        if (!toggle) return;
        var mine = chosen.indexOf(toggle.getAttribute('data-used-toggle')) !== -1;
        fig.classList.toggle('is-picked', mine);
        toggle.textContent = mine ? 'used' : 'not used';
        toggle.classList.toggle('on', mine);
      });
    });
  }

  document.addEventListener('change', function (e) {
    var box = e.target.closest('[data-tick]');
    if (!box) return;
    var el = box.closest('.post');
    state.ticks[el.dataset.id] = box.checked;
    if (!box.checked) delete state.ticks[el.dataset.id];
    save(); paint();
  });

  function copy(text, button) {
    navigator.clipboard.writeText(text).then(function () {
      var old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(function () { button.textContent = old; }, 900);
    });
  }

  document.addEventListener('click', function (e) {
    var zoom = e.target.closest('img[data-img]');
    if (zoom) { zoom.classList.toggle('zoomed'); return; }
    var usedBtn = e.target.closest('[data-used-toggle]');
    if (usedBtn) {
      var path = usedBtn.getAttribute('data-used-toggle');
      var postId = usedBtn.getAttribute('data-post');
      markUsed(postId, path, (state.picks[postId] || []).indexOf(path) === -1);
      return;
    }
    var imgBtn = e.target.closest('[data-copy-image]');
    if (imgBtn) { copyImage(imgBtn.getAttribute('data-copy-image'), imgBtn); return; }
    var direct = e.target.closest('[data-copy]');
    if (direct) { copy(direct.getAttribute('data-copy'), direct); return; }
    var textBtn = e.target.closest('[data-copy-text]');
    if (textBtn) {
      copy(textBtn.closest('.post').querySelector('.text').textContent, textBtn);
      return;
    }
    var filter = e.target.closest('[data-filter]');
    if (filter) {
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === filter));
      });
      var mode = filter.getAttribute('data-filter');
      document.querySelectorAll('.post').forEach(function (el) {
        var show = mode === 'all'
          || (mode === 'todo' && !state.ticks[el.dataset.id])
          || (mode === 'clean' && el.dataset.failing === 'false')
          || (mode === 'image' && el.dataset.image === 'true');
        el.style.display = show ? '' : 'none';
      });
      return;
    }
    if (e.target.id === 'reset') { state = { ticks: {}, picks: {} }; save(); paint(); return; }
    if (e.target.id === 'copy-approved') {
      var picked = [];
      document.querySelectorAll('.post').forEach(function (el) {
        if (!state.ticks[el.dataset.id]) return;
        picked.push({
          id: el.dataset.id,
          surface: el.dataset.surface,
          text: el.querySelector('.text').textContent,
          // Which options were actually attached, so the archive records the
          // pictures that went out rather than the default candidate.
          images: state.picks[el.dataset.id] || []
        });
      });
      var json = JSON.stringify({ date: '${DATE}', posted: picked }, null, 2);
      document.getElementById('export').value = json;
      copy(json, e.target);
    }
  });

  paint();
</script>
</body>
</html>
`;

const out = rel('comms/canary/index.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);

const embedded = [...imageBank.values()].filter((v) => v.ok);
const embeddedBytes = embedded.reduce((sum, v) => sum + v.bytes, 0);

console.log(`wrote comms/canary/index.html`);
console.log(`  ${posts.length} drafts, ${bySurface.size} surfaces`);
console.log(`  ${totalFailing} failing lint, ${totalUnverified} unverified`);
console.log(
  `  ${embedded.length} image(s) embedded, ${kb(embeddedBytes)} of source art, page ${kb(html.length)}`
);
if (missingImages.length) {
  console.log('\nimages referenced but not found:');
  missingImages.forEach((p) => console.log(`  ${p}`));
  console.log('Those posts render a red warning instead of a picture.');
}
if (totalFailing) {
  console.log('\nFailing posts are shown in red on the board. Rewrite them, do not waive them.');
}
