/**
 * Central config. Single source of truth for network + both protocols'
 * contract coordinates. Everything is env-driven so the same code runs against
 * testnet (demo) or mainnet (once FlowVault ships to mainnet).
 */
import { StacksMainnet, StacksTestnet, type StacksNetwork } from "@stacks/network";
import { getAddressFromPrivateKey, TransactionVersion } from "@stacks/transactions";
import { generateWallet, generateNewAccount } from "@stacks/wallet-sdk";

export type NetworkName = "testnet" | "mainnet";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function opt(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export interface FlowProofConfig {
  networkName: NetworkName;
  network: StacksNetwork;
  /** Present only when a server signer is configured (autonomous mode). */
  senderKey?: string;
  /** Derived from senderKey when present. */
  senderAddress?: string;

  flowvault: { address: string; name: string };
  usdcx: { address: string; name: string };
  xtrata: { address: string; name: string };

  xtrataIndexBaseUrl: string;
}

export async function loadConfig(): Promise<FlowProofConfig> {
  const networkName = (opt("NETWORK", "testnet") as NetworkName);
  if (networkName !== "testnet" && networkName !== "mainnet") {
    throw new Error(`NETWORK must be "testnet" or "mainnet", got "${networkName}"`);
  }
  const network: StacksNetwork =
    networkName === "mainnet" ? new StacksMainnet() : new StacksTestnet();

  // Signer accepts EITHER a hex private key OR a 12/24-word seed phrase.
  // A seed phrase is derived to a key locally (never leaves this process); the
  // account matching XTRATA_CONTRACT_ADDRESS (the deployer/owner) is selected.
  const tv = networkName === "mainnet" ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
  const rawSigner = opt("STACKS_PRIVATE_KEY").trim();
  let senderKey: string | undefined;
  let senderAddress: string | undefined;
  if (rawSigner) {
    if (/\s/.test(rawSigner) && rawSigner.split(/\s+/).length >= 12) {
      let wallet = await generateWallet({ secretKey: rawSigner, password: "" });
      for (let i = 1; i < 5; i++) wallet = generateNewAccount(wallet);
      const want = opt("XTRATA_CONTRACT_ADDRESS").trim();
      const cands = wallet.accounts.map((a) => ({
        key: a.stxPrivateKey,
        addr: getAddressFromPrivateKey(a.stxPrivateKey, tv),
      }));
      const chosen = (want ? cands.find((c) => c.addr === want) : undefined) ?? cands[0];
      if (!chosen) throw new Error("Could not derive an account from the provided seed phrase.");
      senderKey = chosen.key;
      senderAddress = chosen.addr;
    } else {
      senderKey = rawSigner;
      senderAddress = getAddressFromPrivateKey(rawSigner, tv);
    }
  }

  return {
    networkName,
    network,
    senderKey,
    senderAddress,
    flowvault: { address: req("FLOWVAULT_CONTRACT_ADDRESS"), name: req("FLOWVAULT_CONTRACT_NAME") },
    usdcx: { address: req("USDCX_CONTRACT_ADDRESS"), name: req("USDCX_CONTRACT_NAME") },
    xtrata: { address: req("XTRATA_CONTRACT_ADDRESS"), name: opt("XTRATA_CONTRACT_NAME", "xtrata-v3-2-3") },
    xtrataIndexBaseUrl: opt("XTRATA_INDEX_BASE_URL"),
  };
}

/** Coordinates known/verified at build time, for docs and dry-run output. */
export const KNOWN = {
  flowvaultTestnet: "STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.flowvault-v2",
  usdcxTestnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx",
  xtrataMainnet: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3",
} as const;
