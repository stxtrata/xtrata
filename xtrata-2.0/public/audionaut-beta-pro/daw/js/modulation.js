// modulation.js — the shared modulation kit: two LFOs and four routing slots
// for every instrument.
//
// Stored on the instrument as `mod: { lfos: [..2], slots: [..4] }`. Projects
// saved before this existed have no `mod`, build no extra nodes and render
// exactly as before.
//
//   LFO   shape, a rate in Hz or a tempo division, and where it starts:
//         "note" restarts on every note, "bar" locks to the song position so
//         the movement lands on the same beat every time (synced rates only,
//         and only while the song is playing).
//   Slot  source (lfo1, lfo2, velocity, key) -> target -> amount (-1..1).
//
// Targets every instrument has: "@pitch" (±12 semitones at full amount),
// "@level" (tremolo, dips only) and "@pan". A synth also offers each of its
// live controls; a filter cutoff is moved in octaves (±4 at full amount), any
// other control across half its range.
//
// A change applies to the next note played, not to notes already sounding.

export const MOD_SHAPES = ["sine", "triangle", "saw", "ramp", "square", "random"];
export const MOD_DIVS = { "4 bars": 1 / 16, "2 bars": 1 / 8, "1 bar": 1 / 4, "1/2": 1 / 2, "1/4": 1, "1/4T": 1.5, "1/8": 2, "1/8T": 3, "1/16": 4, "1/16T": 6, "1/32": 8 }; // cycles per beat
export const MOD_SOURCES = ["lfo1", "lfo2", "velocity", "key"];
export const MOD_HOST_TARGETS = { "@pitch": "Pitch", "@level": "Volume (tremolo)", "@pan": "Pan" };
export const MOD_LFOS = 2, MOD_SLOTS = 4, MOD_MIN_HZ = 0.05, MOD_MAX_HZ = 30;

const clamp = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
const lfo = (v = {}) => ({
  shape: MOD_SHAPES.includes(v.shape) ? v.shape : "sine",
  sync: !!v.sync,
  hz: clamp(v.hz, MOD_MIN_HZ, MOD_MAX_HZ, 4),
  div: v.div in MOD_DIVS ? v.div : "1/4",
  lock: v.lock === "bar" ? "bar" : "note",
});
const slot = (v = {}) => ({
  source: MOD_SOURCES.includes(v.source) ? v.source : "lfo1",
  target: typeof v.target === "string" ? v.target.slice(0, 64) : "",
  amount: clamp(v.amount, -1, 1, 0),
});
export function normalizeMod(value) {
  return {
    lfos: Array.from({ length: MOD_LFOS }, (_, i) => lfo(value?.lfos?.[i])),
    slots: Array.from({ length: MOD_SLOTS }, (_, i) => slot(value?.slots?.[i])),
  };
}
export const activeSlots = (mod) => (mod?.slots || []).filter((s) => s.target && s.amount);
export const modActive = (mod) => activeSlots(mod).length > 0;
export const lfoHz = (l, bpm = 120) => (l.sync ? clamp((bpm / 60) * MOD_DIVS[l.div], 0.005, 200, 2) : l.hz);
// Position in the cycle (in cycles) when the note starts.
export const lfoPhase = (l, beat) => (l.sync && l.lock === "bar" && Number.isFinite(beat) ? beat * MOD_DIVS[l.div] : 0);

// One cycle is CYCLE samples; "random" holds a new value for each of 16 cycles.
const CYCLE = 4096, RANDOM_CYCLES = 16, tables = new Map();
function table(shape, sampleRate) {
  const key = `${shape}:${sampleRate}`;
  if (tables.has(key)) return tables.get(key);
  const cycles = shape === "random" ? RANDOM_CYCLES : 1, data = new Float32Array(CYCLE * cycles), edge = 48;
  let seed = 0x2f6e2b1;
  const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1; };
  const steps = Array.from({ length: cycles }, next);
  for (let i = 0; i < data.length; i++) {
    const x = (i % CYCLE) / CYCLE;
    data[i] = shape === "sine" ? Math.sin(2 * Math.PI * x)
      : shape === "triangle" ? 1 - 4 * Math.abs(((x + 0.25) % 1) - 0.5)
      : shape === "saw" ? 1 - 2 * x
      : shape === "ramp" ? 2 * x - 1
      : shape === "square" ? (x < 0.5 ? 1 : -1)
      : steps[Math.floor(i / CYCLE)];
  }
  // Soften the jumps so a tremolo or pan does not click.
  if (shape !== "sine" && shape !== "triangle") {
    const smooth = data.slice();
    for (let i = 0; i < data.length; i++) { let sum = 0; for (let k = -edge; k <= edge; k++) sum += data[(i + k + data.length) % data.length]; smooth[i] = sum / (2 * edge + 1); }
    data.set(smooth);
  }
  const buffer = new AudioBuffer({ length: data.length, sampleRate, numberOfChannels: 1 });
  buffer.copyToChannel(data, 0);
  const entry = { buffer, cycles };
  tables.set(key, entry);
  return entry;
}

// Output stage for the targets every instrument has. Returns the node a voice
// should connect to instead of `destination`, plus the targets it adds.
export function modOutput(ctx, mod, destination) {
  const slots = activeSlots(mod), nodes = [], targets = new Map();
  let input = destination;
  if (slots.some((s) => s.target === "@pan") && ctx.createStereoPanner) {
    const pan = ctx.createStereoPanner(); pan.connect(input); input = pan; nodes.push(pan);
    targets.set("@pan", [{ param: pan.pan, depth: 1 }]);
  }
  const level = slots.filter((s) => s.target === "@level");
  if (level.length) {
    const trem = ctx.createGain(); trem.connect(input); input = trem; nodes.push(trem);
    // Dips only: the loudest point of the tremolo is the unmodulated level.
    trem.gain.value = Math.max(0, 1 - level.reduce((sum, s) => sum + Math.abs(s.amount) / 2, 0));
    targets.set("@level", [{ param: trem.gain, depth: 0.5 }]);
  }
  return { input, nodes, targets };
}

// Connect the active slots. `targets` maps a target name to [{ param, depth }]
// where depth is the swing at full amount, in the param's own units.
// `age` is how long the note has already been sounding (a rebuilt or resumed voice).
export function attachModulation(ctx, mod, { note, startAt, age = 0, targets }) {
  const nodes = [], sources = new Map(), at = Math.max(0, startAt);
  const sourceFor = (name) => {
    if (sources.has(name)) return sources.get(name);
    let node;
    if (name === "lfo1" || name === "lfo2") {
      const l = mod.lfos[name === "lfo1" ? 0 : 1], { buffer, cycles } = table(l.shape, ctx.sampleRate), hz = lfoHz(l, note.bpm);
      node = ctx.createBufferSource(); node.buffer = buffer; node.loop = true;
      node.playbackRate.value = hz * CYCLE / ctx.sampleRate;
      const phase = (((lfoPhase(l, note.beat) + Math.max(0, age) * hz) % cycles) + cycles) % cycles;
      node.start(at, phase * CYCLE / ctx.sampleRate);
    } else {
      node = ctx.createConstantSource();
      node.offset.value = name === "velocity" ? clamp(note.vel, 0, 1, 0.8) : clamp(((note.pitch ?? 60) - 60) / 48, -1, 1, 0);
      node.start(at);
    }
    nodes.push(node); sources.set(name, node);
    return node;
  };
  for (const s of activeSlots(mod)) for (const { param, depth } of targets.get(s.target) || []) {
    if (!param || !Number.isFinite(depth) || !depth) continue;
    const gain = ctx.createGain(); gain.gain.value = s.amount * depth;
    sourceFor(s.source).connect(gain); gain.connect(param); nodes.push(gain);
  }
  return {
    nodes,
    stop(when = 0) { for (const node of sources.values()) { try { node.stop(when); } catch { /* already stopped */ } } },
    dispose() { this.stop(); for (const node of nodes) { try { node.disconnect(); } catch { /* gone */ } } },
  };
}
