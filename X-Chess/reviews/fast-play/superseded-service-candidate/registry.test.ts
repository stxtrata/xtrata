import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';
const contract = 'xchess-fast-v1';
const key = (byte: number) => Cl.buffer(Uint8Array.from([4,...Array(64).fill(byte)]));
function wallets() { const accounts = simnet.getAccounts(); return {a:accounts.get('wallet_1')!, b:accounts.get('wallet_2')!, c:accounts.get('wallet_3')!}; }
function create(opponent: string, sender: string, base=300000, inc=3000) { return simnet.callPublicFn(contract,'create-game',[Cl.principal(opponent),Cl.bool(true),key(1),key(3),Cl.uint(base),Cl.uint(inc)],sender); }
function number() { return Number((simnet.callReadOnlyFn(contract,'get-count',[],wallets().a).result as {value:bigint}).value); }
describe('fast game registry', () => {
  it('creates a fixed invitation and only its opponent can join once', () => {
    const {a,b,c}=wallets(); const r=create(b,a); expect(r.result.type).toBe('ok'); const id=number();
    expect(simnet.callPublicFn(contract,'join-game',[Cl.uint(id),key(2)],c).result).toEqual(Cl.error(Cl.uint(400)));
    expect(simnet.callPublicFn(contract,'join-game',[Cl.uint(id),key(2)],b).result).toEqual(Cl.ok(Cl.uint(id)));
    expect(simnet.callPublicFn(contract,'join-game',[Cl.uint(id),key(4)],b).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('rejects self games, invalid clocks and malformed keys', () => {
    const {a,b}=wallets(); expect(create(a,a).result).toEqual(Cl.error(Cl.uint(400)));
    for(const [base,inc] of [[1,0],[0,1000],[86400001,0],[60000,60001]]) expect(create(b,a,base,inc).result).toEqual(Cl.error(Cl.uint(400)));
    expect(simnet.callPublicFn(contract,'create-game',[Cl.principal(b),Cl.bool(true),Cl.buffer(new Uint8Array(65)),key(3),Cl.uint(60000),Cl.uint(0)],a).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('rejects shared player/referee keys and unknown games', () => {
    const {a,b}=wallets(); create(b,a); const id=number();
    for(const k of [key(1),key(3)]) expect(simnet.callPublicFn(contract,'join-game',[Cl.uint(id),k],b).result).toEqual(Cl.error(Cl.uint(400)));
    expect(simnet.callPublicFn(contract,'join-game',[Cl.uint(999999),key(2)],b).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('expires unjoined invitations after 1440 blocks', () => {
    const {a,b}=wallets(); create(b,a); const id=number(); simnet.mineEmptyBlocks(1441);
    expect(simnet.callPublicFn(contract,'join-game',[Cl.uint(id),key(2)],b).result).toEqual(Cl.error(Cl.uint(400)));
  });
  it('supports untimed invitations without increments or escrow', () => {
    const {a,b}=wallets(); const r=create(b,a,0,0); expect(r.result.type).toBe('ok'); expect(r.events.every(e=>e.event!=='stx_transfer_event')).toBe(true);
  });
});
