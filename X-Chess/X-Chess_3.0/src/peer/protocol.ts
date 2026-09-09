import {Position, WHITE} from './chess/engine';
export const FORMAT = 'xchess-peer-v1';
export const RULES = 'standard-v2-engine-snapshot-1';
export const MAX_BYTES = 2_000_000, MAX_EVENTS = 2048;
export type Side = 'white'|'black';
export type Opening = {protocol:string; rules:string; network:string; registry:string; game:number;
  white:string; black:string; whiteKey:string; blackKey:string; baseMs:number; incrementMs:number; joinedHeight:number};
export type Action = {domain:string; match:string; seq:number; prev:string; side:Side;
  kind:'move'|'resign'|'offer-draw'|'accept-draw'; move:string; fen:string};
export type Packet = {action:Action; signature:string};
export type Archive = {format:string; opening:Opening; events:Packet[]};
export type Key = {public:string; secret:CryptoKey};
export function insist(v:unknown, message:string):asserts v {if(!v)throw Error(message);}
export function exact(v:any, names:string[]) {insist(v && Object.getPrototypeOf(v)===Object.prototype && Object.keys(v).sort().join('|')===names.sort().join('|'),'Unexpected fields');}
export function canonical(v:any):string {
  if(v===null || typeof v==='boolean' || typeof v==='string')return JSON.stringify(v);
  if(typeof v==='number'){insist(Number.isSafeInteger(v),'Invalid number');return String(v);}
  if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';
  insist(v && Object.getPrototypeOf(v)===Object.prototype,'Invalid canonical value');
  return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
}
export const hex=(v:ArrayBuffer|Uint8Array)=>Array.from(v instanceof Uint8Array?v:new Uint8Array(v),n=>n.toString(16).padStart(2,'0')).join('');
export function bytes(v:string){insist(typeof v==='string' && /^(?:[0-9a-f]{2})*$/.test(v),'Invalid hex');return Uint8Array.from(v.match(/../g)??[],x=>parseInt(x,16));}
const utf8=(v:any)=>new TextEncoder().encode(canonical(v));
export async function hash(v:any){return hex(await crypto.subtle.digest('SHA-256',utf8(v)));}
export async function generateKey():Promise<Key>{
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
  return {public:hex(await crypto.subtle.exportKey('raw',pair.publicKey)),secret:pair.privateKey};
}
async function publicKey(k:string){insist(/^04[0-9a-f]{128}$/.test(k),'Invalid game key');return crypto.subtle.importKey('raw',bytes(k),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);}
export async function sign(action:Action,key:Key):Promise<Packet>{return {action,signature:hex(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key.secret,utf8(action)))};}
export async function checkOpening(o:Opening){
  exact(o,['protocol','rules','network','registry','game','white','black','whiteKey','blackKey','baseMs','incrementMs','joinedHeight']);
  insist(o.protocol===FORMAT && o.rules===RULES,'Unsupported rules');
  insist(['devnet','testnet','mainnet'].includes(o.network),'Invalid network');
  insist(typeof o.registry==='string' && /^S[0-9A-Z]+\.[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(o.registry),'Invalid registry');
  insist(typeof o.white==='string' && typeof o.black==='string' && /^S[0-9A-Z]+$/.test(o.white) && /^S[0-9A-Z]+$/.test(o.black) && o.white!==o.black,'Invalid players');
  for(const n of [o.game,o.joinedHeight])insist(Number.isSafeInteger(n) && n>0,'Invalid chain reference');
  insist(Number.isSafeInteger(o.baseMs) && (o.baseMs===0 || o.baseMs>=60000) && o.baseMs<=86400000,'Invalid base clock');
  insist(Number.isSafeInteger(o.incrementMs) && o.incrementMs>=0 && o.incrementMs<=60000 && (o.baseMs>0 || o.incrementMs===0),'Invalid increment');
  insist(o.whiteKey!==o.blackKey,'Players must use distinct keys');
  await Promise.all([publicKey(o.whiteKey),publicKey(o.blackKey)]);
}
export function parseArchive(text:string):Archive {insist(new TextEncoder().encode(text).length<=MAX_BYTES,'Record too large');return JSON.parse(text);}
export async function replay(archive:Archive, trusted:Opening){
  exact(archive,['format','opening','events']); await checkOpening(trusted);
  insist(archive.format===FORMAT && canonical(archive.opening)===canonical(trusted),'Record does not match on-chain opening');
  insist(Array.isArray(archive.events) && archive.events.length<=MAX_EVENTS && utf8(archive).length<=MAX_BYTES,'Record too large');
  const match=await hash(trusted), position=new Position(); let root=match;
  let outcome:{result:string;termination:string;winner:string|null}|null=null;
  let offer:Side|null=null;
  for(let i=0;i<archive.events.length;i++){
    insist(!outcome,'Action after game ended');
    const packet=archive.events[i];exact(packet,['action','signature']);const a=packet.action;
    exact(a,['domain','match','seq','prev','side','kind','move','fen']);
    insist(a.domain===FORMAT && a.match===match && a.seq===i+1 && a.prev===root,'Broken game history');
    insist(a.side===(position.turn===WHITE?'white':'black'),'Wrong player turn');
    insist(['move','resign','offer-draw','accept-draw'].includes(a.kind) && typeof a.move==='string' && typeof a.fen==='string','Invalid action');
    insist(typeof packet.signature==='string' && /^[0-9a-f]{128}$/.test(packet.signature),'Invalid signature');
    insist(await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},await publicKey(trusted[a.side==='white'?'whiteKey':'blackKey']),bytes(packet.signature),utf8(a)),'Invalid signature');
    if(a.kind==='move'){
      insist(/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(a.move) && position.applyUci(a.move),'Illegal move');
      // A draw offer accompanies the offerer's next move, and expires on the reply.
      if(offer!==a.side)offer=null;
      outcome=position.outcome();
    } else {
      insist(a.move==='','Non-move contains a move');
      if(a.kind==='resign')outcome={result:a.side==='white'?'0-1':'1-0',termination:'resignation',winner:a.side==='white'?'black':'white'};
      if(a.kind==='offer-draw'){insist(offer!==a.side,'Draw already offered');offer=a.side;}
      if(a.kind==='accept-draw'){insist(offer!==null && offer!==a.side,'No opponent draw offer');outcome={result:'1/2-1/2',termination:'agreement',winner:null};}
    }
    insist(a.fen===position.fen(),'Incorrect resulting board');
    // Hash content, not randomized ECDSA signature bytes.
    root=await hash(a);
  }
  return {match,root,position,outcome,offer,seq:archive.events.length};
}
export async function actionFor(archive:Archive,trusted:Opening,kind:Action['kind'],move=''):Promise<Action>{
  const s=await replay(archive,trusted);insist(!s.outcome,'Game already ended');
  const side=s.position.turn===WHITE?'white':'black';
  if(kind==='move')insist(s.position.applyUci(move),'Illegal move');
  return {domain:FORMAT,match:s.match,seq:s.seq+1,prev:s.root,side,kind,move,fen:s.position.fen()};
}
export async function completed(archive:Archive,trusted:Opening){const s=await replay(archive,trusted);insist(s.outcome,'Unfinished game: no independently verifiable result');return {...s,archiveHash:await hash(archive)};}
// Prefix merging is idempotent. A competing signed branch is evidence, never an automatic replacement.
export async function merge(local:Archive,incoming:Archive,trusted:Opening):Promise<Archive>{
  await replay(incoming,trusted);await replay(local,trusted);
  for(let i=0;i<Math.min(local.events.length,incoming.events.length);i++)
    insist(canonical(local.events[i].action)===canonical(incoming.events[i].action),'Conflicting signed branch: preserve both records for review');
  return incoming.events.length>local.events.length?incoming:local;
}
