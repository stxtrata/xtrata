// Song instruction compatibility, verified against the original on-chain samplers.
import {
  makeProject,
  makeChannel,
  makeSequence,
  MAX_CHANNELS,
  MAX_SEQUENCES,
} from "./state.js";
const keys = [
  "projectName",
  "artistName",
  "projectBPM",
  "currentSequence",
  "channelURLs",
  "channelVolume",
  "channelPlaybackSpeed",
  "trimSettings",
  "projectChannelNames",
  "startSliderValue",
  "endSliderValue",
  "totalSampleDuration",
  "start",
  "end",
  "projectSequences",
  "steps",
];
export const LANDMARKS = {
  "7d058415fb8b6d35fddd375208648254bcb0e4e470b4b25da3dac32d8b04b935i0": {
    kind: "application",
  },
  "09e0b0c471a6a89c1385c67016e5e6a97f6a6df38207c2d79da67cadf0774368i0": {
    kind: "application",
  },
  "598a448d0e134e90855e6fba03d7b2e2610423f185ba513d3c1a8022a9d0d591i0": {
    kind: "application",
  },
  ade52434daf0667a061da2307b74ab7c217b46b1e8bc0d8d649c35b203ee16d6i0: {
    kind: "application",
  },
  a5e9d3fe0cb8e3378e478b2c2ae1f222d01536f069ce4d42ac2c9b7989b74a75i0: {
    kind: "remix",
  },
  cea4d582a419e6c7561af335ed08b6b47384d6f2c25d0f682c3019c7f2a305e4i0: {
    kind: "song",
    data: "4521e117df5bf3f9495f22e2b453d1d379b2432ac7ec56403d46b35474e490eai0",
    engine:
      "62457dbf41153a12f96abc351cd2f16e62e897b43aa9d2893e9a837966ff0357i0",
    endStep: 1030,
  },
  a449a3401142ce6118e13106dcaf61b7d17fb3cfadf26a5079154f9cca1862b7i0: {
    kind: "song",
    data: "5527d0cc95ce5ce6eedf4e275234da8b1fe087512d0db618b6de1aaad437c96bi0",
    engine:
      "d43e19008669597a77865b71018d78c64f83ca36eb961c885ca2a7403f7bf32ci0",
  },
  "9c04932d96d505fd30ed29308665b31565e9ff6955f2ffe559b47d036faddb0bi0": {
    kind: "song",
    data: "633100d631767ddb9a309f5a2a66f5a66d5abd839f3b1c55642690d484189971i0",
    engine:
      "d43e19008669597a77865b71018d78c64f83ca36eb961c885ca2a7403f7bf32ci0",
  },
};
const fail = (message) => {
  throw new Error(message);
};
const number = (v, fallback) =>
  v == null
    ? fallback
    : Number.isFinite(+v)
      ? +v
      : fail("Invalid numeric song setting.");
const bounded = (v, fallback, min, max) => {
  const n = number(v, fallback);
  if (n < min || n > max) fail(`Song setting ${n} is outside ${min}–${max}.`);
  return n;
};
export function sampleReference(value) {
  if (!value) return null;
  const v = String(value).trim();
  const m =
    v.match(
      /^(?:https?:\/\/[^/]+)?\/content\/([a-f0-9]{64}i\d+)(?:[?#].*)?$/i,
    ) || v.match(/^([a-f0-9]{64}i\d+)$/i);
  if (m) return { type: "ordinal", value: m[1].toLowerCase() };
  if (/^https?:\/\//i.test(v)) return { type: "url", value: v };
  fail("Song contains an unsupported sample reference.");
}
export function expandSteps(steps) {
  if (!Array.isArray(steps)) fail("Song steps must be an array.");
  return steps
    .flatMap((v) => {
      if (typeof v === "number") return { index: v, reverse: false };
      if (typeof v === "string" && /^\d+r$/.test(v))
        return { index: +v.slice(0, -1), reverse: true };
      if (v && Array.isArray(v.r) && v.r.length === 2) {
        const [a, b] = v.r;
        if (
          !Number.isInteger(a) ||
          !Number.isInteger(b) ||
          a < 0 ||
          b < a ||
          b > 64
        )
          fail("Invalid compressed step range.");
        return Array.from({ length: b - a + 1 }, (_, i) => ({
          index: a + i,
          reverse: false,
        }));
      }
      if (v && Number.isInteger(v.index))
        return { index: v.index, reverse: !!v.reverse };
      fail("Unrecognised song step.");
    })
    .map((v) => {
      if (!Number.isInteger(v.index) || v.index < 0 || v.index > 64)
        fail("Song step is outside 0–64.");
      return v;
    });
}
function restoreKeys(value) {
  if (Array.isArray(value)) return value.map(restoreKeys);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [keys[k] || k, restoreKeys(v)]),
    );
  return value;
}
export function songToProject(raw, provenance = {}) {
  const og = !!raw?.audxData;
  const data = og ? raw.audxData : restoreKeys(raw);
  const urls = og ? data.channels?.map((c) => c.url) : data.channelURLs;
  if (!Array.isArray(urls) || !urls.length || urls.length > MAX_CHANNELS)
    fail("Song needs 1–64 sample channels.");
  const p = makeProject();
  p.format = "audional-sequencer-l1xl2/1";
  p.projectName = String(
    og
      ? raw.descriptive?.title || raw.filename || "OG song"
      : data.projectName || "On-chain song",
  );
  p.artistName = String(
    og ? raw.descriptive?.creator || "" : data.artistName || "",
  );
  p.bpm = bounded(og ? data.bpm : data.projectBPM, 120, 20, 420);
  p.masterVolume = 0.9;
  p.playEmptySequences = true; // Empty sequences are meaningful rests in a song.
  p.channels = urls.map((url, i) => {
    const c = makeChannel(i);
    c.source = sampleReference(url);
    c.name = String(
      data.projectChannelNames?.[i] || `Song channel ${i + 1}`,
    ).slice(0, 64);
    c.sampleName = c.name;
    c.volume = bounded(data.channelVolume?.[i], 1, 0, 3);
    c.pitch = bounded(data.channelPlaybackSpeed?.[i], 1, 0.1, 100);
    const t = data.trimSettings?.[i] || {};
    c.trimStart = bounded(t.startSliderValue ?? t.start, 0, 0, 100) / 100;
    c.trimEnd = bounded(t.endSliderValue ?? t.end, 100, 0, 100) / 100;
    if (c.trimEnd <= c.trimStart)
      fail("Song contains an empty or reversed trim.");
    return c;
  });
  if (og) {
    // OG triggers are one-based; toggleMuteSteps uses the zero-based total counter.
    const end = bounded(
      provenance.endStep,
      Math.max(64, ...data.channels.flatMap((c) => c.toggleMuteSteps || [])) +
        1,
      1,
      MAX_SEQUENCES * 64,
    );
    p.songEndStep = Math.ceil(end);
    p.sequences = Array.from({ length: Math.ceil(end / 64) }, () =>
      makeSequence(urls.length),
    );
    data.channels.forEach((c, ch) => {
      const triggers = new Set(
        (c.triggers || []).map((v) => bounded(v, 0, 1, 64) - 1),
      );
      const toggles = new Set(c.toggleMuteSteps || []);
      let muted = !!c.mute;
      for (let step = 0; step < end; step++) {
        if (toggles.has(step)) muted = !muted;
        if (!muted && triggers.has(step % 64))
          p.sequences[Math.floor(step / 64)].steps[ch][step % 64] = 1;
      }
    });
  } else {
    const seqs = data.projectSequences;
    if (!seqs || typeof seqs !== "object")
      fail("This inscription contains no song sequences.");
    const rows = Object.entries(seqs).sort(
      ([a], [b]) =>
        number(a.replace(/\D/g, ""), 0) - number(b.replace(/\D/g, ""), 0),
    );
    if (!rows.length || rows.length > MAX_SEQUENCES)
      fail("Song needs 1–64 sequences.");
    p.sequences = rows.map(([, channels]) => {
      const seq = makeSequence(urls.length);
      for (const [key, value] of Object.entries(channels)) {
        const ch = /^[A-Z]$/.test(key)
          ? key.charCodeAt(0) - 65
          : /^(?:ch)?\d+$/.test(key)
            ? +key.replace("ch", "")
            : NaN;
        if (!Number.isInteger(ch) || ch < 0 || ch >= urls.length)
          fail("Song references an unavailable channel.");
        // The original player compares against currentStep 0–63. Saved 64s never trigger.
        for (const s of expandSteps(value.steps || []))
          if (s.index < 64)
            seq.steps[ch][s.index] = s.reverse ? { v: 1, rev: true } : 1;
      }
      return seq;
    });
    p.songEndStep = p.sequences.length * 64;
  }
  p.songOrigin = {
    ...provenance,
    format: og ? "audx" : "compressed-b64x",
    stepBase: og ? 1 : 0,
  };
  return p;
}
