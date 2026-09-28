import {
  ClarityType,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  uintCV,
  validateStacksAddress,
  type ClarityValue
} from '@stacks/transactions';
import type { WalletSession } from '../wallet/types';
import { createStacksReadOnlyCaller } from '../contract/client';
import { callReadOnlyWithRetry } from '../contract/read-only';
import { toStacksNetwork } from '../network/stacks';

/**
 * Narrow arcade high-score submission for the public viewer.
 *
 * An arcade inscription may only ask the host to post ONE score to ONE pinned
 * contract function. The host rebuilds every Clarity argument itself, reads the
 * fee itself, shows its own review dialog, and caps the spend with a single
 * Deny-mode STX post-condition. The inscription never chooses the contract,
 * the function, the arguments' types, the post-conditions or the fee.
 */
export const ARCADE_SCORE_CONTRACT =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v1-3';
export const ARCADE_SCORE_FUNCTION = 'submit-score';
export const ARCADE_SCORE_METHODS = new Set(['xtrata_submitArcadeScore']);
/** Contract bounds (FEE-MIN / FEE-MAX in xtrata-arcade-scores-v1-3). */
export const ARCADE_FEE_MIN = 100n;
export const ARCADE_FEE_MAX = 1_000_000n;
const UINT128_MAX = 2n ** 128n - 1n;

export type ArcadeReview = {
  kind: 'arcade';
  label: string;
  address: string;
  network: 'mainnet';
  gameId: string;
  mode: 'score' | 'time';
  score: string;
  name: string;
  fee: string;
  contract: string;
};

export type ArcadeScoreRequest = {
  gameId: string;
  mode: 'score' | 'time';
  score: bigint;
  name: string;
};

const error = (message: string, code = -32602) => Object.assign(new Error(message), { code });

/** Validates the four player-facing fields. Everything else is fixed by the host. */
export function parseArcadeScore(params: unknown, session: WalletSession): ArcadeScoreRequest {
  const value = Array.isArray(params) ? params[0] : params;
  if (!value || typeof value !== 'object') throw error('Score parameters are required.');
  const p = value as Record<string, unknown>;
  // Optional echo fields must agree with what the host pins; they never select anything.
  if (p.contract !== undefined && p.contract !== ARCADE_SCORE_CONTRACT)
    throw error('This viewer only posts to the Xtrata arcade score contract.');
  if (p.network !== undefined && p.network !== 'mainnet')
    throw error('Arcade scores are posted on mainnet only.');
  if (p.address !== undefined && p.address !== session.address)
    throw error('Wallet changed. Reconnect and review the score again.');
  const gameId = typeof p.gameId === 'string' ? p.gameId : '';
  if (!/^[a-z0-9_]{3,32}$/.test(gameId)) throw error('Invalid game id.');
  const mode = p.mode === undefined || p.mode === 'score' ? 'score' : p.mode === 'time' ? 'time' : null;
  if (!mode) throw error('Invalid score mode.');
  const rawScore = typeof p.score === 'number' && Number.isSafeInteger(p.score) ? String(p.score) : p.score;
  if (typeof rawScore !== 'string' || !/^[1-9]\d{0,38}$/.test(rawScore))
    throw error('Score must be a positive whole number.');
  const score = BigInt(rawScore);
  if (score > UINT128_MAX) throw error('Score must be a positive whole number.');
  const name = typeof p.name === 'string' ? p.name.trim() : '';
  // string-ascii 12 on chain; printable ASCII only so the review shows exactly what is stored.
  if (!/^[\x20-\x7e]{3,12}$/.test(name)) throw error('Name needs 3 to 12 printable ASCII characters.');
  return { gameId, mode, score, name };
}

export function parseArcadeFee(value: ClarityValue): bigint {
  if (value.type !== ClarityType.ResponseOk || value.value.type !== ClarityType.UInt)
    throw error('Unexpected arcade fee response.', -32603);
  return BigInt(value.value.value);
}

/** Host read of get-fee-unit on the pinned contract, through the shared read-only limiter. */
export async function readArcadeFeeUnit(senderAddress: string): Promise<bigint> {
  const [address, contractName] = ARCADE_SCORE_CONTRACT.split('.');
  const caller = createStacksReadOnlyCaller();
  const value = await callReadOnlyWithRetry({
    task: () =>
      caller.callReadOnly({
        contract: { address, contractName, network: 'mainnet' },
        functionName: 'get-fee-unit',
        functionArgs: [],
        senderAddress,
        network: toStacksNetwork('mainnet')
      }),
    functionName: 'get-fee-unit',
    contractId: ARCADE_SCORE_CONTRACT,
    retry: { retries: 2 }
  });
  return parseArcadeFee(value);
}

export type ArcadePorts = {
  session: WalletSession;
  label: string;
  /** Throws if the preview, account or network changed. */
  guard: () => void;
  /** Reads get-fee-unit from the pinned contract. Must THROW on a failed read, never default. */
  readFee: () => Promise<bigint>;
  review: (request: ArcadeReview) => Promise<boolean>;
  submit: (options: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: ClarityValue[];
    postConditions: ReturnType<typeof makeStandardSTXPostCondition>[];
  }) => Promise<any>;
};

export async function runArcadeScore(method: string, params: unknown, p: ArcadePorts) {
  if (!ARCADE_SCORE_METHODS.has(method)) throw error('Unsupported arcade method.', -32601);
  const address = p.session.address;
  if (
    !p.session.isConnected ||
    !address ||
    !validateStacksAddress(address) ||
    p.session.network !== 'mainnet' ||
    !/^S[PM]/.test(address)
  )
    throw error('Connect a mainnet wallet to post arcade scores.', 4100);
  const request = parseArcadeScore(params, p.session);
  p.guard();
  const readFee = async () => {
    let fee: bigint;
    try {
      fee = await p.readFee();
    } catch {
      // A failed read is not a zero fee. Say so rather than guessing.
      throw error('Could not read the arcade fee right now. Try again in a moment.', -32603);
    }
    p.guard();
    if (fee < ARCADE_FEE_MIN || fee > ARCADE_FEE_MAX)
      throw error('Unexpected arcade fee. The score was not posted.', -32603);
    return fee;
  };
  const fee = await readFee();
  const [contractAddress, contractName] = ARCADE_SCORE_CONTRACT.split('.');
  if (
    !(await p.review({
      kind: 'arcade',
      label: p.label,
      address,
      network: 'mainnet',
      gameId: request.gameId,
      mode: request.mode,
      score: request.score.toString(),
      name: request.name,
      fee: fee.toString(),
      contract: ARCADE_SCORE_CONTRACT
    }))
  )
    throw error('Score submission cancelled.', 4001);
  p.guard();
  // The admin can change the fee at any time; never sign a cap the player did not see.
  if ((await readFee()) !== fee) throw error('The arcade fee changed. Review the score again.', 4001);
  const result = await p.submit({
    contractAddress,
    contractName,
    functionName: ARCADE_SCORE_FUNCTION,
    functionArgs: [
      stringAsciiCV(request.gameId),
      uintCV(request.mode === 'time' ? 1n : 0n),
      uintCV(request.score),
      stringAsciiCV(request.name)
    ],
    postConditions: [makeStandardSTXPostCondition(address, FungibleConditionCode.LessEqual, fee)]
  });
  const raw = String(result?.txId ?? result?.txid ?? '');
  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(raw))
    throw error('The wallet outcome is unknown. Check your wallet history before posting again.', -32002);
  return {
    status: 'submitted',
    txid: '0x' + raw.replace(/^0x/, '').toLowerCase(),
    contract: ARCADE_SCORE_CONTRACT,
    gameId: request.gameId,
    mode: request.mode,
    score: request.score.toString(),
    name: request.name
  };
}
