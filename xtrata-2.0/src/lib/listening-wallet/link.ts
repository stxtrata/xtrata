/**
 * Linking a listening wallet to the listener's main wallet (SIP-018 structured data).
 *
 * Both wallets sign the SAME message: the main wallet (Xverse/Leather popup) proves
 * the listener owns the main address, and the listening key (inside the wallet origin)
 * proves the listening address is theirs. Neither signature is a transaction or grants
 * spending permission. The server stores only the public pair.
 *
 * The linked main address is also the ONLY destination the wallet origin will return funds
 * to. A valid signature alone is NOT enough to set it (anyone can sign a link for an address
 * they control), so the wallet frame also asks the listener to confirm the full address.
 */
import {
  createMessageSignature,
  encodeStructuredData,
  getAddressFromPublicKey,
  publicKeyFromSignatureRsv,
  signMessageHashRsv,
  createStacksPrivateKey,
  stringAsciiCV,
  TransactionVersion,
  tupleCV,
  uintCV,
  validateStacksAddress
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

export const LINK_DOMAIN = 'xtrata.xyz/radio/listening-wallet';
export const LINK_PURPOSE = 'Link a temporary listening wallet for pay-per-play; no spending permission';
/** A link signature is accepted for this long after it was issued. */
export const LINK_MAX_AGE_MS = 15 * 60 * 1000;

export interface LinkRequest {
  main: string;
  listening: string;
  /** Milliseconds since epoch when the link was requested. */
  issued: number;
}

export const isMainnetStandardAddress = (address: unknown): address is string =>
  typeof address === 'string' && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(address) && validateStacksAddress(address);

export function validateLinkRequest(link: LinkRequest, now = Date.now()): LinkRequest {
  if (!link || !isMainnetStandardAddress(link.main) || !isMainnetStandardAddress(link.listening))
    throw new Error('Link needs two mainnet wallet addresses.');
  if (link.main === link.listening) throw new Error('The listening wallet must be a different address from your main wallet.');
  if (!Number.isSafeInteger(link.issued) || link.issued > now + 60_000 || now - link.issued > LINK_MAX_AGE_MS)
    throw new Error('Link request expired. Start the link step again.');
  return link;
}

export const linkData = (link: LinkRequest) => ({
  domain: tupleCV({ name: stringAsciiCV(LINK_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({
    purpose: stringAsciiCV(LINK_PURPOSE),
    main: stringAsciiCV(link.main),
    listening: stringAsciiCV(link.listening),
    issued: uintCV(link.issued)
  })
});

export const linkHash = (link: LinkRequest) => bytesToHex(sha256(encodeStructuredData(linkData(link))));

/** True only when `signature` (65-byte RSV hex) was made by `address` over this link. */
export function verifyLinkSignature(link: LinkRequest, signature: unknown, address: string): boolean {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    const publicKey = publicKeyFromSignatureRsv(linkHash(link), createMessageSignature(hex));
    return getAddressFromPublicKey(publicKey, TransactionVersion.Mainnet) === address;
  } catch {
    return false;
  }
}

/** Used only inside the wallet origin, where the listening key lives. */
export function signLink(link: LinkRequest, privateKey: string): string {
  return signMessageHashRsv({ messageHash: linkHash(link), privateKey: createStacksPrivateKey(privateKey) }).data;
}
