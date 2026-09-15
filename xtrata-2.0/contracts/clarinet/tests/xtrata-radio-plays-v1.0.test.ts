import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Cl} from '@stacks/transactions';
import {beforeEach,describe,it,expect} from 'vitest';
const a=simnet.getAccounts(),admin=a.get('deployer')!,alice=a.get('wallet_1')!,bob=a.get('wallet_2')!;
const name='radio-plays-test';
const call=(fn:string,args:any[],sender=alice)=>simnet.callPublicFn(name,fn,args,sender);
const read=(fn:string,args:any[])=>simnet.callReadOnlyFn(name,fn,args,alice).result;
let id:any;
function setup(clarityVersion:3|4){
 const source=readFileSync('../live/xtrata-radio-plays-v1.0.clar','utf8').replaceAll('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',admin);
 expect(simnet.deployContract(name,source,{clarityVersion},admin).result).toBeBool(true);
 simnet.callPublicFn('xtrata-v3-2-3','set-paused',[Cl.bool(false)],admin);
 const data=Buffer.from('song'),hash=createHash('sha256').update(Buffer.concat([Buffer.alloc(32),data])).digest();
 expect(simnet.callPublicFn('xtrata-v3-2-3','begin-inscription',[Cl.buffer(hash),Cl.stringAscii('audio/mpeg'),Cl.uint(data.length),Cl.uint(1)],alice).result).toBeOk(Cl.bool(true));
 simnet.callPublicFn('xtrata-v3-2-3','add-chunk-batch',[Cl.buffer(hash),Cl.list([Cl.buffer(data)])],alice);
 id=(simnet.callPublicFn('xtrata-v3-2-3','seal-inscription',[Cl.buffer(hash),Cl.stringAscii('data:audio/mpeg,test')],alice).result as any).value;
}

const receipt=(n=1)=>Cl.buffer(Buffer.alloc(16,n));
const args=(n=1,core=3,token=id)=>[Cl.uint(core),token,receipt(n)];
const balance=(who:string)=>simnet.getAssetsMap().get('STX')!.get(who) ?? 0n;
describe('paid radio starts, Clarity 4',()=>{
 beforeEach(()=>setup(4));
 it('atomically pays exactly 50 and counts once, records recipient and emits an audit event',()=>{
  const before=balance(bob),owner=balance(alice);
  const result=call('play',args(),bob);
  expect(result.result).toBeOk(Cl.tuple({recipient:Cl.standardPrincipal(alice),amount:Cl.uint(50),total:Cl.uint(1)}));
  expect(balance(bob)).toBe(before-50n);expect(balance(alice)).toBe(owner+50n);
  expect(read('get-total',[Cl.uint(3),id])).toBeUint(1);
  expect(read('get-receipt',[Cl.standardPrincipal(bob),receipt()])).toBeSome(Cl.tuple({core:Cl.uint(3),id,recipient:Cl.standardPrincipal(alice)}));
  expect(result.events.some(e=>e.event==='print_event')).toBe(true);
  expect(call('play',args(),bob).result).toBeErr(Cl.uint(103));
  expect(call('play',args(1,2),bob).result).toBeErr(Cl.uint(103));
  expect(balance(bob)).toBe(before-50n);
 });
 it('allows new receipts and scopes duplicate protection to payer',()=>{
  expect(call('play',args(),bob).result.type).toBe('ok');
  expect(call('play',args(2),bob).result.type).toBe('ok');
  expect(call('play',args(),admin).result.type).toBe('ok');
  expect(read('get-total',[Cl.uint(3),id])).toBeUint(3);
 });
 it('pays the current holder after a transfer',()=>{
  expect(simnet.callPublicFn('xtrata-v3-2-3','transfer',[id,Cl.standardPrincipal(alice),Cl.standardPrincipal(admin)],alice).result).toBeOk(Cl.bool(true));
  const before=balance(admin);expect(call('play',args(),bob).result).toBeOk(Cl.tuple({recipient:Cl.standardPrincipal(admin),amount:Cl.uint(50),total:Cl.uint(1)}));expect(balance(admin)).toBe(before+50n);
 });
 it('rejects invalid core, missing ID, short receipt and self-payment without recording',()=>{
  expect(call('play',args(1,4),bob).result).toBeErr(Cl.uint(101));
  expect(call('play',args(1,3,Cl.uint(999999)),bob).result).toBeErr(Cl.uint(104));
  expect(call('play',[Cl.uint(3),id,Cl.buffer(Buffer.alloc(15))],bob).result).toBeErr(Cl.uint(102));
  expect(call('play',args(),alice).result).toBeErr(Cl.uint(105));
  expect(read('get-total',[Cl.uint(3),id])).toBeUint(0);
  expect(read('get-receipt',[Cl.standardPrincipal(bob),receipt()])).toBeNone();
 });
 it.each([[1,'xtrata-v1-1-1'],[2,'xtrata-v2-1-0']] as const)('resolves legacy core %i explicitly', (selector,core)=>{
  simnet.callPublicFn(core,'set-paused',[Cl.bool(false)],admin);
  const data=Buffer.from('legacy'),hash=createHash('sha256').update(Buffer.concat([Buffer.alloc(32),data])).digest();
  expect(simnet.callPublicFn(core,'begin-inscription',[Cl.buffer(hash),Cl.stringAscii('audio/mpeg'),Cl.uint(data.length),Cl.uint(1)],alice).result).toBeOk(Cl.bool(true));
  simnet.callPublicFn(core,'add-chunk-batch',[Cl.buffer(hash),Cl.list([Cl.buffer(data)])],alice);
  const legacy=(simnet.callPublicFn(core,'seal-inscription',[Cl.buffer(hash),Cl.stringAscii('legacy-song')],alice).result as any).value;
  expect(call('play',args(1,selector,legacy),bob).result.type).toBe('ok');
  expect(read('get-total',[Cl.uint(selector),legacy])).toBeUint(1);
  expect(read('get-total',[Cl.uint(3),id])).toBeUint(0);
 });
 it('rejects proxy spending',()=>{
  simnet.deployContract('paid-proxy',`(define-public (forward (id uint)) (contract-call? .${name} play u3 id 0x01010101010101010101010101010101))`,{clarityVersion:4},admin);
  expect(simnet.callPublicFn('paid-proxy','forward',[id],bob).result).toBeErr(Cl.uint(100));
 });
 it('rejects custodians instead of paying an unresolved beneficiary',()=>{
  simnet.deployContract('custodian','(define-read-only (hello) true)',{clarityVersion:4},admin);
  simnet.callPublicFn('xtrata-v3-2-3','transfer',[id,Cl.standardPrincipal(alice),Cl.contractPrincipal(admin,'custodian')],alice);
  expect(call('play',args(),bob).result).toBeErr(Cl.uint(106));
 });
 it('rolls back receipt and count when transfer fails',()=>{
  const poor='ST000000000000000000002AMW42H';
  expect(call('play',args(),poor).result).toBeErr(Cl.uint(1));
  expect(read('get-total',[Cl.uint(3),id])).toBeUint(0);
  expect(read('get-receipt',[Cl.standardPrincipal(poor),receipt()])).toBeNone();
 });
});
