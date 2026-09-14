import {describe,it,expect,vi} from 'vitest';
import {createRadioOnchainState} from '../onchain-state';
const alice='SPalice',bob='SPbob';
function setup(){
 let address:string|undefined=alice,time=0,fail=false;const changed=vi.fn();
 const fetcher=vi.fn(async(input:any)=>{const u=new URL(input,'https://test');if(fail)throw Error('offline');const body=u.pathname==='/radio/counts'?{tracks:[{id:1,title:'Song'},{id:2,title:'Other'}]}:u.searchParams.has('ids')?{contract:'contract',rows:[{id:1,liked:u.searchParams.get('wallet')===alice},{id:2,liked:u.searchParams.get('wallet')===bob}]}:{enabled:true,contract:'contract'};return new Response(JSON.stringify(body));});
 const state=createRadioOnchainState({wallet:()=>({isConnected:!!address,address,network:'mainnet'}),fetcher,changed,now:()=>time});
 return {state,fetcher,setWallet:(a?:string)=>{address=a;},advance:()=>{time+=61000;},fail:()=>{fail=true;}};
}
describe('radio confirmed likes',()=>{
 it('loads only chain-approved songs and throttles repeated reads',async()=>{
  const s=setup();await s.state.refresh();expect(s.state.snapshot().likes.map(l=>l.tokenId)).toEqual(['1']);const calls=s.fetcher.mock.calls.length;await s.state.refresh();expect(s.fetcher).toHaveBeenCalledTimes(calls);
 });
 it('immediately hides the previous wallet on switch/disconnect',async()=>{
  const s=setup();await s.state.refresh();s.setWallet(bob);expect(s.state.snapshot().likes).toEqual([]);await s.state.refresh();expect(s.state.snapshot().likes.map(l=>l.tokenId)).toEqual(['2']);s.setWallet();expect(s.state.snapshot().likes).toEqual([]);await s.state.refresh();expect(s.state.snapshot().status).toBe('disconnected');
 });
 it('clears stale likes when reads fail rather than falling back to local favourites',async()=>{
  const s=setup();await s.state.refresh();s.fail();s.advance();await s.state.refresh();expect(s.state.snapshot()).toMatchObject({status:'unavailable',likes:[]});
 });
 it('discards an old wallet response arriving after the wallet changes',async()=>{
  let wallet=alice,release:()=>void=()=>{};const gate=new Promise<void>(r=>{release=r;});
  const state=createRadioOnchainState({wallet:()=>({isConnected:true,address:wallet,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks:[{id:1,title:'Song'}]}));if(u.searchParams.has('ids')){await gate;return new Response(JSON.stringify({contract:'contract',rows:[{id:1,liked:true}]}));}return new Response(JSON.stringify({enabled:true,contract:'contract'}));})});
  const loading=state.refresh();wallet=bob;release();await loading;expect(state.snapshot().likes).toEqual([]);
 });
});
