#!/usr/bin/env node
// Audits (and with --write, corrects) the octave of every pitched sound in
// daw/js/pack-catalogue.js against the recording itself.
//
// Why: the source libraries disagree on whether middle C is "C3" or "C4", and the
// catalogue took each note name at face value, so many roots were an octave away
// from where the recording sounds. This tool decodes every pitched sound, measures
// its pitch, and decides ONE whole-octave correction per instrument:
//   - an instrument is every sound in a pack that shares a name once the note is removed;
//   - with 3+ readable notes, the most common octave reading wins (a clear majority);
//   - with fewer, a correction is applied only when the reading agrees with what the
//     same source library needed elsewhere.
// Only the octave ever changes: the note name is trusted. Labels are updated to match.
// The pack files (.audpack) are untouched, so their hashes still verify.
//
// The catalogue is generated outside this repository (audionaut-library). If it is
// regenerated, run this again with --write, or carry the fix into the generator.
//
// Run from xtrata-2.0:
//   node public/audionaut-beta/tools/pack-root-audit.mjs            (report only)
//   node public/audionaut-beta/tools/pack-root-audit.mjs --write    (patch this edition's catalogue)
import { serve, browser, page as openPage } from './serve.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta', write = process.argv.includes('--write');
const file = fileURLToPath(new URL('../daw/js/pack-catalogue.js', import.meta.url));
const NOTE = /(\s+[A-G](?:#|b)?)(-?\d)((?:\s.*)?)$/;

const server = await serve(), b = await browser();
let rows;
try {
  const page = await openPage(b, server.url, {});
  await page.goto(`${server.url}/${edition}/daw.html`);
  await page.waitForTimeout(1500);
  rows = await page.evaluate(async () => {
    const [{ PACKS, PACK_CREDITS }, { loadPackAudio, clearPackCache }, { detectMidi }] = await Promise.all(['pack-catalogue.js', 'pack-library.js', 'valorium-sounds.js'].map(f => import('./daw/js/' + f)));
    const shim = { createBuffer: (c, length, sampleRate) => new AudioBuffer({ numberOfChannels: c, length, sampleRate }) }, out = [];
    for (const pack of PACKS) {
      for (const [assetId, label, rootMidi, , , credit] of pack.sounds) {
        if (rootMidi == null) continue;
        const { audioBuffer } = await loadPackAudio({ type: 'pack', value: `${pack.id}/${assetId}` }, shim);
        out.push({ pack: pack.id, assetId, label, root: rootMidi, heard: detectMidi(audioBuffer), credit: PACK_CREDITS[credit] });
      }
      clearPackCache();
    }
    return out;
  });
} finally { await b.close(); server.srv.close(); }

// Octave reading for one sound: a whole number of octaves, or null when the pitch is unclear
// or does not land on the named note.
const reading = (r) => { if (r.heard == null) return null; const k = Math.round((r.heard - r.root) / 12); return Math.abs(r.heard - (r.root + 12 * k)) <= 0.7 && Math.abs(k) <= 2 ? k : null; };
const mode = (values) => { const m = new Map(); for (const v of values) m.set(v, (m.get(v) || 0) + 1); return [...m].sort((a, c) => c[1] - a[1] || Math.abs(a[0]) - Math.abs(c[0])); };
const groups = new Map();
for (const r of rows) { r.k = reading(r); const key = `${r.pack}|${r.label.replace(/^.*? — /, '').replace(NOTE, '')}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(r); }
// What each source library needed, from its well-sampled instruments.
const byCredit = new Map();
for (const list of groups.values()) { const ks = list.map(r => r.k).filter(k => k != null); if (ks.length < 3) continue; const [[k, n]] = mode(ks); if (n * 2 > ks.length) { const c = list[0].credit; if (!byCredit.has(c)) byCredit.set(c, []); byCredit.get(c).push(k); } }
const convention = new Map([...byCredit].map(([c, ks]) => [c, new Set(ks)]));

const changes = [], summary = { instruments: groups.size, sounds: rows.length, unreadable: rows.filter(r => r.k == null).length, corrected: {}, unchanged: 0, undecided: [] };
for (const [key, list] of groups) {
  const ks = list.map(r => r.k).filter(k => k != null), ranked = mode(ks);
  let shift = 0;
  if (ks.length >= 3 && ranked[0][1] * 2 > ks.length) shift = ranked[0][0];
  else if (ks.length && ranked[0][1] === ks.length && convention.get(list[0].credit)?.has(ranked[0][0])) shift = ranked[0][0];
  else if (ks.length && ranked[0][0] !== 0) summary.undecided.push(`${key} (${list.map(r => r.k ?? '?').join(' ')})`);
  if (!shift) { summary.unchanged++; continue; }
  if (list.some(r => r.root + 12 * shift < 0 || r.root + 12 * shift > 127)) { summary.undecided.push(`${key} (out of range)`); summary.unchanged++; continue; }
  summary.corrected[shift] = (summary.corrected[shift] || 0) + 1;
  for (const r of list) changes.push({ ...r, to: r.root + 12 * shift, newLabel: r.label.replace(NOTE, (_, note, octave, rest) => `${note}${+octave + shift}${rest}`) });
}
summary.soundsChanged = changes.length;
console.log(JSON.stringify({ ...summary, undecided: summary.undecided.slice(0, 40), undecidedCount: summary.undecided.length }, null, 1));

if (write && changes.length) {
  let text = readFileSync(file, 'utf8');
  for (const c of changes) {
    const from = JSON.stringify([c.assetId, c.label, c.root]).slice(0, -1) + ',', to = JSON.stringify([c.assetId, c.newLabel, c.to]).slice(0, -1) + ',';
    if (text.split(from).length !== 2) throw new Error(`Row not found exactly once: ${c.pack}/${c.assetId}`);
    text = text.replace(from, () => to);
  }
  const stamp = '// Root octaves and note labels corrected from the recordings by tools/pack-root-audit.mjs.\n';
  if (!text.includes(stamp)) text = text.replace('// PACKS[i] = ', stamp + '//\n// PACKS[i] = ');
  writeFileSync(file, text);
  console.log(`Wrote ${changes.length} corrected rows to ${file}`);
}
