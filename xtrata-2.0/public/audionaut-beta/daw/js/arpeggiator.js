// Audio-clock arpeggiator. Inputs are held notes; output is scheduled, finite notes.
// The engine owns the actual source start/stop times, including queued-note cancellation.
export const ARP_DEFAULTS = Object.freeze({ enabled: false, rate: 4, mode: "up", octaves: 1, gate: 0.65 });
export function normalizeArp(value = {}) {
  value = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    enabled: value.enabled === true,
    rate: [1, 2, 4, 8].includes(+value.rate) ? +value.rate : 4,
    mode: ["up", "down", "updown", "random"].includes(value.mode) ? value.mode : "up",
    octaves: Math.min(4, Math.max(1, Math.round(+value.octaves || 1))),
    gate: Math.min(0.95, Math.max(0.1, Number.isFinite(+value.gate) ? +value.gate : 0.65)),
  };
}
export function arpOrder(notes, settings) {
  const unique = new Map();
  for (const n of notes) for (let o = 0; o < settings.octaves; o++) {
    const pitch = n.pitch + o * 12;
    if (pitch <= 127 && !unique.has(pitch)) unique.set(pitch, { ...n, pitch });
  }
  const list = [...unique.values()].sort((a, b) => a.pitch - b.pitch);
  if (settings.mode === "down") list.reverse();
  if (settings.mode === "updown" && list.length > 2) list.push(...list.slice(1, -1).reverse());
  return list;
}
export function createArpeggiator({ now, bpm, settings, notes, play, stop, position = () => null }) {
  const runs = new Map();
  let timer = null;
  function tick() {
    timer = null;
    const t = now();
    for (const [inst, run] of runs) {
      const cfg = settings(inst), list = arpOrder(notes(inst), cfg);
      if (!cfg.enabled || !list.length) { cancel(inst); continue; }
      const interval = 60 / Math.max(20, bpm()) / cfg.rate;
      const pos = position(t);
      if (pos?.playing && (!run.transport || run.interval !== interval)) {
        const phase = ((pos.elapsedSteps / 4 * cfg.rate) % 1 + 1) % 1;
        run.next = t + (1 - phase) * interval;
      }
      run.transport = !!pos?.playing;
      run.interval = interval;
      // Skip missed ticks after suspension; never burst a backlog of notes.
      if (run.next < t - 0.02) run.next = t + 0.005;
      while (run.next < t + 0.1) {
        const index = cfg.mode === "random" ? Math.floor(Math.random() * list.length) : run.cursor++ % list.length;
        const id = play(inst, list[index], run.next, interval * cfg.gate);
        if (id) run.voices.add(id);
        run.next += interval;
      }
    }
    if (runs.size) timer = setTimeout(tick, 20);
  }
  function cancel(inst) {
    const run = runs.get(inst);
    if (!run) return;
    runs.delete(inst);
    for (const id of run.voices) stop(id);
    if (!runs.size) { clearTimeout(timer); timer = null; }
  }
  return {
    update(inst) {
      const cfg = settings(inst);
      if (!cfg.enabled || !notes(inst).length) return cancel(inst);
      if (!runs.has(inst)) {
        // First key speaks immediately. Later ticks follow an audio-clock beat grid.
        const t = now(), pos = position(t), interval = 60 / Math.max(20, bpm()) / cfg.rate;
        const phase = pos?.playing ? ((pos.elapsedSteps / 4 * cfg.rate) % 1 + 1) % 1 : 0;
        const first = arpOrder(notes(inst), cfg)[0];
        const id = play(inst, first, t + 0.005, interval * cfg.gate);
        runs.set(inst, { next: t + (phase > 0.001 ? (1 - phase) * interval : interval), cursor: 1, voices: new Set(id ? [id] : []), transport: !!pos?.playing, interval });
      }
      if (!timer) tick();
    },
    cancel,
    clear() { for (const inst of [...runs.keys()]) cancel(inst); },
    ended(id) { for (const run of runs.values()) run.voices.delete(id); },
  };
}
