#!/usr/bin/env node
// tools/measure.mjs — offline audio checks for Audionaut synths (headless Chromium).
//
//   node tools/measure.mjs                 # the 14 polished synths
//   node tools/measure.mjs all             # whole bank
//   node tools/measure.mjs tine modal      # chosen ids
//   flags: --quick (skip param sweep)  --json=path (full report)  --levels (per-preset table)
//
// Per synth: defaults level (A3, vel 1, 1.5 s gate, 4 s render), every preset, velocity response,
// short (50 ms) and long (6 s) notes, pitch tracking (E2 / A3 / C6), a min/max sweep of every
// param (every option for selects), source cleanup (every started source has a finite stop and
// an onended hook) and uncached render cost. Exit code 1 when any FAIL is found.
import { serve, browser, page } from "./serve.mjs";
import fs from "node:fs";
import { POLISH } from "./ids.js";
// unpitched / inharmonic: pitch tracking is reported but not judged
const UNPITCHED = new Set(["kit", "texture"]);
const LOOSE_PITCH = new Set(["lantern", "prism", "modal", "kiln", "anneal", "palinode", "faultglass", "morrowglass", "vitreous", "tidalglass", "tidelace"]);

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
let ids = args.filter((a) => !a.startsWith("--"));

const { srv, url } = await serve();
const b = await browser();
const logs = [];
const p = await page(b, url, { logs });
await p.goto(`${url}/audionaut/tools/harness.html`);
if (!ids.length) ids = POLISH;
if (ids[0] === "all") ids = await p.evaluate(async () => Object.keys((await import("/audionaut/daw/js/synths.js")).SYNTH_BANK));

const report = await p.evaluate(async ({ ids, quick, UNPITCHED, LOOSE_PITCH }) => {
  const { SYNTH_BANK, parseLine } = await import("/audionaut/daw/js/synths.js");
  const M = await import("/audionaut/tools/measure-lib.js");
  const U = new Set(UNPITCHED), LP = new Set(LOOSE_PITCH);
  const out = {};
  const f = (x) => +x.toFixed(4);
  for (const id of ids) {
    const def = SYNTH_BANK[id];
    const r = { id, name: def?.name, fails: [], warns: [], presets: [], params: def?.params?.length || 0 };
    out[id] = r;
    if (!def) { r.fails.push("not in bank"); continue; }
    const D = M.defaultsOf(def);
    const tp = M.testPitch(id);
    const schema = Object.fromEntries(def.params.map((x) => [x.key, x]));
    const strip = ({ mono, ...m }) => m;
    const check = (tag, m, { minRms = 0.004, maxPeak = 0.9 } = {}) => {
      if (m.err) r.fails.push(`${tag}: threw ${m.err}`);
      if (m.nonFinite) r.fails.push(`${tag}: ${m.nonFinite} non-finite samples`);
      if (m.peak >= maxPeak) r.fails.push(`${tag}: peak ${f(m.peak)} >= ${maxPeak}`);
      if (m.rms < minRms) r.fails.push(`${tag}: silent (rms ${f(m.rms)})`);
      if (m.unstopped) r.fails.push(`${tag}: ${m.unstopped} source(s) never stopped`);
      if (m.sources && !m.hasOnended) r.warns.push(`${tag}: no onended cleanup hook`);
    };
    // 1. defaults
    const d0 = await M.measureNote(def, D, { pitch: 57, vel: 1, dur: 1.5 });
    r.ms = d0.ms; r.nodes = d0.nodes; r.def = strip(d0);
    check("defaults", d0);
    if (d0.rms < 0.04 && id !== "kit") r.warns.push(`defaults rms ${f(d0.rms)} below 0.04`);
    if (d0.rms > 0.14) r.warns.push(`defaults rms ${f(d0.rms)} above 0.14`);
    const again = await M.measureNote(def, D, { pitch: 57, vel: 1, dur: 1.5 });
    r.msCached = again.ms;
    // 2. presets
    const names = new Set();
    for (const pr of def.presets || []) {
      if (names.has(pr.name)) r.fails.push(`duplicate preset name "${pr.name}"`);
      names.add(pr.name);
      for (const [k, v] of Object.entries(pr.params || {})) {
        const s = schema[k];
        if (!s) { r.fails.push(`preset "${pr.name}": unknown key ${k}`); continue; }
        if (s.type === "select") { const o = (s.options || []).map((x) => (Array.isArray(x) ? x[0] : x)); if (!o.includes(v)) r.fails.push(`preset "${pr.name}": ${k}=${v} not an option`); }
        else if (typeof v !== "number" || v < s.min - 1e-9 || v > s.max + 1e-9) r.fails.push(`preset "${pr.name}": ${k}=${v} outside ${s.min}..${s.max}`);
      }
      const P = { ...D, ...(pr.params || {}) };
      const m = await M.measureNote(def, P, { pitch: pr.testPitch ?? tp, vel: 1, dur: 1.5 });
      check(`preset "${pr.name}"`, m, { minRms: 0.003 });
      const perc = /perc|hit|drum|kick|snare|hat|pluck|stab|blip|click|tick|knock|zap|perc/i.test(pr.cat || "") || pr.perc;
      if (!perc && m.rms < 0.02) r.warns.push(`preset "${pr.name}" quiet (rms ${f(m.rms)})`);
      if (m.rms > 0.17) r.warns.push(`preset "${pr.name}" hot (rms ${f(m.rms)})`);
      r.presets.push({ name: pr.name, cat: pr.cat || "", rms: f(m.rms), peak: f(m.peak), ms: m.ms });
    }
    // 3. velocity response
    const lo = await M.measureNote(def, D, { pitch: tp, vel: 0.3, dur: 1.5 });
    const hi = tp === 57 ? d0 : await M.measureNote(def, D, { pitch: tp, vel: 1, dur: 1.5 });
    r.velRatio = f(lo.rms / (hi.rms || 1e-9));
    if (!(lo.rms < hi.rms)) r.fails.push(`velocity: vel 0.3 not quieter than vel 1 (${f(lo.rms)} vs ${f(hi.rms)})`);
    const hot = await M.measureNote(def, D, { pitch: tp, vel: 1.27, dur: 1.5 });
    check("accent vel 1.27", hot, { maxPeak: 1 });
    // 4. short / long notes
    const sh = await M.measureNote(def, D, { pitch: tp, vel: 1, dur: 0.05 }, { len: 3 });
    check("short 50ms", sh, { minRms: 0.002 });
    r.shortPeak = f(sh.peak);
    if (sh.onsetJump > 0.25) r.warns.push(`short note onset jump ${f(sh.onsetJump)} (possible click)`);
    const lg = await M.measureNote(def, D, { pitch: tp, vel: 1, dur: 6 }, { len: 9 });
    check("long 6s", lg);
    if (lg.tailRms > 0.002) r.warns.push(`long note still sounding at 9 s (tail rms ${f(lg.tailRms)})`);
    if (d0.maxStop > 30) r.fails.push(`a source stops at ${d0.maxStop}s (endless tail)`);
    // 5. pitch tracking
    r.pitch = [];
    for (const pt of [40, 57, 84]) {
      const m = await M.measureNote(def, D, { pitch: pt, vel: 1, dur: 1.5 });
      const e = M.pitchOf(m.mono, 0.25, 0.6);
      const want = 440 * Math.pow(2, (pt - 69) / 12);
      const got = e ? e.f : 0;
      const ratio = got / want;
      const oct = got ? Math.round(Math.log2(ratio)) : 0;
      const cents = got ? 1200 * (Math.log2(ratio) - oct) : 0;
      r.pitch.push({ pt, want: f(want), got: f(got), oct, cents: Math.round(cents), conf: e ? f(e.conf) : 0 });
      if (!U.has(id) && !LP.has(id) && got && Math.abs(cents) > 35 && e.conf > 0.8) r.warns.push(`pitch ${pt}: ${f(got)} Hz vs ${f(want)} (${Math.round(cents)} c)`);
    }
    // 6. param sweep (min / max / every option)
    if (!quick) {
      let n = 0;
      for (const s of def.params) {
        const vals = s.type === "select" ? (s.options || []).map((x) => (Array.isArray(x) ? x[0] : x)) : [s.min, s.max];
        for (const v of vals) {
          const m = await M.measureNote(def, { ...D, [s.key]: v }, { pitch: tp, vel: 1, dur: 0.8 }, { len: 2.5 });
          n++;
          if (m.err || m.nonFinite) r.fails.push(`sweep ${s.key}=${v}: ${m.err || m.nonFinite + " non-finite"}`);
          if (m.peak >= 1) r.fails.push(`sweep ${s.key}=${v}: peak ${f(m.peak)}`);
          const levelKey = /^(level|vol|volume|gain|out|output|master|amp)$/i.test(s.key);
          if (m.rms < 0.0015 && !(levelKey && v === s.min) && !(s.min === 0 && v === 0 && /mix|level|amt|amount|vol/i.test(s.key))) r.warns.push(`sweep ${s.key}=${v}: near-silent (rms ${f(m.rms)})`);
          if (m.unstopped) r.fails.push(`sweep ${s.key}=${v}: unstopped source`);
        }
      }
      r.sweepRenders = n;
    }
    // 7. lines parse
    for (const l of def.lines || []) {
      try { const ns = parseLine(l.dsl); if (ns.some((x) => x.step < 0 || x.step > 63 || !Number.isFinite(x.pitch))) r.fails.push(`line "${l.name}" out of range`); }
      catch (e) { r.fails.push(`line "${l.name}": ${e.message}`); }
    }
    r.lines = (def.lines || []).length;
    r.presetCount = (def.presets || []).length;
  }
  return out;
}, { ids, quick: !!flags.quick, UNPITCHED: [...UNPITCHED], LOOSE_PITCH: [...LOOSE_PITCH] });

let bad = 0;
const pad = (s, n) => String(s).padEnd(n);
console.log(pad("synth", 12), pad("name", 12), pad("prm", 4), pad("pre", 4), pad("lines", 6), pad("nodes", 6), pad("ms", 7), pad("rms", 7), pad("peak", 7), pad("vel.3", 6), "fails/warns");
for (const r of Object.values(report)) {
  bad += r.fails.length;
  console.log(pad(r.id, 12), pad(r.name, 12), pad(r.params, 4), pad(r.presetCount, 4), pad(r.lines, 6), pad(r.nodes, 6), pad(r.ms, 7), pad(r.def?.rms?.toFixed(3), 7), pad(r.def?.peak?.toFixed(3), 7), pad(r.velRatio, 6), `${r.fails.length}/${r.warns.length}`);
  for (const x of r.fails.slice(0, 25)) console.log("   FAIL", x);
  if (r.fails.length > 25) console.log(`   … ${r.fails.length - 25} more fails`);
  for (const x of r.warns.slice(0, flags.warns ? 999 : 12)) console.log("   warn", x);
  if (!flags.warns && r.warns.length > 12) console.log(`   … ${r.warns.length - 12} more warns (--warns)`);
  if (flags.pitch) console.log("   pitch", JSON.stringify(r.pitch));
  if (flags.levels) for (const x of r.presets) console.log(`   ${pad(x.cat, 10)} ${pad(x.name, 26)} rms ${x.rms.toFixed(3)} peak ${x.peak.toFixed(3)} ${x.ms}ms`);
}
if (logs.length) { console.log("console:"); logs.slice(0, 20).forEach((l) => console.log("  ", l)); }
if (flags.json) fs.writeFileSync(flags.json, JSON.stringify(report, null, 1));
await b.close();
srv.close();
process.exit(bad || logs.length ? 1 : 0);
