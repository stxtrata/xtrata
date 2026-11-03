import {describe,it,expect,vi} from 'vitest';
import {createRadioOnchainState} from '../onchain-state';
const alice='SPalice',bob='SPbob';
function setup(){
 let address:string|undefined=alice,time=0,fail=false,status=0,retryAfter='';const changed=vi.fn();
 const fetcher=vi.fn(async(input:any)=>{const u=new URL(input,'https://test');if(fail)throw Error('offline');if(status)return new Response('{}',{status,headers:retryAfter?{'retry-after':retryAfter}:{}});const body=u.pathname==='/radio/counts'?{tracks:[{id:1,title:'Song'},{id:2,title:'Other'}]}:u.searchParams.has('ids')?{contract:'contract',rows:[{id:1,liked:u.searchParams.get('wallet')===alice},{id:2,liked:u.searchParams.get('wallet')===bob}]}:{enabled:true,contract:'contract'};return new Response(JSON.stringify(body));});
 const state=createRadioOnchainState({wait:async()=>{},random:()=>0.5,wallet:()=>({isConnected:!!address,address,network:'mainnet'}),fetcher,changed,now:()=>time});
 return {state,fetcher,setWallet:(a?:string)=>{address=a;},advance:()=>{time+=61000;},fail:()=>{fail=true;},recover:()=>{fail=false;status=0;time+=15000;},http:(code:number,after='')=>{status=code;retryAfter=after;},heal:()=>{status=0;fail=false;},tick:(ms:number)=>{time+=ms;}};
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
  const state=createRadioOnchainState({wait:async()=>{},random:()=>0.5,wallet:()=>({isConnected:true,address:wallet,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks:[{id:1,title:'Song'}]}));if(u.searchParams.has('ids')){await gate;return new Response(JSON.stringify({contract:'contract',rows:[{id:1,liked:true}]}));}return new Response(JSON.stringify({enabled:true,contract:'contract'}));})});
  const loading=state.refresh();wallet=bob;release();await loading;expect(state.snapshot().likes).toEqual([]);
 });
});

it('retries a transient read and keeps every confirmed like',async()=>{
 let failed=false;const state=createRadioOnchainState({wait:async()=>{},random:()=>0.5,wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{
  const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks:[{id:1,title:'Song'}]}));
  if(u.searchParams.has('ids')){if(!failed){failed=true;throw Error('transient');}return new Response(JSON.stringify({contract:'c',rows:[{id:1,liked:true}]}));}
  return new Response(JSON.stringify({enabled:true,contract:'c'}));
 })});await state.refresh();expect(state.snapshot().status).toBe('ready');expect(state.snapshot().likes).toHaveLength(1);
});
it('preserves failed batches but removes successfully read unlikes',async()=>{
 let second=false;const tracks=Array.from({length:26},(_,id)=>({id,title:String(id)}));
 const state=createRadioOnchainState({wait:async()=>{},random:()=>0.5,wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},fetcher:vi.fn(async(input:any)=>{
  const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks}));
  if(u.searchParams.has('ids')){const ids=u.searchParams.get('ids')!.split(',').map(Number);if(second&&ids[0]===25)throw Error('offline');return new Response(JSON.stringify({contract:'c',rows:ids.map(id=>({id,liked:!second}))}));}
  return new Response(JSON.stringify({enabled:true,contract:'c'}));
 })});await state.refresh();expect(state.snapshot().likes).toHaveLength(26);second=true;await state.refresh(true);expect(state.snapshot().status).toBe('partial');expect(state.snapshot().likes.map(l=>l.tokenId)).toEqual(['25']);
});

it('uses already-loaded player metadata without adding unconfirmed favourites',async()=>{
 let title='#1';const state=createRadioOnchainState({wait:async()=>{},random:()=>0.5,wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},metadata:()=>({title,artist:'Artist'}),fetcher:vi.fn(async(input:any)=>{
  const u=new URL(input,'https://test');return new Response(JSON.stringify(u.pathname==='/radio/counts'?{tracks:[{id:1,title:'Inscription #1'}]}:u.searchParams.has('ids')?{contract:'c',rows:[{id:1,liked:true}]}:{enabled:true,contract:'c'}));
 })});await state.refresh();expect(state.snapshot().likes[0].title).toBe('Inscription #1');title='Real song name';expect(state.snapshot().likes[0]).toMatchObject({title:'Real song name',artist:'Artist'});expect(state.snapshot().likes).toHaveLength(1);
});

it('recovers an initial failed load once the backoff has passed, without reconnecting',async()=>{
 const s=setup();s.fail();await s.state.refresh();expect(s.state.snapshot().status).toBe('unavailable');
 s.heal();s.tick(31000);await s.state.refresh();expect(s.state.snapshot().status).toBe('ready');expect(s.state.snapshot().likes).toHaveLength(1);
 expect(s.fetcher.mock.calls.some(([url])=>String(url).includes('chainLikes=0'))).toBe(true);
});

describe('failure backoff',()=>{
 it('does not retry HTTP errors and stops hammering while backing off',async()=>{
  const s=setup();s.http(503);await s.state.refresh();expect(s.state.snapshot().status).toBe('unavailable');
  expect(s.fetcher).toHaveBeenCalledTimes(1);
  s.tick(15000);await s.state.refresh();await s.state.refresh(true);expect(s.fetcher).toHaveBeenCalledTimes(1);
 });
 it('retries a dropped connection once, quickly',async()=>{
  const s=setup();s.fail();await s.state.refresh();expect(s.fetcher).toHaveBeenCalledTimes(2);
 });
 it('widens the interval and reports paused with a retry time after repeated failures',async()=>{
  const s=setup();s.http(429);await s.state.refresh();
  const first=s.state.snapshot().retryAt!;expect(first).toBe(30000);
  s.tick(31000);await s.state.refresh();const second=s.state.snapshot();
  expect(second.status).toBe('paused');expect(second.retryAt!-31000).toBe(60000);
  s.tick(61000);await s.state.refresh();expect(s.state.snapshot().retryAt!-92000).toBe(120000);
 });
 it('honours a longer Retry-After from the server',async()=>{
  const s=setup();s.http(503,'90');await s.state.refresh();expect(s.state.snapshot().retryAt).toBe(90000);
  s.tick(60000);await s.state.refresh();expect(s.fetcher).toHaveBeenCalledTimes(1);
  s.tick(31000);await s.state.refresh();expect(s.fetcher).toHaveBeenCalledTimes(2);
 });
 it('lets focus events through only when nothing has failed, but always lets a manual refresh run',async()=>{
  const s=setup();await s.state.refresh();const calls=s.fetcher.mock.calls.length;
  await s.state.refresh(true);expect(s.fetcher.mock.calls.length).toBeGreaterThan(calls);
  s.http(503);s.tick(61000);await s.state.refresh();const failedCalls=s.fetcher.mock.calls.length;
  await s.state.refresh(true);expect(s.fetcher).toHaveBeenCalledTimes(failedCalls);
  s.heal();await s.state.refresh(true,true);expect(s.state.snapshot().status).toBe('ready');
 });
 it('keeps confirmed likes visible and the last good time while paused, then clears the pause on success',async()=>{
  const s=setup();await s.state.refresh();const checked=s.state.snapshot().checkedAt;expect(checked).toBe(0);
  s.http(503);s.tick(61000);await s.state.refresh();s.tick(31000);await s.state.refresh();
  expect(s.state.snapshot()).toMatchObject({status:'paused',checkedAt:0});expect(s.state.snapshot().likes.map(l=>l.tokenId)).toEqual(['1']);
  s.heal();s.tick(121000);await s.state.refresh();expect(s.state.snapshot()).toMatchObject({status:'ready'});expect(s.state.snapshot().retryAt).toBeUndefined();
 });
 it('stops requesting further batches once the server reports a failure and keeps their last confirmed likes',async()=>{
  const tracks=Array.from({length:60},(_,id)=>({id,title:String(id)}));let down=false,batches=0;
  const state=createRadioOnchainState({wait:async()=>{},random:()=>0.5,wallet:()=>({isConnected:true,address:alice,network:'mainnet'}),changed:()=>{},now:()=>0,fetcher:vi.fn(async(input:any)=>{
   const u=new URL(input,'https://test');if(u.pathname==='/radio/counts')return new Response(JSON.stringify({tracks}));
   if(u.searchParams.has('ids')){batches++;const ids=u.searchParams.get('ids')!.split(',').map(Number);if(down)return new Response('{}',{status:503});return new Response(JSON.stringify({contract:'c',rows:ids.map(id=>({id,liked:true}))}));}
   return new Response(JSON.stringify({enabled:true,contract:'c'}));
  })});
  await state.refresh();expect(state.snapshot().likes).toHaveLength(60);down=true;batches=0;await state.refresh(true,true);
  expect(batches).toBe(1);expect(state.snapshot().status).toBe('partial');expect(state.snapshot().likes).toHaveLength(60);
 });
});
