import { Cl, ClarityType } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;
const carol = accounts.get('wallet_3')!;

const claims = `${deployer}.xtrata-duels-claims-v1`;
const core = `${deployer}.mock-xtrata-core`;
const helper = `${deployer}.mock-twin-helper`;

const hashOf = (label: string) => createHash('sha256').update(label).digest();

const mint = (id: number, owner: string, label: string) => {
  expect(
    simnet.callPublicFn(core, 'mint', [Cl.uint(id), Cl.principal(owner), Cl.buffer(hashOf(label))], deployer)
      .result
  ).toBeOk(Cl.bool(true));
};

const bindTwin = (localId: number, xtrataId: number, owner: string, label: string) => {
  mint(xtrataId, owner, label);
  expect(
    simnet.callPublicFn(
      helper, 'set-binding',
      [Cl.uint(localId), Cl.uint(xtrataId), Cl.buffer(hashOf(label)), Cl.principal(owner), Cl.bool(false)],
      deployer
    ).result
  ).toBeOk(Cl.bool(true));
};

const ownerOf = (id: number) => {
  const r = simnet.callReadOnlyFn(core, 'get-owner', [Cl.uint(id)], deployer).result as any;
  return r.value.type === ClarityType.OptionalSome ? r.value.value.value : null;
};

const FIGHTERS = [100, 101, 102, 103, 104];
const WEAPONS = [200, 201, 202, 203, 204];

const setupPools = () => {
  for (const id of FIGHTERS) mint(id, deployer, `fighter-${id}`);
  for (const id of WEAPONS) mint(id, deployer, `weapon-${id}`);
  expect(
    simnet.callPublicFn(claims, 'deposit-fighters', [Cl.list(FIGHTERS.map(Cl.uint))], deployer).result
  ).toBeOk(Cl.uint(FIGHTERS.length));
  expect(
    simnet.callPublicFn(claims, 'deposit-weapons', [Cl.list(WEAPONS.map(Cl.uint))], deployer).result
  ).toBeOk(Cl.uint(WEAPONS.length));
  expect(simnet.callPublicFn(claims, 'set-claims-open', [Cl.bool(true)], deployer).result)
    .toBeOk(Cl.bool(true));
};

const claimFor = (who: string, collection: number, localId: number) =>
  simnet.callPublicFn(claims, 'claim', [Cl.uint(collection), Cl.uint(localId)], who);

describe('xtrata-duels-claims-v1', () => {
  beforeEach(() => {
    setupPools();
    bindTwin(1, 1000, alice, 'twin-alice');
    bindTwin(2, 1001, bob, 'twin-bob');
  });

  it('deals one random fighter and one weapon per twin, exactly once', () => {
    const r = claimFor(alice, 0, 1);
    expect(r.result.type).toBe(ClarityType.ResponseOk);
    const dealt = (r.result as any).value.value;
    const fighter = Number(dealt.fighter.value);
    const weapon = Number(dealt.weapon.value);
    expect(FIGHTERS).toContain(fighter);
    expect(WEAPONS).toContain(weapon);
    expect(ownerOf(fighter)).toBe(alice);
    expect(ownerOf(weapon)).toBe(alice);

    // pool shrank
    const pool = (simnet.callReadOnlyFn(claims, 'get-pool-remaining', [], alice).result as any).value;
    expect(Number(pool.fighters.value)).toBe(FIGHTERS.length - 1);
    expect(Number(pool.weapons.value)).toBe(WEAPONS.length - 1);

    // claim recorded, second claim for the same twin rejected
    const rec = simnet.callReadOnlyFn(claims, 'get-claim', [Cl.uint(0), Cl.uint(1)], alice).result as any;
    expect(rec.type).toBe(ClarityType.OptionalSome);
    expect(claimFor(alice, 0, 1).result).toBeErr(Cl.uint(303));
  });

  it('the claim follows the twin: new holder cannot re-claim a claimed twin', () => {
    claimFor(alice, 0, 1);
    // alice sends her twin to carol
    expect(
      simnet.callPublicFn(core, 'transfer', [Cl.uint(1000), Cl.principal(alice), Cl.principal(carol)], alice)
        .result
    ).toBeOk(Cl.bool(true));
    expect(claimFor(carol, 0, 1).result).toBeErr(Cl.uint(303));
  });

  it('requires holding the Xtrata twin and a real binding', () => {
    expect(claimFor(bob, 0, 1).result).toBeErr(Cl.uint(302)); // bob does not hold alice's twin
    expect(claimFor(bob, 0, 99).result).toBeErr(Cl.uint(301)); // unbound
    expect(claimFor(bob, 7, 2).result).toBeErr(Cl.uint(301)); // unknown collection -> no binding
  });

  it('claims are gated by the open flag', () => {
    expect(simnet.callPublicFn(claims, 'set-claims-open', [Cl.bool(false)], deployer).result)
      .toBeOk(Cl.bool(true));
    expect(claimFor(alice, 0, 1).result).toBeErr(Cl.uint(308));
  });

  it('distinct twins receive tokens from the shrinking pools without duplicates', () => {
    const dealtFighters = new Set<number>();
    const dealtWeapons = new Set<number>();
    const twins: Array<[string, number]> = [[alice, 1], [bob, 2]];
    bindTwin(3, 1002, carol, 'twin-carol');
    twins.push([carol, 3]);
    for (const [who, localId] of twins) {
      simnet.mineEmptyBlocks(1);
      const r = claimFor(who, 0, localId);
      expect(r.result.type).toBe(ClarityType.ResponseOk);
      const dealt = (r.result as any).value.value;
      const f = Number(dealt.fighter.value);
      const w = Number(dealt.weapon.value);
      expect(dealtFighters.has(f)).toBe(false);
      expect(dealtWeapons.has(w)).toBe(false);
      dealtFighters.add(f);
      dealtWeapons.add(w);
      expect(ownerOf(f)).toBe(who);
    }
    const pool = (simnet.callReadOnlyFn(claims, 'get-pool-remaining', [], alice).result as any).value;
    expect(Number(pool.fighters.value)).toBe(FIGHTERS.length - 3);
  });

  it('rejects claims when a pool is empty', () => {
    // drain: 5 of each in pools, create 5 twins and claim all, then a 6th twin fails
    const holders = [alice, bob, carol, accounts.get('wallet_4')!, accounts.get('wallet_5')!];
    holders.forEach((who, i) => {
      if (i >= 2) bindTwin(i + 1, 1002 + i, who, `twin-${i}`);
    });
    holders.forEach((who, i) => {
      simnet.mineEmptyBlocks(1);
      expect(claimFor(who, 0, i + 1).result.type).toBe(ClarityType.ResponseOk);
    });
    const late = accounts.get('wallet_6')!;
    bindTwin(50, 1050, late, 'twin-late');
    expect(claimFor(late, 0, 50).result).toBeErr(Cl.uint(304));
  });

  it('deposits and withdrawals are owner-only; withdraw requires claims closed', () => {
    mint(300, alice, 'rogue');
    expect(
      simnet.callPublicFn(claims, 'deposit-fighters', [Cl.list([Cl.uint(300)])], alice).result
    ).toBeErr(Cl.uint(300));
    expect(
      simnet.callPublicFn(claims, 'withdraw-remaining', [Cl.list([Cl.uint(100)]), Cl.principal(deployer)], deployer)
        .result
    ).toBeErr(Cl.uint(308)); // still open
    simnet.callPublicFn(claims, 'set-claims-open', [Cl.bool(false)], deployer);
    expect(
      simnet.callPublicFn(claims, 'withdraw-remaining', [Cl.list([Cl.uint(100)]), Cl.principal(deployer)], deployer)
        .result
    ).toBeOk(Cl.bool(true));
    expect(ownerOf(100)).toBe(deployer);
  });
});
