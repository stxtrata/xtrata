import 'fake-indexeddb/auto';
import { describe,it,expect,vi } from 'vitest';
import { Journal } from '../../packages/peer/store.js';
import { descriptor,emptyGame,makeMove,archive,verifyArchive } from '../../packages/peer/protocol.js';
import type { Opening } from '../../packages/peer/protocol.js';
import { hash,sign,canonical,parseBounded } from '../../packages/peer/crypto.js';
async function setup(){
  const name='peer-test-'+crypto.randomUUID(),a=new Journal(name),b=new Journal(name+'-black'),white=await a.createKey(),black=await b.createKey();
  const opening:Opening={kind:'demo',network:'local',registry:'local-demo',game:1,descriptor:descriptor(),white:{address:'Demo white',key:white.public},black:{address:'Demo black',key:black.public}};
  await a.start(opening);await b.start(opening);return {a,b,white,black,opening,name,match:hash(opening)};
}
describe('durable peer signing and encrypted recovery',()=>{
  it('saves a move before returning it for transport and survives a new journal instance',async()=>{
    const f=await setup(),game=await f.a.act(f.match,'white','move','e2e4');
    expect(await new Journal(f.name).get(f.match)).toEqual(game);expect((await new Journal(f.name).key(f.white.public))?.public).toBe(f.white.public);
  });
  it('two tabs cannot sign alternative actions at the same sequence',async()=>{
    const f=await setup(),tab=new Journal(f.name),before=await f.a.get(f.match);
    const result=await Promise.allSettled([f.a.act(f.match,'white','move','e2e4',hash(before)),tab.act(f.match,'white','move','d2d4',hash(before))]);
    expect(result.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect((await f.a.get(f.match))!.line.moves).toHaveLength(1);
  });
  it('rejects signing from a stale rendered board even if a requested move might later be legal',async()=>{
    const f=await setup(),before=await f.a.get(f.match);const white=await f.a.act(f.match,'white','move','e2e4');await f.b.receive(white);const black=await f.b.act(f.match,'black','move','e7e5');await f.a.receive(black);
    await expect(f.a.act(f.match,'white','move','d2d4',hash(before))).rejects.toThrow('changed');
  });
  it('rejects invalid imports atomically without losing a signed move',async()=>{
    const f=await setup(),game=await f.a.act(f.match,'white','move','e2e4'),bad=structuredClone(game);bad.line.moves[0].payload.value='d2d4';
    await expect(f.a.receive(bad)).rejects.toThrow();expect(await f.a.get(f.match)).toEqual(game);
  });
  it('truncated snapshots do not erase saved history',async()=>{
    const f=await setup(),game=await f.a.act(f.match,'white','move','e2e4');expect(await f.a.receive(emptyGame(f.opening))).toEqual(game);
  });
  it('retains a valid malicious branch and stops ordinary signing',async()=>{
    const f=await setup();await f.a.act(f.match,'white','move','e2e4');const alternative=emptyGame(f.opening);alternative.line.moves.push(await sign(await makeMove(alternative,'white','d2d4'),f.white.secret));
    const game=await f.a.receive(alternative);expect(game.branches).toHaveLength(1);await expect(f.a.act(f.match,'white','resignation')).rejects.toThrow('disputed');
  });
  it('encrypts private keys, restores in a fresh store and keeps signed reservations',async()=>{
    const f=await setup();const game=await f.a.act(f.match,'white','move','e2e4');const text=await f.a.exportRecovery(f.match,'a strong test password');
    expect(text).not.toContain('jwk');expect(text).not.toContain(f.white.public);expect(text).not.toContain('e2e4');
    const restored=new Journal(f.name+'-restored');expect(await restored.importRecovery(text,'a strong test password')).toEqual(game);
    expect((await restored.key(f.white.public))?.public).toBe(f.white.public);await expect(verifyArchive(await archive((await restored.get(f.match))!))).resolves.toBeTruthy();
  });
  it('wrong passwords or modified ciphertext do not change existing state',async()=>{
    const f=await setup(),before=await f.a.get(f.match),text=await f.a.exportRecovery(f.match,'a strong test password');
    await expect(f.a.importRecovery(text,'wrong password')).rejects.toThrow('password');
    const bad=parseBounded(text) as any;bad.cipher=(bad.cipher[0]==='A'?'B':'A')+bad.cipher.slice(1);
    await expect(f.a.importRecovery(canonical(bad),'a strong test password')).rejects.toThrow();expect(await f.a.get(f.match)).toEqual(before);
  });
  it('restoring an old recovery file into an existing store cannot roll back its moves',async()=>{
    const f=await setup(),old=await f.a.exportRecovery(f.match,'a strong test password'),game=await f.a.act(f.match,'white','move','e2e4');
    expect(await f.a.importRecovery(old,'a strong test password')).toEqual(game);
  });
  it('storage denial prevents key creation and does not report success',async()=>{
    const spy=vi.spyOn(indexedDB,'open').mockImplementation(()=>{throw new DOMException('Storage denied','SecurityError');});
    try{await expect(new Journal('denied').createKey()).rejects.toThrow('denied');}finally{spy.mockRestore();}
  });
  it('failed game persistence returns no transportable successful action',async()=>{
    const f=await setup(),before=await f.a.get(f.match),original=IDBObjectStore.prototype.put;
    const spy=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,value:any,key?:IDBValidKey){if(this.name==='games')throw new DOMException('Quota full','QuotaExceededError');return original.call(this,value,key);});
    try{await expect(f.a.act(f.match,'white','move','e2e4')).rejects.toThrow();}finally{spy.mockRestore();}
    expect(await f.a.get(f.match)).toEqual(before);
    await expect(f.a.act(f.match,'white','move','d2d4')).rejects.toThrow('reserved');
    expect((await f.a.act(f.match,'white','move','e2e4')).line.moves).toHaveLength(1);
  });
  it('a demo invitation cannot be accepted with different keys after reload',async()=>{
    const f=await setup();await f.a.acceptDemo(f.opening.descriptor.nonce,f.match);
    await expect(new Journal(f.name).acceptDemo(f.opening.descriptor.nonce,'0'.repeat(64))).rejects.toThrow('different keys');
  });
});
