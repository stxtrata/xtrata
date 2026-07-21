import { startJourney, event } from '../telemetry/client';
import { classify } from '../telemetry/classify';
import {
  AddressVersion,
  AuthType,
  ClarityType,
  PayloadType,
  PostConditionMode,
  TransactionVersion,
  addressToString,
  deserializeTransaction,
  serializePostCondition
} from '@stacks/transactions';
import { buildContractTransferPostCondition } from '../contract/post-conditions';
import type { NetworkType } from '../network/types';
import { bytesToHex } from '../utils/encoding';
import {
  SponsorClientError,
  type SponsorClient,
  type SponsorJob,
  type SponsorJobState
} from '../market/sponsor-client';

export type SponsoredClaimCheck = {
  code: string;
  ok: boolean;
  message: string;
};

export type SponsoredClaimExpectation = {
  dropsContractId: string;
  nftContractId: string;
  dropId: bigint;
  tokenId: bigint;
  network: NetworkType;
  claimerAddress?: string;
};

export type SponsoredClaimInspection = {
  ok: boolean;
  txHex: string | null;
  txId: string | null;
  checks: SponsoredClaimCheck[];
};

const RAW_TX_KEYS = [
  'txRaw',
  'txHex',
  'rawTx',
  'rawTransaction',
  'transaction',
  'signedTransaction',
  'hex',
  'serializedTx'
] as const;
const NESTED_KEYS = ['result', 'data', 'payload', 'response', 'params'] as const;

const canonicalHex = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const hex = value.trim().replace(/^0x/i, '');
  if (hex.length < 128 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null;
  try {
    deserializeTransaction(hex);
    return hex;
  } catch {
    return null;
  }
};

/** Normalize documented Xverse, Leather, and legacy Stacks Connect responses. */
export const extractSponsoredTransactionHex = (payload: unknown, depth = 0): string | null => {
  if (depth > 6 || payload === null || typeof payload === 'undefined') return null;
  const standalone = canonicalHex(payload);
  if (standalone) return standalone;
  if (Array.isArray(payload)) {
    for (const value of payload) {
      const found = extractSponsoredTransactionHex(value, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  for (const key of RAW_TX_KEYS) {
    const found = canonicalHex(record[key]);
    if (found) return found;
  }
  for (const key of NESTED_KEYS) {
    const found = extractSponsoredTransactionHex(record[key], depth + 1);
    if (found) return found;
  }
  return null;
};

const splitContractId = (contractId: string) => {
  const separator = contractId.indexOf('.');
  return separator > 0
    ? { address: contractId.slice(0, separator), contractName: contractId.slice(separator + 1) }
    : null;
};

const postConditionHex = (value: unknown) =>
  bytesToHex(serializePostCondition(value as Parameters<typeof serializePostCondition>[0]));

/**
 * Decode the wallet-signed transaction and record every safety invariant used
 * by the relayer. The caller can render the checks verbatim in diagnostics.
 */
export const inspectSponsoredClaimTransaction = (
  payload: unknown,
  expected: SponsoredClaimExpectation
): SponsoredClaimInspection => {
  const checks: SponsoredClaimCheck[] = [];
  const add = (code: string, ok: boolean, pass: string, fail: string) =>
    checks.push({ code, ok, message: ok ? pass : fail });
  const txHex = extractSponsoredTransactionHex(payload);
  add(
    'SIGNED_TX_PRESENT',
    !!txHex,
    'Wallet returned a signed transaction.',
    'Wallet response contained no usable signed transaction.'
  );
  if (!txHex) return { ok: false, txHex: null, txId: null, checks };

  let tx: ReturnType<typeof deserializeTransaction>;
  try {
    tx = deserializeTransaction(txHex);
    add('SIGNED_TX_DECODED', true, 'Signed transaction decoded.', '');
  } catch {
    add('SIGNED_TX_DECODED', false, '', 'Signed transaction could not be decoded.');
    return { ok: false, txHex, txId: null, checks };
  }

  const expectedVersion =
    expected.network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
  add(
    'NETWORK',
    tx.version === expectedVersion,
    `Transaction targets ${expected.network}.`,
    `Transaction does not target ${expected.network}.`
  );
  add(
    'SPONSORED_AUTH',
    tx.auth.authType === AuthType.Sponsored,
    'Sponsored authorization is present.',
    'Transaction is not sponsored-auth.'
  );
  add(
    'ORIGIN_FEE_ZERO',
    BigInt(tx.auth.spendingCondition.fee ?? 0n) === 0n,
    'Claimer origin fee is 0.',
    'Claimer origin fee is not 0.'
  );
  add(
    'CONTRACT_CALL',
    tx.payload.payloadType === PayloadType.ContractCall,
    'Payload is a contract call.',
    'Payload is not a contract call.'
  );

  if (tx.payload.payloadType === PayloadType.ContractCall) {
    const payloadValue = tx.payload as typeof tx.payload & {
      functionArgs?: unknown[];
      contractAddress: Parameters<typeof addressToString>[0];
      contractName: { content: string };
      functionName: { content: string };
    };
    const contractId = `${addressToString(payloadValue.contractAddress)}.${payloadValue.contractName.content}`;
    add(
      'TARGET_CONTRACT',
      contractId === expected.dropsContractId,
      'Drops contract matches.',
      `Expected ${expected.dropsContractId}; wallet signed ${contractId}.`
    );
    add(
      'TARGET_FUNCTION',
      payloadValue.functionName.content === 'claim',
      'Function is claim.',
      `Wallet signed ${payloadValue.functionName.content}, not claim.`
    );
    const args = payloadValue.functionArgs ?? [];
    const nftArg = args[0] as
      | {
          type?: ClarityType;
          address?: Parameters<typeof addressToString>[0];
          contractName?: { content: string };
        }
      | undefined;
    const idArg = args[1] as { type?: ClarityType; value?: bigint } | undefined;
    const signedNft =
      nftArg?.type === ClarityType.PrincipalContract && nftArg.address && nftArg.contractName
        ? `${addressToString(nftArg.address)}.${nftArg.contractName.content}`
        : null;
    add(
      'CLAIM_ARGUMENTS',
      args.length === 2 &&
        signedNft === expected.nftContractId &&
        idArg?.type === ClarityType.UInt &&
        idArg.value === expected.dropId,
      'Claim arguments match the NFT contract and drop id.',
      'Claim arguments do not match the selected drop.'
    );
  }

  add(
    'POST_CONDITION_MODE',
    tx.postConditionMode === PostConditionMode.Deny,
    'Post-condition mode is deny.',
    'Post-condition mode is not deny.'
  );
  const drops = splitContractId(expected.dropsContractId);
  const nft = splitContractId(expected.nftContractId);
  const actualPostConditions =
    (tx as unknown as { postConditions?: { values?: unknown[] } }).postConditions?.values ?? [];
  let postConditionMatches = false;
  if (drops && nft && actualPostConditions.length === 1) {
    const expectedPostCondition = buildContractTransferPostCondition({
      nftContract: { ...nft, network: expected.network },
      senderContract: { ...drops, network: expected.network },
      tokenId: expected.tokenId
    });
    postConditionMatches =
      postConditionHex(actualPostConditions[0]) === postConditionHex(expectedPostCondition);
  }
  add(
    'NFT_POST_CONDITION',
    postConditionMatches,
    'Exact escrow NFT transfer post-condition is present.',
    'Expected exactly one escrow NFT transfer post-condition for the selected token.'
  );

  if (expected.claimerAddress) {
    const version =
      expected.network === 'mainnet'
        ? AddressVersion.MainnetSingleSig
        : AddressVersion.TestnetSingleSig;
    let origin = '';
    try {
      origin = addressToString({
        version,
        hash160: (tx.auth.spendingCondition as { signer: string }).signer,
        type: 0
      } as Parameters<typeof addressToString>[0]);
    } catch {
      origin = '';
    }
    add(
      'CLAIMER_ORIGIN',
      origin.toUpperCase() === expected.claimerAddress.toUpperCase(),
      'Transaction origin matches the connected wallet.',
      `Transaction origin ${origin || 'unknown'} does not match the connected wallet.`
    );
  }

  return { ok: checks.every((check) => check.ok), txHex, txId: tx.txid(), checks };
};

export const isTerminalSponsorJobState = (state: SponsorJobState) =>
  state === 'SETTLED' || state === 'ABANDONED';

export const isSponsorClaimConfirmedState = (state: SponsorJobState) =>
  state === 'CONFIRMED' ||
  state === 'CLAIMING' ||
  state === 'CLAIMED' ||
  state === 'REFUNDING' ||
  state === 'SETTLED';

export const SPONSOR_JOB_POLL_INTERVAL_MS = 4_000;
export const SPONSOR_JOB_MAX_ATTEMPTS = 225;
export const SPONSOR_SUBMIT_RETRY_DELAYS_MS = [2_000, 5_000, 10_000, 20_000] as const;

export const isRetryableSponsorSubmitError = (error: unknown) =>
  error instanceof SponsorClientError &&
  error.code === 'RELAYER_UNAVAILABLE' &&
  (!error.stage || error.stage === 'SPONSOR_BALANCE' || error.stage === 'BROADCAST');

export const submitSponsorClaimWithRetry = async (params: {
  client: SponsorClient;
  txHex: string;
  contractId: string;
  listingId: bigint;
  bnsName?: string | null;
  retryDelaysMs?: readonly number[];
  wait?: (ms: number) => Promise<void>;
  onRetry?: (
    error: SponsorClientError,
    attempt: number,
    maxAttempts: number,
    delayMs: number
  ) => void;
  onExistingJob?: (error: SponsorClientError, job: SponsorJob) => void;
}): Promise<SponsorJob> => {
  const retryDelaysMs = params.retryDelaysMs ?? SPONSOR_SUBMIT_RETRY_DELAYS_MS;
  const wait = params.wait ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  const maxAttempts = retryDelaysMs.length + 1;
  const journey = startJourney('drop_claim', params.contractId);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    event({ journey, attempt, step: 'submit', outcome: 'start' });
    try {
      const job = await params.client.submit({
        txHex: params.txHex,
        contractId: params.contractId,
        listingId: params.listingId,
        bnsName: params.bnsName
      });
      event({ journey, attempt, step: 'submit', outcome: 'success' });
      return job;
    } catch (error) {
      if (error instanceof SponsorClientError && error.existingJob) {
        params.onExistingJob?.(error, error.existingJob);
        event({
          journey,
          attempt,
          step: 'submit',
          outcome: 'success',
          context: { existingJob: true }
        });
        return error.existingJob;
      }
      const delayMs = retryDelaysMs[attempt - 1];
      if (
        !(error instanceof SponsorClientError) ||
        !isRetryableSponsorSubmitError(error) ||
        typeof delayMs !== 'number'
      ) {
        event({
          journey,
          attempt,
          step: 'submit',
          outcome: 'error',
          errorCode: classify(error, 'drop_claim'),
          error
        });
        throw error;
      }
      params.onRetry?.(error, attempt, maxAttempts, delayMs);
      await wait(delayMs);
    }
  }

  event({
    journey,
    attempt: maxAttempts,
    step: 'submit',
    outcome: 'error',
    errorCode: 'SPONSOR_REJECTED',
    error: 'sponsor relayer submission retry exhausted'
  });
  throw new SponsorClientError('RELAYER_UNAVAILABLE', 'sponsor relayer submission retry exhausted');
};

export const pollSponsorJob = async (params: {
  client: SponsorClient;
  job: SponsorJob;
  intervalMs?: number;
  maxAttempts?: number;
  wait?: (ms: number) => Promise<void>;
  onStatus?: (job: SponsorJob, attempt: number) => void;
}): Promise<SponsorJob> => {
  const intervalMs = params.intervalMs ?? SPONSOR_JOB_POLL_INTERVAL_MS;
  const maxAttempts = params.maxAttempts ?? SPONSOR_JOB_MAX_ATTEMPTS;
  const wait = params.wait ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  let job = params.job;
  params.onStatus?.(job, 0);
  for (
    let attempt = 1;
    attempt <= maxAttempts && !isTerminalSponsorJobState(job.state);
    attempt += 1
  ) {
    await wait(intervalMs);
    job = await params.client.status(job.id);
    params.onStatus?.(job, attempt);
  }
  return job;
};
