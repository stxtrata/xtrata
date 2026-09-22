import {randomBytes} from 'node:crypto';
const hex=()=>randomBytes(16).toString('hex');
const validId=v=>typeof v==='string'&&/^[a-f0-9]{32}$/.test(v);
// All authorisation is in memory. Restart revokes every website connection.
export class MusicWebBridge {
 constructor(wizard,listening,media){this.wizard=wizard;this.listening=listening;this.media=media;this.connections=new Map();this.pending=new Map();this.preparing=false;this.timer=setInterval(()=>this.expire(),5000);this.timer.unref?.();}
 close(){clearInterval(this.timer);for(const c of this.connections.values())this.stop(c);}
 stop(c){if(c.approval&&this.listening.active?.token===c.approval.token)this.listening.disable();c.approval=null;}
 expire(){const now=Date.now();for(const [id,p] of this.pending)if(p.expires<now)this.pending.delete(id);for(const [id,c] of this.connections)if(c.expires<now||c.lastSeen<now-120000){this.stop(c);this.connections.delete(id);}}
 extension(origin){if(!/^chrome-extension:\/\/[a-p]{32}$/.test(origin||''))throw Error('Use the Xtrata Music extension.');return origin;}
 connection(origin,token){this.expire();const c=this.connections.get(token);if(!c||c.origin!==origin)throw Error('Reconnect and approve in your local companion.');c.lastSeen=Date.now();return c;}
 review(id){this.expire();const p=this.pending.get(id);if(!p)throw Error('Request expired. Return to the website and try again.');return {id,kind:p.kind,origin:'https://xtrata.xyz',extension:p.origin.slice(19),fee:p.fee,expires:p.expires};}
 async approve(id){const p=this.pending.get(id);this.review(id);if(p.kind==='approved')return {approved:true};if(p.busy)throw Error('Approval already running.');p.busy=true;
 try{if(p.kind==='pair'){const token=hex();this.connections.set(token,{origin:p.origin,expires:Date.now()+12*3600000,lastSeen:Date.now(),tab:hex(),approval:null,starts:new Map()});p.result={token};}
 else{const c=this.connection(p.origin,p.token);const a=await this.listening.enable({continuous:true,fee:p.fee,max:1,minutes:30,tab:c.tab});if(this.connections.get(p.token)!==c||this.pending.get(id)!==p){if(this.listening.active?.token===a.token)this.listening.disable();throw Error('Connection expired.');}c.approval={token:a.token,tab:c.tab};p.result={approved:true};}
 p.kind='approved';return {approved:true};}finally{p.busy=false;}}
 async call(origin,data){this.extension(origin);this.expire();if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid bridge request.');
 const {method}=data;const keys={pair:[['method']],poll:[['method','id']],status:[['method','token']],setup:[['method','token']],support:[['method','token','fee']],start:[['method','token','id','song'],['method','token','id','song','duration']],stop:[['method','token']],disconnect:[['method','token']]};
 if(!keys[method]||!keys[method].some(allowed=>Object.keys(data).sort().join()===allowed.sort().join()))throw Error('Unsupported bridge request.');
 if(method==='pair'){if(this.pending.size>=20)throw Error('Too many pending connections.');const id=hex();this.pending.set(id,{kind:'pair',origin,expires:Date.now()+120000});return {id,review:true};}
 if(method==='poll'){const p=this.pending.get(data.id);if(!p||p.origin!==origin)throw Error('Approval expired.');return p.result||{pending:true};}
 if(!validId(data.token))throw Error('Invalid connection.');const c=this.connection(origin,data.token);
 if(method==='setup')return this.wizard.setup();
 if(method==='stop'||method==='disconnect'){this.stop(c);for(const [id,p] of this.pending)if(p.token===data.token)this.pending.delete(id);if(method==='disconnect')this.connections.delete(data.token);return {enabled:false};}
 if(method==='support'){if(!Number.isInteger(data.fee)||data.fee<1||data.fee>1000)throw Error('Choose a fixed fee of 1–1000 microSTX.');if(this.pending.size>=20)throw Error('Too many pending approvals.');const id=hex();this.pending.set(id,{kind:'support',origin,token:data.token,fee:data.fee,expires:Date.now()+120000});return {id,review:true};}
 if(method==='status'){const vault=await this.wizard.optional('vault.json',null);const s=vault?await this.wizard.status(true):{address:null,balanceMicroSTX:null,entries:[]};this.listening.snapshot();const enabled=!!c.approval&&this.listening.active?.token===c.approval.token;return {address:s.address,balanceMicroSTX:s.balanceMicroSTX,enabled,fee:enabled?this.listening.active.fee:null,waiting:!!s.running||!!s.recovery,entries:(s.entries||[]).slice(-50).map(e=>({song:e.song,title:e.title,artist:e.artist,status:e.status,failureStatus:e.failureStatus,recipient:e.recipient,txid:e.confirmedTxid||e.failedTxid||e.txid,fee:e.actualFee??e.fee}))};}
 if(!validId(data.id)||!Number.isSafeInteger(data.song)||data.song<0)throw Error('Invalid start.');
 if(!c.approval||this.listening.active?.token!==c.approval.token)throw Error('Music support is off.');
 if(c.starts.has(data.id))return c.starts.get(data.id);if(c.starts.size>=10000)throw Error('Reconnect to begin another listening session.');const outcome={outcome:'free',reason:'This start was already checked; it will not be charged again.'};c.starts.set(data.id,outcome);
 if(this.preparing||this.wizard.running)return {outcome:'free',reason:'Previous payment is still being checked. This start stays free.'};
 this.preparing=true;const approval=c.approval;
 try{await this.media.audio(data.song);this.connection(origin,data.token);if(c.approval!==approval)throw Error('Support stopped.');const result=await this.listening.start({...approval,id:data.id,song:data.song});c.starts.set(data.id,result);return result;}finally{this.preparing=false;}
 }
}
