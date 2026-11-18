#!/usr/bin/env node
import assert from 'node:assert/strict';
import {encodeWav} from '../daw/js/audio-utils.js';
import {zipFiles} from '../daw/js/zip-files.js';
import {inspectPcmWav,decodePcmPlanes} from '../daw/js/pcm-wav.js';
import {mixDuration} from '../daw/js/render-mix.js';
import {makeProject} from '../daw/js/state.js';
import {serve,browser} from './serve.mjs';
const planes=[new Float32Array([0,.5,-.5,1.25]),new Float32Array([0,-.5,.5,-1.25])];
const fake={sampleRate:48000,length:4,duration:4/48000,numberOfChannels:2,getChannelData:i=>planes[i]};
for(const depth of [16,24,'float32']){const blob=encodeWav(fake,{bitDepth:depth}),view=new DataView(await blob.arrayBuffer());assert.equal(view.getUint16(34,true),depth==='float32'?32:depth);assert.equal(view.getUint16(20,true),depth==='float32'?3:1);if(depth==='float32')assert.equal(view.getFloat32(44+3*8,true),1.25);}
for(const depth of [16,24,'float32']){const bytes=await encodeWav(fake,{bitDepth:depth}).arrayBuffer(),header=inspectPcmWav(bytes),decoded=decodePcmPlanes(bytes);assert.equal(header.sampleRate,48000);assert.equal(header.channels,2);assert.ok(Math.abs(decoded[0][1]-.5)<.00004);assert.ok(Math.abs(decoded[1][2]-.5)<.00004);assert.equal(decoded[0][3],depth==='float32'?1.25:depth===16?32767/32768:8388607/8388608);assert.throws(()=>inspectPcmWav(bytes.slice(0,-1)),/truncated/);}
const odd=await encodeWav({...fake,numberOfChannels:1,length:1,duration:1/48000},{bitDepth:24}).arrayBuffer();assert.equal(odd.byteLength,48);assert.equal(new DataView(odd).getUint32(40,true),3);assert.equal(inspectPcmWav(odd).frames,1);
const tailProject=makeProject();tailProject.channels[0].inserts=[{id:'a',type:'chorus',params:{}},{id:'b',type:'phaser',params:{}}];tailProject.channels[0].output='tail-bus';tailProject.buses=[{id:'tail-bus',output:'master',auxSends:[],inserts:[{id:'c',type:'flanger',params:{}}],fx:[]}];assert.ok(mixDuration(tailProject,{tail:'auto'})-mixDuration(tailProject,{tail:0})>=6,'serial track and bus tails must accumulate');
const printedTail=makeProject();printedTail.timeline.enabled=true;printedTail.timeline.lengthBeats=4;printedTail.timeline.clips=[{id:'printed',type:'audio',trackId:printedTail.channels[0].id,start:0,duration:4,tailSeconds:1}];assert.equal(mixDuration(printedTail,{tail:0}),2);assert.equal(mixDuration(printedTail,{tail:'auto'}),3,'printed clip tail extends export exactly once');
const zip=await zipFiles([{name:'test.wav',blob:encodeWav(fake,{bitDepth:24})}]);assert.equal(new DataView(await zip.arrayBuffer()).getUint32(0,true),0x04034b50);
const {srv,url}=await serve();const b=await browser();const page=await b.newPage();
try{
await page.route('**/__export',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Export test</title><button id=activate>Start audio checks</button>'}));await page.goto(url+'/__export');await page.click('#activate');
const result=await page.evaluate(async()=>{
const {makeProject,makeSequence,store}=await import('/audionaut-beta-pro/daw/js/state.js');const {normalizeProjectModel}=await import('/audionaut-beta-pro/daw/js/project-model.js');const {renderMix,renderStems}=await import('/audionaut-beta-pro/daw/js/render-mix.js');const {compilePlaybackPlan}=await import('/audionaut-beta-pro/daw/js/playback-plan.js');const {registerAudioBuffer}=await import('/audionaut-beta-pro/daw/js/assets.js');const P=await import('/audionaut-beta-pro/daw/js/persistence.js');const L=await import('/audionaut-beta-pro/daw/js/loader.js');
const q=makeProject();q.channels.length=1;q.bpm=420;q.playEmptySequences=false;q.sequences=Array.from({length:3},()=>makeSequence(1));q.sequences[0].steps[0][0]=q.sequences[2].steps[0][0]=1;normalizeProjectModel(q);
const ctx=new AudioContext(),buffer=ctx.createBuffer(1,4410,44100);for(let i=0;i<buffer.length;i++)buffer.getChannelData(0)[i]=Math.sin(i*2*Math.PI*220/44100)*.5;
const progress=[];const mix=await renderMix(q,[buffer],{tail:0,sampleRate:48000,bitDepth:24,onProgress:v=>progress.push(v.phase)});const view=new DataView(await mix.arrayBuffer());const seconds=view.getUint32(40,true)/(48000*6);const plan=compilePlaybackPlan(q);
q.sequences=[makeSequence(1)];q.sequences[0].notes[0]=[{id:'fixed-note',step:0,dur:4,pitch:60,vel:.8}];q.instruments[0].synthId='vox';q.instruments[0].params={breath:.8};normalizeProjectModel(q);
const a=new Uint8Array(await(await renderMix(q,[],{tail:1,bitDepth:'float32'})).arrayBuffer()),b=new Uint8Array(await(await renderMix(q,[],{tail:1,bitDepth:'float32'})).arrayBuffer());let different=0,maxDelta=0;const av=new DataView(a.buffer),bv=new DataView(b.buffer);for(let i=44;i<a.length;i+=4){if(av.getFloat32(i,true)!==bv.getFloat32(i,true))different++;maxDelta=Math.max(maxDelta,Math.abs(av.getFloat32(i,true)-bv.getFloat32(i,true)));}
const controller=new AbortController();let cancelled=false;try{await renderMix(q,[],{signal:controller.signal,onProgress:v=>{if(v.phase==='schedule')controller.abort();}});}catch(error){cancelled=error.name==='AbortError';}
const stems=await renderStems(q,[],{tail:0,trackIds:[q.instruments[0].id]});
store.loadProject(makeProject());const source=await registerAudioBuffer(buffer,{name:'Recorded.wav',bitDepth:24});store.setChannelProp(0,'source',source);const text=await P.exportProjectAsync();P.importProject(text);const decoded=await L.fetchAndDecode(store.channel(0).source);const archive=await L.collectProjectAssets(store.project);const frozen=JSON.stringify(archive);P.importProject({...archive,format:'audionaut-workstation/3'});
await ctx.close();return {bits:view.getUint16(34,true),rate:view.getUint32(24,true),seconds,planned:plan.duration,progress,different,maxDelta,cancelled,stems:stems.length,recordDuration:decoded.audioBuffer.duration,archiveInline:JSON.parse(frozen).channels[0].source.value.startsWith('data:audio/')};
});
console.log(JSON.stringify(result));assert.equal(result.bits,24);assert.equal(result.rate,48000);assert.ok(Math.abs(result.seconds-result.planned)<1/48000+.0001);assert.ok(result.maxDelta<1e-6,'seeded exports may differ only by native float32 rounding');assert.equal(result.cancelled,true);assert.equal(result.stems,1);assert.ok(Math.abs(result.recordDuration-.1)<.0001);assert.equal(result.archiveInline,true);assert.ok(result.progress.includes('encode'));console.log('Native float32 repeatability maximum sample delta:',result.maxDelta);console.log('PASS pro export: 16/24/float WAV, ZIP, shared song plan, seeded repeatability, cancellation/progress, stems, binary recording/archive roundtrip');
}finally{await b.close();srv.close();}
