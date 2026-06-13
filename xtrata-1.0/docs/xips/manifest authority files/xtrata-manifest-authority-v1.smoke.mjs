import { initSimnet } from "@hirosystems/clarinet-sdk";
import { Cl } from "@stacks/transactions";
const simnet = await initSimnet("./Clarinet.toml");
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer");
const w1 = accounts.get("wallet_1");
const w2 = accounts.get("wallet_2");
const CORE = "xtrata-v3-2-3";
const XMA = "xtrata-manifest-authority-v1";
let pass = 0, fail = 0;
const t = (name, cond, got) => { cond ? pass++ : (fail++, console.log("FAIL:", name, "got:", got)); };
const j = (r) => JSON.stringify(Cl.prettyPrint ? Cl.prettyPrint(r.result) : r.result);

// unpause core (deployer is admin)
let r = simnet.callPublicFn(CORE, "set-paused", [Cl.bool(false)], deployer);
t("unpause", j(r).includes("ok"), j(r));

// helper: mint a sealed single-tx inscription, returns id
import { createHash } from "crypto";
function mint(content, sender) {
  const buf = Buffer.from(content);
  const hash = createHash("sha256").update(Buffer.concat([Buffer.alloc(32), buf])).digest();
  const r = simnet.callPublicFn(CORE, "mint-single-tx",
    [Cl.buffer(hash), Cl.stringAscii("application/json"), Cl.uint(buf.length),
     Cl.list([Cl.buffer(buf)]), Cl.stringAscii("uri")], sender);
  const m = j(r).match(/u(\d+)/);
  return { id: m ? Number(m[1]) : null, raw: j(r), hash };
}

// w1 = scope authority, mints manifest v1
const m1 = mint('{"manifest":"v1"}', w1);
t("mint m1", m1.id !== null, m1.raw);

// register-manifest by w1, with matching hash
const SCOPE = Buffer.alloc(32); SCOPE.write("xip-corpus");
const reg = (id, hashOpt, sender, prev) => simnet.callPublicFn(XMA, "register-manifest", [
  Cl.uint(id), Cl.uint(7) /*AUTH-CORPUS*/, Cl.uint(12) /*TYPE-STANDARD-CORPUS*/,
  Cl.uint(3) /*LIFE-CONTINUITY*/, Cl.uint(8) /*TARGET-CORPUS-SCOPE*/,
  Cl.uint(1), Cl.stringAscii("1.0.0"),
  hashOpt ? Cl.some(Cl.buffer(hashOpt)) : Cl.none(),
  Cl.none(), Cl.none(), Cl.uint(9), Cl.uint(0),
  prev != null ? Cl.some(Cl.uint(prev)) : Cl.none(), Cl.uint(2)], sender);

// hash mismatch must fail u116
let bad = reg(m1.id, Buffer.alloc(32, 7), w1);
t("hash mismatch -> u116", j(bad).includes("u116"), j(bad));
// unknown id must fail u117
bad = reg(9999, null, w1);
t("unsealed/unknown -> u117", j(bad).includes("u117"), j(bad));
// good registration
r = reg(m1.id, m1.hash, w1);
t("register m1", j(r).includes("ok"), j(r));

// scope creation + initial manifest
r = simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(SCOPE), Cl.principal(w1), Cl.uint(7), Cl.uint(3)], w1);
t("create-scope", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.none(), Cl.uint(9)], w1);
t("initial scope manifest", j(r).includes("ok"), j(r));

// delegate flow: w2 inscribes manifest v2
const m2 = mint('{"manifest":"v2"}', w2);
t("mint m2", m2.id !== null, m2.raw);
r = reg(m2.id, m2.hash, w2, m1.id);
t("register m2", j(r).includes("ok"), j(r));

// succession by authority with NON-delegate creator must fail u100
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.uint(m2.id), Cl.none(), Cl.uint(10), Cl.uint(1)], w1);
t("non-delegate creator rejected -> u100", j(r).includes("u100"), j(r));

// add w2 as delegate (only authority can)
r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w2);
t("non-authority add delegate rejected -> u113", j(r).includes("u113"), j(r));
r = simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
t("authority adds delegate", j(r).includes("ok"), j(r));

// delegate cannot advance pointer themselves
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.uint(m2.id), Cl.none(), Cl.uint(10), Cl.uint(1)], w2);
t("delegate cannot call succession -> u113", j(r).includes("u113"), j(r));

// authority advances with delegate-created manifest
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m1.id), Cl.uint(m2.id), Cl.none(), Cl.uint(10), Cl.uint(1)], w1);
t("succession with delegate creator", j(r).includes("ok"), j(r));

// current pointer + supersession
r = simnet.callReadOnlyFn(XMA, "get-current-manifest", [Cl.buffer(SCOPE)], w1);
t("current = m2", j(r).includes(`u${m2.id}`), j(r));
r = simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(m1.id)], w1);
t("m1 superseded status u2 -> by m2", j(r).includes("status: u2") && j(r).includes(`superseded-by: (some u${m2.id}`), j(r));

// remove delegate; future delegate manifests rejected
r = simnet.callPublicFn(XMA, "remove-scope-delegate", [Cl.buffer(SCOPE), Cl.principal(w2)], w1);
t("remove delegate", j(r).includes("ok"), j(r));
const m3 = mint('{"manifest":"v3"}', w2);
r = reg(m3.id, m3.hash, w2, m2.id);
t("register m3", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m2.id), Cl.uint(m3.id), Cl.none(), Cl.uint(11), Cl.uint(1)], w1);
t("removed delegate rejected -> u100", j(r).includes("u100"), j(r));
// but m2 remains current
r = simnet.callReadOnlyFn(XMA, "is-current-for-scope", [Cl.buffer(SCOPE), Cl.uint(m2.id)], w1);
t("m2 still current", j(r).includes("true"), j(r));

// wrong-previous check
const m4 = mint('{"manifest":"v4"}', w1);
r = reg(m4.id, m4.hash, w1, m1.id); // declares wrong predecessor
t("register m4", j(r).includes("ok"), j(r));
r = simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(SCOPE), Cl.uint(m2.id), Cl.uint(m4.id), Cl.none(), Cl.uint(11), Cl.uint(1)], w1);
t("predecessor mismatch -> u109", j(r).includes("u109"), j(r));

console.log(`\n${pass} passed, ${fail} failed`);
