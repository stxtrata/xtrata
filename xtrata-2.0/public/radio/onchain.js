var w1 = Object.defineProperty;
var S1 = (t, e, n) => e in t ? w1(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var zo = (t, e, n) => S1(t, typeof e != "symbol" ? e + "" : e, n);
const m1 = ["SP", "SM"], A1 = ["ST", "SN"], gc = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return m1.includes(n) ? "mainnet" : A1.includes(n) ? "testnet" : null;
}, E1 = () => {
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
}, I1 = () => typeof window > "u" || !window.localStorage ? E1() : window.localStorage, Ro = "xtrata.v15.1.wallet.session", Jl = "mainnet", Li = { isConnected: !1 }, $1 = (t) => t.address ? gc(t.address) ?? t.network : t.network, l0 = (t) => !t.isConnected || !t.address ? { ...Li } : $1(t) !== Jl ? { ...Li } : {
  isConnected: !0,
  address: t.address,
  network: Jl,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, v1 = (t) => {
  if (!t)
    return { ...Li };
  try {
    const e = JSON.parse(t);
    return l0(e);
  } catch {
    return { ...Li };
  }
}, L1 = (t) => {
  const e = l0(t);
  return JSON.stringify(e);
}, C1 = (t) => {
  const e = I1();
  return {
    load: () => v1(e.getItem(Ro)),
    save: (n) => {
      e.setItem(Ro, L1(n));
    },
    clear: () => {
      e.removeItem(Ro);
    }
  };
};
function B1(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function H1(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${B1(r)}`;
  let i = 2166136261, o = 522970236;
  for (let c = 0; c < s.length; c += 1) {
    const u = s.charCodeAt(c);
    i = Math.imul(i ^ u, 16777619), o = Math.imul(o ^ (u << 5 | u >>> 3), 16777619);
  }
  const a = (c) => (c >>> 0).toString(16).padStart(8, "0");
  return (a(i) + a(o)).slice(0, 16);
}
function u0(t) {
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
function _1(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const Vo = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function M1(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = Vo(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = Vo(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = Vo(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function U1(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = u0(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const N1 = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", T1 = 20, tu = "xt_tel_sid";
function Ci() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Go = null;
function P1() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(tu);
      return t || (t = Ci(), sessionStorage.setItem(tu, t)), t;
    }
  } catch {
  }
  return Go || (Go = Ci()), Go;
}
let Sr = {
  address: null,
  kind: null
}, f0 = null;
function pc(t, e) {
  if (!t) {
    Sr = { address: null, kind: e ?? Sr.kind };
    return;
  }
  Sr = { address: t.trim(), kind: e ?? Sr.kind };
}
function bc(t) {
  f0 = typeof t == "string" && t.length > 0 ? t : null;
}
const eu = [];
class D1 {
  constructor(e, n) {
    zo(this, "id", Ci());
    zo(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function k1(t, e) {
  return new D1(t, e);
}
function cs(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? u0(t.error) : void 0, i = t.error != null ? _1(t.error) : void 0, o = r ? H1(n, t.step, t.errorCode, s ?? "") : void 0, a = r ? M1(t.error) : void 0, c = {
      ...a ? { error: a } : {},
      ...t.context ?? {}
    };
    r && eu.length && (c.breadcrumbs = eu.slice(-T1));
    const u = {
      eventId: Ci(),
      ts: Date.now(),
      sessionId: P1(),
      journeyId: t.journeyId ?? (e == null ? void 0 : e.id) ?? null,
      attempt: t.attempt ?? 1,
      flow: n,
      step: t.step ?? null,
      outcome: t.outcome,
      severity: t.severity ?? (r ? "error" : "info"),
      target: t.target ?? (e == null ? void 0 : e.target) ?? null,
      durationMs: t.durationMs ?? null,
      errorCode: t.errorCode ?? null,
      errorFingerprint: o ?? null,
      errorMessage: s ?? null,
      errorStack: i ?? null,
      appVersion: N1,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Sr.address,
      walletKind: Sr.kind,
      network: f0,
      context: Object.keys(c).length ? c : void 0
    };
  } catch {
  }
}
const O1 = "https://browser.blockstack.org/auth", F1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, h0 = ["store_write"], j1 = "blockstack-session", z1 = {
  logLevel: "debug"
}, ar = {
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
Object.freeze(ar);
class qr extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, s = this.stack;
    if (s)
      r += `Stack Trace:
${s}`;
    else
      try {
        throw new Error();
      } catch (i) {
        s = i.stack;
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
class R1 extends qr {
  constructor(e, n = "") {
    super({ code: ar.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class nu extends qr {
  constructor(e = "") {
    super({ code: ar.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Ws extends qr {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ar.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ru extends qr {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ar.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ga extends qr {
  constructor(e) {
    super({ code: ar.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class d0 extends qr {
  constructor(e) {
    super({ code: ar.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const su = ["debug", "info", "warn", "error", "none"], pa = {};
for (let t = 0; t < su.length; t++) {
  const e = su[t];
  pa[e] = t;
}
class mr {
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
    return pa[z1.logLevel] <= pa[e];
  }
}
function V1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function G1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ko(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function K1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function W1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function q1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function yc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = W1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    mr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = q1(s, t.toString(), n);
    throw mr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Cn(t, e) {
  return xc(Nt(t), e);
}
function Nt(t) {
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
  if (qt(t, Uint8Array))
    return BigInt(`0x${z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Y1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function iu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Cs(t, e = 8) {
  return (typeof t == "bigint" ? t : Nt(t)).toString(16).padStart(e * 2, "0");
}
function eo(t) {
  return parseInt(t, 16);
}
function xc(t, e = 16) {
  const n = Cs(t, e);
  return rt(n);
}
function X1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Z1(t, e) {
  return t & BigInt(1) << e;
}
function ba(t) {
  return Q1(BigInt(`0x${z(t)}`), BigInt(t.byteLength * 8));
}
function Q1(t, e) {
  return Z1(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const J1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += J1[n];
  return e;
}
function rt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Y1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function cr(t) {
  return new TextEncoder().encode(t);
}
function Bs(t) {
  return new TextDecoder().decode(t);
}
function t2(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function e2(t) {
  return String.fromCharCode.apply(null, t);
}
function n2(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ou(t) {
  if (t.some(n2))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Le(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function It(t) {
  return Le(...t.map((e) => typeof e == "number" ? ou([e]) : e instanceof Array ? ou(e) : e));
}
function qt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const g0 = "https://api.mainnet.hiro.so", p0 = "https://api.testnet.hiro.so", b0 = "http://localhost:3999", r2 = "https://hub.blockstack.org", s2 = 33, Wo = 32;
function i2(t) {
  if (t.length < Wo * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Wo * 2), r = t.slice(2 + Wo * 2);
  return {
    recoveryId: eo(e),
    r: n,
    s: r
  };
}
function wc(t) {
  const e = typeof t == "string" ? rt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function o2(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function a2(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function c2(t, e) {
  return t[e];
}
function l2(t, e, n = 0) {
  return t[n] = e, t;
}
function u2(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Wn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const f2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function h2(t, e) {
  const n = {};
  return Object.assign(n, f2, e), await fetch(t, n);
}
function d2(t) {
  let e = h2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function g2(...t) {
  const { fetchLib: e, middlewares: n } = d2(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: e,
        ...o
      })) ?? o);
    let a = await e(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class no {
  constructor(e = h0.slice(), n = ((a) => (a = yc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = O1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ya(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function p2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function y0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function b2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ya(t.outputLen), ya(t.blockLen);
}
function y2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function x2(t, e) {
  y0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const kn = {
  number: ya,
  bool: p2,
  bytes: y0,
  hash: b2,
  exists: y2,
  output: x2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ge = (t, e) => t << 32 - e | t >>> e, w2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!w2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function S2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Sc(t) {
  if (typeof t == "string" && (t = S2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let x0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function lr(t) {
  const e = (r) => t().update(Sc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let w0 = class extends x0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, kn.hash(e);
    const r = Sc(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return kn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    kn.exists(this), kn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ro = (t, e, n) => new w0(t, e).update(n).digest();
ro.create = (t, e) => new w0(t, e);
function m2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let mc = class extends x0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = qo(this.buffer);
  }
  update(e) {
    kn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Sc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = qo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    kn.exists(this), kn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    m2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = qo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const A2 = (t, e, n) => t & e ^ ~t & n, E2 = (t, e, n) => t & e ^ t & n ^ e & n, I2 = new Uint32Array([
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
]), qe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ye = new Uint32Array(64);
let S0 = class extends mc {
  constructor() {
    super(64, 32, 8, !1), this.A = qe[0] | 0, this.B = qe[1] | 0, this.C = qe[2] | 0, this.D = qe[3] | 0, this.E = qe[4] | 0, this.F = qe[5] | 0, this.G = qe[6] | 0, this.H = qe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ye[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Ye[l - 15], h = Ye[l - 2], b = ge(g, 7) ^ ge(g, 18) ^ g >>> 3, y = ge(h, 17) ^ ge(h, 19) ^ h >>> 10;
      Ye[l] = y + Ye[l - 7] + b + Ye[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = ge(a, 6) ^ ge(a, 11) ^ ge(a, 25), h = f + g + A2(a, c, u) + I2[l] + Ye[l] | 0, y = (ge(r, 2) ^ ge(r, 13) ^ ge(r, 22)) + E2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Ye.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $2 = class extends S0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Br = lr(() => new S0());
lr(() => new $2());
const v2 = {}, m0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: v2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const nt = BigInt(0), pt = BigInt(1), mn = BigInt(2), us = BigInt(3), au = BigInt(8), ot = Object.freeze({
  a: nt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: pt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), cu = (t, e) => (t + e / mn) / e, qs = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ot, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -pt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = cu(i * t, e), c = cu(-r * t, e);
    let u = _(t - a * n - c * s, e), f = _(-a * r - c * i, e);
    const l = u > o, g = f > o;
    if (l && (u = e - u), g && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: f };
  }
}, fe = 32, qn = 32, A0 = 32, Bi = fe + 1, Hi = 2 * fe + 1;
function lu(t) {
  const { a: e, b: n } = ot, r = _(t * t), s = _(r * t);
  return _(s + e * t + n);
}
const Ys = ot.a === nt;
class Ac extends Error {
  constructor(e) {
    super(e);
  }
}
function uu(t) {
  if (!(t instanceof st))
    throw new TypeError("JacobianPoint expected");
}
class st {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof J))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(J.ZERO) ? st.ZERO : new st(e.x, e.y, pt);
  }
  static toAffineBatch(e) {
    const n = _2(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return st.toAffineBatch(e).map(st.fromAffine);
  }
  equals(e) {
    uu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = _(s * s), u = _(a * a), f = _(n * u), l = _(i * c), g = _(_(r * a) * u), h = _(_(o * s) * c);
    return f === l && g === h;
  }
  negate() {
    return new st(this.x, _(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = _(e * e), i = _(n * n), o = _(i * i), a = e + i, c = _(mn * (_(a * a) - s - o)), u = _(us * s), f = _(u * u), l = _(f - mn * c), g = _(u * (c - l) - au * o), h = _(mn * n * r);
    return new st(l, g, h);
  }
  add(e) {
    uu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === nt || o === nt)
      return this;
    if (n === nt || r === nt)
      return e;
    const c = _(s * s), u = _(a * a), f = _(n * u), l = _(i * c), g = _(_(r * a) * u), h = _(_(o * s) * c), b = _(l - f), y = _(h - g);
    if (b === nt)
      return y === nt ? this.double() : st.ZERO;
    const A = _(b * b), L = _(b * A), C = _(f * A), p = _(y * y - L - mn * C), E = _(y * (C - p) - g * L), m = _(s * a * b);
    return new st(p, E, m);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = st.ZERO;
    if (typeof e == "bigint" && e === nt)
      return n;
    let r = du(e);
    if (r === pt)
      return this;
    if (!Ys) {
      let l = n, g = this;
      for (; r > nt; )
        r & pt && (l = l.add(g)), g = g.double(), r >>= pt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = qs.splitScalar(r), c = n, u = n, f = this;
    for (; i > nt || a > nt; )
      i & pt && (c = c.add(f)), a & pt && (u = u.add(f)), f = f.double(), i >>= pt, a >>= pt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new st(_(u.x * qs.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ys ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let a = 1; a < 2 ** (e - 1); a++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(st.BASE) && (n = J.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && xa.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = st.normalizeZ(s), xa.set(n, s)));
    let i = st.ZERO, o = st.BASE;
    const a = 1 + (Ys ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & u);
      e >>= l, b > c && (b -= f, e += pt);
      const y = h, A = h + Math.abs(b) - 1, L = g % 2 !== 0, C = b < 0;
      b === 0 ? o = o.add(Xs(L, s[y])) : i = i.add(Xs(C, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = du(e), s, i;
    if (Ys) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = qs.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      f = Xs(o, f), g = Xs(c, g), g = new st(_(g.x * qs.beta), g.y, g.z), s = f.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return st.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(st.ZERO);
    e == null && (e = i ? au : Yr(s));
    const o = e, a = _(o * o), c = _(a * o), u = _(n * a), f = _(r * c), l = _(s * o);
    if (i)
      return J.ZERO;
    if (l !== pt)
      throw new Error("invZ was invalid");
    return new J(u, f);
  }
}
st.BASE = new st(ot.Gx, ot.Gy, pt);
st.ZERO = new st(nt, pt, nt);
function Xs(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const xa = /* @__PURE__ */ new WeakMap();
class J {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, xa.delete(this);
  }
  hasEvenY() {
    return this.y % mn === nt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ne(n ? e : e.subarray(1));
    if (!mi(r))
      throw new Error("Point is not on curve");
    const s = lu(r);
    let i = H2(s);
    const o = (i & pt) === pt;
    n ? o && (i = _(-i)) : (e[0] & 1) === 1 !== o && (i = _(-i));
    const a = new J(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = ne(e.subarray(1, fe + 1)), r = ne(e.subarray(fe + 1, fe * 2 + 1)), s = new J(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ce(e), r = n.length, s = n[0];
    if (r === fe)
      return this.fromCompressedHex(n);
    if (r === Bi && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Hi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Bi} compressed bytes or ${Hi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return J.BASE.multiply(Yn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = $0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Ec(Ce(e)), { n: a } = ot, c = r === 2 || r === 3 ? s + a : s, u = Yr(c, a), f = _(-o * u, a), l = _(i * u, a), g = r & 1 ? "03" : "02", h = J.fromHex(g + $n(c)), b = J.BASE.multiplyAndAddUnsafe(h, f, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return vn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = $n(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${$n(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!mi(n) || !mi(r))
      throw new Error(e);
    const s = _(r * r), i = lu(n);
    if (_(s - i) !== nt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new J(this.x, _(-this.y));
  }
  double() {
    return st.fromAffine(this).double().toAffine();
  }
  add(e) {
    return st.fromAffine(this).add(st.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return st.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = st.fromAffine(this), i = n === nt || n === pt || this !== J.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = st.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(st.ZERO) ? void 0 : a.toAffine();
  }
}
J.BASE = new J(ot.Gx, ot.Gy);
J.ZERO = new J(nt, nt);
function fu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function hu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Hr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ne(n), left: t.subarray(e + 2) };
}
function L2(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Hr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = hu(t.subarray(2)), { data: r, left: s } = hu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Hr(s)}`);
  return { r: e, s: r };
}
class ee {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Hr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ee(_i(s.slice(0, 64)), _i(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = L2(n ? e : vn(e));
    return new ee(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Mr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Mr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ot.n >> pt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ee(this.r, _(-this.s, ot.n)) : this;
  }
  toDERRawBytes() {
    return vn(this.toDERHex());
  }
  toDERHex() {
    const e = fu(os(this.s)), n = fu(os(this.r)), r = e.length / 2, s = n.length / 2, i = os(r), o = os(s);
    return `30${os(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return vn(this.toCompactHex());
  }
  toCompactHex() {
    return $n(this.r) + $n(this.s);
  }
}
function Sn(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
const C2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += C2[t[n]];
  return e;
}
const B2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function $n(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(nt <= t && t < B2))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function _r(t) {
  const e = vn($n(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function os(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function _i(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function vn(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function ne(t) {
  return _i(Hr(t));
}
function Ce(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : vn(t);
}
function du(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Mr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function _(t, e = ot.P) {
  const n = t % e;
  return n >= nt ? n : e + n;
}
function re(t, e) {
  const { P: n } = ot;
  let r = t;
  for (; e-- > nt; )
    r *= r, r %= n;
  return r;
}
function H2(t) {
  const { P: e } = ot, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = re(u, us) * u % e, l = re(f, us) * u % e, g = re(l, mn) * c % e, h = re(g, r) * g % e, b = re(h, s) * h % e, y = re(b, o) * b % e, A = re(y, a) * y % e, L = re(A, o) * b % e, C = re(L, us) * u % e, p = re(C, i) * h % e, E = re(p, n) * c % e, m = re(E, mn);
  if (m * m % e !== t)
    throw new Error("Cannot find square root");
  return m;
}
function Yr(t, e = ot.P) {
  if (t === nt || e <= nt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = _(t, e), r = e, s = nt, i = pt;
  for (; n !== nt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== pt)
    throw new Error("invert: does not exist");
  return _(s, e);
}
function _2(t, e = ot.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === nt ? i : (n[a] = i, _(i * o, e)), pt), s = Yr(r, e);
  return t.reduceRight((i, o, a) => o === nt ? i : (n[a] = _(i * n[a], e), _(i * o, e)), s), n;
}
function M2(t) {
  const e = t.length * 8 - qn * 8, n = ne(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ec(t, e = !1) {
  const n = M2(t);
  if (e)
    return n;
  const { n: r } = ot;
  return n >= r ? n - r : n;
}
let $r, fs;
class E0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return At.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return fs(this.k, ...e);
  }
  checkSync() {
    if (typeof fs != "function")
      throw new Ac("hmacSha256Sync needs to be set");
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
    return Sn(...n);
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
    return Sn(...n);
  }
}
function Mr(t) {
  return nt < t && t < ot.n;
}
function mi(t) {
  return nt < t && t < ot.P;
}
function I0(t, e, n, r = !0) {
  const { n: s } = ot, i = Ec(t, !0);
  if (!Mr(i))
    return;
  const o = Yr(i, s), a = J.BASE.multiply(i), c = _(a.x, s);
  if (c === nt)
    return;
  const u = _(o * _(e + n * c, s), s);
  if (u === nt)
    return;
  let f = new ee(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & pt);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Yn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * qn)
      throw new Error("Expected 32 bytes of private key");
    e = _i(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== qn)
      throw new Error("Expected 32 bytes of private key");
    e = ne(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Mr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ic(t) {
  return t instanceof J ? (t.assertValidity(), t) : J.fromHex(t);
}
function $0(t) {
  if (t instanceof ee)
    return t.assertValidity(), t;
  try {
    return ee.fromDER(t);
  } catch {
    return ee.fromCompact(t);
  }
}
function Hs(t, e = !1) {
  return J.fromPrivateKey(t).toRawBytes(e);
}
function U2(t, e, n, r = !1) {
  return J.fromSignature(t, e, n).toRawBytes(r);
}
function gu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Bi || r === Hi : n ? r === Bi * 2 || r === Hi * 2 : t instanceof J;
}
function $c(t, e, n = !1) {
  if (gu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!gu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ic(e);
  return r.assertValidity(), r.multiply(Yn(t)).toRawBytes(n);
}
function v0(t) {
  const e = t.length > fe ? t.slice(0, fe) : t;
  return ne(e);
}
function N2(t) {
  const e = v0(t), n = _(e, ot.n);
  return L0(n < nt ? e : n);
}
function L0(t) {
  return _r(t);
}
function C0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ce(t), s = Yn(e), i = [L0(s), N2(r)];
  if (n != null) {
    n === !0 && (n = At.randomBytes(fe));
    const c = Ce(n);
    if (c.length !== fe)
      throw new Error(`sign: Expected ${fe} bytes of extra data`);
    i.push(c);
  }
  const o = Sn(...i), a = v0(r);
  return { seed: o, m: a, d: s };
}
function B0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function T2(t, e, n = {}) {
  const { seed: r, m: s, d: i } = C0(t, e, n.extraEntropy), o = new E0(A0, qn);
  await o.reseed(r);
  let a;
  for (; !(a = I0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return B0(a, n);
}
function so(t, e, n = {}) {
  const { seed: r, m: s, d: i } = C0(t, e, n.extraEntropy), o = new E0(A0, qn);
  o.reseedSync(r);
  let a;
  for (; !(a = I0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return B0(a, n);
}
const P2 = { strict: !0 };
function D2(t, e, n, r = P2) {
  let s;
  try {
    s = $0(t), e = Ce(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Ec(e);
  let c;
  try {
    c = Ic(n);
  } catch {
    return !1;
  }
  const { n: u } = ot, f = Yr(o, u), l = _(a * f, u), g = _(i * f, u), h = J.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? _(h.x, u) === i : !1;
}
function Mi(t) {
  return _(ne(t), ot.n);
}
class Ur {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ce(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ne(n.subarray(0, 32)), s = ne(n.subarray(32, 64));
    return new Ur(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!mi(e) || !Mr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return $n(this.r) + $n(this.s);
  }
  toRawBytes() {
    return vn(this.toHex());
  }
}
function k2(t) {
  return J.fromPrivateKey(t).toRawX();
}
class H0 {
  constructor(e, n, r = At.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ce(e);
    const { x: s, scalar: i } = this.getScalar(Yn(n));
    if (this.px = s, this.d = i, this.rand = Ce(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = J.fromPrivateKey(e), r = n.hasEvenY() ? e : ot.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return _r(e ^ ne(n));
  }
  finalizeNonce(e) {
    const n = _(ne(e), ot.n);
    if (n === nt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ur(e.x, _(n + r * s, ot.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHash, o = this.initNonce(n, await i(wn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(wn.nonce, o, r, e)), f = Mi(await i(wn.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await U0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHashSync, o = this.initNonce(n, i(wn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(wn.nonce, o, r, e)), f = Mi(i(wn.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return N0(l, e, r) || this.error(), l;
  }
}
async function O2(t, e, n) {
  return new H0(t, e, n).calc();
}
function F2(t, e, n) {
  return new H0(t, e, n).calcSync();
}
function _0(t, e, n) {
  const r = t instanceof Ur, s = r ? t : Ur.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ce(e),
    P: Ic(n)
  };
}
function M0(t, e, n, r) {
  const s = J.BASE.multiplyAndAddUnsafe(e, Yn(n), _(-r, ot.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function U0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _0(t, e, n), a = Mi(await At.taggedHash(wn.challenge, _r(r), o.toRawX(), i));
    return M0(r, o, s, a);
  } catch {
    return !1;
  }
}
function N0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _0(t, e, n), a = Mi(At.taggedHashSync(wn.challenge, _r(r), o.toRawX(), i));
    return M0(r, o, s, a);
  } catch (r) {
    if (r instanceof Ac)
      throw r;
    return !1;
  }
}
const j2 = {
  Signature: Ur,
  getPublicKey: k2,
  sign: O2,
  verify: U0,
  signSync: F2,
  verifySync: N0
};
J.BASE._setWindowSize(8);
const Yt = {
  node: m0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, wn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Zs = {}, At = {
  bytesToHex: Hr,
  hexToBytes: vn,
  concatBytes: Sn,
  mod: _,
  invert: Yr,
  isValidPrivateKey(t) {
    try {
      return Yn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: _r,
  _normalizePrivateKey: Yn,
  hashToPrivateKey: (t) => {
    t = Ce(t);
    const e = qn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = _(ne(t), ot.n - pt) + pt;
    return _r(n);
  },
  randomBytes: (t = 32) => {
    if (Yt.web)
      return Yt.web.getRandomValues(new Uint8Array(t));
    if (Yt.node) {
      const { randomBytes: e } = Yt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => At.hashToPrivateKey(At.randomBytes(qn + 8)),
  precompute(t = 8, e = J.BASE) {
    const n = e === J.BASE ? e : new J(e.x, e.y);
    return n._setWindowSize(t), n.multiply(us), n;
  },
  sha256: async (...t) => {
    if (Yt.web) {
      const e = await Yt.web.subtle.digest("SHA-256", Sn(...t));
      return new Uint8Array(e);
    } else if (Yt.node) {
      const { createHash: e } = Yt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Yt.web) {
      const n = await Yt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Sn(...e), s = await Yt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Yt.node) {
      const { createHmac: n } = Yt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Zs[t];
    if (n === void 0) {
      const r = await At.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Sn(r, r), Zs[t] = n;
    }
    return At.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof $r != "function")
      throw new Ac("sha256Sync is undefined, you need to set it");
    let n = Zs[t];
    if (n === void 0) {
      const r = $r(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Sn(r, r), Zs[t] = n;
    }
    return $r(n, ...e);
  },
  _JacobianPoint: st
};
Object.defineProperties(At, {
  sha256Sync: {
    configurable: !1,
    get() {
      return $r;
    },
    set(t) {
      $r || ($r = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return fs;
    },
    set(t) {
      fs || (fs = t);
    }
  }
});
const z2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ot,
  Point: J,
  Signature: ee,
  getPublicKey: Hs,
  getSharedSecret: $c,
  recoverPublicKey: U2,
  schnorr: j2,
  sign: T2,
  signSync: so,
  utils: At,
  verify: D2
}, Symbol.toStringTag, { value: "Module" }));
var jt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function T0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function P0(t) {
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
var _s = {};
_s.byteLength = W2;
var R2 = _s.toByteArray = Y2, V2 = _s.fromByteArray = Q2, Se = [], se = [], G2 = typeof Uint8Array < "u" ? Uint8Array : Array, Yo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var wr = 0, K2 = Yo.length; wr < K2; ++wr)
  Se[wr] = Yo[wr], se[Yo.charCodeAt(wr)] = wr;
se[45] = 62;
se[95] = 63;
function D0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function W2(t) {
  var e = D0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function q2(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Y2(t) {
  var e, n = D0(t), r = n[0], s = n[1], i = new G2(q2(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = se[t.charCodeAt(c)] << 18 | se[t.charCodeAt(c + 1)] << 12 | se[t.charCodeAt(c + 2)] << 6 | se[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = se[t.charCodeAt(c)] << 2 | se[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = se[t.charCodeAt(c)] << 10 | se[t.charCodeAt(c + 1)] << 4 | se[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function X2(t) {
  return Se[t >> 18 & 63] + Se[t >> 12 & 63] + Se[t >> 6 & 63] + Se[t & 63];
}
function Z2(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(X2(r));
  return s.join("");
}
function Q2(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Z2(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Se[e >> 2] + Se[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Se[e >> 10] + Se[e >> 4 & 63] + Se[e << 2 & 63] + "="
  )), s.join("");
}
function J2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const tb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function eb() {
  if (J2())
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
    throw new Error(tb);
  }
}
class nb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Le(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Le(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class rb {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: i, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: i, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function k0() {
  const t = await eb();
  return t.name === "subtleCrypto" ? new rb(t.lib) : new nb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function sb(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var s = t.charAt(r), i = s.charCodeAt(0);
    if (e[i] !== 255)
      throw new TypeError(s + " is ambiguous");
    e[i] = r;
  }
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function f(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var b = 0, y = 0, A = 0, L = h.length; A !== L && h[A] === 0; )
      A++, b++;
    for (var C = (L - A) * u + 1 >>> 0, p = new Uint8Array(C); A !== L; ) {
      for (var E = h[A], m = 0, N = C - 1; (E !== 0 || m < y) && N !== -1; N--, m++)
        E += 256 * p[N] >>> 0, p[N] = E % o >>> 0, E = E / o >>> 0;
      if (E !== 0)
        throw new Error("Non-zero carry");
      y = m, A++;
    }
    for (var D = C - y; D !== C && p[D] === 0; )
      D++;
    for (var B = a.repeat(b); D < C; ++D)
      B += t.charAt(p[D]);
    return B;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, y = 0, A = 0; h[b] === a; )
      y++, b++;
    for (var L = (h.length - b) * c + 1 >>> 0, C = new Uint8Array(L); h[b]; ) {
      var p = h.charCodeAt(b);
      if (p > 255)
        return;
      var E = e[p];
      if (E === 255)
        return;
      for (var m = 0, N = L - 1; (E !== 0 || m < A) && N !== -1; N--, m++)
        E += o * C[N] >>> 0, C[N] = E % 256 >>> 0, E = E / 256 >>> 0;
      if (E !== 0)
        throw new Error("Non-zero carry");
      A = m, b++;
    }
    for (var D = L - A; D !== L && C[D] === 0; )
      D++;
    for (var B = new Uint8Array(y + (L - D)), U = y; D !== L; )
      B[U++] = C[D++];
    return B;
  }
  function g(h) {
    var b = l(h);
    if (b)
      return b;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: g
  };
}
var O0 = sb;
const ib = O0, ob = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var ab = ib(ob);
const cb = /* @__PURE__ */ T0(ab), lb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), F0 = Uint8Array.from({ length: 16 }, (t, e) => e), ub = F0.map((t) => (9 * t + 5) % 16);
let vc = [F0], Lc = [ub];
for (let t = 0; t < 4; t++)
  for (let e of [vc, Lc])
    e.push(e[t].map((n) => lb[n]));
const j0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fb = vc.map((t, e) => t.map((n) => j0[e][n])), hb = Lc.map((t, e) => t.map((n) => j0[e][n])), db = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qs = (t, e) => t << e | t >>> 32 - e;
function pu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Js = new Uint32Array(16);
let pb = class extends mc {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Js[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = db[h], A = gb[h], L = vc[h], C = Lc[h], p = fb[h], E = hb[h];
      for (let m = 0; m < 16; m++) {
        const N = Qs(r + pu(h, i, a, u) + Js[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = Qs(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = Qs(s + pu(b, o, c, f) + Js[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = Qs(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Js.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const bb = lr(() => new pb());
function yb(t) {
  return bb(t);
}
const ti = BigInt(2 ** 32 - 1), wa = BigInt(32);
function z0(t, e = !1) {
  return e ? { h: Number(t & ti), l: Number(t >> wa & ti) } : { h: Number(t >> wa & ti) | 0, l: Number(t & ti) | 0 };
}
function xb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = z0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const wb = (t, e) => BigInt(t >>> 0) << wa | BigInt(e >>> 0), Sb = (t, e, n) => t >>> n, mb = (t, e, n) => t << 32 - n | e >>> n, Ab = (t, e, n) => t >>> n | e << 32 - n, Eb = (t, e, n) => t << 32 - n | e >>> n, Ib = (t, e, n) => t << 64 - n | e >>> n - 32, $b = (t, e, n) => t >>> n - 32 | e << 64 - n, vb = (t, e) => e, Lb = (t, e) => t, Cb = (t, e, n) => t << n | e >>> 32 - n, Bb = (t, e, n) => e << n | t >>> 32 - n, Hb = (t, e, n) => e << n - 32 | t >>> 64 - n, _b = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Mb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ub = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Nb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Tb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Pb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Db = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), kb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: z0,
  split: xb,
  toBig: wb,
  shrSH: Sb,
  shrSL: mb,
  rotrSH: Ab,
  rotrSL: Eb,
  rotrBH: Ib,
  rotrBL: $b,
  rotr32H: vb,
  rotr32L: Lb,
  rotlSH: Cb,
  rotlSL: Bb,
  rotlBH: Hb,
  rotlBL: _b,
  add: Mb,
  add3L: Ub,
  add3H: Nb,
  add4L: Tb,
  add4H: Pb,
  add5H: kb,
  add5L: Db
}, [Ob, Fb] = K.split([
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
].map((t) => BigInt(t))), Xe = new Uint32Array(80), Ze = new Uint32Array(80);
let io = class extends mc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: b, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Xe[p] = e.getUint32(n), Ze[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = Xe[p - 15] | 0, m = Ze[p - 15] | 0, N = K.rotrSH(E, m, 1) ^ K.rotrSH(E, m, 8) ^ K.shrSH(E, m, 7), D = K.rotrSL(E, m, 1) ^ K.rotrSL(E, m, 8) ^ K.shrSL(E, m, 7), B = Xe[p - 2] | 0, U = Ze[p - 2] | 0, x = K.rotrSH(B, U, 19) ^ K.rotrBH(B, U, 61) ^ K.shrSH(B, U, 6), I = K.rotrSL(B, U, 19) ^ K.rotrBL(B, U, 61) ^ K.shrSL(B, U, 6), H = K.add4L(D, I, Ze[p - 7], Ze[p - 16]), k = K.add4H(H, N, x, Xe[p - 7], Xe[p - 16]);
      Xe[p] = k | 0, Ze[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = K.rotrSH(l, g, 14) ^ K.rotrSH(l, g, 18) ^ K.rotrBH(l, g, 41), m = K.rotrSL(l, g, 14) ^ K.rotrSL(l, g, 18) ^ K.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = K.add5L(C, m, D, Fb[p], Ze[p]), U = K.add5H(B, L, E, N, Ob[p], Xe[p]), x = B | 0, I = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), H = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = K.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = K.add3L(x, H, G);
      r = K.add3H(T, U, I, k), s = T | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = K.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = K.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = K.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = K.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = K.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = K.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    Xe.fill(0), Ze.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, jb = class extends io {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, zb = class extends io {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Rb = class extends io {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Vb = lr(() => new io());
lr(() => new jb());
lr(() => new zb());
lr(() => new Rb());
function R0(t) {
  return Br(t);
}
function Gb(t) {
  return Vb(t);
}
const Kb = 0;
At.hmacSha256Sync = (t, ...e) => {
  const n = ro.create(Br, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Wb() {
  return z(At.randomPrivateKey());
}
function qb(t) {
  const e = Br(Br(t));
  return cb.encode(Le(t, e).slice(0, t.length + 4));
}
function Yb(t, e) {
  return qb(Le(new Uint8Array([t]), e.slice(0, 20)));
}
function V0(t, e = Kb) {
  const n = typeof t == "string" ? rt(t) : t, r = yb(R0(n));
  return Yb(e, r);
}
function G0(t) {
  const e = wc(t);
  return z(Hs(e.slice(0, 32), !0));
}
At.hmacSha256Sync = (t, ...e) => {
  const n = ro.create(Br, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ui;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ui || (Ui = {}));
async function Xb(t, e, n) {
  return await (await k0()).encrypt("aes-256-cbc", e, t, n);
}
async function Zb(t, e, n) {
  return await (await k0()).decrypt("aes-256-cbc", e, t, n);
}
function K0(t, e) {
  return ro(Br, t, e);
}
function Qb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function W0(t) {
  const e = Gb(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Jb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function ty(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ui.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ui.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Jb(t))
    return e;
  try {
    return J.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function ey(t, e, n, r) {
  const s = ty(t);
  if (!s.result)
    throw s;
  const i = At.randomPrivateKey(), o = Hs(i, !0);
  let a = $c(i, t, !0);
  a = a.slice(1);
  const c = W0(a), u = At.randomBytes(16), f = await Xb(u, c.encryptionKey, e), l = Le(u, o, f), g = K0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = z(f);
  else if (r === "base64")
    h = V2(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: z(u),
    ephemeralPK: z(o),
    cipherText: h,
    mac: z(g),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function q0(t, e) {
  if (!e.ephemeralPK)
    throw new ru("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = $c(t, n, !0);
  r = r.slice(1);
  const s = W0(r), i = rt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = rt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = R2(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Le(i, rt(n), o), c = K0(s.hmacKey, a), u = rt(e.mac);
  if (!Qb(u, c))
    throw new ru("Decryption failed: failure in MAC check");
  const f = await Zb(i, s.encryptionKey, o);
  return e.wasString ? Bs(f) : f;
}
function ny(t, e) {
  const n = typeof e == "string" ? cr(e) : e, r = G0(t), s = R0(n), i = so(s, t);
  return {
    signature: z(i),
    publicKey: r
  };
}
async function ry(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = G0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? cr(t) : t, o = await ey(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = ny(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function sy(t, e) {
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
var Tt = {}, Nr = {}, kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.decode = kt.encode = kt.unescape = kt.escape = kt.pad = void 0;
const Y0 = _s;
function Cc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
kt.pad = Cc;
function X0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
kt.escape = X0;
function Z0(t) {
  return Cc(t).replace(/-/g, "+").replace(/_/g, "/");
}
kt.unescape = Z0;
function iy(t) {
  return X0((0, Y0.fromByteArray)(new TextEncoder().encode(t)));
}
kt.encode = iy;
function oy(t) {
  return new TextDecoder().decode((0, Y0.toByteArray)(Cc(Z0(t))));
}
kt.decode = oy;
var oo = {}, ao = {}, Q0 = {}, Ve = {}, co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
co.crypto = void 0;
co.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = y, t.bytesToHex = C, t.hexToBytes = m, t.asyncLoop = D, t.utf8ToBytes = B, t.bytesToUtf8 = U, t.toBytes = x, t.kdfInputToBytes = I, t.concatBytes = H, t.checkOpts = k, t.createHasher = T, t.createOptHasher = Ue, t.createXOFer = Ke, t.randomBytes = gr;
  const e = co;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...v) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (v.length > 0 && !v.includes(S.length))
      throw new Error("Uint8Array expected of length " + v + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, v = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (v && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, v) {
    s(S);
    const ut = v.outputLen;
    if (S.length < ut)
      throw new Error("digestInto() expects output buffer of length at least " + ut);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function f(...S) {
    for (let v = 0; v < S.length; v++)
      S[v].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function g(S, v) {
    return S << 32 - v | S >>> v;
  }
  function h(S, v) {
    return S << v | S >>> 32 - v >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => b(S), t.byteSwapIfBE = t.swap8IfBE;
  function y(S) {
    for (let v = 0; v < S.length; v++)
      S[v] = b(S[v]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : y;
  const A = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", L = /* @__PURE__ */ Array.from({ length: 256 }, (S, v) => v.toString(16).padStart(2, "0"));
  function C(S) {
    if (s(S), A)
      return S.toHex();
    let v = "";
    for (let ut = 0; ut < S.length; ut++)
      v += L[S[ut]];
    return v;
  }
  const p = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function E(S) {
    if (S >= p._0 && S <= p._9)
      return S - p._0;
    if (S >= p.A && S <= p.F)
      return S - (p.A - 10);
    if (S >= p.a && S <= p.f)
      return S - (p.a - 10);
  }
  function m(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if (A)
      return Uint8Array.fromHex(S);
    const v = S.length, ut = v / 2;
    if (v % 2)
      throw new Error("hex string expected, got unpadded hex of length " + v);
    const dt = new Uint8Array(ut);
    for (let at = 0, Ht = 0; at < ut; at++, Ht += 2) {
      const rs = E(S.charCodeAt(Ht)), Fs = E(S.charCodeAt(Ht + 1));
      if (rs === void 0 || Fs === void 0) {
        const Ho = S[Ht] + S[Ht + 1];
        throw new Error('hex string expected, got non-hex character "' + Ho + '" at index ' + Ht);
      }
      dt[at] = rs * 16 + Fs;
    }
    return dt;
  }
  const N = async () => {
  };
  t.nextTick = N;
  async function D(S, v, ut) {
    let dt = Date.now();
    for (let at = 0; at < S; at++) {
      ut(at);
      const Ht = Date.now() - dt;
      Ht >= 0 && Ht < v || (await (0, t.nextTick)(), dt += Ht);
    }
  }
  function B(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function U(S) {
    return new TextDecoder().decode(S);
  }
  function x(S) {
    return typeof S == "string" && (S = B(S)), s(S), S;
  }
  function I(S) {
    return typeof S == "string" && (S = B(S)), s(S), S;
  }
  function H(...S) {
    let v = 0;
    for (let dt = 0; dt < S.length; dt++) {
      const at = S[dt];
      s(at), v += at.length;
    }
    const ut = new Uint8Array(v);
    for (let dt = 0, at = 0; dt < S.length; dt++) {
      const Ht = S[dt];
      ut.set(Ht, at), at += Ht.length;
    }
    return ut;
  }
  function k(S, v) {
    if (v !== void 0 && {}.toString.call(v) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, v);
  }
  class G {
  }
  t.Hash = G;
  function T(S) {
    const v = (dt) => S().update(x(dt)).digest(), ut = S();
    return v.outputLen = ut.outputLen, v.blockLen = ut.blockLen, v.create = () => S(), v;
  }
  function Ue(S) {
    const v = (dt, at) => S(at).update(x(dt)).digest(), ut = S({});
    return v.outputLen = ut.outputLen, v.blockLen = ut.blockLen, v.create = (dt) => S(dt), v;
  }
  function Ke(S) {
    const v = (dt, at) => S(at).update(x(dt)).digest(), ut = S({});
    return v.outputLen = ut.outputLen, v.blockLen = ut.blockLen, v.create = (dt) => S(dt), v;
  }
  t.wrapConstructor = T, t.wrapConstructorWithOpts = Ue, t.wrapXOFConstructorWithOpts = Ke;
  function gr(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Ve);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Ve;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let f = 0; f < u.length; f++)
        u[f] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let f = 0; f < u.length; f++)
        u[f] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
    }
    update(i) {
      return (0, e.aexists)(this), this.iHash.update(i), this;
    }
    digestInto(i) {
      (0, e.aexists)(this), (0, e.abytes)(i, this.outputLen), this.finished = !0, this.iHash.digestInto(i), this.oHash.update(i), this.oHash.digestInto(i), this.destroy();
    }
    digest() {
      const i = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(i), i;
    }
    _cloneInto(i) {
      i || (i = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: f, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = f, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (s, i, o) => new n(s, i).update(o).digest();
  t.hmac = r, t.hmac.create = (s, i) => new n(s, i);
})(Q0);
var Jt = {}, ft = {}, Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.SHA512_IV = Ot.SHA384_IV = Ot.SHA224_IV = Ot.SHA256_IV = Ot.HashMD = void 0;
Ot.setBigUint64 = J0;
Ot.Chi = ay;
Ot.Maj = cy;
const pe = Ve;
function J0(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function ay(t, e, n) {
  return t & e ^ ~t & n;
}
function cy(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class ly extends pe.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, pe.createView)(this.buffer);
  }
  update(e) {
    (0, pe.aexists)(this), e = (0, pe.toBytes)(e), (0, pe.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = (0, pe.createView)(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, pe.aexists)(this), (0, pe.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, pe.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    J0(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = (0, pe.createView)(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = i, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
Ot.HashMD = ly;
Ot.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
Ot.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
Ot.SHA384_IV = Uint32Array.from([
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
Ot.SHA512_IV = Uint32Array.from([
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
var R = {};
Object.defineProperty(R, "__esModule", { value: !0 });
R.toBig = R.shrSL = R.shrSH = R.rotrSL = R.rotrSH = R.rotrBL = R.rotrBH = R.rotr32L = R.rotr32H = R.rotlSL = R.rotlSH = R.rotlBL = R.rotlBH = R.add5L = R.add5H = R.add4L = R.add4H = R.add3L = R.add3H = void 0;
R.add = gh;
R.fromBig = Bc;
R.split = th;
const ei = /* @__PURE__ */ BigInt(2 ** 32 - 1), Sa = /* @__PURE__ */ BigInt(32);
function Bc(t, e = !1) {
  return e ? { h: Number(t & ei), l: Number(t >> Sa & ei) } : { h: Number(t >> Sa & ei) | 0, l: Number(t & ei) | 0 };
}
function th(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l: a } = Bc(t[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const eh = (t, e) => BigInt(t >>> 0) << Sa | BigInt(e >>> 0);
R.toBig = eh;
const nh = (t, e, n) => t >>> n;
R.shrSH = nh;
const rh = (t, e, n) => t << 32 - n | e >>> n;
R.shrSL = rh;
const sh = (t, e, n) => t >>> n | e << 32 - n;
R.rotrSH = sh;
const ih = (t, e, n) => t << 32 - n | e >>> n;
R.rotrSL = ih;
const oh = (t, e, n) => t << 64 - n | e >>> n - 32;
R.rotrBH = oh;
const ah = (t, e, n) => t >>> n - 32 | e << 64 - n;
R.rotrBL = ah;
const ch = (t, e) => e;
R.rotr32H = ch;
const lh = (t, e) => t;
R.rotr32L = lh;
const uh = (t, e, n) => t << n | e >>> 32 - n;
R.rotlSH = uh;
const fh = (t, e, n) => e << n | t >>> 32 - n;
R.rotlSL = fh;
const hh = (t, e, n) => e << n - 32 | t >>> 64 - n;
R.rotlBH = hh;
const dh = (t, e, n) => t << n - 32 | e >>> 64 - n;
R.rotlBL = dh;
function gh(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ph = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
R.add3L = ph;
const bh = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
R.add3H = bh;
const yh = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
R.add4L = yh;
const xh = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
R.add4H = xh;
const wh = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
R.add5L = wh;
const Sh = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0;
R.add5H = Sh;
const uy = {
  fromBig: Bc,
  split: th,
  toBig: eh,
  shrSH: nh,
  shrSL: rh,
  rotrSH: sh,
  rotrSL: ih,
  rotrBH: oh,
  rotrBL: ah,
  rotr32H: ch,
  rotr32L: lh,
  rotlSH: uh,
  rotlSL: fh,
  rotlBH: hh,
  rotlBL: dh,
  add: gh,
  add3L: ph,
  add3H: bh,
  add4L: yh,
  add4H: xh,
  add5H: Sh,
  add5L: wh
};
R.default = uy;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.sha512_224 = ft.sha512_256 = ft.sha384 = ft.sha512 = ft.sha224 = ft.sha256 = ft.SHA512_256 = ft.SHA512_224 = ft.SHA384 = ft.SHA512 = ft.SHA224 = ft.SHA256 = void 0;
const F = Ot, W = R, vt = Ve, fy = /* @__PURE__ */ Uint32Array.from([
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
]), Qe = /* @__PURE__ */ new Uint32Array(64);
let Hc = class extends F.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = F.SHA256_IV[0] | 0, this.B = F.SHA256_IV[1] | 0, this.C = F.SHA256_IV[2] | 0, this.D = F.SHA256_IV[3] | 0, this.E = F.SHA256_IV[4] | 0, this.F = F.SHA256_IV[5] | 0, this.G = F.SHA256_IV[6] | 0, this.H = F.SHA256_IV[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Qe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Qe[l - 15], h = Qe[l - 2], b = (0, vt.rotr)(g, 7) ^ (0, vt.rotr)(g, 18) ^ g >>> 3, y = (0, vt.rotr)(h, 17) ^ (0, vt.rotr)(h, 19) ^ h >>> 10;
      Qe[l] = y + Qe[l - 7] + b + Qe[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, vt.rotr)(a, 6) ^ (0, vt.rotr)(a, 11) ^ (0, vt.rotr)(a, 25), h = f + g + (0, F.Chi)(a, c, u) + fy[l] + Qe[l] | 0, y = ((0, vt.rotr)(r, 2) ^ (0, vt.rotr)(r, 13) ^ (0, vt.rotr)(r, 22)) + (0, F.Maj)(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    (0, vt.clean)(Qe);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, vt.clean)(this.buffer);
  }
};
ft.SHA256 = Hc;
let mh = class extends Hc {
  constructor() {
    super(28), this.A = F.SHA224_IV[0] | 0, this.B = F.SHA224_IV[1] | 0, this.C = F.SHA224_IV[2] | 0, this.D = F.SHA224_IV[3] | 0, this.E = F.SHA224_IV[4] | 0, this.F = F.SHA224_IV[5] | 0, this.G = F.SHA224_IV[6] | 0, this.H = F.SHA224_IV[7] | 0;
  }
};
ft.SHA224 = mh;
const Ah = W.split([
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
].map((t) => BigInt(t))), hy = Ah[0], dy = Ah[1], Je = /* @__PURE__ */ new Uint32Array(80), tn = /* @__PURE__ */ new Uint32Array(80);
let Ms = class extends F.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = F.SHA512_IV[0] | 0, this.Al = F.SHA512_IV[1] | 0, this.Bh = F.SHA512_IV[2] | 0, this.Bl = F.SHA512_IV[3] | 0, this.Ch = F.SHA512_IV[4] | 0, this.Cl = F.SHA512_IV[5] | 0, this.Dh = F.SHA512_IV[6] | 0, this.Dl = F.SHA512_IV[7] | 0, this.Eh = F.SHA512_IV[8] | 0, this.El = F.SHA512_IV[9] | 0, this.Fh = F.SHA512_IV[10] | 0, this.Fl = F.SHA512_IV[11] | 0, this.Gh = F.SHA512_IV[12] | 0, this.Gl = F.SHA512_IV[13] | 0, this.Hh = F.SHA512_IV[14] | 0, this.Hl = F.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: b, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Je[p] = e.getUint32(n), tn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = Je[p - 15] | 0, m = tn[p - 15] | 0, N = W.rotrSH(E, m, 1) ^ W.rotrSH(E, m, 8) ^ W.shrSH(E, m, 7), D = W.rotrSL(E, m, 1) ^ W.rotrSL(E, m, 8) ^ W.shrSL(E, m, 7), B = Je[p - 2] | 0, U = tn[p - 2] | 0, x = W.rotrSH(B, U, 19) ^ W.rotrBH(B, U, 61) ^ W.shrSH(B, U, 6), I = W.rotrSL(B, U, 19) ^ W.rotrBL(B, U, 61) ^ W.shrSL(B, U, 6), H = W.add4L(D, I, tn[p - 7], tn[p - 16]), k = W.add4H(H, N, x, Je[p - 7], Je[p - 16]);
      Je[p] = k | 0, tn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = W.rotrSH(l, g, 14) ^ W.rotrSH(l, g, 18) ^ W.rotrBH(l, g, 41), m = W.rotrSL(l, g, 14) ^ W.rotrSL(l, g, 18) ^ W.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = W.add5L(C, m, D, dy[p], tn[p]), U = W.add5H(B, L, E, N, hy[p], Je[p]), x = B | 0, I = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), H = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = W.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = W.add3L(x, H, G);
      r = W.add3H(T, U, I, k), s = T | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = W.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = W.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = W.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = W.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = W.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    (0, vt.clean)(Je, tn);
  }
  destroy() {
    (0, vt.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
ft.SHA512 = Ms;
let Eh = class extends Ms {
  constructor() {
    super(48), this.Ah = F.SHA384_IV[0] | 0, this.Al = F.SHA384_IV[1] | 0, this.Bh = F.SHA384_IV[2] | 0, this.Bl = F.SHA384_IV[3] | 0, this.Ch = F.SHA384_IV[4] | 0, this.Cl = F.SHA384_IV[5] | 0, this.Dh = F.SHA384_IV[6] | 0, this.Dl = F.SHA384_IV[7] | 0, this.Eh = F.SHA384_IV[8] | 0, this.El = F.SHA384_IV[9] | 0, this.Fh = F.SHA384_IV[10] | 0, this.Fl = F.SHA384_IV[11] | 0, this.Gh = F.SHA384_IV[12] | 0, this.Gl = F.SHA384_IV[13] | 0, this.Hh = F.SHA384_IV[14] | 0, this.Hl = F.SHA384_IV[15] | 0;
  }
};
ft.SHA384 = Eh;
const _t = /* @__PURE__ */ Uint32Array.from([
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
]), Mt = /* @__PURE__ */ Uint32Array.from([
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
let Ih = class extends Ms {
  constructor() {
    super(28), this.Ah = _t[0] | 0, this.Al = _t[1] | 0, this.Bh = _t[2] | 0, this.Bl = _t[3] | 0, this.Ch = _t[4] | 0, this.Cl = _t[5] | 0, this.Dh = _t[6] | 0, this.Dl = _t[7] | 0, this.Eh = _t[8] | 0, this.El = _t[9] | 0, this.Fh = _t[10] | 0, this.Fl = _t[11] | 0, this.Gh = _t[12] | 0, this.Gl = _t[13] | 0, this.Hh = _t[14] | 0, this.Hl = _t[15] | 0;
  }
};
ft.SHA512_224 = Ih;
let $h = class extends Ms {
  constructor() {
    super(32), this.Ah = Mt[0] | 0, this.Al = Mt[1] | 0, this.Bh = Mt[2] | 0, this.Bl = Mt[3] | 0, this.Ch = Mt[4] | 0, this.Cl = Mt[5] | 0, this.Dh = Mt[6] | 0, this.Dl = Mt[7] | 0, this.Eh = Mt[8] | 0, this.El = Mt[9] | 0, this.Fh = Mt[10] | 0, this.Fl = Mt[11] | 0, this.Gh = Mt[12] | 0, this.Gl = Mt[13] | 0, this.Hh = Mt[14] | 0, this.Hl = Mt[15] | 0;
  }
};
ft.SHA512_256 = $h;
ft.sha256 = (0, vt.createHasher)(() => new Hc());
ft.sha224 = (0, vt.createHasher)(() => new mh());
ft.sha512 = (0, vt.createHasher)(() => new Ms());
ft.sha384 = (0, vt.createHasher)(() => new Eh());
ft.sha512_256 = (0, vt.createHasher)(() => new $h());
ft.sha512_224 = (0, vt.createHasher)(() => new Ih());
Object.defineProperty(Jt, "__esModule", { value: !0 });
Jt.sha224 = Jt.SHA224 = Jt.sha256 = Jt.SHA256 = void 0;
const lo = ft;
Jt.SHA256 = lo.SHA256;
Jt.sha256 = lo.sha256;
Jt.SHA224 = lo.SHA224;
Jt.sha224 = lo.sha224;
const gy = /* @__PURE__ */ P0(z2);
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.joseToDer = Tr.derToJose = void 0;
const vh = _s, Lh = kt;
function Xo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const py = {
  ES256: Xo(256),
  ES384: Xo(384),
  ES512: Xo(521)
};
function Ch(t) {
  const e = py[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ni = 128, Bh = 0, by = 32, yy = 16, xy = 2, Hh = yy | by | Bh << 6, Ti = xy | Bh << 6;
function _h(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, vh.toByteArray)((0, Lh.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function wy(t, e) {
  const n = _h(t), r = Ch(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Hh)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ni | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ti)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ti)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - f, b = new Uint8Array(g + c + h + f);
  for (o = 0; o < g; ++o)
    b[o] = 0;
  b.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const y = o; o < y + h; ++o)
    b[o] = 0;
  return b.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, Lh.escape)((0, vh.fromByteArray)(b));
}
Tr.derToJose = wy;
function bu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ni && --r, r;
}
function Sy(t, e) {
  t = _h(t);
  const n = Ch(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = bu(t, 0, n), i = bu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Ni, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Hh, u ? f[l++] = c : (f[l++] = Ni | 1, f[l++] = c & 255), f[l++] = Ti, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = Ti, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
Tr.joseToDer = Sy;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.InvalidTokenError = je.MissingParametersError = void 0;
class my extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
je.MissingParametersError = my;
class Ay extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
je.InvalidTokenError = Ay;
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.SECP256K1Client = void 0;
const Ey = Q0, Iy = Jt, Ai = gy, yu = Tr, xu = je, wu = Ve;
Ai.utils.hmacSha256Sync = (t, ...e) => {
  const n = Ey.hmac.create(Iy.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Mh {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, wu.bytesToHex)(Ai.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new xu.MissingParametersError("a signing input hash and private key are all required");
    const s = Ai.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, wu.bytesToHex)(s);
    if (r === "jose")
      return (0, yu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, yu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new xu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Ai.verify(n, e, r, { strict: !1 });
  }
}
ao.SECP256K1Client = Mh;
Mh.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ao;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(oo);
var Xn = {};
const $y = /* @__PURE__ */ P0(m0);
var vy = jt && jt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        u(r.next(f));
      } catch (l) {
        o(l);
      }
    }
    function c(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        o(l);
      }
    }
    function u(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.hashSha256Async = Xn.hashSha256 = void 0;
const Ly = Jt;
function Uh(t) {
  return (0, Ly.sha256)(t);
}
Xn.hashSha256 = Uh;
function Cy(t) {
  return vy(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = $y;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Uh(t));
    }
  });
}
Xn.hashSha256Async = Cy;
var By = jt && jt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        u(r.next(f));
      } catch (l) {
        o(l);
      }
    }
    function c(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        o(l);
      }
    }
    function u(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.TokenSigner = Nr.createUnsecuredToken = void 0;
const ma = kt, Su = oo, Hy = je, mu = Xn;
function Aa(t, e) {
  const n = [], r = ma.encode(JSON.stringify(e));
  n.push(r);
  const s = ma.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function _y(t) {
  return Aa(t, { typ: "JWT", alg: "none" }) + ".";
}
Nr.createUnsecuredToken = _y;
class My {
  constructor(e, n) {
    if (!(e && n))
      throw new Hy.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Su.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Su.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Aa(e, s), o = (0, mu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return By(this, void 0, void 0, function* () {
      const s = this.header(r), i = Aa(e, s), o = yield (0, mu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ma.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Nr.TokenSigner = My;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.TokenVerifier = void 0;
const Uy = kt, Au = oo, Ny = je, ni = Xn;
class Ty {
  constructor(e, n) {
    if (!(e && n))
      throw new Ny.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Au.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Au.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], i = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, ni.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, ni.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Uy.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ni.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, ni.hashSha256)(r);
      return i(o);
    }
  }
}
uo.TokenVerifier = Ty;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.decodeToken = void 0;
const ri = kt;
function Py(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ri.decode(e[0])), r = JSON.parse(ri.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ri.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ri.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
fo.decodeToken = Py;
(function(t) {
  var e = jt && jt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = jt && jt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Nr, t), n(uo, t), n(fo, t), n(je, t), n(oo, t);
})(Tt);
function Dy(t) {
  return `did:btc-addr:${t}`;
}
function ky(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new nu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new nu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Nh(t) {
  if (t)
    return ky(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Oy = "1.4.0";
function Fy() {
  return Wb();
}
function jy(t, e, n, r = h0.slice(), s, i = V1().getTime(), o = {}) {
  const a = (h) => {
    const b = yc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: K1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Oy,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Tt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = V0(u);
  return c.iss = Dy(f), new Tt.TokenSigner("ES256k", t).sign(c);
}
async function Eu(t, e) {
  const n = Bs(rt(e)), r = JSON.parse(n), s = await q0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function zy(t) {
  const e = Tt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Tt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Ry(t) {
  const e = Tt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Nh(e.iss);
  if (n.length === 1) {
    if (V0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Vy(t) {
  const e = Tt.decodeToken(t).payload;
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
function Gy(t) {
  const e = Tt.decodeToken(t).payload;
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
function Ky(t) {
  const e = [
    Gy(t),
    Vy(t),
    zy(t),
    Ry(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Iu = "1.0.0";
class Ln {
  constructor(e) {
    this.version = Iu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Iu)
      throw new ga(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ln(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Th {
  constructor(e) {
    if (e) {
      const n = new Ln(e);
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
class $u extends Th {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ln({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new d0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ln({})), !0;
  }
}
class vu extends Th {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = j1, !localStorage.getItem(this.key)) {
      const r = new Ln({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new d0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ln.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ln({})), !0;
  }
}
var bs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(bs || (bs = {}));
var Pi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pi || (Pi = {}));
bs.Mainnet;
var Oe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Oe || (Oe = {}));
var Ee;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ee || (Ee = {}));
Oe.Mainnet;
const Ph = {
  chainId: bs.Mainnet,
  transactionVersion: Oe.Mainnet,
  peerNetworkId: Pi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ee.MainnetSingleSig,
    multiSig: Ee.MainnetMultiSig
  },
  client: { baseUrl: g0 }
}, Ea = {
  chainId: bs.Testnet,
  transactionVersion: Oe.Testnet,
  peerNetworkId: Pi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ee.TestnetSingleSig,
    multiSig: Ee.TestnetMultiSig
  },
  client: { baseUrl: p0 }
}, Ei = {
  ...Ea,
  addressVersion: { ...Ea.addressVersion },
  magicBytes: "id",
  client: { baseUrl: b0 }
}, Wy = {
  ...Ei,
  addressVersion: { ...Ei.addressVersion },
  client: { ...Ei.client }
};
function qy(t) {
  switch (t) {
    case "mainnet":
      return Ph;
    case "testnet":
      return Ea;
    case "devnet":
      return Ei;
    case "mocknet":
      return Wy;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Dh(t) {
  return typeof t == "string" ? qy(t) : t;
}
var Lu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lu || (Lu = {}));
var Cu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Cu || (Cu = {}));
var ae;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ae || (ae = {}));
const Zo = ["onChainOnly", "offChainOnly", "any"];
Zo[0] + "", ae.OnChainOnly, Zo[1] + "", ae.OffChainOnly, Zo[2] + "", ae.Any, ae.OnChainOnly + "", ae.OnChainOnly, ae.OffChainOnly + "", ae.OffChainOnly, ae.Any + "", ae.Any;
var Bu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Bu || (Bu = {}));
var Hu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Hu || (Hu = {}));
var _u;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(_u || (_u = {}));
var ke;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ke || (ke = {}));
var Mu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Mu || (Mu = {}));
var Uu;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Uu || (Uu = {}));
var Nu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Nu || (Nu = {}));
var Tu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Tu || (Tu = {}));
var Pu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Pu || (Pu = {}));
var Du;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Du || (Du = {}));
var ku;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ku || (ku = {}));
var Ou;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ou || (Ou = {}));
var Fu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Fu || (Fu = {}));
function Ia(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Yy(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function kh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Xy(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ia(t.outputLen), Ia(t.blockLen);
}
function Zy(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qy(t, e) {
  kh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const On = {
  number: Ia,
  bool: Yy,
  bytes: kh,
  hash: Xy,
  exists: Zy,
  output: Qy
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), be = (t, e) => t << 32 - e | t >>> e, Jy = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Jy)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _c(t) {
  if (typeof t == "string" && (t = tx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Oh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ur(t) {
  const e = (r) => t().update(_c(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Fh = class extends Oh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, On.hash(e);
    const r = _c(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return On.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    On.exists(this), On.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const jh = (t, e, n) => new Fh(t, e).update(n).digest();
jh.create = (t, e) => new Fh(t, e);
function ex(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Mc = class extends Oh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qo(this.buffer);
  }
  update(e) {
    On.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = _c(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Qo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    On.exists(this), On.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ex(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Qo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const nx = (t, e, n) => t & e ^ ~t & n, rx = (t, e, n) => t & e ^ t & n ^ e & n, sx = new Uint32Array([
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
]), en = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), nn = new Uint32Array(64);
let zh = class extends Mc {
  constructor() {
    super(64, 32, 8, !1), this.A = en[0] | 0, this.B = en[1] | 0, this.C = en[2] | 0, this.D = en[3] | 0, this.E = en[4] | 0, this.F = en[5] | 0, this.G = en[6] | 0, this.H = en[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      nn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = nn[l - 15], h = nn[l - 2], b = be(g, 7) ^ be(g, 18) ^ g >>> 3, y = be(h, 17) ^ be(h, 19) ^ h >>> 10;
      nn[l] = y + nn[l - 7] + b + nn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = be(a, 6) ^ be(a, 11) ^ be(a, 25), h = f + g + nx(a, c, u) + sx[l] + nn[l] | 0, y = (be(r, 2) ^ be(r, 13) ^ be(r, 22)) + rx(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    nn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ix = class extends zh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Rh = ur(() => new zh());
ur(() => new ix());
var Xr = {}, Uc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ve;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const b = n.indexOf(o[h]) >> u;
        let y = 0;
        h !== 0 && (y = n.indexOf(o[h - 1]));
        const A = 1 + u, L = y % (1 << A) << 5 - A, C = t.c32[b + L];
        u = A, c.unshift(C);
      } else
        u = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let b = 0; b < h; b++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, a) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let f = [], l = 0, g = 0;
    for (let y = o.length - 1; y >= 0; y--) {
      g === 4 && (f.unshift(n[l]), g = 0, l = 0);
      const L = (t.c32.indexOf(o[y]) << g) + l, C = n[L % 16];
      if (g += 1, l = L >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      f.unshift(C);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let y = 0; y < f.length && f[y] === "0"; y++)
      h++;
    f = f.slice(h - h % 2);
    let b = f.join("");
    for (let y = 0; y < u; y++)
      b = `00${b}`;
    if (a) {
      const y = a * 2 - b.length;
      for (let A = 0; A < y; A += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = i;
})(Uc);
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.c32checkDecode = Zn.c32checkEncode = void 0;
const ju = Jt, zu = Ve, hs = Uc;
function Vh(t) {
  const e = (0, ju.sha256)((0, ju.sha256)((0, zu.hexToBytes)(t)));
  return (0, zu.bytesToHex)(e.slice(0, 4));
}
function ox(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Vh(`${n}${e}`), s = (0, hs.c32encode)(`${e}${r}`);
  return `${hs.c32[t]}${s}`;
}
Zn.c32checkEncode = ox;
function ax(t) {
  t = (0, hs.c32normalize)(t);
  const e = (0, hs.c32decode)(t.slice(1)), n = t[0], r = hs.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Vh(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Zn.c32checkDecode = ax;
var Gh = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.decode = Pr.encode = void 0;
const Di = Jt, Ru = Ve, Kh = O0, Wh = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function cx(t, e = "00") {
  const n = typeof t == "string" ? (0, Ru.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ru.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Di.sha256)((0, Di.sha256)(new Uint8Array([...r, ...n])));
  return Kh(Wh).encode([...r, ...n, ...s.slice(0, 4)]);
}
Pr.encode = cx;
function lx(t) {
  const e = Kh(Wh).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Di.sha256)((0, Di.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Pr.decode = lx;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Zn, n = Pr, r = Ve;
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
  const i = {};
  i[t.versions.mainnet.p2pkh] = 0, i[t.versions.mainnet.p2sh] = 5, i[t.versions.testnet.p2pkh] = 111, i[t.versions.testnet.p2sh] = 196;
  function o(f, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, l)}`;
  }
  t.c32address = o;
  function a(f) {
    if (f.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (f[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(f.slice(1));
  }
  t.c32addressDecode = a;
  function c(f, l = -1) {
    const g = n.decode(f), h = (0, r.bytesToHex)(g.data), b = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let y;
    return l < 0 ? (y = b, s[b] !== void 0 && (y = s[b])) : y = l, o(y, h);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const g = a(f), h = g[0], b = g[1];
    let y;
    l < 0 ? (y = h, i[h] !== void 0 && (y = i[h])) : y = l;
    let A = y.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(b, A);
  }
  t.c32ToB58 = u;
})(Gh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Uc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Zn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Gh;
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
})(Xr);
function ux(t, e) {
  switch (e = Dh(e ?? Ph), t) {
    case ke.P2PKH:
      switch (e.transactionVersion) {
        case Oe.Mainnet:
          return Ee.MainnetSingleSig;
        case Oe.Testnet:
          return Ee.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case ke.P2SH:
    case ke.P2SHNonSequential:
    case ke.P2WPKH:
    case ke.P2WSH:
    case ke.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Oe.Mainnet:
          return Ee.MainnetMultiSig;
        case Oe.Testnet:
          return Ee.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qh = Uint8Array.from({ length: 16 }, (t, e) => e), hx = qh.map((t) => (9 * t + 5) % 16);
let Nc = [qh], Tc = [hx];
for (let t = 0; t < 4; t++)
  for (let e of [Nc, Tc])
    e.push(e[t].map((n) => fx[n]));
const Yh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), dx = Nc.map((t, e) => t.map((n) => Yh[e][n])), gx = Tc.map((t, e) => t.map((n) => Yh[e][n])), px = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), bx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), si = (t, e) => t << e | t >>> 32 - e;
function Vu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ii = new Uint32Array(16);
let yx = class extends Mc {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ii[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = px[h], A = bx[h], L = Nc[h], C = Tc[h], p = dx[h], E = gx[h];
      for (let m = 0; m < 16; m++) {
        const N = si(r + Vu(h, i, a, u) + ii[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = si(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = si(s + Vu(b, o, c, f) + ii[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = si(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ii.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const xx = ur(() => new yx()), oi = BigInt(2 ** 32 - 1), $a = BigInt(32);
function Xh(t, e = !1) {
  return e ? { h: Number(t & oi), l: Number(t >> $a & oi) } : { h: Number(t >> $a & oi) | 0, l: Number(t & oi) | 0 };
}
function wx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Xh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Sx = (t, e) => BigInt(t >>> 0) << $a | BigInt(e >>> 0), mx = (t, e, n) => t >>> n, Ax = (t, e, n) => t << 32 - n | e >>> n, Ex = (t, e, n) => t >>> n | e << 32 - n, Ix = (t, e, n) => t << 32 - n | e >>> n, $x = (t, e, n) => t << 64 - n | e >>> n - 32, vx = (t, e, n) => t >>> n - 32 | e << 64 - n, Lx = (t, e) => e, Cx = (t, e) => t, Bx = (t, e, n) => t << n | e >>> 32 - n, Hx = (t, e, n) => e << n | t >>> 32 - n, _x = (t, e, n) => e << n - 32 | t >>> 64 - n, Mx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ux(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Nx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Tx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Px = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, kx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ox = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: Xh,
  split: wx,
  toBig: Sx,
  shrSH: mx,
  shrSL: Ax,
  rotrSH: Ex,
  rotrSL: Ix,
  rotrBH: $x,
  rotrBL: vx,
  rotr32H: Lx,
  rotr32L: Cx,
  rotlSH: Bx,
  rotlSL: Hx,
  rotlBH: _x,
  rotlBL: Mx,
  add: Ux,
  add3L: Nx,
  add3H: Tx,
  add4L: Px,
  add4H: Dx,
  add5H: Ox,
  add5L: kx
}, [Fx, jx] = q.split([
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
].map((t) => BigInt(t))), rn = new Uint32Array(80), sn = new Uint32Array(80);
let ho = class extends Mc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: b, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      rn[p] = e.getUint32(n), sn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = rn[p - 15] | 0, m = sn[p - 15] | 0, N = q.rotrSH(E, m, 1) ^ q.rotrSH(E, m, 8) ^ q.shrSH(E, m, 7), D = q.rotrSL(E, m, 1) ^ q.rotrSL(E, m, 8) ^ q.shrSL(E, m, 7), B = rn[p - 2] | 0, U = sn[p - 2] | 0, x = q.rotrSH(B, U, 19) ^ q.rotrBH(B, U, 61) ^ q.shrSH(B, U, 6), I = q.rotrSL(B, U, 19) ^ q.rotrBL(B, U, 61) ^ q.shrSL(B, U, 6), H = q.add4L(D, I, sn[p - 7], sn[p - 16]), k = q.add4H(H, N, x, rn[p - 7], rn[p - 16]);
      rn[p] = k | 0, sn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = q.rotrSH(l, g, 14) ^ q.rotrSH(l, g, 18) ^ q.rotrBH(l, g, 41), m = q.rotrSL(l, g, 14) ^ q.rotrSL(l, g, 18) ^ q.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = q.add5L(C, m, D, jx[p], sn[p]), U = q.add5H(B, L, E, N, Fx[p], rn[p]), x = B | 0, I = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), H = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = q.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = q.add3L(x, H, G);
      r = q.add3H(T, U, I, k), s = T | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = q.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = q.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = q.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = q.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = q.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    rn.fill(0), sn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zx = class extends ho {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Rx = class extends ho {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Vx = class extends ho {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ur(() => new ho());
ur(() => new zx());
ur(() => new Rx());
ur(() => new Vx());
var ki = { exports: {} };
ki.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", y = "[object Promise]", A = "[object RegExp]", L = "[object Set]", C = "[object String]", p = "[object Symbol]", E = "[object WeakMap]", m = "[object ArrayBuffer]", N = "[object DataView]", D = "[object Float32Array]", B = "[object Float64Array]", U = "[object Int8Array]", x = "[object Int16Array]", I = "[object Int32Array]", H = "[object Uint8Array]", k = "[object Uint8ClampedArray]", G = "[object Uint16Array]", T = "[object Uint32Array]", Ue = /[\\^$.*+?()[\]{}|]/g, Ke = /\w*$/, gr = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, v = {};
  v[i] = v[o] = v[m] = v[N] = v[a] = v[c] = v[D] = v[B] = v[U] = v[x] = v[I] = v[g] = v[h] = v[b] = v[A] = v[L] = v[C] = v[p] = v[H] = v[k] = v[G] = v[T] = !0, v[u] = v[f] = v[E] = !1;
  var ut = typeof jt == "object" && jt && jt.Object === Object && jt, dt = typeof self == "object" && self && self.Object === Object && self, at = ut || dt || Function("return this")(), Ht = e && !e.nodeType && e, rs = Ht && !0 && t && !t.nodeType && t, Fs = rs && rs.exports === Ht;
  function Ho(d, w) {
    return d.set(w[0], w[1]), d;
  }
  function rp(d, w) {
    return d.add(w), d;
  }
  function sp(d, w) {
    for (var $ = -1, P = d ? d.length : 0; ++$ < P && w(d[$], $, d) !== !1; )
      ;
    return d;
  }
  function ip(d, w) {
    for (var $ = -1, P = w.length, Bt = d.length; ++$ < P; )
      d[Bt + $] = w[$];
    return d;
  }
  function Hl(d, w, $, P) {
    for (var Bt = -1, Rt = d ? d.length : 0; ++Bt < Rt; )
      $ = w($, d[Bt], Bt, d);
    return $;
  }
  function op(d, w) {
    for (var $ = -1, P = Array(d); ++$ < d; )
      P[$] = w($);
    return P;
  }
  function ap(d, w) {
    return d == null ? void 0 : d[w];
  }
  function _l(d) {
    var w = !1;
    if (d != null && typeof d.toString != "function")
      try {
        w = !!(d + "");
      } catch {
      }
    return w;
  }
  function Ml(d) {
    var w = -1, $ = Array(d.size);
    return d.forEach(function(P, Bt) {
      $[++w] = [Bt, P];
    }), $;
  }
  function _o(d, w) {
    return function($) {
      return d(w($));
    };
  }
  function Ul(d) {
    var w = -1, $ = Array(d.size);
    return d.forEach(function(P) {
      $[++w] = P;
    }), $;
  }
  var cp = Array.prototype, lp = Function.prototype, js = Object.prototype, Mo = at["__core-js_shared__"], Nl = function() {
    var d = /[^.]+$/.exec(Mo && Mo.keys && Mo.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Tl = lp.toString, We = js.hasOwnProperty, zs = js.toString, up = RegExp(
    "^" + Tl.call(We).replace(Ue, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Pl = Fs ? at.Buffer : void 0, Dl = at.Symbol, kl = at.Uint8Array, fp = _o(Object.getPrototypeOf, Object), hp = Object.create, dp = js.propertyIsEnumerable, gp = cp.splice, Ol = Object.getOwnPropertySymbols, pp = Pl ? Pl.isBuffer : void 0, bp = _o(Object.keys, Object), Uo = yr(at, "DataView"), ss = yr(at, "Map"), No = yr(at, "Promise"), To = yr(at, "Set"), Po = yr(at, "WeakMap"), is = yr(Object, "create"), yp = Tn(Uo), xp = Tn(ss), wp = Tn(No), Sp = Tn(To), mp = Tn(Po), Fl = Dl ? Dl.prototype : void 0, jl = Fl ? Fl.valueOf : void 0;
  function Un(d) {
    var w = -1, $ = d ? d.length : 0;
    for (this.clear(); ++w < $; ) {
      var P = d[w];
      this.set(P[0], P[1]);
    }
  }
  function Ap() {
    this.__data__ = is ? is(null) : {};
  }
  function Ep(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function Ip(d) {
    var w = this.__data__;
    if (is) {
      var $ = w[d];
      return $ === r ? void 0 : $;
    }
    return We.call(w, d) ? w[d] : void 0;
  }
  function $p(d) {
    var w = this.__data__;
    return is ? w[d] !== void 0 : We.call(w, d);
  }
  function vp(d, w) {
    var $ = this.__data__;
    return $[d] = is && w === void 0 ? r : w, this;
  }
  Un.prototype.clear = Ap, Un.prototype.delete = Ep, Un.prototype.get = Ip, Un.prototype.has = $p, Un.prototype.set = vp;
  function Ne(d) {
    var w = -1, $ = d ? d.length : 0;
    for (this.clear(); ++w < $; ) {
      var P = d[w];
      this.set(P[0], P[1]);
    }
  }
  function Lp() {
    this.__data__ = [];
  }
  function Cp(d) {
    var w = this.__data__, $ = Rs(w, d);
    if ($ < 0)
      return !1;
    var P = w.length - 1;
    return $ == P ? w.pop() : gp.call(w, $, 1), !0;
  }
  function Bp(d) {
    var w = this.__data__, $ = Rs(w, d);
    return $ < 0 ? void 0 : w[$][1];
  }
  function Hp(d) {
    return Rs(this.__data__, d) > -1;
  }
  function _p(d, w) {
    var $ = this.__data__, P = Rs($, d);
    return P < 0 ? $.push([d, w]) : $[P][1] = w, this;
  }
  Ne.prototype.clear = Lp, Ne.prototype.delete = Cp, Ne.prototype.get = Bp, Ne.prototype.has = Hp, Ne.prototype.set = _p;
  function pr(d) {
    var w = -1, $ = d ? d.length : 0;
    for (this.clear(); ++w < $; ) {
      var P = d[w];
      this.set(P[0], P[1]);
    }
  }
  function Mp() {
    this.__data__ = {
      hash: new Un(),
      map: new (ss || Ne)(),
      string: new Un()
    };
  }
  function Up(d) {
    return Vs(this, d).delete(d);
  }
  function Np(d) {
    return Vs(this, d).get(d);
  }
  function Tp(d) {
    return Vs(this, d).has(d);
  }
  function Pp(d, w) {
    return Vs(this, d).set(d, w), this;
  }
  pr.prototype.clear = Mp, pr.prototype.delete = Up, pr.prototype.get = Np, pr.prototype.has = Tp, pr.prototype.set = Pp;
  function br(d) {
    this.__data__ = new Ne(d);
  }
  function Dp() {
    this.__data__ = new Ne();
  }
  function kp(d) {
    return this.__data__.delete(d);
  }
  function Op(d) {
    return this.__data__.get(d);
  }
  function Fp(d) {
    return this.__data__.has(d);
  }
  function jp(d, w) {
    var $ = this.__data__;
    if ($ instanceof Ne) {
      var P = $.__data__;
      if (!ss || P.length < n - 1)
        return P.push([d, w]), this;
      $ = this.__data__ = new pr(P);
    }
    return $.set(d, w), this;
  }
  br.prototype.clear = Dp, br.prototype.delete = kp, br.prototype.get = Op, br.prototype.has = Fp, br.prototype.set = jp;
  function zp(d, w) {
    var $ = Oo(d) || h1(d) ? op(d.length, String) : [], P = $.length, Bt = !!P;
    for (var Rt in d)
      We.call(d, Rt) && !(Bt && (Rt == "length" || c1(Rt, P))) && $.push(Rt);
    return $;
  }
  function zl(d, w, $) {
    var P = d[w];
    (!(We.call(d, w) && Kl(P, $)) || $ === void 0 && !(w in d)) && (d[w] = $);
  }
  function Rs(d, w) {
    for (var $ = d.length; $--; )
      if (Kl(d[$][0], w))
        return $;
    return -1;
  }
  function Rp(d, w) {
    return d && Rl(w, Fo(w), d);
  }
  function Do(d, w, $, P, Bt, Rt, Te) {
    var Vt;
    if (P && (Vt = Rt ? P(d, Bt, Rt, Te) : P(d)), Vt !== void 0)
      return Vt;
    if (!Gs(d))
      return d;
    var Yl = Oo(d);
    if (Yl) {
      if (Vt = i1(d), !w)
        return n1(d, Vt);
    } else {
      var xr = Nn(d), Xl = xr == f || xr == l;
      if (g1(d))
        return Yp(d, w);
      if (xr == b || xr == i || Xl && !Rt) {
        if (_l(d))
          return Rt ? d : {};
        if (Vt = o1(Xl ? {} : d), !w)
          return r1(d, Rp(Vt, d));
      } else {
        if (!v[xr])
          return Rt ? d : {};
        Vt = a1(d, xr, Do, w);
      }
    }
    Te || (Te = new br());
    var Zl = Te.get(d);
    if (Zl)
      return Zl;
    if (Te.set(d, Vt), !Yl)
      var Ql = $ ? s1(d) : Fo(d);
    return sp(Ql || d, function(jo, Ks) {
      Ql && (Ks = jo, jo = d[Ks]), zl(Vt, Ks, Do(jo, w, $, P, Ks, d, Te));
    }), Vt;
  }
  function Vp(d) {
    return Gs(d) ? hp(d) : {};
  }
  function Gp(d, w, $) {
    var P = w(d);
    return Oo(d) ? P : ip(P, $(d));
  }
  function Kp(d) {
    return zs.call(d);
  }
  function Wp(d) {
    if (!Gs(d) || u1(d))
      return !1;
    var w = ql(d) || _l(d) ? up : gr;
    return w.test(Tn(d));
  }
  function qp(d) {
    if (!Gl(d))
      return bp(d);
    var w = [];
    for (var $ in Object(d))
      We.call(d, $) && $ != "constructor" && w.push($);
    return w;
  }
  function Yp(d, w) {
    if (w)
      return d.slice();
    var $ = new d.constructor(d.length);
    return d.copy($), $;
  }
  function ko(d) {
    var w = new d.constructor(d.byteLength);
    return new kl(w).set(new kl(d)), w;
  }
  function Xp(d, w) {
    var $ = w ? ko(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.byteLength);
  }
  function Zp(d, w, $) {
    var P = w ? $(Ml(d), !0) : Ml(d);
    return Hl(P, Ho, new d.constructor());
  }
  function Qp(d) {
    var w = new d.constructor(d.source, Ke.exec(d));
    return w.lastIndex = d.lastIndex, w;
  }
  function Jp(d, w, $) {
    var P = w ? $(Ul(d), !0) : Ul(d);
    return Hl(P, rp, new d.constructor());
  }
  function t1(d) {
    return jl ? Object(jl.call(d)) : {};
  }
  function e1(d, w) {
    var $ = w ? ko(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.length);
  }
  function n1(d, w) {
    var $ = -1, P = d.length;
    for (w || (w = Array(P)); ++$ < P; )
      w[$] = d[$];
    return w;
  }
  function Rl(d, w, $, P) {
    $ || ($ = {});
    for (var Bt = -1, Rt = w.length; ++Bt < Rt; ) {
      var Te = w[Bt], Vt = void 0;
      zl($, Te, Vt === void 0 ? d[Te] : Vt);
    }
    return $;
  }
  function r1(d, w) {
    return Rl(d, Vl(d), w);
  }
  function s1(d) {
    return Gp(d, Fo, Vl);
  }
  function Vs(d, w) {
    var $ = d.__data__;
    return l1(w) ? $[typeof w == "string" ? "string" : "hash"] : $.map;
  }
  function yr(d, w) {
    var $ = ap(d, w);
    return Wp($) ? $ : void 0;
  }
  var Vl = Ol ? _o(Ol, Object) : y1, Nn = Kp;
  (Uo && Nn(new Uo(new ArrayBuffer(1))) != N || ss && Nn(new ss()) != g || No && Nn(No.resolve()) != y || To && Nn(new To()) != L || Po && Nn(new Po()) != E) && (Nn = function(d) {
    var w = zs.call(d), $ = w == b ? d.constructor : void 0, P = $ ? Tn($) : void 0;
    if (P)
      switch (P) {
        case yp:
          return N;
        case xp:
          return g;
        case wp:
          return y;
        case Sp:
          return L;
        case mp:
          return E;
      }
    return w;
  });
  function i1(d) {
    var w = d.length, $ = d.constructor(w);
    return w && typeof d[0] == "string" && We.call(d, "index") && ($.index = d.index, $.input = d.input), $;
  }
  function o1(d) {
    return typeof d.constructor == "function" && !Gl(d) ? Vp(fp(d)) : {};
  }
  function a1(d, w, $, P) {
    var Bt = d.constructor;
    switch (w) {
      case m:
        return ko(d);
      case a:
      case c:
        return new Bt(+d);
      case N:
        return Xp(d, P);
      case D:
      case B:
      case U:
      case x:
      case I:
      case H:
      case k:
      case G:
      case T:
        return e1(d, P);
      case g:
        return Zp(d, P, $);
      case h:
      case C:
        return new Bt(d);
      case A:
        return Qp(d);
      case L:
        return Jp(d, P, $);
      case p:
        return t1(d);
    }
  }
  function c1(d, w) {
    return w = w ?? s, !!w && (typeof d == "number" || S.test(d)) && d > -1 && d % 1 == 0 && d < w;
  }
  function l1(d) {
    var w = typeof d;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? d !== "__proto__" : d === null;
  }
  function u1(d) {
    return !!Nl && Nl in d;
  }
  function Gl(d) {
    var w = d && d.constructor, $ = typeof w == "function" && w.prototype || js;
    return d === $;
  }
  function Tn(d) {
    if (d != null) {
      try {
        return Tl.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function f1(d) {
    return Do(d, !0, !0);
  }
  function Kl(d, w) {
    return d === w || d !== d && w !== w;
  }
  function h1(d) {
    return d1(d) && We.call(d, "callee") && (!dp.call(d, "callee") || zs.call(d) == i);
  }
  var Oo = Array.isArray;
  function Wl(d) {
    return d != null && p1(d.length) && !ql(d);
  }
  function d1(d) {
    return b1(d) && Wl(d);
  }
  var g1 = pp || x1;
  function ql(d) {
    var w = Gs(d) ? zs.call(d) : "";
    return w == f || w == l;
  }
  function p1(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Gs(d) {
    var w = typeof d;
    return !!d && (w == "object" || w == "function");
  }
  function b1(d) {
    return !!d && typeof d == "object";
  }
  function Fo(d) {
    return Wl(d) ? zp(d) : qp(d);
  }
  function y1() {
    return [];
  }
  function x1() {
    return !1;
  }
  t.exports = f1;
})(ki, ki.exports);
var Gx = ki.exports;
const Zh = /* @__PURE__ */ T0(Gx);
var va;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(va || (va = {}));
function Kx(t, e) {
  return { type: va.Address, version: t, hash160: e };
}
function Wx(t) {
  return Xr.c32address(t.version, t.hash160);
}
const qx = (t) => xx(Rh(t)), Yx = (t) => z(qx(t));
At.hmacSha256Sync = (t, ...e) => {
  const n = jh.create(Rh, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Xx(t, e = "mainnet") {
  e = Dh(e), t = typeof t == "string" ? rt(t) : t;
  const n = ux(ke.P2PKH, e), r = Kx(n, Yx(t));
  return Wx(r);
}
function Zx(t, e) {
  const n = Tt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Xx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Tt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Qx(t, e = null) {
  let n;
  e ? n = Zx(t, e) : n = Tt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Gu = "_blockstackDidCheckEchoReply", Jx = "echoReply", tw = "authContinuation";
function ew(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function nw() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Gu];
  if (typeof e == "boolean")
    return e;
  const n = ew(t.location.search), r = n[Jx];
  if (r) {
    t[Gu] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[tw];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class ys {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new no();
    else
      throw new R1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new vu(e.sessionOptions) : this.store = new vu() : e ? this.store = new $u(e.sessionOptions) : this.store = new $u();
  }
  makeAuthRequestToken(e, n, r, s, i, o = G1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ga("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, jy(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Fy();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = yc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (nw())
        return mr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      mr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = g2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ws("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Tt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Ky(e))
      throw new Ws("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Ko(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Eu(s, i.private_key);
          } catch {
            if (mr.warn("Failed decryption of appPrivateKey, will try to use as given"), !At.isValidPrivateKey(i.private_key))
              throw new Ws("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Eu(s, c);
          } catch {
            mr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ws("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = r2, f;
    Ko(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Ko(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Nh(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, F1);
      else {
        const b = await h.text(), y = JSON.parse(b);
        l.profile = Qx(y[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ga("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ry(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), sy(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
ys.prototype.makeAuthRequest = ys.prototype.makeAuthRequestToken;
const rw = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], sw = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = rw(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!go(r.id));
  return e.concat(n);
}, go = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Pc = "STX_PROVIDER", he = () => typeof window > "u" ? null : window.localStorage.getItem(Pc), Qh = (t) => {
  typeof window < "u" && window.localStorage.setItem(Pc, t);
}, Jh = () => {
  typeof window < "u" && window.localStorage.removeItem(Pc);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof jt < "u" && jt || {}, r = {
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
      function s(x) {
        return x && DataView.prototype.isPrototypeOf(x);
      }
      if (r.arrayBuffer)
        var i = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], o = ArrayBuffer.isView || function(x) {
          return x && i.indexOf(Object.prototype.toString.call(x)) > -1;
        };
      function a(x) {
        if (typeof x != "string" && (x = String(x)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(x) || x === "")
          throw new TypeError('Invalid character in header field name: "' + x + '"');
        return x.toLowerCase();
      }
      function c(x) {
        return typeof x != "string" && (x = String(x)), x;
      }
      function u(x) {
        var I = {
          next: function() {
            var H = x.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function f(x) {
        this.map = {}, x instanceof f ? x.forEach(function(I, H) {
          this.append(H, I);
        }, this) : Array.isArray(x) ? x.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(I) {
          this.append(I, x[I]);
        }, this);
      }
      f.prototype.append = function(x, I) {
        x = a(x), I = c(I);
        var H = this.map[x];
        this.map[x] = H ? H + ", " + I : I;
      }, f.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, f.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, f.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, f.prototype.set = function(x, I) {
        this.map[a(x)] = c(I);
      }, f.prototype.forEach = function(x, I) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && x.call(I, this.map[H], H, this);
      }, f.prototype.keys = function() {
        var x = [];
        return this.forEach(function(I, H) {
          x.push(H);
        }), u(x);
      }, f.prototype.values = function() {
        var x = [];
        return this.forEach(function(I) {
          x.push(I);
        }), u(x);
      }, f.prototype.entries = function() {
        var x = [];
        return this.forEach(function(I, H) {
          x.push([H, I]);
        }), u(x);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function g(x) {
        return new Promise(function(I, H) {
          x.onload = function() {
            I(x.result);
          }, x.onerror = function() {
            H(x.error);
          };
        });
      }
      function h(x) {
        var I = new FileReader(), H = g(I);
        return I.readAsArrayBuffer(x), H;
      }
      function b(x) {
        var I = new FileReader(), H = g(I), k = /charset=([A-Za-z0-9_-]+)/.exec(x.type), G = k ? k[1] : "utf-8";
        return I.readAsText(x, G), H;
      }
      function y(x) {
        for (var I = new Uint8Array(x), H = new Array(I.length), k = 0; k < I.length; k++)
          H[k] = String.fromCharCode(I[k]);
        return H.join("");
      }
      function A(x) {
        if (x.slice)
          return x.slice(0);
        var I = new Uint8Array(x.byteLength);
        return I.set(new Uint8Array(x)), I.buffer;
      }
      function L() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && s(x) ? (this._bodyArrayBuffer = A(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = A(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var x = l(this);
            return x || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return b(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(y(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(m);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var C = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(x) {
        var I = x.toUpperCase();
        return C.indexOf(I) > -1 ? I : x;
      }
      function E(x, I) {
        if (!(this instanceof E))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var H = I.body;
        if (x instanceof E) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, I.headers || (this.headers = new f(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !H && x._bodyInit != null && (H = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new f(I.headers)), this.method = p(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var T = new AbortController();
            return T.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var k = /([?&])_=[^&]*/;
          if (k.test(this.url))
            this.url = this.url.replace(k, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var G = /\?/;
            this.url += (G.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      E.prototype.clone = function() {
        return new E(this, { body: this._bodyInit });
      };
      function m(x) {
        var I = new FormData();
        return x.trim().split("&").forEach(function(H) {
          if (H) {
            var k = H.split("="), G = k.shift().replace(/\+/g, " "), T = k.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(G), decodeURIComponent(T));
          }
        }), I;
      }
      function N(x) {
        var I = new f(), H = x.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(k) {
          return k.indexOf(`
`) === 0 ? k.substr(1, k.length) : k;
        }).forEach(function(k) {
          var G = k.split(":"), T = G.shift().trim();
          if (T) {
            var Ue = G.join(":").trim();
            try {
              I.append(T, Ue);
            } catch (Ke) {
              console.warn("Response " + Ke.message);
            }
          }
        }), I;
      }
      L.call(E.prototype);
      function D(x, I) {
        if (!(this instanceof D))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new f(I.headers), this.url = I.url || "", this._initBody(x);
      }
      L.call(D.prototype), D.prototype.clone = function() {
        return new D(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, D.error = function() {
        var x = new D(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var B = [301, 302, 303, 307, 308];
      D.redirect = function(x, I) {
        if (B.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new D(null, { status: I, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(I, H) {
          this.message = I, this.name = H;
          var k = Error(I);
          this.stack = k.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function U(x, I) {
        return new Promise(function(H, k) {
          var G = new E(x, I);
          if (G.signal && G.signal.aborted)
            return k(new e.DOMException("Aborted", "AbortError"));
          var T = new XMLHttpRequest();
          function Ue() {
            T.abort();
          }
          T.onload = function() {
            var S = {
              statusText: T.statusText,
              headers: N(T.getAllResponseHeaders() || "")
            };
            G.url.indexOf("file://") === 0 && (T.status < 200 || T.status > 599) ? S.status = 200 : S.status = T.status, S.url = "responseURL" in T ? T.responseURL : S.headers.get("X-Request-URL");
            var v = "response" in T ? T.response : T.responseText;
            setTimeout(function() {
              H(new D(v, S));
            }, 0);
          }, T.onerror = function() {
            setTimeout(function() {
              k(new TypeError("Network request failed"));
            }, 0);
          }, T.ontimeout = function() {
            setTimeout(function() {
              k(new TypeError("Network request timed out"));
            }, 0);
          }, T.onabort = function() {
            setTimeout(function() {
              k(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Ke(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (T.open(G.method, Ke(G.url), !0), G.credentials === "include" ? T.withCredentials = !0 : G.credentials === "omit" && (T.withCredentials = !1), "responseType" in T && (r.blob ? T.responseType = "blob" : r.arrayBuffer && (T.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof f || n.Headers && I.headers instanceof n.Headers)) {
            var gr = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(S) {
              gr.push(a(S)), T.setRequestHeader(S, c(I.headers[S]));
            }), G.headers.forEach(function(S, v) {
              gr.indexOf(v) === -1 && T.setRequestHeader(v, S);
            });
          } else
            G.headers.forEach(function(S, v) {
              T.setRequestHeader(v, S);
            });
          G.signal && (G.signal.addEventListener("abort", Ue), T.onreadystatechange = function() {
            T.readyState === 4 && G.signal.removeEventListener("abort", Ue);
          }), T.send(typeof G._bodyInit > "u" ? null : G._bodyInit);
        });
      }
      return U.polyfill = !0, n.fetch || (n.fetch = U, n.Headers = f, n.Request = E, n.Response = D), e.Headers = f, e.Request = E, e.Response = D, e.fetch = U, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : jt);
})();
const iw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ow(t, e) {
  const n = {};
  return Object.assign(n, iw, e), await fetch(t, n);
}
function aw(t) {
  let e = ow, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function cw(...t) {
  const { fetchLib: e, middlewares: n } = aw(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: e,
        ...o
      })) ?? o);
    let a = await e(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Dr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Dr || (Dr = {}));
var Qn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Qn || (Qn = {}));
var Ku;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ku || (Ku = {}));
const lw = "https://api.mainnet.hiro.so", uw = "https://api.testnet.hiro.so", fw = "http://localhost:3999", hw = ["mainnet", "testnet", "devnet", "mocknet"];
let Jn = class {
  constructor(e) {
    this.version = Qn.Mainnet, this.chainId = Dr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Qn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? cw();
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
};
Jn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new La();
    case "testnet":
      return new Ca();
    case "devnet":
      return new dw();
    case "mocknet":
      return new td();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${hw.join(", ")}`);
  }
};
Jn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Jn.fromName(t);
let La = class extends Jn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qn.Mainnet, this.chainId = Dr.Mainnet;
  }
}, Ca = class extends Jn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qn.Testnet, this.chainId = Dr.Testnet;
  }
}, td = class extends Jn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? fw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qn.Testnet, this.chainId = Dr.Testnet;
  }
};
const dw = td;
var tr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(tr || (tr = {}));
var Oi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Oi || (Oi = {}));
tr.Mainnet;
var er;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(er || (er = {}));
var nr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(nr || (nr = {}));
er.Mainnet;
const gw = {
  chainId: tr.Mainnet,
  transactionVersion: er.Mainnet,
  peerNetworkId: Oi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: nr.MainnetSingleSig,
    multiSig: nr.MainnetMultiSig
  },
  client: { baseUrl: g0 }
}, Ba = {
  chainId: tr.Testnet,
  transactionVersion: er.Testnet,
  peerNetworkId: Oi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: nr.TestnetSingleSig,
    multiSig: nr.TestnetMultiSig
  },
  client: { baseUrl: p0 }
}, Ii = {
  ...Ba,
  addressVersion: { ...Ba.addressVersion },
  magicBytes: "id",
  client: { baseUrl: b0 }
}, pw = {
  ...Ii,
  addressVersion: { ...Ii.addressVersion },
  client: { ...Ii.client }
};
function bw(t) {
  switch (t) {
    case "mainnet":
      return gw;
    case "testnet":
      return Ba;
    case "devnet":
      return Ii;
    case "mocknet":
      return pw;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function yw(t) {
  return typeof t == "string" ? bw(t) : t;
}
function xw(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Wu = /* @__PURE__ */ new Map();
function ed(t, e) {
  const n = Wu.get(t);
  if (n !== void 0)
    return n(e);
  const r = xw(t);
  return Wu.set(t, r), ed(t, e);
}
let ht = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? rt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return u2(this.readBytes(4), 0);
  }
  readUInt8() {
    return c2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return o2(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = z(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = z(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(e) {
    this.consumed = e;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(e, n) {
    const r = this.readUInt8();
    if (ed(e, r))
      return r;
    throw n(r);
  }
};
const ww = 128, Sw = 128, nd = 16, Vn = 32, Ha = 80, po = 65, mw = 32, Aw = 64, Fi = 34, Ew = 1 + 16 * 1024 * 1024, Iw = 165, $w = 16, vw = 16, Lw = 20, Cw = vw + 2 + Lw, Bw = Cw + 4, Hw = Ew + (Iw + $w * Bw);
var it;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var _a;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(_a || (_a = {}));
var Xt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Xt || (Xt = {}));
const Jo = ["onChainOnly", "offChainOnly", "any"];
Jo[0] + "", Xt.OnChainOnly, Jo[1] + "", Xt.OffChainOnly, Jo[2] + "", Xt.Any, Xt.OnChainOnly + "", Xt.OnChainOnly, Xt.OffChainOnly + "", Xt.OffChainOnly, Xt.Any + "", Xt.Any;
var ji;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ji || (ji = {}));
var gt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(gt || (gt = {}));
var St;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(St || (St = {}));
var ct;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ct || (ct = {}));
var xt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xt || (xt = {}));
var ds;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ds || (ds = {}));
var Ma;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ma || (Ma = {}));
var Ua;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ua || (Ua = {}));
var Ft;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ft || (Ft = {}));
var qu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qu || (qu = {}));
var Na;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Na || (Na = {}));
var le;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(le || (le = {}));
var Yu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Yu || (Yu = {}));
let bo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ar = class extends bo {
  constructor(e) {
    super(e);
  }
}, Dt = class extends bo {
  constructor(e) {
    super(e);
  }
}, zi = class extends bo {
  constructor(e) {
    super(e);
  }
}, Fn = class extends bo {
  constructor(e) {
    super(e);
  }
};
function Ta(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function _w(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function rd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Mw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ta(t.outputLen), Ta(t.blockLen);
}
function Uw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Nw(t, e) {
  rd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const jn = {
  number: Ta,
  bool: _w,
  bytes: rd,
  hash: Mw,
  exists: Uw,
  output: Nw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ta = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ye = (t, e) => t << 32 - e | t >>> e, Tw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Tw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Pw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Dc(t) {
  if (typeof t == "string" && (t = Pw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let sd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fr(t) {
  const e = (r) => t().update(Dc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let id = class extends sd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, jn.hash(e);
    const r = Dc(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return jn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    jn.exists(this), jn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const od = (t, e, n) => new id(t, e).update(n).digest();
od.create = (t, e) => new id(t, e);
function Dw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let kc = class extends sd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ta(this.buffer);
  }
  update(e) {
    jn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Dc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ta(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    jn.exists(this), jn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Dw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ta(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const kw = (t, e, n) => t & e ^ ~t & n, Ow = (t, e, n) => t & e ^ t & n ^ e & n, Fw = new Uint32Array([
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
]), on = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), an = new Uint32Array(64);
let ad = class extends kc {
  constructor() {
    super(64, 32, 8, !1), this.A = on[0] | 0, this.B = on[1] | 0, this.C = on[2] | 0, this.D = on[3] | 0, this.E = on[4] | 0, this.F = on[5] | 0, this.G = on[6] | 0, this.H = on[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      an[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = an[l - 15], h = an[l - 2], b = ye(g, 7) ^ ye(g, 18) ^ g >>> 3, y = ye(h, 17) ^ ye(h, 19) ^ h >>> 10;
      an[l] = y + an[l - 7] + b + an[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = ye(a, 6) ^ ye(a, 11) ^ ye(a, 25), h = f + g + kw(a, c, u) + Fw[l] + an[l] | 0, y = (ye(r, 2) ^ ye(r, 13) ^ ye(r, 22)) + Ow(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    an.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, jw = class extends ad {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Oc = fr(() => new ad());
fr(() => new jw());
const zw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cd = Uint8Array.from({ length: 16 }, (t, e) => e), Rw = cd.map((t) => (9 * t + 5) % 16);
let Fc = [cd], jc = [Rw];
for (let t = 0; t < 4; t++)
  for (let e of [Fc, jc])
    e.push(e[t].map((n) => zw[n]));
const ld = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Vw = Fc.map((t, e) => t.map((n) => ld[e][n])), Gw = jc.map((t, e) => t.map((n) => ld[e][n])), Kw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ww = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ai = (t, e) => t << e | t >>> 32 - e;
function Xu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ci = new Uint32Array(16);
let qw = class extends kc {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ci[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = Kw[h], A = Ww[h], L = Fc[h], C = jc[h], p = Vw[h], E = Gw[h];
      for (let m = 0; m < 16; m++) {
        const N = ai(r + Xu(h, i, a, u) + ci[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = ai(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = ai(s + Xu(b, o, c, f) + ci[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = ai(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ci.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Yw = fr(() => new qw()), li = BigInt(2 ** 32 - 1), Pa = BigInt(32);
function ud(t, e = !1) {
  return e ? { h: Number(t & li), l: Number(t >> Pa & li) } : { h: Number(t >> Pa & li) | 0, l: Number(t & li) | 0 };
}
function Xw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ud(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Zw = (t, e) => BigInt(t >>> 0) << Pa | BigInt(e >>> 0), Qw = (t, e, n) => t >>> n, Jw = (t, e, n) => t << 32 - n | e >>> n, tS = (t, e, n) => t >>> n | e << 32 - n, eS = (t, e, n) => t << 32 - n | e >>> n, nS = (t, e, n) => t << 64 - n | e >>> n - 32, rS = (t, e, n) => t >>> n - 32 | e << 64 - n, sS = (t, e) => e, iS = (t, e) => t, oS = (t, e, n) => t << n | e >>> 32 - n, aS = (t, e, n) => e << n | t >>> 32 - n, cS = (t, e, n) => e << n - 32 | t >>> 64 - n, lS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function uS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const fS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), hS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, dS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), gS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, pS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), bS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: ud,
  split: Xw,
  toBig: Zw,
  shrSH: Qw,
  shrSL: Jw,
  rotrSH: tS,
  rotrSL: eS,
  rotrBH: nS,
  rotrBL: rS,
  rotr32H: sS,
  rotr32L: iS,
  rotlSH: oS,
  rotlSL: aS,
  rotlBH: cS,
  rotlBL: lS,
  add: uS,
  add3L: fS,
  add3H: hS,
  add4L: dS,
  add4H: gS,
  add5H: bS,
  add5L: pS
}, [yS, xS] = Y.split([
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
].map((t) => BigInt(t))), cn = new Uint32Array(80), ln = new Uint32Array(80);
let yo = class extends kc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: b, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      cn[p] = e.getUint32(n), ln[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = cn[p - 15] | 0, m = ln[p - 15] | 0, N = Y.rotrSH(E, m, 1) ^ Y.rotrSH(E, m, 8) ^ Y.shrSH(E, m, 7), D = Y.rotrSL(E, m, 1) ^ Y.rotrSL(E, m, 8) ^ Y.shrSL(E, m, 7), B = cn[p - 2] | 0, U = ln[p - 2] | 0, x = Y.rotrSH(B, U, 19) ^ Y.rotrBH(B, U, 61) ^ Y.shrSH(B, U, 6), I = Y.rotrSL(B, U, 19) ^ Y.rotrBL(B, U, 61) ^ Y.shrSL(B, U, 6), H = Y.add4L(D, I, ln[p - 7], ln[p - 16]), k = Y.add4H(H, N, x, cn[p - 7], cn[p - 16]);
      cn[p] = k | 0, ln[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = Y.rotrSH(l, g, 14) ^ Y.rotrSH(l, g, 18) ^ Y.rotrBH(l, g, 41), m = Y.rotrSL(l, g, 14) ^ Y.rotrSL(l, g, 18) ^ Y.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = Y.add5L(C, m, D, xS[p], ln[p]), U = Y.add5H(B, L, E, N, yS[p], cn[p]), x = B | 0, I = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), H = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Y.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Y.add3L(x, H, G);
      r = Y.add3H(T, U, I, k), s = T | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Y.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Y.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Y.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = Y.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    cn.fill(0), ln.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wS = class extends yo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, SS = class extends yo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mS = class extends yo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
fr(() => new yo());
fr(() => new wS());
const AS = fr(() => new SS());
fr(() => new mS());
var et;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(et || (et = {}));
var Lt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Lt || (Lt = {}));
function zc(t) {
  return Lt[t];
}
const ES = () => ({ type: et.BoolTrue }), IS = () => ({ type: et.BoolFalse }), $S = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: et.Buffer, value: z(t) };
}, Zu = BigInt("0xffffffffffffffffffffffffffffffff"), vS = BigInt(0), Qu = BigInt("0x7fffffffffffffffffffffffffffffff"), Ju = BigInt("-170141183460469231731687303715884105728"), LS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ba(rt(t))), qt(t, Uint8Array) && (t = ba(t));
  const e = Nt(t);
  if (e > Qu)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Qu}`);
  if (e < Ju)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ju}`);
  return { type: et.Int, value: e };
}, CS = (t) => {
  const e = Nt(t);
  if (e < vS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Zu)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Zu}`);
  return { type: et.UInt, value: e };
};
function BS(t) {
  return { type: et.List, value: t };
}
function fd() {
  return { type: et.OptionalNone };
}
function hd(t) {
  return { type: et.OptionalSome, value: t };
}
var M;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(M || (M = {}));
function HS() {
  return {
    type: M.Address,
    version: nr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function tf(t) {
  if (t && md(t, Fi))
    throw new Error(`Memo exceeds maximum length of ${Fi} bytes`);
  return { type: M.MemoString, content: t };
}
function Rc(t, e) {
  return {
    type: M.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Da(t) {
  if (rt(t).byteLength != po)
    throw Error("Invalid signature");
  return {
    type: M.MessageSignature,
    data: t
  };
}
function _S(t, e, n) {
  return typeof t == "string" && (t = WS(t)), typeof n == "string" && (n = tf(n)), {
    type: M.Payload,
    payloadType: it.TokenTransfer,
    recipient: t,
    amount: Nt(e),
    memo: n ?? tf("")
  };
}
function MS(t, e, n, r) {
  return typeof e == "string" && (e = de(e)), typeof n == "string" && (n = de(n)), {
    type: M.Payload,
    payloadType: it.ContractCall,
    contractAddress: typeof t == "string" ? Mn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function US(t) {
  return de(t, 4, 1e5);
}
function ef(t, e, n) {
  return typeof t == "string" && (t = de(t)), typeof e == "string" && (e = US(e)), typeof n == "number" ? {
    type: M.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: M.Payload,
    payloadType: it.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function NS() {
  return { type: M.Payload, payloadType: it.PoisonMicroblock };
}
function nf(t, e) {
  if (t.byteLength != Vn)
    throw Error(`Coinbase buffer size must be ${Vn} bytes`);
  return e != null ? {
    type: M.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: M.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: t
  };
}
function TS(t, e, n) {
  if (t.byteLength != Vn)
    throw Error(`Coinbase buffer size must be ${Vn} bytes`);
  if (n.byteLength != Ha)
    throw Error(`VRF proof buffer size must be ${Ha} bytes`);
  return {
    type: M.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === et.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function PS(t, e, n, r, s, i, o) {
  return {
    type: M.Payload,
    payloadType: it.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function de(t, e, n) {
  const r = e || 1, s = n || ww;
  if (md(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: M.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function DS(t, e, n) {
  return {
    type: M.Asset,
    address: Mn(t),
    contractName: de(e),
    assetName: de(n)
  };
}
function Mn(t) {
  const e = Xr.c32addressDecode(t);
  return {
    type: M.Address,
    version: e[0],
    hash160: e[1]
  };
}
function kS(t, e) {
  const n = Mn(t), r = de(e);
  return {
    type: M.Principal,
    prefix: Ft.Contract,
    address: n,
    contractName: r
  };
}
function OS(t) {
  const e = Mn(t);
  return {
    type: M.Principal,
    prefix: Ft.Standard,
    address: e
  };
}
function Er(t, e) {
  return {
    pubKeyEncoding: t,
    type: M.TransactionAuthField,
    contents: e
  };
}
function Pe(t) {
  switch (t.type) {
    case M.Address:
      return Us(t);
    case M.Principal:
      return dd(t);
    case M.LengthPrefixedString:
      return Or(t);
    case M.MemoString:
      return jS(t);
    case M.Asset:
      return pd(t);
    case M.PostCondition:
      return yd(t);
    case M.PublicKey:
      return Fa(t);
    case M.LengthPrefixedList:
      return Vc(t);
    case M.Payload:
      return xd(t);
    case M.TransactionAuthField:
      return KS(t);
    case M.MessageSignature:
      return Gc(t);
  }
}
function Us(t) {
  const e = [];
  return e.push(rt(Cs(t.version, 1))), e.push(rt(t.hash160)), It(e);
}
function kr(t) {
  const e = qt(t, ht) ? t : new ht(t), n = eo(z(e.readBytes(1))), r = z(e.readBytes(20));
  return { type: M.Address, version: n, hash160: r };
}
function dd(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ft.Standard || t.prefix === Ft.Contract) && e.push(Us(t.address)), t.prefix === Ft.Contract && e.push(Or(t.contractName)), It(e);
}
function FS(t) {
  const e = qt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(Ft, (i) => {
    throw new Dt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ft.Origin)
    return { type: M.Principal, prefix: n };
  const r = kr(e);
  if (n === Ft.Standard)
    return { type: M.Principal, prefix: n, address: r };
  const s = ie(e);
  return {
    type: M.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Or(t) {
  const e = [], n = cr(t.content), r = n.byteLength;
  return e.push(rt(Cs(r, t.lengthPrefixBytes))), e.push(n), It(e);
}
function ie(t, e, n) {
  e = e || 1;
  const r = qt(t, ht) ? t : new ht(t), s = eo(z(r.readBytes(e))), i = Bs(r.readBytes(s));
  return de(i, e, n ?? 128);
}
function jS(t) {
  const e = [], n = cr(t.content), r = bm(z(n), Fi * 2);
  return e.push(rt(r)), It(e);
}
function gd(t) {
  const e = qt(t, ht) ? t : new ht(t);
  let n = Bs(e.readBytes(Fi));
  return n = n.replace(/\u0000*$/, ""), { type: M.MemoString, content: n };
}
function pd(t) {
  const e = [];
  return e.push(Us(t.address)), e.push(Or(t.contractName)), e.push(Or(t.assetName)), It(e);
}
function ka(t) {
  const e = qt(t, ht) ? t : new ht(t);
  return {
    type: M.Asset,
    address: kr(e),
    contractName: ie(e),
    assetName: ie(e)
  };
}
function Vc(t) {
  const e = t.values, n = [];
  n.push(rt(Cs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Pe(r));
  return It(n);
}
function bd(t, e, n) {
  const r = qt(t, ht) ? t : new ht(t), s = eo(z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case M.Address:
        i.push(kr(r));
        break;
      case M.LengthPrefixedString:
        i.push(ie(r));
        break;
      case M.MemoString:
        i.push(gd(r));
        break;
      case M.Asset:
        i.push(ka(r));
        break;
      case M.PostCondition:
        i.push(RS(r));
        break;
      case M.PublicKey:
        i.push(ja(r));
        break;
      case M.TransactionAuthField:
        i.push(GS(r));
        break;
    }
  return Rc(i, n);
}
function zS(t) {
  return z(yd(t));
}
function yd(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(dd(t.principal)), (t.conditionType === gt.Fungible || t.conditionType === gt.NonFungible) && e.push(pd(t.asset)), t.conditionType === gt.NonFungible && e.push(Ie(t.assetName)), e.push(t.conditionCode), t.conditionType === gt.STX || t.conditionType === gt.Fungible || t.conditionType === gt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ar("The post-condition amount may not be larger than 8 bytes");
    e.push(Cn(t.amount, 8));
  }
  return It(e);
}
function RS(t) {
  const e = qt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(gt, (a) => {
    throw new Dt(`Could not read ${a} as PostConditionType`);
  }), r = FS(e);
  let s, i, o;
  switch (n) {
    case gt.STX:
      return s = e.readUInt8Enum(ds, (c) => {
        throw new Dt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: M.PostCondition,
        conditionType: gt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case gt.Fungible:
      return i = ka(e), s = e.readUInt8Enum(ds, (c) => {
        throw new Dt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: M.PostCondition,
        conditionType: gt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case gt.NonFungible:
      i = ka(e);
      const a = me(e);
      return s = e.readUInt8Enum(Ma, (c) => {
        throw new Dt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: M.PostCondition,
        conditionType: gt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case gt.Staking:
      return s = e.readUInt8Enum(ds, (c) => {
        throw new Dt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: M.PostCondition,
        conditionType: gt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case gt.PoX: {
      const c = e.readUInt8Enum(Ua, (u) => {
        throw new Dt(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: M.PostCondition,
        conditionType: gt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function xd(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case it.TokenTransfer:
      e.push(Ie(t.recipient)), e.push(Cn(t.amount, 8)), e.push(Pe(t.memo));
      break;
    case it.ContractCall:
      e.push(Pe(t.contractAddress)), e.push(Pe(t.contractName)), e.push(Pe(t.functionName));
      const n = new Uint8Array(4);
      Wn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ie(r));
      });
      break;
    case it.SmartContract:
      e.push(Pe(t.contractName)), e.push(Pe(t.codeBody));
      break;
    case it.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Pe(t.contractName)), e.push(Pe(t.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ie(t.recipient));
      break;
    case it.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ie(t.recipient ? hd(t.recipient) : fd())), e.push(t.vrfProof);
      break;
    case it.TenureChange:
      e.push(rt(t.tenureHash)), e.push(rt(t.previousTenureHash)), e.push(rt(t.burnViewHash)), e.push(rt(t.previousTenureEnd)), e.push(Wn(new Uint8Array(4), t.previousTenureBlocks)), e.push(l2(new Uint8Array(1), t.cause)), e.push(rt(t.publicKeyHash));
      break;
  }
  return It(e);
}
function VS(t) {
  const e = qt(t, ht) ? t : new ht(t);
  switch (e.readUInt8Enum(it, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case it.TokenTransfer:
      const r = me(e), s = Nt(e.readBytes(8)), i = gd(e);
      return _S(r, s, i);
    case it.ContractCall:
      const o = kr(e), a = ie(e), c = ie(e), u = [], f = e.readUInt32BE();
      for (let E = 0; E < f; E++) {
        const m = me(e);
        u.push(m);
      }
      return MS(o, a, c, u);
    case it.SmartContract:
      const l = ie(e), g = ie(e, 4, 1e5);
      return ef(l, g);
    case it.VersionedSmartContract: {
      const E = e.readUInt8Enum(_a, (D) => {
        throw new Error(`Cannot recognize ClarityVersion: ${D}`);
      }), m = ie(e), N = ie(e, 4, Hw);
      return ef(m, N, E);
    }
    case it.PoisonMicroblock:
      return NS();
    case it.Coinbase: {
      const E = e.readBytes(Vn);
      return nf(E);
    }
    case it.CoinbaseToAltRecipient: {
      const E = e.readBytes(Vn), m = me(e);
      return nf(E, m);
    }
    case it.NakamotoCoinbase: {
      const E = e.readBytes(Vn), m = me(e), N = e.readBytes(Ha);
      return TS(E, m, N);
    }
    case it.TenureChange:
      const h = z(e.readBytes(20)), b = z(e.readBytes(20)), y = z(e.readBytes(20)), A = z(e.readBytes(32)), L = e.readUInt32BE(), C = e.readUInt8Enum(Na, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), p = z(e.readBytes(20));
      return PS(h, b, y, A, L, C, p);
  }
}
function Oa(t) {
  const e = qt(t, ht) ? t : new ht(t);
  return Da(z(e.readBytes(po)));
}
function GS(t) {
  const e = qt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(le, (r) => {
    throw new Dt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case le.PublicKeyCompressed:
      return Er(xt.Compressed, ja(e));
    case le.PublicKeyUncompressed:
      return Er(xt.Uncompressed, Zr(Lm(ja(e).data)));
    case le.SignatureCompressed:
      return Er(xt.Compressed, Oa(e));
    case le.SignatureUncompressed:
      return Er(xt.Uncompressed, Oa(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Gc(t) {
  return rt(t.data);
}
function KS(t) {
  const e = [];
  switch (t.contents.type) {
    case M.PublicKey:
      e.push(t.pubKeyEncoding === xt.Compressed ? le.PublicKeyCompressed : le.PublicKeyUncompressed), e.push(rt(vm(t.contents.data)));
      break;
    case M.MessageSignature:
      e.push(t.pubKeyEncoding === xt.Compressed ? le.SignatureCompressed : le.SignatureUncompressed), e.push(Gc(t.contents));
      break;
  }
  return It(e);
}
function Fa(t) {
  return t.data.slice();
}
function ja(t) {
  const e = qt(t, ht) ? t : new ht(t), n = e.readUInt8(), r = n === 4 ? Aw : mw;
  return Zr(It([n, e.readBytes(r)]));
}
function Kc(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ct.P2PKH || e === ct.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ct.P2WPKH || e === ct.P2WSH || e === ct.P2WSHNonSequential) && !r.map((s) => s.data).every(Qr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ct.P2PKH:
      return ui(t, ym(r[0].data));
    case ct.P2WPKH:
      return ui(t, xm(r[0].data));
    case ct.P2SH:
    case ct.P2SHNonSequential:
      return ui(t, wm(n, r.map(Fa)));
    case ct.P2WSH:
    case ct.P2WSHNonSequential:
      return ui(t, Sm(n, r.map(Fa)));
  }
}
function ui(t, e) {
  return { type: M.Address, version: t, hash160: e };
}
function Wc(t) {
  return Xr.c32address(t.version, t.hash160);
}
function rf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return DS(e, n, r);
}
function as(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return kS(e, n);
  } else
    return OS(t);
}
function WS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return XS(e, n);
  } else
    return qS(t);
}
function qS(t) {
  const e = Mn(t);
  return { type: et.PrincipalStandard, value: Wc(e) };
}
function YS(t) {
  return { type: et.PrincipalStandard, value: Wc(t) };
}
function XS(t, e) {
  const n = Mn(t), r = de(e);
  return wd(n, r);
}
function wd(t, e) {
  if (cr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: et.PrincipalContract,
    value: `${Wc(t)}.${e.content}`
  };
}
function ZS(t) {
  return { type: et.ResponseErr, value: t };
}
function QS(t) {
  return { type: et.ResponseOk, value: t };
}
const JS = (t) => ({ type: et.StringASCII, value: t }), tm = (t) => ({ type: et.StringUTF8, value: t });
function em(t) {
  for (const e in t)
    if (!mm(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: et.Tuple, value: t };
}
function me(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ht(rt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ht(t) : e = t;
  switch (e.readUInt8Enum(Lt, (r) => {
    throw new Dt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Lt.int:
      return LS(ba(e.readBytes(16)));
    case Lt.uint:
      return CS(e.readBytes(16));
    case Lt.buffer:
      const r = e.readUInt32BE();
      return $S(e.readBytes(r));
    case Lt.true:
      return ES();
    case Lt.false:
      return IS();
    case Lt.address:
      const s = kr(e);
      return YS(s);
    case Lt.contract:
      const i = kr(e), o = ie(e);
      return wd(i, o);
    case Lt.ok:
      return QS(me(e));
    case Lt.err:
      return ZS(me(e));
    case Lt.none:
      return fd();
    case Lt.some:
      return hd(me(e));
    case Lt.list:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(me(e));
      return BS(c);
    case Lt.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = ie(e).content;
        if (A === void 0)
          throw new Dt('"content" is undefined');
        f[A] = me(e);
      }
      return em(f);
    case Lt.ascii:
      const l = e.readUInt32BE(), g = e2(e.readBytes(l));
      return JS(g);
    case Lt.utf8:
      const h = e.readUInt32BE(), b = Bs(e.readBytes(h));
      return tm(b);
    default:
      throw new Dt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function He(t, e) {
  return It([zc(t), e]);
}
function nm(t) {
  return new Uint8Array([zc(t.type)]);
}
function rm(t) {
  return t.type === et.OptionalNone ? new Uint8Array([zc(t.type)]) : He(t.type, Ie(t.value));
}
function sm(t) {
  const e = new Uint8Array(4);
  return Wn(e, Math.ceil(t.value.length / 2), 0), He(t.type, Le(e, rt(t.value)));
}
function im(t) {
  const e = xc(X1(BigInt(t.value), BigInt(Sw)), nd);
  return He(t.type, e);
}
function om(t) {
  const e = xc(BigInt(t.value), nd);
  return He(t.type, e);
}
function am(t) {
  return He(t.type, Us(Mn(t.value)));
}
function cm(t) {
  const [e, n] = Am(t.value);
  return He(t.type, Le(Us(Mn(e)), Or(de(n))));
}
function lm(t) {
  return He(t.type, Ie(t.value));
}
function um(t) {
  const e = [], n = new Uint8Array(4);
  Wn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ie(r);
    e.push(s);
  }
  return He(t.type, It(e));
}
function fm(t) {
  const e = [], n = new Uint8Array(4);
  Wn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = de(s);
    e.push(Or(i));
    const o = Ie(t.value[s]);
    e.push(o);
  }
  return He(t.type, It(e));
}
function Sd(t, e) {
  const n = [], r = e == "ascii" ? t2(t.value) : cr(t.value), s = new Uint8Array(4);
  return Wn(s, r.length, 0), n.push(s), n.push(r), He(t.type, It(n));
}
function hm(t) {
  return Sd(t, "ascii");
}
function dm(t) {
  return Sd(t, "utf8");
}
function gm(t) {
  return z(Ie(t));
}
function Ie(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return nm(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return rm(t);
    case et.Buffer:
      return sm(t);
    case et.UInt:
      return om(t);
    case et.Int:
      return im(t);
    case et.PrincipalStandard:
      return am(t);
    case et.PrincipalContract:
      return cm(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return lm(t);
    case et.List:
      return um(t);
    case et.Tuple:
      return fm(t);
    case et.StringASCII:
      return hm(t);
    case et.StringUTF8:
      return dm(t);
    default:
      throw new Ar("Unable to serialize. Invalid Clarity Value.");
  }
}
const pm = (t) => t.length % 2 ? `0${t}` : t, bm = (t, e) => t.padEnd(e, "0"), md = (t, e) => t ? cr(t).length > e : !1;
function za(t) {
  return Zh(t);
}
const xs = (t) => Yw(Oc(t)), qc = (t) => z(AS(t)), ym = (t) => z(xs(t)), xm = (t) => {
  const e = xs(t), n = Le(new Uint8Array([0]), new Uint8Array([e.length]), e), r = xs(n);
  return z(r);
}, wm = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = It(n), s = xs(r);
  return z(s);
}, Sm = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = It(n), s = Oc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = It(i), a = xs(o);
  return z(a);
};
function mm(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Am(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
At.hmacSha256Sync = (t, ...e) => {
  const n = od.create(Oc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Zr(t) {
  return t = typeof t == "string" ? rt(t) : t, {
    type: M.PublicKey,
    data: t
  };
}
function Em(t, e, n = xt.Compressed) {
  const r = i2(e), s = new ee(iu(r.r), iu(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === xt.Compressed;
  return i.toHex(o);
}
function Im(t) {
  return typeof t == "string" ? t : z(t);
}
const Yc = Im;
function Ad(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === s2;
}
function Qr(t) {
  return !Yc(t).startsWith("04");
}
function $m(t) {
  t = wc(t);
  const e = Ad(t);
  return z(Hs(t.slice(0, 32), e));
}
function vm(t) {
  return J.fromHex(Yc(t)).toHex(!0);
}
function Lm(t) {
  return J.fromHex(Yc(t)).toHex(!1);
}
function Cm(t, e) {
  t = wc(t);
  const [n, r] = so(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Cs(r, 1) + ee.fromHex(n).toCompactHex();
}
function Xc() {
  return {
    type: M.MessageSignature,
    data: z(new Uint8Array(po))
  };
}
function Ed(t, e, n, r) {
  const s = Kc(0, t, 1, [Zr(e)]).hash160, i = Qr(e) ? xt.Compressed : xt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Nt(n),
    fee: Nt(r),
    keyEncoding: i,
    signature: Xc()
  };
}
function ws(t) {
  return "signature" in t;
}
function sf(t) {
  return t === ct.P2SH || t === ct.P2WSH;
}
function Bm(t) {
  return t === ct.P2SHNonSequential || t === ct.P2WSHNonSequential;
}
function of(t) {
  const e = za(t);
  return e.nonce = 0, e.fee = 0, ws(e) ? e.signature = Xc() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Hm(t) {
  const e = [
    t.hashMode,
    rt(t.signer),
    Cn(t.nonce, 8),
    Cn(t.fee, 8),
    t.keyEncoding,
    Gc(t.signature)
  ];
  return It(e);
}
function _m(t) {
  const e = [
    t.hashMode,
    rt(t.signer),
    Cn(t.nonce, 8),
    Cn(t.fee, 8)
  ], n = Rc(t.fields);
  e.push(Vc(n));
  const r = new Uint8Array(2);
  return a2(r, t.signaturesRequired, 0), e.push(r), It(e);
}
function Mm(t, e) {
  const n = z(e.readBytes(20)), r = BigInt(`0x${z(e.readBytes(8))}`), s = BigInt(`0x${z(e.readBytes(8))}`), i = e.readUInt8Enum(xt, (a) => {
    throw new Dt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ct.P2WPKH && i != xt.Compressed)
    throw new Dt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Oa(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function Um(t, e) {
  const n = z(e.readBytes(20)), r = BigInt("0x" + z(e.readBytes(8))), s = BigInt("0x" + z(e.readBytes(8))), i = bd(e, M.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case M.PublicKey:
        Qr(u.contents.data) || (o = !0);
        break;
      case M.MessageSignature:
        if (u.pubKeyEncoding === xt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Fn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ct.P2WSH || t === ct.P2WSHNonSequential))
    throw new Fn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ea(t) {
  return ws(t) ? Hm(t) : _m(t);
}
function na(t) {
  const e = t.readUInt8Enum(ct, (n) => {
    throw new Dt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ct.P2PKH || e === ct.P2WPKH ? Mm(e, t) : Um(e, t);
}
function Id(t, e, n, r) {
  const i = t + z(new Uint8Array([e])) + z(Cn(n, 8)) + z(Cn(r, 8));
  if (rt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qc(rt(i));
}
function $d(t, e, n) {
  const r = 33 + po, s = Qr(e.data) ? xt.Compressed : xt.Uncompressed, i = t + pm(s.toString(16)) + n, o = rt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return qc(o);
}
function Nm(t, e, n, r, s) {
  const i = Id(t, e, n, r), o = Cm(s, i), a = Zr($m(s)), c = $d(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function vd(t, e, n, r, s, i) {
  const o = Id(t, e, n, r), a = Zr(Em(o, i, s)), c = $d(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Tm() {
  const t = Ed(ct.P2PKH, "", 0, 0);
  return t.signer = HS().hash160, t.keyEncoding = xt.Compressed, t.signature = Xc(), t;
}
function af(t, e, n) {
  return ws(t) ? Pm(t, e, n) : Dm(t, e, n);
}
function Pm(t, e, n) {
  const { pubKey: r, nextSigHash: s } = vd(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Kc(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Fn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Dm(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case M.PublicKey:
        Qr(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case M.MessageSignature:
        c.pubKeyEncoding === xt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = vd(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (sf(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Fn("Too many signatures");
        break;
    }
  if (sf(t.hashMode) && o !== t.signaturesRequired || Bm(t.hashMode) && o < t.signaturesRequired)
    throw new Fn("Incorrect number of signatures");
  if (i && (t.hashMode === ct.P2WSH || t.hashMode === ct.P2WSHNonSequential))
    throw new Fn("Uncompressed keys are not allowed in this hash mode");
  const a = Kc(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Fn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Ld(t) {
  return {
    authType: St.Standard,
    spendingCondition: t
  };
}
function Cd(t, e) {
  return {
    authType: St.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ed(ct.P2PKH, "0".repeat(66), 0, 0)
  };
}
function cf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case St.Standard:
        return Ld(of(t.spendingCondition));
      case St.Sponsored:
        return Cd(of(t.spendingCondition), Tm());
      default:
        throw new zi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function km(t, e) {
  switch (t.authType) {
    case St.Standard:
      return af(t.spendingCondition, e, St.Standard);
    case St.Sponsored:
      return af(t.spendingCondition, e, St.Standard);
    default:
      throw new zi("Invalid origin auth type");
  }
}
function Om(t, e) {
  switch (t.authType) {
    case St.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Nt(e)
      };
      return { ...t, spendingCondition: n };
    case St.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Nt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Fm(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Nt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function jm(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Nt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function zm(t, e) {
  const n = {
    ...e,
    nonce: Nt(e.nonce),
    fee: Nt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Rm(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case St.Standard:
      e.push(ea(t.spendingCondition));
      break;
    case St.Sponsored:
      e.push(ea(t.spendingCondition)), e.push(ea(t.sponsorSpendingCondition));
      break;
  }
  return It(e);
}
function Vm(t) {
  const e = t.readUInt8Enum(St, (r) => {
    throw new Dt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case St.Standard:
      return n = na(t), Ld(n);
    case St.Sponsored:
      n = na(t);
      const r = na(t);
      return Cd(n, r);
  }
}
class Gm {
  constructor({ auth: e, payload: n, postConditions: r = Rc([]), postConditionMode: s = ji.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = yw(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Nt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Xt.Any;
  }
  signBegin() {
    const e = za(this);
    return e.auth = cf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = za(this);
    return e.auth = cf(e.auth), e.txid();
  }
  verifyOrigin() {
    return km(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, St.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === St.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, St.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Zr(e), r = this.auth.spendingCondition;
    if (r && !ws(r)) {
      const s = Qr(n.data);
      r.fields.push(Er(s ? xt.Compressed : xt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = Nm(n, r, e.fee, e.nonce, s);
    if (ws(e))
      e.signature = Da(i);
    else {
      const a = Ad(s);
      e.fields.push(Er(a ? xt.Compressed : xt.Uncompressed, Da(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return qc(e);
  }
  setSponsor(e) {
    if (this.auth.authType != St.Sponsored)
      throw new zi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = zm(this.auth, e);
  }
  setFee(e) {
    this.auth = Om(this.auth, e);
  }
  setNonce(e) {
    this.auth = Fm(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != St.Sponsored)
      throw new zi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jm(this.auth, e);
  }
  serialize() {
    return z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ar('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ar('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ar('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ar('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Wn(n, this.chainId, 0), e.push(n), e.push(Rm(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Vc(this.postConditions)), e.push(xd(this.payload)), It(e);
  }
}
function Km(t) {
  const e = qt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(er, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Vm(e), i = e.readUInt8Enum(Xt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(ji, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = bd(e, M.PostCondition), c = VS(e), u = new Gm({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const lf = BigInt("18446744073709551615");
function ra(t) {
  const e = Nt(t);
  if (e < 0n || e > lf)
    throw new RangeError(`Post-condition amount must be between 0 and ${lf} (u64 max), received: ${e}`);
  return e;
}
var Ra;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Ra || (Ra = {}));
var Va;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Va || (Va = {}));
function Wm(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.STX,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ft.Origin } : as(t.address),
        conditionCode: fi(t.condition),
        amount: ra(t.amount)
      };
    case "ft-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.Fungible,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ft.Origin } : as(t.address),
        conditionCode: fi(t.condition),
        amount: ra(t.amount),
        asset: rf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.NonFungible,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ft.Origin } : as(t.address),
        conditionCode: fi(t.condition),
        asset: rf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.Staking,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ft.Origin } : as(t.address),
        conditionCode: fi(t.condition),
        amount: ra(t.amount)
      };
    case "pox-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.PoX,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ft.Origin } : as(t.address),
        conditionCode: qm(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function fi(t) {
  return Ra[t];
}
function qm(t) {
  return Va[t];
}
function Bd(t) {
  const e = Wm(t);
  return zS(e);
}
function Ym(t, e, n) {
  return Qc(Hd(t), n);
}
function Hd(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ss(r);
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
    return BigInt(`0x${Qm(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Zc(t, e = 8) {
  return (typeof t == "bigint" ? t : Hd(t)).toString(16).padStart(e * 2, "0");
}
function Qc(t, e = 16) {
  const n = Zc(t, e);
  return Ss(n);
}
function Xm(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Zm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qm(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Zm[n];
  return e;
}
function Ss(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = e.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Jc(t) {
  return new TextEncoder().encode(t);
}
function Jm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function t3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function uf(t) {
  if (t.some(t3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function tl(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Ge(t) {
  return tl(...t.map((e) => typeof e == "number" ? uf([e]) : e instanceof Array ? uf(e) : e));
}
function xo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ga;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ga || (Ga = {}));
Ga.Mainnet;
const e3 = 128, n3 = 128, _d = 16;
var Ka;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ka || (Ka = {}));
var ff;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ff || (ff = {}));
var hf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(hf || (hf = {}));
var ce;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ce || (ce = {}));
const sa = ["onChainOnly", "offChainOnly", "any"];
sa[0] + "", ce.OnChainOnly, sa[1] + "", ce.OffChainOnly, sa[2] + "", ce.Any, ce.OnChainOnly + "", ce.OnChainOnly, ce.OffChainOnly + "", ce.OffChainOnly, ce.Any + "", ce.Any;
var Wa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wa || (Wa = {}));
Wa.Mainnet;
var df;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(df || (df = {}));
var Pn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Pn || (Pn = {}));
var gf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(gf || (gf = {}));
var pf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(pf || (pf = {}));
var bf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(bf || (bf = {}));
var yf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yf || (yf = {}));
var xf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(xf || (xf = {}));
var wf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(wf || (wf = {}));
var qa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qa || (qa = {}));
var Sf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sf || (Sf = {}));
var mf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(mf || (mf = {}));
function Ya(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function r3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Md(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function s3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ya(t.outputLen), Ya(t.blockLen);
}
function i3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function o3(t, e) {
  Md(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ia = {
  number: Ya,
  bool: r3,
  bytes: Md,
  hash: s3,
  exists: i3,
  output: o3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), xe = (t, e) => t << 32 - e | t >>> e, a3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!a3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function c3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ud(t) {
  if (typeof t == "string" && (t = c3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let l3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hr(t) {
  const e = (r) => t().update(Ud(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function u3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let el = class extends l3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    ia.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ud(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = oa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ia.exists(this), ia.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    u3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const f3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Nd = Uint8Array.from({ length: 16 }, (t, e) => e), h3 = Nd.map((t) => (9 * t + 5) % 16);
let nl = [Nd], rl = [h3];
for (let t = 0; t < 4; t++)
  for (let e of [nl, rl])
    e.push(e[t].map((n) => f3[n]));
const Td = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), d3 = nl.map((t, e) => t.map((n) => Td[e][n])), g3 = rl.map((t, e) => t.map((n) => Td[e][n])), p3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), b3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), hi = (t, e) => t << e | t >>> 32 - e;
function Af(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const di = new Uint32Array(16);
let y3 = class extends el {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      di[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = p3[h], A = b3[h], L = nl[h], C = rl[h], p = d3[h], E = g3[h];
      for (let m = 0; m < 16; m++) {
        const N = hi(r + Af(h, i, a, u) + di[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = hi(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = hi(s + Af(b, o, c, f) + di[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = hi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    di.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
hr(() => new y3());
const x3 = (t, e, n) => t & e ^ ~t & n, w3 = (t, e, n) => t & e ^ t & n ^ e & n, S3 = new Uint32Array([
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
]), un = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fn = new Uint32Array(64);
let Pd = class extends el {
  constructor() {
    super(64, 32, 8, !1), this.A = un[0] | 0, this.B = un[1] | 0, this.C = un[2] | 0, this.D = un[3] | 0, this.E = un[4] | 0, this.F = un[5] | 0, this.G = un[6] | 0, this.H = un[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      fn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = fn[l - 15], h = fn[l - 2], b = xe(g, 7) ^ xe(g, 18) ^ g >>> 3, y = xe(h, 17) ^ xe(h, 19) ^ h >>> 10;
      fn[l] = y + fn[l - 7] + b + fn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = xe(a, 6) ^ xe(a, 11) ^ xe(a, 25), h = f + g + x3(a, c, u) + S3[l] + fn[l] | 0, y = (xe(r, 2) ^ xe(r, 13) ^ xe(r, 22)) + w3(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    fn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, m3 = class extends Pd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
hr(() => new Pd());
hr(() => new m3());
const gi = BigInt(2 ** 32 - 1), Xa = BigInt(32);
function Dd(t, e = !1) {
  return e ? { h: Number(t & gi), l: Number(t >> Xa & gi) } : { h: Number(t >> Xa & gi) | 0, l: Number(t & gi) | 0 };
}
function A3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Dd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const E3 = (t, e) => BigInt(t >>> 0) << Xa | BigInt(e >>> 0), I3 = (t, e, n) => t >>> n, $3 = (t, e, n) => t << 32 - n | e >>> n, v3 = (t, e, n) => t >>> n | e << 32 - n, L3 = (t, e, n) => t << 32 - n | e >>> n, C3 = (t, e, n) => t << 64 - n | e >>> n - 32, B3 = (t, e, n) => t >>> n - 32 | e << 64 - n, H3 = (t, e) => e, _3 = (t, e) => t, M3 = (t, e, n) => t << n | e >>> 32 - n, U3 = (t, e, n) => e << n | t >>> 32 - n, N3 = (t, e, n) => e << n - 32 | t >>> 64 - n, T3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function P3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const D3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), k3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, O3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), F3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, j3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), z3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: Dd,
  split: A3,
  toBig: E3,
  shrSH: I3,
  shrSL: $3,
  rotrSH: v3,
  rotrSL: L3,
  rotrBH: C3,
  rotrBL: B3,
  rotr32H: H3,
  rotr32L: _3,
  rotlSH: M3,
  rotlSL: U3,
  rotlBH: N3,
  rotlBL: T3,
  add: P3,
  add3L: D3,
  add3H: k3,
  add4L: O3,
  add4H: F3,
  add5H: z3,
  add5L: j3
}, [R3, V3] = X.split([
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
].map((t) => BigInt(t))), hn = new Uint32Array(80), dn = new Uint32Array(80);
let wo = class extends el {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: b, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      hn[p] = e.getUint32(n), dn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = hn[p - 15] | 0, m = dn[p - 15] | 0, N = X.rotrSH(E, m, 1) ^ X.rotrSH(E, m, 8) ^ X.shrSH(E, m, 7), D = X.rotrSL(E, m, 1) ^ X.rotrSL(E, m, 8) ^ X.shrSL(E, m, 7), B = hn[p - 2] | 0, U = dn[p - 2] | 0, x = X.rotrSH(B, U, 19) ^ X.rotrBH(B, U, 61) ^ X.shrSH(B, U, 6), I = X.rotrSL(B, U, 19) ^ X.rotrBL(B, U, 61) ^ X.shrSL(B, U, 6), H = X.add4L(D, I, dn[p - 7], dn[p - 16]), k = X.add4H(H, N, x, hn[p - 7], hn[p - 16]);
      hn[p] = k | 0, dn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = X.rotrSH(l, g, 14) ^ X.rotrSH(l, g, 18) ^ X.rotrBH(l, g, 41), m = X.rotrSL(l, g, 14) ^ X.rotrSL(l, g, 18) ^ X.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = X.add5L(C, m, D, V3[p], dn[p]), U = X.add5H(B, L, E, N, R3[p], hn[p]), x = B | 0, I = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), H = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = X.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = X.add3L(x, H, G);
      r = X.add3H(T, U, I, k), s = T | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = X.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = X.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = X.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = X.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = X.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    hn.fill(0), dn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, G3 = class extends wo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, K3 = class extends wo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, W3 = class extends wo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hr(() => new wo());
hr(() => new G3());
hr(() => new K3());
hr(() => new W3());
function q3(t, e, n) {
  const s = e3;
  if (u4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ka.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ct;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ct || (Ct = {}));
let Y3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, kd = class extends Y3 {
  constructor(e) {
    super(e);
  }
};
function So(t) {
  const e = [];
  return e.push(Ss(Zc(t.version, 1))), e.push(Ss(t.hash160)), Ge(e);
}
function X3(t) {
  const e = [];
  return e.push(t.prefix), e.push(So(t.address)), t.prefix === qa.Contract && e.push(ms(t.contractName)), Ge(e);
}
function ms(t) {
  const e = [], n = Jc(t.content), r = n.byteLength;
  return e.push(Ss(Zc(r, t.lengthPrefixBytes))), e.push(n), Ge(e);
}
function Z3(t) {
  const e = [];
  return e.push(So(t.address)), e.push(ms(t.contractName)), e.push(ms(t.assetName)), Ge(e);
}
function Od(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(X3(t.principal)), (t.conditionType === Pn.Fungible || t.conditionType === Pn.NonFungible) && e.push(Z3(t.assetInfo)), t.conditionType === Pn.NonFungible && e.push(Jr(t.assetName)), e.push(t.conditionCode), t.conditionType === Pn.STX || t.conditionType === Pn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new kd("The post-condition amount may not be larger than 8 bytes");
    e.push(Ym(t.amount, !1, 8));
  }
  return Ge(e);
}
function _e(t, e) {
  return Ge([t, e]);
}
function Q3(t) {
  return new Uint8Array([t.type]);
}
function J3(t) {
  return t.type === Ct.OptionalNone ? new Uint8Array([t.type]) : _e(t.type, Jr(t.value));
}
function t4(t) {
  const e = new Uint8Array(4);
  return xo(e, t.buffer.length, 0), _e(t.type, tl(e, t.buffer));
}
function e4(t) {
  const e = Qc(Xm(t.value, BigInt(n3)), _d);
  return _e(t.type, e);
}
function n4(t) {
  const e = Qc(t.value, _d);
  return _e(t.type, e);
}
function r4(t) {
  return _e(t.type, So(t.address));
}
function s4(t) {
  return _e(t.type, tl(So(t.address), ms(t.contractName)));
}
function i4(t) {
  return _e(t.type, Jr(t.value));
}
function o4(t) {
  const e = [], n = new Uint8Array(4);
  xo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Jr(r);
    e.push(s);
  }
  return _e(t.type, Ge(e));
}
function a4(t) {
  const e = [], n = new Uint8Array(4);
  xo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = q3(s);
    e.push(ms(i));
    const o = Jr(t.data[s]);
    e.push(o);
  }
  return _e(t.type, Ge(e));
}
function Fd(t, e) {
  const n = [], r = e == "ascii" ? Jm(t.data) : Jc(t.data), s = new Uint8Array(4);
  return xo(s, r.length, 0), n.push(s), n.push(r), _e(t.type, Ge(n));
}
function c4(t) {
  return Fd(t, "ascii");
}
function l4(t) {
  return Fd(t, "utf8");
}
function Jr(t) {
  switch (t.type) {
    case Ct.BoolTrue:
    case Ct.BoolFalse:
      return Q3(t);
    case Ct.OptionalNone:
    case Ct.OptionalSome:
      return J3(t);
    case Ct.Buffer:
      return t4(t);
    case Ct.UInt:
      return n4(t);
    case Ct.Int:
      return e4(t);
    case Ct.PrincipalStandard:
      return r4(t);
    case Ct.PrincipalContract:
      return s4(t);
    case Ct.ResponseOk:
    case Ct.ResponseErr:
      return i4(t);
    case Ct.List:
      return o4(t);
    case Ct.Tuple:
      return a4(t);
    case Ct.StringASCII:
      return c4(t);
    case Ct.StringUTF8:
      return l4(t);
    default:
      throw new kd("Unable to serialize. Invalid Clarity Value.");
  }
}
const u4 = (t, e) => t ? Jc(t).length > e : !1, f4 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function h4(t, e) {
  const n = {};
  return Object.assign(n, f4, e), await fetch(t, n);
}
function d4(t) {
  let e = h4, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function g4(...t) {
  const { fetchLib: e, middlewares: n } = d4(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: e,
        ...o
      })) ?? o);
    let a = await e(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Fr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fr || (Fr = {}));
var rr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(rr || (rr = {}));
var Ef;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ef || (Ef = {}));
const p4 = "https://api.mainnet.hiro.so", b4 = "https://api.testnet.hiro.so", y4 = "http://localhost:3999", x4 = ["mainnet", "testnet", "devnet", "mocknet"];
class jr {
  constructor(e) {
    this.version = rr.Mainnet, this.chainId = Fr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === rr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? g4();
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
jr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new jd();
    case "testnet":
      return new w4();
    case "devnet":
      return new S4();
    case "mocknet":
      return new zd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${x4.join(", ")}`);
  }
};
jr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : jr.fromName(t);
class jd extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? p4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = rr.Mainnet, this.chainId = Fr.Mainnet;
  }
}
class w4 extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? b4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = rr.Testnet, this.chainId = Fr.Testnet;
  }
}
class zd extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? y4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = rr.Testnet, this.chainId = Fr.Testnet;
  }
}
const S4 = zd, m4 = "connect-ui";
let $i, Rd, Zt = !1, Za = !1;
const ze = (t, e = "") => () => {
}, A4 = (t, e) => () => {
}, E4 = "{visibility:hidden}.hydrated{visibility:inherit}", If = {}, I4 = "http://www.w3.org/2000/svg", $4 = "http://www.w3.org/1999/xhtml", v4 = (t) => t != null, sl = (t) => (t = typeof t, t === "object" || t === "function");
function Vd(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const V = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !sl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Qa(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = Qa(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Qa = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, L4 = {}, C4 = (t) => t && t.$tag$ === L4, B4 = (t, e) => t != null && !sl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, H4 = (t) => ts(t).$hostElement$, _4 = (t, e, n) => {
  const r = Ut.ce(e, n);
  return t.dispatchEvent(r), r;
}, $f = /* @__PURE__ */ new WeakMap(), M4 = (t, e, n) => {
  let r = Ri.get(t);
  Q4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ri.set(t, r);
}, U4 = (t, e, n, r) => {
  var s;
  let i = Gd(e);
  const o = Ri.get(i);
  if (t = t.nodeType === 11 ? t : $e, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = $f.get(t), c;
      if (a || $f.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = $e.createElement("style"), c.innerHTML = o;
          const u = (s = Ut.$nonce$) !== null && s !== void 0 ? s : Vd($e);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, N4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = ze("attachStyles", e.$tagName$), i = U4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Gd = (t, e) => "sc-" + t.$tagName$, vf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Cf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Lf(n), f = Lf(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Cf(mo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Ut.rel(t, e, n, !1), r && Ut.ael(t, e, r, !1);
    else {
      const c = sl(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, T4 = /\s/, Lf = (t) => t ? t.split(T4) : [], Kd = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || If, o = e.$attrs$ || If;
  for (r in i)
    r in o || vf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    vf(s, r, i[r], o[r], n, e.$flags$);
}, il = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = $e.createTextNode(s.$text$);
  else {
    if (Zt || (Zt = s.$tag$ === "svg"), o = s.$elm$ = $e.createElementNS(Zt ? I4 : $4, s.$tag$), Zt && s.$tag$ === "foreignObject" && (Zt = !1), Kd(null, s, Zt), v4($i) && o["s-si"] !== $i && o.classList.add(o["s-si"] = $i), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = il(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Zt = !1 : o.tagName === "foreignObject" && (Zt = !0);
  }
  return o;
}, Wd = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Rd && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = il(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, qd = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, P4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : pi(a, f) ? (ls(a, f), a = e[++s], f = r[++i]) : pi(c, l) ? (ls(c, l), c = e[--o], l = r[--u]) : pi(a, l) ? (ls(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : pi(c, f) ? (ls(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = il(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Wd(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && qd(e, s, o);
}, pi = (t, e) => t.$tag$ === e.$tag$, ls = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Zt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Zt, Kd(t, e, Zt), r !== null && s !== null ? P4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Wd(n, null, e, s, 0, s.length - 1)) : r !== null && qd(r, 0, r.length - 1), Zt && i === "svg" && (Zt = !1)) : t.$text$ !== o && (n.data = o);
}, D4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Qa(null, null), s = C4(e) ? e : V(null, null, e);
  Rd = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, $i = n["s-sc"], ls(r, s);
}, Yd = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, ol = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Yd(t, t.$ancestorComponent$), t8(() => k4(t, e));
}, k4 = (t, e) => {
  const n = ze("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), z4(s, () => O4(t, r, e));
}, O4 = async (t, e, n) => {
  const r = t.$hostElement$, s = ze("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && N4(t);
  const o = ze("render", t.$cmpMeta$.$tagName$);
  F4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => j4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, F4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, D4(t, e);
  } catch (r) {
    As(r, t.$hostElement$);
  }
  return null;
}, j4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = ze("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Zd(n), r(), t.$onReadyResolve$(n), s || Xd()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && cl(() => ol(t, !1)), t.$flags$ &= -517;
}, Xd = (t) => {
  Zd($e.documentElement), cl(() => _4(mo, "appload", { detail: { namespace: m4 } }));
}, z4 = (t, e) => t && t.then ? t.then(e) : e(), Zd = (t) => t.classList.add("hydrated"), R4 = (t, e) => ts(t).$instanceValues$.get(e), V4 = (t, e, n, r) => {
  const s = ts(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = B4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && ol(s, !1));
}, Qd = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return R4(this, i);
        },
        set(a) {
          V4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Ut.jmp(() => {
          const u = i.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (s.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return i.set(c, o), c;
      });
    }
  }
  return t;
}, G4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Z4(n), s.then) {
        const c = A4();
        s = await s, c();
      }
      s.isProxied || (Qd(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = ze("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        As(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Gd(n);
      if (!Ri.has(c)) {
        const u = ze("registerStyles", n.$tagName$);
        M4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => ol(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, K4 = (t) => {
  if (!(Ut.$flags$ & 1)) {
    const e = ts(t), n = e.$cmpMeta$, r = ze("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Yd(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), G4(t, e, n);
    }
    r();
  }
}, W4 = (t) => {
  Ut.$flags$ & 1 || ts(t);
}, q4 = (t, e = {}) => {
  var n;
  const r = ze(), s = [], i = e.exclude || [], o = mo.customElements, a = $e.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ $e.createElement("style"), f = [];
  let l, g = !0;
  Object.assign(Ut, e), Ut.$resourcesUrl$ = new URL(e.resourcesUrl || "./", $e.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const y = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      y.$members$ = b[2];
      const A = y.$tagName$, L = class extends HTMLElement {
        // StencilLazyHost
        constructor(C) {
          super(C), C = this, X4(C, y), y.$flags$ & 1 && C.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? f.push(this) : Ut.jmp(() => K4(this));
        }
        disconnectedCallback() {
          Ut.jmp(() => W4(this));
        }
        componentOnReady() {
          return ts(this).$onReadyPromise$;
        }
      };
      y.$lazyBundleId$ = h[0], !i.includes(A) && !o.get(A) && (s.push(A), o.define(A, Qd(
        L,
        y,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + E4, u.setAttribute("data-styles", "");
    const h = (n = Ut.$nonce$) !== null && n !== void 0 ? n : Vd($e);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Ut.jmp(() => l = setTimeout(Xd, 30)), r();
}, al = /* @__PURE__ */ new WeakMap(), ts = (t) => al.get(t), Y4 = (t, e) => al.set(e.$lazyInstance$ = t, e), X4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], al.set(t, n);
}, Cf = (t, e) => e in t, As = (t, e) => (0, console.error)(t, e), aa = /* @__PURE__ */ new Map(), Z4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = aa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (aa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => KE).then(o, As);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (aa.set(s, o), o[r]), As);
}, Ri = /* @__PURE__ */ new Map(), mo = typeof window < "u" ? window : {}, $e = mo.document || { head: {} }, Ut = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Jd = (t) => Promise.resolve(t), Q4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Bf = [], tg = [], J4 = (t, e) => (n) => {
  t.push(n), Za || (Za = !0, Ut.$flags$ & 4 ? cl(Ja) : Ut.raf(Ja));
}, Hf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      As(n);
    }
  t.length = 0;
}, Ja = () => {
  Hf(Bf), Hf(tg), (Za = Bf.length > 0) && Ut.raf(Ja);
}, cl = (t) => Jd().then(t), t8 = /* @__PURE__ */ J4(tg), e8 = () => Jd(), eg = (t, e) => typeof window > "u" ? Promise.resolve() : e8().then(() => q4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var n8 = Object.defineProperty, r8 = Object.defineProperties, s8 = Object.getOwnPropertyDescriptors, Vi = Object.getOwnPropertySymbols, ng = Object.prototype.hasOwnProperty, rg = Object.prototype.propertyIsEnumerable, _f = (t, e, n) => e in t ? n8(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Be = (t, e) => {
  for (var n in e || (e = {})) ng.call(e, n) && _f(t, n, e[n]);
  if (Vi) for (var n of Vi(e)) rg.call(e, n) && _f(t, n, e[n]);
  return t;
}, Bn = (t, e) => r8(t, s8(e)), i8 = (t, e) => {
  var n = {};
  for (var r in t) ng.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Vi) for (var r of Vi(t)) e.indexOf(r) < 0 && rg.call(t, r) && (n[r] = t[r]);
  return n;
};
function ll() {
  return go(he()) || window.StacksProvider || window.BlockstackProvider;
}
function ul(t) {
  return t ? typeof t == "string" ? Jn.fromName(t) : "version" in t ? t : "url" in t ? new La({ url: t.url }) : t.transactionVersion === er.Mainnet ? new La({ url: t.client.baseUrl }) : new Ca({ url: t.client.baseUrl }) : new Ca();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var o8 = (t) => {
  if (!t) {
    let e = new no(["store_write"], document.location.href);
    t = new ys({ appConfig: e });
  }
  return t;
}, a8 = async (t, e = ll()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: a, appDetails: c } = t, u = o8(a);
  u.isUserSignedIn() && u.signUserOut();
  let f = u.generateAndStoreTransitKey(), l = u.makeAuthRequest(f, `${document.location.origin}${n}`, `${document.location.origin}${r}`, u.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: c, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await u.handlePendingSignIn(g);
    let h = Tt.decodeToken(g), b = h == null ? void 0 : h.payload;
    s == null || s({ authResponse: g, authResponsePayload: b, userSession: u });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), i == null || i();
  }
}, c8 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(c8 || {}), l8 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(l8 || {}), fl = (t) => {
  let e = t;
  if (!e) {
    let n = new no(["store_write"], document.location.href);
    e = new ys({ appConfig: n });
  }
  return e;
};
function u8(t) {
  try {
    return fl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var f8 = (t) => {
  let e = fl(t).loadUserData().appPrivateKey, n = Tt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function h8(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [tr.Mainnet]: "mainnet", [tr.Testnet]: "testnet" }, a = ul(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function d8(t) {
  let e = ul(t.network), n = fl(t.userSession), r = Bn(Be({}, t), { network: e, userSession: n });
  return Be({ stxAddress: h8(r) }, r);
}
async function g8(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Bd) : n = n.map((r) => z(Od(r)))), new Tt.TokenSigner("ES256k", e).signAsync(Bn(Be({}, t), { postConditions: n }));
}
function p8(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Bd) : e = e.map((n) => z(Od(n)))), Tt.createUnsecuredToken(Bn(Be({}, t), { postConditions: e }));
}
var b8 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = rt(a.replace(/^0x/, "")), u = Km(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Bn(Be({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Bn(Be({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, y8 = async (t) => {
  let e = t, { functionArgs: n, appDetails: r, userSession: s } = e, i = i8(e, ["functionArgs", "appDetails", "userSession"]), o = n.map((c) => typeof c == "string" ? c : typeof c.type == "string" ? gm(c) : z(Jr(c)));
  if (u8(s)) {
    let { privateKey: c, publicKey: u } = f8(s), f = Bn(Be({}, i), { functionArgs: o, txType: "contract_call", publicKey: u });
    return r && (f.appDetails = r), g8(f, c);
  }
  let a = Bn(Be({}, i), { functionArgs: o, txType: "contract_call" });
  return r && (a.appDetails = r), p8(a);
};
async function x8(t, e, n) {
  let r = await e(Bn(Be(Be({}, d8(t)), t), { network: ul(t.network) }));
  return b8({ token: r, options: t }, n);
}
function w8(t, e = ll()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return x8(t, y8, e);
}
var S8 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(S8 || {}), sg = "asigna-stx", Mf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === sg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(A8(t, e), "*");
}), m8 = { authenticationRequest: async (t) => Mf(t, "authenticationRequest"), transactionRequest: async (t) => Mf(t, "transactionRequest") }, A8 = (t, e) => ({ source: sg, [e]: t }), E8 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = m8);
};
E8();
var ig = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function og(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = he(), o = ll();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    eg();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : ig, c = sw(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = f;
    };
    u.callback = (h) => {
      l(), t(n, h);
    }, u.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(u);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var I8 = og(a8, !1), Uf = og(w8), $8 = Jh;
function Hn(t, e, n) {
  return hl(zt(t, e), n);
}
function zt(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = yt(r);
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
    if (e) {
      const r = C8(BigInt(`0x${tt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${tt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Nf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ns(t, e = 8) {
  return (typeof t == "bigint" ? t : zt(t, !1)).toString(16).padStart(e * 2, "0");
}
function Ao(t) {
  return parseInt(t, 16);
}
function hl(t, e = 16) {
  const n = Ns(t, e);
  return yt(n);
}
function v8(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function L8(t, e) {
  return t & BigInt(1) << e;
}
function C8(t, e) {
  return L8(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const B8 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += B8[n];
  return e;
}
function yt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = e.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Ts(t) {
  return new TextEncoder().encode(t);
}
function dl(t) {
  return new TextDecoder().decode(t);
}
function H8(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function _8(t) {
  return String.fromCharCode.apply(null, t);
}
function M8(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Tf(t) {
  if (t.some(M8))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Eo(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function $t(t) {
  return Eo(...t.map((e) => typeof e == "number" ? Tf([e]) : e instanceof Array ? Tf(e) : e));
}
var Pf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pf || (Pf = {}));
var Df;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Df || (Df = {}));
var kf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kf || (kf = {}));
const ag = 33, ca = 32;
function U8(t) {
  if (t.length < ca * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ca * 2), r = t.slice(2 + ca * 2);
  return {
    recoveryId: Ao(e),
    r: n,
    s: r
  };
}
function N8(t) {
  const e = typeof t == "string" ? yt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function T8(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function P8(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function D8(t, e) {
  return t[e];
}
function k8(t, e, n = 0) {
  return t[n] = e, t;
}
function O8(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function sr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var tc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(tc || (tc = {}));
const F8 = tc.Mainnet, j8 = 128, z8 = 128, cg = 16, Gn = 32, ec = 80, Io = 65, R8 = 32, V8 = 64, Gi = 34;
var O;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(O || (O = {}));
var Q;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Q || (Q = {}));
var nc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(nc || (nc = {}));
var Gt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Gt || (Gt = {}));
const vi = ["onChainOnly", "offChainOnly", "any"], Of = {
  [vi[0]]: Gt.OnChainOnly,
  [vi[1]]: Gt.OffChainOnly,
  [vi[2]]: Gt.Any,
  [Gt.OnChainOnly]: Gt.OnChainOnly,
  [Gt.OffChainOnly]: Gt.OffChainOnly,
  [Gt.Any]: Gt.Any
};
function G8(t) {
  if (t in Of)
    return Of[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${vi.join(", ")}`);
}
var Ki;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ki || (Ki = {}));
Ki.Mainnet;
var zr;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(zr || (zr = {}));
var Kt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Kt || (Kt = {}));
var mt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(mt || (mt = {}));
var lt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(lt || (lt = {}));
var rc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(rc || (rc = {}));
var wt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(wt || (wt = {}));
var Wi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Wi || (Wi = {}));
var sc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(sc || (sc = {}));
var Es;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Es || (Es = {}));
var Ff;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ff || (Ff = {}));
var jf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(jf || (jf = {}));
function ic(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function K8(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function lg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function W8(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ic(t.outputLen), ic(t.blockLen);
}
function q8(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Y8(t, e) {
  lg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zn = {
  number: ic,
  bool: K8,
  bytes: lg,
  hash: W8,
  exists: q8,
  output: Y8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const la = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), we = (t, e) => t << 32 - e | t >>> e, X8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!X8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Z8(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gl(t) {
  if (typeof t == "string" && (t = Z8(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class ug {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function dr(t) {
  const e = (r) => t().update(gl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Q8(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class pl extends ug {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = la(this.buffer);
  }
  update(e) {
    zn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = la(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zn.exists(this), zn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Q8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = la(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
}
const J8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fg = Uint8Array.from({ length: 16 }, (t, e) => e), tA = fg.map((t) => (9 * t + 5) % 16);
let bl = [fg], yl = [tA];
for (let t = 0; t < 4; t++)
  for (let e of [bl, yl])
    e.push(e[t].map((n) => J8[n]));
const hg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), eA = bl.map((t, e) => t.map((n) => hg[e][n])), nA = yl.map((t, e) => t.map((n) => hg[e][n])), rA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), sA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), bi = (t, e) => t << e | t >>> 32 - e;
function zf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const yi = new Uint32Array(16);
class iA extends pl {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      yi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = rA[h], A = sA[h], L = bl[h], C = yl[h], p = eA[h], E = nA[h];
      for (let m = 0; m < 16; m++) {
        const N = bi(r + zf(h, i, a, u) + yi[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = bi(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = bi(s + zf(b, o, c, f) + yi[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = bi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const oA = dr(() => new iA()), aA = (t, e, n) => t & e ^ ~t & n, cA = (t, e, n) => t & e ^ t & n ^ e & n, lA = new Uint32Array([
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
]), gn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), pn = new Uint32Array(64);
class dg extends pl {
  constructor() {
    super(64, 32, 8, !1), this.A = gn[0] | 0, this.B = gn[1] | 0, this.C = gn[2] | 0, this.D = gn[3] | 0, this.E = gn[4] | 0, this.F = gn[5] | 0, this.G = gn[6] | 0, this.H = gn[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      pn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = pn[l - 15], h = pn[l - 2], b = we(g, 7) ^ we(g, 18) ^ g >>> 3, y = we(h, 17) ^ we(h, 19) ^ h >>> 10;
      pn[l] = y + pn[l - 7] + b + pn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = we(a, 6) ^ we(a, 11) ^ we(a, 25), h = f + g + aA(a, c, u) + lA[l] + pn[l] | 0, y = (we(r, 2) ^ we(r, 13) ^ we(r, 22)) + cA(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    pn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class uA extends dg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const xl = dr(() => new dg());
dr(() => new uA());
const xi = BigInt(2 ** 32 - 1), oc = BigInt(32);
function gg(t, e = !1) {
  return e ? { h: Number(t & xi), l: Number(t >> oc & xi) } : { h: Number(t >> oc & xi) | 0, l: Number(t & xi) | 0 };
}
function fA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = gg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const hA = (t, e) => BigInt(t >>> 0) << oc | BigInt(e >>> 0), dA = (t, e, n) => t >>> n, gA = (t, e, n) => t << 32 - n | e >>> n, pA = (t, e, n) => t >>> n | e << 32 - n, bA = (t, e, n) => t << 32 - n | e >>> n, yA = (t, e, n) => t << 64 - n | e >>> n - 32, xA = (t, e, n) => t >>> n - 32 | e << 64 - n, wA = (t, e) => e, SA = (t, e) => t, mA = (t, e, n) => t << n | e >>> 32 - n, AA = (t, e, n) => e << n | t >>> 32 - n, EA = (t, e, n) => e << n - 32 | t >>> 64 - n, IA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function $A(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const vA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), LA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, CA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), BA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, HA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), _A = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: gg,
  split: fA,
  toBig: hA,
  shrSH: dA,
  shrSL: gA,
  rotrSH: pA,
  rotrSL: bA,
  rotrBH: yA,
  rotrBL: xA,
  rotr32H: wA,
  rotr32L: SA,
  rotlSH: mA,
  rotlSL: AA,
  rotlBH: EA,
  rotlBL: IA,
  add: $A,
  add3L: vA,
  add3H: LA,
  add4L: CA,
  add4H: BA,
  add5H: _A,
  add5L: HA
}, [MA, UA] = Z.split([
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
].map((t) => BigInt(t))), bn = new Uint32Array(80), yn = new Uint32Array(80);
class $o extends pl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: b, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, b, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      bn[p] = e.getUint32(n), yn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = bn[p - 15] | 0, m = yn[p - 15] | 0, N = Z.rotrSH(E, m, 1) ^ Z.rotrSH(E, m, 8) ^ Z.shrSH(E, m, 7), D = Z.rotrSL(E, m, 1) ^ Z.rotrSL(E, m, 8) ^ Z.shrSL(E, m, 7), B = bn[p - 2] | 0, U = yn[p - 2] | 0, x = Z.rotrSH(B, U, 19) ^ Z.rotrBH(B, U, 61) ^ Z.shrSH(B, U, 6), I = Z.rotrSL(B, U, 19) ^ Z.rotrBL(B, U, 61) ^ Z.shrSL(B, U, 6), H = Z.add4L(D, I, yn[p - 7], yn[p - 16]), k = Z.add4H(H, N, x, bn[p - 7], bn[p - 16]);
      bn[p] = k | 0, yn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = Z.rotrSH(l, g, 14) ^ Z.rotrSH(l, g, 18) ^ Z.rotrBH(l, g, 41), m = Z.rotrSL(l, g, 14) ^ Z.rotrSL(l, g, 18) ^ Z.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = Z.add5L(C, m, D, UA[p], yn[p]), U = Z.add5H(B, L, E, N, MA[p], bn[p]), x = B | 0, I = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), H = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Z.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Z.add3L(x, H, G);
      r = Z.add3H(T, U, I, k), s = T | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Z.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Z.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = Z.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    bn.fill(0), yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class NA extends $o {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class TA extends $o {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class PA extends $o {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
dr(() => new $o());
dr(() => new NA());
const DA = dr(() => new TA());
dr(() => new PA());
function pg(t) {
  if (yt(t).byteLength != Io)
    throw Error("Invalid signature");
  return {
    type: O.MessageSignature,
    data: t
  };
}
function wi(t, e) {
  return { type: O.Address, version: t, hash160: e };
}
function ir(t, e, n) {
  const r = e || 1, s = n || j8;
  if (Ng(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: O.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function wl(t) {
  const e = Xr.c32addressDecode(t);
  return {
    type: O.Address,
    version: e[0],
    hash160: e[1]
  };
}
var j;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(j || (j = {}));
function kA(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return jA(e, n);
  } else
    return OA(t);
}
function OA(t) {
  const e = wl(t);
  return { type: j.PrincipalStandard, address: e };
}
function FA(t) {
  return { type: j.PrincipalStandard, address: t };
}
function jA(t, e) {
  const n = wl(t), r = ir(e);
  return bg(n, r);
}
function bg(t, e) {
  if (Ts(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: j.PrincipalContract, address: t, contractName: e };
}
const yg = () => ({ type: j.BoolTrue }), xg = () => ({ type: j.BoolFalse }), zA = (t) => t ? yg() : xg(), Rf = BigInt("0xffffffffffffffffffffffffffffffff"), RA = BigInt(0), Vf = BigInt("0x7fffffffffffffffffffffffffffffff"), Gf = BigInt("-170141183460469231731687303715884105728"), VA = (t) => {
  const e = zt(t, !0);
  if (e > Vf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Vf}`);
  if (e < Gf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Gf}`);
  return { type: j.Int, value: e };
}, wg = (t) => {
  const e = zt(t, !1);
  if (e < RA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Rf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Rf}`);
  return { type: j.UInt, value: e };
}, GA = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: j.Buffer, buffer: t };
};
function Sg() {
  return { type: j.OptionalNone };
}
function mg(t) {
  return { type: j.OptionalSome, value: t };
}
function KA(t) {
  return { type: j.ResponseErr, value: t };
}
function WA(t) {
  return { type: j.ResponseOk, value: t };
}
function Ag(t) {
  return { type: j.List, list: t };
}
function Eg(t) {
  for (const e in t)
    if (!P5(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: j.Tuple, data: t };
}
const qA = (t) => ({ type: j.StringASCII, data: t }), YA = (t) => ({ type: j.StringUTF8, data: t });
class Ig extends ug {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zn.hash(e);
    const r = gl(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return zn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    zn.exists(this), zn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const $g = (t, e, n) => new Ig(t, e).update(n).digest();
$g.create = (t, e) => new Ig(t, e);
At.hmacSha256Sync = (t, ...e) => {
  const n = $g.create(xl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Rr(t) {
  return {
    type: O.PublicKey,
    data: yt(t)
  };
}
function XA(t, e, n = wt.Compressed) {
  const r = U8(e.data), s = new ee(Nf(r.r), Nf(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === wt.Compressed;
  return i.toHex(o);
}
function ZA(t) {
  return { type: O.PublicKey, data: t };
}
function es(t) {
  return !tt(t.data).startsWith("04");
}
function qi(t) {
  return t.data.slice();
}
function QA(t) {
  const e = e5(t), n = Hs(e.data.slice(0, 32), e.compressed);
  return Rr(tt(n));
}
function JA(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!0);
  return Rr(n);
}
function t5(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!1);
  return Rr(n);
}
function ac(t) {
  const e = t.readUInt8(), n = e === 4 ? V8 : R8;
  return ZA($t([e, t.readBytes(n)]));
}
function e5(t) {
  const e = N8(t), n = e.length == ag;
  return { data: e, compressed: n };
}
function n5(t, e) {
  const [n, r] = so(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ns(r, 1) + ee.fromHex(n).toCompactHex();
  return pg(i);
}
function r5(t) {
  return QA(t.data);
}
function s5(t, e, n) {
  return typeof t == "string" && (t = kA(t)), typeof n == "string" && (n = qf(n)), {
    type: O.Payload,
    payloadType: Q.TokenTransfer,
    recipient: t,
    amount: zt(e, !1),
    memo: n ?? qf("")
  };
}
function i5(t, e, n, r) {
  return typeof t == "string" && (t = wl(t)), typeof e == "string" && (e = ir(e)), typeof n == "string" && (n = ir(n)), {
    type: O.Payload,
    payloadType: Q.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Kf(t, e, n) {
  return typeof t == "string" && (t = ir(t)), typeof e == "string" && (e = g5(e)), typeof n == "number" ? {
    type: O.Payload,
    payloadType: Q.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: O.Payload,
    payloadType: Q.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function o5() {
  return { type: O.Payload, payloadType: Q.PoisonMicroblock };
}
function Wf(t, e) {
  if (t.byteLength != Gn)
    throw Error(`Coinbase buffer size must be ${Gn} bytes`);
  return e != null ? {
    type: O.Payload,
    payloadType: Q.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: O.Payload,
    payloadType: Q.Coinbase,
    coinbaseBytes: t
  };
}
function a5(t, e, n) {
  if (t.byteLength != Gn)
    throw Error(`Coinbase buffer size must be ${Gn} bytes`);
  if (n.byteLength != ec)
    throw Error(`VRF proof buffer size must be ${ec} bytes`);
  return {
    type: O.Payload,
    payloadType: Q.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === j.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var cc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(cc || (cc = {}));
function c5(t, e, n, r, s, i, o) {
  return {
    type: O.Payload,
    payloadType: Q.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function vg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Q.TokenTransfer:
      e.push(ve(t.recipient)), e.push(Hn(t.amount, !1, 8)), e.push(De(t.memo));
      break;
    case Q.ContractCall:
      e.push(De(t.contractAddress)), e.push(De(t.contractName)), e.push(De(t.functionName));
      const n = new Uint8Array(4);
      sr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ve(r));
      });
      break;
    case Q.SmartContract:
      e.push(De(t.contractName)), e.push(De(t.codeBody));
      break;
    case Q.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(De(t.contractName)), e.push(De(t.codeBody));
      break;
    case Q.PoisonMicroblock:
      break;
    case Q.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Q.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ve(t.recipient));
      break;
    case Q.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ve(t.recipient ? mg(t.recipient) : Sg())), e.push(t.vrfProof);
      break;
    case Q.TenureChange:
      e.push(yt(t.tenureHash)), e.push(yt(t.previousTenureHash)), e.push(yt(t.burnViewHash)), e.push(yt(t.previousTenureEnd)), e.push(sr(new Uint8Array(4), t.previousTenureBlocks)), e.push(k8(new Uint8Array(1), t.cause)), e.push(yt(t.publicKeyHash));
      break;
  }
  return $t(e);
}
function l5(t) {
  switch (t.readUInt8Enum(Q, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Q.TokenTransfer:
      const n = Ae(t), r = zt(t.readBytes(8), !1), s = Cg(t);
      return s5(n, r, s);
    case Q.ContractCall:
      const i = Vr(t), o = oe(t), a = oe(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const E = Ae(t);
        c.push(E);
      }
      return i5(i, o, a, c);
    case Q.SmartContract:
      const f = oe(t), l = oe(t, 4, 1e5);
      return Kf(f, l);
    case Q.VersionedSmartContract: {
      const p = t.readUInt8Enum(nc, (N) => {
        throw new Error(`Cannot recognize ClarityVersion: ${N}`);
      }), E = oe(t), m = oe(t, 4, 1e5);
      return Kf(E, m, p);
    }
    case Q.PoisonMicroblock:
      return o5();
    case Q.Coinbase: {
      const p = t.readBytes(Gn);
      return Wf(p);
    }
    case Q.CoinbaseToAltRecipient: {
      const p = t.readBytes(Gn), E = Ae(t);
      return Wf(p, E);
    }
    case Q.NakamotoCoinbase: {
      const p = t.readBytes(Gn), E = Ae(t), m = t.readBytes(ec);
      return a5(p, E, m);
    }
    case Q.TenureChange:
      const g = tt(t.readBytes(20)), h = tt(t.readBytes(20)), b = tt(t.readBytes(20)), y = tt(t.readBytes(32)), A = t.readUInt32BE(), L = t.readUInt8Enum(cc, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), C = tt(t.readBytes(20));
      return c5(g, h, b, y, A, L, C);
  }
}
class vo extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Dn extends vo {
  constructor(e) {
    super(e);
  }
}
class te extends vo {
  constructor(e) {
    super(e);
  }
}
class Yi extends vo {
  constructor(e) {
    super(e);
  }
}
class Rn extends vo {
  constructor(e) {
    super(e);
  }
}
var ue;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ue || (ue = {}));
function lc(t) {
  return pg(tt(t.readBytes(Io)));
}
function Ir(t, e) {
  return {
    pubKeyEncoding: t,
    type: O.TransactionAuthField,
    contents: e
  };
}
function u5(t) {
  const e = t.readUInt8Enum(ue, (n) => {
    throw new te(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ue.PublicKeyCompressed:
      return Ir(wt.Compressed, ac(t));
    case ue.PublicKeyUncompressed:
      return Ir(wt.Uncompressed, t5(ac(t).data));
    case ue.SignatureCompressed:
      return Ir(wt.Compressed, lc(t));
    case ue.SignatureUncompressed:
      return Ir(wt.Uncompressed, lc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Sl(t) {
  return yt(t.data);
}
function f5(t) {
  const e = [];
  switch (t.contents.type) {
    case O.PublicKey:
      e.push(t.pubKeyEncoding === wt.Compressed ? ue.PublicKeyCompressed : ue.PublicKeyUncompressed), e.push(qi(JA(t.contents.data)));
      break;
    case O.MessageSignature:
      e.push(t.pubKeyEncoding === wt.Compressed ? ue.SignatureCompressed : ue.SignatureUncompressed), e.push(Sl(t.contents));
      break;
  }
  return $t(e);
}
function De(t) {
  switch (t.type) {
    case O.Address:
      return Ps(t);
    case O.Principal:
      return Lg(t);
    case O.LengthPrefixedString:
      return Gr(t);
    case O.MemoString:
      return p5(t);
    case O.AssetInfo:
      return Bg(t);
    case O.PostCondition:
      return _g(t);
    case O.PublicKey:
      return qi(t);
    case O.LengthPrefixedList:
      return El(t);
    case O.Payload:
      return vg(t);
    case O.TransactionAuthField:
      return f5(t);
    case O.MessageSignature:
      return Sl(t);
  }
}
function h5() {
  return {
    type: O.Address,
    version: rc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function ml(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === lt.SerializeP2PKH || e === lt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === lt.SerializeP2WPKH || e === lt.SerializeP2WSH || e === lt.SerializeP2WSHNonSequential) && !r.every(es))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case lt.SerializeP2PKH:
      return wi(t, M5(r[0].data));
    case lt.SerializeP2WPKH:
      return wi(t, U5(r[0].data));
    case lt.SerializeP2SH:
    case lt.SerializeP2SHNonSequential:
      return wi(t, N5(n, r.map(qi)));
    case lt.SerializeP2WSH:
    case lt.SerializeP2WSHNonSequential:
      return wi(t, T5(n, r.map(qi)));
  }
}
function Ps(t) {
  const e = [];
  return e.push(yt(Ns(t.version, 1))), e.push(yt(t.hash160)), $t(e);
}
function Vr(t) {
  const e = Ao(tt(t.readBytes(1))), n = tt(t.readBytes(20));
  return { type: O.Address, version: e, hash160: n };
}
function Lg(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ps(t.address)), t.prefix === Es.Contract && e.push(Gr(t.contractName)), $t(e);
}
function d5(t) {
  const e = t.readUInt8Enum(Es, (s) => {
    throw new te(`Unexpected Principal payload type: ${s}`);
  }), n = Vr(t);
  if (e === Es.Standard)
    return { type: O.Principal, prefix: e, address: n };
  const r = oe(t);
  return {
    type: O.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Gr(t) {
  const e = [], n = Ts(t.content), r = n.byteLength;
  return e.push(yt(Ns(r, t.lengthPrefixBytes))), e.push(n), $t(e);
}
function oe(t, e, n) {
  e = e || 1;
  const r = Ao(tt(t.readBytes(e))), s = dl(t.readBytes(r));
  return ir(s, e, n ?? 128);
}
function g5(t) {
  return ir(t, 4, 1e5);
}
function qf(t) {
  if (t && Ng(t, Gi))
    throw new Error(`Memo exceeds maximum length of ${Gi} bytes`);
  return { type: O.MemoString, content: t };
}
function p5(t) {
  const e = [], n = Ts(t.content), r = _5(tt(n), Gi * 2);
  return e.push(yt(r)), $t(e);
}
function Cg(t) {
  let e = dl(t.readBytes(Gi));
  return e = e.replace(/\u0000*$/, ""), { type: O.MemoString, content: e };
}
function Bg(t) {
  const e = [];
  return e.push(Ps(t.address)), e.push(Gr(t.contractName)), e.push(Gr(t.assetName)), $t(e);
}
function uc(t) {
  return {
    type: O.AssetInfo,
    address: Vr(t),
    contractName: oe(t),
    assetName: oe(t)
  };
}
function Al(t, e) {
  return {
    type: O.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function El(t) {
  const e = t.values, n = [];
  n.push(yt(Ns(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(De(r));
  return $t(n);
}
function Hg(t, e, n) {
  const r = Ao(tt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case O.Address:
        s.push(Vr(t));
        break;
      case O.LengthPrefixedString:
        s.push(oe(t));
        break;
      case O.MemoString:
        s.push(Cg(t));
        break;
      case O.AssetInfo:
        s.push(uc(t));
        break;
      case O.PostCondition:
        s.push(b5(t));
        break;
      case O.PublicKey:
        s.push(ac(t));
        break;
      case O.TransactionAuthField:
        s.push(u5(t));
        break;
    }
  return Al(s, n);
}
function _g(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Lg(t.principal)), (t.conditionType === Kt.Fungible || t.conditionType === Kt.NonFungible) && e.push(Bg(t.assetInfo)), t.conditionType === Kt.NonFungible && e.push(ve(t.assetName)), e.push(t.conditionCode), t.conditionType === Kt.STX || t.conditionType === Kt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Dn("The post-condition amount may not be larger than 8 bytes");
    e.push(Hn(t.amount, !1, 8));
  }
  return $t(e);
}
function b5(t) {
  const e = t.readUInt8Enum(Kt, (o) => {
    throw new te(`Could not read ${o} as PostConditionType`);
  }), n = d5(t);
  let r, s, i;
  switch (e) {
    case Kt.STX:
      return r = t.readUInt8Enum(Wi, (a) => {
        throw new te(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Kt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Kt.Fungible:
      return s = uc(t), r = t.readUInt8Enum(Wi, (a) => {
        throw new te(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Kt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Kt.NonFungible:
      s = uc(t);
      const o = Ae(t);
      return r = t.readUInt8Enum(sc, (a) => {
        throw new te(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: O.PostCondition,
        conditionType: Kt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Me(t, e) {
  return $t([t, e]);
}
function y5(t) {
  return new Uint8Array([t.type]);
}
function x5(t) {
  return t.type === j.OptionalNone ? new Uint8Array([t.type]) : Me(t.type, ve(t.value));
}
function w5(t) {
  const e = new Uint8Array(4);
  return sr(e, t.buffer.length, 0), Me(t.type, Eo(e, t.buffer));
}
function S5(t) {
  const e = hl(v8(t.value, BigInt(z8)), cg);
  return Me(t.type, e);
}
function m5(t) {
  const e = hl(t.value, cg);
  return Me(t.type, e);
}
function A5(t) {
  return Me(t.type, Ps(t.address));
}
function E5(t) {
  return Me(t.type, Eo(Ps(t.address), Gr(t.contractName)));
}
function I5(t) {
  return Me(t.type, ve(t.value));
}
function $5(t) {
  const e = [], n = new Uint8Array(4);
  sr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ve(r);
    e.push(s);
  }
  return Me(t.type, $t(e));
}
function v5(t) {
  const e = [], n = new Uint8Array(4);
  sr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ir(s);
    e.push(Gr(i));
    const o = ve(t.data[s]);
    e.push(o);
  }
  return Me(t.type, $t(e));
}
function Mg(t, e) {
  const n = [], r = e == "ascii" ? H8(t.data) : Ts(t.data), s = new Uint8Array(4);
  return sr(s, r.length, 0), n.push(s), n.push(r), Me(t.type, $t(n));
}
function L5(t) {
  return Mg(t, "ascii");
}
function C5(t) {
  return Mg(t, "utf8");
}
function ve(t) {
  switch (t.type) {
    case j.BoolTrue:
    case j.BoolFalse:
      return y5(t);
    case j.OptionalNone:
    case j.OptionalSome:
      return x5(t);
    case j.Buffer:
      return w5(t);
    case j.UInt:
      return m5(t);
    case j.Int:
      return S5(t);
    case j.PrincipalStandard:
      return A5(t);
    case j.PrincipalContract:
      return E5(t);
    case j.ResponseOk:
    case j.ResponseErr:
      return I5(t);
    case j.List:
      return $5(t);
    case j.Tuple:
      return v5(t);
    case j.StringASCII:
      return L5(t);
    case j.StringUTF8:
      return C5(t);
    default:
      throw new Dn("Unable to serialize. Invalid Clarity Value.");
  }
}
function B5(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Yf = /* @__PURE__ */ new Map();
function Ug(t, e) {
  const n = Yf.get(t);
  if (n !== void 0)
    return n(e);
  const r = B5(t);
  return Yf.set(t, r), Ug(t, e);
}
class gs {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return O8(this.readBytes(4), 0);
  }
  readUInt8() {
    return D8(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return T8(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = tt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = tt(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(e) {
    this.consumed = e;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(e, n) {
    const r = this.readUInt8();
    if (Ug(e, r))
      return r;
    throw n(r);
  }
}
function Ae(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new gs(yt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new gs(t) : e = t;
  switch (e.readUInt8Enum(j, (r) => {
    throw new te(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case j.Int:
      return VA(e.readBytes(16));
    case j.UInt:
      return wg(e.readBytes(16));
    case j.Buffer:
      const r = e.readUInt32BE();
      return GA(e.readBytes(r));
    case j.BoolTrue:
      return yg();
    case j.BoolFalse:
      return xg();
    case j.PrincipalStandard:
      const s = Vr(e);
      return FA(s);
    case j.PrincipalContract:
      const i = Vr(e), o = oe(e);
      return bg(i, o);
    case j.ResponseOk:
      return WA(Ae(e));
    case j.ResponseErr:
      return KA(Ae(e));
    case j.OptionalNone:
      return Sg();
    case j.OptionalSome:
      return mg(Ae(e));
    case j.List:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(Ae(e));
      return Ag(c);
    case j.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = oe(e).content;
        if (A === void 0)
          throw new te('"content" is undefined');
        f[A] = Ae(e);
      }
      return Eg(f);
    case j.StringASCII:
      const l = e.readUInt32BE(), g = _8(e.readBytes(l));
      return qA(g);
    case j.StringUTF8:
      const h = e.readUInt32BE(), b = dl(e.readBytes(h));
      return YA(b);
    default:
      throw new te("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const H5 = (t) => t.length % 2 == 0 ? t : `0${t}`, _5 = (t, e) => t.padEnd(e, "0"), Ng = (t, e) => t ? Ts(t).length > e : !1;
function fc(t) {
  return Zh(t);
}
const Is = (t) => oA(xl(t)), Il = (t) => tt(DA(t)), M5 = (t) => tt(Is(t)), U5 = (t) => {
  const e = Is(t), n = Eo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Is(n);
  return tt(r);
}, N5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = Is(r);
  return tt(s);
}, T5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = xl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = $t(i), a = Is(o);
  return tt(a);
};
function P5(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
const vr = (t) => {
  try {
    return Xr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function $l() {
  return {
    type: O.MessageSignature,
    data: tt(new Uint8Array(Io))
  };
}
function Tg(t, e, n, r) {
  const s = ml(0, t, 1, [Rr(e)]).hash160, i = es(Rr(e)) ? wt.Compressed : wt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: zt(n, !1),
    fee: zt(r, !1),
    keyEncoding: i,
    signature: $l()
  };
}
function $s(t) {
  return "signature" in t;
}
function Xf(t) {
  return t === lt.SerializeP2SH || t === lt.SerializeP2WSH;
}
function D5(t) {
  return t === lt.SerializeP2SHNonSequential || t === lt.SerializeP2WSHNonSequential;
}
function Zf(t) {
  const e = fc(t);
  return e.nonce = 0, e.fee = 0, $s(e) ? e.signature = $l() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function k5(t) {
  const e = [
    t.hashMode,
    yt(t.signer),
    Hn(t.nonce, !1, 8),
    Hn(t.fee, !1, 8),
    t.keyEncoding,
    Sl(t.signature)
  ];
  return $t(e);
}
function O5(t) {
  const e = [
    t.hashMode,
    yt(t.signer),
    Hn(t.nonce, !1, 8),
    Hn(t.fee, !1, 8)
  ], n = Al(t.fields);
  e.push(El(n));
  const r = new Uint8Array(2);
  return P8(r, t.signaturesRequired, 0), e.push(r), $t(e);
}
function F5(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt(`0x${tt(e.readBytes(8))}`), s = BigInt(`0x${tt(e.readBytes(8))}`), i = e.readUInt8Enum(wt, (a) => {
    throw new te(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === lt.SerializeP2WPKH && i != wt.Compressed)
    throw new te("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = lc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function j5(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt("0x" + tt(e.readBytes(8))), s = BigInt("0x" + tt(e.readBytes(8))), i = Hg(e, O.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case O.PublicKey:
        es(u.contents) || (o = !0);
        break;
      case O.MessageSignature:
        if (u.pubKeyEncoding === wt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Rn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === lt.SerializeP2WSH || t === lt.SerializeP2WSHNonSequential))
    throw new Rn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ua(t) {
  return $s(t) ? k5(t) : O5(t);
}
function fa(t) {
  const e = t.readUInt8Enum(lt, (n) => {
    throw new te(`Could not parse ${n} as AddressHashMode`);
  });
  return e === lt.SerializeP2PKH || e === lt.SerializeP2WPKH ? F5(e, t) : j5(e, t);
}
function Pg(t, e, n, r) {
  const i = t + tt(new Uint8Array([e])) + tt(Hn(n, !1, 8)) + tt(Hn(r, !1, 8));
  if (yt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Il(yt(i));
}
function Dg(t, e, n) {
  const r = 33 + Io, s = es(e) ? wt.Compressed : wt.Uncompressed, i = t + H5(s.toString(16)) + n.data, o = yt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Il(o);
}
function z5(t, e, n, r, s) {
  const i = Pg(t, e, n, r), o = n5(s, i), a = r5(s), c = Dg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function kg(t, e, n, r, s, i) {
  const o = Pg(t, e, n, r), a = Rr(XA(o, i, s)), c = Dg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function R5() {
  const t = Tg(lt.SerializeP2PKH, "", 0, 0);
  return t.signer = h5().hash160, t.keyEncoding = wt.Compressed, t.signature = $l(), t;
}
function Qf(t, e, n) {
  return $s(t) ? V5(t, e, n) : G5(t, e, n);
}
function V5(t, e, n) {
  const { pubKey: r, nextSigHash: s } = kg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = ml(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Rn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function G5(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case O.PublicKey:
        es(c.contents) || (i = !0), r.push(c.contents);
        break;
      case O.MessageSignature:
        c.pubKeyEncoding === wt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = kg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Xf(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Rn("Too many signatures");
        break;
    }
  if (Xf(t.hashMode) && o !== t.signaturesRequired || D5(t.hashMode) && o < t.signaturesRequired)
    throw new Rn("Incorrect number of signatures");
  if (i && (t.hashMode === lt.SerializeP2WSH || t.hashMode === lt.SerializeP2WSHNonSequential))
    throw new Rn("Uncompressed keys are not allowed in this hash mode");
  const a = ml(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Rn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Og(t) {
  return {
    authType: mt.Standard,
    spendingCondition: t
  };
}
function Fg(t, e) {
  return {
    authType: mt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Tg(lt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Jf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case mt.Standard:
        return Og(Zf(t.spendingCondition));
      case mt.Sponsored:
        return Fg(Zf(t.spendingCondition), R5());
      default:
        throw new Yi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function K5(t, e) {
  switch (t.authType) {
    case mt.Standard:
      return Qf(t.spendingCondition, e, mt.Standard);
    case mt.Sponsored:
      return Qf(t.spendingCondition, e, mt.Standard);
    default:
      throw new Yi("Invalid origin auth type");
  }
}
function W5(t, e) {
  switch (t.authType) {
    case mt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: zt(e, !1)
      };
      return { ...t, spendingCondition: n };
    case mt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: zt(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function q5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: zt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Y5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: zt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X5(t, e) {
  const n = {
    ...e,
    nonce: zt(e.nonce, !1),
    fee: zt(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Z5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case mt.Standard:
      e.push(ua(t.spendingCondition));
      break;
    case mt.Sponsored:
      e.push(ua(t.spendingCondition)), e.push(ua(t.sponsorSpendingCondition));
      break;
  }
  return $t(e);
}
function Q5(t) {
  const e = t.readUInt8Enum(mt, (r) => {
    throw new te(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case mt.Standard:
      return n = fa(t), Og(n);
    case mt.Sponsored:
      n = fa(t);
      const r = fa(t);
      return Fg(n, r);
  }
}
class J5 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: zt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? F8, this.postConditionMode = i ?? zr.Deny, this.postConditions = s ?? Al([]), o)
      this.anchorMode = G8(o);
    else
      switch (r.payloadType) {
        case Q.Coinbase:
        case Q.CoinbaseToAltRecipient:
        case Q.NakamotoCoinbase:
        case Q.PoisonMicroblock:
        case Q.TenureChange:
          this.anchorMode = Gt.OnChainOnly;
          break;
        case Q.ContractCall:
        case Q.SmartContract:
        case Q.VersionedSmartContract:
        case Q.TokenTransfer:
          this.anchorMode = Gt.Any;
          break;
      }
  }
  signBegin() {
    const e = fc(this);
    return e.auth = Jf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = fc(this);
    return e.auth = Jf(e.auth), e.txid();
  }
  verifyOrigin() {
    return K5(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, mt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === mt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, mt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !$s(n)) {
      const r = es(e);
      n.fields.push(Ir(r ? wt.Compressed : wt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = z5(n, r, e.fee, e.nonce, s);
    return $s(e) ? e.signature = i : e.fields.push(Ir(s.data.byteLength === ag ? wt.Compressed : wt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Il(e);
  }
  setSponsor(e) {
    if (this.auth.authType != mt.Sponsored)
      throw new Yi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = X5(this.auth, e);
  }
  setFee(e) {
    this.auth = W5(this.auth, e);
  }
  setNonce(e) {
    this.auth = q5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != mt.Sponsored)
      throw new Yi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Y5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Dn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Dn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Dn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Dn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Dn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return sr(n, this.chainId, 0), e.push(n), e.push(Z5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(El(this.postConditions)), e.push(vg(this.payload)), $t(e);
  }
}
function tE(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new gs(yt(t.slice(2))) : e = new gs(yt(t)) : t instanceof Uint8Array ? e = new gs(t) : e = t;
  const n = e.readUInt8Enum(Ki, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Q5(e), i = e.readUInt8Enum(Gt, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(zr, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Hg(e, O.PostCondition), c = l5(e);
  return new J5(n, s, c, a, o, i, r);
}
const t0 = zA, e0 = wg, eE = Ag, nE = Eg, jg = (t) => {
  let e = "";
  for (const n of t)
    e += n.toString(16).padStart(2, "0");
  return e;
}, rE = ["store_write"], n0 = "/manifest.json", sE = /* @__PURE__ */ new Set([4001, -31001]), iE = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], oE = ["result", "data", "payload", "response", "params"], r0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], vl = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Ds = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ns = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Lr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, zg = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Ll = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => zg(i, r)) === s
  );
}, Rg = (t) => t ? Ll(ns()).some(
  (e) => {
    var n;
    return e.id === t && (Ds(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Vg = () => {
  if (typeof window > "u")
    return;
  const t = ns(), e = Ll(t).filter(
    (n) => {
      var r;
      return Ds(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Lr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of iE) {
    const r = Lr(t, n) ?? (t === window ? void 0 : Lr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Gg = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ns(), n = Lr(e, t) ?? (e === window ? void 0 : Lr(window, t)) ?? go(t);
  if (n)
    return n;
  if (Ds(t) || Rg(t))
    return Vg();
}, aE = (t) => {
  const e = ns();
  if (!e)
    return [];
  const n = Ll(e), r = t.filter(
    (s) => !n.some((i) => zg(i, s)) && !!Lr(e, s.id)
  );
  return n.concat(r);
}, An = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Re = () => ({ isConnected: !1 }), cE = ["blockstack-session", "blockstack"], Kg = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of cE) {
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
Kg();
const ks = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Pt = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, lE = (t) => {
  const e = Pt(t);
  if (!e)
    return null;
  const n = ks(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, uE = (t) => {
  const e = Pt(t);
  if (!e)
    return null;
  const n = ks(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Xi = (t, e = "mainnet") => {
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
      return Xi(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Xi(r, e);
  }
  return e;
}, Zi = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, fE = (t) => typeof t == "string" ? ks(t) : jg(ve(t)), hE = (t) => typeof t == "string" ? ks(t) : jg(_g(t)), dE = (t) => t === zr.Allow ? "allow" : "deny", Kr = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return vr(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Kr(s, e + 1);
      if (i)
        return i;
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
    const i = Kr(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && vr(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && vr(n.testnet) ? n.testnet.trim() : null;
}, s0 = (t) => {
  const e = Pt(t);
  if (!e)
    return null;
  const n = ks(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, hc = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const a = hc(o, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : s0(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => Pt(o)).find((o) => o && vr(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => s0(o)).find(Boolean);
  if (i && (!e || s && s === e))
    return i;
  for (const o of [
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
    if (!(o in r))
      continue;
    const a = hc(r[o], e, n + 1);
    if (a)
      return a;
  }
  return null;
}, gE = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && vr(n) ? n.trim() : null;
  if (!r)
    return Re();
  const s = gc(r);
  return s !== "mainnet" ? Re() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, pE = (t, e = "mainnet") => {
  const n = Kr(t);
  if (!n)
    return Re();
  const r = gc(n) ?? Xi(t, e);
  if (r !== "mainnet")
    return Re();
  const s = hc(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, Lo = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Os = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && sE.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, _n = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Pt(n == null ? void 0 : n.message) ?? Pt(e.message) ?? Pt(e.error) ?? Pt(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, or = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw _n(e);
    if (e.status === "error")
      throw _n(e.result ?? e);
  }
  return t;
}, Co = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return or(r);
  } catch (r) {
    throw _n(r);
  }
}, Cl = () => Vg(), Wr = (t) => {
  var r, s;
  const e = he();
  if (Ds(e) || Rg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ns() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Cl();
}, i0 = async (t, e, n) => {
  if (!Wr(t))
    return Co(t, e, n);
  const r = Cl();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return or(await r.request(e, n));
  } catch (s) {
    throw _n(s);
  }
}, ha = (t) => {
  const e = uE(t);
  if (!e)
    return null;
  try {
    const n = tE(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, dc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = ha(t), r = lE(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Pt(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = dc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of r0)
    if (ha(s[a])) {
      i = Pt(s[a]);
      break;
    }
  const o = Pt(s.txId) || Pt(s.txid) || Pt(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Pt(s.txRaw) ?? void 0
    };
  for (const a of r0) {
    const c = ha(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Pt(s[a]) ?? void 0
      };
  }
  for (const a of oE) {
    const c = s[a], u = dc(c, e + 1);
    if (u)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, o0 = (t) => {
  const e = dc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, bE = (t) => ({
  ...t,
  fee: Zi(t.fee),
  nonce: Zi(t.nonce),
  sponsored: t.sponsored === !0
}), Wg = (t) => {
  const e = t.postConditions && t.postConditions.length > 0 ? t.postConditions.map((n) => hE(n)) : void 0;
  return {
    contract: `${t.contractAddress}.${t.contractName}`,
    functionName: t.functionName,
    functionArgs: t.functionArgs.map((n) => fE(n)),
    network: Xi(t.network),
    address: t.stxAddress,
    fee: Zi(t.fee),
    nonce: Zi(t.nonce),
    sponsored: t.sponsored ?? !1,
    postConditionMode: dE(t.postConditionMode),
    postConditions: e
  };
}, yE = (t) => {
  const e = Wg(t);
  return {
    contract: e.contract,
    functionName: e.functionName,
    functionArgs: e.functionArgs,
    // Older Xverse builds validate with a schema that only reads `arguments`
    // and silently drop `functionArgs`; send both spellings.
    arguments: e.functionArgs,
    postConditionMode: e.postConditionMode,
    postConditions: e.postConditions
  };
}, qg = "WALLET_ADDRESS_MISMATCH";
let a0 = 9e4;
const xE = 45e3;
let ps = null;
const Qi = (t) => {
  t && (ps = { address: t, at: Date.now() });
}, Yg = () => {
  ps = null;
}, wE = () => ps && Date.now() - ps.at <= xE ? ps.address : null, SE = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, mE = async (t) => {
  Yg();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = or(await t.request("wallet_connect")), n = Kr(e);
  return Qi(n), n;
}, AE = async (t, e, n, r) => {
  try {
    return or(await t.request(e, n));
  } catch (s) {
    const i = _n(s);
    if (!SE(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await mE(t);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), i;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : i.message
        ),
        { code: o ? qg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return or(await t.request(e, n));
    } catch (a) {
      throw _n(a);
    }
  }
};
let c0 = 3e4;
const EE = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${c0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, c0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, IE = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: qg }
      );
    return c;
  }, s = wE();
  if (s)
    return An(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  An(n, "account-read");
  try {
    const c = or(
      await EE(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Kr(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Os(c))
      throw _n(c);
    An(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Qi(i), r(i, "wallet_getAccount");
  let o;
  An(n, "account-reconnect");
  try {
    o = or(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), _n(c);
  }
  const a = Kr(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Qi(a), r(a, "wallet_connect");
}, $E = async (t, e) => {
  if (!Wr(t)) {
    An(e.onProgress, "signing-request");
    const c = await Co(
      t,
      "stx_callContract",
      Wg(e)
    );
    return o0(c);
  }
  const n = Cl();
  if (!n)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  let r = "account-preflight", s;
  const i = async () => {
    var f;
    s = await IE(n, e.stxAddress, e.onProgress), r = "stx_callContract", An(e.onProgress, "signing-request");
    const c = yE(e);
    console.info("[wallet:contract-call]", {
      stage: "XVERSE_SIGNING_REQUEST",
      providerId: he(),
      contract: c.contract,
      functionName: c.functionName,
      functionArgCount: c.functionArgs.length,
      postConditionMode: c.postConditionMode,
      postConditionCount: ((f = c.postConditions) == null ? void 0 : f.length) ?? 0,
      expectedAddress: e.stxAddress,
      activeAddress: s
    });
    const u = await AE(
      n,
      "stx_callContract",
      c,
      e.stxAddress ?? s
    );
    return o0(u);
  };
  let o;
  const a = new Promise((c, u) => {
    o = setTimeout(() => {
      u(
        Object.assign(
          new Error(
            `Xverse did not answer the ${r} request within ${Math.round(
              a0 / 1e3
            )}s (provider=${he() ?? "unknown"}, expected=${e.stxAddress ?? "none"}, active=${s ?? "unknown"}, call=${e.contractAddress}.${e.contractName}::${e.functionName}). If Xverse showed an error toast, note its exact text; if you approved a transaction, it may still broadcast.`
          ),
          { code: "XVERSE_SIGNING_TIMEOUT", stage: r }
        )
      );
    }, a0);
  });
  try {
    return await Promise.race([i(), a]);
  } finally {
    o && clearTimeout(o);
  }
}, Xg = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Xg(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, vE = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], LE = async (t) => {
  const e = he();
  if (Wr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!vl(e))
    return vE;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Xg(await Co(t, "supportedMethods"));
    console.info("[wallet:connect]", {
      stage: "CAPABILITIES",
      provider: "leather",
      supportedMethods: r
    });
    const s = n.filter((i) => r.includes(i));
    return s.length > 0 ? s : n;
  } catch (r) {
    return console.info("[wallet:connect]", {
      stage: "CAPABILITIES_UNAVAILABLE",
      provider: "leather",
      message: r instanceof Error ? r.message : String(r)
    }), n;
  }
}, CE = async (t) => {
  if (Wr(t))
    try {
      await i0(t, "wallet_disconnect");
    } catch {
    }
  const e = await LE(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await i0(t, r), i = pE(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), Wr(t) && Qi(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = Lo(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Os(s))
        return Re();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Re();
}, BE = async (t, e) => {
  const n = new no(rE, void 0, "", n0), r = new ys({ appConfig: n });
  return new Promise((s) => {
    I8(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: n0,
        userSession: r,
        onFinish: (i) => {
          s(gE(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Re());
        }
      },
      e
    );
  });
}, HE = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : he(), r = Gg(n);
  return r ? (e && n && Qh(n), r) : null;
}, _E = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return eg(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = ig, i = aE(s), o = document.body.style.overflow, a = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", c), r.remove();
    }, c = (u) => {
      u.key === "Escape" && (a(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (u) => {
      const f = HE(u, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof u == "string" ? u : he() ?? "provider-object",
        resolved: !!f,
        requestBridge: typeof (f == null ? void 0 : f.request) == "function"
      }), a(), n(f);
    }, r.cancelCallback = () => {
      a(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", c), document.body.appendChild(r);
  });
}, Zg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = he(), e = t ? Gg(t) : void 0;
  if (e)
    return e;
  const n = ns() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, ME = async (t) => {
  Kg();
  const e = await _E({});
  if (!e)
    return Re();
  if (typeof e.request == "function")
    try {
      const n = await CE(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Os(n))
        return Re();
      if (!Lo(n))
        throw n;
    }
  return BE(t, e);
}, UE = () => {
  const t = he();
  return vl(t) ? "leather" : Ds(t) ? "xverse" : t ? String(t) : void 0;
}, NE = async (t) => {
  const e = k1("wallet_connect");
  cs({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await ME(t);
    return n.isConnected && n.address ? (pc(n.address, UE()), bc(n.network), cs({ journey: e, step: "authorize", outcome: "success" })) : cs({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw cs({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: U1(n),
      error: n
    }), n;
  }
}, TE = async () => {
  const t = Zg();
  if (t && vl(he()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await Co(t, e);
        break;
      } catch (n) {
        if (Os(n) || Lo(n))
          continue;
      }
  $8(), Jh(), Yg(), pc(null), bc(null), cs({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, PE = (t, e) => {
  const n = Zg(), r = bE(t);
  return An(t.onProgress, "provider-selected"), !n || typeof n.request != "function" ? (An(t.onProgress, "legacy-request"), Uf(r, e)) : void $E(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Lo(s) && !Wr(n)) {
      Uf(r, n);
      return;
    }
    if (console.error("[wallet] contract call request failed", s), Os(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, DE = (t) => {
  const e = C1(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (pc(o.address), bc(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), a = await NE({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return a.isConnected ? (e.save(a), a) : o.isConnected ? o : a;
    },
    disconnect: async () => {
      await TE(), n();
    },
    getSession: r
  };
};
function kE(t, e, n) {
  var o;
  if (!n.isConnected || n.network !== "mainnet" || !((o = n.address) != null && o.startsWith("SP"))) throw Error("Connect a mainnet wallet first.");
  if (!e.length || e.length > 25 || e.some((a) => !Number.isSafeInteger(a.id) || a.id < 0 || typeof a.liked != "boolean") || new Set(e.map((a) => a.id)).size !== e.length) throw Error("Select 1–25 different songs.");
  const r = t.split("."), [s, i] = r;
  if (r.length !== 2 || !s.startsWith("SP") || !vr(s) || !/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(i)) throw Error("Invalid likes contract.");
  return { contractAddress: s, contractName: i, functionName: e.length === 1 ? "set-liked" : "set-likes", functionArgs: e.length === 1 ? [e0(e[0].id), t0(e[0].liked)] : [eE(e.map((a) => nE({ id: e0(a.id), liked: t0(a.liked) })))], network: new jd(), stxAddress: n.address, sponsored: !1, postConditionMode: zr.Deny, postConditions: [] };
}
function Qg(t, e, n) {
  return Array.isArray(t) ? [...new Set(t.map((r) => Number(r == null ? void 0 : r.tokenId)).filter((r) => Number.isSafeInteger(r) && e.has(r) && !n.has(r)))] : [];
}
const Fe = DE({ appName: "Xtrata Radio", appIcon: "/favicon.ico" }), bt = (t) => document.getElementById(t);
let Wt, En = [], vs = /* @__PURE__ */ new Map(), In = !1, Kn = !1, xn = 0;
const Ji = /* @__PURE__ */ new Map();
let Bl, Jg = "", tp = [];
const Qt = (t) => {
  bt("status").textContent = t;
}, OE = Date.now(), Si = [], Et = (t, e = {}) => {
  const n = { stage: t, elapsedMs: Date.now() - OE, ...e };
  console.info("[radio:likes]", n), Si.push(JSON.stringify(n)), Si.length > 100 && Si.shift();
  const r = document.getElementById("diagnostics");
  r && (r.textContent = Si.join(`
`));
}, FE = {
  "provider-selected": "Wallet provider selected. Preparing the request…",
  "account-read": "Checking the active Xverse account. The transaction prompt has not been requested yet…",
  "account-cached": "Verified wallet account available. Preparing the transaction…",
  "account-read-failed": "Xverse did not provide its account. Trying its connection flow…",
  "account-reconnect": "Waiting for Xverse to confirm account access. Open the extension and check for a connection request.",
  "signing-request": "Transaction approval requested. Open your wallet to review the songs and network fee.",
  "legacy-request": "Wallet popup requested. Check your extension and browser popup permissions."
};
Et("PAGE_READY", { version: "likes-debug-1" });
const Cr = () => `xtrata.radio.chain.pending:${Wt == null ? void 0 : Wt.contract}:${Fe.getSession().address}`, Ls = () => {
  try {
    return localStorage.getItem(Cr()) || Ji.get(Cr()) || "";
  } catch {
    return Ji.get(Cr()) || "";
  }
};
async function da(t = {}) {
  const e = await fetch("/radio/chain-likes?" + new URLSearchParams(t), { cache: "no-store", signal: AbortSignal.timeout(2e4) }), n = await e.json();
  if (!e.ok) throw Error(n.error || "Could not read on-chain likes.");
  return n;
}
function to() {
  const t = Fe.getSession(), e = t.isConnected && t.network === "mainnet" && Bl === t.address, n = !!Ls();
  let r = [];
  try {
    r = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]");
  } catch {
  }
  const s = Array.isArray(r) ? new Set(r.map((a) => String(a == null ? void 0 : a.tokenId))).size : 0, i = e && !Kn ? Qg(r, new Set(En.map((a) => a.id)), new Set([...vs].filter(([, a]) => a.liked).map(([a]) => a))).length : s;
  if (bt("import-offer").textContent = s ? i ? `You have ${i} saved favourites to review for on-chain import. ${e ? "Use the import button below." : "Connect your wallet to check which ones still need importing."} Nothing is published automatically.` : "All eligible saved favourites are already liked by this wallet on-chain." : "", bt("wallet").textContent = e ? `Wallet: ${t.address}` : "", bt("disconnect").disabled = !t.isConnected || In, bt("connect").disabled = In, bt("import").disabled = !(Wt != null && Wt.enabled) || !e || In || Kn || n, bt("pending").replaceChildren(), n) {
    const a = document.createElement("a");
    a.href = "https://explorer.hiro.so/txid/" + Ls() + "?chain=mainnet", a.target = "_blank", a.rel = "noopener", a.textContent = "Transaction pending — view on explorer. Use Refresh to check confirmation.", bt("pending").append(a);
  }
  const o = new URL(location.href).searchParams.get("id");
  bt("songs").replaceChildren();
  for (const a of [...En].sort((c, u) => +(String(u.id) === o) - +(String(c.id) === o))) {
    const c = document.createElement("tr"), u = document.createElement("td"), f = document.createElement("td"), l = document.createElement("td"), g = document.createElement("button");
    u.textContent = `#${a.id} · ${a.title}`;
    const h = vs.get(a.id);
    f.textContent = (h == null ? void 0 : h.total) ?? "—", g.textContent = h != null && h.liked ? "Unlike on-chain" : "Like on-chain", g.disabled = !e || !h || !(Wt != null && Wt.enabled) || In || Kn || n, g.onclick = () => ep([{ id: a.id, liked: !(h != null && h.liked) }]), l.append(g), c.append(u, f, l), bt("songs").append(c);
  }
}
function ep(t) {
  var e;
  Et("REVIEW_OPEN", { count: t.length }), Jg = Fe.getSession().address || "", tp = t, bt("choices").replaceChildren();
  for (const n of t) {
    const r = document.createElement("label"), s = document.createElement("input");
    s.type = "checkbox", s.checked = !0, s.dataset.id = String(n.id), r.append(s, document.createTextNode(`${n.liked ? "Like" : "Unlike"} #${n.id} · ${((e = En.find((i) => i.id === n.id)) == null ? void 0 : e.title) || ""}`)), bt("choices").append(r, document.createElement("br"));
  }
  bt("review-note").textContent = "Up to 25 songs per transaction. Already confirmed likes are skipped on import. Closing or cancelling this review sends nothing.", bt("review").showModal();
}
async function Bo() {
  Et("REFRESH_START");
  const t = ++xn;
  Kn = !0, vs.clear(), to();
  try {
    const e = await da();
    if (t !== xn) return;
    if (Wt = e, Et("CONFIG_READ", { enabled: !!Wt.enabled }), !Wt.enabled) {
      Qt("On-chain likes are not activated on this site yet. Your previous favourites remain saved in this browser; imports and new likes will become available after activation.");
      return;
    }
    const n = Fe.getSession(), r = n.network === "mainnet" ? n.address : void 0, s = await fetch("/radio/counts?range=all", { cache: "no-store" });
    if (!s.ok) throw Error("Song catalogue unavailable.");
    const i = await s.json();
    if (t !== xn) return;
    En = i.tracks;
    const o = /* @__PURE__ */ new Map();
    for (let c = 0; c < En.length; c += 25) {
      const u = await da({ ids: En.slice(c, c + 25).map((f) => f.id).join(","), ...r ? { wallet: r } : {} });
      if (t !== xn) return;
      if (u.contract !== Wt.contract) throw Error("Contract configuration changed. Refresh before continuing.");
      for (const f of u.rows) o.set(f.id, f);
    }
    if (t !== xn) return;
    vs = o, Bl = r, Et("STATES_READY", { tracks: En.length, connected: !!r }), Qt("Confirmed on-chain likes. Saved browser favourites are not included.");
    const a = Ls();
    if (a && r) {
      const c = await da({ txid: a, wallet: r });
      if (t !== xn) return;
      if (c.status === "confirmed" || c.status === "failed") {
        Ji.delete(Cr());
        try {
          localStorage.removeItem(Cr());
        } catch {
        }
        Qt(c.status === "confirmed" ? "Transaction confirmed. Refresh if the latest count has not appeared yet." : "Transaction failed; it did not change your on-chain likes. A network fee may still have been paid.");
      }
    }
  } catch (e) {
    t === xn && Qt(e instanceof Error ? e.message : "Unable to refresh.");
  } finally {
    t === xn && (Kn = !1, to());
  }
}
bt("connect").onclick = async () => {
  Et("CONNECT_CLICK");
  try {
    await Fe.connect(), Et("CONNECT_RETURNED", { connected: Fe.getSession().isConnected, network: Fe.getSession().network || "unknown" }), await Bo();
  } catch (t) {
    Et("CONNECT_FAILED"), Qt(String(t));
  }
};
bt("disconnect").onclick = async () => {
  await Fe.disconnect(), await Bo();
};
bt("refresh").onclick = () => void Bo();
bt("import").onclick = () => {
  Et("IMPORT_CLICK");
  try {
    const t = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]"), e = Qg(t, new Set(En.map((n) => n.id)), new Set([...vs].filter(([, n]) => n.liked).map(([n]) => n)));
    if (Et("IMPORT_FILTERED", { saved: Array.isArray(t) ? t.length : 0, eligible: e.length }), !e.length) {
      Qt("No unimported saved songs were found in this browser.");
      return;
    }
    ep(e.slice(0, 25).map((n) => ({ id: n, liked: !0 }))), e.length > 25 && (bt("review-note").textContent = `Showing the first 25 of ${e.length} remaining favourites. After confirmation, import again to review the next batch.`);
  } catch {
    Qt("Saved favourites could not be read.");
  }
};
bt("cancel").onclick = () => {
  Et("REVIEW_CANCEL"), bt("review").close();
};
bt("approve").onclick = async () => {
  if (Et("APPROVE_CLICK", { busy: In, loading: Kn, pending: !!Ls() }), In || Kn || Ls()) {
    Et("APPROVE_BLOCKED");
    return;
  }
  let t;
  const e = tp.filter((n) => {
    var r;
    return (r = bt("choices").querySelector(`input[data-id="${n.id}"]`)) == null ? void 0 : r.checked;
  });
  try {
    const n = Fe.getSession();
    if (n.address !== Jg || n.address !== Bl) throw Error("Wallet changed. Review these songs again.");
    const r = kE(Wt.contract, e, n), s = Cr();
    In = !0, to(), bt("review").close(), Qt("Review the network fee in your wallet. No platform fee or token transfer is requested."), Et("WALLET_CALL_START", { count: e.length, functionName: r.functionName });
    let i = "provider-selected";
    const o = Date.now();
    t = setInterval(() => {
      Et("WALLET_STILL_WAITING", { lastStage: i, waitingMs: Date.now() - o }), Qt("Still waiting for the wallet (" + i + "). Check the extension. Do not submit again while this request is pending. See the diagnostic log below.");
    }, 35e3), await new Promise((a, c) => PE({ ...r, onProgress: (u) => {
      i = u, Et("WALLET_PROGRESS", { walletStage: u }), Qt(FE[u]);
    }, onFinish: (u) => {
      Et("WALLET_FINISH", { hasTransactionId: !!u.txId });
      const f = String(u.txId || "");
      if (!/^(0x)?[0-9a-f]{64}$/i.test(f)) {
        c(Error("Wallet did not return a transaction ID. Check your wallet before trying again."));
        return;
      }
      const l = f.startsWith("0x") ? f : "0x" + f;
      Ji.set(s, l);
      try {
        localStorage.setItem(s, l);
      } catch {
        Qt("Transaction submitted: " + l + ". Save this ID; browser storage is unavailable.");
      }
      a();
    }, onCancel: () => {
      Et("WALLET_CANCEL"), c(Error("Cancelled. No on-chain change was requested."));
    }, onError: (u) => {
      Et("WALLET_ERROR"), c(u);
    } })), Qt("Submitted. Your totals will change after confirmation. Use Refresh to check progress.");
  } catch (n) {
    Et("APPROVAL_FAILED"), Qt(n instanceof Error ? n.message : "Wallet request failed.");
  } finally {
    t && clearInterval(t), Et("WALLET_FLOW_SETTLED"), In = !1, to();
  }
};
Bo();
const jE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", zE = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, RE = () => zE() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, VE = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, GE = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', np = class {
  constructor(t) {
    Y4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Qh(t), this.callback(go(t));
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
    var r, s, i, o, a, c, u, f, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = RE(), e = VE(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return V("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, V("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), V("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, V("div", { class: "flex flex-col space-y-[10px]" }, V("div", { class: "flex items-center" }, V("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), V("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, V("span", { class: "sr-only" }, "Close popup"), V("img", { src: jE }))), r ? V("p", null, "Select the wallet you want to connect to.") : V("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && V("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && V("div", { class: "mt-6" }, V("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), V("ul", { class: "space-y-3" }, this.installedProviders.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), V("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && V("div", { class: "mt-6" }, r ? V("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : V("div", { class: "mb-5 flex justify-between" }, V("p", { class: "text-sm font-medium" }, "Recommended wallets"), V("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, V("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), V("p", null, "What is a wallet? ", V("span", { class: "align-text-bottom text-[9px]" }, "↗")))), V("ul", { class: "space-y-3" }, n.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && V("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return H4(this);
  }
};
np.style = GE;
const KE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: np
}, Symbol.toStringTag, { value: "Module" }));
