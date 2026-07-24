#!/usr/bin/env node
/*
 * Generate the dedicated Proof of Free controller from the audited Drops v1.1
 * implementation. The immutable engine fingerprint is compiled into the
 * contract, so this command intentionally runs only after engine inscription.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const engineId = Number(option("--engine-id"));
const engineSha256 = (option("--engine-sha256") || "").toLowerCase();
const contractName = option("--contract-name") || "proof-of-free-v1";
const clarinet = args.includes("--clarinet");
const requestedOutput = option("--output");

if (!Number.isSafeInteger(engineId) || engineId <= 0) throw new Error("--engine-id must be the confirmed positive inscription ID.");
if (!/^[0-9a-f]{64}$/.test(engineSha256)) throw new Error("--engine-sha256 must be exactly 32 bytes of lowercase hex.");
if (!/^[a-z][a-z0-9-]{0,39}$/.test(contractName)) throw new Error("--contract-name is invalid.");

const sourcePath = join(
  rootDir,
  clarinet
    ? "../../xtrata-2.0/contracts/clarinet/contracts/xtrata-drops-v1.1.clar"
    : "../../xtrata-2.0/contracts/live/xtrata-drops-v1.1.clar"
);
let source = readFileSync(sourcePath, "utf8");
const expectedBaseHash = clarinet
  ? "6e5bc01ac3e8a3bcdd6a076ade65c6c65273edd4d3ce47e0151ce5cc06d94dd3"
  : "11f9eaec419a1f60e527b1d1df3b29f3a70044da69fab7793c02ffab50fdbbcd";
const actualBaseHash = createHash("sha256").update(source).digest("hex");
if (actualBaseHash !== expectedBaseHash) {
  throw new Error(`Audited Drops v1.1 base changed (${actualBaseHash}); review it before updating the pinned hash.`);
}
const replaceOnce = (needle, replacement) => {
  if (!source.includes(needle)) throw new Error(`Drops v1.1 source shape changed near: ${needle.slice(0, 60)}`);
  source = source.replace(needle, replacement);
};

replaceOnce(
  ";; xtrata-drops-v1.1",
  `;; ${contractName}\n;; Generated dedicated controller for Proof of Free - Living Synth v3.\n;; Engine inscription: ${engineId}\n;; Engine SHA-256: ${engineSha256}`
);
replaceOnce(
  '(define-constant NFT-ASSET-NAME "xtrata-inscription")',
  `(define-constant NFT-ASSET-NAME "xtrata-inscription")
(define-constant POF-ENGINE-ID u${engineId})
(define-constant POF-ENGINE-SHA256 0x${engineSha256})
(define-constant POF-MAX-SUPPLY u1024)`
);
replaceOnce(
  "(define-read-only (get-next-campaign-id) (ok (var-get next-campaign-id)))",
  `(define-read-only (get-next-campaign-id) (ok (var-get next-campaign-id)))
(define-read-only (get-collection-config)
  (ok {
    protocol: "proof-of-free/v3",
    engine-id: POF-ENGINE-ID,
    engine-sha256: POF-ENGINE-SHA256,
    campaign-id: u0,
    max-supply: POF-MAX-SUPPLY,
    one-per-wallet: true,
    require-bns: true,
    one-per-bns: true
  })
)`
);
replaceOnce(
  "  (begin\n    (asserts!\n      (and (> max-supply u0) (<= max-supply MAX-CAMPAIGN-SUPPLY))",
  `  (begin
    ;; Campaign zero is the only campaign and its launch policy is immutable.
    (asserts! (is-eq (var-get next-campaign-id) u0) ERR-INVALID-CAMPAIGN)
    (asserts! (is-eq engine-id POF-ENGINE-ID) ERR-INVALID-CAMPAIGN)
    (asserts! (is-eq max-supply POF-MAX-SUPPLY) ERR-INVALID-CAMPAIGN)
    (asserts! one-per-wallet ERR-INVALID-CAMPAIGN)
    (asserts! require-bns ERR-INVALID-CAMPAIGN)
    (asserts! one-per-bns ERR-INVALID-CAMPAIGN)
    (asserts!
      (and (> max-supply u0) (<= max-supply MAX-CAMPAIGN-SUPPLY))`
);
replaceOnce(
  "        active: true,\n        created-at: stacks-block-height",
  "        active: false,\n        created-at: stacks-block-height"
);
replaceOnce(
  "        require-bns: require-bns,\n        one-per-bns: one-per-bns\n      })",
  "        require-bns: require-bns,\n        one-per-bns: one-per-bns,\n        active: false\n      })"
);
replaceOnce(
  "    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)\n    (map-set AllowedNftContracts nft-principal allowed)",
  `    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    ;; This collection can never accept a substitute NFT implementation.
    (asserts! (and (is-eq nft-principal PRIMARY-NFT-CONTRACT) allowed) ERR-NOT-AUTHORIZED)
    (map-set AllowedNftContracts nft-principal allowed)`
);
replaceOnce(
  "      (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-AUTHORIZED)\n      (map-set Campaigns campaign-id (merge campaign { active: active }))",
  `      (asserts! (is-eq tx-sender (get creator campaign)) ERR-NOT-AUTHORIZED)
      ;; Opening is impossible until all 1,024 NFTs are escrowed.
      (asserts!
        (or (not active) (is-eq (get drops-created campaign) POF-MAX-SUPPLY))
        ERR-CAMPAIGN-LIMIT
      )
      (map-set Campaigns campaign-id (merge campaign { active: active }))`
);
replaceOnce(
  "      (asserts! (get active campaign) ERR-CAMPAIGN-INACTIVE)\n      (asserts! (campaign-operator-allowed campaign-id campaign) ERR-NOT-AUTHORIZED)",
  "      (asserts! (campaign-operator-allowed campaign-id campaign) ERR-NOT-AUTHORIZED)"
);
replaceOnce(
  "(define-public (create-drop (nft-contract <nft-trait>) (token-id uint) (fee-budget uint) (group-id uint))\n  (let ((nft-principal (contract-of nft-contract)))\n    (begin",
  `(define-public (create-drop (nft-contract <nft-trait>) (token-id uint) (fee-budget uint) (group-id uint))
  (let ((nft-principal (contract-of nft-contract)))
    (begin
      (asserts! false ERR-CAMPAIGN-CLAIM-REQUIRED)`
);
replaceOnce(
  "        (edition (get drops-created campaign))",
  "        (edition (+ (get drops-created campaign) u1))"
);
replaceOnce(
  "(define-public (claim (nft-contract <nft-trait>) (drop-id uint))\n  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))",
  `(define-public (claim (nft-contract <nft-trait>) (drop-id uint))
  (begin
    (asserts! false ERR-CAMPAIGN-CLAIM-REQUIRED)
  (let ((drop (unwrap! (map-get? Drops drop-id) ERR-NOT-FOUND)))`
);
replaceOnce(
  "      (ok true)\n    )\n  )\n)\n\n;; The claimant submits this transaction",
  "      (ok true)\n    )\n  ))\n)\n\n;; The claimant submits this transaction"
);

const output = requestedOutput
  ? resolve(process.cwd(), requestedOutput)
  : join(rootDir, `release/contracts/${contractName}${clarinet ? ".clarinet" : ""}.clar`);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, source);
console.log(`${output}\nengine u${engineId} / 0x${engineSha256}\nstrict campaign u0 / supply u1024 / BNS + wallet limits`);
