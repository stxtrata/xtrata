const {chromium}=require('playwright');const fs=require('fs');
const page_url='file://'+(process.argv[2]||__dirname+'/assets/emulator/snes-emulator-v1.0.html');
const rom=[...fs.readFileSync(__dirname+'/assets/roms/star-patrol.sfc')];
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  const bad=[];const ck=(c,m)=>{console.log(c?'  ok  ':'  FAIL',m);if(!c)bad.push(m);};
  await p.goto(page_url,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
  const r=await p.evaluate(async rom=>{
    const X=window.XtrataSNES,hex=u=>Array.from(u,b=>b.toString(16).padStart(2,'0')).join('');const out={};
    const bytes=new Uint8Array(rom);await X.loadRom(bytes,'star_patrol.sfc');await new Promise(r=>setTimeout(r,300));
    // a player's real save
    const marker=new Uint8Array(X.sram().length);for(let i=0;i<marker.length;i++)marker[i]=(i*7+3)&255;X.setSram(marker);
    X.control('reset');const key=Object.keys(localStorage).find(k=>k.startsWith('snes.sram:'));out.key=!!key;const stored0=localStorage.getItem(key);
    // unseeded run: log version 1
    X.control('pause');X.setInput(1,['start']);X.step(30);X.setInput(1,{});X.step(30);
    out.v1=X.inputLog()[4];out.rankedBefore=X.info().ranked;
    // refusals
    try{X.rankedStart(new Uint8Array(5));out.badLen='accepted';}catch(e){out.badLen=e.message;}
    // ranked run
    const seed=new Uint8Array(32);for(let i=0;i<32;i++)seed[i]=(i*13+5)&255;
    X.rankedStart(seed);X.control('pause');const stored1=localStorage.getItem(key);
    const s=X.sram();out.seedOk=hex(s.subarray(0,32))===hex(seed);out.restZero=s.subarray(32).every(v=>v===0);out.ranked=X.info().ranked;out.frame0=X.frame();
    for(let i=0;i<12;i++){X.setInput(1,i%3===0?['start']:i%3===1?['a','right']:['left','b']);X.step(100);}
    X.setInput(1,{});
    const log=X.inputLog();out.v2=log[4];out.logFrames=X.frame();
    const L=X.unpackLog(log);out.logSeed=hex(L.seed)===hex(seed);
    out.liveWram=await X.sha256(window.__snes.wram);
    // autosave must not write the seed over the player's save
    window.dispatchEvent(new Event('pagehide'));await new Promise(r=>setTimeout(r,3500));
    out.saveUntouched=localStorage.getItem(key)===stored1;
    // replay from the log alone (fresh core, seed from the header)
    const rp=await X.replay(bytes,log);out.replayWram=rp.wramSha256;out.replayFrames=rp.frames;
    // replay with the seed stripped from the v1-style opts must differ in sram only; check seed option path on a raw run list
    const rp2=await X.replay(bytes,L.runs,{seed});out.optSeedWram=rp2.wramSha256;
    // in-page playback leaves the save alone and stays ranked
    X.playReplay(log);X.control('resume');await new Promise(r=>setTimeout(r,2500));
    out.playRanked=X.info().ranked;window.dispatchEvent(new Event('pagehide'));out.saveUntouched2=localStorage.getItem(key)===stored1;
    // reset exits ranked and brings the stored save back
    X.control('reset');out.afterReset=X.info().ranked;const d=atob(stored1);const u=new Uint8Array(d.length);for(let i=0;i<d.length;i++)u[i]=d.charCodeAt(i);out.saveBack=hex(X.sram())===hex(u);
    return out;
  },rom);
  ck(r.key,'player save stored');ck(r.v1===1,'unseeded log is format 1 (unchanged)');ck(r.rankedBefore===false,'not ranked before');
  ck(/32 bytes/.test(r.badLen),'bad seed refused: '+r.badLen);
  ck(r.seedOk&&r.restZero,'cold boot: battery RAM = seed then zeros');ck(r.ranked,'info says ranked');ck(r.frame0===0,'frame counter restarted');
  ck(r.v2===2,'ranked log is format 2');ck(r.logSeed,'seed stored in the log header');ck(r.logFrames===1200,'1200 frames logged ('+r.logFrames+')');
  ck(r.saveUntouched,'autosave/pagehide did not touch the stored save');
  ck(r.replayWram===r.liveWram&&r.replayFrames===1200,'replay from the log reproduces the live WRAM hash');
  ck(r.optSeedWram===r.liveWram,'seed option on a raw run list gives the same result');
  ck(r.playRanked&&r.saveUntouched2,'in-page playback stays ranked and leaves the save alone');
  ck(r.afterReset===false&&r.saveBack,'reset leaves ranked mode and restores the stored save');
  ck(errs.length===0,'no page errors '+JSON.stringify(errs));
  await b.close();if(bad.length){console.log('FAILED');process.exit(1);}console.log('ranked test passed');
})();
