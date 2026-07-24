import { deriveTraits, type ProofOfFreeTraits } from "./traits";

export const SEED_PROTOCOL = "proof-of-free/seed" as const;
export const SEED_VERSION = 2 as const;

export type ProofOfFreeSeed = {
  protocol: typeof SEED_PROTOCOL;
  version: typeof SEED_VERSION;
  edition: number;
  engineId: number;
  traits: ProofOfFreeTraits;
};

export function canonicalEngineSource(engineId: number) {
  if (!Number.isSafeInteger(engineId) || engineId < 0) throw new Error("Engine inscription ID is invalid.");
  return `/i/${engineId}`;
}

export function validateSeedHtml(
  html: string,
  expected: { edition: number; engineId: number }
): ProofOfFreeSeed {
  if (!html.startsWith("<!doctype html>")) throw new Error("Seed inscription is not canonical HTML.");
  const payloadMatch = html.match(
    /<script id="pof-seed" type="application\/json">([^<]+)<\/script>/
  );
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)];
  if (!payloadMatch || scripts.length !== 1) throw new Error("Seed inscription has an invalid structure.");
  let seed: ProofOfFreeSeed;
  try {
    seed = JSON.parse(payloadMatch[1]) as ProofOfFreeSeed;
  } catch {
    throw new Error("Seed inscription contains invalid JSON.");
  }
  if (
    seed.protocol !== SEED_PROTOCOL ||
    seed.version !== SEED_VERSION ||
    seed.edition !== expected.edition ||
    seed.engineId !== expected.engineId ||
    JSON.stringify(seed.traits) !== JSON.stringify(deriveTraits(expected.edition))
  ) {
    throw new Error("Seed inscription does not identify the selected edition, traits, and locked engine.");
  }
  if (scripts[0][1] !== canonicalEngineSource(expected.engineId)) {
    throw new Error("Seed inscription does not use the canonical recursive engine route.");
  }
  return seed;
}
