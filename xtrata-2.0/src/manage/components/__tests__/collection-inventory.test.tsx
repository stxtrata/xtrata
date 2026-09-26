// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { contractPrincipalCV, noneCV, PostConditionMode, responseErrorCV, responseOkCV, someCV, stringAsciiCV, uintCV } from '@stacks/transactions';
import CollectionInventoryPanel from '../CollectionInventoryPanel';
const mocked = vi.hoisted(() => ({ read:vi.fn(), uri:null as any, idByHash:null as any, context:null as any, write:vi.fn(), patches:[] as unknown[], collection:{} as Record<string, unknown>,
  wallet:{ address:'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',network:'testnet' } }));
vi.mock('@stacks/transactions',async importOriginal => ({...await importOriginal<typeof import('@stacks/transactions')>(),callReadOnlyFunction:mocked.read}));
vi.mock('../../../lib/wallet/connect',()=>({showContractCall:mocked.write}));
vi.mock('../../ManageWalletContext',()=>({useManageWallet:()=>({walletSession:mocked.wallet})}));
beforeEach(()=>{
  mocked.uri=noneCV(); mocked.idByHash=noneCV(); mocked.context=noneCV();
  mocked.read.mockReset().mockImplementation(async ({functionName}:{functionName:string})=>{
    if (functionName==='get-locked-core-contract') return responseOkCV(contractPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM','xtrata-v3-2-3'));
    if (functionName==='get-id-by-hash') return mocked.idByHash;
    if (functionName==='get-token-mint-context') return mocked.context;
    return mocked.uri;
  }); mocked.write.mockReset(); mocked.wallet.network='testnet'; mocked.patches=[];
  mocked.collection={id:'test',contract_address:`${mocked.wallet.address}.collection`,metadata:{templateVersion:'xtrata-collection-mint-v1.6'}};
  vi.stubGlobal('fetch',vi.fn(async (url:string, init?:RequestInit)=>{
    if (init?.method==='PATCH') { mocked.patches.push(JSON.parse(String(init.body))); return Response.json({}); }
    return Response.json(url.endsWith('/assets')
      ? [{expected_hash:'ab'.repeat(32),state:'draft'},{expected_hash:'ab'.repeat(32),state:'draft'}]
      : mocked.collection);
  }));
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
describe('guided v1.5/v1.6 inventory registration',()=>{
  it('deduplicates hashes and opens a zero-transfer wallet call only after an explicit click',async()=>{
    render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText('Register 1 files');
    expect(mocked.write).not.toHaveBeenCalled();
    mocked.write.mockImplementation(options=>options.onFinish({txId:'local-simulation'}));
    fireEvent.click(screen.getByText('Register 1 files'));
    await waitFor(()=>expect(mocked.write).toHaveBeenCalledOnce());
    expect(mocked.write.mock.calls[0][0]).toMatchObject({functionName:'set-registered-token-uri-batch',postConditionMode:PostConditionMode.Deny,postConditions:[]});
    expect(mocked.write.mock.calls[0][0].functionArgs[0].list).toHaveLength(1);
    await screen.findByText(/Registration submitted: local-simulation/);
  });
  it('resolves the contract when the deploy step stored a bare address plus metadata.contractName',async()=>{
    mocked.collection={id:'test',contract_address:mocked.wallet.address,metadata:{templateVersion:'xtrata-collection-mint-v1.6',contractName:'xtrata-collection-numbers-abcd1234'}};
    render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText('Register 1 files');
    expect(mocked.read.mock.calls.find(c=>c[0].functionName==='get-registered-token-uri')![0]).toMatchObject({contractAddress:mocked.wallet.address,contractName:'xtrata-collection-numbers-abcd1234'});
  });
  it('explains registration is pending when the contract is not deployed yet',async()=>{
    mocked.collection={id:'test',contract_address:null,metadata:{templateVersion:'xtrata-collection-mint-v1.6'}};
    render(<CollectionInventoryPanel collectionId="test"/>);
    await screen.findByText(/unlocks once the deployment above confirms/);
    expect(mocked.read).not.toHaveBeenCalled();
  });
  it('records a verified pass so launch can be gated on it',async()=>{
    mocked.uri=someCV(stringAsciiCV('data:text/plain,x'));
    const onVerified=vi.fn();
    render(<CollectionInventoryPanel collectionId="test" onVerified={onVerified}/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText(/All 1 files are registered/);
    expect(onVerified).toHaveBeenCalledOnce();
    expect(mocked.patches[0]).toMatchObject({metadata:{inventoryRegistration:{version:1,hashCount:1,contractId:`${mocked.wallet.address}.collection`}}});
  });
  it('blocks mismatched networks before reading or signing',async()=>{
    mocked.wallet.network='mainnet'; render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText(/on testnet to check registration/);
    expect(mocked.read).not.toHaveBeenCalled(); expect(mocked.write).not.toHaveBeenCalled();
  });
  it('does not treat a failed inventory read as permission to register',async()=>{
    mocked.uri=responseErrorCV(uintCV(1));
    render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText(/Could not read registration from the contract/);
    expect((screen.getByRole('button',{name:'Register files'}) as HTMLButtonElement).disabled).toBe(true);
    expect(mocked.patches).toHaveLength(0);
  });
  it('blocks verification when a file was inscribed outside this collection, but not for files it minted', async()=>{
    mocked.uri=someCV(stringAsciiCV('data:text/plain,x')); mocked.idByHash=someCV(uintCV(7));
    const { unmount } = render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText(/already been inscribed on Xtrata outside this collection/);
    expect(mocked.patches).toHaveLength(0);
    unmount();
    mocked.context=someCV(stringAsciiCV('minted-here'));
    render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Check registration'}));
    await screen.findByText(/All 1 files are registered/);
  });
});
