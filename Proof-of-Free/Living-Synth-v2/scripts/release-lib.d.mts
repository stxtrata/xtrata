export const COLLECTION_SIZE: number;
export const SEED_PROTOCOL: "proof-of-free/seed";
export const SEED_VERSION: 2;
export const ENGINE_MIME: "text/javascript";
export const SEED_MIME: "text/html";
export const WAVEFORMS: readonly ["sine", "triangle", "sawtooth", "square"];
export const PALETTES: readonly [
  "Infrared", "Ember", "Amber", "Solar",
  "Lime", "Verdant", "Aqua", "Cyan",
  "Azure", "Cobalt", "Violet", "Ultraviolet",
  "Magenta", "Rose", "Silver", "Lunar"
];
export const ROOT_NOTES: readonly [
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2",
  "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3"
];
export const ENGINE_PATH: string;

export type ProofOfFreeTraits = {
  profile: number;
  hue: number;
  palette: typeof PALETTES[number];
  rootNote: typeof ROOT_NOTES[number];
  rootMidi: number;
  waveform: "sine" | "triangle" | "sawtooth" | "square";
};

export type ReleaseChild = {
  edition: number;
  file: string;
  mimeType: string;
  bytes: Buffer;
  byteLength: number;
  sha256: string;
  traits: ProofOfFreeTraits;
  dependencies: string[];
  parents: string[];
};

export type RecursiveReleaseManifest = {
  protocol: "proof-of-free/recursive-release";
  version: 2;
  collectionSize: number;
  engine: {
    id: string;
    file: string;
    src: string;
    mimeType: string;
    byteLength: number;
    sha256: string;
  };
  children: Omit<ReleaseChild, "bytes">[];
};

export function sha256(bytes: Uint8Array | string): string;
export function readCanonicalEngine(): Promise<Buffer>;
export function validateEngineId(value: string | number | bigint): bigint;
export function canonicalEngineSrc(engineId: string | number | bigint): string;
export function deriveTraits(edition: number): ProofOfFreeTraits;
export function traitProfileKey(traits: ProofOfFreeTraits): string;
export function seedPayload(edition: number, engineId: string | number | bigint): {
  protocol: "proof-of-free/seed";
  version: 2;
  edition: number;
  engineId: number;
  traits: ProofOfFreeTraits;
};
export function buildSeedHtml(
  edition: number,
  engineId: string | number | bigint,
  engineSrc?: string
): string;
export function parseSeedHtml(html: string): {
  payload: Record<string, unknown>;
  engineSrc: string;
};
export function validateSeedHtml(
  html: string,
  expected: { edition: number; engineId: string | number | bigint }
): ReturnType<typeof parseSeedHtml>;
export function buildReleaseModel(engineId: string | number | bigint): Promise<{
  engine: Buffer;
  children: ReleaseChild[];
  manifest: RecursiveReleaseManifest;
}>;
