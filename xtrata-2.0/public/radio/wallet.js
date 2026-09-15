var il = Object.defineProperty;
var cl = (t, e, n) => e in t ? il(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var _r = (t, e, n) => cl(t, typeof e != "symbol" ? e + "" : e, n);
const al = ["SP", "SM"], ll = ["ST", "SN"], ls = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return al.includes(n) ? "mainnet" : ll.includes(n) ? "testnet" : null;
}, dl = () => {
  const t = /* @__PURE__ */ new Map();
  return {
    getItem: (e) => t.get(e) ?? null,
    setItem: (e, n) => {
      t.set(e, n);
    },
    removeItem: (e) => {
      t.delete(e);
    }
  };
}, fl = () => typeof window > "u" || !window.localStorage ? dl() : window.localStorage, Hr = "xtrata.v15.1.wallet.session", xo = "mainnet", Fn = { isConnected: !1 }, hl = (t) => t.address ? ls(t.address) ?? t.network : t.network, Ei = (t) => !t.isConnected || !t.address ? { ...Fn } : hl(t) !== xo ? { ...Fn } : {
  isConnected: !0,
  address: t.address,
  network: xo,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, ul = (t) => {
  if (!t)
    return { ...Fn };
  try {
    const e = JSON.parse(t);
    return Ei(e);
  } catch {
    return { ...Fn };
  }
}, gl = (t) => {
  const e = Ei(t);
  return JSON.stringify(e);
}, pl = (t) => {
  const e = fl();
  return {
    load: () => ul(e.getItem(Hr)),
    save: (n) => {
      e.setItem(Hr, gl(n));
    },
    clear: () => {
      e.removeItem(Hr);
    }
  };
};
function bl(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function xl(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${bl(r)}`;
  let o = 2166136261, i = 522970236;
  for (let a = 0; a < s.length; a += 1) {
    const d = s.charCodeAt(a);
    o = Math.imul(o ^ d, 16777619), i = Math.imul(i ^ (d << 5 | d >>> 3), 16777619);
  }
  const c = (a) => (a >>> 0).toString(16).padStart(8, "0");
  return (c(o) + c(i)).slice(0, 16);
}
function vi(t) {
  if (t == null) return "";
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  const e = t;
  if (typeof e.message == "string") return e.message;
  try {
    return JSON.stringify(t);
  } catch {
    return String(t);
  }
}
function yl(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const $r = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function wl(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const o = $r(e[s]);
    o !== void 0 && (n[s] = o);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const o of ["code", "message", "reason"]) {
      const i = $r(r[o]);
      i !== void 0 && (s[o] = i);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = $r(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function ml(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = vi(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const Sl = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", Al = 20, yo = "xt_tel_sid";
function Rn() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Dr = null;
function El() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(yo);
      return t || (t = Rn(), sessionStorage.setItem(yo, t)), t;
    }
  } catch {
  }
  return Dr || (Dr = Rn()), Dr;
}
let _e = {
  address: null,
  kind: null
}, Ii = null;
function ds(t, e) {
  if (!t) {
    _e = { address: null, kind: e ?? _e.kind };
    return;
  }
  _e = { address: t.trim(), kind: e ?? _e.kind };
}
function fs(t) {
  Ii = typeof t == "string" && t.length > 0 ? t : null;
}
const wo = [];
class vl {
  constructor(e, n) {
    _r(this, "id", Rn());
    _r(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function Il(t, e) {
  return new vl(t, e);
}
function qe(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? vi(t.error) : void 0, o = t.error != null ? yl(t.error) : void 0, i = r ? xl(n, t.step, t.errorCode, s ?? "") : void 0, c = r ? wl(t.error) : void 0, a = {
      ...c ? { error: c } : {},
      ...t.context ?? {}
    };
    r && wo.length && (a.breadcrumbs = wo.slice(-Al));
    const d = {
      eventId: Rn(),
      ts: Date.now(),
      sessionId: El(),
      journeyId: t.journeyId ?? (e == null ? void 0 : e.id) ?? null,
      attempt: t.attempt ?? 1,
      flow: n,
      step: t.step ?? null,
      outcome: t.outcome,
      severity: t.severity ?? (r ? "error" : "info"),
      target: t.target ?? (e == null ? void 0 : e.target) ?? null,
      durationMs: t.durationMs ?? null,
      errorCode: t.errorCode ?? null,
      errorFingerprint: i ?? null,
      errorMessage: s ?? null,
      errorStack: o ?? null,
      appVersion: Sl,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: _e.address,
      walletKind: _e.kind,
      network: Ii,
      context: Object.keys(a).length ? a : void 0
    };
  } catch {
  }
}
const Ll = "https://browser.blockstack.org/auth", Ml = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Li = ["store_write"], _l = "blockstack-session", Hl = {
  logLevel: "debug"
}, we = {
  MISSING_PARAMETER: "missing_parameter",
  REMOTE_SERVICE_ERROR: "remote_service_error",
  INVALID_STATE: "invalid_state",
  NO_SESSION_DATA: "no_session_data",
  DOES_NOT_EXIST: "does_not_exist",
  FAILED_DECRYPTION_ERROR: "failed_decryption_error",
  INVALID_DID_ERROR: "invalid_did_error",
  NOT_ENOUGH_FUNDS_ERROR: "not_enough_error",
  INVALID_AMOUNT_ERROR: "invalid_amount_error",
  LOGIN_FAILED_ERROR: "login_failed",
  SIGNATURE_VERIFICATION_ERROR: "signature_verification_failure",
  CONFLICT_ERROR: "conflict_error",
  NOT_ENOUGH_PROOF_ERROR: "not_enough_proof_error",
  BAD_PATH_ERROR: "bad_path_error",
  VALIDATION_ERROR: "validation_error",
  PAYLOAD_TOO_LARGE_ERROR: "payload_too_large_error",
  PRECONDITION_FAILED_ERROR: "precondition_failed_error",
  UNKNOWN: "unknown"
};
Object.freeze(we);
class ze extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, s = this.stack;
    if (s)
      r += `Stack Trace:
${s}`;
    else
      try {
        throw new Error();
      } catch (o) {
        s = o.stack;
      }
    n += `
If you believe this exception is caused by a bug in stacks.js,
      please file a bug report: https://github.com/blockstack/stacks.js/issues

${r}`, this.message = n, this.code = e.code, this.parameter = e.parameter ? e.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class $l extends ze {
  constructor(e, n = "") {
    super({ code: we.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class mo extends ze {
  constructor(e = "") {
    super({ code: we.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class wn extends ze {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: we.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class So extends ze {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: we.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Fr extends ze {
  constructor(e) {
    super({ code: we.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mi extends ze {
  constructor(e) {
    super({ code: we.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Ao = ["debug", "info", "warn", "error", "none"], Rr = {};
for (let t = 0; t < Ao.length; t++) {
  const e = Ao[t];
  Rr[e] = t;
}
class He {
  static error(e) {
    this.shouldLog("error") && console.error(this.logMessage("error", e));
  }
  static warn(e) {
    this.shouldLog("warn") && console.warn(this.logMessage("warn", e));
  }
  static info(e) {
    this.shouldLog("info") && console.log(this.logMessage("info", e));
  }
  static debug(e) {
    this.shouldLog("debug") && console.log(this.logMessage("debug", e));
  }
  static logMessage(e, n) {
    return `[${e.toUpperCase()}] ${n}`;
  }
  static shouldLog(e) {
    return Rr[Hl.logLevel] <= Rr[e];
  }
}
function Dl() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Cl() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Cr(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Nl() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function jl() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Tl(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function hs(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = jl(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    He.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Tl(s, t.toString(), n);
    throw He.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Bl(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
const Ul = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function se(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ul[n];
  return e;
}
function oe(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Bl(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function _i(t) {
  return new TextEncoder().encode(t);
}
function Hi(t) {
  return new TextDecoder().decode(t);
}
function je(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const kl = "https://api.mainnet.hiro.so", Ol = "https://api.testnet.hiro.so", Pl = "http://localhost:3999", Fl = "https://hub.blockstack.org";
function Rl(t) {
  const e = typeof t == "string" ? oe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
const zl = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Gl(t, e) {
  const n = {};
  return Object.assign(n, zl, e), await fetch(t, n);
}
function Vl(t) {
  let e = Gl, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Kl(...t) {
  const { fetchLib: e, middlewares: n } = Vl(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const a of n)
      typeof a.pre == "function" && (i = await Promise.resolve(a.pre({
        fetch: e,
        ...i
      })) ?? i);
    let c = await e(i.url, i.init);
    for (const a of n)
      typeof a.post == "function" && (c = await Promise.resolve(a.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class us {
  constructor(e = Li.slice(), n = ((c) => (c = hs("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", o = void 0, i = Ll) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function zr(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Wl(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $i(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Yl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  zr(t.outputLen), zr(t.blockLen);
}
function Zl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ql(t, e) {
  $i(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ue = {
  number: zr,
  bool: Wl,
  bytes: $i,
  hash: Yl,
  exists: Zl,
  output: Ql
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Nr = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), At = (t, e) => t << 32 - e | t >>> e, ql = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ql)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gs(t) {
  if (typeof t == "string" && (t = Xl(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Di = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function me(t) {
  const e = (r) => t().update(gs(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ci = class extends Di {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ue.hash(e);
    const r = gs(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return ue.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ue.exists(this), ue.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const rr = (t, e, n) => new Ci(t, e).update(n).digest();
rr.create = (t, e) => new Ci(t, e);
function Jl(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + d, c, r);
}
let ps = class extends Di {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Nr(this.buffer);
  }
  update(e) {
    ue.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gs(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Nr(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ue.exists(this), ue.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Jl(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Nr(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = a / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < d; l++)
      c.setUint32(4 * l, h[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const td = (t, e, n) => t & e ^ ~t & n, ed = (t, e, n) => t & e ^ t & n ^ e & n, nd = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Ft = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rt = new Uint32Array(64);
let Ni = class extends ps {
  constructor() {
    super(64, 32, 8, !1), this.A = Ft[0] | 0, this.B = Ft[1] | 0, this.C = Ft[2] | 0, this.D = Ft[3] | 0, this.E = Ft[4] | 0, this.F = Ft[5] | 0, this.G = Ft[6] | 0, this.H = Ft[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: a } = this;
    return [e, n, r, s, o, i, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Rt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Rt[l - 15], u = Rt[l - 2], b = At(g, 7) ^ At(g, 18) ^ g >>> 3, y = At(u, 17) ^ At(u, 19) ^ u >>> 10;
      Rt[l] = y + Rt[l - 7] + b + Rt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: d, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = At(c, 6) ^ At(c, 11) ^ At(c, 25), u = h + g + td(c, a, d) + nd[l] + Rt[l] | 0, y = (At(r, 2) ^ At(r, 13) ^ At(r, 22)) + ed(r, s, o) | 0;
      h = d, d = a, a = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, a, d, h);
  }
  roundClean() {
    Rt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, rd = class extends Ni {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Te = me(() => new Ni());
me(() => new rd());
const sd = {}, ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sd
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const P = BigInt(0), Q = BigInt(1), ie = BigInt(2), Je = BigInt(3), Eo = BigInt(8), z = Object.freeze({
  a: P,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Q,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), vo = (t, e) => (t + e / ie) / e, mn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = z, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Q * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), c = vo(o * t, e), a = vo(-r * t, e);
    let d = v(t - c * n - a * s, e), h = v(-c * r - a * o, e);
    const l = d > i, g = h > i;
    if (l && (d = e - d), g && (h = e - h), d > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: d, k2neg: g, k2: h };
  }
}, St = 32, pe = 32, Ti = 32, zn = St + 1, Gn = 2 * St + 1;
function Io(t) {
  const { a: e, b: n } = z, r = v(t * t), s = v(r * t);
  return v(s + e * t + n);
}
const Sn = z.a === P;
class bs extends Error {
  constructor(e) {
    super(e);
  }
}
function Lo(t) {
  if (!(t instanceof R))
    throw new TypeError("JacobianPoint expected");
}
class R {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof F))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(F.ZERO) ? R.ZERO : new R(e.x, e.y, Q);
  }
  static toAffineBatch(e) {
    const n = ld(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return R.toAffineBatch(e).map(R.fromAffine);
  }
  equals(e) {
    Lo(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e, a = v(s * s), d = v(c * c), h = v(n * d), l = v(o * a), g = v(v(r * c) * d), u = v(v(i * s) * a);
    return h === l && g === u;
  }
  negate() {
    return new R(this.x, v(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = v(e * e), o = v(n * n), i = v(o * o), c = e + o, a = v(ie * (v(c * c) - s - i)), d = v(Je * s), h = v(d * d), l = v(h - ie * a), g = v(d * (a - l) - Eo * i), u = v(ie * n * r);
    return new R(l, g, u);
  }
  add(e) {
    Lo(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e;
    if (o === P || i === P)
      return this;
    if (n === P || r === P)
      return e;
    const a = v(s * s), d = v(c * c), h = v(n * d), l = v(o * a), g = v(v(r * c) * d), u = v(v(i * s) * a), b = v(l - h), y = v(u - g);
    if (b === P)
      return y === P ? this.double() : R.ZERO;
    const S = v(b * b), L = v(b * S), M = v(h * S), x = v(y * y - L - ie * M), I = v(y * (M - x) - g * L), A = v(s * c * b);
    return new R(x, I, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = R.ZERO;
    if (typeof e == "bigint" && e === P)
      return n;
    let r = Ho(e);
    if (r === Q)
      return this;
    if (!Sn) {
      let l = n, g = this;
      for (; r > P; )
        r & Q && (l = l.add(g)), g = g.double(), r >>= Q;
      return l;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: c } = mn.splitScalar(r), a = n, d = n, h = this;
    for (; o > P || c > P; )
      o & Q && (a = a.add(h)), c & Q && (d = d.add(h)), h = h.double(), o >>= Q, c >>= Q;
    return s && (a = a.negate()), i && (d = d.negate()), d = new R(v(d.x * mn.beta), d.y, d.z), a.add(d);
  }
  precomputeWindow(e) {
    const n = Sn ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let c = 1; c < 2 ** (e - 1); c++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(R.BASE) && (n = F.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Gr.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = R.normalizeZ(s), Gr.set(n, s)));
    let o = R.ZERO, i = R.BASE;
    const c = 1 + (Sn ? 128 / r : 256 / r), a = 2 ** (r - 1), d = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let g = 0; g < c; g++) {
      const u = g * a;
      let b = Number(e & d);
      e >>= l, b > a && (b -= h, e += Q);
      const y = u, S = u + Math.abs(b) - 1, L = g % 2 !== 0, M = b < 0;
      b === 0 ? i = i.add(An(L, s[y])) : o = o.add(An(M, s[S]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = Ho(e), s, o;
    if (Sn) {
      const { k1neg: i, k1: c, k2neg: a, k2: d } = mn.splitScalar(r);
      let { p: h, f: l } = this.wNAF(c, n), { p: g, f: u } = this.wNAF(d, n);
      h = An(i, h), g = An(a, g), g = new R(v(g.x * mn.beta), g.y, g.z), s = h.add(g), o = l.add(u);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      s = i, o = c;
    }
    return R.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(R.ZERO);
    e == null && (e = o ? Eo : Ge(s));
    const i = e, c = v(i * i), a = v(c * i), d = v(n * c), h = v(r * a), l = v(s * i);
    if (o)
      return F.ZERO;
    if (l !== Q)
      throw new Error("invZ was invalid");
    return new F(d, h);
  }
}
R.BASE = new R(z.Gx, z.Gy, Q);
R.ZERO = new R(P, Q, P);
function An(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Gr = /* @__PURE__ */ new WeakMap();
class F {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Gr.delete(this);
  }
  hasEvenY() {
    return this.y % ie === P;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = gt(n ? e : e.subarray(1));
    if (!Un(r))
      throw new Error("Point is not on curve");
    const s = Io(r);
    let o = ad(s);
    const i = (o & Q) === Q;
    n ? i && (o = v(-o)) : (e[0] & 1) === 1 !== i && (o = v(-o));
    const c = new F(r, o);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = gt(e.subarray(1, St + 1)), r = gt(e.subarray(St + 1, St * 2 + 1)), s = new F(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ht(e), r = n.length, s = n[0];
    if (r === St)
      return this.fromCompressedHex(n);
    if (r === zn && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Gn && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${zn} compressed bytes or ${Gn} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return F.BASE.multiply(be(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = ki(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = xs(Ht(e)), { n: c } = z, a = r === 2 || r === 3 ? s + c : s, d = Ge(a, c), h = v(-i * d, c), l = v(o * d, c), g = r & 1 ? "03" : "02", u = F.fromHex(g + ce(a)), b = F.BASE.multiplyAndAddUnsafe(u, h, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return ae(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ce(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ce(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Un(n) || !Un(r))
      throw new Error(e);
    const s = v(r * r), o = Io(n);
    if (v(s - o) !== P)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new F(this.x, v(-this.y));
  }
  double() {
    return R.fromAffine(this).double().toAffine();
  }
  add(e) {
    return R.fromAffine(this).add(R.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return R.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = R.fromAffine(this), o = n === P || n === Q || this !== F.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = R.fromAffine(e).multiplyUnsafe(r), c = o.add(i);
    return c.equals(R.ZERO) ? void 0 : c.toAffine();
  }
}
F.BASE = new F(z.Gx, z.Gy);
F.ZERO = new F(P, P);
function Mo(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function _o(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Be(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gt(n), left: t.subarray(e + 2) };
}
function od(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Be(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = _o(t.subarray(2)), { data: r, left: s } = _o(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Be(s)}`);
  return { r: e, s: r };
}
class jt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Be(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new jt(Vn(s.slice(0, 64)), Vn(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = od(n ? e : ae(e));
    return new jt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ke(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ke(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = z.n >> Q;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new jt(this.r, v(-this.s, z.n)) : this;
  }
  toDERRawBytes() {
    return ae(this.toDERHex());
  }
  toDERHex() {
    const e = Mo(Qe(this.s)), n = Mo(Qe(this.r)), r = e.length / 2, s = n.length / 2, o = Qe(r), i = Qe(s);
    return `30${Qe(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ae(this.toCompactHex());
  }
  toCompactHex() {
    return ce(this.r) + ce(this.s);
  }
}
function re(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const id = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Be(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += id[t[n]];
  return e;
}
const cd = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ce(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(P <= t && t < cd))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ue(t) {
  const e = ae(ce(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Qe(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Vn(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function ae(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function gt(t) {
  return Vn(Be(t));
}
function Ht(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ae(t);
}
function Ho(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ke(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function v(t, e = z.P) {
  const n = t % e;
  return n >= P ? n : e + n;
}
function xt(t, e) {
  const { P: n } = z;
  let r = t;
  for (; e-- > P; )
    r *= r, r %= n;
  return r;
}
function ad(t) {
  const { P: e } = z, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), c = BigInt(88), a = t * t * t % e, d = a * a * t % e, h = xt(d, Je) * d % e, l = xt(h, Je) * d % e, g = xt(l, ie) * a % e, u = xt(g, r) * g % e, b = xt(u, s) * u % e, y = xt(b, i) * b % e, S = xt(y, c) * y % e, L = xt(S, i) * b % e, M = xt(L, Je) * d % e, x = xt(M, o) * u % e, I = xt(x, n) * a % e, A = xt(I, ie);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Ge(t, e = z.P) {
  if (t === P || e <= P)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = v(t, e), r = e, s = P, o = Q;
  for (; n !== P; ) {
    const c = r / n, a = r % n, d = s - o * c;
    r = n, n = a, s = o, o = d;
  }
  if (r !== Q)
    throw new Error("invert: does not exist");
  return v(s, e);
}
function ld(t, e = z.P) {
  const n = new Array(t.length), r = t.reduce((o, i, c) => i === P ? o : (n[c] = o, v(o * i, e)), Q), s = Ge(r, e);
  return t.reduceRight((o, i, c) => i === P ? o : (n[c] = v(o * n[c], e), v(o * i, e)), s), n;
}
function dd(t) {
  const e = t.length * 8 - pe * 8, n = gt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function xs(t, e = !1) {
  const n = dd(t);
  if (e)
    return n;
  const { n: r } = z;
  return n >= r ? n - r : n;
}
let De, tn;
class Bi {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return tt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return tn(this.k, ...e);
  }
  checkSync() {
    if (typeof tn != "function")
      throw new bs("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(e = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), e), this.v = await this.hmac(this.v), e.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), e), this.v = await this.hmac(this.v));
  }
  reseedSync(e = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), e), this.v = this.hmacSync(this.v), e.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), e), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let e = 0;
    const n = [];
    for (; e < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const r = this.v.slice();
      n.push(r), e += this.v.length;
    }
    return re(...n);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let e = 0;
    const n = [];
    for (; e < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const r = this.v.slice();
      n.push(r), e += this.v.length;
    }
    return re(...n);
  }
}
function ke(t) {
  return P < t && t < z.n;
}
function Un(t) {
  return P < t && t < z.P;
}
function Ui(t, e, n, r = !0) {
  const { n: s } = z, o = xs(t, !0);
  if (!ke(o))
    return;
  const i = Ge(o, s), c = F.BASE.multiply(o), a = v(c.x, s);
  if (a === P)
    return;
  const d = v(i * v(e + n * a, s), s);
  if (d === P)
    return;
  let h = new jt(a, d), l = (c.x === h.r ? 0 : 2) | Number(c.y & Q);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function be(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * pe)
      throw new Error("Expected 32 bytes of private key");
    e = Vn(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== pe)
      throw new Error("Expected 32 bytes of private key");
    e = gt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ke(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function ys(t) {
  return t instanceof F ? (t.assertValidity(), t) : F.fromHex(t);
}
function ki(t) {
  if (t instanceof jt)
    return t.assertValidity(), t;
  try {
    return jt.fromDER(t);
  } catch {
    return jt.fromCompact(t);
  }
}
function ws(t, e = !1) {
  return F.fromPrivateKey(t).toRawBytes(e);
}
function fd(t, e, n, r = !1) {
  return F.fromSignature(t, e, n).toRawBytes(r);
}
function $o(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === zn || r === Gn : n ? r === zn * 2 || r === Gn * 2 : t instanceof F;
}
function ms(t, e, n = !1) {
  if ($o(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!$o(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ys(e);
  return r.assertValidity(), r.multiply(be(t)).toRawBytes(n);
}
function Oi(t) {
  const e = t.length > St ? t.slice(0, St) : t;
  return gt(e);
}
function hd(t) {
  const e = Oi(t), n = v(e, z.n);
  return Pi(n < P ? e : n);
}
function Pi(t) {
  return Ue(t);
}
function Fi(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ht(t), s = be(e), o = [Pi(s), hd(r)];
  if (n != null) {
    n === !0 && (n = tt.randomBytes(St));
    const a = Ht(n);
    if (a.length !== St)
      throw new Error(`sign: Expected ${St} bytes of extra data`);
    o.push(a);
  }
  const i = re(...o), c = Oi(r);
  return { seed: i, m: c, d: s };
}
function Ri(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function ud(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Fi(t, e, n.extraEntropy), i = new Bi(Ti, pe);
  await i.reseed(r);
  let c;
  for (; !(c = Ui(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Ri(c, n);
}
function zi(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Fi(t, e, n.extraEntropy), i = new Bi(Ti, pe);
  i.reseedSync(r);
  let c;
  for (; !(c = Ui(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Ri(c, n);
}
const gd = { strict: !0 };
function pd(t, e, n, r = gd) {
  let s;
  try {
    s = ki(t), e = Ht(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = xs(e);
  let a;
  try {
    a = ys(n);
  } catch {
    return !1;
  }
  const { n: d } = z, h = Ge(i, d), l = v(c * h, d), g = v(o * h, d), u = F.BASE.multiplyAndAddUnsafe(a, l, g);
  return u ? v(u.x, d) === o : !1;
}
function Kn(t) {
  return v(gt(t), z.n);
}
class Oe {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ht(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gt(n.subarray(0, 32)), s = gt(n.subarray(32, 64));
    return new Oe(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Un(e) || !ke(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ce(this.r) + ce(this.s);
  }
  toRawBytes() {
    return ae(this.toHex());
  }
}
function bd(t) {
  return F.fromPrivateKey(t).toRawX();
}
class Gi {
  constructor(e, n, r = tt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ht(e);
    const { x: s, scalar: o } = this.getScalar(be(n));
    if (this.px = s, this.d = o, this.rand = Ht(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = F.fromPrivateKey(e), r = n.hasEvenY() ? e : z.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ue(e ^ gt(n));
  }
  finalizeNonce(e) {
    const n = v(gt(e), z.n);
    if (n === P)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new Oe(e.x, v(n + r * s, z.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = tt.taggedHash, i = this.initNonce(n, await o(ne.aux, s)), { R: c, rx: a, k: d } = this.finalizeNonce(await o(ne.nonce, i, r, e)), h = Kn(await o(ne.challenge, a, r, e)), l = this.finalizeSig(c, d, h, n);
    return await Wi(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = tt.taggedHashSync, i = this.initNonce(n, o(ne.aux, s)), { R: c, rx: a, k: d } = this.finalizeNonce(o(ne.nonce, i, r, e)), h = Kn(o(ne.challenge, a, r, e)), l = this.finalizeSig(c, d, h, n);
    return Yi(l, e, r) || this.error(), l;
  }
}
async function xd(t, e, n) {
  return new Gi(t, e, n).calc();
}
function yd(t, e, n) {
  return new Gi(t, e, n).calcSync();
}
function Vi(t, e, n) {
  const r = t instanceof Oe, s = r ? t : Oe.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ht(e),
    P: ys(n)
  };
}
function Ki(t, e, n, r) {
  const s = F.BASE.multiplyAndAddUnsafe(e, be(n), v(-r, z.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Wi(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Vi(t, e, n), c = Kn(await tt.taggedHash(ne.challenge, Ue(r), i.toRawX(), o));
    return Ki(r, i, s, c);
  } catch {
    return !1;
  }
}
function Yi(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Vi(t, e, n), c = Kn(tt.taggedHashSync(ne.challenge, Ue(r), i.toRawX(), o));
    return Ki(r, i, s, c);
  } catch (r) {
    if (r instanceof bs)
      throw r;
    return !1;
  }
}
const wd = {
  Signature: Oe,
  getPublicKey: bd,
  sign: xd,
  verify: Wi,
  signSync: yd,
  verifySync: Yi
};
F.BASE._setWindowSize(8);
const ft = {
  node: ji,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ne = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, En = {}, tt = {
  bytesToHex: Be,
  hexToBytes: ae,
  concatBytes: re,
  mod: v,
  invert: Ge,
  isValidPrivateKey(t) {
    try {
      return be(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ue,
  _normalizePrivateKey: be,
  hashToPrivateKey: (t) => {
    t = Ht(t);
    const e = pe + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = v(gt(t), z.n - Q) + Q;
    return Ue(n);
  },
  randomBytes: (t = 32) => {
    if (ft.web)
      return ft.web.getRandomValues(new Uint8Array(t));
    if (ft.node) {
      const { randomBytes: e } = ft.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => tt.hashToPrivateKey(tt.randomBytes(pe + 8)),
  precompute(t = 8, e = F.BASE) {
    const n = e === F.BASE ? e : new F(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Je), n;
  },
  sha256: async (...t) => {
    if (ft.web) {
      const e = await ft.web.subtle.digest("SHA-256", re(...t));
      return new Uint8Array(e);
    } else if (ft.node) {
      const { createHash: e } = ft.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ft.web) {
      const n = await ft.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = re(...e), s = await ft.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ft.node) {
      const { createHmac: n } = ft.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = En[t];
    if (n === void 0) {
      const r = await tt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = re(r, r), En[t] = n;
    }
    return tt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof De != "function")
      throw new bs("sha256Sync is undefined, you need to set it");
    let n = En[t];
    if (n === void 0) {
      const r = De(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = re(r, r), En[t] = n;
    }
    return De(n, ...e);
  },
  _JacobianPoint: R
};
Object.defineProperties(tt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return De;
    },
    set(t) {
      De || (De = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return tn;
    },
    set(t) {
      tn || (tn = t);
    }
  }
});
const md = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: z,
  Point: F,
  Signature: jt,
  getPublicKey: ws,
  getSharedSecret: ms,
  recoverPublicKey: fd,
  schnorr: wd,
  sign: ud,
  signSync: zi,
  utils: tt,
  verify: pd
}, Symbol.toStringTag, { value: "Module" }));
var wt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Zi(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
var cn = {};
cn.byteLength = Ld;
var Ad = cn.toByteArray = _d, Ed = cn.fromByteArray = Dd, Lt = [], yt = [], vd = typeof Uint8Array < "u" ? Uint8Array : Array, jr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Me = 0, Id = jr.length; Me < Id; ++Me)
  Lt[Me] = jr[Me], yt[jr.charCodeAt(Me)] = Me;
yt[45] = 62;
yt[95] = 63;
function Qi(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ld(t) {
  var e = Qi(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Md(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function _d(t) {
  var e, n = Qi(t), r = n[0], s = n[1], o = new vd(Md(t, r, s)), i = 0, c = s > 0 ? r - 4 : r, a;
  for (a = 0; a < c; a += 4)
    e = yt[t.charCodeAt(a)] << 18 | yt[t.charCodeAt(a + 1)] << 12 | yt[t.charCodeAt(a + 2)] << 6 | yt[t.charCodeAt(a + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = yt[t.charCodeAt(a)] << 2 | yt[t.charCodeAt(a + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = yt[t.charCodeAt(a)] << 10 | yt[t.charCodeAt(a + 1)] << 4 | yt[t.charCodeAt(a + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function Hd(t) {
  return Lt[t >> 18 & 63] + Lt[t >> 12 & 63] + Lt[t >> 6 & 63] + Lt[t & 63];
}
function $d(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(Hd(r));
  return s.join("");
}
function Dd(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, c = n - r; i < c; i += o)
    s.push($d(t, i, i + o > c ? c : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    Lt[e >> 2] + Lt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Lt[e >> 10] + Lt[e >> 4 & 63] + Lt[e << 2 & 63] + "="
  )), s.join("");
}
function Cd() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Nd = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function jd() {
  if (Cd())
    return {
      lib: crypto.subtle,
      name: "subtleCrypto"
    };
  try {
    return {
      lib: require("crypto"),
      name: "nodeCrypto"
    };
  } catch {
    throw new Error(Nd);
  }
}
class Td {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(je(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(je(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class Bd {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), a = await this.subtleCrypto.encrypt({ name: o, iv: r }, c, s);
    return new Uint8Array(a);
  }
  async decrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), a = await this.subtleCrypto.decrypt({ name: o, iv: r }, c, s);
    return new Uint8Array(a);
  }
}
async function qi() {
  const t = await jd();
  return t.name === "subtleCrypto" ? new Bd(t.lib) : new Td(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Ud(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var s = t.charAt(r), o = s.charCodeAt(0);
    if (e[o] !== 255)
      throw new TypeError(s + " is ambiguous");
    e[o] = r;
  }
  var i = t.length, c = t.charAt(0), a = Math.log(i) / Math.log(256), d = Math.log(256) / Math.log(i);
  function h(u) {
    if (u instanceof Uint8Array || (ArrayBuffer.isView(u) ? u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength) : Array.isArray(u) && (u = Uint8Array.from(u))), !(u instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (u.length === 0)
      return "";
    for (var b = 0, y = 0, S = 0, L = u.length; S !== L && u[S] === 0; )
      S++, b++;
    for (var M = (L - S) * d + 1 >>> 0, x = new Uint8Array(M); S !== L; ) {
      for (var I = u[S], A = 0, C = M - 1; (I !== 0 || A < y) && C !== -1; C--, A++)
        I += 256 * x[C] >>> 0, x[C] = I % i >>> 0, I = I / i >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      y = A, S++;
    }
    for (var O = M - y; O !== M && x[O] === 0; )
      O++;
    for (var H = c.repeat(b); O < M; ++O)
      H += t.charAt(x[O]);
    return H;
  }
  function l(u) {
    if (typeof u != "string")
      throw new TypeError("Expected String");
    if (u.length === 0)
      return new Uint8Array();
    for (var b = 0, y = 0, S = 0; u[b] === c; )
      y++, b++;
    for (var L = (u.length - b) * a + 1 >>> 0, M = new Uint8Array(L); u[b]; ) {
      var x = u.charCodeAt(b);
      if (x > 255)
        return;
      var I = e[x];
      if (I === 255)
        return;
      for (var A = 0, C = L - 1; (I !== 0 || A < S) && C !== -1; C--, A++)
        I += i * M[C] >>> 0, M[C] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      S = A, b++;
    }
    for (var O = L - S; O !== L && M[O] === 0; )
      O++;
    for (var H = new Uint8Array(y + (L - O)), D = y; O !== L; )
      H[D++] = M[O++];
    return H;
  }
  function g(u) {
    var b = l(u);
    if (b)
      return b;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: g
  };
}
var Xi = Ud;
const kd = Xi, Od = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Pd = kd(Od);
const Fd = /* @__PURE__ */ Sd(Pd), Rd = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ji = Uint8Array.from({ length: 16 }, (t, e) => e), zd = Ji.map((t) => (9 * t + 5) % 16);
let Ss = [Ji], As = [zd];
for (let t = 0; t < 4; t++)
  for (let e of [Ss, As])
    e.push(e[t].map((n) => Rd[n]));
const tc = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Gd = Ss.map((t, e) => t.map((n) => tc[e][n])), Vd = As.map((t, e) => t.map((n) => tc[e][n])), Kd = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Wd = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), vn = (t, e) => t << e | t >>> 32 - e;
function Do(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const In = new Uint32Array(16);
let Yd = class extends ps {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      In[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, d = this.h3 | 0, h = d, l = this.h4 | 0, g = l;
    for (let u = 0; u < 5; u++) {
      const b = 4 - u, y = Kd[u], S = Wd[u], L = Ss[u], M = As[u], x = Gd[u], I = Vd[u];
      for (let A = 0; A < 16; A++) {
        const C = vn(r + Do(u, o, c, d) + In[L[A]] + y, x[A]) + l | 0;
        r = l, l = d, d = vn(c, 10) | 0, c = o, o = C;
      }
      for (let A = 0; A < 16; A++) {
        const C = vn(s + Do(b, i, a, h) + In[M[A]] + S, I[A]) + g | 0;
        s = g, g = h, h = vn(a, 10) | 0, a = i, i = C;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + d + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    In.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Zd = me(() => new Yd());
function Qd(t) {
  return Zd(t);
}
const Ln = BigInt(2 ** 32 - 1), Vr = BigInt(32);
function ec(t, e = !1) {
  return e ? { h: Number(t & Ln), l: Number(t >> Vr & Ln) } : { h: Number(t >> Vr & Ln) | 0, l: Number(t & Ln) | 0 };
}
function qd(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = ec(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Xd = (t, e) => BigInt(t >>> 0) << Vr | BigInt(e >>> 0), Jd = (t, e, n) => t >>> n, tf = (t, e, n) => t << 32 - n | e >>> n, ef = (t, e, n) => t >>> n | e << 32 - n, nf = (t, e, n) => t << 32 - n | e >>> n, rf = (t, e, n) => t << 64 - n | e >>> n - 32, sf = (t, e, n) => t >>> n - 32 | e << 64 - n, of = (t, e) => e, cf = (t, e) => t, af = (t, e, n) => t << n | e >>> 32 - n, lf = (t, e, n) => e << n | t >>> 32 - n, df = (t, e, n) => e << n - 32 | t >>> 64 - n, ff = (t, e, n) => t << n - 32 | e >>> 64 - n;
function hf(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const uf = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), gf = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, pf = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), bf = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, xf = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), yf = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: ec,
  split: qd,
  toBig: Xd,
  shrSH: Jd,
  shrSL: tf,
  rotrSH: ef,
  rotrSL: nf,
  rotrBH: rf,
  rotrBL: sf,
  rotr32H: of,
  rotr32L: cf,
  rotlSH: af,
  rotlSL: lf,
  rotlBH: df,
  rotlBL: ff,
  add: hf,
  add3L: uf,
  add3H: gf,
  add4L: pf,
  add4H: bf,
  add5H: yf,
  add5L: xf
}, [wf, mf] = T.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((t) => BigInt(t))), zt = new Uint32Array(80), Gt = new Uint32Array(80);
let sr = class extends ps {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: d, El: h, Fh: l, Fl: g, Gh: u, Gl: b, Hh: y, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = u | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      zt[x] = e.getUint32(n), Gt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = zt[x - 15] | 0, A = Gt[x - 15] | 0, C = T.rotrSH(I, A, 1) ^ T.rotrSH(I, A, 8) ^ T.shrSH(I, A, 7), O = T.rotrSL(I, A, 1) ^ T.rotrSL(I, A, 8) ^ T.shrSL(I, A, 7), H = zt[x - 2] | 0, D = Gt[x - 2] | 0, G = T.rotrSH(H, D, 19) ^ T.rotrBH(H, D, 61) ^ T.shrSH(H, D, 6), q = T.rotrSL(H, D, 19) ^ T.rotrBL(H, D, 61) ^ T.shrSL(H, D, 6), Z = T.add4L(O, q, Gt[x - 7], Gt[x - 16]), X = T.add4H(Z, C, G, zt[x - 7], zt[x - 16]);
      zt[x] = X | 0, Gt[x] = Z | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: d, Dl: h, Eh: l, El: g, Fh: u, Fl: b, Gh: y, Gl: S, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = T.rotrSH(l, g, 14) ^ T.rotrSH(l, g, 18) ^ T.rotrBH(l, g, 41), A = T.rotrSL(l, g, 14) ^ T.rotrSL(l, g, 18) ^ T.rotrBL(l, g, 41), C = l & u ^ ~l & y, O = g & b ^ ~g & S, H = T.add5L(M, A, O, mf[x], Gt[x]), D = T.add5H(H, L, I, C, wf[x], zt[x]), G = H | 0, q = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), Z = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), X = r & o ^ r & c ^ o & c, bt = s & i ^ s & a ^ i & a;
      L = y | 0, M = S | 0, y = u | 0, S = b | 0, u = l | 0, b = g | 0, { h: l, l: g } = T.add(d | 0, h | 0, D | 0, G | 0), d = c | 0, h = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const et = T.add3L(G, Z, bt);
      r = T.add3H(et, D, q, X), s = et | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = T.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = T.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: d, l: h } = T.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: l, l: g } = T.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: u, l: b } = T.add(this.Fh | 0, this.Fl | 0, u | 0, b | 0), { h: y, l: S } = T.add(this.Gh | 0, this.Gl | 0, y | 0, S | 0), { h: L, l: M } = T.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, d, h, l, g, u, b, y, S, L, M);
  }
  roundClean() {
    zt.fill(0), Gt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Sf = class extends sr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Af = class extends sr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ef = class extends sr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const vf = me(() => new sr());
me(() => new Sf());
me(() => new Af());
me(() => new Ef());
function nc(t) {
  return Te(t);
}
function If(t) {
  return vf(t);
}
const Lf = 0;
tt.hmacSha256Sync = (t, ...e) => {
  const n = rr.create(Te, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Mf() {
  return se(tt.randomPrivateKey());
}
function _f(t) {
  const e = Te(Te(t));
  return Fd.encode(je(t, e).slice(0, t.length + 4));
}
function Hf(t, e) {
  return _f(je(new Uint8Array([t]), e.slice(0, 20)));
}
function rc(t, e = Lf) {
  const n = typeof t == "string" ? oe(t) : t, r = Qd(nc(n));
  return Hf(e, r);
}
function sc(t) {
  const e = Rl(t);
  return se(ws(e.slice(0, 32), !0));
}
tt.hmacSha256Sync = (t, ...e) => {
  const n = rr.create(Te, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Wn;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Wn || (Wn = {}));
async function $f(t, e, n) {
  return await (await qi()).encrypt("aes-256-cbc", e, t, n);
}
async function Df(t, e, n) {
  return await (await qi()).decrypt("aes-256-cbc", e, t, n);
}
function oc(t, e) {
  return rr(Te, t, e);
}
function Cf(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function ic(t) {
  const e = If(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Nf(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function jf(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Wn.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Wn.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Nf(t))
    return e;
  try {
    return F.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Tf(t, e, n, r) {
  const s = jf(t);
  if (!s.result)
    throw s;
  const o = tt.randomPrivateKey(), i = ws(o, !0);
  let c = ms(o, t, !0);
  c = c.slice(1);
  const a = ic(c), d = tt.randomBytes(16), h = await $f(d, a.encryptionKey, e), l = je(d, i, h), g = oc(a.hmacKey, l);
  let u;
  if (!r || r === "hex")
    u = se(h);
  else if (r === "base64")
    u = Ed(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: se(d),
    ephemeralPK: se(i),
    cipherText: u,
    mac: se(g),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function cc(t, e) {
  if (!e.ephemeralPK)
    throw new So("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = ms(t, n, !0);
  r = r.slice(1);
  const s = ic(r), o = oe(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = oe(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Ad(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = je(o, oe(n), i), a = oc(s.hmacKey, c), d = oe(e.mac);
  if (!Cf(d, a))
    throw new So("Decryption failed: failure in MAC check");
  const h = await Df(o, s.encryptionKey, i);
  return e.wasString ? Hi(h) : h;
}
function Bf(t, e) {
  const n = typeof e == "string" ? _i(e) : e, r = sc(t), s = nc(n), o = zi(s, t);
  return {
    signature: se(o),
    publicKey: r
  };
}
async function Uf(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = sc(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? _i(t) : t, i = await Tf(n.publicKey, o, s, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const a = Bf(r, c), d = {
      signature: a.signature,
      publicKey: a.publicKey,
      cipherText: c
    };
    c = JSON.stringify(d);
  }
  return c;
}
function kf(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return cc(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var pt = {}, Pe = {}, ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.decode = ct.encode = ct.unescape = ct.escape = ct.pad = void 0;
const ac = cn;
function Es(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ct.pad = Es;
function lc(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ct.escape = lc;
function dc(t) {
  return Es(t).replace(/-/g, "+").replace(/_/g, "/");
}
ct.unescape = dc;
function Of(t) {
  return lc((0, ac.fromByteArray)(new TextEncoder().encode(t)));
}
ct.encode = Of;
function Pf(t) {
  return new TextDecoder().decode((0, ac.toByteArray)(Es(dc(t))));
}
ct.decode = Pf;
var or = {}, ir = {}, fc = {}, kt = {}, cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.crypto = void 0;
cr.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = o, t.aexists = i, t.aoutput = c, t.u8 = a, t.u32 = d, t.clean = h, t.createView = l, t.rotr = g, t.rotl = u, t.byteSwap = b, t.byteSwap32 = y, t.bytesToHex = M, t.hexToBytes = A, t.asyncLoop = O, t.utf8ToBytes = H, t.bytesToUtf8 = D, t.toBytes = G, t.kdfInputToBytes = q, t.concatBytes = Z, t.checkOpts = X, t.createHasher = et, t.createOptHasher = dn, t.createXOFer = fn, t.randomBytes = pr;
  const e = cr;
  function n(w) {
    return w instanceof Uint8Array || ArrayBuffer.isView(w) && w.constructor.name === "Uint8Array";
  }
  function r(w) {
    if (!Number.isSafeInteger(w) || w < 0)
      throw new Error("positive integer expected, got " + w);
  }
  function s(w, ...E) {
    if (!n(w))
      throw new Error("Uint8Array expected");
    if (E.length > 0 && !E.includes(w.length))
      throw new Error("Uint8Array expected of length " + E + ", got length=" + w.length);
  }
  function o(w) {
    if (typeof w != "function" || typeof w.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(w.outputLen), r(w.blockLen);
  }
  function i(w, E = !0) {
    if (w.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (E && w.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(w, E) {
    s(w);
    const K = E.outputLen;
    if (w.length < K)
      throw new Error("digestInto() expects output buffer of length at least " + K);
  }
  function a(w) {
    return new Uint8Array(w.buffer, w.byteOffset, w.byteLength);
  }
  function d(w) {
    return new Uint32Array(w.buffer, w.byteOffset, Math.floor(w.byteLength / 4));
  }
  function h(...w) {
    for (let E = 0; E < w.length; E++)
      w[E].fill(0);
  }
  function l(w) {
    return new DataView(w.buffer, w.byteOffset, w.byteLength);
  }
  function g(w, E) {
    return w << 32 - E | w >>> E;
  }
  function u(w, E) {
    return w << E | w >>> 32 - E >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(w) {
    return w << 24 & 4278190080 | w << 8 & 16711680 | w >>> 8 & 65280 | w >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (w) => w : (w) => b(w), t.byteSwapIfBE = t.swap8IfBE;
  function y(w) {
    for (let E = 0; E < w.length; E++)
      w[E] = b(w[E]);
    return w;
  }
  t.swap32IfBE = t.isLE ? (w) => w : y;
  const S = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", L = /* @__PURE__ */ Array.from({ length: 256 }, (w, E) => E.toString(16).padStart(2, "0"));
  function M(w) {
    if (s(w), S)
      return w.toHex();
    let E = "";
    for (let K = 0; K < w.length; K++)
      E += L[w[K]];
    return E;
  }
  const x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(w) {
    if (w >= x._0 && w <= x._9)
      return w - x._0;
    if (w >= x.A && w <= x.F)
      return w - (x.A - 10);
    if (w >= x.a && w <= x.f)
      return w - (x.a - 10);
  }
  function A(w) {
    if (typeof w != "string")
      throw new Error("hex string expected, got " + typeof w);
    if (S)
      return Uint8Array.fromHex(w);
    const E = w.length, K = E / 2;
    if (E % 2)
      throw new Error("hex string expected, got unpadded hex of length " + E);
    const Y = new Uint8Array(K);
    for (let V = 0, rt = 0; V < K; V++, rt += 2) {
      const We = I(w.charCodeAt(rt)), hn = I(w.charCodeAt(rt + 1));
      if (We === void 0 || hn === void 0) {
        const br = w[rt] + w[rt + 1];
        throw new Error('hex string expected, got non-hex character "' + br + '" at index ' + rt);
      }
      Y[V] = We * 16 + hn;
    }
    return Y;
  }
  const C = async () => {
  };
  t.nextTick = C;
  async function O(w, E, K) {
    let Y = Date.now();
    for (let V = 0; V < w; V++) {
      K(V);
      const rt = Date.now() - Y;
      rt >= 0 && rt < E || (await (0, t.nextTick)(), Y += rt);
    }
  }
  function H(w) {
    if (typeof w != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(w));
  }
  function D(w) {
    return new TextDecoder().decode(w);
  }
  function G(w) {
    return typeof w == "string" && (w = H(w)), s(w), w;
  }
  function q(w) {
    return typeof w == "string" && (w = H(w)), s(w), w;
  }
  function Z(...w) {
    let E = 0;
    for (let Y = 0; Y < w.length; Y++) {
      const V = w[Y];
      s(V), E += V.length;
    }
    const K = new Uint8Array(E);
    for (let Y = 0, V = 0; Y < w.length; Y++) {
      const rt = w[Y];
      K.set(rt, V), V += rt.length;
    }
    return K;
  }
  function X(w, E) {
    if (E !== void 0 && {}.toString.call(E) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(w, E);
  }
  class bt {
  }
  t.Hash = bt;
  function et(w) {
    const E = (Y) => w().update(G(Y)).digest(), K = w();
    return E.outputLen = K.outputLen, E.blockLen = K.blockLen, E.create = () => w(), E;
  }
  function dn(w) {
    const E = (Y, V) => w(V).update(G(Y)).digest(), K = w({});
    return E.outputLen = K.outputLen, E.blockLen = K.blockLen, E.create = (Y) => w(Y), E;
  }
  function fn(w) {
    const E = (Y, V) => w(V).update(G(Y)).digest(), K = w({});
    return E.outputLen = K.outputLen, E.blockLen = K.blockLen, E.create = (Y) => w(Y), E;
  }
  t.wrapConstructor = et, t.wrapConstructorWithOpts = dn, t.wrapXOFConstructorWithOpts = fn;
  function pr(w = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(w));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(w));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(kt);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = kt;
  class n extends e.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(o);
      const c = (0, e.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const a = this.blockLen, d = new Uint8Array(a);
      d.set(c.length > a ? o.create().update(c).digest() : c);
      for (let h = 0; h < d.length; h++)
        d[h] ^= 54;
      this.iHash.update(d), this.oHash = o.create();
      for (let h = 0; h < d.length; h++)
        d[h] ^= 106;
      this.oHash.update(d), (0, e.clean)(d);
    }
    update(o) {
      return (0, e.aexists)(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      (0, e.aexists)(this), (0, e.abytes)(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: c, finished: a, destroyed: d, blockLen: h, outputLen: l } = this;
      return o = o, o.finished = a, o.destroyed = d, o.blockLen = h, o.outputLen = l, o.oHash = i._cloneInto(o.oHash), o.iHash = c._cloneInto(o.iHash), o;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (s, o, i) => new n(s, o).update(i).digest();
  t.hmac = r, t.hmac.create = (s, o) => new n(s, o);
})(fc);
var ut = {}, W = {}, at = {};
Object.defineProperty(at, "__esModule", { value: !0 });
at.SHA512_IV = at.SHA384_IV = at.SHA224_IV = at.SHA256_IV = at.HashMD = void 0;
at.setBigUint64 = hc;
at.Chi = Ff;
at.Maj = Rf;
const Et = kt;
function hc(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + d, c, r);
}
function Ff(t, e, n) {
  return t & e ^ ~t & n;
}
function Rf(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class zf extends Et.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, Et.createView)(this.buffer);
  }
  update(e) {
    (0, Et.aexists)(this), e = (0, Et.toBytes)(e), (0, Et.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = (0, Et.createView)(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, Et.aexists)(this), (0, Et.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, (0, Et.clean)(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    hc(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = (0, Et.createView)(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = a / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < d; l++)
      c.setUint32(4 * l, h[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.destroyed = i, e.finished = o, e.length = s, e.pos = c, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
at.HashMD = zf;
at.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
at.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
at.SHA384_IV = Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
at.SHA512_IV = Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);
var N = {};
Object.defineProperty(N, "__esModule", { value: !0 });
N.toBig = N.shrSL = N.shrSH = N.rotrSL = N.rotrSH = N.rotrBL = N.rotrBH = N.rotr32L = N.rotr32H = N.rotlSL = N.rotlSH = N.rotlBL = N.rotlBH = N.add5L = N.add5H = N.add4L = N.add4H = N.add3L = N.add3H = void 0;
N.add = Mc;
N.fromBig = vs;
N.split = uc;
const Mn = /* @__PURE__ */ BigInt(2 ** 32 - 1), Kr = /* @__PURE__ */ BigInt(32);
function vs(t, e = !1) {
  return e ? { h: Number(t & Mn), l: Number(t >> Kr & Mn) } : { h: Number(t >> Kr & Mn) | 0, l: Number(t & Mn) | 0 };
}
function uc(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let o = 0; o < n; o++) {
    const { h: i, l: c } = vs(t[o], e);
    [r[o], s[o]] = [i, c];
  }
  return [r, s];
}
const gc = (t, e) => BigInt(t >>> 0) << Kr | BigInt(e >>> 0);
N.toBig = gc;
const pc = (t, e, n) => t >>> n;
N.shrSH = pc;
const bc = (t, e, n) => t << 32 - n | e >>> n;
N.shrSL = bc;
const xc = (t, e, n) => t >>> n | e << 32 - n;
N.rotrSH = xc;
const yc = (t, e, n) => t << 32 - n | e >>> n;
N.rotrSL = yc;
const wc = (t, e, n) => t << 64 - n | e >>> n - 32;
N.rotrBH = wc;
const mc = (t, e, n) => t >>> n - 32 | e << 64 - n;
N.rotrBL = mc;
const Sc = (t, e) => e;
N.rotr32H = Sc;
const Ac = (t, e) => t;
N.rotr32L = Ac;
const Ec = (t, e, n) => t << n | e >>> 32 - n;
N.rotlSH = Ec;
const vc = (t, e, n) => e << n | t >>> 32 - n;
N.rotlSL = vc;
const Ic = (t, e, n) => e << n - 32 | t >>> 64 - n;
N.rotlBH = Ic;
const Lc = (t, e, n) => t << n - 32 | e >>> 64 - n;
N.rotlBL = Lc;
function Mc(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _c = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
N.add3L = _c;
const Hc = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
N.add3H = Hc;
const $c = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
N.add4L = $c;
const Dc = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
N.add4H = Dc;
const Cc = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
N.add5L = Cc;
const Nc = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0;
N.add5H = Nc;
const Gf = {
  fromBig: vs,
  split: uc,
  toBig: gc,
  shrSH: pc,
  shrSL: bc,
  rotrSH: xc,
  rotrSL: yc,
  rotrBH: wc,
  rotrBL: mc,
  rotr32H: Sc,
  rotr32L: Ac,
  rotlSH: Ec,
  rotlSL: vc,
  rotlBH: Ic,
  rotlBL: Lc,
  add: Mc,
  add3L: _c,
  add3H: Hc,
  add4L: $c,
  add4H: Dc,
  add5H: Nc,
  add5L: Cc
};
N.default = Gf;
Object.defineProperty(W, "__esModule", { value: !0 });
W.sha512_224 = W.sha512_256 = W.sha384 = W.sha512 = W.sha224 = W.sha256 = W.SHA512_256 = W.SHA512_224 = W.SHA384 = W.SHA512 = W.SHA224 = W.SHA256 = void 0;
const $ = at, B = N, J = kt, Vf = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Vt = /* @__PURE__ */ new Uint32Array(64);
let Is = class extends $.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = $.SHA256_IV[0] | 0, this.B = $.SHA256_IV[1] | 0, this.C = $.SHA256_IV[2] | 0, this.D = $.SHA256_IV[3] | 0, this.E = $.SHA256_IV[4] | 0, this.F = $.SHA256_IV[5] | 0, this.G = $.SHA256_IV[6] | 0, this.H = $.SHA256_IV[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: a } = this;
    return [e, n, r, s, o, i, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Vt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Vt[l - 15], u = Vt[l - 2], b = (0, J.rotr)(g, 7) ^ (0, J.rotr)(g, 18) ^ g >>> 3, y = (0, J.rotr)(u, 17) ^ (0, J.rotr)(u, 19) ^ u >>> 10;
      Vt[l] = y + Vt[l - 7] + b + Vt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: d, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, J.rotr)(c, 6) ^ (0, J.rotr)(c, 11) ^ (0, J.rotr)(c, 25), u = h + g + (0, $.Chi)(c, a, d) + Vf[l] + Vt[l] | 0, y = ((0, J.rotr)(r, 2) ^ (0, J.rotr)(r, 13) ^ (0, J.rotr)(r, 22)) + (0, $.Maj)(r, s, o) | 0;
      h = d, d = a, a = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, a, d, h);
  }
  roundClean() {
    (0, J.clean)(Vt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, J.clean)(this.buffer);
  }
};
W.SHA256 = Is;
let jc = class extends Is {
  constructor() {
    super(28), this.A = $.SHA224_IV[0] | 0, this.B = $.SHA224_IV[1] | 0, this.C = $.SHA224_IV[2] | 0, this.D = $.SHA224_IV[3] | 0, this.E = $.SHA224_IV[4] | 0, this.F = $.SHA224_IV[5] | 0, this.G = $.SHA224_IV[6] | 0, this.H = $.SHA224_IV[7] | 0;
  }
};
W.SHA224 = jc;
const Tc = B.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((t) => BigInt(t))), Kf = Tc[0], Wf = Tc[1], Kt = /* @__PURE__ */ new Uint32Array(80), Wt = /* @__PURE__ */ new Uint32Array(80);
let an = class extends $.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = $.SHA512_IV[0] | 0, this.Al = $.SHA512_IV[1] | 0, this.Bh = $.SHA512_IV[2] | 0, this.Bl = $.SHA512_IV[3] | 0, this.Ch = $.SHA512_IV[4] | 0, this.Cl = $.SHA512_IV[5] | 0, this.Dh = $.SHA512_IV[6] | 0, this.Dl = $.SHA512_IV[7] | 0, this.Eh = $.SHA512_IV[8] | 0, this.El = $.SHA512_IV[9] | 0, this.Fh = $.SHA512_IV[10] | 0, this.Fl = $.SHA512_IV[11] | 0, this.Gh = $.SHA512_IV[12] | 0, this.Gl = $.SHA512_IV[13] | 0, this.Hh = $.SHA512_IV[14] | 0, this.Hl = $.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: d, El: h, Fh: l, Fl: g, Gh: u, Gl: b, Hh: y, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = u | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Kt[x] = e.getUint32(n), Wt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Kt[x - 15] | 0, A = Wt[x - 15] | 0, C = B.rotrSH(I, A, 1) ^ B.rotrSH(I, A, 8) ^ B.shrSH(I, A, 7), O = B.rotrSL(I, A, 1) ^ B.rotrSL(I, A, 8) ^ B.shrSL(I, A, 7), H = Kt[x - 2] | 0, D = Wt[x - 2] | 0, G = B.rotrSH(H, D, 19) ^ B.rotrBH(H, D, 61) ^ B.shrSH(H, D, 6), q = B.rotrSL(H, D, 19) ^ B.rotrBL(H, D, 61) ^ B.shrSL(H, D, 6), Z = B.add4L(O, q, Wt[x - 7], Wt[x - 16]), X = B.add4H(Z, C, G, Kt[x - 7], Kt[x - 16]);
      Kt[x] = X | 0, Wt[x] = Z | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: d, Dl: h, Eh: l, El: g, Fh: u, Fl: b, Gh: y, Gl: S, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = B.rotrSH(l, g, 14) ^ B.rotrSH(l, g, 18) ^ B.rotrBH(l, g, 41), A = B.rotrSL(l, g, 14) ^ B.rotrSL(l, g, 18) ^ B.rotrBL(l, g, 41), C = l & u ^ ~l & y, O = g & b ^ ~g & S, H = B.add5L(M, A, O, Wf[x], Wt[x]), D = B.add5H(H, L, I, C, Kf[x], Kt[x]), G = H | 0, q = B.rotrSH(r, s, 28) ^ B.rotrBH(r, s, 34) ^ B.rotrBH(r, s, 39), Z = B.rotrSL(r, s, 28) ^ B.rotrBL(r, s, 34) ^ B.rotrBL(r, s, 39), X = r & o ^ r & c ^ o & c, bt = s & i ^ s & a ^ i & a;
      L = y | 0, M = S | 0, y = u | 0, S = b | 0, u = l | 0, b = g | 0, { h: l, l: g } = B.add(d | 0, h | 0, D | 0, G | 0), d = c | 0, h = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const et = B.add3L(G, Z, bt);
      r = B.add3H(et, D, q, X), s = et | 0;
    }
    ({ h: r, l: s } = B.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = B.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = B.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: d, l: h } = B.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: l, l: g } = B.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: u, l: b } = B.add(this.Fh | 0, this.Fl | 0, u | 0, b | 0), { h: y, l: S } = B.add(this.Gh | 0, this.Gl | 0, y | 0, S | 0), { h: L, l: M } = B.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, d, h, l, g, u, b, y, S, L, M);
  }
  roundClean() {
    (0, J.clean)(Kt, Wt);
  }
  destroy() {
    (0, J.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
W.SHA512 = an;
let Bc = class extends an {
  constructor() {
    super(48), this.Ah = $.SHA384_IV[0] | 0, this.Al = $.SHA384_IV[1] | 0, this.Bh = $.SHA384_IV[2] | 0, this.Bl = $.SHA384_IV[3] | 0, this.Ch = $.SHA384_IV[4] | 0, this.Cl = $.SHA384_IV[5] | 0, this.Dh = $.SHA384_IV[6] | 0, this.Dl = $.SHA384_IV[7] | 0, this.Eh = $.SHA384_IV[8] | 0, this.El = $.SHA384_IV[9] | 0, this.Fh = $.SHA384_IV[10] | 0, this.Fl = $.SHA384_IV[11] | 0, this.Gh = $.SHA384_IV[12] | 0, this.Gl = $.SHA384_IV[13] | 0, this.Hh = $.SHA384_IV[14] | 0, this.Hl = $.SHA384_IV[15] | 0;
  }
};
W.SHA384 = Bc;
const st = /* @__PURE__ */ Uint32Array.from([
  2352822216,
  424955298,
  1944164710,
  2312950998,
  502970286,
  855612546,
  1738396948,
  1479516111,
  258812777,
  2077511080,
  2011393907,
  79989058,
  1067287976,
  1780299464,
  286451373,
  2446758561
]), ot = /* @__PURE__ */ Uint32Array.from([
  573645204,
  4230739756,
  2673172387,
  3360449730,
  596883563,
  1867755857,
  2520282905,
  1497426621,
  2519219938,
  2827943907,
  3193839141,
  1401305490,
  721525244,
  746961066,
  246885852,
  2177182882
]);
let Uc = class extends an {
  constructor() {
    super(28), this.Ah = st[0] | 0, this.Al = st[1] | 0, this.Bh = st[2] | 0, this.Bl = st[3] | 0, this.Ch = st[4] | 0, this.Cl = st[5] | 0, this.Dh = st[6] | 0, this.Dl = st[7] | 0, this.Eh = st[8] | 0, this.El = st[9] | 0, this.Fh = st[10] | 0, this.Fl = st[11] | 0, this.Gh = st[12] | 0, this.Gl = st[13] | 0, this.Hh = st[14] | 0, this.Hl = st[15] | 0;
  }
};
W.SHA512_224 = Uc;
let kc = class extends an {
  constructor() {
    super(32), this.Ah = ot[0] | 0, this.Al = ot[1] | 0, this.Bh = ot[2] | 0, this.Bl = ot[3] | 0, this.Ch = ot[4] | 0, this.Cl = ot[5] | 0, this.Dh = ot[6] | 0, this.Dl = ot[7] | 0, this.Eh = ot[8] | 0, this.El = ot[9] | 0, this.Fh = ot[10] | 0, this.Fl = ot[11] | 0, this.Gh = ot[12] | 0, this.Gl = ot[13] | 0, this.Hh = ot[14] | 0, this.Hl = ot[15] | 0;
  }
};
W.SHA512_256 = kc;
W.sha256 = (0, J.createHasher)(() => new Is());
W.sha224 = (0, J.createHasher)(() => new jc());
W.sha512 = (0, J.createHasher)(() => new an());
W.sha384 = (0, J.createHasher)(() => new Bc());
W.sha512_256 = (0, J.createHasher)(() => new kc());
W.sha512_224 = (0, J.createHasher)(() => new Uc());
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.sha224 = ut.SHA224 = ut.sha256 = ut.SHA256 = void 0;
const ar = W;
ut.SHA256 = ar.SHA256;
ut.sha256 = ar.sha256;
ut.SHA224 = ar.SHA224;
ut.sha224 = ar.sha224;
const Yf = /* @__PURE__ */ Zi(md);
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.joseToDer = Fe.derToJose = void 0;
const Oc = cn, Pc = ct;
function Tr(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Zf = {
  ES256: Tr(256),
  ES384: Tr(384),
  ES512: Tr(521)
};
function Fc(t) {
  const e = Zf[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Yn = 128, Rc = 0, Qf = 32, qf = 16, Xf = 2, zc = qf | Qf | Rc << 6, Zn = Xf | Rc << 6;
function Gc(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Oc.toByteArray)((0, Pc.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Jf(t, e) {
  const n = Gc(t), r = Fc(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== zc)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (Yn | 1) && (c = n[i++]), o - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${o - i}" remaining`);
  if (n[i++] !== Zn)
    throw new Error('Could not find expected "int" for "r"');
  const a = n[i++];
  if (o - i - 2 < a)
    throw new Error(`"r" specified length of "${a}", only "${o - i - 2}" available`);
  if (s < a)
    throw new Error(`"r" specified length of "${a}", max of "${s}" is acceptable`);
  const d = i;
  if (i += a, n[i++] !== Zn)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const g = r - a, u = r - h, b = new Uint8Array(g + a + u + h);
  for (i = 0; i < g; ++i)
    b[i] = 0;
  b.set(n.subarray(d + Math.max(-g, 0), d + a), i), i = r;
  for (const y = i; i < y + u; ++i)
    b[i] = 0;
  return b.set(n.subarray(l + Math.max(-u, 0), l + h), i), (0, Pc.escape)((0, Oc.fromByteArray)(b));
}
Fe.derToJose = Jf;
function Co(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Yn && --r, r;
}
function th(t, e) {
  t = Gc(t);
  const n = Fc(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Co(t, 0, n), o = Co(t, n, t.length), i = n - s, c = n - o, a = 2 + i + 1 + 1 + c, d = a < Yn, h = new Uint8Array((d ? 2 : 3) + a);
  let l = 0;
  return h[l++] = zc, d ? h[l++] = a : (h[l++] = Yn | 1, h[l++] = a & 255), h[l++] = Zn, h[l++] = i, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = Zn, h[l++] = c, o < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + o), l), h;
}
Fe.joseToDer = th;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.InvalidTokenError = Tt.MissingParametersError = void 0;
class eh extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Tt.MissingParametersError = eh;
class nh extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Tt.InvalidTokenError = nh;
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.SECP256K1Client = void 0;
const rh = fc, sh = ut, kn = Yf, No = Fe, jo = Tt, To = kt;
kn.utils.hmacSha256Sync = (t, ...e) => {
  const n = rh.hmac.create(sh.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Vc {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, To.bytesToHex)(kn.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new jo.MissingParametersError("a signing input hash and private key are all required");
    const s = kn.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, To.bytesToHex)(s);
    if (r === "jose")
      return (0, No.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, No.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new jo.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return kn.verify(n, e, r, { strict: !1 });
  }
}
ir.SECP256K1Client = Vc;
Vc.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ir;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(or);
var xe = {};
const oh = /* @__PURE__ */ Zi(ji);
var ih = wt && wt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(h) {
      try {
        d(r.next(h));
      } catch (l) {
        i(l);
      }
    }
    function a(h) {
      try {
        d(r.throw(h));
      } catch (l) {
        i(l);
      }
    }
    function d(h) {
      h.done ? o(h.value) : s(h.value).then(c, a);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.hashSha256Async = xe.hashSha256 = void 0;
const ch = ut;
function Kc(t) {
  return (0, ch.sha256)(t);
}
xe.hashSha256 = Kc;
function ah(t) {
  return ih(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = oh;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Kc(t));
    }
  });
}
xe.hashSha256Async = ah;
var lh = wt && wt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(h) {
      try {
        d(r.next(h));
      } catch (l) {
        i(l);
      }
    }
    function a(h) {
      try {
        d(r.throw(h));
      } catch (l) {
        i(l);
      }
    }
    function d(h) {
      h.done ? o(h.value) : s(h.value).then(c, a);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.TokenSigner = Pe.createUnsecuredToken = void 0;
const Wr = ct, Bo = or, dh = Tt, Uo = xe;
function Yr(t, e) {
  const n = [], r = Wr.encode(JSON.stringify(e));
  n.push(r);
  const s = Wr.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function fh(t) {
  return Yr(t, { typ: "JWT", alg: "none" }) + ".";
}
Pe.createUnsecuredToken = fh;
class hh {
  constructor(e, n) {
    if (!(e && n))
      throw new dh.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Bo.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Bo.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Yr(e, s), i = (0, Uo.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return lh(this, void 0, void 0, function* () {
      const s = this.header(r), o = Yr(e, s), i = yield (0, Uo.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Wr.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
Pe.TokenSigner = hh;
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.TokenVerifier = void 0;
const uh = ct, ko = or, gh = Tt, _n = xe;
class ph {
  constructor(e, n) {
    if (!(e && n))
      throw new gh.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !ko.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = ko.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], o = (i) => {
      const c = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, c, this.rawPublicKey);
    };
    if (n)
      return (0, _n.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, _n.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), uh.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((c) => {
      const a = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, a, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, _n.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, _n.hashSha256)(r);
      return o(i);
    }
  }
}
lr.TokenVerifier = ph;
var dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.decodeToken = void 0;
const Hn = ct;
function bh(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Hn.decode(e[0])), r = JSON.parse(Hn.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Hn.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Hn.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
dr.decodeToken = bh;
(function(t) {
  var e = wt && wt.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var c = Object.getOwnPropertyDescriptor(s, o);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, c);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = wt && wt.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Pe, t), n(lr, t), n(dr, t), n(Tt, t), n(or, t);
})(pt);
function xh(t) {
  return `did:btc-addr:${t}`;
}
function yh(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new mo("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new mo('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Wc(t) {
  if (t)
    return yh(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const wh = "1.4.0";
function mh() {
  return Mf();
}
function Sh(t, e, n, r = Li.slice(), s, o = Dl().getTime(), i = {}) {
  const c = (u) => {
    const b = hs("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${u}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const a = Object.assign({}, i, {
    jti: Nl(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: wh,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = pt.SECP256K1Client.derivePublicKey(t);
  a.public_keys = [d];
  const h = rc(d);
  return a.iss = xh(h), new pt.TokenSigner("ES256k", t).sign(a);
}
async function Oo(t, e) {
  const n = Hi(oe(e)), r = JSON.parse(n), s = await cc(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Ah(t) {
  const e = pt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new pt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Eh(t) {
  const e = pt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Wc(e.iss);
  if (n.length === 1) {
    if (rc(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function vh(t) {
  const e = pt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  if (e.iat) {
    if (typeof e.iat != "number")
      return !1;
    const n = new Date(e.iat * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() < n.getTime());
  } else
    return !0;
}
function Ih(t) {
  const e = pt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  if (e.exp) {
    if (typeof e.exp != "number")
      return !1;
    const n = new Date(e.exp * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() > n.getTime());
  } else
    return !0;
}
function Lh(t) {
  const e = [
    Ih(t),
    vh(t),
    Ah(t),
    Eh(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Po = "1.0.0";
class le {
  constructor(e) {
    this.version = Po, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Po)
      throw new Fr(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new le(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Yc {
  constructor(e) {
    if (e) {
      const n = new le(e);
      this.setSessionData(n);
    }
  }
  getSessionData() {
    throw new Error("Abstract class");
  }
  setSessionData(e) {
    throw new Error("Abstract class");
  }
  deleteSessionData() {
    throw new Error("Abstract class");
  }
}
class Fo extends Yc {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new le({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Mi("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new le({})), !0;
  }
}
class Ro extends Yc {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = _l, !localStorage.getItem(this.key)) {
      const r = new le({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mi("No session data was found in localStorage");
    const n = JSON.parse(e);
    return le.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new le({})), !0;
  }
}
var rn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(rn || (rn = {}));
var Qn;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Qn || (Qn = {}));
rn.Mainnet;
var Nt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Nt || (Nt = {}));
var Mt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mt || (Mt = {}));
Nt.Mainnet;
const Zc = {
  chainId: rn.Mainnet,
  transactionVersion: Nt.Mainnet,
  peerNetworkId: Qn.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Mt.MainnetSingleSig,
    multiSig: Mt.MainnetMultiSig
  },
  client: { baseUrl: kl }
}, Zr = {
  chainId: rn.Testnet,
  transactionVersion: Nt.Testnet,
  peerNetworkId: Qn.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Mt.TestnetSingleSig,
    multiSig: Mt.TestnetMultiSig
  },
  client: { baseUrl: Ol }
}, On = {
  ...Zr,
  addressVersion: { ...Zr.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Pl }
}, Mh = {
  ...On,
  addressVersion: { ...On.addressVersion },
  client: { ...On.client }
};
function _h(t) {
  switch (t) {
    case "mainnet":
      return Zc;
    case "testnet":
      return Zr;
    case "devnet":
      return On;
    case "mocknet":
      return Mh;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Qc(t) {
  return typeof t == "string" ? _h(t) : t;
}
var zo;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zo || (zo = {}));
var Go;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Go || (Go = {}));
var mt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(mt || (mt = {}));
const Br = ["onChainOnly", "offChainOnly", "any"];
Br[0] + "", mt.OnChainOnly, Br[1] + "", mt.OffChainOnly, Br[2] + "", mt.Any, mt.OnChainOnly + "", mt.OnChainOnly, mt.OffChainOnly + "", mt.OffChainOnly, mt.Any + "", mt.Any;
var Vo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Vo || (Vo = {}));
var Ko;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ko || (Ko = {}));
var Wo;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Wo || (Wo = {}));
var Ct;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ct || (Ct = {}));
var Yo;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Yo || (Yo = {}));
var Zo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Zo || (Zo = {}));
var Qo;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Qo || (Qo = {}));
var qo;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(qo || (qo = {}));
var Xo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xo || (Xo = {}));
var Jo;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jo || (Jo = {}));
var ti;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ti || (ti = {}));
var ei;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ei || (ei = {}));
var ni;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ni || (ni = {}));
function Qr(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Hh(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function qc(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function $h(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Qr(t.outputLen), Qr(t.blockLen);
}
function Dh(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ch(t, e) {
  qc(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ge = {
  number: Qr,
  bool: Hh,
  bytes: qc,
  hash: $h,
  exists: Dh,
  output: Ch
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ur = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), vt = (t, e) => t << 32 - e | t >>> e, Nh = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Nh)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jh(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ls(t) {
  if (typeof t == "string" && (t = jh(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Xc = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Se(t) {
  const e = (r) => t().update(Ls(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class Jc extends Xc {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ge.hash(e);
    const r = Ls(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return ge.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ge.exists(this), ge.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const ta = (t, e, n) => new Jc(t, e).update(n).digest();
ta.create = (t, e) => new Jc(t, e);
function Th(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + d, c, r);
}
let Ms = class extends Xc {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ur(this.buffer);
  }
  update(e) {
    ge.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ls(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Ur(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ge.exists(this), ge.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Th(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Ur(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = a / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < d; l++)
      c.setUint32(4 * l, h[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const Bh = (t, e, n) => t & e ^ ~t & n, Uh = (t, e, n) => t & e ^ t & n ^ e & n, kh = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Yt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Zt = new Uint32Array(64);
let ea = class extends Ms {
  constructor() {
    super(64, 32, 8, !1), this.A = Yt[0] | 0, this.B = Yt[1] | 0, this.C = Yt[2] | 0, this.D = Yt[3] | 0, this.E = Yt[4] | 0, this.F = Yt[5] | 0, this.G = Yt[6] | 0, this.H = Yt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: a } = this;
    return [e, n, r, s, o, i, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Zt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Zt[l - 15], u = Zt[l - 2], b = vt(g, 7) ^ vt(g, 18) ^ g >>> 3, y = vt(u, 17) ^ vt(u, 19) ^ u >>> 10;
      Zt[l] = y + Zt[l - 7] + b + Zt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: d, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = vt(c, 6) ^ vt(c, 11) ^ vt(c, 25), u = h + g + Bh(c, a, d) + kh[l] + Zt[l] | 0, y = (vt(r, 2) ^ vt(r, 13) ^ vt(r, 22)) + Uh(r, s, o) | 0;
      h = d, d = a, a = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, a, d, h);
  }
  roundClean() {
    Zt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Oh = class extends ea {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const na = Se(() => new ea());
Se(() => new Oh());
var _s = {}, Hs = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = kt;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let a = [], d = 0;
    for (let u = i.length - 1; u >= 0; u--)
      if (d < 4) {
        const b = n.indexOf(i[u]) >> d;
        let y = 0;
        u !== 0 && (y = n.indexOf(i[u - 1]));
        const S = 1 + d, L = y % (1 << S) << 5 - S, M = t.c32[b + L];
        d = S, a.unshift(M);
      } else
        d = 0;
    let h = 0;
    for (let u = 0; u < a.length && a[u] === "0"; u++)
      h++;
    a = a.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let u = 0; u < g; u++)
      a.unshift(t.c32[0]);
    if (c) {
      const u = c - a.length;
      for (let b = 0; b < u; b++)
        a.unshift(t.c32[0]);
    }
    return a.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, c) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const a = i.match(`^${t.c32[0]}*`), d = a ? a[0].length : 0;
    let h = [], l = 0, g = 0;
    for (let y = i.length - 1; y >= 0; y--) {
      g === 4 && (h.unshift(n[l]), g = 0, l = 0);
      const L = (t.c32.indexOf(i[y]) << g) + l, M = n[L % 16];
      if (g += 1, l = L >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      h.unshift(M);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let u = 0;
    for (let y = 0; y < h.length && h[y] === "0"; y++)
      u++;
    h = h.slice(u - u % 2);
    let b = h.join("");
    for (let y = 0; y < d; y++)
      b = `00${b}`;
    if (c) {
      const y = c * 2 - b.length;
      for (let S = 0; S < y; S += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = o;
})(Hs);
var ye = {};
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.c32checkDecode = ye.c32checkEncode = void 0;
const ri = ut, si = kt, en = Hs;
function ra(t) {
  const e = (0, ri.sha256)((0, ri.sha256)((0, si.hexToBytes)(t)));
  return (0, si.bytesToHex)(e.slice(0, 4));
}
function Ph(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ra(`${n}${e}`), s = (0, en.c32encode)(`${e}${r}`);
  return `${en.c32[t]}${s}`;
}
ye.c32checkEncode = Ph;
function Fh(t) {
  t = (0, en.c32normalize)(t);
  const e = (0, en.c32decode)(t.slice(1)), n = t[0], r = en.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), ra(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ye.c32checkDecode = Fh;
var sa = {}, Re = {};
Object.defineProperty(Re, "__esModule", { value: !0 });
Re.decode = Re.encode = void 0;
const qn = ut, oi = kt, oa = Xi, ia = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Rh(t, e = "00") {
  const n = typeof t == "string" ? (0, oi.hexToBytes)(t) : t, r = typeof e == "string" ? (0, oi.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, qn.sha256)((0, qn.sha256)(new Uint8Array([...r, ...n])));
  return oa(ia).encode([...r, ...n, ...s.slice(0, 4)]);
}
Re.encode = Rh;
function zh(t) {
  const e = oa(ia).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, qn.sha256)((0, qn.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Re.decode = zh;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ye, n = Re, r = kt;
  t.versions = {
    mainnet: {
      p2pkh: 22,
      p2sh: 20
      // 'M'
    },
    testnet: {
      p2pkh: 26,
      p2sh: 21
      // 'N'
    }
  };
  const s = {};
  s[0] = t.versions.mainnet.p2pkh, s[5] = t.versions.mainnet.p2sh, s[111] = t.versions.testnet.p2pkh, s[196] = t.versions.testnet.p2sh;
  const o = {};
  o[t.versions.mainnet.p2pkh] = 0, o[t.versions.mainnet.p2sh] = 5, o[t.versions.testnet.p2pkh] = 111, o[t.versions.testnet.p2sh] = 196;
  function i(h, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, l)}`;
  }
  t.c32address = i;
  function c(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = c;
  function a(h, l = -1) {
    const g = n.decode(h), u = (0, r.bytesToHex)(g.data), b = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let y;
    return l < 0 ? (y = b, s[b] !== void 0 && (y = s[b])) : y = l, i(y, u);
  }
  t.b58ToC32 = a;
  function d(h, l = -1) {
    const g = c(h), u = g[0], b = g[1];
    let y;
    l < 0 ? (y = u, o[u] !== void 0 && (y = o[u])) : y = l;
    let S = y.toString(16);
    return S.length === 1 && (S = `0${S}`), n.encode(b, S);
  }
  t.c32ToB58 = d;
})(sa);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Hs;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ye;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = sa;
  Object.defineProperty(t, "c32address", { enumerable: !0, get: function() {
    return r.c32address;
  } }), Object.defineProperty(t, "c32addressDecode", { enumerable: !0, get: function() {
    return r.c32addressDecode;
  } }), Object.defineProperty(t, "c32ToB58", { enumerable: !0, get: function() {
    return r.c32ToB58;
  } }), Object.defineProperty(t, "b58ToC32", { enumerable: !0, get: function() {
    return r.b58ToC32;
  } }), Object.defineProperty(t, "versions", { enumerable: !0, get: function() {
    return r.versions;
  } });
})(_s);
function Gh(t, e) {
  switch (e = Qc(e ?? Zc), t) {
    case Ct.P2PKH:
      switch (e.transactionVersion) {
        case Nt.Mainnet:
          return Mt.MainnetSingleSig;
        case Nt.Testnet:
          return Mt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ct.P2SH:
    case Ct.P2SHNonSequential:
    case Ct.P2WPKH:
    case Ct.P2WSH:
    case Ct.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Nt.Mainnet:
          return Mt.MainnetMultiSig;
        case Nt.Testnet:
          return Mt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Vh = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ca = Uint8Array.from({ length: 16 }, (t, e) => e), Kh = ca.map((t) => (9 * t + 5) % 16);
let $s = [ca], Ds = [Kh];
for (let t = 0; t < 4; t++)
  for (let e of [$s, Ds])
    e.push(e[t].map((n) => Vh[n]));
const aa = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Wh = $s.map((t, e) => t.map((n) => aa[e][n])), Yh = Ds.map((t, e) => t.map((n) => aa[e][n])), Zh = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Qh = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $n = (t, e) => t << e | t >>> 32 - e;
function ii(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Dn = new Uint32Array(16);
let qh = class extends Ms {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Dn[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, d = this.h3 | 0, h = d, l = this.h4 | 0, g = l;
    for (let u = 0; u < 5; u++) {
      const b = 4 - u, y = Zh[u], S = Qh[u], L = $s[u], M = Ds[u], x = Wh[u], I = Yh[u];
      for (let A = 0; A < 16; A++) {
        const C = $n(r + ii(u, o, c, d) + Dn[L[A]] + y, x[A]) + l | 0;
        r = l, l = d, d = $n(c, 10) | 0, c = o, o = C;
      }
      for (let A = 0; A < 16; A++) {
        const C = $n(s + ii(b, i, a, h) + Dn[M[A]] + S, I[A]) + g | 0;
        s = g, g = h, h = $n(a, 10) | 0, a = i, i = C;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + d + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    Dn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Xh = Se(() => new qh()), Cn = BigInt(2 ** 32 - 1), qr = BigInt(32);
function la(t, e = !1) {
  return e ? { h: Number(t & Cn), l: Number(t >> qr & Cn) } : { h: Number(t >> qr & Cn) | 0, l: Number(t & Cn) | 0 };
}
function Jh(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = la(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const tu = (t, e) => BigInt(t >>> 0) << qr | BigInt(e >>> 0), eu = (t, e, n) => t >>> n, nu = (t, e, n) => t << 32 - n | e >>> n, ru = (t, e, n) => t >>> n | e << 32 - n, su = (t, e, n) => t << 32 - n | e >>> n, ou = (t, e, n) => t << 64 - n | e >>> n - 32, iu = (t, e, n) => t >>> n - 32 | e << 64 - n, cu = (t, e) => e, au = (t, e) => t, lu = (t, e, n) => t << n | e >>> 32 - n, du = (t, e, n) => e << n | t >>> 32 - n, fu = (t, e, n) => e << n - 32 | t >>> 64 - n, hu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function uu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const gu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), pu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, bu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), xu = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, yu = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), wu = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, U = {
  fromBig: la,
  split: Jh,
  toBig: tu,
  shrSH: eu,
  shrSL: nu,
  rotrSH: ru,
  rotrSL: su,
  rotrBH: ou,
  rotrBL: iu,
  rotr32H: cu,
  rotr32L: au,
  rotlSH: lu,
  rotlSL: du,
  rotlBH: fu,
  rotlBL: hu,
  add: uu,
  add3L: gu,
  add3H: pu,
  add4L: bu,
  add4H: xu,
  add5H: wu,
  add5L: yu
}, [mu, Su] = U.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((t) => BigInt(t))), Qt = new Uint32Array(80), qt = new Uint32Array(80);
let fr = class extends Ms {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: d, El: h, Fh: l, Fl: g, Gh: u, Gl: b, Hh: y, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = u | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Qt[x] = e.getUint32(n), qt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Qt[x - 15] | 0, A = qt[x - 15] | 0, C = U.rotrSH(I, A, 1) ^ U.rotrSH(I, A, 8) ^ U.shrSH(I, A, 7), O = U.rotrSL(I, A, 1) ^ U.rotrSL(I, A, 8) ^ U.shrSL(I, A, 7), H = Qt[x - 2] | 0, D = qt[x - 2] | 0, G = U.rotrSH(H, D, 19) ^ U.rotrBH(H, D, 61) ^ U.shrSH(H, D, 6), q = U.rotrSL(H, D, 19) ^ U.rotrBL(H, D, 61) ^ U.shrSL(H, D, 6), Z = U.add4L(O, q, qt[x - 7], qt[x - 16]), X = U.add4H(Z, C, G, Qt[x - 7], Qt[x - 16]);
      Qt[x] = X | 0, qt[x] = Z | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: d, Dl: h, Eh: l, El: g, Fh: u, Fl: b, Gh: y, Gl: S, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = U.rotrSH(l, g, 14) ^ U.rotrSH(l, g, 18) ^ U.rotrBH(l, g, 41), A = U.rotrSL(l, g, 14) ^ U.rotrSL(l, g, 18) ^ U.rotrBL(l, g, 41), C = l & u ^ ~l & y, O = g & b ^ ~g & S, H = U.add5L(M, A, O, Su[x], qt[x]), D = U.add5H(H, L, I, C, mu[x], Qt[x]), G = H | 0, q = U.rotrSH(r, s, 28) ^ U.rotrBH(r, s, 34) ^ U.rotrBH(r, s, 39), Z = U.rotrSL(r, s, 28) ^ U.rotrBL(r, s, 34) ^ U.rotrBL(r, s, 39), X = r & o ^ r & c ^ o & c, bt = s & i ^ s & a ^ i & a;
      L = y | 0, M = S | 0, y = u | 0, S = b | 0, u = l | 0, b = g | 0, { h: l, l: g } = U.add(d | 0, h | 0, D | 0, G | 0), d = c | 0, h = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const et = U.add3L(G, Z, bt);
      r = U.add3H(et, D, q, X), s = et | 0;
    }
    ({ h: r, l: s } = U.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = U.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = U.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: d, l: h } = U.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: l, l: g } = U.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: u, l: b } = U.add(this.Fh | 0, this.Fl | 0, u | 0, b | 0), { h: y, l: S } = U.add(this.Gh | 0, this.Gl | 0, y | 0, S | 0), { h: L, l: M } = U.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, d, h, l, g, u, b, y, S, L, M);
  }
  roundClean() {
    Qt.fill(0), qt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Au = class extends fr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Eu = class extends fr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, vu = class extends fr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Se(() => new fr());
Se(() => new Au());
Se(() => new Eu());
Se(() => new vu());
var Xn = { exports: {} };
Xn.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", a = "[object Date]", d = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", u = "[object Number]", b = "[object Object]", y = "[object Promise]", S = "[object RegExp]", L = "[object Set]", M = "[object String]", x = "[object Symbol]", I = "[object WeakMap]", A = "[object ArrayBuffer]", C = "[object DataView]", O = "[object Float32Array]", H = "[object Float64Array]", D = "[object Int8Array]", G = "[object Int16Array]", q = "[object Int32Array]", Z = "[object Uint8Array]", X = "[object Uint8ClampedArray]", bt = "[object Uint16Array]", et = "[object Uint32Array]", dn = /[\\^$.*+?()[\]{}|]/g, fn = /\w*$/, pr = /^\[object .+?Constructor\]$/, w = /^(?:0|[1-9]\d*)$/, E = {};
  E[o] = E[i] = E[A] = E[C] = E[c] = E[a] = E[O] = E[H] = E[D] = E[G] = E[q] = E[g] = E[u] = E[b] = E[S] = E[L] = E[M] = E[x] = E[Z] = E[X] = E[bt] = E[et] = !0, E[d] = E[h] = E[I] = !1;
  var K = typeof wt == "object" && wt && wt.Object === Object && wt, Y = typeof self == "object" && self && self.Object === Object && self, V = K || Y || Function("return this")(), rt = e && !e.nodeType && e, We = rt && !0 && t && !t.nodeType && t, hn = We && We.exports === rt;
  function br(f, p) {
    return f.set(p[0], p[1]), f;
  }
  function Ga(f, p) {
    return f.add(p), f;
  }
  function Va(f, p) {
    for (var m = -1, _ = f ? f.length : 0; ++m < _ && p(f[m], m, f) !== !1; )
      ;
    return f;
  }
  function Ka(f, p) {
    for (var m = -1, _ = p.length, nt = f.length; ++m < _; )
      f[nt + m] = p[m];
    return f;
  }
  function Ws(f, p, m, _) {
    for (var nt = -1, lt = f ? f.length : 0; ++nt < lt; )
      m = p(m, f[nt], nt, f);
    return m;
  }
  function Wa(f, p) {
    for (var m = -1, _ = Array(f); ++m < f; )
      _[m] = p(m);
    return _;
  }
  function Ya(f, p) {
    return f == null ? void 0 : f[p];
  }
  function Ys(f) {
    var p = !1;
    if (f != null && typeof f.toString != "function")
      try {
        p = !!(f + "");
      } catch {
      }
    return p;
  }
  function Zs(f) {
    var p = -1, m = Array(f.size);
    return f.forEach(function(_, nt) {
      m[++p] = [nt, _];
    }), m;
  }
  function xr(f, p) {
    return function(m) {
      return f(p(m));
    };
  }
  function Qs(f) {
    var p = -1, m = Array(f.size);
    return f.forEach(function(_) {
      m[++p] = _;
    }), m;
  }
  var Za = Array.prototype, Qa = Function.prototype, un = Object.prototype, yr = V["__core-js_shared__"], qs = function() {
    var f = /[^.]+$/.exec(yr && yr.keys && yr.keys.IE_PROTO || "");
    return f ? "Symbol(src)_1." + f : "";
  }(), Xs = Qa.toString, Pt = un.hasOwnProperty, gn = un.toString, qa = RegExp(
    "^" + Xs.call(Pt).replace(dn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Js = hn ? V.Buffer : void 0, to = V.Symbol, eo = V.Uint8Array, Xa = xr(Object.getPrototypeOf, Object), Ja = Object.create, t0 = un.propertyIsEnumerable, e0 = Za.splice, no = Object.getOwnPropertySymbols, n0 = Js ? Js.isBuffer : void 0, r0 = xr(Object.keys, Object), wr = Ie(V, "DataView"), Ye = Ie(V, "Map"), mr = Ie(V, "Promise"), Sr = Ie(V, "Set"), Ar = Ie(V, "WeakMap"), Ze = Ie(Object, "create"), s0 = he(wr), o0 = he(Ye), i0 = he(mr), c0 = he(Sr), a0 = he(Ar), ro = to ? to.prototype : void 0, so = ro ? ro.valueOf : void 0;
  function de(f) {
    var p = -1, m = f ? f.length : 0;
    for (this.clear(); ++p < m; ) {
      var _ = f[p];
      this.set(_[0], _[1]);
    }
  }
  function l0() {
    this.__data__ = Ze ? Ze(null) : {};
  }
  function d0(f) {
    return this.has(f) && delete this.__data__[f];
  }
  function f0(f) {
    var p = this.__data__;
    if (Ze) {
      var m = p[f];
      return m === r ? void 0 : m;
    }
    return Pt.call(p, f) ? p[f] : void 0;
  }
  function h0(f) {
    var p = this.__data__;
    return Ze ? p[f] !== void 0 : Pt.call(p, f);
  }
  function u0(f, p) {
    var m = this.__data__;
    return m[f] = Ze && p === void 0 ? r : p, this;
  }
  de.prototype.clear = l0, de.prototype.delete = d0, de.prototype.get = f0, de.prototype.has = h0, de.prototype.set = u0;
  function $t(f) {
    var p = -1, m = f ? f.length : 0;
    for (this.clear(); ++p < m; ) {
      var _ = f[p];
      this.set(_[0], _[1]);
    }
  }
  function g0() {
    this.__data__ = [];
  }
  function p0(f) {
    var p = this.__data__, m = pn(p, f);
    if (m < 0)
      return !1;
    var _ = p.length - 1;
    return m == _ ? p.pop() : e0.call(p, m, 1), !0;
  }
  function b0(f) {
    var p = this.__data__, m = pn(p, f);
    return m < 0 ? void 0 : p[m][1];
  }
  function x0(f) {
    return pn(this.__data__, f) > -1;
  }
  function y0(f, p) {
    var m = this.__data__, _ = pn(m, f);
    return _ < 0 ? m.push([f, p]) : m[_][1] = p, this;
  }
  $t.prototype.clear = g0, $t.prototype.delete = p0, $t.prototype.get = b0, $t.prototype.has = x0, $t.prototype.set = y0;
  function Ee(f) {
    var p = -1, m = f ? f.length : 0;
    for (this.clear(); ++p < m; ) {
      var _ = f[p];
      this.set(_[0], _[1]);
    }
  }
  function w0() {
    this.__data__ = {
      hash: new de(),
      map: new (Ye || $t)(),
      string: new de()
    };
  }
  function m0(f) {
    return bn(this, f).delete(f);
  }
  function S0(f) {
    return bn(this, f).get(f);
  }
  function A0(f) {
    return bn(this, f).has(f);
  }
  function E0(f, p) {
    return bn(this, f).set(f, p), this;
  }
  Ee.prototype.clear = w0, Ee.prototype.delete = m0, Ee.prototype.get = S0, Ee.prototype.has = A0, Ee.prototype.set = E0;
  function ve(f) {
    this.__data__ = new $t(f);
  }
  function v0() {
    this.__data__ = new $t();
  }
  function I0(f) {
    return this.__data__.delete(f);
  }
  function L0(f) {
    return this.__data__.get(f);
  }
  function M0(f) {
    return this.__data__.has(f);
  }
  function _0(f, p) {
    var m = this.__data__;
    if (m instanceof $t) {
      var _ = m.__data__;
      if (!Ye || _.length < n - 1)
        return _.push([f, p]), this;
      m = this.__data__ = new Ee(_);
    }
    return m.set(f, p), this;
  }
  ve.prototype.clear = v0, ve.prototype.delete = I0, ve.prototype.get = L0, ve.prototype.has = M0, ve.prototype.set = _0;
  function H0(f, p) {
    var m = Ir(f) || J0(f) ? Wa(f.length, String) : [], _ = m.length, nt = !!_;
    for (var lt in f)
      Pt.call(f, lt) && !(nt && (lt == "length" || Z0(lt, _))) && m.push(lt);
    return m;
  }
  function oo(f, p, m) {
    var _ = f[p];
    (!(Pt.call(f, p) && lo(_, m)) || m === void 0 && !(p in f)) && (f[p] = m);
  }
  function pn(f, p) {
    for (var m = f.length; m--; )
      if (lo(f[m][0], p))
        return m;
    return -1;
  }
  function $0(f, p) {
    return f && io(p, Lr(p), f);
  }
  function Er(f, p, m, _, nt, lt, Dt) {
    var dt;
    if (_ && (dt = lt ? _(f, nt, lt, Dt) : _(f)), dt !== void 0)
      return dt;
    if (!xn(f))
      return f;
    var uo = Ir(f);
    if (uo) {
      if (dt = K0(f), !p)
        return z0(f, dt);
    } else {
      var Le = fe(f), go = Le == h || Le == l;
      if (el(f))
        return B0(f, p);
      if (Le == b || Le == o || go && !lt) {
        if (Ys(f))
          return lt ? f : {};
        if (dt = W0(go ? {} : f), !p)
          return G0(f, $0(dt, f));
      } else {
        if (!E[Le])
          return lt ? f : {};
        dt = Y0(f, Le, Er, p);
      }
    }
    Dt || (Dt = new ve());
    var po = Dt.get(f);
    if (po)
      return po;
    if (Dt.set(f, dt), !uo)
      var bo = m ? V0(f) : Lr(f);
    return Va(bo || f, function(Mr, yn) {
      bo && (yn = Mr, Mr = f[yn]), oo(dt, yn, Er(Mr, p, m, _, yn, f, Dt));
    }), dt;
  }
  function D0(f) {
    return xn(f) ? Ja(f) : {};
  }
  function C0(f, p, m) {
    var _ = p(f);
    return Ir(f) ? _ : Ka(_, m(f));
  }
  function N0(f) {
    return gn.call(f);
  }
  function j0(f) {
    if (!xn(f) || q0(f))
      return !1;
    var p = ho(f) || Ys(f) ? qa : pr;
    return p.test(he(f));
  }
  function T0(f) {
    if (!ao(f))
      return r0(f);
    var p = [];
    for (var m in Object(f))
      Pt.call(f, m) && m != "constructor" && p.push(m);
    return p;
  }
  function B0(f, p) {
    if (p)
      return f.slice();
    var m = new f.constructor(f.length);
    return f.copy(m), m;
  }
  function vr(f) {
    var p = new f.constructor(f.byteLength);
    return new eo(p).set(new eo(f)), p;
  }
  function U0(f, p) {
    var m = p ? vr(f.buffer) : f.buffer;
    return new f.constructor(m, f.byteOffset, f.byteLength);
  }
  function k0(f, p, m) {
    var _ = p ? m(Zs(f), !0) : Zs(f);
    return Ws(_, br, new f.constructor());
  }
  function O0(f) {
    var p = new f.constructor(f.source, fn.exec(f));
    return p.lastIndex = f.lastIndex, p;
  }
  function P0(f, p, m) {
    var _ = p ? m(Qs(f), !0) : Qs(f);
    return Ws(_, Ga, new f.constructor());
  }
  function F0(f) {
    return so ? Object(so.call(f)) : {};
  }
  function R0(f, p) {
    var m = p ? vr(f.buffer) : f.buffer;
    return new f.constructor(m, f.byteOffset, f.length);
  }
  function z0(f, p) {
    var m = -1, _ = f.length;
    for (p || (p = Array(_)); ++m < _; )
      p[m] = f[m];
    return p;
  }
  function io(f, p, m, _) {
    m || (m = {});
    for (var nt = -1, lt = p.length; ++nt < lt; ) {
      var Dt = p[nt], dt = void 0;
      oo(m, Dt, dt === void 0 ? f[Dt] : dt);
    }
    return m;
  }
  function G0(f, p) {
    return io(f, co(f), p);
  }
  function V0(f) {
    return C0(f, Lr, co);
  }
  function bn(f, p) {
    var m = f.__data__;
    return Q0(p) ? m[typeof p == "string" ? "string" : "hash"] : m.map;
  }
  function Ie(f, p) {
    var m = Ya(f, p);
    return j0(m) ? m : void 0;
  }
  var co = no ? xr(no, Object) : sl, fe = N0;
  (wr && fe(new wr(new ArrayBuffer(1))) != C || Ye && fe(new Ye()) != g || mr && fe(mr.resolve()) != y || Sr && fe(new Sr()) != L || Ar && fe(new Ar()) != I) && (fe = function(f) {
    var p = gn.call(f), m = p == b ? f.constructor : void 0, _ = m ? he(m) : void 0;
    if (_)
      switch (_) {
        case s0:
          return C;
        case o0:
          return g;
        case i0:
          return y;
        case c0:
          return L;
        case a0:
          return I;
      }
    return p;
  });
  function K0(f) {
    var p = f.length, m = f.constructor(p);
    return p && typeof f[0] == "string" && Pt.call(f, "index") && (m.index = f.index, m.input = f.input), m;
  }
  function W0(f) {
    return typeof f.constructor == "function" && !ao(f) ? D0(Xa(f)) : {};
  }
  function Y0(f, p, m, _) {
    var nt = f.constructor;
    switch (p) {
      case A:
        return vr(f);
      case c:
      case a:
        return new nt(+f);
      case C:
        return U0(f, _);
      case O:
      case H:
      case D:
      case G:
      case q:
      case Z:
      case X:
      case bt:
      case et:
        return R0(f, _);
      case g:
        return k0(f, _, m);
      case u:
      case M:
        return new nt(f);
      case S:
        return O0(f);
      case L:
        return P0(f, _, m);
      case x:
        return F0(f);
    }
  }
  function Z0(f, p) {
    return p = p ?? s, !!p && (typeof f == "number" || w.test(f)) && f > -1 && f % 1 == 0 && f < p;
  }
  function Q0(f) {
    var p = typeof f;
    return p == "string" || p == "number" || p == "symbol" || p == "boolean" ? f !== "__proto__" : f === null;
  }
  function q0(f) {
    return !!qs && qs in f;
  }
  function ao(f) {
    var p = f && f.constructor, m = typeof p == "function" && p.prototype || un;
    return f === m;
  }
  function he(f) {
    if (f != null) {
      try {
        return Xs.call(f);
      } catch {
      }
      try {
        return f + "";
      } catch {
      }
    }
    return "";
  }
  function X0(f) {
    return Er(f, !0, !0);
  }
  function lo(f, p) {
    return f === p || f !== f && p !== p;
  }
  function J0(f) {
    return tl(f) && Pt.call(f, "callee") && (!t0.call(f, "callee") || gn.call(f) == o);
  }
  var Ir = Array.isArray;
  function fo(f) {
    return f != null && nl(f.length) && !ho(f);
  }
  function tl(f) {
    return rl(f) && fo(f);
  }
  var el = n0 || ol;
  function ho(f) {
    var p = xn(f) ? gn.call(f) : "";
    return p == h || p == l;
  }
  function nl(f) {
    return typeof f == "number" && f > -1 && f % 1 == 0 && f <= s;
  }
  function xn(f) {
    var p = typeof f;
    return !!f && (p == "object" || p == "function");
  }
  function rl(f) {
    return !!f && typeof f == "object";
  }
  function Lr(f) {
    return fo(f) ? H0(f) : T0(f);
  }
  function sl() {
    return [];
  }
  function ol() {
    return !1;
  }
  t.exports = X0;
})(Xn, Xn.exports);
Xn.exports;
var Xr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Xr || (Xr = {}));
function Iu(t, e) {
  return { type: Xr.Address, version: t, hash160: e };
}
function Lu(t) {
  return _s.c32address(t.version, t.hash160);
}
const Mu = (t) => Xh(na(t)), _u = (t) => se(Mu(t));
tt.hmacSha256Sync = (t, ...e) => {
  const n = ta.create(na, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Hu(t, e = "mainnet") {
  e = Qc(e), t = typeof t == "string" ? oe(t) : t;
  const n = Gh(Ct.P2PKH, e), r = Iu(n, _u(t));
  return Lu(r);
}
function $u(t, e) {
  const n = pt.decodeToken(t), r = n.payload;
  if (typeof r == "string")
    throw new Error("Unexpected token payload type of string");
  if (r.hasOwnProperty("subject") && r.subject) {
    if (!r.subject.hasOwnProperty("publicKey"))
      throw new Error("Token doesn't have a subject public key");
  } else
    throw new Error("Token doesn't have a subject");
  if (r.hasOwnProperty("issuer") && r.issuer) {
    if (!r.issuer.hasOwnProperty("publicKey"))
      throw new Error("Token doesn't have an issuer public key");
  } else
    throw new Error("Token doesn't have an issuer");
  if (!r.hasOwnProperty("claim"))
    throw new Error("Token doesn't have a claim");
  const s = r.issuer.publicKey, o = Hu(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new pt.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Du(t, e = null) {
  let n;
  e ? n = $u(t, e) : n = pt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ci = "_blockstackDidCheckEchoReply", Cu = "echoReply", Nu = "authContinuation";
function ju(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Tu() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[ci];
  if (typeof e == "boolean")
    return e;
  const n = ju(t.location.search), r = n[Cu];
  if (r) {
    t[ci] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[Nu];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Jn {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new us();
    else
      throw new $l("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ro(e.sessionOptions) : this.store = new Ro() : e ? this.store = new Fo(e.sessionOptions) : this.store = new Fo();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Cl().getTime(), c = {}) {
    const a = this.appConfig;
    if (!a)
      throw new Fr("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || a.redirectURI(), r = r || a.manifestURI(), s = s || a.scopes, o = o || a.appDomain, Sh(e, n, r, s, o, i, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = mh();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = hs("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Tu())
        return He.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      He.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Kl()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new wn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = pt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Lh(e))
      throw new wn("Invalid authentication response.");
    let c = o.private_key, a = o.core_token;
    if (Cr(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            c = await Oo(s, o.private_key);
          } catch {
            if (He.warn("Failed decryption of appPrivateKey, will try to use as given"), !tt.isValidPrivateKey(o.private_key))
              throw new wn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (a != null)
          try {
            a = await Oo(s, a);
          } catch {
            He.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new wn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = Fl, h;
    Cr(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (d = o.hubUrl), Cr(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const l = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Wc(o.iss),
      appPrivateKey: c,
      coreSessionToken: a,
      authResponseToken: e,
      hubUrl: d,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, g = o.profile_url;
    if (!l.profile && g) {
      const u = await n(g);
      if (!u.ok)
        l.profile = Object.assign({}, Ml);
      else {
        const b = await u.text(), y = JSON.parse(b);
        l.profile = Du(y[0].token);
      }
    } else
      l.profile = o.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Fr("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Uf(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), kf(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Jn.prototype.makeAuthRequest = Jn.prototype.makeAuthRequestToken;
const Bu = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Uu = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Bu(), n = t.filter((r) => e.find((o) => o.id === r.id) ? !1 : !!hr(r.id));
  return e.concat(n);
}, hr = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Cs = "STX_PROVIDER", Ot = () => typeof window > "u" ? null : window.localStorage.getItem(Cs), da = (t) => {
  typeof window < "u" && window.localStorage.setItem(Cs, t);
}, fa = () => {
  typeof window < "u" && window.localStorage.removeItem(Cs);
}, ku = "connect-ui";
let Pn, ha, ht = !1, Jr = !1;
const Bt = (t, e = "") => () => {
}, Ou = (t, e) => () => {
}, Pu = "{visibility:hidden}.hydrated{visibility:inherit}", ai = {}, Fu = "http://www.w3.org/2000/svg", Ru = "http://www.w3.org/1999/xhtml", zu = (t) => t != null, Ns = (t) => (t = typeof t, t === "object" || t === "function");
function ua(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const j = (t, e, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], c = (d) => {
    for (let h = 0; h < d.length; h++)
      r = d[h], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Ns(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? ts(null, r) : r), o = s);
  };
  if (c(n), e) {
    const d = e.className || e.class;
    d && (e.class = typeof d != "object" ? d : Object.keys(d).filter((h) => d[h]).join(" "));
  }
  const a = ts(t, null);
  return a.$attrs$ = e, i.length > 0 && (a.$children$ = i), a;
}, ts = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, Gu = {}, Vu = (t) => t && t.$tag$ === Gu, Ku = (t, e) => t != null && !Ns(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Wu = (t) => Ve(t).$hostElement$, Yu = (t, e, n) => {
  const r = it.ce(e, n);
  return t.dispatchEvent(r), r;
}, li = /* @__PURE__ */ new WeakMap(), Zu = (t, e, n) => {
  let r = tr.get(t);
  p1 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, tr.set(t, r);
}, Qu = (t, e, n, r) => {
  var s;
  let o = ga(e);
  const i = tr.get(o);
  if (t = t.nodeType === 11 ? t : _t, i)
    if (typeof i == "string") {
      t = t.head || t;
      let c = li.get(t), a;
      if (c || li.set(t, c = /* @__PURE__ */ new Set()), !c.has(o)) {
        {
          a = _t.createElement("style"), a.innerHTML = i;
          const d = (s = it.$nonce$) !== null && s !== void 0 ? s : ua(_t);
          d != null && a.setAttribute("nonce", d), t.insertBefore(a, t.querySelector("link"));
        }
        c && c.add(o);
      }
    } else t.adoptedStyleSheets.includes(i) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]);
  return o;
}, qu = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Bt("attachStyles", e.$tagName$), o = Qu(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, ga = (t, e) => "sc-" + t.$tagName$, di = (t, e, n, r, s, o) => {
  if (n !== r) {
    let i = hi(t, e), c = e.toLowerCase();
    if (e === "class") {
      const a = t.classList, d = fi(n), h = fi(r);
      a.remove(...d.filter((l) => l && !h.includes(l))), a.add(...h.filter((l) => l && !d.includes(l)));
    } else if (!i && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : hi(ur, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && it.rel(t, e, n, !1), r && it.ael(t, e, r, !1);
    else {
      const a = Ns(r);
      if ((i || a && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const d = r ?? "";
            e === "list" ? i = !1 : (n == null || t[e] != d) && (t[e] = d);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!i || o & 4 || s) && !a && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, Xu = /\s/, fi = (t) => t ? t.split(Xu) : [], pa = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, o = t && t.$attrs$ || ai, i = e.$attrs$ || ai;
  for (r in o)
    r in i || di(s, r, o[r], void 0, n, e.$flags$);
  for (r in i)
    di(s, r, o[r], i[r], n, e.$flags$);
}, js = (t, e, n, r) => {
  const s = e.$children$[n];
  let o = 0, i, c;
  if (s.$text$ !== null)
    i = s.$elm$ = _t.createTextNode(s.$text$);
  else {
    if (ht || (ht = s.$tag$ === "svg"), i = s.$elm$ = _t.createElementNS(ht ? Fu : Ru, s.$tag$), ht && s.$tag$ === "foreignObject" && (ht = !1), pa(null, s, ht), zu(Pn) && i["s-si"] !== Pn && i.classList.add(i["s-si"] = Pn), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        c = js(t, s, o), c && i.appendChild(c);
    s.$tag$ === "svg" ? ht = !1 : i.tagName === "foreignObject" && (ht = !0);
  }
  return i;
}, ba = (t, e, n, r, s, o) => {
  let i = t, c;
  for (i.shadowRoot && i.tagName === ha && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (c = js(null, n, s), c && (r[s].$elm$ = c, i.insertBefore(c, e)));
}, xa = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Ju = (t, e, n, r) => {
  let s = 0, o = 0, i = e.length - 1, c = e[0], a = e[i], d = r.length - 1, h = r[0], l = r[d], g;
  for (; s <= i && o <= d; )
    c == null ? c = e[++s] : a == null ? a = e[--i] : h == null ? h = r[++o] : l == null ? l = r[--d] : Nn(c, h) ? (Xe(c, h), c = e[++s], h = r[++o]) : Nn(a, l) ? (Xe(a, l), a = e[--i], l = r[--d]) : Nn(c, l) ? (Xe(c, l), t.insertBefore(c.$elm$, a.$elm$.nextSibling), c = e[++s], l = r[--d]) : Nn(a, h) ? (Xe(a, h), t.insertBefore(a.$elm$, c.$elm$), a = e[--i], h = r[++o]) : (g = js(e && e[o], n, o), h = r[++o], g && c.$elm$.parentNode.insertBefore(g, c.$elm$));
  s > i ? ba(t, r[d + 1] == null ? null : r[d + 1].$elm$, n, r, o, d) : o > d && xa(e, s, i);
}, Nn = (t, e) => t.$tag$ === e.$tag$, Xe = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, o = e.$tag$, i = e.$text$;
  i === null ? (ht = o === "svg" ? !0 : o === "foreignObject" ? !1 : ht, pa(t, e, ht), r !== null && s !== null ? Ju(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), ba(n, null, e, s, 0, s.length - 1)) : r !== null && xa(r, 0, r.length - 1), ht && o === "svg" && (ht = !1)) : t.$text$ !== i && (n.data = i);
}, t1 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ts(null, null), s = Vu(e) ? e : j(null, null, e);
  ha = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Pn = n["s-sc"], Xe(r, s);
}, ya = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Ts = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return ya(t, t.$ancestorComponent$), x1(() => e1(t, e));
}, e1 = (t, e) => {
  const n = Bt("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), o1(s, () => n1(t, r, e));
}, n1 = async (t, e, n) => {
  const r = t.$hostElement$, s = Bt("update", t.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && qu(t);
  const i = Bt("render", t.$cmpMeta$.$tagName$);
  r1(t, e), o && (o.map((c) => c()), r["s-rc"] = void 0), i(), s();
  {
    const c = r["s-p"], a = () => s1(t);
    c.length === 0 ? a() : (Promise.all(c).then(a), t.$flags$ |= 4, c.length = 0);
  }
}, r1 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, t1(t, e);
  } catch (r) {
    sn(r, t.$hostElement$);
  }
  return null;
}, s1 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Bt("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, ma(n), r(), t.$onReadyResolve$(n), s || wa()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Us(() => Ts(t, !1)), t.$flags$ &= -517;
}, wa = (t) => {
  ma(_t.documentElement), Us(() => Yu(ur, "appload", { detail: { namespace: ku } }));
}, o1 = (t, e) => t && t.then ? t.then(e) : e(), ma = (t) => t.classList.add("hydrated"), i1 = (t, e) => Ve(t).$instanceValues$.get(e), c1 = (t, e, n, r) => {
  const s = Ve(t), o = s.$instanceValues$.get(e), i = s.$flags$, c = s.$lazyInstance$;
  n = Ku(n, r.$members$[e][0]);
  const a = Number.isNaN(o) && Number.isNaN(n), d = n !== o && !a;
  (!(i & 8) || o === void 0) && d && (s.$instanceValues$.set(e, n), c && (i & 18) === 2 && Ts(s, !1));
}, Sa = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return i1(this, o);
        },
        set(c) {
          c1(this, o, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, c, a) {
        it.jmp(() => {
          const d = o.get(i);
          if (this.hasOwnProperty(d))
            a = this[d], delete this[d];
          else if (s.hasOwnProperty(d) && typeof this[d] == "number" && this[d] == a)
            return;
          this[d] = a === null && typeof this[d] == "boolean" ? !1 : a;
        });
      }, t.observedAttributes = r.filter(
        ([i, c]) => c[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, c]) => {
        const a = c[1] || i;
        return o.set(a, i), a;
      });
    }
  }
  return t;
}, a1 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = g1(n), s.then) {
        const a = Ou();
        s = await s, a();
      }
      s.isProxied || (Sa(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = Bt("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (a) {
        sn(a);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const a = ga(n);
      if (!tr.has(a)) {
        const d = Bt("registerStyles", n.$tagName$);
        Zu(a, c, !!(n.$flags$ & 1)), d();
      }
    }
  }
  const o = e.$ancestorComponent$, i = () => Ts(e, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, l1 = (t) => {
  if (!(it.$flags$ & 1)) {
    const e = Ve(t), n = e.$cmpMeta$, r = Bt("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            ya(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && t.hasOwnProperty(s)) {
          const i = t[s];
          delete t[s], t[s] = i;
        }
      }), a1(t, e, n);
    }
    r();
  }
}, d1 = (t) => {
  it.$flags$ & 1 || Ve(t);
}, f1 = (t, e = {}) => {
  var n;
  const r = Bt(), s = [], o = e.exclude || [], i = ur.customElements, c = _t.head, a = /* @__PURE__ */ c.querySelector("meta[charset]"), d = /* @__PURE__ */ _t.createElement("style"), h = [];
  let l, g = !0;
  Object.assign(it, e), it.$resourcesUrl$ = new URL(e.resourcesUrl || "./", _t.baseURI).href, t.map((u) => {
    u[1].map((b) => {
      const y = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      y.$members$ = b[2];
      const S = y.$tagName$, L = class extends HTMLElement {
        // StencilLazyHost
        constructor(M) {
          super(M), M = this, u1(M, y), y.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? h.push(this) : it.jmp(() => l1(this));
        }
        disconnectedCallback() {
          it.jmp(() => d1(this));
        }
        componentOnReady() {
          return Ve(this).$onReadyPromise$;
        }
      };
      y.$lazyBundleId$ = u[0], !o.includes(S) && !i.get(S) && (s.push(S), i.define(S, Sa(
        L,
        y,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    d.innerHTML = s + Pu, d.setAttribute("data-styles", "");
    const u = (n = it.$nonce$) !== null && n !== void 0 ? n : ua(_t);
    u != null && d.setAttribute("nonce", u), c.insertBefore(d, a ? a.nextSibling : c.firstChild);
  }
  g = !1, h.length ? h.map((u) => u.connectedCallback()) : it.jmp(() => l = setTimeout(wa, 30)), r();
}, Bs = /* @__PURE__ */ new WeakMap(), Ve = (t) => Bs.get(t), h1 = (t, e) => Bs.set(e.$lazyInstance$ = t, e), u1 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Bs.set(t, n);
}, hi = (t, e) => e in t, sn = (t, e) => (0, console.error)(t, e), kr = /* @__PURE__ */ new Map(), g1 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, o = kr.get(s);
  if (o)
    return o[r];
  {
    const i = (c) => (kr.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => W2).then(i, sn);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (kr.set(s, i), i[r]), sn);
}, tr = /* @__PURE__ */ new Map(), ur = typeof window < "u" ? window : {}, _t = ur.document || { head: {} }, it = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Aa = (t) => Promise.resolve(t), p1 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ui = [], Ea = [], b1 = (t, e) => (n) => {
  t.push(n), Jr || (Jr = !0, it.$flags$ & 4 ? Us(es) : it.raf(es));
}, gi = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      sn(n);
    }
  t.length = 0;
}, es = () => {
  gi(ui), gi(Ea), (Jr = ui.length > 0) && it.raf(es);
}, Us = (t) => Aa().then(t), x1 = /* @__PURE__ */ b1(Ea), y1 = () => Aa(), va = (t, e) => typeof window > "u" ? Promise.resolve() : y1().then(() => f1([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
function Ia() {
  return hr(Ot()) || window.StacksProvider || window.BlockstackProvider;
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var w1 = (t) => {
  if (!t) {
    let e = new us(["store_write"], document.location.href);
    t = new Jn({ appConfig: e });
  }
  return t;
}, m1 = async (t, e = Ia()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: o, sendToSignIn: i = !1, userSession: c, appDetails: a } = t, d = w1(c);
  d.isUserSignedIn() && d.signUserOut();
  let h = d.generateAndStoreTransitKey(), l = d.makeAuthRequest(h, `${document.location.origin}${n}`, `${document.location.origin}${r}`, d.appConfig.scopes, void 0, void 0, { sendToSignIn: i, appDetails: a, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await d.handlePendingSignIn(g);
    let u = pt.decodeToken(g), b = u == null ? void 0 : u.payload;
    s == null || s({ authResponse: g, authResponsePayload: b, userSession: d });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), o == null || o();
  }
}, S1 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(S1 || {}), A1 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(A1 || {}), E1 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(E1 || {}), La = "asigna-stx", pi = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === La && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(I1(t, e), "*");
}), v1 = { authenticationRequest: async (t) => pi(t, "authenticationRequest"), transactionRequest: async (t) => pi(t, "transactionRequest") }, I1 = (t, e) => ({ source: La, [e]: t }), L1 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = v1);
};
L1();
var Ma = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function M1(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let o = Ot(), i = Ia();
    if (o && i) return t(n, i);
    if (typeof window > "u") return;
    va();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Ma, a = Uu(c), d = document.createElement("connect-modal");
    d.defaultProviders = c, d.installedProviders = a, d.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      d.remove(), document.body.style.overflow = h;
    };
    d.callback = (u) => {
      l(), t(n, u);
    }, d.cancelCallback = () => {
      var u;
      l(), (u = n.onCancel) == null || u.call(n);
    }, document.body.appendChild(d);
    let g = (u) => {
      u.key === "Escape" && (document.removeEventListener("keydown", g), d.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var _1 = M1(m1, !1), H1 = fa;
function ns(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function $1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _a(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function D1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ns(t.outputLen), ns(t.blockLen);
}
function C1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function N1(t, e) {
  _a(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Or = {
  number: ns,
  bool: $1,
  bytes: _a,
  hash: D1,
  exists: C1,
  output: N1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pr = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), It = (t, e) => t << 32 - e | t >>> e, j1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!j1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function T1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ha(t) {
  if (typeof t == "string" && (t = T1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class B1 {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ae(t) {
  const e = (r) => t().update(Ha(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function U1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + d, c, r);
}
class ks extends B1 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pr(this.buffer);
  }
  update(e) {
    Or.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ha(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Pr(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Or.exists(this), Or.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    U1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Pr(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = a / 4, h = this.get();
    if (d > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < d; l++)
      c.setUint32(4 * l, h[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
}
const k1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $a = Uint8Array.from({ length: 16 }, (t, e) => e), O1 = $a.map((t) => (9 * t + 5) % 16);
let Os = [$a], Ps = [O1];
for (let t = 0; t < 4; t++)
  for (let e of [Os, Ps])
    e.push(e[t].map((n) => k1[n]));
const Da = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), P1 = Os.map((t, e) => t.map((n) => Da[e][n])), F1 = Ps.map((t, e) => t.map((n) => Da[e][n])), R1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), z1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), jn = (t, e) => t << e | t >>> 32 - e;
function bi(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Tn = new Uint32Array(16);
class G1 extends ks {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Tn[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, d = this.h3 | 0, h = d, l = this.h4 | 0, g = l;
    for (let u = 0; u < 5; u++) {
      const b = 4 - u, y = R1[u], S = z1[u], L = Os[u], M = Ps[u], x = P1[u], I = F1[u];
      for (let A = 0; A < 16; A++) {
        const C = jn(r + bi(u, o, c, d) + Tn[L[A]] + y, x[A]) + l | 0;
        r = l, l = d, d = jn(c, 10) | 0, c = o, o = C;
      }
      for (let A = 0; A < 16; A++) {
        const C = jn(s + bi(b, i, a, h) + Tn[M[A]] + S, I[A]) + g | 0;
        s = g, g = h, h = jn(a, 10) | 0, a = i, i = C;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + d + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    Tn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
Ae(() => new G1());
const V1 = (t, e, n) => t & e ^ ~t & n, K1 = (t, e, n) => t & e ^ t & n ^ e & n, W1 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Xt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jt = new Uint32Array(64);
class Ca extends ks {
  constructor() {
    super(64, 32, 8, !1), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0, this.F = Xt[5] | 0, this.G = Xt[6] | 0, this.H = Xt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: a } = this;
    return [e, n, r, s, o, i, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Jt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Jt[l - 15], u = Jt[l - 2], b = It(g, 7) ^ It(g, 18) ^ g >>> 3, y = It(u, 17) ^ It(u, 19) ^ u >>> 10;
      Jt[l] = y + Jt[l - 7] + b + Jt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: d, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = It(c, 6) ^ It(c, 11) ^ It(c, 25), u = h + g + V1(c, a, d) + W1[l] + Jt[l] | 0, y = (It(r, 2) ^ It(r, 13) ^ It(r, 22)) + K1(r, s, o) | 0;
      h = d, d = a, a = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, d = d + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, a, d, h);
  }
  roundClean() {
    Jt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Y1 extends Ca {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
Ae(() => new Ca());
Ae(() => new Y1());
const Bn = BigInt(2 ** 32 - 1), rs = BigInt(32);
function Na(t, e = !1) {
  return e ? { h: Number(t & Bn), l: Number(t >> rs & Bn) } : { h: Number(t >> rs & Bn) | 0, l: Number(t & Bn) | 0 };
}
function Z1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Na(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Q1 = (t, e) => BigInt(t >>> 0) << rs | BigInt(e >>> 0), q1 = (t, e, n) => t >>> n, X1 = (t, e, n) => t << 32 - n | e >>> n, J1 = (t, e, n) => t >>> n | e << 32 - n, t2 = (t, e, n) => t << 32 - n | e >>> n, e2 = (t, e, n) => t << 64 - n | e >>> n - 32, n2 = (t, e, n) => t >>> n - 32 | e << 64 - n, r2 = (t, e) => e, s2 = (t, e) => t, o2 = (t, e, n) => t << n | e >>> 32 - n, i2 = (t, e, n) => e << n | t >>> 32 - n, c2 = (t, e, n) => e << n - 32 | t >>> 64 - n, a2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const d2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), f2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, h2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), u2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, g2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), p2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, k = {
  fromBig: Na,
  split: Z1,
  toBig: Q1,
  shrSH: q1,
  shrSL: X1,
  rotrSH: J1,
  rotrSL: t2,
  rotrBH: e2,
  rotrBL: n2,
  rotr32H: r2,
  rotr32L: s2,
  rotlSH: o2,
  rotlSL: i2,
  rotlBH: c2,
  rotlBL: a2,
  add: l2,
  add3L: d2,
  add3H: f2,
  add4L: h2,
  add4H: u2,
  add5H: p2,
  add5L: g2
}, [b2, x2] = k.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((t) => BigInt(t))), te = new Uint32Array(80), ee = new Uint32Array(80);
class gr extends ks {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: d, El: h, Fh: l, Fl: g, Gh: u, Gl: b, Hh: y, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, d, h, l, g, u, b, y, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = d | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = u | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      te[x] = e.getUint32(n), ee[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = te[x - 15] | 0, A = ee[x - 15] | 0, C = k.rotrSH(I, A, 1) ^ k.rotrSH(I, A, 8) ^ k.shrSH(I, A, 7), O = k.rotrSL(I, A, 1) ^ k.rotrSL(I, A, 8) ^ k.shrSL(I, A, 7), H = te[x - 2] | 0, D = ee[x - 2] | 0, G = k.rotrSH(H, D, 19) ^ k.rotrBH(H, D, 61) ^ k.shrSH(H, D, 6), q = k.rotrSL(H, D, 19) ^ k.rotrBL(H, D, 61) ^ k.shrSL(H, D, 6), Z = k.add4L(O, q, ee[x - 7], ee[x - 16]), X = k.add4H(Z, C, G, te[x - 7], te[x - 16]);
      te[x] = X | 0, ee[x] = Z | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: d, Dl: h, Eh: l, El: g, Fh: u, Fl: b, Gh: y, Gl: S, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = k.rotrSH(l, g, 14) ^ k.rotrSH(l, g, 18) ^ k.rotrBH(l, g, 41), A = k.rotrSL(l, g, 14) ^ k.rotrSL(l, g, 18) ^ k.rotrBL(l, g, 41), C = l & u ^ ~l & y, O = g & b ^ ~g & S, H = k.add5L(M, A, O, x2[x], ee[x]), D = k.add5H(H, L, I, C, b2[x], te[x]), G = H | 0, q = k.rotrSH(r, s, 28) ^ k.rotrBH(r, s, 34) ^ k.rotrBH(r, s, 39), Z = k.rotrSL(r, s, 28) ^ k.rotrBL(r, s, 34) ^ k.rotrBL(r, s, 39), X = r & o ^ r & c ^ o & c, bt = s & i ^ s & a ^ i & a;
      L = y | 0, M = S | 0, y = u | 0, S = b | 0, u = l | 0, b = g | 0, { h: l, l: g } = k.add(d | 0, h | 0, D | 0, G | 0), d = c | 0, h = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const et = k.add3L(G, Z, bt);
      r = k.add3H(et, D, q, X), s = et | 0;
    }
    ({ h: r, l: s } = k.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = k.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = k.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: d, l: h } = k.add(this.Dh | 0, this.Dl | 0, d | 0, h | 0), { h: l, l: g } = k.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: u, l: b } = k.add(this.Fh | 0, this.Fl | 0, u | 0, b | 0), { h: y, l: S } = k.add(this.Gh | 0, this.Gl | 0, y | 0, S | 0), { h: L, l: M } = k.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, d, h, l, g, u, b, y, S, L, M);
  }
  roundClean() {
    te.fill(0), ee.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class y2 extends gr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class w2 extends gr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class m2 extends gr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ae(() => new gr());
Ae(() => new y2());
Ae(() => new w2());
Ae(() => new m2());
const nn = (t) => {
  try {
    return _s.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
}, S2 = ["store_write"], xi = "/manifest.json", A2 = /* @__PURE__ */ new Set([4001, -31001]), E2 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Fs = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), ln = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ke = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Ce = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, ja = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Rs = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => ja(o, r)) === s
  );
}, Ta = (t) => t ? Rs(Ke()).some(
  (e) => {
    var n;
    return e.id === t && (ln(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ba = () => {
  if (typeof window > "u")
    return;
  const t = Ke(), e = Rs(t).filter(
    (n) => {
      var r;
      return ln(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Ce(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of E2) {
    const r = Ce(t, n) ?? (t === window ? void 0 : Ce(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Ua = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ke(), n = Ce(e, t) ?? (e === window ? void 0 : Ce(window, t)) ?? hr(t);
  if (n)
    return n;
  if (ln(t) || Ta(t))
    return Ba();
}, v2 = (t) => {
  const e = Ke();
  if (!e)
    return [];
  const n = Rs(e), r = t.filter(
    (s) => !n.some((o) => ja(o, s)) && !!Ce(e, s.id)
  );
  return n.concat(r);
}, Ut = () => ({ isConnected: !1 }), I2 = ["blockstack-session", "blockstack"], ka = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of I2) {
      let e = null;
      try {
        e = window.localStorage.getItem(t);
      } catch {
        continue;
      }
      if (!e)
        continue;
      let n = !1;
      try {
        const r = JSON.parse(e);
        n = typeof (r == null ? void 0 : r.version) == "string" && r.version.length > 0;
      } catch {
        n = !1;
      }
      if (!n)
        try {
          window.localStorage.removeItem(t);
        } catch {
        }
    }
};
ka();
const L2 = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, $e = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, ss = (t, e = "mainnet") => {
  if (typeof t == "string") {
    const n = t.toLowerCase();
    if (n.includes("testnet") || n === "test")
      return "testnet";
    if (n.includes("mainnet") || n === "main")
      return "mainnet";
  }
  if (t && typeof t == "object") {
    const n = t;
    if (typeof n.network == "string")
      return ss(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return ss(r, e);
  }
  return e;
}, os = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return nn(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const o = os(s, e + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const n = t, r = [
    "address",
    "selectedAddress",
    "identityAddress",
    "stxAddress",
    "addresses",
    "accounts",
    "result",
    "profile",
    "authResponsePayload",
    "userData"
  ];
  for (const s of r) {
    if (!(s in n))
      continue;
    const o = os(n[s], e + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && nn(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && nn(n.testnet) ? n.testnet.trim() : null;
}, yi = (t) => {
  const e = $e(t);
  if (!e)
    return null;
  const n = L2(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, is = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const c = is(i, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : yi(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((i) => $e(i)).find((i) => i && nn(i)), o = [r.publicKey, r.public_key, r.stxPublicKey].map((i) => yi(i)).find(Boolean);
  if (o && (!e || s && s === e))
    return o;
  for (const i of [
    "addresses",
    "accounts",
    "result",
    "data",
    "payload",
    "response",
    "params",
    "profile",
    "userData"
  ]) {
    if (!(i in r))
      continue;
    const c = is(r[i], e, n + 1);
    if (c)
      return c;
  }
  return null;
}, M2 = (t) => {
  var o;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((o = e.stxAddress) == null ? void 0 : o.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && nn(n) ? n.trim() : null;
  if (!r)
    return Ut();
  const s = ls(r);
  return s !== "mainnet" ? Ut() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, _2 = (t, e = "mainnet") => {
  const n = os(t);
  if (!n)
    return Ut();
  const r = ls(n) ?? ss(t, e);
  if (r !== "mainnet")
    return Ut();
  const s = is(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, zs = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Gs = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && A2.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, er = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = $e(n == null ? void 0 : n.message) ?? $e(e.message) ?? $e(e.error) ?? $e(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Oa = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw er(e);
    if (e.status === "error")
      throw er(e.result ?? e);
  }
  return t;
}, Vs = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Oa(r);
  } catch (r) {
    throw er(r);
  }
}, Pa = () => Ba(), nr = (t) => {
  var r, s;
  const e = Ot();
  if (ln(e) || Ta(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ke() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Pa();
}, wi = async (t, e, n) => {
  if (!nr(t))
    return Vs(t, e, n);
  const r = Pa();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return Oa(await r.request(e, n));
  } catch (s) {
    throw er(s);
  }
}, H2 = (t) => {
}, Fa = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Fa(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, $2 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], D2 = async (t) => {
  const e = Ot();
  if (nr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!Fs(e))
    return $2;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Fa(await Vs(t, "supportedMethods"));
    console.info("[wallet:connect]", {
      stage: "CAPABILITIES",
      provider: "leather",
      supportedMethods: r
    });
    const s = n.filter((o) => r.includes(o));
    return s.length > 0 ? s : n;
  } catch (r) {
    return console.info("[wallet:connect]", {
      stage: "CAPABILITIES_UNAVAILABLE",
      provider: "leather",
      message: r instanceof Error ? r.message : String(r)
    }), n;
  }
}, C2 = async (t) => {
  if (nr(t))
    try {
      await wi(t, "wallet_disconnect");
    } catch {
    }
  const e = await D2(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await wi(t, r), o = _2(s);
      if (o.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!o.publicKey
        }), nr(t) && H2(o.address), o;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const o = zs(s);
      if ((o ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Gs(s))
        return Ut();
      if (o)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Ut();
}, N2 = async (t, e) => {
  const n = new us(S2, void 0, "", xi), r = new Jn({ appConfig: n });
  return new Promise((s) => {
    _1(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: xi,
        userSession: r,
        onFinish: (o) => {
          s(M2(o.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Ut());
        }
      },
      e
    );
  });
}, j2 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : Ot(), r = Ua(n);
  return r ? (e && n && da(n), r) : null;
}, T2 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return va(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = Ma, o = v2(s), i = document.body.style.overflow, c = () => {
      document.body.style.overflow = i, document.removeEventListener("keydown", a), r.remove();
    }, a = (d) => {
      d.key === "Escape" && (c(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = o, r.persistSelection = e, r.callback = (d) => {
      const h = j2(d, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof d == "string" ? d : Ot() ?? "provider-object",
        resolved: !!h,
        requestBridge: typeof (h == null ? void 0 : h.request) == "function"
      }), c(), n(h);
    }, r.cancelCallback = () => {
      c(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", a), document.body.appendChild(r);
  });
}, B2 = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Ot(), e = t ? Ua(t) : void 0;
  if (e)
    return e;
  const n = Ke() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, U2 = async (t) => {
  ka();
  const e = await T2({});
  if (!e)
    return Ut();
  if (typeof e.request == "function")
    try {
      const n = await C2(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Gs(n))
        return Ut();
      if (!zs(n))
        throw n;
    }
  return N2(t, e);
}, k2 = () => {
  const t = Ot();
  return Fs(t) ? "leather" : ln(t) ? "xverse" : t ? String(t) : void 0;
}, O2 = async (t) => {
  const e = Il("wallet_connect");
  qe({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await U2(t);
    return n.isConnected && n.address ? (ds(n.address, k2()), fs(n.network), qe({ journey: e, step: "authorize", outcome: "success" })) : qe({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw qe({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: ml(n),
      error: n
    }), n;
  }
}, P2 = async () => {
  const t = B2();
  if (t && Fs(Ot()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await Vs(t, e);
        break;
      } catch (n) {
        if (Gs(n) || zs(n))
          continue;
      }
  H1(), fa(), ds(null), fs(null), qe({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, F2 = (t) => {
  const e = pl(), n = () => {
    e.clear();
  }, r = () => {
    const i = e.load();
    return i.isConnected && i.address && (ds(i.address), fs(i.network)), i;
  };
  return {
    connect: async () => {
      const i = r(), c = await O2({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return c.isConnected ? (e.save(c), c) : i.isConnected ? i : c;
    },
    disconnect: async () => {
      await P2(), n();
    },
    getSession: r
  };
}, Ks = F2({ appName: "Xtrata Radio", appIcon: "/favicon.svg" }), mi = document.getElementById("radio-wallet-address"), cs = document.getElementById("radio-wallet-connect"), as = document.getElementById("radio-wallet-disconnect"), Si = document.getElementById("radio-wallet-message");
let Ne = !1, Ai;
function on() {
  const t = Ks.getSession(), e = t.isConnected && !!t.address;
  mi.textContent = e ? t.address : "Wallet not connected", mi.title = e ? "Connected wallet · " + t.network : "", Ai !== t.address && (Ai = t.address, window.dispatchEvent(new Event("xtrata:wallet-changed"))), cs.textContent = Ne ? "Please wait…" : e ? "Switch wallet" : "Connect wallet", cs.disabled = Ne, as.hidden = !e, as.disabled = Ne;
}
async function Ra(t) {
  if (!Ne) {
    Ne = !0, Si.textContent = "", on();
    try {
      await t();
    } catch (e) {
      Si.textContent = e instanceof Error ? e.message : "Wallet action failed. Please try again.";
    } finally {
      Ne = !1, on();
    }
  }
}
cs.onclick = () => void Ra(() => Ks.connect());
as.onclick = () => void Ra(() => Ks.disconnect());
window.addEventListener("focus", on);
window.addEventListener("storage", (t) => {
  (t.key === null || t.key === "xtrata.v15.1.wallet.session") && on();
});
on();
const R2 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", z2 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), o = /CriOS/.exec(e.userAgent), i = e.userAgent.includes("Mobile");
  return o ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, G2 = () => z2() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, V2 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, K2 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', za = class {
  constructor(t) {
    h1(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && da(t), this.callback(hr(t));
  }
  handleCloseModal() {
    this.cancelCallback();
  }
  // todo: nice to have:
  // getComment(provider: WebBTCProvider, browser: string, isMobile?: string) {
  //   if (!provider) return null;
  //   const hasExtension = this.getBrowserUrl(provider);
  //   const hasMobile = this.getMobileUrl(provider);
  //   if (isMobile && hasExtension && !hasMobile) return 'Extension Only';
  //   if (!isMobile && !hasExtension && hasMobile) return 'Mobile Only';
  //   if (!isMobile && !browser) return 'Current browser not supported';
  //   return null;
  // }
  getBrowserUrl(t) {
    var e;
    return (e = t.chromeWebStoreUrl) !== null && e !== void 0 ? e : t.mozillaAddOnsUrl;
  }
  getMobileUrl(t) {
    var e;
    return (e = t.iOSAppStoreUrl) !== null && e !== void 0 ? e : t.googlePlayStoreUrl;
  }
  getInstallUrl(t, e, n) {
    var r, s, o, i, c, a, d, h, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (i = (o = t.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Firefox" ? (a = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && a !== void 0 ? a : t.webUrl : n === "Android" ? (h = (d = t.googlePlayStoreUrl) !== null && d !== void 0 ? d : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = G2(), e = V2(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return j("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, j("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), j("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, j("div", { class: "flex flex-col space-y-[10px]" }, j("div", { class: "flex items-center" }, j("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), j("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, j("span", { class: "sr-only" }, "Close popup"), j("img", { src: R2 }))), r ? j("p", null, "Select the wallet you want to connect to.") : j("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && j("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && j("div", { class: "mt-6" }, j("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), j("ul", { class: "space-y-3" }, this.installedProviders.map((o) => j("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, j("div", { class: "aspect-square basis-9 overflow-hidden" }, j("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), j("div", { class: "flex-1" }, j("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && j("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), j("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && j("div", { class: "mt-6" }, r ? j("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : j("div", { class: "mb-5 flex justify-between" }, j("p", { class: "text-sm font-medium" }, "Recommended wallets"), j("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, j("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, j("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), j("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), j("p", null, "What is a wallet? ", j("span", { class: "align-text-bottom text-[9px]" }, "↗")))), j("ul", { class: "space-y-3" }, n.map((o) => j("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, j("div", { class: "aspect-square basis-9 overflow-hidden" }, j("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), j("div", { class: "flex-1" }, j("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && j("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, t, e) && j("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, t, e), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Wu(this);
  }
};
za.style = K2;
const W2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: za
}, Symbol.toStringTag, { value: "Module" }));
