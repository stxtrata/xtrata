/* Test-page-only presentation runner. Never include this script in pack.game.
 * Uses real DOM controls and the public canvas/tap/action API. No RNG, reel
 * stops, state, prizes or engine internals are changed by this harness. */
(() => {
 'use strict';
 let running=false;
 const pause=ms=>new Promise(r=>setTimeout(r,ms));
 const items=['free','free-retrigger','pick','chain','chain-full','jackpot','gamble-win','gamble-loss','scatter3','scatter4','scatter5','fund'];
 const expected={free:'free','free-retrigger':'free',pick:'pick',chain:'chain','chain-full':'chain',jackpot:'jackpot','gamble-win':'gamble','gamble-loss':'gamble',scatter3:'free',scatter4:'free',scatter5:'free'};
 const stages=['trigger','intro','play','summary'];
 const round=n=>Math.round(n*100)/100;
 async function waitFor(fn,label,timeout=30000){const start=performance.now();while(performance.now()-start<timeout){const v=fn();if(v)return v;await pause(65);}throw Error('Timed out: '+label);}
 window.runPresentationChecks=async function(outerFrame,reportCallback=()=>{},options={}){
  if(running)throw Error('Presentation suite is already running.');running=true;
  let host,game,doc,api,account;const captureOnly=!!options.captureOnly;
  const report={suite:captureOnly?'Launchpad actual-browser presentation stage captures':'Launchpad actual-browser presentations and fullscreen sessions',mode:captureOnly?'capture-only':'full-suite',fullscreenCoverage:captureOnly?'Use the separate completed fullscreen report; this mode reruns stage capture only.':'Desktop and phone sessions included.',startedAt:new Date().toISOString(),method:'Real iframe game, normal DOM controls, public canvas taps, Bonus Lab practice states. Canvas stage captures are WebP at the logical 1400×960 display size (quality .93); the source backing canvas is 2800×1920. No injected outcomes or engine mutations.',scenarios:[],fullscreen:[],captures:[],renderErrors:[],errors:[]};
  const notify=(label,extra={})=>{try{reportCallback({label,captures:report.captures.length,completed:report.scenarios.length,...extra});}catch(_){}};
  function onRenderError(event){report.renderErrors.push({message:event.message,file:event.filename,line:event.lineno,column:event.colno});}
  function canvasIntegrity(){
   const context=api.screen.getContext('2d'),scaleX=api.screen.width/1400,scaleY=api.screen.height/960;
   const samples=[100,500,900,1300].map(x=>({x,y:820,rgba:[...context.getImageData(Math.round(x*scaleX),Math.round(820*scaleY),1,1).data]}));
   return {pass:samples.every(p=>Math.abs(p.rgba[0]-12)<=2&&Math.abs(p.rgba[1]-32)<=2&&Math.abs(p.rgba[2]-44)<=2&&p.rgba[3]===255),purpose:'The complete lower status panel must be rendered; detects leaked reel clipping or an aborted draw.',samples};
  }
  function ui(){return api.ui();}
  function snapshot(){return JSON.stringify(account.snapshot());}
  function click(selector,root=doc){const e=root.querySelector(selector);if(!e)throw Error('Missing control '+selector);if(e.disabled)throw Error('Disabled control '+selector);e.click();return e;}
  function bar(action){return click('#fullControls [data-action="'+action+'"]');}
  function closePanel(){if(ui().modalOpen)doc.getElementById('closePanel').click();}
  function primary(fromBar=false){if(fromBar)bar('feature');else api.tap(700,706);}
  async function capture(caseId,kind,stage){
   const previousFrame=ui().renderedScene?.frame||0,needsStage=kind!=='fund'&&kind!=='fullscreen';
   await waitFor(()=>{const r=ui().renderedScene;return r&&r.frame>0&&(!needsStage||r.kind===kind&&r.stage===stage);},'rendered '+caseId+' / '+kind+' / '+stage,5000);
   if(stage==='summary')await pause(1050);
   const shot=doc.createElement('canvas');shot.width=1400;shot.height=960;shot.getContext('2d').drawImage(api.screen,0,0,1400,960);
   const stamp={case:caseId,kind,stage,time:new Date().toISOString(),width:1400,height:960,sourceWidth:api.screen.width,sourceHeight:api.screen.height,imageFormat:'image/webp',quality:.93,renderedScene:ui().renderedScene,renderIntegrity:canvasIntegrity(),ui:{balance:ui().balance,bet:ui().bet,win:ui().win,spins:ui().spins,practice:ui().practice,reduced:ui().reduced},image:shot.toDataURL('image/webp',.93)};
   report.captures.push(stamp);notify(caseId+' · '+kind+' / '+stage);if(!stamp.renderIntegrity.pass)throw Error('Incomplete canvas drawing in '+caseId+' / '+stage);return stamp;
  }
  async function drive(caseId,{fromBar=false,record=true,skip=false,timeout=150000}={}){
   const seen=new Set(),sequence=[],started=performance.now();let lastAction=0,picks=0,idleAt=0;
   while(performance.now()-started<timeout){
    const u=ui(),s=u.sceneDetail;
    if(u.spinning){idleAt=0;await pause(60);continue;}
    if(!s){if(!idleAt)idleAt=performance.now();if(performance.now()-idleAt>450)return {stages:sequence,finished:true,ui:ui()};await pause(75);continue;}
    idleAt=0;const key=s.kind+'/'+s.stage;
    if(!seen.has(key)){seen.add(key);sequence.push({kind:s.kind,stage:s.stage});if(record)await capture(caseId,s.kind,s.stage);}
    const current=ui().sceneDetail;if(!current||current.kind!==s.kind||current.stage!==s.stage)continue;
    if(s.stage==='trigger'){await pause(70);continue;}
    if(s.stage==='summary'){primary(fromBar);lastAction=performance.now();await pause(100);continue;}
    if(skip&&s.kind!=='gamble'){fromBar?bar('skip'):api.action('skip');await pause(100);continue;}
    if(s.stage==='intro'){primary(fromBar);lastAction=performance.now();await pause(150);continue;}
    const elapsed=performance.now()-lastAction;
    if(s.kind==='free'||s.kind==='jackpot'){await pause(75);continue;}
    if(s.kind==='pick'&&elapsed>850){
     // Wait for the visible action to become ready; software frames can take
     // longer than the nominal reveal timer. Count only an accepted tap.
     if(doc.getElementById('featureControl').disabled){await pause(100);continue;}
     const previousStatus=ui().status;
     if(fromBar)bar('feature');else api.tap(412+Math.min(picks,2)*300,422);
     if(ui().status!==previousStatus&&/^SEAT \d+ CONFIRMED/.test(ui().status))picks++;
     lastAction=performance.now();await pause(130);continue;
    }
    if(s.kind==='chain'&&elapsed>(ui().turbo?400:1200)){
     const b=doc.getElementById('featureControl');if(!b.disabled){fromBar?bar('feature'):api.tap(700,710);lastAction=performance.now();}
    }
    if(s.kind==='gamble'&&u.canGamble&&elapsed>180){fromBar?bar(caseId.includes('gamble-loss')?'fade':'ape'):api.tap(caseId.includes('gamble-loss')?830:570,704);lastAction=performance.now();}
    await pause(75);
   }
   throw Error('Presentation did not complete in '+timeout+'ms: '+caseId+' '+JSON.stringify(ui().sceneDetail));
  }
  async function launch(id,fromBar=false){
   closePanel();if(ui().practice){fromBar?bar('exitPreview'):api.action('exitPreview');await pause(100);}
   if(ui().sceneDetail||ui().spinning)await drive('finish-existing',{fromBar,record:false,skip:true});
   fromBar?bar('lab'):api.action('lab');await waitFor(()=>doc.getElementById('labSeed'),'Lab controls');
   doc.getElementById('labBet').value='100';doc.getElementById('labSeed').value='launchpad22';doc.getElementById('labRandom').checked=false;
   click('[data-scenario="'+id+'"]');click('[data-lab-run]');
  }
  async function scenario(id,{fromBar=false,record=true,skip=false}={}){
   const before=snapshot(),r={id,mode:fromBar?'fullscreen':'screen',startedAt:new Date().toISOString(),pass:false};
   try{
    notify('Running '+id);await launch(id,fromBar);
    if(id==='fund'){
     await waitFor(()=>ui().panel==='fund','Fund information');if(record)await capture(id,'fund','info');r.stages=[{kind:'fund',stage:'info'}];r.stagesApplicable='Information panel: no wager or four-stage bonus.';r.panelText=doc.getElementById('panelBody').textContent;r.unknownIsChecking=/checking/i.test(r.panelText);closePanel();
    }else{
     const flow=await drive(id,{fromBar,record,skip});r.stages=flow.stages;r.finalPracticeBalance=ui().balance;
     r.requiredStages=stages;r.allRequiredStages=stages.every(stage=>flow.stages.some(s=>s.kind===expected[id]&&s.stage===stage));
     if(id==='chain-full')r.jackpotFourStages=stages.every(stage=>flow.stages.some(s=>s.kind==='jackpot'&&s.stage===stage));
    }
    if(ui().practice){fromBar?bar('exitPreview'):api.action('exitPreview');await pause(150);}
    r.accountUnchanged=before===snapshot();r.pass=r.accountUnchanged&&(id==='fund'?r.unknownIsChecking:r.allRequiredStages)&&(r.jackpotFourStages!==false);
   }catch(e){r.error=e.message;report.errors.push(id+': '+e.message);try{api.action('exitPreview');closePanel();}catch(_){};}
   r.finishedAt=new Date().toISOString();return r;
  }
  function bounds(el){const r=el.getBoundingClientRect();return {left:round(r.left),top:round(r.top),right:round(r.right),bottom:round(r.bottom),width:round(r.width),height:round(r.height)};}
  function visibleControls(){return [...doc.querySelectorAll('#fullControls button,#fullControls input')].filter(e=>{const r=e.getBoundingClientRect(),style=game.getComputedStyle(e);return !e.hidden&&r.width>0&&r.height>0&&style.display!=='none'&&style.visibility!=='hidden';}).map(e=>({label:e.textContent.trim()||e.getAttribute('aria-label'),action:e.dataset.action||e.dataset.input,...bounds(e)}));}
  async function menu(name){
   bar(name);await waitFor(()=>ui().modalOpen,name+' panel');await pause(120);
   const panel=doc.getElementById('panel'),p=bounds(panel),control=bounds(doc.getElementById('fullControls'));
   const r={name,actualPanel:ui().panel,panel:p,controls:control,insideFrame:p.left>=-.5&&p.right<=game.innerWidth+.5&&p.top>=-.5&&p.bottom<=game.innerHeight+.5,aboveControls:p.bottom<=control.top+.5};
   doc.getElementById('closePanel').click();await waitFor(()=>!ui().modalOpen,name+' closes');return r;
  }
  async function fullscreenSession(size){
   const r={viewport:{width:size[0],height:size[1]},pass:false,menus:[],bonuses:[]};notify('Fullscreen '+size.join(' × '));
   try{
    closePanel();if(ui().practice)api.action('exitPreview');if(ui().sceneDetail||ui().spinning)await drive('finish-before-fullscreen',{record:false,skip:true});
    outerFrame.style.width=size[0]+'px';outerFrame.style.height=size[1]+'px';await pause(350);
    if(!ui().fullscreen)host.document.getElementById('fullTop').click();await waitFor(()=>ui().fullscreen,'Fullscreen hand-over');await pause(250);
    r.native=!!host.document.fullscreenElement;r.fallback=!r.native;r.frame={width:game.innerWidth,height:game.innerHeight};
    r.controls=visibleControls();r.minimum44=r.controls.every(b=>b.width>=43.99&&b.height>=43.99);r.noSidewaysScroll=doc.documentElement.scrollWidth<=game.innerWidth;
    const betBefore=ui().bet;bar('betUp');await pause(150);const up=ui().bet;bar('betDown');await pause(150);r.betSequence=[betBefore,up,ui().bet];r.betPass=betBefore===100&&up===200&&ui().bet===100;
    for(const name of ['pays','fair','history','fund','settings','preview','lab','test'])r.menus.push(await menu(name));
    const muted=ui().muted;bar('sound');await pause(80);r.soundToggle=ui().muted!==muted;bar('sound');
    const volume=doc.querySelector('#fullControls [data-input="volume"]'),oldVolume=volume.value;volume.value='.25';volume.dispatchEvent(new game.Event('input',{bubbles:true}));r.volumeWorks=ui().volume===.25;volume.value=oldVolume;volume.dispatchEvent(new game.Event('input',{bubbles:true}));
    const turboBefore=ui().turbo;if(!turboBefore)bar('turbo');r.turboToggle=ui().turbo;
    const spinsBefore=ui().spins;bar('spin');await drive('fullscreen-paid-spin',{fromBar:true,record:false});r.spinWorks=ui().spins>spinsBefore;
    const autoBefore=ui().spins;bar('auto');await pause(100);if(ui().auto)bar('auto');await drive('fullscreen-auto',{fromBar:true,record:false});r.autoStartedAndStopped=ui().spins>autoBefore&&!ui().auto;
    if(ui().turbo)bar('turbo');
    for(const id of ['free','pick','chain','jackpot','gamble-win','gamble-loss'])r.bonuses.push(await scenario(id,{fromBar:true,record:false}));
    if(ui().turbo!==turboBefore)bar('turbo');
    if(!doc.getElementById('collectControl').hidden){bar('collect');r.collectControl=true;}else r.collectControl='No uncollected regular win was offered at this stage; all prizes already credited.';
    await capture('fullscreen-'+size.join('x'),'fullscreen','session-end');
    bar('fullscreenExit');await waitFor(()=>!ui().fullscreen,'Exit fullscreen');r.exitWorks=true;
    r.pass=r.minimum44&&r.noSidewaysScroll&&r.betPass&&r.soundToggle&&r.volumeWorks&&r.turboToggle&&r.spinWorks&&r.autoStartedAndStopped&&r.exitWorks&&r.menus.every(m=>m.insideFrame&&m.aboveControls)&&r.bonuses.every(b=>b.pass);
   }catch(e){r.error=e.message;report.errors.push('Fullscreen '+size.join('x')+': '+e.message);try{api.action('exitPreview');api.action('fullscreenExit');closePanel();}catch(_){};}
   return r;
  }
  try{
   host=await waitFor(()=>outerFrame.contentWindow?.PX_STUDIO?.diagnostics().ready&&outerFrame.contentWindow,'Standalone host');
   if(host.PX_STANDALONE_TEST!==true||!(new URLSearchParams(host.location.search).get('qa')||outerFrame.dataset.qa))throw Error('Presentation checks require the standalone test flag and an isolated QA account.');
   game=host.document.getElementById('gameFrame').contentWindow;doc=game.document;api=game.PX_CASINO_ENGINE;account=host.ParallaxLAYRAccount;game.addEventListener('error',onRenderError);
   report.initialAccount=account.snapshot();report.initialRenderer=host.PX_STUDIO.diagnostics().renderer;
   api.stopAuto();if(ui().turbo)api.action('turbo');if(ui().practice)api.action('exitPreview');
   for(const id of items){const r=await scenario(id);report.scenarios.push(r);notify((r.pass?'PASS ':'FAIL ')+id);}
   if(!captureOnly)for(const size of [[1366,900],[390,844]])report.fullscreen.push(await fullscreenSession(size));
   report.pass=report.scenarios.length===12&&report.scenarios.every(r=>r.pass)&&(captureOnly||report.fullscreen.length===2&&report.fullscreen.every(r=>r.pass))&&report.renderErrors.length===0&&report.captures.every(c=>c.renderIntegrity.pass);
   report.finishedAt=new Date().toISOString();report.captureCount=report.captures.length;report.finalAccount=account.snapshot();notify(report.pass?'Presentation suite PASS':'Presentation suite finished with failures',{pass:report.pass});return report;
  }catch(e){report.errors.push(e.message);report.pass=false;report.finishedAt=new Date().toISOString();notify('Presentation suite failed: '+e.message);return report;}
  finally{game?.removeEventListener('error',onRenderError);running=false;}
 };
})();
