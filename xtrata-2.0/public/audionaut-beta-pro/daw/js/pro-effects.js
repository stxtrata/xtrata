// Additional beta-pro effects. Old effect IDs and patches are untouched.
import {DYNAMIC_EQ_PARAMS,HYBRID_REVERB_PARAMS,MASTERING_LIMITER_PARAMS,PRO_WORKLET_PARAMS} from './pro-effects-schema.js';
import {masteringLatencySamples} from './pro-effects-dsp.js';
import {scheduleDspBoundary} from './plugin-automation.js';
import {seededRandom} from './synths/resources.js';
import {prepareConvolution} from './pro-convolution.js';
const lin=x=>Math.pow(10,x/20);
const contexts=new WeakMap(),earlyBuffers=new WeakMap();
const defaults=schema=>Object.fromEntries(schema.map(p=>[p.key,p.def]));
function ensure(ctx){
  if(!contexts.has(ctx))contexts.set(ctx,(async()=>{if(!ctx.audioWorklet)throw new Error('These effects require AudioWorklet support.');await ctx.audioWorklet.addModule(new URL('./pro-effects-worklet.js',import.meta.url));})());
  return contexts.get(ctx);
}
function set(param,value,time){param.setValueAtTime(value,time);}
function processorFailure(ctx,n,message){
  if(n.disposed)return;
  n.processorError=message;n.workletError=message;
  if(typeof ctx.startRendering!=='function'&&globalThis.document)document.dispatchEvent(new CustomEvent('audio-error',{detail:{message}}));
}
function dispose(n){
  if(n._disposed)return;n._disposed=true;n.disposed=true;
  for(const cancel of n.pendingConvolutions||[])cancel();
  n.wk?.port.postMessage({type:'dispose'});n.wk?.port.close();
  for(const node of n.owned||[])try{node.disconnect();}catch{}
  for(const branch of n.irBranches||[]){branch.convolver.port?.postMessage({type:'dispose'});branch.convolver.port?.close();branch.convolver.buffer=null;}
  n.irBranches=[];
  for(const timer of n.automationTimers||[])clearTimeout(timer);
  n.automationTimers?.clear();
}
function base(ctx,id,schema){
  const input=ctx.createGain(),output=ctx.createGain();input.channelCount=2;input.channelCountMode='explicit';
  const n={input,output,owned:[input,output],P:defaults(schema),pending:[],meter:{},parameterTargets:{},disposed:false};
  n.attach=async()=>{
    await ensure(ctx);if(n.disposed)return false;
    n.wk=new AudioWorkletNode(ctx,`audionaut-pro-${id}-v1`,{numberOfInputs:id==='dynamicEq'?2:1,numberOfOutputs:1,outputChannelCount:[2],channelCount:2,channelCountMode:'explicit',parameterData:Object.fromEntries(PRO_WORKLET_PARAMS[id].map(p=>[p.key,n.P[p.key]??p.def]))});
    n.owned.push(n.wk);n.wk.port.onmessage=event=>{if(event.data?.type==='meter')n.meter=event.data;};
    n.wk.onprocessorerror=()=>processorFailure(ctx,n,`${id} audio processor failed.`);
    for(const p of PRO_WORKLET_PARAMS[id])n.parameterTargets[p.key]=[[n.wk.parameters.get(p.key),x=>x]];
    return true;
  };
  return n;
}
function apply(ctx,n,P){
  n.P={...n.P,...P};
  for(const [key,targets] of Object.entries(n.parameterTargets))if(Number.isFinite(n.P[key]))for(const [param,map] of targets)set(param,map(n.P[key]),ctx.currentTime);
}
function automate(schema){return(ctx,n,key,v,time=ctx.currentTime,curve='step')=>{
  const p=schema.find(p=>p.key===key);if(!p||!Number.isFinite(v))return false;v=Math.max(p.min,Math.min(p.max,v));
  const run=()=>{
    for(const [param,map]of n.parameterTargets[key]||[]){if(curve==='linear')param.linearRampToValueAtTime(map(v),time);else param.setValueAtTime(map(v),time);}
    // Every control here is an AudioParam: offline rendering needs no topology
    // suspension. Firefox does not implement OfflineAudioContext.suspend().
    if(typeof ctx.startRendering==='function'){
      n.automationStateTimes||={};
      if(time>=(n.automationStateTimes[key]??-Infinity)){n.automationStateTimes[key]=time;n.P={...n.P,[key]:v};}
    }else scheduleDspBoundary(ctx,n,time,()=>{n.P={...n.P,[key]:v};});
  };
  if(n.wk)run();else n.pending.push(run);return true;
};}
function ready(n,promise){
  const tracked=promise.then(value=>{if(n.ready===tracked)n.workletError=n.processorError||null;return value;},error=>{if(n.ready===tracked)n.workletError=error.message;throw error;});
  n.ready=tracked;n.ready.catch(()=>{});return n;
}
function finish(ctx,n){apply(ctx,n,n.P);for(const run of n.pending.splice(0))run();return true;}
function earlyIR(ctx){
  if(earlyBuffers.has(ctx))return earlyBuffers.get(ctx);
  const buffer=ctx.createBuffer(2,Math.ceil(ctx.sampleRate*.16),ctx.sampleRate),random=seededRandom('audionaut-hybrid-early-v1');
  for(let c=0;c<2;c++){
    const data=buffer.getChannelData(c);
    for(let k=0;k<16;k++){
      const time=.004+k*.008+(random()-.5)*.005,index=Math.round(time*ctx.sampleRate),level=(random()>.5?1:-1)*.22*Math.exp(-time*18);
      data[index]=level;
      for(let j=1;j<Math.min(64,data.length-index);j++)data[index+j]+=(random()*2-1)*Math.abs(level)*.08*(1-j/64);
    }
  }
  earlyBuffers.set(ctx,buffer);return buffer;
}
export function validateImpulseResponse(buffer,ctx){
  if(!buffer||typeof buffer.getChannelData!=='function'||buffer.numberOfChannels<1||buffer.numberOfChannels>2||!Number.isFinite(buffer.duration)||buffer.duration<=0||buffer.duration>10||buffer.length*buffer.numberOfChannels*4>16*1024*1024)throw new Error('Reverb impulse must be mono or stereo, at most 10 seconds and 16 MiB.');
  if(Math.ceil(buffer.duration*ctx.sampleRate)*buffer.numberOfChannels*4>16*1024*1024)throw new Error('Resampled reverb impulse exceeds the 16 MiB budget.');
  for(let c=0;c<buffer.numberOfChannels;c++)for(const value of buffer.getChannelData(c))if(!Number.isFinite(value))throw new Error('Reverb impulse contains invalid audio samples.');
  return buffer;
}
export async function prepareImpulseResponse(buffer,ctx){
  validateImpulseResponse(buffer,ctx);
  if(buffer.sampleRate===ctx.sampleRate)return buffer;
  const offline=new OfflineAudioContext(buffer.numberOfChannels,Math.ceil(buffer.duration*ctx.sampleRate),ctx.sampleRate),source=offline.createBufferSource();
  source.buffer=buffer;source.connect(offline.destination);source.start();return offline.startRendering();
}
const dynamicEq={
  name:'Dynamic Parametric EQ',role:'4-band dynamic equalizer',kind:'insert',category:'EQ',color:'#6dd6ca',version:1,sidechain:true,params:DYNAMIC_EQ_PARAMS,
  create(ctx){const n=base(ctx,'dynamicEq',DYNAMIC_EQ_PARAMS);n.sidechain=ctx.createGain();n.owned.push(n.sidechain);n.external=0;n.setSidechainExternal=on=>{n.external=on?1:0;if(n.wk)n.wk.parameters.get('external').setValueAtTime(n.external,ctx.currentTime);};return ready(n,(async()=>{if(!await n.attach())return false;n.input.connect(n.wk).connect(n.output);n.sidechain.connect(n.wk,0,1);n.wk.parameters.get('external').setValueAtTime(n.external,ctx.currentTime);return finish(ctx,n);})());},
  apply,automate:automate(DYNAMIC_EQ_PARAMS),dispose,meter:n=>n.meter,latencySamples:()=>0,
  tailSeconds:p=>Math.max(.15,...[1,2,3,4].map(b=>Math.min(12,Math.LN10*4*(p[`b${b}Q`]??1)/(Math.PI*(p[`b${b}Freq`]??[120,500,2000,6000][b-1]))*Math.pow(10,Math.max(0,(p[`b${b}Gain`]??0)+(p[`b${b}Range`]??0))/40)))),
};
const hybridReverb={
  name:'Hybrid Reverb',role:'Convolution reflections / diffuse tail',kind:'fx',category:'Reverb',color:'#91a8ef',version:1,params:HYBRID_REVERB_PARAMS,
  create(ctx,env={}){
    const n=base(ctx,'hybridReverb',HYBRID_REVERB_PARAMS),make=(method,...args)=>{const node=ctx[method](...args);n.owned.push(node);return node;};
    n.highpass=make('createBiquadFilter');n.highpass.type='highpass';n.highpass.Q.value=-3.0103;
    n.pre=make('createDelay',.25);
    n.early=make('createGain');n.late=make('createGain');n.wet=make('createGain');n.dry=make('createGain');n.sum=make('createGain');n.outGain=make('createGain');
    const split=make('createChannelSplitter',2),merge=make('createChannelMerger',2),ll=make('createGain'),lr=make('createGain'),rr=make('createGain'),rl=make('createGain');
    n.input.connect(n.dry).connect(n.outGain);n.input.connect(n.highpass).connect(n.pre);n.early.connect(n.sum);n.sum.connect(split);
    split.connect(ll,0);split.connect(lr,0);split.connect(rr,1);split.connect(rl,1);ll.connect(merge,0,0);rl.connect(merge,0,0);rr.connect(merge,0,1);lr.connect(merge,0,1);merge.connect(n.wet).connect(n.outGain).connect(n.output);
    n.parameterTargets={predelay:[[n.pre.delayTime,x=>x/1000]],balance:[[n.early.gain,x=>1-x],[n.late.gain,x=>x]],width:[[ll.gain,x=>(1+x)/2],[rr.gain,x=>(1+x)/2],[lr.gain,x=>(1-x)/2],[rl.gain,x=>(1-x)/2]],mix:[[n.wet.gain,x=>x],[n.dry.gain,x=>1-x]],lowcut:[[n.highpass.frequency,x=>Math.min(ctx.sampleRate*.45,x)]],output:[[n.outGain.gain,lin]]};
    n.irRevision=0;n.irBranches=[];n.pendingConvolutions=new Set();
    const retire=branch=>{
      try{n.pre.disconnect(branch.convolver);}catch{}
      branch.convolver.port?.postMessage({type:'dispose'});branch.convolver.port?.close();
      branch.convolver.disconnect();branch.gain.disconnect();branch.convolver.buffer=null;
      n.owned=n.owned.filter(node=>node!==branch.convolver&&node!==branch.gain);
      n.irBranches=n.irBranches.filter(item=>item!==branch);
    };
    const createConvolver=async(prepared,revision)=>{
      if(prepared.kind==='native'){const node=make('createConvolver');node.normalize=false;node.buffer=prepared.buffer;return node;}
      const node=new AudioWorkletNode(ctx,'audionaut-pro-convolution-v1',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2],channelCount:2,channelCountMode:'explicit'});
      node.buffer=prepared.buffer;n.owned.push(node);
      return new Promise((resolve,reject)=>{
        let done=false;
        const complete=(error,cancelled=false)=>{
          if(done)return;done=true;clearTimeout(timer);n.pendingConvolutions.delete(cancel);
          if(error||cancelled){node.port.postMessage({type:'dispose'});node.port.close();node.disconnect();node.buffer=null;n.owned=n.owned.filter(value=>value!==node);}
          if(error)reject(error);else resolve(cancelled?null:node);
        };
        const cancel=()=>complete(null,true),timer=setTimeout(()=>complete(new Error('Convolution audio processor did not initialize.')),10000);
        n.pendingConvolutions.add(cancel);
        node.port.onmessage=event=>{if(event.data?.type==='ready')complete();else if(event.data?.type==='error')complete(new Error(event.data.message));};
        node.onprocessorerror=()=>{const error=new Error('Convolution audio processor failed.');if(n.irBranches.some(branch=>branch.convolver===node))processorFailure(ctx,n,error.message);else if(!n.disposed&&revision===n.irRevision)n.workletError=error.message;complete(error);};
        // Ownership of every large allocation moves to the audio thread. Only
        // a small wrapper is constructed there; no FFT buffers are allocated.
        try{node.port.postMessage({type:'init',state:prepared.state},prepared.transfers);}catch(error){complete(error);}
      });
    };
    const commitIR=(prepared,convolver)=>{
      // Rapid edits cannot retain an unbounded set of native convolution graphs.
      // Prefer retiring a nearly silent branch when several fades overlap.
      while(n.irBranches.length>=4)retire([...n.irBranches].sort((a,b)=>a.gain.gain.value-b.gain.gain.value)[0]);
      const {buffer,kind,native}=prepared;
      n.convolutionBackend=kind;n.convolutionDiagnostic=native;
      const gain=make('createGain');
      const prior=[...n.irBranches],live=prior.length&&ctx.state==='running'&&typeof ctx.startRendering!=='function',time=ctx.currentTime;
      gain.gain.setValueAtTime(live?0:1,time);n.pre.connect(convolver).connect(gain).connect(n.early);
      const branch={convolver,gain};n.irBranches.push(branch);n.convolver=convolver;n.irDuration=buffer.duration;
      if(live){
        gain.gain.linearRampToValueAtTime(1,time+.03);
        for(const old of prior){const current=old.gain.gain.value;old.gain.gain.cancelScheduledValues(time);old.gain.gain.setValueAtTime(current,time);old.gain.gain.linearRampToValueAtTime(0,time+.03);scheduleDspBoundary(ctx,n,time+.04,()=>retire(old));}
      }else for(const old of prior)retire(old);
    };
    const ensureProcessor=()=>n.processorReady||=(async()=>{if(!await n.attach())return false;n.pre.connect(n.wk).connect(n.late).connect(n.sum);return finish(ctx,n);})();
    const replaceIR=async(getBuffer,source)=>{
      const revision=++n.irRevision;
      for(const cancel of n.pendingConvolutions)cancel();
      try{
        const buffer=await getBuffer();
        if(n.disposed||revision!==n.irRevision)return false;
        if(!buffer)throw new Error('The selected reverb impulse sample is missing.');
        const resampled=await prepareImpulseResponse(buffer,ctx);
        const prepared=await prepareConvolution(resampled,{forceFallback:env.convolutionBackend==='partitioned',live:typeof ctx.startRendering!=='function',isCurrent:()=>!n.disposed&&revision===n.irRevision});
        if(n.disposed||revision!==n.irRevision)return false;
        // Preserve the existing convolver and diffuse tail until all preparation
        // succeeds. A failed or superseded request never changes audible state.
        if(!await ensureProcessor()||n.disposed||revision!==n.irRevision)return false;
        const convolver=await createConvolver(prepared,revision);
        if(!convolver)return false;
        if(n.disposed||revision!==n.irRevision){convolver.port?.postMessage({type:'dispose'});convolver.port?.close();convolver.disconnect();convolver.buffer=null;n.owned=n.owned.filter(node=>node!==convolver);return false;}
        commitIR(prepared,convolver);n.irSource=source||null;return true;
      }catch(error){if(n.disposed||revision!==n.irRevision)return false;throw error;}
    };
    n.setImpulseResponse=buffer=>{ready(n,replaceIR(()=>buffer,null));return n.ready;};
    n.updateImpulseResponse=(source,resolver=env.resolveImpulseResponse)=>{
      ready(n,replaceIR(()=>source?resolver?.(source):earlyIR(ctx),source));return n.ready;
    };
    n.updateImpulseResponse(env.irSource,env.resolveImpulseResponse);return n;
  },
  apply,automate:automate(HYBRID_REVERB_PARAMS),dispose,meter:n=>({...n.meter,irDuration:n.irDuration,convolutionBackend:n.convolutionBackend}),latencySamples:()=>0,
  // Imported impulses are bounded at ten seconds; callers with an actual duration
  // can avoid the conservative unknown-asset tail when exporting a custom IR.
  tailSeconds:(p,env={})=>(p.predelay??20)/1000+Math.max(env.irSource?(env.irDuration??10):.16,(p.decay??2.5)*1.5),
};
const masteringLimiter={
  name:'Mastering Limiter',role:'Lookahead / estimated true-peak limiter',kind:'insert',category:'Dynamics',color:'#b4e68c',version:1,params:MASTERING_LIMITER_PARAMS,
  create(ctx){const n=base(ctx,'masteringLimiter',MASTERING_LIMITER_PARAMS);return ready(n,(async()=>{if(!await n.attach())return false;n.input.connect(n.wk).connect(n.output);return finish(ctx,n);})());},
  apply,automate:automate(MASTERING_LIMITER_PARAMS),dispose,meter:n=>n.meter,latencySamples:masteringLatencySamples,tailSeconds:(p)=>Math.max(.01,p.release??.15),
};
export const PRO_EFFECT_TYPES={dynamicEq,hybridReverb,masteringLimiter};
