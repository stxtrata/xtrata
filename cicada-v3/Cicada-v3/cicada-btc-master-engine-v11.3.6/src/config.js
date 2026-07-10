// Shared palettes, audio tables, and constants used by the renderer and synth.
export const DEFAULT_NEON_COLOR = '#ff0055';
export const SUPPORTED_EFFECTS = Object.freeze(['glitch', 'rainbow', 'lightning', 'ghost']);

export const CICADA_COLOR_PRESETS = Object.freeze({
        red: DEFAULT_NEON_COLOR,
        orange: '#f7931a',
        green: '#22c55e',
        blue: '#3b82f6',
        cyan: '#06b6d4',
        purple: '#a855f7',
        rainbow: DEFAULT_NEON_COLOR
    });

export const SHELL_PRESETS = {
        emerald: { light: '#2a3826', dark: '#111610', accent: '#4a5d43' },
        obsidian: { light: '#1a1a1a', dark: '#050505', accent: '#2b2b2b' },
        amethyst: { light: '#382638', dark: '#161016', accent: '#5d435d' },
        cobalt: { light: '#262a38', dark: '#101116', accent: '#434a5d' },
        gold: { light: '#4a3b11', dark: '#1c1503', accent: '#7a6422' },
        bone: { light: '#d8c7a2', dark: '#4a3824', accent: '#fff1c7' }
    };

export const EYE_PRESETS = {
        crimson: { fill: '#cc0000', glow: '#ff0000' },
        tangerine: { fill: '#e65c00', glow: '#ff6600' },
        phantom: { fill: '#ffffff', glow: '#ffffff' },
        toxic: { fill: '#33cc33', glow: '#33ff33' },
        gold: { fill: '#ffd700', glow: '#ffea00' },
        void: { fill: '#030303', glow: 'transparent' }
    };

export const LASER_COLORS = {
        red: '#ff0033',
        blue: '#0066ff',
        green: '#00ff33',
        purple: '#aa00ff',
        gold: '#ffcc00',
        cyan: '#00ffff'
    };

export const ROOT_FREQUENCIES = Object.freeze({
        red: 55, orange: 61.74, green: 65.41, blue: 73.42, cyan: 82.41, purple: 92.5, rainbow: 110
    });
export const ENVIRONMENT_AUDIO = Object.freeze({
        cave: ['lowpass', 0.4, 0.5, 1200],
        canyon: ['highpass', 0.75, 0.35, 600],
        void: ['lowpass', 1.1, 0.7, 800]
    });
export const RHYTHM_LFO = Object.freeze({
        trill: 35, stutter: 28, data: 18, cricket: 12, 'cicada-call': 60, choir: 9, drone: 14
    });
export const THUNDER_PROFILES = Object.freeze({
        'distant-rumble': { duration: [3.2, 5.8], subStart: 58, subEnd: 28, gain: [0.55, 1.2], crack: 0.28, harmonics: [0.35, 0.18], roll: 0.45 },
        'dry-crack': { duration: [2.4, 4], subStart: 82, subEnd: 34, gain: [0.7, 1.55], crack: 1.05, harmonics: [0.55, 0.22], roll: 0.22 },
        'cavern-boom': { duration: [4.4, 7.2], subStart: 64, subEnd: 22, gain: [0.95, 2.2], crack: 0.55, harmonics: [0.7, 0.34, 0.18], roll: 0.75 },
        'rolling-storm': { duration: [5, 8], subStart: 54, subEnd: 24, gain: [0.85, 1.95], crack: 0.65, harmonics: [0.48, 0.3, 0.16], roll: 0.95 },
        'sub-impact': { duration: [3.6, 6.4], subStart: 92, subEnd: 20, gain: [1.1, 2.7], crack: 0.45, harmonics: [0.9, 0.4, 0.2], roll: 0.52 },
        'mythic-skybreak': { duration: [5.5, 9], subStart: 96, subEnd: 18, gain: [1.35, 3.2], crack: 1.2, harmonics: [1, 0.55, 0.28, 0.14], roll: 1.15 }
    });
export const VOICE_OSCILLATORS = Object.freeze({
        'raspy-square': 'square', 'bitcrush-click': 'square',
        'saw-buzz': 'sawtooth', 'laser-squeal': 'sawtooth', 'thunder-organ': 'sawtooth',
        'metallic-ring': 'triangle'
    });
export const VOICE_FILTERS = Object.freeze({
        'sub-organ': 520, 'thunder-organ': 520, 'ghost-whisper': 950,
        'glass-harmonic': 4200, 'laser-squeal': 5200, 'bitcrush-click': 2800
    });
export const RICHNESS_INDEX = Object.freeze({ plain: 0, textured: 1, layered: 2, harmonic: 3, storm: 4, mythic: 5 });
