#!/usr/bin/env node
/* Living Synth v3 — deterministic collection builder & verifier.
 *
 * usage:
 *   node scripts/build-collection.mjs
 *   node scripts/build-collection.mjs --engine-id N --seeds
 *     --controller SP...proof-of-free-v1 --registry-url https://... --master
 *
 * Two-pass, machine-independent build (v2's model, streamlined):
 *  1. concatenate genome + codec + engine core into the immutable artifact;
 *  2. derive all 1,024 genomes, verify collection invariants, emit manifest
 *     (and optionally the 1,024 canonical seed HTML files).
 * Given the same sources and engine ID, output is byte-identical.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const G = require(join(rootDir, "packages/genome/genome.js"));

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const rawEngineId = option("--engine-id");
const engineId = rawEngineId === undefined ? 0 : Number(rawEngineId);
const emitSeeds = args.includes("--seeds");
const emitMaster = args.includes("--master");
const controllerContract = option("--controller");
const registryUrl = option("--registry-url");
const campaignId = Number(option("--campaign-id") ?? 0);
if (!Number.isSafeInteger(engineId) || engineId < 0) throw new Error("--engine-id must be a non-negative safe integer.");
if ((emitSeeds || emitMaster) && engineId <= 0) throw new Error("Release HTML requires --engine-id with the confirmed engine inscription ID.");
if (emitMaster && (!controllerContract || !registryUrl)) throw new Error("--master requires --controller and --registry-url.");
if (controllerContract && !/^S[PT][A-Z0-9]{38,40}\.[a-z0-9-]+$/.test(controllerContract)) throw new Error("--controller is not a valid contract ID.");
if (registryUrl && !/^https:\/\//.test(registryUrl)) throw new Error("--registry-url must use HTTPS.");
if (!Number.isSafeInteger(campaignId) || campaignId < 0) throw new Error("--campaign-id must be a non-negative safe integer.");
const sha256 = data => createHash("sha256").update(data).digest("hex");

/* Pass 1 — engine artifact. */
const engineSource = [
  "packages/genome/genome.js",
  "packages/performance-codec/performance-codec.js",
  "engine/engine-core.js"
].map(p => readFileSync(join(rootDir, p), "utf8")).join("\n");
mkdirSync(join(rootDir, "artifacts"), { recursive: true });
writeFileSync(join(rootDir, "artifacts/proof-of-free-engine-v3.js"), engineSource);
const engineSha256 = sha256(engineSource);

/* Pass 2 — genomes, invariants, seeds, manifest. */
const seedHtml = (edition, genomeHash) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proof of Free ${String(edition).padStart(4, "0")}</title></head><body>
<script id="pof-seed" type="application/json">${JSON.stringify({
  protocol: "proof-of-free/seed",
  version: 3,
  edition,
  engineId,
  engineVersion: G.ENGINE_VERSION,
  genomeHash
})}</script>
<script src="/i/${engineId}"></script>
</body></html>`;

const masterHtml = () => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proof of Free — Claimed Mosaic</title></head><body>
<script id="pof-master" type="application/json">${JSON.stringify({
  protocol: "proof-of-free/master",
  version: 3,
  engineId,
  engineSha256,
  controllerContract,
  campaignId,
  registryUrl
})}</script>
<script src="/i/${engineId}"></script>
</body></html>`;

const items = [];
const hashes = new Set(), tuples = new Set(), hues = new Set();
const roleCounts = {};
for (let edition = 1; edition <= G.COLLECTION_SIZE; edition++) {
  const genome = G.deriveGenome(edition);
  const again = G.deriveGenome(edition);
  if (G.stableStringify(genome) !== G.stableStringify(again)) {
    throw new Error(`Edition ${edition} is non-deterministic.`);
  }
  const melody = G.deriveMelody(genome);
  if (melody.length === 0) throw new Error(`Edition ${edition} is silent.`);
  const genomeHash = G.genomeHash(genome);
  const tuple = `${genome.mosaic.palette}|${genome.toneClass}|${genome.oscillator.typeA}`;
  if (hashes.has(genomeHash)) throw new Error(`Genome hash collision at edition ${edition}.`);
  if (tuples.has(tuple)) throw new Error(`Trait tuple collision at edition ${edition}: ${tuple}`);
  if (hues.has(genome.mosaic.hue)) throw new Error(`Hue collision at edition ${edition}.`);
  hashes.add(genomeHash); tuples.add(tuple); hues.add(genome.mosaic.hue);
  roleCounts[genome.mosaic.role] = (roleCounts[genome.mosaic.role] || 0) + 1;

  const html = seedHtml(edition, genomeHash);
  if (emitSeeds) {
    mkdirSync(join(rootDir, "release/seeds"), { recursive: true });
    writeFileSync(join(rootDir, `release/seeds/proof-of-free-${String(edition).padStart(4, "0")}.html`), html);
  }
  items.push({
    edition,
    filename: `proof-of-free-${String(edition).padStart(4, "0")}.html`,
    mime: "text/html",
    bytes: Buffer.byteLength(html),
    sha256: sha256(html),
    genomeHash,
    mosaic: genome.mosaic,
    rootNote: genome.rootNote,
    noteCount: melody.length
  });
}

const manifest = {
  collectionId: G.COLLECTION_ID,
  engineVersion: G.ENGINE_VERSION,
  engineId,
  engine: {
    filename: "proof-of-free-engine-v3.js",
    mime: "text/javascript",
    bytes: Buffer.byteLength(engineSource),
    sha256: engineSha256
  },
  controllerContract: controllerContract || null,
  campaignId,
  music: G.MUSIC,
  grid: G.GRID,
  roleCounts,
  items
};
mkdirSync(join(rootDir, "manifests"), { recursive: true });
writeFileSync(join(rootDir, "manifests/collection-v3.json"), JSON.stringify(manifest, null, 1));
if (emitMaster) {
  mkdirSync(join(rootDir, "release"), { recursive: true });
  const html = masterHtml();
  writeFileSync(join(rootDir, "release/proof-of-free-master.html"), html);
  console.log(`master  ${Buffer.byteLength(html)} bytes  release/proof-of-free-master.html`);
}

console.log(`engine  ${manifest.engine.bytes} bytes  sha256 ${manifest.engine.sha256}`);
console.log(`seeds   ${items.length} unique (hashes ${hashes.size}, tuples ${tuples.size}, hues ${hues.size})`);
console.log(`roles   ${JSON.stringify(roleCounts)}`);
console.log(`manifest manifests/collection-v3.json${emitSeeds ? " · seeds in release/seeds/" : ""}`);
