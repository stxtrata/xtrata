import { ResourceCache, seededRandom, canonicalContext } from './synths/resources.js';
export const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
export const frequency = midi => 440 * 2 ** ((midi - 69) / 12);
const caches = new WeakMap();
export function cachedSample(ctx, key, build) {
  const owner = canonicalContext(ctx); let cache = caches.get(owner);
  if (!cache) { cache = new ResourceCache(32 * 1024 * 1024); caches.set(owner, cache); }
  let buffer = cache.get(key);
  if (!buffer) { buffer = build(); cache.set(key, buffer, buffer.length * buffer.numberOfChannels * 4); }
  return buffer;
}
export function starterCacheStats(ctx) { return caches.get(canonicalContext(ctx))?.stats() || { entries: 0, bytes: 0, maxBytes: 32 * 1024 * 1024 }; }
export function sourceSample(ctx, key, seconds, generator, sampleRate = 32000) {
  return cachedSample(ctx, key, () => {
    const length = Math.ceil(seconds * sampleRate), buffer = ctx.createBuffer(1, length, sampleRate), data = buffer.getChannelData(0);
    generator(data, sampleRate, seededRandom(key));
    const fade = Math.min(128, Math.floor(length / 10));
    for (let i = 0; i < fade; i++) data[length - 1 - i] *= i / fade;
    return buffer;
  });
}
export function ownSampleVoice(ctx, destination, buffer, note, settings, onEnded) {
  const time = Math.max(ctx.currentTime, note.time), attack = Math.max(.001, settings.attack ?? .002), release = Math.max(.005, settings.release ?? .15), rate = settings.rate || 1;
  const loop = settings.loop;
  if (loop && !(loop.end > loop.start && loop.start >= 0 && loop.end <= buffer.duration)) throw new Error('This sample loop is outside its audio buffer.');
  const source = ctx.createBufferSource(), envelope = ctx.createGain(), level = ctx.createGain(), filter = ctx.createBiquadFilter(), pan = ctx.createStereoPanner();
  source.buffer = buffer; source.playbackRate.value = rate;
  filter.type = 'lowpass'; filter.frequency.value = Math.min(ctx.sampleRate * .45, settings.cutoff ?? 18000); filter.Q.value = .6;
  level.gain.value = (settings.level ?? 1) * Math.max(0, note.vel); pan.pan.value = settings.pan || 0;
  source.connect(filter).connect(envelope).connect(level).connect(pan).connect(destination);
  if (loop) {
    source.loop = true; source.loopStart = loop.start; source.loopEnd = loop.end;
  }
  const age = Math.max(0, note.offset || 0), rawOffset = age * rate;
  const offset = loop && rawOffset >= loop.end ? loop.start + (rawOffset - loop.start) % (loop.end - loop.start) : rawOffset;
  envelope.gain.setValueAtTime(Math.min(1, age / attack), time);
  if (age < attack) envelope.gain.linearRampToValueAtTime(1, time + attack - age);
  let ended = false, released = false, releaseAt = null, endTime = loop ? Infinity : time + Math.max(0, buffer.duration - offset) / rate;
  const finish = () => { if (ended) return; ended = true; for (const node of [source, filter, envelope, level, pan]) node.disconnect(); onEnded?.(); };
  const fade = (at, seconds, force = false) => {
    if (ended || settings.oneShot && !force) return;
    if (releaseAt != null && releaseAt <= at && !force) return;
    released = true; releaseAt = at; const start = Math.max(ctx.currentTime, at), duration = Math.max(.003, seconds);
    const amplitude = Math.min(1, Math.max(0, age + start - time) / attack);
    envelope.gain.cancelScheduledValues(start); envelope.gain.setValueAtTime(amplitude, start); envelope.gain.linearRampToValueAtTime(0, start + duration);
    endTime = Math.min(endTime, start + duration); try { source.stop(endTime + 1 / ctx.sampleRate); } catch { finish(); }
  };
  const voice = {
    get ended() { return ended; }, get released() { return released; }, get endTime() { return endTime; }, get sources() { return [source]; },
    ready: Promise.resolve(true), oneShot: !!settings.oneShot, latencySeconds: 0, tailSeconds: settings.oneShot ? buffer.duration / rate : release,
    release(at = ctx.currentTime, seconds = release) { fade(at, seconds); },
    choke(at = ctx.currentTime) { fade(at, .004, true); },
    stop(at = ctx.currentTime) { fade(at, .003, true); },
    setBend(semitones, at = ctx.currentTime) { source.detune.setValueAtTime(clamp(semitones, -48, 48) * 100, at); },
    setParameters(patch, at = ctx.currentTime, automation = {}) {
      const set = (param, value, from) => { if (automation.curve === 'linear' && automation.startTime < at) { param.setValueAtTime(from ?? param.value, automation.startTime); param.linearRampToValueAtTime(value, at); } else param.setTargetAtTime(value, at, .008); };
      if (Number.isFinite(patch.level)) set(level.gain, patch.level * note.vel * (settings.zoneGain ?? 1), Number.isFinite(automation.fromValues?.level) ? automation.fromValues.level * note.vel * (settings.zoneGain ?? 1) : undefined);
      if (Number.isFinite(patch.brightness)) set(filter.frequency, Math.min(ctx.sampleRate * .45, 600 + patch.brightness * 17000));
      if (Number.isFinite(patch.pan)) set(pan.pan, clamp(patch.pan, -1, 1));
      return true;
    },
  };
  source.onended = finish;
  if (offset >= buffer.duration && !loop) { queueMicrotask(finish); return voice; }
  source.start(time, offset);
  if (!note.held && !settings.oneShot) fade(time + Math.max(.001, note.dur), release);
  return voice;
}
