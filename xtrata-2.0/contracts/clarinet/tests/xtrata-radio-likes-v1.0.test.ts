import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Cl} from '@stacks/transactions';
import {beforeEach,describe,it,expect} from 'vitest';
const a=simnet.getAccounts(),admin=a.get('deployer')!,alice=a.get('wallet_1')!,bob=a.get('wallet_2')!;
const name='radio-likes-test';
const call=(fn:string,args:any[],sender=alice)=>simnet.callPublicFn(name,fn,args,sender);
const read=(fn:string,args:any[])=>simnet.callReadOnlyFn(name,fn,args,alice).result;
let id:any;
function setup(clarityVersion:3|4){
 const source=readFileSync('../live/xtrata-radio-likes-v1.0.clar','utf8').replaceAll('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',admin);
 simnet.deployContract(name,source,{clarityVersion},admin);
 simnet.callPublicFn('xtrata-v3-2-3','set-paused',[Cl.bool(false)],admin);
 const data=Buffer.from('song'),hash=createHash('sha256').update(Buffer.concat([Buffer.alloc(32),data])).digest();
 expect(simnet.callPublicFn('xtrata-v3-2-3','begin-inscription',[Cl.buffer(hash),Cl.stringAscii('audio/mpeg'),Cl.uint(data.length),Cl.uint(1)],alice).result).toBeOk(Cl.bool(true));
 simnet.callPublicFn('xtrata-v3-2-3','add-chunk-batch',[Cl.buffer(hash),Cl.list([Cl.buffer(data)])],alice);
 id=(simnet.callPublicFn('xtrata-v3-2-3','seal-inscription',[Cl.buffer(hash),Cl.stringAscii('data:audio/mpeg,test')],alice).result as any).value;
}
describe.each([3,4] as const)('on-chain radio likes, Clarity %i',(clarityVersion)=>{
 beforeEach(()=>setup(clarityVersion));
 it('deduplicates, isolates wallets, removes likes and transfers no STX',()=>{
  const balance=simnet.getAssetsMap().get('STX')!.get(alice);
  expect(call('set-liked',[id,Cl.bool(true)]).result).toBeOk(Cl.bool(true));
  expect(call('set-liked',[id,Cl.bool(true)]).result).toBeOk(Cl.bool(false));
  expect(call('set-liked',[id,Cl.bool(true)],bob).result).toBeOk(Cl.bool(true));
  expect(read('get-total',[id])).toBeUint(2);
  expect(call('set-liked',[id,Cl.bool(false)]).result).toBeOk(Cl.bool(true));
  expect(call('set-liked',[id,Cl.bool(false)]).result).toBeOk(Cl.bool(false));
  expect(read('get-total',[id])).toBeUint(1);
  expect(read('get-liked',[id,Cl.standardPrincipal(bob)])).toBeBool(true);
  expect(simnet.getAssetsMap().get('STX')!.get(alice)).toBe(balance);
 });
 it('rolls back invalid batches, rejects empty batches and deduplicates imports',()=>{
  const item=(n:any)=>Cl.tuple({id:n,liked:Cl.bool(true)});
  expect(call('set-likes',[Cl.list([item(id),item(Cl.uint(999999))])]).result).toBeErr(Cl.uint(101));
  expect(read('get-total',[id])).toBeUint(0);
  expect(call('set-likes',[Cl.list([])]).result).toBeErr(Cl.uint(102));
  expect(call('set-likes',[Cl.list([item(id),item(id)])]).result).toBeOk(Cl.uint(1));
  expect(read('get-state',[Cl.list([id]),Cl.standardPrincipal(alice)])).toBeOk(Cl.list([Cl.tuple({id,liked:Cl.bool(true),total:Cl.uint(1)})]));
 });
 it('rejects proxy contracts acting as the originating wallet',()=>{
  simnet.deployContract('likes-proxy',`(define-public (forward (id uint)) (contract-call? .${name} set-liked id true))`,{clarityVersion:3},admin);
  expect(simnet.callPublicFn('likes-proxy','forward',[id],alice).result).toBeErr(Cl.uint(100));
 });
});
