/**
 * Read-only on-chain preflight before any sponsor-wallet mutation.
 *
 * Everything is read from the drops contract via the injectable transport:
 * drop exists + active + sponsored mode + window open + budget-remaining
 * covers the quote + wallet under limit + remaining items > 0. The chain is
 * authoritative; nothing here trusts request metadata (threat 12).
 */
import { ClarityType, Cl, cvToHex, cvToString, principalCV } from '@stacks/transactions';
import type { ClarityValue } from '@stacks/transactions';
import type {
  ChainTransport,
  PreflightResult,
  RelayerConfig,
  SponsoredFunction
} from './types.js';

const STATUS_ACTIVE = 1n;
const MODE_SPONSORED = 3n;
const ELIGIBILITY_SIGNED = 3n;

type CV = ClarityValue & { value?: unknown };

const unwrap = (cv: ClarityValue | null): CV | null => {
  let current = cv as CV | null;
  while (
    current &&
    (current.type === ClarityType.ResponseOk || current.type === ClarityType.OptionalSome)
  ) {
    current = current.value as CV;
  }
  if (!current) return null;
  if (current.type === ClarityType.OptionalNone || current.type === ClarityType.ResponseErr) {
    return null;
  }
  return current;
};

const tupleUint = (tuple: CV, key: string): bigint | null => {
  const data = tuple.value as Record<string, CV> | undefined;
  const field = data?.[key];
  return field?.type === ClarityType.UInt ? (field.value as bigint) : null;
};

const asUint = (cv: ClarityValue | null): bigint | null => {
  const u = unwrap(cv);
  return u?.type === ClarityType.UInt ? (u.value as bigint) : null;
};

const asBool = (cv: ClarityValue | null): boolean | null => {
  const u = unwrap(cv);
  if (!u) return null;
  if (u.type === ClarityType.BoolTrue) return true;
  if (u.type === ClarityType.BoolFalse) return false;
  return null;
};

/**
 * On-chain per-claim fee ceiling (`claim-fee-cap`). Falls back to the
 * configured ceiling when the read fails so quoting never over-promises.
 */
export const readClaimFeeCap = async (
  transport: ChainTransport,
  cfg: RelayerConfig
): Promise<bigint> => {
  const cap = asUint(await transport.callReadOnly(cfg.dropsContractId, 'get-claim-fee-cap', []));
  return cap === null || cap <= 0n ? cfg.maxFeeUstx : cap;
};

export interface PreflightInput {
  dropId: bigint;
  claimer: string;
  functionName: SponsoredFunction;
  /** fee the relayer intends to front (quote). */
  quoteUstx: bigint;
}

export const preflight = async (
  transport: ChainTransport,
  cfg: RelayerConfig,
  input: PreflightInput
): Promise<PreflightResult> => {
  const drops = cfg.dropsContractId;
  const dropArg = cvToHex(Cl.uint(input.dropId));

  const dropCv = unwrap(await transport.callReadOnly(drops, 'get-drop', [dropArg]));
  if (!dropCv || dropCv.type !== ClarityType.Tuple) return { ok: false, code: 'DROP_NOT_FOUND' };

  const status = tupleUint(dropCv, 'status');
  const mode = tupleUint(dropCv, 'mode');
  const eligibility = tupleUint(dropCv, 'eligibility');
  const startBlock = tupleUint(dropCv, 'start-block');
  const endBlock = tupleUint(dropCv, 'end-block');
  const budgetRemaining = tupleUint(dropCv, 'fee-budget-remaining');
  const perWalletLimit = tupleUint(dropCv, 'per-wallet-limit');
  if (
    status === null || mode === null || eligibility === null || startBlock === null ||
    endBlock === null || budgetRemaining === null || perWalletLimit === null
  ) {
    return { ok: false, code: 'DROP_NOT_FOUND', detail: 'malformed drop tuple' };
  }

  if (status !== STATUS_ACTIVE) return { ok: false, code: 'DROP_NOT_ACTIVE' };
  if (mode !== MODE_SPONSORED) return { ok: false, code: 'DROP_NOT_SPONSORED' };

  // Eligibility/entrypoint pairing (the contract enforces ERR-ELIGIBILITY too;
  // rejecting here avoids fronting a fee on a guaranteed abort).
  const signedDrop = eligibility === ELIGIBILITY_SIGNED;
  if (input.functionName === 'claim-signed' ? !signedDrop : signedDrop) {
    return { ok: false, code: 'WRONG_ELIGIBILITY' };
  }

  const paused = asBool(await transport.callReadOnly(drops, 'is-paused', []));
  if (paused !== false) return { ok: false, code: 'CONTRACT_PAUSED' };

  const tip = await transport.getTipHeight();
  if (tip < startBlock || (endBlock !== 0n && tip > endBlock)) {
    return { ok: false, code: 'WINDOW_CLOSED' };
  }

  if (budgetRemaining < input.quoteUstx) {
    return { ok: false, code: 'BUDGET_EXHAUSTED', detail: `remaining ${budgetRemaining} < quote ${input.quoteUstx}` };
  }

  const claimFeeCap = await readClaimFeeCap(transport, cfg);

  // An outstanding reservation means the claim settles an already-allocated
  // index: wallet-limit and remaining were consumed at reservation time.
  const claimerArg = cvToHex(principalCV(input.claimer));
  const reservation =
    input.functionName === 'claim'
      ? unwrap(await transport.callReadOnly(drops, 'get-claim-reservation', [dropArg, claimerArg]))
      : null;
  const hasReservation = reservation !== null;

  if (!hasReservation) {
    if (perWalletLimit > 0n) {
      const walletClaims = asUint(
        await transport.callReadOnly(drops, 'get-wallet-claims', [dropArg, claimerArg])
      );
      if (walletClaims === null || walletClaims >= perWalletLimit) {
        return { ok: false, code: 'WALLET_LIMIT' };
      }
    }
    const remaining = asUint(await transport.callReadOnly(drops, 'get-remaining', [dropArg]));
    if (remaining === null || remaining <= 0n) return { ok: false, code: 'SOLD_OUT' };
  }

  return { ok: true, budgetRemaining, claimFeeCap, hasReservation };
};

/** Read the fields needed by the attest endpoint's policy checks. */
export const readDropForAttestation = async (
  transport: ChainTransport,
  cfg: RelayerConfig,
  dropId: bigint
): Promise<{ status: bigint; eligibility: bigint; collection: string } | null> => {
  const cv = unwrap(
    await transport.callReadOnly(cfg.dropsContractId, 'get-drop', [cvToHex(Cl.uint(dropId))])
  );
  if (!cv || cv.type !== ClarityType.Tuple) return null;
  const status = tupleUint(cv, 'status');
  const eligibility = tupleUint(cv, 'eligibility');
  const collectionCv = (cv.value as Record<string, CV>)['collection'];
  const collection =
    collectionCv &&
    (collectionCv.type === ClarityType.PrincipalStandard ||
      collectionCv.type === ClarityType.PrincipalContract)
      ? cvToString(collectionCv)
      : null;
  if (status === null || eligibility === null || collection === null) return null;
  return { status, eligibility, collection };
};

/** Read the drop tuple for settlement decisions (status + budget). */
export const readDropForSettlement = async (
  transport: ChainTransport,
  cfg: RelayerConfig,
  dropId: bigint
): Promise<{ status: bigint; budgetRemaining: bigint; feesSettled: bigint; claimedCount: bigint } | null> => {
  const cv = unwrap(
    await transport.callReadOnly(cfg.dropsContractId, 'get-drop', [cvToHex(Cl.uint(dropId))])
  );
  if (!cv || cv.type !== ClarityType.Tuple) return null;
  const status = tupleUint(cv, 'status');
  const budgetRemaining = tupleUint(cv, 'fee-budget-remaining');
  const feesSettled = tupleUint(cv, 'fees-settled');
  const claimedCount = tupleUint(cv, 'claimed-count');
  if (status === null || budgetRemaining === null || feesSettled === null || claimedCount === null) {
    return null;
  }
  return { status, budgetRemaining, feesSettled, claimedCount };
};
