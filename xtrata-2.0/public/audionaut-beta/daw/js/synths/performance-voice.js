// Shared building blocks for native voices. Scheduling and release ownership stay
// with createVoice. Keep the performance gain independent of the gate envelope.
export function range(key, label, min, max, step, def) {
  return { key, label, type: 'range', min, max, step, def };
}

export function bounded(value, min, max, fallback) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

export function nativeNote(ctx, dest, note, patch, schema, scale) {
  const byKey = Object.fromEntries(schema.map((p) => [p.key, p]));
  const clean = (key, value) => {
    const { min, max, def, options } = byKey[key];
    if (options) return options.includes(value) ? value : def;
    return bounded(value, min, max, def);
  };
  const P = Object.fromEntries(schema.map((p) => [p.key, clean(p.key, patch?.[p.key])]));
  const time = note.time;
  const velocity = bounded(note.vel, 0, 1.4, 1);
  const frequency = 440 * 2 ** ((bounded(note.pitch, 0, 127, 60) - 69) / 12);
  const gate = note.held ? Infinity : Math.max(0, Number.isFinite(note.dur) ? note.dur : 0.3);
  const end = time + gate + P.release + 0.004;
  function bind(key, target, map = (v) => v) {
    target.setValueAtTime(map(P[key]), time);
    ctx.bindParam?.(key, target, (v) => map(clean(key, v)));
  }
  const output = ctx.createGain();
  bind('level', output.gain, (value) => value * scale * velocity);
  output.connect(dest);
  const amp = ctx.createGain();
  amp.connect(output);
  const rise = Math.min(gate, P.attack);
  const reached = rise / P.attack;
  amp.gain.setValueAtTime(0, time);
  amp.gain.linearRampToValueAtTime(reached, time + rise);
  if (Number.isFinite(gate)) {
    if (gate > rise) amp.gain.linearRampToValueAtTime(reached, time + gate);
    // Match the host key-up slope: reach -80 dB after one release time.
    amp.gain.setTargetAtTime(0, time + gate, P.release / Math.log(10000));
    amp.gain.setValueAtTime(0, time + gate + P.release + 0.001);
  }
  function play(source, start = time, stop = end, offset) {
    if (offset === undefined) source.start(start);
    else source.start(start, offset);
    if (Number.isFinite(stop)) source.stop(stop);
    return source;
  }
  function osc(type, hz = frequency) {
    const o = ctx.createOscillator();
    o.type = type;
    ctx.markPitched?.(o);
    o.frequency.setValueAtTime(hz, time);
    return o;
  }
  return { P, time, gate, end, velocity, frequency, amp, bind, play, osc };
}

export function envelope(attack, release) {
  return [
    range('attack', 'Attack', 0.002, 1.5, 0.001, attack),
    range('release', 'Release', 0.02, 2.5, 0.01, release),
    range('level', 'Level', 0, 1, 0.01, 0.75)
  ];
}

// The XY pad writes the same two patch keys as MIDI CC 74 and 71. Host
// keyboard, bank, preset recall and touch/arrow-key handling stay shared.
export function panel(name, sub, accent, axes, knobs) {
  const item = ([key, label, fmt]) =>
    Array.isArray(fmt)
      ? { type: 'radio', key, label, options: fmt.map((value) => [value, value]) }
      : { type: 'knob', key, label, fmt };
  const [x, y] = axes.map(item);
  return {
    theme: { accent, lcd: '#f0f0da', lcdBg: '#142025', edge: '#4e6264', bg: '#1e2a30' },
    logo: ['', name],
    sub,
    cc: { 74: x.key, 71: y.key, 73: 'attack', 72: 'release', 7: 'level' },
    sections: [
      { title: 'Play', items: [{ type: 'xy', x, y }] },
      { title: 'Character', items: [{ type: 'row', items: knobs.map(item) }] },
      {
        title: 'Envelope & output',
        items: [
          {
            type: 'row',
            items: [
              ['attack', 'Attack', 'ms'],
              ['release', 'Release', 'ms'],
              ['level', 'Level', 'pct']
            ].map(item)
          }
        ]
      }
    ]
  };
}
