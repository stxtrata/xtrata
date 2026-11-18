// Uncompressed ZIP assembled from Blob parts; audio is never copied into one giant buffer.
const table=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
async function crc(blob,signal){let value=0xffffffff;const reader=blob.stream().getReader();try{while(true){if(signal?.aborted)throw new DOMException('Export cancelled.','AbortError');const {done,value:bytes}=await reader.read();if(done)break;for(const byte of bytes)value=table[(value^byte)&255]^(value>>>8);}}finally{reader.releaseLock();}return(value^0xffffffff)>>>0;}
export async function zipFiles(files,{signal,onProgress=()=>{}}={}){
  const parts=[],central=[];let offset=0,centralSize=0;
  for(let i=0;i<files.length;i++){
    const {name,blob}=files[i],encoded=new TextEncoder().encode(name.replace(/[\\/]/g,'-'));
    if(offset+blob.size>0xffffffff)throw new Error('This package exceeds ZIP size limits.');
    const checksum=await crc(blob,signal),header=new Uint8Array(30+encoded.length),h=new DataView(header.buffer);
    h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint32(14,checksum,true);h.setUint32(18,blob.size,true);h.setUint32(22,blob.size,true);h.setUint16(26,encoded.length,true);header.set(encoded,30);
    parts.push(header,blob);const entry=new Uint8Array(46+encoded.length),v=new DataView(entry.buffer);
    v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint32(16,checksum,true);v.setUint32(20,blob.size,true);v.setUint32(24,blob.size,true);v.setUint16(28,encoded.length,true);v.setUint32(42,offset,true);entry.set(encoded,46);central.push(entry);centralSize+=entry.length;offset+=header.length+blob.size;onProgress({phase:'package',completed:i+1,total:files.length});
  }
  const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
  return new Blob([...parts,...central,end],{type:'application/zip'});
}
