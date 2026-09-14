import { describe, expect, it, vi } from 'vitest';
import { boolCV, bufferCV, contractPrincipalCV, listCV, noneCV, responseOkCV, someCV, standardPrincipalCV, stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';
import { DEFAULT_CORE, makeChainReader, targetFor, verifySealedContent, type ChainReader } from '../collection-storage/chain';
import { digestJson, hashBytes, type Snapshot, type StoredObject } from '../collection-storage/common';

const OWNER = DEFAULT_CORE.split('.')[0];
const HELPER = `${OWNER}.collection-v1-5`;
const TARGET = { core: DEFAULT_CORE, helper: HELPER, network: 'mainnet' as const };
const BYTES = new TextEncoder().encode('verified chain data');
const HASH = hashBytes(BYTES);
const hashCv = bufferCV(Buffer.from(HASH, 'hex'));
const OBJECT: StoredObject = { storage_key: 'a/file', collection_id: 'a', content_hash: HASH, total_bytes: BYTES.length,
  total_chunks: 1, etag: 'etag', state: 'ready', recovery_key: null, ref_version: 0, created_at: 1, updated_at: 1 };
const SNAPSHOT: Snapshot = { assets: [], reservations: [], digest: digestJson({ assets: [], reservations: [] }), version: 0 };
function reader(overrides: Record<string, any> = {}) {
  const values: Record<string, any> = {
    'get-id-by-hash': someCV(uintCV(0)),
    'get-inscription-meta': someCV(tupleCV({ owner: standardPrincipalCV(OWNER), creator: standardPrincipalCV(OWNER),
      'mime-type': stringAsciiCV('text/plain'), 'total-size': uintCV(BYTES.length), 'total-chunks': uintCV(1),
      sealed: boolCV(true), 'final-hash': hashCv })),
    'get-chunk-batch': listCV([someCV(bufferCV(BYTES))]),
    'get-locked-core-contract': responseOkCV(contractPrincipalCV(OWNER, 'xtrata-v3-2-3')),
    'get-token-mint-context': someCV(tupleCV({ owner: standardPrincipalCV(OWNER), 'phase-id': uintCV(0), 'minted-at': uintCV(1) })),
    'get-hash-reservation': noneCV(), 'get-reservation': noneCV(), ...overrides
  };
  return { anchor: vi.fn(async () => ({ height: 100, hash: '0x' + 'a'.repeat(64), confirmations: 6 })),
    canonical: vi.fn(async () => {}), read: vi.fn(async (_contract, name) => values[name]) } as ChainReader;
}
describe('confirmed content evidence', () => {
  it('handles token zero, reconstructs bytes and checks the present reservation state', async () => {
    const rpc = reader();
    const proof = await verifySealedContent({}, TARGET, OBJECT, SNAPSHOT, rpc, 123);
    expect(proof).toMatchObject({ tokenId: '0', hash: HASH, collectionMint: true, verifiedAt: 123 });
    expect(rpc.read).toHaveBeenCalledWith(DEFAULT_CORE, 'get-chunk-batch', expect.any(Array), '0x' + 'a'.repeat(64));
    expect(rpc.read).toHaveBeenCalledWith(HELPER, 'get-hash-reservation', expect.any(Array), 'latest');
    expect(rpc.canonical).toHaveBeenCalledWith(100, '0x' + 'a'.repeat(64));
  });
  it('does not infer a collection sale from an external same-hash inscription', async () => {
    const proof = await verifySealedContent({}, TARGET, OBJECT, SNAPSHOT, reader({ 'get-token-mint-context': noneCV() }));
    expect(proof.collectionMint).toBe(false); expect(proof.mintOwner).toBeNull();
  });
  it.each([
    ['get-id-by-hash', noneCV(), 'no confirmed'],
    ['get-chunk-batch', listCV([noneCV()]), 'missing'],
    ['get-chunk-batch', listCV([someCV(bufferCV(new Uint8Array(BYTES.length)))]), 'hash mismatch'],
    ['get-hash-reservation', someCV(standardPrincipalCV(OWNER)), 'active hash'],
    ['get-locked-core-contract', responseOkCV(contractPrincipalCV(OWNER, 'xtrata-v2-1-0')), 'not pinned']
  ])('fails closed for %s', async (name, value, message) => {
    await expect(verifySealedContent({}, TARGET, OBJECT, SNAPSHOT, reader({ [name]: value }))).rejects.toThrow(message);
  });
  it('rejects a reorg after reconstructing the content', async () => {
    const rpc = reader(); rpc.canonical = vi.fn(async () => { throw new Error('reorganization'); });
    await expect(verifySealedContent({}, TARGET, OBJECT, SNAPSHOT, rpc)).rejects.toThrow('reorganization');
  });
  it('does not accept client cancellation while an on-chain reservation exists', async () => {
    const snapshot = { ...SNAPSHOT, reservations: [{ reservation_id: 'r', asset_id: 'a', collection_id: 'a', buyer_address: OWNER,
      hash_hex: HASH, status: 'cancelled', tx_id: null, expires_at: 0, updated_at: 0 }] };
    await expect(verifySealedContent({}, TARGET, OBJECT, snapshot, reader({ 'get-reservation': someCV(tupleCV({ 'phase-id': uintCV(0) })) })))
      .rejects.toThrow('on-chain reservation');
  });
  it('rejects wrong-network or unallowlisted targets', () => {
    expect(() => targetFor({}, { contract_address: HELPER, metadata: { coreContractId: `${OWNER}.unknown` } })).toThrow('allowlisted');
    expect(() => targetFor({}, { contract_address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.helper', metadata: { coreContractId: DEFAULT_CORE } })).toThrow('networks');
  });
  it('pins RPC reads to a confirmed canonical block and rejects insufficient confirmations', async () => {
    const fetcher = vi.fn(async (url: string) => Response.json(url.endsWith('/v2/info') ? { stacks_tip_height: 110 } :
      { canonical: true, height: 104, index_block_hash: '0x' + 'a'.repeat(64) }));
    expect(await makeChainReader({}, TARGET, fetcher as any).anchor()).toMatchObject({ height: 104, confirmations: 6 });
    await expect(makeChainReader({ COLLECTION_CLEANUP_CONFIRMATIONS: '0' }, TARGET, fetcher as any).anchor()).rejects.toThrow('safety configuration');
  });
  it('sends historical block IDs without the API response hex prefix', async () => {
    const fetcher = vi.fn(async () => Response.json({ okay: true, result: '0x09' }));
    await makeChainReader({}, TARGET, fetcher as any).read(DEFAULT_CORE, 'get-id-by-hash', [], '0x' + 'a'.repeat(64));
    expect(fetcher.mock.calls[0][0]).toContain('?tip=' + 'a'.repeat(64));
    expect(fetcher.mock.calls[0][0]).not.toContain('?tip=0x');
  });
});
