import { beforeEach, describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const REG = "living-synth-registry";
const CORE = "mock-xtrata-core";
const JSON_MIME = "application/json";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;          // contract owner + treasury
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

const corePrincipal = () => Cl.contractPrincipal(deployer, CORE);
const reg = (fn: string, args: any[], who = deployer) => simnet.callPublicFn(REG, fn, args, who);
const core = (fn: string, args: any[], who = deployer) => simnet.callPublicFn(CORE, fn, args, who);
const ro = (fn: string, args: any[] = []) => simnet.callReadOnlyFn(REG, fn, args, deployer).result;
const stxOf = (who: string) => simnet.getAssetsMap().get("STX")?.get(who) ?? 0n;
const hash32 = (byte: number) => Cl.buffer(new Uint8Array(32).fill(byte));

/** Stage a sealed JSON child inscription owned by `owner`, parented to `tokenId`. */
function stageChild(recordingId: number, owner: string, tokenId: number, opts: {
  mime?: string; sealed?: boolean; size?: number; parents?: number[];
} = {}) {
  core("test-set-meta", [
    Cl.uint(recordingId), Cl.principal(owner),
    Cl.stringAscii(opts.mime ?? JSON_MIME),
    Cl.uint(opts.size ?? 2048),
    Cl.bool(opts.sealed ?? true),
    hash32(recordingId & 0xff)
  ]);
  core("test-set-parents", [
    Cl.uint(recordingId),
    Cl.list((opts.parents ?? [tokenId]).map(p => Cl.uint(p)))
  ]);
}

/** Lock the core, unpause, and map editions -> token ids (token id = edition + 1000). */
function setup(editions: number[]) {
  reg("lock-core-contract", [corePrincipal()]);
  reg("set-paused", [Cl.bool(false)]);
  reg("register-edition-batch", [
    Cl.list(editions.map(e => Cl.tuple({ edition: Cl.uint(e), "token-id": Cl.uint(e + 1000) })))
  ]);
  // every edition starts life in the treasury
  editions.forEach(e => core("test-set-owner", [Cl.uint(e + 1000), Cl.principal(deployer)]));
}

describe("setup", () => {
  it("locks the core exactly once", () => {
    expect(reg("lock-core-contract", [corePrincipal()]).result).toBeOk(Cl.bool(true));
    expect(reg("lock-core-contract", [corePrincipal()]).result).toBeErr(Cl.uint(114));
  });

  it("refuses core-dependent calls before the core is locked", () => {
    expect(reg("reveal", [corePrincipal(), Cl.uint(1)]).result).toBeErr(Cl.uint(115));
  });

  it("maps editions and rejects a duplicate anywhere in the batch", () => {
    setup([1, 2, 3]);
    expect(ro("get-token-for-edition", [Cl.uint(2)])).toBeSome(Cl.uint(1002));
    expect(ro("get-edition-for-token", [Cl.uint(1002)])).toBeSome(Cl.uint(2));
    // edition 4 is new but edition 2 repeats, so the whole batch must abort
    const dup = reg("register-edition-batch", [Cl.list([
      Cl.tuple({ edition: Cl.uint(4), "token-id": Cl.uint(1004) }),
      Cl.tuple({ edition: Cl.uint(2), "token-id": Cl.uint(9999) })
    ])]);
    expect(dup.result).toBeErr(Cl.uint(103));
    expect(ro("get-token-for-edition", [Cl.uint(4)])).toBeNone();
    expect(ro("get-token-for-edition", [Cl.uint(2)])).toBeSome(Cl.uint(1002));
  });

  it("rejects an out-of-range edition", () => {
    reg("lock-core-contract", [corePrincipal()]);
    expect(reg("register-edition-batch", [Cl.list([
      Cl.tuple({ edition: Cl.uint(1025), "token-id": Cl.uint(1) })
    ])]).result).toBeErr(Cl.uint(101));
  });

  it("only the owner may register editions", () => {
    reg("lock-core-contract", [corePrincipal()]);
    expect(reg("register-edition-batch", [Cl.list([
      Cl.tuple({ edition: Cl.uint(1), "token-id": Cl.uint(1001) })
    ])], alice).result).toBeErr(Cl.uint(100));
  });
});

describe("reveal", () => {
  beforeEach(() => setup([1, 5, 128, 129, 1024]));

  it("refuses an edition that was never registered", () => {
    expect(reg("reveal", [corePrincipal(), Cl.uint(7)]).result).toBeErr(Cl.uint(102));
  });

  it("refuses to reveal a cell still held by the treasury", () => {
    expect(reg("reveal", [corePrincipal(), Cl.uint(5)], alice).result).toBeErr(Cl.uint(112));
    expect(ro("is-revealed", [Cl.uint(5)])).toBeBool(false);
  });

  it("lets anyone latch a cell once its token has left the treasury", () => {
    core("test-set-owner", [Cl.uint(1005), Cl.principal(alice)]);
    expect(reg("reveal", [corePrincipal(), Cl.uint(5)], bob).result).toBeOk(Cl.bool(true));
    expect(ro("is-revealed", [Cl.uint(5)])).toBeBool(true);
    // a second call is a no-op rather than an error, so callers can be careless
    expect(reg("reveal", [corePrincipal(), Cl.uint(5)], bob).result).toBeOk(Cl.bool(false));
  });

  it("STAYS revealed after the token returns to the treasury", () => {
    core("test-set-owner", [Cl.uint(1005), Cl.principal(alice)]);
    reg("reveal", [corePrincipal(), Cl.uint(5)], alice);
    expect(ro("is-revealed", [Cl.uint(5)])).toBeBool(true);

    core("test-set-owner", [Cl.uint(1005), Cl.principal(deployer)]);   // back home
    expect(ro("is-revealed", [Cl.uint(5)])).toBeBool(true);            // still lit

    core("test-set-owner", [Cl.uint(1005), Cl.principal(bob)]);        // out again
    expect(ro("is-revealed", [Cl.uint(5)])).toBeBool(true);
    expect(Number(ro("get-state").value["revealed-count"].value)).toBe(1);
  });

  it("counts each cell once no matter how many times reveal is called", () => {
    core("test-set-owner", [Cl.uint(1005), Cl.principal(alice)]);
    reg("reveal", [corePrincipal(), Cl.uint(5)], alice);
    reg("reveal", [corePrincipal(), Cl.uint(5)], bob);
    reg("reveal", [corePrincipal(), Cl.uint(5)], deployer);
    expect(Number(ro("get-state").value["revealed-count"].value)).toBe(1);
  });

  it("puts each edition in the right bitmap slot and bit", () => {
    // 1 -> slot 0 bit 0 · 128 -> slot 0 bit 127 · 129 -> slot 1 bit 0 · 1024 -> slot 7 bit 127
    for (const [edition, token] of [[1, 1001], [128, 1128], [129, 1129], [1024, 2024]]) {
      core("test-set-owner", [Cl.uint(token), Cl.principal(alice)]);
      reg("reveal", [corePrincipal(), Cl.uint(edition)], alice);
    }
    const slots = ro("get-reveal-bits").value.map((v: any) => BigInt(v.value));
    expect(slots).toHaveLength(8);
    expect(slots[0]).toBe(1n | (1n << 127n));   // editions 1 and 128
    expect(slots[1]).toBe(1n);                  // edition 129
    expect(slots[7]).toBe(1n << 127n);          // edition 1024
    expect(slots[2]).toBe(0n);

    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(true);
    expect(ro("is-revealed", [Cl.uint(128)])).toBeBool(true);
    expect(ro("is-revealed", [Cl.uint(129)])).toBeBool(true);
    expect(ro("is-revealed", [Cl.uint(1024)])).toBeBool(true);
    expect(ro("is-revealed", [Cl.uint(5)])).toBeBool(false);
    expect(ro("is-revealed", [Cl.uint(0)])).toBeBool(false);      // no underflow
    expect(ro("is-revealed", [Cl.uint(1025)])).toBeBool(false);
  });
});

describe("transfer-and-reveal", () => {
  beforeEach(() => setup([1, 2]));

  it("moves the token and latches the cell in one transaction", () => {
    expect(reg("transfer-and-reveal", [corePrincipal(), Cl.uint(1), Cl.principal(alice)]).result)
      .toBeOk(Cl.bool(true));
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(true);
    expect(simnet.callReadOnlyFn(CORE, "get-owner", [Cl.uint(1001)], deployer).result)
      .toBeOk(Cl.some(Cl.principal(alice)));
  });

  it("is treasury-only", () => {
    expect(reg("transfer-and-reveal", [corePrincipal(), Cl.uint(1), Cl.principal(bob)], alice).result)
      .toBeErr(Cl.uint(100));
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(false);
  });

  it("refuses a transfer to the treasury itself", () => {
    expect(reg("transfer-and-reveal", [corePrincipal(), Cl.uint(1), Cl.principal(deployer)]).result)
      .toBeErr(Cl.uint(112));
  });

  it("is idempotent on the count if a cell round-trips and is sent out again", () => {
    reg("transfer-and-reveal", [corePrincipal(), Cl.uint(1), Cl.principal(alice)]);
    core("test-set-owner", [Cl.uint(1001), Cl.principal(deployer)]);
    reg("transfer-and-reveal", [corePrincipal(), Cl.uint(1), Cl.principal(bob)]);
    expect(Number(ro("get-state").value["revealed-count"].value)).toBe(1);
  });
});

describe("child recordings", () => {
  beforeEach(() => {
    setup([10]);
    core("test-set-owner", [Cl.uint(1010), Cl.principal(alice)]);   // alice owns edition 10
  });

  it("registers a child, charges the fee, and makes it the default", () => {
    stageChild(500, alice, 1010);
    const before = stxOf(deployer);
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeOk(Cl.uint(500));
    expect(stxOf(deployer) - before).toBe(100000n);
    expect(ro("get-active-child", [Cl.uint(10)])).toBeSome(Cl.uint(500));
    expect(ro("get-child-count", [Cl.uint(10)])).toBeUint(1);
    expect(ro("has-child", [Cl.uint(10)])).toBeBool(true);
    const bits = ro("get-child-bits").value.map((v: any) => BigInt(v.value));
    expect(bits[0]).toBe(1n << 9n);                                // edition 10 -> bit 9
  });

  it("newest child wins and earlier ones stay reachable", () => {
    stageChild(500, alice, 1010);
    stageChild(501, alice, 1010);
    reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice);
    reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(501), Cl.uint(100000)], alice);
    expect(ro("get-active-child", [Cl.uint(10)])).toBeSome(Cl.uint(501));
    expect(ro("get-child-count", [Cl.uint(10)])).toBeUint(2);
    expect(ro("get-child-at", [Cl.uint(10), Cl.uint(1)])).toBeSome(Cl.uint(500));
    expect(ro("get-child-at", [Cl.uint(10), Cl.uint(2)])).toBeSome(Cl.uint(501));
  });

  it("refuses a caller who does not own the edition", () => {
    stageChild(500, bob, 1010);
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], bob).result)
      .toBeErr(Cl.uint(106));
  });

  it("refuses a recording the caller does not own", () => {
    stageChild(500, bob, 1010);
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(107));
  });

  it("refuses a recording that is not parented to this edition", () => {
    stageChild(500, alice, 1010, { parents: [9999] });
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(108));
  });

  it("refuses the wrong mime type", () => {
    stageChild(500, alice, 1010, { mime: "text/html" });
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(109));
  });

  it("refuses an unsealed or oversized recording", () => {
    stageChild(500, alice, 1010, { sealed: false });
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(110));
    stageChild(501, alice, 1010, { size: 262145 });
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(501), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(110));
  });

  it("refuses the same recording twice", () => {
    stageChild(500, alice, 1010);
    reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice);
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(111));
  });

  it("refuses a stale fee so a price change cannot surprise a minter", () => {
    stageChild(500, alice, 1010);
    reg("set-child-fee", [Cl.uint(250000)]);
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(119));
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(250000)], alice).result)
      .toBeOk(Cl.uint(500));
  });

  it("is blocked while paused", () => {
    stageChild(500, alice, 1010);
    reg("set-paused", [Cl.bool(true)]);
    expect(reg("register-child", [corePrincipal(), Cl.uint(10), Cl.uint(500), Cl.uint(100000)], alice).result)
      .toBeErr(Cl.uint(117));
  });
});

/* Rotating the treasury must not retroactively "distribute" everything still
 * sitting in the old wallet. Custody is the whole history of treasury
 * addresses, not just the current one. */
describe("treasury rotation", () => {
  beforeEach(() => setup([1, 2, 3]));

  it("keeps tokens in the OLD treasury unrevealable after a rotation", () => {
    // editions 1-3 are all still in the deployer wallet
    expect(reg("set-treasury", [Cl.principal(bob)]).result).toBeOk(Cl.bool(true));
    // bob is the treasury now, but edition 1 never moved out of the deployer
    expect(reg("reveal", [corePrincipal(), Cl.uint(1)], alice).result).toBeErr(Cl.uint(112));
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(false);
  });

  it("keeps tokens in the NEW treasury unrevealable too", () => {
    reg("set-treasury", [Cl.principal(bob)]);
    core("test-set-owner", [Cl.uint(1002), Cl.principal(bob)]);
    expect(reg("reveal", [corePrincipal(), Cl.uint(2)], alice).result).toBeErr(Cl.uint(112));
  });

  it("still reveals once a token reaches someone outside custody", () => {
    reg("set-treasury", [Cl.principal(bob)]);
    core("test-set-owner", [Cl.uint(1003), Cl.principal(alice)]);
    expect(reg("reveal", [corePrincipal(), Cl.uint(3)], alice).result).toBeOk(Cl.bool(true));
    expect(ro("is-revealed", [Cl.uint(3)])).toBeBool(true);
  });

  it("survives rotating back to a wallet used before", () => {
    reg("set-treasury", [Cl.principal(bob)]);
    reg("set-treasury", [Cl.principal(deployer)], deployer);
    expect(ro("is-in-custody", [Cl.principal(deployer)])).toBeBool(true);
    expect(ro("is-in-custody", [Cl.principal(bob)])).toBeBool(true);
    expect(reg("reveal", [corePrincipal(), Cl.uint(1)], alice).result).toBeErr(Cl.uint(112));
  });

  it("refuses transfer-and-reveal into a retired treasury wallet", () => {
    reg("set-treasury", [Cl.principal(bob)]);
    // bob (the new treasury) tries to send edition 1 back to the old wallet
    core("test-set-owner", [Cl.uint(1001), Cl.principal(bob)]);
    expect(reg("transfer-and-reveal", [corePrincipal(), Cl.uint(1), Cl.principal(deployer)], bob).result)
      .toBeErr(Cl.uint(112));
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(false);
  });

  it("reports custody and rejects a no-op rotation", () => {
    expect(ro("is-in-custody", [Cl.principal(deployer)])).toBeBool(true);
    expect(ro("is-in-custody", [Cl.principal(alice)])).toBeBool(false);
    expect(ro("was-treasury", [Cl.principal(deployer)])).toBeBool(false);   // current, not retired
    expect(reg("set-treasury", [Cl.principal(deployer)]).result).toBeErr(Cl.uint(123));
    reg("set-treasury", [Cl.principal(bob)]);
    expect(ro("was-treasury", [Cl.principal(deployer)])).toBeBool(true);
  });

  it("is owner-only", () => {
    expect(reg("set-treasury", [Cl.principal(alice)], alice).result).toBeErr(Cl.uint(100));
  });
});

describe("live sets", () => {
  beforeEach(() => setup([1]));

  it("charges the live-set fee and needs no parent", () => {
    stageChild(900, bob, 0, { parents: [] });
    const before = stxOf(deployer);
    expect(reg("register-live-set", [corePrincipal(), Cl.uint(900), Cl.uint(1000000)], bob).result)
      .toBeOk(Cl.uint(1));
    expect(stxOf(deployer) - before).toBe(1000000n);
    expect(Number(ro("get-state").value["live-set-count"].value)).toBe(1);
  });

  it("refuses a live set the caller does not own", () => {
    stageChild(900, alice, 0, { parents: [] });
    expect(reg("register-live-set", [corePrincipal(), Cl.uint(900), Cl.uint(1000000)], bob).result)
      .toBeErr(Cl.uint(107));
  });
});

describe("admin", () => {
  it("hands over ownership in two steps and locks the old owner out", () => {
    expect(reg("accept-contract-ownership", [], alice).result).toBeErr(Cl.uint(122));
    reg("initiate-contract-ownership-transfer", [Cl.principal(alice)]);
    expect(reg("accept-contract-ownership", [], bob).result).toBeErr(Cl.uint(100));
    expect(reg("accept-contract-ownership", [], alice).result).toBeOk(Cl.bool(true));
    expect(reg("set-child-fee", [Cl.uint(1)]).result).toBeErr(Cl.uint(100));
    expect(reg("set-child-fee", [Cl.uint(1)], alice).result).toBeOk(Cl.bool(true));
  });

  it("caps the fees", () => {
    expect(reg("set-child-fee", [Cl.uint(100000001)]).result).toBeErr(Cl.uint(118));
    expect(reg("set-live-set-fee", [Cl.uint(100000001)]).result).toBeErr(Cl.uint(118));
  });

  it("rejects admin calls from a non-owner", () => {
    expect(reg("set-treasury", [Cl.principal(alice)], alice).result).toBeErr(Cl.uint(100));
    expect(reg("set-paused", [Cl.bool(false)], alice).result).toBeErr(Cl.uint(100));
  });
});

describe("mosaic reads", () => {
  it("returns 32 cells a page and refuses a page past the end", () => {
    setup([1, 2]);
    core("test-set-owner", [Cl.uint(1001), Cl.principal(alice)]);
    reg("reveal", [corePrincipal(), Cl.uint(1)], alice);
    const page = ro("get-mosaic-page", [Cl.uint(0)]);
    expect(page.value.value).toHaveLength(32);
    expect(page.value.value[0].value.revealed).toBeBool(true);
    expect(page.value.value[1].value.revealed).toBeBool(false);
    expect(page.value.value[2].value["token-id"]).toBeNone();      // never registered
    expect(ro("get-mosaic-page", [Cl.uint(32)])).toBeErr(Cl.uint(120));
  });
});
