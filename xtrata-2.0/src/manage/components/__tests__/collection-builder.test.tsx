// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CollectionBuilder from '../CollectionBuilder';
afterEach(()=>{cleanup();localStorage.clear();});
const signals={walletConnected:true,hasActiveCollection:true,mintType:'standard' as const,activeAssetCount:10,deployPricingLockPresent:true,deployReady:true,deployPending:false,launchMintPriceConfigured:true,launchMaxSupplyConfigured:true,hasLivePageCover:true,hasLivePageDescription:true,published:false,unpaused:false,uploadReadinessReason:null,deployReadinessReason:null};
it('keeps form inputs when navigating and never invokes actions on navigation',()=>{
 const action=vi.fn();render(<CollectionBuilder collectionId="one" collectionName="Numbers" walletKey="test" signals={signals} loading={false} error={null} wallet={null} picker={null} deploy={() => <input aria-label="Collection name" defaultValue="" />} artwork={<input aria-label="Artwork note" />} inventory={null} rules={null} page={null} storage={null} onRefresh={action} onAdvanced={action} onCreate={action}/>);
 fireEvent.change(screen.getByLabelText('Collection name'),{target:{value:'Keep this draft'}});
 fireEvent.click(screen.getByRole('button',{name:/Artwork & metadata/}));
 fireEvent.change(screen.getByLabelText('Artwork note'),{target:{value:'Keep this too'}});
 fireEvent.click(screen.getByRole('button',{name:/Collection basics/}));
 expect((screen.getByLabelText('Collection name') as HTMLInputElement).value).toBe('Keep this draft');
 fireEvent.click(screen.getByRole('button',{name:/Artwork & metadata/}));
 expect((screen.getByLabelText('Artwork note') as HTMLInputElement).value).toBe('Keep this too');expect(action).not.toHaveBeenCalled();
});
