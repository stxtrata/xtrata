// First-party convolution portability path. Native convolution is used only after
// an impulse/reference probe passes. The fallback has a direct head plus dyadic
// FFT partitions; it adds no algorithmic latency and owns bounded per-voice state.
const HEAD = 128, MAX_BLOCK = 32768;
// The portable JS path is deliberately bounded for live playback. Native
// convolution and offline export retain the full ten-second asset allowance.
export const PORTABLE_LIVE_IR_SECONDS=2;
const fftCache = new Map();
class FourierTransform {
  constructor(size) {
    this.size=size;this.reverse=new Uint32Array(size);this.cos=new Float64Array(size/2);this.sin=new Float64Array(size/2);
    const bits=Math.log2(size);
    for(let i=0;i<size;i++){let x=i,r=0;for(let k=0;k<bits;k++){r=(r<<1)|(x&1);x>>>=1;}this.reverse[i]=r;}
    for(let i=0;i<size/2;i++){this.cos[i]=Math.cos(2*Math.PI*i/size);this.sin[i]=Math.sin(2*Math.PI*i/size);}
  }
  run(real,imag,inverse=false) {
    const n=this.size;
    for(let i=0;i<n;i++){const j=this.reverse[i];if(j>i){let t=real[i];real[i]=real[j];real[j]=t;t=imag[i];imag[i]=imag[j];imag[j]=t;}}
    for(let width=2;width<=n;width*=2){const half=width/2,stride=n/width;for(let start=0;start<n;start+=width)for(let j=0;j<half;j++){
      const at=start+j,next=at+half,k=j*stride,c=this.cos[k],s=inverse?this.sin[k]:-this.sin[k];
      const r=real[next]*c-imag[next]*s,z=real[next]*s+imag[next]*c;
      real[next]=real[at]-r;imag[next]=imag[at]-z;real[at]+=r;imag[at]+=z;
    }}
    if(inverse)for(let i=0;i<n;i++){real[i]/=n;imag[i]/=n;}
  }
  *steps(real,imag,inverse=false){
    const n=this.size;let work=0;
    for(let i=0;i<n;i++){const j=this.reverse[i];if(j>i){let t=real[i];real[i]=real[j];real[j]=t;t=imag[i];imag[i]=imag[j];imag[j]=t;}if(++work===1024){work=0;yield;}}
    for(let width=2;width<=n;width*=2){const half=width/2,stride=n/width;for(let start=0;start<n;start+=width)for(let j=0;j<half;j++){
      const at=start+j,next=at+half,k=j*stride,c=this.cos[k],s=inverse?this.sin[k]:-this.sin[k],r=real[next]*c-imag[next]*s,z=real[next]*s+imag[next]*c;
      real[next]=real[at]-r;imag[next]=imag[at]-z;real[at]+=r;imag[at]+=z;
      if(++work===1024){work=0;yield;}
    }}
    if(inverse)for(let i=0;i<n;i++){real[i]/=n;imag[i]/=n;if(++work===1024){work=0;yield;}}
  }
}
const fftFor=size=>{let fft=fftCache.get(size);if(!fft){fft=new FourierTransform(size);fftCache.set(size,fft);}return fft;};
const powerOfTwo=n=>2**Math.ceil(Math.log2(Math.max(2,n)));
const MAX_WORKING_BYTES=128*1024*1024;
function partitionSpecs(length){
  const specs=[];
  for(let offset=HEAD;offset<length;){
    const deferred=offset>=1024,size=offset<1024?offset:offset<8192?512:offset<65536?4096:MAX_BLOCK;
    const count=offset<1024?1:offset<8192?Math.min(14,Math.ceil((length-offset)/size)):offset<65536?Math.min(14,Math.ceil((length-offset)/size)):Math.ceil((length-offset)/size);
    specs.push({size,offset,count,deferred});offset+=size*count;
  }
  return specs;
}
function estimatedWorkingBytes(length,channels,specs){
  // Kernel + input spectra, working vectors, FFT tables, direct/output rings.
  // Reserve the source IR and one transient preparation FFT as well.
  let bytes=length*channels*4+HEAD*8+16*powerOfTwo(Math.max(2,...specs.map(s=>s.offset+2*s.size)))+MAX_BLOCK*32;
  for(const s of specs){const n=s.size*2;bytes+=(s.size+1)*s.count*8*(channels+2)+n*92;}
  return bytes;
}

export async function prepareConvolutionPlan(channels,{yieldTask=()=>new Promise(r=>setTimeout(r,0)),isCurrent=()=>true}={}){
  if(!channels.length||channels.length>2||!channels[0].length)throw new Error('Convolution requires a non-empty mono or stereo impulse.');
  const length=channels[0].length;
  if(channels.some(c=>c.length!==length)||length*channels.length*4>16*1024*1024)throw new Error('Convolution impulse exceeds its memory budget.');
  const direct=[],taps=[];let sparse=true;
  for(const channel of channels){const head=[],small=[];let count=0;for(let i=0;i<channel.length;i++){const x=channel[i];if(!Number.isFinite(x))throw new Error('Invalid convolution sample.');if(x!==0){if(i<HEAD)head.push([i,x]);if(++count<=64)small.push([i,x]);}}direct.push(head);taps.push(small);if(count>64)sparse=false;}
  // Exact sparse responses (including long pure delays) need no transform.
  if(sparse)return{version:1,length,channels:channels.length,sparse:true,direct:taps,groups:[]};
  const specs=partitionSpecs(length),workingBytes=estimatedWorkingBytes(length,channels.length,specs);
  if(workingBytes>MAX_WORKING_BYTES)throw new Error('Convolution exceeds the 128 MiB working-memory budget.');
  const plan={version:1,length,channels:channels.length,sparse:false,direct,groups:[],workingBytes};
  for(const {offset,size,count,deferred} of specs){
    // Early partitions finish immediately. Later groups have at least a full
    // block of extra delay, which is used to spread their transforms over time.
    const n=size*2,fft=fftFor(n),kernels=[];
    let nonzero=false;
    for(const channel of channels){const parts=[];for(let part=0;part<count;part++){
      const real=new Float64Array(n),imag=new Float64Array(n),begin=offset+part*size;
      real.set(channel.subarray(begin,Math.min(length,begin+size)));
      if(real.some(x=>x!==0))nonzero=true;
      fft.run(real,imag);parts.push([Float32Array.from(real.subarray(0,size+1)),Float32Array.from(imag.subarray(0,size+1))]);
      // A large custom IR is prepared cooperatively; one bounded FFT is the
      // largest synchronous unit, rather than a whole multi-second response.
      await yieldTask();
      if(!isCurrent())throw new Error('Convolution preparation was superseded.');
    }kernels.push(parts);}
    if(nonzero)plan.groups.push({size,offset,count,kernels,deferred});
  }
  return plan;
}

export class PartitionedConvolverDSP {
  constructor(plan,state=null){
    if(state){Object.assign(this,state);for(const group of this.groups)Object.setPrototypeOf(group.fft,FourierTransform.prototype);return;}
    this.plan=plan;this.frame=0;this.historySize=powerOfTwo(plan.sparse?plan.length:HEAD);this.historyMask=this.historySize-1;this.history=[new Float32Array(this.historySize),new Float32Array(this.historySize)];
    this.outputSize=powerOfTwo(Math.max(2,...plan.groups.map(s=>s.offset+2*s.size)));this.outputMask=this.outputSize-1;this.output=[new Float64Array(this.outputSize),new Float64Array(this.outputSize)];
    this.groups=plan.groups.map(spec=>{
      const n=spec.size*2;
      return{...spec,position:0,slot:0,fft:fftFor(n),input:[new Float64Array(n),new Float64Array(n)],workInput:[new Float64Array(n),new Float64Array(n)],imag:[new Float64Array(n),new Float64Array(n)],sumReal:[new Float64Array(n),new Float64Array(n)],sumImag:[new Float64Array(n),new Float64Array(n)],spectra:[0,1].map(()=>Array.from({length:spec.count},()=>[new Float32Array(spec.size+1),new Float32Array(spec.size+1)])),job:null,stepsPerQuantum:Math.ceil((2*((spec.size+1)*spec.count+n*(Math.log2(n)+5))/1024+20)/(spec.size/128))+2};
    });
  }
  transform(group){
    const n=group.size*2,blockStart=this.frame-group.size+1;
    for(let ch=0;ch<2;ch++){
      const real=group.input[ch],imag=group.imag[ch];real.fill(0,group.size);imag.fill(0);group.fft.run(real,imag);
      const history=group.spectra[ch],current=history[group.slot];current[0].set(real.subarray(0,group.size+1));current[1].set(imag.subarray(0,group.size+1));
      const yr=group.sumReal[ch],yi=group.sumImag[ch],kernels=group.kernels[Math.min(ch,this.plan.channels-1)];yr.fill(0);yi.fill(0);
      for(let part=0;part<group.count;part++){
        const x=history[(group.slot-part+group.count)%group.count],h=kernels[part],xr=x[0],xi=x[1],hr=h[0],hi=h[1];
        for(let k=0;k<=group.size;k++){yr[k]+=xr[k]*hr[k]-xi[k]*hi[k];yi[k]+=xr[k]*hi[k]+xi[k]*hr[k];}
      }
      for(let k=1;k<group.size;k++){yr[n-k]=yr[k];yi[n-k]=-yi[k];}
      group.fft.run(yr,yi,true);
      const output=this.output[ch],start=blockStart+group.offset;
      for(let k=0;k<n;k++)output[(start+k)&this.outputMask]+=yr[k];
    }
    group.slot=(group.slot+1)%group.count;group.position=0;
  }
  *transformSteps(group,blockStart){
    const n=group.size*2;
    for(let ch=0;ch<2;ch++){
      const real=group.workInput[ch],imag=group.imag[ch];real.fill(0,group.size);imag.fill(0);yield;
      yield*group.fft.steps(real,imag);
      const history=group.spectra[ch],current=history[group.slot];current[0].set(real.subarray(0,group.size+1));current[1].set(imag.subarray(0,group.size+1));yield;
      const yr=group.sumReal[ch],yi=group.sumImag[ch],kernels=group.kernels[Math.min(ch,this.plan.channels-1)];yr.fill(0);yi.fill(0);yield;
      let work=0;
      for(let part=0;part<group.count;part++){
        const x=history[(group.slot-part+group.count)%group.count],h=kernels[part],xr=x[0],xi=x[1],hr=h[0],hi=h[1];
        for(let k=0;k<=group.size;k++){yr[k]+=xr[k]*hr[k]-xi[k]*hi[k];yi[k]+=xr[k]*hi[k]+xi[k]*hr[k];if(++work===1024){work=0;yield;}}
      }
      for(let k=1;k<group.size;k++){yr[n-k]=yr[k];yi[n-k]=-yi[k];if(++work===1024){work=0;yield;}}
      yield*group.fft.steps(yr,yi,true);
      const output=this.output[ch],start=blockStart+group.offset;work=0;
      for(let k=0;k<n;k++){output[(start+k)&this.outputMask]+=yr[k];if(++work===1024){work=0;yield;}}
    }
    group.slot=(group.slot+1)%group.count;
  }
  process(input,output){
    for(const group of this.groups)if(group.job){const budget=Math.ceil(group.stepsPerQuantum*output[0].length/128);for(let step=0;step<budget;step++){if(group.job.next().done){group.job=null;break;}}}
    for(let i=0;i<output[0].length;i++,this.frame++){
      const l=input[0]?.[i]||0,r=input[1]?.[i]??l,pos=this.frame&this.historyMask;this.history[0][pos]=l;this.history[1][pos]=r;
      for(let g=0;g<this.groups.length;g++){
        const group=this.groups[g];group.input[0][group.position]=l;group.input[1][group.position]=r;
        if(++group.position===group.size){
          if(group.deferred){
            if(group.job)throw new Error('Convolution preparation missed its processing deadline.');
            group.workInput[0].set(group.input[0]);group.workInput[1].set(group.input[1]);
            group.job=this.transformSteps(group,this.frame-group.size+1);group.position=0;
          }else this.transform(group);
        }
      }
      const at=this.frame&this.outputMask;
      for(let ch=0;ch<2;ch++){
        let sum=this.output[ch][at];this.output[ch][at]=0;
        const history=this.history[ch],taps=this.plan.direct[Math.min(ch,this.plan.channels-1)];for(let k=0;k<taps.length;k++)sum+=history[(pos-taps[k][0])&this.historyMask]*taps[k][1];
        output[ch][i]=sum;
      }
    }
  }
}

// Allocate the large arrays before contacting the audio thread. Sending this
// state through MessagePort with transfer ownership avoids a second buffer copy
// and large AudioWorklet-constructor allocations during a live IR change.
export function convolutionState(plan){
  const state=new PartitionedConvolverDSP(plan);
  for(const group of state.groups){const f=group.fft;group.fft={size:f.size,reverse:f.reverse.slice(),cos:f.cos.slice(),sin:f.sin.slice()};}
  return state;
}
export function convolutionTransfers(state){
  const seen=new Set(),buffers=new Set();
  const visit=value=>{if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);if(ArrayBuffer.isView(value))buffers.add(value.buffer);else for(const child of Object.values(value))visit(child);};visit(state);return [...buffers];
}

const probes=new Map();
export function nativeConvolutionReport(sampleRate){
  if(!probes.has(sampleRate))probes.set(sampleRate,(async()=>{
    try{
      const Context=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext,ctx=new Context(2,2048,sampleRate),ir=ctx.createBuffer(2,1024,sampleRate),input=ctx.createBuffer(2,2048,sampleRate);
      // Different sparse taps exercise both channels, silent partitions and the
      // packed DC/Nyquist convention. A silent-IR-only test can be optimized away.
      ir.getChannelData(0)[317]=.75;ir.getChannelData(1)[911]=-.5;input.getChannelData(0)[0]=input.getChannelData(1)[0]=1;
      const source=ctx.createBufferSource(),convolver=ctx.createConvolver();convolver.normalize=false;convolver.buffer=ir;source.buffer=input;source.connect(convolver).connect(ctx.destination);source.start();
      const actual=await ctx.startRendering();let maxError=0;
      for(let ch=0;ch<2;ch++){const data=actual.getChannelData(ch),expected=ir.getChannelData(ch);for(let i=0;i<data.length;i++){const error=Math.abs(data[i]-(expected[i]||0));if(!Number.isFinite(error)){maxError=Infinity;break;}maxError=Math.max(maxError,error);}}
      source.disconnect();convolver.disconnect();convolver.buffer=null;
      return{sampleRate,safe:maxError<1e-6,maxError};
    }catch(error){return{sampleRate,safe:false,error:error.message};}
  })());
  return probes.get(sampleRate);
}
export async function prepareConvolution(buffer,{forceFallback=false,isCurrent=()=>true,live=false}={}){
  const native=await nativeConvolutionReport(buffer.sampleRate);
  if(native.safe&&!forceFallback)return{kind:'native',buffer,native};
  if(live&&buffer.duration>PORTABLE_LIVE_IR_SECONDS)throw new Error("This browser's portable live reverb supports impulses up to 2 seconds. Shorten the impulse, or render it in desktop Chrome, Edge or Firefox.");
  if(!isCurrent())throw new Error('Convolution preparation was superseded.');
  const plan=await prepareConvolutionPlan(Array.from({length:buffer.numberOfChannels},(_,ch)=>buffer.getChannelData(ch)),{isCurrent});
  const state=convolutionState(plan),transfers=convolutionTransfers(state),bytes=transfers.reduce((sum,b)=>sum+b.byteLength,0);
  if(bytes>MAX_WORKING_BYTES)throw new Error('Convolution exceeds the 128 MiB working-memory budget.');
  return{kind:'partitioned',buffer,state,transfers,bytes,native};
}
