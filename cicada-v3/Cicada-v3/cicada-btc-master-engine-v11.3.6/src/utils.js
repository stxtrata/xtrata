// Small shared helpers used across the visual, audio, generation, and export modules.
export const numberOr = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
export const clamp01 = value => Math.max(0, Math.min(1, Number(value) || 0));
export const easeInOut = value => value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
export const lerp = (from, to, progress) => from + (to - from) * progress;
export const setAttributes = (element, attributes) => {
        for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    };
export const setProperties = (style, properties) => {
        for (const [name, value] of Object.entries(properties)) style.setProperty(name, value);
    };
export const connectChain = (...nodes) => {
        for (let index = 1; index < nodes.length; index++) nodes[index - 1].connect(nodes[index]);
    };

export function mulberry32(a) {
    return function random() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function rounded(value, places = 2) {
    const m = 10 ** places;
    return Math.round(value * m) / m;
}
