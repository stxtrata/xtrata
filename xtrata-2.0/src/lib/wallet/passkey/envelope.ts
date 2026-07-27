/**
 * Passkey-sealed seed envelope.
 *
 * A passkey CANNOT sign a Stacks transaction — WebAuthn signs secp256r1 (P-256)
 * and Stacks needs secp256k1, and WebAuthn does not let us choose the signed
 * message anyway. The passkey's job here is narrower: its PRF extension returns
 * a stable 32-byte secret that never leaves the authenticator, and we use that
 * secret to encrypt a normal Stacks seed.
 *
 * The ciphertext produced here is what a server may hold. It is useless without
 * the passkey, so holding it is not custody.
 *
 * Proven on real hardware by recursive-apps/23-passkey-canary.
 */

/** PRF input salt. Changing this orphans every existing wallet. Never edit. */
export const PRF_SALT = new TextEncoder().encode('xtrata.wallet.v1.seed-encryption');

/** HKDF domain separator. Changing this orphans every existing wallet. Never edit. */
const HKDF_INFO = 'xtrata-seed-v1';

/** AES-GCM nonce length in bytes. */
const IV_BYTES = 12;

/** PRF outputs shorter than this are rejected rather than silently weakening the key. */
const MIN_PRF_BYTES = 32;

export interface SealedSeed {
  /** AES-GCM ciphertext of the seed, including the 16-byte auth tag. */
  ciphertext: Uint8Array;
  /** Per-seal random nonce. Safe to store in the clear alongside the ciphertext. */
  iv: Uint8Array;
}

export class EnvelopeError extends Error {
  constructor(
    readonly code: 'PRF_TOO_SHORT' | 'SEAL_FAILED' | 'OPEN_FAILED',
    message: string
  ) {
    super(message);
    this.name = 'EnvelopeError';
  }
}

/**
 * TS 5.7 made Uint8Array generic over its backing buffer, so a plain
 * `Uint8Array` no longer structurally satisfies WebCrypto's `BufferSource`.
 * The runtime value is already correct; this only restates that to the compiler.
 */
const asBufferSource = (bytes: Uint8Array): BufferSource => bytes as unknown as BufferSource;

const subtle = (): SubtleCrypto => {
  const c = globalThis.crypto?.subtle;
  if (!c) throw new EnvelopeError('SEAL_FAILED', 'WebCrypto subtle is unavailable in this environment.');
  return c;
};

/**
 * HKDF the raw PRF output into an AES key.
 *
 * The PRF output is never used as key material directly: it is authenticator
 * output of unspecified internal structure, and the HKDF info string gives us
 * domain separation so the same passkey can key other things later without
 * those uses being related.
 */
const deriveKey = async (prfOutput: Uint8Array): Promise<CryptoKey> => {
  if (prfOutput.length < MIN_PRF_BYTES) {
    throw new EnvelopeError(
      'PRF_TOO_SHORT',
      `PRF returned ${prfOutput.length} bytes; at least ${MIN_PRF_BYTES} are required.`
    );
  }
  const base = await subtle().importKey('raw', asBufferSource(prfOutput), 'HKDF', false, ['deriveKey']);
  return subtle().deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array(32),
      info: new TextEncoder().encode(HKDF_INFO)
    },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/** Encrypt a seed under the passkey's PRF secret. */
export const sealSeed = async (seed: Uint8Array, prfOutput: Uint8Array): Promise<SealedSeed> => {
  const key = await deriveKey(prfOutput);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  try {
    const ciphertext = new Uint8Array(
      await subtle().encrypt({ name: 'AES-GCM', iv }, key, asBufferSource(seed))
    );
    return { ciphertext, iv };
  } catch (err) {
    throw new EnvelopeError('SEAL_FAILED', `Could not seal the seed: ${(err as Error).message}`);
  }
};

/**
 * Decrypt a seed. Throws on the wrong passkey or tampered ciphertext — AES-GCM
 * authenticates, so a modified blob fails loudly instead of yielding a garbage
 * seed that would silently derive the wrong wallet.
 */
export const openSeed = async (sealed: SealedSeed, prfOutput: Uint8Array): Promise<Uint8Array> => {
  const key = await deriveKey(prfOutput);
  try {
    return new Uint8Array(
      await subtle().decrypt(
        { name: 'AES-GCM', iv: asBufferSource(sealed.iv) },
        key,
        asBufferSource(sealed.ciphertext)
      )
    );
  } catch {
    throw new EnvelopeError(
      'OPEN_FAILED',
      'Could not open the seed. Wrong passkey, or the stored blob has been altered.'
    );
  }
};

/**
 * Overwrite secret bytes once they are no longer needed.
 *
 * Not a guarantee — JS engines copy and GC freely — but it shortens the window
 * in which a plaintext seed sits in a reachable buffer. Every caller that
 * unseals a seed must call this in a `finally`.
 */
export const wipe = (...buffers: Array<Uint8Array | undefined>): void => {
  for (const buf of buffers) buf?.fill(0);
};

/**
 * Unseal, use, and wipe — the only shape in which callers should touch a seed.
 * The plaintext is zeroed even if `use` throws.
 */
export const withSeed = async <T>(
  sealed: SealedSeed,
  prfOutput: Uint8Array,
  use: (seed: Uint8Array) => Promise<T>
): Promise<T> => {
  const seed = await openSeed(sealed, prfOutput);
  try {
    return await use(seed);
  } finally {
    wipe(seed);
  }
};
