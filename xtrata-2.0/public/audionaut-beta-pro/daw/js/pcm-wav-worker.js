import {decodePcmPlanes} from './pcm-wav.js';
self.onmessage=({data:{bytes,header}})=>{
  try{const planes=decodePcmPlanes(bytes,header);self.postMessage({planes},planes.map(p=>p.buffer));}
  catch(error){self.postMessage({error:error.message});}
};
