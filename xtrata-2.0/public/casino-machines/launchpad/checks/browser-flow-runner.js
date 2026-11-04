/* Test-only browser flow checks. Operates the embedded standalone's real UI,
 * and reloads the same QA account. No engine state or outcomes are injected. */
(() => {
 'use strict';
 const items=['free','free-retrigger','pick','chain','chain-full','jackpot','gamble-win','gamble-loss','scatter3','scatter4','scatter5','fund'];
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));let running=false;
 async function waitFor(fn,label,timeout=60000){const t=performance.now();while(performance.now()-t<timeout){try{const r=fn();if(r)return r;}catch(_){}await pause(70);}throw Error('Timed out: '+label);}
 window.runBrowserFlowChecks=async function(outerFrame,notify=()=>{},options={}){
  if(running)throw Error('Browser flow suite already running.');running=true;
  const report={suite:'Launchpad actual-browser flow checks: Run all / reload / reduced motion / RTP Worker',startedAt:new Date().toISOString(),method:'Real DOM controls and public game/account interfaces. Whole embedded standalone reloads preserve srcdoc bytes and QA identifier. The Systems simulation runs in its own Worker through the visible control. No reel/result injection.',checks:[],captures:[],renderErrors:[],errors:[]};
  let host,game,doc,api,account;
  function onRenderError(event){report.renderErrors.push({message:event.message,file:event.filename,line:event.lineno,column:event.colno});}
  function canvasIntegrity(){
   const ctx=api.screen.getContext('2d'),sx=api.screen.width/1400,sy=api.screen.height/960;
   const samples=[100,500,900,1300].map(x=>({x,y:820,rgba:[...ctx.getImageData(Math.round(x*sx),Math.round(820*sy),1,1).data]}));
   return {pass:samples.every(p=>Math.abs(p.rgba[0]-12)<=2&&Math.abs(p.rgba[1]-32)<=2&&Math.abs(p.rgba[2]-44)<=2&&p.rgba[3]===255),samples};
  }
  const tell=label=>{try{notify({label,captures:report.captures.length,completed:report.checks.length});}catch(_){}};
  async function bind(){host=await waitFor(()=>outerFrame.contentWindow?.PX_STUDIO?.diagnostics().ready&&outerFrame.contentWindow,'standalone ready');game=host.document.getElementById('gameFrame').contentWindow;doc=game.document;api=game.PX_CASINO_ENGINE;account=host.ParallaxLAYRAccount;game.addEventListener('error',onRenderError);
   if(host.PX_STANDALONE_TEST!==true||!(outerFrame.dataset.qa||new URLSearchParams(host.location.search).get('qa')))throw Error('An isolated standalone QA account is required.');}
  const ui=()=>api.ui(),snap=()=>JSON.parse(JSON.stringify(account.snapshot()));
  function click(selector){const el=doc.querySelector(selector);if(!el)throw Error('Missing control '+selector);if(el.disabled||el.hidden||!el.getClientRects().length)return false;el.click();return true;}
  const bar=action=>click('#fullControls [data-action="'+action+'"]');
  function close(){if(ui().modalOpen)doc.getElementById('closePanel').click();}
  async function fullscreen(){if(!ui().fullscreen)host.document.getElementById('fullTop').click();await waitFor(()=>ui().fullscreen,'fullscreen control bar');}
  async function setReduced(value){close();bar('test');await waitFor(()=>doc.getElementById('reduceMotion'),'reduced-motion control');const e=doc.getElementById('reduceMotion');e.checked=!!value;e.dispatchEvent(new game.Event('change',{bubbles:true}));close();await pause(100);return ui().reduced===!!value;}
  async function capture(name,stage){const kind=ui().sceneDetail?.kind,previousFrame=ui().renderedScene?.frame||0;await waitFor(()=>{const r=ui().renderedScene;return r&&r.frame>0&&r.kind===kind&&r.stage===stage;},'drawn '+name+' / '+stage,5000);if(stage==='summary')await pause(1050);const thumb=doc.createElement('canvas');thumb.width=1400;thumb.height=960;const g=thumb.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(api.screen,0,0,1400,960);const image=thumb.toDataURL('image/webp',.93);const r={case:name,kind:ui().sceneDetail?.kind||null,stage,width:1400,height:960,sourceWidth:api.screen.width,sourceHeight:api.screen.height,backingWidth:api.screen.width,backingHeight:api.screen.height,mimeType:image.startsWith('data:image/webp')?'image/webp':'image/png',quality:.93,renderedScene:ui().renderedScene,renderIntegrity:canvasIntegrity(),reduced:ui().reduced,image};report.captures.push(r);return r;}
  async function launch(id){close();if(ui().practice){bar('exitPreview');await pause(120);}bar('lab');await waitFor(()=>doc.getElementById('labSeed'),'Lab controls');doc.getElementById('labSeed').value='launchpad22';doc.getElementById('labBet').value='100';doc.getElementById('labRandom').checked=false;click('[data-scenario="'+id+'"]');click('[data-lab-run]');}
  async function drive({runAll=false,captureCase=null,timeout=300000}={}){
   const sequence=[],seen=new Set(),began=performance.now();let lastAction=0,idleSince=0;
   while(performance.now()-began<timeout){
    const u=ui(),s=u.sceneDetail,index=u.runAllCount||0,item=runAll?(items[index]||'finished'):(captureCase||'round');
    if(runAll&&index>=items.length)return {sequence,count:index,complete:true};
    if(u.spinning){idleSince=0;await pause(70);continue;}
    if(!s){
     if(runAll){if(u.panel==='fund'&&!seen.has('fund/info')){seen.add('fund/info');sequence.push({item:'fund',kind:'fund',stage:'info'});tell('Run all · Fund information');}await pause(90);continue;}
     if(!idleSince)idleSince=performance.now();if(performance.now()-idleSince>500)return {sequence,complete:true};await pause(80);continue;
    }
    idleSince=0;const key=item+'/'+s.kind+'/'+s.stage;
    if(!seen.has(key)){if(!canvasIntegrity().pass)throw Error('Incomplete canvas drawing during '+key);seen.add(key);sequence.push({item,kind:s.kind,stage:s.stage,elapsedMs:Math.round(performance.now()-began)});if(s.stage==='summary')lastAction=performance.now();tell((runAll?'Run all · ':'')+item+' / '+s.kind+' / '+s.stage);if(captureCase)await capture(captureCase,s.stage);}
    const current=ui().sceneDetail;if(!current||current.kind!==s.kind||current.stage!==s.stage)continue;
    if(s.stage==='trigger'){await pause(70);continue;}
    if(s.stage==='summary'){if(performance.now()-lastAction<1050){await pause(90);continue;}if(bar('feature'))lastAction=performance.now();await pause(100);continue;}
    if(s.stage==='intro'){if(bar('feature'))lastAction=performance.now();await pause(150);continue;}
    const elapsed=performance.now()-lastAction;
    if(s.kind==='pick'&&elapsed>850){if(bar('feature'))lastAction=performance.now();}
    else if(s.kind==='chain'&&elapsed>(u.turbo?420:1200)){if(bar('feature'))lastAction=performance.now();}
    else if(s.kind==='gamble'&&u.canGamble&&elapsed>180){if(bar(item==='gamble-loss'?'fade':'ape'))lastAction=performance.now();}
    await pause(75);
   }
   throw Error('Flow exceeded '+timeout+'ms at '+JSON.stringify(ui().sceneDetail));
  }
  async function reloadSameEmbeddedPage(){
   const html=outerFrame.srcdoc,qa=outerFrame.dataset.qa,previousDocument=outerFrame.contentDocument;
   if(!html||!qa)throw Error('Reload check requires embedded srcdoc and its stable dataset.qa key.');
   const loaded=new Promise((resolve,reject)=>{const timer=setTimeout(()=>{outerFrame.removeEventListener('load',onload);reject(Error('Standalone reload timed out.'));},60000);function onload(){clearTimeout(timer);outerFrame.removeEventListener('load',onload);resolve();}outerFrame.addEventListener('load',onload);});
   outerFrame.dataset.qa=qa;outerFrame.srcdoc=html;await loaded;await waitFor(()=>outerFrame.contentDocument!==previousDocument,'new standalone document');await bind();
   return {sameQa:outerFrame.dataset.qa===qa,sameHtml:outerFrame.srcdoc===html};
  }
  try{
   await bind();report.renderer=host.PX_STUDIO.diagnostics().renderer;await fullscreen();api.stopAuto();if(ui().practice)bar('exitPreview');close();
   if(ui().sceneDetail||ui().spinning)await drive({timeout:150000});
   if(ui().turbo)bar('turbo');
   const originalReduced=ui().reduced;await setReduced(false);
   if(!options.reducedOnly){
   // Run all from its real Lab button; each feature is played, not skipped.
   tell('Browser Run all · normal-speed full play');const allBefore=snap();
   bar('lab');await waitFor(()=>doc.getElementById('labSeed'),'Run all controls');doc.getElementById('labSeed').value='launchpad22';doc.getElementById('labBet').value='100';doc.getElementById('labRandom').checked=false;click('[data-lab-all]');
   const allFlow=await drive({runAll:true});const allAfter=snap();
   const covered=items.map(id=>({item:id,stages:allFlow.sequence.filter(s=>s.item===id),complete:id==='fund'?allFlow.sequence.some(s=>s.item===id&&s.stage==='info'):['trigger','intro','play','summary'].every(stage=>allFlow.sequence.some(s=>s.item===id&&s.stage===stage))}));
   report.checks.push({name:'Actual-browser Run all',pass:allFlow.count===12&&covered.every(r=>r.complete)&&JSON.stringify(allBefore)===JSON.stringify(allAfter),completed:allFlow.count,accountUnchanged:JSON.stringify(allBefore)===JSON.stringify(allAfter),normalSpeed:!ui().turbo,items:covered,sequence:allFlow.sequence});
   close();if(ui().practice)bar('exitPreview');await pause(150);
   }
   // Reduced motion is selected through Systems, then inherited by practice.
   tell('Reduced-motion jackpot');const reducedApplied=await setReduced(true),reducedBefore=snap();
   const ownGameSource=[...doc.scripts].map(s=>s.textContent).find(s=>s.includes('function drawBonus'))||'';
   const structuralThreeCap=/const\s+particles\s*=\s*calm\s*\?\s*3\s*:\s*28/.test(ownGameSource);
   await launch('jackpot');const reducedFlow=await drive({captureCase:'jackpot-reduced-motion',timeout:30000});
   const reducedCaptures=report.captures.filter(c=>c.case==='jackpot-reduced-motion');if(ui().practice)bar('exitPreview');
   report.checks.push({name:'Actual-browser reduced-motion jackpot',pass:reducedApplied&&structuralThreeCap&&reducedCaptures.every(c=>c.reduced)&&['trigger','intro','play','summary'].every(s=>reducedFlow.sequence.some(x=>x.stage===s))&&JSON.stringify(reducedBefore)===JSON.stringify(snap()),modeApplied:reducedApplied,structuralParticleCap:structuralThreeCap?3:null,particleVerification:'Own game source confirms the calm branch cap of3. Captured frames need visual review; this is not an automated pixel-count measurement.',capturedStages:reducedCaptures.map(c=>c.stage),accountUnchanged:JSON.stringify(reducedBefore)===JSON.stringify(snap())});
   await setReduced(originalReduced);
   if(options.reducedOnly){report.mode='reduced-motion-only';report.pass=report.checks.length===1&&report.checks.every(c=>c.pass)&&report.renderErrors.length===0&&report.captures.every(c=>c.renderIntegrity.pass);report.finishedAt=new Date().toISOString();report.captureCount=report.captures.length;tell(report.pass?'Reduced-motion check PASS':'Reduced-motion check failed');return report;}
   // A genuine random paid spin is committed normally, then the entire
   // standalone is reloaded. The same stored round is recovered without a
   // stale studio reference to the old inner game API or canvas.
   tell('Committing a normal spin, then reloading the same QA account');close();if(ui().turbo)bar('turbo');const beforeSpin=snap(),beforeGame=beforeSpin.games.launchpad;
   if(!bar('spin'))throw Error('Paid spin control was disabled.');
   const pendingState=snap(),pending=pendingState.games.launchpad?.pending;if(!pending)throw Error('No pending outcome was observed before reload.');
   const qa=outerFrame.dataset.qa,firstReload=await reloadSameEmbeddedPage();
   await waitFor(()=>{const s=snap().games.launchpad;return !s.pending&&s.history.some(h=>h.id===pending.id);},'same pending round settled after reload');
   const first=snap(),firstGame=first.games.launchpad,rounds=firstGame.history.filter(h=>h.id===pending.id),record=rounds[0];
   const beforeSpins=beforeGame?.spins||0;const secondReload=await reloadSameEmbeddedPage();await pause(1100);const second=snap(),secondGame=second.games.launchpad;
   const important=s=>({bank:s.bank,spins:s.games.launchpad.spins,wagered:s.games.launchpad.wagered,paidOut:s.games.launchpad.paidOut,jackpots:s.games.launchpad.jackpots,pending:s.games.launchpad.pending,history:s.games.launchpad.history});
   const stable=JSON.stringify(important(first))===JSON.stringify(important(second));
   report.checks.push({name:'Actual-browser mid-spin reload and second reload',pass:firstReload.sameQa&&firstReload.sameHtml&&secondReload.sameQa&&secondReload.sameHtml&&outerFrame.dataset.qa===qa&&rounds.length===1&&firstGame.spins===beforeSpins+1&&JSON.stringify(record.grid)===JSON.stringify(pending.grid)&&stable,pendingRoundId:pending.id,pendingStops:pending.stops,pendingJackpot:pending.jackpot,balanceBefore:beforeSpin.bank,balanceAfterCommit:pendingState.bank,balanceAfterFirstReload:first.bank,balanceAfterSecondReload:second.bank,spinsBefore:beforeSpins,spinsAfterFirstReload:firstGame.spins,spinsAfterSecondReload:secondGame.spins,matchingHistoryEntries:rounds.length,sameGrid:JSON.stringify(record.grid)===JSON.stringify(pending.grid),secondReloadStateUnchanged:stable,firstReload,secondReload,note:'Any naturally triggered feature is completed through normal controls after this single-settlement check and before the RTP Worker baseline. No result is injected or skipped.'});
   // Finish any genuine paid-spin feature before taking the independent
   // simulation baseline. Reload resets fullscreen, so restore its real UI.
   await fullscreen();close();let resumedFlow={sequence:[],complete:true};
   if(ui().sceneDetail||ui().spinning){tell('Completing the naturally triggered round before the Worker check');resumedFlow=await drive({timeout:150000});}
   await waitFor(()=>{const s=snap().games.launchpad;return !ui().sceneDetail&&!ui().spinning&&!s.pending&&!s.features.length&&!s.freeActive;},'paid round idle before Systems RTP');
   tell('Systems RTP Worker · 10,000 paid rounds');
   const workerBefore=snap(),workerStarted=performance.now();let workerError=null,workerText='';
   try{
    if(!bar('test'))throw Error('Systems control was disabled.');
    await waitFor(()=>doc.getElementById('rtpCount')&&doc.querySelector('[data-rtp]'),'Systems RTP controls');
    const count=doc.getElementById('rtpCount');count.value='10000';count.dispatchEvent(new game.Event('change',{bubbles:true}));
    if(count.value!=='10000')throw Error('The 10,000-round option was unavailable.');
    if(!click('[data-rtp]'))throw Error('RTP simulation control was disabled.');
    workerText=await waitFor(()=>{const text=doc.getElementById('rtpResult')?.textContent||'';return /Observed RTP:|Simulation unavailable:|(?:^|\n)(?:Error|Failed)\b/i.test(text)&&text;},'Systems RTP Worker result',90000);
    if(!/Observed RTP:/.test(workerText))workerError=workerText;
   }catch(e){workerError=e.message;workerText=doc.getElementById('rtpResult')?.textContent||workerText;}
   const workerAfter=snap(),workerUnchanged=JSON.stringify(workerBefore)===JSON.stringify(workerAfter);
   const observed=/Observed RTP:\s*([\d.]+)%/.exec(workerText),displayedRounds=/([\d,]+) paid rounds/.exec(workerText);
   const observedRtp=observed?Number(observed[1]):null,paidRounds=displayedRounds?Number(displayedRounds[1].replace(/,/g,'')):null;
   report.checks.push({name:'Actual-browser Systems RTP Worker',pass:!workerError&&paidRounds===10000&&observedRtp!==null&&Number.isFinite(observedRtp)&&workerUnchanged,requestedPaidRounds:10000,displayedPaidRounds:paidRounds,observedRtpPercent:observedRtp,displayedResult:workerText,error:workerError,elapsedMs:Math.round(performance.now()-workerStarted),accountUnchanged:workerUnchanged,accountBefore:workerBefore,accountAfter:workerAfter,resumedRoundStages:resumedFlow.sequence,note:'Functional Worker/UI smoke check only; this 10,000-round sample does not replace the two five-million-round return gates.'});
   report.pass=report.checks.length===4&&report.checks.every(c=>c.pass)&&report.renderErrors.length===0&&report.captures.every(c=>c.renderIntegrity.pass);report.finishedAt=new Date().toISOString();report.captureCount=report.captures.length;tell(report.pass?'Browser flow suite PASS':'Browser flow suite finished with failures');return report;
  }catch(e){report.errors.push(e.message);report.pass=false;report.finishedAt=new Date().toISOString();tell('Browser flow suite failed: '+e.message);return report;}
  finally{game?.removeEventListener('error',onRenderError);running=false;}
 };
})();
