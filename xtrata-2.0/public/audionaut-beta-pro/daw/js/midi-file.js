import { store } from './state.js';
import { newId } from './project-model.js';
import { compilePlaybackPlan } from './playback-plan.js';
const utf8 = new TextDecoder();
export function parseMidiFile(input) {
  const bytes=input instanceof Uint8Array?input:new Uint8Array(input),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(bytes.length>16*1024*1024)throw new Error('This MIDI file exceeds the 16 MB import limit.');
  let p=0,count=0;const need=n=>{if(p+n>bytes.length)throw new Error('Truncated MIDI file.');},u8=()=>{need(1);return bytes[p++];},u16=()=>{need(2);const n=view.getUint16(p);p+=2;return n;},u32=()=>{need(4);const n=view.getUint32(p);p+=4;return n;},text=n=>{need(n);const s=utf8.decode(bytes.subarray(p,p+n));p+=n;return s;};
  const vlq=()=>{let n=0;for(let i=0;i<4;i++){const b=u8();n=(n<<7)|(b&127);if(!(b&128))return n;}throw new Error('Invalid MIDI variable-length value.');};
  if(text(4)!=='MThd')throw new Error('Choose a Standard MIDI file (.mid).');
  const header=u32(),format=u16(),trackCount=u16(),division=u16();if(header<6||format>1||division&0x8000||!division)throw new Error('Only musical-time MIDI formats 0 and 1 are supported.');p+=header-6;
  const tracks=[],tempo=[],meter=[];let lengthBeats=0;
  for(let ti=0;ti<trackCount;ti++){
    if(text(4)!=='MTrk')throw new Error('Invalid MIDI track.');const size=u32(),end=p+size;if(end>bytes.length)throw new Error('Truncated MIDI track.');
    let tick=0,running=0,name=`MIDI ${ti+1}`;const notes=[],active=new Map(),bends=new Map(),messages=[];
    while(p<end){if(++count>1000000)throw new Error('This MIDI file contains too many events.');tick+=vlq();let status=u8();if(status<128){if(!running)throw new Error('Invalid MIDI running status.');p--;status=running;}else if(status<240)running=status;
      if(status===255){const type=u8(),size=vlq();need(size);const data=bytes.subarray(p,p+size);p+=size;if(type===3)name=utf8.decode(data);if(type===81&&size===3){const us=(data[0]<<16)|(data[1]<<8)|data[2];if(us)tempo.push({beat:tick/division,bpm:60000000/us});}if(type===88&&size>=2)meter.push({beat:tick/division,numerator:data[0],denominator:2**data[1]});if(type===47)break;continue;}
      if(status===240||status===247){p+=vlq();running=0;continue;}
      const type=status&240,channel=status&15,a=u8(),b=type===192||type===208?0:u8(),key=`${channel}:${a}`,beat=tick/division;
      if(type===144&&b>0){const note={id:newId('note'),step:beat*4,dur:0,pitch:a,vel:b/127,channel,expression:[{offset:0,type:'bend',value:bends.get(channel)||0}]};(active.get(key)||active.set(key,[]).get(key)).push(note);notes.push(note);}
      else if(type===128||type===144){const note=active.get(key)?.shift();if(note)note.dur=Math.max(1/960,beat*4-note.step);}
      else if(type===224||type===176){const message=type===224?{type:'bend',value:(((b<<7)|a)-8192)/8192*2}:{type:'cc',controller:a,value:b};if(type===224)bends.set(channel,message.value);messages.push({beat,channel,...message});for(const list of active.values())for(const note of list)if(note.channel===channel)note.expression.push({...message,offset:beat-note.step/4});}
      lengthBeats=Math.max(lengthBeats,beat);
    }
    p=end;for(const note of notes){if(!note.dur)note.dur=Math.max(.25,lengthBeats*4-note.step);note.rawStep=note.step;note.rawDur=note.dur;}
    if(notes.length)tracks.push({name,notes,messages});
  }
  return {format,ppq:division,tracks,tempo:tempo.length?tempo:[{beat:0,bpm:120}],meter:meter.length?meter:[{beat:0,numerator:4,denominator:4}],lengthBeats:tracks.reduce((end,t)=>t.notes.reduce((n,note)=>Math.max(n,(note.step+note.dur)/4),end),Math.max(1,lengthBeats))};
}
export function importMidiFile(bytes,{start=0,targetTrackId=null}={}) {
  const data=parseMidiFile(bytes);
  if(!targetTrackId&&store.project.instruments.length+data.tracks.length>32)throw new Error('This MIDI file would exceed 32 instrument tracks. Import into a selected track or reduce the file.');
  store.enableTimeline();const ids=[];
  for(const imported of data.tracks){const track=targetTrackId?store.track(targetTrackId):store.addInstrument();if(!track||track.kind!=='instrument')throw new Error('Choose an instrument track for MIDI.');if(!targetTrackId)store.setTrackProp(track.id,'name',imported.name);const clip=store.addClip({type:'midi',trackId:track.id,start,duration:data.lengthBeats,notes:imported.notes});ids.push(clip.id);}
  store.setTimeline({tempo:[...store.project.timeline.tempo.filter(p=>p.beat<start),...data.tempo.map(p=>({...p,beat:p.beat+start}))],meter:[...store.project.timeline.meter.filter(p=>p.beat<start),...data.meter.map(p=>({...p,beat:p.beat+start}))],lengthBeats:Math.max(store.project.timeline.lengthBeats,start+data.lengthBeats)});return {clips:ids,tracks:data.tracks.length};
}
const vlq=n=>{n=Math.max(0,Math.round(n));const bytes=[n&127];while(n>>=7)bytes.unshift((n&127)|128);return bytes;};
const be32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],ascii=s=>[...s].map(c=>c.charCodeAt(0));
const chunk=(type,body)=>[...ascii(type),...be32(body.length),...body];
function trackChunk(events){events.sort((a,b)=>a.tick-b.tick||a.order-b.order);let tick=0;const body=[];for(const e of events){body.push(...vlq(e.tick-tick),...e.data);tick=e.tick;}body.push(0,255,47,0);return chunk('MTrk',body);}
export function exportMidiFile(project,{scope='song',ppq=960}={}) {
  const plan=compilePlaybackPlan(project,{scope}),tempo=project.timeline?.enabled?project.timeline.tempo:[{beat:0,bpm:project.bpm}],meta=[];
  for(const p of tempo||[]){if(p.beat>plan.endBeat)continue;const micro=Math.round(60000000/p.bpm);meta.push({tick:Math.max(0,Math.round((p.beat-plan.startBeat)*ppq)),order:0,data:[255,81,3,(micro>>>16)&255,(micro>>>8)&255,micro&255]});}
  for(const m of project.timeline?.meter||[{beat:0,numerator:4,denominator:4}])meta.push({tick:Math.max(0,Math.round((m.beat-plan.startBeat)*ppq)),order:0,data:[255,88,4,m.numerator,Math.round(Math.log2(m.denominator)),24,8]});
  const chunks=[trackChunk(meta)];
  project.instruments.forEach((track,index)=>{
    const channel=index%16,events=[],name=[...new TextEncoder().encode(track.name||`Track ${index+1}`)];events.push({tick:0,order:-1,data:[255,3,...vlq(name.length),...name]});
    for(const note of plan.events.filter(e=>e.type==='note'&&e.trackId===track.id)){
      const start=Math.max(0,Math.round((note.beat-plan.startBeat)*ppq)),end=Math.max(start+1,Math.round((note.endBeat-plan.startBeat)*ppq));events.push({tick:start,order:2,data:[144|channel,note.pitch,Math.max(1,Math.min(127,Math.round(note.velocity*127)))]},{tick:end,order:0,data:[128|channel,note.pitch,0]});
      for(const p of note.expression||[]){const tick=Math.max(start,Math.round((note.beat+(p.offset||0)-plan.startBeat)*ppq));if(p.type==='bend'){const value=Math.max(0,Math.min(16383,Math.round(8192+p.value/2*8192)));events.push({tick,order:1,data:[224|channel,value&127,(value>>>7)&127]});}else if(p.type==='cc')events.push({tick,order:1,data:[176|channel,p.controller,p.value]});}
    }
    if(events.length>1)chunks.push(trackChunk(events));
  });
  return new Uint8Array([...chunk('MThd',[0,1,(chunks.length>>>8)&255,chunks.length&255,(ppq>>>8)&255,ppq&255]),...chunks.flat()]);
}
