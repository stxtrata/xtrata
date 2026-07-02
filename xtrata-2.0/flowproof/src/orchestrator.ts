/**
 * Proof-of-Flow orchestrator — the composition that makes this a bounty entry,
 * not two SDKs side by side.
 *
 * runFlow():
 *   1. FlowVault.setRoutingRules  (split + time-lock behavior)
 *   2. FlowVault.deposit          (executes split -> lock -> hold on-chain)
 *   3. FlowVault.getVaultState    (read the resulting truth)
 *   4. build canonical receipt    (what actually happened)
 *   5. Xtrata.inscribeReceipt     (permanent, recursively linked to asset + prev receipt)
 *
 * The returned receipt id becomes the `prevReceipt` of the next flow, growing an
 * immutable lineage: asset <- R1 <- R2 <- ...  queryable via Xtrata.
 */
import type { FlowVaultClient } from "./flowvault.js";
import type { XtrataClient } from "./xtrata.js";
import { prepareReceiptInscription } from "./receipt.js";
import type {
  FlowKind,
  FlowReceipt,
  ProofOfFlowResult,
  ReceiptMode,
  RoutingRules,
} from "./types.js";

export interface RunFlowParams {
  flow: FlowKind;
  /** Inscription id of the work/asset this money concerns. */
  assetInscription: number;
  /** Deposit amount in micro-units of the SIP-010 token. */
  amount: string;
  /** Routing rules to apply for this deposit. */
  rules: RoutingRules;
  /** Previous receipt id to chain from (null for the first in a lineage). */
  prevReceipt?: number | null;
  /** Skip setRoutingRules if the vault is already configured. */
  rulesAlreadySet?: boolean;
}

export class ProofOfFlow {
  constructor(
    private readonly money: FlowVaultClient,
    private readonly record: XtrataClient,
    private readonly ctx: { vaultId: string; tokenSymbol: string }
  ) {}

  async runFlow(p: RunFlowParams): Promise<ProofOfFlowResult> {
    if (!p.rulesAlreadySet) {
      await this.money.setRoutingRules(p.rules);
    }

    const depositTxid = await this.money.deposit(p.amount);
    const vaultState = await this.money.getVaultState();
    const block = await this.money.getCurrentBlockHeight();

    const receipt = buildReceipt({
      flow: p.flow,
      vaultId: this.ctx.vaultId,
      tokenSymbol: this.ctx.tokenSymbol,
      amount: p.amount,
      rules: p.rules,
      depositTxid,
      block,
      assetInscription: p.assetInscription,
      prevReceipt: p.prevReceipt ?? null,
    });

    const inscription = await this.record.inscribeReceipt(receipt);
    return { depositTxid, vaultState, receipt, inscription };
  }
}

export interface BuildReceiptInput {
  flow: FlowKind;
  vaultId: string;
  tokenSymbol: string;
  amount: string;
  rules: RoutingRules;
  depositTxid: string;
  block: number;
  assetInscription: number;
  prevReceipt: number | null;
  /** "orchestrated" (default) or "atomic" (Pattern B, deposit+inscribe in one tx). */
  mode?: ReceiptMode;
}

/** Pure: derive the canonical receipt from inputs + the rules that executed. */
export function buildReceipt(i: BuildReceiptInput): FlowReceipt {
  const amount = BigInt(i.amount);
  const splitAmount = i.rules.splitAddress ? BigInt(i.rules.splitAmount) : 0n;
  const lockAmount = BigInt(i.rules.lockAmount);
  const unlocked = amount - splitAmount - lockAmount;
  if (unlocked < 0n) {
    throw new Error("split + lock exceed deposit — FlowVault would abort this deposit");
  }

  return {
    std: "flowproof.receipt",
    v: 1,
    mode: i.mode ?? "orchestrated",
    flow: i.flow,
    vault: i.vaultId,
    token: i.tokenSymbol,
    amount: i.amount,
    split: i.rules.splitAddress
      ? { to: i.rules.splitAddress, amount: i.rules.splitAmount }
      : null,
    lock: lockAmount > 0n
      ? { amount: i.rules.lockAmount, untilBlock: i.rules.lockUntilBlock }
      : null,
    unlocked: unlocked.toString(),
    depositTxid: i.depositTxid,
    block: i.block,
    ts: new Date().toISOString(),
    links: { assetInscription: i.assetInscription, prevReceipt: i.prevReceipt },
  };
}

/** Local preview of what would be inscribed (no network). Used by --dry-run. */
export function previewInscription(receipt: FlowReceipt) {
  const prep = prepareReceiptInscription(receipt);
  return {
    receipt,
    contentHashHex: prep.expectedHashHex,
    totalSize: prep.totalSize,
    totalChunks: prep.chunks.length,
    mime: prep.mime,
    tokenUri: prep.tokenUri,
    dependencies: [receipt.links.assetInscription],
    parents: receipt.links.prevReceipt != null ? [receipt.links.prevReceipt] : [],
    contractFunction: "mint-single-tx-with-relationships",
  };
}
