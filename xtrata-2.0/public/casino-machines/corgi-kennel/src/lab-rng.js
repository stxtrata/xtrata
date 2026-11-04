/* Bonus-preview RNG plans. Include this file INSIDE the game's private closure.
   Every displayed result is still dealt by the unchanged BF engine. This module only supplies
   valid integer random draws: it never changes engine state, awards, grids, balances or payouts.
   The controller owns the separate practice state, suppressed persistence and host isolation. */
const PX_LAB_RNG = (() => {
  'use strict';
  const items=Object.freeze([
    {id:'free',label:'Community Takeover',kind:'free',description:'Eight laps of honour. All free-spin wins pay 2×.'},
    {id:'retrigger',label:'Community Takeover · encore',kind:'free',description:'Eight free spins, then a real four-spin retrigger.'},
    {id:'pick',label:'Fetch!',kind:'pick',description:'Nine balls in the ring. Fetch three prizes.'},
    {id:'hold',label:'Pedigree',kind:'hold',description:'Lock descendants into the family tree. Every new lock resets the counter.'},
    {id:'full-hold',label:'Pedigree · complete family',kind:'hold',description:'Fill all fifteen family-tree spaces to win Best in Show.'},
    {id:'jackpot',label:'Best in Show',kind:'jackpot',description:'Five WELSH on the centre row win the Casino Jackpot.'},
    {id:'gamble-win',label:'Sit or Stay · win',kind:'gamble',description:'A real line win followed by a winning even-bet reveal.'},
    {id:'gamble-loss',label:'Sit or Stay · loss',kind:'gamble',description:'A real line win followed by a losing even-bet reveal.'},
    {id:'scatter-3',label:'Day One · three',kind:'scatter',description:'Three Day One records pay 2× bet and award eight free spins.'},
    {id:'scatter-4',label:'Day One · four',kind:'scatter',description:'Four Day One records pay 5× bet and award eight free spins.'},
    {id:'scatter-5',label:'Day One · five',kind:'scatter',description:'Five Day One records pay 10× bet and award eight free spins.'},
    {id:'fund-info',label:'The community fund',kind:'information',description:'Every eligible Forever Twin earns a share; no token is needed to play.'}
  ].map(Object.freeze));
  function create(E,options={}){
    if(options.practice!==true)throw Error('Bonus forcing is available only in isolated practice mode.');
    const event=options.event||'free',meta=items.find(x=>x.id===event);
    if(!meta)throw Error('Unknown bonus-preview item: '+event);
    const seed=options.mode==='random'
      ? Array.from(crypto.getRandomValues(new Uint32Array(4)),x=>x.toString(16).padStart(8,'0')).join('')
      : String(options.seed??'CorgiKennel-21');
    let h=2166136261;for(const ch of seed)h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;
    let alive=true,spins=0;
    function assertPractice(){if(!alive)throw Error('This bonus preview has ended.');}
    function nextWord(){h=(h+0x6d2b79f5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return(t^(t>>>14))>>>0;}
    function random(n){assertPractice();if(!Number.isSafeInteger(n)||n<1)throw Error('Invalid RNG range');const cap=Math.floor(4294967296/n)*n;let x;do{x=nextWord();}while(x>=cap);return x%n;}
    const windows=E.strips.map((strip,c)=>strip.map((_,stop)=>({stop,window:E.windowAt(c,stop)})));
    const noFeature=w=>!w.some(x=>x==='scatter'||x==='vault'||x==='chain');
    const one=(w,symbol)=>w.filter(x=>x===symbol).length===1;
    function choose(c,predicate){const valid=windows[c].filter(x=>predicate(x.window));if(!valid.length)throw Error('The immutable strips cannot fulfil this preview.');return valid[random(valid.length)].stop;}
    function safeStops(){
      let stops;do{stops=windows.map((_,c)=>choose(c,noFeature));}while(E.evaluate(stops.map((s,c)=>E.windowAt(c,s)),100).jackpot);
      return stops;
    }
    function stopsFor(kind){
      if(kind.startsWith('scatter-')){const count=Number(kind.slice(-1));return windows.map((_,c)=>choose(c,w=>c<count?one(w,'scatter')&&!w.includes('vault')&&!w.includes('chain'):noFeature(w)));}
      if(kind==='pick')return windows.map((_,c)=>choose(c,w=>c<3?one(w,'vault')&&!w.includes('scatter')&&!w.includes('chain'):noFeature(w)));
      if(kind==='hold'||kind==='full-hold')return windows.map((_,c)=>choose(c,w=>one(w,'chain')&&!w.includes('vault')&&!w.includes('scatter')));
      if(kind==='jackpot')return windows.map((_,c)=>choose(c,w=>w[1]==='bitcoin'&&noFeature(w)));
      if(kind==='gamble-win'||kind==='gamble-loss')return windows.map((_,c)=>choose(c,w=>noFeature(w)&&(c>=3||w[1]==='cherry')));
      return safeStops();
    }
    function spinRng(state){
      assertPractice();if(event==='fund-info')throw Error('The fund preview is informational and does not place a bet.');
      if(!state||E.busy(state))throw Error('Finish the practice round before requesting another RNG.');
      const round=spins++;
      let kind=round===0?event:'safe';
      if(round===0&&(event==='free'||event==='retrigger'))kind='scatter-3';
      if(round===1&&event==='retrigger'&&state.free>0)kind='scatter-3';
      const stops=stopsFor(kind);let reel=0,chainAttempts=0;
      return n=>{
        assertPractice();
        if(reel<5){const c=reel++;if(n!==E.strips[c].length)throw Error('Engine RNG order changed; preview refused.');return stops[c];}
        if(n===E.CHAIN_ODDS&&(kind==='hold'||kind==='full-hold')){
          const attempt=chainAttempts++;
          // The real initial grid has exactly five locks, so the first pass visits ten empty cells.
          if(kind==='hold')return attempt===0||attempt===10?0:1;
          // First pass: four locks; second: three locks; third: the final three. Every frame is dealt by BF.
          return attempt<10?(attempt%3===0?0:1):attempt<16?(attempt%2===0?0:1):0;
        }
        return random(n);
      };
    }
    function gambleRng(choice){
      assertPractice();if(!event.startsWith('gamble-'))throw Error('This item does not force a gamble.');
      if(choice!=='odd'&&choice!=='even')throw Error('Use the engine odd/even gamble choices.');
      let first=true;const winning=event==='gamble-win',odd=winning?(choice==='odd'):(choice!=='odd');
      return n=>{assertPractice();if(first){first=false;if(n!==2)throw Error('Engine gamble RNG order changed; preview refused.');return odd?1:0;}return random(n);};
    }
    return Object.freeze({event,seed,meta,spinRng,gambleRng,close(){alive=false;},stats:()=>({event,seed,spins,active:alive})});
  }
  return Object.freeze({items,create});
})();
