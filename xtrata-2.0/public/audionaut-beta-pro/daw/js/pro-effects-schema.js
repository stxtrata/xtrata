// Versioned controls shared by the UI and AudioWorklet. Numeric values are
// AudioParams, so live playback and OfflineAudioContext use the same timeline.
const range=(key,label,min,max,step,def,log=false)=>({key,label,min,max,step,def,...(log?{log:true}:{})});
export const DYNAMIC_EQ_PARAMS=[
  ...[120,500,2000,6000].flatMap((frequency,i)=>{
    const b=`b${i+1}`,label=`Band ${i+1}`;
    return[range(b+'Freq',`${label} frequency (Hz)`,20,20000,1,frequency,true),range(b+'Q',`${label} Q`,.2,12,.05,1),range(b+'Gain',`${label} gain (dB)`,-18,18,.1,0),range(b+'Threshold',`${label} threshold (dB)`,-60,0,.5,-24),range(b+'Range',`${label} dynamic range (dB)`,-18,18,.1,i===2?-6:0)];
  }),
  range('attack','Detector attack (s)',.001,.2,.001,.01),range('release','Detector release (s)',.02,2,.01,.15),range('mix','Wet mix',0,1,.01,1),range('output','Output (dB)',-24,12,.1,0),
];
export const HYBRID_REVERB_PARAMS=[
  range('decay','Tail decay RT60 (s)',.2,12,.1,2.5),range('size','Room size',.5,2,.01,1),range('damping','Tail damping (Hz)',500,18000,50,6000,true),range('predelay','Pre-delay (ms)',0,250,1,20),range('balance','Early / late balance',0,1,.01,.65),range('width','Stereo width',0,1,.01,1),range('lowcut','Input low cut (Hz)',20,1000,1,100,true),range('mix','Wet mix',0,1,.01,.25),range('output','Output (dB)',-24,12,.1,0),
];
export const MASTERING_LIMITER_PARAMS=[
  range('input','Input gain (dB)',-12,24,.1,0),range('ceiling','Ceiling (dB)',-24,0,.1,-1),range('release','Release (s)',.02,2,.01,.15),
];
export const PRO_WORKLET_PARAMS={
  dynamicEq:[...DYNAMIC_EQ_PARAMS,range('external','External detector',0,1,1,0)],
  hybridReverb:HYBRID_REVERB_PARAMS.filter(p=>['decay','size','damping'].includes(p.key)),
  masteringLimiter:MASTERING_LIMITER_PARAMS,
};
