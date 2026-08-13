// How long the board waits, and for what.
//
// This is the policy that decides whether Connect works, and it has now been
// wrong in both directions on a real page:
//
//   * Fifteen seconds a method, four methods, against a provider that never
//     settles - a minute of a board that looked like it had not heard the click.
//   * Then six seconds a method, which is a probe's patience and not a person's:
//     it abandons a wallet dialog while it is still being read.
//
// So the assertions here are about TIME, and every one of them is written
// against an injected clock. Nothing in this file waits for anything.

import { describe, expect, it } from 'vitest';
import { CONNECT_MS, PROBE_MS, connectWallet } from '../../packages/wallet/connect.js';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

interface Asked {
  method: string;
  timeoutMs: number | undefined;
}

/** A wallet layer that records what it was asked and how patiently. */
function recorder(
  answer: (method: string) => unknown
): { call: (m: string, p: unknown, o?: { timeoutMs?: number }) => Promise<{ result: unknown }>; asked: Asked[] } {
  const asked: Asked[] = [];
  return {
    asked,
    async call(method, _params, options) {
      asked.push({ method, timeoutMs: options?.timeoutMs });
      const result = answer(method);
      if (result instanceof Error) throw result;
      return { result };
    }
  };
}

const refuses = (): unknown => new Error('no provider could perform this');

describe('connecting a wallet', () => {
  it('gives a dialog a person’s worth of time, not a probe’s', async () => {
    // The regression. `wallet_connect` opens something a human reads; six
    // seconds abandons a request they are in the middle of approving.
    const { call, asked } = recorder((method) =>
      method === 'wallet_connect' ? { address: ADDRESS } : refuses()
    );

    const session = await connectWallet({
      call,
      providerCount: () => 1,
      bridged: () => false,
      now: () => 1_000
    });

    expect(session.address).toBe(ADDRESS);
    const connect = asked.find((entry) => entry.method === 'wallet_connect');
    expect(connect?.timeoutMs, 'a wallet dialog was given a probe’s patience').toBe(CONNECT_MS);
  });

  it('does not let one silent provider eat the time the next one needs', async () => {
    // Three providers and one budget. Whatever the first does with its share,
    // the other two must still get asked - which is the fault that started all
    // of this, when Xverse's BitcoinProvider never settled and ranked first.
    const { call, asked } = recorder((method) =>
      method === 'wallet_connect' ? { address: ADDRESS } : refuses()
    );

    await connectWallet({
      call,
      providerCount: () => 3,
      bridged: () => false,
      now: () => 0
    });

    const connect = asked.find((entry) => entry.method === 'wallet_connect');
    expect(connect?.timeoutMs).toBe(Math.floor(CONNECT_MS / 3));
    expect(
      (connect?.timeoutMs ?? 0) * 3,
      'three providers at this timeout would outlast the whole budget'
    ).toBeLessThanOrEqual(CONNECT_MS);
  });

  it('spends one budget across every question, not one budget each', async () => {
    // Four methods against three providers, each given a full patience, is
    // twenty-four minutes of a board that looks dead. The clock here advances by
    // exactly what each question was granted - a wallet that uses all of it.
    let clock = 0;
    const { call, asked } = recorder(() => refuses());
    const spending: Asked[] = asked;

    await expect(
      connectWallet({
        call: async (method, params, options) => {
          const answer = call(method, params, options);
          clock += options?.timeoutMs ?? 0;
          return answer;
        },
        providerCount: () => 3,
        bridged: () => false,
        now: () => clock
      })
    ).rejects.toThrow(/did not give an address/);

    const granted = spending.reduce((total, entry) => total + (entry.timeoutMs ?? 0), 0);
    expect(granted, 'the questions together outlast the whole budget').toBeLessThanOrEqual(
      CONNECT_MS + PROBE_MS
    );
  });

  it('gives up rather than asking a question it has no time left for', async () => {
    let clock = 0;
    const { call, asked } = recorder(() => refuses());

    await expect(
      connectWallet({
        call: async (method, params, options) => {
          const answer = call(method, params, options);
          clock += options?.timeoutMs ?? 0;
          return answer;
        },
        providerCount: () => 1,
        bridged: () => false,
        now: () => clock
      })
    ).rejects.toThrow(/did not give an address/);

    // One provider gets the whole budget on the first question, so there is
    // nothing left for the other three and it must not pretend otherwise.
    expect(asked.map((entry) => entry.method)).toEqual(['wallet_connect']);
  });

  it('asks the host what it already knows before opening anything', async () => {
    // With a bridge the shim ranks first and answers by asking the Xtrata site,
    // which is already connected - so the address arrives with nothing opening
    // and nobody clicking. It has to be asked FIRST, or a dialog opens for
    // something already known.
    const { call, asked } = recorder((method) =>
      method === 'stx_getAddresses' ? { address: ADDRESS } : refuses()
    );

    const session = await connectWallet({
      call,
      providerCount: () => 1,
      bridged: () => true,
      now: () => 0
    });

    expect(session.address).toBe(ADDRESS);
    expect(asked[0].method).toBe('stx_getAddresses');
    expect(asked[0].timeoutMs, 'a question that opens nothing waited like a dialog').toBe(PROBE_MS);
    expect(asked.map((entry) => entry.method), 'a dialog was opened anyway').not.toContain(
      'wallet_connect'
    );
  });

  it('does not probe a real wallet that way, because reading may prompt it', async () => {
    // With no bridge the shim ranks last, so the same question reaches an
    // extension instead - which may open its own dialog for it. Probing that at
    // six seconds is the bug this file exists for, one method along.
    const { call, asked } = recorder(() => refuses());

    await expect(
      connectWallet({ call, providerCount: () => 1, bridged: () => false, now: () => 0 })
    ).rejects.toThrow();

    expect(asked[0].method, 'a real wallet was probed before being asked to connect').toBe(
      'wallet_connect'
    );
  });

  it('says there is no wallet differently from a wallet that would not say', async () => {
    // Two different problems needing two different answers: install something,
    // versus try again.
    const { call } = recorder(() => refuses());

    await expect(
      connectWallet({ call, providerCount: () => 0, bridged: () => false, now: () => 0 })
    ).rejects.toMatchObject({ code: 'NO_WALLET' });

    await expect(
      connectWallet({ call, providerCount: () => 2, bridged: () => false, now: () => 0 })
    ).rejects.toMatchObject({ code: 'NO_ADDRESS' });
  });

  it('moves on when a method answers without an address', async () => {
    // The shim with nothing stored answers `{ addresses: [] }` rather than
    // failing, so "it resolved" is not the same as "we are connected".
    const { call, asked } = recorder((method) =>
      method === 'wallet_connect' ? { addresses: [], accounts: [] } : { address: ADDRESS }
    );

    const session = await connectWallet({
      call,
      providerCount: () => 1,
      bridged: () => false,
      now: () => 0
    });

    expect(session.address).toBe(ADDRESS);
    expect(asked.map((entry) => entry.method)).toEqual(['wallet_connect', 'stx_requestAccounts']);
  });
});
