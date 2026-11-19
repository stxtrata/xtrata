// Portable PCM decoding for our recorded/exported WAVs. Compressed formats still
// use the browser decoder. Sample conversion runs off the audio/UI thread.
const MAX_DECODED_BYTES=256*1024*1024;
export function inspectPcmWav(bytes){
  const v=new DataView(bytes),text=(at,n)=>String.fromCharCode(...new Uint8Array(bytes,at,n));
  if(v.byteLength<12||text(0,4)!=='RIFF'||text(8,4)!=='WAVE')return null;
  let format=null,data=null,unsupportedLayout=false;
  for(let at=12;at+8<=v.byteLength;){
    const tag=text(at,4),size=v.getUint32(at+4,true),start=at+8;
    if(start+size>v.byteLength)throw new Error('The WAV file is truncated.');
    if(tag==='fmt '&&size>=16){
      let code=v.getUint16(start,true);
      if(code===65534&&size>=40)code=v.getUint16(start+24,true);
      if(code!==1&&code!==3)return null;
      const channels=v.getUint16(start+2,true),sampleRate=v.getUint32(start+4,true),align=v.getUint16(start+12,true),bits=v.getUint16(start+14,true);
      if(channels<1||channels>32||sampleRate<8000||sampleRate>384000||align!==channels*bits/8||!(code===1?[8,16,24,32]:[32,64]).includes(bits))unsupportedLayout=true;
      format={code,channels,sampleRate,align,bits};
    }else if(tag==='data')data={start,size};
    at=start+size+(size&1);
  }
  if(unsupportedLayout)throw Object.assign(new Error('Unsupported PCM WAV layout.'),{code:'UNSUPPORTED_PCM_LAYOUT'});
  if(!format||!data)return null;
  const frames=Math.floor(data.size/format.align);
  if(!frames||data.size%format.align)throw new Error('The PCM WAV has incomplete audio frames.');
  if(frames*format.channels*4>MAX_DECODED_BYTES)throw new Error('Decoded audio exceeds 256 MB. Import a shorter recording.');
  return {...format,...data,frames};
}
export function decodePcmPlanes(bytes,header=inspectPcmWav(bytes)){
  if(!header)return null;
  const {code,channels,bits,start,frames,align}=header,v=new DataView(bytes),planes=Array.from({length:channels},()=>new Float32Array(frames));
  for(let ch=0;ch<channels;ch++)for(let i=0,at=start+ch*bits/8;i<frames;i++,at+=align){
    let sample;
    if(code===3)sample=bits===32?v.getFloat32(at,true):v.getFloat64(at,true);
    else if(bits===8)sample=(v.getUint8(at)-128)/128;
    else if(bits===16)sample=v.getInt16(at,true)/32768;
    else if(bits===24){let n=v.getUint8(at)|(v.getUint8(at+1)<<8)|(v.getUint8(at+2)<<16);if(n&0x800000)n|=0xff000000;sample=n/8388608;}
    else sample=v.getInt32(at,true)/2147483648;
    planes[ch][i]=Number.isFinite(sample)?sample:0;
  }
  return planes;
}
export async function decodePcmWav(context,bytes,{signal}={}){
  if(signal?.aborted)throw signal.reason||new DOMException('Audio loading cancelled.','AbortError');
  const header=inspectPcmWav(bytes);if(!header)return null;
  let planes;
  if(typeof Worker==='undefined')planes=decodePcmPlanes(bytes,header);
  else planes=await new Promise((resolve,reject)=>{
    const worker=new Worker(new URL('./pcm-wav-worker.js',import.meta.url),{type:'module'});
    const cleanup=()=>{worker.terminate();signal?.removeEventListener('abort',cancel);};
    const cancel=()=>{cleanup();reject(signal.reason||new DOMException('Audio loading cancelled.','AbortError'));};
    signal?.addEventListener('abort',cancel,{once:true});
    worker.onmessage=({data})=>{cleanup();data.error?reject(new Error(data.error)):resolve(data.planes);};
    worker.onerror=event=>{cleanup();reject(new Error(event.message||'PCM audio decoding failed.'));};
    worker.postMessage({bytes,header},[bytes]);
  });
  if(signal?.aborted)throw signal.reason||new DOMException('Audio loading cancelled.','AbortError');
  const buffer=context.createBuffer(header.channels,header.frames,header.sampleRate);
  for(let ch=0;ch<header.channels;ch++)buffer.copyToChannel(planes[ch],ch);
  return buffer;
}
