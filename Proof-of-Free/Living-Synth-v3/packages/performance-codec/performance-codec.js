/* Proof of Free — Living Synth v3 · performance codec.
 * Gestures, not audio: a tick-based event stream is the canonical work.
 * Merges v2's living-recording validation rigour with the v3 tick transport.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ProofOfFreePerformance = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const FORMAT = "xtrata-performance";
  const VERSION = 1;
  const MAX_EVENTS = 4096;
  const MAX_BYTES = 262144;
  const MAX_DURATION_TICKS = 1536 * 64;      // 64 loops of the shared transport
  const GATES = ["down", "move", "up"];
  const PERFORMANCE_KEYS = Object.freeze([
    "format", "version", "parentEdition", "instrumentGenomeHash",
    "engineVersion", "bpm", "durationTicks", "events"
  ]);
  const EVENT_KEYS = Object.freeze(["tick", "type", "x", "y", "pressure"]);

  const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));
  const round3 = v => Math.round(v * 1000) / 1000;

  function create(parent, events, durationTicks) {
    return {
      format: FORMAT,
      version: VERSION,
      parentEdition: parent.edition,
      instrumentGenomeHash: parent.genomeHash,
      engineVersion: parent.engineVersion,
      bpm: parent.bpm,
      durationTicks: Math.max(1, Math.round(durationTicks)),
      events: events.map(e => ({
        tick: Math.max(0, Math.round(e.tick)),
        type: e.type,
        ...(e.type !== "up" ? { x: round3(clamp01(e.x)), y: round3(clamp01(e.y)), pressure: round3(clamp01(e.pressure)) } : {})
      }))
    };
  }

  /* Throws with a precise reason; dashboards fall back to the genesis melody. */
  function validate(value, expected) {
    if (!value || typeof value !== "object") throw new Error("Performance must be a JSON object.");
    const p = value;
    if (Object.keys(p).some(key => !PERFORMANCE_KEYS.includes(key))) throw new Error("Performance contains unknown fields.");
    if (p.format !== FORMAT || p.version !== VERSION) throw new Error("Unsupported performance format or version.");
    if (!Number.isInteger(p.parentEdition) || p.parentEdition < 1 || p.parentEdition > 1024) throw new Error("Parent edition is invalid.");
    if (typeof p.instrumentGenomeHash !== "string" || !/^0x[0-9a-f]{8}$/.test(p.instrumentGenomeHash)) throw new Error("Genome hash is invalid.");
    if (!Number.isInteger(p.engineVersion) || p.engineVersion < 1) throw new Error("Engine version is invalid.");
    if (!Number.isInteger(p.durationTicks) || p.durationTicks < 1 || p.durationTicks > MAX_DURATION_TICKS) throw new Error("Duration is out of bounds.");
    if (!Array.isArray(p.events) || p.events.length < 1 || p.events.length > MAX_EVENTS) throw new Error(`Performance must contain 1–${MAX_EVENTS} events.`);
    let last = -1;
    for (const e of p.events) {
      if (!e || typeof e !== "object" || Object.keys(e).some(key => !EVENT_KEYS.includes(key))) {
        throw new Error("Performance event contains unknown fields.");
      }
      if (!Number.isInteger(e.tick) || e.tick < last || e.tick > p.durationTicks) throw new Error("Event ticks must be ordered inside the duration.");
      if (!GATES.includes(e.type)) throw new Error("Event type is invalid.");
      if (e.type === "up" && Object.keys(e).some(key => !["tick", "type"].includes(key))) {
        throw new Error("Up events must not contain gesture coordinates.");
      }
      if (e.type !== "up" && ![e.x, e.y, e.pressure].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) {
        throw new Error("Event coordinates and pressure must be between 0 and 1.");
      }
      last = e.tick;
    }
    if (expected) {
      if (p.parentEdition !== expected.edition) throw new Error("Performance targets a different edition.");
      if (expected.genomeHash && p.instrumentGenomeHash !== expected.genomeHash) throw new Error("Performance genome hash does not match this instrument.");
      if (expected.engineVersion && p.engineVersion !== expected.engineVersion) throw new Error("Performance engine version is unsupported.");
    }
    const json = JSON.stringify(p);
    const byteLength = typeof TextEncoder === "function"
      ? new TextEncoder().encode(json).byteLength
      : Buffer.byteLength(json);
    if (byteLength > MAX_BYTES) throw new Error("Performance exceeds the inscription size bound.");
    return p;
  }

  return Object.freeze({ FORMAT, VERSION, MAX_EVENTS, MAX_BYTES, MAX_DURATION_TICKS, create, validate });
});
