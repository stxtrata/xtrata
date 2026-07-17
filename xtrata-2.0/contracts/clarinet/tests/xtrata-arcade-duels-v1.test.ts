import { Cl, ClarityType } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;
const carol = accounts.get('wallet_3')!;

const duels = `${deployer}.xtrata-arcade-duels-v1`;
const core = `${deployer}.mock-xtrata-core`;
const helper = `${deployer}.mock-twin-helper`;

const hashOf = (label: string) =>
  createHash('sha256').update(label).digest();

const HASHES: Record<number, Buffer> = {};

const mint = (id: number, owner: string, label: string) => {
  const h = hashOf(label);
  HASHES[id] = h;
  expect(
    simnet.callPublicFn(core, 'mint', [Cl.uint(id), Cl.principal(owner), Cl.buffer(h)], deployer)
      .result
  ).toBeOk(Cl.bool(true));
};

const bindTwin = (localId: number, xtrataId: number, owner: string, label: string) => {
  mint(xtrataId, owner, label);
  expect(
    simnet.callPublicFn(
      helper,
      'set-binding',
      [Cl.uint(localId), Cl.uint(xtrataId), Cl.buffer(HASHES[xtrataId]), Cl.principal(owner), Cl.bool(false)],
      deployer
    ).result
  ).toBeOk(Cl.bool(true));
};

const setRanges = () => {
  expect(
    simnet.callPublicFn(
      duels,
      'set-eligible-ranges',
      [
        Cl.list([
          Cl.tuple({ role: Cl.uint(0), start: Cl.uint(100), end: Cl.uint(199) }), // fighters
          Cl.tuple({ role: Cl.uint(1), start: Cl.uint(200), end: Cl.uint(299) })  // weapons
        ])
      ],
      deployer
    ).result
  ).toBeOk(Cl.bool(true));
};

const ownerOf = (id: number) => {
  const r = simnet.callReadOnlyFn(core, 'get-owner', [Cl.uint(id)], deployer).result as any;
  expect(r.type).toBe(ClarityType.ResponseOk);
  return r.value.type === ClarityType.OptionalSome ? r.value.value.value : null;
};

const challenge = (
  who: string,
  fighter: number,
  weapon: number,
  twinLocal: number,
  opponent: string | null = null
) =>
  simnet.callPublicFn(
    duels,
    'challenge',
    [
      Cl.uint(fighter),
      Cl.uint(weapon),
      Cl.uint(0),
      Cl.uint(twinLocal),
      opponent ? Cl.some(Cl.principal(opponent)) : Cl.none()
    ],
    who
  );

const accept = (who: string, duelId: number, fighter: number, weapon: number, twinLocal: number) =>
  simnet.callPublicFn(
    duels,
    'accept',
    [Cl.uint(duelId), Cl.uint(fighter), Cl.uint(weapon), Cl.uint(0), Cl.uint(twinLocal)],
    who
  );

// Standard fixture: alice has fighter 100 / weapon 200 / twin (local 1, xtrata 1000);
// bob has fighter 101 / weapon 201 / twin (local 2, xtrata 1001).
const setupFixture = () => {
  setRanges();
  mint(100, alice, 'fighter-alice');
  mint(200, alice, 'weapon-alice');
  bindTwin(1, 1000, alice, 'twin-alice');
  mint(101, bob, 'fighter-bob');
  mint(201, bob, 'weapon-bob');
  bindTwin(2, 1001, bob, 'twin-bob');
};

describe('xtrata-arcade-duels-v1', () => {
  beforeEach(() => {
    setupFixture();
  });

  it('runs a full duel: challenge, accept, resolve, winner takes all four tokens', () => {
    const c = challenge(alice, 100, 200, 1);
    expect(c.result).toBeOk(Cl.uint(1));
    // escrowed
    expect(ownerOf(100)).toBe(duels);
    expect(ownerOf(200)).toBe(duels);
    // twin NOT escrowed
    expect(ownerOf(1000)).toBe(alice);

    const a = accept(bob, 1, 101, 201, 2);
    expect(a.result.type).toBe(ClarityType.ResponseOk);
    expect(ownerOf(101)).toBe(duels);
    expect(ownerOf(201)).toBe(duels);
    expect(ownerOf(1001)).toBe(bob);

    // too early: the seed block does not exist yet
    expect(simnet.callPublicFn(duels, 'resolve', [Cl.uint(1)], carol).result)
      .toBeErr(Cl.uint(208));

    simnet.mineEmptyBlocks(2);
    const r = simnet.callPublicFn(duels, 'resolve', [Cl.uint(1)], carol);
    expect(r.result.type).toBe(ClarityType.ResponseOk);
    const winner = (r.result as any).value.value as string;
    expect([alice, bob]).toContain(winner);

    // winner holds all four staked tokens; twins untouched
    for (const id of [100, 200, 101, 201]) {
      expect(ownerOf(id)).toBe(winner);
    }
    expect(ownerOf(1000)).toBe(alice);
    expect(ownerOf(1001)).toBe(bob);

    // result recorded and duel closed
    const res = simnet.callReadOnlyFn(duels, 'get-result', [Cl.uint(1)], carol).result as any;
    expect(res.type).toBe(ClarityType.OptionalSome);
    expect(simnet.callPublicFn(duels, 'resolve', [Cl.uint(1)], carol).result)
      .toBeErr(Cl.uint(202));
  });

  it('resolution matches the published stat formula (JS parity)', () => {
    challenge(alice, 100, 200, 1);
    accept(bob, 1, 101, 201, 2);
    simnet.mineEmptyBlocks(2);
    const r = simnet.callPublicFn(duels, 'resolve', [Cl.uint(1)], carol);
    expect(r.result.type).toBe(ClarityType.ResponseOk);

    const res = (simnet.callReadOnlyFn(duels, 'get-result', [Cl.uint(1)], carol).result as any)
      .value.value;
    const rawSeed = res.seed.value ?? res.seed.buffer;
    const seedBuf =
      typeof rawSeed === 'string'
        ? Buffer.from(rawSeed.replace(/^0x/, ''), 'hex')
        : Buffer.from(rawSeed);
    expect(seedBuf.length).toBe(32);

    const u16 = (b: Buffer) => b.readUInt16BE(0);
    const scoreOf = (fh: Buffer, wh: Buffer, th: Buffer, sideByte: number) => {
      const base = u16(fh) % 100;
      const wpn = u16(wh) % 60;
      const twin = u16(th) % 40;
      const synergy = (fh[3] ^ wh[3]) % 4 === 0 ? 20 : 0;
      const luckHash = createHash('sha256')
        .update(Buffer.concat([seedBuf, Buffer.from([sideByte])]))
        .digest();
      const luck = u16(luckHash) % 120;
      return base + wpn + twin + synergy + luck;
    };

    const expectedC = scoreOf(HASHES[100], HASHES[200], HASHES[1000], 0x01);
    const expectedA = scoreOf(HASHES[101], HASHES[201], HASHES[1001], 0x02);
    expect(Number(res['challenger-total'].value)).toBe(expectedC);
    expect(Number(res['acceptor-total'].value)).toBe(expectedA);
    const winner = expectedC === expectedA ? null : expectedC > expectedA ? alice : bob;
    if (winner) {
      expect(res.winner.value).toBe(winner);
    }
  });

  it('rejects ineligible fighters/weapons and swapped roles', () => {
    mint(500, alice, 'not-in-any-range');
    expect(challenge(alice, 500, 200, 1).result).toBeErr(Cl.uint(203));
    // weapon id in fighter slot
    expect(challenge(alice, 200, 100, 1).result).toBeErr(Cl.uint(203));
  });

  it('requires the twin to be bound and held by the entrant', () => {
    // unbound local id
    expect(challenge(alice, 100, 200, 99).result).toBeErr(Cl.uint(204));
    // bound, but the xtrata twin is held by someone else
    bindTwin(3, 1002, carol, 'twin-carol');
    expect(challenge(alice, 100, 200, 3).result).toBeErr(Cl.uint(205));
  });

  it('blocks self-duel and enforces targeted opponents', () => {
    challenge(alice, 100, 200, 1, carol); // targeted at carol
    expect(accept(alice, 1, 100, 200, 1).result).toBeErr(Cl.uint(206));
    expect(accept(bob, 1, 101, 201, 2).result).toBeErr(Cl.uint(207));
  });

  it('prevents double-accept and accepting a resolved duel', () => {
    mint(102, carol, 'fighter-carol');
    mint(202, carol, 'weapon-carol');
    bindTwin(4, 1003, carol, 'twin-carol-2');
    challenge(alice, 100, 200, 1);
    accept(bob, 1, 101, 201, 2);
    expect(accept(carol, 1, 102, 202, 4).result).toBeErr(Cl.uint(202));
  });

  it('challenger can cancel an open duel and gets the stake back', () => {
    challenge(alice, 100, 200, 1);
    expect(ownerOf(100)).toBe(duels);
    // a stranger cannot cancel a fresh challenge
    expect(simnet.callPublicFn(duels, 'cancel', [Cl.uint(1)], bob).result)
      .toBeErr(Cl.uint(200));
    expect(simnet.callPublicFn(duels, 'cancel', [Cl.uint(1)], alice).result)
      .toBeOk(Cl.bool(true));
    expect(ownerOf(100)).toBe(alice);
    expect(ownerOf(200)).toBe(alice);
    // cannot accept a cancelled duel
    expect(accept(bob, 1, 101, 201, 2).result).toBeErr(Cl.uint(202));
  });

  it('anyone can sweep an expired open challenge back to the challenger', () => {
    expect(simnet.callPublicFn(duels, 'set-open-ttl', [Cl.uint(10)], deployer).result)
      .toBeOk(Cl.bool(true));
    challenge(alice, 100, 200, 1);
    simnet.mineEmptyBlocks(12);
    expect(simnet.callPublicFn(duels, 'cancel', [Cl.uint(1)], carol).result)
      .toBeOk(Cl.bool(true));
    expect(ownerOf(100)).toBe(alice);
  });

  it('only the owner can set eligibility ranges', () => {
    expect(
      simnet.callPublicFn(
        duels,
        'set-eligible-ranges',
        [Cl.list([Cl.tuple({ role: Cl.uint(0), start: Cl.uint(1), end: Cl.uint(2) })])],
        bob
      ).result
    ).toBeErr(Cl.uint(200));
  });
});
