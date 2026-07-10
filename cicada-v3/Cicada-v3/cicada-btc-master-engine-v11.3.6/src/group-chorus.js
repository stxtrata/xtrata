// Live group chorus engine for the cicada.btc master engine.
// This is the real forest: a population of distinct synthesized males, not a
// copy of the solo call. Ported from the original Solo + Group Sound Lab and
// made deterministic and DOM-free:
//
//   - Every voice is its own cicada with a seeded personality (pitch, pulse,
//     resonance, drift, pan, gain) sitting in the local bandwidth around the
//     seed's solo genome — they sound related but individual.
//   - Group parameters, pattern, rhythm mode, and the organic switch genes
//     (density waves, rhythm morph, staggered entry, sync bursts, stereo
//     spread, distance blur, drone return) are all derived from the seed.
//   - Six live rhythm modes morph the chorus over time: drone-to-pulse,
//     rhythm islands, call and response, crescendo chatter, sync swarm,
//     and random natural.
//   - Start fades individuals in with staggered swarm entry; stop retires
//     individual males one by one (density fade-out) until the last few
//     trail off — never a master-bus fade.
//   - Independent males are permanently on: separate phrasing per voice is
//     what keeps the chorus natural.
//   - Extreme chirp genes (high-rarity seeds) push the whole population into
//     stepped / robotic territory, exactly as in the lab.
import {
    soundGenomeForSeed,
    labRng,
    extremeStepRatio,
    extremeGate
} from './sound-identity.js?v=11.3.5';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
const fract = x => x - Math.floor(x);
const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / Math.max(0.0001, e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const randRange = (r, a, b) => a + (b - a) * r();

export const RHYTHM_MODES = Object.freeze({
    dronePulse: { name: 'Drone to pulse wave', short: 'classic drone ↔ rhythm' },
    rhythmIslands: { name: 'Rhythm islands', short: 'clusters appear then vanish' },
    callResponse: { name: 'Call and response', short: 'groups answer each other' },
    crescendoChatter: { name: 'Crescendo chatter', short: 'ramp into busy rattle' },
    syncSwarm: { name: 'Sync swarm', short: 'brief group lock' },
    randomNatural: { name: 'Random natural', short: 'messy outdoor movement' },
    // v11.3.5 additions:
    waveRelay: { name: 'Wave relay', short: 'rhythm sweeps across the stereo field' },
    pulseTrain: { name: 'Pulse train', short: 'chorus locks to the seed pulse group' }
});

export const GROUP_PRESETS = Object.freeze({
    summerTree: { name: 'Summer tree', pattern: 'chorus', rhythmMode: 'dronePulse', volume: 0.25, carrier: 5350, pulseRate: 168, pulseDepth: 0.84, resonance: 6100, q: 7.2, roughness: 72, noiseMix: 0.22, voices: 8, spread: 0.74, life: 0.66, phraseRate: 0.34, rhythmMix: 0.58, rhythmCycle: 0.075, rhythmIntensity: 0.58, transitionSmoothness: 0.48, rhythmAgility: 0.68 },
    distantField: { name: 'Distant field', pattern: 'swell', rhythmMode: 'rhythmIslands', volume: 0.30, carrier: 4100, pulseRate: 118, pulseDepth: 0.70, resonance: 4800, q: 4.2, roughness: 55, noiseMix: 0.10, voices: 10, spread: 0.86, life: 0.42, phraseRate: 0.12, rhythmMix: 0.36, rhythmCycle: 0.045, rhythmIntensity: 0.42, transitionSmoothness: 0.62, rhythmAgility: 0.44 },
    hotCanopy: { name: 'Hot canopy', pattern: 'continuous', rhythmMode: 'syncSwarm', volume: 0.22, carrier: 6200, pulseRate: 196, pulseDepth: 0.88, resonance: 7000, q: 8.8, roughness: 94, noiseMix: 0.24, voices: 12, spread: 0.92, life: 0.70, phraseRate: 0.26, rhythmMix: 0.70, rhythmCycle: 0.095, rhythmIntensity: 0.64, transitionSmoothness: 0.38, rhythmAgility: 0.74 },
    sparseEvening: { name: 'Sparse evening', pattern: 'pulsed', rhythmMode: 'callResponse', volume: 0.27, carrier: 4650, pulseRate: 136, pulseDepth: 0.78, resonance: 5400, q: 5.6, roughness: 44, noiseMix: 0.16, voices: 4, spread: 0.65, life: 0.52, phraseRate: 0.48, rhythmMix: 0.75, rhythmCycle: 0.135, rhythmIntensity: 0.72, transitionSmoothness: 0.42, rhythmAgility: 0.78 },
    bigBuild: { name: 'Big build', pattern: 'continuous', rhythmMode: 'crescendoChatter', volume: 0.24, carrier: 5650, pulseRate: 188, pulseDepth: 0.90, resonance: 6500, q: 8.2, roughness: 86, noiseMix: 0.25, voices: 11, spread: 0.88, life: 0.78, phraseRate: 0.42, rhythmMix: 0.82, rhythmCycle: 0.055, rhythmIntensity: 0.86, transitionSmoothness: 0.46, rhythmAgility: 0.82 }
});

// ---------------------------------------------------------------------------
// Seed -> group genes (preserves the lab's applySeedDrivenGroup derivation)
// ---------------------------------------------------------------------------
export function groupGenesForSeed(seed, tierName = 'Common') {
    const g = soundGenomeForSeed(seed, tierName);
    const r = labRng((seed ^ 0x51ABDA) >>> 0);
    const toggleR = labRng((seed ^ 0x6A09E667) >>> 0);
    const extreme = !!g.extreme.enabled;
    // v11.3.5: draw the rhythm mode from the LEGACY key lists so every seed
    // keeps its pre-11.3.5 chorus identity, then a separate seeded roll moves
    // ~22% of seeds onto the two new modes (wave relay / pulse train).
    const rhKeys = extreme
        ? ['syncSwarm', 'randomNatural', 'crescendoChatter', 'rhythmIslands']
        : ['dronePulse', 'rhythmIslands', 'callResponse', 'crescendoChatter', 'syncSwarm', 'randomNatural'];
    const presetKeys = Object.keys(GROUP_PRESETS);
    const presetKey = presetKeys[Math.floor(r() * presetKeys.length)];
    const preset = GROUP_PRESETS[presetKey];
    let rhythmMode = rhKeys[Math.floor(r() * rhKeys.length)];
    const newModeR = labRng((seed ^ 0x11A35E11) >>> 0);
    if (newModeR() < 0.22) rhythmMode = newModeR() < 0.5 ? 'waveRelay' : 'pulseTrain';

    // The whole population lives in the local bandwidth around this seed's
    // solo genome (carrier / pulse / resonance), so the forest sounds like
    // this cicada's neighbours rather than a transposed copy of it.
    const values = {
        volume: extreme ? 0.20 + r() * 0.13 : 0.18 + r() * 0.16,
        carrier: clamp(g.carrier * mix(extreme ? 0.86 : 0.70, extreme ? 1.22 : 0.90, r()), 1800, extreme ? 12500 : 10500),
        pulseRate: clamp(g.pulse * mix(extreme ? 1.02 : 0.70, extreme ? 1.75 : 1.05, r()), 24, extreme ? 720 : 430),
        pulseDepth: clamp(0.62 + g.depth * 0.34 + (extreme ? g.extreme.robotic * 0.10 : 0), 0.1, 0.99),
        resonance: clamp(g.res * mix(extreme ? 0.92 : 0.72, extreme ? 1.34 : 0.96, r()), 1800, extreme ? 12800 : 9800),
        q: clamp(4 + g.rig.stiffness * (extreme ? 16 : 10) + r() * (extreme ? 7 : 3), 0.5, extreme ? 34 : 26),
        roughness: clamp(45 + g.variety * (extreme ? 92 : 55) + r() * (extreme ? 42 : 18) + (extreme ? g.extreme.robotic * 35 : 0), 0, extreme ? 210 : 130),
        noiseMix: clamp(0.08 + g.rasp * (extreme ? 0.58 : 0.36) + (extreme ? g.extreme.chirpGain * 0.7 : 0), 0, extreme ? 0.95 : 0.85),
        voices: extreme ? 5 + Math.floor(r() * 10) : 4 + Math.floor(r() * 9),
        spread: clamp(0.45 + r() * 0.5 + (extreme ? 0.08 : 0), 0, 1),
        life: clamp(0.38 + g.variety * (extreme ? 0.62 : 0.42) + r() * (extreme ? 0.25 : 0.16), 0, 1),
        phraseRate: clamp((0.08 + g.chirp * 0.68 + r() * 0.16) * (extreme ? mix(1.6, 3.8, g.extreme.melodic) : 1), 0.03, extreme ? 12 : 7.5),
        rhythmMix: clamp(0.36 + g.variety * (extreme ? 0.58 : 0.42) + r() * (extreme ? 0.26 : 0.18), 0, 1),
        rhythmCycle: clamp((0.035 + r() * 0.115) * (extreme ? mix(1.25, 2.4, g.extreme.robotic) : 1), 0.015, extreme ? 0.55 : 0.35),
        rhythmAgility: clamp(0.35 + g.variety * (extreme ? 0.75 : 0.52) + (extreme ? g.extreme.robotic * 0.18 : 0), 0, 1),
        rhythmIntensity: clamp(0.35 + g.depth * (extreme ? 0.62 : 0.45) + (extreme ? g.extreme.chirpGain : 0), 0, 1),
        transitionSmoothness: clamp((0.38 + g.nat * 0.32) * (extreme ? 0.72 : 1), 0, 1)
    };

    const toggles = {
        independentTimers: true, // permanently on: separate phrasing keeps the chorus natural
        stereoSpread: values.voices > 1 && (values.spread > 0.38 || toggleR() > 0.18),
        densityWaves: extreme || presetKey === 'distantField' || presetKey === 'bigBuild' || values.rhythmMix > 0.50 || toggleR() > 0.26,
        distanceBlur: presetKey === 'distantField' || toggleR() > 0.55,
        rhythmMorph: rhythmMode !== 'callResponse' && (extreme || values.rhythmMix > 0.42 || toggleR() > 0.22),
        staggeredEntry: values.voices > 3 && (toggleR() > 0.12 || presetKey === 'sparseEvening'),
        droneReturn: toggleR() > 0.45,
        syncBursts: extreme ? toggleR() < 0.62 : (rhythmMode === 'syncSwarm' ? toggleR() < 0.70 : (values.voices > 7 && values.rhythmIntensity > 0.58 && toggleR() < 0.20)),
        // v11.3.5: rare whole-swarm hush — the forest occasionally falls near
        // silent for a breath, then swells back. Drawn last so all previous
        // toggle genes keep their pre-11.3.5 values.
        silenceBreaks: toggleR() < 0.42
    };

    return { seed, tier: tierName, presetKey, presetName: preset.name, pattern: preset.pattern, rhythmMode, values, toggles, extreme: g.extreme, solo: g };
}

// ---------------------------------------------------------------------------
// Voice: one synthesized male with a seeded personality (ported verbatim)
// ---------------------------------------------------------------------------
class Voice {
    constructor(engine, index, total, params) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.index = index;
        this.total = total;
        const seedBase = (((engine.seed || 1) * 0x9E3779B1) ^ ((index + 1) * 0x85EBCA6B) ^ (total * 0xC2B2AE35)) >>> 0;
        this.rand = labRng(seedBase);
        this.noiseRand = labRng((seedBase ^ 0xA17C1DA) >>> 0);
        this.basePhase = randRange(this.rand, 0, 100);
        this.joinOffset = this.rand();
        this.lifePhase = randRange(this.rand, 0, Math.PI * 2);
        this.entryDelay = 38 + Math.floor(this.rand() * 48);
        this.entryFade = 0.34 + this.rand() * 0.24;
        const ex = !!(engine.extreme && engine.extreme.enabled);
        const pitchPersonality = ex ? 0.045 : 0.018;
        const pulsePersonality = ex ? 0.135 : 0.070;
        const resonPersonality = ex ? 0.055 : 0.026;
        this.personality = {
            pitch: Math.pow(2, randRange(this.rand, -pitchPersonality, pitchPersonality) * params.spread),
            pulse: 1 + randRange(this.rand, -pulsePersonality, pulsePersonality) * params.spread,
            reson: 1 + randRange(this.rand, -resonPersonality, resonPersonality) * params.spread,
            drift: randRange(this.rand, 0.38, 1.55),
            drift2: randRange(this.rand, 0.18, 0.82),
            pan: total === 1 ? 0 : randRange(this.rand, -0.88, 0.88) * params.spread,
            gain: randRange(this.rand, 0.76, 1.14)
        };
        this.output = this.ctx.createGain();
        this.output.gain.value = 1 / Math.sqrt(total);
        this.panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        this.phraseGain = this.ctx.createGain();
        this.phraseGain.gain.value = 0;
        this.highpass = this.ctx.createBiquadFilter();
        this.highpass.type = 'highpass';
        this.highpass.frequency.value = 850;
        this.highpass.Q.value = 0.72;
        this.resonator = this.ctx.createBiquadFilter();
        this.resonator.type = 'bandpass';
        this.resonator.frequency.value = params.resonance * this.personality.reson;
        this.resonator.Q.value = params.q;
        this.lowpass = this.ctx.createBiquadFilter();
        this.lowpass.type = 'lowpass';
        this.lowpass.frequency.value = 12000;
        this.lowpass.Q.value = 0.5;
        this.bodyPeak = this.ctx.createBiquadFilter();
        this.bodyPeak.type = 'peaking';
        this.bodyPeak.frequency.value = params.resonance * 0.47;
        this.bodyPeak.Q.value = 1.1;
        this.bodyPeak.gain.value = 4.4;
        this.shaper = this.ctx.createWaveShaper();
        this.shaper.curve = this.makeDistortionCurve(ex ? 64 : 38);
        this.shaper.oversample = '2x';
        this.phraseGain.connect(this.highpass);
        this.highpass.connect(this.resonator);
        this.resonator.connect(this.bodyPeak);
        this.bodyPeak.connect(this.lowpass);
        this.lowpass.connect(this.shaper);
        if (this.panner) {
            this.panner.pan.value = this.personality.pan;
            this.shaper.connect(this.panner);
            this.panner.connect(this.output);
        } else {
            this.shaper.connect(this.output);
        }
        this.presenceGain = this.ctx.createGain();
        this.presenceGain.gain.value = 0;
        this.output.connect(this.presenceGain);
        this.presenceGain.connect(engine.bus);
        this.pulseGain = this.ctx.createGain();
        this.pulseGain.gain.value = 0.1;
        this.pulseGain.connect(this.phraseGain);
        this.pulse = this.ctx.createOscillator();
        this.pulse.type = 'square';
        this.pulse.frequency.value = params.pulseRate * this.personality.pulse;
        this.pulseScale = this.ctx.createGain();
        this.pulseOffset = this.ctx.createConstantSource();
        this.pulse.connect(this.pulseScale);
        this.pulseScale.connect(this.pulseGain.gain);
        this.pulseOffset.connect(this.pulseGain.gain);
        this.oscs = [];
        const defs = [
            { type: 'sawtooth', gain: 0.070, ratio: 1.000, detune: -0.65 },
            { type: 'square', gain: 0.038, ratio: 1.006, detune: 0.42 },
            { type: 'triangle', gain: 0.050, ratio: 0.502, detune: -0.12 },
            { type: 'sawtooth', gain: 0.024, ratio: 1.985, detune: 0.24 }
        ];
        for (const def of defs) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = def.type;
            osc.frequency.value = params.carrier * def.ratio * this.personality.pitch;
            osc.detune.value = params.roughness * def.detune;
            gain.gain.value = def.gain / Math.sqrt(total);
            osc.connect(gain);
            gain.connect(this.pulseGain);
            osc.start();
            this.oscs.push({ osc, gain, def });
        }
        this.noise = this.ctx.createBufferSource();
        this.noise.buffer = this.makeNoiseBuffer(2);
        this.noise.loop = true;
        this.noiseBand = this.ctx.createBiquadFilter();
        this.noiseBand.type = 'bandpass';
        this.noiseBand.frequency.value = params.resonance * 1.03;
        this.noiseBand.Q.value = 5.4;
        this.noiseGain = this.ctx.createGain();
        this.noiseGain.gain.value = params.noiseMix * 0.18 / Math.sqrt(total);
        this.noise.connect(this.noiseBand);
        this.noiseBand.connect(this.noiseGain);
        this.noiseGain.connect(this.pulseGain);
        this.pulseOffset.start();
        this.pulse.start();
        this.noise.start();
        this.setPulseDepth(params.pulseDepth);
    }

    setPulseDepth(depth) {
        const t = this.ctx.currentTime;
        const peak = 0.92;
        const floor = clamp(peak * (1 - depth), 0.004, 0.55);
        const mid = (peak + floor) / 2;
        const amount = (peak - floor) / 2;
        this.pulseScale.gain.setTargetAtTime(amount, t, 0.018);
        this.pulseOffset.offset.setTargetAtTime(mid, t, 0.018);
    }

    basePhrase(pattern, elapsed, params, toggles) {
        const phase = toggles.independentTimers === false ? 0 : this.basePhase;
        const x = (elapsed + phase) * params.phraseRate;
        const s = Math.sin(Math.PI * 2 * x);
        const slow = 0.5 + 0.5 * Math.sin(Math.PI * 2 * ((elapsed + phase * 0.37) * 0.073));
        const lifeNoise = (Math.sin((elapsed + this.basePhase) * 1.37 + this.lifePhase) * 0.055 + Math.sin((elapsed + this.basePhase) * 3.11 + this.lifePhase * 0.47) * 0.025) * params.life;
        if (!toggles.densityWaves) return 0.86;
        if (pattern === 'continuous') return clamp(0.78 + 0.13 * slow + lifeNoise, 0, 1);
        if (pattern === 'swell') {
            const swell = 0.5 + 0.5 * Math.sin(Math.PI * 2 * x - Math.PI / 2);
            return clamp(0.18 + Math.pow(swell, 1.8) * 0.86 + lifeNoise, 0, 1);
        }
        if (pattern === 'pulsed') {
            const gate = Math.max(0, s);
            return clamp(0.08 + Math.pow(gate, 0.42) * 0.92 + lifeNoise, 0, 1);
        }
        if (pattern === 'chorus') {
            const individual = 0.62 + 0.38 * Math.sin(Math.PI * 2 * x + this.index * 1.7);
            const communal = 0.72 + 0.20 * slow;
            return clamp(individual * communal + lifeNoise, 0, 1);
        }
        return 0.85;
    }

    groupRhythmPhrase(elapsed, params, toggles) {
        const phase = toggles.independentTimers ? this.basePhase : 0;
        const local = elapsed + phase;
        const rhythmMode = this.engine.rhythmMode;
        const agility = params.rhythmAgility || 0;
        const cycleSpeed = params.rhythmCycle * (1 + agility * 3.25);
        const slowA = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * cycleSpeed + this.index * 0.013));
        const glideWidth = mix(0.075, 0.42, params.transitionSmoothness);
        const macro = toggles.rhythmMorph ? smoothstep(0.5 - glideWidth, 0.5 + glideWidth, slowA) : 1;
        const droneFloor = toggles.droneReturn ? 0.54 : 0.25;
        const drone = droneFloor + (0.92 - droneFloor) * (0.72 + 0.28 * Math.sin(Math.PI * 2 * (elapsed * 0.035 + this.index * 0.11)));
        const intensity = params.rhythmIntensity;
        const stagger = toggles.staggeredEntry ? smoothstep(this.joinOffset * 0.75, this.joinOffset * 0.75 + 0.25, slowA) : 1;
        const commonPulse = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * params.phraseRate * 2.2));
        const localPulse = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (local * params.phraseRate * (1.4 + intensity * 2.6)));
        const hardLocal = smoothstep(0.42 - intensity * 0.25, 0.82 - intensity * 0.10, localPulse);
        const hardCommon = smoothstep(0.48 - intensity * 0.24, 0.86 - intensity * 0.10, commonPulse);
        let rhythmic = hardLocal;
        if (rhythmMode === 'dronePulse') rhythmic = 0.36 + 0.64 * hardLocal;
        if (rhythmMode === 'rhythmIslands') {
            const island = smoothstep(0.30, 0.92, 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * cycleSpeed * 0.72 + this.index * 0.067)));
            const chatter = smoothstep(0.40, 0.84, 0.5 + 0.5 * Math.sin(Math.PI * 2 * (local * params.phraseRate * (2.3 + intensity * 4.8))));
            rhythmic = 0.28 + 0.72 * island * chatter;
        }
        if (rhythmMode === 'callResponse') {
            const side = this.index % 2 === 0 ? 0 : 0.5;
            const answer = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * cycleSpeed * 1.9 + side));
            const gate = smoothstep(0.30, 0.74, answer);
            rhythmic = 0.20 + 0.80 * gate * hardLocal;
        }
        if (rhythmMode === 'crescendoChatter') {
            const pos = fract(elapsed * cycleSpeed + this.joinOffset * 0.05);
            const build = pos < 0.72 ? smoothstep(0.08, 0.72, pos) : 1 - smoothstep(0.72, 1, pos);
            const chatterRate = 2.2 + build * 7.2 * intensity;
            const chatter = smoothstep(0.35, 0.88, 0.5 + 0.5 * Math.sin(Math.PI * 2 * (local * params.phraseRate * chatterRate)));
            rhythmic = 0.22 + 0.78 * build * chatter;
        }
        if (rhythmMode === 'syncSwarm') {
            const syncWindow = toggles.syncBursts ? smoothstep(0.70, 0.98, slowA) : smoothstep(0.82, 0.99, slowA) * 0.55;
            rhythmic = mix(hardLocal, hardCommon, syncWindow);
        }
        if (rhythmMode === 'waveRelay') {
            // A rhythmic wave travels across the stereo field: voices panned
            // left fire first, the wave rolls right, then returns.
            const pos = (this.personality.pan + 1) / 2;
            const sweep = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * cycleSpeed * 1.35 - pos * 1.2));
            const front = smoothstep(0.52, 0.90, sweep);
            rhythmic = 0.16 + 0.84 * front * (0.4 + 0.6 * hardLocal);
        }
        if (rhythmMode === 'pulseTrain') {
            // The whole chorus locks to the seed's pulse group counts, with a
            // slowly drifting phase per voice so the lock breathes.
            const rg = this.engine.genes?.solo?.rhythm;
            const groupTotal = rg?.groupTotal || 7;
            const beat = elapsed * params.phraseRate * (2.0 + intensity * 2.4) + this.basePhase * 0.07;
            const posInPattern = ((Math.floor(beat) % groupTotal) + groupTotal) % groupTotal;
            let inGroupStart = 0, groupIdx = 0, cursor = 0;
            const groups = rg?.group || [2, 2, 3];
            for (let gi = 0; gi < groups.length; gi++) {
                if (posInPattern < cursor + groups[gi]) { groupIdx = gi; inGroupStart = cursor; break; }
                cursor += groups[gi];
            }
            const accent = (rg?.accent?.[groupIdx] ?? 0.6);
            const firstOfGroup = posInPattern === inGroupStart ? 1 : 0;
            const tick = smoothstep(0.15, 0.55, fract(beat)) * (1 - smoothstep(0.72, 0.95, fract(beat)));
            rhythmic = 0.20 + 0.80 * tick * (0.42 + accent * 0.42 + firstOfGroup * 0.16);
        }
        if (rhythmMode === 'randomNatural') {
            const a = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * cycleSpeed * 0.61 + this.index * 0.031));
            const b = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (elapsed * cycleSpeed * 1.37 + this.basePhase * 0.011));
            const c = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (local * params.phraseRate * (1.8 + b * 4.2)));
            const messyGate = smoothstep(0.25, 0.88, a * 0.55 + b * 0.45);
            rhythmic = 0.22 + 0.78 * messyGate * smoothstep(0.33, 0.84, c);
        }
        rhythmic = mix(0.45, rhythmic, intensity) * stagger;
        const rhythmAmount = params.rhythmMix * macro;
        return clamp(mix(drone, rhythmic, rhythmAmount), 0, 1);
    }

    // v11.3.5: accent from the seed's solo pulse group (e.g. 2-2-3), so the
    // chorus carries the same rhythmic DNA as the signature call. Each voice
    // reads the pattern slightly offset, keeping it organic rather than locked.
    pulseGroupAccent(elapsed, params) {
        const rg = this.engine.genes?.solo?.rhythm;
        if (!rg || !rg.group || !rg.group.length) return 1;
        const beat = elapsed * params.phraseRate * 2.4 + this.basePhase * 0.13;
        const pos = ((Math.floor(beat) % rg.groupTotal) + rg.groupTotal) % rg.groupTotal;
        let acc = 0.5, start = 0;
        for (let i = 0; i < rg.group.length; i++) {
            const len = rg.group[i];
            if (pos < start + len) { acc = rg.accent[i] ?? 0.5; break; }
            start += len;
        }
        return mix(1, 0.72 + acc * 0.52, rg.groupDepth * 1.6);
    }

    phrase(pattern, elapsed, params, toggles) {
        const base = this.basePhrase(pattern, elapsed, params, toggles);
        const rhythm = this.groupRhythmPhrase(elapsed, params, toggles);
        return clamp(mix(base, rhythm, params.rhythmMix) * this.pulseGroupAccent(elapsed, params), 0, 1);
    }

    update(params, elapsed, pattern, toggles, total) {
        const t = this.ctx.currentTime;
        const life = params.life;
        const ex = this.engine.extreme || { enabled: false };
        const exRatio = extremeStepRatio(elapsed, ex, this.index);
        const exGate = extremeGate(elapsed, ex, this.index);
        const pitchJitter = (Math.sin((elapsed + this.basePhase) * 7.7 + this.lifePhase * 0.31) + Math.sin((elapsed + this.basePhase) * 11.3 + this.lifePhase) * 0.5) * 0.0018 * life * (ex.enabled ? 0.85 : 0.28);
        const pitchDrift = Math.sin((elapsed + this.basePhase) * this.personality.drift) * 0.008 * life * (ex.enabled ? 0.72 : 0.28)
            + Math.sin((elapsed + this.basePhase) * this.personality.drift2 * 2.1) * 0.004 * life * (ex.enabled ? 0.72 : 0.28)
            + pitchJitter;
        const extremePitch = ex.enabled ? mix(1, exRatio, ex.melodic * 0.42) : 1;
        const pitchFactor = this.personality.pitch * (1 + pitchDrift) * extremePitch;
        for (const item of this.oscs) {
            item.osc.frequency.setTargetAtTime(params.carrier * item.def.ratio * pitchFactor, t, ex.enabled ? 0.032 : 0.055);
            item.osc.detune.setTargetAtTime(params.roughness * item.def.detune * (ex.enabled ? 1.24 : 1), t, 0.055);
            item.gain.gain.setTargetAtTime(item.def.gain * this.personality.gain / Math.sqrt(total) * (ex.enabled && item.def.ratio > 1 ? 0.92 + ex.chirpGain * 2 : 1), t, 0.06);
        }
        const pulseJitter = (Math.sin((elapsed + this.basePhase) * 5.3 + this.lifePhase) * 0.008 + Math.sin((elapsed + this.basePhase) * 13.9 + this.lifePhase * 0.27) * 0.004) * life;
        const pulseRobot = ex.enabled ? 1 + Math.sign(Math.sin(6.283 * (elapsed * ex.robotRate + this.lifePhase))) * ex.robotic * 0.045 : 1;
        const pulseWobble = (toggles.independentTimers ? 1 + Math.sin((elapsed + this.basePhase) * 3.7) * 0.018 * life * (1 + params.rhythmIntensity * 0.018) + pulseJitter : 1) * pulseRobot;
        this.pulse.frequency.setTargetAtTime(params.pulseRate * this.personality.pulse * pulseWobble, t, ex.enabled ? 0.020 : 0.035);
        this.setPulseDepth(clamp(params.pulseDepth * (ex.enabled ? 1 + ex.robotic * 0.08 : 1), 0.1, 0.99));
        const distanceBlur = toggles.distanceBlur && !ex.enabled;
        const resonFollow = params.resonance * this.personality.reson * (1 + pitchDrift * 0.55 + (ex.enabled ? (exRatio - 1) * ex.resBoost : 0));
        this.resonator.frequency.setTargetAtTime(resonFollow, t, 0.07);
        this.resonator.Q.setTargetAtTime(distanceBlur ? Math.max(0.8, params.q * 0.58) : params.q * (ex.enabled ? 1 + ex.robotic * 0.25 : 1), t, 0.07);
        this.lowpass.frequency.setTargetAtTime(distanceBlur ? clamp(params.resonance * 1.35, 3200, 9000) : (ex.enabled ? clamp(params.resonance * 2.2, 6500, 14500) : 12000), t, 0.08);
        this.bodyPeak.frequency.setTargetAtTime(resonFollow * 0.47, t, 0.08);
        this.noiseBand.frequency.setTargetAtTime(resonFollow * (ex.enabled ? 1.16 : 1.04), t, 0.08);
        this.noiseGain.gain.setTargetAtTime(params.noiseMix * (ex.enabled ? mix(0.20, 0.28, ex.robotic) : 0.18) / Math.sqrt(total), t, 0.05);
        let phrase = this.phrase(pattern, elapsed, params, toggles);
        if (ex.enabled) {
            const chirpPulse = Math.pow(Math.max(0, Math.sin(6.283 * (elapsed * ex.chirpRate + ex.phase + this.index * 0.041))), ex.modeId === 'robotPulse' ? 2 : 6);
            phrase = clamp(phrase * mix(1, exGate, 0.42) * mix(1, 1 + chirpPulse * ex.chirpGain * 2.4, 0.85), 0, 1.35);
        }
        const phraseSlew = clamp(mix(ex.enabled ? 0.010 : 0.020, ex.enabled ? 0.070 : 0.115, params.transitionSmoothness) / (1 + (params.rhythmAgility || 0) * (ex.enabled ? 2.2 : 1.15)), 0.009, 0.13);
        this.phraseGain.gain.setTargetAtTime(phrase * this.personality.gain, t, phraseSlew);
        if (this.panner) {
            const panAmount = toggles.stereoSpread ? this.personality.pan : this.personality.pan * 0.15;
            const panDrift = panAmount + Math.sin((elapsed + this.basePhase) * 0.18) * 0.08 * params.spread + (ex.enabled ? Math.sin(elapsed * ex.stepRate + this.index) * 0.05 * ex.robotic : 0);
            this.panner.pan.setTargetAtTime(clamp(panDrift, -1, 1), t, 0.1);
        }
        this.output.gain.setTargetAtTime(1 / Math.sqrt(total), t, 0.08);
    }

    fadeIn(delay = 0, time = 0.4) {
        setTimeout(() => {
            if (!this.presenceGain) return;
            const t = this.ctx.currentTime;
            this.presenceGain.gain.cancelScheduledValues(t);
            this.presenceGain.gain.setValueAtTime(Math.max(0.0001, this.presenceGain.gain.value), t);
            this.presenceGain.gain.setTargetAtTime(1, t, time);
        }, delay);
    }

    stop(fade = 0.3, delay = 0) {
        setTimeout(() => {
            try {
                const t = this.ctx.currentTime;
                this.presenceGain.gain.cancelScheduledValues(t);
                this.presenceGain.gain.setTargetAtTime(0, t, fade);
                setTimeout(() => this.dispose(), Math.max(120, fade * 1000 + 80));
            } catch (error) {
                this.dispose();
            }
        }, delay);
    }

    dispose() {
        for (const item of this.oscs) { try { item.osc.stop(); } catch (error) { /* stopped */ } }
        try { this.pulse.stop(); } catch (error) { /* stopped */ }
        try { this.pulseOffset.stop(); } catch (error) { /* stopped */ }
        try { this.noise.stop(); } catch (error) { /* stopped */ }
        try { this.output.disconnect(); } catch (error) { /* detached */ }
    }

    makeNoiseBuffer(seconds) {
        const len = Math.floor(this.ctx.sampleRate * seconds);
        const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) {
            const white = this.noiseRand() * 2 - 1;
            last = last * 0.72 + white * 0.28;
            data[i] = last;
        }
        return buffer;
    }

    makeDistortionCurve(amount) {
        const n = 2048;
        const curve = new Float32Array(n);
        const deg = Math.PI / 180;
        for (let i = 0; i < n; ++i) {
            const x = i * 2 / n - 1;
            curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }
}

// ---------------------------------------------------------------------------
// Engine: population lifecycle with density-based start/stop
// ---------------------------------------------------------------------------
export class GroupChorusEngine {
    constructor(audioCtx, genes, options = {}) {
        this.ctx = audioCtx;
        this.genes = genes;
        this.seed = genes.seed;
        this.extreme = genes.extreme;
        this.rhythmMode = genes.rhythmMode;
        this.pattern = genes.pattern;
        this.voices = [];
        this.bus = null;
        this.master = null;
        this.compressor = null;
        this.running = false;
        this.stopping = false;
        this.timer = null;
        this.startedAt = 0;
        this.destination = options.destination || audioCtx.destination;
        this.onStatus = options.onStatus || null;
        // v11.3.5: seeded hush phase so silence breaks land at a per-seed spot
        // in the cycle rather than at the same moment for every chorus.
        this.hushPhase = labRng((this.seed ^ 0x4B1D5EED) >>> 0)();
    }

    _status(label) {
        this.onStatus?.({
            label,
            running: this.running,
            stopping: this.stopping,
            voices: this.voices.length,
            rhythmMode: RHYTHM_MODES[this.rhythmMode]?.name || this.rhythmMode,
            preset: this.genes.presetName
        });
    }

    start() {
        if (this.running) return;
        if (!this.master) {
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.92;
            this.compressor = this.ctx.createDynamicsCompressor();
            this.compressor.threshold.value = -21;
            this.compressor.knee.value = 18;
            this.compressor.ratio.value = 4;
            this.compressor.attack.value = 0.004;
            this.compressor.release.value = 0.14;
            this.master.connect(this.compressor);
            this.compressor.connect(this.destination);
        }
        this.stopping = false;
        this.bus = this.ctx.createGain();
        this.bus.gain.value = 0;
        this.bus.connect(this.master);
        this.startedAt = performance.now();
        this._rebuildVoices();
        this.bus.gain.setTargetAtTime(this.genes.values.volume, this.ctx.currentTime, 0.035);
        this.running = true;
        this._status('density fade-in');
        this._loop();
    }

    _rebuildVoices() {
        if (!this.bus) return;
        for (const voice of this.voices) voice.stop(0.26, 0);
        this.voices = [];
        const p = this.genes.values;
        const count = Math.max(1, Math.round(p.voices));
        for (let i = 0; i < count; i++) {
            const voice = new Voice(this, i, count, p);
            this.voices.push(voice);
            // Staggered swarm entry: individuals join one by one.
            voice.fadeIn(i * voice.entryDelay, voice.entryFade);
        }
    }

    // Density fade-out: retire individual males one by one (ordered by their
    // seeded join offset) until the last few trail off — never a master fade.
    stop() {
        if (!this.running || this.stopping || !this.bus) return;
        this.stopping = true;
        this._status('density fade-out');
        const voices = [...this.voices];
        const count = voices.length;
        const baseDelay = count > 8 ? 70 : 95;
        const order = voices
            .map((voice, i) => ({ voice, sort: voice.joinOffset + i * 0.031 }))
            .sort((a, b) => a.sort - b.sort)
            .map(item => item.voice);
        order.forEach((voice, i) => {
            const delay = i * baseDelay + Math.round(voice.joinOffset * 70);
            const fade = 0.34 + voice.joinOffset * 0.28;
            voice.stop(fade, delay);
        });
        const totalMs = Math.round((count - 1) * baseDelay + 900);
        setTimeout(() => {
            if (!this.bus) return;
            const t = this.ctx.currentTime;
            this.bus.gain.cancelScheduledValues(t);
            this.bus.gain.setTargetAtTime(0, t, 0.12);
        }, Math.max(120, totalMs - 260));
        setTimeout(() => {
            try { this.bus?.disconnect(); } catch (error) { /* detached */ }
            this.voices = [];
            this.bus = null;
            this.running = false;
            this.stopping = false;
            if (this.timer) clearTimeout(this.timer);
            this._status('Ready');
        }, totalMs);
    }

    _loop() {
        if (!this.running || this.stopping) {
            if (this.running) this.timer = setTimeout(() => this._loop(), 60);
            return;
        }
        const p = this.genes.values;
        const toggles = this.genes.toggles;
        const elapsed = (performance.now() - this.startedAt) / 1000;
        for (const voice of this.voices) voice.update(p, elapsed, this.pattern, toggles, this.voices.length);
        // v11.3.5: rare whole-swarm hush. Roughly every ~75s the forest drops
        // to near silence for a couple of seconds, then swells back — the
        // classic "something moved" cicada moment.
        if (toggles.silenceBreaks && this.bus) {
            const cyc = (elapsed * 0.0133 + this.hushPhase) % 1;
            const hush = smoothstep(0.955, 0.968, cyc) * (1 - smoothstep(0.982, 0.996, cyc));
            const target = this.genes.values.volume * (1 - hush * 0.92);
            this.bus.gain.setTargetAtTime(target, this.ctx.currentTime, hush > 0.02 ? 0.28 : 0.55);
            if (hush > 0.5) this._status('swarm hush');
            else this._status('living chorus');
        } else {
            this._status('living chorus');
        }
        this.timer = setTimeout(() => this._loop(), 60);
    }

    destroy() {
        if (this.timer) clearTimeout(this.timer);
        for (const voice of this.voices) voice.dispose();
        this.voices = [];
        try { this.bus?.disconnect(); } catch (error) { /* detached */ }
        try { this.master?.disconnect(); } catch (error) { /* detached */ }
        this.running = false;
        this.stopping = false;
    }
}

export function createGroupChorus(audioCtx, seed, tierName = 'Common', options = {}) {
    return new GroupChorusEngine(audioCtx, groupGenesForSeed(seed, tierName), options);
}
