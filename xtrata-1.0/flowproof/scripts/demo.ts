/**
 * FlowProof demo.
 *
 *   npm run demo:dry     # no network, no keys — builds + hashes real receipts,
 *                        # prints exactly what would be inscribed on Xtrata v3.2.3
 *
 *   npm run demo         # live testnet run (requires .env: STACKS_PRIVATE_KEY,
 *                        # XTRATA_CONTRACT_ADDRESS pointing at your testnet deploy)
 *
 * Flagship scenario: provenance-bound creator royalties.
 *   - Inscribe a track/cover as the asset (the "work").
 *   - Two sales arrive; FlowVault splits 10% to a collaborator and locks 20%.
 *   - Each sale mints a recursive receipt: asset <- R1 <- R2.
 * Then the same engine is shown running a payroll flow — one config change.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { KNOWN, loadConfig } from "../src/config.js";
import { FlowVaultClient } from "../src/flowvault.js";
import { XtrataClient } from "../src/xtrata.js";
import { ProofOfFlow, buildReceipt, previewInscription } from "../src/orchestrator.js";
import { canonicalJson } from "../src/receipt.js";
import type { RoutingRules } from "../src/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Minimal dependency-free .env loader. */
function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) {
      process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
    }
  }
}

const DRY = process.argv.includes("--dry-run");

// Demo numbers (micro-units; USDCx uses 6 decimals → 1 USDCx = 1_000_000).
const COLLABORATOR = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
const SALE = "5000000"; // 5 USDCx per sale
const royaltyRules = (lockUntilBlock: number): RoutingRules => ({
  splitAddress: COLLABORATOR,
  splitAmount: "500000", // 0.5 USDCx (10%) to collaborator
  lockAmount: "1000000", // 1 USDCx (20%) locked as reserve
  lockUntilBlock,
});
const payrollRules = (lockUntilBlock: number): RoutingRules => ({
  splitAddress: "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0", // tax/benefits sink
  splitAmount: "1500000",
  lockAmount: "2000000", // vesting
  lockUntilBlock,
});

function hr() {
  console.log("─".repeat(72));
}

async function dryRun() {
  console.log("FlowProof — DRY RUN (no network). Building + hashing real receipts.\n");
  console.log("Money layer :", KNOWN.flowvaultTestnet);
  console.log("Record layer:", KNOWN.xtrataMainnet, "(deploy to testnet for the demo)\n");

  const vaultId = KNOWN.flowvaultTestnet;
  const asset = 1001; // pretend the track was inscribed as #1001
  let prev: number | null = null;
  let pretendId = 2000;

  for (const [n, label] of [[1, "first sale"], [2, "second sale"]] as const) {
    const receipt = buildReceipt({
      flow: "royalty-split",
      vaultId,
      tokenSymbol: "usdcx",
      amount: SALE,
      rules: royaltyRules(3_905_000),
      depositTxid: `0xDEPOSIT_TX_${n}`,
      block: 3_900_000 + n,
      assetInscription: asset,
      prevReceipt: prev,
    });
    const preview = previewInscription(receipt);
    hr();
    console.log(`ROYALTY RECEIPT #${n} (${label})`);
    console.log("canonical json :", canonicalJson(receipt));
    console.log("content hash   :", preview.contentHashHex);
    console.log("size / chunks  :", preview.totalSize, "bytes /", preview.totalChunks, "chunk");
    console.log("xtrata call    :", preview.contractFunction);
    console.log("  dependencies :", JSON.stringify(preview.dependencies), "(asset must exist)");
    console.log("  parents      :", JSON.stringify(preview.parents), "(lineage chain)");
    console.log("  token-uri    :", preview.tokenUri);
    prev = pretendId++; // next receipt chains from this one
  }

  hr();
  console.log("SAME ENGINE → PAYROLL (one config change):");
  const pay = buildReceipt({
    flow: "payroll",
    vaultId,
    tokenSymbol: "usdcx",
    amount: "10000000",
    rules: payrollRules(3_910_000),
    depositTxid: "0xPAYROLL_TX_1",
    block: 3_900_100,
    assetInscription: 1500, // e.g. the employment agreement inscription
    prevReceipt: null,
  });
  console.log("canonical json :", canonicalJson(pay));
  console.log("content hash   :", previewInscription(pay).contentHashHex);
  hr();
  console.log("\nLineage that would exist on-chain:  asset#1001 <- R1 <- R2");
  console.log("Queryable via Xtrata get-parents / get-dependencies or the relations index.");
  console.log("\nNo tokens moved, nothing inscribed (dry run). Run `npm run demo` for live testnet.");
}

async function liveRun() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.senderKey || !cfg.senderAddress) {
    console.error("Live run needs STACKS_PRIVATE_KEY in .env (a funded testnet account).");
    console.error("Tip: `npm run demo:dry` runs everything locally with no keys.");
    process.exit(1);
  }
  if (!cfg.xtrata.address) {
    console.error("Set XTRATA_CONTRACT_ADDRESS to your testnet xtrata-v3-2-3 deployment.");
    process.exit(1);
  }

  const money = new FlowVaultClient({
    networkName: cfg.networkName,
    contractAddress: cfg.flowvault.address,
    contractName: cfg.flowvault.name,
    tokenContractAddress: cfg.usdcx.address,
    tokenContractName: cfg.usdcx.name,
    senderKey: cfg.senderKey,
    senderAddress: cfg.senderAddress,
  });
  const record = new XtrataClient({
    network: cfg.network,
    contractAddress: cfg.xtrata.address,
    contractName: cfg.xtrata.name,
    senderKey: cfg.senderKey,
    senderAddress: cfg.senderAddress,
  });
  const vaultId = `${cfg.flowvault.address}.${cfg.flowvault.name}`;
  const pof = new ProofOfFlow(money, record, { vaultId, tokenSymbol: cfg.usdcx.name });

  console.log("FlowProof — LIVE", cfg.networkName, "as", cfg.senderAddress, "\n");

  // 1) Inscribe the "work" (a tiny placeholder asset for the demo).
  const art = new TextEncoder().encode("FlowProof demo track — © creator, " + new Date().toISOString());
  console.log("Inscribing asset…");
  const asset = await record.inscribeAsset(art, "text/plain", "flowproof:demo-asset");
  console.log("  asset inscription #", asset.tokenId, "tx", asset.txid);

  // 2) Two sales → recursive royalty receipts.
  const block = await money.getCurrentBlockHeight();
  let prev: number | null = null;
  for (const n of [1, 2]) {
    console.log(`\nSale ${n}: depositing ${SALE} ${cfg.usdcx.name}…`);
    const result = await pof.runFlow({
      flow: "royalty-split",
      assetInscription: asset.tokenId,
      amount: SALE,
      rules: royaltyRules(block + 1000),
      prevReceipt: prev,
      rulesAlreadySet: n > 1,
    });
    console.log("  deposit tx :", result.depositTxid);
    console.log("  receipt #  :", result.inscription.tokenId, "tx", result.inscription.txid);
    console.log("  vault state:", JSON.stringify(result.vaultState));
    prev = result.inscription.tokenId;
  }

  // 3) Show the lineage straight from Xtrata.
  if (prev != null) {
    const parents = await record.getParents(prev);
    const deps = await record.getDependencies(prev);
    console.log(`\nLineage of receipt #${prev}: parents=${JSON.stringify(parents)} dependencies=${JSON.stringify(deps)}`);
    console.log("→ asset <- R1 <- R2, permanent and verifiable on-chain.");
  }
}

(DRY ? dryRun() : liveRun()).catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
