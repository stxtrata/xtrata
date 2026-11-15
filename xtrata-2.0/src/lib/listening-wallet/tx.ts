/**
 * Transaction shapes the listening wallet is allowed to sign. Nothing else is signable:
 * a paid play to xtrata-radio-plays-v1-0 that moves exactly 50 microSTX from the
 * listening wallet (post-condition, Deny mode), a like or unlike on xtrata-radio-likes-v1-0
 * that moves nothing (Deny mode, no post-conditions), and an STX return to the linked main
 * wallet. Fees and nonces are explicit, so no network call is made while signing.
 */
import {
  AnchorMode,
  Cl,
  createAssetInfo,
  FungibleConditionCode,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { HOLDER_PAYMENT } from './policy';

export const PLAYS_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';
/** Core index for xtrata-v3-2-3 in the plays contract's config (core-1, core-2, core-3). */
export const RADIO_CORE_INDEX = 3;
export const RETURN_MEMO = 'Xtrata listening wallet return';
export const MOVE_MEMO = 'Xtrata listening wallet move';
export const LIKES_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0';
/**
 * The Music Hero award contract, and the drop it is for. The wallet box signs a claim to THIS contract and no other:
 * the page cannot name one. It is set here before the box is deployed and must be exactly where the contract was
 * deployed (docs/music/AWARDS-SERVER.md): a claim to anywhere else is refused, and a wrong value here means no claim
 * can be signed at all, never a claim to the wrong place.
 */
export const AWARDS_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0';
export const AWARDS_DROP = 1;
/** The most a claim may pay in network fee (microSTX). A claim is about 650 bytes. */
export const AWARD_FEE_CAP = 10_000n;

/** set-liked(id, liked): Deny mode with no post-conditions, so it cannot move any asset. */
export function likeCallOptions(publicKey: string, p: { song: number; liked: boolean; fee: bigint; nonce: bigint }) {
  if (!Number.isSafeInteger(p.song) || p.song < 0) throw new Error('Invalid song id.');
  if (typeof p.liked !== 'boolean') throw new Error('Choose like or unlike.');
  if (typeof p.nonce !== 'bigint' || p.nonce < 0n) throw new Error('Invalid nonce.');
  const [contractAddress, contractName] = LIKES_CONTRACT.split('.');
  return {
    contractAddress,
    contractName,
    functionName: 'set-liked',
    functionArgs: [Cl.uint(p.song), Cl.bool(p.liked)],
    publicKey,
    fee: p.fee,
    nonce: p.nonce,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: []
  };
}

export interface PlayRequest {
  core: number;
  song: number;
  /** 16-byte receipt as 32 lowercase hex chars (the radio's listen id). */
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

/** A transfer between two wallets of the SAME passkey (the first wallet and its album wallets). */
export function moveTransferOptions(recipient: string, amount: bigint, fee: bigint, nonce: bigint) {
  return { recipient, amount, fee, nonce, network: new StacksMainnet(), memo: MOVE_MEMO, anchorMode: AnchorMode.Any };
}

export interface AwardClaimRequest {
  cls: number;
  number: number;
  plays: number;
  /** The record's exact bytes and the server's 65-byte signature over their note. */
  record: Uint8Array;
  signature: Uint8Array;
  fee: bigint;
  nonce: bigint;
}

/**
 * claim(drop, class, number, plays, record, signature) on the award contract. The contract inscribes the record,
 * pays Xtrata's fee from its own balance and hands the inscription to the sender. Allow mode, because the contract
 * moves its own STX and an inscription whose number is not known in advance; the one post-condition says the
 * claimer sends no STX at all, so a claim can cost the player its network fee and nothing else.
 */
export function awardClaimOptions(address: string, publicKey: string, p: AwardClaimRequest) {
  const whole = (n: number, max: number) => Number.isSafeInteger(n) && n >= 1 && n <= max;
  if (!whole(p.cls, 5) || !whole(p.number, 9_999_999) || !whole(p.plays, 9_999_999)) throw new Error('That award cannot be claimed.');
  if (!(p.record instanceof Uint8Array) || p.record.length < 1 || p.record.length > 1024) throw new Error('That record cannot be claimed.');
  if (!(p.signature instanceof Uint8Array) || p.signature.length !== 65) throw new Error('That award note is not valid.');
  if (typeof p.fee !== 'bigint' || p.fee < 1n || p.fee > AWARD_FEE_CAP) throw new Error('That network fee is not allowed.');
  if (typeof p.nonce !== 'bigint' || p.nonce < 0n) throw new Error('Invalid nonce.');
  const [contractAddress, contractName] = AWARDS_CONTRACT.split('.');
  return {
    contractAddress,
    contractName,
    functionName: 'claim',
    functionArgs: [Cl.uint(AWARDS_DROP), Cl.uint(p.cls), Cl.uint(p.number), Cl.uint(p.plays), Cl.buffer(p.record), Cl.buffer(p.signature)],
    publicKey,
    fee: p.fee,
    nonce: p.nonce,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, 0n)]
  };
}

/** The Xtrata core, where every inscription (a Music Hero record among them) lives as a token. */
export const CORE_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export const CORE_ASSET = 'xtrata-inscription';

/**
 * transfer(id, sender, recipient) on the Xtrata core: send one inscription the player holds to another address.
 * Deny mode with one post-condition: the sender sends exactly this inscription. So the transaction can move that
 * one token and nothing else: no STX, no other inscription.
 */
export function inscriptionSendOptions(address: string, publicKey: string, p: { inscription: number; recipient: string; fee: bigint; nonce: bigint }) {
  if (!Number.isSafeInteger(p.inscription) || p.inscription < 0) throw new Error('That inscription cannot be sent.');
  if (typeof p.fee !== 'bigint' || p.fee < 1n || p.fee > AWARD_FEE_CAP) throw new Error('That network fee is not allowed.');
  if (typeof p.nonce !== 'bigint' || p.nonce < 0n) throw new Error('Invalid nonce.');
  const [contractAddress, contractName] = CORE_CONTRACT.split('.');
  return {
    contractAddress,
    contractName,
    functionName: 'transfer',
    functionArgs: [Cl.uint(p.inscription), Cl.standardPrincipal(address), Cl.standardPrincipal(p.recipient)],
    publicKey,
    fee: p.fee,
    nonce: p.nonce,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [makeStandardNonFungiblePostCondition(address, NonFungibleConditionCode.Sends, createAssetInfo(contractAddress, contractName, CORE_ASSET), Cl.uint(p.inscription))]
  };
}
