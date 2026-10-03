const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto"),
  assert = require("assert");
const dir = path.resolve(__dirname, ".."),
  manifest = JSON.parse(
    fs.readFileSync(path.join(dir, "media/onboard-v2/manifest.json")),
  ),
  rows = [];
let total = 0;
for (const family of Object.keys(manifest.families)) {
  const file = path.join(dir, `media/onboard-v2/${family}.json`),
    pack = JSON.parse(fs.readFileSync(file));
  assert.equal(fs.statSync(file).size, manifest.families[family].packBytes);
  for (const [id, entry] of Object.entries(pack.entries)) {
    const m = manifest.assets[id],
      bytes = Buffer.from(entry.audioData, "base64");
    assert.equal(
      crypto.createHash("sha256").update(bytes).digest("hex"),
      m.audioSha256,
    );
    assert.equal(bytes.length, m.byteLength);
    total += bytes.length;
    const channels = bytes.readUInt16LE(22),
      sr = bytes.readUInt32LE(24),
      frames = bytes.readUInt32LE(40) / 2 / channels;
    assert.equal(sr, 44100);
    assert.equal(channels, m.channels);
    assert(Math.abs(frames / sr - m.duration) < 1 / sr);
    const data = Array.from(
      { length: channels },
      () => new Float32Array(frames),
    );
    let peak = 0,
      sum = 0,
      sq = 0,
      monoSq = 0;
    for (let n = 0; n < frames; n++) {
      let mono = 0;
      for (let c = 0; c < channels; c++) {
        const v = bytes.readInt16LE(44 + (n * channels + c) * 2) / 32768;
        data[c][n] = v;
        assert(Number.isFinite(v));
        peak = Math.max(peak, Math.abs(v));
        sum += v;
        sq += v * v;
        mono += v / channels;
      }
      monoSq += mono * mono;
    }
    assert(peak <= 0.708 && peak > 0.01);
    const dc = sum / (frames * channels);
    assert(Math.abs(dc) < 0.00002, `${id}: DC ${dc}`);
    for (const a of data) {
      assert.equal(a[0], 0);
      assert.equal(a[frames - 1], 0);
    }
    let seam = null;
    if (m.loop) {
      const start = Math.round(m.loop.start * sr),
        end = Math.round(m.loop.end * sr);
      assert(start > 0 && end < frames);
      seam = Math.max(...data.map((a) => Math.abs(a[end - 1] - a[start])));
      assert(seam < 0.04, `${id}: loop seam ${seam}`);
    }
    const rms = Math.sqrt(sq / (frames * channels)),
      monoRms = Math.sqrt(monoSq / frames);
    if (channels === 2)
      assert(monoRms / rms > 0.55, `${id}: mono cancellation`);
    rows.push({
      assetId: id,
      audioSha256: m.audioSha256,
      duration: frames / sr,
      channels,
      peak,
      rms,
      dc,
      loopSeam: seam,
      monoRms,
    });
  }
}
assert.equal(rows.length, 184);
assert.equal(
  new Set(rows.map((r) => r.audioSha256)).size,
  184,
  "Duplicate audio assets",
);
assert.equal(total, manifest.totalAudioBytes);
const report = {
  generatedAt: new Date().toISOString(),
  patches: manifest.patches,
  assets: rows.length,
  embeddedBytes: manifest.totalPackBytes,
  audioBytes: total,
  allHashesVerified: true,
  allFinite: true,
  maximumPeak: Math.max(...rows.map((r) => r.peak)),
  maximumAbsDc: Math.max(...rows.map((r) => Math.abs(r.dc))),
  maximumLoopSeam: Math.max(...rows.map((r) => r.loopSeam || 0)),
  listeningReview:
    "Representative mixes require human listening; numerical checks do not certify every timbre.",
  rows,
};
fs.writeFileSync(
  path.join(dir, "reports/onboard-expansion-audit.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify({ ...report, rows: undefined }, null, 2));
