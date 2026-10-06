// Produce ready-to-review inscription payloads. This script never publishes.
const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto");
const dir = path.resolve(__dirname, ".."),
  root = path.join(dir, "media/onboard-v2"),
  m = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"))),
  dest = path.join(root, "publication");
fs.mkdirSync(dest, { recursive: true });
const manifest = {
  format: "audionaut-publication-package/1",
  libraryVersion: m.version,
  status: "local-unpublished",
  canonicalEnvironment: m.canonicalEnvironment,
  assets: [],
};
for (const family of Object.keys(m.families)) {
  const pack = JSON.parse(fs.readFileSync(path.join(root, family + ".json")));
  for (const [assetId, entry] of Object.entries(pack.entries)) {
    if (
      crypto
        .createHash("sha256")
        .update(Buffer.from(entry.audioData, "base64"))
        .digest("hex") !== m.assets[assetId]?.audioSha256
    )
      throw new Error(`Unverified publication asset: ${assetId}`);
    const name = assetId.replace(/[^\w.-]/g, "_") + ".json",
      data = JSON.stringify({ format: "audionaut-audio/2", ...entry });
    fs.writeFileSync(path.join(dest, name), data);
    manifest.assets.push({
      assetId,
      soundId: entry.metadata.soundId,
      filename: name,
      payloadBytes: Buffer.byteLength(data),
      payloadSha256: crypto.createHash("sha256").update(data).digest("hex"),
      audioSha256: entry.metadata.audioSha256,
      rootMidi: entry.metadata.rootMidi,
      velocityLayer: entry.metadata.velocityLayer,
      inscription: null,
    });
  }
}
manifest.totalPayloadBytes = manifest.assets.reduce(
  (n, a) => n + a.payloadBytes,
  0,
);
fs.writeFileSync(
  path.join(dest, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
fs.writeFileSync(
  path.join(dest, "l2-reference-template.json"),
  JSON.stringify({ format: "audionaut-l2-sounds/1", assets: [] }, null, 2),
);
console.log(
  manifest.assets.length,
  "payloads;",
  manifest.totalPayloadBytes,
  "bytes; no inscriptions created",
);
