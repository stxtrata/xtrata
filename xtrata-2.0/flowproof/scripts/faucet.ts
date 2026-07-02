/**
 * Mint test USDCx to your account via the token's public faucet, so the
 * FlowVault deposit flow has tokens to route.
 *
 *   npm run faucet          # mints 1000 test USDCx
 *   npm run faucet 2500     # mints 2500 (faucet cap is 10000)
 *
 * Requires .env: STACKS_PRIVATE_KEY (or seed) + USDCX_CONTRACT_*.
 * If the testnet token has no `faucet` function the broadcast will be rejected
 * with a clear error — tell me and we'll switch to the FlowVault demo faucet.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AnchorMode, PostConditionMode, makeContractCall, uintCV } from "@stacks/transactions";
import { loadConfig } from "../src/config.js";
import { broadcast, waitForConfirmation } from "../src/stacks.js";

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
    console.error("Set STACKS_PRIVATE_KEY (or seed) in .env.");
    process.exit(1);
  }

  const amountArg = process.argv.slice(2).find((a) => /^\d+(\.\d+)?$/.test(a)) ?? "1000";
  const micro = BigInt(Math.round(parseFloat(amountArg) * 1e6)); // USDCx = 6 decimals

  const token = `${cfg.usdcx.address}.${cfg.usdcx.name}`;
  console.log(`Minting ${amountArg} test USDCx to ${cfg.senderAddress}`);
  console.log(`via ${token}::faucet …\n`);

  const tx = await makeContractCall({
    contractAddress: cfg.usdcx.address,
    contractName: cfg.usdcx.name,
    functionName: "faucet",
    functionArgs: [uintCV(micro)],
    senderKey: cfg.senderKey,
    network: cfg.network,
    postConditionMode: PostConditionMode.Allow, // self-mint of a test token
    anchorMode: AnchorMode.Any,
  });

  const txid = await broadcast(tx, cfg.network);
  console.log("  tx:", txid);
  console.log("  waiting for confirmation…");
  const confirmed = await waitForConfirmation(txid, cfg.network);
  console.log("  status:", confirmed.tx_status);
  if (confirmed.tx_status === "success") {
    console.log(`\n✓ Minted ${amountArg} USDCx. Now run:  npm run demo`);
  } else {
    console.log(`\n✗ Faucet tx did not succeed: ${confirmed.tx_status} ${confirmed.tx_result?.repr ?? ""}`);
  }
}

main().catch((e) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("\nError:", msg);
  if (/NoSuchContract|not found|Undefined|faucet/i.test(msg)) {
    console.error("The testnet usdcx may not expose `faucet`. Tell me and we'll use the FlowVault demo faucet or `mint`.");
  }
  process.exit(1);
});
