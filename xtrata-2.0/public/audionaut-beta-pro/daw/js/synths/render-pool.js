import { renderJob, RENDERED_SYNTHS } from "./render-job.js";
import { ResourceCache, seedNumber } from "./resources.js";
const SUPPORTED = new Set(["fm4", "kiln", "anneal", "palinode", "lantern"]);
export const supportsSynthPreparation = id => SUPPORTED.has(id);
const cache = new ResourceCache(48 * 1024 * 1024), waiting = new Map();
let worker, sequence = 0, failed = null;
let synchronousRenders = 0, workerRenders = 0;
const keyOf = (id, note, params, sr, seed) => JSON.stringify([id, note.pitch, note.vel, note.dur, sr, seedNumber(seed), Object.keys(params).sort().map((key) => [key, params[key]])]);
export function preparedSynthVoice(id, note, params, sr, seed = 0) { return SUPPORTED.has(id) ? cache.get(keyOf(id, note, params, sr, seed)) : null; }
export function synthRenderStats() { return { ...cache.stats(), pending: waiting.size, workerError: failed, synchronousRenders, workerRenders }; }
export const preparedSynthBytes = layers => (layers || []).reduce((sum, layer) => sum + layer.channels.reduce((n, c) => n + c.byteLength, 0), 0);
export function clearSynthRenderCache() { cache.clear(); }
export function disposeSynthPreparation() { worker?.terminate(); worker = null; for (const job of waiting.values()) { clearTimeout(job.timer); job.reject(new Error("Synth preparation disposed.")); } waiting.clear(); cache.clear(); }
export function renderSynthVoice(synthId, note, params, sampleRate, seed = 0) {
  if (!RENDERED_SYNTHS.has(synthId)) return null;
  const key = keyOf(synthId, note, params, sampleRate, seed), hit = cache.get(key); if (hit) return hit;
  synchronousRenders++;
  const value = renderJob({synthId,note,params,sampleRate,seed:seedNumber(seed)});
  const bytes = (value || []).reduce((sum, layer) => sum + layer.channels.reduce((n,c) => n+c.byteLength,0),0);
  cache.set(key,value,bytes); return value;
}
function getWorker() {
  if (worker) return worker;
  if (typeof Worker === "undefined") return null;
  failed = null;
  worker = new Worker(new URL("./render-worker.js", import.meta.url), { type: "module", name: "AudioNaut synth preparation" });
  worker.onmessage = ({ data }) => { const job = waiting.get(data.id); if (!job) return; waiting.delete(data.id); clearTimeout(job.timer); if (data.error) job.reject(new Error(data.error)); else { workerRenders++; cache.set(job.key, data.value, preparedSynthBytes(data.value)); job.resolve(data.value); } };
  worker.onerror = (event) => { failed = event.message || "Synth preparation worker failed"; worker.terminate(); worker = null; for (const job of waiting.values()) { clearTimeout(job.timer); job.reject(new Error(failed)); } waiting.clear(); };
  return worker;
}
export async function prepareSynthVoice(synthId, note, params, sampleRate, { signal, seed = 0 } = {}) {
  if (!SUPPORTED.has(synthId)) return null;
  if (signal?.aborted) throw new DOMException("Preparation cancelled", "AbortError");
  const key = keyOf(synthId, note, params, sampleRate, seed), hit = cache.get(key);
  if (hit) return hit;
  const active = [...waiting.values()].find((job) => job.key === key); if (active) return active.promise;
  const w = getWorker();
  if (!w) return null; // real-time construction remains available on older browsers
  if (waiting.size >= 128) throw new Error("Too many pending synth preparations; prepare the song in batches.");
  const id = ++sequence;
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  const timer = setTimeout(() => { waiting.delete(id); reject(new Error("Synth preparation timed out.")); }, 60000);
  waiting.set(id, { key, promise, resolve, reject, timer });
  w.postMessage({ id, job: { synthId, note, params, sampleRate, seed: seedNumber(seed) } });
  const abort = () => { const job = waiting.get(id); if (job) { waiting.delete(id); clearTimeout(job.timer); job.reject(new DOMException("Preparation cancelled", "AbortError")); if (!waiting.size) { worker?.terminate(); worker = null; } } };
  signal?.addEventListener("abort", abort, { once: true });
  try { return await promise; } finally { signal?.removeEventListener("abort", abort); }
}

// One bounded upcoming window. The caller passes *all* notes in the window, including
// already-prepared ones, so their retained buffers count against the same budget.
// Run at most one window at a time; discard stale event.prepared references when the
// transport passes them or changes plans. This helper owns no timers or song state.
export async function prefetchSynthVoices(requests, {
  signal, maxJobs = 32, maxBytes = 24 * 1024 * 1024, concurrency = 4, onPrepared = () => {},
} = {}) {
  const aborted = () => { if (signal?.aborted) throw new DOMException("Preparation cancelled", "AbortError"); };
  aborted();
  const queue = [], report = { selected: 0, prepared: 0, retained: 0, skipped: 0, bytes: 0, errors: [] };
  const count = Math.max(1, Math.min(128, Math.floor(maxJobs))), budget = Math.max(0, maxBytes);
  for (const request of requests || []) {
    if (!SUPPORTED.has(request.synthId)) continue;
    const existing = request.prepared || request.event?.prepared;
    const estimated = existing ? preparedSynthBytes(existing)
      : (Math.max(.1, request.note.dur) + Math.max(.1, request.params.release || 0) * 1.5 + 2) * request.sampleRate * 8;
    if (!Number.isFinite(estimated) || report.selected >= count || report.bytes + estimated > budget) { report.skipped++; continue; }
    report.selected++; report.bytes += estimated;
    if (existing) { report.retained++; continue; }
    queue.push(request);
  }
  let cursor = 0;
  const run = async () => {
    while (cursor < queue.length) {
      aborted(); const request = queue[cursor++];
      try {
        const layers = await prepareSynthVoice(request.synthId, request.note, request.params, request.sampleRate, { signal, seed: request.seed });
        aborted();
        if (layers) { await onPrepared(request, layers); report.prepared++; }
      } catch (error) {
        if (error.name === "AbortError") throw error;
        report.errors.push({ id: request.event?.id || request.id || request.synthId, message: error.message });
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(queue.length, Math.max(1, Math.min(4, Math.floor(concurrency)))) }, run));
  aborted(); return report;
}
