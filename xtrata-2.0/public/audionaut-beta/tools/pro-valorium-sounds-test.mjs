#!/usr/bin/env node
// VALORIUM recorded sounds (daw/js/valorium-sounds.js) and the sound browser: the
// catalogue is CC0 only, sounds load and play in tune, sustains loop, export refuses to
// substitute a sound that is not loaded, and the browser filters, favourites and picks.
// Run from xtrata-2.0: node public/audionaut-beta/tools/pro-valorium-sounds-test.mjs
import { serve, browser, page as openPage } from './serve.mjs';
import assert from 'node:assert/strict';
const edition = process.env.AUDIONAUT_EDITION || 'audionaut-beta';
const server = await serve();
const b = await browser();
try {
  const page = await openPage(b, server.url, {});
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${server.url}/${edition}/daw.html`);
  await page.waitForSelector('#mod-open', { state: 'attached' });
  await page.waitForTimeout(1200);
  const result = await page.evaluate(async () => {
    const [S, B, { PACKS, PACK_LICENCES }, { createProInstrumentVoice, normalizeInstrumentConfig }, { synthDefaults }, { store }, { engine }, { prepareRecorded }] = await Promise.all(
      ['valorium-sounds.js', 'valorium-browser.js', 'pack-catalogue.js', 'pro-instruments.js', 'synths.js', 'state.js', 'engine.js', 'valorium-sounds.js'].map(f => import('./daw/js/' + f)));
    const failures = [], report = {};
    const check = (condition, label) => { if (!condition) failures.push(label); };
    const hz = pitch => 440 * 2 ** ((pitch - 69) / 12);
    const energy = (data, f, from, to, sr = 44100) => { const w = 2 * Math.PI * f / sr, c = 2 * Math.cos(w); let s1 = 0, s2 = 0; const i0 = Math.floor(from * sr), i1 = Math.min(data.length, Math.floor(to * sr)); for (let i = i0; i < i1; i++) { const x = data[i] * (.5 - .5 * Math.cos(2 * Math.PI * (i - i0) / (i1 - i0))), s = x + c * s1 - s2; s2 = s1; s1 = s; } return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) / Math.max(1, i1 - i0); };
    const rms = (data, from, to, sr = 44100) => { let sum = 0, n = 0; for (let i = Math.floor(from * sr); i < Math.min(data.length, to * sr); i++) { sum += data[i] * data[i]; n++; } return Math.sqrt(sum / Math.max(1, n)); };

    // Catalogue: public domain only.
    const byPack = Object.fromEntries(PACKS.map(p => [p.id, p]));
    report.sounds = S.RECORDED_SOUNDS.length; report.categories = S.RECORDED_CATEGORIES.length;
    check(S.RECORDED_SOUNDS.length >= 200 && new Set(S.RECORDED_SOUNDS.map(s => s.key)).size === S.RECORDED_SOUNDS.length, 'catalogue has 200+ sounds with unique keys');
    check(S.RECORDED_SOUNDS.every(s => byPack[s.pack].tier === 'core' && byPack[s.pack].spdx === 'CC0-1.0' && s.licence === 'CC0-1.0' && s.zones.length >= 3 && s.credit), 'every sound comes from a CC0 pack, has a credit and at least 3 recorded notes');
    check(S.RECORDED_SOUNDS.every(s => s.zones.every(z => { const row = byPack[s.pack].sounds.find(r => r[0] === z.assetId); return row && PACK_LICENCES[row[7]] === 'CC0-1.0'; })), 'every recorded note is itself marked CC0');
    check(!S.RECORDED_SOUNDS.some(s => ['epiano', 'voices', 'pianoby', 'rockkit', 'byextras', 'classic'].includes(s.pack)), 'attribution and unverified packs are left out');

    // Config: recorded choices survive, bad ones are refused, other instruments drop them.
    const kept = normalizeInstrumentConfig('valorium', { recorded: { a: 'strings/violin-section-sustain', c: '' } });
    check(kept.recorded?.a === 'strings/violin-section-sustain' && !('c' in kept.recorded), 'a recorded choice is kept in the instrument settings');
    let refused = false; try { normalizeInstrumentConfig('valorium', { recorded: { a: '../etc' } }); } catch { refused = true; }
    check(refused && !('recorded' in normalizeInstrumentConfig('concertpiano', { recorded: { a: 'strings/violin-section-sustain' } })), 'an invalid choice is refused and other instruments ignore the field');

    // Play through the same path the engine uses.
    const patch = { ...synthDefaults('valorium'), aType: 'piano', aLevel: .9, bType: 'off', cType: 'off', dType: 'off', cutoff: 18000, fEnv: 0, drive: 0, attack: .005, release: .1, sustain: 1 };
    const play = async (recorded, { pitch = 60, seconds = 1.5, dur = 1.2, offline = true } = {}) => {
      const ctx = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100);
      createProInstrumentVoice(ctx, ctx.destination, { synthId: 'valorium', params: patch, sampleInstrument: recorded ? { recorded } : null }, { pitch, vel: .8, time: 0, dur, held: false, bpm: 120 }, patch, null, { offline, bufferForSource: () => null });
      const out = await ctx.startRendering(), l = out.getChannelData(0), r = out.getChannelData(1), mono = new Float32Array(l.length);
      for (let i = 0; i < l.length; i++) mono[i] = (l[i] + r[i]) / 2;
      return mono;
    };
    const violin = 'strings/violin-section-sustain', harp = 'zithers/concert-harp-forte';
    S.clearRecordedCache();
    let threw = ''; try { await play({ a: violin }); } catch (error) { threw = error.message; }
    check(/not loaded/.test(threw), 'export refuses to play a recorded sound that is not loaded');
    const entry = await S.loadRecordedSound(violin, null), plucked = await S.loadRecordedSound(harp, null);
    report.octaves = { violinSection: entry.octave, harp: plucked.octave, low: entry.low };
    check(entry.octave === 0 && entry.low === 55 && plucked.octave === 0 && S.RECORDED_BY_KEY.get(violin).low === 55, 'the catalogue has the violin section starting at G3, and the recordings agree');
    // Whole catalogue: no instrument's recordings disagree with its roots any more.
    { let wrong = []; for (const sound of S.RECORDED_SOUNDS) { const e = await S.loadRecordedSound(sound.key, null); if (e.octave !== 0) wrong.push(`${sound.key} ${e.octave}`); S.clearRecordedCache(); } report.octaveMismatches = wrong; check(wrong.length <= 3, `catalogue roots match the recordings (${wrong.length} left: ${wrong.join(', ')})`); await S.loadRecordedSound(violin, null); await S.loadRecordedSound(harp, null); }
    const sine = (f) => { const b = new AudioBuffer({ numberOfChannels: 1, length: 22050, sampleRate: 44100 }), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.sin(2 * Math.PI * f * i / 44100) + .6 * Math.sin(4 * Math.PI * f * i / 44100); return b; };
    check([33, 48, 60, 72, 91].every(m => Math.abs(S.detectMidi(sine(hz(m))) - m) < .1) && S.trueRoot(48, sine(hz(60))) === 60 && S.trueRoot(60, sine(hz(60.2))) === 60 && S.trueRoot(60, sine(hz(65))) === 60, 'pitch detection finds the note and only ever moves a root by whole octaves');
    check(entry.zones.length === 5 && entry.zones.every(z => z.loop && z.loop.end > z.loop.start + .3) && plucked.zones.every(z => !z.loop), 'sustained sounds get a loop, plucked ones do not');
    const builtIn = await play(null), recorded = await play({ a: violin });
    const tuned = x => energy(x, hz(60), .3, 1.1) / (energy(x, hz(59), .3, 1.1) + energy(x, hz(61), .3, 1.1) + 1e-12);
    report.tuning = { recorded: +tuned(recorded).toFixed(1) };
    check(rms(recorded, .3, 1.1) > 1e-3 && tuned(recorded) > 3, `recorded violin plays at the right pitch (${tuned(recorded).toFixed(1)}x its neighbours)`);
    let differs = 0; for (let i = 0; i < builtIn.length; i++) differs = Math.max(differs, Math.abs(builtIn[i] - recorded[i]));
    check(differs > .01, 'the recorded sound replaces the layer\'s built-in sound');
    for (const pitch of [57, 72, 88]) { const out = await play({ a: violin }, { pitch }); check(rms(out, .2, 1) > 1e-3 && energy(out, hz(pitch), .3, 1.1) > energy(out, hz(pitch + 1), .3, 1.1) * 2, `recorded violin transposes to ${pitch}`); }
    const long = await play({ a: violin }, { seconds: 6, dur: 5.6 });
    report.sustain = { at1s: rms(long, .8, 1.2), at5s: rms(long, 4.8, 5.4) };
    check(rms(long, 4.8, 5.4) > rms(long, .8, 1.2) * .25, 'a held sustained sound keeps sounding past the end of its recording');
    const harpNote = await play({ a: harp }, { seconds: 6, dur: 5.6 });
    check(rms(harpNote, .1, .6) > 1e-3 && rms(harpNote, 4.8, 5.4) < rms(harpNote, .1, .6) * .05, 'a plucked sound rings out and stops');

    // Project level: prepare for export, then the engine plays the recorded zone.
    const instrument = store.addInstrument('valorium'), index = store.project.instruments.indexOf(instrument);
    store.setTrackProp(instrument.id, 'sampleInstrument', normalizeInstrumentConfig('valorium', { recorded: { a: harp, b: 'mallets/vibraphone-soft-mallets' } }));
    check(JSON.stringify(S.recordedKeysOf(store.project).sort()) === JSON.stringify(['mallets/vibraphone-soft-mallets', harp].sort()), 'a project lists the recorded sounds it uses');
    S.clearRecordedCache();
    await prepareRecorded(store.project, null);
    check(!!S.recordedReady(harp) && !!S.recordedReady('mallets/vibraphone-soft-mallets'), 'export preparation loads every recorded sound the project uses');
    engine.ensureContext();
    const id = engine.startNote(index, 60, .8), voice = engine._synthVoices.get(id)?.voice;
    const zoneBuffers = new Set(S.recordedReady(harp).zones.map(z => z.buffer));
    check(!!voice && voice.sources.some(s => zoneBuffers.has(s.buffer)) && !engine.lastVoiceError, 'a live note plays the recorded buffer');
    engine.releaseNote(id); engine.panic();

    // Browser: filter, favourite, pick.
    check(B.filterSounds({ query: 'violin sustain' }).length >= 3 && B.filterSounds({ query: 'violin sustain' }).every(s => /violin/i.test(s.name)) && B.filterSounds({ category: 'Mallets' }).every(s => s.category === 'Mallets') && B.filterSounds({ query: 'zzzz' }).length === 0, 'search and category filters work');
    localStorage.removeItem('audionaut:valorium-favourites');
    let picked = null; const dialog = B.openSoundBrowser({ current: harp, onPick: key => { picked = key; } });
    const rows = () => [...dialog.querySelectorAll('li')];
    const first = rows().length, opened = dialog.querySelector('select').value; dialog.querySelector('select').value = ''; dialog.querySelector('select').dispatchEvent(new Event('change')); dialog.querySelector('input[type=search]').value = 'hang'; dialog.querySelector('input[type=search]').dispatchEvent(new Event('input'));
    const filtered = rows().length; rows()[0].querySelector('.vb-star').click();
    const starred = [...B.favouriteSounds()];
    dialog.querySelector('select').value = '★'; dialog.querySelector('select').dispatchEvent(new Event('change')); dialog.querySelector('input[type=search]').value = ''; dialog.querySelector('input[type=search]').dispatchEvent(new Event('input'));
    const favouriteRows = rows().length; [...rows()[0].querySelectorAll('button')].at(-1).click();
    report.browser = { first, filtered, starred, favouriteRows, picked };
    check(dialog.open === false && opened !== '' && first > 5 && filtered === 1 && starred.length === 1 && favouriteRows === 1 && picked === starred[0] && picked === 'world/hang-d-minor', 'the browser opens on the current category, filters, keeps a favourite and returns the pick');
    localStorage.removeItem('audionaut:valorium-favourites');
    return { failures, report };
  });
  console.log(JSON.stringify(result, null, 1));
  assert.deepEqual(result.failures, []);
  assert.deepEqual(errors, []);
} finally { await b.close(); server.srv.close(); }
