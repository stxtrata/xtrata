import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const C = "recording-fees";
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;   // also the treasury (tx-sender at deploy)
const w1 = accounts.get("wallet_1")!;
const w2 = accounts.get("wallet_2")!;

const call = (fn: string, args: any[], who = deployer) => simnet.callPublicFn(C, fn, args, who);
const ro = (fn: string, args: any[] = []) => simnet.callReadOnlyFn(C, fn, args, deployer).result;
const stxOf = (who: string) => simnet.getAssetsMap().get("STX")?.get(who) ?? 0n;
const ref = Cl.stringAscii("perf-abc123");

describe("defaults", () => {
  it("starts with 0.1 STX / 1 STX fees and no receipts", () => {
    expect(ro("get-fees")).toBeTuple({ child: Cl.uint(100000), liveSet: Cl.uint(1000000) });
    expect(ro("get-receipts-count")).toBeUint(0);
    expect(ro("get-treasury")).toBePrincipal(deployer);
    expect(ro("get-owner")).toBePrincipal(deployer);
  });
});

describe("paying the recording fee", () => {
  it("charges 0.1 STX for a child performance and logs a receipt", () => {
    const before = stxOf(deployer);
    expect(call("pay-inscription-fee", [Cl.uint(0), Cl.uint(512), ref], w1).result).toBeOk(Cl.uint(1));
    expect(stxOf(deployer) - before).toBe(100000n);           // treasury received 0.1 STX
    expect(ro("get-receipts-count")).toBeUint(1);
    expect(ro("get-receipt", [Cl.uint(1)])).toBeSome(
      Cl.tuple({ payer: Cl.principal(w1), kind: Cl.uint(0), parent: Cl.uint(512), ref, height: Cl.uint(simnet.blockHeight - 1) })
    );
  });
  it("charges 1 STX for a live set", () => {
    const before = stxOf(deployer);
    expect(call("pay-inscription-fee", [Cl.uint(1), Cl.uint(0), Cl.stringAscii("set-xyz")], w2).result).toBeOk(Cl.uint(1));
    expect(stxOf(deployer) - before).toBe(1000000n);          // 1 STX
  });
  it("rejects an unknown kind", () => {
    expect(call("pay-inscription-fee", [Cl.uint(2), Cl.uint(0), ref], w1).result).toBeErr(Cl.uint(101));
  });
  it("increments receipt ids across payers", () => {
    call("pay-inscription-fee", [Cl.uint(0), Cl.uint(1), ref], w1);
    call("pay-inscription-fee", [Cl.uint(1), Cl.uint(0), ref], w2);
    expect(ro("get-receipts-count")).toBeUint(2);
  });
});

describe("owner-updatable fees", () => {
  it("applies the new fee after the owner changes it", () => {
    expect(call("set-child-fee", [Cl.uint(250000)]).result).toBeOk(Cl.bool(true));
    expect(call("set-live-set-fee", [Cl.uint(2000000)]).result).toBeOk(Cl.bool(true));
    expect(ro("get-fees")).toBeTuple({ child: Cl.uint(250000), liveSet: Cl.uint(2000000) });
    const before = stxOf(deployer);
    call("pay-inscription-fee", [Cl.uint(0), Cl.uint(1), ref], w1);
    expect(stxOf(deployer) - before).toBe(250000n);
  });
  it("rejects fee/treasury changes from non-owner", () => {
    expect(call("set-child-fee", [Cl.uint(1)], w1).result).toBeErr(Cl.uint(100));
    expect(call("set-live-set-fee", [Cl.uint(1)], w1).result).toBeErr(Cl.uint(100));
    expect(call("set-treasury", [Cl.principal(w1)], w1).result).toBeErr(Cl.uint(100));
    expect(call("transfer-ownership", [Cl.principal(w1)], w1).result).toBeErr(Cl.uint(100));
  });
});

describe("admin", () => {
  it("routes fees to a new treasury and hands over ownership", () => {
    call("set-treasury", [Cl.principal(w2)]);
    const before = stxOf(w2);
    call("pay-inscription-fee", [Cl.uint(1), Cl.uint(0), ref], w1);
    expect(stxOf(w2) - before).toBe(1000000n);                // new treasury paid
    call("transfer-ownership", [Cl.principal(w1)]);
    expect(ro("get-owner")).toBePrincipal(w1);
    expect(call("set-child-fee", [Cl.uint(5)]).result).toBeErr(Cl.uint(100)); // old owner locked out
    expect(call("set-child-fee", [Cl.uint(5)], w1).result).toBeOk(Cl.bool(true));
  });
});
