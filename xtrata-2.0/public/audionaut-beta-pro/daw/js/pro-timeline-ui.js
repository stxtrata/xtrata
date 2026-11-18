import { store } from './state.js';
import { engine } from './engine.js';
import { openRoll,openClipRoll } from './pianoroll.js';
import { beatToSeconds } from './timeline.js';
import { beginTransaction, endTransaction } from './history.js';
import { el, action, row, number, choice, toggle, textField, tracks, uid, status, bindRefresh } from './pro-ui.js';

export function mount(root) {
  let selected = null, zoom = 28, snap = .25, drag = null;
  const heading=el('h2','Song timeline'), help=el('p','Arrange reusable patterns, MIDI and audio clips in beats. Drag to move; drag a clip’s right edge to resize. Alt moves freely. Double-click an empty lane to add a clip.',{className:'pro-help'});
  const toolbar=row(), settings=row(), scroll=el('div',null,{className:'pro-scroll'}), canvas=el('canvas',null,{className:'pro-canvas',tabindex:0,'aria-label':'Song timeline. Select clips with the list below.'}), editor=el('div',null,{className:'pro-clip-editor'}), list=el('div'), maps=el('div');
  const spacer=el('div',null,{'aria-hidden':'true'});canvas.style.position='sticky';canvas.style.left='0';spacer.style.height='1px';scroll.append(canvas,spacer);scroll.addEventListener('scroll',()=>draw());root.append(heading,help,toolbar,settings,scroll,editor,list,maps);
  const timeline=()=>store.project.timeline;
  const change=patch=>store.setTimeline(patch);
  const trackRows=()=>tracks(store).filter(t=>!t.assetOnly);
  const openNotes=c=>{if(c.type==='midi')openClipRoll(c.id);else if(c.type==='pattern'){const i=store.project.instruments.findIndex(t=>t.id===c.trackId),seq=store.project.sequences.findIndex(s=>s.id===c.sequenceId);if(i>=0){if(seq>=0)store.selectSequence(seq);openRoll(i);}}};
  const clip=()=>timeline().clips.find(c=>c.id===selected);
  const update=(id,patch)=>{store.updateClip(id,patch);draw();};
  function convert() {
    if (timeline().clips.length && !confirm('Replace timeline clips with the current pattern sequences?')) return;
    const clips=[];
    store.project.sequences.forEach((sequence,seqIndex)=>trackRows().forEach((track)=>{
      const ch=store.project.channels.indexOf(track), inst=store.project.instruments.indexOf(track);
      if(ch>=0&&!sequence.steps[ch]?.some(Boolean))return;
      if(inst>=0&&!sequence.notes[inst]?.length)return;
      clips.push({id:uid(),trackId:track.id,sourceTrackId:track.id,type:'pattern',sequenceId:sequence.id,start:seqIndex*16,duration:16,offset:0,gain:1});
    }));
    change({enabled:true,lengthBeats:Math.max(16,store.project.sequences.length*16),clips});render();
  }
  function add(trackId=trackRows()[0]?.id,start=0) {
    const t=store.track(trackId);if(!t)return;
    const audio=store.project.channels.includes(t)&&!!engine.buffers[store.project.channels.indexOf(t)];
    const id=store.addClip({trackId,type:audio?'audio':t.kind==='instrument'?'midi':'pattern',notes:[],sequenceId:store.seq.id,sourceTrackId:trackId,start,duration:4,offset:0,sourceOffsetSeconds:0,gain:1,playbackRate:1,fadeIn:0,fadeOut:0});
    selected=typeof id==='object'?id.id:id;render();
  }
  function draw() {
    const ts=trackRows(),t=timeline();if(!t)return;
    const width=Math.max(650,scroll.clientWidth||1100),offset=scroll.scrollLeft,height=Math.max(150,30+ts.length*44);
    spacer.style.width=`${Math.max(width,160+t.lengthBeats*zoom)}px`;canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#101a25';ctx.fillRect(0,0,width,height);ctx.font='12px system-ui';
    for(let beat=Math.max(0,Math.floor(offset/zoom));beat<=Math.min(t.lengthBeats,Math.ceil((offset+width)/zoom));beat++){
      const x=160+beat*zoom-offset;ctx.strokeStyle=beat%4?'#24303c':'#42566b';ctx.beginPath();ctx.moveTo(x,26);ctx.lineTo(x,height);ctx.stroke();
      if(beat%4===0){ctx.fillStyle='#aebfce';ctx.fillText(String(beat+1),x+3,17);}
    }
    ts.forEach((track,i)=>{const y=30+i*44;ctx.fillStyle=i%2?'#16212a':'#1b2834';ctx.fillRect(0,y,158,44);ctx.fillStyle='#d6e2ec';ctx.fillText(track.name.slice(0,21),8,y+26);});
    for(const c of t.clips){const i=ts.findIndex(tr=>tr.id===c.trackId);if(i<0)continue;const x=160+c.start*zoom-offset,y=34+i*44,w=Math.max(4,c.duration*zoom);ctx.fillStyle=c.muted?'#444f5a':c.type==='audio'?'#397b71':'#3e688b';ctx.fillRect(x,y,w,34);ctx.strokeStyle=c.id===selected?'#ffe49a':'#7db6c7';ctx.lineWidth=c.id===selected?2:1;ctx.strokeRect(x,y,w,34);ctx.save();ctx.beginPath();ctx.rect(x,y,w,34);ctx.clip();ctx.fillStyle='#fff';ctx.fillText(c.name||c.type,x+5,y+20);ctx.restore();}
    ts.forEach((track,i)=>{const y=30+i*44;ctx.fillStyle=i%2?'#16212a':'#1b2834';ctx.fillRect(0,y,158,44);ctx.fillStyle='#d6e2ec';ctx.fillText(track.name.slice(0,21),8,y+26);});
    for(const marker of t.markers||[]){const x=160+marker.beat*zoom-offset;ctx.fillStyle='#ffc477';ctx.fillText(marker.name,x+3,29);ctx.fillRect(x,30,1,height);}
  }
  function edit() {
    editor.replaceChildren();const c=clip();if(!c){editor.append(el('p','Select a clip to edit, duplicate, split, slip, fade or remove it.'));return;}
    const fields=row(textField('Clip name',c.name||'',v=>update(c.id,{name:v})),choice('Track',trackRows().map(t=>[t.id,t.name]),c.trackId,v=>update(c.id,{trackId:v})),number('Start beat',c.start,v=>update(c.id,{start:v})),number('Length beats',c.duration,v=>update(c.id,{duration:v}),{min:.015625}),number('Clip gain',c.gain??1,v=>update(c.id,{gain:v}),{min:0,max:4,step:.05}),toggle('Muted',c.muted,v=>update(c.id,{muted:v})));
    if(c.type==='audio')fields.append(number('Source offset seconds',c.sourceOffsetSeconds||0,v=>update(c.id,{sourceOffsetSeconds:v}),{step:.001}),number('Playback rate',c.playbackRate||1,v=>update(c.id,{playbackRate:v}),{min:.1,max:4,step:.01}),number('Fade in beats',c.fadeIn||0,v=>update(c.id,{fadeIn:v}),{max:c.duration,step:.125}),number('Fade out beats',c.fadeOut||0,v=>update(c.id,{fadeOut:v}),{max:c.duration,step:.125}));
    else if(c.type==='pattern')fields.append(number('Slip offset beats',c.offset||0,v=>update(c.id,{offset:v}),{step:.0625}),choice('Pattern',store.project.sequences.map((s,i)=>[s.id,`Sequence ${i+1}`]),c.sequenceId,v=>update(c.id,{sequenceId:v})));
    if(c.type==='midi'||(c.type==='pattern'&&store.track(c.trackId)?.kind==='instrument'))fields.append(action('Edit notes',()=>openNotes(c)));
    const splitInput=el('input',null,{type:'number',step:.25,min:c.start+.015625,max:c.start+c.duration-.015625,value:c.start+c.duration/2,'aria-label':'Split at beat'});
    editor.append(fields,row(action('Duplicate',()=>{const id=store.addClip({...structuredClone(c),id:uid(),start:c.start+c.duration});selected=id?.id||id;render();}),splitInput,action('Split at beat',()=>{
      const at=Number(splitInput.value);if(at<=c.start||at>=c.start+c.duration)throw Error('Split inside the selected clip.');
      beginTransaction();try{const right=structuredClone(c),delta=at-c.start;update(c.id,{duration:delta,fadeOut:0});right.id=uid();right.start=at;right.duration=right.duration-delta;right.fadeIn=0;
        if(c.type==='audio')right.sourceOffsetSeconds=(c.sourceOffsetSeconds||0)+(beatToSeconds(store.project,at)-beatToSeconds(store.project,c.start))*(c.playbackRate||1);else right.offset=(c.offset||0)+delta;
        store.addClip(right);
      }finally{endTransaction();}render();
    }),action('Remove clip',()=>{store.removeClip(c.id);selected=null;render();})));
  }
  function renderMaps() {
    maps.replaceChildren(el('h3','Tempo, meter and markers'));
    const t=timeline();
    for(const [key,title,defaults] of [['tempo','Tempo',{beat:0,bpm:store.project.bpm}],['meter','Time signature',{beat:0,numerator:4,denominator:4}],['markers','Marker',{beat:0,name:'Section'}]]){
      const section=el('div');section.append(el('h4',title));
      (t[key]||[]).forEach((item,i)=>{
        const set=patch=>{const items=structuredClone(timeline()[key]);Object.assign(items[i],patch);change({[key]:items});};
        const r=row(number('Beat',item.beat,v=>set({beat:v})),...(key==='tempo'?[number('BPM',item.bpm,v=>set({bpm:v}),{min:20,max:420,step:.5})]:key==='meter'?[number('Beats per bar',item.numerator,v=>set({numerator:v}),{min:1,max:32,step:1}),choice('Beat unit',['2','4','8','16'],String(item.denominator),v=>set({denominator:Number(v)}))]:[textField('Name',item.name,v=>set({name:v}))]),action('Remove',()=>change({[key]:timeline()[key].filter((_,j)=>i!==j)})));
        section.append(r);
      });section.append(action(`Add ${title.toLowerCase()}`,()=>change({[key]:[...(timeline()[key]||[]),{...defaults,beat:timeline().lengthBeats}]})));maps.append(section);
    }
  }
  function render() {
    const t=timeline();if(!t)return;
    toolbar.replaceChildren(toggle('Use song timeline',t.enabled,v=>change({enabled:v})),action('Build from patterns',convert),action('Add clip',()=>add()),choice('Snap',['0','.0625','.25','.5','1','4'],String(snap),v=>{snap=Number(v);}),choice('Zoom',['14','28','56','112'],String(zoom),v=>{zoom=Number(v);draw();}),number('Song length beats',t.lengthBeats,v=>change({lengthBeats:v}),{min:1,max:16384,step:4}));
    const loop=t.loop||{enabled:false,start:0,end:16},punch=t.punch||{enabled:false,start:0,end:16};
    settings.replaceChildren(toggle('Loop',loop.enabled,v=>change({loop:{...timeline().loop,enabled:v}})),number('Loop start',loop.start,v=>change({loop:{...timeline().loop,start:v}})),number('Loop end',loop.end,v=>change({loop:{...timeline().loop,end:v}})),toggle('Punch',punch.enabled,v=>change({punch:{...timeline().punch,enabled:v}})),number('Punch in',punch.start,v=>change({punch:{...timeline().punch,start:v}})),number('Punch out',punch.end,v=>change({punch:{...timeline().punch,end:v}})));
    draw();edit();list.replaceChildren();
    const select=choice('Selected clip',[['','Choose a clip'],...t.clips.map(c=>[c.id,`${store.track(c.trackId)?.name||'Track'} · ${c.name||c.type} · beat ${c.start}`])],selected||'',v=>{selected=v;draw();edit();});list.append(select);renderMaps();
  }
  function hit(e) {const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const track=trackRows()[Math.floor((y-30)/44)],beat=Math.max(0,(x-160+scroll.scrollLeft)/zoom);return {x,y,track,beat,clip:[...timeline().clips].reverse().find(c=>c.trackId===track?.id&&beat>=c.start&&beat<=c.start+c.duration)};}
  canvas.addEventListener('pointerdown',e=>{const h=hit(e);if(!h.clip){if(h.y<30)engine.seekBeat?.(h.beat);return;}selected=h.clip.id;drag={id:selected,start:h.clip.start,duration:h.clip.duration,beat:h.beat,resize:Math.abs(h.x-(160+(h.clip.start+h.clip.duration)*zoom-scroll.scrollLeft))<9};beginTransaction();canvas.setPointerCapture(e.pointerId);draw();edit();});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const h=hit(e),delta=h.beat-drag.beat,round=v=>e.altKey||!snap?v:Math.round(v/snap)*snap;update(drag.id,drag.resize?{duration:Math.max(.015625,round(drag.duration+delta))}:{start:Math.max(0,round(drag.start+delta))});});
  const finish=()=>{if(!drag)return;drag=null;endTransaction();render();};canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
  canvas.addEventListener('dblclick',e=>{const h=hit(e);if(h.clip)openNotes(h.clip);else if(h.track)add(h.track.id,Math.max(0,snap?Math.round(h.beat/snap)*snap:h.beat));});
  canvas.addEventListener('keydown',e=>{const c=clip();if(!c)return;if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();store.removeClip(c.id);selected=null;render();}else if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();update(c.id,{start:Math.max(0,c.start+(e.key==='ArrowRight'?1:-1)*(snap||.0625))});edit();}});
  const off=bindRefresh(store,()=>{if(drag)return;if(root.contains(document.activeElement)&&document.activeElement.matches('input,select')){draw();return;}render();});render();
  return()=>{off();if(drag)endTransaction();};
}
