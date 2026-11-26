// Information pages for the Audionaut booth's big screen, the two "Learn" lecterns and the booth panel.
// Facts about Xtrata Music follow the Xtrata Music third-party guide (docs/radio/XTRATA-MUSIC-THIRD-PARTY-GUIDE.md,
// 20 Oct 2026) and the Audionaut docs in this repository. Each page carries a status: LIVE, PLANNED or IDEA.
// Keep the wording here honest: the booth itself saves, inscribes and pays nothing.

export const STATUS_NOTE='Status as described in the Xtrata Music guide (20 Oct 2026).';
export const TOPICS=[
  {id:'tree',short:'Tree',tab:'Tree & credits',title:'Family tree & credits'},
  {id:'audionals',short:'Audionals',tab:'Audionals',title:'What is an Audional?',status:'LIVE',
    kicker:'A song written as instructions, not a recording.',
    points:['An Audional song is a short file of instructions: which sound plays, on which step, at which pitch.',
      'The sounds are separate parts. Each is stored once and reused by reference, so a whole song can be just a few kilobytes.',
      'Audionals began on Bitcoin. Xtrata was built to bring them to Stacks, where songs, sounds and players are all inscriptions.',
      'The Audionaut studio still opens older Audional songs and keeps their original sample references.']},
  {id:'onchain',short:'On-chain',tab:'Why on-chain',title:'Why make music fully on-chain?',status:'LIVE',
    kicker:'Your music outlives any server.',
    points:['Permanent: an inscription can’t be taken down, moved or lost to a dead link.',
      'Verifiable: the studio checks every sound against its fingerprint (a hash) before it plays.',
      'Composable: songs, sounds and layers are built on by reference, so nothing is copied out of its context.',
      'Open: anyone can build a player. The Xtrata SDK is open source (MIT).']},
  {id:'forking',short:'Forking',tab:'Forking',title:'Forking keeps the credit',status:'DEMO',
    kicker:'Build on anyone’s work — the link back is never lost.',
    points:['A fork inherits every part of its parent exactly, then you change what you want.',
      'Every hit and note keeps the song, version and maker it came from: inherited, borrowed or new.',
      'Borrow a bassline from another song and it still says who made it, however many forks deep it goes.',
      'Remixing stops being a tangle of lost project files and unclear credits.']},
  {id:'payments',short:'Paid plays',tab:'Paid plays',title:'Paid plays on Stacks',status:'LIVE',
    kicker:'Listening is free. Supporting the artist is one tap.',
    points:['With Xtrata Music a listener can pay the current song holder for each play: 50 microSTX, sent in the same transaction that records the play.',
      'There is no platform fee, and the contract never holds the money: it has no custody, treasury or administrator.',
      'Listeners can use a passkey wallet (Face ID or fingerprint), so no seed phrase is needed.',
      'Every paid play leaves a receipt on-chain, so artists and anyone else can count them.'],
    note:'Live on Stacks mainnet; some web-radio features are switched on in stages.'},
  {id:'holder',short:'Who’s paid',tab:'Who gets paid',title:'Who gets paid?',status:'LIVE',
    kicker:'Income follows the master.',
    points:['Each paid play pays whoever holds the song’s master inscription at that moment, read live from the chain.',
      'Sell or give away the master and future plays pay the new holder — no catalogue to migrate.',
      'Audionauts: 20% of each sale goes to the artist of that Audionaut’s hidden star song, and receipts are checked on a royalty ledger.',
      'Planned: pay-per-play reports for artists in the Xtrata artist portal.']},
  {id:'creditpay',short:'Credit+pay',tab:'Credits × payments',title:'When credits meet payment rails',status:'IDEA',
    kicker:'What this booth hints at.',
    points:['Every part of a song here has a known maker, so a player can see exactly who contributed what.',
      'That makes it possible for support to be shared along a song’s family tree: the beat maker, the bassist, the borrower and the forker.',
      'The shares on the credits screen show what such a split could look like for the version you are on.',
      'This is an idea, not something built. In this booth nothing is paid.']},
  {id:'studio',short:'Studio',tab:'The studio',title:'The Audionaut studio',status:'LIVE',
    kicker:'The Blockchain Audional Work-Space-Station.',
    points:['A full music studio in the browser: arrangement, mixer, automation, recording, sampler and stem export.',
      'The 111 Audionauts unlock it, and each one opens its own named Audionaut sequencer.',
      'A free community beta is open to try at xtrata.xyz/audionaut-beta.',
      'Songs are made as Audional instructions, ready to be built on and credited.']}];
export const topic=id=>TOPICS.find(t=>t.id===id)||TOPICS[0];
export const LECTERNS=[
  {id:'learn-audionals',head:'LEARN · AUDIONALS',sub:'Aim at a tile — the big screen explains',tiles:['audionals','onchain','forking','studio']},
  {id:'learn-payments',head:'LEARN · PAYMENTS',sub:'Aim at a tile — the big screen explains',tiles:['payments','holder','creditpay','tree']}];
export const STATUS_COL={LIVE:'#35d07f',PLANNED:'#58d7e8',IDEA:'#ff5fa2',DEMO:'#f2b84b'};

// split text into lines that fit maxW on a canvas context
export const lines=(x,text,maxW)=>{const out=[];let line='';for(const w of String(text).split(/\s+/)){const t=line?line+' '+w:w;if(x.measureText(t).width>maxW&&line){out.push(line);line=w;}else line=t;}if(line)out.push(line);return out;};
const rr=(x,X,Y,w,h,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();};
const arrow=(x,x0,y0,x1,y1,c)=>{x.strokeStyle=c;x.fillStyle=c;x.lineWidth=4;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();const a=Math.atan2(y1-y0,x1-x0);x.beginPath();x.moveTo(x1,y1);x.lineTo(x1-14*Math.cos(a-.45),y1-14*Math.sin(a-.45));x.lineTo(x1-14*Math.cos(a+.45),y1-14*Math.sin(a+.45));x.closePath();x.fill();};
const box=(x,X,Y,w,h,c,t,F,fs=18,sub)=>{x.fillStyle='#1b1510';rr(x,X,Y,w,h,10);x.fill();x.strokeStyle=c;x.lineWidth=3;x.stroke();x.fillStyle='#fff6e2';x.font=`800 ${fs}px ${F}`;x.textAlign='center';x.fillText(t,X+w/2,Y+(sub?h/2-2:h/2+fs/3));if(sub){x.font=`600 14px ${F}`;x.fillStyle='#bfae95';x.fillText(sub,X+w/2,Y+h/2+18);}x.textAlign='left';};

// small explanatory diagrams, drawn into the right-hand part of a topic page (area X,Y,W,H)
const DIAGRAMS={
  audionals(x,X,Y,W,H,F){const col=['#f2b84b','#9b7bff','#58d7e8'];['KICK','BASS','KEYS'].forEach((n,i)=>{const bx=X+10,by=Y+20+i*86;x.fillStyle='#1b1510';rr(x,bx,by,150,66,10);x.fill();x.strokeStyle=col[i];x.lineWidth=3;x.stroke();
      x.strokeStyle=col[i];x.lineWidth=2;x.beginPath();for(let k=0;k<60;k++){const px=bx+12+k*2,py=by+33+Math.sin(k*(.4+i*.3))*14*Math.exp(-k/(18+i*12));k?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();
      x.font=`800 13px ${F}`;x.fillStyle='#efe3cc';x.fillText(n+' · stored once',bx+10,by+60);});
    for(let i=0;i<3;i++)arrow(x,X+166,Y+53+i*86,X+222,Y+130,'rgba(242,184,75,.8)');
    x.fillStyle='#130f0b';rr(x,X+230,Y+40,W-240,190,12);x.fill();x.strokeStyle='#f2b84b';x.lineWidth=3;x.stroke();x.font=`700 15px "Courier New",monospace`;x.fillStyle='#efe3cc';
    ['{ step: 1,  sound: KICK }','{ step: 3,  sound: BASS, note: A }','{ step: 5,  sound: KEYS, chord: F }','{ step: 9,  sound: KICK }','…'].forEach((l,i)=>x.fillText(l,X+246,Y+76+i*30));
    x.font=`800 16px ${F}`;x.fillStyle='#f2b84b';x.fillText('THE SONG = INSTRUCTIONS (a few KB)',X+232,Y+262);},
  onchain(x,X,Y,W,H,F){const it=[['∞','Permanent','no takedowns, no dead links','#f2b84b'],['✓','Verifiable','every sound checked by its hash','#35d07f'],['⧉','Composable','build on parts by reference','#9b7bff'],['◎','Open','anyone can build a player','#58d7e8']];
    it.forEach(([g,t,s,c],i)=>{const bx=X+(i%2)*(W/2),by=Y+10+Math.floor(i/2)*150;x.fillStyle='#1b1510';rr(x,bx+6,by,W/2-16,130,12);x.fill();x.strokeStyle=c;x.lineWidth=3;x.stroke();
      x.font=`800 46px ${F}`;x.fillStyle=c;x.fillText(g,bx+22,by+62);x.font=`800 20px ${F}`;x.fillStyle='#fff6e2';x.fillText(t,bx+80,by+48);x.font=`600 14px ${F}`;x.fillStyle='#bfae95';lines(x,s,W/2-110).slice(0,2).forEach((l,k)=>x.fillText(l,bx+80,by+74+k*18));});},
  forking(x,X,Y,W,H,F){const n=[['v1','beat',0,0],['v2','bass',1,0],['v3','keys',2,0],['v4','lead',3,0],['Fork','you',3,1],['Fork','friend',4,1]];const P=([,,gx,gy])=>({x:X+10+gx*((W-120)/4),y:Y+40+gy*120});
    [[0,1],[1,2],[2,3],[2,4],[4,5]].forEach(([a,b])=>{const p=P(n[a]),q=P(n[b]);x.strokeStyle=b>=4?'#58d7e8':'#f2b84b';x.lineWidth=3;x.beginPath();x.moveTo(p.x+100,p.y+30);x.bezierCurveTo(p.x+130,p.y+30,q.x-30,q.y+30,q.x,q.y+30);x.stroke();});
    n.forEach((d,i)=>{const p=P(d);box(x,p.x,p.y,100,60,i>=4?'#58d7e8':'#f2b84b',d[0],F,18,d[1]);});
    x.setLineDash([7,6]);x.strokeStyle='#9b7bff';x.lineWidth=3;x.beginPath();x.moveTo(X+W-90,Y+200);x.lineTo(X+W-90,Y+250);x.stroke();x.setLineDash([]);
    x.font=`700 15px ${F}`;x.fillStyle='#c69cff';x.fillText('borrowed bass ← another song (still credited)',X+W-430,Y+280);},
  payments(x,X,Y,W,H,F){box(x,X+10,Y+90,150,90,'#58d7e8','Listener',F,20,'passkey wallet');box(x,X+W/2-95,Y+90,190,90,'#f2b84b','Play contract',F,20,'no custody');box(x,X+W-170,Y+90,160,90,'#35d07f','Song holder',F,20,'paid directly');
    arrow(x,X+164,Y+135,X+W/2-100,Y+135,'#58d7e8');arrow(x,X+W/2+100,Y+135,X+W-176,Y+135,'#35d07f');
    x.font=`800 18px ${F}`;x.fillStyle='#35d07f';x.textAlign='center';x.fillText('50 microSTX per paid play',X+W*.75,Y+70);x.fillStyle='#f2b84b';x.fillText('receipt recorded on-chain',X+W/2,Y+222);x.fillStyle='#bfae95';x.font=`700 16px ${F}`;x.fillText('no platform fee · listening is always free',X+W/2,Y+256);x.textAlign='left';},
  holder(x,X,Y,W,H,F){box(x,X+10,Y+20,200,80,'#f2b84b','Master inscription',F,18,'the song');box(x,X+W-230,Y+20,210,80,'#35d07f','Holder today',F,18,'receives each paid play');arrow(x,X+214,Y+60,X+W-236,Y+60,'#35d07f');
    box(x,X+W-230,Y+170,210,80,'#58d7e8','New holder',F,18,'future plays pay them');arrow(x,X+W-125,Y+104,X+W-125,Y+164,'#58d7e8');x.font=`700 15px ${F}`;x.fillStyle='#9fe9f3';x.fillText('sold or gifted',X+W-112,Y+140);
    x.font=`700 15px ${F}`;x.fillStyle='#bfae95';lines(x,'The payment always follows whoever holds the master at the moment of the play.',W-300).forEach((l,i)=>x.fillText(l,X+12,Y+150+i*20));},
  creditpay(x,X,Y,W,H,F){const parts=[['Amber','beat',.33,'#f2b84b'],['Bex','bass',.21,'#9b7bff'],['Gus','keys (borrowed)',.18,'#58d7e8'],['You','your fork',.28,'#ff5fa2']];let bx=X+10;const bw=W-20;
    parts.forEach(([n,,p,c])=>{x.fillStyle=c;x.fillRect(bx,Y+40,bw*p-3,46);bx+=bw*p;});x.font=`800 15px ${F}`;x.fillStyle='#120d09';bx=X+10;parts.forEach(([n,,p])=>{x.fillText(Math.round(p*100)+'%',bx+8,Y+70);bx+=bw*p;});
    parts.forEach(([n,r,,c],i)=>{const cx=X+40+i*((W-60)/4),cy=Y+190;bx=X+10+parts.slice(0,i).reduce((a,q)=>a+q[2]*bw,0)+parts[i][2]*bw/2;arrow(x,bx,Y+90,cx+40,cy-38,c);x.fillStyle='#1b1510';x.beginPath();x.arc(cx+40,cy,34,0,7);x.fill();x.strokeStyle=c;x.lineWidth=3;x.stroke();
      x.font=`800 16px ${F}`;x.fillStyle='#fff6e2';x.textAlign='center';x.fillText(n,cx+40,cy+6);x.font=`600 13px ${F}`;x.fillStyle='#bfae95';x.fillText(r,cx+40,cy+56);x.textAlign='left';});
    x.font=`800 15px ${F}`;x.fillStyle='#ff5fa2';x.fillText('AN IDEA — NOT BUILT. EXAMPLE SHARES ONLY.',X+10,Y+28);},
  studio(x,X,Y,W,H,F){x.fillStyle='#130f0b';rr(x,X+10,Y+20,W-20,230,12);x.fill();x.strokeStyle='#f2b84b';x.lineWidth=3;x.stroke();
    const tr=['DRUMS','BASS','KEYS','LEAD','VOX'],cs=['#f2b84b','#9b7bff','#58d7e8','#ff5fa2','#35d07f'];tr.forEach((t,i)=>{x.font=`800 13px ${F}`;x.fillStyle=cs[i];x.fillText(t,X+26,Y+58+i*38);
      for(let k=0;k<6;k++){if((i*7+k*3)%4===0)continue;x.fillStyle=cs[i];x.globalAlpha=.75;x.fillRect(X+92+k*((W-130)/6),Y+42+i*38,(W-130)/6-8,24);x.globalAlpha=1;}});
    x.font=`800 16px ${F}`;x.fillStyle='#f2b84b';x.fillText('ARRANGE · MIX · AUTOMATE · RECORD · SAMPLE · EXPORT STEMS',X+18,Y+282);}};

// one topic page into the area (0..w, 0..h) of a context already translated to the content area
export function drawTopicPage(x,t,w,h,F){x.textBaseline='alphabetic';x.textAlign='left';
  const sc=STATUS_COL[t.status]||'#bfae95';x.font=`800 15px ${F}`;const sw=x.measureText(t.status).width+24;x.fillStyle=sc;rr(x,30,16,sw,26,13);x.fill();x.fillStyle='#120d09';x.fillText(t.status,42,35);
  x.font=`800 38px ${F}`;x.fillStyle='#fff6e2';x.fillText(t.title,30+sw+16,40);
  x.font=`700 22px ${F}`;x.fillStyle='#f2b84b';x.fillText(t.kicker,30,80);
  const tw=Math.round(w*.52);let y=120;x.font=`600 20px ${F}`;
  for(const p of t.points){const ls=lines(x,p,tw-40);x.fillStyle=sc;x.beginPath();x.arc(40,y-7,5,0,7);x.fill();x.fillStyle='#efe3cc';ls.forEach((l,i)=>x.fillText(l,56,y+i*26));y+=ls.length*26+16;}
  if(t.note){x.font=`600 15px ${F}`;x.fillStyle='#bfae95';x.fillText(t.note,30,h-34);}
  x.font=`600 13px ${F}`;x.fillStyle='#8c7f70';x.fillText(t.status==='IDEA'?'This page describes an idea. Nothing in this booth is saved, inscribed or paid.':STATUS_NOTE+' Nothing in this booth is saved, inscribed or paid.',30,h-12);
  const d=DIAGRAMS[t.id];if(d){x.save();d(x,tw+20,100,w-tw-50,h-150,F);x.restore();}}
