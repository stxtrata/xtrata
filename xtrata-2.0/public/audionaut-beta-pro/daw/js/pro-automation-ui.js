import { store } from './state.js';
import { engine } from './engine.js';
import { SYNTH_BANK } from './synths.js';
import { PLUGIN_TYPES, typeParams } from './plugins.js';
import { el, action, row, number, choice, toggle, tracks, uid, bindRefresh } from './pro-ui.js';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const recordedAt=new Map();
export function recordAutomation(target,value) {
  if(!Number.isFinite(value)||!engine.isPlaying||!['touch','latch','write'].includes(store.project.automationMode))return;
  const key=JSON.stringify(target),time=performance.now(),last=recordedAt.get(key)||0;if(time-last<16)return;recordedAt.set(key,time);
  const beat=Math.max(0,engine.getMusicalPosition().beat);store.recordAutomationPoint(target,{beat,value,curve:'linear'});
}
function targets() {
  const result=[];
  for(const t of [...tracks(store),...store.project.buses,{...store.project.master,id:'master',name:'Master'}]){
    for(const kind of ['volume','pan'])result.push({label:`${t.name} · ${kind}`,target:{trackId:t.id,kind},min:kind==='pan'?-1:0,max:kind==='pan'?1:4,value:kind==='pan'?(t.pan||0):(t.id==='master'?store.project.masterVolume:t.volume??1)});
    if(t.kind==='instrument'){
      result.push({label:`${t.name} · pitch bend`,target:{trackId:t.id,kind:'bend'},min:-24,max:24,value:0});
      for(const p of SYNTH_BANK[t.synthId]?.params||[])if(typeof p.def==='number')result.push({label:`${t.name} · ${p.label||p.key}`,target:{trackId:t.id,kind:'synthParam',param:p.key},min:p.min??0,max:p.max??1,value:t.params?.[p.key]??p.def});
    }
    for(const slot of [...t.inserts||[],...t.fx||[]])for(const p of typeParams(PLUGIN_TYPES[slot.type]))if(typeof p.def==='number')result.push({label:`${t.name} · ${PLUGIN_TYPES[slot.type].name} · ${p.label||p.key}`,target:{trackId:t.id,kind:'effectParam',slotId:slot.id,param:p.key},min:p.min??0,max:p.max??1,value:slot.params[p.key]??p.def});
  }return result;
}
export function mount(root) {
  root.append(el('h2','Automation'),el('p','Add points in beats. Linear ramps join points; step curves hold a value. Touch records gestures, latch keeps control until stop, and write ignores existing playback automation while recording changes.',{className:'pro-help'}));
  const controls=row(),editor=el('div'),canvas=el('canvas',null,{width:1100,height:250,tabindex:0,'aria-label':'Automation curve. Use the point controls below for keyboard editing.'});root.append(controls,canvas,editor);let selected=store.project.timeline.automation[0]?.id,drag=-1,page=0;const pageSize=128;
  const lane=()=>store.project.timeline.automation.find(l=>l.id===selected);
  function save(points){store.setAutomationLane({...lane(),points});}
  function paint(){
    const list=targets(),lanes=store.project.timeline.automation;controls.replaceChildren(choice('Mode',['read','touch','latch','write'],store.project.automationMode||'read',v=>store.setProjectProp('automationMode',v)));
    let pick=list[0];controls.append(choice('New lane',list.map((t,i)=>[String(i),t.label]),'0',v=>pick=list[Number(v)]),action('Add lane',()=>{const existing=lanes.find(l=>same(l.target,pick.target));selected=existing?.id||store.setAutomationLane({target:pick.target,points:[{beat:0,value:pick.value,curve:'linear'}]}).id;paint();}));
    if(lanes.length&&!lane())selected=lanes[0].id;
    controls.append(choice('Lane',lanes.map(l=>[l.id,list.find(t=>same(t.target,l.target))?.label||`${l.target.trackId} ${l.target.param||l.target.kind}`]),selected||'',v=>{selected=v;page=0;paint();}));
    editor.replaceChildren();const current=lane();draw();if(!current){editor.append(el('p','Create a lane to start editing.'));return;}
    const spec=list.find(t=>same(t.target,current.target))||{min:-10000,max:10000};
    editor.append(row(toggle('Enabled',current.enabled!==false,v=>store.setAutomationLane({...current,enabled:v})),action('Add point at playhead',()=>save([...current.points,{beat:engine.getMusicalPosition().beat,value:current.points.at(-1)?.value||0,curve:'linear'}])),action('Delete lane',()=>{store.setTimeline({automation:lanes.filter(l=>l.id!==selected)});selected=null;paint();})));
    page=Math.max(0,Math.min(page,Math.ceil(current.points.length/pageSize)-1));editor.append(row(action('Previous points',()=>{page=Math.max(0,page-1);paint();},{disabled:page===0}),el('span',`Points ${Math.min(current.points.length,page*pageSize+1)}–${Math.min(current.points.length,(page+1)*pageSize)} of ${current.points.length}`),action('Next points',()=>{page++;paint();},{disabled:(page+1)*pageSize>=current.points.length})));
    const points=el('div',null,{className:'pro-points'});for(let i=page*pageSize;i<Math.min(current.points.length,(page+1)*pageSize);i++){const p=current.points[i],change=patch=>{const next=structuredClone(current.points);Object.assign(next[i],patch);save(next);};points.append(row(number(`Point ${i+1} beat`,p.beat,v=>change({beat:v}),{max:store.project.timeline.lengthBeats,step:1/16}),number(`Point ${i+1} value`,p.value,v=>change({value:v}),{min:spec.min,max:spec.max,step:.01}),choice(`Point ${i+1} curve`,['linear','step'],p.curve||'linear',v=>change({curve:v})),action('Remove point',()=>save(current.points.filter((_,j)=>j!==i)))));}editor.append(points);
  }
  function geometry(){const l=lane(),spec=targets().find(t=>same(t.target,l?.target))||{min:0,max:1};return{l,min:spec.min,max:spec.max,len:Math.max(4,store.project.timeline.lengthBeats)};}
  function draw(){const c=canvas.getContext('2d'),{l,min,max,len}=geometry();c.fillStyle='#111926';c.fillRect(0,0,canvas.width,canvas.height);c.strokeStyle='#304056';for(let i=0;i<=16;i++){c.beginPath();c.moveTo(i*canvas.width/16,0);c.lineTo(i*canvas.width/16,canvas.height);c.stroke();}if(!l)return;const x=p=>p.beat/len*canvas.width,y=p=>canvas.height-20-(p.value-min)/(max-min||1)*(canvas.height-40);const visible=[];if(l.points.length<=canvas.width*2)visible.push(...l.points);else{let bucket=null;const flush=()=>{if(bucket)for(const i of [...new Set([bucket.first,bucket.min,bucket.max,bucket.last])].sort((a,b)=>a-b))visible.push(l.points[i]);};for(let i=0;i<l.points.length;i++){const pixel=Math.floor(x(l.points[i]));if(!bucket||bucket.pixel!==pixel){flush();bucket={pixel,first:i,last:i,min:i,max:i};}else{bucket.last=i;if(l.points[i].value<l.points[bucket.min].value)bucket.min=i;if(l.points[i].value>l.points[bucket.max].value)bucket.max=i;}}flush();}c.strokeStyle='#56d6bd';c.lineWidth=2;c.beginPath();visible.forEach((p,i)=>{if(!i)c.moveTo(x(p),y(p));else{const prev=visible[i-1];if(prev.curve==='step')c.lineTo(x(p),y(prev));c.lineTo(x(p),y(p));}});c.stroke();c.fillStyle='#b6ffed';for(const p of visible){c.beginPath();c.arc(x(p),y(p),5,0,Math.PI*2);c.fill();}}
  function coordinate(e){const r=canvas.getBoundingClientRect(),{min,max,len}=geometry();return{beat:Math.max(0,Math.min(len,Math.round((e.clientX-r.left)/r.width*len*16)/16)),value:Math.max(min,Math.min(max,max-((e.clientY-r.top)/r.height*canvas.height-20)/(canvas.height-40)*(max-min)))};}
  canvas.onpointerdown=e=>{const l=lane();if(!l)return;const p=coordinate(e);drag=l.points.findIndex(x=>Math.abs(x.beat-p.beat)<geometry().len/50);if(drag<0){l.points.push({...p,curve:'linear'});drag=l.points.length-1;}canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(drag<0||!lane()?.points[drag])return;Object.assign(lane().points[drag],coordinate(e));draw();};const finish=()=>{if(drag<0)return;drag=-1;if(lane())save(lane().points);paint();};canvas.onpointerup=finish;canvas.onpointercancel=finish;canvas.onlostpointercapture=finish;window.addEventListener('blur',finish);
  const off=bindRefresh(store,()=>{if(drag<0&&!editor.contains(document.activeElement))paint();},['project','load','channels','instruments']);paint();return()=>{finish();off();window.removeEventListener('blur',finish);};
}
