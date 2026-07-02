/**
 * Proof-of-Flow receipt schema.
 *
 * A receipt is the canonical, on-chain record of ONE FlowVault flow. It is
 * serialized to compact JSON, inscribed via Xtrata v3.2.3 in a single tx, and
 * linked into a lineage:
 *   - dependencies = [assetInscriptionId]  (the work this money concerns; must exist)
 *   - parents      = [prevReceiptId]       (the previous receipt in the chain)
 *
 * Because Xtrata stores the bytes on-chain and dedupes by content hash, every
 * receipt is independently verifiable and the chain cannot be edited or lost.
 */

export type FlowKind = "royalty-split" | "payroll" | "dao-payout" | "savings-lock" | "withdrawal";

/** How the receipt was produced: app-orchestrated (2 txs) or atomic (1 tx, Pattern B). */
export type ReceiptMode = "orchestrated" | "atomic";

/** Mirrors FlowVault's principal-scoped routing rule model. */
export interface RoutingRules {
  /** micro-units of the SIP-010 token moved to LOCKED balance each deposit. */
  lockAmount: string;
  /** absolute chain height at which the locked amount unlocks. */
  lockUntilBlock: number;
  /** optional principal receiving the split transfer (null = no split). */
  splitAddress: string | null;
  /** fixed per-deposit amount sent to splitAddress (micro-units). */
  splitAmount: string;
}

/** Snapshot of FlowVault state after a deposit (from get-vault-state). */
export interface VaultStateSnapshot {
  lockedBalance: string;
  unlockedBalance: string;
  rules: RoutingRules;
}

export interface ReceiptLinks {
  /** Inscription id of the asset/work this flow concerns. */
  assetInscription: number;
  /** Token id of the previous receipt in this lineage, if any. */
  prevReceipt: number | null;
}

export interface FlowReceipt {
  std: "flowproof.receipt";
  v: 1;
  mode: ReceiptMode;
  flow: FlowKind;
  /** "<address>.<name>" of the FlowVault contract used. */
  vault: string;
  /** SIP-010 token symbol, e.g. "usdcx". */
  token: string;
  /** deposit amount in micro-units. */
  amount: string;
  /** the split that executed, if any. */
  split: { to: string; amount: string } | null;
  /** the lock that executed, if any. */
  lock: { amount: string; untilBlock: number } | null;
  /** remaining unlocked amount held for the owner. */
  unlocked: string;
  /** FlowVault deposit transaction id. */
  depositTxid: string;
  /** chain height at receipt creation. */
  block: number;
  /** ISO timestamp (advisory; chain height is authoritative). */
  ts: string;
  /** lineage pointers (also encoded as Xtrata dependencies/parents). */
  links: ReceiptLinks;
}

/** Result of inscribing a receipt on Xtrata. */
export interface InscriptionResult {
  tokenId: number;
  existed: boolean;
  txid: string;
  contentHashHex: string;
}

/** Full outcome of one orchestrated flow: money moved + proof inscribed. */
export interface ProofOfFlowResult {
  depositTxid: string;
  vaultState: VaultStateSnapshot;
  receipt: FlowReceipt;
  inscription: InscriptionResult;
}
