import { Position, START_FEN, WHITE } from '../chess/engine.js';
import type { Result } from '../chess/engine.js';
import { parseAddress } from '../chain/clarity.js';
import { check, integer, hash, same, pubValid, randomHex, sign, verify, publicKey } from './crypto.js';
import type { Signed, GameKey } from './crypto.js';
export const PROTOCOL = 'xchess-peer-v1';
export const ENGINE = 'xchess-engine-v1:2ce32043537e211ff09dec435ae8c9eec89d21e6e71a082fc4ed0a929668bd33';
export const RULES = 'xchess-automatic-draw-v1';
export const MAX_MOVES = 2048, MAX_BRANCHES = 8, MAX_BYTES = 2_000_000;
export type Side = 'white' | 'black';
export type Network = 'mainnet' | 'testnet' | 'devnet';
export interface Descriptor { protocol: typeof PROTOCOL; engine: typeof ENGINE; rules: typeof RULES; algorithm: 'P256-SHA256-raw-v1'; nonce: string; initialFen: string; clock: {baseMs: number; incrementMs: number} }
export function descriptor(baseMs = 0, incrementMs = 0): Descriptor {
  return {protocol:PROTOCOL,engine:ENGINE,rules:RULES,algorithm:'P256-SHA256-raw-v1',nonce:randomHex(),initialFen:START_FEN,clock:{baseMs,incrementMs}};
}
export interface Player { address: string; key: string }
export interface Opening { kind:'chain'|'demo'; network:Network|'local'; registry:string; game:number; descriptor:Descriptor; white:Player; black:Player }
export function checkDescriptor(d: Descriptor): void {
  check(d && d.protocol === PROTOCOL && d.engine === ENGINE && d.rules === RULES && d.algorithm === 'P256-SHA256-raw-v1', 'Unsupported peer protocol, engine or rules');
  check(/^[0-9a-f]{64}$/.test(d.nonce) && d.initialFen.length <= 100 && Position.tryFrom(d.initialFen), 'Invalid initial position or match nonce');
  check(d.clock && integer(d.clock.baseMs,0,86_400_000) && integer(d.clock.incrementMs,0,60_000) && (d.clock.baseMs > 0 || d.clock.incrementMs === 0), 'Invalid advisory clock');
  same(d,{protocol:PROTOCOL,engine:ENGINE,rules:RULES,algorithm:'P256-SHA256-raw-v1',nonce:d.nonce,initialFen:d.initialFen,clock:{baseMs:d.clock.baseMs,incrementMs:d.clock.incrementMs}},'Unknown descriptor fields');
}
export function checkOpening(o: Opening): void {
  check(o && (o.kind === 'chain' || o.kind === 'demo'), 'Invalid opening'); checkDescriptor(o.descriptor);
  check(integer(o.game,1), 'Invalid game number');
  for (const side of ['white','black'] as Side[]) {
    const p = o[side]; check(p && typeof p.address === 'string' && pubValid(p.key), 'Invalid player key');
    same(p,{address:p.address,key:p.key},'Unknown player fields');
    if (o.kind === 'chain') parseAddress(p.address);
  }
  check(o.white.key !== o.black.key && o.white.address !== o.black.address, 'Players must be distinct');
  if (o.kind === 'chain') {
    check(['mainnet','testnet','devnet'].includes(o.network), 'Invalid chain network');
    const [address,name,...rest] = o.registry.split('.'); parseAddress(address);
    check(!rest.length && /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(name), 'Invalid registry contract');
    for (const address of [o.white.address,o.black.address,o.registry.split('.')[0]]) check(o.network === 'mainnet' ? address.startsWith('SP') : address.startsWith('ST'), 'Address and network mismatch');
  } else same([o.network,o.registry,o.game,o.white.address,o.black.address],['local','local-demo',1,'Demo white','Demo black'],'Invalid local demo identity');
  same(Object.keys(o).sort(),['kind','network','registry','game','descriptor','white','black'].sort(),'Unknown opening fields');
}
export interface Move { protocol:typeof PROTOCOL; match:string; sequence:number; previousHash:string; actor:Side; kind:'move'; value:string; resultingPositionHash:string }
export interface Resignation { protocol:typeof PROTOCOL; match:string; actor:Side; kind:'resignation'; atSequence:number; atHash:string; resultingPositionHash:string }
export type Action = Move | Resignation;
export interface Line { moves:Signed<Move>[]; resignations:Signed<Resignation>[] }
export interface Game { opening:Opening; line:Line; branches:Line[] }
export interface Summary { status:'unfinished'|'finished'|'disputed'; root:string; fen:string; result:Result|'*'; termination:string|null }
export interface Archive extends Game { format:'xchess-peer-archive-v1'; final:Summary }
export interface Replay { position:Position; roots:string[]; fens:string[]; summary:Summary }
export const genesis = (o: Opening): string => hash([PROTOCOL+'/genesis',hash(o),o.descriptor.initialFen]);
export const actorTurn = (p: Position): Side => p.turn === WHITE ? 'white' : 'black';
export const emptyGame = (opening: Opening): Game => ({ opening, line:{moves:[],resignations:[]},branches:[] });
export async function replayLine(o: Opening, line: Line): Promise<Replay> {
  checkOpening(o);await Promise.all([publicKey(o.white.key),publicKey(o.black.key)]);
  check(line && Array.isArray(line.moves) && line.moves.length <= MAX_MOVES && Array.isArray(line.resignations) && line.resignations.length <= 8, 'Invalid or excessive game events');
  same(Object.keys(line).sort(),['moves','resignations'],'Unknown line fields');
  const match=hash(o), position=new Position(o.descriptor.initialFen), roots=[genesis(o)], fens=[position.fen()];
  const outcomes=[position.outcome()];
  for (let i=0;i<line.moves.length;i++) {
    const event=line.moves[i], p=event?.payload;
    check(p && p.kind === 'move' && (p.actor==='white'||p.actor==='black'), 'Invalid move event');
    check(actorTurn(position) === p.actor, 'Wrong player to move');
    await verify(event,o[p.actor].key);
    check(typeof p.value==='string' && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(p.value) && position.applyUci(p.value),'Illegal move');
    same(p,{protocol:PROTOCOL,match,sequence:i+1,previousHash:roots[i],actor:p.actor,kind:'move',value:p.value,resultingPositionHash:hash(position.fen())},'Move history commitment mismatch');
    roots.push(hash(p)); fens.push(position.fen()); outcomes.push(position.outcome());
  }
  const seen=new Set<string>();
  for (const signed of line.resignations) {
    const r=signed?.payload;
    check(r && (r.actor==='white'||r.actor==='black') && integer(r.atSequence,0,line.moves.length),'Invalid resignation');
    await verify(signed,o[r.actor].key);
    same(r,{protocol:PROTOCOL,match,actor:r.actor,kind:'resignation',atSequence:r.atSequence,atHash:roots[r.atSequence],resultingPositionHash:hash(fens[r.atSequence])},'Resignation commitment mismatch');
    check(!outcomes[r.atSequence], 'Resignation follows a terminal board');
    check(!seen.has(hash(r)),'Duplicate resignation'); seen.add(hash(r));
  }
  let result: Result|'*'=position.outcome()?.result ?? '*', termination:string|null=position.outcome()?.termination ?? null;
  let status:Summary['status']=result==='*'?'unfinished':'finished';
  if(line.resignations.length) {
    if(line.resignations.length>1 || line.resignations[0].payload.atSequence !== line.moves.length) { status='disputed';result='*';termination='concurrent-resignation-evidence'; }
    else { result=line.resignations[0].payload.actor==='white'?'0-1':'1-0';termination='resignation';status='finished'; }
  }
  return {position,roots,fens,summary:{status,root:roots.at(-1)!,fen:position.fen(),result,termination}};
}
export async function replay(game: Game): Promise<Replay> {
  check(game && Array.isArray(game.branches) && game.branches.length<=MAX_BRANCHES,'Too many conflicting branches');
  same(Object.keys(game).sort(),['opening','line','branches'].sort(),'Unknown game fields');
  check(game.line && [game.line,...game.branches].reduce((n,l)=>n+(Array.isArray(l?.moves)?l.moves.length:MAX_MOVES+1),0)<=MAX_MOVES,'Too many moves across the supplied branches');
  const main=await replayLine(game.opening,game.line);
  const seen=new Set([lineHash(game.line)]);
  for(const branch of game.branches) {
    await replayLine(game.opening,branch);
    check(!seen.has(lineHash(branch)) && divergent(game.line,branch),'Invalid duplicate or compatible branch'); seen.add(lineHash(branch));
  }
  if(game.branches.length) main.summary={...main.summary,status:'disputed',result:'*',termination:'conflicting-signed-branches'};
  return main;
}
export async function makeMove(game: Game, actor: Side, value: string): Promise<Move> {
  const r=await replay(game); check(r.summary.status==='unfinished','This game is finished or disputed');
  check(game.line.moves.length<MAX_MOVES,'Move limit reached; save the unfinished game');
  check(actorTurn(r.position)===actor && r.position.applyUci(value),'Illegal move or wrong turn');
  return {protocol:PROTOCOL,match:hash(game.opening),sequence:game.line.moves.length+1,previousHash:r.summary.root,actor,kind:'move',value,resultingPositionHash:hash(r.position.fen())};
}
export async function makeResignation(game: Game, actor: Side): Promise<Resignation> {
  const r=await replay(game); check(r.summary.status==='unfinished','This game is finished or disputed');
  return {protocol:PROTOCOL,match:hash(game.opening),actor,kind:'resignation',atSequence:game.line.moves.length,atHash:r.summary.root,resultingPositionHash:hash(r.position.fen())};
}
export const lineHash = (line:Line):string => hash([line.moves.map(m=>hash(m.payload)),line.resignations.map(r=>hash(r.payload)).sort()]);
export function divergent(a:Line,b:Line):boolean { return a.moves.slice(0,Math.min(a.moves.length,b.moves.length)).some((m,i)=>hash(m.payload)!==hash(b.moves[i].payload)); }
export async function merge(a:Game,b:Game):Promise<Game> {
  same(a.opening,b.opening,'Message belongs to another game'); await replay(a); await replay(b);
  const result=structuredClone(a);
  for(const incoming of [b.line,...b.branches]) {
    if(divergent(result.line,incoming)) {
      if(!result.branches.some(l=>lineHash(l)===lineHash(incoming))) result.branches.push(structuredClone(incoming));
    } else {
      const resignations=[...result.line.resignations,...incoming.resignations];
      const unique=new Map(resignations.map(r=>[hash(r.payload),r]));
      if(incoming.moves.length>result.line.moves.length) result.line.moves=structuredClone(incoming.moves);
      result.line.resignations=[...unique.values()];
    }
  }
  await replay(result); return result;
}
export async function archive(game:Game):Promise<Archive> { const r=await replay(game); return {...structuredClone(game),format:'xchess-peer-archive-v1',final:r.summary}; }
export async function verifyArchive(a:Archive, opening?:Opening):Promise<Replay> {
  check(a?.format==='xchess-peer-archive-v1','Unsupported archive format');
  same(Object.keys(a).sort(),['format','opening','line','branches','final'].sort(),'Unknown archive fields');
  if(opening) same(a.opening,opening,'Opening differs from chain record');
  const r=await replay({opening:a.opening,line:a.line,branches:a.branches}); same(a.final,r.summary,'Claimed result or final position does not match signed evidence'); return r;
}
export interface DemoInvite { format:'xchess-peer-demo-invite-v1'; descriptor:Descriptor; whiteKey:string }
export interface DemoJoin { format:'xchess-peer-demo-join-v1'; invite:Signed<DemoInvite>; blackKey:string }
export async function inviteDemo(d:Descriptor,key:GameKey):Promise<Signed<DemoInvite>> { checkDescriptor(d);return sign({format:'xchess-peer-demo-invite-v1',descriptor:d,whiteKey:key.public},key.secret); }
export async function verifyDemoInvite(invite:Signed<DemoInvite>):Promise<void> {
  check(invite?.payload?.format==='xchess-peer-demo-invite-v1','Invalid demo invitation'); checkDescriptor(invite.payload.descriptor);
  same(Object.keys(invite.payload).sort(),['format','descriptor','whiteKey'].sort(),'Unknown invitation fields'); await verify(invite,invite.payload.whiteKey);
}
export async function demoOpening(join:Signed<DemoJoin>):Promise<Opening> {
  check(join?.payload?.format==='xchess-peer-demo-join-v1','Invalid demo response');
  same(Object.keys(join.payload).sort(),['format','invite','blackKey'].sort(),'Unknown demo response fields');
  await verifyDemoInvite(join.payload.invite); await verify(join,join.payload.blackKey);
  const o:Opening={kind:'demo',network:'local',registry:'local-demo',game:1,descriptor:join.payload.invite.payload.descriptor,
    white:{address:'Demo white',key:join.payload.invite.payload.whiteKey},black:{address:'Demo black',key:join.payload.blackKey}};
  checkOpening(o);return o;
}
