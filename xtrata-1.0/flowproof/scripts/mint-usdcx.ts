/**
 * Mint testnet USDCx so the FlowVault deposit flow has tokens to route.
 *
 *   npm run mint-usdcx          # mints 1000 USDCx to your account
 *   npm run mint-usdcx 2500     # custom amount
 *
 * The testnet usdcx token (ST1PQHQKV….usdcx) is an sBTC-style role-gated token:
 *  - minting needs the `mint` role (0x01)
 *  - the `mint`/`governance` registry is controlled by `governance` (0x00)
 *  - at deploy, governance was granted to the deployer = ST1PQHQKV…, which is the
 *    PUBLIC Clarinet default account (its key is published, by design, for testing).
 *
 * So this script, using that public governance key:
 *   1. grants YOUR account the mint role (set-active-protocol-caller)   [once]
 *   2. mints USDCx to you (protocol-mint)
 * It auto-tops-up the governance account with a little STX from you if needed.
 *
 * This only touches a shared TESTNET test token. Nothing here uses real value.
 */
import {
  AnchorMode,
  PostConditionMode,
  bufferCV,
  getAddressFromPrivateKey,
  makeContractCall,
  makeSTXTokenTransfer,
  principalCV,
  trueCV,
  uintCV,
  TransactionVersion,
} from "@stacks/transactions";
import { generateWallet } from "@stacks/wallet-sdk";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadConfig } from "../src/config.js";
import { broadcast, callReadOnly, waitForConfirmation } from "../src/stacks.js";

// PUBLIC Clarinet default deployer mnemonic → ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
// (well-known test key; verified to derive that address). Testnet only.
const GOV_MNEMONIC =
  "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw";

const MINT_ROLE = bufferCV(Uint8Array.from([1])); // 0x01

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

async function stxBalance(api: string, addr: string): Promise<bigint> {
  try {
    const r = await fetch(`${api}/extended/v1/address/${addr}/stx`);
    if (!r.ok) return 0n;
    const j: any = await r.json();
    return BigInt(j.balance ?? "0");
  } catch {
    return 0n;
  }
}

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  if (!cfg.senderKey || !cfg.senderAddress) {
    console.error("Set STACKS_PRIVATE_KEY (or seed) in .env.");
    process.exit(1);
  }
  const tv = cfg.networkName === "mainnet" ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
  const api = cfg.networkName === "mainnet" ? "https://api.hiro.so" : "https://api.testnet.hiro.so";

  const me = cfg.senderAddress;
  const meKey = cfg.senderKey;
  const usdcx = { address: cfg.usdcx.address, name: cfg.usdcx.name };

  // Governance signer (public Clarinet deployer).
  const gw = await generateWallet({ secretKey: GOV_MNEMONIC, password: "" });
  const govKey = gw.accounts[0]!.stxPrivateKey;
  const govAddr = getAddressFromPrivateKey(govKey, tv);
  if (govAddr !== usdcx.address) {
    console.error(`Governance key derives ${govAddr} but usdcx is ${usdcx.address}. Aborting.`);
    process.exit(1);
  }

  const amountArg = process.argv.slice(2).find((a) => /^\d+(\.\d+)?$/.test(a)) ?? "1000";
  const micro = BigInt(Math.round(parseFloat(amountArg) * 1e6));

  console.log(`USDCx mint → ${me}`);
  console.log(`token: ${usdcx.address}.${usdcx.name}  governance: ${govAddr}\n`);

  // 1) Does my account already hold the mint role?
  const roleCheck = await callReadOnly({
    network: cfg.network,
    senderAddress: me,
    contractAddress: usdcx.address,
    contractName: usdcx.name,
    functionName: "is-protocol-caller",
    functionArgs: [MINT_ROLE, principalCV(me)],
  });
  const hasMint = roleCheck?.success === true;
  console.log(`mint role for ${me}: ${hasMint ? "already granted ✓" : "not yet"}`);

  if (!hasMint) {
    // Ensure governance has STX for the grant tx; top up from me if empty.
    const govBal = await stxBalance(api, govAddr);
    if (govBal < 1_000_000n) {
      console.log(`governance STX low (${govBal}); sending 1 STX to cover the grant fee…`);
      const fund = await makeSTXTokenTransfer({
        recipient: govAddr,
        amount: 1_000_000n, // 1 STX
        senderKey: meKey,
        network: cfg.network,
        anchorMode: AnchorMode.Any,
      });
      const fundTx = await broadcast(fund, cfg.network);
      console.log("  fund tx:", fundTx);
      await waitForConfirmation(fundTx, cfg.network);
    }

    console.log("granting mint role (governance → set-active-protocol-caller)…");
    const grant = await makeContractCall({
      contractAddress: usdcx.address,
      contractName: usdcx.name,
      functionName: "set-active-protocol-caller",
      functionArgs: [principalCV(me), MINT_ROLE, trueCV()],
      senderKey: govKey,
      network: cfg.network,
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
    });
    const grantTx = await broadcast(grant, cfg.network);
    console.log("  grant tx:", grantTx);
    const gc = await waitForConfirmation(grantTx, cfg.network);
    if (gc.tx_status !== "success") {
      console.error(`grant failed: ${gc.tx_status} ${gc.tx_result?.repr ?? ""}`);
      process.exit(1);
    }
  }

  // 2) Mint to myself (I now hold the mint role).
  console.log(`minting ${amountArg} USDCx to ${me}…`);
  const mint = await makeContractCall({
    contractAddress: usdcx.address,
    contractName: usdcx.name,
    functionName: "protocol-mint",
    functionArgs: [uintCV(micro), principalCV(me)],
    senderKey: meKey,
    network: cfg.network,
    postConditionMode: PostConditionMode.Allow,
    anchorMode: AnchorMode.Any,
  });
  const mintTx = await broadcast(mint, cfg.network);
  console.log("  mint tx:", mintTx);
  const mc = await waitForConfirmation(mintTx, cfg.network);
  console.log("  status:", mc.tx_status, mc.tx_result?.repr ?? "");

  if (mc.tx_status === "success") {
    console.log(`\n✓ Minted ${amountArg} USDCx to ${me}.  Now run:  npm run demo`);
  } else {
    console.log(`\n✗ Mint did not succeed.`);
  }
}

main().catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
