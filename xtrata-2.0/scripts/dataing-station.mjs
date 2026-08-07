#!/usr/bin/env node
/**
 * Dataing → Xtrata FM station builder (collaboration demo).
 *
 * Reads a Dataing user's music and personality signals through their read-only
 * developer API, and turns them into an ordered station of Xtrata song
 * inscriptions that xtrata-radio can play.
 *
 * WHY THIS IS A NODE SCRIPT AND NOT BROWSER CODE
 * Dataing's guidance is explicit: keep the profile token "out of browser
 * bundles, repos, logs, analytics, and shared screenshots". A `dtok_` is a
 * bearer credential for somebody's dating profile, so it must never reach a
 * page. This script is the only thing that sees it. What crosses to the browser
 * is a list of token ids — public, on-chain, and boring.
 *
 * That split is not a demo shortcut. It is the shape the real integration has
 * to take.
 *
 * Usage:
 *   DATAING_PROFILE_TOKEN=dtok_… node scripts/dataing-station.mjs
 *   node scripts/dataing-station.mjs --fixture     # no token, sample profile
 *   node scripts/dataing-station.mjs --json        # station only, for piping
 *
 * The API is READ-ONLY. This script only ever GETs.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const CACHE = resolve(REPO, 'scripts/.cache/xtrata-song-catalogue.json');

const API = 'https://api.dataing.io';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const HIRO = 'https://api.hiro.so';

/**
 * The music gallery xtrata-radio already plays. Mirrors CURATED_GALLERIES
 * ('jim-music') in src/home/config.js — imported rather than copied would be
 * better, but that module is a browser bundle and pulls in DOM assumptions.
 */
const SONG_TOKEN_IDS = [1107, 1105, 1101, 1099, 1097, 1091, 1065, 1050, 1048, 785, 577];

const args = new Set(process.argv.slice(2));
const useFixture = args.has('--fixture');
const jsonOnly = args.has('--json');

const say = (...m) => { if (!jsonOnly) console.log(...m); };
const die = (msg) => { console.error(`\n✗ ${msg}\n`); process.exit(1); };

// ---------------------------------------------------------------- Dataing

/**
 * GET a Dataing endpoint. The token goes in a header and is never logged, never
 * put in a query string, and never written to disk.
 */
const dataing = async (path, token) => {
  const res = await fetch(`${API}${path}`, {
    headers: { 'X-Dataing-Profile-Token': token, accept: 'application/json' }
  });
  if (res.status === 401 || res.status === 403) {
    die(`Dataing rejected the token on ${path} (HTTP ${res.status}). Generate a fresh dtok_ in the app.`);
  }
  if (!res.ok) die(`Dataing ${path} returned HTTP ${res.status}.`);
  const body = await res.json();
  if (body?.success === false) die(`Dataing ${path} reported failure.`);
  return body?.data ?? body;
};

const loadProfile = async () => {
  if (useFixture) {
    const path = resolve(HERE, 'fixtures/dataing-me.sample.json');
    if (!existsSync(path)) die(`fixture missing: ${path}`);
    return JSON.parse(readFileSync(path, 'utf8')).data;
  }
  const token = process.env.DATAING_PROFILE_TOKEN;
  if (!token) {
    die(
      'DATAING_PROFILE_TOKEN is not set.\n' +
      '  Generate a private profile token in the Dataing app, then:\n' +
      '    export DATAING_PROFILE_TOKEN=dtok_…\n' +
      '  Do not put it in a file in this repo.\n' +
      '  To see the pipeline without a token: node scripts/dataing-station.mjs --fixture'
    );
  }
  if (!token.startsWith('dtok_')) {
    die('DATAING_PROFILE_TOKEN does not look like a Dataing profile token (expected a dtok_ prefix).');
  }
  return dataing('/user-api/me', token);
};

/**
 * Pull taste keywords out of a profile.
 *
 * Music lives in `linkedSignals` (an APPLE_MUSIC provider), NOT in `traits` —
 * traits are personality dimensions like "weekend_getaway_ready". Both are
 * used, weighted differently: a named artist or genre is direct evidence of
 * taste, a personality trait is an inference about mood.
 */
const tasteFrom = (profile) => {
  const terms = new Map(); // term -> weight

  const add = (raw, weight) => {
    for (const word of String(raw ?? '').toLowerCase().split(/[^a-z0-9]+/)) {
      if (word.length < 3) continue;
      terms.set(word, (terms.get(word) ?? 0) + weight);
    }
  };

  for (const signal of profile?.linkedSignals ?? []) {
    // Shapes vary by provider, so read defensively rather than assuming.
    add(signal?.provider, 0.5);
    add(signal?.label ?? signal?.name ?? signal?.title, 3);
    add(signal?.summary ?? signal?.description, 2);
    for (const item of signal?.items ?? signal?.data ?? []) {
      add(item?.name ?? item?.title, 3);
      add(item?.genre ?? item?.genreName, 4); // genre is the strongest signal
      add(item?.artistName ?? item?.artist, 3);
    }
  }

  for (const trait of profile?.topTraits ?? []) {
    const weight = 1 * (trait?.confidence ?? 1);
    add(trait?.trait?.name ?? trait?.name, weight);
    add(trait?.trait?.key ?? trait?.key, weight);
  }

  add(profile?.latestBio?.text ?? profile?.latestBio?.content, 1);

  return terms;
};

// ---------------------------------------------------------------- Xtrata

const readOnly = async (fn, tokenId) => {
  const [address, name] = CORE.split('.');
  const res = await fetch(`${HIRO}/v2/contracts/call-read-only/${address}/${name}/${fn}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sender: address, arguments: [`0x01${BigInt(tokenId).toString(16).padStart(32, '0')}`] })
  });
  if (!res.ok) return null;
  const body = await res.json();
  return body?.okay ? body.result : null;
};

/**
 * Song catalogue, cached because it is immutable — a sealed inscription's mime
 * type and token URI can never change, so re-reading the chain on every run
 * would be pure waste.
 */
const loadCatalogue = async () => {
  if (existsSync(CACHE)) {
    try { return JSON.parse(readFileSync(CACHE, 'utf8')); } catch {}
  }
  say('reading song catalogue from chain (first run only)…');
  const { callReadOnlyFunction, cvToJSON, uintCV } = await import('@stacks/transactions');
  const { StacksMainnet } = await import('@stacks/network');
  const network = new StacksMainnet();
  const [contractAddress, contractName] = CORE.split('.');
  const call = (functionName, id) =>
    callReadOnlyFunction({ contractAddress, contractName, functionName, functionArgs: [uintCV(id)], network, senderAddress: contractAddress });

  const catalogue = [];
  for (const id of SONG_TOKEN_IDS) {
    try {
      const meta = cvToJSON(await call('get-inscription-meta', id));
      const v = meta.value?.value ?? meta.value;
      const uriCv = cvToJSON(await call('get-token-uri', id));
      const uri = String(uriCv.value?.value?.value ?? uriCv.value?.value ?? uriCv.value ?? '');
      catalogue.push({
        tokenId: id,
        mime: v?.['mime-type']?.value ?? null,
        sizeBytes: Number(v?.['total-size']?.value ?? 0),
        tokenUri: uri,
        // The descriptive part of an xtrata: URI is the only taste-bearing
        // metadata these inscriptions carry. See the note in the report.
        slug: uri.startsWith('xtrata:') ? uri.split('/').slice(1).join('/') : ''
      });
    } catch {
      catalogue.push({ tokenId: id, mime: null, sizeBytes: 0, tokenUri: '', slug: '' });
    }
  }
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(catalogue, null, 2));
  return catalogue;
};

// ---------------------------------------------------------------- matching

/**
 * Score a song against the taste terms.
 *
 * Deliberately simple and inspectable: every point is attributable to a word
 * that appears in both the listener's signals and the song's slug, and the
 * reasons are reported. A black-box score would be worse here — the whole
 * pitch of this integration is "a reason to look closer", so the station has to
 * be able to say why.
 */
const scoreSong = (song, terms) => {
  const reasons = [];
  let score = 0;
  const words = new Set(song.slug.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3));
  for (const word of words) {
    const weight = terms.get(word);
    if (weight) { score += weight; reasons.push(word); }
  }
  // Playable audio ranks above an HTML piece that merely contains audio: the
  // radio can stream the former directly.
  if ((song.mime ?? '').startsWith('audio/')) score += 0.5;
  return { score, reasons };
};

// ---------------------------------------------------------------- run

const main = async () => {
  const profile = await loadProfile();
  const terms = tasteFrom(profile);
  const catalogue = await loadCatalogue();

  const ranked = catalogue
    .map((song) => ({ ...song, ...scoreSong(song, terms) }))
    .sort((a, b) => b.score - a.score || a.tokenId - b.tokenId);

  const matched = ranked.filter((s) => s.score > 0);
  const station = {
    generatedAt: new Date().toISOString(),
    source: useFixture ? 'fixture' : 'dataing:/user-api/me',
    contract: CORE,
    // Everything matched first, then the rest, so the station always plays.
    tokenIds: ranked.map((s) => s.tokenId),
    matchedTokenIds: matched.map((s) => s.tokenId),
    why: matched.map((s) => ({ tokenId: s.tokenId, slug: s.slug, because: s.reasons }))
  };

  if (jsonOnly) { console.log(JSON.stringify(station, null, 2)); return; }

  const topTerms = [...terms.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  say('\n── Listener signals ' + '─'.repeat(40));
  say(`  linked signals : ${(profile?.linkedSignals ?? []).length}`);
  say(`  top traits     : ${(profile?.topTraits ?? []).length}`);
  say(`  taste terms    : ${terms.size}`);
  say(`  strongest      : ${topTerms.map(([w, s]) => `${w}(${s.toFixed(1)})`).join(' ') || '(none)'}`);

  say('\n── Station ' + '─'.repeat(49));
  for (const s of ranked) {
    const mark = s.score > 0 ? '►' : ' ';
    const why = s.reasons.length ? `matched: ${s.reasons.join(', ')}` : (s.slug ? '' : 'no descriptive metadata on chain');
    say(`  ${mark} #${String(s.tokenId).padEnd(5)} ${String(s.slug || '—').padEnd(38)} ${s.score ? s.score.toFixed(1).padStart(5) : '    ·'}  ${why}`);
  }

  say(`\n  ${matched.length} of ${catalogue.length} songs matched this listener.`);
  if (!matched.length) {
    say('  Nothing matched — the station still plays, just unordered. See the metadata note below.');
  }
  const undescribed = catalogue.filter((s) => !s.slug).length;
  if (undescribed) {
    say(`\n  NOTE: ${undescribed} of ${catalogue.length} songs carry no descriptive token URI, so they can`);
    say('  never match anything. Matching quality is capped by inscription metadata,');
    say('  not by the taste signals. Worth raising: richer metadata at inscribe time.');
  }
  say('\n  Hand station.tokenIds to initXtrataRadio({ tokenIds }) — the browser never sees the token.\n');
};

main().catch((e) => die(e?.message ?? String(e)));
