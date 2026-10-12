/**
 * Listening-wallet key derivation.
 *
 * The radio's pay-per-play wallet is deliberately temporary and small (target 1 STX).
 * Its key is never stored anywhere: not in browser storage, not on Xtrata's servers.
 * It is re-derived from the passkey's PRF output every time the listener unlocks,
 * held in memory inside the wallet origin while they listen, and dropped on lock.
 *
 * This is NOT the passkey wallet in docs/PASSKEY-WALLET.md. That design seals a
 * 24-word seed. Here the PRF output IS the wallet, so there is nothing to seal and
 * no phrase to back up. Losing the passkey loses the (small) balance; that trade-off
 * is shown to the listener before they fund it.
 *
 * NEVER EDIT the constants below. Changing either one moves every listener's
 * wallet to an address nobody can reach. The known-answer test locks them.
 */
import { getAddressFromPrivateKey, publicKeyToString, pubKeyfromPrivKey, TransactionVersion } from '@stacks/transactions';

/** PRF input. Distinct from the passkey wallet's salt so the two are unrelated. */
export const LISTENING_PRF_SALT = new TextEncoder().encode('xtrata.radio.listening-wallet.v1');
/** HKDF domain separator for the listening key. */
export const LISTENING_HKDF_INFO = 'xtrata-radio-listening-key-v1';

const MIN_PRF_BYTES = 32;
/** secp256k1 group order. A derived scalar must be in [1, N). */
const SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;

export class ListeningKeyError extends Error {
  constructor(readonly code: 'PRF_TOO_SHORT' | 'KEY_OUT_OF_RANGE' | 'NO_CRYPTO', message: string) {
    super(message);
    this.name = 'ListeningKeyError';
  }
}

export interface ListeningIdentity {
  /** Hex with the 01 compressed suffix Stacks expects. Stays inside the wallet origin. */
  privateKey: string;
  publicKey: string;
  address: string;
}

const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** HKDF-SHA256(PRF output) → 32-byte secp256k1 scalar → mainnet Stacks account. */
export async function deriveListeningIdentity(prfOutput: Uint8Array): Promise<ListeningIdentity> {
  if (prfOutput.length < MIN_PRF_BYTES)
    throw new ListeningKeyError('PRF_TOO_SHORT', `Passkey returned ${prfOutput.length} bytes; at least ${MIN_PRF_BYTES} are required.`);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new ListeningKeyError('NO_CRYPTO', 'This browser cannot derive the listening wallet.');
  const base = await subtle.importKey('raw', prfOutput as unknown as BufferSource, 'HKDF', false, ['deriveBits']);
  const scalar = new Uint8Array(await subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode(LISTENING_HKDF_INFO) },
    base,
    256
  ));
  try {
    const value = BigInt('0x' + toHex(scalar));
    // Probability ~2^-128; refuse rather than reduce, so derivation stays a plain HKDF.
    if (value === 0n || value >= SECP256K1_N)
      throw new ListeningKeyError('KEY_OUT_OF_RANGE', 'This passkey produced an unusable key. Create a new listening wallet.');
    const privateKey = toHex(scalar) + '01';
    return {
      privateKey,
      publicKey: publicKeyToString(pubKeyfromPrivKey(privateKey)),
      address: getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet)
    };
  } finally {
    scalar.fill(0);
  }
}
