/**
 * Independent, trustless verifier for a Proof-of-Flow receipt.
 *
 *   npm run verify <receiptId>
 *
 * Using only public on-chain data, it checks:
 *   1. INTEGRITY  - recompute the content hash from the on-chain chunks and
 *      compare to the inscription's stored final-hash (tamper-evident).
 *   2. LINEAGE    - on-chain parents/dependencies match the receipt's links.
 *   3. MONEY      - the receipt's amounts match the REAL FlowVault event:
 *        - orchestrated: the deposit tx named in the receipt
 *        - atomic: the receipt's own mint tx (found via NFT history) must be a
 *          flowproof-treasury call carrying the matching FlowVault deposit event
 *          -> proves money + record happened in the same transaction.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { cvToHex, cvToJSON, hexToCV, uintCV } from "@stacks/transactions";
import { loadConfig } from "../src/config.js";
import { XtrataClient } from "../src/xtrata.js";
import { chunkBytes, computeExpectedHash, toHex } from "../src/receipt.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

const eq = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const line = (ok: boolean | null, label: string, detail = "") =>
  console.log(`  ${ok === null ? "--" : ok ? "PASS" : "FAIL"}  ${label}${detail ? "  " + detail : ""}`);

async function main() {
  loadDotEnv();
  const cfg = await loadConfig();
  const idArg = process.argv.slice(2).find((a) => /^\d+$/.test(a));
  if (!idArg) {
    console.error("Usage: npm run verify <receiptId>");
    process.exit(1);
  }
  const id = Number(idArg);
  const api = cfg.networkName === "mainnet" ? "https://api.hiro.so" : "https://api.testnet.hiro.so";
  const fvId = `${cfg.flowvault.address}.${cfg.flowvault.name}`;
  const treasuryId = `${cfg.treasury.address}.${cfg.treasury.name}`;

  const record = new XtrataClient({
    network: cfg.network,
    contractAddress: cfg.xtrata.address,
    contractName: cfg.xtrata.name,
    senderKey: cfg.senderKey ?? "00".repeat(32),
    senderAddress: cfg.senderAddress ?? cfg.xtrata.address,
  });

  console.log(`Verifying receipt #${id} on ${cfg.xtrata.address}.${cfg.xtrata.name}\n`);

  const [onChainHash, parents, deps, bytes] = await Promise.all([
    record.getInscriptionHash(id),
    record.getParents(id),
    record.getDependencies(id),
    record.readContentBytes(id),
  ]);

  // 1) Integrity
  const computed = `0x${toHex(computeExpectedHash(chunkBytes(bytes)))}`;
  const hashOk = !!onChainHash && computed.toLowerCase() === onChainHash.toLowerCase();
  line(hashOk, "integrity: content hash == on-chain final-hash", hashOk ? "" : `(computed ${computed} vs ${onChainHash})`);

  let receipt: any = null;
  try { receipt = JSON.parse(Buffer.from(bytes).toString("utf8")); } catch { /* not json */ }
  if (!receipt || receipt.std !== "flowproof.receipt") {
    console.log("\n(Not a flowproof.receipt; only integrity is applicable.)");
    process.exit(hashOk ? 0 : 1);
  }
  console.log(`  receipt: mode=${receipt.mode} flow=${receipt.flow} amount=${receipt.amount} token=${receipt.token}`);

  // 2) Lineage
  const expParents = receipt.links.prevReceipt != null ? [receipt.links.prevReceipt] : [];
  const expDeps = [receipt.links.assetInscription];
  const lineageOk = eq(parents, expParents) && eq(deps, expDeps);
  line(lineageOk, "lineage: on-chain parents/deps == receipt links",
    `parents ${JSON.stringify(parents)} deps ${JSON.stringify(deps)}`);

  // 3) Money cross-check
  const isWithdraw = receipt.flow === "withdrawal";
  const eventName = isWithdraw ? "withdraw" : "deposit";
  let txid: string | null = receipt.depositTxid && receipt.depositTxid.length >= 64 ? receipt.depositTxid : null;
  let atomic = false;
  if (!txid && receipt.mode === "atomic") {
    txid = await findMintTx(api, cfg.xtrata.address, cfg.xtrata.name, id);
    atomic = true;
  }

  if (!txid) {
    line(null, "money: no tx to cross-check (atomic mint tx not found)");
  } else {
    const tx = await fetchTx(api, txid);
    const ev = findEvent(tx, fvId, eventName);
    if (!ev) {
      line(false, `money: FlowVault '${eventName}' event in tx`, txid);
    } else {
      const amount = ev["amount"]?.value;
      let ok = String(amount) === String(receipt.amount);
      let detail = `amount ${amount}`;
      if (!isWithdraw) {
        const split = ev["split-amount"]?.value ?? "0";
        const lock = ev["lock-amount"]?.value ?? "0";
        const hold = ev["hold-amount"]?.value ?? "0";
        const expSplit = receipt.split?.amount ?? "0";
        const expLock = receipt.lock?.amount ?? "0";
        const expHold = (BigInt(receipt.unlocked) + BigInt(expLock)).toString();
        ok = ok && String(split) === String(expSplit) && String(lock) === String(expLock) && String(hold) === String(expHold);
        detail = `amount ${amount}, split ${split}, lock ${lock}, hold ${hold}`;
      }
      line(ok, `money: receipt matches real FlowVault ${eventName} event`, detail);
      if (atomic) {
        const sameTxTreasury = tx?.contract_call?.contract_id === treasuryId;
        line(sameTxTreasury, "atomicity: deposit + inscription in one flowproof-treasury tx", txid);
      } else {
        console.log(`        deposit tx: ${txid}`);
      }
    }
  }

  console.log("\nDone.");
}

async function fetchTx(api: string, txid: string): Promise<any> {
  const r = await fetch(`${api}/extended/v1/tx/0x${txid.replace(/^0x/, "")}`);
  return r.ok ? r.json() : null;
}

function findEvent(tx: any, contractId: string, eventName: string): any | null {
  for (const e of tx?.events ?? []) {
    if (e.event_type === "smart_contract_log" && e.contract_log?.contract_id === contractId) {
      try {
        const cv: any = cvToJSON(hexToCV(e.contract_log.value.hex));
        if (cv?.value?.event?.value === eventName) return cv.value;
      } catch { /* skip */ }
    }
  }
  return null;
}

async function findMintTx(api: string, addr: string, name: string, id: number): Promise<string | null> {
  const asset = `${addr}.${name}::xtrata-inscription`;
  const value = cvToHex(uintCV(id));
  const r = await fetch(`${api}/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(asset)}&value=${value}`);
  if (!r.ok) return null;
  const j: any = await r.json();
  const results: any[] = j.results ?? [];
  const mint = results.find((e) => e.asset_event_type === "mint") ?? results[results.length - 1];
  return mint?.tx_id ?? null;
}

main().catch((e) => {
  console.error("\nError:", e instanceof Error ? e.message : e);
  process.exit(1);
});
