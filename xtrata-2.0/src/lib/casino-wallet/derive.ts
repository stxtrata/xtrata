/**
 * Casino wallet key derivation (ParallaX Casino LAYR exchange, TESTNET ONLY).
 *
 * Same scheme as the radio's listening wallet (src/lib/listening-wallet/derive.ts): the passkey's PRF output is imported as a
 * non-extractable HKDF key and one HKDF-SHA256 step gives the secp256k1 scalar. The key is never stored; it is re-derived on every
 * unlock inside the casino wallet origin (casino-wallet.xtrata.xyz) and dropped on lock.
 *
 * Its own PRF salt and HKDF label, so a casino wallet is unrelated to any listening wallet even if the same passkey were ever used
 * for both. Addresses are TESTNET (ST…). Plan: docs/plans/CASINO-PASSKEY-WALLET-PLAN.md.
 *
 * NEVER EDIT the constants below. Changing either one moves every player's casino wallet to an address nobody can reach. The
 * known-answer test (src/lib/casino-wallet/__tests__/casino-wallet.test.ts) locks them.
 */
import { getAddressFromPrivateKey, publicKeyToString, pubKeyfromPrivKey, TransactionVersion } from '@stacks/transactions';
import { listeningBase } from '../listening-wallet/derive';

/** PRF input. Distinct from the listening wallet's salt. */
export const CASINO_PRF_SALT = new TextEncoder().encode('xtrata.casino.testnet-wallet.v1');
/** HKDF domain separator for the casino key. */
export const CASINO_HKDF_INFO = 'xtrata-casino-testnet-key-v1';

/** secp256k1 group order. A scalar must be in [1, N). */
const SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;

export interface CasinoIdentity {
  /** Hex with the 01 compressed suffix. Stays inside the casino wallet origin. */
  privateKey: string;
  publicKey: string;
  /** Testnet standard address (ST…). */
  address: string;
}

const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** 32 scalar bytes → testnet identity. Refuses an out-of-range scalar rather than reducing it (probability ~2^-128). */
export function identityFromScalar(scalar: Uint8Array): CasinoIdentity {
  if (scalar.length !== 32) throw new Error('A casino wallet key is 32 bytes.');
  const value = BigInt('0x' + toHex(scalar));
  if (value === 0n || value >= SECP256K1_N) throw new Error('This key is unusable. Make a new casino wallet.');
  const privateKey = toHex(scalar) + '01';
  return {
    privateKey,
    publicKey: publicKeyToString(pubKeyfromPrivKey(privateKey)),
    address: getAddressFromPrivateKey(privateKey, TransactionVersion.Testnet)
  };
}

/** The passkey's PRF output as a non-extractable HKDF key (the radio's import, unchanged). */
export const casinoBase = listeningBase;

/** HKDF-SHA256(PRF secret, CASINO_HKDF_INFO) → secp256k1 scalar → testnet Stacks account. */
export async function deriveCasinoIdentity(base: CryptoKey): Promise<CasinoIdentity> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('This browser cannot derive the casino wallet.');
  const scalar = new Uint8Array(await subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode(CASINO_HKDF_INFO) },
    base,
    256
  ));
  try { return identityFromScalar(scalar); } finally { scalar.fill(0); }
}

/**
 * The no-passkey fallback ("this browser only"): a random key, kept in the casino wallet origin's own storage. Acceptable ONLY because
 * this wallet is testnet play money. Never port this to a mainnet wallet (docs/radio/PAY-PER-PLAY.md explains why the radio refuses it).
 */
export function randomCasinoKeyHex(): string {
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const value = BigInt('0x' + toHex(bytes));
    if (value !== 0n && value < SECP256K1_N) { const hex = toHex(bytes); bytes.fill(0); return hex; }
  }
}

export function identityFromKeyHex(hex: string): CasinoIdentity {
  if (!/^[0-9a-f]{64}$/.test(hex)) throw new Error('The saved casino wallet key is damaged.');
  const bytes = Uint8Array.from(hex.match(/../g)!, (b) => parseInt(b, 16));
  try { return identityFromScalar(bytes); } finally { bytes.fill(0); }
}
