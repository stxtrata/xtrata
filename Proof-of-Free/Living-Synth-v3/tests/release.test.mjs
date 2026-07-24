import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const P = require(join(root, "packages/performance-codec/performance-codec.js"));

test("codec rejects unknown fields and preserves the 4096-event bound", () => {
  const events = Array.from({ length: P.MAX_EVENTS }, (_, index) =>
    index === P.MAX_EVENTS - 1
      ? { tick: index, type: "up" }
      : { tick: index, type: "move", x: 0.5, y: 0.5, pressure: 0.5 }
  );
  const perf = P.create(
    { edition: 1, genomeHash: "0x12345678", engineVersion: 1, bpm: 132 },
    events,
    6144
  );
  assert.equal(P.validate(perf).events.length, P.MAX_EVENTS);
  assert.throws(() => P.validate({ ...perf, surprise: true }), /unknown fields/);
  assert.throws(() => P.validate({ ...perf, events: [{ tick: 0, type: "up", x: 1 }] }), /must not contain/);
});

test("release builder refuses placeholder, negative, and fractional engine IDs", () => {
  for (const value of ["0", "-1", "1.5"]) {
    assert.throws(() => execFileSync(process.execPath, [
      "scripts/build-collection.mjs", "--engine-id", value, "--seeds"
    ], { cwd: root, stdio: "pipe" }));
  }
});

test("engine-only build is deterministic and release master is claim-gated", () => {
  execFileSync(process.execPath, ["scripts/build-collection.mjs"], { cwd: root });
  const first = readFileSync(join(root, "artifacts/proof-of-free-engine-v3.js"));
  execFileSync(process.execPath, ["scripts/build-collection.mjs"], { cwd: root });
  const second = readFileSync(join(root, "artifacts/proof-of-free-engine-v3.js"));
  assert.deepEqual(first, second);
  const text = second.toString();
  assert.match(text, /class ClaimedMosaic/);
  assert.match(text, /Fail closed/);
  assert.match(text, /onePerWallet !== true/);
});

test("controller generator pins the engine and strict campaign policy", () => {
  const hash = "ab".repeat(32);
  const output = join(mkdtempSync(join(tmpdir(), "pof-contract-")), "proof-of-free-v1.clar");
  execFileSync(process.execPath, [
    "scripts/build-contract.mjs",
    "--engine-id", "12345",
    "--engine-sha256", hash,
    "--output", output
  ], { cwd: root });
  const contract = readFileSync(output, "utf8");
  assert.match(contract, /POF-ENGINE-ID u12345/);
  assert.match(contract, new RegExp(`POF-ENGINE-SHA256 0x${hash}`));
  assert.match(contract, /POF-MAX-SUPPLY u1024/);
  assert.match(contract, /Campaign zero is the only campaign/);
  assert.match(contract, /active: false/);
  assert.match(contract, /Opening is impossible until all 1,024 NFTs are escrowed/);
  assert.match(contract, /never accept a substitute NFT implementation/);
  assert.match(contract, /edition \(\+ \(get drops-created campaign\) u1\)/);
});
