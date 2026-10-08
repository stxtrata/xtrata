#!/usr/bin/env node
// tools/audionaut-test.mjs — the real daw.html in headless Chromium.
//
//   node tools/audionaut-test.mjs              # the 14 polished synths
//   node tools/audionaut-test.mjs all          # every synth in the bank
//   node tools/audionaut-test.mjs tine modal   # chosen ids
//   flags: --shots=dir (panel screenshots)  --skip-keys  --skip-daw
//
// Per synth: choose it on every instrument row (synth must sound on each row's bus), open its
// panel (fits desktop + 390 px mobile, no page overflow), host preset menu lists every preset,
// keyboard feel (hold / glissando up+down / leave+re-enter / fast taps / repeated strikes /
// multi-touch / blur / tab switch / computer keys + octave / fake Web MIDI) with lights driven
// by note state and nothing left held. DAW-wide: save/load keeps ids + params, the MIDI-roll
// dropdown follows the row, four synths play together from the transport, console is clean.
import { serve, browser, page as mkPage } from "./serve.mjs";
import { POLISH } from "./ids.js";
import fs from "node:fs";

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
let ids = args.filter((a) => !a.startsWith("--"));

const { srv, url } = await serve();
const b = await browser();
const logs = [];
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); return cond; };

async function open(width = 1400, height = 900) {
  const ctx = await b.newContext({ viewport: { width, height }, hasTouch: true });
  const p = await ctx.newPage();
  await p.route("**/*", (r) => (r.request().url().startsWith(url) ? r.continue() : r.abort()));
  p.on("console", (m) => { const t = m.text(); if ((m.type() === "error" || m.type() === "warning") && !/Failed to load resource/.test(t)) logs.push(`${m.type()}: ${t}`); });
  p.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
  p.on("response", (r) => { if (r.url().startsWith(url) && r.status() >= 400) logs.push(`http ${r.status()}: ${r.url().slice(url.length)}`); });
  // fake Web MIDI: window.__midi.send([status, d1, d2]) reaches every input listener
  await p.addInitScript(() => {
    const input = { name: "Test MIDI", onmidimessage: null };
    const access = { inputs: new Map([["t", input]]), onstatechange: null };
    window.__midi = { send: (data) => input.onmidimessage && input.onmidimessage({ data: Uint8Array.from(data) }) };
    navigator.requestMIDIAccess = async () => access;
    try { localStorage.clear(); } catch {}
  });
  await p.goto(`${url}/audionaut/daw.html`);
  await p.waitForFunction(() => document.querySelectorAll(".channel.instrument").length >= 4);
  await p.evaluate(async () => {
    const [{ engine }, { store }, LK, { SYNTH_BANK }] = await Promise.all([
      import("/audionaut/daw/js/engine.js"), import("/audionaut/daw/js/state.js"),
      import("/audionaut/daw/js/live-keys.js"), import("/audionaut/daw/js/synths.js")]);
    engine.ensureContext();
    const T = (window.__T = { engine, store, LK, SYNTH_BANK, started: [], released: 0, lightsOn: new Map() });
    const s0 = engine.startNote.bind(engine), r0 = engine.releaseNote.bind(engine);
    engine.startNote = (i, pitch, vel) => { const id = s0(i, pitch, vel); T.started.push({ i, pitch, vel, id }); return id; };
    engine.releaseNote = (id) => { if (engine._live?.has(id)) T.released++; return r0(id); };
    T.reset = () => { T.started = []; T.released = 0; };
    T.taps = {};
    T.level = (i) => {
      let a = T.taps[i];
      if (!a) { a = T.taps[i] = engine.ctx.createAnalyser(); a.fftSize = 2048; engine.instrumentGains[i].connect(a); }
      const buf = new Float32Array(2048); a.getFloatTimeDomainData(buf);
      let s = 0; for (const v of buf) s += v * v; return Math.sqrt(s / buf.length);
    };
    T.peakOver = async (i, ms) => { let m = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { m = Math.max(m, T.level(i)); await new Promise((r) => setTimeout(r, 20)); } return m; };
    T.choose = (row, id) => {
      const sel = document.querySelectorAll(".inst-synth-select")[row];
      sel.value = id; sel.dispatchEvent(new Event("change", { bubbles: true }));
      return store.instrument(row).synthId;
    };
    // the open panel's keyboard: [{midi, x, y, w, h, black}] in viewport px
    T.panelRoot = () => { const host = document.querySelector("#synth-front .sfp-face-host"); const st = host && host.firstElementChild && host.firstElementChild.firstElementChild; return st && st.shadowRoot ? st.shadowRoot : document.querySelector("#synth-front"); };
    T.keys = () => {
      const r = T.panelRoot(); if (!r) return [];
      return [...r.querySelectorAll("[data-midi], #sfp-keys .sfp-key")].map((k) => {
        const b = k.getBoundingClientRect();
        const midi = k.dataset.midi != null ? +k.dataset.midi : T.LK.getOctave() * 12 + 12 + +k.dataset.i;
        return { midi, x: b.left, y: b.top, w: b.width, h: b.height, black: k.classList.contains("kb-b") || k.classList.contains("blk"), on: k.classList.contains("on") };
      });
    };
    T.hitMidi = (x, y) => { const r = T.panelRoot(); const n = (r.elementFromPoint ? r : document).elementFromPoint(x, y); const k = n && n.closest && n.closest("[data-midi], .sfp-key"); if (!k) return null; return k.dataset.midi != null ? +k.dataset.midi : T.LK.getOctave() * 12 + 12 + +k.dataset.i; };
    T.litKeys = () => T.keys().filter((k) => k.on).map((k) => k.midi);
    T.clean = () => ({ live: engine.liveCount(), held: LK.heldCount(), lit: T.litKeys() });
  });
  return { ctx, p };
}

const wait = (p, ms) => p.waitForTimeout(ms);

async function keyboardTests(p, id) {
  const tag = (m) => `${id}: keys: ${m}`;
  const keys = await p.evaluate(() => __T.keys());
  if (!ok(keys.length >= 12, tag(`keyboard not found (${keys.length} keys)`))) return;
  const whites = keys.filter((k) => !k.black).sort((a, b) => a.x - b.x);
  const yLow = (k) => k.y + k.h * 0.85;
  const settle = async () => { await p.mouse.up().catch(() => {}); await wait(p, 60); };
  // 1. press and hold one key: one note, held, lit while held, released + unlit after
  await p.evaluate(() => __T.reset());
  const k0 = whites[2];
  await p.mouse.move(k0.x + k0.w / 2, yLow(k0)); await p.mouse.down(); await wait(p, 250);
  let st = await p.evaluate(() => ({ s: __T.started.map((x) => x.pitch), c: __T.clean() }));
  ok(st.s.length === 1 && st.s[0] === k0.midi, tag(`hold: started ${JSON.stringify(st.s)} expected [${k0.midi}]`));
  ok(st.c.live === 1 && st.c.lit.includes(k0.midi), tag(`hold: not held/lit while down ${JSON.stringify(st.c)}`));
  await p.mouse.up(); await wait(p, 80);
  st = await p.evaluate(() => __T.clean());
  ok(st.live === 0 && st.held === 0 && !st.lit.length, tag(`hold: stuck after up ${JSON.stringify(st)}`));
  // 2. glissando up the white keys then back down, then across the black-key zone
  for (const [dir, row] of [["up", "low"], ["down", "low"], ["up", "high"]]) {
    await p.evaluate(() => __T.reset());
    const seq = dir === "up" ? whites : [...whites].reverse();
    const yOf = (k) => (row === "low" ? yLow(k) : k.y + k.h * 0.3);
    const x0 = seq[0].x + seq[0].w / 2, x1 = seq[seq.length - 1].x + seq[seq.length - 1].w / 2, y = yOf(seq[0]);
    await p.mouse.move(x0, y); await p.mouse.down();
    const steps = Math.ceil(Math.abs(x1 - x0) / 4);
    const pts = [];
    for (let s = 1; s <= steps; s++) { const x = x0 + ((x1 - x0) * s) / steps; pts.push(x); await p.mouse.move(x, y); }
    const exp = await p.evaluate(({ pts, x0, y }) => { const out = []; for (const x of [x0, ...pts]) { const m = __T.hitMidi(x, y); if (m != null && out[out.length - 1] !== m) out.push(m); } return out; }, { pts, x0, y });
    const got = await p.evaluate(() => __T.started.map((x) => x.pitch));
    const c = await p.evaluate(() => __T.clean());
    await p.mouse.up(); await wait(p, 80);
    const after = await p.evaluate(() => __T.clean());
    ok(JSON.stringify(got) === JSON.stringify(exp), tag(`gliss ${dir}/${row}: got ${got.length} notes ${JSON.stringify(got.slice(0, 40))} expected ${JSON.stringify(exp.slice(0, 40))}`));
    ok(c.live === 1, tag(`gliss ${dir}/${row}: ${c.live} notes sounding mid-gliss (expected 1)`));
    ok(after.live === 0 && after.held === 0 && !after.lit.length, tag(`gliss ${dir}/${row}: stuck ${JSON.stringify(after)}`));
  }
  // 3. leave the keyboard while held, come back, release outside the window
  await p.evaluate(() => __T.reset());
  const kb = { top: Math.min(...keys.map((k) => k.y)), bottom: Math.max(...keys.map((k) => k.y + k.h)) };
  await p.mouse.move(whites[1].x + whites[1].w / 2, yLow(whites[1])); await p.mouse.down();
  await p.mouse.move(whites[1].x + whites[1].w / 2, kb.top - 40, { steps: 4 });
  let c = await p.evaluate(() => __T.clean());
  ok(c.live === 0, tag(`leave: note still sounding after leaving the keys (${c.live})`));
  await p.mouse.move(whites[3].x + whites[3].w / 2, yLow(whites[3]), { steps: 4 });
  c = await p.evaluate(() => __T.clean());
  ok(c.live === 1, tag(`re-enter: expected 1 note after coming back (${c.live})`));
  await p.mouse.move(-50, -50); await p.mouse.up(); await wait(p, 80);
  c = await p.evaluate(() => __T.clean());
  ok(c.live === 0 && !c.lit.length, tag(`release outside window: stuck ${JSON.stringify(c)}`));
  // 4. fast roll across 6 keys and 12 repeated strikes on one key: no drops, no doubles
  await p.evaluate(() => __T.reset());
  for (let r = 0; r < 2; r++) for (const k of whites.slice(0, 6)) { await p.mouse.move(k.x + k.w / 2, yLow(k)); await p.mouse.down(); await p.mouse.up(); }
  for (let r = 0; r < 12; r++) { await p.mouse.down(); await p.mouse.up(); }
  await wait(p, 80);
  c = await p.evaluate(() => ({ n: __T.started.length, ...__T.clean() }));
  ok(c.n === 24, tag(`fast roll + repeats: ${c.n} notes started (expected 24)`));
  ok(c.live === 0 && c.held === 0, tag(`fast roll: stuck ${JSON.stringify(c)}`));
  // 5. multi-touch: two fingers down = two notes; lift one, then the other
  await p.evaluate(() => __T.reset());
  const cdp = await p.context().newCDPSession(p);
  const A = whites[1], B = whites[5];
  const tp = (k, id) => ({ x: k.x + k.w / 2, y: yLow(k), id });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [tp(A, 1), tp(B, 2)] });
  await wait(p, 120);
  c = await p.evaluate(() => ({ s: __T.started.map((x) => x.pitch), ...__T.clean() }));
  ok(c.live === 2 && c.s.includes(A.midi) && c.s.includes(B.midi), tag(`multitouch: ${JSON.stringify(c)}`));
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [tp(B, 2)] });
  await wait(p, 60);
  c = await p.evaluate(() => __T.clean());
  ok(c.live === 1, tag(`multitouch: lifting one finger left ${c.live} notes`));
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await wait(p, 60);
  c = await p.evaluate(() => __T.clean());
  ok(c.live === 0 && !c.lit.length, tag(`multitouch: stuck ${JSON.stringify(c)}`));
  // 6. window blur and tab switch release held notes
  for (const how of ["blur", "hidden"]) {
    await p.mouse.move(whites[2].x + whites[2].w / 2, yLow(whites[2])); await p.mouse.down(); await p.keyboard.down("d");
    await wait(p, 60);
    await p.evaluate((how) => { if (how === "blur") window.dispatchEvent(new Event("blur")); else { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); document.dispatchEvent(new Event("visibilitychange")); delete document.hidden; } }, how);
    await wait(p, 60);
    c = await p.evaluate(() => __T.clean());
    ok(c.live === 0 && c.held === 0 && !c.lit.length, tag(`${how}: notes left ${JSON.stringify(c)}`));
    await p.keyboard.up("d"); await settle();
  }
  // 7. computer keys: held while down, lights the on-screen key, octave shift moves both
  await p.evaluate(() => { __T.reset(); __T.LK.setOctave(3); });
  await p.keyboard.down("a"); await p.keyboard.down("g"); await wait(p, 80);
  c = await p.evaluate(() => ({ s: __T.started.map((x) => x.pitch), ...__T.clean() }));
  ok(JSON.stringify(c.s) === "[48,55]" && c.live === 2, tag(`typed: ${JSON.stringify(c)}`));
  const shown = new Set(keys.map((k) => k.midi));
  if (shown.has(48)) ok(c.lit.includes(48), tag(`typed: key 48 not lit (${c.lit})`));
  await p.keyboard.down("a"); // auto-repeat must not retrigger
  await p.keyboard.up("a"); await p.keyboard.up("g"); await wait(p, 60);
  c = await p.evaluate(() => ({ n: __T.started.length, ...__T.clean() }));
  ok(c.live === 0 && !c.lit.length, tag(`typed: stuck ${JSON.stringify(c)}`));
  await p.keyboard.press("x"); await wait(p, 40);
  const k2 = await p.evaluate(() => __T.keys().map((k) => k.midi));
  const fixed = await p.evaluate(() => !!__T.panelRoot().querySelector("[data-fixed-keys]"));
  if (!fixed) ok(Math.min(...k2) === Math.min(...keys.map((k) => k.midi)) + 12, tag(`octave up: on-screen keys did not move up an octave`));
  await p.evaluate(() => __T.reset());
  await p.keyboard.down("a"); await wait(p, 40);
  c = await p.evaluate(() => ({ s: __T.started.map((x) => x.pitch), ...__T.clean() }));
  ok(c.s[0] === 60 && c.lit.includes(60) === new Set(k2).has(60), tag(`octave up: typed 'a' -> ${c.s} lit ${c.lit}`));
  await p.keyboard.press("z"); // shift while held: the key-up must still release its own note
  await p.keyboard.up("a"); await wait(p, 60);
  c = await p.evaluate(() => __T.clean());
  ok(c.live === 0 && !c.lit.length, tag(`octave shift while held: stuck ${JSON.stringify(c)}`));
  // 8. Web MIDI (fake input): note-on holds + lights, note-off releases, vel follows
  await p.evaluate(() => __T.reset());
  await p.evaluate(() => { __midi.send([0x90, 60, 100]); __midi.send([0x90, 64, 40]); });
  await wait(p, 60);
  c = await p.evaluate(() => ({ s: __T.started.map((x) => [x.pitch, +x.vel.toFixed(2)]), ...__T.clean() }));
  ok(c.live === 2 && c.s.length === 2 && c.s[1][1] < c.s[0][1], tag(`midi on: ${JSON.stringify(c)}`));
  if (new Set(k2.map((m) => m - 12)).has(60)) ok(c.lit.includes(60), tag(`midi: key 60 not lit ${c.lit}`));
  await p.evaluate(() => { __midi.send([0x80, 60, 0]); __midi.send([0x90, 64, 0]); });
  await wait(p, 60);
  c = await p.evaluate(() => __T.clean());
  ok(c.live === 0 && !c.lit.length, tag(`midi off: stuck ${JSON.stringify(c)}`));
  await settle();
}

async function panelFits(p, id, label) {
  const r = await p.evaluate(() => {
    const m = document.querySelector("#modal-synth"), f = document.querySelector("#synth-front");
    const fr = f.getBoundingClientRect();
    const host = f.querySelector(".sfp-face-host > div");
    const hr = host ? host.getBoundingClientRect() : fr;
    return { open: !m.classList.contains("hidden"), fw: fr.width, fh: fr.height, hw: hr.width, vw: innerWidth, vh: innerHeight, sw: document.scrollingElement.scrollWidth, fl: fr.left, fr: fr.right };
  });
  ok(r.open, `${id}: panel did not open (${label})`);
  ok(r.hw <= r.fw + 1 && r.fl >= -1 && r.fr <= r.vw + 1, `${id}: panel overflows at ${label} ${JSON.stringify(r)}`);
  ok(r.sw <= r.vw + 1, `${id}: page scrolls sideways at ${label} (${r.sw} > ${r.vw})`);
  return r;
}

const run = async () => {
  const { ctx, p } = await open();
  const bank = await p.evaluate(() => Object.keys(__T.SYNTH_BANK));
  if (!ids.length) ids = POLISH;
  if (ids[0] === "all") ids = bank;
  if (flags.shots) fs.mkdirSync(flags.shots, { recursive: true });
  for (const id of ids) {
    // plays from every row's picker
    for (let row = 0; row < 4; row++) {
      const got = await p.evaluate(({ row, id }) => __T.choose(row, id), { row, id });
      ok(got === id, `${id}: row ${row} picker did not select it (${got})`);
      const lvl = await p.evaluate(async (row) => { __T.engine.triggerNote(row, 57, 1, 0, 0.3); if (__T.store.instrument(row).synthId === "kit") __T.engine.triggerNote(row, 38, 1, 0, 0.3); return __T.peakOver(row, 350); }, row);
      ok(lvl > 0.003, `${id}: silent on row ${row} (rms ${lvl.toFixed(4)})`);
    }
    // panel on row 0
    await p.evaluate(() => document.dispatchEvent(new CustomEvent("open-synth-panel", { detail: 0 })));
    await wait(p, 400);
    await panelFits(p, id, "1400x900");
    if (flags.shots) await p.screenshot({ path: `${flags.shots}/${id}.png` });
    // host preset menu lists every preset; choosing one recalls every param
    const pm = await p.evaluate(async (id) => {
      const sel = document.querySelector("#sfp-preset");
      const presets = __T.SYNTH_BANK[id].presets || [];
      if (!sel) return { missing: true, n: presets.length };
      const vals = [...sel.querySelectorAll("option")].filter((o) => o.value !== "");
      const bad = [];
      const { synthDefaults } = await import("/audionaut/daw/js/synths.js");
      for (const k of [presets.length - 1, Math.floor(presets.length / 2)]) {
        if (k < 0) continue;
        sel.value = String(k); sel.dispatchEvent(new Event("change"));
        const want = { ...synthDefaults(id), ...presets[k].params };
        const have = { ...synthDefaults(id), ...(__T.store.instrument(0).params || {}) };
        for (const key of Object.keys(want)) if (want[key] !== have[key]) bad.push(`${presets[k].name}.${key}: ${have[key]} != ${want[key]}`);
      }
      return { n: vals.length, want: presets.length, bad };
    }, id);
    ok(!pm.missing, `${id}: no host preset menu in the panel`);
    ok(pm.missing || pm.n === pm.want, `${id}: preset menu lists ${pm.n} of ${pm.want}`);
    ok(!pm.bad?.length, `${id}: preset recall mismatch ${JSON.stringify(pm.bad?.slice(0, 5))}`);
    await wait(p, 600); // let the preset audition release
    if (!flags["skip-keys"] && id !== "kit") await keyboardTests(p, id);
    if (id === "kit") {
      // pads: tap each pad with the real mouse -> one note each, nothing left held
      const pads = await p.evaluate(() => { __T.reset(); return [...__T.panelRoot().querySelectorAll("[data-midi]")].map((pad) => { const b = pad.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }); });
      for (const [x, y] of pads) await p.mouse.click(x, y);
      await wait(p, 450);
      const r = await p.evaluate(() => ({ n: __T.started.length, ...__T.clean() }));
      r.pads = pads.length;
      ok(r.pads >= 8 && r.n === r.pads && r.held === 0, `kit: pads ${JSON.stringify(r)}`);
    }
    // mobile width
    await p.setViewportSize({ width: 390, height: 844 }); await wait(p, 250);
    await panelFits(p, id, "390x844");
    if (flags.shots) await p.screenshot({ path: `${flags.shots}/${id}-mobile.png` });
    await p.setViewportSize({ width: 1400, height: 900 }); await wait(p, 150);
    await p.keyboard.press("Escape"); await wait(p, 100);
    const after = await p.evaluate(() => __T.clean());
    ok(after.live === 0 && after.held === 0, `${id}: notes left after closing the panel ${JSON.stringify(after)}`);
    process.stdout.write(`${id} `);
  }
  console.log();
  if (!flags["skip-daw"]) {
    // MIDI-roll dropdown follows the row
    const roll = await p.evaluate(async () => {
      __T.choose(1, "tonewheel");
      document.querySelectorAll(".roll-open")[1].click();
      await new Promise((r) => setTimeout(r, 200));
      const v = document.querySelector("#roll-synth-select").value;
      document.querySelector("#roll-close").click();
      return v;
    });
    ok(roll === "tonewheel", `roll dropdown shows ${roll}, row 1 is tonewheel`);
    // save / load keeps ids and params
    const sl = await p.evaluate(async () => {
      const P = await import("/audionaut/daw/js/persistence.js");
      const ids = ["jibass", "lantern", "vox", "kit"];
      ids.forEach((id, i) => __T.choose(i, id));
      const pr = __T.SYNTH_BANK.lantern.presets; const pick = pr[pr.length - 1];
      __T.store.setInstrumentProp(1, "params", { ...pick.params });
      const json = P.exportProject();
      ["tine", "tine", "tine", "tine"].forEach((id, i) => __T.choose(i, id));
      P.importProject(typeof json === "string" ? json : JSON.stringify(json));
      await new Promise((r) => setTimeout(r, 300));
      return { ids: [0, 1, 2, 3].map((i) => __T.store.instrument(i).synthId), same: JSON.stringify(__T.store.instrument(1).params) === JSON.stringify(pick.params), rows: [...document.querySelectorAll(".inst-synth-select")].map((s) => s.value) };
    });
    ok(JSON.stringify(sl.ids) === '["jibass","lantern","vox","kit"]' && sl.same, `save/load: ${JSON.stringify(sl)}`);
    ok(JSON.stringify(sl.rows) === JSON.stringify(sl.ids), `save/load: row pickers out of sync ${JSON.stringify(sl.rows)}`);
    // four synths together from the transport
    const tr = await p.evaluate(async () => {
      const { engine, store } = __T;
      ["morph", "ensemble", "fm4", "kit"].forEach((id, i) => __T.choose(i, id));
      for (let i = 0; i < 4; i++) { store.clearNotes(i); for (let s = 0; s < 64; s += 8) store.addNote(i, { step: s, dur: 4, pitch: i === 3 ? 36 + (s % 16 ? 2 : 0) : 57 + (s % 16 ? 3 : 0), vel: 1 }); }
      engine.play();
      const lv = [0, 0, 0, 0]; const t0 = performance.now();
      while (performance.now() - t0 < 1800) { for (let i = 0; i < 4; i++) lv[i] = Math.max(lv[i], __T.level(i)); await new Promise((r) => setTimeout(r, 25)); }
      engine.stop();
      return lv;
    });
    ok(tr.every((v) => v > 0.003), `transport: not every synth sounded ${JSON.stringify(tr.map((v) => +v.toFixed(4)))}`);
  }
  await ctx.close();
};

try { await run(); } catch (e) { fails.push(`harness crashed: ${e.stack || e}`); }
await b.close();
srv.close();
const noisy = logs.filter((l) => !/AudioContext was not allowed to start/.test(l));
for (const f of fails) console.log("FAIL", f);
for (const l of noisy.slice(0, 30)) console.log("console", l);
console.log(fails.length || noisy.length ? `${fails.length} failures, ${noisy.length} console errors/warnings` : "all DAW checks passed");
process.exit(fails.length || noisy.length ? 1 : 0);
