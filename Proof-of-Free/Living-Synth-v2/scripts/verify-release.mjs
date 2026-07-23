import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { buildReleaseModel, sha256, validateSeedHtml } from "./release-lib.mjs";

const outputIndex = process.argv.indexOf("--output");
const output = resolve(process.cwd(), outputIndex >= 0 ? process.argv[outputIndex + 1] : "release");
const manifest = JSON.parse(await readFile(resolve(output, "manifest-recursive.json"), "utf8"));
const expected = await buildReleaseModel(manifest.engine.id);
if (JSON.stringify(manifest) !== JSON.stringify(expected.manifest)) {
  throw new Error("Release manifest is not the canonical deterministic manifest.");
}

const engine = await readFile(resolve(output, manifest.engine.file));
if (sha256(engine) !== manifest.engine.sha256) throw new Error("Engine hash mismatch.");
const files = await readdir(resolve(output, "seeds"));
if (files.length !== expected.children.length) throw new Error("Seed file count mismatch.");

for (const child of expected.children) {
  const bytes = await readFile(resolve(output, child.file));
  if (sha256(bytes) !== child.sha256) throw new Error(`Hash mismatch for edition ${child.edition}.`);
  validateSeedHtml(bytes.toString("utf8"), { edition: child.edition, engineId: manifest.engine.id });
}

console.log(JSON.stringify({
  verified: true,
  engineId: manifest.engine.id,
  seeds: expected.children.length,
  uniqueSeedHashes: new Set(expected.children.map(child => child.sha256)).size
}));
