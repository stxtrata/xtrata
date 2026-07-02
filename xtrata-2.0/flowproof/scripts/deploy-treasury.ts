/**
 * Deploy the flowproof-treasury composing contract (Pattern B) and point .env at it.
 *   npm run deploy-treasury
 *
 * The contract references your live xtrata-v3-2-3 and FlowVault's flowvault-v2 by
 * principal, so those must already be deployed (they are). Signs with your key.
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AnchorMode, ClarityVersion, PostConditionMode, makeContractDeploy } from "@stacks/transactions";
import { loadConfig } from "../src/config.js";
import { broadcast, waitForConfirmation } from "../src/stacks.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTRACT_NAME = "flowproof-treasury";

function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

function pointEnvAtTreasury(addr: string) {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  let text = readFileSync(p, "utf8");
  const setLine = (key: string, val: string) => {
    if (new RegExp(`^\\s*${key}\\s*=`, "m").test(text)) {
      text = text.replace(new RegExp(`^\\s*${key}\\s*=.*$`, "m"), `${key}=${val}`);
    } else {
      text = text.replace(/\n*$/, "") + `\n${key}=${val}\n`;
    }
  };
  setLine("TREASURY_CONTRACT_ADDRESS", addr);
  setLine("TREASURY_CONTRACT_NAME", CONTRACT_NAME);
  writeFileSync(p, text);
}

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.senderKey || !cfg.senderAddress) {
    console.error("Set STACKS_PRIVATE_KEY (or seed) in .env.");
    process.exit(1);
  }
  const api = cfg.networkName === "mainnet" ? "https://api.hiro.so" : "https://api.testnet.hiro.so";
  const id = `${cfg.senderAddress}.${CONTRACT_NAME}`;

  const already = await fetch(`${api}/v2/contracts/interface/${cfg.senderAddress}/${CONTRACT_NAME}`)
    .then((r) => r.ok)
    .catch(() => false);
  if (already) {
    console.log(`${id} already deployed - reusing it.`);
    pointEnvAtTreasury(cfg.senderAddress);
    console.log("Pointed .env at it. Next:  npm run demo:atomic");
    return;
  }

  const src = readFileSync(resolve(__dirname, "../contracts/flowproof-treasury.clar"), "utf8");
  const bad = [...src].find((ch) => ch.charCodeAt(0) > 127);
  if (bad) {
    console.error(`Contract source has a non-ASCII char (${JSON.stringify(bad)}). Fix to ASCII and retry.`);
    process.exit(1);
  }

  console.log(`Deploying ${id} (Clarity 3) ...`);
  const tx = await makeContractDeploy({
    contractName: CONTRACT_NAME,
    codeBody: src,
    senderKey: cfg.senderKey,
    network: cfg.network,
    clarityVersion: ClarityVersion.Clarity3,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 200000n,
  });
  const txid = await broadcast(tx, cfg.network);
  console.log("  tx:", txid);
  const c = await waitForConfirmation(txid, cfg.network);
  if (c.tx_status !== "success") {
    console.error(`Deploy failed: ${c.tx_status} ${c.tx_result?.repr ?? ""}`);
    process.exit(1);
  }
  pointEnvAtTreasury(cfg.senderAddress);
  console.log(`\n+ Deployed ${id} and pointed .env at it.`);
  console.log("Next:  npm run demo:atomic");
}

main().catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
