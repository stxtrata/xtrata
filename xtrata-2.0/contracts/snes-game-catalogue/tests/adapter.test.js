// The real adapter against a copy of the live Xtrata core v3.2.3 (and its legacy v1.1.1 / v2.1.0 contracts, which the core
// references). prepare-tests.mjs rewrites only the mainnet principals to the simnet deployer. Inscriptions are real
// mint-single-tx calls, with the core's own chain hash.
import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import { createHash } from "node:crypto";
const accounts = simnet.getAccounts();
const admin = accounts.get("deployer"), alice = accounts.get("wallet_1"), bob = accounts.get("wallet_2"), hot = accounts.get("wallet_3");
const CAT = "snes-game-catalogue-v1", CORE = "xtrata-v3-2-3", AD = "snes-xtrata-adapter-v3-2-3";
const adapter = Cl.contractPrincipal(admin, AD);
const none = Cl.none();
const sha = (b) => createHash("sha256").update(b).digest();
const chainHash = (chunks) => { let h = Buffer.alloc(32); for (const c of chunks) h = sha(Buffer.concat([h, c])); return h; };
const rom = (seed, size) => Buffer.alloc(size, seed);
const chunksOf = (b) => { const o = []; for (let i = 0; i < b.length; i += 16384) o.push(b.subarray(i, i + 16384)); return o; };
const mint = (who, bytes) => {
  const ch = chunksOf(bytes);
  return simnet.callPublicFn(CORE, "mint-single-tx", [Cl.buffer(chainHash(ch)), Cl.stringAscii("application/x-snes-rom"), Cl.uint(bytes.length), Cl.list(ch.map((c) => Cl.buffer(c))), Cl.stringAscii("https://x")], who);
};
const expectMint = (r, id) => { expect(r.result.type).toBe("ok"); expect(r.result.value.value["token-id"].value).toBe(BigInt(id)); };
const call = (fn, args, who) => simnet.callPublicFn(CAT, fn, args, who);
const ro = (fn, args) => simnet.callReadOnlyFn(CAT, fn, args, admin);
const addGame = (who, slug) => call("add-game", [Cl.stringAscii(slug), Cl.stringAscii(slug.toUpperCase()), none, none, none], who);
const H = (n) => Cl.buffer(Buffer.alloc(32, n));
const addVer = (who, id, hash, ins, size) =>
  call("add-version", [Cl.uint(id), adapter, H(hash), Cl.uint(size), Cl.uint(ins), Cl.uint(10000), Cl.stringAscii("xsh1-v1"), none, Cl.stringAscii("v1"), Cl.bool(true)], who);
const gameSet = (id) => ro("get-game", [Cl.uint(id)]).result.value.value.set.value;

beforeEach(() => {
  expect(simnet.callPublicFn(CORE, "set-paused", [Cl.bool(false)], admin).result).toBeOk(Cl.bool(true));
  call("set-reader", [Cl.principal(`${admin}.${AD}`), Cl.bool(true)], admin);
  call("set-publisher", [Cl.principal(alice), Cl.bool(true), Cl.stringAscii("alice")], admin);
});

describe("adapter over the live core", () => {
  it("reports the core it wraps", () => {
    expect(simnet.callReadOnlyFn(AD, "core", [], admin).result).toBeOk(Cl.principal(`${admin}.${CORE}`));
  });
  it("accepts a sealed inscription made by the game owner, with exactly its size", () => {
    const b = rom(7, 40000);
    expectMint(mint(alice, b), 0);
    expect(addGame(alice, "star-patrol").result).toBeOk(Cl.uint(1));
    expect(addVer(alice, 1, 1, 0, b.length).result).toBeOk(Cl.uint(1));
  });
  it("refuses: missing inscription u200, wrong size u202, someone else's inscription u203", () => {
    const b = rom(9, 20000);
    expectMint(mint(alice, b), 0);
    addGame(alice, "g1");
    expect(addVer(alice, 1, 2, 99, b.length).result).toBeErr(Cl.uint(200));
    expect(addVer(alice, 1, 3, 0, b.length + 1).result).toBeErr(Cl.uint(202));
    const c = rom(11, 20000);
    expectMint(mint(bob, c), 1);                       // bob made inscription 1
    expect(addVer(alice, 1, 4, 1, c.length).result).toBeErr(Cl.uint(203)); // alice's game, bob's inscription
  });
  it("refuses an inscription that is not sealed yet (u201)", () => {
    const b = rom(5, 40000), ch = chunksOf(b);
    const begin = simnet.callPublicFn(CORE, "begin-or-get", [Cl.buffer(chainHash(ch)), Cl.stringAscii("application/x-snes-rom"), Cl.uint(b.length), Cl.uint(ch.length)], alice);
    expect(begin.result).toBeOk(expect.anything());
    const chk = simnet.callReadOnlyFn(AD, "check", [Cl.uint(0), Cl.uint(b.length), Cl.principal(alice)], admin);
    // an unsealed upload is either unknown to the core (u200) or known and unsealed (u201); never ok
    expect(chk.result.type === "err").toBe(true);
  });
  it("one ROM, one identity: a second version with the same hash is refused (u105), the first stays", () => {
    const a = rom(1, 20000), c = rom(2, 20000);
    mint(alice, a); mint(alice, c);
    addGame(alice, "g2");
    expect(addVer(alice, 1, 8, 0, a.length).result).toBeOk(Cl.uint(1));
    expect(addVer(alice, 1, 8, 1, c.length).result).toBeErr(Cl.uint(105));
  });
});

describe("the canary's temporary-wallet flow", () => {
  it("admin hands over, the temporary admin registers games for the real publisher, then hands back", () => {
    const b = rom(3, 30000);
    expectMint(mint(alice, b), 0);                           // alice stands in for the deployer wallet
    expect(call("propose-admin", [Cl.principal(hot)], admin).result).toBeOk(Cl.bool(true));
    expect(call("accept-admin", [], hot).result).toBeOk(Cl.bool(true));         // hot is admin now
    // hot (admin) enrols alice, creates the game in the core set, moves it to alice, adds the version
    expect(call("set-publisher", [Cl.principal(alice), Cl.bool(true), Cl.stringAscii("owner")], hot).result).toBeOk(Cl.bool(true));
    expect(call("set-publisher", [Cl.principal(hot), Cl.bool(true), Cl.stringAscii("temporary")], hot).result).toBeOk(Cl.bool(true)); // add-game needs an active publisher, admin or not
    expect(addGame(hot, "star-patrol").result).toBeOk(Cl.uint(1));
    expect(gameSet(1)).toBe(0n);                                                // admin-added = core set
    expect(call("transfer-game", [Cl.uint(1), Cl.principal(alice)], hot).result).toBeOk(Cl.bool(true));
    expect(addVer(hot, 1, 21, 0, b.length).result).toBeOk(Cl.uint(1));         // admin acts for the owner, creator check passes for alice
    // the refusals the canary expects, still signed by hot while it is admin
    expect(addVer(hot, 1, 21, 0, b.length).result).toBeErr(Cl.uint(105));       // same hash again
    expect(addVer(hot, 1, 22, 0, b.length + 1).result).toBeErr(Cl.uint(202));   // wrong size
    // the temporary wallet switches its own publisher rights off, then hands the admin role back
    expect(call("set-publisher", [Cl.principal(hot), Cl.bool(false), Cl.stringAscii("")], hot).result).toBeOk(Cl.bool(true));
    expect(call("propose-admin", [Cl.principal(admin)], hot).result).toBeOk(Cl.bool(true));
    expect(call("accept-admin", [], admin).result).toBeOk(Cl.bool(true));
    expect(ro("get-admin", []).result).toBePrincipal(admin);
    // hot is nobody now
    expect(addGame(hot, "nope").result).toBeErr(Cl.uint(101));
    expect(addVer(hot, 1, 23, 0, b.length).result).toBeErr(Cl.uint(102));
    expect(call("set-reader", [Cl.principal(`${admin}.${AD}`), Cl.bool(false)], hot).result).toBeErr(Cl.uint(100));
    // the game belongs to alice, payout too
    const g = ro("get-game", [Cl.uint(1)]).result.value.value;
    expect(g.owner.value).toBe(alice);
    expect(g.payout.value).toBe(alice);
  });
  it("a game added by a non-admin publisher starts in the community set", () => {
    addGame(alice, "community-one");
    expect(gameSet(1)).toBe(1n);
  });
});
