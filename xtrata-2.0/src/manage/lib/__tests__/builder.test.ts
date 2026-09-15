import { describe, expect, it } from 'vitest';
import { getBuilderGates, getBuilderCompletion } from '../builder';
import type { JourneySignals } from '../journey';
const draft: JourneySignals = {walletConnected:true,hasActiveCollection:true,mintType:'standard',activeAssetCount:0,deployPricingLockPresent:false,deployReady:false,deployPending:false,launchMintPriceConfigured:false,launchMaxSupplyConfigured:false,hasLivePageCover:false,hasLivePageDescription:false,published:false,unpaused:null,uploadReadinessReason:null,deployReadinessReason:null};
describe('creator builder gates',()=>{
 it('requires staged and locked files before preparing a new contract',()=>{expect(getBuilderGates(draft).contract).toMatch(/Upload/);expect(getBuilderGates({...draft,activeAssetCount:10,deployPricingLockPresent:true}).contract).toBeNull();});
 it('requires confirmed deployment and mint rules before launch',()=>{expect(getBuilderGates(draft).rules).toMatch(/confirmed/);expect(getBuilderGates({...draft,deployReady:true}).launch).toMatch(/price/);expect(getBuilderGates({...draft,deployReady:true,launchMintPriceConfigured:true,launchMaxSupplyConfigured:true}).launch).toBeNull();});
 it('allows existing deployed collections to review their contract',()=>{expect(getBuilderGates({...draft,deployReady:true}).contract).toBeNull();});
 it('does not require staged artwork or standard supply for pre-inscribed collections',()=>{const s={...draft,mintType:'pre-inscribed' as const,deployReady:true,launchMintPriceConfigured:true};expect(getBuilderGates(s).launch).toBeNull();expect(getBuilderCompletion(s).artwork).toBe(true);});
 it('does not call a published but paused collection launched',()=>{expect(getBuilderCompletion({...draft,published:true,unpaused:false}).launch).toBe(false);});
});
