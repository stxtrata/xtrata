// Contract behaviour, and the parity that lets simulation mode stand in for it.
//
// The second half matters most: MockChain is only a useful test surface if it
// behaves like the deployed contract. Every scenario below runs against both
// and compares, so a change to one that is not a change to the other fails here
// rather than on chain.

import { Cl } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockChain } from '../src/mock-chain.js';
import { ERR, FORMAT_VERSION, MAX_SEQ, PAGE_SIZE } from '../src/protocol.js';

const CONTRACT = 'xtrata-chess-log-v1';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer');
const alice = accounts.get('wallet_1');
const bob = accounts.get('wallet_2');

function openGame(sender = deployer) {
  return simnet.callPublicFn(CONTRACT, 'open-game', [], sender);
}

function submitMove(game, mv, sender = deployer) {
  return simnet.callPublicFn(
    CONTRACT,
    'submit-move',
    [Cl.uint(game), Cl.stringAscii(mv)],
    sender
  );
}

function readOnly(fn, args = []) {
  return simnet.callReadOnlyFn(CONTRACT, fn, args, deployer).result;
}

describe('constants agree with src/protocol.js', () => {
  it('format version', () => {
    expect(readOnly('get-format-version')).toBeUint(FORMAT_VERSION);
  });

  it('max seq', () => {
    expect(readOnly('get-max-seq')).toBeUint(MAX_SEQ);
  });

  it('page size', () => {
    const game = Number(openGame().result.value.value);
    const page = readOnly('get-page', [Cl.uint(game), Cl.uint(0)]);
    expect(page.value).toHaveLength(PAGE_SIZE);
  });
});

describe('opening games', () => {
  it('numbers games from one and counts them', () => {
    const before = Number(readOnly('get-game-count').value);

    const first = openGame(alice);
    const second = openGame(bob);

    expect(first.result).toBeOk(Cl.uint(before + 1));
    expect(second.result).toBeOk(Cl.uint(before + 2));
    expect(readOnly('get-game-count')).toBeUint(before + 2);
  });

  it('records who opened it', () => {
    const game = Number(openGame(alice).result.value.value);
    const entry = readOnly('get-game', [Cl.uint(game)]).value.value;
    expect(entry['opened-by']).toBePrincipal(alice);
    expect(entry['next-seq']).toBeUint(0);
  });

  it('reports nothing for a game that does not exist', () => {
    expect(readOnly('get-game', [Cl.uint(999_999)])).toBeNone();
  });
});

describe('submitting moves', () => {
  let game;

  beforeEach(() => {
    game = Number(openGame().result.value.value);
  });

  it('returns the sequence number and advances it', () => {
    expect(submitMove(game, 'e2e4').result).toBeOk(Cl.uint(0));
    expect(submitMove(game, 'e7e5').result).toBeOk(Cl.uint(1));
    expect(submitMove(game, 'e7e8q').result).toBeOk(Cl.uint(2));

    const entry = readOnly('get-game', [Cl.uint(game)]).value.value;
    expect(entry['next-seq']).toBeUint(3);
  });

  it('rejects a game that does not exist', () => {
    expect(submitMove(999_999, 'e2e4').result).toBeErr(Cl.uint(ERR.NO_GAME));
  });

  it('rejects anything that is not four or five characters', () => {
    // Six characters cannot even be built: the parameter is (string-ascii 5),
    // so the type is the first line of defence and the length check is the
    // second.
    expect(submitMove(game, '').result).toBeErr(Cl.uint(ERR.BAD_LENGTH));
    expect(submitMove(game, 'e2e').result).toBeErr(Cl.uint(ERR.BAD_LENGTH));
    expect(submitMove(game, 'e2').result).toBeErr(Cl.uint(ERR.BAD_LENGTH));
  });

  it('stores the sender and the height', () => {
    submitMove(game, 'e2e4', alice);
    const entry = readOnly('get-move', [Cl.uint(game), Cl.uint(0)]).value.value;
    expect(entry.mv).toBeAscii('e2e4');
    expect(entry.sender).toBePrincipal(alice);
  });

  it('accepts junk that happens to be the right length', () => {
    // The contract forms no opinion about chess. Replay throws these away.
    expect(submitMove(game, 'zzzz').result).toBeOk(Cl.uint(0));
    expect(submitMove(game, '0000').result).toBeOk(Cl.uint(1));
    expect(submitMove(game, 'hello').result).toBeOk(Cl.uint(2));
  });
});

describe('the board is wide open', () => {
  let game;

  beforeEach(() => {
    game = Number(openGame().result.value.value);
  });

  it('lets anyone move, with no binding of a colour to an address', () => {
    expect(submitMove(game, 'e2e4', alice).result).toBeOk(Cl.uint(0));
    expect(submitMove(game, 'e7e5', bob).result).toBeOk(Cl.uint(1));
    expect(submitMove(game, 'g1f3', alice).result).toBeOk(Cl.uint(2));
  });

  it('lets the same address move twice in a row', () => {
    expect(submitMove(game, 'e2e4', alice).result).toBeOk(Cl.uint(0));
    expect(submitMove(game, 'e7e5', alice).result).toBeOk(Cl.uint(1));
  });

  it('does not enforce turn order, because replay does', () => {
    // A move for Black submitted first. The contract stores it happily; the
    // board skips it, because it is not legal in the opening position.
    expect(submitMove(game, 'e7e5').result).toBeOk(Cl.uint(0));
  });
});

describe('paging', () => {
  it('fills from the start and leaves trailing nones', () => {
    const game = Number(openGame().result.value.value);
    submitMove(game, 'e2e4');
    submitMove(game, 'e7e5');

    const page = readOnly('get-page', [Cl.uint(game), Cl.uint(0)]).value;
    expect(page[0].value.value.mv).toBeAscii('e2e4');
    expect(page[1].value.value.mv).toBeAscii('e7e5');
    expect(page[2]).toBeNone();
    expect(page[PAGE_SIZE - 1]).toBeNone();
  });

  it('reads from an offset', () => {
    const game = Number(openGame().result.value.value);
    for (let i = 0; i < 4; i++) submitMove(game, ['a2a3', 'b2b3', 'c2c3', 'd2d3'][i]);

    const page = readOnly('get-page', [Cl.uint(game), Cl.uint(2)]).value;
    expect(page[0].value.value.mv).toBeAscii('c2c3');
    expect(page[1].value.value.mv).toBeAscii('d2d3');
    expect(page[2]).toBeNone();
  });

  it('returns all nones past the end and for unknown games', () => {
    const game = Number(openGame().result.value.value);

    const past = readOnly('get-page', [Cl.uint(game), Cl.uint(500)]).value;
    expect(past).toHaveLength(PAGE_SIZE);
    for (const entry of past) expect(entry).toBeNone();

    const missing = readOnly('get-page', [Cl.uint(999_999), Cl.uint(0)]).value;
    expect(missing).toHaveLength(PAGE_SIZE);
    for (const entry of missing) expect(entry).toBeNone();
  });
});

// ---------------------------------------------------------------------------
// Parity
// ---------------------------------------------------------------------------

describe('MockChain matches the contract', () => {
  // Each step is applied to both, and the results are compared. Simulation mode
  // is only trustworthy while this passes.
  const SCRIPT = [
    { mv: 'e2e4', sender: 'alice' },
    { mv: 'e7e5', sender: 'bob' },
    { mv: 'e2e', sender: 'alice' }, // too short
    { mv: '', sender: 'bob' }, // empty
    { mv: 'zzzz', sender: 'alice' }, // junk, correct length
    { mv: 'g1f3', sender: 'alice' }, // same address twice running
    { mv: 'e7e8q', sender: 'bob' }, // five characters
    { mv: 'b8c6', sender: 'bob' }
  ];

  it('agrees on every write result and every read', () => {
    const mock = new MockChain();
    const mockGame = mock.openGame(alice).value;
    const chainGame = Number(openGame(alice).result.value.value);

    const senders = { alice, bob };

    for (const step of SCRIPT) {
      const principal = senders[step.sender];

      const mockResult = mock.submitMove(mockGame, step.mv, principal);
      const chainResult = submitMove(chainGame, step.mv, principal);

      if (mockResult.ok) {
        expect(chainResult.result).toBeOk(Cl.uint(mockResult.value));
      } else {
        expect(chainResult.result).toBeErr(Cl.uint(mockResult.error));
      }
    }

    // Sequence counters agree.
    const mockGameState = mock.getGame(mockGame);
    const chainGameState = readOnly('get-game', [Cl.uint(chainGame)]).value.value;
    expect(chainGameState['next-seq']).toBeUint(mockGameState.nextSeq);
    expect(chainGameState['opened-by']).toBePrincipal(mockGameState.openedBy);

    // Stored entries agree, move for move and sender for sender.
    const mockPage = mock.getPage(mockGame, 0);
    const chainPage = readOnly('get-page', [Cl.uint(chainGame), Cl.uint(0)]).value;

    for (let i = 0; i < PAGE_SIZE; i++) {
      if (mockPage[i] === null) {
        expect(chainPage[i]).toBeNone();
        continue;
      }
      const entry = chainPage[i].value.value;
      expect(entry.mv).toBeAscii(mockPage[i].mv);
      expect(entry.sender).toBePrincipal(mockPage[i].sender);
    }
  });

  it('agrees that an unknown game cannot be written to', () => {
    const mock = new MockChain();
    const mockResult = mock.submitMove(42, 'e2e4', alice);
    const chainResult = submitMove(999_998, 'e2e4', alice);

    expect(mockResult).toEqual({ ok: false, error: ERR.NO_GAME });
    expect(chainResult.result).toBeErr(Cl.uint(ERR.NO_GAME));
  });
});
