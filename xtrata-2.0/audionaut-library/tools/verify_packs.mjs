import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto"; import { pathToFileURL } from "node:url";
// usage: node verify_packs.mjs <packsDir> <codec-flac.mjs>
import { readAudpack } from "./audpack-reader.mjs";
const [packsDir, codecPath] = process.argv.slice(2);
const { createDecoder } = await import(pathToFileURL(path.resolve(codecPath)).href);
const dec = await createDecoder({ verify: true });
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const packs = fs.readdirSync(`${packsDir}`).filter((f) => f.endsWith(".audpack")).map((f) => f.slice(0, -8)).sort();
let n = 0, bad = 0, bytes = 0, ms = 0, samples = 0; const rows = [];
for (const p of packs) {
  const file = fs.readFileSync(`${packsDir}/${p}.audpack`);
  const man = JSON.parse(fs.readFileSync(`${packsDir}/${p}.manifest.json`));
  const orig = JSON.parse(fs.readFileSync(`${packsDir}/${p}.pcmhashes.json`));
  let pbad = 0;
  if (sha(file) !== man.container.sha256 || file.length !== man.container.bytes) { pbad++; console.log(p, "container hash/size mismatch"); }
  const { index, bytesFor } = await readAudpack(new Uint8Array(file.buffer, file.byteOffset, file.length));
  if (index.sounds.length !== man.count) { pbad++; console.log(p, "count mismatch"); }
  for (const s of index.sounds) {
    const b = bytesFor(s); n++; bytes += b.length;
    if (sha(b) !== s.sha256) { pbad++; console.log(p, s.id, "stored-bytes sha mismatch"); continue; }
    const t0 = performance.now(); let r;
    try { r = await dec.decodeInt(b); } catch (e) { pbad++; console.log(p, s.id, "decode error:", e.message); continue; }
    ms += performance.now() - t0; samples += r.length;
    const pcm = Buffer.from(Int16Array.from(r.data[0]).buffer);
    if (r.length !== s.samples || r.channels !== 1 || r.sampleRate !== 44100 || r.bitsPerSample !== 16) { pbad++; console.log(p, s.id, "format/length mismatch"); continue; }
    const h = sha(pcm);
    if (h !== s.pcmSha256 || h !== orig[s.id]) { pbad++; console.log(p, s.id, "decoded PCM != original PCM"); }
  }
  bad += pbad; rows.push([p, index.sounds.length, pbad]);
}
console.log(`\n${n} sounds in ${packs.length} packs; ${n - rows.reduce((a, r) => a + r[2], 0) >= 0 ? "" : ""}failures: ${bad}`);
console.log(`decoded ${(samples / 44100 / 60).toFixed(1)} min of audio in ${ms.toFixed(0)} ms = ${(samples / 44100 / (ms / 1000)).toFixed(0)}x realtime (JS decoder, CRC verify on)`);
console.log("per pack failures:", rows.filter((r) => r[2]).map((r) => r.join(":")).join(", ") || "none");
