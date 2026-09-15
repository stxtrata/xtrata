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
 it('retains the same wallet’s confirmed likes and marks a failed refresh unavailable',async()=>{
  const s=setup();await s.state.refresh();s.fail();s.advance();await s.state.refresh();expect(s.state.snapshot().status).toBe('unavailable');expect(s.state.snapshot().likes.map(l=>l.tokenId)).toEqual(['1']);
 });
 it('discards an old wallet response arriving after the wallet changes',async()=>{
  let wallet=alice,release:()=>void=()=>{};const gate=new Promise<void>(r=>{release=r;});
  const state=createRadioOnchainState({wallet:()=>({isConnected:true,address:wallet,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks:[{id:1,title:'Song'}]}));if(u.searchParams.has('ids')){await gate;return new Response(JSON.stringify({contract:'contract',rows:[{id:1,liked:true}]}));}return new Response(JSON.stringify({enabled:true,contract:'contract'}));})});
  const loading=state.refresh();wallet=bob;release();await loading;expect(state.snapshot().likes).toEqual([]);
 });
});

it('retries a transient read and keeps every confirmed like',async()=>{
 let failed=false;const state=createRadioOnchainState({wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{
  const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks:[{id:1,title:'Song'}]}));
  if(u.searchParams.has('ids')){if(!failed){failed=true;throw Error('transient');}return new Response(JSON.stringify({contract:'c',rows:[{id:1,liked:true}]}));}
  return new Response(JSON.stringify({enabled:true,contract:'c'}));
 })});await state.refresh();expect(state.snapshot().status).toBe('ready');expect(state.snapshot().likes).toHaveLength(1);
});
it('preserves failed batches but removes successfully read unlikes',async()=>{
 let second=false;const tracks=Array.from({length:26},(_,id)=>({id,title:String(id)}));
 const state=createRadioOnchainState({wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{
  const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks}));
  if(u.searchParams.has('ids')){const ids=u.searchParams.get('ids')!.split(',').map(Number);if(second&&ids[0]===25)throw Error('offline');return new Response(JSON.stringify({contract:'c',rows:ids.map(id=>({id,liked:!second}))}));}
  return new Response(JSON.stringify({enabled:true,contract:'c'}));
 })});await state.refresh();expect(state.snapshot().likes).toHaveLength(26);second=true;await state.refresh(true);expect(state.snapshot().status).toBe('partial');expect(state.snapshot().likes.map(l=>l.tokenId)).toEqual(['25']);
});

it('uses already-loaded player metadata without adding unconfirmed favourites',async()=>{
 let title='#1';const state=createRadioOnchainState({wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},metadata:()=>({title,artist:'Artist'}),fetcher:vi.fn(async(input:any)=>{
  const u=new URL(input,'https://test');return new Response(JSON.stringify(u.pathname==='/radio/counts'?{tracks:[{id:1,title:'Inscription #1'}]}:u.searchParams.has('ids')?{contract:'c',rows:[{id:1,liked:true}]}:{enabled:true,contract:'c'}));
 })});await state.refresh();expect(state.snapshot().likes[0].title).toBe('Inscription #1');title='Real song name';expect(state.snapshot().likes[0]).toMatchObject({title:'Real song name',artist:'Artist'});expect(state.snapshot().likes).toHaveLength(1);
});
