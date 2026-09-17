import { endianness } from 'node:os';
const little=endianness()==='LE';
export function encodeFrame(value) {
  const body=Buffer.from(JSON.stringify(value),'utf8');
  if(body.length>65536)throw Error('Frame too large');
  const header=Buffer.alloc(4); if(little)header.writeUInt32LE(body.length);else header.writeUInt32BE(body.length);
  return Buffer.concat([header,body]);
}
export function decoder(onMessage) {
  let buffer=Buffer.alloc(0),failed=false;
  return chunk=>{
    if(failed)throw Error('Closed decoder');
    try{
      buffer=Buffer.concat([buffer,chunk]);
      while(buffer.length>=4){
        const length=little?buffer.readUInt32LE(0):buffer.readUInt32BE(0);
        if(length===0||length>65536)throw Error('Invalid frame length');
        if(buffer.length<length+4)break;
        const message=JSON.parse(buffer.subarray(4,length+4).toString('utf8'));
        buffer=buffer.subarray(length+4);onMessage(message);
      }
    }catch{failed=true;buffer=Buffer.alloc(0);throw Error('Invalid native frame');}
  };
}
