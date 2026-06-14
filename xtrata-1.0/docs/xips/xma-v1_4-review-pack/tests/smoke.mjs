// xtrata-manifest-authority-v1 (v1.2) smoke + attack-scenario suite
// Run: node smoke.mjs   (requires @hirosystems/clarinet-sdk, @stacks/transactions)
import { initSimnet } from "@hirosystems/clarinet-sdk";
import { Cl, cvToString } from "@stacks/transactions";
import { createHash } from "crypto";

const simnet = await initSimnet("./Clarinet.toml");
const a = simnet.getAccounts();
const deployer = a.get("deployer");
const w1 = a.get("wallet_1"); // scope authority
const w2 = a.get("wallet_2"); // delegate / attacker
const CORE = "xtrata-v3-2-3";
const XMA = "xtrata-manifest-authority-v1";
const MIME = "application/vnd.xtrata.manifest+json";

let pass = 0, fail = 0;
const t = (name, cond, got) => { cond ? pass++ : (fail++, console.log("FAIL:", name, "got:", got)); };
const j = (r) => cvToString(r.result);

simnet.callPublicFn(CORE, "set-paused", [Cl.bool(false)], deployer);

// Core final-hash is CHAINED: sha256(prev32 || chunk), seed = 32 zero bytes.
function coreHash(buf) { return createHash("sha256").update(Buffer.concat([Buffer.alloc(32), buf])).digest(); }

let salt = 0;
function mint(sender, { parents = [], mime = MIME } = {}) {
  const buf = Buffer.from(JSON.stringify({ m: ++salt }));
  const hash = coreHash(buf);
  const r = simnet.callPublicFn(CORE, "mint-single-tx-with-relationships",
    [Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(buf.length),
     Cl.list([Cl.buffer(buf)]), Cl.stringAscii("uri"),
     Cl.list([]), Cl.list(parents.map(Cl.uint))], sender);
  const m = j(r).match(/token-id u(\d+)/);
  return { id: m ? Number(m[1]) : null, raw: j(r), hash };
}

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

const SCOPE = Buffer.alloc(32); SCOPE.write("xip-corpus");

// ---------------------------------------------------------------- registration
const m1 = mint(w1);
t("mint m1 with manifest MIME", m1.id !== null, m1.raw);

// ATTACK (codex 2nd review #1): attacker front-runs registration of someone
// else's inscription -> creator-only registration rejects.
let r = reg(m1.id, m1.hash, w2);
t("R9: non-creator registration (front-run) -> u100", j(r).includes("u100"), j(r));

r = reg(m1.id, Buffer.alloc(32, 7), w1);
t("R-hash: wrong hash -> u116", j(r).includes("u116"), j(r));
r = reg(9999, null, w1);
t("R-core: unknown id -> u117", j(r).includes("u117"), j(r));

const wrongMime = mint(w1, { mime: "application/json" });
r = reg(wrongMime.id, wrongMime.hash, w1);
t("R7: non-manifest MIME -> u121", j(r).includes("u121"), j(r));

const noEdge = mint(w1); // no core parents
r = reg(noEdge.id, noEdge.hash, w1, m1.id);
t("R3: declared predecessor without core parent edge -> u120", j(r).includes("u120"), j(r));

r = reg(m1.id, m1.hash, w1, null, { claim: 9 });
t("R2: out-of-range claimed-verification -> u122", j(r).includes("u122"), j(r));

r = reg(m1.id, m1.hash, w1);
t("register m1 ok", j(r).includes("ok"), j(r));
r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(m1.id)], w1);
t("R2: core-hash-verified contract-set true", j(r).includes("(core-hash-verified true)"), j(r));

const noHash = mint(w1);
r = reg(noHash.id, null, w1);
t("register without hash ok", j(r).includes("ok"), j(r));
r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(noHash.id)], w1);
t("R2: core-hash-verified false when no hash supplied", j(r).includes("(core-hash-verified false)"), j(r));

// ---------------------------------------------------------------- scope claims
// ATTACK (codex #1): create-scope no longer takes an authority argument;
// tx-sender always becomes the authority. Raw labels remain first-come:
const ATTACKED = Buffer.alloc(32); ATTACKED.write("front-runnable");
r = simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(ATTACKED), Cl.uint(7), Cl.uint(3)], w2);
t("R1: raw label claimable by attacker only AS THEMSELVES (residual, documented)", j(r).includes("ok"), j(r));
r = simnet.callReadOnlyFn(XMA, "derive-scope-key", [Cl.principal(w1), Cl.buffer(SCOPE)], w1);
t("R1: derive-scope-key works", j(r).startsWith("0x"), j(r));

r = simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(SCOPE), Cl.uint(7), Cl.uint(3)], w1);
t("create scope (self-claim)", j(r).includes("ok"), j(r));
r = simnet.callReadOnlyFn(XMA, "get-scope", [Cl.buffer(SCOPE)], w1);
t("scope authority is tx-sender", j(r).includes(w1), j(r));

// ATTACK (codex #4): snapshot manifest must not become current for a
// continuity-enforced scope.
const snap = mint(w1);
r = reg(snap.id, snap.hash, w1, null, { life: 1, authClass: 2, mType: 3 });
t("register snapshot manifest", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(snap.id)], w1);
t("R4: snapshot rejected as corpus current -> u123", j(r).includes("u123"), j(r));

r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id)], w1);
t("initial scope manifest ok", j(r).includes("ok"), j(r));

// ---------------------------------------------------------------- succession
// CORE CONSTRAINT (validate-parents): declaring a parent requires OWNING the
// parent inscription at seal time. The authority hands the predecessor token
// to the delegate before the delegate inscribes the successor.
r = simnet.callPublicFn(CORE, "transfer", [Cl.uint(m1.id), Cl.principal(w1), Cl.principal(w2)], w1);
t("transfer m1 -> delegate (core parent-ownership rule)", j(r).includes("ok"), j(r));
const m2 = mint(w2, { parents: [m1.id] });
t("mint m2 (core parent edge -> m1)", m2.id !== null, m2.raw);
r = reg(m2.id, m2.hash, w2, m1.id, { root: Buffer.alloc(32, 0xAA), count: 10 });
t("register m2 ok", j(r).includes("ok"), j(r));

r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.uint(m2.id)], w1);
t("non-delegate creator rejected -> u100", j(r).includes("u100"), j(r));

r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w2);
t("non-authority cannot add delegate -> u113", j(r).includes("u113"), j(r));
r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
t("authority adds delegate", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.uint(m2.id)], w2);
t("delegate cannot advance pointer -> u113", j(r).includes("u113"), j(r));

// ATTACK (codex #6): withdraw/manual-supersede the CURRENT manifest.
r = simnet.callPublicFn(XMA, "withdraw-manifest", [Cl.uint(m1.id)], w1);
t("R6: withdraw current -> u119", j(r).includes("u119"), j(r));
r = simnet.callPublicFn(XMA, "mark-superseded", [Cl.uint(m1.id), Cl.uint(m2.id)], w1);
t("R6: manual supersede of current -> u119", j(r).includes("u119"), j(r));

r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.uint(m2.id)], w1);
t("succession ok (delegate creator + core edge)", j(r).includes("ok"), j(r));

// ATTACK (codex #5): scope must carry root/count COMMITTED AT REGISTRATION.
r = simnet.callReadOnlyFn(XMA, "get-scope", [Cl.buffer(SCOPE)], w1);
t("R5: scope root == registered commitment", j(r).includes("0xaaaa"), j(r));
t("R5: scope count == registered commitment", j(r).includes("(current-count u10)"), j(r));

r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(m1.id)], w1);
t("m1 superseded + scope marker released", j(r).includes("(status u2)") && j(r).includes("(current-scope none)"), j(r));
r = simnet.callReadOnlyFn(XMA, "get-current-active-manifest", [Cl.buffer(SCOPE)], w1);
t("current-active = m2", j(r).includes("u" + m2.id), j(r));

r = simnet.callPublicFn(XMA, "withdraw-manifest", [Cl.uint(m1.id)], w1);
t("withdraw non-current ok", j(r).includes("ok"), j(r));

// ---------------------------------------------------------------- removal + edges
r = simnet.callPublicFn(XMA, "remove-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
t("remove delegate", j(r).includes("ok"), j(r));
const m3 = mint(w2, { parents: [m2.id] });
r = reg(m3.id, m3.hash, w2, m2.id);
t("register m3", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m2.id), Cl.uint(m3.id)], w1);
t("removed delegate rejected -> u100", j(r).includes("u100"), j(r));
r = simnet.callReadOnlyFn(XMA, "is-current-for-scope", [Cl.buffer(SCOPE), Cl.uint(m2.id)], w1);
t("m2 still current", j(r).includes("true"), j(r));

// ATTACK (codex #3): edge present but declaration absent -> succession fails.
// (w1 needs to own m2 to declare it as parent - core rule.)
r = simnet.callPublicFn(CORE, "transfer", [Cl.uint(m2.id), Cl.principal(w2), Cl.principal(w1)], w2);
t("transfer m2 back to authority", j(r).includes("ok"), j(r));
const m4 = mint(w1, { parents: [m2.id] });
r = reg(m4.id, m4.hash, w1, null);
t("register m4 (edge, no declaration)", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m2.id), Cl.uint(m4.id)], w1);
t("R3/R5: declaration mismatch -> u109", j(r).includes("u109"), j(r));

const m5 = mint(w1, { parents: [m2.id] });
r = reg(m5.id, m5.hash, w1, m2.id);
t("register m5", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m2.id), Cl.uint(m5.id)], w1);
t("authority succession ok", j(r).includes("ok"), j(r));

// revoke CURRENT (emergency): allowed, pointer kept, active view = none.
r = simnet.callPublicFn(XMA, "revoke-manifest", [Cl.uint(m5.id)], w1);
t("revoke current allowed (emergency)", j(r).includes("ok"), j(r));
r = simnet.callReadOnlyFn(XMA, "get-current-manifest", [Cl.buffer(SCOPE)], w1);
t("structural pointer preserved", j(r).includes("u" + m5.id), j(r));
r = simnet.callReadOnlyFn(XMA, "get-current-active-manifest", [Cl.buffer(SCOPE)], w1);
t("active view of revoked current = none", j(r) === "none", j(r));

const m6 = mint(w1, { parents: [m5.id] });
reg(m6.id, m6.hash, w1, m5.id);
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m5.id), Cl.uint(m6.id)], w1);
t("recovery succession after revoke", j(r).includes("ok"), j(r));

// ATTACK (codex 2nd review #2): same manifest current in two scopes.
const SCOPE2 = Buffer.alloc(32); SCOPE2.write("xip-corpus-mirror");
r = simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(SCOPE2), Cl.uint(7), Cl.uint(3)], w1);
t("create second scope", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE2), Cl.uint(m6.id)], w1);
t("R10: already-current manifest rejected as second scope head -> u119", j(r).includes("u119"), j(r));
// and via update: seed scope2 with its own head, then try to advance to m6
const s2a = mint(w1);
reg(s2a.id, s2a.hash, w1);
r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE2), Cl.uint(s2a.id)], w1);
t("scope2 initial ok", j(r).includes("ok"), j(r));
// m6 already heads SCOPE; even with a valid edge it must be rejected for SCOPE2
// (cannot mint an edge s2a->m6 since m6 heads SCOPE; use declaration mismatch
// path instead: candidate m6 has current-scope set -> u119 fires first)
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE2), Cl.uint(s2a.id), Cl.uint(m6.id)], w1);
t("R10: already-current candidate in update -> u119", j(r).includes("u119"), j(r));

// R11 (codex 3rd review #1): authority transfer must not invalidate derived
// scope identity. Create a DERIVED scope, transfer operational authority,
// confirm key-authority is immutable and the derivation still matches it.
const DLABEL = Buffer.alloc(32); DLABEL.write("derived-corpus");
r = simnet.callReadOnlyFn(XMA, "derive-scope-key", [Cl.principal(w1), Cl.buffer(DLABEL)], w1);
const dkeyHex = j(r).replace("0x", "");
const DKEY = Buffer.from(dkeyHex, "hex");
r = simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(DKEY), Cl.uint(7), Cl.uint(3)], w1);
t("R11: derived scope created", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "set-scope-authority", [Cl.buffer(DKEY), Cl.principal(w2)], w1);
t("R11: operational authority transferred", j(r).includes("ok"), j(r));
r = simnet.callReadOnlyFn(XMA, "get-scope", [Cl.buffer(DKEY)], w1);
t("R11: key-authority immutable (= w1)", j(r).includes("(key-authority " + w1 + ")"), j(r));
t("R11: operational authority = w2", j(r).includes("(authority " + w2 + ")"), j(r));
r = simnet.callReadOnlyFn(XMA, "derive-scope-key", [Cl.principal(w1), Cl.buffer(DLABEL)], w1);
t("R11: derivation from key-authority still matches the key", j(r).includes(dkeyHex), j(r));

// ---------------------------------------------------------------- targets
r = simnet.callPublicFn(XMA, "add-manifest-target", [Cl.uint(m6.id), Cl.uint(9999), Cl.bool(true), Cl.uint(2)], w1);
t("target must exist in core -> u124", j(r).includes("u124"), j(r));
r = simnet.callPublicFn(XMA, "add-manifest-target", [Cl.uint(m6.id), Cl.uint(m1.id), Cl.bool(true), Cl.uint(9)], w1);
t("target claim range checked -> u122", j(r).includes("u122"), j(r));
r = simnet.callPublicFn(XMA, "add-manifest-target", [Cl.uint(m6.id), Cl.uint(m1.id), Cl.bool(true), Cl.uint(2)], w1);
t("valid target link ok", j(r).includes("ok"), j(r));

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
