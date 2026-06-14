// scope-key-vector.mjs - reproducible generator for the XIP-009 derive-scope-key
// test vector (XIP-000 s9). Recomputes the construction off-chain and asserts
// equality with the on-chain read-only.
import { initSimnet } from "@hirosystems/clarinet-sdk";
import { Cl, cvToString, serializeCV } from "@stacks/transactions";
import { createHash } from "crypto";

const AUTHORITY = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"; // simnet deployer
const LABEL = Buffer.alloc(32); LABEL.write("xip-corpus"); // ascii, zero-padded

// Off-chain: consensus serialization of a standard principal is
// 0x05 || version(1) || hash160(20)  (22 bytes), identical to
// (to-consensus-buff? principal) in Clarity.
const principalBytes = Buffer.from(serializeCV(Cl.principal(AUTHORITY)), "hex");
const preimage = Buffer.concat([principalBytes, LABEL]);
const digest = createHash("sha256").update(preimage).digest("hex");

console.log("authority        :", AUTHORITY);
console.log("label (hex)      :", LABEL.toString("hex"));
console.log("consensus-buff   :", principalBytes.toString("hex"));
console.log("preimage (hex)   :", preimage.toString("hex"));
console.log("sha256 digest    :", digest);

const simnet = await initSimnet("./Clarinet.toml");
const r = simnet.callReadOnlyFn("xtrata-manifest-authority-v1", "derive-scope-key",
  [Cl.principal(AUTHORITY), Cl.buffer(LABEL)], AUTHORITY);
const onchain = cvToString(r.result).replace("0x", "");
console.log("on-chain digest  :", onchain);
if (onchain !== digest) { console.error("MISMATCH"); process.exit(1); }
console.log("VECTOR OK: off-chain == on-chain");
