(() => {
'use strict';
// Copy pristine functions BEFORE the room wraps BF for its round log / spectators.
const PX_PURE=Object.freeze({...BF});
const GAME_ID='launchpad', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
if(window.__bfUnsupported)return;
const HOSTED=window.parent!==window;
const TEST=(HOSTED||window.ParallaxLAYRAccount?.mode==='standalone-test')&&window.parent.PX_STANDALONE_TEST===true || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const $=id=>document.getElementById(id), copy=x=>JSON.parse(JSON.stringify(x));
const fmt=n=>(Number.isFinite(n)?Math.round(n*100)/100:0).toLocaleString('en-GB',{maximumFractionDigits:2});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const NAMES={cherry:'Launch tier IV',lemon:'Launch tier III',chip:'Launch tier II',block:'Launch tier I',artifact:'Graduate',bitcoin:'Moonshot',wild:'STX',scatter:'Countdown',vault:'Pre-launch Seat',chain:'Curve Step'};
const TITLES={free:'LAUNCH WINDOW',pick:'PRE-LAUNCH SEATS',chain:'GRADUATION',jackpot:'GRADUATION DAY',gamble:'APE OR FADE'};
const RULES={free:'Eight free spins. All wins 2×. Retrigger +4, up to 24.',pick:'Open three of nine capsule seats. Each holds a pre-dealt prize.',chain:'Three respins. Every new buy locks and resets the counter.',jackpot:'Five Moonshots or fifteen locked steps. The jackpot is yours.',gamble:'One even bet. Call APE or FADE. Double the win or lose it.'};
const orange='#f97316',cream='#f4efdf',mint='#8cdbb7',navy='#071722';
let state=LAYR.openGame(GAME_ID,E), liveState=null, practice=null, active=false, spinning=false;
let renderedScene=null,renderFrames=0,sessionEpoch=0,claimPending=null;
let revision=0, lastDraw=0, lastUI=0, anim=null, scene=null, freeIntroShown=false, autoLeft=0, autoTimer=0, freeTimer=0;
let panelName='', fsOn=false, fsHost=null, selectedLab='free', lastLab=null, runQueue=[], runAllResults=[], previewEpoch=0, previewTimer=0;
let reelArt=[], settledArt=[], hitboxes=[], lastResult=null, status='MISSION READY · PULL TO ARM', leverStart=0, capTimes={};
let pendingPresentation=[], toastTimer=0, ac=null, master=null, audioSource=null, savedPanelFocus=null;
const initialReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;state.reduced=state.reduced||initialReduced;
const engine=()=>practice?PX_PURE:E, now=()=>performance.now(), bet=()=>state.freeActive?state.freeBet:state.bet;
const save=()=>{if(!practice)LAYR.saveGame(state);};
const phaseBusy=()=>spinning||!!scene||!!engine().feature(state)||state.freeActive;
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
$('screenViewport').appendChild(screen);screen.setAttribute('aria-label','Five reels, three rows. Use the machine controls to play.');
const artConfig=typeof LAUNCHPAD_ART!=='undefined'?LAUNCHPAD_ART:{symbols:{},snapshot:'2026-11-03',sources:[]};
const imageCache=new Map();
function imageFor(item){const uri=item?.dataUri||item?.image||item?.image_uri;if(!uri||!uri.startsWith('data:'))return null;if(!imageCache.has(uri)){const im=new Image();im.onload=()=>revision++;im.src=uri;imageCache.set(uri,im);}return imageCache.get(uri);}
Object.values(artConfig.symbols||{}).flat().forEach(imageFor);
function options(sym){const raw=artConfig.symbols?.[sym];return Array.isArray(raw)?raw:raw?[raw]:[{name:NAMES[sym],status:'DATA PENDING',pending:true}];}
function chooseArt(grid){return grid.map(col=>col.map(sym=>{const pool=options(sym);return pool[Math.floor(Math.random()*pool.length)];}));}
settledArt=chooseArt(state.grid);reelArt=settledArt;
// TODO Casino Service replaces this adapter. The unchanged v2 core currently
// contributes and settles its local five meters; these hooks never credit twice.
const casinoJackpot={
  get(level){return engine().meter(state,level);},
  contribute(level,amount){return {level,amount:amount*.02,meter:engine().meter(state,level),mode:'engine-local-test'};},
  settle(level){return {level,meter:engine().meter(state,level),mode:'engine-local-test'};}
};
function fundState(){const real=liveState||state;const d=new Date(),days=(8-d.getUTCDay())%7||7;d.setUTCDate(d.getUTCDate()+days);d.setUTCHours(0,0,0,0);return {balance:Math.round(real.wagered)/100,periodEnd:d.toISOString(),lastPay:'checking',twins:'checking',type:'W',claims:'display-only'};}
function toast(s){$('toast').textContent=s;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3600);}
function stopAuto(){autoLeft=0;clearTimeout(autoTimer);updateControls();}
function sound(kind){
 if(state.muted)return;
 try{if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=state.volume;master.connect(ac.destination);}ac.resume();master.gain.setTargetAtTime(state.volume,ac.currentTime,.03);
 const tones={click:[460,.045],stop:[750,.08],lock:[280,.15],win:[660,.25],count:[1080,.12],launch:[110,.65],lose:[190,.45]};
 const pair=tones[kind]||tones.click,t=ac.currentTime;
 const play=(f,delay,duration,wave='sine',volume=.12)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=wave;o.frequency.setValueAtTime(f,t+delay);if(kind==='launch')o.frequency.exponentialRampToValueAtTime(55,t+delay+duration);g.gain.setValueAtTime(.0001,t+delay);g.gain.exponentialRampToValueAtTime(volume,t+delay+.008);g.gain.exponentialRampToValueAtTime(.0001,t+delay+duration);o.connect(g);g.connect(master);o.start(t+delay);o.stop(t+delay+duration+.02);};
 play(pair[0],0,pair[1],kind==='launch'?'sawtooth':'sine');if(kind==='win'){[1.25,1.5,2].forEach((v,i)=>play(pair[0]*v,.10*(i+1),.35,'triangle',.07));}
 if(kind==='launch'){const b=ac.createBuffer(1,ac.sampleRate*.7,ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();s.buffer=b;f.type='lowpass';f.frequency.value=480;g.gain.value=.25;s.connect(f);f.connect(g);g.connect(master);s.start();}
 }catch(_){}
}
function press(action){capTimes[action]=now();sound('click');}
function commitSpin(isFree=false){
 if(!active||spinning||panelName)return false;
 if(engine().feature(state)||(!isFree&&state.freeActive)||(!isFree&&scene))return false;
 if(!isFree&&state.balance<state.bet){stopAuto();toast('Insufficient play LAYR. Open SYSTEMS to reset the test balance.');return false;}
 try{
  const p=engine().start(state,practice?(practice.started?practice.run.nextRng():practice.run.rng):undefined);
  if(practice){practice.started=true;practice.spinResults.push(p.id);}
  const ev=engine().evaluate(p.grid,p.bet,p.free?2:1);
  p.jackpot={level:p.bet,hit:!!ev.jackpot||p.features.some(f=>f.type==='chain'&&f.full)};
  if(!p.free)casinoJackpot.contribute(p.bet,p.bet);
  save(); // Result, features and jackpot flag committed before selecting art.
  reelArt=chooseArt(p.grid);spinning=true;anim={t:now(),duration:state.turbo||state.reduced?390:1500,p,stopped:0};status=p.free?'LAUNCH WINDOW · IN FLIGHT':'T−00:03 · LAUNCH SEQUENCE';sound('launch');updateControls();return true;
 }catch(e){stopAuto();toast(e.message);return false;}
}
function finishSpin(){
 const r=engine().settle(state);if(!r)return;spinning=false;anim=null;settledArt=reelArt;lastResult=r;
 if(practice){state.history[0].kind='LAB · '+state.history[0].kind;state.history[0].lab=practice.run.item.id;}
 save();status=r.total>0?'CONFIRMED · '+fmt(r.total)+(practice?' PRACTICE CHIPS':' LAYR'):'FLIGHT COMPLETE · READY TO LAUNCH';
 if(r.total>0)sound('win');
 if(r.jackpotWin){casinoJackpot.settle(r.round.bet);pendingPresentation.push({kind:'jackpot',amount:r.jackpotWin,detail:'Five Moonshots on the centre row.'});}
 if(r.triggers.free||r.round.features.length||r.jackpotWin)stopAuto();
 if(practice&&practice.run.item.id.startsWith('gamble-')){showScene('gamble',{stake:state.gamble});return;}
 scene=null;flowNext();updateControls();
}
function showScene(kind,extra={}){
 scene={kind,stage:'trigger',t:now(),stageT:now(),...extra};status=TITLES[kind]+' · SIGNAL CONFIRMED';sound('count');stopAuto();revision++;
}
function enterStage(stage){if(!scene)return;scene.stage=stage;scene.stageT=now();revision++;updateControls();}
function flowNext(){
 if(spinning||scene)return;
 if(pendingPresentation.length){const next=pendingPresentation.shift();showScene(next.kind,next);return;}
 const f=engine().feature(state);if(f){showScene(f.type==='vault'?'pick':'chain',{roundId:f.roundId});return;}
 if(state.freeActive){
  if(!freeIntroShown){showScene('free');return;}
  if(state.free>0){scene={kind:'free',stage:'play',t:now(),stageT:now()};scheduleFree();return;}
  const result=engine().endFree(state);if(result){save();scene={kind:'free',stage:'summary',t:now(),stageT:now(),amount:result.total,detail:result.count+' free spins completed · all wins 2×',count:result.count};sound('win');return;}
 }
 if(practice){finishLabIfDone();return;}
 if(autoLeft>0){autoTimer=setTimeout(()=>{if(active&&!panelName&&!document.hidden){autoLeft--;commitSpin();}},state.turbo?220:850);}
}
function scheduleFree(){clearTimeout(freeTimer);freeTimer=setTimeout(()=>{if(active&&!panelName&&scene?.kind==='free'&&scene.stage==='play'&&!spinning)commitSpin(true);},state.turbo||state.reduced?120:650);}
function startScene(){
 if(!scene)return;
 if(scene.stage==='summary'){dismissSummary();return;}
 if(scene.stage==='trigger'){enterStage('intro');return;}
 if(scene.stage!=='intro')return;
 enterStage('play');
 if(scene.kind==='free'){freeIntroShown=true;scheduleFree();}
 if(scene.kind==='jackpot')sound('launch');
}
function featureAction(){
 if(!scene)return;
 if(scene.stage==='trigger'||scene.stage==='intro'||scene.stage==='summary'){startScene();return;}
 if(scene.kind==='pick'){const f=engine().feature(state);if(f)pickSeat(Array.from({length:9},(_,i)=>i).find(i=>!f.picks.includes(i)));}
 if(scene.kind==='chain')respin();
 if(scene.kind==='gamble'&&!scene.reveal)gamble('odd');
}
function pickSeat(index){
 if(scene?.kind!=='pick'||scene.stage!=='play'||scene.reveal)return;
 const r=engine().pick(state,index);if(!r)return;save();scene.reveal={index,amount:r.amount,t:now()};sound('lock');status='SEAT '+(index+1)+' CONFIRMED · '+fmt(r.amount);
}
function respin(){
 if(scene?.kind!=='chain'||scene.stage!=='play'||scene.respin)return;
 const f=engine().feature(state);if(!f)return;
 if(engine().featureDone(f)){collectFeature();return;}
 scene.respin={t:now(),duration:state.turbo||state.reduced?260:1000};sound('launch');status='BONDING CURVE · VERIFYING NEW BUYS';
}
function collectFeature(){
 const f=engine().feature(state);if(!f||!engine().featureDone(f))return;
 const detail=f.type==='vault'?'3 capsule seats opened':f.frames.at(-1).cells.filter(Boolean).length+' curve steps locked · '+(f.frames.length-1)+' respins';
 const r=engine().collect(state);if(!r)return;save();scene.amount=r.amount;scene.detail=detail;scene.jackpotWin=r.jackpotWin;enterStage('summary');sound('win');
 if(r.jackpotWin){casinoJackpot.settle(f.bet);pendingPresentation.push({kind:'jackpot',amount:r.jackpotWin,detail:'All fifteen curve steps locked. Target reached.'});}
}
function dismissSummary(){
 if(!scene)return;const kind=scene.kind;
 if(practice)practice.summaries.push({kind,amount:scene.amount||0,detail:scene.detail||''});
 if(kind==='free')freeIntroShown=false;
 scene=null;flowNext();updateControls();
}
function skipScene(){
 if(!scene||spinning)return;
 if(scene.kind==='free'){
  freeIntroShown=true;clearTimeout(freeTimer);
  let guard=0;
  while(state.freeActive&&guard++<1000){
   while(engine().feature(state)){const f=engine().feature(state);if(f.type==='vault'){for(let i=0;f.picks.length<3&&i<9;i++)engine().pick(state,i);}else while(!engine().featureDone(f))engine().respin(state);engine().collect(state);}
   if(!state.free){const end=engine().endFree(state);scene={kind:'free',stage:'summary',stageT:now(),t:now(),amount:end.total,detail:end.count+' free spins completed · same committed engine results',count:end.count};break;}
   const p=engine().start(state,practice?practice.run.nextRng():undefined);p.jackpot={level:p.bet,hit:engine().evaluate(p.grid,p.bet,2).jackpot||p.features.some(f=>f.type==='chain'&&f.full)};save();engine().settle(state);if(practice){state.history[0].kind='LAB · Free spin';state.history[0].lab=practice.run.item.id;}
  }
  save();settledArt=chooseArt(state.grid);sound('win');
 }else if(scene.kind==='pick'||scene.kind==='chain'){
  const f=engine().feature(state);if(!f)return;
  if(f.type==='vault'){for(let i=0;f.picks.length<3&&i<9;i++)engine().pick(state,i);}else while(!engine().featureDone(f))engine().respin(state);
  scene.reveal=null;scene.respin=null;save();collectFeature();
 }else if(scene.kind==='jackpot'){enterStage('summary');}
 else if(scene.kind==='gamble'){if(scene.reveal){scene.amount=scene.reveal.result.amount;scene.detail=scene.reveal.result.win?'Call confirmed · doubled':'Call missed · stake lost';enterStage('summary');}else toast('Choose APE or FADE to resolve this even bet.');}
 updateControls();
}
function gamble(choice){
 if(!active||spinning||engine().feature(state)||state.freeActive||!state.gamble)return;
 if(scene&&scene.kind!=='gamble')return;
 if(!scene){scene={kind:'gamble',stage:'play',t:now(),stageT:now(),stake:state.gamble};}
 if(scene.reveal)return;
 const r=engine().gamble(state,choice,practice?practice.run.gambleRng(choice):undefined);if(!r)return;
 // The reveal is immutable and recorded before the coin / flight-path animation.
 state.history.unshift({id:'gamble-'+Date.now(),time:Date.now(),kind:practice?'LAB · Gamble':'Gamble',bet:0,win:r.amount,stake:r.stake,net:r.win?r.stake:-r.stake,feature:'Ape or Fade · '+(r.win?'win':'loss')});state.history=state.history.slice(0,50);save();
 scene.stage='play';scene.reveal={result:r,t:now(),choice};sound('count');
}
function finishLabIfDone(){
 if(!practice||phaseBusy())return;
 if(state.gamble>0&&practice.run.item.id.startsWith('gamble-'))return;
 if(runQueue.length){runAllResults.push({item:practice.run.item.id,bet:state.bet,seed:practice.run.seed,balance:state.balance,summaries:copy(practice.summaries)});const epoch=previewEpoch;clearTimeout(previewTimer);previewTimer=setTimeout(()=>{if(practice&&epoch===previewEpoch&&runQueue.length)runLab(runQueue.shift(),true);},350);}
 else if(practice.runAll&&!practice.reported){practice.reported=true;runAllResults.push({item:practice.run.item.id,bet:state.bet,seed:practice.run.seed,balance:state.balance,summaries:copy(practice.summaries)});toast('Run all complete · '+runAllResults.length+' practice scenarios. LAYR unchanged.');openPanel('labResults');}
}
function runLab(id,continueAll=false){
 if(!TEST&&id==='fund'){openPanel('fund');return;}
 if(!practice&&phaseBusy()){toast('Finish this round before entering Bonus preview.');return;}
 const betInput=$('labBet'),seedInput=$('labSeed'),randomInput=$('labRandom');
 const level=Number(betInput?.value||lastLab?.bet||state.bet),seed=randomInput?.checked?String(crypto.getRandomValues(new Uint32Array(1))[0]):String(seedInput?.value||lastLab?.seed||'launchpad22');
 if(!continueAll){runQueue=[];runAllResults=[];}
 previewEpoch++;clearTimeout(previewTimer);
 if(!practice){liveState=state;stopAuto();}
 clearTimeout(freeTimer);closePanel();scene=null;spinning=false;anim=null;pendingPresentation=[];freeIntroShown=false;
 const run=LaunchpadLab.createRun(id,level,seed,PX_PURE);
 practice={run,started:false,summaries:[],spinResults:[],runAll:continueAll||runQueue.length>0};
 state=run.state;state.muted=liveState.muted;state.volume=liveState.volume;state.turbo=liveState.turbo;state.reduced=liveState.reduced;
 lastLab={id,bet:level,seed};document.body.classList.add('practice');status='BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR';
 settledArt=chooseArt(state.grid);
 if(id==='fund'){openPanel('fund');if(continueAll){const epoch=previewEpoch;previewTimer=setTimeout(()=>{if(practice&&epoch===previewEpoch){closePanel();scene=null;finishLabIfDone();}},1500);}}
 else commitSpin();
 updateControls();
}
function runAll(){const ids=LaunchpadLab.items.map(x=>x.id);const rest=ids.slice(1);runLab(ids[0]);runQueue=rest;practice.runAll=true;toast('Run all · each scene can be played, or use Skip and Continue.');}
function exitPreview(){
 if(!practice)return;
 previewEpoch++;clearTimeout(previewTimer);
 clearTimeout(freeTimer);clearTimeout(autoTimer);scene=null;spinning=false;anim=null;pendingPresentation=[];runQueue=[];
 state=liveState;liveState=null;practice=null;freeIntroShown=false;document.body.classList.remove('practice');
 settledArt=chooseArt(state.grid);status='LIVE TEST ACCOUNT RESTORED · PREVIEW CHANGED NOTHING';closePanel();updateControls();
}
function featureLabel(){
 if(!scene)return '';
 if(scene.stage==='trigger')return 'VIEW '+TITLES[scene.kind];
 if(scene.stage==='intro')return 'START '+TITLES[scene.kind];
 if(scene.stage==='summary')return 'CONTINUE · '+fmt(scene.amount||0);
 if(scene.kind==='pick'){const f=engine().feature(state);return 'OPEN A SEAT · '+(3-(f?.picks.length||0))+' LEFT';}
 if(scene.kind==='chain'){const f=engine().feature(state);return scene.respin?'RESPINNING…':'RESPIN · '+(f?.frames[f.index].left||0)+' LEFT';}
 if(scene.kind==='gamble')return scene.reveal?'REVEALING…':'CHOOSE APE OR FADE';
 return '';
}
function controlsHTML(){return $('fullControls').innerHTML;}
function updateControls(){
 document.querySelectorAll('[data-read]').forEach(el=>{const k=el.dataset.read;el.textContent=k==='bet'?fmt(bet()):k==='balance'?fmt(state.balance):practice?'PRACTICE':'LAYR';});
 document.querySelectorAll('[data-action]').forEach(el=>{const a=el.dataset.action;el.classList.toggle('active',a==='auto'&&autoLeft>0||a==='turbo'&&state.turbo||a==='sound'&&!state.muted);if(a==='spin')el.disabled=phaseBusy()||state.balance<state.bet;if(a==='betDown')el.disabled=phaseBusy()||state.bet===20;if(a==='betUp')el.disabled=phaseBusy()||state.bet===500;});
 const canGamble=state.gamble>0&&!spinning&&!state.freeActive&&!engine().feature(state)&&(!scene||scene.kind==='gamble'&&!scene.reveal);
 $('apeControl').hidden=!canGamble;$('fadeControl').hidden=!canGamble;$('collectControl').hidden=!canGamble||!!scene;
 $('featureControl').hidden=!featureLabel();$('featureControl').textContent=featureLabel();$('featureControl').disabled=scene?.stage==='play'&&(!!scene?.reveal||!!scene?.respin);
 $('skipControl').hidden=!scene||scene.stage==='summary'||scene.kind==='gamble'&&!scene.reveal;$('exitPracticeControl').hidden=!practice;
 document.querySelectorAll('[data-test-only]').forEach(el=>el.hidden=!TEST);
 document.querySelectorAll('[data-input="volume"]').forEach(el=>el.value=state.volume);
 measureControls();
}
function measureControls(){if(fsOn)document.documentElement.style.setProperty('--controls-height',$('fullControls').getBoundingClientRect().height+'px');}
new ResizeObserver(measureControls).observe($('fullControls'));
function closePanel(){panelName='';$('panelLayer').hidden=true;$('panelBody').innerHTML='';if(savedPanelFocus?.isConnected)savedPanelFocus.focus();savedPanelFocus=null;if(scene?.kind==='free'&&scene.stage==='play'&&!spinning)scheduleFree();}
function openPanel(name){
 stopAuto();clearTimeout(freeTimer);panelName=name;savedPanelFocus=document.activeElement;$('panelLayer').hidden=false;
 const titles={pays:'The flight manual',fair:'Fair Play',history:'Flight log',fund:'The Machine Fund',preview:'Bonus preview',lab:'Bonus Lab',test:'Systems test',labResults:'Run all · results',sources:'Artwork & snapshot'};
 $('panelTitle').textContent=titles[name]||name;
 let html='';
 if(name==='pays'){
 html='<p>Five reels. Twenty fixed paylines. Match at least three symbols from the left. Every spin is settled by the shared Block Fortune v2 engine.</p><table><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>'+Object.entries(PX_PURE.pays).map(([k,p])=>'<tr><td>'+NAMES[k]+'</td>'+p.map(n=>'<td>'+n+'×</td>').join('')+'</tr>').join('')+'</tbody></table><p class="subtle">Line pays multiply the line bet: total bet ÷ 20. STX is wild. All wagers and prizes here use LAYR play credits; the ±STX deck labels are the machine’s theme.</p><h2>Three ways to launch</h2><p><b>Launch Window:</b> 3 / 4 / 5 Countdowns pay 2× / 5× / 10× total bet, then 8 free spins at 2×. Retriggers add 4, capped at 24.</p><p><b>Pre-launch Seats:</b> 3+ Seats open a capsule. Choose 3 of 9. Each prize is drawn independently from 1, 2, 2, 3, 4, 5, 8, 10 or 15× total bet.</p><p><b>Graduation:</b> 5+ Curve Steps lock. Each empty cell has a 1-in-25 chance per respin to lock for 1, 2, 3, 5 or 10× bet. Three respins; a new lock resets to three. Fill all 15 for the Casino Jackpot too.</p><p><b>Graduation Day:</b> five Moonshots on the centre row, with no wild substitution, win the Casino Jackpot. After a paid base win with no feature, APE or FADE offers one 50/50 double-or-nothing gamble.</p><div class="row"><button class="primary" data-action="preview">Try every bonus · practice chips</button><button data-action="fair">Fair Play</button><button data-action="sources">Artwork & snapshot</button></div>';
 }else if(name==='fair'){
 html='<div class="callout"><b>94.38% design estimate — not a certified RTP.</b><br>All players use identical maths, regardless of what they hold.</div><table><thead><tr><th>COMPONENT</th><th>DESIGN RETURN</th></tr></thead><tbody>'+[['Line wins','59.7%'],['Scatter pays','1.5%'],['Free spins','8.5%'],['Pre-launch Seats','11.9%'],['Graduation respins','10.3%'],['Casino Jackpot','2.4%']].map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table><p>Rounded components total 94.3%; the supplied unrounded design estimate is 94.38%. Free spins and picks each occur about once in 140 paid spins, respins about once in 290, and the jackpot about once in 113,000. The gamble is an even 50/50 bet and does not add house edge.</p><p>The Casino Jackpot is shared by every machine and pays whoever hits it. This isolated test build uses the engine’s local meters until the Casino Service is connected. Seeds are 500× bet, with 2% of each paid bet added.</p><p>The Machine Fund is 1% of paid bets, taken from the house’s share. It never reduces a player’s win. No token holding, wallet link, or twin is required to play or win.</p><p>Results and feature prizes are committed before animation. Artwork selection uses a separate random source. Reloading resumes a committed round; it does not reroll it.</p>';
 }else if(name==='fund'){
 const f=fundState();html='<div class="eyebrow">TYPE W · FLOOR-WIDE · WEEKLY</div><div class="metricGrid"><div class="metric"><b>'+fmt(f.balance)+'</b><span>LAYR accrued in this test</span></div><div class="metric"><b>Checking</b><span>Last period’s pay per twin</span></div><div class="metric"><b>Checking</b><span>Verified eligible twin count</span></div></div><p><b>One share per Forever Twin in any live collection.</b> Each week, 1% of this machine’s paid bets comes from the house edge into this fund. Nothing is taken from a player’s prize.</p><p>A qualifying wallet must hold a sealed twin at both the period’s first block and snapshot block. Shares count inscriptions, not wallets. Holders claim their own share; unclaimed shares roll into the next period.</p><p>The period ends <b>'+esc(new Date(f.periodEnd).toUTCString())+'</b>. A verified service will supply the snapshot block, eligible count and last payout. Unavailable reads stay <b>checking</b>, never zero.</p><div class="callout">Display-only testnet stub. No claim transaction or payment is connected. The reel tokens are artwork only and earn no special share. You need no twin or token to play, win, or hit the Casino Jackpot.</div><p><a href="https://xtrata.xyz/forever-twins/" target="_blank" rel="noopener">Explore Forever Twins on Xtrata ↗</a></p>';
 }else if(name==='history'){
 html='<p>'+(practice?'Every entry below is a LAB practice result. Your LAYR flight log remains untouched.':'The last 50 committed results from this standalone play account.')+'</p><div class="records"><table><thead><tr><th>ROUND</th><th>BET</th><th>PAID</th><th>EVENT</th></tr></thead><tbody>'+state.history.map(h=>'<tr><td>'+esc(h.kind)+'<br><small>'+esc(h.id?.slice(0,10))+'</small></td><td>'+fmt(h.bet)+'</td><td>'+fmt(h.win)+'</td><td>'+esc(h.feature?.replace(/GENESIS BLOCK/g,'GRADUATION DAY').replace(/CHAIN/g,'GRADUATION').replace(/VAULT/g,'SEATS').replace(/FREE SPINS/g,'LAUNCH WINDOW'))+'</td></tr>').join('')+'</tbody></table></div>'+(state.history.length?'':'<p>No flights yet. Pull the lever or press LAUNCH.</p>');
 }else if(name==='preview'||name==='lab'){
 html='<div class="callout">BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR<br>Try every feature using a separate state and pristine engine. Your balance, spin count, fund and jackpot meters are restored unchanged on exit.</div><div class="row"><label>Bet <select id="labBet">'+PX_PURE.bets.map(b=>'<option value="'+b+'"'+(b===(lastLab?.bet||state.bet)?' selected':'')+'>'+b+'</option>').join('')+'</select></label><label>Seed <input id="labSeed" value="'+esc(lastLab?.seed||'launchpad22')+'" size="15"></label><label><input type="checkbox" id="labRandom"> Random</label></div><div class="scenarioGrid">'+LaunchpadLab.items.map(it=>'<button class="scenario'+(selectedLab===it.id?' selected':'')+'" data-scenario="'+it.id+'">'+esc(it.title)+'<small>'+esc(it.description)+'</small></button>').join('')+'</div><div class="row"><button class="primary" data-lab-run>RUN SELECTED</button><button data-lab-replay'+(!lastLab?' disabled':'')+'>REPLAY LAST</button><button data-lab-all>RUN ALL</button>'+(practice?'<button data-action="exitPreview">EXIT PREVIEW</button>':'')+'</div><p class="subtle">Scenes use the engine’s own start(state, rng). Skipping opens the next unselected seats in order and reveals the same committed respins. No forced outcome can reach the real play account.</p>';
 }else if(name==='settings'){
 html='<div class="row"><button data-action="sound">Toggle sound</button><button data-action="turbo">Toggle turbo</button></div><label>Volume <input type="range" min="0" max="1" step=".05" data-input="volume" value="'+state.volume+'"></label><label><input id="reduceMotion" type="checkbox"'+(state.reduced?' checked':'')+'> Reduced motion</label>';
 }else if(name==='gamble'){
 html='<p>Call APE or FADE for an even chance to double your win of '+fmt(state.gamble)+' LAYR.</p><div class="row"><button data-action="ape">APE</button><button data-action="fade">FADE</button><button data-action="collect">Keep win</button></div>';
 }else if(name==='test'){
 if(!TEST){closePanel();return;}
 html='<div class="callout">STANDALONE TEST HOST · PLAY MONEY ONLY</div><div class="row"><button data-reset-test>Reset play balance to 10,000</button><button data-action="lab">Open Bonus Lab</button></div><label><input id="reduceMotion" type="checkbox"'+(state.reduced?' checked':'')+'> Reduced motion</label><label>Twin reader state <select id="twinState"><option>checking</option><option>none</option><option>some</option><option>all</option></select></label><p class="subtle">Launchpad has no twin artwork on its reels, so NOT YET FOREVER styling is not applicable. This display switch never affects gameplay, odds or real counts.</p><h2>RTP simulation</h2><p>Run the unchanged engine in a separate worker. This does not touch your balance.</p><div class="row"><select id="rtpCount"><option value="10000">10,000 paid rounds</option><option value="100000" selected>100,000 paid rounds</option><option value="5000000">5,000,000 paid rounds</option></select><button data-rtp>RUN SIMULATION</button></div><pre id="rtpResult">No in-browser run yet. Full two-seed results are in RESULTS.md.</pre><h2>Committed state</h2><pre>'+esc(JSON.stringify({practice:!!practice,spins:state.spins,wagered:state.wagered,pendingId:state.pending?.id||null,engineVersion:state.version,mode:LAYR.mode},null,2))+'</pre>';
 }else if(name==='labResults'){
 html='<p>Every run used practice chips. The real LAYR account was never passed into the scenario engine.</p><table><thead><tr><th>ITEM</th><th>FEATURE SUMMARIES</th></tr></thead><tbody>'+runAllResults.map(r=>'<tr><td>'+esc(r.item)+'</td><td>'+r.summaries.map(s=>esc(s.kind)+': '+fmt(s.amount)).join(' · ')+'</td></tr>').join('')+'</tbody></table><div class="row"><button data-action="exitPreview" class="primary">Restore my play account</button><button data-action="lab">Return to Lab</button></div>';
 }else if(name==='sources'){
 html='<p>Reel art uses exact token contracts and original metadata images. Snapshot date: <b>'+esc(artConfig.snapshot||'2026-11-03')+'</b>. Rankings cover the retrieved STX.City dataset by its reported volume field. They are not a combined-platform ranking or a live price feed.</p><table><thead><tr><th>ROLE</th><th>ORIGINAL ASSET</th></tr></thead><tbody>'+Object.entries(artConfig.symbols||{}).map(([k,items])=>'<tr><td>'+NAMES[k]+'</td><td>'+(Array.isArray(items)?items:[items]).map(i=>esc(i.name)+'<br><small>'+esc(i.contract||i.txid||i.source||'Official artwork')+'</small>').join('<br>')+'</td></tr>').join('')+'</tbody></table><p>Faktory Seats use historical contract records and do not imply a currently available seat. Unavailable values are labelled. Third-party logo permissions and Jim’s final token selection remain open before public release. Full provenance is in art/sources.json.</p>';
 }
 $('panelBody').innerHTML=html;$('closePanel').focus();revision++;
}
function runRTP(){
 if(!TEST)return;const out=$('rtpResult'),n=Number($('rtpCount').value);out.textContent='Running '+fmt(n)+' paid rounds…';
 const source=$('engineSource').textContent+'\n'+LaunchpadLab.seeded.toString()+'\n'; // worker uses an independent deterministic generator below.
 const workerBody=$('engineSource').textContent+'\nself.onmessage=function(e){const n=e.data.n;let a=20261103;const rng=n=>{a=(Math.imul(a,1664525)+1013904223)>>>0;return Math.floor(a/4294967296*n)};const s=BF.fresh();s.balance=1e15;s.bet=100;for(let i=0;i<n;i++){BF.start(s,rng);BF.settle(s);let guard=0;while((s.features.length||s.freeActive)&&guard++<1000){while(s.features.length){const f=BF.feature(s);if(f.type==="vault"){BF.pick(s,0);BF.pick(s,1);BF.pick(s,2)}else while(!BF.featureDone(f))BF.respin(s);BF.collect(s)}if(s.free){BF.start(s,rng);BF.settle(s)}else BF.endFree(s)}if(i%10000===0)postMessage({progress:i/n})}postMessage({done:true,n,rtp:100*s.paidOut/s.wagered,paid:s.paidOut,wagered:s.wagered})};';
 const uri=URL.createObjectURL(new Blob([workerBody],{type:'application/javascript'})),w=new Worker(uri);
 w.onmessage=e=>{if(!$('rtpResult')){if(e.data.done){w.terminate();URL.revokeObjectURL(uri);}return;}if(e.data.done){$('rtpResult').textContent=fmt(e.data.n)+' paid rounds\nObserved RTP: '+e.data.rtp.toFixed(4)+'%\nDesign estimate: 94.38% (sampling variation applies)\nPractice worker only; account unchanged.';w.terminate();URL.revokeObjectURL(uri);}else $('rtpResult').textContent='Running… '+Math.round(e.data.progress*100)+'%';};
 w.onerror=e=>{if($('rtpResult'))$('rtpResult').textContent='Simulation unavailable: '+e.message;w.terminate();URL.revokeObjectURL(uri);};w.postMessage({n});
}
function action(name,value){
 if(!active)return;
 name=({fairplay:'fair',primary:'feature',account:'fund',holder:'fund'})[name]||name;
 if(name==='settings'){openPanel('settings');return;}
 if(name==='gamble'){if(state.gamble&&!phaseBusy()){openPanel('gamble');}return;}
 if(name==='max'){if(!phaseBusy()){state.bet=PX_PURE.bets.at(-1);save();updateControls();}return;}
 if(name==='lab'||name==='preview'){if(name==='lab')press('lab');if(!practice&&phaseBusy()){toast('Finish the current flight before entering preview.');return;}openPanel(TEST&&name==='lab'?'lab':'preview');return;}
 if(['pays','fair','history','fund','test','sources'].includes(name)){if(name==='pays')press('pays');openPanel(name);return;}
 if(name==='fullscreen'){requestFullscreen(true);return;}if(name==='fullscreenExit'){requestFullscreen(false);return;}
 if(name==='exitPreview'){exitPreview();return;}if(name==='skip'){skipScene();return;}if(name==='feature'){featureAction();return;}
 if(name==='ape'||name==='fade'){if(panelName==='gamble')closePanel();gamble(name==='ape'?'odd':'even');return;}
 if(name==='collect'){if(state.gamble&&!phaseBusy()){state.gamble=0;save();if(panelName==='gamble')closePanel();toast('Win kept in your balance.');updateControls();}return;}
 if(name==='volume'){state.volume=Math.max(0,Math.min(1,Number(value)||0));if(master)master.gain.value=state.muted?0:state.volume;save();updateControls();return;}
 if(name==='sound'){state.muted=!state.muted;if(master)master.gain.value=state.muted?0:state.volume;save();updateControls();return;}
 if(name==='turbo'){state.turbo=!state.turbo;save();updateControls();return;}
 if(name==='auto'){
  if(autoLeft){stopAuto();return;}if(phaseBusy()||practice){toast('Auto is available between regular flights.');return;}
  autoLeft=24;press('auto');commitSpin();updateControls();return;
 }
 if(name==='betUp'||name==='betDown'){if(phaseBusy())return;const i=PX_PURE.bets.indexOf(state.bet),next=Math.max(0,Math.min(4,i+(name==='betUp'?1:-1)));state.bet=PX_PURE.bets[next];press(name);save();updateControls();return;}
 if(name==='spin'||name==='lever'){if(commitSpin()){press('spin');if(name==='lever')leverStart=now();}return;}
}
function requestFullscreen(on){stopAuto();if(fsHost){fsHost(!!on);return;}setFullscreenLayout(on);if(on){document.documentElement.requestFullscreen?.().catch(()=>{});}else if(document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}}
function setFullscreenLayout(on){fsOn=!!on;document.body.classList.toggle('fullscreen',fsOn);updateControls();requestAnimationFrame(measureControls);return fsOn;}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&fsOn&&!fsHost)setFullscreenLayout(false);});
$('closePanel').onclick=closePanel;
document.addEventListener('click',e=>{
 const pick=e.target.closest('[data-pick]');if(pick){if(active)pickSeat(Number(pick.dataset.pick));return;}
 const a=e.target.closest('[data-action]');if(a){action(a.dataset.action);return;}
 const s=e.target.closest('[data-scenario]');if(s){selectedLab=s.dataset.scenario;document.querySelectorAll('.scenario').forEach(b=>b.classList.toggle('selected',b===s));return;}
 if(e.target.closest('[data-lab-run]'))runLab(selectedLab);
 if(e.target.closest('[data-lab-replay]')&&lastLab){const r={...lastLab};$('labBet').value=r.bet;$('labSeed').value=r.seed;$('labRandom').checked=false;runLab(r.id);}
 if(e.target.closest('[data-lab-all]'))runAll();
 if(e.target.closest('[data-reset-test]')&&TEST){if(practice)exitPreview();if(phaseBusy()){toast('Finish the current round before resetting.');return;}window.parent.ParallaxLAYRAccount.reset();state=LAYR.openGame(GAME_ID,E);settledArt=chooseArt(state.grid);closePanel();toast('Play account reset to 10,000 LAYR.');updateControls();}
 if(e.target.closest('[data-rtp]'))runRTP();
 if(e.target===$('panelLayer'))closePanel();
});
document.addEventListener('input',e=>{if(e.target.dataset.input==='volume'){state.volume=Number(e.target.value);if(master)master.gain.value=state.muted?0:state.volume;save();}});
document.addEventListener('change',e=>{if(e.target.id==='reduceMotion'){state.reduced=e.target.checked;save();}if(e.target.id==='twinState')toast('Display test: '+e.target.value+'. Live twin count remains checking.');});
document.addEventListener('keydown',e=>{
 if(e.code==='Escape'){if(panelName)closePanel();else if(fsOn)requestFullscreen(false);return;}
 if(e.key==='Tab'&&panelName){const els=[...$('panel').querySelectorAll('button:not(:disabled),input,select,a[href]')].filter(x=>!x.hidden);if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0]?.focus();}return;}
 if(e.target.matches('input,select,textarea'))return;
 if(e.code==='Space'&&!fsOn){e.preventDefault();if(!panelName)action('spin');}
 if(e.code==='KeyF'){e.preventDefault();requestFullscreen(!fsOn);}
 if(e.code==='KeyL'&&TEST){e.preventDefault();action('lab');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAuto();});
screen.addEventListener('pointerup',e=>{const r=screen.getBoundingClientRect(),scale=Math.min(r.width/1400,r.height/960),w=1400*scale,h=960*scale;screenTap((e.clientX-r.left-(r.width-w)/2)/scale,(e.clientY-r.top-(r.height-h)/2)/scale);});
function screenTap(x,y){if(!active||panelName)return;const h=[...hitboxes].reverse().find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);if(h)h.fn();}
function rr(x,y,w,h,r,fill,stroke,line=1){sg.beginPath();sg.roundRect(x,y,w,h,r);if(fill){sg.fillStyle=fill;sg.fill();}if(stroke){sg.strokeStyle=stroke;sg.lineWidth=line;sg.stroke();}}
function text(s,x,y,size,color=cream,align='left',weight='600',font='Arial'){sg.fillStyle=color;sg.font=weight+' '+size+'px '+font;sg.textAlign=align;sg.textBaseline='middle';sg.fillText(String(s),x,y);}
function line(x1,y1,x2,y2,color,width=1){sg.beginPath();sg.moveTo(x1,y1);sg.lineTo(x2,y2);sg.strokeStyle=color;sg.lineWidth=width;sg.stroke();}
function circle(x,y,r,fill,stroke){sg.beginPath();sg.arc(x,y,r,0,Math.PI*2);if(fill){sg.fillStyle=fill;sg.fill();}if(stroke){sg.strokeStyle=stroke;sg.stroke();}}
function drawImageContain(im,x,y,w,h){if(!im?.complete||!im.naturalWidth)return false;const s=Math.min(w/im.naturalWidth,h/im.naturalHeight);sg.drawImage(im,x+(w-im.naturalWidth*s)/2,y+(h-im.naturalHeight*s)/2,im.naturalWidth*s,im.naturalHeight*s);return true;}
function clipLabel(s,n=22){return String(s||'').length>n?String(s).slice(0,n-1)+'…':String(s||'');}
function logoTile(sym,item,x,y,w,h,alpha=1){
 sg.save();try{sg.globalAlpha=alpha;
 const gold=sym==='bitcoin',special=['scatter','vault','chain'].includes(sym);
 rr(x,y,w,h,9,gold?'#f7e2a5':special?'#142c38':'#e7ece8',gold?'#ffbe43':'#49616a',gold?3:1);
 if(special){drawDataTile(sym,item,x,y,w,h);}
 else{
  text(sym==='wild'?'WILD':sym==='bitcoin'?'MOONSHOT':sym==='artifact'?'GRADUATE':NAMES[sym].toUpperCase(),x+12,y+17,10,gold?'#624412':'#50656a');
  const im=imageFor(item);const drawn=drawImageContain(im,x+19,y+30,w-38,h-64);
  if(!drawn){text(item?.pending?'ART PENDING':clipLabel(item?.name||NAMES[sym],14),x+w/2,y+h*.49,18,'#183541','center');}
  text(clipLabel(item?.name||NAMES[sym],24),x+w/2,y+h-19,14,'#112832','center','700');
  if(sym==='artifact'){sg.fillStyle='#174b3e';sg.beginPath();sg.moveTo(x+w-27,y+15);sg.lineTo(x+w-10,y+22);sg.lineTo(x+w-27,y+29);sg.lineTo(x+w-44,y+22);sg.closePath();sg.fill();line(x+w-13,y+22,x+w-13,y+36,'#174b3e',2);}
 }
 }finally{sg.restore();}
}
function drawDataTile(sym,item,x,y,w,h){
 const small=h<170;
 text(sym==='scatter'?'COUNTDOWN':sym==='vault'?'FAKTORY SEAT':'CURVE STEP',x+13,y+18,11,'#e3b076');
 if(sym==='scatter'){
  text('T−00',x+w/2,y+h*.46,small?37:48,'#ff9b4b','center','700','monospace');
  text('BLOCK '+(item?.block_height==null?'CHECKING':fmt(item.block_height)),x+w/2,y+h*.68,11,'#d3e2e1','center');
  text((item?.tx_id||'DATA PENDING').slice(0,18)+'…',x+w/2,y+h*.81,9,'#a0b6bd','center','400','monospace');
 }else if(sym==='vault'){
  const im=imageFor(item);if(!drawImageContain(im,x+w*.33,y+31,w*.34,h*.43)){drawSeat(x+w/2,y+h*.47,38,false);}
  text(item?.price_per_seat_sats==null?'HISTORIC · DATA CHECKING':'HISTORIC · '+fmt(item.price_per_seat_sats)+' sats / sBTC',x+w/2,y+h*.74,10,'#b8c8cb','center');
 }else{
  const xx=x+w*.22,yy=y+h*.65;sg.beginPath();sg.moveTo(xx,yy);sg.bezierCurveTo(xx+w*.25,yy-2,xx+w*.44,yy-h*.16,xx+w*.56,yy-h*.39);sg.strokeStyle='#91dbbb';sg.lineWidth=5;sg.stroke();circle(xx+w*.56,yy-h*.39,6,orange);
  text('BUY · BLOCK '+(item?.block_height==null?'CHECKING':fmt(item.block_height)),x+w/2,y+h*.72,10,'#d8e6df','center');
  text((item?.tx_id||'DATA PENDING').slice(0,18)+'…',x+w/2,y+h*.82,9,'#a0b6bd','center','400','monospace');
 }
 text(item?.pending?'DATA PENDING':'SNAPSHOT · '+(artConfig.snapshot||'2026-11-03'),x+w/2,y+h-13,9,'#96aab2','center','400','monospace');
}
function drawSeat(x,y,size,open){
 rr(x-size*.52,y-size*.72,size*1.04,size*1.25,9,open?'#d4e0db':'#294554','#72939e',2);
 rr(x-size*.7,y+size*.35,size*1.4,size*.35,5,'#f97316');line(x-size*.4,y+size*.65,x-size*.5,y+size*.9,'#7b969f',5);line(x+size*.4,y+size*.65,x+size*.5,y+size*.9,'#7b969f',5);
 if(!open){line(x-size*.37,y-size*.45,x+size*.37,y+size*.22,'#8fa5a9',4);line(x+size*.37,y-size*.45,x-size*.37,y+size*.22,'#8fa5a9',4);}
}
function rocket(x,y,scale=1,flame=false){
 sg.save();sg.translate(x,y);sg.scale(scale,scale);
 if(flame){sg.beginPath();sg.moveTo(-17,54);sg.lineTo(0,125+(state.reduced?0:Math.sin(now()/100)*15));sg.lineTo(17,54);sg.fillStyle=orange;sg.fill();sg.beginPath();sg.moveTo(-8,54);sg.lineTo(0,99);sg.lineTo(8,54);sg.fillStyle='#ffe3a3';sg.fill();}
 sg.beginPath();sg.moveTo(-24,25);sg.lineTo(-42,61);sg.lineTo(-22,53);sg.closePath();sg.fillStyle=orange;sg.fill();sg.beginPath();sg.moveTo(24,25);sg.lineTo(42,61);sg.lineTo(22,53);sg.closePath();sg.fill();
 sg.beginPath();sg.moveTo(-24,50);sg.lineTo(-24,-28);sg.quadraticCurveTo(-21,-65,0,-85);sg.quadraticCurveTo(21,-65,24,-28);sg.lineTo(24,50);sg.closePath();sg.fillStyle='#edf0e5';sg.fill();line(-23,28,23,28,orange,12);circle(0,-23,13,'#0c3444','#70919b');circle(-4,-27,4,'#a5e8df');sg.restore();
}
function canvasButton(label,x,y,w,h,fn,primary=false,disabled=false){
 rr(x,y,w,h,8,disabled?'#24343c':primary?orange:'#203a46',disabled?'#3c505a':primary?'#ffb36e':'#6b8792',1.5);
 text(label,x+w/2,y+h/2,18,disabled?'#738892':primary?'#091923':cream,'center','700');
 if(!disabled)hitboxes.push({x,y,w,h,fn});
}
function background(t){
 sg.fillStyle=navy;sg.fillRect(0,0,1400,960);
 const g=sg.createLinearGradient(0,0,1400,960);g.addColorStop(0,'#1b303a');g.addColorStop(.7,'#07131d');g.addColorStop(1,'#1d2c2c');sg.fillStyle=g;sg.fillRect(0,0,1400,960);
 sg.globalAlpha=.17;for(let x=0;x<1400;x+=40)line(x,0,x,960,'#73949b');for(let y=0;y<960;y+=40)line(0,y,1400,y,'#73949b');sg.globalAlpha=1;
 text('PARALLAX  /  MISSION 022',54,40,15,'#93aeb7','left','500','monospace');
 text('LAUNCHPAD',52,106,63,cream,'left','800');
 text('FROM CURVE TO POOL',58,163,14,'#b6c6c7','left','600','monospace');
 if(typeof xtrataLogo==='function')xtrataLogo(sg,540,107,64);
 text(spinning?'T−00:0'+Math.max(0,3-Math.floor(Math.max(0,t-anim.t)/anim.duration*3)):'T−00:03',770,112,35,'#f7aa6c','center','700','monospace');
 text('IGNITION SEQUENCE',770,158,11,'#7899a6','center','500','monospace');
 line(56,190,1344,190,'#47606a');
 text(practice?'PRACTICE JACKPOT':'CASINO JACKPOT',1336,48,13,'#f8ab6c','right','700','monospace');
 text(fmt(casinoJackpot.get(bet())),1336,102,45,'#ffe5ab','right','700','monospace');
 text('LOCAL TEST METER  ·  '+fmt(bet())+' LAYR',1336,151,12,'#829ca6','right','400','monospace');
 if(practice){rr(50,200,1300,26,3,'#f97316');text('BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR',700,213,12,'#08202b','center','700','monospace');}
}
function drawReels(t){
 const grid=spinning?anim.p.grid:state.grid;const gx=56,gy=practice?237:218,cw=246,ch=162,gap=14;
 for(let c=0;c<5;c++)for(let r=0;r<3;r++){
  let sym=grid[c][r],item=(spinning?reelArt:settledArt)[c]?.[r],x=gx+c*(cw+14),y=gy+r*(ch+12);
  if(spinning){const elapsed=Math.max(0,t-anim.t),stopTime=anim.duration*(.45+c*.115);if(elapsed<stopTime){const phase=(elapsed/70+c*3+r)%10;sym=PX_PURE.symbols[Math.floor(phase)];item=options(sym)[0];sg.save();try{sg.beginPath();sg.rect(x,y,cw,ch);sg.clip();const dy=state.reduced?0:Math.sin(elapsed/30)*8;logoTile(sym,item,x,y+dy,cw,ch,.72);}finally{sg.restore();}continue;}}
  logoTile(sym,item,x,y,cw,ch);
 }
 if(!spinning&&lastResult?.wins?.length&&!scene){const w=lastResult.wins[Math.floor(t/1300)%lastResult.wins.length],row=PX_PURE.lines[w.line];sg.save();sg.lineWidth=3;sg.strokeStyle='#ffa257';sg.beginPath();for(let c=0;c<w.count;c++){const x=gx+c*(cw+14)+cw/2,y=gy+row[c]*(ch+12)+ch/2;c?sg.lineTo(x,y):sg.moveTo(x,y);}sg.stroke();sg.restore();}
 text('20 FIXED LINES',56,778,12,'#7695a1','left','500','monospace');text('SNAPSHOT '+(artConfig.snapshot||'2026-11-03')+' · ORIGINAL TOKEN ART',1344,778,12,'#7695a1','right','500','monospace');
}
function drawStatus(){
 rr(54,807,1292,107,9,'#0c202c','#36515d');
 text('BALANCE',77,833,11,'#94adb4','left','700','monospace');text(fmt(state.balance),77,879,33,cream,'left','700','monospace');
 text('BET / '+(practice?'PRACTICE':'LAYR'),498,833,11,'#94adb4','left','700','monospace');text(fmt(bet()),498,879,33,cream,'left','700','monospace');
 text(state.freeActive?'FLIGHT TOTAL':'LAST WIN',887,833,11,'#94adb4','left','700','monospace');text(fmt(state.freeActive?state.freeTotal:state.lastWin),887,879,33,'#f4bd82','left','700','monospace');
 line(458,827,458,894,'#34505b');line(847,827,847,894,'#34505b');
 circle(63,942,4,state.balance>=bet()?mint:orange);text(clipLabel(status,98),78,942,12,'#a3c0c3','left','500','monospace');
 if(!scene&&!spinning&&state.gamble>0){canvasButton('APE',880,706,136,58,()=>gamble('odd'));canvasButton('FADE',1025,706,136,58,()=>gamble('even'));canvasButton('KEEP',1170,706,170,58,()=>action('collect'),true);}
}
function drawBonus(t){
 if(!scene)return;
 const kind=scene.kind,st=scene.stage,dt=t-scene.stageT,calm=state.reduced;
 if(kind==='free'&&st==='play'){
  sg.save();sg.globalAlpha=.10;for(let i=0;i<5;i++){const x=(i*340+(calm?0:t*.015))%1700-160,y=320+i*78;circle(x,y,90,'#b9d5de');circle(x+75,y+10,60,'#b9d5de');}sg.restore();
  rr(480,24,425,56,8,'#1d453d','#71ad93');text(state.free+' FREE SPINS LEFT  ·  2×',692,52,19,'#d6f4d7','center');
  canvasButton('SKIP TO FLIGHT SUMMARY',485,710,430,58,skipScene,false,spinning);return;
 }
 const panelTop=practice?236:207;rr(44,panelTop,1312,787-panelTop,15,'#06131ef4','#76919b',2);
 // Rail, crosshairs and telemetry belong to the launch display, not the result engine.
 for(let i=0;i<8;i++){line(66,244+i*65,78,244+i*65,'#f97316',3);line(1320,244+i*65,1332,244+i*65,'#f97316',3);}
 text(kind==='pick'?'CAPSULE / 09 SEATS':kind==='chain'?'TARGET / 15 LOCKS':kind==='jackpot'?'MISSION / GRADUATED':kind==='gamble'?'CALL / 50 : 50':'FLIGHT / 2× WINS',91,practice?255:237,12,'#f1a26a','left','600','monospace');
 text(TITLES[kind],700,292,43,cream,'center','800');
 if(st==='trigger'||st==='intro'){
  if(kind==='pick'){for(let i=0;i<3;i++)drawSeat(570+i*130,453,58,false);}
  else if(kind==='chain'){for(let i=0;i<9;i++){const x=395+i*76,y=550-(i*i)*2.7;circle(x,y,9,orange);if(i)line(x-76,550-((i-1)*(i-1))*2.7,x,y,'#8bdeb9',4);}text('EVERY CONFIRMED BUY MOVES THE CURVE',700,586,14,'#b6d8cf','center');}
  else if(kind==='gamble'){circle(580,460,68,'#244f3d','#93dcb4');text('APE',580,460,28,cream,'center');circle(820,460,68,'#4b3028','#d58e68');text('FADE',820,460,28,cream,'center');}
  else rocket(700,480,1.08,kind==='jackpot');
  text(RULES[kind],700,622,19,'#bfd1d3','center','400');
  canvasButton(st==='trigger'?'SIGNAL CONFIRMED…':'START '+TITLES[kind],445,672,510,67,startScene,true,st==='trigger');
  if(st==='intro'&&kind!=='gamble')canvasButton('SKIP',1136,683,160,50,skipScene);
  return;
 }
 if(st==='summary'){
  const n=calm?scene.amount:scene.amount*Math.min(1,dt/950);text(kind==='gamble'&&scene.reveal&&!scene.reveal.result.win?'CALL MISSED':'MISSION COMPLETE',700,375,15,orange,'center','700','monospace');
  text(fmt(n||0),700,468,88,'#ffe3a2','center','700','monospace');text(practice?'PRACTICE CHIPS':'LAYR CONFIRMED',700,537,16,'#b8d2d6','center');
  text(scene.detail||'Casino Jackpot credited once to this round.',700,597,18,'#bfd0d0','center','400');
  canvasButton('CONTINUE',489,668,422,68,dismissSummary,true);return;
 }
 if(kind==='pick'){
  const f=engine().feature(state);if(!f)return;text((3-f.picks.length)+' SEATS LEFT TO OPEN',700,337,13,'#9bc3cf','center','600','monospace');
  for(let i=0;i<9;i++){const x=277+(i%3)*300,y=380+Math.floor(i/3)*99,opened=f.picks.includes(i),a=scene.reveal?.index===i?Math.min(1,(t-scene.reveal.t)/420):1;rr(x,y,270,84,12,opened?'#183e3b':'#1a2e3c',opened?'#8bdeb9':'#4b6877',2);drawSeat(x+44,y+42,27,opened);
   if(opened){sg.save();sg.globalAlpha=a;const item=options('artifact')[i%options('artifact').length];drawImageContain(imageFor(item),x+83,y+9,54,54);text(fmt(f.awards[i]*f.bet),x+203,y+37,26,'#ffe1ad','center','700','monospace');text(clipLabel(item.name,19),x+175,y+67,11,'#b7d2cc','center');sg.restore();}
   else{text('SEAT '+String(i+1).padStart(2,'0'),x+170,y+31,17,'#d9e6df','center');text('PRE-LAUNCH',x+170,y+56,10,'#87a5b3','center','400','monospace');hitboxes.push({x,y,w:270,h:84,fn:()=>pickSeat(i)});}
  }
  text('Prizes committed at launch · choose any three',700,724,14,'#8faab7','center');canvasButton('SKIP',1140,710,150,47,skipScene);
 }else if(kind==='chain'){
  const f=engine().feature(state);if(!f)return;const frame=f.frames[f.index],locked=frame.cells.filter(Boolean).length;
  text(locked+' / 15 LOCKED',253,342,15,'#9adebb','center','600','monospace');text(frame.left+' RESPINS LEFT',1140,342,15,'#ffba77','center','600','monospace');
  sg.save();sg.globalAlpha=.18;sg.beginPath();sg.moveTo(135,645);sg.bezierCurveTo(500,644,1000,540,1250,350);sg.strokeStyle=mint;sg.lineWidth=8;sg.stroke();sg.restore();
  for(let i=0;i<15;i++){const x=150+(i%5)*224,y=385+Math.floor(i/5)*87,v=frame.cells[i];const flashing=scene.respin&&(Math.floor((t-scene.respin.t)/75)+i)%5===0;rr(x,y,204,72,9,v?'#21413a':flashing?'#765032':'#122a38',v?mint:'#3d5d6d',v?2:1);
   if(v){text('BUY CONFIRMED',x+102,y+16,9,'#9cd7bd','center','700','monospace');text(fmt(v*f.bet),x+102,y+45,25,'#fff0bd','center','700','monospace');}
   else{text(flashing?'VERIFYING':'AWAITING BUY',x+102,y+36,11,'#7497a8','center','500','monospace');}}
  canvasButton(scene.respin?'CONFIRMING BUYS…':'RESPIN · '+frame.left+' REMAINING',457,680,486,62,respin,true,!!scene.respin);canvasButton('SKIP',1120,687,160,50,skipScene);
 }else if(kind==='jackpot'){
  const p=Math.min(1,dt/(calm?900:4500)),y=calm?430:610-p*380;rocket(430,y,1.1,true);
  const particles=calm?3:28;for(let i=0;i<particles;i++){const x=140+(i*137)%1120,yy=calm?440+i*25:340+((dt*.15+i*47)%340);sg.save();sg.translate(x,yy);sg.rotate(calm?0:t*.001+i);sg.fillStyle=i%2?orange:cream;sg.fillRect(-9,-5,18,10);sg.restore();}
  rr(670,540,540,158,12,'#0b202bf2','#49616a',2);text(fmt(scene.amount*p),940,606,59,'#ffe3a2','center','700','monospace');text('CASINO JACKPOT',940,665,18,'#b7d0d3','center','700');canvasButton('SKIP',1135,709,155,47,skipScene);
 }else if(kind==='gamble'){
  const r=scene.reveal,p=r?Math.min(1,(t-r.t)/1500):0;
  circle(700,455,87,'#243e49','#c99864');sg.save();sg.translate(700,455);sg.scale(calm?1:Math.max(.08,Math.abs(Math.cos(p*Math.PI*6))),1);text(p===1?(r.result.win?'CONFIRMED':'FADED'):'?',0,0,p===1?22:67,p===1?mint:cream,'center');sg.restore();
  text('STAKE '+fmt(scene.stake||r?.result.stake||state.gamble)+' · ONE 50/50 CALL',700,578,16,'#a3c1c6','center');
  if(!r){canvasButton('APE',450,670,240,66,()=>gamble('odd'),true);canvasButton('FADE',710,670,240,66,()=>gamble('even'));}
  else text('REVEALING COMMITTED RESULT',700,693,16,'#e5ad71','center');
 }
}
function tick(){
 // Use the same monotonic clock as spin/scene starts. A RAF frame timestamp
 // may precede an input event in that frame; negative reel phases are invalid.
 const t=now();requestAnimationFrame(tick);if(!active||t-lastDraw<33)return;lastDraw=t;
 if(spinning&&anim){const elapsed=Math.max(0,t-anim.t);const stopped=Math.min(5,Math.max(0,Math.floor((elapsed/anim.duration-.45)/.115)+1));if(stopped>anim.stopped){sound('stop');anim.stopped=stopped;}if(elapsed>=anim.duration)finishSpin();}
 if(scene){
  const dt=t-scene.stageT;
  if(scene.stage==='trigger'&&dt>(state.reduced?250:800))enterStage('intro');
  if(scene?.stage==='intro'&&state.turbo&&scene.kind!=='gamble'&&dt>600)skipScene();
  if(scene.kind==='pick'&&scene.reveal&&t-scene.reveal.t>(state.turbo||state.reduced?180:650)){scene.reveal=null;const f=engine().feature(state);if(f&&engine().featureDone(f))collectFeature();}
  if(scene.kind==='chain'&&scene.respin&&t-scene.respin.t>scene.respin.duration){const fr=engine().respin(state);save();scene.respin=null;if(fr?.added.length)sound('lock');const f=engine().feature(state);if(f&&engine().featureDone(f))collectFeature();else updateControls();}
  if(scene.kind==='jackpot'&&scene.stage==='play'&&dt>(state.reduced||state.turbo?900:4500))enterStage('summary');
  if(scene.kind==='gamble'&&scene.reveal&&scene.stage==='play'&&t-scene.reveal.t>1700){scene.amount=scene.reveal.result.amount;scene.detail=scene.reveal.result.win?'Call confirmed · the stake doubled':'Call missed · the stake was lost';enterStage('summary');sound(scene.reveal.result.win?'win':'lose');}
 }
 hitboxes=[];background(t);drawReels(t);drawBonus(t);drawStatus();if(TEST)renderedScene={kind:scene?.kind||null,stage:scene?.stage||null,frame:++renderFrames};revision++;
 if(t-lastUI>120){lastUI=t;updateControls();}
}
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();
let pxToken=0;
function port(el){
 if(!el)return '';
 for(const n of [el,...el.querySelectorAll('*')]){
  if(!pxSourceTokens.has(n))pxSourceTokens.set(n,String(++pxToken));
  const id=pxSourceTokens.get(n);
  pxSourceElements.set(id,n);
  n.setAttribute('data-px-source',id);
 }
 return el.outerHTML;
}
function roomControls(){
 const bar=$('featureBar'),go=$('fbGo'),picks=$('roomPicks');
 const label=featureLabel();
 bar.hidden=!label;
 go.textContent=label;
 go.disabled=$('featureControl').disabled;
 const f=scene?.kind==='pick'&&scene.stage==='play'?engine().feature(state):null;
 const available=f?Array.from({length:9},(_,i)=>i).filter(i=>!f.picks.includes(i)):[];
 const key=available.join(',');
 if(picks.dataset.seats!==key){
  picks.dataset.seats=key;
  picks.innerHTML=available.map(i=>'<button data-pick="'+i+'">Seat '+(i+1)+'</button>').join('');
 }
 return label?port(bar):'';
}
window.PX_CASINO_ENGINE={
 screen,revision:()=>revision,
 async activate(){
  if(practice)exitPreview();
  if(active&&LAYR.ready())return;
  if(claimPending)return claimPending;
  const epoch=sessionEpoch;
  claimPending=(async()=>{
   const ready=await LAYR.acquire();
   if(epoch!==sessionEpoch||!ready||!LAYR.ready())throw Error(LAYR.error()||'The shared LAYR account is unavailable. Reconnect to play.');
   state=LAYR.openGame(GAME_ID,E);
   state.reduced=state.reduced||initialReduced;
   settledArt=chooseArt(state.grid);
   active=true;
   if(state.pending){const p=state.pending;reelArt=chooseArt(p.grid);spinning=true;anim={t:now(),duration:state.reduced?120:550,p,stopped:0};status='RESUMING COMMITTED ROUND '+p.id.slice(0,8);}
   else if(scene?.kind==='free'&&scene.stage==='play')scheduleFree();
   else if(engine().feature(state)||state.freeActive)flowNext();
   updateControls();
  })().finally(()=>{claimPending=null;});
  return claimPending;
 },
 deactivate(){
  if(spinning)return false;
  stopAuto();
  if(fsOn)setFullscreenLayout(false);
  if(practice)exitPreview();
  clearTimeout(freeTimer);
  if(active)save();
  active=false;sessionEpoch++;
  if(ac)ac.suspend().catch(()=>{});
  return true;
 },
 refreshAccount(){if(practice)exitPreview();updateControls();revision++;},
 action,stopAuto,tap:screenTap,key(code,key){document.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
 closeModal:closePanel,
 click(token){const el=pxSourceElements.get(token);if(el?.isConnected)el.click();},
 input(token,value,checked,event='input'){const el=pxSourceElements.get(token);if(!el?.isConnected)return;el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
 fullscreen:setFullscreenLayout,fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
 dev:TEST,
 mechanics(){
  const t=now(), elapsed=t-leverStart;
  const buttons=Object.fromEntries(['spin','betUp','betDown','auto','pays','lab'].map(k=>[k,t-(capTimes[k]??-Infinity)<150?1:0]));
  return {
   lever:leverStart&&elapsed<900?{id:leverStart,elapsed,duration:900,angle:1.05}:null,buttons,
   lights:scene?.kind==='jackpot'?1:scene?.stage==='trigger'?.65:0,
   scene:scene?scene.kind+':'+scene.stage:'',jackpot:scene?.kind==='jackpot',
   spinZ:null,armZ:null,reduced:!!state.reduced
  };
 },
 ui(){pxSourceElements.clear();return {renderedScene:TEST?renderedScene:undefined,balance:state.balance,bet:bet(),win:state.lastWin,spins:state.spins,spinning,button:'LAUNCH',spinDisabled:phaseBusy()||state.balance<state.bet,betDownDisabled:phaseBusy()||state.bet===20,betUpDisabled:phaseBusy()||state.bet===500,auto:autoLeft>0,turbo:!!state.turbo,muted:!!state.muted,volume:state.volume,reduced:!!state.reduced,scene:scene?scene.kind+':'+scene.stage:'',sceneDetail:scene?{kind:scene.kind,stage:scene.stage}:null,modal:panelName&&!fsOn?port($('panel')):'',modalOpen:!!panelName,panel:panelName,feature:fsOn?'':roomControls(),lab:!!practice,featureLabel:featureLabel(),status,practice:!!practice,fullscreen:fsOn,fund:fundState(),jackpot:casinoJackpot.get(bet()),gamble:state.gamble>0?fmt(state.gamble):'',canGamble:state.gamble>0&&!spinning&&!state.freeActive&&!engine().feature(state)&&(!scene||scene.kind==='gamble'&&!scene.reveal),pendingId:TEST?state.pending?.id||null:undefined,runAllCount:TEST?runAllResults.length:undefined};}
};
window.__bfReady=true;
updateControls();requestAnimationFrame(tick);
if(!HOSTED&&LAYR.mode!=='standalone-test'){setFullscreenLayout(true);window.PX_CASINO_ENGINE.activate().catch(e=>toast(e.message));}
})();
