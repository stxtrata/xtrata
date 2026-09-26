/**
 * Collection studio sign-in proof (SIP-018 structured data).
 *
 * Shared by the studio (builds the message the wallet signs) and the server
 * (verifies it). Signing proves control of a wallet address; it is not a
 * transaction and grants no spending permission. Mirrors the music-profile
 * proof (scripts/wizard/music-profile-proof.mjs), which is already proven on
 * Xverse and Leather.
 */
import {
  createMessageSignature,
  encodeStructuredData,
  getAddressFromPublicKey,
  publicKeyFromSignatureRsv,
  stringAsciiCV,
  TransactionVersion,
  tupleCV,
  uintCV,
  validateStacksAddress
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

export const CREATOR_PROOF_DOMAIN = 'xtrata.xyz/manage';
export const CREATOR_PROOF_PURPOSE = 'Collection studio sign-in; no spending permission';
export const CREATOR_CHALLENGE_TTL_MS = 5 * 60 * 1000;
export const CREATOR_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type CreatorNetwork = 'mainnet' | 'testnet';
export type CreatorChallenge = {
  id: string;
  address: string;
  network: CreatorNetwork;
  nonce: string;
  issued: number;
  expires: number;
};

export const networkForAddress = (address: string): CreatorNetwork | null => {
  const normalized = address.trim().toUpperCase();
  if (!validateStacksAddress(normalized)) return null;
  if (normalized.startsWith('SP') || normalized.startsWith('SM')) return 'mainnet';
  if (normalized.startsWith('ST') || normalized.startsWith('SN')) return 'testnet';
  return null;
};

const chainId = (network: CreatorNetwork) => (network === 'mainnet' ? 1 : 2147483648);

export const creatorProofData = (challenge: CreatorChallenge) => ({
  domain: tupleCV({
    name: stringAsciiCV(CREATOR_PROOF_DOMAIN),
    version: stringAsciiCV('1'),
    'chain-id': uintCV(chainId(challenge.network))
  }),
  message: tupleCV({
    purpose: stringAsciiCV(CREATOR_PROOF_PURPOSE),
    address: stringAsciiCV(challenge.address),
    nonce: stringAsciiCV(challenge.nonce),
    expires: uintCV(challenge.expires)
  })
});

export const validateCreatorChallenge = (challenge: CreatorChallenge, now = Date.now()) => {
  if (!challenge || !/^[a-f0-9]{64}$/.test(challenge.id) || !/^[a-f0-9]{64}$/.test(challenge.nonce))
    throw new Error('Invalid sign-in request.');
  if (networkForAddress(challenge.address) !== challenge.network)
    throw new Error('Invalid sign-in address.');
  if (!Number.isSafeInteger(challenge.issued) || !Number.isSafeInteger(challenge.expires) ||
      challenge.expires - challenge.issued !== CREATOR_CHALLENGE_TTL_MS || challenge.issued > now + 30_000)
    throw new Error('Invalid sign-in request.');
  if (now > challenge.expires) throw new Error('Sign-in request expired. Try again.');
  return challenge;
};

/** True only when `signature` (65-byte RSV hex) was made by `challenge.address`. */
export const verifyCreatorProof = (challenge: CreatorChallenge, signature: unknown) => {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    const hash = bytesToHex(sha256(encodeStructuredData(creatorProofData(challenge))));
    const publicKey = publicKeyFromSignatureRsv(hash, createMessageSignature(hex));
    const version = challenge.network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
    return getAddressFromPublicKey(publicKey, version) === challenge.address;
  } catch {
    return false;
  }
};
