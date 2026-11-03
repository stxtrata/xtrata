#!/usr/bin/env node
// tools/chain-null.mjs — audio null test for plugin-chain changes. Renders fixed test projects
// through the REAL engine (an OfflineAudioContext stands in for the live one) and writes or
// compares the audio, so a change to how chains are stored or wired can be proven not to change
// what anyone hears.
//
//   node tools/chain-null.mjs record BASELINE.json.gz    # run on the code you trust
//   node tools/chain-null.mjs compare BASELINE.json.gz   # run on the change; exit 1 if any case differs
//          --new-shape    write the fixtures' trailing sends as strip sends ({ delay, reverb } values)
//                         instead of FX-list slots: the new data shape must sound the same
//   flags: --limit=-90   null threshold in dB (residual vs the baseline peak; default -90)
//          --only=text   only cases whose id contains text
//          --list        print the case ids and exit
//          --twice       render each case twice on the same code and report the noise floor
//
// Test projects are written in the OLD data shape (inserts[] + fx[] slots, or the legacy fixed fx
// object), exactly as saved files and Beats presets have them. Whatever the loader turns them
// into, the sound must not move. Sources are seeded noise/tone bursts, so no network or samples.
import { serve, browser, page as mkPage } from "./serve.mjs";
import fs from "node:fs";
import zlib from "node:zlib";

const args = process.argv.slice(2);
const mode = args[0];
const file = args[1];
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
const SR = 44100, SECONDS = 4;

const slot = (id, type, params = {}, enabled = true) => ({ id, type, enabled, params });
// each case: channels (sample chains) and optional instrument chains, in the old shape
const CASES = [
  { id: "dry", ch: [{}] },
  { id: "inserts-only", ch: [{ inserts: [slot("a", "eq3", { low: 4, mid: -3, high: 2 }), slot("b", "comp", {})] }] },
  { id: "sends-only", ch: [{ fx: [slot("a", "delaySend", { amount: 0.4 }), slot("b", "reverbSend", { amount: 0.3 })] }] },
  { id: "delay-full", ch: [{ fx: [slot("a", "delaySend", { amount: 1 })] }] },
  { id: "reverb-full", ch: [{ fx: [slot("a", "reverbSend", { amount: 1 })] }] },
  { id: "fx-then-sends", ch: [{ fx: [slot("a", "filter", { mode: "lp", cutoff: 1800, q: 0.9 }), slot("b", "drive", { amount: 0.4 }), slot("c", "delaySend", { amount: 0.5 }), slot("d", "reverbSend", { amount: 0.25 })] }] },
  { id: "inserts-fx-sends", ch: [{ inserts: [slot("a", "eq3", { low: -4, mid: 2, high: 3 })], fx: [slot("b", "chorus", {}), slot("c", "delaySend", { amount: 0.3 }), slot("d", "reverbSend", { amount: 0.5 })] }] },
  { id: "bypassed-send", ch: [{ fx: [slot("a", "delaySend", { amount: 0.8 }, false), slot("b", "reverbSend", { amount: 0.4 })] }] },
  { id: "bypassed-plugin", ch: [{ fx: [slot("a", "drive", { amount: 0.9 }, false), slot("b", "delaySend", { amount: 0.5 })] }] },
  { id: "legacy-object", ch: [{ inserts: [], fx: { filter: "lp", cutoff: 2400, drive: 0.3, delay: 0.35, reverb: 0.2 } }] },
  { id: "legacy-object-hp", ch: [{ inserts: [], fx: { filter: "hp", cutoff: 400, drive: 0, delay: 0, reverb: 0.6 } }] },
  { id: "mixed-channels", ch: [{ fx: [slot("a", "delaySend", { amount: 0.6 })] }, { fx: [slot("b", "reverbSend", { amount: 0.6 })] }, {}, { inserts: [slot("c", "comp", {})], fx: [slot("d", "delaySend", { amount: 0.2 }), slot("e", "reverbSend", { amount: 0.2 })] }] },
  { id: "custom-returns", returns: { delay: { time: "1/4", feedback: 0.6, tone: 2500, spread: 0, ret: 0.8 }, reverb: { decay: 3.5, shape: 2, predelay: 0.03, damp: 9000, width: 0.7, ret: 0.9 } }, ch: [{ fx: [slot("a", "delaySend", { amount: 0.5 }), slot("b", "reverbSend", { amount: 0.5 })] }] },
  // Ping-pong feeds the two echo lines into each other. Chrome may order the processing of a loop
  // through two delay nodes differently from run to run (one 128-sample block, inaudible), so this
  // case only compares the first second, before the echoes cross for the second time.
  { id: "pingpong-returns", until: 1.0, returns: { delay: { time: "1/4", feedback: 0.6, tone: 2500, spread: 0.5, ret: 0.8 }, reverb: { decay: 2.5, shape: 3, predelay: 0, damp: 20000, width: 1, ret: 1 } }, ch: [{ fx: [slot("a", "delaySend", { amount: 0.6 }), slot("b", "reverbSend", { amount: 0.2 })] }] },
  { id: "synth-dry", inst: [{ inserts: [], fx: [] }] },
  { id: "synth-sends", inst: [{ inserts: [], fx: [slot("a", "delaySend", { amount: 0.4 }), slot("b", "reverbSend", { amount: 0.35 })] }] },
  { id: "synth-inserts-sends", inst: [{ inserts: [slot("a", "tilt", {})], fx: [slot("b", "reverbSend", { amount: 0.5 })] }] },
];

// the same fixtures in the new data shape: trailing send slots become strip send values
const BUS = { delaySend: "delay", reverbSend: "reverb" };
function newShape(o) {
  if (!Array.isArray(o.fx)) return o;
  const fx = [...o.fx], sends = { ...(o.sends || {}) };
  while (fx.length && BUS[fx[fx.length - 1].type]) {
    const s = fx.pop();
    if (!sends[BUS[s.type]]) sends[BUS[s.type]] = { amount: s.params.amount, enabled: s.enabled };
  }
  return { ...o, fx, sends };
}
if (flags["new-shape"]) for (const c of CASES) { c.ch = c.ch?.map(newShape); c.inst = c.inst?.map(newShape); }

if (flags.list) { for (const c of CASES) console.log(c.id); process.exit(0); }
if (!["record", "compare"].includes(mode)) {
  console.error("usage: chain-null.mjs record|compare FILE.json.gz [--only=text] [--limit=-90] [--twice] | --list");
  process.exit(2);
}

const logs = [];
const { srv, url } = await serve();
const b = await browser();

async function render(c) {
  const p = await mkPage(b, url, { logs });
  // an offline context stands in for the live one, so the real engine renders deterministically
  await p.addInitScript(({ SR, SECONDS }) => {
    window.AudioContext = class extends OfflineAudioContext {
      constructor() { super(2, SR * SECONDS, SR); }
      resume() { return Promise.resolve(); }
      suspend() { return Promise.resolve(); }
      close() { return Promise.resolve(); }
    };
    let z = 4242; // plugin noise beds use Math.random: make it repeatable
    Math.random = () => { z = (Math.imul(z, 1664525) + 1013904223) >>> 0; return z / 4294967296; };
  }, { SR, SECONDS });
  await p.goto(url + "/audionaut/daw.html");
  await p.waitForFunction(() => /Press Space/.test(document.querySelector("#status-text")?.textContent || ""), null, { timeout: 60000 });
  const out = await p.evaluate(async ({ c, SR }) => {
    const { store, makeProject } = await import("/audionaut/daw/js/state.js");
    const { engine } = await import("/audionaut/daw/js/engine.js");
    const persist = await import("/audionaut/daw/js/persistence.js");
    // project: blank channels carrying the case's chains, in the old shape
    const base = makeProject();
    const json = JSON.parse(persist.exportProject({ compact: true }));
    json.channels = (c.ch || []).map((o, i) => ({
      name: "T" + i, source: { type: "synth", value: "test:" + i, label: "T" + i }, sampleName: "T" + i,
      volume: 0.8, pitch: 1, reverse: false, mute: false, solo: false, trimStart: 0, trimEnd: 1,
      inserts: o.inserts || [], fx: o.fx || [], sends: o.sends || {},
    }));
    json.instruments = (json.instruments || []).slice(0, 4).map((inst, i) => ({ ...inst, inserts: [], fx: [], sends: {} }));
    (c.inst || []).forEach((o, i) => { if (json.instruments[i]) { json.instruments[i].inserts = o.inserts || []; json.instruments[i].fx = o.fx || []; json.instruments[i].sends = o.sends || {}; } });
    if (c.returns) json.returns = c.returns;
    json.format = "audionaut-workstation/2";
    json.bpm = 120;
    // fresh engine graph on the project
    store.loadProject(makeProject());
    persist.importProject(JSON.parse(JSON.stringify(json)));
    const ctx = engine.ensureContext();
    engine.ensureChannelChains?.();
    // the reverb tail is built from a random noise bed: pin it, and rebuild the impulse now
    // (the app debounces it) so every render hears the same tail
    let z = 99991;
    const bed = () => Float32Array.from({ length: Math.ceil(ctx.sampleRate * 8) }, () => { z = (Math.imul(z, 1664525) + 1013904223) >>> 0; return (z / 4294967296) * 2 - 1; });
    engine._noise = [bed(), bed()];
    // let any debounced rebuild from the load fire while the offline clock still sits at 0, then
    // rebuild once more, immediately, so nothing can land mid-render
    await new Promise((res) => setTimeout(res, 400));
    clearTimeout(engine.reverbFx?.timer);
    if (engine.reverbFx) engine.reverbFx.sig = null;
    engine.applyReturns?.(true);
    // seeded stereo test source: decaying tone + noise, 1.2 s
    const seeded = (i) => {
      let s = 1234567 + i * 7919;
      const buf = ctx.createBuffer(2, Math.floor(SR * 1.2), SR);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let k = 0; k < d.length; k++) {
          s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
          const env = Math.exp(-5 * k / d.length);
          d[k] = env * (0.35 * Math.sin(k * (0.04 + 0.013 * i + 0.002 * ch)) + 0.4 * ((s / 4294967296) * 2 - 1));
        }
      }
      return buf;
    };
    (c.ch || []).forEach((_, i) => { engine.setBuffer(i, seeded(i)); engine.syncChain?.(i, false); });
    // synth voices and noise beds draw from Math.random: restart it so the code that ran before
    // this point (which differs between versions) cannot change what the notes sound like
    let rz = 777;
    Math.random = () => { rz = (Math.imul(rz, 1664525) + 1013904223) >>> 0; return rz / 4294967296; };
    (c.ch || []).forEach((_, i) => engine.trigger(i, 0.05 + i * 0.4, 1));
    (c.inst || []).forEach((_, i) => { engine.syncChain?.(i, true); engine.triggerNote?.(i, 60 + i * 3, 1, 0.1, 0.8); });
    const rendered = await ctx.startRendering();
    const toB64 = (f) => { const u = new Uint8Array(f.buffer, f.byteOffset, f.byteLength); let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
    return { l: toB64(rendered.getChannelData(0)), r: toB64(rendered.getChannelData(1)) };
  }, { c, SR });
  await p.close();
  return out;
}

const f32 = (b64) => { const buf = Buffer.from(b64, "base64"); return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4); };
function peak(a) { let m = 0; for (const v of a) m = Math.max(m, Math.abs(v)); return m; }
function nullDb(x, y, until = SECONDS) {
  let d = 0, pk = 0;
  for (const [a, b2] of [[f32(x.l), f32(y.l)], [f32(x.r), f32(y.r)]]) for (let i = 0; i < Math.min(a.length, Math.round(until * SR)); i++) { d = Math.max(d, Math.abs(a[i] - b2[i])); pk = Math.max(pk, Math.abs(a[i])); }
  return { db: 20 * Math.log10(d / (pk || 1) + 1e-12), pk };
}

const only = typeof flags.only === "string" ? flags.only : "";
const run = CASES.filter((c) => c.id.includes(only));
const limit = flags.limit ? +flags.limit : -90;
let base = null;
if (mode === "compare") base = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)));
const rec = {};
let fails = 0;
for (const c of run) {
  const r = await render(c);
  const pk = Math.max(peak(f32(r.l)), peak(f32(r.r)));
  let line = `${c.id.padEnd(22)} peak ${pk.toFixed(3)}`;
  if (pk < 1e-4) { line += "  SILENT"; fails++; }
  if (flags.twice) { const r2 = await render(c); line += `  repeat ${nullDb(r, r2, c.until).db.toFixed(1)} dB`; }
  if (mode === "record") rec[c.id] = r;
  else if (!base[c.id]) { line += "  MISSING in baseline"; fails++; }
  else {
    const n = nullDb(base[c.id], r, c.until);
    line += `  null ${n.db.toFixed(1)} dB ${n.db < limit ? "ok" : "DIFFERS"}`;
    if (n.db >= limit) {
      fails++;
      // where does it start? (helps tell a level change from a timing change)
      const A = f32(base[c.id].l), B = f32(r.l), thr = n.pk * Math.pow(10, limit / 20);
      let at = -1;
      for (let i = 0; i < A.length; i++) if (Math.abs(A[i] - B[i]) > thr) { at = i; break; }
      line += `  (first over limit at ${(at / SR).toFixed(3)} s)`;
    }
  }
  console.log(line);
}
if (mode === "record") { fs.writeFileSync(file, zlib.gzipSync(JSON.stringify(rec))); console.log(`recorded ${run.length} cases -> ${file}`); }
if (logs.length) { console.log("page logs:"); for (const l of [...new Set(logs)].slice(0, 10)) console.log("  " + l); }
await b.close(); srv.close();
if (mode === "compare") { console.log(fails ? `FAIL: ${fails} problem(s)` : `PASS: ${run.length} cases null below ${limit} dB`); process.exit(fails ? 1 : 0); }
