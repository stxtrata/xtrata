#!/usr/bin/env node
// Real engine simulation: BF.start, settle, pick, respin, collect and endFree.
// The engine text is loaded without modifications. History is cleared only after
// each complete paid round, avoiding unneeded UI history copies in a long run.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {webcrypto,createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const N=Number(process.argv[2]||5000000),seed=Number(process.argv[3]||20261103);
if(!Number.isInteger(N)||N<1||!Number.isFinite(seed))throw Error('Usage: node tools/rtp.mjs [paid rounds] [integer seed]');
const source=readFileSync(resolve(root,'src/engine.js'),'utf8');
const a=source.indexOf('const BF = (() => {'),b=source.indexOf('\n})();',a),block=source.slice(a,b+6);
const sha256=createHash('sha256').update(block).digest('hex');
if(sha256!=='203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed')throw Error('Engine hash mismatch');
const E=new Function('crypto',source+'\nreturn BF;')(webcrypto);
let word=seed>>>0;function rng(n){word=(word+0x6D2B79F5)>>>0;let t=word;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return Math.floor((((t^(t>>>14))>>>0)/4294967296)*n);}
const state=E.fresh();state.balance=1e14;state.bet=100;
const money={lines:0,scatters:0,free:0,pick:0,chain:0,jackpot:0};
const counts={paid:N,freeSpins:0,freeTriggers:0,retriggers:0,pick:0,chain:0,jackpot:0,fullGrid:0};
const started=performance.now();
function spin(){
 const wasFree=state.free>0;E.start(state,rng);const r=E.settle(state);
 if(wasFree){counts.freeSpins++;money.free+=r.lineTotal+r.scatterPay;}else{money.lines+=r.lineTotal;money.scatters+=r.scatterPay;}
 if(r.triggers.free){if(wasFree)counts.retriggers++;else counts.freeTriggers++;}
 if(r.jackpotWin){counts.jackpot++;money.jackpot+=r.jackpotWin;}
 let f;while((f=E.feature(state))){
  const full=f.type==='chain'&&f.full;
  if(f.type==='vault'){counts.pick++;E.pick(state,0);E.pick(state,1);E.pick(state,2);}
  else{counts.chain++;while(!E.featureDone(f))E.respin(state);}
  const out=E.collect(state);money[out.type==='vault'?'pick':'chain']+=out.amount-out.jackpotWin;
  if(out.jackpotWin){counts.jackpot++;money.jackpot+=out.jackpotWin;if(full)counts.fullGrid++;}
 }
}
for(let i=0;i<N;i++){
 spin();while(state.free>0)spin();if(state.freeActive)E.endFree(state);
 state.history.length=0;
 if((i+1)%500000===0)console.log(JSON.stringify({progress:i+1,total:N,seed,rtp:100*state.paidOut/state.wagered,seconds:Math.round((performance.now()-started)/1000)}));
}
const outstanding=state.jackpots[state.bet]-E.seedFor(state.bet);
const result={engineSha256:sha256,seed,paidRounds:N,allSpins:state.spins,bet:state.bet,wagered:state.wagered,paidOut:state.paidOut,rtpPercent:state.paidOut/state.wagered*100,rtpIncludingOutstandingMeterPercent:(state.paidOut+outstanding)/state.wagered*100,outstandingProgressiveContribution:outstanding,money,contributionPercents:Object.fromEntries(Object.entries(money).map(([k,v])=>[k,v/state.wagered*100])),componentGrouping:'lines/scatters are paid base spins; free is free line/scatter pay only; pick/chain include features during free spins; jackpot is every jackpot. Aggregate return is comparable to the 94.38% design estimate; component grouping differs from the Bible.',counts,seconds:(performance.now()-started)/1000,designEstimatePercent:94.38,withinPoint3:Math.abs(state.paidOut/state.wagered*100-94.38)<=.3,note:'Full unchanged engine; paid rounds include all triggered free spins and both features. No gamble. History cleared after each whole paid round only. Design estimate, not certified.'};
mkdirSync(resolve(root,'checks/results'),{recursive:true});writeFileSync(resolve(root,`checks/results/rtp-${N}-${seed}.json`),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
