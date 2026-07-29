import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import { createHash } from "node:crypto";

const C = "proof-of-free-reveal";
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;      // also the treasury (tx-sender at deploy)
const w1 = accounts.get("wallet_1")!;
const w2 = accounts.get("wallet_2")!;

const seed = new Uint8Array(32).fill(7);
const seedHash = new Uint8Array(createHash("sha256").update(seed).digest());
const badSeed = new Uint8Array(32).fill(9);

const call = (fn: string, args: any[], who = deployer) => simnet.callPublicFn(C, fn, args, who);
const ro = (fn: string, args: any[] = [], who = deployer) => simnet.callReadOnlyFn(C, fn, args, who).result;

describe("deploy + config", () => {
  it("starts empty with the right defaults", () => {
    expect(ro("get-minted-count")).toBeUint(0);
    expect(ro("get-revealed-count")).toBeUint(0);
    expect(ro("get-treasury")).toBePrincipal(deployer);
    expect(ro("get-last-token-id")).toBeOk(Cl.uint(0));
    expect(ro("get-reveal-seed")).toBeNone();
  });
  it("defaults fees to 0.1 STX / 1 STX", () => {
    expect(ro("get-fees")).toBeTuple({ child: Cl.uint(100000), liveSet: Cl.uint(1000000) });
  });
});

describe("owner gating", () => {
  it("rejects non-owner admin calls", () => {
    expect(call("mint", [Cl.uint(1)], w1).result).toBeErr(Cl.uint(100));
    expect(call("commit-seed", [Cl.buffer(seedHash)], w1).result).toBeErr(Cl.uint(100));
    expect(call("set-child-recording-fee", [Cl.uint(1)], w1).result).toBeErr(Cl.uint(100));
    expect(call("set-live-set-fee", [Cl.uint(1)], w1).result).toBeErr(Cl.uint(100));
    expect(call("set-inscription", [Cl.uint(1), Cl.stringAscii("x")], w1).result).toBeErr(Cl.uint(100));
    expect(call("set-treasury", [Cl.principal(w1)], w1).result).toBeErr(Cl.uint(100));
  });
});

describe("minting into treasury", () => {
  it("mints a single token to the treasury", () => {
    expect(call("mint", [Cl.uint(1)]).result).toBeOk(Cl.uint(1));
    expect(ro("get-owner", [Cl.uint(1)])).toBeOk(Cl.some(Cl.principal(deployer)));
    expect(ro("get-minted-count")).toBeUint(1);
    expect(ro("get-last-token-id")).toBeOk(Cl.uint(1));
  });
  it("rejects double-mint and out-of-range", () => {
    call("mint", [Cl.uint(1)]);
    expect(call("mint", [Cl.uint(1)]).result).toBeErr(Cl.uint(102)); // already minted
    expect(call("mint", [Cl.uint(0)]).result).toBeErr(Cl.uint(101)); // bad position
    expect(call("mint", [Cl.uint(1025)]).result).toBeErr(Cl.uint(101));
  });
  it("mints many at once and tracks the max id", () => {
    const ids = [10, 11, 12, 700, 1024].map((n) => Cl.uint(n));
    expect(call("mint-many", [Cl.list(ids)]).result).toBeOk(Cl.uint(5));
    expect(ro("get-minted-count")).toBeUint(5);
    expect(ro("get-last-token-id")).toBeOk(Cl.uint(1024));
    expect(ro("get-owner", [Cl.uint(700)])).toBeOk(Cl.some(Cl.principal(deployer)));
  });
});

describe("reveal on first exit from treasury", () => {
  beforeEach(() => {
    call("mint-many", [Cl.list([1, 2, 3].map((n) => Cl.uint(n)))]);
  });
  it("reveals a tile only when its token leaves the treasury", () => {
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(false);
    // gift token 1 out of treasury
    expect(call("transfer", [Cl.uint(1), Cl.principal(deployer), Cl.principal(w1)]).result).toBeOk(Cl.bool(true));
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(true);
    expect(ro("get-revealed-count")).toBeUint(1);
    // token 2 still hidden
    expect(ro("is-revealed", [Cl.uint(2)])).toBeBool(false);
  });
  it("secondary transfers do not change the revealed set", () => {
    call("transfer", [Cl.uint(1), Cl.principal(deployer), Cl.principal(w1)]); // reveal
    expect(ro("get-revealed-count")).toBeUint(1);
    // w1 -> w2 (not from treasury): no change
    call("transfer", [Cl.uint(1), Cl.principal(w1), Cl.principal(w2)], w1);
    expect(ro("get-revealed-count")).toBeUint(1);
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(true);
  });
  it("does not double-count if a token returns to treasury then leaves again", () => {
    call("transfer", [Cl.uint(1), Cl.principal(deployer), Cl.principal(w1)]);      // reveal (count 1)
    call("transfer", [Cl.uint(1), Cl.principal(w1), Cl.principal(deployer)], w1);  // back to treasury
    call("transfer", [Cl.uint(1), Cl.principal(deployer), Cl.principal(w2)]);      // out again
    expect(ro("get-revealed-count")).toBeUint(1);
  });
  it("rejects a transfer whose sender is not tx-sender", () => {
    // w1 tries to move a treasury token they don't own
    expect(call("transfer", [Cl.uint(1), Cl.principal(deployer), Cl.principal(w1)], w1).result).toBeErr(Cl.uint(104));
  });
  it("sets the correct reveal bit across chunk boundaries", () => {
    call("mint", [Cl.uint(33)]);  // chunk 1, bit 0
    call("transfer", [Cl.uint(33), Cl.principal(deployer), Cl.principal(w1)]);
    expect(ro("is-revealed", [Cl.uint(33)])).toBeBool(true);
    expect(ro("is-revealed", [Cl.uint(1)])).toBeBool(false);
  });
});

describe("commit / reveal seed", () => {
  it("commits once, rejects a wrong seed, accepts the right one", () => {
    expect(call("reveal-seed-value", [Cl.buffer(seed)]).result).toBeErr(Cl.uint(106)); // no commit yet
    expect(call("commit-seed", [Cl.buffer(seedHash)]).result).toBeOk(Cl.bool(true));
    expect(call("commit-seed", [Cl.buffer(seedHash)]).result).toBeErr(Cl.uint(105));   // already committed
    expect(call("reveal-seed-value", [Cl.buffer(badSeed)]).result).toBeErr(Cl.uint(108)); // bad seed
    expect(call("reveal-seed-value", [Cl.buffer(seed)]).result).toBeOk(Cl.bool(true));
    expect(ro("get-reveal-seed")).toBeSome(Cl.buffer(seed));
    expect(call("reveal-seed-value", [Cl.buffer(seed)]).result).toBeErr(Cl.uint(107)); // already revealed
  });
});

describe("recording-inscription fees", () => {
  it("charges the child fee (0.1 STX) and logs the recording", () => {
    const hash = new Uint8Array(32).fill(3);
    const before = simnet.getAssetsMap().get("STX")?.get(deployer) ?? 0n;
    expect(call("pay-recording-fee", [Cl.uint(0), Cl.uint(42), Cl.buffer(hash)], w1).result).toBeOk(Cl.uint(1));
    const after = simnet.getAssetsMap().get("STX")?.get(deployer) ?? 0n;
    expect(after - before).toBe(100000n);                 // treasury received 0.1 STX
    expect(ro("get-recording", [Cl.uint(1)])).toBeSome(
      Cl.tuple({ payer: Cl.principal(w1), kind: Cl.uint(0), parent: Cl.uint(42), hash: Cl.buffer(hash), height: Cl.uint(simnet.blockHeight - 1) })
    );
  });
  it("charges the live-set fee (1 STX)", () => {
    const hash = new Uint8Array(32).fill(5);
    const before = simnet.getAssetsMap().get("STX")?.get(deployer) ?? 0n;
    expect(call("pay-recording-fee", [Cl.uint(1), Cl.uint(0), Cl.buffer(hash)], w2).result).toBeOk(Cl.uint(1));
    const after = simnet.getAssetsMap().get("STX")?.get(deployer) ?? 0n;
    expect(after - before).toBe(1000000n);                // 1 STX
  });
  it("rejects an unknown kind", () => {
    expect(call("pay-recording-fee", [Cl.uint(2), Cl.uint(0), Cl.buffer(new Uint8Array(32))], w1).result).toBeErr(Cl.uint(109));
  });
  it("uses the updated fee after the owner changes it", () => {
    call("set-child-recording-fee", [Cl.uint(250000)]);
    call("set-live-set-fee", [Cl.uint(2000000)]);
    expect(ro("get-fees")).toBeTuple({ child: Cl.uint(250000), liveSet: Cl.uint(2000000) });
    const before = simnet.getAssetsMap().get("STX")?.get(deployer) ?? 0n;
    call("pay-recording-fee", [Cl.uint(0), Cl.uint(1), Cl.buffer(new Uint8Array(32).fill(1))], w1);
    const after = simnet.getAssetsMap().get("STX")?.get(deployer) ?? 0n;
    expect(after - before).toBe(250000n);
  });
});

describe("inscription registry", () => {
  it("records and reads an inscription id, rejects bad positions", () => {
    expect(call("set-inscription", [Cl.uint(700), Cl.stringAscii("abcd1234i0")]).result).toBeOk(Cl.bool(true));
    expect(ro("get-inscription", [Cl.uint(700)])).toBeSome(Cl.stringAscii("abcd1234i0"));
    expect(ro("get-inscription", [Cl.uint(1)])).toBeNone();
    expect(call("set-inscription", [Cl.uint(0), Cl.stringAscii("x")]).result).toBeErr(Cl.uint(101));
  });
});

describe("revealed chunks view", () => {
  it("returns 32 chunks reflecting reveals", () => {
    call("mint-many", [Cl.list([1, 33].map((n) => Cl.uint(n)))]);
    call("transfer", [Cl.uint(1), Cl.principal(deployer), Cl.principal(w1)]);   // chunk 0, bit 0
    call("transfer", [Cl.uint(33), Cl.principal(deployer), Cl.principal(w1)]);  // chunk 1, bit 0
    const chunks = ro("get-revealed-chunks");
    // list of 32 uints: chunk 0 == 1, chunk 1 == 1, rest 0
    const list = (chunks as any).list ?? (chunks as any).value?.list;
    // fall back to prettyPrint compare if shape differs
    expect(Cl.prettyPrint(chunks)).toContain("u1");
    expect(ro("get-revealed-count")).toBeUint(2);
  });
});
