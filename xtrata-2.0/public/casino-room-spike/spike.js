var yh = Object.defineProperty;
var mh = (t, e, n) => e in t ? yh(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var $s = (t, e, n) => mh(t, typeof e != "symbol" ? e + "" : e, n);
const Sh = ["SP", "SM"], Ah = ["ST", "SN"], Mo = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Sh.includes(n) ? "mainnet" : Ah.includes(n) ? "testnet" : null;
}, Eh = () => {
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
}, $h = () => typeof window > "u" || !window.localStorage ? Eh() : window.localStorage, Is = "xtrata.v15.1.wallet.session", nc = "mainnet", Lr = { isConnected: !1 }, Ih = (t) => t.address ? Mo(t.address) ?? t.network : t.network, u0 = (t) => !t.isConnected || !t.address ? { ...Lr } : Ih(t) !== nc ? { ...Lr } : {
  isConnected: !0,
  address: t.address,
  network: nc,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, vh = (t) => {
  if (!t)
    return { ...Lr };
  try {
    const e = JSON.parse(t);
    return u0(e);
  } catch {
    return { ...Lr };
  }
}, Lh = (t) => {
  const e = u0(t);
  return JSON.stringify(e);
}, Mh = (t) => {
  const e = $h();
  return {
    load: () => vh(e.getItem(Is)),
    save: (n) => {
      e.setItem(Is, Lh(n));
    },
    clear: () => {
      e.removeItem(Is);
    }
  };
};
function _h(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function Bh(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${_h(r)}`;
  let o = 2166136261, i = 522970236;
  for (let a = 0; a < s.length; a += 1) {
    const f = s.charCodeAt(a);
    o = Math.imul(o ^ f, 16777619), i = Math.imul(i ^ (f << 5 | f >>> 3), 16777619);
  }
  const c = (a) => (a >>> 0).toString(16).padStart(8, "0");
  return (c(o) + c(i)).slice(0, 16);
}
function h0(t) {
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
function Dh(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const vs = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function Nh(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const o = vs(e[s]);
    o !== void 0 && (n[s] = o);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const o of ["code", "message", "reason"]) {
      const i = vs(r[o]);
      i !== void 0 && (s[o] = i);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = vs(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function Hh(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = h0(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const Ch = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", Uh = 20, rc = "xt_tel_sid";
function Mr() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Ls = null;
function Oh() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(rc);
      return t || (t = Mr(), sessionStorage.setItem(rc, t)), t;
    }
  } catch {
  }
  return Ls || (Ls = Mr()), Ls;
}
let Ze = {
  address: null,
  kind: null
}, d0 = null;
function _o(t, e) {
  if (!t) {
    Ze = { address: null, kind: e ?? Ze.kind };
    return;
  }
  Ze = { address: t.trim(), kind: e ?? Ze.kind };
}
function Bo(t) {
  d0 = typeof t == "string" && t.length > 0 ? t : null;
}
const sc = [];
class kh {
  constructor(e, n) {
    $s(this, "id", Mr());
    $s(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function Ph(t, e) {
  return new kh(t, e);
}
function vn(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? h0(t.error) : void 0, o = t.error != null ? Dh(t.error) : void 0, i = r ? Bh(n, t.step, t.errorCode, s ?? "") : void 0, c = r ? Nh(t.error) : void 0, a = {
      ...c ? { error: c } : {},
      ...t.context ?? {}
    };
    r && sc.length && (a.breadcrumbs = sc.slice(-Uh));
    const f = {
      eventId: Mr(),
      ts: Date.now(),
      sessionId: Oh(),
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
      appVersion: Ch,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Ze.address,
      walletKind: Ze.kind,
      network: d0,
      context: Object.keys(a).length ? a : void 0
    };
  } catch {
  }
}
const jh = "https://browser.blockstack.org/auth", Th = {
  "@type": "Person",
  "@context": "http://schema.org"
}, g0 = ["store_write"], Fh = "blockstack-session", zh = {
  logLevel: "debug"
}, ke = {
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
Object.freeze(ke);
class hn extends Error {
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
class Rh extends hn {
  constructor(e, n = "") {
    super({ code: ke.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class oc extends hn {
  constructor(e = "") {
    super({ code: ke.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Jn extends hn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ke.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ic extends hn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ke.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Gs extends hn {
  constructor(e) {
    super({ code: ke.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class b0 extends hn {
  constructor(e) {
    super({ code: ke.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const cc = ["debug", "info", "warn", "error", "none"], Ks = {};
for (let t = 0; t < cc.length; t++) {
  const e = cc[t];
  Ks[e] = t;
}
class Qe {
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
    return Ks[zh.logLevel] <= Ks[e];
  }
}
function Gh() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Kh() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ms(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Vh() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Wh() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function qh(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Do(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Wh(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    Qe.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = qh(s, t.toString(), n);
    throw Qe.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Yh(t) {
  if (typeof t == "bigint")
    return t;
  if (typeof t == "string")
    return BigInt(t);
  if (typeof t == "number") {
    if (!Number.isInteger(t))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (t > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(t);
  }
  if (ed(t, Uint8Array))
    return BigInt(`0x${xt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Zh(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function No(t, e = 8) {
  return (typeof t == "bigint" ? t : Yh(t)).toString(16).padStart(e * 2, "0");
}
function p0(t, e = 16) {
  const n = No(t, e);
  return ht(n);
}
function Qh(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Xh = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function xt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Xh[n];
  return e;
}
function ht(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Zh(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function jn(t) {
  return new TextEncoder().encode(t);
}
function x0(t) {
  return new TextDecoder().decode(t);
}
function Jh(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function td(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ac(t) {
  if (t.some(td))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Kt(...t) {
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
function dn(t) {
  return Kt(...t.map((e) => typeof e == "number" ? ac([e]) : e instanceof Array ? ac(e) : e));
}
function ed(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const nd = "https://api.mainnet.hiro.so", rd = "https://api.testnet.hiro.so", sd = "http://localhost:3999", od = "https://hub.blockstack.org";
function id(t) {
  const e = typeof t == "string" ? ht(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Wr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const cd = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ad(t, e) {
  const n = {};
  return Object.assign(n, cd, e), await fetch(t, n);
}
function ld(t) {
  let e = ad, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function fd(...t) {
  const { fetchLib: e, middlewares: n } = ld(t);
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
class qr {
  constructor(e = g0.slice(), n = ((c) => (c = Do("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", o = void 0, i = jh) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Vs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ud(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function w0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function hd(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vs(t.outputLen), Vs(t.blockLen);
}
function dd(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gd(t, e) {
  w0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _e = {
  number: Vs,
  bool: ud,
  bytes: w0,
  hash: hd,
  exists: dd,
  output: gd
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _s = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $t = (t, e) => t << 32 - e | t >>> e, bd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!bd)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pd(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ho(t) {
  if (typeof t == "string" && (t = pd(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let y0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pe(t) {
  const e = (r) => t().update(Ho(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let m0 = class extends y0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _e.hash(e);
    const r = Ho(n);
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
    return _e.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    _e.exists(this), _e.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Yr = (t, e, n) => new m0(t, e).update(n).digest();
Yr.create = (t, e) => new m0(t, e);
function xd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
let Co = class extends y0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _s(this.buffer);
  }
  update(e) {
    _e.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ho(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = _s(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _e.exists(this), _e.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    xd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = _s(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], o);
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
const wd = (t, e, n) => t & e ^ ~t & n, yd = (t, e, n) => t & e ^ t & n ^ e & n, md = new Uint32Array([
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
]), Zt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qt = new Uint32Array(64);
let S0 = class extends Co {
  constructor() {
    super(64, 32, 8, !1), this.A = Zt[0] | 0, this.B = Zt[1] | 0, this.C = Zt[2] | 0, this.D = Zt[3] | 0, this.E = Zt[4] | 0, this.F = Zt[5] | 0, this.G = Zt[6] | 0, this.H = Zt[7] | 0;
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
      Qt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Qt[l - 15], d = Qt[l - 2], p = $t(g, 7) ^ $t(g, 18) ^ g >>> 3, w = $t(d, 17) ^ $t(d, 19) ^ d >>> 10;
      Qt[l] = w + Qt[l - 7] + p + Qt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = $t(c, 6) ^ $t(c, 11) ^ $t(c, 25), d = u + g + wd(c, a, f) + md[l] + Qt[l] | 0, w = ($t(r, 2) ^ $t(r, 13) ^ $t(r, 22)) + yd(r, s, o) | 0;
      u = f, f = a, a = c, c = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, o, i, c, a, f, u);
  }
  roundClean() {
    Qt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Sd = class extends S0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const en = Pe(() => new S0());
Pe(() => new Sd());
const Ad = {}, A0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ad
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const K = BigInt(0), Z = BigInt(1), Se = BigInt(2), Mn = BigInt(3), lc = BigInt(8), q = Object.freeze({
  a: K,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Z,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), fc = (t, e) => (t + e / Se) / e, tr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = q, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Z * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), c = fc(o * t, e), a = fc(-r * t, e);
    let f = v(t - c * n - a * s, e), u = v(-c * r - a * o, e);
    const l = f > i, g = u > i;
    if (l && (f = e - f), g && (u = e - u), f > i || u > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: u };
  }
}, Et = 32, De = 32, E0 = 32, _r = Et + 1, Br = 2 * Et + 1;
function uc(t) {
  const { a: e, b: n } = q, r = v(t * t), s = v(r * t);
  return v(s + e * t + n);
}
const er = q.a === K;
class Uo extends Error {
  constructor(e) {
    super(e);
  }
}
function hc(t) {
  if (!(t instanceof W))
    throw new TypeError("JacobianPoint expected");
}
class W {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof V))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(V.ZERO) ? W.ZERO : new W(e.x, e.y, Z);
  }
  static toAffineBatch(e) {
    const n = Ld(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return W.toAffineBatch(e).map(W.fromAffine);
  }
  equals(e) {
    hc(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e, a = v(s * s), f = v(c * c), u = v(n * f), l = v(o * a), g = v(v(r * c) * f), d = v(v(i * s) * a);
    return u === l && g === d;
  }
  negate() {
    return new W(this.x, v(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = v(e * e), o = v(n * n), i = v(o * o), c = e + o, a = v(Se * (v(c * c) - s - i)), f = v(Mn * s), u = v(f * f), l = v(u - Se * a), g = v(f * (a - l) - lc * i), d = v(Se * n * r);
    return new W(l, g, d);
  }
  add(e) {
    hc(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e;
    if (o === K || i === K)
      return this;
    if (n === K || r === K)
      return e;
    const a = v(s * s), f = v(c * c), u = v(n * f), l = v(o * a), g = v(v(r * c) * f), d = v(v(i * s) * a), p = v(l - u), w = v(d - g);
    if (p === K)
      return w === K ? this.double() : W.ZERO;
    const E = v(p * p), L = v(p * E), M = v(u * E), x = v(w * w - L - Se * M), I = v(w * (M - x) - g * L), m = v(s * c * p);
    return new W(x, I, m);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = W.ZERO;
    if (typeof e == "bigint" && e === K)
      return n;
    let r = bc(e);
    if (r === Z)
      return this;
    if (!er) {
      let l = n, g = this;
      for (; r > K; )
        r & Z && (l = l.add(g)), g = g.double(), r >>= Z;
      return l;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: c } = tr.splitScalar(r), a = n, f = n, u = this;
    for (; o > K || c > K; )
      o & Z && (a = a.add(u)), c & Z && (f = f.add(u)), u = u.double(), o >>= Z, c >>= Z;
    return s && (a = a.negate()), i && (f = f.negate()), f = new W(v(f.x * tr.beta), f.y, f.z), a.add(f);
  }
  precomputeWindow(e) {
    const n = er ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(W.BASE) && (n = V.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ws.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = W.normalizeZ(s), Ws.set(n, s)));
    let o = W.ZERO, i = W.BASE;
    const c = 1 + (er ? 128 / r : 256 / r), a = 2 ** (r - 1), f = BigInt(2 ** r - 1), u = 2 ** r, l = BigInt(r);
    for (let g = 0; g < c; g++) {
      const d = g * a;
      let p = Number(e & f);
      e >>= l, p > a && (p -= u, e += Z);
      const w = d, E = d + Math.abs(p) - 1, L = g % 2 !== 0, M = p < 0;
      p === 0 ? i = i.add(nr(L, s[w])) : o = o.add(nr(M, s[E]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = bc(e), s, o;
    if (er) {
      const { k1neg: i, k1: c, k2neg: a, k2: f } = tr.splitScalar(r);
      let { p: u, f: l } = this.wNAF(c, n), { p: g, f: d } = this.wNAF(f, n);
      u = nr(i, u), g = nr(a, g), g = new W(v(g.x * tr.beta), g.y, g.z), s = u.add(g), o = l.add(d);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      s = i, o = c;
    }
    return W.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(W.ZERO);
    e == null && (e = o ? lc : gn(s));
    const i = e, c = v(i * i), a = v(c * i), f = v(n * c), u = v(r * a), l = v(s * i);
    if (o)
      return V.ZERO;
    if (l !== Z)
      throw new Error("invZ was invalid");
    return new V(f, u);
  }
}
W.BASE = new W(q.Gx, q.Gy, Z);
W.ZERO = new W(K, Z, K);
function nr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ws = /* @__PURE__ */ new WeakMap();
class V {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ws.delete(this);
  }
  hasEvenY() {
    return this.y % Se === K;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = gt(n ? e : e.subarray(1));
    if (!Ar(r))
      throw new Error("Point is not on curve");
    const s = uc(r);
    let o = vd(s);
    const i = (o & Z) === Z;
    n ? i && (o = v(-o)) : (e[0] & 1) === 1 !== i && (o = v(-o));
    const c = new V(r, o);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = gt(e.subarray(1, Et + 1)), r = gt(e.subarray(Et + 1, Et * 2 + 1)), s = new V(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Nt(e), r = n.length, s = n[0];
    if (r === Et)
      return this.fromCompressedHex(n);
    if (r === _r && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Br && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${_r} compressed bytes or ${Br} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return V.BASE.multiply(Ne(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = v0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Oo(Nt(e)), { n: c } = q, a = r === 2 || r === 3 ? s + c : s, f = gn(a, c), u = v(-i * f, c), l = v(o * f, c), g = r & 1 ? "03" : "02", d = V.fromHex(g + Ae(a)), p = V.BASE.multiplyAndAddUnsafe(d, u, l);
    if (!p)
      throw new Error("Cannot recover signature: point at infinify");
    return p.assertValidity(), p;
  }
  toRawBytes(e = !1) {
    return Ee(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ae(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ae(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ar(n) || !Ar(r))
      throw new Error(e);
    const s = v(r * r), o = uc(n);
    if (v(s - o) !== K)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new V(this.x, v(-this.y));
  }
  double() {
    return W.fromAffine(this).double().toAffine();
  }
  add(e) {
    return W.fromAffine(this).add(W.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return W.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = W.fromAffine(this), o = n === K || n === Z || this !== V.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = W.fromAffine(e).multiplyUnsafe(r), c = o.add(i);
    return c.equals(W.ZERO) ? void 0 : c.toAffine();
  }
}
V.BASE = new V(q.Gx, q.Gy);
V.ZERO = new V(K, K);
function dc(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function gc(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${nn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gt(n), left: t.subarray(e + 2) };
}
function Ed(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${nn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = gc(t.subarray(2)), { data: r, left: s } = gc(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${nn(s)}`);
  return { r: e, s: r };
}
class Gt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? nn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Gt(Dr(s.slice(0, 64)), Dr(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Ed(n ? e : Ee(e));
    return new Gt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!sn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!sn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = q.n >> Z;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Gt(this.r, v(-this.s, q.n)) : this;
  }
  toDERRawBytes() {
    return Ee(this.toDERHex());
  }
  toDERHex() {
    const e = dc($n(this.s)), n = dc($n(this.r)), r = e.length / 2, s = n.length / 2, o = $n(r), i = $n(s);
    return `30${$n(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ee(this.toCompactHex());
  }
  toCompactHex() {
    return Ae(this.r) + Ae(this.s);
  }
}
function me(...t) {
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
const $d = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += $d[t[n]];
  return e;
}
const Id = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ae(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(K <= t && t < Id))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function rn(t) {
  const e = Ee(Ae(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function $n(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Dr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ee(t) {
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
  return Dr(nn(t));
}
function Nt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ee(t);
}
function bc(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && sn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function v(t, e = q.P) {
  const n = t % e;
  return n >= K ? n : e + n;
}
function bt(t, e) {
  const { P: n } = q;
  let r = t;
  for (; e-- > K; )
    r *= r, r %= n;
  return r;
}
function vd(t) {
  const { P: e } = q, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), c = BigInt(88), a = t * t * t % e, f = a * a * t % e, u = bt(f, Mn) * f % e, l = bt(u, Mn) * f % e, g = bt(l, Se) * a % e, d = bt(g, r) * g % e, p = bt(d, s) * d % e, w = bt(p, i) * p % e, E = bt(w, c) * w % e, L = bt(E, i) * p % e, M = bt(L, Mn) * f % e, x = bt(M, o) * d % e, I = bt(x, n) * a % e, m = bt(I, Se);
  if (m * m % e !== t)
    throw new Error("Cannot find square root");
  return m;
}
function gn(t, e = q.P) {
  if (t === K || e <= K)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = v(t, e), r = e, s = K, o = Z;
  for (; n !== K; ) {
    const c = r / n, a = r % n, f = s - o * c;
    r = n, n = a, s = o, o = f;
  }
  if (r !== Z)
    throw new Error("invert: does not exist");
  return v(s, e);
}
function Ld(t, e = q.P) {
  const n = new Array(t.length), r = t.reduce((o, i, c) => i === K ? o : (n[c] = o, v(o * i, e)), Z), s = gn(r, e);
  return t.reduceRight((o, i, c) => i === K ? o : (n[c] = v(o * n[c], e), v(o * i, e)), s), n;
}
function Md(t) {
  const e = t.length * 8 - De * 8, n = gt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Oo(t, e = !1) {
  const n = Md(t);
  if (e)
    return n;
  const { n: r } = q;
  return n >= r ? n - r : n;
}
let Je, _n;
class $0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return J.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return _n(this.k, ...e);
  }
  checkSync() {
    if (typeof _n != "function")
      throw new Uo("hmacSha256Sync needs to be set");
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
    return me(...n);
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
    return me(...n);
  }
}
function sn(t) {
  return K < t && t < q.n;
}
function Ar(t) {
  return K < t && t < q.P;
}
function I0(t, e, n, r = !0) {
  const { n: s } = q, o = Oo(t, !0);
  if (!sn(o))
    return;
  const i = gn(o, s), c = V.BASE.multiply(o), a = v(c.x, s);
  if (a === K)
    return;
  const f = v(i * v(e + n * a, s), s);
  if (f === K)
    return;
  let u = new Gt(a, f), l = (c.x === u.r ? 0 : 2) | Number(c.y & Z);
  return r && u.hasHighS() && (u = u.normalizeS(), l ^= 1), { sig: u, recovery: l };
}
function Ne(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * De)
      throw new Error("Expected 32 bytes of private key");
    e = Dr(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== De)
      throw new Error("Expected 32 bytes of private key");
    e = gt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!sn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function ko(t) {
  return t instanceof V ? (t.assertValidity(), t) : V.fromHex(t);
}
function v0(t) {
  if (t instanceof Gt)
    return t.assertValidity(), t;
  try {
    return Gt.fromDER(t);
  } catch {
    return Gt.fromCompact(t);
  }
}
function Po(t, e = !1) {
  return V.fromPrivateKey(t).toRawBytes(e);
}
function _d(t, e, n, r = !1) {
  return V.fromSignature(t, e, n).toRawBytes(r);
}
function pc(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === _r || r === Br : n ? r === _r * 2 || r === Br * 2 : t instanceof V;
}
function jo(t, e, n = !1) {
  if (pc(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!pc(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ko(e);
  return r.assertValidity(), r.multiply(Ne(t)).toRawBytes(n);
}
function L0(t) {
  const e = t.length > Et ? t.slice(0, Et) : t;
  return gt(e);
}
function Bd(t) {
  const e = L0(t), n = v(e, q.n);
  return M0(n < K ? e : n);
}
function M0(t) {
  return rn(t);
}
function _0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Nt(t), s = Ne(e), o = [M0(s), Bd(r)];
  if (n != null) {
    n === !0 && (n = J.randomBytes(Et));
    const a = Nt(n);
    if (a.length !== Et)
      throw new Error(`sign: Expected ${Et} bytes of extra data`);
    o.push(a);
  }
  const i = me(...o), c = L0(r);
  return { seed: i, m: c, d: s };
}
function B0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Dd(t, e, n = {}) {
  const { seed: r, m: s, d: o } = _0(t, e, n.extraEntropy), i = new $0(E0, De);
  await i.reseed(r);
  let c;
  for (; !(c = I0(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return B0(c, n);
}
function D0(t, e, n = {}) {
  const { seed: r, m: s, d: o } = _0(t, e, n.extraEntropy), i = new $0(E0, De);
  i.reseedSync(r);
  let c;
  for (; !(c = I0(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return B0(c, n);
}
const Nd = { strict: !0 };
function Hd(t, e, n, r = Nd) {
  let s;
  try {
    s = v0(t), e = Nt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = Oo(e);
  let a;
  try {
    a = ko(n);
  } catch {
    return !1;
  }
  const { n: f } = q, u = gn(i, f), l = v(c * u, f), g = v(o * u, f), d = V.BASE.multiplyAndAddUnsafe(a, l, g);
  return d ? v(d.x, f) === o : !1;
}
function Nr(t) {
  return v(gt(t), q.n);
}
class on {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Nt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gt(n.subarray(0, 32)), s = gt(n.subarray(32, 64));
    return new on(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ar(e) || !sn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ae(this.r) + Ae(this.s);
  }
  toRawBytes() {
    return Ee(this.toHex());
  }
}
function Cd(t) {
  return V.fromPrivateKey(t).toRawX();
}
class N0 {
  constructor(e, n, r = J.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Nt(e);
    const { x: s, scalar: o } = this.getScalar(Ne(n));
    if (this.px = s, this.d = o, this.rand = Nt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = V.fromPrivateKey(e), r = n.hasEvenY() ? e : q.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return rn(e ^ gt(n));
  }
  finalizeNonce(e) {
    const n = v(gt(e), q.n);
    if (n === K)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new on(e.x, v(n + r * s, q.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = J.taggedHash, i = this.initNonce(n, await o(ye.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(await o(ye.nonce, i, r, e)), u = Nr(await o(ye.challenge, a, r, e)), l = this.finalizeSig(c, f, u, n);
    return await U0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = J.taggedHashSync, i = this.initNonce(n, o(ye.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(o(ye.nonce, i, r, e)), u = Nr(o(ye.challenge, a, r, e)), l = this.finalizeSig(c, f, u, n);
    return O0(l, e, r) || this.error(), l;
  }
}
async function Ud(t, e, n) {
  return new N0(t, e, n).calc();
}
function Od(t, e, n) {
  return new N0(t, e, n).calcSync();
}
function H0(t, e, n) {
  const r = t instanceof on, s = r ? t : on.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Nt(e),
    P: ko(n)
  };
}
function C0(t, e, n, r) {
  const s = V.BASE.multiplyAndAddUnsafe(e, Ne(n), v(-r, q.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function U0(t, e, n) {
  try {
    const { r, s, m: o, P: i } = H0(t, e, n), c = Nr(await J.taggedHash(ye.challenge, rn(r), i.toRawX(), o));
    return C0(r, i, s, c);
  } catch {
    return !1;
  }
}
function O0(t, e, n) {
  try {
    const { r, s, m: o, P: i } = H0(t, e, n), c = Nr(J.taggedHashSync(ye.challenge, rn(r), i.toRawX(), o));
    return C0(r, i, s, c);
  } catch (r) {
    if (r instanceof Uo)
      throw r;
    return !1;
  }
}
const kd = {
  Signature: on,
  getPublicKey: Cd,
  sign: Ud,
  verify: U0,
  signSync: Od,
  verifySync: O0
};
V.BASE._setWindowSize(8);
const ft = {
  node: A0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ye = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, rr = {}, J = {
  bytesToHex: nn,
  hexToBytes: Ee,
  concatBytes: me,
  mod: v,
  invert: gn,
  isValidPrivateKey(t) {
    try {
      return Ne(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: rn,
  _normalizePrivateKey: Ne,
  hashToPrivateKey: (t) => {
    t = Nt(t);
    const e = De + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = v(gt(t), q.n - Z) + Z;
    return rn(n);
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
  randomPrivateKey: () => J.hashToPrivateKey(J.randomBytes(De + 8)),
  precompute(t = 8, e = V.BASE) {
    const n = e === V.BASE ? e : new V(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Mn), n;
  },
  sha256: async (...t) => {
    if (ft.web) {
      const e = await ft.web.subtle.digest("SHA-256", me(...t));
      return new Uint8Array(e);
    } else if (ft.node) {
      const { createHash: e } = ft.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ft.web) {
      const n = await ft.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = me(...e), s = await ft.web.subtle.sign("HMAC", n, r);
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
    let n = rr[t];
    if (n === void 0) {
      const r = await J.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = me(r, r), rr[t] = n;
    }
    return J.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Je != "function")
      throw new Uo("sha256Sync is undefined, you need to set it");
    let n = rr[t];
    if (n === void 0) {
      const r = Je(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = me(r, r), rr[t] = n;
    }
    return Je(n, ...e);
  },
  _JacobianPoint: W
};
Object.defineProperties(J, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Je;
    },
    set(t) {
      Je || (Je = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return _n;
    },
    set(t) {
      _n || (_n = t);
    }
  }
});
const Pd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: q,
  Point: V,
  Signature: Gt,
  getPublicKey: Po,
  getSharedSecret: jo,
  recoverPublicKey: _d,
  schnorr: kd,
  sign: Dd,
  signSync: D0,
  utils: J,
  verify: Hd
}, Symbol.toStringTag, { value: "Module" }));
var ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function jd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Tn(t) {
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
var Fn = {};
Fn.byteLength = Gd;
var Td = Fn.toByteArray = Vd, Fd = Fn.fromByteArray = Yd, _t = [], pt = [], zd = typeof Uint8Array < "u" ? Uint8Array : Array, Bs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var qe = 0, Rd = Bs.length; qe < Rd; ++qe)
  _t[qe] = Bs[qe], pt[Bs.charCodeAt(qe)] = qe;
pt[45] = 62;
pt[95] = 63;
function k0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Gd(t) {
  var e = k0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Kd(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Vd(t) {
  var e, n = k0(t), r = n[0], s = n[1], o = new zd(Kd(t, r, s)), i = 0, c = s > 0 ? r - 4 : r, a;
  for (a = 0; a < c; a += 4)
    e = pt[t.charCodeAt(a)] << 18 | pt[t.charCodeAt(a + 1)] << 12 | pt[t.charCodeAt(a + 2)] << 6 | pt[t.charCodeAt(a + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = pt[t.charCodeAt(a)] << 2 | pt[t.charCodeAt(a + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = pt[t.charCodeAt(a)] << 10 | pt[t.charCodeAt(a + 1)] << 4 | pt[t.charCodeAt(a + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function Wd(t) {
  return _t[t >> 18 & 63] + _t[t >> 12 & 63] + _t[t >> 6 & 63] + _t[t & 63];
}
function qd(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(Wd(r));
  return s.join("");
}
function Yd(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, c = n - r; i < c; i += o)
    s.push(qd(t, i, i + o > c ? c : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    _t[e >> 2] + _t[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    _t[e >> 10] + _t[e >> 4 & 63] + _t[e << 2 & 63] + "="
  )), s.join("");
}
function Zd() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Qd = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Xd() {
  if (Zd())
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
    throw new Error(Qd);
  }
}
class Jd {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(Kt(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(Kt(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class t1 {
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
async function P0() {
  const t = await Xd();
  return t.name === "subtleCrypto" ? new t1(t.lib) : new Jd(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function e1(t) {
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
  var i = t.length, c = t.charAt(0), a = Math.log(i) / Math.log(256), f = Math.log(256) / Math.log(i);
  function u(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var p = 0, w = 0, E = 0, L = d.length; E !== L && d[E] === 0; )
      E++, p++;
    for (var M = (L - E) * f + 1 >>> 0, x = new Uint8Array(M); E !== L; ) {
      for (var I = d[E], m = 0, H = M - 1; (I !== 0 || m < w) && H !== -1; H--, m++)
        I += 256 * x[H] >>> 0, x[H] = I % i >>> 0, I = I / i >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      w = m, E++;
    }
    for (var O = M - w; O !== M && x[O] === 0; )
      O++;
    for (var B = c.repeat(p); O < M; ++O)
      B += t.charAt(x[O]);
    return B;
  }
  function l(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var p = 0, w = 0, E = 0; d[p] === c; )
      w++, p++;
    for (var L = (d.length - p) * a + 1 >>> 0, M = new Uint8Array(L); d[p]; ) {
      var x = d.charCodeAt(p);
      if (x > 255)
        return;
      var I = e[x];
      if (I === 255)
        return;
      for (var m = 0, H = L - 1; (I !== 0 || m < E) && H !== -1; H--, m++)
        I += i * M[H] >>> 0, M[H] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      E = m, p++;
    }
    for (var O = L - E; O !== L && M[O] === 0; )
      O++;
    for (var B = new Uint8Array(w + (L - O)), D = w; O !== L; )
      B[D++] = M[O++];
    return B;
  }
  function g(d) {
    var p = l(d);
    if (p)
      return p;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: u,
    decodeUnsafe: l,
    decode: g
  };
}
var j0 = e1;
const n1 = j0, r1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var s1 = n1(r1);
const o1 = /* @__PURE__ */ jd(s1), i1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), T0 = Uint8Array.from({ length: 16 }, (t, e) => e), c1 = T0.map((t) => (9 * t + 5) % 16);
let To = [T0], Fo = [c1];
for (let t = 0; t < 4; t++)
  for (let e of [To, Fo])
    e.push(e[t].map((n) => i1[n]));
const F0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), a1 = To.map((t, e) => t.map((n) => F0[e][n])), l1 = Fo.map((t, e) => t.map((n) => F0[e][n])), f1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), u1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sr = (t, e) => t << e | t >>> 32 - e;
function xc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const or = new Uint32Array(16);
let h1 = class extends Co {
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
    for (let d = 0; d < 16; d++, n += 4)
      or[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = f1[d], E = u1[d], L = To[d], M = Fo[d], x = a1[d], I = l1[d];
      for (let m = 0; m < 16; m++) {
        const H = sr(r + xc(d, o, c, f) + or[L[m]] + w, x[m]) + l | 0;
        r = l, l = f, f = sr(c, 10) | 0, c = o, o = H;
      }
      for (let m = 0; m < 16; m++) {
        const H = sr(s + xc(p, i, a, u) + or[M[m]] + E, I[m]) + g | 0;
        s = g, g = u, u = sr(a, 10) | 0, a = i, i = H;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    or.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const d1 = Pe(() => new h1());
function g1(t) {
  return d1(t);
}
const ir = BigInt(2 ** 32 - 1), qs = BigInt(32);
function z0(t, e = !1) {
  return e ? { h: Number(t & ir), l: Number(t >> qs & ir) } : { h: Number(t >> qs & ir) | 0, l: Number(t & ir) | 0 };
}
function b1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = z0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const p1 = (t, e) => BigInt(t >>> 0) << qs | BigInt(e >>> 0), x1 = (t, e, n) => t >>> n, w1 = (t, e, n) => t << 32 - n | e >>> n, y1 = (t, e, n) => t >>> n | e << 32 - n, m1 = (t, e, n) => t << 32 - n | e >>> n, S1 = (t, e, n) => t << 64 - n | e >>> n - 32, A1 = (t, e, n) => t >>> n - 32 | e << 64 - n, E1 = (t, e) => e, $1 = (t, e) => t, I1 = (t, e, n) => t << n | e >>> 32 - n, v1 = (t, e, n) => e << n | t >>> 32 - n, L1 = (t, e, n) => e << n - 32 | t >>> 64 - n, M1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const B1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), D1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, N1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), H1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, C1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), U1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, P = {
  fromBig: z0,
  split: b1,
  toBig: p1,
  shrSH: x1,
  shrSL: w1,
  rotrSH: y1,
  rotrSL: m1,
  rotrBH: S1,
  rotrBL: A1,
  rotr32H: E1,
  rotr32L: $1,
  rotlSH: I1,
  rotlSL: v1,
  rotlBH: L1,
  rotlBL: M1,
  add: _1,
  add3L: B1,
  add3H: D1,
  add4L: N1,
  add4H: H1,
  add5H: U1,
  add5L: C1
}, [O1, k1] = P.split([
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
].map((t) => BigInt(t))), Xt = new Uint32Array(80), Jt = new Uint32Array(80);
let Zr = class extends Co {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Xt[x] = e.getUint32(n), Jt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Xt[x - 15] | 0, m = Jt[x - 15] | 0, H = P.rotrSH(I, m, 1) ^ P.rotrSH(I, m, 8) ^ P.shrSH(I, m, 7), O = P.rotrSL(I, m, 1) ^ P.rotrSL(I, m, 8) ^ P.shrSL(I, m, 7), B = Xt[x - 2] | 0, D = Jt[x - 2] | 0, b = P.rotrSH(B, D, 19) ^ P.rotrBH(B, D, 61) ^ P.shrSH(B, D, 6), S = P.rotrSL(B, D, 19) ^ P.rotrBL(B, D, 61) ^ P.shrSL(B, D, 6), _ = P.add4L(O, S, Jt[x - 7], Jt[x - 16]), U = P.add4H(_, H, b, Xt[x - 7], Xt[x - 16]);
      Xt[x] = U | 0, Jt[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = P.rotrSH(l, g, 14) ^ P.rotrSH(l, g, 18) ^ P.rotrBH(l, g, 41), m = P.rotrSL(l, g, 14) ^ P.rotrSL(l, g, 18) ^ P.rotrBL(l, g, 41), H = l & d ^ ~l & w, O = g & p ^ ~g & E, B = P.add5L(M, m, O, k1[x], Jt[x]), D = P.add5H(B, L, I, H, O1[x], Xt[x]), b = B | 0, S = P.rotrSH(r, s, 28) ^ P.rotrBH(r, s, 34) ^ P.rotrBH(r, s, 39), _ = P.rotrSL(r, s, 28) ^ P.rotrBL(r, s, 34) ^ P.rotrBL(r, s, 39), U = r & o ^ r & c ^ o & c, R = s & i ^ s & a ^ i & a;
      L = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = P.add(f | 0, u | 0, D | 0, b | 0), f = c | 0, u = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const C = P.add3L(b, _, R);
      r = P.add3H(C, D, S, U), s = C | 0;
    }
    ({ h: r, l: s } = P.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = P.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = P.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = P.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = P.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = P.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = P.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: L, l: M } = P.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, f, u, l, g, d, p, w, E, L, M);
  }
  roundClean() {
    Xt.fill(0), Jt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, P1 = class extends Zr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, j1 = class extends Zr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, T1 = class extends Zr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const F1 = Pe(() => new Zr());
Pe(() => new P1());
Pe(() => new j1());
Pe(() => new T1());
function R0(t) {
  return en(t);
}
function z1(t) {
  return F1(t);
}
const R1 = 0;
J.hmacSha256Sync = (t, ...e) => {
  const n = Yr.create(en, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function G1() {
  return xt(J.randomPrivateKey());
}
function K1(t) {
  const e = en(en(t));
  return o1.encode(Kt(t, e).slice(0, t.length + 4));
}
function V1(t, e) {
  return K1(Kt(new Uint8Array([t]), e.slice(0, 20)));
}
function G0(t, e = R1) {
  const n = typeof t == "string" ? ht(t) : t, r = g1(R0(n));
  return V1(e, r);
}
function K0(t) {
  const e = id(t);
  return xt(Po(e.slice(0, 32), !0));
}
J.hmacSha256Sync = (t, ...e) => {
  const n = Yr.create(en, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Hr;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Hr || (Hr = {}));
async function W1(t, e, n) {
  return await (await P0()).encrypt("aes-256-cbc", e, t, n);
}
async function q1(t, e, n) {
  return await (await P0()).decrypt("aes-256-cbc", e, t, n);
}
function V0(t, e) {
  return Yr(en, t, e);
}
function Y1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function W0(t) {
  const e = z1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Z1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Q1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Hr.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Hr.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Z1(t))
    return e;
  try {
    return V.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function X1(t, e, n, r) {
  const s = Q1(t);
  if (!s.result)
    throw s;
  const o = J.randomPrivateKey(), i = Po(o, !0);
  let c = jo(o, t, !0);
  c = c.slice(1);
  const a = W0(c), f = J.randomBytes(16), u = await W1(f, a.encryptionKey, e), l = Kt(f, i, u), g = V0(a.hmacKey, l);
  let d;
  if (!r || r === "hex")
    d = xt(u);
  else if (r === "base64")
    d = Fd(u);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const p = {
    iv: xt(f),
    ephemeralPK: xt(i),
    cipherText: d,
    mac: xt(g),
    wasString: n
  };
  return r && r !== "hex" && (p.cipherTextEncoding = r), p;
}
async function q0(t, e) {
  if (!e.ephemeralPK)
    throw new ic("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = jo(t, n, !0);
  r = r.slice(1);
  const s = W0(r), o = ht(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = ht(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Td(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Kt(o, ht(n), i), a = V0(s.hmacKey, c), f = ht(e.mac);
  if (!Y1(f, a))
    throw new ic("Decryption failed: failure in MAC check");
  const u = await q1(o, s.encryptionKey, i);
  return e.wasString ? x0(u) : u;
}
function J1(t, e) {
  const n = typeof e == "string" ? jn(e) : e, r = K0(t), s = R0(n), o = D0(s, t);
  return {
    signature: xt(o),
    publicKey: r
  };
}
async function tg(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = K0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? jn(t) : t, i = await X1(n.publicKey, o, s, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const a = J1(r, c), f = {
      signature: a.signature,
      publicKey: a.publicKey,
      cipherText: c
    };
    c = JSON.stringify(f);
  }
  return c;
}
function eg(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return q0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ot = {}, cn = {}, it = {};
Object.defineProperty(it, "__esModule", { value: !0 });
it.decode = it.encode = it.unescape = it.escape = it.pad = void 0;
const Y0 = Fn;
function zo(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
it.pad = zo;
function Z0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
it.escape = Z0;
function Q0(t) {
  return zo(t).replace(/-/g, "+").replace(/_/g, "/");
}
it.unescape = Q0;
function ng(t) {
  return Z0((0, Y0.fromByteArray)(new TextEncoder().encode(t)));
}
it.encode = ng;
function rg(t) {
  return new TextDecoder().decode((0, Y0.toByteArray)(zo(Q0(t))));
}
it.decode = rg;
var Qr = {}, Xr = {};
const Ye = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function X0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ys(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ie(t, ...e) {
  if (!X0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function J0(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ys(t.outputLen), Ys(t.blockLen);
}
function Nn(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function tl(t, e) {
  Ie(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function sg(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function og(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Hn(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Er(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function wt(t, e) {
  return t << 32 - e | t >>> e;
}
function ig(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Ro = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Go(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const el = Ro ? (t) => t : (t) => Go(t), cg = el;
function nl(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Go(t[e]);
  return t;
}
const ag = Ro ? (t) => t : nl, rl = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", lg = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function fg(t) {
  if (Ie(t), rl)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += lg[t[n]];
  return e;
}
const Tt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function wc(t) {
  if (t >= Tt._0 && t <= Tt._9)
    return t - Tt._0;
  if (t >= Tt.A && t <= Tt.F)
    return t - (Tt.A - 10);
  if (t >= Tt.a && t <= Tt.f)
    return t - (Tt.a - 10);
}
function ug(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (rl)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = wc(t.charCodeAt(o)), c = wc(t.charCodeAt(o + 1));
    if (i === void 0 || c === void 0) {
      const a = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + o);
    }
    r[s] = i * 16 + c;
  }
  return r;
}
const sl = async () => {
};
async function hg(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await sl(), r += o);
  }
}
function Ko(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function dg(t) {
  return new TextDecoder().decode(t);
}
function bn(t) {
  return typeof t == "string" && (t = Ko(t)), Ie(t), t;
}
function gg(t) {
  return typeof t == "string" && (t = Ko(t)), Ie(t), t;
}
function bg(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ie(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function pg(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Vo = class {
};
function Jr(t) {
  const e = (r) => t().update(bn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ol(t) {
  const e = (r, s) => t(s).update(bn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function il(t) {
  const e = (r, s) => t(s).update(bn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const xg = Jr, wg = ol, yg = il;
function mg(t = 32) {
  if (Ye && typeof Ye.getRandomValues == "function")
    return Ye.getRandomValues(new Uint8Array(t));
  if (Ye && typeof Ye.randomBytes == "function")
    return Uint8Array.from(Ye.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Sg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Vo,
  abytes: Ie,
  aexists: Nn,
  ahash: J0,
  anumber: Ys,
  aoutput: tl,
  asyncLoop: hg,
  byteSwap: Go,
  byteSwap32: nl,
  byteSwapIfBE: cg,
  bytesToHex: fg,
  bytesToUtf8: dg,
  checkOpts: pg,
  clean: Hn,
  concatBytes: bg,
  createHasher: Jr,
  createOptHasher: ol,
  createView: Er,
  createXOFer: il,
  hexToBytes: ug,
  isBytes: X0,
  isLE: Ro,
  kdfInputToBytes: gg,
  nextTick: sl,
  randomBytes: mg,
  rotl: ig,
  rotr: wt,
  swap32IfBE: ag,
  swap8IfBE: el,
  toBytes: bn,
  u32: og,
  u8: sg,
  utf8ToBytes: Ko,
  wrapConstructor: xg,
  wrapConstructorWithOpts: wg,
  wrapXOFConstructorWithOpts: yg
}, Symbol.toStringTag, { value: "Module" }));
let Wo = class extends Vo {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, J0(e);
    const r = bn(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), Hn(o);
  }
  update(e) {
    return Nn(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Nn(this), Ie(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const cl = (t, e, n) => new Wo(t, e).update(n).digest();
cl.create = (t, e) => new Wo(t, e);
const Ag = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Wo,
  hmac: cl
}, Symbol.toStringTag, { value: "Module" })), Eg = /* @__PURE__ */ Tn(Ag);
function $g(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
function Ig(t, e, n) {
  return t & e ^ ~t & n;
}
function vg(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Lg extends Vo {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Er(this.buffer);
  }
  update(e) {
    Nn(this), e = bn(e), Ie(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Er(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Nn(this), tl(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Hn(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    $g(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Er(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], o);
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
const te = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ee = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Mg = /* @__PURE__ */ Uint32Array.from([
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
]), ne = /* @__PURE__ */ new Uint32Array(64);
let qo = class extends Lg {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = te[0] | 0, this.B = te[1] | 0, this.C = te[2] | 0, this.D = te[3] | 0, this.E = te[4] | 0, this.F = te[5] | 0, this.G = te[6] | 0, this.H = te[7] | 0;
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
      ne[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ne[l - 15], d = ne[l - 2], p = wt(g, 7) ^ wt(g, 18) ^ g >>> 3, w = wt(d, 17) ^ wt(d, 19) ^ d >>> 10;
      ne[l] = w + ne[l - 7] + p + ne[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = wt(c, 6) ^ wt(c, 11) ^ wt(c, 25), d = u + g + Ig(c, a, f) + Mg[l] + ne[l] | 0, w = (wt(r, 2) ^ wt(r, 13) ^ wt(r, 22)) + vg(r, s, o) | 0;
      u = f, f = a, a = c, c = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, o, i, c, a, f, u);
  }
  roundClean() {
    Hn(ne);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Hn(this.buffer);
  }
}, al = class extends qo {
  constructor() {
    super(28), this.A = ee[0] | 0, this.B = ee[1] | 0, this.C = ee[2] | 0, this.D = ee[3] | 0, this.E = ee[4] | 0, this.F = ee[5] | 0, this.G = ee[6] | 0, this.H = ee[7] | 0;
  }
};
const _g = /* @__PURE__ */ Jr(() => new qo()), Bg = /* @__PURE__ */ Jr(() => new al()), Dg = qo, Ng = _g, Hg = al, Cg = Bg, Ug = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Hg,
  SHA256: Dg,
  sha224: Cg,
  sha256: Ng
}, Symbol.toStringTag, { value: "Module" })), ts = /* @__PURE__ */ Tn(Ug), Og = /* @__PURE__ */ Tn(Pd);
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.joseToDer = an.derToJose = void 0;
const ll = Fn, fl = it;
function Ds(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const kg = {
  ES256: Ds(256),
  ES384: Ds(384),
  ES512: Ds(521)
};
function ul(t) {
  const e = kg[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Cr = 128, hl = 0, Pg = 32, jg = 16, Tg = 2, dl = jg | Pg | hl << 6, Ur = Tg | hl << 6;
function gl(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, ll.toByteArray)((0, fl.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Fg(t, e) {
  const n = gl(t), r = ul(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== dl)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (Cr | 1) && (c = n[i++]), o - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${o - i}" remaining`);
  if (n[i++] !== Ur)
    throw new Error('Could not find expected "int" for "r"');
  const a = n[i++];
  if (o - i - 2 < a)
    throw new Error(`"r" specified length of "${a}", only "${o - i - 2}" available`);
  if (s < a)
    throw new Error(`"r" specified length of "${a}", max of "${s}" is acceptable`);
  const f = i;
  if (i += a, n[i++] !== Ur)
    throw new Error('Could not find expected "int" for "s"');
  const u = n[i++];
  if (o - i !== u)
    throw new Error(`"s" specified length of "${u}", expected "${o - i}"`);
  if (s < u)
    throw new Error(`"s" specified length of "${u}", max of "${s}" is acceptable`);
  const l = i;
  if (i += u, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const g = r - a, d = r - u, p = new Uint8Array(g + a + d + u);
  for (i = 0; i < g; ++i)
    p[i] = 0;
  p.set(n.subarray(f + Math.max(-g, 0), f + a), i), i = r;
  for (const w = i; i < w + d; ++i)
    p[i] = 0;
  return p.set(n.subarray(l + Math.max(-d, 0), l + u), i), (0, fl.escape)((0, ll.fromByteArray)(p));
}
an.derToJose = Fg;
function yc(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Cr && --r, r;
}
function zg(t, e) {
  t = gl(t);
  const n = ul(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = yc(t, 0, n), o = yc(t, n, t.length), i = n - s, c = n - o, a = 2 + i + 1 + 1 + c, f = a < Cr, u = new Uint8Array((f ? 2 : 3) + a);
  let l = 0;
  return u[l++] = dl, f ? u[l++] = a : (u[l++] = Cr | 1, u[l++] = a & 255), u[l++] = Ur, u[l++] = i, s < 0 ? (u[l++] = 0, u.set(t.subarray(0, n), l), l += n) : (u.set(t.subarray(s, n), l), l += n - s), u[l++] = Ur, u[l++] = c, o < 0 ? (u[l++] = 0, u.set(t.subarray(n), l)) : u.set(t.subarray(n + o), l), u;
}
an.joseToDer = zg;
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.InvalidTokenError = Vt.MissingParametersError = void 0;
class Rg extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Vt.MissingParametersError = Rg;
class Gg extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Vt.InvalidTokenError = Gg;
const zn = /* @__PURE__ */ Tn(Sg);
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.SECP256K1Client = void 0;
const Kg = Eg, Vg = ts, $r = Og, mc = an, Sc = Vt, Ac = zn;
$r.utils.hmacSha256Sync = (t, ...e) => {
  const n = Kg.hmac.create(Vg.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class bl {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ac.bytesToHex)($r.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Sc.MissingParametersError("a signing input hash and private key are all required");
    const s = $r.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ac.bytesToHex)(s);
    if (r === "jose")
      return (0, mc.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, mc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Sc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return $r.verify(n, e, r, { strict: !1 });
  }
}
Xr.SECP256K1Client = bl;
bl.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Xr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Qr);
var He = {};
const Wg = /* @__PURE__ */ Tn(A0);
var qg = ct && ct.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(u) {
      try {
        f(r.next(u));
      } catch (l) {
        i(l);
      }
    }
    function a(u) {
      try {
        f(r.throw(u));
      } catch (l) {
        i(l);
      }
    }
    function f(u) {
      u.done ? o(u.value) : s(u.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(He, "__esModule", { value: !0 });
He.hashSha256Async = He.hashSha256 = void 0;
const Yg = ts;
function pl(t) {
  return (0, Yg.sha256)(t);
}
He.hashSha256 = pl;
function Zg(t) {
  return qg(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Wg;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(pl(t));
    }
  });
}
He.hashSha256Async = Zg;
var Qg = ct && ct.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(u) {
      try {
        f(r.next(u));
      } catch (l) {
        i(l);
      }
    }
    function a(u) {
      try {
        f(r.throw(u));
      } catch (l) {
        i(l);
      }
    }
    function f(u) {
      u.done ? o(u.value) : s(u.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.TokenSigner = cn.createUnsecuredToken = void 0;
const Zs = it, Ec = Qr, Xg = Vt, $c = He;
function Qs(t, e) {
  const n = [], r = Zs.encode(JSON.stringify(e));
  n.push(r);
  const s = Zs.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Jg(t) {
  return Qs(t, { typ: "JWT", alg: "none" }) + ".";
}
cn.createUnsecuredToken = Jg;
class t2 {
  constructor(e, n) {
    if (!(e && n))
      throw new Xg.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Ec.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Ec.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Qs(e, s), i = (0, $c.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Qg(this, void 0, void 0, function* () {
      const s = this.header(r), o = Qs(e, s), i = yield (0, $c.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Zs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
cn.TokenSigner = t2;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
es.TokenVerifier = void 0;
const e2 = it, Ic = Qr, n2 = Vt, cr = He;
class r2 {
  constructor(e, n) {
    if (!(e && n))
      throw new n2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ic.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ic.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, cr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, cr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), e2.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((c) => {
      const a = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, a, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, cr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, cr.hashSha256)(r);
      return o(i);
    }
  }
}
es.TokenVerifier = r2;
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
ns.decodeToken = void 0;
const ar = it;
function s2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ar.decode(e[0])), r = JSON.parse(ar.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ar.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ar.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ns.decodeToken = s2;
(function(t) {
  var e = ct && ct.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var c = Object.getOwnPropertyDescriptor(s, o);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, c);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = ct && ct.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(cn, t), n(es, t), n(ns, t), n(Vt, t), n(Qr, t);
})(ot);
function o2(t) {
  return `did:btc-addr:${t}`;
}
function i2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new oc("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new oc('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function xl(t) {
  if (t)
    return i2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const c2 = "1.4.0";
function a2() {
  return G1();
}
function l2(t, e, n, r = g0.slice(), s, o = Gh().getTime(), i = {}) {
  const c = (d) => {
    const p = Do("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return p == null ? void 0 : p.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const a = Object.assign({}, i, {
    jti: Vh(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: c2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = ot.SECP256K1Client.derivePublicKey(t);
  a.public_keys = [f];
  const u = G0(f);
  return a.iss = o2(u), new ot.TokenSigner("ES256k", t).sign(a);
}
async function vc(t, e) {
  const n = x0(ht(e)), r = JSON.parse(n), s = await q0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function f2(t) {
  const e = ot.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ot.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function u2(t) {
  const e = ot.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = xl(e.iss);
  if (n.length === 1) {
    if (G0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function h2(t) {
  const e = ot.decodeToken(t).payload;
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
function d2(t) {
  const e = ot.decodeToken(t).payload;
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
function g2(t) {
  const e = [
    d2(t),
    h2(t),
    f2(t),
    u2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Lc = "1.0.0";
class $e {
  constructor(e) {
    this.version = Lc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Lc)
      throw new Gs(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new $e(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class wl {
  constructor(e) {
    if (e) {
      const n = new $e(e);
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
class Mc extends wl {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new $e({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new b0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new $e({})), !0;
  }
}
class _c extends wl {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Fh, !localStorage.getItem(this.key)) {
      const r = new $e({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new b0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return $e.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new $e({})), !0;
  }
}
var Cn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Cn || (Cn = {}));
var Or;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Or || (Or = {}));
Cn.Mainnet;
var zt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zt || (zt = {}));
var Bt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Bt || (Bt = {}));
zt.Mainnet;
const yl = {
  chainId: Cn.Mainnet,
  transactionVersion: zt.Mainnet,
  peerNetworkId: Or.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Bt.MainnetSingleSig,
    multiSig: Bt.MainnetMultiSig
  },
  client: { baseUrl: nd }
}, Xs = {
  chainId: Cn.Testnet,
  transactionVersion: zt.Testnet,
  peerNetworkId: Or.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Bt.TestnetSingleSig,
    multiSig: Bt.TestnetMultiSig
  },
  client: { baseUrl: rd }
}, Ir = {
  ...Xs,
  addressVersion: { ...Xs.addressVersion },
  magicBytes: "id",
  client: { baseUrl: sd }
}, b2 = {
  ...Ir,
  addressVersion: { ...Ir.addressVersion },
  client: { ...Ir.client }
};
function p2(t) {
  switch (t) {
    case "mainnet":
      return yl;
    case "testnet":
      return Xs;
    case "devnet":
      return Ir;
    case "mocknet":
      return b2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function ml(t) {
  return typeof t == "string" ? p2(t) : t;
}
var Bc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Bc || (Bc = {}));
var Dc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Dc || (Dc = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const Ns = ["onChainOnly", "offChainOnly", "any"];
Ns[0] + "", yt.OnChainOnly, Ns[1] + "", yt.OffChainOnly, Ns[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var Nc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Nc || (Nc = {}));
var Hc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Hc || (Hc = {}));
var Cc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Cc || (Cc = {}));
var Ft;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ft || (Ft = {}));
var Uc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Oc || (Oc = {}));
var kc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Pc || (Pc = {}));
var jc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(jc || (jc = {}));
var Tc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Fc || (Fc = {}));
var zc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zc || (zc = {}));
var Rc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Rc || (Rc = {}));
function Js(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function x2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Sl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function w2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Js(t.outputLen), Js(t.blockLen);
}
function y2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function m2(t, e) {
  Sl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Be = {
  number: Js,
  bool: x2,
  bytes: Sl,
  hash: w2,
  exists: y2,
  output: m2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), It = (t, e) => t << 32 - e | t >>> e, S2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!S2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function A2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yo(t) {
  if (typeof t == "string" && (t = A2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Al = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function je(t) {
  const e = (r) => t().update(Yo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class El extends Al {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Be.hash(e);
    const r = Yo(n);
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
    return Be.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Be.exists(this), Be.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const $l = (t, e, n) => new El(t, e).update(n).digest();
$l.create = (t, e) => new El(t, e);
function E2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
let Zo = class extends Al {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hs(this.buffer);
  }
  update(e) {
    Be.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yo(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Hs(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Be.exists(this), Be.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    E2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Hs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], o);
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
const $2 = (t, e, n) => t & e ^ ~t & n, I2 = (t, e, n) => t & e ^ t & n ^ e & n, v2 = new Uint32Array([
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
]), re = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), se = new Uint32Array(64);
let Il = class extends Zo {
  constructor() {
    super(64, 32, 8, !1), this.A = re[0] | 0, this.B = re[1] | 0, this.C = re[2] | 0, this.D = re[3] | 0, this.E = re[4] | 0, this.F = re[5] | 0, this.G = re[6] | 0, this.H = re[7] | 0;
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
      se[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = se[l - 15], d = se[l - 2], p = It(g, 7) ^ It(g, 18) ^ g >>> 3, w = It(d, 17) ^ It(d, 19) ^ d >>> 10;
      se[l] = w + se[l - 7] + p + se[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = It(c, 6) ^ It(c, 11) ^ It(c, 25), d = u + g + $2(c, a, f) + v2[l] + se[l] | 0, w = (It(r, 2) ^ It(r, 13) ^ It(r, 22)) + I2(r, s, o) | 0;
      u = f, f = a, a = c, c = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, o, i, c, a, f, u);
  }
  roundClean() {
    se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, L2 = class extends Il {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const vl = je(() => new Il());
je(() => new L2());
var rs = {}, Qo = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = zn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let a = [], f = 0;
    for (let d = i.length - 1; d >= 0; d--)
      if (f < 4) {
        const p = n.indexOf(i[d]) >> f;
        let w = 0;
        d !== 0 && (w = n.indexOf(i[d - 1]));
        const E = 1 + f, L = w % (1 << E) << 5 - E, M = t.c32[p + L];
        f = E, a.unshift(M);
      } else
        f = 0;
    let u = 0;
    for (let d = 0; d < a.length && a[d] === "0"; d++)
      u++;
    a = a.slice(u);
    const l = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let d = 0; d < g; d++)
      a.unshift(t.c32[0]);
    if (c) {
      const d = c - a.length;
      for (let p = 0; p < d; p++)
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
    const a = i.match(`^${t.c32[0]}*`), f = a ? a[0].length : 0;
    let u = [], l = 0, g = 0;
    for (let w = i.length - 1; w >= 0; w--) {
      g === 4 && (u.unshift(n[l]), g = 0, l = 0);
      const L = (t.c32.indexOf(i[w]) << g) + l, M = n[L % 16];
      if (g += 1, l = L >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      u.unshift(M);
    }
    u.unshift(n[l]), u.length % 2 === 1 && u.unshift("0");
    let d = 0;
    for (let w = 0; w < u.length && u[w] === "0"; w++)
      d++;
    u = u.slice(d - d % 2);
    let p = u.join("");
    for (let w = 0; w < f; w++)
      p = `00${p}`;
    if (c) {
      const w = c * 2 - p.length;
      for (let E = 0; E < w; E += 2)
        p = `00${p}`;
    }
    return p;
  }
  t.c32decode = o;
})(Qo);
var Ce = {};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.c32checkDecode = Ce.c32checkEncode = void 0;
const Gc = ts, Kc = zn, Bn = Qo;
function Ll(t) {
  const e = (0, Gc.sha256)((0, Gc.sha256)((0, Kc.hexToBytes)(t)));
  return (0, Kc.bytesToHex)(e.slice(0, 4));
}
function M2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Ll(`${n}${e}`), s = (0, Bn.c32encode)(`${e}${r}`);
  return `${Bn.c32[t]}${s}`;
}
Ce.c32checkEncode = M2;
function _2(t) {
  t = (0, Bn.c32normalize)(t);
  const e = (0, Bn.c32decode)(t.slice(1)), n = t[0], r = Bn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Ll(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ce.c32checkDecode = _2;
var Ml = {}, ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.decode = ln.encode = void 0;
const kr = ts, Vc = zn, _l = j0, Bl = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function B2(t, e = "00") {
  const n = typeof t == "string" ? (0, Vc.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Vc.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, kr.sha256)((0, kr.sha256)(new Uint8Array([...r, ...n])));
  return _l(Bl).encode([...r, ...n, ...s.slice(0, 4)]);
}
ln.encode = B2;
function D2(t) {
  const e = _l(Bl).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, kr.sha256)((0, kr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ln.decode = D2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ce, n = ln, r = zn;
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
  function i(u, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(u, l)}`;
  }
  t.c32address = i;
  function c(u) {
    if (u.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (u[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(u.slice(1));
  }
  t.c32addressDecode = c;
  function a(u, l = -1) {
    const g = n.decode(u), d = (0, r.bytesToHex)(g.data), p = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = p, s[p] !== void 0 && (w = s[p])) : w = l, i(w, d);
  }
  t.b58ToC32 = a;
  function f(u, l = -1) {
    const g = c(u), d = g[0], p = g[1];
    let w;
    l < 0 ? (w = d, o[d] !== void 0 && (w = o[d])) : w = l;
    let E = w.toString(16);
    return E.length === 1 && (E = `0${E}`), n.encode(p, E);
  }
  t.c32ToB58 = f;
})(Ml);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Qo;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ce;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ml;
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
})(rs);
function N2(t, e) {
  switch (e = ml(e ?? yl), t) {
    case Ft.P2PKH:
      switch (e.transactionVersion) {
        case zt.Mainnet:
          return Bt.MainnetSingleSig;
        case zt.Testnet:
          return Bt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ft.P2SH:
    case Ft.P2SHNonSequential:
    case Ft.P2WPKH:
    case Ft.P2WSH:
    case Ft.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case zt.Mainnet:
          return Bt.MainnetMultiSig;
        case zt.Testnet:
          return Bt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const H2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dl = Uint8Array.from({ length: 16 }, (t, e) => e), C2 = Dl.map((t) => (9 * t + 5) % 16);
let Xo = [Dl], Jo = [C2];
for (let t = 0; t < 4; t++)
  for (let e of [Xo, Jo])
    e.push(e[t].map((n) => H2[n]));
const Nl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), U2 = Xo.map((t, e) => t.map((n) => Nl[e][n])), O2 = Jo.map((t, e) => t.map((n) => Nl[e][n])), k2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), P2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lr = (t, e) => t << e | t >>> 32 - e;
function Wc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fr = new Uint32Array(16);
let j2 = class extends Zo {
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
    for (let d = 0; d < 16; d++, n += 4)
      fr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = k2[d], E = P2[d], L = Xo[d], M = Jo[d], x = U2[d], I = O2[d];
      for (let m = 0; m < 16; m++) {
        const H = lr(r + Wc(d, o, c, f) + fr[L[m]] + w, x[m]) + l | 0;
        r = l, l = f, f = lr(c, 10) | 0, c = o, o = H;
      }
      for (let m = 0; m < 16; m++) {
        const H = lr(s + Wc(p, i, a, u) + fr[M[m]] + E, I[m]) + g | 0;
        s = g, g = u, u = lr(a, 10) | 0, a = i, i = H;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    fr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const T2 = je(() => new j2()), ur = BigInt(2 ** 32 - 1), to = BigInt(32);
function Hl(t, e = !1) {
  return e ? { h: Number(t & ur), l: Number(t >> to & ur) } : { h: Number(t >> to & ur) | 0, l: Number(t & ur) | 0 };
}
function F2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Hl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const z2 = (t, e) => BigInt(t >>> 0) << to | BigInt(e >>> 0), R2 = (t, e, n) => t >>> n, G2 = (t, e, n) => t << 32 - n | e >>> n, K2 = (t, e, n) => t >>> n | e << 32 - n, V2 = (t, e, n) => t << 32 - n | e >>> n, W2 = (t, e, n) => t << 64 - n | e >>> n - 32, q2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Y2 = (t, e) => e, Z2 = (t, e) => t, Q2 = (t, e, n) => t << n | e >>> 32 - n, X2 = (t, e, n) => e << n | t >>> 32 - n, J2 = (t, e, n) => e << n - 32 | t >>> 64 - n, tb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function eb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const nb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), rb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, sb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ob = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ib = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), cb = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: Hl,
  split: F2,
  toBig: z2,
  shrSH: R2,
  shrSL: G2,
  rotrSH: K2,
  rotrSL: V2,
  rotrBH: W2,
  rotrBL: q2,
  rotr32H: Y2,
  rotr32L: Z2,
  rotlSH: Q2,
  rotlSL: X2,
  rotlBH: J2,
  rotlBL: tb,
  add: eb,
  add3L: nb,
  add3H: rb,
  add4L: sb,
  add4H: ob,
  add5H: cb,
  add5L: ib
}, [ab, lb] = j.split([
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
].map((t) => BigInt(t))), oe = new Uint32Array(80), ie = new Uint32Array(80);
let ss = class extends Zo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      oe[x] = e.getUint32(n), ie[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = oe[x - 15] | 0, m = ie[x - 15] | 0, H = j.rotrSH(I, m, 1) ^ j.rotrSH(I, m, 8) ^ j.shrSH(I, m, 7), O = j.rotrSL(I, m, 1) ^ j.rotrSL(I, m, 8) ^ j.shrSL(I, m, 7), B = oe[x - 2] | 0, D = ie[x - 2] | 0, b = j.rotrSH(B, D, 19) ^ j.rotrBH(B, D, 61) ^ j.shrSH(B, D, 6), S = j.rotrSL(B, D, 19) ^ j.rotrBL(B, D, 61) ^ j.shrSL(B, D, 6), _ = j.add4L(O, S, ie[x - 7], ie[x - 16]), U = j.add4H(_, H, b, oe[x - 7], oe[x - 16]);
      oe[x] = U | 0, ie[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = j.rotrSH(l, g, 14) ^ j.rotrSH(l, g, 18) ^ j.rotrBH(l, g, 41), m = j.rotrSL(l, g, 14) ^ j.rotrSL(l, g, 18) ^ j.rotrBL(l, g, 41), H = l & d ^ ~l & w, O = g & p ^ ~g & E, B = j.add5L(M, m, O, lb[x], ie[x]), D = j.add5H(B, L, I, H, ab[x], oe[x]), b = B | 0, S = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), _ = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), U = r & o ^ r & c ^ o & c, R = s & i ^ s & a ^ i & a;
      L = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = j.add(f | 0, u | 0, D | 0, b | 0), f = c | 0, u = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const C = j.add3L(b, _, R);
      r = j.add3H(C, D, S, U), s = C | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = j.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = j.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = j.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = j.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = j.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = j.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: L, l: M } = j.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, f, u, l, g, d, p, w, E, L, M);
  }
  roundClean() {
    oe.fill(0), ie.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, fb = class extends ss {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ub = class extends ss {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, hb = class extends ss {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
je(() => new ss());
je(() => new fb());
je(() => new ub());
je(() => new hb());
var Pr = { exports: {} };
Pr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", a = "[object Date]", f = "[object Error]", u = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", d = "[object Number]", p = "[object Object]", w = "[object Promise]", E = "[object RegExp]", L = "[object Set]", M = "[object String]", x = "[object Symbol]", I = "[object WeakMap]", m = "[object ArrayBuffer]", H = "[object DataView]", O = "[object Float32Array]", B = "[object Float64Array]", D = "[object Int8Array]", b = "[object Int16Array]", S = "[object Int32Array]", _ = "[object Uint8Array]", U = "[object Uint8ClampedArray]", R = "[object Uint16Array]", C = "[object Uint32Array]", Re = /[\\^$.*+?()[\]{}|]/g, Sn = /\w*$/, Vn = /^\[object .+?Constructor\]$/, tt = /^(?:0|[1-9]\d*)$/, G = {};
  G[o] = G[i] = G[m] = G[H] = G[c] = G[a] = G[O] = G[B] = G[D] = G[b] = G[S] = G[g] = G[d] = G[p] = G[E] = G[L] = G[M] = G[x] = G[_] = G[U] = G[R] = G[C] = !0, G[f] = G[u] = G[I] = !1;
  var Jf = typeof ct == "object" && ct && ct.Object === Object && ct, tu = typeof self == "object" && self && self.Object === Object && self, kt = Jf || tu || Function("return this")(), Di = e && !e.nodeType && e, Ni = Di && !0 && t && !t.nodeType && t, eu = Ni && Ni.exports === Di;
  function nu(h, y) {
    return h.set(y[0], y[1]), h;
  }
  function ru(h, y) {
    return h.add(y), h;
  }
  function su(h, y) {
    for (var A = -1, N = h ? h.length : 0; ++A < N && y(h[A], A, h) !== !1; )
      ;
    return h;
  }
  function ou(h, y) {
    for (var A = -1, N = y.length, rt = h.length; ++A < N; )
      h[rt + A] = y[A];
    return h;
  }
  function Hi(h, y, A, N) {
    for (var rt = -1, at = h ? h.length : 0; ++rt < at; )
      A = y(A, h[rt], rt, h);
    return A;
  }
  function iu(h, y) {
    for (var A = -1, N = Array(h); ++A < h; )
      N[A] = y(A);
    return N;
  }
  function cu(h, y) {
    return h == null ? void 0 : h[y];
  }
  function Ci(h) {
    var y = !1;
    if (h != null && typeof h.toString != "function")
      try {
        y = !!(h + "");
      } catch {
      }
    return y;
  }
  function Ui(h) {
    var y = -1, A = Array(h.size);
    return h.forEach(function(N, rt) {
      A[++y] = [rt, N];
    }), A;
  }
  function ds(h, y) {
    return function(A) {
      return h(y(A));
    };
  }
  function Oi(h) {
    var y = -1, A = Array(h.size);
    return h.forEach(function(N) {
      A[++y] = N;
    }), A;
  }
  var au = Array.prototype, lu = Function.prototype, Wn = Object.prototype, gs = kt["__core-js_shared__"], ki = function() {
    var h = /[^.]+$/.exec(gs && gs.keys && gs.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), Pi = lu.toString, Yt = Wn.hasOwnProperty, qn = Wn.toString, fu = RegExp(
    "^" + Pi.call(Yt).replace(Re, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ji = eu ? kt.Buffer : void 0, Ti = kt.Symbol, Fi = kt.Uint8Array, uu = ds(Object.getPrototypeOf, Object), hu = Object.create, du = Wn.propertyIsEnumerable, gu = au.splice, zi = Object.getOwnPropertySymbols, bu = ji ? ji.isBuffer : void 0, pu = ds(Object.keys, Object), bs = Ve(kt, "DataView"), An = Ve(kt, "Map"), ps = Ve(kt, "Promise"), xs = Ve(kt, "Set"), ws = Ve(kt, "WeakMap"), En = Ve(Object, "create"), xu = Me(bs), wu = Me(An), yu = Me(ps), mu = Me(xs), Su = Me(ws), Ri = Ti ? Ti.prototype : void 0, Gi = Ri ? Ri.valueOf : void 0;
  function ve(h) {
    var y = -1, A = h ? h.length : 0;
    for (this.clear(); ++y < A; ) {
      var N = h[y];
      this.set(N[0], N[1]);
    }
  }
  function Au() {
    this.__data__ = En ? En(null) : {};
  }
  function Eu(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function $u(h) {
    var y = this.__data__;
    if (En) {
      var A = y[h];
      return A === r ? void 0 : A;
    }
    return Yt.call(y, h) ? y[h] : void 0;
  }
  function Iu(h) {
    var y = this.__data__;
    return En ? y[h] !== void 0 : Yt.call(y, h);
  }
  function vu(h, y) {
    var A = this.__data__;
    return A[h] = En && y === void 0 ? r : y, this;
  }
  ve.prototype.clear = Au, ve.prototype.delete = Eu, ve.prototype.get = $u, ve.prototype.has = Iu, ve.prototype.set = vu;
  function Pt(h) {
    var y = -1, A = h ? h.length : 0;
    for (this.clear(); ++y < A; ) {
      var N = h[y];
      this.set(N[0], N[1]);
    }
  }
  function Lu() {
    this.__data__ = [];
  }
  function Mu(h) {
    var y = this.__data__, A = Yn(y, h);
    if (A < 0)
      return !1;
    var N = y.length - 1;
    return A == N ? y.pop() : gu.call(y, A, 1), !0;
  }
  function _u(h) {
    var y = this.__data__, A = Yn(y, h);
    return A < 0 ? void 0 : y[A][1];
  }
  function Bu(h) {
    return Yn(this.__data__, h) > -1;
  }
  function Du(h, y) {
    var A = this.__data__, N = Yn(A, h);
    return N < 0 ? A.push([h, y]) : A[N][1] = y, this;
  }
  Pt.prototype.clear = Lu, Pt.prototype.delete = Mu, Pt.prototype.get = _u, Pt.prototype.has = Bu, Pt.prototype.set = Du;
  function Ge(h) {
    var y = -1, A = h ? h.length : 0;
    for (this.clear(); ++y < A; ) {
      var N = h[y];
      this.set(N[0], N[1]);
    }
  }
  function Nu() {
    this.__data__ = {
      hash: new ve(),
      map: new (An || Pt)(),
      string: new ve()
    };
  }
  function Hu(h) {
    return Zn(this, h).delete(h);
  }
  function Cu(h) {
    return Zn(this, h).get(h);
  }
  function Uu(h) {
    return Zn(this, h).has(h);
  }
  function Ou(h, y) {
    return Zn(this, h).set(h, y), this;
  }
  Ge.prototype.clear = Nu, Ge.prototype.delete = Hu, Ge.prototype.get = Cu, Ge.prototype.has = Uu, Ge.prototype.set = Ou;
  function Ke(h) {
    this.__data__ = new Pt(h);
  }
  function ku() {
    this.__data__ = new Pt();
  }
  function Pu(h) {
    return this.__data__.delete(h);
  }
  function ju(h) {
    return this.__data__.get(h);
  }
  function Tu(h) {
    return this.__data__.has(h);
  }
  function Fu(h, y) {
    var A = this.__data__;
    if (A instanceof Pt) {
      var N = A.__data__;
      if (!An || N.length < n - 1)
        return N.push([h, y]), this;
      A = this.__data__ = new Ge(N);
    }
    return A.set(h, y), this;
  }
  Ke.prototype.clear = ku, Ke.prototype.delete = Pu, Ke.prototype.get = ju, Ke.prototype.has = Tu, Ke.prototype.set = Fu;
  function zu(h, y) {
    var A = Ss(h) || hh(h) ? iu(h.length, String) : [], N = A.length, rt = !!N;
    for (var at in h)
      Yt.call(h, at) && !(rt && (at == "length" || ah(at, N))) && A.push(at);
    return A;
  }
  function Ki(h, y, A) {
    var N = h[y];
    (!(Yt.call(h, y) && Yi(N, A)) || A === void 0 && !(y in h)) && (h[y] = A);
  }
  function Yn(h, y) {
    for (var A = h.length; A--; )
      if (Yi(h[A][0], y))
        return A;
    return -1;
  }
  function Ru(h, y) {
    return h && Vi(y, As(y), h);
  }
  function ys(h, y, A, N, rt, at, jt) {
    var lt;
    if (N && (lt = at ? N(h, rt, at, jt) : N(h)), lt !== void 0)
      return lt;
    if (!Qn(h))
      return h;
    var Xi = Ss(h);
    if (Xi) {
      if (lt = oh(h), !y)
        return nh(h, lt);
    } else {
      var We = Le(h), Ji = We == u || We == l;
      if (gh(h))
        return Yu(h, y);
      if (We == p || We == o || Ji && !at) {
        if (Ci(h))
          return at ? h : {};
        if (lt = ih(Ji ? {} : h), !y)
          return rh(h, Ru(lt, h));
      } else {
        if (!G[We])
          return at ? h : {};
        lt = ch(h, We, ys, y);
      }
    }
    jt || (jt = new Ke());
    var tc = jt.get(h);
    if (tc)
      return tc;
    if (jt.set(h, lt), !Xi)
      var ec = A ? sh(h) : As(h);
    return su(ec || h, function(Es, Xn) {
      ec && (Xn = Es, Es = h[Xn]), Ki(lt, Xn, ys(Es, y, A, N, Xn, h, jt));
    }), lt;
  }
  function Gu(h) {
    return Qn(h) ? hu(h) : {};
  }
  function Ku(h, y, A) {
    var N = y(h);
    return Ss(h) ? N : ou(N, A(h));
  }
  function Vu(h) {
    return qn.call(h);
  }
  function Wu(h) {
    if (!Qn(h) || fh(h))
      return !1;
    var y = Qi(h) || Ci(h) ? fu : Vn;
    return y.test(Me(h));
  }
  function qu(h) {
    if (!qi(h))
      return pu(h);
    var y = [];
    for (var A in Object(h))
      Yt.call(h, A) && A != "constructor" && y.push(A);
    return y;
  }
  function Yu(h, y) {
    if (y)
      return h.slice();
    var A = new h.constructor(h.length);
    return h.copy(A), A;
  }
  function ms(h) {
    var y = new h.constructor(h.byteLength);
    return new Fi(y).set(new Fi(h)), y;
  }
  function Zu(h, y) {
    var A = y ? ms(h.buffer) : h.buffer;
    return new h.constructor(A, h.byteOffset, h.byteLength);
  }
  function Qu(h, y, A) {
    var N = y ? A(Ui(h), !0) : Ui(h);
    return Hi(N, nu, new h.constructor());
  }
  function Xu(h) {
    var y = new h.constructor(h.source, Sn.exec(h));
    return y.lastIndex = h.lastIndex, y;
  }
  function Ju(h, y, A) {
    var N = y ? A(Oi(h), !0) : Oi(h);
    return Hi(N, ru, new h.constructor());
  }
  function th(h) {
    return Gi ? Object(Gi.call(h)) : {};
  }
  function eh(h, y) {
    var A = y ? ms(h.buffer) : h.buffer;
    return new h.constructor(A, h.byteOffset, h.length);
  }
  function nh(h, y) {
    var A = -1, N = h.length;
    for (y || (y = Array(N)); ++A < N; )
      y[A] = h[A];
    return y;
  }
  function Vi(h, y, A, N) {
    A || (A = {});
    for (var rt = -1, at = y.length; ++rt < at; ) {
      var jt = y[rt], lt = void 0;
      Ki(A, jt, lt === void 0 ? h[jt] : lt);
    }
    return A;
  }
  function rh(h, y) {
    return Vi(h, Wi(h), y);
  }
  function sh(h) {
    return Ku(h, As, Wi);
  }
  function Zn(h, y) {
    var A = h.__data__;
    return lh(y) ? A[typeof y == "string" ? "string" : "hash"] : A.map;
  }
  function Ve(h, y) {
    var A = cu(h, y);
    return Wu(A) ? A : void 0;
  }
  var Wi = zi ? ds(zi, Object) : xh, Le = Vu;
  (bs && Le(new bs(new ArrayBuffer(1))) != H || An && Le(new An()) != g || ps && Le(ps.resolve()) != w || xs && Le(new xs()) != L || ws && Le(new ws()) != I) && (Le = function(h) {
    var y = qn.call(h), A = y == p ? h.constructor : void 0, N = A ? Me(A) : void 0;
    if (N)
      switch (N) {
        case xu:
          return H;
        case wu:
          return g;
        case yu:
          return w;
        case mu:
          return L;
        case Su:
          return I;
      }
    return y;
  });
  function oh(h) {
    var y = h.length, A = h.constructor(y);
    return y && typeof h[0] == "string" && Yt.call(h, "index") && (A.index = h.index, A.input = h.input), A;
  }
  function ih(h) {
    return typeof h.constructor == "function" && !qi(h) ? Gu(uu(h)) : {};
  }
  function ch(h, y, A, N) {
    var rt = h.constructor;
    switch (y) {
      case m:
        return ms(h);
      case c:
      case a:
        return new rt(+h);
      case H:
        return Zu(h, N);
      case O:
      case B:
      case D:
      case b:
      case S:
      case _:
      case U:
      case R:
      case C:
        return eh(h, N);
      case g:
        return Qu(h, N, A);
      case d:
      case M:
        return new rt(h);
      case E:
        return Xu(h);
      case L:
        return Ju(h, N, A);
      case x:
        return th(h);
    }
  }
  function ah(h, y) {
    return y = y ?? s, !!y && (typeof h == "number" || tt.test(h)) && h > -1 && h % 1 == 0 && h < y;
  }
  function lh(h) {
    var y = typeof h;
    return y == "string" || y == "number" || y == "symbol" || y == "boolean" ? h !== "__proto__" : h === null;
  }
  function fh(h) {
    return !!ki && ki in h;
  }
  function qi(h) {
    var y = h && h.constructor, A = typeof y == "function" && y.prototype || Wn;
    return h === A;
  }
  function Me(h) {
    if (h != null) {
      try {
        return Pi.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function uh(h) {
    return ys(h, !0, !0);
  }
  function Yi(h, y) {
    return h === y || h !== h && y !== y;
  }
  function hh(h) {
    return dh(h) && Yt.call(h, "callee") && (!du.call(h, "callee") || qn.call(h) == o);
  }
  var Ss = Array.isArray;
  function Zi(h) {
    return h != null && bh(h.length) && !Qi(h);
  }
  function dh(h) {
    return ph(h) && Zi(h);
  }
  var gh = bu || wh;
  function Qi(h) {
    var y = Qn(h) ? qn.call(h) : "";
    return y == u || y == l;
  }
  function bh(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function Qn(h) {
    var y = typeof h;
    return !!h && (y == "object" || y == "function");
  }
  function ph(h) {
    return !!h && typeof h == "object";
  }
  function As(h) {
    return Zi(h) ? zu(h) : qu(h);
  }
  function xh() {
    return [];
  }
  function wh() {
    return !1;
  }
  t.exports = uh;
})(Pr, Pr.exports);
Pr.exports;
var eo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(eo || (eo = {}));
function db(t, e) {
  return { type: eo.Address, version: t, hash160: e };
}
function gb(t) {
  return rs.c32address(t.version, t.hash160);
}
const bb = (t) => T2(vl(t)), pb = (t) => xt(bb(t));
J.hmacSha256Sync = (t, ...e) => {
  const n = $l.create(vl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function xb(t, e = "mainnet") {
  e = ml(e), t = typeof t == "string" ? ht(t) : t;
  const n = N2(Ft.P2PKH, e), r = db(n, pb(t));
  return gb(r);
}
function wb(t, e) {
  const n = ot.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, o = xb(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new ot.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function yb(t, e = null) {
  let n;
  e ? n = wb(t, e) : n = ot.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const qc = "_blockstackDidCheckEchoReply", mb = "echoReply", Sb = "authContinuation";
function Ab(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Eb() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[qc];
  if (typeof e == "boolean")
    return e;
  const n = Ab(t.location.search), r = n[mb];
  if (r) {
    t[qc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[Sb];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Un {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new qr();
    else
      throw new Rh("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new _c(e.sessionOptions) : this.store = new _c() : e ? this.store = new Mc(e.sessionOptions) : this.store = new Mc();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Kh().getTime(), c = {}) {
    const a = this.appConfig;
    if (!a)
      throw new Gs("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || a.redirectURI(), r = r || a.manifestURI(), s = s || a.scopes, o = o || a.appDomain, l2(e, n, r, s, o, i, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = a2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Do("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Eb())
        return Qe.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Qe.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = fd()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Jn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = ot.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await g2(e))
      throw new Jn("Invalid authentication response.");
    let c = o.private_key, a = o.core_token;
    if (Ms(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            c = await vc(s, o.private_key);
          } catch {
            if (Qe.warn("Failed decryption of appPrivateKey, will try to use as given"), !J.isValidPrivateKey(o.private_key))
              throw new Jn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (a != null)
          try {
            a = await vc(s, a);
          } catch {
            Qe.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Jn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = od, u;
    Ms(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (f = o.hubUrl), Ms(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (u = o.associationToken);
    const l = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: xl(o.iss),
      appPrivateKey: c,
      coreSessionToken: a,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: u
    }, g = o.profile_url;
    if (!l.profile && g) {
      const d = await n(g);
      if (!d.ok)
        l.profile = Object.assign({}, Th);
      else {
        const p = await d.text(), w = JSON.parse(p);
        l.profile = yb(w[0].token);
      }
    } else
      l.profile = o.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Gs("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), tg(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), eg(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Un.prototype.makeAuthRequest = Un.prototype.makeAuthRequestToken;
const $b = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Ib = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = $b(), n = t.filter((r) => e.find((o) => o.id === r.id) ? !1 : !!os(r.id));
  return e.concat(n);
}, os = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ti = "STX_PROVIDER", Ht = () => typeof window > "u" ? null : window.localStorage.getItem(ti), Cl = (t) => {
  typeof window < "u" && window.localStorage.setItem(ti, t);
}, Ul = () => {
  typeof window < "u" && window.localStorage.removeItem(ti);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof ct < "u" && ct || {}, r = {
        searchParams: "URLSearchParams" in n,
        iterable: "Symbol" in n && "iterator" in Symbol,
        blob: "FileReader" in n && "Blob" in n && function() {
          try {
            return new Blob(), !0;
          } catch {
            return !1;
          }
        }(),
        formData: "FormData" in n,
        arrayBuffer: "ArrayBuffer" in n
      };
      function s(b) {
        return b && DataView.prototype.isPrototypeOf(b);
      }
      if (r.arrayBuffer)
        var o = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], i = ArrayBuffer.isView || function(b) {
          return b && o.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function c(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function a(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function f(b) {
        var S = {
          next: function() {
            var _ = b.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (S[Symbol.iterator] = function() {
          return S;
        }), S;
      }
      function u(b) {
        this.map = {}, b instanceof u ? b.forEach(function(S, _) {
          this.append(_, S);
        }, this) : Array.isArray(b) ? b.forEach(function(S) {
          if (S.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + S.length);
          this.append(S[0], S[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(S) {
          this.append(S, b[S]);
        }, this);
      }
      u.prototype.append = function(b, S) {
        b = c(b), S = a(S);
        var _ = this.map[b];
        this.map[b] = _ ? _ + ", " + S : S;
      }, u.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, u.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, u.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, u.prototype.set = function(b, S) {
        this.map[c(b)] = a(S);
      }, u.prototype.forEach = function(b, S) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && b.call(S, this.map[_], _, this);
      }, u.prototype.keys = function() {
        var b = [];
        return this.forEach(function(S, _) {
          b.push(_);
        }), f(b);
      }, u.prototype.values = function() {
        var b = [];
        return this.forEach(function(S) {
          b.push(S);
        }), f(b);
      }, u.prototype.entries = function() {
        var b = [];
        return this.forEach(function(S, _) {
          b.push([_, S]);
        }), f(b);
      }, r.iterable && (u.prototype[Symbol.iterator] = u.prototype.entries);
      function l(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function g(b) {
        return new Promise(function(S, _) {
          b.onload = function() {
            S(b.result);
          }, b.onerror = function() {
            _(b.error);
          };
        });
      }
      function d(b) {
        var S = new FileReader(), _ = g(S);
        return S.readAsArrayBuffer(b), _;
      }
      function p(b) {
        var S = new FileReader(), _ = g(S), U = /charset=([A-Za-z0-9_-]+)/.exec(b.type), R = U ? U[1] : "utf-8";
        return S.readAsText(b, R), _;
      }
      function w(b) {
        for (var S = new Uint8Array(b), _ = new Array(S.length), U = 0; U < S.length; U++)
          _[U] = String.fromCharCode(S[U]);
        return _.join("");
      }
      function E(b) {
        if (b.slice)
          return b.slice(0);
        var S = new Uint8Array(b.byteLength);
        return S.set(new Uint8Array(b)), S.buffer;
      }
      function L() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = E(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = E(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = l(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var b = l(this);
            return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(d);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = l(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return p(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(m);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var M = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(b) {
        var S = b.toUpperCase();
        return M.indexOf(S) > -1 ? S : b;
      }
      function I(b, S) {
        if (!(this instanceof I))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        S = S || {};
        var _ = S.body;
        if (b instanceof I) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, S.headers || (this.headers = new u(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !_ && b._bodyInit != null && (_ = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = S.credentials || this.credentials || "same-origin", (S.headers || !this.headers) && (this.headers = new u(S.headers)), this.method = x(S.method || this.method || "GET"), this.mode = S.mode || this.mode || null, this.signal = S.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (S.cache === "no-store" || S.cache === "no-cache")) {
          var U = /([?&])_=[^&]*/;
          if (U.test(this.url))
            this.url = this.url.replace(U, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var R = /\?/;
            this.url += (R.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      I.prototype.clone = function() {
        return new I(this, { body: this._bodyInit });
      };
      function m(b) {
        var S = new FormData();
        return b.trim().split("&").forEach(function(_) {
          if (_) {
            var U = _.split("="), R = U.shift().replace(/\+/g, " "), C = U.join("=").replace(/\+/g, " ");
            S.append(decodeURIComponent(R), decodeURIComponent(C));
          }
        }), S;
      }
      function H(b) {
        var S = new u(), _ = b.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(U) {
          return U.indexOf(`
`) === 0 ? U.substr(1, U.length) : U;
        }).forEach(function(U) {
          var R = U.split(":"), C = R.shift().trim();
          if (C) {
            var Re = R.join(":").trim();
            try {
              S.append(C, Re);
            } catch (Sn) {
              console.warn("Response " + Sn.message);
            }
          }
        }), S;
      }
      L.call(I.prototype);
      function O(b, S) {
        if (!(this instanceof O))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (S || (S = {}), this.type = "default", this.status = S.status === void 0 ? 200 : S.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = S.statusText === void 0 ? "" : "" + S.statusText, this.headers = new u(S.headers), this.url = S.url || "", this._initBody(b);
      }
      L.call(O.prototype), O.prototype.clone = function() {
        return new O(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new u(this.headers),
          url: this.url
        });
      }, O.error = function() {
        var b = new O(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var B = [301, 302, 303, 307, 308];
      O.redirect = function(b, S) {
        if (B.indexOf(S) === -1)
          throw new RangeError("Invalid status code");
        return new O(null, { status: S, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(S, _) {
          this.message = S, this.name = _;
          var U = Error(S);
          this.stack = U.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function D(b, S) {
        return new Promise(function(_, U) {
          var R = new I(b, S);
          if (R.signal && R.signal.aborted)
            return U(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function Re() {
            C.abort();
          }
          C.onload = function() {
            var tt = {
              statusText: C.statusText,
              headers: H(C.getAllResponseHeaders() || "")
            };
            R.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? tt.status = 200 : tt.status = C.status, tt.url = "responseURL" in C ? C.responseURL : tt.headers.get("X-Request-URL");
            var G = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              _(new O(G, tt));
            }, 0);
          }, C.onerror = function() {
            setTimeout(function() {
              U(new TypeError("Network request failed"));
            }, 0);
          }, C.ontimeout = function() {
            setTimeout(function() {
              U(new TypeError("Network request timed out"));
            }, 0);
          }, C.onabort = function() {
            setTimeout(function() {
              U(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Sn(tt) {
            try {
              return tt === "" && n.location.href ? n.location.href : tt;
            } catch {
              return tt;
            }
          }
          if (C.open(R.method, Sn(R.url), !0), R.credentials === "include" ? C.withCredentials = !0 : R.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), S && typeof S.headers == "object" && !(S.headers instanceof u || n.Headers && S.headers instanceof n.Headers)) {
            var Vn = [];
            Object.getOwnPropertyNames(S.headers).forEach(function(tt) {
              Vn.push(c(tt)), C.setRequestHeader(tt, a(S.headers[tt]));
            }), R.headers.forEach(function(tt, G) {
              Vn.indexOf(G) === -1 && C.setRequestHeader(G, tt);
            });
          } else
            R.headers.forEach(function(tt, G) {
              C.setRequestHeader(G, tt);
            });
          R.signal && (R.signal.addEventListener("abort", Re), C.onreadystatechange = function() {
            C.readyState === 4 && R.signal.removeEventListener("abort", Re);
          }), C.send(typeof R._bodyInit > "u" ? null : R._bodyInit);
        });
      }
      return D.polyfill = !0, n.fetch || (n.fetch = D, n.Headers = u, n.Request = I, n.Response = O), e.Headers = u, e.Request = I, e.Response = O, e.fetch = D, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ct);
})();
const vb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Lb(t, e) {
  const n = {};
  return Object.assign(n, vb, e), await fetch(t, n);
}
function Mb(t) {
  let e = Lb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function _b(...t) {
  const { fetchLib: e, middlewares: n } = Mb(t);
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
var fn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fn || (fn = {}));
var Ue;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ue || (Ue = {}));
var Yc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Yc || (Yc = {}));
const Bb = "https://api.mainnet.hiro.so", Db = "https://api.testnet.hiro.so", Nb = "http://localhost:3999", Hb = ["mainnet", "testnet", "devnet", "mocknet"];
class Oe {
  constructor(e) {
    this.version = Ue.Mainnet, this.chainId = fn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ue.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? _b();
  }
  getNameInfo(e) {
    const n = `${this.bnsLookupUrl}/v1/names/${e}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
}
Oe.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new no();
    case "testnet":
      return new ro();
    case "devnet":
      return new Cb();
    case "mocknet":
      return new Ol();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Hb.join(", ")}`);
  }
};
Oe.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Oe.fromName(t);
class no extends Oe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Bb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Mainnet, this.chainId = fn.Mainnet;
  }
}
class ro extends Oe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Db,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Testnet, this.chainId = fn.Testnet;
  }
}
class Ol extends Oe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Nb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Testnet, this.chainId = fn.Testnet;
  }
}
const Cb = Ol;
var so;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(so || (so = {}));
var Zc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zc || (Zc = {}));
so.Mainnet;
var jr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jr || (jr = {}));
var Qc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Qc || (Qc = {}));
jr.Mainnet;
const Ub = 128, Ob = 128, kl = 16;
var Xc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xc || (Xc = {}));
var Jc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Jc || (Jc = {}));
var mt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(mt || (mt = {}));
const Cs = ["onChainOnly", "offChainOnly", "any"];
Cs[0] + "", mt.OnChainOnly, Cs[1] + "", mt.OffChainOnly, Cs[2] + "", mt.Any, mt.OnChainOnly + "", mt.OnChainOnly, mt.OffChainOnly + "", mt.OffChainOnly, mt.Any + "", mt.Any;
var ta;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(sa || (sa = {}));
var oa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(oa || (oa = {}));
var ia;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ia || (ia = {}));
var ca;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ca || (ca = {}));
var aa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(aa || (aa = {}));
var la;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(la || (la = {}));
var fa;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(fa || (fa = {}));
var ua;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ua || (ua = {}));
var ha;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ha || (ha = {}));
let kb = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Pb = class extends kb {
  constructor(e) {
    super(e);
  }
};
function oo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function jb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Pl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Tb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  oo(t.outputLen), oo(t.blockLen);
}
function Fb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function zb(t, e) {
  Pl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: oo,
  bool: jb,
  bytes: Pl,
  hash: Tb,
  exists: Fb,
  output: zb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Os = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), vt = (t, e) => t << 32 - e | t >>> e, Rb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Rb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function jl(t) {
  if (typeof t == "string" && (t = Gb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Kb = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Te(t) {
  const e = (r) => t().update(jl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Vb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
let ei = class extends Kb {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Os(this.buffer);
  }
  update(e) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = jl(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Os(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Us.exists(this), Us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Vb(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Os(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], o);
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
const Wb = (t, e, n) => t & e ^ ~t & n, qb = (t, e, n) => t & e ^ t & n ^ e & n, Yb = new Uint32Array([
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
]), ce = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ae = new Uint32Array(64);
let Tl = class extends ei {
  constructor() {
    super(64, 32, 8, !1), this.A = ce[0] | 0, this.B = ce[1] | 0, this.C = ce[2] | 0, this.D = ce[3] | 0, this.E = ce[4] | 0, this.F = ce[5] | 0, this.G = ce[6] | 0, this.H = ce[7] | 0;
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
      ae[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ae[l - 15], d = ae[l - 2], p = vt(g, 7) ^ vt(g, 18) ^ g >>> 3, w = vt(d, 17) ^ vt(d, 19) ^ d >>> 10;
      ae[l] = w + ae[l - 7] + p + ae[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = vt(c, 6) ^ vt(c, 11) ^ vt(c, 25), d = u + g + Wb(c, a, f) + Yb[l] + ae[l] | 0, w = (vt(r, 2) ^ vt(r, 13) ^ vt(r, 22)) + qb(r, s, o) | 0;
      u = f, f = a, a = c, c = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, o, i, c, a, f, u);
  }
  roundClean() {
    ae.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Zb = class extends Tl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Te(() => new Tl());
Te(() => new Zb());
const Qb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fl = Uint8Array.from({ length: 16 }, (t, e) => e), Xb = Fl.map((t) => (9 * t + 5) % 16);
let ni = [Fl], ri = [Xb];
for (let t = 0; t < 4; t++)
  for (let e of [ni, ri])
    e.push(e[t].map((n) => Qb[n]));
const zl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Jb = ni.map((t, e) => t.map((n) => zl[e][n])), tp = ri.map((t, e) => t.map((n) => zl[e][n])), ep = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), np = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), hr = (t, e) => t << e | t >>> 32 - e;
function da(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const dr = new Uint32Array(16);
let rp = class extends ei {
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
    for (let d = 0; d < 16; d++, n += 4)
      dr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = ep[d], E = np[d], L = ni[d], M = ri[d], x = Jb[d], I = tp[d];
      for (let m = 0; m < 16; m++) {
        const H = hr(r + da(d, o, c, f) + dr[L[m]] + w, x[m]) + l | 0;
        r = l, l = f, f = hr(c, 10) | 0, c = o, o = H;
      }
      for (let m = 0; m < 16; m++) {
        const H = hr(s + da(p, i, a, u) + dr[M[m]] + E, I[m]) + g | 0;
        s = g, g = u, u = hr(a, 10) | 0, a = i, i = H;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    dr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Te(() => new rp());
const gr = BigInt(2 ** 32 - 1), io = BigInt(32);
function Rl(t, e = !1) {
  return e ? { h: Number(t & gr), l: Number(t >> io & gr) } : { h: Number(t >> io & gr) | 0, l: Number(t & gr) | 0 };
}
function sp(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Rl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const op = (t, e) => BigInt(t >>> 0) << io | BigInt(e >>> 0), ip = (t, e, n) => t >>> n, cp = (t, e, n) => t << 32 - n | e >>> n, ap = (t, e, n) => t >>> n | e << 32 - n, lp = (t, e, n) => t << 32 - n | e >>> n, fp = (t, e, n) => t << 64 - n | e >>> n - 32, up = (t, e, n) => t >>> n - 32 | e << 64 - n, hp = (t, e) => e, dp = (t, e) => t, gp = (t, e, n) => t << n | e >>> 32 - n, bp = (t, e, n) => e << n | t >>> 32 - n, pp = (t, e, n) => e << n - 32 | t >>> 64 - n, xp = (t, e, n) => t << n - 32 | e >>> 64 - n;
function wp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const yp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), mp = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Sp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ap = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ep = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), $p = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: Rl,
  split: sp,
  toBig: op,
  shrSH: ip,
  shrSL: cp,
  rotrSH: ap,
  rotrSL: lp,
  rotrBH: fp,
  rotrBL: up,
  rotr32H: hp,
  rotr32L: dp,
  rotlSH: gp,
  rotlSL: bp,
  rotlBH: pp,
  rotlBL: xp,
  add: wp,
  add3L: yp,
  add3H: mp,
  add4L: Sp,
  add4H: Ap,
  add5H: $p,
  add5L: Ep
}, [Ip, vp] = T.split([
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
].map((t) => BigInt(t))), le = new Uint32Array(80), fe = new Uint32Array(80);
let is = class extends ei {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      le[x] = e.getUint32(n), fe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = le[x - 15] | 0, m = fe[x - 15] | 0, H = T.rotrSH(I, m, 1) ^ T.rotrSH(I, m, 8) ^ T.shrSH(I, m, 7), O = T.rotrSL(I, m, 1) ^ T.rotrSL(I, m, 8) ^ T.shrSL(I, m, 7), B = le[x - 2] | 0, D = fe[x - 2] | 0, b = T.rotrSH(B, D, 19) ^ T.rotrBH(B, D, 61) ^ T.shrSH(B, D, 6), S = T.rotrSL(B, D, 19) ^ T.rotrBL(B, D, 61) ^ T.shrSL(B, D, 6), _ = T.add4L(O, S, fe[x - 7], fe[x - 16]), U = T.add4H(_, H, b, le[x - 7], le[x - 16]);
      le[x] = U | 0, fe[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = T.rotrSH(l, g, 14) ^ T.rotrSH(l, g, 18) ^ T.rotrBH(l, g, 41), m = T.rotrSL(l, g, 14) ^ T.rotrSL(l, g, 18) ^ T.rotrBL(l, g, 41), H = l & d ^ ~l & w, O = g & p ^ ~g & E, B = T.add5L(M, m, O, vp[x], fe[x]), D = T.add5H(B, L, I, H, Ip[x], le[x]), b = B | 0, S = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), _ = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), U = r & o ^ r & c ^ o & c, R = s & i ^ s & a ^ i & a;
      L = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = T.add(f | 0, u | 0, D | 0, b | 0), f = c | 0, u = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const C = T.add3L(b, _, R);
      r = T.add3H(C, D, S, U), s = C | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = T.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = T.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = T.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = T.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = T.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = T.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: L, l: M } = T.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, f, u, l, g, d, p, w, E, L, M);
  }
  roundClean() {
    le.fill(0), fe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Lp = class extends is {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Mp = class extends is {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, _p = class extends is {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Te(() => new is());
Te(() => new Lp());
Te(() => new Mp());
Te(() => new _p());
var et;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(et || (et = {}));
var co;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(co || (co = {}));
function si(t) {
  return co[t];
}
var Tr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Tr || (Tr = {}));
function Gl(t, e, n) {
  const s = Ub;
  if (zp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Tr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function Kl(t) {
  const e = rs.c32addressDecode(t);
  return {
    type: Tr.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Vl(t) {
  const e = [];
  return e.push(ht(No(t.version, 1))), e.push(ht(t.hash160)), dn(e);
}
function Wl(t) {
  const e = [], n = jn(t.content), r = n.byteLength;
  return e.push(ht(No(r, t.lengthPrefixBytes))), e.push(n), dn(e);
}
function Ct(t, e) {
  return dn([si(t), e]);
}
function Bp(t) {
  return new Uint8Array([si(t.type)]);
}
function Dp(t) {
  return t.type === et.OptionalNone ? new Uint8Array([si(t.type)]) : Ct(t.type, Rn(t.value));
}
function Np(t) {
  const e = new Uint8Array(4);
  return Wr(e, Math.ceil(t.value.length / 2), 0), Ct(t.type, Kt(e, ht(t.value)));
}
function Hp(t) {
  const e = p0(Qh(BigInt(t.value), BigInt(Ob)), kl);
  return Ct(t.type, e);
}
function Cp(t) {
  const e = p0(BigInt(t.value), kl);
  return Ct(t.type, e);
}
function Up(t) {
  return Ct(t.type, Vl(Kl(t.value)));
}
function Op(t) {
  const [e, n] = Rp(t.value);
  return Ct(t.type, Kt(Vl(Kl(e)), Wl(Gl(n))));
}
function kp(t) {
  return Ct(t.type, Rn(t.value));
}
function Pp(t) {
  const e = [], n = new Uint8Array(4);
  Wr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Rn(r);
    e.push(s);
  }
  return Ct(t.type, dn(e));
}
function jp(t) {
  const e = [], n = new Uint8Array(4);
  Wr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Gl(s);
    e.push(Wl(o));
    const i = Rn(t.value[s]);
    e.push(i);
  }
  return Ct(t.type, dn(e));
}
function ql(t, e) {
  const n = [], r = e == "ascii" ? Jh(t.value) : jn(t.value), s = new Uint8Array(4);
  return Wr(s, r.length, 0), n.push(s), n.push(r), Ct(t.type, dn(n));
}
function Tp(t) {
  return ql(t, "ascii");
}
function Fp(t) {
  return ql(t, "utf8");
}
function ga(t) {
  return xt(Rn(t));
}
function Rn(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return Bp(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return Dp(t);
    case et.Buffer:
      return Np(t);
    case et.UInt:
      return Cp(t);
    case et.Int:
      return Hp(t);
    case et.PrincipalStandard:
      return Up(t);
    case et.PrincipalContract:
      return Op(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return kp(t);
    case et.List:
      return Pp(t);
    case et.Tuple:
      return jp(t);
    case et.StringASCII:
      return Tp(t);
    case et.StringUTF8:
      return Fp(t);
    default:
      throw new Pb("Unable to serialize. Invalid Clarity Value.");
  }
}
const zp = (t, e) => t ? jn(t).length > e : !1;
function Rp(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Gp(t, e) {
  let n = t;
  if (typeof n == "number") {
    if (!Number.isInteger(n))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (n > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(n);
  }
  if (typeof n == "string")
    if (n.toLowerCase().startsWith("0x")) {
      let r = n.slice(2);
      r = r.padStart(r.length + r.length % 2, "0"), n = On(r);
    } else
      try {
        return BigInt(n);
      } catch (r) {
        if (r instanceof SyntaxError)
          throw new RangeError(`Invalid value. String integer '${n}' is not finite.`);
      }
  if (typeof n == "bigint")
    return n;
  if (n instanceof Uint8Array)
    return BigInt(`0x${Wp(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function oi(t, e = 8) {
  return (typeof t == "bigint" ? t : Gp(t)).toString(16).padStart(e * 2, "0");
}
function Yl(t, e = 16) {
  const n = oi(t, e);
  return On(n);
}
function Kp(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Vp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wp(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Vp[n];
  return e;
}
function On(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = e.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function ii(t) {
  return new TextEncoder().encode(t);
}
function qp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Yp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ba(t) {
  if (t.some(Yp))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ci(...t) {
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
function pn(t) {
  return ci(...t.map((e) => typeof e == "number" ? ba([e]) : e instanceof Array ? ba(e) : e));
}
function cs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ao;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ao || (ao = {}));
ao.Mainnet;
const Zp = 128, Qp = 128, Zl = 16;
var lo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(lo || (lo = {}));
var pa;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pa || (pa = {}));
var xa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(xa || (xa = {}));
var St;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(St || (St = {}));
const ks = ["onChainOnly", "offChainOnly", "any"];
ks[0] + "", St.OnChainOnly, ks[1] + "", St.OffChainOnly, ks[2] + "", St.Any, St.OnChainOnly + "", St.OnChainOnly, St.OffChainOnly + "", St.OffChainOnly, St.Any + "", St.Any;
var fo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fo || (fo = {}));
fo.Mainnet;
var wa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(wa || (wa = {}));
var ya;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ya || (ya = {}));
var ma;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ma || (ma = {}));
var Sa;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Sa || (Sa = {}));
var Aa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Aa || (Aa = {}));
var Ea;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ea || (Ea = {}));
var $a;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($a || ($a = {}));
var Ia;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Ia || (Ia = {}));
var va;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(va || (va = {}));
var La;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(La || (La = {}));
var Ma;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Ma || (Ma = {}));
function uo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ql(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Jp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  uo(t.outputLen), uo(t.blockLen);
}
function tx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ex(t, e) {
  Ql(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ps = {
  number: uo,
  bool: Xp,
  bytes: Ql,
  hash: Jp,
  exists: tx,
  output: ex
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const js = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Lt = (t, e) => t << 32 - e | t >>> e, nx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!nx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function rx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Xl(t) {
  if (typeof t == "string" && (t = rx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let sx = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fe(t) {
  const e = (r) => t().update(Xl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ox(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
let ai = class extends sx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = js(this.buffer);
  }
  update(e) {
    Ps.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Xl(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = js(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ps.exists(this), Ps.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    ox(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = js(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], o);
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
const ix = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jl = Uint8Array.from({ length: 16 }, (t, e) => e), cx = Jl.map((t) => (9 * t + 5) % 16);
let li = [Jl], fi = [cx];
for (let t = 0; t < 4; t++)
  for (let e of [li, fi])
    e.push(e[t].map((n) => ix[n]));
const tf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ax = li.map((t, e) => t.map((n) => tf[e][n])), lx = fi.map((t, e) => t.map((n) => tf[e][n])), fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ux = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), br = (t, e) => t << e | t >>> 32 - e;
function _a(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const pr = new Uint32Array(16);
let hx = class extends ai {
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
    for (let d = 0; d < 16; d++, n += 4)
      pr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = fx[d], E = ux[d], L = li[d], M = fi[d], x = ax[d], I = lx[d];
      for (let m = 0; m < 16; m++) {
        const H = br(r + _a(d, o, c, f) + pr[L[m]] + w, x[m]) + l | 0;
        r = l, l = f, f = br(c, 10) | 0, c = o, o = H;
      }
      for (let m = 0; m < 16; m++) {
        const H = br(s + _a(p, i, a, u) + pr[M[m]] + E, I[m]) + g | 0;
        s = g, g = u, u = br(a, 10) | 0, a = i, i = H;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    pr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Fe(() => new hx());
const dx = (t, e, n) => t & e ^ ~t & n, gx = (t, e, n) => t & e ^ t & n ^ e & n, bx = new Uint32Array([
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
]), ue = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), he = new Uint32Array(64);
let ef = class extends ai {
  constructor() {
    super(64, 32, 8, !1), this.A = ue[0] | 0, this.B = ue[1] | 0, this.C = ue[2] | 0, this.D = ue[3] | 0, this.E = ue[4] | 0, this.F = ue[5] | 0, this.G = ue[6] | 0, this.H = ue[7] | 0;
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
      he[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = he[l - 15], d = he[l - 2], p = Lt(g, 7) ^ Lt(g, 18) ^ g >>> 3, w = Lt(d, 17) ^ Lt(d, 19) ^ d >>> 10;
      he[l] = w + he[l - 7] + p + he[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = Lt(c, 6) ^ Lt(c, 11) ^ Lt(c, 25), d = u + g + dx(c, a, f) + bx[l] + he[l] | 0, w = (Lt(r, 2) ^ Lt(r, 13) ^ Lt(r, 22)) + gx(r, s, o) | 0;
      u = f, f = a, a = c, c = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, o, i, c, a, f, u);
  }
  roundClean() {
    he.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, px = class extends ef {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Fe(() => new ef());
Fe(() => new px());
const xr = BigInt(2 ** 32 - 1), ho = BigInt(32);
function nf(t, e = !1) {
  return e ? { h: Number(t & xr), l: Number(t >> ho & xr) } : { h: Number(t >> ho & xr) | 0, l: Number(t & xr) | 0 };
}
function xx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = nf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const wx = (t, e) => BigInt(t >>> 0) << ho | BigInt(e >>> 0), yx = (t, e, n) => t >>> n, mx = (t, e, n) => t << 32 - n | e >>> n, Sx = (t, e, n) => t >>> n | e << 32 - n, Ax = (t, e, n) => t << 32 - n | e >>> n, Ex = (t, e, n) => t << 64 - n | e >>> n - 32, $x = (t, e, n) => t >>> n - 32 | e << 64 - n, Ix = (t, e) => e, vx = (t, e) => t, Lx = (t, e, n) => t << n | e >>> 32 - n, Mx = (t, e, n) => e << n | t >>> 32 - n, _x = (t, e, n) => e << n - 32 | t >>> 64 - n, Bx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Dx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Nx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Cx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ux = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ox = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), kx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: nf,
  split: xx,
  toBig: wx,
  shrSH: yx,
  shrSL: mx,
  rotrSH: Sx,
  rotrSL: Ax,
  rotrBH: Ex,
  rotrBL: $x,
  rotr32H: Ix,
  rotr32L: vx,
  rotlSH: Lx,
  rotlSL: Mx,
  rotlBH: _x,
  rotlBL: Bx,
  add: Dx,
  add3L: Nx,
  add3H: Hx,
  add4L: Cx,
  add4H: Ux,
  add5H: kx,
  add5L: Ox
}, [Px, jx] = F.split([
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
].map((t) => BigInt(t))), de = new Uint32Array(80), ge = new Uint32Array(80);
let as = class extends ai {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      de[x] = e.getUint32(n), ge[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = de[x - 15] | 0, m = ge[x - 15] | 0, H = F.rotrSH(I, m, 1) ^ F.rotrSH(I, m, 8) ^ F.shrSH(I, m, 7), O = F.rotrSL(I, m, 1) ^ F.rotrSL(I, m, 8) ^ F.shrSL(I, m, 7), B = de[x - 2] | 0, D = ge[x - 2] | 0, b = F.rotrSH(B, D, 19) ^ F.rotrBH(B, D, 61) ^ F.shrSH(B, D, 6), S = F.rotrSL(B, D, 19) ^ F.rotrBL(B, D, 61) ^ F.shrSL(B, D, 6), _ = F.add4L(O, S, ge[x - 7], ge[x - 16]), U = F.add4H(_, H, b, de[x - 7], de[x - 16]);
      de[x] = U | 0, ge[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = F.rotrSH(l, g, 14) ^ F.rotrSH(l, g, 18) ^ F.rotrBH(l, g, 41), m = F.rotrSL(l, g, 14) ^ F.rotrSL(l, g, 18) ^ F.rotrBL(l, g, 41), H = l & d ^ ~l & w, O = g & p ^ ~g & E, B = F.add5L(M, m, O, jx[x], ge[x]), D = F.add5H(B, L, I, H, Px[x], de[x]), b = B | 0, S = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), _ = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), U = r & o ^ r & c ^ o & c, R = s & i ^ s & a ^ i & a;
      L = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = F.add(f | 0, u | 0, D | 0, b | 0), f = c | 0, u = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const C = F.add3L(b, _, R);
      r = F.add3H(C, D, S, U), s = C | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = F.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = F.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = F.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = F.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = F.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = F.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: L, l: M } = F.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, f, u, l, g, d, p, w, E, L, M);
  }
  roundClean() {
    de.fill(0), ge.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Tx = class extends as {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Fx = class extends as {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, zx = class extends as {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fe(() => new as());
Fe(() => new Tx());
Fe(() => new Fx());
Fe(() => new zx());
function Rx(t, e, n) {
  const s = Zp;
  if (sw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: lo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var nt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(nt || (nt = {}));
let Gx = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Kx = class extends Gx {
  constructor(e) {
    super(e);
  }
};
function rf(t) {
  const e = [];
  return e.push(On(oi(t.version, 1))), e.push(On(t.hash160)), pn(e);
}
function sf(t) {
  const e = [], n = ii(t.content), r = n.byteLength;
  return e.push(On(oi(r, t.lengthPrefixBytes))), e.push(n), pn(e);
}
function Ut(t, e) {
  return pn([t, e]);
}
function Vx(t) {
  return new Uint8Array([t.type]);
}
function Wx(t) {
  return t.type === nt.OptionalNone ? new Uint8Array([t.type]) : Ut(t.type, un(t.value));
}
function qx(t) {
  const e = new Uint8Array(4);
  return cs(e, t.buffer.length, 0), Ut(t.type, ci(e, t.buffer));
}
function Yx(t) {
  const e = Yl(Kp(t.value, BigInt(Qp)), Zl);
  return Ut(t.type, e);
}
function Zx(t) {
  const e = Yl(t.value, Zl);
  return Ut(t.type, e);
}
function Qx(t) {
  return Ut(t.type, rf(t.address));
}
function Xx(t) {
  return Ut(t.type, ci(rf(t.address), sf(t.contractName)));
}
function Jx(t) {
  return Ut(t.type, un(t.value));
}
function tw(t) {
  const e = [], n = new Uint8Array(4);
  cs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = un(r);
    e.push(s);
  }
  return Ut(t.type, pn(e));
}
function ew(t) {
  const e = [], n = new Uint8Array(4);
  cs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Rx(s);
    e.push(sf(o));
    const i = un(t.data[s]);
    e.push(i);
  }
  return Ut(t.type, pn(e));
}
function of(t, e) {
  const n = [], r = e == "ascii" ? qp(t.data) : ii(t.data), s = new Uint8Array(4);
  return cs(s, r.length, 0), n.push(s), n.push(r), Ut(t.type, pn(n));
}
function nw(t) {
  return of(t, "ascii");
}
function rw(t) {
  return of(t, "utf8");
}
function un(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return Vx(t);
    case nt.OptionalNone:
    case nt.OptionalSome:
      return Wx(t);
    case nt.Buffer:
      return qx(t);
    case nt.UInt:
      return Zx(t);
    case nt.Int:
      return Yx(t);
    case nt.PrincipalStandard:
      return Qx(t);
    case nt.PrincipalContract:
      return Xx(t);
    case nt.ResponseOk:
    case nt.ResponseErr:
      return Jx(t);
    case nt.List:
      return tw(t);
    case nt.Tuple:
      return ew(t);
    case nt.StringASCII:
      return nw(t);
    case nt.StringUTF8:
      return rw(t);
    default:
      throw new Kx("Unable to serialize. Invalid Clarity Value.");
  }
}
const sw = (t, e) => t ? ii(t).length > e : !1, ow = "connect-ui";
let vr, cf, ut = !1, go = !1;
const Wt = (t, e = "") => () => {
}, iw = (t, e) => () => {
}, cw = "{visibility:hidden}.hydrated{visibility:inherit}", Ba = {}, aw = "http://www.w3.org/2000/svg", lw = "http://www.w3.org/1999/xhtml", fw = (t) => t != null, ui = (t) => (t = typeof t, t === "object" || t === "function");
function af(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const k = (t, e, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], c = (f) => {
    for (let u = 0; u < f.length; u++)
      r = f[u], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !ui(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? bo(null, r) : r), o = s);
  };
  if (c(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((u) => f[u]).join(" "));
  }
  const a = bo(t, null);
  return a.$attrs$ = e, i.length > 0 && (a.$children$ = i), a;
}, bo = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, uw = {}, hw = (t) => t && t.$tag$ === uw, dw = (t, e) => t != null && !ui(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, gw = (t) => xn(t).$hostElement$, bw = (t, e, n) => {
  const r = st.ce(e, n);
  return t.dispatchEvent(r), r;
}, Da = /* @__PURE__ */ new WeakMap(), pw = (t, e, n) => {
  let r = Fr.get(t);
  Ow && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Fr.set(t, r);
}, xw = (t, e, n, r) => {
  var s;
  let o = lf(e);
  const i = Fr.get(o);
  if (t = t.nodeType === 11 ? t : Dt, i)
    if (typeof i == "string") {
      t = t.head || t;
      let c = Da.get(t), a;
      if (c || Da.set(t, c = /* @__PURE__ */ new Set()), !c.has(o)) {
        {
          a = Dt.createElement("style"), a.innerHTML = i;
          const f = (s = st.$nonce$) !== null && s !== void 0 ? s : af(Dt);
          f != null && a.setAttribute("nonce", f), t.insertBefore(a, t.querySelector("link"));
        }
        c && c.add(o);
      }
    } else t.adoptedStyleSheets.includes(i) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]);
  return o;
}, ww = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Wt("attachStyles", e.$tagName$), o = xw(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, lf = (t, e) => "sc-" + t.$tagName$, Na = (t, e, n, r, s, o) => {
  if (n !== r) {
    let i = Ca(t, e), c = e.toLowerCase();
    if (e === "class") {
      const a = t.classList, f = Ha(n), u = Ha(r);
      a.remove(...f.filter((l) => l && !u.includes(l))), a.add(...u.filter((l) => l && !f.includes(l)));
    } else if (!i && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Ca(ls, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && st.rel(t, e, n, !1), r && st.ael(t, e, r, !1);
    else {
      const a = ui(r);
      if ((i || a && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? i = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!i || o & 4 || s) && !a && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, yw = /\s/, Ha = (t) => t ? t.split(yw) : [], ff = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, o = t && t.$attrs$ || Ba, i = e.$attrs$ || Ba;
  for (r in o)
    r in i || Na(s, r, o[r], void 0, n, e.$flags$);
  for (r in i)
    Na(s, r, o[r], i[r], n, e.$flags$);
}, hi = (t, e, n, r) => {
  const s = e.$children$[n];
  let o = 0, i, c;
  if (s.$text$ !== null)
    i = s.$elm$ = Dt.createTextNode(s.$text$);
  else {
    if (ut || (ut = s.$tag$ === "svg"), i = s.$elm$ = Dt.createElementNS(ut ? aw : lw, s.$tag$), ut && s.$tag$ === "foreignObject" && (ut = !1), ff(null, s, ut), fw(vr) && i["s-si"] !== vr && i.classList.add(i["s-si"] = vr), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        c = hi(t, s, o), c && i.appendChild(c);
    s.$tag$ === "svg" ? ut = !1 : i.tagName === "foreignObject" && (ut = !0);
  }
  return i;
}, uf = (t, e, n, r, s, o) => {
  let i = t, c;
  for (i.shadowRoot && i.tagName === cf && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (c = hi(null, n, s), c && (r[s].$elm$ = c, i.insertBefore(c, e)));
}, hf = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, mw = (t, e, n, r) => {
  let s = 0, o = 0, i = e.length - 1, c = e[0], a = e[i], f = r.length - 1, u = r[0], l = r[f], g;
  for (; s <= i && o <= f; )
    c == null ? c = e[++s] : a == null ? a = e[--i] : u == null ? u = r[++o] : l == null ? l = r[--f] : wr(c, u) ? (Ln(c, u), c = e[++s], u = r[++o]) : wr(a, l) ? (Ln(a, l), a = e[--i], l = r[--f]) : wr(c, l) ? (Ln(c, l), t.insertBefore(c.$elm$, a.$elm$.nextSibling), c = e[++s], l = r[--f]) : wr(a, u) ? (Ln(a, u), t.insertBefore(a.$elm$, c.$elm$), a = e[--i], u = r[++o]) : (g = hi(e && e[o], n, o), u = r[++o], g && c.$elm$.parentNode.insertBefore(g, c.$elm$));
  s > i ? uf(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, o, f) : o > f && hf(e, s, i);
}, wr = (t, e) => t.$tag$ === e.$tag$, Ln = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, o = e.$tag$, i = e.$text$;
  i === null ? (ut = o === "svg" ? !0 : o === "foreignObject" ? !1 : ut, ff(t, e, ut), r !== null && s !== null ? mw(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), uf(n, null, e, s, 0, s.length - 1)) : r !== null && hf(r, 0, r.length - 1), ut && o === "svg" && (ut = !1)) : t.$text$ !== i && (n.data = i);
}, Sw = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || bo(null, null), s = hw(e) ? e : k(null, null, e);
  cf = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, vr = n["s-sc"], Ln(r, s);
}, df = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, di = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return df(t, t.$ancestorComponent$), Pw(() => Aw(t, e));
}, Aw = (t, e) => {
  const n = Wt("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), vw(s, () => Ew(t, r, e));
}, Ew = async (t, e, n) => {
  const r = t.$hostElement$, s = Wt("update", t.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && ww(t);
  const i = Wt("render", t.$cmpMeta$.$tagName$);
  $w(t, e), o && (o.map((c) => c()), r["s-rc"] = void 0), i(), s();
  {
    const c = r["s-p"], a = () => Iw(t);
    c.length === 0 ? a() : (Promise.all(c).then(a), t.$flags$ |= 4, c.length = 0);
  }
}, $w = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Sw(t, e);
  } catch (r) {
    kn(r, t.$hostElement$);
  }
  return null;
}, Iw = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Wt("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, bf(n), r(), t.$onReadyResolve$(n), s || gf()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && bi(() => di(t, !1)), t.$flags$ &= -517;
}, gf = (t) => {
  bf(Dt.documentElement), bi(() => bw(ls, "appload", { detail: { namespace: ow } }));
}, vw = (t, e) => t && t.then ? t.then(e) : e(), bf = (t) => t.classList.add("hydrated"), Lw = (t, e) => xn(t).$instanceValues$.get(e), Mw = (t, e, n, r) => {
  const s = xn(t), o = s.$instanceValues$.get(e), i = s.$flags$, c = s.$lazyInstance$;
  n = dw(n, r.$members$[e][0]);
  const a = Number.isNaN(o) && Number.isNaN(n), f = n !== o && !a;
  (!(i & 8) || o === void 0) && f && (s.$instanceValues$.set(e, n), c && (i & 18) === 2 && di(s, !1));
}, pf = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return Lw(this, o);
        },
        set(c) {
          Mw(this, o, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, c, a) {
        st.jmp(() => {
          const f = o.get(i);
          if (this.hasOwnProperty(f))
            a = this[f], delete this[f];
          else if (s.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == a)
            return;
          this[f] = a === null && typeof this[f] == "boolean" ? !1 : a;
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
}, _w = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Uw(n), s.then) {
        const a = iw();
        s = await s, a();
      }
      s.isProxied || (pf(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = Wt("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (a) {
        kn(a);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const a = lf(n);
      if (!Fr.has(a)) {
        const f = Wt("registerStyles", n.$tagName$);
        pw(a, c, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const o = e.$ancestorComponent$, i = () => di(e, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, Bw = (t) => {
  if (!(st.$flags$ & 1)) {
    const e = xn(t), n = e.$cmpMeta$, r = Wt("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            df(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && t.hasOwnProperty(s)) {
          const i = t[s];
          delete t[s], t[s] = i;
        }
      }), _w(t, e, n);
    }
    r();
  }
}, Dw = (t) => {
  st.$flags$ & 1 || xn(t);
}, Nw = (t, e = {}) => {
  var n;
  const r = Wt(), s = [], o = e.exclude || [], i = ls.customElements, c = Dt.head, a = /* @__PURE__ */ c.querySelector("meta[charset]"), f = /* @__PURE__ */ Dt.createElement("style"), u = [];
  let l, g = !0;
  Object.assign(st, e), st.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Dt.baseURI).href, t.map((d) => {
    d[1].map((p) => {
      const w = {
        $flags$: p[0],
        $tagName$: p[1],
        $members$: p[2],
        $listeners$: p[3]
      };
      w.$members$ = p[2];
      const E = w.$tagName$, L = class extends HTMLElement {
        // StencilLazyHost
        constructor(M) {
          super(M), M = this, Cw(M, w), w.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? u.push(this) : st.jmp(() => Bw(this));
        }
        disconnectedCallback() {
          st.jmp(() => Dw(this));
        }
        componentOnReady() {
          return xn(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = d[0], !o.includes(E) && !i.get(E) && (s.push(E), i.define(E, pf(
        L,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + cw, f.setAttribute("data-styles", "");
    const d = (n = st.$nonce$) !== null && n !== void 0 ? n : af(Dt);
    d != null && f.setAttribute("nonce", d), c.insertBefore(f, a ? a.nextSibling : c.firstChild);
  }
  g = !1, u.length ? u.map((d) => d.connectedCallback()) : st.jmp(() => l = setTimeout(gf, 30)), r();
}, gi = /* @__PURE__ */ new WeakMap(), xn = (t) => gi.get(t), Hw = (t, e) => gi.set(e.$lazyInstance$ = t, e), Cw = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], gi.set(t, n);
}, Ca = (t, e) => e in t, kn = (t, e) => (0, console.error)(t, e), Ts = /* @__PURE__ */ new Map(), Uw = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, o = Ts.get(s);
  if (o)
    return o[r];
  {
    const i = (c) => (Ts.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => s4).then(i, kn);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (Ts.set(s, i), i[r]), kn);
}, Fr = /* @__PURE__ */ new Map(), ls = typeof window < "u" ? window : {}, Dt = ls.document || { head: {} }, st = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, xf = (t) => Promise.resolve(t), Ow = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ua = [], wf = [], kw = (t, e) => (n) => {
  t.push(n), go || (go = !0, st.$flags$ & 4 ? bi(po) : st.raf(po));
}, Oa = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      kn(n);
    }
  t.length = 0;
}, po = () => {
  Oa(Ua), Oa(wf), (go = Ua.length > 0) && st.raf(po);
}, bi = (t) => xf().then(t), Pw = /* @__PURE__ */ kw(wf), jw = () => xf(), yf = (t, e) => typeof window > "u" ? Promise.resolve() : jw().then(() => Nw([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Tw = Object.defineProperty, Fw = Object.defineProperties, zw = Object.getOwnPropertyDescriptors, zr = Object.getOwnPropertySymbols, mf = Object.prototype.hasOwnProperty, Sf = Object.prototype.propertyIsEnumerable, ka = (t, e, n) => e in t ? Tw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, xo = (t, e) => {
  for (var n in e || (e = {})) mf.call(e, n) && ka(t, n, e[n]);
  if (zr) for (var n of zr(e)) Sf.call(e, n) && ka(t, n, e[n]);
  return t;
}, wo = (t, e) => Fw(t, zw(e)), Rw = (t, e) => {
  var n = {};
  for (var r in t) mf.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && zr) for (var r of zr(t)) e.indexOf(r) < 0 && Sf.call(t, r) && (n[r] = t[r]);
  return n;
};
function Af() {
  return os(Ht()) || window.StacksProvider || window.BlockstackProvider;
}
function Gw(t) {
  return t ? typeof t == "string" ? Oe.fromName(t) : "version" in t ? t : "url" in t ? new no({ url: t.url }) : t.transactionVersion === jr.Mainnet ? new no({ url: t.client.baseUrl }) : new ro({ url: t.client.baseUrl }) : new ro();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Kw = (t) => {
  if (!t) {
    let e = new qr(["store_write"], document.location.href);
    t = new Un({ appConfig: e });
  }
  return t;
}, Vw = async (t, e = Af()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: o, sendToSignIn: i = !1, userSession: c, appDetails: a } = t, f = Kw(c);
  f.isUserSignedIn() && f.signUserOut();
  let u = f.generateAndStoreTransitKey(), l = f.makeAuthRequest(u, `${document.location.origin}${n}`, `${document.location.origin}${r}`, f.appConfig.scopes, void 0, void 0, { sendToSignIn: i, appDetails: a, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await f.handlePendingSignIn(g);
    let d = ot.decodeToken(g), p = d == null ? void 0 : d.payload;
    s == null || s({ authResponse: g, authResponsePayload: p, userSession: f });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), o == null || o();
  }
}, Ww = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Ww || {}), qw = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(qw || {}), Ef = (t) => {
  let e = t;
  if (!e) {
    let n = new qr(["store_write"], document.location.href);
    e = new Un({ appConfig: n });
  }
  return e;
};
function Yw(t) {
  try {
    return Ef(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Zw = (t) => {
  let e = Ef(t).loadUserData().appPrivateKey, n = ot.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function $f(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? wo(xo({}, t), { message: ga(e), domain: ga(n) }) : wo(xo({}, t), { message: xt(un(e)), domain: xt(un(n)) });
}
async function Qw(t, e) {
  return new ot.TokenSigner("ES256k", e).signAsync($f(t));
}
async function Xw(t) {
  let e = t, { userSession: n } = e, r = Rw(e, ["userSession"]);
  if (Yw(n)) {
    let { privateKey: s, publicKey: o } = Zw(n), i = wo(xo({}, r), { publicKey: o });
    return Qw(i, s);
  }
  return ot.createUnsecuredToken($f(t));
}
var Jw = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Jw || {}), If = "asigna-stx", Pa = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === If && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(ey(t, e), "*");
}), ty = { authenticationRequest: async (t) => Pa(t, "authenticationRequest"), transactionRequest: async (t) => Pa(t, "transactionRequest") }, ey = (t, e) => ({ source: If, [e]: t }), ny = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = ty);
};
ny();
var vf = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function ry(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let o = Ht(), i = Af();
    if (o && i) return t(n, i);
    if (typeof window > "u") return;
    yf();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : vf, a = Ib(c), f = document.createElement("connect-modal");
    f.defaultProviders = c, f.installedProviders = a, f.persistSelection = e;
    let u = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = u;
    };
    f.callback = (d) => {
      l(), t(n, d);
    }, f.cancelCallback = () => {
      var d;
      l(), (d = n.onCancel) == null || d.call(n);
    }, document.body.appendChild(f);
    let g = (d) => {
      d.key === "Escape" && (document.removeEventListener("keydown", g), f.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var sy = ry(Vw, !1), oy = Ul;
function Lf(t, e) {
  let n = t;
  if (typeof n == "number") {
    if (!Number.isInteger(n))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (n > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(n);
  }
  if (typeof n == "string")
    if (n.toLowerCase().startsWith("0x")) {
      let r = n.slice(2);
      r = r.padStart(r.length + r.length % 2, "0"), n = Pn(r);
    } else
      try {
        return BigInt(n);
      } catch (r) {
        if (r instanceof SyntaxError)
          throw new RangeError(`Invalid value. String integer '${n}' is not finite.`);
      }
  if (typeof n == "bigint")
    return n;
  if (n instanceof Uint8Array)
    return BigInt(`0x${_f(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function pi(t, e = 8) {
  return (typeof t == "bigint" ? t : Lf(t)).toString(16).padStart(e * 2, "0");
}
function Mf(t, e = 16) {
  const n = pi(t, e);
  return Pn(n);
}
function iy(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const cy = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _f(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += cy[n];
  return e;
}
function Pn(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = e.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function xi(t) {
  return new TextEncoder().encode(t);
}
function ay(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function ly(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ja(t) {
  if (t.some(ly))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function wi(...t) {
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
function wn(t) {
  return wi(...t.map((e) => typeof e == "number" ? ja([e]) : e instanceof Array ? ja(e) : e));
}
function fs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yo || (yo = {}));
yo.Mainnet;
const fy = 128, uy = 128, Bf = 16;
var mo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(mo || (mo = {}));
var Ta;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ta || (Ta = {}));
var Fa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Fa || (Fa = {}));
var At;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(At || (At = {}));
const Fs = ["onChainOnly", "offChainOnly", "any"];
Fs[0] + "", At.OnChainOnly, Fs[1] + "", At.OffChainOnly, Fs[2] + "", At.Any, At.OnChainOnly + "", At.OnChainOnly, At.OffChainOnly + "", At.OffChainOnly, At.Any + "", At.Any;
var So;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(So || (So = {}));
So.Mainnet;
var za;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(za || (za = {}));
var Ra;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ra || (Ra = {}));
var Ga;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ga || (Ga = {}));
var Ka;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ka || (Ka = {}));
var Va;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Va || (Va = {}));
var Wa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Wa || (Wa = {}));
var qa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qa || (qa = {}));
var Ya;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Ya || (Ya = {}));
var Za;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Za || (Za = {}));
var Qa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qa || (Qa = {}));
var Xa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Xa || (Xa = {}));
function Ao(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function hy(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Df(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function dy(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ao(t.outputLen), Ao(t.blockLen);
}
function gy(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function by(t, e) {
  Df(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: Ao,
  bool: hy,
  bytes: Df,
  hash: dy,
  exists: gy,
  output: by
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Rs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mt = (t, e) => t << 32 - e | t >>> e, py = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!py)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function xy(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nf(t) {
  if (typeof t == "string" && (t = xy(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class wy {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ze(t) {
  const e = (r) => t().update(Nf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function yy(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
class yi extends wy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Rs(this.buffer);
  }
  update(e) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Rs(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zs.exists(this), zs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    yy(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Rs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], o);
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
const my = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hf = Uint8Array.from({ length: 16 }, (t, e) => e), Sy = Hf.map((t) => (9 * t + 5) % 16);
let mi = [Hf], Si = [Sy];
for (let t = 0; t < 4; t++)
  for (let e of [mi, Si])
    e.push(e[t].map((n) => my[n]));
const Cf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ay = mi.map((t, e) => t.map((n) => Cf[e][n])), Ey = Si.map((t, e) => t.map((n) => Cf[e][n])), $y = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Iy = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yr = (t, e) => t << e | t >>> 32 - e;
function Ja(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const mr = new Uint32Array(16);
class vy extends yi {
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
    for (let d = 0; d < 16; d++, n += 4)
      mr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = $y[d], E = Iy[d], L = mi[d], M = Si[d], x = Ay[d], I = Ey[d];
      for (let m = 0; m < 16; m++) {
        const H = yr(r + Ja(d, o, c, f) + mr[L[m]] + w, x[m]) + l | 0;
        r = l, l = f, f = yr(c, 10) | 0, c = o, o = H;
      }
      for (let m = 0; m < 16; m++) {
        const H = yr(s + Ja(p, i, a, u) + mr[M[m]] + E, I[m]) + g | 0;
        s = g, g = u, u = yr(a, 10) | 0, a = i, i = H;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    mr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
ze(() => new vy());
const Ly = (t, e, n) => t & e ^ ~t & n, My = (t, e, n) => t & e ^ t & n ^ e & n, _y = new Uint32Array([
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
]), be = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), pe = new Uint32Array(64);
class Uf extends yi {
  constructor() {
    super(64, 32, 8, !1), this.A = be[0] | 0, this.B = be[1] | 0, this.C = be[2] | 0, this.D = be[3] | 0, this.E = be[4] | 0, this.F = be[5] | 0, this.G = be[6] | 0, this.H = be[7] | 0;
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
      pe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = pe[l - 15], d = pe[l - 2], p = Mt(g, 7) ^ Mt(g, 18) ^ g >>> 3, w = Mt(d, 17) ^ Mt(d, 19) ^ d >>> 10;
      pe[l] = w + pe[l - 7] + p + pe[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = Mt(c, 6) ^ Mt(c, 11) ^ Mt(c, 25), d = u + g + Ly(c, a, f) + _y[l] + pe[l] | 0, w = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + My(r, s, o) | 0;
      u = f, f = a, a = c, c = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, o, i, c, a, f, u);
  }
  roundClean() {
    pe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class By extends Uf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
ze(() => new Uf());
ze(() => new By());
const Sr = BigInt(2 ** 32 - 1), Eo = BigInt(32);
function Of(t, e = !1) {
  return e ? { h: Number(t & Sr), l: Number(t >> Eo & Sr) } : { h: Number(t >> Eo & Sr) | 0, l: Number(t & Sr) | 0 };
}
function Dy(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Of(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Ny = (t, e) => BigInt(t >>> 0) << Eo | BigInt(e >>> 0), Hy = (t, e, n) => t >>> n, Cy = (t, e, n) => t << 32 - n | e >>> n, Uy = (t, e, n) => t >>> n | e << 32 - n, Oy = (t, e, n) => t << 32 - n | e >>> n, ky = (t, e, n) => t << 64 - n | e >>> n - 32, Py = (t, e, n) => t >>> n - 32 | e << 64 - n, jy = (t, e) => e, Ty = (t, e) => t, Fy = (t, e, n) => t << n | e >>> 32 - n, zy = (t, e, n) => e << n | t >>> 32 - n, Ry = (t, e, n) => e << n - 32 | t >>> 64 - n, Gy = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ky(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Vy = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Wy = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, qy = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Yy = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Zy = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Qy = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: Of,
  split: Dy,
  toBig: Ny,
  shrSH: Hy,
  shrSL: Cy,
  rotrSH: Uy,
  rotrSL: Oy,
  rotrBH: ky,
  rotrBL: Py,
  rotr32H: jy,
  rotr32L: Ty,
  rotlSH: Fy,
  rotlSL: zy,
  rotlBH: Ry,
  rotlBL: Gy,
  add: Ky,
  add3L: Vy,
  add3H: Wy,
  add4L: qy,
  add4H: Yy,
  add5H: Qy,
  add5L: Zy
}, [Xy, Jy] = z.split([
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
].map((t) => BigInt(t))), xe = new Uint32Array(80), we = new Uint32Array(80);
class us extends yi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      xe[x] = e.getUint32(n), we[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = xe[x - 15] | 0, m = we[x - 15] | 0, H = z.rotrSH(I, m, 1) ^ z.rotrSH(I, m, 8) ^ z.shrSH(I, m, 7), O = z.rotrSL(I, m, 1) ^ z.rotrSL(I, m, 8) ^ z.shrSL(I, m, 7), B = xe[x - 2] | 0, D = we[x - 2] | 0, b = z.rotrSH(B, D, 19) ^ z.rotrBH(B, D, 61) ^ z.shrSH(B, D, 6), S = z.rotrSL(B, D, 19) ^ z.rotrBL(B, D, 61) ^ z.shrSL(B, D, 6), _ = z.add4L(O, S, we[x - 7], we[x - 16]), U = z.add4H(_, H, b, xe[x - 7], xe[x - 16]);
      xe[x] = U | 0, we[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: L, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const I = z.rotrSH(l, g, 14) ^ z.rotrSH(l, g, 18) ^ z.rotrBH(l, g, 41), m = z.rotrSL(l, g, 14) ^ z.rotrSL(l, g, 18) ^ z.rotrBL(l, g, 41), H = l & d ^ ~l & w, O = g & p ^ ~g & E, B = z.add5L(M, m, O, Jy[x], we[x]), D = z.add5H(B, L, I, H, Xy[x], xe[x]), b = B | 0, S = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), _ = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), U = r & o ^ r & c ^ o & c, R = s & i ^ s & a ^ i & a;
      L = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = z.add(f | 0, u | 0, D | 0, b | 0), f = c | 0, u = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const C = z.add3L(b, _, R);
      r = z.add3H(C, D, S, U), s = C | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = z.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = z.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = z.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = z.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: L, l: M } = z.add(this.Hh | 0, this.Hl | 0, L | 0, M | 0), this.set(r, s, o, i, c, a, f, u, l, g, d, p, w, E, L, M);
  }
  roundClean() {
    xe.fill(0), we.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class t3 extends us {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class e3 extends us {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class n3 extends us {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ze(() => new us());
ze(() => new t3());
ze(() => new e3());
ze(() => new n3());
function r3(t, e, n) {
  const s = fy;
  if (y3(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: mo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Q;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Q || (Q = {}));
const t0 = BigInt("0xffffffffffffffffffffffffffffffff"), s3 = BigInt(0);
BigInt("0x7fffffffffffffffffffffffffffffff");
BigInt("-170141183460469231731687303715884105728");
const e0 = (t) => {
  const e = Lf(t);
  if (e < s3)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > t0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${t0}`);
  return { type: Q.UInt, value: e };
};
function n0(t) {
  for (const e in t)
    if (!m3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Q.Tuple, data: t };
}
const In = (t) => ({ type: Q.StringASCII, data: t });
class o3 extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class i3 extends o3 {
  constructor(e) {
    super(e);
  }
}
function kf(t) {
  const e = [];
  return e.push(Pn(pi(t.version, 1))), e.push(Pn(t.hash160)), wn(e);
}
function Pf(t) {
  const e = [], n = xi(t.content), r = n.byteLength;
  return e.push(Pn(pi(r, t.lengthPrefixBytes))), e.push(n), wn(e);
}
function Ot(t, e) {
  return wn([t, e]);
}
function c3(t) {
  return new Uint8Array([t.type]);
}
function a3(t) {
  return t.type === Q.OptionalNone ? new Uint8Array([t.type]) : Ot(t.type, Gn(t.value));
}
function l3(t) {
  const e = new Uint8Array(4);
  return fs(e, t.buffer.length, 0), Ot(t.type, wi(e, t.buffer));
}
function f3(t) {
  const e = Mf(iy(t.value, BigInt(uy)), Bf);
  return Ot(t.type, e);
}
function u3(t) {
  const e = Mf(t.value, Bf);
  return Ot(t.type, e);
}
function h3(t) {
  return Ot(t.type, kf(t.address));
}
function d3(t) {
  return Ot(t.type, wi(kf(t.address), Pf(t.contractName)));
}
function g3(t) {
  return Ot(t.type, Gn(t.value));
}
function b3(t) {
  const e = [], n = new Uint8Array(4);
  fs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Gn(r);
    e.push(s);
  }
  return Ot(t.type, wn(e));
}
function p3(t) {
  const e = [], n = new Uint8Array(4);
  fs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = r3(s);
    e.push(Pf(o));
    const i = Gn(t.data[s]);
    e.push(i);
  }
  return Ot(t.type, wn(e));
}
function jf(t, e) {
  const n = [], r = e == "ascii" ? ay(t.data) : xi(t.data), s = new Uint8Array(4);
  return fs(s, r.length, 0), n.push(s), n.push(r), Ot(t.type, wn(n));
}
function x3(t) {
  return jf(t, "ascii");
}
function w3(t) {
  return jf(t, "utf8");
}
function Gn(t) {
  switch (t.type) {
    case Q.BoolTrue:
    case Q.BoolFalse:
      return c3(t);
    case Q.OptionalNone:
    case Q.OptionalSome:
      return a3(t);
    case Q.Buffer:
      return l3(t);
    case Q.UInt:
      return u3(t);
    case Q.Int:
      return f3(t);
    case Q.PrincipalStandard:
      return h3(t);
    case Q.PrincipalContract:
      return d3(t);
    case Q.ResponseOk:
    case Q.ResponseErr:
      return g3(t);
    case Q.List:
      return b3(t);
    case Q.Tuple:
      return p3(t);
    case Q.StringASCII:
      return x3(t);
    case Q.StringUTF8:
      return w3(t);
    default:
      throw new i3("Unable to serialize. Invalid Clarity Value.");
  }
}
const y3 = (t, e) => t ? xi(t).length > e : !1;
function m3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function S3(t) {
  const e = Gn(t);
  return `0x${_f(e)}`;
}
const Dn = (t) => {
  try {
    return rs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
}, A3 = ["store_write"], r0 = "/manifest.json", E3 = /* @__PURE__ */ new Set([4001, -31001]), $3 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Ai = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Kn = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), yn = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, tn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, $o = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Ei = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => $o(o, r)) === s
  );
}, Tf = (t) => t ? Ei(yn()).some(
  (e) => {
    var n;
    return e.id === t && (Kn(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ff = () => {
  if (typeof window > "u")
    return;
  const t = yn(), e = Ei(t).filter(
    (n) => {
      var r;
      return Kn(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = tn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of $3) {
    const r = tn(t, n) ?? (t === window ? void 0 : tn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, zf = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = yn(), n = tn(e, t) ?? (e === window ? void 0 : tn(window, t)) ?? os(t);
  if (n)
    return n;
  if (Kn(t) || Tf(t))
    return Ff();
}, I3 = (t) => {
  const e = yn();
  if (!e)
    return [];
  const n = Ei(e), r = t.filter(
    (o) => !n.some((i) => $o(i, o)) && !!tn(e, o.id)
  );
  return n.map((o) => {
    const i = t.find((c) => $o(o, c));
    return i != null && i.icon ? { ...o, icon: i.icon } : o;
  }).concat(r);
}, qt = () => ({ isConnected: !1 }), v3 = ["blockstack-session", "blockstack"], Rf = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of v3) {
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
Rf();
const L3 = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Xe = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Io = (t, e = "mainnet") => {
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
      return Io(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Io(r, e);
  }
  return e;
}, vo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Dn(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const o = vo(s, e + 1);
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
    const o = vo(n[s], e + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Dn(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Dn(n.testnet) ? n.testnet.trim() : null;
}, s0 = (t) => {
  const e = Xe(t);
  if (!e)
    return null;
  const n = L3(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, Lo = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const c = Lo(i, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : s0(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((i) => Xe(i)).find((i) => i && Dn(i)), o = [r.publicKey, r.public_key, r.stxPublicKey].map((i) => s0(i)).find(Boolean);
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
    const c = Lo(r[i], e, n + 1);
    if (c)
      return c;
  }
  return null;
}, M3 = (t) => {
  var o;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((o = e.stxAddress) == null ? void 0 : o.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && Dn(n) ? n.trim() : null;
  if (!r)
    return qt();
  const s = Mo(r);
  return s !== "mainnet" ? qt() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, _3 = (t, e = "mainnet") => {
  const n = vo(t);
  if (!n)
    return qt();
  const r = Mo(n) ?? Io(t, e);
  if (r !== "mainnet")
    return qt();
  const s = Lo(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, $i = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ii = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && E3.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Rr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Xe(n == null ? void 0 : n.message) ?? Xe(e.message) ?? Xe(e.error) ?? Xe(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Gf = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Rr(e);
    if (e.status === "error")
      throw Rr(e.result ?? e);
  }
  return t;
}, vi = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Gf(r);
  } catch (r) {
    throw Rr(r);
  }
}, Kf = () => Ff(), Gr = (t) => {
  var r, s;
  const e = Ht();
  if (Kn(e) || Tf(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = yn() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Kf();
}, o0 = async (t, e, n) => {
  if (!Gr(t))
    return vi(t, e, n);
  const r = Kf();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return Gf(await r.request(e, n));
  } catch (s) {
    throw Rr(s);
  }
}, B3 = (t) => {
}, Vf = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Vf(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, D3 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], N3 = async (t) => {
  const e = Ht();
  if (Gr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!Ai(e))
    return D3;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Vf(await vi(t, "supportedMethods"));
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
}, H3 = async (t) => {
  if (Gr(t))
    try {
      await o0(t, "wallet_disconnect");
    } catch {
    }
  const e = await N3(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await o0(t, r), o = _3(s);
      if (o.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!o.publicKey
        }), Gr(t) && B3(o.address), o;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const o = $i(s);
      if ((o ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Ii(s))
        return qt();
      if (o)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return qt();
}, C3 = async (t, e) => {
  const n = new qr(A3, void 0, "", r0), r = new Un({ appConfig: n });
  return new Promise((s) => {
    sy(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: r0,
        userSession: r,
        onFinish: (o) => {
          s(M3(o.userSession.loadUserData()));
        },
        onCancel: () => {
          s(qt());
        }
      },
      e
    );
  });
}, U3 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : Ht(), r = zf(n);
  return r ? (e && n && Cl(n), r) : null;
}, O3 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return yf(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = vf, o = I3(s), i = document.body.style.overflow, c = () => {
      document.body.style.overflow = i, document.removeEventListener("keydown", a), r.remove();
    }, a = (f) => {
      f.key === "Escape" && (c(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = o, r.persistSelection = e, r.callback = (f) => {
      const u = U3(f, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof f == "string" ? f : Ht() ?? "provider-object",
        resolved: !!u,
        requestBridge: typeof (u == null ? void 0 : u.request) == "function"
      }), c(), n(u);
    }, r.cancelCallback = () => {
      c(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", a), document.body.appendChild(r);
  });
}, Li = () => Ht(), Wf = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Ht(), e = t ? zf(t) : void 0;
  if (e)
    return e;
  const n = yn() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, k3 = async (t) => {
  Rf();
  const e = await O3({});
  if (!e)
    return qt();
  if (typeof e.request == "function")
    try {
      const n = await H3(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Ii(n))
        return qt();
      if (!$i(n))
        throw n;
    }
  return C3(t, e);
}, P3 = () => {
  const t = Ht();
  return Ai(t) ? "leather" : Kn(t) ? "xverse" : t ? String(t) : void 0;
}, j3 = async (t) => {
  const e = Ph("wallet_connect");
  vn({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await k3(t);
    return n.isConnected && n.address ? (_o(n.address, P3()), Bo(n.network), vn({ journey: e, step: "authorize", outcome: "success" })) : vn({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw vn({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: Hh(n),
      error: n
    }), n;
  }
}, T3 = async () => {
  const t = Wf();
  if (t && Ai(Ht()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await vi(t, e);
        break;
      } catch (n) {
        if (Ii(n) || $i(n))
          continue;
      }
  oy(), Ul(), _o(null), Bo(null), vn({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, F3 = (t) => {
  const e = Mh(), n = () => {
    e.clear();
  }, r = () => {
    const i = e.load();
    return i.isConnected && i.address && (_o(i.address), Bo(i.network)), i;
  };
  return {
    connect: async () => {
      const i = r(), c = await j3({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return c.isConnected ? (e.save(c), c) : i.isConnected ? i : c;
    },
    disconnect: async () => {
      await T3(), n();
    },
    getSession: r
  };
}, i0 = (t) => S3(t).replace(/^0x/, ""), c0 = "This wallet cannot sign messages. Try Xverse or Leather.", a0 = (t) => typeof (t == null ? void 0 : t.request) == "function", l0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", z3 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, R3 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function G3(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: i0(e.message),
    domain: i0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function K3(t, e) {
  const n = await Xw({
    domain: e.domain,
    message: e.message,
    network: Gw(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function V3(t) {
  var s, o;
  const e = Li() || "", n = /xverse/i.test(e);
  let r = Wf();
  if (n && !l0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (l0(r))
    try {
      return await K3(r, t);
    } catch (i) {
      if (n || !a0(r) || !R3(i)) throw i;
    }
  if (!n && a0(r))
    try {
      return await G3(r, t);
    } catch (i) {
      throw z3(i) ? new Error(c0) : i;
    }
  throw new Error(c0);
}
const W3 = "ParallaX Casino", q3 = "Casino room entry; no spending permission";
new TextEncoder();
new TextDecoder();
const Y3 = (t) => t === "mainnet" ? 1 : 2147483648, Z3 = (t) => ({
  domain: n0({
    name: In(W3),
    version: In("1"),
    "chain-id": e0(Y3(t.network))
  }),
  message: n0({
    purpose: In(q3),
    address: In(t.address),
    nonce: In(t.nonce),
    expires: e0(t.expires)
  })
}), qf = [
  "blackjack.1",
  "blackjack.2",
  "baccarat.1",
  "baccarat.2",
  "holdem.1",
  "holdem.2",
  "roulette.pad",
  "videopoker.pad",
  "pvpholdem.1",
  "pvpholdem.2",
  "pvpholdem.3",
  "liars.1",
  "liars.2",
  "liars.3",
  "bf.pad",
  "drop.pad",
  "twins.pad",
  "ds.pad",
  "nv.pad",
  "ex.pad",
  "bar.1",
  "bar.2",
  "bar.3",
  "bar.4"
];
new Set(qf);
const mn = F3({ appName: "ParallaX Casino", appIcon: "/favicon.ico" }), X = (t) => document.getElementById(t), $ = {
  signedAs: null,
  spots: {},
  joined: 0,
  guests: 0,
  you: null,
  ws: null,
  wantSpot: null,
  attempts: 0,
  reconnects: 0,
  lastClose: null,
  replaced: !1,
  timers: {},
  results: {},
  opened: 0,
  pingSent: 0,
  idleCheck: null
}, Q3 = performance.now(), Y = (t) => {
  const e = X("log");
  e.textContent += `${((performance.now() - Q3) / 1e3).toFixed(1).padStart(6)}s  ${t}
`, e.scrollTop = e.scrollHeight;
}, dt = (t, e, n = "") => {
  const r = X(t);
  r.textContent = e, r.className = "status " + (n || "dim");
}, Yf = (t) => t ? `${t.slice(0, 5)}…${t.slice(-4)}` : "Guest", Rt = (t) => t instanceof Error ? t.message : String(t), Mi = () => {
  const t = mn.getSession(), e = !!(t.isConnected && t.address);
  X("signin").disabled = !e, X("disconnect").disabled = !e, dt("walletStatus", e ? `Connected: ${t.address} (${t.network ?? "network unknown"}, ${Li() || "wallet unknown"})` : "Not connected.", e ? "ok" : "");
};
X("connect").onclick = async () => {
  try {
    Y("connect: opening the wallet chooser");
    const t = await mn.connect();
    Y(`connect: ${t.isConnected ? "ok " + Yf(t.address) : "cancelled"}`);
  } catch (t) {
    Y("connect failed: " + Rt(t)), dt("walletStatus", "Could not connect: " + Rt(t), "bad"), $.results.connect = "error: " + Rt(t);
    return;
  }
  $.results.connect = "ok", Mi();
};
X("disconnect").onclick = async () => {
  await mn.disconnect(), Y("wallet disconnected"), Mi();
};
const Kr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
};
X("signin").onclick = async () => {
  const t = mn.getSession();
  if (!t.isConnected || !t.address) return;
  const e = X("signin");
  e.disabled = !0;
  try {
    dt("signStatus", "Asking the room for a sign-in request…");
    const n = performance.now(), { res: r, body: s } = await Kr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
    if ($.timers.challengeMs = Math.round(performance.now() - n), !r.ok) throw new Error((s == null ? void 0 : s.error) || `The room answered ${r.status}.`);
    const o = s.challenge;
    Y(`challenge: ok (${$.timers.challengeMs} ms), network ${o.network}`), dt("signStatus", "Your wallet should now ask you to sign. This is free.");
    const { domain: i, message: c } = Z3(o), a = performance.now();
    let f;
    try {
      f = await V3({ domain: i, message: c, network: o.network, stxAddress: t.address });
    } catch (d) {
      throw $.results.sign = "wallet error: " + Rt(d), new Error("The wallet did not sign: " + Rt(d));
    }
    $.timers.signMs = Math.round(performance.now() - a), $.results.sign = "ok", Y(`sign: ok (${$.timers.signMs} ms)`);
    const u = performance.now(), { res: l, body: g } = await Kr("/casino/room/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ challenge: o, signature: f })
    });
    if ($.timers.sessionMs = Math.round(performance.now() - u), !l.ok)
      throw $.results.session = `rejected ${l.status}: ${g == null ? void 0 : g.error}`, new Error((g == null ? void 0 : g.error) || `The room answered ${l.status}.`);
    $.results.session = "ok", $.signedAs = { address: g.address, hash160: g.hash160, network: g.network, expiresAt: g.expiresAt }, Y(`session: ok (${$.timers.sessionMs} ms), key hash ${g.hash160}`), hs(), Bi("signed in");
  } catch (n) {
    Y("sign-in failed: " + Rt(n)), dt("signStatus", Rt(n), "bad"), e.disabled = !1;
  }
};
X("signout").onclick = async () => {
  await Kr("/casino/room/session", { method: "DELETE" }), $.signedAs = null, $.wantSpot = null, Y("signed out"), hs(), Bi("signed out");
};
function hs() {
  const t = $.signedAs;
  X("signin").disabled = !!t || !mn.getSession().isConnected, X("signout").disabled = !t, dt("signStatus", t ? `Signed in as ${t.address} (${t.network}). Account key hash ${t.hash160.slice(0, 12)}… Session ends ${new Date(t.expiresAt).toLocaleTimeString()}.` : "Not signed in. You can still watch the room as a guest.", t ? "ok" : "");
}
const Zf = () => {
  var n;
  const t = ((n = $.you) == null ? void 0 : n.a) ?? null, e = X("spots");
  e.textContent = "";
  for (const r of qf) {
    const s = $.spots[r], o = document.createElement("button"), i = document.createElement("span");
    i.textContent = r;
    const c = document.createElement("small");
    c.textContent = s ? s.a === t ? "you" : s.n : "free", o.append(i, c), (s == null ? void 0 : s.a) === t && t ? o.className = "mine" : s && (o.className = "taken"), o.disabled = !t || !!s && s.a !== t, o.onclick = () => Vr({ t: "sit", spot: r }), e.append(o);
  }
  X("stand").disabled = !t || !Object.values($.spots).some((r) => r.a === t), X("counts").textContent = `${$.joined} signed in, ${$.guests} watching. ${$.you ? "You are " + ($.you.guest ? "a guest (watching only)." : $.you.n + ".") : ""}`;
}, Vr = (t) => {
  var e;
  ((e = $.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN ? (t.t === "sit" && ($.wantSpot = t.spot), t.t === "stand" && ($.wantSpot = null), $.ws.send(JSON.stringify(t))) : Y("not connected to the room");
};
X("stand").onclick = () => Vr({ t: "stand" });
function _i() {
  $.attempts += 1;
  const t = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`, e = performance.now();
  dt("roomStatus", $.attempts > 1 ? "Reconnecting…" : "Connecting…");
  let n;
  try {
    n = new WebSocket(t);
  } catch (r) {
    return Y("websocket could not start: " + Rt(r)), f0();
  }
  $.ws = n, n.onopen = () => {
    $.timers.wsOpenMs = Math.round(performance.now() - e), $.results.websocket = "open", $.opened += 1, Y(`room: connected (${$.timers.wsOpenMs} ms)`), dt("roomStatus", "Connected to the room.", "ok"), $.attempts > 1 && ($.reconnects += 1), $.attempts = 0;
  }, n.onmessage = (r) => {
    let s;
    try {
      s = JSON.parse(String(r.data));
    } catch {
      return;
    }
    switch (s.t) {
      case "room":
        $.you = s.you, $.spots = s.spots || {}, $.joined = s.joined, $.guests = s.guests, $.wantSpot && $.you && !$.you.guest && !Object.values($.spots).some((o) => o.a === $.you.a) && (Y("re-sitting at " + $.wantSpot), n.send(JSON.stringify({ t: "sit", spot: $.wantSpot }))), $.idleCheck && X3(s);
        break;
      case "sat":
        $.spots[s.spot] = s.who;
        break;
      case "stood":
        delete $.spots[s.spot];
        break;
      case "moved":
        Y(`another tab of yours took ${s.spot}`), $.wantSpot === s.spot && ($.wantSpot = null);
        break;
      case "count":
        $.joined = s.joined, $.guests = s.guests;
        break;
      case "pong":
        $.timers.pingMs = Math.round(performance.now() - $.pingSent), Y(`pong (${$.timers.pingMs} ms)`);
        break;
      case "err":
        Y("room says: " + s.code);
        break;
    }
    Zf();
  }, n.onclose = (r) => {
    if ($.lastClose = { code: r.code, reason: r.reason }, Y(`room: closed (${r.code}${r.reason ? " " + r.reason : ""})`), $.ws === n) {
      if ($.ws = null, r.code === 4001) {
        $.replaced = !0, dt("roomStatus", "Another tab of yours replaced this one.", "bad");
        return;
      }
      dt("roomStatus", "Disconnected. Reconnecting…", "bad"), f0();
    }
  }, n.onerror = () => {
    $.results.websocket = $.results.websocket === "open" ? "open" : "error";
  };
}
function f0() {
  const t = Math.min(15e3, 1e3 * 2 ** Math.min($.attempts, 4));
  Y(`retrying in ${t / 1e3}s`), window.setTimeout(() => {
    $.ws || _i();
  }, t);
}
function Bi(t) {
  Y("reconnecting: " + t);
  const e = $.ws;
  $.ws = null, $.attempts = 0, $.replaced = !1;
  try {
    e == null || e.close(1e3, "client");
  } catch {
  }
  _i();
}
X("reconnect").onclick = () => Bi("button");
X("idle").onclick = () => {
  var e;
  if (((e = $.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN) {
    Y("idle test: connect first");
    return;
  }
  const t = JSON.stringify(Object.keys($.spots).sort());
  $.idleCheck = { before: t, started: performance.now() }, dt("idleStatus", "Idle test running. Do not touch anything for 30 seconds…"), window.setTimeout(() => {
    $.pingSent = performance.now(), Vr({ t: "ping" }), Vr({ t: "hello" });
  }, 3e4);
};
function X3(t) {
  const e = $.idleCheck;
  if (!e) return;
  $.idleCheck = null;
  const n = JSON.stringify(Object.keys(t.spots || {}).sort()), r = n === e.before;
  $.results.idle = r ? "ok: room state intact after 30 s idle" : `changed: before ${e.before} after ${n}`, dt("idleStatus", r ? "Idle test passed: the room remembered everyone after 30 seconds." : "Idle test: the room changed while idle (see report).", r ? "ok" : "bad"), Y("idle test: " + $.results.idle);
}
const Qf = () => {
  const t = mn.getSession(), e = {
    page: "casino-room-spike v1",
    at: (/* @__PURE__ */ new Date()).toISOString(),
    userAgent: navigator.userAgent,
    wallet: { provider: Li() || null, address: t.address || null, network: t.network || null },
    signedAs: $.signedAs && { address: $.signedAs.address, network: $.signedAs.network, hash160: $.signedAs.hash160 },
    results: $.results,
    timersMs: $.timers,
    websocket: { opened: $.opened, reconnects: $.reconnects, lastClose: $.lastClose, replaced: $.replaced },
    room: { you: $.you, joined: $.joined, guests: $.guests, spots: $.spots }
  };
  return JSON.stringify(e, null, 2);
};
X("report").onclick = () => {
  X("reportText").value = Qf();
};
X("copy").onclick = async () => {
  const t = X("reportText");
  t.value || (t.value = Qf());
  try {
    await navigator.clipboard.writeText(t.value), Y("report copied");
  } catch {
    t.select(), Y("select the text and copy it by hand");
  }
};
Mi();
hs();
Zf();
(async () => {
  try {
    const { res: t, body: e } = await Kr("/casino/room/session");
    if (t.ok && (e != null && e.address))
      $.signedAs = { address: e.address, hash160: e.hash160, network: "unknown", expiresAt: e.expiresAt }, Y("already signed in from earlier: " + Yf(e.address)), hs();
    else if (t.status === 503) {
      $.results.service = "offline: " + ((e == null ? void 0 : e.reason) || "unknown"), dt("roomStatus", "The room service is not switched on yet (this is expected before it is deployed).", "bad"), Y("room service offline: " + ((e == null ? void 0 : e.reason) || t.status));
      return;
    }
  } catch (t) {
    Y("could not reach the room service: " + Rt(t));
  }
  _i();
})();
const J3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", t4 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), o = /CriOS/.exec(e.userAgent), i = e.userAgent.includes("Mobile");
  return o ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, e4 = () => t4() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, n4 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, r4 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Xf = class {
  constructor(t) {
    Hw(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Cl(t), this.callback(os(t));
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
    var r, s, o, i, c, a, f, u, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (i = (o = t.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Firefox" ? (a = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && a !== void 0 ? a : t.webUrl : n === "Android" ? (u = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = e4(), e = n4(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return k("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, k("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), k("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, k("div", { class: "flex flex-col space-y-[10px]" }, k("div", { class: "flex items-center" }, k("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), k("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, k("span", { class: "sr-only" }, "Close popup"), k("img", { src: J3 }))), r ? k("p", null, "Select the wallet you want to connect to.") : k("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && k("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && k("div", { class: "mt-6" }, k("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), k("ul", { class: "space-y-3" }, this.installedProviders.map((o) => k("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, k("div", { class: "aspect-square basis-9 overflow-hidden" }, k("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), k("div", { class: "flex-1" }, k("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && k("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), k("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && k("div", { class: "mt-6" }, r ? k("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : k("div", { class: "mb-5 flex justify-between" }, k("p", { class: "text-sm font-medium" }, "Recommended wallets"), k("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, k("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, k("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), k("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), k("p", null, "What is a wallet? ", k("span", { class: "align-text-bottom text-[9px]" }, "↗")))), k("ul", { class: "space-y-3" }, n.map((o) => k("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, k("div", { class: "aspect-square basis-9 overflow-hidden" }, k("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), k("div", { class: "flex-1" }, k("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && k("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, t, e) && k("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, t, e), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return gw(this);
  }
};
Xf.style = r4;
const s4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Xf
}, Symbol.toStringTag, { value: "Module" }));
