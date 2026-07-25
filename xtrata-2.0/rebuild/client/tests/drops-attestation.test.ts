import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { serializeCV, tupleCV, uintCV, principalCV, contractPrincipalCV } from '@stacks/transactions';
import {
  CHAIN_IDS,
  SIMNET_CHAIN_ID,
  attestorPubkeyHash,
  buildAttestationMessageHash,
  buildAttestationPayload,
  signAttestation,
  verifyAttestation,
  type AttestationParams
} from '../src/drops/attestation.js';
import { XtrataClientError } from '../src/errors.js';

// Same fixtures as contracts/tests/xtrata-drops-v3.test.ts.
const ATTESTOR_KEY = '2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01';
const WRONG_KEY = '1c83f3b0b8fc8af8c7c4e336f4f9cdf4dbc8f6b8e1f3ebec705fca8d98379e4e01';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CLAIMER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

const params: AttestationParams = {
  chainId: CHAIN_IDS.mainnet,
  claimer: CLAIMER,
  collectionContractId: `${DEPLOYER}.xtrata-collection-v3`,
  dropsContractId: `${DEPLOYER}.xtrata-drops-v3`,
  dropId: 4,
  expiresAt: 10_000
};

describe('attestation payload', () => {
  it('serializes exactly like the contract-test construction (to-consensus-buff? parity)', () => {
    // Independent reconstruction mirroring contracts/tests/xtrata-drops-v3.test.ts.
    const reference = tupleCV({
      'chain-id': uintCV(CHAIN_IDS.mainnet),
      claimer: principalCV(CLAIMER),
      collection: contractPrincipalCV(DEPLOYER, 'xtrata-collection-v3'),
      contract: contractPrincipalCV(DEPLOYER, 'xtrata-drops-v3'),
      'drop-id': uintCV(4),
      'expires-at': uintCV(10_000)
    });
    const serialized = (serializeCV(reference) as string).replace(/^0x/i, '');
    expect(serializeCV(buildAttestationPayload(params))).toBe(serializeCV(reference));
    const digest = createHash('sha256').update(Buffer.from(serialized, 'hex')).digest('hex');
    expect(buildAttestationMessageHash(params)).toBe(digest);
  });

  it('exposes the chain-id table (mainnet 1, testnet/simnet 0x80000000)', () => {
    expect(CHAIN_IDS.mainnet).toBe(1n);
    expect(CHAIN_IDS.testnet).toBe(2_147_483_648n);
    expect(SIMNET_CHAIN_ID).toBe(2_147_483_648n);
  });
});

describe('attestation sign/verify round-trip', () => {
  const expectedHash = attestorPubkeyHash(ATTESTOR_KEY);

  it('attestorPubkeyHash is a 20-byte hash160 of the compressed pubkey', () => {
    expect(expectedHash).toMatch(/^[0-9a-f]{40}$/);
    expect(attestorPubkeyHash(WRONG_KEY)).not.toBe(expectedHash);
  });

  it('a signature by the attestor verifies against its pubkey hash', () => {
    const signature = signAttestation(params, ATTESTOR_KEY);
    expect(signature).toMatch(/^[0-9a-f]{130}$/); // 65 bytes RSV
    expect(verifyAttestation(params, signature, expectedHash)).toBe(true);
  });

  it('rejects tampered fields (dropId, claimer, expiry, chain-id, contract)', () => {
    const signature = signAttestation(params, ATTESTOR_KEY);
    const tampered: AttestationParams[] = [
      { ...params, dropId: 5 },
      { ...params, claimer: DEPLOYER },
      { ...params, expiresAt: 10_001 },
      { ...params, chainId: SIMNET_CHAIN_ID },
      { ...params, dropsContractId: `${DEPLOYER}.xtrata-drops-v2` },
      { ...params, collectionContractId: `${DEPLOYER}.other-collection` }
    ];
    for (const [i, bad] of tampered.entries()) {
      expect(verifyAttestation(bad, signature, expectedHash), `tamper case ${i}`).toBe(false);
    }
  });

  it('rejects a signature from the wrong key and a corrupted signature', () => {
    expect(verifyAttestation(params, signAttestation(params, WRONG_KEY), expectedHash)).toBe(false);
    const signature = signAttestation(params, ATTESTOR_KEY);
    const corrupted = (signature[0] === '0' ? '1' : '0') + signature.slice(1);
    expect(verifyAttestation(params, corrupted, expectedHash)).toBe(false);
  });

  it('validates signature and hash lengths', () => {
    expect(() => verifyAttestation(params, 'ab'.repeat(64), attestorPubkeyHash(ATTESTOR_KEY))).toThrow(
      XtrataClientError
    );
    expect(() => verifyAttestation(params, 'ab'.repeat(65), 'cd'.repeat(19))).toThrow(XtrataClientError);
  });
});
