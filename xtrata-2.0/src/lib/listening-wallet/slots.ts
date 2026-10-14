/**
 * Binding a derived listening wallet (slot n) to the passkey's first wallet (the root, slot 0).
 *
 * Plays and likes are credited to the listener's main wallet through a link on the root. A derived wallet
 * inherits it by being bound to the root, so one listener with hundreds of albums keeps ONE link.
 * BOTH keys sign the same message, both from inside the wallet frame, so there is no wallet popup:
 * with only the root's signature anyone could claim a stranger's address as their own slot and take
 * the credit for that address's plays; with only the slot's, anyone could attach themselves to a root.
 * Neither signature spends anything. Same shape as link.ts.
 */
import {
  createMessageSignature, createStacksPrivateKey, encodeStructuredData, getAddressFromPublicKey, publicKeyFromSignatureRsv,
  signMessageHashRsv, stringAsciiCV, TransactionVersion, tupleCV, uintCV
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { isSlot } from './derive';
import { isMainnetStandardAddress, LINK_MAX_AGE_MS } from './link';

export const SLOT_DOMAIN = 'xtrata.xyz/radio/listening-wallet-slot';
export const SLOT_PURPOSE = 'Bind a derived listening wallet to its passkey wallet; no spending permission';

export interface SlotBinding {
  /** The passkey's first wallet (slot 0). */
  root: string;
  slot: number;
  /** The derived wallet's address. */
  address: string;
  issued: number;
}

export function validateSlotBinding(b: SlotBinding, now = Date.now()): SlotBinding {
  if (!b || !isMainnetStandardAddress(b.root) || !isMainnetStandardAddress(b.address)) throw new Error('A binding needs two mainnet wallet addresses.');
  if (!isSlot(b.slot) || b.slot < 1) throw new Error('A derived wallet has a number of 1 or more.');
  if (b.root === b.address) throw new Error('A derived wallet is a different address from its passkey wallet.');
  if (!Number.isSafeInteger(b.issued) || b.issued > now + 60_000 || now - b.issued > LINK_MAX_AGE_MS) throw new Error('Binding expired. Ask again.');
  return b;
}

export const slotData = (b: SlotBinding) => ({
  domain: tupleCV({ name: stringAsciiCV(SLOT_DOMAIN), version: stringAsciiCV('1'), 'chain-id': uintCV(1) }),
  message: tupleCV({
    purpose: stringAsciiCV(SLOT_PURPOSE),
    root: stringAsciiCV(b.root),
    slot: uintCV(b.slot),
    address: stringAsciiCV(b.address),
    issued: uintCV(b.issued)
  })
});

export const slotHash = (b: SlotBinding) => bytesToHex(sha256(encodeStructuredData(slotData(b))));

/** True only when `signature` (65-byte RSV hex) was made by `address` over this binding. */
export function verifySlotSignature(b: SlotBinding, signature: unknown, address: string): boolean {
  try {
    if (typeof signature !== 'string') return false;
    const hex = signature.replace(/^0x/, '');
    if (!/^[a-fA-F0-9]{130}$/.test(hex)) return false;
    return getAddressFromPublicKey(publicKeyFromSignatureRsv(slotHash(b), createMessageSignature(hex)), TransactionVersion.Mainnet) === address;
  } catch {
    return false;
  }
}

/** Used only inside the wallet origin, where the keys live. */
export const signSlotBinding = (b: SlotBinding, privateKey: string): string =>
  signMessageHashRsv({ messageHash: slotHash(b), privateKey: createStacksPrivateKey(privateKey) }).data;
