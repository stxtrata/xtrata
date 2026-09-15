import {beforeEach,expect,it,vi} from 'vitest';
import {catalogueChainTotals} from '../../lib/radio-chain-totals';
import {chainConfig,chainStates} from '../../lib/radio-chain-likes';
vi.mock('../../lib/radio-chain-likes',()=>({chainConfig:vi.fn(),chainStates:vi.fn()}));
beforeEach(()=>{vi.resetAllMocks();vi.mocked(chainConfig).mockResolvedValue({enabled:true,contract:'contract',network:'mainnet',batchLimit:25,platformFee:0});});
it('reports the global total even when the default listener has not liked the song',async()=>{
 vi.mocked(chainStates).mockResolvedValue([{id:2883,liked:false,total:'2'}]);
 const env={HIRO_API_KEY:'test-key'};const result=await catalogueChainTotals(env,[2883]);expect(chainStates).toHaveBeenCalledWith('contract',[2883],undefined,env);expect(result.status).toBe('ready');expect(result.totals.get(2883)).toBe('2');
});
it('retries a transient failure without dropping successful totals',async()=>{
 vi.mocked(chainStates).mockRejectedValueOnce(Error('rate limited')).mockResolvedValueOnce([{id:1,liked:false,total:'2'}]);
 const result=await catalogueChainTotals({} as any,[1]);expect(result.status).toBe('ready');expect(result.totals.get(1)).toBe('2');expect(chainStates).toHaveBeenCalledTimes(2);
});
it('preserves one batch when another fails and leaves unavailable entries distinct from zero',async()=>{
 vi.mocked(chainStates).mockImplementation(async(_c,ids)=>{if(ids[0]===25)throw Error('offline');return ids.map(id=>({id,liked:false,total:'2'}));});
 const result=await catalogueChainTotals({} as any,Array.from({length:26},(_,id)=>id));
 expect(result.status).toBe('partial');expect(result.totals.size).toBe(25);expect(result.totals.has(25)).toBe(false);expect(chainStates).toHaveBeenCalledTimes(3);
});
it('reports configuration failures and disabled environments explicitly',async()=>{
 vi.mocked(chainConfig).mockRejectedValue(Error('offline'));expect((await catalogueChainTotals({} as any,[1])).status).toBe('unavailable');
 vi.mocked(chainConfig).mockResolvedValue({enabled:false});expect((await catalogueChainTotals({} as any,[1])).status).toBe('disabled');expect(chainStates).not.toHaveBeenCalled();
});
