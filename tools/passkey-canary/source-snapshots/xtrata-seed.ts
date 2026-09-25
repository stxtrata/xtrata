/**
 * Seed generation and Stacks key derivation for passkey wallets.
 *
 * The wallet created here is an ordinary Stacks account: same curve, same
 * derivation path, same address format as one made in Xverse or Leather. The
 * passkey only controls the encryption of the seed (see envelope.ts) — it is
 * not part of the account's identity. That means the 24 words we show the user
 * are a genuine escape hatch: they import into any Stacks wallet, forever, with
 * no dependence on Xtrata or on the passkey continuing to exist.
 */

import { HDKey } from '@scure/bip32';
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { TransactionVersion, getAddressFromPrivateKey } from '@stacks/transactions';

/**
 * Account-hardened Xverse-style path. Matches scripts/mainnet-deploy-contract.mjs
 * so a seed created here derives the same address in Xverse on import — a
 * mismatch would strand funds in an account the user cannot see.
 */
export const derivationPath = (accountIndex = 0): string => `m/44'/5757'/${accountIndex}'/0/0`;

/** 256 bits of entropy → 24 words. */
const ENTROPY_BITS = 256;

export type StacksNetworkName = 'mainnet' | 'testnet';

export interface DerivedAccount {
  /** Hex private key with the `01` compressed-key suffix Stacks expects. */
  privateKey: string;
  address: string;
  path: string;
}

export class SeedError extends Error {
  constructor(readonly code: 'INVALID_MNEMONIC' | 'DERIVATION_FAILED', message: string) {
    super(message);
    this.name = 'SeedError';
  }
}

/** Generate a fresh 24-word mnemonic. Show it once, then never store it in the clear. */
export const createMnemonic = (): string => generateMnemonic(wordlist, ENTROPY_BITS);

/**
 * Normalise user-typed words: NFKD, collapse whitespace, lowercase.
 * Import fails on invisible differences without this.
 */
export const normaliseMnemonic = (raw: string): string =>
  raw.normalize('NFKD').trim().replace(/\s+/g, ' ').toLowerCase();

/** Validate against the BIP39 wordlist and checksum. */
export const isValidMnemonic = (raw: string): boolean => {
  const cleaned = normaliseMnemonic(raw);
  const words = cleaned.split(' ').filter(Boolean).length;
  if (words !== 12 && words !== 24) return false;
  return validateMnemonic(cleaned, wordlist);
};

/** Mnemonic → BIP39 seed bytes. Caller must `wipe()` the result. */
export const mnemonicToSeedBytes = async (raw: string): Promise<Uint8Array> => {
  const cleaned = normaliseMnemonic(raw);
  if (!isValidMnemonic(cleaned)) {
    throw new SeedError(
      'INVALID_MNEMONIC',
      'Those recovery words are not a valid BIP39 phrase. Check for typos or a wrong word count.'
    );
  }
  return mnemonicToSeed(cleaned);
};

/**
 * Derive a Stacks account from BIP39 seed bytes.
 *
 * Takes seed bytes rather than the mnemonic so callers can unseal, derive and
 * wipe without the phrase itself being reconstructed in memory.
 */
export const deriveAccount = (
  seed: Uint8Array,
  network: StacksNetworkName = 'mainnet',
  accountIndex = 0
): DerivedAccount => {
  const path = derivationPath(accountIndex);
  const node = HDKey.fromMasterSeed(seed).derive(path);
  if (!node.privateKey) {
    throw new SeedError('DERIVATION_FAILED', `No private key at ${path}.`);
  }
  const privateKey = Buffer.from(node.privateKey).toString('hex') + '01';
  const version = network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
  return { privateKey, address: getAddressFromPrivateKey(privateKey, version), path };
};

/** Convenience for import flows: words → account. Prefer deriveAccount in signing paths. */
export const accountFromMnemonic = async (
  raw: string,
  network: StacksNetworkName = 'mainnet',
  accountIndex = 0
): Promise<DerivedAccount> => {
  const seed = await mnemonicToSeedBytes(raw);
  try {
    return deriveAccount(seed, network, accountIndex);
  } finally {
    seed.fill(0);
  }
};
