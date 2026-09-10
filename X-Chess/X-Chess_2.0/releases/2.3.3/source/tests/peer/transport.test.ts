import {describe,it,expect,vi,afterEach} from 'vitest';
import {PeerTransport,iceServers} from '../../packages/peer/transport.js';
import {generateKey,canonical,hash,sign} from '../../packages/peer/crypto.js';
import {descriptor,PROTOCOL} from '../../packages/peer/protocol.js';
import type {Opening} from '../../packages/peer/protocol.js';
import {toBase64} from '../../packages/peer/store.js';
class Channel extends EventTarget {
  label=PROTOCOL;ordered=true;maxRetransmits=null;maxPacketLifeTime=null;readyState='open';bufferedAmount=0;bufferedAmountLowThreshold=0;
  onopen:any;onclose:any;onerror:any;onmessage:any;sent:string[]=[];
  close(){this.readyState='closed';this.onclose?.();}send(s:string){this.sent.push(s);}
}
class PC extends EventTarget {
  static all:PC[]=[];channel=new Channel();iceGatheringState='complete';signalingState='have-local-offer';connectionState='new';localDescription:any;ondatachannel:any;onconnectionstatechange:any;
  constructor(public config:RTCConfiguration){super();PC.all.push(this);}createDataChannel(){return this.channel;}async createOffer(){return {type:'offer',sdp:'test-sdp'};}async createAnswer(){return {type:'answer',sdp:'test-answer'};}async setLocalDescription(d:any){this.localDescription=d;}async setRemoteDescription(){this.signalingState='stable';}close(){this.channel.close();}
}
const live:PeerTransport[]=[];
afterEach(()=>{for(const t of live)t.close();live.length=0;PC.all=[];vi.unstubAllGlobals();vi.useRealTimers();});
async function setup(){
  vi.stubGlobal('RTCPeerConnection',PC);const white=await generateKey(),black=await generateKey();
  const opening:Opening={kind:'demo',network:'local',registry:'local-demo',game:1,descriptor:descriptor(),white:{address:'Demo white',key:white.public},black:{address:'Demo black',key:black.public}};
  const messages=vi.fn(async(_text:string)=>{}),status=vi.fn(),opened=vi.fn();const a=new PeerTransport(opening,'white',white,messages,status,opened),b=new PeerTransport(opening,'black',black,messages,status,opened);live.push(a,b);
  return {a,b,opening,white,black,messages,status,opened};
}
const packet=(text:string,index=0,total=1)=>JSON.stringify({protocol:'xchess-peer-packet-v1',id:'ab'.repeat(16),digest:hash(text),index,total,data:toBase64(new TextEncoder().encode(text))});
describe('bounded authenticated peer transport',()=>{
  it('has no default ICE service and rejects unusable connection aids',()=>{
    expect(iceServers({})).toEqual([]);expect(()=>iceServers({stun:'https://server'})).toThrow();expect(()=>iceServers({turn:'turn:relay:3478'})).toThrow('credentials');expect(iceServers({stun:'stun:host:3478'})).toEqual([{urls:'stun:host:3478'}]);
  });
  it('signs offer/answer for the joined match and rejects reused answers',async()=>{
    const f=await setup(),offer=await f.a.offer(),answer=await f.b.answer(canonical(offer));expect(PC.all[0].config.iceServers).toEqual([]);await f.a.acceptAnswer(canonical(answer));await expect(f.a.acceptAnswer(canonical(answer))).rejects.toThrow('already');
  });
  it('rejects tampered, wrong-match and stale signed connection descriptions',async()=>{
    const f=await setup(),offer=await f.a.offer(),answer=await f.b.answer(canonical(offer));answer.payload.sdp+='forged';await expect(f.a.acceptAnswer(canonical(answer))).rejects.toThrow('Signature');
    const wrong={...offer.payload,match:'ff'.repeat(32)};await expect(f.b.answer(canonical(await sign(wrong,f.white.secret)))).rejects.toThrow('another match');
    const good=await f.b.answer(canonical(offer));await f.a.offer();await expect(f.a.acceptAnswer(canonical(good))).rejects.toThrow('stale');
  });
  it('rejects simultaneous channels and ignores obsolete channel callbacks',async()=>{
    const f=await setup();await f.a.offer();const old=PC.all[0],extra=new Channel();old.ondatachannel({channel:extra});expect(extra.readyState).toBe('closed');await f.a.offer();old.channel.onmessage({data:packet('stale')});old.channel.onopen();expect(f.messages).not.toHaveBeenCalled();expect(f.opened).not.toHaveBeenCalled();
  });
  it('chunks and reassembles a large Unicode transcript without server transport',async()=>{
    const f=await setup();await f.a.offer();await f.b.offer();const a=PC.all[0].channel,b=PC.all[1].channel,text='♟'.repeat(20000);await f.a.send(text);expect(a.sent.length).toBeGreaterThan(1);for(const data of a.sent)b.onmessage({data});await Promise.resolve();expect(f.messages).toHaveBeenCalledWith(text);
  });
  it.each(['out-of-order','oversized','hash mismatch','unknown field'])('rejects %s without delivering an application message',async kind=>{
    const f=await setup();await f.a.offer();const c=PC.all[0].channel;let data=packet('hello');if(kind==='out-of-order')data=packet('hello',1,2);if(kind==='oversized')data='x'.repeat(18001);if(kind==='hash mismatch')data=data.replace(hash('hello'),'00'.repeat(32));if(kind==='unknown field'){const p=JSON.parse(data);p.extra=true;data=JSON.stringify(p);}c.onmessage({data});expect(f.messages).not.toHaveBeenCalled();expect(c.readyState).toBe('closed');expect(f.status).toHaveBeenLastCalledWith(expect.stringContaining('rejected'));
  });
  it('expires incomplete messages and permits a fresh complete message',async()=>{
    const f=await setup();await f.a.offer();vi.useFakeTimers();const c=PC.all[0].channel;c.onmessage({data:packet('partial',0,2)});await vi.advanceTimersByTimeAsync(20001);expect(f.status).toHaveBeenLastCalledWith(expect.stringContaining('Incomplete'));c.onmessage({data:packet('complete')});expect(f.messages).toHaveBeenCalledWith('complete');
  });
  it('bounds the import queue while signature validation is busy',async()=>{
    const f=await setup();await f.a.offer();let finish!:()=>void;f.messages.mockImplementation(()=>new Promise<void>(r=>{finish=r;}));const c=PC.all[0].channel;for(let n=0;n<3;n++)c.onmessage({data:packet('message'+n)});expect(f.messages).toHaveBeenCalledTimes(2);expect(c.readyState).toBe('closed');finish();
  });
  it('reports unavailable WebRTC and negotiation failure without inventing a result',async()=>{
    const f=await setup();vi.stubGlobal('RTCPeerConnection',undefined);await expect(f.a.offer()).rejects.toThrow('Exchange signed messages');vi.stubGlobal('RTCPeerConnection',PC);await f.a.offer();PC.all[0].channel.readyState='connecting';vi.useFakeTimers();await f.a.offer();PC.all[1].channel.readyState='connecting';await vi.advanceTimersByTimeAsync(60001);expect(f.status).toHaveBeenLastCalledWith(expect.stringContaining('No direct route'));expect(f.messages).not.toHaveBeenCalled();
  });
});
