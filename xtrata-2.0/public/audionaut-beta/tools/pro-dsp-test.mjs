import assert from "node:assert/strict";
import { serve, browser, page } from "./serve.mjs";
const server = await serve(), b = await browser(), logs = [];
let watchdog;
try {
  const p = await page(b, server.url, {logs});
  let lastStage='opening DSP page',lastProgress=Date.now();
  await p.exposeFunction('__dspProgress',stage=>{lastStage=stage;lastProgress=Date.now();if(process.env.AUDIONAUT_DSP_PROGRESS==='1'||stage.startsWith('phase:'))console.log('DSP '+stage);});
  await p.route(`${server.url}/probe`, r=>r.fulfill({contentType:"text/html",body:"<!doctype html><title>DSP regression</title>"}));
  await p.goto(`${server.url}/probe`);
  const stalled=new Promise((_,reject)=>{watchdog=setInterval(()=>{if(Date.now()-lastProgress>60000)reject(new Error(`DSP stage exceeded 60 seconds: ${lastStage}`));},1000);});
  const result = await Promise.race([p.evaluate(async () => {
    let phase='module imports';
    const mark=label=>{phase=label;globalThis.__dspProgress(label);};
    const bounded=async(promise,label=phase)=>{let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`DSP operation exceeded 20 seconds: ${label}`)),20000);})]);}finally{clearTimeout(timer);}};
    const originalRendering=OfflineAudioContext.prototype.startRendering;
    OfflineAudioContext.prototype.startRendering=function(...args){return bounded(originalRendering.apply(this,args),`${phase}: startRendering ${this.sampleRate} Hz / ${this.length} frames`);};
    mark('phase: module imports');
    const base="/audionaut-beta/daw/js/";
    const [{SYNTH_BANK,synthDefaults},{createVoice},{prepareSynthVoice:prepareVoice,clearSynthRenderCache,synthRenderStats}, {PLUGIN_TYPES,pluginDefaults,calibratePluginLatency,pluginLatencySamples}, {StereoMeter}, bank] = await bounded(Promise.all([import(base+"synths.js"),import(base+"synths/voice-lifecycle.js"),import(base+"synths/render-pool.js"),import(base+"plugins.js"),import(base+"metering.js"),import(base+"preset-bank.js")]));
    const prepareSynthVoice=(...args)=>bounded(prepareVoice(...args),`${phase}: prepare ${args[0]}`);
    const failures=[], checks=[], metrics={};
    const check=(label,ok,details)=>{checks.push(label);if(!ok) failures.push({label,details});};
    const stats=(buffer,start=0,end=buffer.duration)=>{let peak=0,energy=0,n=0,bad=0;for(let ch=0;ch<buffer.numberOfChannels;ch++){const a=buffer.getChannelData(ch);for(let i=Math.floor(start*buffer.sampleRate);i<Math.min(a.length,Math.floor(end*buffer.sampleRate));i++){if(!Number.isFinite(a[i]))bad++;peak=Math.max(peak,Math.abs(a[i]));energy+=a[i]*a[i];n++;}}return{peak,rms:Math.sqrt(energy/Math.max(1,n)),bad};};
    const render=async(id,P,sr,{duration=.2,length=2,held=false,release=null,seed=42,prepare=false,change=null,captureNoise=false,invertNoise=false,start=0}={})=>{
      mark(`synth ${id} ${sr} Hz duration=${duration} length=${length} held=${held}`);
      const ctx=new OfflineAudioContext(2,Math.ceil(sr*length),sr),note={pitch:id==='drumrack'?36:60,vel:.8,time:start,dur:duration,held};
      if(prepare)await prepareSynthVoice(id,note,P,sr,{seed});
      let ends=0;const voice=createVoice(ctx,ctx.destination,SYNTH_BANK[id],id,note,P,()=>ends++,{seed});
      if(change)await bounded(voice.setParameters(change.params,change.time),`${phase}: parameter change`);
      if(release!=null)voice.release(release,.1);
      const bufferDurations=voice.sources.map(s=>s.node.buffer?.duration);
      // Capture the source before rendering, because completed voices release it.
      const sourceNoise=(captureNoise||invertNoise)?voice.sources.find(s=>s.node.buffer&&s.node.loop)?.node.buffer.getChannelData(0):null;
      const noise=sourceNoise?.slice();
      if(invertNoise&&sourceNoise)for(let i=0;i<sourceNoise.length;i++)sourceNoise[i]=-sourceNoise[i];
      const audio=await ctx.startRendering();await new Promise(r=>setTimeout(r,0));
      return{audio,voice,ends,bufferDurations,noise};
    };
    metrics.synths=[];
    for(const sr of [44100,48000,96000]){
      mark(`phase: ${sr} Hz calibration and synths`);
      metrics.latency??={};metrics.latency[sr]=await bounded(calibratePluginLatency(sr),`latency calibration ${sr} Hz`);
      for(const [id,synth]of Object.entries(SYNTH_BANK)){
        const P=synthDefaults(id),started=performance.now();
        const r=await render(id,P,sr), s=stats(r.audio);metrics.synths.push({id,sr,...s,ms:performance.now()-started});
        check(`${id} default ${sr}`,s.bad===0&&s.peak>1e-7&&s.peak<8,s);
        for(const bound of ["min","max"]){const edge={...P};for(const param of synth.params)if(!param.options&&Number.isFinite(param[bound]))edge[param.key]=param[bound];const rr=await render(id,edge,sr,{duration:.05,length:.4}),ss=stats(rr.audio);check(`${id} ${bound} finite ${sr}`,ss.bad===0&&ss.peak<32,ss);}
      }
      const short=await render("jims10",{...synthDefaults("jims10"),attack:1,decay:1,sustain:1,release:.1},sr,{duration:.05,length:.6});check(`ADSR early note-off ${sr}`,stats(short.audio,.3,.6).peak<1e-7,stats(short.audio,.3,.6));
      const voxShort=await render("vox",{...synthDefaults("vox"),attack:1,release:.1},sr,{duration:.05,length:.6});check(`Vox early release ${sr}`,stats(voxShort.audio,.3,.6).peak<1e-7,stats(voxShort.audio,.3,.6));
      for(const id of ["fm4","kiln","anneal","palinode","lantern"]){const P={...synthDefaults(id)};if("sustain" in P)P.sustain=1;if("hold" in P)P.hold=1;const r=await render(id,P,sr,{duration:12,length:13,prepare:true});check(`${id} 12-second prepared buffer ${sr}`,r.bufferDurations.some(d=>d>10),r.bufferDurations);check(`${id} long finite ${sr}`,stats(r.audio).bad===0);}
      for(const [id,type]of Object.entries(PLUGIN_TYPES)){
        if(type.shared)continue;
        mark(`effect ${id} ${sr} Hz default`);
        const ctx=new OfflineAudioContext(2,sr,sr),nodes=type.create(ctx,{}),P=pluginDefaults(id);type.apply(ctx,nodes,P);await bounded(nodes.ready,`${phase}: ready`);const src=ctx.createBufferSource(),buf=ctx.createBuffer(2,sr,sr);for(let i=0;i<sr;i++){const x=.1*Math.sin(2*Math.PI*997*i/sr);buf.getChannelData(0)[i]=x;buf.getChannelData(1)[i]=-x;}src.buffer=buf;src.connect(nodes.input);nodes.output.connect(ctx.destination);src.start();const audio=await ctx.startRendering(),s=stats(audio);check(`${id} stereo effect finite ${sr}`,s.bad===0&&s.peak<8,s);type.dispose?.(nodes);
        for(const bound of ["min","max"]){mark(`effect ${id} ${sr} Hz ${bound}`);const P=pluginDefaults(id);for(const param of type.params){if(param.options)P[param.key]=param.options[bound==="min"?0:param.options.length-1][0];else P[param.key]=param[bound];}const ctx=new OfflineAudioContext(2,Math.ceil(sr*.2),sr),n=type.create(ctx,{});type.apply(ctx,n,P);await bounded(n.ready,`${phase}: ready`);const s=ctx.createOscillator();s.frequency.value=997;s.connect(n.input);n.output.connect(ctx.destination);s.start();s.stop(.2);const audio=await ctx.startRendering(),ss=stats(audio);check(`${id} ${bound} effect ${sr}`,ss.bad===0&&ss.peak<100,ss);type.dispose?.(n);}
      }
      const meter=new StereoMeter(sr),a=Float32Array.from({length:sr*4},(_,i)=>.1*Math.sin(2*Math.PI*1000*i/sr)),neg=Float32Array.from(a,x=>-x);meter.process(a,neg);const m=meter.read();metrics[`meter${sr}`]=m;check(`loudness reference ${sr}`,Math.abs(m.integratedLufs+20)<.15,m.integratedLufs);check(`stereo antiphase ${sr}`,m.correlation<-.999&&m.channels.every(c=>Math.abs(c.rms-Math.SQRT1_2*.1)<.001),m);meter.reset();check(`meter reset ${sr}`,meter.read().samplePeak===0);
    }
    mark("phase: held-note lifecycle");
    for(const id of Object.keys(SYNTH_BANK)){
      const P=synthDefaults(id);if("sustain" in P)P.sustain=1;if("hold" in P)P.hold=1;const r=await render(id,P,48000,{duration:.2,length:10,held:true,release:9});if(!SYNTH_BANK[id].live?.oneShot&&!SYNTH_BANK[id].live?.naturalDecay)check(`${id} open gate after8seconds`,stats(r.audio,8,8.5).rms>1e-7,stats(r.audio,8,8.5));check(`${id} held lifecycle`,r.ends===1&&r.voice.ended&&stats(r.audio,9.3,10).peak<1e-6,{ends:r.ends,ended:r.voice.ended,tail:stats(r.audio,9.3,10)});
    }
    mark("phase: chased notes");
    for(const id of Object.keys(SYNTH_BANK)){
      mark(`chased note ${id}`);
      const ctx=new OfflineAudioContext(2,48000,48000),P=synthDefaults(id);let voice;try{voice=createVoice(ctx,ctx.destination,SYNTH_BANK[id],id,{pitch:60,vel:.8,time:.01,dur:.3,offset:.5,held:false},P,null,{seed:42});const audio=await ctx.startRendering();check(`${id} chased negative onset`,stats(audio).bad===0);}catch(error){check(`${id} chased negative onset`,false,error.message);}
    }
    {
      const P=synthDefaults("fm4"),sr=48000,full=(await render("fm4",P,sr,{duration:.8,length:1.5})).audio;
      const ctx=new OfflineAudioContext(2,sr,sr);createVoice(ctx,ctx.destination,SYNTH_BANK.fm4,"fm4",{pitch:60,vel:.8,time:0,dur:.3,offset:.5,held:false},P,null,{seed:42});const chased=await ctx.startRendering();let delta=0;for(let i=1000;i<sr*.25;i++)delta=Math.max(delta,Math.abs(chased.getChannelData(0)[i]-full.getChannelData(0)[i+sr*.5]));check("buffer chase preserves source age",delta<1e-6,delta);
    }
    {
      const ctx=new OfflineAudioContext(1,48000,48000),testSynth={voice(c,d,n,p){const s=c.createConstantSource(),g=c.createGain();s.offset.value=1;g.gain.value=p.level;c.bindParam("level",g.gain);s.connect(g).connect(d);s.start(0);s.stop(1);}};
      const v=createVoice(ctx,ctx.destination,testSynth,"test",{time:0,dur:1,pitch:60,vel:1},{level:0});await v.setParameters({level:1},.8,{curve:"linear",startTime:.2,fromValues:{level:0}});const a=(await ctx.startRendering()).getChannelData(0);check("bound voice linear automation",Math.abs(a[24000]-.5)<1e-5&&Math.abs(a[4800])<1e-7,{mid:a[24000],before:a[4800]});
    }
    const tone=new StereoMeter(44100),intersample=Float32Array.from({length:44100},(_,i)=>Math.sin(Math.PI/2*i+Math.PI/4));tone.process(intersample);check("intersample true peak",tone.read().samplePeak<.71&&tone.read().truePeak>.98,tone.read());
    mark("phase: opto and automation");
    const opto=async(sign,external=false)=>{const sr=48000,ctx=new OfflineAudioContext(2,sr*2,sr),type=PLUGIN_TYPES.opto,n=type.create(ctx,{});type.apply(ctx,n,{...pluginDefaults("opto"),peakRed:70});const b=ctx.createBuffer(2,sr*2,sr);for(let i=0;i<b.length;i++){b.getChannelData(0)[i]=.7*Math.sin(2*Math.PI*1000*i/sr);b.getChannelData(1)[i]=sign*b.getChannelData(0)[i];}const s=ctx.createBufferSource();s.buffer=b;s.connect(n.input);n.output.connect(ctx.destination);if(external)n.setSidechainExternal(true);s.start();return stats(await ctx.startRendering(),1,2).rms;};
    const same=await opto(1),opposite=await opto(-1),external=await opto(1,true);metrics.opto={same,opposite,external};check("Opto stereo phase invariance",Math.abs(20*Math.log10(same/opposite))<.05,metrics.opto);check("Opto external detector routing",external>same*1.2,metrics.opto);
    const held=await render("jims10",{...synthDefaults("jims10"),cutoff:100,reso:0,attack:.002,decay:.002,sustain:1},48000,{held:true,length:1,release:.9,change:{time:.5,params:{cutoff:10000}}});check("held cutoff updates current voice",stats(held.audio,.6,.8).rms>stats(held.audio,.2,.4).rms*2,{before:stats(held.audio,.2,.4),after:stats(held.audio,.6,.8)});
    const cachedCtx=new OfflineAudioContext(2,48000,48000);let buffers=0;const original=cachedCtx.createBuffer.bind(cachedCtx);cachedCtx.createBuffer=(...args)=>{buffers++;return original(...args);};for(let i=0;i<3;i++)createVoice(cachedCtx,cachedCtx.destination,SYNTH_BANK.ensemble,"ensemble",{pitch:60,vel:.8,time:0,dur:.1,held:false},synthDefaults("ensemble"),null,{seed:42});check("canonical context shared noise buffer",buffers===1,buffers);
    for(const id of Object.keys(SYNTH_BANK))for(const preset of bank.factoryPresets(id))check(`${id} preset ${preset.id}`,preset.version===2&&Object.values(preset.params).every(v=>typeof v!=="number"||Number.isFinite(v)));
    const f=bank.factoryPresets("jims10");check("factory stable IDs",f.length===SYNTH_BANK.jims10.presets.length&&new Set(f.map(p=>p.id)).size===f.length,f.length);const saved=bank.saveUserPreset("jims10",{name:"Regression",params:{cutoff:999999}});check("preset migration clamps",saved.version===2&&saved.params.cutoff===SYNTH_BANK.jims10.params.find(p=>p.key==="cutoff").max,saved);const exported=bank.exportPresetBank();bank.deleteUserPreset(saved.id);bank.importPresetBank(exported);check("preset portable round trip",bank.listUserPresets("jims10").some(p=>p.id===saved.id));const before=bank.exportPresetBank();try{bank.importPresetBank(JSON.stringify({format:"audionaut-preset-bank",version:999,presets:[]}));}catch{}check("future preset import atomic",before===bank.exportPresetBank());
    mark("phase: factory compatibility");
    for(const id of ["fm4","kiln","anneal","palinode","lantern"]){
      mark(`factory compatibility ${id}`);
      const P=synthDefaults(id),sr=48000,ctx=new OfflineAudioContext(2,sr*3,sr),note={pitch:60,vel:.8,time:0,dur:.4,held:false};ctx.seed=42;SYNTH_BANK[id].voice(ctx,ctx.destination,note,P);const legacy=await ctx.startRendering(),modern=(await render(id,P,sr,{duration:.4,length:3,seed:42,prepare:true})).audio;let diff=0;for(let c=0;c<2;c++){const a=legacy.getChannelData(c),z=modern.getChannelData(c);for(let i=0;i<a.length;i++)diff=Math.max(diff,Math.abs(a[i]-z[i]));}check(`${id} factory compatibility`,diff<1e-6,diff);
    }
    {
      const compare=(a,b)=>{
        let peak=0,errorEnergy=0,signalEnergy=0,count=0;
        for(let c=0;c<a.numberOfChannels;c++){
          const x=a.getChannelData(c),y=b.getChannelData(c);
          for(let i=0;i<x.length;i++){const d=x[i]-y[i];peak=Math.max(peak,Math.abs(d));errorEnergy+=d*d;signalEnergy+=x[i]*x[i];count++;}
        }
        return{peak,rms:Math.sqrt(errorEnergy/count),relativeRms:Math.sqrt(errorEnergy/Math.max(signalEnergy,1e-30))};
      };
      // Retain the original peak limit; also detect persistent low-level errors.
      // Native Web Audio output may round differently across browser builds, but
      // the seeded source data itself must be exact, before filters or summing.
      const equivalent=d=>d.peak<1e-6&&d.rms<1e-8&&d.relativeRms<1e-6;
      const hashNoise=data=>{let hash=2166136261;for(const x of new Uint32Array(data.buffer,data.byteOffset,data.length))hash=Math.imul(hash^x,16777619);return hash>>>0;};
      const sourceFixtures={44100:3405097892,48000:2814611308,96000:1256349057};
      mark("phase: seeded repeatability");
      metrics.repeatability=[];
      for(const sr of [44100,48000,96000])for(const breath of [0,.12,.8]){
        const P={...synthDefaults("vox"),breath},reference=await render("vox",P,sr,{captureNoise:true});
        if(breath===.12)check(`Vox canonical noise fixture ${sr}`,reference.noise&&hashNoise(reference.noise)===sourceFixtures[sr],reference.noise&&hashNoise(reference.noise));
        // Breath=0 distinguishes graph accumulation from source randomness.
        for(let repeat=1;repeat<=3;repeat++){
          const next=await render("vox",P,sr,{captureNoise:true}),error=compare(reference.audio,next.audio);
          metrics.repeatability.push({sr,breath,repeat,...error});
          check(`Vox audio repeatability ${sr} breath=${breath} run=${repeat}`,equivalent(error),error);
          if(breath>0)check(`Vox source noise exact ${sr} breath=${breath} run=${repeat}`,reference.noise?.length===next.noise?.length&&reference.noise?.every((x,i)=>Object.is(x,next.noise[i])));
        }
      }
      // Prove the comparison rejects meaningful random-stream and timing errors.
      const sr=48000,P={...synthDefaults("vox"),breath:.8},reference=await render("vox",P,sr);
      const wrongNoise=compare(reference.audio,(await render("vox",P,sr,{invertNoise:true})).audio);
      const shifted=compare(reference.audio,(await render("vox",P,sr,{start:1/sr})).audio);
      metrics.repeatabilityControls={wrongNoise,shifted};
      check("repeatability detects changed noise",!equivalent(wrongNoise),wrongNoise);
      check("repeatability detects one-sample timing change",!equivalent(shifted),shifted);
    }
    {
      const sr=48000,ctx=new OfflineAudioContext(2,sr,sr),n=PLUGIN_TYPES.filter.create(ctx,{});PLUGIN_TYPES.filter.apply(ctx,n,{...pluginDefaults("filter"),cutoff:100,q:.1});const s=ctx.createOscillator();s.frequency.value=3000;s.connect(n.input);n.output.connect(ctx.destination);s.start();s.stop(1);PLUGIN_TYPES.filter.automate(ctx,n,"cutoff",10000,.5,"step");PLUGIN_TYPES.filter.automate(ctx,n,"mode","hp",.8);const a=await ctx.startRendering();check("mapped filter automation timestamp",stats(a,.55,.7).rms>stats(a,.2,.4).rms*20,{before:stats(a,.2,.4),after:stats(a,.55,.7)});check("compound automation boundary",n.P.mode==="hp"&&!n.automationError,n.automationError);
    }
    {
      const sr=48000,ctx=new OfflineAudioContext(2,sr,sr),type=PLUGIN_TYPES.limiter,n=type.create(ctx,{}),P={...pluginDefaults("limiter"),ceiling:-12,input:24};type.apply(ctx,n,P);const s=ctx.createOscillator();s.connect(n.input);n.output.connect(ctx.destination);s.start();s.stop(1);const a=await ctx.startRendering();check("limiter default safety ceiling",stats(a).peak<=Math.pow(10,-12/20)+.0001,stats(a));
    }
    {
      mark("phase: worklet fallback");
      const original=globalThis.AudioWorkletNode;globalThis.AudioWorkletNode=function(){throw new Error("Synthetic unavailable processor");};const ctx=new OfflineAudioContext(2,4800,48000),n=PLUGIN_TYPES.gate.create(ctx,{});PLUGIN_TYPES.gate.apply(ctx,n,pluginDefaults("gate"));const ready=await bounded(n.ready,`${phase}: ready`);globalThis.AudioWorkletNode=original;check("worklet failure surfaced with fallback",ready===false&&n.workletError?.includes("Synthetic"),n.workletError);PLUGIN_TYPES.gate.dispose(n);
    }
    {
      mark("phase: worker preparation and render budgets");
      clearSynthRenderCache();let ticks=0;const timer=setInterval(()=>ticks++,1);await prepareSynthVoice("anneal",{pitch:62,vel:.8,time:0,dur:12},synthDefaults("anneal"),96000,{seed:99});clearInterval(timer);check("worker preparation yields main thread",ticks>0,ticks);let rejected=false;try{await prepareSynthVoice("fm4",{pitch:60,vel:.8,dur:10000},synthDefaults("fm4"),96000);}catch(error){rejected=/budget/.test(error.message);}check("oversize render budget explicit",rejected);
    }
    metrics.resources=synthRenderStats();check("render cache bounded",metrics.resources.bytes<=48*1024*1024,metrics.resources);
    return {checks:checks.length,failures,metrics};
  }),stalled]);
  clearInterval(watchdog);
  console.log(JSON.stringify(result,null,2));
  assert.deepEqual(result.failures,[]); assert.deepEqual(logs,[]);
}finally{clearInterval(watchdog);await b.close();await new Promise(r=>server.srv.close(r));}
