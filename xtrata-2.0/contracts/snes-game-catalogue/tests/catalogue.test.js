import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
const accounts = simnet.getAccounts();
const admin = accounts.get("deployer"), alice = accounts.get("wallet_1"), bob = accounts.get("wallet_2"), carol = accounts.get("wallet_3");
const CAT = "snes-game-catalogue-v1";
const mock = Cl.contractPrincipal(admin, "mock-xtrata");
const gateC = Cl.contractPrincipal(admin, "mock-gate");
const H = n => Cl.buffer(new Uint8Array(32).fill(n));
const call = (fn, args, who) => simnet.callPublicFn(CAT, fn, args, who);
const ro = (fn, args) => simnet.callReadOnlyFn(CAT, fn, args, admin);
const none = Cl.none();
const addGame = (who, slug = "star-patrol", gate = none) => call("add-game", [Cl.stringAscii(slug), Cl.stringAscii("STAR PATROL"), none, none, gate], who);
const mkIns = (id, size, creator, sealed = true) => simnet.callPublicFn("mock-xtrata", "mock-set", [Cl.uint(id), Cl.uint(size), Cl.principal(creator), Cl.bool(sealed)], admin);
const addVer = (who, id, hash, ins, size = 131072, mk = false, reader = mock) =>
  call("add-version", [Cl.uint(id), reader, H(hash), Cl.uint(size), Cl.uint(ins), Cl.uint(10000), Cl.stringAscii("xsh1-v1"), none, Cl.stringAscii("v1"), Cl.bool(mk)], who);
const okv = r => r.result;

beforeEach(() => {
  call("set-reader", [Cl.principal(`${admin}.mock-xtrata`), Cl.bool(true)], admin);
  call("set-publisher", [Cl.principal(alice), Cl.bool(true), Cl.stringAscii("alice")], admin);
});

describe("publishers and games", () => {
  it("non-publisher cannot add a game", () => { expect(addGame(bob).result).toBeErr(Cl.uint(101)); });
  it("publisher adds a game in the community set; slug is unique", () => {
    expect(addGame(alice).result).toBeOk(Cl.uint(1));
    expect(ro("get-game", [Cl.uint(1)]).result).toBeSome(expect.anything());
    expect(addGame(alice).result).toBeErr(Cl.uint(104));
    expect(ro("get-count", []).result).toBeUint(1);
  });
  it("token gate enrols a holder, wrong adapter or non-holder fails", () => {
    call("set-gate", [Cl.some(Cl.principal(`${admin}.mock-gate`))], admin);
    expect(addGame(bob, "bobs-game", Cl.some(gateC)).result).toBeErr(Cl.uint(101));      // bob not a holder
    simnet.callPublicFn("mock-gate", "set-allowed", [Cl.some(Cl.principal(bob))], admin);
    expect(addGame(bob, "bobs-game", Cl.some(gateC)).result).toBeOk(Cl.uint(1));        // enrolled
    expect(ro("is-publisher", [Cl.principal(bob)]).result).toBeBool(true);
    simnet.callPublicFn("mock-gate", "set-allowed", [Cl.none()], admin);                 // pass sold
    expect(addGame(bob, "bobs-game-2").result).toBeOk(Cl.uint(2));                      // still a publisher
    call("set-publisher", [Cl.principal(bob), Cl.bool(false), Cl.stringAscii("")], admin);
    expect(addGame(bob, "bobs-game-3").result).toBeErr(Cl.uint(101));                   // admin revoked
    call("set-gate", [Cl.none()], admin);
    simnet.callPublicFn("mock-gate", "set-allowed", [Cl.some(Cl.principal(carol))], admin);
    expect(addGame(carol, "c", Cl.some(gateC)).result).toBeErr(Cl.uint(101));           // gate cleared
  });
});

describe("versions", () => {
  beforeEach(() => { addGame(alice); });
  it("rejects a core that is not allowed, a missing, unsealed, wrong-size or foreign inscription", () => {
    mkIns(1, 131072, alice);
    call("set-reader", [Cl.principal(`${admin}.mock-xtrata`), Cl.bool(false)], admin);
    expect(addVer(alice, 1, 1, 1).result).toBeErr(Cl.uint(107));
    call("set-reader", [Cl.principal(`${admin}.mock-xtrata`), Cl.bool(true)], admin);
    expect(addVer(alice, 1, 1, 99).result).toBeErr(Cl.uint(200));
    mkIns(2, 131072, alice, false);  expect(addVer(alice, 1, 2, 2).result).toBeErr(Cl.uint(201));
    expect(addVer(alice, 1, 3, 1, 65536).result).toBeErr(Cl.uint(202));
    mkIns(3, 131072, bob);           expect(addVer(alice, 1, 4, 3).result).toBeErr(Cl.uint(203));
    expect(addVer(bob, 1, 5, 1).result).toBeErr(Cl.uint(102));                               // not the owner
  });
  it("first version becomes latest; later ones only if asked; rollback works", () => {
    mkIns(1, 131072, alice); mkIns(2, 262144, alice);
    expect(addVer(alice, 1, 1, 1).result).toBeOk(Cl.uint(1));
    expect(addVer(alice, 1, 2, 2, 262144).result).toBeOk(Cl.uint(2));
    let g = ro("get-game", [Cl.uint(1)]).result; expect(JSON.stringify(g)).toContain('"latest"');
    expect(ro("get-card", [Cl.uint(1)]).result).toBeSome(expect.anything());
    expect(call("set-latest", [Cl.uint(1), Cl.uint(2)], alice).result).toBeOk(Cl.bool(true));
    expect(call("set-latest", [Cl.uint(1), Cl.uint(1)], alice).result).toBeOk(Cl.bool(true));
    expect(call("set-latest", [Cl.uint(1), Cl.uint(7)], alice).result).toBeErr(Cl.uint(103));
  });
  it("one ROM hash, one identity; admin revoke frees the hash", () => {
    mkIns(1, 131072, alice);
    call("set-publisher", [Cl.principal(bob), Cl.bool(true), Cl.stringAscii("bob")], admin);
    addGame(bob, "bobs");
    mkIns(5, 131072, bob);
    expect(addVer(alice, 1, 9, 1).result).toBeOk(Cl.uint(1));
    expect(addVer(bob, 2, 9, 5).result).toBeErr(Cl.uint(105));                                // squat attempt blocked
    expect(call("revoke-version", [Cl.uint(1), Cl.uint(1)], bob).result).toBeErr(Cl.uint(100));
    expect(call("revoke-version", [Cl.uint(1), Cl.uint(1)], admin).result).toBeOk(Cl.bool(true));
    expect(ro("get-by-hash", [H(9)]).result).toBeNone();
    expect(addVer(bob, 2, 9, 5).result).toBeOk(Cl.uint(1));
    expect(call("set-latest", [Cl.uint(1), Cl.uint(1)], alice).result).toBeErr(Cl.uint(112)); // revoked
  });
});

describe("sets, hiding, ownership, admin hand-over", () => {
  beforeEach(() => { addGame(alice); });
  it("only admin moves a game to core", () => {
    expect(call("set-set", [Cl.uint(1), Cl.uint(0)], alice).result).toBeErr(Cl.uint(100));
    expect(call("set-set", [Cl.uint(1), Cl.uint(0)], admin).result).toBeOk(Cl.bool(true));
    expect(call("set-set", [Cl.uint(1), Cl.uint(5)], admin).result).toBeErr(Cl.uint(106));
  });
  it("owner or admin hides; others cannot", () => {
    expect(call("set-hidden", [Cl.uint(1), Cl.bool(true)], bob).result).toBeErr(Cl.uint(102));
    expect(call("set-hidden", [Cl.uint(1), Cl.bool(true)], alice).result).toBeOk(Cl.bool(true));
    expect(call("set-hidden", [Cl.uint(1), Cl.bool(false)], admin).result).toBeOk(Cl.bool(true));
  });
  it("a revoked owner cannot act until admin acts for them; transfer needs an active publisher", () => {
    call("set-publisher", [Cl.principal(alice), Cl.bool(false), Cl.stringAscii("")], admin);
    expect(call("set-hidden", [Cl.uint(1), Cl.bool(true)], alice).result).toBeErr(Cl.uint(102));
    expect(call("transfer-game", [Cl.uint(1), Cl.principal(bob)], admin).result).toBeErr(Cl.uint(101));
    call("set-publisher", [Cl.principal(bob), Cl.bool(true), Cl.stringAscii("bob")], admin);
    expect(call("transfer-game", [Cl.uint(1), Cl.principal(bob)], admin).result).toBeOk(Cl.bool(true));
  });
  it("two-step admin hand-over", () => {
    expect(call("propose-admin", [Cl.principal(bob)], alice).result).toBeErr(Cl.uint(100));
    expect(ro("get-pending-admin", []).result).toBeNone();
    call("propose-admin", [Cl.principal(bob)], admin);
    expect(ro("get-pending-admin", []).result).toBeSome(Cl.principal(bob));
    expect(call("accept-admin", [], carol).result).toBeErr(Cl.uint(113));
    expect(call("accept-admin", [], bob).result).toBeOk(Cl.bool(true));
    expect(ro("get-pending-admin", []).result).toBeNone();
    expect(ro("get-admin", []).result).toBePrincipal(bob);
  });
  it("get-page returns ten slots", () => {
    const r = ro("get-page", [Cl.uint(1)]).result; expect(r.type).toBe("list"); expect(r.value.length).toBe(10);
  });
});
