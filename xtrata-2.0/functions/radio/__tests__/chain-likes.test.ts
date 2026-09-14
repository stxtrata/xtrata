import {afterEach,describe,it,expect,vi} from 'vitest';
import {Cl,serializeCV} from '@stacks/transactions';
import {onRequest} from '../chain-likes';
import {chainTransaction,chainStates} from '../../lib/radio-chain-likes';
const address='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',contract=address+'.radio-likes';
const encoded=(cv:any)=>'0x'+Array.from(serializeCV(cv)).map(b=>b.toString(16).padStart(2,'0')).join('');
afterEach(()=>vi.unstubAllGlobals());
describe('confirmed on-chain reads',()=>{
 it('stays disabled without deployment configuration, with no network calls',async()=>{
  const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);
  const r=await onRequest({request:new Request('https://test/radio/chain-likes'),env:{}});expect(await r.json()).toEqual({enabled:false});expect(fetcher).not.toHaveBeenCalled();
 });
 it('verifies deployment config and returns chain totals separately from browser data',async()=>{
  vi.stubGlobal('fetch',vi.fn(async(url:string)=>new Response(JSON.stringify({okay:true,result:encoded(url.endsWith('get-config')?Cl.ok(Cl.tuple({version:Cl.uint(1),core:Cl.contractPrincipal(address,'xtrata-v3-2-3'),'batch-limit':Cl.uint(25),'platform-fee':Cl.uint(0)})):Cl.ok(Cl.list([Cl.tuple({id:Cl.uint(1),liked:Cl.bool(true),total:Cl.uint(4)})])))}))));
  const r=await onRequest({request:new Request('https://test/radio/chain-likes?ids=1&wallet='+address),env:{RADIO_LIKES_CONTRACT:contract}});expect(r.status).toBe(200);expect((await r.json()).rows).toEqual([{id:1,liked:true,total:'4'}]);
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
