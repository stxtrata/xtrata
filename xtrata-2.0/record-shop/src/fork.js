// The Audionaut forking demo: songs as instructions built from credited, reusable layers.
// Pure data + logic (no three.js, no audio) so it can be unit-tested in Node.
//
// A song family has an original version history (v1 beat → v2 bass → v3 keys → v4 lead, each by a different demo maker)
// and any number of forks. Every version is a full snapshot: 6 rows × 16 steps of values, plus, for every hit or note,
// the id of the version where that exact hit was made (its origin). From an origin we can always say which song, which
// version and which maker it came from, and — relative to any version — whether it was inherited, borrowed or new.
// Melodic values are scale degrees relative to the song's key, so a borrowed layer always lands in the new song's key,
// and steps are independent of tempo, so it also follows the new song's tempo.

export const ROWS=[
  {id:'kick',layer:'drums',label:'KICK'},{id:'snare',layer:'drums',label:'SNARE'},{id:'hat',layer:'drums',label:'HATS'},
  {id:'bass',layer:'bass',label:'BASS'},{id:'keys',layer:'keys',label:'KEYS'},{id:'lead',layer:'lead',label:'LEAD'}];
export const LAYERS=['drums','bass','keys','lead'];
export const LAYER_NAME={drums:'Drums',bass:'Bass',keys:'Keys',lead:'Lead'};
export const LAYER_ROWS={drums:[0,1,2],bass:[3],keys:[4],lead:[5]};
export const MODES={minor:[0,2,3,5,7,8,10],major:[0,2,4,5,7,9,11],dorian:[0,2,3,5,7,9,10],phrygian:[0,1,3,5,7,8,10]};
const NOTE=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
export const keyName=f=>NOTE[f.root%12]+' '+f.mode;
const PROGS={minor:[[0,5,2,6],[0,3,4,0],[0,6,5,6],[0,3,5,4],[0,2,3,4],[0,5,3,4]],dorian:[[0,3,0,3],[0,6,3,4],[0,3,6,0],[0,2,3,6]],
  major:[[0,5,1,4],[0,4,5,3],[0,3,4,4],[0,5,3,4],[0,1,3,4]],phrygian:[[0,1,0,6],[0,6,5,1],[0,1,6,1],[0,5,6,1]]};

// Demo makers. Clearly placeholders, not real people.
const MAKER_NAMES=['Amber','Bex','Cato','Dax','Edie','Finn','Gus','Hana','Ivo','Juno','Kit','Lux','Mo','Nia','Oz','Pip','Quin','Rue','Sol','Tam'];
export const MAKERS={you:{id:'you',name:'You',tag:'this visitor',demo:false}};
for(const n of MAKER_NAMES){const id=n.toLowerCase();MAKERS[id]={id,name:n,tag:'demo maker',demo:true};}
export const makerLabel=id=>{const m=MAKERS[id];return m?(m.demo?`${m.name} (demo maker)`:m.name):id;};

// ---- starting songs ----
// drums: '.' off, 'x' hit, 'X' accent / open hat. melodic rows: space-separated tokens, '.' rest, else a scale degree
// (0 = key root; 7 = an octave up; negative = below). Keys tokens are the root degree of a triad built in the key.
const SONGS=[
  {id:'nightbus',title:'Night Bus',style:'House',bpm:124,root:57,mode:'minor',prog:[0,5,2,6],makers:['amber','bex','cato','dax'],
    kick:'x...x...x...x...',snare:'....x.......x...',hat:'..X...X...X...X.',
    bass:'. . 0 . . . 5 5 . . 2 . . . 6 .',keys:'0 . . 0 5 . . 5 2 . . 2 6 . . .',lead:'4 . . 2 5 . 4 . 4 . 2 . 1 . . .',
    forks:[{maker:'rue',from:4,layer:'lead',seed:11}]},
  {id:'dustytape',title:'Dusty Tape',style:'Boom bap',bpm:90,root:60,mode:'minor',prog:[0,0,3,5],makers:['edie','finn','gus','hana'],
    kick:'x......x..x.....',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',
    bass:'0 . . . . . 0 . 3 . . 3 5 . . 4',keys:'0 . . . . . 0 . 3 . . . 5 . . .',lead:'4 . 2 . . . 0 . 3 . 5 . 4 . 2 .',
    forks:[{maker:'pip',from:3,layer:'keys',seed:23}]},
  {id:'rain',title:'Rain on the Window',style:'Lo-fi',bpm:78,root:53,mode:'major',prog:[0,5,1,4],makers:['ivo','juno','kit','lux'],
    kick:'x.....x.x.......',snare:'....x.......x..x',hat:'x.x.x.x.x.x.x.x.',
    bass:'0 . . 0 5 . . . 1 . . 1 4 . . .',keys:'0 . . . 5 . . . 1 . . . 4 . . .',lead:'4 . . 2 . . 7 . 3 . 1 . 6 . 4 .',forks:[]},
  {id:'concrete',title:'Concrete',style:'Techno',bpm:130,root:62,mode:'minor',prog:[0,0,0,5],makers:['mo','nia','oz','pip'],
    kick:'x...x...x...x...',snare:'....x.......x...',hat:'.xX..xX..xX..xXx',
    bass:'. 0 0 . . 0 0 . . 0 0 . . 5 5 .',keys:'. . 0 . . . . . . . 0 . . . 5 .',lead:'0 . 7 . 2 . . 0 . 4 . 2 5 . 7 .',
    forks:[{maker:'quin',from:3,borrow:{song:'nightbus',version:2,layer:'bass'}}]},
  {id:'neongrid',title:'Neon Grid',style:'Electro',bpm:118,root:64,mode:'phrygian',prog:[0,1,0,6],makers:['quin','rue','sol','tam'],
    kick:'x......x..x.....',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.xX',
    bass:'0 . . 0 1 . . 1 0 . . 0 6 . 6 .',keys:'0 . . . 1 . . . 0 . . . 6 . . .',lead:'0 . 4 . 1 . 5 . 7 . 4 . 6 . 8 .',forks:[]},
  {id:'slowmo',title:'Slow Motion',style:'Half-time',bpm:140,root:55,mode:'minor',prog:[0,0,5,4],makers:['kit','amber','oz','juno'],
    kick:'x......x..x.....',snare:'........x.......',hat:'x.x.x.x.x.xXx.x.',
    bass:'0 . . . . . . 0 5 . . . 4 . . .',keys:'0 . . . . . . . 5 . . . 4 . . .',lead:'7 . . . . . 9 . 7 . . . 6 . 8 .',forks:[]}];
export const SONG_LIST=SONGS.map(s=>({id:s.id,title:s.title,style:s.style,bpm:s.bpm,root:s.root,mode:s.mode}));

// ---- helpers ----
export function rng(seed){let a=seed>>>0;return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const shuffle=(r,a)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const drumRow=s=>[...s].map(c=>c==='x'?1:c==='X'?2:0);
const melRow=s=>s.trim().split(/\s+/).map(t=>t==='.'?null:+t);
const clone=v=>({cells:v.cells.map(r=>r.slice()),org:v.org.map(r=>r.slice())});
const empty=()=>Array.from({length:6},()=>Array(16).fill(null));
const isOn=(row,val)=>row<3?!!val:val!=null;
export const hashCells=cells=>cells.map(r=>r.map(v=>v==null?'.':v).join(',')).join('|');
const clampDeg=(d,lo,hi)=>{while(d>hi)d-=7;while(d<lo)d+=7;return d;};
// the chord (root degree) sounding at a step: last keys chord at or before it, else the song's progression block
function chordAt(cells,prog,s){for(let k=0;k<16;k++){const i=(s-k+16)%16,v=cells[4][i];if(v!=null)return v;}return prog[Math.floor(s/4)];}
const triad=c=>[c,c+2,c+4];

export function createStudio(){
  const S={families:[],versions:new Map(),counter:0,cur:null,yours:0};
  // every version's musical content, counted (a fresh fork shares its parent's content until it is changed)
  let H=new Map();const hAdd=h=>H.set(h,(H.get(h)||0)+1),hDel=h=>{const n=(H.get(h)||0)-1;if(n>0)H.set(h,n);else H.delete(h);},hHas=h=>H.has(h);
  const famOf=id=>S.families.find(f=>f.id===id);
  S.get=id=>S.versions.get(id);
  S.family=id=>famOf(id);
  function add(v){v.created=++S.counter;S.versions.set(v.id,v);hAdd(hashCells(v.cells));return v;}
  function diff(a,b,rows=[0,1,2,3,4,5]){const on=[],off=[],chg=[];for(const r of rows)for(let s=0;s<16;s++){const x=a[r][s],y=b[r][s];if(x===y)continue;const k=r+':'+s;if(y==null||y===0)off.push(k);else if(x==null||x===0)on.push(k);else chg.push(k);}return {on,off,chg,n:on.length+off.length+chg.length};}
  function refreshChanged(v){const p=v.parent&&S.get(v.parent);v.changed=p?diff(p.cells,v.cells):{on:[],off:[],chg:[],n:0};}
  // ---- build the starting songs ----
  function build(){
    S.families=[];S.versions=new Map();H=new Map();S.counter=0;S.yours=0;
    for(const sd of SONGS){const fam={id:sd.id,title:sd.title,style:sd.style,bpm:sd.bpm,root:sd.root,mode:sd.mode,prog:sd.prog.slice(),forkCount:0,yourCount:0};S.families.push(fam);
      const full=[drumRow(sd.kick),drumRow(sd.snare),drumRow(sd.hat),melRow(sd.bass),melRow(sd.keys),melRow(sd.lead)];
      const steps=[['drums','laid down the beat'],['bass','added the bassline'],['keys','added the chords'],['lead','added the melody']];
      let prev=null;
      steps.forEach(([layer,what],i)=>{const id=`${sd.id}:v${i+1}`,maker=sd.makers[i];const base=prev?clone(prev):{cells:empty().map((r,ri)=>ri<3?Array(16).fill(0):r),org:empty()};
        for(const r of LAYER_ROWS[layer])for(let s=0;s<16;s++){base.cells[r][s]=full[r][s];base.org[r][s]=isOn(r,full[r][s])?id:null;}
        const v={id,fam:sd.id,kind:'original',n:i+1,label:'v'+(i+1),maker,parent:prev?prev.id:null,cells:base.cells,org:base.org,borrows:[],
          note:`${MAKERS[maker].name} ${what}${prev?' on top of v'+i:''}.`,addedLayer:layer};
        add(v);refreshChanged(v);v.last=v.changed;prev=v;});
      fam.latest=prev.id;}
    // forks by other demo makers, so the trees already branch and one song already borrows
    for(const sd of SONGS)for(const f of sd.forks){const from=`${sd.id}:v${f.from}`;
      if(f.borrow){const v=makeFork(from,f.maker);borrowInto(v,f.borrow.layer,`${f.borrow.song}:v${f.borrow.version}`);v.note=`${MAKERS[f.maker].name} forked v${f.from} and borrowed the bassline from “${famOf(f.borrow.song).title}” v${f.borrow.version}.`;}
      else{const v=makeFork(from,f.maker);varyInto(v,f.layer,f.seed);v.note=`${MAKERS[f.maker].name} forked v${f.from} and wrote a new ${LAYER_NAME[f.layer].toLowerCase()} part.`;}}
    S.cur=S.families[0].latest;
  }
  // a fork copies every value and every origin of its parent exactly
  function makeFork(fromId,maker){const p=S.get(fromId),fam=famOf(p.fam),c=clone(p),mine=maker==='you';fam.forkCount++;if(mine){fam.yourCount++;S.yours++;}
    const id=`${p.fam}:f${fam.forkCount}`;
    const v={id,fam:p.fam,kind:'fork',n:fam.forkCount,label:mine?`Your fork ${fam.yourCount}`:`Fork ${fam.forkCount} · ${MAKERS[maker].name}`,maker,mine,parent:p.id,cells:c.cells,org:c.org,borrows:[],note:'',last:{on:[],off:[],chg:[],n:0}};
    add(v);refreshChanged(v);return v;}
  // ---- automatic variations: musical, in key, different from the parent and from every other version ----
  const OPS={
    drums:[
      ['busier hats',(c,r)=>{for(let s=1;s<16;s+=2)if(!c[2][s]&&r()<.75)c[2][s]=1;}],
      ['open hats on the off-beats',(c)=>{for(let s=0;s<16;s++)c[2][s]=s%4===2?2:(c[2][s]&&s%2===0?1:0);}],
      ['a syncopated kick',(c,r)=>{const add=shuffle(r,[3,6,7,10,11,14]).filter(s=>!c[0][s]).slice(0,2);for(const s of add)c[0][s]=1;const rm=shuffle(r,[4,8,12]).find(s=>c[0][s]);if(rm!=null&&r()<.5)c[0][rm]=0;}],
      ['ghost snares',(c,r)=>{for(const s of shuffle(r,[2,6,7,9,10,14,15]).slice(0,3))if(!c[1][s])c[1][s]=1;}],
      ['a snare fill at the end of the bar',(c,r)=>{const f=pick(r,[[13,14,15],[11,13,15],[14,15],[12,13,14,15]]);for(const s of f)c[1][s]=s===15?2:1;}],
      ['a half-time feel',(c)=>{c[0]=c[0].map((v,s)=>s===0||s===10?1:0);c[1]=c[1].map((v,s)=>s===8?2:0);}],
      ['a sparser groove',(c,r)=>{for(let s=0;s<16;s++){if(c[2][s]&&s%4!==2&&r()<.6)c[2][s]=0;}if(c[0][12]&&r()<.5)c[0][12]=0;}]],
    bass:[
      ['octave jumps',(c,r,ch)=>{let k=0;for(let s=0;s<16;s++)if(c[3][s]!=null&&s%2===1||c[3][s]!=null&&r()<.35){c[3][s]=c[3][s]>=4?c[3][s]-7:c[3][s]+7;k++;}if(!k)for(let s=0;s<16;s++)if(c[3][s]!=null){c[3][s]+=7;break;}}],
      ['walking notes into each chord change',(c,r,ch)=>{for(const b of [3,7,11,15]){const nx=ch((b+1)%16),cur=ch(b);c[3][b]=nx+(r()<.5?1:-1);if(c[3][b-1]==null&&r()<.6)c[3][b-1]=cur+2;}}],
      ['a pumping eighth-note line',(c,r,ch)=>{const off=r()<.5;for(let s=0;s<16;s++)c[3][s]=(s%2===(off?1:0))?ch(s)+(r()<.25?7:0):null;}],
      ['fifths under the chords',(c,r,ch)=>{let k=0;for(let s=0;s<16;s++)if(c[3][s]!=null&&(s%4!==0||r()<.4)){c[3][s]=ch(s)+4;k++;}if(!k)for(let s=2;s<16;s+=4)c[3][s]=ch(s)+4;}],
      ['a syncopated rhythm',(c,r,ch)=>{const old=c[3].slice(),sh=pick(r,[1,3,-1]);for(let s=0;s<16;s++)c[3][s]=old[(s-sh+16)%16]!=null?ch(s)+(old[(s-sh+16)%16]-ch((s-sh+16)%16)):null;}],
      ['a root-and-third riff',(c,r,ch)=>{const pat=pick(r,[[0,null,2,null],[0,0,null,2],[null,0,null,4],[0,null,4,2]]);for(let s=0;s<16;s++){const p=pat[s%4];c[3][s]=p==null?null:ch(s)+p;}}]],
    keys:[
      ['a new chord progression',(c,r,ch,fam)=>{const cur=[0,1,2,3].map(b=>ch(b*4));const opts=PROGS[fam.mode].filter(p=>p.join()!==cur.join());const pr=pick(r,opts);let any=false;
        for(let s=0;s<16;s++)if(c[4][s]!=null){c[4][s]=pr[Math.floor(s/4)];any=true;}if(!any)for(let b=0;b<4;b++)c[4][b*4]=pr[b];}],
      ['off-beat stabs',(c,r,ch)=>{const blocks=[0,1,2,3].map(b=>ch(b*4));for(let s=0;s<16;s++)c[4][s]=s%4===2||(s%8===7&&r()<.5)?blocks[Math.floor(s/4)]:null;}],
      ['long held chords',(c,r,ch)=>{const blocks=[0,1,2,3].map(b=>ch(b*4)),half=r()<.4;for(let s=0;s<16;s++)c[4][s]=half?(s%8===0?blocks[Math.floor(s/4)]:null):(s%4===0?blocks[Math.floor(s/4)]:null);}],
      ['a pushed, syncopated rhythm',(c,r,ch)=>{const blocks=[0,1,2,3].map(b=>ch(b*4)),pat=pick(r,[[0,3,6],[0,3],[1,3],[0,2,3]]);for(let s=0;s<16;s++)c[4][s]=pat.includes(s%4)&&!(s%4===3&&s===15)?blocks[Math.floor(s/4)]:null;}],
      ['a relative-chord twist',(c,r,ch)=>{const b=pick(r,[1,2,3]);for(let s=b*4;s<b*4+4;s++)if(c[4][s]!=null)c[4][s]=(c[4][s]+5)%7;if(!c[4].slice(b*4,b*4+4).some(v=>v!=null))c[4][b*4]=(ch(b*4)+5)%7;}]],
    lead:[
      ['a brand-new melody',(c,r,ch)=>{const rh=pick(r,[[0,3,6,8,10,12,14],[0,2,4,7,8,11,12],[0,1,4,6,8,9,12,14],[2,4,6,10,12,13],[0,4,6,8,12,15]]);let prev=null;
        for(let s=0;s<16;s++){if(!rh.includes(s)){c[5][s]=null;continue;}const t=triad(ch(s));let d;if(s%4===0||prev==null)d=pick(r,t)+(r()<.5?7:0);else d=prev+pick(r,[-2,-1,1,2]);d=clampDeg(d,0,11);c[5][s]=d;prev=d;}}],
      ['the melody turned upside down',(c)=>{const f=c[5].find(v=>v!=null);if(f==null)return;for(let s=0;s<16;s++)if(c[5][s]!=null)c[5][s]=clampDeg(f-(c[5][s]-f),0,11);}],
      ['the melody shifted later',(c,r)=>{const sh=pick(r,[2,3]),old=c[5].slice();for(let s=0;s<16;s++)c[5][s]=old[(s-sh+16)%16];}],
      ['a new answer in the second half',(c,r,ch)=>{let prev=c[5].slice(0,8).filter(v=>v!=null).pop()??ch(8);for(let s=8;s<16;s++){if(r()<.45&&s!==8){c[5][s]=null;continue;}const d=s%4===0?pick(r,triad(ch(s)))+7:prev+pick(r,[-2,-1,1,2]);prev=clampDeg(d,0,11);c[5][s]=prev;}}],
      ['the melody an octave up with a run',(c,r,ch)=>{for(let s=0;s<16;s++)if(c[5][s]!=null)c[5][s]=clampDeg(c[5][s]+7,0,13);const st=pick(r,[12,13]);let d=ch(st)+7;for(let s=st;s<16;s++){c[5][s]=clampDeg(d,0,13);d-=1;}}]]};
  // apply a variation to one layer of version v (in place). Returns the op description, or null if nothing new could be found.
  function varyInto(v,layer,seed){const fam=famOf(v.fam),p=v.parent?S.get(v.parent):null,rows=LAYER_ROWS[layer],minN=layer==='drums'?2:3;
    const parentHash=p?hashCells(p.cells):null,selfHash=hashCells(v.cells);hDel(selfHash);
    for(let a=0;a<60;a++){const r=rng((seed>>>0)+a*7919+S.counter*104729);const c=v.cells.map(x=>x.slice());const ch=s=>chordAt(c,fam.prog,s);
      const ops=shuffle(r,OPS[layer]);const use=a<20?[ops[0]]:[ops[0],ops[1]];
      for(const [,fn] of use)fn(c,r,ch,fam);
      // keep every melodic value an integer scale degree in a sensible range (always in key)
      for(const rr of rows)if(rr>=3)for(let s=0;s<16;s++)if(c[rr][s]!=null)c[rr][s]=Math.round(c[rr][s]);
      const d=diff(v.cells,c,rows),h=hashCells(c);
      if(d.n<minN||hHas(h)||h===parentHash||h===selfHash)continue;
      for(const rr of rows)for(let s=0;s<16;s++){if(c[rr][s]!==v.cells[rr][s])v.org[rr][s]=isOn(rr,c[rr][s])?v.id:null;}
      v.cells=c;hAdd(h);v.last=d;refreshChanged(v);return use.map(u=>u[0]).join(' and ');}
    hAdd(selfHash);return null;}
  function borrowInto(v,layer,fromId){const src=S.get(fromId);hDel(hashCells(v.cells));const before=v.cells.map(x=>x.slice());
    for(const r of LAYER_ROWS[layer])for(let s=0;s<16;s++){v.cells[r][s]=src.cells[r][s];v.org[r][s]=src.org[r][s];}
    v.borrows=v.borrows.filter(b=>b.layer!==layer);v.borrows.push({layer,from:fromId});
    v.last=diff(before,v.cells,LAYER_ROWS[layer]);hAdd(hashCells(v.cells));refreshChanged(v);}
  // ---- public actions (each returns {version, note}) ----
  const pickLayer=(v,seed)=>{const r=rng(seed);const has=LAYERS.filter(l=>LAYER_ROWS[l].some(row=>v.cells[row].some((x)=>isOn(row,x))));return pick(r,has.length?has:['drums']);};
  S.fork=(fromId,opt={})=>{const p=S.get(fromId);const v=makeFork(fromId,'you');let layer=opt.layer||pickLayer(p,S.counter*31+v.n);
    let what=varyInto(v,layer,opt.seed??(S.counter*2654435761+v.n));
    // never leave a fork identical: if that layer has no new variation left, vary another one
    if(!what)for(const l of LAYERS.filter(x=>x!==layer)){what=varyInto(v,l,S.counter*977+v.n);if(what){layer=l;break;}}
    v.varied=layer;v.note=`You forked “${famOf(p.fam).title}” ${p.label}. Everything was inherited with its credits; then the ${LAYER_NAME[layer].toLowerCase()} got ${what||'a small change'} (${v.last.n} step${v.last.n===1?'':'s'} changed).`;
    S.cur=v.id;return {version:v,note:v.note};};
  const ensureMine=(id,why)=>{const v=S.get(id);if(v.mine)return {v,forked:false};const f=makeFork(id,'you');f.note=`You forked ${v.label} ${why}.`;return {v:f,forked:true,from:v};};
  S.vary=(id,layer,seed)=>{const e=ensureMine(id,'to make a variation');const v=e.v;layer=layer||pickLayer(v,S.counter*17+3);
    const what=varyInto(v,layer,seed??(S.counter*2246822519+v.n*97));v.varied=layer;
    v.note=(e.forked?`You forked ${e.from.label}. `:'')+(what?`New variation on the ${LAYER_NAME[layer].toLowerCase()}: ${what} (${v.last.n} step${v.last.n===1?'':'s'} changed). Those steps are now credited to ${v.label}.`:`No new ${LAYER_NAME[layer].toLowerCase()} variation could be found this time.`);
    S.cur=v.id;return {version:v,note:v.note};};
  // borrow a layer from another song; by default from the latest version of a different song whose layer differs
  S.borrowSources=(id,layer)=>{const v=S.get(id);return S.families.filter(f=>f.id!==v.fam).map(f=>S.get(f.latest)).filter(src=>LAYER_ROWS[layer].some(r=>src.cells[r].join()!==v.cells[r].join()));};
  S.borrow=(id,layer,fromId,seed)=>{const cur=S.get(id);const r=rng(seed??S.counter*40503+7);layer=layer||pick(r,['bass','keys','lead','drums']);
    const srcs=fromId?[S.get(fromId)]:S.borrowSources(id,layer);if(!srcs.length)return {version:cur,note:'Nothing new to borrow for that layer.'};
    const src=fromId?srcs[0]:pick(r,srcs);const e=ensureMine(id,'to borrow into it');const v=e.v;borrowInto(v,layer,src.id);
    const sf=famOf(src.fam),makers=[...new Set(LAYER_ROWS[layer].flatMap(row=>src.org[row].filter(Boolean).map(o=>S.get(o).maker)))].map(m=>MAKERS[m].name).join(' & ');
    v.note=(e.forked?`You forked ${e.from.label}. `:'')+`Borrowed the ${LAYER_NAME[layer].toLowerCase()} from “${sf.title}” ${src.label}. It plays in ${keyName(famOf(v.fam))} at ${famOf(v.fam).bpm} BPM here, and stays credited to ${makers} of “${sf.title}”.`;
    S.cur=v.id;return {version:v,note:v.note};};
  // hand edit: drums toggle; melodic cells cycle empty → chord root → third → fifth → empty (always in key)
  S.edit=(id,row,step)=>{const e=ensureMine(id,'so the change is yours');const v=e.v,fam=famOf(v.fam);hDel(hashCells(v.cells));const old=v.cells[row][step];let nv;
    if(row<3)nv=old?0:1;
    else if(row===4){nv=old==null?fam.prog[Math.floor(step/4)]:(old===fam.prog[Math.floor(step/4)]?(old+5)%7:null);if(nv===old)nv=null;}
    else{const c=chordAt(v.cells,fam.prog,step),base=row===5?7:0,t=triad(c).map(d=>d+base);const i=t.indexOf(old);nv=old==null?t[0]:i>=0&&i<2?t[i+1]:null;}
    v.cells[row][step]=nv;v.org[row][step]=isOn(row,nv)?v.id:null;hAdd(hashCells(v.cells));
    const k=row+':'+step;v.last={on:isOn(row,nv)&&!isOn(row,old)?[k]:[],off:!isOn(row,nv)&&isOn(row,old)?[k]:[],chg:isOn(row,nv)&&isOn(row,old)?[k]:[],n:1};refreshChanged(v);
    v.note=(e.forked?`You forked ${e.from.label} so the change is yours. `:'')+(isOn(row,nv)?`You ${isOn(row,old)?'changed':'added'} the ${ROWS[row].label.toLowerCase()} on step ${step+1} — credited to ${v.label}.`:`You removed the ${ROWS[row].label.toLowerCase()} on step ${step+1}.`);
    S.cur=v.id;return {version:v,note:v.note};};
  // ---- attribution ----
  S.ancestry=id=>{const out=[];let v=S.get(id);while(v){out.push(v);v=v.parent?S.get(v.parent):null;}return out;};
  S.isAncestor=(a,b)=>S.ancestry(b).some(v=>v.id===a);
  S.how=(id,orgId)=>{if(!orgId)return null;if(orgId===id)return 'new';return S.isAncestor(orgId,id)?'inherited':'borrowed';};
  S.cellInfo=(id,row,step)=>{const v=S.get(id),val=v.cells[row][step];if(!isOn(row,val))return {on:false};const o=S.get(v.org[row][step]),f=famOf(o.fam),how=S.how(id,o.id);
    let via=null;if(how==='borrowed'){for(const a of S.ancestry(id)){const b=a.borrows.find(b=>b.layer===ROWS[row].layer);if(b){via=a;break;}}}
    return {on:true,value:val,maker:o.maker,makerName:makerLabel(o.maker),song:f.title,songId:f.id,version:o.label,versionId:o.id,how,via:via?via.label:null};};
  S.layerInfo=(id,layer)=>{const v=S.get(id),count={};let n=0;for(const r of LAYER_ROWS[layer])for(let s=0;s<16;s++){const o=v.org[r][s];if(o){count[o]=(count[o]||0)+1;n++;}}
    if(!n)return {empty:true,layer};const top=Object.entries(count).sort((a,b)=>b[1]-a[1])[0][0],o=S.get(top),f=famOf(o.fam);
    const makers=[...new Set(Object.keys(count).map(k=>S.get(k).maker))];return {layer,maker:o.maker,makerName:makerLabel(o.maker),makers,song:f.title,version:o.label,how:S.how(id,top),hits:n};};
  S.credits=id=>{const v=S.get(id),byMaker={},bySong={},byHow={inherited:0,borrowed:0,new:0};let n=0;
    for(let r=0;r<6;r++)for(let s=0;s<16;s++){const o=v.org[r][s];if(!o)continue;const ov=S.get(o);n++;byMaker[ov.maker]=(byMaker[ov.maker]||0)+1;const t=famOf(ov.fam).title;bySong[t]=(bySong[t]||0)+1;byHow[S.how(id,o)]++;}
    const pct=obj=>{const e=Object.entries(obj).sort((a,b)=>b[1]-a[1]),raw=e.map(([,c])=>c*100/n),fl=raw.map(Math.floor);let rem=100-fl.reduce((a,b)=>a+b,0);const order=raw.map((x,i)=>[x-fl[i],i]).sort((a,b)=>b[0]-a[0]);for(const [,i] of order){if(rem<=0)break;fl[i]++;rem--;}return e.map(([k,c],i)=>({key:k,count:c,pct:n?fl[i]:0}));};
    const borrows=[];for(const a of S.ancestry(id))for(const b of a.borrows){const src=S.get(b.from);borrows.push({layer:b.layer,into:a.label,from:`“${famOf(src.fam).title}” ${src.label}`});}
    return {id,label:v.label,song:famOf(v.fam).title,total:n,ancestry:S.ancestry(id).map(a=>a.label),makers:pct(byMaker).map(m=>({...m,name:makerLabel(m.key)})),songs:pct(bySong),how:byHow,borrows};};
  // family tree layout: x = generation, y = lane (the original history is lane 0; each branch gets its own lane)
  S.tree=famId=>{const all=[...S.versions.values()].filter(v=>v.fam===famId).sort((a,b)=>a.created-b.created),kids={};for(const v of all)if(v.parent)(kids[v.parent]=kids[v.parent]||[]).push(v);
    const nodes=[];let lanes=0;const walk=(v,gen,lane)=>{nodes.push({id:v.id,label:v.label,maker:v.maker,mine:!!v.mine,kind:v.kind,parent:v.parent,gen,lane,borrows:v.borrows.map(b=>({layer:b.layer,from:b.from,fromLabel:`${famOf(S.get(b.from).fam).title} ${S.get(b.from).label}`}))});
      (kids[v.id]||[]).forEach((k,i)=>walk(k,gen+1,i===0&&(k.kind===v.kind||v.kind==='fork')&&!(v.kind==='original'&&k.kind==='fork')?lane:++lanes));};
    const root=all.find(v=>!v.parent);if(root)walk(root,0,0);
    // a fork off the original line opens a new lane under it; keep lanes compact
    return {nodes,lanes:lanes+1,gens:Math.max(0,...nodes.map(n=>n.gen))+1};};
  S.reset=()=>build();
  S.hashOf=id=>hashCells(S.get(id).cells);S.unique=()=>{const all=[...S.versions.values()].map(v=>hashCells(v.cells));return new Set(all).size===all.length;};
  build();return S;
}
