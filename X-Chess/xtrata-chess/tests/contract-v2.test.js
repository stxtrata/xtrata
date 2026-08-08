// Version 2 charges a fee, which means it now touches money and has an owner.
// Both are things version 1 deliberately did not have, so the tests that matter
// most here are the ones that bound the damage: what an owner cannot do, and
// what happens to a move when the money will not move.

import { Cl } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';

const CONTRACT = 'xtrata-chess-log-v2';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer');
const alice = accounts.get('wallet_1');
const bob = accounts.get('wallet_2');

const DEFAULT_FEE = 10_000;
const CEILING = 1_000_000;

const read = (fn, args = []) => simnet.callReadOnlyFn(CONTRACT, fn, args, deployer).result;

function openGame(sender = alice, rulesHash = null) {
  const argument = rulesHash ? Cl.some(Cl.bufferFromHex(rulesHash)) : Cl.none();
  return simnet.callPublicFn(CONTRACT, 'open-game', [argument], sender);
}

function submitMove(game, mv, sender = alice) {
  return simnet.callPublicFn(CONTRACT, 'submit-move', [Cl.uint(game), Cl.stringAscii(mv)], sender);
}

function stxOf(address) {
  return simnet.getAssetsMap().get('STX')?.get(address) ?? 0n;
}

describe('defaults', () => {
  it('starts at 0.01 STX, owned by the deployer, paying the deployer', () => {
    expect(read('get-move-fee')).toBeUint(DEFAULT_FEE);
    expect(read('get-fee-ceiling')).toBeUint(CEILING);
    expect(read('get-owner')).toBeSome(Cl.principal(deployer));
    expect(read('get-fee-recipient')).toBePrincipal(deployer);
  });

  it('is a different format version from v1', () => {
    expect(read('get-format-version')).toBeUint(2);
  });
});

describe('charging', () => {
  it('moves the fee from the sender to the recipient', () => {
    const game = Number(openGame().result.value.value);

    const senderBefore = stxOf(alice);
    const recipientBefore = stxOf(deployer);

    submitMove(game, 'e2e4', alice);

    // The sender also pays a transaction fee, which simnet does not charge, so
    // the difference here is exactly the contract's fee.
    expect(stxOf(alice)).toBe(senderBefore - BigInt(DEFAULT_FEE));
    expect(stxOf(deployer)).toBe(recipientBefore + BigInt(DEFAULT_FEE));
  });

  it('charges for opening a game as well as for moving', () => {
    const before = stxOf(bob);
    openGame(bob);
    expect(stxOf(bob)).toBe(before - BigInt(DEFAULT_FEE));
  });

  it('does not charge for a submission it was never going to store', () => {
    const game = Number(openGame().result.value.value);
    const before = stxOf(alice);

    expect(submitMove(game, 'e2e', alice).result).toBeErr(Cl.uint(101));
    expect(submitMove(999_999, 'e2e4', alice).result).toBeErr(Cl.uint(100));

    // A refusal should not cost anything: nothing was written.
    expect(stxOf(alice)).toBe(before);
  });

  it('skips a transfer to self rather than attempting one', () => {
    const game = Number(openGame(deployer).result.value.value);
    const before = stxOf(deployer);
    expect(submitMove(game, 'e2e4', deployer).result).toBeOk(Cl.uint(0));
    expect(stxOf(deployer)).toBe(before);
  });

  it('still stores junk of the right length, and charges for it', () => {
    // The contract forms no opinion about chess in v2 either. A fee buys a slot
    // in the log, not a legal move.
    const game = Number(openGame().result.value.value);
    const before = stxOf(alice);
    expect(submitMove(game, 'zzzz', alice).result).toBeOk(Cl.uint(0));
    expect(stxOf(alice)).toBe(before - BigInt(DEFAULT_FEE));
  });
});

describe('a fee of zero', () => {
  it('turns charging off entirely', () => {
    simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(0)], deployer);
    const game = Number(openGame().result.value.value);
    const before = stxOf(alice);

    expect(submitMove(game, 'e2e4', alice).result).toBeOk(Cl.uint(0));
    expect(stxOf(alice)).toBe(before);

    simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(DEFAULT_FEE)], deployer);
  });
});

describe('what an owner can do', () => {
  beforeEach(() => {
    simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(DEFAULT_FEE)], deployer);
    simnet.callPublicFn(CONTRACT, 'set-fee-recipient', [Cl.principal(deployer)], deployer);
  });

  it('changes the fee', () => {
    expect(simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(25_000)], deployer).result)
      .toBeOk(Cl.uint(25_000));
    expect(read('get-move-fee')).toBeUint(25_000);
  });

  it('changes who is paid', () => {
    simnet.callPublicFn(CONTRACT, 'set-fee-recipient', [Cl.principal(bob)], deployer);
    const game = Number(openGame().result.value.value);
    const before = stxOf(bob);
    submitMove(game, 'e2e4', alice);
    expect(stxOf(bob)).toBeGreaterThan(before);
  });
});

describe('what an owner cannot do', () => {
  it('cannot charge more than the ceiling, which is in the code', () => {
    // The whole point of a constant ceiling: an owner cannot price the board
    // out of existence, however much they want to.
    expect(
      simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(CEILING + 1)], deployer).result
    ).toBeErr(Cl.uint(104));

    expect(
      simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(1_000_000_000)], deployer).result
    ).toBeErr(Cl.uint(104));

    // The ceiling itself is allowed.
    expect(simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(CEILING)], deployer).result)
      .toBeOk(Cl.uint(CEILING));
    simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(DEFAULT_FEE)], deployer);
  });

  it('cannot touch a game, a move, or the log', () => {
    // There is no way for an owner to rewrite history, and this asserts the
    // absence rather than assuming it.
    const source = simnet.getContractSource(`${deployer}.${CONTRACT}`);
    expect(source).not.toMatch(/map-delete/);
    const publicFns = simnet
      .getContractsInterfaces()
      .get(`${deployer}.${CONTRACT}`)
      .functions.filter((f) => f.access === 'public')
      .map((f) => f.name)
      .sort();
    expect(publicFns).toEqual([
      'open-game',
      'set-fee-recipient',
      'set-move-fee',
      'submit-move',
      'transfer-ownership'
    ]);
  });
});

describe('who is not the owner', () => {
  it('cannot change the fee or the recipient', () => {
    expect(simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(1)], alice).result)
      .toBeErr(Cl.uint(103));
    expect(simnet.callPublicFn(CONTRACT, 'set-fee-recipient', [Cl.principal(alice)], alice).result)
      .toBeErr(Cl.uint(103));
    expect(
      simnet.callPublicFn(CONTRACT, 'transfer-ownership', [Cl.some(Cl.principal(alice))], alice)
        .result
    ).toBeErr(Cl.uint(103));
  });
});

describe('renouncing', () => {
  // The path back to v1's best property: once nobody owns it, the fee is frozen
  // and the contract is as unowned as v1 is.
  it('freezes the fee for good', () => {
    simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(5_000)], deployer);
    expect(simnet.callPublicFn(CONTRACT, 'transfer-ownership', [Cl.none()], deployer).result)
      .toBeOk(Cl.none());

    expect(read('get-owner')).toBeNone();

    // Nobody can change anything now, including whoever used to own it.
    for (const who of [deployer, alice, bob]) {
      expect(simnet.callPublicFn(CONTRACT, 'set-move-fee', [Cl.uint(0)], who).result)
        .toBeErr(Cl.uint(103));
      expect(
        simnet.callPublicFn(CONTRACT, 'transfer-ownership', [Cl.some(Cl.principal(who))], who)
          .result
      ).toBeErr(Cl.uint(103));
    }

    expect(read('get-move-fee')).toBeUint(5_000);
  });

  it('leaves the game itself working exactly as before', () => {
    const game = Number(openGame().result.value.value);
    expect(submitMove(game, 'e2e4', alice).result).toBeOk(Cl.uint(0));
    expect(read('get-game', [Cl.uint(game)])).not.toBeNone();
  });
});

describe('what v2 kept from v1', () => {
  it('still refuses anything that is not four or five characters', () => {
    const game = Number(openGame().result.value.value);
    expect(submitMove(game, '').result).toBeErr(Cl.uint(101));
    expect(submitMove(game, 'e2e').result).toBeErr(Cl.uint(101));
  });

  it('still lets anyone move, in any order, for either side', () => {
    const game = Number(openGame().result.value.value);
    expect(submitMove(game, 'e7e5', alice).result).toBeOk(Cl.uint(0));
    expect(submitMove(game, 'e2e4', bob).result).toBeOk(Cl.uint(1));
    expect(submitMove(game, 'g1f3', bob).result).toBeOk(Cl.uint(2));
  });

  it('still records the rules commitment unexamined', () => {
    const hash = 'ab'.repeat(32);
    const game = Number(openGame(alice, hash).result.value.value);
    expect(read('get-game', [Cl.uint(game)]).value.value['rules-hash']).toBeSome(
      Cl.bufferFromHex(hash)
    );
  });

  it('still pages the log the same way', () => {
    const game = Number(openGame().result.value.value);
    submitMove(game, 'e2e4');
    const page = read('get-page', [Cl.uint(game), Cl.uint(0)]).value;
    expect(page).toHaveLength(50);
    expect(page[0].value.value.mv).toBeAscii('e2e4');
    expect(page[1]).toBeNone();
  });
});
