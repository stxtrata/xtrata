var R1 = Object.defineProperty;
var V1 = (t, e, n) => e in t ? R1(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var na = (t, e, n) => V1(t, typeof e != "symbol" ? e + "" : e, n);
function G1(t, e) {
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
const K1 = ["SP", "SM"], W1 = ["ST", "SN"], Cc = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return K1.includes(n) ? "mainnet" : W1.includes(n) ? "testnet" : null;
}, q1 = () => {
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
}, Y1 = () => typeof window > "u" || !window.localStorage ? q1() : window.localStorage, ra = "xtrata.v15.1.wallet.session", hu = "mainnet", zi = { isConnected: !1 }, X1 = (t) => t.address ? Cc(t.address) ?? t.network : t.network, Eh = (t) => !t.isConnected || !t.address ? { ...zi } : X1(t) !== hu ? { ...zi } : {
  isConnected: !0,
  address: t.address,
  network: hu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Z1 = (t) => {
  if (!t)
    return { ...zi };
  try {
    const e = JSON.parse(t);
    return Eh(e);
  } catch {
    return { ...zi };
  }
}, Q1 = (t) => {
  const e = Eh(t);
  return JSON.stringify(e);
}, J1 = (t) => {
  const e = Y1();
  return {
    load: () => Z1(e.getItem(ra)),
    save: (n) => {
      e.setItem(ra, Q1(n));
    },
    clear: () => {
      e.removeItem(ra);
    }
  };
};
function t2(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function e2(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${t2(r)}`;
  let i = 2166136261, o = 522970236;
  for (let c = 0; c < s.length; c += 1) {
    const u = s.charCodeAt(c);
    i = Math.imul(i ^ u, 16777619), o = Math.imul(o ^ (u << 5 | u >>> 3), 16777619);
  }
  const a = (c) => (c >>> 0).toString(16).padStart(8, "0");
  return (a(i) + a(o)).slice(0, 16);
}
function Ih(t) {
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
function n2(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const sa = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function r2(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = sa(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = sa(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = sa(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function s2(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = Ih(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const i2 = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", o2 = 20, du = "xt_tel_sid";
function Ri() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let ia = null;
function a2() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(du);
      return t || (t = Ri(), sessionStorage.setItem(du, t)), t;
    }
  } catch {
  }
  return ia || (ia = Ri()), ia;
}
let Hr = {
  address: null,
  kind: null
}, $h = null;
function vc(t, e) {
  if (!t) {
    Hr = { address: null, kind: e ?? Hr.kind };
    return;
  }
  Hr = { address: t.trim(), kind: e ?? Hr.kind };
}
function Lc(t) {
  $h = typeof t == "string" && t.length > 0 ? t : null;
}
const gu = [];
class c2 {
  constructor(e, n) {
    na(this, "id", Ri());
    na(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function l2(t, e) {
  return new c2(t, e);
}
function Ss(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? Ih(t.error) : void 0, i = t.error != null ? n2(t.error) : void 0, o = r ? e2(n, t.step, t.errorCode, s ?? "") : void 0, a = r ? r2(t.error) : void 0, c = {
      ...a ? { error: a } : {},
      ...t.context ?? {}
    };
    r && gu.length && (c.breadcrumbs = gu.slice(-o2));
    const u = {
      eventId: Ri(),
      ts: Date.now(),
      sessionId: a2(),
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
      appVersion: i2,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Hr.address,
      walletKind: Hr.kind,
      network: $h,
      context: Object.keys(c).length ? c : void 0
    };
  } catch {
  }
}
const u2 = "https://browser.blockstack.org/auth", f2 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ch = ["store_write"], h2 = "blockstack-session", d2 = {
  logLevel: "debug"
}, dr = {
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
Object.freeze(dr);
class is extends Error {
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
class g2 extends is {
  constructor(e, n = "") {
    super({ code: dr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class pu extends is {
  constructor(e = "") {
    super({ code: dr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ai extends is {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: dr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class bu extends is {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: dr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class La extends is {
  constructor(e) {
    super({ code: dr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class vh extends is {
  constructor(e) {
    super({ code: dr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const yu = ["debug", "info", "warn", "error", "none"], Ba = {};
for (let t = 0; t < yu.length; t++) {
  const e = yu[t];
  Ba[e] = t;
}
class _r {
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
    return Ba[d2.logLevel] <= Ba[e];
  }
}
function p2() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function b2() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function oa(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function y2() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function w2() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function x2(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Bc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = w2(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    _r.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = x2(s, t.toString(), n);
    throw _r.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Mn(t, e) {
  return Hc(Pt(t), e);
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
  if (Xt(t, Uint8Array))
    return BigInt(`0x${z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function m2(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function wu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function js(t, e = 8) {
  return (typeof t == "bigint" ? t : Pt(t)).toString(16).padStart(e * 2, "0");
}
function yo(t) {
  return parseInt(t, 16);
}
function Hc(t, e = 16) {
  const n = js(t, e);
  return st(n);
}
function S2(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function A2(t, e) {
  return t & BigInt(1) << e;
}
function Ha(t) {
  return E2(BigInt(`0x${z(t)}`), BigInt(t.byteLength * 8));
}
function E2(t, e) {
  return A2(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const I2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += I2[n];
  return e;
}
function st(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = m2(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function gr(t) {
  return new TextEncoder().encode(t);
}
function zs(t) {
  return new TextDecoder().decode(t);
}
function $2(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function C2(t) {
  return String.fromCharCode.apply(null, t);
}
function v2(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function xu(t) {
  if (t.some(v2))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function _e(...t) {
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
  return _e(...t.map((e) => typeof e == "number" ? xu([e]) : e instanceof Array ? xu(e) : e));
}
function Xt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Lh = "https://api.mainnet.hiro.so", Bh = "https://api.testnet.hiro.so", Hh = "http://localhost:3999", L2 = "https://hub.blockstack.org", B2 = 33, aa = 32;
function H2(t) {
  if (t.length < aa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + aa * 2), r = t.slice(2 + aa * 2);
  return {
    recoveryId: yo(e),
    r: n,
    s: r
  };
}
function _c(t) {
  const e = typeof t == "string" ? st(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function _2(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function M2(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function U2(t, e) {
  return t[e];
}
function N2(t, e, n = 0) {
  return t[n] = e, t;
}
function T2(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Zn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const P2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function k2(t, e) {
  const n = {};
  return Object.assign(n, P2, e), await fetch(t, n);
}
function D2(t) {
  let e = k2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function O2(...t) {
  const { fetchLib: e, middlewares: n } = D2(t);
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
class wo {
  constructor(e = Ch.slice(), n = ((a) => (a = Bc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = u2) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function _a(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function F2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _h(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function j2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _a(t.outputLen), _a(t.blockLen);
}
function z2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function R2(t, e) {
  _h(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zn = {
  number: _a,
  bool: F2,
  bytes: _h,
  hash: j2,
  exists: z2,
  output: R2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ca = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), we = (t, e) => t << 32 - e | t >>> e, V2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!V2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function G2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mc(t) {
  if (typeof t == "string" && (t = G2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Mh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pr(t) {
  const e = (r) => t().update(Mc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Uh = class extends Mh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zn.hash(e);
    const r = Mc(n);
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
const xo = (t, e, n) => new Uh(t, e).update(n).digest();
xo.create = (t, e) => new Uh(t, e);
function K2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Uc = class extends Mh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ca(this.buffer);
  }
  update(e) {
    zn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Mc(e);
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
    K2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const W2 = (t, e, n) => t & e ^ ~t & n, q2 = (t, e, n) => t & e ^ t & n ^ e & n, Y2 = new Uint32Array([
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
let Nh = class extends Uc {
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
      const g = tn[l - 15], h = tn[l - 2], b = we(g, 7) ^ we(g, 18) ^ g >>> 3, y = we(h, 17) ^ we(h, 19) ^ h >>> 10;
      tn[l] = y + tn[l - 7] + b + tn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = we(a, 6) ^ we(a, 11) ^ we(a, 25), h = f + g + W2(a, c, u) + Y2[l] + tn[l] | 0, y = (we(r, 2) ^ we(r, 13) ^ we(r, 22)) + q2(r, s, i) | 0;
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
}, X2 = class extends Nh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const jr = pr(() => new Nh());
pr(() => new X2());
const Z2 = {}, Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Z2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const rt = BigInt(0), yt = BigInt(1), Cn = BigInt(2), Es = BigInt(3), mu = BigInt(8), lt = Object.freeze({
  a: rt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: yt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Su = (t, e) => (t + e / Cn) / e, ci = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = lt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -yt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Su(i * t, e), c = Su(-r * t, e);
    let u = M(t - a * n - c * s, e), f = M(-a * r - c * i, e);
    const l = u > o, g = f > o;
    if (l && (u = e - u), g && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: f };
  }
}, de = 32, Qn = 32, Ph = 32, Vi = de + 1, Gi = 2 * de + 1;
function Au(t) {
  const { a: e, b: n } = lt, r = M(t * t), s = M(r * t);
  return M(s + e * t + n);
}
const li = lt.a === rt;
class Nc extends Error {
  constructor(e) {
    super(e);
  }
}
function Eu(t) {
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
    const n = nb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ot.toAffineBatch(e).map(ot.fromAffine);
  }
  equals(e) {
    Eu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = M(s * s), u = M(a * a), f = M(n * u), l = M(i * c), g = M(M(r * a) * u), h = M(M(o * s) * c);
    return f === l && g === h;
  }
  negate() {
    return new ot(this.x, M(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = M(e * e), i = M(n * n), o = M(i * i), a = e + i, c = M(Cn * (M(a * a) - s - o)), u = M(Es * s), f = M(u * u), l = M(f - Cn * c), g = M(u * (c - l) - mu * o), h = M(Cn * n * r);
    return new ot(l, g, h);
  }
  add(e) {
    Eu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === rt || o === rt)
      return this;
    if (n === rt || r === rt)
      return e;
    const c = M(s * s), u = M(a * a), f = M(n * u), l = M(i * c), g = M(M(r * a) * u), h = M(M(o * s) * c), b = M(l - f), y = M(h - g);
    if (b === rt)
      return y === rt ? this.double() : ot.ZERO;
    const A = M(b * b), v = M(b * A), L = M(f * A), p = M(y * y - v - Cn * L), E = M(y * (L - p) - g * v), S = M(s * a * b);
    return new ot(p, E, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ot.ZERO;
    if (typeof e == "bigint" && e === rt)
      return n;
    let r = Cu(e);
    if (r === yt)
      return this;
    if (!li) {
      let l = n, g = this;
      for (; r > rt; )
        r & yt && (l = l.add(g)), g = g.double(), r >>= yt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ci.splitScalar(r), c = n, u = n, f = this;
    for (; i > rt || a > rt; )
      i & yt && (c = c.add(f)), a & yt && (u = u.add(f)), f = f.double(), i >>= yt, a >>= yt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ot(M(u.x * ci.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = li ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && Ma.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ot.normalizeZ(s), Ma.set(n, s)));
    let i = ot.ZERO, o = ot.BASE;
    const a = 1 + (li ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & u);
      e >>= l, b > c && (b -= f, e += yt);
      const y = h, A = h + Math.abs(b) - 1, v = g % 2 !== 0, L = b < 0;
      b === 0 ? o = o.add(ui(v, s[y])) : i = i.add(ui(L, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Cu(e), s, i;
    if (li) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ci.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      f = ui(o, f), g = ui(c, g), g = new ot(M(g.x * ci.beta), g.y, g.z), s = f.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ot.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ot.ZERO);
    e == null && (e = i ? mu : os(s));
    const o = e, a = M(o * o), c = M(a * o), u = M(n * a), f = M(r * c), l = M(s * o);
    if (i)
      return J.ZERO;
    if (l !== yt)
      throw new Error("invZ was invalid");
    return new J(u, f);
  }
}
ot.BASE = new ot(lt.Gx, lt.Gy, yt);
ot.ZERO = new ot(rt, yt, rt);
function ui(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ma = /* @__PURE__ */ new WeakMap();
class J {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ma.delete(this);
  }
  hasEvenY() {
    return this.y % Cn === rt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = re(n ? e : e.subarray(1));
    if (!Pi(r))
      throw new Error("Point is not on curve");
    const s = Au(r);
    let i = eb(s);
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
    const n = Me(e), r = n.length, s = n[0];
    if (r === de)
      return this.fromCompressedHex(n);
    if (r === Vi && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Gi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Vi} compressed bytes or ${Gi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return J.BASE.multiply(Jn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Oh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Tc(Me(e)), { n: a } = lt, c = r === 2 || r === 3 ? s + a : s, u = os(c, a), f = M(-o * u, a), l = M(i * u, a), g = r & 1 ? "03" : "02", h = J.fromHex(g + Ln(c)), b = J.BASE.multiplyAndAddUnsafe(h, f, l);
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
    if (!Pi(n) || !Pi(r))
      throw new Error(e);
    const s = M(r * r), i = Au(n);
    if (M(s - i) !== rt)
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
    const s = ot.fromAffine(this), i = n === rt || n === yt || this !== J.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ot.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ot.ZERO) ? void 0 : a.toAffine();
  }
}
J.BASE = new J(lt.Gx, lt.Gy);
J.ZERO = new J(rt, rt);
function Iu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function $u(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${zr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: re(n), left: t.subarray(e + 2) };
}
function Q2(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${zr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = $u(t.subarray(2)), { data: r, left: s } = $u(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${zr(s)}`);
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
    const s = n ? zr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ne(Ki(s.slice(0, 64)), Ki(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Q2(n ? e : Bn(e));
    return new ne(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Vr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Vr(n))
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
    const e = Iu(xs(this.s)), n = Iu(xs(this.r)), r = e.length / 2, s = n.length / 2, i = xs(r), o = xs(s);
    return `30${xs(s + r + 4)}02${o}${n}02${i}${e}`;
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
function In(...t) {
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
const J2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += J2[t[n]];
  return e;
}
const tb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ln(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(rt <= t && t < tb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Rr(t) {
  const e = Bn(Ln(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function xs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ki(t) {
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
  return Ki(zr(t));
}
function Me(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Bn(t);
}
function Cu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Vr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function M(t, e = lt.P) {
  const n = t % e;
  return n >= rt ? n : e + n;
}
function se(t, e) {
  const { P: n } = lt;
  let r = t;
  for (; e-- > rt; )
    r *= r, r %= n;
  return r;
}
function eb(t) {
  const { P: e } = lt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = se(u, Es) * u % e, l = se(f, Es) * u % e, g = se(l, Cn) * c % e, h = se(g, r) * g % e, b = se(h, s) * h % e, y = se(b, o) * b % e, A = se(y, a) * y % e, v = se(A, o) * b % e, L = se(v, Es) * u % e, p = se(L, i) * h % e, E = se(p, n) * c % e, S = se(E, Cn);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function os(t, e = lt.P) {
  if (t === rt || e <= rt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = M(t, e), r = e, s = rt, i = yt;
  for (; n !== rt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== yt)
    throw new Error("invert: does not exist");
  return M(s, e);
}
function nb(t, e = lt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === rt ? i : (n[a] = i, M(i * o, e)), yt), s = os(r, e);
  return t.reduceRight((i, o, a) => o === rt ? i : (n[a] = M(i * n[a], e), M(i * o, e)), s), n;
}
function rb(t) {
  const e = t.length * 8 - Qn * 8, n = re(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Tc(t, e = !1) {
  const n = rb(t);
  if (e)
    return n;
  const { n: r } = lt;
  return n >= r ? n - r : n;
}
let kr, Is;
class kh {
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
    return Is(this.k, ...e);
  }
  checkSync() {
    if (typeof Is != "function")
      throw new Nc("hmacSha256Sync needs to be set");
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
    return In(...n);
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
    return In(...n);
  }
}
function Vr(t) {
  return rt < t && t < lt.n;
}
function Pi(t) {
  return rt < t && t < lt.P;
}
function Dh(t, e, n, r = !0) {
  const { n: s } = lt, i = Tc(t, !0);
  if (!Vr(i))
    return;
  const o = os(i, s), a = J.BASE.multiply(i), c = M(a.x, s);
  if (c === rt)
    return;
  const u = M(o * M(e + n * c, s), s);
  if (u === rt)
    return;
  let f = new ne(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & yt);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Jn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Qn)
      throw new Error("Expected 32 bytes of private key");
    e = Ki(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Qn)
      throw new Error("Expected 32 bytes of private key");
    e = re(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Vr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Pc(t) {
  return t instanceof J ? (t.assertValidity(), t) : J.fromHex(t);
}
function Oh(t) {
  if (t instanceof ne)
    return t.assertValidity(), t;
  try {
    return ne.fromDER(t);
  } catch {
    return ne.fromCompact(t);
  }
}
function Rs(t, e = !1) {
  return J.fromPrivateKey(t).toRawBytes(e);
}
function sb(t, e, n, r = !1) {
  return J.fromSignature(t, e, n).toRawBytes(r);
}
function vu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Vi || r === Gi : n ? r === Vi * 2 || r === Gi * 2 : t instanceof J;
}
function kc(t, e, n = !1) {
  if (vu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!vu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Pc(e);
  return r.assertValidity(), r.multiply(Jn(t)).toRawBytes(n);
}
function Fh(t) {
  const e = t.length > de ? t.slice(0, de) : t;
  return re(e);
}
function ib(t) {
  const e = Fh(t), n = M(e, lt.n);
  return jh(n < rt ? e : n);
}
function jh(t) {
  return Rr(t);
}
function zh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Me(t), s = Jn(e), i = [jh(s), ib(r)];
  if (n != null) {
    n === !0 && (n = It.randomBytes(de));
    const c = Me(n);
    if (c.length !== de)
      throw new Error(`sign: Expected ${de} bytes of extra data`);
    i.push(c);
  }
  const o = In(...i), a = Fh(r);
  return { seed: o, m: a, d: s };
}
function Rh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function ob(t, e, n = {}) {
  const { seed: r, m: s, d: i } = zh(t, e, n.extraEntropy), o = new kh(Ph, Qn);
  await o.reseed(r);
  let a;
  for (; !(a = Dh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Rh(a, n);
}
function mo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = zh(t, e, n.extraEntropy), o = new kh(Ph, Qn);
  o.reseedSync(r);
  let a;
  for (; !(a = Dh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Rh(a, n);
}
const ab = { strict: !0 };
function cb(t, e, n, r = ab) {
  let s;
  try {
    s = Oh(t), e = Me(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Tc(e);
  let c;
  try {
    c = Pc(n);
  } catch {
    return !1;
  }
  const { n: u } = lt, f = os(o, u), l = M(a * f, u), g = M(i * f, u), h = J.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? M(h.x, u) === i : !1;
}
function Wi(t) {
  return M(re(t), lt.n);
}
class Gr {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Me(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = re(n.subarray(0, 32)), s = re(n.subarray(32, 64));
    return new Gr(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Pi(e) || !Vr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ln(this.r) + Ln(this.s);
  }
  toRawBytes() {
    return Bn(this.toHex());
  }
}
function lb(t) {
  return J.fromPrivateKey(t).toRawX();
}
class Vh {
  constructor(e, n, r = It.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Me(e);
    const { x: s, scalar: i } = this.getScalar(Jn(n));
    if (this.px = s, this.d = i, this.rand = Me(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = J.fromPrivateKey(e), r = n.hasEvenY() ? e : lt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Rr(e ^ re(n));
  }
  finalizeNonce(e) {
    const n = M(re(e), lt.n);
    if (n === rt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Gr(e.x, M(n + r * s, lt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = It.taggedHash, o = this.initNonce(n, await i(En.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(En.nonce, o, r, e)), f = Wi(await i(En.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await Wh(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = It.taggedHashSync, o = this.initNonce(n, i(En.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(En.nonce, o, r, e)), f = Wi(i(En.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return qh(l, e, r) || this.error(), l;
  }
}
async function ub(t, e, n) {
  return new Vh(t, e, n).calc();
}
function fb(t, e, n) {
  return new Vh(t, e, n).calcSync();
}
function Gh(t, e, n) {
  const r = t instanceof Gr, s = r ? t : Gr.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Me(e),
    P: Pc(n)
  };
}
function Kh(t, e, n, r) {
  const s = J.BASE.multiplyAndAddUnsafe(e, Jn(n), M(-r, lt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Wh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Gh(t, e, n), a = Wi(await It.taggedHash(En.challenge, Rr(r), o.toRawX(), i));
    return Kh(r, o, s, a);
  } catch {
    return !1;
  }
}
function qh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Gh(t, e, n), a = Wi(It.taggedHashSync(En.challenge, Rr(r), o.toRawX(), i));
    return Kh(r, o, s, a);
  } catch (r) {
    if (r instanceof Nc)
      throw r;
    return !1;
  }
}
const hb = {
  Signature: Gr,
  getPublicKey: lb,
  sign: ub,
  verify: Wh,
  signSync: fb,
  verifySync: qh
};
J.BASE._setWindowSize(8);
const Zt = {
  node: Th,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, En = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, fi = {}, It = {
  bytesToHex: zr,
  hexToBytes: Bn,
  concatBytes: In,
  mod: M,
  invert: os,
  isValidPrivateKey(t) {
    try {
      return Jn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Rr,
  _normalizePrivateKey: Jn,
  hashToPrivateKey: (t) => {
    t = Me(t);
    const e = Qn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = M(re(t), lt.n - yt) + yt;
    return Rr(n);
  },
  randomBytes: (t = 32) => {
    if (Zt.web)
      return Zt.web.getRandomValues(new Uint8Array(t));
    if (Zt.node) {
      const { randomBytes: e } = Zt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => It.hashToPrivateKey(It.randomBytes(Qn + 8)),
  precompute(t = 8, e = J.BASE) {
    const n = e === J.BASE ? e : new J(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Es), n;
  },
  sha256: async (...t) => {
    if (Zt.web) {
      const e = await Zt.web.subtle.digest("SHA-256", In(...t));
      return new Uint8Array(e);
    } else if (Zt.node) {
      const { createHash: e } = Zt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Zt.web) {
      const n = await Zt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = In(...e), s = await Zt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Zt.node) {
      const { createHmac: n } = Zt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = fi[t];
    if (n === void 0) {
      const r = await It.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = In(r, r), fi[t] = n;
    }
    return It.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof kr != "function")
      throw new Nc("sha256Sync is undefined, you need to set it");
    let n = fi[t];
    if (n === void 0) {
      const r = kr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = In(r, r), fi[t] = n;
    }
    return kr(n, ...e);
  },
  _JacobianPoint: ot
};
Object.defineProperties(It, {
  sha256Sync: {
    configurable: !1,
    get() {
      return kr;
    },
    set(t) {
      kr || (kr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Is;
    },
    set(t) {
      Is || (Is = t);
    }
  }
});
const db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: lt,
  Point: J,
  Signature: ne,
  getPublicKey: Rs,
  getSharedSecret: kc,
  recoverPublicKey: sb,
  schnorr: hb,
  sign: ob,
  signSync: mo,
  utils: It,
  verify: cb
}, Symbol.toStringTag, { value: "Module" }));
var Kt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Yh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Xh(t) {
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
var Vs = {};
Vs.byteLength = wb;
var gb = Vs.toByteArray = mb, pb = Vs.fromByteArray = Eb, Ie = [], ie = [], bb = typeof Uint8Array < "u" ? Uint8Array : Array, la = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Cr = 0, yb = la.length; Cr < yb; ++Cr)
  Ie[Cr] = la[Cr], ie[la.charCodeAt(Cr)] = Cr;
ie[45] = 62;
ie[95] = 63;
function Zh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function wb(t) {
  var e = Zh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function xb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function mb(t) {
  var e, n = Zh(t), r = n[0], s = n[1], i = new bb(xb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ie[t.charCodeAt(c)] << 18 | ie[t.charCodeAt(c + 1)] << 12 | ie[t.charCodeAt(c + 2)] << 6 | ie[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ie[t.charCodeAt(c)] << 2 | ie[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ie[t.charCodeAt(c)] << 10 | ie[t.charCodeAt(c + 1)] << 4 | ie[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Sb(t) {
  return Ie[t >> 18 & 63] + Ie[t >> 12 & 63] + Ie[t >> 6 & 63] + Ie[t & 63];
}
function Ab(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Sb(r));
  return s.join("");
}
function Eb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Ab(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Ie[e >> 2] + Ie[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ie[e >> 10] + Ie[e >> 4 & 63] + Ie[e << 2 & 63] + "="
  )), s.join("");
}
function Ib() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const $b = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Cb() {
  if (Ib())
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
    throw new Error($b);
  }
}
class vb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(_e(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(_e(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Lb {
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
async function Qh() {
  const t = await Cb();
  return t.name === "subtleCrypto" ? new Lb(t.lib) : new vb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Bb(t) {
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
var Jh = Bb;
const Hb = Jh, _b = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Mb = Hb(_b);
const Ub = /* @__PURE__ */ Yh(Mb), Nb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), t0 = Uint8Array.from({ length: 16 }, (t, e) => e), Tb = t0.map((t) => (9 * t + 5) % 16);
let Dc = [t0], Oc = [Tb];
for (let t = 0; t < 4; t++)
  for (let e of [Dc, Oc])
    e.push(e[t].map((n) => Nb[n]));
const e0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Pb = Dc.map((t, e) => t.map((n) => e0[e][n])), kb = Oc.map((t, e) => t.map((n) => e0[e][n])), Db = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ob = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), hi = (t, e) => t << e | t >>> 32 - e;
function Lu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const di = new Uint32Array(16);
let Fb = class extends Uc {
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
      const b = 4 - h, y = Db[h], A = Ob[h], v = Dc[h], L = Oc[h], p = Pb[h], E = kb[h];
      for (let S = 0; S < 16; S++) {
        const T = hi(r + Lu(h, i, a, u) + di[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = hi(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = hi(s + Lu(b, o, c, f) + di[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = hi(c, 10) | 0, c = o, o = T;
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
const jb = pr(() => new Fb());
function zb(t) {
  return jb(t);
}
const gi = BigInt(2 ** 32 - 1), Ua = BigInt(32);
function n0(t, e = !1) {
  return e ? { h: Number(t & gi), l: Number(t >> Ua & gi) } : { h: Number(t >> Ua & gi) | 0, l: Number(t & gi) | 0 };
}
function Rb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = n0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Vb = (t, e) => BigInt(t >>> 0) << Ua | BigInt(e >>> 0), Gb = (t, e, n) => t >>> n, Kb = (t, e, n) => t << 32 - n | e >>> n, Wb = (t, e, n) => t >>> n | e << 32 - n, qb = (t, e, n) => t << 32 - n | e >>> n, Yb = (t, e, n) => t << 64 - n | e >>> n - 32, Xb = (t, e, n) => t >>> n - 32 | e << 64 - n, Zb = (t, e) => e, Qb = (t, e) => t, Jb = (t, e, n) => t << n | e >>> 32 - n, ty = (t, e, n) => e << n | t >>> 32 - n, ey = (t, e, n) => e << n - 32 | t >>> 64 - n, ny = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ry(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const sy = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), iy = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, oy = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ay = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, cy = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ly = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: n0,
  split: Rb,
  toBig: Vb,
  shrSH: Gb,
  shrSL: Kb,
  rotrSH: Wb,
  rotrSL: qb,
  rotrBH: Yb,
  rotrBL: Xb,
  rotr32H: Zb,
  rotr32L: Qb,
  rotlSH: Jb,
  rotlSL: ty,
  rotlBH: ey,
  rotlBL: ny,
  add: ry,
  add3L: sy,
  add3H: iy,
  add4L: oy,
  add4H: ay,
  add5H: ly,
  add5L: cy
}, [uy, fy] = K.split([
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
let So = class extends Uc {
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
      const E = en[p - 15] | 0, S = nn[p - 15] | 0, T = K.rotrSH(E, S, 1) ^ K.rotrSH(E, S, 8) ^ K.shrSH(E, S, 7), O = K.rotrSL(E, S, 1) ^ K.rotrSL(E, S, 8) ^ K.shrSL(E, S, 7), H = en[p - 2] | 0, N = nn[p - 2] | 0, w = K.rotrSH(H, N, 19) ^ K.rotrBH(H, N, 61) ^ K.shrSH(H, N, 6), I = K.rotrSL(H, N, 19) ^ K.rotrBL(H, N, 61) ^ K.shrSL(H, N, 6), _ = K.add4L(O, I, nn[p - 7], nn[p - 16]), F = K.add4H(_, T, w, en[p - 7], en[p - 16]);
      en[p] = F | 0, nn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = K.rotrSH(l, g, 14) ^ K.rotrSH(l, g, 18) ^ K.rotrBH(l, g, 41), S = K.rotrSL(l, g, 14) ^ K.rotrSL(l, g, 18) ^ K.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = K.add5L(L, S, O, fy[p], nn[p]), N = K.add5H(H, v, E, T, uy[p], en[p]), w = H | 0, I = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), _ = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = K.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = K.add3L(w, _, G);
      r = K.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = K.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = K.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = K.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = K.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = K.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = K.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    en.fill(0), nn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hy = class extends So {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, dy = class extends So {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gy = class extends So {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const py = pr(() => new So());
pr(() => new hy());
pr(() => new dy());
pr(() => new gy());
function r0(t) {
  return jr(t);
}
function by(t) {
  return py(t);
}
const yy = 0;
It.hmacSha256Sync = (t, ...e) => {
  const n = xo.create(jr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function wy() {
  return z(It.randomPrivateKey());
}
function xy(t) {
  const e = jr(jr(t));
  return Ub.encode(_e(t, e).slice(0, t.length + 4));
}
function my(t, e) {
  return xy(_e(new Uint8Array([t]), e.slice(0, 20)));
}
function s0(t, e = yy) {
  const n = typeof t == "string" ? st(t) : t, r = zb(r0(n));
  return my(e, r);
}
function i0(t) {
  const e = _c(t);
  return z(Rs(e.slice(0, 32), !0));
}
It.hmacSha256Sync = (t, ...e) => {
  const n = xo.create(jr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var qi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(qi || (qi = {}));
async function Sy(t, e, n) {
  return await (await Qh()).encrypt("aes-256-cbc", e, t, n);
}
async function Ay(t, e, n) {
  return await (await Qh()).decrypt("aes-256-cbc", e, t, n);
}
function o0(t, e) {
  return xo(jr, t, e);
}
function Ey(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function a0(t) {
  const e = by(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Iy(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function $y(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: qi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: qi.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Iy(t))
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
async function Cy(t, e, n, r) {
  const s = $y(t);
  if (!s.result)
    throw s;
  const i = It.randomPrivateKey(), o = Rs(i, !0);
  let a = kc(i, t, !0);
  a = a.slice(1);
  const c = a0(a), u = It.randomBytes(16), f = await Sy(u, c.encryptionKey, e), l = _e(u, o, f), g = o0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = z(f);
  else if (r === "base64")
    h = pb(f);
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
async function c0(t, e) {
  if (!e.ephemeralPK)
    throw new bu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = kc(t, n, !0);
  r = r.slice(1);
  const s = a0(r), i = st(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = st(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = gb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = _e(i, st(n), o), c = o0(s.hmacKey, a), u = st(e.mac);
  if (!Ey(u, c))
    throw new bu("Decryption failed: failure in MAC check");
  const f = await Ay(i, s.encryptionKey, o);
  return e.wasString ? zs(f) : f;
}
function vy(t, e) {
  const n = typeof e == "string" ? gr(e) : e, r = i0(t), s = r0(n), i = mo(s, t);
  return {
    signature: z(i),
    publicKey: r
  };
}
async function Ly(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = i0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? gr(t) : t, o = await Cy(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = vy(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function By(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return c0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var kt = {}, Kr = {}, Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.decode = Rt.encode = Rt.unescape = Rt.escape = Rt.pad = void 0;
const l0 = Vs;
function Fc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Rt.pad = Fc;
function u0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Rt.escape = u0;
function f0(t) {
  return Fc(t).replace(/-/g, "+").replace(/_/g, "/");
}
Rt.unescape = f0;
function Hy(t) {
  return u0((0, l0.fromByteArray)(new TextEncoder().encode(t)));
}
Rt.encode = Hy;
function _y(t) {
  return new TextDecoder().decode((0, l0.toByteArray)(Fc(f0(t))));
}
Rt.decode = _y;
var Ao = {}, Eo = {}, h0 = {}, Ye = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.crypto = void 0;
Io.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = y, t.bytesToHex = L, t.hexToBytes = S, t.asyncLoop = O, t.utf8ToBytes = H, t.bytesToUtf8 = N, t.toBytes = w, t.kdfInputToBytes = I, t.concatBytes = _, t.checkOpts = F, t.createHasher = P, t.createOptHasher = ke, t.createXOFer = Ze, t.randomBytes = Sr;
  const e = Io;
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
      const bs = E(m.charCodeAt(Mt)), ti = E(m.charCodeAt(Mt + 1));
      if (bs === void 0 || ti === void 0) {
        const Vo = m[Mt] + m[Mt + 1];
        throw new Error('hex string expected, got non-hex character "' + Vo + '" at index ' + Mt);
      }
      pt[ut] = bs * 16 + ti;
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
  function ke(m) {
    const C = (pt, ut) => m(ut).update(w(pt)).digest(), ht = m({});
    return C.outputLen = ht.outputLen, C.blockLen = ht.blockLen, C.create = (pt) => m(pt), C;
  }
  function Ze(m) {
    const C = (pt, ut) => m(ut).update(w(pt)).digest(), ht = m({});
    return C.outputLen = ht.outputLen, C.blockLen = ht.blockLen, C.create = (pt) => m(pt), C;
  }
  t.wrapConstructor = P, t.wrapConstructorWithOpts = ke, t.wrapXOFConstructorWithOpts = Ze;
  function Sr(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Ye);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Ye;
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
})(h0);
var te = {}, dt = {}, Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.SHA512_IV = Vt.SHA384_IV = Vt.SHA224_IV = Vt.SHA256_IV = Vt.HashMD = void 0;
Vt.setBigUint64 = d0;
Vt.Chi = My;
Vt.Maj = Uy;
const xe = Ye;
function d0(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function My(t, e, n) {
  return t & e ^ ~t & n;
}
function Uy(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Ny extends xe.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, xe.createView)(this.buffer);
  }
  update(e) {
    (0, xe.aexists)(this), e = (0, xe.toBytes)(e), (0, xe.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = (0, xe.createView)(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, xe.aexists)(this), (0, xe.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, xe.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    d0(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = (0, xe.createView)(e), c = this.outputLen;
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
Vt.HashMD = Ny;
Vt.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
Vt.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
Vt.SHA384_IV = Uint32Array.from([
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
Vt.SHA512_IV = Uint32Array.from([
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
R.add = L0;
R.fromBig = jc;
R.split = g0;
const pi = /* @__PURE__ */ BigInt(2 ** 32 - 1), Na = /* @__PURE__ */ BigInt(32);
function jc(t, e = !1) {
  return e ? { h: Number(t & pi), l: Number(t >> Na & pi) } : { h: Number(t >> Na & pi) | 0, l: Number(t & pi) | 0 };
}
function g0(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l: a } = jc(t[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const p0 = (t, e) => BigInt(t >>> 0) << Na | BigInt(e >>> 0);
R.toBig = p0;
const b0 = (t, e, n) => t >>> n;
R.shrSH = b0;
const y0 = (t, e, n) => t << 32 - n | e >>> n;
R.shrSL = y0;
const w0 = (t, e, n) => t >>> n | e << 32 - n;
R.rotrSH = w0;
const x0 = (t, e, n) => t << 32 - n | e >>> n;
R.rotrSL = x0;
const m0 = (t, e, n) => t << 64 - n | e >>> n - 32;
R.rotrBH = m0;
const S0 = (t, e, n) => t >>> n - 32 | e << 64 - n;
R.rotrBL = S0;
const A0 = (t, e) => e;
R.rotr32H = A0;
const E0 = (t, e) => t;
R.rotr32L = E0;
const I0 = (t, e, n) => t << n | e >>> 32 - n;
R.rotlSH = I0;
const $0 = (t, e, n) => e << n | t >>> 32 - n;
R.rotlSL = $0;
const C0 = (t, e, n) => e << n - 32 | t >>> 64 - n;
R.rotlBH = C0;
const v0 = (t, e, n) => t << n - 32 | e >>> 64 - n;
R.rotlBL = v0;
function L0(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const B0 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
R.add3L = B0;
const H0 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
R.add3H = H0;
const _0 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
R.add4L = _0;
const M0 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
R.add4H = M0;
const U0 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
R.add5L = U0;
const N0 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0;
R.add5H = N0;
const Ty = {
  fromBig: jc,
  split: g0,
  toBig: p0,
  shrSH: b0,
  shrSL: y0,
  rotrSH: w0,
  rotrSL: x0,
  rotrBH: m0,
  rotrBL: S0,
  rotr32H: A0,
  rotr32L: E0,
  rotlSH: I0,
  rotlSL: $0,
  rotlBH: C0,
  rotlBL: v0,
  add: L0,
  add3L: B0,
  add3H: H0,
  add4L: _0,
  add4H: M0,
  add5H: N0,
  add5L: U0
};
R.default = Ty;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.sha512_224 = dt.sha512_256 = dt.sha384 = dt.sha512 = dt.sha224 = dt.sha256 = dt.SHA512_256 = dt.SHA512_224 = dt.SHA384 = dt.SHA512 = dt.SHA224 = dt.SHA256 = void 0;
const j = Vt, W = R, vt = Ye, Py = /* @__PURE__ */ Uint32Array.from([
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
]), rn = /* @__PURE__ */ new Uint32Array(64);
let zc = class extends j.HashMD {
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
      rn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = rn[l - 15], h = rn[l - 2], b = (0, vt.rotr)(g, 7) ^ (0, vt.rotr)(g, 18) ^ g >>> 3, y = (0, vt.rotr)(h, 17) ^ (0, vt.rotr)(h, 19) ^ h >>> 10;
      rn[l] = y + rn[l - 7] + b + rn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, vt.rotr)(a, 6) ^ (0, vt.rotr)(a, 11) ^ (0, vt.rotr)(a, 25), h = f + g + (0, j.Chi)(a, c, u) + Py[l] + rn[l] | 0, y = ((0, vt.rotr)(r, 2) ^ (0, vt.rotr)(r, 13) ^ (0, vt.rotr)(r, 22)) + (0, j.Maj)(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    (0, vt.clean)(rn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, vt.clean)(this.buffer);
  }
};
dt.SHA256 = zc;
let T0 = class extends zc {
  constructor() {
    super(28), this.A = j.SHA224_IV[0] | 0, this.B = j.SHA224_IV[1] | 0, this.C = j.SHA224_IV[2] | 0, this.D = j.SHA224_IV[3] | 0, this.E = j.SHA224_IV[4] | 0, this.F = j.SHA224_IV[5] | 0, this.G = j.SHA224_IV[6] | 0, this.H = j.SHA224_IV[7] | 0;
  }
};
dt.SHA224 = T0;
const P0 = W.split([
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
].map((t) => BigInt(t))), ky = P0[0], Dy = P0[1], sn = /* @__PURE__ */ new Uint32Array(80), on = /* @__PURE__ */ new Uint32Array(80);
let Gs = class extends j.HashMD {
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
      sn[p] = e.getUint32(n), on[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = sn[p - 15] | 0, S = on[p - 15] | 0, T = W.rotrSH(E, S, 1) ^ W.rotrSH(E, S, 8) ^ W.shrSH(E, S, 7), O = W.rotrSL(E, S, 1) ^ W.rotrSL(E, S, 8) ^ W.shrSL(E, S, 7), H = sn[p - 2] | 0, N = on[p - 2] | 0, w = W.rotrSH(H, N, 19) ^ W.rotrBH(H, N, 61) ^ W.shrSH(H, N, 6), I = W.rotrSL(H, N, 19) ^ W.rotrBL(H, N, 61) ^ W.shrSL(H, N, 6), _ = W.add4L(O, I, on[p - 7], on[p - 16]), F = W.add4H(_, T, w, sn[p - 7], sn[p - 16]);
      sn[p] = F | 0, on[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = W.rotrSH(l, g, 14) ^ W.rotrSH(l, g, 18) ^ W.rotrBH(l, g, 41), S = W.rotrSL(l, g, 14) ^ W.rotrSL(l, g, 18) ^ W.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = W.add5L(L, S, O, Dy[p], on[p]), N = W.add5H(H, v, E, T, ky[p], sn[p]), w = H | 0, I = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), _ = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = W.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = W.add3L(w, _, G);
      r = W.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = W.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = W.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = W.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = W.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = W.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    (0, vt.clean)(sn, on);
  }
  destroy() {
    (0, vt.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
dt.SHA512 = Gs;
let k0 = class extends Gs {
  constructor() {
    super(48), this.Ah = j.SHA384_IV[0] | 0, this.Al = j.SHA384_IV[1] | 0, this.Bh = j.SHA384_IV[2] | 0, this.Bl = j.SHA384_IV[3] | 0, this.Ch = j.SHA384_IV[4] | 0, this.Cl = j.SHA384_IV[5] | 0, this.Dh = j.SHA384_IV[6] | 0, this.Dl = j.SHA384_IV[7] | 0, this.Eh = j.SHA384_IV[8] | 0, this.El = j.SHA384_IV[9] | 0, this.Fh = j.SHA384_IV[10] | 0, this.Fl = j.SHA384_IV[11] | 0, this.Gh = j.SHA384_IV[12] | 0, this.Gl = j.SHA384_IV[13] | 0, this.Hh = j.SHA384_IV[14] | 0, this.Hl = j.SHA384_IV[15] | 0;
  }
};
dt.SHA384 = k0;
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
let D0 = class extends Gs {
  constructor() {
    super(28), this.Ah = Ut[0] | 0, this.Al = Ut[1] | 0, this.Bh = Ut[2] | 0, this.Bl = Ut[3] | 0, this.Ch = Ut[4] | 0, this.Cl = Ut[5] | 0, this.Dh = Ut[6] | 0, this.Dl = Ut[7] | 0, this.Eh = Ut[8] | 0, this.El = Ut[9] | 0, this.Fh = Ut[10] | 0, this.Fl = Ut[11] | 0, this.Gh = Ut[12] | 0, this.Gl = Ut[13] | 0, this.Hh = Ut[14] | 0, this.Hl = Ut[15] | 0;
  }
};
dt.SHA512_224 = D0;
let O0 = class extends Gs {
  constructor() {
    super(32), this.Ah = Nt[0] | 0, this.Al = Nt[1] | 0, this.Bh = Nt[2] | 0, this.Bl = Nt[3] | 0, this.Ch = Nt[4] | 0, this.Cl = Nt[5] | 0, this.Dh = Nt[6] | 0, this.Dl = Nt[7] | 0, this.Eh = Nt[8] | 0, this.El = Nt[9] | 0, this.Fh = Nt[10] | 0, this.Fl = Nt[11] | 0, this.Gh = Nt[12] | 0, this.Gl = Nt[13] | 0, this.Hh = Nt[14] | 0, this.Hl = Nt[15] | 0;
  }
};
dt.SHA512_256 = O0;
dt.sha256 = (0, vt.createHasher)(() => new zc());
dt.sha224 = (0, vt.createHasher)(() => new T0());
dt.sha512 = (0, vt.createHasher)(() => new Gs());
dt.sha384 = (0, vt.createHasher)(() => new k0());
dt.sha512_256 = (0, vt.createHasher)(() => new O0());
dt.sha512_224 = (0, vt.createHasher)(() => new D0());
Object.defineProperty(te, "__esModule", { value: !0 });
te.sha224 = te.SHA224 = te.sha256 = te.SHA256 = void 0;
const $o = dt;
te.SHA256 = $o.SHA256;
te.sha256 = $o.sha256;
te.SHA224 = $o.SHA224;
te.sha224 = $o.sha224;
const Oy = /* @__PURE__ */ Xh(db);
var Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.joseToDer = Wr.derToJose = void 0;
const F0 = Vs, j0 = Rt;
function ua(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Fy = {
  ES256: ua(256),
  ES384: ua(384),
  ES512: ua(521)
};
function z0(t) {
  const e = Fy[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Yi = 128, R0 = 0, jy = 32, zy = 16, Ry = 2, V0 = zy | jy | R0 << 6, Xi = Ry | R0 << 6;
function G0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, F0.toByteArray)((0, j0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Vy(t, e) {
  const n = G0(t), r = z0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== V0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Yi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Xi)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Xi)
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
  return b.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, j0.escape)((0, F0.fromByteArray)(b));
}
Wr.derToJose = Vy;
function Bu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Yi && --r, r;
}
function Gy(t, e) {
  t = G0(t);
  const n = z0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Bu(t, 0, n), i = Bu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Yi, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = V0, u ? f[l++] = c : (f[l++] = Yi | 1, f[l++] = c & 255), f[l++] = Xi, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = Xi, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
Wr.joseToDer = Gy;
var Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.InvalidTokenError = Ge.MissingParametersError = void 0;
class Ky extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Ge.MissingParametersError = Ky;
class Wy extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Ge.InvalidTokenError = Wy;
Object.defineProperty(Eo, "__esModule", { value: !0 });
Eo.SECP256K1Client = void 0;
const qy = h0, Yy = te, ki = Oy, Hu = Wr, _u = Ge, Mu = Ye;
ki.utils.hmacSha256Sync = (t, ...e) => {
  const n = qy.hmac.create(Yy.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class K0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Mu.bytesToHex)(ki.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new _u.MissingParametersError("a signing input hash and private key are all required");
    const s = ki.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Mu.bytesToHex)(s);
    if (r === "jose")
      return (0, Hu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Hu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new _u.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ki.verify(n, e, r, { strict: !1 });
  }
}
Eo.SECP256K1Client = K0;
K0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Eo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ao);
var tr = {};
const Xy = /* @__PURE__ */ Xh(Th);
var Zy = Kt && Kt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.hashSha256Async = tr.hashSha256 = void 0;
const Qy = te;
function W0(t) {
  return (0, Qy.sha256)(t);
}
tr.hashSha256 = W0;
function Jy(t) {
  return Zy(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Xy;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(W0(t));
    }
  });
}
tr.hashSha256Async = Jy;
var tw = Kt && Kt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.TokenSigner = Kr.createUnsecuredToken = void 0;
const Ta = Rt, Uu = Ao, ew = Ge, Nu = tr;
function Pa(t, e) {
  const n = [], r = Ta.encode(JSON.stringify(e));
  n.push(r);
  const s = Ta.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function nw(t) {
  return Pa(t, { typ: "JWT", alg: "none" }) + ".";
}
Kr.createUnsecuredToken = nw;
class rw {
  constructor(e, n) {
    if (!(e && n))
      throw new ew.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Uu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Uu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Pa(e, s), o = (0, Nu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return tw(this, void 0, void 0, function* () {
      const s = this.header(r), i = Pa(e, s), o = yield (0, Nu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ta.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Kr.TokenSigner = rw;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
Co.TokenVerifier = void 0;
const sw = Rt, Tu = Ao, iw = Ge, bi = tr;
class ow {
  constructor(e, n) {
    if (!(e && n))
      throw new iw.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Tu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Tu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, bi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, bi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), sw.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, bi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, bi.hashSha256)(r);
      return i(o);
    }
  }
}
Co.TokenVerifier = ow;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
vo.decodeToken = void 0;
const yi = Rt;
function aw(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(yi.decode(e[0])), r = JSON.parse(yi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = yi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(yi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
vo.decodeToken = aw;
(function(t) {
  var e = Kt && Kt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Kt && Kt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Kr, t), n(Co, t), n(vo, t), n(Ge, t), n(Ao, t);
})(kt);
function cw(t) {
  return `did:btc-addr:${t}`;
}
function lw(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new pu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new pu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function q0(t) {
  if (t)
    return lw(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const uw = "1.4.0";
function fw() {
  return wy();
}
function hw(t, e, n, r = Ch.slice(), s, i = p2().getTime(), o = {}) {
  const a = (h) => {
    const b = Bc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: y2(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: uw,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = kt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = s0(u);
  return c.iss = cw(f), new kt.TokenSigner("ES256k", t).sign(c);
}
async function Pu(t, e) {
  const n = zs(st(e)), r = JSON.parse(n), s = await c0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function dw(t) {
  const e = kt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new kt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function gw(t) {
  const e = kt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = q0(e.iss);
  if (n.length === 1) {
    if (s0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function pw(t) {
  const e = kt.decodeToken(t).payload;
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
function bw(t) {
  const e = kt.decodeToken(t).payload;
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
function yw(t) {
  const e = [
    bw(t),
    pw(t),
    dw(t),
    gw(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ku = "1.0.0";
class Hn {
  constructor(e) {
    this.version = ku, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ku)
      throw new La(`JSON data version ${e.version} not supported by SessionData`);
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
class Y0 {
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
class Du extends Y0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Hn({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new vh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hn({})), !0;
  }
}
class Ou extends Y0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = h2, !localStorage.getItem(this.key)) {
      const r = new Hn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new vh("No session data was found in localStorage");
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
var Hs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Hs || (Hs = {}));
var Zi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zi || (Zi = {}));
Hs.Mainnet;
var Ve;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ve || (Ve = {}));
var ve;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ve || (ve = {}));
Ve.Mainnet;
const X0 = {
  chainId: Hs.Mainnet,
  transactionVersion: Ve.Mainnet,
  peerNetworkId: Zi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ve.MainnetSingleSig,
    multiSig: ve.MainnetMultiSig
  },
  client: { baseUrl: Lh }
}, ka = {
  chainId: Hs.Testnet,
  transactionVersion: Ve.Testnet,
  peerNetworkId: Zi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ve.TestnetSingleSig,
    multiSig: ve.TestnetMultiSig
  },
  client: { baseUrl: Bh }
}, Di = {
  ...ka,
  addressVersion: { ...ka.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Hh }
}, ww = {
  ...Di,
  addressVersion: { ...Di.addressVersion },
  client: { ...Di.client }
};
function xw(t) {
  switch (t) {
    case "mainnet":
      return X0;
    case "testnet":
      return ka;
    case "devnet":
      return Di;
    case "mocknet":
      return ww;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Z0(t) {
  return typeof t == "string" ? xw(t) : t;
}
var Fu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Fu || (Fu = {}));
var ju;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ju || (ju = {}));
var le;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(le || (le = {}));
const fa = ["onChainOnly", "offChainOnly", "any"];
fa[0] + "", le.OnChainOnly, fa[1] + "", le.OffChainOnly, fa[2] + "", le.Any, le.OnChainOnly + "", le.OnChainOnly, le.OffChainOnly + "", le.OffChainOnly, le.Any + "", le.Any;
var zu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(zu || (zu = {}));
var Ru;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ru || (Ru = {}));
var Vu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vu || (Vu = {}));
var Re;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Re || (Re = {}));
var Gu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Gu || (Gu = {}));
var Ku;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ku || (Ku = {}));
var Wu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wu || (Wu = {}));
var qu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(qu || (qu = {}));
var Yu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Yu || (Yu = {}));
var Xu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xu || (Xu = {}));
var Zu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Zu || (Zu = {}));
var Qu;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Qu || (Qu = {}));
var Ju;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ju || (Ju = {}));
function Da(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function mw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Q0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Sw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Da(t.outputLen), Da(t.blockLen);
}
function Aw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ew(t, e) {
  Q0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rn = {
  number: Da,
  bool: mw,
  bytes: Q0,
  hash: Sw,
  exists: Aw,
  output: Ew
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), me = (t, e) => t << 32 - e | t >>> e, Iw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Iw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $w(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Rc(t) {
  if (typeof t == "string" && (t = $w(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let J0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function br(t) {
  const e = (r) => t().update(Rc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let td = class extends J0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Rn.hash(e);
    const r = Rc(n);
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
    return Rn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Rn.exists(this), Rn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ed = (t, e, n) => new td(t, e).update(n).digest();
ed.create = (t, e) => new td(t, e);
function Cw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Vc = class extends J0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ha(this.buffer);
  }
  update(e) {
    Rn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Rc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ha(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Rn.exists(this), Rn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Cw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ha(e), c = this.outputLen;
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
const vw = (t, e, n) => t & e ^ ~t & n, Lw = (t, e, n) => t & e ^ t & n ^ e & n, Bw = new Uint32Array([
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
]), an = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), cn = new Uint32Array(64);
let nd = class extends Vc {
  constructor() {
    super(64, 32, 8, !1), this.A = an[0] | 0, this.B = an[1] | 0, this.C = an[2] | 0, this.D = an[3] | 0, this.E = an[4] | 0, this.F = an[5] | 0, this.G = an[6] | 0, this.H = an[7] | 0;
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
      cn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = cn[l - 15], h = cn[l - 2], b = me(g, 7) ^ me(g, 18) ^ g >>> 3, y = me(h, 17) ^ me(h, 19) ^ h >>> 10;
      cn[l] = y + cn[l - 7] + b + cn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = me(a, 6) ^ me(a, 11) ^ me(a, 25), h = f + g + vw(a, c, u) + Bw[l] + cn[l] | 0, y = (me(r, 2) ^ me(r, 13) ^ me(r, 22)) + Lw(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    cn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Hw = class extends nd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const rd = br(() => new nd());
br(() => new Hw());
var yr = {}, Gc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ye;
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
})(Gc);
var er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.c32checkDecode = er.c32checkEncode = void 0;
const tf = te, ef = Ye, $s = Gc;
function sd(t) {
  const e = (0, tf.sha256)((0, tf.sha256)((0, ef.hexToBytes)(t)));
  return (0, ef.bytesToHex)(e.slice(0, 4));
}
function _w(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = sd(`${n}${e}`), s = (0, $s.c32encode)(`${e}${r}`);
  return `${$s.c32[t]}${s}`;
}
er.c32checkEncode = _w;
function Mw(t) {
  t = (0, $s.c32normalize)(t);
  const e = (0, $s.c32decode)(t.slice(1)), n = t[0], r = $s.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), sd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
er.c32checkDecode = Mw;
var id = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.decode = qr.encode = void 0;
const Qi = te, nf = Ye, od = Jh, ad = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Uw(t, e = "00") {
  const n = typeof t == "string" ? (0, nf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, nf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Qi.sha256)((0, Qi.sha256)(new Uint8Array([...r, ...n])));
  return od(ad).encode([...r, ...n, ...s.slice(0, 4)]);
}
qr.encode = Uw;
function Nw(t) {
  const e = od(ad).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Qi.sha256)((0, Qi.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
qr.decode = Nw;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = er, n = qr, r = Ye;
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
})(id);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Gc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = er;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = id;
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
})(yr);
function Tw(t, e) {
  switch (e = Z0(e ?? X0), t) {
    case Re.P2PKH:
      switch (e.transactionVersion) {
        case Ve.Mainnet:
          return ve.MainnetSingleSig;
        case Ve.Testnet:
          return ve.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Re.P2SH:
    case Re.P2SHNonSequential:
    case Re.P2WPKH:
    case Re.P2WSH:
    case Re.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Ve.Mainnet:
          return ve.MainnetMultiSig;
        case Ve.Testnet:
          return ve.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Pw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cd = Uint8Array.from({ length: 16 }, (t, e) => e), kw = cd.map((t) => (9 * t + 5) % 16);
let Kc = [cd], Wc = [kw];
for (let t = 0; t < 4; t++)
  for (let e of [Kc, Wc])
    e.push(e[t].map((n) => Pw[n]));
const ld = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Dw = Kc.map((t, e) => t.map((n) => ld[e][n])), Ow = Wc.map((t, e) => t.map((n) => ld[e][n])), Fw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), jw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), wi = (t, e) => t << e | t >>> 32 - e;
function rf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xi = new Uint32Array(16);
let zw = class extends Vc {
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
      xi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = Fw[h], A = jw[h], v = Kc[h], L = Wc[h], p = Dw[h], E = Ow[h];
      for (let S = 0; S < 16; S++) {
        const T = wi(r + rf(h, i, a, u) + xi[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = wi(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = wi(s + rf(b, o, c, f) + xi[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = wi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    xi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Rw = br(() => new zw()), mi = BigInt(2 ** 32 - 1), Oa = BigInt(32);
function ud(t, e = !1) {
  return e ? { h: Number(t & mi), l: Number(t >> Oa & mi) } : { h: Number(t >> Oa & mi) | 0, l: Number(t & mi) | 0 };
}
function Vw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ud(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Gw = (t, e) => BigInt(t >>> 0) << Oa | BigInt(e >>> 0), Kw = (t, e, n) => t >>> n, Ww = (t, e, n) => t << 32 - n | e >>> n, qw = (t, e, n) => t >>> n | e << 32 - n, Yw = (t, e, n) => t << 32 - n | e >>> n, Xw = (t, e, n) => t << 64 - n | e >>> n - 32, Zw = (t, e, n) => t >>> n - 32 | e << 64 - n, Qw = (t, e) => e, Jw = (t, e) => t, tx = (t, e, n) => t << n | e >>> 32 - n, ex = (t, e, n) => e << n | t >>> 32 - n, nx = (t, e, n) => e << n - 32 | t >>> 64 - n, rx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function sx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ix = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ox = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, lx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ux = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: ud,
  split: Vw,
  toBig: Gw,
  shrSH: Kw,
  shrSL: Ww,
  rotrSH: qw,
  rotrSL: Yw,
  rotrBH: Xw,
  rotrBL: Zw,
  rotr32H: Qw,
  rotr32L: Jw,
  rotlSH: tx,
  rotlSL: ex,
  rotlBH: nx,
  rotlBL: rx,
  add: sx,
  add3L: ix,
  add3H: ox,
  add4L: ax,
  add4H: cx,
  add5H: ux,
  add5L: lx
}, [fx, hx] = q.split([
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
].map((t) => BigInt(t))), ln = new Uint32Array(80), un = new Uint32Array(80);
let Lo = class extends Vc {
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
      ln[p] = e.getUint32(n), un[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = ln[p - 15] | 0, S = un[p - 15] | 0, T = q.rotrSH(E, S, 1) ^ q.rotrSH(E, S, 8) ^ q.shrSH(E, S, 7), O = q.rotrSL(E, S, 1) ^ q.rotrSL(E, S, 8) ^ q.shrSL(E, S, 7), H = ln[p - 2] | 0, N = un[p - 2] | 0, w = q.rotrSH(H, N, 19) ^ q.rotrBH(H, N, 61) ^ q.shrSH(H, N, 6), I = q.rotrSL(H, N, 19) ^ q.rotrBL(H, N, 61) ^ q.shrSL(H, N, 6), _ = q.add4L(O, I, un[p - 7], un[p - 16]), F = q.add4H(_, T, w, ln[p - 7], ln[p - 16]);
      ln[p] = F | 0, un[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = q.rotrSH(l, g, 14) ^ q.rotrSH(l, g, 18) ^ q.rotrBH(l, g, 41), S = q.rotrSL(l, g, 14) ^ q.rotrSL(l, g, 18) ^ q.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = q.add5L(L, S, O, hx[p], un[p]), N = q.add5H(H, v, E, T, fx[p], ln[p]), w = H | 0, I = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), _ = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = q.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = q.add3L(w, _, G);
      r = q.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = q.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = q.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = q.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = q.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = q.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    ln.fill(0), un.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, dx = class extends Lo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gx = class extends Lo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, px = class extends Lo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
br(() => new Lo());
br(() => new dx());
br(() => new gx());
br(() => new px());
var Ji = { exports: {} };
Ji.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", y = "[object Promise]", A = "[object RegExp]", v = "[object Set]", L = "[object String]", p = "[object Symbol]", E = "[object WeakMap]", S = "[object ArrayBuffer]", T = "[object DataView]", O = "[object Float32Array]", H = "[object Float64Array]", N = "[object Int8Array]", w = "[object Int16Array]", I = "[object Int32Array]", _ = "[object Uint8Array]", F = "[object Uint8ClampedArray]", G = "[object Uint16Array]", P = "[object Uint32Array]", ke = /[\\^$.*+?()[\]{}|]/g, Ze = /\w*$/, Sr = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, C = {};
  C[i] = C[o] = C[S] = C[T] = C[a] = C[c] = C[O] = C[H] = C[N] = C[w] = C[I] = C[g] = C[h] = C[b] = C[A] = C[v] = C[L] = C[p] = C[_] = C[F] = C[G] = C[P] = !0, C[u] = C[f] = C[E] = !1;
  var ht = typeof Kt == "object" && Kt && Kt.Object === Object && Kt, pt = typeof self == "object" && self && self.Object === Object && self, ut = ht || pt || Function("return this")(), Mt = e && !e.nodeType && e, bs = Mt && !0 && t && !t.nodeType && t, ti = bs && bs.exports === Mt;
  function Vo(d, x) {
    return d.set(x[0], x[1]), d;
  }
  function vp(d, x) {
    return d.add(x), d;
  }
  function Lp(d, x) {
    for (var $ = -1, k = d ? d.length : 0; ++$ < k && x(d[$], $, d) !== !1; )
      ;
    return d;
  }
  function Bp(d, x) {
    for (var $ = -1, k = x.length, Ht = d.length; ++$ < k; )
      d[Ht + $] = x[$];
    return d;
  }
  function Rl(d, x, $, k) {
    for (var Ht = -1, Wt = d ? d.length : 0; ++Ht < Wt; )
      $ = x($, d[Ht], Ht, d);
    return $;
  }
  function Hp(d, x) {
    for (var $ = -1, k = Array(d); ++$ < d; )
      k[$] = x($);
    return k;
  }
  function _p(d, x) {
    return d == null ? void 0 : d[x];
  }
  function Vl(d) {
    var x = !1;
    if (d != null && typeof d.toString != "function")
      try {
        x = !!(d + "");
      } catch {
      }
    return x;
  }
  function Gl(d) {
    var x = -1, $ = Array(d.size);
    return d.forEach(function(k, Ht) {
      $[++x] = [Ht, k];
    }), $;
  }
  function Go(d, x) {
    return function($) {
      return d(x($));
    };
  }
  function Kl(d) {
    var x = -1, $ = Array(d.size);
    return d.forEach(function(k) {
      $[++x] = k;
    }), $;
  }
  var Mp = Array.prototype, Up = Function.prototype, ei = Object.prototype, Ko = ut["__core-js_shared__"], Wl = function() {
    var d = /[^.]+$/.exec(Ko && Ko.keys && Ko.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), ql = Up.toString, Qe = ei.hasOwnProperty, ni = ei.toString, Np = RegExp(
    "^" + ql.call(Qe).replace(ke, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Yl = ti ? ut.Buffer : void 0, Xl = ut.Symbol, Zl = ut.Uint8Array, Tp = Go(Object.getPrototypeOf, Object), Pp = Object.create, kp = ei.propertyIsEnumerable, Dp = Mp.splice, Ql = Object.getOwnPropertySymbols, Op = Yl ? Yl.isBuffer : void 0, Fp = Go(Object.keys, Object), Wo = Ir(ut, "DataView"), ys = Ir(ut, "Map"), qo = Ir(ut, "Promise"), Yo = Ir(ut, "Set"), Xo = Ir(ut, "WeakMap"), ws = Ir(Object, "create"), jp = On(Wo), zp = On(ys), Rp = On(qo), Vp = On(Yo), Gp = On(Xo), Jl = Xl ? Xl.prototype : void 0, tu = Jl ? Jl.valueOf : void 0;
  function kn(d) {
    var x = -1, $ = d ? d.length : 0;
    for (this.clear(); ++x < $; ) {
      var k = d[x];
      this.set(k[0], k[1]);
    }
  }
  function Kp() {
    this.__data__ = ws ? ws(null) : {};
  }
  function Wp(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function qp(d) {
    var x = this.__data__;
    if (ws) {
      var $ = x[d];
      return $ === r ? void 0 : $;
    }
    return Qe.call(x, d) ? x[d] : void 0;
  }
  function Yp(d) {
    var x = this.__data__;
    return ws ? x[d] !== void 0 : Qe.call(x, d);
  }
  function Xp(d, x) {
    var $ = this.__data__;
    return $[d] = ws && x === void 0 ? r : x, this;
  }
  kn.prototype.clear = Kp, kn.prototype.delete = Wp, kn.prototype.get = qp, kn.prototype.has = Yp, kn.prototype.set = Xp;
  function De(d) {
    var x = -1, $ = d ? d.length : 0;
    for (this.clear(); ++x < $; ) {
      var k = d[x];
      this.set(k[0], k[1]);
    }
  }
  function Zp() {
    this.__data__ = [];
  }
  function Qp(d) {
    var x = this.__data__, $ = ri(x, d);
    if ($ < 0)
      return !1;
    var k = x.length - 1;
    return $ == k ? x.pop() : Dp.call(x, $, 1), !0;
  }
  function Jp(d) {
    var x = this.__data__, $ = ri(x, d);
    return $ < 0 ? void 0 : x[$][1];
  }
  function t1(d) {
    return ri(this.__data__, d) > -1;
  }
  function e1(d, x) {
    var $ = this.__data__, k = ri($, d);
    return k < 0 ? $.push([d, x]) : $[k][1] = x, this;
  }
  De.prototype.clear = Zp, De.prototype.delete = Qp, De.prototype.get = Jp, De.prototype.has = t1, De.prototype.set = e1;
  function Ar(d) {
    var x = -1, $ = d ? d.length : 0;
    for (this.clear(); ++x < $; ) {
      var k = d[x];
      this.set(k[0], k[1]);
    }
  }
  function n1() {
    this.__data__ = {
      hash: new kn(),
      map: new (ys || De)(),
      string: new kn()
    };
  }
  function r1(d) {
    return si(this, d).delete(d);
  }
  function s1(d) {
    return si(this, d).get(d);
  }
  function i1(d) {
    return si(this, d).has(d);
  }
  function o1(d, x) {
    return si(this, d).set(d, x), this;
  }
  Ar.prototype.clear = n1, Ar.prototype.delete = r1, Ar.prototype.get = s1, Ar.prototype.has = i1, Ar.prototype.set = o1;
  function Er(d) {
    this.__data__ = new De(d);
  }
  function a1() {
    this.__data__ = new De();
  }
  function c1(d) {
    return this.__data__.delete(d);
  }
  function l1(d) {
    return this.__data__.get(d);
  }
  function u1(d) {
    return this.__data__.has(d);
  }
  function f1(d, x) {
    var $ = this.__data__;
    if ($ instanceof De) {
      var k = $.__data__;
      if (!ys || k.length < n - 1)
        return k.push([d, x]), this;
      $ = this.__data__ = new Ar(k);
    }
    return $.set(d, x), this;
  }
  Er.prototype.clear = a1, Er.prototype.delete = c1, Er.prototype.get = l1, Er.prototype.has = u1, Er.prototype.set = f1;
  function h1(d, x) {
    var $ = Jo(d) || P1(d) ? Hp(d.length, String) : [], k = $.length, Ht = !!k;
    for (var Wt in d)
      Qe.call(d, Wt) && !(Ht && (Wt == "length" || M1(Wt, k))) && $.push(Wt);
    return $;
  }
  function eu(d, x, $) {
    var k = d[x];
    (!(Qe.call(d, x) && iu(k, $)) || $ === void 0 && !(x in d)) && (d[x] = $);
  }
  function ri(d, x) {
    for (var $ = d.length; $--; )
      if (iu(d[$][0], x))
        return $;
    return -1;
  }
  function d1(d, x) {
    return d && nu(x, ta(x), d);
  }
  function Zo(d, x, $, k, Ht, Wt, Oe) {
    var qt;
    if (k && (qt = Wt ? k(d, Ht, Wt, Oe) : k(d)), qt !== void 0)
      return qt;
    if (!ii(d))
      return d;
    var cu = Jo(d);
    if (cu) {
      if (qt = B1(d), !x)
        return C1(d, qt);
    } else {
      var $r = Dn(d), lu = $r == f || $r == l;
      if (D1(d))
        return x1(d, x);
      if ($r == b || $r == i || lu && !Wt) {
        if (Vl(d))
          return Wt ? d : {};
        if (qt = H1(lu ? {} : d), !x)
          return v1(d, d1(qt, d));
      } else {
        if (!C[$r])
          return Wt ? d : {};
        qt = _1(d, $r, Zo, x);
      }
    }
    Oe || (Oe = new Er());
    var uu = Oe.get(d);
    if (uu)
      return uu;
    if (Oe.set(d, qt), !cu)
      var fu = $ ? L1(d) : ta(d);
    return Lp(fu || d, function(ea, oi) {
      fu && (oi = ea, ea = d[oi]), eu(qt, oi, Zo(ea, x, $, k, oi, d, Oe));
    }), qt;
  }
  function g1(d) {
    return ii(d) ? Pp(d) : {};
  }
  function p1(d, x, $) {
    var k = x(d);
    return Jo(d) ? k : Bp(k, $(d));
  }
  function b1(d) {
    return ni.call(d);
  }
  function y1(d) {
    if (!ii(d) || N1(d))
      return !1;
    var x = au(d) || Vl(d) ? Np : Sr;
    return x.test(On(d));
  }
  function w1(d) {
    if (!su(d))
      return Fp(d);
    var x = [];
    for (var $ in Object(d))
      Qe.call(d, $) && $ != "constructor" && x.push($);
    return x;
  }
  function x1(d, x) {
    if (x)
      return d.slice();
    var $ = new d.constructor(d.length);
    return d.copy($), $;
  }
  function Qo(d) {
    var x = new d.constructor(d.byteLength);
    return new Zl(x).set(new Zl(d)), x;
  }
  function m1(d, x) {
    var $ = x ? Qo(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.byteLength);
  }
  function S1(d, x, $) {
    var k = x ? $(Gl(d), !0) : Gl(d);
    return Rl(k, Vo, new d.constructor());
  }
  function A1(d) {
    var x = new d.constructor(d.source, Ze.exec(d));
    return x.lastIndex = d.lastIndex, x;
  }
  function E1(d, x, $) {
    var k = x ? $(Kl(d), !0) : Kl(d);
    return Rl(k, vp, new d.constructor());
  }
  function I1(d) {
    return tu ? Object(tu.call(d)) : {};
  }
  function $1(d, x) {
    var $ = x ? Qo(d.buffer) : d.buffer;
    return new d.constructor($, d.byteOffset, d.length);
  }
  function C1(d, x) {
    var $ = -1, k = d.length;
    for (x || (x = Array(k)); ++$ < k; )
      x[$] = d[$];
    return x;
  }
  function nu(d, x, $, k) {
    $ || ($ = {});
    for (var Ht = -1, Wt = x.length; ++Ht < Wt; ) {
      var Oe = x[Ht], qt = void 0;
      eu($, Oe, qt === void 0 ? d[Oe] : qt);
    }
    return $;
  }
  function v1(d, x) {
    return nu(d, ru(d), x);
  }
  function L1(d) {
    return p1(d, ta, ru);
  }
  function si(d, x) {
    var $ = d.__data__;
    return U1(x) ? $[typeof x == "string" ? "string" : "hash"] : $.map;
  }
  function Ir(d, x) {
    var $ = _p(d, x);
    return y1($) ? $ : void 0;
  }
  var ru = Ql ? Go(Ql, Object) : j1, Dn = b1;
  (Wo && Dn(new Wo(new ArrayBuffer(1))) != T || ys && Dn(new ys()) != g || qo && Dn(qo.resolve()) != y || Yo && Dn(new Yo()) != v || Xo && Dn(new Xo()) != E) && (Dn = function(d) {
    var x = ni.call(d), $ = x == b ? d.constructor : void 0, k = $ ? On($) : void 0;
    if (k)
      switch (k) {
        case jp:
          return T;
        case zp:
          return g;
        case Rp:
          return y;
        case Vp:
          return v;
        case Gp:
          return E;
      }
    return x;
  });
  function B1(d) {
    var x = d.length, $ = d.constructor(x);
    return x && typeof d[0] == "string" && Qe.call(d, "index") && ($.index = d.index, $.input = d.input), $;
  }
  function H1(d) {
    return typeof d.constructor == "function" && !su(d) ? g1(Tp(d)) : {};
  }
  function _1(d, x, $, k) {
    var Ht = d.constructor;
    switch (x) {
      case S:
        return Qo(d);
      case a:
      case c:
        return new Ht(+d);
      case T:
        return m1(d, k);
      case O:
      case H:
      case N:
      case w:
      case I:
      case _:
      case F:
      case G:
      case P:
        return $1(d, k);
      case g:
        return S1(d, k, $);
      case h:
      case L:
        return new Ht(d);
      case A:
        return A1(d);
      case v:
        return E1(d, k, $);
      case p:
        return I1(d);
    }
  }
  function M1(d, x) {
    return x = x ?? s, !!x && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < x;
  }
  function U1(d) {
    var x = typeof d;
    return x == "string" || x == "number" || x == "symbol" || x == "boolean" ? d !== "__proto__" : d === null;
  }
  function N1(d) {
    return !!Wl && Wl in d;
  }
  function su(d) {
    var x = d && d.constructor, $ = typeof x == "function" && x.prototype || ei;
    return d === $;
  }
  function On(d) {
    if (d != null) {
      try {
        return ql.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function T1(d) {
    return Zo(d, !0, !0);
  }
  function iu(d, x) {
    return d === x || d !== d && x !== x;
  }
  function P1(d) {
    return k1(d) && Qe.call(d, "callee") && (!kp.call(d, "callee") || ni.call(d) == i);
  }
  var Jo = Array.isArray;
  function ou(d) {
    return d != null && O1(d.length) && !au(d);
  }
  function k1(d) {
    return F1(d) && ou(d);
  }
  var D1 = Op || z1;
  function au(d) {
    var x = ii(d) ? ni.call(d) : "";
    return x == f || x == l;
  }
  function O1(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function ii(d) {
    var x = typeof d;
    return !!d && (x == "object" || x == "function");
  }
  function F1(d) {
    return !!d && typeof d == "object";
  }
  function ta(d) {
    return ou(d) ? h1(d) : w1(d);
  }
  function j1() {
    return [];
  }
  function z1() {
    return !1;
  }
  t.exports = T1;
})(Ji, Ji.exports);
var bx = Ji.exports;
const fd = /* @__PURE__ */ Yh(bx);
var Fa;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fa || (Fa = {}));
function yx(t, e) {
  return { type: Fa.Address, version: t, hash160: e };
}
function wx(t) {
  return yr.c32address(t.version, t.hash160);
}
const xx = (t) => Rw(rd(t)), mx = (t) => z(xx(t));
It.hmacSha256Sync = (t, ...e) => {
  const n = ed.create(rd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sx(t, e = "mainnet") {
  e = Z0(e), t = typeof t == "string" ? st(t) : t;
  const n = Tw(Re.P2PKH, e), r = yx(n, mx(t));
  return wx(r);
}
function Ax(t, e) {
  const n = kt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Sx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new kt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Ex(t, e = null) {
  let n;
  e ? n = Ax(t, e) : n = kt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const sf = "_blockstackDidCheckEchoReply", Ix = "echoReply", $x = "authContinuation";
function Cx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function vx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[sf];
  if (typeof e == "boolean")
    return e;
  const n = Cx(t.location.search), r = n[Ix];
  if (r) {
    t[sf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[$x];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class _s {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new wo();
    else
      throw new g2("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ou(e.sessionOptions) : this.store = new Ou() : e ? this.store = new Du(e.sessionOptions) : this.store = new Du();
  }
  makeAuthRequestToken(e, n, r, s, i, o = b2().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new La("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, hw(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = fw();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Bc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (vx())
        return _r.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      _r.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = O2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ai("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = kt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await yw(e))
      throw new ai("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (oa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Pu(s, i.private_key);
          } catch {
            if (_r.warn("Failed decryption of appPrivateKey, will try to use as given"), !It.isValidPrivateKey(i.private_key))
              throw new ai("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Pu(s, c);
          } catch {
            _r.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ai("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = L2, f;
    oa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), oa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: q0(i.iss),
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
        l.profile = Object.assign({}, f2);
      else {
        const b = await h.text(), y = JSON.parse(b);
        l.profile = Ex(y[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new La("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ly(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), By(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
_s.prototype.makeAuthRequest = _s.prototype.makeAuthRequestToken;
const Lx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Bx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Lx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Bo(r.id));
  return e.concat(n);
}, Bo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), qc = "STX_PROVIDER", pe = () => typeof window > "u" ? null : window.localStorage.getItem(qc), hd = (t) => {
  typeof window < "u" && window.localStorage.setItem(qc, t);
}, dd = () => {
  typeof window < "u" && window.localStorage.removeItem(qc);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof Kt < "u" && Kt || {}, r = {
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
            var ke = G.join(":").trim();
            try {
              I.append(P, ke);
            } catch (Ze) {
              console.warn("Response " + Ze.message);
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
          function ke() {
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
          function Ze(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (P.open(G.method, Ze(G.url), !0), G.credentials === "include" ? P.withCredentials = !0 : G.credentials === "omit" && (P.withCredentials = !1), "responseType" in P && (r.blob ? P.responseType = "blob" : r.arrayBuffer && (P.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof f || n.Headers && I.headers instanceof n.Headers)) {
            var Sr = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(m) {
              Sr.push(a(m)), P.setRequestHeader(m, c(I.headers[m]));
            }), G.headers.forEach(function(m, C) {
              Sr.indexOf(C) === -1 && P.setRequestHeader(C, m);
            });
          } else
            G.headers.forEach(function(m, C) {
              P.setRequestHeader(C, m);
            });
          G.signal && (G.signal.addEventListener("abort", ke), P.onreadystatechange = function() {
            P.readyState === 4 && G.signal.removeEventListener("abort", ke);
          }), P.send(typeof G._bodyInit > "u" ? null : G._bodyInit);
        });
      }
      return N.polyfill = !0, n.fetch || (n.fetch = N, n.Headers = f, n.Request = E, n.Response = O), e.Headers = f, e.Request = E, e.Response = O, e.fetch = N, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Kt);
})();
const Hx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function _x(t, e) {
  const n = {};
  return Object.assign(n, Hx, e), await fetch(t, n);
}
function Mx(t) {
  let e = _x, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ux(...t) {
  const { fetchLib: e, middlewares: n } = Mx(t);
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
var Yr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yr || (Yr = {}));
var nr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nr || (nr = {}));
var of;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(of || (of = {}));
const Nx = "https://api.mainnet.hiro.so", Tx = "https://api.testnet.hiro.so", Px = "http://localhost:3999", kx = ["mainnet", "testnet", "devnet", "mocknet"];
let rr = class {
  constructor(e) {
    this.version = nr.Mainnet, this.chainId = Yr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === nr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ux();
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
rr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ja();
    case "testnet":
      return new za();
    case "devnet":
      return new Dx();
    case "mocknet":
      return new gd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${kx.join(", ")}`);
  }
};
rr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : rr.fromName(t);
let ja = class extends rr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Nx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nr.Mainnet, this.chainId = Yr.Mainnet;
  }
}, za = class extends rr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Tx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nr.Testnet, this.chainId = Yr.Testnet;
  }
}, gd = class extends rr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nr.Testnet, this.chainId = Yr.Testnet;
  }
};
const Dx = gd;
var sr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(sr || (sr = {}));
var to;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(to || (to = {}));
sr.Mainnet;
var ir;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ir || (ir = {}));
var or;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(or || (or = {}));
ir.Mainnet;
const Ox = {
  chainId: sr.Mainnet,
  transactionVersion: ir.Mainnet,
  peerNetworkId: to.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: or.MainnetSingleSig,
    multiSig: or.MainnetMultiSig
  },
  client: { baseUrl: Lh }
}, Ra = {
  chainId: sr.Testnet,
  transactionVersion: ir.Testnet,
  peerNetworkId: to.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: or.TestnetSingleSig,
    multiSig: or.TestnetMultiSig
  },
  client: { baseUrl: Bh }
}, Oi = {
  ...Ra,
  addressVersion: { ...Ra.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Hh }
}, Fx = {
  ...Oi,
  addressVersion: { ...Oi.addressVersion },
  client: { ...Oi.client }
};
function jx(t) {
  switch (t) {
    case "mainnet":
      return Ox;
    case "testnet":
      return Ra;
    case "devnet":
      return Oi;
    case "mocknet":
      return Fx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function zx(t) {
  return typeof t == "string" ? jx(t) : t;
}
function Rx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const af = /* @__PURE__ */ new Map();
function pd(t, e) {
  const n = af.get(t);
  if (n !== void 0)
    return n(e);
  const r = Rx(t);
  return af.set(t, r), pd(t, e);
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
    return T2(this.readBytes(4), 0);
  }
  readUInt8() {
    return U2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return _2(this.readBytes(2), 0);
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
    if (pd(e, r))
      return r;
    throw n(r);
  }
};
const Vx = 128, Gx = 128, bd = 16, qn = 32, Va = 80, Ho = 65, Kx = 32, Wx = 64, eo = 34, qx = 1 + 16 * 1024 * 1024, Yx = 165, Xx = 16, Zx = 16, Qx = 20, Jx = Zx + 2 + Qx, tm = Jx + 4, em = qx + (Yx + Xx * tm);
var ct;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ct || (ct = {}));
var Ga;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ga || (Ga = {}));
var Qt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Qt || (Qt = {}));
const da = ["onChainOnly", "offChainOnly", "any"];
da[0] + "", Qt.OnChainOnly, da[1] + "", Qt.OffChainOnly, da[2] + "", Qt.Any, Qt.OnChainOnly + "", Qt.OnChainOnly, Qt.OffChainOnly + "", Qt.OffChainOnly, Qt.Any + "", Qt.Any;
var no;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(no || (no = {}));
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
var mt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(mt || (mt = {}));
var Cs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Cs || (Cs = {}));
var Ka;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ka || (Ka = {}));
var Wa;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Wa || (Wa = {}));
var Gt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gt || (Gt = {}));
var cf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(cf || (cf = {}));
var qa;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(qa || (qa = {}));
var fe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fe || (fe = {}));
var lf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(lf || (lf = {}));
let _o = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Mr = class extends _o {
  constructor(e) {
    super(e);
  }
}, Ft = class extends _o {
  constructor(e) {
    super(e);
  }
}, ro = class extends _o {
  constructor(e) {
    super(e);
  }
}, Vn = class extends _o {
  constructor(e) {
    super(e);
  }
};
function Ya(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function yd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ya(t.outputLen), Ya(t.blockLen);
}
function sm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function im(t, e) {
  yd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gn = {
  number: Ya,
  bool: nm,
  bytes: yd,
  hash: rm,
  exists: sm,
  output: im
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ga = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Se = (t, e) => t << 32 - e | t >>> e, om = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!om)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function am(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yc(t) {
  if (typeof t == "string" && (t = am(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let wd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wr(t) {
  const e = (r) => t().update(Yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let xd = class extends wd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Gn.hash(e);
    const r = Yc(n);
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
};
const md = (t, e, n) => new xd(t, e).update(n).digest();
md.create = (t, e) => new xd(t, e);
function cm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Xc = class extends wd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ga(this.buffer);
  }
  update(e) {
    Gn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ga(e);
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
    cm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ga(e), c = this.outputLen;
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
const lm = (t, e, n) => t & e ^ ~t & n, um = (t, e, n) => t & e ^ t & n ^ e & n, fm = new Uint32Array([
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
]), fn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hn = new Uint32Array(64);
let Sd = class extends Xc {
  constructor() {
    super(64, 32, 8, !1), this.A = fn[0] | 0, this.B = fn[1] | 0, this.C = fn[2] | 0, this.D = fn[3] | 0, this.E = fn[4] | 0, this.F = fn[5] | 0, this.G = fn[6] | 0, this.H = fn[7] | 0;
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
      hn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = hn[l - 15], h = hn[l - 2], b = Se(g, 7) ^ Se(g, 18) ^ g >>> 3, y = Se(h, 17) ^ Se(h, 19) ^ h >>> 10;
      hn[l] = y + hn[l - 7] + b + hn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Se(a, 6) ^ Se(a, 11) ^ Se(a, 25), h = f + g + lm(a, c, u) + fm[l] + hn[l] | 0, y = (Se(r, 2) ^ Se(r, 13) ^ Se(r, 22)) + um(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    hn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hm = class extends Sd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zc = wr(() => new Sd());
wr(() => new hm());
const dm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ad = Uint8Array.from({ length: 16 }, (t, e) => e), gm = Ad.map((t) => (9 * t + 5) % 16);
let Qc = [Ad], Jc = [gm];
for (let t = 0; t < 4; t++)
  for (let e of [Qc, Jc])
    e.push(e[t].map((n) => dm[n]));
const Ed = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pm = Qc.map((t, e) => t.map((n) => Ed[e][n])), bm = Jc.map((t, e) => t.map((n) => Ed[e][n])), ym = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Si = (t, e) => t << e | t >>> 32 - e;
function uf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ai = new Uint32Array(16);
let xm = class extends Xc {
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
      Ai[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = ym[h], A = wm[h], v = Qc[h], L = Jc[h], p = pm[h], E = bm[h];
      for (let S = 0; S < 16; S++) {
        const T = Si(r + uf(h, i, a, u) + Ai[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = Si(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = Si(s + uf(b, o, c, f) + Ai[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = Si(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ai.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const mm = wr(() => new xm()), Ei = BigInt(2 ** 32 - 1), Xa = BigInt(32);
function Id(t, e = !1) {
  return e ? { h: Number(t & Ei), l: Number(t >> Xa & Ei) } : { h: Number(t >> Xa & Ei) | 0, l: Number(t & Ei) | 0 };
}
function Sm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Id(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Am = (t, e) => BigInt(t >>> 0) << Xa | BigInt(e >>> 0), Em = (t, e, n) => t >>> n, Im = (t, e, n) => t << 32 - n | e >>> n, $m = (t, e, n) => t >>> n | e << 32 - n, Cm = (t, e, n) => t << 32 - n | e >>> n, vm = (t, e, n) => t << 64 - n | e >>> n - 32, Lm = (t, e, n) => t >>> n - 32 | e << 64 - n, Bm = (t, e) => e, Hm = (t, e) => t, _m = (t, e, n) => t << n | e >>> 32 - n, Mm = (t, e, n) => e << n | t >>> 32 - n, Um = (t, e, n) => e << n - 32 | t >>> 64 - n, Nm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Tm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Pm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), km = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Dm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Om = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Fm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), jm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: Id,
  split: Sm,
  toBig: Am,
  shrSH: Em,
  shrSL: Im,
  rotrSH: $m,
  rotrSL: Cm,
  rotrBH: vm,
  rotrBL: Lm,
  rotr32H: Bm,
  rotr32L: Hm,
  rotlSH: _m,
  rotlSL: Mm,
  rotlBH: Um,
  rotlBL: Nm,
  add: Tm,
  add3L: Pm,
  add3H: km,
  add4L: Dm,
  add4H: Om,
  add5H: jm,
  add5L: Fm
}, [zm, Rm] = Y.split([
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
].map((t) => BigInt(t))), dn = new Uint32Array(80), gn = new Uint32Array(80);
let Mo = class extends Xc {
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
      dn[p] = e.getUint32(n), gn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = dn[p - 15] | 0, S = gn[p - 15] | 0, T = Y.rotrSH(E, S, 1) ^ Y.rotrSH(E, S, 8) ^ Y.shrSH(E, S, 7), O = Y.rotrSL(E, S, 1) ^ Y.rotrSL(E, S, 8) ^ Y.shrSL(E, S, 7), H = dn[p - 2] | 0, N = gn[p - 2] | 0, w = Y.rotrSH(H, N, 19) ^ Y.rotrBH(H, N, 61) ^ Y.shrSH(H, N, 6), I = Y.rotrSL(H, N, 19) ^ Y.rotrBL(H, N, 61) ^ Y.shrSL(H, N, 6), _ = Y.add4L(O, I, gn[p - 7], gn[p - 16]), F = Y.add4H(_, T, w, dn[p - 7], dn[p - 16]);
      dn[p] = F | 0, gn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = Y.rotrSH(l, g, 14) ^ Y.rotrSH(l, g, 18) ^ Y.rotrBH(l, g, 41), S = Y.rotrSL(l, g, 14) ^ Y.rotrSL(l, g, 18) ^ Y.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = Y.add5L(L, S, O, Rm[p], gn[p]), N = Y.add5H(H, v, E, T, zm[p], dn[p]), w = H | 0, I = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), _ = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Y.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = Y.add3L(w, _, G);
      r = Y.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Y.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Y.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Y.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = Y.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    dn.fill(0), gn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Vm = class extends Mo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Gm = class extends Mo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Km = class extends Mo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
wr(() => new Mo());
wr(() => new Vm());
const Wm = wr(() => new Gm());
wr(() => new Km());
var nt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(nt || (nt = {}));
var Lt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Lt || (Lt = {}));
function tl(t) {
  return Lt[t];
}
const qm = () => ({ type: nt.BoolTrue }), Ym = () => ({ type: nt.BoolFalse }), Xm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: nt.Buffer, value: z(t) };
}, ff = BigInt("0xffffffffffffffffffffffffffffffff"), Zm = BigInt(0), hf = BigInt("0x7fffffffffffffffffffffffffffffff"), df = BigInt("-170141183460469231731687303715884105728"), Qm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Ha(st(t))), Xt(t, Uint8Array) && (t = Ha(t));
  const e = Pt(t);
  if (e > hf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${hf}`);
  if (e < df)
    throw new RangeError(`Cannot construct clarity integer form value less than ${df}`);
  return { type: nt.Int, value: e };
}, Jm = (t) => {
  const e = Pt(t);
  if (e < Zm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ff)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ff}`);
  return { type: nt.UInt, value: e };
};
function tS(t) {
  return { type: nt.List, value: t };
}
function $d() {
  return { type: nt.OptionalNone };
}
function Cd(t) {
  return { type: nt.OptionalSome, value: t };
}
var U;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(U || (U = {}));
function eS() {
  return {
    type: U.Address,
    version: or.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function gf(t) {
  if (t && Td(t, eo))
    throw new Error(`Memo exceeds maximum length of ${eo} bytes`);
  return { type: U.MemoString, content: t };
}
function el(t, e) {
  return {
    type: U.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Za(t) {
  if (st(t).byteLength != Ho)
    throw Error("Invalid signature");
  return {
    type: U.MessageSignature,
    data: t
  };
}
function nS(t, e, n) {
  return typeof t == "string" && (t = wS(t)), typeof n == "string" && (n = gf(n)), {
    type: U.Payload,
    payloadType: ct.TokenTransfer,
    recipient: t,
    amount: Pt(e),
    memo: n ?? gf("")
  };
}
function rS(t, e, n, r) {
  return typeof e == "string" && (e = be(e)), typeof n == "string" && (n = be(n)), {
    type: U.Payload,
    payloadType: ct.ContractCall,
    contractAddress: typeof t == "string" ? Pn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function sS(t) {
  return be(t, 4, 1e5);
}
function pf(t, e, n) {
  return typeof t == "string" && (t = be(t)), typeof e == "string" && (e = sS(e)), typeof n == "number" ? {
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
function iS() {
  return { type: U.Payload, payloadType: ct.PoisonMicroblock };
}
function bf(t, e) {
  if (t.byteLength != qn)
    throw Error(`Coinbase buffer size must be ${qn} bytes`);
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
function oS(t, e, n) {
  if (t.byteLength != qn)
    throw Error(`Coinbase buffer size must be ${qn} bytes`);
  if (n.byteLength != Va)
    throw Error(`VRF proof buffer size must be ${Va} bytes`);
  return {
    type: U.Payload,
    payloadType: ct.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === nt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function aS(t, e, n, r, s, i, o) {
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
function be(t, e, n) {
  const r = e || 1, s = n || Vx;
  if (Td(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: U.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function cS(t, e, n) {
  return {
    type: U.Asset,
    address: Pn(t),
    contractName: be(e),
    assetName: be(n)
  };
}
function Pn(t) {
  const e = yr.c32addressDecode(t);
  return {
    type: U.Address,
    version: e[0],
    hash160: e[1]
  };
}
function lS(t, e) {
  const n = Pn(t), r = be(e);
  return {
    type: U.Principal,
    prefix: Gt.Contract,
    address: n,
    contractName: r
  };
}
function uS(t) {
  const e = Pn(t);
  return {
    type: U.Principal,
    prefix: Gt.Standard,
    address: e
  };
}
function Ur(t, e) {
  return {
    pubKeyEncoding: t,
    type: U.TransactionAuthField,
    contents: e
  };
}
function je(t) {
  switch (t.type) {
    case U.Address:
      return Ks(t);
    case U.Principal:
      return vd(t);
    case U.LengthPrefixedString:
      return Zr(t);
    case U.MemoString:
      return hS(t);
    case U.Asset:
      return Bd(t);
    case U.PostCondition:
      return _d(t);
    case U.PublicKey:
      return tc(t);
    case U.LengthPrefixedList:
      return nl(t);
    case U.Payload:
      return Md(t);
    case U.TransactionAuthField:
      return yS(t);
    case U.MessageSignature:
      return rl(t);
  }
}
function Ks(t) {
  const e = [];
  return e.push(st(js(t.version, 1))), e.push(st(t.hash160)), $t(e);
}
function Xr(t) {
  const e = Xt(t, gt) ? t : new gt(t), n = yo(z(e.readBytes(1))), r = z(e.readBytes(20));
  return { type: U.Address, version: n, hash160: r };
}
function vd(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Gt.Standard || t.prefix === Gt.Contract) && e.push(Ks(t.address)), t.prefix === Gt.Contract && e.push(Zr(t.contractName)), $t(e);
}
function fS(t) {
  const e = Xt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(Gt, (i) => {
    throw new Ft(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Gt.Origin)
    return { type: U.Principal, prefix: n };
  const r = Xr(e);
  if (n === Gt.Standard)
    return { type: U.Principal, prefix: n, address: r };
  const s = oe(e);
  return {
    type: U.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Zr(t) {
  const e = [], n = gr(t.content), r = n.byteLength;
  return e.push(st(js(r, t.lengthPrefixBytes))), e.push(n), $t(e);
}
function oe(t, e, n) {
  e = e || 1;
  const r = Xt(t, gt) ? t : new gt(t), s = yo(z(r.readBytes(e))), i = zs(r.readBytes(s));
  return be(i, e, n ?? 128);
}
function hS(t) {
  const e = [], n = gr(t.content), r = jS(z(n), eo * 2);
  return e.push(st(r)), $t(e);
}
function Ld(t) {
  const e = Xt(t, gt) ? t : new gt(t);
  let n = zs(e.readBytes(eo));
  return n = n.replace(/\u0000*$/, ""), { type: U.MemoString, content: n };
}
function Bd(t) {
  const e = [];
  return e.push(Ks(t.address)), e.push(Zr(t.contractName)), e.push(Zr(t.assetName)), $t(e);
}
function Qa(t) {
  const e = Xt(t, gt) ? t : new gt(t);
  return {
    type: U.Asset,
    address: Xr(e),
    contractName: oe(e),
    assetName: oe(e)
  };
}
function nl(t) {
  const e = t.values, n = [];
  n.push(st(js(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(je(r));
  return $t(n);
}
function Hd(t, e, n) {
  const r = Xt(t, gt) ? t : new gt(t), s = yo(z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case U.Address:
        i.push(Xr(r));
        break;
      case U.LengthPrefixedString:
        i.push(oe(r));
        break;
      case U.MemoString:
        i.push(Ld(r));
        break;
      case U.Asset:
        i.push(Qa(r));
        break;
      case U.PostCondition:
        i.push(gS(r));
        break;
      case U.PublicKey:
        i.push(ec(r));
        break;
      case U.TransactionAuthField:
        i.push(bS(r));
        break;
    }
  return el(i, n);
}
function dS(t) {
  return z(_d(t));
}
function _d(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(vd(t.principal)), (t.conditionType === bt.Fungible || t.conditionType === bt.NonFungible) && e.push(Bd(t.asset)), t.conditionType === bt.NonFungible && e.push(Le(t.assetName)), e.push(t.conditionCode), t.conditionType === bt.STX || t.conditionType === bt.Fungible || t.conditionType === bt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Mr("The post-condition amount may not be larger than 8 bytes");
    e.push(Mn(t.amount, 8));
  }
  return $t(e);
}
function gS(t) {
  const e = Xt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(bt, (a) => {
    throw new Ft(`Could not read ${a} as PostConditionType`);
  }), r = fS(e);
  let s, i, o;
  switch (n) {
    case bt.STX:
      return s = e.readUInt8Enum(Cs, (c) => {
        throw new Ft(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: U.PostCondition,
        conditionType: bt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case bt.Fungible:
      return i = Qa(e), s = e.readUInt8Enum(Cs, (c) => {
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
      i = Qa(e);
      const a = $e(e);
      return s = e.readUInt8Enum(Ka, (c) => {
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
      return s = e.readUInt8Enum(Cs, (c) => {
        throw new Ft(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${z(e.readBytes(8))}`), {
        type: U.PostCondition,
        conditionType: bt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case bt.PoX: {
      const c = e.readUInt8Enum(Wa, (u) => {
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
function Md(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ct.TokenTransfer:
      e.push(Le(t.recipient)), e.push(Mn(t.amount, 8)), e.push(je(t.memo));
      break;
    case ct.ContractCall:
      e.push(je(t.contractAddress)), e.push(je(t.contractName)), e.push(je(t.functionName));
      const n = new Uint8Array(4);
      Zn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Le(r));
      });
      break;
    case ct.SmartContract:
      e.push(je(t.contractName)), e.push(je(t.codeBody));
      break;
    case ct.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(je(t.contractName)), e.push(je(t.codeBody));
      break;
    case ct.PoisonMicroblock:
      break;
    case ct.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ct.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Le(t.recipient));
      break;
    case ct.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Le(t.recipient ? Cd(t.recipient) : $d())), e.push(t.vrfProof);
      break;
    case ct.TenureChange:
      e.push(st(t.tenureHash)), e.push(st(t.previousTenureHash)), e.push(st(t.burnViewHash)), e.push(st(t.previousTenureEnd)), e.push(Zn(new Uint8Array(4), t.previousTenureBlocks)), e.push(N2(new Uint8Array(1), t.cause)), e.push(st(t.publicKeyHash));
      break;
  }
  return $t(e);
}
function pS(t) {
  const e = Xt(t, gt) ? t : new gt(t);
  switch (e.readUInt8Enum(ct, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ct.TokenTransfer:
      const r = $e(e), s = Pt(e.readBytes(8)), i = Ld(e);
      return nS(r, s, i);
    case ct.ContractCall:
      const o = Xr(e), a = oe(e), c = oe(e), u = [], f = e.readUInt32BE();
      for (let E = 0; E < f; E++) {
        const S = $e(e);
        u.push(S);
      }
      return rS(o, a, c, u);
    case ct.SmartContract:
      const l = oe(e), g = oe(e, 4, 1e5);
      return pf(l, g);
    case ct.VersionedSmartContract: {
      const E = e.readUInt8Enum(Ga, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), S = oe(e), T = oe(e, 4, em);
      return pf(S, T, E);
    }
    case ct.PoisonMicroblock:
      return iS();
    case ct.Coinbase: {
      const E = e.readBytes(qn);
      return bf(E);
    }
    case ct.CoinbaseToAltRecipient: {
      const E = e.readBytes(qn), S = $e(e);
      return bf(E, S);
    }
    case ct.NakamotoCoinbase: {
      const E = e.readBytes(qn), S = $e(e), T = e.readBytes(Va);
      return oS(E, S, T);
    }
    case ct.TenureChange:
      const h = z(e.readBytes(20)), b = z(e.readBytes(20)), y = z(e.readBytes(20)), A = z(e.readBytes(32)), v = e.readUInt32BE(), L = e.readUInt8Enum(qa, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), p = z(e.readBytes(20));
      return aS(h, b, y, A, v, L, p);
  }
}
function Ja(t) {
  const e = Xt(t, gt) ? t : new gt(t);
  return Za(z(e.readBytes(Ho)));
}
function bS(t) {
  const e = Xt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(fe, (r) => {
    throw new Ft(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case fe.PublicKeyCompressed:
      return Ur(mt.Compressed, ec(e));
    case fe.PublicKeyUncompressed:
      return Ur(mt.Uncompressed, as(QS(ec(e).data)));
    case fe.SignatureCompressed:
      return Ur(mt.Compressed, Ja(e));
    case fe.SignatureUncompressed:
      return Ur(mt.Uncompressed, Ja(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function rl(t) {
  return st(t.data);
}
function yS(t) {
  const e = [];
  switch (t.contents.type) {
    case U.PublicKey:
      e.push(t.pubKeyEncoding === mt.Compressed ? fe.PublicKeyCompressed : fe.PublicKeyUncompressed), e.push(st(ZS(t.contents.data)));
      break;
    case U.MessageSignature:
      e.push(t.pubKeyEncoding === mt.Compressed ? fe.SignatureCompressed : fe.SignatureUncompressed), e.push(rl(t.contents));
      break;
  }
  return $t(e);
}
function tc(t) {
  return t.data.slice();
}
function ec(t) {
  const e = Xt(t, gt) ? t : new gt(t), n = e.readUInt8(), r = n === 4 ? Wx : Kx;
  return as($t([n, e.readBytes(r)]));
}
function sl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ft.P2PKH || e === ft.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ft.P2WPKH || e === ft.P2WSH || e === ft.P2WSHNonSequential) && !r.map((s) => s.data).every(cs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ft.P2PKH:
      return Ii(t, zS(r[0].data));
    case ft.P2WPKH:
      return Ii(t, RS(r[0].data));
    case ft.P2SH:
    case ft.P2SHNonSequential:
      return Ii(t, VS(n, r.map(tc)));
    case ft.P2WSH:
    case ft.P2WSHNonSequential:
      return Ii(t, GS(n, r.map(tc)));
  }
}
function Ii(t, e) {
  return { type: U.Address, version: t, hash160: e };
}
function il(t) {
  return yr.c32address(t.version, t.hash160);
}
function yf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return cS(e, n, r);
}
function ms(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return lS(e, n);
  } else
    return uS(t);
}
function wS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return SS(e, n);
  } else
    return xS(t);
}
function xS(t) {
  const e = Pn(t);
  return { type: nt.PrincipalStandard, value: il(e) };
}
function mS(t) {
  return { type: nt.PrincipalStandard, value: il(t) };
}
function SS(t, e) {
  const n = Pn(t), r = be(e);
  return Ud(n, r);
}
function Ud(t, e) {
  if (gr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: nt.PrincipalContract,
    value: `${il(t)}.${e.content}`
  };
}
function AS(t) {
  return { type: nt.ResponseErr, value: t };
}
function ES(t) {
  return { type: nt.ResponseOk, value: t };
}
const IS = (t) => ({ type: nt.StringASCII, value: t }), $S = (t) => ({ type: nt.StringUTF8, value: t });
function CS(t) {
  for (const e in t)
    if (!KS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: nt.Tuple, value: t };
}
function $e(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new gt(st(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new gt(t) : e = t;
  switch (e.readUInt8Enum(Lt, (r) => {
    throw new Ft(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Lt.int:
      return Qm(Ha(e.readBytes(16)));
    case Lt.uint:
      return Jm(e.readBytes(16));
    case Lt.buffer:
      const r = e.readUInt32BE();
      return Xm(e.readBytes(r));
    case Lt.true:
      return qm();
    case Lt.false:
      return Ym();
    case Lt.address:
      const s = Xr(e);
      return mS(s);
    case Lt.contract:
      const i = Xr(e), o = oe(e);
      return Ud(i, o);
    case Lt.ok:
      return ES($e(e));
    case Lt.err:
      return AS($e(e));
    case Lt.none:
      return $d();
    case Lt.some:
      return Cd($e(e));
    case Lt.list:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push($e(e));
      return tS(c);
    case Lt.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = oe(e).content;
        if (A === void 0)
          throw new Ft('"content" is undefined');
        f[A] = $e(e);
      }
      return CS(f);
    case Lt.ascii:
      const l = e.readUInt32BE(), g = C2(e.readBytes(l));
      return IS(g);
    case Lt.utf8:
      const h = e.readUInt32BE(), b = zs(e.readBytes(h));
      return $S(b);
    default:
      throw new Ft("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ne(t, e) {
  return $t([tl(t), e]);
}
function vS(t) {
  return new Uint8Array([tl(t.type)]);
}
function LS(t) {
  return t.type === nt.OptionalNone ? new Uint8Array([tl(t.type)]) : Ne(t.type, Le(t.value));
}
function BS(t) {
  const e = new Uint8Array(4);
  return Zn(e, Math.ceil(t.value.length / 2), 0), Ne(t.type, _e(e, st(t.value)));
}
function HS(t) {
  const e = Hc(S2(BigInt(t.value), BigInt(Gx)), bd);
  return Ne(t.type, e);
}
function _S(t) {
  const e = Hc(BigInt(t.value), bd);
  return Ne(t.type, e);
}
function MS(t) {
  return Ne(t.type, Ks(Pn(t.value)));
}
function US(t) {
  const [e, n] = WS(t.value);
  return Ne(t.type, _e(Ks(Pn(e)), Zr(be(n))));
}
function NS(t) {
  return Ne(t.type, Le(t.value));
}
function TS(t) {
  const e = [], n = new Uint8Array(4);
  Zn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Le(r);
    e.push(s);
  }
  return Ne(t.type, $t(e));
}
function PS(t) {
  const e = [], n = new Uint8Array(4);
  Zn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = be(s);
    e.push(Zr(i));
    const o = Le(t.value[s]);
    e.push(o);
  }
  return Ne(t.type, $t(e));
}
function Nd(t, e) {
  const n = [], r = e == "ascii" ? $2(t.value) : gr(t.value), s = new Uint8Array(4);
  return Zn(s, r.length, 0), n.push(s), n.push(r), Ne(t.type, $t(n));
}
function kS(t) {
  return Nd(t, "ascii");
}
function DS(t) {
  return Nd(t, "utf8");
}
function OS(t) {
  return z(Le(t));
}
function Le(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return vS(t);
    case nt.OptionalNone:
    case nt.OptionalSome:
      return LS(t);
    case nt.Buffer:
      return BS(t);
    case nt.UInt:
      return _S(t);
    case nt.Int:
      return HS(t);
    case nt.PrincipalStandard:
      return MS(t);
    case nt.PrincipalContract:
      return US(t);
    case nt.ResponseOk:
    case nt.ResponseErr:
      return NS(t);
    case nt.List:
      return TS(t);
    case nt.Tuple:
      return PS(t);
    case nt.StringASCII:
      return kS(t);
    case nt.StringUTF8:
      return DS(t);
    default:
      throw new Mr("Unable to serialize. Invalid Clarity Value.");
  }
}
const FS = (t) => t.length % 2 ? `0${t}` : t, jS = (t, e) => t.padEnd(e, "0"), Td = (t, e) => t ? gr(t).length > e : !1;
function nc(t) {
  return fd(t);
}
const Ms = (t) => mm(Zc(t)), ol = (t) => z(Wm(t)), zS = (t) => z(Ms(t)), RS = (t) => {
  const e = Ms(t), n = _e(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ms(n);
  return z(r);
}, VS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = Ms(r);
  return z(s);
}, GS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = Zc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = $t(i), a = Ms(o);
  return z(a);
};
function KS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function WS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
It.hmacSha256Sync = (t, ...e) => {
  const n = md.create(Zc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function as(t) {
  return t = typeof t == "string" ? st(t) : t, {
    type: U.PublicKey,
    data: t
  };
}
function qS(t, e, n = mt.Compressed) {
  const r = H2(e), s = new ne(wu(r.r), wu(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === mt.Compressed;
  return i.toHex(o);
}
function YS(t) {
  return typeof t == "string" ? t : z(t);
}
const al = YS;
function Pd(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === B2;
}
function cs(t) {
  return !al(t).startsWith("04");
}
function XS(t) {
  t = _c(t);
  const e = Pd(t);
  return z(Rs(t.slice(0, 32), e));
}
function ZS(t) {
  return J.fromHex(al(t)).toHex(!0);
}
function QS(t) {
  return J.fromHex(al(t)).toHex(!1);
}
function JS(t, e) {
  t = _c(t);
  const [n, r] = mo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return js(r, 1) + ne.fromHex(n).toCompactHex();
}
function cl() {
  return {
    type: U.MessageSignature,
    data: z(new Uint8Array(Ho))
  };
}
function kd(t, e, n, r) {
  const s = sl(0, t, 1, [as(e)]).hash160, i = cs(e) ? mt.Compressed : mt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Pt(n),
    fee: Pt(r),
    keyEncoding: i,
    signature: cl()
  };
}
function Us(t) {
  return "signature" in t;
}
function wf(t) {
  return t === ft.P2SH || t === ft.P2WSH;
}
function t3(t) {
  return t === ft.P2SHNonSequential || t === ft.P2WSHNonSequential;
}
function xf(t) {
  const e = nc(t);
  return e.nonce = 0, e.fee = 0, Us(e) ? e.signature = cl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function e3(t) {
  const e = [
    t.hashMode,
    st(t.signer),
    Mn(t.nonce, 8),
    Mn(t.fee, 8),
    t.keyEncoding,
    rl(t.signature)
  ];
  return $t(e);
}
function n3(t) {
  const e = [
    t.hashMode,
    st(t.signer),
    Mn(t.nonce, 8),
    Mn(t.fee, 8)
  ], n = el(t.fields);
  e.push(nl(n));
  const r = new Uint8Array(2);
  return M2(r, t.signaturesRequired, 0), e.push(r), $t(e);
}
function r3(t, e) {
  const n = z(e.readBytes(20)), r = BigInt(`0x${z(e.readBytes(8))}`), s = BigInt(`0x${z(e.readBytes(8))}`), i = e.readUInt8Enum(mt, (a) => {
    throw new Ft(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ft.P2WPKH && i != mt.Compressed)
    throw new Ft("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ja(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function s3(t, e) {
  const n = z(e.readBytes(20)), r = BigInt("0x" + z(e.readBytes(8))), s = BigInt("0x" + z(e.readBytes(8))), i = Hd(e, U.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case U.PublicKey:
        cs(u.contents.data) || (o = !0);
        break;
      case U.MessageSignature:
        if (u.pubKeyEncoding === mt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Vn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ft.P2WSH || t === ft.P2WSHNonSequential))
    throw new Vn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function pa(t) {
  return Us(t) ? e3(t) : n3(t);
}
function ba(t) {
  const e = t.readUInt8Enum(ft, (n) => {
    throw new Ft(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ft.P2PKH || e === ft.P2WPKH ? r3(e, t) : s3(e, t);
}
function Dd(t, e, n, r) {
  const i = t + z(new Uint8Array([e])) + z(Mn(n, 8)) + z(Mn(r, 8));
  if (st(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ol(st(i));
}
function Od(t, e, n) {
  const r = 33 + Ho, s = cs(e.data) ? mt.Compressed : mt.Uncompressed, i = t + FS(s.toString(16)) + n, o = st(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ol(o);
}
function i3(t, e, n, r, s) {
  const i = Dd(t, e, n, r), o = JS(s, i), a = as(XS(s)), c = Od(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Fd(t, e, n, r, s, i) {
  const o = Dd(t, e, n, r), a = as(qS(o, i, s)), c = Od(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function o3() {
  const t = kd(ft.P2PKH, "", 0, 0);
  return t.signer = eS().hash160, t.keyEncoding = mt.Compressed, t.signature = cl(), t;
}
function mf(t, e, n) {
  return Us(t) ? a3(t, e, n) : c3(t, e, n);
}
function a3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Fd(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = sl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Vn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function c3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case U.PublicKey:
        cs(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case U.MessageSignature:
        c.pubKeyEncoding === mt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Fd(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (wf(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Vn("Too many signatures");
        break;
    }
  if (wf(t.hashMode) && o !== t.signaturesRequired || t3(t.hashMode) && o < t.signaturesRequired)
    throw new Vn("Incorrect number of signatures");
  if (i && (t.hashMode === ft.P2WSH || t.hashMode === ft.P2WSHNonSequential))
    throw new Vn("Uncompressed keys are not allowed in this hash mode");
  const a = sl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Vn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function jd(t) {
  return {
    authType: At.Standard,
    spendingCondition: t
  };
}
function zd(t, e) {
  return {
    authType: At.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || kd(ft.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Sf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case At.Standard:
        return jd(xf(t.spendingCondition));
      case At.Sponsored:
        return zd(xf(t.spendingCondition), o3());
      default:
        throw new ro("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function l3(t, e) {
  switch (t.authType) {
    case At.Standard:
      return mf(t.spendingCondition, e, At.Standard);
    case At.Sponsored:
      return mf(t.spendingCondition, e, At.Standard);
    default:
      throw new ro("Invalid origin auth type");
  }
}
function u3(t, e) {
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
function f3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Pt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function h3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Pt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function d3(t, e) {
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
function g3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case At.Standard:
      e.push(pa(t.spendingCondition));
      break;
    case At.Sponsored:
      e.push(pa(t.spendingCondition)), e.push(pa(t.sponsorSpendingCondition));
      break;
  }
  return $t(e);
}
function p3(t) {
  const e = t.readUInt8Enum(At, (r) => {
    throw new Ft(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case At.Standard:
      return n = ba(t), jd(n);
    case At.Sponsored:
      n = ba(t);
      const r = ba(t);
      return zd(n, r);
  }
}
class b3 {
  constructor({ auth: e, payload: n, postConditions: r = el([]), postConditionMode: s = no.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = zx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Pt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Qt.Any;
  }
  signBegin() {
    const e = nc(this);
    return e.auth = Sf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = nc(this);
    return e.auth = Sf(e.auth), e.txid();
  }
  verifyOrigin() {
    return l3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : as(e), r = this.auth.spendingCondition;
    if (r && !Us(r)) {
      const s = cs(n.data);
      r.fields.push(Ur(s ? mt.Compressed : mt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = i3(n, r, e.fee, e.nonce, s);
    if (Us(e))
      e.signature = Za(i);
    else {
      const a = Pd(s);
      e.fields.push(Ur(a ? mt.Compressed : mt.Uncompressed, Za(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return ol(e);
  }
  setSponsor(e) {
    if (this.auth.authType != At.Sponsored)
      throw new ro("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d3(this.auth, e);
  }
  setFee(e) {
    this.auth = u3(this.auth, e);
  }
  setNonce(e) {
    this.auth = f3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != At.Sponsored)
      throw new ro("Cannot sponsor sign a non-sponsored transaction");
    this.auth = h3(this.auth, e);
  }
  serialize() {
    return z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Mr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Mr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Mr('"auth" is undefined');
    if (this.payload === void 0)
      throw new Mr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Zn(n, this.chainId, 0), e.push(n), e.push(g3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(nl(this.postConditions)), e.push(Md(this.payload)), $t(e);
  }
}
function y3(t) {
  const e = Xt(t, gt) ? t : new gt(t), n = e.readUInt8Enum(ir, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = p3(e), i = e.readUInt8Enum(Qt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(no, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Hd(e, U.PostCondition), c = pS(e), u = new b3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Af = BigInt("18446744073709551615");
function ya(t) {
  const e = Pt(t);
  if (e < 0n || e > Af)
    throw new RangeError(`Post-condition amount must be between 0 and ${Af} (u64 max), received: ${e}`);
  return e;
}
var rc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(rc || (rc = {}));
var sc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(sc || (sc = {}));
function w3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.STX,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Gt.Origin } : ms(t.address),
        conditionCode: $i(t.condition),
        amount: ya(t.amount)
      };
    case "ft-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.Fungible,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Gt.Origin } : ms(t.address),
        conditionCode: $i(t.condition),
        amount: ya(t.amount),
        asset: yf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.NonFungible,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Gt.Origin } : ms(t.address),
        conditionCode: $i(t.condition),
        asset: yf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.Staking,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Gt.Origin } : ms(t.address),
        conditionCode: $i(t.condition),
        amount: ya(t.amount)
      };
    case "pox-postcondition":
      return {
        type: U.PostCondition,
        conditionType: bt.PoX,
        principal: t.address === "origin" ? { type: U.Principal, prefix: Gt.Origin } : ms(t.address),
        conditionCode: x3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function $i(t) {
  return rc[t];
}
function x3(t) {
  return sc[t];
}
function Rd(t) {
  const e = w3(t);
  return dS(e);
}
function m3(t, e, n) {
  return ul(Vd(t), n);
}
function Vd(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ns(r);
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
    return BigInt(`0x${E3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ll(t, e = 8) {
  return (typeof t == "bigint" ? t : Vd(t)).toString(16).padStart(e * 2, "0");
}
function ul(t, e = 16) {
  const n = ll(t, e);
  return Ns(n);
}
function S3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const A3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function E3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += A3[n];
  return e;
}
function Ns(t) {
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
function fl(t) {
  return new TextEncoder().encode(t);
}
function I3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function $3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ef(t) {
  if (t.some($3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function hl(...t) {
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
function Xe(t) {
  return hl(...t.map((e) => typeof e == "number" ? Ef([e]) : e instanceof Array ? Ef(e) : e));
}
function Uo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ic;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ic || (ic = {}));
ic.Mainnet;
const C3 = 128, v3 = 128, Gd = 16;
var oc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(oc || (oc = {}));
var If;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(If || (If = {}));
var $f;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})($f || ($f = {}));
var ue;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ue || (ue = {}));
const wa = ["onChainOnly", "offChainOnly", "any"];
wa[0] + "", ue.OnChainOnly, wa[1] + "", ue.OffChainOnly, wa[2] + "", ue.Any, ue.OnChainOnly + "", ue.OnChainOnly, ue.OffChainOnly + "", ue.OffChainOnly, ue.Any + "", ue.Any;
var ac;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ac || (ac = {}));
ac.Mainnet;
var Cf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Cf || (Cf = {}));
var Fn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fn || (Fn = {}));
var vf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(vf || (vf = {}));
var Lf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Lf || (Lf = {}));
var Bf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Bf || (Bf = {}));
var Hf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Hf || (Hf = {}));
var _f;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(_f || (_f = {}));
var Mf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Mf || (Mf = {}));
var cc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(cc || (cc = {}));
var Uf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Uf || (Uf = {}));
var Nf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Nf || (Nf = {}));
function lc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function L3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function B3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  lc(t.outputLen), lc(t.blockLen);
}
function H3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _3(t, e) {
  Kd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xa = {
  number: lc,
  bool: L3,
  bytes: Kd,
  hash: B3,
  exists: H3,
  output: _3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ma = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ae = (t, e) => t << 32 - e | t >>> e, M3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!M3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function U3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wd(t) {
  if (typeof t == "string" && (t = U3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let N3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function xr(t) {
  const e = (r) => t().update(Wd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function T3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let dl = class extends N3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ma(this.buffer);
  }
  update(e) {
    xa.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Wd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ma(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xa.exists(this), xa.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    T3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ma(e), c = this.outputLen;
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
const P3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qd = Uint8Array.from({ length: 16 }, (t, e) => e), k3 = qd.map((t) => (9 * t + 5) % 16);
let gl = [qd], pl = [k3];
for (let t = 0; t < 4; t++)
  for (let e of [gl, pl])
    e.push(e[t].map((n) => P3[n]));
const Yd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), D3 = gl.map((t, e) => t.map((n) => Yd[e][n])), O3 = pl.map((t, e) => t.map((n) => Yd[e][n])), F3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ci = (t, e) => t << e | t >>> 32 - e;
function Tf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const vi = new Uint32Array(16);
let z3 = class extends dl {
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
      const b = 4 - h, y = F3[h], A = j3[h], v = gl[h], L = pl[h], p = D3[h], E = O3[h];
      for (let S = 0; S < 16; S++) {
        const T = Ci(r + Tf(h, i, a, u) + vi[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = Ci(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = Ci(s + Tf(b, o, c, f) + vi[L[S]] + A, E[S]) + g | 0;
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
};
xr(() => new z3());
const R3 = (t, e, n) => t & e ^ ~t & n, V3 = (t, e, n) => t & e ^ t & n ^ e & n, G3 = new Uint32Array([
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
]), pn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), bn = new Uint32Array(64);
let Xd = class extends dl {
  constructor() {
    super(64, 32, 8, !1), this.A = pn[0] | 0, this.B = pn[1] | 0, this.C = pn[2] | 0, this.D = pn[3] | 0, this.E = pn[4] | 0, this.F = pn[5] | 0, this.G = pn[6] | 0, this.H = pn[7] | 0;
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
      bn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = bn[l - 15], h = bn[l - 2], b = Ae(g, 7) ^ Ae(g, 18) ^ g >>> 3, y = Ae(h, 17) ^ Ae(h, 19) ^ h >>> 10;
      bn[l] = y + bn[l - 7] + b + bn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ae(a, 6) ^ Ae(a, 11) ^ Ae(a, 25), h = f + g + R3(a, c, u) + G3[l] + bn[l] | 0, y = (Ae(r, 2) ^ Ae(r, 13) ^ Ae(r, 22)) + V3(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    bn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, K3 = class extends Xd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
xr(() => new Xd());
xr(() => new K3());
const Li = BigInt(2 ** 32 - 1), uc = BigInt(32);
function Zd(t, e = !1) {
  return e ? { h: Number(t & Li), l: Number(t >> uc & Li) } : { h: Number(t >> uc & Li) | 0, l: Number(t & Li) | 0 };
}
function W3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Zd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const q3 = (t, e) => BigInt(t >>> 0) << uc | BigInt(e >>> 0), Y3 = (t, e, n) => t >>> n, X3 = (t, e, n) => t << 32 - n | e >>> n, Z3 = (t, e, n) => t >>> n | e << 32 - n, Q3 = (t, e, n) => t << 32 - n | e >>> n, J3 = (t, e, n) => t << 64 - n | e >>> n - 32, t4 = (t, e, n) => t >>> n - 32 | e << 64 - n, e4 = (t, e) => e, n4 = (t, e) => t, r4 = (t, e, n) => t << n | e >>> 32 - n, s4 = (t, e, n) => e << n | t >>> 32 - n, i4 = (t, e, n) => e << n - 32 | t >>> 64 - n, o4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function a4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const c4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), l4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, u4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), f4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, h4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), d4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: Zd,
  split: W3,
  toBig: q3,
  shrSH: Y3,
  shrSL: X3,
  rotrSH: Z3,
  rotrSL: Q3,
  rotrBH: J3,
  rotrBL: t4,
  rotr32H: e4,
  rotr32L: n4,
  rotlSH: r4,
  rotlSL: s4,
  rotlBH: i4,
  rotlBL: o4,
  add: a4,
  add3L: c4,
  add3H: l4,
  add4L: u4,
  add4H: f4,
  add5H: d4,
  add5L: h4
}, [g4, p4] = X.split([
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
].map((t) => BigInt(t))), yn = new Uint32Array(80), wn = new Uint32Array(80);
let No = class extends dl {
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
      yn[p] = e.getUint32(n), wn[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = yn[p - 15] | 0, S = wn[p - 15] | 0, T = X.rotrSH(E, S, 1) ^ X.rotrSH(E, S, 8) ^ X.shrSH(E, S, 7), O = X.rotrSL(E, S, 1) ^ X.rotrSL(E, S, 8) ^ X.shrSL(E, S, 7), H = yn[p - 2] | 0, N = wn[p - 2] | 0, w = X.rotrSH(H, N, 19) ^ X.rotrBH(H, N, 61) ^ X.shrSH(H, N, 6), I = X.rotrSL(H, N, 19) ^ X.rotrBL(H, N, 61) ^ X.shrSL(H, N, 6), _ = X.add4L(O, I, wn[p - 7], wn[p - 16]), F = X.add4H(_, T, w, yn[p - 7], yn[p - 16]);
      yn[p] = F | 0, wn[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = X.rotrSH(l, g, 14) ^ X.rotrSH(l, g, 18) ^ X.rotrBH(l, g, 41), S = X.rotrSL(l, g, 14) ^ X.rotrSL(l, g, 18) ^ X.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = X.add5L(L, S, O, p4[p], wn[p]), N = X.add5H(H, v, E, T, g4[p], yn[p]), w = H | 0, I = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), _ = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = X.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = X.add3L(w, _, G);
      r = X.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = X.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = X.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = X.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = X.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = X.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    yn.fill(0), wn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, b4 = class extends No {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, y4 = class extends No {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, w4 = class extends No {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
xr(() => new No());
xr(() => new b4());
xr(() => new y4());
xr(() => new w4());
function x4(t, e, n) {
  const s = C3;
  if (T4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: oc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Bt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Bt || (Bt = {}));
let m4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Qd = class extends m4 {
  constructor(e) {
    super(e);
  }
};
function To(t) {
  const e = [];
  return e.push(Ns(ll(t.version, 1))), e.push(Ns(t.hash160)), Xe(e);
}
function S4(t) {
  const e = [];
  return e.push(t.prefix), e.push(To(t.address)), t.prefix === cc.Contract && e.push(Ts(t.contractName)), Xe(e);
}
function Ts(t) {
  const e = [], n = fl(t.content), r = n.byteLength;
  return e.push(Ns(ll(r, t.lengthPrefixBytes))), e.push(n), Xe(e);
}
function A4(t) {
  const e = [];
  return e.push(To(t.address)), e.push(Ts(t.contractName)), e.push(Ts(t.assetName)), Xe(e);
}
function Jd(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(S4(t.principal)), (t.conditionType === Fn.Fungible || t.conditionType === Fn.NonFungible) && e.push(A4(t.assetInfo)), t.conditionType === Fn.NonFungible && e.push(ls(t.assetName)), e.push(t.conditionCode), t.conditionType === Fn.STX || t.conditionType === Fn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Qd("The post-condition amount may not be larger than 8 bytes");
    e.push(m3(t.amount, !1, 8));
  }
  return Xe(e);
}
function Te(t, e) {
  return Xe([t, e]);
}
function E4(t) {
  return new Uint8Array([t.type]);
}
function I4(t) {
  return t.type === Bt.OptionalNone ? new Uint8Array([t.type]) : Te(t.type, ls(t.value));
}
function $4(t) {
  const e = new Uint8Array(4);
  return Uo(e, t.buffer.length, 0), Te(t.type, hl(e, t.buffer));
}
function C4(t) {
  const e = ul(S3(t.value, BigInt(v3)), Gd);
  return Te(t.type, e);
}
function v4(t) {
  const e = ul(t.value, Gd);
  return Te(t.type, e);
}
function L4(t) {
  return Te(t.type, To(t.address));
}
function B4(t) {
  return Te(t.type, hl(To(t.address), Ts(t.contractName)));
}
function H4(t) {
  return Te(t.type, ls(t.value));
}
function _4(t) {
  const e = [], n = new Uint8Array(4);
  Uo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ls(r);
    e.push(s);
  }
  return Te(t.type, Xe(e));
}
function M4(t) {
  const e = [], n = new Uint8Array(4);
  Uo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = x4(s);
    e.push(Ts(i));
    const o = ls(t.data[s]);
    e.push(o);
  }
  return Te(t.type, Xe(e));
}
function tg(t, e) {
  const n = [], r = e == "ascii" ? I3(t.data) : fl(t.data), s = new Uint8Array(4);
  return Uo(s, r.length, 0), n.push(s), n.push(r), Te(t.type, Xe(n));
}
function U4(t) {
  return tg(t, "ascii");
}
function N4(t) {
  return tg(t, "utf8");
}
function ls(t) {
  switch (t.type) {
    case Bt.BoolTrue:
    case Bt.BoolFalse:
      return E4(t);
    case Bt.OptionalNone:
    case Bt.OptionalSome:
      return I4(t);
    case Bt.Buffer:
      return $4(t);
    case Bt.UInt:
      return v4(t);
    case Bt.Int:
      return C4(t);
    case Bt.PrincipalStandard:
      return L4(t);
    case Bt.PrincipalContract:
      return B4(t);
    case Bt.ResponseOk:
    case Bt.ResponseErr:
      return H4(t);
    case Bt.List:
      return _4(t);
    case Bt.Tuple:
      return M4(t);
    case Bt.StringASCII:
      return U4(t);
    case Bt.StringUTF8:
      return N4(t);
    default:
      throw new Qd("Unable to serialize. Invalid Clarity Value.");
  }
}
const T4 = (t, e) => t ? fl(t).length > e : !1, P4 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function k4(t, e) {
  const n = {};
  return Object.assign(n, P4, e), await fetch(t, n);
}
function D4(t) {
  let e = k4, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function O4(...t) {
  const { fetchLib: e, middlewares: n } = D4(t);
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
var Qr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Qr || (Qr = {}));
var ar;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ar || (ar = {}));
var Pf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pf || (Pf = {}));
const F4 = "https://api.mainnet.hiro.so", j4 = "https://api.testnet.hiro.so", z4 = "http://localhost:3999", R4 = ["mainnet", "testnet", "devnet", "mocknet"];
class ye {
  constructor(e) {
    this.version = ar.Mainnet, this.chainId = Qr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ar.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? O4();
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
ye.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new us();
    case "testnet":
      return new eg();
    case "devnet":
      return new V4();
    case "mocknet":
      return new ng();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${R4.join(", ")}`);
  }
};
ye.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ye.fromName(t);
class us extends ye {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? F4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ar.Mainnet, this.chainId = Qr.Mainnet;
  }
}
class eg extends ye {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? j4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ar.Testnet, this.chainId = Qr.Testnet;
  }
}
class ng extends ye {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? z4,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ar.Testnet, this.chainId = Qr.Testnet;
  }
}
const V4 = ng, G4 = "connect-ui";
let Fi, rg, Jt = !1, fc = !1;
const Ke = (t, e = "") => () => {
}, K4 = (t, e) => () => {
}, W4 = "{visibility:hidden}.hydrated{visibility:inherit}", kf = {}, q4 = "http://www.w3.org/2000/svg", Y4 = "http://www.w3.org/1999/xhtml", X4 = (t) => t != null, bl = (t) => (t = typeof t, t === "object" || t === "function");
function sg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const V = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !bl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? hc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = hc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, hc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, Z4 = {}, Q4 = (t) => t && t.$tag$ === Z4, J4 = (t, e) => t != null && !bl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, tA = (t) => fs(t).$hostElement$, eA = (t, e, n) => {
  const r = Tt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Df = /* @__PURE__ */ new WeakMap(), nA = (t, e, n) => {
  let r = so.get(t);
  AA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, so.set(t, r);
}, rA = (t, e, n, r) => {
  var s;
  let i = ig(e);
  const o = so.get(i);
  if (t = t.nodeType === 11 ? t : Be, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Df.get(t), c;
      if (a || Df.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Be.createElement("style"), c.innerHTML = o;
          const u = (s = Tt.$nonce$) !== null && s !== void 0 ? s : sg(Be);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, sA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ke("attachStyles", e.$tagName$), i = rA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ig = (t, e) => "sc-" + t.$tagName$, Of = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = jf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Ff(n), f = Ff(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : jf(Po, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Tt.rel(t, e, n, !1), r && Tt.ael(t, e, r, !1);
    else {
      const c = bl(r);
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
}, iA = /\s/, Ff = (t) => t ? t.split(iA) : [], og = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || kf, o = e.$attrs$ || kf;
  for (r in i)
    r in o || Of(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Of(s, r, i[r], o[r], n, e.$flags$);
}, yl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Be.createTextNode(s.$text$);
  else {
    if (Jt || (Jt = s.$tag$ === "svg"), o = s.$elm$ = Be.createElementNS(Jt ? q4 : Y4, s.$tag$), Jt && s.$tag$ === "foreignObject" && (Jt = !1), og(null, s, Jt), X4(Fi) && o["s-si"] !== Fi && o.classList.add(o["s-si"] = Fi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = yl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Jt = !1 : o.tagName === "foreignObject" && (Jt = !0);
  }
  return o;
}, ag = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === rg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = yl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, cg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, oA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : Bi(a, f) ? (As(a, f), a = e[++s], f = r[++i]) : Bi(c, l) ? (As(c, l), c = e[--o], l = r[--u]) : Bi(a, l) ? (As(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Bi(c, f) ? (As(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = yl(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? ag(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && cg(e, s, o);
}, Bi = (t, e) => t.$tag$ === e.$tag$, As = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Jt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Jt, og(t, e, Jt), r !== null && s !== null ? oA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), ag(n, null, e, s, 0, s.length - 1)) : r !== null && cg(r, 0, r.length - 1), Jt && i === "svg" && (Jt = !1)) : t.$text$ !== o && (n.data = o);
}, aA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || hc(null, null), s = Q4(e) ? e : V(null, null, e);
  rg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Fi = n["s-sc"], As(r, s);
}, lg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, wl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return lg(t, t.$ancestorComponent$), IA(() => cA(t, e));
}, cA = (t, e) => {
  const n = Ke("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), hA(s, () => lA(t, r, e));
}, lA = async (t, e, n) => {
  const r = t.$hostElement$, s = Ke("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && sA(t);
  const o = Ke("render", t.$cmpMeta$.$tagName$);
  uA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => fA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, uA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, aA(t, e);
  } catch (r) {
    Ps(r, t.$hostElement$);
  }
  return null;
}, fA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ke("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, fg(n), r(), t.$onReadyResolve$(n), s || ug()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && ml(() => wl(t, !1)), t.$flags$ &= -517;
}, ug = (t) => {
  fg(Be.documentElement), ml(() => eA(Po, "appload", { detail: { namespace: G4 } }));
}, hA = (t, e) => t && t.then ? t.then(e) : e(), fg = (t) => t.classList.add("hydrated"), dA = (t, e) => fs(t).$instanceValues$.get(e), gA = (t, e, n, r) => {
  const s = fs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = J4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && wl(s, !1));
}, hg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return dA(this, i);
        },
        set(a) {
          gA(this, i, a, e);
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
}, pA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = SA(n), s.then) {
        const c = K4();
        s = await s, c();
      }
      s.isProxied || (hg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ke("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ps(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = ig(n);
      if (!so.has(c)) {
        const u = Ke("registerStyles", n.$tagName$);
        nA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => wl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, bA = (t) => {
  if (!(Tt.$flags$ & 1)) {
    const e = fs(t), n = e.$cmpMeta$, r = Ke("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            lg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), pA(t, e, n);
    }
    r();
  }
}, yA = (t) => {
  Tt.$flags$ & 1 || fs(t);
}, wA = (t, e = {}) => {
  var n;
  const r = Ke(), s = [], i = e.exclude || [], o = Po.customElements, a = Be.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Be.createElement("style"), f = [];
  let l, g = !0;
  Object.assign(Tt, e), Tt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Be.baseURI).href, t.map((h) => {
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
          super(L), L = this, mA(L, y), y.$flags$ & 1 && L.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? f.push(this) : Tt.jmp(() => bA(this));
        }
        disconnectedCallback() {
          Tt.jmp(() => yA(this));
        }
        componentOnReady() {
          return fs(this).$onReadyPromise$;
        }
      };
      y.$lazyBundleId$ = h[0], !i.includes(A) && !o.get(A) && (s.push(A), o.define(A, hg(
        v,
        y,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + W4, u.setAttribute("data-styles", "");
    const h = (n = Tt.$nonce$) !== null && n !== void 0 ? n : sg(Be);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Tt.jmp(() => l = setTimeout(ug, 30)), r();
}, xl = /* @__PURE__ */ new WeakMap(), fs = (t) => xl.get(t), xA = (t, e) => xl.set(e.$lazyInstance$ = t, e), mA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], xl.set(t, n);
}, jf = (t, e) => e in t, Ps = (t, e) => (0, console.error)(t, e), Sa = /* @__PURE__ */ new Map(), SA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Sa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Sa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => C6).then(o, Ps);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Sa.set(s, o), o[r]), Ps);
}, so = /* @__PURE__ */ new Map(), Po = typeof window < "u" ? window : {}, Be = Po.document || { head: {} }, Tt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, dg = (t) => Promise.resolve(t), AA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), zf = [], gg = [], EA = (t, e) => (n) => {
  t.push(n), fc || (fc = !0, Tt.$flags$ & 4 ? ml(dc) : Tt.raf(dc));
}, Rf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ps(n);
    }
  t.length = 0;
}, dc = () => {
  Rf(zf), Rf(gg), (fc = zf.length > 0) && Tt.raf(dc);
}, ml = (t) => dg().then(t), IA = /* @__PURE__ */ EA(gg), $A = () => dg(), pg = (t, e) => typeof window > "u" ? Promise.resolve() : $A().then(() => wA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var CA = Object.defineProperty, vA = Object.defineProperties, LA = Object.getOwnPropertyDescriptors, io = Object.getOwnPropertySymbols, bg = Object.prototype.hasOwnProperty, yg = Object.prototype.propertyIsEnumerable, Vf = (t, e, n) => e in t ? CA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Ue = (t, e) => {
  for (var n in e || (e = {})) bg.call(e, n) && Vf(t, n, e[n]);
  if (io) for (var n of io(e)) yg.call(e, n) && Vf(t, n, e[n]);
  return t;
}, Un = (t, e) => vA(t, LA(e)), BA = (t, e) => {
  var n = {};
  for (var r in t) bg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && io) for (var r of io(t)) e.indexOf(r) < 0 && yg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Sl() {
  return Bo(pe()) || window.StacksProvider || window.BlockstackProvider;
}
function Al(t) {
  return t ? typeof t == "string" ? rr.fromName(t) : "version" in t ? t : "url" in t ? new ja({ url: t.url }) : t.transactionVersion === ir.Mainnet ? new ja({ url: t.client.baseUrl }) : new za({ url: t.client.baseUrl }) : new za();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var HA = (t) => {
  if (!t) {
    let e = new wo(["store_write"], document.location.href);
    t = new _s({ appConfig: e });
  }
  return t;
}, _A = async (t, e = Sl()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: a, appDetails: c } = t, u = HA(a);
  u.isUserSignedIn() && u.signUserOut();
  let f = u.generateAndStoreTransitKey(), l = u.makeAuthRequest(f, `${document.location.origin}${n}`, `${document.location.origin}${r}`, u.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: c, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await u.handlePendingSignIn(g);
    let h = kt.decodeToken(g), b = h == null ? void 0 : h.payload;
    s == null || s({ authResponse: g, authResponsePayload: b, userSession: u });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), i == null || i();
  }
}, MA = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(MA || {}), UA = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(UA || {}), El = (t) => {
  let e = t;
  if (!e) {
    let n = new wo(["store_write"], document.location.href);
    e = new _s({ appConfig: n });
  }
  return e;
};
function NA(t) {
  try {
    return El(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var TA = (t) => {
  let e = El(t).loadUserData().appPrivateKey, n = kt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function PA(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [sr.Mainnet]: "mainnet", [sr.Testnet]: "testnet" }, a = Al(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function kA(t) {
  let e = Al(t.network), n = El(t.userSession), r = Un(Ue({}, t), { network: e, userSession: n });
  return Ue({ stxAddress: PA(r) }, r);
}
async function DA(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Rd) : n = n.map((r) => z(Jd(r)))), new kt.TokenSigner("ES256k", e).signAsync(Un(Ue({}, t), { postConditions: n }));
}
function OA(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Rd) : e = e.map((n) => z(Jd(n)))), kt.createUnsecuredToken(Un(Ue({}, t), { postConditions: e }));
}
var FA = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = st(a.replace(/^0x/, "")), u = y3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Un(Ue({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Un(Ue({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, jA = async (t) => {
  let e = t, { functionArgs: n, appDetails: r, userSession: s } = e, i = BA(e, ["functionArgs", "appDetails", "userSession"]), o = n.map((c) => typeof c == "string" ? c : typeof c.type == "string" ? OS(c) : z(ls(c)));
  if (NA(s)) {
    let { privateKey: c, publicKey: u } = TA(s), f = Un(Ue({}, i), { functionArgs: o, txType: "contract_call", publicKey: u });
    return r && (f.appDetails = r), DA(f, c);
  }
  let a = Un(Ue({}, i), { functionArgs: o, txType: "contract_call" });
  return r && (a.appDetails = r), OA(a);
};
async function zA(t, e, n) {
  let r = await e(Un(Ue(Ue({}, kA(t)), t), { network: Al(t.network) }));
  return FA({ token: r, options: t }, n);
}
function RA(t, e = Sl()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return zA(t, jA, e);
}
var VA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(VA || {}), wg = "asigna-stx", Gf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === wg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(KA(t, e), "*");
}), GA = { authenticationRequest: async (t) => Gf(t, "authenticationRequest"), transactionRequest: async (t) => Gf(t, "transactionRequest") }, KA = (t, e) => ({ source: wg, [e]: t }), WA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = GA);
};
WA();
var xg = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function mg(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = pe(), o = Sl();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    pg();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : xg, c = Bx(a), u = document.createElement("connect-modal");
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
var qA = mg(_A, !1), Kf = mg(RA), YA = dd;
function Nn(t, e, n) {
  return Il(_t(t, e), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xt(r);
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
      const r = QA(BigInt(`0x${et(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${et(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Wf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ws(t, e = 8) {
  return (typeof t == "bigint" ? t : _t(t, !1)).toString(16).padStart(e * 2, "0");
}
function ko(t) {
  return parseInt(t, 16);
}
function Il(t, e = 16) {
  const n = Ws(t, e);
  return xt(n);
}
function XA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function ZA(t, e) {
  return t & BigInt(1) << e;
}
function QA(t, e) {
  return ZA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const JA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function et(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += JA[n];
  return e;
}
function xt(t) {
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
function hs(t) {
  return new TextEncoder().encode(t);
}
function $l(t) {
  return new TextDecoder().decode(t);
}
function Sg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function t8(t) {
  return String.fromCharCode.apply(null, t);
}
function e8(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function qf(t) {
  if (t.some(e8))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Do(...t) {
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
  return Do(...t.map((e) => typeof e == "number" ? qf([e]) : e instanceof Array ? qf(e) : e));
}
var Yf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yf || (Yf = {}));
var Xf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xf || (Xf = {}));
var Zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zf || (Zf = {}));
const Ag = 33, Aa = 32;
function n8(t) {
  if (t.length < Aa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Aa * 2), r = t.slice(2 + Aa * 2);
  return {
    recoveryId: ko(e),
    r: n,
    s: r
  };
}
function r8(t) {
  const e = typeof t == "string" ? xt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function s8(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function i8(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function o8(t, e) {
  return t[e];
}
function a8(t, e, n = 0) {
  return t[n] = e, t;
}
function c8(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function cr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var gc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(gc || (gc = {}));
const l8 = gc.Mainnet, u8 = 128, f8 = 128, Eg = 16, Yn = 32, pc = 80, qs = 65, h8 = 32, d8 = 64, oo = 34;
var D;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(D || (D = {}));
var Q;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Q || (Q = {}));
var bc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bc || (bc = {}));
var Dt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dt || (Dt = {}));
const ji = ["onChainOnly", "offChainOnly", "any"], Qf = {
  [ji[0]]: Dt.OnChainOnly,
  [ji[1]]: Dt.OffChainOnly,
  [ji[2]]: Dt.Any,
  [Dt.OnChainOnly]: Dt.OnChainOnly,
  [Dt.OffChainOnly]: Dt.OffChainOnly,
  [Dt.Any]: Dt.Any
};
function g8(t) {
  if (t in Qf)
    return Qf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ji.join(", ")}`);
}
var lr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lr || (lr = {}));
lr.Mainnet;
var ur;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ur || (ur = {}));
var Yt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yt || (Yt = {}));
var Et;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Et || (Et = {}));
var it;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(it || (it = {}));
var ks;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ks || (ks = {}));
var St;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(St || (St = {}));
var ao;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ao || (ao = {}));
var yc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(yc || (yc = {}));
var Ds;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ds || (Ds = {}));
var Jf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jf || (Jf = {}));
var th;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(th || (th = {}));
function wc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function p8(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ig(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function b8(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wc(t.outputLen), wc(t.blockLen);
}
function y8(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function w8(t, e) {
  Ig(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Kn = {
  number: wc,
  bool: p8,
  bytes: Ig,
  hash: b8,
  exists: y8,
  output: w8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ea = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ee = (t, e) => t << 32 - e | t >>> e, x8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!x8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function m8(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cl(t) {
  if (typeof t == "string" && (t = m8(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class $g {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function mr(t) {
  const e = (r) => t().update(Cl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function S8(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class vl extends $g {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ea(this.buffer);
  }
  update(e) {
    Kn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Cl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ea(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Kn.exists(this), Kn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    S8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ea(e), c = this.outputLen;
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
const A8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Cg = Uint8Array.from({ length: 16 }, (t, e) => e), E8 = Cg.map((t) => (9 * t + 5) % 16);
let Ll = [Cg], Bl = [E8];
for (let t = 0; t < 4; t++)
  for (let e of [Ll, Bl])
    e.push(e[t].map((n) => A8[n]));
const vg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), I8 = Ll.map((t, e) => t.map((n) => vg[e][n])), $8 = Bl.map((t, e) => t.map((n) => vg[e][n])), C8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), v8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Hi = (t, e) => t << e | t >>> 32 - e;
function eh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _i = new Uint32Array(16);
class L8 extends vl {
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
      _i[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, y = C8[h], A = v8[h], v = Ll[h], L = Bl[h], p = I8[h], E = $8[h];
      for (let S = 0; S < 16; S++) {
        const T = Hi(r + eh(h, i, a, u) + _i[v[S]] + y, p[S]) + l | 0;
        r = l, l = u, u = Hi(a, 10) | 0, a = i, i = T;
      }
      for (let S = 0; S < 16; S++) {
        const T = Hi(s + eh(b, o, c, f) + _i[L[S]] + A, E[S]) + g | 0;
        s = g, g = f, f = Hi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    _i.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const B8 = mr(() => new L8()), H8 = (t, e, n) => t & e ^ ~t & n, _8 = (t, e, n) => t & e ^ t & n ^ e & n, M8 = new Uint32Array([
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
]), xn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), mn = new Uint32Array(64);
class Lg extends vl {
  constructor() {
    super(64, 32, 8, !1), this.A = xn[0] | 0, this.B = xn[1] | 0, this.C = xn[2] | 0, this.D = xn[3] | 0, this.E = xn[4] | 0, this.F = xn[5] | 0, this.G = xn[6] | 0, this.H = xn[7] | 0;
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
      mn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = mn[l - 15], h = mn[l - 2], b = Ee(g, 7) ^ Ee(g, 18) ^ g >>> 3, y = Ee(h, 17) ^ Ee(h, 19) ^ h >>> 10;
      mn[l] = y + mn[l - 7] + b + mn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ee(a, 6) ^ Ee(a, 11) ^ Ee(a, 25), h = f + g + H8(a, c, u) + M8[l] + mn[l] | 0, y = (Ee(r, 2) ^ Ee(r, 13) ^ Ee(r, 22)) + _8(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    mn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class U8 extends Lg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Hl = mr(() => new Lg());
mr(() => new U8());
const Mi = BigInt(2 ** 32 - 1), xc = BigInt(32);
function Bg(t, e = !1) {
  return e ? { h: Number(t & Mi), l: Number(t >> xc & Mi) } : { h: Number(t >> xc & Mi) | 0, l: Number(t & Mi) | 0 };
}
function N8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Bg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const T8 = (t, e) => BigInt(t >>> 0) << xc | BigInt(e >>> 0), P8 = (t, e, n) => t >>> n, k8 = (t, e, n) => t << 32 - n | e >>> n, D8 = (t, e, n) => t >>> n | e << 32 - n, O8 = (t, e, n) => t << 32 - n | e >>> n, F8 = (t, e, n) => t << 64 - n | e >>> n - 32, j8 = (t, e, n) => t >>> n - 32 | e << 64 - n, z8 = (t, e) => e, R8 = (t, e) => t, V8 = (t, e, n) => t << n | e >>> 32 - n, G8 = (t, e, n) => e << n | t >>> 32 - n, K8 = (t, e, n) => e << n - 32 | t >>> 64 - n, W8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function q8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Y8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), X8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Z8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Q8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, J8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), tE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: Bg,
  split: N8,
  toBig: T8,
  shrSH: P8,
  shrSL: k8,
  rotrSH: D8,
  rotrSL: O8,
  rotrBH: F8,
  rotrBL: j8,
  rotr32H: z8,
  rotr32L: R8,
  rotlSH: V8,
  rotlSL: G8,
  rotlBH: K8,
  rotlBL: W8,
  add: q8,
  add3L: Y8,
  add3H: X8,
  add4L: Z8,
  add4H: Q8,
  add5H: tE,
  add5L: J8
}, [eE, nE] = Z.split([
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
].map((t) => BigInt(t))), Sn = new Uint32Array(80), An = new Uint32Array(80);
class Oo extends vl {
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
      Sn[p] = e.getUint32(n), An[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const E = Sn[p - 15] | 0, S = An[p - 15] | 0, T = Z.rotrSH(E, S, 1) ^ Z.rotrSH(E, S, 8) ^ Z.shrSH(E, S, 7), O = Z.rotrSL(E, S, 1) ^ Z.rotrSL(E, S, 8) ^ Z.shrSL(E, S, 7), H = Sn[p - 2] | 0, N = An[p - 2] | 0, w = Z.rotrSH(H, N, 19) ^ Z.rotrBH(H, N, 61) ^ Z.shrSH(H, N, 6), I = Z.rotrSL(H, N, 19) ^ Z.rotrBL(H, N, 61) ^ Z.shrSL(H, N, 6), _ = Z.add4L(O, I, An[p - 7], An[p - 16]), F = Z.add4H(_, T, w, Sn[p - 7], Sn[p - 16]);
      Sn[p] = F | 0, An[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: b, Gh: y, Gl: A, Hh: v, Hl: L } = this;
    for (let p = 0; p < 80; p++) {
      const E = Z.rotrSH(l, g, 14) ^ Z.rotrSH(l, g, 18) ^ Z.rotrBH(l, g, 41), S = Z.rotrSL(l, g, 14) ^ Z.rotrSL(l, g, 18) ^ Z.rotrBL(l, g, 41), T = l & h ^ ~l & y, O = g & b ^ ~g & A, H = Z.add5L(L, S, O, nE[p], An[p]), N = Z.add5H(H, v, E, T, eE[p], Sn[p]), w = H | 0, I = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), _ = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      v = y | 0, L = A | 0, y = h | 0, A = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = Z.add(u | 0, f | 0, N | 0, w | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const P = Z.add3L(w, _, G);
      r = Z.add3H(P, N, I, F), s = P | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Z.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: y, l: A } = Z.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: v, l: L } = Z.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, b, y, A, v, L);
  }
  roundClean() {
    Sn.fill(0), An.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class rE extends Oo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class sE extends Oo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class iE extends Oo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
mr(() => new Oo());
mr(() => new rE());
const oE = mr(() => new sE());
mr(() => new iE());
function Hg(t) {
  if (xt(t).byteLength != qs)
    throw Error("Invalid signature");
  return {
    type: D.MessageSignature,
    data: t
  };
}
function Ui(t, e) {
  return { type: D.Address, version: t, hash160: e };
}
function fr(t, e, n) {
  const r = e || 1, s = n || u8;
  if (Xg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: D.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Fo(t) {
  const e = yr.c32addressDecode(t);
  return {
    type: D.Address,
    version: e[0],
    hash160: e[1]
  };
}
var B;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(B || (B = {}));
function aE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return uE(e, n);
  } else
    return cE(t);
}
function cE(t) {
  const e = Fo(t);
  return { type: B.PrincipalStandard, address: e };
}
function lE(t) {
  return { type: B.PrincipalStandard, address: t };
}
function uE(t, e) {
  const n = Fo(t), r = fr(e);
  return _g(n, r);
}
function _g(t, e) {
  if (hs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: B.PrincipalContract, address: t, contractName: e };
}
function vr(t) {
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
      return `(optional ${vr(t.value)})`;
    case B.ResponseErr:
      return `(response UnknownType ${vr(t.value)})`;
    case B.ResponseOk:
      return `(response ${vr(t.value)} UnknownType)`;
    case B.PrincipalStandard:
    case B.PrincipalContract:
      return "principal";
    case B.List:
      return `(list ${t.list.length} ${t.list.length ? vr(t.list[0]) : "UnknownType"})`;
    case B.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${vr(t.data[e])})`).join(" ")})`;
    case B.StringASCII:
      return `(string-ascii ${Sg(t.data).length})`;
    case B.StringUTF8:
      return `(string-utf8 ${hs(t.data).length})`;
  }
}
const Mg = () => ({ type: B.BoolTrue }), Ug = () => ({ type: B.BoolFalse }), fE = (t) => t ? Mg() : Ug(), nh = BigInt("0xffffffffffffffffffffffffffffffff"), hE = BigInt(0), rh = BigInt("0x7fffffffffffffffffffffffffffffff"), sh = BigInt("-170141183460469231731687303715884105728"), dE = (t) => {
  const e = _t(t, !0);
  if (e > rh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${rh}`);
  if (e < sh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${sh}`);
  return { type: B.Int, value: e };
}, Ng = (t) => {
  const e = _t(t, !1);
  if (e < hE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > nh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${nh}`);
  return { type: B.UInt, value: e };
}, gE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: B.Buffer, buffer: t };
};
function Tg() {
  return { type: B.OptionalNone };
}
function Pg(t) {
  return { type: B.OptionalSome, value: t };
}
function pE(t) {
  return { type: B.ResponseErr, value: t };
}
function bE(t) {
  return { type: B.ResponseOk, value: t };
}
function kg(t) {
  return { type: B.List, list: t };
}
function Dg(t) {
  for (const e in t)
    if (!s5(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: B.Tuple, data: t };
}
const yE = (t) => ({ type: B.StringASCII, data: t }), wE = (t) => ({ type: B.StringUTF8, data: t });
class Og extends $g {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Kn.hash(e);
    const r = Cl(n);
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
    return Kn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Kn.exists(this), Kn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Fg = (t, e, n) => new Og(t, e).update(n).digest();
Fg.create = (t, e) => new Og(t, e);
It.hmacSha256Sync = (t, ...e) => {
  const n = Fg.create(Hl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function We(t) {
  return {
    type: D.PublicKey,
    data: xt(t)
  };
}
function xE(t, e, n = St.Compressed) {
  const r = n8(e.data), s = new ne(Wf(r.r), Wf(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === St.Compressed;
  return i.toHex(o);
}
function mE(t) {
  return { type: D.PublicKey, data: t };
}
function ds(t) {
  return !et(t.data).startsWith("04");
}
function co(t) {
  return t.data.slice();
}
function SE(t) {
  const e = IE(t), n = Rs(e.data.slice(0, 32), e.compressed);
  return We(et(n));
}
function AE(t) {
  const e = typeof t == "string" ? t : et(t), n = J.fromHex(e).toHex(!0);
  return We(n);
}
function EE(t) {
  const e = typeof t == "string" ? t : et(t), n = J.fromHex(e).toHex(!1);
  return We(n);
}
function mc(t) {
  const e = t.readUInt8(), n = e === 4 ? d8 : h8;
  return mE(Ct([e, t.readBytes(n)]));
}
function IE(t) {
  const e = r8(t), n = e.length == Ag;
  return { data: e, compressed: n };
}
function $E(t, e) {
  const [n, r] = mo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ws(r, 1) + ne.fromHex(n).toCompactHex();
  return Hg(i);
}
function CE(t) {
  return SE(t.data);
}
function vE(t, e, n) {
  return typeof t == "string" && (t = aE(t)), typeof n == "string" && (n = ah(n)), {
    type: D.Payload,
    payloadType: Q.TokenTransfer,
    recipient: t,
    amount: _t(e, !1),
    memo: n ?? ah("")
  };
}
function jg(t, e, n, r) {
  return typeof t == "string" && (t = Fo(t)), typeof e == "string" && (e = fr(e)), typeof n == "string" && (n = fr(n)), {
    type: D.Payload,
    payloadType: Q.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function ih(t, e, n) {
  return typeof t == "string" && (t = fr(t)), typeof e == "string" && (e = PE(e)), typeof n == "number" ? {
    type: D.Payload,
    payloadType: Q.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: D.Payload,
    payloadType: Q.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function LE() {
  return { type: D.Payload, payloadType: Q.PoisonMicroblock };
}
function oh(t, e) {
  if (t.byteLength != Yn)
    throw Error(`Coinbase buffer size must be ${Yn} bytes`);
  return e != null ? {
    type: D.Payload,
    payloadType: Q.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: D.Payload,
    payloadType: Q.Coinbase,
    coinbaseBytes: t
  };
}
function BE(t, e, n) {
  if (t.byteLength != Yn)
    throw Error(`Coinbase buffer size must be ${Yn} bytes`);
  if (n.byteLength != pc)
    throw Error(`VRF proof buffer size must be ${pc} bytes`);
  return {
    type: D.Payload,
    payloadType: Q.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === B.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Sc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Sc || (Sc = {}));
function HE(t, e, n, r, s, i, o) {
  return {
    type: D.Payload,
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
function _l(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Q.TokenTransfer:
      e.push(He(t.recipient)), e.push(Nn(t.amount, !1, 8)), e.push(ze(t.memo));
      break;
    case Q.ContractCall:
      e.push(ze(t.contractAddress)), e.push(ze(t.contractName)), e.push(ze(t.functionName));
      const n = new Uint8Array(4);
      cr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(He(r));
      });
      break;
    case Q.SmartContract:
      e.push(ze(t.contractName)), e.push(ze(t.codeBody));
      break;
    case Q.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(ze(t.contractName)), e.push(ze(t.codeBody));
      break;
    case Q.PoisonMicroblock:
      break;
    case Q.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Q.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(He(t.recipient));
      break;
    case Q.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(He(t.recipient ? Pg(t.recipient) : Tg())), e.push(t.vrfProof);
      break;
    case Q.TenureChange:
      e.push(xt(t.tenureHash)), e.push(xt(t.previousTenureHash)), e.push(xt(t.burnViewHash)), e.push(xt(t.previousTenureEnd)), e.push(cr(new Uint8Array(4), t.previousTenureBlocks)), e.push(a8(new Uint8Array(1), t.cause)), e.push(xt(t.publicKeyHash));
      break;
  }
  return Ct(e);
}
function _E(t) {
  switch (t.readUInt8Enum(Q, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Q.TokenTransfer:
      const n = Ce(t), r = _t(t.readBytes(8), !1), s = Vg(t);
      return vE(n, r, s);
    case Q.ContractCall:
      const i = ts(t), o = ae(t), a = ae(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const E = Ce(t);
        c.push(E);
      }
      return jg(i, o, a, c);
    case Q.SmartContract:
      const f = ae(t), l = ae(t, 4, 1e5);
      return ih(f, l);
    case Q.VersionedSmartContract: {
      const p = t.readUInt8Enum(bc, (T) => {
        throw new Error(`Cannot recognize ClarityVersion: ${T}`);
      }), E = ae(t), S = ae(t, 4, 1e5);
      return ih(E, S, p);
    }
    case Q.PoisonMicroblock:
      return LE();
    case Q.Coinbase: {
      const p = t.readBytes(Yn);
      return oh(p);
    }
    case Q.CoinbaseToAltRecipient: {
      const p = t.readBytes(Yn), E = Ce(t);
      return oh(p, E);
    }
    case Q.NakamotoCoinbase: {
      const p = t.readBytes(Yn), E = Ce(t), S = t.readBytes(pc);
      return BE(p, E, S);
    }
    case Q.TenureChange:
      const g = et(t.readBytes(20)), h = et(t.readBytes(20)), b = et(t.readBytes(20)), y = et(t.readBytes(32)), A = t.readUInt32BE(), v = t.readUInt8Enum(Sc, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), L = et(t.readBytes(20));
      return HE(g, h, b, y, A, v, L);
  }
}
class Ys extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class jn extends Ys {
  constructor(e) {
    super(e);
  }
}
class ee extends Ys {
  constructor(e) {
    super(e);
  }
}
class zg extends Ys {
  constructor(e) {
    super(e);
  }
}
class lo extends Ys {
  constructor(e) {
    super(e);
  }
}
class Wn extends Ys {
  constructor(e) {
    super(e);
  }
}
var he;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(he || (he = {}));
function Ac(t) {
  return Hg(et(t.readBytes(qs)));
}
function Nr(t, e) {
  return {
    pubKeyEncoding: t,
    type: D.TransactionAuthField,
    contents: e
  };
}
function ME(t) {
  const e = t.readUInt8Enum(he, (n) => {
    throw new ee(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case he.PublicKeyCompressed:
      return Nr(St.Compressed, mc(t));
    case he.PublicKeyUncompressed:
      return Nr(St.Uncompressed, EE(mc(t).data));
    case he.SignatureCompressed:
      return Nr(St.Compressed, Ac(t));
    case he.SignatureUncompressed:
      return Nr(St.Uncompressed, Ac(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Ml(t) {
  return xt(t.data);
}
function UE(t) {
  const e = [];
  switch (t.contents.type) {
    case D.PublicKey:
      e.push(t.pubKeyEncoding === St.Compressed ? he.PublicKeyCompressed : he.PublicKeyUncompressed), e.push(co(AE(t.contents.data)));
      break;
    case D.MessageSignature:
      e.push(t.pubKeyEncoding === St.Compressed ? he.SignatureCompressed : he.SignatureUncompressed), e.push(Ml(t.contents));
      break;
  }
  return Ct(e);
}
function ze(t) {
  switch (t.type) {
    case D.Address:
      return Xs(t);
    case D.Principal:
      return Rg(t);
    case D.LengthPrefixedString:
      return es(t);
    case D.MemoString:
      return kE(t);
    case D.AssetInfo:
      return Gg(t);
    case D.PostCondition:
      return Wg(t);
    case D.PublicKey:
      return co(t);
    case D.LengthPrefixedList:
      return Ul(t);
    case D.Payload:
      return _l(t);
    case D.TransactionAuthField:
      return UE(t);
    case D.MessageSignature:
      return Ml(t);
  }
}
function NE() {
  return {
    type: D.Address,
    version: ks.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Jr(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === it.SerializeP2PKH || e === it.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === it.SerializeP2WPKH || e === it.SerializeP2WSH || e === it.SerializeP2WSHNonSequential) && !r.every(ds))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case it.SerializeP2PKH:
      return Ui(t, t5(r[0].data));
    case it.SerializeP2WPKH:
      return Ui(t, e5(r[0].data));
    case it.SerializeP2SH:
    case it.SerializeP2SHNonSequential:
      return Ui(t, n5(n, r.map(co)));
    case it.SerializeP2WSH:
    case it.SerializeP2WSHNonSequential:
      return Ui(t, r5(n, r.map(co)));
  }
}
function Xs(t) {
  const e = [];
  return e.push(xt(Ws(t.version, 1))), e.push(xt(t.hash160)), Ct(e);
}
function ts(t) {
  const e = ko(et(t.readBytes(1))), n = et(t.readBytes(20));
  return { type: D.Address, version: e, hash160: n };
}
function Rg(t) {
  const e = [];
  return e.push(t.prefix), e.push(Xs(t.address)), t.prefix === Ds.Contract && e.push(es(t.contractName)), Ct(e);
}
function TE(t) {
  const e = t.readUInt8Enum(Ds, (s) => {
    throw new ee(`Unexpected Principal payload type: ${s}`);
  }), n = ts(t);
  if (e === Ds.Standard)
    return { type: D.Principal, prefix: e, address: n };
  const r = ae(t);
  return {
    type: D.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function es(t) {
  const e = [], n = hs(t.content), r = n.byteLength;
  return e.push(xt(Ws(r, t.lengthPrefixBytes))), e.push(n), Ct(e);
}
function ae(t, e, n) {
  e = e || 1;
  const r = ko(et(t.readBytes(e))), s = $l(t.readBytes(r));
  return fr(s, e, n ?? 128);
}
function PE(t) {
  return fr(t, 4, 1e5);
}
function ah(t) {
  if (t && Xg(t, oo))
    throw new Error(`Memo exceeds maximum length of ${oo} bytes`);
  return { type: D.MemoString, content: t };
}
function kE(t) {
  const e = [], n = hs(t.content), r = JE(et(n), oo * 2);
  return e.push(xt(r)), Ct(e);
}
function Vg(t) {
  let e = $l(t.readBytes(oo));
  return e = e.replace(/\u0000*$/, ""), { type: D.MemoString, content: e };
}
function Gg(t) {
  const e = [];
  return e.push(Xs(t.address)), e.push(es(t.contractName)), e.push(es(t.assetName)), Ct(e);
}
function Ec(t) {
  return {
    type: D.AssetInfo,
    address: ts(t),
    contractName: ae(t),
    assetName: ae(t)
  };
}
function jo(t, e) {
  return {
    type: D.LengthPrefixedList,
    lengthPrefixBytes: 4,
    values: t
  };
}
function Ul(t) {
  const e = t.values, n = [];
  n.push(xt(Ws(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(ze(r));
  return Ct(n);
}
function Kg(t, e, n) {
  const r = ko(et(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case D.Address:
        s.push(ts(t));
        break;
      case D.LengthPrefixedString:
        s.push(ae(t));
        break;
      case D.MemoString:
        s.push(Vg(t));
        break;
      case D.AssetInfo:
        s.push(Ec(t));
        break;
      case D.PostCondition:
        s.push(DE(t));
        break;
      case D.PublicKey:
        s.push(mc(t));
        break;
      case D.TransactionAuthField:
        s.push(ME(t));
        break;
    }
  return jo(s);
}
function Wg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Rg(t.principal)), (t.conditionType === Yt.Fungible || t.conditionType === Yt.NonFungible) && e.push(Gg(t.assetInfo)), t.conditionType === Yt.NonFungible && e.push(He(t.assetName)), e.push(t.conditionCode), t.conditionType === Yt.STX || t.conditionType === Yt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new jn("The post-condition amount may not be larger than 8 bytes");
    e.push(Nn(t.amount, !1, 8));
  }
  return Ct(e);
}
function DE(t) {
  const e = t.readUInt8Enum(Yt, (o) => {
    throw new ee(`Could not read ${o} as PostConditionType`);
  }), n = TE(t);
  let r, s, i;
  switch (e) {
    case Yt.STX:
      return r = t.readUInt8Enum(ao, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${et(t.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Yt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Yt.Fungible:
      return s = Ec(t), r = t.readUInt8Enum(ao, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${et(t.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Yt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Yt.NonFungible:
      s = Ec(t);
      const o = Ce(t);
      return r = t.readUInt8Enum(yc, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: D.PostCondition,
        conditionType: Yt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Pe(t, e) {
  return Ct([t, e]);
}
function OE(t) {
  return new Uint8Array([t.type]);
}
function FE(t) {
  return t.type === B.OptionalNone ? new Uint8Array([t.type]) : Pe(t.type, He(t.value));
}
function jE(t) {
  const e = new Uint8Array(4);
  return cr(e, t.buffer.length, 0), Pe(t.type, Do(e, t.buffer));
}
function zE(t) {
  const e = Il(XA(t.value, BigInt(f8)), Eg);
  return Pe(t.type, e);
}
function RE(t) {
  const e = Il(t.value, Eg);
  return Pe(t.type, e);
}
function VE(t) {
  return Pe(t.type, Xs(t.address));
}
function GE(t) {
  return Pe(t.type, Do(Xs(t.address), es(t.contractName)));
}
function KE(t) {
  return Pe(t.type, He(t.value));
}
function WE(t) {
  const e = [], n = new Uint8Array(4);
  cr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = He(r);
    e.push(s);
  }
  return Pe(t.type, Ct(e));
}
function qE(t) {
  const e = [], n = new Uint8Array(4);
  cr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = fr(s);
    e.push(es(i));
    const o = He(t.data[s]);
    e.push(o);
  }
  return Pe(t.type, Ct(e));
}
function qg(t, e) {
  const n = [], r = e == "ascii" ? Sg(t.data) : hs(t.data), s = new Uint8Array(4);
  return cr(s, r.length, 0), n.push(s), n.push(r), Pe(t.type, Ct(n));
}
function YE(t) {
  return qg(t, "ascii");
}
function XE(t) {
  return qg(t, "utf8");
}
function He(t) {
  switch (t.type) {
    case B.BoolTrue:
    case B.BoolFalse:
      return OE(t);
    case B.OptionalNone:
    case B.OptionalSome:
      return FE(t);
    case B.Buffer:
      return jE(t);
    case B.UInt:
      return RE(t);
    case B.Int:
      return zE(t);
    case B.PrincipalStandard:
      return VE(t);
    case B.PrincipalContract:
      return GE(t);
    case B.ResponseOk:
    case B.ResponseErr:
      return KE(t);
    case B.List:
      return WE(t);
    case B.Tuple:
      return qE(t);
    case B.StringASCII:
      return YE(t);
    case B.StringUTF8:
      return XE(t);
    default:
      throw new jn("Unable to serialize. Invalid Clarity Value.");
  }
}
function ZE(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ch = /* @__PURE__ */ new Map();
function Yg(t, e) {
  const n = ch.get(t);
  if (n !== void 0)
    return n(e);
  const r = ZE(t);
  return ch.set(t, r), Yg(t, e);
}
class vs {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return c8(this.readBytes(4), 0);
  }
  readUInt8() {
    return o8(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return s8(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = et(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = et(n);
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
    if (Yg(e, r))
      return r;
    throw n(r);
  }
}
function Ce(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new vs(xt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new vs(t) : e = t;
  switch (e.readUInt8Enum(B, (r) => {
    throw new ee(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case B.Int:
      return dE(e.readBytes(16));
    case B.UInt:
      return Ng(e.readBytes(16));
    case B.Buffer:
      const r = e.readUInt32BE();
      return gE(e.readBytes(r));
    case B.BoolTrue:
      return Mg();
    case B.BoolFalse:
      return Ug();
    case B.PrincipalStandard:
      const s = ts(e);
      return lE(s);
    case B.PrincipalContract:
      const i = ts(e), o = ae(e);
      return _g(i, o);
    case B.ResponseOk:
      return bE(Ce(e));
    case B.ResponseErr:
      return pE(Ce(e));
    case B.OptionalNone:
      return Tg();
    case B.OptionalSome:
      return Pg(Ce(e));
    case B.List:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(Ce(e));
      return kg(c);
    case B.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const A = ae(e).content;
        if (A === void 0)
          throw new ee('"content" is undefined');
        f[A] = Ce(e);
      }
      return Dg(f);
    case B.StringASCII:
      const l = e.readUInt32BE(), g = t8(e.readBytes(l));
      return yE(g);
    case B.StringUTF8:
      const h = e.readUInt32BE(), b = $l(e.readBytes(h));
      return wE(b);
    default:
      throw new ee("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const QE = (t) => t.length % 2 == 0 ? t : `0${t}`, JE = (t, e) => t.padEnd(e, "0"), Xg = (t, e) => t ? hs(t).length > e : !1;
function uo(t) {
  return fd(t);
}
const Os = (t) => B8(Hl(t)), Nl = (t) => et(oE(t)), t5 = (t) => et(Os(t)), e5 = (t) => {
  const e = Os(t), n = Do(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Os(n);
  return et(r);
}, n5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ct(n), s = Os(r);
  return et(s);
}, r5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ct(n), s = Hl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ct(i), a = Os(o);
  return et(a);
};
function s5(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
const Dr = (t) => {
  try {
    return yr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Tl() {
  return {
    type: D.MessageSignature,
    data: et(new Uint8Array(qs))
  };
}
function Pl(t, e, n, r) {
  const s = Jr(0, t, 1, [We(e)]).hash160, i = ds(We(e)) ? St.Compressed : St.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: _t(n, !1),
    fee: _t(r, !1),
    keyEncoding: i,
    signature: Tl()
  };
}
function i5(t, e, n, r, s) {
  const i = n.map(We), o = Jr(0, t, e, i).hash160;
  return {
    hashMode: t,
    signer: o,
    nonce: _t(r, !1),
    fee: _t(s, !1),
    fields: [],
    signaturesRequired: e
  };
}
function Fs(t) {
  return "signature" in t;
}
function lh(t) {
  return t === it.SerializeP2SH || t === it.SerializeP2WSH;
}
function o5(t) {
  return t === it.SerializeP2SHNonSequential || t === it.SerializeP2WSHNonSequential;
}
function uh(t) {
  const e = uo(t);
  return e.nonce = 0, e.fee = 0, Fs(e) ? e.signature = Tl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function a5(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    Nn(t.nonce, !1, 8),
    Nn(t.fee, !1, 8),
    t.keyEncoding,
    Ml(t.signature)
  ];
  return Ct(e);
}
function c5(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    Nn(t.nonce, !1, 8),
    Nn(t.fee, !1, 8)
  ], n = jo(t.fields);
  e.push(Ul(n));
  const r = new Uint8Array(2);
  return i8(r, t.signaturesRequired, 0), e.push(r), Ct(e);
}
function l5(t, e) {
  const n = et(e.readBytes(20)), r = BigInt(`0x${et(e.readBytes(8))}`), s = BigInt(`0x${et(e.readBytes(8))}`), i = e.readUInt8Enum(St, (a) => {
    throw new ee(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === it.SerializeP2WPKH && i != St.Compressed)
    throw new ee("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ac(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function u5(t, e) {
  const n = et(e.readBytes(20)), r = BigInt("0x" + et(e.readBytes(8))), s = BigInt("0x" + et(e.readBytes(8))), i = Kg(e, D.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case D.PublicKey:
        ds(u.contents) || (o = !0);
        break;
      case D.MessageSignature:
        if (u.pubKeyEncoding === St.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Wn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === it.SerializeP2WSH || t === it.SerializeP2WSHNonSequential))
    throw new Wn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ia(t) {
  return Fs(t) ? a5(t) : c5(t);
}
function $a(t) {
  const e = t.readUInt8Enum(it, (n) => {
    throw new ee(`Could not parse ${n} as AddressHashMode`);
  });
  return e === it.SerializeP2PKH || e === it.SerializeP2WPKH ? l5(e, t) : u5(e, t);
}
function Zg(t, e, n, r) {
  const i = t + et(new Uint8Array([e])) + et(Nn(n, !1, 8)) + et(Nn(r, !1, 8));
  if (xt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Nl(xt(i));
}
function Qg(t, e, n) {
  const r = 33 + qs, s = ds(e) ? St.Compressed : St.Uncompressed, i = t + QE(s.toString(16)) + n.data, o = xt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Nl(o);
}
function f5(t, e, n, r, s) {
  const i = Zg(t, e, n, r), o = $E(s, i), a = CE(s), c = Qg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Jg(t, e, n, r, s, i) {
  const o = Zg(t, e, n, r), a = We(xE(o, i, s)), c = Qg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function h5() {
  const t = Pl(it.SerializeP2PKH, "", 0, 0);
  return t.signer = NE().hash160, t.keyEncoding = St.Compressed, t.signature = Tl(), t;
}
function fh(t, e, n) {
  return Fs(t) ? d5(t, e, n) : g5(t, e, n);
}
function d5(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Jg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Jr(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Wn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function g5(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case D.PublicKey:
        ds(c.contents) || (i = !0), r.push(c.contents);
        break;
      case D.MessageSignature:
        c.pubKeyEncoding === St.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Jg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (lh(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Wn("Too many signatures");
        break;
    }
  if (lh(t.hashMode) && o !== t.signaturesRequired || o5(t.hashMode) && o < t.signaturesRequired)
    throw new Wn("Incorrect number of signatures");
  if (i && (t.hashMode === it.SerializeP2WSH || t.hashMode === it.SerializeP2WSHNonSequential))
    throw new Wn("Uncompressed keys are not allowed in this hash mode");
  const a = Jr(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Wn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function kl(t) {
  return {
    authType: Et.Standard,
    spendingCondition: t
  };
}
function Dl(t, e) {
  return {
    authType: Et.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Pl(it.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function hh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Et.Standard:
        return kl(uh(t.spendingCondition));
      case Et.Sponsored:
        return Dl(uh(t.spendingCondition), h5());
      default:
        throw new lo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function p5(t, e) {
  switch (t.authType) {
    case Et.Standard:
      return fh(t.spendingCondition, e, Et.Standard);
    case Et.Sponsored:
      return fh(t.spendingCondition, e, Et.Standard);
    default:
      throw new lo("Invalid origin auth type");
  }
}
function b5(t, e) {
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
function y5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: _t(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function w5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: _t(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function x5(t, e) {
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
function m5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Et.Standard:
      e.push(Ia(t.spendingCondition));
      break;
    case Et.Sponsored:
      e.push(Ia(t.spendingCondition)), e.push(Ia(t.sponsorSpendingCondition));
      break;
  }
  return Ct(e);
}
function S5(t) {
  const e = t.readUInt8Enum(Et, (r) => {
    throw new ee(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Et.Standard:
      return n = $a(t), kl(n);
    case Et.Sponsored:
      n = $a(t);
      const r = $a(t);
      return Dl(n, r);
  }
}
var at;
(function(t) {
  t[t.ClarityAbiTypeUInt128 = 1] = "ClarityAbiTypeUInt128", t[t.ClarityAbiTypeInt128 = 2] = "ClarityAbiTypeInt128", t[t.ClarityAbiTypeBool = 3] = "ClarityAbiTypeBool", t[t.ClarityAbiTypePrincipal = 4] = "ClarityAbiTypePrincipal", t[t.ClarityAbiTypeNone = 5] = "ClarityAbiTypeNone", t[t.ClarityAbiTypeBuffer = 6] = "ClarityAbiTypeBuffer", t[t.ClarityAbiTypeResponse = 7] = "ClarityAbiTypeResponse", t[t.ClarityAbiTypeOptional = 8] = "ClarityAbiTypeOptional", t[t.ClarityAbiTypeTuple = 9] = "ClarityAbiTypeTuple", t[t.ClarityAbiTypeList = 10] = "ClarityAbiTypeList", t[t.ClarityAbiTypeStringAscii = 11] = "ClarityAbiTypeStringAscii", t[t.ClarityAbiTypeStringUtf8 = 12] = "ClarityAbiTypeStringUtf8", t[t.ClarityAbiTypeTraitReference = 13] = "ClarityAbiTypeTraitReference";
})(at || (at = {}));
const tp = (t) => typeof t == "string", ep = (t) => t.buffer !== void 0, np = (t) => t["string-ascii"] !== void 0, rp = (t) => t["string-utf8"] !== void 0, sp = (t) => t.response !== void 0, ip = (t) => t.optional !== void 0, op = (t) => t.tuple !== void 0, ap = (t) => t.list !== void 0;
function A5(t) {
  if (tp(t)) {
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
    if (ep(t))
      return { id: at.ClarityAbiTypeBuffer, type: t };
    if (sp(t))
      return { id: at.ClarityAbiTypeResponse, type: t };
    if (ip(t))
      return { id: at.ClarityAbiTypeOptional, type: t };
    if (op(t))
      return { id: at.ClarityAbiTypeTuple, type: t };
    if (ap(t))
      return { id: at.ClarityAbiTypeList, type: t };
    if (np(t))
      return { id: at.ClarityAbiTypeStringAscii, type: t };
    if (rp(t))
      return { id: at.ClarityAbiTypeStringUtf8, type: t };
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(t)}`);
  }
}
function Lr(t) {
  if (tp(t))
    return t === "int128" ? "int" : t === "uint128" ? "uint" : t;
  if (ep(t))
    return `(buff ${t.buffer.length})`;
  if (np(t))
    return `(string-ascii ${t["string-ascii"].length})`;
  if (rp(t))
    return `(string-utf8 ${t["string-utf8"].length})`;
  if (sp(t))
    return `(response ${Lr(t.response.ok)} ${Lr(t.response.error)})`;
  if (ip(t))
    return `(optional ${Lr(t.optional)})`;
  if (op(t))
    return `(tuple ${t.tuple.map((e) => `(${e.name} ${Lr(e.type)})`).join(" ")})`;
  if (ap(t))
    return `(list ${t.list.length} ${Lr(t.list.type)})`;
  throw new Error(`Type string unsupported for Clarity type: ${JSON.stringify(t)}`);
}
function Br(t, e) {
  const n = A5(e);
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
      return n.id === at.ClarityAbiTypeOptional && Br(t.value, n.type.optional);
    case B.ResponseErr:
      return n.id === at.ClarityAbiTypeResponse && Br(t.value, n.type.response.error);
    case B.ResponseOk:
      return n.id === at.ClarityAbiTypeResponse && Br(t.value, n.type.response.ok);
    case B.PrincipalContract:
      return n.id === at.ClarityAbiTypePrincipal || n.id === at.ClarityAbiTypeTraitReference;
    case B.PrincipalStandard:
      return n.id === at.ClarityAbiTypePrincipal;
    case B.List:
      return n.id == at.ClarityAbiTypeList && n.type.list.length >= t.list.length && t.list.every((r) => Br(r, n.type.list.type));
    case B.Tuple:
      if (n.id == at.ClarityAbiTypeTuple) {
        const r = uo(t.data);
        for (let s = 0; s < n.type.tuple.length; s++) {
          const i = n.type.tuple[s], o = i.name, a = r[o];
          if (a) {
            if (!Br(a, i.type))
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
function E5(t, e) {
  const n = e.functions.filter((r) => r.name === t.functionName.content);
  if (n.length === 1) {
    const s = n[0].args;
    if (t.functionArgs.length !== s.length)
      throw new Error(`Clarity function expects ${s.length} argument(s) but received ${t.functionArgs.length}`);
    for (let i = 0; i < t.functionArgs.length; i++) {
      const o = t.functionArgs[i], a = s[i];
      if (!Br(o, a.type)) {
        const c = i + 1;
        throw new Error(`Clarity function \`${t.functionName.content}\` expects argument ${c} to be of type ${Lr(a.type)}, not ${vr(o)}`);
      }
    }
    return !0;
  } else throw n.length === 0 ? new Error(`ABI doesn't contain a function with the name ${t.functionName.content}`) : new Error(`Malformed ABI. Contains multiple functions with the name ${t.functionName.content}`);
}
class cp {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: _t(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? l8, this.postConditionMode = i ?? ur.Deny, this.postConditions = s ?? jo([]), o)
      this.anchorMode = g8(o);
    else
      switch (r.payloadType) {
        case Q.Coinbase:
        case Q.CoinbaseToAltRecipient:
        case Q.NakamotoCoinbase:
        case Q.PoisonMicroblock:
        case Q.TenureChange:
          this.anchorMode = Dt.OnChainOnly;
          break;
        case Q.ContractCall:
        case Q.SmartContract:
        case Q.VersionedSmartContract:
        case Q.TokenTransfer:
          this.anchorMode = Dt.Any;
          break;
      }
  }
  signBegin() {
    const e = uo(this);
    return e.auth = hh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = uo(this);
    return e.auth = hh(e.auth), e.txid();
  }
  verifyOrigin() {
    return p5(this.auth, this.verifyBegin());
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
    if (n && !Fs(n)) {
      const r = ds(e);
      n.fields.push(Nr(r ? St.Compressed : St.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = f5(n, r, e.fee, e.nonce, s);
    return Fs(e) ? e.signature = i : e.fields.push(Nr(s.data.byteLength === Ag ? St.Compressed : St.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Nl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new lo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = x5(this.auth, e);
  }
  setFee(e) {
    this.auth = b5(this.auth, e);
  }
  setNonce(e) {
    this.auth = y5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new lo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = w5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new jn('"version" is undefined');
    if (this.chainId === void 0)
      throw new jn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new jn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new jn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new jn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return cr(n, this.chainId, 0), e.push(n), e.push(m5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ul(this.postConditions)), e.push(_l(this.payload)), Ct(e);
  }
}
function I5(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new vs(xt(t.slice(2))) : e = new vs(xt(t)) : t instanceof Uint8Array ? e = new vs(t) : e = t;
  const n = e.readUInt8Enum(lr, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = S5(e), i = e.readUInt8Enum(Dt, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(ur, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Kg(e, D.PostCondition), c = _E(e);
  return new cp(n, s, c, a, o, i, r);
}
async function $5(t, e) {
  const n = `${e.coreApiUrl}/extended/v1/address/${t}/nonces`, s = await (await e.fetchFn(n)).json();
  return BigInt(s.possible_next_nonce);
}
async function C5(t, e) {
  const n = ye.fromNameOrNetwork(e ?? new us()), r = n.getAccountApiUrl(t);
  try {
    return await $5(t, n);
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
async function v5(t, e) {
  const r = {
    method: "GET",
    headers: {
      Accept: "application/text"
    }
  }, s = ye.fromNameOrNetwork(e ?? H5(t)), i = s.getTransferFeeEstimateApiUrl(), o = await s.fetchFn(i, r);
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
async function L5(t, e, n) {
  var c;
  const r = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_payload: et(_l(t)),
      ...e ? { estimated_len: e } : {}
    })
  }, s = ye.fromNameOrNetwork(n ?? new us()), i = s.getTransactionFeeEstimateApiUrl(), o = await s.fetchFn(i, r);
  if (!o.ok) {
    const u = await o.text().then((f) => {
      try {
        return JSON.parse(f);
      } catch {
        return f;
      }
    });
    throw (u == null ? void 0 : u.reason) === "NoEstimateAvailable" || typeof u == "string" && u.includes("NoEstimateAvailable") ? new zg(((c = u == null ? void 0 : u.reason_data) == null ? void 0 : c.message) ?? "") : new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${i} and failed with the message: "${u}"`);
  }
  return (await o.json()).estimations;
}
async function B5(t, e, n) {
  const r = {
    method: "GET"
  }, s = ye.fromNameOrNetwork(n), i = s.getAbiApiUrl(t, e), o = await s.fetchFn(i, r);
  if (!o.ok) {
    const a = await o.text().catch(() => "");
    throw new Error(`Error fetching contract ABI for contract "${e}" at address ${t}. Response ${o.status}: ${o.statusText}. Attempted to fetch ${i} and failed with the message: "${a}"`);
  }
  return JSON.parse(await o.text());
}
function H5(t) {
  switch (t.version) {
    case lr.Mainnet:
      return new us();
    case lr.Testnet:
      return new eg();
  }
}
async function _5(t) {
  const e = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new us(),
    postConditionMode: ur.Deny,
    sponsored: !1
  }, n = Object.assign(e, t), r = jg(n.contractAddress, n.contractName, n.functionName, n.functionArgs);
  if (n != null && n.validateWithAbi) {
    let f;
    if (typeof n.validateWithAbi == "boolean")
      if (n != null && n.network)
        f = await B5(n.contractAddress, n.contractName, n.network);
      else
        throw new Error("Network option must be provided in order to validate with ABI");
    else
      f = n.validateWithAbi;
    E5(r, f);
  }
  let s = null, i = null;
  if ("publicKey" in n)
    s = Pl(it.SerializeP2PKH, n.publicKey, n.nonce, n.fee);
  else {
    const f = n.useNonSequentialMultiSig ? it.SerializeP2SHNonSequential : it.SerializeP2SH, l = n.address ? N5(n.publicKeys, n.numSignatures, f, Fo(n.address).hash160) : n.publicKeys;
    s = i5(f, n.numSignatures, l, n.nonce, n.fee);
  }
  n.sponsored ? i = Dl(s) : i = kl(s);
  const o = ye.fromNameOrNetwork(n.network), a = [];
  n.postConditions && n.postConditions.length > 0 && n.postConditions.forEach((f) => {
    a.push(f);
  });
  const c = jo(a), u = new cp(o.version, i, r, c, n.postConditionMode, n.anchorMode, o.chainId);
  if (t.fee === void 0 || t.fee === null) {
    const f = await U5(u, o);
    u.setFee(f);
  }
  if (t.nonce === void 0 || t.nonce === null) {
    const f = o.version === lr.Mainnet ? ks.MainnetSingleSig : ks.TestnetSingleSig, l = yr.c32address(f, u.auth.spendingCondition.signer), g = await C5(l, o);
    u.setNonce(g);
  }
  return u;
}
function M5(t) {
  const e = t.auth.spendingCondition.hashMode;
  if ([it.SerializeP2SH, it.SerializeP2WSH].includes(e)) {
    const r = t.auth.spendingCondition, s = r.fields.filter((o) => o.contents.type === D.MessageSignature).length, i = (r.signaturesRequired - s) * (qs + 1);
    return t.serialize().byteLength + i;
  } else
    return t.serialize().byteLength;
}
async function U5(t, e) {
  try {
    const n = M5(t);
    return (await L5(t.payload, n, e))[1].fee;
  } catch (n) {
    if (n instanceof zg)
      return await v5(t, e);
    throw n;
  }
}
function N5(t, e, n, r) {
  if (Jr(0, n, e, t.map(We)).hash160 === r)
    return t;
  const i = t.slice().sort();
  if (Jr(0, n, e, i.map(We)).hash160 === r)
    return i;
  throw new Error("Failed to find matching multi-sig address given public-keys.");
}
const dh = fE, gh = Ng, T5 = kg, P5 = Dg, lp = (t) => {
  let e = "";
  for (const n of t)
    e += n.toString(16).padStart(2, "0");
  return e;
}, k5 = ["store_write"], ph = "/manifest.json", D5 = /* @__PURE__ */ new Set([4001, -31001]), O5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], F5 = ["result", "data", "payload", "response", "params"], bh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ol = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Zs = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), gs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Or = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, up = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Fl = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => up(i, r)) === s
  );
}, fp = (t) => t ? Fl(gs()).some(
  (e) => {
    var n;
    return e.id === t && (Zs(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, hp = () => {
  if (typeof window > "u")
    return;
  const t = gs(), e = Fl(t).filter(
    (n) => {
      var r;
      return Zs(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Or(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of O5) {
    const r = Or(t, n) ?? (t === window ? void 0 : Or(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, dp = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = gs(), n = Or(e, t) ?? (e === window ? void 0 : Or(window, t)) ?? Bo(t);
  if (n)
    return n;
  if (Zs(t) || fp(t))
    return hp();
}, j5 = (t) => {
  const e = gs();
  if (!e)
    return [];
  const n = Fl(e), r = t.filter(
    (s) => !n.some((i) => up(i, s)) && !!Or(e, s.id)
  );
  return n.concat(r);
}, vn = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, qe = () => ({ isConnected: !1 }), z5 = ["blockstack-session", "blockstack"], gp = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of z5) {
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
gp();
const Qs = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ot = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, R5 = (t) => {
  const e = Ot(t);
  if (!e)
    return null;
  const n = Qs(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, V5 = (t) => {
  const e = Ot(t);
  if (!e)
    return null;
  const n = Qs(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, fo = (t, e = "mainnet") => {
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
      return fo(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return fo(r, e);
  }
  return e;
}, ho = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, G5 = (t) => typeof t == "string" ? Qs(t) : lp(He(t)), K5 = (t) => typeof t == "string" ? Qs(t) : lp(Wg(t)), W5 = (t) => t === ur.Allow ? "allow" : "deny", ns = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Dr(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = ns(s, e + 1);
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
    const i = ns(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Dr(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Dr(n.testnet) ? n.testnet.trim() : null;
}, yh = (t) => {
  const e = Ot(t);
  if (!e)
    return null;
  const n = Qs(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, Ic = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const a = Ic(o, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : yh(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => Ot(o)).find((o) => o && Dr(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => yh(o)).find(Boolean);
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
    const a = Ic(r[o], e, n + 1);
    if (a)
      return a;
  }
  return null;
}, q5 = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && Dr(n) ? n.trim() : null;
  if (!r)
    return qe();
  const s = Cc(r);
  return s !== "mainnet" ? qe() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, Y5 = (t, e = "mainnet") => {
  const n = ns(t);
  if (!n)
    return qe();
  const r = Cc(n) ?? fo(t, e);
  if (r !== "mainnet")
    return qe();
  const s = Ic(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, zo = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Js = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && D5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Tn = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ot(n == null ? void 0 : n.message) ?? Ot(e.message) ?? Ot(e.error) ?? Ot(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, hr = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Tn(e);
    if (e.status === "error")
      throw Tn(e.result ?? e);
  }
  return t;
}, Ro = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return hr(r);
  } catch (r) {
    throw Tn(r);
  }
}, jl = () => hp(), rs = (t) => {
  var r, s;
  const e = pe();
  if (Zs(e) || fp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = gs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === jl();
}, wh = async (t, e, n) => {
  if (!rs(t))
    return Ro(t, e, n);
  const r = jl();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return hr(await r.request(e, n));
  } catch (s) {
    throw Tn(s);
  }
}, Ca = (t) => {
  const e = V5(t);
  if (!e)
    return null;
  try {
    const n = I5(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, $c = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Ca(t), r = R5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Ot(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = $c(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of bh)
    if (Ca(s[a])) {
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
  for (const a of bh) {
    const c = Ca(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Ot(s[a]) ?? void 0
      };
  }
  for (const a of F5) {
    const c = s[a], u = $c(c, e + 1);
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
}, xh = (t) => {
  const e = $c(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, X5 = (t) => ({
  ...t,
  fee: ho(t.fee),
  nonce: ho(t.nonce),
  sponsored: t.sponsored === !0
}), pp = (t) => {
  const e = t.postConditions && t.postConditions.length > 0 ? t.postConditions.map((n) => K5(n)) : void 0;
  return {
    contract: `${t.contractAddress}.${t.contractName}`,
    functionName: t.functionName,
    functionArgs: t.functionArgs.map((n) => G5(n)),
    network: fo(t.network),
    address: t.stxAddress,
    fee: ho(t.fee),
    nonce: ho(t.nonce),
    sponsored: t.sponsored ?? !1,
    postConditionMode: W5(t.postConditionMode),
    postConditions: e
  };
}, Z5 = (t) => {
  const e = pp(t);
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
}, bp = "WALLET_ADDRESS_MISMATCH";
let mh = 9e4;
const Q5 = 45e3;
let Ls = null;
const go = (t) => {
  t && (Ls = { address: t, at: Date.now() });
}, yp = () => {
  Ls = null;
}, J5 = () => Ls && Date.now() - Ls.at <= Q5 ? Ls.address : null, t6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, e6 = async (t) => {
  yp();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = hr(await t.request("wallet_connect")), n = ns(e);
  return go(n), n;
}, n6 = async (t, e, n, r) => {
  try {
    return hr(await t.request(e, n));
  } catch (s) {
    const i = Tn(s);
    if (!t6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await e6(t);
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
        { code: o ? bp : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return hr(await t.request(e, n));
    } catch (a) {
      throw Tn(a);
    }
  }
};
let Sh = 3e4;
const r6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Sh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Sh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, s6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: bp }
      );
    return c;
  }, s = J5();
  if (s)
    return vn(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  vn(n, "account-read");
  try {
    const c = hr(
      await r6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = ns(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Js(c))
      throw Tn(c);
    vn(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return go(i), r(i, "wallet_getAccount");
  let o;
  vn(n, "account-reconnect");
  try {
    o = hr(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Tn(c);
  }
  const a = ns(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return go(a), r(a, "wallet_connect");
}, i6 = async (t, e) => {
  if (!rs(t)) {
    vn(e.onProgress, "signing-request");
    const c = await Ro(
      t,
      "stx_callContract",
      pp(e)
    );
    return xh(c);
  }
  const n = jl();
  if (!n)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  let r = "account-preflight", s;
  const i = async () => {
    var f;
    s = await s6(n, e.stxAddress, e.onProgress), r = "stx_callContract", vn(e.onProgress, "signing-request");
    const c = Z5(e);
    console.info("[wallet:contract-call]", {
      stage: "XVERSE_SIGNING_REQUEST",
      providerId: pe(),
      contract: c.contract,
      functionName: c.functionName,
      functionArgCount: c.functionArgs.length,
      postConditionMode: c.postConditionMode,
      postConditionCount: ((f = c.postConditions) == null ? void 0 : f.length) ?? 0,
      expectedAddress: e.stxAddress,
      activeAddress: s
    });
    const u = await n6(
      n,
      "stx_callContract",
      c,
      e.stxAddress ?? s
    );
    return xh(u);
  };
  let o;
  const a = new Promise((c, u) => {
    o = setTimeout(() => {
      u(
        Object.assign(
          new Error(
            `Xverse did not answer the ${r} request within ${Math.round(
              mh / 1e3
            )}s (provider=${pe() ?? "unknown"}, expected=${e.stxAddress ?? "none"}, active=${s ?? "unknown"}, call=${e.contractAddress}.${e.contractName}::${e.functionName}). If Xverse showed an error toast, note its exact text; if you approved a transaction, it may still broadcast.`
          ),
          { code: "XVERSE_SIGNING_TIMEOUT", stage: r }
        )
      );
    }, mh);
  });
  try {
    return await Promise.race([i(), a]);
  } finally {
    o && clearTimeout(o);
  }
}, wp = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = wp(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, o6 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], a6 = async (t) => {
  const e = pe();
  if (rs(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!Ol(e))
    return o6;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = wp(await Ro(t, "supportedMethods"));
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
}, c6 = async (t) => {
  if (rs(t))
    try {
      await wh(t, "wallet_disconnect");
    } catch {
    }
  const e = await a6(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await wh(t, r), i = Y5(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), rs(t) && go(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = zo(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Js(s))
        return qe();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return qe();
}, l6 = async (t, e) => {
  const n = new wo(k5, void 0, "", ph), r = new _s({ appConfig: n });
  return new Promise((s) => {
    qA(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: ph,
        userSession: r,
        onFinish: (i) => {
          s(q5(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(qe());
        }
      },
      e
    );
  });
}, u6 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : pe(), r = dp(n);
  return r ? (e && n && hd(n), r) : null;
}, f6 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return pg(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = xg, i = j5(s), o = document.body.style.overflow, a = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", c), r.remove();
    }, c = (u) => {
      u.key === "Escape" && (a(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (u) => {
      const f = u6(u, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof u == "string" ? u : pe() ?? "provider-object",
        resolved: !!f,
        requestBridge: typeof (f == null ? void 0 : f.request) == "function"
      }), a(), n(f);
    }, r.cancelCallback = () => {
      a(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", c), document.body.appendChild(r);
  });
}, xp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = pe(), e = t ? dp(t) : void 0;
  if (e)
    return e;
  const n = gs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, h6 = async (t) => {
  gp();
  const e = await f6({});
  if (!e)
    return qe();
  if (typeof e.request == "function")
    try {
      const n = await c6(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Js(n))
        return qe();
      if (!zo(n))
        throw n;
    }
  return l6(t, e);
}, d6 = () => {
  const t = pe();
  return Ol(t) ? "leather" : Zs(t) ? "xverse" : t ? String(t) : void 0;
}, g6 = async (t) => {
  const e = l2("wallet_connect");
  Ss({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await h6(t);
    return n.isConnected && n.address ? (vc(n.address, d6()), Lc(n.network), Ss({ journey: e, step: "authorize", outcome: "success" })) : Ss({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw Ss({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: s2(n),
      error: n
    }), n;
  }
}, p6 = async () => {
  const t = xp();
  if (t && Ol(pe()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await Ro(t, e);
        break;
      } catch (n) {
        if (Js(n) || zo(n))
          continue;
      }
  YA(), dd(), yp(), vc(null), Lc(null), Ss({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, b6 = (t, e) => {
  const n = xp(), r = X5(t);
  return vn(t.onProgress, "provider-selected"), !n || typeof n.request != "function" ? (vn(t.onProgress, "legacy-request"), Kf(r, e)) : void i6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (zo(s) && !rs(n)) {
      Kf(r, n);
      return;
    }
    if (console.error("[wallet] contract call request failed", s), Js(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, y6 = (t) => {
  const e = J1(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (vc(o.address), Lc(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), a = await g6({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return a.isConnected ? (e.save(a), a) : o.isConnected ? o : a;
    },
    disconnect: async () => {
      await p6(), n();
    },
    getSession: r
  };
};
function mp(t, e, n) {
  var o;
  if (!n.isConnected || n.network !== "mainnet" || !((o = n.address) != null && o.startsWith("SP"))) throw Error("Connect a mainnet wallet first.");
  if (!e.length || e.length > 25 || e.some((a) => !Number.isSafeInteger(a.id) || a.id < 0 || typeof a.liked != "boolean") || new Set(e.map((a) => a.id)).size !== e.length) throw Error("Select 1–25 different songs.");
  const r = t.split("."), [s, i] = r;
  if (r.length !== 2 || !s.startsWith("SP") || !Dr(s) || !/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(i)) throw Error("Invalid likes contract.");
  return { contractAddress: s, contractName: i, functionName: e.length === 1 ? "set-liked" : "set-likes", functionArgs: e.length === 1 ? [gh(e[0].id), dh(e[0].liked)] : [T5(e.map((a) => P5({ id: gh(a.id), liked: dh(a.liked) })))], network: new us(), stxAddress: n.address, sponsored: !1, postConditionMode: ur.Deny, postConditions: [], ...e.length === 1 ? { fee: 200n } : {} };
}
function Sp(t, e, n) {
  return Array.isArray(t) ? [...new Set(t.map((r) => Number(r == null ? void 0 : r.tokenId)).filter((r) => Number.isSafeInteger(r) && e.has(r) && !n.has(r)))] : [];
}
async function w6(t, e, n) {
  const r = mp(t, e, n), i = (await _5({ ...r, publicKey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", fee: 0n, nonce: 0n, anchorMode: Dt.Any })).serialize().length;
  return { microStx: i, totalStx: (i / 1e6).toFixed(6), perSongStx: (i / e.length / 1e6).toFixed(6), count: e.length };
}
const jt = y6({ appName: "Xtrata Radio", appIcon: "/favicon.ico" }), tt = (t) => document.getElementById(t);
let zt, ss = [], $n = /* @__PURE__ */ new Map(), ge = !1, _n = !1, Fe = 0;
const po = /* @__PURE__ */ new Map();
let Tr, Ap = "", Ep = [];
const bo = new URL(location.href).searchParams.get("id"), Pr = new URL(location.href).searchParams.get("action") === "review" && bo !== null;
let Ah;
const ce = (t) => {
  tt("status").textContent = t;
}, x6 = Date.now(), Ni = [], wt = (t, e = {}) => {
  const n = { stage: t, elapsedMs: Date.now() - x6, ...e };
  console.info("[radio:likes]", n), Ni.push(JSON.stringify(n)), Ni.length > 100 && Ni.shift();
  const r = document.getElementById("diagnostics");
  r && (r.textContent = Ni.join(`
`));
}, m6 = {
  "provider-selected": "Wallet provider selected. Preparing the request…",
  "account-read": "Checking the active Xverse account. The transaction prompt has not been requested yet…",
  "account-cached": "Verified wallet account available. Preparing the transaction…",
  "account-read-failed": "Xverse did not provide its account. Trying its connection flow…",
  "account-reconnect": "Waiting for Xverse to confirm account access. Open the extension and check for a connection request.",
  "signing-request": "Transaction approval requested. Open your wallet to review the songs and network fee.",
  "legacy-request": "Wallet popup requested. Check your extension and browser popup permissions."
};
wt("PAGE_READY", { version: "likes-debug-1" });
const Fr = () => `xtrata.radio.chain.pending:${zt == null ? void 0 : zt.contract}:${jt.getSession().address}`, Xn = () => {
  try {
    return localStorage.getItem(Fr()) || po.get(Fr()) || "";
  } catch {
    return po.get(Fr()) || "";
  }
};
async function Ti(t = {}) {
  const e = await fetch("/radio/chain-likes?" + new URLSearchParams(t), { cache: "no-store", signal: AbortSignal.timeout(2e4) }), n = await e.json();
  if (!e.ok) throw Error(n.error || "Could not read on-chain likes.");
  return n;
}
function Bs() {
  const t = jt.getSession(), e = t.isConnected && t.network === "mainnet" && Tr === t.address, n = !!Xn();
  let r = [];
  try {
    r = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]");
  } catch {
  }
  const s = Array.isArray(r) ? new Set(r.map((a) => String(a == null ? void 0 : a.tokenId))).size : 0, i = e && !_n ? Sp(r, new Set(ss.map((a) => a.id)), new Set([...$n].filter(([, a]) => a.liked).map(([a]) => a))).length : s;
  if (tt("import-offer").textContent = !Pr && s ? i ? `You have ${i} saved favourites to review for on-chain import. ${e ? "Use the import button below." : "Connect your wallet to check which ones still need importing."} Nothing is published automatically.` : "All eligible saved favourites are already liked by this wallet on-chain." : "", tt("wallet").textContent = e ? `Wallet: ${t.address}` : "", tt("disconnect").disabled = !t.isConnected || ge, tt("connect").disabled = ge, tt("import").hidden = !!Pr, tt("import").disabled = !!Pr || !(zt != null && zt.enabled) || !e || ge || _n || n, tt("pending").replaceChildren(), n) {
    const a = document.createElement("a");
    a.href = "https://explorer.hiro.so/txid/" + Xn() + "?chain=mainnet", a.target = "_blank", a.rel = "noopener", a.textContent = "Transaction pending — view on explorer. Use Refresh to check confirmation.", tt("pending").append(a);
  }
  const o = new URL(location.href).searchParams.get("id");
  tt("songs").replaceChildren();
  for (const a of ss.filter((c) => !Pr || String(c.id) === bo).sort((c, u) => +(String(u.id) === o) - +(String(c.id) === o))) {
    const c = document.createElement("tr"), u = document.createElement("td"), f = document.createElement("td"), l = document.createElement("td"), g = document.createElement("button");
    u.textContent = `#${a.id} · ${a.title}`;
    const h = $n.get(a.id);
    f.textContent = (h == null ? void 0 : h.total) ?? "—", g.textContent = h != null && h.liked ? "Unlike on-chain" : "Like on-chain", g.disabled = !e || !h || !(zt != null && zt.enabled) || ge || _n || n, g.onclick = () => zl([{ id: a.id, liked: !(h != null && h.liked) }]), l.append(g), c.append(u, f, l), tt("songs").append(c);
  }
}
let va = 0;
const Ip = () => Ep.filter((t) => {
  var e;
  return (e = tt("choices").querySelector(`input[data-id="${t.id}"]`)) == null ? void 0 : e.checked;
});
async function $p() {
  const t = ++va, e = Ip();
  tt("approve").disabled = !0, tt("fee-suggestion").textContent = e.length ? "Calculating a low-fee suggestion…" : "Select at least one song.";
  try {
    if (!e.length) return;
    const n = await w6(zt.contract, e, jt.getSession());
    if (t !== va) return;
    const r = tt("fee-suggestion");
    r.replaceChildren();
    const s = document.createElement("span");
    s.className = "fee-label", s.textContent = n.count === 1 ? "CUSTOM NETWORK FEE · ONE SONG" : "SUGGESTED MINIMUM · BATCH TOTAL";
    const i = document.createElement("strong");
    i.className = "fee-amount", i.textContent = n.count === 1 ? "0.0002 STX" : n.totalStx + " STX";
    const o = document.createElement("p");
    o.textContent = n.count === 1 ? "Choose Custom in your wallet and enter 0.0002 STX (200 microSTX). Pay no more for this like or unlike. If the wallet shows a higher fee, change it or cancel before signing." : "Suggested minimum fee: " + n.totalStx + " STX total (" + n.microStx + " microSTX). Approximately " + n.perSongStx + " STX per song for " + n.count + " songs. Choose the custom network fee in your wallet if its suggestion is higher.";
    const a = document.createElement("p");
    a.className = "fee-note", a.textContent = n.count === 1 ? "We request 0.0002 STX from your wallet. Xtrata charges no platform fee. Confirmation may take longer at this fee; if it is not accepted, cancel and try later." : "This is the standard single-signature relay minimum, not a guarantee of fast confirmation. Xtrata charges no platform fee. Check the final fee before signing.", r.append(s, i, o, a), tt("approve").disabled = !1;
  } catch {
    t === va && (tt("fee-suggestion").textContent = "Fee suggestion unavailable. Review the fee shown by your wallet.", tt("approve").disabled = !1);
  }
}
tt("choices").addEventListener("change", () => void $p());
function zl(t) {
  var e;
  wt("REVIEW_OPEN", { count: t.length }), Ap = jt.getSession().address || "", Ep = t, tt("choices").replaceChildren();
  for (const n of t) {
    const r = document.createElement("label"), s = document.createElement("input");
    s.type = "checkbox", s.checked = !0, s.dataset.id = String(n.id), r.append(s, document.createTextNode(`${n.liked ? "Like" : "Unlike"} #${n.id} · ${((e = ss.find((i) => i.id === n.id)) == null ? void 0 : e.title) || ""}`)), tt("choices").append(r, document.createElement("br"));
  }
  tt("review-note").textContent = t.length === 1 ? "Review this song and fee, then continue to your wallet. Cancelling sends nothing." : "Up to 25 songs per transaction. Already confirmed likes are skipped on import. Cancelling sends nothing.", tt("fee-reminder").textContent = "", $p(), tt("review").showModal();
}
async function ps() {
  wt("REFRESH_START");
  const t = ++Fe;
  _n = !0, $n.clear(), Tr = void 0, Bs();
  try {
    const e = await Ti();
    if (t !== Fe) return;
    if (zt = e, wt("CONFIG_READ", { enabled: !!zt.enabled }), !zt.enabled) {
      ce("On-chain likes are not activated on this site yet. Your previous favourites remain saved in this browser; imports and new likes will become available after activation.");
      return;
    }
    const n = jt.getSession(), r = n.network === "mainnet" ? n.address : void 0, s = await fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store" });
    if (!s.ok) throw Error("Song catalogue unavailable.");
    const i = await s.json();
    if (t !== Fe) return;
    ss = i.tracks;
    const o = Xn();
    let a = "";
    if (o && r)
      try {
        const l = await Ti({ txid: o, wallet: r });
        if (t !== Fe) return;
        if (l.status === "confirmed" || l.status === "failed") {
          po.delete(Fr());
          try {
            localStorage.removeItem(Fr());
          } catch {
          }
          a = l.status;
        }
      } catch {
        wt("TRANSACTION_STATUS_UNAVAILABLE");
      }
    const c = /* @__PURE__ */ new Map();
    let u = 0;
    const f = ss.filter((l) => !Pr || String(l.id) === bo);
    for (let l = 0; l < f.length; l += 25) {
      const g = { ids: f.slice(l, l + 25).map((h) => h.id).join(","), ...r ? { wallet: r } : {} };
      try {
        let h;
        try {
          h = await Ti(g);
        } catch {
          h = await Ti(g);
        }
        if (t !== Fe || r !== (jt.getSession().network === "mainnet" ? jt.getSession().address : void 0)) return;
        if (h.contract !== zt.contract) throw Error("Contract configuration changed.");
        for (const b of h.rows) c.set(b.id, b);
        $n = new Map(c), Tr = r, Bs();
      } catch {
        u++, wt("STATE_BATCH_UNAVAILABLE", { batch: l / 25 });
      }
    }
    if (t !== Fe) return;
    if ($n = c, Tr = r, wt("STATES_READY", { tracks: c.size, connected: !!r, failedBatches: u }), ce(u ? "Some on-chain likes could not be read. Available totals are shown; Refresh retries missing songs." : a === "confirmed" ? "Transaction confirmed. On-chain likes refreshed." : a === "failed" ? "Transaction failed; your like state was not changed." : "Confirmed on-chain likes across all wallets. Your button reflects the connected wallet."), t === Fe && r === jt.getSession().address && jt.getSession().isConnected && !Xn()) {
      const l = G1([...$n].filter(([, g]) => g.liked === !0).map(([g]) => g));
      l && wt("LOCAL_FAVOURITES_CLEANED", { removed: l });
    }
  } catch (e) {
    t === Fe && ce(e instanceof Error ? e.message : "Unable to refresh.");
  } finally {
    if (t === Fe) {
      _n = !1, Bs();
      const e = jt.getSession(), n = Number(bo), r = $n.get(n);
      Pr && !ge && !Xn() && e.isConnected && e.address === Tr && r && Ah !== e.address && (Ah = e.address, zl([{ id: n, liked: !r.liked }]));
    }
  }
}
tt("connect").onclick = async () => {
  wt("CONNECT_CLICK");
  try {
    await jt.connect(), wt("CONNECT_RETURNED", { connected: jt.getSession().isConnected, network: jt.getSession().network || "unknown" }), await ps();
  } catch (t) {
    wt("CONNECT_FAILED"), ce(String(t));
  }
};
tt("disconnect").onclick = async () => {
  await jt.disconnect(), await ps();
};
tt("refresh").onclick = () => void ps();
tt("import").onclick = () => {
  wt("IMPORT_CLICK");
  try {
    const t = JSON.parse(localStorage.getItem("xtrata.radio.likes") || "[]"), e = Sp(t, new Set(ss.map((n) => n.id)), new Set([...$n].filter(([, n]) => n.liked).map(([n]) => n)));
    if (wt("IMPORT_FILTERED", { saved: Array.isArray(t) ? t.length : 0, eligible: e.length }), !e.length) {
      ce("No unimported saved songs were found in this browser.");
      return;
    }
    zl(e.slice(0, 25).map((n) => ({ id: n, liked: !0 }))), e.length > 25 && (tt("review-note").textContent = `Showing the first 25 of ${e.length} remaining favourites. After confirmation, import again to review the next batch.`);
  } catch {
    ce("Saved favourites could not be read.");
  }
};
tt("cancel").onclick = () => {
  wt("REVIEW_CANCEL"), tt("review").close();
};
tt("approve").onclick = async () => {
  if (wt("APPROVE_CLICK", { busy: ge, loading: _n, pending: !!Xn() }), ge || _n || Xn()) {
    wt("APPROVE_BLOCKED");
    return;
  }
  let t;
  const e = Ip();
  tt("fee-reminder").replaceChildren(...Array.from(tt("fee-suggestion").childNodes, (n) => n.cloneNode(!0)));
  try {
    const n = jt.getSession();
    if (n.address !== Ap || n.address !== Tr) throw Error("Wallet changed. Review these songs again.");
    const r = mp(zt.contract, e, n), s = Fr();
    ge = !0, Bs(), tt("review").close(), ce("Review the network fee in your wallet. No platform fee or token transfer is requested."), wt("WALLET_CALL_START", { count: e.length, functionName: r.functionName });
    let i = "provider-selected";
    const o = Date.now();
    t = setInterval(() => {
      wt("WALLET_STILL_WAITING", { lastStage: i, waitingMs: Date.now() - o }), ce("Still waiting for the wallet (" + i + "). Check the extension. Do not submit again while this request is pending. See the diagnostic log below.");
    }, 35e3), await new Promise((a, c) => b6({ ...r, onProgress: (u) => {
      i = u, wt("WALLET_PROGRESS", { walletStage: u }), ce(m6[u]);
    }, onFinish: (u) => {
      wt("WALLET_FINISH", { hasTransactionId: !!u.txId });
      const f = String(u.txId || "");
      if (!/^(0x)?[0-9a-f]{64}$/i.test(f)) {
        c(Error("Wallet did not return a transaction ID. Check your wallet before trying again."));
        return;
      }
      const l = f.startsWith("0x") ? f : "0x" + f;
      po.set(s, l);
      try {
        localStorage.setItem(s, l);
      } catch {
        ce("Transaction submitted: " + l + ". Save this ID; browser storage is unavailable.");
      }
      a();
    }, onCancel: () => {
      wt("WALLET_CANCEL"), c(Error("Cancelled. No on-chain change was requested."));
    }, onError: (u) => {
      wt("WALLET_ERROR"), c(u);
    } })), ce("Submitted. Your totals will change after confirmation. Use Refresh to check progress.");
  } catch (n) {
    wt("APPROVAL_FAILED"), ce(n instanceof Error ? n.message : "Wallet request failed.");
  } finally {
    t && clearInterval(t), wt("WALLET_FLOW_SETTLED"), ge = !1, Bs();
  }
};
window.addEventListener("storage", (t) => {
  !ge && (t.key === null || t.key === "xtrata.v15.1.wallet.session") && (tt("review").close(), ps());
});
window.setInterval(() => {
  !document.hidden && !ge && !_n && !tt("review").open && ps();
}, 3e4);
ps();
const S6 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", A6 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, E6 = () => A6() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, I6 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, $6 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Cp = class {
  constructor(t) {
    xA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && hd(t), this.callback(Bo(t));
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
    const t = E6(), e = I6(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return V("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, V("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), V("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, V("div", { class: "flex flex-col space-y-[10px]" }, V("div", { class: "flex items-center" }, V("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), V("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, V("span", { class: "sr-only" }, "Close popup"), V("img", { src: S6 }))), r ? V("p", null, "Select the wallet you want to connect to.") : V("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && V("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && V("div", { class: "mt-6" }, V("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), V("ul", { class: "space-y-3" }, this.installedProviders.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), V("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && V("div", { class: "mt-6" }, r ? V("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : V("div", { class: "mb-5 flex justify-between" }, V("p", { class: "text-sm font-medium" }, "Recommended wallets"), V("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, V("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), V("p", null, "What is a wallet? ", V("span", { class: "align-text-bottom text-[9px]" }, "↗")))), V("ul", { class: "space-y-3" }, n.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && V("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return tA(this);
  }
};
Cp.style = $6;
const C6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Cp
}, Symbol.toStringTag, { value: "Module" }));
