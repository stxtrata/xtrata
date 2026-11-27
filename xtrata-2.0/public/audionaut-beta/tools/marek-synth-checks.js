// Offline checks for the Marek collection synths (jiMVREK, jiELEMENT, jiLOSTWAVE).
// Runs in the browser harness through the real voice lifecycle used by the engine.
import { SYNTH_BANK, synthDefaults, parseLine } from '../daw/js/synths.js';
import { createVoice } from '../daw/js/synths/voice-lifecycle.js';

export const MAREK_SYNTHS = ['mvrek', 'element', 'lostwave'];
function assert(ok, message) { if (!ok) throw new Error(message); }
function energy(data, start = 0, end = data.length) {
  let sum = 0, peak = 0, bad = 0;
  for (let i = start; i < end; i++) { const v = data[i]; if (!Number.isFinite(v)) bad++; else { sum += v * v; peak = Math.max(peak, Math.abs(v)); } }
  return { rms: Math.sqrt(sum / Math.max(1, end - start)), peak, bad };
}
// Autocorrelation pitch estimate over a steady window.
function pitchOf(data, rate, from, to) {
  const a = data.subarray(Math.floor(from * rate), Math.floor(to * rate));
  let best = 0, lag = 0;
  for (let l = Math.floor(rate / 2000); l < Math.floor(rate / 40); l++) {
    let s = 0;
    for (let i = 0; i + l < a.length; i += 2) s += a[i] * a[i + l];
    if (s > best) { best = s; lag = l; }
  }
  return lag ? rate / lag : 0;
}
const baseNote = { pitch: 60, vel: 0.8, time: 0.02, dur: 0.45, bpm: 128 };
async function render(id, patch, { rate = 44100, seconds = 3, notes = [baseNote], held = null } = {}) {
  const ctx = new OfflineAudioContext(1, Math.ceil(rate * seconds), rate);
  const started = performance.now();
  const voices = notes.map((n, i) => createVoice(ctx, ctx.destination, SYNTH_BANK[id], id, { ...baseNote, ...n }, patch, null, { seed: 77 + i }));
  if (held != null) for (const v of voices) v.release(held, patch.release ?? 0.3);
  const build = performance.now() - started;
  const sources = voices[0].sources.length;
  const buffer = await ctx.startRendering();
  return { data: buffer.getChannelData(0), voices, sources, build };
}
export async function verifyMarekSynths() {
  const rows = [];
  for (const id of MAREK_SYNTHS) {
    const def = SYNTH_BANK[id], patch = synthDefaults(id), msg = (t) => `${id}: ${t}`;
    assert(def && def.category, msg('registered with a folder'));
    const base = await render(id, patch);
    const row = { id, category: def.category, sources: base.sources, buildMs: +base.build.toFixed(2), default: energy(base.data), presets: {}, sweep: 0 };
    assert(row.default.bad === 0 && row.default.rms > 0.01 && row.default.peak < 0.95, msg('default level ' + JSON.stringify(row.default)));
    assert(def.presets.length >= 8 && def.lines.length >= 4, msg('factory material'));
    for (const preset of def.presets) {
      for (const [key, value] of Object.entries(preset.params)) {
        const p = def.params.find((q) => q.key === key);
        assert(p && (p.options ? p.options.includes(value) : value >= p.min && value <= p.max), msg(`${preset.name}.${key} out of schema`));
      }
      const e = energy((await render(id, { ...patch, ...preset.params })).data);
      row.presets[preset.name] = +e.rms.toFixed(4);
      assert(e.bad === 0 && e.rms > 0.002 && e.peak < 1, msg(`${preset.name} level ${JSON.stringify(e)}`));
    }
    // Every parameter at both ends (others default), and every option of every select.
    for (const p of def.params) {
      const values = p.options ? p.options : [p.min, p.max];
      for (const v of values) {
        const e = energy((await render(id, { ...patch, [p.key]: v }, { seconds: 1.2 })).data);
        row.sweep++;
        assert(e.bad === 0 && e.peak < 1.2, msg(`${p.key}=${v} ${JSON.stringify(e)}`));
        if (!(p.key === 'level' && v === 0) && !/Level$/.test(p.key) && !(p.key === 'cutoff' && id === 'element')) assert(e.rms > 1e-5, msg(`${p.key}=${v} silent`));
      }
    }
    for (const line of def.lines) assert(parseLine(line.dsl).length > 0, msg(`line ${line.name}`));
    for (const item of def.ui.sections.flatMap((s) => s.items).flatMap((i) => (i.type === 'row' ? i.items : [i]))) {
      for (const key of item.type === 'xy' ? [item.x.key, item.y.key] : item.key ? [item.key] : []) assert(def.params.some((p) => p.key === key), msg(`ui key ${key}`));
    }
    // Short notes are audible; held notes sustain and release cleanly.
    const short = energy((await render(id, patch, { notes: [{ dur: 0.05 }], seconds: 1 })).data);
    assert(short.rms > 1e-4, msg('short note audible'));
    const held = await render(id, patch, { notes: [{ held: true, dur: Infinity }], held: 2.5, seconds: 4 });
    const during = energy(held.data, Math.floor(1.8 * 44100), Math.floor(2.4 * 44100)), after = energy(held.data, Math.floor(3.6 * 44100));
    row.held = { during: +during.rms.toFixed(4), after: after.peak };
    assert(during.rms > 0.005 && after.peak < 1e-3, msg('held/release ' + JSON.stringify(row.held)));
    // Pitch: a plain single-oscillator patch tracks the key.
    const plain = id === 'mvrek' ? { aVoices: 1, bVoices: 1, balance: 0, cutoff: 18000, fEnv: 0 }
      : id === 'element' ? { voices: 1, sub: 0, posStart: 0, posEnd: 0, cutoff: 18000, fEnv: 0 }
      : { o1Mode: 'saw', o2Mode: 'off', o3Mode: 'off', o4Mode: 'off', cutoff: 18000, fEnv: 0, f2Cutoff: 20, punch: 0 };
    row.pitch = {};
    for (const [pitch, hz] of [[57, 220], [40, 82.41], [69, 440]]) {
      const r = await render(id, { ...patch, ...plain, sustain: 1 }, { notes: [{ pitch, dur: 1.2 }], seconds: 1.4 });
      const est = pitchOf(r.data, 44100, 0.4, 0.9);
      row.pitch[pitch] = +est.toFixed(1);
      assert(Math.abs(1200 * Math.log2(est / hz)) < 35, msg(`pitch ${pitch}: ${est} vs ${hz}`));
    }
    // Sources end after the release tail (no leaks).
    const tail = await render(id, patch, { notes: [{ dur: 0.3 }], seconds: 2 });
    assert(tail.voices.every((v) => v.ended), msg('voice ended after release'));
    rows.push(row);
  }
  // jiMVREK: the trance gate chops the sound in time with the tempo.
  const gated = await render('mvrek', { ...synthDefaults('mvrek'), gateDepth: 1, gatePattern: 'offbeat', gateRate: '1/16', sustain: 1, attack: 0.002 }, { notes: [{ dur: 2, bpm: 120 }], seconds: 2.2 });
  const step = 0.125, closed = energy(gated.data, Math.floor((0.02 + 0.03) * 44100), Math.floor((0.02 + 0.2) * 44100)), open = energy(gated.data, Math.floor((0.02 + 2 * step + 0.01) * 44100), Math.floor((0.02 + 3 * step - 0.02) * 44100));
  assert(open.rms > closed.rms * 20, 'mvrek gate ' + JSON.stringify({ open, closed }));
  rows.push({ id: 'mvrek-gate', open: +open.rms.toFixed(4), closed: +closed.rms.toFixed(6) });
  // jiELEMENT: the scan changes the spectrum over the note.
  const scan = await render('element', { ...synthDefaults('element'), posStart: 0, posEnd: 1, posTime: 1.5, cutoff: 18000, fEnv: 0, voices: 1, sub: 0, sustain: 1 }, { notes: [{ pitch: 57, dur: 2, vel: 0.01 }], seconds: 2.2 });
  // Brightness = RMS of the first difference over RMS: rises as the scan leaves the sine frame.
  const bright = (from, to) => { let d = 0, e = 0; for (let i = Math.floor(from * 44100); i < Math.floor(to * 44100); i++) { d += (scan.data[i] - scan.data[i - 1]) ** 2; e += scan.data[i] ** 2; } return Math.sqrt(d / Math.max(1e-12, e)); };
  const early = bright(0.1, 0.3), late = bright(1.6, 1.8);
  rows.push({ id: 'element-scan', early: +early.toFixed(4), late: +late.toFixed(4) });
  assert(late > early * 1.5, 'element scan brightens across the table');
  return rows;
}

// jiVALOREM runs through the sample-instrument path used by the engine.
export async function verifyValorem() {
  const { createProInstrumentVoice, proInstrumentTailSeconds, normalizeInstrumentConfig, PRO_INSTRUMENT_IDS } = await import('../daw/js/pro-instruments.js');
  assert(PRO_INSTRUMENT_IDS.includes('valorem'), 'valorem registered as a sample instrument');
  const def = SYNTH_BANK.valorem, defaults = synthDefaults('valorem'), rows = [];
  const play = async (patch, { notes = [baseNote], seconds = 3, held = null, config = null, buffers = {} } = {}) => {
    const ctx = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100), t0 = performance.now();
    const instrument = { synthId: 'valorem', params: patch, sampleInstrument: config };
    const voices = notes.map((n) => createProInstrumentVoice(ctx, ctx.destination, instrument, { ...baseNote, ...n }, patch, null, { bufferForSource: (s) => buffers[s.sourceTrackId](ctx) }));
    const build = performance.now() - t0;
    if (held != null) voices.forEach((v) => v.release(held, patch.release));
    const out = await ctx.startRendering();
    const mono = new Float32Array(out.length);
    for (let i = 0; i < out.length; i++) mono[i] = (out.getChannelData(0)[i] + out.getChannelData(1)[i]) / 2;
    return { data: mono, voices, build };
  };
  // First render of each family builds its roots; repeats must be fast.
  for (const family of ['keys', 'pluck', 'guitar', 'strings', 'pad', 'choir', 'bell']) {
    const patch = { ...defaults, aType: family, bType: 'off' };
    const first = await play(patch), again = await play(patch);
    const e = energy(first.data);
    rows.push({ family, rms: +e.rms.toFixed(4), peak: +e.peak.toFixed(3), firstBuildMs: +first.build.toFixed(1), cachedBuildMs: +again.build.toFixed(2) });
    assert(e.bad === 0 && e.rms > 0.003 && e.peak < 1, `valorem ${family} level ${JSON.stringify(e)}`);
    const r = await play({ ...patch, sustain: 1 }, { notes: [{ pitch: 57, dur: 1.4 }], seconds: 1.6 });
    const est = pitchOf(r.data, 44100, 0.35, 0.8);
    rows.at(-1).pitch57 = +est.toFixed(1);
    if (family !== 'bell') assert(Math.abs(1200 * Math.log2(est / 220)) < 40, `valorem ${family} pitch ${est}`);
  }
  for (const preset of def.presets) {
    const e = energy((await play({ ...defaults, ...preset.params })).data);
    rows.push({ preset: preset.name, rms: +e.rms.toFixed(4) });
    assert(e.bad === 0 && e.rms > 0.002 && e.peak < 1, `valorem preset ${preset.name} ${JSON.stringify(e)}`);
  }
  for (const p of def.params) for (const v of p.options || [p.min, p.max]) {
    const e = energy((await play({ ...defaults, [p.key]: v }, { seconds: 1.2 })).data);
    assert(e.bad === 0 && e.peak < 1.2, `valorem ${p.key}=${v} ${JSON.stringify(e)}`);
  }
  // Held sustained layers loop until key-up, then end within the release.
  const held = await play({ ...defaults, aType: 'strings', bType: 'pad' }, { notes: [{ held: true }], held: 4, seconds: 5.5 });
  const during = energy(held.data, 3 * 44100, 3.8 * 44100), after = energy(held.data, Math.floor(4.6 * 44100));
  rows.push({ held: +during.rms.toFixed(4), after: after.peak });
  assert(during.rms > 0.01 && after.peak < 1e-3 && held.voices[0].ended, 'valorem held strings loop then release');
  assert(proInstrumentTailSeconds({ synthId: 'valorem', params: defaults }, { pitch: 60, dur: 1 }) === defaults.release, 'valorem tail = release');
  // Custom pack zone on layer A: a 440 Hz sine recorded at A4 plays the requested key.
  const sine = (ctx) => { const b = ctx.createBuffer(1, 44100 * 2, 44100); for (let i = 0; i < b.length; i++) b.getChannelData(0)[i] = 0.5 * Math.sin((2 * Math.PI * 440 * i) / 44100); return b; };
  const config = normalizeInstrumentConfig('valorem', { sources: [{ id: 's1', sourceTrackId: 'sine' }], zones: [{ id: 'z', sourceId: 's1', rootMidi: 69, lowMidi: 0, highMidi: 127 }] });
  const custom = await play({ ...defaults, bType: 'off', sustain: 1 }, { notes: [{ pitch: 57, dur: 1.2 }], seconds: 1.5, config, buffers: { sine } });
  const est = pitchOf(custom.data, 44100, 0.3, 0.9);
  rows.push({ customZonePitch: +est.toFixed(1) });
  assert(Math.abs(est - 220) < 3, 'valorem custom zone pitch ' + est);
  return rows;
}
