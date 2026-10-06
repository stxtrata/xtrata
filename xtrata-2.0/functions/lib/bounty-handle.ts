/**
 * Bounty tracker handle link (SIP-018 structured data).
 *
 * A wallet signs "this X handle is mine for this bounty". It proves control of the
 * wallet, nothing more: it is a message, not a transaction, and grants no spending
 * permission. The handle itself is self-declared, so the tracker labels it
 * "self-linked" until the team confirms it. Shared by the page bundle (builds what the
 * wallet signs) and the Pages Function (verifies it), like creator-proof.ts.
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

export const BOUNTY_HANDLE_DOMAIN = 'xtrata.xyz/bounty';
export const BOUNTY_HANDLE_PURPOSE = 'Link an X handle to a bounty entry; no spending permission';
export const BOUNTY_HANDLE_TTL_MS = 10 * 60 * 1000;
export const BOUNTY_CAMPAIGNS = ['zdao-1'] as const;

export type BountyHandleClaim = { campaign: string; address: string; handle: string; issued: number };

/** '@Name' or 'name' -> '@Name'; '' clears the link. Returns null when it is not a valid X handle. */
export const normalizeHandle = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i, '').replace(/[/?#].*$/, '');
  if (text === '' || text === '@') return '';
  const bare = text.replace(/^@/, '');
  return /^[A-Za-z0-9_]{1,15}$/.test(bare) ? '@' + bare : null;
};

export const isMainnetAddress = (address: unknown): address is string =>
  typeof address === 'string' && /^SP[0-9A-Z]{30,}$/.test(address) && validateStacksAddress(address);

export const bountyHandleData = (claim: BountyHandleClaim) => ({
  domain: tupleCV({
    name: stringAsciiCV(BOUNTY_HANDLE_DOMAIN),
    version: stringAsciiCV('1'),
    'chain-id': uintCV(1)
  }),
  message: tupleCV({
    purpose: stringAsciiCV(BOUNTY_HANDLE_PURPOSE),
    campaign: stringAsciiCV(claim.campaign),
    address: stringAsciiCV(claim.address),
    // An empty handle is how a wallet removes its own link.
    handle: stringAsciiCV(claim.handle),
    issued: uintCV(claim.issued)
  })
});

/** True only when `signature` (65-byte RSV hex) was made by `claim.address`. */
export const verifyBountyHandle = (claim: BountyHandleClaim, signature: unknown) => {
  try {
    if (typeof signature !== 'string' || !isMainnetAddress(claim.address)) return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    const hash = bytesToHex(sha256(encodeStructuredData(bountyHandleData(claim))));
    const publicKey = publicKeyFromSignatureRsv(hash, createMessageSignature(hex));
    return getAddressFromPublicKey(publicKey, TransactionVersion.Mainnet) === claim.address;
  } catch {
    return false;
  }
};
