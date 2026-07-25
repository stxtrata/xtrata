/**
 * Authorization pipeline for /sponsor/v3/submit.
 *
 * THE SIGNED TRANSACTION IS THE SOLE SOURCE OF TRUTH (threat 17,
 * FABLE-5 finding 1). Every fact the relayer acts on — contract, function,
 * drop id, claimer — is decoded from the submitted signed transaction.
 * Request-body hints are advisory; any mismatch is a hard reject upstream
 * (see sponsor.ts submit()).
 *
 * xtrata-drops-v3 signature notes (deviations from the v1 handoff shape):
 * - claim / reserve-claim take a single (drop-id uint) argument. There is NO
 *   NFT trait argument: the core NFT contract is a compile-time constant in
 *   the drops contract, so the relayer checks the post-condition asset
 *   against its configured pin instead of a signed trait arg.
 * - claim-signed takes (drop-id uint, expires-at uint, signature (buff 65)).
 *
 * Post-condition policy: mode MUST be Deny; at most ONE post-condition is
 * accepted and, when present, it must be exactly a non-fungible `sent`
 * condition on the drops contract principal for the pinned core's
 * `xtrata-inscription` asset. Anything else — STX conditions on the sender,
 * FT conditions, extra NFT conditions, foreign assets — is rejected, so a
 * signed tx can never authorize STX to leave the claimer or more than one
 * NFT to move. (Clarity PCs cannot name a recipient; recipient == tx-sender
 * is enforced by the contract's settle-claim path itself.)
 */
import {
  AddressHashMode,
  AuthType,
  ClarityType,
  PayloadType,
  PostConditionMode,
  StacksWireType,
  addressToString,
  deserializeTransaction,
  wireToPostCondition
} from '@stacks/transactions';
import type {
  ContractCallPayload,
  PostConditionWire,
  SingleSigSpendingCondition,
  StacksTransactionWire
} from '@stacks/transactions';
import type { RelayerConfig, SponsoredFunction, ValidationResult } from './types.js';

const SPONSORED_FUNCTIONS: SponsoredFunction[] = ['claim', 'claim-signed', 'reserve-claim'];

const MAINNET_VERSION = 0; // TransactionVersion.Mainnet
const TESTNET_VERSION = 128;
const MAINNET_SINGLESIG = 22; // AddressVersion.MainnetSingleSig
const TESTNET_SINGLESIG = 26;

const isCanonicalHex = (hex: string) => /^(0x)?[0-9a-fA-F]+$/.test(hex) && hex.length % 2 === 0;

const uintArg = (arg: unknown): bigint | null => {
  const a = arg as { type?: ClarityType; value?: unknown } | undefined;
  return a?.type === ClarityType.UInt && typeof a.value === 'bigint' ? a.value : null;
};

const buffArg = (arg: unknown, length: number): string | null => {
  const a = arg as { type?: ClarityType; value?: unknown } | undefined;
  if (a?.type !== ClarityType.Buffer || typeof a.value !== 'string') return null;
  const hex = a.value.replace(/^0x/i, '');
  return hex.length === length * 2 ? hex : null;
};

/** Validate the single allowed post-condition shape. */
const checkPostConditions = (
  tx: StacksTransactionWire,
  cfg: RelayerConfig,
  origin: string
): { ok: true; hasNft: boolean } | { ok: false; detail: string } => {
  const pcs: PostConditionWire[] = tx.postConditions?.values ?? [];
  if (pcs.length > 1) return { ok: false, detail: 'more than one post-condition' };
  if (pcs.length === 0) return { ok: true, hasNft: false };
  let human;
  try {
    human = wireToPostCondition(pcs[0]!);
  } catch {
    return { ok: false, detail: 'undecodable post-condition' };
  }
  if (human.type !== 'nft-postcondition') {
    return { ok: false, detail: `only an NFT post-condition is allowed, got ${human.type}` };
  }
  if (human.address === origin) {
    return { ok: false, detail: 'post-condition must not authorize asset movement from the claimer' };
  }
  if (human.address !== cfg.dropsContractId) {
    return { ok: false, detail: 'NFT post-condition principal must be the drops contract' };
  }
  if (human.condition !== 'sent') {
    return { ok: false, detail: 'NFT post-condition code must be sent' };
  }
  const expectedAsset = `${cfg.nftContractId}::${cfg.nftAssetName}`;
  if (human.asset !== expectedAsset) {
    return { ok: false, detail: `NFT post-condition asset must be ${expectedAsset}` };
  }
  return { ok: true, hasNft: true };
};

export const validateSubmittedTx = (txHex: string, cfg: RelayerConfig): ValidationResult => {
  if (typeof txHex !== 'string' || txHex.length === 0) return { ok: false, code: 'BAD_TX' };
  if (txHex.length > cfg.maxTxHexChars) return { ok: false, code: 'TX_TOO_LARGE' };
  if (!isCanonicalHex(txHex)) return { ok: false, code: 'BAD_TX', detail: 'non-canonical hex' };

  let tx: StacksTransactionWire;
  try {
    tx = deserializeTransaction(txHex);
  } catch {
    return { ok: false, code: 'BAD_TX' };
  }

  if (tx.auth.authType !== AuthType.Sponsored) return { ok: false, code: 'NOT_SPONSORED' };

  const spending = tx.auth.spendingCondition;
  if (BigInt(spending.fee ?? 0n) !== 0n) return { ok: false, code: 'NONZERO_FEE' };
  // Only standard single-sig origins are supported: address derivation for
  // multisig/other spending conditions is not implemented (handoff hardening).
  if (spending.hashMode !== AddressHashMode.P2PKH) {
    return { ok: false, code: 'UNSUPPORTED_ORIGIN' };
  }

  const expectedVersion = cfg.network === 'mainnet' ? MAINNET_VERSION : TESTNET_VERSION;
  if (tx.transactionVersion !== expectedVersion) return { ok: false, code: 'WRONG_NETWORK' };

  if (tx.payload.payloadType !== PayloadType.ContractCall) {
    return { ok: false, code: 'NOT_CONTRACT_CALL' };
  }
  const payload = tx.payload as ContractCallPayload;
  const contractId = `${addressToString(payload.contractAddress)}.${payload.contractName.content}`;
  if (contractId !== cfg.dropsContractId) return { ok: false, code: 'CONTRACT_NOT_ALLOWED' };

  const functionName = payload.functionName.content as SponsoredFunction;
  if (!SPONSORED_FUNCTIONS.includes(functionName)) {
    return { ok: false, code: 'FUNCTION_NOT_ALLOWED' };
  }

  // --- signed-argument binding (drops-v3 shapes) ---
  const args = payload.functionArgs ?? [];
  let dropId: bigint | null = null;
  let expiresAt: bigint | undefined;
  let signature: string | undefined;
  if (functionName === 'claim' || functionName === 'reserve-claim') {
    if (args.length !== 1) return { ok: false, code: 'BAD_ARGS' };
    dropId = uintArg(args[0]);
  } else {
    if (args.length !== 3) return { ok: false, code: 'BAD_ARGS' };
    dropId = uintArg(args[0]);
    const exp = uintArg(args[1]);
    const sig = buffArg(args[2], 65);
    if (exp === null || sig === null) return { ok: false, code: 'BAD_ARGS' };
    expiresAt = exp;
    signature = sig;
  }
  if (dropId === null) return { ok: false, code: 'BAD_ARGS' };

  const origin = addressToString({
    type: StacksWireType.Address,
    version: cfg.network === 'mainnet' ? MAINNET_SINGLESIG : TESTNET_SINGLESIG,
    hash160: (spending as SingleSigSpendingCondition).signer
  });

  if (tx.postConditionMode !== PostConditionMode.Deny) return { ok: false, code: 'PC_MODE' };
  const pcCheck = checkPostConditions(tx, cfg, origin);
  if (!pcCheck.ok) return { ok: false, code: 'WRONG_POST_CONDITIONS', detail: pcCheck.detail };

  return {
    ok: true,
    facts: {
      transaction: tx,
      txHex: txHex.replace(/^0x/i, '').toLowerCase(),
      originTxid: tx.txid(),
      contractId,
      functionName,
      origin,
      dropId,
      expiresAt,
      signature,
      hasNftPostCondition: pcCheck.hasNft
    }
  };
};

/**
 * Advisory request-body hints (never authoritative). A supplied hint that
 * contradicts the signed transaction is a hard reject — silently ignoring it
 * would let a caller believe a different drop was sponsored.
 */
export const checkBodyHints = (
  facts: { contractId: string; dropId: bigint; functionName: SponsoredFunction },
  hints: { contractId?: unknown; dropId?: unknown; functionName?: unknown }
): { ok: true } | { ok: false; detail: string } => {
  if (hints.contractId !== undefined && String(hints.contractId) !== facts.contractId) {
    return { ok: false, detail: 'body contractId does not match the signed transaction' };
  }
  if (hints.dropId !== undefined) {
    const raw = String(hints.dropId);
    if (!/^\d+$/.test(raw) || BigInt(raw) !== facts.dropId) {
      return { ok: false, detail: 'body dropId does not match the signed transaction' };
    }
  }
  if (hints.functionName !== undefined && String(hints.functionName) !== facts.functionName) {
    return { ok: false, detail: 'body functionName does not match the signed transaction' };
  }
  return { ok: true };
};
