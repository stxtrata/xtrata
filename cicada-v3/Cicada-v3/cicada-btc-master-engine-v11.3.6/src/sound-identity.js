// Unified sound identity engine for the cicada.btc master engine.
// Ported from the Solo Abdomen + Group Sound Lab (rhythm genome v3 / extreme v4)
// and made fully deterministic per seed + rarity tier:
//   seed -> acoustic genome (family, motif, rhythm genome, extreme genes, motion rig)
//        -> offline-rendered signature call with an 18-bit audio fingerprint
//        -> abdomen motion track derived from the rendered audio
//        -> decoder that can recover and verify the seed from audio alone.
// The same seed always produces the same call, the same fingerprint bits,
// and the same motion track. Rarity tier shapes how natural or extreme the
// voice is allowed to become: common seeds stay grounded and naturalistic,
// higher tiers unlock melodic / robotic extreme chirp genes.

export const SOUND_SR = 44100;
export const ID_BITS = 14;
export const CHECK_BITS = 4;
export const TOTAL_BITS = ID_BITS + CHECK_BITS;
export const CELL = 0.145;
export const BIT_OFFSET = 0.58;
export const SYNC_DUR = 0.48;
export const MOTION_FPS = 60;
export const SIGNATURE_DURATION = 6.5;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
const fract = x => x - Math.floor(x);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / Math.max(0.0001, e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const gauss = (t, c, w) => { const x = (t - c) / w; return Math.exp(-0.5 * x * x); };

// Lab PRNG kept verbatim so legacy seeds reproduce their lab-era genomes.
export function labRng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ---------------------------------------------------------------------------
// Fingerprint bit codec (14-bit id + 4-bit checksum)
// ---------------------------------------------------------------------------
function checksum4(code) {
    let x = code ^ (code >>> 4) ^ (code >>> 8) ^ (code >>> 12);
    x ^= (code * 0x9E37) >>> 0;
    x ^= x >>> 7;
    return x & 15;
}

export function bitsForSeed(seed) {
    const code = clamp(Math.round(seed), 1, 16384) - 1;
    const bits = [];
    for (let i = ID_BITS - 1; i >= 0; i--) bits.push((code >>> i) & 1);
    const c = checksum4(code);
    for (let i = CHECK_BITS - 1; i >= 0; i--) bits.push((c >>> i) & 1);
    return bits;
}

export function seedFromBits(bits) {
    let code = 0;
    for (let i = 0; i < ID_BITS; i++) code = (code << 1) | bits[i];
    let got = 0;
    for (let i = ID_BITS; i < TOTAL_BITS; i++) got = (got << 1) | bits[i];
    const exp = checksum4(code);
    return { seed: code + 1, got, exp, ok: got === exp };
}

// ---------------------------------------------------------------------------
// Genome tables (preserved from the sound lab)
// ---------------------------------------------------------------------------
export const SOUND_FAMILIES = Object.freeze([
    ['Needle Drone Male', 6400, 178, 7000, 0.20, 'steady drone with tiny rhythmic catches'],
    ['Dry Bark Rattler', 7350, 265, 7900, 0.48, 'papery rattle with clipped pauses'],
    ['Soft Evening Caller', 4300, 118, 5050, 0.12, 'rounded swells and gentle returns'],
    ['Fast Tymbal Chatterer', 8050, 330, 8700, 0.38, 'quick catch-and-release chatter'],
    ['Heavy Abdomen Resonator', 5200, 150, 5850, 0.18, 'thicker body tone with slow phrases'],
    ['Thin Canopy Singer', 9100, 220, 9400, 0.24, 'high shimmering canopy buzz'],
    ['Nervous Fence Caller', 6900, 245, 7350, 0.34, 'jittery pulses with short breath gaps'],
    ['Warm Dog-day Solo', 5750, 168, 6250, 0.16, 'classic hot-day cicada drone']
]);
const MOTIFS = Object.freeze([
    'drone / catch / trill / pause / return', 'double catch / long drone / dry final tick',
    'soft swell / three pulse knots / breath', 'fast chatter / collapse / restart',
    'long drone / late accent / short scrape', 'stepped rhythm / held buzz / release',
    'two short phrases / one long return', 'thin trill / pause / thicker body buzz'
]);

const RHYTHM_SHAPES = Object.freeze([
    { id: 'rampHoldRelease', name: 'Ramp-hold-release', short: 'slow build / held body / soft drop' },
    { id: 'catchBurst', name: 'Catch-and-burst', short: 'little catches before full buzz' },
    { id: 'pulseIslands', name: 'Pulse islands', short: 'clusters with breathable gaps' },
    { id: 'doublePump', name: 'Double pump', short: 'two abdomen pushes per phrase' },
    { id: 'lateRattle', name: 'Late dry rattle', short: 'drone body with dry tail' },
    { id: 'nervousRestart', name: 'Nervous restart', short: 'false starts then settles' }
]);

const PULSE_GROUPS = Object.freeze([[2, 2, 3], [3, 3, 2], [4, 1, 4], [5, 3], [1, 1, 2, 1], [2, 1, 3, 2], [3, 2, 1], [4, 2, 2]]);

const EXTREME_MODES = Object.freeze([
    { id: 'melodicLadder', name: 'Melodic ladder chirps', short: 'stepped pitch chirp ladder' },
    { id: 'robotPulse', name: 'Robotic pulse gate', short: 'servo-like chopped calls' },
    { id: 'metallicSweep', name: 'Metallic formant sweep', short: 'harder resonant chirp sweeps' },
    { id: 'bitChatter', name: 'Bit-chatter ticks', short: 'quantised dry click chatter' },
    { id: 'syncTone', name: 'Sync-tone chorus', short: 'locked pitched chirp bursts' }
]);
const EXTREME_SCALES = Object.freeze([
    [1, 1.059, 1.122, 1.260, 1.335, 1.498], [1, 0.944, 1.122, 1.189, 1.414],
    [1, 1.125, 1.25, 1.5, 2], [1, 0.875, 1, 1.333, 1.667], [1, 1.071, 1.2, 1.286, 1.6]
]);

// ---------------------------------------------------------------------------
// Rarity policy: how each tier shapes the voice.
// Common voices stay natural and grounded; rarer voices grow stranger.
// ---------------------------------------------------------------------------
export const TIER_SOUND_POLICY = Object.freeze({
    Mythic:    { nat: 0.52, fp: 0.92, variety: 0.96, extremeChance: 1.00 },
    Legendary: { nat: 0.60, fp: 0.86, variety: 0.88, extremeChance: 1.00 },
    Epic:      { nat: 0.68, fp: 0.80, variety: 0.78, extremeChance: 0.85 },
    Rare:      { nat: 0.76, fp: 0.74, variety: 0.62, extremeChance: 0.35 },
    Uncommon:  { nat: 0.84, fp: 0.70, variety: 0.48, extremeChance: 0.00 },
    Common:    { nat: 0.90, fp: 0.66, variety: 0.36, extremeChance: 0.00 }
});

function extremeGenome(seed, on, v) {
    if (!on) return { enabled: false, modeName: 'Natural contained', modeShort: 'natural insect lock' };
    const r = labRng((seed ^ 0xE57E3A11) >>> 0);
    const mode = EXTREME_MODES[Math.floor(r() * EXTREME_MODES.length)];
    const scale = EXTREME_SCALES[Math.floor(r() * EXTREME_SCALES.length)].slice();
    return {
        enabled: true, modeId: mode.id, modeName: mode.name, modeShort: mode.short, scale, phase: r(),
        melodic: mix(0.34, 0.92, r()) * (0.65 + v * 0.45),
        robotic: mix(0.22, 0.88, r()) * (0.60 + v * 0.55),
        stepRate: mix(3.2, 13.5, r()) * (0.75 + v * 0.75),
        robotRate: mix(5.5, 18, r()),
        chirpRate: mix(2.1, 9.5, r()) * (0.8 + v * 0.9),
        chirpGain: mix(0.05, 0.22, r()) * (0.65 + v * 0.8),
        fmDepth: mix(0.006, 0.046, r()) * (0.65 + v * 0.8),
        gateDepth: mix(0.08, 0.42, r()),
        bitDepth: Math.floor(mix(10, 34, r())),
        harmRatio: [1.5, 2, 2.5, 3, 4][Math.floor(r() * 5)],
        resBoost: mix(0.005, 0.035, r())
    };
}

export function extremeStepRatio(t, eg, index = 0) {
    if (!eg || !eg.enabled) return 1;
    const scale = eg.scale || [1];
    const si = ((Math.floor(t * eg.stepRate + eg.phase * scale.length + index) % scale.length) + scale.length) % scale.length;
    let ratio = scale[si];
    if (eg.modeId === 'metallicSweep') ratio *= 1 + Math.sin(6.283 * (t * eg.chirpRate * 0.23 + eg.phase)) * eg.fmDepth * 7;
    if (eg.modeId === 'bitChatter') ratio = Math.round(ratio * 12) / 12;
    return ratio;
}

export function extremeGate(t, eg, index = 0) {
    if (!eg || !eg.enabled) return 1;
    const raw = 0.5 + 0.5 * Math.sin(6.283 * (t * eg.robotRate + eg.phase + index * 0.037));
    const gate = smoothstep(0.38, 0.64, raw);
    return mix(1, mix(0.42, 1.34, gate), eg.gateDepth);
}

function rhythmGenome(seed, v) {
    const r = labRng((seed ^ 0x51A7B0D1) >>> 0);
    const shape = RHYTHM_SHAPES[Math.floor(r() * RHYTHM_SHAPES.length)];
    const group = PULSE_GROUPS[Math.floor(r() * PULSE_GROUPS.length)].slice();
    const accent = group.map(() => mix(0.28, 1, r()));
    accent[accent.indexOf(Math.max(...accent))] = 1;
    return {
        shapeId: shape.id, shapeName: shape.name, shapeShort: shape.short,
        group, accent, groupTotal: group.reduce((a, b) => a + b, 0), phase: r(),
        phraseHz: mix(0.16, 0.72, r()) * (0.72 + v * 0.62),
        shapeDepth: mix(0.24, 0.58, r()) * (0.55 + v * 0.7),
        groupDepth: mix(0.10, 0.33, r()) * (0.55 + v * 0.75),
        microTiming: mix(0.001, 0.009, r()) * v,
        resShift: mix(0.002, 0.018, r()) * (0.6 + v * 0.8),
        bodyPump: mix(0.18, 0.56, r()) * (0.65 + v * 0.7),
        tailRattle: mix(0.05, 0.32, r()) * v
    };
}

function rhythmShapeValue(id, p) {
    p = fract(p);
    if (id === 'rampHoldRelease') return smooth(0.02, 0.26, p) * (1 - smooth(0.72, 0.98, p));
    if (id === 'catchBurst') return clamp(0.26 * gauss(p, 0.10, 0.035) + 0.36 * gauss(p, 0.23, 0.045) + smooth(0.34, 0.50, p) * (1 - smooth(0.82, 0.98, p)), 0, 1);
    if (id === 'pulseIslands') return clamp(smooth(0.05, 0.14, p) * (1 - smooth(0.31, 0.42, p)) * 0.92 + smooth(0.50, 0.61, p) * (1 - smooth(0.78, 0.91, p)) * 0.86 + 0.14, 0, 1);
    if (id === 'doublePump') return clamp(0.18 + gauss(p, 0.26, 0.13) * 0.82 + gauss(p, 0.63, 0.15) * 0.72, 0, 1);
    if (id === 'lateRattle') return clamp(0.48 + 0.18 * smooth(0.10, 0.55, p) + 0.34 * smooth(0.58, 0.83, p) * (1 - smooth(0.92, 1, p)), 0, 1);
    if (id === 'nervousRestart') return clamp(0.18 + gauss(p, 0.11, 0.035) * 0.35 + gauss(p, 0.24, 0.045) * 0.45 + smooth(0.38, 0.56, p) * (1 - smooth(0.80, 0.98, p)) * 0.86, 0, 1);
    return 0.75;
}

function rhythmPhrase(t, g) {
    const rg = g.rhythm;
    const warp = t * rg.phraseHz + rg.phase + 0.035 * Math.sin(6.283 * t * 0.071 + rg.phase * 6.283);
    return rhythmShapeValue(rg.shapeId, warp);
}

function groupAccentFromPulse(pulseIndex, pulseFrac, rg) {
    const pos = ((pulseIndex % rg.groupTotal) + rg.groupTotal) % rg.groupTotal;
    let acc = 0.5, local = 0, start = 0;
    for (let i = 0; i < rg.group.length; i++) {
        const len = rg.group[i];
        if (pos < start + len) { acc = rg.accent[i] ?? 0.5; local = pos - start; break; }
        start += len;
    }
    const startKick = local === 0 ? gauss(pulseFrac, 0.10, 0.16) : 0;
    const endLift = (local >= 1 && pulseFrac > 0.72) ? 0.18 : 0;
    return clamp(0.84 + rg.groupDepth * ((acc - 0.5) * 0.55 + startKick * 0.36 + endLift), 0.62, 1.28);
}

function rhythmAccentAt(t, g) {
    const pulse = t * g.pulse + Math.sin(t * 0.9) * g.swing + g.rhythm.phase;
    return groupAccentFromPulse(Math.floor(pulse), fract(pulse), g.rhythm);
}

const motifEnvFns = [
    t => 0.64 + 0.28 * Math.max(0, Math.sin(6.283 * t * 0.82)),
    t => 0.58 + 0.36 * Math.pow(Math.max(0, Math.sin(6.283 * t * 1.16)), 0.55),
    t => 0.42 + 0.48 * smooth(0.05, 0.82, 0.5 + 0.5 * Math.sin(6.283 * t * 0.33)),
    t => 0.38 + 0.52 * Math.pow(Math.max(0, Math.sin(6.283 * t * 2.2)), 0.35),
    t => 0.72 - 0.22 * Math.max(0, Math.sin(6.283 * t * 0.48)),
    t => 0.48 + 0.42 * smooth(0.25, 0.82, Math.abs(Math.sin(6.283 * t * 0.78))),
    t => 0.35 + 0.50 * Math.max(0, Math.sin(6.283 * t * 0.62 + 1.2)),
    t => 0.46 + 0.44 * Math.pow(Math.max(0, Math.sin(6.283 * t * 1.7 + 0.6)), 0.62)
];
const motifEnv = (t, idx) => (motifEnvFns[idx] || motifEnvFns[7])(t);

// ---------------------------------------------------------------------------
// Genome: seed + rarity tier -> complete deterministic acoustic identity
// ---------------------------------------------------------------------------
export function soundGenomeForSeed(seed, tierName = 'Common', overrides = {}) {
    const policy = TIER_SOUND_POLICY[tierName] || TIER_SOUND_POLICY.Common;
    const extremeRoll = labRng((seed ^ 0xBEAC0411) >>> 0)();
    const extremeOn = overrides.extreme ?? (extremeRoll < policy.extremeChance);
    const o = {
        nat: overrides.nat ?? policy.nat,
        fp: overrides.fp ?? policy.fp,
        variety: overrides.variety ?? policy.variety,
        dur: overrides.dur ?? SIGNATURE_DURATION,
        extreme: extremeOn
    };
    const r = labRng((seed * 2654435761) >>> 0);
    const f = SOUND_FAMILIES[Math.floor(r() * SOUND_FAMILIES.length)];
    const v = o.variety;
    const rigR = labRng((seed ^ 0xC1CADADA) >>> 0);
    const motif = MOTIFS[Math.floor(r() * MOTIFS.length)];
    return {
        seed, tier: tierName, family: f[0], phrase: f[5], motif, motifIndex: MOTIFS.indexOf(motif),
        carrier: f[1] * (1 + (r() * 2 - 1) * mix(0.015, 0.055, v)),
        pulse: f[2] * (1 + (r() * 2 - 1) * mix(0.018, 0.09, v)),
        res: f[3] * (1 + (r() * 2 - 1) * mix(0.012, 0.045, v)),
        rasp: clamp(f[4] + (r() * 2 - 1) * 0.14 * v, 0.05, 0.72),
        depth: mix(0.72, 0.96, r() * 0.55 + 0.25),
        swing: mix(0.006, 0.026, r() * v),
        fatigue: mix(0.04, 0.18, r()),
        gap: mix(0.07, 0.32, r() * v),
        chirp: mix(0.22, 0.82, r() * v),
        nat: o.nat, fp: o.fp, variety: v, dur: o.dur, extremeOn,
        rhythm: rhythmGenome(seed, v),
        extreme: extremeGenome(seed, extremeOn, v),
        rig: {
            segments: 7 + Math.floor(rigR() * 4),
            stiffness: mix(0.35, 0.86, rigR()),
            lag: mix(0.025, 0.115, rigR()),
            asymmetry: mix(-0.16, 0.16, rigR()),
            belly: mix(0.82, 1.18, rigR()),
            twitch: mix(0.45, 1.25, rigR()),
            tail: mix(0.55, 1.25, rigR())
        }
    };
}

// Compact descriptor used in traits / metadata exports.
export function soundIdentitySummaryForSeed(seed, tierName = 'Common') {
    const g = soundGenomeForSeed(seed, tierName);
    const stiff = g.rig.stiffness;
    const rigClass = stiff < 0.5 ? 'loose-belly' : stiff < 0.68 ? 'sprung' : 'taut';
    return {
        family: g.family,
        motif: g.motif,
        rhythmShape: g.rhythm.shapeName,
        pulseGroup: g.rhythm.group.join('-'),
        extremeGene: g.extreme.enabled ? g.extreme.modeName : 'Natural contained',
        rig: `${g.rig.segments}-seg ${rigClass}`,
        carrierHz: Math.round(g.carrier),
        pulseHz: Math.round(g.pulse)
    };
}

// ---------------------------------------------------------------------------
// Offline render: deterministic fingerprinted signature call
// ---------------------------------------------------------------------------
export function renderSignatureCall(seed, tierName = 'Common', overrides = {}) {
    const g = soundGenomeForSeed(seed, tierName, overrides);
    const bits = bitsForSeed(seed);
    const n = Math.floor(SOUND_SR * g.dur);
    const d = new Float32Array(n);
    const r = labRng((seed ^ 0xA17C1DA) >>> 0);
    let phase = 0, resPhase = 0, melPhase = 0, noise = 0;
    const start = 0.82 + (seed % 17) * 0.006;
    const drift = 0.07 + r() * 0.08, dp = r() * 6.283;
    const mi = g.motifIndex;
    let lastAccent = 1;
    const eg = g.extreme;
    for (let i = 0; i < n; i++) {
        const t = i / SOUND_SR;
        const shape = rhythmPhrase(t, g);
        const exRatio = extremeStepRatio(t, eg, 0);
        const exGate = extremeGate(t, eg, 0);
        let td = 1 + Math.sin(6.283 * drift * t + dp) * 0.0018 * g.nat + Math.sin(6.283 * drift * 2.7 * t + dp * 0.7) * 0.0007;
        if (eg.enabled) td *= 1 + Math.sign(Math.sin(6.283 * (t * eg.robotRate + eg.phase))) * eg.robotic * 0.018;
        const pulsePos = t * g.pulse + Math.sin(t * 0.9) * g.swing + g.rhythm.phase + Math.sin(t * 1.7 + dp) * g.rhythm.microTiming;
        const groupAccent = groupAccentFromPulse(Math.floor(pulsePos), fract(pulsePos), g.rhythm);
        lastAccent = lastAccent * 0.985 + groupAccent * 0.015;
        const pitchExtreme = eg.enabled ? mix(1, exRatio, eg.melodic * 0.56) : 1;
        phase += 6.283 * g.carrier * td * pitchExtreme * (1 + (groupAccent - 1) * 0.006 * g.variety) / SOUND_SR;
        const ty = Math.pow(Math.max(0, Math.sin(6.283 * fract(pulsePos))), 9);
        let pa = mix(0.23, 1, clamp(ty * g.depth * groupAccent, 0.02, 1.25));
        if (eg.enabled) pa *= exGate;
        const intro = smooth(0, 0.28, t), outro = 1 - smooth(g.dur - 0.5, g.dur - 0.05, t);
        let phr = clamp(mix(motifEnv(t * (0.82 + g.chirp * 0.85), mi), shape, g.rhythm.shapeDepth), 0, 1.08);
        if (g.rhythm.shapeId === 'lateRattle') phr = clamp(phr + g.rhythm.tailRattle * Math.pow(Math.max(0, Math.sin(6.283 * (t * (3.5 + g.chirp * 4) + 0.17))), 8) * smooth(0.55, 0.86, fract(t * g.rhythm.phraseHz + g.rhythm.phase)), 0, 1.14);
        if (eg.enabled) {
            const chirpWave = Math.pow(Math.max(0, Math.sin(6.283 * (t * eg.chirpRate + eg.phase))), eg.modeId === 'robotPulse' ? 3 : 9);
            const robotChop = extremeGate(t, eg, 1);
            phr = clamp(phr * (1 + chirpWave * eg.chirpGain * 2.1) * mix(1, robotChop, 0.34 * eg.robotic), 0, 1.35);
        }
        const breath = 1 - g.gap * 0.45 * Math.pow(Math.max(0, Math.sin(6.283 * (t * (0.18 + g.gap)) + seed * 0.01)), 8);
        const id = sigAccent(t, bits, start, g.fp);
        const win = smooth(start - 0.10, start + 0.08, t) * (1 - smooth(start + BIT_OFFSET + TOTAL_BITS * CELL + 0.18, start + BIT_OFFSET + TOTAL_BITS * CELL + 0.48, t));
        let amp = (0.16 + 0.52 * phr) * breath;
        amp = mix(amp, Math.max(amp, 0.50 + id * 0.40), win);
        amp *= intro * outro * (1 - g.fatigue * smooth(g.dur * 0.62, g.dur, t));
        const abdomenCompression = clamp(0.20 * phr + 0.38 * ty * groupAccent + 0.18 * Math.max(0, groupAccent - lastAccent) + 0.18 * shape, 0, 1);
        resPhase += 6.283 * g.res * (1 + abdomenCompression * (g.rhythm.resShift + (eg.enabled ? eg.resBoost : 0)) + (groupAccent - 1) * 0.003) / SOUND_SR;
        const chirpEnv = eg.enabled ? Math.pow(Math.max(0, Math.sin(6.283 * (t * eg.chirpRate + eg.phase))), eg.modeId === 'bitChatter' ? 2 : 8) * amp : 0;
        melPhase += 6.283 * g.carrier * (eg.harmRatio || 2) * (eg.enabled ? mix(1, exRatio, eg.melodic * 0.72) : 1) / SOUND_SR;
        let car = Math.sin(phase) * 0.70 + Math.sin(phase * 2.01 + 0.4) * (0.15 + 0.03 * abdomenCompression) + Math.sin(phase * 3.03 + 1.7) * 0.07;
        if (eg.enabled) {
            const tone = Math.sin(melPhase + Math.sin(resPhase * 0.04) * eg.fmDepth * 90) * chirpEnv * eg.chirpGain;
            car += tone * (eg.modeId === 'syncTone' ? 1.7 : 1.15);
            if (eg.modeId === 'bitChatter' || eg.modeId === 'robotPulse') { const q = Math.max(6, eg.bitDepth); car = Math.round(car * q) / q; }
        }
        const body = (Math.sin(resPhase) * 0.16 + Math.sin(resPhase * 0.5 + phase * 0.017) * 0.06) * (0.45 + abdomenCompression * (g.rhythm.bodyPump + (eg.enabled ? eg.chirpGain : 0)));
        const white = r() * 2 - 1;
        noise = noise * 0.72 + white * 0.28;
        const after = smooth(start + 3.35, start + 3.8, t);
        const chirp = Math.pow(Math.max(0, Math.sin(6.283 * (t * (2.5 + g.chirp * 6 + (eg.enabled ? eg.chirpRate * 0.35 : 0)) + seed * 0.003))), 10);
        d[i] = (((car + body) + noise * g.rasp * (eg.enabled ? mix(0.46, 0.74, eg.robotic) : 0.42)) * amp * pa + car * after * chirp * 0.22 * g.variety) * 0.42;
    }
    let peak = 0;
    for (const v of d) peak = Math.max(peak, Math.abs(v));
    const gain = peak ? Math.min(1, 0.86 / peak) : 1;
    for (let i = 0; i < n; i++) d[i] *= gain;
    return { data: d, sr: SOUND_SR, g, bits, start };
}

function sigAccent(t, b, start, fp) {
    let a = 0;
    [0.055, 0.155, 0.275, 0.410].forEach(c => { a += 1.45 * gauss(t, start + c, 0.016); });
    const bs = start + BIT_OFFSET;
    if (t >= bs && t < bs + TOTAL_BITS * CELL) {
        const i = Math.floor((t - bs) / CELL), l = (t - bs) - i * CELL, bit = b[i];
        const early = gauss(l, CELL * 0.30, 0.022), late = gauss(l, CELL * 0.72, 0.022);
        a += 0.35 * (bit ? early : late) + 1.05 * (bit ? late : early);
    }
    return a * fp;
}

// ---------------------------------------------------------------------------
// Motion track: audio-derived abdomen rig animation (deterministic)
// ---------------------------------------------------------------------------
export function analyseMotion(data, sr, g) {
    const frames = Math.floor(data.length / sr * MOTION_FPS);
    const raw = new Float32Array(frames), peak = new Float32Array(frames);
    const win = Math.floor(sr / MOTION_FPS);
    for (let f = 0; f < frames; f++) {
        const s = f * win, e = Math.min(data.length, s + win);
        let sum = 0, mx = 0;
        for (let i = s; i < e; i++) { const a = Math.abs(data[i]); sum += a; mx = Math.max(mx, a); }
        raw[f] = sum / Math.max(1, e - s); peak[f] = mx;
    }
    let max = 0;
    for (const v of raw) max = Math.max(max, v);
    if (max) for (let f = 0; f < frames; f++) { raw[f] /= max; peak[f] /= max; }
    const slow = new Float32Array(frames), motion = [];
    let s = 0, prev = 0;
    const lag = Math.max(1, Math.round(g.rig.lag * MOTION_FPS));
    for (let f = 0; f < frames; f++) { s = s * 0.88 + raw[f] * 0.12; slow[f] = s; }
    for (let f = 0; f < frames; f++) {
        const li = Math.max(0, f - lag);
        const envv = raw[li], phrase = slow[li];
        const trans = Math.max(0, peak[li] - prev);
        prev = peak[li];
        const t = f / MOTION_FPS;
        const pulse = Math.sin(6.283 * (g.pulse * t + g.rhythm.phase));
        const micro = Math.pow(Math.max(0, pulse), 5);
        const accent = rhythmAccentAt(t, g);
        const shape = rhythmPhrase(t, g);
        const compression = clamp(0.16 * phrase + 0.56 * trans * g.rig.twitch + 0.16 * micro * envv * accent + 0.18 * Math.max(0, accent - 1) * envv + 0.10 * shape * envv, 0, 1);
        const inflation = clamp(0.70 * phrase + 0.20 * envv + 0.08 * shape - 0.18 * compression, 0, 1);
        const ripple = clamp(0.22 * envv + 0.60 * micro * envv * accent + 0.18 * Math.max(0, accent - 1) * envv, 0, 1);
        const tilt = (pulse * 0.03 * g.rig.twitch) + (trans * 0.10 * g.rig.asymmetry) + (accent - 1) * 0.035;
        const tail = clamp(trans * g.rig.tail + 0.15 * micro + 0.12 * (shape > 0.72 ? shape - 0.72 : 0), 0, 1);
        motion.push({ t, env: envv, phrase, trans, compression, inflation, ripple, tilt, tail, accent: +accent.toFixed(3) });
    }
    return motion;
}

// ---------------------------------------------------------------------------
// Decoder: recover the seed from rendered audio (fingerprint verification)
// ---------------------------------------------------------------------------
function envelope(data, sr, ms = 4) {
    const bin = Math.max(16, Math.floor(sr * ms / 1000));
    const len = Math.floor(data.length / bin);
    const e = new Float32Array(len);
    let mx = 0;
    for (let i = 0; i < len; i++) {
        let s = 0;
        for (let j = 0; j < bin; j++) s += Math.abs(data[i * bin + j] || 0);
        e[i] = s / bin; mx = Math.max(mx, e[i]);
    }
    if (mx) for (let i = 0; i < len; i++) e[i] /= mx;
    return { e, dt: bin / sr };
}

function avgEnv(E, a, b) {
    const i0 = clamp(Math.floor(a / E.dt), 0, E.e.length - 1);
    const i1 = clamp(Math.ceil(b / E.dt), i0 + 1, E.e.length);
    let s = 0;
    for (let i = i0; i < i1; i++) s += E.e[i];
    return s / (i1 - i0);
}

function syncTemplate(t) {
    let v = 0;
    [0.055, 0.155, 0.275, 0.410].forEach(c => { v += gauss(t, c, 0.020); });
    return v;
}

function findSync(E) {
    const sb = Math.floor(0.45 / E.dt);
    const eb = Math.min(E.e.length - Math.floor(SYNC_DUR / E.dt), Math.floor(2.4 / E.dt));
    const tb = Math.floor(SYNC_DUR / E.dt);
    const T = new Float32Array(tb);
    let ts = 0, tsq = 0;
    for (let j = 0; j < tb; j++) { T[j] = syncTemplate(j * E.dt); ts += T[j]; tsq += T[j] * T[j]; }
    const tm = ts / tb, tv = Math.max(1e-9, tsq - tb * tm * tm);
    let best = { score: -9, time: 0 };
    for (let i = sb; i < eb; i++) {
        let es = 0, esq = 0;
        for (let j = 0; j < tb; j++) { const v = E.e[i + j]; es += v; esq += v * v; }
        const em = es / tb, ev = Math.max(1e-9, esq - tb * em * em);
        let dot = 0;
        for (let j = 0; j < tb; j++) dot += (E.e[i + j] - em) * (T[j] - tm);
        const sc = dot / Math.sqrt(ev * tv);
        if (sc > best.score) best = { score: sc, time: i * E.dt };
    }
    return best;
}

export function decodeAudioFingerprint(data, sr) {
    const E = envelope(data, sr, 4);
    const sync = findSync(E);
    const bs = sync.time + BIT_OFFSET;
    const b = [], m = [];
    for (let i = 0; i < TOTAL_BITS; i++) {
        const st = bs + i * CELL;
        const early = avgEnv(E, st + CELL * 0.18, st + CELL * 0.45);
        const late = avgEnv(E, st + CELL * 0.58, st + CELL * 0.85);
        b.push(late > early ? 1 : 0);
        m.push(Math.abs(late - early) / Math.max(0.0001, early + late));
    }
    const dec = seedFromBits(b);
    const mm = m.reduce((a, c) => a + c, 0) / m.length;
    const conf = clamp(((sync.score - 0.2) / 0.65) * 0.45 + clamp(mm / 0.28, 0, 1) * 0.35 + (dec.ok ? 1 : 0) * 0.2, 0, 1);
    return { ...dec, bits: b, sync, margin: mm, confidence: conf };
}
