import {
  Cl,
  hash160,
  privateKeyToPublic,
  publicKeyFromSignatureRsv,
  serializeCV,
  signMessageHashRsv,
  type TupleCV
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { XtrataClientError } from '../errors.js';
import { bytesToHex, hexToBytes } from '../hash.js';
import type { NetworkName } from '../network.js';

/**
 * Signed-eligibility attestations for xtrata-drops-v3 claim-signed.
 *
 * The contract recomputes
 *   (sha256 (to-consensus-buff? { chain-id, claimer, collection, contract,
 *                                 drop-id, expires-at }))
 * and checks (hash160 recovered-pubkey) against its configured attestor hash.
 * The tuple keys serialize in lexicographic order; Cl.tuple + serializeCV
 * reproduce to-consensus-buff? byte-for-byte.
 */

/** Stacks chain ids as exposed by Clarity's `chain-id` keyword. */
export const CHAIN_IDS: Record<NetworkName, bigint> = {
  mainnet: 1n,
  testnet: 2_147_483_648n,
  devnet: 2_147_483_648n
};

export const SIMNET_CHAIN_ID = 2_147_483_648n;

export interface AttestationParams {
  /** Clarity `chain-id` of the target network (see CHAIN_IDS). */
  chainId: bigint;
  /** The claimer principal (tx-sender of the claim-signed call). */
  claimer: string;
  /** `SPxxx.collection-name` — the drop's collection contract. */
  collectionContractId: string;
  /** `SPxxx.xtrata-drops-v3` — the drops singleton the claim targets. */
  dropsContractId: string;
  dropId: number;
  /** Stacks block height the attestation expires at (inclusive). */
  expiresAt: number;
}

/** The consensus-buff tuple the contract hashes. */
export const buildAttestationPayload = (params: AttestationParams): TupleCV =>
  Cl.tuple({
    'chain-id': Cl.uint(params.chainId),
    claimer: Cl.principal(params.claimer),
    collection: Cl.principal(params.collectionContractId),
    contract: Cl.principal(params.dropsContractId),
    'drop-id': Cl.uint(params.dropId),
    'expires-at': Cl.uint(params.expiresAt)
  });

/** sha256 over the serialized payload — the message hash that gets signed. */
export const buildAttestationMessageHash = (params: AttestationParams): string => {
  const serialized = serializeCV(buildAttestationPayload(params));
  return bytesToHex(sha256(hexToBytes(serialized)));
};

/**
 * Relayer/test-side signer: 65-byte RSV signature hex over the message hash.
 * `privateKey` is the attestor's key (hex, with or without the 01 suffix).
 */
export const signAttestation = (params: AttestationParams, privateKey: string): string =>
  signMessageHashRsv({ messageHash: buildAttestationMessageHash(params), privateKey });

/** hash160 of the attestor's compressed pubkey — the on-chain config value. */
export const attestorPubkeyHash = (privateKey: string): string => {
  const pub = privateKeyToPublic(privateKey);
  return bytesToHex(hash160(typeof pub === 'string' ? hexToBytes(pub) : pub));
};

/**
 * Client-side sanity check mirroring the contract's verification: recover the
 * pubkey from the RSV signature and compare its hash160 to the expected
 * attestor pubkey hash (20-byte hex).
 */
export const verifyAttestation = (
  params: AttestationParams,
  signatureHex: string,
  expectedPubkeyHashHex: string
): boolean => {
  if (hexToBytes(signatureHex).length !== 65) {
    throw new XtrataClientError('plan-invalid', 'attestation signature must be 65 bytes');
  }
  const expected = hexToBytes(expectedPubkeyHashHex);
  if (expected.length !== 20) {
    throw new XtrataClientError('plan-invalid', 'attestor pubkey hash must be 20 bytes');
  }
  let recovered: string;
  try {
    recovered = publicKeyFromSignatureRsv(buildAttestationMessageHash(params), signatureHex);
  } catch {
    return false;
  }
  return bytesToHex(hash160(hexToBytes(recovered))) === bytesToHex(expected);
};
