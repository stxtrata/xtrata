import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Cl} from '@stacks/transactions';
import {beforeEach,describe,it,expect} from 'vitest';
const a=simnet.getAccounts(),admin=a.get('deployer')!,alice=a.get('wallet_1')!,bob=a.get('wallet_2')!,carol=a.get('wallet_3')!;
const name='radio-plays-v2-test';
const call=(fn:string,args:any[],sender=bob)=>simnet.callPublicFn(name,fn,args,sender);
const read=(fn:string,args:any[])=>simnet.callReadOnlyFn(name,fn,args,alice).result;
const balance=(who:string)=>simnet.getAssetsMap().get('STX')!.get(who) ?? 0n;
let n=0;
function mint(core:string,owner:string){
 const data=Buffer.from('song '+(++n)),hash=createHash('sha256').update(Buffer.concat([Buffer.alloc(32),data])).digest();
 expect(simnet.callPublicFn(core,'begin-inscription',[Cl.buffer(hash),Cl.stringAscii('audio/mpeg'),Cl.uint(data.length),Cl.uint(1)],owner).result).toBeOk(Cl.bool(true));
 simnet.callPublicFn(core,'add-chunk-batch',[Cl.buffer(hash),Cl.list([Cl.buffer(data)])],owner);
 return Number((simnet.callPublicFn(core,'seal-inscription',[Cl.buffer(hash),Cl.stringAscii('data:audio/mpeg,'+n)],owner).result as any).value.value);
}
let s1=0,s2=0; // s1 is alice's song, s2 is carol's
function setup(clarityVersion:3|4){
 const source=readFileSync('../drafts/xtrata-radio-plays-v2.0.clar','utf8').replaceAll('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',admin);
 expect(simnet.deployContract(name,source,{clarityVersion},admin).result).toBeBool(true);
 simnet.callPublicFn('xtrata-v3-2-3','set-paused',[Cl.bool(false)],admin);
 s1=mint('xtrata-v3-2-3',alice);s2=mint('xtrata-v3-2-3',carol);
}
type Play=[id:number,core?:number];
const receipt=(k:number)=>Buffer.alloc(16,k);
/** The written-out call. */
const settle=(plays:Play[],k:number,rate:number,sender=bob)=>call('settle',[Cl.list(plays.map(([id,core=3])=>Cl.tuple({core:Cl.uint(core),id:Cl.uint(id)}))),Cl.buffer(receipt(k)),Cl.uint(rate)],sender);
/** The packed call: rate (2) + receipt (16) + core (1) and id (4) per play. */
const pack=(plays:Play[],k:number,rate:number)=>Buffer.concat([Buffer.from([rate>>8,rate&255]),receipt(k),...plays.map(([id,core=3])=>{const b=Buffer.alloc(5);b[0]=core;b.writeUInt32BE(id,1);return b;})]);
const packed=(plays:Play[],k:number,rate:number,sender=bob)=>call('settle-packed',[Cl.buffer(pack(plays,k,rate))],sender);
const settings=(rate:number,batch:number,sender=admin)=>call('set-settings',[Cl.uint(rate),Cl.uint(batch)],sender);
const sum=(paid:number,skipped:number,amount:number)=>Cl.tuple({paid:Cl.uint(paid),skipped:Cl.uint(skipped),amount:Cl.uint(amount)});
const kept=(plays:number,paid:number,skipped:number,amount:number,rate:number)=>Cl.some(Cl.tuple({plays:Cl.uint(plays),paid:Cl.uint(paid),skipped:Cl.uint(skipped),amount:Cl.uint(amount),rate:Cl.uint(rate)}));
const prints=(r:any,event:string)=>r.events.filter((e:any)=>e.event==='print_event'&&JSON.stringify(e.data).includes(event)).length;
const total=(id:number,core=3)=>read('get-total',[Cl.uint(core),Cl.uint(id)]);
const earned=(id:number,core=3)=>read('get-earned',[Cl.uint(core),Cl.uint(id)]);

describe.each([3,4] as const)('paid plays v2, Clarity %i',(version)=>{
 beforeEach(()=>setup(version));

 it('starts exactly as version 1: 50 a play, one play per transaction',()=>{
  const before=balance(bob),owner=balance(alice);
  const r=settle([[s1]],1,50);
  expect(r.result).toBeOk(sum(1,0,50));
  expect(balance(bob)).toBe(before-50n);expect(balance(alice)).toBe(owner+50n);
  expect(total(s1)).toBeUint(1);expect(earned(s1)).toBeUint(50);
  expect(read('get-receipt',[Cl.standardPrincipal(bob),Cl.buffer(receipt(1))])).toEqual(kept(1,1,0,50,50));
  expect(prints(r,'radio-paid-play')).toBe(1);
  expect(settle([[s1],[s1]],2,50).result).toBeErr(Cl.uint(108)); // two plays while the setting is one
  expect(packed([[s1],[s1]],2,50).result).toBeErr(Cl.uint(108));
  expect(balance(bob)).toBe(before-50n);
 });

 it('the owner switches to five plays a transaction at 300 each: one transaction pays every holder',()=>{
  expect(settings(300,5).result).toBeOk(Cl.tuple({rate:Cl.uint(300),batch:Cl.uint(5)}));
  const b=balance(bob),al=balance(alice),ca=balance(carol);
  const r=settle([[s1],[s2],[s1],[s2],[s1]],1,300);
  expect(r.result).toBeOk(sum(5,0,1500));
  expect(balance(bob)).toBe(b-1500n);expect(balance(alice)).toBe(al+900n);expect(balance(carol)).toBe(ca+600n);
  expect(total(s1)).toBeUint(3);expect(total(s2)).toBeUint(2);
  expect(earned(s1)).toBeUint(900);expect(earned(s2)).toBeUint(600);
  expect(prints(r,'radio-paid-play')).toBe(5);
  expect(settle([[s1]],2,300).result).toBeOk(sum(1,0,300));               // fewer than five is fine: a listener who stops early still pays
  expect(settle(Array.from({length:6},()=>[s1] as Play),3,300).result).toBeErr(Cl.uint(108)); // six is over the setting
  expect(settle([],3,300).result).toBeErr(Cl.uint(108));
 });

 it('the packed call does exactly what the written-out one does',()=>{
  settings(300,5);
  const b=balance(bob),al=balance(alice),ca=balance(carol);
  const r=packed([[s1],[s2],[s1],[s2],[s1]],1,300);
  expect(r.result).toBeOk(sum(5,0,1500));
  expect(balance(bob)).toBe(b-1500n);expect(balance(alice)).toBe(al+900n);expect(balance(carol)).toBe(ca+600n);
  expect(total(s1)).toBeUint(3);expect(total(s2)).toBeUint(2);
  expect(prints(r,'radio-paid-play')).toBe(5);
  expect(read('get-receipt',[Cl.standardPrincipal(bob),Cl.buffer(receipt(1))])).toEqual(kept(5,5,0,1500,300));
  expect(pack([[s1],[s2],[s1],[s2],[s1]],1,300).length).toBe(43);
  expect(packed([[s1]],2,300).result).toBeOk(sum(1,0,300));
  // One receipt covers both ways of calling.
  expect(settle([[s1]],1,300).result).toBeErr(Cl.uint(103));
  expect(packed([[s1]],2,300).result).toBeErr(Cl.uint(103));
 });

 it('ten plays at 500 each in one transaction, either way',()=>{
  expect(settings(500,10).result.type).toBe('ok');
  const b=balance(bob),al=balance(alice);
  expect(settle(Array.from({length:10},()=>[s1] as Play),1,500).result).toBeOk(sum(10,0,5000));
  const data=pack(Array.from({length:10},()=>[s1] as Play),2,500);
  expect(data.length).toBe(68);
  expect(call('settle-packed',[Cl.buffer(data)]).result).toBeOk(sum(10,0,5000));
  expect(balance(bob)).toBe(b-10000n);expect(balance(alice)).toBe(al+10000n);
  expect(total(s1)).toBeUint(20);
 });

 it('a rate changed after the listener signed pays nothing until they agree to the new one',()=>{
  settings(300,5);
  const b=balance(bob);
  settings(500,5);
  expect(settle([[s1],[s1]],1,300).result).toBeErr(Cl.uint(107));
  expect(packed([[s1],[s1]],1,300).result).toBeErr(Cl.uint(107));
  expect(balance(bob)).toBe(b);
  expect(read('get-receipt',[Cl.standardPrincipal(bob),Cl.buffer(receipt(1))])).toBeNone();
  expect(packed([[s1],[s1]],1,500).result).toBeOk(sum(2,0,1000));
 });

 it('only the owner changes settings, and only inside the fixed limits',()=>{
  expect(settings(300,5,bob).result).toBeErr(Cl.uint(110));
  expect(settings(49,5).result).toBeErr(Cl.uint(111));
  expect(settings(1001,5).result).toBeErr(Cl.uint(111));
  expect(settings(300,0).result).toBeErr(Cl.uint(112));
  expect(settings(300,11).result).toBeErr(Cl.uint(112));
  expect(settings(50,1).result.type).toBe('ok');expect(settings(1000,10).result.type).toBe('ok');
  expect(prints(settings(400,5),'radio-plays-settings')).toBe(1);
  expect(call('set-owner',[Cl.standardPrincipal(carol)],bob).result).toBeErr(Cl.uint(110));
  expect(call('set-owner',[Cl.standardPrincipal(carol)],admin).result).toBeOk(Cl.standardPrincipal(carol));
  expect(settings(300,5).result).toBeErr(Cl.uint(110));        // the old owner is out
  expect(settings(300,5,carol).result.type).toBe('ok');
 });

 it('a receipt works once, per payer, and a refused settlement leaves nothing behind',()=>{
  settings(300,5);
  const b=balance(bob);
  expect(settle([[s1],[s1]],1,300).result).toBeOk(sum(2,0,600));
  expect(settle([[s1]],1,300).result).toBeErr(Cl.uint(103));
  expect(packed([[s1]],1,300).result).toBeErr(Cl.uint(103));
  expect(balance(bob)).toBe(b-600n);
  expect(settle([[s1]],1,300,carol).result.type).toBe('ok');   // receipts are per payer
  expect(settle([[s1],[s1,4]],2,300).result).toBeErr(Cl.uint(101)); // an unknown core aborts the lot: the first play is not paid
  expect(balance(bob)).toBe(b-600n);
  expect(read('get-receipt',[Cl.standardPrincipal(bob),Cl.buffer(receipt(2))])).toBeNone();
  expect(settle([[s1]],2,300).result.type).toBe('ok');         // so the receipt is still free to use
 });

 it('a play that cannot be paid is reported and skipped; the rest of the settlement still pays',()=>{
  settings(300,5);
  const mine=mint('xtrata-v3-2-3',bob);                       // the listener holds this one
  const held=mint('xtrata-v3-2-3',alice);                     // this one goes into a contract
  expect(simnet.callPublicFn('xtrata-v3-2-3','transfer',[Cl.uint(held),Cl.standardPrincipal(alice),Cl.contractPrincipal(admin,name)],alice).result).toBeOk(Cl.bool(true));
  const b=balance(bob),al=balance(alice),ca=balance(carol);
  for (const [way,k] of [[settle,1],[packed,2]] as const){
   const r=way([[s1],[mine],[999999],[held],[s2]],k,300);
   expect(r.result).toBeOk(sum(2,3,600));
   expect(prints(r,'radio-play-skipped')).toBe(3);
   expect(read('get-receipt',[Cl.standardPrincipal(bob),Cl.buffer(receipt(k))])).toEqual(kept(5,2,3,600,300));
  }
  expect(balance(bob)).toBe(b-1200n);expect(balance(alice)).toBe(al+600n);expect(balance(carol)).toBe(ca+600n);
  expect(total(mine)).toBeUint(0);expect(total(held)).toBeUint(0);
  expect(settle([[mine]],3,300).result).toBeOk(sum(0,1,0));    // all skipped is still a clean result
  expect(simnet.getAssetsMap().get('STX')!.get(`${admin}.${name}`) ?? 0n).toBe(0n); // the contract never holds money
 });

 it('pays whoever holds the song when the settlement lands',()=>{
  settings(300,5);
  expect(simnet.callPublicFn('xtrata-v3-2-3','transfer',[Cl.uint(s1),Cl.standardPrincipal(alice),Cl.standardPrincipal(carol)],alice).result).toBeOk(Cl.bool(true));
  const al=balance(alice),ca=balance(carol);
  expect(packed([[s1],[s1]],1,300).result).toBeOk(sum(2,0,600));
  expect(balance(alice)).toBe(al);expect(balance(carol)).toBe(ca+600n);
 });

 it('rejects malformed input and a call made through another contract',()=>{
  settings(300,5);
  const b=balance(bob);
  expect(call('settle',[Cl.list([Cl.tuple({core:Cl.uint(3),id:Cl.uint(s1)})]),Cl.buffer(Buffer.alloc(15,1)),Cl.uint(300)]).result).toBeErr(Cl.uint(102));
  const good=pack([[s1],[s1]],1,300);
  for (const bad of [good.subarray(0,27),good.subarray(0,18),good.subarray(0,5),Buffer.alloc(0)]) expect(call('settle-packed',[Cl.buffer(bad)]).result).toBeErr(Cl.uint(109));
  expect(packed([[s1],[s1,7]],1,300).result).toBeErr(Cl.uint(101));
  const proxy=`(define-public (go (data (buff 68))) (contract-call? .${name} settle-packed data))
(define-public (go2 (plays (list 10 {core: uint, id: uint})) (receipt (buff 16)) (rate uint)) (contract-call? .${name} settle plays receipt rate))`;
  expect(simnet.deployContract('plays-proxy-'+version,proxy,{clarityVersion:version},admin).result).toBeBool(true);
  expect(simnet.callPublicFn('plays-proxy-'+version,'go',[Cl.buffer(good)],bob).result).toBeErr(Cl.uint(100));
  expect(simnet.callPublicFn('plays-proxy-'+version,'go2',[Cl.list([Cl.tuple({core:Cl.uint(3),id:Cl.uint(s1)})]),Cl.buffer(receipt(1)),Cl.uint(300)],bob).result).toBeErr(Cl.uint(100));
  expect(balance(bob)).toBe(b);
 });

 it.each([[1,'xtrata-v1-1-1'],[2,'xtrata-v2-1-0']] as const)('settles songs in legacy core %i, either way',(selector,core)=>{
  settings(300,5);
  simnet.callPublicFn(core,'set-paused',[Cl.bool(false)],admin);
  const legacy=mint(core,alice);
  const al=balance(alice);
  expect(settle([[legacy,selector],[s1]],1,300).result).toBeOk(sum(2,0,600));
  expect(packed([[legacy,selector],[s1]],2,300).result).toBeOk(sum(2,0,600));
  expect(balance(alice)).toBe(al+1200n);
  expect(total(legacy,selector)).toBeUint(2);
 });
});
