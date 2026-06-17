// xtrata-manifest-authority-v1 (v1.4) EDGE-CASE suite
// Companion to smoke.mjs. Probes the seams between features and the state
// transitions no codex finding was filed against. Run:
//   node tests/edge.mjs
// Each test asserts a specific Clarity error code or read-only shape.
import { initSimnet } from "@hirosystems/clarinet-sdk";
import { Cl, cvToString } from "@stacks/transactions";
import { createHash } from "crypto";

const simnet = await initSimnet("./Clarinet.toml");
const a = simnet.getAccounts();
const deployer = a.get("deployer"); // == CONTRACT-OWNER
const w1 = a.get("wallet_1");        // authority
const w2 = a.get("wallet_2");        // delegate / squatter
const w3 = "SP1K773003ZPKN339KWKP8GCDW3YDR9KYQKTM6XTZ"; // distinct 3rd-party transfer target
const CORE = "xtrata-v3-2-3";
const XMA = "xtrata-manifest-authority-v1";
const MIME = "application/vnd.xtrata.manifest+json";

let pass = 0, fail = 0;
const t = (name, cond, got) => {
  cond ? pass++ : (fail++, console.log("FAIL:", name, "| got:", got));
};
const j = (r) => cvToString(r.result);

simnet.callPublicFn(CORE, "set-paused", [Cl.bool(false)], deployer);

// Core final-hash is CHAINED: sha256(prev32 || chunk), seed = 32 zero bytes.
function coreHash(buf) { return createHash("sha256").update(Buffer.concat([Buffer.alloc(32), buf])).digest(); }

let salt = 0;
function mint(sender, { parents = [], mime = MIME, size } = {}) {
  const buf = Buffer.from(JSON.stringify({ m: ++salt }));
  const hash = coreHash(buf);
  const r = simnet.callPublicFn(CORE, "mint-single-tx-with-relationships",
    [Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(size ?? buf.length),
     Cl.list([Cl.buffer(buf)]), Cl.stringAscii("uri"),
     Cl.list([]), Cl.list(parents.map(Cl.uint))], sender);
  const m = j(r).match(/token-id u(\d+)/);
  return { id: m ? Number(m[1]) : null, raw: j(r), hash };
}

// register-manifest with overridable fields, mirroring smoke.mjs.
const reg = (id, hashOpt, sender, prev, over = {}) => simnet.callPublicFn(XMA, "register-manifest", [
  Cl.uint(id),
  Cl.uint(over.authClass ?? 7),  // AUTH-CORPUS-AUTHORITY
  Cl.uint(over.mType ?? 12),     // TYPE-STANDARD-CORPUS
  Cl.uint(over.life ?? 3),       // LIFE-CONTINUITY-ENFORCED
  Cl.uint(8),                    // TARGET-CORPUS-SCOPE
  Cl.uint(1), Cl.stringAscii("1.0.0"),
  hashOpt ? Cl.some(Cl.buffer(hashOpt)) : Cl.none(),
  Cl.none(),
  over.root ? Cl.some(Cl.buffer(over.root)) : Cl.none(),
  Cl.uint(over.count ?? 9), Cl.uint(0),
  prev != null ? Cl.some(Cl.uint(prev)) : Cl.none(),
  Cl.uint(over.claim ?? 2)], sender);

const scopeBuf = (label) => { const b = Buffer.alloc(32); b.write(label); return b; };
const createScope = (key, sender, ac = 7, life = 3) =>
  simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(key), Cl.uint(ac), Cl.uint(life)], sender);
const getScope = (key, sender = w1) =>
  j(simnet.callReadOnlyFn(XMA, "get-scope", [Cl.buffer(key)], sender));
const transfer = (id, from, to) =>
  simnet.callPublicFn(CORE, "transfer", [Cl.uint(id), Cl.principal(from), Cl.principal(to)], from);

// ============================================================ E1 derived-key squat
// derive-scope-key is a pure read-only: ANYONE can compute w1's key. create-scope
// is self-claim, so w2 can register a scope AT w1's derived key with itself as
// key-authority. A resolver that derives from w1 and only checks "scope exists"
// is fooled; it MUST also verify key-authority == the principal it derived from.
{
  const label = scopeBuf("squat-target");
  let r = simnet.callReadOnlyFn(XMA, "derive-scope-key", [Cl.principal(w1), Cl.buffer(label)], w1);
  const dkey = Buffer.from(j(r).replace("0x", ""), "hex");
  r = createScope(dkey, w2);                       // attacker claims w1's derived key
  t("E1: attacker can create-scope at victim's derived key", j(r).includes("ok"), j(r));
  const s = getScope(dkey);
  t("E1: squatted scope key-authority is the ATTACKER (w2), not w1",
    s.includes("(key-authority " + w2 + ")"), s);
  t("E1: squatted scope key-authority is NOT the deriving principal w1",
    !s.includes("(key-authority " + w1 + ")"), s);
  // The detection a resolver must perform:
  t("E1: derived-from principal (w1) != stored key-authority -> resolver MUST reject",
    !s.includes("(key-authority " + w1 + ")"), s);
}

// ============================================================ E2 contract-owner backdoor
// revoke/mark-superseded accept CONTRACT-OWNER as well as the registrar, but
// withdraw does NOT. Pin both the power and the asymmetry.
{
  const m = mint(w1);
  let r = reg(m.id, m.hash, w1);
  t("E2: setup register (by w1)", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "revoke-manifest", [Cl.uint(m.id)], deployer);
  t("E2: CONTRACT-OWNER can revoke a manifest it did not register", j(r).includes("ok"), j(r));
  r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(m.id)], w1);
  t("E2: status is REVOKED (u4)", j(r).includes("(status u4)"), j(r));
  // withdraw has no owner branch -> owner is unauthorised on someone else's manifest
  const m2 = mint(w1);
  reg(m2.id, m2.hash, w1);
  r = simnet.callPublicFn(XMA, "withdraw-manifest", [Cl.uint(m2.id)], deployer);
  t("E2: CONTRACT-OWNER CANNOT withdraw another's manifest -> u100 (asymmetry)",
    j(r).includes("u100"), j(r));
}

// ============================================================ E3 fork resolution (two competing successors)
// One delegate mints TWO successors of the same head (it owns the head, so both
// carry a valid core parent edge). Authority promotes one; the other must then
// fail because the head is no longer the scope's current pointer.
{
  const SCOPE = scopeBuf("fork-scope");
  let r = createScope(SCOPE, w1);
  t("E3: create scope", j(r).includes("ok"), j(r));
  const head = mint(w1);
  reg(head.id, head.hash, w1);
  r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id)], w1);
  t("E3: register initial head", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
  t("E3: add delegate w2", j(r).includes("ok"), j(r));
  // hand the head to the delegate so its successors can declare the parent edge
  transfer(head.id, w1, w2);
  const fA = mint(w2, { parents: [head.id] });
  const fB = mint(w2, { parents: [head.id] });   // competing tip, same predecessor
  r = reg(fA.id, fA.hash, w2, head.id);
  t("E3: register fork-A", j(r).includes("ok"), j(r));
  r = reg(fB.id, fB.hash, w2, head.id);
  t("E3: register fork-B", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id), Cl.uint(fA.id)], w1);
  t("E3: authority promotes fork-A", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id), Cl.uint(fB.id)], w1);
  t("E3: competing fork-B rejected (head no longer current) -> u109", j(r).includes("u109"), j(r));
  r = simnet.callReadOnlyFn(XMA, "get-current-active-manifest", [Cl.buffer(SCOPE)], w1);
  t("E3: current head is fork-A", j(r).includes("u" + fA.id), j(r));
  r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(fB.id)], w1);
  t("E3: loser fork-B remains ACTIVE but never current (no current-scope)",
    j(r).includes("(status u1)") && j(r).includes("(current-scope none)"), j(r));
}

// ============================================================ E4 authority-transfer aftermath
{
  const SCOPE = scopeBuf("transfer-scope");
  let r = createScope(SCOPE, w1);
  t("E4: create scope", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
  t("E4: w1 adds delegate w2", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "set-scope-authority", [Cl.buffer(SCOPE), Cl.principal(w3)], w1);
  t("E4: w1 transfers operational authority to w3", j(r).includes("ok"), j(r));
  // old authority is now powerless
  r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(deployer)], w1);
  t("E4: OLD authority w1 can no longer add a delegate -> u113", j(r).includes("u113"), j(r));
  r = simnet.callPublicFn(XMA, "set-scope-authority", [Cl.buffer(SCOPE), Cl.principal(w1)], w1);
  t("E4: OLD authority w1 cannot reclaim authority -> u113", j(r).includes("u113"), j(r));
  // delegate inherited by the new authority
  r = simnet.callReadOnlyFn(XMA, "is-active-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
  t("E4: delegate w2 INHERITED by new authority (still active)", j(r).includes("true"), j(r));
  r = simnet.callReadOnlyFn(XMA, "get-scope", [Cl.buffer(SCOPE)], w1);
  t("E4: key-authority still w1; operational authority now w3",
    j(r).includes("(key-authority " + w1 + ")") && j(r).includes("(authority " + w3 + ")"), j(r));
  // new authority is fully empowered
  r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w1)], w3);
  t("E4: NEW authority w3 can add a delegate", j(r).includes("ok"), j(r));
}

// ============================================================ E5 idempotency & dead ends
{
  // re-withdraw is silently idempotent
  const m = mint(w1);
  reg(m.id, m.hash, w1);
  let r = simnet.callPublicFn(XMA, "withdraw-manifest", [Cl.uint(m.id)], w1);
  t("E5: first withdraw ok", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "withdraw-manifest", [Cl.uint(m.id)], w1);
  t("E5: re-withdraw of an already-withdrawn manifest is idempotent ok", j(r).includes("ok"), j(r));

  // declaring a predecessor that exists in CORE but is NOT an XMA manifest:
  // registration succeeds (only the core edge is checked), creating an orphan
  // declaration that can never be used in succession.
  const orphanParent = mint(w1);               // core inscription, never registered in XMA
  const child = mint(w1, { parents: [orphanParent.id] });
  r = reg(child.id, child.hash, w1, orphanParent.id);
  t("E5: register child declaring an UNREGISTERED predecessor still ok (core edge only)",
    j(r).includes("ok"), j(r));
  r = simnet.callReadOnlyFn(XMA, "is-manifest-registered", [Cl.uint(orphanParent.id)], w1);
  t("E5: ...but that predecessor is not an XMA manifest (orphan declaration)",
    j(r).includes("false"), j(r));
}

// ============================================================ E6 boundary inputs
{
  // claimed-verification floor CLAIM-NONE u0
  const m0 = mint(w1);
  let r = reg(m0.id, m0.hash, w1, null, { claim: 0 });
  t("E6: claimed-verification = u0 (CLAIM-NONE) accepted", j(r).includes("ok"), j(r));

  // item-count = 0
  const mc = mint(w1);
  r = reg(mc.id, mc.hash, w1, null, { count: 0 });
  t("E6: item-count = 0 accepted", j(r).includes("ok"), j(r));
  r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(mc.id)], w1);
  t("E6: item-count persisted as u0", j(r).includes("(item-count u0)"), j(r));

  // self-referential predecessor: a fresh manifest is not its own core parent
  const ms = mint(w1);
  r = reg(ms.id, ms.hash, w1, ms.id);
  t("E6: self-referential previous-manifest-id -> u120 (no self parent edge)",
    j(r).includes("u120"), j(r));
}

// ============================================================ E7 manifest-type fixed by first head
// Policy at the head only checks lifecycle + authority-class, so the FIRST head
// may carry any in-range manifest-type; every successor is then locked to it.
{
  const SCOPE = scopeBuf("type-lock-scope");
  let r = createScope(SCOPE, w1);            // authclass 7, life 3
  t("E7: create scope", j(r).includes("ok"), j(r));
  // head with an unusual type (FINANCIAL u16) but matching life/authclass
  const head = mint(w1);
  r = reg(head.id, head.hash, w1, null, { mType: 16 });
  t("E7: register head with TYPE-FINANCIAL (u16)", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id)], w1);
  t("E7: financial-typed manifest accepted as scope head (type unchecked at head)",
    j(r).includes("ok"), j(r));
  // successor that KEEPS the type
  const good = mint(w1, { parents: [head.id] });
  r = reg(good.id, good.hash, w1, head.id, { mType: 16 });
  t("E7: register matching-type successor", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id), Cl.uint(good.id)], w1);
  t("E7: same-type succession ok", j(r).includes("ok"), j(r));
  // successor that CHANGES the type -> rejected
  const bad = mint(w1, { parents: [good.id] });
  r = reg(bad.id, bad.hash, w1, good.id, { mType: 2 }); // TYPE-ALBUM
  t("E7: register type-changing successor (registration itself is fine)", j(r).includes("ok"), j(r));
  r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(good.id), Cl.uint(bad.id)], w1);
  t("E7: type change across succession rejected -> u123", j(r).includes("u123"), j(r));
}

// ============================================================ E8 permanent seal (close-scope, v1.5 S1)
// One-way seal, gated to the IMMUTABLE key-authority (original creator) even
// after operational authority is transferred away. A sealed scope preserves its
// current manifest as the final answer and rejects all further mutation.
{
  const SCOPE = scopeBuf("seal-scope");
  let r = createScope(SCOPE, w1);            // w1 = key-authority AND operational authority
  t("E8: create scope", j(r).includes("ok"), j(r));
  const head = mint(w1);
  reg(head.id, head.hash, w1);
  r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id)], w1);
  t("E8: register initial head", j(r).includes("ok"), j(r));
  // pre-register a perfectly valid successor so the later rejection proves the
  // SEAL is what blocks succession (not a bad candidate).
  const succ = mint(w1, { parents: [head.id] });
  reg(succ.id, succ.hash, w1, head.id);

  // hand operational control to w2; key-authority stays w1
  r = simnet.callPublicFn(XMA, "set-scope-authority", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
  t("E8: operational authority transferred to w2", j(r).includes("ok"), j(r));

  // current operational authority (w2) is NOT the original creator -> cannot seal
  r = simnet.callPublicFn(XMA, "close-scope", [Cl.buffer(SCOPE)], w2);
  t("E8: operational authority w2 CANNOT seal (not key-authority) -> u113", j(r).includes("u113"), j(r));

  // original creator w1 can still seal even after giving up operational control
  r = simnet.callPublicFn(XMA, "close-scope", [Cl.buffer(SCOPE)], w1);
  t("E8: original creator w1 seals the scope", j(r).includes("ok"), j(r));
  r = simnet.callReadOnlyFn(XMA, "is-scope-active", [Cl.buffer(SCOPE)], w1);
  t("E8: is-scope-active now false (sealed)", j(r) === "false", j(r));

  // final answer preserved
  r = simnet.callReadOnlyFn(XMA, "get-current-active-manifest", [Cl.buffer(SCOPE)], w1);
  t("E8: sealed scope still resolves to its final manifest", j(r).includes("u" + head.id), j(r));

  // all further mutation rejected with u125
  r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w1)], w2);
  t("E8: add-delegate on sealed scope -> u125", j(r).includes("u125"), j(r));
  r = simnet.callPublicFn(XMA, "set-scope-authority", [Cl.buffer(SCOPE), Cl.principal(w1)], w2);
  t("E8: set-authority on sealed scope -> u125", j(r).includes("u125"), j(r));
  r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(head.id), Cl.uint(succ.id)], w2);
  t("E8: succession on sealed scope rejected even with a valid successor -> u125", j(r).includes("u125"), j(r));
  r = simnet.callPublicFn(XMA, "close-scope", [Cl.buffer(SCOPE)], w1);
  t("E8: double-seal rejected (one-way) -> u125", j(r).includes("u125"), j(r));

  // finality vs recovery: emergency revoke still works at the manifest level,
  // but no successor can be appointed afterwards (scope is sealed).
  r = simnet.callPublicFn(XMA, "revoke-manifest", [Cl.uint(head.id)], w1);
  t("E8: emergency revoke of the final manifest still works (manifest-level)", j(r).includes("ok"), j(r));
  r = simnet.callReadOnlyFn(XMA, "get-current-active-manifest", [Cl.buffer(SCOPE)], w1);
  t("E8: after revoke, sealed scope has no active answer and cannot recover", j(r) === "none", j(r));
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
