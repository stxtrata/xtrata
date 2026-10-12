import {afterEach,describe,it,expect,vi} from 'vitest';
import {Cl,serializeCV} from '@stacks/transactions';
import {onRequest} from '../chain-likes';
import {chainTransaction,chainStates,chainConfig,resetChainReadState} from '../../lib/radio-chain-likes';
const address='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',contract=address+'.radio-likes';
const encoded=(cv:any)=>'0x'+Array.from(serializeCV(cv)).map(b=>b.toString(16).padStart(2,'0')).join('');
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();vi.useRealTimers();resetChainReadState();});
describe('confirmed on-chain reads',()=>{
 it('stays disabled without deployment configuration, with no network calls',async()=>{
  const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);
  const r=await onRequest({request:new Request('https://test/radio/chain-likes'),env:{}});expect(await r.json()).toEqual({enabled:false});expect(fetcher).not.toHaveBeenCalled();
 });
 it('verifies deployment config and returns chain totals separately from browser data',async()=>{
  const fetcher=vi.fn(async(url:string,init:RequestInit)=>{expect(new Headers(init.headers).get('x-hiro-api-key')).toBe('test-key');return new Response(JSON.stringify({okay:true,result:encoded(url.endsWith('get-config')?Cl.ok(Cl.tuple({version:Cl.uint(1),core:Cl.contractPrincipal(address,'xtrata-v3-2-3'),'batch-limit':Cl.uint(25),'platform-fee':Cl.uint(0)})):Cl.ok(Cl.list([Cl.tuple({id:Cl.uint(1),liked:Cl.bool(true),total:Cl.uint(4)})])))}));});vi.stubGlobal('fetch',fetcher);
  const r=await onRequest({request:new Request('https://test/radio/chain-likes?ids=1&wallet='+address),env:{RADIO_LIKES_CONTRACT:contract,HIRO_API_KEY:'test-key'}});expect(r.status).toBe(200);expect((await r.json()).rows).toEqual([{id:1,liked:true,total:'4'}]);
  expect(fetcher).toHaveBeenCalledTimes(2);
  await expect(chainStates(contract,Array(26).fill(1),address)).rejects.toThrow();
 });
 it('never labels unanchored, unrelated or failed transactions as confirmed',async()=>{
  let tx:any={sender_address:address,contract_call:{contract_id:contract,function_name:'set-liked'},tx_status:'success',is_unanchored:true};
  vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify(tx))));const id='0x'+'a'.repeat(64);
  expect(await chainTransaction(contract,id,address)).toEqual({status:'pending'});
  tx.is_unanchored=false;tx.canonical=true;tx.block_height=123;expect(await chainTransaction(contract,id,address)).toEqual({status:'confirmed'});
  tx.tx_status='abort_by_response';expect(await chainTransaction(contract,id,address)).toEqual({status:'failed'});
  tx.contract_call.contract_id=address+'.other';await expect(chainTransaction(contract,id,address)).rejects.toThrow();
 });
});

it('rotates rejected credentials within the read budget without logging secrets or wallet data',async()=>{
 const warn=vi.spyOn(console,'warn').mockImplementation(()=>{});
 const fetcher=vi.fn().mockResolvedValueOnce(new Response('',{status:429})).mockResolvedValueOnce(new Response(JSON.stringify({okay:true,result:encoded(Cl.ok(Cl.list([Cl.tuple({id:Cl.uint(1),liked:Cl.bool(false),total:Cl.uint(2)})])))})));
 vi.stubGlobal('fetch',fetcher);
 expect(await chainStates(contract,[1],address,{HIRO_API_KEYS:'secret-one,secret-two'})).toEqual([{id:1,liked:false,total:'2'}]);
 expect(new Headers(fetcher.mock.calls[0][1].headers).get('x-hiro-api-key')).toBe('secret-one');
 expect(new Headers(fetcher.mock.calls[1][1].headers).get('x-hiro-api-key')).toBe('secret-two');
 expect(fetcher.mock.calls[0][1].signal).toBe(fetcher.mock.calls[1][1].signal);
 const logs=JSON.stringify(warn.mock.calls);expect(logs).toContain('429');expect(logs).not.toContain('secret-');expect(logs).not.toContain(address);
});
it('passes server credentials to transaction confirmation reads and stops on server failure',async()=>{
 const warn=vi.spyOn(console,'warn').mockImplementation(()=>{});
 const fetcher=vi.fn().mockResolvedValue(new Response('',{status:503}));vi.stubGlobal('fetch',fetcher);
 await expect(chainTransaction(contract,'0x'+'b'.repeat(64),address,{HIRO_API_KEYS:'key-one,key-two'})).rejects.toThrow('Transaction lookup unavailable');
 expect(fetcher).toHaveBeenCalledTimes(1);expect(new Headers(fetcher.mock.calls[0][1].headers).get('x-hiro-api-key')).toBe('key-one');expect(warn).toHaveBeenCalled();
});

const configResult=()=>encoded(Cl.ok(Cl.tuple({version:Cl.uint(1),core:Cl.contractPrincipal(address,'xtrata-v3-2-3'),'batch-limit':Cl.uint(25),'platform-fee':Cl.uint(0)})));
const okBody=(result:string)=>new Response(JSON.stringify({okay:true,result}));
const keyOf=(call:any[])=>new Headers(call[1].headers).get('x-hiro-api-key');
describe('Hiro throttling resilience',()=>{
 it('tries every configured key, not just the first two, when keys are rate limited',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  const fetcher=vi.fn().mockResolvedValueOnce(new Response('',{status:429})).mockResolvedValueOnce(new Response('',{status:429})).mockResolvedValueOnce(okBody(configResult()));
  vi.stubGlobal('fetch',fetcher);
  expect(await chainConfig({RADIO_LIKES_CONTRACT:contract,HIRO_API_KEY_1:'k1',HIRO_API_KEY_2:'k2',HIRO_API_KEY_3:'k3'})).toMatchObject({enabled:true,contract});
  expect(fetcher.mock.calls.map(keyOf)).toEqual(['k1','k2','k3']);
 });
 it('sends later requests to keys that are not cooling down',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  const env={HIRO_API_KEYS:'k1,k2,k3'};
  const state=(id:number)=>okBody(encoded(Cl.ok(Cl.list([Cl.tuple({id:Cl.uint(id),liked:Cl.bool(false),total:Cl.uint(0)})]))));
  const fetcher=vi.fn().mockResolvedValueOnce(new Response('',{status:429})).mockResolvedValueOnce(state(1)).mockResolvedValueOnce(state(2));
  vi.stubGlobal('fetch',fetcher);
  await chainStates(contract,[1],address,env);await chainStates(contract,[2],address,env);
  expect(fetcher.mock.calls.map(keyOf)).toEqual(['k1','k2','k2']);
 });
 it('still tries cooling keys as a last resort and reports a retry hint when all are throttled',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  const fetcher=vi.fn(async()=>new Response('',{status:429,headers:{'retry-after':'45'}}));vi.stubGlobal('fetch',fetcher);
  const env={RADIO_LIKES_CONTRACT:contract,HIRO_API_KEYS:'k1,k2'};
  await expect(chainConfig(env)).rejects.toMatchObject({name:'ChainReadUnavailable',retryAfter:45});
  fetcher.mockClear();await expect(chainConfig(env)).rejects.toThrow();expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('retries one transient Hiro server error on a state read, but not a second',async()=>{
  vi.useFakeTimers();vi.spyOn(console,'warn').mockImplementation(()=>{});
  const fetcher=vi.fn().mockResolvedValueOnce(new Response('',{status:503})).mockResolvedValueOnce(okBody(encoded(Cl.ok(Cl.list([Cl.tuple({id:Cl.uint(1),liked:Cl.bool(true),total:Cl.uint(1)})])))));
  vi.stubGlobal('fetch',fetcher);
  const pending=chainStates(contract,[1],address,{HIRO_API_KEY:'k1'});await vi.advanceTimersByTimeAsync(400);
  expect(await pending).toEqual([{id:1,liked:true,total:'1'}]);expect(fetcher).toHaveBeenCalledTimes(2);
  fetcher.mockReset().mockResolvedValue(new Response('',{status:502}));
  const failing=chainStates(contract,[1],address,{HIRO_API_KEY:'k1'});const assertion=expect(failing).rejects.toThrow();await vi.advanceTimersByTimeAsync(400);await assertion;expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('caches the verified contract config and serves it when Hiro is unavailable',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  const fetcher=vi.fn().mockResolvedValueOnce(okBody(configResult()));vi.stubGlobal('fetch',fetcher);
  const env={RADIO_LIKES_CONTRACT:contract,HIRO_API_KEY:'k1'};
  await chainConfig(env);await chainConfig(env);expect(fetcher).toHaveBeenCalledTimes(1);
  vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(Date.now()+2*3600000);
  fetcher.mockResolvedValue(new Response('',{status:429}));
  expect(await chainConfig(env)).toMatchObject({enabled:true,contract});
 });
 it('never serves a cached config for an unexpected on-chain configuration',async()=>{
  const bad=encoded(Cl.ok(Cl.tuple({version:Cl.uint(2),core:Cl.contractPrincipal(address,'xtrata-v3-2-3'),'batch-limit':Cl.uint(25),'platform-fee':Cl.uint(0)})));
  vi.stubGlobal('fetch',vi.fn(async()=>okBody(bad)));
  await expect(chainConfig({RADIO_LIKES_CONTRACT:contract})).rejects.toThrow('Unexpected likes contract configuration');
 });
 it('tells clients when to retry and never logs credentials on a 503',async()=>{
  const warn=vi.spyOn(console,'warn').mockImplementation(()=>{});
  vi.stubGlobal('fetch',vi.fn(async()=>new Response('',{status:429})));
  const r=await onRequest({request:new Request('https://test/radio/chain-likes'),env:{RADIO_LIKES_CONTRACT:contract,HIRO_API_KEYS:'secret-a,secret-b'}});
  expect(r.status).toBe(503);expect(r.headers.get('retry-after')).toBe('30');
  const body=await r.json();expect(body).toMatchObject({code:'upstream_unavailable',retryAfter:30});expect(body.error).toContain('No transaction has been requested');
  expect(JSON.stringify(warn.mock.calls)).not.toContain('secret-');
 });
});
