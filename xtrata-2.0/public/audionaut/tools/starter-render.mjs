#!/usr/bin/env node
// tools/starter-render.mjs — renders starter songs offline through the real engine and measures
// how they sound: loudness, peak, crest, stereo width and the balance between low end and the rest.
//
//   node tools/starter-render.mjs [ids…]            # full mix of sequence 2 (all parts), table of numbers
//   node tools/starter-render.mjs afrobeat --stems  # also each part alone (drums, lead, keys, pad, bass)
//   node tools/starter-render.mjs --stems=drums,bass   # only those parts alone
//   flags: --seq=N     sequence to render, 1-based (default 2, the full groove with the bar-4 fill)
//          --json=f    write the numbers to a file       --wav=dir   write each mix as a 16-bit WAV
//          --dir=path  read songs from another folder of starter JSON (default daw/data/starters)
//
// An OfflineAudioContext stands in for the live one, so the numbers are repeatable. The song is
// scheduled with the engine's own step scheduler (the same calls the transport makes).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve, browser, page as mkPage } from "./serve.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
const SR = 44100;
const DIR = flags.dir ? path.resolve(flags.dir) : path.resolve(HERE, "../daw/data/starters");
const index = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8")).songs;
const want = args.filter((a) => !a.startsWith("--"));
const songs = index.filter((s) => !want.length || want.includes(s.id));
const SEQ = (+flags.seq || 2) - 1;

// ---- analysis ------------------------------------------------------------------------------
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}
export const BANDS = [["sub", 20, 60], ["bass", 60, 200], ["lowmid", 200, 500], ["mid", 500, 2000], ["himid", 2000, 6000], ["air", 6000, 20000]];
export function analyse(L, R) {
  const n = L.length;
  let pk = 0, ss = 0, sl = 0, sr = 0, slr = 0;
  for (let i = 0; i < n; i++) { pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i])); ss += (L[i] * L[i] + R[i] * R[i]) / 2; sl += L[i] * L[i]; sr += R[i] * R[i]; slr += L[i] * R[i]; }
  const db = (x) => 20 * Math.log10(Math.max(x, 1e-9));
  // average power spectrum of the mono sum (Welch, 8192 Hann), skipping the silent lead-in
  const N = 8192, mono = new Float32Array(n);
  for (let i = 0; i < n; i++) mono[i] = (L[i] + R[i]) / 2;
  const power = new Float64Array(N / 2);
  let frames = 0;
  for (let s = Math.floor(0.1 * SR); s + N <= n; s += N / 2) {
    const re = new Float64Array(N), im = new Float64Array(N);
    for (let i = 0; i < N; i++) re[i] = mono[s + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)));
    fft(re, im);
    for (let k = 0; k < N / 2; k++) power[k] += re[k] * re[k] + im[k] * im[k];
    frames++;
  }
  const bands = {};
  let total = 0;
  for (const [name, lo, hi] of BANDS) {
    let e = 0;
    for (let k = Math.ceil((lo * N) / SR); k < Math.min(N / 2, Math.floor((hi * N) / SR)); k++) e += power[k];
    bands[name] = e; total += e;
  }
  const pct = Object.fromEntries(Object.entries(bands).map(([k, v]) => [k, +((100 * v) / (total || 1)).toFixed(1)]));
  return {
    peakDb: +db(pk).toFixed(1),
    rmsDb: +db(Math.sqrt(ss / n)).toFixed(1),
    crestDb: +(db(pk) - db(Math.sqrt(ss / n))).toFixed(1),
    corr: +(slr / Math.sqrt((sl * sr) || 1)).toFixed(2),
    pct,
    lowPct: +(pct.sub + pct.bass).toFixed(1),
  };
}

// ---- rendering -----------------------------------------------------------------------------
export async function render(b, url, logs, file, { solo = null, bars = 4, tail = 2.5 } = {}) {
  const p = await mkPage(b, url, { logs });
  const bpmGuess = 130; // only used to size the context; real length is set once the song is known
  await p.addInitScript(({ SR, secs }) => {
    window.AudioContext = class extends OfflineAudioContext {
      constructor() { super(2, SR * secs, SR); }
      resume() { return Promise.resolve(); } suspend() { return Promise.resolve(); } close() { return Promise.resolve(); }
    };
    let z = 4242;
    Math.random = () => { z = (Math.imul(z, 1664525) + 1013904223) >>> 0; return z / 4294967296; };
  }, { SR, secs: Math.ceil((bars * 16 * 60) / 60 / 4 * 1.25 + tail) + 14 });
  await p.goto(url + "/audionaut/daw.html");
  await p.waitForFunction(() => /Press Space|Welcome|—/.test(document.querySelector("#status-text")?.textContent || ""), null, { timeout: 90000 });
  const out = await p.evaluate(async ({ file, solo, SEQ, SR, tail }) => {
    const base = "/audionaut/daw/js/";
    const { store, makeProject } = await import(base + "state.js");
    const { engine } = await import(base + "engine.js");
    const persist = await import(base + "persistence.js");
    const loader = await import(base + "loader.js");
    const json = await (await fetch("/audionaut/daw/data/" + file + "?t=" + Date.now(), { cache: "no-store" })).json();
    store.loadProject(makeProject());
    persist.importProject(json);
    const fails = await loader.reloadAllSamples();
    const ctx = engine.ensureContext();
    engine.ensureChannelChains?.();
    const proj = store.project;
    proj.continuous = false;
    // the offline context is created before the project loads: apply the saved master by hand
    engine.masterGain.gain.cancelScheduledValues(0);
    engine.masterGain.gain.value = proj.masterVolume;
    // stems: mute everything but one group
    if (solo) {
      proj.channels.forEach((c) => (c.mute = solo !== "drums"));
      proj.instruments.forEach((inst, i) => (inst.mute = ["lead", "keys", "pad", "bass"][i] !== solo));
    }
    // the reverb impulse is debounced in the app: build it now so the tail is in the render
    let z = 99991;
    const bed = () => Float32Array.from({ length: Math.ceil(ctx.sampleRate * 8) }, () => { z = (Math.imul(z, 1664525) + 1013904223) >>> 0; return (z / 4294967296) * 2 - 1; });
    engine._noise = [bed(), bed()];
    await new Promise((r) => setTimeout(r, 400));
    clearTimeout(engine.reverbFx?.timer);
    if (engine.reverbFx) engine.reverbFx.sig = null;
    engine.applyReturns?.(true);
    engine.applySolo?.({});
    for (let i = 0; i < store.numChannels; i++) engine.syncChain?.(i, false);
    for (let i = 0; i < 4; i++) engine.syncChain?.(i, true);
    let rz = 777;
    Math.random = () => { rz = (Math.imul(rz, 1664525) + 1013904223) >>> 0; return rz / 4294967296; };
    engine.pause?.();
    engine.onStep = null;
    engine.playingSequence = SEQ;
    store.selectSequence(SEQ);
    engine.currentStep = 0;
    engine.nextStepTime = 0.05;
    for (let i = 0; i < 64; i++) { engine._scheduleStep(engine.currentStep, engine.nextStepTime); engine._advance(); }
    const buf = await ctx.startRendering();
    const toB64 = (f) => { const u = new Uint8Array(f.buffer, f.byteOffset, f.byteLength); let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
    const dur = (64 * 60) / proj.bpm / 4 + 0.05 + tail;
    const n = Math.min(buf.length, Math.floor(dur * SR));
    return { l: toB64(buf.getChannelData(0).subarray(0, n)), r: toB64(buf.getChannelData(1).subarray(0, n)), fails: fails?.length || 0, bpm: proj.bpm, master: proj.masterVolume };
  }, { file, solo, SEQ, SR, tail });
  await p.close();
  const f32 = (s) => { const x = Buffer.from(s, "base64"); return new Float32Array(x.buffer, x.byteOffset, x.length / 4); };
  return { L: f32(out.l), R: f32(out.r), fails: out.fails, bpm: out.bpm, master: out.master };
}

function wav16(L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767))), 44 + i * 4); buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767))), 46 + i * 4); }
  return buf;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const logs = [];
  const { srv, url } = await serve();
  const b = await browser();
  const rows = [];
  const pad = (v, n) => String(v).padEnd(n);
  console.log(pad("song", 13), pad("bpm", 4), pad("peak", 7), pad("rms", 7), pad("crest", 6), pad("corr", 5), "sub  bass lomid mid  himid air   | low(<200)");
  for (const s of songs) {
    const groups = flags.stems ? [null, ...(flags.stems === true ? ["drums", "lead", "keys", "pad", "bass"] : String(flags.stems).split(","))] : [null];
    for (const g of groups) {
      const r = await render(b, url, logs, s.file, { solo: g });
      const a = analyse(r.L, r.R);
      rows.push({ id: s.id, stem: g || "mix", ...a, bpm: r.bpm, master: r.master, loadFails: r.fails });
      const p = a.pct;
      console.log(pad(s.id + (g ? ":" + g : ""), 13), pad(r.bpm, 4), pad(a.peakDb, 7), pad(a.rmsDb, 7), pad(a.crestDb, 6), pad(a.corr, 5), [p.sub, p.bass, p.lowmid, p.mid, p.himid, p.air].map((v) => pad(v, 5)).join(""), "|", a.lowPct, r.fails ? ` (${r.fails} samples failed)` : "");
      if (flags.wav && !g) { fs.mkdirSync(flags.wav, { recursive: true }); fs.writeFileSync(path.join(flags.wav, `${s.id}.wav`), wav16(r.L, r.R)); }
    }
  }
  if (flags.json) fs.writeFileSync(flags.json, JSON.stringify(rows, null, 1));
  if (logs.length) console.log("page logs:", [...new Set(logs)].slice(0, 8));
  await b.close(); srv.close();
}
