// Local first-party module; packaged alongside the app for chain deployment.
import {DynamicEqDSP,ReverbTailDSP,MasteringLimiterDSP} from './pro-effects-dsp.js';
import {PRO_WORKLET_PARAMS} from './pro-effects-schema.js';
const kernels={dynamicEq:DynamicEqDSP,hybridReverb:ReverbTailDSP,masteringLimiter:MasteringLimiterDSP};
for(const [id,Kernel] of Object.entries(kernels)){
  class Processor extends AudioWorkletProcessor{
    static get parameterDescriptors(){return PRO_WORKLET_PARAMS[id].map(p=>({name:p.key,defaultValue:p.def,minValue:p.min,maxValue:p.max,automationRate:'a-rate'}));}
    constructor(){super();this.dsp=new Kernel(sampleRate);this.dead=false;this.frames=0;this.silence=[new Float32Array(128),new Float32Array(128)];this.port.onmessage=event=>{if(event.data?.type==='dispose')this.dead=true;};}
    process(inputs,outputs,params){
      if(this.dead)return false;
      const out=outputs[0];if(!out?.length)return true;
      if(out.length<2)throw new Error('Pro effects require a stereo output.');
      const detector=params.external?.[0]>=.5?(inputs[1]?.length?inputs[1]:this.silence):null;
      this.dsp.process(inputs[0]||[],detector,out,params);
      this.frames+=out[0].length;
      if(this.frames>=sampleRate/20){this.frames=0;this.port.postMessage({type:'meter',...this.dsp.meter()});}
      return true;
    }
  }
  registerProcessor(`audionaut-pro-${id}-v1`,Processor);
}
