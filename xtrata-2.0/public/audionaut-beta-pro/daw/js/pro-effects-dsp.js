// First-party, versioned DSP kernels. No runtime imports, network, or third-party DSP.
// Shared by AudioWorklet and offline regression probes; all state is instance-owned.
export const PRO_EFFECT_DSP_VERSION = 1;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const lin = db => Math.pow(10, db / 20);
const db = x => 20 * Math.log10(Math.max(1e-12, x));
const coeff = (seconds, sr) => Math.exp(-1 / Math.max(1, seconds * sr));
const value = (p, key, i, fallback) => p[key]?.[p[key].length > 1 ? i : 0] ?? fallback;
const EQ_FREQUENCIES=[120,500,2000,6000];

class Biquad {
  constructor() { this.c = new Float64Array([1, 0, 0, 0, 0]); this.s = [new Float64Array(4), new Float64Array(4)]; }
  set(kind, frequency, q, gain, sr) {
    const w = 2 * Math.PI * clamp(frequency, 10, sr * .45) / sr, c = Math.cos(w), a = Math.sin(w) / (2 * q);
    const out=this.c;
    if (kind === 'band') { const z = 1 + a; out[0]=a/z;out[1]=0;out[2]=-a/z;out[3]=-2*c/z;out[4]=(1-a)/z; }
    else { const A = Math.pow(10, gain / 40), z = 1 + a / A; out[0]=(1+a*A)/z;out[1]=-2*c/z;out[2]=(1-a*A)/z;out[3]=-2*c/z;out[4]=(1-a/A)/z; }
  }
  run(x, channel) {
    const s = this.s[channel], c = this.c, y = c[0] * x + c[1] * s[0] + c[2] * s[1] - c[3] * s[2] - c[4] * s[3];
    s[1] = s[0]; s[0] = x; s[3] = s[2]; s[2] = Math.abs(y) < 1e-25 ? 0 : y; return y;
  }
}

export class DynamicEqDSP {
  constructor(sr) {
    this.sr = sr; this.bands = Array.from({length:4}, (_,i) => ({detector:new Biquad(), eq:new Biquad(), power:0, gain:0, keys:['Freq','Q','Gain','Threshold','Range'].map(k=>`b${i+1}${k}`)}));
    this.gainSmooth=1-coeff(.002,sr);
    this.frames = 0; this.reductions = [0, 0, 0, 0]; this.inPeak = 0; this.outPeak = 0;
  }
  process(input, detector, output, p) {
    const n = output[0].length;
    for (let i = 0; i < n; i++, this.frames++) {
      const l = input[0]?.[i] || 0, r = input[1]?.[i] ?? l;
      const dl = detector?.[0]?.[i] ?? l, dr = detector?.[1]?.[i] ?? dl;
      let yl = l, yr = r;
      const attack=coeff(value(p,'attack',i,.01),this.sr),release=coeff(value(p,'release',i,.15),this.sr);
      for (let b = 0; b < 4; b++) {
        const band = this.bands[b], keys=band.keys, frequency = value(p, keys[0], i, EQ_FREQUENCIES[b]), q = value(p, keys[1], i, 1);
        if (this.frames % 16 === 0) band.detector.set('band', frequency, q, 0, this.sr);
        const a = band.detector.run(dl, 0), z = band.detector.run(dr, 1), power = (a*a + z*z) / 2;
        const tc = power>band.power?attack:release;
        band.power = power + tc * (band.power - power);
        const over = Math.max(0, db(Math.sqrt(band.power)) - value(p, keys[3], i, -24));
        const target = value(p, keys[4], i, 0) * clamp(over / 12, 0, 1);
        band.gain += (target - band.gain) * this.gainSmooth;
        if (this.frames % 16 === 0) band.eq.set('peak', frequency, q, value(p, keys[2], i, 0) + band.gain, this.sr);
        yl = band.eq.run(yl, 0); yr = band.eq.run(yr, 1); this.reductions[b] = band.gain;
      }
      const mix = value(p, 'mix', i, 1), gain = lin(value(p, 'output', i, 0));
      output[0][i] = gain * (l + mix * (yl-l)); output[1][i] = gain * (r + mix * (yr-r));
      this.inPeak = Math.max(this.inPeak, Math.abs(l), Math.abs(r));
      this.outPeak = Math.max(this.outPeak, Math.abs(output[0][i]), Math.abs(output[1][i]));
    }
  }
  meter() { const result={bands:[...this.reductions],inPeak:this.inPeak,outPeak:this.outPeak}; this.inPeak=this.outPeak=0; return result; }
}

// Eight-line orthogonal feedback delay network. Householder mixing preserves
// energy, while every feedback coefficient is strictly <1 for finite decay.
export class ReverbTailDSP {
  constructor(sr) {
    this.sr=sr; this.base=[1493,1601,1867,1999,2137,2399,2683,2939].map(n=>n*sr/44100);
    this.lines=this.base.map(n=>new Float32Array(Math.ceil(n*2)+2)); this.pos=new Uint32Array(8); this.low=new Float64Array(8); this.read=new Float64Array(8); this.frames=0;
  }
  process(input, _detector, output, p) {
    for(let i=0;i<output[0].length;i++,this.frames++){
      const decay=value(p,'decay',i,2.5),size=value(p,'size',i,1),damp=1-Math.exp(-2*Math.PI*Math.min(this.sr*.45,value(p,'damping',i,6000))/this.sr);
      let sum=0,left=0,right=0;
      for(let k=0;k<8;k++){
        const len=Math.max(2,Math.round(this.base[k]*size)),line=this.lines[k]; if(this.pos[k]>=len)this.pos[k]=0;
        const y=line[this.pos[k]]; this.low[k]+=damp*(y-this.low[k]); this.read[k]=this.low[k]; sum+=this.low[k];
        left+=y*(k%2?1:-1); right+=y*((k>>1)%2?1:-1);
      }
      const l=input[0]?.[i]||0,r=input[1]?.[i]??l;
      for(let k=0;k<8;k++){
        const len=Math.max(2,Math.round(this.base[k]*size)),feedback=Math.exp(-Math.LN10*3*len/(this.sr*decay));
        const x=(k%2?l:r)*.25+(this.read[k]-sum*.25)*feedback;
        this.lines[k][this.pos[k]]=Math.abs(x)<1e-25?0:x; this.pos[k]=(this.pos[k]+1)%len;
      }
      output[0][i]=left*.25; output[1][i]=right*.25;
    }
  }
  meter(){return{};}
}

export const masteringLatencySamples = sr => Math.ceil(sr * .005) + 24;
// Four-phase, 48-tap windowed-sinc interpolation. This estimates intersample
// peaks; the 0.2 dB guard accounts for finite interpolation and gain modulation.
// It is deliberately described as estimated true peak, not a compliance meter.
export class MasteringLimiterDSP {
  constructor(sr) {
    this.sr=sr; this.delay=masteringLatencySamples(sr); this.ring=[new Float32Array(this.delay+1),new Float32Array(this.delay+1)]; this.history=[new Float64Array(48),new Float64Array(48)];
    this.fir=Array.from({length:4},(_,phase)=>{const a=new Float64Array(48);let sum=0;for(let k=0;k<48;k++){const t=k-24+phase/4;const sinc=Math.abs(t)<1e-12?1:Math.sin(Math.PI*t)/(Math.PI*t);a[k]=sinc*(.42+.5*Math.cos(Math.PI*t/24)+.08*Math.cos(2*Math.PI*t/24));sum+=a[k];}for(let k=0;k<48;k++)a[k]/=sum;return a;});
    this.queueValues=new Float64Array(this.delay+2);this.queueTimes=new Float64Array(this.delay+2);this.head=0;this.tail=0;this.frames=0;this.gain=1;this.inPeak=0;this.outPeak=0;this.truePeak=0;this.minGain=1;
  }
  process(input,_detector,output,p){
    const capacity=this.queueValues.length;
    for(let i=0;i<output[0].length;i++,this.frames++){
      const n=this.frames,drive=lin(value(p,'input',i,0)),ceiling=lin(value(p,'ceiling',i,-1)),release=coeff(value(p,'release',i,.15),this.sr);
      const l=(input[0]?.[i]||0)*drive,r=(input[1]?.[i]??input[0]?.[i]??0)*drive;
      const h=n%48;this.history[0][h]=l;this.history[1][h]=r;let peak=0;
      for(let ch=0;ch<2;ch++)for(const taps of this.fir){let x=0;for(let k=0;k<48;k++)x+=this.history[ch][(h-k+48)%48]*taps[k];peak=Math.max(peak,Math.abs(x));}
      this.truePeak=Math.max(this.truePeak,peak);
      // Sliding maximum covers the delayed sample and its next five milliseconds.
      while(this.head!==this.tail&&this.queueTimes[this.head]<n-(this.delay-24))this.head=(this.head+1)%capacity;
      while(this.head!==this.tail){const last=(this.tail-1+capacity)%capacity;if(this.queueValues[last]>peak)break;this.tail=last;}
      this.queueValues[this.tail]=peak;this.queueTimes[this.tail]=n;this.tail=(this.tail+1)%capacity;
      const target=Math.min(1,ceiling*lin(-.2)/Math.max(this.queueValues[this.head],1e-12));
      this.gain=Math.min(target,1+(this.gain-1)*release);this.minGain=Math.min(this.minGain,this.gain);
      const pos=n%this.ring[0].length;this.ring[0][pos]=l;this.ring[1][pos]=r;
      const at=(pos+1)%this.ring[0].length;
      output[0][i]=clamp(this.ring[0][at]*this.gain,-ceiling,ceiling);output[1][i]=clamp(this.ring[1][at]*this.gain,-ceiling,ceiling);
      this.inPeak=Math.max(this.inPeak,Math.abs(l),Math.abs(r));this.outPeak=Math.max(this.outPeak,Math.abs(output[0][i]),Math.abs(output[1][i]));
    }
  }
  meter(){const result={inPeak:this.inPeak,outPeak:this.outPeak,estimatedInputTruePeak:this.truePeak,reduction:db(this.minGain)};this.inPeak=this.outPeak=this.truePeak=0;this.minGain=1;return result;}
}
