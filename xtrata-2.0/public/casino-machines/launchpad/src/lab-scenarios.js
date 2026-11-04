/* Private, RNG-only practice scenarios. This script creates no window property.
   The UI must enter its isolated preview before using a run. Every run has a
   fresh engine state; no real LAYR state, meter or account is passed in. */
const LaunchpadLab=(()=>{
 'use strict';
 const items=Object.freeze([
  {id:'free',title:'Launch Window',description:'Three Countdown records · eight free spins at 2×.'},
  {id:'free-retrigger',title:'Launch Window + retrigger',description:'A second Countdown adds four free spins.'},
  {id:'pick',title:'Pre-launch Seats',description:'Open three of nine pre-dealt capsule seats.'},
  {id:'chain',title:'Graduation',description:'Curve steps lock; new buys reset three respins.'},
  {id:'chain-full',title:'Graduation · full grid',description:'All fifteen steps lock and win the practice jackpot.'},
  {id:'jackpot',title:'Graduation Day',description:'Five Moonshots on the centre line.'},
  {id:'gamble-win',title:'Ape or Fade · win',description:'A paid base win followed by a winning even bet.'},
  {id:'gamble-loss',title:'Ape or Fade · loss',description:'A paid base win followed by a losing even bet.'},
  {id:'scatter3',title:'Three Countdowns',description:'2× total bet, then Launch Window.'},
  {id:'scatter4',title:'Four Countdowns',description:'5× total bet, then Launch Window.'},
  {id:'scatter5',title:'Five Countdowns',description:'10× total bet, then Launch Window.'},
  {id:'fund',title:'Machine Fund info',description:'Floor-wide Forever Twin shares; unverified counts say checking.'}
 ]);
 const stopSets=Object.freeze({
  free:[10,10,10,12,12],'free-retrigger':[10,10,10,12,12],
  pick:[20,20,20,20,20],chain:[0,0,1,12,12],'chain-full':[0,0,1,12,12],
  jackpot:[8,3,14,0,15],'gamble-win':[15,8,23,30,4],'gamble-loss':[15,8,23,30,4],
  scatter3:[10,10,10,12,12],scatter4:[10,10,10,10,12],scatter5:[10,10,10,10,10]
 });
 function seedNumber(seed){let s=String(seed??'20261103'),h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
 function seeded(seed){let a=seedNumber(seed);return n=>{if(!Number.isInteger(n)||n<1)throw Error('Bad random range');a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return Math.floor((((t^(t>>>14))>>>0)/4294967296)*n);};}
 function scriptFor(id,random){const stops=stopSets[id];if(!stops)throw Error('This preview item has no spin');let consumed=0;return n=>{if(consumed<5){if(n!==32)throw Error('Engine RNG order changed');return stops[consumed++];}if(id==='chain-full'&&n===25)return 0;return random(n);};}
 function createRun(itemId,bet,seed,engine){
  const item=items.find(x=>x.id===itemId);if(!item)throw Error('Unknown preview item');if(!engine.bets.includes(Number(bet)))throw Error('Invalid practice bet');
  const state=engine.fresh();state.balance=1000000;state.bet=Number(bet);state.freeBet=Number(bet);
  const random=seeded(seed),rng=itemId==='fund'?random:scriptFor(itemId,random);let nextCount=0;
  return {item,state,seed:String(seed),stops:stopSets[itemId]?.slice()||null,rng,
   nextRng(){return itemId==='free-retrigger'&&nextCount++===0?scriptFor('free',random):random;},
   gambleRng(choice){if(!['odd','even'].includes(choice))throw Error('Invalid call');let first=true;return n=>{if(first&&n===2){first=false;const wantsOdd=choice==='odd';return Number(itemId==='gamble-loss'?!wantsOdd:wantsOdd);}return random(n);};}
  };
 }
 return Object.freeze({items,seeded,seedNumber,scriptFor,createRun});
})();
