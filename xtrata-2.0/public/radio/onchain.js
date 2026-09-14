var F1 = Object.defineProperty;
var j1 = (t, e, n) => e in t ? F1(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Qo = (t, e, n) => j1(t, typeof e != "symbol" ? e + "" : e, n);
function z1(t, e) {
  try {
    const n = e ?? globalThis.localStorage, r = new Set(Array.from(t, String));
    if (!r.size) return 0;
    const s = JSON.parse(n.getItem("xtrata.radio.likes") || "[]");
    if (!Array.isArray(s)) return 0;
    const i = s.filter((a) => !a || a.tokenId == null || !r.has(String(a.tokenId))), o = s.length - i.length;
    return o && (i.length ? n.setItem("xtrata.radio.likes", JSON.stringify(i)) : n.removeItem("xtrata.radio.likes")), o;
  } catch {
    return 0;
  }
}
const R1 = ["SP", "SM"], V1 = ["ST", "SN"], Ec = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return R1.includes(n) ? "mainnet" : V1.includes(n) ? "testnet" : null;
}, G1 = () => {
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
}, K1 = () => typeof window > "u" || !window.localStorage ? G1() : window.localStorage, Jo = "xtrata.v15.1.wallet.session", lu = "mainnet", Di = { isConnected: !1 }, W1 = (t) => t.address ? Ec(t.address) ?? t.network : t.network, xh = (t) => !t.isConnected || !t.address ? { ...Di } : W1(t) !== lu ? { ...Di } : {
  isConnected: !0,
  address: t.address,
  network: lu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, q1 = (t) => {
  if (!t)
    return { ...Di };
  try {
    const e = JSON.parse(t);
    return xh(e);
  } catch {
    return { ...Di };
  }
}, Y1 = (t) => {
  const e = xh(t);
  return JSON.stringify(e);
}, X1 = (t) => {
  const e = K1();
  return {
    load: () => q1(e.getItem(Jo)),
    save: (n) => {
      e.setItem(Jo, Y1(n));
    },
    clear: () => {
      e.removeItem(Jo);
    }
  };
};
function Z1(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function Q1(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${Z1(r)}`;
  let i = 2166136261, o = 522970236;
  for (let c = 0; c < s.length; c += 1) {
    const u = s.charCodeAt(c);
    i = Math.imul(i ^ u, 16777619), o = Math.imul(o ^ (u << 5 | u >>> 3), 16777619);
  }
  const a = (c) => (c >>> 0).toString(16).padStart(8, "0");
  return (a(i) + a(o)).slice(0, 16);
}
function mh(t) {
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
function J1(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const ta = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function t2(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = ta(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = ta(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = ta(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function e2(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = mh(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const n2 = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", r2 = 20, uu = "xt_tel_sid";
function ki() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let ea = null;
function s2() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(uu);
      return t || (t = ki(), sessionStorage.setItem(uu, t)), t;
    }
  } catch {
  }
  return ea || (ea = ki()), ea;
}
let Br = {
  address: null,
  kind: null
}, Sh = null;
function Ic(t, e) {
  if (!t) {
    Br = { address: null, kind: e ?? Br.kind };
    return;
  }
  Br = { address: t.trim(), kind: e ?? Br.kind };
}
function $c(t) {
  Sh = typeof t == "string" && t.length > 0 ? t : null;
}
const fu = [];
class i2 {
  constructor(e, n) {
    Qo(this, "id", ki());
    Qo(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function o2(t, e) {
  return new i2(t, e);
}
function ws(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? mh(t.error) : void 0, i = t.error != null ? J1(t.error) : void 0, o = r ? Q1(n, t.step, t.errorCode, s ?? "") : void 0, a = r ? t2(t.error) : void 0, c = {
      ...a ? { error: a } : {},
      ...t.context ?? {}
    };
    r && fu.length && (c.breadcrumbs = fu.slice(-r2));
    const u = {
      eventId: ki(),
      ts: Date.now(),
      sessionId: s2(),
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
      appVersion: n2,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Br.address,
      walletKind: Br.kind,
      network: Sh,
      context: Object.keys(c).length ? c : void 0
    };
  } catch {
  }
}
const a2 = "https://browser.blockstack.org/auth", c2 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ah = ["store_write"], l2 = "blockstack-session", u2 = {
  logLevel: "debug"
}, hr = {
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
Object.freeze(hr);
class rs extends Error {
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
class f2 extends rs {
  constructor(e, n = "") {
    super({ code: hr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class hu extends rs {
  constructor(e = "") {
    super({ code: hr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ri extends rs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: hr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class du extends rs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: hr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class $a extends rs {
  constructor(e) {
    super({ code: hr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Eh extends rs {
  constructor(e) {
    super({ code: hr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const gu = ["debug", "info", "warn", "error", "none"], Ca = {};
for (let t = 0; t < gu.length; t++) {
  const e = gu[t];
  Ca[e] = t;
}
class Hr {
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
    return Ca[u2.logLevel] <= Ca[e];
  }
}
function h2() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function d2() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function na(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function g2() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function p2() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function b2(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Cc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = p2(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Hr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = b2(s, t.toString(), n);
    throw Hr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function _n(t, e) {
  return vc(Pt(t), e);
}
function Pt(t) {
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
  if (Yt(t, Uint8Array))
    return BigInt(`0x${z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function y2(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function pu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ds(t, e = 8) {
  return (typeof t == "bigint" ? t : Pt(t)).toString(16).padStart(e * 2, "0");
}
function fo(t) {
  return parseInt(t, 16);
}
function vc(t, e = 16) {
  const n = Ds(t, e);
  return st(n);
}
function w2(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function x2(t, e) {
  return t & BigInt(1) << e;
}
function va(t) {
  return m2(BigInt(`0x${z(t)}`), BigInt(t.byteLength * 8));
}
function m2(t, e) {
  return x2(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const S2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += S2[n];
  return e;
}
function st(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = y2(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function dr(t) {
  return new TextEncoder().encode(t);
}
function ks(t) {
  return new TextDecoder().decode(t);
}
function A2(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function E2(t) {
  return String.fromCharCode.apply(null, t);
}
function I2(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function bu(t) {
  if (t.some(I2))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function He(...t) {
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
  return He(...t.map((e) => typeof e == "number" ? bu([e]) : e instanceof Array ? bu(e) : e));
}
function Yt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Ih = "https://api.mainnet.hiro.so", $h = "https://api.testnet.hiro.so", Ch = "http://localhost:3999", $2 = "https://hub.blockstack.org", C2 = 33, ra = 32;
function v2(t) {
  if (t.length < ra * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ra * 2), r = t.slice(2 + ra * 2);
  return {
    recoveryId: fo(e),
    r: n,
    s: r
  };
}
function Lc(t) {
  const e = typeof t == "string" ? st(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function L2(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function B2(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function H2(t, e) {
  return t[e];
}
function _2(t, e, n = 0) {
  return t[n] = e, t;
}
function M2(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Xn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const U2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function N2(t, e) {
  const n = {};
  return Object.assign(n, U2, e), await fetch(t, n);
}
function T2(t) {
  let e = N2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function P2(...t) {
  const { fetchLib: e, middlewares: n } = T2(t);
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
class ho {
  constructor(e = Ah.slice(), n = ((a) => (a = Cc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = a2) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function La(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function D2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function vh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function k2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  La(t.outputLen), La(t.blockLen);
}
function O2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function F2(t, e) {
  vh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const jn = {
  number: La,
  bool: D2,
  bytes: vh,
  hash: k2,
  exists: O2,
  output: F2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const sa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ye = (t, e) => t << 32 - e | t >>> e, j2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!j2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bc(t) {
  if (typeof t == "string" && (t = z2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Lh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gr(t) {
  const e = (r) => t().update(Bc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Bh = class extends Lh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, jn.hash(e);
    const r = Bc(n);
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
const go = (t, e, n) => new Bh(t, e).update(n).digest();
go.create = (t, e) => new Bh(t, e);
function R2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Hc = class extends Lh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = sa(this.buffer);
  }
  update(e) {
    jn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = sa(e);
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
    R2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = sa(e), c = this.outputLen;
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
const V2 = (t, e, n) => t & e ^ ~t & n, G2 = (t, e, n) => t & e ^ t & n ^ e & n, K2 = new Uint32Array([
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
]), Qe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Je = new Uint32Array(64);
let Hh = class extends Hc {
  constructor() {
    super(64, 32, 8, !1), this.A = Qe[0] | 0, this.B = Qe[1] | 0, this.C = Qe[2] | 0, this.D = Qe[3] | 0, this.E = Qe[4] | 0, this.F = Qe[5] | 0, this.G = Qe[6] | 0, this.H = Qe[7] | 0;
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
      Je[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Je[l - 15], h = Je[l - 2], b = ye(g, 7) ^ ye(g, 18) ^ g >>> 3, y = ye(h, 17) ^ ye(h, 19) ^ h >>> 10;
      Je[l] = y + Je[l - 7] + b + Je[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = ye(a, 6) ^ ye(a, 11) ^ ye(a, 25), h = f + g + V2(a, c, u) + K2[l] + Je[l] | 0, y = (ye(r, 2) ^ ye(r, 13) ^ ye(r, 22)) + G2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Je.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, W2 = class extends Hh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Or = gr(() => new Hh());
gr(() => new W2());
const q2 = {}, _h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: q2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const nt = BigInt(0), yt = BigInt(1), In = BigInt(2), ms = BigInt(3), yu = BigInt(8), lt = Object.freeze({
  a: nt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: yt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), wu = (t, e) => (t + e / In) / e, si = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = lt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -yt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = wu(i * t, e), c = wu(-r * t, e);
    let u = M(t - a * n - c * s, e), f = M(-a * r - c * i, e);
    const l = u > o, g = f > o;
    if (l && (u = e - u), g && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: f };
  }
}, de = 32, Zn = 32, Mh = 32, Oi = de + 1, Fi = 2 * de + 1;
function xu(t) {
  const { a: e, b: n } = lt, r = M(t * t), s = M(r * t);
  return M(s + e * t + n);
}
const ii = lt.a === nt;
class _c extends Error {
  constructor(e) {
    super(e);
  }
}
function mu(t) {
  if (!(t instanceof ot))
    throw new TypeError("JacobianPoint expected");
}
class ot {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof J))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(J.ZERO) ? ot.ZERO : new ot(e.x, e.y, yt);
  }
  static toAffineBatch(e) {
    const n = J2(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ot.toAffineBatch(e).map(ot.fromAffine);
  }
  equals(e) {
    mu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = M(s * s), u = M(a * a), f = M(n * u), l = M(i * c), g = M(M(r * a) * u), h = M(M(o * s) * c);
    return f === l && g === h;
  }
  negate() {
    return new ot(this.x, M(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = M(e * e), i = M(n * n), o = M(i * i), a = e + i, c = M(In * (M(a * a) - s - o)), u = M(ms * s), f = M(u * u), l = M(f - In * c), g = M(u * (c - l) - yu * o), h = M(In * n * r);
    return new ot(l, g, h);
  }
  add(e) {
    mu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === nt || o === nt)
      return this;
    if (n === nt || r === nt)
      return e;
    const c = M(s * s), u = M(a * a), f = M(n * u), l = M(i * c), g = M(M(r * a) * u), h = M(M(o * s) * c), b = M(l - f), y = M(h - g);
    if (b === nt)
      return y === nt ? this.double() : ot.ZERO;
    const A = M(b * b), v = M(b * A), L = M(f * A), p = M(y * y - v - In * L), E = M(y * (L - p) - g * v), S = M(s * a * b);
    return new ot(p, E, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ot.ZERO;
    if (typeof e == "bigint" && e === nt)
      return n;
    let r = Eu(e);
    if (r === yt)
      return this;
    if (!ii) {
      let l = n, g = this;
      for (; r > nt; )
        r & yt && (l = l.add(g)), g = g.double(), r >>= yt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = si.splitScalar(r), c = n, u = n, f = this;
    for (; i > nt || a > nt; )
      i & yt && (c = c.add(f)), a & yt && (u = u.add(f)), f = f.double(), i >>= yt, a >>= yt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ot(M(u.x * si.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = ii ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ot.BASE) && (n = J.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ba.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ot.normalizeZ(s), Ba.set(n, s)));
    let i = ot.ZERO, o = ot.BASE;
    const a = 1 + (ii ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & u);
      e >>= l, b > c && (b -= f, e += yt);
      const y = h, A = h + Math.abs(b) - 1, v = g % 2 !== 0, L = b < 0;
      b === 0 ? o = o.add(oi(v, s[y])) : i = i.add(oi(L, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Eu(e), s, i;
    if (ii) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = si.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      f = oi(o, f), g = oi(c, g), g = new ot(M(g.x * si.beta), g.y, g.z), s = f.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ot.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ot.ZERO);
    e == null && (e = i ? yu : ss(s));
    const o = e, a = M(o * o), c = M(a * o), u = M(n * a), f = M(r * c), l = M(s * o);
    if (i)
      return J.ZERO;
    if (l !== yt)
      throw new Error("invZ was invalid");
    return new J(u, f);
  }
}
ot.BASE = new ot(lt.Gx, lt.Gy, yt);
ot.ZERO = new ot(nt, yt, nt);
function oi(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ba = /* @__PURE__ */ new WeakMap();
class J {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ba.delete(this);
  }
  hasEvenY() {
    return this.y % In === nt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = re(n ? e : e.subarray(1));
    if (!_i(r))
      throw new Error("Point is not on curve");
    const s = xu(r);
    let i = Q2(s);
    const o = (i & yt) === yt;
    n ? o && (i = M(-i)) : (e[0] & 1) === 1 !== o && (i = M(-i));
    const a = new J(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = re(e.subarray(1, de + 1)), r = re(e.subarray(de + 1, de * 2 + 1)), s = new J(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = _e(e), r = n.length, s = n[0];
    if (r === de)
      return this.fromCompressedHex(n);
    if (r === Oi && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Fi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Oi} compressed bytes or ${Fi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return J.BASE.multiply(Qn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Th(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Mc(_e(e)), { n: a } = lt, c = r === 2 || r === 3 ? s + a : s, u = ss(c, a), f = M(-o * u, a), l = M(i * u, a), g = r & 1 ? "03" : "02", h = J.fromHex(g + Ln(c)), b = J.BASE.multiplyAndAddUnsafe(h, f, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return Bn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ln(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ln(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!_i(n) || !_i(r))
      throw new Error(e);
    const s = M(r * r), i = xu(n);
    if (M(s - i) !== nt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new J(this.x, M(-this.y));
  }
  double() {
    return ot.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ot.fromAffine(this).add(ot.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ot.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ot.fromAffine(this), i = n === nt || n === yt || this !== J.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ot.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ot.ZERO) ? void 0 : a.toAffine();
  }
}
J.BASE = new J(lt.Gx, lt.Gy);
J.ZERO = new J(nt, nt);
function Su(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Au(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Fr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: re(n), left: t.subarray(e + 2) };
}
function Y2(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Fr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Au(t.subarray(2)), { data: r, left: s } = Au(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Fr(s)}`);
  return { r: e, s: r };
}
class ne {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Fr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ne(ji(s.slice(0, 64)), ji(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Y2(n ? e : Bn(e));
    return new ne(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!zr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!zr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = lt.n >> yt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ne(this.r, M(-this.s, lt.n)) : this;
  }
  toDERRawBytes() {
    return Bn(this.toDERHex());
  }
  toDERHex() {
    const e = Su(bs(this.s)), n = Su(bs(this.r)), r = e.length / 2, s = n.length / 2, i = bs(r), o = bs(s);
    return `30${bs(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Bn(this.toCompactHex());
  }
  toCompactHex() {
    return Ln(this.r) + Ln(this.s);
  }
}
function En(...t) {
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
const X2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Fr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += X2[t[n]];
  return e;
}
const Z2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ln(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(nt <= t && t < Z2))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function jr(t) {
  const e = Bn(Ln(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function bs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ji(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Bn(t) {
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
function re(t) {
  return ji(Fr(t));
}
function _e(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Bn(t);
}
function Eu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && zr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function M(t, e = lt.P) {
  const n = t % e;
  return n >= nt ? n : e + n;
}
function se(t, e) {
  const { P: n } = lt;
  let r = t;
  for (; e-- > nt; )
    r *= r, r %= n;
  return r;
}
function Q2(t) {
  const { P: e } = lt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = se(u, ms) * u % e, l = se(f, ms) * u % e, g = se(l, In) * c % e, h = se(g, r) * g % e, b = se(h, s) * h % e, y = se(b, o) * b % e, A = se(y, a) * y % e, v = se(A, o) * b % e, L = se(v, ms) * u % e, p = se(L, i) * h % e, E = se(p, n) * c % e, S = se(E, In);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function ss(t, e = lt.P) {
  if (t === nt || e <= nt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = M(t, e), r = e, s = nt, i = yt;
  for (; n !== nt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== yt)
    throw new Error("invert: does not exist");
  return M(s, e);
}
function J2(t, e = lt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === nt ? i : (n[a] = i, M(i * o, e)), yt), s = ss(r, e);
  return t.reduceRight((i, o, a) => o === nt ? i : (n[a] = M(i * n[a], e), M(i * o, e)), s), n;
}
function tb(t) {
  const e = t.length * 8 - Zn * 8, n = re(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Mc(t, e = !1) {
  const n = tb(t);
  if (e)
    return n;
  const { n: r } = lt;
  return n >= r ? n - r : n;
}
let Nr, Ss;
class Uh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return It.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ss(this.k, ...e);
  }
  checkSync() {
    if (typeof Ss != "function")
      throw new _c("hmacSha256Sync needs to be set");
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
    return En(...n);
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
    return En(...n);
  }
}
function zr(t) {
  return nt < t && t < lt.n;
}
function _i(t) {
  return nt < t && t < lt.P;
}
function Nh(t, e, n, r = !0) {
  const { n: s } = lt, i = Mc(t, !0);
  if (!zr(i))
    return;
  const o = ss(i, s), a = J.BASE.multiply(i), c = M(a.x, s);
  if (c === nt)
    return;
  const u = M(o * M(e + n * c, s), s);
  if (u === nt)
    return;
  let f = new ne(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & yt);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Qn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Zn)
      throw new Error("Expected 32 bytes of private key");
    e = ji(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Zn)
      throw new Error("Expected 32 bytes of private key");
    e = re(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!zr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Uc(t) {
  return t instanceof J ? (t.assertValidity(), t) : J.fromHex(t);
}
function Th(t) {
  if (t instanceof ne)
    return t.assertValidity(), t;
  try {
    return ne.fromDER(t);
  } catch {
    return ne.fromCompact(t);
  }
}
function Os(t, e = !1) {
  return J.fromPrivateKey(t).toRawBytes(e);
}
function eb(t, e, n, r = !1) {
  return J.fromSignature(t, e, n).toRawBytes(r);
}
function Iu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Oi || r === Fi : n ? r === Oi * 2 || r === Fi * 2 : t instanceof J;
}
function Nc(t, e, n = !1) {
  if (Iu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Iu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Uc(e);
  return r.assertValidity(), r.multiply(Qn(t)).toRawBytes(n);
}
function Ph(t) {
  const e = t.length > de ? t.slice(0, de) : t;
  return re(e);
}
function nb(t) {
  const e = Ph(t), n = M(e, lt.n);
  return Dh(n < nt ? e : n);
}
function Dh(t) {
  return jr(t);
}
function kh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = _e(t), s = Qn(e), i = [Dh(s), nb(r)];
  if (n != null) {
    n === !0 && (n = It.randomBytes(de));
    const c = _e(n);
    if (c.length !== de)
      throw new Error(`sign: Expected ${de} bytes of extra data`);
    i.push(c);
  }
  const o = En(...i), a = Ph(r);
  return { seed: o, m: a, d: s };
}
function Oh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function rb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = kh(t, e, n.extraEntropy), o = new Uh(Mh, Zn);
  await o.reseed(r);
  let a;
  for (; !(a = Nh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Oh(a, n);
}
function po(t, e, n = {}) {
  const { seed: r, m: s, d: i } = kh(t, e, n.extraEntropy), o = new Uh(Mh, Zn);
  o.reseedSync(r);
  let a;
  for (; !(a = Nh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Oh(a, n);
}
const sb = { strict: !0 };
function ib(t, e, n, r = sb) {
  let s;
  try {
    s = Th(t), e = _e(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Mc(e);
  let c;
  try {
    c = Uc(n);
  } catch {
    return !1;
  }
  const { n: u } = lt, f = ss(o, u), l = M(a * f, u), g = M(i * f, u), h = J.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? M(h.x, u) === i : !1;
}
function zi(t) {
  return M(re(t), lt.n);
}
class Rr {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = _e(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = re(n.subarray(0, 32)), s = re(n.subarray(32, 64));
    return new Rr(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!_i(e) || !zr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ln(this.r) + Ln(this.s);
  }
  toRawBytes() {
    return Bn(this.toHex());
  }
}
function ob(t) {
  return J.fromPrivateKey(t).toRawX();
}
class Fh {
  constructor(e, n, r = It.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = _e(e);
    const { x: s, scalar: i } = this.getScalar(Qn(n));
    if (this.px = s, this.d = i, this.rand = _e(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = J.fromPrivateKey(e), r = n.hasEvenY() ? e : lt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return jr(e ^ re(n));
  }
  finalizeNonce(e) {
    const n = M(re(e), lt.n);
    if (n === nt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Rr(e.x, M(n + r * s, lt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = It.taggedHash, o = this.initNonce(n, await i(An.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(An.nonce, o, r, e)), f = zi(await i(An.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await Rh(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = It.taggedHashSync, o = this.initNonce(n, i(An.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(An.nonce, o, r, e)), f = zi(i(An.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return Vh(l, e, r) || this.error(), l;
  }
}
async function ab(t, e, n) {
  return new Fh(t, e, n).calc();
}
function cb(t, e, n) {
  return new Fh(t, e, n).calcSync();
}
function jh(t, e, n) {
  const r = t instanceof Rr, s = r ? t : Rr.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: _e(e),
    P: Uc(n)
  };
}
function zh(t, e, n, r) {
  const s = J.BASE.multiplyAndAddUnsafe(e, Qn(n), M(-r, lt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Rh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = jh(t, e, n), a = zi(await It.taggedHash(An.challenge, jr(r), o.toRawX(), i));
    return zh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Vh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = jh(t, e, n), a = zi(It.taggedHashSync(An.challenge, jr(r), o.toRawX(), i));
    return zh(r, o, s, a);
  } catch (r) {
    if (r instanceof _c)
      throw r;
    return !1;
  }
}
const lb = {
  Signature: Rr,
  getPublicKey: ob,
  sign: ab,
  verify: Rh,
  signSync: cb,
  verifySync: Vh
};
J.BASE._setWindowSize(8);
const Xt = {
  node: _h,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, An = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ai = {}, It = {
  bytesToHex: Fr,
  hexToBytes: Bn,
  concatBytes: En,
  mod: M,
  invert: ss,
  isValidPrivateKey(t) {
    try {
      return Qn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: jr,
  _normalizePrivateKey: Qn,
  hashToPrivateKey: (t) => {
    t = _e(t);
    const e = Zn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = M(re(t), lt.n - yt) + yt;
    return jr(n);
  },
  randomBytes: (t = 32) => {
    if (Xt.web)
      return Xt.web.getRandomValues(new Uint8Array(t));
    if (Xt.node) {
      const { randomBytes: e } = Xt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => It.hashToPrivateKey(It.randomBytes(Zn + 8)),
  precompute(t = 8, e = J.BASE) {
    const n = e === J.BASE ? e : new J(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ms), n;
  },
  sha256: async (...t) => {
    if (Xt.web) {
      const e = await Xt.web.subtle.digest("SHA-256", En(...t));
      return new Uint8Array(e);
    } else if (Xt.node) {
      const { createHash: e } = Xt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Xt.web) {
      const n = await Xt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = En(...e), s = await Xt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Xt.node) {
      const { createHmac: n } = Xt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ai[t];
    if (n === void 0) {
      const r = await It.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = En(r, r), ai[t] = n;
    }
    return It.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Nr != "function")
      throw new _c("sha256Sync is undefined, you need to set it");
    let n = ai[t];
    if (n === void 0) {
      const r = Nr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = En(r, r), ai[t] = n;
    }
    return Nr(n, ...e);
  },
  _JacobianPoint: ot
};
Object.defineProperties(It, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Nr;
    },
    set(t) {
      Nr || (Nr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ss;
    },
    set(t) {
      Ss || (Ss = t);
    }
  }
});
const ub = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: lt,
  Point: J,
  Signature: ne,
  getPublicKey: Os,
  getSharedSecret: Nc,
  recoverPublicKey: eb,
  schnorr: lb,
  sign: rb,
  signSync: po,
  utils: It,
  verify: ib
}, Symbol.toStringTag, { value: "Module" }));
var Gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Gh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Kh(t) {
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
var Fs = {};
Fs.byteLength = pb;
var fb = Fs.toByteArray = yb, hb = Fs.fromByteArray = mb, Ee = [], ie = [], db = typeof Uint8Array < "u" ? Uint8Array : Array, ia = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var $r = 0, gb = ia.length; $r < gb; ++$r)
  Ee[$r] = ia[$r], ie[ia.charCodeAt($r)] = $r;
ie[45] = 62;
ie[95] = 63;
function Wh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function pb(t) {
  var e = Wh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function bb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function yb(t) {
  var e, n = Wh(t), r = n[0], s = n[1], i = new db(bb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ie[t.charCodeAt(c)] << 18 | ie[t.charCodeAt(c + 1)] << 12 | ie[t.charCodeAt(c + 2)] << 6 | ie[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ie[t.charCodeAt(c)] << 2 | ie[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ie[t.charCodeAt(c)] << 10 | ie[t.charCodeAt(c + 1)] << 4 | ie[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function wb(t) {
  return Ee[t >> 18 & 63] + Ee[t >> 12 & 63] + Ee[t >> 6 & 63] + Ee[t & 63];
}
function xb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(wb(r));
  return s.join("");
}
function mb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(xb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Ee[e >> 2] + Ee[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ee[e >> 10] + Ee[e >> 4 & 63] + Ee[e << 2 & 63] + "="
  )), s.join("");
}
function Sb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Ab = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Eb() {
  if (Sb())
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
    throw new Error(Ab);
  }
}
class Ib {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(He(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(He(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class $b {
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
async function qh() {
  const t = await Eb();
  return t.name === "subtleCrypto" ? new $b(t.lib) : new Ib(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Cb(t) {
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
    for (var b = 0, y = 0, A = 0, v = h.length; A !== v && h[A] === 0; )
      A++, b++;
    for (var L = (v - A) * u + 1 >>> 0, p = new Uint8Array(L); A !== v; ) {
      for (var E = h[A], S = 0, T = L - 1; (E !== 0 || S < y) && T !== -1; T--, S++)
        E += 256 * p[T] >>> 0, p[T] = E % o >>> 0, E = E / o >>> 0;
      if (E !== 0)
        throw new Error("Non-zero carry");
      y = S, A++;
    }
    for (var O = L - y; O !== L && p[O] === 0; )
      O++;
    for (var H = a.repeat(b); O < L; ++O)
      H += t.charAt(p[O]);
    return H;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, y = 0, A = 0; h[b] === a; )
      y++, b++;
    for (var v = (h.length - b) * c + 1 >>> 0, L = new Uint8Array(v); h[b]; ) {
      var p = h.charCodeAt(b);
      if (p > 255)
        return;
      var E = e[p];
      if (E === 255)
        return;
      for (var S = 0, T = v - 1; (E !== 0 || S < A) && T !== -1; T--, S++)
        E += o * L[T] >>> 0, L[T] = E % 256 >>> 0, E = E / 256 >>> 0;
      if (E !== 0)
        throw new Error("Non-zero carry");
      A = S, b++;
    }
    for (var O = v - A; O !== v && L[O] === 0; )
      O++;
    for (var H = new Uint8Array(y + (v - O)), N = y; O !== v; )
      H[N++] = L[O++];
    return H;
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
var Yh = Cb;
const vb = Yh, Lb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Bb = vb(Lb);
const Hb = /* @__PURE__ */ Gh(Bb), _b = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Xh = Uint8Array.from({ length: 16 }, (t, e) => e), Mb = Xh.map((t) => (9 * t + 5) % 16);
let Tc = [Xh], Pc = [Mb];
for (let t = 0; t < 4; t++)
  for (let e of [Tc, Pc])
    e.push(e[t].map((n) => _b[n]));
const Zh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ub = Tc.map((t, e) => t.map((n) => Zh[e][n])), Nb = Pc.map((t, e) => t.map((n) => Zh[e][n])), Tb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Pb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ci = (t, e) => t << e | t >>> 32 - e;
function $u(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const li = new Uint32Array(16);
let Db = class extends Hc {
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
      li[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = Tb[h], A = Pb[h], v = Tc[h], L = Pc[h], p = Ub[h], E = Nb[h];
      for (let S = 0; S < 16; S++) {
        const T = ci(r + $u(h, i, a, u) + li[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = ci(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = ci(s + $u(b, o, c, f) + li[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = ci(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    li.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const kb = gr(() => new Db());
function Ob(t) {
  return kb(t);
}
const ui = BigInt(2 ** 32 - 1), Ha = BigInt(32);
function Qh(t, e = !1) {
  return e ? { h: Number(t & ui), l: Number(t >> Ha & ui) } : { h: Number(t >> Ha & ui) | 0, l: Number(t & ui) | 0 };
}
function Fb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Qh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const jb = (t, e) => BigInt(t >>> 0) << Ha | BigInt(e >>> 0), zb = (t, e, n) => t >>> n, Rb = (t, e, n) => t << 32 - n | e >>> n, Vb = (t, e, n) => t >>> n | e << 32 - n, Gb = (t, e, n) => t << 32 - n | e >>> n, Kb = (t, e, n) => t << 64 - n | e >>> n - 32, Wb = (t, e, n) => t >>> n - 32 | e << 64 - n, qb = (t, e) => e, Yb = (t, e) => t, Xb = (t, e, n) => t << n | e >>> 32 - n, Zb = (t, e, n) => e << n | t >>> 32 - n, Qb = (t, e, n) => e << n - 32 | t >>> 64 - n, Jb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ty(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ey = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ny = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ry = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), sy = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, iy = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), oy = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: Qh,
  split: Fb,
  toBig: jb,
  shrSH: zb,
  shrSL: Rb,
  rotrSH: Vb,
  rotrSL: Gb,
  rotrBH: Kb,
  rotrBL: Wb,
  rotr32H: qb,
  rotr32L: Yb,
  rotlSH: Xb,
  rotlSL: Zb,
  rotlBH: Qb,
  rotlBL: Jb,
  add: ty,
  add3L: ey,
  add3H: ny,
  add4L: ry,
  add4H: sy,
  add5H: oy,
  add5L: iy
}, [ay, cy] = K.split([
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
].map((t) => BigInt(t))), tn = new Uint32Array(80), en = new Uint32Array(80);
let bo = class extends Hc {
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
      tn[p] = e.getUint32(n), en[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = tn[p - 15] | 0, S = en[p - 15] | 0, T = K.rotrSH(E, S, 1) ^ K.rotrSH(E, S, 8) ^ K.shrSH(E, S, 7), O = K.rotrSL(E, S, 1) ^ K.rotrSL(E, S, 8) ^ K.shrSL(E, S, 7), H = tn[p - 2] | 0, N = en[p - 2] | 0, w = K.rotrSH(H, N, 19) ^ K.rotrBH(H, N, 61) ^ K.shrSH(H, N, 6), I = K.rotrSL(H, N, 19) ^ K.rotrBL(H, N, 61) ^ K.shrSL(H, N, 6), _ = K.add4L(O, I, en[p - 7], en[p - 16]), F = K.add4H(_, T, w, tn[p - 7], tn[p - 16]);
      tn[p] = F | 0, en[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = K.rotrSH(l, g, 14) ^ K.rotrSH(l, g, 18) ^ K.rotrBH(l, g, 41), S = K.rotrSL(l, g, 14) ^ K.rotrSL(l, g, 18) ^ K.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = K.add5L(L, S, O, cy[p], en[p]), N = K.add5H(H, v, E, T, ay[p], tn[p]), w = H | 0, I = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), _ = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = K.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = K.add3L(w, _, G);
      r = K.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = K.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = K.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = K.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = K.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = K.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = K.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    tn.fill(0), en.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ly = class extends bo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, uy = class extends bo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, fy = class extends bo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const hy = gr(() => new bo());
gr(() => new ly());
gr(() => new uy());
gr(() => new fy());
function Jh(t) {
  return Or(t);
}
function dy(t) {
  return hy(t);
}
const gy = 0;
It.hmacSha256Sync = (t, ...e) => {
  const n = go.create(Or, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function py() {
  return z(It.randomPrivateKey());
}
function by(t) {
  const e = Or(Or(t));
  return Hb.encode(He(t, e).slice(0, t.length + 4));
}
function yy(t, e) {
  return by(He(new Uint8Array([t]), e.slice(0, 20)));
}
function t0(t, e = gy) {
  const n = typeof t == "string" ? st(t) : t, r = Ob(Jh(n));
  return yy(e, r);
}
function e0(t) {
  const e = Lc(t);
  return z(Os(e.slice(0, 32), !0));
}
It.hmacSha256Sync = (t, ...e) => {
  const n = go.create(Or, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ri;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ri || (Ri = {}));
async function wy(t, e, n) {
  return await (await qh()).encrypt("aes-256-cbc", e, t, n);
}
async function xy(t, e, n) {
  return await (await qh()).decrypt("aes-256-cbc", e, t, n);
}
function n0(t, e) {
  return go(Or, t, e);
}
function my(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function r0(t) {
  const e = dy(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Sy(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Ay(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ri.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ri.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Sy(t))
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
async function Ey(t, e, n, r) {
  const s = Ay(t);
  if (!s.result)
    throw s;
  const i = It.randomPrivateKey(), o = Os(i, !0);
  let a = Nc(i, t, !0);
  a = a.slice(1);
  const c = r0(a), u = It.randomBytes(16), f = await wy(u, c.encryptionKey, e), l = He(u, o, f), g = n0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = z(f);
  else if (r === "base64")
    h = hb(f);
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
async function s0(t, e) {
  if (!e.ephemeralPK)
    throw new du("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Nc(t, n, !0);
  r = r.slice(1);
  const s = r0(r), i = st(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = st(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = fb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = He(i, st(n), o), c = n0(s.hmacKey, a), u = st(e.mac);
  if (!my(u, c))
    throw new du("Decryption failed: failure in MAC check");
  const f = await xy(i, s.encryptionKey, o);
  return e.wasString ? ks(f) : f;
}
function Iy(t, e) {
  const n = typeof e == "string" ? dr(e) : e, r = e0(t), s = Jh(n), i = po(s, t);
  return {
    signature: z(i),
    publicKey: r
  };
}
async function $y(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = e0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? dr(t) : t, o = await Ey(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Iy(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Cy(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return s0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Dt = {}, Vr = {}, zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.decode = zt.encode = zt.unescape = zt.escape = zt.pad = void 0;
const i0 = Fs;
function Dc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
zt.pad = Dc;
function o0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
zt.escape = o0;
function a0(t) {
  return Dc(t).replace(/-/g, "+").replace(/_/g, "/");
}
zt.unescape = a0;
function vy(t) {
  return o0((0, i0.fromByteArray)(new TextEncoder().encode(t)));
}
zt.encode = vy;
function Ly(t) {
  return new TextDecoder().decode((0, i0.toByteArray)(Dc(a0(t))));
}
zt.decode = Ly;
var yo = {}, wo = {}, c0 = {}, qe = {}, xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.crypto = void 0;
xo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = y, t.bytesToHex = L, t.hexToBytes = S, t.asyncLoop = O, t.utf8ToBytes = H, t.bytesToUtf8 = N, t.toBytes = w, t.kdfInputToBytes = I, t.concatBytes = _, t.checkOpts = F, t.createHasher = P, t.createOptHasher = Pe, t.createXOFer = Xe, t.randomBytes = mr;
  const e = xo;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...C) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (C.length > 0 && !C.includes(m.length))
      throw new Error("Uint8Array expected of length " + C + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, C = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (C && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(m, C) {
    s(m);
    const ht = C.outputLen;
    if (m.length < ht)
      throw new Error("digestInto() expects output buffer of length at least " + ht);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function u(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function f(...m) {
    for (let C = 0; C < m.length; C++)
      m[C].fill(0);
  }
  function l(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function g(m, C) {
    return m << 32 - C | m >>> C;
  }
  function h(m, C) {
    return m << C | m >>> 32 - C >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => b(m), t.byteSwapIfBE = t.swap8IfBE;
  function y(m) {
    for (let C = 0; C < m.length; C++)
      m[C] = b(m[C]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : y;
  const A = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", v = /* @__PURE__ */ Array.from({ length: 256 }, (m, C) => C.toString(16).padStart(2, "0"));
  function L(m) {
    if (s(m), A)
      return m.toHex();
    let C = "";
    for (let ht = 0; ht < m.length; ht++)
      C += v[m[ht]];
    return C;
  }
  const p = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function E(m) {
    if (m >= p._0 && m <= p._9)
      return m - p._0;
    if (m >= p.A && m <= p.F)
      return m - (p.A - 10);
    if (m >= p.a && m <= p.f)
      return m - (p.a - 10);
  }
  function S(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (A)
      return Uint8Array.fromHex(m);
    const C = m.length, ht = C / 2;
    if (C % 2)
      throw new Error("hex string expected, got unpadded hex of length " + C);
    const pt = new Uint8Array(ht);
    for (let ut = 0, Mt = 0; ut < ht; ut++, Mt += 2) {
      const ds = E(m.charCodeAt(Mt)), Xs = E(m.charCodeAt(Mt + 1));
      if (ds === void 0 || Xs === void 0) {
        const Fo = m[Mt] + m[Mt + 1];
        throw new Error('hex string expected, got non-hex character "' + Fo + '" at index ' + Mt);
      }
      pt[ut] = ds * 16 + Xs;
    }
    return pt;
  }
  const T = async () => {
  };
  t.nextTick = T;
  async function O(m, C, ht) {
    let pt = Date.now();
    for (let ut = 0; ut < m; ut++) {
      ht(ut);
      const Mt = Date.now() - pt;
      Mt >= 0 && Mt < C || (await (0, t.nextTick)(), pt += Mt);
    }
  }
  function H(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function N(m) {
    return new TextDecoder().decode(m);
  }
  function w(m) {
    return typeof m == "string" && (m = H(m)), s(m), m;
  }
  function I(m) {
    return typeof m == "string" && (m = H(m)), s(m), m;
  }
  function _(...m) {
    let C = 0;
    for (let pt = 0; pt < m.length; pt++) {
      const ut = m[pt];
      s(ut), C += ut.length;
    }
    const ht = new Uint8Array(C);
    for (let pt = 0, ut = 0; pt < m.length; pt++) {
      const Mt = m[pt];
      ht.set(Mt, ut), ut += Mt.length;
    }
    return ht;
  }
  function F(m, C) {
    if (C !== void 0 && {}.toString.call(C) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, C);
  }
  class G {
  }
  t.Hash = G;
  function P(m) {
    const C = (pt) => m().update(w(pt)).digest(), ht = m();
    return C.outputLen = ht.outputLen, C.blockLen = ht.blockLen, C.create = () => m(), C;
  }
  function Pe(m) {
    const C = (pt, ut) => m(ut).update(w(pt)).digest(), ht = m({});
    return C.outputLen = ht.outputLen, C.blockLen = ht.blockLen, C.create = (pt) => m(pt), C;
  }
  function Xe(m) {
    const C = (pt, ut) => m(ut).update(w(pt)).digest(), ht = m({});
    return C.outputLen = ht.outputLen, C.blockLen = ht.blockLen, C.create = (pt) => m(pt), C;
  }
  t.wrapConstructor = P, t.wrapConstructorWithOpts = Pe, t.wrapXOFConstructorWithOpts = Xe;
  function mr(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(qe);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = qe;
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
})(c0);
var te = {}, dt = {}, Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.SHA512_IV = Rt.SHA384_IV = Rt.SHA224_IV = Rt.SHA256_IV = Rt.HashMD = void 0;
Rt.setBigUint64 = l0;
Rt.Chi = By;
Rt.Maj = Hy;
const we = qe;
function l0(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function By(t, e, n) {
  return t & e ^ ~t & n;
}
function Hy(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class _y extends we.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, we.createView)(this.buffer);
  }
  update(e) {
    (0, we.aexists)(this), e = (0, we.toBytes)(e), (0, we.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = (0, we.createView)(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, we.aexists)(this), (0, we.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, we.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    l0(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = (0, we.createView)(e), c = this.outputLen;
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
Rt.HashMD = _y;
Rt.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
Rt.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
Rt.SHA384_IV = Uint32Array.from([
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
Rt.SHA512_IV = Uint32Array.from([
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
R.add = I0;
R.fromBig = kc;
R.split = u0;
const fi = /* @__PURE__ */ BigInt(2 ** 32 - 1), _a = /* @__PURE__ */ BigInt(32);
function kc(t, e = !1) {
  return e ? { h: Number(t & fi), l: Number(t >> _a & fi) } : { h: Number(t >> _a & fi) | 0, l: Number(t & fi) | 0 };
}
function u0(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l: a } = kc(t[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const f0 = (t, e) => BigInt(t >>> 0) << _a | BigInt(e >>> 0);
R.toBig = f0;
const h0 = (t, e, n) => t >>> n;
R.shrSH = h0;
const d0 = (t, e, n) => t << 32 - n | e >>> n;
R.shrSL = d0;
const g0 = (t, e, n) => t >>> n | e << 32 - n;
R.rotrSH = g0;
const p0 = (t, e, n) => t << 32 - n | e >>> n;
R.rotrSL = p0;
const b0 = (t, e, n) => t << 64 - n | e >>> n - 32;
R.rotrBH = b0;
const y0 = (t, e, n) => t >>> n - 32 | e << 64 - n;
R.rotrBL = y0;
const w0 = (t, e) => e;
R.rotr32H = w0;
const x0 = (t, e) => t;
R.rotr32L = x0;
const m0 = (t, e, n) => t << n | e >>> 32 - n;
R.rotlSH = m0;
const S0 = (t, e, n) => e << n | t >>> 32 - n;
R.rotlSL = S0;
const A0 = (t, e, n) => e << n - 32 | t >>> 64 - n;
R.rotlBH = A0;
const E0 = (t, e, n) => t << n - 32 | e >>> 64 - n;
R.rotlBL = E0;
function I0(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $0 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
R.add3L = $0;
const C0 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
R.add3H = C0;
const v0 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
R.add4L = v0;
const L0 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
R.add4H = L0;
const B0 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
R.add5L = B0;
const H0 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0;
R.add5H = H0;
const My = {
  fromBig: kc,
  split: u0,
  toBig: f0,
  shrSH: h0,
  shrSL: d0,
  rotrSH: g0,
  rotrSL: p0,
  rotrBH: b0,
  rotrBL: y0,
  rotr32H: w0,
  rotr32L: x0,
  rotlSH: m0,
  rotlSL: S0,
  rotlBH: A0,
  rotlBL: E0,
  add: I0,
  add3L: $0,
  add3H: C0,
  add4L: v0,
  add4H: L0,
  add5H: H0,
  add5L: B0
};
R.default = My;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.sha512_224 = dt.sha512_256 = dt.sha384 = dt.sha512 = dt.sha224 = dt.sha256 = dt.SHA512_256 = dt.SHA512_224 = dt.SHA384 = dt.SHA512 = dt.SHA224 = dt.SHA256 = void 0;
const j = Rt, W = R, vt = qe, Uy = /* @__PURE__ */ Uint32Array.from([
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
]), nn = /* @__PURE__ */ new Uint32Array(64);
let Oc = class extends j.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = j.SHA256_IV[0] | 0, this.B = j.SHA256_IV[1] | 0, this.C = j.SHA256_IV[2] | 0, this.D = j.SHA256_IV[3] | 0, this.E = j.SHA256_IV[4] | 0, this.F = j.SHA256_IV[5] | 0, this.G = j.SHA256_IV[6] | 0, this.H = j.SHA256_IV[7] | 0;
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
      const g = nn[l - 15], h = nn[l - 2], b = (0, vt.rotr)(g, 7) ^ (0, vt.rotr)(g, 18) ^ g >>> 3, y = (0, vt.rotr)(h, 17) ^ (0, vt.rotr)(h, 19) ^ h >>> 10;
      nn[l] = y + nn[l - 7] + b + nn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, vt.rotr)(a, 6) ^ (0, vt.rotr)(a, 11) ^ (0, vt.rotr)(a, 25), h = f + g + (0, j.Chi)(a, c, u) + Uy[l] + nn[l] | 0, y = ((0, vt.rotr)(r, 2) ^ (0, vt.rotr)(r, 13) ^ (0, vt.rotr)(r, 22)) + (0, j.Maj)(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    (0, vt.clean)(nn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, vt.clean)(this.buffer);
  }
};
dt.SHA256 = Oc;
let _0 = class extends Oc {
  constructor() {
    super(28), this.A = j.SHA224_IV[0] | 0, this.B = j.SHA224_IV[1] | 0, this.C = j.SHA224_IV[2] | 0, this.D = j.SHA224_IV[3] | 0, this.E = j.SHA224_IV[4] | 0, this.F = j.SHA224_IV[5] | 0, this.G = j.SHA224_IV[6] | 0, this.H = j.SHA224_IV[7] | 0;
  }
};
dt.SHA224 = _0;
const M0 = W.split([
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
].map((t) => BigInt(t))), Ny = M0[0], Ty = M0[1], rn = /* @__PURE__ */ new Uint32Array(80), sn = /* @__PURE__ */ new Uint32Array(80);
let js = class extends j.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = j.SHA512_IV[0] | 0, this.Al = j.SHA512_IV[1] | 0, this.Bh = j.SHA512_IV[2] | 0, this.Bl = j.SHA512_IV[3] | 0, this.Ch = j.SHA512_IV[4] | 0, this.Cl = j.SHA512_IV[5] | 0, this.Dh = j.SHA512_IV[6] | 0, this.Dl = j.SHA512_IV[7] | 0, this.Eh = j.SHA512_IV[8] | 0, this.El = j.SHA512_IV[9] | 0, this.Fh = j.SHA512_IV[10] | 0, this.Fl = j.SHA512_IV[11] | 0, this.Gh = j.SHA512_IV[12] | 0, this.Gl = j.SHA512_IV[13] | 0, this.Hh = j.SHA512_IV[14] | 0, this.Hl = j.SHA512_IV[15] | 0;
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
      const E = rn[p - 15] | 0, S = sn[p - 15] | 0, T = W.rotrSH(E, S, 1) ^ W.rotrSH(E, S, 8) ^ W.shrSH(E, S, 7), O = W.rotrSL(E, S, 1) ^ W.rotrSL(E, S, 8) ^ W.shrSL(E, S, 7), H = rn[p - 2] | 0, N = sn[p - 2] | 0, w = W.rotrSH(H, N, 19) ^ W.rotrBH(H, N, 61) ^ W.shrSH(H, N, 6), I = W.rotrSL(H, N, 19) ^ W.rotrBL(H, N, 61) ^ W.shrSL(H, N, 6), _ = W.add4L(O, I, sn[p - 7], sn[p - 16]), F = W.add4H(_, T, w, rn[p - 7], rn[p - 16]);
      rn[p] = F | 0, sn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = W.rotrSH(l, g, 14) ^ W.rotrSH(l, g, 18) ^ W.rotrBH(l, g, 41), S = W.rotrSL(l, g, 14) ^ W.rotrSL(l, g, 18) ^ W.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = W.add5L(L, S, O, Ty[p], sn[p]), N = W.add5H(H, v, E, T, Ny[p], rn[p]), w = H | 0, I = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), _ = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = W.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = W.add3L(w, _, G);
      r = W.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = W.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = W.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = W.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = W.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = W.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    (0, vt.clean)(rn, sn);
  }
  destroy() {
    (0, vt.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
dt.SHA512 = js;
let U0 = class extends js {
  constructor() {
    super(48), this.Ah = j.SHA384_IV[0] | 0, this.Al = j.SHA384_IV[1] | 0, this.Bh = j.SHA384_IV[2] | 0, this.Bl = j.SHA384_IV[3] | 0, this.Ch = j.SHA384_IV[4] | 0, this.Cl = j.SHA384_IV[5] | 0, this.Dh = j.SHA384_IV[6] | 0, this.Dl = j.SHA384_IV[7] | 0, this.Eh = j.SHA384_IV[8] | 0, this.El = j.SHA384_IV[9] | 0, this.Fh = j.SHA384_IV[10] | 0, this.Fl = j.SHA384_IV[11] | 0, this.Gh = j.SHA384_IV[12] | 0, this.Gl = j.SHA384_IV[13] | 0, this.Hh = j.SHA384_IV[14] | 0, this.Hl = j.SHA384_IV[15] | 0;
  }
};
dt.SHA384 = U0;
const Ut = /* @__PURE__ */ Uint32Array.from([
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
]), Nt = /* @__PURE__ */ Uint32Array.from([
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
let N0 = class extends js {
  constructor() {
    super(28), this.Ah = Ut[0] | 0, this.Al = Ut[1] | 0, this.Bh = Ut[2] | 0, this.Bl = Ut[3] | 0, this.Ch = Ut[4] | 0, this.Cl = Ut[5] | 0, this.Dh = Ut[6] | 0, this.Dl = Ut[7] | 0, this.Eh = Ut[8] | 0, this.El = Ut[9] | 0, this.Fh = Ut[10] | 0, this.Fl = Ut[11] | 0, this.Gh = Ut[12] | 0, this.Gl = Ut[13] | 0, this.Hh = Ut[14] | 0, this.Hl = Ut[15] | 0;
  }
};
dt.SHA512_224 = N0;
let T0 = class extends js {
  constructor() {
    super(32), this.Ah = Nt[0] | 0, this.Al = Nt[1] | 0, this.Bh = Nt[2] | 0, this.Bl = Nt[3] | 0, this.Ch = Nt[4] | 0, this.Cl = Nt[5] | 0, this.Dh = Nt[6] | 0, this.Dl = Nt[7] | 0, this.Eh = Nt[8] | 0, this.El = Nt[9] | 0, this.Fh = Nt[10] | 0, this.Fl = Nt[11] | 0, this.Gh = Nt[12] | 0, this.Gl = Nt[13] | 0, this.Hh = Nt[14] | 0, this.Hl = Nt[15] | 0;
  }
};
dt.SHA512_256 = T0;
dt.sha256 = (0, vt.createHasher)(() => new Oc());
dt.sha224 = (0, vt.createHasher)(() => new _0());
dt.sha512 = (0, vt.createHasher)(() => new js());
dt.sha384 = (0, vt.createHasher)(() => new U0());
dt.sha512_256 = (0, vt.createHasher)(() => new T0());
dt.sha512_224 = (0, vt.createHasher)(() => new N0());
Object.defineProperty(te, "__esModule", { value: !0 });
te.sha224 = te.SHA224 = te.sha256 = te.SHA256 = void 0;
const mo = dt;
te.SHA256 = mo.SHA256;
te.sha256 = mo.sha256;
te.SHA224 = mo.SHA224;
te.sha224 = mo.sha224;
const Py = /* @__PURE__ */ Kh(ub);
var Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.joseToDer = Gr.derToJose = void 0;
const P0 = Fs, D0 = zt;
function oa(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Dy = {
  ES256: oa(256),
  ES384: oa(384),
  ES512: oa(521)
};
function k0(t) {
  const e = Dy[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Vi = 128, O0 = 0, ky = 32, Oy = 16, Fy = 2, F0 = Oy | ky | O0 << 6, Gi = Fy | O0 << 6;
function j0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, P0.toByteArray)((0, D0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function jy(t, e) {
  const n = j0(t), r = k0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== F0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Vi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Gi)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Gi)
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
  return b.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, D0.escape)((0, P0.fromByteArray)(b));
}
Gr.derToJose = jy;
function Cu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Vi && --r, r;
}
function zy(t, e) {
  t = j0(t);
  const n = k0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Cu(t, 0, n), i = Cu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Vi, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = F0, u ? f[l++] = c : (f[l++] = Vi | 1, f[l++] = c & 255), f[l++] = Gi, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = Gi, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
Gr.joseToDer = zy;
var Ve = {};
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.InvalidTokenError = Ve.MissingParametersError = void 0;
class Ry extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Ve.MissingParametersError = Ry;
class Vy extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Ve.InvalidTokenError = Vy;
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.SECP256K1Client = void 0;
const Gy = c0, Ky = te, Mi = Py, vu = Gr, Lu = Ve, Bu = qe;
Mi.utils.hmacSha256Sync = (t, ...e) => {
  const n = Gy.hmac.create(Ky.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class z0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Bu.bytesToHex)(Mi.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Lu.MissingParametersError("a signing input hash and private key are all required");
    const s = Mi.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Bu.bytesToHex)(s);
    if (r === "jose")
      return (0, vu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, vu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Lu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Mi.verify(n, e, r, { strict: !1 });
  }
}
wo.SECP256K1Client = z0;
z0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = wo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(yo);
var Jn = {};
const Wy = /* @__PURE__ */ Kh(_h);
var qy = Gt && Gt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.hashSha256Async = Jn.hashSha256 = void 0;
const Yy = te;
function R0(t) {
  return (0, Yy.sha256)(t);
}
Jn.hashSha256 = R0;
function Xy(t) {
  return qy(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Wy;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(R0(t));
    }
  });
}
Jn.hashSha256Async = Xy;
var Zy = Gt && Gt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.TokenSigner = Vr.createUnsecuredToken = void 0;
const Ma = zt, Hu = yo, Qy = Ve, _u = Jn;
function Ua(t, e) {
  const n = [], r = Ma.encode(JSON.stringify(e));
  n.push(r);
  const s = Ma.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Jy(t) {
  return Ua(t, { typ: "JWT", alg: "none" }) + ".";
}
Vr.createUnsecuredToken = Jy;
class tw {
  constructor(e, n) {
    if (!(e && n))
      throw new Qy.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Hu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Hu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Ua(e, s), o = (0, _u.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Zy(this, void 0, void 0, function* () {
      const s = this.header(r), i = Ua(e, s), o = yield (0, _u.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ma.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Vr.TokenSigner = tw;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
So.TokenVerifier = void 0;
const ew = zt, Mu = yo, nw = Ve, hi = Jn;
class rw {
  constructor(e, n) {
    if (!(e && n))
      throw new nw.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Mu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Mu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, hi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, hi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), ew.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, hi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, hi.hashSha256)(r);
      return i(o);
    }
  }
}
So.TokenVerifier = rw;
var Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.decodeToken = void 0;
const di = zt;
function sw(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(di.decode(e[0])), r = JSON.parse(di.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = di.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(di.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ao.decodeToken = sw;
(function(t) {
  var e = Gt && Gt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Gt && Gt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Vr, t), n(So, t), n(Ao, t), n(Ve, t), n(yo, t);
})(Dt);
function iw(t) {
  return `did:btc-addr:${t}`;
}
function ow(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new hu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new hu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function V0(t) {
  if (t)
    return ow(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const aw = "1.4.0";
function cw() {
  return py();
}
function lw(t, e, n, r = Ah.slice(), s, i = h2().getTime(), o = {}) {
  const a = (h) => {
    const b = Cc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: g2(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: aw,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Dt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = t0(u);
  return c.iss = iw(f), new Dt.TokenSigner("ES256k", t).sign(c);
}
async function Uu(t, e) {
  const n = ks(st(e)), r = JSON.parse(n), s = await s0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function uw(t) {
  const e = Dt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Dt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function fw(t) {
  const e = Dt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = V0(e.iss);
  if (n.length === 1) {
    if (t0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function hw(t) {
  const e = Dt.decodeToken(t).payload;
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
function dw(t) {
  const e = Dt.decodeToken(t).payload;
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
function gw(t) {
  const e = [
    dw(t),
    hw(t),
    uw(t),
    fw(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Nu = "1.0.0";
class Hn {
  constructor(e) {
    this.version = Nu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Nu)
      throw new $a(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Hn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class G0 {
  constructor(e) {
    if (e) {
      const n = new Hn(e);
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
class Tu extends G0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Hn({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Eh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hn({})), !0;
  }
}
class Pu extends G0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = l2, !localStorage.getItem(this.key)) {
      const r = new Hn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Eh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Hn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Hn({})), !0;
  }
}
var Cs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Cs || (Cs = {}));
var Ki;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ki || (Ki = {}));
Cs.Mainnet;
var Re;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Re || (Re = {}));
var Ce;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ce || (Ce = {}));
Re.Mainnet;
const K0 = {
  chainId: Cs.Mainnet,
  transactionVersion: Re.Mainnet,
  peerNetworkId: Ki.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ce.MainnetSingleSig,
    multiSig: Ce.MainnetMultiSig
  },
  client: { baseUrl: Ih }
}, Na = {
  chainId: Cs.Testnet,
  transactionVersion: Re.Testnet,
  peerNetworkId: Ki.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ce.TestnetSingleSig,
    multiSig: Ce.TestnetMultiSig
  },
  client: { baseUrl: $h }
}, Ui = {
  ...Na,
  addressVersion: { ...Na.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Ch }
}, pw = {
  ...Ui,
  addressVersion: { ...Ui.addressVersion },
  client: { ...Ui.client }
};
function bw(t) {
  switch (t) {
    case "mainnet":
      return K0;
    case "testnet":
      return Na;
    case "devnet":
      return Ui;
    case "mocknet":
      return pw;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function W0(t) {
  return typeof t == "string" ? bw(t) : t;
}
var Du;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Du || (Du = {}));
var ku;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ku || (ku = {}));
var le;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(le || (le = {}));
const aa = ["onChainOnly", "offChainOnly", "any"];
aa[0] + "", le.OnChainOnly, aa[1] + "", le.OffChainOnly, aa[2] + "", le.Any, le.OnChainOnly + "", le.OnChainOnly, le.OffChainOnly + "", le.OffChainOnly, le.Any + "", le.Any;
var Ou;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ou || (Ou = {}));
var Fu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Fu || (Fu = {}));
var ju;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ju || (ju = {}));
var ze;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ze || (ze = {}));
var zu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zu || (zu = {}));
var Ru;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ru || (Ru = {}));
var Vu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Vu || (Vu = {}));
var Gu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Gu || (Gu = {}));
var Ku;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ku || (Ku = {}));
var Wu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wu || (Wu = {}));
var qu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(qu || (qu = {}));
var Yu;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Yu || (Yu = {}));
var Xu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Xu || (Xu = {}));
function Ta(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function yw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function q0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ww(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ta(t.outputLen), Ta(t.blockLen);
}
function xw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mw(t, e) {
  q0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zn = {
  number: Ta,
  bool: yw,
  bytes: q0,
  hash: ww,
  exists: xw,
  output: mw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ca = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), xe = (t, e) => t << 32 - e | t >>> e, Sw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Aw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fc(t) {
  if (typeof t == "string" && (t = Aw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Y0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pr(t) {
  const e = (r) => t().update(Fc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let X0 = class extends Y0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zn.hash(e);
    const r = Fc(n);
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
};
const Z0 = (t, e, n) => new X0(t, e).update(n).digest();
Z0.create = (t, e) => new X0(t, e);
function Ew(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let jc = class extends Y0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ca(this.buffer);
  }
  update(e) {
    zn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Fc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ca(e);
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
    Ew(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ca(e), c = this.outputLen;
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
const Iw = (t, e, n) => t & e ^ ~t & n, $w = (t, e, n) => t & e ^ t & n ^ e & n, Cw = new Uint32Array([
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
let Q0 = class extends jc {
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
      const g = an[l - 15], h = an[l - 2], b = xe(g, 7) ^ xe(g, 18) ^ g >>> 3, y = xe(h, 17) ^ xe(h, 19) ^ h >>> 10;
      an[l] = y + an[l - 7] + b + an[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = xe(a, 6) ^ xe(a, 11) ^ xe(a, 25), h = f + g + Iw(a, c, u) + Cw[l] + an[l] | 0, y = (xe(r, 2) ^ xe(r, 13) ^ xe(r, 22)) + $w(r, s, i) | 0;
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
}, vw = class extends Q0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const J0 = pr(() => new Q0());
pr(() => new vw());
var br = {}, zc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = qe;
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
        const A = 1 + u, v = y % (1 << A) << 5 - A, L = t.c32[b + v];
        u = A, c.unshift(L);
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
      const v = (t.c32.indexOf(o[y]) << g) + l, L = n[v % 16];
      if (g += 1, l = v >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      f.unshift(L);
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
})(zc);
var tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.c32checkDecode = tr.c32checkEncode = void 0;
const Zu = te, Qu = qe, As = zc;
function td(t) {
  const e = (0, Zu.sha256)((0, Zu.sha256)((0, Qu.hexToBytes)(t)));
  return (0, Qu.bytesToHex)(e.slice(0, 4));
}
function Lw(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = td(`${n}${e}`), s = (0, As.c32encode)(`${e}${r}`);
  return `${As.c32[t]}${s}`;
}
tr.c32checkEncode = Lw;
function Bw(t) {
  t = (0, As.c32normalize)(t);
  const e = (0, As.c32decode)(t.slice(1)), n = t[0], r = As.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), td(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
tr.c32checkDecode = Bw;
var ed = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.decode = Kr.encode = void 0;
const Wi = te, Ju = qe, nd = Yh, rd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Hw(t, e = "00") {
  const n = typeof t == "string" ? (0, Ju.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ju.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Wi.sha256)((0, Wi.sha256)(new Uint8Array([...r, ...n])));
  return nd(rd).encode([...r, ...n, ...s.slice(0, 4)]);
}
Kr.encode = Hw;
function _w(t) {
  const e = nd(rd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Wi.sha256)((0, Wi.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Kr.decode = _w;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = tr, n = Kr, r = qe;
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
})(ed);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = zc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = tr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = ed;
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
})(br);
function Mw(t, e) {
  switch (e = W0(e ?? K0), t) {
    case ze.P2PKH:
      switch (e.transactionVersion) {
        case Re.Mainnet:
          return Ce.MainnetSingleSig;
        case Re.Testnet:
          return Ce.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case ze.P2SH:
    case ze.P2SHNonSequential:
    case ze.P2WPKH:
    case ze.P2WSH:
    case ze.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Re.Mainnet:
          return Ce.MainnetMultiSig;
        case Re.Testnet:
          return Ce.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Uw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sd = Uint8Array.from({ length: 16 }, (t, e) => e), Nw = sd.map((t) => (9 * t + 5) % 16);
let Rc = [sd], Vc = [Nw];
for (let t = 0; t < 4; t++)
  for (let e of [Rc, Vc])
    e.push(e[t].map((n) => Uw[n]));
const id = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Tw = Rc.map((t, e) => t.map((n) => id[e][n])), Pw = Vc.map((t, e) => t.map((n) => id[e][n])), Dw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), kw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), gi = (t, e) => t << e | t >>> 32 - e;
function tf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const pi = new Uint32Array(16);
let Ow = class extends jc {
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
      pi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = Dw[h], A = kw[h], v = Rc[h], L = Vc[h], p = Tw[h], E = Pw[h];
      for (let S = 0; S < 16; S++) {
        const T = gi(r + tf(h, i, a, u) + pi[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = gi(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = gi(s + tf(b, o, c, f) + pi[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = gi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    pi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Fw = pr(() => new Ow()), bi = BigInt(2 ** 32 - 1), Pa = BigInt(32);
function od(t, e = !1) {
  return e ? { h: Number(t & bi), l: Number(t >> Pa & bi) } : { h: Number(t >> Pa & bi) | 0, l: Number(t & bi) | 0 };
}
function jw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = od(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const zw = (t, e) => BigInt(t >>> 0) << Pa | BigInt(e >>> 0), Rw = (t, e, n) => t >>> n, Vw = (t, e, n) => t << 32 - n | e >>> n, Gw = (t, e, n) => t >>> n | e << 32 - n, Kw = (t, e, n) => t << 32 - n | e >>> n, Ww = (t, e, n) => t << 64 - n | e >>> n - 32, qw = (t, e, n) => t >>> n - 32 | e << 64 - n, Yw = (t, e) => e, Xw = (t, e) => t, Zw = (t, e, n) => t << n | e >>> 32 - n, Qw = (t, e, n) => e << n | t >>> 32 - n, Jw = (t, e, n) => e << n - 32 | t >>> 64 - n, tx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ex(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const nx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), rx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, sx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ix = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ox = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ax = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: od,
  split: jw,
  toBig: zw,
  shrSH: Rw,
  shrSL: Vw,
  rotrSH: Gw,
  rotrSL: Kw,
  rotrBH: Ww,
  rotrBL: qw,
  rotr32H: Yw,
  rotr32L: Xw,
  rotlSH: Zw,
  rotlSL: Qw,
  rotlBH: Jw,
  rotlBL: tx,
  add: ex,
  add3L: nx,
  add3H: rx,
  add4L: sx,
  add4H: ix,
  add5H: ax,
  add5L: ox
}, [cx, lx] = q.split([
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
let Eo = class extends jc {
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
      const E = cn[p - 15] | 0, S = ln[p - 15] | 0, T = q.rotrSH(E, S, 1) ^ q.rotrSH(E, S, 8) ^ q.shrSH(E, S, 7), O = q.rotrSL(E, S, 1) ^ q.rotrSL(E, S, 8) ^ q.shrSL(E, S, 7), H = cn[p - 2] | 0, N = ln[p - 2] | 0, w = q.rotrSH(H, N, 19) ^ q.rotrBH(H, N, 61) ^ q.shrSH(H, N, 6), I = q.rotrSL(H, N, 19) ^ q.rotrBL(H, N, 61) ^ q.shrSL(H, N, 6), _ = q.add4L(O, I, ln[p - 7], ln[p - 16]), F = q.add4H(_, T, w, cn[p - 7], cn[p - 16]);
      cn[p] = F | 0, ln[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = q.rotrSH(l, g, 14) ^ q.rotrSH(l, g, 18) ^ q.rotrBH(l, g, 41), S = q.rotrSL(l, g, 14) ^ q.rotrSL(l, g, 18) ^ q.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = q.add5L(L, S, O, lx[p], ln[p]), N = q.add5H(H, v, E, T, cx[p], cn[p]), w = H | 0, I = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), _ = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = q.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = q.add3L(w, _, G);
      r = q.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = q.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = q.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = q.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = q.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = q.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    cn.fill(0), ln.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ux = class extends Eo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, fx = class extends Eo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, hx = class extends Eo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
pr(() => new Eo());
pr(() => new ux());
pr(() => new fx());
pr(() => new hx());
var qi = { exports: {} };
qi.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", y = "[object Promise]", A = "[object RegExp]", v = "[object Set]", L = "[object String]", p = "[object Symbol]", E = "[object WeakMap]", S = "[object ArrayBuffer]", T = "[object DataView]", O = "[object Float32Array]", H = "[object Float64Array]", N = "[object Int8Array]", w = "[object Int16Array]", I = "[object Int32Array]", _ = "[object Uint8Array]", F = "[object Uint8ClampedArray]", G = "[object Uint16Array]", P = "[object Uint32Array]", Pe = /[\\^$.*+?()[\]{}|]/g, Xe = /\w*$/, mr = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, C = {};
  C[i] = C[o] = C[S] = C[T] = C[a] = C[c] = C[O] = C[H] = C[N] = C[w] = C[I] = C[g] = C[h] = C[b] = C[A] = C[v] = C[L] = C[p] = C[_] = C[F] = C[G] = C[P] = !0, C[u] = C[f] = C[E] = !1;
  var ht = typeof Gt == "object" && Gt && Gt.Object === Object && Gt, pt = typeof self == "object" && self && self.Object === Object && self, ut = ht || pt || Function("return this")(), Mt = e && !e.nodeType && e, ds = Mt && !0 && t && !t.nodeType && t, Xs = ds && ds.exports === Mt;
  function Fo(d, x) {
    return d.set(x[0], x[1]), d;
  }
  function Ip(d, x) {
    return d.add(x), d;
  }
  function $p(d, x) {
    for (var $ = -1, D = d ? d.length : 0; ++$ < D && x(d[$], $, d) !== !1; )
      ;
    return d;
  }
  function Cp(d, x) {
    for (var $ = -1, D = x.length, Ht = d.length; ++$ < D; )
      d[Ht + $] = x[$];
    return d;
  }
  function Fl(d, x, $, D) {
    for (var Ht = -1, Kt = d ? d.length : 0; ++Ht < Kt; )
      $ = x($, d[Ht], Ht, d);
    return $;
  }
  function vp(d, x) {
    for (var $ = -1, D = Array(d); ++$ < d; )
      D[$] = x($);
    return D;
  }
  function Lp(d, x) {
    return d == null ? void 0 : d[x];
  }
  function jl(d) {
    var x = !1;
    if (d != null && typeof d.toString != "function")
      try {
        x = !!(d + "");
      } catch {
      }
    return x;
  }
  function zl(d) {
    var x = -1, $ = Array(d.size);
    return d.forEach(function(D, Ht) {
      $[++x] = [Ht, D];
    }), $;
  }
  function jo(d, x) {
    return function($) {
      return d(x($));
    };
  }
  function Rl(d) {
    var x = -1, $ = Array(d.size);
    return d.forEach(function(D) {
      $[++x] = D;
    }), $;
  }
  var Bp = Array.prototype, Hp = Function.prototype, Zs = Object.prototype, zo = ut["__core-js_shared__"], Vl = function() {
    var d = /[^.]+$/.exec(zo && zo.keys && zo.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Gl = Hp.toString, Ze = Zs.hasOwnProperty, Qs = Zs.toString, _p = RegExp(
    "^" + Gl.call(Ze).replace(Pe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Kl = Xs ? ut.Buffer : void 0, Wl = ut.Symbol, ql = ut.Uint8Array, Mp = jo(Object.getPrototypeOf, Object), Up = Object.create, Np = Zs.propertyIsEnumerable, Tp = Bp.splice, Yl = Object.getOwnPropertySymbols, Pp = Kl ? Kl.isBuffer : void 0, Dp = jo(Object.keys, Object), Ro = Er(ut, "DataView"), gs = Er(ut, "Map"), Vo = Er(ut, "Promise"), Go = Er(ut, "Set"), Ko = Er(ut, "WeakMap"), ps = Er(Object, "create"), kp = kn(Ro), Op = kn(gs), Fp = kn(Vo), jp = kn(Go), zp = kn(Ko), Xl = Wl ? Wl.prototype : void 0, Zl = Xl ? Xl.valueOf : void 0;
  function Pn(d) {
    var x = -1, $ = d ? d.length : 0;
    for (this.clear(); ++x < $; ) {
      var D = d[x];
      this.set(D[0], D[1]);
    }
  }
  function Rp() {
    this.__data__ = ps ? ps(null) : {};
  }
  function Vp(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function Gp(d) {
    var x = this.__data__;
    if (ps) {
      var $ = x[d];
      return $ === r ? void 0 : $;
    }
    return Ze.call(x, d) ? x[d] : void 0;
  }
  function Kp(d) {
    var x = this.__data__;
    return ps ? x[d] !== void 0 : Ze.call(x, d);
  }
  function Wp(d, x) {
    var $ = this.__data__;
    return $[d] = ps && x === void 0 ? r : x, this;
  }
  Pn.prototype.clear = Rp, Pn.prototype.delete = Vp, Pn.prototype.get = Gp, Pn.prototype.has = Kp, Pn.prototype.set = Wp;
  function De(d) {
    var x = -1, $ = d ? d.length : 0;
    for (this.clear(); ++x < $; ) {
      var D = d[x];
      this.set(D[0], D[1]);
    }
  }
  function qp() {
    this.__data__ = [];
  }
  function Yp(d) {
    var x = this.__data__, $ = Js(x, d);
    if ($ < 0)
      return !1;
    var D = x.length - 1;
    return $ == D ? x.pop() : Tp.call(x, $, 1), !0;
  }
  function Xp(d) {
    var x = this.__data__, $ = Js(x, d);
    return $ < 0 ? void 0 : x[$][1];
  }
  function Zp(d) {
    return Js(this.__data__, d) > -1;
  }
  function Qp(d, x) {
    var $ = this.__data__, D = Js($, d);
    return D < 0 ? $.push([d, x]) : $[D][1] = x, this;
  }
  De.prototype.clear = qp, De.prototype.delete = Yp, De.prototype.get = Xp, De.prototype.has = Zp, De.prototype.set = Qp;
  function Sr(d) {
    var x = -1, $ = d ? d.length : 0;
    for (this.clear(); ++x < $; ) {
      var D = d[x];
      this.set(D[0], D[1]);
    }
  }
  function Jp() {
    this.__data__ = {
      hash: new Pn(),
      map: new (gs || De)(),
      string: new Pn()
    };
  }
  function t1(d) {
    return ti(this, d).delete(d);
  }
  function e1(d) {
    return ti(this, d).get(d);
  }
  function n1(d) {
    return ti(this, d).has(d);
  }
  function r1(d, x) {
    return ti(this, d).set(d, x), this;
  }
  Sr.prototype.clear = Jp, Sr.prototype.delete = t1, Sr.prototype.get = e1, Sr.prototype.has = n1, Sr.prototype.set = r1;
  function Ar(d) {
    this.__data__ = new De(d);
  }
  function s1() {
    this.__data__ = new De();
  }
  function i1(d) {
    return this.__data__.delete(d);
  }
  function o1(d) {
    return this.__data__.get(d);
  }
  function a1(d) {
    return this.__data__.has(d);
  }
  function c1(d, x) {
    var $ = this.__data__;
    if ($ instanceof De) {
      var D = $.__data__;
      if (!gs || D.length < n - 1)
        return D.push([d, x]), this;
      $ = this.__data__ = new Sr(D);
    }
    return $.set(d, x), this;
  }
  Ar.prototype.clear = s1, Ar.prototype.delete = i1, Ar.prototype.get = o1, Ar.prototype.has = a1, Ar.prototype.set = c1;
  function l1(d, x) {
    var $ = Yo(d) || U1(d) ? vp(d.length, String) : [], D = $.length, Ht = !!D;
    for (var Kt in d)
      Ze.call(d, Kt) && !(Ht && (Kt == "length" || B1(Kt, D))) && $.push(Kt);
    return $;
  }
  function Ql(d, x, $) {
    var D = d[x];
    (!(Ze.call(d, x) && nu(D, $)) || $ === void 0 && !(x in d)) && (d[x] = $);
  }
  function Js(d, x) {
    for (var $ = d.length; $--; )
      if (nu(d[$][0], x))
        return $;
    return -1;
  }
  function u1(d, x) {
    return d && Jl(x, Xo(x), d);
  }
  function Wo(d, x, $, D, Ht, Kt, ke) {
    var Wt;
    if (D && (Wt = Kt ? D(d, Ht, Kt, ke) : D(d)), Wt !== void 0)
      return Wt;
    if (!ei(d))
      return d;
    var iu = Yo(d);
    if (iu) {
      if (Wt = C1(d), !x)
        return E1(d, Wt);
    } else {
      var Ir = Dn(d), ou = Ir == f || Ir == l;
      if (T1(d))
        return b1(d, x);
      if (Ir == b || Ir == i || ou && !Kt) {
        if (jl(d))
          return Kt ? d : {};
        if (Wt = v1(ou ? {} : d), !x)
          return I1(d, u1(Wt, d));
      } else {
        if (!C[Ir])
          return Kt ? d : {};
        Wt = L1(d, Ir, Wo, x);
      }
    }
    ke || (ke = new Ar());
    var au = ke.get(d);
    if (au)
      return au;
    if (ke.set(d, Wt), !iu)
      var cu = $ ? $1(d) : Xo(d);
    return $p(cu || d, function(Zo, ni) {
      cu && (ni = Zo, Zo = d[ni]), Ql(Wt, ni, Wo(Zo, x, $, D, ni, d, ke));
    }), Wt;
  }
  function f1(d) {
    return ei(d) ? Up(d) : {};
  }
  function h1(d, x, $) {
    var D = x(d);
    return Yo(d) ? D : Cp(D, $(d));
  }
  function d1(d) {
    return Qs.call(d);
  }
  function g1(d) {
    if (!ei(d) || _1(d))
      return !1;
    var x = su(d) || jl(d) ? _p : mr;
    return x.test(kn(d));
  }
  function p1(d) {
    if (!eu(d))
      return Dp(d);
    var x = [];
    for (var $ in Object(d))
      Ze.call(d, $) && $ != "constructor" && x.push($);
    return x;
  }
  function b1(d, x) {
    if (x)
      return d.slice();
    var $ = new d.constructor(d.length);
    return d.copy($), $;
  }
  function qo(d) {
    var x = new d.constructor(d.byteLength);
    return new ql(x).set(new ql(d)), x;
  }
  function y1(d, x) {
    var $ = x ? qo(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.byteLength);
  }
  function w1(d, x, $) {
    var D = x ? $(zl(d), !0) : zl(d);
    return Fl(D, Fo, new d.constructor());
  }
  function x1(d) {
    var x = new d.constructor(d.source, Xe.exec(d));
    return x.lastIndex = d.lastIndex, x;
  }
  function m1(d, x, $) {
    var D = x ? $(Rl(d), !0) : Rl(d);
    return Fl(D, Ip, new d.constructor());
  }
  function S1(d) {
    return Zl ? Object(Zl.call(d)) : {};
  }
  function A1(d, x) {
    var $ = x ? qo(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.length);
  }
  function E1(d, x) {
    var $ = -1, D = d.length;
    for (x || (x = Array(D)); ++$ < D; )
      x[$] = d[$];
    return x;
  }
  function Jl(d, x, $, D) {
    $ || ($ = {});
    for (var Ht = -1, Kt = x.length; ++Ht < Kt; ) {
      var ke = x[Ht], Wt = void 0;
      Ql($, ke, Wt === void 0 ? d[ke] : Wt);
    }
    return $;
  }
  function I1(d, x) {
    return Jl(d, tu(d), x);
  }
  function $1(d) {
    return h1(d, Xo, tu);
  }
  function ti(d, x) {
    var $ = d.__data__;
    return H1(x) ? $[typeof x == "string" ? "string" : "hash"] : $.map;
  }
  function Er(d, x) {
    var $ = Lp(d, x);
    return g1($) ? $ : void 0;
  }
  var tu = Yl ? jo(Yl, Object) : k1, Dn = d1;
  (Ro && Dn(new Ro(new ArrayBuffer(1))) != T || gs && Dn(new gs()) != g || Vo && Dn(Vo.resolve()) != y || Go && Dn(new Go()) != v || Ko && Dn(new Ko()) != E) && (Dn = function(d) {
    var x = Qs.call(d), $ = x == b ? d.constructor : void 0, D = $ ? kn($) : void 0;
    if (D)
      switch (D) {
        case kp:
          return T;
        case Op:
          return g;
        case Fp:
          return y;
        case jp:
          return v;
        case zp:
          return E;
      }
    return x;
  });
  function C1(d) {
    var x = d.length, $ = d.constructor(x);
    return x && typeof d[0] == "string" && Ze.call(d, "index") && ($.index = d.index, $.input = d.input), $;
  }
  function v1(d) {
    return typeof d.constructor == "function" && !eu(d) ? f1(Mp(d)) : {};
  }
  function L1(d, x, $, D) {
    var Ht = d.constructor;
    switch (x) {
      case S:
        return qo(d);
      case a:
      case c:
        return new Ht(+d);
      case T:
        return y1(d, D);
      case O:
      case H:
      case N:
      case w:
      case I:
      case _:
      case F:
      case G:
      case P:
        return A1(d, D);
      case g:
        return w1(d, D, $);
      case h:
      case L:
        return new Ht(d);
      case A:
        return x1(d);
      case v:
        return m1(d, D, $);
      case p:
        return S1(d);
    }
  }
  function B1(d, x) {
    return x = x ?? s, !!x && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < x;
  }
  function H1(d) {
    var x = typeof d;
    return x == "string" || x == "number" || x == "symbol" || x == "boolean" ? d !== "__proto__" : d === null;
  }
  function _1(d) {
    return !!Vl && Vl in d;
  }
  function eu(d) {
    var x = d && d.constructor, $ = typeof x == "function" && x.prototype || Zs;
    return d === $;
  }
  function kn(d) {
    if (d != null) {
      try {
        return Gl.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function M1(d) {
    return Wo(d, !0, !0);
  }
  function nu(d, x) {
    return d === x || d !== d && x !== x;
  }
  function U1(d) {
    return N1(d) && Ze.call(d, "callee") && (!Np.call(d, "callee") || Qs.call(d) == i);
  }
  var Yo = Array.isArray;
  function ru(d) {
    return d != null && P1(d.length) && !su(d);
  }
  function N1(d) {
    return D1(d) && ru(d);
  }
  var T1 = Pp || O1;
  function su(d) {
    var x = ei(d) ? Qs.call(d) : "";
    return x == f || x == l;
  }
  function P1(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function ei(d) {
    var x = typeof d;
    return !!d && (x == "object" || x == "function");
  }
  function D1(d) {
    return !!d && typeof d == "object";
  }
  function Xo(d) {
    return ru(d) ? l1(d) : p1(d);
  }
  function k1() {
    return [];
  }
  function O1() {
    return !1;
  }
  t.exports = M1;
})(qi, qi.exports);
var dx = qi.exports;
const ad = /* @__PURE__ */ Gh(dx);
var Da;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Da || (Da = {}));
function gx(t, e) {
  return { type: Da.Address, version: t, hash160: e };
}
function px(t) {
  return br.c32address(t.version, t.hash160);
}
const bx = (t) => Fw(J0(t)), yx = (t) => z(bx(t));
It.hmacSha256Sync = (t, ...e) => {
  const n = Z0.create(J0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function wx(t, e = "mainnet") {
  e = W0(e), t = typeof t == "string" ? st(t) : t;
  const n = Mw(ze.P2PKH, e), r = gx(n, yx(t));
  return px(r);
}
function xx(t, e) {
  const n = Dt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = wx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Dt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function mx(t, e = null) {
  let n;
  e ? n = xx(t, e) : n = Dt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ef = "_blockstackDidCheckEchoReply", Sx = "echoReply", Ax = "authContinuation";
function Ex(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Ix() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[ef];
  if (typeof e == "boolean")
    return e;
  const n = Ex(t.location.search), r = n[Sx];
  if (r) {
    t[ef] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Ax];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class vs {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new ho();
    else
      throw new f2("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Pu(e.sessionOptions) : this.store = new Pu() : e ? this.store = new Tu(e.sessionOptions) : this.store = new Tu();
  }
  makeAuthRequestToken(e, n, r, s, i, o = d2().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new $a("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, lw(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = cw();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Cc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Ix())
        return Hr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Hr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = P2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ri("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Dt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await gw(e))
      throw new ri("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (na(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Uu(s, i.private_key);
          } catch {
            if (Hr.warn("Failed decryption of appPrivateKey, will try to use as given"), !It.isValidPrivateKey(i.private_key))
              throw new ri("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Uu(s, c);
          } catch {
            Hr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ri("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = $2, f;
    na(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), na(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: V0(i.iss),
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
        l.profile = Object.assign({}, c2);
      else {
        const b = await h.text(), y = JSON.parse(b);
        l.profile = mx(y[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new $a("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), $y(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Cy(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
vs.prototype.makeAuthRequest = vs.prototype.makeAuthRequestToken;
const $x = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Cx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = $x(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Io(r.id));
  return e.concat(n);
}, Io = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Gc = "STX_PROVIDER", ge = () => typeof window > "u" ? null : window.localStorage.getItem(Gc), cd = (t) => {
  typeof window < "u" && window.localStorage.setItem(Gc, t);
}, ld = () => {
  typeof window < "u" && window.localStorage.removeItem(Gc);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof Gt < "u" && Gt || {}, r = {
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
      function s(w) {
        return w && DataView.prototype.isPrototypeOf(w);
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
        ], o = ArrayBuffer.isView || function(w) {
          return w && i.indexOf(Object.prototype.toString.call(w)) > -1;
        };
      function a(w) {
        if (typeof w != "string" && (w = String(w)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(w) || w === "")
          throw new TypeError('Invalid character in header field name: "' + w + '"');
        return w.toLowerCase();
      }
      function c(w) {
        return typeof w != "string" && (w = String(w)), w;
      }
      function u(w) {
        var I = {
          next: function() {
            var _ = w.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function f(w) {
        this.map = {}, w instanceof f ? w.forEach(function(I, _) {
          this.append(_, I);
        }, this) : Array.isArray(w) ? w.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : w && Object.getOwnPropertyNames(w).forEach(function(I) {
          this.append(I, w[I]);
        }, this);
      }
      f.prototype.append = function(w, I) {
        w = a(w), I = c(I);
        var _ = this.map[w];
        this.map[w] = _ ? _ + ", " + I : I;
      }, f.prototype.delete = function(w) {
        delete this.map[a(w)];
      }, f.prototype.get = function(w) {
        return w = a(w), this.has(w) ? this.map[w] : null;
      }, f.prototype.has = function(w) {
        return this.map.hasOwnProperty(a(w));
      }, f.prototype.set = function(w, I) {
        this.map[a(w)] = c(I);
      }, f.prototype.forEach = function(w, I) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && w.call(I, this.map[_], _, this);
      }, f.prototype.keys = function() {
        var w = [];
        return this.forEach(function(I, _) {
          w.push(_);
        }), u(w);
      }, f.prototype.values = function() {
        var w = [];
        return this.forEach(function(I) {
          w.push(I);
        }), u(w);
      }, f.prototype.entries = function() {
        var w = [];
        return this.forEach(function(I, _) {
          w.push([_, I]);
        }), u(w);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(w) {
        if (!w._noBody) {
          if (w.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          w.bodyUsed = !0;
        }
      }
      function g(w) {
        return new Promise(function(I, _) {
          w.onload = function() {
            I(w.result);
          }, w.onerror = function() {
            _(w.error);
          };
        });
      }
      function h(w) {
        var I = new FileReader(), _ = g(I);
        return I.readAsArrayBuffer(w), _;
      }
      function b(w) {
        var I = new FileReader(), _ = g(I), F = /charset=([A-Za-z0-9_-]+)/.exec(w.type), G = F ? F[1] : "utf-8";
        return I.readAsText(w, G), _;
      }
      function y(w) {
        for (var I = new Uint8Array(w), _ = new Array(I.length), F = 0; F < I.length; F++)
          _[F] = String.fromCharCode(I[F]);
        return _.join("");
      }
      function A(w) {
        if (w.slice)
          return w.slice(0);
        var I = new Uint8Array(w.byteLength);
        return I.set(new Uint8Array(w)), I.buffer;
      }
      function v() {
        return this.bodyUsed = !1, this._initBody = function(w) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = w, w ? typeof w == "string" ? this._bodyText = w : r.blob && Blob.prototype.isPrototypeOf(w) ? this._bodyBlob = w : r.formData && FormData.prototype.isPrototypeOf(w) ? this._bodyFormData = w : r.searchParams && URLSearchParams.prototype.isPrototypeOf(w) ? this._bodyText = w.toString() : r.arrayBuffer && r.blob && s(w) ? (this._bodyArrayBuffer = A(w.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(w) || o(w)) ? this._bodyArrayBuffer = A(w) : this._bodyText = w = Object.prototype.toString.call(w) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof w == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(w) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var w = l(this);
          if (w)
            return w;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var w = l(this);
            return w || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var w = l(this);
          if (w)
            return w;
          if (this._bodyBlob)
            return b(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(y(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(S);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var L = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(w) {
        var I = w.toUpperCase();
        return L.indexOf(I) > -1 ? I : w;
      }
      function E(w, I) {
        if (!(this instanceof E))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var _ = I.body;
        if (w instanceof E) {
          if (w.bodyUsed)
            throw new TypeError("Already read");
          this.url = w.url, this.credentials = w.credentials, I.headers || (this.headers = new f(w.headers)), this.method = w.method, this.mode = w.mode, this.signal = w.signal, !_ && w._bodyInit != null && (_ = w._bodyInit, w.bodyUsed = !0);
        } else
          this.url = String(w);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new f(I.headers)), this.method = p(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var P = new AbortController();
            return P.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var F = /([?&])_=[^&]*/;
          if (F.test(this.url))
            this.url = this.url.replace(F, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var G = /\?/;
            this.url += (G.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      E.prototype.clone = function() {
        return new E(this, { body: this._bodyInit });
      };
      function S(w) {
        var I = new FormData();
        return w.trim().split("&").forEach(function(_) {
          if (_) {
            var F = _.split("="), G = F.shift().replace(/\+/g, " "), P = F.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(G), decodeURIComponent(P));
          }
        }), I;
      }
      function T(w) {
        var I = new f(), _ = w.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(F) {
          return F.indexOf(`
`) === 0 ? F.substr(1, F.length) : F;
        }).forEach(function(F) {
          var G = F.split(":"), P = G.shift().trim();
          if (P) {
            var Pe = G.join(":").trim();
            try {
              I.append(P, Pe);
            } catch (Xe) {
              console.warn("Response " + Xe.message);
            }
          }
        }), I;
      }
      v.call(E.prototype);
      function O(w, I) {
        if (!(this instanceof O))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new f(I.headers), this.url = I.url || "", this._initBody(w);
      }
      v.call(O.prototype), O.prototype.clone = function() {
        return new O(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, O.error = function() {
        var w = new O(null, { status: 200, statusText: "" });
        return w.ok = !1, w.status = 0, w.type = "error", w;
      };
      var H = [301, 302, 303, 307, 308];
      O.redirect = function(w, I) {
        if (H.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new O(null, { status: I, headers: { location: w } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(I, _) {
          this.message = I, this.name = _;
          var F = Error(I);
          this.stack = F.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function N(w, I) {
        return new Promise(function(_, F) {
          var G = new E(w, I);
          if (G.signal && G.signal.aborted)
            return F(new e.DOMException("Aborted", "AbortError"));
          var P = new XMLHttpRequest();
          function Pe() {
            P.abort();
          }
          P.onload = function() {
            var m = {
              statusText: P.statusText,
              headers: T(P.getAllResponseHeaders() || "")
            };
            G.url.indexOf("file://") === 0 && (P.status < 200 || P.status > 599) ? m.status = 200 : m.status = P.status, m.url = "responseURL" in P ? P.responseURL : m.headers.get("X-Request-URL");
            var C = "response" in P ? P.response : P.responseText;
            setTimeout(function() {
              _(new O(C, m));
            }, 0);
          }, P.onerror = function() {
            setTimeout(function() {
              F(new TypeError("Network request failed"));
            }, 0);
          }, P.ontimeout = function() {
            setTimeout(function() {
              F(new TypeError("Network request timed out"));
            }, 0);
          }, P.onabort = function() {
            setTimeout(function() {
              F(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Xe(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (P.open(G.method, Xe(G.url), !0), G.credentials === "include" ? P.withCredentials = !0 : G.credentials === "omit" && (P.withCredentials = !1), "responseType" in P && (r.blob ? P.responseType = "blob" : r.arrayBuffer && (P.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof f || n.Headers && I.headers instanceof n.Headers)) {
            var mr = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(m) {
              mr.push(a(m)), P.setRequestHeader(m, c(I.headers[m]));
            }), G.headers.forEach(function(m, C) {
              mr.indexOf(C) === -1 && P.setRequestHeader(C, m);
            });
          } else
            G.headers.forEach(function(m, C) {
              P.setRequestHeader(C, m);
            });
          G.signal && (G.signal.addEventListener("abort", Pe), P.onreadystatechange = function() {
            P.readyState === 4 && G.signal.removeEventListener("abort", Pe);
          }), P.send(typeof G._bodyInit > "u" ? null : G._bodyInit);
        });
      }
      return N.polyfill = !0, n.fetch || (n.fetch = N, n.Headers = f, n.Request = E, n.Response = O), e.Headers = f, e.Request = E, e.Response = O, e.fetch = N, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Gt);
})();
const vx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Lx(t, e) {
  const n = {};
  return Object.assign(n, vx, e), await fetch(t, n);
}
function Bx(t) {
  let e = Lx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Hx(...t) {
  const { fetchLib: e, middlewares: n } = Bx(t);
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
var Wr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wr || (Wr = {}));
var er;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(er || (er = {}));
var nf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(nf || (nf = {}));
const _x = "https://api.mainnet.hiro.so", Mx = "https://api.testnet.hiro.so", Ux = "http://localhost:3999", Nx = ["mainnet", "testnet", "devnet", "mocknet"];
let nr = class {
  constructor(e) {
    this.version = er.Mainnet, this.chainId = Wr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === er.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Hx();
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
nr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ka();
    case "testnet":
      return new Oa();
    case "devnet":
      return new Tx();
    case "mocknet":
      return new ud();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Nx.join(", ")}`);
  }
};
nr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : nr.fromName(t);
let ka = class extends nr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = er.Mainnet, this.chainId = Wr.Mainnet;
  }
}, Oa = class extends nr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Mx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = er.Testnet, this.chainId = Wr.Testnet;
  }
}, ud = class extends nr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = er.Testnet, this.chainId = Wr.Testnet;
  }
};
const Tx = ud;
var rr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(rr || (rr = {}));
var Yi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Yi || (Yi = {}));
rr.Mainnet;
var sr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sr || (sr = {}));
var ir;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ir || (ir = {}));
sr.Mainnet;
const Px = {
  chainId: rr.Mainnet,
  transactionVersion: sr.Mainnet,
  peerNetworkId: Yi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ir.MainnetSingleSig,
    multiSig: ir.MainnetMultiSig
  },
  client: { baseUrl: Ih }
}, Fa = {
  chainId: rr.Testnet,
  transactionVersion: sr.Testnet,
  peerNetworkId: Yi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ir.TestnetSingleSig,
    multiSig: ir.TestnetMultiSig
  },
  client: { baseUrl: $h }
}, Ni = {
  ...Fa,
  addressVersion: { ...Fa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Ch }
}, Dx = {
  ...Ni,
  addressVersion: { ...Ni.addressVersion },
  client: { ...Ni.client }
};
function kx(t) {
  switch (t) {
    case "mainnet":
      return Px;
    case "testnet":
      return Fa;
    case "devnet":
      return Ni;
    case "mocknet":
      return Dx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ox(t) {
  return typeof t == "string" ? kx(t) : t;
}
function Fx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const rf = /* @__PURE__ */ new Map();
function fd(t, e) {
  const n = rf.get(t);
  if (n !== void 0)
    return n(e);
  const r = Fx(t);
  return rf.set(t, r), fd(t, e);
}
let gt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? st(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return M2(this.readBytes(4), 0);
  }
  readUInt8() {
    return H2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return L2(this.readBytes(2), 0);
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
    if (fd(e, r))
      return r;
    throw n(r);
  }
};
const jx = 128, zx = 128, hd = 16, Wn = 32, ja = 80, $o = 65, Rx = 32, Vx = 64, Xi = 34, Gx = 1 + 16 * 1024 * 1024, Kx = 165, Wx = 16, qx = 16, Yx = 20, Xx = qx + 2 + Yx, Zx = Xx + 4, Qx = Gx + (Kx + Wx * Zx);
var ct;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ct || (ct = {}));
var za;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(za || (za = {}));
var Zt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Zt || (Zt = {}));
const la = ["onChainOnly", "offChainOnly", "any"];
la[0] + "", Zt.OnChainOnly, la[1] + "", Zt.OffChainOnly, la[2] + "", Zt.Any, Zt.OnChainOnly + "", Zt.OnChainOnly, Zt.OffChainOnly + "", Zt.OffChainOnly, Zt.Any + "", Zt.Any;
var Zi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Zi || (Zi = {}));
var bt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(bt || (bt = {}));
var At;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(At || (At = {}));
var ft;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ft || (ft = {}));
var xt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xt || (xt = {}));
var Es;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Es || (Es = {}));
var Ra;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ra || (Ra = {}));
var Va;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Va || (Va = {}));
var Vt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Vt || (Vt = {}));
var sf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(sf || (sf = {}));
var Ga;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ga || (Ga = {}));
var fe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fe || (fe = {}));
var of;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(of || (of = {}));
let Co = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, _r = class extends Co {
  constructor(e) {
    super(e);
  }
}, Ft = class extends Co {
  constructor(e) {
    super(e);
  }
}, Qi = class extends Co {
  constructor(e) {
    super(e);
  }
}, Rn = class extends Co {
  constructor(e) {
    super(e);
  }
};
function Ka(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Jx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function tm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ka(t.outputLen), Ka(t.blockLen);
}
function em(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function nm(t, e) {
  dd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vn = {
  number: Ka,
  bool: Jx,
  bytes: dd,
  hash: tm,
  exists: em,
  output: nm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ua = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), me = (t, e) => t << 32 - e | t >>> e, rm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!rm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function sm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Kc(t) {
  if (typeof t == "string" && (t = sm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let gd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function yr(t) {
  const e = (r) => t().update(Kc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let pd = class extends gd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Vn.hash(e);
    const r = Kc(n);
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
    return Vn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Vn.exists(this), Vn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const bd = (t, e, n) => new pd(t, e).update(n).digest();
bd.create = (t, e) => new pd(t, e);
function im(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Wc = class extends gd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ua(this.buffer);
  }
  update(e) {
    Vn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Kc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ua(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Vn.exists(this), Vn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    im(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ua(e), c = this.outputLen;
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
const om = (t, e, n) => t & e ^ ~t & n, am = (t, e, n) => t & e ^ t & n ^ e & n, cm = new Uint32Array([
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
let yd = class extends Wc {
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
      const g = fn[l - 15], h = fn[l - 2], b = me(g, 7) ^ me(g, 18) ^ g >>> 3, y = me(h, 17) ^ me(h, 19) ^ h >>> 10;
      fn[l] = y + fn[l - 7] + b + fn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = me(a, 6) ^ me(a, 11) ^ me(a, 25), h = f + g + om(a, c, u) + cm[l] + fn[l] | 0, y = (me(r, 2) ^ me(r, 13) ^ me(r, 22)) + am(r, s, i) | 0;
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
}, lm = class extends yd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const qc = yr(() => new yd());
yr(() => new lm());
const um = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), wd = Uint8Array.from({ length: 16 }, (t, e) => e), fm = wd.map((t) => (9 * t + 5) % 16);
let Yc = [wd], Xc = [fm];
for (let t = 0; t < 4; t++)
  for (let e of [Yc, Xc])
    e.push(e[t].map((n) => um[n]));
const xd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hm = Yc.map((t, e) => t.map((n) => xd[e][n])), dm = Xc.map((t, e) => t.map((n) => xd[e][n])), gm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yi = (t, e) => t << e | t >>> 32 - e;
function af(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const wi = new Uint32Array(16);
let bm = class extends Wc {
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
      wi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = gm[h], A = pm[h], v = Yc[h], L = Xc[h], p = hm[h], E = dm[h];
      for (let S = 0; S < 16; S++) {
        const T = yi(r + af(h, i, a, u) + wi[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = yi(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = yi(s + af(b, o, c, f) + wi[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = yi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    wi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const ym = yr(() => new bm()), xi = BigInt(2 ** 32 - 1), Wa = BigInt(32);
function md(t, e = !1) {
  return e ? { h: Number(t & xi), l: Number(t >> Wa & xi) } : { h: Number(t >> Wa & xi) | 0, l: Number(t & xi) | 0 };
}
function wm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = md(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const xm = (t, e) => BigInt(t >>> 0) << Wa | BigInt(e >>> 0), mm = (t, e, n) => t >>> n, Sm = (t, e, n) => t << 32 - n | e >>> n, Am = (t, e, n) => t >>> n | e << 32 - n, Em = (t, e, n) => t << 32 - n | e >>> n, Im = (t, e, n) => t << 64 - n | e >>> n - 32, $m = (t, e, n) => t >>> n - 32 | e << 64 - n, Cm = (t, e) => e, vm = (t, e) => t, Lm = (t, e, n) => t << n | e >>> 32 - n, Bm = (t, e, n) => e << n | t >>> 32 - n, Hm = (t, e, n) => e << n - 32 | t >>> 64 - n, _m = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Mm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Um = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Nm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Tm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Pm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Dm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), km = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: md,
  split: wm,
  toBig: xm,
  shrSH: mm,
  shrSL: Sm,
  rotrSH: Am,
  rotrSL: Em,
  rotrBH: Im,
  rotrBL: $m,
  rotr32H: Cm,
  rotr32L: vm,
  rotlSH: Lm,
  rotlSL: Bm,
  rotlBH: Hm,
  rotlBL: _m,
  add: Mm,
  add3L: Um,
  add3H: Nm,
  add4L: Tm,
  add4H: Pm,
  add5H: km,
  add5L: Dm
}, [Om, Fm] = Y.split([
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
let vo = class extends Wc {
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
      const E = hn[p - 15] | 0, S = dn[p - 15] | 0, T = Y.rotrSH(E, S, 1) ^ Y.rotrSH(E, S, 8) ^ Y.shrSH(E, S, 7), O = Y.rotrSL(E, S, 1) ^ Y.rotrSL(E, S, 8) ^ Y.shrSL(E, S, 7), H = hn[p - 2] | 0, N = dn[p - 2] | 0, w = Y.rotrSH(H, N, 19) ^ Y.rotrBH(H, N, 61) ^ Y.shrSH(H, N, 6), I = Y.rotrSL(H, N, 19) ^ Y.rotrBL(H, N, 61) ^ Y.shrSL(H, N, 6), _ = Y.add4L(O, I, dn[p - 7], dn[p - 16]), F = Y.add4H(_, T, w, hn[p - 7], hn[p - 16]);
      hn[p] = F | 0, dn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = Y.rotrSH(l, g, 14) ^ Y.rotrSH(l, g, 18) ^ Y.rotrBH(l, g, 41), S = Y.rotrSL(l, g, 14) ^ Y.rotrSL(l, g, 18) ^ Y.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = Y.add5L(L, S, O, Fm[p], dn[p]), N = Y.add5H(H, v, E, T, Om[p], hn[p]), w = H | 0, I = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), _ = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Y.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = Y.add3L(w, _, G);
      r = Y.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Y.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Y.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Y.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = Y.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    hn.fill(0), dn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, jm = class extends vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, zm = class extends vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Rm = class extends vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
yr(() => new vo());
yr(() => new jm());
const Vm = yr(() => new zm());
yr(() => new Rm());
var et;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(et || (et = {}));
var Lt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Lt || (Lt = {}));
function Zc(t) {
  return Lt[t];
}
const Gm = () => ({ type: et.BoolTrue }), Km = () => ({ type: et.BoolFalse }), Wm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: et.Buffer, value: z(t) };
}, cf = BigInt("0xffffffffffffffffffffffffffffffff"), qm = BigInt(0), lf = BigInt("0x7fffffffffffffffffffffffffffffff"), uf = BigInt("-170141183460469231731687303715884105728"), Ym = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = va(st(t))), Yt(t, Uint8Array) && (t = va(t));
  const e = Pt(t);
  if (e > lf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${lf}`);
  if (e < uf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${uf}`);
  return { type: et.Int, value: e };
}, Xm = (t) => {
  const e = Pt(t);
  if (e < qm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > cf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${cf}`);
  return { type: et.UInt, value: e };
};
function Zm(t) {
  return { type: et.List, value: t };
}
function Sd() {
  return { type: et.OptionalNone };
}
function Ad(t) {
  return { type: et.OptionalSome, value: t };
}
var U;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(U || (U = {}));
function Qm() {
  return {
    type: U.Address,
    version: ir.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function ff(t) {
  if (t && _d(t, Xi))
    throw new Error(`Memo exceeds maximum length of ${Xi} bytes`);
  return { type: U.MemoString, content: t };
}
function Qc(t, e) {
  return {
    type: U.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function qa(t) {
  if (st(t).byteLength != $o)
    throw Error("Invalid signature");
  return {
    type: U.MessageSignature,
    data: t
  };
}
function Jm(t, e, n) {
  return typeof t == "string" && (t = pS(t)), typeof n == "string" && (n = ff(n)), {
    type: U.Payload,
    payloadType: ct.TokenTransfer,
    recipient: t,
    amount: Pt(e),
    memo: n ?? ff("")
  };
}
function tS(t, e, n, r) {
  return typeof e == "string" && (e = pe(e)), typeof n == "string" && (n = pe(n)), {
    type: U.Payload,
    payloadType: ct.ContractCall,
    contractAddress: typeof t == "string" ? Tn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function eS(t) {
  return pe(t, 4, 1e5);
}
function hf(t, e, n) {
  return typeof t == "string" && (t = pe(t)), typeof e == "string" && (e = eS(e)), typeof n == "number" ? {
    type: U.Payload,
    payloadType: ct.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: U.Payload,
    payloadType: ct.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function nS() {
  return { type: U.Payload, payloadType: ct.PoisonMicroblock };
}
function df(t, e) {
  if (t.byteLength != Wn)
    throw Error(`Coinbase buffer size must be ${Wn} bytes`);
  return e != null ? {
    type: U.Payload,
    payloadType: ct.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: U.Payload,
    payloadType: ct.Coinbase,
    coinbaseBytes: t
  };
}
function rS(t, e, n) {
  if (t.byteLength != Wn)
    throw Error(`Coinbase buffer size must be ${Wn} bytes`);
  if (n.byteLength != ja)
    throw Error(`VRF proof buffer size must be ${ja} bytes`);
  return {
    type: U.Payload,
    payloadType: ct.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === et.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function sS(t, e, n, r, s, i, o) {
  return {
    type: U.Payload,
    payloadType: ct.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function pe(t, e, n) {
  const r = e || 1, s = n || jx;
  if (_d(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: U.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function iS(t, e, n) {
  return {
    type: U.Asset,
    address: Tn(t),
    contractName: pe(e),
    assetName: pe(n)
  };
}
function Tn(t) {
  const e = br.c32addressDecode(t);
  return {
    type: U.Address,
    version: e[0],
    hash160: e[1]
  };
}
function oS(t, e) {
  const n = Tn(t), r = pe(e);
  return {
    type: U.Principal,
    prefix: Vt.Contract,
    address: n,
    contractName: r
  };
}
function aS(t) {
  const e = Tn(t);
  return {
    type: U.Principal,
    prefix: Vt.Standard,
    address: e
  };
}
function Mr(t, e) {
  return {
    pubKeyEncoding: t,
    type: U.TransactionAuthField,
    contents: e
  };
}
function Fe(t) {
  switch (t.type) {
    case U.Address:
      return zs(t);
    case U.Principal:
      return Ed(t);
    case U.LengthPrefixedString:
      return Yr(t);
    case U.MemoString:
      return lS(t);
    case U.Asset:
      return $d(t);
    case U.PostCondition:
      return vd(t);
    case U.PublicKey:
      return Za(t);
    case U.LengthPrefixedList:
      return Jc(t);
    case U.Payload:
      return Ld(t);
    case U.TransactionAuthField:
      return gS(t);
    case U.MessageSignature:
      return tl(t);
  }
}
function zs(t) {
  const e = [];
  return e.push(st(Ds(t.version, 1))), e.push(st(t.hash160)), $t(e);
}
function qr(t) {
  const e = Yt(t, gt) ? t : new gt(t), n = fo(z(e.readBytes(1))), r = z(e.readBytes(20));
  return { type: U.Address, version: n, hash160: r };
}
function Ed(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Vt.Standard || t.prefix === Vt.Contract) && e.push(zs(t.address)), t.prefix === Vt.Contract && e.push(Yr(t.contractName)), $t(e);
}
function cS(t) {
  const e = Yt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(Vt, (i) => {
    throw new Ft(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Vt.Origin)
    return { type: U.Principal, prefix: n };
  const r = qr(e);
  if (n === Vt.Standard)
    return { type: U.Principal, prefix: n, address: r };
  const s = oe(e);
  return {
    type: U.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Yr(t) {
  const e = [], n = dr(t.content), r = n.byteLength;
  return e.push(st(Ds(r, t.lengthPrefixBytes))), e.push(n), $t(e);
}
function oe(t, e, n) {
  e = e || 1;
  const r = Yt(t, gt) ? t : new gt(t), s = fo(z(r.readBytes(e))), i = ks(r.readBytes(s));
  return pe(i, e, n ?? 128);
}
function lS(t) {
  const e = [], n = dr(t.content), r = kS(z(n), Xi * 2);
  return e.push(st(r)), $t(e);
}
function Id(t) {
  const e = Yt(t, gt) ? t : new gt(t);
  let n = ks(e.readBytes(Xi));
  return n = n.replace(/\u0000*$/, ""), { type: U.MemoString, content: n };
}
function $d(t) {
  const e = [];
  return e.push(zs(t.address)), e.push(Yr(t.contractName)), e.push(Yr(t.assetName)), $t(e);
}
function Ya(t) {
  const e = Yt(t, gt) ? t : new gt(t);
  return {
    type: U.Asset,
    address: qr(e),
    contractName: oe(e),
    assetName: oe(e)
  };
}
function Jc(t) {
  const e = t.values, n = [];
  n.push(st(Ds(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Fe(r));
  return $t(n);
}
function Cd(t, e, n) {
  const r = Yt(t, gt) ? t : new gt(t), s = fo(z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case U.Address:
        i.push(qr(r));
        break;
      case U.LengthPrefixedString:
        i.push(oe(r));
        break;
      case U.MemoString:
        i.push(Id(r));
        break;
      case U.Asset:
        i.push(Ya(r));
        break;
      case U.PostCondition:
        i.push(fS(r));
        break;
      case U.PublicKey:
        i.push(Qa(r));
        break;
      case U.TransactionAuthField:
        i.push(dS(r));
        break;
    }
  return Qc(i, n);
}
function uS(t) {
  return z(vd(t));
}
function vd(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Ed(t.principal)), (t.conditionType === bt.Fungible || t.conditionType === bt.NonFungible) && e.push($d(t.asset)), t.conditionType === bt.NonFungible && e.push(ve(t.assetName)), e.push(t.conditionCode), t.conditionType === bt.STX || t.conditionType === bt.Fungible || t.conditionType === bt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new _r("The post-condition amount may not be larger than 8 bytes");
    e.push(_n(t.amount, 8));
  }
  return $t(e);
}
function fS(t) {
  const e = Yt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(bt, (a) => {
    throw new Ft(`Could not read ${a} as PostConditionType`);
  }), r = cS(e);
  let s, i, o;
  switch (n) {
    case bt.STX:
      return s = e.readUInt8Enum(Es, (c) => {
        throw new Ft(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: U.PostCondition,
        conditionType: bt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case bt.Fungible:
      return i = Ya(e), s = e.readUInt8Enum(Es, (c) => {
        throw new Ft(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: U.PostCondition,
        conditionType: bt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case bt.NonFungible:
      i = Ya(e);
      const a = Ie(e);
      return s = e.readUInt8Enum(Ra, (c) => {
        throw new Ft(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: U.PostCondition,
        conditionType: bt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case bt.Staking:
      return s = e.readUInt8Enum(Es, (c) => {
        throw new Ft(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: U.PostCondition,
        conditionType: bt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case bt.PoX: {
      const c = e.readUInt8Enum(Va, (u) => {
        throw new Ft(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: U.PostCondition,
        conditionType: bt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Ld(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ct.TokenTransfer:
      e.push(ve(t.recipient)), e.push(_n(t.amount, 8)), e.push(Fe(t.memo));
      break;
    case ct.ContractCall:
      e.push(Fe(t.contractAddress)), e.push(Fe(t.contractName)), e.push(Fe(t.functionName));
      const n = new Uint8Array(4);
      Xn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ve(r));
      });
      break;
    case ct.SmartContract:
      e.push(Fe(t.contractName)), e.push(Fe(t.codeBody));
      break;
    case ct.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Fe(t.contractName)), e.push(Fe(t.codeBody));
      break;
    case ct.PoisonMicroblock:
      break;
    case ct.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ct.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ve(t.recipient));
      break;
    case ct.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ve(t.recipient ? Ad(t.recipient) : Sd())), e.push(t.vrfProof);
      break;
    case ct.TenureChange:
      e.push(st(t.tenureHash)), e.push(st(t.previousTenureHash)), e.push(st(t.burnViewHash)), e.push(st(t.previousTenureEnd)), e.push(Xn(new Uint8Array(4), t.previousTenureBlocks)), e.push(_2(new Uint8Array(1), t.cause)), e.push(st(t.publicKeyHash));
      break;
  }
  return $t(e);
}
function hS(t) {
  const e = Yt(t, gt) ? t : new gt(t);
  switch (e.readUInt8Enum(ct, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ct.TokenTransfer:
      const r = Ie(e), s = Pt(e.readBytes(8)), i = Id(e);
      return Jm(r, s, i);
    case ct.ContractCall:
      const o = qr(e), a = oe(e), c = oe(e), u = [], f = e.readUInt32BE();
      for (let E = 0; E < f; E++) {
        const S = Ie(e);
        u.push(S);
      }
      return tS(o, a, c, u);
    case ct.SmartContract:
      const l = oe(e), g = oe(e, 4, 1e5);
      return hf(l, g);
    case ct.VersionedSmartContract: {
      const E = e.readUInt8Enum(za, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), S = oe(e), T = oe(e, 4, Qx);
      return hf(S, T, E);
    }
    case ct.PoisonMicroblock:
      return nS();
    case ct.Coinbase: {
      const E = e.readBytes(Wn);
      return df(E);
    }
    case ct.CoinbaseToAltRecipient: {
      const E = e.readBytes(Wn), S = Ie(e);
      return df(E, S);
    }
    case ct.NakamotoCoinbase: {
      const E = e.readBytes(Wn), S = Ie(e), T = e.readBytes(ja);
      return rS(E, S, T);
    }
    case ct.TenureChange:
      const h = z(e.readBytes(20)), b = z(e.readBytes(20)), y = z(e.readBytes(20)), A = z(e.readBytes(32)), v = e.readUInt32BE(), L = e.readUInt8Enum(Ga, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), p = z(e.readBytes(20));
      return sS(h, b, y, A, v, L, p);
  }
}
function Xa(t) {
  const e = Yt(t, gt) ? t : new gt(t);
  return qa(z(e.readBytes($o)));
}
function dS(t) {
  const e = Yt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(fe, (r) => {
    throw new Ft(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case fe.PublicKeyCompressed:
      return Mr(xt.Compressed, Qa(e));
    case fe.PublicKeyUncompressed:
      return Mr(xt.Uncompressed, is(YS(Qa(e).data)));
    case fe.SignatureCompressed:
      return Mr(xt.Compressed, Xa(e));
    case fe.SignatureUncompressed:
      return Mr(xt.Uncompressed, Xa(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function tl(t) {
  return st(t.data);
}
function gS(t) {
  const e = [];
  switch (t.contents.type) {
    case U.PublicKey:
      e.push(t.pubKeyEncoding === xt.Compressed ? fe.PublicKeyCompressed : fe.PublicKeyUncompressed), e.push(st(qS(t.contents.data)));
      break;
    case U.MessageSignature:
      e.push(t.pubKeyEncoding === xt.Compressed ? fe.SignatureCompressed : fe.SignatureUncompressed), e.push(tl(t.contents));
      break;
  }
  return $t(e);
}
function Za(t) {
  return t.data.slice();
}
function Qa(t) {
  const e = Yt(t, gt) ? t : new gt(t), n = e.readUInt8(), r = n === 4 ? Vx : Rx;
  return is($t([n, e.readBytes(r)]));
}
function el(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ft.P2PKH || e === ft.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ft.P2WPKH || e === ft.P2WSH || e === ft.P2WSHNonSequential) && !r.map((s) => s.data).every(os))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ft.P2PKH:
      return mi(t, OS(r[0].data));
    case ft.P2WPKH:
      return mi(t, FS(r[0].data));
    case ft.P2SH:
    case ft.P2SHNonSequential:
      return mi(t, jS(n, r.map(Za)));
    case ft.P2WSH:
    case ft.P2WSHNonSequential:
      return mi(t, zS(n, r.map(Za)));
  }
}
function mi(t, e) {
  return { type: U.Address, version: t, hash160: e };
}
function nl(t) {
  return br.c32address(t.version, t.hash160);
}
function gf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return iS(e, n, r);
}
function ys(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return oS(e, n);
  } else
    return aS(t);
}
function pS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return wS(e, n);
  } else
    return bS(t);
}
function bS(t) {
  const e = Tn(t);
  return { type: et.PrincipalStandard, value: nl(e) };
}
function yS(t) {
  return { type: et.PrincipalStandard, value: nl(t) };
}
function wS(t, e) {
  const n = Tn(t), r = pe(e);
  return Bd(n, r);
}
function Bd(t, e) {
  if (dr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: et.PrincipalContract,
    value: `${nl(t)}.${e.content}`
  };
}
function xS(t) {
  return { type: et.ResponseErr, value: t };
}
function mS(t) {
  return { type: et.ResponseOk, value: t };
}
const SS = (t) => ({ type: et.StringASCII, value: t }), AS = (t) => ({ type: et.StringUTF8, value: t });
function ES(t) {
  for (const e in t)
    if (!RS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: et.Tuple, value: t };
}
function Ie(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new gt(st(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new gt(t) : e = t;
  switch (e.readUInt8Enum(Lt, (r) => {
    throw new Ft(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Lt.int:
      return Ym(va(e.readBytes(16)));
    case Lt.uint:
      return Xm(e.readBytes(16));
    case Lt.buffer:
      const r = e.readUInt32BE();
      return Wm(e.readBytes(r));
    case Lt.true:
      return Gm();
    case Lt.false:
      return Km();
    case Lt.address:
      const s = qr(e);
      return yS(s);
    case Lt.contract:
      const i = qr(e), o = oe(e);
      return Bd(i, o);
    case Lt.ok:
      return mS(Ie(e));
    case Lt.err:
      return xS(Ie(e));
    case Lt.none:
      return Sd();
    case Lt.some:
      return Ad(Ie(e));
    case Lt.list:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(Ie(e));
      return Zm(c);
    case Lt.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = oe(e).content;
        if (A === void 0)
          throw new Ft('"content" is undefined');
        f[A] = Ie(e);
      }
      return ES(f);
    case Lt.ascii:
      const l = e.readUInt32BE(), g = E2(e.readBytes(l));
      return SS(g);
    case Lt.utf8:
      const h = e.readUInt32BE(), b = ks(e.readBytes(h));
      return AS(b);
    default:
      throw new Ft("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ue(t, e) {
  return $t([Zc(t), e]);
}
function IS(t) {
  return new Uint8Array([Zc(t.type)]);
}
function $S(t) {
  return t.type === et.OptionalNone ? new Uint8Array([Zc(t.type)]) : Ue(t.type, ve(t.value));
}
function CS(t) {
  const e = new Uint8Array(4);
  return Xn(e, Math.ceil(t.value.length / 2), 0), Ue(t.type, He(e, st(t.value)));
}
function vS(t) {
  const e = vc(w2(BigInt(t.value), BigInt(zx)), hd);
  return Ue(t.type, e);
}
function LS(t) {
  const e = vc(BigInt(t.value), hd);
  return Ue(t.type, e);
}
function BS(t) {
  return Ue(t.type, zs(Tn(t.value)));
}
function HS(t) {
  const [e, n] = VS(t.value);
  return Ue(t.type, He(zs(Tn(e)), Yr(pe(n))));
}
function _S(t) {
  return Ue(t.type, ve(t.value));
}
function MS(t) {
  const e = [], n = new Uint8Array(4);
  Xn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = ve(r);
    e.push(s);
  }
  return Ue(t.type, $t(e));
}
function US(t) {
  const e = [], n = new Uint8Array(4);
  Xn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = pe(s);
    e.push(Yr(i));
    const o = ve(t.value[s]);
    e.push(o);
  }
  return Ue(t.type, $t(e));
}
function Hd(t, e) {
  const n = [], r = e == "ascii" ? A2(t.value) : dr(t.value), s = new Uint8Array(4);
  return Xn(s, r.length, 0), n.push(s), n.push(r), Ue(t.type, $t(n));
}
function NS(t) {
  return Hd(t, "ascii");
}
function TS(t) {
  return Hd(t, "utf8");
}
function PS(t) {
  return z(ve(t));
}
function ve(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return IS(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return $S(t);
    case et.Buffer:
      return CS(t);
    case et.UInt:
      return LS(t);
    case et.Int:
      return vS(t);
    case et.PrincipalStandard:
      return BS(t);
    case et.PrincipalContract:
      return HS(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return _S(t);
    case et.List:
      return MS(t);
    case et.Tuple:
      return US(t);
    case et.StringASCII:
      return NS(t);
    case et.StringUTF8:
      return TS(t);
    default:
      throw new _r("Unable to serialize. Invalid Clarity Value.");
  }
}
const DS = (t) => t.length % 2 ? `0${t}` : t, kS = (t, e) => t.padEnd(e, "0"), _d = (t, e) => t ? dr(t).length > e : !1;
function Ja(t) {
  return ad(t);
}
const Ls = (t) => ym(qc(t)), rl = (t) => z(Vm(t)), OS = (t) => z(Ls(t)), FS = (t) => {
  const e = Ls(t), n = He(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ls(n);
  return z(r);
}, jS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = Ls(r);
  return z(s);
}, zS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = qc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = $t(i), a = Ls(o);
  return z(a);
};
function RS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function VS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
It.hmacSha256Sync = (t, ...e) => {
  const n = bd.create(qc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function is(t) {
  return t = typeof t == "string" ? st(t) : t, {
    type: U.PublicKey,
    data: t
  };
}
function GS(t, e, n = xt.Compressed) {
  const r = v2(e), s = new ne(pu(r.r), pu(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === xt.Compressed;
  return i.toHex(o);
}
function KS(t) {
  return typeof t == "string" ? t : z(t);
}
const sl = KS;
function Md(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === C2;
}
function os(t) {
  return !sl(t).startsWith("04");
}
function WS(t) {
  t = Lc(t);
  const e = Md(t);
  return z(Os(t.slice(0, 32), e));
}
function qS(t) {
  return J.fromHex(sl(t)).toHex(!0);
}
function YS(t) {
  return J.fromHex(sl(t)).toHex(!1);
}
function XS(t, e) {
  t = Lc(t);
  const [n, r] = po(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ds(r, 1) + ne.fromHex(n).toCompactHex();
}
function il() {
  return {
    type: U.MessageSignature,
    data: z(new Uint8Array($o))
  };
}
function Ud(t, e, n, r) {
  const s = el(0, t, 1, [is(e)]).hash160, i = os(e) ? xt.Compressed : xt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Pt(n),
    fee: Pt(r),
    keyEncoding: i,
    signature: il()
  };
}
function Bs(t) {
  return "signature" in t;
}
function pf(t) {
  return t === ft.P2SH || t === ft.P2WSH;
}
function ZS(t) {
  return t === ft.P2SHNonSequential || t === ft.P2WSHNonSequential;
}
function bf(t) {
  const e = Ja(t);
  return e.nonce = 0, e.fee = 0, Bs(e) ? e.signature = il() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function QS(t) {
  const e = [
    t.hashMode,
    st(t.signer),
    _n(t.nonce, 8),
    _n(t.fee, 8),
    t.keyEncoding,
    tl(t.signature)
  ];
  return $t(e);
}
function JS(t) {
  const e = [
    t.hashMode,
    st(t.signer),
    _n(t.nonce, 8),
    _n(t.fee, 8)
  ], n = Qc(t.fields);
  e.push(Jc(n));
  const r = new Uint8Array(2);
  return B2(r, t.signaturesRequired, 0), e.push(r), $t(e);
}
function t3(t, e) {
  const n = z(e.readBytes(20)), r = BigInt(`0x${z(e.readBytes(8))}`), s = BigInt(`0x${z(e.readBytes(8))}`), i = e.readUInt8Enum(xt, (a) => {
    throw new Ft(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ft.P2WPKH && i != xt.Compressed)
    throw new Ft("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Xa(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function e3(t, e) {
  const n = z(e.readBytes(20)), r = BigInt("0x" + z(e.readBytes(8))), s = BigInt("0x" + z(e.readBytes(8))), i = Cd(e, U.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case U.PublicKey:
        os(u.contents.data) || (o = !0);
        break;
      case U.MessageSignature:
        if (u.pubKeyEncoding === xt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Rn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ft.P2WSH || t === ft.P2WSHNonSequential))
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
function fa(t) {
  return Bs(t) ? QS(t) : JS(t);
}
function ha(t) {
  const e = t.readUInt8Enum(ft, (n) => {
    throw new Ft(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ft.P2PKH || e === ft.P2WPKH ? t3(e, t) : e3(e, t);
}
function Nd(t, e, n, r) {
  const i = t + z(new Uint8Array([e])) + z(_n(n, 8)) + z(_n(r, 8));
  if (st(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return rl(st(i));
}
function Td(t, e, n) {
  const r = 33 + $o, s = os(e.data) ? xt.Compressed : xt.Uncompressed, i = t + DS(s.toString(16)) + n, o = st(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return rl(o);
}
function n3(t, e, n, r, s) {
  const i = Nd(t, e, n, r), o = XS(s, i), a = is(WS(s)), c = Td(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Pd(t, e, n, r, s, i) {
  const o = Nd(t, e, n, r), a = is(GS(o, i, s)), c = Td(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function r3() {
  const t = Ud(ft.P2PKH, "", 0, 0);
  return t.signer = Qm().hash160, t.keyEncoding = xt.Compressed, t.signature = il(), t;
}
function yf(t, e, n) {
  return Bs(t) ? s3(t, e, n) : i3(t, e, n);
}
function s3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Pd(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = el(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Rn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function i3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case U.PublicKey:
        os(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case U.MessageSignature:
        c.pubKeyEncoding === xt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Pd(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (pf(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Rn("Too many signatures");
        break;
    }
  if (pf(t.hashMode) && o !== t.signaturesRequired || ZS(t.hashMode) && o < t.signaturesRequired)
    throw new Rn("Incorrect number of signatures");
  if (i && (t.hashMode === ft.P2WSH || t.hashMode === ft.P2WSHNonSequential))
    throw new Rn("Uncompressed keys are not allowed in this hash mode");
  const a = el(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Rn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Dd(t) {
  return {
    authType: At.Standard,
    spendingCondition: t
  };
}
function kd(t, e) {
  return {
    authType: At.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ud(ft.P2PKH, "0".repeat(66), 0, 0)
  };
}
function wf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case At.Standard:
        return Dd(bf(t.spendingCondition));
      case At.Sponsored:
        return kd(bf(t.spendingCondition), r3());
      default:
        throw new Qi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function o3(t, e) {
  switch (t.authType) {
    case At.Standard:
      return yf(t.spendingCondition, e, At.Standard);
    case At.Sponsored:
      return yf(t.spendingCondition, e, At.Standard);
    default:
      throw new Qi("Invalid origin auth type");
  }
}
function a3(t, e) {
  switch (t.authType) {
    case At.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Pt(e)
      };
      return { ...t, spendingCondition: n };
    case At.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Pt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function c3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Pt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function l3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Pt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function u3(t, e) {
  const n = {
    ...e,
    nonce: Pt(e.nonce),
    fee: Pt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function f3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case At.Standard:
      e.push(fa(t.spendingCondition));
      break;
    case At.Sponsored:
      e.push(fa(t.spendingCondition)), e.push(fa(t.sponsorSpendingCondition));
      break;
  }
  return $t(e);
}
function h3(t) {
  const e = t.readUInt8Enum(At, (r) => {
    throw new Ft(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case At.Standard:
      return n = ha(t), Dd(n);
    case At.Sponsored:
      n = ha(t);
      const r = ha(t);
      return kd(n, r);
  }
}
class d3 {
  constructor({ auth: e, payload: n, postConditions: r = Qc([]), postConditionMode: s = Zi.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Ox(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Pt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Zt.Any;
  }
  signBegin() {
    const e = Ja(this);
    return e.auth = wf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ja(this);
    return e.auth = wf(e.auth), e.txid();
  }
  verifyOrigin() {
    return o3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, At.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === At.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, At.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : is(e), r = this.auth.spendingCondition;
    if (r && !Bs(r)) {
      const s = os(n.data);
      r.fields.push(Mr(s ? xt.Compressed : xt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = n3(n, r, e.fee, e.nonce, s);
    if (Bs(e))
      e.signature = qa(i);
    else {
      const a = Md(s);
      e.fields.push(Mr(a ? xt.Compressed : xt.Uncompressed, qa(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return rl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != At.Sponsored)
      throw new Qi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = u3(this.auth, e);
  }
  setFee(e) {
    this.auth = a3(this.auth, e);
  }
  setNonce(e) {
    this.auth = c3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != At.Sponsored)
      throw new Qi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l3(this.auth, e);
  }
  serialize() {
    return z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new _r('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new _r('"chainId" is undefined');
    if (this.auth === void 0)
      throw new _r('"auth" is undefined');
    if (this.payload === void 0)
      throw new _r('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Xn(n, this.chainId, 0), e.push(n), e.push(f3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Jc(this.postConditions)), e.push(Ld(this.payload)), $t(e);
  }
}
function g3(t) {
  const e = Yt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(sr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = h3(e), i = e.readUInt8Enum(Zt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Zi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Cd(e, U.PostCondition), c = hS(e), u = new d3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const xf = BigInt("18446744073709551615");
function da(t) {
  const e = Pt(t);
  if (e < 0n || e > xf)
    throw new RangeError(`Post-condition amount must be between 0 and ${xf} (u64 max), received: ${e}`);
  return e;
}
var tc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(tc || (tc = {}));
var ec;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ec || (ec = {}));
function p3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.STX,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Vt.Origin } : ys(t.address),
        conditionCode: Si(t.condition),
        amount: da(t.amount)
      };
    case "ft-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.Fungible,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Vt.Origin } : ys(t.address),
        conditionCode: Si(t.condition),
        amount: da(t.amount),
        asset: gf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.NonFungible,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Vt.Origin } : ys(t.address),
        conditionCode: Si(t.condition),
        asset: gf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.Staking,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Vt.Origin } : ys(t.address),
        conditionCode: Si(t.condition),
        amount: da(t.amount)
      };
    case "pox-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.PoX,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Vt.Origin } : ys(t.address),
        conditionCode: b3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Si(t) {
  return tc[t];
}
function b3(t) {
  return ec[t];
}
function Od(t) {
  const e = p3(t);
  return uS(e);
}
function y3(t, e, n) {
  return al(Fd(t), n);
}
function Fd(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Hs(r);
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
    return BigInt(`0x${m3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ol(t, e = 8) {
  return (typeof t == "bigint" ? t : Fd(t)).toString(16).padStart(e * 2, "0");
}
function al(t, e = 16) {
  const n = ol(t, e);
  return Hs(n);
}
function w3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const x3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function m3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += x3[n];
  return e;
}
function Hs(t) {
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
function cl(t) {
  return new TextEncoder().encode(t);
}
function S3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function A3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function mf(t) {
  if (t.some(A3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ll(...t) {
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
function Ye(t) {
  return ll(...t.map((e) => typeof e == "number" ? mf([e]) : e instanceof Array ? mf(e) : e));
}
function Lo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var nc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(nc || (nc = {}));
nc.Mainnet;
const E3 = 128, I3 = 128, jd = 16;
var rc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(rc || (rc = {}));
var Sf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Sf || (Sf = {}));
var Af;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Af || (Af = {}));
var ue;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ue || (ue = {}));
const ga = ["onChainOnly", "offChainOnly", "any"];
ga[0] + "", ue.OnChainOnly, ga[1] + "", ue.OffChainOnly, ga[2] + "", ue.Any, ue.OnChainOnly + "", ue.OnChainOnly, ue.OffChainOnly + "", ue.OffChainOnly, ue.Any + "", ue.Any;
var sc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sc || (sc = {}));
sc.Mainnet;
var Ef;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ef || (Ef = {}));
var On;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(On || (On = {}));
var If;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(If || (If = {}));
var $f;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})($f || ($f = {}));
var Cf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cf || (Cf = {}));
var vf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vf || (vf = {}));
var Lf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Lf || (Lf = {}));
var Bf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Bf || (Bf = {}));
var ic;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ic || (ic = {}));
var Hf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hf || (Hf = {}));
var _f;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(_f || (_f = {}));
function oc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function $3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function zd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function C3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  oc(t.outputLen), oc(t.blockLen);
}
function v3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function L3(t, e) {
  zd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const pa = {
  number: oc,
  bool: $3,
  bytes: zd,
  hash: C3,
  exists: v3,
  output: L3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ba = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Se = (t, e) => t << 32 - e | t >>> e, B3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!B3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function H3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Rd(t) {
  if (typeof t == "string" && (t = H3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wr(t) {
  const e = (r) => t().update(Rd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function M3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ul = class extends _3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ba(this.buffer);
  }
  update(e) {
    pa.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Rd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ba(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    pa.exists(this), pa.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    M3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ba(e), c = this.outputLen;
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
const U3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vd = Uint8Array.from({ length: 16 }, (t, e) => e), N3 = Vd.map((t) => (9 * t + 5) % 16);
let fl = [Vd], hl = [N3];
for (let t = 0; t < 4; t++)
  for (let e of [fl, hl])
    e.push(e[t].map((n) => U3[n]));
const Gd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), T3 = fl.map((t, e) => t.map((n) => Gd[e][n])), P3 = hl.map((t, e) => t.map((n) => Gd[e][n])), D3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), k3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ai = (t, e) => t << e | t >>> 32 - e;
function Mf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ei = new Uint32Array(16);
let O3 = class extends ul {
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
      Ei[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = D3[h], A = k3[h], v = fl[h], L = hl[h], p = T3[h], E = P3[h];
      for (let S = 0; S < 16; S++) {
        const T = Ai(r + Mf(h, i, a, u) + Ei[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = Ai(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = Ai(s + Mf(b, o, c, f) + Ei[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = Ai(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ei.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
wr(() => new O3());
const F3 = (t, e, n) => t & e ^ ~t & n, j3 = (t, e, n) => t & e ^ t & n ^ e & n, z3 = new Uint32Array([
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
let Kd = class extends ul {
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
      const g = pn[l - 15], h = pn[l - 2], b = Se(g, 7) ^ Se(g, 18) ^ g >>> 3, y = Se(h, 17) ^ Se(h, 19) ^ h >>> 10;
      pn[l] = y + pn[l - 7] + b + pn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Se(a, 6) ^ Se(a, 11) ^ Se(a, 25), h = f + g + F3(a, c, u) + z3[l] + pn[l] | 0, y = (Se(r, 2) ^ Se(r, 13) ^ Se(r, 22)) + j3(r, s, i) | 0;
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
}, R3 = class extends Kd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
wr(() => new Kd());
wr(() => new R3());
const Ii = BigInt(2 ** 32 - 1), ac = BigInt(32);
function Wd(t, e = !1) {
  return e ? { h: Number(t & Ii), l: Number(t >> ac & Ii) } : { h: Number(t >> ac & Ii) | 0, l: Number(t & Ii) | 0 };
}
function V3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Wd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const G3 = (t, e) => BigInt(t >>> 0) << ac | BigInt(e >>> 0), K3 = (t, e, n) => t >>> n, W3 = (t, e, n) => t << 32 - n | e >>> n, q3 = (t, e, n) => t >>> n | e << 32 - n, Y3 = (t, e, n) => t << 32 - n | e >>> n, X3 = (t, e, n) => t << 64 - n | e >>> n - 32, Z3 = (t, e, n) => t >>> n - 32 | e << 64 - n, Q3 = (t, e) => e, J3 = (t, e) => t, t4 = (t, e, n) => t << n | e >>> 32 - n, e4 = (t, e, n) => e << n | t >>> 32 - n, n4 = (t, e, n) => e << n - 32 | t >>> 64 - n, r4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function s4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const i4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), o4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, a4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), c4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, l4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), u4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: Wd,
  split: V3,
  toBig: G3,
  shrSH: K3,
  shrSL: W3,
  rotrSH: q3,
  rotrSL: Y3,
  rotrBH: X3,
  rotrBL: Z3,
  rotr32H: Q3,
  rotr32L: J3,
  rotlSH: t4,
  rotlSL: e4,
  rotlBH: n4,
  rotlBL: r4,
  add: s4,
  add3L: i4,
  add3H: o4,
  add4L: a4,
  add4H: c4,
  add5H: u4,
  add5L: l4
}, [f4, h4] = X.split([
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
let Bo = class extends ul {
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
      const E = bn[p - 15] | 0, S = yn[p - 15] | 0, T = X.rotrSH(E, S, 1) ^ X.rotrSH(E, S, 8) ^ X.shrSH(E, S, 7), O = X.rotrSL(E, S, 1) ^ X.rotrSL(E, S, 8) ^ X.shrSL(E, S, 7), H = bn[p - 2] | 0, N = yn[p - 2] | 0, w = X.rotrSH(H, N, 19) ^ X.rotrBH(H, N, 61) ^ X.shrSH(H, N, 6), I = X.rotrSL(H, N, 19) ^ X.rotrBL(H, N, 61) ^ X.shrSL(H, N, 6), _ = X.add4L(O, I, yn[p - 7], yn[p - 16]), F = X.add4H(_, T, w, bn[p - 7], bn[p - 16]);
      bn[p] = F | 0, yn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = X.rotrSH(l, g, 14) ^ X.rotrSH(l, g, 18) ^ X.rotrBH(l, g, 41), S = X.rotrSL(l, g, 14) ^ X.rotrSL(l, g, 18) ^ X.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = X.add5L(L, S, O, h4[p], yn[p]), N = X.add5H(H, v, E, T, f4[p], bn[p]), w = H | 0, I = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), _ = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = X.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = X.add3L(w, _, G);
      r = X.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = X.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = X.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = X.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = X.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = X.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    bn.fill(0), yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, d4 = class extends Bo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, g4 = class extends Bo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, p4 = class extends Bo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
wr(() => new Bo());
wr(() => new d4());
wr(() => new g4());
wr(() => new p4());
function b4(t, e, n) {
  const s = E3;
  if (M4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: rc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Bt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Bt || (Bt = {}));
let y4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, qd = class extends y4 {
  constructor(e) {
    super(e);
  }
};
function Ho(t) {
  const e = [];
  return e.push(Hs(ol(t.version, 1))), e.push(Hs(t.hash160)), Ye(e);
}
function w4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ho(t.address)), t.prefix === ic.Contract && e.push(_s(t.contractName)), Ye(e);
}
function _s(t) {
  const e = [], n = cl(t.content), r = n.byteLength;
  return e.push(Hs(ol(r, t.lengthPrefixBytes))), e.push(n), Ye(e);
}
function x4(t) {
  const e = [];
  return e.push(Ho(t.address)), e.push(_s(t.contractName)), e.push(_s(t.assetName)), Ye(e);
}
function Yd(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(w4(t.principal)), (t.conditionType === On.Fungible || t.conditionType === On.NonFungible) && e.push(x4(t.assetInfo)), t.conditionType === On.NonFungible && e.push(as(t.assetName)), e.push(t.conditionCode), t.conditionType === On.STX || t.conditionType === On.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new qd("The post-condition amount may not be larger than 8 bytes");
    e.push(y3(t.amount, !1, 8));
  }
  return Ye(e);
}
function Ne(t, e) {
  return Ye([t, e]);
}
function m4(t) {
  return new Uint8Array([t.type]);
}
function S4(t) {
  return t.type === Bt.OptionalNone ? new Uint8Array([t.type]) : Ne(t.type, as(t.value));
}
function A4(t) {
  const e = new Uint8Array(4);
  return Lo(e, t.buffer.length, 0), Ne(t.type, ll(e, t.buffer));
}
function E4(t) {
  const e = al(w3(t.value, BigInt(I3)), jd);
  return Ne(t.type, e);
}
function I4(t) {
  const e = al(t.value, jd);
  return Ne(t.type, e);
}
function $4(t) {
  return Ne(t.type, Ho(t.address));
}
function C4(t) {
  return Ne(t.type, ll(Ho(t.address), _s(t.contractName)));
}
function v4(t) {
  return Ne(t.type, as(t.value));
}
function L4(t) {
  const e = [], n = new Uint8Array(4);
  Lo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = as(r);
    e.push(s);
  }
  return Ne(t.type, Ye(e));
}
function B4(t) {
  const e = [], n = new Uint8Array(4);
  Lo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = b4(s);
    e.push(_s(i));
    const o = as(t.data[s]);
    e.push(o);
  }
  return Ne(t.type, Ye(e));
}
function Xd(t, e) {
  const n = [], r = e == "ascii" ? S3(t.data) : cl(t.data), s = new Uint8Array(4);
  return Lo(s, r.length, 0), n.push(s), n.push(r), Ne(t.type, Ye(n));
}
function H4(t) {
  return Xd(t, "ascii");
}
function _4(t) {
  return Xd(t, "utf8");
}
function as(t) {
  switch (t.type) {
    case Bt.BoolTrue:
    case Bt.BoolFalse:
      return m4(t);
    case Bt.OptionalNone:
    case Bt.OptionalSome:
      return S4(t);
    case Bt.Buffer:
      return A4(t);
    case Bt.UInt:
      return I4(t);
    case Bt.Int:
      return E4(t);
    case Bt.PrincipalStandard:
      return $4(t);
    case Bt.PrincipalContract:
      return C4(t);
    case Bt.ResponseOk:
    case Bt.ResponseErr:
      return v4(t);
    case Bt.List:
      return L4(t);
    case Bt.Tuple:
      return B4(t);
    case Bt.StringASCII:
      return H4(t);
    case Bt.StringUTF8:
      return _4(t);
    default:
      throw new qd("Unable to serialize. Invalid Clarity Value.");
  }
}
const M4 = (t, e) => t ? cl(t).length > e : !1, U4 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function N4(t, e) {
  const n = {};
  return Object.assign(n, U4, e), await fetch(t, n);
}
function T4(t) {
  let e = N4, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function P4(...t) {
  const { fetchLib: e, middlewares: n } = T4(t);
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
var Xr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xr || (Xr = {}));
var or;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(or || (or = {}));
var Uf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Uf || (Uf = {}));
const D4 = "https://api.mainnet.hiro.so", k4 = "https://api.testnet.hiro.so", O4 = "http://localhost:3999", F4 = ["mainnet", "testnet", "devnet", "mocknet"];
class be {
  constructor(e) {
    this.version = or.Mainnet, this.chainId = Xr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === or.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? P4();
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
be.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new cs();
    case "testnet":
      return new Zd();
    case "devnet":
      return new j4();
    case "mocknet":
      return new Qd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${F4.join(", ")}`);
  }
};
be.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : be.fromName(t);
class cs extends be {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? D4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = or.Mainnet, this.chainId = Xr.Mainnet;
  }
}
class Zd extends be {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? k4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = or.Testnet, this.chainId = Xr.Testnet;
  }
}
class Qd extends be {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? O4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = or.Testnet, this.chainId = Xr.Testnet;
  }
}
const j4 = Qd, z4 = "connect-ui";
let Ti, Jd, Qt = !1, cc = !1;
const Ge = (t, e = "") => () => {
}, R4 = (t, e) => () => {
}, V4 = "{visibility:hidden}.hydrated{visibility:inherit}", Nf = {}, G4 = "http://www.w3.org/2000/svg", K4 = "http://www.w3.org/1999/xhtml", W4 = (t) => t != null, dl = (t) => (t = typeof t, t === "object" || t === "function");
function tg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const V = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !dl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? lc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = lc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, lc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, q4 = {}, Y4 = (t) => t && t.$tag$ === q4, X4 = (t, e) => t != null && !dl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Z4 = (t) => ls(t).$hostElement$, Q4 = (t, e, n) => {
  const r = Tt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Tf = /* @__PURE__ */ new WeakMap(), J4 = (t, e, n) => {
  let r = Ji.get(t);
  xA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ji.set(t, r);
}, tA = (t, e, n, r) => {
  var s;
  let i = eg(e);
  const o = Ji.get(i);
  if (t = t.nodeType === 11 ? t : Le, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Tf.get(t), c;
      if (a || Tf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Le.createElement("style"), c.innerHTML = o;
          const u = (s = Tt.$nonce$) !== null && s !== void 0 ? s : tg(Le);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, eA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ge("attachStyles", e.$tagName$), i = tA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, eg = (t, e) => "sc-" + t.$tagName$, Pf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = kf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Df(n), f = Df(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : kf(_o, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Tt.rel(t, e, n, !1), r && Tt.ael(t, e, r, !1);
    else {
      const c = dl(r);
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
}, nA = /\s/, Df = (t) => t ? t.split(nA) : [], ng = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Nf, o = e.$attrs$ || Nf;
  for (r in i)
    r in o || Pf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Pf(s, r, i[r], o[r], n, e.$flags$);
}, gl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Le.createTextNode(s.$text$);
  else {
    if (Qt || (Qt = s.$tag$ === "svg"), o = s.$elm$ = Le.createElementNS(Qt ? G4 : K4, s.$tag$), Qt && s.$tag$ === "foreignObject" && (Qt = !1), ng(null, s, Qt), W4(Ti) && o["s-si"] !== Ti && o.classList.add(o["s-si"] = Ti), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = gl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Qt = !1 : o.tagName === "foreignObject" && (Qt = !0);
  }
  return o;
}, rg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Jd && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = gl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, sg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, rA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : $i(a, f) ? (xs(a, f), a = e[++s], f = r[++i]) : $i(c, l) ? (xs(c, l), c = e[--o], l = r[--u]) : $i(a, l) ? (xs(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : $i(c, f) ? (xs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = gl(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? rg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && sg(e, s, o);
}, $i = (t, e) => t.$tag$ === e.$tag$, xs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Qt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Qt, ng(t, e, Qt), r !== null && s !== null ? rA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), rg(n, null, e, s, 0, s.length - 1)) : r !== null && sg(r, 0, r.length - 1), Qt && i === "svg" && (Qt = !1)) : t.$text$ !== o && (n.data = o);
}, sA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || lc(null, null), s = Y4(e) ? e : V(null, null, e);
  Jd = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ti = n["s-sc"], xs(r, s);
}, ig = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, pl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return ig(t, t.$ancestorComponent$), SA(() => iA(t, e));
}, iA = (t, e) => {
  const n = Ge("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), lA(s, () => oA(t, r, e));
}, oA = async (t, e, n) => {
  const r = t.$hostElement$, s = Ge("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && eA(t);
  const o = Ge("render", t.$cmpMeta$.$tagName$);
  aA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => cA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, aA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, sA(t, e);
  } catch (r) {
    Ms(r, t.$hostElement$);
  }
  return null;
}, cA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ge("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, ag(n), r(), t.$onReadyResolve$(n), s || og()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && yl(() => pl(t, !1)), t.$flags$ &= -517;
}, og = (t) => {
  ag(Le.documentElement), yl(() => Q4(_o, "appload", { detail: { namespace: z4 } }));
}, lA = (t, e) => t && t.then ? t.then(e) : e(), ag = (t) => t.classList.add("hydrated"), uA = (t, e) => ls(t).$instanceValues$.get(e), fA = (t, e, n, r) => {
  const s = ls(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = X4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && pl(s, !1));
}, cg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return uA(this, i);
        },
        set(a) {
          fA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Tt.jmp(() => {
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
}, hA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = wA(n), s.then) {
        const c = R4();
        s = await s, c();
      }
      s.isProxied || (cg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ge("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ms(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = eg(n);
      if (!Ji.has(c)) {
        const u = Ge("registerStyles", n.$tagName$);
        J4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => pl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, dA = (t) => {
  if (!(Tt.$flags$ & 1)) {
    const e = ls(t), n = e.$cmpMeta$, r = Ge("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            ig(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), hA(t, e, n);
    }
    r();
  }
}, gA = (t) => {
  Tt.$flags$ & 1 || ls(t);
}, pA = (t, e = {}) => {
  var n;
  const r = Ge(), s = [], i = e.exclude || [], o = _o.customElements, a = Le.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Le.createElement("style"), f = [];
  let l, g = !0;
  Object.assign(Tt, e), Tt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Le.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const y = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      y.$members$ = b[2];
      const A = y.$tagName$, v = class extends HTMLElement {
        // StencilLazyHost
        constructor(L) {
          super(L), L = this, yA(L, y), y.$flags$ & 1 && L.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? f.push(this) : Tt.jmp(() => dA(this));
        }
        disconnectedCallback() {
          Tt.jmp(() => gA(this));
        }
        componentOnReady() {
          return ls(this).$onReadyPromise$;
        }
      };
      y.$lazyBundleId$ = h[0], !i.includes(A) && !o.get(A) && (s.push(A), o.define(A, cg(
        v,
        y,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + V4, u.setAttribute("data-styles", "");
    const h = (n = Tt.$nonce$) !== null && n !== void 0 ? n : tg(Le);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Tt.jmp(() => l = setTimeout(og, 30)), r();
}, bl = /* @__PURE__ */ new WeakMap(), ls = (t) => bl.get(t), bA = (t, e) => bl.set(e.$lazyInstance$ = t, e), yA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], bl.set(t, n);
}, kf = (t, e) => e in t, Ms = (t, e) => (0, console.error)(t, e), ya = /* @__PURE__ */ new Map(), wA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = ya.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (ya.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => E6).then(o, Ms);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (ya.set(s, o), o[r]), Ms);
}, Ji = /* @__PURE__ */ new Map(), _o = typeof window < "u" ? window : {}, Le = _o.document || { head: {} }, Tt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, lg = (t) => Promise.resolve(t), xA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Of = [], ug = [], mA = (t, e) => (n) => {
  t.push(n), cc || (cc = !0, Tt.$flags$ & 4 ? yl(uc) : Tt.raf(uc));
}, Ff = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ms(n);
    }
  t.length = 0;
}, uc = () => {
  Ff(Of), Ff(ug), (cc = Of.length > 0) && Tt.raf(uc);
}, yl = (t) => lg().then(t), SA = /* @__PURE__ */ mA(ug), AA = () => lg(), fg = (t, e) => typeof window > "u" ? Promise.resolve() : AA().then(() => pA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var EA = Object.defineProperty, IA = Object.defineProperties, $A = Object.getOwnPropertyDescriptors, to = Object.getOwnPropertySymbols, hg = Object.prototype.hasOwnProperty, dg = Object.prototype.propertyIsEnumerable, jf = (t, e, n) => e in t ? EA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Me = (t, e) => {
  for (var n in e || (e = {})) hg.call(e, n) && jf(t, n, e[n]);
  if (to) for (var n of to(e)) dg.call(e, n) && jf(t, n, e[n]);
  return t;
}, Mn = (t, e) => IA(t, $A(e)), CA = (t, e) => {
  var n = {};
  for (var r in t) hg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && to) for (var r of to(t)) e.indexOf(r) < 0 && dg.call(t, r) && (n[r] = t[r]);
  return n;
};
function wl() {
  return Io(ge()) || window.StacksProvider || window.BlockstackProvider;
}
function xl(t) {
  return t ? typeof t == "string" ? nr.fromName(t) : "version" in t ? t : "url" in t ? new ka({ url: t.url }) : t.transactionVersion === sr.Mainnet ? new ka({ url: t.client.baseUrl }) : new Oa({ url: t.client.baseUrl }) : new Oa();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var vA = (t) => {
  if (!t) {
    let e = new ho(["store_write"], document.location.href);
    t = new vs({ appConfig: e });
  }
  return t;
}, LA = async (t, e = wl()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: a, appDetails: c } = t, u = vA(a);
  u.isUserSignedIn() && u.signUserOut();
  let f = u.generateAndStoreTransitKey(), l = u.makeAuthRequest(f, `${document.location.origin}${n}`, `${document.location.origin}${r}`, u.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: c, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await u.handlePendingSignIn(g);
    let h = Dt.decodeToken(g), b = h == null ? void 0 : h.payload;
    s == null || s({ authResponse: g, authResponsePayload: b, userSession: u });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), i == null || i();
  }
}, BA = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(BA || {}), HA = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(HA || {}), ml = (t) => {
  let e = t;
  if (!e) {
    let n = new ho(["store_write"], document.location.href);
    e = new vs({ appConfig: n });
  }
  return e;
};
function _A(t) {
  try {
    return ml(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var MA = (t) => {
  let e = ml(t).loadUserData().appPrivateKey, n = Dt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function UA(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [rr.Mainnet]: "mainnet", [rr.Testnet]: "testnet" }, a = xl(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function NA(t) {
  let e = xl(t.network), n = ml(t.userSession), r = Mn(Me({}, t), { network: e, userSession: n });
  return Me({ stxAddress: UA(r) }, r);
}
async function TA(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Od) : n = n.map((r) => z(Yd(r)))), new Dt.TokenSigner("ES256k", e).signAsync(Mn(Me({}, t), { postConditions: n }));
}
function PA(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Od) : e = e.map((n) => z(Yd(n)))), Dt.createUnsecuredToken(Mn(Me({}, t), { postConditions: e }));
}
var DA = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = st(a.replace(/^0x/, "")), u = g3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Mn(Me({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Mn(Me({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, kA = async (t) => {
  let e = t, { functionArgs: n, appDetails: r, userSession: s } = e, i = CA(e, ["functionArgs", "appDetails", "userSession"]), o = n.map((c) => typeof c == "string" ? c : typeof c.type == "string" ? PS(c) : z(as(c)));
  if (_A(s)) {
    let { privateKey: c, publicKey: u } = MA(s), f = Mn(Me({}, i), { functionArgs: o, txType: "contract_call", publicKey: u });
    return r && (f.appDetails = r), TA(f, c);
  }
  let a = Mn(Me({}, i), { functionArgs: o, txType: "contract_call" });
  return r && (a.appDetails = r), PA(a);
};
async function OA(t, e, n) {
  let r = await e(Mn(Me(Me({}, NA(t)), t), { network: xl(t.network) }));
  return DA({ token: r, options: t }, n);
}
function FA(t, e = wl()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return OA(t, kA, e);
}
var jA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(jA || {}), gg = "asigna-stx", zf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === gg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(RA(t, e), "*");
}), zA = { authenticationRequest: async (t) => zf(t, "authenticationRequest"), transactionRequest: async (t) => zf(t, "transactionRequest") }, RA = (t, e) => ({ source: gg, [e]: t }), VA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = zA);
};
VA();
var pg = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function bg(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ge(), o = wl();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    fg();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : pg, c = Cx(a), u = document.createElement("connect-modal");
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
var GA = bg(LA, !1), Rf = bg(FA), KA = ld;
function Un(t, e, n) {
  return Sl(_t(t, e), n);
}
function _t(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = wt(r);
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
      const r = YA(BigInt(`0x${tt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${tt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Vf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Rs(t, e = 8) {
  return (typeof t == "bigint" ? t : _t(t, !1)).toString(16).padStart(e * 2, "0");
}
function Mo(t) {
  return parseInt(t, 16);
}
function Sl(t, e = 16) {
  const n = Rs(t, e);
  return wt(n);
}
function WA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function qA(t, e) {
  return t & BigInt(1) << e;
}
function YA(t, e) {
  return qA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const XA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += XA[n];
  return e;
}
function wt(t) {
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
function us(t) {
  return new TextEncoder().encode(t);
}
function Al(t) {
  return new TextDecoder().decode(t);
}
function yg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function ZA(t) {
  return String.fromCharCode.apply(null, t);
}
function QA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Gf(t) {
  if (t.some(QA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Uo(...t) {
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
function Ct(t) {
  return Uo(...t.map((e) => typeof e == "number" ? Gf([e]) : e instanceof Array ? Gf(e) : e));
}
var Kf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Kf || (Kf = {}));
var Wf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wf || (Wf = {}));
var qf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(qf || (qf = {}));
const wg = 33, wa = 32;
function JA(t) {
  if (t.length < wa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + wa * 2), r = t.slice(2 + wa * 2);
  return {
    recoveryId: Mo(e),
    r: n,
    s: r
  };
}
function t8(t) {
  const e = typeof t == "string" ? wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function e8(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function n8(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function r8(t, e) {
  return t[e];
}
function s8(t, e, n = 0) {
  return t[n] = e, t;
}
function i8(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ar(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var fc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fc || (fc = {}));
const o8 = fc.Mainnet, a8 = 128, c8 = 128, xg = 16, qn = 32, hc = 80, Vs = 65, l8 = 32, u8 = 64, eo = 34;
var k;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(k || (k = {}));
var Q;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Q || (Q = {}));
var dc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(dc || (dc = {}));
var kt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kt || (kt = {}));
const Pi = ["onChainOnly", "offChainOnly", "any"], Yf = {
  [Pi[0]]: kt.OnChainOnly,
  [Pi[1]]: kt.OffChainOnly,
  [Pi[2]]: kt.Any,
  [kt.OnChainOnly]: kt.OnChainOnly,
  [kt.OffChainOnly]: kt.OffChainOnly,
  [kt.Any]: kt.Any
};
function f8(t) {
  if (t in Yf)
    return Yf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Pi.join(", ")}`);
}
var cr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(cr || (cr = {}));
cr.Mainnet;
var lr;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(lr || (lr = {}));
var qt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qt || (qt = {}));
var Et;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Et || (Et = {}));
var it;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(it || (it = {}));
var Us;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Us || (Us = {}));
var mt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(mt || (mt = {}));
var no;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(no || (no = {}));
var gc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(gc || (gc = {}));
var Ns;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ns || (Ns = {}));
var Xf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xf || (Xf = {}));
var Zf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Zf || (Zf = {}));
function pc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function h8(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function mg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function d8(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pc(t.outputLen), pc(t.blockLen);
}
function g8(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function p8(t, e) {
  mg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gn = {
  number: pc,
  bool: h8,
  bytes: mg,
  hash: d8,
  exists: g8,
  output: p8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ae = (t, e) => t << 32 - e | t >>> e, b8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!b8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function y8(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function El(t) {
  if (typeof t == "string" && (t = y8(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Sg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function xr(t) {
  const e = (r) => t().update(El(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function w8(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Il extends Sg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xa(this.buffer);
  }
  update(e) {
    Gn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = El(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = xa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Gn.exists(this), Gn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    w8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = xa(e), c = this.outputLen;
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
const x8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ag = Uint8Array.from({ length: 16 }, (t, e) => e), m8 = Ag.map((t) => (9 * t + 5) % 16);
let $l = [Ag], Cl = [m8];
for (let t = 0; t < 4; t++)
  for (let e of [$l, Cl])
    e.push(e[t].map((n) => x8[n]));
const Eg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), S8 = $l.map((t, e) => t.map((n) => Eg[e][n])), A8 = Cl.map((t, e) => t.map((n) => Eg[e][n])), E8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), I8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ci = (t, e) => t << e | t >>> 32 - e;
function Qf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const vi = new Uint32Array(16);
class $8 extends Il {
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
      vi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = E8[h], A = I8[h], v = $l[h], L = Cl[h], p = S8[h], E = A8[h];
      for (let S = 0; S < 16; S++) {
        const T = Ci(r + Qf(h, i, a, u) + vi[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = Ci(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = Ci(s + Qf(b, o, c, f) + vi[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = Ci(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    vi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const C8 = xr(() => new $8()), v8 = (t, e, n) => t & e ^ ~t & n, L8 = (t, e, n) => t & e ^ t & n ^ e & n, B8 = new Uint32Array([
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
]), wn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xn = new Uint32Array(64);
class Ig extends Il {
  constructor() {
    super(64, 32, 8, !1), this.A = wn[0] | 0, this.B = wn[1] | 0, this.C = wn[2] | 0, this.D = wn[3] | 0, this.E = wn[4] | 0, this.F = wn[5] | 0, this.G = wn[6] | 0, this.H = wn[7] | 0;
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
      xn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = xn[l - 15], h = xn[l - 2], b = Ae(g, 7) ^ Ae(g, 18) ^ g >>> 3, y = Ae(h, 17) ^ Ae(h, 19) ^ h >>> 10;
      xn[l] = y + xn[l - 7] + b + xn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ae(a, 6) ^ Ae(a, 11) ^ Ae(a, 25), h = f + g + v8(a, c, u) + B8[l] + xn[l] | 0, y = (Ae(r, 2) ^ Ae(r, 13) ^ Ae(r, 22)) + L8(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    xn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class H8 extends Ig {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const vl = xr(() => new Ig());
xr(() => new H8());
const Li = BigInt(2 ** 32 - 1), bc = BigInt(32);
function $g(t, e = !1) {
  return e ? { h: Number(t & Li), l: Number(t >> bc & Li) } : { h: Number(t >> bc & Li) | 0, l: Number(t & Li) | 0 };
}
function _8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = $g(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const M8 = (t, e) => BigInt(t >>> 0) << bc | BigInt(e >>> 0), U8 = (t, e, n) => t >>> n, N8 = (t, e, n) => t << 32 - n | e >>> n, T8 = (t, e, n) => t >>> n | e << 32 - n, P8 = (t, e, n) => t << 32 - n | e >>> n, D8 = (t, e, n) => t << 64 - n | e >>> n - 32, k8 = (t, e, n) => t >>> n - 32 | e << 64 - n, O8 = (t, e) => e, F8 = (t, e) => t, j8 = (t, e, n) => t << n | e >>> 32 - n, z8 = (t, e, n) => e << n | t >>> 32 - n, R8 = (t, e, n) => e << n - 32 | t >>> 64 - n, V8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function G8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), W8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, q8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Y8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, X8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Z8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: $g,
  split: _8,
  toBig: M8,
  shrSH: U8,
  shrSL: N8,
  rotrSH: T8,
  rotrSL: P8,
  rotrBH: D8,
  rotrBL: k8,
  rotr32H: O8,
  rotr32L: F8,
  rotlSH: j8,
  rotlSL: z8,
  rotlBH: R8,
  rotlBL: V8,
  add: G8,
  add3L: K8,
  add3H: W8,
  add4L: q8,
  add4H: Y8,
  add5H: Z8,
  add5L: X8
}, [Q8, J8] = Z.split([
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
].map((t) => BigInt(t))), mn = new Uint32Array(80), Sn = new Uint32Array(80);
class No extends Il {
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
      mn[p] = e.getUint32(n), Sn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = mn[p - 15] | 0, S = Sn[p - 15] | 0, T = Z.rotrSH(E, S, 1) ^ Z.rotrSH(E, S, 8) ^ Z.shrSH(E, S, 7), O = Z.rotrSL(E, S, 1) ^ Z.rotrSL(E, S, 8) ^ Z.shrSL(E, S, 7), H = mn[p - 2] | 0, N = Sn[p - 2] | 0, w = Z.rotrSH(H, N, 19) ^ Z.rotrBH(H, N, 61) ^ Z.shrSH(H, N, 6), I = Z.rotrSL(H, N, 19) ^ Z.rotrBL(H, N, 61) ^ Z.shrSL(H, N, 6), _ = Z.add4L(O, I, Sn[p - 7], Sn[p - 16]), F = Z.add4H(_, T, w, mn[p - 7], mn[p - 16]);
      mn[p] = F | 0, Sn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = Z.rotrSH(l, g, 14) ^ Z.rotrSH(l, g, 18) ^ Z.rotrBH(l, g, 41), S = Z.rotrSL(l, g, 14) ^ Z.rotrSL(l, g, 18) ^ Z.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = Z.add5L(L, S, O, J8[p], Sn[p]), N = Z.add5H(H, v, E, T, Q8[p], mn[p]), w = H | 0, I = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), _ = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Z.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = Z.add3L(w, _, G);
      r = Z.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Z.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Z.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = Z.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    mn.fill(0), Sn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class t5 extends No {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class e5 extends No {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class n5 extends No {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
xr(() => new No());
xr(() => new t5());
const r5 = xr(() => new e5());
xr(() => new n5());
function Cg(t) {
  if (wt(t).byteLength != Vs)
    throw Error("Invalid signature");
  return {
    type: k.MessageSignature,
    data: t
  };
}
function Bi(t, e) {
  return { type: k.Address, version: t, hash160: e };
}
function ur(t, e, n) {
  const r = e || 1, s = n || a8;
  if (Kg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: k.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function To(t) {
  const e = br.c32addressDecode(t);
  return {
    type: k.Address,
    version: e[0],
    hash160: e[1]
  };
}
var B;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(B || (B = {}));
function s5(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return a5(e, n);
  } else
    return i5(t);
}
function i5(t) {
  const e = To(t);
  return { type: B.PrincipalStandard, address: e };
}
function o5(t) {
  return { type: B.PrincipalStandard, address: t };
}
function a5(t, e) {
  const n = To(t), r = ur(e);
  return vg(n, r);
}
function vg(t, e) {
  if (us(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: B.PrincipalContract, address: t, contractName: e };
}
function Cr(t) {
  switch (t.type) {
    case B.BoolTrue:
    case B.BoolFalse:
      return "bool";
    case B.Int:
      return "int";
    case B.UInt:
      return "uint";
    case B.Buffer:
      return `(buff ${t.buffer.length})`;
    case B.OptionalNone:
      return "(optional none)";
    case B.OptionalSome:
      return `(optional ${Cr(t.value)})`;
    case B.ResponseErr:
      return `(response UnknownType ${Cr(t.value)})`;
    case B.ResponseOk:
      return `(response ${Cr(t.value)} UnknownType)`;
    case B.PrincipalStandard:
    case B.PrincipalContract:
      return "principal";
    case B.List:
      return `(list ${t.list.length} ${t.list.length ? Cr(t.list[0]) : "UnknownType"})`;
    case B.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Cr(t.data[e])})`).join(" ")})`;
    case B.StringASCII:
      return `(string-ascii ${yg(t.data).length})`;
    case B.StringUTF8:
      return `(string-utf8 ${us(t.data).length})`;
  }
}
const Lg = () => ({ type: B.BoolTrue }), Bg = () => ({ type: B.BoolFalse }), c5 = (t) => t ? Lg() : Bg(), Jf = BigInt("0xffffffffffffffffffffffffffffffff"), l5 = BigInt(0), th = BigInt("0x7fffffffffffffffffffffffffffffff"), eh = BigInt("-170141183460469231731687303715884105728"), u5 = (t) => {
  const e = _t(t, !0);
  if (e > th)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${th}`);
  if (e < eh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${eh}`);
  return { type: B.Int, value: e };
}, Hg = (t) => {
  const e = _t(t, !1);
  if (e < l5)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Jf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Jf}`);
  return { type: B.UInt, value: e };
}, f5 = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: B.Buffer, buffer: t };
};
function _g() {
  return { type: B.OptionalNone };
}
function Mg(t) {
  return { type: B.OptionalSome, value: t };
}
function h5(t) {
  return { type: B.ResponseErr, value: t };
}
function d5(t) {
  return { type: B.ResponseOk, value: t };
}
function Ug(t) {
  return { type: B.List, list: t };
}
function Ng(t) {
  for (const e in t)
    if (!eE(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: B.Tuple, data: t };
}
const g5 = (t) => ({ type: B.StringASCII, data: t }), p5 = (t) => ({ type: B.StringUTF8, data: t });
class Tg extends Sg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Gn.hash(e);
    const r = El(n);
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
    return Gn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Gn.exists(this), Gn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Pg = (t, e, n) => new Tg(t, e).update(n).digest();
Pg.create = (t, e) => new Tg(t, e);
It.hmacSha256Sync = (t, ...e) => {
  const n = Pg.create(vl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ke(t) {
  return {
    type: k.PublicKey,
    data: wt(t)
  };
}
function b5(t, e, n = mt.Compressed) {
  const r = JA(e.data), s = new ne(Vf(r.r), Vf(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === mt.Compressed;
  return i.toHex(o);
}
function y5(t) {
  return { type: k.PublicKey, data: t };
}
function fs(t) {
  return !tt(t.data).startsWith("04");
}
function ro(t) {
  return t.data.slice();
}
function w5(t) {
  const e = S5(t), n = Os(e.data.slice(0, 32), e.compressed);
  return Ke(tt(n));
}
function x5(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!0);
  return Ke(n);
}
function m5(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!1);
  return Ke(n);
}
function yc(t) {
  const e = t.readUInt8(), n = e === 4 ? u8 : l8;
  return y5(Ct([e, t.readBytes(n)]));
}
function S5(t) {
  const e = t8(t), n = e.length == wg;
  return { data: e, compressed: n };
}
function A5(t, e) {
  const [n, r] = po(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Rs(r, 1) + ne.fromHex(n).toCompactHex();
  return Cg(i);
}
function E5(t) {
  return w5(t.data);
}
function I5(t, e, n) {
  return typeof t == "string" && (t = s5(t)), typeof n == "string" && (n = sh(n)), {
    type: k.Payload,
    payloadType: Q.TokenTransfer,
    recipient: t,
    amount: _t(e, !1),
    memo: n ?? sh("")
  };
}
function Dg(t, e, n, r) {
  return typeof t == "string" && (t = To(t)), typeof e == "string" && (e = ur(e)), typeof n == "string" && (n = ur(n)), {
    type: k.Payload,
    payloadType: Q.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function nh(t, e, n) {
  return typeof t == "string" && (t = ur(t)), typeof e == "string" && (e = U5(e)), typeof n == "number" ? {
    type: k.Payload,
    payloadType: Q.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: k.Payload,
    payloadType: Q.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function $5() {
  return { type: k.Payload, payloadType: Q.PoisonMicroblock };
}
function rh(t, e) {
  if (t.byteLength != qn)
    throw Error(`Coinbase buffer size must be ${qn} bytes`);
  return e != null ? {
    type: k.Payload,
    payloadType: Q.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: k.Payload,
    payloadType: Q.Coinbase,
    coinbaseBytes: t
  };
}
function C5(t, e, n) {
  if (t.byteLength != qn)
    throw Error(`Coinbase buffer size must be ${qn} bytes`);
  if (n.byteLength != hc)
    throw Error(`VRF proof buffer size must be ${hc} bytes`);
  return {
    type: k.Payload,
    payloadType: Q.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === B.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var wc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(wc || (wc = {}));
function v5(t, e, n, r, s, i, o) {
  return {
    type: k.Payload,
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
function Ll(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Q.TokenTransfer:
      e.push(Be(t.recipient)), e.push(Un(t.amount, !1, 8)), e.push(je(t.memo));
      break;
    case Q.ContractCall:
      e.push(je(t.contractAddress)), e.push(je(t.contractName)), e.push(je(t.functionName));
      const n = new Uint8Array(4);
      ar(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Be(r));
      });
      break;
    case Q.SmartContract:
      e.push(je(t.contractName)), e.push(je(t.codeBody));
      break;
    case Q.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(je(t.contractName)), e.push(je(t.codeBody));
      break;
    case Q.PoisonMicroblock:
      break;
    case Q.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Q.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Be(t.recipient));
      break;
    case Q.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Be(t.recipient ? Mg(t.recipient) : _g())), e.push(t.vrfProof);
      break;
    case Q.TenureChange:
      e.push(wt(t.tenureHash)), e.push(wt(t.previousTenureHash)), e.push(wt(t.burnViewHash)), e.push(wt(t.previousTenureEnd)), e.push(ar(new Uint8Array(4), t.previousTenureBlocks)), e.push(s8(new Uint8Array(1), t.cause)), e.push(wt(t.publicKeyHash));
      break;
  }
  return Ct(e);
}
function L5(t) {
  switch (t.readUInt8Enum(Q, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Q.TokenTransfer:
      const n = $e(t), r = _t(t.readBytes(8), !1), s = Fg(t);
      return I5(n, r, s);
    case Q.ContractCall:
      const i = Qr(t), o = ae(t), a = ae(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const E = $e(t);
        c.push(E);
      }
      return Dg(i, o, a, c);
    case Q.SmartContract:
      const f = ae(t), l = ae(t, 4, 1e5);
      return nh(f, l);
    case Q.VersionedSmartContract: {
      const p = t.readUInt8Enum(dc, (T) => {
        throw new Error(`Cannot recognize ClarityVersion: ${T}`);
      }), E = ae(t), S = ae(t, 4, 1e5);
      return nh(E, S, p);
    }
    case Q.PoisonMicroblock:
      return $5();
    case Q.Coinbase: {
      const p = t.readBytes(qn);
      return rh(p);
    }
    case Q.CoinbaseToAltRecipient: {
      const p = t.readBytes(qn), E = $e(t);
      return rh(p, E);
    }
    case Q.NakamotoCoinbase: {
      const p = t.readBytes(qn), E = $e(t), S = t.readBytes(hc);
      return C5(p, E, S);
    }
    case Q.TenureChange:
      const g = tt(t.readBytes(20)), h = tt(t.readBytes(20)), b = tt(t.readBytes(20)), y = tt(t.readBytes(32)), A = t.readUInt32BE(), v = t.readUInt8Enum(wc, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), L = tt(t.readBytes(20));
      return v5(g, h, b, y, A, v, L);
  }
}
class Gs extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Fn extends Gs {
  constructor(e) {
    super(e);
  }
}
class ee extends Gs {
  constructor(e) {
    super(e);
  }
}
class kg extends Gs {
  constructor(e) {
    super(e);
  }
}
class so extends Gs {
  constructor(e) {
    super(e);
  }
}
class Kn extends Gs {
  constructor(e) {
    super(e);
  }
}
var he;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(he || (he = {}));
function xc(t) {
  return Cg(tt(t.readBytes(Vs)));
}
function Ur(t, e) {
  return {
    pubKeyEncoding: t,
    type: k.TransactionAuthField,
    contents: e
  };
}
function B5(t) {
  const e = t.readUInt8Enum(he, (n) => {
    throw new ee(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case he.PublicKeyCompressed:
      return Ur(mt.Compressed, yc(t));
    case he.PublicKeyUncompressed:
      return Ur(mt.Uncompressed, m5(yc(t).data));
    case he.SignatureCompressed:
      return Ur(mt.Compressed, xc(t));
    case he.SignatureUncompressed:
      return Ur(mt.Uncompressed, xc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Bl(t) {
  return wt(t.data);
}
function H5(t) {
  const e = [];
  switch (t.contents.type) {
    case k.PublicKey:
      e.push(t.pubKeyEncoding === mt.Compressed ? he.PublicKeyCompressed : he.PublicKeyUncompressed), e.push(ro(x5(t.contents.data)));
      break;
    case k.MessageSignature:
      e.push(t.pubKeyEncoding === mt.Compressed ? he.SignatureCompressed : he.SignatureUncompressed), e.push(Bl(t.contents));
      break;
  }
  return Ct(e);
}
function je(t) {
  switch (t.type) {
    case k.Address:
      return Ks(t);
    case k.Principal:
      return Og(t);
    case k.LengthPrefixedString:
      return Jr(t);
    case k.MemoString:
      return N5(t);
    case k.AssetInfo:
      return jg(t);
    case k.PostCondition:
      return Rg(t);
    case k.PublicKey:
      return ro(t);
    case k.LengthPrefixedList:
      return Hl(t);
    case k.Payload:
      return Ll(t);
    case k.TransactionAuthField:
      return H5(t);
    case k.MessageSignature:
      return Bl(t);
  }
}
function _5() {
  return {
    type: k.Address,
    version: Us.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Zr(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === it.SerializeP2PKH || e === it.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === it.SerializeP2WPKH || e === it.SerializeP2WSH || e === it.SerializeP2WSHNonSequential) && !r.every(fs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case it.SerializeP2PKH:
      return Bi(t, Z5(r[0].data));
    case it.SerializeP2WPKH:
      return Bi(t, Q5(r[0].data));
    case it.SerializeP2SH:
    case it.SerializeP2SHNonSequential:
      return Bi(t, J5(n, r.map(ro)));
    case it.SerializeP2WSH:
    case it.SerializeP2WSHNonSequential:
      return Bi(t, tE(n, r.map(ro)));
  }
}
function Ks(t) {
  const e = [];
  return e.push(wt(Rs(t.version, 1))), e.push(wt(t.hash160)), Ct(e);
}
function Qr(t) {
  const e = Mo(tt(t.readBytes(1))), n = tt(t.readBytes(20));
  return { type: k.Address, version: e, hash160: n };
}
function Og(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ks(t.address)), t.prefix === Ns.Contract && e.push(Jr(t.contractName)), Ct(e);
}
function M5(t) {
  const e = t.readUInt8Enum(Ns, (s) => {
    throw new ee(`Unexpected Principal payload type: ${s}`);
  }), n = Qr(t);
  if (e === Ns.Standard)
    return { type: k.Principal, prefix: e, address: n };
  const r = ae(t);
  return {
    type: k.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Jr(t) {
  const e = [], n = us(t.content), r = n.byteLength;
  return e.push(wt(Rs(r, t.lengthPrefixBytes))), e.push(n), Ct(e);
}
function ae(t, e, n) {
  e = e || 1;
  const r = Mo(tt(t.readBytes(e))), s = Al(t.readBytes(r));
  return ur(s, e, n ?? 128);
}
function U5(t) {
  return ur(t, 4, 1e5);
}
function sh(t) {
  if (t && Kg(t, eo))
    throw new Error(`Memo exceeds maximum length of ${eo} bytes`);
  return { type: k.MemoString, content: t };
}
function N5(t) {
  const e = [], n = us(t.content), r = X5(tt(n), eo * 2);
  return e.push(wt(r)), Ct(e);
}
function Fg(t) {
  let e = Al(t.readBytes(eo));
  return e = e.replace(/\u0000*$/, ""), { type: k.MemoString, content: e };
}
function jg(t) {
  const e = [];
  return e.push(Ks(t.address)), e.push(Jr(t.contractName)), e.push(Jr(t.assetName)), Ct(e);
}
function mc(t) {
  return {
    type: k.AssetInfo,
    address: Qr(t),
    contractName: ae(t),
    assetName: ae(t)
  };
}
function Po(t, e) {
  return {
    type: k.LengthPrefixedList,
    lengthPrefixBytes: 4,
    values: t
  };
}
function Hl(t) {
  const e = t.values, n = [];
  n.push(wt(Rs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(je(r));
  return Ct(n);
}
function zg(t, e, n) {
  const r = Mo(tt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case k.Address:
        s.push(Qr(t));
        break;
      case k.LengthPrefixedString:
        s.push(ae(t));
        break;
      case k.MemoString:
        s.push(Fg(t));
        break;
      case k.AssetInfo:
        s.push(mc(t));
        break;
      case k.PostCondition:
        s.push(T5(t));
        break;
      case k.PublicKey:
        s.push(yc(t));
        break;
      case k.TransactionAuthField:
        s.push(B5(t));
        break;
    }
  return Po(s);
}
function Rg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Og(t.principal)), (t.conditionType === qt.Fungible || t.conditionType === qt.NonFungible) && e.push(jg(t.assetInfo)), t.conditionType === qt.NonFungible && e.push(Be(t.assetName)), e.push(t.conditionCode), t.conditionType === qt.STX || t.conditionType === qt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Fn("The post-condition amount may not be larger than 8 bytes");
    e.push(Un(t.amount, !1, 8));
  }
  return Ct(e);
}
function T5(t) {
  const e = t.readUInt8Enum(qt, (o) => {
    throw new ee(`Could not read ${o} as PostConditionType`);
  }), n = M5(t);
  let r, s, i;
  switch (e) {
    case qt.STX:
      return r = t.readUInt8Enum(no, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: k.PostCondition,
        conditionType: qt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case qt.Fungible:
      return s = mc(t), r = t.readUInt8Enum(no, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: k.PostCondition,
        conditionType: qt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case qt.NonFungible:
      s = mc(t);
      const o = $e(t);
      return r = t.readUInt8Enum(gc, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: k.PostCondition,
        conditionType: qt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Te(t, e) {
  return Ct([t, e]);
}
function P5(t) {
  return new Uint8Array([t.type]);
}
function D5(t) {
  return t.type === B.OptionalNone ? new Uint8Array([t.type]) : Te(t.type, Be(t.value));
}
function k5(t) {
  const e = new Uint8Array(4);
  return ar(e, t.buffer.length, 0), Te(t.type, Uo(e, t.buffer));
}
function O5(t) {
  const e = Sl(WA(t.value, BigInt(c8)), xg);
  return Te(t.type, e);
}
function F5(t) {
  const e = Sl(t.value, xg);
  return Te(t.type, e);
}
function j5(t) {
  return Te(t.type, Ks(t.address));
}
function z5(t) {
  return Te(t.type, Uo(Ks(t.address), Jr(t.contractName)));
}
function R5(t) {
  return Te(t.type, Be(t.value));
}
function V5(t) {
  const e = [], n = new Uint8Array(4);
  ar(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Be(r);
    e.push(s);
  }
  return Te(t.type, Ct(e));
}
function G5(t) {
  const e = [], n = new Uint8Array(4);
  ar(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ur(s);
    e.push(Jr(i));
    const o = Be(t.data[s]);
    e.push(o);
  }
  return Te(t.type, Ct(e));
}
function Vg(t, e) {
  const n = [], r = e == "ascii" ? yg(t.data) : us(t.data), s = new Uint8Array(4);
  return ar(s, r.length, 0), n.push(s), n.push(r), Te(t.type, Ct(n));
}
function K5(t) {
  return Vg(t, "ascii");
}
function W5(t) {
  return Vg(t, "utf8");
}
function Be(t) {
  switch (t.type) {
    case B.BoolTrue:
    case B.BoolFalse:
      return P5(t);
    case B.OptionalNone:
    case B.OptionalSome:
      return D5(t);
    case B.Buffer:
      return k5(t);
    case B.UInt:
      return F5(t);
    case B.Int:
      return O5(t);
    case B.PrincipalStandard:
      return j5(t);
    case B.PrincipalContract:
      return z5(t);
    case B.ResponseOk:
    case B.ResponseErr:
      return R5(t);
    case B.List:
      return V5(t);
    case B.Tuple:
      return G5(t);
    case B.StringASCII:
      return K5(t);
    case B.StringUTF8:
      return W5(t);
    default:
      throw new Fn("Unable to serialize. Invalid Clarity Value.");
  }
}
function q5(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ih = /* @__PURE__ */ new Map();
function Gg(t, e) {
  const n = ih.get(t);
  if (n !== void 0)
    return n(e);
  const r = q5(t);
  return ih.set(t, r), Gg(t, e);
}
class Is {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return i8(this.readBytes(4), 0);
  }
  readUInt8() {
    return r8(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return e8(this.readBytes(2), 0);
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
    if (Gg(e, r))
      return r;
    throw n(r);
  }
}
function $e(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Is(wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Is(t) : e = t;
  switch (e.readUInt8Enum(B, (r) => {
    throw new ee(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case B.Int:
      return u5(e.readBytes(16));
    case B.UInt:
      return Hg(e.readBytes(16));
    case B.Buffer:
      const r = e.readUInt32BE();
      return f5(e.readBytes(r));
    case B.BoolTrue:
      return Lg();
    case B.BoolFalse:
      return Bg();
    case B.PrincipalStandard:
      const s = Qr(e);
      return o5(s);
    case B.PrincipalContract:
      const i = Qr(e), o = ae(e);
      return vg(i, o);
    case B.ResponseOk:
      return d5($e(e));
    case B.ResponseErr:
      return h5($e(e));
    case B.OptionalNone:
      return _g();
    case B.OptionalSome:
      return Mg($e(e));
    case B.List:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push($e(e));
      return Ug(c);
    case B.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = ae(e).content;
        if (A === void 0)
          throw new ee('"content" is undefined');
        f[A] = $e(e);
      }
      return Ng(f);
    case B.StringASCII:
      const l = e.readUInt32BE(), g = ZA(e.readBytes(l));
      return g5(g);
    case B.StringUTF8:
      const h = e.readUInt32BE(), b = Al(e.readBytes(h));
      return p5(b);
    default:
      throw new ee("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Y5 = (t) => t.length % 2 == 0 ? t : `0${t}`, X5 = (t, e) => t.padEnd(e, "0"), Kg = (t, e) => t ? us(t).length > e : !1;
function io(t) {
  return ad(t);
}
const Ts = (t) => C8(vl(t)), _l = (t) => tt(r5(t)), Z5 = (t) => tt(Ts(t)), Q5 = (t) => {
  const e = Ts(t), n = Uo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ts(n);
  return tt(r);
}, J5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ct(n), s = Ts(r);
  return tt(s);
}, tE = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ct(n), s = vl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ct(i), a = Ts(o);
  return tt(a);
};
function eE(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
const Tr = (t) => {
  try {
    return br.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ml() {
  return {
    type: k.MessageSignature,
    data: tt(new Uint8Array(Vs))
  };
}
function Ul(t, e, n, r) {
  const s = Zr(0, t, 1, [Ke(e)]).hash160, i = fs(Ke(e)) ? mt.Compressed : mt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: _t(n, !1),
    fee: _t(r, !1),
    keyEncoding: i,
    signature: Ml()
  };
}
function nE(t, e, n, r, s) {
  const i = n.map(Ke), o = Zr(0, t, e, i).hash160;
  return {
    hashMode: t,
    signer: o,
    nonce: _t(r, !1),
    fee: _t(s, !1),
    fields: [],
    signaturesRequired: e
  };
}
function Ps(t) {
  return "signature" in t;
}
function oh(t) {
  return t === it.SerializeP2SH || t === it.SerializeP2WSH;
}
function rE(t) {
  return t === it.SerializeP2SHNonSequential || t === it.SerializeP2WSHNonSequential;
}
function ah(t) {
  const e = io(t);
  return e.nonce = 0, e.fee = 0, Ps(e) ? e.signature = Ml() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function sE(t) {
  const e = [
    t.hashMode,
    wt(t.signer),
    Un(t.nonce, !1, 8),
    Un(t.fee, !1, 8),
    t.keyEncoding,
    Bl(t.signature)
  ];
  return Ct(e);
}
function iE(t) {
  const e = [
    t.hashMode,
    wt(t.signer),
    Un(t.nonce, !1, 8),
    Un(t.fee, !1, 8)
  ], n = Po(t.fields);
  e.push(Hl(n));
  const r = new Uint8Array(2);
  return n8(r, t.signaturesRequired, 0), e.push(r), Ct(e);
}
function oE(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt(`0x${tt(e.readBytes(8))}`), s = BigInt(`0x${tt(e.readBytes(8))}`), i = e.readUInt8Enum(mt, (a) => {
    throw new ee(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === it.SerializeP2WPKH && i != mt.Compressed)
    throw new ee("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = xc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function aE(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt("0x" + tt(e.readBytes(8))), s = BigInt("0x" + tt(e.readBytes(8))), i = zg(e, k.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case k.PublicKey:
        fs(u.contents) || (o = !0);
        break;
      case k.MessageSignature:
        if (u.pubKeyEncoding === mt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Kn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === it.SerializeP2WSH || t === it.SerializeP2WSHNonSequential))
    throw new Kn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ma(t) {
  return Ps(t) ? sE(t) : iE(t);
}
function Sa(t) {
  const e = t.readUInt8Enum(it, (n) => {
    throw new ee(`Could not parse ${n} as AddressHashMode`);
  });
  return e === it.SerializeP2PKH || e === it.SerializeP2WPKH ? oE(e, t) : aE(e, t);
}
function Wg(t, e, n, r) {
  const i = t + tt(new Uint8Array([e])) + tt(Un(n, !1, 8)) + tt(Un(r, !1, 8));
  if (wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return _l(wt(i));
}
function qg(t, e, n) {
  const r = 33 + Vs, s = fs(e) ? mt.Compressed : mt.Uncompressed, i = t + Y5(s.toString(16)) + n.data, o = wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return _l(o);
}
function cE(t, e, n, r, s) {
  const i = Wg(t, e, n, r), o = A5(s, i), a = E5(s), c = qg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Yg(t, e, n, r, s, i) {
  const o = Wg(t, e, n, r), a = Ke(b5(o, i, s)), c = qg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function lE() {
  const t = Ul(it.SerializeP2PKH, "", 0, 0);
  return t.signer = _5().hash160, t.keyEncoding = mt.Compressed, t.signature = Ml(), t;
}
function ch(t, e, n) {
  return Ps(t) ? uE(t, e, n) : fE(t, e, n);
}
function uE(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Yg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Zr(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Kn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function fE(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case k.PublicKey:
        fs(c.contents) || (i = !0), r.push(c.contents);
        break;
      case k.MessageSignature:
        c.pubKeyEncoding === mt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Yg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (oh(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Kn("Too many signatures");
        break;
    }
  if (oh(t.hashMode) && o !== t.signaturesRequired || rE(t.hashMode) && o < t.signaturesRequired)
    throw new Kn("Incorrect number of signatures");
  if (i && (t.hashMode === it.SerializeP2WSH || t.hashMode === it.SerializeP2WSHNonSequential))
    throw new Kn("Uncompressed keys are not allowed in this hash mode");
  const a = Zr(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Kn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Nl(t) {
  return {
    authType: Et.Standard,
    spendingCondition: t
  };
}
function Tl(t, e) {
  return {
    authType: Et.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ul(it.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function lh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Et.Standard:
        return Nl(ah(t.spendingCondition));
      case Et.Sponsored:
        return Tl(ah(t.spendingCondition), lE());
      default:
        throw new so("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function hE(t, e) {
  switch (t.authType) {
    case Et.Standard:
      return ch(t.spendingCondition, e, Et.Standard);
    case Et.Sponsored:
      return ch(t.spendingCondition, e, Et.Standard);
    default:
      throw new so("Invalid origin auth type");
  }
}
function dE(t, e) {
  switch (t.authType) {
    case Et.Standard:
      const n = {
        ...t.spendingCondition,
        fee: _t(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Et.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: _t(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function gE(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: _t(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function pE(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: _t(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function bE(t, e) {
  const n = {
    ...e,
    nonce: _t(e.nonce, !1),
    fee: _t(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function yE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Et.Standard:
      e.push(ma(t.spendingCondition));
      break;
    case Et.Sponsored:
      e.push(ma(t.spendingCondition)), e.push(ma(t.sponsorSpendingCondition));
      break;
  }
  return Ct(e);
}
function wE(t) {
  const e = t.readUInt8Enum(Et, (r) => {
    throw new ee(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Et.Standard:
      return n = Sa(t), Nl(n);
    case Et.Sponsored:
      n = Sa(t);
      const r = Sa(t);
      return Tl(n, r);
  }
}
var at;
(function(t) {
  t[t.ClarityAbiTypeUInt128 = 1] = "ClarityAbiTypeUInt128", t[t.ClarityAbiTypeInt128 = 2] = "ClarityAbiTypeInt128", t[t.ClarityAbiTypeBool = 3] = "ClarityAbiTypeBool", t[t.ClarityAbiTypePrincipal = 4] = "ClarityAbiTypePrincipal", t[t.ClarityAbiTypeNone = 5] = "ClarityAbiTypeNone", t[t.ClarityAbiTypeBuffer = 6] = "ClarityAbiTypeBuffer", t[t.ClarityAbiTypeResponse = 7] = "ClarityAbiTypeResponse", t[t.ClarityAbiTypeOptional = 8] = "ClarityAbiTypeOptional", t[t.ClarityAbiTypeTuple = 9] = "ClarityAbiTypeTuple", t[t.ClarityAbiTypeList = 10] = "ClarityAbiTypeList", t[t.ClarityAbiTypeStringAscii = 11] = "ClarityAbiTypeStringAscii", t[t.ClarityAbiTypeStringUtf8 = 12] = "ClarityAbiTypeStringUtf8", t[t.ClarityAbiTypeTraitReference = 13] = "ClarityAbiTypeTraitReference";
})(at || (at = {}));
const Xg = (t) => typeof t == "string", Zg = (t) => t.buffer !== void 0, Qg = (t) => t["string-ascii"] !== void 0, Jg = (t) => t["string-utf8"] !== void 0, tp = (t) => t.response !== void 0, ep = (t) => t.optional !== void 0, np = (t) => t.tuple !== void 0, rp = (t) => t.list !== void 0;
function xE(t) {
  if (Xg(t)) {
    if (t === "uint128")
      return { id: at.ClarityAbiTypeUInt128, type: t };
    if (t === "int128")
      return { id: at.ClarityAbiTypeInt128, type: t };
    if (t === "bool")
      return { id: at.ClarityAbiTypeBool, type: t };
    if (t === "principal")
      return { id: at.ClarityAbiTypePrincipal, type: t };
    if (t === "trait_reference")
      return { id: at.ClarityAbiTypeTraitReference, type: t };
    if (t === "none")
      return { id: at.ClarityAbiTypeNone, type: t };
    throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(t)}`);
  } else {
    if (Zg(t))
      return { id: at.ClarityAbiTypeBuffer, type: t };
    if (tp(t))
      return { id: at.ClarityAbiTypeResponse, type: t };
    if (ep(t))
      return { id: at.ClarityAbiTypeOptional, type: t };
    if (np(t))
      return { id: at.ClarityAbiTypeTuple, type: t };
    if (rp(t))
      return { id: at.ClarityAbiTypeList, type: t };
    if (Qg(t))
      return { id: at.ClarityAbiTypeStringAscii, type: t };
    if (Jg(t))
      return { id: at.ClarityAbiTypeStringUtf8, type: t };
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(t)}`);
  }
}
function vr(t) {
  if (Xg(t))
    return t === "int128" ? "int" : t === "uint128" ? "uint" : t;
  if (Zg(t))
    return `(buff ${t.buffer.length})`;
  if (Qg(t))
    return `(string-ascii ${t["string-ascii"].length})`;
  if (Jg(t))
    return `(string-utf8 ${t["string-utf8"].length})`;
  if (tp(t))
    return `(response ${vr(t.response.ok)} ${vr(t.response.error)})`;
  if (ep(t))
    return `(optional ${vr(t.optional)})`;
  if (np(t))
    return `(tuple ${t.tuple.map((e) => `(${e.name} ${vr(e.type)})`).join(" ")})`;
  if (rp(t))
    return `(list ${t.list.length} ${vr(t.list.type)})`;
  throw new Error(`Type string unsupported for Clarity type: ${JSON.stringify(t)}`);
}
function Lr(t, e) {
  const n = xE(e);
  switch (t.type) {
    case B.BoolTrue:
    case B.BoolFalse:
      return n.id === at.ClarityAbiTypeBool;
    case B.Int:
      return n.id === at.ClarityAbiTypeInt128;
    case B.UInt:
      return n.id === at.ClarityAbiTypeUInt128;
    case B.Buffer:
      return n.id === at.ClarityAbiTypeBuffer && n.type.buffer.length >= t.buffer.length;
    case B.StringASCII:
      return n.id === at.ClarityAbiTypeStringAscii && n.type["string-ascii"].length >= t.data.length;
    case B.StringUTF8:
      return n.id === at.ClarityAbiTypeStringUtf8 && n.type["string-utf8"].length >= t.data.length;
    case B.OptionalNone:
      return n.id === at.ClarityAbiTypeNone || n.id === at.ClarityAbiTypeOptional;
    case B.OptionalSome:
      return n.id === at.ClarityAbiTypeOptional && Lr(t.value, n.type.optional);
    case B.ResponseErr:
      return n.id === at.ClarityAbiTypeResponse && Lr(t.value, n.type.response.error);
    case B.ResponseOk:
      return n.id === at.ClarityAbiTypeResponse && Lr(t.value, n.type.response.ok);
    case B.PrincipalContract:
      return n.id === at.ClarityAbiTypePrincipal || n.id === at.ClarityAbiTypeTraitReference;
    case B.PrincipalStandard:
      return n.id === at.ClarityAbiTypePrincipal;
    case B.List:
      return n.id == at.ClarityAbiTypeList && n.type.list.length >= t.list.length && t.list.every((r) => Lr(r, n.type.list.type));
    case B.Tuple:
      if (n.id == at.ClarityAbiTypeTuple) {
        const r = io(t.data);
        for (let s = 0; s < n.type.tuple.length; s++) {
          const i = n.type.tuple[s], o = i.name, a = r[o];
          if (a) {
            if (!Lr(a, i.type))
              return !1;
            delete r[o];
          } else
            return !1;
        }
        return !0;
      } else
        return !1;
    default:
      return !1;
  }
}
function mE(t, e) {
  const n = e.functions.filter((r) => r.name === t.functionName.content);
  if (n.length === 1) {
    const s = n[0].args;
    if (t.functionArgs.length !== s.length)
      throw new Error(`Clarity function expects ${s.length} argument(s) but received ${t.functionArgs.length}`);
    for (let i = 0; i < t.functionArgs.length; i++) {
      const o = t.functionArgs[i], a = s[i];
      if (!Lr(o, a.type)) {
        const c = i + 1;
        throw new Error(`Clarity function \`${t.functionName.content}\` expects argument ${c} to be of type ${vr(a.type)}, not ${Cr(o)}`);
      }
    }
    return !0;
  } else throw n.length === 0 ? new Error(`ABI doesn't contain a function with the name ${t.functionName.content}`) : new Error(`Malformed ABI. Contains multiple functions with the name ${t.functionName.content}`);
}
class sp {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: _t(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? o8, this.postConditionMode = i ?? lr.Deny, this.postConditions = s ?? Po([]), o)
      this.anchorMode = f8(o);
    else
      switch (r.payloadType) {
        case Q.Coinbase:
        case Q.CoinbaseToAltRecipient:
        case Q.NakamotoCoinbase:
        case Q.PoisonMicroblock:
        case Q.TenureChange:
          this.anchorMode = kt.OnChainOnly;
          break;
        case Q.ContractCall:
        case Q.SmartContract:
        case Q.VersionedSmartContract:
        case Q.TokenTransfer:
          this.anchorMode = kt.Any;
          break;
      }
  }
  signBegin() {
    const e = io(this);
    return e.auth = lh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = io(this);
    return e.auth = lh(e.auth), e.txid();
  }
  verifyOrigin() {
    return hE(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Et.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Et.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Et.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ps(n)) {
      const r = fs(e);
      n.fields.push(Ur(r ? mt.Compressed : mt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = cE(n, r, e.fee, e.nonce, s);
    return Ps(e) ? e.signature = i : e.fields.push(Ur(s.data.byteLength === wg ? mt.Compressed : mt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return _l(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new so("Cannot sponsor sign a non-sponsored transaction");
    this.auth = bE(this.auth, e);
  }
  setFee(e) {
    this.auth = dE(this.auth, e);
  }
  setNonce(e) {
    this.auth = gE(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new so("Cannot sponsor sign a non-sponsored transaction");
    this.auth = pE(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Fn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Fn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Fn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Fn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Fn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ar(n, this.chainId, 0), e.push(n), e.push(yE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Hl(this.postConditions)), e.push(Ll(this.payload)), Ct(e);
  }
}
function SE(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Is(wt(t.slice(2))) : e = new Is(wt(t)) : t instanceof Uint8Array ? e = new Is(t) : e = t;
  const n = e.readUInt8Enum(cr, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = wE(e), i = e.readUInt8Enum(kt, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(lr, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = zg(e, k.PostCondition), c = L5(e);
  return new sp(n, s, c, a, o, i, r);
}
async function AE(t, e) {
  const n = `${e.coreApiUrl}/extended/v1/address/${t}/nonces`, s = await (await e.fetchFn(n)).json();
  return BigInt(s.possible_next_nonce);
}
async function EE(t, e) {
  const n = be.fromNameOrNetwork(e ?? new cs()), r = n.getAccountApiUrl(t);
  try {
    return await AE(t, n);
  } catch {
  }
  const s = await n.fetchFn(r);
  if (!s.ok) {
    let a = "";
    try {
      a = await s.text();
    } catch {
    }
    throw new Error(`Error fetching nonce. Response ${s.status}: ${s.statusText}. Attempted to fetch ${r} and failed with the message: "${a}"`);
  }
  const i = await s.text(), o = JSON.parse(i);
  return BigInt(o.nonce);
}
async function IE(t, e) {
  const r = {
    method: "GET",
    headers: {
      Accept: "application/text"
    }
  }, s = be.fromNameOrNetwork(e ?? vE(t)), i = s.getTransferFeeEstimateApiUrl(), o = await s.fetchFn(i, r);
  if (!o.ok) {
    let f = "";
    try {
      f = await o.text();
    } catch {
    }
    throw new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${i} and failed with the message: "${f}"`);
  }
  const a = await o.text(), c = BigInt(t.serialize().byteLength);
  return BigInt(a) * c;
}
async function $E(t, e, n) {
  var c;
  const r = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_payload: tt(Ll(t)),
      ...e ? { estimated_len: e } : {}
    })
  }, s = be.fromNameOrNetwork(n ?? new cs()), i = s.getTransactionFeeEstimateApiUrl(), o = await s.fetchFn(i, r);
  if (!o.ok) {
    const u = await o.text().then((f) => {
      try {
        return JSON.parse(f);
      } catch {
        return f;
      }
    });
    throw (u == null ? void 0 : u.reason) === "NoEstimateAvailable" || typeof u == "string" && u.includes("NoEstimateAvailable") ? new kg(((c = u == null ? void 0 : u.reason_data) == null ? void 0 : c.message) ?? "") : new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${i} and failed with the message: "${u}"`);
  }
  return (await o.json()).estimations;
}
async function CE(t, e, n) {
  const r = {
    method: "GET"
  }, s = be.fromNameOrNetwork(n), i = s.getAbiApiUrl(t, e), o = await s.fetchFn(i, r);
  if (!o.ok) {
    const a = await o.text().catch(() => "");
    throw new Error(`Error fetching contract ABI for contract "${e}" at address ${t}. Response ${o.status}: ${o.statusText}. Attempted to fetch ${i} and failed with the message: "${a}"`);
  }
  return JSON.parse(await o.text());
}
function vE(t) {
  switch (t.version) {
    case cr.Mainnet:
      return new cs();
    case cr.Testnet:
      return new Zd();
  }
}
async function LE(t) {
  const e = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new cs(),
    postConditionMode: lr.Deny,
    sponsored: !1
  }, n = Object.assign(e, t), r = Dg(n.contractAddress, n.contractName, n.functionName, n.functionArgs);
  if (n != null && n.validateWithAbi) {
    let f;
    if (typeof n.validateWithAbi == "boolean")
      if (n != null && n.network)
        f = await CE(n.contractAddress, n.contractName, n.network);
      else
        throw new Error("Network option must be provided in order to validate with ABI");
    else
      f = n.validateWithAbi;
    mE(r, f);
  }
  let s = null, i = null;
  if ("publicKey" in n)
    s = Ul(it.SerializeP2PKH, n.publicKey, n.nonce, n.fee);
  else {
    const f = n.useNonSequentialMultiSig ? it.SerializeP2SHNonSequential : it.SerializeP2SH, l = n.address ? _E(n.publicKeys, n.numSignatures, f, To(n.address).hash160) : n.publicKeys;
    s = nE(f, n.numSignatures, l, n.nonce, n.fee);
  }
  n.sponsored ? i = Tl(s) : i = Nl(s);
  const o = be.fromNameOrNetwork(n.network), a = [];
  n.postConditions && n.postConditions.length > 0 && n.postConditions.forEach((f) => {
    a.push(f);
  });
  const c = Po(a), u = new sp(o.version, i, r, c, n.postConditionMode, n.anchorMode, o.chainId);
  if (t.fee === void 0 || t.fee === null) {
    const f = await HE(u, o);
    u.setFee(f);
  }
  if (t.nonce === void 0 || t.nonce === null) {
    const f = o.version === cr.Mainnet ? Us.MainnetSingleSig : Us.TestnetSingleSig, l = br.c32address(f, u.auth.spendingCondition.signer), g = await EE(l, o);
    u.setNonce(g);
  }
  return u;
}
function BE(t) {
  const e = t.auth.spendingCondition.hashMode;
  if ([it.SerializeP2SH, it.SerializeP2WSH].includes(e)) {
    const r = t.auth.spendingCondition, s = r.fields.filter((o) => o.contents.type === k.MessageSignature).length, i = (r.signaturesRequired - s) * (Vs + 1);
    return t.serialize().byteLength + i;
  } else
    return t.serialize().byteLength;
}
async function HE(t, e) {
  try {
    const n = BE(t);
    return (await $E(t.payload, n, e))[1].fee;
  } catch (n) {
    if (n instanceof kg)
      return await IE(t, e);
    throw n;
  }
}
function _E(t, e, n, r) {
  if (Zr(0, n, e, t.map(Ke)).hash160 === r)
    return t;
  const i = t.slice().sort();
  if (Zr(0, n, e, i.map(Ke)).hash160 === r)
    return i;
  throw new Error("Failed to find matching multi-sig address given public-keys.");
}
const uh = c5, fh = Hg, ME = Ug, UE = Ng, ip = (t) => {
  let e = "";
  for (const n of t)
    e += n.toString(16).padStart(2, "0");
  return e;
}, NE = ["store_write"], hh = "/manifest.json", TE = /* @__PURE__ */ new Set([4001, -31001]), PE = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], DE = ["result", "data", "payload", "response", "params"], dh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Pl = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Ws = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), hs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Pr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, op = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Dl = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => op(i, r)) === s
  );
}, ap = (t) => t ? Dl(hs()).some(
  (e) => {
    var n;
    return e.id === t && (Ws(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, cp = () => {
  if (typeof window > "u")
    return;
  const t = hs(), e = Dl(t).filter(
    (n) => {
      var r;
      return Ws(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Pr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of PE) {
    const r = Pr(t, n) ?? (t === window ? void 0 : Pr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, lp = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = hs(), n = Pr(e, t) ?? (e === window ? void 0 : Pr(window, t)) ?? Io(t);
  if (n)
    return n;
  if (Ws(t) || ap(t))
    return cp();
}, kE = (t) => {
  const e = hs();
  if (!e)
    return [];
  const n = Dl(e), r = t.filter(
    (s) => !n.some((i) => op(i, s)) && !!Pr(e, s.id)
  );
  return n.concat(r);
}, $n = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, We = () => ({ isConnected: !1 }), OE = ["blockstack-session", "blockstack"], up = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of OE) {
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
up();
const qs = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ot = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, FE = (t) => {
  const e = Ot(t);
  if (!e)
    return null;
  const n = qs(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, jE = (t) => {
  const e = Ot(t);
  if (!e)
    return null;
  const n = qs(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, oo = (t, e = "mainnet") => {
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
      return oo(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return oo(r, e);
  }
  return e;
}, ao = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, zE = (t) => typeof t == "string" ? qs(t) : ip(Be(t)), RE = (t) => typeof t == "string" ? qs(t) : ip(Rg(t)), VE = (t) => t === lr.Allow ? "allow" : "deny", ts = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Tr(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = ts(s, e + 1);
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
    const i = ts(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Tr(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Tr(n.testnet) ? n.testnet.trim() : null;
}, gh = (t) => {
  const e = Ot(t);
  if (!e)
    return null;
  const n = qs(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, Sc = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const a = Sc(o, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : gh(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => Ot(o)).find((o) => o && Tr(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => gh(o)).find(Boolean);
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
    const a = Sc(r[o], e, n + 1);
    if (a)
      return a;
  }
  return null;
}, GE = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && Tr(n) ? n.trim() : null;
  if (!r)
    return We();
  const s = Ec(r);
  return s !== "mainnet" ? We() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, KE = (t, e = "mainnet") => {
  const n = ts(t);
  if (!n)
    return We();
  const r = Ec(n) ?? oo(t, e);
  if (r !== "mainnet")
    return We();
  const s = Sc(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, Do = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ys = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && TE.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Nn = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ot(n == null ? void 0 : n.message) ?? Ot(e.message) ?? Ot(e.error) ?? Ot(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, fr = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Nn(e);
    if (e.status === "error")
      throw Nn(e.result ?? e);
  }
  return t;
}, ko = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return fr(r);
  } catch (r) {
    throw Nn(r);
  }
}, kl = () => cp(), es = (t) => {
  var r, s;
  const e = ge();
  if (Ws(e) || ap(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = hs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === kl();
}, ph = async (t, e, n) => {
  if (!es(t))
    return ko(t, e, n);
  const r = kl();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return fr(await r.request(e, n));
  } catch (s) {
    throw Nn(s);
  }
}, Aa = (t) => {
  const e = jE(t);
  if (!e)
    return null;
  try {
    const n = SE(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ac = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Aa(t), r = FE(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Ot(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ac(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of dh)
    if (Aa(s[a])) {
      i = Ot(s[a]);
      break;
    }
  const o = Ot(s.txId) || Ot(s.txid) || Ot(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Ot(s.txRaw) ?? void 0
    };
  for (const a of dh) {
    const c = Aa(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Ot(s[a]) ?? void 0
      };
  }
  for (const a of DE) {
    const c = s[a], u = Ac(c, e + 1);
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
}, bh = (t) => {
  const e = Ac(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, WE = (t) => ({
  ...t,
  fee: ao(t.fee),
  nonce: ao(t.nonce),
  sponsored: t.sponsored === !0
}), fp = (t) => {
  const e = t.postConditions && t.postConditions.length > 0 ? t.postConditions.map((n) => RE(n)) : void 0;
  return {
    contract: `${t.contractAddress}.${t.contractName}`,
    functionName: t.functionName,
    functionArgs: t.functionArgs.map((n) => zE(n)),
    network: oo(t.network),
    address: t.stxAddress,
    fee: ao(t.fee),
    nonce: ao(t.nonce),
    sponsored: t.sponsored ?? !1,
    postConditionMode: VE(t.postConditionMode),
    postConditions: e
  };
}, qE = (t) => {
  const e = fp(t);
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
}, hp = "WALLET_ADDRESS_MISMATCH";
let yh = 9e4;
const YE = 45e3;
let $s = null;
const co = (t) => {
  t && ($s = { address: t, at: Date.now() });
}, dp = () => {
  $s = null;
}, XE = () => $s && Date.now() - $s.at <= YE ? $s.address : null, ZE = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, QE = async (t) => {
  dp();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = fr(await t.request("wallet_connect")), n = ts(e);
  return co(n), n;
}, JE = async (t, e, n, r) => {
  try {
    return fr(await t.request(e, n));
  } catch (s) {
    const i = Nn(s);
    if (!ZE(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await QE(t);
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
        { code: o ? hp : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return fr(await t.request(e, n));
    } catch (a) {
      throw Nn(a);
    }
  }
};
let wh = 3e4;
const t6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${wh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, wh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, e6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: hp }
      );
    return c;
  }, s = XE();
  if (s)
    return $n(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  $n(n, "account-read");
  try {
    const c = fr(
      await t6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = ts(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Ys(c))
      throw Nn(c);
    $n(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return co(i), r(i, "wallet_getAccount");
  let o;
  $n(n, "account-reconnect");
  try {
    o = fr(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Nn(c);
  }
  const a = ts(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return co(a), r(a, "wallet_connect");
}, n6 = async (t, e) => {
  if (!es(t)) {
    $n(e.onProgress, "signing-request");
    const c = await ko(
      t,
      "stx_callContract",
      fp(e)
    );
    return bh(c);
  }
  const n = kl();
  if (!n)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  let r = "account-preflight", s;
  const i = async () => {
    var f;
    s = await e6(n, e.stxAddress, e.onProgress), r = "stx_callContract", $n(e.onProgress, "signing-request");
    const c = qE(e);
    console.info("[wallet:contract-call]", {
      stage: "XVERSE_SIGNING_REQUEST",
      providerId: ge(),
      contract: c.contract,
      functionName: c.functionName,
      functionArgCount: c.functionArgs.length,
      postConditionMode: c.postConditionMode,
      postConditionCount: ((f = c.postConditions) == null ? void 0 : f.length) ?? 0,
      expectedAddress: e.stxAddress,
      activeAddress: s
    });
    const u = await JE(
      n,
      "stx_callContract",
      c,
      e.stxAddress ?? s
    );
    return bh(u);
  };
  let o;
  const a = new Promise((c, u) => {
    o = setTimeout(() => {
      u(
        Object.assign(
          new Error(
            `Xverse did not answer the ${r} request within ${Math.round(
              yh / 1e3
            )}s (provider=${ge() ?? "unknown"}, expected=${e.stxAddress ?? "none"}, active=${s ?? "unknown"}, call=${e.contractAddress}.${e.contractName}::${e.functionName}). If Xverse showed an error toast, note its exact text; if you approved a transaction, it may still broadcast.`
          ),
          { code: "XVERSE_SIGNING_TIMEOUT", stage: r }
        )
      );
    }, yh);
  });
  try {
    return await Promise.race([i(), a]);
  } finally {
    o && clearTimeout(o);
  }
}, gp = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = gp(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, r6 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], s6 = async (t) => {
  const e = ge();
  if (es(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!Pl(e))
    return r6;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = gp(await ko(t, "supportedMethods"));
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
}, i6 = async (t) => {
  if (es(t))
    try {
      await ph(t, "wallet_disconnect");
    } catch {
    }
  const e = await s6(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await ph(t, r), i = KE(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), es(t) && co(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = Do(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Ys(s))
        return We();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return We();
}, o6 = async (t, e) => {
  const n = new ho(NE, void 0, "", hh), r = new vs({ appConfig: n });
  return new Promise((s) => {
    GA(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: hh,
        userSession: r,
        onFinish: (i) => {
          s(GE(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(We());
        }
      },
      e
    );
  });
}, a6 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : ge(), r = lp(n);
  return r ? (e && n && cd(n), r) : null;
}, c6 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return fg(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = pg, i = kE(s), o = document.body.style.overflow, a = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", c), r.remove();
    }, c = (u) => {
      u.key === "Escape" && (a(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (u) => {
      const f = a6(u, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof u == "string" ? u : ge() ?? "provider-object",
        resolved: !!f,
        requestBridge: typeof (f == null ? void 0 : f.request) == "function"
      }), a(), n(f);
    }, r.cancelCallback = () => {
      a(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", c), document.body.appendChild(r);
  });
}, pp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ge(), e = t ? lp(t) : void 0;
  if (e)
    return e;
  const n = hs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, l6 = async (t) => {
  up();
  const e = await c6({});
  if (!e)
    return We();
  if (typeof e.request == "function")
    try {
      const n = await i6(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Ys(n))
        return We();
      if (!Do(n))
        throw n;
    }
  return o6(t, e);
}, u6 = () => {
  const t = ge();
  return Pl(t) ? "leather" : Ws(t) ? "xverse" : t ? String(t) : void 0;
}, f6 = async (t) => {
  const e = o2("wallet_connect");
  ws({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await l6(t);
    return n.isConnected && n.address ? (Ic(n.address, u6()), $c(n.network), ws({ journey: e, step: "authorize", outcome: "success" })) : ws({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw ws({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: e2(n),
      error: n
    }), n;
  }
}, h6 = async () => {
  const t = pp();
  if (t && Pl(ge()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await ko(t, e);
        break;
      } catch (n) {
        if (Ys(n) || Do(n))
          continue;
      }
  KA(), ld(), dp(), Ic(null), $c(null), ws({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, d6 = (t, e) => {
  const n = pp(), r = WE(t);
  return $n(t.onProgress, "provider-selected"), !n || typeof n.request != "function" ? ($n(t.onProgress, "legacy-request"), Rf(r, e)) : void n6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Do(s) && !es(n)) {
      Rf(r, n);
      return;
    }
    if (console.error("[wallet] contract call request failed", s), Ys(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, g6 = (t) => {
  const e = X1(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (Ic(o.address), $c(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), a = await f6({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return a.isConnected ? (e.save(a), a) : o.isConnected ? o : a;
    },
    disconnect: async () => {
      await h6(), n();
    },
    getSession: r
  };
};
function bp(t, e, n) {
  var o;
  if (!n.isConnected || n.network !== "mainnet" || !((o = n.address) != null && o.startsWith("SP"))) throw Error("Connect a mainnet wallet first.");
  if (!e.length || e.length > 25 || e.some((a) => !Number.isSafeInteger(a.id) || a.id < 0 || typeof a.liked != "boolean") || new Set(e.map((a) => a.id)).size !== e.length) throw Error("Select 1–25 different songs.");
  const r = t.split("."), [s, i] = r;
  if (r.length !== 2 || !s.startsWith("SP") || !Tr(s) || !/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(i)) throw Error("Invalid likes contract.");
  return { contractAddress: s, contractName: i, functionName: e.length === 1 ? "set-liked" : "set-likes", functionArgs: e.length === 1 ? [fh(e[0].id), uh(e[0].liked)] : [ME(e.map((a) => UE({ id: fh(a.id), liked: uh(a.liked) })))], network: new cs(), stxAddress: n.address, sponsored: !1, postConditionMode: lr.Deny, postConditions: [], ...e.length === 1 ? { fee: 200n } : {} };
}
function yp(t, e, n) {
  return Array.isArray(t) ? [...new Set(t.map((r) => Number(r == null ? void 0 : r.tokenId)).filter((r) => Number.isSafeInteger(r) && e.has(r) && !n.has(r)))] : [];
}
async function p6(t, e, n) {
  const r = bp(t, e, n), i = (await LE({ ...r, publicKey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", fee: 0n, nonce: 0n, anchorMode: kt.Any })).serialize().length;
  return { microStx: i, totalStx: (i / 1e6).toFixed(6), perSongStx: (i / e.length / 1e6).toFixed(6), count: e.length };
}
const ce = g6({ appName: "Xtrata Radio", appIcon: "/favicon.ico" }), rt = (t) => document.getElementById(t);
let jt, Cn = [], Dr = /* @__PURE__ */ new Map(), vn = !1, Yn = !1, Oe = 0;
const lo = /* @__PURE__ */ new Map();
let Ol, wp = "", xp = [];
const Jt = (t) => {
  rt("status").textContent = t;
}, b6 = Date.now(), Hi = [], St = (t, e = {}) => {
  const n = { stage: t, elapsedMs: Date.now() - b6, ...e };
  console.info("[radio:likes]", n), Hi.push(JSON.stringify(n)), Hi.length > 100 && Hi.shift();
  const r = document.getElementById("diagnostics");
  r && (r.textContent = Hi.join(`
`));
}, y6 = {
  "provider-selected": "Wallet provider selected. Preparing the request…",
  "account-read": "Checking the active Xverse account. The transaction prompt has not been requested yet…",
  "account-cached": "Verified wallet account available. Preparing the transaction…",
  "account-read-failed": "Xverse did not provide its account. Trying its connection flow…",
  "account-reconnect": "Waiting for Xverse to confirm account access. Open the extension and check for a connection request.",
  "signing-request": "Transaction approval requested. Open your wallet to review the songs and network fee.",
  "legacy-request": "Wallet popup requested. Check your extension and browser popup permissions."
};
St("PAGE_READY", { version: "likes-debug-1" });
const kr = () => `xtrata.radio.chain.pending:${jt == null ? void 0 : jt.contract}:${ce.getSession().address}`, ns = () => {
  try {
    return localStorage.getItem(kr()) || lo.get(kr()) || "";
  } catch {
    return lo.get(kr()) || "";
  }
};
async function Ea(t = {}) {
  const e = await fetch("/radio/chain-likes?" + new URLSearchParams(t), { cache: "no-store", signal: AbortSignal.timeout(2e4) }), n = await e.json();
  if (!e.ok) throw Error(n.error || "Could not read on-chain likes.");
  return n;
}
function uo() {
  const t = ce.getSession(), e = t.isConnected && t.network === "mainnet" && Ol === t.address, n = !!ns();
  let r = [];
  try {
    r = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]");
  } catch {
  }
  const s = Array.isArray(r) ? new Set(r.map((a) => String(a == null ? void 0 : a.tokenId))).size : 0, i = e && !Yn ? yp(r, new Set(Cn.map((a) => a.id)), new Set([...Dr].filter(([, a]) => a.liked).map(([a]) => a))).length : s;
  if (rt("import-offer").textContent = s ? i ? `You have ${i} saved favourites to review for on-chain import. ${e ? "Use the import button below." : "Connect your wallet to check which ones still need importing."} Nothing is published automatically.` : "All eligible saved favourites are already liked by this wallet on-chain." : "", rt("wallet").textContent = e ? `Wallet: ${t.address}` : "", rt("disconnect").disabled = !t.isConnected || vn, rt("connect").disabled = vn, rt("import").disabled = !(jt != null && jt.enabled) || !e || vn || Yn || n, rt("pending").replaceChildren(), n) {
    const a = document.createElement("a");
    a.href = "https://explorer.hiro.so/txid/" + ns() + "?chain=mainnet", a.target = "_blank", a.rel = "noopener", a.textContent = "Transaction pending — view on explorer. Use Refresh to check confirmation.", rt("pending").append(a);
  }
  const o = new URL(location.href).searchParams.get("id");
  rt("songs").replaceChildren();
  for (const a of [...Cn].sort((c, u) => +(String(u.id) === o) - +(String(c.id) === o))) {
    const c = document.createElement("tr"), u = document.createElement("td"), f = document.createElement("td"), l = document.createElement("td"), g = document.createElement("button");
    u.textContent = `#${a.id} · ${a.title}`;
    const h = Dr.get(a.id);
    f.textContent = (h == null ? void 0 : h.total) ?? "—", g.textContent = h != null && h.liked ? "Unlike on-chain" : "Like on-chain", g.disabled = !e || !h || !(jt != null && jt.enabled) || vn || Yn || n, g.onclick = () => Ap([{ id: a.id, liked: !(h != null && h.liked) }]), l.append(g), c.append(u, f, l), rt("songs").append(c);
  }
}
let Ia = 0;
const mp = () => xp.filter((t) => {
  var e;
  return (e = rt("choices").querySelector(`input[data-id="${t.id}"]`)) == null ? void 0 : e.checked;
});
async function Sp() {
  const t = ++Ia, e = mp();
  rt("approve").disabled = !0, rt("fee-suggestion").textContent = e.length ? "Calculating a low-fee suggestion…" : "Select at least one song.";
  try {
    if (!e.length) return;
    const n = await p6(jt.contract, e, ce.getSession());
    if (t !== Ia) return;
    const r = rt("fee-suggestion");
    r.replaceChildren();
    const s = document.createElement("span");
    s.className = "fee-label", s.textContent = n.count === 1 ? "CUSTOM NETWORK FEE · ONE SONG" : "SUGGESTED MINIMUM · BATCH TOTAL";
    const i = document.createElement("strong");
    i.className = "fee-amount", i.textContent = n.count === 1 ? "0.0002 STX" : n.totalStx + " STX";
    const o = document.createElement("p");
    o.textContent = n.count === 1 ? "Choose Custom in your wallet and enter 0.0002 STX (200 microSTX). Pay no more for this like or unlike. If the wallet shows a higher fee, change it or cancel before signing." : "Suggested minimum fee: " + n.totalStx + " STX total (" + n.microStx + " microSTX). Approximately " + n.perSongStx + " STX per song for " + n.count + " songs. Choose the custom network fee in your wallet if its suggestion is higher.";
    const a = document.createElement("p");
    a.className = "fee-note", a.textContent = n.count === 1 ? "We request 0.0002 STX from your wallet. Xtrata charges no platform fee. Confirmation may take longer at this fee; if it is not accepted, cancel and try later." : "This is the standard single-signature relay minimum, not a guarantee of fast confirmation. Xtrata charges no platform fee. Check the final fee before signing.", r.append(s, i, o, a), rt("approve").disabled = !1;
  } catch {
    t === Ia && (rt("fee-suggestion").textContent = "Fee suggestion unavailable. Review the fee shown by your wallet.", rt("approve").disabled = !1);
  }
}
rt("choices").addEventListener("change", () => void Sp());
function Ap(t) {
  var e;
  St("REVIEW_OPEN", { count: t.length }), wp = ce.getSession().address || "", xp = t, rt("choices").replaceChildren();
  for (const n of t) {
    const r = document.createElement("label"), s = document.createElement("input");
    s.type = "checkbox", s.checked = !0, s.dataset.id = String(n.id), r.append(s, document.createTextNode(`${n.liked ? "Like" : "Unlike"} #${n.id} · ${((e = Cn.find((i) => i.id === n.id)) == null ? void 0 : e.title) || ""}`)), rt("choices").append(r, document.createElement("br"));
  }
  rt("review-note").textContent = "Up to 25 songs per transaction. Already confirmed likes are skipped on import and removed from this browser’s saved favourites. Closing or cancelling this review sends nothing.", rt("fee-reminder").textContent = "", Sp(), rt("review").showModal();
}
async function Oo() {
  St("REFRESH_START");
  const t = ++Oe;
  Yn = !0, Dr.clear(), uo();
  try {
    const e = await Ea();
    if (t !== Oe) return;
    if (jt = e, St("CONFIG_READ", { enabled: !!jt.enabled }), !jt.enabled) {
      Jt("On-chain likes are not activated on this site yet. Your previous favourites remain saved in this browser; imports and new likes will become available after activation.");
      return;
    }
    const n = ce.getSession(), r = n.network === "mainnet" ? n.address : void 0, s = await fetch("/radio/counts?range=all", { cache: "no-store" });
    if (!s.ok) throw Error("Song catalogue unavailable.");
    const i = await s.json();
    if (t !== Oe) return;
    Cn = i.tracks;
    const o = /* @__PURE__ */ new Map();
    for (let c = 0; c < Cn.length; c += 25) {
      const u = await Ea({ ids: Cn.slice(c, c + 25).map((f) => f.id).join(","), ...r ? { wallet: r } : {} });
      if (t !== Oe) return;
      if (u.contract !== jt.contract) throw Error("Contract configuration changed. Refresh before continuing.");
      for (const f of u.rows) o.set(f.id, f);
    }
    if (t !== Oe) return;
    Dr = o, Ol = r, St("STATES_READY", { tracks: Cn.length, connected: !!r }), Jt("Confirmed on-chain likes. Saved browser favourites are not included.");
    const a = ns();
    if (a && r) {
      const c = await Ea({ txid: a, wallet: r });
      if (t !== Oe) return;
      if (c.status === "confirmed" || c.status === "failed") {
        lo.delete(kr());
        try {
          localStorage.removeItem(kr());
        } catch {
        }
        Jt(c.status === "confirmed" ? "Transaction confirmed. Refresh if the latest count has not appeared yet." : "Transaction failed; it did not change your on-chain likes. A network fee may still have been paid.");
      }
    }
    if (t === Oe && r === ce.getSession().address && ce.getSession().isConnected && !ns()) {
      const c = z1([...Dr].filter(([, u]) => u.liked === !0).map(([u]) => u));
      c && St("LOCAL_FAVOURITES_CLEANED", { removed: c });
    }
  } catch (e) {
    t === Oe && Jt(e instanceof Error ? e.message : "Unable to refresh.");
  } finally {
    t === Oe && (Yn = !1, uo());
  }
}
rt("connect").onclick = async () => {
  St("CONNECT_CLICK");
  try {
    await ce.connect(), St("CONNECT_RETURNED", { connected: ce.getSession().isConnected, network: ce.getSession().network || "unknown" }), await Oo();
  } catch (t) {
    St("CONNECT_FAILED"), Jt(String(t));
  }
};
rt("disconnect").onclick = async () => {
  await ce.disconnect(), await Oo();
};
rt("refresh").onclick = () => void Oo();
rt("import").onclick = () => {
  St("IMPORT_CLICK");
  try {
    const t = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]"), e = yp(t, new Set(Cn.map((n) => n.id)), new Set([...Dr].filter(([, n]) => n.liked).map(([n]) => n)));
    if (St("IMPORT_FILTERED", { saved: Array.isArray(t) ? t.length : 0, eligible: e.length }), !e.length) {
      Jt("No unimported saved songs were found in this browser.");
      return;
    }
    Ap(e.slice(0, 25).map((n) => ({ id: n, liked: !0 }))), e.length > 25 && (rt("review-note").textContent = `Showing the first 25 of ${e.length} remaining favourites. After confirmation, import again to review the next batch.`);
  } catch {
    Jt("Saved favourites could not be read.");
  }
};
rt("cancel").onclick = () => {
  St("REVIEW_CANCEL"), rt("review").close();
};
rt("approve").onclick = async () => {
  if (St("APPROVE_CLICK", { busy: vn, loading: Yn, pending: !!ns() }), vn || Yn || ns()) {
    St("APPROVE_BLOCKED");
    return;
  }
  let t;
  const e = mp();
  rt("fee-reminder").replaceChildren(...Array.from(rt("fee-suggestion").childNodes, (n) => n.cloneNode(!0)));
  try {
    const n = ce.getSession();
    if (n.address !== wp || n.address !== Ol) throw Error("Wallet changed. Review these songs again.");
    const r = bp(jt.contract, e, n), s = kr();
    vn = !0, uo(), rt("review").close(), Jt("Review the network fee in your wallet. No platform fee or token transfer is requested."), St("WALLET_CALL_START", { count: e.length, functionName: r.functionName });
    let i = "provider-selected";
    const o = Date.now();
    t = setInterval(() => {
      St("WALLET_STILL_WAITING", { lastStage: i, waitingMs: Date.now() - o }), Jt("Still waiting for the wallet (" + i + "). Check the extension. Do not submit again while this request is pending. See the diagnostic log below.");
    }, 35e3), await new Promise((a, c) => d6({ ...r, onProgress: (u) => {
      i = u, St("WALLET_PROGRESS", { walletStage: u }), Jt(y6[u]);
    }, onFinish: (u) => {
      St("WALLET_FINISH", { hasTransactionId: !!u.txId });
      const f = String(u.txId || "");
      if (!/^(0x)?[0-9a-f]{64}$/i.test(f)) {
        c(Error("Wallet did not return a transaction ID. Check your wallet before trying again."));
        return;
      }
      const l = f.startsWith("0x") ? f : "0x" + f;
      lo.set(s, l);
      try {
        localStorage.setItem(s, l);
      } catch {
        Jt("Transaction submitted: " + l + ". Save this ID; browser storage is unavailable.");
      }
      a();
    }, onCancel: () => {
      St("WALLET_CANCEL"), c(Error("Cancelled. No on-chain change was requested."));
    }, onError: (u) => {
      St("WALLET_ERROR"), c(u);
    } })), Jt("Submitted. Your totals will change after confirmation. Use Refresh to check progress.");
  } catch (n) {
    St("APPROVAL_FAILED"), Jt(n instanceof Error ? n.message : "Wallet request failed.");
  } finally {
    t && clearInterval(t), St("WALLET_FLOW_SETTLED"), vn = !1, uo();
  }
};
Oo();
const w6 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", x6 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, m6 = () => x6() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, S6 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, A6 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ep = class {
  constructor(t) {
    bA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && cd(t), this.callback(Io(t));
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
    const t = m6(), e = S6(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return V("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, V("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), V("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, V("div", { class: "flex flex-col space-y-[10px]" }, V("div", { class: "flex items-center" }, V("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), V("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, V("span", { class: "sr-only" }, "Close popup"), V("img", { src: w6 }))), r ? V("p", null, "Select the wallet you want to connect to.") : V("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && V("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && V("div", { class: "mt-6" }, V("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), V("ul", { class: "space-y-3" }, this.installedProviders.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), V("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && V("div", { class: "mt-6" }, r ? V("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : V("div", { class: "mb-5 flex justify-between" }, V("p", { class: "text-sm font-medium" }, "Recommended wallets"), V("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, V("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), V("p", null, "What is a wallet? ", V("span", { class: "align-text-bottom text-[9px]" }, "↗")))), V("ul", { class: "space-y-3" }, n.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && V("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Z4(this);
  }
};
Ep.style = A6;
const E6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ep
}, Symbol.toStringTag, { value: "Module" }));
