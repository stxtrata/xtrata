import assert from 'node:assert/strict';
import {initSimnet} from '../../X-Chess_2.0/node_modules/@stacks/clarinet-sdk/dist/esm/node/src/index.js';
import {Cl} from '../../X-Chess_2.0/node_modules/@stacks/transactions/dist/index.js';
import {writeFileSync} from 'node:fs';
const sim=await initSimnet(new URL('../Clarinet.toml',import.meta.url).pathname);
const accounts=sim.getAccounts(), owner=accounts.get('deployer'), alice=accounts.get('wallet_1'), bob=accounts.get('wallet_2');
const contract='xchess-core-v3', results=[];
const call=(fn,args=[],who=alice)=>sim.callPublicFn(contract,fn,args,who).result;
const read=(fn,args=[])=>sim.callReadOnlyFn(contract,fn,args,alice).result;
const eq=(actual,expected)=>assert.equal(Cl.prettyPrint(actual),expected);
const u=Cl.uint;
const args=[Cl.bufferFromUtf8('canonical rules'),u(1),Cl.bufferFromUtf8('{"variant":"standard"}'),Cl.stringAscii('match-1'),Cl.bool(false),u(1000000)];
const test=(name,fn)=>{try{fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:e.message});}};
test('described opening stores permanent bytes and matching commitment',()=>{
 eq(call('open-described-game',args),'(ok u1)');
 const descriptor=read('get-descriptor',[u(1)]); assert.match(Cl.prettyPrint(descriptor),/some/);
 const commitment=read('descriptor-hash',args.slice(0,4));
 const game=read('get-game',[u(1)]); assert.equal(game.value.value['rules-hash'].value.value,commitment.value);
});
test('identical descriptors allocate distinct game IDs',()=>eq(call('open-described-game',args),'(ok u2)'));
test('stale opening quote rejects atomically',()=>{const a=[...args];a[5]=u(0);eq(call('open-described-game',a),'(err u121)');eq(read('get-game-count'),'u2');});
test('empty rules rejected',()=>{const a=[...args];a[0]=Cl.buffer(new Uint8Array());eq(call('open-described-game',a),'(err u120)');});
test('zero options version rejected',()=>{const a=[...args];a[1]=u(0);eq(call('open-described-game',a),'(err u120)');});
test('V2-format opening and submission ABI retained',()=>{eq(call('open-game',[Cl.none(),Cl.bool(false)]),'(ok u3)');eq(call('submit',[u(3),Cl.stringAscii('e2e4')]),'(ok u0)');});
test('configure small immutable funding terms',()=>{eq(call('set-sponsorship',[u(100),u(20),u(10),u(0)],owner),'(ok true)');eq(call('set-expiry-blocks',[u(100)],owner),'(ok u100)');});
test('stale sponsorship quote rejects',()=>eq(call('sponsor-game',[u(1),Cl.principal(bob),u(100),u(19),u(10),u(0),u(100)]),'(err u121)'));
test('third-party sponsorship reserves exactly its liability',()=>{eq(call('sponsor-game',[u(1),Cl.principal(bob),u(100),u(20),u(10),u(0),u(100)]),'(ok true)');eq(read('get-total-reserved'),'u200');});
test('duplicate sponsorship rejected',()=>eq(call('sponsor-game',[u(1),Cl.principal(bob),u(100),u(20),u(10),u(0),u(100)]),'(err u107)'));
test('top-up uses original rebate when global rebate decreases',()=>{eq(call('set-sponsorship',[u(100),u(10),u(10),u(0)],owner),'(ok true)');eq(call('top-up-sponsorship',[u(1),Cl.principal(bob)]),'(ok true)');eq(read('get-total-reserved'),'u400');});
test('submission pays original rebate and reconciles reserve',()=>{eq(call('submit',[u(1),Cl.stringAscii('e2e4')],bob),'(ok u0)');eq(read('get-total-reserved'),'u380');});
test('expiry stops rebates without stopping submissions',()=>{sim.mineEmptyBlocks(110);eq(call('submit',[u(1),Cl.stringAscii('junk')],bob),'(ok u1)');eq(read('get-total-reserved'),'u380');});
test('permissionless settlement releases exactly remaining reserve',()=>{eq(call('settle-sponsorship',[u(1),Cl.principal(bob)]),'(ok u380)');eq(read('get-total-reserved'),'u0');});
test('second settlement rejected',()=>eq(call('settle-sponsorship',[u(1),Cl.principal(bob)]),'(err u109)'));
test('descriptor immutable after moves, sponsorship and settlement',()=>{const d=read('get-descriptor',[u(1)]);assert.equal(d.value.value.rules.value,Cl.bufferFromUtf8('canonical rules').value);});
test('V3 open ABI and 32-entry page match frontend',()=>{
 const before=read('get-game-count').value;
 eq(call('open-v3-game',[Cl.bufferFromUtf8('rules'),u(1000000),Cl.list([])]),'(ok u'+(before+1n)+')');
 const game=before+1n;eq(call('submit',[u(game),Cl.stringAscii('e2e4')]),'(ok u0)');
 const page=read('get-entries-page',[u(game),u(0)]);assert.equal(page.value.length,32);eq(page.value[0].value.value.seq,'u0');eq(page.value[1],'none');
 assert.equal(read('get-games-page',[u(0)]).value.length,32);
});
test('V3 opening with two funding beneficiaries reconciles exactly',()=>{
 const expiry=sim.blockHeight+100;
 const row=who=>Cl.tuple({beneficiary:Cl.principal(who),bootstrap:u(100),rebate:u(20),count:u(10),expiry:u(expiry)});
 eq(call('open-v3-game',[Cl.bufferFromUtf8('rules'),u(1000000),Cl.list([row(alice),row(bob)])]),'(ok u5)');
 eq(read('get-total-reserved'),'u400');eq(read('quote-rebate',[u(5),Cl.principal(bob)]),'u20');
});
test('V3 duplicate beneficiary rolls back game and reserve',()=>{
 const row=Cl.tuple({beneficiary:Cl.principal(bob),bootstrap:u(100),rebate:u(20),count:u(10),expiry:u(sim.blockHeight+100)});
 eq(call('open-v3-game',[Cl.bufferFromUtf8('rules'),u(1000000),Cl.list([row,row])]),'(err u107)');
 eq(read('get-game-count'),'u5');eq(read('get-total-reserved'),'u400');
});
test('V3 top-up binds immutable rebate and count',()=>{
 eq(call('top-up',[u(5),Cl.principal(bob),u(3),u(10)]),'(err u121)');
 eq(call('top-up',[u(5),Cl.principal(bob),u(3),u(20)]),'(ok true)');eq(read('get-total-reserved'),'u460');
});
test('V3 oversized bootstrap rolls back atomically',()=>{
 const row=Cl.tuple({beneficiary:Cl.principal(bob),bootstrap:u(1000001),rebate:u(20),count:u(10),expiry:u(sim.blockHeight+100)});
 eq(call('open-v3-game',[Cl.bufferFromUtf8('rules'),u(1000000),Cl.list([row])]),'(err u104)');eq(read('get-game-count'),'u5');
});
test('V3 expired quote is zero and expired top-up rejected',()=>{
 sim.mineEmptyBlocks(110);eq(read('quote-rebate',[u(5),Cl.principal(bob)]),'u0');eq(call('top-up',[u(5),Cl.principal(bob),u(3),u(20)]),'(err u108)');
});
test('V3 settlement releases reserves independently',()=>{
 eq(call('settle',[u(5),Cl.principal(bob)]),'(ok u260)');eq(read('get-total-reserved'),'u200');
 eq(call('settle',[u(5),Cl.principal(alice)]),'(ok u200)');eq(read('get-total-reserved'),'u0');eq(read('is-solvent'),'true');
});
const report={passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,results};
writeFileSync(new URL('../contract-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));process.exitCode=report.failed?1:0;
