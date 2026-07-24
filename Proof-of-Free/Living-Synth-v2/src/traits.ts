export const COLLECTION_SIZE = 1_024;

export const WAVEFORMS = ["sine", "triangle", "sawtooth", "square"] as const;
export const PALETTES = [
  "Infrared", "Ember", "Amber", "Solar",
  "Lime", "Verdant", "Aqua", "Cyan",
  "Azure", "Cobalt", "Violet", "Ultraviolet",
  "Magenta", "Rose", "Silver", "Lunar"
] as const;
export const ROOT_NOTES = [
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2",
  "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3"
] as const;

export type ProofOfFreeTraits = {
  profile: number;
  hue: number;
  palette: typeof PALETTES[number];
  rootNote: typeof ROOT_NOTES[number];
  rootMidi: number;
  waveform: typeof WAVEFORMS[number];
};

export function deriveTraits(edition: number): ProofOfFreeTraits {
  if (!Number.isInteger(edition) || edition < 1 || edition > COLLECTION_SIZE) {
    throw new Error(`Edition must be between 1 and ${COLLECTION_SIZE}.`);
  }

  // An odd multiplier is invertible modulo 1,024, so every edition maps to a
  // different 10-bit profile. The profile's 4 × 16 × 16 categorical tuple is
  // therefore collision-free, while the hue is also unique per edition.
  const slot = (((edition - 1) * 733) + 421) & 1_023;
  const waveform = WAVEFORMS[slot & 3];
  const rootIndex = (slot >>> 2) & 15;
  const paletteIndex = (slot >>> 6) & 15;

  return {
    profile: slot + 1,
    hue: Number(((slot * 360) / COLLECTION_SIZE).toFixed(6)),
    palette: PALETTES[paletteIndex],
    rootNote: ROOT_NOTES[rootIndex],
    rootMidi: 36 + rootIndex,
    waveform
  };
}

export function traitProfileKey(traits: ProofOfFreeTraits) {
  return `${traits.palette}|${traits.rootNote}|${traits.waveform}`;
}
