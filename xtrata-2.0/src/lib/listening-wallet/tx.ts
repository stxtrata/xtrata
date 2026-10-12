/**
 * Transaction shapes the listening wallet is allowed to sign. Nothing else is signable:
 * a paid play to xtrata-radio-plays-v1-0 that moves exactly 50 microSTX from the
 * listening wallet (post-condition, Deny mode), and an STX return to the linked main
 * wallet. Fees and nonces are explicit, so no network call is made while signing.
 */
import {
  AnchorMode,
  Cl,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { HOLDER_PAYMENT } from './policy';

export const PLAYS_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';
/** Core index for xtrata-v3-2-3 in the plays contract's config (core-1, core-2, core-3). */
export const RADIO_CORE_INDEX = 3;
export const RETURN_MEMO = 'Xtrata listening wallet return';

export interface PlayRequest {
  core: number;
  song: number;
  /** 16-byte receipt as 32 lowercase hex chars (the radio's audible-start id). */
  receipt: string;
  fee: bigint;
  nonce: bigint;
}

export function validatePlayRequest(p: PlayRequest): PlayRequest {
  if (![1, 2, 3].includes(p.core)) throw new Error('Unsupported core contract.');
  if (!Number.isSafeInteger(p.song) || p.song < 0) throw new Error('Invalid song id.');
  if (typeof p.receipt !== 'string' || !/^[0-9a-f]{32}$/.test(p.receipt)) throw new Error('Invalid play receipt.');
  if (typeof p.nonce !== 'bigint' || p.nonce < 0n) throw new Error('Invalid nonce.');
  return p;
}

const receiptBytes = (hex: string) => Uint8Array.from(hex.match(/../g)!, (b) => parseInt(b, 16));

export function playCallOptions(address: string, publicKey: string, p: PlayRequest) {
  validatePlayRequest(p);
  const [contractAddress, contractName] = PLAYS_CONTRACT.split('.');
  return {
    contractAddress,
    contractName,
    functionName: 'play',
    functionArgs: [Cl.uint(p.core), Cl.uint(p.song), Cl.buffer(receiptBytes(p.receipt))],
    publicKey,
    fee: p.fee,
    nonce: p.nonce,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, HOLDER_PAYMENT)]
  };
}

export function returnTransferOptions(recipient: string, amount: bigint, fee: bigint, nonce: bigint) {
  return { recipient, amount, fee, nonce, network: new StacksMainnet(), memo: RETURN_MEMO, anchorMode: AnchorMode.Any };
}
