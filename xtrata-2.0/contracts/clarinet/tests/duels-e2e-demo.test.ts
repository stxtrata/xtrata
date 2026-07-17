/**
 * XTRATA DUELS end-to-end demo against the LOCAL contracts.
 *
 * Plays the full game loop in simnet with the REAL first-drop content hashes
 * (tests/fixtures/duels-drop-manifest.json, produced by the deterministic
 * generator): pools are deposited into the claims contract, two Forever Twin
 * holders claim their random fighter+weapon, then duel each other through the
 * arena contract. This is the pre-mainnet dress rehearsal.
 */
import { Cl, ClarityType } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;

const duels = `${deployer}.xtrata-arcade-duels-v1`;
const claims = `${deployer}.xtrata-duels-claims-v1`;
const core = `${deployer}.mock-xtrata-core`;
const helper = `${deployer}.mock-twin-helper`;

const manifest = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'duels-drop-manifest.json'), 'utf8')
);

// Drop id plan for this rehearsal: fighters 1000+, weapons 2000+, twins 9000+.
const FIGHTER_BASE = 1000;
const WEAPON_BASE = 2000;
const POOL = 10; // deposit the first 10 of each for the rehearsal

const ok = (r: any) => { expect(r.result.type).toBe(ClarityType.ResponseOk); return (r.result as any).value; };
const ownerOf = (id: number) => {
  const r = simnet.callReadOnlyFn(core, 'get-owner', [Cl.uint(id)], deployer).result as any;
  return r.value.type === ClarityType.OptionalSome ? r.value.value.value : null;
};

describe('XTRATA DUELS — local end-to-end rehearsal with real drop hashes', () => {
  it('claim -> claim -> duel -> resolve, with real generated content hashes', () => {
    // 1. "Inscribe" the drop: mint pool tokens on the core with the REAL sha256
    //    of each generated SVG.
    const fighterIds: number[] = [];
    const weaponIds: number[] = [];
    for (let i = 0; i < POOL; i++) {
      const f = manifest.fighters[i];
      const w = manifest.weapons[i];
      const fid = FIGHTER_BASE + i;
      const wid = WEAPON_BASE + i;
      ok(simnet.callPublicFn(core, 'mint',
        [Cl.uint(fid), Cl.principal(deployer), Cl.buffer(Buffer.from(f.sha256, 'hex'))], deployer));
      ok(simnet.callPublicFn(core, 'mint',
        [Cl.uint(wid), Cl.principal(deployer), Cl.buffer(Buffer.from(w.sha256, 'hex'))], deployer));
      fighterIds.push(fid);
      weaponIds.push(wid);
    }

    // 2. Deposit pools + open claims.
    ok(simnet.callPublicFn(claims, 'deposit-fighters', [Cl.list(fighterIds.map(Cl.uint))], deployer));
    ok(simnet.callPublicFn(claims, 'deposit-weapons', [Cl.list(weaponIds.map(Cl.uint))], deployer));
    ok(simnet.callPublicFn(claims, 'set-claims-open', [Cl.bool(true)], deployer));

    // 3. Two Forever Twins, held liquid by alice and bob.
    const twinAliceHash = createHash('sha256').update('rehearsal-twin-alice').digest();
    const twinBobHash = createHash('sha256').update('rehearsal-twin-bob').digest();
    ok(simnet.callPublicFn(core, 'mint', [Cl.uint(9001), Cl.principal(alice), Cl.buffer(twinAliceHash)], deployer));
    ok(simnet.callPublicFn(core, 'mint', [Cl.uint(9002), Cl.principal(bob), Cl.buffer(twinBobHash)], deployer));
    ok(simnet.callPublicFn(helper, 'set-binding',
      [Cl.uint(77), Cl.uint(9001), Cl.buffer(twinAliceHash), Cl.principal(alice), Cl.bool(false)], deployer));
    ok(simnet.callPublicFn(helper, 'set-binding',
      [Cl.uint(12), Cl.uint(9002), Cl.buffer(twinBobHash), Cl.principal(bob), Cl.bool(false)], deployer));

    // 4. Both claim their random fighter + weapon.
    simnet.mineEmptyBlocks(1);
    const aliceDealt = ok(simnet.callPublicFn(claims, 'claim', [Cl.uint(0), Cl.uint(77)], alice)).value;
    simnet.mineEmptyBlocks(1);
    const bobDealt = ok(simnet.callPublicFn(claims, 'claim', [Cl.uint(0), Cl.uint(12)], bob)).value;
    const aF = Number(aliceDealt.fighter.value), aW = Number(aliceDealt.weapon.value);
    const bF = Number(bobDealt.fighter.value), bW = Number(bobDealt.weapon.value);
    expect(ownerOf(aF)).toBe(alice);
    expect(ownerOf(bW)).toBe(bob);
    expect(aF).not.toBe(bF);
    expect(aW).not.toBe(bW);

    // 5. Eligibility ranges cover the drop; alice throws an open challenge.
    ok(simnet.callPublicFn(duels, 'set-eligible-ranges', [Cl.list([
      Cl.tuple({ role: Cl.uint(0), start: Cl.uint(FIGHTER_BASE), end: Cl.uint(FIGHTER_BASE + 99) }),
      Cl.tuple({ role: Cl.uint(1), start: Cl.uint(WEAPON_BASE), end: Cl.uint(WEAPON_BASE + 99) })
    ])], deployer));
    const duelId = Number(ok(simnet.callPublicFn(duels, 'challenge',
      [Cl.uint(aF), Cl.uint(aW), Cl.uint(0), Cl.uint(77), Cl.none()], alice)).value);
    expect(ownerOf(aF)).toBe(duels);

    // 6. Bob accepts; the seed block gets mined; anyone resolves.
    ok(simnet.callPublicFn(duels, 'accept',
      [Cl.uint(duelId), Cl.uint(bF), Cl.uint(bW), Cl.uint(0), Cl.uint(12)], bob));
    simnet.mineEmptyBlocks(2);
    const winner = ok(simnet.callPublicFn(duels, 'resolve', [Cl.uint(duelId)], deployer)).value as string;
    expect([alice, bob]).toContain(winner);

    // 7. Winner holds all four dealt tokens; both twins never moved.
    for (const id of [aF, aW, bF, bW]) expect(ownerOf(id)).toBe(winner);
    expect(ownerOf(9001)).toBe(alice);
    expect(ownerOf(9002)).toBe(bob);

    // 8. Fight report — the numbers players would watch in the demo/replay.
    const res = (simnet.callReadOnlyFn(duels, 'get-result', [Cl.uint(duelId)], deployer).result as any).value.value;
    const fFile = (id: number) => manifest.fighters[id - FIGHTER_BASE].file;
    const wFile = (id: number) => manifest.weapons[id - WEAPON_BASE].file;
    // eslint-disable-next-line no-console
    console.log('\n===== DRESS REHEARSAL FIGHT REPORT =====');
    console.log(`alice drew ${fFile(aF)} + ${wFile(aW)}; bob drew ${fFile(bF)} + ${wFile(bW)}`);
    console.log(`challenger total ${res['challenger-total'].value} vs acceptor total ${res['acceptor-total'].value}`);
    console.log(`winner: ${winner === alice ? 'alice' : 'bob'} — takes all four; twins untouched`);
    console.log('========================================\n');
  });
});
