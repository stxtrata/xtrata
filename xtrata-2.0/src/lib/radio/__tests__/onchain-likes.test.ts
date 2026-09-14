import {describe,it,expect} from 'vitest';
import {PostConditionMode,cvToJSON} from '@stacks/transactions';
import {buildLikeCall,importCandidates} from '../onchain-likes';
const address='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',contract=address+'.radio-likes';
const session={isConnected:true,address,network:'mainnet' as const};
describe('wallet-paid like requests',()=>{
 it('requests explicit states, no sponsorship and no asset transfers',()=>{
  const call=buildLikeCall(contract,[{id:12,liked:false}],session);
  expect(call.functionName).toBe('set-liked');expect(cvToJSON(call.functionArgs[1]).value).toBe(false);
  expect(call.sponsored).toBe(false);expect(call.postConditionMode).toBe(PostConditionMode.Deny);expect(call.postConditions).toEqual([]);expect(call).not.toHaveProperty('fee');
 });
 it('bounds imports and rejects duplicate IDs and wrong-network wallets',()=>{
  const changes=[{id:1,liked:true},{id:2,liked:true}];expect(buildLikeCall(contract,changes,session).functionName).toBe('set-likes');
  for(const c of [[],[changes[0],changes[0]],Array.from({length:26},(_,id)=>({id,liked:true}))])expect(()=>buildLikeCall(contract,c,session)).toThrow();
  expect(()=>buildLikeCall(contract,changes,{...session,network:'testnet'})).toThrow();
 });
 it('imports only saved, eligible songs that this wallet has not liked',()=>{
  expect(importCandidates([{tokenId:'1'},{tokenId:'1'},{tokenId:'2'},{tokenId:'999'}],new Set([1,2]),new Set([2]))).toEqual([1]);
  expect(importCandidates(null,new Set(),new Set())).toEqual([]);
 });
});
