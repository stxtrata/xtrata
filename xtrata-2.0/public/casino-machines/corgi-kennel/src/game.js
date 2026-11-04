(() => {
  'use strict';
  /* @PRISTINE_ENGINE@ */
  /* @LAB_RNG@ */
  if(window.__bfUnsupported)return;
  const GAME_ID='corgi-kennel', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
  const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), copy=v=>JSON.parse(JSON.stringify(v));
  const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
  screen.setAttribute('aria-label','Corgi Kennel game screen');screen.setAttribute('role','img');
  const ART=window.CORGI_ART||{symbols:{},family:[],happyWelsh:[],dayOne:{},registry:{}};
  const TEST=window.PX_STANDALONE_TEST===true||['localhost','127.0.0.1','[::1]'].includes(window.location?.hostname), NAMES={cherry:'BABYWELSH',lemon:'gWELSH',chip:'PHOENIX WELSH',block:'sWELSH',artifact:'WELSH CVLT',bitcoin:'WELSH',wild:'HAPPY WELSH',scatter:'DAY ONE',vault:'LEO–WELSH',chain:'PEDIGREE'};
  const LABELS={spin:'FETCH',betDown:'−TREATS',betUp:'+TREATS',auto:'AUTO-WALK',pays:'PEDIGREE',fair:'FAIR PLAY',fund:'THE FUND',history:'SHOW RECORD',turbo:'QUICK STEP',sound:'BRASS BAND',lab:'BONUS PREVIEW',test:'TEST',settings:'SETTINGS'};
  const C={green:'#153c2d',deep:'#09251c',cream:'#f4ead3',gold:'#d9b56c',light:'#f9e2a4',ink:'#193c2c',muted:'#aabb9e'};
  let state=LAYR.openGame(GAME_ID,E), active=false, ready=false, activationEpoch=0, spinning=null, scene=null, freeShown=false, autoLeft=0, autoAt=0, preview=null, lastPreview=null, replayConfig=null;
  let dirty=true, revision=0, renderedScene=null, lastFrame=0, lastUI='', lastFeatureHTML='', stopTicks=0, lastOutcome=null, outcomeAt=0, drawnPayline=null, status='Welcome to the show. Pull the lead or press FETCH.', fullscreen=false, fullscreenCallbacks=null;
  let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||!!state.reduced, leverStart=0, caps={}, serial=0, modalName='', hits=[], actionSerial=0, testTwins='unknown', lastSummary=null, celebrationUntil=0;
  let artSlots=[], tiles=new Map(), images=new Map(), animEvents=[], actionLock=false, stageLog=[], audioContext=null, masterGain=null, ambienceTimer=null;
  state.machineFund=state.machineFund||{balance:0,lastPayPerTwin:null,qualifiedTwins:null};
  const engine=()=>preview?PX_PURE:E;
  const fmt=n=>Number(n||0).toLocaleString('en-GB',{maximumFractionDigits:2}), now=()=>performance.now();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const quiet=()=>{autoLeft=0;autoAt=0;dirty=true;};
  const save=()=>{if(!preview&&LAYR.ready())LAYR.saveGame(state);dirty=true;};
  const inform=s=>{status=s;$('announcer').textContent=s;dirty=true;};
  const toast=s=>{inform(s);$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),3000);};
  // TODO: Casino Service replaces this adapter. BF v2 remains authoritative for local test meters.
  // Contributions are already committed by BF.start; this display adapter MUST NOT add a second 2%.
  const casinoJackpot={get:level=>engine().meter(state,level),contribute:(level,bet)=>({level,amount:bet*.02,managedBy:'BF-v2'}),settle:level=>({level,meter:engine().meter(state,level),managedBy:'BF-v2'})};
  // TODO: replace with period snapshots and pull-claim contracts. Unknown data stays null.
  const machineFund={get:()=>state.machineFund||{balance:0,lastPayPerTwin:null,qualifiedTwins:null},periodEnd(){const d=new Date();d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()+((8-d.getUTCDay())%7||7));return d;},claim:()=>null};
  function sfx(kind){
    if(state.muted)return;
    try{
      const sound=kind==='lever'||kind==='stop'?ART.audio?.bark:kind==='jackpot'||kind==='win'?ART.audio?.applause:null;
      if(sound?.file){const clip=new Audio(sound.file);clip.volume=clamp((state.volume??.4)*(kind==='stop'?.35:.8),0,1);clip.play().catch(()=>{});if(kind==='lever'||kind==='stop')return;}
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      if(!audioContext){const ac=audioContext=new AC();masterGain=ac.createGain();masterGain.gain.value=state.volume??.4;masterGain.connect(ac.destination);}
      if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
      masterGain.gain.setValueAtTime(state.volume??.4,audioContext.currentTime);
      const ac=audioContext,t=ac.currentTime;
      const note=(hz,at,len,type='triangle',vol=.13)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(hz,t+at);g.gain.setValueAtTime(0,t+at);g.gain.linearRampToValueAtTime(vol,t+at+.015);g.gain.exponentialRampToValueAtTime(.0001,t+at+len);o.connect(g);g.connect(masterGain);o.start(t+at);o.stop(t+at+len+.02);};
      if(kind==='lever'||kind==='stop'){[0,.11].forEach((a,i)=>{note(175+i*30,a,.12,'sawtooth',.035);note(390,a,.075,'triangle',.045);});}
      else if(kind==='win'||kind==='pick'){[392,494,587,784].forEach((h,i)=>note(h,i*.085,.28,'triangle',.10));}
      else if(kind==='bonus'||kind==='jackpot'){[392,392,523,659,784,659,784,1047].forEach((h,i)=>{note(h,i*.14,.28,'sawtooth',.045);note(h/2,i*.14,.3,'triangle',.07);});}
      else if(kind==='lock'){note(150,0,.15,'triangle',.16);note(880,.06,.2,'sine',.07);}
      else if(kind==='loss'){note(392,0,.22);note(294,.16,.3);}
      else note(660,0,.055,'sine',.06);
    }catch(_){}
  }
  const imageFor=item=>item&&(images.get(item.image)||images.get(item.collectionSnapshot?.image));
  function loadArt(){
    const paths=new Set();function walk(v){if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(k==='image'&&typeof x==='string')paths.add(x);else if(typeof x==='object')walk(x);}}walk(ART);
    return Promise.all([...paths].map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>{images.set(src,i);dirty=true;resolve();};i.onerror=()=>resolve();i.src=src;})));
  }
  const itemFor=sym=>sym==='chain'?(ART.family[Math.floor(Math.random()*Math.max(1,ART.family.length))]||{name:'Pedigree',symbol:'WELSH FAMILY'}):sym==='wild'?(ART.happyWelsh?.length?ART.happyWelsh[Math.floor(Math.random()*ART.happyWelsh.length)]:ART.symbols.wild):ART.symbols[sym];
  function chooseArt(grid){artSlots=grid.map(col=>col.map(s=>itemFor(s)));}
  function rr(g,x,y,w,h,r=12){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else{g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);}g.closePath();}
  function box(g,x,y,w,h,r,fill,stroke,line=1){rr(g,x,y,w,h,r);g.fillStyle=fill;g.fill();if(stroke){g.lineWidth=line;g.strokeStyle=stroke;g.stroke();}}
  function txt(g,s,x,y,size=20,color=C.cream,align='left',font='Arial',weight='400'){g.font=`${weight} ${size}px ${font}`;g.fillStyle=color;g.textAlign=align;g.textBaseline='middle';g.fillText(String(s),x,y);}
  function fitText(g,s,x,y,max,size=20,color=C.cream,align='center',font='Arial',weight='700'){while(size>9){g.font=`${weight} ${size}px ${font}`;if(g.measureText(s).width<=max)break;size--;}txt(g,s,x,y,size,color,align,font,weight);}
  function contain(g,im,x,y,w,h){if(!im)return;const k=Math.min(w/im.width,h/im.height);g.drawImage(im,x+(w-im.width*k)/2,y+(h-im.height*k)/2,im.width*k,im.height*k);}
  function rosette(g,x,y,r,angle=0,logo=true){
    g.save();g.translate(x,y);g.rotate(angle);g.fillStyle='#b78531';g.beginPath();for(let i=0;i<48;i++){const a=i*Math.PI/24,rad=i%2?r*.86:r;const px=Math.cos(a)*rad,py=Math.sin(a)*rad;i?g.lineTo(px,py):g.moveTo(px,py);}g.closePath();g.fill();g.strokeStyle='#f5d790';g.lineWidth=2;g.stroke();
    g.beginPath();g.arc(0,0,r*.71,0,Math.PI*2);g.fillStyle='#f4e3b7';g.fill();g.strokeStyle='#b28b3e';g.lineWidth=4;g.stroke();
    if(logo)contain(g,imageFor(ART.symbols.bitcoin),-r*.57,-r*.57,r*1.14,r*1.14);g.restore();
  }
  function tile(sym,item){
    const key=sym+':'+(item?.key||item?.contract||'none')+':'+(item?.token_id??'')+':'+testTwins;
    if(tiles.has(key))return tiles.get(key);
    const c=canvas(480,330),g=c.getContext('2d'),isGold=sym==='bitcoin',bg=isGold?'#f6e0a4':sym==='artifact'?'#e3dfcf':'#f6f0df';
    box(g,3,3,474,324,22,bg,isGold?'#c69b46':'#d3c7a7',4);box(g,13,13,454,304,15,'#ffffff00','#bba97a55',2);
    if(sym==='scatter'){
      txt(g,'THE FOUNDING RECORD',240,38,17,'#806535','center','Arial','700');txt(g,'DAY ONE',240,101,44,C.ink,'center','Georgia');txt(g,'24 NOV 2021',240,152,31,C.ink,'center','Arial','700');
      txt(g,ART.dayOne?.blockHeight?'STACKS BLOCK 39,013':'BLOCK READ UNAVAILABLE',240,196,18,'#66714e','center','Arial','700');txt(g,'3+  •  COMMUNITY TAKEOVER',240,247,16,C.ink,'center','Arial','700');txt(g,'SNAPSHOT · 3 NOV 2026',240,290,13,'#6d755c','center');
    }else if(sym==='chain'){
      txt(g,'REGISTERED PEDIGREE',240,33,15,'#7a6337','center','Arial','700');contain(g,imageFor(item),161,58,158,158);fitText(g,item?.symbol||'WELSH FAMILY',240,239,426,30,C.ink);fitText(g,item?.name||'Metadata unavailable',240,273,426,16,'#63704d');txt(g,'VERIFIED TOKEN · SNAPSHOT 3 NOV 2026',240,302,11,'#7a765c','center');
    }else if(sym==='wild'){
      const im=imageFor(item),mock=TEST&&(testTwins==='all'||testTwins==='some'&&(item?.token_id||1)%2===0);g.save();g.filter=mock?'none':'grayscale(1)';contain(g,im,82,35,316,202);g.restore();
      txt(g,'HAPPY WELSH · WILD',240,250,21,C.ink,'center','Arial','700');box(g,72,270,336,29,4,'#314735');txt(g,mock?'∞ · TEST VISUAL ONLY':'NOT YET FOREVER',240,285,15,'#f0e9cf','center','Arial','700');
      txt(g,item?.image?`TOKEN #${item.token_id??'—'} · SOURCE SNAPSHOT`:'COLLECTION SNAPSHOT · 3 NOV 2026',240,312,10,'#667059','center');
    }else{
      if(isGold)rosette(g,240,133,112,0,true);else if(imageFor(item)){g.imageSmoothingEnabled=item?.width!==4;contain(g,imageFor(item),140,26,200,200);g.imageSmoothingEnabled=true;}
      else{txt(g,sym==='cherry'?'BABY':'PHOENIX',240,105,35,C.ink,'center','Georgia');txt(g,'WELSH',240,155,40,C.ink,'center','Georgia');txt(g,'LOGO PENDING',240,203,15,'#7f6953','center','Arial','700');}
      fitText(g,NAMES[sym],240,257,420,28,C.ink);txt(g,sym==='vault'?'3+ · FETCH! PICK BONUS':isGold?'5 CENTRE · BEST IN SHOW':(item?.image?'OFFICIAL TOKEN ART':'VERIFIED TOKEN · ART UNAVAILABLE'),240,300,12,'#6b7052','center','Arial','700');
    }
    tiles.set(key,c);return c;
  }
  const R={x:70,y:238,w:1260,h:486,cw:252,ch:162};
  function backdrop(t){
    const grad=sg.createLinearGradient(0,0,0,960);grad.addColorStop(0,'#173f2e');grad.addColorStop(.5,'#0c3022');grad.addColorStop(1,'#061d16');sg.fillStyle=grad;sg.fillRect(0,0,1400,960);
    sg.strokeStyle='#d9b56c17';sg.lineWidth=1;for(let x=-700;x<1700;x+=72){sg.beginPath();sg.moveTo(x,0);sg.lineTo(x+700,960);sg.stroke();}
    box(sg,20,20,1360,920,20,'#00000000','#c5a568',2);box(sg,31,31,1338,898,15,'#00000000','#8c834244',1);
    txt(sg,'THE WELSH KENNEL CLUB',70,67,15,C.gold,'left','Arial','700');txt(sg,preview?'BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR':'PARALLAX CASINO  /  MACHINE No. 21',1330,67,14,C.gold,'right','Arial','700');
    txt(sg,'CORGI KENNEL',700,125,62,C.cream,'center','Georgia');sg.strokeStyle='#bd9b52';sg.lineWidth=1;sg.beginPath();sg.moveTo(85,182);sg.lineTo(530,182);sg.moveTo(870,182);sg.lineTo(1315,182);sg.stroke();
    txt(sg,scene?.type==='free'&&scene.stage==='play'?'THE COMMUNITY RUNS THE SHOW':'GOOD DOGS. GREAT COMPANY.',700,181,14,C.gold,'center','Arial','700');
    txt(sg,'20 LINES',78,215,14,'#aebca1','left','Arial','700');txt(sg,scene?.type==='free'&&scene.stage==='play'?`${state.free} LAPS LEFT  ·  ALL WINS 2×`:'FIVE REELS  ·  THE WELSH FAMILY',1320,215,14,'#aebca1','right','Arial','700');
  }
  function drawReels(t){
    const freePlay=scene?.type==='free'&&scene.stage==='play',reels=freePlay?{...R,h:414,ch:138}:R;
    box(sg,58,226,1284,510,16,'#071b13','#9b7e43',3);
    for(let c=0;c<5;c++){
      sg.save();sg.beginPath();sg.rect(reels.x+c*reels.cw,reels.y,reels.cw,reels.h);sg.clip();
      const p=spinning?clamp((t-spinning.start-c*75)/spinning.duration,0,1):1;
      if(spinning&&p<1&&!reduced){const offset=(t*.9+c*71)%reels.ch;for(let r=-1;r<4;r++){const s=BF.symbols[(Math.floor(t/84)+c*3+r+40)%BF.symbols.length];sg.globalAlpha=.62;sg.drawImage(tile(s,ART.symbols[s]||ART.family[(c+r+20)%Math.max(1,ART.family.length)]),reels.x+c*reels.cw+6,reels.y+r*reels.ch+offset,reels.cw-12,reels.ch-10);}sg.globalAlpha=1;}
      else for(let r=0;r<3;r++){
        const sym=(spinning?.grid||state.grid)[c][r],x=reels.x+c*reels.cw+6,y=reels.y+r*reels.ch+5;
        if(freePlay)contain(sg,tile(sym,artSlots[c]?.[r]||ART.symbols[sym]),x,y,reels.cw-12,reels.ch-10);else sg.drawImage(tile(sym,artSlots[c]?.[r]||ART.symbols[sym]),x,y,reels.cw-12,reels.ch-10);

      }
      sg.restore();
    }
    const win=winningPayline(t);
    if(win)drawWinningPayline(reels,win);
    drawnPayline=win;
  }
  const PAYLINE_DWELL=1400;
  function winningPayline(t){
    const wins=lastOutcome?.wins;
    if(spinning||!wins?.length||(scene&&(scene.type!=='free'||scene.stage!=='play')))return null;
    return wins[Math.floor(Math.max(0,t-outcomeAt)/PAYLINE_DWELL)%wins.length];
  }
  function drawWinningPayline(reels,win){
    const rows=BF.lines[win.line],points=[];
    for(let c=0;c<win.count;c++){
      const x=reels.x+c*reels.cw,y=reels.y+rows[c]*reels.ch;
      box(sg,x+9,y+8,reels.cw-18,reels.ch-16,10,'#f8db8214','#13241d',11);
      box(sg,x+9,y+8,reels.cw-18,reels.ch-16,10,null,'#ffde82',5);
      points.push([x+reels.cw/2,y+reels.ch/2]);
    }
    sg.save();
    sg.lineCap='round';sg.lineJoin='round';sg.beginPath();
    points.forEach(([x,y],c)=>c?sg.lineTo(x,y):sg.moveTo(x,y));
    sg.lineWidth=15;sg.strokeStyle='#14281fee';sg.stroke();
    sg.lineWidth=7;sg.strokeStyle='#ffdb73';sg.stroke();
    for(const [x,y] of points){
      sg.beginPath();sg.arc(x,y,10,0,Math.PI*2);sg.fillStyle='#ffedb1';sg.fill();
      sg.lineWidth=4;sg.strokeStyle='#173227';sg.stroke();
    }
    sg.restore();
    const count=lastOutcome.wins.length,number=lastOutcome.wins.indexOf(win)+1;
    const label=`LINE ${win.line+1}  ·  +${fmt(win.amount)} ${preview?'CHIPS':'LAYR'}${count>1?`  ·  ${number}/${count} WINS`:''}`;
    box(sg,478,195,444,38,10,'#142e23','#edc46b',2);
    fitText(sg,label,700,214,414,20,'#ffe5a5');
  }
  function footer(){
    const message=scene?sceneHint():status;if(!(scene?.type==='free'&&scene.stage==='play'))fitText(sg,message,700,772,1200,22,C.cream,'center','Georgia','400');
    txt(sg,preview?'PRACTICE BALANCE':'LAYR BALANCE',92,852,13,C.gold,'left','Arial','700');txt(sg,fmt(state.balance),92,893,43,C.cream,'left','Georgia');
    txt(sg,'TOTAL TREATS',700,852,13,C.gold,'center','Arial','700');txt(sg,fmt(state.free?state.freeBet:state.bet),700,893,36,C.cream,'center','Georgia');
    txt(sg,scene?.type==='free'?'LAP OF HONOUR TOTAL':'LAST AWARD',1308,852,13,C.gold,'right','Arial','700');txt(sg,fmt(scene?.type==='free'?state.freeTotal:state.lastWin),1308,893,43,C.cream,'right','Georgia');
    sg.strokeStyle='#8d784659';sg.beginPath();sg.moveTo(65,820);sg.lineTo(1335,820);sg.moveTo(480,845);sg.lineTo(480,915);sg.moveTo(920,845);sg.lineTo(920,915);sg.stroke();
    if(preview){box(sg,440,22,520,28,5,'#d9c185');txt(sg,'BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR',700,36,11,C.ink,'center','Arial','700');}
  }
  function hot(id,x,y,w,h,label,primary=true,small=''){
    const f=primary?'#e8ca88':'#183e2b';box(sg,x,y,w,h,10,f,primary?'#fff0c6':'#b89f62',2);txt(sg,label,x+w/2,y+h/2-(small?7:0),small?20:23,primary?C.ink:C.cream,'center','Arial','700');if(small)txt(sg,small,x+w/2,y+h/2+17,11,primary?'#546040':C.muted,'center');hits.push({id,x,y,w,h});
  }
  function sceneHint(){
    if(!scene)return status;if(scene.stage==='trigger')return 'The ring is yours.';if(scene.stage==='intro')return scene.rules;
    if(scene.type==='free')return `Community Takeover · ${state.freeCount} laps completed · all wins 2×`;
    if(scene.type==='pick'){const f=engine().feature(state);return f?`${f.picks.length} of 3 fetched · ${fmt(f.picks.reduce((a,i)=>a+f.awards[i],0)*f.bet)} LAYR revealed`:'All three fetched.';}
    if(scene.type==='hold'){const f=engine().feature(state),fr=f?.frames[f.index];return fr?`${fr.cells.filter(Boolean).length}/15 pedigrees · ${fr.left} respins left · new arrivals reset to 3`:'The pedigree is complete.';}
    return scene.stage==='summary'?'Every award is already recorded.':scene.rules||status;
  }
  function showRing(g,x=70,y=235,w=1260,h=500,t=0){
    box(g,x,y,w,h,14,'#234630','#b89755',2);g.save();rr(g,x+3,y+3,w-6,h-6,12);g.clip();
    g.strokeStyle='#2b5038';g.lineWidth=35;for(let a=0;a<9;a++){g.beginPath();g.moveTo(x+a*180-300,y+h);g.lineTo(x+a*180+100,y);g.stroke();}
    for(let row=0;row<2;row++){g.fillStyle=row?'#52613e':'#324d33';g.fillRect(x,y+row*22,w,18);for(let i=0;i<31;i++){g.fillStyle=['#b8a36e','#89956f','#d9c596'][i%3];g.beginPath();g.arc(x+22+i*42,y+10+row*22+(reduced?0:Math.sin(t/550+i)*2),5,0,Math.PI*2);g.fill();}}
    g.strokeStyle='#d9ca97';g.lineWidth=5;g.strokeRect(x+25,y+70,w-50,h-96);g.strokeStyle='#9e8b55';g.lineWidth=2;g.strokeRect(x+34,y+79,w-68,h-114);g.restore();
  }
  function sceneTitle(title,kicker,t){
    showRing(sg,70,238,1260,486,t);txt(sg,kicker,700,296,15,C.gold,'center','Arial','700');txt(sg,title,700,348,55,C.cream,'center','Georgia');
  }
  function drawScene(t){
    if(!scene)return;
    const age=t-scene.start,calm=reduced?0:1;
    if(scene.stage==='trigger'){
      sg.fillStyle='#072316cc';sg.fillRect(64,232,1272,498);const title=scene.title;
      const triggerSymbol=scene.type==='free'?'scatter':scene.type==='pick'?'vault':scene.type==='hold'?'chain':scene.type==='jackpot'?'bitcoin':null;
      if(triggerSymbol)for(let c=0;c<5;c++)for(let r=0;r<3;r++){
        if(state.grid[c][r]!==triggerSymbol||(scene.type==='jackpot'&&r!==1))continue;
        const pulse=reduced?1:1+.065*Math.sin(age/110),lift=reduced?0:26*clamp(age/600,0,1);
        sg.save();sg.globalAlpha=.66;sg.translate(R.x+c*R.cw+R.cw/2,R.y+r*R.ch+R.ch/2-lift);sg.scale(pulse,pulse);contain(sg,tile(triggerSymbol,artSlots[c]?.[r]||ART.symbols[triggerSymbol]),-92,-64,184,128);sg.restore();
      }
      rosette(sg,700,421,105,calm*Math.sin(age/900)*.08);txt(sg,title,700,568,58,C.cream,'center','Georgia');txt(sg,scene.tag,700,625,17,C.gold,'center','Arial','700');
      if(scene.type!=='free')hot('sceneSkip',1140,669,160,46,'SKIP',false);
      return;
    }
    if(scene.stage==='intro'){
      sceneTitle(scene.title,scene.tag,t);rosette(sg,700,470,73,0);fitText(sg,scene.rules,700,584,1090,25,C.cream,'center','Georgia','400');hot('sceneStart',475,638,450,62,'ENTER THE RING',true,'START');hot('sceneSkip',1132,651,160,49,'SKIP',false);return;
    }
    if(scene.stage==='summary'){
      sceneTitle(scene.title,'THE JUDGES’ RESULT',t);rosette(sg,310,478,88,calm*Math.sin(age/1700)*.03);const pct=reduced||state.turbo?1:clamp(age/1150,0,1);txt(sg,fmt(Math.floor(scene.total*(1-Math.pow(1-pct,3)))),800,467,81,C.light,'center','Georgia');txt(sg,preview?'PRACTICE CHIPS AWARDED':'LAYR AWARDED',800,528,14,C.gold,'center','Arial','700');fitText(sg,scene.detail,700,589,1120,24,C.cream,'center','Georgia','400');hot('sceneContinue',475,637,450,62,preview?'BACK TO THE PREVIEW':'BACK TO THE SHOW',true,'CONTINUE');return;
    }
    if(scene.type==='free'){
      box(sg,390,663,620,52,9,'#d5b16d');txt(sg,`${state.free} LAPS LEFT  ·  2× WINS  ·  ${fmt(state.freeTotal)} LAYR`,700,689,21,C.ink,'center','Arial','700');hot('sceneSkip',1140,666,172,48,'SKIP',false);return;
    }
    if(scene.type==='pick')drawPick(t);
    else if(scene.type==='hold')drawHold(t);
    else if(scene.type==='jackpot'){
      sceneTitle('BEST IN SHOW','CASINO JACKPOT',t);const rot=reduced?0:age/4500;rosette(sg,700,482,117,rot);const pct=reduced||state.turbo?1:clamp(age/3000,0,1);txt(sg,fmt(Math.floor(scene.total*(1-Math.pow(1-pct,3)))),700,647,64,C.light,'center','Georgia');
      const count=reduced?3:38;for(let i=0;i<count;i++){const x=110+(i*173)%1180,y=280+((age*(.035+i%3*.015)+i*79)%420);sg.save();sg.translate(x,y);sg.rotate(reduced?0:age/800+i);sg.fillStyle=['#e9c678','#f8e7be','#86b485'][i%3];sg.fillRect(-4,-9,8,18);sg.restore();}hot('sceneSkip',1135,662,160,47,'SKIP',false);
    }else if(scene.type==='gamble'){
      sceneTitle('SIT OR STAY','ONE EVEN CHANCE · DOUBLE OR NOTHING',t);rosette(sg,700,476,100,reduced?0:Math.sin(age/110)*clamp(1-age/1600,0,1)*.18);if(scene.result&&age>900)txt(sg,scene.result.win?'GOOD DOG!':'BETTER LUCK NEXT TIME',700,613,36,C.light,'center','Georgia');else txt(sg,'The judge makes the call…',700,613,29,C.cream,'center','Georgia');
    }
  }
  function drawPick(t){
    sceneTitle('FETCH!','NINE BALLS · THREE FETCHES',t);const f=engine().feature(state);if(!f)return;
    for(let i=0;i<9;i++){
      const x=252+(i%3)*448,y=432+Math.floor(i/3)*86,r=34,selected=f.picks.includes(i),event=animEvents.find(e=>e.type==='pick'&&e.i===i),p=event?clamp((t-event.t)/550,0,1):1;
      const yy=y-(selected&&!reduced?Math.sin(p*Math.PI)*48:0);sg.save();sg.translate(x,yy);sg.beginPath();sg.arc(0,0,r,0,Math.PI*2);sg.fillStyle=selected?'#f2d38c':'#b7c86a';sg.fill();sg.strokeStyle=selected?'#fff2bd':'#f0e7b5';sg.lineWidth=3;sg.stroke();
      if(selected&&p>.35){contain(sg,imageFor(ART.family[(i*3)%Math.max(1,ART.family.length)]||ART.symbols.bitcoin),-23,-24,46,46);}else{sg.beginPath();sg.arc(-29,0,29,-1.1,1.1);sg.arc(29,0,29,2.04,4.24);sg.strokeStyle='#fff3c4';sg.lineWidth=3;sg.stroke();txt(sg,String(i+1),0,0,22,C.ink,'center','Georgia');}
      sg.restore();if(selected){txt(sg,`${fmt(f.awards[i]*f.bet)} LAYR`,x+63,yy-4,27,C.light,'left','Georgia');txt(sg,`${f.awards[i]}× TREATS`,x+63,yy+25,12,C.gold,'left','Arial','700');}
      else if(f.picks.length<3)hits.push({id:'pick:'+i,x:x-85,y:y-40,w:300,h:80});
    }
    if(f.picks.length===3)hot('sceneCollect',477,668,448,46,'BRING IT HOME',true);else hot('sceneSkip',1130,669,170,46,'SKIP',false);
  }
  function drawHold(t){
    sceneTitle('PEDIGREE','THE WELSH FAMILY TREE',t);const f=engine().feature(state);if(!f)return;const fr=f.frames[f.index];
    sg.strokeStyle='#d7bd7b88';sg.lineWidth=2;for(let row=0;row<2;row++)for(let c=0;c<5;c++){sg.beginPath();sg.moveTo(218+c*242,415+row*91);sg.lineTo(218+c*242,461+row*91);sg.stroke();}sg.beginPath();sg.moveTo(218,461);sg.lineTo(1186,461);sg.stroke();
    for(let i=0;i<15;i++){
      const x=112+(i%5)*242,y=383+Math.floor(i/5)*91,w=218,h=78,val=fr.cells[i],ev=animEvents.find(e=>e.type==='lock'&&e.i===i),p=ev?clamp((t-ev.t)/430,0,1):1,scale=val&&!reduced?1+Math.sin(p*Math.PI)*.06:1;
      sg.save();sg.translate(x+w/2,y+h/2);sg.scale(scale,scale);box(sg,-w/2,-h/2,w,h,7,val?'#f2e8cd':'#122f21',val?'#dfbd73':'#687b4d',2);
      if(val){const it=scene.family?.[i]||ART.family[i%Math.max(1,ART.family.length)]||ART.symbols.bitcoin;contain(sg,imageFor(it),-w/2+7,-h/2+8,58,58);txt(sg,`${val}×`,20,-8,31,C.ink,'center','Georgia');fitText(sg,it?.symbol||'WELSH',26,23,134,11,'#52613f');}else{txt(sg,'AWAITING ARRIVAL',0,0,11,'#91a47e','center','Arial','700');}
      sg.restore();
    }
    txt(sg,`${fr.left} RESPINS LEFT`,273,690,19,C.gold,'center','Arial','700');
    if(engine().featureDone(f))hot('sceneCollect',470,661,460,54,f.full?'BEST IN SHOW!':'COMPLETE THE PEDIGREE',true);
    else hot('sceneRespin',470,661,460,54,'WELCOME THE NEXT LITTER',true,'RESPIN');hot('sceneSkip',1119,667,174,48,'SKIP',false);
    if(animEvents.some(e=>e.type==='reset'&&t-e.t<850)){txt(sg,'RESET TO THREE',1090,343,18,C.light,'center','Arial','700');}
  }
  function draw(t){hits=[];sg.save();backdrop(t);drawReels(t);drawScene(t);footer();sg.restore();renderedScene=scene?{type:scene.type,stage:scene.stage}:null;revision++;dirty=false;}
  const SCENES={
    free:{title:'COMMUNITY TAKEOVER',tag:'THE CROWD TAKES THE RING',rules:'Eight laps of honour. Every win pays 2×. Three Day Ones add four more.'},
    pick:{title:'FETCH!',tag:'THE CAT AND THE CORGI MEET',rules:'Fetch three of the nine balls. Each brings back a prize.'},
    hold:{title:'PEDIGREE',tag:'FOLLOW THE FAMILY TREE',rules:'Three respins. Every new pedigree resets the counter. Fill all fifteen for the jackpot.'},
    jackpot:{title:'BEST IN SHOW',tag:'CASINO JACKPOT',rules:'The full meter goes to the player who hit it. Everyone plays on equal terms.'},
    gamble:{title:'SIT OR STAY',tag:'A SINGLE 50/50 CALL',rules:'One even chance to double your award. A wrong call loses that award.'}
  };
  function stage(type,which,data={}){
    scene={...SCENES[type],...data,type,stage:which,start:now()};dirty=true;
    stageLog.push({type,stage:which,time:Date.now(),preview:!!preview});if(stageLog.length>200)stageLog.shift();
    if(which==='trigger'){quiet();sfx(type==='jackpot'?'jackpot':'bonus');celebrationUntil=now()+(type==='jackpot'?6000:2300);}
    if(type==='hold'&&!scene.family)scene.family=Array.from({length:15},()=>itemFor('chain'));
    updateBar();
  }
  function nextScene(resume=false){
    const f=engine().feature(state);
    if(f){stage(f.type==='vault'?'pick':'hold',resume?'intro':'trigger',{resumed:resume});return;}
    if(state.freeActive){
      if(state.free>0){if(!freeShown)stage('free',resume?'intro':'trigger');else{stage('free','play');autoAt=now()+(state.turbo?100:750);}return;}
      const sum=engine().endFree(state);if(sum){freeShown=false;stage('free','summary',{total:sum.total,detail:`${sum.count} laps of honour · every line and scatter win at 2×`,freeFinished:true});lastSummary={type:'free',total:sum.total,count:sum.count};save();return;}
    }
    scene=null;dirty=true;
    if(preview){
      if(preview.config.event==='gamble-win'||preview.config.event==='gamble-loss'){
        if(state.gamble){gamble('odd');return;}
      }
      completePreview();return;
    }
    if(autoLeft>0)autoAt=now()+(state.turbo?150:900);
    updateBar();
  }
  function markRound(p){
    if(!p)return;
    const ev=engine().evaluate(p.grid,p.bet,p.free?2:1);
    p.jackpot={level:p.bet,hit:!!(ev.jackpot||p.features.some(f=>f.type==='chain'&&f.full))};
    if(preview)p.lab=true;
  }
  function doSpin(fromFree=false){
    if(!active||actionLock||spinning||modalName)return false;
    if(scene&&!(scene.type==='free'&&scene.stage==='play'))return false;
    if(engine().busy(state))return false;
    if(!fromFree&&state.free&&!preview)return false;
    actionLock=true;
    const beforeFund=copy(state.machineFund),paid=state.free===0;
    try{
      if(paid&&!preview){state.machineFund.balance=Math.round((state.machineFund.balance+state.bet*.01)*100)/100;casinoJackpot.contribute(state.bet,state.bet);}
      const rng=preview?preview.runner.spinRng(state):undefined;
      const p=engine().start(state,rng);markRound(p);save(); // Result + round ID durably committed before any art or animation.
      chooseArt(p.grid);spinning={grid:p.grid,start:now(),duration:reduced?70:state.turbo?150:770,id:p.id};stopTicks=0;lastOutcome=null;
      caps.spin=now();if(autoLeft&&paid)autoLeft--;inform(p.free?'A lap of honour…':'The entrants take their places…');sfx('click');dirty=true;
      return true;
    }catch(e){state.machineFund=beforeFund;quiet();toast(e.message);return false;}finally{actionLock=false;}
  }
  function finishSpin(){
    if(!spinning)return;spinning=null;
    const p=state.pending;if(!p)return;
    try{const r=engine().settle(state);if(r)afterResult(r);}catch(e){quiet();toast(e.message);}
  }
  function afterResult(r){
    lastOutcome=r;outcomeAt=now();const h=state.history[0];if(h){h.jackpot=copy(r.round.jackpot||{level:r.round.bet,hit:!!r.jackpotWin});if(preview){h.lab=true;h.kind='LAB · '+h.kind;}}
    if(r.total){sfx('win');inform(`${fmt(r.total)} ${preview?'practice chips':'LAYR'} awarded. ${r.wins.length?r.wins.length+' winning line'+(r.wins.length===1?'':'s')+'.':''}`);}else inform('A fine field. Take another turn when you’re ready.');
    if(r.freeAward&&r.round.free)inform(`COMMUNITY TAKEOVER · +${r.freeAward} laps · ${state.free} remaining`);
    save();
    if(r.jackpotWin){casinoJackpot.settle(r.round.bet);stage('jackpot','trigger',{total:r.jackpotWin,detail:'Five WELSH on the centre row',resumeAfter:true});return;}
    if(state.features.length||state.freeActive){quiet();nextScene();return;}
    scene=null;if(preview){nextScene();return;}
    if(autoLeft)autoAt=now()+(r.wins.length?(state.turbo?750:PAYLINE_DWELL+100):(state.turbo?130:800));updateBar();
  }
  function sceneStart(){
    if(!scene)return;if(scene.stage!=='intro')return;
    if(scene.type==='free'){freeShown=true;stage('free','play');autoAt=now()+300;}
    else stage(scene.type,'play',scene);
  }
  function pick(index){
    if(!scene||scene.type!=='pick'||scene.stage!=='play'||actionLock)return;
    actionLock=true;try{const r=engine().pick(state,index);if(r){animEvents.push({type:'pick',i:index,t:now()});sfx('pick');save();}}finally{actionLock=false;}
  }
  function respin(){
    if(!scene||scene.type!=='hold'||scene.stage!=='play'||actionLock)return;
    const f=engine().feature(state);if(!f||engine().featureDone(f))return;
    actionLock=true;try{const fr=engine().respin(state);if(fr){fr.added.forEach((i,k)=>animEvents.push({type:'lock',i,t:now()+k*65}));if(fr.added.length)animEvents.push({type:'reset',t:now()});sfx(fr.added.length?'lock':'stop');scene.lastRespin=now();save();}}finally{actionLock=false;}
  }
  function collect(){
    if(!scene||!['pick','hold'].includes(scene.type)||actionLock)return;const f=engine().feature(state);if(!f||!engine().featureDone(f))return;
    actionLock=true;try{const count=f.type==='vault'?f.picks.length:f.frames.at(-1).cells.filter(Boolean).length,steps=f.type==='chain'?f.frames.length-1:0;const r=engine().collect(state);if(!r)return;
      const type=scene.type,total=r.amount;lastSummary={type,total,count,steps};save();
      const detail=type==='pick'?`${count} balls fetched · all three prizes awarded`:`${count} pedigrees welcomed · ${steps} respins played`;
      stage(type,'summary',{total,detail,afterJackpot:r.jackpotWin||0});sfx('win');
    }finally{actionLock=false;}
  }
  function continueScene(){
    if(!scene||scene.stage!=='summary')return;
    const previous=scene;if(previous.afterJackpot){stage('jackpot','trigger',{total:previous.afterJackpot,detail:'All fifteen pedigrees complete',resumeAfter:true});return;}
    scene=null;nextScene();
  }
  function skipScene(){
    if(!scene)return;const type=scene.type;quiet();
    if(type==='jackpot'){stage('jackpot','summary',{...scene,total:scene.total,detail:scene.detail||'The full CASINO JACKPOT meter',stage:'summary'});return;}
    if(type==='gamble'){if(scene.result)gambleSummary();return;}
    if(type==='pick'||type==='hold'){
      const f=engine().feature(state);if(!f)return;
      if(type==='pick'){for(let i=0;i<9&&f.picks.length<3;i++)if(!f.picks.includes(i))engine().pick(state,i);}else while(!engine().featureDone(f))engine().respin(state);
      scene.stage='play';collect();return;
    }
    if(type==='free'){
      if(spinning)finishSpin();if(!state.freeActive)return;
      // Each omitted lap is still dealt and settled by the pristine/shared engine. No payouts are synthesized.
      let guard=0;while((state.free||state.pending||state.features.length)&&guard++<300){
        while(state.features.length){const f=engine().feature(state);if(f.type==='vault'){for(let i=0;i<3;i++)if(!f.picks.includes(i))engine().pick(state,i);while(f.picks.length<3){const i=f.awards.findIndex((_,i)=>!f.picks.includes(i));engine().pick(state,i);}}else while(!engine().featureDone(f))engine().respin(state);engine().collect(state);}
        if(state.pending){const r=engine().settle(state);if(preview&&state.history[0])state.history[0].lab=true;continue;}
        if(state.free){const p=engine().start(state,preview?preview.runner.spinRng(state):undefined);markRound(p);engine().settle(state);if(preview&&state.history[0]){state.history[0].lab=true;state.history[0].kind='LAB · Free spin';}}
      }
      spinning=null;chooseArt(state.grid);save();scene=null;nextScene();
    }
  }
  function gamble(choice){
    if(spinning||state.features.length||state.free||!state.gamble||actionLock)return;
    quiet();closePanel();const stake=state.gamble;actionLock=true;
    try{const r=engine().gamble(state,choice,preview?preview.runner.gambleRng(choice):undefined);if(!r)return;state.history.unshift({id:'gamble-'+Date.now(),time:Date.now(),bet:0,win:r.amount,kind:preview?'LAB · Sit or Stay':'Sit or Stay',feature:r.win?'WON':'LOST',stake:r.stake,hash:r.hash});state.history=state.history.slice(0,50);save();stage('gamble','trigger',{result:r,total:r.amount,detail:r.win?`${fmt(stake)} doubled to ${fmt(r.amount)}`:`The ${fmt(stake)} LAYR award was lost`,autoIntro:true});}
    finally{actionLock=false;}
  }
  function gambleSummary(){if(!scene?.result)return;const r=scene.result;stage('gamble','summary',{...scene,total:r.amount,detail:scene.detail});lastSummary={type:'gamble',total:r.amount,win:r.win};sfx(r.win?'win':'loss');}
  function mainAction(){
    if(spinning)return;
    if(scene){if(scene.stage==='intro')sceneStart();else if(scene.stage==='summary')continueScene();else if(scene.stage==='play'&&scene.type==='hold'){const f=engine().feature(state);engine().featureDone(f)?collect():respin();}else if(scene.stage==='play'&&scene.type==='pick'){const f=engine().feature(state);if(f.picks.length===3)collect();else{const i=f.awards.findIndex((_,i)=>!f.picks.includes(i));pick(i);}}return;}
    doSpin();
  }
  function betStep(dir){if(spinning||scene||state.free||state.features.length||preview){toast('Finish the current round before changing treats.');return;}quiet();const i=BF.bets.indexOf(state.bet);state.bet=BF.bets[clamp(i+dir,0,4)];state.gamble=0;save();sfx('click');updateBar();}
  function autoToggle(){
    if(autoLeft){quiet();return;}if(preview||scene||spinning||modalName||state.balance<state.bet)return;autoLeft=25;autoAt=now()+100;inform('AUTO-WALK · up to 25 rounds; stops for any bonus, panel or hidden tab.');
  }
  function buttonPulse(name){caps[name]=now();actionSerial++;dirty=true;}
  function control(name){
    name=({fairplay:'fair',holder:'fund',skip:'sceneSkip',primary:'spin',collect:'sceneCollect',moon:'sit',doom:'stay'})[name]||name;
    if(!active&&name!=='fullscreen'&&name!=='exitFullscreen')return;
    buttonPulse(name);
    if(name==='spin')mainAction();else if(name==='lever'){leverStart=now();sfx('lever');mainAction();}
    else if(name==='betDown')betStep(-1);else if(name==='betUp')betStep(1);else if(name==='auto')autoToggle();
    else if(name==='pays')openPays();else if(name==='fair')openFair();else if(name==='history')openHistory();else if(name==='fund')openFund();else if(name==='settings')openSettings();else if(name==='account')openAccount();
    else if(name==='lab'||name==='preview')openLab();else if(name==='test'&&TEST)openTest();
    else if(name==='sound'){state.muted=!state.muted;save();if(!state.muted)sfx('win');updateBar();}
    else if(name==='turbo'){state.turbo=!state.turbo;save();updateBar();}
    else if(name==='fullscreen')requestFullscreen(true);else if(name==='exitFullscreen')requestFullscreen(false);
    else if(name==='max')betStep(BF.bets.length);else if(name==='gamble'&&state.gamble&&!scene)openPanel('gamble','Sit or Stay', '<p>Call the parity to double the award, or collect it.</p><div class="panel-actions"><button data-action="sit">SIT · ODD</button><button data-action="stay">STAY · EVEN</button><button data-action="bankWin">COLLECT</button></div>');else if(name==='pickNext')mainAction();else if(name==='sit')gamble('odd');else if(name==='stay')gamble('even');else if(name==='bankWin'){closePanel();state.gamble=0;save();inform('Your award stays in your balance.');}
    else if(name==='sceneStart')sceneStart();else if(name==='sceneContinue')continueScene();else if(name==='sceneRespin')respin();else if(name==='sceneCollect')collect();else if(name==='sceneSkip')skipScene();else if(name.startsWith('pick:'))pick(Number(name.split(':')[1]));
    else if(name==='leavePreview')exitPreview();else if(name==='close')closePanel();else if(name==='sources')openSources();
    updateBar();
  }
  function sceneAction(){if(!scene)return null;if(scene.stage==='intro')return ['sceneStart','ENTER THE RING · START'];if(scene.stage==='summary')return ['sceneContinue','BACK TO THE SHOW · CONTINUE'];if(scene.stage==='play'){if(scene.type==='hold')return engine().featureDone(engine().feature(state))?['sceneCollect','COMPLETE THE PEDIGREE · COLLECT']:['sceneRespin','WELCOME THE NEXT LITTER · RESPIN'];if(scene.type==='pick'){const f=engine().feature(state);return f?.picks.length===3?['sceneCollect','BRING IT HOME · COLLECT']:['pickNext','FETCH THE NEXT BALL'];}}return null;}
  let suite=null,lastSuite=null,selectedPreview='free';
  const realSnapshot=s=>({balance:s.balance,jackpots:copy(s.jackpots),fund:copy(s.machineFund),spins:s.spins,wagered:s.wagered,paidOut:s.paidOut,free:s.free,history:copy(s.history)});
  function enterPreview(config){
    if(preview)exitPreview({silent:true,keepSuite:true});
    if(spinning||state.pending||state.features.length||state.freeActive){toast('Finish your current round before entering the preview.');return;}
    quiet();closePanel();
    const runner=PX_LAB_RNG.create(PX_PURE,{...config,practice:true});
    const real=state,snapshot=realSnapshot(real),oldStatus=status,oldOutcome=lastOutcome,oldOutcomeAt=outcomeAt;
    preview={runner,config:{...config,seed:runner.seed,mode:'seeded'},real,snapshot,oldStatus,oldOutcome,oldOutcomeAt,startBalance:100000,started:Date.now(),lastStep:0};
    state=PX_PURE.fresh();state.balance=100000;state.bet=Number(config.bet)||100;state.muted=real.muted;state.volume=real.volume;state.turbo=real.turbo;state.reduced=real.reduced;state.machineFund={balance:0,lastPayPerTwin:null,qualifiedTwins:null};
    replayConfig=copy(preview.config);lastOutcome=null;freeShown=false;scene=null;stageLog=[];chooseArt(state.grid);inform('BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR');$('previewStrip').hidden=false;updateBar();
    if(config.event==='fund-info'){openFund(true);if(suite){const run=preview,batch=suite;setTimeout(()=>{if(preview===run&&suite===batch&&active){closePanel();completePreview();}},1700);}return;}
    doSpin();
  }
  function exitPreview(options={}){
    if(!options.keepSuite)suite=null;
    if(!preview)return;const p=preview;p.runner.close();spinning=null;scene=null;freeShown=false;autoAt=0;state=p.real;preview=null;lastOutcome=p.oldOutcome;outcomeAt=p.oldOutcomeAt;status=p.oldStatus;animEvents=[];chooseArt(state.grid);$('previewStrip').hidden=true;closePanel();
    const restored=JSON.stringify(realSnapshot(state))===JSON.stringify(p.snapshot);dirty=true;updateBar();
    if(!options.keepSuite)suite=null;
    if(!restored)throw Error('Practice isolation check failed.');
    if(!options.silent)toast('Preview ended. Your balance, fund, jackpot and spin count are unchanged.');
  }
  function completePreview(){
    if(!preview)return;
    lastPreview={config:copy(preview.config),event:preview.config.event,seed:preview.runner.seed,bet:state.bet,payout:state.paidOut+state.gambleNet,enginePaidOut:state.paidOut,net:state.balance-preview.startBalance,spins:state.spins,history:copy(state.history),summary:lastSummary,stages:copy(stageLog),isolation:true};
    if(suite){suite.results.push(lastPreview);const batch=suite,next=batch.queue.shift();exitPreview({silent:true,keepSuite:true});if(next){setTimeout(()=>{if(suite===batch&&active)enterPreview({...batch.config,event:next});},300);}else{lastSuite=batch.results;suite=null;openLab();}return;}
    exitPreview({silent:true});openLab();
  }
  function runAll(config){suite={config,queue:PX_LAB_RNG.items.map(x=>x.id),results:[]};enterPreview({...config,event:suite.queue.shift()});}
  function previewTick(t){
    if(!preview||!suite||modalName)return;
    if(scene&&t-scene.start>750){
      if(scene.stage==='intro'){sceneStart();return;}if(scene.stage==='summary'){continueScene();return;}
      if(scene.stage==='play'&&t-preview.lastStep>600){preview.lastStep=t;if(scene.type==='pick'||scene.type==='hold')mainAction();}
    }
  }
  function openPanel(name,title,html){
    quiet();modalName=name;$('panelContent').innerHTML=`<h2 id="panelTitle">${title}</h2>${html}`;
    try{if(!$('modal').open)$('modal').showModal();}catch(_){$('modal').setAttribute('open','');$('panelShade').hidden=false;}
    window.parent.postMessage({type:'PX_PANEL',open:true},'*');dirty=true;updateBar();
  }
  function closePanel(){if($('modal').open)$('modal').close();$('modal').removeAttribute('open');$('panelShade').hidden=true;modalName='';window.parent.postMessage({type:'PX_PANEL',open:false},'*');dirty=true;updateBar();}
  function openPays(){
    const rows=Object.entries(BF.pays).map(([s,p])=>`<tr><td>${imageFor(ART.symbols[s])?`<img alt="" src="${esc(ART.symbols[s].image||ART.symbols[s].collectionSnapshot?.image)}">`:''}${NAMES[s]}</td>${p.map(v=>`<td class="num">${v}×</td>`).join('')}</tr>`).join('');
    const lines=BF.lines.map((line,i)=>`<div class="line-box"><svg viewBox="0 0 100 42" aria-label="Payline ${i+1}">${[0,1,2].map(r=>`<path d="M 10 ${9+r*12} H90" stroke="#38573d" stroke-width="1"/>`).join('')}<polyline points="${line.map((r,c)=>(10+c*20)+','+(9+r*12)).join(' ')}" fill="none" stroke="#e4c17b" stroke-width="2.4"/></svg><small>LINE ${i+1}</small></div>`).join('');
    openPanel('pays','Know your pedigree.',`<p>Five reels, three rows and twenty fixed lines. Line wins run from the leftmost reel. The best matching symbol pays on each line; Happy Welsh substitutes for ordinary line symbols.</p><table><thead><tr><th>Entrant</th><th class="num">3</th><th class="num">4</th><th class="num">5</th></tr></thead><tbody>${rows}</tbody></table><p class="fine">Multiples of the line bet: total bet ÷ 20. At 100 LAYR, a 6× line award is 30 LAYR. Bets: 20 / 40 / 100 / 200 / 500.</p><h3>The show programme</h3><p><b>Community Takeover:</b> three, four or five Day One records pay 2×, 5× or 10× the total bet and start eight free spins at 2×. A retrigger adds four, up to 24 awarded spins.</p><p><b>Fetch!:</b> three or more LEO–WELSH symbols open nine balls. Pick three; each prize is independently drawn from 1, 2, 2, 3, 4, 5, 8, 10 or 15 times the total bet.</p><p><b>Pedigree:</b> five or more cards lock in values of 1, 2, 3, 5 or 10 times the bet. Three respins; each empty cell has a 1-in-25 chance of locking. A new lock resets the counter.</p><p><b>Best in Show:</b> five WELSH on the centre row, without wilds, or a full Pedigree grid wins the Casino Jackpot.</p><p><b>Sit or Stay:</b> after a paid win without a bonus, one optional 50/50 double-or-nothing call. Sit maps to odd; Stay maps to even. Leave the award in your balance by collecting it or starting your next spin.</p><div class="panel-actions"><button class="primary" data-action="lab">TRY EVERY BONUS</button><button data-action="fair">FAIR PLAY</button><button data-action="sources">THE REAL ART</button></div><h3>All twenty lines</h3><div class="line-grid">${lines}</div>`);
  }
  function openFair(){openPanel('fair','Equal terms. Every player.',`<div class="large-number">94.38<span style="font-size:30px">%</span></div><p>Design return estimate, not a certified RTP. A long-run estimate is not a promise for any individual session.</p><table><tbody><tr><td>Line wins</td><td class="num">59.7%</td></tr><tr><td>Scatter awards</td><td class="num">1.5%</td></tr><tr><td>Free spins</td><td class="num">8.5%</td></tr><tr><td>Fetch! picks</td><td class="num">11.9%</td></tr><tr><td>Pedigree hold and respin</td><td class="num">10.3%</td></tr><tr><td>Casino Jackpot</td><td class="num">2.4%</td></tr></tbody></table><p class="fine">Component percentages are rounded, so their displayed sum is 94.3%. The underlying design estimate is 94.38%.</p><p>Free spins and Fetch! each occur about once in 140 spins; Pedigree about once in 290; the jackpot about once in 113,000. Sit or Stay is an even 50/50 bet.</p><div class="callout"><p>The Casino Jackpot is shared by every machine and pays whoever hits it. The Machine Fund comes out of the house’s share and never reduces a player’s win. No wallet, NFT or WELSH-family token is required to play or win.</p></div><h3>About this standalone build</h3><p>This page uses test LAYR and the unchanged Block Fortune v2 engine. The local meter starts at 500× the bet and takes 2% of each paid bet. The shared Casino Service and live claims are pending; this standalone page does not claim a live, pooled meter or real payouts.</p><p>Each outcome and round ID is stored before animation. A reload resumes the committed round and cannot reroll or credit it twice. Cosmetic artwork selection uses a separate random source.</p><p>Bonus previews use a pristine copy of the same engine, a separate practice state and no account writes, jackpot contributions or fund accrual. Scripted RNG is available only inside that preview.</p><div class="panel-actions"><button data-action="history">SHOW RECORD</button><button data-action="fund">THE COMMUNITY FUND</button></div>`);}
  function openFund(inPreview=false){
    const real=preview?preview.real:state,f=real.machineFund||{},end=machineFund.periodEnd().toLocaleString('en-GB',{timeZone:'UTC',weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    openPanel('fund','A share for the whole floor.',`<span class="eyebrow">TYPE W · WEEKLY MACHINE FUND</span><div class="large-number">${fmt(f.balance)} <span style="font-size:20px">test LAYR</span></div><p class="fine">Local display accrual from this machine’s paid bets. Live service and claims pending.</p><table><tbody><tr><td>Period ends</td><td>${esc(end)} UTC</td></tr><tr><td>Eligible Forever Twins</td><td>Checking</td></tr><tr><td>Last period’s pay per twin</td><td>Checking</td></tr><tr><td>Snapshots and claims</td><td>Service pending · display only</td></tr></tbody></table><ol><li>One percent of paid bets comes from the house’s share. Player wins and the 94.38% design return stay unchanged.</li><li>Each Forever Twin in any live collection has one share if it was held at both the period’s first block and its snapshot block.</li><li>Holders claim their share after the period closes. Unclaimed shares roll forward. Live claiming is not enabled in this test build.</li></ol><p>Happy Welsh twins join when their collection has a Forever Twins helper. The retrieved registry has no Happy Welsh helper as of 3 November 2026. A failed or unavailable live read stays “Checking”; it never becomes a zero.</p><div class="callout"><p>The WELSH tokens on the reels are artwork. Holding those tokens earns nothing from this machine. Nothing is required to play, win or hit Best in Show.</p></div><div class="panel-actions"><a href="https://xtrata.xyz/forever-twins/" target="_blank" rel="noopener">Explore Forever Twins ↗</a>${inPreview?'<button class="primary" id="fundPreviewDone">FINISH PREVIEW</button>':''}</div>`);
    if(inPreview)$('fundPreviewDone').onclick=()=>{closePanel();completePreview();};
  }
  function openHistory(){
    const records=preview?state.history:state.history,rows=records.map(h=>`<tr><td>${esc(new Date(h.time).toLocaleTimeString('en-GB'))}<br><span class="fine">${esc(h.kind)}</span></td><td>${esc((h.feature||'—').replaceAll('GENESIS BLOCK','BEST IN SHOW').replaceAll('CHAIN','PEDIGREE').replaceAll('VAULT','FETCH!').replaceAll('FREE SPINS','COMMUNITY TAKEOVER'))}</td><td class="num">${fmt(h.bet)}</td><td class="num">${fmt(h.win)}</td></tr>`).join('');
    openPanel('history','The show record.',`<p>The latest fifty settled actions${preview?' in this practice run':''}. Bonuses are added to the round that triggered them.</p><table><thead><tr><th>Time / action</th><th>Feature</th><th class="num">Bet</th><th class="num">Award</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No rounds yet. The ring is ready.</td></tr>'}</tbody></table>${!preview&&lastPreview?`<h3>Last bonus preview</h3><p class="fine">LAB · ${esc(lastPreview.event)} · ${lastPreview.spins} spins · ${fmt(lastPreview.payout)} practice chips paid · real account unchanged.</p>`:''}<div class="panel-actions"><button id="exportHistory">SAVE SHOW RECORD</button></div>`);
    $('exportHistory').onclick=()=>{const data={machine:GAME_ID,currency:preview?'PRACTICE':'LAYR',history:records,preview:lastPreview};download('corgi-kennel-history.json',JSON.stringify(data,null,2),'application/json');};
  }
  function openAccount(){openPanel('account','Your seat at the show.',`<div class="large-number">${fmt(state.balance)}</div><p>${preview?'Practice chips':'Test LAYR'} available. The standalone host supplies one shared account to the game. There is no wallet link, token minimum or cash withdrawal.</p><p>Paid bets: ${fmt(state.wagered)} LAYR. Awards: ${fmt(state.paidOut)} LAYR. Settled spins: ${fmt(state.spins)}.</p><div class="panel-actions"><button data-action="history">SHOW RECORD</button>${TEST?'<button data-action="test">TEST CONTROLS</button>':''}</div>`);}
  function openSettings(){openPanel('settings','Settle into the show.',`<div class="switch-row"><label for="settingSound">Brass band &amp; kennel sounds</label><input type="checkbox" id="settingSound" ${!state.muted?'checked':''}></div><div class="switch-row"><label for="settingVolume">Volume</label><input type="range" id="settingVolume" min="0" max="1" step="0.05" value="${state.volume??.4}"></div><div class="switch-row"><label for="settingTurbo">Quick Step / turbo</label><input type="checkbox" id="settingTurbo" ${state.turbo?'checked':''}></div><div class="switch-row"><label for="settingReduced">Reduced motion</label><input type="checkbox" id="settingReduced" ${reduced?'checked':''}></div><p class="fine">Winning paylines appear automatically and cycle through each award until the next spin.</p><p class="fine">Sound needs a click or tap to begin. Listening sign-off is still owed. Reduced motion calms reel motion and limits the jackpot to three confetti pieces.</p><h3>At your fingertips</h3><div class="chip-list"><span>SPACE · FETCH / NEXT</span><span>F · FULLSCREEN</span><span>L · BONUS PREVIEW</span><span>ESC · CLOSE / EXIT</span><span>M · SOUND</span></div>`);
    $('settingSound').onchange=e=>{state.muted=!e.target.checked;save();if(!state.muted)sfx('win');};$('settingVolume').oninput=e=>{state.volume=Number(e.target.value);if(masterGain)masterGain.gain.value=state.volume;save();};$('settingTurbo').onchange=e=>{state.turbo=e.target.checked;save();};$('settingReduced').onchange=e=>{state.reduced=e.target.checked;reduced=e.target.checked;save();};
  }
  function openSources(){
    const entries=Object.entries(ART.symbols).map(([s,it])=>`<article class="source">${it.image?`<img src="${esc(it.image)}" alt="${esc(it.name)}">`:''}<b>${esc(NAMES[s])}</b><p>${esc(it.availability==='bundled'?'Verified official artwork':it.displayNotice||'Logo pending')} ${s==='wild'?'· NOT YET FOREVER':''}</p><p><code>${esc(it.contract)}</code></p><a href="${esc(it.metadataSource)}" target="_blank" rel="noopener">Exact-contract metadata ↗</a></article>`).join('');
    openPanel('sources','A real family. Real records.',`<p>Each symbol follows its exact Stacks contract, not just a ticker. Artwork is bundled for offline play. Snapshot: 3 November 2026. Logos remain the property of their projects and need permission before a public release.</p><div class="source-grid">${entries}</div><h3>Day One</h3><p>The WELSH launch is verified at Stacks block ${fmt(ART.dayOne?.blockHeight)} on 24 November 2021. The data tile is explicitly a snapshot.</p><p><a href="${esc(ART.dayOne?.explorer||'#')}" target="_blank" rel="noopener">View the launch transaction ↗</a></p><h3>The pedigree register</h3><p>${ART.family.length} metadata-verified contracts are bundled. Distinct tokens can legitimately use the same official logo; these are not claimed as unique artworks.</p><p class="fine">${esc(ART.family.map(x=>x.name).join(' · '))}</p><h3>Availability</h3><p>BABYWELSH and Phoenix Welsh artwork remain unavailable at the metadata-linked sources and are marked LOGO PENDING. Happy Welsh is desaturated and stamped NOT YET FOREVER. The LEO–WELSH metadata genuinely supplies a tiny pixel image; it is preserved as provided.</p>`);
  }
  function openLab(){
    quiet();
    if(preview){openPanel('lab','You’re in the practice ring.',`<p>Finish the current demonstration or leave it. Your real account is set aside and unchanged.</p><div class="panel-actions"><button data-action="close">CONTINUE PREVIEW</button><button data-action="leavePreview">LEAVE PREVIEW</button></div>`);return;}
    if(spinning||state.features.length||state.freeActive){toast('Finish this round, then open the bonus preview.');return;}
    const cards=PX_LAB_RNG.items.map(it=>`<button class="choice ${selectedPreview===it.id?'active':''}" data-preview="${it.id}" aria-pressed="${selectedPreview===it.id}"><b>${esc(it.label)}</b><small>${esc(it.description)}</small></button>`).join('');
    let last='';if(lastPreview)last=`<div class="callout"><p><b>Last run:</b> ${esc(lastPreview.event)} · ${fmt(lastPreview.payout)} practice chips paid · ${lastPreview.spins} spins. Real account unchanged.</p><p class="fine">Seed ${esc(lastPreview.seed)}</p></div>`;
    if(lastSuite)last+=`<h3>Run all: ${lastSuite.length} completed</h3><div class="lab-status">${lastSuite.map(x=>`${x.event} — ${fmt(x.payout)} practice chips · ${x.spins} spins · account unchanged`).join('\n')}</div>`;
    openPanel('lab',TEST?'The Bonus Lab.':'Try the whole show.',`<p>Choose any feature and play its full presentation. These are practice chips, never real LAYR. The original engine deals every demonstration.</p><div class="cards">${cards}</div><div class="form-row"><label>Treats<select id="labBet">${BF.bets.map(b=>`<option value="${b}" ${b===state.bet?'selected':''}>${b} practice chips</option>`).join('')}</select></label><label>Randomness<select id="labMode"><option value="seeded">Seeded / repeatable</option><option value="random">Random seed</option></select></label><label>Seed<input id="labSeed" type="text" maxlength="100" value="CorgiKennel-21"></label></div><div class="panel-actions"><button class="primary" id="labRun">RUN SELECTED</button><button id="labReplay" ${replayConfig?'':'disabled'}>REPLAY LAST</button><button id="labAll">RUN ALL 12</button></div>${last}<p class="fine">Replay repeats reel stops, prize assignments and round IDs. Choose the same Fetch! balls to receive the same picked total. Skip fetches the lowest-numbered unopened balls.</p>`);
    $('panelContent').querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>{selectedPreview=b.dataset.preview;$('panelContent').querySelectorAll('[data-preview]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});});
    const cfg=()=>({event:selectedPreview,bet:Number($('labBet').value),mode:$('labMode').value,seed:$('labSeed').value||'CorgiKennel-21'});
    $('labRun').onclick=()=>enterPreview(cfg());$('labReplay').onclick=()=>{if(replayConfig)enterPreview(copy(replayConfig));};$('labAll').onclick=()=>runAll(cfg());
  }
  function openTest(){
    if(!TEST)return;
    const report=window.CK_RTP_REPORTS||[];
    openPanel('test','The judges’ test bench.',`<p>Standalone developer controls. These controls are hidden when the pack is loaded without <code>PX_STANDALONE_TEST</code>.</p><div class="form-row"><label>Test twin artwork<select id="testTwins"><option value="unknown">Unknown / checking</option><option value="none">None — desaturated</option><option value="some">Some — marked test simulation</option><option value="all">All — marked test simulation</option></select></label></div><div class="panel-actions"><button id="resetBalance">RESET TO 10,000 TEST LAYR</button><button data-action="lab">BONUS LAB</button></div><h3>Return simulation</h3><p>The two five-million-spin command-line runs use the exact unmodified engine. A browser run below uses separate temporary state and never touches your account.</p><div class="lab-status">${report.length?report.map(r=>`Seed ${r.seed} · ${fmt(r.paidSpins||r.spins||5000000)} paid spins · RTP ${Number(r.rtpPercent??r.rtp??0).toFixed(6)}%`).join('\n'):'Command-line report will be bundled after the long runs finish.'}</div><div class="form-row"><label>Paid spins<select id="rtpCount"><option value="25000">25,000 · smoke run</option><option value="5000000">5,000,000 · full run</option></select></label><button id="rtpRun">RUN ENGINE</button></div><div id="rtpProgress" class="lab-status" aria-live="polite">Ready. Results include free spins and all feature payouts.</div><h3>Readiness</h3><p>Real-GPU Safari and Chrome testing, listening sign-off and project logo permissions remain release checks. Live fund claims and the pooled Casino Service are explicitly pending.</p>`);
    $('testTwins').value=testTwins;$('testTwins').onchange=e=>{testTwins=e.target.value;tiles.clear();dirty=true;};
    $('resetBalance').onclick=()=>{if(preview||spinning||scene){toast('Finish the current round or leave preview before resetting.');return;}LAYR.saveRoom({bank:10000});toast('Standalone play balance reset to 10,000 LAYR.');};
    $('rtpRun').onclick=()=>browserRTP(Number($('rtpCount').value));
  }
  async function browserRTP(n){
    const btn=$('rtpRun'),out=$('rtpProgress');btn.disabled=true;let h=20261103;const rng=max=>{h=(h+0x6d2b79f5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return Math.floor(((t^(t>>>14))>>>0)/4294967296*max);};
    const s=PX_PURE.fresh();s.balance=1e12;s.bet=100;const begin=now();let done=0;
    try{for(;done<n;done++){do{PX_PURE.start(s,rng);PX_PURE.settle(s);while(s.features.length){const f=PX_PURE.feature(s);if(f.type==='vault'){for(let i=0;i<3;i++)PX_PURE.pick(s,i);}else while(!PX_PURE.featureDone(f))PX_PURE.respin(s);PX_PURE.collect(s);}if(s.freeActive&&!s.free)PX_PURE.endFree(s);s.history=[];}while(s.free);if(done%500===0){out.textContent=`${fmt(done)} / ${fmt(n)} paid spins · ${(s.paidOut/Math.max(1,s.wagered)*100).toFixed(4)}% so far`;await new Promise(r=>setTimeout(r,0));}}
      out.textContent=`COMPLETE · ${fmt(n)} paid spins\nRTP ${(s.paidOut/s.wagered*100).toFixed(6)}% · ${((now()-begin)/1000).toFixed(1)} seconds\nPaid ${fmt(s.paidOut)} / wagered ${fmt(s.wagered)}. Real account untouched.`;
    }catch(e){out.textContent=e.message;}finally{btn.disabled=false;}
  }
  function download(name,text,mime){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:mime}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function updateBar(){
    const blocked=spinning||!!scene||!!preview,button=(action,label,sub,extra='')=>`<button data-action="${action}" ${extra}><b>${label}</b>${sub?`<small>${sub}</small>`:''}</button>`;
    const next=sceneAction(),featureBar=$('featureBar');
    const f=engine().feature(state),pickControls=scene?.type==='pick'&&scene.stage==='play'&&f&&!engine().featureDone(f);
    const featureHTML=(next?`<button id="fbGo" data-action="${next[0]}">${next[1]}</button>`:'')+(pickControls?f.awards.map((_,i)=>`<button data-pick="${i}" data-action="pick:${i}" ${f.picks.includes(i)?'disabled':''}>Ball ${i+1}</button>`).join(''):'');
    if(lastFeatureHTML!==featureHTML){lastFeatureHTML=featureHTML;featureBar.innerHTML=featureHTML;}
    const html=`${next?button(next[0],next[1],'', 'class="feature-action"'):''}${button('spin','FETCH','SPIN',`class="primary" ${spinning||scene?'disabled':''}`)}${button('betDown','−TREATS','BET DOWN',blocked||state.bet===20?'disabled':'')}${button('betUp','+TREATS','BET UP',blocked||state.bet===500?'disabled':'')}<span class="stat"><small>TOTAL BET</small><strong>${fmt(state.free?state.freeBet:state.bet)}</strong></span>${button('auto','AUTO-WALK',autoLeft?`${autoLeft} LEFT`:'AUTO',`aria-pressed="${autoLeft>0}" ${scene||preview?'disabled':''}`)}${button('pays','PEDIGREE','PAYS & RULES')}${button('fair','FAIR PLAY','RETURN & RULES')}${button('turbo','QUICK STEP','TURBO',`aria-pressed="${!!state.turbo}"`)}${button('sound','BRASS BAND',state.muted?'SOUND OFF':'SOUND ON',`aria-pressed="${!state.muted}"`)}<label class="volume"><input aria-label="Sound volume" id="barVolume" type="range" min="0" max="1" step=".05" value="${state.volume??.4}"></label>${button('history','SHOW RECORD','HISTORY')}${button('fund','THE FUND','COMMUNITY')}${button('lab','BONUS PREVIEW',TEST?'LAB · L KEY':'PRACTICE')}${TEST?button('test','TEST','DEVELOPER'):''}${button('settings','SETTINGS','MOTION & SOUND')}<span class="stat"><small>${preview?'PRACTICE':'LAYR BALANCE'}</small><strong>${fmt(state.balance)}</strong></span>${state.gamble&&!scene&&!spinning?button('sit','SIT','DOUBLE / ODD')+button('stay','STAY','DOUBLE / EVEN')+button('bankWin','GOOD DOG','COLLECT'):''}${scene&&scene.stage!=='summary'?button('sceneSkip','SKIP','SAME RESULTS'):''}${preview?button('leavePreview','LEAVE PREVIEW','REAL ACCOUNT'):''}${button('exitFullscreen','RETURN','EXIT FULLSCREEN')}`;
    if(html!==lastUI){
      lastUI=html;
      const bar=$('fullscreenBar'),template=document.createElement('div');
      template.innerHTML=html;
      const key=(el,index)=>el.dataset.action||el.className+':'+index;
      const old=new Map([...bar.children].map((el,index)=>[key(el,index),el]));
      [...template.children].forEach((next,index)=>{
        const id=key(next,index),current=old.get(id);
        old.delete(id);
        if(current&&current.dataset.action){
          for(const attr of [...current.attributes])if(!next.hasAttribute(attr.name))current.removeAttribute(attr.name);
          for(const attr of [...next.attributes])if(current.getAttribute(attr.name)!==attr.value)current.setAttribute(attr.name,attr.value);
          if(current.innerHTML!==next.innerHTML)current.innerHTML=next.innerHTML;
          if(bar.children[index]!==current)bar.insertBefore(current,bar.children[index]||null);
        }else if(current?.className==='volume'){
          const input=current.querySelector('input');
          if(document.activeElement!==input)input.value=state.volume??.4;
          if(bar.children[index]!==current)bar.insertBefore(current,bar.children[index]||null);
        }else if(current){
          if(current.innerHTML!==next.innerHTML)current.innerHTML=next.innerHTML;
          if(bar.children[index]!==current)bar.insertBefore(current,bar.children[index]||null);
        }else bar.insertBefore(next,bar.children[index]||null);
      });
      for(const obsolete of old.values())obsolete.remove();
      const volume=$('barVolume');
      if(volume)volume.oninput=e=>{state.volume=Number(e.target.value);if(masterGain)masterGain.gain.value=state.volume;save();};
      resizeCanvas();
    }
  }
  function resizeCanvas(){if(!fullscreen)return;const r=$('screenStage').getBoundingClientRect(),k=Math.min((r.width-16)/1400,(r.height-16)/960);screen.style.width=Math.max(0,1400*k)+'px';screen.style.height=Math.max(0,960*k)+'px';}
  function setFullscreen(on,notify=true){
    if(fullscreen===on)return fullscreen;quiet();fullscreen=on;$('fullscreen').hidden=!on;
    if(on){$('screenStage').appendChild(screen);$('previewStrip').hidden=!preview;updateBar();if(notify&&fullscreenCallbacks?.enter)fullscreenCallbacks.enter();else if(notify)window.parent.postMessage({type:'PX_FULLSCREEN',active:true},'*');if(notify&&window.parent===window&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});}
    else{closePanel();if(notify&&fullscreenCallbacks?.exit)fullscreenCallbacks.exit();else if(notify)window.parent.postMessage({type:'PX_FULLSCREEN',active:false},'*');if(notify&&window.parent===window&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});}
    resizeCanvas();dirty=true;return fullscreen;
  }
  function fullscreenHost(fn){fullscreenCallbacks=typeof fn==='function'?{enter:()=>fn(true),exit:()=>fn(false)}:null;}
  function requestFullscreen(on){
    const callback=fullscreenCallbacks?.[on?'enter':'exit'];
    if(fullscreenHost.roomOwnsLayout&&callback){callback();return fullscreen;}
    return setFullscreen(on);
  }
  Object.assign(fullscreenHost,{enter:()=>requestFullscreen(true),exit:()=>requestFullscreen(false),active:()=>fullscreen,setHost(callbacks){fullscreenHost.roomOwnsLayout=false;fullscreenCallbacks=callbacks;}});
  function registerFullscreenHost(fn){fullscreenHost(fn);fullscreenHost.roomOwnsLayout=typeof fn==='function';}
  Object.assign(registerFullscreenHost,fullscreenHost);
  function leverCurve(u){if(u<0||u>1)return 0;if(u<.38)return 1-Math.pow(1-u/.38,3);if(u<.56)return 1;if(u<.9){const t=(u-.56)/.34;return (1-t)*(1-t);}return -.08*Math.sin((u-.9)/.1*Math.PI);}
  function mechanics(){const t=now(),buttonValues={};for(const [name,start]of Object.entries(caps)){const a=(t-start)/420;if(a<1)buttonValues[name]=Math.max(0,Math.sin(a*Math.PI*2)*Math.exp(-a*3.5));}const elapsed=t-leverStart;return {lever:leverStart&&elapsed<1050?{id:leverStart,elapsed,duration:1050,angle:1.02,progress:leverCurve(elapsed/1050)}:null,buttons:buttonValues,celebration:clamp((celebrationUntil-t)/2000,0,1),lights:clamp((celebrationUntil-t)/2000,0,1),scene:scene?scene.type+':'+scene.stage:'',jackpot:scene?.type==='jackpot',spinZ:null,armZ:null};}
  function tick(t){
    requestAnimationFrame(tick);if(!active||t-lastFrame<32)return;lastFrame=t;
    if(spinning){const ticks=clamp(Math.floor((t-spinning.start-spinning.duration)/75)+1,0,5);while(stopTicks<ticks){stopTicks++;sfx('stop');}if(t-spinning.start>=spinning.duration+300)finishSpin();dirty=true;}
    if(scene){const age=t-scene.start;
      if(scene.stage==='trigger'&&age>(state.turbo||reduced?280:1050)){
        const s=scene;stage(s.type,'intro',s);
        if(s.type==='gamble'){const intro=scene;setTimeout(()=>{if(scene===intro&&active)stage('gamble','play',s);},state.turbo?200:700);}
      }
      else if(scene.stage==='play'&&scene.type==='jackpot'&&age>(state.turbo?950:4100))stage('jackpot','summary',{...scene,detail:scene.detail||'The full CASINO JACKPOT meter'});
      else if(scene.stage==='play'&&scene.type==='gamble'&&age>(state.turbo?650:2000))gambleSummary();
      if(scene?.type==='free'&&scene.stage==='play'&&!spinning&&!modalName){if(!autoAt)autoAt=t+(lastOutcome?.wins.length?(state.turbo?750:PAYLINE_DWELL+100):(state.turbo?80:400));if(t>=autoAt){autoAt=0;doSpin(true);}}
      dirty=true;
    }else if(autoLeft&&autoAt&&t>=autoAt&&!spinning&&!modalName){autoAt=0;if(state.balance>=state.bet)doSpin();else quiet();}
    previewTick(t);animEvents=animEvents.filter(e=>t-e.t<1600);
    if(dirty||scene||spinning||winningPayline(t)!==drawnPayline)draw(t);if(fullscreen)updateBar();
  }
  function tap(x,y){const hit=hits.find(h=>x>=h.x&&y>=h.y&&x<=h.x+h.w&&y<=h.y+h.h);if(hit)control(hit.id);}
  screen.addEventListener('pointerdown',e=>{const r=screen.getBoundingClientRect();tap((e.clientX-r.left)/r.width*1400,(e.clientY-r.top)/r.height*960);});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b){const a=b.dataset.action;if(a==='pickNext')mainAction();else control(a);}});
  $('closePanel').onclick=closePanel;$('modal').addEventListener('cancel',e=>{e.preventDefault();closePanel();});$('panelShade').onclick=closePanel;
  document.addEventListener('keydown',e=>{
    if(e.code==='Escape'){if(modalName)closePanel();else if(fullscreen)requestFullscreen(false);else if(preview)exitPreview();return;}
    if(/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)||e.repeat)return;
    if(e.code==='Space'&&!fullscreen){e.preventDefault();control('spin');}else if(e.code==='KeyF'){e.preventDefault();requestFullscreen(!fullscreen);}else if(e.code==='KeyL'){e.preventDefault();openLab();}else if(e.code==='KeyM')control('sound');
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){quiet();if(preview)exitPreview({silent:true});}});
  addEventListener('resize',resizeCanvas);document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&window.parent===window&&fullscreen)setFullscreen(false);});
  // The room can port dialog HTML using its original token-addressed interaction API.
  const sourceElements=new Map(),sourceTokens=new WeakMap();let sourceSerial=0;
  function pxPort(el){if(!el)return '';for(const n of[el,...el.querySelectorAll('*')]){if(!sourceTokens.has(n)){const id=String(++sourceSerial);sourceTokens.set(n,id);sourceElements.set(id,n);}n.setAttribute('data-px-source',sourceTokens.get(n));}return el.outerHTML;}
  function ui(){const real=preview?preview.real:state;return {balance:state.balance,bet:state.free?state.freeBet:state.bet,win:state.lastWin,spins:state.spins,spinning:!!spinning,button:'FETCH',spinDisabled:!!(spinning||scene),betDownDisabled:!!(spinning||scene||preview)||state.bet===20,betUpDisabled:!!(spinning||scene||preview)||state.bet===500,gamble:state.gamble&&!scene?'SIT OR STAY':'',status,turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,sound:!state.muted,busy:!!spinning,volume:state.volume,modal:modalName?pxPort($('modal')):'',modalOpen:!!modalName,feature:!fullscreen&&sceneAction()?pxPort($('featureBar')):'',lab:!!preview,jackpot:E.meter(real,real.bet),fund:real.machineFund?.balance??0,periodEnd:machineFund.periodEnd().toISOString(),fundPeriodEnd:machineFund.periodEnd().toISOString(),lastPayPerTwin:null,twinCount:null,preview:!!preview,fullscreen,scene:scene?{type:scene.type,stage:scene.stage}:null,actionSerial};}
  async function activate(){const epoch=++activationEpoch;suite=null;if(preview)exitPreview({silent:true});if(!await LAYR.acquire())throw Error(LAYR.error()||'The shared account is unavailable.');if(epoch!==activationEpoch)return false;state=LAYR.openGame(GAME_ID,E);state.machineFund=state.machineFund||{balance:0,lastPayPerTwin:null,qualifiedTwins:null};active=true;ready=true;
    if(state.pending){markRound(state.pending);save();const r=E.settle(state);if(r)afterResult(r);}else if(state.features.length||state.freeActive)nextScene(true);
    chooseArt(state.grid);dirty=true;draw(now());updateBar();return true;
  }
  function deactivate(){activationEpoch++;suite=null;quiet();if(preview)exitPreview({silent:true});if(spinning)return false;save();active=false;if(audioContext)audioContext.suspend().catch(()=>{});return true;}
  window.PX_CASINO_ENGINE={screen,canvas:screen,revision:()=>revision,refreshAccount(){dirty=true;updateBar();},mechanics,activate,deactivate,action:control,stopAuto:quiet,tap,pointer:tap,key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},closeModal:closePanel,click(token){sourceElements.get(token)?.click();},input(token,value,checked,event='change'){const el=sourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},ui,status:ui,dev:TEST,fullscreenHost:registerFullscreenHost,fullscreen:on=>setFullscreen(on===undefined?!fullscreen:!!on,false)};
  if(TEST)window.PX_CASINO_ENGINE.inspect=()=>({state:{...copy(state),balance:state.balance},real:realSnapshot(preview?preview.real:state),scene:scene?{type:scene.type,stage:scene.stage,total:scene.total}:null,preview:preview?{event:preview.config.event,seed:preview.runner.seed}:null,lastPreview,lastSuite,renderedScene,stages:copy(stageLog),hits:copy(hits),reduced,particles:scene?.type==='jackpot'?(reduced?3:38):0,actionSerial});
  chooseArt(state.grid);draw(now());loadArt().then(()=>{tiles.clear();dirty=true;});requestAnimationFrame(tick);
  window.__bfReady=true;
  window.parent.postMessage({type:'PX_GAME_READY'},'*');
  if(window.parent===window)activate().then(()=>setFullscreen(true)).catch(e=>toast(e.message));
})();
