/**
 * Walk the on-chain Proof-of-Flow lineage and export it for the explorer UI.
 *
 *   npm run lineage          # from the latest token id
 *   npm run lineage 2        # from a specific tip token id
 *
 * Reads only (no signing). Writes flowproof/lineage.json, which explorer.html renders.
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadConfig } from "../src/config.js";
import { XtrataClient } from "../src/xtrata.js";
import { cvToHex, uintCV } from "@stacks/transactions";

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

/** Find the tx that minted a given inscription, via the public NFT history API. */
async function findMintTx(api: string, addr: string, name: string, id: number): Promise<string | null> {
  const asset = `${addr}.${name}::xtrata-inscription`;
  const value = cvToHex(uintCV(id));
  try {
    const r = await fetch(`${api}/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(asset)}&value=${value}`);
    if (!r.ok) return null;
    const j: any = await r.json();
    const results: any[] = j.results ?? [];
    const mint = results.find((e) => e.asset_event_type === "mint") ?? results[results.length - 1];
    return mint?.tx_id ? String(mint.tx_id).replace(/^0x/, "") : null;
  } catch {
    return null;
  }
}

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.xtrata.address) {
    console.error("Set XTRATA_CONTRACT_ADDRESS in .env.");
    process.exit(1);
  }

  // Reads don't need a signer; fall back to the contract address as the read sender.
  const record = new XtrataClient({
    network: cfg.network,
    contractAddress: cfg.xtrata.address,
    contractName: cfg.xtrata.name,
    senderKey: cfg.senderKey ?? "00".repeat(32),
    senderAddress: cfg.senderAddress ?? cfg.xtrata.address,
  });

  const api = cfg.networkName === "mainnet" ? "https://api.hiro.so" : "https://api.testnet.hiro.so";

  const argTip = process.argv.slice(2).find((a) => /^\d+$/.test(a));
  const tip = argTip ? Number(argTip) : await record.getLastTokenId();
  console.log(`Walking lineage from tip #${tip} on ${cfg.xtrata.address}.${cfg.xtrata.name}…`);

  const receipts: any[] = [];
  const seen = new Set<number>();
  let cur: number | null = tip;
  while (cur != null && !seen.has(cur)) {
    const id: number = cur;
    seen.add(id);
    const parents: number[] = await record.getParents(id);
    const dependencies: number[] = await record.getDependencies(id);
    const text: string = await record.readContentText(id);
    let receipt: any = null;
    try { receipt = JSON.parse(text); } catch { /* not a JSON receipt (e.g. the asset) */ }
    // Only treat JSON FlowProof receipts as receipt nodes; otherwise stop (it's the asset/root).
    if (receipt && receipt.std === "flowproof.receipt") {
      receipts.push({ id, parents, dependencies, receipt });
      cur = parents.length ? parents[0]! : null;
    } else {
      break; // reached a non-receipt (the asset) via a parent link
    }
  }
  receipts.reverse(); // root-first

  const assetId = receipts.find((r) => r.dependencies.length)?.dependencies[0] ?? null;
  let asset: any = null;
  if (assetId != null) {
    let content = "";
    try { content = await record.readContentText(assetId); } catch { /* ignore */ }
    asset = { id: assetId, content, mintTxid: await findMintTx(api, cfg.xtrata.address, cfg.xtrata.name, assetId) };
  }

  // Deep-link data for the explorer: each inscription's mint tx (via NFT history).
  for (const r of receipts) {
    r.mintTxid = await findMintTx(api, cfg.xtrata.address, cfg.xtrata.name, r.id);
  }

  const out = {
    network: cfg.networkName,
    contract: `${cfg.xtrata.address}.${cfg.xtrata.name}`,
    contracts: {
      xtrata: `${cfg.xtrata.address}.${cfg.xtrata.name}`,
      treasury: `${cfg.treasury.address}.${cfg.treasury.name}`,
      flowvault: `${cfg.flowvault.address}.${cfg.flowvault.name}`,
      token: `${cfg.usdcx.address}.${cfg.usdcx.name}`,
    },
    generatedAt: new Date().toISOString(),
    asset,
    receipts,
  };
  const p = resolve(__dirname, "../lineage.json");
  writeFileSync(p, JSON.stringify(out, null, 2));

  console.log(`\nWrote ${p}`);
  console.log(`Chain: asset#${asset?.id ?? "?"} ` + receipts.map((r) => `<- R${r.id}`).join(" "));
  console.log("View it:  npx serve .   then open explorer.html");
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
