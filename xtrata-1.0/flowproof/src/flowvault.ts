/**
 * FlowVault client (money layer) — wraps flowvault-sdk@0.1.1 in backend signer
 * mode for the autonomous orchestrator.
 *
 * The SDK is loaded dynamically so the rest of the scaffold typechecks and the
 * local dry-run runs even before `npm install flowvault-sdk`. When you run the
 * live demo, install it and provide STACKS_PRIVATE_KEY.
 *
 * Routing pipeline (deterministic, from docs.flow-vault.dev/docs/contracts):
 *   deposit -> split (to splitAddress) -> lock (until block) -> hold remainder.
 */
import type { RoutingRules, VaultStateSnapshot } from "./types.js";

export interface FlowVaultClientOpts {
  networkName: "testnet" | "mainnet";
  contractAddress: string;
  contractName: string; // "flowvault-v2"
  tokenContractAddress: string;
  tokenContractName: string; // "usdcx"
  senderKey: string;
  senderAddress: string;
}

export class FlowVaultClient {
  private vault: any; // flowvault-sdk FlowVault instance

  constructor(private readonly o: FlowVaultClientOpts) {}

  private async sdk(): Promise<any> {
    if (this.vault) return this.vault;
    // Non-literal specifier: keeps tsc from statically requiring the module.
    const moduleName = "flowvault-sdk";
    let mod: any;
    try {
      mod = await import(moduleName);
    } catch {
      throw new Error(
        "flowvault-sdk is not installed. Run `npm install flowvault-sdk@0.1.1` to run the live demo."
      );
    }
    const FlowVault = mod.FlowVault ?? mod.default?.FlowVault ?? mod.default;
    this.vault = new FlowVault({
      network: this.o.networkName,
      contractAddress: this.o.contractAddress,
      contractName: this.o.contractName,
      tokenContractAddress: this.o.tokenContractAddress,
      tokenContractName: this.o.tokenContractName,
      senderKey: this.o.senderKey,
    });
    return this.vault;
  }

  async setRoutingRules(rules: RoutingRules): Promise<string> {
    const v = await this.sdk();
    const res = await v.setRoutingRules({
      lockAmount: rules.lockAmount,
      lockUntilBlock: rules.lockUntilBlock,
      splitAddress: rules.splitAddress,
      splitAmount: rules.splitAmount,
    });
    return normalizeTxid(res);
  }

  async deposit(amount: string): Promise<string> {
    const v = await this.sdk();
    return normalizeTxid(await v.deposit(amount));
  }

  async withdraw(amount: string): Promise<string> {
    const v = await this.sdk();
    return normalizeTxid(await v.withdraw(amount));
  }

  async clearRoutingRules(): Promise<string> {
    const v = await this.sdk();
    return normalizeTxid(await v.clearRoutingRules());
  }

  async getCurrentBlockHeight(): Promise<number> {
    const v = await this.sdk();
    return Number(await v.getCurrentBlockHeight(this.o.senderAddress));
  }

  /** Normalize the SDK's getVaultState into our snapshot shape. */
  async getVaultState(address?: string): Promise<VaultStateSnapshot> {
    const v = await this.sdk();
    const who = address ?? this.o.senderAddress;
    const raw: any = await v.getVaultState(who);
    const rules: RoutingRules = {
      lockAmount: String(raw.lockAmount ?? raw.rules?.lockAmount ?? "0"),
      lockUntilBlock: Number(raw.lockUntilBlock ?? raw.rules?.lockUntilBlock ?? 0),
      splitAddress: raw.splitAddress ?? raw.rules?.splitAddress ?? null,
      splitAmount: String(raw.splitAmount ?? raw.rules?.splitAmount ?? "0"),
    };
    return {
      lockedBalance: String(raw.lockedBalance ?? raw.locked ?? "0"),
      unlockedBalance: String(raw.unlockedBalance ?? raw.unlocked ?? "0"),
      rules,
    };
  }
}

function normalizeTxid(res: any): string {
  const txid = res?.txid ?? res?.tx_id ?? res?.txId ?? (typeof res === "string" ? res : undefined);
  if (!txid) throw new Error(`FlowVault call returned no txid: ${JSON.stringify(res)}`);
  return String(txid);
}
