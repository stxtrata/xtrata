// Catalogue requests extend the workstation resolver/decoder, with shared cancellable jobs.
import { ordinalId, resolveSource, extractAudio } from "./loader.js";
import { engine } from "./engine.js";
import { audioHash } from "./onboard-library.js";
import { store } from "./state.js";
const payloads = new Map(),
  decoded = new Map(),
  jobs = new Map(),
  queue = [];
const PAYLOAD_LIMIT = 32 * 1024 * 1024,
  DECODED_LIMIT = 64 * 1024 * 1024;
let running = 0;
const cancelled = () =>
  new DOMException("Audio loading cancelled.", "AbortError");
function fail(message, code) {
  const e = Error(message);
  e.code = code;
  return e;
}
function keep(map, key, value, limit, size) {
  map.delete(key);
  map.set(key, value);
  let total = [...map.values()].reduce((sum, v) => sum + size(v), 0);
  for (const [k, v] of map) {
    if (total <= limit) break;
    map.delete(k);
    total -= size(v);
  }
}
const payloadSize = (v) =>
  v.sourceBytes.byteLength +
  (v.sourceBytes === v.arrayBuffer ? 0 : v.arrayBuffer.byteLength);
const decodedSize = (v) =>
  v.audioBuffer.length * v.audioBuffer.numberOfChannels * 4;
export function catalogueCacheStats() {
  return {
    payloadBytes: [...payloads.values()].reduce(
      (n, v) => n + payloadSize(v),
      0,
    ),
    decodedBytes: [...decoded.values()].reduce((n, v) => n + decodedSize(v), 0),
    payloadLimit: PAYLOAD_LIMIT,
    decodedLimit: DECODED_LIMIT,
    pending: jobs.size,
    running,
  };
}
export function clearCatalogueCache() {
  payloads.clear();
  decoded.clear();
}
async function resolve(job) {
  const { source, controller } = job,
    signal = controller.signal,
    id = ordinalId(source.value),
    key = id;
  let p = payloads.get(key);
  if (!p) {
    const urls = [
      resolveSource(source),
      ...(Array.isArray(store.settings.ordinalsFallbacks)
        ? store.settings.ordinalsFallbacks.map(
            (g) => g.replace(/\/?$/, "/") + id,
          )
        : []),
    ];
    let last;
    for (const url of [...new Set(urls)]) {
      if (!/^https?:\/\//.test(url)) continue;
      try {
        const response = await fetch(url, { signal });
        if (!response.ok)
          throw fail(
            `Gateway returned ${response.status}; retry or change the Ordinals gateway in Settings.`,
            "GATEWAY",
          );
        try {
          p = await extractAudio(
            response,
            source.label || id,
            signal,
            0,
            false,
          );
        } catch (e) {
          if (e.name === "AbortError") throw e;
          throw fail(`Unsupported source format: ${e.message}`, "FORMAT");
        }
        p.sourceHash = await audioHash(p.sourceBytes);
        p.payloadHash = await audioHash(p.arrayBuffer);
        p.retrievedVia = url;
        break;
      } catch (e) {
        if (signal.aborted) throw cancelled();
        if (e.code === "FORMAT") throw e;
        last = e;
      }
    }
    if (!p)
      throw fail(
        `Audio gateway unreachable: ${last?.message || "no valid gateway"}. Retry when online or change Settings.`,
        "GATEWAY",
      );
  }
  if (
    (source.sourceSha256 && p.sourceHash !== source.sourceSha256) ||
    (source.audioSha256 && p.payloadHash !== source.audioSha256)
  )
    throw fail(
      "Source/payload SHA-256 mismatch. The recording was not substituted.",
      "HASH",
    );
  if (signal.aborted) throw cancelled();
  keep(payloads, key, p, PAYLOAD_LIMIT, payloadSize);
  const bufferKey = id + ":" + p.payloadHash;
  let b = decoded.get(bufferKey);
  if (!b) {
    try {
      b = {
        audioBuffer: await engine
          .ensureContext()
          .decodeAudioData(p.arrayBuffer.slice(0)),
      };
    } catch {
      throw fail("Unsupported audio codec or invalid audio payload.", "FORMAT");
    }
    if (signal.aborted) throw cancelled();
  }
  keep(decoded, bufferKey, b, DECODED_LIMIT, decodedSize);
  return { ...p, ...b };
}
function pump() {
  while (running < 2 && queue.length) {
    const job = queue.shift();
    if (job.controller.signal.aborted) {
      job.reject(cancelled());
      continue;
    }
    running++;
    resolve(job)
      .then(job.resolve, job.reject)
      .finally(() => {
        running--;
        pump();
      });
  }
}
export function fetchCatalogueAudio(
  source,
  { signal = null, timeoutMs = 30000 } = {},
) {
  if (source.type !== "ordinal")
    return Promise.reject(
      fail(
        "Samples & Loops requires a Bitcoin inscription source.",
        "IDENTITY",
      ),
    );
  if (signal?.aborted) return Promise.reject(cancelled());
  const id = ordinalId(source.value),
    key =
      id + ":" + (source.sourceSha256 || "") + ":" + (source.audioSha256 || "");
  let job = jobs.get(key);
  if (job?.controller.signal.aborted) job = null;
  if (!job) {
    const controller = new AbortController();
    job = { source: { ...source, value: id }, controller, users: 0 };
    job.promise = new Promise((resolve, reject) => {
      job.resolve = resolve;
      job.reject = reject;
    });
    job.timer = setTimeout(() => {
      job.timedOut = true;
      controller.abort();
    }, timeoutMs);
    jobs.set(key, job);
    queue.push(job);
    job.promise
      .finally(() => {
        clearTimeout(job.timer);
        if (jobs.get(key) === job) jobs.delete(key);
      })
      .catch(() => {});
  }
  job.users++;
  const result = new Promise((resolve, reject) => {
    let finished = false;
    const finish = (error, value) => {
      if (finished) return;
      finished = true;
      signal?.removeEventListener("abort", abort);
      job.users--;
      if (!job.users) job.controller.abort();
      error ? reject(error) : resolve(value);
    };
    const abort = () => finish(cancelled());
    signal?.addEventListener("abort", abort, { once: true });
    job.promise.then(
      (v) => finish(null, v),
      (e) =>
        finish(
          job.timedOut
            ? fail(
                "Audio request timed out after 30 seconds. Retry the source.",
                "TIMEOUT",
              )
            : e,
        ),
    );
  });
  pump();
  return result;
}
