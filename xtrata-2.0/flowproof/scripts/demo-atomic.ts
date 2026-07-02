/**
 * FlowProof Pattern B demo - ATOMIC composition + full lifecycle.
 *
 *   npm run demo:atomic
 *
 * 1. set routing rules once (split + time-lock)
 * 2. inscribe the asset (the work)
 * 3. two ATOMIC sales: flowproof-treasury.deposit-and-prove routes the deposit
 *    AND inscribes the recursive receipt in ONE transaction each
 * 4. lifecycle: withdraw unlocked funds and inscribe a linked withdrawal receipt
 *
 * Requires: deployed usdcx (npm run deploy-token), funded (npm run faucet),
 * deployed treasury (npm run deploy-treasury). Uses your key from .env.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadConfig } from "../src/config.js";
import { FlowVaultClient } from "../src/flowvault.js";
import { XtrataClient } from "../src/xtrata.js";
import { TreasuryClient } from "../src/treasury.js";
import { buildReceipt } from "../src/orchestrator.js";
import type { RoutingRules } from "../src/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

const COLLABORATOR = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
const SALE = "5000000"; // 5 USDCx

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.senderKey || !cfg.senderAddress) {
    console.error("Set STACKS_PRIVATE_KEY (or seed) in .env.");
    process.exit(1);
  }

  const money = new FlowVaultClient({
    networkName: cfg.networkName,
    network: cfg.network,
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
  const treasury = new TreasuryClient({
    network: cfg.network,
    treasury: cfg.treasury,
    token: cfg.usdcx,
    senderKey: cfg.senderKey,
    senderAddress: cfg.senderAddress,
  });

  const vaultId = `${cfg.flowvault.address}.${cfg.flowvault.name}`;
  console.log(`FlowProof ATOMIC demo - ${cfg.networkName} as ${cfg.senderAddress}`);
  console.log(`treasury: ${cfg.treasury.address}.${cfg.treasury.name}\n`);

  // 1) Routing rules (split 10% + lock 20%).
  const block = await money.getCurrentBlockHeight();
  const rules: RoutingRules = {
    splitAddress: COLLABORATOR,
    splitAmount: "500000",
    lockAmount: "1000000",
    lockUntilBlock: block + 1000,
  };
  console.log("Setting routing rules...");
  await money.setRoutingRules(rules);

  // 2) Inscribe the work.
  const art = new TextEncoder().encode("FlowProof atomic demo track - (c) creator " + new Date().toISOString());
  console.log("Inscribing asset...");
  const asset = await record.inscribeAsset(art, "text/plain", "flowproof:atomic-asset");
  console.log(`  asset #${asset.tokenId}  tx ${asset.txid}`);

  // 3) Two ATOMIC sales (deposit + inscribe in one tx each).
  let prev: number | null = null;
  for (const n of [1, 2]) {
    const receipt = buildReceipt({
      flow: "royalty-split",
      mode: "atomic",
      vaultId,
      tokenSymbol: cfg.usdcx.name,
      amount: SALE,
      rules,
      depositTxid: "", // atomic: the inscription tx IS the deposit tx
      block: await money.getCurrentBlockHeight(),
      assetInscription: asset.tokenId,
      prevReceipt: prev,
    });
    console.log(`\nAtomic sale ${n}: deposit-and-prove ${SALE} ${cfg.usdcx.name}...`);
    const res = await treasury.depositAndProve(receipt);
    console.log(`  receipt #${res.tokenId}  atomic tx ${res.atomicTxid}`);
    console.log(`  ^ that single tx routed the deposit AND inscribed the receipt`);
    prev = res.tokenId;
  }

  // 4) Lifecycle: withdraw unlocked funds, inscribe a linked withdrawal receipt.
  const state = await money.getVaultState();
  const withdrawable = BigInt(state.unlockedBalance || "0");
  const toWithdraw = withdrawable > 3_000_000n ? "3000000" : state.unlockedBalance;
  if (BigInt(toWithdraw) > 0n) {
    console.log(`\nWithdrawing ${toWithdraw} ${cfg.usdcx.name} (unlocked)...`);
    const wtx = await money.withdraw(toWithdraw);
    const wReceipt = buildReceipt({
      flow: "withdrawal",
      mode: "orchestrated",
      vaultId,
      tokenSymbol: cfg.usdcx.name,
      amount: toWithdraw,
      rules: { splitAddress: null, splitAmount: "0", lockAmount: "0", lockUntilBlock: 0 },
      depositTxid: wtx,
      block: await money.getCurrentBlockHeight(),
      assetInscription: asset.tokenId,
      prevReceipt: prev,
    });
    const wIns = await record.inscribeReceipt(wReceipt);
    console.log(`  withdraw tx ${wtx}`);
    console.log(`  withdrawal receipt #${wIns.tokenId}  tx ${wIns.txid}`);
    prev = wIns.tokenId;
  } else {
    console.log("\n(no unlocked balance to withdraw; skipping lifecycle step)");
  }

  console.log(`\nLineage tip: #${prev}.  Verify any receipt:  npm run verify ${prev}`);
  console.log(`Render it:  npm run lineage ${prev} && npx serve .`);
}

main().catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
