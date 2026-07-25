/**
 * Signed-eligibility attestations for xtrata-drops-v3 `claim-signed`.
 *
 * Byte-exact mirror of the contract's verification path:
 *   payload = to-consensus-buff? { chain-id, claimer, collection, contract,
 *                                  drop-id, expires-at }
 *   digest  = sha256(payload)
 *   check   = hash160(secp256k1-recover(digest, signature)) == attestor-hash
 * (Construction identical to rebuild/contracts/tests/xtrata-drops-v3.test.ts.)
 * Replay resistance comes from the tuple itself: drop-id, claimer, collection,
 * contract principal, chain-id and expires-at are all bound (threat 7).
 */
import { sha256 } from '@noble/hashes/sha256';
import {
  hash160,
  principalCV,
  privateKeyToPublic,
  publicKeyFromSignatureRsv,
  serializeCV,
  signMessageHashRsv,
  tupleCV,
  uintCV
} from '@stacks/transactions';

export interface AttestationParams {
  chainId: bigint;
  claimer: string;
  /** fully-qualified collection contract id */
  collectionId: string;
  /** fully-qualified drops contract id */
  dropsContractId: string;
  dropId: bigint;
  expiresAt: bigint;
}

const hexToBytes = (hex: string): Uint8Array =>
  Uint8Array.from(Buffer.from(hex.replace(/^0x/i, ''), 'hex'));

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** sha256 of the consensus-serialized attestation tuple, hex. */
export const attestationDigest = (params: AttestationParams): string => {
  const payload = tupleCV({
    'chain-id': uintCV(params.chainId),
    claimer: principalCV(params.claimer),
    collection: principalCV(params.collectionId),
    contract: principalCV(params.dropsContractId),
    'drop-id': uintCV(params.dropId),
    'expires-at': uintCV(params.expiresAt)
  });
  const serialized = serializeCV(payload) as string;
  return bytesToHex(sha256(hexToBytes(serialized)));
};

/** RSV signature (hex, 65 bytes) over the attestation digest. */
export const signAttestation = (params: AttestationParams, attestorKey: string): string =>
  signMessageHashRsv({ messageHash: attestationDigest(params), privateKey: attestorKey });

/** hash160 of the attestor's compressed public key — what goes on-chain. */
export const attestorPubkeyHash = (attestorKey: string): string => {
  const pub = privateKeyToPublic(attestorKey);
  return bytesToHex(hash160(typeof pub === 'string' ? hexToBytes(pub) : pub));
};

/** Off-chain mirror of the contract's check (for tests and diagnostics). */
export const verifyAttestation = (
  params: AttestationParams,
  signatureHex: string,
  expectedPubkeyHash: string
): boolean => {
  try {
    const recovered = publicKeyFromSignatureRsv(attestationDigest(params), signatureHex);
    return bytesToHex(hash160(hexToBytes(recovered))) === expectedPubkeyHash.toLowerCase();
  } catch {
    return false;
  }
};
