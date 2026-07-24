#!/usr/bin/env node
/* Living Synth v4 — deterministic collection builder & verifier.
 * usage: node scripts/build-collection.mjs [--engine-id N] [--seeds]
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
const engineId = Number(args[args.indexOf("--engine-id") + 1] || 0) || 0;
const emitSeeds = args.includes("--seeds");
const sha256 = data => createHash("sha256").update(data).digest("hex");

/* Pass 1 — engine artifact (concatenate the three immutable sources). */
const engineSource = [
  "packages/genome/genome.js",
  "packages/performance-codec/performance-codec.js",
  "engine/engine-core.js"
].map(p => readFileSync(join(rootDir, p), "utf8")).join("\n");
mkdirSync(join(rootDir, "artifacts"), { recursive: true });
writeFileSync(join(rootDir, "artifacts/proof-of-free-engine-v4.js"), engineSource);

/* Pass 2 — genomes, invariants, seeds, manifest. */
const seedHtml = (edition, genomeHash) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proof of Free ${String(edition).padStart(4, "0")}</title></head><body>
<script id="pof-seed" type="application/json">${JSON.stringify({
  protocol: "proof-of-free/seed", version: 4, edition, engineId, engineVersion: G.ENGINE_VERSION, genomeHash
})}</script>
<script src="/i/${engineId}"></script>
</body></html>`;

const items = [];
const hashes = new Set();
const familyCounts = {}, roleCounts = {}, animCounts = {};
for (let edition = 1; edition <= G.COLLECTION_SIZE; edition++) {
  const genome = G.deriveGenome(edition);
  if (G.stableStringify(genome) !== G.stableStringify(G.deriveGenome(edition))) throw new Error(`Edition ${edition} is non-deterministic.`);
  const melody = G.deriveMelody(genome);
  if (melody.length === 0) throw new Error(`Edition ${edition} is silent.`);
  const genomeHash = G.genomeHash(genome);
  if (hashes.has(genomeHash)) throw new Error(`Genome hash collision at edition ${edition}.`);
  hashes.add(genomeHash);
  const m = genome.mosaic;
  familyCounts[m.family] = (familyCounts[m.family] || 0) + 1;
  roleCounts[m.role] = (roleCounts[m.role] || 0) + 1;
  animCounts[genome.animation.kind] = (animCounts[genome.animation.kind] || 0) + 1;

  const html = seedHtml(edition, genomeHash);
  if (emitSeeds) {
    mkdirSync(join(rootDir, "release/seeds"), { recursive: true });
    writeFileSync(join(rootDir, `release/seeds/proof-of-free-${String(edition).padStart(4, "0")}.html`), html);
  }
  items.push({
    edition, filename: `proof-of-free-${String(edition).padStart(4, "0")}.html`, mime: "text/html",
    bytes: Buffer.byteLength(html), sha256: sha256(html), genomeHash,
    family: m.family, role: m.role, color: m.color, gridX: m.gridX, gridY: m.gridY,
    animation: genome.animation.kind, word: genome.animation.word, rootNote: genome.rootNote, noteCount: melody.length
  });
}

const manifest = {
  collectionId: G.COLLECTION_ID, engineVersion: G.ENGINE_VERSION, engineId,
  engine: { filename: "proof-of-free-engine-v4.js", mime: "text/javascript", bytes: Buffer.byteLength(engineSource), sha256: sha256(engineSource) },
  music: G.MUSIC, grid: G.GRID, logoMask: G.LOGO_MASK, familyCounts, roleCounts, animCounts, items
};
mkdirSync(join(rootDir, "manifests"), { recursive: true });
writeFileSync(join(rootDir, "manifests/collection-v4.json"), JSON.stringify(manifest, null, 1));

console.log(`engine   ${manifest.engine.bytes} bytes  sha256 ${manifest.engine.sha256}`);
console.log(`seeds    ${items.length} unique genome hashes ${hashes.size}`);
console.log(`families ${JSON.stringify(familyCounts)}`);
console.log(`roles    ${JSON.stringify(roleCounts)}`);
console.log(`anims    ${JSON.stringify(animCounts)}`);
console.log(`manifest manifests/collection-v4.json${emitSeeds ? " · seeds in release/seeds/" : ""}`);
