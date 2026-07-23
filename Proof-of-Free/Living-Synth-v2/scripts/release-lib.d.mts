export const COLLECTION_SIZE: number;
export const SEED_PROTOCOL: "proof-of-free/seed";
export const SEED_VERSION: 2;
export const ENGINE_MIME: "text/javascript";
export const SEED_MIME: "text/html";
export const ENGINE_PATH: string;

export type ReleaseChild = {
  edition: number;
  file: string;
  mimeType: string;
  bytes: Buffer;
  byteLength: number;
  sha256: string;
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
export function seedPayload(edition: number, engineId: string | number | bigint): {
  protocol: "proof-of-free/seed";
  version: 2;
  edition: number;
  engineId: number;
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
