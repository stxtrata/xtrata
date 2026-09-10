import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ENGINE } from '../../packages/peer/protocol.js';
import { describe,it,expect } from 'vitest';
import { webcrypto, createPublicKey, verify as nodeVerify } from 'node:crypto';
import { generateKey, sign, hash, canonical, parseBounded, raw } from '../../packages/peer/crypto.js';
import { descriptor, emptyGame, makeMove, makeResignation, replay, archive, verifyArchive, merge, inviteDemo, demoOpening, actorTurn } from '../../packages/peer/protocol.js';
import type { Opening,Game } from '../../packages/peer/protocol.js';
if(!globalThis.crypto?.subtle)Object.defineProperty(globalThis,'crypto',{value:webcrypto});
export async function fixture(){
  const white=await generateKey(),black=await generateKey();
  const opening:Opening={kind:'demo',network:'local',registry:'local-demo',game:1,descriptor:descriptor(),white:{address:'Demo white',key:white.public},black:{address:'Demo black',key:black.public}};
  return {keys:{white,black},game:emptyGame(opening)};
}
export async function move(f:Awaited<ReturnType<typeof fixture>>,game:Game,value:string){
  const actor=actorTurn((await replay(game)).position),next=structuredClone(game);
  next.line.moves.push(await sign(await makeMove(game,actor,value),f.keys[actor].secret));await replay(next);return next;
}
describe('peer signed line and archives',()=>{
  it('pins the exact chess verifier source bytes',()=>{
    const h=createHash('sha256');for(const file of ['board.ts','engine.ts','fen.ts','moves.ts','uci.ts'])h.update(file+'\0').update(readFileSync('packages/chess/'+file)).update('\0');
    expect(ENGINE).toBe('xchess-engine-v1:'+h.digest('hex'));
  });
  it('Fool’s Mate is exportable without a terminal countersignature',async()=>{
    const f=await fixture();let g=f.game;for(const m of ['f2f3','e7e5','g2g4','d8h4'])g=await move(f,g,m);
    const a=await archive(g);expect(a.final).toMatchObject({status:'finished',result:'0-1',termination:'checkmate'});
    expect(a.line.moves.map(m=>m.payload.actor)).toEqual(['white','black','white','black']);expect(a.line.resignations).toEqual([]);
    await expect(verifyArchive(JSON.parse(canonical(a)))).resolves.toBeTruthy();
  });
  it('signatures interoperate with an independent Node P-256 verifier',async()=>{
    const f=await fixture(),g=await move(f,f.game,'e2e4'),event=g.line.moves[0],pub=raw(f.keys.white.public);
    const key=createPublicKey({format:'jwk',key:{kty:'EC',crv:'P-256',x:Buffer.from(pub.slice(1,33)).toString('base64url'),y:Buffer.from(pub.slice(33)).toString('base64url')}});
    expect(nodeVerify('sha256',Buffer.from(canonical(event.payload)),{key,dsaEncoding:'ieee-p1363'},Buffer.from(event.signature,'hex'))).toBe(true);
  });
  it.each(['value','actor','sequence','previousHash','match','resultingPositionHash'])('rejects tampered %s',async field=>{
    const f=await fixture(),g=await move(f,f.game,'e2e4'),a=await archive(g);const p=a.line.moves[0].payload as any;p[field]=field==='sequence'?3:field==='actor'?'black':'forged';await expect(verifyArchive(a)).rejects.toThrow();
  });
  it.each(['game','network','registry','key','engine','nonce'])('rejects changed opening %s',async field=>{
    const f=await fixture(),g=await move(f,f.game,'e2e4'),a=await archive(g);
    if(field==='key')a.opening.white.key=f.keys.black.public;else if(field==='engine')a.opening.descriptor.engine='other' as any;else if(field==='nonce')a.opening.descriptor.nonce='a'.repeat(64);else(a.opening as any)[field]=field==='game'?2:'changed';
    await expect(verifyArchive(a)).rejects.toThrow();
  });
  it.each(['fen','root','result','status','termination'])('rejects forged final %s',async field=>{
    const f=await fixture(),a=await archive(await move(f,f.game,'e2e4'));(a.final as any)[field]='forged';await expect(verifyArchive(a)).rejects.toThrow();
  });
  it('rejects a properly signed illegal move',async()=>{
    const f=await fixture(),payload=await makeMove(f.game,'white','e2e4');payload.value='e2e5';f.game.line.moves.push(await sign(payload,f.keys.white.secret));await expect(replay(f.game)).rejects.toThrow('Illegal');
  });
  it('rejects invalid curve points even in an empty archive',async()=>{const f=await fixture();f.game.opening.black.key='04'+'00'.repeat(64);await expect(replay(f.game)).rejects.toThrow();});
  it('rejects wrong signer and out-of-order events',async()=>{
    const f=await fixture(),g=await move(f,f.game,'e2e4');g.line.moves[0]=await sign(g.line.moves[0].payload,f.keys.black.secret);await expect(replay(g)).rejects.toThrow('Signature');
    let h=await move(f,f.game,'e2e4');h=await move(f,h,'e7e5');h.line.moves.reverse();await expect(replay(h)).rejects.toThrow();
  });
  it('accepts duplicate payloads without replacing saved signatures or truncating history',async()=>{
    const f=await fixture(),first=await move(f,f.game,'e2e4'),second=await move(f,first,'e7e5');
    const equivalent=structuredClone(first);equivalent.line.moves[0]=await sign(equivalent.line.moves[0].payload,f.keys.white.secret);
    expect(await merge(second,equivalent)).toEqual(second);expect(await merge(second,f.game)).toEqual(second);
  });
  it('retains alternative signed branches without choosing the longest',async()=>{
    const f=await fixture(),a=await move(f,f.game,'e2e4');let b=await move(f,f.game,'d2d4');b=await move(f,b,'d7d5');
    const merged=await merge(a,b);expect(merged.line).toEqual(a.line);expect(merged.branches).toHaveLength(1);expect((await archive(merged)).final.status).toBe('disputed');
  });
  it('authenticates off-turn resignation without assigning it the mover’s turn',async()=>{
    const f=await fixture(),g=await move(f,f.game,'e2e4');g.line.resignations.push(await sign(await makeResignation(g,'white'),f.keys.white.secret));
    expect((await archive(g)).final).toMatchObject({result:'0-1',termination:'resignation',status:'finished'});
  });
  it('preserves concurrent resignation/move evidence as a dispute',async()=>{
    const f=await fixture(),base=await move(f,f.game,'e2e4'),resigned=structuredClone(base);
    resigned.line.resignations.push(await sign(await makeResignation(base,'white'),f.keys.white.secret));
    const advanced=await move(f,base,'e7e5'),combined=await merge(resigned,advanced);
    expect(combined.line.moves).toHaveLength(2);expect(combined.line.resignations).toHaveLength(1);expect((await archive(combined)).final).toMatchObject({status:'disputed',result:'*'});
  });
  it('never synthesizes a result from advisory clock settings or elapsed time',async()=>{
    const f=await fixture();f.game.opening.descriptor.clock={baseMs:1,incrementMs:0};
    const before=await archive(f.game);await new Promise(r=>setTimeout(r,5));expect((await archive(f.game)).final).toEqual(before.final);expect(before.final.status).toBe('unfinished');
  });
  it('derives automatic repetition draws from the full history',async()=>{
    const f=await fixture();let g=f.game;for(const m of ['g1f3','g8f6','f3g1','f6g8','g1f3','g8f6','f3g1','f6g8'])g=await move(f,g,m);
    expect((await archive(g)).final).toMatchObject({result:'1/2-1/2',termination:'repetition'});
  });
  it('includes underpromotion and side/castling/en-passant state in the commitment',async()=>{
    const f=await fixture();f.game.opening.descriptor.initialFen='7k/P7/8/8/8/8/8/7K w - - 0 1';
    const g=await move(f,f.game,'a7a8r');expect(g.line.moves[0].payload.value).toBe('a7a8r');expect(g.line.moves[0].payload.resultingPositionHash).toBe(hash((await replay(g)).position.fen()));
    await expect(makeMove(f.game,'white','a7a8')).rejects.toThrow();
  });
  it('binds a demo join to both independent game keys',async()=>{
    const f=await fixture(),invite=await inviteDemo(f.game.opening.descriptor,f.keys.white);
    const join=await sign({format:'xchess-peer-demo-join-v1' as const,invite,blackKey:f.keys.black.public},f.keys.black.secret);
    expect(await demoOpening(join)).toEqual(f.game.opening);join.payload.blackKey=f.keys.white.public;await expect(demoOpening(join)).rejects.toThrow();
  });
  it('rejects unsupported fields, excessive depth and oversized input',async()=>{
    const f=await fixture(),a=await archive(f.game);(a as any).privateKey='hidden';await expect(verifyArchive(a)).rejects.toThrow('fields');
    expect(()=>parseBounded('['.repeat(25)+'0'+']'.repeat(25))).toThrow('deep');expect(()=>parseBounded(' '.repeat(2000001))).toThrow('large');
  });
  it('public archives contain only signed evidence, not transport or key material',async()=>{
    const f=await fixture(),text=canonical(await archive(await move(f,f.game,'e2e4')));
    for(const forbidden of ['private','secret','credential','sdp','referee','timeout'])expect(text).not.toContain(forbidden);
  });
});
