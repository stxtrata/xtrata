// Central registry for stable seeded traits and experimental audition-only traits.
// Experimental values are intentionally not wired into rarity until promoted in cicada-traits.js.
export const BODY_SKIN_VALUES = Object.freeze(['none', 'carbon', 'hazard', 'polka', 'camo', 'wood', 'magma', 'synthwave', 'iridescent', 'porcelain', 'circuit-tattoo', 'static-noise', 'bio-lattice']);

export const PRIME_ENGINE_VALUES = Object.freeze([
    'prime-pulse', 'prime-grid', 'prime-bloom', 'prime-swarm', 'prime-interference',
    'ulam-spiral', 'twin-prime-orbit', 'prime-gap-sweep', 'residue-bloom', '3301-beacon'
]);
export const PRIME_SET_VALUES = Object.freeze(['11', '13', '17', '11-13', '13-17', '11-13-17']);

export const TRAIT_REGISTRY = Object.freeze({
    barkBackdrop: Object.freeze({
        label: 'Bark Backdrop',
        defaultValue: '',
        official: Object.freeze([
            'none', 'oak', 'maple', 'hickory', 'apple', 'willow', 'elm', 'ash', 'birch',
            'dogwood', 'linden', 'pear-cherry', 'poplar',
            'eucalyptus', 'angophora', 'casuarina', 'acacia'
        ]),
        experimental: Object.freeze([])
    }),
    abdomen: Object.freeze({
        label: 'Abdomen Pattern',
        defaultValue: '',
        official: Object.freeze([
            'smooth', 'ribbed', 'barcode', 'plating', 'glyph',
            'banded-straight', 'banded-curved', 'twotone-straight', 'twotone-curved',
            'rainbow-straight', 'rainbow-curved'
        ]),
        experimental: Object.freeze([
            'oil-slick-bands', 'tartan-bands', 'molten-cracks', 'neon-cells', 'bone-segments'
        ])
    }),
    abdomenVariant: Object.freeze({
        label: 'Abdomen Variant',
        defaultValue: '',
        official: Object.freeze(['balanced', 'thin-bands', 'wide-bands', 'offset-bands', 'broken-bands', 'centre-spine', 'double-spine', 'asymmetric-left', 'asymmetric-right']),
        experimental: Object.freeze([])
    }),
    thoraxSkin: Object.freeze({
        label: 'Thorax Material',
        defaultValue: '',
        official: Object.freeze(['none', 'carbon', 'hazard', 'polka', 'camo', 'wood', 'magma', 'synthwave']),
        experimental: Object.freeze(['iridescent', 'porcelain', 'circuit-tattoo', 'static-noise', 'bio-lattice'])
    }),
    abdomenSkin: Object.freeze({
        label: 'Abdomen Material',
        defaultValue: '',
        official: Object.freeze(['none', 'carbon', 'hazard', 'polka', 'camo', 'wood', 'magma', 'synthwave']),
        experimental: Object.freeze(['iridescent', 'porcelain', 'circuit-tattoo', 'static-noise', 'bio-lattice'])
    }),
    paletteMode: Object.freeze({
        label: 'Palette Harmony',
        defaultValue: '',
        official: Object.freeze(['mono-neon', 'analogous', 'complementary', 'triadic', 'bone-gold', 'void-cipher']),
        experimental: Object.freeze([])
    }),
    wingPattern: Object.freeze({
        label: 'Wing Pattern',
        defaultValue: '',
        official: Object.freeze(['glass', 'circuit', 'hex', 'prism', 'stellar', 'corrupt']),
        experimental: Object.freeze(['stained-glass', 'vein-map', 'rain-map', 'sonar-rings'])
    }),
    normalWingVeins: Object.freeze({
        label: 'Normal Wing Veins',
        defaultValue: '',
        official: Object.freeze(['clean', 'faint-veins', 'soft-veins', 'structured-veins']),
        experimental: Object.freeze([])
    }),
    normalWingTint: Object.freeze({
        label: 'Normal Wing Tint',
        defaultValue: '',
        official: Object.freeze(['clear', 'smoke-grey', 'warm-amber', 'olive-smoke', 'cool-blue-grey']),
        experimental: Object.freeze([])
    }),
    normalWingEdge: Object.freeze({
        label: 'Normal Wing Edge',
        defaultValue: '',
        official: Object.freeze(['clean-edge', 'soft-nicks', 'minor-fray', 'tiny-tears']),
        experimental: Object.freeze([])
    }),
    antennaeVariant: Object.freeze({
        label: 'Antennae Variant',
        defaultValue: '',
        official: Object.freeze(['standard', 'swept', 'high-arch', 'wide-spread', 'hooked-tips', 'sensor-tips']),
        experimental: Object.freeze([])
    }),
    markingLayer: Object.freeze({
        label: 'Cipher Marking',
        defaultValue: '',
        official: Object.freeze(['none', 'prime-ticks', 'residue-dots', 'cipher-glyphs', 'hash-fragments', 'coordinate-arcs']),
        experimental: Object.freeze([])
    }),
    eyeBehavior: Object.freeze({
        label: 'Eye Animation',
        defaultValue: '',
        official: Object.freeze(['static', 'breathe', 'rgb', 'strobe']),
        experimental: Object.freeze(['scanner'])
    }),
    eyeStyle: Object.freeze({
        label: 'Eye Lab Style',
        defaultValue: '',
        official: Object.freeze([]),
        experimental: Object.freeze([
            'halo-single', 'halo-double', 'brow-arcs', 'side-flares', 'top-glints',
            'orbit-dots', 'lower-crescents', 'bracket-corners', 'scan-bars', 'ember-specks'
        ])
    }),
    eyeStyleColor: Object.freeze({
        label: 'Eye Accent Colour',
        defaultValue: '',
        official: Object.freeze([]),
        experimental: Object.freeze(['match-eye', 'gold', 'ember', 'toxic', 'cyan', 'phantom', 'violet', 'crimson', 'rainbow'])
    }),
    effectPreset: Object.freeze({
        label: 'FX Preset',
        defaultValue: 'official',
        official: Object.freeze(['official']),
        experimental: Object.freeze(['none', 'glitch-only', 'ghost-only', 'lightning-only', 'glitch-ghost', 'full-storm'])
    }),
    glitchStyle: Object.freeze({
        label: 'Glitch Style',
        defaultValue: '',
        official: Object.freeze([]),
        experimental: Object.freeze(['whole-body-rgb-split', 'double-vision', 'focus-drift', 'datamosh-smear'])
    }),
    motionField: Object.freeze({
        label: 'Prime Engine',
        defaultValue: '',
        official: Object.freeze(['none', ...PRIME_ENGINE_VALUES]),
        experimental: Object.freeze([])
    }),
    primeSet: Object.freeze({
        label: 'Prime Set',
        defaultValue: '',
        official: Object.freeze(['none', ...PRIME_SET_VALUES]),
        experimental: Object.freeze([])
    }),
    ambientField: Object.freeze({
        label: 'Ambient Cipher',
        defaultValue: '',
        official: Object.freeze(['none', 'sieve-snow', 'prime-ash', 'ember-drift']),
        experimental: Object.freeze([])
    }),
    tymbalLayer: Object.freeze({
        label: 'Tymbal Plates',
        defaultValue: '',
        official: Object.freeze(['none']),
        experimental: Object.freeze(['bronze-plates', 'glass-membranes', 'circuit-tymbals', 'ribbed-speakers', 'mythic-resonators'])
    }),
});

export const LAB_CONTROL_ORDER = Object.freeze([
    'barkBackdrop',
    'abdomen',
    'abdomenVariant',
    'thoraxSkin',
    'abdomenSkin',
    'paletteMode',
    'wingPattern',
    'normalWingVeins',
    'normalWingTint',
    'normalWingEdge',
    'antennaeVariant',
    'markingLayer',
    'eyeBehavior',
    'eyeStyle',
    'eyeStyleColor',
    'effectPreset',
    'glitchStyle',
    'motionField',
    'primeSet',
    'ambientField',
    'tymbalLayer'
]);

export const NON_INSTRUCTION_CONTROLS = Object.freeze(new Set(['effectPreset']));

export function valuesForTrait(key) {
    const trait = TRAIT_REGISTRY[key];
    if (!trait) return [];
    const first = trait.defaultValue === '' ? ['official seed value'] : [trait.defaultValue];
    return [...first, ...trait.official, ...trait.experimental];
}

export function valueToOptionValue(value) {
    return value === 'official seed value' ? '' : value;
}

export function isExperimentalValue(key, value) {
    const trait = TRAIT_REGISTRY[key];
    return Boolean(trait && trait.experimental.includes(value));
}

export function effectPresetToEffects(preset, officialEffects = []) {
    if (preset === 'official' || !preset) return officialEffects.slice();
    if (preset === 'none') return [];
    if (preset === 'glitch-only') return ['glitch'];
    if (preset === 'ghost-only') return ['ghost'];
    if (preset === 'lightning-only') return ['lightning'];
    if (preset === 'glitch-ghost') return ['glitch', 'ghost'];
    if (preset === 'full-storm') return ['glitch', 'ghost', 'lightning'];
    return officialEffects.slice();
}

export function buildInstructionOverrides(labState, officialInstructions = {}) {
    const overrides = {};
    for (const [key, value] of Object.entries(labState || {})) {
        if (!value || NON_INSTRUCTION_CONTROLS.has(key)) continue;
        overrides[key] = value;
    }

    if (labState?.effectPreset && labState.effectPreset !== 'official') {
        overrides.effects = effectPresetToEffects(labState.effectPreset, officialInstructions.effects || []);
        if (overrides.effects.includes('lightning')) {
            overrides.lightningType = officialInstructions.lightningType && officialInstructions.lightningType !== 'none' ? officialInstructions.lightningType : 'strike';
            overrides.lightningColor = officialInstructions.lightningColor && officialInstructions.lightningColor !== 'none' ? officialInstructions.lightningColor : 'white';
            overrides.thunderType = officialInstructions.thunderType && officialInstructions.thunderType !== 'none' ? officialInstructions.thunderType : 'rolling-storm';
        } else {
            overrides.lightningType = 'none';
            overrides.lightningColor = 'none';
            overrides.thunderType = 'none';
        }
    }

    if (overrides.motionField === 'none') overrides.primeSet = 'none';
    if (overrides.motionField === '3301-beacon' && (!overrides.primeSet || overrides.primeSet === 'none')) overrides.primeSet = '11-13-17';
    return overrides;
}

function randomPoolForControl(key) {
    const trait = TRAIT_REGISTRY[key];
    const experimental = trait.experimental.filter(Boolean);
    const officialPreferred = trait.official.filter(value => value !== trait.defaultValue && value !== 'none');
    const officialFallback = trait.official.filter(value => value !== trait.defaultValue);
    return experimental.length ? [...experimental, ...officialPreferred] : (officialPreferred.length ? officialPreferred : officialFallback);
}

export function randomExperimentalLabState(rng = Math.random, lockedState = {}) {
    const pick = values => values[Math.floor(rng() * values.length)];
    const next = {};
    for (const key of LAB_CONTROL_ORDER) {
        if (lockedState[key]) continue;
        const pool = key === 'thoraxSkin' || key === 'abdomenSkin'
            ? BODY_SKIN_VALUES.filter(value => value !== 'none')
            : randomPoolForControl(key);
        if (pool.length) next[key] = pick(pool);
    }
    if (next.motionField === '3301-beacon') next.primeSet = '11-13-17';
    if (next.motionField === 'none') next.primeSet = 'none';
    return next;
}
