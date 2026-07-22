import { describe, expect, it } from 'vitest';
import {
  DROPS_V11_MAINNET_CONTRACT_ID,
  attestorPubkeyHash,
  bnsNameKey,
  signCampaignAttestation,
  verifyCampaignAttestation
} from '../campaign-attestation';

const ATTESTOR_KEY = '2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01';
const payload = {
  contractId: DROPS_V11_MAINNET_CONTRACT_ID,
  campaignId: 0n,
  dropId: 7n,
  claimer: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
  bnsKeyHex: null as string | null,
  expiresAt: 1_000n
};

describe('Drops v1.1 campaign attestation', () => {
  it('normalizes a BNS name into the contract key', async () => {
    expect(await bnsNameKey(' Alice.BTC ')).toBe(await bnsNameKey('alice.btc'));
    expect(await bnsNameKey('alice.btc')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('signs the canonical Clarity payload and rejects changed bindings', async () => {
    const signedPayload = { ...payload, bnsKeyHex: await bnsNameKey('alice.btc') };
    const signature = await signCampaignAttestation(signedPayload, ATTESTOR_KEY);
    const hash = attestorPubkeyHash(ATTESTOR_KEY);
    expect(signature).toMatch(/^[0-9a-f]{130}$/);
    expect(await verifyCampaignAttestation(signedPayload, signature, hash)).toBe(true);
    expect(await verifyCampaignAttestation({ ...signedPayload, dropId: 8n }, signature, hash)).toBe(
      false
    );
    expect(
      await verifyCampaignAttestation({ ...signedPayload, expiresAt: 1_001n }, signature, hash)
    ).toBe(false);
  });
});
