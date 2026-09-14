// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { noneCV, PostConditionMode, responseErrorCV, uintCV } from '@stacks/transactions';
import CollectionInventoryPanel from '../CollectionInventoryPanel';
const mocked = vi.hoisted(() => ({ read:vi.fn(), write:vi.fn(), wallet:{ address:'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',network:'testnet' } }));
vi.mock('@stacks/transactions',async importOriginal => ({...await importOriginal<typeof import('@stacks/transactions')>(),callReadOnlyFunction:mocked.read}));
vi.mock('../../../lib/wallet/connect',()=>({showContractCall:mocked.write}));
vi.mock('../../ManageWalletContext',()=>({useManageWallet:()=>({walletSession:mocked.wallet})}));
beforeEach(()=>{
  mocked.read.mockReset().mockResolvedValue(noneCV()); mocked.write.mockReset(); mocked.wallet.network='testnet';
  vi.stubGlobal('fetch',vi.fn(async (url:string)=>Response.json(url.endsWith('/assets')
    ? [{expected_hash:'ab'.repeat(32),state:'draft'},{expected_hash:'ab'.repeat(32),state:'draft'}]
    : {contract_address:`${mocked.wallet.address}.collection`,metadata:{templateVersion:'xtrata-collection-mint-v1.5'}})));
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
describe('guided v1.5 inventory registration',()=>{
  it('deduplicates hashes and opens a zero-transfer wallet call only after an explicit click',async()=>{
    render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByText('Check inventory group'));
    await screen.findByText('Register 1 files');
    expect(mocked.write).not.toHaveBeenCalled();
    mocked.write.mockImplementation(options=>options.onFinish({txId:'local-simulation'}));
    fireEvent.click(screen.getByText('Register 1 files'));
    await waitFor(()=>expect(mocked.write).toHaveBeenCalledOnce());
    expect(mocked.write.mock.calls[0][0]).toMatchObject({functionName:'set-registered-token-uri-batch',postConditionMode:PostConditionMode.Deny,postConditions:[]});
    expect(mocked.write.mock.calls[0][0].functionArgs[0].list).toHaveLength(1);
    await screen.findByText(/Registration submitted: local-simulation/);
  });
  it('blocks mismatched networks before reading or signing',async()=>{
    mocked.wallet.network='mainnet'; render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByText('Check inventory group'));
    await screen.findByText(/correct network/);
    expect(mocked.read).not.toHaveBeenCalled(); expect(mocked.write).not.toHaveBeenCalled();
  });
  it('does not treat a failed inventory read as permission to register',async()=>{
    mocked.read.mockResolvedValue(responseErrorCV(uintCV(1)));
    render(<CollectionInventoryPanel collectionId="test"/>);
    fireEvent.click(await screen.findByText('Check inventory group'));
    await screen.findByText('Inventory verification failed.');
    expect((screen.getByText('Register files') as HTMLButtonElement).disabled).toBe(true);
  });
});
