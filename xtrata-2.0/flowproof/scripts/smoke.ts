/**
 * FlowProof smoke test — validates the DEPLOYED Xtrata v3.2.3 with a real
 * inscription + recursive lineage, using ONLY STX (no FlowVault / USDCx needed).
 *
 *   npm run smoke
 *
 * Requires .env: XTRATA_CONTRACT_ADDRESS + STACKS_PRIVATE_KEY.
 * Tip: use the deployer/owner account (STRNRHWSD7…) so inscriptions work even
 * though the contract deploys paused (owner bypasses the pause).
 *
 * Proves on your live contract: mint-single-tx, mint-single-tx-with-relationships,
 * and the get-parents / get-dependencies lineage reads.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadConfig } from "../src/config.js";
import { XtrataClient } from "../src/xtrata.js";
import { buildReceipt } from "../src/orchestrator.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.senderKey || !cfg.senderAddress) {
    console.error("Set STACKS_PRIVATE_KEY in .env (use the deployer/owner account).");
    process.exit(1);
  }
  if (!cfg.xtrata.address) {
    console.error("Set XTRATA_CONTRACT_ADDRESS in .env to your deployed contract.");
    process.exit(1);
  }

  const record = new XtrataClient({
    network: cfg.network,
    contractAddress: cfg.xtrata.address,
    contractName: cfg.xtrata.name,
    senderKey: cfg.senderKey,
    senderAddress: cfg.senderAddress,
  });

  const contractId = `${cfg.xtrata.address}.${cfg.xtrata.name}`;
  console.log(`FlowProof smoke — ${cfg.networkName}  ${contractId}  as ${cfg.senderAddress}\n`);

  const art = new TextEncoder().encode("FlowProof smoke asset " + new Date().toISOString());
  console.log("1) inscribing asset (mint-single-tx)…");
  const asset = await record.inscribeAsset(art, "text/plain", "flowproof:smoke-asset");
  console.log(`   asset #${asset.tokenId}  tx ${asset.txid}`);

  const vaultId = `${cfg.flowvault.address}.${cfg.flowvault.name}`;
  const mk = (n: number, prev: number | null) =>
    buildReceipt({
      flow: "royalty-split",
      vaultId,
      tokenSymbol: "usdcx",
      amount: "5000000",
      rules: { splitAddress: cfg.senderAddress!, splitAmount: "500000", lockAmount: "1000000", lockUntilBlock: 0 },
      depositTxid: `0xsmoke-${n}`,
      block: 0,
      assetInscription: asset.tokenId,
      prevReceipt: prev,
    });

  console.log("2) inscribing receipt R1 (mint-single-tx-with-relationships → asset)…");
  const r1 = await record.inscribeReceipt(mk(1, null));
  console.log(`   R1 #${r1.tokenId}  tx ${r1.txid}`);

  console.log("3) inscribing receipt R2 (→ R1)…");
  const r2 = await record.inscribeReceipt(mk(2, r1.tokenId));
  console.log(`   R2 #${r2.tokenId}  tx ${r2.txid}`);

  const parents = await record.getParents(r2.tokenId);
  const deps = await record.getDependencies(r2.tokenId);
  console.log(`\nLineage of R2 #${r2.tokenId}: parents=${JSON.stringify(parents)} dependencies=${JSON.stringify(deps)}`);
  console.log(`asset#${asset.tokenId} <- R1#${r1.tokenId} <- R2#${r2.tokenId}   ✓ live on ${cfg.xtrata.name}`);
}

main().catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
