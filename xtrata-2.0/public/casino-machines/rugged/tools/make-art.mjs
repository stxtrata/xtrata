#!/usr/bin/env node
// Turns what tools/fetch-art.py collected into the three files the game and the build read:
//   art/art.js       window.RUG_ART: the bundled twins (data URIs) per rescued collection, the WELSH logo, the dead links
//   art/manifest.json every twin's token id -> Xtrata id (live loading tops the bundled set up from Xtrata), tiers, counts
//   art/sources.json  where every image and record came from, and the logos that still need the project's permission
//   node tools/make-art.mjs [perTier=24]
// Only files in this folder are read. Art is never drawn here: every image is the verified file from Xtrata or the token's metadata.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PER_TIER = Number(process.argv[2] || 24);
const fetched = JSON.parse(readFileSync(join(HERE, 'art/fetched.json'), 'utf8'));
const list = JSON.parse(readFileSync(join(HERE, 'rescued-list.json'), 'utf8'));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
// Tiers: the birds carry no trait metadata (metadataUri is null in the twin manifest), so rarity cannot be computed.
// They are tiered by mint order instead, a fact anyone can check: Tier I is the first hundred tokens.
const TIERS = [{ tier: 'I', sym: 'block', lo: 0, hi: 99 }, { tier: 'II', sym: 'chip', lo: 100, hi: 199 }, { tier: 'III', sym: 'lemon', lo: 200, hi: 299 }, { tier: 'IV', sym: 'cherry', lo: 300, hi: 399 }];
// A fixed, even spread through each tier (no randomness, so a rebuild bundles the same files).
const spread = (lo, hi, n) => Array.from({ length: n }, (_, k) => lo + Math.floor((k + .5) * (hi - lo + 1) / n));

const art = { builtAt: fetched.fetchedAt, core: fetched.core, collections: [], logos: {} };
const manifest = { builtAt: fetched.fetchedAt, core: fetched.core, tiers: TIERS, collections: [] };
const sources = { machine: 'Rugged', builtAt: fetched.fetchedAt, rule: 'Every symbol is real Bitcoin or Stacks material. Art is fetched, verified and bundled as is; nothing is drawn or imitated by hand. The weave is a canvas effect applied to the real image at run time.', registry: fetched.registry, images: [], records: [], marks: [], logosNeedingPermission: [], logosMissing: [], artLost: [], twinningPriority: [] };

for (const c of fetched.collections) {
  const entry = list.collections.find(e => e.key === c.key) || {};
  const ok = c.tokens.filter(t => t.verified);
  const pick = new Set([0, ...TIERS.flatMap(t => spread(t.lo, t.hi, PER_TIER))]);
  const bundled = [];
  for (const t of ok.filter(t => pick.has(t.tokenId))) {
    const file = join(HERE, 'art/birds', c.key, `${t.tokenId}.png`); if (!existsSync(file)) continue;
    const buf = readFileSync(file); if (sha(buf) !== t.sha256) throw Error(`${c.key} #${t.tokenId}: file hash changed`);
    bundled.push({ tokenId: t.tokenId, xtrataId: t.xtrataId, src: 'data:image/png;base64,' + buf.toString('base64') });
    sources.images.push({ file: `art/birds/${c.key}/${t.tokenId}.png`, bundled: true, symbol: 'rescued rug / flying carpet / rolled rug / knot colours', collection: c.name, tokenId: t.tokenId, xtrataId: t.xtrataId, url: t.url, sha256: t.sha256, verifiedAgainst: c.manifest && c.manifest.url, originalMedia: t.original, forevered: true });
  }
  const dead = (c.deadLinks || []).map(d => ({ tokenId: d.tokenId, call: d.call, uri: d.result, via: d.via, readAt: d.readAt, probe: d.probe ? { kind: d.probe.kind, status: d.probe.status, servesTokenData: d.probe.servesTokenData, checkedAt: d.probe.checkedAt } : null }));
  const supply = entry.supply || c.manifest?.count || c.tokens.length, twinned = c.inscribedCount ?? null;
  art.collections.push({ key: c.key, name: c.name, source: c.source, helper: c.helper, supply, twinned, twinnedAsOf: fetched.fetchedAt, reason: entry.reason, deadLinks: dead, registryNote: c.registryNote, birds: bundled });
  manifest.collections.push({ key: c.key, name: c.name, supply, twinned, tokens: c.tokens.map(t => [t.tokenId, t.xtrataId, t.verified ? 1 : 0]) });
  for (const d of dead) sources.records.push({ symbol: '404 (scatter)', what: `The art link ${c.name}' own contract returns for token ${d.tokenId}`, call: d.call, result: d.uri, via: d.via, readAt: d.readAt, probeFromBuildHost: d.probe, registryEvidence: (c.registryNote || []).find(s => /no longer|ordinary web page/i.test(s)) || null });
  sources.records.push({ symbol: 'topper ART SAVED', what: `${c.name} twins inscribed (helper inscribed-count)`, value: twinned, helper: c.helper, readAt: fetched.fetchedAt });
  if (!ok.length) { sources.artLost.push(c.key); sources.twinningPriority.push(c.key); }
  if (c.failures?.length) sources.records.push({ what: `${c.name} fetch failures`, failures: c.failures });
}
const w = fetched.logos.welsh;
if (w && !w.error && existsSync(join(HERE, 'art/logos/welsh.png'))) {
  const buf = readFileSync(join(HERE, 'art/logos/welsh.png'));
  art.logos.welsh = 'data:image/png;base64,' + buf.toString('base64');
  sources.images.push({ file: 'art/logos/welsh.png', bundled: true, symbol: 'WELSH (wild)', what: 'Welshcorgicoin official token logo', url: w.image, namedBy: `${w.contract} token metadata (${w.tokenUri})`, metadataReadVia: w.metadataVia, sha256: sha(buf), fetchedAt: w.fetchedAt });
  sources.logosNeedingPermission.push({ logo: 'Welshcorgicoin (WELSH)', file: 'art/logos/welsh.png', source: w.image, ask: 'The Welshcorgicoin community (github.com/Welshcorgicoin), since the original developers stepped back and the community runs the token.' });
} else sources.logosMissing.push({ logo: 'Welshcorgicoin (WELSH)', why: w && w.error });
sources.marks.push({ symbol: 'Forever Twins ∞ (artifact) and the lower door', what: 'The Xtrata mark, drawn with the XLOGO vector code the casino already ships (src/shared/xlogo.html), with the ∞ sign set in type', permission: 'Xtrata\'s own mark; no outside permission needed' });
sources.marks.push({ symbol: 'Knot (chain)', what: 'Original, as the treatment says. Each knot is coloured from a real twinned bird (named on the tile), never a drawing of one.' });
sources.marks.push({ symbol: 'ParallaX Casino wordmark', what: 'vendor/brand/parallax-casino-wordmark.svg, used as given on the test page only' });

writeFileSync(join(HERE, 'art/art.js'), `/* Rugged bundled art, built by tools/make-art.mjs from art/fetched.json. Every image is a verified file: Bitcoin Birds twins from Xtrata (SHA-256 checked against the twin manifest) and the WELSH logo named by the token's own metadata. */\nwindow.RUG_ART=${JSON.stringify(art)};\n`);
writeFileSync(join(HERE, 'art/manifest.json'), JSON.stringify(manifest));
writeFileSync(join(HERE, 'art/sources.json'), JSON.stringify(sources, null, 1));
console.log(`art.js ${(readFileSync(join(HERE, 'art/art.js')).length / 1024).toFixed(0)} KB: ${art.collections.map(c => `${c.name} ${c.birds.length} bundled of ${c.supply}, ${c.twinned} twinned`).join('; ')}; WELSH ${art.logos.welsh ? 'yes' : 'no'}`);
