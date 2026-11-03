import { describe, expect, it, vi } from 'vitest';
import { bufferCV, noneCV, responseOkCV, someCV, standardPrincipalCV, tupleCV, uintCV } from '@stacks/transactions';
import { catalogue, CORE, readRoyaltySnapshot, validatePaymentTransaction, verifyRoyaltyPayment, royaltyRows, paymentEditions, type Snapshot } from '../audionaut-royalties';
import { COLLECTION_CONTRACT_ID } from '../../../src/audionaut/core';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const TX = '0x' + 'a'.repeat(64), HASH = '0x' + 'b'.repeat(64);
const edition = catalogue.editions[0];
const snapshot: Snapshot = { checkedAt: 1, blockHeight: 120,
  minted: [{ ...edition, tokenId: 3100, mintedAt: 100 }],
  artists: catalogue.artists.map(a => ({ ...a, address: ADDRESS, error: null })) };
const transaction = (patch: any = {}) => ({ tx_id: TX, tx_status: 'success', canonical: true, microblock_canonical: true,
  is_unanchored: false, tx_type: 'token_transfer', block_height: 110, index_block_hash: HASH,
  token_transfer: { recipient_address: ADDRESS, amount: '5000000' }, ...patch });
function reader() {
  return { anchor: vi.fn(async () => ({ height: 120, hash: HASH, confirmations: 6 })), canonical: vi.fn(async () => undefined),
    read: vi.fn(async (contract: string, name: string) => {
      if (name === 'get-minted-index-count') return responseOkCV(uintCV(1));
      if (name === 'get-minted-id') return someCV(tupleCV({ 'token-id': uintCV(3100) }));
      if (name === 'get-token-mint-context') return someCV(tupleCV({ 'minted-at': uintCV(100) }));
      if (name === 'get-owner') return responseOkCV(someCV(standardPrincipalCV(ADDRESS)));
      if (name === 'get-chunk') return someCV(bufferCV(new TextEncoder().encode(`<script src="/i/3060?contractId=${CORE}" data-edition="1" data-seed="${edition.seed}"></script>`)));
      throw Error('Unexpected read ' + contract + name);
    }) };
}
describe('Audionaut royalty source of truth', () => {
  it('reconstructs minted identities and reads direct holders at one confirmed anchor', async () => {
    const rpc = reader(); const result = await readRoyaltySnapshot({}, rpc);
    expect(result.minted).toEqual(snapshot.minted);
    expect(result.artists).toHaveLength(10);
    expect(rpc.read).toHaveBeenCalledWith(COLLECTION_CONTRACT_ID, 'get-minted-id', [uintCV(0)], HASH);
    expect(rpc.read.mock.calls.every(call => (call as any)[3] === HASH)).toBe(true);
    expect(rpc.canonical).toHaveBeenCalledWith(120, HASH);
  });
  it('fails closed on an incomplete minted index instead of showing an empty ledger', async () => {
    const rpc = reader(); rpc.read.mockImplementation(async (_c, name) => name === 'get-minted-index-count' ? responseOkCV(uintCV(1)) : noneCV());
    await expect(readRoyaltySnapshot({}, rpc)).rejects.toThrow('incomplete');
  });
  it('does not grant a guessed receiving address when an owner read fails', async () => {
    const rpc = reader(), original = rpc.read.getMockImplementation()!;
    rpc.read.mockImplementation(async (c, name) => { if (name === 'get-owner') throw Error('offline'); return original(c, name); });
    const result = await readRoyaltySnapshot({}, rpc);
    expect(result.artists.every(a => a.address === null && a.error)).toBe(true);
  });
  it('rejects an edition with an unreviewed seed or engine reference', async () => {
    const rpc = reader(), original = rpc.read.getMockImplementation()!;
    rpc.read.mockImplementation(async (c, name) => name === 'get-chunk'
      ? someCV(bufferCV(new TextEncoder().encode(`<script src="/i/4000?contractId=${CORE}" data-edition="1" data-seed="0"></script>`)))
      : original(c, name));
    await expect(readRoyaltySnapshot({}, rpc)).rejects.toThrow('reviewed');
  });
  it('uses the earliest song including credit overrides, merging case variants', () => {
    expect(catalogue.artists.find(a => a.artist === '3ai3')?.firstSongId).toBe(1091);
    expect(catalogue.artists.find(a => a.artist === 'BotCupid')?.firstSongId).toBe(2753);
    expect(catalogue.editions.filter(e => e.songId === 2989).every(e => e.artist === 'DeOrganized Media')).toBe(true);
    expect(catalogue.editions.find(e => e.edition === 84)?.artist).toBe('Χ₮¡₪¢₮');
  });
});
describe('5 STX royalty receipt verification', () => {
  it.each([
    { tx_status: 'pending' }, { tx_status: 'abort_by_post_condition' }, { canonical: false }, { is_unanchored: true },
    { microblock_canonical: false }, { tx_type: 'contract_call' }, { block_height: 99 },
    { token_transfer: { recipient_address: ADDRESS, amount: '4999999' } },
    { token_transfer: { recipient_address: 'someone-else', amount: '5000000' } }
  ])('rejects non-payment evidence %j', patch => {
    expect(() => validatePaymentTransaction(transaction(patch), TX, ADDRESS, 5000000, 100)).toThrow();
  });
  it('checks historical receiving-song ownership rather than the current address', async () => {
    const rpc = reader();
    const oldHolderSnapshot = { ...snapshot, artists: snapshot.artists.map(a => ({ ...a, address: null })) };
    const proof = await verifyRoyaltyPayment({}, { tx_id: TX, recipient: ADDRESS, editions_json: '[1]' }, oldHolderSnapshot, rpc, async () => transaction());
    expect(proof.editions).toEqual([1]);
    expect(rpc.read).toHaveBeenCalledWith(CORE, 'get-owner', [uintCV(577)], HASH);
    expect(rpc.canonical).toHaveBeenCalledWith(110, HASH);
  });
  it('requires 10 STX for a transfer covering two editions and checks their shared payee once', async () => {
    const live = { ...snapshot, minted: [...snapshot.minted, { ...catalogue.editions[11], tokenId: 3101, mintedAt: 101 }] };
    const rpc = reader(), record = { tx_id: TX, recipient: ADDRESS, editions_json: '[1,12]' };
    const proof = await verifyRoyaltyPayment({}, record, live, rpc, async () => transaction({ token_transfer: { recipient_address: ADDRESS, amount: '10000000' } }));
    expect(proof.editions).toEqual([1, 12]); expect(rpc.read).toHaveBeenCalledTimes(1);
    await expect(verifyRoyaltyPayment({}, record, live, rpc, async () => transaction())).rejects.toThrow('total');
  });
  it('refuses a wrong historical holder or a payment for an unminted edition', async () => {
    const rpc = reader(); rpc.read.mockResolvedValue(responseOkCV(noneCV()));
    await expect(verifyRoyaltyPayment({}, { tx_id: TX, recipient: ADDRESS, editions_json: '[1]' }, snapshot, rpc, async () => transaction())).rejects.toThrow('did not hold');
    await expect(verifyRoyaltyPayment({}, { tx_id: TX, recipient: ADDRESS, editions_json: '[2]' }, snapshot, reader(), async () => transaction())).rejects.toThrow('not minted');
    expect(() => paymentEditions([1, 1])).toThrow('once');
  });
  it('distinguishes unrecorded payments from temporarily unverifiable receipts', async () => {
    const external = { ...snapshot, artists: snapshot.artists.map(a => ({ ...a, address: 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX' })) };
    const [noReceipt] = await royaltyRows({}, external, []);
    expect(noReceipt.status).toBe('unrecorded');
    const [failed] = await royaltyRows({}, snapshot, [{ tx_id: TX, recipient: ADDRESS, editions_json: '[1]' }], async () => { throw Error('offline'); });
    expect(failed.status).toBe('unverified'); expect(failed.note).toBe('offline');
    const [paid] = await royaltyRows({}, snapshot, [{ tx_id: TX, recipient: ADDRESS, editions_json: '[1]' }], async () => ({}));
    expect(paid.status).toBe('paid');
  });
});

it('settles Xtrata-held royalties by policy and distinguishes sale evidence from a transfer', async () => {
  const [retained] = await royaltyRows({}, snapshot, [], undefined, async () => ({ txId: TX, amountMicroStx: '6000000' }));
  expect(retained.status).toBe('retained'); expect(retained.proofKind).toBe('sale'); expect(retained.txId).toBe(TX);
  const [awaitingProof] = await royaltyRows({}, snapshot, [], undefined, async () => { throw Error('429'); });
  expect(awaitingProof.status).toBe('retained'); expect(awaitingProof.txId).toBeNull(); expect(awaitingProof.note).toContain('could not yet be verified');
});
