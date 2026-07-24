export type GesturePoint = {
  at: number;
  x: number;
  y: number;
  pressure: number;
  gate: "on" | "move" | "off";
};

export type LivingRecording = {
  protocol: "proof-of-free/living-recording";
  version: 1;
  parent: { xtrataContract: string; nftId: number; edition: number };
  engine: { sampleRate: number; loopMs: number; waveform: OscillatorType };
  gestures: GesturePoint[];
  createdAt: string;
};

export const MAX_RECORDING_BYTES = 262_144;
export const MAX_GESTURE_POINTS = 4_096;
export const MIN_LOOP_MS = 250;
export const MAX_LOOP_MS = 120_000;
const WAVEFORMS = new Set<OscillatorType>(["sine", "square", "sawtooth", "triangle"]);
const GATES = new Set<GesturePoint["gate"]>(["on", "move", "off"]);

export function createRecording(
  nftId: number,
  edition: number,
  loopMs: number,
  gestures: GesturePoint[],
  xtrataContract: string,
  sampleRate = 48_000
): LivingRecording {
  return {
    protocol: "proof-of-free/living-recording",
    version: 1,
    parent: { xtrataContract, nftId, edition },
    engine: { sampleRate, loopMs, waveform: "sawtooth" },
    gestures: gestures.map(point => ({
      ...point,
      at: Math.max(0, Math.round(point.at)),
      x: clamp(point.x),
      y: clamp(point.y),
      pressure: clamp(point.pressure)
    })),
    createdAt: new Date().toISOString()
  };
}

export function isLivingRecording(value: unknown): value is LivingRecording {
  try {
    validateLivingRecording(value);
    return true;
  } catch {
    return false;
  }
}

export function validateLivingRecording(
  value: unknown,
  expected?: { nftId: number; edition: number; xtrataContract: string }
): LivingRecording {
  if (!value || typeof value !== "object") throw new Error("Recording JSON must be an object.");
  const item = value as Partial<LivingRecording>;
  if (item.protocol !== "proof-of-free/living-recording" || item.version !== 1) {
    throw new Error("Unsupported recording protocol or version.");
  }
  if (!item.parent || !Number.isSafeInteger(item.parent.nftId) || item.parent.nftId < 0) {
    throw new Error("Recording NFT id is invalid.");
  }
  if (!Number.isSafeInteger(item.parent.edition) || item.parent.edition < 1 || item.parent.edition > 1024) {
    throw new Error("Recording edition is invalid.");
  }
  if (typeof item.parent.xtrataContract !== "string" || item.parent.xtrataContract.length < 3) {
    throw new Error("Recording Xtrata contract is invalid.");
  }
  if (expected && (
    item.parent.nftId !== expected.nftId ||
    item.parent.edition !== expected.edition ||
    item.parent.xtrataContract !== expected.xtrataContract
  )) {
    throw new Error("Recording JSON does not identify the selected NFT, edition, and Xtrata contract.");
  }
  if (!item.engine || !Number.isInteger(item.engine.sampleRate) || item.engine.sampleRate < 8_000 || item.engine.sampleRate > 192_000) {
    throw new Error("Recording sample rate is invalid.");
  }
  if (!Number.isInteger(item.engine.loopMs) || item.engine.loopMs < MIN_LOOP_MS || item.engine.loopMs > MAX_LOOP_MS) {
    throw new Error(`Recording loop must be ${MIN_LOOP_MS}–${MAX_LOOP_MS} ms.`);
  }
  if (!WAVEFORMS.has(item.engine.waveform)) throw new Error("Recording waveform is invalid.");
  if (!Array.isArray(item.gestures) || item.gestures.length === 0 || item.gestures.length > MAX_GESTURE_POINTS) {
    throw new Error(`Recording must contain 1–${MAX_GESTURE_POINTS} gesture points.`);
  }
  let previousAt = -1;
  for (const point of item.gestures) {
    if (!Number.isInteger(point.at) || point.at < previousAt || point.at > item.engine.loopMs) {
      throw new Error("Recording gesture times must be ordered inside the loop.");
    }
    if (![point.x, point.y, point.pressure].every(number => Number.isFinite(number) && number >= 0 && number <= 1)) {
      throw new Error("Recording gesture coordinates and pressure must be between 0 and 1.");
    }
    if (!GATES.has(point.gate)) throw new Error("Recording gesture gate is invalid.");
    previousAt = point.at;
  }
  if (typeof item.createdAt !== "string" || !Number.isFinite(Date.parse(item.createdAt))) {
    throw new Error("Recording creation date is invalid.");
  }
  return item as LivingRecording;
}

export function downloadRecording(recording: LivingRecording) {
  const blob = new Blob([JSON.stringify(recording)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `proof-of-free-${recording.parent.edition}-recording.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
