/**
 * Shared types for the rebuilt xtrata-drops-v3 sponsor relayer.
 *
 * Platform-agnostic core: everything here runs in Node (vitest) and in
 * Cloudflare Workers. All chain access goes through the injectable
 * ChainTransport so tests can substitute a fake chain.
 */
import type { ClarityValue, StacksTransactionWire } from '@stacks/transactions';

// ---------------------------------------------------------------- config

export type RelayerNetwork = 'mainnet' | 'testnet';

export interface RelayerConfig {
  network: RelayerNetwork;
  /** Fully-qualified drops contract id, e.g. SP...xtrata-drops-v3 — the ONLY allowlisted contract. */
  dropsContractId: string;
  /** Fully-qualified pinned core NFT contract id (ALLOWED-NFT-CONTRACT in the drops contract). */
  nftContractId: string;
  /** NFT asset name declared by the core contract. */
  nftAssetName: string;
  /** Chain id used inside attestation payloads (mainnet 1, testnet 2147483648). */
  chainId: bigint;
  /** Sponsor hot-wallet private key (hex, with 01 compression suffix). */
  sponsorKey: string;
  /** Attestor private key for signed-eligibility drops (optional). */
  attestorKey?: string;
  /** Fee multiplier applied to the network estimate. */
  feeMultiplier: bigint;
  /** Absolute per-claim fee ceiling (also enforced on-chain via claim-fee-cap). */
  maxFeeUstx: bigint;
  /** Fallback fee estimate when the transport cannot supply one. */
  fallbackFeeUstx: bigint;
  /** Refuse to sponsor when the hot wallet balance falls below this floor. */
  floatFloorUstx: bigint;
  /** Global cap on unsettled jobs. */
  maxUnsettled: number;
  /** Rolling per-wallet accepted-job limit. */
  ratePerWallet: number;
  /** Rolling per-origin (transport-level caller key) accepted-job limit. */
  ratePerOrigin: number;
  /** Rolling window for both rate limits, ms. */
  rateWindowMs: number;
  /** Jobs advanced per settle() pass. */
  settleBatch: number;
  /** Lease timeout for in-flight signing states, ms. */
  leaseTimeoutMs: number;
  /** Max acceptable per-drop float loss (fees fronted − reimbursed) before auto-shutdown. */
  maxFloatLossUstx: bigint;
  /** Attestation validity in blocks. */
  attestationTtlBlocks: bigint;
  /** Max accepted tx hex length. */
  maxTxHexChars: number;
  /** Global kill switch. */
  disabled?: boolean;
  /** Per-drop deny list. */
  deniedDrops?: Set<string>;
}

export const defaultConfig = (
  overrides: Partial<RelayerConfig> &
    Pick<RelayerConfig, 'dropsContractId' | 'nftContractId' | 'sponsorKey'>
): RelayerConfig => ({
  network: 'mainnet',
  nftAssetName: 'xtrata-inscription',
  chainId: 1n,
  feeMultiplier: 3n,
  maxFeeUstx: 2_000_000n,
  fallbackFeeUstx: 30_000n,
  floatFloorUstx: 5_000_000n, // 5 STX
  maxUnsettled: 20,
  ratePerWallet: 5,
  ratePerOrigin: 20,
  rateWindowMs: 3_600_000,
  settleBatch: 4,
  leaseTimeoutMs: 15 * 60_000,
  maxFloatLossUstx: 10_000_000n,
  attestationTtlBlocks: 100n,
  maxTxHexChars: 20_000,
  ...overrides
});

// ---------------------------------------------------------------- chain transport

export type TxStatus =
  | 'pending'
  | 'success'
  | 'abort_by_response'
  | 'abort_by_post_condition'
  | 'dropped'
  | 'not_found';

export type BroadcastResult =
  | { ok: true; txid: string }
  | { ok: false; error: string; reason?: string };

/** Read-only + broadcast surface of a Stacks node. Injectable for tests. */
export interface ChainTransport {
  getAccountNonce(address: string): Promise<bigint>;
  getBalance(address: string): Promise<bigint>;
  getTipHeight(): Promise<bigint>;
  estimateFeeUstx(): Promise<bigint>;
  /** call-read; args are serialized Clarity hex values; returns the decoded result CV or null. */
  callReadOnly(contractId: string, fn: string, argsHex: string[]): Promise<ClarityValue | null>;
  /** Broadcast a serialized tx. Must NOT throw on rejection — return {ok:false}. */
  broadcast(txHex: string, expectedTxid: string): Promise<BroadcastResult>;
  isTxKnown(txid: string): Promise<boolean>;
  getTxStatus(txid: string): Promise<TxStatus>;
}

// ---------------------------------------------------------------- validation facts

export type SponsoredFunction = 'claim' | 'claim-signed' | 'reserve-claim';

/** Facts derived exclusively from the submitted signed transaction. */
export interface ValidatedSponsorCall {
  transaction: StacksTransactionWire;
  txHex: string;
  /** Origin (claimer) txid — stable regardless of sponsor fee/nonce. */
  originTxid: string;
  contractId: string;
  functionName: SponsoredFunction;
  /** c32 address of the origin signer (the claimer). */
  origin: string;
  dropId: bigint;
  /** claim-signed only */
  expiresAt?: bigint;
  /** claim-signed only, hex */
  signature?: string;
  /** true when the tx carries the single allowed NFT post-condition */
  hasNftPostCondition: boolean;
}

export type ValidationErrorCode =
  | 'BAD_TX'
  | 'TX_TOO_LARGE'
  | 'NOT_SPONSORED'
  | 'NONZERO_FEE'
  | 'NOT_CONTRACT_CALL'
  | 'CONTRACT_NOT_ALLOWED'
  | 'FUNCTION_NOT_ALLOWED'
  | 'BAD_ARGS'
  | 'WRONG_NETWORK'
  | 'PC_MODE'
  | 'WRONG_POST_CONDITIONS'
  | 'UNSUPPORTED_ORIGIN';

export type ValidationResult =
  | { ok: true; facts: ValidatedSponsorCall }
  | { ok: false; code: ValidationErrorCode; detail?: string };

// ---------------------------------------------------------------- preflight

export type PreflightErrorCode =
  | 'DROP_NOT_FOUND'
  | 'DROP_NOT_ACTIVE'
  | 'DROP_NOT_SPONSORED'
  | 'CONTRACT_PAUSED'
  | 'WINDOW_CLOSED'
  | 'BUDGET_EXHAUSTED'
  | 'WALLET_LIMIT'
  | 'SOLD_OUT'
  | 'WRONG_ELIGIBILITY';

export type PreflightResult =
  | {
      ok: true;
      budgetRemaining: bigint;
      claimFeeCap: bigint;
      hasReservation: boolean;
    }
  | { ok: false; code: PreflightErrorCode; detail?: string };

// ---------------------------------------------------------------- jobs

export type JobState =
  | 'RECEIVED'
  | 'SIGNING'
  | 'SPONSORED'
  | 'CONFIRMED'
  | 'FEE_CLAIMING'
  | 'FEE_CLAIMED'
  | 'REFUNDING'
  | 'SETTLED'
  | 'FAILED'
  | 'ABANDONED';

export interface JobRecord {
  id: string;
  state: JobState;
  contractId: string;
  functionName: SponsoredFunction;
  dropId: string;
  claimer: string;
  originKey: string;
  payloadHash: string;
  txHex: string;
  feeUstx: string;
  sponsorTxid: string | null;
  sponsorNonce: string | null;
  claimFeeTxid: string | null;
  refundTxid: string | null;
  error: string | null;
  leaseOwner: string | null;
  leaseExpiresAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface JobInsert {
  id: string;
  contractId: string;
  functionName: SponsoredFunction;
  dropId: string;
  claimer: string;
  originKey: string;
  payloadHash: string;
  txHex: string;
  feeUstx: string;
}

export type InsertOutcome =
  | { ok: true; job: JobRecord }
  | { ok: false; code: 'DUPLICATE_PAYLOAD'; job: JobRecord }
  | { ok: false; code: 'DUPLICATE_CLAIM'; job: JobRecord };

export interface JobStore {
  insert(row: JobInsert, now: number): Promise<InsertOutcome>;
  get(id: string): Promise<JobRecord | null>;
  getByPayloadHash(hash: string): Promise<JobRecord | null>;
  /**
   * Atomic compare-and-set state transition. Applies patch + lease only when
   * the job is currently in `from`; returns the updated row iff exactly one
   * row changed, else null.
   */
  cas(
    id: string,
    from: JobState,
    to: JobState,
    patch: Partial<JobRecord>,
    lease: { owner: string; expiresAt: number } | null,
    now: number
  ): Promise<JobRecord | null>;
  listByState(state: JobState, limit: number): Promise<JobRecord[]>;
  countUnsettled(): Promise<number>;
  countAcceptedSince(field: 'claimer' | 'originKey', value: string, since: number): Promise<number>;
  /** Revert expired leases one state back (SIGNING→RECEIVED, FEE_CLAIMING→CONFIRMED, REFUNDING→FEE_CLAIMED). */
  reapExpiredLeases(now: number): Promise<number>;
}

/** Legal forward transitions (lease-reap reversals handled separately). */
export const JOB_TRANSITIONS: Record<JobState, JobState[]> = {
  RECEIVED: ['SIGNING', 'FAILED', 'ABANDONED'],
  SIGNING: ['SPONSORED', 'RECEIVED', 'FAILED'],
  SPONSORED: ['CONFIRMED', 'FAILED', 'ABANDONED'],
  CONFIRMED: ['FEE_CLAIMING', 'ABANDONED'],
  FEE_CLAIMING: ['FEE_CLAIMED', 'CONFIRMED', 'FAILED'],
  FEE_CLAIMED: ['REFUNDING', 'SETTLED'],
  REFUNDING: ['SETTLED', 'FEE_CLAIMED'],
  SETTLED: [],
  FAILED: [],
  ABANDONED: []
};

export const UNSETTLED_STATES: JobState[] = [
  'RECEIVED',
  'SIGNING',
  'SPONSORED',
  'CONFIRMED',
  'FEE_CLAIMING'
];

// ---------------------------------------------------------------- audit

export interface DropAuditEntry {
  dropId: string;
  feesFrontedUstx: bigint;
  feesReimbursedUstx: bigint;
  sponsoredTxids: string[];
  shutdown: boolean;
}

// ---------------------------------------------------------------- errors

export class RelayerError extends Error {
  constructor(
    public readonly code: string,
    message?: string,
    public readonly httpStatus = 400
  ) {
    super(message ?? code);
  }
}
