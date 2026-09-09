import {insist,MAX_BYTES} from './protocol';
// Manual, non-trickle signaling. No application signaling server or referee.
export class Peer {
  pc:RTCPeerConnection; channel?:RTCDataChannel;
  private buffer='';private length=-1;private queue=Promise.resolve();
  constructor(iceServers:RTCIceServer[],private receive:(text:string)=>void,private status:(text:string)=>void,private opened:()=>void){
    this.pc=new RTCPeerConnection({iceServers});
    this.pc.ondatachannel=e=>this.attach(e.channel);
    this.pc.onconnectionstatechange=()=>status('Peer connection: '+this.pc.connectionState);
  }
  private attach(c:RTCDataChannel){
    insist(!this.channel,'Duplicate data channel');this.channel=c;
    c.onopen=()=>{this.status('Peer connected. Signed records synchronize automatically.');this.opened();};
    c.onclose=()=>this.status('Peer disconnected. Saved records remain available.');
    c.onmessage=e=>{try{
      insist(typeof e.data==='string' && e.data.length<=13000,'Oversized peer frame');
      const f=JSON.parse(e.data);
      if(f.type==='start'){insist(this.length===-1 && Number.isInteger(f.length) && f.length>0 && f.length<=MAX_BYTES,'Invalid record size');this.length=f.length;this.buffer='';}
      else if(f.type==='part'){insist(this.length>=0 && typeof f.data==='string' && this.buffer.length+f.data.length<=this.length,'Invalid record chunk');this.buffer+=f.data;}
      else if(f.type==='end'){insist(this.length>=0 && this.buffer.length===this.length,'Incomplete record');const text=this.buffer;this.buffer='';this.length=-1;this.receive(text);}
      else throw Error('Unknown peer frame');
    }catch(e){this.status('Peer message rejected: '+(e as Error).message);this.close();}};
  }
  private async gather(){
    if(this.pc.iceGatheringState==='complete')return;
    await new Promise<void>((resolve,reject)=>{
      const cleanup=()=>{clearTimeout(timer);this.pc.removeEventListener('icegatheringstatechange',check);};
      const check=()=>{if(this.pc.iceGatheringState==='complete'){cleanup();resolve();}};
      const timer=setTimeout(()=>{cleanup();reject(Error('ICE gathering timed out. Change networking settings and try again.'));},20000);
      this.pc.addEventListener('icegatheringstatechange',check);check();
    });
  }
  async offer(){this.attach(this.pc.createDataChannel('xchess-peer',{ordered:true}));await this.pc.setLocalDescription(await this.pc.createOffer());await this.gather();return this.pc.localDescription;}
  async answer(sdp:RTCSessionDescriptionInit){insist(sdp.type==='offer','Expected connection invitation');await this.pc.setRemoteDescription(sdp);await this.pc.setLocalDescription(await this.pc.createAnswer());await this.gather();return this.pc.localDescription;}
  async finish(sdp:RTCSessionDescriptionInit){insist(sdp.type==='answer','Expected connection response');await this.pc.setRemoteDescription(sdp);}
  send(text:string):Promise<void>{
    const job=async()=>{
      insist(text.length<=MAX_BYTES,'Record too large');const c=this.channel;insist(c?.readyState==='open','Not connected; export the saved record instead');
      const frame=async(f:any)=>{const start=Date.now();while(c.bufferedAmount>128000){insist(c.readyState==='open' && Date.now()-start<10000,'Peer send stalled');await new Promise(r=>setTimeout(r,25));}c.send(JSON.stringify(f));};
      await frame({type:'start',length:text.length});for(let i=0;i<text.length;i+=6000)await frame({type:'part',data:text.slice(i,i+6000)});await frame({type:'end'});
    };
    const result=this.queue.then(job);this.queue=result.catch(()=>{});return result;
  }
  close(){this.channel?.close();this.pc.close();}
}
