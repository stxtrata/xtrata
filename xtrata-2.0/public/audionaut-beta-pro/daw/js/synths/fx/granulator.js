import { defaultInstrumentConfig, resolveInstrumentBuffer } from '../../pro-instruments-config.js';
import { sourceSample, cachedSample, clamp } from '../../pro-instruments-runtime.js';
import { seededRandom } from '../resources.js';

export function granularStarterSample(ctx) {
  return sourceSample(ctx, 'audionaut-original-grain-source-v1', 3, (data, sr, random) => {
    let low = 0;
    for (let i = 0; i < data.length; i++) {
      const t = i / sr; low += .06 * ((random() * 2 - 1) - low);
      data[i] = (Math.sin(2 * Math.PI * 130.8128 * t) * .22 + Math.sin(2 * Math.PI * 196 * t) * .13 + Math.sin(2 * Math.PI * 329.628 * t) * .08 + low * .12) * (.7 + .3 * Math.sin(2 * Math.PI * .7 * t)) * Math.min(1, t * 20);
    }
  });
}
const defaults = { position: .3, scan: .08, grainMs: 85, density: 18, spray: .2, detune: 7, spread: .6, transpose: 0, brightness: .75, attack: .04, release: .25, level: .8 };
function grainParams(patch) {
  const p = { ...defaults, ...patch };
  for (const [key, min, max] of [['position', 0, 1], ['scan', -1, 1], ['grainMs', 15, 250], ['density', 4, 60], ['spray', 0, 1], ['detune', 0, 100], ['spread', 0, 1], ['transpose', -24, 24], ['brightness', 0, 1], ['attack', .001, 2], ['release', .01, 4], ['level', 0, 1.5]]) p[key] = clamp(Number.isFinite(p[key]) ? p[key] : defaults[key], min, max);
  return p;
}
const modulo = (value, length) => (value % length + length) % length;
const MAX_GRAINS = 8192;
export function createGranulatorVoice(ctx, destination, instrument, config, note, params, onEnded, options = {}) {
  const buffer = config.sourceId ? resolveInstrumentBuffer(config, config.sourceId, options.bufferForSource) : granularStarterSample(ctx);
  const offline = options.offline ?? typeof ctx.startRendering === 'function', initial = grainParams(params);
  if (offline && !note.held && Math.ceil((note.dur + .25) * initial.density) > MAX_GRAINS) throw new Error('This granular note exceeds 8192 grains. Split the note, reduce density or freeze a shorter range.');
  const start = Math.max(ctx.currentTime, note.time), origin = start - Math.max(0, note.offset || 0);
  const gate = ctx.createGain(), level = ctx.createGain(), filter = ctx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = Math.min(ctx.sampleRate * .45, 600 + initial.brightness * 17000); filter.Q.value = .6;
  filter.connect(gate).connect(level).connect(destination); level.gain.value = initial.level * clamp(note.vel, 0, 1);
  const age = start - origin;
  gate.gain.setValueAtTime(Math.min(1, age / initial.attack), start);
  if (age < initial.attack) gate.gain.linearRampToValueAtTime(1, start + initial.attack - age);
  const segments = [{ at: origin, params: initial, id: 'start' }], grains = new Map(), bends = [{ at: -Infinity, value: 0 }];
  let stopped = false, ended = false, released = false, timer = null, horizon = start, count = 0;
  let gateEnd = note.held ? Infinity : start + Math.max(.001, note.dur), endTime = Number.isFinite(gateEnd) ? gateEnd + initial.release : Infinity;
  const finish = () => { if (ended || grains.size || !stopped && (!Number.isFinite(endTime) || !offline && ctx.currentTime < endTime)) return; ended = true; clearTimeout(timer); filter.disconnect(); gate.disconnect(); level.disconnect(); onEnded?.(); };
  const bendAt = at => bends.filter(p => p.at <= at).at(-1)?.value || 0;
  function makeGrain(segment, index, at) {
    const key = `${segment.id}:${index}`; if (grains.has(key)) return;
    if (++count > MAX_GRAINS && offline) throw new Error('This granular note exceeds 8192 grains. Split the note, reduce density or freeze a shorter range.');
    const P = segment.params, size = P.grainMs / 1000;
    if (at >= gateEnd || at + size <= Math.max(start, ctx.currentTime)) return;
    const random = seededRandom(`${options.seed ?? 1}:${segment.id}:${index}`), jitter = (random() * 2 - 1) * P.detune;
    const rate = 2 ** ((note.pitch - (config.rootMidi ?? 60) + P.transpose + jitter / 100) / 12);
    const offset = modulo(P.position * Math.max(0, buffer.duration - size * rate) + P.scan * (at - origin) + (random() * 2 - 1) * P.spray * Math.min(buffer.duration * .3, .5), buffer.duration);
    const source = ctx.createBufferSource(), envelope = ctx.createGain(), pan = ctx.createStereoPanner();
    source.buffer = buffer; source.loop = true; source.loopStart = 0; source.loopEnd = buffer.duration;
    source.playbackRate.value = rate; source.detune.setValueAtTime(bendAt(at) * 100, Math.max(start, at)); pan.pan.value = (random() * 2 - 1) * P.spread;
    source.connect(envelope).connect(pan).connect(filter);
    const actual = Math.max(start, ctx.currentTime, at), elapsed = actual - at, duration = size - elapsed, curve = new Float32Array(64);
    const amplitude = .65 / Math.sqrt(Math.max(1, P.density * size / 2));
    for (let i = 0; i < curve.length; i++) curve[i] = Math.sin(Math.PI * (elapsed + duration * i / (curve.length - 1)) / size) ** 2 * amplitude;
    curve[curve.length - 1] = 0;
    envelope.gain.setValueCurveAtTime(curve, actual, duration);
    const grain = { source, envelope, pan, at, key };
    grains.set(key, grain);
    source.onended = () => { if (grains.get(key) === grain) grains.delete(key); source.disconnect(); envelope.disconnect(); pan.disconnect(); finish(); };
    source.start(actual, modulo(offset + elapsed * rate, buffer.duration)); source.stop(Math.min(at + size, endTime) + 1 / ctx.sampleRate);
  }
  function schedule(until) {
    horizon = Math.max(horizon, until);
    for (let s = 0; s < segments.length; s++) {
      const segment = segments[s], limit = Math.min(until, gateEnd, segments[s + 1]?.at ?? Infinity), size = segment.params.grainMs / 1000;
      const from = Math.max(segment.at, start - size, offline ? start - size : ctx.currentTime - size);
      let index = Math.max(0, Math.ceil((from - segment.at) * segment.params.density - 1e-7));
      for (let at = segment.at + index / segment.params.density; at < limit; at = segment.at + ++index / segment.params.density) makeGrain(segment, index, at);
    }
  }
  function tick() {
    timer = null; if (ended || stopped) return;
    if (ctx.currentTime >= endTime) { stopped = true; finish(); return; }
    schedule(Math.max(start, ctx.currentTime) + .14);
    timer = setTimeout(tick, 25);
  }
  function release(at, seconds, immediate = false) {
    if (ended || released && at >= gateEnd && !immediate) return;
    released = true; gateEnd = Math.max(ctx.currentTime, at); endTime = gateEnd + Math.max(.003, seconds);
    gate.gain.cancelScheduledValues(gateEnd); gate.gain.setValueAtTime(Math.min(1, Math.max(0, gateEnd - origin) / initial.attack), gateEnd); gate.gain.linearRampToValueAtTime(0, endTime);
    if (offline) schedule(gateEnd);
    for (const grain of grains.values()) { try { grain.source.stop(Math.min(grain.at + (segments.filter(s => s.at <= grain.at).at(-1)?.params.grainMs || initial.grainMs) / 1000, endTime) + 1 / ctx.sampleRate); } catch {} }
  }
  const voice = {
    get ended() { return ended; }, get released() { return released; }, get endTime() { return endTime; }, get sources() { return [...grains.values()].map(g => g.source); },
    ready: Promise.resolve(true), latencySeconds: 0, tailSeconds: initial.release + initial.grainMs / 1000,
    release(at = ctx.currentTime, seconds = initial.release) { release(at, seconds); },
    stop(at = ctx.currentTime) { release(at, .003, true); if (at <= ctx.currentTime) { stopped = true; clearTimeout(timer); } finish(); },
    setBend(semitones, at = ctx.currentTime) {
      bends.push({ at, value: clamp(semitones, -48, 48) }); bends.sort((a, b) => a.at - b.at);
      for (const grain of grains.values()) grain.source.detune.setValueAtTime(semitones * 100, Math.max(at, grain.at, start));
    },
    setParameters(patch, at = ctx.currentTime, automation = {}) {
      const continuous = (param, value, previous) => { if (automation.curve === 'linear' && automation.startTime < at) { param.setValueAtTime(previous ?? param.value, automation.startTime); param.linearRampToValueAtTime(value, at); } else param.setTargetAtTime(value, at, .008); };
      if (Number.isFinite(patch.level)) continuous(level.gain, patch.level * note.vel, Number.isFinite(automation.fromValues?.level) ? automation.fromValues.level * note.vel : undefined);
      if (Number.isFinite(patch.brightness)) continuous(filter.frequency, Math.min(ctx.sampleRate * .45, 600 + patch.brightness * 17000));
      const structural = Object.keys(patch).filter(key => !['level', 'brightness', 'attack', 'release'].includes(key));
      if (structural.length && at < gateEnd) {
        if (segments.length >= 128) throw new Error('A granular note supports at most 128 structural parameter changes. Split or freeze this note.');
        const previous = segments.filter(segment => segment.at <= at).at(-1)?.params || initial;
        segments.push({ at: Math.max(start, at), id: `change:${at - origin}`, params: grainParams({ ...previous, ...patch }) }); segments.sort((a, b) => a.at - b.at);
        for (const [key, grain] of grains) if (grain.at >= at) { grains.delete(key); try { grain.source.stop(Math.max(ctx.currentTime, at)); } catch {} }
        schedule(horizon);
      }
      return true;
    },
  };
  if (!note.held) release(gateEnd, initial.release);
  if (offline) { schedule(note.held ? start + .14 : gateEnd); }
  else tick();
  return voice;
}
// Generic legacy voice hosts have no custom-device release callback. Their starter
// preview therefore uses an owned looping grain buffer; the engine's device path
// above always reads the selected real sample and schedules deterministic grains.
function starterPreview(ctx, destination, note, params) {
  const P = grainParams(params), key = `granular-preview-v1:${P.position}:${P.grainMs}:${P.density}:${P.spray}:${P.scan}`;
  const buffer = cachedSample(ctx, key, () => {
    const input = granularStarterSample(ctx), sr = 32000, output = ctx.createBuffer(1, sr * 3, sr), data = output.getChannelData(0), samples = input.getChannelData(0), size = Math.round(P.grainMs / 1000 * sr), random = seededRandom(key);
    for (let at = 0; at < data.length; at += Math.round(sr / P.density)) {
      const source = Math.floor(modulo(P.position * samples.length + P.scan * at + (random() * 2 - 1) * P.spray * sr * .3, samples.length));
      for (let i = 0; i < size && at + i < data.length; i++) data[at + i] += samples[(source + i) % samples.length] * Math.sin(Math.PI * i / size) ** 2 * .65 / Math.sqrt(Math.max(1, P.density * P.grainMs / 2000));
    }
    return output;
  });
  const source = ctx.createBufferSource(), gain = ctx.createGain(); source.buffer = buffer; source.loop = !!note.held; source.playbackRate.value = 2 ** ((note.pitch - 60 + P.transpose) / 12); source.connect(gain).connect(destination);
  gain.gain.setValueAtTime(0, note.time); gain.gain.linearRampToValueAtTime(note.vel * P.level, note.time + P.attack);
  source.start(note.time);
  if (!note.held) { gain.gain.setValueAtTime(note.vel * P.level, note.time + note.dur); gain.gain.linearRampToValueAtTime(0, note.time + note.dur + P.release); source.stop(note.time + note.dur + P.release); }
}
export const GRANULATOR_SYNTHS = {
  granulator: {
    name: 'Sample Granulator', tagline: 'Seeded grain clouds from your sample · original procedural starter source', color: '#7acbcc', category: 'fx', sampleInstrument: true,
    params: [
      { key: 'position', label: 'Source position', type: 'range', min: 0, max: 1, step: .01, def: .3 },
      { key: 'scan', label: 'Scan speed', type: 'range', min: -1, max: 1, step: .01, def: .08 },
      { key: 'grainMs', label: 'Grain size ms', type: 'range', min: 15, max: 250, step: 1, def: 85 },
      { key: 'density', label: 'Grains per second', type: 'range', min: 4, max: 60, step: 1, def: 18 },
      { key: 'spray', label: 'Position spray', type: 'range', min: 0, max: 1, step: .01, def: .2 },
      { key: 'detune', label: 'Grain detune cents', type: 'range', min: 0, max: 100, step: 1, def: 7 },
      { key: 'spread', label: 'Stereo spread', type: 'range', min: 0, max: 1, step: .01, def: .6 },
      { key: 'transpose', label: 'Transpose', type: 'range', min: -24, max: 24, step: 1, def: 0 },
      { key: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 1, step: .01, def: .75 },
      { key: 'attack', label: 'Attack', type: 'range', min: .001, max: 2, step: .001, def: .04 },
      { key: 'release', label: 'Release', type: 'range', min: .01, max: 4, step: .01, def: .25 },
      { key: 'level', label: 'Level', type: 'range', min: 0, max: 1.5, step: .01, def: .8 },
    ],
    lines: [{ name: 'Grain cloud', dsl: '0:C3:16:89 16:G3:16:76' }],
    voice: starterPreview,
    starterDescription: 'A locally generated original harmonic/noise source. Import audio or select an Xtrata sample to granulate that recording. Structural grain controls apply at grain boundaries.',
  },
};
