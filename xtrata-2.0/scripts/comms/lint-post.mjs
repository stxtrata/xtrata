#!/usr/bin/env node
//
// Voice linter for queued @XtrataLayers posts.
//
// The rules here are not style preferences, they are the difference between a
// post that reads as Jim and a post that reads as a language model wearing his
// name. Every rule was derived from the hand-written corpus at
// X-Chess/shots/tweets.html. See comms/registry/voice.md.
//
//   node scripts/comms/lint-post.mjs comms/queue/2026-08-11.json
//   node scripts/comms/lint-post.mjs --text "some post text"
//
// Exit 0 when every post passes, 1 when any post fails. Warnings never fail
// the run, because a warning is a thing a human should look at and an error is
// a thing that must not be published.

import { readFileSync } from 'node:fs';

export const MAX_CHARS = 280;

// X counts every URL as a fixed 23 characters regardless of real length.
// Counting the raw string instead is how a post that "fits" gets truncated.
const T_CO_LENGTH = 23;
const URL_PATTERN = /https?:\/\/\S+/g;

const HYPE = [
  'revolutionary', 'revolutionise', 'revolutionize', 'game-changing',
  'game changing', 'unlock', 'empower', 'seamless', 'seamlessly',
  'cutting-edge', 'cutting edge', 'leverage', 'disrupt', 'disruptive',
  'unleash', 'supercharge', 'next-generation', 'next generation',
  'paradigm', 'best-in-class', 'world-class', 'blazing fast'
];

export const countChars = (text) => {
  const withoutUrls = text.replace(URL_PATTERN, '');
  const urlCount = (text.match(URL_PATTERN) || []).length;
  return [...withoutUrls].length + urlCount * T_CO_LENGTH;
};

const hasLink = (text) => URL_PATTERN.test(text);

/**
 * Lint one post.
 *
 * `context.threadPosition` is 'first' | 'middle' | 'last' | 'single' and
 * decides whether this post is required to carry its own link. A middle post
 * in a thread inherits the link from the first one, and forcing a URL into
 * every post of a thread is exactly the tell that gives an automated account
 * away.
 */
export const lintPost = (post, context = {}) => {
  const errors = [];
  const warnings = [];
  const text = typeof post.text === 'string' ? post.text : '';
  const position = context.threadPosition || 'single';

  if (!text.trim()) {
    errors.push('Post text is empty.');
    return { ok: false, errors, warnings, chars: 0 };
  }

  const chars = countChars(text);
  if (chars > MAX_CHARS) {
    errors.push(`Too long: ${chars}/${MAX_CHARS} characters (URLs count as ${T_CO_LENGTH}).`);
  }

  if (text.includes('—')) {
    errors.push('Contains an em dash. Use a full stop and two sentences.');
  }
  if (/\s–\s/.test(text)) {
    errors.push('Contains a spaced en dash used as an em dash. Use a full stop.');
  }
  if (text.includes(';')) {
    errors.push('Contains a semicolon. Use a full stop.');
  }
  if (/(^|\s)#\w/.test(text)) {
    errors.push('Contains a hashtag. The account does not use them.');
  }
  if (/\p{Extended_Pictographic}/u.test(text)) {
    errors.push('Contains an emoji. The account does not use them.');
  }

  const lower = text.toLowerCase();
  for (const word of HYPE) {
    if (lower.includes(word)) {
      errors.push(`Hype vocabulary: "${word}". Say the mechanism instead.`);
    }
  }

  const linkRequired = position === 'single' || position === 'first' || position === 'last';
  if (linkRequired && post.requiresLink !== false && !hasLink(text)) {
    errors.push(
      position === 'single'
        ? 'No link. A standalone post naming a product must carry its link.'
        : `No link. The ${position} post of a thread must carry the link.`
    );
  }

  if (post.verified === 'unverified' && !String(post.verifyNote || '').trim()) {
    errors.push('Marked unverified with no verifyNote saying which claim is unchecked.');
  }
  if (post.verified !== 'verified' && post.verified !== 'unverified') {
    errors.push('Missing verified field. Must be "verified" or "unverified".');
  }
  if (post.verified === 'unverified') {
    warnings.push(`Unverified: ${post.verifyNote}`);
  }

  if (!post.surface) {
    warnings.push('No surface set, so the cooldown and repeat checks cannot apply to it.');
  }
  if (/\d/.test(text) && !(post.signals || []).length) {
    warnings.push('Contains a number but cites no signal. Numbers need a dated source.');
  }

  return { ok: errors.length === 0, errors, warnings, chars };
};

const threadPositionFor = (post, posts) => {
  if (!post.thread) return 'single';
  const siblings = posts.filter((p) => p.thread === post.thread);
  if (siblings.length < 2) return 'single';
  const index = siblings.indexOf(post);
  if (index === 0) return 'first';
  if (index === siblings.length - 1) return 'last';
  return 'middle';
};

export const lintQueue = (queue) => {
  const posts = queue.posts || [];
  return posts.map((post) => ({
    post,
    result: lintPost(post, { threadPosition: threadPositionFor(post, posts) })
  }));
};

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const args = process.argv.slice(2);
  const textAt = args.indexOf('--text');

  if (textAt !== -1) {
    const result = lintPost(
      { text: args[textAt + 1], verified: 'verified', requiresLink: false },
      {}
    );
    console.log(`${result.chars}/${MAX_CHARS} characters`);
    result.errors.forEach((e) => console.log(`  FAIL  ${e}`));
    result.warnings.forEach((w) => console.log(`  warn  ${w}`));
    if (result.ok) console.log('  pass');
    process.exit(result.ok ? 0 : 1);
  }

  const file = args[0];
  if (!file) {
    console.error('Usage: node scripts/comms/lint-post.mjs <queue.json>');
    console.error('       node scripts/comms/lint-post.mjs --text "post text"');
    process.exit(2);
  }

  const queue = JSON.parse(readFileSync(file, 'utf8'));
  const results = lintQueue(queue);
  let failed = 0;

  for (const { post, result } of results) {
    const label = post.id || post.text.slice(0, 40);
    if (result.ok && !result.warnings.length) {
      console.log(`pass  ${label}  (${result.chars}/${MAX_CHARS})`);
      continue;
    }
    console.log(`${result.ok ? 'pass' : 'FAIL'}  ${label}  (${result.chars}/${MAX_CHARS})`);
    result.errors.forEach((e) => console.log(`        FAIL  ${e}`));
    result.warnings.forEach((w) => console.log(`        warn  ${w}`));
    if (!result.ok) failed += 1;
  }

  console.log(`\n${results.length} posts, ${failed} failing.`);
  process.exit(failed ? 1 : 0);
}
