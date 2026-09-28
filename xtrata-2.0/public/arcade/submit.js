var Tp = Object.defineProperty;
var Np = (e, t, n) => t in e ? Tp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Hc = (e, t, n) => Np(e, typeof t != "symbol" ? t + "" : t, n);
const Up = ["SP", "SM"], Pp = ["ST", "SN"], n0 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Up.includes(n) ? "mainnet" : Pp.includes(n) ? "testnet" : null;
}, Dp = () => {
  const e = /* @__PURE__ */ new Map();
  return {
    getItem: (t) => e.get(t) ?? null,
    setItem: (t, n) => {
      e.set(t, n);
    },
    removeItem: (t) => {
      e.delete(t);
    }
  };
}, kp = () => typeof window > "u" || !window.localStorage ? Dp() : window.localStorage, Mc = "xtrata.v15.1.wallet.session", Eu = "mainnet", oa = { isConnected: !1 }, Op = (e) => e.address ? n0(e.address) ?? e.network : e.network, kh = (e) => !e.isConnected || !e.address ? { ...oa } : Op(e) !== Eu ? { ...oa } : {
  isConnected: !0,
  address: e.address,
  network: Eu,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, Fp = (e) => {
  if (!e)
    return { ...oa };
  try {
    const t = JSON.parse(e);
    return kh(t);
  } catch {
    return { ...oa };
  }
}, jp = (e) => {
  const t = kh(e);
  return JSON.stringify(t);
}, zp = (e) => {
  const t = kp();
  return {
    load: () => Fp(t.getItem(Mc)),
    save: (n) => {
      t.setItem(Mc, jp(n));
    },
    clear: () => {
      t.removeItem(Mc);
    }
  };
};
function Rp(e) {
  return (e || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function Vp(e, t, n, r) {
  const s = `${e}|${t ?? ""}|${n ?? ""}|${Rp(r)}`;
  let i = 2166136261, o = 522970236;
  for (let u = 0; u < s.length; u += 1) {
    const h = s.charCodeAt(u);
    i = Math.imul(i ^ h, 16777619), o = Math.imul(o ^ (h << 5 | h >>> 3), 16777619);
  }
  const l = (u) => (u >>> 0).toString(16).padStart(8, "0");
  return (l(i) + l(o)).slice(0, 16);
}
function Oh(e) {
  if (e == null) return "";
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  const t = e;
  if (typeof t.message == "string") return t.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function Gp(e) {
  return e instanceof Error ? e.stack ?? void 0 : void 0;
}
const _c = (e) => {
  if (typeof e == "number" || typeof e == "boolean") return e;
  if (typeof e == "string" && e.length > 0) return e.slice(0, 300);
};
function Kp(e) {
  if (!e || typeof e != "object") return;
  const t = e, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = _c(t[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = t.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = _c(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = _c(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function Wp(e, t) {
  const n = (e == null ? void 0 : e.name) ?? "", r = e == null ? void 0 : e.code, s = Oh(e).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const Yp = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", qp = 20, Iu = "xt_tel_sid";
function aa() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Tc = null;
function Xp() {
  try {
    if (typeof sessionStorage < "u") {
      let e = sessionStorage.getItem(Iu);
      return e || (e = aa(), sessionStorage.setItem(Iu, e)), e;
    }
  } catch {
  }
  return Tc || (Tc = aa()), Tc;
}
let Us = {
  address: null,
  kind: null
}, Fh = null;
function r0(e, t) {
  if (!e) {
    Us = { address: null, kind: t ?? Us.kind };
    return;
  }
  Us = { address: e.trim(), kind: t ?? Us.kind };
}
function s0(e) {
  Fh = typeof e == "string" && e.length > 0 ? e : null;
}
const $u = [];
class Zp {
  constructor(t, n) {
    Hc(this, "id", aa());
    Hc(this, "n", 0);
    this.flow = t, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function Qp(e, t) {
  return new Zp(e, t);
}
function Bi(e) {
  try {
    const t = e.journey, n = e.flow ?? (t == null ? void 0 : t.flow) ?? "app", r = e.outcome === "error", s = e.error != null ? Oh(e.error) : void 0, i = e.error != null ? Gp(e.error) : void 0, o = r ? Vp(n, e.step, e.errorCode, s ?? "") : void 0, l = r ? Kp(e.error) : void 0, u = {
      ...l ? { error: l } : {},
      ...e.context ?? {}
    };
    r && $u.length && (u.breadcrumbs = $u.slice(-qp));
    const h = {
      eventId: aa(),
      ts: Date.now(),
      sessionId: Xp(),
      journeyId: e.journeyId ?? (t == null ? void 0 : t.id) ?? null,
      attempt: e.attempt ?? 1,
      flow: n,
      step: e.step ?? null,
      outcome: e.outcome,
      severity: e.severity ?? (r ? "error" : "info"),
      target: e.target ?? (t == null ? void 0 : t.target) ?? null,
      durationMs: e.durationMs ?? null,
      errorCode: e.errorCode ?? null,
      errorFingerprint: o ?? null,
      errorMessage: s ?? null,
      errorStack: i ?? null,
      appVersion: Yp,
      route: e.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Us.address,
      walletKind: Us.kind,
      network: Fh,
      context: Object.keys(u).length ? u : void 0
    };
  } catch {
  }
}
const Jp = "https://browser.blockstack.org/auth", e2 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, jh = ["store_write"], t2 = "blockstack-session", n2 = {
  logLevel: "debug"
}, ms = {
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
Object.freeze(ms);
class oi extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
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

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class r2 extends oi {
  constructor(t, n = "") {
    super({ code: ms.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Cu extends oi {
  constructor(t = "") {
    super({ code: ms.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Co extends oi {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: ms.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Lu extends oi {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: ms.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class nl extends oi {
  constructor(t) {
    super({ code: ms.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class zh extends oi {
  constructor(t) {
    super({ code: ms.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Bu = ["debug", "info", "warn", "error", "none"], rl = {};
for (let e = 0; e < Bu.length; e++) {
  const t = Bu[e];
  rl[t] = e;
}
class Ps {
  static error(t) {
    this.shouldLog("error") && console.error(this.logMessage("error", t));
  }
  static warn(t) {
    this.shouldLog("warn") && console.warn(this.logMessage("warn", t));
  }
  static info(t) {
    this.shouldLog("info") && console.log(this.logMessage("info", t));
  }
  static debug(t) {
    this.shouldLog("debug") && console.log(this.logMessage("debug", t));
  }
  static logMessage(t, n) {
    return `[${t.toUpperCase()}] ${n}`;
  }
  static shouldLog(t) {
    return rl[n2.logLevel] <= rl[t];
  }
}
function s2() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function i2() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Nc(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function o2() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function a2() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function c2(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function i0(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = a2(), s) {
      const i = s[e];
      if (i)
        return i;
    }
  } catch (i) {
    Ps.error(`Error getting object '${e}' from global scope '${s}': ${i}`);
  }
  if (t) {
    const i = c2(s, e.toString(), n);
    throw Ps.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Pr(e, t) {
  return o0(lt(e), t);
}
function lt(e) {
  if (typeof e == "bigint")
    return e;
  if (typeof e == "string")
    return BigInt(e);
  if (typeof e == "number") {
    if (!Number.isInteger(e))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (e > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(e);
  }
  if (It(e, Uint8Array))
    return BigInt(`0x${ee(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function l2(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Hu(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function qi(e, t = 8) {
  return (typeof e == "bigint" ? e : lt(e)).toString(16).padStart(t * 2, "0");
}
function Na(e) {
  return parseInt(e, 16);
}
function o0(e, t = 16) {
  const n = qi(e, t);
  return we(n);
}
function u2(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function f2(e, t) {
  return e & BigInt(1) << t;
}
function sl(e) {
  return h2(BigInt(`0x${ee(e)}`), BigInt(e.byteLength * 8));
}
function h2(e, t) {
  return f2(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const d2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ee(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += d2[n];
  return t;
}
function we(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = l2(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function Ss(e) {
  return new TextEncoder().encode(e);
}
function Xi(e) {
  return new TextDecoder().decode(e);
}
function g2(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function p2(e) {
  return String.fromCharCode.apply(null, e);
}
function b2(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Mu(e) {
  if (e.some(b2))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Bn(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Re(e) {
  return Bn(...e.map((t) => typeof t == "number" ? Mu([t]) : t instanceof Array ? Mu(t) : t));
}
function It(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Rh = "https://api.mainnet.hiro.so", Vh = "https://api.testnet.hiro.so", Gh = "http://localhost:3999", y2 = "https://hub.blockstack.org", x2 = 33, Uc = 32;
function w2(e) {
  if (e.length < Uc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Uc * 2), r = e.slice(2 + Uc * 2);
  return {
    recoveryId: Na(t),
    r: n,
    s: r
  };
}
function a0(e) {
  const t = typeof e == "string" ? we(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function m2(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function S2(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function A2(e, t) {
  return e[t];
}
function v2(e, t, n = 0) {
  return e[n] = t, e;
}
function E2(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function os(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const I2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function $2(e, t) {
  const n = {};
  return Object.assign(n, I2, t), await fetch(e, n);
}
function C2(e) {
  let t = $2, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function L2(...e) {
  const { fetchLib: t, middlewares: n } = C2(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const u of n)
      typeof u.pre == "function" && (o = await Promise.resolve(u.pre({
        fetch: t,
        ...o
      })) ?? o);
    let l = await t(o.url, o.init);
    for (const u of n)
      typeof u.post == "function" && (l = await Promise.resolve(u.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (l == null ? void 0 : l.clone()) ?? l
      })) ?? l);
    return l;
  };
}
class Ua {
  constructor(t = jh.slice(), n = ((l) => (l = i0("location", { returnEmptyObject: !0 })) == null ? void 0 : l.origin)(), r = "", s = "/manifest.json", i = void 0, o = Jp) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function il(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function B2(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Kh(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function H2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  il(e.outputLen), il(e.blockLen);
}
function M2(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function _2(e, t) {
  Kh(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xr = {
  number: il,
  bool: B2,
  bytes: Kh,
  hash: H2,
  exists: M2,
  output: _2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pc = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), yn = (e, t) => e << 32 - t | e >>> t, T2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!T2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function N2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function c0(e) {
  if (typeof e == "string" && (e = N2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Wh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function As(e) {
  const t = (r) => e().update(c0(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Yh = class extends Wh {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Xr.hash(t);
    const r = c0(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return Xr.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Xr.exists(this), Xr.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: l } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = l, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Pa = (e, t, n) => new Yh(e, t).update(n).digest();
Pa.create = (e, t) => new Yh(e, t);
function U2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), l = Number(n & i), u = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + u, o, r), e.setUint32(t + h, l, r);
}
let l0 = class extends Wh {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Pc(this.buffer);
  }
  update(t) {
    Xr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = c0(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const l = Math.min(s - this.pos, i - o);
      if (l === s) {
        const u = Pc(t);
        for (; s <= i - o; o += s)
          this.process(u, o);
        continue;
      }
      r.set(t.subarray(o, o + l), this.pos), this.pos += l, o += l, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Xr.exists(this), Xr.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let f = o; f < s; f++)
      n[f] = 0;
    U2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = Pc(t), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = u / 4, d = this.get();
    if (h > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < h; f++)
      l.setUint32(4 * f, d[f], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: l } = this;
    return t.length = s, t.pos = l, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const P2 = (e, t, n) => e & t ^ ~e & n, D2 = (e, t, n) => e & t ^ e & n ^ t & n, k2 = new Uint32Array([
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
]), ir = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), or = new Uint32Array(64);
let qh = class extends l0 {
  constructor() {
    super(64, 32, 8, !1), this.A = ir[0] | 0, this.B = ir[1] | 0, this.C = ir[2] | 0, this.D = ir[3] | 0, this.E = ir[4] | 0, this.F = ir[5] | 0, this.G = ir[6] | 0, this.H = ir[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: l, H: u } = this;
    return [t, n, r, s, i, o, l, u];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = l | 0, this.H = u | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      or[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const x = or[f - 15], p = or[f - 2], A = yn(x, 7) ^ yn(x, 18) ^ x >>> 3, S = yn(p, 17) ^ yn(p, 19) ^ p >>> 10;
      or[f] = S + or[f - 7] + A + or[f - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: l, F: u, G: h, H: d } = this;
    for (let f = 0; f < 64; f++) {
      const x = yn(l, 6) ^ yn(l, 11) ^ yn(l, 25), p = d + x + P2(l, u, h) + k2[f] + or[f] | 0, S = (yn(r, 2) ^ yn(r, 13) ^ yn(r, 22)) + D2(r, s, i) | 0;
      d = h, h = u, u = l, l = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, l = l + this.E | 0, u = u + this.F | 0, h = h + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, l, u, h, d);
  }
  roundClean() {
    or.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O2 = class extends qh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Rs = As(() => new qh());
As(() => new O2());
const F2 = {}, Xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: F2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const xe = BigInt(0), Te = BigInt(1), Mr = BigInt(2), _i = BigInt(3), _u = BigInt(8), $e = Object.freeze({
  a: xe,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Te,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Tu = (e, t) => (e + t / Mr) / t, Lo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = $e, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Te * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), l = Tu(i * e, t), u = Tu(-r * e, t);
    let h = V(e - l * n - u * s, t), d = V(-l * r - u * i, t);
    const f = h > o, x = d > o;
    if (f && (h = t - h), x && (d = t - d), h > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: f, k1: h, k2neg: x, k2: d };
  }
}, ln = 32, as = 32, Zh = 32, ca = ln + 1, la = 2 * ln + 1;
function Nu(e) {
  const { a: t, b: n } = $e, r = V(e * e), s = V(r * e);
  return V(s + t * e + n);
}
const Bo = $e.a === xe;
class u0 extends Error {
  constructor(t) {
    super(t);
  }
}
function Uu(e) {
  if (!(e instanceof me))
    throw new TypeError("JacobianPoint expected");
}
class me {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof pe))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(pe.ZERO) ? me.ZERO : new me(t.x, t.y, Te);
  }
  static toAffineBatch(t) {
    const n = G2(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return me.toAffineBatch(t).map(me.fromAffine);
  }
  equals(t) {
    Uu(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: l } = t, u = V(s * s), h = V(l * l), d = V(n * h), f = V(i * u), x = V(V(r * l) * h), p = V(V(o * s) * u);
    return d === f && x === p;
  }
  negate() {
    return new me(this.x, V(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = V(t * t), i = V(n * n), o = V(i * i), l = t + i, u = V(Mr * (V(l * l) - s - o)), h = V(_i * s), d = V(h * h), f = V(d - Mr * u), x = V(h * (u - f) - _u * o), p = V(Mr * n * r);
    return new me(f, x, p);
  }
  add(t) {
    Uu(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: l } = t;
    if (i === xe || o === xe)
      return this;
    if (n === xe || r === xe)
      return t;
    const u = V(s * s), h = V(l * l), d = V(n * h), f = V(i * u), x = V(V(r * l) * h), p = V(V(o * s) * u), A = V(f - d), S = V(p - x);
    if (A === xe)
      return S === xe ? this.double() : me.ZERO;
    const L = V(A * A), k = V(A * L), U = V(d * L), m = V(S * S - k - Mr * U), H = V(S * (U - m) - x * k), B = V(s * l * A);
    return new me(m, H, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = me.ZERO;
    if (typeof t == "bigint" && t === xe)
      return n;
    let r = ku(t);
    if (r === Te)
      return this;
    if (!Bo) {
      let f = n, x = this;
      for (; r > xe; )
        r & Te && (f = f.add(x)), x = x.double(), r >>= Te;
      return f;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: l } = Lo.splitScalar(r), u = n, h = n, d = this;
    for (; i > xe || l > xe; )
      i & Te && (u = u.add(d)), l & Te && (h = h.add(d)), d = d.double(), i >>= Te, l >>= Te;
    return s && (u = u.negate()), o && (h = h.negate()), h = new me(V(h.x * Lo.beta), h.y, h.z), u.add(h);
  }
  precomputeWindow(t) {
    const n = Bo ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let l = 1; l < 2 ** (t - 1); l++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(me.BASE) && (n = pe.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && ol.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = me.normalizeZ(s), ol.set(n, s)));
    let i = me.ZERO, o = me.BASE;
    const l = 1 + (Bo ? 128 / r : 256 / r), u = 2 ** (r - 1), h = BigInt(2 ** r - 1), d = 2 ** r, f = BigInt(r);
    for (let x = 0; x < l; x++) {
      const p = x * u;
      let A = Number(t & h);
      t >>= f, A > u && (A -= d, t += Te);
      const S = p, L = p + Math.abs(A) - 1, k = x % 2 !== 0, U = A < 0;
      A === 0 ? o = o.add(Ho(k, s[S])) : i = i.add(Ho(U, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(t, n) {
    let r = ku(t), s, i;
    if (Bo) {
      const { k1neg: o, k1: l, k2neg: u, k2: h } = Lo.splitScalar(r);
      let { p: d, f } = this.wNAF(l, n), { p: x, f: p } = this.wNAF(h, n);
      d = Ho(o, d), x = Ho(u, x), x = new me(V(x.x * Lo.beta), x.y, x.z), s = d.add(x), i = f.add(p);
    } else {
      const { p: o, f: l } = this.wNAF(r, n);
      s = o, i = l;
    }
    return me.normalizeZ([s, i])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, i = this.equals(me.ZERO);
    t == null && (t = i ? _u : ai(s));
    const o = t, l = V(o * o), u = V(l * o), h = V(n * l), d = V(r * u), f = V(s * o);
    if (i)
      return pe.ZERO;
    if (f !== Te)
      throw new Error("invZ was invalid");
    return new pe(h, d);
  }
}
me.BASE = new me($e.Gx, $e.Gy, Te);
me.ZERO = new me(xe, Te, xe);
function Ho(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const ol = /* @__PURE__ */ new WeakMap();
class pe {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, ol.delete(this);
  }
  hasEvenY() {
    return this.y % Mr === xe;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = Nt(n ? t : t.subarray(1));
    if (!Jo(r))
      throw new Error("Point is not on curve");
    const s = Nu(r);
    let i = V2(s);
    const o = (i & Te) === Te;
    n ? o && (i = V(-i)) : (t[0] & 1) === 1 !== o && (i = V(-i));
    const l = new pe(r, i);
    return l.assertValidity(), l;
  }
  static fromUncompressedHex(t) {
    const n = Nt(t.subarray(1, ln + 1)), r = Nt(t.subarray(ln + 1, ln * 2 + 1)), s = new pe(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Hn(t), r = n.length, s = n[0];
    if (r === ln)
      return this.fromCompressedHex(n);
    if (r === ca && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === la && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ca} compressed bytes or ${la} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return pe.BASE.multiply(cs(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: i } = ed(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = f0(Hn(t)), { n: l } = $e, u = r === 2 || r === 3 ? s + l : s, h = ai(u, l), d = V(-o * h, l), f = V(i * h, l), x = r & 1 ? "03" : "02", p = pe.fromHex(x + Tr(u)), A = pe.BASE.multiplyAndAddUnsafe(p, d, f);
    if (!A)
      throw new Error("Cannot recover signature: point at infinify");
    return A.assertValidity(), A;
  }
  toRawBytes(t = !1) {
    return Nr(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Tr(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Tr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Jo(n) || !Jo(r))
      throw new Error(t);
    const s = V(r * r), i = Nu(n);
    if (V(s - i) !== xe)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new pe(this.x, V(-this.y));
  }
  double() {
    return me.fromAffine(this).double().toAffine();
  }
  add(t) {
    return me.fromAffine(this).add(me.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return me.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = me.fromAffine(this), i = n === xe || n === Te || this !== pe.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = me.fromAffine(t).multiplyUnsafe(r), l = i.add(o);
    return l.equals(me.ZERO) ? void 0 : l.toAffine();
  }
}
pe.BASE = new pe($e.Gx, $e.Gy);
pe.ZERO = new pe(xe, xe);
function Pu(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Du(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Vs(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Nt(n), left: e.subarray(t + 2) };
}
function j2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Vs(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Du(e.subarray(2)), { data: r, left: s } = Du(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Vs(s)}`);
  return { r: t, s: r };
}
class Tt {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Vs(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Tt(ua(s.slice(0, 64)), ua(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = j2(n ? t : Nr(t));
    return new Tt(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Ks(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ks(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = $e.n >> Te;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Tt(this.r, V(-this.s, $e.n)) : this;
  }
  toDERRawBytes() {
    return Nr(this.toDERHex());
  }
  toDERHex() {
    const t = Pu(Ii(this.s)), n = Pu(Ii(this.r)), r = t.length / 2, s = n.length / 2, i = Ii(r), o = Ii(s);
    return `30${Ii(s + r + 4)}02${o}${n}02${i}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Nr(this.toCompactHex());
  }
  toCompactHex() {
    return Tr(this.r) + Tr(this.s);
  }
}
function Br(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
const z2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Vs(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += z2[e[n]];
  return t;
}
const R2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Tr(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(xe <= e && e < R2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Gs(e) {
  const t = Nr(Tr(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Ii(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function ua(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Nr(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function Nt(e) {
  return ua(Vs(e));
}
function Hn(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Nr(e);
}
function ku(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Ks(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function V(e, t = $e.P) {
  const n = e % t;
  return n >= xe ? n : t + n;
}
function Rt(e, t) {
  const { P: n } = $e;
  let r = e;
  for (; t-- > xe; )
    r *= r, r %= n;
  return r;
}
function V2(e) {
  const { P: t } = $e, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), l = BigInt(88), u = e * e * e % t, h = u * u * e % t, d = Rt(h, _i) * h % t, f = Rt(d, _i) * h % t, x = Rt(f, Mr) * u % t, p = Rt(x, r) * x % t, A = Rt(p, s) * p % t, S = Rt(A, o) * A % t, L = Rt(S, l) * S % t, k = Rt(L, o) * A % t, U = Rt(k, _i) * h % t, m = Rt(U, i) * p % t, H = Rt(m, n) * u % t, B = Rt(H, Mr);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function ai(e, t = $e.P) {
  if (e === xe || t <= xe)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = V(e, t), r = t, s = xe, i = Te;
  for (; n !== xe; ) {
    const l = r / n, u = r % n, h = s - i * l;
    r = n, n = u, s = i, i = h;
  }
  if (r !== Te)
    throw new Error("invert: does not exist");
  return V(s, t);
}
function G2(e, t = $e.P) {
  const n = new Array(e.length), r = e.reduce((i, o, l) => o === xe ? i : (n[l] = i, V(i * o, t)), Te), s = ai(r, t);
  return e.reduceRight((i, o, l) => o === xe ? i : (n[l] = V(i * n[l], t), V(i * o, t)), s), n;
}
function K2(e) {
  const t = e.length * 8 - as * 8, n = Nt(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function f0(e, t = !1) {
  const n = K2(e);
  if (t)
    return n;
  const { n: r } = $e;
  return n >= r ? n - r : n;
}
let Fs, Ti;
class Qh {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return ze.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return Ti(this.k, ...t);
  }
  checkSync() {
    if (typeof Ti != "function")
      throw new u0("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(t = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), t), this.v = await this.hmac(this.v), t.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), t), this.v = await this.hmac(this.v));
  }
  reseedSync(t = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), t), this.v = this.hmacSync(this.v), t.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), t), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return Br(...n);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return Br(...n);
  }
}
function Ks(e) {
  return xe < e && e < $e.n;
}
function Jo(e) {
  return xe < e && e < $e.P;
}
function Jh(e, t, n, r = !0) {
  const { n: s } = $e, i = f0(e, !0);
  if (!Ks(i))
    return;
  const o = ai(i, s), l = pe.BASE.multiply(i), u = V(l.x, s);
  if (u === xe)
    return;
  const h = V(o * V(t + n * u, s), s);
  if (h === xe)
    return;
  let d = new Tt(u, h), f = (l.x === d.r ? 0 : 2) | Number(l.y & Te);
  return r && d.hasHighS() && (d = d.normalizeS(), f ^= 1), { sig: d, recovery: f };
}
function cs(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * as)
      throw new Error("Expected 32 bytes of private key");
    t = ua(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== as)
      throw new Error("Expected 32 bytes of private key");
    t = Nt(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ks(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function h0(e) {
  return e instanceof pe ? (e.assertValidity(), e) : pe.fromHex(e);
}
function ed(e) {
  if (e instanceof Tt)
    return e.assertValidity(), e;
  try {
    return Tt.fromDER(e);
  } catch {
    return Tt.fromCompact(e);
  }
}
function Zi(e, t = !1) {
  return pe.fromPrivateKey(e).toRawBytes(t);
}
function W2(e, t, n, r = !1) {
  return pe.fromSignature(e, t, n).toRawBytes(r);
}
function Ou(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === ca || r === la : n ? r === ca * 2 || r === la * 2 : e instanceof pe;
}
function d0(e, t, n = !1) {
  if (Ou(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ou(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = h0(t);
  return r.assertValidity(), r.multiply(cs(e)).toRawBytes(n);
}
function td(e) {
  const t = e.length > ln ? e.slice(0, ln) : e;
  return Nt(t);
}
function Y2(e) {
  const t = td(e), n = V(t, $e.n);
  return nd(n < xe ? t : n);
}
function nd(e) {
  return Gs(e);
}
function rd(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Hn(e), s = cs(t), i = [nd(s), Y2(r)];
  if (n != null) {
    n === !0 && (n = ze.randomBytes(ln));
    const u = Hn(n);
    if (u.length !== ln)
      throw new Error(`sign: Expected ${ln} bytes of extra data`);
    i.push(u);
  }
  const o = Br(...i), l = td(r);
  return { seed: o, m: l, d: s };
}
function sd(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, t), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function q2(e, t, n = {}) {
  const { seed: r, m: s, d: i } = rd(e, t, n.extraEntropy), o = new Qh(Zh, as);
  await o.reseed(r);
  let l;
  for (; !(l = Jh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return sd(l, n);
}
function Da(e, t, n = {}) {
  const { seed: r, m: s, d: i } = rd(e, t, n.extraEntropy), o = new Qh(Zh, as);
  o.reseedSync(r);
  let l;
  for (; !(l = Jh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return sd(l, n);
}
const X2 = { strict: !0 };
function Z2(e, t, n, r = X2) {
  let s;
  try {
    s = ed(e), t = Hn(t);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const l = f0(t);
  let u;
  try {
    u = h0(n);
  } catch {
    return !1;
  }
  const { n: h } = $e, d = ai(o, h), f = V(l * d, h), x = V(i * d, h), p = pe.BASE.multiplyAndAddUnsafe(u, f, x);
  return p ? V(p.x, h) === i : !1;
}
function fa(e) {
  return V(Nt(e), $e.n);
}
class Ws {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Hn(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Nt(n.subarray(0, 32)), s = Nt(n.subarray(32, 64));
    return new Ws(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Jo(t) || !Ks(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Tr(this.r) + Tr(this.s);
  }
  toRawBytes() {
    return Nr(this.toHex());
  }
}
function Q2(e) {
  return pe.fromPrivateKey(e).toRawX();
}
class id {
  constructor(t, n, r = ze.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Hn(t);
    const { x: s, scalar: i } = this.getScalar(cs(n));
    if (this.px = s, this.d = i, this.rand = Hn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = pe.fromPrivateKey(t), r = n.hasEvenY() ? t : $e.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Gs(t ^ Nt(n));
  }
  finalizeNonce(t) {
    const n = V(Nt(t), $e.n);
    if (n === xe)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(t, n, r, s) {
    return new Ws(t.x, V(n + r * s, $e.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, i = ze.taggedHash, o = this.initNonce(n, await i(Lr.aux, s)), { R: l, rx: u, k: h } = this.finalizeNonce(await i(Lr.nonce, o, r, t)), d = fa(await i(Lr.challenge, u, r, t)), f = this.finalizeSig(l, h, d, n);
    return await cd(f, t, r) || this.error(), f;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, i = ze.taggedHashSync, o = this.initNonce(n, i(Lr.aux, s)), { R: l, rx: u, k: h } = this.finalizeNonce(i(Lr.nonce, o, r, t)), d = fa(i(Lr.challenge, u, r, t)), f = this.finalizeSig(l, h, d, n);
    return ld(f, t, r) || this.error(), f;
  }
}
async function J2(e, t, n) {
  return new id(e, t, n).calc();
}
function eb(e, t, n) {
  return new id(e, t, n).calcSync();
}
function od(e, t, n) {
  const r = e instanceof Ws, s = r ? e : Ws.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Hn(t),
    P: h0(n)
  };
}
function ad(e, t, n, r) {
  const s = pe.BASE.multiplyAndAddUnsafe(t, cs(n), V(-r, $e.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function cd(e, t, n) {
  try {
    const { r, s, m: i, P: o } = od(e, t, n), l = fa(await ze.taggedHash(Lr.challenge, Gs(r), o.toRawX(), i));
    return ad(r, o, s, l);
  } catch {
    return !1;
  }
}
function ld(e, t, n) {
  try {
    const { r, s, m: i, P: o } = od(e, t, n), l = fa(ze.taggedHashSync(Lr.challenge, Gs(r), o.toRawX(), i));
    return ad(r, o, s, l);
  } catch (r) {
    if (r instanceof u0)
      throw r;
    return !1;
  }
}
const tb = {
  Signature: Ws,
  getPublicKey: Q2,
  sign: J2,
  verify: cd,
  signSync: eb,
  verifySync: ld
};
pe.BASE._setWindowSize(8);
const Lt = {
  node: Xh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Lr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Mo = {}, ze = {
  bytesToHex: Vs,
  hexToBytes: Nr,
  concatBytes: Br,
  mod: V,
  invert: ai,
  isValidPrivateKey(e) {
    try {
      return cs(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Gs,
  _normalizePrivateKey: cs,
  hashToPrivateKey: (e) => {
    e = Hn(e);
    const t = as + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = V(Nt(e), $e.n - Te) + Te;
    return Gs(n);
  },
  randomBytes: (e = 32) => {
    if (Lt.web)
      return Lt.web.getRandomValues(new Uint8Array(e));
    if (Lt.node) {
      const { randomBytes: t } = Lt.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ze.hashToPrivateKey(ze.randomBytes(as + 8)),
  precompute(e = 8, t = pe.BASE) {
    const n = t === pe.BASE ? t : new pe(t.x, t.y);
    return n._setWindowSize(e), n.multiply(_i), n;
  },
  sha256: async (...e) => {
    if (Lt.web) {
      const t = await Lt.web.subtle.digest("SHA-256", Br(...e));
      return new Uint8Array(t);
    } else if (Lt.node) {
      const { createHash: t } = Lt.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Lt.web) {
      const n = await Lt.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Br(...t), s = await Lt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Lt.node) {
      const { createHmac: n } = Lt.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Mo[e];
    if (n === void 0) {
      const r = await ze.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Br(r, r), Mo[e] = n;
    }
    return ze.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Fs != "function")
      throw new u0("sha256Sync is undefined, you need to set it");
    let n = Mo[e];
    if (n === void 0) {
      const r = Fs(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Br(r, r), Mo[e] = n;
    }
    return Fs(n, ...t);
  },
  _JacobianPoint: me
};
Object.defineProperties(ze, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Fs;
    },
    set(e) {
      Fs || (Fs = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ti;
    },
    set(e) {
      Ti || (Ti = e);
    }
  }
});
const nb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: $e,
  Point: pe,
  Signature: Tt,
  getPublicKey: Zi,
  getSharedSecret: d0,
  recoverPublicKey: W2,
  schnorr: tb,
  sign: q2,
  signSync: Da,
  utils: ze,
  verify: Z2
}, Symbol.toStringTag, { value: "Module" }));
var xt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ud(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function fd(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var Qi = {};
Qi.byteLength = ab;
var rb = Qi.toByteArray = lb, sb = Qi.fromByteArray = hb, vn = [], Vt = [], ib = typeof Uint8Array < "u" ? Uint8Array : Array, Dc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ns = 0, ob = Dc.length; Ns < ob; ++Ns)
  vn[Ns] = Dc[Ns], Vt[Dc.charCodeAt(Ns)] = Ns;
Vt[45] = 62;
Vt[95] = 63;
function hd(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function ab(e) {
  var t = hd(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function cb(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function lb(e) {
  var t, n = hd(e), r = n[0], s = n[1], i = new ib(cb(e, r, s)), o = 0, l = s > 0 ? r - 4 : r, u;
  for (u = 0; u < l; u += 4)
    t = Vt[e.charCodeAt(u)] << 18 | Vt[e.charCodeAt(u + 1)] << 12 | Vt[e.charCodeAt(u + 2)] << 6 | Vt[e.charCodeAt(u + 3)], i[o++] = t >> 16 & 255, i[o++] = t >> 8 & 255, i[o++] = t & 255;
  return s === 2 && (t = Vt[e.charCodeAt(u)] << 2 | Vt[e.charCodeAt(u + 1)] >> 4, i[o++] = t & 255), s === 1 && (t = Vt[e.charCodeAt(u)] << 10 | Vt[e.charCodeAt(u + 1)] << 4 | Vt[e.charCodeAt(u + 2)] >> 2, i[o++] = t >> 8 & 255, i[o++] = t & 255), i;
}
function ub(e) {
  return vn[e >> 18 & 63] + vn[e >> 12 & 63] + vn[e >> 6 & 63] + vn[e & 63];
}
function fb(e, t, n) {
  for (var r, s = [], i = t; i < n; i += 3)
    r = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255), s.push(ub(r));
  return s.join("");
}
function hb(e) {
  for (var t, n = e.length, r = n % 3, s = [], i = 16383, o = 0, l = n - r; o < l; o += i)
    s.push(fb(e, o, o + i > l ? l : o + i));
  return r === 1 ? (t = e[n - 1], s.push(
    vn[t >> 2] + vn[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    vn[t >> 10] + vn[t >> 4 & 63] + vn[t << 2 & 63] + "="
  )), s.join("");
}
function db() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const gb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function pb() {
  if (db())
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
    throw new Error(gb);
  }
}
class bb {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createCipher(t, n, r), o = new Uint8Array(Bn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createDecipher(t, n, r), o = new Uint8Array(Bn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class yb {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let i, o;
    if (t === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (t === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const l = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), u = await this.subtleCrypto.encrypt({ name: i, iv: r }, l, s);
    return new Uint8Array(u);
  }
  async decrypt(t, n, r, s) {
    let i, o;
    if (t === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (t === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const l = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), u = await this.subtleCrypto.decrypt({ name: i, iv: r }, l, s);
    return new Uint8Array(u);
  }
}
async function dd() {
  const e = await pb();
  return e.name === "subtleCrypto" ? new yb(e.lib) : new bb(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function xb(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), i = s.charCodeAt(0);
    if (t[i] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[i] = r;
  }
  var o = e.length, l = e.charAt(0), u = Math.log(o) / Math.log(256), h = Math.log(256) / Math.log(o);
  function d(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var A = 0, S = 0, L = 0, k = p.length; L !== k && p[L] === 0; )
      L++, A++;
    for (var U = (k - L) * h + 1 >>> 0, m = new Uint8Array(U); L !== k; ) {
      for (var H = p[L], B = 0, j = U - 1; (H !== 0 || B < S) && j !== -1; j--, B++)
        H += 256 * m[j] >>> 0, m[j] = H % o >>> 0, H = H / o >>> 0;
      if (H !== 0)
        throw new Error("Non-zero carry");
      S = B, L++;
    }
    for (var Q = U - S; Q !== U && m[Q] === 0; )
      Q++;
    for (var z = l.repeat(A); Q < U; ++Q)
      z += e.charAt(m[Q]);
    return z;
  }
  function f(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var A = 0, S = 0, L = 0; p[A] === l; )
      S++, A++;
    for (var k = (p.length - A) * u + 1 >>> 0, U = new Uint8Array(k); p[A]; ) {
      var m = p.charCodeAt(A);
      if (m > 255)
        return;
      var H = t[m];
      if (H === 255)
        return;
      for (var B = 0, j = k - 1; (H !== 0 || B < L) && j !== -1; j--, B++)
        H += o * U[j] >>> 0, U[j] = H % 256 >>> 0, H = H / 256 >>> 0;
      if (H !== 0)
        throw new Error("Non-zero carry");
      L = B, A++;
    }
    for (var Q = k - L; Q !== k && U[Q] === 0; )
      Q++;
    for (var z = new Uint8Array(S + (k - Q)), F = S; Q !== k; )
      z[F++] = U[Q++];
    return z;
  }
  function x(p) {
    var A = f(p);
    if (A)
      return A;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: f,
    decode: x
  };
}
var gd = xb;
const wb = gd, mb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Sb = wb(mb);
const Ab = /* @__PURE__ */ ud(Sb), vb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pd = Uint8Array.from({ length: 16 }, (e, t) => t), Eb = pd.map((e) => (9 * e + 5) % 16);
let g0 = [pd], p0 = [Eb];
for (let e = 0; e < 4; e++)
  for (let t of [g0, p0])
    t.push(t[e].map((n) => vb[n]));
const bd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Ib = g0.map((e, t) => e.map((n) => bd[t][n])), $b = p0.map((e, t) => e.map((n) => bd[t][n])), Cb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Lb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _o = (e, t) => e << t | e >>> 32 - t;
function Fu(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const To = new Uint32Array(16);
let Bb = class extends l0 {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      To[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, l = this.h2 | 0, u = l, h = this.h3 | 0, d = h, f = this.h4 | 0, x = f;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, S = Cb[p], L = Lb[p], k = g0[p], U = p0[p], m = Ib[p], H = $b[p];
      for (let B = 0; B < 16; B++) {
        const j = _o(r + Fu(p, i, l, h) + To[k[B]] + S, m[B]) + f | 0;
        r = f, f = h, h = _o(l, 10) | 0, l = i, i = j;
      }
      for (let B = 0; B < 16; B++) {
        const j = _o(s + Fu(A, o, u, d) + To[U[B]] + L, H[B]) + x | 0;
        s = x, x = d, d = _o(u, 10) | 0, u = o, o = j;
      }
    }
    this.set(this.h1 + l + d | 0, this.h2 + h + x | 0, this.h3 + f + s | 0, this.h4 + r + o | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    To.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Hb = As(() => new Bb());
function Mb(e) {
  return Hb(e);
}
const No = BigInt(2 ** 32 - 1), al = BigInt(32);
function yd(e, t = !1) {
  return t ? { h: Number(e & No), l: Number(e >> al & No) } : { h: Number(e >> al & No) | 0, l: Number(e & No) | 0 };
}
function _b(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = yd(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Tb = (e, t) => BigInt(e >>> 0) << al | BigInt(t >>> 0), Nb = (e, t, n) => e >>> n, Ub = (e, t, n) => e << 32 - n | t >>> n, Pb = (e, t, n) => e >>> n | t << 32 - n, Db = (e, t, n) => e << 32 - n | t >>> n, kb = (e, t, n) => e << 64 - n | t >>> n - 32, Ob = (e, t, n) => e >>> n - 32 | t << 64 - n, Fb = (e, t) => t, jb = (e, t) => e, zb = (e, t, n) => e << n | t >>> 32 - n, Rb = (e, t, n) => t << n | e >>> 32 - n, Vb = (e, t, n) => t << n - 32 | e >>> 64 - n, Gb = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Kb(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Wb = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Yb = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, qb = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Xb = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Zb = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Qb = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, ce = {
  fromBig: yd,
  split: _b,
  toBig: Tb,
  shrSH: Nb,
  shrSL: Ub,
  rotrSH: Pb,
  rotrSL: Db,
  rotrBH: kb,
  rotrBL: Ob,
  rotr32H: Fb,
  rotr32L: jb,
  rotlSH: zb,
  rotlSL: Rb,
  rotlBH: Vb,
  rotlBL: Gb,
  add: Kb,
  add3L: Wb,
  add3H: Yb,
  add4L: qb,
  add4H: Xb,
  add5H: Qb,
  add5L: Zb
}, [Jb, ey] = ce.split([
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
].map((e) => BigInt(e))), ar = new Uint32Array(80), cr = new Uint32Array(80);
let ka = class extends l0 {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: l, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: p, Gl: A, Hh: S, Hl: L } = this;
    return [t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = l | 0, this.Dl = u | 0, this.Eh = h | 0, this.El = d | 0, this.Fh = f | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = S | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let m = 0; m < 16; m++, n += 4)
      ar[m] = t.getUint32(n), cr[m] = t.getUint32(n += 4);
    for (let m = 16; m < 80; m++) {
      const H = ar[m - 15] | 0, B = cr[m - 15] | 0, j = ce.rotrSH(H, B, 1) ^ ce.rotrSH(H, B, 8) ^ ce.shrSH(H, B, 7), Q = ce.rotrSL(H, B, 1) ^ ce.rotrSL(H, B, 8) ^ ce.shrSL(H, B, 7), z = ar[m - 2] | 0, F = cr[m - 2] | 0, E = ce.rotrSH(z, F, 19) ^ ce.rotrBH(z, F, 61) ^ ce.shrSH(z, F, 6), M = ce.rotrSL(z, F, 19) ^ ce.rotrBL(z, F, 61) ^ ce.shrSL(z, F, 6), R = ce.add4L(Q, M, cr[m - 7], cr[m - 16]), N = ce.add4H(R, j, E, ar[m - 7], ar[m - 16]);
      ar[m] = N | 0, cr[m] = R | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: l, Cl: u, Dh: h, Dl: d, Eh: f, El: x, Fh: p, Fl: A, Gh: S, Gl: L, Hh: k, Hl: U } = this;
    for (let m = 0; m < 80; m++) {
      const H = ce.rotrSH(f, x, 14) ^ ce.rotrSH(f, x, 18) ^ ce.rotrBH(f, x, 41), B = ce.rotrSL(f, x, 14) ^ ce.rotrSL(f, x, 18) ^ ce.rotrBL(f, x, 41), j = f & p ^ ~f & S, Q = x & A ^ ~x & L, z = ce.add5L(U, B, Q, ey[m], cr[m]), F = ce.add5H(z, k, H, j, Jb[m], ar[m]), E = z | 0, M = ce.rotrSH(r, s, 28) ^ ce.rotrBH(r, s, 34) ^ ce.rotrBH(r, s, 39), R = ce.rotrSL(r, s, 28) ^ ce.rotrBL(r, s, 34) ^ ce.rotrBL(r, s, 39), N = r & i ^ r & l ^ i & l, te = s & o ^ s & u ^ o & u;
      k = S | 0, U = L | 0, S = p | 0, L = A | 0, p = f | 0, A = x | 0, { h: f, l: x } = ce.add(h | 0, d | 0, F | 0, E | 0), h = l | 0, d = u | 0, l = i | 0, u = o | 0, i = r | 0, o = s | 0;
      const G = ce.add3L(E, R, te);
      r = ce.add3H(G, F, M, N), s = G | 0;
    }
    ({ h: r, l: s } = ce.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ce.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: l, l: u } = ce.add(this.Ch | 0, this.Cl | 0, l | 0, u | 0), { h, l: d } = ce.add(this.Dh | 0, this.Dl | 0, h | 0, d | 0), { h: f, l: x } = ce.add(this.Eh | 0, this.El | 0, f | 0, x | 0), { h: p, l: A } = ce.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: S, l: L } = ce.add(this.Gh | 0, this.Gl | 0, S | 0, L | 0), { h: k, l: U } = ce.add(this.Hh | 0, this.Hl | 0, k | 0, U | 0), this.set(r, s, i, o, l, u, h, d, f, x, p, A, S, L, k, U);
  }
  roundClean() {
    ar.fill(0), cr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ty = class extends ka {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ny = class extends ka {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ry = class extends ka {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const sy = As(() => new ka());
As(() => new ty());
As(() => new ny());
As(() => new ry());
function xd(e) {
  return Rs(e);
}
function iy(e) {
  return sy(e);
}
const oy = 0;
ze.hmacSha256Sync = (e, ...t) => {
  const n = Pa.create(Rs, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ay() {
  return ee(ze.randomPrivateKey());
}
function cy(e) {
  const t = Rs(Rs(e));
  return Ab.encode(Bn(e, t).slice(0, e.length + 4));
}
function ly(e, t) {
  return cy(Bn(new Uint8Array([e]), t.slice(0, 20)));
}
function wd(e, t = oy) {
  const n = typeof e == "string" ? we(e) : e, r = Mb(xd(n));
  return ly(t, r);
}
function md(e) {
  const t = a0(e);
  return ee(Zi(t.slice(0, 32), !0));
}
ze.hmacSha256Sync = (e, ...t) => {
  const n = Pa.create(Rs, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var ha;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(ha || (ha = {}));
async function uy(e, t, n) {
  return await (await dd()).encrypt("aes-256-cbc", t, e, n);
}
async function fy(e, t, n) {
  return await (await dd()).decrypt("aes-256-cbc", t, e, n);
}
function Sd(e, t) {
  return Pa(Rs, e, t);
}
function hy(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Ad(e) {
  const t = iy(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function dy(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function gy(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ha.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ha.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !dy(e))
    return t;
  try {
    return pe.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function py(e, t, n, r) {
  const s = gy(e);
  if (!s.result)
    throw s;
  const i = ze.randomPrivateKey(), o = Zi(i, !0);
  let l = d0(i, e, !0);
  l = l.slice(1);
  const u = Ad(l), h = ze.randomBytes(16), d = await uy(h, u.encryptionKey, t), f = Bn(h, o, d), x = Sd(u.hmacKey, f);
  let p;
  if (!r || r === "hex")
    p = ee(d);
  else if (r === "base64")
    p = sb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const A = {
    iv: ee(h),
    ephemeralPK: ee(o),
    cipherText: p,
    mac: ee(x),
    wasString: n
  };
  return r && r !== "hex" && (A.cipherTextEncoding = r), A;
}
async function vd(e, t) {
  if (!t.ephemeralPK)
    throw new Lu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = d0(e, n, !0);
  r = r.slice(1);
  const s = Ad(r), i = we(t.iv);
  let o;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    o = we(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    o = rb(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const l = Bn(i, we(n), o), u = Sd(s.hmacKey, l), h = we(t.mac);
  if (!hy(h, u))
    throw new Lu("Decryption failed: failure in MAC check");
  const d = await fy(i, s.encryptionKey, o);
  return t.wasString ? Xi(d) : d;
}
function by(e, t) {
  const n = typeof t == "string" ? Ss(t) : t, r = md(e), s = xd(n), i = Da(s, e);
  return {
    signature: ee(i),
    publicKey: r
  };
}
async function yy(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = md(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", i = typeof e == "string" ? Ss(e) : e, o = await py(n.publicKey, i, s, n.cipherTextEncoding);
  let l = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const u = by(r, l), h = {
      signature: u.signature,
      publicKey: u.publicKey,
      cipherText: l
    };
    l = JSON.stringify(h);
  }
  return l;
}
function xy(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return vd(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ut = {}, Ys = {}, pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.decode = pt.encode = pt.unescape = pt.escape = pt.pad = void 0;
const Ed = Qi;
function b0(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
pt.pad = b0;
function Id(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
pt.escape = Id;
function $d(e) {
  return b0(e).replace(/-/g, "+").replace(/_/g, "/");
}
pt.unescape = $d;
function wy(e) {
  return Id((0, Ed.fromByteArray)(new TextEncoder().encode(e)));
}
pt.encode = wy;
function my(e) {
  return new TextDecoder().decode((0, Ed.toByteArray)(b0($d(e))));
}
pt.decode = my;
var Oa = {}, Fa = {}, Cd = {}, Qn = {}, ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
ja.crypto = void 0;
ja.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = i, e.aexists = o, e.aoutput = l, e.u8 = u, e.u32 = h, e.clean = d, e.createView = f, e.rotr = x, e.rotl = p, e.byteSwap = A, e.byteSwap32 = S, e.bytesToHex = U, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = z, e.bytesToUtf8 = F, e.toBytes = E, e.kdfInputToBytes = M, e.concatBytes = R, e.checkOpts = N, e.createHasher = G, e.createOptHasher = $t, e.createXOFer = Xt, e.randomBytes = wt;
  const t = ja;
  function n(C) {
    return C instanceof Uint8Array || ArrayBuffer.isView(C) && C.constructor.name === "Uint8Array";
  }
  function r(C) {
    if (!Number.isSafeInteger(C) || C < 0)
      throw new Error("positive integer expected, got " + C);
  }
  function s(C, ...P) {
    if (!n(C))
      throw new Error("Uint8Array expected");
    if (P.length > 0 && !P.includes(C.length))
      throw new Error("Uint8Array expected of length " + P + ", got length=" + C.length);
  }
  function i(C) {
    if (typeof C != "function" || typeof C.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(C.outputLen), r(C.blockLen);
  }
  function o(C, P = !0) {
    if (C.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (P && C.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function l(C, P) {
    s(C);
    const ve = P.outputLen;
    if (C.length < ve)
      throw new Error("digestInto() expects output buffer of length at least " + ve);
  }
  function u(C) {
    return new Uint8Array(C.buffer, C.byteOffset, C.byteLength);
  }
  function h(C) {
    return new Uint32Array(C.buffer, C.byteOffset, Math.floor(C.byteLength / 4));
  }
  function d(...C) {
    for (let P = 0; P < C.length; P++)
      C[P].fill(0);
  }
  function f(C) {
    return new DataView(C.buffer, C.byteOffset, C.byteLength);
  }
  function x(C, P) {
    return C << 32 - P | C >>> P;
  }
  function p(C, P) {
    return C << P | C >>> 32 - P >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function A(C) {
    return C << 24 & 4278190080 | C << 8 & 16711680 | C >>> 8 & 65280 | C >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (C) => C : (C) => A(C), e.byteSwapIfBE = e.swap8IfBE;
  function S(C) {
    for (let P = 0; P < C.length; P++)
      C[P] = A(C[P]);
    return C;
  }
  e.swap32IfBE = e.isLE ? (C) => C : S;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", k = /* @__PURE__ */ Array.from({ length: 256 }, (C, P) => P.toString(16).padStart(2, "0"));
  function U(C) {
    if (s(C), L)
      return C.toHex();
    let P = "";
    for (let ve = 0; ve < C.length; ve++)
      P += k[C[ve]];
    return P;
  }
  const m = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function H(C) {
    if (C >= m._0 && C <= m._9)
      return C - m._0;
    if (C >= m.A && C <= m.F)
      return C - (m.A - 10);
    if (C >= m.a && C <= m.f)
      return C - (m.a - 10);
  }
  function B(C) {
    if (typeof C != "string")
      throw new Error("hex string expected, got " + typeof C);
    if (L)
      return Uint8Array.fromHex(C);
    const P = C.length, ve = P / 2;
    if (P % 2)
      throw new Error("hex string expected, got unpadded hex of length " + P);
    const Ee = new Uint8Array(ve);
    for (let Ae = 0, Xe = 0; Ae < ve; Ae++, Xe += 2) {
      const jr = H(C.charCodeAt(Xe)), Bs = H(C.charCodeAt(Xe + 1));
      if (jr === void 0 || Bs === void 0) {
        const pi = C[Xe] + C[Xe + 1];
        throw new Error('hex string expected, got non-hex character "' + pi + '" at index ' + Xe);
      }
      Ee[Ae] = jr * 16 + Bs;
    }
    return Ee;
  }
  const j = async () => {
  };
  e.nextTick = j;
  async function Q(C, P, ve) {
    let Ee = Date.now();
    for (let Ae = 0; Ae < C; Ae++) {
      ve(Ae);
      const Xe = Date.now() - Ee;
      Xe >= 0 && Xe < P || (await (0, e.nextTick)(), Ee += Xe);
    }
  }
  function z(C) {
    if (typeof C != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(C));
  }
  function F(C) {
    return new TextDecoder().decode(C);
  }
  function E(C) {
    return typeof C == "string" && (C = z(C)), s(C), C;
  }
  function M(C) {
    return typeof C == "string" && (C = z(C)), s(C), C;
  }
  function R(...C) {
    let P = 0;
    for (let Ee = 0; Ee < C.length; Ee++) {
      const Ae = C[Ee];
      s(Ae), P += Ae.length;
    }
    const ve = new Uint8Array(P);
    for (let Ee = 0, Ae = 0; Ee < C.length; Ee++) {
      const Xe = C[Ee];
      ve.set(Xe, Ae), Ae += Xe.length;
    }
    return ve;
  }
  function N(C, P) {
    if (P !== void 0 && {}.toString.call(P) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(C, P);
  }
  class te {
  }
  e.Hash = te;
  function G(C) {
    const P = (Ee) => C().update(E(Ee)).digest(), ve = C();
    return P.outputLen = ve.outputLen, P.blockLen = ve.blockLen, P.create = () => C(), P;
  }
  function $t(C) {
    const P = (Ee, Ae) => C(Ae).update(E(Ee)).digest(), ve = C({});
    return P.outputLen = ve.outputLen, P.blockLen = ve.blockLen, P.create = (Ee) => C(Ee), P;
  }
  function Xt(C) {
    const P = (Ee, Ae) => C(Ae).update(E(Ee)).digest(), ve = C({});
    return P.outputLen = ve.outputLen, P.blockLen = ve.blockLen, P.create = (Ee) => C(Ee), P;
  }
  e.wrapConstructor = G, e.wrapConstructorWithOpts = $t, e.wrapXOFConstructorWithOpts = Xt;
  function wt(C = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(C));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(C));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Qn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = Qn;
  class n extends t.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(i);
      const l = (0, t.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const u = this.blockLen, h = new Uint8Array(u);
      h.set(l.length > u ? i.create().update(l).digest() : l);
      for (let d = 0; d < h.length; d++)
        h[d] ^= 54;
      this.iHash.update(h), this.oHash = i.create();
      for (let d = 0; d < h.length; d++)
        h[d] ^= 106;
      this.oHash.update(h), (0, t.clean)(h);
    }
    update(i) {
      return (0, t.aexists)(this), this.iHash.update(i), this;
    }
    digestInto(i) {
      (0, t.aexists)(this), (0, t.abytes)(i, this.outputLen), this.finished = !0, this.iHash.digestInto(i), this.oHash.update(i), this.oHash.digestInto(i), this.destroy();
    }
    digest() {
      const i = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(i), i;
    }
    _cloneInto(i) {
      i || (i = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: l, finished: u, destroyed: h, blockLen: d, outputLen: f } = this;
      return i = i, i.finished = u, i.destroyed = h, i.blockLen = d, i.outputLen = f, i.oHash = o._cloneInto(i.oHash), i.iHash = l._cloneInto(i.iHash), i;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, i, o) => new n(s, i).update(o).digest();
  e.hmac = r, e.hmac.create = (s, i) => new n(s, i);
})(Cd);
var Mt = {}, He = {}, bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.SHA512_IV = bt.SHA384_IV = bt.SHA224_IV = bt.SHA256_IV = bt.HashMD = void 0;
bt.setBigUint64 = Ld;
bt.Chi = Sy;
bt.Maj = Ay;
const xn = Qn;
function Ld(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), l = Number(n & i), u = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + u, o, r), e.setUint32(t + h, l, r);
}
function Sy(e, t, n) {
  return e & t ^ ~e & n;
}
function Ay(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class vy extends xn.Hash {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = (0, xn.createView)(this.buffer);
  }
  update(t) {
    (0, xn.aexists)(this), t = (0, xn.toBytes)(t), (0, xn.abytes)(t);
    const { view: n, buffer: r, blockLen: s } = this, i = t.length;
    for (let o = 0; o < i; ) {
      const l = Math.min(s - this.pos, i - o);
      if (l === s) {
        const u = (0, xn.createView)(t);
        for (; s <= i - o; o += s)
          this.process(u, o);
        continue;
      }
      r.set(t.subarray(o, o + l), this.pos), this.pos += l, o += l, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    (0, xn.aexists)(this), (0, xn.aoutput)(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, xn.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let f = o; f < s; f++)
      n[f] = 0;
    Ld(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = (0, xn.createView)(t), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = u / 4, d = this.get();
    if (h > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < h; f++)
      l.setUint32(4 * f, d[f], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: l } = this;
    return t.destroyed = o, t.finished = i, t.length = s, t.pos = l, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
bt.HashMD = vy;
bt.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
bt.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
bt.SHA384_IV = Uint32Array.from([
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
bt.SHA512_IV = Uint32Array.from([
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
var ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.toBig = ie.shrSL = ie.shrSH = ie.rotrSL = ie.rotrSH = ie.rotrBL = ie.rotrBH = ie.rotr32L = ie.rotr32H = ie.rotlSL = ie.rotlSH = ie.rotlBL = ie.rotlBH = ie.add5L = ie.add5H = ie.add4L = ie.add4H = ie.add3L = ie.add3H = void 0;
ie.add = Rd;
ie.fromBig = y0;
ie.split = Bd;
const Uo = /* @__PURE__ */ BigInt(2 ** 32 - 1), cl = /* @__PURE__ */ BigInt(32);
function y0(e, t = !1) {
  return t ? { h: Number(e & Uo), l: Number(e >> cl & Uo) } : { h: Number(e >> cl & Uo) | 0, l: Number(e & Uo) | 0 };
}
function Bd(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l } = y0(e[i], t);
    [r[i], s[i]] = [o, l];
  }
  return [r, s];
}
const Hd = (e, t) => BigInt(e >>> 0) << cl | BigInt(t >>> 0);
ie.toBig = Hd;
const Md = (e, t, n) => e >>> n;
ie.shrSH = Md;
const _d = (e, t, n) => e << 32 - n | t >>> n;
ie.shrSL = _d;
const Td = (e, t, n) => e >>> n | t << 32 - n;
ie.rotrSH = Td;
const Nd = (e, t, n) => e << 32 - n | t >>> n;
ie.rotrSL = Nd;
const Ud = (e, t, n) => e << 64 - n | t >>> n - 32;
ie.rotrBH = Ud;
const Pd = (e, t, n) => e >>> n - 32 | t << 64 - n;
ie.rotrBL = Pd;
const Dd = (e, t) => t;
ie.rotr32H = Dd;
const kd = (e, t) => e;
ie.rotr32L = kd;
const Od = (e, t, n) => e << n | t >>> 32 - n;
ie.rotlSH = Od;
const Fd = (e, t, n) => t << n | e >>> 32 - n;
ie.rotlSL = Fd;
const jd = (e, t, n) => t << n - 32 | e >>> 64 - n;
ie.rotlBH = jd;
const zd = (e, t, n) => e << n - 32 | t >>> 64 - n;
ie.rotlBL = zd;
function Rd(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Vd = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0);
ie.add3L = Vd;
const Gd = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0;
ie.add3H = Gd;
const Kd = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0);
ie.add4L = Kd;
const Wd = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0;
ie.add4H = Wd;
const Yd = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
ie.add5L = Yd;
const qd = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0;
ie.add5H = qd;
const Ey = {
  fromBig: y0,
  split: Bd,
  toBig: Hd,
  shrSH: Md,
  shrSL: _d,
  rotrSH: Td,
  rotrSL: Nd,
  rotrBH: Ud,
  rotrBL: Pd,
  rotr32H: Dd,
  rotr32L: kd,
  rotlSH: Od,
  rotlSL: Fd,
  rotlBH: jd,
  rotlBL: zd,
  add: Rd,
  add3L: Vd,
  add3H: Gd,
  add4L: Kd,
  add4H: Wd,
  add5H: qd,
  add5L: Yd
};
ie.default = Ey;
Object.defineProperty(He, "__esModule", { value: !0 });
He.sha512_224 = He.sha512_256 = He.sha384 = He.sha512 = He.sha224 = He.sha256 = He.SHA512_256 = He.SHA512_224 = He.SHA384 = He.SHA512 = He.SHA224 = He.SHA256 = void 0;
const J = bt, le = ie, Ke = Qn, Iy = /* @__PURE__ */ Uint32Array.from([
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
]), lr = /* @__PURE__ */ new Uint32Array(64);
let x0 = class extends J.HashMD {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = J.SHA256_IV[0] | 0, this.B = J.SHA256_IV[1] | 0, this.C = J.SHA256_IV[2] | 0, this.D = J.SHA256_IV[3] | 0, this.E = J.SHA256_IV[4] | 0, this.F = J.SHA256_IV[5] | 0, this.G = J.SHA256_IV[6] | 0, this.H = J.SHA256_IV[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: l, H: u } = this;
    return [t, n, r, s, i, o, l, u];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = l | 0, this.H = u | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      lr[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const x = lr[f - 15], p = lr[f - 2], A = (0, Ke.rotr)(x, 7) ^ (0, Ke.rotr)(x, 18) ^ x >>> 3, S = (0, Ke.rotr)(p, 17) ^ (0, Ke.rotr)(p, 19) ^ p >>> 10;
      lr[f] = S + lr[f - 7] + A + lr[f - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: l, F: u, G: h, H: d } = this;
    for (let f = 0; f < 64; f++) {
      const x = (0, Ke.rotr)(l, 6) ^ (0, Ke.rotr)(l, 11) ^ (0, Ke.rotr)(l, 25), p = d + x + (0, J.Chi)(l, u, h) + Iy[f] + lr[f] | 0, S = ((0, Ke.rotr)(r, 2) ^ (0, Ke.rotr)(r, 13) ^ (0, Ke.rotr)(r, 22)) + (0, J.Maj)(r, s, i) | 0;
      d = h, h = u, u = l, l = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, l = l + this.E | 0, u = u + this.F | 0, h = h + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, l, u, h, d);
  }
  roundClean() {
    (0, Ke.clean)(lr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, Ke.clean)(this.buffer);
  }
};
He.SHA256 = x0;
let Xd = class extends x0 {
  constructor() {
    super(28), this.A = J.SHA224_IV[0] | 0, this.B = J.SHA224_IV[1] | 0, this.C = J.SHA224_IV[2] | 0, this.D = J.SHA224_IV[3] | 0, this.E = J.SHA224_IV[4] | 0, this.F = J.SHA224_IV[5] | 0, this.G = J.SHA224_IV[6] | 0, this.H = J.SHA224_IV[7] | 0;
  }
};
He.SHA224 = Xd;
const Zd = le.split([
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
].map((e) => BigInt(e))), $y = Zd[0], Cy = Zd[1], ur = /* @__PURE__ */ new Uint32Array(80), fr = /* @__PURE__ */ new Uint32Array(80);
let Ji = class extends J.HashMD {
  constructor(t = 64) {
    super(128, t, 16, !1), this.Ah = J.SHA512_IV[0] | 0, this.Al = J.SHA512_IV[1] | 0, this.Bh = J.SHA512_IV[2] | 0, this.Bl = J.SHA512_IV[3] | 0, this.Ch = J.SHA512_IV[4] | 0, this.Cl = J.SHA512_IV[5] | 0, this.Dh = J.SHA512_IV[6] | 0, this.Dl = J.SHA512_IV[7] | 0, this.Eh = J.SHA512_IV[8] | 0, this.El = J.SHA512_IV[9] | 0, this.Fh = J.SHA512_IV[10] | 0, this.Fl = J.SHA512_IV[11] | 0, this.Gh = J.SHA512_IV[12] | 0, this.Gl = J.SHA512_IV[13] | 0, this.Hh = J.SHA512_IV[14] | 0, this.Hl = J.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: l, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: p, Gl: A, Hh: S, Hl: L } = this;
    return [t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = l | 0, this.Dl = u | 0, this.Eh = h | 0, this.El = d | 0, this.Fh = f | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = S | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let m = 0; m < 16; m++, n += 4)
      ur[m] = t.getUint32(n), fr[m] = t.getUint32(n += 4);
    for (let m = 16; m < 80; m++) {
      const H = ur[m - 15] | 0, B = fr[m - 15] | 0, j = le.rotrSH(H, B, 1) ^ le.rotrSH(H, B, 8) ^ le.shrSH(H, B, 7), Q = le.rotrSL(H, B, 1) ^ le.rotrSL(H, B, 8) ^ le.shrSL(H, B, 7), z = ur[m - 2] | 0, F = fr[m - 2] | 0, E = le.rotrSH(z, F, 19) ^ le.rotrBH(z, F, 61) ^ le.shrSH(z, F, 6), M = le.rotrSL(z, F, 19) ^ le.rotrBL(z, F, 61) ^ le.shrSL(z, F, 6), R = le.add4L(Q, M, fr[m - 7], fr[m - 16]), N = le.add4H(R, j, E, ur[m - 7], ur[m - 16]);
      ur[m] = N | 0, fr[m] = R | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: l, Cl: u, Dh: h, Dl: d, Eh: f, El: x, Fh: p, Fl: A, Gh: S, Gl: L, Hh: k, Hl: U } = this;
    for (let m = 0; m < 80; m++) {
      const H = le.rotrSH(f, x, 14) ^ le.rotrSH(f, x, 18) ^ le.rotrBH(f, x, 41), B = le.rotrSL(f, x, 14) ^ le.rotrSL(f, x, 18) ^ le.rotrBL(f, x, 41), j = f & p ^ ~f & S, Q = x & A ^ ~x & L, z = le.add5L(U, B, Q, Cy[m], fr[m]), F = le.add5H(z, k, H, j, $y[m], ur[m]), E = z | 0, M = le.rotrSH(r, s, 28) ^ le.rotrBH(r, s, 34) ^ le.rotrBH(r, s, 39), R = le.rotrSL(r, s, 28) ^ le.rotrBL(r, s, 34) ^ le.rotrBL(r, s, 39), N = r & i ^ r & l ^ i & l, te = s & o ^ s & u ^ o & u;
      k = S | 0, U = L | 0, S = p | 0, L = A | 0, p = f | 0, A = x | 0, { h: f, l: x } = le.add(h | 0, d | 0, F | 0, E | 0), h = l | 0, d = u | 0, l = i | 0, u = o | 0, i = r | 0, o = s | 0;
      const G = le.add3L(E, R, te);
      r = le.add3H(G, F, M, N), s = G | 0;
    }
    ({ h: r, l: s } = le.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = le.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: l, l: u } = le.add(this.Ch | 0, this.Cl | 0, l | 0, u | 0), { h, l: d } = le.add(this.Dh | 0, this.Dl | 0, h | 0, d | 0), { h: f, l: x } = le.add(this.Eh | 0, this.El | 0, f | 0, x | 0), { h: p, l: A } = le.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: S, l: L } = le.add(this.Gh | 0, this.Gl | 0, S | 0, L | 0), { h: k, l: U } = le.add(this.Hh | 0, this.Hl | 0, k | 0, U | 0), this.set(r, s, i, o, l, u, h, d, f, x, p, A, S, L, k, U);
  }
  roundClean() {
    (0, Ke.clean)(ur, fr);
  }
  destroy() {
    (0, Ke.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
He.SHA512 = Ji;
let Qd = class extends Ji {
  constructor() {
    super(48), this.Ah = J.SHA384_IV[0] | 0, this.Al = J.SHA384_IV[1] | 0, this.Bh = J.SHA384_IV[2] | 0, this.Bl = J.SHA384_IV[3] | 0, this.Ch = J.SHA384_IV[4] | 0, this.Cl = J.SHA384_IV[5] | 0, this.Dh = J.SHA384_IV[6] | 0, this.Dl = J.SHA384_IV[7] | 0, this.Eh = J.SHA384_IV[8] | 0, this.El = J.SHA384_IV[9] | 0, this.Fh = J.SHA384_IV[10] | 0, this.Fl = J.SHA384_IV[11] | 0, this.Gh = J.SHA384_IV[12] | 0, this.Gl = J.SHA384_IV[13] | 0, this.Hh = J.SHA384_IV[14] | 0, this.Hl = J.SHA384_IV[15] | 0;
  }
};
He.SHA384 = Qd;
const ot = /* @__PURE__ */ Uint32Array.from([
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
]), at = /* @__PURE__ */ Uint32Array.from([
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
let Jd = class extends Ji {
  constructor() {
    super(28), this.Ah = ot[0] | 0, this.Al = ot[1] | 0, this.Bh = ot[2] | 0, this.Bl = ot[3] | 0, this.Ch = ot[4] | 0, this.Cl = ot[5] | 0, this.Dh = ot[6] | 0, this.Dl = ot[7] | 0, this.Eh = ot[8] | 0, this.El = ot[9] | 0, this.Fh = ot[10] | 0, this.Fl = ot[11] | 0, this.Gh = ot[12] | 0, this.Gl = ot[13] | 0, this.Hh = ot[14] | 0, this.Hl = ot[15] | 0;
  }
};
He.SHA512_224 = Jd;
let e1 = class extends Ji {
  constructor() {
    super(32), this.Ah = at[0] | 0, this.Al = at[1] | 0, this.Bh = at[2] | 0, this.Bl = at[3] | 0, this.Ch = at[4] | 0, this.Cl = at[5] | 0, this.Dh = at[6] | 0, this.Dl = at[7] | 0, this.Eh = at[8] | 0, this.El = at[9] | 0, this.Fh = at[10] | 0, this.Fl = at[11] | 0, this.Gh = at[12] | 0, this.Gl = at[13] | 0, this.Hh = at[14] | 0, this.Hl = at[15] | 0;
  }
};
He.SHA512_256 = e1;
He.sha256 = (0, Ke.createHasher)(() => new x0());
He.sha224 = (0, Ke.createHasher)(() => new Xd());
He.sha512 = (0, Ke.createHasher)(() => new Ji());
He.sha384 = (0, Ke.createHasher)(() => new Qd());
He.sha512_256 = (0, Ke.createHasher)(() => new e1());
He.sha512_224 = (0, Ke.createHasher)(() => new Jd());
Object.defineProperty(Mt, "__esModule", { value: !0 });
Mt.sha224 = Mt.SHA224 = Mt.sha256 = Mt.SHA256 = void 0;
const za = He;
Mt.SHA256 = za.SHA256;
Mt.sha256 = za.sha256;
Mt.SHA224 = za.SHA224;
Mt.sha224 = za.sha224;
const Ly = /* @__PURE__ */ fd(nb);
var qs = {};
Object.defineProperty(qs, "__esModule", { value: !0 });
qs.joseToDer = qs.derToJose = void 0;
const t1 = Qi, n1 = pt;
function kc(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const By = {
  ES256: kc(256),
  ES384: kc(384),
  ES512: kc(521)
};
function r1(e) {
  const t = By[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const da = 128, s1 = 0, Hy = 32, My = 16, _y = 2, i1 = My | Hy | s1 << 6, ga = _y | s1 << 6;
function o1(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, t1.toByteArray)((0, n1.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Ty(e, t) {
  const n = o1(e), r = r1(t), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== i1)
    throw new Error('Could not find expected "seq"');
  let l = n[o++];
  if (l === (da | 1) && (l = n[o++]), i - o < l)
    throw new Error(`"seq" specified length of "${l}", only "${i - o}" remaining`);
  if (n[o++] !== ga)
    throw new Error('Could not find expected "int" for "r"');
  const u = n[o++];
  if (i - o - 2 < u)
    throw new Error(`"r" specified length of "${u}", only "${i - o - 2}" available`);
  if (s < u)
    throw new Error(`"r" specified length of "${u}", max of "${s}" is acceptable`);
  const h = o;
  if (o += u, n[o++] !== ga)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const f = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const x = r - u, p = r - d, A = new Uint8Array(x + u + p + d);
  for (o = 0; o < x; ++o)
    A[o] = 0;
  A.set(n.subarray(h + Math.max(-x, 0), h + u), o), o = r;
  for (const S = o; o < S + p; ++o)
    A[o] = 0;
  return A.set(n.subarray(f + Math.max(-p, 0), f + d), o), (0, n1.escape)((0, t1.fromByteArray)(A));
}
qs.derToJose = Ty;
function ju(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= da && --r, r;
}
function Ny(e, t) {
  e = o1(e);
  const n = r1(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = ju(e, 0, n), i = ju(e, n, e.length), o = n - s, l = n - i, u = 2 + o + 1 + 1 + l, h = u < da, d = new Uint8Array((h ? 2 : 3) + u);
  let f = 0;
  return d[f++] = i1, h ? d[f++] = u : (d[f++] = da | 1, d[f++] = u & 255), d[f++] = ga, d[f++] = o, s < 0 ? (d[f++] = 0, d.set(e.subarray(0, n), f), f += n) : (d.set(e.subarray(s, n), f), f += n - s), d[f++] = ga, d[f++] = l, i < 0 ? (d[f++] = 0, d.set(e.subarray(n), f)) : d.set(e.subarray(n + i), f), d;
}
qs.joseToDer = Ny;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.InvalidTokenError = qn.MissingParametersError = void 0;
class Uy extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
qn.MissingParametersError = Uy;
class Py extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
qn.InvalidTokenError = Py;
Object.defineProperty(Fa, "__esModule", { value: !0 });
Fa.SECP256K1Client = void 0;
const Dy = Cd, ky = Mt, ea = Ly, zu = qs, Ru = qn, Vu = Qn;
ea.utils.hmacSha256Sync = (e, ...t) => {
  const n = Dy.hmac.create(ky.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class a1 {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Vu.bytesToHex)(ea.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Ru.MissingParametersError("a signing input hash and private key are all required");
    const s = ea.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Vu.bytesToHex)(s);
    if (r === "jose")
      return (0, zu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, zu.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Ru.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ea.verify(n, t, r, { strict: !1 });
  }
}
Fa.SECP256K1Client = a1;
a1.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Fa;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Oa);
var ls = {};
const Oy = /* @__PURE__ */ fd(Xh);
var Fy = xt && xt.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function l(d) {
      try {
        h(r.next(d));
      } catch (f) {
        o(f);
      }
    }
    function u(d) {
      try {
        h(r.throw(d));
      } catch (f) {
        o(f);
      }
    }
    function h(d) {
      d.done ? i(d.value) : s(d.value).then(l, u);
    }
    h((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(ls, "__esModule", { value: !0 });
ls.hashSha256Async = ls.hashSha256 = void 0;
const jy = Mt;
function c1(e) {
  return (0, jy.sha256)(e);
}
ls.hashSha256 = c1;
function zy(e) {
  return Fy(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Oy;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(c1(e));
    }
  });
}
ls.hashSha256Async = zy;
var Ry = xt && xt.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function l(d) {
      try {
        h(r.next(d));
      } catch (f) {
        o(f);
      }
    }
    function u(d) {
      try {
        h(r.throw(d));
      } catch (f) {
        o(f);
      }
    }
    function h(d) {
      d.done ? i(d.value) : s(d.value).then(l, u);
    }
    h((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.TokenSigner = Ys.createUnsecuredToken = void 0;
const ll = pt, Gu = Oa, Vy = qn, Ku = ls;
function ul(e, t) {
  const n = [], r = ll.encode(JSON.stringify(t));
  n.push(r);
  const s = ll.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function Gy(e) {
  return ul(e, { typ: "JWT", alg: "none" }) + ".";
}
Ys.createUnsecuredToken = Gy;
class Ky {
  constructor(t, n) {
    if (!(t && n))
      throw new Vy.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Gu.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Gu.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), i = ul(t, s), o = (0, Ku.hashSha256)(i);
    return this.createWithSignedHash(t, n, s, i, o);
  }
  signAsync(t, n = !1, r = {}) {
    return Ry(this, void 0, void 0, function* () {
      const s = this.header(r), i = ul(t, s), o = yield (0, Ku.hashSha256Async)(i);
      return this.createWithSignedHash(t, n, s, i, o);
    });
  }
  createWithSignedHash(t, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ll.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ys.TokenSigner = Ky;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
Ra.TokenVerifier = void 0;
const Wy = pt, Wu = Oa, Yy = qn, Po = ls;
class qy {
  constructor(t, n) {
    if (!(t && n))
      throw new Yy.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Wu.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Wu.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], i = (o) => {
      const l = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, l, this.rawPublicKey);
    };
    if (n)
      return (0, Po.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Po.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), Wy.encode(t.payload)].join(".");
    let s = !0;
    const i = (o) => (t.signature.map((l) => {
      const u = this.cryptoClient.loadSignature(l);
      this.cryptoClient.verifyHash(o, u, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Po.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Po.hashSha256)(r);
      return i(o);
    }
  }
}
Ra.TokenVerifier = qy;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
Va.decodeToken = void 0;
const Do = pt;
function Xy(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(Do.decode(t[0])), r = JSON.parse(Do.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = Do.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(Do.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Va.decodeToken = Xy;
(function(e) {
  var t = xt && xt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var l = Object.getOwnPropertyDescriptor(s, i);
    (!l || ("get" in l ? !s.__esModule : l.writable || l.configurable)) && (l = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, l);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = xt && xt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && t(s, r, i);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Ys, e), n(Ra, e), n(Va, e), n(qn, e), n(Oa, e);
})(ut);
function Zy(e) {
  return `did:btc-addr:${e}`;
}
function Qy(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Cu("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Cu('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function l1(e) {
  if (e)
    return Qy(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const Jy = "1.4.0";
function ex() {
  return ay();
}
function tx(e, t, n, r = jh.slice(), s, i = s2().getTime(), o = {}) {
  const l = (p) => {
    const A = i0("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return A == null ? void 0 : A.origin;
  };
  t || (t = `${l("redirectURI")}/`), n || (n = `${l("manifestURI")}/manifest.json`), s || (s = l("appDomain"));
  const u = Object.assign({}, o, {
    jti: o2(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: Jy,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), h = ut.SECP256K1Client.derivePublicKey(e);
  u.public_keys = [h];
  const d = wd(h);
  return u.iss = Zy(d), new ut.TokenSigner("ES256k", e).sign(u);
}
async function Yu(e, t) {
  const n = Xi(we(t)), r = JSON.parse(n), s = await vd(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function nx(e) {
  const t = ut.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ut.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function rx(e) {
  const t = ut.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = l1(t.iss);
  if (n.length === 1) {
    if (wd(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function sx(e) {
  const t = ut.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.iat) {
    if (typeof t.iat != "number")
      return !1;
    const n = new Date(t.iat * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() < n.getTime());
  } else
    return !0;
}
function ix(e) {
  const t = ut.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.exp) {
    if (typeof t.exp != "number")
      return !1;
    const n = new Date(t.exp * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() > n.getTime());
  } else
    return !0;
}
function ox(e) {
  const t = [
    ix(e),
    sx(e),
    nx(e),
    rx(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const qu = "1.0.0";
class Ur {
  constructor(t) {
    this.version = qu, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== qu)
      throw new nl(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Ur(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class u1 {
  constructor(t) {
    if (t) {
      const n = new Ur(t);
      this.setSessionData(n);
    }
  }
  getSessionData() {
    throw new Error("Abstract class");
  }
  setSessionData(t) {
    throw new Error("Abstract class");
  }
  deleteSessionData() {
    throw new Error("Abstract class");
  }
}
class Xu extends u1 {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Ur({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new zh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ur({})), !0;
  }
}
class Zu extends u1 {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = t2, !localStorage.getItem(this.key)) {
      const r = new Ur({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new zh("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Ur.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ur({})), !0;
  }
}
var ki;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ki || (ki = {}));
var pa;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(pa || (pa = {}));
ki.Mainnet;
var Kn;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Kn || (Kn = {}));
var In;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(In || (In = {}));
Kn.Mainnet;
const f1 = {
  chainId: ki.Mainnet,
  transactionVersion: Kn.Mainnet,
  peerNetworkId: pa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: In.MainnetSingleSig,
    multiSig: In.MainnetMultiSig
  },
  client: { baseUrl: Rh }
}, fl = {
  chainId: ki.Testnet,
  transactionVersion: Kn.Testnet,
  peerNetworkId: pa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: In.TestnetSingleSig,
    multiSig: In.TestnetMultiSig
  },
  client: { baseUrl: Vh }
}, ta = {
  ...fl,
  addressVersion: { ...fl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Gh }
}, ax = {
  ...ta,
  addressVersion: { ...ta.addressVersion },
  client: { ...ta.client }
};
function cx(e) {
  switch (e) {
    case "mainnet":
      return f1;
    case "testnet":
      return fl;
    case "devnet":
      return ta;
    case "mocknet":
      return ax;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function h1(e) {
  return typeof e == "string" ? cx(e) : e;
}
var Qu;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qu || (Qu = {}));
var Ju;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Ju || (Ju = {}));
var rn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(rn || (rn = {}));
const Oc = ["onChainOnly", "offChainOnly", "any"];
Oc[0] + "", rn.OnChainOnly, Oc[1] + "", rn.OffChainOnly, Oc[2] + "", rn.Any, rn.OnChainOnly + "", rn.OnChainOnly, rn.OffChainOnly + "", rn.OffChainOnly, rn.Any + "", rn.Any;
var ef;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(ef || (ef = {}));
var tf;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(tf || (tf = {}));
var nf;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(nf || (nf = {}));
var zn;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(zn || (zn = {}));
var rf;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(rf || (rf = {}));
var sf;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(sf || (sf = {}));
var of;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(of || (of = {}));
var af;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(af || (af = {}));
var cf;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(cf || (cf = {}));
var lf;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(lf || (lf = {}));
var uf;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(uf || (uf = {}));
var ff;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ff || (ff = {}));
var hf;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(hf || (hf = {}));
function hl(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function lx(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function d1(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function ux(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  hl(e.outputLen), hl(e.blockLen);
}
function fx(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function hx(e, t) {
  d1(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Zr = {
  number: hl,
  bool: lx,
  bytes: d1,
  hash: ux,
  exists: fx,
  output: hx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fc = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), wn = (e, t) => e << 32 - t | e >>> t, dx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!dx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function gx(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function w0(e) {
  if (typeof e == "string" && (e = gx(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let g1 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function vs(e) {
  const t = (r) => e().update(w0(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let p1 = class extends g1 {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Zr.hash(t);
    const r = w0(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return Zr.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Zr.exists(this), Zr.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: l } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = l, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const b1 = (e, t, n) => new p1(e, t).update(n).digest();
b1.create = (e, t) => new p1(e, t);
function px(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), l = Number(n & i), u = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + u, o, r), e.setUint32(t + h, l, r);
}
let m0 = class extends g1 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Fc(this.buffer);
  }
  update(t) {
    Zr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = w0(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const l = Math.min(s - this.pos, i - o);
      if (l === s) {
        const u = Fc(t);
        for (; s <= i - o; o += s)
          this.process(u, o);
        continue;
      }
      r.set(t.subarray(o, o + l), this.pos), this.pos += l, o += l, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Zr.exists(this), Zr.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let f = o; f < s; f++)
      n[f] = 0;
    px(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = Fc(t), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = u / 4, d = this.get();
    if (h > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < h; f++)
      l.setUint32(4 * f, d[f], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: l } = this;
    return t.length = s, t.pos = l, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const bx = (e, t, n) => e & t ^ ~e & n, yx = (e, t, n) => e & t ^ e & n ^ t & n, xx = new Uint32Array([
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
]), hr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), dr = new Uint32Array(64);
let y1 = class extends m0 {
  constructor() {
    super(64, 32, 8, !1), this.A = hr[0] | 0, this.B = hr[1] | 0, this.C = hr[2] | 0, this.D = hr[3] | 0, this.E = hr[4] | 0, this.F = hr[5] | 0, this.G = hr[6] | 0, this.H = hr[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: l, H: u } = this;
    return [t, n, r, s, i, o, l, u];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = l | 0, this.H = u | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      dr[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const x = dr[f - 15], p = dr[f - 2], A = wn(x, 7) ^ wn(x, 18) ^ x >>> 3, S = wn(p, 17) ^ wn(p, 19) ^ p >>> 10;
      dr[f] = S + dr[f - 7] + A + dr[f - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: l, F: u, G: h, H: d } = this;
    for (let f = 0; f < 64; f++) {
      const x = wn(l, 6) ^ wn(l, 11) ^ wn(l, 25), p = d + x + bx(l, u, h) + xx[f] + dr[f] | 0, S = (wn(r, 2) ^ wn(r, 13) ^ wn(r, 22)) + yx(r, s, i) | 0;
      d = h, h = u, u = l, l = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, l = l + this.E | 0, u = u + this.F | 0, h = h + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, l, u, h, d);
  }
  roundClean() {
    dr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, wx = class extends y1 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const x1 = vs(() => new y1());
vs(() => new wx());
var Es = {}, S0 = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Qn;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, l) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let u = [], h = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (h < 4) {
        const A = n.indexOf(o[p]) >> h;
        let S = 0;
        p !== 0 && (S = n.indexOf(o[p - 1]));
        const L = 1 + h, k = S % (1 << L) << 5 - L, U = e.c32[A + k];
        h = L, u.unshift(U);
      } else
        h = 0;
    let d = 0;
    for (let p = 0; p < u.length && u[p] === "0"; p++)
      d++;
    u = u.slice(d);
    const f = new TextDecoder().decode((0, t.hexToBytes)(o)).match(/^\u0000*/), x = f ? f[0].length : 0;
    for (let p = 0; p < x; p++)
      u.unshift(e.c32[0]);
    if (l) {
      const p = l - u.length;
      for (let A = 0; A < p; A++)
        u.unshift(e.c32[0]);
    }
    return u.join("");
  }
  e.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function i(o, l) {
    if (o = s(o), !o.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const u = o.match(`^${e.c32[0]}*`), h = u ? u[0].length : 0;
    let d = [], f = 0, x = 0;
    for (let S = o.length - 1; S >= 0; S--) {
      x === 4 && (d.unshift(n[f]), x = 0, f = 0);
      const k = (e.c32.indexOf(o[S]) << x) + f, U = n[k % 16];
      if (x += 1, f = k >> 4, f > 1 << x)
        throw new Error("Panic error in decoding.");
      d.unshift(U);
    }
    d.unshift(n[f]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let S = 0; S < d.length && d[S] === "0"; S++)
      p++;
    d = d.slice(p - p % 2);
    let A = d.join("");
    for (let S = 0; S < h; S++)
      A = `00${A}`;
    if (l) {
      const S = l * 2 - A.length;
      for (let L = 0; L < S; L += 2)
        A = `00${A}`;
    }
    return A;
  }
  e.c32decode = i;
})(S0);
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.c32checkDecode = us.c32checkEncode = void 0;
const df = Mt, gf = Qn, Ni = S0;
function w1(e) {
  const t = (0, df.sha256)((0, df.sha256)((0, gf.hexToBytes)(e)));
  return (0, gf.bytesToHex)(t.slice(0, 4));
}
function mx(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = w1(`${n}${t}`), s = (0, Ni.c32encode)(`${t}${r}`);
  return `${Ni.c32[e]}${s}`;
}
us.c32checkEncode = mx;
function Sx(e) {
  e = (0, Ni.c32normalize)(e);
  const t = (0, Ni.c32decode)(e.slice(1)), n = e[0], r = Ni.c32.indexOf(n), s = t.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), w1(`${i}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
us.c32checkDecode = Sx;
var m1 = {}, Xs = {};
Object.defineProperty(Xs, "__esModule", { value: !0 });
Xs.decode = Xs.encode = void 0;
const ba = Mt, pf = Qn, S1 = gd, A1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Ax(e, t = "00") {
  const n = typeof e == "string" ? (0, pf.hexToBytes)(e) : e, r = typeof t == "string" ? (0, pf.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, ba.sha256)((0, ba.sha256)(new Uint8Array([...r, ...n])));
  return S1(A1).encode([...r, ...n, ...s.slice(0, 4)]);
}
Xs.encode = Ax;
function vx(e) {
  const t = S1(A1).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, ba.sha256)((0, ba.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Xs.decode = vx;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = us, n = Xs, r = Qn;
  e.versions = {
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
  s[0] = e.versions.mainnet.p2pkh, s[5] = e.versions.mainnet.p2sh, s[111] = e.versions.testnet.p2pkh, s[196] = e.versions.testnet.p2sh;
  const i = {};
  i[e.versions.mainnet.p2pkh] = 0, i[e.versions.mainnet.p2sh] = 5, i[e.versions.testnet.p2pkh] = 111, i[e.versions.testnet.p2sh] = 196;
  function o(d, f) {
    if (!f.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(d, f)}`;
  }
  e.c32address = o;
  function l(d) {
    if (d.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (d[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(d.slice(1));
  }
  e.c32addressDecode = l;
  function u(d, f = -1) {
    const x = n.decode(d), p = (0, r.bytesToHex)(x.data), A = parseInt((0, r.bytesToHex)(x.prefix), 16);
    let S;
    return f < 0 ? (S = A, s[A] !== void 0 && (S = s[A])) : S = f, o(S, p);
  }
  e.b58ToC32 = u;
  function h(d, f = -1) {
    const x = l(d), p = x[0], A = x[1];
    let S;
    f < 0 ? (S = p, i[p] !== void 0 && (S = i[p])) : S = f;
    let L = S.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(A, L);
  }
  e.c32ToB58 = h;
})(m1);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = S0;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = us;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = m1;
  Object.defineProperty(e, "c32address", { enumerable: !0, get: function() {
    return r.c32address;
  } }), Object.defineProperty(e, "c32addressDecode", { enumerable: !0, get: function() {
    return r.c32addressDecode;
  } }), Object.defineProperty(e, "c32ToB58", { enumerable: !0, get: function() {
    return r.c32ToB58;
  } }), Object.defineProperty(e, "b58ToC32", { enumerable: !0, get: function() {
    return r.b58ToC32;
  } }), Object.defineProperty(e, "versions", { enumerable: !0, get: function() {
    return r.versions;
  } });
})(Es);
function Ex(e, t) {
  switch (t = h1(t ?? f1), e) {
    case zn.P2PKH:
      switch (t.transactionVersion) {
        case Kn.Mainnet:
          return In.MainnetSingleSig;
        case Kn.Testnet:
          return In.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case zn.P2SH:
    case zn.P2SHNonSequential:
    case zn.P2WPKH:
    case zn.P2WSH:
    case zn.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Kn.Mainnet:
          return In.MainnetMultiSig;
        case Kn.Testnet:
          return In.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const Ix = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), v1 = Uint8Array.from({ length: 16 }, (e, t) => t), $x = v1.map((e) => (9 * e + 5) % 16);
let A0 = [v1], v0 = [$x];
for (let e = 0; e < 4; e++)
  for (let t of [A0, v0])
    t.push(t[e].map((n) => Ix[n]));
const E1 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Cx = A0.map((e, t) => e.map((n) => E1[t][n])), Lx = v0.map((e, t) => e.map((n) => E1[t][n])), Bx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Hx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ko = (e, t) => e << t | e >>> 32 - t;
function bf(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Oo = new Uint32Array(16);
let Mx = class extends m0 {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Oo[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, l = this.h2 | 0, u = l, h = this.h3 | 0, d = h, f = this.h4 | 0, x = f;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, S = Bx[p], L = Hx[p], k = A0[p], U = v0[p], m = Cx[p], H = Lx[p];
      for (let B = 0; B < 16; B++) {
        const j = ko(r + bf(p, i, l, h) + Oo[k[B]] + S, m[B]) + f | 0;
        r = f, f = h, h = ko(l, 10) | 0, l = i, i = j;
      }
      for (let B = 0; B < 16; B++) {
        const j = ko(s + bf(A, o, u, d) + Oo[U[B]] + L, H[B]) + x | 0;
        s = x, x = d, d = ko(u, 10) | 0, u = o, o = j;
      }
    }
    this.set(this.h1 + l + d | 0, this.h2 + h + x | 0, this.h3 + f + s | 0, this.h4 + r + o | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    Oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const _x = vs(() => new Mx()), Fo = BigInt(2 ** 32 - 1), dl = BigInt(32);
function I1(e, t = !1) {
  return t ? { h: Number(e & Fo), l: Number(e >> dl & Fo) } : { h: Number(e >> dl & Fo) | 0, l: Number(e & Fo) | 0 };
}
function Tx(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = I1(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Nx = (e, t) => BigInt(e >>> 0) << dl | BigInt(t >>> 0), Ux = (e, t, n) => e >>> n, Px = (e, t, n) => e << 32 - n | t >>> n, Dx = (e, t, n) => e >>> n | t << 32 - n, kx = (e, t, n) => e << 32 - n | t >>> n, Ox = (e, t, n) => e << 64 - n | t >>> n - 32, Fx = (e, t, n) => e >>> n - 32 | t << 64 - n, jx = (e, t) => t, zx = (e, t) => e, Rx = (e, t, n) => e << n | t >>> 32 - n, Vx = (e, t, n) => t << n | e >>> 32 - n, Gx = (e, t, n) => t << n - 32 | e >>> 64 - n, Kx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Wx(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Yx = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), qx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Xx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Zx = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Qx = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Jx = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, ue = {
  fromBig: I1,
  split: Tx,
  toBig: Nx,
  shrSH: Ux,
  shrSL: Px,
  rotrSH: Dx,
  rotrSL: kx,
  rotrBH: Ox,
  rotrBL: Fx,
  rotr32H: jx,
  rotr32L: zx,
  rotlSH: Rx,
  rotlSL: Vx,
  rotlBH: Gx,
  rotlBL: Kx,
  add: Wx,
  add3L: Yx,
  add3H: qx,
  add4L: Xx,
  add4H: Zx,
  add5H: Jx,
  add5L: Qx
}, [ew, tw] = ue.split([
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
].map((e) => BigInt(e))), gr = new Uint32Array(80), pr = new Uint32Array(80);
let Ga = class extends m0 {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: l, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: p, Gl: A, Hh: S, Hl: L } = this;
    return [t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = l | 0, this.Dl = u | 0, this.Eh = h | 0, this.El = d | 0, this.Fh = f | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = S | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let m = 0; m < 16; m++, n += 4)
      gr[m] = t.getUint32(n), pr[m] = t.getUint32(n += 4);
    for (let m = 16; m < 80; m++) {
      const H = gr[m - 15] | 0, B = pr[m - 15] | 0, j = ue.rotrSH(H, B, 1) ^ ue.rotrSH(H, B, 8) ^ ue.shrSH(H, B, 7), Q = ue.rotrSL(H, B, 1) ^ ue.rotrSL(H, B, 8) ^ ue.shrSL(H, B, 7), z = gr[m - 2] | 0, F = pr[m - 2] | 0, E = ue.rotrSH(z, F, 19) ^ ue.rotrBH(z, F, 61) ^ ue.shrSH(z, F, 6), M = ue.rotrSL(z, F, 19) ^ ue.rotrBL(z, F, 61) ^ ue.shrSL(z, F, 6), R = ue.add4L(Q, M, pr[m - 7], pr[m - 16]), N = ue.add4H(R, j, E, gr[m - 7], gr[m - 16]);
      gr[m] = N | 0, pr[m] = R | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: l, Cl: u, Dh: h, Dl: d, Eh: f, El: x, Fh: p, Fl: A, Gh: S, Gl: L, Hh: k, Hl: U } = this;
    for (let m = 0; m < 80; m++) {
      const H = ue.rotrSH(f, x, 14) ^ ue.rotrSH(f, x, 18) ^ ue.rotrBH(f, x, 41), B = ue.rotrSL(f, x, 14) ^ ue.rotrSL(f, x, 18) ^ ue.rotrBL(f, x, 41), j = f & p ^ ~f & S, Q = x & A ^ ~x & L, z = ue.add5L(U, B, Q, tw[m], pr[m]), F = ue.add5H(z, k, H, j, ew[m], gr[m]), E = z | 0, M = ue.rotrSH(r, s, 28) ^ ue.rotrBH(r, s, 34) ^ ue.rotrBH(r, s, 39), R = ue.rotrSL(r, s, 28) ^ ue.rotrBL(r, s, 34) ^ ue.rotrBL(r, s, 39), N = r & i ^ r & l ^ i & l, te = s & o ^ s & u ^ o & u;
      k = S | 0, U = L | 0, S = p | 0, L = A | 0, p = f | 0, A = x | 0, { h: f, l: x } = ue.add(h | 0, d | 0, F | 0, E | 0), h = l | 0, d = u | 0, l = i | 0, u = o | 0, i = r | 0, o = s | 0;
      const G = ue.add3L(E, R, te);
      r = ue.add3H(G, F, M, N), s = G | 0;
    }
    ({ h: r, l: s } = ue.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ue.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: l, l: u } = ue.add(this.Ch | 0, this.Cl | 0, l | 0, u | 0), { h, l: d } = ue.add(this.Dh | 0, this.Dl | 0, h | 0, d | 0), { h: f, l: x } = ue.add(this.Eh | 0, this.El | 0, f | 0, x | 0), { h: p, l: A } = ue.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: S, l: L } = ue.add(this.Gh | 0, this.Gl | 0, S | 0, L | 0), { h: k, l: U } = ue.add(this.Hh | 0, this.Hl | 0, k | 0, U | 0), this.set(r, s, i, o, l, u, h, d, f, x, p, A, S, L, k, U);
  }
  roundClean() {
    gr.fill(0), pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, nw = class extends Ga {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, rw = class extends Ga {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sw = class extends Ga {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
vs(() => new Ga());
vs(() => new nw());
vs(() => new rw());
vs(() => new sw());
var ya = { exports: {} };
ya.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", l = "[object Boolean]", u = "[object Date]", h = "[object Error]", d = "[object Function]", f = "[object GeneratorFunction]", x = "[object Map]", p = "[object Number]", A = "[object Object]", S = "[object Promise]", L = "[object RegExp]", k = "[object Set]", U = "[object String]", m = "[object Symbol]", H = "[object WeakMap]", B = "[object ArrayBuffer]", j = "[object DataView]", Q = "[object Float32Array]", z = "[object Float64Array]", F = "[object Int8Array]", E = "[object Int16Array]", M = "[object Int32Array]", R = "[object Uint8Array]", N = "[object Uint8ClampedArray]", te = "[object Uint16Array]", G = "[object Uint32Array]", $t = /[\\^$.*+?()[\]{}|]/g, Xt = /\w*$/, wt = /^\[object .+?Constructor\]$/, C = /^(?:0|[1-9]\d*)$/, P = {};
  P[i] = P[o] = P[B] = P[j] = P[l] = P[u] = P[Q] = P[z] = P[F] = P[E] = P[M] = P[x] = P[p] = P[A] = P[L] = P[k] = P[U] = P[m] = P[R] = P[N] = P[te] = P[G] = !0, P[h] = P[d] = P[H] = !1;
  var ve = typeof xt == "object" && xt && xt.Object === Object && xt, Ee = typeof self == "object" && self && self.Object === Object && self, Ae = ve || Ee || Function("return this")(), Xe = t && !t.nodeType && t, jr = Xe && !0 && e && !e.nodeType && e, Bs = jr && jr.exports === Xe;
  function pi(b, $) {
    return b.set($[0], $[1]), b;
  }
  function fc(b, $) {
    return b.add($), b;
  }
  function Ut(b, $) {
    for (var T = -1, X = b ? b.length : 0; ++T < X && $(b[T], T, b) !== !1; )
      ;
    return b;
  }
  function hc(b, $) {
    for (var T = -1, X = $.length, Ye = b.length; ++T < X; )
      b[Ye + T] = $[T];
    return b;
  }
  function oo(b, $, T, X) {
    for (var Ye = -1, Qe = b ? b.length : 0; ++Ye < Qe; )
      T = $(T, b[Ye], Ye, b);
    return T;
  }
  function Oe(b, $) {
    for (var T = -1, X = Array(b); ++T < b; )
      X[T] = $(T);
    return X;
  }
  function dc(b, $) {
    return b == null ? void 0 : b[$];
  }
  function ao(b) {
    var $ = !1;
    if (b != null && typeof b.toString != "function")
      try {
        $ = !!(b + "");
      } catch {
      }
    return $;
  }
  function co(b) {
    var $ = -1, T = Array(b.size);
    return b.forEach(function(X, Ye) {
      T[++$] = [Ye, X];
    }), T;
  }
  function bi(b, $) {
    return function(T) {
      return b($(T));
    };
  }
  function er(b) {
    var $ = -1, T = Array(b.size);
    return b.forEach(function(X) {
      T[++$] = X;
    }), T;
  }
  var gc = Array.prototype, yi = Function.prototype, Ge = Object.prototype, Hs = Ae["__core-js_shared__"], lo = function() {
    var b = /[^.]+$/.exec(Hs && Hs.keys && Hs.keys.IE_PROTO || "");
    return b ? "Symbol(src)_1." + b : "";
  }(), uo = yi.toString, dn = Ge.hasOwnProperty, Ct = Ge.toString, pc = RegExp(
    "^" + uo.call(dn).replace($t, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), fo = Bs ? Ae.Buffer : void 0, xi = Ae.Symbol, ho = Ae.Uint8Array, go = bi(Object.getPrototypeOf, Object), bc = Object.create, yc = Ge.propertyIsEnumerable, wi = gc.splice, Ze = Object.getOwnPropertySymbols, Pt = fo ? fo.isBuffer : void 0, gn = bi(Object.keys, Object), mi = tt(Ae, "DataView"), Zt = tt(Ae, "Map"), Si = tt(Ae, "Promise"), Ai = tt(Ae, "Set"), Qt = tt(Ae, "WeakMap"), zr = tt(Object, "create"), xc = jt(mi), Rr = jt(Zt), Vr = jt(Si), wc = jt(Ai), mc = jt(Qt), Ms = xi ? xi.prototype : void 0, vi = Ms ? Ms.valueOf : void 0;
  function Dt(b) {
    var $ = -1, T = b ? b.length : 0;
    for (this.clear(); ++$ < T; ) {
      var X = b[$];
      this.set(X[0], X[1]);
    }
  }
  function Sc() {
    this.__data__ = zr ? zr(null) : {};
  }
  function po(b) {
    return this.has(b) && delete this.__data__[b];
  }
  function bo(b) {
    var $ = this.__data__;
    if (zr) {
      var T = $[b];
      return T === r ? void 0 : T;
    }
    return dn.call($, b) ? $[b] : void 0;
  }
  function Ac(b) {
    var $ = this.__data__;
    return zr ? $[b] !== void 0 : dn.call($, b);
  }
  function _s(b, $) {
    var T = this.__data__;
    return T[b] = zr && $ === void 0 ? r : $, this;
  }
  Dt.prototype.clear = Sc, Dt.prototype.delete = po, Dt.prototype.get = bo, Dt.prototype.has = Ac, Dt.prototype.set = _s;
  function Jt(b) {
    var $ = -1, T = b ? b.length : 0;
    for (this.clear(); ++$ < T; ) {
      var X = b[$];
      this.set(X[0], X[1]);
    }
  }
  function yo() {
    this.__data__ = [];
  }
  function xo(b) {
    var $ = this.__data__, T = _($, b);
    if (T < 0)
      return !1;
    var X = $.length - 1;
    return T == X ? $.pop() : wi.call($, T, 1), !0;
  }
  function vc(b) {
    var $ = this.__data__, T = _($, b);
    return T < 0 ? void 0 : $[T][1];
  }
  function wo(b) {
    return _(this.__data__, b) > -1;
  }
  function mo(b, $) {
    var T = this.__data__, X = _(T, b);
    return X < 0 ? T.push([b, $]) : T[X][1] = $, this;
  }
  Jt.prototype.clear = yo, Jt.prototype.delete = xo, Jt.prototype.get = vc, Jt.prototype.has = wo, Jt.prototype.set = mo;
  function tr(b) {
    var $ = -1, T = b ? b.length : 0;
    for (this.clear(); ++$ < T; ) {
      var X = b[$];
      this.set(X[0], X[1]);
    }
  }
  function Ec() {
    this.__data__ = {
      hash: new Dt(),
      map: new (Zt || Jt)(),
      string: new Dt()
    };
  }
  function Ic(b) {
    return it(this, b).delete(b);
  }
  function $c(b) {
    return it(this, b).get(b);
  }
  function Cc(b) {
    return it(this, b).has(b);
  }
  function c(b, $) {
    return it(this, b).set(b, $), this;
  }
  tr.prototype.clear = Ec, tr.prototype.delete = Ic, tr.prototype.get = $c, tr.prototype.has = Cc, tr.prototype.set = c;
  function a(b) {
    this.__data__ = new Jt(b);
  }
  function g() {
    this.__data__ = new Jt();
  }
  function w(b) {
    return this.__data__.delete(b);
  }
  function y(b) {
    return this.__data__.get(b);
  }
  function v(b) {
    return this.__data__.has(b);
  }
  function I(b, $) {
    var T = this.__data__;
    if (T instanceof Jt) {
      var X = T.__data__;
      if (!Zt || X.length < n - 1)
        return X.push([b, $]), this;
      T = this.__data__ = new tr(X);
    }
    return T.set(b, $), this;
  }
  a.prototype.clear = g, a.prototype.delete = w, a.prototype.get = y, a.prototype.has = v, a.prototype.set = I;
  function D(b, $) {
    var T = On(b) || Gr(b) ? Oe(b.length, String) : [], X = T.length, Ye = !!X;
    for (var Qe in b)
      dn.call(b, Qe) && !(Ye && (Qe == "length" || At(Qe, X))) && T.push(Qe);
    return T;
  }
  function q(b, $, T) {
    var X = b[$];
    (!(dn.call(b, $) && sr(X, T)) || T === void 0 && !($ in b)) && (b[$] = T);
  }
  function _(b, $) {
    for (var T = b.length; T--; )
      if (sr(b[T][0], $))
        return T;
    return -1;
  }
  function W(b, $) {
    return b && Ft($, nt($), b);
  }
  function se(b, $, T, X, Ye, Qe, zt) {
    var vt;
    if (X && (vt = Qe ? X(b, Ye, Qe, zt) : X(b)), vt !== void 0)
      return vt;
    if (!Wr(b))
      return b;
    var mu = On(b);
    if (mu) {
      if (vt = bn(b), !$)
        return en(b, vt);
    } else {
      var Ts = St(b), Su = Ts == d || Ts == f;
      if (Lc(b))
        return ft(b, $);
      if (Ts == A || Ts == i || Su && !Qe) {
        if (ao(b))
          return Qe ? b : {};
        if (vt = ht(Su ? {} : b), !$)
          return Dn(b, W(vt, b));
      } else {
        if (!P[Ts])
          return Qe ? b : {};
        vt = tn(b, Ts, se, $);
      }
    }
    zt || (zt = new a());
    var Au = zt.get(b);
    if (Au)
      return Au;
    if (zt.set(b, vt), !mu)
      var vu = T ? mt(b) : nt(b);
    return Ut(vu || b, function(Bc, $o) {
      vu && ($o = Bc, Bc = b[$o]), q(vt, $o, se(Bc, $, T, X, $o, b, zt));
    }), vt;
  }
  function ae(b) {
    return Wr(b) ? bc(b) : {};
  }
  function re(b, $, T) {
    var X = $(b);
    return On(b) ? X : hc(X, T(b));
  }
  function Y(b) {
    return Ct.call(b);
  }
  function Ue(b) {
    if (!Wr(b) || nr(b))
      return !1;
    var $ = So(b) || ao(b) ? pc : wt;
    return $.test(jt(b));
  }
  function kt(b) {
    if (!nn(b))
      return gn(b);
    var $ = [];
    for (var T in Object(b))
      dn.call(b, T) && T != "constructor" && $.push(T);
    return $;
  }
  function ft(b, $) {
    if ($)
      return b.slice();
    var T = new b.constructor(b.length);
    return b.copy(T), T;
  }
  function Ce(b) {
    var $ = new b.constructor(b.byteLength);
    return new ho($).set(new ho(b)), $;
  }
  function Pe(b, $) {
    var T = $ ? Ce(b.buffer) : b.buffer;
    return new b.constructor(T, b.byteOffset, b.byteLength);
  }
  function ne(b, $, T) {
    var X = $ ? T(co(b), !0) : co(b);
    return oo(X, pi, new b.constructor());
  }
  function We(b) {
    var $ = new b.constructor(b.source, Xt.exec(b));
    return $.lastIndex = b.lastIndex, $;
  }
  function Ie(b, $, T) {
    var X = $ ? T(er(b), !0) : er(b);
    return oo(X, fc, new b.constructor());
  }
  function Ot(b) {
    return vi ? Object(vi.call(b)) : {};
  }
  function Pn(b, $) {
    var T = $ ? Ce(b.buffer) : b.buffer;
    return new b.constructor(T, b.byteOffset, b.length);
  }
  function en(b, $) {
    var T = -1, X = b.length;
    for ($ || ($ = Array(X)); ++T < X; )
      $[T] = b[T];
    return $;
  }
  function Ft(b, $, T, X) {
    T || (T = {});
    for (var Ye = -1, Qe = $.length; ++Ye < Qe; ) {
      var zt = $[Ye], vt = void 0;
      q(T, zt, vt === void 0 ? b[zt] : vt);
    }
    return T;
  }
  function Dn(b, $) {
    return Ft(b, pn(b), $);
  }
  function mt(b) {
    return re(b, nt, pn);
  }
  function it(b, $) {
    var T = b.__data__;
    return kn($) ? T[typeof $ == "string" ? "string" : "hash"] : T.map;
  }
  function tt(b, $) {
    var T = dc(b, $);
    return Ue(T) ? T : void 0;
  }
  var pn = Ze ? bi(Ze, Object) : Eo, St = Y;
  (mi && St(new mi(new ArrayBuffer(1))) != j || Zt && St(new Zt()) != x || Si && St(Si.resolve()) != S || Ai && St(new Ai()) != k || Qt && St(new Qt()) != H) && (St = function(b) {
    var $ = Ct.call(b), T = $ == A ? b.constructor : void 0, X = T ? jt(T) : void 0;
    if (X)
      switch (X) {
        case xc:
          return j;
        case Rr:
          return x;
        case Vr:
          return S;
        case wc:
          return k;
        case mc:
          return H;
      }
    return $;
  });
  function bn(b) {
    var $ = b.length, T = b.constructor($);
    return $ && typeof b[0] == "string" && dn.call(b, "index") && (T.index = b.index, T.input = b.input), T;
  }
  function ht(b) {
    return typeof b.constructor == "function" && !nn(b) ? ae(go(b)) : {};
  }
  function tn(b, $, T, X) {
    var Ye = b.constructor;
    switch ($) {
      case B:
        return Ce(b);
      case l:
      case u:
        return new Ye(+b);
      case j:
        return Pe(b, X);
      case Q:
      case z:
      case F:
      case E:
      case M:
      case R:
      case N:
      case te:
      case G:
        return Pn(b, X);
      case x:
        return ne(b, X, T);
      case p:
      case U:
        return new Ye(b);
      case L:
        return We(b);
      case k:
        return Ie(b, X, T);
      case m:
        return Ot(b);
    }
  }
  function At(b, $) {
    return $ = $ ?? s, !!$ && (typeof b == "number" || C.test(b)) && b > -1 && b % 1 == 0 && b < $;
  }
  function kn(b) {
    var $ = typeof b;
    return $ == "string" || $ == "number" || $ == "symbol" || $ == "boolean" ? b !== "__proto__" : b === null;
  }
  function nr(b) {
    return !!lo && lo in b;
  }
  function nn(b) {
    var $ = b && b.constructor, T = typeof $ == "function" && $.prototype || Ge;
    return b === T;
  }
  function jt(b) {
    if (b != null) {
      try {
        return uo.call(b);
      } catch {
      }
      try {
        return b + "";
      } catch {
      }
    }
    return "";
  }
  function rr(b) {
    return se(b, !0, !0);
  }
  function sr(b, $) {
    return b === $ || b !== b && $ !== $;
  }
  function Gr(b) {
    return Kr(b) && dn.call(b, "callee") && (!yc.call(b, "callee") || Ct.call(b) == i);
  }
  var On = Array.isArray;
  function Ei(b) {
    return b != null && Ao(b.length) && !So(b);
  }
  function Kr(b) {
    return vo(b) && Ei(b);
  }
  var Lc = Pt || Io;
  function So(b) {
    var $ = Wr(b) ? Ct.call(b) : "";
    return $ == d || $ == f;
  }
  function Ao(b) {
    return typeof b == "number" && b > -1 && b % 1 == 0 && b <= s;
  }
  function Wr(b) {
    var $ = typeof b;
    return !!b && ($ == "object" || $ == "function");
  }
  function vo(b) {
    return !!b && typeof b == "object";
  }
  function nt(b) {
    return Ei(b) ? D(b) : kt(b);
  }
  function Eo() {
    return [];
  }
  function Io() {
    return !1;
  }
  e.exports = rr;
})(ya, ya.exports);
var iw = ya.exports;
const $1 = /* @__PURE__ */ ud(iw);
var gl;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(gl || (gl = {}));
function ow(e, t) {
  return { type: gl.Address, version: e, hash160: t };
}
function aw(e) {
  return Es.c32address(e.version, e.hash160);
}
const cw = (e) => _x(x1(e)), lw = (e) => ee(cw(e));
ze.hmacSha256Sync = (e, ...t) => {
  const n = b1.create(x1, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function uw(e, t = "mainnet") {
  t = h1(t), e = typeof e == "string" ? we(e) : e;
  const n = Ex(zn.P2PKH, t), r = ow(n, lw(e));
  return aw(r);
}
function fw(e, t) {
  const n = ut.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, i = uw(s);
  if (t !== s) {
    if (t !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ut.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function hw(e, t = null) {
  let n;
  t ? n = fw(e, t) : n = ut.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const yf = "_blockstackDidCheckEchoReply", dw = "echoReply", gw = "authContinuation";
function pw(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function bw() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[yf];
  if (typeof t == "boolean")
    return t;
  const n = pw(e.location.search), r = n[dw];
  if (r) {
    e[yf] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const i = n[gw];
      e.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Oi {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Ua();
    else
      throw new r2("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Zu(t.sessionOptions) : this.store = new Zu() : t ? this.store = new Xu(t.sessionOptions) : this.store = new Xu();
  }
  makeAuthRequestToken(t, n, r, s, i, o = i2().getTime(), l = {}) {
    const u = this.appConfig;
    if (!u)
      throw new nl("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || u.redirectURI(), r = r || u.manifestURI(), s = s || u.scopes, i = i || u.appDomain, tx(t, n, r, s, i, o, l);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = ex();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = i0("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (bw())
        return Ps.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Ps.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = L2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Co("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ut.decodeToken(t).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await ox(t))
      throw new Co("Invalid authentication response.");
    let l = i.private_key, u = i.core_token;
    if (Nc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            l = await Yu(s, i.private_key);
          } catch {
            if (Ps.warn("Failed decryption of appPrivateKey, will try to use as given"), !ze.isValidPrivateKey(i.private_key))
              throw new Co("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (u != null)
          try {
            u = await Yu(s, u);
          } catch {
            Ps.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Co("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let h = y2, d;
    Nc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (h = i.hubUrl), Nc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const f = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: l1(i.iss),
      appPrivateKey: l,
      coreSessionToken: u,
      authResponseToken: t,
      hubUrl: h,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, x = i.profile_url;
    if (!f.profile && x) {
      const p = await n(x);
      if (!p.ok)
        f.profile = Object.assign({}, e2);
      else {
        const A = await p.text(), S = JSON.parse(A);
        f.profile = hw(S[0].token);
      }
    } else
      f.profile = i.profile;
    return r.userData = f, this.store.setSessionData(r), f;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new nl("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), yy(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), xy(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Oi.prototype.makeAuthRequest = Oi.prototype.makeAuthRequestToken;
const yw = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], xw = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = yw(), n = e.filter((r) => t.find((i) => i.id === r.id) ? !1 : !!Ka(r.id));
  return t.concat(n);
}, Ka = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), E0 = "STX_PROVIDER", fn = () => typeof window > "u" ? null : window.localStorage.getItem(E0), C1 = (e) => {
  typeof window < "u" && window.localStorage.setItem(E0, e);
}, L1 = () => {
  typeof window < "u" && window.localStorage.removeItem(E0);
};
(function() {
  (function(e) {
    (function(t) {
      var n = typeof globalThis < "u" && globalThis || typeof e < "u" && e || // eslint-disable-next-line no-undef
      typeof xt < "u" && xt || {}, r = {
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
      function s(E) {
        return E && DataView.prototype.isPrototypeOf(E);
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
        ], o = ArrayBuffer.isView || function(E) {
          return E && i.indexOf(Object.prototype.toString.call(E)) > -1;
        };
      function l(E) {
        if (typeof E != "string" && (E = String(E)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(E) || E === "")
          throw new TypeError('Invalid character in header field name: "' + E + '"');
        return E.toLowerCase();
      }
      function u(E) {
        return typeof E != "string" && (E = String(E)), E;
      }
      function h(E) {
        var M = {
          next: function() {
            var R = E.shift();
            return { done: R === void 0, value: R };
          }
        };
        return r.iterable && (M[Symbol.iterator] = function() {
          return M;
        }), M;
      }
      function d(E) {
        this.map = {}, E instanceof d ? E.forEach(function(M, R) {
          this.append(R, M);
        }, this) : Array.isArray(E) ? E.forEach(function(M) {
          if (M.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + M.length);
          this.append(M[0], M[1]);
        }, this) : E && Object.getOwnPropertyNames(E).forEach(function(M) {
          this.append(M, E[M]);
        }, this);
      }
      d.prototype.append = function(E, M) {
        E = l(E), M = u(M);
        var R = this.map[E];
        this.map[E] = R ? R + ", " + M : M;
      }, d.prototype.delete = function(E) {
        delete this.map[l(E)];
      }, d.prototype.get = function(E) {
        return E = l(E), this.has(E) ? this.map[E] : null;
      }, d.prototype.has = function(E) {
        return this.map.hasOwnProperty(l(E));
      }, d.prototype.set = function(E, M) {
        this.map[l(E)] = u(M);
      }, d.prototype.forEach = function(E, M) {
        for (var R in this.map)
          this.map.hasOwnProperty(R) && E.call(M, this.map[R], R, this);
      }, d.prototype.keys = function() {
        var E = [];
        return this.forEach(function(M, R) {
          E.push(R);
        }), h(E);
      }, d.prototype.values = function() {
        var E = [];
        return this.forEach(function(M) {
          E.push(M);
        }), h(E);
      }, d.prototype.entries = function() {
        var E = [];
        return this.forEach(function(M, R) {
          E.push([R, M]);
        }), h(E);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function f(E) {
        if (!E._noBody) {
          if (E.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          E.bodyUsed = !0;
        }
      }
      function x(E) {
        return new Promise(function(M, R) {
          E.onload = function() {
            M(E.result);
          }, E.onerror = function() {
            R(E.error);
          };
        });
      }
      function p(E) {
        var M = new FileReader(), R = x(M);
        return M.readAsArrayBuffer(E), R;
      }
      function A(E) {
        var M = new FileReader(), R = x(M), N = /charset=([A-Za-z0-9_-]+)/.exec(E.type), te = N ? N[1] : "utf-8";
        return M.readAsText(E, te), R;
      }
      function S(E) {
        for (var M = new Uint8Array(E), R = new Array(M.length), N = 0; N < M.length; N++)
          R[N] = String.fromCharCode(M[N]);
        return R.join("");
      }
      function L(E) {
        if (E.slice)
          return E.slice(0);
        var M = new Uint8Array(E.byteLength);
        return M.set(new Uint8Array(E)), M.buffer;
      }
      function k() {
        return this.bodyUsed = !1, this._initBody = function(E) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = E, E ? typeof E == "string" ? this._bodyText = E : r.blob && Blob.prototype.isPrototypeOf(E) ? this._bodyBlob = E : r.formData && FormData.prototype.isPrototypeOf(E) ? this._bodyFormData = E : r.searchParams && URLSearchParams.prototype.isPrototypeOf(E) ? this._bodyText = E.toString() : r.arrayBuffer && r.blob && s(E) ? (this._bodyArrayBuffer = L(E.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(E) || o(E)) ? this._bodyArrayBuffer = L(E) : this._bodyText = E = Object.prototype.toString.call(E) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof E == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(E) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var E = f(this);
          if (E)
            return E;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var E = f(this);
            return E || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(p);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var E = f(this);
          if (E)
            return E;
          if (this._bodyBlob)
            return A(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function m(E) {
        var M = E.toUpperCase();
        return U.indexOf(M) > -1 ? M : E;
      }
      function H(E, M) {
        if (!(this instanceof H))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        M = M || {};
        var R = M.body;
        if (E instanceof H) {
          if (E.bodyUsed)
            throw new TypeError("Already read");
          this.url = E.url, this.credentials = E.credentials, M.headers || (this.headers = new d(E.headers)), this.method = E.method, this.mode = E.mode, this.signal = E.signal, !R && E._bodyInit != null && (R = E._bodyInit, E.bodyUsed = !0);
        } else
          this.url = String(E);
        if (this.credentials = M.credentials || this.credentials || "same-origin", (M.headers || !this.headers) && (this.headers = new d(M.headers)), this.method = m(M.method || this.method || "GET"), this.mode = M.mode || this.mode || null, this.signal = M.signal || this.signal || function() {
          if ("AbortController" in n) {
            var G = new AbortController();
            return G.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && R)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(R), (this.method === "GET" || this.method === "HEAD") && (M.cache === "no-store" || M.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var te = /\?/;
            this.url += (te.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      H.prototype.clone = function() {
        return new H(this, { body: this._bodyInit });
      };
      function B(E) {
        var M = new FormData();
        return E.trim().split("&").forEach(function(R) {
          if (R) {
            var N = R.split("="), te = N.shift().replace(/\+/g, " "), G = N.join("=").replace(/\+/g, " ");
            M.append(decodeURIComponent(te), decodeURIComponent(G));
          }
        }), M;
      }
      function j(E) {
        var M = new d(), R = E.replace(/\r?\n[\t ]+/g, " ");
        return R.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var te = N.split(":"), G = te.shift().trim();
          if (G) {
            var $t = te.join(":").trim();
            try {
              M.append(G, $t);
            } catch (Xt) {
              console.warn("Response " + Xt.message);
            }
          }
        }), M;
      }
      k.call(H.prototype);
      function Q(E, M) {
        if (!(this instanceof Q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (M || (M = {}), this.type = "default", this.status = M.status === void 0 ? 200 : M.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = M.statusText === void 0 ? "" : "" + M.statusText, this.headers = new d(M.headers), this.url = M.url || "", this._initBody(E);
      }
      k.call(Q.prototype), Q.prototype.clone = function() {
        return new Q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, Q.error = function() {
        var E = new Q(null, { status: 200, statusText: "" });
        return E.ok = !1, E.status = 0, E.type = "error", E;
      };
      var z = [301, 302, 303, 307, 308];
      Q.redirect = function(E, M) {
        if (z.indexOf(M) === -1)
          throw new RangeError("Invalid status code");
        return new Q(null, { status: M, headers: { location: E } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(M, R) {
          this.message = M, this.name = R;
          var N = Error(M);
          this.stack = N.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function F(E, M) {
        return new Promise(function(R, N) {
          var te = new H(E, M);
          if (te.signal && te.signal.aborted)
            return N(new t.DOMException("Aborted", "AbortError"));
          var G = new XMLHttpRequest();
          function $t() {
            G.abort();
          }
          G.onload = function() {
            var C = {
              statusText: G.statusText,
              headers: j(G.getAllResponseHeaders() || "")
            };
            te.url.indexOf("file://") === 0 && (G.status < 200 || G.status > 599) ? C.status = 200 : C.status = G.status, C.url = "responseURL" in G ? G.responseURL : C.headers.get("X-Request-URL");
            var P = "response" in G ? G.response : G.responseText;
            setTimeout(function() {
              R(new Q(P, C));
            }, 0);
          }, G.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, G.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, G.onabort = function() {
            setTimeout(function() {
              N(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Xt(C) {
            try {
              return C === "" && n.location.href ? n.location.href : C;
            } catch {
              return C;
            }
          }
          if (G.open(te.method, Xt(te.url), !0), te.credentials === "include" ? G.withCredentials = !0 : te.credentials === "omit" && (G.withCredentials = !1), "responseType" in G && (r.blob ? G.responseType = "blob" : r.arrayBuffer && (G.responseType = "arraybuffer")), M && typeof M.headers == "object" && !(M.headers instanceof d || n.Headers && M.headers instanceof n.Headers)) {
            var wt = [];
            Object.getOwnPropertyNames(M.headers).forEach(function(C) {
              wt.push(l(C)), G.setRequestHeader(C, u(M.headers[C]));
            }), te.headers.forEach(function(C, P) {
              wt.indexOf(P) === -1 && G.setRequestHeader(P, C);
            });
          } else
            te.headers.forEach(function(C, P) {
              G.setRequestHeader(P, C);
            });
          te.signal && (te.signal.addEventListener("abort", $t), G.onreadystatechange = function() {
            G.readyState === 4 && te.signal.removeEventListener("abort", $t);
          }), G.send(typeof te._bodyInit > "u" ? null : te._bodyInit);
        });
      }
      return F.polyfill = !0, n.fetch || (n.fetch = F, n.Headers = d, n.Request = H, n.Response = Q), t.Headers = d, t.Request = H, t.Response = Q, t.fetch = F, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : xt);
})();
const ww = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function mw(e, t) {
  const n = {};
  return Object.assign(n, ww, t), await fetch(e, n);
}
function Sw(e) {
  let t = mw, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Aw(...e) {
  const { fetchLib: t, middlewares: n } = Sw(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const u of n)
      typeof u.pre == "function" && (o = await Promise.resolve(u.pre({
        fetch: t,
        ...o
      })) ?? o);
    let l = await t(o.url, o.init);
    for (const u of n)
      typeof u.post == "function" && (l = await Promise.resolve(u.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (l == null ? void 0 : l.clone()) ?? l
      })) ?? l);
    return l;
  };
}
var Zs;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Zs || (Zs = {}));
var fs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(fs || (fs = {}));
var xf;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(xf || (xf = {}));
const vw = "https://api.mainnet.hiro.so", Ew = "https://api.testnet.hiro.so", Iw = "http://localhost:3999", $w = ["mainnet", "testnet", "devnet", "mocknet"];
class hs {
  constructor(t) {
    this.version = fs.Mainnet, this.chainId = Zs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === fs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Aw();
  }
  getNameInfo(t) {
    const n = `${this.bnsLookupUrl}/v1/names/${t}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
}
hs.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new pl();
    case "testnet":
      return new bl();
    case "devnet":
      return new Cw();
    case "mocknet":
      return new B1();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$w.join(", ")}`);
  }
};
hs.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : hs.fromName(e);
class pl extends hs {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? vw,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = fs.Mainnet, this.chainId = Zs.Mainnet;
  }
}
class bl extends hs {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Ew,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = fs.Testnet, this.chainId = Zs.Testnet;
  }
}
class B1 extends hs {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Iw,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = fs.Testnet, this.chainId = Zs.Testnet;
  }
}
const Cw = B1;
var ds;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ds || (ds = {}));
var xa;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(xa || (xa = {}));
ds.Mainnet;
var gs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(gs || (gs = {}));
var ps;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ps || (ps = {}));
gs.Mainnet;
const Lw = {
  chainId: ds.Mainnet,
  transactionVersion: gs.Mainnet,
  peerNetworkId: xa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ps.MainnetSingleSig,
    multiSig: ps.MainnetMultiSig
  },
  client: { baseUrl: Rh }
}, yl = {
  chainId: ds.Testnet,
  transactionVersion: gs.Testnet,
  peerNetworkId: xa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ps.TestnetSingleSig,
    multiSig: ps.TestnetMultiSig
  },
  client: { baseUrl: Vh }
}, na = {
  ...yl,
  addressVersion: { ...yl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Gh }
}, Bw = {
  ...na,
  addressVersion: { ...na.addressVersion },
  client: { ...na.client }
};
function Hw(e) {
  switch (e) {
    case "mainnet":
      return Lw;
    case "testnet":
      return yl;
    case "devnet":
      return na;
    case "mocknet":
      return Bw;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Mw(e) {
  return typeof e == "string" ? Hw(e) : e;
}
function _w(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const wf = /* @__PURE__ */ new Map();
function H1(e, t) {
  const n = wf.get(e);
  if (n !== void 0)
    return n(t);
  const r = _w(e);
  return wf.set(e, r), H1(e, t);
}
let Me = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? we(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return E2(this.readBytes(4), 0);
  }
  readUInt8() {
    return A2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return m2(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = ee(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = ee(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (H1(t, r))
      return r;
    throw n(r);
  }
};
const Tw = 128, Nw = 128, M1 = 16, rs = 32, xl = 80, Wa = 65, Uw = 32, Pw = 64, wa = 34, Dw = 1 + 16 * 1024 * 1024, kw = 165, Ow = 16, Fw = 16, jw = 20, zw = Fw + 2 + jw, Rw = zw + 4, Vw = Dw + (kw + Ow * Rw);
var Se;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Se || (Se = {}));
var wl;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(wl || (wl = {}));
var Bt;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Bt || (Bt = {}));
const jc = ["onChainOnly", "offChainOnly", "any"];
jc[0] + "", Bt.OnChainOnly, jc[1] + "", Bt.OffChainOnly, jc[2] + "", Bt.Any, Bt.OnChainOnly + "", Bt.OnChainOnly, Bt.OffChainOnly + "", Bt.OffChainOnly, Bt.Any + "", Bt.Any;
var ma;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(ma || (ma = {}));
var _e;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(_e || (_e = {}));
var Fe;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Fe || (Fe = {}));
var Le;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Le || (Le = {}));
var De;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(De || (De = {}));
var Ui;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ui || (Ui = {}));
var ml;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(ml || (ml = {}));
var Sl;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Sl || (Sl = {}));
var yt;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(yt || (yt = {}));
var mf;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(mf || (mf = {}));
var Al;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Al || (Al = {}));
var on;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(on || (on = {}));
var Sf;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Sf || (Sf = {}));
let Ya = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ds = class extends Ya {
  constructor(t) {
    super(t);
  }
}, gt = class extends Ya {
  constructor(t) {
    super(t);
  }
}, Sa = class extends Ya {
  constructor(t) {
    super(t);
  }
}, Qr = class extends Ya {
  constructor(t) {
    super(t);
  }
};
function vl(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Gw(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function _1(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Kw(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vl(e.outputLen), vl(e.blockLen);
}
function Ww(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Yw(e, t) {
  _1(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Jr = {
  number: vl,
  bool: Gw,
  bytes: _1,
  hash: Kw,
  exists: Ww,
  output: Yw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zc = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), mn = (e, t) => e << 32 - t | e >>> t, qw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Xw(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function I0(e) {
  if (typeof e == "string" && (e = Xw(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let T1 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Is(e) {
  const t = (r) => e().update(I0(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let N1 = class extends T1 {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Jr.hash(t);
    const r = I0(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return Jr.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Jr.exists(this), Jr.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: l } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = l, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const U1 = (e, t, n) => new N1(e, t).update(n).digest();
U1.create = (e, t) => new N1(e, t);
function Zw(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), l = Number(n & i), u = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + u, o, r), e.setUint32(t + h, l, r);
}
let $0 = class extends T1 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = zc(this.buffer);
  }
  update(t) {
    Jr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = I0(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const l = Math.min(s - this.pos, i - o);
      if (l === s) {
        const u = zc(t);
        for (; s <= i - o; o += s)
          this.process(u, o);
        continue;
      }
      r.set(t.subarray(o, o + l), this.pos), this.pos += l, o += l, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Jr.exists(this), Jr.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let f = o; f < s; f++)
      n[f] = 0;
    Zw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = zc(t), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = u / 4, d = this.get();
    if (h > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < h; f++)
      l.setUint32(4 * f, d[f], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: l } = this;
    return t.length = s, t.pos = l, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const Qw = (e, t, n) => e & t ^ ~e & n, Jw = (e, t, n) => e & t ^ e & n ^ t & n, em = new Uint32Array([
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
]), br = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), yr = new Uint32Array(64);
let P1 = class extends $0 {
  constructor() {
    super(64, 32, 8, !1), this.A = br[0] | 0, this.B = br[1] | 0, this.C = br[2] | 0, this.D = br[3] | 0, this.E = br[4] | 0, this.F = br[5] | 0, this.G = br[6] | 0, this.H = br[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: l, H: u } = this;
    return [t, n, r, s, i, o, l, u];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = l | 0, this.H = u | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      yr[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const x = yr[f - 15], p = yr[f - 2], A = mn(x, 7) ^ mn(x, 18) ^ x >>> 3, S = mn(p, 17) ^ mn(p, 19) ^ p >>> 10;
      yr[f] = S + yr[f - 7] + A + yr[f - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: l, F: u, G: h, H: d } = this;
    for (let f = 0; f < 64; f++) {
      const x = mn(l, 6) ^ mn(l, 11) ^ mn(l, 25), p = d + x + Qw(l, u, h) + em[f] + yr[f] | 0, S = (mn(r, 2) ^ mn(r, 13) ^ mn(r, 22)) + Jw(r, s, i) | 0;
      d = h, h = u, u = l, l = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, l = l + this.E | 0, u = u + this.F | 0, h = h + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, l, u, h, d);
  }
  roundClean() {
    yr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, tm = class extends P1 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const C0 = Is(() => new P1());
Is(() => new tm());
const nm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), D1 = Uint8Array.from({ length: 16 }, (e, t) => t), rm = D1.map((e) => (9 * e + 5) % 16);
let L0 = [D1], B0 = [rm];
for (let e = 0; e < 4; e++)
  for (let t of [L0, B0])
    t.push(t[e].map((n) => nm[n]));
const k1 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), sm = L0.map((e, t) => e.map((n) => k1[t][n])), im = B0.map((e, t) => e.map((n) => k1[t][n])), om = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), am = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), jo = (e, t) => e << t | e >>> 32 - t;
function Af(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const zo = new Uint32Array(16);
let cm = class extends $0 {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      zo[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, l = this.h2 | 0, u = l, h = this.h3 | 0, d = h, f = this.h4 | 0, x = f;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, S = om[p], L = am[p], k = L0[p], U = B0[p], m = sm[p], H = im[p];
      for (let B = 0; B < 16; B++) {
        const j = jo(r + Af(p, i, l, h) + zo[k[B]] + S, m[B]) + f | 0;
        r = f, f = h, h = jo(l, 10) | 0, l = i, i = j;
      }
      for (let B = 0; B < 16; B++) {
        const j = jo(s + Af(A, o, u, d) + zo[U[B]] + L, H[B]) + x | 0;
        s = x, x = d, d = jo(u, 10) | 0, u = o, o = j;
      }
    }
    this.set(this.h1 + l + d | 0, this.h2 + h + x | 0, this.h3 + f + s | 0, this.h4 + r + o | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    zo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const lm = Is(() => new cm()), Ro = BigInt(2 ** 32 - 1), El = BigInt(32);
function O1(e, t = !1) {
  return t ? { h: Number(e & Ro), l: Number(e >> El & Ro) } : { h: Number(e >> El & Ro) | 0, l: Number(e & Ro) | 0 };
}
function um(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = O1(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const fm = (e, t) => BigInt(e >>> 0) << El | BigInt(t >>> 0), hm = (e, t, n) => e >>> n, dm = (e, t, n) => e << 32 - n | t >>> n, gm = (e, t, n) => e >>> n | t << 32 - n, pm = (e, t, n) => e << 32 - n | t >>> n, bm = (e, t, n) => e << 64 - n | t >>> n - 32, ym = (e, t, n) => e >>> n - 32 | t << 64 - n, xm = (e, t) => t, wm = (e, t) => e, mm = (e, t, n) => e << n | t >>> 32 - n, Sm = (e, t, n) => t << n | e >>> 32 - n, Am = (e, t, n) => t << n - 32 | e >>> 64 - n, vm = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Em(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Im = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), $m = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Cm = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Lm = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Bm = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Hm = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, fe = {
  fromBig: O1,
  split: um,
  toBig: fm,
  shrSH: hm,
  shrSL: dm,
  rotrSH: gm,
  rotrSL: pm,
  rotrBH: bm,
  rotrBL: ym,
  rotr32H: xm,
  rotr32L: wm,
  rotlSH: mm,
  rotlSL: Sm,
  rotlBH: Am,
  rotlBL: vm,
  add: Em,
  add3L: Im,
  add3H: $m,
  add4L: Cm,
  add4H: Lm,
  add5H: Hm,
  add5L: Bm
}, [Mm, _m] = fe.split([
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
].map((e) => BigInt(e))), xr = new Uint32Array(80), wr = new Uint32Array(80);
let qa = class extends $0 {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: l, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: p, Gl: A, Hh: S, Hl: L } = this;
    return [t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = l | 0, this.Dl = u | 0, this.Eh = h | 0, this.El = d | 0, this.Fh = f | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = S | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let m = 0; m < 16; m++, n += 4)
      xr[m] = t.getUint32(n), wr[m] = t.getUint32(n += 4);
    for (let m = 16; m < 80; m++) {
      const H = xr[m - 15] | 0, B = wr[m - 15] | 0, j = fe.rotrSH(H, B, 1) ^ fe.rotrSH(H, B, 8) ^ fe.shrSH(H, B, 7), Q = fe.rotrSL(H, B, 1) ^ fe.rotrSL(H, B, 8) ^ fe.shrSL(H, B, 7), z = xr[m - 2] | 0, F = wr[m - 2] | 0, E = fe.rotrSH(z, F, 19) ^ fe.rotrBH(z, F, 61) ^ fe.shrSH(z, F, 6), M = fe.rotrSL(z, F, 19) ^ fe.rotrBL(z, F, 61) ^ fe.shrSL(z, F, 6), R = fe.add4L(Q, M, wr[m - 7], wr[m - 16]), N = fe.add4H(R, j, E, xr[m - 7], xr[m - 16]);
      xr[m] = N | 0, wr[m] = R | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: l, Cl: u, Dh: h, Dl: d, Eh: f, El: x, Fh: p, Fl: A, Gh: S, Gl: L, Hh: k, Hl: U } = this;
    for (let m = 0; m < 80; m++) {
      const H = fe.rotrSH(f, x, 14) ^ fe.rotrSH(f, x, 18) ^ fe.rotrBH(f, x, 41), B = fe.rotrSL(f, x, 14) ^ fe.rotrSL(f, x, 18) ^ fe.rotrBL(f, x, 41), j = f & p ^ ~f & S, Q = x & A ^ ~x & L, z = fe.add5L(U, B, Q, _m[m], wr[m]), F = fe.add5H(z, k, H, j, Mm[m], xr[m]), E = z | 0, M = fe.rotrSH(r, s, 28) ^ fe.rotrBH(r, s, 34) ^ fe.rotrBH(r, s, 39), R = fe.rotrSL(r, s, 28) ^ fe.rotrBL(r, s, 34) ^ fe.rotrBL(r, s, 39), N = r & i ^ r & l ^ i & l, te = s & o ^ s & u ^ o & u;
      k = S | 0, U = L | 0, S = p | 0, L = A | 0, p = f | 0, A = x | 0, { h: f, l: x } = fe.add(h | 0, d | 0, F | 0, E | 0), h = l | 0, d = u | 0, l = i | 0, u = o | 0, i = r | 0, o = s | 0;
      const G = fe.add3L(E, R, te);
      r = fe.add3H(G, F, M, N), s = G | 0;
    }
    ({ h: r, l: s } = fe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = fe.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: l, l: u } = fe.add(this.Ch | 0, this.Cl | 0, l | 0, u | 0), { h, l: d } = fe.add(this.Dh | 0, this.Dl | 0, h | 0, d | 0), { h: f, l: x } = fe.add(this.Eh | 0, this.El | 0, f | 0, x | 0), { h: p, l: A } = fe.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: S, l: L } = fe.add(this.Gh | 0, this.Gl | 0, S | 0, L | 0), { h: k, l: U } = fe.add(this.Hh | 0, this.Hl | 0, k | 0, U | 0), this.set(r, s, i, o, l, u, h, d, f, x, p, A, S, L, k, U);
  }
  roundClean() {
    xr.fill(0), wr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Tm = class extends qa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Nm = class extends qa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Um = class extends qa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Is(() => new qa());
Is(() => new Tm());
const Pm = Is(() => new Nm());
Is(() => new Um());
var ye;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(ye || (ye = {}));
var qe;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(qe || (qe = {}));
function H0(e) {
  return qe[e];
}
const Dm = () => ({ type: ye.BoolTrue }), km = () => ({ type: ye.BoolFalse }), Om = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ye.Buffer, value: ee(e) };
}, vf = BigInt("0xffffffffffffffffffffffffffffffff"), Fm = BigInt(0), Ef = BigInt("0x7fffffffffffffffffffffffffffffff"), If = BigInt("-170141183460469231731687303715884105728"), jm = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = sl(we(e))), It(e, Uint8Array) && (e = sl(e));
  const t = lt(e);
  if (t > Ef)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ef}`);
  if (t < If)
    throw new RangeError(`Cannot construct clarity integer form value less than ${If}`);
  return { type: ye.Int, value: t };
}, zm = (e) => {
  const t = lt(e);
  if (t < Fm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > vf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${vf}`);
  return { type: ye.UInt, value: t };
};
function Rm(e) {
  return { type: ye.List, value: e };
}
function F1() {
  return { type: ye.OptionalNone };
}
function j1(e) {
  return { type: ye.OptionalSome, value: e };
}
var K;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(K || (K = {}));
function Vm() {
  return {
    type: K.Address,
    version: ps.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function $f(e) {
  if (e && X1(e, wa))
    throw new Error(`Memo exceeds maximum length of ${wa} bytes`);
  return { type: K.MemoString, content: e };
}
function M0(e, t) {
  return {
    type: K.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Il(e) {
  if (we(e).byteLength != Wa)
    throw Error("Invalid signature");
  return {
    type: K.MessageSignature,
    data: e
  };
}
function Gm(e, t, n) {
  return typeof e == "string" && (e = aS(e)), typeof n == "string" && (n = $f(n)), {
    type: K.Payload,
    payloadType: Se.TokenTransfer,
    recipient: e,
    amount: lt(t),
    memo: n ?? $f("")
  };
}
function Km(e, t, n, r) {
  return typeof t == "string" && (t = hn(t)), typeof n == "string" && (n = hn(n)), {
    type: K.Payload,
    payloadType: Se.ContractCall,
    contractAddress: typeof e == "string" ? Fr(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function Wm(e) {
  return hn(e, 4, 1e5);
}
function Cf(e, t, n) {
  return typeof e == "string" && (e = hn(e)), typeof t == "string" && (t = Wm(t)), typeof n == "number" ? {
    type: K.Payload,
    payloadType: Se.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: K.Payload,
    payloadType: Se.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function Ym() {
  return { type: K.Payload, payloadType: Se.PoisonMicroblock };
}
function Lf(e, t) {
  if (e.byteLength != rs)
    throw Error(`Coinbase buffer size must be ${rs} bytes`);
  return t != null ? {
    type: K.Payload,
    payloadType: Se.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: K.Payload,
    payloadType: Se.Coinbase,
    coinbaseBytes: e
  };
}
function qm(e, t, n) {
  if (e.byteLength != rs)
    throw Error(`Coinbase buffer size must be ${rs} bytes`);
  if (n.byteLength != xl)
    throw Error(`VRF proof buffer size must be ${xl} bytes`);
  return {
    type: K.Payload,
    payloadType: Se.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ye.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function Xm(e, t, n, r, s, i, o) {
  return {
    type: K.Payload,
    payloadType: Se.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function hn(e, t, n) {
  const r = t || 1, s = n || Tw;
  if (X1(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: K.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Zm(e, t, n) {
  return {
    type: K.Asset,
    address: Fr(e),
    contractName: hn(t),
    assetName: hn(n)
  };
}
function Fr(e) {
  const t = Es.c32addressDecode(e);
  return {
    type: K.Address,
    version: t[0],
    hash160: t[1]
  };
}
function Qm(e, t) {
  const n = Fr(e), r = hn(t);
  return {
    type: K.Principal,
    prefix: yt.Contract,
    address: n,
    contractName: r
  };
}
function Jm(e) {
  const t = Fr(e);
  return {
    type: K.Principal,
    prefix: yt.Standard,
    address: t
  };
}
function ks(e, t) {
  return {
    pubKeyEncoding: e,
    type: K.TransactionAuthField,
    contents: t
  };
}
function Fn(e) {
  switch (e.type) {
    case K.Address:
      return eo(e);
    case K.Principal:
      return z1(e);
    case K.LengthPrefixedString:
      return Js(e);
    case K.MemoString:
      return tS(e);
    case K.Asset:
      return V1(e);
    case K.PostCondition:
      return K1(e);
    case K.PublicKey:
      return Ll(e);
    case K.LengthPrefixedList:
      return _0(e);
    case K.Payload:
      return W1(e);
    case K.TransactionAuthField:
      return oS(e);
    case K.MessageSignature:
      return T0(e);
  }
}
function eo(e) {
  const t = [];
  return t.push(we(qi(e.version, 1))), t.push(we(e.hash160)), Re(t);
}
function Qs(e) {
  const t = It(e, Me) ? e : new Me(e), n = Na(ee(t.readBytes(1))), r = ee(t.readBytes(20));
  return { type: K.Address, version: n, hash160: r };
}
function z1(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === yt.Standard || e.prefix === yt.Contract) && t.push(eo(e.address)), e.prefix === yt.Contract && t.push(Js(e.contractName)), Re(t);
}
function eS(e) {
  const t = It(e, Me) ? e : new Me(e), n = t.readUInt8Enum(yt, (i) => {
    throw new gt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === yt.Origin)
    return { type: K.Principal, prefix: n };
  const r = Qs(t);
  if (n === yt.Standard)
    return { type: K.Principal, prefix: n, address: r };
  const s = Kt(t);
  return {
    type: K.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Js(e) {
  const t = [], n = Ss(e.content), r = n.byteLength;
  return t.push(we(qi(r, e.lengthPrefixBytes))), t.push(n), Re(t);
}
function Kt(e, t, n) {
  t = t || 1;
  const r = It(e, Me) ? e : new Me(e), s = Na(ee(r.readBytes(t))), i = Xi(r.readBytes(s));
  return hn(i, t, n ?? 128);
}
function tS(e) {
  const t = [], n = Ss(e.content), r = HS(ee(n), wa * 2);
  return t.push(we(r)), Re(t);
}
function R1(e) {
  const t = It(e, Me) ? e : new Me(e);
  let n = Xi(t.readBytes(wa));
  return n = n.replace(/\u0000*$/, ""), { type: K.MemoString, content: n };
}
function V1(e) {
  const t = [];
  return t.push(eo(e.address)), t.push(Js(e.contractName)), t.push(Js(e.assetName)), Re(t);
}
function $l(e) {
  const t = It(e, Me) ? e : new Me(e);
  return {
    type: K.Asset,
    address: Qs(t),
    contractName: Kt(t),
    assetName: Kt(t)
  };
}
function _0(e) {
  const t = e.values, n = [];
  n.push(we(qi(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Fn(r));
  return Re(n);
}
function G1(e, t, n) {
  const r = It(e, Me) ? e : new Me(e), s = Na(ee(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (t) {
      case K.Address:
        i.push(Qs(r));
        break;
      case K.LengthPrefixedString:
        i.push(Kt(r));
        break;
      case K.MemoString:
        i.push(R1(r));
        break;
      case K.Asset:
        i.push($l(r));
        break;
      case K.PostCondition:
        i.push(rS(r));
        break;
      case K.PublicKey:
        i.push(Bl(r));
        break;
      case K.TransactionAuthField:
        i.push(iS(r));
        break;
    }
  return M0(i, n);
}
function nS(e) {
  return ee(K1(e));
}
function K1(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(z1(e.principal)), (e.conditionType === _e.Fungible || e.conditionType === _e.NonFungible) && t.push(V1(e.asset)), e.conditionType === _e.NonFungible && t.push($n(e.assetName)), t.push(e.conditionCode), e.conditionType === _e.STX || e.conditionType === _e.Fungible || e.conditionType === _e.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ds("The post-condition amount may not be larger than 8 bytes");
    t.push(Pr(e.amount, 8));
  }
  return Re(t);
}
function rS(e) {
  const t = It(e, Me) ? e : new Me(e), n = t.readUInt8Enum(_e, (l) => {
    throw new gt(`Could not read ${l} as PostConditionType`);
  }), r = eS(t);
  let s, i, o;
  switch (n) {
    case _e.STX:
      return s = t.readUInt8Enum(Ui, (u) => {
        throw new gt(`Could not read ${u} as FungibleConditionCode`);
      }), o = BigInt(`0x${ee(t.readBytes(8))}`), {
        type: K.PostCondition,
        conditionType: _e.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case _e.Fungible:
      return i = $l(t), s = t.readUInt8Enum(Ui, (u) => {
        throw new gt(`Could not read ${u} as FungibleConditionCode`);
      }), o = BigInt(`0x${ee(t.readBytes(8))}`), {
        type: K.PostCondition,
        conditionType: _e.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case _e.NonFungible:
      i = $l(t);
      const l = En(t);
      return s = t.readUInt8Enum(ml, (u) => {
        throw new gt(`Could not read ${u} as FungibleConditionCode`);
      }), {
        type: K.PostCondition,
        conditionType: _e.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: l
      };
    case _e.Staking:
      return s = t.readUInt8Enum(Ui, (u) => {
        throw new gt(`Could not read ${u} as FungibleConditionCode`);
      }), o = BigInt(`0x${ee(t.readBytes(8))}`), {
        type: K.PostCondition,
        conditionType: _e.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case _e.PoX: {
      const u = t.readUInt8Enum(Sl, (h) => {
        throw new gt(`Could not read ${h} as PoxConditionCode`);
      });
      return {
        type: K.PostCondition,
        conditionType: _e.PoX,
        principal: r,
        conditionCode: u
      };
    }
  }
}
function W1(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Se.TokenTransfer:
      t.push($n(e.recipient)), t.push(Pr(e.amount, 8)), t.push(Fn(e.memo));
      break;
    case Se.ContractCall:
      t.push(Fn(e.contractAddress)), t.push(Fn(e.contractName)), t.push(Fn(e.functionName));
      const n = new Uint8Array(4);
      os(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push($n(r));
      });
      break;
    case Se.SmartContract:
      t.push(Fn(e.contractName)), t.push(Fn(e.codeBody));
      break;
    case Se.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Fn(e.contractName)), t.push(Fn(e.codeBody));
      break;
    case Se.PoisonMicroblock:
      break;
    case Se.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Se.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push($n(e.recipient));
      break;
    case Se.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push($n(e.recipient ? j1(e.recipient) : F1())), t.push(e.vrfProof);
      break;
    case Se.TenureChange:
      t.push(we(e.tenureHash)), t.push(we(e.previousTenureHash)), t.push(we(e.burnViewHash)), t.push(we(e.previousTenureEnd)), t.push(os(new Uint8Array(4), e.previousTenureBlocks)), t.push(v2(new Uint8Array(1), e.cause)), t.push(we(e.publicKeyHash));
      break;
  }
  return Re(t);
}
function sS(e) {
  const t = It(e, Me) ? e : new Me(e);
  switch (t.readUInt8Enum(Se, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Se.TokenTransfer:
      const r = En(t), s = lt(t.readBytes(8)), i = R1(t);
      return Gm(r, s, i);
    case Se.ContractCall:
      const o = Qs(t), l = Kt(t), u = Kt(t), h = [], d = t.readUInt32BE();
      for (let H = 0; H < d; H++) {
        const B = En(t);
        h.push(B);
      }
      return Km(o, l, u, h);
    case Se.SmartContract:
      const f = Kt(t), x = Kt(t, 4, 1e5);
      return Cf(f, x);
    case Se.VersionedSmartContract: {
      const H = t.readUInt8Enum(wl, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = Kt(t), j = Kt(t, 4, Vw);
      return Cf(B, j, H);
    }
    case Se.PoisonMicroblock:
      return Ym();
    case Se.Coinbase: {
      const H = t.readBytes(rs);
      return Lf(H);
    }
    case Se.CoinbaseToAltRecipient: {
      const H = t.readBytes(rs), B = En(t);
      return Lf(H, B);
    }
    case Se.NakamotoCoinbase: {
      const H = t.readBytes(rs), B = En(t), j = t.readBytes(xl);
      return qm(H, B, j);
    }
    case Se.TenureChange:
      const p = ee(t.readBytes(20)), A = ee(t.readBytes(20)), S = ee(t.readBytes(20)), L = ee(t.readBytes(32)), k = t.readUInt32BE(), U = t.readUInt8Enum(Al, (H) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${H}`);
      }), m = ee(t.readBytes(20));
      return Xm(p, A, S, L, k, U, m);
  }
}
function Cl(e) {
  const t = It(e, Me) ? e : new Me(e);
  return Il(ee(t.readBytes(Wa)));
}
function iS(e) {
  const t = It(e, Me) ? e : new Me(e), n = t.readUInt8Enum(on, (r) => {
    throw new gt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case on.PublicKeyCompressed:
      return ks(De.Compressed, Bl(t));
    case on.PublicKeyUncompressed:
      return ks(De.Uncompressed, ci(jS(Bl(t).data)));
    case on.SignatureCompressed:
      return ks(De.Compressed, Cl(t));
    case on.SignatureUncompressed:
      return ks(De.Uncompressed, Cl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function T0(e) {
  return we(e.data);
}
function oS(e) {
  const t = [];
  switch (e.contents.type) {
    case K.PublicKey:
      t.push(e.pubKeyEncoding === De.Compressed ? on.PublicKeyCompressed : on.PublicKeyUncompressed), t.push(we(FS(e.contents.data)));
      break;
    case K.MessageSignature:
      t.push(e.pubKeyEncoding === De.Compressed ? on.SignatureCompressed : on.SignatureUncompressed), t.push(T0(e.contents));
      break;
  }
  return Re(t);
}
function Ll(e) {
  return e.data.slice();
}
function Bl(e) {
  const t = It(e, Me) ? e : new Me(e), n = t.readUInt8(), r = n === 4 ? Pw : Uw;
  return ci(Re([n, t.readBytes(r)]));
}
function N0(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Le.P2PKH || t === Le.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Le.P2WPKH || t === Le.P2WSH || t === Le.P2WSHNonSequential) && !r.map((s) => s.data).every(li))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Le.P2PKH:
      return Vo(e, MS(r[0].data));
    case Le.P2WPKH:
      return Vo(e, _S(r[0].data));
    case Le.P2SH:
    case Le.P2SHNonSequential:
      return Vo(e, TS(n, r.map(Ll)));
    case Le.P2WSH:
    case Le.P2WSHNonSequential:
      return Vo(e, NS(n, r.map(Ll)));
  }
}
function Vo(e, t) {
  return { type: K.Address, version: e, hash160: t };
}
function U0(e) {
  return Es.c32address(e.version, e.hash160);
}
function Bf(e) {
  const [t, n, r] = e.split(/\.|::/);
  return Zm(t, n, r);
}
function $i(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return Qm(t, n);
  } else
    return Jm(e);
}
function aS(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return uS(t, n);
  } else
    return cS(e);
}
function cS(e) {
  const t = Fr(e);
  return { type: ye.PrincipalStandard, value: U0(t) };
}
function lS(e) {
  return { type: ye.PrincipalStandard, value: U0(e) };
}
function uS(e, t) {
  const n = Fr(e), r = hn(t);
  return Y1(n, r);
}
function Y1(e, t) {
  if (Ss(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ye.PrincipalContract,
    value: `${U0(e)}.${t.content}`
  };
}
function fS(e) {
  return { type: ye.ResponseErr, value: e };
}
function hS(e) {
  return { type: ye.ResponseOk, value: e };
}
const dS = (e) => ({ type: ye.StringASCII, value: e }), gS = (e) => ({ type: ye.StringUTF8, value: e });
function pS(e) {
  for (const t in e)
    if (!US(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ye.Tuple, value: e };
}
function En(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Me(we(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Me(e) : t = e;
  switch (t.readUInt8Enum(qe, (r) => {
    throw new gt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case qe.int:
      return jm(sl(t.readBytes(16)));
    case qe.uint:
      return zm(t.readBytes(16));
    case qe.buffer:
      const r = t.readUInt32BE();
      return Om(t.readBytes(r));
    case qe.true:
      return Dm();
    case qe.false:
      return km();
    case qe.address:
      const s = Qs(t);
      return lS(s);
    case qe.contract:
      const i = Qs(t), o = Kt(t);
      return Y1(i, o);
    case qe.ok:
      return hS(En(t));
    case qe.err:
      return fS(En(t));
    case qe.none:
      return F1();
    case qe.some:
      return j1(En(t));
    case qe.list:
      const l = t.readUInt32BE(), u = [];
      for (let S = 0; S < l; S++)
        u.push(En(t));
      return Rm(u);
    case qe.tuple:
      const h = t.readUInt32BE(), d = {};
      for (let S = 0; S < h; S++) {
        const L = Kt(t).content;
        if (L === void 0)
          throw new gt('"content" is undefined');
        d[L] = En(t);
      }
      return pS(d);
    case qe.ascii:
      const f = t.readUInt32BE(), x = p2(t.readBytes(f));
      return dS(x);
    case qe.utf8:
      const p = t.readUInt32BE(), A = Xi(t.readBytes(p));
      return gS(A);
    default:
      throw new gt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Tn(e, t) {
  return Re([H0(e), t]);
}
function bS(e) {
  return new Uint8Array([H0(e.type)]);
}
function yS(e) {
  return e.type === ye.OptionalNone ? new Uint8Array([H0(e.type)]) : Tn(e.type, $n(e.value));
}
function xS(e) {
  const t = new Uint8Array(4);
  return os(t, Math.ceil(e.value.length / 2), 0), Tn(e.type, Bn(t, we(e.value)));
}
function wS(e) {
  const t = o0(u2(BigInt(e.value), BigInt(Nw)), M1);
  return Tn(e.type, t);
}
function mS(e) {
  const t = o0(BigInt(e.value), M1);
  return Tn(e.type, t);
}
function SS(e) {
  return Tn(e.type, eo(Fr(e.value)));
}
function AS(e) {
  const [t, n] = PS(e.value);
  return Tn(e.type, Bn(eo(Fr(t)), Js(hn(n))));
}
function vS(e) {
  return Tn(e.type, $n(e.value));
}
function ES(e) {
  const t = [], n = new Uint8Array(4);
  os(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = $n(r);
    t.push(s);
  }
  return Tn(e.type, Re(t));
}
function IS(e) {
  const t = [], n = new Uint8Array(4);
  os(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = hn(s);
    t.push(Js(i));
    const o = $n(e.value[s]);
    t.push(o);
  }
  return Tn(e.type, Re(t));
}
function q1(e, t) {
  const n = [], r = t == "ascii" ? g2(e.value) : Ss(e.value), s = new Uint8Array(4);
  return os(s, r.length, 0), n.push(s), n.push(r), Tn(e.type, Re(n));
}
function $S(e) {
  return q1(e, "ascii");
}
function CS(e) {
  return q1(e, "utf8");
}
function LS(e) {
  return ee($n(e));
}
function $n(e) {
  switch (e.type) {
    case ye.BoolTrue:
    case ye.BoolFalse:
      return bS(e);
    case ye.OptionalNone:
    case ye.OptionalSome:
      return yS(e);
    case ye.Buffer:
      return xS(e);
    case ye.UInt:
      return mS(e);
    case ye.Int:
      return wS(e);
    case ye.PrincipalStandard:
      return SS(e);
    case ye.PrincipalContract:
      return AS(e);
    case ye.ResponseOk:
    case ye.ResponseErr:
      return vS(e);
    case ye.List:
      return ES(e);
    case ye.Tuple:
      return IS(e);
    case ye.StringASCII:
      return $S(e);
    case ye.StringUTF8:
      return CS(e);
    default:
      throw new Ds("Unable to serialize. Invalid Clarity Value.");
  }
}
const BS = (e) => e.length % 2 ? `0${e}` : e, HS = (e, t) => e.padEnd(t, "0"), X1 = (e, t) => e ? Ss(e).length > t : !1;
function Hl(e) {
  return $1(e);
}
const Fi = (e) => lm(C0(e)), P0 = (e) => ee(Pm(e)), MS = (e) => ee(Fi(e)), _S = (e) => {
  const t = Fi(e), n = Bn(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Fi(n);
  return ee(r);
}, TS = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Re(n), s = Fi(r);
  return ee(s);
}, NS = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((u) => {
    n.push(u.length), n.push(u);
  }), n.push(80 + t.length), n.push(174);
  const r = Re(n), s = C0(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Re(i), l = Fi(o);
  return ee(l);
};
function US(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function PS(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
ze.hmacSha256Sync = (e, ...t) => {
  const n = U1.create(C0, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ci(e) {
  return e = typeof e == "string" ? we(e) : e, {
    type: K.PublicKey,
    data: e
  };
}
function DS(e, t, n = De.Compressed) {
  const r = w2(t), s = new Tt(Hu(r.r), Hu(r.s)), i = pe.fromSignature(e, s, r.recoveryId), o = n === De.Compressed;
  return i.toHex(o);
}
function kS(e) {
  return typeof e == "string" ? e : ee(e);
}
const D0 = kS;
function Z1(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === x2;
}
function li(e) {
  return !D0(e).startsWith("04");
}
function OS(e) {
  e = a0(e);
  const t = Z1(e);
  return ee(Zi(e.slice(0, 32), t));
}
function FS(e) {
  return pe.fromHex(D0(e)).toHex(!0);
}
function jS(e) {
  return pe.fromHex(D0(e)).toHex(!1);
}
function zS(e, t) {
  e = a0(e);
  const [n, r] = Da(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return qi(r, 1) + Tt.fromHex(n).toCompactHex();
}
function k0() {
  return {
    type: K.MessageSignature,
    data: ee(new Uint8Array(Wa))
  };
}
function Q1(e, t, n, r) {
  const s = N0(0, e, 1, [ci(t)]).hash160, i = li(t) ? De.Compressed : De.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: lt(n),
    fee: lt(r),
    keyEncoding: i,
    signature: k0()
  };
}
function ji(e) {
  return "signature" in e;
}
function Hf(e) {
  return e === Le.P2SH || e === Le.P2WSH;
}
function RS(e) {
  return e === Le.P2SHNonSequential || e === Le.P2WSHNonSequential;
}
function Mf(e) {
  const t = Hl(e);
  return t.nonce = 0, t.fee = 0, ji(t) ? t.signature = k0() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function VS(e) {
  const t = [
    e.hashMode,
    we(e.signer),
    Pr(e.nonce, 8),
    Pr(e.fee, 8),
    e.keyEncoding,
    T0(e.signature)
  ];
  return Re(t);
}
function GS(e) {
  const t = [
    e.hashMode,
    we(e.signer),
    Pr(e.nonce, 8),
    Pr(e.fee, 8)
  ], n = M0(e.fields);
  t.push(_0(n));
  const r = new Uint8Array(2);
  return S2(r, e.signaturesRequired, 0), t.push(r), Re(t);
}
function KS(e, t) {
  const n = ee(t.readBytes(20)), r = BigInt(`0x${ee(t.readBytes(8))}`), s = BigInt(`0x${ee(t.readBytes(8))}`), i = t.readUInt8Enum(De, (l) => {
    throw new gt(`Could not parse ${l} as PubKeyEncoding`);
  });
  if (e === Le.P2WPKH && i != De.Compressed)
    throw new gt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Cl(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function WS(e, t) {
  const n = ee(t.readBytes(20)), r = BigInt("0x" + ee(t.readBytes(8))), s = BigInt("0x" + ee(t.readBytes(8))), i = G1(t, K.TransactionAuthField).values;
  let o = !1, l = 0;
  for (const h of i)
    switch (h.contents.type) {
      case K.PublicKey:
        li(h.contents.data) || (o = !0);
        break;
      case K.MessageSignature:
        if (h.pubKeyEncoding === De.Uncompressed && (o = !0), l += 1, l === 65536)
          throw new Qr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const u = t.readUInt16BE();
  if (o && (e === Le.P2WSH || e === Le.P2WSHNonSequential))
    throw new Qr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: u
  };
}
function Rc(e) {
  return ji(e) ? VS(e) : GS(e);
}
function Vc(e) {
  const t = e.readUInt8Enum(Le, (n) => {
    throw new gt(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Le.P2PKH || t === Le.P2WPKH ? KS(t, e) : WS(t, e);
}
function J1(e, t, n, r) {
  const i = e + ee(new Uint8Array([t])) + ee(Pr(n, 8)) + ee(Pr(r, 8));
  if (we(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return P0(we(i));
}
function eg(e, t, n) {
  const r = 33 + Wa, s = li(t.data) ? De.Compressed : De.Uncompressed, i = e + BS(s.toString(16)) + n, o = we(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return P0(o);
}
function YS(e, t, n, r, s) {
  const i = J1(e, t, n, r), o = zS(s, i), l = ci(OS(s)), u = eg(i, l, o);
  return {
    nextSig: o,
    nextSigHash: u
  };
}
function tg(e, t, n, r, s, i) {
  const o = J1(e, t, n, r), l = ci(DS(o, i, s)), u = eg(o, l, i);
  return {
    pubKey: l,
    nextSigHash: u
  };
}
function qS() {
  const e = Q1(Le.P2PKH, "", 0, 0);
  return e.signer = Vm().hash160, e.keyEncoding = De.Compressed, e.signature = k0(), e;
}
function _f(e, t, n) {
  return ji(e) ? XS(e, t, n) : ZS(e, t, n);
}
function XS(e, t, n) {
  const { pubKey: r, nextSigHash: s } = tg(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), i = N0(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new Qr(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function ZS(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const u of e.fields)
    switch (u.contents.type) {
      case K.PublicKey:
        li(u.contents.data) || (i = !0), r.push(u.contents);
        break;
      case K.MessageSignature:
        u.pubKeyEncoding === De.Uncompressed && (i = !0);
        const { pubKey: h, nextSigHash: d } = tg(s, n, e.fee, e.nonce, u.pubKeyEncoding, u.contents.data);
        if (Hf(e.hashMode) && (s = d), r.push(h), o += 1, o === 65536)
          throw new Qr("Too many signatures");
        break;
    }
  if (Hf(e.hashMode) && o !== e.signaturesRequired || RS(e.hashMode) && o < e.signaturesRequired)
    throw new Qr("Incorrect number of signatures");
  if (i && (e.hashMode === Le.P2WSH || e.hashMode === Le.P2WSHNonSequential))
    throw new Qr("Uncompressed keys are not allowed in this hash mode");
  const l = N0(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (l !== e.signer)
    throw new Qr(`Signer hash does not equal hash of public key(s): ${l} != ${e.signer}`);
  return s;
}
function ng(e) {
  return {
    authType: Fe.Standard,
    spendingCondition: e
  };
}
function rg(e, t) {
  return {
    authType: Fe.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Q1(Le.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Tf(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Fe.Standard:
        return ng(Mf(e.spendingCondition));
      case Fe.Sponsored:
        return rg(Mf(e.spendingCondition), qS());
      default:
        throw new Sa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function QS(e, t) {
  switch (e.authType) {
    case Fe.Standard:
      return _f(e.spendingCondition, t, Fe.Standard);
    case Fe.Sponsored:
      return _f(e.spendingCondition, t, Fe.Standard);
    default:
      throw new Sa("Invalid origin auth type");
  }
}
function JS(e, t) {
  switch (e.authType) {
    case Fe.Standard:
      const n = {
        ...e.spendingCondition,
        fee: lt(t)
      };
      return { ...e, spendingCondition: n };
    case Fe.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: lt(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function e3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: lt(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function t3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: lt(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function n3(e, t) {
  const n = {
    ...t,
    nonce: lt(t.nonce),
    fee: lt(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function r3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Fe.Standard:
      t.push(Rc(e.spendingCondition));
      break;
    case Fe.Sponsored:
      t.push(Rc(e.spendingCondition)), t.push(Rc(e.sponsorSpendingCondition));
      break;
  }
  return Re(t);
}
function s3(e) {
  const t = e.readUInt8Enum(Fe, (r) => {
    throw new gt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Fe.Standard:
      return n = Vc(e), ng(n);
    case Fe.Sponsored:
      n = Vc(e);
      const r = Vc(e);
      return rg(n, r);
  }
}
class i3 {
  constructor({ auth: t, payload: n, postConditions: r = M0([]), postConditionMode: s = ma.Deny, transactionVersion: i, chainId: o, network: l = "mainnet" }) {
    l = Mw(l), this.transactionVersion = i ?? l.transactionVersion, this.chainId = o ?? l.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: lt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Bt.Any;
  }
  signBegin() {
    const t = Hl(this);
    return t.auth = Tf(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Hl(this);
    return t.auth = Tf(t.auth), t.txid();
  }
  verifyOrigin() {
    return QS(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Fe.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Fe.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Fe.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : ci(t), r = this.auth.spendingCondition;
    if (r && !ji(r)) {
      const s = li(n.data);
      r.fields.push(ks(s ? De.Compressed : De.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = YS(n, r, t.fee, t.nonce, s);
    if (ji(t))
      t.signature = Il(i);
    else {
      const l = Z1(s);
      t.fields.push(ks(l ? De.Compressed : De.Uncompressed, Il(i)));
    }
    return o;
  }
  txid() {
    const t = this.serializeBytes();
    return P0(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Fe.Sponsored)
      throw new Sa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = n3(this.auth, t);
  }
  setFee(t) {
    this.auth = JS(this.auth, t);
  }
  setNonce(t) {
    this.auth = e3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Fe.Sponsored)
      throw new Sa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t3(this.auth, t);
  }
  serialize() {
    return ee(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ds('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ds('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ds('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ds('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return os(n, this.chainId, 0), t.push(n), t.push(r3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(_0(this.postConditions)), t.push(W1(this.payload)), Re(t);
  }
}
function o3(e) {
  const t = It(e, Me) ? e : new Me(e), n = t.readUInt8Enum(gs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = s3(t), i = t.readUInt8Enum(Bt, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = t.readUInt8Enum(ma, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), l = G1(t, K.PostCondition), u = sS(t), h = new i3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: u,
    postConditions: l,
    postConditionMode: o
  });
  return h.anchorMode = i, h;
}
const Nf = BigInt("18446744073709551615");
function Gc(e) {
  const t = lt(e);
  if (t < 0n || t > Nf)
    throw new RangeError(`Post-condition amount must be between 0 and ${Nf} (u64 max), received: ${t}`);
  return t;
}
var Ml;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Ml || (Ml = {}));
var _l;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(_l || (_l = {}));
function a3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: K.PostCondition,
        conditionType: _e.STX,
        principal: e.address === "origin" ? { type: K.Principal, prefix: yt.Origin } : $i(e.address),
        conditionCode: Go(e.condition),
        amount: Gc(e.amount)
      };
    case "ft-postcondition":
      return {
        type: K.PostCondition,
        conditionType: _e.Fungible,
        principal: e.address === "origin" ? { type: K.Principal, prefix: yt.Origin } : $i(e.address),
        conditionCode: Go(e.condition),
        amount: Gc(e.amount),
        asset: Bf(e.asset)
      };
    case "nft-postcondition":
      return {
        type: K.PostCondition,
        conditionType: _e.NonFungible,
        principal: e.address === "origin" ? { type: K.Principal, prefix: yt.Origin } : $i(e.address),
        conditionCode: Go(e.condition),
        asset: Bf(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: K.PostCondition,
        conditionType: _e.Staking,
        principal: e.address === "origin" ? { type: K.Principal, prefix: yt.Origin } : $i(e.address),
        conditionCode: Go(e.condition),
        amount: Gc(e.amount)
      };
    case "pox-postcondition":
      return {
        type: K.PostCondition,
        conditionType: _e.PoX,
        principal: e.address === "origin" ? { type: K.Principal, prefix: yt.Origin } : $i(e.address),
        conditionCode: c3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Go(e) {
  return Ml[e];
}
function c3(e) {
  return _l[e];
}
function sg(e) {
  const t = a3(e);
  return nS(t);
}
function l3(e, t, n) {
  return F0(ig(e), n);
}
function ig(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = zi(r);
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
    return BigInt(`0x${h3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function O0(e, t = 8) {
  return (typeof e == "bigint" ? e : ig(e)).toString(16).padStart(t * 2, "0");
}
function F0(e, t = 16) {
  const n = O0(e, t);
  return zi(n);
}
function u3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const f3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function h3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += f3[n];
  return t;
}
function zi(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = t.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function j0(e) {
  return new TextEncoder().encode(e);
}
function d3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function g3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Uf(e) {
  if (e.some(g3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function z0(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Jn(e) {
  return z0(...e.map((t) => typeof t == "number" ? Uf([t]) : t instanceof Array ? Uf(t) : t));
}
function Xa(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Tl;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Tl || (Tl = {}));
Tl.Mainnet;
const p3 = 128, b3 = 128, og = 16;
var Nl;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Nl || (Nl = {}));
var Pf;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Pf || (Pf = {}));
var Df;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Df || (Df = {}));
var sn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(sn || (sn = {}));
const Kc = ["onChainOnly", "offChainOnly", "any"];
Kc[0] + "", sn.OnChainOnly, Kc[1] + "", sn.OffChainOnly, Kc[2] + "", sn.Any, sn.OnChainOnly + "", sn.OnChainOnly, sn.OffChainOnly + "", sn.OffChainOnly, sn.Any + "", sn.Any;
var Ul;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ul || (Ul = {}));
Ul.Mainnet;
var kf;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(kf || (kf = {}));
var Yr;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Yr || (Yr = {}));
var Of;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Of || (Of = {}));
var Ff;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ff || (Ff = {}));
var jf;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(jf || (jf = {}));
var zf;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(zf || (zf = {}));
var Rf;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Rf || (Rf = {}));
var Vf;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Vf || (Vf = {}));
var Pl;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Pl || (Pl = {}));
var Gf;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Gf || (Gf = {}));
var Kf;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(Kf || (Kf = {}));
function Dl(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function y3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function ag(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function x3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dl(e.outputLen), Dl(e.blockLen);
}
function w3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function m3(e, t) {
  ag(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Wc = {
  number: Dl,
  bool: y3,
  bytes: ag,
  hash: x3,
  exists: w3,
  output: m3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yc = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Sn = (e, t) => e << 32 - t | e >>> t, S3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!S3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function A3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function cg(e) {
  if (typeof e == "string" && (e = A3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let v3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function $s(e) {
  const t = (r) => e().update(cg(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function E3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), l = Number(n & i), u = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + u, o, r), e.setUint32(t + h, l, r);
}
let R0 = class extends v3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Yc(this.buffer);
  }
  update(t) {
    Wc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = cg(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const l = Math.min(s - this.pos, i - o);
      if (l === s) {
        const u = Yc(t);
        for (; s <= i - o; o += s)
          this.process(u, o);
        continue;
      }
      r.set(t.subarray(o, o + l), this.pos), this.pos += l, o += l, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Wc.exists(this), Wc.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let f = o; f < s; f++)
      n[f] = 0;
    E3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = Yc(t), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = u / 4, d = this.get();
    if (h > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < h; f++)
      l.setUint32(4 * f, d[f], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: l } = this;
    return t.length = s, t.pos = l, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const I3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), lg = Uint8Array.from({ length: 16 }, (e, t) => t), $3 = lg.map((e) => (9 * e + 5) % 16);
let V0 = [lg], G0 = [$3];
for (let e = 0; e < 4; e++)
  for (let t of [V0, G0])
    t.push(t[e].map((n) => I3[n]));
const ug = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), C3 = V0.map((e, t) => e.map((n) => ug[t][n])), L3 = G0.map((e, t) => e.map((n) => ug[t][n])), B3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), H3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ko = (e, t) => e << t | e >>> 32 - t;
function Wf(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Wo = new Uint32Array(16);
let M3 = class extends R0 {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Wo[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, l = this.h2 | 0, u = l, h = this.h3 | 0, d = h, f = this.h4 | 0, x = f;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, S = B3[p], L = H3[p], k = V0[p], U = G0[p], m = C3[p], H = L3[p];
      for (let B = 0; B < 16; B++) {
        const j = Ko(r + Wf(p, i, l, h) + Wo[k[B]] + S, m[B]) + f | 0;
        r = f, f = h, h = Ko(l, 10) | 0, l = i, i = j;
      }
      for (let B = 0; B < 16; B++) {
        const j = Ko(s + Wf(A, o, u, d) + Wo[U[B]] + L, H[B]) + x | 0;
        s = x, x = d, d = Ko(u, 10) | 0, u = o, o = j;
      }
    }
    this.set(this.h1 + l + d | 0, this.h2 + h + x | 0, this.h3 + f + s | 0, this.h4 + r + o | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    Wo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
$s(() => new M3());
const _3 = (e, t, n) => e & t ^ ~e & n, T3 = (e, t, n) => e & t ^ e & n ^ t & n, N3 = new Uint32Array([
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
]), mr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Sr = new Uint32Array(64);
let fg = class extends R0 {
  constructor() {
    super(64, 32, 8, !1), this.A = mr[0] | 0, this.B = mr[1] | 0, this.C = mr[2] | 0, this.D = mr[3] | 0, this.E = mr[4] | 0, this.F = mr[5] | 0, this.G = mr[6] | 0, this.H = mr[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: l, H: u } = this;
    return [t, n, r, s, i, o, l, u];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = l | 0, this.H = u | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      Sr[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const x = Sr[f - 15], p = Sr[f - 2], A = Sn(x, 7) ^ Sn(x, 18) ^ x >>> 3, S = Sn(p, 17) ^ Sn(p, 19) ^ p >>> 10;
      Sr[f] = S + Sr[f - 7] + A + Sr[f - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: l, F: u, G: h, H: d } = this;
    for (let f = 0; f < 64; f++) {
      const x = Sn(l, 6) ^ Sn(l, 11) ^ Sn(l, 25), p = d + x + _3(l, u, h) + N3[f] + Sr[f] | 0, S = (Sn(r, 2) ^ Sn(r, 13) ^ Sn(r, 22)) + T3(r, s, i) | 0;
      d = h, h = u, u = l, l = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, l = l + this.E | 0, u = u + this.F | 0, h = h + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, l, u, h, d);
  }
  roundClean() {
    Sr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, U3 = class extends fg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
$s(() => new fg());
$s(() => new U3());
const Yo = BigInt(2 ** 32 - 1), kl = BigInt(32);
function hg(e, t = !1) {
  return t ? { h: Number(e & Yo), l: Number(e >> kl & Yo) } : { h: Number(e >> kl & Yo) | 0, l: Number(e & Yo) | 0 };
}
function P3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = hg(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const D3 = (e, t) => BigInt(e >>> 0) << kl | BigInt(t >>> 0), k3 = (e, t, n) => e >>> n, O3 = (e, t, n) => e << 32 - n | t >>> n, F3 = (e, t, n) => e >>> n | t << 32 - n, j3 = (e, t, n) => e << 32 - n | t >>> n, z3 = (e, t, n) => e << 64 - n | t >>> n - 32, R3 = (e, t, n) => e >>> n - 32 | t << 64 - n, V3 = (e, t) => t, G3 = (e, t) => e, K3 = (e, t, n) => e << n | t >>> 32 - n, W3 = (e, t, n) => t << n | e >>> 32 - n, Y3 = (e, t, n) => t << n - 32 | e >>> 64 - n, q3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function X3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Z3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Q3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, J3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), e4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, t4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), n4 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, he = {
  fromBig: hg,
  split: P3,
  toBig: D3,
  shrSH: k3,
  shrSL: O3,
  rotrSH: F3,
  rotrSL: j3,
  rotrBH: z3,
  rotrBL: R3,
  rotr32H: V3,
  rotr32L: G3,
  rotlSH: K3,
  rotlSL: W3,
  rotlBH: Y3,
  rotlBL: q3,
  add: X3,
  add3L: Z3,
  add3H: Q3,
  add4L: J3,
  add4H: e4,
  add5H: n4,
  add5L: t4
}, [r4, s4] = he.split([
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
].map((e) => BigInt(e))), Ar = new Uint32Array(80), vr = new Uint32Array(80);
let Za = class extends R0 {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: l, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: p, Gl: A, Hh: S, Hl: L } = this;
    return [t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = l | 0, this.Dl = u | 0, this.Eh = h | 0, this.El = d | 0, this.Fh = f | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = S | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let m = 0; m < 16; m++, n += 4)
      Ar[m] = t.getUint32(n), vr[m] = t.getUint32(n += 4);
    for (let m = 16; m < 80; m++) {
      const H = Ar[m - 15] | 0, B = vr[m - 15] | 0, j = he.rotrSH(H, B, 1) ^ he.rotrSH(H, B, 8) ^ he.shrSH(H, B, 7), Q = he.rotrSL(H, B, 1) ^ he.rotrSL(H, B, 8) ^ he.shrSL(H, B, 7), z = Ar[m - 2] | 0, F = vr[m - 2] | 0, E = he.rotrSH(z, F, 19) ^ he.rotrBH(z, F, 61) ^ he.shrSH(z, F, 6), M = he.rotrSL(z, F, 19) ^ he.rotrBL(z, F, 61) ^ he.shrSL(z, F, 6), R = he.add4L(Q, M, vr[m - 7], vr[m - 16]), N = he.add4H(R, j, E, Ar[m - 7], Ar[m - 16]);
      Ar[m] = N | 0, vr[m] = R | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: l, Cl: u, Dh: h, Dl: d, Eh: f, El: x, Fh: p, Fl: A, Gh: S, Gl: L, Hh: k, Hl: U } = this;
    for (let m = 0; m < 80; m++) {
      const H = he.rotrSH(f, x, 14) ^ he.rotrSH(f, x, 18) ^ he.rotrBH(f, x, 41), B = he.rotrSL(f, x, 14) ^ he.rotrSL(f, x, 18) ^ he.rotrBL(f, x, 41), j = f & p ^ ~f & S, Q = x & A ^ ~x & L, z = he.add5L(U, B, Q, s4[m], vr[m]), F = he.add5H(z, k, H, j, r4[m], Ar[m]), E = z | 0, M = he.rotrSH(r, s, 28) ^ he.rotrBH(r, s, 34) ^ he.rotrBH(r, s, 39), R = he.rotrSL(r, s, 28) ^ he.rotrBL(r, s, 34) ^ he.rotrBL(r, s, 39), N = r & i ^ r & l ^ i & l, te = s & o ^ s & u ^ o & u;
      k = S | 0, U = L | 0, S = p | 0, L = A | 0, p = f | 0, A = x | 0, { h: f, l: x } = he.add(h | 0, d | 0, F | 0, E | 0), h = l | 0, d = u | 0, l = i | 0, u = o | 0, i = r | 0, o = s | 0;
      const G = he.add3L(E, R, te);
      r = he.add3H(G, F, M, N), s = G | 0;
    }
    ({ h: r, l: s } = he.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = he.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: l, l: u } = he.add(this.Ch | 0, this.Cl | 0, l | 0, u | 0), { h, l: d } = he.add(this.Dh | 0, this.Dl | 0, h | 0, d | 0), { h: f, l: x } = he.add(this.Eh | 0, this.El | 0, f | 0, x | 0), { h: p, l: A } = he.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: S, l: L } = he.add(this.Gh | 0, this.Gl | 0, S | 0, L | 0), { h: k, l: U } = he.add(this.Hh | 0, this.Hl | 0, k | 0, U | 0), this.set(r, s, i, o, l, u, h, d, f, x, p, A, S, L, k, U);
  }
  roundClean() {
    Ar.fill(0), vr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, i4 = class extends Za {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, o4 = class extends Za {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, a4 = class extends Za {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
$s(() => new Za());
$s(() => new i4());
$s(() => new o4());
$s(() => new a4());
function c4(e, t, n) {
  const s = p3;
  if (E4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Nl.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var et;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(et || (et = {}));
let l4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, dg = class extends l4 {
  constructor(t) {
    super(t);
  }
};
function Qa(e) {
  const t = [];
  return t.push(zi(O0(e.version, 1))), t.push(zi(e.hash160)), Jn(t);
}
function u4(e) {
  const t = [];
  return t.push(e.prefix), t.push(Qa(e.address)), e.prefix === Pl.Contract && t.push(Ri(e.contractName)), Jn(t);
}
function Ri(e) {
  const t = [], n = j0(e.content), r = n.byteLength;
  return t.push(zi(O0(r, e.lengthPrefixBytes))), t.push(n), Jn(t);
}
function f4(e) {
  const t = [];
  return t.push(Qa(e.address)), t.push(Ri(e.contractName)), t.push(Ri(e.assetName)), Jn(t);
}
function gg(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(u4(e.principal)), (e.conditionType === Yr.Fungible || e.conditionType === Yr.NonFungible) && t.push(f4(e.assetInfo)), e.conditionType === Yr.NonFungible && t.push(ui(e.assetName)), t.push(e.conditionCode), e.conditionType === Yr.STX || e.conditionType === Yr.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new dg("The post-condition amount may not be larger than 8 bytes");
    t.push(l3(e.amount, !1, 8));
  }
  return Jn(t);
}
function Nn(e, t) {
  return Jn([e, t]);
}
function h4(e) {
  return new Uint8Array([e.type]);
}
function d4(e) {
  return e.type === et.OptionalNone ? new Uint8Array([e.type]) : Nn(e.type, ui(e.value));
}
function g4(e) {
  const t = new Uint8Array(4);
  return Xa(t, e.buffer.length, 0), Nn(e.type, z0(t, e.buffer));
}
function p4(e) {
  const t = F0(u3(e.value, BigInt(b3)), og);
  return Nn(e.type, t);
}
function b4(e) {
  const t = F0(e.value, og);
  return Nn(e.type, t);
}
function y4(e) {
  return Nn(e.type, Qa(e.address));
}
function x4(e) {
  return Nn(e.type, z0(Qa(e.address), Ri(e.contractName)));
}
function w4(e) {
  return Nn(e.type, ui(e.value));
}
function m4(e) {
  const t = [], n = new Uint8Array(4);
  Xa(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = ui(r);
    t.push(s);
  }
  return Nn(e.type, Jn(t));
}
function S4(e) {
  const t = [], n = new Uint8Array(4);
  Xa(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = c4(s);
    t.push(Ri(i));
    const o = ui(e.data[s]);
    t.push(o);
  }
  return Nn(e.type, Jn(t));
}
function pg(e, t) {
  const n = [], r = t == "ascii" ? d3(e.data) : j0(e.data), s = new Uint8Array(4);
  return Xa(s, r.length, 0), n.push(s), n.push(r), Nn(e.type, Jn(n));
}
function A4(e) {
  return pg(e, "ascii");
}
function v4(e) {
  return pg(e, "utf8");
}
function ui(e) {
  switch (e.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return h4(e);
    case et.OptionalNone:
    case et.OptionalSome:
      return d4(e);
    case et.Buffer:
      return g4(e);
    case et.UInt:
      return b4(e);
    case et.Int:
      return p4(e);
    case et.PrincipalStandard:
      return y4(e);
    case et.PrincipalContract:
      return x4(e);
    case et.ResponseOk:
    case et.ResponseErr:
      return w4(e);
    case et.List:
      return m4(e);
    case et.Tuple:
      return S4(e);
    case et.StringASCII:
      return A4(e);
    case et.StringUTF8:
      return v4(e);
    default:
      throw new dg("Unable to serialize. Invalid Clarity Value.");
  }
}
const E4 = (e, t) => e ? j0(e).length > t : !1, I4 = "connect-ui";
let ra, bg, Ht = !1, Ol = !1;
const Xn = (e, t = "") => () => {
}, $4 = (e, t) => () => {
}, C4 = "{visibility:hidden}.hydrated{visibility:inherit}", Yf = {}, L4 = "http://www.w3.org/2000/svg", B4 = "http://www.w3.org/1999/xhtml", H4 = (e) => e != null, K0 = (e) => (e = typeof e, e === "object" || e === "function");
function yg(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const oe = (e, t, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], l = (h) => {
    for (let d = 0; d < h.length; d++)
      r = h[d], Array.isArray(r) ? l(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !K0(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Fl(null, r) : r), i = s);
  };
  if (l(n), t) {
    const h = t.className || t.class;
    h && (t.class = typeof h != "object" ? h : Object.keys(h).filter((d) => h[d]).join(" "));
  }
  const u = Fl(e, null);
  return u.$attrs$ = t, o.length > 0 && (u.$children$ = o), u;
}, Fl = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, M4 = {}, _4 = (e) => e && e.$tag$ === M4, T4 = (e, t) => e != null && !K0(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, N4 = (e) => fi(e).$hostElement$, U4 = (e, t, n) => {
  const r = ct.ce(t, n);
  return e.dispatchEvent(r), r;
}, qf = /* @__PURE__ */ new WeakMap(), P4 = (e, t, n) => {
  let r = Aa.get(e);
  n5 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Aa.set(e, r);
}, D4 = (e, t, n, r) => {
  var s;
  let i = xg(t);
  const o = Aa.get(i);
  if (e = e.nodeType === 11 ? e : Cn, o)
    if (typeof o == "string") {
      e = e.head || e;
      let l = qf.get(e), u;
      if (l || qf.set(e, l = /* @__PURE__ */ new Set()), !l.has(i)) {
        {
          u = Cn.createElement("style"), u.innerHTML = o;
          const h = (s = ct.$nonce$) !== null && s !== void 0 ? s : yg(Cn);
          h != null && u.setAttribute("nonce", h), e.insertBefore(u, e.querySelector("link"));
        }
        l && l.add(i);
      }
    } else e.adoptedStyleSheets.includes(o) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, o]);
  return i;
}, k4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = Xn("attachStyles", t.$tagName$), i = D4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, xg = (e, t) => "sc-" + e.$tagName$, Xf = (e, t, n, r, s, i) => {
  if (n !== r) {
    let o = Qf(e, t), l = t.toLowerCase();
    if (t === "class") {
      const u = e.classList, h = Zf(n), d = Zf(r);
      u.remove(...h.filter((f) => f && !d.includes(f))), u.add(...d.filter((f) => f && !h.includes(f)));
    } else if (!o && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : Qf(Ja, l) ? t = l.slice(2) : t = l[2] + t.slice(3), n && ct.rel(e, t, n, !1), r && ct.ael(e, t, r, !1);
    else {
      const u = K0(r);
      if ((o || u && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const h = r ?? "";
            t === "list" ? o = !1 : (n == null || e[t] != h) && (e[t] = h);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!o || i & 4 || s) && !u && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, O4 = /\s/, Zf = (e) => e ? e.split(O4) : [], wg = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, i = e && e.$attrs$ || Yf, o = t.$attrs$ || Yf;
  for (r in i)
    r in o || Xf(s, r, i[r], void 0, n, t.$flags$);
  for (r in o)
    Xf(s, r, i[r], o[r], n, t.$flags$);
}, W0 = (e, t, n, r) => {
  const s = t.$children$[n];
  let i = 0, o, l;
  if (s.$text$ !== null)
    o = s.$elm$ = Cn.createTextNode(s.$text$);
  else {
    if (Ht || (Ht = s.$tag$ === "svg"), o = s.$elm$ = Cn.createElementNS(Ht ? L4 : B4, s.$tag$), Ht && s.$tag$ === "foreignObject" && (Ht = !1), wg(null, s, Ht), H4(ra) && o["s-si"] !== ra && o.classList.add(o["s-si"] = ra), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        l = W0(e, s, i), l && o.appendChild(l);
    s.$tag$ === "svg" ? Ht = !1 : o.tagName === "foreignObject" && (Ht = !0);
  }
  return o;
}, mg = (e, t, n, r, s, i) => {
  let o = e, l;
  for (o.shadowRoot && o.tagName === bg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (l = W0(null, n, s), l && (r[s].$elm$ = l, o.insertBefore(l, t)));
}, Sg = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, F4 = (e, t, n, r) => {
  let s = 0, i = 0, o = t.length - 1, l = t[0], u = t[o], h = r.length - 1, d = r[0], f = r[h], x;
  for (; s <= o && i <= h; )
    l == null ? l = t[++s] : u == null ? u = t[--o] : d == null ? d = r[++i] : f == null ? f = r[--h] : qo(l, d) ? (Hi(l, d), l = t[++s], d = r[++i]) : qo(u, f) ? (Hi(u, f), u = t[--o], f = r[--h]) : qo(l, f) ? (Hi(l, f), e.insertBefore(l.$elm$, u.$elm$.nextSibling), l = t[++s], f = r[--h]) : qo(u, d) ? (Hi(u, d), e.insertBefore(u.$elm$, l.$elm$), u = t[--o], d = r[++i]) : (x = W0(t && t[i], n, i), d = r[++i], x && l.$elm$.parentNode.insertBefore(x, l.$elm$));
  s > o ? mg(e, r[h + 1] == null ? null : r[h + 1].$elm$, n, r, i, h) : i > h && Sg(t, s, o);
}, qo = (e, t) => e.$tag$ === t.$tag$, Hi = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, i = t.$tag$, o = t.$text$;
  o === null ? (Ht = i === "svg" ? !0 : i === "foreignObject" ? !1 : Ht, wg(e, t, Ht), r !== null && s !== null ? F4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), mg(n, null, t, s, 0, s.length - 1)) : r !== null && Sg(r, 0, r.length - 1), Ht && i === "svg" && (Ht = !1)) : e.$text$ !== o && (n.data = o);
}, j4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Fl(null, null), s = _4(t) ? t : oe(null, null, t);
  bg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ra = n["s-sc"], Hi(r, s);
}, Ag = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Y0 = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Ag(e, e.$ancestorComponent$), s5(() => z4(e, t));
}, z4 = (e, t) => {
  const n = Xn("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), K4(s, () => R4(e, r, t));
}, R4 = async (e, t, n) => {
  const r = e.$hostElement$, s = Xn("update", e.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && k4(e);
  const o = Xn("render", e.$cmpMeta$.$tagName$);
  V4(e, t), i && (i.map((l) => l()), r["s-rc"] = void 0), o(), s();
  {
    const l = r["s-p"], u = () => G4(e);
    l.length === 0 ? u() : (Promise.all(l).then(u), e.$flags$ |= 4, l.length = 0);
  }
}, V4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, j4(e, t);
  } catch (r) {
    Vi(r, e.$hostElement$);
  }
  return null;
}, G4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Xn("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Eg(n), r(), e.$onReadyResolve$(n), s || vg()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && X0(() => Y0(e, !1)), e.$flags$ &= -517;
}, vg = (e) => {
  Eg(Cn.documentElement), X0(() => U4(Ja, "appload", { detail: { namespace: I4 } }));
}, K4 = (e, t) => e && e.then ? e.then(t) : t(), Eg = (e) => e.classList.add("hydrated"), W4 = (e, t) => fi(e).$instanceValues$.get(t), Y4 = (e, t, n, r) => {
  const s = fi(e), i = s.$instanceValues$.get(t), o = s.$flags$, l = s.$lazyInstance$;
  n = T4(n, r.$members$[t][0]);
  const u = Number.isNaN(i) && Number.isNaN(n), h = n !== i && !u;
  (!(o & 8) || i === void 0) && h && (s.$instanceValues$.set(t, n), l && (o & 18) === 2 && Y0(s, !1));
}, Ig = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return W4(this, i);
        },
        set(l) {
          Y4(this, i, l, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, l, u) {
        ct.jmp(() => {
          const h = i.get(o);
          if (this.hasOwnProperty(h))
            u = this[h], delete this[h];
          else if (s.hasOwnProperty(h) && typeof this[h] == "number" && this[h] == u)
            return;
          this[h] = u === null && typeof this[h] == "boolean" ? !1 : u;
        });
      }, e.observedAttributes = r.filter(
        ([o, l]) => l[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, l]) => {
        const u = l[1] || o;
        return i.set(u, o), u;
      });
    }
  }
  return e;
}, q4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = t5(n), s.then) {
        const u = $4();
        s = await s, u();
      }
      s.isProxied || (Ig(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const l = Xn("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (u) {
        Vi(u);
      }
      t.$flags$ &= -9, l();
    }
    if (s.style) {
      let l = s.style;
      const u = xg(n);
      if (!Aa.has(u)) {
        const h = Xn("registerStyles", n.$tagName$);
        P4(u, l, !!(n.$flags$ & 1)), h();
      }
    }
  }
  const i = t.$ancestorComponent$, o = () => Y0(t, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, X4 = (e) => {
  if (!(ct.$flags$ & 1)) {
    const t = fi(e), n = t.$cmpMeta$, r = Xn("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Ag(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && e.hasOwnProperty(s)) {
          const o = e[s];
          delete e[s], e[s] = o;
        }
      }), q4(e, t, n);
    }
    r();
  }
}, Z4 = (e) => {
  ct.$flags$ & 1 || fi(e);
}, Q4 = (e, t = {}) => {
  var n;
  const r = Xn(), s = [], i = t.exclude || [], o = Ja.customElements, l = Cn.head, u = /* @__PURE__ */ l.querySelector("meta[charset]"), h = /* @__PURE__ */ Cn.createElement("style"), d = [];
  let f, x = !0;
  Object.assign(ct, t), ct.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Cn.baseURI).href, e.map((p) => {
    p[1].map((A) => {
      const S = {
        $flags$: A[0],
        $tagName$: A[1],
        $members$: A[2],
        $listeners$: A[3]
      };
      S.$members$ = A[2];
      const L = S.$tagName$, k = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, e5(U, S), S.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          f && (clearTimeout(f), f = null), x ? d.push(this) : ct.jmp(() => X4(this));
        }
        disconnectedCallback() {
          ct.jmp(() => Z4(this));
        }
        componentOnReady() {
          return fi(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, Ig(
        k,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    h.innerHTML = s + C4, h.setAttribute("data-styles", "");
    const p = (n = ct.$nonce$) !== null && n !== void 0 ? n : yg(Cn);
    p != null && h.setAttribute("nonce", p), l.insertBefore(h, u ? u.nextSibling : l.firstChild);
  }
  x = !1, d.length ? d.map((p) => p.connectedCallback()) : ct.jmp(() => f = setTimeout(vg, 30)), r();
}, q0 = /* @__PURE__ */ new WeakMap(), fi = (e) => q0.get(e), J4 = (e, t) => q0.set(t.$lazyInstance$ = e, t), e5 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], q0.set(e, n);
}, Qf = (e, t) => t in e, Vi = (e, t) => (0, console.error)(e, t), qc = /* @__PURE__ */ new Map(), t5 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, i = qc.get(s);
  if (i)
    return i[r];
  {
    const o = (l) => (qc.set(s, l), l[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => Av).then(o, Vi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (qc.set(s, o), o[r]), Vi);
}, Aa = /* @__PURE__ */ new Map(), Ja = typeof window < "u" ? window : {}, Cn = Ja.document || { head: {} }, ct = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, $g = (e) => Promise.resolve(e), n5 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Jf = [], Cg = [], r5 = (e, t) => (n) => {
  e.push(n), Ol || (Ol = !0, ct.$flags$ & 4 ? X0(jl) : ct.raf(jl));
}, eh = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Vi(n);
    }
  e.length = 0;
}, jl = () => {
  eh(Jf), eh(Cg), (Ol = Jf.length > 0) && ct.raf(jl);
}, X0 = (e) => $g().then(e), s5 = /* @__PURE__ */ r5(Cg), i5 = () => $g(), Lg = (e, t) => typeof window > "u" ? Promise.resolve() : i5().then(() => Q4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var o5 = Object.defineProperty, a5 = Object.defineProperties, c5 = Object.getOwnPropertyDescriptors, va = Object.getOwnPropertySymbols, Bg = Object.prototype.hasOwnProperty, Hg = Object.prototype.propertyIsEnumerable, th = (e, t, n) => t in e ? o5(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Mn = (e, t) => {
  for (var n in t || (t = {})) Bg.call(t, n) && th(e, n, t[n]);
  if (va) for (var n of va(t)) Hg.call(t, n) && th(e, n, t[n]);
  return e;
}, Dr = (e, t) => a5(e, c5(t)), l5 = (e, t) => {
  var n = {};
  for (var r in e) Bg.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && va) for (var r of va(e)) t.indexOf(r) < 0 && Hg.call(e, r) && (n[r] = e[r]);
  return n;
};
function Z0() {
  return Ka(fn()) || window.StacksProvider || window.BlockstackProvider;
}
function Q0(e) {
  return e ? typeof e == "string" ? hs.fromName(e) : "version" in e ? e : "url" in e ? new pl({ url: e.url }) : e.transactionVersion === gs.Mainnet ? new pl({ url: e.client.baseUrl }) : new bl({ url: e.client.baseUrl }) : new bl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var u5 = (e) => {
  if (!e) {
    let t = new Ua(["store_write"], document.location.href);
    e = new Oi({ appConfig: t });
  }
  return e;
}, f5 = async (e, t = Z0()) => {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: l, appDetails: u } = e, h = u5(l);
  h.isUserSignedIn() && h.signUserOut();
  let d = h.generateAndStoreTransitKey(), f = h.makeAuthRequest(d, `${document.location.origin}${n}`, `${document.location.origin}${r}`, h.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: u, connectVersion: "__VERSION__" });
  try {
    let x = await t.authenticationRequest(f);
    await h.handlePendingSignIn(x);
    let p = ut.decodeToken(x), A = p == null ? void 0 : p.payload;
    s == null || s({ authResponse: x, authResponsePayload: A, userSession: h });
  } catch (x) {
    console.error("[Connect] Error during auth request", x), i == null || i();
  }
}, h5 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(h5 || {}), d5 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(d5 || {}), J0 = (e) => {
  let t = e;
  if (!t) {
    let n = new Ua(["store_write"], document.location.href);
    t = new Oi({ appConfig: n });
  }
  return t;
};
function g5(e) {
  try {
    return J0(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var p5 = (e) => {
  let t = J0(e).loadUserData().appPrivateKey, n = ut.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function b5(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let i = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, o = { [ds.Mainnet]: "mainnet", [ds.Testnet]: "testnet" }, l = Q0(s);
  return i == null ? void 0 : i[o[l.chainId]];
}
function y5(e) {
  let t = Q0(e.network), n = J0(e.userSession), r = Dr(Mn({}, e), { network: t, userSession: n });
  return Mn({ stxAddress: b5(r) }, r);
}
async function x5(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(sg) : n = n.map((r) => ee(gg(r)))), new ut.TokenSigner("ES256k", t).signAsync(Dr(Mn({}, e), { postConditions: n }));
}
function w5(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(sg) : t = t.map((n) => ee(gg(n)))), ut.createUnsecuredToken(Dr(Mn({}, e), { postConditions: t }));
}
var m5 = async ({ token: e, options: t }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(e), { txRaw: l } = o, u = we(l.replace(/^0x/, "")), h = o3(u);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Dr(Mn({}, o), { stacksTransaction: h }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Dr(Mn({}, o), { stacksTransaction: h }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = t.onCancel) == null || i.call(t);
  }
}, S5 = async (e) => {
  let t = e, { functionArgs: n, appDetails: r, userSession: s } = t, i = l5(t, ["functionArgs", "appDetails", "userSession"]), o = n.map((u) => typeof u == "string" ? u : typeof u.type == "string" ? LS(u) : ee(ui(u)));
  if (g5(s)) {
    let { privateKey: u, publicKey: h } = p5(s), d = Dr(Mn({}, i), { functionArgs: o, txType: "contract_call", publicKey: h });
    return r && (d.appDetails = r), x5(d, u);
  }
  let l = Dr(Mn({}, i), { functionArgs: o, txType: "contract_call" });
  return r && (l.appDetails = r), w5(l);
};
async function A5(e, t, n) {
  let r = await t(Dr(Mn(Mn({}, y5(e)), e), { network: Q0(e.network) }));
  return m5({ token: r, options: e }, n);
}
function v5(e, t = Z0()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return A5(e, S5, t);
}
var E5 = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(E5 || {}), Mg = "asigna-stx", nh = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === Mg && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage($5(e, t), "*");
}), I5 = { authenticationRequest: async (e) => nh(e, "authenticationRequest"), transactionRequest: async (e) => nh(e, "transactionRequest") }, $5 = (e, t) => ({ source: Mg, [t]: e }), C5 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = I5);
};
C5();
var _g = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Tg(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let i = fn(), o = Z0();
    if (i && o) return e(n, o);
    if (typeof window > "u") return;
    Lg();
    let l = (s = n == null ? void 0 : n.defaultProviders) != null ? s : _g, u = xw(l), h = document.createElement("connect-modal");
    h.defaultProviders = l, h.installedProviders = u, h.persistSelection = t;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let f = () => {
      h.remove(), document.body.style.overflow = d;
    };
    h.callback = (p) => {
      f(), e(n, p);
    }, h.cancelCallback = () => {
      var p;
      f(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(h);
    let x = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", x), h.remove());
    };
    document.addEventListener("keydown", x);
  };
}
var L5 = Tg(f5, !1), rh = Tg(v5), B5 = L1;
function kr(e, t, n) {
  return eu(st(e, t), n);
}
function st(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ne(r);
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
    if (t) {
      const r = _5(BigInt(`0x${be(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${be(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function sh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function to(e, t = 8) {
  return (typeof e == "bigint" ? e : st(e, !1)).toString(16).padStart(t * 2, "0");
}
function ec(e) {
  return parseInt(e, 16);
}
function eu(e, t = 16) {
  const n = to(e, t);
  return Ne(n);
}
function H5(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function M5(e, t) {
  return e & BigInt(1) << t;
}
function _5(e, t) {
  return M5(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const T5 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function be(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += T5[n];
  return t;
}
function Ne(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = t.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function hi(e) {
  return new TextEncoder().encode(e);
}
function tu(e) {
  return new TextDecoder().decode(e);
}
function Ng(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function N5(e) {
  return String.fromCharCode.apply(null, e);
}
function U5(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function ih(e) {
  if (e.some(U5))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function tc(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Ve(e) {
  return tc(...e.map((t) => typeof t == "number" ? ih([t]) : t instanceof Array ? ih(t) : t));
}
var oh;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(oh || (oh = {}));
var ah;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ah || (ah = {}));
var ch;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(ch || (ch = {}));
const Ug = 33, Xc = 32;
function P5(e) {
  if (e.length < Xc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Xc * 2), r = e.slice(2 + Xc * 2);
  return {
    recoveryId: ec(t),
    r: n,
    s: r
  };
}
function D5(e) {
  const t = typeof e == "string" ? Ne(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function k5(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function O5(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function F5(e, t) {
  return e[t];
}
function j5(e, t, n = 0) {
  return e[n] = t, e;
}
function z5(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function bs(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var zl;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(zl || (zl = {}));
const R5 = zl.Mainnet, V5 = 128, G5 = 128, Pg = 16, ss = 32, Rl = 80, nc = 65, K5 = 32, W5 = 64, Ea = 34;
var Z;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Z || (Z = {}));
var ge;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ge || (ge = {}));
var Vl;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Vl || (Vl = {}));
var Et;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Et || (Et = {}));
const sa = ["onChainOnly", "offChainOnly", "any"], lh = {
  [sa[0]]: Et.OnChainOnly,
  [sa[1]]: Et.OffChainOnly,
  [sa[2]]: Et.Any,
  [Et.OnChainOnly]: Et.OnChainOnly,
  [Et.OffChainOnly]: Et.OffChainOnly,
  [Et.Any]: Et.Any
};
function Y5(e) {
  if (e in lh)
    return lh[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${sa.join(", ")}`);
}
var Ia;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ia || (Ia = {}));
Ia.Mainnet;
var ei;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(ei || (ei = {}));
var rt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(rt || (rt = {}));
var je;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(je || (je = {}));
var Be;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Be || (Be = {}));
var Gl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Gl || (Gl = {}));
var ke;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(ke || (ke = {}));
var Vn;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Vn || (Vn = {}));
var Gi;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Gi || (Gi = {}));
var ys;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(ys || (ys = {}));
var uh;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(uh || (uh = {}));
var fh;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(fh || (fh = {}));
function Kl(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function q5(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Dg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function X5(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Kl(e.outputLen), Kl(e.blockLen);
}
function Z5(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Q5(e, t) {
  Dg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const es = {
  number: Kl,
  bool: q5,
  bytes: Dg,
  hash: X5,
  exists: Z5,
  output: Q5
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zc = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), An = (e, t) => e << 32 - t | e >>> t, J5 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!J5)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function e8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function nu(e) {
  if (typeof e == "string" && (e = e8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class kg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Cs(e) {
  const t = (r) => e().update(nu(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function t8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), l = Number(n & i), u = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + u, o, r), e.setUint32(t + h, l, r);
}
class ru extends kg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Zc(this.buffer);
  }
  update(t) {
    es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = nu(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const l = Math.min(s - this.pos, i - o);
      if (l === s) {
        const u = Zc(t);
        for (; s <= i - o; o += s)
          this.process(u, o);
        continue;
      }
      r.set(t.subarray(o, o + l), this.pos), this.pos += l, o += l, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    es.exists(this), es.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let f = o; f < s; f++)
      n[f] = 0;
    t8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const l = Zc(t), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = u / 4, d = this.get();
    if (h > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < h; f++)
      l.setUint32(4 * f, d[f], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: l } = this;
    return t.length = s, t.pos = l, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
}
const n8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Og = Uint8Array.from({ length: 16 }, (e, t) => t), r8 = Og.map((e) => (9 * e + 5) % 16);
let su = [Og], iu = [r8];
for (let e = 0; e < 4; e++)
  for (let t of [su, iu])
    t.push(t[e].map((n) => n8[n]));
const Fg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), s8 = su.map((e, t) => e.map((n) => Fg[t][n])), i8 = iu.map((e, t) => e.map((n) => Fg[t][n])), o8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), a8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xo = (e, t) => e << t | e >>> 32 - t;
function hh(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Zo = new Uint32Array(16);
class c8 extends ru {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Zo[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, l = this.h2 | 0, u = l, h = this.h3 | 0, d = h, f = this.h4 | 0, x = f;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, S = o8[p], L = a8[p], k = su[p], U = iu[p], m = s8[p], H = i8[p];
      for (let B = 0; B < 16; B++) {
        const j = Xo(r + hh(p, i, l, h) + Zo[k[B]] + S, m[B]) + f | 0;
        r = f, f = h, h = Xo(l, 10) | 0, l = i, i = j;
      }
      for (let B = 0; B < 16; B++) {
        const j = Xo(s + hh(A, o, u, d) + Zo[U[B]] + L, H[B]) + x | 0;
        s = x, x = d, d = Xo(u, 10) | 0, u = o, o = j;
      }
    }
    this.set(this.h1 + l + d | 0, this.h2 + h + x | 0, this.h3 + f + s | 0, this.h4 + r + o | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    Zo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const l8 = Cs(() => new c8()), u8 = (e, t, n) => e & t ^ ~e & n, f8 = (e, t, n) => e & t ^ e & n ^ t & n, h8 = new Uint32Array([
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
]), Er = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ir = new Uint32Array(64);
class jg extends ru {
  constructor() {
    super(64, 32, 8, !1), this.A = Er[0] | 0, this.B = Er[1] | 0, this.C = Er[2] | 0, this.D = Er[3] | 0, this.E = Er[4] | 0, this.F = Er[5] | 0, this.G = Er[6] | 0, this.H = Er[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: l, H: u } = this;
    return [t, n, r, s, i, o, l, u];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = l | 0, this.H = u | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      Ir[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const x = Ir[f - 15], p = Ir[f - 2], A = An(x, 7) ^ An(x, 18) ^ x >>> 3, S = An(p, 17) ^ An(p, 19) ^ p >>> 10;
      Ir[f] = S + Ir[f - 7] + A + Ir[f - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: l, F: u, G: h, H: d } = this;
    for (let f = 0; f < 64; f++) {
      const x = An(l, 6) ^ An(l, 11) ^ An(l, 25), p = d + x + u8(l, u, h) + h8[f] + Ir[f] | 0, S = (An(r, 2) ^ An(r, 13) ^ An(r, 22)) + f8(r, s, i) | 0;
      d = h, h = u, u = l, l = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, l = l + this.E | 0, u = u + this.F | 0, h = h + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, l, u, h, d);
  }
  roundClean() {
    Ir.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class d8 extends jg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ou = Cs(() => new jg());
Cs(() => new d8());
const Qo = BigInt(2 ** 32 - 1), Wl = BigInt(32);
function zg(e, t = !1) {
  return t ? { h: Number(e & Qo), l: Number(e >> Wl & Qo) } : { h: Number(e >> Wl & Qo) | 0, l: Number(e & Qo) | 0 };
}
function g8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = zg(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const p8 = (e, t) => BigInt(e >>> 0) << Wl | BigInt(t >>> 0), b8 = (e, t, n) => e >>> n, y8 = (e, t, n) => e << 32 - n | t >>> n, x8 = (e, t, n) => e >>> n | t << 32 - n, w8 = (e, t, n) => e << 32 - n | t >>> n, m8 = (e, t, n) => e << 64 - n | t >>> n - 32, S8 = (e, t, n) => e >>> n - 32 | t << 64 - n, A8 = (e, t) => t, v8 = (e, t) => e, E8 = (e, t, n) => e << n | t >>> 32 - n, I8 = (e, t, n) => t << n | e >>> 32 - n, $8 = (e, t, n) => t << n - 32 | e >>> 64 - n, C8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function L8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const B8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), H8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, M8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), _8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, T8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), N8 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, de = {
  fromBig: zg,
  split: g8,
  toBig: p8,
  shrSH: b8,
  shrSL: y8,
  rotrSH: x8,
  rotrSL: w8,
  rotrBH: m8,
  rotrBL: S8,
  rotr32H: A8,
  rotr32L: v8,
  rotlSH: E8,
  rotlSL: I8,
  rotlBH: $8,
  rotlBL: C8,
  add: L8,
  add3L: B8,
  add3H: H8,
  add4L: M8,
  add4H: _8,
  add5H: N8,
  add5L: T8
}, [U8, P8] = de.split([
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
].map((e) => BigInt(e))), $r = new Uint32Array(80), Cr = new Uint32Array(80);
class rc extends ru {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: l, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: p, Gl: A, Hh: S, Hl: L } = this;
    return [t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, l, u, h, d, f, x, p, A, S, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = l | 0, this.Dl = u | 0, this.Eh = h | 0, this.El = d | 0, this.Fh = f | 0, this.Fl = x | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = S | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let m = 0; m < 16; m++, n += 4)
      $r[m] = t.getUint32(n), Cr[m] = t.getUint32(n += 4);
    for (let m = 16; m < 80; m++) {
      const H = $r[m - 15] | 0, B = Cr[m - 15] | 0, j = de.rotrSH(H, B, 1) ^ de.rotrSH(H, B, 8) ^ de.shrSH(H, B, 7), Q = de.rotrSL(H, B, 1) ^ de.rotrSL(H, B, 8) ^ de.shrSL(H, B, 7), z = $r[m - 2] | 0, F = Cr[m - 2] | 0, E = de.rotrSH(z, F, 19) ^ de.rotrBH(z, F, 61) ^ de.shrSH(z, F, 6), M = de.rotrSL(z, F, 19) ^ de.rotrBL(z, F, 61) ^ de.shrSL(z, F, 6), R = de.add4L(Q, M, Cr[m - 7], Cr[m - 16]), N = de.add4H(R, j, E, $r[m - 7], $r[m - 16]);
      $r[m] = N | 0, Cr[m] = R | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: l, Cl: u, Dh: h, Dl: d, Eh: f, El: x, Fh: p, Fl: A, Gh: S, Gl: L, Hh: k, Hl: U } = this;
    for (let m = 0; m < 80; m++) {
      const H = de.rotrSH(f, x, 14) ^ de.rotrSH(f, x, 18) ^ de.rotrBH(f, x, 41), B = de.rotrSL(f, x, 14) ^ de.rotrSL(f, x, 18) ^ de.rotrBL(f, x, 41), j = f & p ^ ~f & S, Q = x & A ^ ~x & L, z = de.add5L(U, B, Q, P8[m], Cr[m]), F = de.add5H(z, k, H, j, U8[m], $r[m]), E = z | 0, M = de.rotrSH(r, s, 28) ^ de.rotrBH(r, s, 34) ^ de.rotrBH(r, s, 39), R = de.rotrSL(r, s, 28) ^ de.rotrBL(r, s, 34) ^ de.rotrBL(r, s, 39), N = r & i ^ r & l ^ i & l, te = s & o ^ s & u ^ o & u;
      k = S | 0, U = L | 0, S = p | 0, L = A | 0, p = f | 0, A = x | 0, { h: f, l: x } = de.add(h | 0, d | 0, F | 0, E | 0), h = l | 0, d = u | 0, l = i | 0, u = o | 0, i = r | 0, o = s | 0;
      const G = de.add3L(E, R, te);
      r = de.add3H(G, F, M, N), s = G | 0;
    }
    ({ h: r, l: s } = de.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = de.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: l, l: u } = de.add(this.Ch | 0, this.Cl | 0, l | 0, u | 0), { h, l: d } = de.add(this.Dh | 0, this.Dl | 0, h | 0, d | 0), { h: f, l: x } = de.add(this.Eh | 0, this.El | 0, f | 0, x | 0), { h: p, l: A } = de.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: S, l: L } = de.add(this.Gh | 0, this.Gl | 0, S | 0, L | 0), { h: k, l: U } = de.add(this.Hh | 0, this.Hl | 0, k | 0, U | 0), this.set(r, s, i, o, l, u, h, d, f, x, p, A, S, L, k, U);
  }
  roundClean() {
    $r.fill(0), Cr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class D8 extends rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class k8 extends rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class O8 extends rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Cs(() => new rc());
Cs(() => new D8());
const F8 = Cs(() => new k8());
Cs(() => new O8());
function Rg(e) {
  if (Ne(e).byteLength != nc)
    throw Error("Invalid signature");
  return {
    type: Z.MessageSignature,
    data: e
  };
}
function Mi(e, t) {
  return { type: Z.Address, version: e, hash160: t };
}
function Yl(e) {
  return Es.c32address(e.version, e.hash160);
}
function Vg(e) {
  const [t, n, r] = e.split(/\.|::/);
  return Ki(t, n, r);
}
function _n(e, t, n) {
  const r = t || 1, s = n || V5;
  if (cp(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Z.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ki(e, t, n) {
  return {
    type: Z.AssetInfo,
    address: Ls(e),
    contractName: _n(t),
    assetName: _n(n)
  };
}
function Ls(e) {
  const t = Es.c32addressDecode(e);
  return {
    type: Z.Address,
    version: t[0],
    hash160: t[1]
  };
}
function au(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return sc(t, n);
  } else
    return ic(e);
}
function sc(e, t) {
  const n = Ls(e), r = _n(t);
  return {
    type: Z.Principal,
    prefix: ys.Contract,
    address: n,
    contractName: r
  };
}
function ic(e) {
  const t = Ls(e);
  return {
    type: Z.Principal,
    prefix: ys.Standard,
    address: t
  };
}
var O;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(O || (O = {}));
function j8(e) {
  if (e.type === O.PrincipalStandard)
    return Yl(e.address);
  if (e.type === O.PrincipalContract)
    return `${Yl(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Gg(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return V8(t, n);
  } else
    return z8(e);
}
function z8(e) {
  const t = Ls(e);
  return { type: O.PrincipalStandard, address: t };
}
function R8(e) {
  return { type: O.PrincipalStandard, address: e };
}
function V8(e, t) {
  const n = Ls(e), r = _n(t);
  return Kg(n, r);
}
function Kg(e, t) {
  if (hi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: O.PrincipalContract, address: e, contractName: t };
}
function ia(e, t = !1) {
  switch (e.type) {
    case O.BoolTrue:
      return !0;
    case O.BoolFalse:
      return !1;
    case O.Int:
    case O.UInt:
      return t ? e.value.toString() : e.value;
    case O.Buffer:
      return `0x${be(e.buffer)}`;
    case O.OptionalNone:
      return null;
    case O.OptionalSome:
      return Ci(e.value);
    case O.ResponseErr:
      return Ci(e.value);
    case O.ResponseOk:
      return Ci(e.value);
    case O.PrincipalStandard:
    case O.PrincipalContract:
      return j8(e);
    case O.List:
      return e.list.map((r) => Ci(r));
    case O.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Ci(e.data[r]);
      }), n;
    case O.StringASCII:
      return e.data;
    case O.StringUTF8:
      return e.data;
  }
}
function Ci(e) {
  switch (e.type) {
    case O.ResponseErr:
      return { type: Hr(e), value: ia(e, !0), success: !1 };
    case O.ResponseOk:
      return { type: Hr(e), value: ia(e, !0), success: !0 };
    default:
      return { type: Hr(e), value: ia(e, !0) };
  }
}
function Hr(e) {
  switch (e.type) {
    case O.BoolTrue:
    case O.BoolFalse:
      return "bool";
    case O.Int:
      return "int";
    case O.UInt:
      return "uint";
    case O.Buffer:
      return `(buff ${e.buffer.length})`;
    case O.OptionalNone:
      return "(optional none)";
    case O.OptionalSome:
      return `(optional ${Hr(e.value)})`;
    case O.ResponseErr:
      return `(response UnknownType ${Hr(e.value)})`;
    case O.ResponseOk:
      return `(response ${Hr(e.value)} UnknownType)`;
    case O.PrincipalStandard:
    case O.PrincipalContract:
      return "principal";
    case O.List:
      return `(list ${e.list.length} ${e.list.length ? Hr(e.list[0]) : "UnknownType"})`;
    case O.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Hr(e.data[t])})`).join(" ")})`;
    case O.StringASCII:
      return `(string-ascii ${Ng(e.data).length})`;
    case O.StringUTF8:
      return `(string-utf8 ${hi(e.data).length})`;
  }
}
const G8 = () => ({ type: O.BoolTrue }), K8 = () => ({ type: O.BoolFalse }), dh = BigInt("0xffffffffffffffffffffffffffffffff"), W8 = BigInt(0), gh = BigInt("0x7fffffffffffffffffffffffffffffff"), ph = BigInt("-170141183460469231731687303715884105728"), Y8 = (e) => {
  const t = st(e, !0);
  if (t > gh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${gh}`);
  if (t < ph)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ph}`);
  return { type: O.Int, value: t };
}, Wg = (e) => {
  const t = st(e, !1);
  if (t < W8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > dh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${dh}`);
  return { type: O.UInt, value: t };
}, Yg = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: O.Buffer, buffer: e };
};
function qg() {
  return { type: O.OptionalNone };
}
function Xg(e) {
  return { type: O.OptionalSome, value: e };
}
function q8(e) {
  return { type: O.ResponseErr, value: e };
}
function X8(e) {
  return { type: O.ResponseOk, value: e };
}
function Z8(e) {
  return { type: O.List, list: e };
}
function Q8(e) {
  for (const t in e)
    if (!F6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: O.Tuple, data: e };
}
const Zg = (e) => ({ type: O.StringASCII, data: e }), J8 = (e) => ({ type: O.StringUTF8, data: e });
class Qg extends kg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, es.hash(t);
    const r = nu(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return es.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    es.exists(this), es.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: l } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = l, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Jg = (e, t, n) => new Qg(e, t).update(n).digest();
Jg.create = (e, t) => new Qg(e, t);
ze.hmacSha256Sync = (e, ...t) => {
  const n = Jg.create(ou, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ti(e) {
  return {
    type: Z.PublicKey,
    data: Ne(e)
  };
}
function e6(e, t, n = ke.Compressed) {
  const r = P5(t.data), s = new Tt(sh(r.r), sh(r.s)), i = pe.fromSignature(e, s, r.recoveryId), o = n === ke.Compressed;
  return i.toHex(o);
}
function t6(e) {
  return { type: Z.PublicKey, data: e };
}
function di(e) {
  return !be(e.data).startsWith("04");
}
function $a(e) {
  return e.data.slice();
}
function n6(e) {
  const t = i6(e), n = Zi(t.data.slice(0, 32), t.compressed);
  return ti(be(n));
}
function r6(e) {
  const t = typeof e == "string" ? e : be(e), n = pe.fromHex(t).toHex(!0);
  return ti(n);
}
function s6(e) {
  const t = typeof e == "string" ? e : be(e), n = pe.fromHex(t).toHex(!1);
  return ti(n);
}
function ql(e) {
  const t = e.readUInt8(), n = t === 4 ? W5 : K5;
  return t6(Ve([t, e.readBytes(n)]));
}
function i6(e) {
  const t = D5(e), n = t.length == Ug;
  return { data: t, compressed: n };
}
function o6(e, t) {
  const [n, r] = Da(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = to(r, 1) + Tt.fromHex(n).toCompactHex();
  return Rg(i);
}
function a6(e) {
  return n6(e.data);
}
function c6(e, t, n) {
  return typeof e == "string" && (e = Gg(e)), typeof n == "string" && (n = xh(n)), {
    type: Z.Payload,
    payloadType: ge.TokenTransfer,
    recipient: e,
    amount: st(t, !1),
    memo: n ?? xh("")
  };
}
function l6(e, t, n, r) {
  return typeof e == "string" && (e = Ls(e)), typeof t == "string" && (t = _n(t)), typeof n == "string" && (n = _n(n)), {
    type: Z.Payload,
    payloadType: ge.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function bh(e, t, n) {
  return typeof e == "string" && (e = _n(e)), typeof t == "string" && (t = x6(t)), typeof n == "number" ? {
    type: Z.Payload,
    payloadType: ge.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Z.Payload,
    payloadType: ge.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function u6() {
  return { type: Z.Payload, payloadType: ge.PoisonMicroblock };
}
function yh(e, t) {
  if (e.byteLength != ss)
    throw Error(`Coinbase buffer size must be ${ss} bytes`);
  return t != null ? {
    type: Z.Payload,
    payloadType: ge.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Z.Payload,
    payloadType: ge.Coinbase,
    coinbaseBytes: e
  };
}
function f6(e, t, n) {
  if (e.byteLength != ss)
    throw Error(`Coinbase buffer size must be ${ss} bytes`);
  if (n.byteLength != Rl)
    throw Error(`VRF proof buffer size must be ${Rl} bytes`);
  return {
    type: Z.Payload,
    payloadType: ge.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === O.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Xl;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Xl || (Xl = {}));
function h6(e, t, n, r, s, i, o) {
  return {
    type: Z.Payload,
    payloadType: ge.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ep(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case ge.TokenTransfer:
      t.push(un(e.recipient)), t.push(kr(e.amount, !1, 8)), t.push(jn(e.memo));
      break;
    case ge.ContractCall:
      t.push(jn(e.contractAddress)), t.push(jn(e.contractName)), t.push(jn(e.functionName));
      const n = new Uint8Array(4);
      bs(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(un(r));
      });
      break;
    case ge.SmartContract:
      t.push(jn(e.contractName)), t.push(jn(e.codeBody));
      break;
    case ge.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(jn(e.contractName)), t.push(jn(e.codeBody));
      break;
    case ge.PoisonMicroblock:
      break;
    case ge.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case ge.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(un(e.recipient));
      break;
    case ge.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(un(e.recipient ? Xg(e.recipient) : qg())), t.push(e.vrfProof);
      break;
    case ge.TenureChange:
      t.push(Ne(e.tenureHash)), t.push(Ne(e.previousTenureHash)), t.push(Ne(e.burnViewHash)), t.push(Ne(e.previousTenureEnd)), t.push(bs(new Uint8Array(4), e.previousTenureBlocks)), t.push(j5(new Uint8Array(1), e.cause)), t.push(Ne(e.publicKeyHash));
      break;
  }
  return Ve(t);
}
function d6(e) {
  switch (e.readUInt8Enum(ge, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case ge.TokenTransfer:
      const n = cn(e), r = st(e.readBytes(8), !1), s = np(e);
      return c6(n, r, s);
    case ge.ContractCall:
      const i = ni(e), o = Wt(e), l = Wt(e), u = [], h = e.readUInt32BE();
      for (let m = 0; m < h; m++) {
        const H = cn(e);
        u.push(H);
      }
      return l6(i, o, l, u);
    case ge.SmartContract:
      const d = Wt(e), f = Wt(e, 4, 1e5);
      return bh(d, f);
    case ge.VersionedSmartContract: {
      const m = e.readUInt8Enum(Vl, (j) => {
        throw new Error(`Cannot recognize ClarityVersion: ${j}`);
      }), H = Wt(e), B = Wt(e, 4, 1e5);
      return bh(H, B, m);
    }
    case ge.PoisonMicroblock:
      return u6();
    case ge.Coinbase: {
      const m = e.readBytes(ss);
      return yh(m);
    }
    case ge.CoinbaseToAltRecipient: {
      const m = e.readBytes(ss), H = cn(e);
      return yh(m, H);
    }
    case ge.NakamotoCoinbase: {
      const m = e.readBytes(ss), H = cn(e), B = e.readBytes(Rl);
      return f6(m, H, B);
    }
    case ge.TenureChange:
      const x = be(e.readBytes(20)), p = be(e.readBytes(20)), A = be(e.readBytes(20)), S = be(e.readBytes(32)), L = e.readUInt32BE(), k = e.readUInt8Enum(Xl, (m) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${m}`);
      }), U = be(e.readBytes(20));
      return h6(x, p, A, S, L, k, U);
  }
}
class oc extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class qr extends oc {
  constructor(t) {
    super(t);
  }
}
class _t extends oc {
  constructor(t) {
    super(t);
  }
}
class Ca extends oc {
  constructor(t) {
    super(t);
  }
}
class ts extends oc {
  constructor(t) {
    super(t);
  }
}
var an;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(an || (an = {}));
function Zl(e) {
  return Rg(be(e.readBytes(nc)));
}
function Os(e, t) {
  return {
    pubKeyEncoding: e,
    type: Z.TransactionAuthField,
    contents: t
  };
}
function g6(e) {
  const t = e.readUInt8Enum(an, (n) => {
    throw new _t(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case an.PublicKeyCompressed:
      return Os(ke.Compressed, ql(e));
    case an.PublicKeyUncompressed:
      return Os(ke.Uncompressed, s6(ql(e).data));
    case an.SignatureCompressed:
      return Os(ke.Compressed, Zl(e));
    case an.SignatureUncompressed:
      return Os(ke.Uncompressed, Zl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function cu(e) {
  return Ne(e.data);
}
function p6(e) {
  const t = [];
  switch (e.contents.type) {
    case Z.PublicKey:
      t.push(e.pubKeyEncoding === ke.Compressed ? an.PublicKeyCompressed : an.PublicKeyUncompressed), t.push($a(r6(e.contents.data)));
      break;
    case Z.MessageSignature:
      t.push(e.pubKeyEncoding === ke.Compressed ? an.SignatureCompressed : an.SignatureUncompressed), t.push(cu(e.contents));
      break;
  }
  return Ve(t);
}
function jn(e) {
  switch (e.type) {
    case Z.Address:
      return no(e);
    case Z.Principal:
      return tp(e);
    case Z.LengthPrefixedString:
      return ri(e);
    case Z.MemoString:
      return w6(e);
    case Z.AssetInfo:
      return rp(e);
    case Z.PostCondition:
      return ip(e);
    case Z.PublicKey:
      return $a(e);
    case Z.LengthPrefixedList:
      return fu(e);
    case Z.Payload:
      return ep(e);
    case Z.TransactionAuthField:
      return p6(e);
    case Z.MessageSignature:
      return cu(e);
  }
}
function b6() {
  return {
    type: Z.Address,
    version: Gl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function lu(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Be.SerializeP2PKH || t === Be.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Be.SerializeP2WPKH || t === Be.SerializeP2WSH || t === Be.SerializeP2WSHNonSequential) && !r.every(di))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Be.SerializeP2PKH:
      return Mi(e, P6(r[0].data));
    case Be.SerializeP2WPKH:
      return Mi(e, D6(r[0].data));
    case Be.SerializeP2SH:
    case Be.SerializeP2SHNonSequential:
      return Mi(e, k6(n, r.map($a)));
    case Be.SerializeP2WSH:
    case Be.SerializeP2WSHNonSequential:
      return Mi(e, O6(n, r.map($a)));
  }
}
function no(e) {
  const t = [];
  return t.push(Ne(to(e.version, 1))), t.push(Ne(e.hash160)), Ve(t);
}
function ni(e) {
  const t = ec(be(e.readBytes(1))), n = be(e.readBytes(20));
  return { type: Z.Address, version: t, hash160: n };
}
function tp(e) {
  const t = [];
  return t.push(e.prefix), t.push(no(e.address)), e.prefix === ys.Contract && t.push(ri(e.contractName)), Ve(t);
}
function y6(e) {
  const t = e.readUInt8Enum(ys, (s) => {
    throw new _t(`Unexpected Principal payload type: ${s}`);
  }), n = ni(e);
  if (t === ys.Standard)
    return { type: Z.Principal, prefix: t, address: n };
  const r = Wt(e);
  return {
    type: Z.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function ri(e) {
  const t = [], n = hi(e.content), r = n.byteLength;
  return t.push(Ne(to(r, e.lengthPrefixBytes))), t.push(n), Ve(t);
}
function Wt(e, t, n) {
  t = t || 1;
  const r = ec(be(e.readBytes(t))), s = tu(e.readBytes(r));
  return _n(s, t, n ?? 128);
}
function x6(e) {
  return _n(e, 4, 1e5);
}
function xh(e) {
  if (e && cp(e, Ea))
    throw new Error(`Memo exceeds maximum length of ${Ea} bytes`);
  return { type: Z.MemoString, content: e };
}
function w6(e) {
  const t = [], n = hi(e.content), r = U6(be(n), Ea * 2);
  return t.push(Ne(r)), Ve(t);
}
function np(e) {
  let t = tu(e.readBytes(Ea));
  return t = t.replace(/\u0000*$/, ""), { type: Z.MemoString, content: t };
}
function rp(e) {
  const t = [];
  return t.push(no(e.address)), t.push(ri(e.contractName)), t.push(ri(e.assetName)), Ve(t);
}
function Ql(e) {
  return {
    type: Z.AssetInfo,
    address: ni(e),
    contractName: Wt(e),
    assetName: Wt(e)
  };
}
function uu(e, t) {
  return {
    type: Z.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function fu(e) {
  const t = e.values, n = [];
  n.push(Ne(to(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(jn(r));
  return Ve(n);
}
function sp(e, t, n) {
  const r = ec(be(e.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (t) {
      case Z.Address:
        s.push(ni(e));
        break;
      case Z.LengthPrefixedString:
        s.push(Wt(e));
        break;
      case Z.MemoString:
        s.push(np(e));
        break;
      case Z.AssetInfo:
        s.push(Ql(e));
        break;
      case Z.PostCondition:
        s.push(m6(e));
        break;
      case Z.PublicKey:
        s.push(ql(e));
        break;
      case Z.TransactionAuthField:
        s.push(g6(e));
        break;
    }
  return uu(s, n);
}
function ip(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(tp(e.principal)), (e.conditionType === rt.Fungible || e.conditionType === rt.NonFungible) && t.push(rp(e.assetInfo)), e.conditionType === rt.NonFungible && t.push(un(e.assetName)), t.push(e.conditionCode), e.conditionType === rt.STX || e.conditionType === rt.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new qr("The post-condition amount may not be larger than 8 bytes");
    t.push(kr(e.amount, !1, 8));
  }
  return Ve(t);
}
function m6(e) {
  const t = e.readUInt8Enum(rt, (o) => {
    throw new _t(`Could not read ${o} as PostConditionType`);
  }), n = y6(e);
  let r, s, i;
  switch (t) {
    case rt.STX:
      return r = e.readUInt8Enum(Vn, (l) => {
        throw new _t(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${be(e.readBytes(8))}`), {
        type: Z.PostCondition,
        conditionType: rt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case rt.Fungible:
      return s = Ql(e), r = e.readUInt8Enum(Vn, (l) => {
        throw new _t(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${be(e.readBytes(8))}`), {
        type: Z.PostCondition,
        conditionType: rt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case rt.NonFungible:
      s = Ql(e);
      const o = cn(e);
      return r = e.readUInt8Enum(Gi, (l) => {
        throw new _t(`Could not read ${l} as FungibleConditionCode`);
      }), {
        type: Z.PostCondition,
        conditionType: rt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Un(e, t) {
  return Ve([e, t]);
}
function S6(e) {
  return new Uint8Array([e.type]);
}
function A6(e) {
  return e.type === O.OptionalNone ? new Uint8Array([e.type]) : Un(e.type, un(e.value));
}
function v6(e) {
  const t = new Uint8Array(4);
  return bs(t, e.buffer.length, 0), Un(e.type, tc(t, e.buffer));
}
function E6(e) {
  const t = eu(H5(e.value, BigInt(G5)), Pg);
  return Un(e.type, t);
}
function I6(e) {
  const t = eu(e.value, Pg);
  return Un(e.type, t);
}
function $6(e) {
  return Un(e.type, no(e.address));
}
function C6(e) {
  return Un(e.type, tc(no(e.address), ri(e.contractName)));
}
function L6(e) {
  return Un(e.type, un(e.value));
}
function B6(e) {
  const t = [], n = new Uint8Array(4);
  bs(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = un(r);
    t.push(s);
  }
  return Un(e.type, Ve(t));
}
function H6(e) {
  const t = [], n = new Uint8Array(4);
  bs(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = _n(s);
    t.push(ri(i));
    const o = un(e.data[s]);
    t.push(o);
  }
  return Un(e.type, Ve(t));
}
function op(e, t) {
  const n = [], r = t == "ascii" ? Ng(e.data) : hi(e.data), s = new Uint8Array(4);
  return bs(s, r.length, 0), n.push(s), n.push(r), Un(e.type, Ve(n));
}
function M6(e) {
  return op(e, "ascii");
}
function _6(e) {
  return op(e, "utf8");
}
function un(e) {
  switch (e.type) {
    case O.BoolTrue:
    case O.BoolFalse:
      return S6(e);
    case O.OptionalNone:
    case O.OptionalSome:
      return A6(e);
    case O.Buffer:
      return v6(e);
    case O.UInt:
      return I6(e);
    case O.Int:
      return E6(e);
    case O.PrincipalStandard:
      return $6(e);
    case O.PrincipalContract:
      return C6(e);
    case O.ResponseOk:
    case O.ResponseErr:
      return L6(e);
    case O.List:
      return B6(e);
    case O.Tuple:
      return H6(e);
    case O.StringASCII:
      return M6(e);
    case O.StringUTF8:
      return _6(e);
    default:
      throw new qr("Unable to serialize. Invalid Clarity Value.");
  }
}
function T6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const wh = /* @__PURE__ */ new Map();
function ap(e, t) {
  const n = wh.get(e);
  if (n !== void 0)
    return n(t);
  const r = T6(e);
  return wh.set(e, r), ap(e, t);
}
class Pi {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return z5(this.readBytes(4), 0);
  }
  readUInt8() {
    return F5(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return k5(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = be(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = be(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (ap(t, r))
      return r;
    throw n(r);
  }
}
function cn(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Pi(Ne(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Pi(e) : t = e;
  switch (t.readUInt8Enum(O, (r) => {
    throw new _t(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case O.Int:
      return Y8(t.readBytes(16));
    case O.UInt:
      return Wg(t.readBytes(16));
    case O.Buffer:
      const r = t.readUInt32BE();
      return Yg(t.readBytes(r));
    case O.BoolTrue:
      return G8();
    case O.BoolFalse:
      return K8();
    case O.PrincipalStandard:
      const s = ni(t);
      return R8(s);
    case O.PrincipalContract:
      const i = ni(t), o = Wt(t);
      return Kg(i, o);
    case O.ResponseOk:
      return X8(cn(t));
    case O.ResponseErr:
      return q8(cn(t));
    case O.OptionalNone:
      return qg();
    case O.OptionalSome:
      return Xg(cn(t));
    case O.List:
      const l = t.readUInt32BE(), u = [];
      for (let S = 0; S < l; S++)
        u.push(cn(t));
      return Z8(u);
    case O.Tuple:
      const h = t.readUInt32BE(), d = {};
      for (let S = 0; S < h; S++) {
        const L = Wt(t).content;
        if (L === void 0)
          throw new _t('"content" is undefined');
        d[L] = cn(t);
      }
      return Q8(d);
    case O.StringASCII:
      const f = t.readUInt32BE(), x = N5(t.readBytes(f));
      return Zg(x);
    case O.StringUTF8:
      const p = t.readUInt32BE(), A = tu(t.readBytes(p));
      return J8(A);
    default:
      throw new _t("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const N6 = (e) => e.length % 2 == 0 ? e : `0${e}`, U6 = (e, t) => e.padEnd(t, "0"), cp = (e, t) => e ? hi(e).length > t : !1;
function Jl(e) {
  return $1(e);
}
const Wi = (e) => l8(ou(e)), hu = (e) => be(F8(e)), P6 = (e) => be(Wi(e)), D6 = (e) => {
  const t = Wi(e), n = tc(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Wi(n);
  return be(r);
}, k6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Ve(n), s = Wi(r);
  return be(s);
}, O6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((u) => {
    n.push(u.length), n.push(u);
  }), n.push(80 + t.length), n.push(174);
  const r = Ve(n), s = ou(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ve(i), l = Wi(o);
  return be(l);
};
function F6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function j6(e) {
  const t = un(e);
  return `0x${be(t)}`;
}
function z6(e) {
  return cn(e);
}
const js = (e) => {
  try {
    return Es.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function du() {
  return {
    type: Z.MessageSignature,
    data: be(new Uint8Array(nc))
  };
}
function lp(e, t, n, r) {
  const s = lu(0, e, 1, [ti(t)]).hash160, i = di(ti(t)) ? ke.Compressed : ke.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: st(n, !1),
    fee: st(r, !1),
    keyEncoding: i,
    signature: du()
  };
}
function Yi(e) {
  return "signature" in e;
}
function mh(e) {
  return e === Be.SerializeP2SH || e === Be.SerializeP2WSH;
}
function R6(e) {
  return e === Be.SerializeP2SHNonSequential || e === Be.SerializeP2WSHNonSequential;
}
function Sh(e) {
  const t = Jl(e);
  return t.nonce = 0, t.fee = 0, Yi(t) ? t.signature = du() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function V6(e) {
  const t = [
    e.hashMode,
    Ne(e.signer),
    kr(e.nonce, !1, 8),
    kr(e.fee, !1, 8),
    e.keyEncoding,
    cu(e.signature)
  ];
  return Ve(t);
}
function G6(e) {
  const t = [
    e.hashMode,
    Ne(e.signer),
    kr(e.nonce, !1, 8),
    kr(e.fee, !1, 8)
  ], n = uu(e.fields);
  t.push(fu(n));
  const r = new Uint8Array(2);
  return O5(r, e.signaturesRequired, 0), t.push(r), Ve(t);
}
function K6(e, t) {
  const n = be(t.readBytes(20)), r = BigInt(`0x${be(t.readBytes(8))}`), s = BigInt(`0x${be(t.readBytes(8))}`), i = t.readUInt8Enum(ke, (l) => {
    throw new _t(`Could not parse ${l} as PubKeyEncoding`);
  });
  if (e === Be.SerializeP2WPKH && i != ke.Compressed)
    throw new _t("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Zl(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function W6(e, t) {
  const n = be(t.readBytes(20)), r = BigInt("0x" + be(t.readBytes(8))), s = BigInt("0x" + be(t.readBytes(8))), i = sp(t, Z.TransactionAuthField).values;
  let o = !1, l = 0;
  for (const h of i)
    switch (h.contents.type) {
      case Z.PublicKey:
        di(h.contents) || (o = !0);
        break;
      case Z.MessageSignature:
        if (h.pubKeyEncoding === ke.Uncompressed && (o = !0), l += 1, l === 65536)
          throw new ts("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const u = t.readUInt16BE();
  if (o && (e === Be.SerializeP2WSH || e === Be.SerializeP2WSHNonSequential))
    throw new ts("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: u
  };
}
function Qc(e) {
  return Yi(e) ? V6(e) : G6(e);
}
function Jc(e) {
  const t = e.readUInt8Enum(Be, (n) => {
    throw new _t(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Be.SerializeP2PKH || t === Be.SerializeP2WPKH ? K6(t, e) : W6(t, e);
}
function up(e, t, n, r) {
  const i = e + be(new Uint8Array([t])) + be(kr(n, !1, 8)) + be(kr(r, !1, 8));
  if (Ne(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return hu(Ne(i));
}
function fp(e, t, n) {
  const r = 33 + nc, s = di(t) ? ke.Compressed : ke.Uncompressed, i = e + N6(s.toString(16)) + n.data, o = Ne(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return hu(o);
}
function Y6(e, t, n, r, s) {
  const i = up(e, t, n, r), o = o6(s, i), l = a6(s), u = fp(i, l, o);
  return {
    nextSig: o,
    nextSigHash: u
  };
}
function hp(e, t, n, r, s, i) {
  const o = up(e, t, n, r), l = ti(e6(o, i, s)), u = fp(o, l, i);
  return {
    pubKey: l,
    nextSigHash: u
  };
}
function q6() {
  const e = lp(Be.SerializeP2PKH, "", 0, 0);
  return e.signer = b6().hash160, e.keyEncoding = ke.Compressed, e.signature = du(), e;
}
function Ah(e, t, n) {
  return Yi(e) ? X6(e, t, n) : Z6(e, t, n);
}
function X6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = hp(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), i = lu(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new ts(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function Z6(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const u of e.fields)
    switch (u.contents.type) {
      case Z.PublicKey:
        di(u.contents) || (i = !0), r.push(u.contents);
        break;
      case Z.MessageSignature:
        u.pubKeyEncoding === ke.Uncompressed && (i = !0);
        const { pubKey: h, nextSigHash: d } = hp(s, n, e.fee, e.nonce, u.pubKeyEncoding, u.contents);
        if (mh(e.hashMode) && (s = d), r.push(h), o += 1, o === 65536)
          throw new ts("Too many signatures");
        break;
    }
  if (mh(e.hashMode) && o !== e.signaturesRequired || R6(e.hashMode) && o < e.signaturesRequired)
    throw new ts("Incorrect number of signatures");
  if (i && (e.hashMode === Be.SerializeP2WSH || e.hashMode === Be.SerializeP2WSHNonSequential))
    throw new ts("Uncompressed keys are not allowed in this hash mode");
  const l = lu(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (l !== e.signer)
    throw new ts(`Signer hash does not equal hash of public key(s): ${l} != ${e.signer}`);
  return s;
}
function dp(e) {
  return {
    authType: je.Standard,
    spendingCondition: e
  };
}
function gp(e, t) {
  return {
    authType: je.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || lp(Be.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function vh(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case je.Standard:
        return dp(Sh(e.spendingCondition));
      case je.Sponsored:
        return gp(Sh(e.spendingCondition), q6());
      default:
        throw new Ca("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Q6(e, t) {
  switch (e.authType) {
    case je.Standard:
      return Ah(e.spendingCondition, t, je.Standard);
    case je.Sponsored:
      return Ah(e.spendingCondition, t, je.Standard);
    default:
      throw new Ca("Invalid origin auth type");
  }
}
function J6(e, t) {
  switch (e.authType) {
    case je.Standard:
      const n = {
        ...e.spendingCondition,
        fee: st(t, !1)
      };
      return { ...e, spendingCondition: n };
    case je.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: st(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function eA(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: st(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function tA(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: st(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function nA(e, t) {
  const n = {
    ...t,
    nonce: st(t.nonce, !1),
    fee: st(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function rA(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case je.Standard:
      t.push(Qc(e.spendingCondition));
      break;
    case je.Sponsored:
      t.push(Qc(e.spendingCondition)), t.push(Qc(e.sponsorSpendingCondition));
      break;
  }
  return Ve(t);
}
function sA(e) {
  const t = e.readUInt8Enum(je, (r) => {
    throw new _t(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case je.Standard:
      return n = Jc(e), dp(n);
    case je.Sponsored:
      n = Jc(e);
      const r = Jc(e);
      return gp(n, r);
  }
}
function pp(e, t, n) {
  return typeof e == "string" && (e = au(e)), {
    type: Z.PostCondition,
    conditionType: rt.STX,
    principal: e,
    conditionCode: t,
    amount: st(n, !1)
  };
}
function bp(e, t, n, r) {
  return typeof e == "string" && (e = au(e)), typeof r == "string" && (r = Vg(r)), {
    type: Z.PostCondition,
    conditionType: rt.Fungible,
    principal: e,
    conditionCode: t,
    amount: st(n, !1),
    assetInfo: r
  };
}
function yp(e, t, n, r) {
  return typeof e == "string" && (e = au(e)), typeof n == "string" && (n = Vg(n)), {
    type: Z.PostCondition,
    conditionType: rt.NonFungible,
    principal: e,
    conditionCode: t,
    assetInfo: n,
    assetName: r
  };
}
class iA {
  constructor(t, n, r, s, i, o, l) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: st(r.amount, !1)
    } : this.payload = r, this.chainId = l ?? R5, this.postConditionMode = i ?? ei.Deny, this.postConditions = s ?? uu([]), o)
      this.anchorMode = Y5(o);
    else
      switch (r.payloadType) {
        case ge.Coinbase:
        case ge.CoinbaseToAltRecipient:
        case ge.NakamotoCoinbase:
        case ge.PoisonMicroblock:
        case ge.TenureChange:
          this.anchorMode = Et.OnChainOnly;
          break;
        case ge.ContractCall:
        case ge.SmartContract:
        case ge.VersionedSmartContract:
        case ge.TokenTransfer:
          this.anchorMode = Et.Any;
          break;
      }
  }
  signBegin() {
    const t = Jl(this);
    return t.auth = vh(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Jl(this);
    return t.auth = vh(t.auth), t.txid();
  }
  verifyOrigin() {
    return Q6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, je.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === je.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, je.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Yi(n)) {
      const r = di(t);
      n.fields.push(Os(r ? ke.Compressed : ke.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = Y6(n, r, t.fee, t.nonce, s);
    return Yi(t) ? t.signature = i : t.fields.push(Os(s.data.byteLength === Ug ? ke.Compressed : ke.Uncompressed, i)), o;
  }
  txid() {
    const t = this.serialize();
    return hu(t);
  }
  setSponsor(t) {
    if (this.auth.authType != je.Sponsored)
      throw new Ca("Cannot sponsor sign a non-sponsored transaction");
    this.auth = nA(this.auth, t);
  }
  setFee(t) {
    this.auth = J6(this.auth, t);
  }
  setNonce(t) {
    this.auth = eA(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != je.Sponsored)
      throw new Ca("Cannot sponsor sign a non-sponsored transaction");
    this.auth = tA(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new qr('"version" is undefined');
    if (this.chainId === void 0)
      throw new qr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new qr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new qr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new qr('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return bs(n, this.chainId, 0), t.push(n), t.push(rA(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(fu(this.postConditions)), t.push(ep(this.payload)), Ve(t);
  }
}
function oA(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Pi(Ne(e.slice(2))) : t = new Pi(Ne(e)) : e instanceof Uint8Array ? t = new Pi(e) : t = e;
  const n = t.readUInt8Enum(Ia, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = sA(t), i = t.readUInt8Enum(Et, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = t.readUInt8Enum(ei, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), l = sp(t, Z.PostCondition), u = d6(t);
  return new iA(n, s, u, l, o, i, r);
}
function aA(e, t, n) {
  return pp(ic(e), t, n);
}
function cA(e, t, n, r) {
  return pp(sc(e, t), n, r);
}
function lA(e, t, n, r) {
  return bp(ic(e), t, n, r);
}
function uA(e, t, n, r, s) {
  return bp(sc(e, t), n, r, s);
}
function fA(e, t, n, r) {
  return yp(ic(e), t, n, r);
}
function hA(e, t, n, r, s) {
  return yp(sc(e, t), n, r, s);
}
const La = Wg, Ba = Zg, dA = Yg;
function gA(e) {
  if (bA(e)) {
    const [t, n] = ac(e);
    return new Eh(t, n);
  }
  return new Eh(e, void 0);
}
class Eh {
  constructor(t, n) {
    this.address = t, this.contractName = n;
  }
  willSendEq(t) {
    return new Li(this.address, t, Vn.Equal, this.contractName);
  }
  willSendLte(t) {
    return new Li(this.address, t, Vn.LessEqual, this.contractName);
  }
  willSendLt(t) {
    return new Li(this.address, t, Vn.Less, this.contractName);
  }
  willSendGte(t) {
    return new Li(this.address, t, Vn.GreaterEqual, this.contractName);
  }
  willSendGt(t) {
    return new Li(this.address, t, Vn.Greater, this.contractName);
  }
  willSendAsset() {
    return new Ih(this.address, Gi.Sends, this.contractName);
  }
  willNotSendAsset() {
    return new Ih(this.address, Gi.DoesNotSend, this.contractName);
  }
}
class Li {
  constructor(t, n, r, s) {
    this.address = t, this.amount = n, this.code = r, this.contractName = s;
  }
  ustx() {
    return this.contractName ? cA(this.address, this.contractName, this.code, this.amount) : aA(this.address, this.code, this.amount);
  }
  ft(t, n) {
    const [r, s] = ac(t);
    return this.contractName ? uA(this.address, this.contractName, this.code, this.amount, Ki(r, s, n)) : lA(this.address, this.code, this.amount, Ki(r, s, n));
  }
}
class Ih {
  constructor(t, n, r) {
    this.principal = t, this.code = n, this.contractName = r;
  }
  nft(...t) {
    const { contractAddress: n, contractName: r, tokenName: s, assetId: i } = yA(...t);
    return this.contractName ? hA(this.principal, this.contractName, this.code, Ki(n, r, s), i) : fA(this.principal, this.code, Ki(n, r, s), i);
  }
}
function ac(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
function pA(e) {
  const [t, n] = e.split("::");
  if (!t || !n)
    throw new Error(`Invalid fully-qualified nft asset name: ${e}`);
  const [r, s] = ac(t);
  return { contractAddress: r, contractName: s, tokenName: n };
}
function bA(e) {
  return e.includes(".");
}
function yA(...e) {
  if (e.length === 2) {
    const [o, l] = e;
    return { ...pA(o), assetId: l };
  }
  const [t, n, r] = e, [s, i] = ac(t);
  return { contractAddress: s, contractName: i, tokenName: n, assetId: r };
}
const xp = (e) => {
  let t = "";
  for (const n of e)
    t += n.toString(16).padStart(2, "0");
  return t;
}, xA = ["store_write"], $h = "/manifest.json", wA = /* @__PURE__ */ new Set([4001, -31001]), mA = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], SA = ["result", "data", "payload", "response", "params"], Ch = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], gu = (e) => typeof e == "string" && e.toLowerCase().includes("leather"), ro = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), gi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, zs = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, wp = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), pu = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => wp(i, r)) === s
  );
}, mp = (e) => e ? pu(gi()).some(
  (t) => {
    var n;
    return t.id === e && (ro(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Sp = () => {
  if (typeof window > "u")
    return;
  const e = gi(), t = pu(e).filter(
    (n) => {
      var r;
      return ro(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = zs(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of mA) {
    const r = zs(e, n) ?? (e === window ? void 0 : zs(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Ap = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = gi(), n = zs(t, e) ?? (t === window ? void 0 : zs(window, e)) ?? Ka(e);
  if (n)
    return n;
  if (ro(e) || mp(e))
    return Sp();
}, AA = (e) => {
  const t = gi();
  if (!t)
    return [];
  const n = pu(t), r = e.filter(
    (s) => !n.some((i) => wp(i, s)) && !!zs(t, s.id)
  );
  return n.concat(r);
}, _r = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, Zn = () => ({ isConnected: !1 }), vA = ["blockstack-session", "blockstack"], vp = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of vA) {
      let t = null;
      try {
        t = window.localStorage.getItem(e);
      } catch {
        continue;
      }
      if (!t)
        continue;
      let n = !1;
      try {
        const r = JSON.parse(t);
        n = typeof (r == null ? void 0 : r.version) == "string" && r.version.length > 0;
      } catch {
        n = !1;
      }
      if (!n)
        try {
          window.localStorage.removeItem(e);
        } catch {
        }
    }
};
vp();
const so = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, dt = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, EA = (e) => {
  const t = dt(e);
  if (!t)
    return null;
  const n = so(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, IA = (e) => {
  const t = dt(e);
  if (!t)
    return null;
  const n = so(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Ha = (e, t = "mainnet") => {
  if (typeof e == "string") {
    const n = e.toLowerCase();
    if (n.includes("testnet") || n === "test")
      return "testnet";
    if (n.includes("mainnet") || n === "main")
      return "mainnet";
  }
  if (e && typeof e == "object") {
    const n = e;
    if (typeof n.network == "string")
      return Ha(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Ha(r, t);
  }
  return t;
}, Ma = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, $A = (e) => typeof e == "string" ? so(e) : xp(un(e)), CA = (e) => typeof e == "string" ? so(e) : xp(ip(e)), LA = (e) => e === ei.Allow ? "allow" : "deny", si = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return js(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const i = si(s, t + 1);
      if (i)
        return i;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const n = e, r = [
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
    const i = si(n[s], t + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && js(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && js(n.testnet) ? n.testnet.trim() : null;
}, Lh = (e) => {
  const t = dt(e);
  if (!t)
    return null;
  const n = so(t);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, e0 = (e, t, n = 0) => {
  if (n > 8 || !e)
    return null;
  if (Array.isArray(e)) {
    for (const o of e) {
      const l = e0(o, t, n + 1);
      if (l)
        return l;
    }
    return null;
  }
  if (typeof e != "object")
    return t ? null : Lh(e);
  const r = e, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => dt(o)).find((o) => o && js(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => Lh(o)).find(Boolean);
  if (i && (!t || s && s === t))
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
    const l = e0(r[o], t, n + 1);
    if (l)
      return l;
  }
  return null;
}, BA = (e) => {
  var i;
  const t = e.profile ?? {}, n = typeof t.stxAddress == "string" ? t.stxAddress : typeof ((i = t.stxAddress) == null ? void 0 : i.mainnet) == "string" ? t.stxAddress.mainnet : e.identityAddress, r = typeof n == "string" && js(n) ? n.trim() : null;
  if (!r)
    return Zn();
  const s = n0(r);
  return s !== "mainnet" ? Zn() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, HA = (e, t = "mainnet") => {
  const n = si(e);
  if (!n)
    return Zn();
  const r = n0(n) ?? Ha(e, t);
  if (r !== "mainnet")
    return Zn();
  const s = e0(e, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, cc = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, io = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && wA.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Or = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = dt(n == null ? void 0 : n.message) ?? dt(t.message) ?? dt(t.error) ?? dt(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, xs = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Or(t);
    if (t.status === "error")
      throw Or(t.result ?? t);
  }
  return e;
}, lc = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return xs(r);
  } catch (r) {
    throw Or(r);
  }
}, bu = () => Sp(), ii = (e) => {
  var r, s;
  const t = fn();
  if (ro(t) || mp(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = gi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === bu();
}, Bh = async (e, t, n) => {
  if (!ii(e))
    return lc(e, t, n);
  const r = bu();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return xs(await r.request(t, n));
  } catch (s) {
    throw Or(s);
  }
}, el = (e) => {
  const t = IA(e);
  if (!t)
    return null;
  try {
    const n = oA(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, t0 = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = el(e), r = EA(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? dt(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const l of e) {
      const u = t0(l, t + 1);
      if (u)
        return u;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let i = null;
  for (const l of Ch)
    if (el(s[l])) {
      i = dt(s[l]);
      break;
    }
  const o = dt(s.txId) || dt(s.txid) || dt(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? dt(s.txRaw) ?? void 0
    };
  for (const l of Ch) {
    const u = el(s[l]);
    if (u)
      return {
        ...s,
        txId: u,
        txid: u,
        txRaw: dt(s[l]) ?? void 0
      };
  }
  for (const l of SA) {
    const u = s[l], h = t0(u, t + 1);
    if (h)
      return {
        ...s,
        ...u && typeof u == "object" ? u : {},
        ...h,
        txId: h.txId,
        txid: h.txid ?? h.txId
      };
  }
  return null;
}, Hh = (e) => {
  const t = t0(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, MA = (e) => ({
  ...e,
  fee: Ma(e.fee),
  nonce: Ma(e.nonce),
  sponsored: e.sponsored === !0
}), Ep = (e) => {
  const t = e.postConditions && e.postConditions.length > 0 ? e.postConditions.map((n) => CA(n)) : void 0;
  return {
    contract: `${e.contractAddress}.${e.contractName}`,
    functionName: e.functionName,
    functionArgs: e.functionArgs.map((n) => $A(n)),
    network: Ha(e.network),
    address: e.stxAddress,
    fee: Ma(e.fee),
    nonce: Ma(e.nonce),
    sponsored: e.sponsored ?? !1,
    postConditionMode: LA(e.postConditionMode),
    postConditions: t
  };
}, _A = (e) => {
  const t = Ep(e);
  return {
    contract: t.contract,
    functionName: t.functionName,
    functionArgs: t.functionArgs,
    // Older Xverse builds validate with a schema that only reads `arguments`
    // and silently drop `functionArgs`; send both spellings.
    arguments: t.functionArgs,
    postConditionMode: t.postConditionMode,
    postConditions: t.postConditions
  };
}, Ip = "WALLET_ADDRESS_MISMATCH";
let Mh = 9e4;
const TA = 45e3;
let Di = null;
const _a = (e) => {
  e && (Di = { address: e, at: Date.now() });
}, $p = () => {
  Di = null;
}, NA = () => Di && Date.now() - Di.at <= TA ? Di.address : null, UA = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, PA = async (e) => {
  $p();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = xs(await e.request("wallet_connect")), n = si(t);
  return _a(n), n;
}, DA = async (e, t, n, r) => {
  try {
    return xs(await e.request(t, n));
  } catch (s) {
    const i = Or(s);
    if (!UA(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: i.message
    });
    let o = null;
    try {
      o = await PA(e);
    } catch (l) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: l instanceof Error ? l.message : String(l)
      }), i;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : i.message
        ),
        { code: o ? Ip : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: o });
    try {
      return xs(await e.request(t, n));
    } catch (l) {
      throw Or(l);
    }
  }
};
let _h = 3e4;
const kA = (e, t) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${_h / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, _h);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, OA = async (e, t, n) => {
  const r = (u, h) => {
    if (t && u !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${u} (via ${h}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ip }
      );
    return u;
  }, s = NA();
  if (s)
    return _r(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  _r(n, "account-read");
  try {
    const u = xs(
      await kA(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = si(u), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (u) {
    if (io(u))
      throw Or(u);
    _r(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: u instanceof Error ? u.message : String(u)
    });
  }
  if (i)
    return _a(i), r(i, "wallet_getAccount");
  let o;
  _r(n, "account-reconnect");
  try {
    o = xs(await e.request("wallet_connect"));
  } catch (u) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: u instanceof Error ? u.message : String(u)
    }), Or(u);
  }
  const l = si(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: l }), !l)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return _a(l), r(l, "wallet_connect");
}, FA = async (e, t) => {
  if (!ii(e)) {
    _r(t.onProgress, "signing-request");
    const u = await lc(
      e,
      "stx_callContract",
      Ep(t)
    );
    return Hh(u);
  }
  const n = bu();
  if (!n)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  let r = "account-preflight", s;
  const i = async () => {
    var d;
    s = await OA(n, t.stxAddress, t.onProgress), r = "stx_callContract", _r(t.onProgress, "signing-request");
    const u = _A(t);
    console.info("[wallet:contract-call]", {
      stage: "XVERSE_SIGNING_REQUEST",
      providerId: fn(),
      contract: u.contract,
      functionName: u.functionName,
      functionArgCount: u.functionArgs.length,
      postConditionMode: u.postConditionMode,
      postConditionCount: ((d = u.postConditions) == null ? void 0 : d.length) ?? 0,
      expectedAddress: t.stxAddress,
      activeAddress: s
    });
    const h = await DA(
      n,
      "stx_callContract",
      u,
      t.stxAddress ?? s
    );
    return Hh(h);
  };
  let o;
  const l = new Promise((u, h) => {
    o = setTimeout(() => {
      h(
        Object.assign(
          new Error(
            `Xverse did not answer the ${r} request within ${Math.round(
              Mh / 1e3
            )}s (provider=${fn() ?? "unknown"}, expected=${t.stxAddress ?? "none"}, active=${s ?? "unknown"}, call=${t.contractAddress}.${t.contractName}::${t.functionName}). If Xverse showed an error toast, note its exact text; if you approved a transaction, it may still broadcast.`
          ),
          { code: "XVERSE_SIGNING_TIMEOUT", stage: r }
        )
      );
    }, Mh);
  });
  try {
    return await Promise.race([i(), l]);
  } finally {
    o && clearTimeout(o);
  }
}, Cp = (e, t = 0) => {
  if (t > 5 || e === null || typeof e > "u")
    return [];
  if (Array.isArray(e))
    return [...new Set(e.filter((r) => typeof r == "string"))];
  if (typeof e != "object")
    return [];
  const n = e;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Cp(n[r], t + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, jA = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], zA = async (e) => {
  const t = fn();
  if (ii(e))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!gu(t))
    return jA;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Cp(await lc(e, "supportedMethods"));
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
}, RA = async (e) => {
  if (ii(e))
    try {
      await Bh(e, "wallet_disconnect");
    } catch {
    }
  const t = await zA(e);
  let n = null;
  for (const r of t)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await Bh(e, r), i = HA(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), ii(e) && _a(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = cc(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), io(s))
        return Zn();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Zn();
}, VA = async (e, t) => {
  const n = new Ua(xA, void 0, "", $h), r = new Oi({ appConfig: n });
  return new Promise((s) => {
    L5(
      {
        appDetails: {
          name: e.appName,
          icon: e.appIcon
        },
        manifestPath: $h,
        userSession: r,
        onFinish: (i) => {
          s(BA(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Zn());
        }
      },
      t
    );
  });
}, GA = (e, t = !0) => {
  if (e && typeof e != "string")
    return e;
  const n = typeof e == "string" ? e : fn(), r = Ap(n);
  return r ? (t && n && C1(n), r) : null;
}, KA = (e) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const t = (e == null ? void 0 : e.persistSelection) ?? !0;
  return Lg(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = _g, i = AA(s), o = document.body.style.overflow, l = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", u), r.remove();
    }, u = (h) => {
      h.key === "Escape" && (l(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = t, r.callback = (h) => {
      const d = GA(h, t);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof h == "string" ? h : fn() ?? "provider-object",
        resolved: !!d,
        requestBridge: typeof (d == null ? void 0 : d.request) == "function"
      }), l(), n(d);
    }, r.cancelCallback = () => {
      l(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", u), document.body.appendChild(r);
  });
}, Lp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = fn(), t = e ? Ap(e) : void 0;
  if (t)
    return t;
  const n = gi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, WA = async (e) => {
  vp();
  const t = await KA({});
  if (!t)
    return Zn();
  if (typeof t.request == "function")
    try {
      const n = await RA(t);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (io(n))
        return Zn();
      if (!cc(n))
        throw n;
    }
  return VA(e, t);
}, YA = () => {
  const e = fn();
  return gu(e) ? "leather" : ro(e) ? "xverse" : e ? String(e) : void 0;
}, qA = async (e) => {
  const t = Qp("wallet_connect");
  Bi({ journey: t, step: "open", outcome: "start" });
  try {
    const n = await WA(e);
    return n.isConnected && n.address ? (r0(n.address, YA()), s0(n.network), Bi({ journey: t, step: "authorize", outcome: "success" })) : Bi({ journey: t, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw Bi({
      journey: t,
      step: "authorize",
      outcome: "error",
      errorCode: Wp(n),
      error: n
    }), n;
  }
}, XA = async () => {
  const e = Lp();
  if (e && gu(fn()))
    for (const t of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await lc(e, t);
        break;
      } catch (n) {
        if (io(n) || cc(n))
          continue;
      }
  B5(), L1(), $p(), r0(null), s0(null), Bi({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, ZA = (e, t) => {
  const n = t ?? Lp(), r = MA(e);
  return _r(e.onProgress, "provider-selected"), !n || typeof n.request != "function" ? (_r(e.onProgress, "legacy-request"), rh(r, t)) : void FA(n, e).then((s) => {
    var i;
    (i = e.onFinish) == null || i.call(e, s);
  }).catch((s) => {
    var i, o;
    if (cc(s) && !ii(n)) {
      rh(r, n);
      return;
    }
    if (console.error("[wallet] contract call request failed", s), io(s)) {
      (i = e.onCancel) == null || i.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (o = e.onCancel) == null || o.call(e);
  });
}, QA = (e) => {
  const t = zp(), n = () => {
    t.clear();
  }, r = () => {
    const o = t.load();
    return o.isConnected && o.address && (r0(o.address), s0(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), l = await qA({
        appName: e.appName,
        appIcon: e.appIcon
      });
      return l.isConnected ? (t.save(l), l) : o.isConnected ? o : l;
    },
    disconnect: async () => {
      await XA(), n();
    },
    getSession: r
  };
};
(function(e) {
  var t = 1, n = 360, r = 640, s = 6.283185307179586, i = 3.141592653589793, o = 1.5707963267948966;
  function l(c) {
    var a = Math.floor(c / s + 0.5);
    c = c - a * s, c > o ? c = i - c : c < -o && (c = -i - c);
    var g = c * c;
    return c * (1 + g * (-1 / 6 + g * (1 / 120 + g * (-1 / 5040 + g * (1 / 362880 + g * (-1 / 39916800 + g / 6227020800))))));
  }
  function u(c) {
    return l(c + o);
  }
  function h(c, a, g) {
    return c < a ? a : c > g ? g : c;
  }
  function d(c, a) {
    return Math.sqrt(c * c + a * a);
  }
  function f(c) {
    var a = c >>> 0, g = function() {
      a = a + 1831565813 >>> 0;
      var w = a;
      return w = Math.imul(w ^ w >>> 15, w | 1), w ^= w + Math.imul(w ^ w >>> 7, w | 61), ((w ^ w >>> 14) >>> 0) / 4294967296;
    };
    return g.int = function(w) {
      return Math.floor(g() * w);
    }, g.range = function(w, y) {
      return w + g() * (y - w);
    }, g.pick = function(w) {
      return w[Math.floor(g() * w.length)];
    }, g.chance = function(w) {
      return g() < w;
    }, g.state = function() {
      return a;
    }, g;
  }
  function x(c) {
    for (var a = 2166136261, g = 0; g < c.length; g++)
      a ^= c.charCodeAt(g), a = Math.imul(a, 16777619) >>> 0;
    return a >>> 0;
  }
  function p(c, a) {
    var g = Math.floor(a * 64) | 0;
    return c ^= g & 65535, c = Math.imul(c, 16777619) >>> 0, c ^= g >>> 16 & 65535, c = Math.imul(c, 16777619) >>> 0, c;
  }
  function A(c) {
    return x("astro3-daily-" + c);
  }
  function S(c, a) {
    for (var g = 0, w = 0; w < c.length; w++)
      a(c[w]) && (c[g++] = c[w]);
    c.length = g;
  }
  function L(c, a, g) {
    var w = u(g), y = l(g);
    return [c * w - a * y, c * y + a * w];
  }
  function k(c, a, g, w) {
    var y = g - c, v = w - a, I = d(y, v) || 1;
    return [y / I, v / I];
  }
  var U = [
    {
      name: "Perimeter Drift",
      boss: "warden",
      hazard: null,
      pool: { dart: 5, weaver: 4, swarmer: 3, gunship: 2 }
    },
    {
      name: "Ember Belt",
      boss: "hive",
      hazard: "rocks",
      pool: { dart: 4, weaver: 3, swarmer: 3, gunship: 2, splitter: 3, minelayer: 2 }
    },
    {
      name: "Nebula Veil",
      boss: "twins",
      hazard: "fog",
      pool: { dart: 3, weaver: 3, swarmer: 3, gunship: 2, splitter: 2, sniper: 3, bearer: 3 }
    },
    {
      name: "Glass Reef",
      boss: "leviathan",
      hazard: "crystals",
      pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 2, sniper: 2, bearer: 2, mirror: 3, turret: 2 }
    },
    {
      name: "Storm Corridor",
      boss: "prism",
      hazard: "lightning",
      pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 2, splitter: 2, sniper: 2, mirror: 2, turret: 2, carrier: 2 }
    },
    {
      name: "The Source",
      boss: "signal",
      hazard: "mixed",
      pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 3, splitter: 2, minelayer: 2, sniper: 2, bearer: 2, mirror: 2, turret: 2, carrier: 2 }
    }
  ], m = {
    dart: { hp: 2, r: 9, score: 100, scrap: 1 },
    weaver: { hp: 4, r: 10, score: 150, scrap: 1 },
    gunship: { hp: 14, r: 15, score: 400, scrap: 3 },
    splitter: { hp: 9, r: 14, score: 250, scrap: 2 },
    minelayer: { hp: 10, r: 14, score: 350, scrap: 2 },
    bearer: { hp: 12, r: 15, score: 400, scrap: 3 },
    sniper: { hp: 8, r: 11, score: 350, scrap: 2 },
    swarmer: { hp: 2, r: 8, score: 80, scrap: 1 },
    carrier: { hp: 60, r: 26, score: 1200, scrap: 6 },
    turret: { hp: 36, r: 18, score: 700, scrap: 4 },
    mirror: { hp: 12, r: 13, score: 450, scrap: 3 },
    rock: { hp: 6, r: 16, score: 60, scrap: 1, hazard: !0 },
    pebble: { hp: 2, r: 9, score: 30, scrap: 0, hazard: !0 },
    crystal: { hp: 1, r: 14, score: 0, scrap: 0, hazard: !0, invuln: !0 }
  }, H = ["pulse", "scatter", "lance", "swarm"], B = { pulse: "Pulse", scatter: "Scatter", lance: "Lance", swarm: "Swarm" }, j = { drone: 2, shield: 2, magnet: 3, over: 3, after: 3, graze: 2, bomb: 3, chain: 3 }, Q = {
    drone: ["Wing Drone", "A drone flies beside you and fires your weapon at half power."],
    shield: ["Shield Cell", "Blocks one hit. Recharges one cell after each wave."],
    magnet: ["Magnet", "Pulls scrap in from further away."],
    over: ["Overcharge", "Fire 15% faster."],
    after: ["Afterburner", "Move 12% faster."],
    graze: ["Graze Field", "Wider graze zone: more points and bomb charge from near misses."],
    bomb: ["Nova Rack", "+1 bomb now and +1 bomb capacity."],
    chain: ["Chain Battery", "Your kill chain lasts half a second longer."]
  }, z = {
    warden: { name: "Warden", hp: 520 },
    hive: { name: "Hive Mother", hp: 760 },
    twins: { name: "Twin Lancers", hp: 430 },
    // per ship
    leviathan: { name: "Leviathan", hp: 70 },
    // per segment (12 segments)
    prism: { name: "Prism Core", hp: 1300 },
    signal: { name: "The Signal", hp: 2100 }
  }, F = {
    NONE: 0,
    BOMB: 1,
    CARD1: 2,
    CARD2: 3,
    CARD3: 4,
    DOCK1: 5,
    DOCK2: 6,
    DOCK3: 7,
    DOCK4: 8,
    DOCK_LEAVE: 9
  }, E = 0, M = 1;
  function R(c) {
    c = c || {};
    var a = c.mode === M ? M : E, g = c.period >>> 0 || 0, w = a === M ? A(g) : c.seed >>> 0, y = new Uint8Array(20);
    c.pilot && c.pilot.length === 20 && y.set(c.pilot);
    for (var v = (c.pilotVersion | 0) & 255, I = 2166136261, D = 0; D < 20; D++)
      I ^= y[D], I = Math.imul(I, 16777619) >>> 0;
    I ^= v, I = Math.imul(I, 16777619) >>> 0;
    var q = a === M ? w : (w ^ I) >>> 0, _ = {
      v: t,
      seed: w,
      mode: a,
      period: g,
      pilot: y,
      pilotVersion: v,
      rng: f(q),
      rng2: f((w ^ I ^ 2654435769) >>> 0),
      // pilot-bound: upgrades, dock crates, drops
      frame: 0,
      phase: "play",
      overT: 0,
      loop: 0,
      sector: 0,
      wave: 0,
      flow: "sectorIntro",
      flowT: 0,
      banner: null,
      player: {
        x: n / 2,
        y: r - 90,
        lives: 3,
        shield: 0,
        bombs: 2,
        bombMax: 3,
        bombCharge: 0,
        inv: 60,
        weapon: "pulse",
        wlv: 1,
        fireT: 0,
        missileT: 0,
        droneT: 0,
        mods: { drone: 0, shield: 0, magnet: 0, over: 0, after: 0, graze: 0, bomb: 0, chain: 0 },
        hitThisWave: !1,
        vx: 0,
        vy: 0
      },
      score: 0,
      chain: 0,
      chainT: 0,
      maxChain: 0,
      scrap: 0,
      kills: 0,
      grazes: 0,
      bossTimes: [],
      pb: [],
      eb: [],
      en: [],
      pk: [],
      beams: [],
      lanes: [],
      schedule: [],
      waveT: 0,
      hazardT: 0,
      boss: null,
      cards: null,
      dock: null,
      dockBuys: [0, 0, 0, 0],
      events: [],
      nextId: 1,
      testGod: !!c.testGod
    };
    return te(_, "SECTOR 1", U[0].name, 150), _;
  }
  function N(c, a, g) {
    g = g || {}, g.type = a, c.events.push(g);
  }
  function te(c, a, g, w) {
    c.banner = { title: a, sub: g || "", t: w, max: w };
  }
  function G(c) {
    var a = c.sector, g = c.loop;
    return {
      hp: 1 + 0.5 * a + 1.6 * g,
      fire: 1.2 + 0.3 * a + 1.1 * g,
      bs: 1.08 + 0.09 * a + 0.35 * g,
      elite: Math.min(0.6, 0.015 + 0.035 * a + 0.12 * g)
    };
  }
  function $t(c) {
    for (var a = 1, g = 0; g < c.loop; g++) a *= 1.5;
    return a;
  }
  function Xt(c) {
    return Math.min(8, 1 + Math.floor(c.chain / 6));
  }
  function wt(c, a, g) {
    var w = Math.floor(a * (g ? Xt(c) : 1) * $t(c));
    return c.score += w, w;
  }
  function C(c, a) {
    c.events.length = 0;
    var g = a ? a.ax | 0 : 0, w = a ? a.ay | 0 : 0, y = a ? a.cmd | 0 : 0;
    if (g < -4 && (g = -4), g > 4 && (g = 4), w < -4 && (w = -4), w > 4 && (w = 4), c.phase !== "over") {
      if (c.phase === "cards") {
        ho(c, y), c.frame++;
        return;
      }
      if (c.phase === "dock") {
        yc(c, y), c.frame++;
        return;
      }
      c.frame++;
      var v = c.player;
      if (c.overT > 0) {
        if (c.overT--, c.overT === 0) {
          c.phase = "over", N(c, "gameOver");
          return;
        }
      } else {
        for (var I = 3.4, D = 0; D < v.mods.after; D++) I *= 1.12;
        v.vx = g / 4 * I, v.vy = w / 4 * I, g !== 0 && w !== 0 && (v.vx *= 0.7071, v.vy *= 0.7071), v.x = h(v.x + v.vx, 12, n - 12), v.y = h(v.y + v.vy, 70, r - 24), y === F.BOMB && ao(c), v.inv > 0 && v.inv--, dc(c);
      }
      c.banner && (c.banner.t--, c.banner.t <= 0 && (c.banner = null)), c.chainT > 0 && (c.chainT--, c.chainT === 0 && (c.chain >= 12 && N(c, "chainLost", { chain: c.chain }), c.chain = 0)), P(c), hc(c), Si(c), c.boss && wc(c), bi(c), lo(c), uo(c), dn(c);
    }
  }
  function P(c) {
    switch (c.flowT++, c.flow) {
      case "sectorIntro":
        c.flowT >= 150 && Ee(c);
        break;
      case "wave":
        for (c.waveT++; c.schedule.length && c.schedule[0].t <= c.waveT; ) fc(c, c.schedule.shift());
        !c.schedule.length && !ve(c) && Ae(c);
        break;
      case "waveClear":
        c.flowT >= 80 && fo(c);
        break;
      case "bossWarn":
        c.flowT >= 160 && (c.flow = "boss", c.flowT = 0, zr(c));
        break;
      case "boss":
        c.boss || (c.flow = "bossDead", c.flowT = 0);
        break;
      case "bossDead":
        c.flowT >= 150 && bc(c);
        break;
    }
  }
  function ve(c) {
    for (var a = 0; a < c.en.length; a++) if (!c.en[a].hazard && !c.en[a].dead) return !0;
    return !1;
  }
  function Ee(c) {
    c.flow = "wave", c.flowT = 0, c.waveT = 0, c.player.hitThisWave = !1, c.schedule = pi(c), te(c, "WAVE " + (c.sector + 1) + "-" + (c.wave + 1), U[c.sector].name, 70), N(c, "waveStart", { sector: c.sector, wave: c.wave });
  }
  function Ae(c) {
    c.flow = "waveClear", c.flowT = 0;
    var a = c.sector + 1, g = 0;
    c.player.hitThisWave || (g = wt(c, 600 * a, !1)), N(c, "waveClear", { perfect: !c.player.hitThisWave, bonus: g }), te(c, c.player.hitThisWave ? "WAVE CLEAR" : "PERFECT WAVE", g ? "+" + g : "", 80);
    var w = c.player;
    w.shield < w.mods.shield && w.shield++;
  }
  function Xe(c) {
    c.phase = "play", c.cards = null, c.wave < 3 ? (c.wave++, Ee(c)) : (c.wave = 4, c.flow = "bossWarn", c.flowT = 0, S(c.en, function(a) {
      return !a.hazard;
    }), c.lanes.length = 0, te(c, "WARNING", z[U[c.sector].boss].name.toUpperCase() + " APPROACHING", 160), N(c, "bossWarn", { boss: U[c.sector].boss }));
  }
  function jr(c) {
    c.phase = "play", c.dock = null, c.wave = 0, c.sector++, c.sector >= U.length ? (c.sector = 0, c.loop++, N(c, "loop", { loop: c.loop }), te(c, "DEEP LOOP " + c.loop, "Score x" + $t(c).toFixed(2).replace(/\.?0+$/, ""), 180)) : te(c, "SECTOR " + (c.sector + 1), U[c.sector].name, 150), c.flow = "sectorIntro", c.flowT = 0, N(c, "sectorStart", { sector: c.sector, loop: c.loop });
  }
  function Bs(c, a) {
    var g = 0, w;
    for (w in a) g += a[w];
    var y = c() * g;
    for (w in a)
      if (y -= a[w], y < 0) return w;
    return w;
  }
  function pi(c) {
    var a = c.rng, g = c.sector, w = c.wave, y = c.loop, v = U[g].pool, I = Math.min(18, 6 + w + g + 2 * y), D = [], q = 20, _ = G(c);
    function W(Ie, Ot, Pn, en, Ft) {
      var Dn = { t: q + Ie, type: Ot, x: Pn, y: en, elite: a.chance(_.elite) };
      if (Ft) for (var mt in Ft) Dn[mt] = Ft[mt];
      D.push(Dn);
    }
    for (var se = 0; se < I; se++) {
      var ae = Bs(a, v), re, Y, Ue;
      switch (ae) {
        case "dart": {
          var kt = a.int(3);
          if (re = 4 + a.int(3), kt === 0)
            for (Y = 0; Y < re; Y++) W(0, "dart", 40 + Y * (280 / (re - 1)), -20);
          else if (kt === 1)
            for (Ue = a.range(60, 300), Y = 0; Y < re; Y++) W(Y * 10, "dart", Ue, -20);
          else {
            var ft = a.range(110, 250);
            for (Y = 0; Y < 5; Y++) W(Math.abs(Y - 2) * 8, "dart", ft + (Y - 2) * 32, -20);
          }
          break;
        }
        case "weaver":
          for (re = 4 + a.int(2), Ue = a.range(80, 280), Y = 0; Y < re; Y++) W(Y * 16, "weaver", Ue, -20, { phase: Y * 0.6 });
          break;
        case "swarmer": {
          var Ce = a.chance(0.5), Pe = a.range(50, 170);
          for (re = 6, Y = 0; Y < re; Y++) W(Y * 9, "swarmer", Ce ? -16 : n + 16, Pe, { dir: Ce ? 1 : -1 });
          break;
        }
        case "gunship":
          for (re = 1 + (a.chance(0.4 + 0.1 * g) ? 1 : 0), Y = 0; Y < re; Y++) W(Y * 30, "gunship", re === 1 ? a.range(90, 270) : 100 + Y * 160, -24, { ty: a.range(80, 190) });
          break;
        case "splitter":
          for (re = 2 + a.int(2), Y = 0; Y < re; Y++) W(Y * 20, "splitter", 70 + Y * (220 / Math.max(1, re - 1)), -24);
          break;
        case "minelayer": {
          var ne = a.chance(0.5);
          W(0, "minelayer", ne ? -20 : n + 20, a.range(60, 150), { dir: ne ? 1 : -1 });
          break;
        }
        case "sniper":
          re = 2, W(0, "sniper", a.range(40, 140), -20, { ty: a.range(60, 140) }), W(24, "sniper", a.range(220, 320), -20, { ty: a.range(60, 140) });
          break;
        case "bearer":
          for (re = 2 + a.int(2), Y = 0; Y < re; Y++) W(Y * 14, "bearer", 80 + Y * (200 / Math.max(1, re - 1)), -24);
          break;
        case "carrier":
          W(0, "carrier", a.range(110, 250), -40);
          break;
        case "turret":
          for (re = 1 + (a.chance(0.35) ? 1 : 0), Y = 0; Y < re; Y++) W(Y * 40, "turret", re === 1 ? a.range(90, 270) : 90 + Y * 180, -30);
          break;
        case "mirror":
          for (re = 2 + a.int(2), Y = 0; Y < re; Y++) W(Y * 18, "mirror", 70 + Y * (220 / Math.max(1, re - 1)), -20);
          break;
      }
      var We = Math.floor((150 - 7 * g - 10 * w - 8 * y) * a.range(0.75, 1.1));
      (ae === "carrier" || ae === "turret" || ae === "gunship") && (We += 50), q += Math.max(48, We);
    }
    return D.sort(function(Ie, Ot) {
      return Ie.t - Ot.t;
    }), D;
  }
  function fc(c, a) {
    var g = Ut(c, a.type, a.x, a.y, a.elite);
    for (var w in a) w !== "t" && w !== "type" && w !== "x" && w !== "y" && w !== "elite" && (g[w] = a[w]);
  }
  function Ut(c, a, g, w, y) {
    var v = m[a], I = G(c), D = v.invuln ? 1e9 : v.hp * I.hp * (y ? 2.5 : 1), q = {
      id: c.nextId++,
      t: a,
      x: g,
      y: w,
      vx: 0,
      vy: 0,
      r: v.r,
      hp: D,
      maxHp: D,
      age: 0,
      elite: !!y,
      hazard: !!v.hazard,
      invuln: !!v.invuln,
      fireT: 25 + c.rng.int(45),
      dead: !1,
      dmgMul: 1,
      flash: 0,
      s: {}
    };
    return c.en.push(q), q;
  }
  function hc(c) {
    if (c.flow === "wave") {
      var a = U[c.sector].hazard, g = c.rng;
      if (!(!a || a === "fog")) {
        c.hazardT++;
        var w = a === "mixed";
        if ((a === "rocks" || w) && c.hazardT % (w ? 170 : 85) === 0) {
          var y = Ut(c, "rock", g.range(20, n - 20), -24, !1);
          y.vx = g.range(-0.6, 0.6), y.vy = g.range(1.1, 2), y.spin = g.range(-0.05, 0.05);
        }
        if ((a === "crystals" || w) && c.hazardT % (w ? 300 : 210) === 0) {
          var v = Ut(c, "crystal", g.range(40, n - 40), -24, !1);
          v.vy = 0.7, v.vx = 0;
        }
        (a === "lightning" || w) && c.hazardT % (w ? 260 : 170) === 0 && (c.lanes.push({ x: g.range(30, n - 30), w: 44, warn: 75, act: 16, age: 0 }), N(c, "laneWarn"));
      }
    }
  }
  function oo(c) {
    for (var a = 1, g = 0; g < c.mods.over; g++) a *= 0.85;
    return a;
  }
  function Oe(c, a, g, w, y, v, I, D, q) {
    var _ = { x: a, y: g, vx: w, vy: y, dmg: v, kind: I, pierce: D || 1, hit: null, life: 0, reflect: 0 };
    if (q) for (var W in q) _[W] = q[W];
    return c.pb.push(_), _;
  }
  function dc(c) {
    var a = c.player;
    if (!(c.flow === "bossDead" || c.flow === "sectorIntro" && c.flowT < 30)) {
      var g = a.wlv, w = oo(a), y;
      if (a.fireT--, a.fireT <= 0) {
        var v = a.x, I = a.y - 14;
        switch (a.weapon) {
          case "pulse": {
            var D = [2, 2, 3, 3, 4][g - 1];
            g === 1 ? Oe(c, v, I, 0, -11, D, "pulse") : g <= 3 ? (Oe(c, v - 5, I, 0, -11, D, "pulse"), Oe(c, v + 5, I, 0, -11, D, "pulse")) : (Oe(c, v, I - 2, 0, -11, D, "pulse"), Oe(c, v - 8, I, 0, -11, D, "pulse"), Oe(c, v + 8, I, 0, -11, D, "pulse"), g === 5 && (Oe(c, v - 10, I, -1.3, -10.8, D - 1, "pulse"), Oe(c, v + 10, I, 1.3, -10.8, D - 1, "pulse"))), a.fireT = Math.max(3, Math.floor(7 * w));
            break;
          }
          case "scatter": {
            var q = [3, 5, 5, 7, 7][g - 1], _ = [0.5, 0.7, 0.7, 0.9, 0.95][g - 1], W = [1.6, 1.6, 2.1, 2.1, 2.6][g - 1];
            for (y = 0; y < q; y++) {
              var se = -_ / 2 + _ * y / (q - 1), ae = L(0, -9.5, se);
              Oe(c, v, I, ae[0], ae[1], W, "scatter");
            }
            a.fireT = Math.max(4, Math.floor(9 * w));
            break;
          }
          case "lance": {
            var re = [5, 6, 8, 9, 11][g - 1], Y = [2, 3, 3, 4, 5][g - 1];
            Oe(c, v, I - 6, 0, -14, re, "lance", Y), g >= 4 && (Oe(c, v - 12, I, -0.9, -13.5, re / 2, "lance", 2), Oe(c, v + 12, I, 0.9, -13.5, re / 2, "lance", 2)), a.fireT = Math.max(5, Math.floor(12 * w));
            break;
          }
          case "swarm": {
            Oe(c, v, I, 0, -10, 1.5, "pulse"), a.fireT = Math.max(4, Math.floor(8 * w));
            break;
          }
        }
      }
      if (a.weapon === "swarm" && (a.missileT--, a.missileT <= 0)) {
        var Ue = [1, 2, 2, 3, 4][g - 1], kt = [4, 4, 5, 5, 6][g - 1];
        for (y = 0; y < Ue; y++) {
          var ft = (y % 2 === 0 ? -1 : 1) * (1 + Math.floor(y / 2));
          Oe(c, a.x + ft * 8, a.y, ft * 1.8, -3, kt, "missile", 1, { homing: 1 });
        }
        a.missileT = Math.max(10, Math.floor([30, 26, 22, 20, 18][g - 1] * w));
      }
      if (a.mods.drone > 0 && (a.droneT--, a.droneT <= 0)) {
        for (y = 0; y < a.mods.drone; y++) {
          var Ce = a.x + (y === 0 ? -26 : 26), Pe = a.y + 10;
          switch (a.weapon) {
            case "pulse":
              Oe(c, Ce, Pe, 0, -11, 1 + g * 0.4, "drone");
              break;
            case "scatter":
              Oe(c, Ce, Pe, -1.4, -9.4, 0.9 + g * 0.2, "drone"), Oe(c, Ce, Pe, 0, -9.5, 0.9 + g * 0.2, "drone"), Oe(c, Ce, Pe, 1.4, -9.4, 0.9 + g * 0.2, "drone");
              break;
            case "lance":
              Oe(c, Ce, Pe, 0, -14, 2 + g, "lance", 2);
              break;
            case "swarm":
              Oe(c, Ce, Pe, y === 0 ? -1.5 : 1.5, -3, 2 + g * 0.5, "missile", 1, { homing: 1 });
              break;
          }
        }
        a.droneT = Math.max(6, Math.floor((a.weapon === "swarm" ? 34 : 13) * w));
      }
    }
  }
  function ao(c) {
    var a = c.player;
    if (!(a.bombs <= 0)) {
      a.bombs--, a.inv = Math.max(a.inv, 90);
      var g = c.eb.length;
      c.eb.length = 0;
      for (var w = 0; w < c.beams.length; w++) c.beams[w].age = c.beams[w].warn + c.beams[w].act;
      for (var y = 0; y < c.en.length; y++) {
        var v = c.en[y];
        v.dead || v.invuln || v.y < -10 || er(c, v, v.boss ? 30 : 40, !0);
      }
      N(c, "bomb", { x: a.x, y: a.y, cleared: g });
    }
  }
  function co(c, a, g) {
    for (var w = null, y = 1e12, v = 0; v < c.en.length; v++) {
      var I = c.en[v];
      if (!(I.dead || I.invuln || I.y < 0 || I.dmgMul === 0)) {
        var D = (I.x - a) * (I.x - a) + (I.y - g) * (I.y - g);
        D < y && (y = D, w = I);
      }
    }
    return w;
  }
  function bi(c) {
    for (var a = c.pb, g = c.en, w = 0; w < a.length; w++) {
      var y = a[w];
      if (y.life++, y.homing && y.life > 6) {
        var v = co(c, y.x, y.y);
        if (v) {
          var I = k(y.x, y.y, v.x, v.y);
          y.vx += I[0] * 0.9, y.vy += I[1] * 0.9;
        } else y.vy -= 0.4;
        var D = d(y.vx, y.vy), q = 8.5;
        D > q && (y.vx = y.vx / D * q, y.vy = y.vy / D * q);
      }
      if (y.x += y.vx, y.y += y.vy, y.reflect > 0 && y.reflect--, y.y < -20 || y.y > r + 20 || y.x < -20 || y.x > n + 20) {
        y.dead = !0;
        continue;
      }
      for (var _ = 0; _ < g.length; _++) {
        var W = g[_];
        if (!W.dead) {
          var se = W.r + (y.kind === "lance" ? 5 : 4), ae = y.x - W.x, re = y.y - W.y;
          if (!(ae * ae + re * re > se * se) && !(y.hit && y.hit.indexOf(W.id) >= 0)) {
            if (W.t === "crystal") {
              y.reflect === 0 && (y.vy = -y.vy * 0.9, y.vx = -y.vx + (ae > 0 ? 1.6 : -1.6), y.reflect = 10, N(c, "ricochet", { x: y.x, y: y.y }));
              continue;
            }
            if (W.t === "mirror" && W.s.flashing) {
              y.dead = !0;
              var Y = k(y.x, y.y, c.player.x, c.player.y);
              Ge(c, y.x, y.y, Y[0] * 3.4, Y[1] * 3.4, "shard"), N(c, "reflect", { x: y.x, y: y.y });
              break;
            }
            if (W.t === "bearer" && y.kind !== "lance" && y.vy < 0 && Math.abs(ae) < W.r * 0.6 && re > 0) {
              y.dead = !0, W.s.block = 8, N(c, "block", { x: y.x, y: y.y - 4 });
              break;
            }
            if (er(c, W, y.dmg, !1), y.pierce > 1)
              y.pierce--, y.hit || (y.hit = []), y.hit.push(W.id);
            else {
              y.dead = !0;
              break;
            }
          }
        }
      }
    }
    S(a, function(Ue) {
      return !Ue.dead;
    }), S(g, function(Ue) {
      return !Ue.dead;
    });
  }
  function er(c, a, g, w) {
    if (!(a.dead || a.invuln)) {
      var y = a.dmgMul;
      if (y <= 0) {
        w || N(c, "shieldHit", { x: a.x, y: a.y });
        return;
      }
      a.hp -= g * y, a.flash = 4, a.hp <= 0 ? gc(c, a) : !w && !(c.frame & 3) && N(c, "hit", { x: a.x, y: a.y });
    }
  }
  function gc(c, a) {
    if (!a.dead) {
      if (a.dead = !0, a.boss) {
        mc(c, a);
        return;
      }
      var g = m[a.t];
      a.hazard || (c.chain++, c.chainT = 90 + 30 * c.player.mods.chain, c.chain > c.maxChain && (c.maxChain = c.chain), c.kills++);
      var w = wt(c, g.score * (a.elite ? 3 : 1), !a.hazard);
      N(c, "kill", { x: a.x, y: a.y, t: a.t, elite: a.elite, pts: w, big: a.r > 18 });
      for (var y = g.scrap * (a.elite ? 2 : 1), v = 0; v < y; v++) yi(c, a.x, a.y, "scrap");
      a.elite && c.rng2.chance(0.12) && yi(c, a.x, a.y, "bomb"), Ai(c, a);
    }
  }
  function yi(c, a, g, w) {
    var y = c.rng2;
    c.pk.push({ x: a + y.range(-8, 8), y: g + y.range(-8, 8), vx: y.range(-1.2, 1.2), vy: y.range(-2.2, -0.6), kind: w, age: 0 });
  }
  function Ge(c, a, g, w, y, v, I) {
    var D = { x: a, y: g, vx: w, vy: y, kind: v || "orb", r: 3.5, grazed: !1, life: 0, ax: 0, ay: 0 };
    if (v === "big" ? D.r = 6.5 : v === "needle" ? D.r = 2.6 : v === "mine" ? D.r = 6 : v === "shard" && (D.r = 3), I) for (var q in I) D[q] = I[q];
    return c.eb.push(D), D;
  }
  function Hs(c) {
    return 20 + 8 * c.mods.graze;
  }
  function lo(c) {
    for (var a = c.player, g = c.eb, w = Hs(a), y = c.overT === 0, v = 0; v < g.length; v++) {
      var I = g[v];
      if (I.life++, I.vx += I.ax, I.vy += I.ay, I.x += I.vx, I.y += I.vy, I.kind === "mine" && I.life >= (I.fuse || 100)) {
        I.dead = !0;
        for (var D = 8, q = 2.2 * G(c).bs, _ = 0; _ < D; _++) {
          var W = L(0, q, s * _ / D);
          Ge(c, I.x, I.y, W[0], W[1], "orb");
        }
        N(c, "mineBurst", { x: I.x, y: I.y });
        continue;
      }
      if (I.x < -30 || I.x > n + 30 || I.y < -40 || I.y > r + 30) {
        I.dead = !0;
        continue;
      }
      if (y) {
        var se = I.x - a.x, ae = I.y - a.y, re = se * se + ae * ae, Y = I.r + 2.8;
        if (re < Y * Y) {
          a.inv === 0 && (I.dead = !0, Ct(c));
          continue;
        }
        !I.grazed && re < w * w && a.inv === 0 && (I.grazed = !0, c.grazes++, wt(c, 12, !0), a.bombCharge += 3, a.bombCharge >= 100 && (a.bombs < a.bombMax ? (a.bombs++, a.bombCharge = 0, N(c, "bombGained")) : a.bombCharge = 100), N(c, "graze", { x: I.x, y: I.y }));
      }
    }
    S(g, function(Ue) {
      return !Ue.dead;
    });
  }
  function uo(c) {
    for (var a = c.player, g = c.overT === 0, w = 0; w < c.beams.length; w++) {
      var y = c.beams[w];
      if (y.age++, y.age === y.warn && N(c, "beamFire", { x: y.x, y: y.y }), g && y.age > y.warn && y.age <= y.warn + y.act && a.inv === 0) {
        var v = a.x - y.x, I = a.y - y.y, D = v * y.dx + I * y.dy;
        if (D > 0 && D < y.len) {
          var q = v - y.dx * D, _ = I - y.dy * D;
          q * q + _ * _ < (y.w / 2 + 2) * (y.w / 2 + 2) && Ct(c);
        }
      }
    }
    S(c.beams, function(ae) {
      return ae.age <= ae.warn + ae.act;
    });
    for (var W = 0; W < c.lanes.length; W++) {
      var se = c.lanes[W];
      se.age++, se.age === se.warn && N(c, "lightning", { x: se.x }), g && se.age > se.warn && se.age <= se.warn + se.act && a.inv === 0 && Math.abs(a.x - se.x) < se.w / 2 && Ct(c);
    }
    S(c.lanes, function(ae) {
      return ae.age <= ae.warn + ae.act;
    });
  }
  function dn(c) {
    for (var a = c.player, g = 36 + 44 * a.mods.magnet, w = 0; w < c.pk.length; w++) {
      var y = c.pk[w];
      y.age++;
      var v = a.x - y.x, I = a.y - y.y, D = d(v, I);
      if (c.overT === 0 && (D < g || c.flow === "bossDead" || c.flow === "waveClear")) {
        var q = 6.5;
        y.vx = v / (D || 1) * q, y.vy = I / (D || 1) * q;
      } else
        y.vx *= 0.96, y.vy = Math.min(1.6, y.vy + 0.06);
      if (y.x += y.vx, y.y += y.vy, D < 16 && c.overT === 0) {
        y.dead = !0, y.kind === "scrap" ? (c.scrap++, wt(c, 10, !1), N(c, "scrap", { x: y.x, y: y.y })) : y.kind === "bomb" && (a.bombs < a.bombMax && a.bombs++, N(c, "pickup", { x: y.x, y: y.y, kind: "bomb" }));
        continue;
      }
      y.y > r + 20 && (y.dead = !0);
    }
    S(c.pk, function(_) {
      return !_.dead;
    });
  }
  function Ct(c) {
    var a = c.player;
    if (!(a.inv > 0 || c.overT > 0)) {
      if (a.hitThisWave = !0, c.testGod) {
        a.inv = 30;
        return;
      }
      c.chain >= 12 && N(c, "chainLost", { chain: c.chain }), c.chain = 0, c.chainT = 0;
      var g;
      a.shield > 0 ? (a.shield--, a.inv = 90, g = 90, N(c, "shieldBreak", { x: a.x, y: a.y })) : (a.lives--, a.inv = 150, g = 150, N(c, "playerHit", { x: a.x, y: a.y, lives: a.lives }), a.lives <= 0 && (c.overT = 100, N(c, "playerDie", { x: a.x, y: a.y }))), S(c.eb, function(w) {
        var y = w.x - a.x, v = w.y - a.y;
        return y * y + v * v > g * g;
      });
    }
  }
  function pc(c, a) {
    var g = c.player;
    if (a === "wlv") return { id: a, kind: "weapon", title: B[g.weapon] + " Lv " + (g.wlv + 1), desc: "Upgrade your " + B[g.weapon] + " to level " + (g.wlv + 1) + "." };
    if (a === "repair") return { id: a, kind: "repair", title: "Hull Repair", desc: "Restore one life." };
    if (a.indexOf("w_") === 0) {
      var w = a.slice(2), y = { pulse: "Focused rapid shots straight ahead.", scatter: "A wide fan of shots.", lance: "Heavy bolts that pierce through enemies and shields.", swarm: "Homing missiles plus a light forward gun." }[w];
      return { id: a, kind: "weapon", title: "Switch: " + B[w], desc: y + " Keeps your level (" + g.wlv + ")." };
    }
    var v = a.slice(2), I = Q[v], D = g.mods[v];
    return { id: a, kind: "module", title: I[0] + (D ? " " + (D + 1) : ""), desc: I[1] };
  }
  function fo(c) {
    var a = c.player, g = c.rng2, w = [];
    function y(se, ae) {
      w.push([se, ae]);
    }
    a.wlv < 5 && y("wlv", 5);
    for (var v = 0; v < H.length; v++) H[v] !== a.weapon && y("w_" + H[v], 1);
    for (var I in j) a.mods[I] < j[I] && y("m_" + I, I === "drone" || I === "shield" ? 3 : 2);
    a.lives < 5 && y("repair", a.lives <= 1 ? 2.5 : 0.8);
    for (var D = []; D.length < 3 && w.length; ) {
      var q = 0, _;
      for (_ = 0; _ < w.length; _++) q += w[_][1];
      var W = g() * q;
      for (_ = 0; _ < w.length && (W -= w[_][1], !(W < 0)); _++)
        ;
      _ >= w.length && (_ = w.length - 1), D.push(w[_][0]), w.splice(_, 1);
    }
    c.phase = "cards", c.cards = D.map(function(se) {
      return pc(c, se);
    }), N(c, "cards");
  }
  function xi(c, a) {
    var g = c.player;
    if (a === "wlv")
      g.wlv < 5 && g.wlv++;
    else if (a === "repair")
      g.lives < 5 && g.lives++;
    else if (a.indexOf("w_") === 0)
      g.weapon = a.slice(2), g.fireT = 0, g.missileT = 0;
    else {
      var w = a.slice(2);
      g.mods[w] < j[w] && (g.mods[w]++, w === "shield" && g.shield++, w === "bomb" && (g.bombMax++, g.bombs = Math.min(g.bombMax, g.bombs + 1)));
    }
  }
  function ho(c, a) {
    if (!(a < F.CARD1 || a > F.CARD3)) {
      var g = a - F.CARD1;
      if (!(!c.cards || g >= c.cards.length)) {
        var w = c.cards[g];
        xi(c, w.id), N(c, "cardPicked", { id: w.id, title: w.title }), Xe(c);
      }
    }
  }
  function go(c) {
    var a = c.player, g = c.sector + 1, w = [40 + 15 * g, 18 + 6 * g, 45 + 15 * g, 35 + 12 * g], y = w.map(function(D, q) {
      for (var _ = D, W = 0; W < c.dockBuys[q]; W++) _ = Math.floor(_ * 1.5);
      return _;
    }), v = !1;
    for (var I in j) a.mods[I] < j[I] && (v = !0);
    return [
      { title: "Hull Repair", desc: "+1 life", cost: y[0], ok: a.lives < 5 },
      { title: "Nova Bomb", desc: "+1 bomb", cost: y[1], ok: a.bombs < a.bombMax },
      { title: "Weapon Tune", desc: B[a.weapon] + " +1 level", cost: y[2], ok: a.wlv < 5 },
      { title: "Module Crate", desc: "A random module", cost: y[3], ok: v }
    ];
  }
  function bc(c) {
    c.phase = "dock", c.dock = go(c), N(c, "dock");
  }
  function yc(c, a) {
    if (a === F.DOCK_LEAVE) {
      jr(c);
      return;
    }
    if (!(a < F.DOCK1 || a > F.DOCK4)) {
      var g = a - F.DOCK1, w = c.dock[g], y = c.player;
      if (!(!w || !w.ok || c.scrap < w.cost)) {
        if (c.scrap -= w.cost, c.dockBuys[g]++, g === 0) y.lives++;
        else if (g === 1) y.bombs++;
        else if (g === 2) y.wlv++;
        else {
          var v = [];
          for (var I in j) y.mods[I] < j[I] && v.push("m_" + I);
          xi(c, c.rng2.pick(v)), N(c, "crate", { id: v.length ? "module" : "" });
        }
        N(c, "dockBuy", { item: g }), c.dock = go(c);
      }
    }
  }
  function wi(c) {
    var a = 2166136261, g = c.player;
    a = p(a, c.frame), a = p(a, c.score), a = p(a, c.scrap), a = p(a, g.x), a = p(a, g.y), a = p(a, g.lives), a = p(a, c.en.length), a = p(a, c.eb.length);
    for (var w = 0; w < c.en.length; w++)
      a = p(a, c.en[w].x), a = p(a, c.en[w].hp);
    return a = p(a, c.rng.state()), a = p(a, c.rng2.state()), a >>> 0;
  }
  function Ze(c, a, g, w, y, v) {
    var I = c.player, D = G(c), q = k(a.x, a.y, I.x, I.y), _ = g * D.bs;
    y = y || 1;
    for (var W = 0; W < y; W++) {
      var se = y === 1 ? 0 : -v / 2 + v * W / (y - 1), ae = L(q[0], q[1], se);
      Ge(c, a.x, a.y + a.r * 0.5, ae[0] * _, ae[1] * _, w);
    }
  }
  function Pt(c, a, g, w, y, v, I) {
    for (var D = y * G(c).bs, q = 0; q < w; q++) {
      var _ = L(0, 1, v + s * q / w);
      Ge(c, a, g, _[0] * D, _[1] * D, I);
    }
  }
  function gn(c, a, g) {
    if (a.fireT--, a.fireT > 0) return !1;
    var w = G(c);
    return a.fireT = Math.max(12, Math.floor(g / w.fire * (a.elite ? 0.7 : 1))), a.y > 10 && a.y < r - 140;
  }
  var mi = {
    dart: function(c, a) {
      a.age === 1 && (a.vy = 1.6, a.vx = 0), a.vy = Math.min(5.2, a.vy + 0.045), !a.s.shot && a.y > 110 && (c.sector >= 1 || c.wave >= 1 || a.elite || c.loop > 0) && (a.s.shot = !0, Ze(c, a, 2.8, "orb"));
    },
    weaver: function(c, a) {
      a.age === 1 && (a.s.bx = a.x), a.y += 1.05, a.x = a.s.bx + l(a.age * 0.045 + (a.phase || 0)) * 70, gn(c, a, 110) && Ze(c, a, 2.6, "orb", c.sector >= 2 ? 3 : 1, 0.3);
    },
    swarmer: function(c, a) {
      a.age === 1 && (a.vx = 2.7 * a.dir, a.vy = 0.2), a.vy = Math.min(3.2, a.vy + 0.028), a.vx *= 0.993, a.elite && gn(c, a, 90) && Ze(c, a, 2.6, "orb");
    },
    gunship: function(c, a) {
      a.age === 1 && (a.vy = 1.6, a.vx = 0), a.age < 1100 ? (a.y < a.ty ? a.vy = Math.max(0.4, (a.ty - a.y) * 0.04) : (a.vy = 0, a.vx === 0 && (a.vx = a.x < n / 2 ? 0.9 : -0.9)), (a.x < 40 && a.vx < 0 || a.x > n - 40 && a.vx > 0) && (a.vx = -a.vx)) : a.vy = Math.min(3, a.vy + 0.05), gn(c, a, 95) && Ze(c, a, 2.8, "orb", a.elite || c.sector >= 2 ? 5 : 3, a.elite ? 0.75 : 0.5);
    },
    splitter: function(c, a) {
      a.age === 1 && (a.vy = 0.95, a.s.bx = a.x), a.x = a.s.bx + l(a.age * 0.03) * 24, gn(c, a, 130) && Ze(c, a, 2.3, "big", 2, 0.35);
    },
    minelayer: function(c, a) {
      a.age === 1 && (a.vx = 1.25 * a.dir, a.vy = 0), a.age % Math.max(26, Math.floor(52 / G(c).fire)) === 0 && a.x > 20 && a.x < n - 20 && (Ge(c, a.x, a.y + 10, 0, 0.45, "mine", { fuse: 110 }), N(c, "mineDrop", { x: a.x, y: a.y }));
    },
    bearer: function(c, a) {
      a.age === 1 && (a.vy = 0.8), a.s.block && a.s.block--, gn(c, a, 140) && Pt(c, a.x, a.y, a.elite ? 12 : 8, 2.2, a.age * 0.1, "orb");
    },
    sniper: function(c, a) {
      a.age === 1 && (a.vy = 1.8), a.y < a.ty ? a.vy = Math.max(0.3, (a.ty - a.y) * 0.05) : a.vy = 0, a.age > 900 && (a.vy = -1.5);
      var g = a.s;
      if (g.aim > 0) {
        if (g.aim--, g.aim === 0) {
          var w = 7.2 * G(c).bs;
          if (Ge(c, a.x, a.y, g.ax * w, g.ay * w, "needle"), a.elite) {
            var y = L(g.ax, g.ay, 0.15), v = L(g.ax, g.ay, -0.15);
            Ge(c, a.x, a.y, y[0] * w, y[1] * w, "needle"), Ge(c, a.x, a.y, v[0] * w, v[1] * w, "needle");
          }
          N(c, "snipe", { x: a.x, y: a.y });
        }
      } else if (a.vy === 0 && gn(c, a, 150)) {
        var I = k(a.x, a.y, c.player.x, c.player.y);
        g.ax = I[0], g.ay = I[1], g.aim = 48;
      }
    },
    carrier: function(c, a) {
      if (a.age === 1 && (a.vy = 0.5, a.vx = 0), a.y >= 110 && a.age < 1400 && (a.vy = 0, a.vx === 0 && (a.vx = 0.4), (a.x < 70 || a.x > n - 70) && (a.vx = -a.vx)), a.age >= 1400 && (a.vy = 0.8), a.age % 140 === 70 && a.y > 40) {
        var g = Ut(c, "dart", a.x - 20, a.y + 10, !1), w = Ut(c, "dart", a.x + 20, a.y + 10, !1);
        g.hazard = w.hazard = !1, g.minion = w.minion = !0, N(c, "launch", { x: a.x, y: a.y });
      }
      gn(c, a, 200) && Pt(c, a.x, a.y, a.elite ? 16 : 10, 1.9, a.age * 0.05, "big");
    },
    turret: function(c, a) {
      a.age === 1 && (a.vy = 0.55), a.s.a = (a.s.a || 0) + 0.3;
      var g = Math.max(4, Math.floor(10 / G(c).fire));
      if (a.y > 20 && a.y < r - 160 && a.age % g === 0) {
        var w = 2.1 * G(c).bs, y = L(0, 1, a.s.a);
        Ge(c, a.x, a.y, y[0] * w, y[1] * w, "orb"), a.elite && Ge(c, a.x, a.y, -y[0] * w, -y[1] * w, "orb");
      }
    },
    mirror: function(c, a) {
      a.age === 1 && (a.vy = 0.7, a.s.bx = a.x), a.x = a.s.bx + l(a.age * 0.025) * 40;
      var g = a.age % 150;
      a.s.flashing = g < 55 && a.y > 0, gn(c, a, 140) && Ze(c, a, 2.4, "orb", 2, 0.25);
    },
    rock: function(c, a) {
      a.s.rot = (a.s.rot || 0) + (a.spin || 0.02), c.player.inv === 0 && c.overT === 0 && Zt(c, a) && (Ct(c), er(c, a, 99, !0));
    },
    pebble: function(c, a) {
      a.s.rot = (a.s.rot || 0) + 0.06, c.player.inv === 0 && c.overT === 0 && Zt(c, a) && (Ct(c), er(c, a, 99, !0));
    },
    crystal: function(c, a) {
      a.s.rot = (a.s.rot || 0) + 0.01, c.player.inv === 0 && c.overT === 0 && Zt(c, a) && Ct(c);
    }
  };
  function Zt(c, a) {
    var g = c.player, w = g.x - a.x, y = g.y - a.y, v = a.r * 0.8 + 3;
    return w * w + y * y < v * v;
  }
  function Si(c) {
    for (var a = c.en, g = a.length, w = 0; w < g; w++) {
      var y = a[w];
      if (!(y.dead || y.boss)) {
        y.age++, y.flash > 0 && y.flash--;
        var v = mi[y.t];
        v && v(c, y), !y.dead && (y.x += y.vx, y.y += y.vy, !y.hazard && c.player.inv === 0 && c.overT === 0 && Zt(c, y) && (Ct(c), er(c, y, 6, !0)), (y.y > r + 50 || y.y < -80 && y.age > 200 || y.x < -80 || y.x > n + 80) && (y.dead = !0));
      }
    }
    S(a, function(I) {
      return !I.dead || I.boss;
    });
  }
  function Ai(c, a) {
    var g = c.rng;
    if (a.t === "splitter")
      for (var w = -1; w <= 1; w += 2) {
        var y = Ut(c, "dart", a.x + w * 8, a.y, !1);
        y.age = 1, y.vx = w * 1.6, y.vy = 1.2;
      }
    else if (a.t === "rock")
      for (var v = -1; v <= 1; v += 2) {
        var I = Ut(c, "pebble", a.x + v * 6, a.y, !1);
        I.vx = v * g.range(0.8, 1.5), I.vy = a.vy + 0.3;
      }
    a.elite && c.sector + c.loop >= 1 && Pt(c, a.x, a.y, 8, 1.8, 0, "orb");
  }
  function Qt(c, a, g, w, y, v) {
    var I = {
      id: c.nextId++,
      t: "boss",
      boss: !0,
      x: a,
      y: g,
      vx: 0,
      vy: 0,
      r: w,
      hp: y,
      maxHp: y,
      age: 0,
      elite: !1,
      hazard: !1,
      invuln: !1,
      fireT: 0,
      dead: !1,
      dmgMul: 0,
      flash: 0,
      s: {}
    };
    if (v) for (var D in v) I[D] = v[D];
    return c.en.push(I), I;
  }
  function zr(c) {
    var a = U[c.sector].boss, g = G(c), w = z[a], y = w.hp * g.hp, v = { kind: a, name: w.name, t: 0, phase: 0, parts: [], hp: 0, maxHp: 0 };
    switch (c.boss = v, a) {
      case "warden":
        v.parts.push(Qt(c, n / 2, -60, 34, y, { hx: n / 2, hy: 130 }));
        break;
      case "hive":
        v.parts.push(Qt(c, n / 2, -70, 40, y, { hx: n / 2, hy: 140 })), v.open = !1;
        break;
      case "twins":
        v.parts.push(Qt(c, 100, -60, 24, y, { hx: 100, hy: 120, side: -1 })), v.parts.push(Qt(c, 260, -60, 24, y, { hx: 260, hy: 120, side: 1 })), v.enrageT = 0, v.enraged = !1;
        break;
      case "leviathan":
        v.hist = [];
        for (var I = 0; I < 12; I++) v.parts.push(Qt(c, n / 2, -40 - I * 16, I === 0 ? 24 : 17 - I * 0.4, y * (I === 0 ? 3 : 1), { seg: I }));
        break;
      case "prism":
        v.parts.push(Qt(c, n / 2, -70, 36, y, { hx: n / 2, hy: 170 })), v.ang = 0, v.beamsOn = !1, v.cycle = 0, v.beamRefs = [];
        break;
      case "signal":
        v.parts.push(Qt(c, n / 2, -80, 44, y, { hx: n / 2, hy: 150 })), v.a = 0, v.b = 0;
        break;
    }
    for (var D = 0; D < v.parts.length; D++) v.maxHp += v.parts[D].maxHp;
    v.hp = v.maxHp, N(c, "bossStart", { boss: a });
  }
  function xc(c) {
    for (var a = 0, g = 0; g < c.parts.length; g++) c.parts[g].dead || (a += Math.max(0, c.parts[g].hp));
    return c.hp = a, a / c.maxHp;
  }
  function Rr(c, a, g) {
    a.phase !== g && (a.phase = g, N(c, "bossPhase", { phase: g }));
  }
  function Vr(c, a, g) {
    return g < 110 ? (a.x += (a.hx - a.x) * 0.06, a.y += (a.hy - a.y) * 0.06, a.dmgMul = 0, !0) : !1;
  }
  function wc(c) {
    for (var a = c.boss, g = ++a.t, w = G(c), y = c.player, v = function(On) {
      return g % Math.max(3, Math.floor(On / w.fire)) === 0;
    }, I = 0; I < a.parts.length; I++) {
      var D = a.parts[I];
      D.age++, D.flash > 0 && D.flash--;
    }
    var q = xc(a), _ = a.parts[0];
    switch (a.kind) {
      case "warden": {
        if (Vr(a, _, g)) break;
        if (_.dmgMul = 1, _.x = _.hx + l((g - 110) * 0.012) * 95, Rr(c, a, q > 0.55 ? 0 : 1), a.phase === 0)
          v(52) && Ze(c, _, 2.8, "orb", 3, 0.36), v(140) && Pt(c, _.x, _.y, 14, 2, g * 0.05, "big");
        else {
          if (v(6)) {
            a.a = (a.a || 0) + 0.23;
            var W = L(0, 1, a.a), se = 2.4 * w.bs;
            Ge(c, _.x, _.y, W[0] * se, W[1] * se, "orb"), Ge(c, _.x, _.y, -W[0] * se, -W[1] * se, "orb");
          }
          v(95) && Ze(c, _, 3, "needle", 5, 0.6);
        }
        break;
      }
      case "hive": {
        if (Vr(a, _, g)) break;
        _.x = _.hx + l((g - 110) * 9e-3) * 60, Rr(c, a, q > 0.5 ? 0 : 1);
        var ae = a.phase === 0 ? 240 : 170, re = a.phase === 0 ? 150 : 130, Y = (g - 110) % (ae + re), Ue = Y >= ae;
        if (Ue !== a.open && (a.open = Ue, N(c, Ue ? "coreOpen" : "coreClose")), _.dmgMul = Ue ? 1 : 0.12, Ue)
          v(42) && Pt(c, _.x, _.y, 16, 2.1, Y % 2 * 0.2 + g * 0.01, "orb"), v(80) && Ze(c, _, 2.4, "big", 3, 0.5);
        else {
          if (Y % 120 === 20)
            for (var kt = (Y / 120 | 0) % 2 === 0, ft = 0; ft < 6; ft++) {
              var Ce = Ut(c, "swarmer", kt ? -16 : n + 16, 80 + ft * 4, !1);
              Ce.dir = kt ? 1 : -1, Ce.age = 0, Ce.fireT = 30 + ft * 9, Ce.x += (kt ? -1 : 1) * ft * 18, Ce.minion = !0;
            }
          a.phase === 1 && v(70) && Ze(c, _, 3.3, "needle", 3, 0.3);
        }
        break;
      }
      case "twins": {
        for (var Pe = [], ne = 0; ne < a.parts.length; ne++) a.parts[ne].dead || Pe.push(a.parts[ne]);
        for (ne = 0; ne < Pe.length; ne++) {
          var We = Pe[ne];
          if (!Vr(a, We, g)) {
            We.dmgMul = 1, We.x = We.hx + l((g - 110) * 0.02 + (We.side > 0 ? i : 0)) * 50, We.y = We.hy + l((g - 110) * 0.013) * 30;
            var Ie = a.enraged ? 0.55 : 1, Ot = We.side > 0 ? 75 : 0, Pn = Math.max(40, Math.floor(150 * Ie / w.fire));
            (g + Ot) % Pn === 0 && (c.beams.push({ x: y.x, y: We.y + 10, dx: 0, dy: 1, len: r, w: 24, warn: a.enraged ? 42 : 55, act: 28, age: 0 }), N(c, "beamWarn")), (g + Ot) % Math.max(20, Math.floor(70 * Ie / w.fire)) === 0 && Ze(c, We, 2.9, "orb", 3, 0.3);
          }
        }
        Pe.length === 1 && g > 110 && (a.enraged || (a.enrageT++, a.enrageT >= 600 && (a.enraged = !0, N(c, "enrage"), te(c, "ENRAGED", "Too slow", 90))));
        break;
      }
      case "leviathan": {
        var en = g, Ft = n / 2 + l(en * 0.018) * 130, Dn = (g < 110 ? -40 + g * 1.9 : 170) + (g < 110 ? 0 : l((en - 110) * 0.031) * 85);
        a.hist.push(Ft, Dn), a.hist.length > 2 * 12 * 9 + 4 && a.hist.splice(0, 2);
        var mt = -1;
        for (ne = a.parts.length - 1; ne >= 0; ne--) if (!a.parts[ne].dead) {
          mt = ne;
          break;
        }
        for (ne = 0; ne < a.parts.length; ne++) {
          var it = a.parts[ne];
          if (!it.dead) {
            var tt = a.hist.length - 2 - ne * 9 * 2;
            tt < 0 && (tt = 0), it.x = a.hist[tt], it.y = a.hist[tt + 1], it.dmgMul = g < 110 ? 0 : ne === mt ? 1 : 0, g > 110 && ne > 0 && (g + ne * 23) % Math.max(60, Math.floor(190 / w.fire)) === 0 && Ze(c, it, 2.6, "orb");
          }
        }
        if (g > 110 && !a.parts[0].dead) {
          var pn = a.parts[0];
          v(110) && Pt(c, pn.x, pn.y, mt <= 3 ? 18 : 10, 2, g * 0.07, "orb"), mt <= 3 && v(60) && Ze(c, pn, 3.2, "needle", 3, 0.3);
        }
        Rr(c, a, mt > 6 ? 0 : mt > 2 ? 1 : 2);
        break;
      }
      case "prism": {
        if (Vr(a, _, g)) break;
        _.dmgMul = 1, _.x = _.hx + l((g - 110) * 7e-3) * 50, Rr(c, a, q > 0.6 ? 0 : q > 0.25 ? 1 : 2);
        var St = 3 + a.phase;
        if (a.ang += 85e-4 * (a.phase === 2 ? 1.35 : 1), a.cycle++, !a.beamsOn && a.cycle >= 150) {
          for (a.beamsOn = !0, a.cycle = 0, a.beamRefs = [], ne = 0; ne < St; ne++) {
            var bn = { x: _.x, y: _.y, dx: 0, dy: 1, len: 900, w: 14, warn: 60, act: 380, age: 0, k: ne, n: St };
            c.beams.push(bn), a.beamRefs.push(bn);
          }
          N(c, "beamWarn");
        } else a.beamsOn && a.cycle >= 440 && (a.beamsOn = !1, a.cycle = 0, a.beamRefs = []);
        for (ne = 0; ne < a.beamRefs.length; ne++) {
          var ht = a.beamRefs[ne], tn = L(0, 1, a.ang + s * ht.k / ht.n);
          ht.x = _.x, ht.y = _.y, ht.dx = tn[0], ht.dy = tn[1];
        }
        a.beamsOn ? v(75) && Pt(c, _.x, _.y, 10, 1.7, g * 0.03, "orb") : (v(24) && Ze(c, _, 3, "orb", 5, 0.8), v(60) && Pt(c, _.x, _.y, 20, 2.2, g * 0.02, "big"));
        break;
      }
      case "signal": {
        if (Vr(a, _, g)) break;
        if (_.dmgMul = 1, Rr(c, a, q > 0.66 ? 0 : q > 0.33 ? 1 : 2), a.phase === 0) {
          if (_.x = _.hx + l((g - 110) * 0.01) * 70, v(5))
            for (a.a += 0.17, ne = 0; ne < 3; ne++) {
              var At = L(0, 1, a.a + s * ne / 3), kn = 2.2 * w.bs;
              Ge(c, _.x, _.y, At[0] * kn, At[1] * kn, "orb");
            }
          v(120) && Ze(c, _, 3.6, "needle", 3, 0.25);
        } else if (a.phase === 1) {
          _.x = _.hx + l((g - 110) * 0.014) * 100;
          var nr = 0;
          for (ne = 0; ne < c.en.length; ne++) c.en[ne].minion && !c.en[ne].dead && nr++;
          if (g % 400 === 0 && nr < 3) {
            var nn = Ut(c, "gunship", 60, -24, !0);
            nn.ty = 110, nn.minion = !0;
            var jt = Ut(c, "sniper", n - 60, -24, !0);
            jt.ty = 90, jt.minion = !0;
          }
          v(160) && (c.beams.push({ x: y.x, y: _.y + 20, dx: 0, dy: 1, len: r, w: 26, warn: 50, act: 26, age: 0 }), N(c, "beamWarn")), v(90) && Pt(c, _.x, _.y, 20, 2.1, g * 0.05, "orb");
        } else {
          if (_.x = _.hx + l((g - 110) * 0.02) * 110, _.y = _.hy + l((g - 110) * 0.017) * 40, v(4)) {
            a.a += 0.2, a.b -= 0.23;
            var rr = 2.6 * w.bs, sr = L(0, 1, a.a), Gr = L(0, 1, a.b);
            Ge(c, _.x, _.y, sr[0] * rr, sr[1] * rr, "orb"), Ge(c, _.x, _.y, Gr[0] * rr, Gr[1] * rr, "shard");
          }
          v(150) && Pt(c, _.x, _.y, 24, 1.8, g * 0.01, "big");
        }
        break;
      }
    }
    if (c.overT === 0 && y.inv === 0) {
      for (I = 0; I < a.parts.length; I++) if (!a.parts[I].dead && Zt(c, a.parts[I])) {
        Ct(c);
        break;
      }
    }
  }
  function mc(c, a) {
    var g = c.boss;
    if (g) {
      N(c, "bossPartDown", { x: a.x, y: a.y, r: a.r }), wt(c, 400 * (c.sector + 1), !0);
      var w = !0;
      if (g.kind === "leviathan") w = g.parts[0].dead;
      else for (var y = 0; y < g.parts.length; y++) g.parts[y].dead || (w = !1);
      if (g.kind === "leviathan" && a.seg === 0)
        for (var v = 0; v < g.parts.length; v++) g.parts[v].dead || (g.parts[v].dead = !0, N(c, "bossPartDown", { x: g.parts[v].x, y: g.parts[v].y, r: g.parts[v].r }));
      if (g.kind === "twins" && !w && !g.enraged && (g.enrageT = 0), !!w) {
        var I = c.sector + 1, D = wt(c, 5e3 * I, !1), q = wt(c, Math.max(0, 3600 - g.t) * 2 * I, !1);
        c.bossTimes.push(g.t), c.eb.length = 0, c.beams.length = 0;
        for (var _ = 0; _ < c.en.length; _++) c.en[_].minion && (c.en[_].dead = !0);
        for (var W = 0; W < 24; W++) yi(c, a.x, a.y, "scrap");
        N(c, "bossDead", { x: a.x, y: a.y, boss: g.kind, bonus: D + q }), te(c, g.name.toUpperCase() + " DESTROYED", "+" + (D + q), 150), c.boss = null, c.player.inv = Math.max(c.player.inv, 60);
      }
    }
  }
  var Ms = [65, 66, 51], vi = 2, Dt = 52, Sc = 65536, po = 60 * 60 * 60 * 3;
  function bo() {
    this.bytes = [], this.frames = 0, this.lastFrame = 0, this.pax = 0, this.pay = 0;
  }
  bo.prototype.push = function(c) {
    var a = h(c.ax | 0, -4, 4), g = h(c.ay | 0, -4, 4), w = (c.cmd | 0) & 255, y = this.frames++;
    if (!(a === this.pax && g === this.pay && w === 0)) {
      var v = y - this.lastFrame;
      this.lastFrame = y, Ac(this.bytes, v * 2 + (w ? 1 : 0)), this.bytes.push(a + 4 & 15 | (g + 4 & 15) << 4), w && this.bytes.push(w & 255), this.pax = a, this.pay = g;
    }
  };
  function Ac(c, a) {
    for (; a >= 128; )
      c.push(a & 127 | 128), a = Math.floor(a / 128);
    c.push(a);
  }
  function _s(c, a) {
    this.b = c, this.i = 0, this.frames = a, this.f = 0, this.next = -1, this.ax = 0, this.ay = 0, this.pending = null, this._read();
  }
  _s.prototype._read = function() {
    if (this.i >= this.b.length) {
      this.next = -1;
      return;
    }
    var c = 0, a = 1, g;
    do
      g = this.b[this.i++], c += (g & 127) * a, a *= 128;
    while (g & 128);
    var w = c % 2, y = (c - w) / 2, v = this.b[this.i++], I = { ax: (v & 15) - 4, ay: (v >> 4 & 15) - 4, cmd: w ? this.b[this.i++] : 0 };
    this.next = (this.pending ? this.pending.at : 0) + y, I.at = this.next, this.pending = I;
  }, _s.prototype.nextInput = function() {
    var c = 0;
    return this.pending && this.next === this.f && (this.ax = this.pending.ax, this.ay = this.pending.ay, c = this.pending.cmd, this.pending.at, this.i < this.b.length ? this._read() : (this.pending = null, this.next = -1)), this.f++, { ax: this.ax, ay: this.ay, cmd: c };
  };
  function Jt(c, a) {
    var g = new Uint8Array(Dt), w = new DataView(g.buffer);
    return g[0] = Ms[0], g[1] = Ms[1], g[2] = Ms[2], g[3] = vi, g.set(c.pilot, 4), g[24] = c.pilotVersion, g[25] = c.mode, w.setUint16(26, t, !0), w.setUint32(28, c.seed >>> 0, !0), w.setUint32(32, c.period >>> 0, !0), w.setUint32(36, a >>> 0, !0), w.setFloat64(40, c.score, !0), w.setUint32(48, wi(c), !0), g;
  }
  function yo(c) {
    if (!c || c.length < Dt) throw new Error("Replay too short");
    if (c[0] !== 65 || c[1] !== 66 || c[2] !== 51) throw new Error("Not an Astro Blaster 3 replay");
    if (c[3] !== vi) throw new Error("Unsupported replay format " + c[3]);
    var a = new DataView(c.buffer, c.byteOffset, c.byteLength);
    return {
      format: c[3],
      pilot: c.slice(4, 24),
      pilotVersion: c[24],
      mode: c[25],
      engine: a.getUint16(26, !0),
      seed: a.getUint32(28, !0),
      period: a.getUint32(32, !0),
      frames: a.getUint32(36, !0),
      score: a.getFloat64(40, !0),
      hash: a.getUint32(48, !0)
    };
  }
  function xo(c, a) {
    var g = a === "compress" ? new CompressionStream("deflate-raw") : new DecompressionStream("deflate-raw"), w = new Blob([c]).stream().pipeThrough(g);
    return new Response(w).arrayBuffer().then(function(y) {
      return new Uint8Array(y);
    });
  }
  function vc(c, a) {
    var g = Jt(c, a.frames);
    return xo(new Uint8Array(a.bytes), "compress").then(function(w) {
      var y = new Uint8Array(g.length + w.length);
      return y.set(g, 0), y.set(w, g.length), y;
    });
  }
  function wo(c) {
    var a = yo(c);
    return xo(c.subarray(Dt), "decompress").then(function(g) {
      return { header: a, body: g };
    });
  }
  function mo(c) {
    var a = c.header, g = R({ mode: a.mode, seed: a.seed, period: a.period, pilot: a.pilot, pilotVersion: a.pilotVersion });
    return { st: g, reader: new _s(c.body, a.frames), header: a };
  }
  function tr(c, a) {
    if (!c || !a || c.length !== 20 || a.length !== 20) return !1;
    for (var g = 0; g < 20; g++) if (c[g] !== a[g]) return !1;
    return !0;
  }
  function Ec(c, a) {
    return a = a || {}, wo(c).then(function(g) {
      var w = g.header, y = function(_) {
        return { ok: !1, reason: _, header: w, score: null, frames: w.frames };
      };
      if (w.engine !== t) return y("engine version " + w.engine + " (this engine is " + t + ")");
      if (w.frames < 1 || w.frames > po) return y("run length out of range");
      if (a.mode != null && w.mode !== a.mode) return y("mode mismatch");
      if (w.mode === M && a.period != null && w.period !== a.period) return y("daily period mismatch");
      if (a.pilot && !tr(a.pilot, w.pilot)) return y("flown by a different wallet");
      var v = mo(g), I = 0, D = a.chunk || 0;
      function q() {
        for (var _ = D ? Math.min(w.frames, I + D) : w.frames; I < _; I++) {
          if (v.st.phase === "over") return y("input continues after game over");
          C(v.st, v.reader.nextInput());
        }
        if (I < w.frames) return new Promise(function(re) {
          setTimeout(re, 0);
        }).then(q);
        var W = v.st.score, se = wi(v.st), ae = W === w.score && se === w.hash && (a.score == null || a.score === W);
        return {
          ok: ae,
          score: W,
          frames: w.frames,
          header: w,
          over: v.st.phase === "over",
          reason: ae ? "" : W !== w.score ? "score mismatch" : se !== w.hash ? "state mismatch" : "claimed score mismatch"
        };
      }
      return q();
    });
  }
  function Ic(c) {
    for (var a = "", g = 0; g < c.length; g++) a += String.fromCharCode(c[g]);
    return btoa(a).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function $c(c) {
    for (c = c.replace(/-/g, "+").replace(/_/g, "/"); c.length % 4; ) c += "=";
    for (var a = atob(c), g = new Uint8Array(a.length), w = 0; w < a.length; w++) g[w] = a.charCodeAt(w);
    return g;
  }
  function Cc(c, a) {
    a = a || {};
    var g = c.player;
    if (c.phase === "cards") {
      for (var w = ["repair", "wlv", "m_drone", "m_shield", "m_over", "m_bomb", "m_after", "m_graze", "m_chain", "m_magnet"], y = 0, v = 999, I = 0; I < c.cards.length; I++) {
        var D = c.cards[I].id, q = w.indexOf(D);
        D === "repair" && g.lives > 2 && (q = 50), q < 0 && (q = D.indexOf("w_") === 0 ? a.weapon && D === "w_" + a.weapon ? -1 : 60 : 40), q < v && (v = q, y = I);
      }
      return { ax: 0, ay: 0, cmd: F.CARD1 + y };
    }
    if (c.phase === "dock") {
      for (var _ = [g.lives < 4 ? 0 : -1, 2, 3, 1, 0], W = 0; W < _.length; W++) {
        var se = _[W];
        if (!(se < 0)) {
          var ae = c.dock[se];
          if (ae && ae.ok && c.scrap >= ae.cost) return { ax: 0, ay: 0, cmd: F.DOCK1 + se };
        }
      }
      return { ax: 0, ay: 0, cmd: F.DOCK_LEAVE };
    }
    if (c.phase !== "play" || c.overT > 0) return { ax: 0, ay: 0, cmd: 0 };
    for (var re = 3.4, Y = 0; Y < g.mods.after; Y++) re *= 1.12;
    for (var Ue = n / 2, kt = r - 130, ft = 1e9, Ce = 0; Ce < c.en.length; Ce++) {
      var Pe = c.en[Ce];
      if (!(Pe.dead || Pe.hazard || Pe.y < 0 || Pe.dmgMul === 0)) {
        var ne = Math.abs(Pe.x - g.x) + Math.max(0, Pe.y - 300);
        ne < ft && (ft = ne, Ue = Pe.x);
      }
    }
    for (var We = [], Ie = 0; Ie < c.eb.length; Ie++) {
      var Ot = c.eb[Ie];
      Math.abs(Ot.x - g.x) < 170 && Math.abs(Ot.y - g.y) < 190 && We.push(Ot);
    }
    var Pn = [];
    for (Ce = 0; Ce < c.en.length; Ce++) {
      var en = c.en[Ce];
      !en.dead && Math.abs(en.x - g.x) < 150 && Math.abs(en.y - g.y) < 190 && Pn.push(en);
    }
    for (var Ft = null, Dn = 1e18, mt = 0, it = -4; it <= 4; it += 4)
      for (var tt = -4; tt <= 4; tt += 4) {
        var pn = it / 4 * re, St = tt / 4 * re;
        it !== 0 && tt !== 0 && (pn *= 0.7071, St *= 0.7071);
        for (var bn = 0, ht = 0, tn = 1; tn <= 4; tn++) {
          var At = tn * 3, kn = h(g.x + pn * At, 12, n - 12), nr = h(g.y + St * At, 70, r - 24);
          for (Ie = 0; Ie < We.length; Ie++) {
            var nn = We[Ie], jt = nn.x + nn.vx * At, rr = nn.y + nn.vy * At, sr = jt - kn, Gr = rr - nr, On = sr * sr + Gr * Gr, Ei = nn.r + 7;
            On < Ei * Ei ? ht += (5 - tn) * 1e3 : On < 1600 && (bn += 60 / On * (5 - tn));
          }
          for (Ie = 0; Ie < Pn.length; Ie++) {
            var Kr = Pn[Ie], Lc = Kr.x + Kr.vx * At, So = Kr.y + Kr.vy * At, Ao = Kr.r + 10, Wr = Lc - kn, vo = So - nr;
            Wr * Wr + vo * vo < Ao * Ao && (ht += (5 - tn) * 800);
          }
          for (Ie = 0; Ie < c.beams.length; Ie++) {
            var nt = c.beams[Ie];
            if (!(nt.age + At < nt.warn - 2 || nt.age + At > nt.warn + nt.act)) {
              var Eo = kn - nt.x, Io = nr - nt.y, b = Eo * nt.dx + Io * nt.dy;
              if (b > 0) {
                var $ = Eo - nt.dx * b, T = Io - nt.dy * b;
                $ * $ + T * T < (nt.w / 2 + 10) * (nt.w / 2 + 10) && (ht += 900);
              }
            }
          }
          for (Ie = 0; Ie < c.lanes.length; Ie++) {
            var X = c.lanes[Ie];
            X.age + At >= X.warn - 4 && Math.abs(kn - X.x) < X.w / 2 + 8 && (ht += 900);
          }
        }
        var Ye = h(g.x + pn * 6, 12, n - 12), Qe = h(g.y + St * 6, 70, r - 24);
        bn += Math.abs(Ye - Ue) * 0.03 + Math.abs(Qe - kt) * 0.02 + ht, Qe < 250 && (bn += (250 - Qe) * 0.2), bn < Dn && (Dn = bn, Ft = [it, tt], mt = ht);
      }
    var zt = 0;
    return mt >= 3e3 && g.inv === 0 && g.bombs > 0 && !a.noBomb && (zt = F.BOMB), { ax: Ft[0], ay: Ft[1], cmd: zt };
  }
  e.AB3 = { ENGINE_VERSION: t, W: n, H: r, TAU: s, dsin: l, dcos: u, makeRng: f, fnv1a: x, dailySeed: A, SECTORS: U, ENEMIES: m, WEAPONS: H, WEAPON_NAMES: B, MODULE_MAX: j, MODULE_INFO: Q, BOSSES: z, CMD: F, MODE_CAMPAIGN: E, MODE_DAILY: M, createGame: R, step: C, stateHash: wi, diff: G, chainMult: Xt, loopMult: $t, grazeRadius: Hs, Recorder: bo, InputReader: _s, encodeReplay: vc, decodeReplay: wo, verifyReplay: Ec, replaySession: mo, readHeader: yo, toBase64Url: Ic, fromBase64Url: $c, REPLAY_MAX_BYTES: Sc, REPLAY_HEADER: Dt, REPLAY_MAX_FRAMES: po, botInput: Cc };
})(typeof globalThis < "u" ? globalThis : void 0);
const is = {
  address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
  name: "xtrata-arcade-scores-v2"
}, JA = `${is.address}.${is.name}`, ev = ["astro3", "astro3-daily"], Th = 65536, tv = /^[A-Za-z0-9 _.-]{3,12}$/, Gn = globalThis.AB3, yu = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function nv(e) {
  const t = Gn.readHeader(e), n = t.pilotVersion === 20 ? 20 : 22;
  return Yl(Mi(n, yu(t.pilot)));
}
function xu(e, t) {
  try {
    return Ls(t).hash160 === yu(Gn.readHeader(e).pilot);
  } catch {
    return !1;
  }
}
class Je extends Error {
}
function Nh(e) {
  if (!/^[A-Za-z0-9_-]*$/.test(e)) throw new Je("The submit link is damaged.");
  return Gn.fromBase64Url(e);
}
function rv(e) {
  let t;
  if (typeof e == "string") {
    const h = /(?:^|[#&])p=([A-Za-z0-9_-]+)/.exec(e);
    if (!h) throw new Je("No score was attached to this link. Finish a run in Astro Blaster 3 and press Submit again.");
    try {
      t = JSON.parse(new TextDecoder().decode(Nh(h[1])));
    } catch (d) {
      throw d instanceof Je ? d : new Je("The submit link is damaged.");
    }
  } else t = e;
  if (!t || typeof t != "object") throw new Je("The submit link is damaged.");
  if (t.v !== 1 || t.game !== "astro-blaster-3") throw new Je("This link is not an Astro Blaster 3 score.");
  if (t.contract !== JA) throw new Je("This score is for a different leaderboard contract.");
  if (t.network !== "mainnet") throw new Je("This score is not for mainnet.");
  const n = t.board;
  if (typeof n != "string" || !ev.includes(n)) throw new Je("Unknown leaderboard.");
  const r = t.period, s = t.score, i = t.name, o = t.replay;
  if (typeof r != "number" || !Number.isSafeInteger(r) || r < 0) throw new Je("Invalid board period.");
  if (typeof s != "number" || !Number.isSafeInteger(s) || s <= 0) throw new Je("Invalid score.");
  if (typeof i != "string" || !tv.test(i)) throw new Je("Names are 3–12 letters, numbers, spaces, dots, dashes or underscores.");
  if (typeof o != "string" || !o) throw new Je("The replay is missing.");
  const l = Nh(o);
  if (l.length === 0 || l.length > Th) throw new Je(`The replay must be 1–${Th} bytes.`);
  if (n === "astro3" && r !== 0) throw new Je("Invalid board period.");
  let u;
  try {
    u = nv(l);
  } catch {
    throw new Je("The replay is not an Astro Blaster 3 run from this version.");
  }
  if (/^S[PM]0{20,}/.test(u) || yu(Gn.readHeader(l).pilot) === "0".repeat(40))
    throw new Je("This was a practice run with no pilot, so it cannot be submitted.");
  return { board: n, period: r, claimedScore: s, name: i, replay: l, pilot: u };
}
async function sv(e) {
  let t;
  try {
    t = Gn.readHeader(e.replay);
  } catch {
    return { ok: !1, reason: "The replay is not an Astro Blaster 3 run." };
  }
  if (t.engine !== Gn.ENGINE_VERSION)
    return { ok: !1, reason: `This run was recorded with engine v${t.engine}; this page verifies v${Gn.ENGINE_VERSION}.` };
  const n = e.board === "astro3-daily";
  if (n !== (t.mode === Gn.MODE_DAILY)) return { ok: !1, reason: "The run mode does not match the chosen board." };
  if (n && t.period !== e.period) return { ok: !1, reason: "The run is for a different day." };
  const r = await Gn.verifyReplay(e.replay, { score: e.claimedScore, period: n ? e.period : null, mode: t.mode, chunk: 8e3 });
  return r.ok ? { ok: !0, score: r.score, frames: r.frames } : { ok: !1, reason: `The replay did not reproduce this score (${r.reason}).` };
}
function iv(e, t, n, r) {
  if (!js(n) || !n.startsWith("SP") && !n.startsWith("SM")) throw new Error("Connect a mainnet wallet.");
  if (!xu(e.replay, n)) throw new Error(`This run was flown as ${e.pilot}. Connect that wallet to submit it.`);
  if (!r.enabled) throw new Error("This leaderboard is closed.");
  if (BigInt(t) > r.maxScore) throw new Error("This score is above the leaderboard limit.");
  const s = r.fee > 0n ? [gA(n).willSendEq(r.fee).ustx()] : [];
  return {
    contractAddress: is.address,
    contractName: is.name,
    functionName: "submit-score",
    functionArgs: [Ba(e.board), La(e.period), La(t), Ba(e.name), dA(e.replay)],
    network: "mainnet",
    stxAddress: n,
    sponsored: !1,
    postConditionMode: ei.Deny,
    postConditions: s
  };
}
const Uh = {
  101: "The leaderboard is paused.",
  102: "This leaderboard does not exist yet.",
  103: "This leaderboard is closed.",
  104: "This score is outside the allowed range.",
  105: "That name is not allowed.",
  106: "That day’s board has closed.",
  107: "The replay is empty.",
  108: "You already have an equal or better score on this board.",
  109: "This score is no longer in the Top 10.",
  113: "This run was flown for a different wallet.",
  114: "This wallet is barred from this leaderboard."
}, ov = ["/hiro/mainnet", "https://api.mainnet.hiro.so"];
function av(e) {
  if (typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function") return AbortSignal.timeout(e);
  if (typeof AbortController > "u") return;
  const t = new AbortController();
  return setTimeout(() => t.abort(), e), t.signal;
}
async function wu(e, t) {
  const n = JSON.stringify({ sender: is.address, arguments: t.map((s) => j6(s)) });
  let r;
  for (const s of ov)
    try {
      const i = await fetch(`${s}/v2/contracts/call-read/${is.address}/${is.name}/${e}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: n,
        signal: av(12e3)
      });
      if (!i.ok) throw new Error("HTTP " + i.status);
      const o = await i.json();
      if (!o.okay) throw new Error(o.cause || "read failed");
      return ia(z6(o.result), !0);
    } catch (i) {
      r = i;
    }
  throw r instanceof Error ? r : new Error("Could not reach the Stacks API");
}
async function cv(e) {
  const t = await wu("get-board", [Ba(e)]);
  if (!t || !t.value) throw new Error("This leaderboard does not exist yet.");
  const n = t.value;
  return { fee: BigInt(String(n.fee.value)), enabled: !!n.enabled.value, maxScore: BigInt(String(n["max-score"].value)) };
}
async function lv(e) {
  if (e.board !== "astro3-daily") return !1;
  try {
    const t = Number(await wu("current-period", []));
    return e.period !== t && e.period + 1 !== t;
  } catch {
    return !1;
  }
}
async function uv(e, t, n) {
  try {
    return Number(await wu("preview-rank", [Ba(e.board), La(e.period), La(t), Gg(n)]));
  } catch {
    return null;
  }
}
const fv = {
  "provider-selected": "Wallet selected. Preparing the request…",
  "account-read": "Checking the active wallet account. Nothing has been signed yet…",
  "account-cached": "Wallet account confirmed. Preparing the transaction…",
  "account-read-failed": "The wallet did not share its account. Trying its connection flow…",
  "account-reconnect": "Waiting for your wallet to confirm account access. Check the extension.",
  "signing-request": "Approve the transaction in your wallet. Check the network fee before signing.",
  "legacy-request": "Wallet popup requested. Check your extension and popup permissions."
};
class Bp extends Error {
}
function hv(e, t, n) {
  return new Promise((r, s) => e({
    ...t,
    onProgress: (i) => n(fv[i] ?? "Waiting for your wallet…"),
    onFinish: (i) => {
      const o = String((i == null ? void 0 : i.txId) || (i == null ? void 0 : i.txid) || "");
      if (!/^(0x)?[0-9a-f]{64}$/i.test(o)) {
        s(new Error("The wallet did not return a transaction ID. Check your wallet history before trying again."));
        return;
      }
      r(o.startsWith("0x") ? o : "0x" + o);
    },
    onCancel: () => s(new Bp("Cancelled. Nothing was sent.")),
    onError: (i) => s(i)
  }));
}
function dv(e) {
  const t = String((e == null ? void 0 : e.message) || ""), n = /\(err u(\d+)\)/.exec(t);
  return n && Uh[+n[1]] ? Uh[+n[1]] : t || "The wallet request failed.";
}
const uc = QA({ appName: "Xtrata Arcade", appIcon: "/favicon.svg" }), Yn = (e) => document.getElementById(e), Rn = (e, t) => {
  Yn(e).textContent = t;
}, Yt = (e, t = "") => {
  const n = Yn("status");
  n.textContent = e, n.className = "status " + t;
}, Ph = (() => {
  const e = /[#&]id=([A-Za-z0-9-]{1,64})/.exec(location.hash);
  return e ? e[1] : "";
})();
let qt = null, ws = null, ns = null, Gt = null, Wn = !1, Ta = "", Hp = !1;
async function gv(e) {
  Hp = await lv(e);
}
async function Mp(e) {
  if (!qt || ws == null) return;
  if (!xu(qt.replay, e)) {
    Gt = null, Ln();
    return;
  }
  Gt = null, Ln();
  const t = await uv(qt, ws, e);
  Gt = t === null ? { ok: !1 } : { ok: !0, value: t }, Ln();
}
function tl(e) {
  return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function pv(e) {
  return `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0")}`;
}
function Ln() {
  const e = uc.getSession(), t = e.isConnected && !!e.address, n = t && e.network !== "testnet" && /^S[PM]/.test(e.address || "");
  Rn("wallet", t ? `Wallet: ${e.address}` : "No wallet connected."), Yn("connect").textContent = t ? "Switch wallet" : "Connect wallet", Yn("connect").disabled = Wn || !!Ta || !qt || ws == null;
  let r = !!qt && ws != null && !!ns && n && !Wn && !Ta, s = "";
  t && !n ? (s = "Switch your wallet to a mainnet account.", r = !1) : t && qt && !xu(qt.replay, e.address) ? (s = `This run was flown as ${qt.pilot}. Connect that wallet to submit it.`, r = !1) : Hp ? (s = "That day’s board has closed. Daily scores must be submitted the same Bitcoin day or the next.", r = !1) : t && Gt === null ? (s = "Checking your rank on-chain…", r = !1) : Gt && Gt.ok && Gt.value === 0 ? (s = "The contract would refuse this score right now: it is not in the Top 10, or you already hold an equal or better entry.", r = !1) : Gt && Gt.ok ? s = `This run takes rank #${Gt.value}.` : Gt && !Gt.ok && (s = "Could not check your rank right now. You can still submit; the contract checks again before anything is charged."), Rn("rank", s), ns && Rn("fee", ns.fee > 0n ? `Entry fee: ${pv(ns.fee)} STX plus the network fee.` : "No entry fee. You pay only the network fee shown by your wallet."), Yn("submit").disabled = !r;
}
async function bv() {
  try {
    qt = rv(location.hash);
  } catch (r) {
    Yt(r instanceof Je ? r.message : "The submit link is damaged.", "err"), Yn("run").hidden = !0;
    return;
  }
  const e = qt;
  Rn("rBoard", e.board === "astro3-daily" ? `Daily run · day ${e.period}` : "Campaign"), Rn("rName", e.name), Rn("rPilot", e.pilot), Rn("rClaimed", tl(e.claimedScore)), Rn("rBytes", `${tl(e.replay.length)} bytes`), Yt("Replaying your run to confirm the score…"), Ln(), await new Promise((r) => setTimeout(r, 30));
  const t = await sv(e);
  if (!t.ok) {
    Yt(t.reason + " This run cannot be submitted.", "err"), Ln();
    return;
  }
  ws = t.score, Rn("rVerified", `${tl(t.score)} ✓`), Yt("Run verified. Connect your wallet to submit it.", "ok");
  try {
    ns = await cv(e.board);
  } catch (r) {
    Yt(r instanceof Error ? r.message : "Could not read the leaderboard.", "err");
  }
  await gv(e);
  const n = uc.getSession();
  n.isConnected && n.address && await Mp(n.address), Ln();
}
Yn("connect").onclick = async () => {
  if (!Wn) {
    Wn = !0, Ln();
    try {
      const e = await uc.connect();
      Wn = !1, e.isConnected && e.address && await Mp(e.address);
    } catch (e) {
      Yt(e instanceof Error ? e.message : "Wallet connection failed.", "err");
    } finally {
      Wn = !1, Ln();
    }
  }
};
Yn("submit").onclick = async () => {
  if (!qt || ws == null || !ns || Wn || Ta) return;
  const e = uc.getSession();
  if (!e.address) return;
  let t;
  try {
    t = iv(qt, ws, e.address, ns);
  } catch (s) {
    Yt(s instanceof Error ? s.message : String(s), "err");
    return;
  }
  Wn = !0, Ln(), Yt("Opening your wallet…");
  const n = Date.now(), r = setInterval(() => Yt(`Still waiting for your wallet (${Math.round((Date.now() - n) / 1e3)} s). Check the extension. Do not submit twice.`), 3e4);
  try {
    const s = await hv(ZA, t, (o) => Yt(o));
    Ta = s;
    const i = document.createElement("a");
    i.href = `https://explorer.hiro.so/txid/${s}?chain=mainnet`, i.target = "_blank", i.rel = "noopener", i.textContent = "View the transaction", Yt("Submitted. Your score appears on the board once the transaction confirms (usually a few minutes). ", "ok"), Yn("status").append(i), Dh({ txId: s });
  } catch (s) {
    const i = s instanceof Bp, o = i ? s.message : dv(s);
    Yt(o, i ? "" : "err"), Dh(i ? { cancelled: !0 } : { error: o });
  } finally {
    clearInterval(r), Wn = !1, Ln();
  }
};
function Dh(e) {
  var t;
  if (Ph)
    try {
      (t = window.opener) == null || t.postMessage({ type: "xtrata:arcade:submit-result", id: Ph, ...e }, location.origin);
    } catch {
    }
}
bv();
const yv = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", xv = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), i = /CriOS/.exec(t.userAgent), o = t.userAgent.includes("Mobile");
  return i ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, wv = () => xv() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, mv = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Sv = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', _p = class {
  constructor(e) {
    J4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && C1(e), this.callback(Ka(e));
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
  getBrowserUrl(e) {
    var t;
    return (t = e.chromeWebStoreUrl) !== null && t !== void 0 ? t : e.mozillaAddOnsUrl;
  }
  getMobileUrl(e) {
    var t;
    return (t = e.iOSAppStoreUrl) !== null && t !== void 0 ? t : e.googlePlayStoreUrl;
  }
  getInstallUrl(e, t, n) {
    var r, s, i, o, l, u, h, d, f, x;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (o = (i = e.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Firefox" ? (u = (l = e.mozillaAddOnsUrl) !== null && l !== void 0 ? l : this.getMobileUrl(e)) !== null && u !== void 0 ? u : e.webUrl : n === "Android" ? (d = (h = e.googlePlayStoreUrl) !== null && h !== void 0 ? h : this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl : (x = (f = this.getBrowserUrl(e)) !== null && f !== void 0 ? f : e.webUrl) !== null && x !== void 0 ? x : this.getMobileUrl(e);
  }
  render() {
    const e = wv(), t = mv(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return oe("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, oe("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), oe("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, oe("div", { class: "flex flex-col space-y-[10px]" }, oe("div", { class: "flex items-center" }, oe("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), oe("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, oe("span", { class: "sr-only" }, "Close popup"), oe("img", { src: yv }))), r ? oe("p", null, "Select the wallet you want to connect to.") : oe("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && oe("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && oe("div", { class: "mt-6" }, oe("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), oe("ul", { class: "space-y-3" }, this.installedProviders.map((i) => oe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, oe("div", { class: "aspect-square basis-9 overflow-hidden" }, oe("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), oe("div", { class: "flex-1" }, oe("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && oe("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), oe("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && oe("div", { class: "mt-6" }, r ? oe("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : oe("div", { class: "mb-5 flex justify-between" }, oe("p", { class: "text-sm font-medium" }, "Recommended wallets"), oe("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, oe("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, oe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), oe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), oe("p", null, "What is a wallet? ", oe("span", { class: "align-text-bottom text-[9px]" }, "↗")))), oe("ul", { class: "space-y-3" }, n.map((i) => oe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, oe("div", { class: "aspect-square basis-9 overflow-hidden" }, oe("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), oe("div", { class: "flex-1" }, oe("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && oe("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, e, t) && oe("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, e, t), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return N4(this);
  }
};
_p.style = Sv;
const Av = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: _p
}, Symbol.toStringTag, { value: "Module" }));
