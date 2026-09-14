var b1 = Object.defineProperty;
var y1 = (t, e, n) => e in t ? b1(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Oo = (t, e, n) => y1(t, typeof e != "symbol" ? e + "" : e, n);
const x1 = ["SP", "SM"], w1 = ["ST", "SN"], fc = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return x1.includes(n) ? "mainnet" : w1.includes(n) ? "testnet" : null;
}, S1 = () => {
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
}, m1 = () => typeof window > "u" || !window.localStorage ? S1() : window.localStorage, Fo = "xtrata.v15.1.wallet.session", Xl = "mainnet", Ei = { isConnected: !1 }, A1 = (t) => t.address ? fc(t.address) ?? t.network : t.network, o0 = (t) => !t.isConnected || !t.address ? { ...Ei } : A1(t) !== Xl ? { ...Ei } : {
  isConnected: !0,
  address: t.address,
  network: Xl,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, E1 = (t) => {
  if (!t)
    return { ...Ei };
  try {
    const e = JSON.parse(t);
    return o0(e);
  } catch {
    return { ...Ei };
  }
}, I1 = (t) => {
  const e = o0(t);
  return JSON.stringify(e);
}, $1 = (t) => {
  const e = m1();
  return {
    load: () => E1(e.getItem(Fo)),
    save: (n) => {
      e.setItem(Fo, I1(n));
    },
    clear: () => {
      e.removeItem(Fo);
    }
  };
};
function v1(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function L1(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${v1(r)}`;
  let i = 2166136261, o = 522970236;
  for (let c = 0; c < s.length; c += 1) {
    const u = s.charCodeAt(c);
    i = Math.imul(i ^ u, 16777619), o = Math.imul(o ^ (u << 5 | u >>> 3), 16777619);
  }
  const a = (c) => (c >>> 0).toString(16).padStart(8, "0");
  return (a(i) + a(o)).slice(0, 16);
}
function a0(t) {
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
function C1(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const jo = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function B1(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = jo(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = jo(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = jo(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function H1(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = a0(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const _1 = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", M1 = 20, Zl = "xt_tel_sid";
function Ii() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let zo = null;
function U1() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(Zl);
      return t || (t = Ii(), sessionStorage.setItem(Zl, t)), t;
    }
  } catch {
  }
  return zo || (zo = Ii()), zo;
}
let yr = {
  address: null,
  kind: null
}, c0 = null;
function hc(t, e) {
  if (!t) {
    yr = { address: null, kind: e ?? yr.kind };
    return;
  }
  yr = { address: t.trim(), kind: e ?? yr.kind };
}
function dc(t) {
  c0 = typeof t == "string" && t.length > 0 ? t : null;
}
const Ql = [];
class N1 {
  constructor(e, n) {
    Oo(this, "id", Ii());
    Oo(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function P1(t, e) {
  return new N1(t, e);
}
function os(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? a0(t.error) : void 0, i = t.error != null ? C1(t.error) : void 0, o = r ? L1(n, t.step, t.errorCode, s ?? "") : void 0, a = r ? B1(t.error) : void 0, c = {
      ...a ? { error: a } : {},
      ...t.context ?? {}
    };
    r && Ql.length && (c.breadcrumbs = Ql.slice(-M1));
    const u = {
      eventId: Ii(),
      ts: Date.now(),
      sessionId: U1(),
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
      appVersion: _1,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: yr.address,
      walletKind: yr.kind,
      network: c0,
      context: Object.keys(c).length ? c : void 0
    };
  } catch {
  }
}
const T1 = "https://browser.blockstack.org/auth", D1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, l0 = ["store_write"], k1 = "blockstack-session", O1 = {
  logLevel: "debug"
}, rr = {
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
Object.freeze(rr);
class Kr extends Error {
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
class F1 extends Kr {
  constructor(e, n = "") {
    super({ code: rr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Jl extends Kr {
  constructor(e = "") {
    super({ code: rr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Rs extends Kr {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: rr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class tu extends Kr {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: rr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class fa extends Kr {
  constructor(e) {
    super({ code: rr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class u0 extends Kr {
  constructor(e) {
    super({ code: rr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const eu = ["debug", "info", "warn", "error", "none"], ha = {};
for (let t = 0; t < eu.length; t++) {
  const e = eu[t];
  ha[e] = t;
}
class xr {
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
    return ha[O1.logLevel] <= ha[e];
  }
}
function j1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function z1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Vo(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function V1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function R1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function G1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = R1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    xr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = G1(s, t.toString(), n);
    throw xr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function En(t, e) {
  return pc(Ut(t), e);
}
function Ut(t) {
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
  if (Kt(t, Uint8Array))
    return BigInt(`0x${z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function K1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function nu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function $s(t, e = 8) {
  return (typeof t == "bigint" ? t : Ut(t)).toString(16).padStart(e * 2, "0");
}
function Qi(t) {
  return parseInt(t, 16);
}
function pc(t, e = 16) {
  const n = $s(t, e);
  return rt(n);
}
function W1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function q1(t, e) {
  return t & BigInt(1) << e;
}
function da(t) {
  return Y1(BigInt(`0x${z(t)}`), BigInt(t.byteLength * 8));
}
function Y1(t, e) {
  return q1(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const X1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += X1[n];
  return e;
}
function rt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = K1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function sr(t) {
  return new TextEncoder().encode(t);
}
function vs(t) {
  return new TextDecoder().decode(t);
}
function Z1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Q1(t) {
  return String.fromCharCode.apply(null, t);
}
function J1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ru(t) {
  if (t.some(J1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ve(...t) {
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
function Et(t) {
  return ve(...t.map((e) => typeof e == "number" ? ru([e]) : e instanceof Array ? ru(e) : e));
}
function Kt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const f0 = "https://api.mainnet.hiro.so", h0 = "https://api.testnet.hiro.so", d0 = "http://localhost:3999", t2 = "https://hub.blockstack.org", e2 = 33, Ro = 32;
function n2(t) {
  if (t.length < Ro * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ro * 2), r = t.slice(2 + Ro * 2);
  return {
    recoveryId: Qi(e),
    r: n,
    s: r
  };
}
function bc(t) {
  const e = typeof t == "string" ? rt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function r2(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function s2(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function i2(t, e) {
  return t[e];
}
function o2(t, e, n = 0) {
  return t[n] = e, t;
}
function a2(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Vn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const c2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function l2(t, e) {
  const n = {};
  return Object.assign(n, c2, e), await fetch(t, n);
}
function u2(t) {
  let e = l2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function f2(...t) {
  const { fetchLib: e, middlewares: n } = u2(t);
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
class Ji {
  constructor(e = l0.slice(), n = ((a) => (a = gc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = T1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ga(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function h2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function g0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function d2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ga(t.outputLen), ga(t.blockLen);
}
function g2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function p2(t, e) {
  g0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Un = {
  number: ga,
  bool: h2,
  bytes: g0,
  hash: d2,
  exists: g2,
  output: p2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Go = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), de = (t, e) => t << 32 - e | t >>> e, b2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!b2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function y2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function yc(t) {
  if (typeof t == "string" && (t = y2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let p0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ir(t) {
  const e = (r) => t().update(yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let b0 = class extends p0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Un.hash(e);
    const r = yc(n);
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
    return Un.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Un.exists(this), Un.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const to = (t, e, n) => new b0(t, e).update(n).digest();
to.create = (t, e) => new b0(t, e);
function x2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xc = class extends p0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Go(this.buffer);
  }
  update(e) {
    Un.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = yc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Go(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Un.exists(this), Un.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    x2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Go(e), c = this.outputLen;
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
const w2 = (t, e, n) => t & e ^ ~t & n, S2 = (t, e, n) => t & e ^ t & n ^ e & n, m2 = new Uint32Array([
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
]), Ke = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), We = new Uint32Array(64);
let y0 = class extends xc {
  constructor() {
    super(64, 32, 8, !1), this.A = Ke[0] | 0, this.B = Ke[1] | 0, this.C = Ke[2] | 0, this.D = Ke[3] | 0, this.E = Ke[4] | 0, this.F = Ke[5] | 0, this.G = Ke[6] | 0, this.H = Ke[7] | 0;
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
      We[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = We[l - 15], h = We[l - 2], b = de(g, 7) ^ de(g, 18) ^ g >>> 3, y = de(h, 17) ^ de(h, 19) ^ h >>> 10;
      We[l] = y + We[l - 7] + b + We[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = de(a, 6) ^ de(a, 11) ^ de(a, 25), h = f + g + w2(a, c, u) + m2[l] + We[l] | 0, y = (de(r, 2) ^ de(r, 13) ^ de(r, 22)) + S2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    We.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, A2 = class extends y0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Lr = ir(() => new y0());
ir(() => new A2());
const E2 = {}, x0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: E2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const nt = BigInt(0), pt = BigInt(1), wn = BigInt(2), cs = BigInt(3), su = BigInt(8), ot = Object.freeze({
  a: nt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: pt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), iu = (t, e) => (t + e / wn) / e, Gs = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ot, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -pt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = iu(i * t, e), c = iu(-r * t, e);
    let u = _(t - a * n - c * s, e), f = _(-a * r - c * i, e);
    const l = u > o, g = f > o;
    if (l && (u = e - u), g && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: f };
  }
}, le = 32, Rn = 32, w0 = 32, $i = le + 1, vi = 2 * le + 1;
function ou(t) {
  const { a: e, b: n } = ot, r = _(t * t), s = _(r * t);
  return _(s + e * t + n);
}
const Ks = ot.a === nt;
class wc extends Error {
  constructor(e) {
    super(e);
  }
}
function au(t) {
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
    const n = C2(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return st.toAffineBatch(e).map(st.fromAffine);
  }
  equals(e) {
    au(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = _(s * s), u = _(a * a), f = _(n * u), l = _(i * c), g = _(_(r * a) * u), h = _(_(o * s) * c);
    return f === l && g === h;
  }
  negate() {
    return new st(this.x, _(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = _(e * e), i = _(n * n), o = _(i * i), a = e + i, c = _(wn * (_(a * a) - s - o)), u = _(cs * s), f = _(u * u), l = _(f - wn * c), g = _(u * (c - l) - su * o), h = _(wn * n * r);
    return new st(l, g, h);
  }
  add(e) {
    au(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === nt || o === nt)
      return this;
    if (n === nt || r === nt)
      return e;
    const c = _(s * s), u = _(a * a), f = _(n * u), l = _(i * c), g = _(_(r * a) * u), h = _(_(o * s) * c), b = _(l - f), y = _(h - g);
    if (b === nt)
      return y === nt ? this.double() : st.ZERO;
    const A = _(b * b), L = _(b * A), C = _(f * A), p = _(y * y - L - wn * C), E = _(y * (C - p) - g * L), m = _(s * a * b);
    return new st(p, E, m);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = st.ZERO;
    if (typeof e == "bigint" && e === nt)
      return n;
    let r = uu(e);
    if (r === pt)
      return this;
    if (!Ks) {
      let l = n, g = this;
      for (; r > nt; )
        r & pt && (l = l.add(g)), g = g.double(), r >>= pt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Gs.splitScalar(r), c = n, u = n, f = this;
    for (; i > nt || a > nt; )
      i & pt && (c = c.add(f)), a & pt && (u = u.add(f)), f = f.double(), i >>= pt, a >>= pt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new st(_(u.x * Gs.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ks ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && pa.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = st.normalizeZ(s), pa.set(n, s)));
    let i = st.ZERO, o = st.BASE;
    const a = 1 + (Ks ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & u);
      e >>= l, b > c && (b -= f, e += pt);
      const y = h, A = h + Math.abs(b) - 1, L = g % 2 !== 0, C = b < 0;
      b === 0 ? o = o.add(Ws(L, s[y])) : i = i.add(Ws(C, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = uu(e), s, i;
    if (Ks) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Gs.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      f = Ws(o, f), g = Ws(c, g), g = new st(_(g.x * Gs.beta), g.y, g.z), s = f.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return st.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(st.ZERO);
    e == null && (e = i ? su : Wr(s));
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
function Ws(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const pa = /* @__PURE__ */ new WeakMap();
class J {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, pa.delete(this);
  }
  hasEvenY() {
    return this.y % wn === nt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = te(n ? e : e.subarray(1));
    if (!yi(r))
      throw new Error("Point is not on curve");
    const s = ou(r);
    let i = L2(s);
    const o = (i & pt) === pt;
    n ? o && (i = _(-i)) : (e[0] & 1) === 1 !== o && (i = _(-i));
    const a = new J(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = te(e.subarray(1, le + 1)), r = te(e.subarray(le + 1, le * 2 + 1)), s = new J(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Le(e), r = n.length, s = n[0];
    if (r === le)
      return this.fromCompressedHex(n);
    if (r === $i && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === vi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${$i} compressed bytes or ${vi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return J.BASE.multiply(Gn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = A0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Sc(Le(e)), { n: a } = ot, c = r === 2 || r === 3 ? s + a : s, u = Wr(c, a), f = _(-o * u, a), l = _(i * u, a), g = r & 1 ? "03" : "02", h = J.fromHex(g + Sn(c)), b = J.BASE.multiplyAndAddUnsafe(h, f, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return mn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Sn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Sn(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!yi(n) || !yi(r))
      throw new Error(e);
    const s = _(r * r), i = ou(n);
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
function cu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function lu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Cr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: te(n), left: t.subarray(e + 2) };
}
function I2(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Cr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = lu(t.subarray(2)), { data: r, left: s } = lu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Cr(s)}`);
  return { r: e, s: r };
}
class Jt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Cr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Jt(Li(s.slice(0, 64)), Li(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = I2(n ? e : mn(e));
    return new Jt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Hr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Hr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ot.n >> pt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Jt(this.r, _(-this.s, ot.n)) : this;
  }
  toDERRawBytes() {
    return mn(this.toDERHex());
  }
  toDERHex() {
    const e = cu(ss(this.s)), n = cu(ss(this.r)), r = e.length / 2, s = n.length / 2, i = ss(r), o = ss(s);
    return `30${ss(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return mn(this.toCompactHex());
  }
  toCompactHex() {
    return Sn(this.r) + Sn(this.s);
  }
}
function xn(...t) {
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
const $2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += $2[t[n]];
  return e;
}
const v2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Sn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(nt <= t && t < v2))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Br(t) {
  const e = mn(Sn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ss(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Li(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function mn(t) {
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
function te(t) {
  return Li(Cr(t));
}
function Le(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : mn(t);
}
function uu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Hr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function _(t, e = ot.P) {
  const n = t % e;
  return n >= nt ? n : e + n;
}
function ee(t, e) {
  const { P: n } = ot;
  let r = t;
  for (; e-- > nt; )
    r *= r, r %= n;
  return r;
}
function L2(t) {
  const { P: e } = ot, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = ee(u, cs) * u % e, l = ee(f, cs) * u % e, g = ee(l, wn) * c % e, h = ee(g, r) * g % e, b = ee(h, s) * h % e, y = ee(b, o) * b % e, A = ee(y, a) * y % e, L = ee(A, o) * b % e, C = ee(L, cs) * u % e, p = ee(C, i) * h % e, E = ee(p, n) * c % e, m = ee(E, wn);
  if (m * m % e !== t)
    throw new Error("Cannot find square root");
  return m;
}
function Wr(t, e = ot.P) {
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
function C2(t, e = ot.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === nt ? i : (n[a] = i, _(i * o, e)), pt), s = Wr(r, e);
  return t.reduceRight((i, o, a) => o === nt ? i : (n[a] = _(i * n[a], e), _(i * o, e)), s), n;
}
function B2(t) {
  const e = t.length * 8 - Rn * 8, n = te(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Sc(t, e = !1) {
  const n = B2(t);
  if (e)
    return n;
  const { n: r } = ot;
  return n >= r ? n - r : n;
}
let Ar, ls;
class S0 {
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
    return ls(this.k, ...e);
  }
  checkSync() {
    if (typeof ls != "function")
      throw new wc("hmacSha256Sync needs to be set");
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
    return xn(...n);
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
    return xn(...n);
  }
}
function Hr(t) {
  return nt < t && t < ot.n;
}
function yi(t) {
  return nt < t && t < ot.P;
}
function m0(t, e, n, r = !0) {
  const { n: s } = ot, i = Sc(t, !0);
  if (!Hr(i))
    return;
  const o = Wr(i, s), a = J.BASE.multiply(i), c = _(a.x, s);
  if (c === nt)
    return;
  const u = _(o * _(e + n * c, s), s);
  if (u === nt)
    return;
  let f = new Jt(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & pt);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Gn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Rn)
      throw new Error("Expected 32 bytes of private key");
    e = Li(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Rn)
      throw new Error("Expected 32 bytes of private key");
    e = te(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Hr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function mc(t) {
  return t instanceof J ? (t.assertValidity(), t) : J.fromHex(t);
}
function A0(t) {
  if (t instanceof Jt)
    return t.assertValidity(), t;
  try {
    return Jt.fromDER(t);
  } catch {
    return Jt.fromCompact(t);
  }
}
function Ls(t, e = !1) {
  return J.fromPrivateKey(t).toRawBytes(e);
}
function H2(t, e, n, r = !1) {
  return J.fromSignature(t, e, n).toRawBytes(r);
}
function fu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === $i || r === vi : n ? r === $i * 2 || r === vi * 2 : t instanceof J;
}
function Ac(t, e, n = !1) {
  if (fu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!fu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = mc(e);
  return r.assertValidity(), r.multiply(Gn(t)).toRawBytes(n);
}
function E0(t) {
  const e = t.length > le ? t.slice(0, le) : t;
  return te(e);
}
function _2(t) {
  const e = E0(t), n = _(e, ot.n);
  return I0(n < nt ? e : n);
}
function I0(t) {
  return Br(t);
}
function $0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Le(t), s = Gn(e), i = [I0(s), _2(r)];
  if (n != null) {
    n === !0 && (n = At.randomBytes(le));
    const c = Le(n);
    if (c.length !== le)
      throw new Error(`sign: Expected ${le} bytes of extra data`);
    i.push(c);
  }
  const o = xn(...i), a = E0(r);
  return { seed: o, m: a, d: s };
}
function v0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function M2(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $0(t, e, n.extraEntropy), o = new S0(w0, Rn);
  await o.reseed(r);
  let a;
  for (; !(a = m0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return v0(a, n);
}
function eo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $0(t, e, n.extraEntropy), o = new S0(w0, Rn);
  o.reseedSync(r);
  let a;
  for (; !(a = m0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return v0(a, n);
}
const U2 = { strict: !0 };
function N2(t, e, n, r = U2) {
  let s;
  try {
    s = A0(t), e = Le(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Sc(e);
  let c;
  try {
    c = mc(n);
  } catch {
    return !1;
  }
  const { n: u } = ot, f = Wr(o, u), l = _(a * f, u), g = _(i * f, u), h = J.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? _(h.x, u) === i : !1;
}
function Ci(t) {
  return _(te(t), ot.n);
}
class _r {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Le(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = te(n.subarray(0, 32)), s = te(n.subarray(32, 64));
    return new _r(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!yi(e) || !Hr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Sn(this.r) + Sn(this.s);
  }
  toRawBytes() {
    return mn(this.toHex());
  }
}
function P2(t) {
  return J.fromPrivateKey(t).toRawX();
}
class L0 {
  constructor(e, n, r = At.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Le(e);
    const { x: s, scalar: i } = this.getScalar(Gn(n));
    if (this.px = s, this.d = i, this.rand = Le(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = J.fromPrivateKey(e), r = n.hasEvenY() ? e : ot.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Br(e ^ te(n));
  }
  finalizeNonce(e) {
    const n = _(te(e), ot.n);
    if (n === nt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new _r(e.x, _(n + r * s, ot.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHash, o = this.initNonce(n, await i(yn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(yn.nonce, o, r, e)), f = Ci(await i(yn.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await H0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHashSync, o = this.initNonce(n, i(yn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(yn.nonce, o, r, e)), f = Ci(i(yn.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return _0(l, e, r) || this.error(), l;
  }
}
async function T2(t, e, n) {
  return new L0(t, e, n).calc();
}
function D2(t, e, n) {
  return new L0(t, e, n).calcSync();
}
function C0(t, e, n) {
  const r = t instanceof _r, s = r ? t : _r.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Le(e),
    P: mc(n)
  };
}
function B0(t, e, n, r) {
  const s = J.BASE.multiplyAndAddUnsafe(e, Gn(n), _(-r, ot.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function H0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = C0(t, e, n), a = Ci(await At.taggedHash(yn.challenge, Br(r), o.toRawX(), i));
    return B0(r, o, s, a);
  } catch {
    return !1;
  }
}
function _0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = C0(t, e, n), a = Ci(At.taggedHashSync(yn.challenge, Br(r), o.toRawX(), i));
    return B0(r, o, s, a);
  } catch (r) {
    if (r instanceof wc)
      throw r;
    return !1;
  }
}
const k2 = {
  Signature: _r,
  getPublicKey: P2,
  sign: T2,
  verify: H0,
  signSync: D2,
  verifySync: _0
};
J.BASE._setWindowSize(8);
const Wt = {
  node: x0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, yn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, qs = {}, At = {
  bytesToHex: Cr,
  hexToBytes: mn,
  concatBytes: xn,
  mod: _,
  invert: Wr,
  isValidPrivateKey(t) {
    try {
      return Gn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Br,
  _normalizePrivateKey: Gn,
  hashToPrivateKey: (t) => {
    t = Le(t);
    const e = Rn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = _(te(t), ot.n - pt) + pt;
    return Br(n);
  },
  randomBytes: (t = 32) => {
    if (Wt.web)
      return Wt.web.getRandomValues(new Uint8Array(t));
    if (Wt.node) {
      const { randomBytes: e } = Wt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => At.hashToPrivateKey(At.randomBytes(Rn + 8)),
  precompute(t = 8, e = J.BASE) {
    const n = e === J.BASE ? e : new J(e.x, e.y);
    return n._setWindowSize(t), n.multiply(cs), n;
  },
  sha256: async (...t) => {
    if (Wt.web) {
      const e = await Wt.web.subtle.digest("SHA-256", xn(...t));
      return new Uint8Array(e);
    } else if (Wt.node) {
      const { createHash: e } = Wt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Wt.web) {
      const n = await Wt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = xn(...e), s = await Wt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Wt.node) {
      const { createHmac: n } = Wt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = qs[t];
    if (n === void 0) {
      const r = await At.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = xn(r, r), qs[t] = n;
    }
    return At.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ar != "function")
      throw new wc("sha256Sync is undefined, you need to set it");
    let n = qs[t];
    if (n === void 0) {
      const r = Ar(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = xn(r, r), qs[t] = n;
    }
    return Ar(n, ...e);
  },
  _JacobianPoint: st
};
Object.defineProperties(At, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ar;
    },
    set(t) {
      Ar || (Ar = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ls;
    },
    set(t) {
      ls || (ls = t);
    }
  }
});
const O2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ot,
  Point: J,
  Signature: Jt,
  getPublicKey: Ls,
  getSharedSecret: Ac,
  recoverPublicKey: H2,
  schnorr: k2,
  sign: M2,
  signSync: eo,
  utils: At,
  verify: N2
}, Symbol.toStringTag, { value: "Module" }));
var Ft = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function M0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function U0(t) {
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
var Cs = {};
Cs.byteLength = R2;
var F2 = Cs.toByteArray = K2, j2 = Cs.fromByteArray = Y2, we = [], ne = [], z2 = typeof Uint8Array < "u" ? Uint8Array : Array, Ko = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var br = 0, V2 = Ko.length; br < V2; ++br)
  we[br] = Ko[br], ne[Ko.charCodeAt(br)] = br;
ne[45] = 62;
ne[95] = 63;
function N0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function R2(t) {
  var e = N0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function G2(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function K2(t) {
  var e, n = N0(t), r = n[0], s = n[1], i = new z2(G2(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ne[t.charCodeAt(c)] << 18 | ne[t.charCodeAt(c + 1)] << 12 | ne[t.charCodeAt(c + 2)] << 6 | ne[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ne[t.charCodeAt(c)] << 2 | ne[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ne[t.charCodeAt(c)] << 10 | ne[t.charCodeAt(c + 1)] << 4 | ne[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function W2(t) {
  return we[t >> 18 & 63] + we[t >> 12 & 63] + we[t >> 6 & 63] + we[t & 63];
}
function q2(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(W2(r));
  return s.join("");
}
function Y2(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(q2(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    we[e >> 2] + we[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    we[e >> 10] + we[e >> 4 & 63] + we[e << 2 & 63] + "="
  )), s.join("");
}
function X2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Z2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Q2() {
  if (X2())
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
    throw new Error(Z2);
  }
}
class J2 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(ve(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(ve(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class tb {
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
async function P0() {
  const t = await Q2();
  return t.name === "subtleCrypto" ? new tb(t.lib) : new J2(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function eb(t) {
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
var T0 = eb;
const nb = T0, rb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var sb = nb(rb);
const ib = /* @__PURE__ */ M0(sb), ob = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), D0 = Uint8Array.from({ length: 16 }, (t, e) => e), ab = D0.map((t) => (9 * t + 5) % 16);
let Ec = [D0], Ic = [ab];
for (let t = 0; t < 4; t++)
  for (let e of [Ec, Ic])
    e.push(e[t].map((n) => ob[n]));
const k0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cb = Ec.map((t, e) => t.map((n) => k0[e][n])), lb = Ic.map((t, e) => t.map((n) => k0[e][n])), ub = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ys = (t, e) => t << e | t >>> 32 - e;
function hu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xs = new Uint32Array(16);
let hb = class extends xc {
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
      Xs[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = ub[h], A = fb[h], L = Ec[h], C = Ic[h], p = cb[h], E = lb[h];
      for (let m = 0; m < 16; m++) {
        const N = Ys(r + hu(h, i, a, u) + Xs[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = Ys(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = Ys(s + hu(b, o, c, f) + Xs[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = Ys(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Xs.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const db = ir(() => new hb());
function gb(t) {
  return db(t);
}
const Zs = BigInt(2 ** 32 - 1), ba = BigInt(32);
function O0(t, e = !1) {
  return e ? { h: Number(t & Zs), l: Number(t >> ba & Zs) } : { h: Number(t >> ba & Zs) | 0, l: Number(t & Zs) | 0 };
}
function pb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = O0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const bb = (t, e) => BigInt(t >>> 0) << ba | BigInt(e >>> 0), yb = (t, e, n) => t >>> n, xb = (t, e, n) => t << 32 - n | e >>> n, wb = (t, e, n) => t >>> n | e << 32 - n, Sb = (t, e, n) => t << 32 - n | e >>> n, mb = (t, e, n) => t << 64 - n | e >>> n - 32, Ab = (t, e, n) => t >>> n - 32 | e << 64 - n, Eb = (t, e) => e, Ib = (t, e) => t, $b = (t, e, n) => t << n | e >>> 32 - n, vb = (t, e, n) => e << n | t >>> 32 - n, Lb = (t, e, n) => e << n - 32 | t >>> 64 - n, Cb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Bb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Hb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _b = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Mb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ub = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Nb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Pb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: O0,
  split: pb,
  toBig: bb,
  shrSH: yb,
  shrSL: xb,
  rotrSH: wb,
  rotrSL: Sb,
  rotrBH: mb,
  rotrBL: Ab,
  rotr32H: Eb,
  rotr32L: Ib,
  rotlSH: $b,
  rotlSL: vb,
  rotlBH: Lb,
  rotlBL: Cb,
  add: Bb,
  add3L: Hb,
  add3H: _b,
  add4L: Mb,
  add4H: Ub,
  add5H: Pb,
  add5L: Nb
}, [Tb, Db] = K.split([
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
].map((t) => BigInt(t))), qe = new Uint32Array(80), Ye = new Uint32Array(80);
let no = class extends xc {
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
      qe[p] = e.getUint32(n), Ye[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = qe[p - 15] | 0, m = Ye[p - 15] | 0, N = K.rotrSH(E, m, 1) ^ K.rotrSH(E, m, 8) ^ K.shrSH(E, m, 7), D = K.rotrSL(E, m, 1) ^ K.rotrSL(E, m, 8) ^ K.shrSL(E, m, 7), B = qe[p - 2] | 0, U = Ye[p - 2] | 0, x = K.rotrSH(B, U, 19) ^ K.rotrBH(B, U, 61) ^ K.shrSH(B, U, 6), I = K.rotrSL(B, U, 19) ^ K.rotrBL(B, U, 61) ^ K.shrSL(B, U, 6), H = K.add4L(D, I, Ye[p - 7], Ye[p - 16]), k = K.add4H(H, N, x, qe[p - 7], qe[p - 16]);
      qe[p] = k | 0, Ye[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = K.rotrSH(l, g, 14) ^ K.rotrSH(l, g, 18) ^ K.rotrBH(l, g, 41), m = K.rotrSL(l, g, 14) ^ K.rotrSL(l, g, 18) ^ K.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = K.add5L(C, m, D, Db[p], Ye[p]), U = K.add5H(B, L, E, N, Tb[p], qe[p]), x = B | 0, I = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), H = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = K.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = K.add3L(x, H, G);
      r = K.add3H(P, U, I, k), s = P | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = K.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = K.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = K.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = K.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = K.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = K.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    qe.fill(0), Ye.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, kb = class extends no {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ob = class extends no {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Fb = class extends no {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const jb = ir(() => new no());
ir(() => new kb());
ir(() => new Ob());
ir(() => new Fb());
function F0(t) {
  return Lr(t);
}
function zb(t) {
  return jb(t);
}
const Vb = 0;
At.hmacSha256Sync = (t, ...e) => {
  const n = to.create(Lr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Rb() {
  return z(At.randomPrivateKey());
}
function Gb(t) {
  const e = Lr(Lr(t));
  return ib.encode(ve(t, e).slice(0, t.length + 4));
}
function Kb(t, e) {
  return Gb(ve(new Uint8Array([t]), e.slice(0, 20)));
}
function j0(t, e = Vb) {
  const n = typeof t == "string" ? rt(t) : t, r = gb(F0(n));
  return Kb(e, r);
}
function z0(t) {
  const e = bc(t);
  return z(Ls(e.slice(0, 32), !0));
}
At.hmacSha256Sync = (t, ...e) => {
  const n = to.create(Lr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Bi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Bi || (Bi = {}));
async function Wb(t, e, n) {
  return await (await P0()).encrypt("aes-256-cbc", e, t, n);
}
async function qb(t, e, n) {
  return await (await P0()).decrypt("aes-256-cbc", e, t, n);
}
function V0(t, e) {
  return to(Lr, t, e);
}
function Yb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function R0(t) {
  const e = zb(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Xb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Zb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Bi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Bi.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Xb(t))
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
async function Qb(t, e, n, r) {
  const s = Zb(t);
  if (!s.result)
    throw s;
  const i = At.randomPrivateKey(), o = Ls(i, !0);
  let a = Ac(i, t, !0);
  a = a.slice(1);
  const c = R0(a), u = At.randomBytes(16), f = await Wb(u, c.encryptionKey, e), l = ve(u, o, f), g = V0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = z(f);
  else if (r === "base64")
    h = j2(f);
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
async function G0(t, e) {
  if (!e.ephemeralPK)
    throw new tu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ac(t, n, !0);
  r = r.slice(1);
  const s = R0(r), i = rt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = rt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = F2(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ve(i, rt(n), o), c = V0(s.hmacKey, a), u = rt(e.mac);
  if (!Yb(u, c))
    throw new tu("Decryption failed: failure in MAC check");
  const f = await qb(i, s.encryptionKey, o);
  return e.wasString ? vs(f) : f;
}
function Jb(t, e) {
  const n = typeof e == "string" ? sr(e) : e, r = z0(t), s = F0(n), i = eo(s, t);
  return {
    signature: z(i),
    publicKey: r
  };
}
async function ty(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = z0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? sr(t) : t, o = await Qb(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Jb(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function ey(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return G0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Nt = {}, Mr = {}, Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.decode = Dt.encode = Dt.unescape = Dt.escape = Dt.pad = void 0;
const K0 = Cs;
function $c(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Dt.pad = $c;
function W0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Dt.escape = W0;
function q0(t) {
  return $c(t).replace(/-/g, "+").replace(/_/g, "/");
}
Dt.unescape = q0;
function ny(t) {
  return W0((0, K0.fromByteArray)(new TextEncoder().encode(t)));
}
Dt.encode = ny;
function ry(t) {
  return new TextDecoder().decode((0, K0.toByteArray)($c(q0(t))));
}
Dt.decode = ry;
var ro = {}, so = {}, Y0 = {}, ze = {}, io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
io.crypto = void 0;
io.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = y, t.bytesToHex = C, t.hexToBytes = m, t.asyncLoop = D, t.utf8ToBytes = B, t.bytesToUtf8 = U, t.toBytes = x, t.kdfInputToBytes = I, t.concatBytes = H, t.checkOpts = k, t.createHasher = P, t.createOptHasher = Me, t.createXOFer = Re, t.randomBytes = fr;
  const e = io;
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
    for (let at = 0, Bt = 0; at < ut; at++, Bt += 2) {
      const es = E(S.charCodeAt(Bt)), Ds = E(S.charCodeAt(Bt + 1));
      if (es === void 0 || Ds === void 0) {
        const Lo = S[Bt] + S[Bt + 1];
        throw new Error('hex string expected, got non-hex character "' + Lo + '" at index ' + Bt);
      }
      dt[at] = es * 16 + Ds;
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
      const Bt = Date.now() - dt;
      Bt >= 0 && Bt < v || (await (0, t.nextTick)(), dt += Bt);
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
      const Bt = S[dt];
      ut.set(Bt, at), at += Bt.length;
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
  function P(S) {
    const v = (dt) => S().update(x(dt)).digest(), ut = S();
    return v.outputLen = ut.outputLen, v.blockLen = ut.blockLen, v.create = () => S(), v;
  }
  function Me(S) {
    const v = (dt, at) => S(at).update(x(dt)).digest(), ut = S({});
    return v.outputLen = ut.outputLen, v.blockLen = ut.blockLen, v.create = (dt) => S(dt), v;
  }
  function Re(S) {
    const v = (dt, at) => S(at).update(x(dt)).digest(), ut = S({});
    return v.outputLen = ut.outputLen, v.blockLen = ut.blockLen, v.create = (dt) => S(dt), v;
  }
  t.wrapConstructor = P, t.wrapConstructorWithOpts = Me, t.wrapXOFConstructorWithOpts = Re;
  function fr(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(ze);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = ze;
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
})(Y0);
var Zt = {}, ft = {}, kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.SHA512_IV = kt.SHA384_IV = kt.SHA224_IV = kt.SHA256_IV = kt.HashMD = void 0;
kt.setBigUint64 = X0;
kt.Chi = sy;
kt.Maj = iy;
const ge = ze;
function X0(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function sy(t, e, n) {
  return t & e ^ ~t & n;
}
function iy(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class oy extends ge.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, ge.createView)(this.buffer);
  }
  update(e) {
    (0, ge.aexists)(this), e = (0, ge.toBytes)(e), (0, ge.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = (0, ge.createView)(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, ge.aexists)(this), (0, ge.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, ge.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    X0(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = (0, ge.createView)(e), c = this.outputLen;
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
kt.HashMD = oy;
kt.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
kt.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
kt.SHA384_IV = Uint32Array.from([
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
kt.SHA512_IV = Uint32Array.from([
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
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.toBig = V.shrSL = V.shrSH = V.rotrSL = V.rotrSH = V.rotrBL = V.rotrBH = V.rotr32L = V.rotr32H = V.rotlSL = V.rotlSH = V.rotlBL = V.rotlBH = V.add5L = V.add5H = V.add4L = V.add4H = V.add3L = V.add3H = void 0;
V.add = fh;
V.fromBig = vc;
V.split = Z0;
const Qs = /* @__PURE__ */ BigInt(2 ** 32 - 1), ya = /* @__PURE__ */ BigInt(32);
function vc(t, e = !1) {
  return e ? { h: Number(t & Qs), l: Number(t >> ya & Qs) } : { h: Number(t >> ya & Qs) | 0, l: Number(t & Qs) | 0 };
}
function Z0(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l: a } = vc(t[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const Q0 = (t, e) => BigInt(t >>> 0) << ya | BigInt(e >>> 0);
V.toBig = Q0;
const J0 = (t, e, n) => t >>> n;
V.shrSH = J0;
const th = (t, e, n) => t << 32 - n | e >>> n;
V.shrSL = th;
const eh = (t, e, n) => t >>> n | e << 32 - n;
V.rotrSH = eh;
const nh = (t, e, n) => t << 32 - n | e >>> n;
V.rotrSL = nh;
const rh = (t, e, n) => t << 64 - n | e >>> n - 32;
V.rotrBH = rh;
const sh = (t, e, n) => t >>> n - 32 | e << 64 - n;
V.rotrBL = sh;
const ih = (t, e) => e;
V.rotr32H = ih;
const oh = (t, e) => t;
V.rotr32L = oh;
const ah = (t, e, n) => t << n | e >>> 32 - n;
V.rotlSH = ah;
const ch = (t, e, n) => e << n | t >>> 32 - n;
V.rotlSL = ch;
const lh = (t, e, n) => e << n - 32 | t >>> 64 - n;
V.rotlBH = lh;
const uh = (t, e, n) => t << n - 32 | e >>> 64 - n;
V.rotlBL = uh;
function fh(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const hh = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
V.add3L = hh;
const dh = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
V.add3H = dh;
const gh = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
V.add4L = gh;
const ph = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
V.add4H = ph;
const bh = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
V.add5L = bh;
const yh = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0;
V.add5H = yh;
const ay = {
  fromBig: vc,
  split: Z0,
  toBig: Q0,
  shrSH: J0,
  shrSL: th,
  rotrSH: eh,
  rotrSL: nh,
  rotrBH: rh,
  rotrBL: sh,
  rotr32H: ih,
  rotr32L: oh,
  rotlSH: ah,
  rotlSL: ch,
  rotlBH: lh,
  rotlBL: uh,
  add: fh,
  add3L: hh,
  add3H: dh,
  add4L: gh,
  add4H: ph,
  add5H: yh,
  add5L: bh
};
V.default = ay;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.sha512_224 = ft.sha512_256 = ft.sha384 = ft.sha512 = ft.sha224 = ft.sha256 = ft.SHA512_256 = ft.SHA512_224 = ft.SHA384 = ft.SHA512 = ft.SHA224 = ft.SHA256 = void 0;
const F = kt, W = V, $t = ze, cy = /* @__PURE__ */ Uint32Array.from([
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
]), Xe = /* @__PURE__ */ new Uint32Array(64);
let Lc = class extends F.HashMD {
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
      Xe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Xe[l - 15], h = Xe[l - 2], b = (0, $t.rotr)(g, 7) ^ (0, $t.rotr)(g, 18) ^ g >>> 3, y = (0, $t.rotr)(h, 17) ^ (0, $t.rotr)(h, 19) ^ h >>> 10;
      Xe[l] = y + Xe[l - 7] + b + Xe[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, $t.rotr)(a, 6) ^ (0, $t.rotr)(a, 11) ^ (0, $t.rotr)(a, 25), h = f + g + (0, F.Chi)(a, c, u) + cy[l] + Xe[l] | 0, y = ((0, $t.rotr)(r, 2) ^ (0, $t.rotr)(r, 13) ^ (0, $t.rotr)(r, 22)) + (0, F.Maj)(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    (0, $t.clean)(Xe);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, $t.clean)(this.buffer);
  }
};
ft.SHA256 = Lc;
let xh = class extends Lc {
  constructor() {
    super(28), this.A = F.SHA224_IV[0] | 0, this.B = F.SHA224_IV[1] | 0, this.C = F.SHA224_IV[2] | 0, this.D = F.SHA224_IV[3] | 0, this.E = F.SHA224_IV[4] | 0, this.F = F.SHA224_IV[5] | 0, this.G = F.SHA224_IV[6] | 0, this.H = F.SHA224_IV[7] | 0;
  }
};
ft.SHA224 = xh;
const wh = W.split([
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
].map((t) => BigInt(t))), ly = wh[0], uy = wh[1], Ze = /* @__PURE__ */ new Uint32Array(80), Qe = /* @__PURE__ */ new Uint32Array(80);
let Bs = class extends F.HashMD {
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
      Ze[p] = e.getUint32(n), Qe[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = Ze[p - 15] | 0, m = Qe[p - 15] | 0, N = W.rotrSH(E, m, 1) ^ W.rotrSH(E, m, 8) ^ W.shrSH(E, m, 7), D = W.rotrSL(E, m, 1) ^ W.rotrSL(E, m, 8) ^ W.shrSL(E, m, 7), B = Ze[p - 2] | 0, U = Qe[p - 2] | 0, x = W.rotrSH(B, U, 19) ^ W.rotrBH(B, U, 61) ^ W.shrSH(B, U, 6), I = W.rotrSL(B, U, 19) ^ W.rotrBL(B, U, 61) ^ W.shrSL(B, U, 6), H = W.add4L(D, I, Qe[p - 7], Qe[p - 16]), k = W.add4H(H, N, x, Ze[p - 7], Ze[p - 16]);
      Ze[p] = k | 0, Qe[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = W.rotrSH(l, g, 14) ^ W.rotrSH(l, g, 18) ^ W.rotrBH(l, g, 41), m = W.rotrSL(l, g, 14) ^ W.rotrSL(l, g, 18) ^ W.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = W.add5L(C, m, D, uy[p], Qe[p]), U = W.add5H(B, L, E, N, ly[p], Ze[p]), x = B | 0, I = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), H = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = W.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = W.add3L(x, H, G);
      r = W.add3H(P, U, I, k), s = P | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = W.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = W.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = W.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = W.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = W.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    (0, $t.clean)(Ze, Qe);
  }
  destroy() {
    (0, $t.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
ft.SHA512 = Bs;
let Sh = class extends Bs {
  constructor() {
    super(48), this.Ah = F.SHA384_IV[0] | 0, this.Al = F.SHA384_IV[1] | 0, this.Bh = F.SHA384_IV[2] | 0, this.Bl = F.SHA384_IV[3] | 0, this.Ch = F.SHA384_IV[4] | 0, this.Cl = F.SHA384_IV[5] | 0, this.Dh = F.SHA384_IV[6] | 0, this.Dl = F.SHA384_IV[7] | 0, this.Eh = F.SHA384_IV[8] | 0, this.El = F.SHA384_IV[9] | 0, this.Fh = F.SHA384_IV[10] | 0, this.Fl = F.SHA384_IV[11] | 0, this.Gh = F.SHA384_IV[12] | 0, this.Gl = F.SHA384_IV[13] | 0, this.Hh = F.SHA384_IV[14] | 0, this.Hl = F.SHA384_IV[15] | 0;
  }
};
ft.SHA384 = Sh;
const Ht = /* @__PURE__ */ Uint32Array.from([
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
]), _t = /* @__PURE__ */ Uint32Array.from([
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
let mh = class extends Bs {
  constructor() {
    super(28), this.Ah = Ht[0] | 0, this.Al = Ht[1] | 0, this.Bh = Ht[2] | 0, this.Bl = Ht[3] | 0, this.Ch = Ht[4] | 0, this.Cl = Ht[5] | 0, this.Dh = Ht[6] | 0, this.Dl = Ht[7] | 0, this.Eh = Ht[8] | 0, this.El = Ht[9] | 0, this.Fh = Ht[10] | 0, this.Fl = Ht[11] | 0, this.Gh = Ht[12] | 0, this.Gl = Ht[13] | 0, this.Hh = Ht[14] | 0, this.Hl = Ht[15] | 0;
  }
};
ft.SHA512_224 = mh;
let Ah = class extends Bs {
  constructor() {
    super(32), this.Ah = _t[0] | 0, this.Al = _t[1] | 0, this.Bh = _t[2] | 0, this.Bl = _t[3] | 0, this.Ch = _t[4] | 0, this.Cl = _t[5] | 0, this.Dh = _t[6] | 0, this.Dl = _t[7] | 0, this.Eh = _t[8] | 0, this.El = _t[9] | 0, this.Fh = _t[10] | 0, this.Fl = _t[11] | 0, this.Gh = _t[12] | 0, this.Gl = _t[13] | 0, this.Hh = _t[14] | 0, this.Hl = _t[15] | 0;
  }
};
ft.SHA512_256 = Ah;
ft.sha256 = (0, $t.createHasher)(() => new Lc());
ft.sha224 = (0, $t.createHasher)(() => new xh());
ft.sha512 = (0, $t.createHasher)(() => new Bs());
ft.sha384 = (0, $t.createHasher)(() => new Sh());
ft.sha512_256 = (0, $t.createHasher)(() => new Ah());
ft.sha512_224 = (0, $t.createHasher)(() => new mh());
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.sha224 = Zt.SHA224 = Zt.sha256 = Zt.SHA256 = void 0;
const oo = ft;
Zt.SHA256 = oo.SHA256;
Zt.sha256 = oo.sha256;
Zt.SHA224 = oo.SHA224;
Zt.sha224 = oo.sha224;
const fy = /* @__PURE__ */ U0(O2);
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.joseToDer = Ur.derToJose = void 0;
const Eh = Cs, Ih = Dt;
function Wo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const hy = {
  ES256: Wo(256),
  ES384: Wo(384),
  ES512: Wo(521)
};
function $h(t) {
  const e = hy[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Hi = 128, vh = 0, dy = 32, gy = 16, py = 2, Lh = gy | dy | vh << 6, _i = py | vh << 6;
function Ch(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Eh.toByteArray)((0, Ih.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function by(t, e) {
  const n = Ch(t), r = $h(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Lh)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Hi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== _i)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== _i)
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
  return b.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, Ih.escape)((0, Eh.fromByteArray)(b));
}
Ur.derToJose = by;
function du(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Hi && --r, r;
}
function yy(t, e) {
  t = Ch(t);
  const n = $h(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = du(t, 0, n), i = du(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Hi, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Lh, u ? f[l++] = c : (f[l++] = Hi | 1, f[l++] = c & 255), f[l++] = _i, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = _i, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
Ur.joseToDer = yy;
var Oe = {};
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.InvalidTokenError = Oe.MissingParametersError = void 0;
class xy extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Oe.MissingParametersError = xy;
class wy extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Oe.InvalidTokenError = wy;
Object.defineProperty(so, "__esModule", { value: !0 });
so.SECP256K1Client = void 0;
const Sy = Y0, my = Zt, xi = fy, gu = Ur, pu = Oe, bu = ze;
xi.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sy.hmac.create(my.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Bh {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bu.bytesToHex)(xi.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new pu.MissingParametersError("a signing input hash and private key are all required");
    const s = xi.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bu.bytesToHex)(s);
    if (r === "jose")
      return (0, gu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, gu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new pu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return xi.verify(n, e, r, { strict: !1 });
  }
}
so.SECP256K1Client = Bh;
Bh.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = so;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ro);
var Kn = {};
const Ay = /* @__PURE__ */ U0(x0);
var Ey = Ft && Ft.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.hashSha256Async = Kn.hashSha256 = void 0;
const Iy = Zt;
function Hh(t) {
  return (0, Iy.sha256)(t);
}
Kn.hashSha256 = Hh;
function $y(t) {
  return Ey(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Ay;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Hh(t));
    }
  });
}
Kn.hashSha256Async = $y;
var vy = Ft && Ft.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.TokenSigner = Mr.createUnsecuredToken = void 0;
const xa = Dt, yu = ro, Ly = Oe, xu = Kn;
function wa(t, e) {
  const n = [], r = xa.encode(JSON.stringify(e));
  n.push(r);
  const s = xa.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Cy(t) {
  return wa(t, { typ: "JWT", alg: "none" }) + ".";
}
Mr.createUnsecuredToken = Cy;
class By {
  constructor(e, n) {
    if (!(e && n))
      throw new Ly.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !yu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = yu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = wa(e, s), o = (0, xu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return vy(this, void 0, void 0, function* () {
      const s = this.header(r), i = wa(e, s), o = yield (0, xu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [xa.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Mr.TokenSigner = By;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.TokenVerifier = void 0;
const Hy = Dt, wu = ro, _y = Oe, Js = Kn;
class My {
  constructor(e, n) {
    if (!(e && n))
      throw new _y.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !wu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = wu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Js.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Js.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Hy.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Js.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Js.hashSha256)(r);
      return i(o);
    }
  }
}
ao.TokenVerifier = My;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
co.decodeToken = void 0;
const ti = Dt;
function Uy(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ti.decode(e[0])), r = JSON.parse(ti.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ti.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ti.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
co.decodeToken = Uy;
(function(t) {
  var e = Ft && Ft.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Ft && Ft.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Mr, t), n(ao, t), n(co, t), n(Oe, t), n(ro, t);
})(Nt);
function Ny(t) {
  return `did:btc-addr:${t}`;
}
function Py(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Jl("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Jl('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function _h(t) {
  if (t)
    return Py(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Ty = "1.4.0";
function Dy() {
  return Rb();
}
function ky(t, e, n, r = l0.slice(), s, i = j1().getTime(), o = {}) {
  const a = (h) => {
    const b = gc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: V1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Ty,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Nt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = j0(u);
  return c.iss = Ny(f), new Nt.TokenSigner("ES256k", t).sign(c);
}
async function Su(t, e) {
  const n = vs(rt(e)), r = JSON.parse(n), s = await G0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Oy(t) {
  const e = Nt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Nt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Fy(t) {
  const e = Nt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = _h(e.iss);
  if (n.length === 1) {
    if (j0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function jy(t) {
  const e = Nt.decodeToken(t).payload;
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
function zy(t) {
  const e = Nt.decodeToken(t).payload;
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
function Vy(t) {
  const e = [
    zy(t),
    jy(t),
    Oy(t),
    Fy(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const mu = "1.0.0";
class An {
  constructor(e) {
    this.version = mu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== mu)
      throw new fa(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new An(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Mh {
  constructor(e) {
    if (e) {
      const n = new An(e);
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
class Au extends Mh {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new An({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new u0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new An({})), !0;
  }
}
class Eu extends Mh {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = k1, !localStorage.getItem(this.key)) {
      const r = new An({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new u0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return An.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new An({})), !0;
  }
}
var gs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(gs || (gs = {}));
var Mi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mi || (Mi = {}));
gs.Mainnet;
var ke;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ke || (ke = {}));
var Ae;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ae || (Ae = {}));
ke.Mainnet;
const Uh = {
  chainId: gs.Mainnet,
  transactionVersion: ke.Mainnet,
  peerNetworkId: Mi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ae.MainnetSingleSig,
    multiSig: Ae.MainnetMultiSig
  },
  client: { baseUrl: f0 }
}, Sa = {
  chainId: gs.Testnet,
  transactionVersion: ke.Testnet,
  peerNetworkId: Mi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ae.TestnetSingleSig,
    multiSig: Ae.TestnetMultiSig
  },
  client: { baseUrl: h0 }
}, wi = {
  ...Sa,
  addressVersion: { ...Sa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: d0 }
}, Ry = {
  ...wi,
  addressVersion: { ...wi.addressVersion },
  client: { ...wi.client }
};
function Gy(t) {
  switch (t) {
    case "mainnet":
      return Uh;
    case "testnet":
      return Sa;
    case "devnet":
      return wi;
    case "mocknet":
      return Ry;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Nh(t) {
  return typeof t == "string" ? Gy(t) : t;
}
var Iu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Iu || (Iu = {}));
var $u;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})($u || ($u = {}));
var ie;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ie || (ie = {}));
const qo = ["onChainOnly", "offChainOnly", "any"];
qo[0] + "", ie.OnChainOnly, qo[1] + "", ie.OffChainOnly, qo[2] + "", ie.Any, ie.OnChainOnly + "", ie.OnChainOnly, ie.OffChainOnly + "", ie.OffChainOnly, ie.Any + "", ie.Any;
var vu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(vu || (vu = {}));
var Lu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Lu || (Lu = {}));
var Cu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Cu || (Cu = {}));
var De;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(De || (De = {}));
var Bu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bu || (Bu = {}));
var Hu;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Hu || (Hu = {}));
var _u;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(_u || (_u = {}));
var Mu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Mu || (Mu = {}));
var Uu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Uu || (Uu = {}));
var Nu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nu || (Nu = {}));
var Pu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Pu || (Pu = {}));
var Tu;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Tu || (Tu = {}));
var Du;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Du || (Du = {}));
function ma(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ky(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ph(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Wy(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ma(t.outputLen), ma(t.blockLen);
}
function qy(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Yy(t, e) {
  Ph(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Nn = {
  number: ma,
  bool: Ky,
  bytes: Ph,
  hash: Wy,
  exists: qy,
  output: Yy
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pe = (t, e) => t << 32 - e | t >>> e, Xy = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xy)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Zy(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cc(t) {
  if (typeof t == "string" && (t = Zy(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Th = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function or(t) {
  const e = (r) => t().update(Cc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Dh = class extends Th {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Nn.hash(e);
    const r = Cc(n);
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
    return Nn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Nn.exists(this), Nn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const kh = (t, e, n) => new Dh(t, e).update(n).digest();
kh.create = (t, e) => new Dh(t, e);
function Qy(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Bc = class extends Th {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Yo(this.buffer);
  }
  update(e) {
    Nn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Cc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Yo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Nn.exists(this), Nn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Qy(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Yo(e), c = this.outputLen;
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
const Jy = (t, e, n) => t & e ^ ~t & n, tx = (t, e, n) => t & e ^ t & n ^ e & n, ex = new Uint32Array([
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
]), Je = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), tn = new Uint32Array(64);
let Oh = class extends Bc {
  constructor() {
    super(64, 32, 8, !1), this.A = Je[0] | 0, this.B = Je[1] | 0, this.C = Je[2] | 0, this.D = Je[3] | 0, this.E = Je[4] | 0, this.F = Je[5] | 0, this.G = Je[6] | 0, this.H = Je[7] | 0;
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
      tn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = tn[l - 15], h = tn[l - 2], b = pe(g, 7) ^ pe(g, 18) ^ g >>> 3, y = pe(h, 17) ^ pe(h, 19) ^ h >>> 10;
      tn[l] = y + tn[l - 7] + b + tn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = pe(a, 6) ^ pe(a, 11) ^ pe(a, 25), h = f + g + Jy(a, c, u) + ex[l] + tn[l] | 0, y = (pe(r, 2) ^ pe(r, 13) ^ pe(r, 22)) + tx(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    tn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, nx = class extends Oh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Fh = or(() => new Oh());
or(() => new nx());
var qr = {}, Hc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ze;
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
})(Hc);
var Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.c32checkDecode = Wn.c32checkEncode = void 0;
const ku = Zt, Ou = ze, us = Hc;
function jh(t) {
  const e = (0, ku.sha256)((0, ku.sha256)((0, Ou.hexToBytes)(t)));
  return (0, Ou.bytesToHex)(e.slice(0, 4));
}
function rx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = jh(`${n}${e}`), s = (0, us.c32encode)(`${e}${r}`);
  return `${us.c32[t]}${s}`;
}
Wn.c32checkEncode = rx;
function sx(t) {
  t = (0, us.c32normalize)(t);
  const e = (0, us.c32decode)(t.slice(1)), n = t[0], r = us.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), jh(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Wn.c32checkDecode = sx;
var zh = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.decode = Nr.encode = void 0;
const Ui = Zt, Fu = ze, Vh = T0, Rh = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function ix(t, e = "00") {
  const n = typeof t == "string" ? (0, Fu.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Fu.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ui.sha256)((0, Ui.sha256)(new Uint8Array([...r, ...n])));
  return Vh(Rh).encode([...r, ...n, ...s.slice(0, 4)]);
}
Nr.encode = ix;
function ox(t) {
  const e = Vh(Rh).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ui.sha256)((0, Ui.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Nr.decode = ox;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Wn, n = Nr, r = ze;
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
})(zh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Hc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Wn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = zh;
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
})(qr);
function ax(t, e) {
  switch (e = Nh(e ?? Uh), t) {
    case De.P2PKH:
      switch (e.transactionVersion) {
        case ke.Mainnet:
          return Ae.MainnetSingleSig;
        case ke.Testnet:
          return Ae.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case De.P2SH:
    case De.P2SHNonSequential:
    case De.P2WPKH:
    case De.P2WSH:
    case De.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case ke.Mainnet:
          return Ae.MainnetMultiSig;
        case ke.Testnet:
          return Ae.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const cx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gh = Uint8Array.from({ length: 16 }, (t, e) => e), lx = Gh.map((t) => (9 * t + 5) % 16);
let _c = [Gh], Mc = [lx];
for (let t = 0; t < 4; t++)
  for (let e of [_c, Mc])
    e.push(e[t].map((n) => cx[n]));
const Kh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ux = _c.map((t, e) => t.map((n) => Kh[e][n])), fx = Mc.map((t, e) => t.map((n) => Kh[e][n])), hx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), dx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ei = (t, e) => t << e | t >>> 32 - e;
function ju(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ni = new Uint32Array(16);
let gx = class extends Bc {
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
      ni[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = hx[h], A = dx[h], L = _c[h], C = Mc[h], p = ux[h], E = fx[h];
      for (let m = 0; m < 16; m++) {
        const N = ei(r + ju(h, i, a, u) + ni[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = ei(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = ei(s + ju(b, o, c, f) + ni[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = ei(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ni.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const px = or(() => new gx()), ri = BigInt(2 ** 32 - 1), Aa = BigInt(32);
function Wh(t, e = !1) {
  return e ? { h: Number(t & ri), l: Number(t >> Aa & ri) } : { h: Number(t >> Aa & ri) | 0, l: Number(t & ri) | 0 };
}
function bx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Wh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yx = (t, e) => BigInt(t >>> 0) << Aa | BigInt(e >>> 0), xx = (t, e, n) => t >>> n, wx = (t, e, n) => t << 32 - n | e >>> n, Sx = (t, e, n) => t >>> n | e << 32 - n, mx = (t, e, n) => t << 32 - n | e >>> n, Ax = (t, e, n) => t << 64 - n | e >>> n - 32, Ex = (t, e, n) => t >>> n - 32 | e << 64 - n, Ix = (t, e) => e, $x = (t, e) => t, vx = (t, e, n) => t << n | e >>> 32 - n, Lx = (t, e, n) => e << n | t >>> 32 - n, Cx = (t, e, n) => e << n - 32 | t >>> 64 - n, Bx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Hx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _x = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Mx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ux = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Nx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Px = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Tx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: Wh,
  split: bx,
  toBig: yx,
  shrSH: xx,
  shrSL: wx,
  rotrSH: Sx,
  rotrSL: mx,
  rotrBH: Ax,
  rotrBL: Ex,
  rotr32H: Ix,
  rotr32L: $x,
  rotlSH: vx,
  rotlSL: Lx,
  rotlBH: Cx,
  rotlBL: Bx,
  add: Hx,
  add3L: _x,
  add3H: Mx,
  add4L: Ux,
  add4H: Nx,
  add5H: Tx,
  add5L: Px
}, [Dx, kx] = q.split([
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
].map((t) => BigInt(t))), en = new Uint32Array(80), nn = new Uint32Array(80);
let lo = class extends Bc {
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
      en[p] = e.getUint32(n), nn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = en[p - 15] | 0, m = nn[p - 15] | 0, N = q.rotrSH(E, m, 1) ^ q.rotrSH(E, m, 8) ^ q.shrSH(E, m, 7), D = q.rotrSL(E, m, 1) ^ q.rotrSL(E, m, 8) ^ q.shrSL(E, m, 7), B = en[p - 2] | 0, U = nn[p - 2] | 0, x = q.rotrSH(B, U, 19) ^ q.rotrBH(B, U, 61) ^ q.shrSH(B, U, 6), I = q.rotrSL(B, U, 19) ^ q.rotrBL(B, U, 61) ^ q.shrSL(B, U, 6), H = q.add4L(D, I, nn[p - 7], nn[p - 16]), k = q.add4H(H, N, x, en[p - 7], en[p - 16]);
      en[p] = k | 0, nn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = q.rotrSH(l, g, 14) ^ q.rotrSH(l, g, 18) ^ q.rotrBH(l, g, 41), m = q.rotrSL(l, g, 14) ^ q.rotrSL(l, g, 18) ^ q.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = q.add5L(C, m, D, kx[p], nn[p]), U = q.add5H(B, L, E, N, Dx[p], en[p]), x = B | 0, I = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), H = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = q.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = q.add3L(x, H, G);
      r = q.add3H(P, U, I, k), s = P | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = q.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = q.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = q.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = q.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = q.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    en.fill(0), nn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Ox = class extends lo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Fx = class extends lo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, jx = class extends lo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
or(() => new lo());
or(() => new Ox());
or(() => new Fx());
or(() => new jx());
var Ni = { exports: {} };
Ni.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", y = "[object Promise]", A = "[object RegExp]", L = "[object Set]", C = "[object String]", p = "[object Symbol]", E = "[object WeakMap]", m = "[object ArrayBuffer]", N = "[object DataView]", D = "[object Float32Array]", B = "[object Float64Array]", U = "[object Int8Array]", x = "[object Int16Array]", I = "[object Int32Array]", H = "[object Uint8Array]", k = "[object Uint8ClampedArray]", G = "[object Uint16Array]", P = "[object Uint32Array]", Me = /[\\^$.*+?()[\]{}|]/g, Re = /\w*$/, fr = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, v = {};
  v[i] = v[o] = v[m] = v[N] = v[a] = v[c] = v[D] = v[B] = v[U] = v[x] = v[I] = v[g] = v[h] = v[b] = v[A] = v[L] = v[C] = v[p] = v[H] = v[k] = v[G] = v[P] = !0, v[u] = v[f] = v[E] = !1;
  var ut = typeof Ft == "object" && Ft && Ft.Object === Object && Ft, dt = typeof self == "object" && self && self.Object === Object && self, at = ut || dt || Function("return this")(), Bt = e && !e.nodeType && e, es = Bt && !0 && t && !t.nodeType && t, Ds = es && es.exports === Bt;
  function Lo(d, w) {
    return d.set(w[0], w[1]), d;
  }
  function tp(d, w) {
    return d.add(w), d;
  }
  function ep(d, w) {
    for (var $ = -1, T = d ? d.length : 0; ++$ < T && w(d[$], $, d) !== !1; )
      ;
    return d;
  }
  function np(d, w) {
    for (var $ = -1, T = w.length, Ct = d.length; ++$ < T; )
      d[Ct + $] = w[$];
    return d;
  }
  function Ll(d, w, $, T) {
    for (var Ct = -1, zt = d ? d.length : 0; ++Ct < zt; )
      $ = w($, d[Ct], Ct, d);
    return $;
  }
  function rp(d, w) {
    for (var $ = -1, T = Array(d); ++$ < d; )
      T[$] = w($);
    return T;
  }
  function sp(d, w) {
    return d == null ? void 0 : d[w];
  }
  function Cl(d) {
    var w = !1;
    if (d != null && typeof d.toString != "function")
      try {
        w = !!(d + "");
      } catch {
      }
    return w;
  }
  function Bl(d) {
    var w = -1, $ = Array(d.size);
    return d.forEach(function(T, Ct) {
      $[++w] = [Ct, T];
    }), $;
  }
  function Co(d, w) {
    return function($) {
      return d(w($));
    };
  }
  function Hl(d) {
    var w = -1, $ = Array(d.size);
    return d.forEach(function(T) {
      $[++w] = T;
    }), $;
  }
  var ip = Array.prototype, op = Function.prototype, ks = Object.prototype, Bo = at["__core-js_shared__"], _l = function() {
    var d = /[^.]+$/.exec(Bo && Bo.keys && Bo.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Ml = op.toString, Ge = ks.hasOwnProperty, Os = ks.toString, ap = RegExp(
    "^" + Ml.call(Ge).replace(Me, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ul = Ds ? at.Buffer : void 0, Nl = at.Symbol, Pl = at.Uint8Array, cp = Co(Object.getPrototypeOf, Object), lp = Object.create, up = ks.propertyIsEnumerable, fp = ip.splice, Tl = Object.getOwnPropertySymbols, hp = Ul ? Ul.isBuffer : void 0, dp = Co(Object.keys, Object), Ho = gr(at, "DataView"), ns = gr(at, "Map"), _o = gr(at, "Promise"), Mo = gr(at, "Set"), Uo = gr(at, "WeakMap"), rs = gr(Object, "create"), gp = Hn(Ho), pp = Hn(ns), bp = Hn(_o), yp = Hn(Mo), xp = Hn(Uo), Dl = Nl ? Nl.prototype : void 0, kl = Dl ? Dl.valueOf : void 0;
  function Cn(d) {
    var w = -1, $ = d ? d.length : 0;
    for (this.clear(); ++w < $; ) {
      var T = d[w];
      this.set(T[0], T[1]);
    }
  }
  function wp() {
    this.__data__ = rs ? rs(null) : {};
  }
  function Sp(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function mp(d) {
    var w = this.__data__;
    if (rs) {
      var $ = w[d];
      return $ === r ? void 0 : $;
    }
    return Ge.call(w, d) ? w[d] : void 0;
  }
  function Ap(d) {
    var w = this.__data__;
    return rs ? w[d] !== void 0 : Ge.call(w, d);
  }
  function Ep(d, w) {
    var $ = this.__data__;
    return $[d] = rs && w === void 0 ? r : w, this;
  }
  Cn.prototype.clear = wp, Cn.prototype.delete = Sp, Cn.prototype.get = mp, Cn.prototype.has = Ap, Cn.prototype.set = Ep;
  function Ue(d) {
    var w = -1, $ = d ? d.length : 0;
    for (this.clear(); ++w < $; ) {
      var T = d[w];
      this.set(T[0], T[1]);
    }
  }
  function Ip() {
    this.__data__ = [];
  }
  function $p(d) {
    var w = this.__data__, $ = Fs(w, d);
    if ($ < 0)
      return !1;
    var T = w.length - 1;
    return $ == T ? w.pop() : fp.call(w, $, 1), !0;
  }
  function vp(d) {
    var w = this.__data__, $ = Fs(w, d);
    return $ < 0 ? void 0 : w[$][1];
  }
  function Lp(d) {
    return Fs(this.__data__, d) > -1;
  }
  function Cp(d, w) {
    var $ = this.__data__, T = Fs($, d);
    return T < 0 ? $.push([d, w]) : $[T][1] = w, this;
  }
  Ue.prototype.clear = Ip, Ue.prototype.delete = $p, Ue.prototype.get = vp, Ue.prototype.has = Lp, Ue.prototype.set = Cp;
  function hr(d) {
    var w = -1, $ = d ? d.length : 0;
    for (this.clear(); ++w < $; ) {
      var T = d[w];
      this.set(T[0], T[1]);
    }
  }
  function Bp() {
    this.__data__ = {
      hash: new Cn(),
      map: new (ns || Ue)(),
      string: new Cn()
    };
  }
  function Hp(d) {
    return js(this, d).delete(d);
  }
  function _p(d) {
    return js(this, d).get(d);
  }
  function Mp(d) {
    return js(this, d).has(d);
  }
  function Up(d, w) {
    return js(this, d).set(d, w), this;
  }
  hr.prototype.clear = Bp, hr.prototype.delete = Hp, hr.prototype.get = _p, hr.prototype.has = Mp, hr.prototype.set = Up;
  function dr(d) {
    this.__data__ = new Ue(d);
  }
  function Np() {
    this.__data__ = new Ue();
  }
  function Pp(d) {
    return this.__data__.delete(d);
  }
  function Tp(d) {
    return this.__data__.get(d);
  }
  function Dp(d) {
    return this.__data__.has(d);
  }
  function kp(d, w) {
    var $ = this.__data__;
    if ($ instanceof Ue) {
      var T = $.__data__;
      if (!ns || T.length < n - 1)
        return T.push([d, w]), this;
      $ = this.__data__ = new hr(T);
    }
    return $.set(d, w), this;
  }
  dr.prototype.clear = Np, dr.prototype.delete = Pp, dr.prototype.get = Tp, dr.prototype.has = Dp, dr.prototype.set = kp;
  function Op(d, w) {
    var $ = To(d) || l1(d) ? rp(d.length, String) : [], T = $.length, Ct = !!T;
    for (var zt in d)
      Ge.call(d, zt) && !(Ct && (zt == "length" || i1(zt, T))) && $.push(zt);
    return $;
  }
  function Ol(d, w, $) {
    var T = d[w];
    (!(Ge.call(d, w) && Vl(T, $)) || $ === void 0 && !(w in d)) && (d[w] = $);
  }
  function Fs(d, w) {
    for (var $ = d.length; $--; )
      if (Vl(d[$][0], w))
        return $;
    return -1;
  }
  function Fp(d, w) {
    return d && Fl(w, Do(w), d);
  }
  function No(d, w, $, T, Ct, zt, Ne) {
    var Vt;
    if (T && (Vt = zt ? T(d, Ct, zt, Ne) : T(d)), Vt !== void 0)
      return Vt;
    if (!zs(d))
      return d;
    var Kl = To(d);
    if (Kl) {
      if (Vt = n1(d), !w)
        return Jp(d, Vt);
    } else {
      var pr = Bn(d), Wl = pr == f || pr == l;
      if (f1(d))
        return Kp(d, w);
      if (pr == b || pr == i || Wl && !zt) {
        if (Cl(d))
          return zt ? d : {};
        if (Vt = r1(Wl ? {} : d), !w)
          return t1(d, Fp(Vt, d));
      } else {
        if (!v[pr])
          return zt ? d : {};
        Vt = s1(d, pr, No, w);
      }
    }
    Ne || (Ne = new dr());
    var ql = Ne.get(d);
    if (ql)
      return ql;
    if (Ne.set(d, Vt), !Kl)
      var Yl = $ ? e1(d) : Do(d);
    return ep(Yl || d, function(ko, Vs) {
      Yl && (Vs = ko, ko = d[Vs]), Ol(Vt, Vs, No(ko, w, $, T, Vs, d, Ne));
    }), Vt;
  }
  function jp(d) {
    return zs(d) ? lp(d) : {};
  }
  function zp(d, w, $) {
    var T = w(d);
    return To(d) ? T : np(T, $(d));
  }
  function Vp(d) {
    return Os.call(d);
  }
  function Rp(d) {
    if (!zs(d) || a1(d))
      return !1;
    var w = Gl(d) || Cl(d) ? ap : fr;
    return w.test(Hn(d));
  }
  function Gp(d) {
    if (!zl(d))
      return dp(d);
    var w = [];
    for (var $ in Object(d))
      Ge.call(d, $) && $ != "constructor" && w.push($);
    return w;
  }
  function Kp(d, w) {
    if (w)
      return d.slice();
    var $ = new d.constructor(d.length);
    return d.copy($), $;
  }
  function Po(d) {
    var w = new d.constructor(d.byteLength);
    return new Pl(w).set(new Pl(d)), w;
  }
  function Wp(d, w) {
    var $ = w ? Po(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.byteLength);
  }
  function qp(d, w, $) {
    var T = w ? $(Bl(d), !0) : Bl(d);
    return Ll(T, Lo, new d.constructor());
  }
  function Yp(d) {
    var w = new d.constructor(d.source, Re.exec(d));
    return w.lastIndex = d.lastIndex, w;
  }
  function Xp(d, w, $) {
    var T = w ? $(Hl(d), !0) : Hl(d);
    return Ll(T, tp, new d.constructor());
  }
  function Zp(d) {
    return kl ? Object(kl.call(d)) : {};
  }
  function Qp(d, w) {
    var $ = w ? Po(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.length);
  }
  function Jp(d, w) {
    var $ = -1, T = d.length;
    for (w || (w = Array(T)); ++$ < T; )
      w[$] = d[$];
    return w;
  }
  function Fl(d, w, $, T) {
    $ || ($ = {});
    for (var Ct = -1, zt = w.length; ++Ct < zt; ) {
      var Ne = w[Ct], Vt = void 0;
      Ol($, Ne, Vt === void 0 ? d[Ne] : Vt);
    }
    return $;
  }
  function t1(d, w) {
    return Fl(d, jl(d), w);
  }
  function e1(d) {
    return zp(d, Do, jl);
  }
  function js(d, w) {
    var $ = d.__data__;
    return o1(w) ? $[typeof w == "string" ? "string" : "hash"] : $.map;
  }
  function gr(d, w) {
    var $ = sp(d, w);
    return Rp($) ? $ : void 0;
  }
  var jl = Tl ? Co(Tl, Object) : g1, Bn = Vp;
  (Ho && Bn(new Ho(new ArrayBuffer(1))) != N || ns && Bn(new ns()) != g || _o && Bn(_o.resolve()) != y || Mo && Bn(new Mo()) != L || Uo && Bn(new Uo()) != E) && (Bn = function(d) {
    var w = Os.call(d), $ = w == b ? d.constructor : void 0, T = $ ? Hn($) : void 0;
    if (T)
      switch (T) {
        case gp:
          return N;
        case pp:
          return g;
        case bp:
          return y;
        case yp:
          return L;
        case xp:
          return E;
      }
    return w;
  });
  function n1(d) {
    var w = d.length, $ = d.constructor(w);
    return w && typeof d[0] == "string" && Ge.call(d, "index") && ($.index = d.index, $.input = d.input), $;
  }
  function r1(d) {
    return typeof d.constructor == "function" && !zl(d) ? jp(cp(d)) : {};
  }
  function s1(d, w, $, T) {
    var Ct = d.constructor;
    switch (w) {
      case m:
        return Po(d);
      case a:
      case c:
        return new Ct(+d);
      case N:
        return Wp(d, T);
      case D:
      case B:
      case U:
      case x:
      case I:
      case H:
      case k:
      case G:
      case P:
        return Qp(d, T);
      case g:
        return qp(d, T, $);
      case h:
      case C:
        return new Ct(d);
      case A:
        return Yp(d);
      case L:
        return Xp(d, T, $);
      case p:
        return Zp(d);
    }
  }
  function i1(d, w) {
    return w = w ?? s, !!w && (typeof d == "number" || S.test(d)) && d > -1 && d % 1 == 0 && d < w;
  }
  function o1(d) {
    var w = typeof d;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? d !== "__proto__" : d === null;
  }
  function a1(d) {
    return !!_l && _l in d;
  }
  function zl(d) {
    var w = d && d.constructor, $ = typeof w == "function" && w.prototype || ks;
    return d === $;
  }
  function Hn(d) {
    if (d != null) {
      try {
        return Ml.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function c1(d) {
    return No(d, !0, !0);
  }
  function Vl(d, w) {
    return d === w || d !== d && w !== w;
  }
  function l1(d) {
    return u1(d) && Ge.call(d, "callee") && (!up.call(d, "callee") || Os.call(d) == i);
  }
  var To = Array.isArray;
  function Rl(d) {
    return d != null && h1(d.length) && !Gl(d);
  }
  function u1(d) {
    return d1(d) && Rl(d);
  }
  var f1 = hp || p1;
  function Gl(d) {
    var w = zs(d) ? Os.call(d) : "";
    return w == f || w == l;
  }
  function h1(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function zs(d) {
    var w = typeof d;
    return !!d && (w == "object" || w == "function");
  }
  function d1(d) {
    return !!d && typeof d == "object";
  }
  function Do(d) {
    return Rl(d) ? Op(d) : Gp(d);
  }
  function g1() {
    return [];
  }
  function p1() {
    return !1;
  }
  t.exports = c1;
})(Ni, Ni.exports);
var zx = Ni.exports;
const qh = /* @__PURE__ */ M0(zx);
var Ea;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ea || (Ea = {}));
function Vx(t, e) {
  return { type: Ea.Address, version: t, hash160: e };
}
function Rx(t) {
  return qr.c32address(t.version, t.hash160);
}
const Gx = (t) => px(Fh(t)), Kx = (t) => z(Gx(t));
At.hmacSha256Sync = (t, ...e) => {
  const n = kh.create(Fh, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Wx(t, e = "mainnet") {
  e = Nh(e), t = typeof t == "string" ? rt(t) : t;
  const n = ax(De.P2PKH, e), r = Vx(n, Kx(t));
  return Rx(r);
}
function qx(t, e) {
  const n = Nt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Wx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Nt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Yx(t, e = null) {
  let n;
  e ? n = qx(t, e) : n = Nt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const zu = "_blockstackDidCheckEchoReply", Xx = "echoReply", Zx = "authContinuation";
function Qx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Jx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[zu];
  if (typeof e == "boolean")
    return e;
  const n = Qx(t.location.search), r = n[Xx];
  if (r) {
    t[zu] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Zx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class ps {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Ji();
    else
      throw new F1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Eu(e.sessionOptions) : this.store = new Eu() : e ? this.store = new Au(e.sessionOptions) : this.store = new Au();
  }
  makeAuthRequestToken(e, n, r, s, i, o = z1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new fa("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, ky(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Dy();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Jx())
        return xr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      xr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = f2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Rs("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Nt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Vy(e))
      throw new Rs("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Vo(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Su(s, i.private_key);
          } catch {
            if (xr.warn("Failed decryption of appPrivateKey, will try to use as given"), !At.isValidPrivateKey(i.private_key))
              throw new Rs("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Su(s, c);
          } catch {
            xr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Rs("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = t2, f;
    Vo(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Vo(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: _h(i.iss),
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
        l.profile = Object.assign({}, D1);
      else {
        const b = await h.text(), y = JSON.parse(b);
        l.profile = Yx(y[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new fa("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ty(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ey(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
ps.prototype.makeAuthRequest = ps.prototype.makeAuthRequestToken;
const tw = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], ew = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = tw(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!uo(r.id));
  return e.concat(n);
}, uo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Uc = "STX_PROVIDER", fe = () => typeof window > "u" ? null : window.localStorage.getItem(Uc), Yh = (t) => {
  typeof window < "u" && window.localStorage.setItem(Uc, t);
}, Xh = () => {
  typeof window < "u" && window.localStorage.removeItem(Uc);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof Ft < "u" && Ft || {}, r = {
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
            var P = new AbortController();
            return P.signal;
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
            var k = H.split("="), G = k.shift().replace(/\+/g, " "), P = k.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(G), decodeURIComponent(P));
          }
        }), I;
      }
      function N(x) {
        var I = new f(), H = x.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(k) {
          return k.indexOf(`
`) === 0 ? k.substr(1, k.length) : k;
        }).forEach(function(k) {
          var G = k.split(":"), P = G.shift().trim();
          if (P) {
            var Me = G.join(":").trim();
            try {
              I.append(P, Me);
            } catch (Re) {
              console.warn("Response " + Re.message);
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
          var P = new XMLHttpRequest();
          function Me() {
            P.abort();
          }
          P.onload = function() {
            var S = {
              statusText: P.statusText,
              headers: N(P.getAllResponseHeaders() || "")
            };
            G.url.indexOf("file://") === 0 && (P.status < 200 || P.status > 599) ? S.status = 200 : S.status = P.status, S.url = "responseURL" in P ? P.responseURL : S.headers.get("X-Request-URL");
            var v = "response" in P ? P.response : P.responseText;
            setTimeout(function() {
              H(new D(v, S));
            }, 0);
          }, P.onerror = function() {
            setTimeout(function() {
              k(new TypeError("Network request failed"));
            }, 0);
          }, P.ontimeout = function() {
            setTimeout(function() {
              k(new TypeError("Network request timed out"));
            }, 0);
          }, P.onabort = function() {
            setTimeout(function() {
              k(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Re(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (P.open(G.method, Re(G.url), !0), G.credentials === "include" ? P.withCredentials = !0 : G.credentials === "omit" && (P.withCredentials = !1), "responseType" in P && (r.blob ? P.responseType = "blob" : r.arrayBuffer && (P.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof f || n.Headers && I.headers instanceof n.Headers)) {
            var fr = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(S) {
              fr.push(a(S)), P.setRequestHeader(S, c(I.headers[S]));
            }), G.headers.forEach(function(S, v) {
              fr.indexOf(v) === -1 && P.setRequestHeader(v, S);
            });
          } else
            G.headers.forEach(function(S, v) {
              P.setRequestHeader(v, S);
            });
          G.signal && (G.signal.addEventListener("abort", Me), P.onreadystatechange = function() {
            P.readyState === 4 && G.signal.removeEventListener("abort", Me);
          }), P.send(typeof G._bodyInit > "u" ? null : G._bodyInit);
        });
      }
      return U.polyfill = !0, n.fetch || (n.fetch = U, n.Headers = f, n.Request = E, n.Response = D), e.Headers = f, e.Request = E, e.Response = D, e.fetch = U, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Ft);
})();
const nw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function rw(t, e) {
  const n = {};
  return Object.assign(n, nw, e), await fetch(t, n);
}
function sw(t) {
  let e = rw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function iw(...t) {
  const { fetchLib: e, middlewares: n } = sw(t);
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
var Pr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pr || (Pr = {}));
var qn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qn || (qn = {}));
var Vu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Vu || (Vu = {}));
const ow = "https://api.mainnet.hiro.so", aw = "https://api.testnet.hiro.so", cw = "http://localhost:3999", lw = ["mainnet", "testnet", "devnet", "mocknet"];
let Yn = class {
  constructor(e) {
    this.version = qn.Mainnet, this.chainId = Pr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === qn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? iw();
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
Yn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ia();
    case "testnet":
      return new $a();
    case "devnet":
      return new uw();
    case "mocknet":
      return new Zh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${lw.join(", ")}`);
  }
};
Yn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Yn.fromName(t);
let Ia = class extends Yn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ow,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = qn.Mainnet, this.chainId = Pr.Mainnet;
  }
}, $a = class extends Yn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = qn.Testnet, this.chainId = Pr.Testnet;
  }
}, Zh = class extends Yn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = qn.Testnet, this.chainId = Pr.Testnet;
  }
};
const uw = Zh;
var Xn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Xn || (Xn = {}));
var Pi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pi || (Pi = {}));
Xn.Mainnet;
var Zn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Zn || (Zn = {}));
var Qn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Qn || (Qn = {}));
Zn.Mainnet;
const fw = {
  chainId: Xn.Mainnet,
  transactionVersion: Zn.Mainnet,
  peerNetworkId: Pi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Qn.MainnetSingleSig,
    multiSig: Qn.MainnetMultiSig
  },
  client: { baseUrl: f0 }
}, va = {
  chainId: Xn.Testnet,
  transactionVersion: Zn.Testnet,
  peerNetworkId: Pi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Qn.TestnetSingleSig,
    multiSig: Qn.TestnetMultiSig
  },
  client: { baseUrl: h0 }
}, Si = {
  ...va,
  addressVersion: { ...va.addressVersion },
  magicBytes: "id",
  client: { baseUrl: d0 }
}, hw = {
  ...Si,
  addressVersion: { ...Si.addressVersion },
  client: { ...Si.client }
};
function dw(t) {
  switch (t) {
    case "mainnet":
      return fw;
    case "testnet":
      return va;
    case "devnet":
      return Si;
    case "mocknet":
      return hw;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function gw(t) {
  return typeof t == "string" ? dw(t) : t;
}
function pw(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ru = /* @__PURE__ */ new Map();
function Qh(t, e) {
  const n = Ru.get(t);
  if (n !== void 0)
    return n(e);
  const r = pw(t);
  return Ru.set(t, r), Qh(t, e);
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
    return a2(this.readBytes(4), 0);
  }
  readUInt8() {
    return i2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return r2(this.readBytes(2), 0);
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
    if (Qh(e, r))
      return r;
    throw n(r);
  }
};
const bw = 128, yw = 128, Jh = 16, Fn = 32, La = 80, fo = 65, xw = 32, ww = 64, Ti = 34, Sw = 1 + 16 * 1024 * 1024, mw = 165, Aw = 16, Ew = 16, Iw = 20, $w = Ew + 2 + Iw, vw = $w + 4, Lw = Sw + (mw + Aw * vw);
var it;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var Ca;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ca || (Ca = {}));
var qt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(qt || (qt = {}));
const Xo = ["onChainOnly", "offChainOnly", "any"];
Xo[0] + "", qt.OnChainOnly, Xo[1] + "", qt.OffChainOnly, Xo[2] + "", qt.Any, qt.OnChainOnly + "", qt.OnChainOnly, qt.OffChainOnly + "", qt.OffChainOnly, qt.Any + "", qt.Any;
var Di;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Di || (Di = {}));
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
var fs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fs || (fs = {}));
var Ba;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ba || (Ba = {}));
var Ha;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ha || (Ha = {}));
var Ot;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ot || (Ot = {}));
var Gu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gu || (Gu = {}));
var _a;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(_a || (_a = {}));
var ae;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ae || (ae = {}));
var Ku;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ku || (Ku = {}));
let ho = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, wr = class extends ho {
  constructor(e) {
    super(e);
  }
}, Tt = class extends ho {
  constructor(e) {
    super(e);
  }
}, ki = class extends ho {
  constructor(e) {
    super(e);
  }
}, Pn = class extends ho {
  constructor(e) {
    super(e);
  }
};
function Ma(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Cw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function td(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Bw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ma(t.outputLen), Ma(t.blockLen);
}
function Hw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _w(t, e) {
  td(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Tn = {
  number: Ma,
  bool: Cw,
  bytes: td,
  hash: Bw,
  exists: Hw,
  output: _w
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), be = (t, e) => t << 32 - e | t >>> e, Mw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Mw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Uw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nc(t) {
  if (typeof t == "string" && (t = Uw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ed = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ar(t) {
  const e = (r) => t().update(Nc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let nd = class extends ed {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Tn.hash(e);
    const r = Nc(n);
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
    return Tn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Tn.exists(this), Tn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const rd = (t, e, n) => new nd(t, e).update(n).digest();
rd.create = (t, e) => new nd(t, e);
function Nw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Pc = class extends ed {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Zo(this.buffer);
  }
  update(e) {
    Tn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Zo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Tn.exists(this), Tn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Nw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Zo(e), c = this.outputLen;
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
const Pw = (t, e, n) => t & e ^ ~t & n, Tw = (t, e, n) => t & e ^ t & n ^ e & n, Dw = new Uint32Array([
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
]), rn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), sn = new Uint32Array(64);
let sd = class extends Pc {
  constructor() {
    super(64, 32, 8, !1), this.A = rn[0] | 0, this.B = rn[1] | 0, this.C = rn[2] | 0, this.D = rn[3] | 0, this.E = rn[4] | 0, this.F = rn[5] | 0, this.G = rn[6] | 0, this.H = rn[7] | 0;
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
      sn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = sn[l - 15], h = sn[l - 2], b = be(g, 7) ^ be(g, 18) ^ g >>> 3, y = be(h, 17) ^ be(h, 19) ^ h >>> 10;
      sn[l] = y + sn[l - 7] + b + sn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = be(a, 6) ^ be(a, 11) ^ be(a, 25), h = f + g + Pw(a, c, u) + Dw[l] + sn[l] | 0, y = (be(r, 2) ^ be(r, 13) ^ be(r, 22)) + Tw(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    sn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, kw = class extends sd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Tc = ar(() => new sd());
ar(() => new kw());
const Ow = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), id = Uint8Array.from({ length: 16 }, (t, e) => e), Fw = id.map((t) => (9 * t + 5) % 16);
let Dc = [id], kc = [Fw];
for (let t = 0; t < 4; t++)
  for (let e of [Dc, kc])
    e.push(e[t].map((n) => Ow[n]));
const od = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jw = Dc.map((t, e) => t.map((n) => od[e][n])), zw = kc.map((t, e) => t.map((n) => od[e][n])), Vw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Rw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), si = (t, e) => t << e | t >>> 32 - e;
function Wu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ii = new Uint32Array(16);
let Gw = class extends Pc {
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
      const b = 4 - h, y = Vw[h], A = Rw[h], L = Dc[h], C = kc[h], p = jw[h], E = zw[h];
      for (let m = 0; m < 16; m++) {
        const N = si(r + Wu(h, i, a, u) + ii[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = si(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = si(s + Wu(b, o, c, f) + ii[C[m]] + A, E[m]) + g | 0;
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
const Kw = ar(() => new Gw()), oi = BigInt(2 ** 32 - 1), Ua = BigInt(32);
function ad(t, e = !1) {
  return e ? { h: Number(t & oi), l: Number(t >> Ua & oi) } : { h: Number(t >> Ua & oi) | 0, l: Number(t & oi) | 0 };
}
function Ww(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ad(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const qw = (t, e) => BigInt(t >>> 0) << Ua | BigInt(e >>> 0), Yw = (t, e, n) => t >>> n, Xw = (t, e, n) => t << 32 - n | e >>> n, Zw = (t, e, n) => t >>> n | e << 32 - n, Qw = (t, e, n) => t << 32 - n | e >>> n, Jw = (t, e, n) => t << 64 - n | e >>> n - 32, tS = (t, e, n) => t >>> n - 32 | e << 64 - n, eS = (t, e) => e, nS = (t, e) => t, rS = (t, e, n) => t << n | e >>> 32 - n, sS = (t, e, n) => e << n | t >>> 32 - n, iS = (t, e, n) => e << n - 32 | t >>> 64 - n, oS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function aS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), fS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, hS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), dS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: ad,
  split: Ww,
  toBig: qw,
  shrSH: Yw,
  shrSL: Xw,
  rotrSH: Zw,
  rotrSL: Qw,
  rotrBH: Jw,
  rotrBL: tS,
  rotr32H: eS,
  rotr32L: nS,
  rotlSH: rS,
  rotlSL: sS,
  rotlBH: iS,
  rotlBL: oS,
  add: aS,
  add3L: cS,
  add3H: lS,
  add4L: uS,
  add4H: fS,
  add5H: dS,
  add5L: hS
}, [gS, pS] = Y.split([
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
].map((t) => BigInt(t))), on = new Uint32Array(80), an = new Uint32Array(80);
let go = class extends Pc {
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
      on[p] = e.getUint32(n), an[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = on[p - 15] | 0, m = an[p - 15] | 0, N = Y.rotrSH(E, m, 1) ^ Y.rotrSH(E, m, 8) ^ Y.shrSH(E, m, 7), D = Y.rotrSL(E, m, 1) ^ Y.rotrSL(E, m, 8) ^ Y.shrSL(E, m, 7), B = on[p - 2] | 0, U = an[p - 2] | 0, x = Y.rotrSH(B, U, 19) ^ Y.rotrBH(B, U, 61) ^ Y.shrSH(B, U, 6), I = Y.rotrSL(B, U, 19) ^ Y.rotrBL(B, U, 61) ^ Y.shrSL(B, U, 6), H = Y.add4L(D, I, an[p - 7], an[p - 16]), k = Y.add4H(H, N, x, on[p - 7], on[p - 16]);
      on[p] = k | 0, an[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = Y.rotrSH(l, g, 14) ^ Y.rotrSH(l, g, 18) ^ Y.rotrBH(l, g, 41), m = Y.rotrSL(l, g, 14) ^ Y.rotrSL(l, g, 18) ^ Y.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = Y.add5L(C, m, D, pS[p], an[p]), U = Y.add5H(B, L, E, N, gS[p], on[p]), x = B | 0, I = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), H = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Y.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = Y.add3L(x, H, G);
      r = Y.add3H(P, U, I, k), s = P | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Y.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Y.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Y.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = Y.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    on.fill(0), an.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, bS = class extends go {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yS = class extends go {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, xS = class extends go {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ar(() => new go());
ar(() => new bS());
const wS = ar(() => new yS());
ar(() => new xS());
var et;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(et || (et = {}));
var vt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(vt || (vt = {}));
function Oc(t) {
  return vt[t];
}
const SS = () => ({ type: et.BoolTrue }), mS = () => ({ type: et.BoolFalse }), AS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: et.Buffer, value: z(t) };
}, qu = BigInt("0xffffffffffffffffffffffffffffffff"), ES = BigInt(0), Yu = BigInt("0x7fffffffffffffffffffffffffffffff"), Xu = BigInt("-170141183460469231731687303715884105728"), IS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = da(rt(t))), Kt(t, Uint8Array) && (t = da(t));
  const e = Ut(t);
  if (e > Yu)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Yu}`);
  if (e < Xu)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Xu}`);
  return { type: et.Int, value: e };
}, $S = (t) => {
  const e = Ut(t);
  if (e < ES)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qu)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qu}`);
  return { type: et.UInt, value: e };
};
function vS(t) {
  return { type: et.List, value: t };
}
function cd() {
  return { type: et.OptionalNone };
}
function ld(t) {
  return { type: et.OptionalSome, value: t };
}
var M;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(M || (M = {}));
function LS() {
  return {
    type: M.Address,
    version: Qn.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Zu(t) {
  if (t && xd(t, Ti))
    throw new Error(`Memo exceeds maximum length of ${Ti} bytes`);
  return { type: M.MemoString, content: t };
}
function Fc(t, e) {
  return {
    type: M.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Na(t) {
  if (rt(t).byteLength != fo)
    throw Error("Invalid signature");
  return {
    type: M.MessageSignature,
    data: t
  };
}
function CS(t, e, n) {
  return typeof t == "string" && (t = RS(t)), typeof n == "string" && (n = Zu(n)), {
    type: M.Payload,
    payloadType: it.TokenTransfer,
    recipient: t,
    amount: Ut(e),
    memo: n ?? Zu("")
  };
}
function BS(t, e, n, r) {
  return typeof e == "string" && (e = he(e)), typeof n == "string" && (n = he(n)), {
    type: M.Payload,
    payloadType: it.ContractCall,
    contractAddress: typeof t == "string" ? Ln(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function HS(t) {
  return he(t, 4, 1e5);
}
function Qu(t, e, n) {
  return typeof t == "string" && (t = he(t)), typeof e == "string" && (e = HS(e)), typeof n == "number" ? {
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
function _S() {
  return { type: M.Payload, payloadType: it.PoisonMicroblock };
}
function Ju(t, e) {
  if (t.byteLength != Fn)
    throw Error(`Coinbase buffer size must be ${Fn} bytes`);
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
function MS(t, e, n) {
  if (t.byteLength != Fn)
    throw Error(`Coinbase buffer size must be ${Fn} bytes`);
  if (n.byteLength != La)
    throw Error(`VRF proof buffer size must be ${La} bytes`);
  return {
    type: M.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === et.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function US(t, e, n, r, s, i, o) {
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
function he(t, e, n) {
  const r = e || 1, s = n || bw;
  if (xd(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: M.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function NS(t, e, n) {
  return {
    type: M.Asset,
    address: Ln(t),
    contractName: he(e),
    assetName: he(n)
  };
}
function Ln(t) {
  const e = qr.c32addressDecode(t);
  return {
    type: M.Address,
    version: e[0],
    hash160: e[1]
  };
}
function PS(t, e) {
  const n = Ln(t), r = he(e);
  return {
    type: M.Principal,
    prefix: Ot.Contract,
    address: n,
    contractName: r
  };
}
function TS(t) {
  const e = Ln(t);
  return {
    type: M.Principal,
    prefix: Ot.Standard,
    address: e
  };
}
function Sr(t, e) {
  return {
    pubKeyEncoding: t,
    type: M.TransactionAuthField,
    contents: e
  };
}
function Pe(t) {
  switch (t.type) {
    case M.Address:
      return Hs(t);
    case M.Principal:
      return ud(t);
    case M.LengthPrefixedString:
      return Dr(t);
    case M.MemoString:
      return kS(t);
    case M.Asset:
      return hd(t);
    case M.PostCondition:
      return gd(t);
    case M.PublicKey:
      return Da(t);
    case M.LengthPrefixedList:
      return jc(t);
    case M.Payload:
      return pd(t);
    case M.TransactionAuthField:
      return VS(t);
    case M.MessageSignature:
      return zc(t);
  }
}
function Hs(t) {
  const e = [];
  return e.push(rt($s(t.version, 1))), e.push(rt(t.hash160)), Et(e);
}
function Tr(t) {
  const e = Kt(t, ht) ? t : new ht(t), n = Qi(z(e.readBytes(1))), r = z(e.readBytes(20));
  return { type: M.Address, version: n, hash160: r };
}
function ud(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ot.Standard || t.prefix === Ot.Contract) && e.push(Hs(t.address)), t.prefix === Ot.Contract && e.push(Dr(t.contractName)), Et(e);
}
function DS(t) {
  const e = Kt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(Ot, (i) => {
    throw new Tt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ot.Origin)
    return { type: M.Principal, prefix: n };
  const r = Tr(e);
  if (n === Ot.Standard)
    return { type: M.Principal, prefix: n, address: r };
  const s = re(e);
  return {
    type: M.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Dr(t) {
  const e = [], n = sr(t.content), r = n.byteLength;
  return e.push(rt($s(r, t.lengthPrefixBytes))), e.push(n), Et(e);
}
function re(t, e, n) {
  e = e || 1;
  const r = Kt(t, ht) ? t : new ht(t), s = Qi(z(r.readBytes(e))), i = vs(r.readBytes(s));
  return he(i, e, n ?? 128);
}
function kS(t) {
  const e = [], n = sr(t.content), r = dm(z(n), Ti * 2);
  return e.push(rt(r)), Et(e);
}
function fd(t) {
  const e = Kt(t, ht) ? t : new ht(t);
  let n = vs(e.readBytes(Ti));
  return n = n.replace(/\u0000*$/, ""), { type: M.MemoString, content: n };
}
function hd(t) {
  const e = [];
  return e.push(Hs(t.address)), e.push(Dr(t.contractName)), e.push(Dr(t.assetName)), Et(e);
}
function Pa(t) {
  const e = Kt(t, ht) ? t : new ht(t);
  return {
    type: M.Asset,
    address: Tr(e),
    contractName: re(e),
    assetName: re(e)
  };
}
function jc(t) {
  const e = t.values, n = [];
  n.push(rt($s(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Pe(r));
  return Et(n);
}
function dd(t, e, n) {
  const r = Kt(t, ht) ? t : new ht(t), s = Qi(z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case M.Address:
        i.push(Tr(r));
        break;
      case M.LengthPrefixedString:
        i.push(re(r));
        break;
      case M.MemoString:
        i.push(fd(r));
        break;
      case M.Asset:
        i.push(Pa(r));
        break;
      case M.PostCondition:
        i.push(FS(r));
        break;
      case M.PublicKey:
        i.push(ka(r));
        break;
      case M.TransactionAuthField:
        i.push(zS(r));
        break;
    }
  return Fc(i, n);
}
function OS(t) {
  return z(gd(t));
}
function gd(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ud(t.principal)), (t.conditionType === gt.Fungible || t.conditionType === gt.NonFungible) && e.push(hd(t.asset)), t.conditionType === gt.NonFungible && e.push(Ee(t.assetName)), e.push(t.conditionCode), t.conditionType === gt.STX || t.conditionType === gt.Fungible || t.conditionType === gt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new wr("The post-condition amount may not be larger than 8 bytes");
    e.push(En(t.amount, 8));
  }
  return Et(e);
}
function FS(t) {
  const e = Kt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(gt, (a) => {
    throw new Tt(`Could not read ${a} as PostConditionType`);
  }), r = DS(e);
  let s, i, o;
  switch (n) {
    case gt.STX:
      return s = e.readUInt8Enum(fs, (c) => {
        throw new Tt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: M.PostCondition,
        conditionType: gt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case gt.Fungible:
      return i = Pa(e), s = e.readUInt8Enum(fs, (c) => {
        throw new Tt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: M.PostCondition,
        conditionType: gt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case gt.NonFungible:
      i = Pa(e);
      const a = Se(e);
      return s = e.readUInt8Enum(Ba, (c) => {
        throw new Tt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: M.PostCondition,
        conditionType: gt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case gt.Staking:
      return s = e.readUInt8Enum(fs, (c) => {
        throw new Tt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: M.PostCondition,
        conditionType: gt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case gt.PoX: {
      const c = e.readUInt8Enum(Ha, (u) => {
        throw new Tt(`Could not read ${u} as PoxConditionCode`);
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
function pd(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case it.TokenTransfer:
      e.push(Ee(t.recipient)), e.push(En(t.amount, 8)), e.push(Pe(t.memo));
      break;
    case it.ContractCall:
      e.push(Pe(t.contractAddress)), e.push(Pe(t.contractName)), e.push(Pe(t.functionName));
      const n = new Uint8Array(4);
      Vn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ee(r));
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
      e.push(t.coinbaseBytes), e.push(Ee(t.recipient));
      break;
    case it.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ee(t.recipient ? ld(t.recipient) : cd())), e.push(t.vrfProof);
      break;
    case it.TenureChange:
      e.push(rt(t.tenureHash)), e.push(rt(t.previousTenureHash)), e.push(rt(t.burnViewHash)), e.push(rt(t.previousTenureEnd)), e.push(Vn(new Uint8Array(4), t.previousTenureBlocks)), e.push(o2(new Uint8Array(1), t.cause)), e.push(rt(t.publicKeyHash));
      break;
  }
  return Et(e);
}
function jS(t) {
  const e = Kt(t, ht) ? t : new ht(t);
  switch (e.readUInt8Enum(it, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case it.TokenTransfer:
      const r = Se(e), s = Ut(e.readBytes(8)), i = fd(e);
      return CS(r, s, i);
    case it.ContractCall:
      const o = Tr(e), a = re(e), c = re(e), u = [], f = e.readUInt32BE();
      for (let E = 0; E < f; E++) {
        const m = Se(e);
        u.push(m);
      }
      return BS(o, a, c, u);
    case it.SmartContract:
      const l = re(e), g = re(e, 4, 1e5);
      return Qu(l, g);
    case it.VersionedSmartContract: {
      const E = e.readUInt8Enum(Ca, (D) => {
        throw new Error(`Cannot recognize ClarityVersion: ${D}`);
      }), m = re(e), N = re(e, 4, Lw);
      return Qu(m, N, E);
    }
    case it.PoisonMicroblock:
      return _S();
    case it.Coinbase: {
      const E = e.readBytes(Fn);
      return Ju(E);
    }
    case it.CoinbaseToAltRecipient: {
      const E = e.readBytes(Fn), m = Se(e);
      return Ju(E, m);
    }
    case it.NakamotoCoinbase: {
      const E = e.readBytes(Fn), m = Se(e), N = e.readBytes(La);
      return MS(E, m, N);
    }
    case it.TenureChange:
      const h = z(e.readBytes(20)), b = z(e.readBytes(20)), y = z(e.readBytes(20)), A = z(e.readBytes(32)), L = e.readUInt32BE(), C = e.readUInt8Enum(_a, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), p = z(e.readBytes(20));
      return US(h, b, y, A, L, C, p);
  }
}
function Ta(t) {
  const e = Kt(t, ht) ? t : new ht(t);
  return Na(z(e.readBytes(fo)));
}
function zS(t) {
  const e = Kt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(ae, (r) => {
    throw new Tt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case ae.PublicKeyCompressed:
      return Sr(xt.Compressed, ka(e));
    case ae.PublicKeyUncompressed:
      return Sr(xt.Uncompressed, Yr(Im(ka(e).data)));
    case ae.SignatureCompressed:
      return Sr(xt.Compressed, Ta(e));
    case ae.SignatureUncompressed:
      return Sr(xt.Uncompressed, Ta(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function zc(t) {
  return rt(t.data);
}
function VS(t) {
  const e = [];
  switch (t.contents.type) {
    case M.PublicKey:
      e.push(t.pubKeyEncoding === xt.Compressed ? ae.PublicKeyCompressed : ae.PublicKeyUncompressed), e.push(rt(Em(t.contents.data)));
      break;
    case M.MessageSignature:
      e.push(t.pubKeyEncoding === xt.Compressed ? ae.SignatureCompressed : ae.SignatureUncompressed), e.push(zc(t.contents));
      break;
  }
  return Et(e);
}
function Da(t) {
  return t.data.slice();
}
function ka(t) {
  const e = Kt(t, ht) ? t : new ht(t), n = e.readUInt8(), r = n === 4 ? ww : xw;
  return Yr(Et([n, e.readBytes(r)]));
}
function Vc(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ct.P2PKH || e === ct.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ct.P2WPKH || e === ct.P2WSH || e === ct.P2WSHNonSequential) && !r.map((s) => s.data).every(Xr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ct.P2PKH:
      return ai(t, gm(r[0].data));
    case ct.P2WPKH:
      return ai(t, pm(r[0].data));
    case ct.P2SH:
    case ct.P2SHNonSequential:
      return ai(t, bm(n, r.map(Da)));
    case ct.P2WSH:
    case ct.P2WSHNonSequential:
      return ai(t, ym(n, r.map(Da)));
  }
}
function ai(t, e) {
  return { type: M.Address, version: t, hash160: e };
}
function Rc(t) {
  return qr.c32address(t.version, t.hash160);
}
function tf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return NS(e, n, r);
}
function is(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return PS(e, n);
  } else
    return TS(t);
}
function RS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return WS(e, n);
  } else
    return GS(t);
}
function GS(t) {
  const e = Ln(t);
  return { type: et.PrincipalStandard, value: Rc(e) };
}
function KS(t) {
  return { type: et.PrincipalStandard, value: Rc(t) };
}
function WS(t, e) {
  const n = Ln(t), r = he(e);
  return bd(n, r);
}
function bd(t, e) {
  if (sr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: et.PrincipalContract,
    value: `${Rc(t)}.${e.content}`
  };
}
function qS(t) {
  return { type: et.ResponseErr, value: t };
}
function YS(t) {
  return { type: et.ResponseOk, value: t };
}
const XS = (t) => ({ type: et.StringASCII, value: t }), ZS = (t) => ({ type: et.StringUTF8, value: t });
function QS(t) {
  for (const e in t)
    if (!xm(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: et.Tuple, value: t };
}
function Se(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ht(rt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ht(t) : e = t;
  switch (e.readUInt8Enum(vt, (r) => {
    throw new Tt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case vt.int:
      return IS(da(e.readBytes(16)));
    case vt.uint:
      return $S(e.readBytes(16));
    case vt.buffer:
      const r = e.readUInt32BE();
      return AS(e.readBytes(r));
    case vt.true:
      return SS();
    case vt.false:
      return mS();
    case vt.address:
      const s = Tr(e);
      return KS(s);
    case vt.contract:
      const i = Tr(e), o = re(e);
      return bd(i, o);
    case vt.ok:
      return YS(Se(e));
    case vt.err:
      return qS(Se(e));
    case vt.none:
      return cd();
    case vt.some:
      return ld(Se(e));
    case vt.list:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(Se(e));
      return vS(c);
    case vt.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = re(e).content;
        if (A === void 0)
          throw new Tt('"content" is undefined');
        f[A] = Se(e);
      }
      return QS(f);
    case vt.ascii:
      const l = e.readUInt32BE(), g = Q1(e.readBytes(l));
      return XS(g);
    case vt.utf8:
      const h = e.readUInt32BE(), b = vs(e.readBytes(h));
      return ZS(b);
    default:
      throw new Tt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Be(t, e) {
  return Et([Oc(t), e]);
}
function JS(t) {
  return new Uint8Array([Oc(t.type)]);
}
function tm(t) {
  return t.type === et.OptionalNone ? new Uint8Array([Oc(t.type)]) : Be(t.type, Ee(t.value));
}
function em(t) {
  const e = new Uint8Array(4);
  return Vn(e, Math.ceil(t.value.length / 2), 0), Be(t.type, ve(e, rt(t.value)));
}
function nm(t) {
  const e = pc(W1(BigInt(t.value), BigInt(yw)), Jh);
  return Be(t.type, e);
}
function rm(t) {
  const e = pc(BigInt(t.value), Jh);
  return Be(t.type, e);
}
function sm(t) {
  return Be(t.type, Hs(Ln(t.value)));
}
function im(t) {
  const [e, n] = wm(t.value);
  return Be(t.type, ve(Hs(Ln(e)), Dr(he(n))));
}
function om(t) {
  return Be(t.type, Ee(t.value));
}
function am(t) {
  const e = [], n = new Uint8Array(4);
  Vn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ee(r);
    e.push(s);
  }
  return Be(t.type, Et(e));
}
function cm(t) {
  const e = [], n = new Uint8Array(4);
  Vn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = he(s);
    e.push(Dr(i));
    const o = Ee(t.value[s]);
    e.push(o);
  }
  return Be(t.type, Et(e));
}
function yd(t, e) {
  const n = [], r = e == "ascii" ? Z1(t.value) : sr(t.value), s = new Uint8Array(4);
  return Vn(s, r.length, 0), n.push(s), n.push(r), Be(t.type, Et(n));
}
function lm(t) {
  return yd(t, "ascii");
}
function um(t) {
  return yd(t, "utf8");
}
function fm(t) {
  return z(Ee(t));
}
function Ee(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return JS(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return tm(t);
    case et.Buffer:
      return em(t);
    case et.UInt:
      return rm(t);
    case et.Int:
      return nm(t);
    case et.PrincipalStandard:
      return sm(t);
    case et.PrincipalContract:
      return im(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return om(t);
    case et.List:
      return am(t);
    case et.Tuple:
      return cm(t);
    case et.StringASCII:
      return lm(t);
    case et.StringUTF8:
      return um(t);
    default:
      throw new wr("Unable to serialize. Invalid Clarity Value.");
  }
}
const hm = (t) => t.length % 2 ? `0${t}` : t, dm = (t, e) => t.padEnd(e, "0"), xd = (t, e) => t ? sr(t).length > e : !1;
function Oa(t) {
  return qh(t);
}
const bs = (t) => Kw(Tc(t)), Gc = (t) => z(wS(t)), gm = (t) => z(bs(t)), pm = (t) => {
  const e = bs(t), n = ve(new Uint8Array([0]), new Uint8Array([e.length]), e), r = bs(n);
  return z(r);
}, bm = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Et(n), s = bs(r);
  return z(s);
}, ym = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Et(n), s = Tc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Et(i), a = bs(o);
  return z(a);
};
function xm(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function wm(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
At.hmacSha256Sync = (t, ...e) => {
  const n = rd.create(Tc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Yr(t) {
  return t = typeof t == "string" ? rt(t) : t, {
    type: M.PublicKey,
    data: t
  };
}
function Sm(t, e, n = xt.Compressed) {
  const r = n2(e), s = new Jt(nu(r.r), nu(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === xt.Compressed;
  return i.toHex(o);
}
function mm(t) {
  return typeof t == "string" ? t : z(t);
}
const Kc = mm;
function wd(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === e2;
}
function Xr(t) {
  return !Kc(t).startsWith("04");
}
function Am(t) {
  t = bc(t);
  const e = wd(t);
  return z(Ls(t.slice(0, 32), e));
}
function Em(t) {
  return J.fromHex(Kc(t)).toHex(!0);
}
function Im(t) {
  return J.fromHex(Kc(t)).toHex(!1);
}
function $m(t, e) {
  t = bc(t);
  const [n, r] = eo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return $s(r, 1) + Jt.fromHex(n).toCompactHex();
}
function Wc() {
  return {
    type: M.MessageSignature,
    data: z(new Uint8Array(fo))
  };
}
function Sd(t, e, n, r) {
  const s = Vc(0, t, 1, [Yr(e)]).hash160, i = Xr(e) ? xt.Compressed : xt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ut(n),
    fee: Ut(r),
    keyEncoding: i,
    signature: Wc()
  };
}
function ys(t) {
  return "signature" in t;
}
function ef(t) {
  return t === ct.P2SH || t === ct.P2WSH;
}
function vm(t) {
  return t === ct.P2SHNonSequential || t === ct.P2WSHNonSequential;
}
function nf(t) {
  const e = Oa(t);
  return e.nonce = 0, e.fee = 0, ys(e) ? e.signature = Wc() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Lm(t) {
  const e = [
    t.hashMode,
    rt(t.signer),
    En(t.nonce, 8),
    En(t.fee, 8),
    t.keyEncoding,
    zc(t.signature)
  ];
  return Et(e);
}
function Cm(t) {
  const e = [
    t.hashMode,
    rt(t.signer),
    En(t.nonce, 8),
    En(t.fee, 8)
  ], n = Fc(t.fields);
  e.push(jc(n));
  const r = new Uint8Array(2);
  return s2(r, t.signaturesRequired, 0), e.push(r), Et(e);
}
function Bm(t, e) {
  const n = z(e.readBytes(20)), r = BigInt(`0x${z(e.readBytes(8))}`), s = BigInt(`0x${z(e.readBytes(8))}`), i = e.readUInt8Enum(xt, (a) => {
    throw new Tt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ct.P2WPKH && i != xt.Compressed)
    throw new Tt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ta(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function Hm(t, e) {
  const n = z(e.readBytes(20)), r = BigInt("0x" + z(e.readBytes(8))), s = BigInt("0x" + z(e.readBytes(8))), i = dd(e, M.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case M.PublicKey:
        Xr(u.contents.data) || (o = !0);
        break;
      case M.MessageSignature:
        if (u.pubKeyEncoding === xt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Pn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ct.P2WSH || t === ct.P2WSHNonSequential))
    throw new Pn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Qo(t) {
  return ys(t) ? Lm(t) : Cm(t);
}
function Jo(t) {
  const e = t.readUInt8Enum(ct, (n) => {
    throw new Tt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ct.P2PKH || e === ct.P2WPKH ? Bm(e, t) : Hm(e, t);
}
function md(t, e, n, r) {
  const i = t + z(new Uint8Array([e])) + z(En(n, 8)) + z(En(r, 8));
  if (rt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Gc(rt(i));
}
function Ad(t, e, n) {
  const r = 33 + fo, s = Xr(e.data) ? xt.Compressed : xt.Uncompressed, i = t + hm(s.toString(16)) + n, o = rt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Gc(o);
}
function _m(t, e, n, r, s) {
  const i = md(t, e, n, r), o = $m(s, i), a = Yr(Am(s)), c = Ad(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ed(t, e, n, r, s, i) {
  const o = md(t, e, n, r), a = Yr(Sm(o, i, s)), c = Ad(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Mm() {
  const t = Sd(ct.P2PKH, "", 0, 0);
  return t.signer = LS().hash160, t.keyEncoding = xt.Compressed, t.signature = Wc(), t;
}
function rf(t, e, n) {
  return ys(t) ? Um(t, e, n) : Nm(t, e, n);
}
function Um(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ed(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Vc(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Pn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Nm(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case M.PublicKey:
        Xr(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case M.MessageSignature:
        c.pubKeyEncoding === xt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Ed(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (ef(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Pn("Too many signatures");
        break;
    }
  if (ef(t.hashMode) && o !== t.signaturesRequired || vm(t.hashMode) && o < t.signaturesRequired)
    throw new Pn("Incorrect number of signatures");
  if (i && (t.hashMode === ct.P2WSH || t.hashMode === ct.P2WSHNonSequential))
    throw new Pn("Uncompressed keys are not allowed in this hash mode");
  const a = Vc(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Pn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Id(t) {
  return {
    authType: St.Standard,
    spendingCondition: t
  };
}
function $d(t, e) {
  return {
    authType: St.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Sd(ct.P2PKH, "0".repeat(66), 0, 0)
  };
}
function sf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case St.Standard:
        return Id(nf(t.spendingCondition));
      case St.Sponsored:
        return $d(nf(t.spendingCondition), Mm());
      default:
        throw new ki("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Pm(t, e) {
  switch (t.authType) {
    case St.Standard:
      return rf(t.spendingCondition, e, St.Standard);
    case St.Sponsored:
      return rf(t.spendingCondition, e, St.Standard);
    default:
      throw new ki("Invalid origin auth type");
  }
}
function Tm(t, e) {
  switch (t.authType) {
    case St.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ut(e)
      };
      return { ...t, spendingCondition: n };
    case St.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ut(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Dm(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ut(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function km(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ut(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Om(t, e) {
  const n = {
    ...e,
    nonce: Ut(e.nonce),
    fee: Ut(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Fm(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case St.Standard:
      e.push(Qo(t.spendingCondition));
      break;
    case St.Sponsored:
      e.push(Qo(t.spendingCondition)), e.push(Qo(t.sponsorSpendingCondition));
      break;
  }
  return Et(e);
}
function jm(t) {
  const e = t.readUInt8Enum(St, (r) => {
    throw new Tt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case St.Standard:
      return n = Jo(t), Id(n);
    case St.Sponsored:
      n = Jo(t);
      const r = Jo(t);
      return $d(n, r);
  }
}
class zm {
  constructor({ auth: e, payload: n, postConditions: r = Fc([]), postConditionMode: s = Di.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = gw(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ut(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = qt.Any;
  }
  signBegin() {
    const e = Oa(this);
    return e.auth = sf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Oa(this);
    return e.auth = sf(e.auth), e.txid();
  }
  verifyOrigin() {
    return Pm(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Yr(e), r = this.auth.spendingCondition;
    if (r && !ys(r)) {
      const s = Xr(n.data);
      r.fields.push(Sr(s ? xt.Compressed : xt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = _m(n, r, e.fee, e.nonce, s);
    if (ys(e))
      e.signature = Na(i);
    else {
      const a = wd(s);
      e.fields.push(Sr(a ? xt.Compressed : xt.Uncompressed, Na(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Gc(e);
  }
  setSponsor(e) {
    if (this.auth.authType != St.Sponsored)
      throw new ki("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Om(this.auth, e);
  }
  setFee(e) {
    this.auth = Tm(this.auth, e);
  }
  setNonce(e) {
    this.auth = Dm(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != St.Sponsored)
      throw new ki("Cannot sponsor sign a non-sponsored transaction");
    this.auth = km(this.auth, e);
  }
  serialize() {
    return z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new wr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new wr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new wr('"auth" is undefined');
    if (this.payload === void 0)
      throw new wr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Vn(n, this.chainId, 0), e.push(n), e.push(Fm(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(jc(this.postConditions)), e.push(pd(this.payload)), Et(e);
  }
}
function Vm(t) {
  const e = Kt(t, ht) ? t : new ht(t), n = e.readUInt8Enum(Zn, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = jm(e), i = e.readUInt8Enum(qt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Di, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = dd(e, M.PostCondition), c = jS(e), u = new zm({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const of = BigInt("18446744073709551615");
function ta(t) {
  const e = Ut(t);
  if (e < 0n || e > of)
    throw new RangeError(`Post-condition amount must be between 0 and ${of} (u64 max), received: ${e}`);
  return e;
}
var Fa;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Fa || (Fa = {}));
var ja;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ja || (ja = {}));
function Rm(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.STX,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ot.Origin } : is(t.address),
        conditionCode: ci(t.condition),
        amount: ta(t.amount)
      };
    case "ft-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.Fungible,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ot.Origin } : is(t.address),
        conditionCode: ci(t.condition),
        amount: ta(t.amount),
        asset: tf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.NonFungible,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ot.Origin } : is(t.address),
        conditionCode: ci(t.condition),
        asset: tf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.Staking,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ot.Origin } : is(t.address),
        conditionCode: ci(t.condition),
        amount: ta(t.amount)
      };
    case "pox-postcondition":
      return {
        type: M.PostCondition,
        conditionType: gt.PoX,
        principal: t.address === "origin" ? { type: M.Principal, prefix: Ot.Origin } : is(t.address),
        conditionCode: Gm(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ci(t) {
  return Fa[t];
}
function Gm(t) {
  return ja[t];
}
function vd(t) {
  const e = Rm(t);
  return OS(e);
}
function Km(t, e, n) {
  return Yc(Ld(t), n);
}
function Ld(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xs(r);
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
    return BigInt(`0x${Ym(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qc(t, e = 8) {
  return (typeof t == "bigint" ? t : Ld(t)).toString(16).padStart(e * 2, "0");
}
function Yc(t, e = 16) {
  const n = qc(t, e);
  return xs(n);
}
function Wm(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const qm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ym(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += qm[n];
  return e;
}
function xs(t) {
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
function Xc(t) {
  return new TextEncoder().encode(t);
}
function Xm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Zm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function af(t) {
  if (t.some(Zm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Zc(...t) {
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
function Ve(t) {
  return Zc(...t.map((e) => typeof e == "number" ? af([e]) : e instanceof Array ? af(e) : e));
}
function po(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var za;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(za || (za = {}));
za.Mainnet;
const Qm = 128, Jm = 128, Cd = 16;
var Va;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Va || (Va = {}));
var cf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(cf || (cf = {}));
var lf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(lf || (lf = {}));
var oe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(oe || (oe = {}));
const ea = ["onChainOnly", "offChainOnly", "any"];
ea[0] + "", oe.OnChainOnly, ea[1] + "", oe.OffChainOnly, ea[2] + "", oe.Any, oe.OnChainOnly + "", oe.OnChainOnly, oe.OffChainOnly + "", oe.OffChainOnly, oe.Any + "", oe.Any;
var Ra;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ra || (Ra = {}));
Ra.Mainnet;
var uf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(uf || (uf = {}));
var _n;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_n || (_n = {}));
var ff;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ff || (ff = {}));
var hf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(hf || (hf = {}));
var df;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(df || (df = {}));
var gf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(gf || (gf = {}));
var pf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(pf || (pf = {}));
var bf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(bf || (bf = {}));
var Ga;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ga || (Ga = {}));
var yf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yf || (yf = {}));
var xf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xf || (xf = {}));
function Ka(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function t3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Bd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function e3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ka(t.outputLen), Ka(t.blockLen);
}
function n3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function r3(t, e) {
  Bd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const na = {
  number: Ka,
  bool: t3,
  bytes: Bd,
  hash: e3,
  exists: n3,
  output: r3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ra = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ye = (t, e) => t << 32 - e | t >>> e, s3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!s3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function i3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hd(t) {
  if (typeof t == "string" && (t = i3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let o3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cr(t) {
  const e = (r) => t().update(Hd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function a3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Qc = class extends o3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ra(this.buffer);
  }
  update(e) {
    na.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ra(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    na.exists(this), na.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    a3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ra(e), c = this.outputLen;
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
const c3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _d = Uint8Array.from({ length: 16 }, (t, e) => e), l3 = _d.map((t) => (9 * t + 5) % 16);
let Jc = [_d], tl = [l3];
for (let t = 0; t < 4; t++)
  for (let e of [Jc, tl])
    e.push(e[t].map((n) => c3[n]));
const Md = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), u3 = Jc.map((t, e) => t.map((n) => Md[e][n])), f3 = tl.map((t, e) => t.map((n) => Md[e][n])), h3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), d3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), li = (t, e) => t << e | t >>> 32 - e;
function wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ui = new Uint32Array(16);
let g3 = class extends Qc {
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
      ui[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = h3[h], A = d3[h], L = Jc[h], C = tl[h], p = u3[h], E = f3[h];
      for (let m = 0; m < 16; m++) {
        const N = li(r + wf(h, i, a, u) + ui[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = li(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = li(s + wf(b, o, c, f) + ui[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = li(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ui.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
cr(() => new g3());
const p3 = (t, e, n) => t & e ^ ~t & n, b3 = (t, e, n) => t & e ^ t & n ^ e & n, y3 = new Uint32Array([
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
]), cn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ln = new Uint32Array(64);
let Ud = class extends Qc {
  constructor() {
    super(64, 32, 8, !1), this.A = cn[0] | 0, this.B = cn[1] | 0, this.C = cn[2] | 0, this.D = cn[3] | 0, this.E = cn[4] | 0, this.F = cn[5] | 0, this.G = cn[6] | 0, this.H = cn[7] | 0;
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
      ln[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ln[l - 15], h = ln[l - 2], b = ye(g, 7) ^ ye(g, 18) ^ g >>> 3, y = ye(h, 17) ^ ye(h, 19) ^ h >>> 10;
      ln[l] = y + ln[l - 7] + b + ln[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = ye(a, 6) ^ ye(a, 11) ^ ye(a, 25), h = f + g + p3(a, c, u) + y3[l] + ln[l] | 0, y = (ye(r, 2) ^ ye(r, 13) ^ ye(r, 22)) + b3(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    ln.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, x3 = class extends Ud {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
cr(() => new Ud());
cr(() => new x3());
const fi = BigInt(2 ** 32 - 1), Wa = BigInt(32);
function Nd(t, e = !1) {
  return e ? { h: Number(t & fi), l: Number(t >> Wa & fi) } : { h: Number(t >> Wa & fi) | 0, l: Number(t & fi) | 0 };
}
function w3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Nd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S3 = (t, e) => BigInt(t >>> 0) << Wa | BigInt(e >>> 0), m3 = (t, e, n) => t >>> n, A3 = (t, e, n) => t << 32 - n | e >>> n, E3 = (t, e, n) => t >>> n | e << 32 - n, I3 = (t, e, n) => t << 32 - n | e >>> n, $3 = (t, e, n) => t << 64 - n | e >>> n - 32, v3 = (t, e, n) => t >>> n - 32 | e << 64 - n, L3 = (t, e) => e, C3 = (t, e) => t, B3 = (t, e, n) => t << n | e >>> 32 - n, H3 = (t, e, n) => e << n | t >>> 32 - n, _3 = (t, e, n) => e << n - 32 | t >>> 64 - n, M3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function U3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), P3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, T3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), D3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, k3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), O3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: Nd,
  split: w3,
  toBig: S3,
  shrSH: m3,
  shrSL: A3,
  rotrSH: E3,
  rotrSL: I3,
  rotrBH: $3,
  rotrBL: v3,
  rotr32H: L3,
  rotr32L: C3,
  rotlSH: B3,
  rotlSL: H3,
  rotlBH: _3,
  rotlBL: M3,
  add: U3,
  add3L: N3,
  add3H: P3,
  add4L: T3,
  add4H: D3,
  add5H: O3,
  add5L: k3
}, [F3, j3] = X.split([
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
].map((t) => BigInt(t))), un = new Uint32Array(80), fn = new Uint32Array(80);
let bo = class extends Qc {
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
      un[p] = e.getUint32(n), fn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = un[p - 15] | 0, m = fn[p - 15] | 0, N = X.rotrSH(E, m, 1) ^ X.rotrSH(E, m, 8) ^ X.shrSH(E, m, 7), D = X.rotrSL(E, m, 1) ^ X.rotrSL(E, m, 8) ^ X.shrSL(E, m, 7), B = un[p - 2] | 0, U = fn[p - 2] | 0, x = X.rotrSH(B, U, 19) ^ X.rotrBH(B, U, 61) ^ X.shrSH(B, U, 6), I = X.rotrSL(B, U, 19) ^ X.rotrBL(B, U, 61) ^ X.shrSL(B, U, 6), H = X.add4L(D, I, fn[p - 7], fn[p - 16]), k = X.add4H(H, N, x, un[p - 7], un[p - 16]);
      un[p] = k | 0, fn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = X.rotrSH(l, g, 14) ^ X.rotrSH(l, g, 18) ^ X.rotrBH(l, g, 41), m = X.rotrSL(l, g, 14) ^ X.rotrSL(l, g, 18) ^ X.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = X.add5L(C, m, D, j3[p], fn[p]), U = X.add5H(B, L, E, N, F3[p], un[p]), x = B | 0, I = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), H = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = X.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = X.add3L(x, H, G);
      r = X.add3H(P, U, I, k), s = P | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = X.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = X.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = X.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = X.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = X.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    un.fill(0), fn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, z3 = class extends bo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, V3 = class extends bo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, R3 = class extends bo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cr(() => new bo());
cr(() => new z3());
cr(() => new V3());
cr(() => new R3());
function G3(t, e, n) {
  const s = Qm;
  if (a4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Va.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Lt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Lt || (Lt = {}));
let K3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Pd = class extends K3 {
  constructor(e) {
    super(e);
  }
};
function yo(t) {
  const e = [];
  return e.push(xs(qc(t.version, 1))), e.push(xs(t.hash160)), Ve(e);
}
function W3(t) {
  const e = [];
  return e.push(t.prefix), e.push(yo(t.address)), t.prefix === Ga.Contract && e.push(ws(t.contractName)), Ve(e);
}
function ws(t) {
  const e = [], n = Xc(t.content), r = n.byteLength;
  return e.push(xs(qc(r, t.lengthPrefixBytes))), e.push(n), Ve(e);
}
function q3(t) {
  const e = [];
  return e.push(yo(t.address)), e.push(ws(t.contractName)), e.push(ws(t.assetName)), Ve(e);
}
function Td(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(W3(t.principal)), (t.conditionType === _n.Fungible || t.conditionType === _n.NonFungible) && e.push(q3(t.assetInfo)), t.conditionType === _n.NonFungible && e.push(Zr(t.assetName)), e.push(t.conditionCode), t.conditionType === _n.STX || t.conditionType === _n.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Pd("The post-condition amount may not be larger than 8 bytes");
    e.push(Km(t.amount, !1, 8));
  }
  return Ve(e);
}
function He(t, e) {
  return Ve([t, e]);
}
function Y3(t) {
  return new Uint8Array([t.type]);
}
function X3(t) {
  return t.type === Lt.OptionalNone ? new Uint8Array([t.type]) : He(t.type, Zr(t.value));
}
function Z3(t) {
  const e = new Uint8Array(4);
  return po(e, t.buffer.length, 0), He(t.type, Zc(e, t.buffer));
}
function Q3(t) {
  const e = Yc(Wm(t.value, BigInt(Jm)), Cd);
  return He(t.type, e);
}
function J3(t) {
  const e = Yc(t.value, Cd);
  return He(t.type, e);
}
function t4(t) {
  return He(t.type, yo(t.address));
}
function e4(t) {
  return He(t.type, Zc(yo(t.address), ws(t.contractName)));
}
function n4(t) {
  return He(t.type, Zr(t.value));
}
function r4(t) {
  const e = [], n = new Uint8Array(4);
  po(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Zr(r);
    e.push(s);
  }
  return He(t.type, Ve(e));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  po(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = G3(s);
    e.push(ws(i));
    const o = Zr(t.data[s]);
    e.push(o);
  }
  return He(t.type, Ve(e));
}
function Dd(t, e) {
  const n = [], r = e == "ascii" ? Xm(t.data) : Xc(t.data), s = new Uint8Array(4);
  return po(s, r.length, 0), n.push(s), n.push(r), He(t.type, Ve(n));
}
function i4(t) {
  return Dd(t, "ascii");
}
function o4(t) {
  return Dd(t, "utf8");
}
function Zr(t) {
  switch (t.type) {
    case Lt.BoolTrue:
    case Lt.BoolFalse:
      return Y3(t);
    case Lt.OptionalNone:
    case Lt.OptionalSome:
      return X3(t);
    case Lt.Buffer:
      return Z3(t);
    case Lt.UInt:
      return J3(t);
    case Lt.Int:
      return Q3(t);
    case Lt.PrincipalStandard:
      return t4(t);
    case Lt.PrincipalContract:
      return e4(t);
    case Lt.ResponseOk:
    case Lt.ResponseErr:
      return n4(t);
    case Lt.List:
      return r4(t);
    case Lt.Tuple:
      return s4(t);
    case Lt.StringASCII:
      return i4(t);
    case Lt.StringUTF8:
      return o4(t);
    default:
      throw new Pd("Unable to serialize. Invalid Clarity Value.");
  }
}
const a4 = (t, e) => t ? Xc(t).length > e : !1, c4 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function l4(t, e) {
  const n = {};
  return Object.assign(n, c4, e), await fetch(t, n);
}
function u4(t) {
  let e = l4, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function f4(...t) {
  const { fetchLib: e, middlewares: n } = u4(t);
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
var kr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(kr || (kr = {}));
var Jn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Jn || (Jn = {}));
var Sf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sf || (Sf = {}));
const h4 = "https://api.mainnet.hiro.so", d4 = "https://api.testnet.hiro.so", g4 = "http://localhost:3999", p4 = ["mainnet", "testnet", "devnet", "mocknet"];
class Or {
  constructor(e) {
    this.version = Jn.Mainnet, this.chainId = kr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Jn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? f4();
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
Or.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new kd();
    case "testnet":
      return new b4();
    case "devnet":
      return new y4();
    case "mocknet":
      return new Od();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${p4.join(", ")}`);
  }
};
Or.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Or.fromName(t);
class kd extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? h4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Jn.Mainnet, this.chainId = kr.Mainnet;
  }
}
class b4 extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? d4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Jn.Testnet, this.chainId = kr.Testnet;
  }
}
class Od extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? g4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Jn.Testnet, this.chainId = kr.Testnet;
  }
}
const y4 = Od, x4 = "connect-ui";
let mi, Fd, Yt = !1, qa = !1;
const Fe = (t, e = "") => () => {
}, w4 = (t, e) => () => {
}, S4 = "{visibility:hidden}.hydrated{visibility:inherit}", mf = {}, m4 = "http://www.w3.org/2000/svg", A4 = "http://www.w3.org/1999/xhtml", E4 = (t) => t != null, el = (t) => (t = typeof t, t === "object" || t === "function");
function jd(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const R = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !el(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ya(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = Ya(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Ya = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, I4 = {}, $4 = (t) => t && t.$tag$ === I4, v4 = (t, e) => t != null && !el(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, L4 = (t) => Qr(t).$hostElement$, C4 = (t, e, n) => {
  const r = Mt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Af = /* @__PURE__ */ new WeakMap(), B4 = (t, e, n) => {
  let r = Oi.get(t);
  Y4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Oi.set(t, r);
}, H4 = (t, e, n, r) => {
  var s;
  let i = zd(e);
  const o = Oi.get(i);
  if (t = t.nodeType === 11 ? t : Ie, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Af.get(t), c;
      if (a || Af.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Ie.createElement("style"), c.innerHTML = o;
          const u = (s = Mt.$nonce$) !== null && s !== void 0 ? s : jd(Ie);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, _4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Fe("attachStyles", e.$tagName$), i = H4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, zd = (t, e) => "sc-" + t.$tagName$, Ef = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = $f(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = If(n), f = If(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $f(xo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Mt.rel(t, e, n, !1), r && Mt.ael(t, e, r, !1);
    else {
      const c = el(r);
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
}, M4 = /\s/, If = (t) => t ? t.split(M4) : [], Vd = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || mf, o = e.$attrs$ || mf;
  for (r in i)
    r in o || Ef(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Ef(s, r, i[r], o[r], n, e.$flags$);
}, nl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Ie.createTextNode(s.$text$);
  else {
    if (Yt || (Yt = s.$tag$ === "svg"), o = s.$elm$ = Ie.createElementNS(Yt ? m4 : A4, s.$tag$), Yt && s.$tag$ === "foreignObject" && (Yt = !1), Vd(null, s, Yt), E4(mi) && o["s-si"] !== mi && o.classList.add(o["s-si"] = mi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = nl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Yt = !1 : o.tagName === "foreignObject" && (Yt = !0);
  }
  return o;
}, Rd = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Fd && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = nl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Gd = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, U4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : hi(a, f) ? (as(a, f), a = e[++s], f = r[++i]) : hi(c, l) ? (as(c, l), c = e[--o], l = r[--u]) : hi(a, l) ? (as(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : hi(c, f) ? (as(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = nl(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Rd(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Gd(e, s, o);
}, hi = (t, e) => t.$tag$ === e.$tag$, as = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Yt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Yt, Vd(t, e, Yt), r !== null && s !== null ? U4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Rd(n, null, e, s, 0, s.length - 1)) : r !== null && Gd(r, 0, r.length - 1), Yt && i === "svg" && (Yt = !1)) : t.$text$ !== o && (n.data = o);
}, N4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ya(null, null), s = $4(e) ? e : R(null, null, e);
  Fd = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, mi = n["s-sc"], as(r, s);
}, Kd = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, rl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Kd(t, t.$ancestorComponent$), Z4(() => P4(t, e));
}, P4 = (t, e) => {
  const n = Fe("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), O4(s, () => T4(t, r, e));
}, T4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Fe("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && _4(t);
  const o = Fe("render", t.$cmpMeta$.$tagName$);
  D4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => k4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, D4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, N4(t, e);
  } catch (r) {
    Ss(r, t.$hostElement$);
  }
  return null;
}, k4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Fe("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, qd(n), r(), t.$onReadyResolve$(n), s || Wd()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && il(() => rl(t, !1)), t.$flags$ &= -517;
}, Wd = (t) => {
  qd(Ie.documentElement), il(() => C4(xo, "appload", { detail: { namespace: x4 } }));
}, O4 = (t, e) => t && t.then ? t.then(e) : e(), qd = (t) => t.classList.add("hydrated"), F4 = (t, e) => Qr(t).$instanceValues$.get(e), j4 = (t, e, n, r) => {
  const s = Qr(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = v4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && rl(s, !1));
}, Yd = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return F4(this, i);
        },
        set(a) {
          j4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Mt.jmp(() => {
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
}, z4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = q4(n), s.then) {
        const c = w4();
        s = await s, c();
      }
      s.isProxied || (Yd(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Fe("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ss(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = zd(n);
      if (!Oi.has(c)) {
        const u = Fe("registerStyles", n.$tagName$);
        B4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => rl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, V4 = (t) => {
  if (!(Mt.$flags$ & 1)) {
    const e = Qr(t), n = e.$cmpMeta$, r = Fe("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Kd(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), z4(t, e, n);
    }
    r();
  }
}, R4 = (t) => {
  Mt.$flags$ & 1 || Qr(t);
}, G4 = (t, e = {}) => {
  var n;
  const r = Fe(), s = [], i = e.exclude || [], o = xo.customElements, a = Ie.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Ie.createElement("style"), f = [];
  let l, g = !0;
  Object.assign(Mt, e), Mt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ie.baseURI).href, t.map((h) => {
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
          super(C), C = this, W4(C, y), y.$flags$ & 1 && C.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? f.push(this) : Mt.jmp(() => V4(this));
        }
        disconnectedCallback() {
          Mt.jmp(() => R4(this));
        }
        componentOnReady() {
          return Qr(this).$onReadyPromise$;
        }
      };
      y.$lazyBundleId$ = h[0], !i.includes(A) && !o.get(A) && (s.push(A), o.define(A, Yd(
        L,
        y,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + S4, u.setAttribute("data-styles", "");
    const h = (n = Mt.$nonce$) !== null && n !== void 0 ? n : jd(Ie);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Mt.jmp(() => l = setTimeout(Wd, 30)), r();
}, sl = /* @__PURE__ */ new WeakMap(), Qr = (t) => sl.get(t), K4 = (t, e) => sl.set(e.$lazyInstance$ = t, e), W4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], sl.set(t, n);
}, $f = (t, e) => e in t, Ss = (t, e) => (0, console.error)(t, e), sa = /* @__PURE__ */ new Map(), q4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = sa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (sa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => j6).then(o, Ss);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (sa.set(s, o), o[r]), Ss);
}, Oi = /* @__PURE__ */ new Map(), xo = typeof window < "u" ? window : {}, Ie = xo.document || { head: {} }, Mt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Xd = (t) => Promise.resolve(t), Y4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), vf = [], Zd = [], X4 = (t, e) => (n) => {
  t.push(n), qa || (qa = !0, Mt.$flags$ & 4 ? il(Xa) : Mt.raf(Xa));
}, Lf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ss(n);
    }
  t.length = 0;
}, Xa = () => {
  Lf(vf), Lf(Zd), (qa = vf.length > 0) && Mt.raf(Xa);
}, il = (t) => Xd().then(t), Z4 = /* @__PURE__ */ X4(Zd), Q4 = () => Xd(), Qd = (t, e) => typeof window > "u" ? Promise.resolve() : Q4().then(() => G4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var J4 = Object.defineProperty, t8 = Object.defineProperties, e8 = Object.getOwnPropertyDescriptors, Fi = Object.getOwnPropertySymbols, Jd = Object.prototype.hasOwnProperty, tg = Object.prototype.propertyIsEnumerable, Cf = (t, e, n) => e in t ? J4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Ce = (t, e) => {
  for (var n in e || (e = {})) Jd.call(e, n) && Cf(t, n, e[n]);
  if (Fi) for (var n of Fi(e)) tg.call(e, n) && Cf(t, n, e[n]);
  return t;
}, In = (t, e) => t8(t, e8(e)), n8 = (t, e) => {
  var n = {};
  for (var r in t) Jd.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Fi) for (var r of Fi(t)) e.indexOf(r) < 0 && tg.call(t, r) && (n[r] = t[r]);
  return n;
};
function ol() {
  return uo(fe()) || window.StacksProvider || window.BlockstackProvider;
}
function al(t) {
  return t ? typeof t == "string" ? Yn.fromName(t) : "version" in t ? t : "url" in t ? new Ia({ url: t.url }) : t.transactionVersion === Zn.Mainnet ? new Ia({ url: t.client.baseUrl }) : new $a({ url: t.client.baseUrl }) : new $a();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var r8 = (t) => {
  if (!t) {
    let e = new Ji(["store_write"], document.location.href);
    t = new ps({ appConfig: e });
  }
  return t;
}, s8 = async (t, e = ol()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: a, appDetails: c } = t, u = r8(a);
  u.isUserSignedIn() && u.signUserOut();
  let f = u.generateAndStoreTransitKey(), l = u.makeAuthRequest(f, `${document.location.origin}${n}`, `${document.location.origin}${r}`, u.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: c, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await u.handlePendingSignIn(g);
    let h = Nt.decodeToken(g), b = h == null ? void 0 : h.payload;
    s == null || s({ authResponse: g, authResponsePayload: b, userSession: u });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), i == null || i();
  }
}, i8 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(i8 || {}), o8 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(o8 || {}), cl = (t) => {
  let e = t;
  if (!e) {
    let n = new Ji(["store_write"], document.location.href);
    e = new ps({ appConfig: n });
  }
  return e;
};
function a8(t) {
  try {
    return cl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var c8 = (t) => {
  let e = cl(t).loadUserData().appPrivateKey, n = Nt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function l8(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Xn.Mainnet]: "mainnet", [Xn.Testnet]: "testnet" }, a = al(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function u8(t) {
  let e = al(t.network), n = cl(t.userSession), r = In(Ce({}, t), { network: e, userSession: n });
  return Ce({ stxAddress: l8(r) }, r);
}
async function f8(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(vd) : n = n.map((r) => z(Td(r)))), new Nt.TokenSigner("ES256k", e).signAsync(In(Ce({}, t), { postConditions: n }));
}
function h8(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(vd) : e = e.map((n) => z(Td(n)))), Nt.createUnsecuredToken(In(Ce({}, t), { postConditions: e }));
}
var d8 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = rt(a.replace(/^0x/, "")), u = Vm(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, In(Ce({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, In(Ce({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, g8 = async (t) => {
  let e = t, { functionArgs: n, appDetails: r, userSession: s } = e, i = n8(e, ["functionArgs", "appDetails", "userSession"]), o = n.map((c) => typeof c == "string" ? c : typeof c.type == "string" ? fm(c) : z(Zr(c)));
  if (a8(s)) {
    let { privateKey: c, publicKey: u } = c8(s), f = In(Ce({}, i), { functionArgs: o, txType: "contract_call", publicKey: u });
    return r && (f.appDetails = r), f8(f, c);
  }
  let a = In(Ce({}, i), { functionArgs: o, txType: "contract_call" });
  return r && (a.appDetails = r), h8(a);
};
async function p8(t, e, n) {
  let r = await e(In(Ce(Ce({}, u8(t)), t), { network: al(t.network) }));
  return d8({ token: r, options: t }, n);
}
function b8(t, e = ol()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return p8(t, g8, e);
}
var y8 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(y8 || {}), eg = "asigna-stx", Bf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === eg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(w8(t, e), "*");
}), x8 = { authenticationRequest: async (t) => Bf(t, "authenticationRequest"), transactionRequest: async (t) => Bf(t, "transactionRequest") }, w8 = (t, e) => ({ source: eg, [e]: t }), S8 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = x8);
};
S8();
var ng = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function rg(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = fe(), o = ol();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Qd();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : ng, c = ew(a), u = document.createElement("connect-modal");
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
var m8 = rg(s8, !1), Hf = rg(b8), A8 = Xh;
function $n(t, e, n) {
  return ll(jt(t, e), n);
}
function jt(t, e) {
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
      const r = $8(BigInt(`0x${tt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${tt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function _f(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function _s(t, e = 8) {
  return (typeof t == "bigint" ? t : jt(t, !1)).toString(16).padStart(e * 2, "0");
}
function wo(t) {
  return parseInt(t, 16);
}
function ll(t, e = 16) {
  const n = _s(t, e);
  return yt(n);
}
function E8(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function I8(t, e) {
  return t & BigInt(1) << e;
}
function $8(t, e) {
  return I8(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const v8 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += v8[n];
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
function Ms(t) {
  return new TextEncoder().encode(t);
}
function ul(t) {
  return new TextDecoder().decode(t);
}
function L8(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function C8(t) {
  return String.fromCharCode.apply(null, t);
}
function B8(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mf(t) {
  if (t.some(B8))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function So(...t) {
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
  return So(...t.map((e) => typeof e == "number" ? Mf([e]) : e instanceof Array ? Mf(e) : e));
}
var Uf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Uf || (Uf = {}));
var Nf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Nf || (Nf = {}));
var Pf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pf || (Pf = {}));
const sg = 33, ia = 32;
function H8(t) {
  if (t.length < ia * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ia * 2), r = t.slice(2 + ia * 2);
  return {
    recoveryId: wo(e),
    r: n,
    s: r
  };
}
function _8(t) {
  const e = typeof t == "string" ? yt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function M8(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function U8(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function N8(t, e) {
  return t[e];
}
function P8(t, e, n = 0) {
  return t[n] = e, t;
}
function T8(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function tr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Za;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Za || (Za = {}));
const D8 = Za.Mainnet, k8 = 128, O8 = 128, ig = 16, jn = 32, Qa = 80, mo = 65, F8 = 32, j8 = 64, ji = 34;
var O;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(O || (O = {}));
var Q;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Q || (Q = {}));
var Ja;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ja || (Ja = {}));
var Rt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Rt || (Rt = {}));
const Ai = ["onChainOnly", "offChainOnly", "any"], Tf = {
  [Ai[0]]: Rt.OnChainOnly,
  [Ai[1]]: Rt.OffChainOnly,
  [Ai[2]]: Rt.Any,
  [Rt.OnChainOnly]: Rt.OnChainOnly,
  [Rt.OffChainOnly]: Rt.OffChainOnly,
  [Rt.Any]: Rt.Any
};
function z8(t) {
  if (t in Tf)
    return Tf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ai.join(", ")}`);
}
var zi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zi || (zi = {}));
zi.Mainnet;
var Fr;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Fr || (Fr = {}));
var Gt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gt || (Gt = {}));
var mt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(mt || (mt = {}));
var lt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(lt || (lt = {}));
var tc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(tc || (tc = {}));
var wt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(wt || (wt = {}));
var Vi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Vi || (Vi = {}));
var ec;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ec || (ec = {}));
var ms;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ms || (ms = {}));
var Df;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Df || (Df = {}));
var kf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(kf || (kf = {}));
function nc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function V8(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function og(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function R8(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  nc(t.outputLen), nc(t.blockLen);
}
function G8(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function K8(t, e) {
  og(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Dn = {
  number: nc,
  bool: V8,
  bytes: og,
  hash: R8,
  exists: G8,
  output: K8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), xe = (t, e) => t << 32 - e | t >>> e, W8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!W8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function q8(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function fl(t) {
  if (typeof t == "string" && (t = q8(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class ag {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function lr(t) {
  const e = (r) => t().update(fl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Y8(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class hl extends ag {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    Dn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = fl(e);
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
    Dn.exists(this), Dn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Y8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
}
const X8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cg = Uint8Array.from({ length: 16 }, (t, e) => e), Z8 = cg.map((t) => (9 * t + 5) % 16);
let dl = [cg], gl = [Z8];
for (let t = 0; t < 4; t++)
  for (let e of [dl, gl])
    e.push(e[t].map((n) => X8[n]));
const lg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Q8 = dl.map((t, e) => t.map((n) => lg[e][n])), J8 = gl.map((t, e) => t.map((n) => lg[e][n])), t5 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), e5 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), di = (t, e) => t << e | t >>> 32 - e;
function Of(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const gi = new Uint32Array(16);
class n5 extends hl {
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
      gi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = t5[h], A = e5[h], L = dl[h], C = gl[h], p = Q8[h], E = J8[h];
      for (let m = 0; m < 16; m++) {
        const N = di(r + Of(h, i, a, u) + gi[L[m]] + y, p[m]) + l | 0;
        r = l, l = u, u = di(a, 10) | 0, a = i, i = N;
      }
      for (let m = 0; m < 16; m++) {
        const N = di(s + Of(b, o, c, f) + gi[C[m]] + A, E[m]) + g | 0;
        s = g, g = f, f = di(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    gi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const r5 = lr(() => new n5()), s5 = (t, e, n) => t & e ^ ~t & n, i5 = (t, e, n) => t & e ^ t & n ^ e & n, o5 = new Uint32Array([
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
]), hn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), dn = new Uint32Array(64);
class ug extends hl {
  constructor() {
    super(64, 32, 8, !1), this.A = hn[0] | 0, this.B = hn[1] | 0, this.C = hn[2] | 0, this.D = hn[3] | 0, this.E = hn[4] | 0, this.F = hn[5] | 0, this.G = hn[6] | 0, this.H = hn[7] | 0;
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
      dn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = dn[l - 15], h = dn[l - 2], b = xe(g, 7) ^ xe(g, 18) ^ g >>> 3, y = xe(h, 17) ^ xe(h, 19) ^ h >>> 10;
      dn[l] = y + dn[l - 7] + b + dn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = xe(a, 6) ^ xe(a, 11) ^ xe(a, 25), h = f + g + s5(a, c, u) + o5[l] + dn[l] | 0, y = (xe(r, 2) ^ xe(r, 13) ^ xe(r, 22)) + i5(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    dn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class a5 extends ug {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const pl = lr(() => new ug());
lr(() => new a5());
const pi = BigInt(2 ** 32 - 1), rc = BigInt(32);
function fg(t, e = !1) {
  return e ? { h: Number(t & pi), l: Number(t >> rc & pi) } : { h: Number(t >> rc & pi) | 0, l: Number(t & pi) | 0 };
}
function c5(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = fg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const l5 = (t, e) => BigInt(t >>> 0) << rc | BigInt(e >>> 0), u5 = (t, e, n) => t >>> n, f5 = (t, e, n) => t << 32 - n | e >>> n, h5 = (t, e, n) => t >>> n | e << 32 - n, d5 = (t, e, n) => t << 32 - n | e >>> n, g5 = (t, e, n) => t << 64 - n | e >>> n - 32, p5 = (t, e, n) => t >>> n - 32 | e << 64 - n, b5 = (t, e) => e, y5 = (t, e) => t, x5 = (t, e, n) => t << n | e >>> 32 - n, w5 = (t, e, n) => e << n | t >>> 32 - n, S5 = (t, e, n) => e << n - 32 | t >>> 64 - n, m5 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function A5(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const E5 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), I5 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $5 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), v5 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, L5 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), C5 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: fg,
  split: c5,
  toBig: l5,
  shrSH: u5,
  shrSL: f5,
  rotrSH: h5,
  rotrSL: d5,
  rotrBH: g5,
  rotrBL: p5,
  rotr32H: b5,
  rotr32L: y5,
  rotlSH: x5,
  rotlSL: w5,
  rotlBH: S5,
  rotlBL: m5,
  add: A5,
  add3L: E5,
  add3H: I5,
  add4L: $5,
  add4H: v5,
  add5H: C5,
  add5L: L5
}, [B5, H5] = Z.split([
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
].map((t) => BigInt(t))), gn = new Uint32Array(80), pn = new Uint32Array(80);
class Ao extends hl {
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
      gn[p] = e.getUint32(n), pn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = gn[p - 15] | 0, m = pn[p - 15] | 0, N = Z.rotrSH(E, m, 1) ^ Z.rotrSH(E, m, 8) ^ Z.shrSH(E, m, 7), D = Z.rotrSL(E, m, 1) ^ Z.rotrSL(E, m, 8) ^ Z.shrSL(E, m, 7), B = gn[p - 2] | 0, U = pn[p - 2] | 0, x = Z.rotrSH(B, U, 19) ^ Z.rotrBH(B, U, 61) ^ Z.shrSH(B, U, 6), I = Z.rotrSL(B, U, 19) ^ Z.rotrBL(B, U, 61) ^ Z.shrSL(B, U, 6), H = Z.add4L(D, I, pn[p - 7], pn[p - 16]), k = Z.add4H(H, N, x, gn[p - 7], gn[p - 16]);
      gn[p] = k | 0, pn[p] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: L, Hl: C } = this;
    for (let p = 0; p < 80; p++) {
      const E = Z.rotrSH(l, g, 14) ^ Z.rotrSH(l, g, 18) ^ Z.rotrBH(l, g, 41), m = Z.rotrSL(l, g, 14) ^ Z.rotrSL(l, g, 18) ^ Z.rotrBL(l, g, 41), N = l & h ^ ~l & y, D = g & b ^ ~g & A, B = Z.add5L(C, m, D, H5[p], pn[p]), U = Z.add5H(B, L, E, N, B5[p], gn[p]), x = B | 0, I = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), H = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), k = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      L = y | 0, C = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Z.add(u | 0, f | 0, U | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = Z.add3L(x, H, G);
      r = Z.add3H(P, U, I, k), s = P | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Z.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Z.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: L, l: C } = Z.add(this.Hh | 0, this.Hl | 0, L | 0, C | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, L, C);
  }
  roundClean() {
    gn.fill(0), pn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class _5 extends Ao {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class M5 extends Ao {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class U5 extends Ao {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
lr(() => new Ao());
lr(() => new _5());
const N5 = lr(() => new M5());
lr(() => new U5());
function hg(t) {
  if (yt(t).byteLength != mo)
    throw Error("Invalid signature");
  return {
    type: O.MessageSignature,
    data: t
  };
}
function bi(t, e) {
  return { type: O.Address, version: t, hash160: e };
}
function er(t, e, n) {
  const r = e || 1, s = n || k8;
  if (_g(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: O.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function bl(t) {
  const e = qr.c32addressDecode(t);
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
function P5(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return k5(e, n);
  } else
    return T5(t);
}
function T5(t) {
  const e = bl(t);
  return { type: j.PrincipalStandard, address: e };
}
function D5(t) {
  return { type: j.PrincipalStandard, address: t };
}
function k5(t, e) {
  const n = bl(t), r = er(e);
  return dg(n, r);
}
function dg(t, e) {
  if (Ms(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: j.PrincipalContract, address: t, contractName: e };
}
const gg = () => ({ type: j.BoolTrue }), pg = () => ({ type: j.BoolFalse }), O5 = (t) => t ? gg() : pg(), Ff = BigInt("0xffffffffffffffffffffffffffffffff"), F5 = BigInt(0), jf = BigInt("0x7fffffffffffffffffffffffffffffff"), zf = BigInt("-170141183460469231731687303715884105728"), j5 = (t) => {
  const e = jt(t, !0);
  if (e > jf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jf}`);
  if (e < zf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${zf}`);
  return { type: j.Int, value: e };
}, bg = (t) => {
  const e = jt(t, !1);
  if (e < F5)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ff)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ff}`);
  return { type: j.UInt, value: e };
}, z5 = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: j.Buffer, buffer: t };
};
function yg() {
  return { type: j.OptionalNone };
}
function xg(t) {
  return { type: j.OptionalSome, value: t };
}
function V5(t) {
  return { type: j.ResponseErr, value: t };
}
function R5(t) {
  return { type: j.ResponseOk, value: t };
}
function wg(t) {
  return { type: j.List, list: t };
}
function Sg(t) {
  for (const e in t)
    if (!UA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: j.Tuple, data: t };
}
const G5 = (t) => ({ type: j.StringASCII, data: t }), K5 = (t) => ({ type: j.StringUTF8, data: t });
class mg extends ag {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Dn.hash(e);
    const r = fl(n);
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
    return Dn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Dn.exists(this), Dn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ag = (t, e, n) => new mg(t, e).update(n).digest();
Ag.create = (t, e) => new mg(t, e);
At.hmacSha256Sync = (t, ...e) => {
  const n = Ag.create(pl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function jr(t) {
  return {
    type: O.PublicKey,
    data: yt(t)
  };
}
function W5(t, e, n = wt.Compressed) {
  const r = H8(e.data), s = new Jt(_f(r.r), _f(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === wt.Compressed;
  return i.toHex(o);
}
function q5(t) {
  return { type: O.PublicKey, data: t };
}
function Jr(t) {
  return !tt(t.data).startsWith("04");
}
function Ri(t) {
  return t.data.slice();
}
function Y5(t) {
  const e = Q5(t), n = Ls(e.data.slice(0, 32), e.compressed);
  return jr(tt(n));
}
function X5(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!0);
  return jr(n);
}
function Z5(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!1);
  return jr(n);
}
function sc(t) {
  const e = t.readUInt8(), n = e === 4 ? j8 : F8;
  return q5(It([e, t.readBytes(n)]));
}
function Q5(t) {
  const e = _8(t), n = e.length == sg;
  return { data: e, compressed: n };
}
function J5(t, e) {
  const [n, r] = eo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = _s(r, 1) + Jt.fromHex(n).toCompactHex();
  return hg(i);
}
function tA(t) {
  return Y5(t.data);
}
function eA(t, e, n) {
  return typeof t == "string" && (t = P5(t)), typeof n == "string" && (n = Gf(n)), {
    type: O.Payload,
    payloadType: Q.TokenTransfer,
    recipient: t,
    amount: jt(e, !1),
    memo: n ?? Gf("")
  };
}
function nA(t, e, n, r) {
  return typeof t == "string" && (t = bl(t)), typeof e == "string" && (e = er(e)), typeof n == "string" && (n = er(n)), {
    type: O.Payload,
    payloadType: Q.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Vf(t, e, n) {
  return typeof t == "string" && (t = er(t)), typeof e == "string" && (e = fA(e)), typeof n == "number" ? {
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
function rA() {
  return { type: O.Payload, payloadType: Q.PoisonMicroblock };
}
function Rf(t, e) {
  if (t.byteLength != jn)
    throw Error(`Coinbase buffer size must be ${jn} bytes`);
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
function sA(t, e, n) {
  if (t.byteLength != jn)
    throw Error(`Coinbase buffer size must be ${jn} bytes`);
  if (n.byteLength != Qa)
    throw Error(`VRF proof buffer size must be ${Qa} bytes`);
  return {
    type: O.Payload,
    payloadType: Q.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === j.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ic;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ic || (ic = {}));
function iA(t, e, n, r, s, i, o) {
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
function Eg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Q.TokenTransfer:
      e.push($e(t.recipient)), e.push($n(t.amount, !1, 8)), e.push(Te(t.memo));
      break;
    case Q.ContractCall:
      e.push(Te(t.contractAddress)), e.push(Te(t.contractName)), e.push(Te(t.functionName));
      const n = new Uint8Array(4);
      tr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push($e(r));
      });
      break;
    case Q.SmartContract:
      e.push(Te(t.contractName)), e.push(Te(t.codeBody));
      break;
    case Q.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Te(t.contractName)), e.push(Te(t.codeBody));
      break;
    case Q.PoisonMicroblock:
      break;
    case Q.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Q.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push($e(t.recipient));
      break;
    case Q.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push($e(t.recipient ? xg(t.recipient) : yg())), e.push(t.vrfProof);
      break;
    case Q.TenureChange:
      e.push(yt(t.tenureHash)), e.push(yt(t.previousTenureHash)), e.push(yt(t.burnViewHash)), e.push(yt(t.previousTenureEnd)), e.push(tr(new Uint8Array(4), t.previousTenureBlocks)), e.push(P8(new Uint8Array(1), t.cause)), e.push(yt(t.publicKeyHash));
      break;
  }
  return It(e);
}
function oA(t) {
  switch (t.readUInt8Enum(Q, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Q.TokenTransfer:
      const n = me(t), r = jt(t.readBytes(8), !1), s = $g(t);
      return eA(n, r, s);
    case Q.ContractCall:
      const i = zr(t), o = se(t), a = se(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const E = me(t);
        c.push(E);
      }
      return nA(i, o, a, c);
    case Q.SmartContract:
      const f = se(t), l = se(t, 4, 1e5);
      return Vf(f, l);
    case Q.VersionedSmartContract: {
      const p = t.readUInt8Enum(Ja, (N) => {
        throw new Error(`Cannot recognize ClarityVersion: ${N}`);
      }), E = se(t), m = se(t, 4, 1e5);
      return Vf(E, m, p);
    }
    case Q.PoisonMicroblock:
      return rA();
    case Q.Coinbase: {
      const p = t.readBytes(jn);
      return Rf(p);
    }
    case Q.CoinbaseToAltRecipient: {
      const p = t.readBytes(jn), E = me(t);
      return Rf(p, E);
    }
    case Q.NakamotoCoinbase: {
      const p = t.readBytes(jn), E = me(t), m = t.readBytes(Qa);
      return sA(p, E, m);
    }
    case Q.TenureChange:
      const g = tt(t.readBytes(20)), h = tt(t.readBytes(20)), b = tt(t.readBytes(20)), y = tt(t.readBytes(32)), A = t.readUInt32BE(), L = t.readUInt8Enum(ic, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), C = tt(t.readBytes(20));
      return iA(g, h, b, y, A, L, C);
  }
}
class Eo extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Mn extends Eo {
  constructor(e) {
    super(e);
  }
}
class Qt extends Eo {
  constructor(e) {
    super(e);
  }
}
class Gi extends Eo {
  constructor(e) {
    super(e);
  }
}
class kn extends Eo {
  constructor(e) {
    super(e);
  }
}
var ce;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ce || (ce = {}));
function oc(t) {
  return hg(tt(t.readBytes(mo)));
}
function mr(t, e) {
  return {
    pubKeyEncoding: t,
    type: O.TransactionAuthField,
    contents: e
  };
}
function aA(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new Qt(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ce.PublicKeyCompressed:
      return mr(wt.Compressed, sc(t));
    case ce.PublicKeyUncompressed:
      return mr(wt.Uncompressed, Z5(sc(t).data));
    case ce.SignatureCompressed:
      return mr(wt.Compressed, oc(t));
    case ce.SignatureUncompressed:
      return mr(wt.Uncompressed, oc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function yl(t) {
  return yt(t.data);
}
function cA(t) {
  const e = [];
  switch (t.contents.type) {
    case O.PublicKey:
      e.push(t.pubKeyEncoding === wt.Compressed ? ce.PublicKeyCompressed : ce.PublicKeyUncompressed), e.push(Ri(X5(t.contents.data)));
      break;
    case O.MessageSignature:
      e.push(t.pubKeyEncoding === wt.Compressed ? ce.SignatureCompressed : ce.SignatureUncompressed), e.push(yl(t.contents));
      break;
  }
  return It(e);
}
function Te(t) {
  switch (t.type) {
    case O.Address:
      return Us(t);
    case O.Principal:
      return Ig(t);
    case O.LengthPrefixedString:
      return Vr(t);
    case O.MemoString:
      return hA(t);
    case O.AssetInfo:
      return vg(t);
    case O.PostCondition:
      return Cg(t);
    case O.PublicKey:
      return Ri(t);
    case O.LengthPrefixedList:
      return Sl(t);
    case O.Payload:
      return Eg(t);
    case O.TransactionAuthField:
      return cA(t);
    case O.MessageSignature:
      return yl(t);
  }
}
function lA() {
  return {
    type: O.Address,
    version: tc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function xl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === lt.SerializeP2PKH || e === lt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === lt.SerializeP2WPKH || e === lt.SerializeP2WSH || e === lt.SerializeP2WSHNonSequential) && !r.every(Jr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case lt.SerializeP2PKH:
      return bi(t, BA(r[0].data));
    case lt.SerializeP2WPKH:
      return bi(t, HA(r[0].data));
    case lt.SerializeP2SH:
    case lt.SerializeP2SHNonSequential:
      return bi(t, _A(n, r.map(Ri)));
    case lt.SerializeP2WSH:
    case lt.SerializeP2WSHNonSequential:
      return bi(t, MA(n, r.map(Ri)));
  }
}
function Us(t) {
  const e = [];
  return e.push(yt(_s(t.version, 1))), e.push(yt(t.hash160)), It(e);
}
function zr(t) {
  const e = wo(tt(t.readBytes(1))), n = tt(t.readBytes(20));
  return { type: O.Address, version: e, hash160: n };
}
function Ig(t) {
  const e = [];
  return e.push(t.prefix), e.push(Us(t.address)), t.prefix === ms.Contract && e.push(Vr(t.contractName)), It(e);
}
function uA(t) {
  const e = t.readUInt8Enum(ms, (s) => {
    throw new Qt(`Unexpected Principal payload type: ${s}`);
  }), n = zr(t);
  if (e === ms.Standard)
    return { type: O.Principal, prefix: e, address: n };
  const r = se(t);
  return {
    type: O.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Vr(t) {
  const e = [], n = Ms(t.content), r = n.byteLength;
  return e.push(yt(_s(r, t.lengthPrefixBytes))), e.push(n), It(e);
}
function se(t, e, n) {
  e = e || 1;
  const r = wo(tt(t.readBytes(e))), s = ul(t.readBytes(r));
  return er(s, e, n ?? 128);
}
function fA(t) {
  return er(t, 4, 1e5);
}
function Gf(t) {
  if (t && _g(t, ji))
    throw new Error(`Memo exceeds maximum length of ${ji} bytes`);
  return { type: O.MemoString, content: t };
}
function hA(t) {
  const e = [], n = Ms(t.content), r = CA(tt(n), ji * 2);
  return e.push(yt(r)), It(e);
}
function $g(t) {
  let e = ul(t.readBytes(ji));
  return e = e.replace(/\u0000*$/, ""), { type: O.MemoString, content: e };
}
function vg(t) {
  const e = [];
  return e.push(Us(t.address)), e.push(Vr(t.contractName)), e.push(Vr(t.assetName)), It(e);
}
function ac(t) {
  return {
    type: O.AssetInfo,
    address: zr(t),
    contractName: se(t),
    assetName: se(t)
  };
}
function wl(t, e) {
  return {
    type: O.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Sl(t) {
  const e = t.values, n = [];
  n.push(yt(_s(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Te(r));
  return It(n);
}
function Lg(t, e, n) {
  const r = wo(tt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case O.Address:
        s.push(zr(t));
        break;
      case O.LengthPrefixedString:
        s.push(se(t));
        break;
      case O.MemoString:
        s.push($g(t));
        break;
      case O.AssetInfo:
        s.push(ac(t));
        break;
      case O.PostCondition:
        s.push(dA(t));
        break;
      case O.PublicKey:
        s.push(sc(t));
        break;
      case O.TransactionAuthField:
        s.push(aA(t));
        break;
    }
  return wl(s, n);
}
function Cg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Ig(t.principal)), (t.conditionType === Gt.Fungible || t.conditionType === Gt.NonFungible) && e.push(vg(t.assetInfo)), t.conditionType === Gt.NonFungible && e.push($e(t.assetName)), e.push(t.conditionCode), t.conditionType === Gt.STX || t.conditionType === Gt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Mn("The post-condition amount may not be larger than 8 bytes");
    e.push($n(t.amount, !1, 8));
  }
  return It(e);
}
function dA(t) {
  const e = t.readUInt8Enum(Gt, (o) => {
    throw new Qt(`Could not read ${o} as PostConditionType`);
  }), n = uA(t);
  let r, s, i;
  switch (e) {
    case Gt.STX:
      return r = t.readUInt8Enum(Vi, (a) => {
        throw new Qt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Gt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Gt.Fungible:
      return s = ac(t), r = t.readUInt8Enum(Vi, (a) => {
        throw new Qt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Gt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Gt.NonFungible:
      s = ac(t);
      const o = me(t);
      return r = t.readUInt8Enum(ec, (a) => {
        throw new Qt(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: O.PostCondition,
        conditionType: Gt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function _e(t, e) {
  return It([t, e]);
}
function gA(t) {
  return new Uint8Array([t.type]);
}
function pA(t) {
  return t.type === j.OptionalNone ? new Uint8Array([t.type]) : _e(t.type, $e(t.value));
}
function bA(t) {
  const e = new Uint8Array(4);
  return tr(e, t.buffer.length, 0), _e(t.type, So(e, t.buffer));
}
function yA(t) {
  const e = ll(E8(t.value, BigInt(O8)), ig);
  return _e(t.type, e);
}
function xA(t) {
  const e = ll(t.value, ig);
  return _e(t.type, e);
}
function wA(t) {
  return _e(t.type, Us(t.address));
}
function SA(t) {
  return _e(t.type, So(Us(t.address), Vr(t.contractName)));
}
function mA(t) {
  return _e(t.type, $e(t.value));
}
function AA(t) {
  const e = [], n = new Uint8Array(4);
  tr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = $e(r);
    e.push(s);
  }
  return _e(t.type, It(e));
}
function EA(t) {
  const e = [], n = new Uint8Array(4);
  tr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = er(s);
    e.push(Vr(i));
    const o = $e(t.data[s]);
    e.push(o);
  }
  return _e(t.type, It(e));
}
function Bg(t, e) {
  const n = [], r = e == "ascii" ? L8(t.data) : Ms(t.data), s = new Uint8Array(4);
  return tr(s, r.length, 0), n.push(s), n.push(r), _e(t.type, It(n));
}
function IA(t) {
  return Bg(t, "ascii");
}
function $A(t) {
  return Bg(t, "utf8");
}
function $e(t) {
  switch (t.type) {
    case j.BoolTrue:
    case j.BoolFalse:
      return gA(t);
    case j.OptionalNone:
    case j.OptionalSome:
      return pA(t);
    case j.Buffer:
      return bA(t);
    case j.UInt:
      return xA(t);
    case j.Int:
      return yA(t);
    case j.PrincipalStandard:
      return wA(t);
    case j.PrincipalContract:
      return SA(t);
    case j.ResponseOk:
    case j.ResponseErr:
      return mA(t);
    case j.List:
      return AA(t);
    case j.Tuple:
      return EA(t);
    case j.StringASCII:
      return IA(t);
    case j.StringUTF8:
      return $A(t);
    default:
      throw new Mn("Unable to serialize. Invalid Clarity Value.");
  }
}
function vA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Kf = /* @__PURE__ */ new Map();
function Hg(t, e) {
  const n = Kf.get(t);
  if (n !== void 0)
    return n(e);
  const r = vA(t);
  return Kf.set(t, r), Hg(t, e);
}
class hs {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return T8(this.readBytes(4), 0);
  }
  readUInt8() {
    return N8(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return M8(this.readBytes(2), 0);
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
    if (Hg(e, r))
      return r;
    throw n(r);
  }
}
function me(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new hs(yt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new hs(t) : e = t;
  switch (e.readUInt8Enum(j, (r) => {
    throw new Qt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case j.Int:
      return j5(e.readBytes(16));
    case j.UInt:
      return bg(e.readBytes(16));
    case j.Buffer:
      const r = e.readUInt32BE();
      return z5(e.readBytes(r));
    case j.BoolTrue:
      return gg();
    case j.BoolFalse:
      return pg();
    case j.PrincipalStandard:
      const s = zr(e);
      return D5(s);
    case j.PrincipalContract:
      const i = zr(e), o = se(e);
      return dg(i, o);
    case j.ResponseOk:
      return R5(me(e));
    case j.ResponseErr:
      return V5(me(e));
    case j.OptionalNone:
      return yg();
    case j.OptionalSome:
      return xg(me(e));
    case j.List:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(me(e));
      return wg(c);
    case j.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = se(e).content;
        if (A === void 0)
          throw new Qt('"content" is undefined');
        f[A] = me(e);
      }
      return Sg(f);
    case j.StringASCII:
      const l = e.readUInt32BE(), g = C8(e.readBytes(l));
      return G5(g);
    case j.StringUTF8:
      const h = e.readUInt32BE(), b = ul(e.readBytes(h));
      return K5(b);
    default:
      throw new Qt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const LA = (t) => t.length % 2 == 0 ? t : `0${t}`, CA = (t, e) => t.padEnd(e, "0"), _g = (t, e) => t ? Ms(t).length > e : !1;
function cc(t) {
  return qh(t);
}
const As = (t) => r5(pl(t)), ml = (t) => tt(N5(t)), BA = (t) => tt(As(t)), HA = (t) => {
  const e = As(t), n = So(new Uint8Array([0]), new Uint8Array([e.length]), e), r = As(n);
  return tt(r);
}, _A = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = It(n), s = As(r);
  return tt(s);
}, MA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = It(n), s = pl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = It(i), a = As(o);
  return tt(a);
};
function UA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
const Er = (t) => {
  try {
    return qr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Al() {
  return {
    type: O.MessageSignature,
    data: tt(new Uint8Array(mo))
  };
}
function Mg(t, e, n, r) {
  const s = xl(0, t, 1, [jr(e)]).hash160, i = Jr(jr(e)) ? wt.Compressed : wt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: jt(n, !1),
    fee: jt(r, !1),
    keyEncoding: i,
    signature: Al()
  };
}
function Es(t) {
  return "signature" in t;
}
function Wf(t) {
  return t === lt.SerializeP2SH || t === lt.SerializeP2WSH;
}
function NA(t) {
  return t === lt.SerializeP2SHNonSequential || t === lt.SerializeP2WSHNonSequential;
}
function qf(t) {
  const e = cc(t);
  return e.nonce = 0, e.fee = 0, Es(e) ? e.signature = Al() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function PA(t) {
  const e = [
    t.hashMode,
    yt(t.signer),
    $n(t.nonce, !1, 8),
    $n(t.fee, !1, 8),
    t.keyEncoding,
    yl(t.signature)
  ];
  return It(e);
}
function TA(t) {
  const e = [
    t.hashMode,
    yt(t.signer),
    $n(t.nonce, !1, 8),
    $n(t.fee, !1, 8)
  ], n = wl(t.fields);
  e.push(Sl(n));
  const r = new Uint8Array(2);
  return U8(r, t.signaturesRequired, 0), e.push(r), It(e);
}
function DA(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt(`0x${tt(e.readBytes(8))}`), s = BigInt(`0x${tt(e.readBytes(8))}`), i = e.readUInt8Enum(wt, (a) => {
    throw new Qt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === lt.SerializeP2WPKH && i != wt.Compressed)
    throw new Qt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = oc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function kA(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt("0x" + tt(e.readBytes(8))), s = BigInt("0x" + tt(e.readBytes(8))), i = Lg(e, O.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case O.PublicKey:
        Jr(u.contents) || (o = !0);
        break;
      case O.MessageSignature:
        if (u.pubKeyEncoding === wt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new kn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === lt.SerializeP2WSH || t === lt.SerializeP2WSHNonSequential))
    throw new kn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function aa(t) {
  return Es(t) ? PA(t) : TA(t);
}
function ca(t) {
  const e = t.readUInt8Enum(lt, (n) => {
    throw new Qt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === lt.SerializeP2PKH || e === lt.SerializeP2WPKH ? DA(e, t) : kA(e, t);
}
function Ug(t, e, n, r) {
  const i = t + tt(new Uint8Array([e])) + tt($n(n, !1, 8)) + tt($n(r, !1, 8));
  if (yt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ml(yt(i));
}
function Ng(t, e, n) {
  const r = 33 + mo, s = Jr(e) ? wt.Compressed : wt.Uncompressed, i = t + LA(s.toString(16)) + n.data, o = yt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ml(o);
}
function OA(t, e, n, r, s) {
  const i = Ug(t, e, n, r), o = J5(s, i), a = tA(s), c = Ng(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Pg(t, e, n, r, s, i) {
  const o = Ug(t, e, n, r), a = jr(W5(o, i, s)), c = Ng(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function FA() {
  const t = Mg(lt.SerializeP2PKH, "", 0, 0);
  return t.signer = lA().hash160, t.keyEncoding = wt.Compressed, t.signature = Al(), t;
}
function Yf(t, e, n) {
  return Es(t) ? jA(t, e, n) : zA(t, e, n);
}
function jA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Pg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = xl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new kn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function zA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case O.PublicKey:
        Jr(c.contents) || (i = !0), r.push(c.contents);
        break;
      case O.MessageSignature:
        c.pubKeyEncoding === wt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Pg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Wf(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new kn("Too many signatures");
        break;
    }
  if (Wf(t.hashMode) && o !== t.signaturesRequired || NA(t.hashMode) && o < t.signaturesRequired)
    throw new kn("Incorrect number of signatures");
  if (i && (t.hashMode === lt.SerializeP2WSH || t.hashMode === lt.SerializeP2WSHNonSequential))
    throw new kn("Uncompressed keys are not allowed in this hash mode");
  const a = xl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new kn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Tg(t) {
  return {
    authType: mt.Standard,
    spendingCondition: t
  };
}
function Dg(t, e) {
  return {
    authType: mt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Mg(lt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Xf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case mt.Standard:
        return Tg(qf(t.spendingCondition));
      case mt.Sponsored:
        return Dg(qf(t.spendingCondition), FA());
      default:
        throw new Gi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function VA(t, e) {
  switch (t.authType) {
    case mt.Standard:
      return Yf(t.spendingCondition, e, mt.Standard);
    case mt.Sponsored:
      return Yf(t.spendingCondition, e, mt.Standard);
    default:
      throw new Gi("Invalid origin auth type");
  }
}
function RA(t, e) {
  switch (t.authType) {
    case mt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: jt(e, !1)
      };
      return { ...t, spendingCondition: n };
    case mt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: jt(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function GA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: jt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function KA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: jt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function WA(t, e) {
  const n = {
    ...e,
    nonce: jt(e.nonce, !1),
    fee: jt(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function qA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case mt.Standard:
      e.push(aa(t.spendingCondition));
      break;
    case mt.Sponsored:
      e.push(aa(t.spendingCondition)), e.push(aa(t.sponsorSpendingCondition));
      break;
  }
  return It(e);
}
function YA(t) {
  const e = t.readUInt8Enum(mt, (r) => {
    throw new Qt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case mt.Standard:
      return n = ca(t), Tg(n);
    case mt.Sponsored:
      n = ca(t);
      const r = ca(t);
      return Dg(n, r);
  }
}
class XA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: jt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? D8, this.postConditionMode = i ?? Fr.Deny, this.postConditions = s ?? wl([]), o)
      this.anchorMode = z8(o);
    else
      switch (r.payloadType) {
        case Q.Coinbase:
        case Q.CoinbaseToAltRecipient:
        case Q.NakamotoCoinbase:
        case Q.PoisonMicroblock:
        case Q.TenureChange:
          this.anchorMode = Rt.OnChainOnly;
          break;
        case Q.ContractCall:
        case Q.SmartContract:
        case Q.VersionedSmartContract:
        case Q.TokenTransfer:
          this.anchorMode = Rt.Any;
          break;
      }
  }
  signBegin() {
    const e = cc(this);
    return e.auth = Xf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = cc(this);
    return e.auth = Xf(e.auth), e.txid();
  }
  verifyOrigin() {
    return VA(this.auth, this.verifyBegin());
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
    if (n && !Es(n)) {
      const r = Jr(e);
      n.fields.push(mr(r ? wt.Compressed : wt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = OA(n, r, e.fee, e.nonce, s);
    return Es(e) ? e.signature = i : e.fields.push(mr(s.data.byteLength === sg ? wt.Compressed : wt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return ml(e);
  }
  setSponsor(e) {
    if (this.auth.authType != mt.Sponsored)
      throw new Gi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = WA(this.auth, e);
  }
  setFee(e) {
    this.auth = RA(this.auth, e);
  }
  setNonce(e) {
    this.auth = GA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != mt.Sponsored)
      throw new Gi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = KA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Mn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Mn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Mn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Mn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Mn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return tr(n, this.chainId, 0), e.push(n), e.push(qA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Sl(this.postConditions)), e.push(Eg(this.payload)), It(e);
  }
}
function ZA(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new hs(yt(t.slice(2))) : e = new hs(yt(t)) : t instanceof Uint8Array ? e = new hs(t) : e = t;
  const n = e.readUInt8Enum(zi, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = YA(e), i = e.readUInt8Enum(Rt, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Fr, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Lg(e, O.PostCondition), c = oA(e);
  return new XA(n, s, c, a, o, i, r);
}
const Zf = O5, Qf = bg, QA = wg, JA = Sg, kg = (t) => {
  let e = "";
  for (const n of t)
    e += n.toString(16).padStart(2, "0");
  return e;
}, t6 = ["store_write"], Jf = "/manifest.json", e6 = /* @__PURE__ */ new Set([4001, -31001]), n6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], r6 = ["result", "data", "payload", "response", "params"], t0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], El = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Ns = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ts = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Ir = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Og = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Il = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Og(i, r)) === s
  );
}, Fg = (t) => t ? Il(ts()).some(
  (e) => {
    var n;
    return e.id === t && (Ns(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, jg = () => {
  if (typeof window > "u")
    return;
  const t = ts(), e = Il(t).filter(
    (n) => {
      var r;
      return Ns(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Ir(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of n6) {
    const r = Ir(t, n) ?? (t === window ? void 0 : Ir(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, zg = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ts(), n = Ir(e, t) ?? (e === window ? void 0 : Ir(window, t)) ?? uo(t);
  if (n)
    return n;
  if (Ns(t) || Fg(t))
    return jg();
}, s6 = (t) => {
  const e = ts();
  if (!e)
    return [];
  const n = Il(e), r = t.filter(
    (s) => !n.some((i) => Og(i, s)) && !!Ir(e, s.id)
  );
  return n.concat(r);
}, je = () => ({ isConnected: !1 }), i6 = ["blockstack-session", "blockstack"], Vg = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of i6) {
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
Vg();
const Ps = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Pt = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, o6 = (t) => {
  const e = Pt(t);
  if (!e)
    return null;
  const n = Ps(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, a6 = (t) => {
  const e = Pt(t);
  if (!e)
    return null;
  const n = Ps(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Ki = (t, e = "mainnet") => {
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
      return Ki(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Ki(r, e);
  }
  return e;
}, Wi = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, c6 = (t) => typeof t == "string" ? Ps(t) : kg($e(t)), l6 = (t) => typeof t == "string" ? Ps(t) : kg(Cg(t)), u6 = (t) => t === Fr.Allow ? "allow" : "deny", Rr = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Er(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Rr(s, e + 1);
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
    const i = Rr(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Er(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Er(n.testnet) ? n.testnet.trim() : null;
}, e0 = (t) => {
  const e = Pt(t);
  if (!e)
    return null;
  const n = Ps(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, lc = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const a = lc(o, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : e0(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => Pt(o)).find((o) => o && Er(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => e0(o)).find(Boolean);
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
    const a = lc(r[o], e, n + 1);
    if (a)
      return a;
  }
  return null;
}, f6 = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && Er(n) ? n.trim() : null;
  if (!r)
    return je();
  const s = fc(r);
  return s !== "mainnet" ? je() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, h6 = (t, e = "mainnet") => {
  const n = Rr(t);
  if (!n)
    return je();
  const r = fc(n) ?? Ki(t, e);
  if (r !== "mainnet")
    return je();
  const s = lc(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, Io = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ts = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && e6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, vn = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Pt(n == null ? void 0 : n.message) ?? Pt(e.message) ?? Pt(e.error) ?? Pt(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, nr = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw vn(e);
    if (e.status === "error")
      throw vn(e.result ?? e);
  }
  return t;
}, $o = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return nr(r);
  } catch (r) {
    throw vn(r);
  }
}, $l = () => jg(), Gr = (t) => {
  var r, s;
  const e = fe();
  if (Ns(e) || Fg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ts() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === $l();
}, n0 = async (t, e, n) => {
  if (!Gr(t))
    return $o(t, e, n);
  const r = $l();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return nr(await r.request(e, n));
  } catch (s) {
    throw vn(s);
  }
}, la = (t) => {
  const e = a6(t);
  if (!e)
    return null;
  try {
    const n = ZA(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, uc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = la(t), r = o6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Pt(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = uc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of t0)
    if (la(s[a])) {
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
  for (const a of t0) {
    const c = la(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Pt(s[a]) ?? void 0
      };
  }
  for (const a of r6) {
    const c = s[a], u = uc(c, e + 1);
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
}, r0 = (t) => {
  const e = uc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, d6 = (t) => ({
  ...t,
  fee: Wi(t.fee),
  nonce: Wi(t.nonce),
  sponsored: t.sponsored === !0
}), Rg = (t) => {
  const e = t.postConditions && t.postConditions.length > 0 ? t.postConditions.map((n) => l6(n)) : void 0;
  return {
    contract: `${t.contractAddress}.${t.contractName}`,
    functionName: t.functionName,
    functionArgs: t.functionArgs.map((n) => c6(n)),
    network: Ki(t.network),
    address: t.stxAddress,
    fee: Wi(t.fee),
    nonce: Wi(t.nonce),
    sponsored: t.sponsored ?? !1,
    postConditionMode: u6(t.postConditionMode),
    postConditions: e
  };
}, g6 = (t) => {
  const e = Rg(t);
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
}, Gg = "WALLET_ADDRESS_MISMATCH";
let s0 = 9e4;
const p6 = 45e3;
let ds = null;
const qi = (t) => {
  t && (ds = { address: t, at: Date.now() });
}, Kg = () => {
  ds = null;
}, b6 = () => ds && Date.now() - ds.at <= p6 ? ds.address : null, y6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, x6 = async (t) => {
  Kg();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = nr(await t.request("wallet_connect")), n = Rr(e);
  return qi(n), n;
}, w6 = async (t, e, n, r) => {
  try {
    return nr(await t.request(e, n));
  } catch (s) {
    const i = vn(s);
    if (!y6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await x6(t);
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
        { code: o ? Gg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return nr(await t.request(e, n));
    } catch (a) {
      throw vn(a);
    }
  }
};
let i0 = 3e4;
const S6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${i0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, i0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, m6 = async (t, e) => {
  const n = (a, c) => {
    if (e && a !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${a} (via ${c}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Gg }
      );
    return a;
  }, r = b6();
  if (r)
    return console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: r }), n(r, "cached-session");
  let s = null;
  try {
    const a = nr(
      await S6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Rr(a), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (a) {
    if (Ts(a))
      throw vn(a);
    console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: a instanceof Error ? a.message : String(a)
    });
  }
  if (s)
    return qi(s), n(s, "wallet_getAccount");
  let i;
  try {
    i = nr(await t.request("wallet_connect"));
  } catch (a) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: a instanceof Error ? a.message : String(a)
    }), vn(a);
  }
  const o = Rr(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: o }), !o)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return qi(o), n(o, "wallet_connect");
}, A6 = async (t, e) => {
  if (!Gr(t)) {
    const c = await $o(
      t,
      "stx_callContract",
      Rg(e)
    );
    return r0(c);
  }
  const n = $l();
  if (!n)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  let r = "account-preflight", s;
  const i = async () => {
    var f;
    s = await m6(n, e.stxAddress), r = "stx_callContract";
    const c = g6(e);
    console.info("[wallet:contract-call]", {
      stage: "XVERSE_SIGNING_REQUEST",
      providerId: fe(),
      contract: c.contract,
      functionName: c.functionName,
      functionArgCount: c.functionArgs.length,
      postConditionMode: c.postConditionMode,
      postConditionCount: ((f = c.postConditions) == null ? void 0 : f.length) ?? 0,
      expectedAddress: e.stxAddress,
      activeAddress: s
    });
    const u = await w6(
      n,
      "stx_callContract",
      c,
      e.stxAddress ?? s
    );
    return r0(u);
  };
  let o;
  const a = new Promise((c, u) => {
    o = setTimeout(() => {
      u(
        Object.assign(
          new Error(
            `Xverse did not answer the ${r} request within ${Math.round(
              s0 / 1e3
            )}s (provider=${fe() ?? "unknown"}, expected=${e.stxAddress ?? "none"}, active=${s ?? "unknown"}, call=${e.contractAddress}.${e.contractName}::${e.functionName}). If Xverse showed an error toast, note its exact text; if you approved a transaction, it may still broadcast.`
          ),
          { code: "XVERSE_SIGNING_TIMEOUT", stage: r }
        )
      );
    }, s0);
  });
  try {
    return await Promise.race([i(), a]);
  } finally {
    o && clearTimeout(o);
  }
}, Wg = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Wg(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, E6 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], I6 = async (t) => {
  const e = fe();
  if (Gr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!El(e))
    return E6;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Wg(await $o(t, "supportedMethods"));
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
}, $6 = async (t) => {
  if (Gr(t))
    try {
      await n0(t, "wallet_disconnect");
    } catch {
    }
  const e = await I6(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await n0(t, r), i = h6(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), Gr(t) && qi(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = Io(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Ts(s))
        return je();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return je();
}, v6 = async (t, e) => {
  const n = new Ji(t6, void 0, "", Jf), r = new ps({ appConfig: n });
  return new Promise((s) => {
    m8(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: Jf,
        userSession: r,
        onFinish: (i) => {
          s(f6(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(je());
        }
      },
      e
    );
  });
}, L6 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : fe(), r = zg(n);
  return r ? (e && n && Yh(n), r) : null;
}, C6 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return Qd(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = ng, i = s6(s), o = document.body.style.overflow, a = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", c), r.remove();
    }, c = (u) => {
      u.key === "Escape" && (a(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (u) => {
      const f = L6(u, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof u == "string" ? u : fe() ?? "provider-object",
        resolved: !!f,
        requestBridge: typeof (f == null ? void 0 : f.request) == "function"
      }), a(), n(f);
    }, r.cancelCallback = () => {
      a(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", c), document.body.appendChild(r);
  });
}, qg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = fe(), e = t ? zg(t) : void 0;
  if (e)
    return e;
  const n = ts() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, B6 = async (t) => {
  Vg();
  const e = await C6({});
  if (!e)
    return je();
  if (typeof e.request == "function")
    try {
      const n = await $6(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Ts(n))
        return je();
      if (!Io(n))
        throw n;
    }
  return v6(t, e);
}, H6 = () => {
  const t = fe();
  return El(t) ? "leather" : Ns(t) ? "xverse" : t ? String(t) : void 0;
}, _6 = async (t) => {
  const e = P1("wallet_connect");
  os({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await B6(t);
    return n.isConnected && n.address ? (hc(n.address, H6()), dc(n.network), os({ journey: e, step: "authorize", outcome: "success" })) : os({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw os({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: H1(n),
      error: n
    }), n;
  }
}, M6 = async () => {
  const t = qg();
  if (t && El(fe()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await $o(t, e);
        break;
      } catch (n) {
        if (Ts(n) || Io(n))
          continue;
      }
  A8(), Xh(), Kg(), hc(null), dc(null), os({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, U6 = (t, e) => {
  const n = qg(), r = d6(t);
  return !n || typeof n.request != "function" ? Hf(r, e) : void A6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Io(s) && !Gr(n)) {
      Hf(r, n);
      return;
    }
    if (console.error("[wallet] contract call request failed", s), Ts(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, N6 = (t) => {
  const e = $1(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (hc(o.address), dc(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), a = await _6({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return a.isConnected ? (e.save(a), a) : o.isConnected ? o : a;
    },
    disconnect: async () => {
      await M6(), n();
    },
    getSession: r
  };
};
function P6(t, e, n) {
  var o;
  if (!n.isConnected || n.network !== "mainnet" || !((o = n.address) != null && o.startsWith("SP"))) throw Error("Connect a mainnet wallet first.");
  if (!e.length || e.length > 25 || e.some((a) => !Number.isSafeInteger(a.id) || a.id < 0 || typeof a.liked != "boolean") || new Set(e.map((a) => a.id)).size !== e.length) throw Error("Select 1–25 different songs.");
  const r = t.split("."), [s, i] = r;
  if (r.length !== 2 || !s.startsWith("SP") || !Er(s) || !/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(i)) throw Error("Invalid likes contract.");
  return { contractAddress: s, contractName: i, functionName: e.length === 1 ? "set-liked" : "set-likes", functionArgs: e.length === 1 ? [Qf(e[0].id), Zf(e[0].liked)] : [QA(e.map((a) => JA({ id: Qf(a.id), liked: Zf(a.liked) })))], network: new kd(), stxAddress: n.address, sponsored: !1, postConditionMode: Fr.Deny, postConditions: [] };
}
function Yg(t, e, n) {
  return Array.isArray(t) ? [...new Set(t.map((r) => Number(r == null ? void 0 : r.tokenId)).filter((r) => Number.isSafeInteger(r) && e.has(r) && !n.has(r)))] : [];
}
const ur = N6({ appName: "Xtrata Radio", appIcon: "/favicon.ico" }), bt = (t) => document.getElementById(t);
let Xt, zn = [], Is = /* @__PURE__ */ new Map(), On = !1, $r = !1, bn = 0;
const Yi = /* @__PURE__ */ new Map();
let vl, Xg = "", Zg = [];
const ue = (t) => {
  bt("status").textContent = t;
}, vr = () => `xtrata.radio.chain.pending:${Xt == null ? void 0 : Xt.contract}:${ur.getSession().address}`, Xi = () => {
  try {
    return localStorage.getItem(vr()) || Yi.get(vr()) || "";
  } catch {
    return Yi.get(vr()) || "";
  }
};
async function ua(t = {}) {
  const e = await fetch("/radio/chain-likes?" + new URLSearchParams(t), { cache: "no-store", signal: AbortSignal.timeout(2e4) }), n = await e.json();
  if (!e.ok) throw Error(n.error || "Could not read on-chain likes.");
  return n;
}
function Zi() {
  const t = ur.getSession(), e = t.isConnected && t.network === "mainnet" && vl === t.address, n = !!Xi();
  let r = [];
  try {
    r = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]");
  } catch {
  }
  const s = Array.isArray(r) ? new Set(r.map((a) => String(a == null ? void 0 : a.tokenId))).size : 0, i = e && !$r ? Yg(r, new Set(zn.map((a) => a.id)), new Set([...Is].filter(([, a]) => a.liked).map(([a]) => a))).length : s;
  if (bt("import-offer").textContent = s ? i ? `You have ${i} saved favourites to review for on-chain import. ${e ? "Use the import button below." : "Connect your wallet to check which ones still need importing."} Nothing is published automatically.` : "All eligible saved favourites are already liked by this wallet on-chain." : "", bt("wallet").textContent = e ? `Wallet: ${t.address}` : "", bt("disconnect").disabled = !t.isConnected || On, bt("connect").disabled = On, bt("import").disabled = !(Xt != null && Xt.enabled) || !e || On || $r || n, bt("pending").replaceChildren(), n) {
    const a = document.createElement("a");
    a.href = "https://explorer.hiro.so/txid/" + Xi() + "?chain=mainnet", a.target = "_blank", a.rel = "noopener", a.textContent = "Transaction pending — view on explorer. Use Refresh to check confirmation.", bt("pending").append(a);
  }
  const o = new URL(location.href).searchParams.get("id");
  bt("songs").replaceChildren();
  for (const a of [...zn].sort((c, u) => +(String(u.id) === o) - +(String(c.id) === o))) {
    const c = document.createElement("tr"), u = document.createElement("td"), f = document.createElement("td"), l = document.createElement("td"), g = document.createElement("button");
    u.textContent = `#${a.id} · ${a.title}`;
    const h = Is.get(a.id);
    f.textContent = (h == null ? void 0 : h.total) ?? "—", g.textContent = h != null && h.liked ? "Unlike on-chain" : "Like on-chain", g.disabled = !e || !h || !(Xt != null && Xt.enabled) || On || $r || n, g.onclick = () => Qg([{ id: a.id, liked: !(h != null && h.liked) }]), l.append(g), c.append(u, f, l), bt("songs").append(c);
  }
}
function Qg(t) {
  var e;
  Xg = ur.getSession().address || "", Zg = t, bt("choices").replaceChildren();
  for (const n of t) {
    const r = document.createElement("label"), s = document.createElement("input");
    s.type = "checkbox", s.checked = !0, s.dataset.id = String(n.id), r.append(s, document.createTextNode(`${n.liked ? "Like" : "Unlike"} #${n.id} · ${((e = zn.find((i) => i.id === n.id)) == null ? void 0 : e.title) || ""}`)), bt("choices").append(r, document.createElement("br"));
  }
  bt("review-note").textContent = "Up to 25 songs per transaction. Already confirmed likes are skipped on import. Closing or cancelling this review sends nothing.", bt("review").showModal();
}
async function vo() {
  const t = ++bn;
  $r = !0, Is.clear(), Zi();
  try {
    const e = await ua();
    if (t !== bn) return;
    if (Xt = e, !Xt.enabled) {
      ue("On-chain likes are not activated yet. Your saved favourites still work.");
      return;
    }
    const n = ur.getSession(), r = n.network === "mainnet" ? n.address : void 0, s = await fetch("/radio/counts?range=all", { cache: "no-store" });
    if (!s.ok) throw Error("Song catalogue unavailable.");
    const i = await s.json();
    if (t !== bn) return;
    zn = i.tracks;
    const o = /* @__PURE__ */ new Map();
    for (let c = 0; c < zn.length; c += 25) {
      const u = await ua({ ids: zn.slice(c, c + 25).map((f) => f.id).join(","), ...r ? { wallet: r } : {} });
      if (t !== bn) return;
      if (u.contract !== Xt.contract) throw Error("Contract configuration changed. Refresh before continuing.");
      for (const f of u.rows) o.set(f.id, f);
    }
    if (t !== bn) return;
    Is = o, vl = r, ue("Confirmed on-chain likes. Saved browser favourites are not included.");
    const a = Xi();
    if (a && r) {
      const c = await ua({ txid: a, wallet: r });
      if (t !== bn) return;
      if (c.status === "confirmed" || c.status === "failed") {
        Yi.delete(vr());
        try {
          localStorage.removeItem(vr());
        } catch {
        }
        ue(c.status === "confirmed" ? "Transaction confirmed. Refresh if the latest count has not appeared yet." : "Transaction failed; it did not change your on-chain likes. A network fee may still have been paid.");
      }
    }
  } catch (e) {
    t === bn && ue(e instanceof Error ? e.message : "Unable to refresh.");
  } finally {
    t === bn && ($r = !1, Zi());
  }
}
bt("connect").onclick = async () => {
  try {
    await ur.connect(), await vo();
  } catch (t) {
    ue(String(t));
  }
};
bt("disconnect").onclick = async () => {
  await ur.disconnect(), await vo();
};
bt("refresh").onclick = () => void vo();
bt("import").onclick = () => {
  try {
    const t = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]"), e = Yg(t, new Set(zn.map((n) => n.id)), new Set([...Is].filter(([, n]) => n.liked).map(([n]) => n)));
    if (!e.length) {
      ue("No unimported saved songs were found in this browser.");
      return;
    }
    Qg(e.slice(0, 25).map((n) => ({ id: n, liked: !0 }))), e.length > 25 && (bt("review-note").textContent = `Showing the first 25 of ${e.length} remaining favourites. After confirmation, import again to review the next batch.`);
  } catch {
    ue("Saved favourites could not be read.");
  }
};
bt("cancel").onclick = () => bt("review").close();
bt("approve").onclick = async () => {
  if (On || $r || Xi()) return;
  const t = Zg.filter((e) => {
    var n;
    return (n = bt("choices").querySelector(`input[data-id="${e.id}"]`)) == null ? void 0 : n.checked;
  });
  try {
    const e = ur.getSession();
    if (e.address !== Xg || e.address !== vl) throw Error("Wallet changed. Review these songs again.");
    const n = P6(Xt.contract, t, e), r = vr();
    On = !0, Zi(), bt("review").close(), ue("Review the network fee in your wallet. No platform fee or token transfer is requested."), await new Promise((s, i) => U6({ ...n, onFinish: (o) => {
      const a = String(o.txId || "");
      if (!/^(0x)?[0-9a-f]{64}$/i.test(a)) {
        i(Error("Wallet did not return a transaction ID. Check your wallet before trying again."));
        return;
      }
      const c = a.startsWith("0x") ? a : "0x" + a;
      Yi.set(r, c);
      try {
        localStorage.setItem(r, c);
      } catch {
        ue("Transaction submitted: " + c + ". Save this ID; browser storage is unavailable.");
      }
      s();
    }, onCancel: () => i(Error("Cancelled. No on-chain change was requested.")), onError: i })), ue("Submitted. Your totals will change after confirmation. Use Refresh to check progress.");
  } catch (e) {
    ue(e instanceof Error ? e.message : "Wallet request failed.");
  } finally {
    On = !1, Zi();
  }
};
vo();
const T6 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", D6 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, k6 = () => D6() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, O6 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, F6 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Jg = class {
  constructor(t) {
    K4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Yh(t), this.callback(uo(t));
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
    const t = k6(), e = O6(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return R("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, R("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), R("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, R("div", { class: "flex flex-col space-y-[10px]" }, R("div", { class: "flex items-center" }, R("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), R("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, R("span", { class: "sr-only" }, "Close popup"), R("img", { src: T6 }))), r ? R("p", null, "Select the wallet you want to connect to.") : R("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && R("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && R("div", { class: "mt-6" }, R("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), R("ul", { class: "space-y-3" }, this.installedProviders.map((i) => R("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, R("div", { class: "aspect-square basis-9 overflow-hidden" }, R("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), R("div", { class: "flex-1" }, R("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && R("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), R("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && R("div", { class: "mt-6" }, r ? R("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : R("div", { class: "mb-5 flex justify-between" }, R("p", { class: "text-sm font-medium" }, "Recommended wallets"), R("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, R("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, R("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), R("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), R("p", null, "What is a wallet? ", R("span", { class: "align-text-bottom text-[9px]" }, "↗")))), R("ul", { class: "space-y-3" }, n.map((i) => R("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, R("div", { class: "aspect-square basis-9 overflow-hidden" }, R("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), R("div", { class: "flex-1" }, R("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && R("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && R("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return L4(this);
  }
};
Jg.style = F6;
const j6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Jg
}, Symbol.toStringTag, { value: "Module" }));
