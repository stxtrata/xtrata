import { check, integer, hash, same, sign, verify, randomHex, parseBounded } from './crypto.js';
import type { GameKey, Signed } from './crypto.js';
import { PROTOCOL, MAX_BYTES } from './protocol.js';
import type { Opening, Side } from './protocol.js';
import { toBase64, fromBase64 } from './store.js';
interface Connection { protocol:'xchess-peer-connection-v1';match:string;actor:Side;kind:'offer'|'answer';nonce:string;replyTo:string|null;sdp:string }
interface Packet { protocol:'xchess-peer-packet-v1';id:string;digest:string;index:number;total:number;data:string }
export interface NetworkOptions { stun?:string;turn?:string;username?:string;credential?:string }
export function iceServers(options:NetworkOptions):RTCIceServer[] {
  const servers:RTCIceServer[]=[];
  if(options.stun) {check(/^stuns?:[^\s/?#]+(?::[0-9]+)?$/.test(options.stun),'Use a stun: or stuns: server address');servers.push({urls:options.stun});}
  if(options.turn) {check(/^turns?:[^\s/?#]+(?:\?transport=(?:udp|tcp))?$/.test(options.turn),'Use a turn: or turns: server address');check(options.username&&options.credential,'TURN needs the relay account credentials');servers.push({urls:options.turn,username:options.username,credential:options.credential});}
  return servers;
}
export class PeerTransport {
  private pc:RTCPeerConnection|null=null;
  private channel:RTCDataChannel|null=null;
  private epoch=0;
  private offerNonce:string|null=null;
  private negotiationTimer:ReturnType<typeof setTimeout>|null=null;
  private assembly:{id:string;digest:string;total:number;parts:Uint8Array[];size:number;timer:ReturnType<typeof setTimeout>}|null=null;
  private windowAt=0;private packets=0;private pending=0;
  private sendQueue:Promise<void>=Promise.resolve();
  constructor(private opening:Opening,private actor:Side,private key:GameKey,private onMessage:(text:string)=>Promise<void>,private onStatus:(text:string)=>void,private onOpen:()=>void) {
    check(key.public===opening[actor].key,'The connection key is not registered for this player');
  }
  get connected():boolean {return this.channel?.readyState==='open';}
  close():void {
    this.epoch++;this.channel?.close();this.pc?.close();this.channel=null;this.pc=null;this.offerNonce=null;
    if(this.negotiationTimer)clearTimeout(this.negotiationTimer);if(this.assembly)clearTimeout(this.assembly.timer);this.assembly=null;
  }
  private create(options:NetworkOptions):{pc:RTCPeerConnection;epoch:number} {
    this.close();check(typeof RTCPeerConnection==='function','WebRTC is unavailable. Exchange signed messages below instead.');
    const pc=new RTCPeerConnection({iceServers:iceServers(options)}),epoch=this.epoch;this.pc=pc;
    pc.onconnectionstatechange=()=>{if(epoch!==this.epoch)return;this.onStatus(pc.connectionState==='connected'?'Direct peer connection active':`${pc.connectionState}. Signed-message exchange remains available.`);};
    pc.ondatachannel=e=>{if(epoch!==this.epoch){e.channel.close();return;}this.attach(e.channel,epoch);};
    this.negotiationTimer=setTimeout(()=>{if(epoch===this.epoch&&!this.connected){this.close();this.onStatus('No direct route established. Try fresh descriptions, optional connection aids, or signed-message exchange.');}},60000);
    return {pc,epoch};
  }
  private attach(channel:RTCDataChannel,epoch:number):void {
    if(this.channel||channel.label!==PROTOCOL||!channel.ordered||channel.maxRetransmits!==null||channel.maxPacketLifeTime!==null){channel.close();this.onStatus('Duplicate or unreliable channel rejected');return;}
    this.channel=channel;channel.bufferedAmountLowThreshold=65536;
    channel.onopen=()=>{if(epoch!==this.epoch)return;if(this.negotiationTimer)clearTimeout(this.negotiationTimer);this.onStatus('Direct peer connection active');this.onOpen();};
    channel.onclose=()=>{if(epoch===this.epoch)this.onStatus('Peer disconnected. Your signed history is saved; reconnect or exchange messages.');};
    channel.onerror=()=>{if(epoch===this.epoch)this.onStatus('Connection error. Use signed-message exchange.');};
    channel.onmessage=e=>{
      if(epoch!==this.epoch)return;
      try{this.receivePacket(e.data,epoch);}catch(error){this.close();this.onStatus(`Connection message rejected: ${error instanceof Error?error.message:error}. Saved history is unchanged.`);}
    };
  }
  private async gathered(pc:RTCPeerConnection,epoch:number):Promise<string> {
    if(pc.iceGatheringState!=='complete')await new Promise<void>((resolve,reject)=>{
      const timer=setTimeout(()=>{pc.removeEventListener('icegatheringstatechange',change);reject(Error('ICE gathering timed out. Use manual signed messages or try another connection configuration.'));},15000);
      const change=()=>{if(pc.iceGatheringState==='complete'){clearTimeout(timer);pc.removeEventListener('icegatheringstatechange',change);resolve();}};
      pc.addEventListener('icegatheringstatechange',change);change();
    });
    check(epoch===this.epoch&&pc.localDescription?.sdp,'Connection was replaced');return pc.localDescription.sdp;
  }
  async offer(options:NetworkOptions={}):Promise<Signed<Connection>> {
    const {pc,epoch}=this.create(options);this.attach(pc.createDataChannel(PROTOCOL,{ordered:true}),epoch);
    await pc.setLocalDescription(await pc.createOffer());const sdp=await this.gathered(pc,epoch);this.offerNonce=randomHex();
    return sign({protocol:'xchess-peer-connection-v1',match:hash(this.opening),actor:this.actor,kind:'offer',nonce:this.offerNonce,replyTo:null,sdp},this.key.secret);
  }
  private async connection(text:string,kind:'offer'|'answer'):Promise<Connection> {
    const signed=parseBounded(text,100000) as Signed<Connection>,p=signed?.payload;
    check(p&&p.protocol==='xchess-peer-connection-v1'&&p.kind===kind&&p.actor!==this.actor&&(p.actor==='white'||p.actor==='black'),'Wrong connection description');
    same(p,{protocol:'xchess-peer-connection-v1',match:hash(this.opening),actor:p.actor,kind,nonce:p.nonce,replyTo:p.replyTo,sdp:p.sdp},'Connection belongs to another match');
    check(/^[0-9a-f]{64}$/.test(p.nonce)&&(p.replyTo===null||/^[0-9a-f]{64}$/.test(p.replyTo))&&typeof p.sdp==='string'&&p.sdp.length<80000,'Invalid connection fields');
    if(kind==='offer')check(p.replyTo===null,'Invalid offer');await verify(signed,this.opening[p.actor].key);return p;
  }
  async answer(text:string,options:NetworkOptions={}):Promise<Signed<Connection>> {
    const offer=await this.connection(text,'offer');const {pc,epoch}=this.create(options);
    await pc.setRemoteDescription({type:'offer',sdp:offer.sdp});await pc.setLocalDescription(await pc.createAnswer());
    const sdp=await this.gathered(pc,epoch);
    return sign({protocol:'xchess-peer-connection-v1',match:hash(this.opening),actor:this.actor,kind:'answer',nonce:randomHex(),replyTo:offer.nonce,sdp},this.key.secret);
  }
  async acceptAnswer(text:string):Promise<void> {
    const answer=await this.connection(text,'answer');check(this.pc&&this.offerNonce&&answer.replyTo===this.offerNonce,'Answer is stale or belongs to a different offer');
    check(this.pc.signalingState==='have-local-offer','This offer has already been answered');await this.pc.setRemoteDescription({type:'answer',sdp:answer.sdp});
  }
  send(text:string):Promise<void> {
    const epoch=this.epoch;
    const task=this.sendQueue.catch(()=>{}).then(async()=>{
      const data=new TextEncoder().encode(text);check(data.length<=MAX_BYTES,'Message too large for peer transport');
      check(this.connected,'No direct connection; export the signed message instead');const channel=this.channel!;
      const id=randomHex(16),digest=hash(text),total=Math.ceil(data.length/12288);check(total>0,'Empty message');
      for(let index=0;index<total;index++) {
        check(epoch===this.epoch&&channel.readyState==='open','Connection closed; your signed move remains saved');
        if(channel.bufferedAmount>262144)await new Promise<void>((resolve,reject)=>{
          const timer=setTimeout(()=>{channel.removeEventListener('bufferedamountlow',low);reject(Error('Peer send stalled; use signed-message exchange'));},5000);
          const low=()=>{clearTimeout(timer);channel.removeEventListener('bufferedamountlow',low);resolve();};channel.addEventListener('bufferedamountlow',low);
        });
        const packet:Packet={protocol:'xchess-peer-packet-v1',id,digest,index,total,data:toBase64(data.subarray(index*12288,(index+1)*12288))};
        check(epoch===this.epoch&&channel.readyState==='open','Connection closed; your signed move remains saved');
        channel.send(JSON.stringify(packet));
      }
    });this.sendQueue=task;return task;
  }
  private receivePacket(text:unknown,epoch:number):void {
    check(typeof text==='string'&&text.length<=18000,'Oversized or nontext packet');
    const now=Date.now();if(now-this.windowAt>10000){this.windowAt=now;this.packets=0;}check(++this.packets<=512,'Peer message rate exceeded');
    const p=parseBounded(text,18000) as Packet;
    check(p.protocol==='xchess-peer-packet-v1'&&/^[0-9a-f]{32}$/.test(p.id)&&/^[0-9a-f]{64}$/.test(p.digest)&&integer(p.total,1,163)&&integer(p.index,0,p.total-1),'Malformed peer packet');
    same(Object.keys(p).sort(),['protocol','id','digest','index','total','data'].sort(),'Unknown packet fields');
    if(!this.assembly) {
      check(p.index===0,'Out-of-order packet');
      this.assembly={id:p.id,digest:p.digest,total:p.total,parts:[],size:0,timer:setTimeout(()=>{if(epoch===this.epoch){this.assembly=null;this.onStatus('Incomplete peer message. Reconnect or import the saved signed message.');}},20000)};
    }
    const a=this.assembly;check(p.id===a.id&&p.digest===a.digest&&p.total===a.total&&p.index===a.parts.length,'Overlapping or out-of-order message');
    const part=fromBase64(p.data);check(part.length<=12288,'Oversized chunk');a.size+=part.length;check(a.size<=MAX_BYTES,'Peer transcript is too large');a.parts.push(part);
    if(a.parts.length===a.total) {
      clearTimeout(a.timer);this.assembly=null;const all=new Uint8Array(a.size);let offset=0;for(const part of a.parts){all.set(part,offset);offset+=part.length;}
      const message=new TextDecoder('utf-8',{fatal:true}).decode(all);check(hash(message)===a.digest,'Transport hash mismatch');check(this.pending<2,'Peer import queue is full');this.pending++;
      void this.onMessage(message).catch(e=>this.onStatus(`Signed message rejected: ${e instanceof Error?e.message:e}. Previous game preserved.`)).finally(()=>{this.pending--;});
    }
  }
}
