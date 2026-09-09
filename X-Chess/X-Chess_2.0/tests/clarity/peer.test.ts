import { describe,it,expect } from 'vitest';
import { Cl,deserializeCV,serializeCV } from '@stacks/transactions';
import { createArgs,joinArgs,decodeInvitation,openingFrom } from '../../packages/peer/registry.js';
import { descriptor,emptyGame,archive,verifyArchive } from '../../packages/peer/protocol.js';
import { generateKey } from '../../packages/peer/crypto.js';
import { deserialize } from '../../packages/chain/clarity.js';
const contract='xchess-peer-v1';
const wallets=()=>{const a=simnet.getAccounts();return {creator:a.get('wallet_1')!,opponent:a.get('wallet_2')!,stranger:a.get('wallet_3')!,deployer:a.get('deployer')!};};
const count=()=>Number((simnet.callReadOnlyFn(contract,'get-peer-count',[],wallets().creator).result as {value:bigint}).value);
async function setup(){const w=wallets(),key=await generateKey(),other=await generateKey(),d=descriptor();const args=createArgs(w.opponent,true,key.public,d).map(v=>deserializeCV(v));const receipt=simnet.callPublicFn(contract,'create-peer-game',args,w.creator);expect(receipt.result.type).toBe('ok');const id=count();const row=decodeInvitation(id,deserialize(serializeCV(simnet.callReadOnlyFn(contract,'get-peer-game',[Cl.uint(id)],w.creator).result)));return {...w,key,other,d,id,row};}
describe('peer registry and actual frontend ABI',()=>{
  it('round trips the frontend create/join arguments, descriptor and player keys',async()=>{
    const f=await setup();expect(f.row.descriptor).toEqual(f.d);expect(f.row.creator).toBe(f.creator);expect(f.row.creatorKey).toBe(f.key.public);
    const receipt=simnet.callPublicFn(contract,'join-peer-game',joinArgs(f.row,f.other.public).map(v=>deserializeCV(v)),f.opponent);expect(receipt.result).toEqual(Cl.ok(Cl.uint(f.id)));
    const row=decodeInvitation(f.id,deserialize(serializeCV(simnet.callReadOnlyFn(contract,'get-peer-game',[Cl.uint(f.id)],f.creator).result)));
    const o=openingFrom(f.deployer+'.'+contract,'testnet',row);expect(o.black.address).toBe(f.opponent);expect(o.black.key).toBe(f.other.public);
    await expect(verifyArchive(await archive(emptyGame(o)),o)).resolves.toBeTruthy();
  });
  it('only the named opponent can join and joining is immutable',async()=>{
    const f=await setup(),args=joinArgs(f.row,f.other.public).map(v=>deserializeCV(v));
    expect(simnet.callPublicFn(contract,'join-peer-game',args,f.stranger).result).toEqual(Cl.error(Cl.uint(400)));
    expect(simnet.callPublicFn(contract,'join-peer-game',args,f.opponent).result.type).toBe('ok');
    expect(simnet.callPublicFn(contract,'join-peer-game',args,f.opponent).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('requires the exact descriptor hash the opponent reviewed',async()=>{
    const f=await setup(),args=joinArgs(f.row,f.other.public).map(v=>deserializeCV(v));args[1]=Cl.buffer(new Uint8Array(32));
    expect(simnet.callPublicFn(contract,'join-peer-game',args,f.opponent).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('rejects shared keys and malformed keys',async()=>{
    const f=await setup();expect(simnet.callPublicFn(contract,'join-peer-game',joinArgs(f.row,f.key.public).map(v=>deserializeCV(v)),f.opponent).result).toEqual(Cl.error(Cl.uint(400)));
    expect(simnet.callPublicFn(contract,'join-peer-game',[Cl.uint(f.id),Cl.bufferFromHex(f.row.descriptorHash),Cl.buffer(new Uint8Array(65))],f.opponent).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('rejects self invitations and unknown games',async()=>{
    const f=await setup();expect(simnet.callPublicFn(contract,'create-peer-game',createArgs(f.creator,true,f.key.public,f.d).map(v=>deserializeCV(v)),f.creator).result).toEqual(Cl.error(Cl.uint(400)));
    const args=joinArgs(f.row,f.other.public).map(v=>deserializeCV(v));args[0]=Cl.uint(999999);expect(simnet.callPublicFn(contract,'join-peer-game',args,f.opponent).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('pre-join expiry does not erase or cancel joined games',async()=>{
    const f=await setup(),args=joinArgs(f.row,f.other.public).map(v=>deserializeCV(v));simnet.mineEmptyBlocks(1441);
    expect(simnet.callPublicFn(contract,'join-peer-game',args,f.opponent).result).toEqual(Cl.error(Cl.uint(400)));
    const g=await setup();simnet.callPublicFn(contract,'join-peer-game',joinArgs(g.row,g.other.public).map(v=>deserializeCV(v)),g.opponent);simnet.mineEmptyBlocks(1441);
    const row=decodeInvitation(g.id,deserialize(serializeCV(simnet.callReadOnlyFn(contract,'get-peer-game',[Cl.uint(g.id)],g.creator).result)));expect(row.opponentKey).toBe(g.other.public);
  });
});
