import assert from 'node:assert/strict';
import {createGranulatorVoice} from '../daw/js/synths/fx/granulator.js';

// A live AudioContext clock can advance during graph construction. Inject that
// exact boundary deterministically; a busy-loop/browser timing test would miss
// it intermittently. AudioParam rejects invalid durations as the browser does.
function contextWithClockJump(sampleRate,jump){
  const nodes=[],curves=[],ctx={sampleRate,currentTime:0};
  const param=()=>({value:1,setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){},setValueCurveAtTime(curve,time,duration){
    assert.ok(Number.isFinite(duration)&&duration>0,'native curves require a positive finite duration');curves.push({curve,time,duration});
  }});
  const node=kind=>{const value={kind,connections:0,starts:[],stops:[],gain:param(),frequency:param(),Q:param(),pan:param(),detune:param(),playbackRate:param(),connect(target){this.connections++;return target;},disconnect(){this.connections=0;},start(...args){this.starts.push(args);},stop(at){this.stops.push(at);}};nodes.push(value);return value;};
  ctx.createGain=()=>node('gain');ctx.createBiquadFilter=()=>node('filter');ctx.createBufferSource=()=>node('source');ctx.createStereoPanner=()=>{ctx.currentTime=jump;return node('pan');};
  return{ctx,nodes,curves};
}

let checks=0;
for(const sampleRate of [44100,48000,96000])for(const [label,jump,skipped]of [['on time',0,false],['late',.0425,false],['two samples remain',.085-2/sampleRate,false],['subsample remainder',.085-.5/sampleRate,true],['exact end',.085,true],['expired during construction',.085+5/sampleRate,true]]){
  const{ctx,nodes,curves}=contextWithClockJump(sampleRate,jump),buffer={length:sampleRate*2,duration:2,getChannelData:()=>new Float32Array(1)},config={rootMidi:60,sourceId:'source',sources:[{id:'source',sourceTrackId:'sample'}]};
  let ended=0,voice;
  try{
    voice=createGranulatorVoice(ctx,{}, {id:'timing-test'},config,{pitch:60,vel:.8,time:0,dur:1,held:true},{grainMs:85,density:4,position:.25,scan:0,spray:0,detune:0,spread:0},()=>ended++,{offline:false,seed:1,bufferForSource:()=>buffer});
    const source=nodes.find(n=>n.kind==='source');
    assert.equal(curves.length,skipped?0:1,`${label} ${sampleRate}`);
    assert.equal(source.starts.length,skipped?0:1);
    if(skipped){assert.equal(voice.sources.length,0);for(const n of nodes.slice(-3))assert.equal(n.connections,0,'expired grain nodes are disconnected');}
    else{
      const event=curves[0],actual=jump,remaining=.085-jump;
      assert.ok(Math.abs(event.time-actual)<1e-12);assert.ok(Math.abs(event.duration-remaining)<1e-12);
      assert.ok(Math.abs(source.starts[0][1]-(.25*(2-.085)+actual))<1e-12,'late source position advances by elapsed grain time');
      assert.ok(Math.abs(event.curve[0]-Math.sin(Math.PI*actual/.085)**2*.65)<1e-7,'late envelope begins at its true phase');
      assert.equal(event.curve.at(-1),0);assert.ok(Math.abs(source.stops[0]-(.085+1/sampleRate))<1e-12,'late grains keep their original end');
    }
    checks++;
  }finally{
    voice?.stop(ctx.currentTime);
    for(const n of nodes)if(n.starts.length)n.onended?.();
  }
  assert.equal(ended,1,'voice cleanup occurs exactly once');assert.ok(nodes.every(n=>n.connections===0),'no graph connections survive cleanup');
}
console.log(`PASS ${checks} granular clock-jump cases: expired grain cleanup, late curve phase/source offset, original end and voice cleanup`);
