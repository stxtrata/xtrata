import { renderFm } from "../synths-voices.js";
import { renderKiln } from "./glass/kiln.js";
import { renderAnneal } from "./glass/anneal.js";
import { renderPalinode } from "./glass/palinode.js";
import { renderLantern } from "./glass/lantern.js";
export const RENDERED_SYNTHS = new Set(["fm4", "kiln", "anneal", "palinode", "lantern"]);
export function renderJob({ synthId, note, params: P, sampleRate: sr, seed = 0 }) {
  let { pitch, vel, dur } = note;
  const maxSeconds = Math.max(0.1, dur) + Math.max(0.1, P.release || 0) * 1.5 + 2;
  if (!Number.isFinite(dur) || maxSeconds * sr * 8 > 96 * 1024 * 1024) throw new Error("This note exceeds the 96 MB render budget. Shorten it or use a native sustained instrument.");
  if (synthId === "fm4") return [{ channels: [renderFm(P, pitch, Math.round(vel * 32) / 32, Math.round(dur * 500) / 500, sr)], sampleRate: sr }];
  if (synthId === "kiln") { const r = renderKiln(P, pitch, Math.round(vel * 100) / 100, Math.round(dur * 100) / 100, sr, (seed % 3) + 1); return [{ channels: r.mono ? [r.L] : [r.L, r.R], sampleRate: sr }]; }
  if (synthId === "anneal") { const r = renderAnneal(P, pitch, vel, dur, sr); return [{ channels: [r.l, r.r], sampleRate: sr }]; }
  if (synthId === "palinode") { const r = renderPalinode(P, pitch, vel, dur, sr); return [{ channels: [r.L, r.R], sampleRate: sr }]; }
  if (synthId === "lantern") { const r = renderLantern(P, pitch, vel, dur, sr, { lowRate: true }); return r ? [{ channels: [r.L, r.R], sampleRate: r.sr || sr }, ...(r.tick ? [{ channels: [r.tick], sampleRate: sr }] : [])] : []; }
  return null;
}
