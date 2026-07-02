/**
 * Print a contract's public/read-only functions (to discover how to get tokens).
 *
 *   npm run inspect                                   # inspects the configured USDCx
 *   npm run inspect ST1....usdcx                      # inspects a specific contract
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadDotEnv() {
  const p = resolve(__dirname, "../.env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[1] && process.env[m[1]] === undefined) process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

const short = (t: any): string =>
  typeof t === "string" ? t : JSON.stringify(t).replace(/[{}"]/g, "").slice(0, 40);

async function main() {
  loadDotEnv();
  const net = process.env.NETWORK || "testnet";
  const api = net === "mainnet" ? "https://api.hiro.so" : "https://api.testnet.hiro.so";
  const id =
    process.argv.slice(2).find((a) => a.includes(".")) ||
    `${process.env.USDCX_CONTRACT_ADDRESS}.${process.env.USDCX_CONTRACT_NAME}`;
  const [addr, name] = id.split(".");

  const url = `${api}/v2/contracts/interface/${addr}/${name}`;
  console.log(`Inspecting ${id} (${net})\n${url}\n`);
  const r = await fetch(url);
  if (!r.ok) {
    console.error(`HTTP ${r.status} ${r.statusText}`);
    process.exit(1);
  }
  const j: any = await r.json();
  const fns: any[] = j.functions || [];
  const pub = fns.filter((f) => f.access === "public");
  const ro = fns.filter((f) => f.access === "read_only");

  console.log("PUBLIC functions:");
  for (const f of pub) console.log(`  ${f.name}(${(f.args || []).map((a: any) => `${a.name}: ${short(a.type)}`).join(", ")})`);
  console.log("\nREAD-ONLY functions:");
  for (const f of ro) console.log(`  ${f.name}(${(f.args || []).map((a: any) => `${a.name}: ${short(a.type)}`).join(", ")})`);

  const minty = pub.filter((f) => /mint|faucet|gift|drip|claim|get-token/i.test(f.name));
  console.log("\nLikely token-getters:", minty.length ? minty.map((f) => f.name).join(", ") : "none found");

  if (process.argv.includes("--source")) {
    const sres = await fetch(`${api}/v2/contracts/source/${addr}/${name}?proof=0`);
    if (sres.ok) {
      const sj: any = await sres.json();
      const outp = resolve(__dirname, `../${name}-source.clar`);
      writeFileSync(outp, sj.source || "");
      console.log(`\nWrote source → ${outp}`);
    } else {
      console.error(`\nsource HTTP ${sres.status}`);
    }
  }
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
