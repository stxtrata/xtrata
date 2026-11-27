// Offline DSP checks for the ELEMENTS suite, run through the real plugin registry.
import { PLUGIN_TYPES, pluginDefaults, pluginLatencySamples, pluginTailSeconds } from '../daw/js/plugins.js';

export const ELEMENTS = ['neon', 'iron', 'titanium', 'carbon', 'helium', 'mercury'];
function assert(ok, message) { if (!ok) throw new Error(message); }
const SR = 48000;
function stats(buf, from = 0, to = buf.duration) {
  let peak = 0, sum = 0, n = 0, bad = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    for (let i = Math.floor(from * buf.sampleRate); i < Math.min(d.length, Math.floor(to * buf.sampleRate)); i++) { const v = d[i]; if (!Number.isFinite(v)) bad++; else { peak = Math.max(peak, Math.abs(v)); sum += v * v; n++; } }
  }
  return { peak, rms: Math.sqrt(sum / Math.max(1, n)), bad };
}
const sine = (hz, a = 0.25) => (i) => a * Math.sin((2 * Math.PI * hz * i) / SR);
async function render(id, P = {}, { seconds = 1, signal = sine(997), right = null } = {}) {
  const ctx = new OfflineAudioContext(2, Math.ceil(SR * seconds), SR), type = PLUGIN_TYPES[id];
  const nodes = type.create(ctx, {});
  type.apply(ctx, nodes, { ...pluginDefaults(id), ...P });
  if (nodes.ready) await nodes.ready;
  const src = ctx.createBufferSource(), b = ctx.createBuffer(2, ctx.length, SR);
  for (let i = 0; i < b.length; i++) { b.getChannelData(0)[i] = signal(i); b.getChannelData(1)[i] = right ? right(i) : signal(i); }
  src.buffer = b; src.connect(nodes.input); nodes.output.connect(ctx.destination); src.start();
  const out = await ctx.startRendering();
  const meter = type.meter?.(nodes);
  type.dispose?.(nodes);
  return { out, input: b, meter, nodes };
}
export async function verifyElements() {
  const rows = [];
  for (const id of ELEMENTS) {
    const t = PLUGIN_TYPES[id];
    assert(t && t.category === 'Elements', `${id} registered in the Elements category`);
    const d = stats((await render(id)).out);
    assert(d.bad === 0 && d.peak > 1e-3 && d.peak < 2, `${id} default ${JSON.stringify(d)}`);
    for (const bound of ['min', 'max']) {
      const P = Object.fromEntries(t.params.map((p) => [p.key, p.options ? p.options[bound === 'min' ? 0 : p.options.length - 1][0] : p[bound]]));
      const s = stats((await render(id, P, { seconds: 0.6 })).out);
      assert(s.bad === 0 && s.peak < 64, `${id} all-${bound} ${JSON.stringify(s)}`);
    }
    for (const p of t.params.filter((q) => q.options)) for (const [v] of p.options) {
      const s = stats((await render(id, { [p.key]: v }, { seconds: 0.4 })).out);
      assert(s.bad === 0, `${id} ${p.key}=${v}`);
    }
    rows.push({ id, name: t.name, defaultPeak: +d.peak.toFixed(4), latency: pluginLatencySamples(id, pluginDefaults(id), SR), tail: +pluginTailSeconds(id, pluginDefaults(id)).toFixed(3) });
  }
  // NEON: defaults are transparent; a +6 dB bell at 1 kHz measures +6 dB.
  {
    const r = await render('neon'); let diff = 0;
    for (let i = 0; i < r.out.length; i++) diff = Math.max(diff, Math.abs(r.out.getChannelData(0)[i] - r.input.getChannelData(0)[i]));
    const bell = await render('neon', { p2Freq: 1000, p2Gain: 6, p2Q: 2 }, { signal: sine(1000, 0.05) });
    const gain = 20 * Math.log10(stats(bell.out, 0.5, 0.9).rms / (0.05 / Math.SQRT2));
    rows.push({ check: 'neon', nullPeak: diff, bellDb: +gain.toFixed(2) });
    assert(diff < 1e-5 && Math.abs(gain - 6) < 0.15, 'neon transparency/bell');
  }
  // IRON: compresses a loud tone; parallel mix stays phase-aligned at ratio 1.
  {
    const loud = await render('iron', { threshold: -30, ratio: 8, attack: 0.001 }, { signal: sine(500, 0.7) });
    const quiet = stats(loud.out, 0.6, 0.9).rms / (0.7 / Math.SQRT2);
    const lat = pluginLatencySamples('iron', {}, SR);
    const par = await render('iron', { ratio: 1, mix: 0.5, knee: 0 }, { signal: sine(2000, 0.1) });
    let err = 0;
    for (let i = SR * 0.3; i < SR * 0.9; i++) err = Math.max(err, Math.abs(par.out.getChannelData(0)[i] - par.input.getChannelData(0)[i - lat]));
    // Characters change timing only: with ratio 1 every character passes a tone unchanged.
    for (const character of ['clean', 'punch', 'opto', 'vintage']) {
      const r = await render('iron', { ratio: 1, threshold: 0, knee: 0, character }, { signal: sine(1000, 0.5) }), d = r.out.getChannelData(0);
      const tone = (hz) => { let re = 0, im = 0; for (let i = SR / 2; i < SR; i++) { re += d[i] * Math.cos(2 * Math.PI * hz * i / SR); im += d[i] * Math.sin(2 * Math.PI * hz * i / SR); } return Math.hypot(re, im) * 4 / SR; };
      const level = 20 * Math.log10(tone(1000) / 0.5), h3 = 20 * Math.log10(tone(3000) / tone(1000) + 1e-12);
      assert(Math.abs(level) < 0.5 && h3 < -60, `iron ${character} is clean at ratio 1 (${level.toFixed(2)} dB, h3 ${h3.toFixed(0)} dB)`);
    }
    rows.push({ check: 'iron', reduction: loud.meter.reduction, gainAtLoud: +quiet.toFixed(3), parallelError: err });
    assert(quiet < 0.5 && loud.meter.reduction < -6, 'iron compresses');
    assert(err < 2e-3, 'iron parallel mix aligned ' + err);
  }
  // TITANIUM: loud input never exceeds the ceiling.
  {
    const r = await render('titanium', { gain: 12, ceiling: -3 }, { signal: sine(997, 0.8) });
    const s = stats(r.out, 0.1);
    rows.push({ check: 'titanium', peak: +s.peak.toFixed(4), ceiling: +Math.pow(10, -3 / 20).toFixed(4) });
    assert(s.peak <= Math.pow(10, -3 / 20) + 1e-4, 'titanium ceiling');
  }
  // CARBON: undriven bands sum to a flat magnitude, including at both splits.
  {
    const dbs = [];
    for (const hz of [60, 200, 800, 3000, 9000]) {
      const r = await render('carbon', {}, { signal: sine(hz, 0.1) });
      dbs.push(+(20 * Math.log10(stats(r.out, 0.5, 0.9).rms / (0.1 / Math.SQRT2))).toFixed(3));
    }
    const driven = await render('carbon', { midDrive: 1, style: 'hard' }, { signal: sine(1000, 0.6) });
    // Mix blends phase-matched paths: no notch at the splits at 50%.
    const half = [];
    for (const hz of [200, 3000]) { const r = await render('carbon', { mix: 0.5 }, { signal: sine(hz, 0.1) }); half.push(+(20 * Math.log10(stats(r.out, 0.5, 0.9).rms / (0.1 / Math.SQRT2))).toFixed(3)); }
    assert(half.every((v) => Math.abs(v) < 0.1), 'carbon mix 50% flat at the splits ' + half);
    const tube = await render('carbon', { lowDrive: 1, midDrive: 1, highDrive: 1, style: 'tube' }, { signal: sine(100, 0.5) });
    let dc = 0; const td = tube.out.getChannelData(0); for (let i = SR / 2; i < SR; i++) dc += td[i] / (SR / 2);
    assert(Math.abs(dc) < 2e-3, 'carbon removes drive DC ' + dc);
    rows.push({ check: 'carbon', flatDb: dbs, mixHalfDb: half, dc: +dc.toFixed(5), drivenPeak: +stats(driven.out).peak.toFixed(3) });
    assert(dbs.every((v) => Math.abs(v) < 0.1), 'carbon flat sum ' + dbs);
  }
  // HELIUM: an impulse produces a decaying, stereo, deterministic tail.
  {
    const imp = (i) => (i === 0 ? 1 : 0);
    const r = await render('helium', { mix: 1, decay: 1, predelay: 0 }, { seconds: 2.5, signal: imp });
    const early = stats(r.out, 0.05, 0.5), late = stats(r.out, 2, 2.5);
    let stereo = 0; for (let i = 0; i < r.out.length; i++) stereo = Math.max(stereo, Math.abs(r.out.getChannelData(0)[i] - r.out.getChannelData(1)[i]));
    const again = await render('helium', { mix: 1, decay: 1, predelay: 0 }, { seconds: 2.5, signal: imp });
    let det = 0; for (let i = 0; i < r.out.length; i++) det = Math.max(det, Math.abs(r.out.getChannelData(0)[i] - again.out.getChannelData(0)[i]));
    rows.push({ check: 'helium', early: early.rms, late: late.rms, stereo, deterministic: det });
    assert(early.rms > 1e-4 && late.rms < early.rms * 1e-2 && stereo > 1e-4 && det < 1e-7, 'helium tail');
  }
  // MERCURY: echo lands on the tempo grid; ping-pong starts on the left.
  {
    const imp = (i) => (i === 0 ? 1 : 0);
    const r = await render('mercury', { mix: 1, feedback: 0.5, pingpong: 1, bpm: 120, time: '1/8.', hp: 20, lp: 20000 }, { seconds: 1.5, signal: imp });
    const peakAt = (c, from, to) => { const d = r.out.getChannelData(c); let at = Math.floor(from * SR); for (let i = at; i < Math.floor(to * SR); i++) if (Math.abs(d[i]) > Math.abs(d[at])) at = i; return { at: at / SR, v: Math.abs(d[at]) }; };
    const l1 = peakAt(0, 0.3, 0.45), r1 = peakAt(1, 0.3, 0.45), r2 = peakAt(1, 0.7, 0.8);
    rows.push({ check: 'mercury', firstLeft: l1, firstRight: r1.v, secondRight: r2 });
    assert(Math.abs(l1.at - 0.375) < 0.002 && l1.v > 0.3 && r1.v < 1e-3 && Math.abs(r2.at - 0.75) < 0.003 && r2.v > 0.1, 'mercury timing/ping-pong');
    assert(pluginTailSeconds('mercury', { ...pluginDefaults('mercury'), time: '1/2' }, { bpm: 70 }) > pluginTailSeconds('mercury', { ...pluginDefaults('mercury'), time: '1/2' }, { bpm: 140 }) * 1.9, 'mercury tail follows host tempo');
    assert(Math.abs(pluginTailSeconds('mercury', { ...pluginDefaults('mercury'), bpm: 120 }) - 0.375 * Math.ceil(Math.log(1e-4) / Math.log(0.4))) < 1e-6, 'mercury tail');
  }
  return rows;
}
