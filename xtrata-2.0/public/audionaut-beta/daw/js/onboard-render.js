import { SYNTH_BANK, synthDefaults, midiToFreq } from "./synths.js";
import { renderSynthSample } from "./synthdrums.js";
import { encodeWav } from "./audio-utils.js";
import { LIBRARY_VERSION, assetKey } from "./onboard-catalog.js";
const SR = 44100,
  TAU = Math.PI * 2;
function random(seed) {
  let x = seed >>> 0;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return (x / 4294967296) * 2 - 1;
  };
}
function buffer(seconds, stereo = false) {
  return new AudioBuffer({
    length: Math.ceil(seconds * SR),
    sampleRate: SR,
    numberOfChannels: stereo ? 2 : 1,
  });
}
function dsp(sound, root, velocity) {
  const r = sound.recipe,
    f = midiToFreq(root ?? 48),
    rand = random(r.seed),
    sustain = r.engine === "sustain";
  const seconds = sustain ? 3.7 : Math.max(0.4, r.gate + r.release + 1),
    out = buffer(seconds, r.stereo),
    length = out.length;
  let loop = null;
  if (sustain) {
    const cycles = Math.round(f),
      period = Math.round((cycles * SR) / f),
      start = Math.ceil((r.attack * SR) / period) * period;
    loop = { start: start / SR, end: (start + period) / SR };
    for (let c = 0; c < out.numberOfChannels; c++) {
      const a = out.getChannelData(c);
      for (let n = 0; n < length; n++) {
        const t = n / SR,
          phase = (TAU * (n % period)) / period;
        let v = 0;
        for (let h = 1; h <= 7; h++) {
          const cycle =
            cycles * h + (c && h > 1 ? Math.round(h * ((r.index % 3) + 1)) : 0);
          v +=
            Math.sin(phase * cycle + (h > 1 ? 0.35 * h : 0)) *
            (h === 1 ? 1 : r.brightness / h ** (1.1 + (r.index % 3) * 0.3));
        }
        const env =
          Math.min(1, t / r.attack) *
          Math.min(1, Math.max(0, (seconds - t) / 0.65));
        a[n] = v * env * 0.3;
      }
    }
    return { out, loop };
  }
  if (r.engine === "string") {
    const period = Math.max(2, Math.round(SR / f - 0.5)),
      ring = new Float32Array(period);
    for (let j = 0; j < period; j++) ring[j] = rand() * velocity;
    let at = 0;
    const a = out.getChannelData(0);
    for (let n = 0; n < length; n++) {
      const v = ring[at];
      ring[at] = (v + ring[(at + 1) % period]) * 0.5 * r.damping;
      at = (at + 1) % period;
      a[n] =
        v *
        Math.min(1, n / (SR * 0.002)) *
        Math.exp(-n / SR / (0.1 + r.release / 4));
    }
    return { out, loop };
  }
  const a = out.getChannelData(0),
    i = r.index;
  for (let n = 0; n < length; n++) {
    const t = n / SR;
    let v = 0;
    if (r.engine === "percussion") {
      const noise = rand(),
        attack = Math.min(1, t / 0.001);
      if (i < 4) {
        const base = 42 + i * 11,
          phase =
            TAU * (base * t + (0.55 + i * 0.2) * (1 - Math.exp(-t / 0.018)));
        v =
          Math.sin(phase) * Math.exp(-t / (0.07 + i * 0.028)) +
          noise * 0.14 * Math.exp(-t / 0.004);
      } else if (i < 8)
        v =
          noise * Math.exp(-t / (0.05 + (i - 4) * 0.023)) * 0.65 +
          Math.sin(TAU * (150 + i * 20) * t) * Math.exp(-t / 0.045) * 0.3;
      else if (i < 11) {
        for (let k = 0; k < 3; k++) {
          const dt = t - k * (0.009 + (i - 8) * 0.003);
          if (dt >= 0) v += noise * 0.3 * Math.exp(-dt / 0.035);
        }
      } else if (i < 14)
        v =
          (noise * 0.4 +
            Math.sin(TAU * 5300 * t) *
              Math.sin(TAU * (6900 + i * 231) * t) *
              0.25) *
          Math.exp(-t / (0.035 + (i - 11) * 0.035));
      else if (i < 18)
        v =
          (Math.sin(TAU * f * t) +
            0.28 * Math.sin(TAU * f * (2.1 + (i - 14) * 0.19) * t)) *
          Math.exp(-t / (0.11 + (i - 14) * 0.045));
      else if (i < 21)
        v =
          noise *
          Math.exp(-t / 0.22) *
          Math.max(0, Math.sin(TAU * (13 + (i - 18) * 8) * t)) *
          0.6;
      else if (i === 21)
        v =
          Math.sin(TAU * (31 * t + 2 * (1 - Math.exp(-t / 0.045)))) *
            Math.exp(-t / 0.4) +
          noise * 0.15 * Math.exp(-t / 0.1);
      else if (i === 22)
        v = noise * 0.4 * Math.max(0, 1 - Math.abs(t - 0.25) / 0.25);
      else {
        const burst = t % 0.09;
        v =
          (noise * 0.3 +
            Math.sin(TAU * (190 + Math.floor(t / 0.09) * 110) * t) * 0.3) *
          Math.exp(-burst / 0.012) *
          Math.max(0, 1 - t / 0.55);
      }
      v *= attack;
    } else {
      const chord = r.engine === "chord" ? r.voicing : [0];
      for (const offset of chord) {
        const freq = f * 2 ** (offset / 12);
        for (let h = 0; h < r.partials.length; h++) {
          if (sound.family === "bass" && i === 0 && h > 0) continue;
          const ratio =
            r.engine === "partials"
              ? r.partials[h]
              : sound.family === "bass" && i === 1
                ? 2 * h + 1
                : h + 1;
          if (freq * ratio > SR * 0.45) continue;
          const amp =
            h === 0
              ? 1
              : (r.brightness * velocity) /
                (h + 1) ** (r.engine === "additive" ? 1.3 : 1.9);
          const decay =
            (r.engine === "partials" ? r.release / (1 + h * 0.4) : r.release) /
              7 +
            0.02;
          const env =
            Math.min(1, t / r.attack) *
            Math.exp(-Math.max(0, t - r.gate) / decay);
          v += (Math.sin(TAU * freq * ratio * t) * amp * env) / chord.length;
        }
      }
      v *= velocity * 0.5;
    }
    a[n] = v;
  }
  return { out, loop };
}
export function finalizeAudio(raw, family, loop = null, velocity = 1) {
  // Work on a copy; never mutate cached legacy renders.
  let end = raw.length;
  if (!loop) {
    while (end > 128) {
      let peak = 0;
      for (let c = 0; c < raw.numberOfChannels; c++)
        peak = Math.max(peak, Math.abs(raw.getChannelData(c)[end - 1]));
      if (peak > 1e-5) break;
      end--;
    }
  }
  const out = new AudioBuffer({
    length: end,
    sampleRate: raw.sampleRate,
    numberOfChannels: raw.numberOfChannels,
  });
  let peak = 0;
  for (let c = 0; c < raw.numberOfChannels; c++) {
    const src = raw.getChannelData(c),
      dst = out.getChannelData(c);
    let sum = 0;
    for (let n = 0; n < end; n++) {
      if (!Number.isFinite(src[n]))
        throw new Error("Non-finite generated audio.");
      sum += src[n];
    }
    const dc = sum / end;
    for (let n = 0; n < end; n++) {
      let v = src[n] - dc;
      const fade = Math.min(128, end / 4);
      v *= Math.min(1, n / fade, (end - 1 - n) / fade);
      dst[n] = v;
    }
    // Remove the small residual DC introduced by edge fades, with zero-valued edges retained.
    let weighted = 0,
      totalWeight = 0;
    const fade = Math.min(128, end / 4);
    for (let n = 0; n < end; n++) {
      const w = Math.min(1, n / fade, (end - 1 - n) / fade);
      weighted += dst[n];
      totalWeight += w;
    }
    const correction = weighted / totalWeight;
    for (let n = 0; n < end; n++) {
      dst[n] -= correction * Math.min(1, n / fade, (end - 1 - n) / fade);
      peak = Math.max(peak, Math.abs(dst[n]));
    }
  }
  const target =
    family === "pads" ? 0.5 : family === "bass" ? 0.63 : 0.707945784;
  const gain = peak > 0 ? (target * (0.65 + 0.35 * velocity)) / peak : 1;
  let square = 0,
    dc = 0,
    measuredPeak = 0;
  for (let c = 0; c < out.numberOfChannels; c++) {
    const dst = out.getChannelData(c);
    for (let n = 0; n < end; n++) {
      dst[n] *= gain;
      square += dst[n] ** 2;
      dc += dst[n];
      measuredPeak = Math.max(measuredPeak, Math.abs(dst[n]));
    }
  }
  return {
    audioBuffer: out,
    measurements: {
      duration: out.duration,
      sampleRate: out.sampleRate,
      channels: out.numberOfChannels,
      peak: measuredPeak,
      rms: Math.sqrt(square / (end * out.numberOfChannels)),
      dc: dc / (end * out.numberOfChannels),
      headroomDb: -20 * Math.log10(measuredPeak),
      finite: true,
    },
  };
}
export async function renderOnboard(
  sound,
  root = sound.rootMidi,
  velocity = 1,
) {
  const r = sound.recipe;
  let raw,
    loop = null;
  if (r.engine === "legacy") raw = await renderSynthSample(r.legacyKey);
  else if (SYNTH_BANK[r.engine]) {
    const seconds = r.gate + r.release + 0.5,
      ctx = new OfflineAudioContext(1, Math.ceil(seconds * SR), SR),
      params = {
        ...synthDefaults(r.engine),
        ...r.synthParams,
        release: r.release,
        attack: r.attack,
      };
    // Velocity layers change brightness and FM depth as well as amplitude.
    params.cutoff *= 0.65 + 0.35 * velocity;
    params.index *= velocity;
    SYNTH_BANK[r.engine].voice(
      ctx,
      ctx.destination,
      { pitch: root, vel: velocity, time: 0, dur: r.gate },
      params,
    );
    if (r.octave) {
      const layer = ctx.createGain();
      layer.gain.value = 0.25;
      layer.connect(ctx.destination);
      SYNTH_BANK[r.engine].voice(
        ctx,
        layer,
        { pitch: root + r.octave, vel: velocity, time: 0, dur: r.gate },
        params,
      );
    }
    raw = await ctx.startRendering();
  } else {
    const result = dsp(sound, root, velocity);
    raw = result.out;
    loop = result.loop;
  }
  const { audioBuffer, measurements } = finalizeAudio(
    raw,
    sound.family,
    loop,
    velocity,
  );
  const wav = encodeWav(audioBuffer);
  const bytes = await wav.arrayBuffer();
  const hash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    (x) => x.toString(16).padStart(2, "0"),
  ).join("");
  const metadata = {
    soundId: sound.soundId,
    key: sound.key,
    version: LIBRARY_VERSION,
    assetId: assetKey(sound, root, velocity),
    category: sound.family,
    tags: sound.tags,
    rootMidi: root,
    tuningHz: 440,
    velocityLayer: velocity,
    seed: r.seed,
    generator: r.engine,
    recipe: r,
    loop,
    voicing: r.voicing || null,
    ...measurements,
    audioSha256: hash,
  };
  return { audioBuffer, bytes, metadata };
}
