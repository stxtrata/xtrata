/**
 * Read-only diagnostic of the usdcx token's role/pause state (no transactions).
 *   npm run usdcx:state
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { bufferCV, principalCV } from "@stacks/transactions";
import { loadConfig } from "../src/config.js";
import { callReadOnly } from "../src/stacks.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

const ROLE = { governance: Uint8Array.from([0]), mint: Uint8Array.from([1]), pause: Uint8Array.from([2]) };

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  const usdcx = { address: cfg.usdcx.address, name: cfg.usdcx.name };
  const sender = cfg.senderAddress ?? usdcx.address;
  const me = cfg.senderAddress ?? "(no signer in .env)";
  const gov = usdcx.address; // deployer/governance principal

  const ro = (fn: string, args: any[]) =>
    callReadOnly({ network: cfg.network, senderAddress: sender, contractAddress: usdcx.address, contractName: usdcx.name, functionName: fn, functionArgs: args });

  const hasRole = async (roleName: keyof typeof ROLE, who: string) => {
    if (who.startsWith("(")) return "n/a";
    const r = await ro("is-protocol-caller", [bufferCV(ROLE[roleName]), principalCV(who)]);
    return r?.success === true ? "YES" : "no";
  };

  const paused = await ro("is-protocol-paused", []);
  console.log(`usdcx: ${usdcx.address}.${usdcx.name}\n`);
  console.log(`paused: ${paused?.value === true ? "YES ⚠" : "no"}`);
  console.log(`\ngovernance principal ${gov}:`);
  console.log(`  governance role: ${await hasRole("governance", gov)}`);
  console.log(`  mint role:       ${await hasRole("mint", gov)}`);
  console.log(`\nyour account ${me}:`);
  console.log(`  governance role: ${await hasRole("governance", me)}`);
  console.log(`  mint role:       ${await hasRole("mint", me)}`);

  try {
    const bal = await ro("get-balance", [principalCV(me.startsWith("(") ? gov : me)]);
    console.log(`\nyour USDCx balance (micro): ${bal?.value?.value ?? bal?.value ?? "?"}`);
  } catch { /* ignore */ }
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
