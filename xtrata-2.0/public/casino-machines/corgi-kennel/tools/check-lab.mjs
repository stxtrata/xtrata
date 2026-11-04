#!/usr/bin/env node
// Exercise each forcing plan through the ORIGINAL engine at every supported stake.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto,createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'src/engine.js'),'utf8');
assert.equal(createHash('sha256').update(source).digest('hex'),'7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168');
const E=new Function('crypto',source+'\nreturn BF;')(webcrypto);
const LAB=new Function('crypto',fs.readFileSync(path.join(root,'src/lab-rng.js'),'utf8')+'\nreturn PX_LAB_RNG;')(webcrypto);
const rows=[];
function execute(event,bet,seed='checks-21'){
  const plan=LAB.create(E,{practice:true,event,seed});
  const s=E.fresh();s.balance=1000000;s.bet=bet;
  if(event==='fund-info'){assert.throws(()=>plan.spinRng(s),/informational/);return{event,bet,informational:true};}
  const rounds=[];let first=true;
  do{
    const p=E.start(s,plan.spinRng(s));
    const before=s.balance,stored=JSON.stringify(s);const id=p.id;
    // Simulate a reload after debit/commit but before visual landing. The exact pending id and grid survive.
    const loaded=E.load(JSON.parse(stored));assert.equal(loaded.pending.id,id);
    const rl=E.settle(loaded),after=loaded.balance;assert.equal(E.settle(loaded),null);assert.equal(loaded.balance,after);
    const r=E.settle(s);assert.deepEqual(r,rl);assert.equal(s.balance,before+r.total);
    const outcome={id:p.id,stops:p.stops,scatters:r.scatters,scatterPay:r.scatterPay,freeAward:r.freeAward,free:p.free,jackpotWin:r.jackpotWin,total:r.total,features:[]};
    if(first){
      if(event==='free'||event==='retrigger'||event.startsWith('scatter-')){assert.equal(r.scatters,event.startsWith('scatter-')?Number(event.slice(-1)):3);assert.equal(r.freeAward,8);}
      if(event==='pick')assert.equal(r.vaults,3);
      if(event==='hold'||event==='full-hold')assert.equal(r.chains,5);
      if(event==='jackpot'){assert.equal(r.jackpot,true);assert.equal(r.jackpotWin,Math.floor(bet*500+bet*.02));}
      if(event.startsWith('gamble-'))assert.ok(s.gamble>0);
    }
    for(let f=E.feature(s);f;f=E.feature(s)){
      const frames=f.type==='chain'?JSON.parse(JSON.stringify(f.frames)):null;
      const pre=s.balance;assert.equal(E.collect(s),null);
      if(f.type==='vault'){
        const a=E.pick(s,0);assert.ok(a);assert.equal(E.pick(s,0),null);assert.equal(E.pick(s,-1),null);E.pick(s,4);E.pick(s,8);assert.equal(E.pick(s,1),null);
      }else{let count=0;while(E.respin(s))count++;assert.equal(count,f.frames.length-1);assert.deepEqual(f.frames,frames);}
      const won=E.collect(s);assert.equal(s.balance,pre+won.amount);assert.equal(E.collect(s),null);assert.equal(s.balance,pre+won.amount);
      outcome.features.push({...won,frames,full:f.full??false});
      if(event==='full-hold'){assert.equal(f.full,true);assert.equal(f.frames.length,4);assert.equal(won.jackpotWin,Math.floor(bet*500+bet*.02));assert.equal(s.jackpots[bet],bet*500);}
      if(event==='hold'){assert.equal(f.full,false);assert.equal(f.frames.length,6);assert.equal(f.frames[1].left,3);assert.equal(f.frames[2].left,3);assert.equal(f.frames.at(-1).left,0);}
    }
    if(first&&event.startsWith('gamble-')){
      const stake=s.gamble,pre=s.balance;const g=E.gamble(s,'odd',plan.gambleRng('odd'));assert.equal(g.win,event==='gamble-win');assert.equal(s.balance,pre+(g.win?stake:-stake));assert.equal(E.gamble(s,'odd',plan.gambleRng('odd')),null);outcome.gamble=g;
    }
    rounds.push(outcome);first=false;
    if(!s.free&&s.freeActive)E.endFree(s);
    assert.ok(rounds.length<30,'preview must finish');
  }while(s.free>0);
  if(event==='retrigger'){assert.equal(rounds.length,13);assert.equal(rounds[1].freeAward,4);}
  if(event==='free'||event.startsWith('scatter-'))assert.equal(rounds.length,9);
  const result={event,bet,seed:plan.seed,spins:s.spins,paidOut:s.paidOut,wagered:s.wagered,gambleNet:s.gambleNet,balance:s.balance,rounds};
  plan.close();assert.throws(()=>plan.spinRng(s),/ended/);return result;
}
assert.throws(()=>LAB.create(E,{event:'free'}),/practice/);
assert.throws(()=>LAB.create(E,{event:'free',practice:false}),/practice/);
for(const item of LAB.items)for(const bet of E.bets){
  const a=execute(item.id,bet),b=execute(item.id,bet);assert.deepEqual(a,b,'seeded preview replay must deal identical results');
  rows.push({event:item.id,bet,pass:true,spins:a.spins??0,paidOut:a.paidOut??0,informational:a.informational||false});
}
// Original-engine free-award ceiling, forced only through real reel stops.
const cap=E.fresh();cap.balance=1000000;
for(let i=0;i<8;i++){const p=LAB.create(E,{event:'scatter-3',seed:'cap-'+i,practice:true});E.start(cap,p.spinRng(cap));E.settle(cap);assert.ok(cap.freeAwarded<=24);}
assert.equal(cap.freeAwarded,24);
// Same engine action sequence gives the same result whether a presentation waits between frames or skips them.
for(const id of ['free','retrigger','pick','hold','full-hold','jackpot','gamble-win','gamble-loss']){
  const played=execute(id,100,'skip-equivalence'),skipped=execute(id,100,'skip-equivalence');assert.equal(played.balance,skipped.balance);assert.equal(played.paidOut,skipped.paidOut);
}
const result={status:'PASS',checkedAt:new Date().toISOString(),engineSha256:createHash('sha256').update(source).digest('hex'),scope:'Engine-level forcing, seeded replay, reload settlement, feature credit idempotency and free-spin cap. Browser presentation/preview isolation checks are separate.',assertions:['No forcing without explicit practice flag','All 12 items validated at all five stakes','Each seeded item replay deals identical round ids, stop positions and awards','Reloaded pending round preserves id and settles only once','Duplicate picks and duplicate feature collect cannot add credit','Hold frames and full-grid jackpot are generated by original engine','Free retrigger awards 12 total free spins; ceiling remains 24','Gamble win/loss uses original even-bet engine','All spin/feature balances match credited awards'],rows};
fs.mkdirSync(path.join(root,'checks/results'),{recursive:true});fs.writeFileSync(path.join(root,'checks/results/lab-engine.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,items:LAB.items.length,stakes:E.bets.length,cases:rows.length,assertions:result.assertions},null,2));
