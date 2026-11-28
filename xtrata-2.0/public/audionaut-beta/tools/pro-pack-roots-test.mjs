#!/usr/bin/env node
// Pack catalogue root notes after the octave correction (tools/pack-root-audit.mjs):
// labels agree with roots, known instruments sit in their real range, and a project saved
// before the correction keeps its sound while its note labels move to match.
// Run from xtrata-2.0: node public/audionaut-beta/tools/pro-pack-roots-test.mjs
import { serve, browser, page as openPage } from './serve.mjs';
import assert from 'node:assert/strict';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta';
const server = await serve(), b = await browser();
try {
  const page = await openPage(b, server.url, {});
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${server.url}/${edition}/daw.html`);
  await page.waitForTimeout(1500);
  const result = await page.evaluate(async () => {
    const [{ PACKS }, { loadPackAudio }, { assignDecodedSample }, { store }, { detectMidi }] = await Promise.all(['pack-catalogue.js', 'pack-library.js', 'loader.js', 'state.js', 'valorium-sounds.js'].map(f => import('./daw/js/' + f)));
    const failures = [], check = (condition, label) => { if (!condition) failures.push(label); };
    const CLASS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    let pitched = 0; const mismatched = [];
    for (const pack of PACKS) for (const [, label, root] of pack.sounds) {
      if (root == null) continue; pitched++;
      const m = label.match(/\s([A-G])(#|b)?(-?\d)(?:\s.*)?$/); if (!m) continue;
      const named = 12 * (+m[3] + 1) + CLASS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
      if (named !== root) mismatched.push(`${label} = ${root}`);
    }
    check(pitched === 1360 && mismatched.length === 0, `every note label agrees with its root (${mismatched.slice(0, 3).join('; ')})`);
    const lowest = (packId, name) => Math.min(...PACKS.find(p => p.id === packId).sounds.filter(s => s[2] != null && s[1].includes(name)).map(s => s[2]));
    const ranges = { violin: lowest('strings', 'Violin Section Sustain'), cello: lowest('strings', 'Cello Section Sustain'), vibraphone: lowest('mallets', 'Vibraphone Soft Mallets'), erhu: lowest('world', 'Erhu Sustain'), harp: lowest('zithers', 'Concert Harp Forte') };
    check(ranges.violin === 55 && ranges.cello >= 36 && ranges.cello <= 43 && ranges.vibraphone === 53 && ranges.erhu >= 62 && ranges.harp === 38, `known instruments start on their real lowest notes (${JSON.stringify(ranges)})`);
    // One recording really does sound at its catalogue root.
    const shim = { createBuffer: (c, length, sampleRate) => new AudioBuffer({ numberOfChannels: c, length, sampleRate }) };
    const row = PACKS.find(p => p.id === 'strings').sounds.find(s => s[1].endsWith('Violin Section Sustain G3'));
    const loaded = await loadPackAudio({ type: 'pack', value: `strings/${row[0]}` }, shim), heard = detectMidi(loaded.audioBuffer);
    check(loaded.rootMidi === 55 && Math.abs(heard - 55) < .7, `the violin G3 recording sounds at G3 (${heard?.toFixed(2)})`);
    // A channel saved before the correction: root G2 (43), a step transposed up three semitones.
    const channel = store.channel(0), rate = 2 ** (3 / 12);
    channel.source = { type: 'pack', value: `strings/${row[0]}`, label: 'Strings — Violin Section Sustain G2', rootMidi: 43 };
    channel.sampleMidi = 43; channel.pitch = 1;
    store.project.sequences[0].steps[0][0] = { v: 1, pitch: rate, sampleMidi: 46 };
    store.project.sequences[0].steps[0][1] = 1;
    assignDecodedSample(0, channel.source, loaded, { reset: false, dirty: false, preserveLabels: true });
    const step = store.project.sequences[0].steps[0][0];
    check(channel.sampleMidi === 55 && step.sampleMidi === 58 && step.pitch === rate && channel.pitch === 1 && channel.source.rootMidi === 55, 'an older project keeps its playback rates and its note labels move up with the root');
    assignDecodedSample(0, channel.source, loaded, { reset: false, dirty: false, preserveLabels: true });
    check(channel.sampleMidi === 55 && store.project.sequences[0].steps[0][0].sampleMidi === 58, 'loading again does not move the labels twice');
    return { failures, ranges };
  });
  console.log(JSON.stringify(result));
  assert.deepEqual(result.failures, []);
  assert.deepEqual(errors, []);
} finally { await b.close(); server.srv.close(); }
