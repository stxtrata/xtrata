/* In-page acceptance runner. Operated through the normal browser UI. All wagers are test chips.
   It drives public actions and actual DOM controls; it never mutates engine state or results. */
(() => {
  const frame=document.getElementById('machine'),out=document.getElementById('results'),status=document.getElementById('status');
  sessionStorage.setItem('corgi-kennel.tab','qa-'+Array.from(crypto.getRandomValues(new Uint32Array(3)),x=>x.toString(16)).join('-'));
  let reports=[],captures=[],busy=false,sourceReady=false,serial=0,sourceHTML=null;
  const delay=ms=>new Promise(r=>setTimeout(r,ms));
  const setStatus=s=>{status.textContent=s;};
  const api=()=>frame.contentWindow.CKHostTest?.api;
  const doc=()=>frame.contentDocument.getElementById('gameFrame').contentDocument;
  const inspect=()=>api().inspect();
  const plain=v=>JSON.parse(JSON.stringify(v));
  const record=(name,pass,detail)=>{const r={name,pass,detail};reports.push(r);out.textContent=JSON.stringify(reports,null,2);return r;};
  async function waitFor(fn,max=30000){const start=Date.now();while(Date.now()-start<max){let v;try{v=fn();}catch(_){}if(v)return v;await delay(80);}throw Error('Timed out waiting for '+fn.toString().slice(0,130));}
  async function boot(w=1440,h=900,reload=false){
    frame.width=w;frame.height=h;frame.style.width=w+'px';frame.style.height=h+'px';
    if(!sourceReady||reload){
      // Pin one actual standalone build for this run. A shared development preview can
      // serve another checkout later; a reload must re-open this same machine build.
      if(sourceHTML===null){const response=await fetch('../index.html',{cache:'no-store'});if(!response.ok)throw Error('Standalone source could not be loaded.');sourceHTML=await response.text();if(!/<title>Corgi Kennel/i.test(sourceHTML))throw Error('Preview is serving a different project; restore Corgi Kennel before testing.');}
      const loaded=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Test viewport load timed out')),35000);frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});});
      frame.srcdoc=sourceHTML;sourceReady=true;serial++;await loaded;
    }
    await waitFor(()=>api()&&frame.contentDocument.getElementById('loading').classList.contains('done'),35000);
    await waitFor(()=>{const m=frame.contentWindow.CKHostTest.metrics();return m.width===w&&m.height===h;},15000);
    await delay(180);return api();
  }
  function capture(event,stage){const key=event+'-'+stage;if(captures.some(x=>x.key===key))return;const c=api().screen;captures.push({key,event,stage,width:c.width,height:c.height,hits:plain(inspect().hits),mime:'image/webp',data:c.toDataURL('image/webp',.82).split(',')[1]});}
  async function press(action){api().action(action);await delay(80);}
  async function settleReal(){let guard=0;while(guard++<250){const s=inspect();if(s.preview)return;if(s.state.pending){await delay(150);continue;}if(s.scene){if(s.scene.stage==='intro')await press('sceneStart');else if(s.scene.stage==='summary')await press('sceneContinue');else if(s.scene.stage==='play'&&(s.scene.type==='hold'||s.scene.type==='pick'))await press('spin');else await delay(150);continue;}return;}throw Error('Real round failed to finish');}
  function real(){return JSON.stringify(inspect().real);}
  async function views(){
    const sizes=[[1440,900],[1366,768],[1024,768],[390,844],[844,390]];
    for(const[w,h]of sizes){setStatus(`Screen and deck · ${w} × ${h}`);await boot(w,h);await settleReal();api().closeModal();frame.contentWindow.CKHostTest.setView('screen',true);await delay(250);
      const m=frame.contentWindow.CKHostTest.metrics();record(`screen-view-${w}x${h}`,Object.values(m.passes).every(Boolean),m);
      const document=frame.contentDocument,small=[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width&&r.height&&!b.hidden&&getComputedStyle(b).visibility!=='hidden';}).map(b=>({label:b.getAttribute('aria-label')||b.textContent.trim(),width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height}));
      record(`touch-targets-${w}x${h}`,small.every(b=>b.width>=43.9&&b.height>=43.9),{buttons:small,scrollWidth:document.documentElement.scrollWidth,viewport:w,noHorizontalScroll:document.documentElement.scrollWidth<=w});
      const start=inspect().actionSerial;let before=inspect().state.bet;if(before!==100){while(inspect().state.bet>100)await press('betDown');while(inspect().state.bet<100)await press('betUp');}
      document.querySelector('[data-deck-action="betUp"]').click();await delay(60);const up=inspect().state.bet;document.querySelector('[data-deck-action="betDown"]').click();await delay(60);const down=inspect().state.bet;
      document.querySelector('[data-deck-action="pays"]').click();await delay(80);const pays=api().ui().modalOpen;api().closeModal();document.querySelector('[data-deck-action="auto"]').click();document.querySelector('[data-deck-action="auto"]').click();const autoOff=!api().ui().auto;
      const oldSpins=inspect().state.spins;document.querySelector('[data-deck-action="spin"]').click();await waitFor(()=>inspect().state.spins>oldSpins,8000);await settleReal();
      record(`deck-actions-${w}x${h}`,up===200&&down===100&&pays&&autoOff&&inspect().state.spins>oldSpins,{up,down,pays,autoOff,spinStarted:true,actions:inspect().actionSerial-start});
    }
  }
  async function selectPreview(event,seed){
    if(inspect().preview)await press('leavePreview');api().closeModal();await settleReal();await press('lab');const d=doc();d.querySelector('[data-preview="'+event+'"]').click();d.getElementById('labBet').value='100';d.getElementById('labMode').value='seeded';d.getElementById('labSeed').value=seed;d.getElementById('labRun').click();await delay(100);
  }
  async function runFeature(event,skip=false,captureStages=true){
    const before=real(),seed='acceptance-'+event;await selectPreview(event,seed);const start=Date.now();let lastAction=0;
    while(Date.now()-start<60000){const s=inspect(),sc=s.scene;
      if(!s.preview){const result=s.lastPreview;record(`${skip?'skip':'play'}-${event}`,!!result&&result.event===event&&real()===before,{payout:result?.payout,net:result?.net,spins:result?.spins,seed:result?.seed,stages:result?.stages,realAccountUnchanged:real()===before});api().closeModal();return result;}
      if(event==='fund-info'){const b=doc().getElementById('fundPreviewDone');if(b)b.click();await delay(150);continue;}
      if(sc){if(captureStages){if(s.renderedScene?.type!==sc.type||s.renderedScene?.stage!==sc.stage){await delay(80);continue;}capture(event,sc.type+'-'+sc.stage);}const elapsed=Date.now()-lastAction;
        if(sc.stage==='intro'){await press(skip&&sc.type!=='gamble'?'sceneSkip':'sceneStart');lastAction=Date.now();}
        else if(sc.stage==='summary'){await delay(200);await press('sceneContinue');lastAction=Date.now();}
        else if(sc.stage==='play'&&elapsed>230){if(skip&&sc.type!=='gamble'){await press('sceneSkip');}else if(sc.type==='pick'||sc.type==='hold'){await press('spin');}lastAction=Date.now();}
      }
      await delay(90);
    }throw Error('Feature stalled: '+event+' '+JSON.stringify(inspect().scene));
  }
  async function fullscreenSession(w,h){
    setStatus(`Fullscreen session · ${w} × ${h}`);await boot(w,h);await settleReal();api().closeModal();frame.contentDocument.getElementById('viewFullscreen').click();await waitFor(()=>api().ui().fullscreen);const d=doc(),bar=d.getElementById('fullscreenBar');
    const visible=()=>[...bar.querySelectorAll('button,input')].filter(b=>{const r=b.getBoundingClientRect();return r.width&&r.height;}).map(b=>({label:b.getAttribute('aria-label')||b.textContent.trim(),width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height,bottom:b.getBoundingClientRect().bottom}));
    record(`fullscreen-controls-${w}x${h}`,visible().every(x=>x.width>=43.9&&x.height>=43.9&&x.bottom<=h+1),{buttons:visible(),scrollWidth:d.documentElement.scrollWidth,viewport:w,rows:Math.round(bar.getBoundingClientRect().height/52)});
    let menuResults=[];for(const action of['pays','fair','fund','history','settings','lab','test']){bar.querySelector('[data-action="'+action+'"]').click();await delay(120);menuResults.push({action,open:d.getElementById('modal').open,insideViewport:d.getElementById('modal').getBoundingClientRect().bottom<=h+1});d.getElementById('closePanel').click();await delay(60);}
    record(`fullscreen-panels-${w}x${h}`,menuResults.every(x=>x.open&&x.insideViewport),menuResults);
    const beforeSpins=inspect().state.spins;bar.querySelector('[data-action="spin"]').click();await waitFor(()=>inspect().state.spins>beforeSpins);await settleReal();
    await runFeature('pick',false,false);await runFeature('gamble-win',false,false);api().closeModal();doc().getElementById('fullscreenBar').querySelector('[data-action="exitFullscreen"]').click();await waitFor(()=>!api().ui().fullscreen);record(`fullscreen-session-${w}x${h}`,true,{spin:true,bonuses:true,gamble:true,exited:true});
  }
  async function reloadCheck(){
    setStatus('Committed-round reload recovery');await boot(1024,768);await settleReal();api().closeModal();if(api().ui().turbo)await press('turbo');const before=inspect();api().action('spin');const p=plain(inspect().state.pending);if(!p)throw Error('No pending round recorded before reload');await boot(1024,768,true);const after=inspect();record('reload-mid-spin',after.state.history.some(h=>h.id===p.id)&&after.state.spins===before.state.spins+1,{roundId:p.id,recoveredId:after.state.history[0]?.id,spinsBefore:before.state.spins,spinsAfter:after.state.spins,gridMatches:JSON.stringify(after.state.grid)===JSON.stringify(p.grid)});await settleReal();const once=real();await boot(1024,768,true);record('reload-no-double-credit',real()===once,{unchanged:real()===once});
  }
  async function reducedCheck(){
    setStatus('Reduced motion and preview isolation');api().closeModal();await press('settings');const d=doc(),el=d.getElementById('settingReduced'),previous=el.checked;el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));d.getElementById('closePanel').click();await selectPreview('jackpot','reduced-jackpot');await waitFor(()=>inspect().scene?.stage==='intro');await press('sceneStart');const s=inspect();record('reduced-motion-particles',s.reduced&&s.particles<=3,{reduced:s.reduced,particles:s.particles});await press('sceneSkip');await press('sceneContinue');api().closeModal();
    await press('settings');const restored=doc().getElementById('settingReduced');restored.checked=previous;restored.dispatchEvent(new Event('change',{bubbles:true}));doc().getElementById('closePanel').click();
  }
  async function runAllCheck(){
    setStatus('Run all twelve bonus scenarios · capture each rendered stage');api().closeModal();const before=real();await press('lab');doc().getElementById('labAll').click();const started=Date.now();
    while(Date.now()-started<180000){
      const s=inspect(),sc=s.scene;
      if(s.preview&&sc&&s.renderedScene?.type===sc.type&&s.renderedScene?.stage===sc.stage)capture(s.preview.event,sc.type+'-'+sc.stage);
      if(s.lastSuite?.length===12&&!s.preview&&s.lastSuite[0].stages[0].time>=started){const sceneHits=captures.flatMap(c=>c.hits.map(h=>({...h,capture:c.key})));record('scene-controls-inside-reel-height',sceneHits.length>0&&sceneHits.every(h=>h.x>=0&&h.x+h.w<=1400&&h.y>=238&&h.y+h.h<=724),{checked:sceneHits.length,reelHeightRange:[238,724],roomOverlayStartsAt:780});const unchanged=real()===before;record('lab-run-all',unchanged&&s.lastSuite.every(x=>x.isolation),{realAccountUnchanged:unchanged,runs:s.lastSuite.map(x=>({event:x.event,payout:x.payout,spins:x.spins,isolation:x.isolation}))});api().closeModal();return;}
      await delay(120);
    }throw Error('Run All did not complete all twelve scenarios');
  }

  async function run(mode){
    if(busy)return;busy=true;reports=[];captures=[];document.querySelectorAll('header button').forEach(b=>b.disabled=true);
    try{
      await boot();await views();
      if(mode==='full'){
        await boot(1440,900);if(!api().ui().turbo)await press('turbo');
        const events=['free','retrigger','pick','hold','full-hold','jackpot','gamble-win','gamble-loss','scatter-3','scatter-4','scatter-5','fund-info'];const played={};
        for(const e of events){setStatus('Playing all stages · '+e);played[e]=await runFeature(e);}
        for(const e of['free','retrigger','pick','hold','full-hold']){setStatus('Skip equivalence · '+e);const skipped=await runFeature(e,true,false);record('skip-equality-'+e,played[e].payout===skipped.payout&&played[e].net===skipped.net&&played[e].spins===skipped.spins,{played:{payout:played[e].payout,net:played[e].net,spins:played[e].spins},skipped:{payout:skipped.payout,net:skipped.net,spins:skipped.spins}});}
      }
      if(mode==='full'||mode==='remaining'){
        await fullscreenSession(1440,900);await fullscreenSession(390,844);await reloadCheck();
        if(!api().ui().turbo)await press('turbo');await reducedCheck();await runAllCheck();
      }
      setStatus(`${reports.filter(r=>r.pass).length}/${reports.length} checks passed · ${captures.length} scene captures.`);
    }catch(e){record('runner-error',false,{error:e.message,stack:e.stack});setStatus('Stopped at a concrete failure: '+e.message);}
    finally{busy=false;document.querySelectorAll('header button').forEach(b=>b.disabled=false);}
  }
  document.getElementById('runViews').onclick=()=>run('views');document.getElementById('runFull').onclick=()=>run('full');document.getElementById('runRemaining').onclick=()=>run('remaining');document.getElementById('size').onchange=async e=>{if(!busy){const[w,h]=e.target.value.split(',').map(Number);await boot(w,h);frame.contentWindow.CKHostTest.setView('screen',true);}};
  document.getElementById('export').onclick=()=>{const payload={checkedAt:new Date().toISOString(),environment:'Cloud Chrome · WebGL unavailable, SoftwareRenderer fallback',source:{title:'Corgi Kennel',standaloneCharacters:sourceHTML?.length,reloads:serial-1},reports,captures},url=URL.createObjectURL(new Blob([JSON.stringify(payload)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='corgi-kennel-browser-results.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);};
  boot().catch(e=>setStatus(e.message));
})();
