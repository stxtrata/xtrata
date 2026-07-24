#!/usr/bin/env node
/* Living Synth v5 — deterministic collection builder & verifier.
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
writeFileSync(join(rootDir, "artifacts/proof-of-free-engine-v5.js"), engineSource);

/* Pass 2 — genomes, invariants, seeds, manifest. */
const seedHtml = (edition, genomeHash) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proof of Free ${String(edition).padStart(4, "0")}</title></head><body>
<script id="pof-seed" type="application/json">${JSON.stringify({
  protocol: "proof-of-free/seed", version: 5, edition, engineId, engineVersion: G.ENGINE_VERSION, genomeHash
})}</script>
<script src="/i/${engineId}"></script>
</body></html>`;

const items = [];
const hashes = new Set();
const familyCounts = {}, roleCounts = {}, animCounts = {}, loopCounts = {}; let drumTiles = 0, totalHits = 0;
for (let edition = 1; edition <= G.COLLECTION_SIZE; edition++) {
  const genome = G.deriveGenome(edition);
  if (G.stableStringify(genome) !== G.stableStringify(G.deriveGenome(edition))) throw new Error(`Edition ${edition} is non-deterministic.`);
  const melody = genome.mosaic.role === "drum" ? [] : G.deriveMelody(genome);
  if (genome.mosaic.role !== "drum" && melody.length === 0) throw new Error(`Edition ${edition} is silent.`);
  const drumPattern = G.deriveDrumPattern(genome);
  if (genome.mosaic.role === "drum" && !drumPattern.some(Boolean)) throw new Error(`Drum edition ${edition} has an empty pattern.`);
  const genomeHash = G.genomeHash(genome);
  if (hashes.has(genomeHash)) throw new Error(`Genome hash collision at edition ${edition}.`);
  hashes.add(genomeHash);
  const m = genome.mosaic;
  familyCounts[m.family] = (familyCounts[m.family] || 0) + 1;
  roleCounts[m.role] = (roleCounts[m.role] || 0) + 1;
  animCounts[genome.animation.kind] = (animCounts[genome.animation.kind] || 0) + 1;
  loopCounts[genome.loopBars] = (loopCounts[genome.loopBars] || 0) + 1;
  if (genome.mosaic.role === "drum") { drumTiles++; totalHits += drumPattern.filter(Boolean).length; }

  const html = seedHtml(edition, genomeHash);
  if (emitSeeds) {
    mkdirSync(join(rootDir, "release/seeds"), { recursive: true });
    writeFileSync(join(rootDir, `release/seeds/proof-of-free-${String(edition).padStart(4, "0")}.html`), html);
  }
  items.push({
    edition, filename: `proof-of-free-${String(edition).padStart(4, "0")}.html`, mime: "text/html",
    bytes: Buffer.byteLength(html), sha256: sha256(html), genomeHash,
    family: m.family, role: m.role, color: m.color, gridX: m.gridX, gridY: m.gridY,
    animation: genome.animation.kind, word: genome.animation.word, rootNote: genome.rootNote, noteCount: melody.length,
    loopBars: genome.loopBars,
    drumType: genome.drum ? genome.drum.type : null,
    drumHits: genome.drum ? drumPattern.filter(Boolean).length : 0
  });
}

const manifest = {
  collectionId: G.COLLECTION_ID, engineVersion: G.ENGINE_VERSION, engineId,
  engine: { filename: "proof-of-free-engine-v5.js", mime: "text/javascript", bytes: Buffer.byteLength(engineSource), sha256: sha256(engineSource) },
  music: G.MUSIC, grid: G.GRID, xtrataMap: G.XTRATA_MAP, loopBars: G.LOOP_BARS, drumTypes: G.DRUM_TYPES,
  familyCounts, roleCounts, animCounts, loopCounts, drumTiles, items
};
mkdirSync(join(rootDir, "manifests"), { recursive: true });
writeFileSync(join(rootDir, "manifests/collection-v5.json"), JSON.stringify(manifest, null, 1));

/* Pass 3 — self-contained single-file demo: inline the engine into the shell.
 * `</script>` inside the engine text is escaped so the inline block can't be
 * closed early. Deterministic: same sources ⇒ byte-identical demo. */
const shell = readFileSync(join(rootDir, "apps/mosaic/mosaic.html"), "utf8");
const SRC_TAG = '<script src="../../artifacts/proof-of-free-engine-v5.js"></script>';
if (!shell.includes(SRC_TAG)) throw new Error("Shell is missing the engine <script src> tag to inline.");
const inlineEngine = `<script>\n${engineSource.replace(/<\/script>/gi, "<\\/script>")}\n</script>`;
const demo = shell.replace(SRC_TAG, inlineEngine);
writeFileSync(join(rootDir, "living-synth-v5-demo.html"), demo);

console.log(`engine   ${manifest.engine.bytes} bytes  sha256 ${manifest.engine.sha256}`);
console.log(`demo     living-synth-v5-demo.html ${Buffer.byteLength(demo)} bytes`);
console.log(`seeds    ${items.length} unique genome hashes ${hashes.size}`);
console.log(`families ${JSON.stringify(familyCounts)}`);
console.log(`roles    ${JSON.stringify(roleCounts)}`);
console.log(`anims    ${JSON.stringify(animCounts)}`);
console.log(`loops    ${JSON.stringify(loopCounts)} bars`);
console.log(`drums    ${drumTiles}/${items.length} tiles · ${totalHits} total hits`);
console.log(`manifest manifests/collection-v5.json${emitSeeds ? " · seeds in release/seeds/" : ""}`);
