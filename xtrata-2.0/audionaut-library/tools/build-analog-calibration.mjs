#!/usr/bin/env node
// Measures every Analog Kit sound (pack id "analogkit") plus the Electronic Kit kicks that the
// Analog Kit drum beats borrow for 808 bass hits, and writes the calibration table that
// public/audionaut/daw/js/analog-kits.js uses to set role levels and tail trims.
//
//   node audionaut-library/tools/build-analog-calibration.mjs
//
// For each sound the table stores [loudnessDb, tailSeconds, clarity, brightness, durationSeconds]:
//   loudnessDb  RMS over the first 150 ms, in dB relative to full scale
//   tailSeconds time until the 5 ms RMS envelope has fallen 40 dB below its peak, plus 30 ms
//   clarity     0..1 pitch clarity (normalised autocorrelation, 40 Hz..2 kHz) of a 46 ms
//               window starting 20 ms into the sound; drums sit low, tuned sounds sit high
//   brightness  zero-crossing rate over the first 150 ms, per second / 1000
//   (the table row ends with pcmSha256, then peak: the largest sample magnitude, 0..1, used to
//   estimate each beat's summed peak so analog-kits.js can leave headroom)
// Everything is measured from the decoded 16-bit PCM, after checking it against pcmSha256.
import fs from "node:fs";
import zlib from "node:zlib";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDecoder } from "../codecs/codec-flac.mjs";
import { ANALOG_PACK_ID } from "../../public/audionaut/daw/js/analog-pack.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.resolve(root, "../public/audionaut/daw/js/analog-calibration.js");

function readPack(file) {
  const u8 = fs.readFileSync(file);
  if (u8.toString("latin1", 0, 4) !== "AUDP") throw new Error(`${file}: not an audpack`);
  const ilen = u8.readUInt32LE(8);
  let ib = u8.subarray(12, 12 + ilen);
  if (u8[5] & 1) ib = zlib.gunzipSync(ib);
  const index = JSON.parse(ib.toString("utf8"));
  const base = 12 + ilen;
  return { index, bytes: (s) => u8.subarray(base + s.offset, base + s.offset + s.length) };
}

const db = (x) => 20 * Math.log10(Math.max(x, 1e-9));

function measure(f, rate) {
  const n = f.length;
  const win = Math.round(rate * 0.005);
  const env = [];
  for (let i = 0; i < n; i += win) {
    let s = 0,
      c = 0;
    for (let j = i; j < Math.min(n, i + win); j++, c++) s += f[j] * f[j];
    env.push(Math.sqrt(s / Math.max(1, c)));
  }
  const peakEnv = Math.max(...env, 1e-9);
  let last = 0;
  for (let i = 0; i < env.length; i++) if (db(env[i]) > db(peakEnv) - 40) last = i;
  const tail = Math.min(n / rate, ((last + 1) * win) / rate + 0.03);

  const head = Math.min(n, Math.round(rate * 0.15));
  let s = 0,
    zc = 0;
  for (let i = 0; i < head; i++) {
    s += f[i] * f[i];
    if (i && f[i] * f[i - 1] < 0) zc++;
  }
  const loud = db(Math.sqrt(s / Math.max(1, head)));
  const bright = zc / (head / rate) / 1000;

  // pitch clarity
  const start = Math.round(rate * 0.02),
    len = Math.round(rate * 0.046);
  let clarity = 0;
  if (start + len + 1100 < n) {
    const minLag = Math.floor(rate / 2000),
      maxLag = Math.floor(rate / 40);
    let e0 = 0;
    for (let i = 0; i < len; i++) e0 += f[start + i] * f[start + i];
    if (e0 > 1e-8) {
      for (let lag = minLag; lag <= maxLag && start + len + lag < n; lag++) {
        let c = 0,
          e1 = 0;
        for (let i = 0; i < len; i++) {
          c += f[start + i] * f[start + i + lag];
          e1 += f[start + i + lag] * f[start + i + lag];
        }
        const r = c / Math.sqrt(e0 * e1 + 1e-12);
        if (r > clarity) clarity = r;
      }
    }
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(f[i]));
  return [[+loud.toFixed(1), +tail.toFixed(2), +Math.max(0, clarity).toFixed(2), +bright.toFixed(1), +(n / rate).toFixed(2)], +peak.toFixed(3)];
}

const dec = await createDecoder({ verify: true });
const table = {};
const wanted = [
  { pack: ANALOG_PACK_ID, prefix: "", id: ANALOG_PACK_ID },
  { pack: "electronic", prefix: "electronic-", id: "electronic", only: /^electronic-(kicks|sub-kicks)-/ },
];
for (const { pack, only } of wanted) {
  const { index, bytes } = readPack(path.join(root, "packs", `${pack}.audpack`));
  let count = 0;
  for (const s of index.sounds) {
    if (only && !only.test(s.id)) continue;
    const b = bytes(s);
    if (crypto.createHash("sha256").update(b).digest("hex") !== s.sha256) throw new Error(`${s.id}: stored bytes differ from the index`);
    const r = await dec.decodeInt(b);
    const pcm = new Int16Array(r.length);
    const f = new Float32Array(r.length);
    for (let i = 0; i < r.length; i++) {
      pcm[i] = r.data[0][i];
      f[i] = pcm[i] / 32768;
    }
    const sum = crypto.createHash("sha256").update(Buffer.from(pcm.buffer)).digest("hex");
    if (sum !== s.pcmSha256) throw new Error(`${s.id}: decoded PCM differs from pcmSha256`);
    const [m, peak] = measure(f, r.sampleRate);
    table[`${pack}/${s.id}`] = [...m, s.pcmSha256, peak];
    count++;
  }
  console.log(`${pack}: measured ${count}`);
}

const lines = Object.entries(table).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
fs.writeFileSync(
  out,
  `// GENERATED by audionaut-library/tools/build-analog-calibration.mjs. Do not edit by hand.
// ${Object.keys(table).length} measured sounds: the Analog Kit (pack id "analogkit") and the Electronic Kit kicks.
// CAL["<pack>/<assetId>"] = [loudnessDb, tailSeconds, clarity, brightness, durationSeconds, pcmSha256, peak]
export const CAL = {
${lines.join("\n")}
};
`,
);
console.log(`wrote ${path.relative(process.cwd(), out)}`);
