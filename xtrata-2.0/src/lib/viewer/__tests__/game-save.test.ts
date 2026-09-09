import { describe, it, expect, vi } from 'vitest';
import { cvToString } from '@stacks/transactions';
import { runGameSave, parseGameSave, GAME_SAVE_CONTRACT, GAME_SAVE_LIMIT } from '../game-save';
const address = 'SP1MDNJ5G13C9S3GN4V5AZPN7H68H4ZG9VKG251KM';
const json = JSON.stringify({
  format: 'meridian-save',
  version: 2,
  wallet: { address, network: 'mainnet' },
  save: {
    schema: 1,
    caseVersion: '1.3.5',
    commands: [],
    annotations: { version: 1, nextNumber: 1, notes: [] }
  }
});
const data = parseGameSave(json, address),
  txid = '0x' + 'a'.repeat(64);
function setup() {
  const meta = {
    sealed: true,
    creator: address,
    owner: address,
    mimeType: 'application/json',
    totalSize: BigInt(data.bytes.length),
    totalChunks: 1n,
    finalHash: data.hash
  };
  return {
    meta,
    p: {
      contract: {
        address: GAME_SAVE_CONTRACT.split('.')[0],
        contractName: 'xtrata-v3-2-3',
        network: 'mainnet' as const
      },
      session: { isConnected: true, address, network: 'mainnet' as const },
      label: 'Inscription #3040',
      guard: vi.fn(),
      review: vi.fn(async () => true),
      submit: vi.fn(async (_options: any) => ({ txId: txid })),
      client: {
        getIdByHash: vi.fn(async () => null as bigint | null),
        getInscriptionMeta: vi.fn(async (_id: bigint) => meta),
        getOwner: vi.fn(async (_id: bigint) => address as string|null),
        quoteSingleTxFee: vi.fn(async () => 11000n),
        isPaused: vi.fn(async () => false),
        getChunk: vi.fn(async () => data.bytes)
      }
    }
  };
}
const args = { json, address, network: 'mainnet' };
describe('in-game checkpoint publication', () => {
  it('constructs only the fixed native JSON mint with a game dependency and fee cap', async () => {
    const { p } = setup();
    const r = await runGameSave('xtrata_saveGame', args, p);
    expect(r).toMatchObject({ status: 'submitted', txid, hash: data.hashHex });
    const call = p.submit.mock.calls[0][0];
    expect(call.functionName).toBe('mint-single-tx-recursive');
    expect(call.contract.contractName).toBe('xtrata-v3-2-3');
    expect(cvToString(call.functionArgs[1])).toBe('"application/json"');
    expect(cvToString(call.functionArgs[5])).toBe('(list u3040)');
    expect(call.postConditions[0].amount).toBe(11000n);
    expect(p.review).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'save', protocolFee: '11000', json })
    );
    expect(p.client.quoteSingleTxFee).toHaveBeenCalledTimes(2);
  });
  it('rejects mismatched wallets, unsupported core, malformed JSON, UTF-8 oversize and arbitrary calls', async () => {
    const { p } = setup();
    expect(() => parseGameSave('{', address)).toThrow();
    expect(() =>
      parseGameSave(json.replace(address, 'SP000000000000000000002Q6VF78'), address)
    ).toThrow();
    expect(() => parseGameSave('中'.repeat(GAME_SAVE_LIMIT / 2), address)).toThrow();
    await expect(runGameSave('stx_callContract', args, p)).rejects.toThrow();
    await expect(
      runGameSave('xtrata_saveGame', { ...args, address: 'other' }, p)
    ).rejects.toThrow();
    p.contract.contractName = 'other';
    await expect(runGameSave('xtrata_saveGame', args, p)).rejects.toThrow();
    expect(p.submit).not.toHaveBeenCalled();
  });
  it('requires explicit review and stops when fees or wallet/preview context change', async () => {
    const { p } = setup();
    p.review.mockResolvedValue(false);
    await expect(runGameSave('xtrata_saveGame', args, p)).rejects.toMatchObject({ code: 4001 });
    expect(p.submit).not.toHaveBeenCalled();
    p.review.mockResolvedValue(true);
    p.client.quoteSingleTxFee.mockResolvedValueOnce(11000n).mockResolvedValueOnce(12000n);
    await expect(runGameSave('xtrata_saveGame', args, p)).rejects.toThrow(/fee changed/);
    expect(p.submit).not.toHaveBeenCalled();
    p.guard.mockImplementation(() => {
      throw Error('Wallet changed');
    });
    await expect(runGameSave('xtrata_saveGame', args, p)).rejects.toThrow(/Wallet changed/);
  });
  it('does not charge for an already confirmed identical checkpoint; checks creator authority', async () => {
    const { p, meta } = setup();
    p.client.getIdByHash.mockResolvedValue(99n);
    expect(await runGameSave('xtrata_saveGame', args, p)).toMatchObject({
      status: 'confirmed',
      tokenId: '99'
    });
    expect(p.submit).not.toHaveBeenCalled();
    meta.creator = 'other';
    await expect(runGameSave('xtrata_saveGame', args, p)).rejects.toThrow(/publishe/);
  });
  it('never converts a submitted transaction or missing hash to confirmed', async () => {
    const { p } = setup();
    expect(
      await runGameSave('xtrata_checkGameSave', { ...args, hash: data.hashHex }, p)
    ).toMatchObject({ status: 'unconfirmed' });
    p.submit.mockResolvedValue({} as any);
    await expect(runGameSave('xtrata_saveGame', args, p)).rejects.toThrow(/unknown/);
  });
  it('loads only sealed wallet-published saves and verifies exact content bytes', async () => {
    const { p, meta } = setup();
    expect(await runGameSave('xtrata_loadGameSave', { ...args, tokenId: '99' }, p)).toMatchObject({
      status: 'confirmed',
      json
    });
    p.client.getChunk.mockResolvedValue(new Uint8Array(data.bytes.length));
    await expect(runGameSave('xtrata_loadGameSave', { ...args, tokenId: '99' }, p)).rejects.toThrow(
      /integrity/
    );
    meta.sealed = false;
    await expect(runGameSave('xtrata_loadGameSave', { ...args, tokenId: '99' }, p)).rejects.toThrow(
      /confirmed/
    );
  });
});

describe('wallet checkpoint library',()=>{
  it('loads large owned manual backups in bounded batches without raising the publication limit',async()=>{
    const {p,meta}=setup();
    const large=JSON.stringify({...JSON.parse(json),save:{...JSON.parse(json).save,commands:Array.from({length:20000},()=>({type:'settings',motion:false}))}});
    expect(new TextEncoder().encode(large).length).toBeGreaterThan(GAME_SAVE_LIMIT);
    expect(()=>parseGameSave(large,address)).toThrow();
    const parsed=parseGameSave(large,address,false);
    Object.assign(meta,{totalSize:BigInt(parsed.bytes.length),totalChunks:BigInt(parsed.chunks.length),finalHash:parsed.hash});
    const getChunkBatch=vi.fn(async(_id:bigint,ids:bigint[])=>ids.map(i=>parsed.chunks[Number(i)]));
    expect(await runGameSave('xtrata_loadGameSave',{...args,tokenId:'99'},{...p,client:{...p.client,getChunkBatch}})).toMatchObject({json:large,owner:address});
    expect(getChunkBatch).toHaveBeenCalledTimes(Math.ceil(parsed.chunks.length/4));
    getChunkBatch.mockResolvedValue([]);
    await expect(runGameSave('xtrata_loadGameSave',{...args,tokenId:'99'},{...p,client:{...p.client,getChunkBatch}})).rejects.toThrow(/Incomplete/);
  });
  it('returns only owned, self-published checkpoints and paginates holdings',async()=>{
    const {p,meta}=setup();
    p.client.getInscriptionMeta.mockImplementation(async(id:any)=>({...meta,creator:id===98n?'other':address,mimeType:id===97n?'text/html':'application/json'}));
    p.client.getOwner.mockImplementation(async(id:any)=>id===96n?'other':address);
    const holdingsPage=vi.fn(async()=>({tokenIds:[99n,98n,97n,96n],total:11,sourceBase:'test'}));
    const result=await runGameSave('xtrata_listGameSaves',{...args,cursor:0},{...p,holdingsPage});
    expect(result).toMatchObject({status:'listed',address,nextCursor:1,saves:[{tokenId:'99',hash:data.hashHex}]});
    expect(p.submit).not.toHaveBeenCalled();expect(p.review).not.toHaveBeenCalled();
    await expect(runGameSave('xtrata_listGameSaves',{...args,cursor:-1},{...p,holdingsPage})).rejects.toThrow(/page/);
  });
  it('fails closed on transfer during loading, changed wallet, and unavailable history',async()=>{
    const {p}=setup();
    p.client.getOwner.mockResolvedValueOnce(address).mockResolvedValueOnce('other');
    await expect(runGameSave('xtrata_loadGameSave',{...args,tokenId:'99'},p)).rejects.toThrow(/owned/);
    await expect(runGameSave('xtrata_listGameSaves',args,{...p,holdingsPage:async()=>{throw Error('Service unavailable')}})).rejects.toThrow(/unavailable/);
    p.guard.mockImplementation(()=>{throw Error('Wallet changed')});
    await expect(runGameSave('xtrata_listGameSaves',args,p)).rejects.toThrow(/changed/);
  });
  it('does not turn a failed chain read into an empty list',async()=>{
    const {p}=setup();p.client.getInscriptionMeta.mockRejectedValue(Error('Network unavailable'));
    await expect(runGameSave('xtrata_listGameSaves',args,{...p,holdingsPage:async()=>({tokenIds:[99n],total:1,sourceBase:'test'})})).rejects.toThrow(/Network/);
  });
});

it('allows unlabeled manual fallback saves on load, but requires wallet labeling for publication', () => {
  const manual = JSON.stringify({ ...JSON.parse(json), wallet: null });
  expect(() => parseGameSave(manual, address)).toThrow();
  expect(parseGameSave(manual, address, false).json).toBe(manual);
});
