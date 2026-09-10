import { LiveChain } from '../chain/client.js';
import { serializeUint, serializeBuffer, serializeBool, serializePrincipal, bytesToHex, deserialize } from '../chain/clarity.js';
import type { ClarityJs, ClarityResponse } from '../chain/clarity.js';
import { check, integer, encode, parseBounded, hash, canonical } from './crypto.js';
import { checkDescriptor, checkOpening } from './protocol.js';
import type { Descriptor, Opening, Network } from './protocol.js';
export interface Invitation { game:number;creator:string;opponent:string;creatorWhite:boolean;creatorKey:string;opponentKey:string|null;descriptor:Descriptor;descriptorHash:string;openedHeight:number;joinedHeight:number }
const num=(v:ClarityJs):number=>{const n=Number(v);check(integer(n),'Invalid chain number');return n;};
const buf=(v:ClarityJs):Uint8Array=>{check(v instanceof Uint8Array,'Invalid chain buffer');return v;};
export function decodeInvitation(game:number,raw:ClarityJs):Invitation {
  check(raw&&typeof raw==='object'&&!Array.isArray(raw),'Peer game not found');const r=raw as Record<string,ClarityJs>;
  check(typeof r.creator==='string'&&typeof r.opponent==='string'&&typeof r['creator-white']==='boolean','Invalid registry identity');
  const text=new TextDecoder('utf-8',{fatal:true}).decode(buf(r.descriptor)),descriptor=parseBounded(text,1024) as Descriptor;checkDescriptor(descriptor);
  check(canonical(descriptor)===text&&hash(descriptor)===bytesToHex(buf(r['descriptor-hash'])),'Descriptor commitment mismatch');
  return {game,creator:r.creator,opponent:r.opponent,creatorWhite:r['creator-white'],creatorKey:bytesToHex(buf(r['creator-key'])),opponentKey:r['opponent-key']===null?null:bytesToHex(buf(r['opponent-key'])),descriptor,descriptorHash:hash(descriptor),openedHeight:num(r['opened-height']),joinedHeight:num(r['joined-height'])};
}
export function openingFrom(registry:string,network:Network,row:Invitation):Opening {
  check(row.opponentKey&&row.joinedHeight>0,'The invited opponent has not joined yet');
  const creator={address:row.creator,key:row.creatorKey},opponent={address:row.opponent,key:row.opponentKey};
  const opening:Opening={kind:'chain',registry,network,game:row.game,descriptor:row.descriptor,white:row.creatorWhite?creator:opponent,black:row.creatorWhite?opponent:creator};checkOpening(opening);return opening;
}
export function createArgs(opponent:string,white:boolean,key:string,descriptor:Descriptor):string[] {
  checkDescriptor(descriptor);const bytes=encode(descriptor);check(bytes.length<=1024,'Opening settings are too large');
  return [serializePrincipal(opponent),serializeBool(white),serializeBuffer(key),serializeBuffer(bytes)];
}
export const joinArgs=(row:Invitation,key:string):string[]=>[serializeUint(row.game),serializeBuffer(row.descriptorHash),serializeBuffer(key)];
export class PeerRegistry {
  readonly chain:LiveChain;
  constructor(readonly registry:string,readonly network:Network,api?:string) {
    const [contractAddress,contractName,...extra]=registry.split('.');serializePrincipal(contractAddress);check(!extra.length&&/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(contractName),'Enter a deployed peer registry contract');
    this.chain=new LiveChain({contractAddress,contractName,network,override:api});
  }
  async game(id:number):Promise<Invitation> {
    check(integer(id,1),'Invalid game number');check(await this.chain.callReadOnly('get-peer-format')===1n,'Unsupported peer registry');
    return decodeInvitation(id,await this.chain.callReadOnly('get-peer-game',[serializeUint(id)]));
  }
  async confirmed(id:number):Promise<Opening> {
    const row=await this.game(id),opening=openingFrom(this.registry,this.network,row);
    const res=await this.chain.reader.request('/v2/info');check(res.ok,'Unable to check confirmations');const tip=await res.json() as {stacks_tip_height?:number};
    check(integer(tip.stacks_tip_height)&&tip.stacks_tip_height>=row.joinedHeight+2,'Waiting for two additional registry confirmations');return opening;
  }
  async resolve(text:string):Promise<number> {
    if(/^[1-9][0-9]{0,14}$/.test(text))return Number(text);
    check(/^(0x)?[0-9a-fA-F]{64}$/.test(text),'Enter a peer game number or setup transaction ID');
    const response=await this.chain.reader.request('/extended/v1/tx/'+(text.startsWith('0x')?text:'0x'+text));check(response.ok,'Transaction is not available yet; do not resubmit automatically');
    const tx=await response.json() as {tx_status:string;tx_result?:{hex:string};contract_call?:{contract_id:string;function_name:string}};
    check(tx.tx_status==='success',`Setup transaction is ${tx.tx_status}; check your wallet before retrying`);
    check(tx.contract_call?.contract_id===this.registry&&['create-peer-game','join-peer-game'].includes(tx.contract_call.function_name),'This is not a setup transaction for this registry');
    const result=deserialize(tx.tx_result?.hex??'') as ClarityResponse;check(result.ok&&typeof result.value==='bigint','Invalid setup result');return num(result.value);
  }
}
