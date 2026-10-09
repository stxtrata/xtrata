// starter-songs.mjs — the starter song library, as data plus the small amount of music theory that
// turns it into notes. Pure functions, no browser: tools/make-starters.mjs feeds the result into the
// real app (drums come from the Analog Kit beat library, synth parts from the synth bank) and
// exports one session file per song into daw/data/starters/.
//
// A song is a groove id, a key + chord progression, and four synth parts (lead, keys, pad, bass)
// each named by synth + preset + a pattern. Patterns are tiny tables below. Everything is
// deterministic (seeded by the song id) so regenerating gives the same songs.

// ------------------------------------------------------------------ theory
export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  harm: [0, 2, 3, 5, 7, 8, 11],
};
const PITCH_CLASS = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };

const mod = (n, m) => ((n % m) + m) % m;
function degreePitch(scale, tonic, degree) {
  const n = scale.length;
  return tonic + Math.floor(degree / n) * 12 + scale[mod(degree, n)];
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s) => [...s].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);

// One progression entry: [degree, size(3|4|"power"), scaleOverride?, extra?]. "9" adds the ninth.
function chordOf(song, entry) {
  const [degree, size, scaleName, extra] = entry;
  const scale = SCALES[scaleName || song.mode];
  const tonic = PITCH_CLASS[song.key];
  const pcs = [];
  if (size === "power") {
    const r = degreePitch(scale, tonic, degree);
    pcs.push(r, r + 7, r + 12);
  } else {
    for (let i = 0; i < size; i++) pcs.push(degreePitch(scale, tonic, degree + 2 * i));
    if (extra === 9) pcs.push(degreePitch(scale, tonic, degree + 8));
  }
  const root = pcs[0];
  return {
    pcs,
    root,
    i3: mod(pcs[1] - root, 12),
    i5: mod(pcs[2] - root, 12),
    i7: pcs[3] != null && extra !== 9 ? mod(pcs[3] - root, 12) : 10,
    scale,
    tonic,
    degree,
  };
}
// Close-position voicing: each chord tone placed at the octave nearest `target`.
function voice(chord, target) {
  return chord.pcs
    .map((p) => {
      let n = mod(p, 12) + 12 * Math.round((target - mod(p, 12)) / 12);
      while (n < target - 7) n += 12;
      while (n > target + 8) n -= 12;
      return n;
    })
    .sort((a, b) => a - b);
}
const nearestOctave = (pc, center) => mod(pc, 12) + 12 * Math.round((center - mod(pc, 12)) / 12);

// ------------------------------------------------------------------ pattern tables
// bass: [step, token, dur, vel]. R root, o octave, 3 / 5 / 7 chord tones, a approach to next root.
const BASS = {
  quarters: [[0, "R", 3], [4, "R", 3], [8, "R", 3], [12, "R", 3]],
  eighths: [0, 2, 4, 6, 8, 10, 12, 14].map((s) => [s, "R", 2, s % 4 ? 0.75 : 0.95]),
  offbeat: [[2, "R", 2], [6, "R", 2], [10, "R", 2], [14, "R", 2]],
  whole: [[0, "R", 15]],
  half: [[0, "R", 7], [8, "5", 7]],
  trap808: [[0, "R", 6, 1], [7, "R", 3, 0.85], [10, "R", 2, 0.8], [14, "o", 1, 0.7]],
  funk: [[0, "R", 2], [3, "R", 1, 0.7], [6, "o", 1, 0.8], [8, "R", 2], [11, "R", 1, 0.7], [13, "5", 1, 0.8], [14, "7", 2]],
  disco: [0, 2, 4, 6, 8, 10, 12, 14].map((s, i) => [s, i % 2 ? "o" : "R", 1, i % 2 ? 0.7 : 0.95]),
  walk: [[0, "R", 3], [4, "3", 3], [8, "5", 3], [12, "a", 3]],
  dub: [[0, "R", 5, 1], [6, "R", 2, 0.8], [10, "5", 3, 0.85]],
  tumbao: [[0, "R", 2], [6, "5", 2, 0.85], [8, "R", 2], [14, "5", 2, 0.8]],
  hiphop: [[0, "R", 3, 1], [6, "R", 2, 0.75], [8, "5", 2, 0.85], [12, "R", 2, 0.8]],
  reese: [[0, "R", 7], [8, "R", 5], [13, "5", 2, 0.85]],
  pulse16: Array.from({ length: 16 }, (_, s) => [s, s % 8 === 6 ? "o" : "R", 1, s % 4 === 0 ? 1 : 0.65]),
  pulse8: [0, 2, 4, 6, 8, 10, 12, 14].map((s) => [s, s % 4 === 2 ? "o" : "R", 2, s % 4 ? 0.8 : 0.95]),
  rock8: [0, 2, 4, 6, 8, 10, 12, 14].map((s) => [s, "R", 2, s % 4 ? 0.8 : 0.95]),
  garage: [[0, "R", 3], [3, "R", 2, 0.8], [6, "5", 2, 0.85], [10, "R", 3, 0.9], [14, "o", 1, 0.7]],
  bossa: [[0, "R", 3], [6, "5", 2, 0.85], [8, "R", 3], [14, "5", 2, 0.85]],
  logdrum: [[0, "R", 2, 1], [3, "R", 1, 0.7], [6, "5", 2, 0.85], [10, "R", 2, 0.9], [12, "o", 1, 0.7], [14, "5", 1, 0.75]],
  wub: [[0, "R", 7, 1], [8, "R", 3, 0.9], [12, "o", 2, 0.8]],
  gospel: [[0, "R", 3], [4, "5", 3, 0.85], [8, "R", 3], [12, "a", 3, 0.8]],
  tresillo: [[0, "R", 3, 1], [3, "R", 3, 0.85], [6, "R", 2, 0.9], [8, "R", 3, 0.9], [11, "R", 3, 0.8], [14, "5", 2, 0.8]],
};

// keys / pad / stabs: [step, dur, vel, which]. which: "all", "low" (bottom two), or a chord-tone index.
const KEYS = {
  whole: [[0, 15, 0.8, "all"]],
  half: [[0, 7, 0.85, "all"], [8, 7, 0.7, "all"]],
  charleston: [[0, 3, 0.85, "all"], [6, 2, 0.7, "all"]],
  stabsOff: [[2, 1, 0.8, "all"], [6, 1, 0.7, "all"], [10, 1, 0.8, "all"], [14, 1, 0.7, "all"]],
  skankSparse: [[6, 1, 0.8, "all"], [14, 1, 0.75, "all"]],
  housePiano: [[0, 2, 0.9, "all"], [3, 1, 0.7, "all"], [6, 2, 0.8, "all"], [10, 2, 0.75, "all"]],
  loFi: [[0, 3, 0.8, "all"], [3, 1, 0.55, "all"], [6, 3, 0.7, "all"], [10, 3, 0.65, "all"]],
  funkClav: [0, 3, 6, 7, 10, 12, 15].map((s) => [s, 1, s % 4 ? 0.7 : 0.9, "all"]),
  arp8: [0, 2, 4, 6, 8, 10, 12, 14].map((s, i) => [s, 2, s % 4 ? 0.6 : 0.8, [0, 1, 2, 3, 2, 1, 2, 3][i]]),
  arp16: Array.from({ length: 16 }, (_, s) => [s, 1, s % 4 ? 0.6 : 0.85, [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 2, 1][s]]),
  ballad: [0, 2, 4, 6, 8, 10, 12, 14].map((s, i) => [s, 2, i % 4 ? 0.55 : 0.8, [0, 2, 1, 3, 0, 2, 1, 3][i]]),
  bossa: [[0, 2, 0.8, "all"], [3, 2, 0.65, "all"], [6, 2, 0.7, "all"], [10, 2, 0.7, "all"], [13, 2, 0.65, "all"]],
  quarterChops: [[0, 3, 0.7, "all"], [4, 3, 0.6, "all"], [8, 3, 0.7, "all"], [12, 3, 0.6, "all"]],
  jazzComp: [[3, 3, 0.7, "all"], [8, 2, 0.6, "all"], [11, 4, 0.7, "all"]],
  skank16: [[2, 1, 0.8, "all"], [3, 1, 0.5, "all"], [6, 1, 0.8, "all"], [7, 1, 0.5, "all"], [10, 1, 0.8, "all"], [11, 1, 0.5, "all"], [14, 1, 0.8, "all"], [15, 1, 0.5, "all"]],
  amapiano: [[0, 3, 0.8, "all"], [3, 3, 0.65, "all"], [6, 2, 0.7, "all"], [10, 3, 0.7, "all"], [13, 2, 0.6, "all"]],
  gospel: [[0, 3, 0.9, "all"], [4, 1, 0.6, "all"], [6, 2, 0.8, "all"], [8, 3, 0.85, "all"], [12, 1, 0.6, "all"], [14, 2, 0.75, "all"]],
  rockPower: [0, 2, 4, 6, 8, 10, 12, 14].map((s) => [s, 2, s % 4 ? 0.75 : 0.95, "low"]),
  rockHold: [[0, 7, 0.9, "low"], [8, 7, 0.85, "low"]],
  tresillo: [[0, 3, 0.85, "all"], [3, 3, 0.75, "all"], [6, 2, 0.8, "all"], [8, 3, 0.85, "all"], [11, 3, 0.75, "all"], [14, 2, 0.7, "all"]],
  rave: [[0, 1, 0.95, "all"], [3, 1, 0.8, "all"], [6, 1, 0.9, "all"], [10, 1, 0.7, "all"]],
  hornHits: [[0, 2, 0.95, "all"], [3, 1, 0.8, "all"], [6, 2, 0.9, "all"], [10, 1, 0.8, "all"]],
  first: [[0, 8, 0.7, "all"]],
};

// lead rhythms, one array of [step, dur] per bar (cycled). Pitch comes from the melody generator.
const RHYTHMS = {
  hook: [
    [[0, 2], [3, 1], [4, 2], [8, 2], [11, 1], [12, 3]],
    [[0, 2], [3, 1], [4, 2], [8, 2], [11, 1], [12, 1], [14, 2]],
  ],
  sparse: [[[0, 6], [8, 4], [12, 4]], [[0, 4], [6, 2], [8, 8]]],
  eighths: [Array.from({ length: 8 }, (_, i) => [i * 2, 2]), Array.from({ length: 7 }, (_, i) => [i * 2, 2])],
  sixteenth: [
    [[0, 1], [1, 1], [2, 2], [4, 1], [5, 1], [6, 2], [8, 1], [9, 1], [10, 1], [11, 1], [12, 4]],
    [[0, 2], [2, 1], [3, 1], [4, 2], [6, 2], [8, 1], [9, 1], [10, 2], [12, 4]],
  ],
  swingy: [
    [[0, 3], [3, 1], [6, 2], [8, 3], [11, 1], [14, 2]],
    [[0, 2], [2, 2], [4, 3], [8, 2], [11, 1], [12, 4]],
  ],
  call: [[[0, 2], [2, 2], [4, 6]], [[8, 2], [10, 2], [12, 4]]],
  long: [[[0, 16]], [[0, 8], [8, 8]]],
  tresillo: [
    [[0, 3], [3, 3], [6, 2], [8, 3], [11, 3], [14, 2]],
    [[0, 3], [3, 3], [6, 4], [12, 4]],
  ],
};

// ------------------------------------------------------------------ note builders
const jitter = (rng, v, amt = 0.06) => Math.max(0.2, Math.min(1, v + (rng() - 0.5) * amt));
const r2 = (v) => Math.round(v * 100) / 100;

function bassNotes(song, part, bar, chords, rng, mode) {
  const chord = chords[bar % chords.length];
  const next = chords[(bar + 1) % chords.length];
  const center = part.center ?? 38;
  const root = nearestOctave(chord.root, center);
  const nextRoot = nearestOctave(next.root, center);
  let table = BASS[part.pattern] || BASS.quarters;
  if (mode === "break") table = BASS.whole;
  return table.map(([step, token, dur, vel = 0.9]) => {
    let pitch = root;
    if (token === "o") pitch = root + 12;
    else if (token === "5") pitch = root + chord.i5;
    else if (token === "3") pitch = root + chord.i3;
    else if (token === "7") pitch = root + chord.i7;
    else if (token === "a") pitch = nextRoot + (nextRoot > root ? -1 : 1);
    return { step: bar * 16 + step, dur, pitch, vel: r2(jitter(rng, vel)) };
  });
}

function chordNotes(table, part, bar, chords, rng, state, mode, center) {
  const chord = chords[bar % chords.length];
  const target = state.target == null ? center : Math.round((state.target + center) / 2);
  const notes = voice(chord, target);
  state.target = notes.reduce((a, b) => a + b, 0) / notes.length;
  const out = [];
  for (const [step, dur, vel, which] of table) {
    let picks;
    if (which === "all") picks = notes;
    else if (which === "low") picks = notes.slice(0, 2);
    else {
      const idx = which % notes.length;
      picks = [notes[idx] + 12 * Math.floor(which / notes.length)];
    }
    for (const pitch of picks) out.push({ step: bar * 16 + step, dur, pitch, vel: r2(jitter(rng, vel)) });
  }
  return out;
}

// A motif is a list of scale-degree steps; applied from a chord tone of each bar so it follows
// the harmony. Strong beats snap to the nearest chord tone.
function melodyNotes(song, part, chordsAll, rng, mode) {
  const lo = part.range?.[0] ?? 64;
  const hi = part.range?.[1] ?? 84;
  const rhythmName = mode === "break" ? "sparse" : part.rhythm || "hook";
  const rhythms = RHYTHMS[rhythmName] || RHYTHMS.hook;
  const makeMotif = (n) => {
    const steps = [0];
    for (let i = 1; i < n; i++) {
      const roll = rng();
      steps.push(roll < 0.3 ? -1 : roll < 0.6 ? 1 : roll < 0.7 ? 0 : roll < 0.8 ? -2 : roll < 0.9 ? 2 : roll < 0.95 ? 3 : -3);
    }
    return steps;
  };
  const motifs = [rhythms.map((r) => makeMotif(r.length)), rhythms.map((r) => makeMotif(r.length))];
  const out = [];
  let prev = null;
  for (let bar = 0; bar < 4; bar++) {
    const chord = chordsAll[bar % chordsAll.length];
    const rhythm = rhythms[bar % rhythms.length];
    // answer phrases (bars 2 and 4) use the second motif so the 4 bars read as A B A B'
    const motif = motifs[bar % 2][bar % rhythms.length];
    const tones = [0, 1, 2].map((i) => chord.pcs[i % chord.pcs.length]);
    const scale = chord.scale;
    const tonic = chord.tonic;
    // start degree: the chord tone (in scale-degree space) nearest the previous note
    const startPitchTarget = prev ?? Math.round((lo + hi) / 2);
    let best = null;
    for (let d = -14; d <= 28; d++) {
      const p = degreePitch(scale, tonic, d);
      if (p < lo || p > hi) continue;
      if (!tones.some((t) => mod(t, 12) === mod(p, 12))) continue;
      const dist = Math.abs(p - startPitchTarget) + rng() * 2;
      if (!best || dist < best.dist) best = { d, dist };
    }
    let degree = best ? best.d : 7;
    rhythm.forEach(([step, dur], i) => {
      degree += motif[i] ?? 0;
      let pitch = degreePitch(scale, tonic, degree);
      while (pitch > hi) {
        degree -= 7;
        pitch = degreePitch(scale, tonic, degree);
      }
      while (pitch < lo) {
        degree += 7;
        pitch = degreePitch(scale, tonic, degree);
      }
      const strong = step % 4 === 0 && dur >= 2;
      if (strong && !tones.some((t) => mod(t, 12) === mod(pitch, 12))) {
        for (const delta of [1, -1, 2, -2]) {
          const alt = degreePitch(scale, tonic, degree + delta);
          if (alt >= lo && alt <= hi && tones.some((t) => mod(t, 12) === mod(alt, 12))) {
            degree += delta;
            pitch = alt;
            break;
          }
        }
      }
      // the last note of the phrase comes to rest on the root
      if (bar === 3 && i === rhythm.length - 1) {
        pitch = nearestOctave(chord.root, pitch);
        if (pitch > hi) pitch -= 12;
        if (pitch < lo) pitch += 12;
      }
      out.push({ step: bar * 16 + step, dur, pitch, vel: r2(jitter(rng, strong ? 0.95 : 0.8, 0.1)) });
      prev = pitch;
    });
  }
  return out;
}

// ------------------------------------------------------------------ one song, three sequences
// Returns notes per sequence as [lead, keys, pad, bass].
//   0 groove   bass + keys carry it; lead and pad join for the last two bars (a tease)
//   1 full     everything
//   2 breakdown pad, a sparse lead, held bass and a single keys hit per bar
export function buildNotes(song) {
  const rng = mulberry32(hash(song.id));
  const prog = song.prog.map((e) => chordOf(song, e));
  const progB = (song.progB || song.prog).map((e) => chordOf(song, e));
  const parts = song.parts;

  const play = (part, chords, bars, mode) => {
    const state = {};
    const out = [];
    const isMelody = part.pattern === "melody";
    if (isMelody) {
      const m = melodyNotes(song, part, chords, rng, mode);
      return m.filter((n) => bars.includes(Math.floor(n.step / 16)));
    }
    for (const bar of bars) {
      if (BASS[part.pattern] && part.role === "bass") out.push(...bassNotes(song, part, bar, chords, rng, mode));
      else {
        const table =
          mode === "break" && part.role === "keys"
            ? KEYS.first
            : KEYS[part.pattern] || KEYS.half;
        out.push(...chordNotes(table, part, bar, chords, rng, state, mode, part.center ?? (part.role === "pad" ? 60 : 62)));
      }
    }
    return out;
  };

  const seq = (chords, mode, which) => {
    const all = [0, 1, 2, 3];
    const tail = [2, 3];
    const spec = {
      lead: which.lead,
      keys: which.keys,
      pad: which.pad,
      bass: which.bass,
    };
    return ["lead", "keys", "pad", "bass"].map((role) => {
      const part = parts[role];
      const bars = spec[role] === "tail" ? tail : all;
      return spec[role] ? play(part, chords, bars, mode) : [];
    });
  };
  return [
    seq(prog, "groove", { lead: "tail", keys: "all", pad: "tail", bass: "all" }),
    seq(prog, "full", { lead: "all", keys: "all", pad: "all", bass: "all" }),
    seq(progB, "break", { lead: "all", keys: "all", pad: "all", bass: "all" }),
  ];
}

// ------------------------------------------------------------------ the library
const P = (synth, preset, volume, pattern, extra = {}) => ({ synth, preset, volume, pattern, ...extra });

export const SONGS = [
  {
    id: "deep-house",
    name: "Deep House Sunrise",
    genre: "Deep House",
    blurb: "Warm Rhodes stabs over a shuffling kick, kalimba melody.",
    beat: "drums-analog-deep-house-shuffle",
    key: "A", mode: "minor",
    prog: [[0, 4], [3, 4], [6, 3], [2, 4]],
    parts: {
      lead: P("pluck", "Kalimba", 0.4, "melody", { rhythm: "swingy", range: [69, 88], fx: [["delaySend", 0.3]] }),
      keys: P("tine", "Mellow Rhodes", 0.32, "housePiano", { role: "keys", center: 64, fx: [["reverbSend", 0.2]] }),
      pad: P("lantern", "Silk Air", 0.28, "whole", { role: "pad", center: 60, fx: [["reverbSend", 0.35]] }),
      bass: P("jibass", "Velvet Mono", 0.5, "offbeat", { role: "bass", center: 38 }),
    },
  },
  {
    id: "peak-techno",
    name: "Warehouse Peak Time",
    genre: "Techno",
    blurb: "Acid bass pulse, poly stabs and a resonant sweep lead.",
    beat: "drums-analog-peak-time-techno",
    key: "A", mode: "minor",
    prog: [[0, 3], [0, 3], [5, 3], [6, 3]],
    progB: [[0, 3], [5, 3], [0, 3], [6, 3]],
    parts: {
      lead: P("morph", "Resonant Sweep Lead", 0.34, "melody", { rhythm: "sixteenth", range: [69, 91], fx: [["delaySend", 0.35]] }),
      keys: P("ensemble", "Jump Poly Stab", 0.3, "rave", { role: "keys", center: 62, fx: [["reverbSend", 0.25]] }),
      pad: P("texture", "Dark Drone", 0.3, "whole", { role: "pad", center: 52 }),
      bass: P("jibass", "Acid Squelch", 0.45, "pulse16", { role: "bass", center: 33 }),
    },
  },
  {
    id: "lofi-rain",
    name: "Rainy Window",
    genre: "Lo-Fi",
    blurb: "Dusty tines, tape moon pad, vibes melody. Slow and warm.",
    beat: "drums-analog-lofi-rainy-window",
    key: "D", mode: "dorian",
    prog: [[0, 4], [3, 4], [2, 4], [6, 4]],
    parts: {
      lead: P("modal", "Soft Vibes", 0.4, "melody", { rhythm: "sparse", range: [67, 86], fx: [["delaySend", 0.35], ["reverbSend", 0.2]] }),
      keys: P("tine", "Lo-fi Reed Trem", 0.34, "loFi", { role: "keys", center: 62, fx: [["reverbSend", 0.2]] }),
      pad: P("lantern", "Tape Moon", 0.25, "whole", { role: "pad", center: 58, fx: [["reverbSend", 0.4]] }),
      bass: P("pluck", "Upright Bass", 0.5, "half", { role: "bass", center: 38 }),
    },
  },
  {
    id: "boom-bap",
    name: "Boom Bap Dusk",
    genre: "Hip-Hop",
    blurb: "Upright piano chops, tape strings and a soulful hook.",
    beat: "drums-analog-boom-bap",
    key: "D", mode: "minor",
    prog: [[0, 4], [5, 3], [3, 4], [4, 4, "harm"]],
    parts: {
      lead: P("vox", "Soul Oh", 0.38, "melody", { rhythm: "swingy", range: [62, 79], fx: [["reverbSend", 0.3]] }),
      keys: P("tine", "Upright Piano", 0.34, "charleston", { role: "keys", center: 60, fx: [["reverbSend", 0.15]] }),
      pad: P("ensemble", "Tape Strings", 0.26, "whole", { role: "pad", center: 58, fx: [["reverbSend", 0.3]] }),
      bass: P("jibass", "Muted Thumb", 0.5, "hiphop", { role: "bass", center: 36 }),
    },
  },
  {
    id: "trap",
    name: "Trap Halftime",
    genre: "Trap",
    blurb: "808 boom, plucked arps and a music-box hook.",
    beat: "drums-analog-trap-hat-rolls",
    key: "F#", mode: "minor",
    prog: [[0, 3], [5, 3], [2, 3], [6, 3]],
    parts: {
      lead: P("fm4", "Music Box", 0.34, "melody", { rhythm: "hook", range: [73, 93], fx: [["delaySend", 0.3], ["reverbSend", 0.2]] }),
      keys: P("pluck", "Dream Pluck", 0.3, "arp8", { role: "keys", center: 66, fx: [["reverbSend", 0.25]] }),
      pad: P("vox", "Hush Pad", 0.26, "whole", { role: "pad", center: 58, fx: [["reverbSend", 0.4]] }),
      bass: P("jibass", "808 Boom", 0.55, "trap808", { role: "bass", center: 30 }),
    },
  },
  {
    id: "disco",
    name: "Saturday Night Disco",
    genre: "Disco",
    blurb: "Octave bass, funky tines, strings and a sax lead.",
    beat: "drums-analog-disco-four",
    key: "D", mode: "dorian",
    prog: [[0, 4], [3, 4], [6, 4], [2, 4]],
    parts: {
      lead: P("winds", "Alto Sax", 0.38, "melody", { rhythm: "swingy", range: [62, 84], fx: [["reverbSend", 0.2]] }),
      keys: P("tine", "Funk Stab EP", 0.32, "funkClav", { role: "keys", center: 62, fx: [["reverbSend", 0.15]] }),
      pad: P("ensemble", "Disco Strings", 0.28, "half", { role: "pad", center: 64, fx: [["reverbSend", 0.3]] }),
      bass: P("jibass", "Disco Pluck", 0.5, "disco", { role: "bass", center: 38 }),
    },
  },
  {
    id: "dub",
    name: "Roots and Echo",
    genre: "Reggae / Dub",
    blurb: "One-drop skank, deep dub bass, echoing recorder.",
    beat: "drums-analog-reggae-one-drop",
    key: "G", mode: "minor",
    prog: [[0, 3], [0, 3], [3, 3], [4, 3]],
    parts: {
      lead: P("winds", "Recorder", 0.34, "melody", { rhythm: "sparse", range: [67, 86], fx: [["delaySend", 0.5], ["reverbSend", 0.2]] }),
      keys: P("tonewheel", "Reggae Bubble", 0.32, "stabsOff", { role: "keys", center: 62, fx: [["delaySend", 0.3]] }),
      pad: P("lantern", "Night Fog", 0.22, "whole", { role: "pad", center: 55, fx: [["reverbSend", 0.4]] }),
      bass: P("jibass", "Deep Dub", 0.55, "dub", { role: "bass", center: 31 }),
    },
  },
  {
    id: "jungle",
    name: "Jungle Roller",
    genre: "Jungle",
    blurb: "170 bpm breaks, rolling reese bass and ringing bells.",
    beat: "drums-analog-jungle-rollers",
    key: "E", mode: "minor",
    prog: [[0, 3], [5, 3], [2, 3], [6, 3]],
    parts: {
      lead: P("fm4", "Bell Pad", 0.32, "melody", { rhythm: "sparse", range: [71, 91], fx: [["delaySend", 0.35], ["reverbSend", 0.25]] }),
      keys: P("tine", "Soft Ballad EP", 0.3, "half", { role: "keys", center: 62, fx: [["reverbSend", 0.25]] }),
      pad: P("ensemble", "Dark Strings", 0.27, "whole", { role: "pad", center: 55, fx: [["reverbSend", 0.3]] }),
      bass: P("jibass", "Classic Reese", 0.5, "reese", { role: "bass", center: 28 }),
    },
  },
  {
    id: "afrobeat",
    name: "Lagos Late Night",
    genre: "Afrobeat",
    blurb: "Scratchy guitar, horn hits, finger bass and a sax lead.",
    beat: "drums-analog-afro-fela-drive",
    key: "E", mode: "dorian",
    prog: [[0, 4], [3, 4], [0, 4], [3, 4]],
    parts: {
      lead: P("winds", "Tenor Sax Growl", 0.36, "melody", { rhythm: "swingy", range: [60, 82], fx: [["reverbSend", 0.2]] }),
      keys: P("pluck", "Funk Scratch", 0.32, "skank16", { role: "keys", center: 64, fx: [["reverbSend", 0.12]] }),
      pad: P("winds", "Funk Hits", 0.3, "hornHits", { role: "pad", center: 62, fx: [["reverbSend", 0.2]] }),
      bass: P("jibass", "Finger Bass", 0.5, "funk", { role: "bass", center: 40 }),
    },
  },
  {
    id: "bossa",
    name: "Bossa Afternoon",
    genre: "Bossa Nova",
    blurb: "Nylon guitar comping, upright bass and a flute melody.",
    beat: "drums-analog-bossa-nova-clave",
    key: "A", mode: "minor",
    prog: [[0, 4], [3, 4], [6, 4], [2, 4]],
    parts: {
      lead: P("winds", "Concert Flute", 0.38, "melody", { rhythm: "swingy", range: [69, 91], fx: [["reverbSend", 0.3]] }),
      keys: P("pluck", "Nylon Guitar", 0.34, "bossa", { role: "keys", center: 62, fx: [["reverbSend", 0.2]] }),
      pad: P("ensemble", "Soft Felt Pad", 0.22, "whole", { role: "pad", center: 58, fx: [["reverbSend", 0.35]] }),
      bass: P("pluck", "Upright Bass", 0.5, "bossa", { role: "bass", center: 36 }),
    },
  },
  {
    id: "jazz",
    name: "Midnight Swing",
    genre: "Jazz",
    blurb: "Walking bass, grand piano comping and a muted trumpet.",
    beat: "drums-analog-jazz-swing-ride",
    key: "F", mode: "major",
    prog: [[1, 4], [4, 4], [0, 4], [5, 4]],
    parts: {
      lead: P("winds", "Muted Trumpet", 0.38, "melody", { rhythm: "swingy", range: [65, 86], fx: [["reverbSend", 0.25]] }),
      keys: P("tine", "Concert Grand", 0.34, "jazzComp", { role: "keys", center: 60, fx: [["reverbSend", 0.2]] }),
      pad: P("ensemble", "Soft Felt Pad", 0.2, "whole", { role: "pad", center: 57, fx: [["reverbSend", 0.3]] }),
      bass: P("pluck", "Upright Bass", 0.52, "walk", { role: "bass", center: 38 }),
    },
  },
  {
    id: "reggaeton",
    name: "Perreo Nights",
    genre: "Reggaeton",
    blurb: "Tresillo 808s, steel pan hook and a nylon-string groove.",
    beat: "drums-analog-reggaeton-perreo",
    key: "D", mode: "minor",
    prog: [[0, 3], [5, 3], [2, 3], [6, 3]],
    parts: {
      lead: P("fm4", "Steel Pan", 0.36, "melody", { rhythm: "tresillo", range: [69, 88], fx: [["delaySend", 0.25], ["reverbSend", 0.2]] }),
      keys: P("pluck", "Nylon Guitar", 0.32, "tresillo", { role: "keys", center: 62, fx: [["reverbSend", 0.15]] }),
      pad: P("vox", "Ooo Pad", 0.24, "whole", { role: "pad", center: 58, fx: [["reverbSend", 0.35]] }),
      bass: P("jibass", "808 Boom", 0.55, "tresillo", { role: "bass", center: 34 }),
    },
  },
  {
    id: "amapiano",
    name: "Piano and Log Drum",
    genre: "Amapiano",
    blurb: "Soft EP chords, log drum bass and a kalimba lead.",
    beat: "drums-analog-amapiano-log-shaker",
    key: "A", mode: "minor",
    prog: [[0, 4, "minor", 9], [3, 4, "minor", 9], [0, 4, "minor", 9], [4, 4]],
    parts: {
      lead: P("fm4", "Kalimba Tine", 0.36, "melody", { rhythm: "hook", range: [69, 91], fx: [["delaySend", 0.3], ["reverbSend", 0.2]] }),
      keys: P("tine", "Soft Ballad EP", 0.34, "amapiano", { role: "keys", center: 62, fx: [["reverbSend", 0.2]] }),
      pad: P("vox", "Warm Oh Pad", 0.26, "whole", { role: "pad", center: 57, fx: [["reverbSend", 0.4]] }),
      bass: P("modal", "Log Drum", 0.5, "logdrum", { role: "bass", center: 40 }),
    },
  },
  {
    id: "dubstep",
    name: "Half-Step Wobble",
    genre: "Dubstep",
    blurb: "Wobbling bass, dark drone and a vowel lead.",
    beat: "drums-analog-deep-dubstep",
    key: "F", mode: "minor",
    prog: [[0, 3], [0, 3], [5, 3], [6, 3]],
    parts: {
      lead: P("morph", "Vowel Lead", 0.34, "melody", { rhythm: "sparse", range: [65, 86], fx: [["delaySend", 0.4], ["reverbSend", 0.25]] }),
      keys: P("fm4", "Bell Pad", 0.28, "half", { role: "keys", center: 65, fx: [["reverbSend", 0.3]] }),
      pad: P("texture", "Dark Drone", 0.3, "whole", { role: "pad", center: 50 }),
      bass: P("morph", "Wobble Bass", 0.5, "wub", { role: "bass", center: 29 }),
    },
  },
  {
    id: "rock",
    name: "Highway Anthem",
    genre: "Rock",
    blurb: "Driving 8ths, power chords and a clean guitar hook.",
    beat: "drums-analog-rock-driving-8ths",
    key: "E", mode: "minor",
    prog: [[0, "power"], [5, "power"], [2, "power"], [6, "power"]],
    parts: {
      lead: P("pluck", "Clean Electric", 0.38, "melody", { rhythm: "hook", range: [64, 86], fx: [["delaySend", 0.25], ["reverbSend", 0.2]] }),
      keys: P("tonewheel", "Rock Overdrive", 0.3, "rockPower", { role: "keys", center: 52, fx: [["reverbSend", 0.15]] }),
      pad: P("tonewheel", "Prog Wall 88 8800", 0.22, "whole", { role: "pad", center: 55, fx: [["reverbSend", 0.3]] }),
      bass: P("jibass", "Overdriven Pick", 0.5, "rock8", { role: "bass", center: 40 }),
    },
  },
  {
    id: "synthpop",
    name: "Neon Drive",
    genre: "Synth-Pop",
    blurb: "Juno pads, saw bass pulse and a bright lead. 80s dashboard.",
    beat: "drums-analog-pop-synth-drive",
    key: "A", mode: "minor",
    prog: [[0, 3], [5, 3], [2, 3], [6, 3]],
    parts: {
      lead: P("jims10", "Init Saw Lead", 0.34, "melody", { rhythm: "hook", range: [69, 91], fx: [["delaySend", 0.3], ["reverbSend", 0.2]] }),
      keys: P("ensemble", "80s Pulse Pad", 0.28, "arp8", { role: "keys", center: 64, fx: [["delaySend", 0.2]] }),
      pad: P("ensemble", "Juno Pad", 0.26, "whole", { role: "pad", center: 57, fx: [["reverbSend", 0.3]] }),
      bass: P("jibass", "Synthwave Saw", 0.48, "pulse8", { role: "bass", center: 33 }),
    },
  },
  {
    id: "gospel",
    name: "Sunday Shout",
    genre: "Gospel / Soul",
    blurb: "Church organ, grand piano, choir hook and a walking bass.",
    beat: "drums-analog-soul-gospel-shout",
    key: "F", mode: "major",
    prog: [[0, 4], [3, 4], [1, 4], [4, 4]],
    parts: {
      lead: P("vox", "Gospel Oh", 0.36, "melody", { rhythm: "call", range: [65, 84], fx: [["reverbSend", 0.3]] }),
      keys: P("tine", "Concert Grand", 0.34, "gospel", { role: "keys", center: 62, fx: [["reverbSend", 0.2]] }),
      pad: P("tonewheel", "Gospel Full", 0.26, "whole", { role: "pad", center: 58, fx: [["reverbSend", 0.25]] }),
      bass: P("pluck", "Fingered Bass", 0.5, "gospel", { role: "bass", center: 36 }),
    },
  },
  {
    id: "cinematic",
    name: "Heroic Horizon",
    genre: "Cinematic",
    blurb: "Strings, French horns and felt piano over a marching pulse.",
    beat: "drums-analog-orch-heroic-march",
    key: "D", mode: "minor",
    prog: [[0, 3], [5, 3], [2, 3], [6, 3]],
    parts: {
      lead: P("winds", "French Horns", 0.4, "melody", { rhythm: "sparse", range: [60, 79], fx: [["reverbSend", 0.4]] }),
      keys: P("tine", "Felt Piano", 0.3, "ballad", { role: "keys", center: 64, fx: [["reverbSend", 0.35]] }),
      pad: P("winds", "String Ensemble", 0.32, "whole", { role: "pad", center: 57, fx: [["reverbSend", 0.35]] }),
      bass: P("winds", "Double Bass", 0.46, "half", { role: "bass", center: 38 }),
    },
  },
  {
    id: "uk-garage",
    name: "Two-Step Garage",
    genre: "UK Garage",
    blurb: "Bouncy sub bass, piano stabs and a soulful diva lead.",
    beat: "drums-analog-uk-garage-2step",
    key: "F", mode: "minor",
    prog: [[0, 4], [5, 4], [2, 4], [6, 3]],
    parts: {
      lead: P("vox", "Diva Lead", 0.36, "melody", { rhythm: "swingy", range: [68, 88], fx: [["delaySend", 0.25], ["reverbSend", 0.25]] }),
      keys: P("tine", "Studio Pop Piano", 0.32, "housePiano", { role: "keys", center: 62, fx: [["reverbSend", 0.2]] }),
      pad: P("vox", "Dusk Aah", 0.24, "whole", { role: "pad", center: 57, fx: [["reverbSend", 0.35]] }),
      bass: P("jibass", "Wow Bass", 0.5, "garage", { role: "bass", center: 34 }),
    },
  },
];
