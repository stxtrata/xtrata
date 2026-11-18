import {encodeWav} from './audio-utils.js';
self.onmessage=({data:{channels,sampleRate,settings}})=>{
  try{
    const buffer={numberOfChannels:channels.length,sampleRate,length:channels[0].length,duration:channels[0].length/sampleRate,getChannelData:i=>channels[i]};
    const blob=encodeWav(buffer,{...settings,onProgress:progress=>self.postMessage({progress})});
    self.postMessage({blob});
  }catch(error){self.postMessage({error:error.message});}
};
