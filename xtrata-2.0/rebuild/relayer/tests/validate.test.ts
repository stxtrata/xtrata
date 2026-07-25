import { describe, expect, it } from 'vitest';
import { Cl, getAddressFromPrivateKey } from '@stacks/transactions';
import { checkBodyHints, validateSubmittedTx } from '../src/validate.js';
import {
  DEPLOYER,
  DROPS_ID,
  buildClaimTx,
  claimerKey,
  nftPostCondition,
  testConfig
} from './helpers.js';

const cfg = testConfig();

describe('validate: signed tx is the sole source of truth', () => {
  it('accepts a well-formed sponsored claim and derives all facts from the tx', async () => {
    const txHex = await buildClaimTx({ dropId: 42n });
    const result = validateSubmittedTx(txHex, cfg);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.facts.contractId).toBe(DROPS_ID);
    expect(result.facts.functionName).toBe('claim');
    expect(result.facts.dropId).toBe(42n);
    expect(result.facts.origin).toBe(getAddressFromPrivateKey(claimerKey(0), 'mainnet'));
    expect(result.facts.hasNftPostCondition).toBe(true);
  });

  it('accepts reserve-claim with zero post-conditions', async () => {
    const txHex = await buildClaimTx({ functionName: 'reserve-claim', postConditions: [] });
    const result = validateSubmittedTx(txHex, cfg);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.facts.hasNftPostCondition).toBe(false);
  });

  it('accepts claim-signed and extracts expiry + signature', async () => {
    const txHex = await buildClaimTx({
      functionName: 'claim-signed',
      functionArgs: [Cl.uint(3n), Cl.uint(900n), Cl.bufferFromHex('ab'.repeat(65))]
    });
    const result = validateSubmittedTx(txHex, cfg);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.facts.dropId).toBe(3n);
    expect(result.facts.expiresAt).toBe(900n);
    expect(result.facts.signature).toBe('ab'.repeat(65));
  });

  it('rejects a non-sponsored transaction', async () => {
    const txHex = await buildClaimTx({ sponsored: false, fee: 1000n });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'NOT_SPONSORED' });
  });

  it('rejects a nonzero origin fee', async () => {
    const txHex = await buildClaimTx({ fee: 1n });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'NONZERO_FEE' });
  });

  it('rejects a contract outside the allowlist', async () => {
    const txHex = await buildClaimTx({ contractName: 'xtrata-drops-v1-0' });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'CONTRACT_NOT_ALLOWED' });
  });

  it('rejects a non-sponsorable function on the drops contract', async () => {
    const txHex = await buildClaimTx({
      functionName: 'claim-fee',
      functionArgs: [Cl.uint(1n), Cl.uint(1000n)]
    });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'FUNCTION_NOT_ALLOWED' });
  });

  it('rejects malformed arguments (wrong count and wrong type)', async () => {
    const twoArgs = await buildClaimTx({ functionArgs: [Cl.uint(1n), Cl.uint(2n)] });
    expect(validateSubmittedTx(twoArgs, cfg)).toMatchObject({ ok: false, code: 'BAD_ARGS' });
    const wrongType = await buildClaimTx({ functionArgs: [Cl.stringAscii('1')] });
    expect(validateSubmittedTx(wrongType, cfg)).toMatchObject({ ok: false, code: 'BAD_ARGS' });
    const badSig = await buildClaimTx({
      functionName: 'claim-signed',
      functionArgs: [Cl.uint(1n), Cl.uint(2n), Cl.bufferFromHex('ab'.repeat(64))]
    });
    expect(validateSubmittedTx(badSig, cfg)).toMatchObject({ ok: false, code: 'BAD_ARGS' });
  });

  it('rejects allow-mode post-conditions', async () => {
    const txHex = await buildClaimTx({ postConditionMode: 'allow' });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'PC_MODE' });
  });

  it('rejects more than one post-condition', async () => {
    const txHex = await buildClaimTx({
      postConditions: [nftPostCondition(7n), nftPostCondition(8n)]
    });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'WRONG_POST_CONDITIONS' });
  });

  it('rejects an STX post-condition on the sender', async () => {
    const origin = getAddressFromPrivateKey(claimerKey(0), 'mainnet');
    const txHex = await buildClaimTx({
      postConditions: [{ type: 'stx-postcondition', address: origin, condition: 'lte', amount: 1000n }]
    });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'WRONG_POST_CONDITIONS' });
  });

  it('rejects an NFT post-condition for a foreign asset', async () => {
    const txHex = await buildClaimTx({
      postConditions: [
        {
          type: 'nft-postcondition',
          address: DROPS_ID,
          condition: 'sent',
          asset: `${DEPLOYER}.some-other-nft::xtrata-inscription`,
          assetId: Cl.uint(7n)
        }
      ]
    });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'WRONG_POST_CONDITIONS' });
  });

  it('rejects garbage, oversized, and non-canonical hex before deserialization', () => {
    expect(validateSubmittedTx('zz', cfg)).toMatchObject({ ok: false });
    expect(validateSubmittedTx('abc', cfg)).toMatchObject({ ok: false, code: 'BAD_TX' });
    expect(validateSubmittedTx('ab'.repeat(20_001), cfg)).toMatchObject({ ok: false, code: 'TX_TOO_LARGE' });
  });

  it('rejects a testnet transaction on a mainnet relayer', async () => {
    const txHex = await buildClaimTx({ network: 'testnet' });
    expect(validateSubmittedTx(txHex, cfg)).toMatchObject({ ok: false, code: 'WRONG_NETWORK' });
  });
});

describe('validate: body hints are advisory but must not contradict', () => {
  const facts = { contractId: DROPS_ID, dropId: 42n, functionName: 'claim' as const };

  it('accepts matching or absent hints', () => {
    expect(checkBodyHints(facts, {})).toEqual({ ok: true });
    expect(checkBodyHints(facts, { dropId: '42', contractId: DROPS_ID, functionName: 'claim' })).toEqual({ ok: true });
  });

  it('rejects a body drop id different from the signed one', () => {
    expect(checkBodyHints(facts, { dropId: '41' }).ok).toBe(false);
    expect(checkBodyHints(facts, { dropId: '-42' }).ok).toBe(false);
    expect(checkBodyHints(facts, { dropId: '42.0' }).ok).toBe(false);
  });

  it('rejects mismatched contract or function hints', () => {
    expect(checkBodyHints(facts, { contractId: `${DEPLOYER}.other` }).ok).toBe(false);
    expect(checkBodyHints(facts, { functionName: 'reserve-claim' }).ok).toBe(false);
  });
});
