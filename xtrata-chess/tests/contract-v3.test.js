// Version 3 prices opening a game separately from playing one.
//
// v2 charged the same fee for both, which gets the incentives backwards: a move
// should be cheap, a game id is permanent. The tests that matter here are the
// ones about the bounds, because the open fee is the first thing in this
// contract with a floor as well as a ceiling, and a floor is a real constraint
// on the owner rather than a default they can undo.

import { Cl } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';

const CONTRACT = 'xtrata-chess-log-v3';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer');
const alice = accounts.get('wallet_1');
const bob = accounts.get('wallet_2');

const MOVE_FEE = 10_000;          // 0.01 STX
const OPEN_FEE = 1_000_000;       // 1 STX
const OPEN_CEILING = 10_000_000;  // 10 STX
const OPEN_FLOOR = 100;           // 0.0001 STX

const read = (fn, args = []) => simnet.callReadOnlyFn(CONTRACT, fn, args, deployer).result;
const call = (fn, args, sender) => simnet.callPublicFn(CONTRACT, fn, args, sender).result;

const openGame = (sender = alice, rulesHash = null) =>
  simnet.callPublicFn(
    CONTRACT,
    'open-game',
    [rulesHash ? Cl.some(Cl.bufferFromHex(rulesHash)) : Cl.none()],
    sender
  );

const submitMove = (game, mv, sender = alice) =>
  simnet.callPublicFn(CONTRACT, 'submit-move', [Cl.uint(game), Cl.stringAscii(mv)], sender);

const stxOf = (address) => simnet.getAssetsMap().get('STX')?.get(address) ?? 0n;

beforeEach(() => {
  call('set-move-fee', [Cl.uint(MOVE_FEE)], deployer);
  call('set-open-fee', [Cl.uint(OPEN_FEE)], deployer);
  call('set-fee-recipient', [Cl.principal(deployer)], deployer);
});

describe('defaults', () => {
  it('opens at 1 STX and moves at 0.01 STX', () => {
    expect(read('get-open-fee')).toBeUint(OPEN_FEE);
    expect(read('get-move-fee')).toBeUint(MOVE_FEE);
  });

  it('bounds the open fee at ten STX and 0.0001 STX', () => {
    expect(read('get-open-fee-ceiling')).toBeUint(OPEN_CEILING);
    expect(read('get-open-fee-floor')).toBeUint(OPEN_FLOOR);
  });

  it('is a different format version from v2', () => {
    expect(read('get-format-version')).toBeUint(3);
  });
});

describe('charging the two fees apart', () => {
  it('takes the open fee for a game and the move fee for a move', () => {
    const beforeOpen = stxOf(alice);
    const game = Number(openGame().result.value.value);
    expect(stxOf(alice)).toBe(beforeOpen - BigInt(OPEN_FEE));

    const beforeMove = stxOf(alice);
    submitMove(game, 'e2e4');
    expect(stxOf(alice)).toBe(beforeMove - BigInt(MOVE_FEE));
  });

  // The whole point of the split: moving should not cost what opening costs.
  it('charges a hundred times more to open than to move, at the defaults', () => {
    expect(OPEN_FEE / MOVE_FEE).toBe(100);
  });

  it('pays both to the recipient', () => {
    call('set-fee-recipient', [Cl.principal(bob)], deployer);
    const before = stxOf(bob);
    const game = Number(openGame().result.value.value);
    submitMove(game, 'e2e4');
    expect(stxOf(bob)).toBe(before + BigInt(OPEN_FEE) + BigInt(MOVE_FEE));
  });

  it('does not charge for a submission it was never going to store', () => {
    const game = Number(openGame().result.value.value);
    const before = stxOf(alice);
    expect(submitMove(game, 'e2e').result).toBeErr(Cl.uint(101));
    expect(submitMove(999_999, 'e2e4').result).toBeErr(Cl.uint(100));
    expect(stxOf(alice)).toBe(before);
  });

  // wallet_3 is funded with 0.05 STX in settings/Devnet.toml: enough for a few
  // moves, nowhere near enough to open a game.
  it('leaves no game behind when the sender cannot pay to open one', () => {
    const poor = accounts.get('wallet_3');
    const countBefore = Number(read('get-game-count').value);

    const outcome = openGame(poor).result;
    expect(outcome.type).toBe('err');

    // Nothing written, no id consumed, and the money still where it was.
    expect(read('get-game-count')).toBeUint(countBefore);
    expect(read('get-game', [Cl.uint(countBefore + 1)])).toBeNone();
    expect(stxOf(poor)).toBe(50_000n);
  });

  it('lets that same sender make moves, which is the point of pricing them apart', () => {
    const poor = accounts.get('wallet_3');
    const game = Number(openGame().result.value.value);
    const before = stxOf(poor);
    expect(submitMove(game, 'e2e4', poor).result).toBeOk(Cl.uint(0));
    expect(stxOf(poor)).toBe(before - BigInt(MOVE_FEE));
  });

  it('skips a transfer to self rather than attempting one', () => {
    const before = stxOf(deployer);
    const game = Number(openGame(deployer).result.value.value);
    expect(submitMove(game, 'e2e4', deployer).result).toBeOk(Cl.uint(0));
    expect(stxOf(deployer)).toBe(before);
  });
});

describe('what the owner can do to the open fee', () => {
  it('moves it anywhere between the floor and the ceiling', () => {
    for (const amount of [OPEN_FLOOR, 500_000, OPEN_CEILING]) {
      expect(call('set-open-fee', [Cl.uint(amount)], deployer)).toBeOk(Cl.uint(amount));
      expect(read('get-open-fee')).toBeUint(amount);
    }
  });

  it('changes it without touching the move fee', () => {
    call('set-open-fee', [Cl.uint(2_000_000)], deployer);
    expect(read('get-move-fee')).toBeUint(MOVE_FEE);

    call('set-move-fee', [Cl.uint(0)], deployer);
    expect(read('get-open-fee')).toBeUint(2_000_000);
  });
});

describe('what the owner cannot do to the open fee', () => {
  it('cannot go above ten STX', () => {
    expect(call('set-open-fee', [Cl.uint(OPEN_CEILING + 1)], deployer)).toBeErr(Cl.uint(104));
    expect(call('set-open-fee', [Cl.uint(1_000_000_000)], deployer)).toBeErr(Cl.uint(104));
  });

  // The unusual one. Opening is the only call that costs permanent storage no
  // matter what follows it, so it can never be free — not even by choice.
  it('cannot make opening free, or cheaper than the floor', () => {
    expect(call('set-open-fee', [Cl.uint(0)], deployer)).toBeErr(Cl.uint(106));
    expect(call('set-open-fee', [Cl.uint(OPEN_FLOOR - 1)], deployer)).toBeErr(Cl.uint(106));
    expect(read('get-open-fee')).toBeUint(OPEN_FEE);
  });

  it('the move fee may still be zero, which is the difference between them', () => {
    expect(call('set-move-fee', [Cl.uint(0)], deployer)).toBeOk(Cl.uint(0));
    const game = Number(openGame().result.value.value);
    const before = stxOf(alice);
    expect(submitMove(game, 'e2e4').result).toBeOk(Cl.uint(0));
    expect(stxOf(alice)).toBe(before);
  });
});

describe('who is not the owner', () => {
  it('cannot change either fee', () => {
    expect(call('set-open-fee', [Cl.uint(OPEN_FLOOR)], alice)).toBeErr(Cl.uint(103));
    expect(call('set-move-fee', [Cl.uint(0)], alice)).toBeErr(Cl.uint(103));
  });
});

describe('renouncing', () => {
  it('freezes both fees, and the floor outlives the owner', () => {
    call('set-open-fee', [Cl.uint(750_000)], deployer);
    expect(call('transfer-ownership', [Cl.none()], deployer)).toBeOk(Cl.none());

    for (const who of [deployer, alice, bob]) {
      expect(call('set-open-fee', [Cl.uint(OPEN_FLOOR)], who)).toBeErr(Cl.uint(103));
      expect(call('set-move-fee', [Cl.uint(0)], who)).toBeErr(Cl.uint(103));
    }
    expect(read('get-open-fee')).toBeUint(750_000);

    // And a game still opens, at the frozen price.
    const before = stxOf(alice);
    expect(openGame().result).toBeOk(Cl.uint(Number(read('get-game-count').value)));
    expect(stxOf(alice)).toBe(before - 750_000n);
  });
});

describe('what v3 kept', () => {
  it('still lets anyone move, in any order, for either side', () => {
    const game = Number(openGame().result.value.value);
    expect(submitMove(game, 'e7e5', alice).result).toBeOk(Cl.uint(0));
    expect(submitMove(game, 'e2e4', bob).result).toBeOk(Cl.uint(1));
  });

  it('still stores junk of the right length, and charges for it', () => {
    const game = Number(openGame().result.value.value);
    const before = stxOf(alice);
    expect(submitMove(game, 'zzzz').result).toBeOk(Cl.uint(0));
    expect(stxOf(alice)).toBe(before - BigInt(MOVE_FEE));
  });

  it('still records the rules commitment unexamined', () => {
    const hash = 'ab'.repeat(32);
    const game = Number(openGame(alice, hash).result.value.value);
    expect(read('get-game', [Cl.uint(game)]).value.value['rules-hash']).toBeSome(
      Cl.bufferFromHex(hash)
    );
  });

  it('still has no way for an owner to touch a game, a move, or the log', () => {
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
      'set-open-fee',
      'submit-move',
      'transfer-ownership'
    ]);
  });
});
