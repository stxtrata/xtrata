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
  const MAX_PATTERN_STEPS = 64;              // 4 bars × 16 steps (loop trait: 1/2/4)
  const GATES = ["down", "move", "up"];

  const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));
  const round3 = v => Math.round(v * 1000) / 1000;

  /* opts.pattern (drum editions): step array — the child changes the BEAT.
   * null entries are rests; hits are {vel, prob, pitch, accent}. */
  function create(parent, events, durationTicks, opts) {
    const perf = {
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
    if (opts?.pattern) {
      perf.pattern = opts.pattern.map(s => s ? {
        vel: round3(clamp01(s.vel ?? 0.7)),
        prob: round3(clamp01(s.prob ?? 1)),
        pitch: Math.max(-12, Math.min(12, Math.round(s.pitch || 0))),
        accent: !!s.accent
      } : null);
      if (opts.loopBars) perf.loopBars = Math.max(1, Math.min(4, Math.round(opts.loopBars)));
    }
    /* Persistent tone shaping (drum editions): the pad position the owner
     * settled on — x → tone/pitch · y → decay/FX character. */
    if (opts?.tone) perf.tone = { x: round3(clamp01(opts.tone.x)), y: round3(clamp01(opts.tone.y)) };
    return perf;
  }

  function validatePattern(pattern, expectedLength) {
    if (!Array.isArray(pattern) || pattern.length < 1 || pattern.length > MAX_PATTERN_STEPS) {
      throw new Error(`Pattern must contain 1–${MAX_PATTERN_STEPS} steps.`);
    }
    if (pattern.length % 16 !== 0) throw new Error("Pattern length must be a whole number of 16-step bars.");
    if (expectedLength && pattern.length !== expectedLength) {
      throw new Error(`Pattern must be ${expectedLength} steps for this edition's loop.`);
    }
    for (const s of pattern) {
      if (s === null) continue;
      if (!s || typeof s !== "object") throw new Error("Pattern steps must be null or hit objects.");
      if (![s.vel, s.prob].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) throw new Error("Pattern velocity and probability must be between 0 and 1.");
      if (!Number.isInteger(s.pitch) || s.pitch < -12 || s.pitch > 12) throw new Error("Pattern pitch offset must be an integer between -12 and 12.");
      if (typeof s.accent !== "boolean") throw new Error("Pattern accent must be boolean.");
    }
    return pattern.map(s => s && { vel: s.vel, prob: s.prob, pitch: s.pitch, accent: s.accent });
  }

  /* Throws with a precise reason; dashboards fall back to the genesis melody. */
  function validate(value, expected) {
    if (!value || typeof value !== "object") throw new Error("Performance must be a JSON object.");
    const p = value;
    if (p.format !== FORMAT || p.version !== VERSION) throw new Error("Unsupported performance format or version.");
    if (!Number.isInteger(p.parentEdition) || p.parentEdition < 1 || p.parentEdition > 1024) throw new Error("Parent edition is invalid.");
    if (typeof p.instrumentGenomeHash !== "string" || !/^0x[0-9a-f]{8}$/.test(p.instrumentGenomeHash)) throw new Error("Genome hash is invalid.");
    if (!Number.isInteger(p.engineVersion) || p.engineVersion < 1) throw new Error("Engine version is invalid.");
    if (!Number.isInteger(p.durationTicks) || p.durationTicks < 1 || p.durationTicks > MAX_DURATION_TICKS) throw new Error("Duration is out of bounds.");
    const hasPattern = p.pattern !== undefined && p.pattern !== null;
    if (hasPattern) validatePattern(p.pattern, expected?.patternLength || undefined);
    if (p.loopBars !== undefined && ![1, 2, 4].includes(p.loopBars)) throw new Error("Loop bars must be 1, 2 or 4.");
    if (p.tone !== undefined) {
      if (!p.tone || typeof p.tone !== "object" || ![p.tone.x, p.tone.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) {
        throw new Error("Tone shaping must be {x, y} between 0 and 1.");
      }
    }
    const minEvents = hasPattern ? 0 : 1; // a beat-only child carries no gestures
    if (!Array.isArray(p.events) || p.events.length < minEvents || p.events.length > MAX_EVENTS) throw new Error(`Performance must contain ${minEvents}–${MAX_EVENTS} events.`);
    let last = -1;
    for (const e of p.events) {
      if (!Number.isInteger(e.tick) || e.tick < last || e.tick > p.durationTicks) throw new Error("Event ticks must be ordered inside the duration.");
      if (!GATES.includes(e.type)) throw new Error("Event type is invalid.");
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
    if (JSON.stringify(p).length > MAX_BYTES) throw new Error("Performance exceeds the inscription size bound.");
    return p;
  }

  /* ============================================================
   * Session recordings — a mosaic-level live performance.
   * Where a `performance` is one instrument's gesture take, a `session`
   * is the whole set: which tiles play and every mix move (solo · mute ·
   * volume · voice-cap), tick-timed against the shared transport. It
   * replays non-interactively as a "song" — the mosaic playing itself.
   * ============================================================ */
  const SESSION_FORMAT = "xtrata-session";
  const SESSION_VERSION = 1;
  const MAX_SESSION_EVENTS = 8192;
  const MAX_SESSION_TICKS = 1536 * 512;   // generous live-set ceiling (~1h at 132bpm)
  const MAX_SESSION_BYTES = 524288;       // 512 KiB
  const SESSION_KINDS = ["on", "off", "vol", "solo", "mute", "clearSolo", "clearMute", "voices"];
  const HAS_ED = ["on", "off", "vol", "solo", "mute"];
  const edOK = e => Number.isInteger(e) && e >= 1 && e <= 1024;
  const clampEd = e => Math.max(1, Math.min(1024, Math.round(e)));

  /* meta: { collectionId, engineVersion, bpm, ppq, voices, name? } */
  function createSession(meta, events, durationTicks) {
    const out = {
      format: SESSION_FORMAT,
      version: SESSION_VERSION,
      collectionId: meta.collectionId,
      engineVersion: meta.engineVersion,
      bpm: meta.bpm,
      ppq: meta.ppq,
      voices: meta.voices === 16 ? 16 : 8,
      durationTicks: Math.max(1, Math.round(durationTicks)),
      events: events.map(e => {
        const o = { t: Math.max(0, Math.round(e.t)), k: e.k };
        if (e.k === "on" || e.k === "off") o.ed = clampEd(e.ed);
        else if (e.k === "vol") { o.ed = clampEd(e.ed); o.v = round3(clamp01(e.v)); }
        else if (e.k === "solo" || e.k === "mute") { o.ed = clampEd(e.ed); o.on = !!e.on; }
        else if (e.k === "voices") o.n = e.n === 16 ? 16 : 8;
        return o;
      })
    };
    if (meta.name) out.name = String(meta.name).slice(0, 80);
    return out;
  }

  /* Throws with a precise reason; the player refuses to run a malformed song. */
  function validateSession(value) {
    const s = typeof value === "string" ? JSON.parse(value) : value;
    if (!s || typeof s !== "object") throw new Error("Session must be a JSON object.");
    if (s.format !== SESSION_FORMAT || s.version !== SESSION_VERSION) throw new Error("Unsupported session format or version.");
    if (!Number.isInteger(s.engineVersion) || s.engineVersion < 1) throw new Error("Session engine version is invalid.");
    if (![8, 16].includes(s.voices)) throw new Error("Session voice cap must be 8 or 16.");
    if (!Number.isInteger(s.durationTicks) || s.durationTicks < 1 || s.durationTicks > MAX_SESSION_TICKS) throw new Error("Session duration is out of bounds.");
    if (!Array.isArray(s.events) || s.events.length < 1 || s.events.length > MAX_SESSION_EVENTS) throw new Error(`Session must contain 1–${MAX_SESSION_EVENTS} events.`);
    let last = -1;
    for (const e of s.events) {
      if (!e || typeof e !== "object") throw new Error("Session event must be an object.");
      if (!SESSION_KINDS.includes(e.k)) throw new Error("Session event kind is invalid.");
      if (!Number.isInteger(e.t) || e.t < last || e.t > s.durationTicks) throw new Error("Session event ticks must be ordered within the duration.");
      if (HAS_ED.includes(e.k) && !edOK(e.ed)) throw new Error("Session event edition is invalid.");
      if (e.k === "vol" && !(Number.isFinite(e.v) && e.v >= 0 && e.v <= 1)) throw new Error("Session volume must be between 0 and 1.");
      if ((e.k === "solo" || e.k === "mute") && typeof e.on !== "boolean") throw new Error("Session solo/mute flag must be boolean.");
      if (e.k === "voices" && ![8, 16].includes(e.n)) throw new Error("Session voice cap must be 8 or 16.");
      last = e.t;
    }
    if (JSON.stringify(s).length > MAX_SESSION_BYTES) throw new Error("Session exceeds the inscription size bound.");
    return s;
  }

  return Object.freeze({
    FORMAT, VERSION, MAX_EVENTS, MAX_BYTES, MAX_DURATION_TICKS, MAX_PATTERN_STEPS, create, validate, validatePattern,
    SESSION_FORMAT, SESSION_VERSION, MAX_SESSION_EVENTS, MAX_SESSION_TICKS, createSession, validateSession
  });
});
