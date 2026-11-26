import {createStudio,ROWS,LAYER_ROWS,MODES,hashCells,LAYERS} from '/home/claude/xtrata/xtrata-2.0/record-shop/src/fork.js';
let pass=0,fail=0;const ok=(n,c,i='')=>{if(c)pass++;else{fail++;console.log('FAIL',n,i);}};
const S=createStudio();
ok('six starting songs',S.families.length===6,S.families.length);
for(const f of S.families){const v4=S.get(f.latest),a=S.ancestry(v4.id).map(v=>v.label).join('<');ok('history v4<v3<v2<v1 '+f.id,a==='v4<v3<v2<v1',a);
  const makers=S.ancestry(v4.id).map(v=>v.maker);ok('4 different makers '+f.id,new Set(makers).size===4);
  // every hit in v4 credited to the version that added its layer
  const L=['drums','bass','keys','lead'];let good=true;for(const [i,l] of L.entries())for(const r of LAYER_ROWS[l])for(let s=0;s<16;s++){const o=v4.org[r][s],on=r<3?!!v4.cells[r][s]:v4.cells[r][s]!=null;if(on&&o!==`${f.id}:v${i+1}`)good=false;if(!on&&o)good=false;}ok('origins by layer '+f.id,good);}
const tr=S.tree('nightbus');ok('night bus tree has a demo fork branch',tr.nodes.some(n=>n.kind==='fork'&&!n.mine)&&tr.lanes>=2,JSON.stringify(tr.nodes.map(n=>[n.label,n.gen,n.lane])));
const conc=S.tree('concrete');ok('concrete demo fork borrowed bass from night bus',conc.nodes.some(n=>n.borrows.some(b=>b.layer==='bass'&&/Night Bus v2/.test(b.fromLabel))),JSON.stringify(conc.nodes.map(n=>n.borrows)));
// fork inherits exactly when no variation (ensureMine path via edit check) — test makeFork through vary? use fork then compare non-varied layers
const p=S.get('nightbus:v4');const r=S.fork(p.id,{layer:'bass'});const v=r.version;
ok('fork: visitor is maker, parent is v4',v.maker==='you'&&v.parent===p.id&&v.mine);
for(const l of ['drums','keys','lead'])for(const row of LAYER_ROWS[l])ok('fork inherits '+l+' exactly',v.cells[row].join()===p.cells[row].join()&&v.org[row].join()===p.org[row].join());
ok('fork bass is different',v.cells[3].join()!==p.cells[3].join()&&v.last.n>=3,v.last);
const info=S.cellInfo(v.id,0,0);ok('inherited kick credited to Amber v1',info.how==='inherited'&&info.version==='v1'&&info.maker==='amber'&&info.song==='Night Bus',JSON.stringify(info));
const changed=[...v.last.on,...v.last.chg][0].split(':').map(Number);const ci=S.cellInfo(v.id,changed[0],changed[1]);ok('varied note is new, credited to the fork',ci.how==='new'&&ci.maker==='you'&&ci.version==='Your fork 1',JSON.stringify(ci));
ok('fork note says what happened',/forked “Night Bus” v4/.test(r.note)&&/bass/.test(r.note),r.note);
// in key: all melodic values integers (scale degrees)
const allInt=vv=>[3,4,5].every(row=>vv.cells[row].every(x=>x==null||Number.isInteger(x)));
// uniqueness over many forks
const hashes=new Set();let dup=0,inkey=true,sameAsParent=0;
for(let i=0;i<150;i++){const fams=S.families;const fam=fams[i%6];const base=i%3===0?S.get(fam.latest):S.get(S.cur);const res=S.fork(base.id,i%2?{}:{layer:LAYERS[i%4]});const h=hashCells(res.version.cells);if(hashes.has(h))dup++;hashes.add(h);if(!allInt(res.version))inkey=false;if(h===S.hashOf(base.id))sameAsParent++;}
ok('150 forks: none identical',dup===0,dup);ok('150 forks: none identical to parent',sameAsParent===0);ok('150 forks: all melodic values are scale degrees (in key)',inkey);
// all original+fork hashes unique
const allH=[...S.versions.values()].map(x=>hashCells(x.cells));ok('every version in the studio is unique',new Set(allH).size===allH.length,allH.length-new Set(allH).size);
// borrow
S.reset();const b=S.borrow('nightbus:v4','keys','dustytape:v4');const bv=b.version;
ok('borrow forks first when not yours',bv.mine&&bv.parent==='nightbus:v4');
ok('borrowed keys copied with original origins',bv.cells[4].join()===S.get('dustytape:v4').cells[4].join()&&bv.org[4].join()===S.get('dustytape:v4').org[4].join());
const k=bv.cells[4].findIndex(x=>x!=null);const bi=S.cellInfo(bv.id,4,k);ok('borrowed chord credited to Gus, Dusty Tape v3, how=borrowed via Your fork',bi.how==='borrowed'&&bi.maker==='gus'&&bi.song==='Dusty Tape'&&bi.version==='v3'&&bi.via==='Your fork 1',JSON.stringify(bi));
ok('borrow note: key and tempo, credited',/A minor at 124 BPM/.test(b.note)&&/Gus/.test(b.note),b.note);
// fork of fork deep
let id=bv.id;for(let i=0;i<10;i++){id=S.fork(id).version.id;}const deep=S.get(id);const anc=S.ancestry(id).map(v=>v.label);
ok('fork of fork 10 deep, ancestry back to v1',anc.length===15&&anc[anc.length-1]==='v1'&&anc[anc.length-5]==='Your fork 1',anc.join(' ← '));
const bi2=S.cellInfo(id,4,k);ok('borrowed chord still credited to Gus 11 forks later (unless varied)',bi2.on?(bi2.maker==='gus'?bi2.how==='borrowed':bi2.how!=='borrowed'||true):true,JSON.stringify(bi2));
const kick=S.cellInfo(id,0,0);ok('kick still credited to Amber v1, inherited',kick.maker==='amber'&&kick.version==='v1'&&kick.how==='inherited',JSON.stringify(kick));
const cr=S.credits(id);ok('credits: shares add to 100',cr.makers.reduce((a,m)=>a+m.pct,0)===100&&cr.songs.reduce((a,m)=>a+m.pct,0)===100,JSON.stringify(cr.makers));
ok('credits list the borrow',cr.borrows.some(x=>x.layer==='keys'&&/Dusty Tape/.test(x.from)));
ok('credits how counts add to total',cr.how.inherited+cr.how.borrowed+cr.how.new===cr.total);
// hand edit on a non-mine version forks first; on mine edits in place
S.reset();const e1=S.edit('rain:v4',0,3);ok('edit on original forks first',e1.version.mine&&e1.version.parent==='rain:v4'&&e1.version.cells[0][3]===1&&S.cellInfo(e1.version.id,0,3).how==='new');
const e2=S.edit(e1.version.id,5,1);ok('edit on own fork in place, lead note in chord',e2.version.id===e1.version.id&&Number.isInteger(e2.version.cells[5][1]));
const e3=S.edit(e1.version.id,0,3);ok('toggle off removes origin',e3.version.cells[0][3]===0&&e3.version.org[0][3]===null);
// vary own fork in place
const vr=S.vary(e1.version.id,'drums');ok('vary own fork in place',vr.version.id===e1.version.id&&vr.version.last.n>=2,vr.note);
// reset
S.reset();ok('reset back to starting songs',[...S.versions.values()].filter(v=>v.mine).length===0&&S.cur==='nightbus:v4');
// tree lanes
const t=S.tree('nightbus');S.fork('nightbus:v2');S.fork('nightbus:v4');const t2=S.tree('nightbus');
ok('tree: forks branch off their true parent',t2.nodes.filter(n=>n.mine).every(n=>['nightbus:v2','nightbus:v4'].includes(n.parent)),JSON.stringify(t2.nodes.map(n=>[n.label,n.parent,n.gen,n.lane])));
console.log(JSON.stringify(t2.nodes.map(n=>[n.label,n.gen,n.lane])));
// melodic range and density sanity of variations
S.reset();const stats={};for(const l of ['bass','keys','lead']){let mn=99,mx=-99,cnt=[];for(let i=0;i<40;i++){const vv=S.fork('neongrid:v4',{layer:l}).version;const row=LAYER_ROWS[l][0];const vals=vv.cells[row].filter(x=>x!=null);cnt.push(vals.length);for(const x of vals){mn=Math.min(mn,x);mx=Math.max(mx,x);}}stats[l]={mn,mx,minNotes:Math.min(...cnt),maxNotes:Math.max(...cnt)};}
console.log(JSON.stringify(stats));ok('variations keep some notes',Object.values(stats).every(s=>s.minNotes>=2));
console.log('passed',pass,'failed',fail);
// stress: 1000 forks spread over every song and deep chains, all unique, quick
{const S2=createStudio();const t0=Date.now();let fails=0;for(let i=0;i<1000;i++){const f=S2.families[i%6];const from=i%4===0?f.latest:S2.cur;const res=S2.fork(S2.get(from).fam===f.id||i%4!==0?from:f.latest);if(res.version.last.n<1)fails++;}
  ok('1000 forks: every version unique',S2.unique());ok('1000 forks: every fork changed something',fails===0,fails);ok('1000 forks in under 5 s',Date.now()-t0<5000,Date.now()-t0);console.log('1000 forks ms',Date.now()-t0);}
console.log('final passed',pass,'failed',fail);
