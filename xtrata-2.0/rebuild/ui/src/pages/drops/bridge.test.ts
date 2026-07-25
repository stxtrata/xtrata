import { describe, expect, it } from 'vitest';
import {
  Cl,
  PostConditionMode,
  cvToHex,
  hexToCV,
  postConditionToHex
} from '@stacks/transactions';
import { DropsTxBuilder, XtrataClientError } from '@xtrata/collections-client';
import { toWalletCallParams } from '../../services/submit';

/**
 * The drops half of the builder→wallet bridge.
 *
 * `services/submit.ts` is the single seam between the client's pure descriptors
 * and the @stacks/connect wallet bridge, and drops descriptors are the ones
 * that exercise its harder cases: NFT send conditions (escrow, recovery,
 * reserved claims) alongside the STX spend caps, and post-condition lists that
 * must never be dropped on the way through.
 */

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DROPS = `${DEPLOYER}.xtrata-drops-v3`;
const CORE = `${DEPLOYER}.xtrata-v3-2-3`;
const COLLECTION = `${DEPLOYER}.my-collection`;
const SENDER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const builder = new DropsTxBuilder({
  dropsContractId: DROPS,
  collectionContractId: COLLECTION,
  nftContractId: CORE,
  network: 'mainnet',
  sender: SENDER
});

describe('drops descriptors → wallet call params', () => {
  it('splits the contract id and serializes arguments to hex', () => {
    const params = toWalletCallParams(builder.activateDrop(4), { stxAddress: SENDER });

    expect(params.contractAddress).toBe(DEPLOYER);
    expect(params.contractName).toBe('xtrata-drops-v3');
    expect(params.functionName).toBe('activate-drop');
    expect(params.functionArgs).toEqual([cvToHex(Cl.uint(4))]);
    expect(params.stxAddress).toBe(SENDER);
    expect(params.network).toBe('mainnet');
  });

  it('always forces deny mode, never trusting the descriptor to have set it', () => {
    const params = toWalletCallParams(builder.claim(4));
    expect(params.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('refuses to submit anything that is not deny mode', () => {
    const tampered = { ...builder.claim(4), postConditionMode: 'allow' as unknown as 'deny' };
    expect(() => toWalletCallParams(tampered)).toThrow(XtrataClientError);
    expect(() => toWalletCallParams(tampered)).toThrow(/only deny mode/);
  });

  it('refuses a descriptor with no post-condition list at all', () => {
    const tampered = { ...builder.claim(4), postConditions: undefined as never };
    expect(() => toWalletCallParams(tampered)).toThrow(/no post-condition list/);
  });

  it('carries the creator zero-spend cap through create-drop', () => {
    const tx = builder.createDrop({
      mode: 'sponsored',
      eligibility: 'allowlist',
      startBlock: 100,
      endBlock: 900,
      totalLimit: 25,
      perWalletLimit: 2
    });
    const params = toWalletCallParams(tx);

    expect(params.functionArgs).toHaveLength(7);
    expect(params.functionArgs[0]).toBe(cvToHex(Cl.contractPrincipal(DEPLOYER, 'my-collection')));
    expect(params.functionArgs[1]).toBe(cvToHex(Cl.uint(3))); // mode
    expect(params.functionArgs[2]).toBe(cvToHex(Cl.uint(2))); // eligibility
    expect(params.postConditions).toEqual([postConditionToHex(tx.postConditions[0]!)]);
  });

  it('preserves every NFT post-condition on an escrow batch', () => {
    const entries = Array.from({ length: 25 }, (_, i) => ({ index: i, tokenId: 400 + i }));
    const tx = builder.escrowBatch(4, entries);

    const params = toWalletCallParams(tx);

    // One STX cap plus one NFT condition per escrowed token — nothing dropped.
    expect(tx.postConditions).toHaveLength(26);
    expect(params.postConditions).toHaveLength(26);
    expect(params.postConditions).toEqual(tx.postConditions.map((pc) => postConditionToHex(pc)));
  });

  it('preserves the contract-outbound NFT conditions on recover-batch', () => {
    const indexes = Array.from({ length: 25 }, (_, i) => i);
    const tx = builder.recoverBatch(4, indexes, [101, 102, 103]);

    const params = toWalletCallParams(tx);

    expect(params.postConditions).toHaveLength(4); // STX cap + 3 NFTs
    expect(params.functionArgs).toHaveLength(3);
    expect(hexToCV(params.functionArgs[2]!)).toMatchObject({ type: 'list' });
  });

  it('bridges a reserved claim with its exact expected token id', () => {
    const tx = builder.claim(4, { expectedTokenId: 777 });
    const params = toWalletCallParams(tx);

    expect(params.postConditions).toHaveLength(2);
    // The inbound allowance rides on the descriptor for the UI, not the wallet
    // params — post-conditions cannot express "I will receive".
    expect(tx.expectedInbound).toEqual([
      { assetId: `${CORE}::xtrata-inscription`, count: 1, tokenId: 777 }
    ]);
    expect('expectedInbound' in params).toBe(false);
  });

  it('bridges a fresh claim, where the token id is not knowable in advance', () => {
    const tx = builder.claim(4);
    const params = toWalletCallParams(tx);

    expect(params.postConditions).toHaveLength(1); // the zero-STX cap only
    expect(tx.expectedInbound?.[0]).toMatchObject({ count: 1 });
    expect(tx.expectedInbound?.[0]?.tokenId).toBeUndefined();
  });

  it('bridges claim-signed with its 65-byte attestation', () => {
    const signature = 'ab'.repeat(65);
    const tx = builder.claimSigned(4, 12_345, signature);
    const params = toWalletCallParams(tx);

    expect(params.functionName).toBe('claim-signed');
    expect(params.functionArgs).toHaveLength(3);
    expect(params.functionArgs[1]).toBe(cvToHex(Cl.uint(12_345)));
  });

  it('rejects a malformed attestation before the wallet ever opens', () => {
    expect(() => builder.claimSigned(4, 1, 'abcd')).toThrow(/65 bytes/);
  });

  it('bridges fund-budget with a spend cap equal to the funded amount', () => {
    const tx = builder.fundBudget(4, 2_500_000n);
    const params = toWalletCallParams(tx);

    expect(params.functionArgs[1]).toBe(cvToHex(Cl.uint(2_500_000n)));
    expect(params.postConditions).toHaveLength(1);
  });

  it('omits stxAddress when the caller did not supply one', () => {
    expect('stxAddress' in toWalletCallParams(builder.endDrop(4))).toBe(false);
  });
});
