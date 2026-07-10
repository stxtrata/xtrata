// Deterministic seed generation, trait weighting, rarity scoring, and metadata export.
import { mulberry32, rounded } from './utils.js?v=11.3.5';
import { soundIdentitySummaryForSeed } from './sound-identity.js?v=11.3.5';

export const COLLECTION_SIZE = 3301;
    export const availableColors = Object.freeze(['red', 'orange', 'green', 'blue', 'cyan', 'purple', 'rainbow']);

    function clampSeed(seed) {
        const n = Number.parseInt(seed, 10);
        if (!Number.isFinite(n)) return 1;
        return Math.min(COLLECTION_SIZE, Math.max(1, n));
    }

    export function normalizeSeed(seed) {
        return clampSeed(seed);
    }

    function seedToState(seed) {
        let x = clampSeed(seed) >>> 0;
        x ^= x << 13; x >>>= 0;
        x ^= x >>> 17; x >>>= 0;
        x ^= x << 5; x >>>= 0;
        return (x + 0x9E3779B9) >>> 0;
    }

    const MOTION_FIELD_VALUES = Object.freeze(['prime-pulse', 'prime-grid', 'prime-bloom', 'prime-swarm', 'prime-interference', 'ulam-spiral', 'twin-prime-orbit', 'prime-gap-sweep', 'residue-bloom']);
    const MYTHIC_MOTION_FIELD = '3301-beacon';
    const PRIME_SET_VALUES = Object.freeze(['11', '13', '17', '11-13', '13-17', '11-13-17']);
    const AMBIENT_FIELD_VALUES = Object.freeze(['sieve-snow', 'prime-ash', 'ember-drift']);
    const ANALOG_NEIGHBORS = Object.freeze({ red: ['orange', 'purple'], orange: ['red', 'green'], green: ['orange', 'cyan'], cyan: ['green', 'blue'], blue: ['cyan', 'purple'], purple: ['blue', 'red'], rainbow: ['cyan', 'purple'] });
    const COMPLEMENTARY_MAP = Object.freeze({ red: 'cyan', orange: 'blue', green: 'purple', cyan: 'red', blue: 'orange', purple: 'green', rainbow: 'gold' });
    const TRIAD_MAP = Object.freeze({ red: ['blue', 'green'], orange: ['purple', 'cyan'], green: ['red', 'blue'], cyan: ['orange', 'purple'], blue: ['red', 'green'], purple: ['orange', 'cyan'], rainbow: ['gold', 'phantom'] });

    function motionFieldForSeed(seed, rank = seed) {
        if (rank <= 3 || seed === 3301) return MYTHIC_MOTION_FIELD;
        const rng = mulberry32((seedToState(seed) ^ 0xBADC0DE ^ (rank * 2654435761)) >>> 0);
        return MOTION_FIELD_VALUES[Math.floor(rng() * MOTION_FIELD_VALUES.length)] || 'ulam-spiral';
    }

    function primeSetForSeed(seed, rank = seed) {
        if (rank <= 3 || seed === 3301) return '11-13-17';
        const rng = mulberry32((seedToState(seed) ^ 0x51E7CAFE ^ (rank * 3266489917)) >>> 0);
        return PRIME_SET_VALUES[Math.floor(rng() * PRIME_SET_VALUES.length)] || '13';
    }

    // v11.2: photographic bark backdrops. The procedural styles are replaced by
    // 16 real tree-bark references (cropped quadrants of the 2x2 reference sets).
    // Each slug maps to assets/bark/<slug>.jpg.
    const BARK_BACKDROP_VALUES = Object.freeze([
        'oak', 'maple', 'hickory', 'apple', 'willow', 'elm', 'ash', 'birch',
        'dogwood', 'linden', 'pear-cherry', 'poplar',
        'eucalyptus', 'angophora', 'casuarina', 'acacia'
    ]);

    // Human-readable labels for the displayed 'Bark Backdrop' trait.
    const BARK_BACKDROP_LABELS = Object.freeze({
        'none': 'Studio Dark',
        'oak': 'Oak', 'maple': 'Maple', 'hickory': 'Hickory', 'apple': 'Apple',
        'willow': 'Willow', 'elm': 'Elm', 'ash': 'Ash', 'birch': 'Birch',
        'dogwood': 'Dogwood', 'linden': 'Linden', 'pear-cherry': 'Pear / Cherry',
        'poplar': 'Poplar', 'eucalyptus': 'Eucalyptus', 'angophora': 'Angophora',
        'casuarina': 'Casuarina', 'acacia': 'Acacia'
    });
    function barkBackdropLabel(slug) {
        return BARK_BACKDROP_LABELS[slug]
            || String(slug).replace(/(^|-)(\w)/g, (m, sep, ch) => (sep ? ' ' : '') + ch.toUpperCase()).trim();
    }

    // Photographic bark backdrop, assigned post-rank so it never affects the
    // established rarity ordering. v11.2 gives every seed a real bark backdrop.
    function barkBackdropForSeed(seed) {
        const rng = mulberry32((normalizeSeed(seed) ^ 0xBA2CD20F) >>> 0);
        return BARK_BACKDROP_VALUES[Math.floor(rng() * BARK_BACKDROP_VALUES.length)] || 'none';
    }

    // v11.3: deterministic bark family for metadata / gallery filtering.
    const BARK_FAMILY_MAP = Object.freeze({
        'oak': 'deciduous-hardwood', 'maple': 'deciduous-hardwood', 'hickory': 'deciduous-hardwood',
        'ash': 'deciduous-hardwood', 'birch': 'deciduous-hardwood', 'dogwood': 'deciduous-hardwood',
        'linden': 'deciduous-hardwood', 'poplar': 'deciduous-hardwood',
        'apple': 'orchard-fruit', 'pear-cherry': 'orchard-fruit',
        'willow': 'softwood-weeping',
        'eucalyptus': 'evergreen', 'angophora': 'evergreen', 'casuarina': 'evergreen',
        'acacia': 'legume'
    });
    const BARK_FAMILY_LABELS = Object.freeze({
        'deciduous-hardwood': 'Deciduous Hardwood',
        'evergreen': 'Evergreen',
        'australian-native': 'Australian Native',
        'orchard-fruit': 'Orchard / Fruit',
        'softwood-weeping': 'Softwood / Weeping',
        'legume': 'Legume',
        'none': 'Studio Dark'
    });
    function barkFamilyForSeed(seed) {
        const backdrop = barkBackdropForSeed(seed);
        if (backdrop === 'none') return 'none';
        // Australian natives are also evergreen; keep them as a distinct family.
        if (['eucalyptus', 'angophora', 'casuarina', 'acacia'].includes(backdrop)) return 'australian-native';
        return BARK_FAMILY_MAP[backdrop] || 'deciduous-hardwood';
    }
    function barkFamilyLabel(slug) {
        return BARK_FAMILY_LABELS[slug] || String(slug).replace(/(^|-)(\w)/g, (m, sep, ch) => (sep ? ' ' : '') + ch.toUpperCase()).trim();
    }

    // v11.3: seeded placement for the bark photo so every seed gets a unique crop
    // even when it shares a tree type with another seed. Post-rank, no score impact.
    function barkPlacementForSeed(seed) {
        const rng = mulberry32((normalizeSeed(seed) ^ 0xBA4CAB1) >>> 0);
        return {
            scale: rounded(1.05 + rng() * 0.50, 4),
            tx: rounded((rng() - 0.5) * 24, 3),
            ty: rounded((rng() - 0.5) * 24, 3),
            rotate: rounded((rng() - 0.5) * 4, 3)
        };
    }

    function ambientFieldForSeed(seed, rank = seed) {
        const rng = mulberry32((seedToState(seed) ^ 0xFACEFEED ^ (rank * 2246822519)) >>> 0);
        return AMBIENT_FIELD_VALUES[Math.floor(rng() * AMBIENT_FIELD_VALUES.length)] || 'sieve-snow';
    }

    export const TRAIT_WEIGHTS = Object.freeze({
        color: Object.freeze([
            ['green', 18], ['blue', 18], ['red', 16], ['orange', 14], ['cyan', 14], ['purple', 12], ['rainbow', 8]
        ]),
        shellColor: Object.freeze([
            ['emerald', 32], ['obsidian', 22], ['cobalt', 18], ['amethyst', 14], ['gold', 10], ['bone', 4]
        ]),
        wingPattern: Object.freeze([
            ['glass', 45], ['circuit', 18], ['hex', 15], ['prism', 12], ['stellar', 8], ['corrupt', 2]
        ]),
        wingShape: Object.freeze([
            ['classic', 100]
        ]),
        normalWingVeins: Object.freeze([
            ['clean', 34], ['faint-veins', 36], ['soft-veins', 24], ['structured-veins', 6]
        ]),
        normalWingTint: Object.freeze([
            ['clear', 42], ['smoke-grey', 28], ['warm-amber', 14], ['olive-smoke', 8], ['cool-blue-grey', 8]
        ]),
        normalWingEdge: Object.freeze([
            ['clean-edge', 64], ['soft-nicks', 24], ['minor-fray', 10], ['tiny-tears', 2]
        ]),
        antennae: Object.freeze([
            ['none', 40], ['classic', 30], ['moth', 15], ['cyber', 15]
        ]),
        antennaeVariant: Object.freeze([
            ['standard', 34], ['swept', 22], ['high-arch', 16], ['wide-spread', 12], ['hooked-tips', 9], ['sensor-tips', 7]
        ]),
        environment: Object.freeze([
            ['studio', 50], ['cave', 20], ['canyon', 20], ['void', 10]
        ]),
        eyeType: Object.freeze([
            ['classic', 65], ['void', 20], ['cyclops', 15]
        ]),
        eyeColor: Object.freeze([
            ['crimson', 30], ['tangerine', 20], ['toxic', 18], ['phantom', 14], ['gold', 10], ['void', 8]
        ]),
        eyeBehavior: Object.freeze([
            ['static', 60], ['breathe', 20], ['rgb', 10], ['strobe', 10]
        ]),
        laserType: Object.freeze([
            ['none', 82], ['straight', 13], ['sweeping', 5]
        ]),
        laserColor: Object.freeze([
            ['red', 24], ['blue', 20], ['green', 18], ['purple', 16], ['gold', 12], ['cyan', 10]
        ]),
        songRhythm: Object.freeze([
            ['drone', 30], ['trill', 18], ['data', 16], ['stutter', 12], ['cricket', 10], ['choir', 8], ['cicada-call', 6]
        ]),
        callType: Object.freeze([
            ['basic', 35], ['pulse', 25], ['trill', 15], ['melody', 15], ['chordal', 7], ['chaotic', 3]
        ]),
        callShape: Object.freeze([
            ['single-chirp', 12], ['double-chirp', 16], ['morse-clicks', 14], ['steady-drone', 12], ['trill-burst', 10],
            ['accelerating-clicks', 7], ['decelerating-clicks', 6], ['heartbeat-clicks', 5], ['rising-drone', 6], ['falling-drone', 5], ['warble', 5],
            ['melodic-phrase', 6], ['call-and-response', 3], ['swarm-stack', 2], ['ritual-chant', 2], ['glitch-code', 1.5], ['storm-call', 1.2],
            ['eclipse-chorus', 0.35], ['cathedral-swarm', 0.25], ['lightning-oracle', 0.15]
        ]),
        callVoice: Object.freeze([
            ['natural-sine', 24], ['raspy-square', 18], ['saw-buzz', 16], ['metallic-ring', 10], ['glass-harmonic', 8],
            ['sub-organ', 7], ['bitcrush-click', 6], ['fm-insect', 5], ['choir-formant', 3], ['ghost-whisper', 2], ['laser-squeal', 1.5], ['thunder-organ', 0.5]
        ]),
        callRhythm: Object.freeze([
            ['even', 24], ['syncopated', 15], ['morse', 13], ['triplet', 10], ['stutter', 9], ['heartbeat', 8],
            ['gallop', 7], ['random-walk', 6], ['accelerando', 5], ['ritardando', 3]
        ]),
        callRichness: Object.freeze([
            ['plain', 42], ['textured', 28], ['layered', 16], ['harmonic', 8], ['storm', 4], ['mythic', 2]
        ]),
        abdomen: Object.freeze([
            ['smooth', 30], ['ribbed', 20], ['plating', 15], ['barcode', 10],
            ['banded-straight', 4], ['banded-curved', 4],
            ['twotone-straight', 4], ['twotone-curved', 3],
            ['glyph', 5],
            ['rainbow-straight', 3], ['rainbow-curved', 2]
        ]),
        skin: Object.freeze([
            ['none', 50], ['carbon', 15], ['camo', 10], ['wood', 10],
            ['hazard', 6], ['polka', 4], ['synthwave', 3], ['magma', 2]
        ]),
        aura: Object.freeze([
            ['none', 65], ['halo', 22], ['orbit', 13]
        ]),
        legs: Object.freeze([
            ['organic', 85], ['mecha', 15]
        ]),
        wireframe: Object.freeze([
            [false, 70], [true, 30]
        ]),
        motionField: Object.freeze([
            ['ulam-spiral', 26], ['twin-prime-orbit', 24],
            ['prime-gap-sweep', 22], ['residue-bloom', 18], ['3301-beacon', 10]
        ]),
        ambientField: Object.freeze([
            ['sieve-snow', 48], ['prime-ash', 28], ['ember-drift', 24]
        ]),
        paletteMode: Object.freeze([
            ['mono-neon', 24], ['analogous', 20], ['complementary', 20], ['triadic', 14], ['bone-gold', 12], ['void-cipher', 10]
        ]),
        markingLayer: Object.freeze([
            ['none', 52], ['prime-ticks', 14], ['residue-dots', 12], ['cipher-glyphs', 9], ['hash-fragments', 8], ['coordinate-arcs', 5]
        ]),
        lightningType: Object.freeze([
            ['ambient', 70], ['strike', 30]
        ]),
        lightningColor: Object.freeze([
            ['white', 50], ['red', 20], ['green', 15], ['orange', 10], ['rainbow', 5]
        ]),
        thunderType: Object.freeze([
            ['distant-rumble', 34], ['dry-crack', 24], ['cavern-boom', 18], ['rolling-storm', 14], ['sub-impact', 7], ['mythic-skybreak', 3]
        ])
    });

    export const EFFECT_WEIGHTS = Object.freeze({
        lightning: 8,
        ghost: 5,
        glitch: 4
    });

    export const RARITY_TIERS = Object.freeze([
        { name: 'Mythic', maxRank: 3 },
        { name: 'Legendary', maxRank: 33 },
        { name: 'Epic', maxRank: 165 },
        { name: 'Rare', maxRank: 495 },
        { name: 'Uncommon', maxRank: 1320 },
        { name: 'Common', maxRank: COLLECTION_SIZE }
    ]);

    function weightedPick(rng, weighted, filterFn = null) {
        let filtered = filterFn ? weighted.filter(filterFn) : weighted;
        if (filtered.length === 0) {
            // v11.3.5: never silently leak gated (high-tier) traits. If a filter
            // combination empties the list, fall back to the single heaviest
            // (most common) entry instead of the full unfiltered table.
            filtered = [weighted.reduce((best, item) => item[1] > best[1] ? item : best, weighted[0])];
        }
        const total = filtered.reduce((sum, [, weight]) => sum + weight, 0);
        let roll = rng() * total;
        for (const [value, weight] of filtered) {
            roll -= weight;
            if (roll <= 0) return value;
        }
        return filtered[filtered.length - 1][0];
    }

    function rollPercent(rng, percent) {
        return rng() * 100 < percent;
    }

    function instructionTraits(instructions) {
        let ltg = 'none';
        if ((instructions.effects || []).includes('lightning')) {
            ltg = `${instructions.lightningColor} ${instructions.lightningType}`;
        }

        return {
            'Core Color': instructions.color,
            'Shell Type': instructions.shellColor,
            'Wing Morph': instructions.wingPattern,
            'Wing Shape': instructions.wingShape,
            'Normal Wing Veins': instructions.wingPattern === 'glass' ? (instructions.normalWingVeins || 'clean') : 'none',
            'Normal Wing Tint': instructions.wingPattern === 'glass' ? (instructions.normalWingTint || 'clear') : 'none',
            'Normal Wing Edge': instructions.wingPattern === 'glass' ? (instructions.normalWingEdge || 'clean-edge') : 'none',
            'Antennae': instructions.antennae,
            'Environment': instructions.environment,
            'Eye Type': instructions.eyeType,
            'Eye Pigment': instructions.eyeColor,
            'Ocular Anim': instructions.eyeBehavior,
            'Eye Lab Style': instructions.eyeStyle || 'none',
            'Eye Accent Colour': instructions.eyeStyleColor || 'match-eye',
            'Laser Type': instructions.laserType,
            'Laser Color': instructions.laserType === 'none' ? 'none' : instructions.laserColor,
            'Song Rhythm': instructions.songRhythm,
            'Call Pattern': instructions.callType,
            'Call Shape': instructions.callShape || 'legacy',
            'Call Voice': instructions.callVoice || 'legacy',
            'Call Rhythm': instructions.callRhythm || 'legacy',
            'Call Richness': instructions.callRichness || 'plain',
            'Abdomen': instructions.abdomen,
            'Skin Mat.': instructions.skin,
            'Palette Mode': instructions.paletteMode || 'mono-neon',
            'Cipher Mark': instructions.markingLayer || 'none',
            'Legs': instructions.legs,
            'Aura': instructions.aura,
            'Wireframe': instructions.wireframe ? 'yes' : 'no',
            'Lightning FX': ltg,
            'Thunder Profile': instructions.thunderType || 'none',
            'Ghost FX': (instructions.effects || []).includes('ghost') ? 'yes' : 'no',
            'Glitch FX': (instructions.effects || []).includes('glitch') ? 'yes' : 'no'
        };
    }

    function activeCombos(instructions) {
        const effects = new Set(instructions.effects || []);
        const combos = [];
        const add = (name, active, weight = 1) => { if (active) combos.push({ name, weight }); };
        add('Any Laser + Glitch', instructions.laserType !== 'none' && effects.has('glitch'), 0.35);
        add('Sweeping Laser + Glitch', instructions.laserType === 'sweeping' && effects.has('glitch'), 0.50);
        add('Rainbow + Glitch', instructions.color === 'rainbow' && effects.has('glitch'), 0.38);
        add('Gold Shell + Gold Eyes', instructions.shellColor === 'gold' && instructions.eyeColor === 'gold', 0.26);
        add('Void Eyes + Ghost', instructions.eyeType === 'void' && effects.has('ghost'), 0.35);
        add('Cyclops + Laser', instructions.eyeType === 'cyclops' && instructions.laserType !== 'none', 0.32);
        add('Mecha Legs + Circuit Wings', instructions.legs === 'mecha' && instructions.wingPattern === 'circuit', 0.20);
        add('Barcode Abdomen + Data Rhythm', instructions.abdomen === 'barcode' && instructions.songRhythm === 'data', 0.22);
        add('Orbit Aura + Rainbow', instructions.aura === 'orbit' && instructions.color === 'rainbow', 0.28);
        add('Choir Rhythm + Halo Aura', instructions.songRhythm === 'choir' && instructions.aura === 'halo', 0.25);
        add('Cicada Call + Sweeping Laser', instructions.songRhythm === 'cicada-call' && instructions.laserType === 'sweeping', 0.42);
        add('Corrupt Wings + Glitch', instructions.wingPattern === 'corrupt' && effects.has('glitch'), 0.55);
        add('Glyph Abdomen + Orbit Aura', instructions.abdomen === 'glyph' && instructions.aura === 'orbit', 0.33);
        add('Aura Presence', instructions.aura !== 'none', 0.75);
        add('Light FX Presence', instructions.laserType !== 'none' || (instructions.effects || []).includes('lightning'), 0.75);
        add('Moth Wings + Moth Antennae', instructions.wingShape === 'moth' && instructions.antennae === 'moth', 0.40);
        add('Void Environment + Ghost FX', instructions.environment === 'void' && effects.has('ghost'), 0.45);
        add('Cyber Antennae + Circuit Wings', instructions.antennae === 'cyber' && instructions.wingPattern === 'circuit', 0.35);
        add('Rainbow Lightning + Glitch', instructions.lightningColor === 'rainbow' && effects.has('glitch'), 0.65);
        add('X-Ray Strike + Void Eyes', instructions.lightningType === 'strike' && instructions.eyeType === 'void', 0.55);
        add('Magma Core', instructions.skin === 'magma' && instructions.laserType !== 'none', 0.65);
        add('Lumberjack', instructions.skin === 'wood' && instructions.wingPattern === 'hex', 0.35);
        add('Storm Call + Lightning', instructions.callShape === 'storm-call' && effects.has('lightning'), 0.75);
        add('Thunder Organ + Skybreak', instructions.callVoice === 'thunder-organ' && instructions.thunderType === 'mythic-skybreak', 0.95);
        add('Mythic Sonic Richness', instructions.callRichness === 'mythic', 0.85);
        add('Cathedral Swarm', instructions.callShape === 'cathedral-swarm' && instructions.callRichness === 'mythic', 0.9);
        add('Glitch Voice + Wireframe', instructions.callVoice === 'bitcrush-click' && instructions.wireframe, 0.45);
        add('Ghost Whisper + Void', instructions.callVoice === 'ghost-whisper' && instructions.environment === 'void', 0.55);
        add('Melodic Aura', ['melodic-phrase', 'call-and-response', 'ritual-chant'].includes(instructions.callShape) && instructions.aura !== 'none', 0.42);
        return combos;
    }

    function pickPaletteMode(rng, isRarePlus, isEpicPlus, isLegendaryPlus) {
        return weightedPick(rng, TRAIT_WEIGHTS.paletteMode, ([value]) => {
            if (!isRarePlus && ['triadic', 'bone-gold', 'void-cipher'].includes(value)) return false;
            if (!isEpicPlus && ['bone-gold', 'void-cipher'].includes(value)) return false;
            if (!isLegendaryPlus && value === 'bone-gold') return false;
            return true;
        });
    }

    function pickMarkingLayer(rng, isRarePlus, isEpicPlus) {
        return weightedPick(rng, TRAIT_WEIGHTS.markingLayer, ([value]) => {
            if (!isRarePlus && value !== 'none') return false;
            if (!isEpicPlus && ['cipher-glyphs', 'coordinate-arcs'].includes(value)) return false;
            return true;
        });
    }

    function applyPaletteHarmony(instructions, rng, { isEpicPlus, isLegendaryPlus }) {
        const mode = instructions.paletteMode;
        const base = instructions.color;
        if (mode === 'mono-neon') {
            if (base === 'red') { instructions.eyeColor = 'crimson'; if (instructions.laserType !== 'none') instructions.laserColor = 'red'; }
            if (base === 'orange') { instructions.eyeColor = 'tangerine'; if (instructions.laserType !== 'none') instructions.laserColor = 'gold'; }
            if (base === 'green') { instructions.eyeColor = 'toxic'; if (instructions.laserType !== 'none') instructions.laserColor = 'green'; }
            if (base === 'cyan') { instructions.eyeColor = 'phantom'; if (instructions.laserType !== 'none') instructions.laserColor = 'cyan'; }
            if (base === 'blue') { instructions.eyeColor = 'phantom'; if (instructions.laserType !== 'none') instructions.laserColor = 'blue'; }
            if (base === 'purple') { instructions.eyeColor = 'phantom'; if (instructions.laserType !== 'none') instructions.laserColor = 'purple'; }
        } else if (mode === 'analogous') {
            const choices = ANALOG_NEIGHBORS[base] || ['cyan', 'purple'];
            instructions.eyeColor = choices.includes('green') ? 'toxic' : (choices.includes('orange') ? 'tangerine' : 'phantom');
            if (instructions.laserType !== 'none') instructions.laserColor = choices[0] === 'orange' ? 'gold' : (choices[0] === 'green' ? 'green' : choices[0]);
        } else if (mode === 'complementary') {
            const comp = COMPLEMENTARY_MAP[base] || 'cyan';
            instructions.eyeColor = comp === 'green' ? 'toxic' : (comp === 'orange' ? 'tangerine' : 'phantom');
            if (instructions.laserType !== 'none') instructions.laserColor = comp === 'orange' ? 'gold' : comp;
            if (!isLegendaryPlus && instructions.shellColor === 'gold') instructions.shellColor = 'obsidian';
        } else if (mode === 'triadic') {
            const triad = TRIAD_MAP[base] || ['blue', 'green'];
            instructions.eyeColor = triad[0] === 'green' ? 'toxic' : 'phantom';
            if (instructions.laserType !== 'none') instructions.laserColor = triad[1] === 'orange' ? 'gold' : triad[1];
            if (!isEpicPlus && instructions.color === 'rainbow') instructions.color = 'cyan';
        } else if (mode === 'bone-gold') {
            instructions.shellColor = rng() < 0.58 ? 'bone' : 'gold';
            instructions.eyeColor = rng() < 0.72 ? 'gold' : 'phantom';
            instructions.color = instructions.shellColor === 'gold' ? 'orange' : 'cyan';
            if (instructions.laserType !== 'none') instructions.laserColor = 'gold';
            if (!['wood', 'porcelain', 'none'].includes(instructions.skin)) instructions.skin = rng() < 0.6 ? 'porcelain' : 'wood';
            if (isLegendaryPlus && instructions.aura === 'none') instructions.aura = 'halo';
        } else if (mode === 'void-cipher') {
            instructions.shellColor = 'obsidian';
            instructions.eyeColor = rng() < 0.5 ? 'phantom' : 'void';
            instructions.color = rng() < 0.5 ? 'cyan' : 'purple';
            if (instructions.laserType !== 'none') instructions.laserColor = rng() < 0.5 ? 'cyan' : 'purple';
            if (!['carbon', 'static-noise', 'none', 'synthwave'].includes(instructions.skin)) instructions.skin = rng() < 0.7 ? 'carbon' : 'static-noise';
            if (isEpicPlus) instructions.environment = 'void';
        }
        return instructions;
    }

    function applyCompatibilityRules(instructions, rng, { isRarePlus, isEpicPlus }) {
        if (instructions.shellColor === 'bone' && ['magma', 'synthwave'].includes(instructions.skin)) {
            instructions.skin = rng() < 0.6 ? 'porcelain' : 'none';
        }
        if (instructions.wingPattern === 'circuit' && instructions.antennae === 'none') {
            instructions.antennae = rng() < 0.72 ? 'cyber' : 'classic';
        }
        if (instructions.wingPattern === 'corrupt' && !(instructions.effects || []).includes('glitch') && isEpicPlus) {
            instructions.effects = [...new Set([...(instructions.effects || []), 'glitch'])];
        }
        if (instructions.markingLayer === 'cipher-glyphs' && instructions.abdomen === 'smooth') {
            instructions.abdomen = rng() < 0.5 ? 'glyph' : 'barcode';
        }
        if (instructions.markingLayer !== 'none' && instructions.wingPattern === 'glass' && isEpicPlus && rng() < 0.35) {
            instructions.wingPattern = 'stellar';
        }
        return instructions;
    }

    function applyPostRankCompatibility(instructions, rank) {
        if (rank <= 165 && instructions.motionField === '3301-beacon') {
            instructions.primeSet = '11-13-17';
            instructions.ambientField = 'prime-ash';
            if (!instructions.markingLayer || instructions.markingLayer === 'none') instructions.markingLayer = 'cipher-glyphs';
        }
        if (rank <= 165 && instructions.motionField === 'ulam-spiral' && instructions.markingLayer === 'none') instructions.markingLayer = 'prime-ticks';
        if (rank <= 165 && instructions.motionField === 'prime-interference' && instructions.markingLayer === 'none') instructions.markingLayer = 'coordinate-arcs';
        if (rank <= 165 && instructions.motionField === 'prime-grid' && instructions.markingLayer === 'none') instructions.markingLayer = 'hash-fragments';
        if (rank <= 165 && instructions.motionField === 'prime-bloom' && instructions.markingLayer === 'none') instructions.markingLayer = 'residue-dots';
        if (rank <= 165 && instructions.motionField === 'prime-pulse' && instructions.markingLayer === 'none') instructions.markingLayer = 'prime-ticks';
        if (rank <= 33 && instructions.paletteMode === 'void-cipher' && instructions.markingLayer === 'none') instructions.markingLayer = 'coordinate-arcs';
        if (instructions.motionField === 'none') instructions.primeSet = 'none';
        return instructions;
    }


    // Rank-tier visual budget pass.  The scoring pass can surface visually loud traits in
    // lower rarity pages, so this final deterministic presentation pass keeps each gallery
    // tier readable without changing collection size or rank boundaries.
    const NATURAL_COMMON_COLORS = Object.freeze(['green', 'blue', 'red', 'orange']);
    const NATURAL_UNCOMMON_COLORS = Object.freeze(['green', 'blue', 'red', 'orange', 'cyan']);
    const COMMON_SHELLS = Object.freeze(['emerald', 'obsidian', 'cobalt']);
    const UNCOMMON_SHELLS = Object.freeze(['emerald', 'obsidian', 'cobalt', 'amethyst']);
    const COMMON_ABDOMENS = Object.freeze(['smooth', 'ribbed', 'plating']);
    const UNCOMMON_ABDOMENS = Object.freeze(['smooth', 'ribbed', 'plating', 'barcode', 'banded-straight', 'banded-curved']);
    const LOW_TIER_SKINS = Object.freeze(['none', 'carbon', 'camo', 'wood']);
    const RARE_WINGS = Object.freeze(['hex', 'circuit']);
    const EPIC_WINGS = Object.freeze(['circuit', 'hex', 'prism', 'stellar']);
    const LEGENDARY_WINGS = Object.freeze(['circuit', 'hex', 'prism', 'stellar', 'corrupt']);
    const RARE_MARKINGS = Object.freeze(['prime-ticks', 'residue-dots', 'hash-fragments']);
    const EPIC_MARKINGS = Object.freeze(['prime-ticks', 'residue-dots', 'hash-fragments', 'cipher-glyphs', 'coordinate-arcs']);
    const NORMAL_WING_VEINS = Object.freeze(['clean', 'faint-veins', 'soft-veins', 'structured-veins']);
    const NORMAL_WING_TINTS = Object.freeze(['clear', 'smoke-grey', 'warm-amber', 'olive-smoke', 'cool-blue-grey']);
    const NORMAL_WING_EDGES = Object.freeze(['clean-edge', 'soft-nicks', 'minor-fray', 'tiny-tears']);
    const NORMAL_WING_VEIN_WEIGHTS = Object.freeze({
        Common: Object.freeze([['clean', 45], ['faint-veins', 40], ['soft-veins', 15], ['structured-veins', 0]]),
        Uncommon: Object.freeze([['clean', 20], ['faint-veins', 38], ['soft-veins', 32], ['structured-veins', 10]]),
        Rare: Object.freeze([['clean', 10], ['faint-veins', 28], ['soft-veins', 42], ['structured-veins', 20]])
    });
    const NORMAL_WING_TINT_WEIGHTS = Object.freeze({
        Common: Object.freeze([['clear', 55], ['smoke-grey', 25], ['warm-amber', 12], ['olive-smoke', 5], ['cool-blue-grey', 3]]),
        Uncommon: Object.freeze([['clear', 30], ['smoke-grey', 28], ['warm-amber', 18], ['olive-smoke', 12], ['cool-blue-grey', 12]]),
        Rare: Object.freeze([['clear', 15], ['smoke-grey', 25], ['warm-amber', 20], ['olive-smoke', 20], ['cool-blue-grey', 20]])
    });
    const NORMAL_WING_EDGE_WEIGHTS = Object.freeze({
        Common: Object.freeze([['clean-edge', 85], ['soft-nicks', 15], ['minor-fray', 0], ['tiny-tears', 0]]),
        Uncommon: Object.freeze([['clean-edge', 55], ['soft-nicks', 30], ['minor-fray', 15], ['tiny-tears', 0]]),
        Rare: Object.freeze([['clean-edge', 30], ['soft-nicks', 35], ['minor-fray', 25], ['tiny-tears', 10]])
    });

    const ABDOMEN_VARIANT_WEIGHTS = Object.freeze({
        Common: Object.freeze([['balanced', 40], ['thin-bands', 20], ['wide-bands', 20], ['offset-bands', 10], ['centre-spine', 7], ['broken-bands', 3], ['double-spine', 0], ['asymmetric-left', 0], ['asymmetric-right', 0]]),
        Uncommon: Object.freeze([['balanced', 20], ['thin-bands', 16], ['wide-bands', 16], ['offset-bands', 16], ['centre-spine', 12], ['double-spine', 8], ['broken-bands', 6], ['asymmetric-left', 3], ['asymmetric-right', 3]]),
        Rare: Object.freeze([['balanced', 10], ['thin-bands', 12], ['wide-bands', 12], ['offset-bands', 14], ['centre-spine', 14], ['double-spine', 12], ['broken-bands', 10], ['asymmetric-left', 8], ['asymmetric-right', 8]])
    });
    const ANTENNAE_VARIANT_WEIGHTS = Object.freeze({
        Common: Object.freeze([['standard', 50], ['swept', 25], ['high-arch', 15], ['wide-spread', 10], ['hooked-tips', 0], ['sensor-tips', 0]]),
        Uncommon: Object.freeze([['standard', 25], ['swept', 20], ['high-arch', 20], ['wide-spread', 15], ['hooked-tips', 10], ['sensor-tips', 10]]),
        Rare: Object.freeze([['standard', 16], ['swept', 18], ['high-arch', 18], ['wide-spread', 16], ['hooked-tips', 16], ['sensor-tips', 16]])
    });

    function choiceFor(seed, rank, salt, values) {
        const rng = mulberry32((seedToState(seed) ^ salt ^ Math.imul(rank || seed, 2654435761)) >>> 0);
        return values[Math.floor(rng() * values.length)] || values[0];
    }

    function coerceVisual(value, allowed, seed, rank, salt) {
        return allowed.includes(value) ? value : choiceFor(seed, rank, salt, allowed);
    }

    function weightedChoiceFor(seed, rank, salt, weighted) {
        const rng = mulberry32((seedToState(seed) ^ salt ^ Math.imul(rank || seed, 2246822519)) >>> 0);
        return weightedPick(rng, weighted, ([, weight]) => weight > 0);
    }

    function normalWingTierKey(tier) {
        return NORMAL_WING_VEIN_WEIGHTS[tier] ? tier : 'Rare';
    }

    function assignNormalWingVeins(instructions, seed, rank, tier) {
        if (instructions.wingPattern !== 'glass') {
            instructions.normalWingVeins = 'none';
            return instructions;
        }
        const allowed = NORMAL_WING_VEIN_WEIGHTS[normalWingTierKey(tier)] || NORMAL_WING_VEIN_WEIGHTS.Uncommon;
        instructions.normalWingVeins = weightedChoiceFor(seed, rank, 0x9E1A5000, allowed);
        return instructions;
    }

    function assignNormalWingTint(instructions, seed, rank, tier) {
        if (instructions.wingPattern !== 'glass') {
            instructions.normalWingTint = 'none';
            return instructions;
        }
        const allowed = NORMAL_WING_TINT_WEIGHTS[normalWingTierKey(tier)] || NORMAL_WING_TINT_WEIGHTS.Uncommon;
        instructions.normalWingTint = weightedChoiceFor(seed, rank, 0x9E1A5100, allowed);
        return instructions;
    }

    function assignNormalWingEdge(instructions, seed, rank, tier) {
        if (instructions.wingPattern !== 'glass') {
            instructions.normalWingEdge = 'none';
            return instructions;
        }
        const allowed = NORMAL_WING_EDGE_WEIGHTS[normalWingTierKey(tier)] || NORMAL_WING_EDGE_WEIGHTS.Uncommon;
        instructions.normalWingEdge = weightedChoiceFor(seed, rank, 0x9E1A5200, allowed);
        return instructions;
    }

    function assignNormalWingDetails(instructions, seed, rank, tier) {
        assignNormalWingVeins(instructions, seed, rank, tier);
        assignNormalWingTint(instructions, seed, rank, tier);
        assignNormalWingEdge(instructions, seed, rank, tier);
        return instructions;
    }


    function enhancedTierKey(tier) {
        return ABDOMEN_VARIANT_WEIGHTS[tier] ? tier : 'Rare';
    }

    function assignAbdomenVariant(instructions, seed, rank, tier) {
        const allowed = ABDOMEN_VARIANT_WEIGHTS[enhancedTierKey(tier)] || ABDOMEN_VARIANT_WEIGHTS.Uncommon;
        instructions.abdomenVariant = weightedChoiceFor(seed, rank, 0xABD00011, allowed);
        return instructions;
    }
    function assignEyeDetail(instructions, seed, rank, tier) {
        instructions.eyeDetail = 'plain';
        instructions.eyeStyle = instructions.eyeStyle || 'none';
        instructions.eyeStyleColor = instructions.eyeStyleColor || 'match-eye';
        return instructions;
    }

    function assignAntennaeVariant(instructions, seed, rank, tier) {
        if (!instructions.antennae || instructions.antennae === 'none') {
            instructions.antennaeVariant = 'none';
            return instructions;
        }
        const allowed = ANTENNAE_VARIANT_WEIGHTS[enhancedTierKey(tier)] || ANTENNAE_VARIANT_WEIGHTS.Uncommon;
        instructions.antennaeVariant = weightedChoiceFor(seed, rank, 0xA117EA11, allowed);
        return instructions;
    }

    function assignLayerEnhancementVariants(instructions, seed, rank, tier) {
        assignAbdomenVariant(instructions, seed, rank, tier);
        assignEyeDetail(instructions, seed, rank, tier);
        assignAntennaeVariant(instructions, seed, rank, tier);
        return instructions;
    }

    function tierNameForRank(rank) {
        return tierForRank(rank);
    }

    function stripEventLayers(instructions) {
        instructions.effects = [];
        instructions.laserType = 'none';
        instructions.laserColor = 'none';
        instructions.lightningType = 'none';
        instructions.lightningColor = 'none';
        instructions.thunderType = 'none';
        instructions.aura = 'none';
        instructions.motionField = 'none';
        instructions.primeSet = 'none';
        instructions.ambientField = 'none';
        instructions.markingLayer = 'none';
        instructions.wireframe = false;
        return instructions;
    }

    function makeNaturalTier(instructions, seed, rank, tier) {
        const isCommon = tier === 'Common';
        stripEventLayers(instructions);
        instructions.wingPattern = 'glass';
        instructions.wingShape = 'classic';
        instructions.paletteMode = isCommon
            ? coerceVisual(instructions.paletteMode || 'mono-neon', ['mono-neon', 'analogous'], seed, rank, 0xA11CE01)
            : coerceVisual(instructions.paletteMode || 'analogous', ['mono-neon', 'analogous', 'complementary'], seed, rank, 0xA11CE02);
        instructions.color = coerceVisual(instructions.color, isCommon ? NATURAL_COMMON_COLORS : NATURAL_UNCOMMON_COLORS, seed, rank, 0xA11CE03);
        instructions.shellColor = coerceVisual(instructions.shellColor, isCommon ? COMMON_SHELLS : UNCOMMON_SHELLS, seed, rank, 0xA11CE04);
        instructions.eyeType = isCommon ? 'classic' : coerceVisual(instructions.eyeType, ['classic', 'void'], seed, rank, 0xA11CE05);
        instructions.eyeColor = coerceVisual(instructions.eyeColor, ['crimson', 'tangerine', 'toxic', 'phantom'], seed, rank, 0xA11CE06);
        instructions.eyeBehavior = 'static';
        instructions.abdomen = coerceVisual(instructions.abdomen, isCommon ? COMMON_ABDOMENS : UNCOMMON_ABDOMENS, seed, rank, 0xA11CE07);
        instructions.skin = coerceVisual(instructions.skin || 'none', LOW_TIER_SKINS, seed, rank, 0xA11CE08);
        instructions.environment = coerceVisual(instructions.environment, ['studio', 'cave', 'canyon'], seed, rank, 0xA11CE09);
        instructions.antennae = isCommon ? coerceVisual(instructions.antennae, ['none', 'classic'], seed, rank, 0xA11CE0A) : coerceVisual(instructions.antennae, ['none', 'classic', 'moth', 'cyber'], seed, rank, 0xA11CE0B);
        assignLayerEnhancementVariants(instructions, seed, rank, tier);
        instructions.legs = isCommon ? 'organic' : coerceVisual(instructions.legs, ['organic', 'mecha'], seed, rank, 0xA11CE0C);
        assignNormalWingDetails(instructions, seed, rank, tier);
        return instructions;
    }

    function makeRareTier(instructions, seed, rank) {
        makeNaturalTier(instructions, seed, rank, 'Uncommon');
        const accent = choiceFor(seed, rank, 0x51A7E001, ['wing', 'wing', 'marking', 'abdomen', 'skin']);
        if (accent === 'wing') {
            instructions.wingPattern = choiceFor(seed, rank, 0x51A7E002, RARE_WINGS);
        } else if (accent === 'marking') {
            instructions.markingLayer = choiceFor(seed, rank, 0x51A7E003, RARE_MARKINGS);
        } else if (accent === 'abdomen') {
            instructions.abdomen = choiceFor(seed, rank, 0x51A7E004, ['glyph', 'banded-straight', 'banded-curved', 'twotone-straight']);
        } else if (accent === 'skin') {
            instructions.skin = choiceFor(seed, rank, 0x51A7E006, ['hazard', 'polka']);
        }
        assignLayerEnhancementVariants(instructions, seed, rank, 'Rare');
        instructions.eyeStyle = 'none';
        instructions.eyeStyleColor = 'match-eye';
        assignNormalWingDetails(instructions, seed, rank, 'Rare');
        return instructions;
    }

    function visualLayerCount(instructions) {
        const effects = new Set(instructions.effects || []);
        return [
            instructions.wingPattern && instructions.wingPattern !== 'glass',
            instructions.markingLayer && instructions.markingLayer !== 'none',
            instructions.aura && instructions.aura !== 'none',
            instructions.motionField && instructions.motionField !== 'none',
            instructions.ambientField && instructions.ambientField !== 'none',
            effects.size > 0 || instructions.laserType !== 'none',
            instructions.wireframe,
            ['glyph', 'rainbow-straight', 'rainbow-curved', 'twotone-straight', 'twotone-curved', 'oil-slick-bands', 'molten-cracks', 'neon-cells'].includes(instructions.abdomen),
            ['hazard', 'polka', 'synthwave', 'magma', 'iridescent', 'circuit-tattoo', 'static-noise'].includes(instructions.skin),
            instructions.color === 'rainbow',
            instructions.eyeBehavior && instructions.eyeBehavior !== 'static'
        ].filter(Boolean).length;
    }

    function makeEpicTier(instructions, seed, rank) {
        instructions.effects = (instructions.effects || []).filter(effect => effect !== 'lightning');
        instructions.lightningType = 'none';
        instructions.lightningColor = 'none';
        instructions.thunderType = 'none';
        instructions.wingPattern = coerceVisual(instructions.wingPattern, EPIC_WINGS, seed, rank, 0xE91C0001);
        if (!instructions.markingLayer || instructions.markingLayer === 'none') instructions.markingLayer = choiceFor(seed, rank, 0xE91C0002, EPIC_MARKINGS);
        if (visualLayerCount(instructions) < 2) instructions.eyeBehavior = 'breathe';
        if (visualLayerCount(instructions) < 2) instructions.skin = choiceFor(seed, rank, 0xE91C0003, ['hazard', 'polka', 'synthwave']);
        assignLayerEnhancementVariants(instructions, seed, rank, 'Rare');
        instructions.eyeStyle = 'orbit-dots';
        instructions.eyeStyleColor = choiceFor(seed, rank, 0xE91C0004, ['match-eye', 'gold', 'ember', 'toxic', 'cyan', 'phantom', 'crimson']);
        assignNormalWingDetails(instructions, seed, rank, 'Epic');
        return instructions;
    }

    function makeLegendaryTier(instructions, seed, rank, mythic = false) {
        instructions.wingPattern = coerceVisual(instructions.wingPattern, mythic ? ['stellar', 'corrupt', 'prism'] : LEGENDARY_WINGS, seed, rank, 0x1E6E0001);
        if (!instructions.markingLayer || instructions.markingLayer === 'none') instructions.markingLayer = choiceFor(seed, rank, 0x1E6E0002, EPIC_MARKINGS);
        if (!instructions.aura || instructions.aura === 'none') instructions.aura = mythic ? 'orbit' : choiceFor(seed, rank, 0x1E6E0003, ['halo', 'orbit']);
        if (!instructions.motionField || instructions.motionField === 'none') instructions.motionField = mythic ? MYTHIC_MOTION_FIELD : motionFieldForSeed(seed, rank);
        if (!instructions.primeSet || instructions.primeSet === 'none') instructions.primeSet = mythic ? '11-13-17' : primeSetForSeed(seed, rank);
        if (!instructions.ambientField || instructions.ambientField === 'none') instructions.ambientField = mythic ? 'prime-ash' : ambientFieldForSeed(seed, rank);
        if (mythic) {
            instructions.color = instructions.color === 'rainbow' ? 'rainbow' : choiceFor(seed, rank, 0x33010001, ['rainbow', 'cyan', 'purple']);
            instructions.markingLayer = instructions.markingLayer === 'none' ? 'cipher-glyphs' : instructions.markingLayer;
            instructions.eyeBehavior = instructions.eyeBehavior === 'static' ? 'rgb' : instructions.eyeBehavior;
        }
        assignLayerEnhancementVariants(instructions, seed, rank, 'Rare');
        instructions.eyeStyle = 'orbit-dots';
        instructions.eyeStyleColor = mythic
            ? choiceFor(seed, rank, 0x1E6E0004, ['rainbow', 'gold', 'phantom', 'violet', 'cyan'])
            : choiceFor(seed, rank, 0x1E6E0004, ['gold', 'ember', 'phantom', 'violet', 'cyan', 'match-eye']);
        assignNormalWingDetails(instructions, seed, rank, mythic ? 'Mythic' : 'Legendary');
        return instructions;
    }

    function applyVisualRarityPolicy(instructions, rank) {
        const tier = tierNameForRank(rank);
        instructions.rarityTier = tier;
        if (tier === 'Common') return makeNaturalTier(instructions, instructions.seed, rank, 'Common');
        if (tier === 'Uncommon') return makeNaturalTier(instructions, instructions.seed, rank, 'Uncommon');
        if (tier === 'Rare') return makeRareTier(instructions, instructions.seed, rank);
        if (tier === 'Epic') return makeEpicTier(instructions, instructions.seed, rank);
        if (tier === 'Legendary') return makeLegendaryTier(instructions, instructions.seed, rank, false);
        if (tier === 'Mythic') return makeLegendaryTier(instructions, instructions.seed, rank, true);
        return instructions;
    }

    export function generateInstructionsFromSeed(seed) {
        const seedNumber = clampSeed(seed);
        const rng = mulberry32(seedToState(seedNumber));

        // Generate a master power level (0.0 to 1.0) to strictly gate higher tiers
        const powerLevel = rng();
        const isRarePlus = powerLevel >= 0.55;       // Top 45%
        const isEpicPlus = powerLevel >= 0.85;       // Top 15%
        const isLegendaryPlus = powerLevel >= 0.95;  // Top 5%
        const isMythicPower = powerLevel >= 0.985;   // Top 1.5% sonic gate

        const effects = [];
        let hasLightning = rollPercent(rng, EFFECT_WEIGHTS.lightning);
        let hasGhost = rollPercent(rng, EFFECT_WEIGHTS.ghost);
        let hasGlitch = rollPercent(rng, EFFECT_WEIGHTS.glitch);

        // Enforce strict visual separation: no movement or background traits unless Epic+
        if (!isEpicPlus) {
            hasGlitch = false;
            hasGhost = false;
        }
        if (!isLegendaryPlus) hasLightning = false; // Lightning strictly Legendary+

        if (hasGhost && hasGlitch && rng() > 0.15) hasGlitch = false;

        let lightningType = 'none';
        let lightningColor = 'none';
        let thunderType = 'none';

        if (hasLightning) {
            effects.push('lightning');
            lightningType = weightedPick(rng, TRAIT_WEIGHTS.lightningType);
            lightningColor = weightedPick(rng, TRAIT_WEIGHTS.lightningColor);
            thunderType = weightedPick(rng, TRAIT_WEIGHTS.thunderType, ([v]) => {
                if (!isMythicPower && v === 'mythic-skybreak') return false;
                if (!isLegendaryPlus && ['sub-impact', 'rolling-storm', 'cavern-boom'].includes(v)) return false;
                return true;
            });
        }

        if (hasGhost) effects.push('ghost');
        if (hasGlitch) effects.push('glitch');

        const laserType = weightedPick(rng, TRAIT_WEIGHTS.laserType, ([v]) => isLegendaryPlus || v === 'none');
        let eyeColor = weightedPick(rng, TRAIT_WEIGHTS.eyeColor);
        const eyeType = weightedPick(rng, TRAIT_WEIGHTS.eyeType);
        if (eyeType === 'cyclops' && eyeColor === 'void') {
            eyeColor = weightedPick(rng, TRAIT_WEIGHTS.eyeColor, ([v]) => v !== 'void');
        }

        const size = rounded(72 + rng() * 18, 2);
        const rotation = rounded((rng() - 0.5) * 18, 2);
        const xOffset = rounded((rng() - 0.5) * 6, 2);
        const yOffset = rounded((rng() - 0.5) * 4, 2);
        const hueShift = Math.round((rng() - 0.5) * 28);
        const brightness = rounded(0.92 + rng() * 0.2, 2);

        const callRichness = weightedPick(rng, TRAIT_WEIGHTS.callRichness, ([v]) => {
            if (!isRarePlus && !['plain', 'textured'].includes(v)) return false;
            if (!isEpicPlus && ['harmonic', 'storm', 'mythic'].includes(v)) return false;
            if (!isLegendaryPlus && ['storm', 'mythic'].includes(v)) return false;
            if (!isMythicPower && v === 'mythic') return false;
            return true;
        });

        const callShape = weightedPick(rng, TRAIT_WEIGHTS.callShape, ([v]) => {
            if (!isRarePlus && !['single-chirp', 'double-chirp', 'morse-clicks', 'steady-drone', 'trill-burst'].includes(v)) return false;
            if (!isEpicPlus && ['call-and-response', 'swarm-stack', 'ritual-chant', 'glitch-code', 'storm-call', 'eclipse-chorus', 'cathedral-swarm', 'lightning-oracle'].includes(v)) return false;
            if (!isLegendaryPlus && ['ritual-chant', 'glitch-code', 'storm-call', 'eclipse-chorus', 'cathedral-swarm', 'lightning-oracle'].includes(v)) return false;
            if (!isMythicPower && ['eclipse-chorus', 'cathedral-swarm', 'lightning-oracle'].includes(v)) return false;
            if (v === 'storm-call' && !hasLightning) return false;
            if (v === 'lightning-oracle' && !hasLightning) return false;
            return true;
        });

        const callVoice = weightedPick(rng, TRAIT_WEIGHTS.callVoice, ([v]) => {
            if (!isRarePlus && ['metallic-ring', 'glass-harmonic', 'sub-organ', 'bitcrush-click', 'fm-insect', 'choir-formant', 'ghost-whisper', 'laser-squeal', 'thunder-organ'].includes(v)) return false;
            if (!isEpicPlus && ['bitcrush-click', 'fm-insect', 'choir-formant', 'ghost-whisper', 'laser-squeal', 'thunder-organ'].includes(v)) return false;
            if (!isLegendaryPlus && ['thunder-organ'].includes(v)) return false;
            if (v === 'ghost-whisper' && !hasGhost && !isLegendaryPlus) return false;
            if (v === 'laser-squeal' && laserType === 'none') return false;
            if (v === 'thunder-organ' && !hasLightning) return false;
            return true;
        });

        const callRhythm = weightedPick(rng, TRAIT_WEIGHTS.callRhythm, ([v]) => {
            if (!isRarePlus && ['random-walk', 'accelerando', 'ritardando'].includes(v)) return false;
            if (!isEpicPlus && ['accelerando', 'ritardando'].includes(v)) return false;
            return true;
        });

        const instructions = {
            seed: seedNumber,
            color: weightedPick(rng, TRAIT_WEIGHTS.color, ([v]) => {
                if (!isEpicPlus && v === 'rainbow') return false;
                if (!isRarePlus && ['cyan', 'purple'].includes(v)) return false;
                return true;
            }),
            shellColor: weightedPick(rng, TRAIT_WEIGHTS.shellColor, ([v]) => {
                if (!isLegendaryPlus && v === 'gold') return false;
                if (!isRarePlus && v === 'amethyst') return false;
                return true;
            }),
            flying: false,
            wireframe: weightedPick(rng, TRAIT_WEIGHTS.wireframe, ([v]) => isEpicPlus || v === false),
            motionField: 'none',
            primeSet: 'none',
            ambientField: 'none',
            effects,
            wingPattern: weightedPick(rng, TRAIT_WEIGHTS.wingPattern, ([v]) => {
                if (isLegendaryPlus && v === 'glass') return false;
                if (!isRarePlus && v !== 'glass') return false;
                if (!isEpicPlus && (v === 'stellar' || v === 'prism')) return false;
                if (!isLegendaryPlus && v === 'corrupt') return false;
                return true;
            }),
            wingShape: weightedPick(rng, TRAIT_WEIGHTS.wingShape, ([v]) => {
                if (!isRarePlus && v !== 'classic') return false;
                return true;
            }),
            normalWingVeins: 'clean',
            normalWingTint: 'clear',
            normalWingEdge: 'clean-edge',
            antennae: weightedPick(rng, TRAIT_WEIGHTS.antennae),
            antennaeVariant: 'none',
            environment: weightedPick(rng, TRAIT_WEIGHTS.environment, ([v]) => isEpicPlus || v !== 'void'),
            eyeType,
            eyeColor,
            eyeBehavior: weightedPick(rng, TRAIT_WEIGHTS.eyeBehavior, ([v]) => isEpicPlus || v === 'static'),
            laserType,
            laserColor: laserType === 'none' ? 'none' : weightedPick(rng, TRAIT_WEIGHTS.laserColor),
            lightningType,
            lightningColor,
            thunderType,
            songRhythm: weightedPick(rng, TRAIT_WEIGHTS.songRhythm, ([v]) => isEpicPlus || !['choir', 'cicada-call'].includes(v)),
            callType: weightedPick(rng, TRAIT_WEIGHTS.callType, ([v]) => {
                if (!isRarePlus && ['trill', 'melody', 'chordal', 'chaotic'].includes(v)) return false;
                if (!isEpicPlus && ['chordal', 'chaotic'].includes(v)) return false;
                if (!isLegendaryPlus && v === 'chaotic') return false;
                return true;
            }),
            callShape,
            callVoice,
            callRhythm,
            callRichness,
            abdomen: weightedPick(rng, TRAIT_WEIGHTS.abdomen),
            abdomenVariant: 'balanced',
            skin: weightedPick(rng, TRAIT_WEIGHTS.skin, ([v]) => {
                if (!isRarePlus && ['hazard', 'polka'].includes(v)) return false;
                if (!isEpicPlus && ['synthwave', 'magma'].includes(v)) return false;
                return true;
            }),
            paletteMode: pickPaletteMode(rng, isRarePlus, isEpicPlus, isLegendaryPlus),
            markingLayer: pickMarkingLayer(rng, isRarePlus, isEpicPlus),
            aura: weightedPick(rng, TRAIT_WEIGHTS.aura, ([v]) => isLegendaryPlus || v === 'none'),
            legs: weightedPick(rng, TRAIT_WEIGHTS.legs),
            size,
            rotation,
            xOffset,
            yOffset,
            hueShift,
            brightness
        };
        applyPaletteHarmony(instructions, rng, { isEpicPlus, isLegendaryPlus });
        applyCompatibilityRules(instructions, rng, { isRarePlus, isEpicPlus });
        return instructions;
    }

    function tierForRank(rank) {
        const tier = RARITY_TIERS.find(item => rank <= item.maxRank);
        return tier ? tier.name : 'Common';
    }

    function countTrait(counts, category, value) {
        if (!counts[category]) counts[category] = {};
        const key = String(value);
        counts[category][key] = (counts[category][key] || 0) + 1;
    }

    function formatPercent(count) {
        return rounded((count / COLLECTION_SIZE) * 100, 2);
    }

    function maxBy(items, selector) {
        return items.reduce((best, item) => !best || selector(item) > selector(best) ? item : best, null);
    }

    let collectionMetadataCache = null;

    // v11: the full collection build is expressed as a single generator so the
    // EXACT same computation can run either synchronously (getCollectionMetadata)
    // or chunked across animation frames (buildCollectionMetadataAsync) without
    // duplicating logic. Output is byte-identical to v10.4.0 either way.
    const INDEX_CHUNK = 256;
    function* collectionMetadataSteps() {
        const rawItems = [];
        const traitCounts = {};
        const comboCounts = {};

        for (let seed = 1; seed <= COLLECTION_SIZE; seed++) {
            const instructions = generateInstructionsFromSeed(seed);
            const traits = instructionTraits(instructions);
            const combos = activeCombos(instructions);
            rawItems.push({ seed, instructions, traits, combos });

            for (const [category, value] of Object.entries(traits)) countTrait(traitCounts, category, value);
            for (const combo of combos) comboCounts[combo.name] = (comboCounts[combo.name] || 0) + 1;
            if (seed % INDEX_CHUNK === 0) yield { phase: 'generate', done: seed, total: COLLECTION_SIZE };
        }

        const items = [];
        for (let i = 0; i < rawItems.length; i++) {
            const item = rawItems[i];
            const traitBreakdown = Object.entries(item.traits).map(([category, value]) => {
                const count = traitCounts[category][String(value)];
                const points = rounded(COLLECTION_SIZE / count, 4);
                return { category, value, count, percentage: formatPercent(count), points };
            });

            const comboBreakdown = item.combos.map(combo => {
                const count = comboCounts[combo.name] || 0;
                const points = count ? rounded((COLLECTION_SIZE / count) * combo.weight, 4) : 0;
                return { name: combo.name, count, percentage: count ? formatPercent(count) : 0, points };
            });

            const baseScore = traitBreakdown.reduce((sum, trait) => sum + trait.points, 0);
            const comboScore = comboBreakdown.reduce((sum, combo) => sum + combo.points, 0);
            const rarityScore = rounded(baseScore + comboScore, 4);
            const rarestTrait = maxBy(traitBreakdown, it => it.points);
            const rarestCombo = maxBy(comboBreakdown, it => it.points);

            items.push({
                seed: item.seed,
                rarityScore,
                traits: item.traits,
                traitBreakdown,
                comboBreakdown,
                rarestTrait,
                rarestCombo,
                instructions: item.instructions
            });
            if ((i + 1) % INDEX_CHUNK === 0) yield { phase: 'score', done: i + 1, total: rawItems.length };
        }

        items.sort((a, b) => b.rarityScore - a.rarityScore || a.seed - b.seed);
        yield { phase: 'rank', done: 0, total: items.length };
        items.forEach((item, index) => {
            item.rank = index + 1;
            item.rarityTier = tierForRank(item.rank);
            item.instructions.motionField = item.rank <= 165 ? motionFieldForSeed(item.seed, item.rank) : 'none';
            item.instructions.primeSet = item.rank <= 165 ? primeSetForSeed(item.seed, item.rank) : 'none';
            item.instructions.ambientField = item.rank <= 165 ? ambientFieldForSeed(item.seed, item.rank) : 'none';
            applyPostRankCompatibility(item.instructions, item.rank);
            applyVisualRarityPolicy(item.instructions, item.rank);
        });
        yield { phase: 'rank', done: items.length, total: items.length };

        // The visual policy is rank-aware, so rebuild visible traits and summaries after it runs.
        const finalTraitCounts = {};
        const finalComboCounts = {};
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // Acoustic identity is assigned post-rank (like the Prime Engine) so
            // the established visual rarity ordering of the collection is preserved
            // while every seed still carries a complete deterministic sound genome.
            item.soundIdentity = soundIdentitySummaryForSeed(item.seed, item.rarityTier);
            item.instructions.soundTier = item.rarityTier;
            if (!item.instructions.barkBackdrop) item.instructions.barkBackdrop = barkBackdropForSeed(item.seed);
            if (!item.instructions.barkPlacement) item.instructions.barkPlacement = barkPlacementForSeed(item.seed);
            item.barkFamily = barkFamilyForSeed(item.seed);
            item.traits = {
                ...instructionTraits(item.instructions),
                'Acoustic Family': item.soundIdentity.family,
                'Rhythm Genome': item.soundIdentity.rhythmShape,
                'Pulse Group': item.soundIdentity.pulseGroup,
                'Extreme Gene': item.soundIdentity.extremeGene,
                'Motion Rig': item.soundIdentity.rig,
                'Bark Backdrop': barkBackdropLabel(item.instructions.barkBackdrop),
                'Bark Family': barkFamilyLabel(barkFamilyForSeed(item.seed))
            };
            item.combos = activeCombos(item.instructions);
            for (const [category, value] of Object.entries(item.traits)) countTrait(finalTraitCounts, category, value);
            for (const combo of item.combos) finalComboCounts[combo.name] = (finalComboCounts[combo.name] || 0) + 1;
            if ((i + 1) % INDEX_CHUNK === 0) yield { phase: 'identity', done: i + 1, total: items.length };
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.traitBreakdown = Object.entries(item.traits).map(([category, value]) => {
                const count = finalTraitCounts[category][String(value)];
                const points = rounded(COLLECTION_SIZE / count, 4);
                return { category, value, count, percentage: formatPercent(count), points };
            });
            item.comboBreakdown = item.combos.map(combo => {
                const count = finalComboCounts[combo.name] || 0;
                const points = count ? rounded((COLLECTION_SIZE / count) * combo.weight, 4) : 0;
                return { name: combo.name, count, percentage: count ? formatPercent(count) : 0, points };
            });
            item.rarestTrait = maxBy(item.traitBreakdown, trait => trait.points);
            item.rarestCombo = maxBy(item.comboBreakdown, combo => combo.points);
            if ((i + 1) % INDEX_CHUNK === 0) yield { phase: 'finalize', done: i + 1, total: items.length };
        }

        const bySeed = {};
        for (const item of items) bySeed[item.seed] = item;
        const seedItems = items.slice().sort((a, b) => a.seed - b.seed);

        const rankings = items.map(item => ({
            seed: item.seed,
            rank: item.rank,
            rarityTier: item.rarityTier,
            rarityScore: item.rarityScore,
            rarestTrait: item.rarestTrait,
            rarestCombo: item.rarestCombo
        }));

        const traitsSummary = Object.fromEntries(Object.entries(finalTraitCounts).map(([category, values]) => [
            category,
            Object.entries(values)
                .map(([value, count]) => ({ value, count, percentage: formatPercent(count) }))
                .sort((a, b) => b.count - a.count || String(a.value).localeCompare(String(b.value)))
        ]));

        const comboSummary = Object.entries(finalComboCounts)
            .map(([name, count]) => ({ name, count, percentage: formatPercent(count) }))
            .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));

        collectionMetadataCache = { items, seedItems, bySeed, rankings, traitsSummary, comboSummary, traitCounts: finalTraitCounts, comboCounts: finalComboCounts };
        return collectionMetadataCache;
    }

    export function getCollectionMetadata() {
        if (collectionMetadataCache) return collectionMetadataCache;
        const gen = collectionMetadataSteps();
        let result = gen.next();
        while (!result.done) result = gen.next();
        return collectionMetadataCache;
    }

    // v11: non-blocking collection index. Runs the identical generator but yields
    // to the event loop between chunks so the UI can paint a progress state and
    // stay responsive instead of freezing on first load. onProgress receives
    // { phase, done, total } updates. Resolves with the same cache object.
    export async function buildCollectionMetadataAsync(onProgress) {
        if (collectionMetadataCache) {
            onProgress?.({ phase: 'done', done: COLLECTION_SIZE, total: COLLECTION_SIZE });
            return collectionMetadataCache;
        }
        const yieldToLoop = () => new Promise(resolve => {
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
            else setTimeout(resolve, 0);
        });
        const gen = collectionMetadataSteps();
        let result = gen.next();
        while (!result.done) {
            if (result.value && onProgress) onProgress(result.value);
            await yieldToLoop();
            result = gen.next();
        }
        onProgress?.({ phase: 'done', done: COLLECTION_SIZE, total: COLLECTION_SIZE });
        return collectionMetadataCache;
    }

    export function getRenderInstructionsForSeed(seed) {
        const metadata = getCollectionMetadata().bySeed[clampSeed(seed)];
        return metadata ? { ...metadata.instructions } : generateInstructionsFromSeed(seed);
    }

    export function getMetadataForSeed(seed) {
        return getCollectionMetadata().bySeed[clampSeed(seed)];
    }

    export function getMetadataJSON() {
        const metadata = getCollectionMetadata();
        return metadata.seedItems.map(item => ({
            seed: item.seed,
            rank: item.rank,
            rarityTier: item.rarityTier,
            rarityScore: item.rarityScore,
            motionField: item.instructions.motionField || 'none',
            primeSet: item.instructions.primeSet || 'none',
            ambientField: item.instructions.ambientField || 'none',
            paletteMode: item.instructions.paletteMode || 'mono-neon',
            markingLayer: item.instructions.markingLayer || 'none',
            traits: item.traits,
            soundIdentity: item.soundIdentity,
            rarestTrait: item.rarestTrait,
            rarestCombo: item.rarestCombo
        }));
    }

    export function getMetadataCSV() {
        const metadata = getCollectionMetadata();
        const columns = [
            'seed', 'rank', 'rarityTier', 'rarityScore',
            'color', 'shellColor', 'wingPattern', 'wingShape', 'normalWingVeins', 'normalWingTint', 'normalWingEdge', 'antennae', 'antennaeVariant', 'environment', 'eyeType', 'eyeColor', 'eyeBehavior', 'eyeStyle', 'eyeStyleColor', 'abdomen', 'abdomenVariant',
            'laserType', 'laserColor', 'songRhythm', 'callType', 'callShape', 'callVoice', 'callRhythm', 'callRichness', 'skin', 'paletteMode', 'markingLayer', 'aura', 'legs', 'wireframe', 'motionField', 'primeSet', 'ambientField',
            'effects', 'lightningType', 'lightningColor', 'thunderType',
            'barkBackdrop', 'barkFamily',
            'acousticFamily', 'soundMotif', 'rhythmShape', 'pulseGroup', 'extremeGene', 'motionRig', 'carrierHz', 'pulseHz',
            'rarestTrait', 'rarestTraitPercentage', 'rarestCombo', 'rarestComboPercentage'
        ];
        const escape = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const rows = [columns.join(',')];
        for (const item of metadata.seedItems) {
            const inst = item.instructions;
            rows.push([
                item.seed, item.rank, item.rarityTier, item.rarityScore,
                inst.color, inst.shellColor, inst.wingPattern, inst.wingShape, inst.normalWingVeins || 'clean', inst.normalWingTint || 'clear', inst.normalWingEdge || 'clean-edge', inst.antennae, inst.antennaeVariant || (inst.antennae === 'none' ? 'none' : 'standard'), inst.environment, inst.eyeType, inst.eyeColor, inst.eyeBehavior, inst.eyeStyle || 'none', inst.eyeStyleColor || 'match-eye', inst.abdomen, inst.abdomenVariant || 'balanced',
                inst.laserType, inst.laserColor, inst.songRhythm, inst.callType, inst.callShape, inst.callVoice, inst.callRhythm, inst.callRichness, inst.skin, inst.paletteMode || 'mono-neon', inst.markingLayer || 'none', inst.aura, inst.legs, inst.wireframe ? 'yes' : 'no', inst.motionField || 'none', inst.primeSet || 'none', inst.ambientField || 'none',
                (inst.effects || []).join('|') || 'none', inst.lightningType, inst.lightningColor, inst.thunderType,
                inst.barkBackdrop || 'none', item.barkFamily || 'none',
                item.soundIdentity?.family, item.soundIdentity?.motif, item.soundIdentity?.rhythmShape, item.soundIdentity?.pulseGroup,
                item.soundIdentity?.extremeGene, item.soundIdentity?.rig, item.soundIdentity?.carrierHz, item.soundIdentity?.pulseHz,
                item.rarestTrait ? `${item.rarestTrait.category}: ${item.rarestTrait.value}` : '',
                item.rarestTrait ? item.rarestTrait.percentage : '',
                item.rarestCombo ? item.rarestCombo.name : '',
                item.rarestCombo ? item.rarestCombo.percentage : ''
            ].map(escape).join(','));
        }
        return rows.join('\n');
    }
