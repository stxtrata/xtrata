// xtrata-manifest-authority-v1 (v1.5) PROPERTY / FUZZ suite
// Throws long randomized sequences of registry operations at the contract and,
// after every single step, asserts a set of GLOBAL INVARIANTS that must hold no
// matter the ordering. Unlike smoke/edge (which assert specific outcomes for
// specific scenarios), this hunts for an interleaving nobody thought to write.
//
// Run:  node tests/fuzz.mjs            (default 250 ops)
//       SEED=123 OPS=1000 node tests/fuzz.mjs   (reproducible / longer)
// A failing run prints the SEED so the exact sequence can be replayed.
import { initSimnet } from "@hirosystems/clarinet-sdk";
import { Cl, cvToString } from "@stacks/transactions";
import { createHash } from "crypto";

const SEED = Number(process.env.SEED ?? Math.floor(Math.random() * 1e9));
const OPS = Number(process.env.OPS ?? 250);
// Deterministic PRNG (mulberry32) so any failure is reproducible from SEED.
let _s = SEED >>> 0;
function rng() { _s |= 0; _s = (_s + 0x6D2B79F5) | 0; let t = Math.imul(_s ^ (_s >>> 15), 1 | _s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const chance = (p) => rng() < p;

const simnet = await initSimnet("./Clarinet.toml");
const a = simnet.getAccounts();
const deployer = a.get("deployer");
const w1 = a.get("wallet_1");
const w2 = a.get("wallet_2");
const SIGNERS = [deployer, w1, w2];      // principals that can send txs in simnet
const CORE = "xtrata-v3-2-3";
const XMA = "xtrata-manifest-authority-v1";
const MIME = "application/vnd.xtrata.manifest+json";

const j = (r) => cvToString(r.result);
const ok = (r) => j(r).includes("(ok") || j(r) === "(ok true)";
simnet.callPublicFn(CORE, "set-paused", [Cl.bool(false)], deployer);
function coreHash(buf) { return createHash("sha256").update(Buffer.concat([Buffer.alloc(32), buf])).digest(); }

// ---- local model (only what we need to build plausible ops + check invariants)
let salt = 0;
const coreOwner = new Map();        // inscription id -> principal
const manifests = new Map();        // id -> { creator, prev, registered, mType, ac, life }
const scopes = new Map();           // keyHex -> { keyBuf, ac, life, label }
const headHist = new Map();         // keyHex -> last observed current id (number|null)
const sealed = new Map();           // keyHex -> head id captured at first sealed observation
const leftActive = new Set();       // manifest ids ever observed in a non-ACTIVE status

let checks = 0, fail = 0;
const die = (msg, extra) => {
  console.error(`\nINVARIANT VIOLATION (seed=${SEED}): ${msg}`);
  if (extra) console.error(extra);
  fail++;
};

function mint(sender, parents = []) {
  const buf = Buffer.from(JSON.stringify({ m: ++salt }));
  const r = simnet.callPublicFn(CORE, "mint-single-tx-with-relationships",
    [Cl.buffer(coreHash(buf)), Cl.stringAscii(MIME), Cl.uint(buf.length),
     Cl.list([Cl.buffer(buf)]), Cl.stringAscii("uri"),
     Cl.list([]), Cl.list(parents.map(Cl.uint))], sender);
  const m = j(r).match(/token-id u(\d+)/);
  if (!m) return null;
  const id = Number(m[1]);
  coreOwner.set(id, sender);
  return { id, hash: coreHash(buf) };
}

const regCall = (id, hash, sender, prev, mType, ac, life) => simnet.callPublicFn(XMA, "register-manifest", [
  Cl.uint(id), Cl.uint(ac), Cl.uint(mType), Cl.uint(life), Cl.uint(8),
  Cl.uint(1), Cl.stringAscii("1.0.0"),
  Cl.some(Cl.buffer(hash)), Cl.none(), Cl.none(),
  Cl.uint(1), Cl.uint(0),
  prev != null ? Cl.some(Cl.uint(prev)) : Cl.none(),
  Cl.uint(2)], sender);

// ---- read-only parsers
function getScope(keyBuf) {
  const s = j(simnet.callReadOnlyFn(XMA, "get-scope", [Cl.buffer(keyBuf)], deployer));
  if (s === "none") return null;
  const cur = s.match(/current-manifest-id (none|\(some u(\d+)\))/);
  return {
    active: /[ (]active true/.test(s) || /active: true/.test(s) || / active true/.test(s) || /active true/.test(s),
    currentId: cur && cur[2] != null ? Number(cur[2]) : null,
    keyAuth: (s.match(/key-authority (\S+?)[,)]/) || [])[1],
    authority: (s.match(/[ ,(]authority (\S+?)[,)]/) || [])[1],
    raw: s,
  };
}
function getRecord(id) {
  const s = j(simnet.callReadOnlyFn(XMA, "get-manifest-record", [Cl.uint(id)], deployer));
  if (s === "none") return null;
  const cs = s.match(/current-scope (none|\(some (0x[0-9a-f]+)\))/);
  const prev = s.match(/previous-manifest-id (none|\(some u(\d+)\))/);
  return {
    status: Number((s.match(/[ (]status u(\d+)/) || [])[1]),
    currentScope: cs && cs[2] ? cs[2] : null,
    prev: prev && prev[2] != null ? Number(prev[2]) : null,
    raw: s,
  };
}
const activeView = (keyBuf) => {
  const s = j(simnet.callReadOnlyFn(XMA, "get-current-active-manifest", [Cl.buffer(keyBuf)], deployer));
  const m = s.match(/u(\d+)/);
  return s === "none" ? null : (m ? Number(m[1]) : null);
};
const isActive = (keyBuf) => j(simnet.callReadOnlyFn(XMA, "is-scope-active", [Cl.buffer(keyBuf)], deployer)) === "true";
const keyHex = (buf) => "0x" + buf.toString("hex");

// ---- the invariant sweep, run after every op
function sweep() {
  for (const [hex, sc] of scopes) {
    const s = getScope(sc.keyBuf);
    checks++;
    if (!s) { die(`scope ${hex} vanished`); continue; }
    const active = isActive(sc.keyBuf);

    // INV1: pointer consistency — a scope's current head records this scope.
    if (s.currentId != null) {
      const rec = getRecord(s.currentId);
      if (!rec) die(`INV1: scope head ${s.currentId} not registered`, s.raw);
      else if (rec.currentScope !== keyHex(sc.keyBuf))
        die(`INV1: head ${s.currentId} current-scope=${rec.currentScope} != scope ${hex}`, rec.raw);
    }

    // INV3: active-view == head iff head is ACTIVE, else none.
    const av = activeView(sc.keyBuf);
    if (s.currentId == null) {
      if (av !== null) die(`INV3: empty scope ${hex} has active view ${av}`);
    } else {
      const rec = getRecord(s.currentId);
      const expect = rec && rec.status === 1 ? s.currentId : null;
      if (av !== expect) die(`INV3: scope ${hex} active-view=${av} expected ${expect} (status ${rec && rec.status})`);
    }

    // INV4: a sealed scope is frozen — active=false forever, head never moves.
    if (!active) {
      if (!sealed.has(hex)) sealed.set(hex, s.currentId);
      else if (sealed.get(hex) !== s.currentId)
        die(`INV4: sealed scope ${hex} head moved ${sealed.get(hex)} -> ${s.currentId}`);
    } else if (sealed.has(hex)) {
      die(`INV4: scope ${hex} was sealed but is active again`);
    }

    // INV6: continuity — when a head advances, the new head declared the old.
    const last = headHist.get(hex);
    if (last != null && s.currentId != null && s.currentId !== last) {
      const rec = getRecord(s.currentId);
      if (rec && rec.prev !== last)
        die(`INV6: scope ${hex} advanced ${last} -> ${s.currentId} but new prev=${rec.prev}`);
    }
    headHist.set(hex, s.currentId);
  }

  // INV2: single-scope currency — each manifest is current for <=1 scope, and
  // if it advertises a current-scope, that scope really points back to it.
  for (const id of manifests.keys()) {
    const rec = getRecord(id);
    if (!rec) continue;
    if (rec.status !== 1) leftActive.add(id);
    // INV5: no resurrection — once a manifest leaves ACTIVE it never returns.
    if (rec.status === 1 && leftActive.has(id))
      die(`INV5: manifest ${id} returned to ACTIVE after leaving it`);
    if (rec.currentScope) {
      const sc = scopes.get(rec.currentScope);
      if (!sc) die(`INV2: manifest ${id} points at unknown scope ${rec.currentScope}`);
      else {
        const s = getScope(sc.keyBuf);
        if (!s || s.currentId !== id)
          die(`INV2: manifest ${id} claims scope ${rec.currentScope} but scope head=${s && s.currentId}`);
      }
    }
  }
}

// ---- operation generators (all build plausible-but-randomized args)
function opCreateScope() {
  const signer = pick(SIGNERS);
  const label = `f${salt}-${Math.floor(rng() * 1e6)}`;
  const buf = Buffer.alloc(32); buf.write(label);
  const ac = chance(0.8) ? 7 : 2;
  const life = chance(0.8) ? 3 : pick([1, 2]);
  const r = simnet.callPublicFn(XMA, "create-scope", [Cl.buffer(buf), Cl.uint(ac), Cl.uint(life)], signer);
  if (ok(r)) scopes.set(keyHex(buf), { keyBuf: buf, ac, life, label, keyAuth: signer });
}
function opRegister() {
  const signer = pick(SIGNERS);
  const m = mint(signer);
  if (!m) return;
  const r = regCall(m.id, m.hash, signer, null, 12, 7, 3);
  if (ok(r)) manifests.set(m.id, { creator: signer, prev: null, registered: true, mType: 12, ac: 7, life: 3, hash: m.hash });
}
function opSeed() {
  // constructive: mint+register a fresh head by the scope's own authority so the
  // creator/policy checks pass and a head actually gets installed.
  const cands = [...scopes.values()].filter(sc => sc.ac === 7 && sc.life === 3);
  if (!cands.length) return;
  const sc = pick(cands);
  const s = getScope(sc.keyBuf);
  if (!s || !isActive(sc.keyBuf) || s.currentId != null) return;
  const auth = s.authority;
  if (!SIGNERS.includes(auth)) return;
  const m = mint(auth);
  if (!m) return;
  const r = regCall(m.id, m.hash, auth, null, 12, 7, 3);
  if (!ok(r)) return;
  manifests.set(m.id, { creator: auth, prev: null, registered: true, mType: 12, ac: 7, life: 3, hash: m.hash });
  simnet.callPublicFn(XMA, "register-initial-scope-manifest", [Cl.buffer(sc.keyBuf), Cl.uint(m.id)], auth);
}
function opSucceed() {
  // constructive: build a valid successor, routing through a delegate ~40% of
  // the time, transferring the head inscription to the creator to satisfy the
  // core parent-ownership rule. Exercises the continuity / supersession path.
  const withHead = [...scopes.values()].filter(sc => {
    const s = getScope(sc.keyBuf); return s && isActive(sc.keyBuf) && s.currentId != null;
  });
  if (!withHead.length) return;
  const sc = pick(withHead);
  const s = getScope(sc.keyBuf);
  const head = s.currentId;
  const auth = s.authority;
  if (!SIGNERS.includes(auth)) return;
  let creator = auth;
  if (chance(0.4)) {
    const del = pick(SIGNERS);
    if (ok(simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(sc.keyBuf), Cl.principal(del)], auth))) creator = del;
  }
  const owner = coreOwner.get(head);
  if (owner !== creator) {
    if (!SIGNERS.includes(owner)) return;
    if (!ok(simnet.callPublicFn(CORE, "transfer", [Cl.uint(head), Cl.principal(owner), Cl.principal(creator)], owner))) return;
    coreOwner.set(head, creator);
  }
  const mType = manifests.get(head)?.mType ?? 12;
  const succ = mint(creator, [head]);
  if (!succ) return;
  const r = regCall(succ.id, succ.hash, creator, head, mType, sc.ac, sc.life);
  if (!ok(r)) return;
  manifests.set(succ.id, { creator, prev: head, registered: true, mType, ac: sc.ac, life: sc.life, hash: succ.hash });
  simnet.callPublicFn(XMA, "update-scope-manifest", [Cl.buffer(sc.keyBuf), Cl.uint(head), Cl.uint(succ.id)], auth);
}
function opRevoke() {
  if (!manifests.size) return;
  const id = pick([...manifests.keys()]);
  const md = manifests.get(id);
  simnet.callPublicFn(XMA, "revoke-manifest", [Cl.uint(id)], chance(0.5) ? md.creator : deployer);
}
function opWithdraw() {
  if (!manifests.size) return;
  const id = pick([...manifests.keys()]);
  const md = manifests.get(id);
  simnet.callPublicFn(XMA, "withdraw-manifest", [Cl.uint(id)], md.creator);
}
function opSeal() {
  if (!scopes.size) return;
  const sc = pick([...scopes.values()]);
  simnet.callPublicFn(XMA, "close-scope", [Cl.buffer(sc.keyBuf)], chance(0.7) ? sc.keyAuth : pick(SIGNERS));
}
function opTransferCore() {
  if (!manifests.size) return;
  const id = pick([...manifests.keys()]);
  const from = coreOwner.get(id);
  const to = pick(SIGNERS);
  if (from === to || !SIGNERS.includes(from)) return;
  const r = simnet.callPublicFn(CORE, "transfer", [Cl.uint(id), Cl.principal(from), Cl.principal(to)], from);
  if (ok(r)) coreOwner.set(id, to);
}
function opSetAuthority() {
  if (!scopes.size) return;
  const sc = pick([...scopes.values()]);
  const s = getScope(sc.keyBuf);
  if (!s) return;
  simnet.callPublicFn(XMA, "set-scope-authority", [Cl.buffer(sc.keyBuf), Cl.principal(pick(SIGNERS))], s.authority);
}
function opAddDelegate() {
  if (!scopes.size) return;
  const sc = pick([...scopes.values()]);
  const s = getScope(sc.keyBuf);
  if (!s) return;
  simnet.callPublicFn(XMA, "add-scope-delegate", [Cl.buffer(sc.keyBuf), Cl.principal(pick(SIGNERS))], s.authority);
}
function opRemoveDelegate() {
  if (!scopes.size) return;
  const sc = pick([...scopes.values()]);
  const s = getScope(sc.keyBuf);
  if (!s) return;
  simnet.callPublicFn(XMA, "remove-scope-delegate", [Cl.buffer(sc.keyBuf), Cl.principal(pick(SIGNERS))], s.authority);
}

const OPS_TABLE = [
  [opCreateScope, 6], [opRegister, 9], [opSeed, 16], [opSucceed, 28],
  [opRevoke, 7], [opWithdraw, 5], [opSeal, 5], [opTransferCore, 6],
  [opSetAuthority, 5], [opAddDelegate, 5], [opRemoveDelegate, 3],
];
const WEIGHTED = OPS_TABLE.flatMap(([fn, w]) => Array(w).fill(fn));

console.log(`fuzz: seed=${SEED} ops=${OPS}`);
for (let i = 0; i < OPS && !fail; i++) {
  try { pick(WEIGHTED)(); }
  catch (e) { die(`op threw at step ${i}: ${e.message}`, e.stack); break; }
  sweep();
}

let withHead = 0, sealedCnt = 0, superseded = 0;
for (const sc of scopes.values()) { const s = getScope(sc.keyBuf); if (s && s.currentId != null) withHead++; if (s && !isActive(sc.keyBuf)) sealedCnt++; }
for (const id of manifests.keys()) { const r = getRecord(id); if (r && r.status === 2) superseded++; }
console.log(`\nseed=${SEED}  ops=${OPS}  scopes=${scopes.size}  manifests=${manifests.size}  invariant-checks=${checks}  violations=${fail}`);
console.log(`coverage: scopes-with-head=${withHead}  sealed=${sealedCnt}  superseded-manifests=${superseded}  manifests-left-active=${leftActive.size}`);
process.exit(fail ? 1 : 0);
