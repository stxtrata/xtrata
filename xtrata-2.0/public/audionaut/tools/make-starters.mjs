#!/usr/bin/env node
// tools/make-starters.mjs — builds the starter song library (daw/data/starters/*.json + index.json).
//
//   node tools/make-starters.mjs              # every song in tools/starter-songs.mjs
//   node tools/make-starters.mjs deep-house   # chosen ids
//   env CHROMIUM_PATH=/path/to/chrome         # if Playwright's own browser is not installed
//
// Each song is assembled inside the real app: the groove is loaded from the Analog Kit beat library,
// the synth parts come from tools/starter-songs.mjs, then the levels are set by measurement
// (every part is played alone, scaled to sit under the drums, then the master brings the whole
// song to a safe peak). Output is the app's own project JSON, so the dropdown loads it like a
// saved session.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve, page } from "./serve.mjs";
import { SONGS, buildNotes } from "./starter-songs.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../daw/data/starters");
const DEFAULT_ID = "afrobeat"; // opens on a first visit; listed first
const WELCOME = {
  id: "welcome",
  name: "Welcome Funk",
  projectName: "Welcome to The Audionaut", // the saved file carries its own title
  genre: "Funk",
  blurb: "The original starter: funk break, acid pluck, Rhodes and a bass line.",
  file: "starter-session.json",
  bpm: 108,
};

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const songs = SONGS.filter((s) => !only.length || only.includes(s.id));

let pw;
for (const p of ["playwright", "/opt/npm-tools/node_modules/playwright/index.mjs", "/home/claude/.npm-global/lib/node_modules/playwright/index.mjs"]) {
  try { pw = await import(p); break; } catch { /* next */ }
}
if (!pw) throw new Error("Playwright not found");
const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
});
const { srv, url } = await serve();
const logs = [];
const p = await page(browser, url, { logs });
await p.goto(`${url}/audionaut/daw.html`);
await p.waitForFunction(() => /Welcome to The Audionaut|failed|retry/i.test(document.querySelector("#status-text").textContent), null, { timeout: 90000 });
await p.waitForTimeout(1000);

fs.mkdirSync(OUT, { recursive: true });
const index = [];
const report = [];

for (const song of songs) {
  const notes = buildNotes(song);
  const t0 = Date.now();
  const result = await p.evaluate(async ({ song, notes }) => {
    const base = "/audionaut/daw/js/";
    const { store, makeProject, makeSequence } = await import(base + "state.js");
    const { engine } = await import(base + "engine.js");
    const { DRUM_BEATS_ANALOG } = await import(base + "analog-kits.js");
    const { loadBeatPreset } = await import(base + "l1-beat-loader.js");
    const { makeSlot } = await import(base + "plugins.js");
    const { synthDefaults, SYNTH_BANK } = await import(base + "synths.js");
    const { exportProject } = await import(base + "persistence.js");

    engine.stop();
    store.loadProject(makeProject());
    const src = DRUM_BEATS_ANALOG.find((b) => b.id === song.beat);
    if (!src) throw new Error(`no beat ${song.beat}`);
    const preset = JSON.parse(JSON.stringify(src));
    await loadBeatPreset(preset);
    const p = store.project;
    const roles = preset.channels.map((c) => c.role || "");
    const isKick = (r) => /^K\d*$/.test(r);
    const isSnare = (r) => /^(S|S\d|SS|C|C\d)$/.test(r);

    // ---- drums: sequence 1 = the groove, 2 = groove with a bar-4 fill, 3 = breakdown
    const groove = p.sequences[0].steps.map((r) => r.slice());
    const withFill = groove.map((row, ch) => {
      const r = row.slice();
      if (isSnare(roles[ch])) for (const s of [58, 60, 61, 62, 63]) r[s] = s === 63 ? 2 : 1;
      return r;
    });
    const breakdown = groove.map((row, ch) => {
      const r = row.slice();
      if (isKick(roles[ch])) {
        for (let s = 0; s < 48; s++) if (s % 16) r[s] = 0;
      } else if (isSnare(roles[ch])) {
        for (let s = 0; s < 48; s++) r[s] = 0;
      }
      return r;
    });
    const seqs = [groove, withFill, breakdown].map((rows, i) => {
      const s = makeSequence(p.channels.length);
      rows.forEach((r, ch) => (s.steps[ch] = r.slice()));
      s.notes = notes[i];
      return s;
    });
    p.sequences = seqs;

    // ---- instruments: lead 0, keys 1, pad 2, bass 3
    const slots = ["lead", "keys", "pad", "bass"];
    const names = {};
    slots.forEach((role, i) => {
      const part = song.parts[role];
      const bank = SYNTH_BANK[part.synth];
      const preset = bank.presets?.find((x) => x.name === part.preset);
      if (!preset) throw new Error(`${song.id}: no preset "${part.preset}" in ${part.synth}`);
      Object.assign(p.instruments[i], {
        synthId: part.synth,
        volume: part.volume,
        mute: false,
        solo: false,
        params: { ...synthDefaults(part.synth), ...(preset.params || {}) },
        inserts: [],
        fx: (part.fx || []).map(([type, amount]) => makeSlot(type, { amount })),
      });
      names[role] = `${part.synth}:${part.preset}`;
    });

    // ---- project settings
    p.projectName = song.name;
    p.artistName = "";
    p.bpm = song.bpm || src.bpm;
    p.swing = song.swing ?? src.swing ?? 0;
    p.masterVolume = 0.7;
    p.continuous = true;
    p.currentSequence = 0;
    delete p.lastBeat;
    p.lastPresetChannels = 0;
    p.channels.forEach((c) => {
      c.volume = +Math.min(1, c.volume * 1.15).toFixed(3);
      c.mute = false;
      c.solo = false;
    });
    store.loadProject(p);
    const proj = store.project;

    // ---- level balance by measurement (sequence 2, the full one)
    const an = engine.ctx.createAnalyser();
    an.fftSize = 2048;
    engine.masterGain.connect(an);
    const buf = new Float32Array(an.fftSize);
    const measure = async (ms) => {
      store.project.continuous = false;
      store.selectSequence(1);
      engine.stop();
      engine.play();
      let peak = 0, sum = 0, n = 0;
      const t = performance.now();
      while (performance.now() - t < ms) {
        await new Promise((r) => setTimeout(r, 25));
        an.getFloatTimeDomainData(buf);
        let m = 0, s = 0;
        for (const v of buf) { m = Math.max(m, Math.abs(v)); s += v * v; }
        peak = Math.max(peak, m);
        sum += s / buf.length;
        n++;
      }
      engine.stop();
      return { peak, rms: Math.sqrt(sum / n) };
    };
    const solo = (drums, part) => {
      proj.channels.forEach((c) => (c.mute = !drums));
      proj.instruments.forEach((inst, i) => (inst.mute = part !== i));
      engine.applySolo?.({});
    };
    const MS = 5200;
    solo(true, -1);
    const drum = await measure(MS);
    const rms = {};
    const targets = { lead: 0.5, keys: 0.5, pad: 0.45, bass: 0.85 };
    for (let i = 0; i < 4; i++) {
      solo(false, i);
      rms[slots[i]] = (await measure(MS)).rms;
    }
    slots.forEach((role, i) => {
      const inst = proj.instruments[i];
      if (rms[role] > 1e-4 && drum.rms > 1e-4) {
        const want = drum.rms * (targets[role] * (song.parts[role].mix ?? 1));
        inst.volume = +Math.max(0.06, Math.min(1, inst.volume * Math.max(0.35, Math.min(2.5, want / rms[role])))).toFixed(3);
      }
    });
    let all;
    for (let pass = 0; pass < 2; pass++) {
      proj.channels.forEach((c) => (c.mute = false));
      proj.instruments.forEach((inst) => (inst.mute = false));
      engine.applySolo?.({});
      all = await measure(MS + 1500);
      const scale = 0.84 / Math.max(all.peak, 1e-3);
      if (scale > 0.95 && scale < 1.05) break;
      proj.masterVolume = +Math.max(0.2, Math.min(1, proj.masterVolume * scale)).toFixed(3);
      engine.setMasterVolume?.(proj.masterVolume);
    }
    proj.channels.forEach((c) => (c.mute = false));
    proj.instruments.forEach((inst) => (inst.mute = false));
    proj.continuous = true;
    proj.currentSequence = 0;
    engine.applySolo?.({});
    engine.masterGain.disconnect(an);
    return {
      json: exportProject({ compact: true }),
      info: {
        names,
        bpm: proj.bpm,
        swing: proj.swing,
        master: proj.masterVolume,
        vols: proj.instruments.map((i) => i.volume),
        drumRms: +drum.rms.toFixed(3),
        peak: +all.peak.toFixed(2),
        channels: proj.channels.map((c) => c.name),
      },
    };
  }, { song, notes });

  const file = `${song.id}.json`;
  fs.writeFileSync(path.join(OUT, file), result.json);
  index.push({ id: song.id, name: song.name, genre: song.genre, blurb: song.blurb, bpm: result.info.bpm, file: `starters/${file}` });
  report.push({ id: song.id, ...result.info, kb: Math.round(result.json.length / 1024), s: Math.round((Date.now() - t0) / 1000) });
  console.log(`${song.id.padEnd(12)} bpm ${String(result.info.bpm).padEnd(4)} master ${result.info.master} peak ${result.info.peak} vols ${result.info.vols.join("/")} drumRms ${result.info.drumRms} ${Math.round(result.json.length / 1024)}KB ${Math.round((Date.now() - t0) / 1000)}s`);
}

// index.json lists the whole library in order; keep songs from earlier runs that were not rebuilt
const indexPath = path.join(OUT, "index.json");
let previous = [];
try { previous = JSON.parse(fs.readFileSync(indexPath, "utf8")).songs || []; } catch { /* first run */ }
const byId = new Map(previous.map((s) => [s.id, s]));
for (const s of index) byId.set(s.id, s);
const order = [DEFAULT_ID, WELCOME.id, ...SONGS.map((s) => s.id).filter((id) => id !== DEFAULT_ID)];
const songsOut = order.map((id) => (id === WELCOME.id ? WELCOME : byId.get(id))).filter(Boolean);
fs.writeFileSync(indexPath, JSON.stringify({ songs: songsOut }, null, 1) + "\n");
console.log("logs:", logs);
await browser.close();
srv.close();
