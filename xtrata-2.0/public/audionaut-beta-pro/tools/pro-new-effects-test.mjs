import assert from 'node:assert/strict';
import {serve,browser,page} from './serve.mjs';
const server=await serve(),b=await browser(),logs=[];
try{
  const p=await page(b,server.url,{logs});
  await p.route(`${server.url}/probe`,r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>New effect audio regression</title>'}));
  await p.goto(`${server.url}/probe`);
  const result=await p.evaluate(async()=>{
    const base='/audionaut-beta-pro/daw/js/',{PLUGIN_TYPES,pluginDefaults,pluginLatencySamples,pluginTailSeconds,cleanChain}=await import(base+'plugins.js'),{StereoMeter}=await import(base+'metering.js'),{nativeConvolutionReport,prepareConvolutionPlan,convolutionState,convolutionTransfers}=await import(base+'pro-convolution.js');
    const checks=[],failures=[],metrics={};const check=(name,ok,detail)=>{checks.push(name);if(!ok)failures.push({name,detail});};
    const stats=(a,start=0,end=a.duration)=>{let peak=0,energy=0,count=0,bad=0;for(let c=0;c<a.numberOfChannels;c++){const d=a.getChannelData(c);for(let i=Math.floor(start*a.sampleRate);i<Math.min(d.length,Math.floor(end*a.sampleRate));i++){peak=Math.max(peak,Math.abs(d[i]));energy+=d[i]*d[i];count++;if(!Number.isFinite(d[i]))bad++;}}return{peak,rms:Math.sqrt(energy/Math.max(1,count)),bad};};
    const diff=(a,b)=>{let peak=0;for(let c=0;c<a.numberOfChannels;c++)for(let i=0;i<a.length;i++)peak=Math.max(peak,Math.abs(a.getChannelData(c)[i]-b.getChannelData(c)[i]));return peak;};
    const render=async(id,P,sr,{length=1,signal=(i)=>.1*Math.sin(2*Math.PI*997*i/sr),stereo='same',sidechain=null,automate=null,ir=null,convolutionBackend}={})=>{
      const ctx=new OfflineAudioContext(2,Math.ceil(sr*length),sr),type=PLUGIN_TYPES[id],env={convolutionBackend,...(ir?{irSource:{sourceTrackId:'ir'},resolveImpulseResponse:()=>ir(ctx)}:{})},nodes=type.create(ctx,env);type.apply(ctx,nodes,{...pluginDefaults(id),...P});
      if(sidechain!==null)nodes.setSidechainExternal?.(true);
      await nodes.ready;check(`${id} worklet ready ${sr}`,!!nodes.wk&&!nodes.workletError,nodes.workletError);
      const buffer=ctx.createBuffer(2,ctx.length,sr);for(let i=0;i<buffer.length;i++){buffer.getChannelData(0)[i]=signal(i);buffer.getChannelData(1)[i]=stereo==='opposite'?-signal(i):stereo==='left'?0:signal(i);}
      const source=ctx.createBufferSource();source.buffer=buffer;source.connect(nodes.input);nodes.output.connect(ctx.destination);source.start();
      if(sidechain){const s=ctx.createBufferSource(),data=ctx.createBuffer(1,ctx.length,sr);for(let i=0;i<data.length;i++)data.getChannelData(0)[i]=sidechain(i);s.buffer=data;s.connect(nodes.sidechain);s.start();}
      if(automate)automate(type,ctx,nodes);
      const audio=await ctx.startRendering(),meter=type.meter?.(nodes),irDuration=nodes.irDuration;type.dispose(nodes);check(`${id} disposed ${sr}`,nodes.disposed&&nodes._disposed);
      return{audio,meter,irDuration,convolutionBackend:nodes.convolutionBackend};
    };
    metrics.rates=[];
    for(const sr of [44100,48000,96000]){
      metrics.convolution??=[];metrics.convolution.push(await nativeConvolutionReport(sr));
      for(const id of ['dynamicEq','hybridReverb','masteringLimiter']){
        const start=performance.now(),r=await render(id,{},sr),s=stats(r.audio);metrics.rates.push({id,sr,...s,milliseconds:performance.now()-start});check(`${id} default audible finite ${sr}`,s.bad===0&&s.peak>1e-4&&s.peak<2,s);
        for(const bound of ['min','max']){const P=Object.fromEntries(PLUGIN_TYPES[id].params.map(p=>[p.key,p[bound]])),r=await render(id,P,sr,{length:.4}),s=stats(r.audio);check(`${id} all-${bound} finite ${sr}`,s.bad===0&&s.peak<128,s);}
      }
      const flat={b1Range:0,b2Range:0,b3Range:0,b4Range:0};
      const impulse=await render('dynamicEq',flat,sr,{signal:i=>i===128?.25:0,length:.05});check(`dynamic EQ unity/zero latency ${sr}`,Math.abs(impulse.audio.getChannelData(0)[128]-.25)<1e-7&&stats(impulse.audio).peak===.25);
      const staticEQ=await render('dynamicEq',{...flat,b3Freq:1000,b3Q:4,b3Gain:6},sr,{signal:i=>.05*Math.sin(2*Math.PI*1000*i/sr)});const boost=stats(staticEQ.audio,.5,.9).rms/(.05/Math.SQRT2);check(`dynamic EQ calibrated bell ${sr}`,Math.abs(20*Math.log10(boost)-6)<.1,boost);
      const P={...flat,b3Freq:1000,b3Q:4,b3Threshold:-30,b3Range:-12,attack:.001,release:.05};
      const quiet=await render('dynamicEq',P,sr,{signal:i=>.001*Math.sin(2*Math.PI*1000*i/sr)}),loud=await render('dynamicEq',P,sr,{signal:i=>.5*Math.sin(2*Math.PI*1000*i/sr)});
      const quietGain=stats(quiet.audio,.5,.9).rms/(.001/Math.SQRT2),loudGain=stats(loud.audio,.5,.9).rms/(.5/Math.SQRT2);check(`dynamic EQ reacts above threshold ${sr}`,quietGain>.99&&loudGain<.3,{quietGain,loudGain});
      const far=await render('dynamicEq',P,sr,{signal:i=>.5*Math.sin(2*Math.PI*100*i/sr)});check(`dynamic EQ frequency selective ${sr}`,stats(far.audio,.5,.9).rms>.34,stats(far.audio,.5,.9));
      const anti=await render('dynamicEq',P,sr,{signal:i=>.5*Math.sin(2*Math.PI*1000*i/sr),stereo:'opposite'});check(`dynamic EQ antiphase detector ${sr}`,Math.abs(stats(anti.audio,.5,.9).rms-stats(loud.audio,.5,.9).rms)<1e-7);
      const ext=await render('dynamicEq',P,sr,{signal:i=>.001*Math.sin(2*Math.PI*1000*i/sr),sidechain:i=>.5*Math.sin(2*Math.PI*1000*i/sr)}),silent=await render('dynamicEq',P,sr,{signal:i=>.5*Math.sin(2*Math.PI*1000*i/sr),sidechain:false});
      check(`dynamic EQ external detector ${sr}`,stats(ext.audio,.5,.9).rms<stats(quiet.audio,.5,.9).rms*.3&&stats(silent.audio,.5,.9).rms>.34);
      const automated=await render('dynamicEq',flat,sr,{automate:(t,c,n)=>{t.automate(c,n,'output',-12,.5,'step');}});check(`dynamic EQ sample-timed automation ${sr}`,stats(automated.audio,.6,.9).rms<stats(automated.audio,.1,.4).rms*.26);
      const limImpulse=await render('masteringLimiter',{ceiling:0},sr,{signal:i=>i===128?.1:0,length:.05}),data=limImpulse.audio.getChannelData(0);let at=0;for(let i=1;i<data.length;i++)if(Math.abs(data[i])>Math.abs(data[at]))at=i;check(`limiter declared lookahead ${sr}`,at-128===pluginLatencySamples('masteringLimiter',{},sr),{at,latency:pluginLatencySamples('masteringLimiter',{},sr)});
      for(const [name,signal]of [['intersample',i=>Math.sin(Math.PI/2*i+Math.PI/4)],['impulse',i=>i===1000?4:0],['burst',i=>i>sr*.2&&i<sr*.7?2*Math.sin(2*Math.PI*997*i/sr):0],['multitone',i=>2*(Math.sin(2*Math.PI*.317*i)+.7*Math.sin(2*Math.PI*.113*i+.3))],['noise',i=>{let x=Math.imul(i^0x12345,1597334677);x^=x>>>15;return (x/2147483648)*3;}]]){
        const r=await render('masteringLimiter',{ceiling:-3},sr,{signal,stereo:'opposite'}),s=stats(r.audio),meter=new StereoMeter(sr);meter.process(r.audio.getChannelData(0),r.audio.getChannelData(1));const m=meter.read();metrics.limiter??=[];metrics.limiter.push({sr,name,samplePeak:s.peak,estimatedTruePeak:m.truePeak,ceiling:Math.pow(10,-3/20)});check(`limiter sample ceiling ${name} ${sr}`,s.bad===0&&s.peak<=Math.pow(10,-3/20)+1e-6,s);check(`limiter estimated intersample ceiling ${name} ${sr}`,m.truePeak<=Math.pow(10,-3/20)*1.005,{truePeak:m.truePeak,ceiling:Math.pow(10,-3/20)});check(`limiter stereo link ${name} ${sr}`,r.audio.getChannelData(0).every((x,i)=>Math.abs(x+r.audio.getChannelData(1)[i])<1e-7));
      }
      const reverb=await render('hybridReverb',{mix:1,balance:1,predelay:0,decay:1},sr,{length:3,signal:i=>i===0?1:0,stereo:'left'}),late=stats(reverb.audio,.1,.7),end=stats(reverb.audio,2.5,3);check(`reverb diffuse audible decay ${sr}`,late.rms>1e-5&&end.rms<late.rms*.01,{late,end});check(`reverb stereo diffusion ${sr}`,reverb.audio.getChannelData(0).some((x,i)=>Math.abs(x-reverb.audio.getChannelData(1)[i])>1e-5));
      const repeat=await render('hybridReverb',{mix:1,balance:.5,predelay:0},sr,{length:.4,signal:i=>i===0?1:0}),again=await render('hybridReverb',{mix:1,balance:.5,predelay:0},sr,{length:.4,signal:i=>i===0?1:0});check(`reverb deterministic reflection source ${sr}`,diff(repeat.audio,again.audio)<1e-7,diff(repeat.audio,again.audio));
      // Native partitioned convolution has float FFT residue (~2e-8 peak); test silence below -140 dBFS, plus correct audible peaks.
      const custom=await render('hybridReverb',{mix:1,balance:0,predelay:0,lowcut:20},sr,{length:.3,signal:i=>i===0?1:0,ir:ctx=>{const b=ctx.createBuffer(2,Math.ceil(sr*.2),sr);b.getChannelData(0)[Math.floor(sr*.08)]=1;b.getChannelData(1)[Math.floor(sr*.1)]=.5;return b;}});check(`custom IR audible at requested timing ${sr}`,stats(custom.audio,0,.07).peak<1e-7&&stats(custom.audio,0,.07).rms<1e-8&&stats(custom.audio,.079,.082).peak>.9&&stats(custom.audio,.099,.102).peak>.45,{stats:stats(custom.audio),before:stats(custom.audio,0,.07),left:stats(custom.audio,.079,.082),right:stats(custom.audio,.099,.102),duration:custom.irDuration});
      check(`convolver capability selects backend ${sr}`,custom.convolutionBackend===(metrics.convolution.at(-1).safe?'native':'partitioned'),{report:metrics.convolution.at(-1),backend:custom.convolutionBackend});
      // Force the portability path on every browser; CI must not leave it
      // untested merely because this machine has a correct native FFT backend.
      const fallback=await render('hybridReverb',{mix:1,balance:0,predelay:0,lowcut:20},sr,{convolutionBackend:'partitioned',length:.3,signal:i=>i===0?1:0,ir:ctx=>{const b=ctx.createBuffer(2,Math.ceil(sr*.2),sr);b.getChannelData(0)[Math.floor(sr*.08)]=1;b.getChannelData(1)[Math.floor(sr*.1)]=.5;return b;}});
      const firstPeaks=[0,1].map(ch=>{const data=fallback.audio.getChannelData(ch);let at=0;for(let i=1;i<data.length;i++)if(Math.abs(data[i])>Math.abs(data[at]))at=i;return at;});
      check(`fallback exact stereo IR timing ${sr}`,fallback.convolutionBackend==='partitioned'&&firstPeaks[0]===Math.floor(sr*.08)&&firstPeaks[1]===Math.floor(sr*.1)&&stats(fallback.audio,0,.07).peak<1e-7,{firstPeaks,before:stats(fallback.audio,0,.07)});
      for(const channels of [1,2]){
        const length=channels===1?257:18000,sourceLength=32,total=Math.ceil((length+sourceLength+512)/128)*128;
        let randomState=21;const random=()=>{randomState^=randomState<<13;randomState^=randomState>>>17;randomState^=randomState<<5;return (randomState>>>0)/4294967296*2-1;};
        const data=Array.from({length:channels},()=>Float32Array.from({length},()=>random()*.02)),input=Float32Array.from({length:sourceLength},()=>random()*.4);
        const actual=await render('hybridReverb',{mix:1,balance:0,predelay:0,lowcut:20},sr,{convolutionBackend:'partitioned',length:total/sr,signal:i=>input[i]||0,ir:ctx=>{const b=ctx.createBuffer(channels,length,sr);data.forEach((a,ch)=>b.copyToChannel(a,ch));return b;}});
        // Independent time-domain reference: render only the native input HP,
        // then sum shifted copies explicitly. No FFT/convolver is reused here.
        const referenceContext=new OfflineAudioContext(1,total,sr),source=referenceContext.createBufferSource(),inputBuffer=referenceContext.createBuffer(1,total,sr),hp=referenceContext.createBiquadFilter();inputBuffer.copyToChannel(input,0);source.buffer=inputBuffer;hp.type='highpass';hp.frequency.value=20;hp.Q.value=-3.0103;source.connect(hp).connect(referenceContext.destination);source.start();
        const filtered=(await referenceContext.startRendering()).getChannelData(0);let peakError=0,energyError=0;
        for(let ch=0;ch<2;ch++){const expected=new Float64Array(total),h=data[Math.min(ch,channels-1)];for(let i=0;i<filtered.length;i++){const sample=filtered[i];if(!sample)continue;for(let k=0;k<h.length&&i+k<total;k++)expected[i+k]+=sample*h[k];}const out=actual.audio.getChannelData(ch);for(let i=0;i<total;i++){const error=out[i]-expected[i];peakError=Math.max(peakError,Math.abs(error));energyError+=error*error;}}
        const error={sr,channels,length,peak:peakError,rms:Math.sqrt(energyError/(total*2))};metrics.convolutionReferences??=[];metrics.convolutionReferences.push(error);
        check(`partitioned convolution direct reference ${channels}ch ${sr}`,error.peak<1e-6&&error.rms<1e-7,error);
      }
    }
    {
      // Full supported offline length, independently summed sparse input events.
      // This reaches every partition tier and checks transfer initialization
      // before rendering, stereo separation, zero latency and the entire tail.
      const sr=96000,length=sr*10,events=[[[127,.3],[8192,-.2],[65537,.15]],[[128,-.4],[16384,.2],[65536,.1]]],frames=Math.ceil((length+65538)/128)*128;
      let seed=47;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296*2-1;};
      const ir=Array.from({length:2},()=>Float32Array.from({length},()=>random()*.002)),begin=performance.now(),plan=await prepareConvolutionPlan(ir),state=convolutionState(plan),transfers=convolutionTransfers(state),bytes=transfers.reduce((total,b)=>total+b.byteLength,0),prepareMs=performance.now()-begin;
      const ctx=new OfflineAudioContext(2,frames,sr);await ctx.audioWorklet.addModule(base+'pro-effects-worklet.js');const node=new AudioWorkletNode(ctx,'audionaut-pro-convolution-v1',{outputChannelCount:[2]});let processorError=null;node.onprocessorerror=()=>processorError='convolution failed';
      const init=new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Offline convolution initialization timed out')),5000);node.port.onmessage=e=>{clearTimeout(timeout);if(e.data.type==='ready')resolve();else reject(new Error(e.data.message));};});node.port.postMessage({type:'init',state},transfers);await init;
      check('offline convolution acknowledges before rendering with transferred state',ctx.currentTime===0&&transfers.every(b=>b.byteLength===0));
      const buffer=ctx.createBuffer(2,frames,sr),source=ctx.createBufferSource();for(let ch=0;ch<2;ch++)for(const [at,value]of events[ch])buffer.getChannelData(ch)[at]=value;source.buffer=buffer;source.connect(node).connect(ctx.destination);source.start();const actual=await ctx.startRendering();let peak=0,energy=0;
      for(let ch=0;ch<2;ch++){const expected=new Float64Array(frames);for(const [at]of events[ch]){const value=buffer.getChannelData(ch)[at];for(let k=0;k<length;k++)expected[at+k]+=value*ir[ch][k];}const out=actual.getChannelData(ch);for(let i=0;i<frames;i++){const e=out[i]-expected[i];peak=Math.max(peak,Math.abs(e));energy+=e*e;}}
      const detail={peak,rms:Math.sqrt(energy/(frames*2)),bytes,estimatedBytes:plan.workingBytes,prepareMs,processorError};metrics.longConvolution=detail;
      check('ten-second stereo portable offline convolution matches direct reference',!processorError&&peak<1e-6&&detail.rms<1e-7,detail);check('convolution working state remains bounded',bytes<=plan.workingBytes&&plan.workingBytes<128*1024*1024,detail);
      node.port.postMessage({type:'dispose'});node.port.close();source.disconnect();node.disconnect();
      let cancelled=false;try{await prepareConvolutionPlan([new Float32Array(4096).fill(.01)],{isCurrent:()=>false,yieldTask:async()=>{}});}catch(e){cancelled=/superseded/.test(e.message);}check('obsolete convolution preparation stops cooperatively',cancelled);
    }
    const malformed=cleanChain([{id:'ir-test',type:'hybridReverb',params:{},irSource:{sourceTrackId:'sample-track'}}]);check('IR asset reference persists',malformed[0]?.irSource?.sourceTrackId==='sample-track');check('old limiter retained',PLUGIN_TYPES.limiter.name==='Stoploss'&&PLUGIN_TYPES.reverbSend.name==='Liquidity');check('custom IR export tail',pluginTailSeconds('hybridReverb',{decay:1,predelay:25},{irSource:{sourceTrackId:'sample-track'},irDuration:8})>=8.025);
    for(const [label,resolve]of [['missing',()=>null],['too long',ctx=>ctx.createBuffer(1,ctx.sampleRate*11,ctx.sampleRate)],['invalid',ctx=>{const b=ctx.createBuffer(1,100,ctx.sampleRate);b.getChannelData(0)[0]=NaN;return b;}]]){const ctx=new OfflineAudioContext(2,4800,48000),n=PLUGIN_TYPES.hybridReverb.create(ctx,{irSource:{sourceTrackId:'bad'},resolveImpulseResponse:()=>resolve(ctx)});let error;try{await n.ready;}catch(e){error=e.message;}check(`custom IR ${label} rejected`,!!error,error);PLUGIN_TYPES.hybridReverb.dispose(n);}
    const resampled=await render('hybridReverb',{mix:1,balance:0,predelay:0},96000,{length:.2,signal:i=>i===0?1:0,ir:()=>{const c=new OfflineAudioContext(1,4800,48000),b=c.createBuffer(1,4800,48000);b.getChannelData(0)[2400]=1;return b;}});check('custom IR resamples across export rates',stats(resampled.audio,.049,.052).peak>.1,stats(resampled.audio,.049,.052));
    {
      const ctx=new OfflineAudioContext(2,4800,48000),type=PLUGIN_TYPES.hybridReverb,n=type.create(ctx,{convolutionBackend:'partitioned'});await n.ready;
      const original=n.convolver.buffer,tail=n.wk;let missing=false;try{await n.updateImpulseResponse({sourceTrackId:'missing'},()=>null);}catch{missing=true;}
      check('failed IR update retains sound and reports error',missing&&n.convolver.buffer===original&&n.wk===tail&&!!n.workletError);
      let resolveSlow;const pending=new Promise(r=>resolveSlow=r),slow=n.updateImpulseResponse({sourceTrackId:'slow'},()=>pending),latest=ctx.createBuffer(1,960,48000);latest.getChannelData(0)[0]=1;
      await n.updateImpulseResponse({sourceTrackId:'latest'},()=>latest);resolveSlow(original);const obsolete=await slow;
      check('superseded IR update cannot overwrite current sound',obsolete===false&&n.irSource.sourceTrackId==='latest'&&n.convolver.buffer===latest&&!n.workletError);
      await n.updateImpulseResponse(null);check('cleared IR restores generated reflections',n.irSource===null&&Math.abs(n.irDuration-.16)<1/48000&&n.wk===tail&&n.irBranches.length===1);type.dispose(n);
      let resolveDisposed;const wait=new Promise(r=>resolveDisposed=r),disposed=type.create(ctx,{irSource:{sourceTrackId:'pending'},resolveImpulseResponse:()=>wait});type.dispose(disposed);resolveDisposed(latest);
      check('disposed IR preparation cannot resurrect nodes',await disposed.ready===false&&!disposed.wk&&disposed.irBranches.length===0);
      const recovered=type.create(ctx,{irSource:{sourceTrackId:'late'},resolveImpulseResponse:()=>null});try{await recovered.ready;}catch{}
      await recovered.updateImpulseResponse({sourceTrackId:'late'},()=>latest);check('initial missing IR recovers when asset loads',!!recovered.wk&&recovered.convolver.buffer===latest&&!recovered.workletError);type.dispose(recovered);
    }
    const original=globalThis.AudioWorkletNode;globalThis.AudioWorkletNode=function(){throw new Error('Synthetic processor failure');};const ctx=new OfflineAudioContext(2,4800,48000),n=PLUGIN_TYPES.masteringLimiter.create(ctx);let rejected=false;try{await n.ready;}catch{rejected=true;}globalThis.AudioWorkletNode=original;check('processor failure is explicit',rejected&&n.workletError?.includes('Synthetic'),n.workletError);PLUGIN_TYPES.masteringLimiter.dispose(n);
    return{checks:checks.length,failures,metrics};
  });
  // Start the real-time context from an actual user gesture (Safari/WebKit).
  await p.evaluate(()=>{
    document.body.innerHTML='<button id="live-effect-probe">Start live audio check</button>';
    window.liveEffectProbe=new Promise(resolve=>document.getElementById('live-effect-probe').addEventListener('click',async()=>{
      const ctx=new AudioContext(),resume=ctx.resume(),instances=[],peaks=[];let outcome;
      try{
        await resume;
        const {PLUGIN_TYPES,pluginDefaults}=await import('/audionaut-beta-pro/daw/js/plugins.js');
        await ctx.suspend();const suspended=PLUGIN_TYPES.hybridReverb.create(ctx,{convolutionBackend:'partitioned'});await suspended.ready;const initializedSuspended=ctx.state==='suspended'&&suspended.convolutionBackend==='partitioned';PLUGIN_TYPES.hybridReverb.dispose(suspended);await ctx.resume();
        const silent=ctx.createGain();silent.gain.value=0;silent.connect(ctx.destination);
        for(const id of ['dynamicEq','hybridReverb','masteringLimiter']){
          const type=PLUGIN_TYPES[id],n=type.create(ctx,{convolutionBackend:'partitioned'}),source=ctx.createOscillator(),level=ctx.createGain(),analyser=ctx.createAnalyser();analyser.fftSize=256;
          instances.push({type,n,source,level,analyser});type.apply(ctx,n,pluginDefaults(id));await n.ready;
          if(id==='hybridReverb'){const impulse=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.05),ctx.sampleRate);impulse.getChannelData(0)[0]=1;await n.setImpulseResponse(impulse);type.apply(ctx,n,{...pluginDefaults(id),mix:1,balance:0,predelay:0,lowcut:20});}
          source.frequency.value=997;level.gain.value=.05;source.connect(level).connect(n.input);n.output.connect(analyser).connect(silent);source.start();
        }
        await new Promise(r=>setTimeout(r,250));
        for(const [i,id]of ['dynamicEq','hybridReverb','masteringLimiter'].entries()){const data=new Float32Array(256);instances[i].analyser.getFloatTimeDomainData(data);peaks.push({id,peak:Math.max(...data.map(Math.abs))});}
        const reverb=instances[1],tail=reverb.n.wk,replacement=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.05),ctx.sampleRate);replacement.getChannelData(0)[0]=.5;
        await reverb.n.updateImpulseResponse({sourceTrackId:'replacement'},()=>replacement);
        let minimumPeak=Infinity;for(let j=0;j<12;j++){await new Promise(r=>setTimeout(r,5));const data=new Float32Array(256);reverb.analyser.getFloatTimeDomainData(data);minimumPeak=Math.min(minimumPeak,Math.max(...data.map(Math.abs)));}
        const before=reverb.n.convolver,oversize=ctx.createBuffer(2,Math.ceil(ctx.sampleRate*2.01),ctx.sampleRate);let limitError;try{await reverb.n.setImpulseResponse(oversize);}catch(error){limitError=error.message;}
        const limitRetained=before===reverb.n.convolver&&!reverb.n.processorError;
        await reverb.n.setImpulseResponse(replacement);
        await new Promise(resolve=>setTimeout(resolve,70));
        outcome={initializedSuspended,limitError,limitRetained,peaks,time:ctx.currentTime,irFade:{minimumPeak,branches:reverb.n.irBranches.length,retainedTail:tail===reverb.n.wk}};
      }catch(error){outcome={error:error.message};}
      finally{for(const {type,n,source,level,analyser}of instances){try{source.stop();}catch{}source.disconnect();level.disconnect();analyser.disconnect();type.dispose(n);}await ctx.close();}
      resolve({...outcome,closed:ctx.state==='closed',disposed:instances.every(({n})=>n.disposed&&n._disposed)});
    },{once:true}));
  });
  await p.click('#live-effect-probe');
  const live=await p.evaluate(()=>Promise.race([window.liveEffectProbe,new Promise(resolve=>setTimeout(()=>resolve({error:'Live audio check timed out'}),5000))]));
  result.metrics.live=live;result.checks++;
  if(live.error||!live.closed||!live.disposed||!live.time||live.peaks?.length!==3||live.peaks.some(p=>!Number.isFinite(p.peak)||p.peak<1e-4))result.failures.push({name:'real-time effect audio',detail:live});
  result.checks++;if(!live.irFade?.retainedTail||live.irFade.branches!==1||live.irFade.minimumPeak<.02)result.failures.push({name:'live IR crossfade preserves audio and retires graphs',detail:live.irFade});
  result.checks++;if(!live.initializedSuspended)result.failures.push({name:'portable convolution initializes while live context is suspended',detail:live});
  result.checks++;if(!live.limitRetained||!live.limitError?.includes('2 seconds'))result.failures.push({name:'portable live impulse limit retains current audio and reports error',detail:live});
  console.log(JSON.stringify(result,null,2));assert.deepEqual(result.failures,[]);assert.deepEqual(logs,[]);
}finally{await b.close();await new Promise(r=>server.srv.close(r));}
