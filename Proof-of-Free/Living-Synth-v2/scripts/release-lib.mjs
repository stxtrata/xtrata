import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const COLLECTION_SIZE = 1_024;
export const SEED_PROTOCOL = "proof-of-free/seed";
export const SEED_VERSION = 2;
export const ENGINE_MIME = "text/javascript";
export const SEED_MIME = "text/html";
export const ENGINE_PATH = fileURLToPath(
  new URL("../artifacts/proof-of-free-engine.js", import.meta.url)
);

export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

export async function readCanonicalEngine() {
  return readFile(ENGINE_PATH);
}

export function validateEngineId(value) {
  const id = typeof value === "bigint" ? value : BigInt(String(value));
  if (id < 0n || id > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Engine inscription ID must be a non-negative safe integer.");
  }
  return id;
}

export function canonicalEngineSrc(engineId) {
  return `/i/${validateEngineId(engineId)}`;
}

export function seedPayload(edition, engineId) {
  if (!Number.isInteger(edition) || edition < 1 || edition > COLLECTION_SIZE) {
    throw new Error(`Edition must be between 1 and ${COLLECTION_SIZE}.`);
  }
  return {
    protocol: SEED_PROTOCOL,
    version: SEED_VERSION,
    edition,
    engineId: Number(validateEngineId(engineId))
  };
}

export function buildSeedHtml(edition, engineId, engineSrc = canonicalEngineSrc(engineId)) {
  const payload = seedPayload(edition, engineId);
  if (engineSrc !== canonicalEngineSrc(engineId)) {
    throw new Error(`Engine source must be ${canonicalEngineSrc(engineId)}.`);
  }
  const serial = String(edition).padStart(4, "0");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Proof of Free #${serial}</title></head><body><script id="pof-seed" type="application/json">${JSON.stringify(payload)}</script><script src="${engineSrc}"></script></body></html>`;
}

export function parseSeedHtml(html) {
  if (typeof html !== "string" || !html.startsWith("<!doctype html>")) {
    throw new Error("Seed must start with the canonical HTML doctype.");
  }
  const payloadMatch = html.match(
    /<script id="pof-seed" type="application\/json">([^<]+)<\/script>/
  );
  const sourceMatch = html.match(/<script src="([^"]+)"><\/script>/);
  if (!payloadMatch || !sourceMatch) throw new Error("Seed structure is invalid.");
  return { payload: JSON.parse(payloadMatch[1]), engineSrc: sourceMatch[1] };
}

export function validateSeedHtml(html, expected) {
  const parsed = parseSeedHtml(html);
  const expectedPayload = seedPayload(expected.edition, expected.engineId);
  if (
    parsed.payload.protocol !== expectedPayload.protocol ||
    parsed.payload.version !== expectedPayload.version ||
    parsed.payload.edition !== expectedPayload.edition ||
    parsed.payload.engineId !== expectedPayload.engineId
  ) {
    throw new Error("Seed identity does not match the expected edition and engine.");
  }
  if (parsed.engineSrc !== canonicalEngineSrc(expected.engineId)) {
    throw new Error("Seed does not use the canonical recursive engine route.");
  }
  if (html !== buildSeedHtml(expected.edition, expected.engineId)) {
    throw new Error("Seed bytes are not canonical.");
  }
  return parsed;
}

export async function buildReleaseModel(engineId) {
  const normalizedId = validateEngineId(engineId);
  const engine = await readCanonicalEngine();
  const children = Array.from({ length: COLLECTION_SIZE }, (_, index) => {
    const edition = index + 1;
    const bytes = Buffer.from(buildSeedHtml(edition, normalizedId), "utf8");
    return {
      edition,
      file: `seeds/proof-of-free-${String(edition).padStart(4, "0")}.html`,
      mimeType: SEED_MIME,
      bytes,
      byteLength: bytes.length,
      sha256: sha256(bytes),
      dependencies: [normalizedId.toString()],
      parents: []
    };
  });
  return {
    engine,
    children,
    manifest: {
      protocol: "proof-of-free/recursive-release",
      version: 2,
      collectionSize: COLLECTION_SIZE,
      engine: {
        id: normalizedId.toString(),
        file: "engine/proof-of-free-engine.js",
        src: canonicalEngineSrc(normalizedId),
        mimeType: ENGINE_MIME,
        byteLength: engine.length,
        sha256: sha256(engine)
      },
      children: children.map(({ bytes: _bytes, ...entry }) => entry)
    }
  };
}
