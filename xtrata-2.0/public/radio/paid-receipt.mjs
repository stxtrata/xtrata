// Shared, dependency-free receipt codec. These seconds are client reports, not proof.
export function encodeListenReceipt({platform,version,audibleSeconds,threshold,unknownDuration},random) {
 const platforms={darwin:1,win32:2,linux:3,dev:4};
 const parts=String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
 if(!parts)throw Error('Invalid receipt app version');
 const [major,minor,patch]=parts.slice(1).map(Number),v=major*10000+minor*100+patch;
 if(minor>99||patch>99||v>65535||!platforms[platform]||!Number.isFinite(audibleSeconds)||audibleSeconds<threshold||!Number.isInteger(threshold)||threshold<1||threshold>30||typeof unknownDuration!=='boolean'||random.length!==6)throw Error('Invalid listen receipt');
 const bytes=new Uint8Array(16),view=new DataView(bytes.buffer);
 bytes.set([0x58,0x4d,1,platforms[platform]]);view.setUint16(4,v);bytes[6]=1|(unknownDuration?2:0)|(threshold<30?4:0);
 view.setUint16(7,Math.min(65535,Math.floor(audibleSeconds)));bytes[9]=threshold;bytes.set(random,10);
 return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
export function decodePaidReceipt(hex) {
 const legacy={kind:'start',label:'Start · legacy receipt'};
 if(typeof hex!=='string'||! /^(?:0x)?[a-f0-9]{32}$/i.test(hex))return legacy;
 const bytes=Uint8Array.from(hex.replace(/^0x/i,'').match(/../g),v=>parseInt(v,16));
 if(bytes[0]!==0x58||bytes[1]!==0x4d)return legacy;
 if(bytes[2]!==1)return {kind:'unknown',label:'Unknown receipt format'};
 const view=new DataView(bytes.buffer),v=view.getUint16(4),seconds=view.getUint16(7),threshold=bytes[9];
 const platform={1:'macOS',2:'Windows',3:'Linux',4:'Local/dev'}[bytes[3]];
 if(!platform||!(bytes[6]&1)||(bytes[6]&~7)||threshold<1||threshold>30||seconds<threshold||Boolean(bytes[6]&4)!==(threshold<30))return {kind:'unknown',label:'Invalid listen receipt'};
 const version=`${Math.floor(v/10000)}.${Math.floor(v%10000/100)}.${v%100}`;
 return {kind:'listen',platform,version,audibleSeconds:seconds,threshold,unknownDuration:Boolean(bytes[6]&2),label:`Listen · ${seconds} s · ${platform} ${version}`};
}
export function uniqueListenReceipt(details,existing,randomBytes) {
 const used=new Set(existing.map(e=>e.receipt));
 for(let attempt=0;attempt<100;attempt++){const receipt=encodeListenReceipt(details,randomBytes(6));if(!used.has(receipt))return receipt;}
 throw Error('Could not create a unique listen receipt');
}
