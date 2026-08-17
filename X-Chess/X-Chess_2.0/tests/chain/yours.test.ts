// Finding a player's games when the list cannot show them.

import { describe, expect, it, beforeEach } from 'vitest';
import { YourGames } from '../../packages/chain/yours.js';
import type { Endpoint } from '../../packages/chain/endpoint.js';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary';
const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

/** A transaction of the shape the API actually returns. See the live check. */
function move(game: number, id: string, status = 'success'): unknown {
  return {
    tx_id: id,
    tx_type: 'contract_call',
    tx_status: status,
    contract_call: {
      contract_id: CONTRACT,
      function_name: 'submit',
      function_args: [{ repr: `u${game}` }, { repr: '"e2e4"' }]
    }
  };
}

/** An endpoint serving fixed pages, counting what was asked of it. */
function serving(pages: unknown[][], options: { fail?: number } = {}): Endpoint & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    async request(path: string) {
      calls.push(path);
      if (options.fail !== undefined && calls.length > options.fail) {
        return { ok: false, status: 429, json: async () => ({}) } as Response;
      }
      const at = Number(/offset=(\d+)/.exec(path)?.[1] ?? '0') / 50;
      const results = pages[at] ?? [];
      return { ok: true, status: 200, json: async () => ({ results }) } as Response;
    }
  } as unknown as Endpoint & { calls: string[] };
}

/** A localStorage that behaves, for a test environment that has none. */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v)
  } as Storage;
}

beforeEach(() => {
  (globalThis as unknown as Record<string, unknown>).localStorage = fakeStorage();
});

describe('the games an address is in', () => {
  it('finds a game far outside the newest twenty-five', async () => {
    // The whole point. Game 3 on a contract with hundreds would never appear in
    // a window of the newest ids, and its player is the one waiting to move.
    const yours = new YourGames({ endpoint: serving([[move(3, '0xa')]]), contractId: CONTRACT });
    const found = await yours.discover(ALICE);
    expect(found.ids).toEqual([3]);
    expect(found.fresh).toEqual([3]);
  });

  it('remembers across a reload, with no network at all', async () => {
    const yours = new YourGames({ endpoint: serving([[move(7, '0xa')]]), contractId: CONTRACT });
    await yours.discover(ALICE);

    // A different instance, as a new page load would be.
    const later = new YourGames({ endpoint: serving([]), contractId: CONTRACT });
    expect(later.known(ALICE)).toEqual([7]);
  });

  it('reads one page on a return visit instead of walking again', async () => {
    const pages = [[move(9, '0xnewest'), move(9, '0xb')], [move(8, '0xc')]];
    const first = serving(pages);
    await new YourGames({ endpoint: first, contractId: CONTRACT }).discover(ALICE);
    const walked = first.calls.length;

    const again = serving(pages);
    await new YourGames({ endpoint: again, contractId: CONTRACT }).discover(ALICE);
    // Stopped at the transaction the first walk had already processed.
    expect(again.calls.length).toBe(1);
    expect(again.calls.length).toBeLessThan(walked);
  });

  it('keeps what it knew when the endpoint refuses', async () => {
    // The PlayerNames lesson: a rate limit must never read as an absence, or a
    // player's own games disappear from their board for the rest of the session.
    const yours = new YourGames({ endpoint: serving([[move(4, '0xa')]]), contractId: CONTRACT });
    await yours.discover(ALICE);

    const broken = new YourGames({ endpoint: serving([], { fail: 0 }), contractId: CONTRACT });
    await expect(broken.discover(ALICE)).rejects.toThrow(/429/);
    expect(broken.known(ALICE)).toEqual([4]);
  });

  it('ignores a move that the contract rejected', async () => {
    const yours = new YourGames({
      endpoint: serving([[move(5, '0xa', 'abort_by_response')]]),
      contractId: CONTRACT
    });
    expect((await yours.discover(ALICE)).ids).toEqual([]);
  });

  it('ignores another contract entirely', async () => {
    const other = {
      tx_id: '0xa',
      tx_type: 'contract_call',
      tx_status: 'success',
      contract_call: {
        contract_id: 'SP000000000000000000002Q6VF78.something-else',
        function_name: 'submit',
        function_args: [{ repr: 'u5' }]
      }
    };
    const yours = new YourGames({ endpoint: serving([[other]]), contractId: CONTRACT });
    expect((await yours.discover(ALICE)).ids).toEqual([]);
  });

  it('does not count opening a game as playing in one', async () => {
    // An organiser opens games it is not in. `open-game`'s first argument is a
    // rules hash, so reading it as a game id would invent games too.
    const opened = {
      tx_id: '0xa',
      tx_type: 'contract_call',
      tx_status: 'success',
      contract_call: {
        contract_id: CONTRACT,
        function_name: 'open-game',
        function_args: [{ repr: '0x1234' }, { repr: 'true' }]
      }
    };
    const yours = new YourGames({ endpoint: serving([[opened]]), contractId: CONTRACT });
    expect((await yours.discover(ALICE)).ids).toEqual([]);
  });

  it('says when it stopped early rather than implying it read everything', async () => {
    const full = (n: number): unknown[] =>
      Array.from({ length: 50 }, (_, i) => move(n * 100 + i, `0x${n}-${i}`));
    const yours = new YourGames({
      endpoint: serving([full(1), full(2), full(3), full(4), full(5)]),
      contractId: CONTRACT,
      maxPages: 2
    });
    const found = await yours.discover(ALICE);
    expect(found.complete).toBe(false);
    expect(found.ids.length).toBe(100);
  });

  it('keeps a remembered game that history no longer reaches', async () => {
    const yours = new YourGames({ endpoint: serving([[move(2, '0xold')]]), contractId: CONTRACT });
    await yours.discover(ALICE);
    yours.remember(ALICE, 999);
    expect(yours.known(ALICE)).toEqual([999, 2]);
  });

  it('separates one wallet from another', async () => {
    const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    const yours = new YourGames({ endpoint: serving([]), contractId: CONTRACT });
    yours.remember(ALICE, 1);
    yours.remember(BOB, 2);
    expect(yours.known(ALICE)).toEqual([1]);
    expect(yours.known(BOB)).toEqual([2]);
  });
});
