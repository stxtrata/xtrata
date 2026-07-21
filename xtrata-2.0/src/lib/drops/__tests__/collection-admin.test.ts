import { ClarityType } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import {
  COLLECTION_DROPS_CONTRACT_ID,
  COLLECTION_DROPS_DEPLOYER,
  COLLECTION_DROPS_NFT_CONTRACT_ID,
  buildCollectionDropArgs,
  collectionDropAccessRole,
  parseCollectionBudget,
  readBnsV2Owner,
  validateCollectionCampaignRules
} from '../collection-admin';

const JIM_OWNER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

describe('collection Drops v1.1 admin helpers', () => {
  it('keeps the collection pathway pinned away from the legacy v1.0 contract', () => {
    expect(COLLECTION_DROPS_CONTRACT_ID).toBe(`${COLLECTION_DROPS_DEPLOYER}.xtrata-drops-v1-1`);
    expect(COLLECTION_DROPS_NFT_CONTRACT_ID).toBe(`${COLLECTION_DROPS_DEPLOYER}.xtrata-v3-2-3`);
    expect(COLLECTION_DROPS_CONTRACT_ID).not.toContain('v1-0');
  });

  it('allows only the main Xtrata address and the live jim.btc owner', () => {
    expect(collectionDropAccessRole(COLLECTION_DROPS_DEPLOYER, JIM_OWNER)).toBe('xtrata');
    expect(collectionDropAccessRole(JIM_OWNER.toLowerCase(), JIM_OWNER)).toBe('jim.btc');
    expect(collectionDropAccessRole('SP000000000000000000002Q6VF78', JIM_OWNER)).toBeNull();
    expect(collectionDropAccessRole(JIM_OWNER, null)).toBeNull();
  });

  it('accepts only an active, valid BNS v2 owner', () => {
    expect(readBnsV2Owner({ status: 'active', data: { owner: JIM_OWNER, is_valid: true } })).toBe(
      JIM_OWNER
    );
    expect(readBnsV2Owner({ status: 'inactive', data: { owner: JIM_OWNER } })).toBeNull();
    expect(readBnsV2Owner({ data: { owner: JIM_OWNER, revoked: true } })).toBeNull();
    expect(readBnsV2Owner({ data: { owner: 'not-an-address' } })).toBeNull();
  });

  it('parses an exact STX sponsorship budget and enforces the contract minimum', () => {
    expect(parseCollectionBudget('0.05')).toEqual({ ok: true, ustx: 50_000n });
    expect(parseCollectionBudget('0.100001')).toEqual({ ok: true, ustx: 100_001n });
    expect(parseCollectionBudget('0.049999').ok).toBe(false);
    expect(parseCollectionBudget('0.1234567').ok).toBe(false);
  });

  it('builds immutable campaign arguments with all intended collection rules', () => {
    const result = validateCollectionCampaignRules({
      engineId: '42',
      maxSupply: '1024',
      onePerWallet: true,
      requireBns: true,
      onePerBns: true
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.engineId).toBe(42n);
    expect(result.maxSupply).toBe(1024n);
    expect(result.functionArgs).toHaveLength(5);
  });

  it('rejects invalid immutable campaign combinations', () => {
    expect(
      validateCollectionCampaignRules({
        engineId: '42',
        maxSupply: '1024',
        onePerWallet: true,
        requireBns: false,
        onePerBns: true
      })
    ).toEqual({ ok: false, error: 'One per BNS requires BNS ownership to be required.' });
  });

  it('builds the four create-campaign-drop arguments against Xtrata v3.2.3', () => {
    const args = buildCollectionDropArgs({ tokenId: 77n, budgetUstx: 100_000n, campaignId: 0n });
    expect(args).toHaveLength(4);
    expect(args[0].type).toBe(ClarityType.PrincipalContract);
    expect(args[1]).toMatchObject({ type: ClarityType.UInt, value: 77n });
    expect(args[2]).toMatchObject({ type: ClarityType.UInt, value: 100_000n });
    expect(args[3]).toMatchObject({ type: ClarityType.UInt, value: 0n });
  });
});
