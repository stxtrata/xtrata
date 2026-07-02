/**
 * Deploy the FlowProof faucet USDCx stand-in (signs with your configured key),
 * then point .env at it. FlowVault accepts any SIP-010 token, so this lets the
 * full deposit flow run on testnet without the bridge-only official USDCx.
 *
 *   npm run deploy-token
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AnchorMode, ClarityVersion, PostConditionMode, makeContractDeploy } from "@stacks/transactions";
import { loadConfig } from "../src/config.js";
import { broadcast, waitForConfirmation } from "../src/stacks.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKEN_NAME = "usdcx"; // deployed under YOUR address as a test stand-in

function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

function pointEnvAtToken(addr: string) {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  const lines = readFileSync(p, "utf8").split("\n").map((l) => {
    if (/^\s*USDCX_CONTRACT_ADDRESS\s*=/.test(l)) return `USDCX_CONTRACT_ADDRESS=${addr}`;
    if (/^\s*USDCX_CONTRACT_NAME\s*=/.test(l)) return `USDCX_CONTRACT_NAME=${TOKEN_NAME}`;
    return l;
  });
  writeFileSync(p, lines.join("\n"));
}

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.senderKey || !cfg.senderAddress) {
    console.error("Set STACKS_PRIVATE_KEY (or seed) in .env.");
    process.exit(1);
  }
  const api = cfg.networkName === "mainnet" ? "https://api.hiro.so" : "https://api.testnet.hiro.so";
  const id = `${cfg.senderAddress}.${TOKEN_NAME}`;

  const already = await fetch(`${api}/v2/contracts/interface/${cfg.senderAddress}/${TOKEN_NAME}`)
    .then((r) => r.ok)
    .catch(() => false);
  if (already) {
    console.log(`${id} already deployed — reusing it.`);
    pointEnvAtToken(cfg.senderAddress);
    console.log("Pointed .env at it. Next:  npm run faucet 1000   then   npm run demo");
    return;
  }

  const src = readFileSync(resolve(__dirname, "../contracts/flowproof-usdcx.clar"), "utf8");
  console.log(`Deploying ${id} (Clarity 3) …`);
  // Guard: contract source must be pure ASCII (Stacks tx string codec rejects non-ASCII).
  const bad = [...src].find((ch) => ch.charCodeAt(0) > 127);
  if (bad) {
    console.error(`Contract source has a non-ASCII char (${JSON.stringify(bad)}). Fix it to ASCII and retry.`);
    process.exit(1);
  }

  const tx = await makeContractDeploy({
    contractName: TOKEN_NAME,
    codeBody: src,
    senderKey: cfg.senderKey,
    network: cfg.network,
    clarityVersion: ClarityVersion.Clarity3,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 200000n, // 0.2 STX, explicit so we skip fee estimation
  });
  const txid = await broadcast(tx, cfg.network);
  console.log("  tx:", txid);
  const c = await waitForConfirmation(txid, cfg.network);
  if (c.tx_status !== "success") {
    console.error(`Deploy failed: ${c.tx_status} ${c.tx_result?.repr ?? ""}`);
    process.exit(1);
  }
  pointEnvAtToken(cfg.senderAddress);
  console.log(`\n✓ Deployed ${id} and pointed .env at it.`);
  console.log("Next:  npm run faucet 1000   then   npm run demo");
}

main().catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
