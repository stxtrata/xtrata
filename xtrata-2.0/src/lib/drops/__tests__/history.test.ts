import { describe, expect, it } from 'vitest';
import { isClaimActivity, isCreateActivity, parseDropEventForTest } from '../history';

/**
 * Real print-event payloads captured from the live mainnet contract
 * SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-1.
 *
 * Regression guard for the bug where the Drops page showed an empty history:
 * every claim on that contract went through the CAMPAIGN path and emits
 * "claim-campaign" / "create-campaign-drop", but the parser accepted only
 * "claim" / "create-drop" and the renderer matched only type === 'claim'.
 * Because settle-refund deletes the on-chain Drops row, these events are the
 * ONLY surviving record of a settled drop and its holder — so dropping them
 * made 33 claimed drops and all 33 holders invisible.
 */
const CLAIM_CAMPAIGN_HEX =
  '0x0c0000000907626e732d6b65790a0200000020b09e11344fbf0b45715aa180df447930e3da9ed790fa1848201d6aa83925a6cd' +
  '0b63616d706169676e2d6964010000000000000000000000000000000007636c61696d65720516b7b47cd8a681ad2c93df1a93c5db68f6c6f5eac4' +
  '0763726561746f72051641c139d4394e910afadb7ff2b32ee14b273eb5180764726f702d69640100000000000000000000000000000006' +
  '0765646974696f6e0a0100000000000000000000000000000006056576656e740d0000000e636c61696d2d63616d706169676e' +
  '0c6e66742d636f6e74726163740616e55cbbaafd88b6e63b036a3a2303b029e039cbbd0d7874726174612d76332d322d33' +
  '08746f6b656e2d69640100000000000000000000000000000b1e';

const SETTLE_REFUND_HEX =
  '0x0c000000060b63616d706169676e2d69640a01000000000000000000000000000000000763' +
  '6c61696d65640100000000000000000000000000000e100763726561746f72051641c139d4394e910afadb7ff2b32ee14b273eb51' +
  '80764726f702d69640100000000000000000000000000000006056576656e740d0000000d736574746c652d726566756e64' +
  '08726566756e6465640100000000000000000000000000017890';

const eventFrom = (hex: string, txId = '0xdeadbeef') => ({
  event_index: 1,
  event_type: 'smart_contract_log',
  tx_id: txId,
  block_height: 1234,
  contract_log: { topic: 'print', value: { hex } }
});

describe('drops history — campaign events', () => {
  it('parses a real claim-campaign event (previously dropped entirely)', () => {
    const parsed = parseDropEventForTest(eventFrom(CLAIM_CAMPAIGN_HEX));
    expect(parsed).not.toBeNull();
    expect(parsed!.type).toBe('claim-campaign');
    expect(parsed!.dropId).toBe(6n);
    expect(parsed!.tokenId).toBe(2846n);
    expect(parsed!.claimer).toBe('SP2VV8Z6RMT0TTB4KVWD97HEVD3VCDXFARK7XQEF2');
    expect(parsed!.campaignId).toBe(0n);
    expect(parsed!.edition).toBe(6n);
    expect(parsed!.nftContract).toContain('xtrata-v3-2-3');
    expect(parsed!.bnsKey).toMatch(/^[0-9a-f]{64}$/);
  });

  it('still parses non-campaign lifecycle events', () => {
    const parsed = parseDropEventForTest(eventFrom(SETTLE_REFUND_HEX));
    expect(parsed).not.toBeNull();
    expect(parsed!.type).toBe('settle-refund');
    expect(parsed!.dropId).toBe(6n);
  });

  it('treats campaign claims as claims — what the history list renders', () => {
    // The renderer filters on this predicate. Before the fix it compared
    // `type === 'claim'`, which no campaign claim ever satisfies.
    expect(isClaimActivity('claim-campaign')).toBe(true);
    expect(isClaimActivity('claim')).toBe(true);
    expect(isClaimActivity('settle-refund')).toBe(false);

    expect(isCreateActivity('create-campaign-drop')).toBe(true);
    expect(isCreateActivity('create-drop')).toBe(true);
    expect(isCreateActivity('claim-campaign')).toBe(false);
  });

  it('a claimed campaign drop survives settlement in the event record', () => {
    // settle-refund deletes the Drops map row, so this is the durability
    // guarantee the historic gallery depends on: the claim event still names
    // the holder and the token after the drop is gone from contract state.
    const claim = parseDropEventForTest(eventFrom(CLAIM_CAMPAIGN_HEX))!;
    const settle = parseDropEventForTest(eventFrom(SETTLE_REFUND_HEX))!;
    expect(settle.dropId).toBe(claim.dropId);
    expect(claim.claimer).toBeTruthy();
    expect(claim.tokenId).toBeTruthy();
  });

  it('ignores non-print and unknown events without throwing', () => {
    expect(parseDropEventForTest({ event_type: 'stx_transfer_event' })).toBeNull();
    expect(
      parseDropEventForTest({ event_type: 'smart_contract_log', contract_log: { topic: 'other' } })
    ).toBeNull();
    expect(
      parseDropEventForTest({
        event_type: 'smart_contract_log',
        contract_log: { topic: 'print', value: { hex: '0x00' } }
      })
    ).toBeNull();
  });
});
