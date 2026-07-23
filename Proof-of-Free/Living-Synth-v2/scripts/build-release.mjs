import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildReleaseModel } from "./release-lib.mjs";

const engineIdIndex = process.argv.indexOf("--engine-id");
if (engineIdIndex < 0 || !process.argv[engineIdIndex + 1]) {
  throw new Error("Usage: npm run release:build -- --engine-id <sealed-engine-id>");
}

const outputIndex = process.argv.indexOf("--output");
const output = resolve(process.cwd(), outputIndex >= 0 ? process.argv[outputIndex + 1] : "release");
const model = await buildReleaseModel(process.argv[engineIdIndex + 1]);

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "engine"), { recursive: true });
await mkdir(resolve(output, "seeds"), { recursive: true });
await writeFile(resolve(output, model.manifest.engine.file), model.engine);
for (const child of model.children) await writeFile(resolve(output, child.file), child.bytes);
await writeFile(resolve(output, "manifest-recursive.json"), `${JSON.stringify(model.manifest, null, 2)}\n`);

console.log(JSON.stringify({
  output,
  engineId: model.manifest.engine.id,
  engineSha256: model.manifest.engine.sha256,
  seeds: model.children.length,
  uniqueSeedHashes: new Set(model.children.map(child => child.sha256)).size
}));
