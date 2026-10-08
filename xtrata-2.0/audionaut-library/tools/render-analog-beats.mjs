#!/usr/bin/env node
// Offline render of the Analog Kit drum beats, for checking levels and for audition reels.
//
//   node audionaut-library/tools/render-analog-beats.mjs [--out DIR] [--kit auto|jazz|rusty|unruly|swirly|concert|modern]
//                                                         [--only id,id] [--wav] [--json FILE]
//   node audionaut-library/tools/render-analog-beats.mjs --write-headroom
//                                  (renders every beat of every kit without trims and rewrites
//                                   public/audionaut/daw/js/analog-headroom.js)
//
// Mixes each beat the way the DAW engine does: 64 steps on a 16th grid with swing (odd steps
// delayed by swing% of a step), x = 1.0 and X = 1.25 velocity, channel volume, pitch (playback
// rate), the [0, tail] trim with a 5 ms fade, overlapping voices. Prints per-beat peak and RMS
// and fails on clipping, silence or NaN. With --wav it also writes 16-bit mono WAVs to DIR
// (default: audionaut-library/renders, which is git-ignored: keep generated audio local).
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createDecoder } from "../codecs/codec-flac.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const js = path.resolve(root, "../public/audionaut/daw/js");
const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? dflt : process.argv[i + 1] === undefined || process.argv[i + 1].startsWith("--") ? true : process.argv[i + 1];
};
const kit = arg("kit", "auto");
const out = path.resolve(arg("out", path.join(root, "renders")));
const only = arg("only", null) ? String(arg("only")).split(",") : null;
const writeWav = process.argv.includes("--wav");
const jsonOut = arg("json", null);

const { analogBeats } = await import(pathToFileURL(path.join(js, "analog-kits.js")).href);
const writeHeadroom = process.argv.includes("--write-headroom");
const LIMIT = 0.95; // peak target; the DAW master volume defaults to 0.9
const getBeats = (k, raw) => analogBeats(k, { raw }).filter((b) => !only || only.includes(b.recipeId) || only.includes(b.id));

function readPack(file) {
  const u8 = fs.readFileSync(file);
  const ilen = u8.readUInt32LE(8);
  let ib = u8.subarray(12, 12 + ilen);
  if (u8[5] & 1) ib = zlib.gunzipSync(ib);
  const index = JSON.parse(ib.toString("utf8"));
  const base = 12 + ilen;
  return { index, bytes: (s) => u8.subarray(base + s.offset, base + s.offset + s.length) };
}
const packs = {};
const dec = await createDecoder({ verify: true });
const cache = new Map();
async function sound(value) {
  if (cache.has(value)) return cache.get(value);
  const [packId, assetId] = value.split("/");
  packs[packId] ??= readPack(path.join(root, "packs", `${packId}.audpack`));
  const row = packs[packId].index.sounds.find((s) => s.id === assetId);
  if (!row) throw new Error(`Sound not in pack: ${value}`);
  const r = await dec.decodeInt(packs[packId].bytes(row));
  const f = new Float32Array(r.length);
  for (let i = 0; i < r.length; i++) f[i] = r.data[0][i] / 32768;
  const s = { f, rate: r.sampleRate };
  cache.set(value, s);
  return s;
}

const RATE = 44100;
const db = (x) => 20 * Math.log10(Math.max(x, 1e-9));
function stepTimes(bpm, swing) {
  const dur = 60 / bpm / 4;
  const sw = swing / 100;
  const t = [];
  let at = 0;
  for (let i = 0; i < 64; i++) {
    t.push(at);
    at += dur + (i % 2 === 0 ? dur * sw : -dur * sw);
  }
  return { t, end: at };
}

async function render(beat) {
  const { t, end } = stepTimes(beat.bpm, beat.swing);
  const buf = new Float32Array(Math.ceil((end + 1.5) * RATE));
  for (const ch of beat.channels) {
    const s = await sound(ch.source.value);
    const step = s.rate / RATE;
    const rate = step * (ch.pitch || 1);
    const maxLen = Math.min(s.f.length / rate, ch.trimSeconds[1] - ch.trimSeconds[0]);
    const startSrc = ch.trimSeconds[0] * s.rate;
    const n = Math.floor(maxLen * RATE);
    const fade = Math.min(n, Math.floor(0.005 * RATE));
    for (let i = 0; i < 64; i++) {
      const c = ch.pattern[i];
      if (c === ".") continue;
      const g = ch.volume * (c === "X" ? 1.25 : 1);
      const at = Math.round(t[i] * RATE);
      for (let k = 0; k < n && at + k < buf.length; k++) {
        const pos = startSrc + k * rate;
        const j = Math.floor(pos);
        if (j + 1 >= s.f.length) break;
        const frac = pos - j;
        let v = s.f[j] * (1 - frac) + s.f[j + 1] * frac;
        if (k >= n - fade) v *= (n - k) / fade;
        buf[at + k] += v * g;
      }
    }
  }
  // Loop length = `end` seconds; measure over one loop (the tail past the loop is the overlap into the next pass).
  const loopN = Math.floor(end * RATE);
  let peak = 0,
    sum = 0;
  for (let i = 0; i < buf.length; i++) {
    if (!Number.isFinite(buf[i])) return { beat, nan: true };
    peak = Math.max(peak, Math.abs(buf[i]));
    if (i < loopN) sum += buf[i] * buf[i];
  }
  return { beat, buf, peak, rms: Math.sqrt(sum / loopN) };
}

function wav16(f) {
  const b = Buffer.alloc(44 + f.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + f.length * 2, 4); b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(RATE, 24);
  b.writeUInt32LE(RATE * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36);
  b.writeUInt32LE(f.length * 2, 40);
  for (let i = 0; i < f.length; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, f[i])) * 32767), 44 + i * 2);
  return b;
}

if (writeWav) fs.mkdirSync(out, { recursive: true });
const med = (a) => a.slice().sort((x, y) => x - y)[a.length >> 1];

async function runKit(k, raw) {
  const rows = [];
  let bad = 0;
  for (const beat of getBeats(k, raw)) {
    const r = await render(beat);
    if (r.nan) { console.log("NaN in", beat.id); bad++; continue; }
    const peakDb = db(r.peak), rmsDb = db(r.rms);
    rows.push({ id: beat.recipeId, peak: r.peak, peakDb, rmsDb });
    if (!raw) {
      if (r.peak > LIMIT + 0.005) { console.log(`CLIP  [${k}] ${beat.id}: peak ${peakDb.toFixed(1)} dBFS`); bad++; }
      else if (rmsDb < -40) { console.log(`QUIET [${k}] ${beat.id}: rms ${rmsDb.toFixed(1)} dBFS`); bad++; }
      else if (rmsDb > -12) { console.log(`LOUD  [${k}] ${beat.id}: rms ${rmsDb.toFixed(1)} dBFS`); bad++; }
    }
    if (writeWav) fs.writeFileSync(path.join(out, `${beat.recipeId}.wav`), wav16(r.buf));
  }
  return { rows, bad };
}

if (writeHeadroom) {
  const kits = ["auto", "jazz", "rusty", "unruly", "swirly", "concert", "modern"];
  const table = {};
  for (const k of kits) {
    const { rows, bad } = await runKit(k, true);
    if (bad) process.exitCode = 1;
    table[k] = {};
    for (const r of rows) if (r.peak > LIMIT) table[k][r.id] = Math.floor((LIMIT / r.peak) * 100) / 100;
    console.log(`${k}: ${Object.keys(table[k]).length} of ${rows.length} beats need a trim (max ${(db(Math.max(...rows.map((r) => r.peak)))).toFixed(1)} dBFS)`);
  }
  const lines = kits.map((k) => {
    const entries = Object.entries(table[k]).map(([id, v]) => `${JSON.stringify(id)}:${v}`);
    return `  ${k}: {${entries.join(",")}},`;
  });
  fs.writeFileSync(
    path.join(js, "analog-headroom.js"),
    `// GENERATED by audionaut-library/tools/render-analog-beats.mjs --write-headroom. Do not edit by hand.
// Per-kit channel-volume multipliers (< 1) for the beats whose summed peak would exceed ${LIMIT} of full
// scale; analog-kits.js applies them so no Analog Kit beat clips. Regenerate after changing grooves,
// voices, pins, adds or the calibration table (the Analog beat tests fail when it is stale).
export const HEADROOM = {
${lines.join("\n")}
};
`,
  );
  console.log("wrote analog-headroom.js");
} else {
  const { rows, bad } = await runKit(kit, false);
  console.log(`rendered ${rows.length} beats (kit ${kit}); problems ${bad}`);
  console.log(`peak dBFS: min ${Math.min(...rows.map((r) => r.peakDb)).toFixed(1)}  median ${med(rows.map((r) => r.peakDb)).toFixed(1)}  max ${Math.max(...rows.map((r) => r.peakDb)).toFixed(1)}`);
  console.log(`rms  dBFS: min ${Math.min(...rows.map((r) => r.rmsDb)).toFixed(1)}  median ${med(rows.map((r) => r.rmsDb)).toFixed(1)}  max ${Math.max(...rows.map((r) => r.rmsDb)).toFixed(1)}`);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(rows));
  if (bad) process.exitCode = 1;
}
