import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const contract = `${deployer}.xtrata-studio-leaderboard-v1`;
describe('generated Xtrata Studio leaderboard v1 fixture', () => {
  it('requires and verifies the pinned inscription reference', () => {
    expect(
      simnet.callPublicFn(
        contract,
        'submit-score',
        [Cl.uint(100), Cl.stringAscii('ACE')],
        wallet1
      ).result
    ).toBeErr(Cl.uint(101));
    expect(
      simnet.callPublicFn(contract, 'verify-asset', [], wallet1).result
    ).toBeOk(Cl.bool(true));
    const reference = simnet.callReadOnlyFn(contract, 'get-asset-reference', [], deployer).result;
    expect(reference).toHaveClarityType(Cl.tuple({
      core: Cl.contractPrincipal(deployer, 'mock-xtrata-studio-core'),
      'token-id': Cl.uint(42),
      'content-hash': Cl.bufferFromHex('ab'.repeat(32)),
      verified: Cl.bool(true),
      'verified-at': Cl.uint(1)
    }).type);
  });

  it('covers successful, duplicate, boundary and personal-best behavior', () => {
    simnet.callPublicFn(contract, 'verify-asset', [], deployer);
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(100), Cl.stringAscii('ACE')], wallet1).result
    ).toBeOk(Cl.uint(1));
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(100), Cl.stringAscii('ACE')], wallet1).result
    ).toBeErr(Cl.uint(105));
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(99), Cl.stringAscii('ACE')], wallet1).result
    ).toBeErr(Cl.uint(106));
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(9), Cl.stringAscii('LOW')], wallet2).result
    ).toBeErr(Cl.uint(103));
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(1001), Cl.stringAscii('MAX')], wallet2).result
    ).toBeErr(Cl.uint(103));
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(200), Cl.stringAscii('BOB')], wallet2).result
    ).toBeOk(Cl.uint(1));
    expect(
      simnet.callPublicFn(contract, 'submit-score', [Cl.uint(300), Cl.stringAscii('ACE')], wallet1).result
    ).toBeOk(Cl.uint(1));
    expect(
      simnet.callReadOnlyFn(contract, 'get-leaderboard-entry', [Cl.uint(1), Cl.uint(2)], deployer).result
    ).toBeOk(Cl.some(Cl.tuple({
      player: Cl.standardPrincipal(wallet2),
      score: Cl.uint(200),
      alias: Cl.stringAscii('BOB'),
      'updated-at': Cl.uint(11)
    })));
  });

  it('enforces reset permission and retains prior season state', () => {
    simnet.callPublicFn(contract, 'verify-asset', [], deployer);
    simnet.callPublicFn(contract, 'submit-score', [Cl.uint(200), Cl.stringAscii('ACE')], wallet1);
    expect(simnet.callPublicFn(contract, 'start-next-season', [], wallet1).result).toBeErr(Cl.uint(100));
    expect(simnet.callPublicFn(contract, 'start-next-season', [], deployer).result).toBeOk(Cl.uint(2));
    expect(
      simnet.callReadOnlyFn(
        contract,
        'get-player-score',
        [Cl.uint(1), Cl.standardPrincipal(wallet1)],
        deployer
      ).result
    ).toBeSome(expect.anything());
  });
});
