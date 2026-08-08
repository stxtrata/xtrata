// Post conditions, checked byte for byte against the SDK.
//
// These are hand-serialised because Xverse hangs forever on the object form, so
// there is no library between us and the wire. That makes the SDK the only
// oracle, and this file the only thing standing between a wrong byte and a
// transaction that aborts while still charging its sender the network fee.

import { Pc, postConditionToHex } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import {
  SENT_EQUAL_TO,
  SENT_LESS_THAN_OR_EQUAL,
  guardFor,
  stxFromAccount,
  stxFromContract,
  stxFromOrigin
} from '../../packages/wallet/postconditions.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const CONTRACT_ID = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1';

const sdk = (pc: Parameters<typeof postConditionToHex>[0]): string =>
  postConditionToHex(pc).replace(/^0x/, '').toLowerCase();

describe('an account sending STX', () => {
  it('matches the SDK for "at most"', () => {
    for (const amount of [0n, 1n, 10_000n, 1_000_000n, 2n ** 63n - 1n]) {
      expect(stxFromAccount(ALICE, amount), String(amount)).toBe(
        sdk(Pc.principal(ALICE).willSendLte(amount).ustx())
      );
    }
  });

  it('matches the SDK for "exactly"', () => {
    expect(stxFromAccount(ALICE, 1_560_000n, SENT_EQUAL_TO)).toBe(
      sdk(Pc.principal(ALICE).willSendEq(1_560_000n).ustx())
    );
  });
});

describe('a contract sending STX', () => {
  it('matches the SDK', () => {
    // The condition the legacy board never needed. Without it, in deny mode,
    // every sponsored move aborts, because the rebate is an uncovered transfer.
    for (const amount of [1n, 10_000n, 60_000n]) {
      expect(stxFromContract(CONTRACT_ID, amount), String(amount)).toBe(
        sdk(Pc.principal(CONTRACT_ID).willSendLte(amount).ustx())
      );
    }
  });

  it('handles a contract name of an awkward length', () => {
    for (const name of ['a', 'xchess-core-v1', 'a-rather-long-contract-name-v12']) {
      const id = `${ALICE}.${name}`;
      expect(stxFromContract(id, 42n), name).toBe(sdk(Pc.principal(id).willSendLte(42n).ustx()));
    }
  });

  it('refuses something that is not a contract id', () => {
    expect(() => stxFromContract(ALICE, 1n)).toThrow(/not a contract id/);
  });
});

describe('the guard for a call', () => {
  it('denies everything when nothing should move', () => {
    // The strongest thing a wallet can be asked for, and exactly right for a
    // call that transfers nothing.
    const guard = guardFor({ sender: ALICE, contractId: CONTRACT_ID, sends: 0n, contractSends: 0n });
    expect(guard).toEqual({ postConditionMode: 'deny', postConditions: [] });
  });

  it('caps what the sender pays, and says so about the ORIGIN not an address', () => {
    // A condition naming a principal only holds if that principal signs, and
    // this page cannot know who will - the wallet chooses tx-sender and the
    // request carries no sender field. Under deny mode a wrong guess is fatal:
    // the real sender's transfer matches nothing and the transaction aborts
    // after the contract has already succeeded, burning the fee.
    //
    // The canary's top-up step is called "from a THIRD account". Switching
    // accounts is the point of it, and it aborted on a post condition every
    // single time until this changed.
    const guard = guardFor({
      sender: ALICE,
      contractId: CONTRACT_ID,
      sends: 1_560_000n,
      contractSends: 0n
    });
    expect(guard.postConditionMode).toBe('deny');
    expect(guard.postConditions).toEqual([stxFromOrigin(1_560_000n)]);
    expect(guard.postConditions[0], 'must not name an address').not.toContain(
      ALICE.slice(2, 10).toLowerCase()
    );
  });

  it('caps the sender identically no matter which account it was told about', () => {
    // The property that makes the origin right: the condition does not depend
    // on the address at all, so it cannot be wrong about one.
    const a = guardFor({ sender: ALICE, contractId: CONTRACT_ID, sends: 7n, contractSends: 0n });
    const b = guardFor({ sender: BOB, contractId: CONTRACT_ID, sends: 7n, contractSends: 0n });
    const none = guardFor({ sender: null, contractId: CONTRACT_ID, sends: 7n, contractSends: 0n });
    expect(a).toEqual(b);
    expect(a).toEqual(none);
  });

  it('covers what the CONTRACT sends, or the transaction aborts', () => {
    const guard = guardFor({ sender: ALICE, contractId: CONTRACT_ID, sends: 0n, contractSends: 10_000n });
    expect(guard.postConditionMode).toBe('deny');
    expect(guard.postConditions).toEqual([stxFromContract(CONTRACT_ID, 10_000n)]);
  });

  it('covers both directions at once', () => {
    const guard = guardFor({
      sender: ALICE,
      contractId: CONTRACT_ID,
      sends: 500_000n,
      contractSends: 10_000n
    });
    expect(guard.postConditions).toHaveLength(2);
    expect(guard.postConditions[0]).toBe(stxFromOrigin(500_000n));
    expect(guard.postConditions[1]).toBe(stxFromContract(CONTRACT_ID, 10_000n));
  });

  it('caps rather than fixes, so a change between reading and signing does not abort', () => {
    // A cap and an exact amount bound the loss identically. The difference is
    // that an exact condition fails a good transaction when the amount moves -
    // a rebate that is not paid because the allowance ran out in the meantime,
    // or a fee the owner lowered. That is a real transaction fee lost for
    // nothing.
    const guard = guardFor({ sender: ALICE, contractId: CONTRACT_ID, sends: 0n, contractSends: 10_000n });
    const capped = stxFromContract(CONTRACT_ID, 10_000n, SENT_LESS_THAN_OR_EQUAL);
    const exact = stxFromContract(CONTRACT_ID, 10_000n, SENT_EQUAL_TO);
    expect(guard.postConditions[0]).toBe(capped);
    expect(guard.postConditions[0]).not.toBe(exact);
  });

  it('offers an allow shape as a documented last resort', () => {
    const guard = guardFor({
      sender: ALICE,
      contractId: CONTRACT_ID,
      sends: 1n,
      contractSends: 1n,
      shape: 'allow'
    });
    expect(guard).toEqual({ postConditionMode: 'allow', postConditions: [] });
  });

  it('NEVER needs to be told a sender, because it never names one', () => {
    // This used to throw. Requiring an address was the visible half of a
    // deeper mistake: that the page could know who would sign. It cannot, and
    // the origin principal means it does not have to.
    expect(() =>
      guardFor({ sender: null, contractId: CONTRACT_ID, sends: 1n, contractSends: 0n })
    ).not.toThrow();
  });

  it('needs no sender when only the contract pays', () => {
    // A read-only visitor watching a sponsored player does not have to have
    // connected anything for the condition to be well formed.
    expect(() =>
      guardFor({ sender: null, contractId: CONTRACT_ID, sends: 0n, contractSends: 10_000n })
    ).not.toThrow();
  });

  it('produces hex strings and never objects', () => {
    // Xverse hangs forever on the object form, with no dialog and no rejection.
    const guard = guardFor({
      sender: ALICE,
      contractId: CONTRACT_ID,
      sends: 1n,
      contractSends: 1n
    });
    for (const condition of guard.postConditions) {
      expect(typeof condition).toBe('string');
      expect(condition).toMatch(/^[0-9a-f]+$/);
    }
  });
});

describe('the trap that generalises', () => {
  it('shows why a condition written for the wrong call is not a smaller cap', () => {
    // Capping open-game at the move fee does not shrink the transfer, it fails
    // it. The amounts here differ by two orders of magnitude, which is exactly
    // the shape of the legacy bug.
    const openFee = 1_560_000n;
    const rebate = 10_000n;
    expect(stxFromAccount(ALICE, openFee)).not.toBe(stxFromAccount(ALICE, rebate));
  });
});

describe('the origin condition', () => {
  it('is byte-identical to what the SDK builds', () => {
    // The same check every other encoder here gets. A post condition the node
    // cannot deserialise fails as a plain-text 400, which wallets report as
    // something else entirely.
    expect(stxFromOrigin(70_000n)).toBe(sdk(Pc.origin().willSendLte(70_000n).ustx()));
    expect(stxFromOrigin(1n)).toBe(sdk(Pc.origin().willSendLte(1n).ustx()));
    expect(stxFromOrigin(0n)).toBe(sdk(Pc.origin().willSendLte(0n).ustx()));
  });

  it('carries no address at all, which is the point', () => {
    // Eleven bytes: asset type, principal type, condition code, and a u64.
    // Nothing that could name the wrong account.
    expect(stxFromOrigin(70_000n).length).toBe(22);
  });
});
